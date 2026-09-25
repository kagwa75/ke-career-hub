import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireAdminSession } from "@/lib/auth.server";
import {
  getAdminJob,
  getAdminSummary,
  listAdminJobs,
  listCategories,
  listOrganizations,
  listPublications,
  recordPublication,
  updateJobStatus,
  upsertJob,
} from "./repository.server";
import { generateSocialPosts } from "./social";
import { jobFormSchema } from "./validation";
import { jobStatuses } from "./types";

const filtersSchema = z.object({
  q: z.string().optional(),
  status: z.string().optional(),
  categoryId: z.string().optional(),
  opportunityType: z.string().optional(),
  featured: z.string().optional(),
  deadlineState: z.string().optional(),
  sort: z.string().optional(),
});

export const getAdminDashboard = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdminSession();
  const [summary, recentJobs] = await Promise.all([getAdminSummary(), listAdminJobs({ sort: "updated" })]);
  return { summary, recentJobs: recentJobs.slice(0, 8) };
});

export const getAdminJobs = createServerFn({ method: "GET" })
  .validator(filtersSchema)
  .handler(async ({ data }) => {
    await requireAdminSession();
    const filters = cleanUndefined(data);
    const [jobs, categories, organizations] = await Promise.all([
      listAdminJobs(filters),
      listCategories(),
      listOrganizations(),
    ]);
    return { jobs, categories, organizations };
  });

export const getAdminJobEditor = createServerFn({ method: "GET" })
  .validator(z.object({ jobId: z.string().optional() }))
  .handler(async ({ data }) => {
    await requireAdminSession();
    const [job, categories, organizations] = await Promise.all([
      data.jobId ? getAdminJob(data.jobId) : Promise.resolve(null),
      listCategories(),
      listOrganizations(),
    ]);
    const publications = job ? await listPublications(job.id) : [];
    return { job, categories, organizations, publications };
  });

export const saveAdminJob = createServerFn({ method: "POST" })
  .validator(jobFormSchema)
  .handler(async ({ data }) => {
    const session = await requireAdminSession();
    const jobId = await upsertJob(cleanUndefined(data), session.userId);
    return { ok: true, jobId };
  });

export const setAdminJobStatus = createServerFn({ method: "POST" })
  .validator(z.object({ jobId: z.string(), status: z.enum(jobStatuses) }))
  .handler(async ({ data }) => {
    const session = await requireAdminSession();
    await updateJobStatus(data.jobId, data.status, session.userId);
    return { ok: true };
  });

export const getAdminSocialPosts = createServerFn({ method: "GET" })
  .validator(z.object({ jobId: z.string() }))
  .handler(async ({ data }) => {
    await requireAdminSession();
    const job = await getAdminJob(data.jobId);
    if (!job) throw new Response("Job not found", { status: 404 });
    return { job, posts: generateSocialPosts(job), publications: await listPublications(job.id) };
  });

export const recordAdminPublication = createServerFn({ method: "POST" })
  .validator(
    z.object({
      jobId: z.string(),
      platform: z.enum(["website", "whatsapp", "telegram", "facebook"]),
      content: z.string(),
      context: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    await requireAdminSession();
    await recordPublication(data.jobId, data.platform, data.content, data.context);
    return { ok: true };
  });

function cleanUndefined<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined)) as T;
}
