import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  getPublishedJobByIdOrSlug,
  getPublishedOrganizationProfile,
  listCategories,
  listFeaturedPublishedJobs,
  listPublishedJobs,
  listPublishedJobsByFilters,
} from "./repository.server";

export const getPublicHomeJobs = createServerFn({ method: "GET" }).handler(async () => {
  const [jobs, featuredJobs, categories] = await Promise.all([
    listPublishedJobs(),
    listFeaturedPublishedJobs(),
    listCategories(),
  ]);
  return { jobs, featuredJobs, categories };
});

export const getPublicJobsByFilters = createServerFn({ method: "GET" })
  .validator(
    z.object({
      q: z.string().optional(),
      opportunityType: z.string().optional(),
      categoryId: z.string().optional(),
      sort: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const filters = Object.fromEntries(Object.entries(data).filter(([, item]) => item !== undefined));
    const [jobs, categories] = await Promise.all([listPublishedJobsByFilters(filters), listCategories()]);
    return { jobs, categories };
  });

export const getPublicJobDetails = createServerFn({ method: "GET" })
  .validator(z.object({ jobId: z.string() }))
  .handler(async ({ data }) => getPublishedJobByIdOrSlug(data.jobId));

export const getPublicOrganizationProfile = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string().trim().min(1) }))
  .handler(async ({ data }) => getPublishedOrganizationProfile(data.slug));
