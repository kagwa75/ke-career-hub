import { z } from "zod";
import type { Category } from "./types";

export const quickImportTextSchema = z
  .string()
  .trim()
  .min(10, "Paste at least 10 characters.")
  .max(100_000, "Your import is too large. Please split it into smaller batches.");

const nullableText = z.string().trim().max(20_000).nullable();
const textList = z.array(z.string().trim().min(1).max(4_000)).max(100);
const extractedPositionSchema = z
  .object({
    title: z.string().trim().min(1).max(300),
    position_count: z.string().trim().max(100).nullable(),
    salary: z.string().trim().max(200).nullable(),
    details: z.string().trim().max(8_000).nullable(),
  })
  .strict();

export const extractedOpportunitySchema = z
  .object({
    title: nullableText,
    organization_name: nullableText,
    location: nullableText,
    county: nullableText,
    opportunity_type: nullableText,
    category_name: nullableText,
    field: nullableText,
    experience_level: nullableText,
    employment_type: nullableText,
    summary: nullableText,
    description: nullableText,
    responsibilities: textList,
    requirements: textList,
    qualifications: textList,
    positions: z.array(extractedPositionSchema).max(100).default([]),
    application_method: nullableText,
    application_url: nullableText,
    application_email: nullableText,
    application_phone: nullableText,
    application_instructions: nullableText,
    deadline: nullableText,
    source_name: nullableText,
    source_url: nullableText,
    missing_information: z.array(z.string().trim().min(1).max(300)).max(40),
    needs_review: z.boolean(),
  })
  .strict();

export const extractedOpportunitiesSchema = z
  .object({
    opportunities: z.array(extractedOpportunitySchema).min(1).max(50),
  })
  .strict();

export type ExtractedOpportunity = z.infer<typeof extractedOpportunitySchema>;

export function matchExistingCategory(name: string | null, categories: Category[]) {
  if (!name) return null;
  const normalized = name.trim().toLocaleLowerCase();
  return (
    categories.find(
      (category) =>
        category.name.toLocaleLowerCase() === normalized ||
        category.slug.toLocaleLowerCase() === normalized,
    ) ?? null
  );
}

const nullableString = { anyOf: [{ type: "string" }, { type: "null" }] };
const list = { type: "array", items: { type: "string" } };

export const extractionJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["opportunities"],
  properties: {
    opportunities: {
      type: "array",
      minItems: 1,
      maxItems: 50,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "title",
          "organization_name",
          "location",
          "county",
          "opportunity_type",
          "category_name",
          "field",
          "experience_level",
          "employment_type",
          "summary",
          "description",
          "responsibilities",
          "requirements",
          "qualifications",
          "positions",
          "application_method",
          "application_url",
          "application_email",
          "application_phone",
          "application_instructions",
          "deadline",
          "source_name",
          "source_url",
          "missing_information",
          "needs_review",
        ],
        properties: {
          title: nullableString,
          organization_name: nullableString,
          location: nullableString,
          county: nullableString,
          opportunity_type: nullableString,
          category_name: nullableString,
          field: nullableString,
          experience_level: nullableString,
          employment_type: nullableString,
          summary: nullableString,
          description: nullableString,
          responsibilities: list,
          requirements: list,
          qualifications: list,
          positions: {
            type: "array",
            maxItems: 100,
            items: {
              type: "object",
              additionalProperties: false,
              required: ["title", "position_count", "salary", "details"],
              properties: {
                title: { type: "string", maxLength: 300 },
                position_count: { anyOf: [{ type: "string", maxLength: 100 }, { type: "null" }] },
                salary: { anyOf: [{ type: "string", maxLength: 200 }, { type: "null" }] },
                details: { anyOf: [{ type: "string", maxLength: 8_000 }, { type: "null" }] },
              },
            },
          },
          application_method: nullableString,
          application_url: nullableString,
          application_email: nullableString,
          application_phone: nullableString,
          application_instructions: nullableString,
          deadline: nullableString,
          source_name: nullableString,
          source_url: nullableString,
          missing_information: { type: "array", items: { type: "string" } },
          needs_review: { type: "boolean" },
        },
      },
    },
  },
} as const;

export function normalizeExtractedOpportunity(
  opportunity: ExtractedOpportunity,
): ExtractedOpportunity {
  const missing = [...opportunity.missing_information];
  const deadline = normalizeDeadline(opportunity.deadline);
  const warnOnce = (warning: string, pattern: RegExp) => {
    if (!missing.some((item) => pattern.test(item))) missing.push(warning);
  };
  if (opportunity.deadline && !deadline && !missing.some((item) => /deadline/i.test(item))) {
    missing.push("Deadline could not be interpreted confidently.");
  }
  if (!deadline) warnOnce("Deadline not specified.", /deadline/i);
  if (!opportunity.organization_name) warnOnce("Organization not specified.", /organization/i);
  if (!opportunity.location) warnOnce("Location not specified.", /location/i);
  if (!opportunity.summary) warnOnce("Summary not provided.", /summary/i);
  if (!opportunity.description) warnOnce("Description not provided.", /description/i);
  if (!opportunity.responsibilities.length)
    warnOnce("Responsibilities not provided.", /responsibilit/i);
  if (!opportunity.requirements.length) warnOnce("Requirements not provided.", /requirement/i);
  if (!opportunity.qualifications.length)
    warnOnce("Qualifications not provided.", /qualification/i);
  if (!opportunity.category_name) warnOnce("Category needs review.", /category/i);

  const applicationUrl = normalizeHttpUrl(opportunity.application_url);
  const sourceUrl = normalizeHttpUrl(opportunity.source_url);
  if (opportunity.source_url && !sourceUrl)
    warnOnce("Source URL could not be validated.", /source url/i);
  const email = opportunity.application_email?.trim() || null;
  const phone = opportunity.application_phone?.trim() || null;
  const method = opportunity.application_method?.trim() || null;
  const missingRoute = !applicationUrl && !validEmail(email) && !validPhone(phone);
  if (!method) warnOnce("Application method not specified.", /application method/i);
  if (missingRoute)
    warnOnce(
      "Application URL, email, or phone missing.",
      /application.*(url|contact|email|phone)/i,
    );

  const result: ExtractedOpportunity = {
    ...opportunity,
    title: clean(opportunity.title),
    organization_name: clean(opportunity.organization_name),
    location: clean(opportunity.location),
    county: clean(opportunity.county),
    opportunity_type: clean(opportunity.opportunity_type),
    category_name: clean(opportunity.category_name),
    field: clean(opportunity.field),
    experience_level: clean(opportunity.experience_level),
    employment_type: clean(opportunity.employment_type),
    summary: clean(opportunity.summary),
    description: clean(opportunity.description),
    application_method: method,
    application_url: applicationUrl,
    application_email: validEmail(email) ? email : null,
    application_phone: validPhone(phone) ? phone : null,
    application_instructions: clean(opportunity.application_instructions),
    deadline,
    source_name: clean(opportunity.source_name),
    source_url: sourceUrl,
    missing_information: missing,
    needs_review:
      opportunity.needs_review ||
      missing.length > 0 ||
      !opportunity.title ||
      !opportunity.organization_name,
  };

  for (const key of ["responsibilities", "requirements", "qualifications"] as const) {
    result[key] = opportunity[key].map((item) => item.trim()).filter(Boolean);
  }
  result.positions = (opportunity.positions ?? []).map((position) => ({
    ...position,
    title: position.title.trim(),
    position_count: clean(position.position_count),
    salary: clean(position.salary),
    details: clean(position.details),
  }));
  return result;
}

function clean(value: string | null) {
  const cleaned = value?.replace(/[\t ]+/g, " ").trim();
  return cleaned || null;
}

function normalizeDeadline(value: string | null) {
  if (!value) return null;
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (iso) {
    const date = new Date(`${iso[1]}-${iso[2]}-${iso[3]}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value.trim()
      ? value.trim()
      : null;
  }
  if (/^\d{1,2}[/-]\d{1,2}[/-]\d{2,4}$/.test(value.trim())) return null;
  const textualDate =
    /^(?:(\d{1,2})(?:st|nd|rd|th)?\s+([a-z]+)|([a-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?),?\s+(\d{4})$/i.exec(
      value.trim(),
    );
  if (!textualDate) return null;
  const day = Number(textualDate[1] ?? textualDate[4]);
  const monthName = (textualDate[2] ?? textualDate[3] ?? "").toLowerCase();
  const year = Number(textualDate[5]);
  const monthNames = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];
  const matchingMonths = monthNames.flatMap((name, index) =>
    name === monthName || (monthName.length >= 3 && name.startsWith(monthName)) ? [index] : [],
  );
  const month = matchingMonths.length === 1 ? (matchingMonths[0] ?? -1) : -1;
  if (month < 0 || day < 1 || day > new Date(Date.UTC(year, month + 1, 0)).getUTCDate())
    return null;
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function normalizeHttpUrl(value: string | null) {
  const url = value?.trim() || "";
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol) ? url : null;
  } catch {
    return null;
  }
}

function validEmail(value: string | null): boolean {
  return Boolean(value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
}

function validPhone(value: string | null): boolean {
  return Boolean(value && /^[+\d][\d\s().-]{6,19}$/.test(value));
}
