import { z } from "zod";
import { jobStatuses } from "./types";

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .transform((value) => value || "")
  .refine((value) => !value || /^https?:\/\/.+/i.test(value), "Enter a valid http(s) URL.");

const optionalEmail = z
  .string()
  .trim()
  .optional()
  .transform((value) => value || "")
  .refine((value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), "Enter a valid email address.");

const optionalDeadline = z
  .union([z.string(), z.null()])
  .optional()
  .transform((value) => (typeof value === "string" ? value.trim() || null : null));

const nonEmptyList = z.array(z.string().trim().min(1)).min(1);

export const jobFormSchema = z
  .object({
    id: z.string().trim().optional(),
    slug: z.string().trim().optional(),
    title: z.string().trim().min(3, "Add a job title."),
    organizationId: z.string().trim().optional(),
    organizationName: z.string().trim().min(2, "Select or add an organization."),
    location: z.string().trim().min(2, "Add a location."),
    county: z.string().trim().optional(),
    opportunityType: z.string().trim().min(1, "Choose an opportunity type."),
    categoryId: z.string().trim().min(1, "Choose a category."),
    field: z.string().trim().optional(),
    experienceLevel: z.string().trim().optional(),
    employmentType: z.string().trim().optional(),
    salary: z.string().trim().optional(),
    summary: z.string().trim().min(20, "Add a useful summary."),
    description: z.string().trim().optional(),
    responsibilities: nonEmptyList,
    requirements: nonEmptyList,
    qualifications: z.string().trim().optional(),
    applicationMethod: z.enum(["apply_online", "email", "employer_website", "other"]),
    applicationUrl: optionalUrl,
    applicationEmail: optionalEmail,
    applicationInstructions: z.string().trim().min(10, "Add application instructions."),
    sourceName: z.string().trim().min(2, "Add the source name."),
    sourceUrl: optionalUrl,
    verificationStatus: z.enum(["unverified", "verified"]),
    verifiedAt: z.string().trim().optional(),
    verifiedBy: z.string().trim().optional(),
    status: z.enum(jobStatuses),
    featured: z.boolean(),
    publishDate: z.string().trim().optional(),
    scheduledFor: z.string().trim().optional(),
    deadline: optionalDeadline,
  })
  .superRefine((data, ctx) => {
    const deadline = data.deadline ? new Date(data.deadline) : null;
    if (deadline && Number.isNaN(deadline.getTime())) {
      ctx.addIssue({ code: "custom", path: ["deadline"], message: "Add a valid deadline." });
    }

    if ((data.applicationMethod === "apply_online" || data.applicationMethod === "employer_website") && !data.applicationUrl) {
      ctx.addIssue({ code: "custom", path: ["applicationUrl"], message: "This application method requires a URL." });
    }

    if (data.applicationMethod === "email" && !data.applicationEmail) {
      ctx.addIssue({ code: "custom", path: ["applicationEmail"], message: "Email applications require an email address." });
    }

    if (data.status === "scheduled") {
      if (!data.scheduledFor || Number.isNaN(new Date(data.scheduledFor).getTime())) {
        ctx.addIssue({ code: "custom", path: ["scheduledFor"], message: "Scheduled jobs need a valid scheduled time." });
      } else if (new Date(data.scheduledFor).getTime() <= Date.now()) {
        ctx.addIssue({ code: "custom", path: ["scheduledFor"], message: "Schedule time must be in the future." });
      }
    }

    if (data.status === "published" && data.verificationStatus !== "verified") {
      ctx.addIssue({ code: "custom", path: ["verificationStatus"], message: "Verify the opportunity before publishing." });
    }
  });

export type JobValidationResult =
  | { ok: true }
  | { ok: false; fieldErrors: Record<string, string[]>; formErrors: string[] };

export function validateJobInput(input: unknown): JobValidationResult {
  const result = jobFormSchema.safeParse(input);
  if (result.success) return { ok: true };
  const flattened = result.error.flatten();
  return { ok: false, fieldErrors: flattened.fieldErrors, formErrors: flattened.formErrors };
}
