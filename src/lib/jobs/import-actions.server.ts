import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireAdminSession } from "@/lib/auth.server";
import { extractOpportunities } from "@/lib/nvidia-nim.server";
import { opportunityTypes } from "./types";
import { matchExistingCategory, quickImportTextSchema } from "./import-schema";
import {
  findPossibleJobDuplicate,
  listCategories,
  listOrganizations,
  upsertJob,
} from "./repository.server";

const MAX_RAW_TEXT_LENGTH = 100_000;
const MAX_OPPORTUNITIES = 50;

const extractInput = z.object({ rawText: quickImportTextSchema });

const reviewedOpportunity = z.object({
  importId: z.string().min(1).max(80),
  title: z.string().trim().max(300),
  organizationName: z.string().trim().max(300),
  organizationId: z.string().max(100).nullable(),
  createOrganization: z.boolean(),
  location: z.string().trim().max(300),
  county: z.string().trim().max(200),
  opportunityType: z.string().trim().max(100),
  categoryId: z.string().max(100),
  field: z.string().trim().max(200),
  experienceLevel: z.string().trim().max(200),
  employmentType: z.string().trim().max(200),
  summary: z.string().trim().max(20_000),
  description: z.string().trim().max(20_000),
  responsibilities: z.array(z.string().trim().max(4_000)).max(100),
  requirements: z.array(z.string().trim().max(4_000)).max(100),
  qualifications: z.array(z.string().trim().max(4_000)).max(100),
  positions: z
    .array(
      z.object({
        title: z.string().trim().min(1).max(300),
        positionCount: z.string().trim().max(100),
        salary: z.string().trim().max(200),
        details: z.string().trim().max(8_000),
      }),
    )
    .max(100),
  applicationMethod: z.string().trim().max(100),
  applicationUrl: z.string().trim().max(2_000),
  applicationEmail: z.string().trim().max(320),
  applicationPhone: z.string().trim().max(100),
  applicationInstructions: z.string().trim().max(20_000),
  deadline: z.string().trim().max(100),
  sourceName: z.string().trim().max(300),
  sourceUrl: z.string().trim().max(2_000),
  allowDuplicate: z.boolean(),
});

const saveInput = z.object({
  opportunities: z.array(reviewedOpportunity).min(1).max(MAX_OPPORTUNITIES),
});

export const getQuickImportOptions = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdminSession();
  const [categories, organizations] = await Promise.all([listCategories(), listOrganizations()]);
  return { categories, organizations };
});

export const extractQuickImport = createServerFn({ method: "POST" })
  .validator(extractInput)
  .handler(async ({ data }) => {
    await requireAdminSession();
    if (data.rawText.length > MAX_RAW_TEXT_LENGTH)
      throw new Error("Your import is too large. Please split it into smaller batches.");

    const categories = await listCategories();
    const organizations = await listOrganizations();
    const extracted = await extractOpportunities(data.rawText, categories);
    if (extracted.length > MAX_OPPORTUNITIES)
      throw new Error(
        "This import contains more than 50 opportunities. Please split it into smaller batches.",
      );

    return Promise.all(
      extracted.map(async (opportunity) => {
        // Experience level is a short label in the jobs table. Never cut a
        // longer model response mid-sentence; leave it for admin review.
        if (opportunity.experience_level && opportunity.experience_level.length > 200)
          opportunity.experience_level = null;
        const category = matchExistingCategory(opportunity.category_name, categories);
        const missing = [...opportunity.missing_information];
        if (
          opportunity.category_name &&
          !category &&
          !missing.some((item) => /category/i.test(item))
        )
          missing.push("Category needs review.");
        if (!category && !missing.some((item) => /category/i.test(item)))
          missing.push("Category needs review.");
        const duplicate = opportunity.title
          ? await findPossibleJobDuplicate({
              title: opportunity.title,
              organizationName: opportunity.organization_name,
              sourceUrl: opportunity.source_url,
            })
          : null;
        if (duplicate && !missing.some((item) => /duplicate/i.test(item)))
          missing.push("Possible duplicate found.");

        const organizationMatch = opportunity.organization_name
          ? organizations.find(
              (item) =>
                item.name.toLocaleLowerCase() ===
                opportunity.organization_name?.toLocaleLowerCase(),
            )
          : undefined;
        return {
          ...opportunity,
          category_name: category?.name ?? null,
          category_id: category?.id ?? null,
          organization_id: organizationMatch?.id ?? null,
          duplicate,
          missing_information: missing,
          needs_review: opportunity.needs_review || missing.length > 0 || !category,
        };
      }),
    );
  });

export const saveQuickImportDrafts = createServerFn({ method: "POST" })
  .validator(saveInput)
  .handler(async ({ data }) => {
    const session = await requireAdminSession();
    const results: {
      importId: string;
      ok: boolean;
      jobId?: string;
      error?: string;
      duplicate?: NonNullable<Awaited<ReturnType<typeof findPossibleJobDuplicate>>>;
    }[] = [];

    for (const opportunity of data.opportunities) {
      try {
        if (!opportunity.title || opportunity.title.length < 3)
          throw new ImportSaveError("Add a job title before saving.");
        if (!opportunity.categoryId) throw new ImportSaveError("Select a category before saving.");
        if (!opportunity.allowDuplicate) {
          const duplicate = await findPossibleJobDuplicate({
            title: opportunity.title,
            organizationName: opportunity.organizationName,
            sourceUrl: opportunity.sourceUrl,
          });
          if (duplicate) throw new DuplicateImportSaveError(duplicate);
        }
        if (opportunity.applicationUrl && !isHttpUrl(opportunity.applicationUrl))
          throw new ImportSaveError("Enter a valid application URL.");
        if (
          opportunity.applicationEmail &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(opportunity.applicationEmail)
        )
          throw new ImportSaveError("Enter a valid application email.");
        if (
          opportunity.applicationPhone &&
          !/^[+\d][\d\s().-]{6,19}$/.test(opportunity.applicationPhone)
        )
          throw new ImportSaveError("Enter a valid application phone number.");
        if (opportunity.sourceUrl && !isHttpUrl(opportunity.sourceUrl))
          throw new ImportSaveError("Enter a valid source URL.");
        if (opportunity.deadline && Number.isNaN(new Date(opportunity.deadline).getTime()))
          throw new ImportSaveError("Enter a valid deadline or leave it blank.");

        const organizationName = opportunity.organizationName || "Organization not specified";
        const applicationInstructions =
          opportunity.applicationInstructions ||
          "Application instructions were not included in source; verify before publication.";
        const applicationMethod = resolveApplicationMethod(
          opportunity.applicationMethod,
          opportunity.applicationEmail,
          opportunity.applicationUrl,
        );
        const jobId = await upsertJob(
          {
            title: opportunity.title,
            organizationName,
            organizationId: opportunity.organizationId || undefined,
            location: opportunity.location || null,
            county: opportunity.county || undefined,
            opportunityType: resolveOpportunityType(opportunity.opportunityType),
            categoryId: opportunity.categoryId,
            field: opportunity.field || undefined,
            experienceLevel: opportunity.experienceLevel || undefined,
            employmentType: opportunity.employmentType || undefined,
            summary: opportunity.summary || null,
            description: opportunity.description || undefined,
            responsibilities: opportunity.responsibilities.filter(Boolean),
            requirements: opportunity.requirements.filter(Boolean),
            qualifications: opportunity.qualifications.filter(Boolean).join("\n"),
            positions: opportunity.positions,
            applicationMethod,
            applicationUrl: opportunity.applicationUrl || undefined,
            applicationEmail: opportunity.applicationEmail || undefined,
            applicationPhone: opportunity.applicationPhone || undefined,
            applicationInstructions,
            sourceName: opportunity.sourceName || "Admin-supplied source text",
            sourceUrl: opportunity.sourceUrl || undefined,
            verificationStatus: "pending",
            status: "draft",
            featured: false,
            deadline: opportunity.deadline || null,
          },
          session.userId,
          { createOrganization: opportunity.createOrganization },
        );

        results.push({ importId: opportunity.importId, ok: true, jobId });
      } catch (error) {
        if (!(error instanceof ImportSaveError)) {
          const databaseError = getSafeDatabaseError(error);
          console.error("Quick import draft insert failed", databaseError);
        }
        results.push({
          importId: opportunity.importId,
          ok: false,
          ...(error instanceof DuplicateImportSaveError ? { duplicate: error.duplicate } : {}),
          error: error instanceof ImportSaveError ? error.message : messageForDraftSaveError(error),
        });
      }
    }

    return { results, savedCount: results.filter((item) => item.ok).length };
  });

class ImportSaveError extends Error {}

class DuplicateImportSaveError extends ImportSaveError {
  constructor(
    public readonly duplicate: NonNullable<Awaited<ReturnType<typeof findPossibleJobDuplicate>>>,
  ) {
    super(
      `Possible duplicate: “${duplicate.title}” at ${duplicate.organizationName}. Confirm that you want to save it.`,
    );
  }
}

function getSafeDatabaseError(error: unknown) {
  if (!error || typeof error !== "object") return { code: "unknown" };
  const details = error as {
    code?: unknown;
    table?: unknown;
    column?: unknown;
    constraint?: unknown;
    message?: unknown;
  };
  const safeText = (value: unknown) =>
    typeof value === "string" && /^[a-z0-9_.-]{1,100}$/i.test(value) ? value : undefined;
  const missingColumn = parseMissingColumn(details.message);
  return {
    code: safeText(details.code) ?? "unknown",
    ...((safeText(details.table) ?? safeText(missingColumn?.table))
      ? { table: safeText(details.table) ?? safeText(missingColumn?.table) }
      : {}),
    ...((safeText(details.column) ?? safeText(missingColumn?.column))
      ? { column: safeText(details.column) ?? safeText(missingColumn?.column) }
      : {}),
    ...(safeText(details.constraint) ? { constraint: safeText(details.constraint) } : {}),
  };
}

function parseMissingColumn(message: unknown) {
  if (typeof message !== "string") return null;
  const relationForm =
    /column\s+["']?([a-z_][a-z0-9_]*)["']?\s+of relation\s+["']?([a-z_][a-z0-9_]*)["']?\s+does not exist/i.exec(
      message,
    );
  if (relationForm) return { column: relationForm[1], table: relationForm[2] };
  const qualifiedForm =
    /column\s+["']?(?:[a-z_][a-z0-9_]*\.)?([a-z_][a-z0-9_]*)["']?\s+does not exist/i.exec(message);
  return qualifiedForm ? { column: qualifiedForm[1] } : null;
}

function messageForDraftSaveError(error: unknown) {
  if (!error || typeof error !== "object")
    return "This opportunity could not be saved. Check the server log for the database error code.";
  const details = error as { code?: unknown; column?: unknown; message?: unknown };
  if (details.code === "23502") {
    const column = typeof details.column === "string" ? ` (${details.column})` : "";
    return `The Neon schema still requires a field that this source left blank${column}. Apply the Quick Import database migration and retry.`;
  }
  if (details.code === "22P02" || details.code === "42804")
    return "A Neon column type does not match the Quick Import data. Check the server log for the affected column and confirm the database migrations were applied.";
  if (details.code === "42703") {
    const missingColumn = parseMissingColumn(details.message);
    if (missingColumn)
      return `The live Neon schema is missing the “${missingColumn.column}” column${missingColumn.table ? ` on “${missingColumn.table}”` : ""}. The database schema needs to be aligned with the app before saving.`;
    return "The live Neon schema is missing a column expected by Quick Import. Check the server log for the table and column, then align the database schema.";
  }
  return "This opportunity could not be saved. Check the server log for the database error code and affected column.";
}

function resolveOpportunityType(value: string) {
  const normalized = value.trim().toLocaleLowerCase();
  return (
    opportunityTypes.find(
      (item) => item.slug === normalized || item.label.toLocaleLowerCase() === normalized,
    )?.slug ?? "job"
  );
}

function resolveApplicationMethod(method: string, email: string, url: string) {
  const normalized = method.toLocaleLowerCase();
  if (email || normalized.includes("email")) return "email";
  if (url && (normalized.includes("employer") || normalized.includes("website")))
    return "employer_website";
  if (url) return "apply_online";
  return "other";
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
