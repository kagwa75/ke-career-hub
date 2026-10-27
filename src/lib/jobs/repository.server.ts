import "@tanstack/react-start/server-only";

import { sql } from "@/lib/db.server";
import { getDeadlineState, formatDate } from "./lifecycle";
import type {
  AdminJobFilters,
  Category,
  Job,
  JobFormInput,
  JobPosition,
  JobPublication,
  Organization,
} from "./types";

type JobRow = {
  id: string;
  slug: string | null;
  title: string;
  positions: JobPosition[] | string | null;
  organization_id: string | null;
  organization_name: string;
  organization_logo: string | null;
  organization_slug: string | null;
  location: string | null;
  county: string | null;
  opportunity_type: string;
  category_id: string | null;
  category_name: string;
  field: string | null;
  experience_level: string | null;
  employment_type: string | null;
  salary: string | null;
  summary: string | null;
  description: string | null;
  responsibilities: string[] | string | null;
  requirements: string[] | string | null;
  qualifications: string[] | string | null;
  application_method: string;
  application_url: string | null;
  application_email: string | null;
  application_phone: string | null;
  application_instructions: string;
  source_name: string;
  source_url: string | null;
  verification_status: "pending" | "verified" | "rejected";
  verified_at: string | Date | null;
  verified_by: string | null;
  status: Job["status"];
  featured: boolean;
  publish_date: string | Date | null;
  scheduled_for: string | Date | null;
  deadline: string | Date | null;
  created_at: string | Date;
  updated_at: string | Date;
};

type CountRow = {
  total: string;
};

export async function listCategories(): Promise<Category[]> {
  const rows = await sql`
    select id, name, slug, description
    from categories
    order by name asc
  `;
  return rows as Category[];
}

export async function listOrganizations(): Promise<Organization[]> {
  const rows = await sql`
    select id, name, slug, website, logo, description
    from organizations
    order by name asc
  `;
  return rows as Organization[];
}

export async function getPublishedOrganizationProfile(slug: string) {
  const rows = await sql`
    select id, name, slug, website, logo, description
    from organizations where slug = ${slug} limit 1
  `;
  const organization = (rows as Organization[])[0] ?? null;
  if (!organization) return null;

  const publishedJobs = await listPublishedJobs();
  const jobs = publishedJobs.filter((job) =>
    job.organizationId === organization.id ||
    (!job.organizationId && job.company.toLocaleLowerCase() === organization.name.toLocaleLowerCase()),
  );
  return { organization, jobs };
}

export async function saveOrganization(input: {
  id?: string | undefined;
  name: string;
  website: string | null;
  logo: string | null;
  description: string | null;
}) {
  const id = input.id || crypto.randomUUID();
  const slug = makeSlug(input.name);
  const rows = await sql`
    with saved as (
      insert into organizations (id, name, slug, website, logo, description)
      values (${id}, ${input.name}, ${slug}, ${input.website}, ${input.logo}, ${input.description})
      on conflict (id) do update set
        name = excluded.name,
        slug = excluded.slug,
        website = excluded.website,
        logo = excluded.logo,
        description = excluded.description,
        updated_at = now()
      returning id, name
    ), synced as (
      update jobs set organization_name = saved.name, updated_at = now()
      from saved where jobs.organization_id = saved.id
      returning jobs.id
    )
    select id from saved
  `;
  return (rows as { id: string }[])[0]?.id ?? id;
}

export async function ensureOrganization(name: string) {
  // Resolve by the submitted name so editing an organization's name cannot
  // leave the job linked to the previously selected organization ID.
  // Existing deployments may have organizations.id as UUID even though the
  // fresh-install migration declares it as text. UUID strings work with both.
  const id = crypto.randomUUID();
  const slug = makeSlug(name);
  const rows = await sql`
    insert into organizations (id, name, slug)
    values (${id}, ${name}, ${slug})
    on conflict (slug) do update set name = excluded.name, updated_at = now()
    returning id
  `;
  return (rows as { id: string }[])[0]?.id ?? id;
}

async function getOrganizationId(organizationId: string) {
  const rows = await sql`select id from organizations where id = ${organizationId} limit 1`;
  const id = (rows as { id: string }[])[0]?.id;
  if (!id) throw new Error("Selected organization does not exist.");
  return id;
}

export async function findPossibleJobDuplicate(candidate: {
  title: string;
  organizationName?: string | null;
  sourceUrl?: string | null;
}) {
  const titleKey = candidate.title.toLocaleLowerCase().replace(/[^a-z0-9]/g, "");
  if (!titleKey) return null;
  const sourceUrl = candidate.sourceUrl?.trim() || null;
  const organizationName = candidate.organizationName?.trim() || null;
  const rows = await sql`
    select id, title, organization_name, status, source_url
    from jobs
    where lower(regexp_replace(title, '[^[:alnum:]]+', '', 'g')) = ${titleKey}
      and (
        (${organizationName}::text is not null and lower(organization_name) = lower(${organizationName}))
        or (${sourceUrl}::text is not null and source_url = ${sourceUrl})
      )
    order by updated_at desc
    limit 1
  `;
  const row = (
    rows as {
      id: string;
      title: string;
      organization_name: string;
      status: string;
      source_url: string | null;
    }[]
  )[0];
  return row
    ? {
        id: row.id,
        title: row.title,
        organizationName: row.organization_name,
        status: row.status,
        sourceUrl: row.source_url,
      }
    : null;
}

export async function getCategoryName(categoryId: string) {
  const rows = await sql`
    select name from categories where id = ${categoryId} limit 1
  `;
  return (rows as { name: string }[])[0]?.name ?? null;
}

export async function listPublishedJobs(): Promise<Job[]> {
  const rows = await sql`
    select jobs.*, organizations.logo as organization_logo, organizations.slug as organization_slug
    from jobs left join organizations on organizations.id = jobs.organization_id
    where jobs.status = 'published'
      and (jobs.deadline is null or jobs.deadline >= now())
      and (jobs.scheduled_for is null or jobs.scheduled_for <= now())
    order by jobs.featured desc, jobs.publish_date desc nulls last, jobs.created_at desc
  `;
  return (rows as JobRow[]).map(mapJobRow);
}

export async function listFeaturedPublishedJobs(): Promise<Job[]> {
  const rows = await sql`
    select jobs.*, organizations.logo as organization_logo, organizations.slug as organization_slug
    from jobs left join organizations on organizations.id = jobs.organization_id
    where jobs.status = 'published'
      and (jobs.deadline is null or jobs.deadline >= now())
      and (jobs.scheduled_for is null or jobs.scheduled_for <= now())
      and jobs.featured = true
    order by jobs.publish_date desc nulls last, jobs.created_at desc
  `;
  return (rows as JobRow[]).map(mapJobRow);
}

export async function getPublishedJobByIdOrSlug(idOrSlug: string): Promise<Job | null> {
  const rows = await sql`
    select jobs.*, organizations.logo as organization_logo, organizations.slug as organization_slug
    from jobs left join organizations on organizations.id = jobs.organization_id
    where jobs.status = 'published'
      and (jobs.deadline is null or jobs.deadline >= now())
      and (jobs.scheduled_for is null or jobs.scheduled_for <= now())
      and (jobs.id = ${idOrSlug} or jobs.slug = ${idOrSlug})
    limit 1
  `;
  return (rows as JobRow[]).map(mapJobRow)[0] ?? null;
}

export async function listPublishedJobsByFilters(filters: AdminJobFilters): Promise<Job[]> {
  const jobs = await listPublishedJobs();
  const term = filters.q?.trim().toLowerCase();
  return jobs
    .filter((job) => {
      if (
        filters.opportunityType &&
        filters.opportunityType !== "all" &&
        job.sector !== filters.opportunityType
      )
        return false;
      if (
        filters.categoryId &&
        job.categoryId !== filters.categoryId &&
        job.category !== filters.categoryId
      )
        return false;
      if (
        term &&
        !`${job.title} ${job.positions.map((position) => position.title).join(" ")} ${job.company} ${job.location} ${job.summary}`
          .toLowerCase()
          .includes(term)
      )
        return false;
      return true;
    })
    .sort((a, b) => sortJobs(a, b, filters.sort));
}

export async function listAdminJobs(filters: AdminJobFilters = {}): Promise<Job[]> {
  const rows = await sql`
    select jobs.*, organizations.logo as organization_logo, organizations.slug as organization_slug
    from jobs left join organizations on organizations.id = jobs.organization_id
    order by jobs.updated_at desc, jobs.created_at desc
  `;
  const term = filters.q?.trim().toLowerCase();

  return (rows as JobRow[])
    .map(mapJobRow)
    .filter((job) => {
      if (
        term &&
        !`${job.title} ${job.positions.map((position) => position.title).join(" ")} ${job.company} ${job.location}`
          .toLowerCase()
          .includes(term)
      )
        return false;
      if (filters.status && filters.status !== "all" && job.status !== filters.status) return false;
      if (
        filters.categoryId &&
        filters.categoryId !== "all" &&
        job.categoryId !== filters.categoryId
      )
        return false;
      if (
        filters.opportunityType &&
        filters.opportunityType !== "all" &&
        job.opportunityType !== filters.opportunityType
      )
        return false;
      if (filters.featured === "true" && !job.featured) return false;
      if (filters.featured === "false" && job.featured) return false;
      if (
        filters.deadlineState &&
        filters.deadlineState !== "all" &&
        job.deadlineState !== filters.deadlineState
      )
        return false;
      return true;
    })
    .sort((a, b) => sortJobs(a, b, filters.sort));
}

export async function getAdminJob(id: string): Promise<Job | null> {
  const rows = await sql`
    select jobs.*, organizations.logo as organization_logo, organizations.slug as organization_slug
    from jobs left join organizations on organizations.id = jobs.organization_id
    where jobs.id = ${id} or jobs.slug = ${id} limit 1
  `;
  return (rows as JobRow[]).map(mapJobRow)[0] ?? null;
}

export async function getAdminSummary() {
  const [published, drafts, scheduled, expired, featured, archived] = await Promise.all([
    countWhere("published"),
    countWhere("draft"),
    countWhere("scheduled"),
    sql`select count(*)::text as total from jobs where deadline < now() and status <> 'archived'`,
    sql`select count(*)::text as total from jobs where featured = true and status <> 'archived'`,
    countWhere("archived"),
  ]);
  const expiringSoon = await sql`
    select count(*)::text as total
    from jobs
    where status = 'published' and deadline >= now() and deadline <= now() + interval '3 days'
  `;

  return {
    published: toCount(published),
    drafts: toCount(drafts),
    scheduled: toCount(scheduled),
    expiringSoon: toCount(expiringSoon),
    expired: toCount(expired),
    featured: toCount(featured),
    archived: toCount(archived),
  };
}

export async function upsertJob(
  input: JobFormInput,
  actorId: string,
  options: { createOrganization?: boolean } = {},
) {
  const categoryName = await getCategoryName(input.categoryId);
  if (!categoryName) {
    throw new Error("Selected category does not exist.");
  }

  const organizationId = input.organizationId
    ? await getOrganizationId(input.organizationId)
    : options.createOrganization === false ||
        input.organizationName === "Organization not specified"
      ? null
      : await ensureOrganization(input.organizationName);
  const id = input.id || crypto.randomUUID();
  const slug = input.slug || (await uniqueJobSlug(input.title, id));
  const publishedAt =
    input.status === "published"
      ? input.publishDate || new Date().toISOString()
      : input.publishDate || null;
  const responsibilities = input.responsibilities?.map((item) => item.trim()).filter(Boolean) ?? [];
  const requirements = input.requirements?.map((item) => item.trim()).filter(Boolean) ?? [];
  const qualifications = input.qualifications?.trim() || null;
  const positionsJson = input.positions ? JSON.stringify(input.positions) : null;

  await sql`
    insert into jobs (
      id, slug, title, organization_id, organization_name, location, county,
      opportunity_type, category_id, category_name, field, experience_level,
      employment_type, salary, summary, description, responsibilities, requirements,
      qualifications, application_method, application_url, application_email, application_phone,
      application_instructions, source_name, source_url, verification_status,
      verified_at, verified_by, status, featured, publish_date, scheduled_for, positions,
      deadline, created_by, updated_by
    )
    values (
      ${id}, ${slug}, ${input.title}, ${organizationId}, ${input.organizationName}, ${input.location || null}, ${input.county || null},
      ${input.opportunityType}, ${input.categoryId}, ${categoryName}, ${input.field || null}, ${input.experienceLevel || null},
      ${input.employmentType || null}, ${input.salary || null}, ${input.summary || null}, ${input.description || null},
      case when ${responsibilities.length} = 0 then null::text[] else ARRAY(SELECT jsonb_array_elements_text(${JSON.stringify(responsibilities)}::jsonb)) end,
      case when ${requirements.length} = 0 then null::text[] else ARRAY(SELECT jsonb_array_elements_text(${JSON.stringify(requirements)}::jsonb)) end,
      case when ${qualifications}::text is null then null::text[] else ARRAY[${qualifications}::text] end,
      ${input.applicationMethod}, ${input.applicationUrl || null}, ${input.applicationEmail || null}, ${input.applicationPhone || null},
      ${input.applicationInstructions}, ${input.sourceName}, ${input.sourceUrl || null}, ${input.verificationStatus},
      ${input.verifiedAt || null}, ${input.verifiedBy || null}, ${input.status}, ${input.featured}, ${publishedAt},
      ${input.scheduledFor || null}, coalesce(${positionsJson}::jsonb, '[]'::jsonb),
      ${input.deadline}, ${actorId}, ${actorId}
    )
    on conflict (id) do update set
      title = excluded.title,
      organization_id = excluded.organization_id,
      organization_name = excluded.organization_name,
      location = excluded.location,
      county = excluded.county,
      opportunity_type = excluded.opportunity_type,
      category_id = excluded.category_id,
      category_name = excluded.category_name,
      field = excluded.field,
      experience_level = excluded.experience_level,
      employment_type = excluded.employment_type,
      salary = excluded.salary,
      summary = excluded.summary,
      description = excluded.description,
      responsibilities = excluded.responsibilities,
      requirements = excluded.requirements,
      qualifications = excluded.qualifications,
      application_method = excluded.application_method,
      application_url = excluded.application_url,
      application_email = excluded.application_email,
      application_phone = excluded.application_phone,
      application_instructions = excluded.application_instructions,
      source_name = excluded.source_name,
      source_url = excluded.source_url,
      verification_status = excluded.verification_status,
      verified_at = excluded.verified_at,
      verified_by = excluded.verified_by,
      status = excluded.status,
      featured = excluded.featured,
      publish_date = excluded.publish_date,
      scheduled_for = excluded.scheduled_for,
      positions = case when ${positionsJson}::jsonb is null then jobs.positions else excluded.positions end,
      deadline = excluded.deadline,
      updated_by = excluded.updated_by,
      updated_at = now()
  `;

  return id;
}

export async function updateJobStatus(id: string, status: Job["status"], actorId: string) {
  const rows = await sql`
    update jobs
    set status = ${status},
        publish_date = case when ${status} = 'published' and publish_date is null then now() else publish_date end,
        verification_status = case when ${status} = 'published' then 'verified' else verification_status end,
        verified_at = case when ${status} = 'published' then now() else verified_at end,
        verified_by = case when ${status} = 'published' then ${actorId} else verified_by end,
        updated_by = ${actorId},
        updated_at = now()
    where id = ${id}
      and (
        ${status} <> 'published'
        or (
          verification_status in ('pending', 'verified')
          and (deadline is null or deadline > now())
          and (scheduled_for is null or scheduled_for <= now())
          and (
            (application_method in ('apply_online', 'employer_website') and application_url is not null and application_url <> '')
            or (application_method = 'email' and application_email is not null and application_email <> '')
            or application_method = 'other'
          )
        )
      )
    returning id
  `;

  if ((rows as { id: string }[]).length === 0) {
    const existing = await sql`select id from jobs where id = ${id} limit 1`;
    if ((existing as { id: string }[]).length === 0) {
      throw new Response("Job not found", { status: 404 });
    }
    if (status === "published") {
      const details = await sql`
        select verification_status, application_method, application_url, application_email,
          deadline, scheduled_for
        from jobs where id = ${id} limit 1
      `;
      const job = (details as {
        verification_status: string;
        application_method: string;
        application_url: string | null;
        application_email: string | null;
        deadline: string | Date | null;
        scheduled_for: string | Date | null;
      }[])[0];
      let reason = "This job does not meet the requirements for publishing.";
      if (job?.verification_status === "rejected") {
        reason = "This opportunity was rejected during verification and cannot be published.";
      } else if (job?.deadline && new Date(job.deadline).getTime() <= Date.now()) {
        reason = "This opportunity’s deadline has passed. Update the deadline before publishing.";
      } else if (
        job &&
        (((job.application_method === "apply_online" ||
          job.application_method === "employer_website") &&
          !job.application_url) ||
          (job.application_method === "email" && !job.application_email))
      ) {
        reason = "Add a valid application URL or email address before publishing.";
      }
      throw new Response(reason, {
        status: 409,
      });
    }
  }
}

export async function duplicateForRepost(id: string) {
  const job = await getAdminJob(id);
  if (!job) throw new Error("Job not found.");
  return job;
}

export async function listPublications(jobId: string): Promise<JobPublication[]> {
  const rows = await sql`
    select id, job_id, platform, format, context, content, status, published_at
    from job_publications
    where job_id = ${jobId}
    order by published_at desc
  `;
  return (
    rows as {
      id: string;
      job_id: string;
      platform: JobPublication["platform"];
      format: string;
      context: string | null;
      content: string | null;
      status: string;
      published_at: string;
    }[]
  ).map((row) => ({
    id: row.id,
    jobId: row.job_id,
    platform: row.platform,
    format: row.format,
    context: row.context,
    content: row.content,
    status: row.status,
    publishedAt: row.published_at,
  }));
}

export async function recordPublication(
  jobId: string,
  platform: JobPublication["platform"],
  content: string,
  context = "original",
) {
  await sql`
    insert into job_publications (id, job_id, platform, format, context, content, status, metadata)
    values (${crypto.randomUUID()}, ${jobId}, ${platform}, 'social_post', ${context}, ${content}, 'published', ${JSON.stringify({ source: "admin" })}::jsonb)
  `;
}

async function countWhere(status: string) {
  return sql`select count(*)::text as total from jobs where status = ${status}`;
}

function toCount(rows: unknown) {
  return Number((rows as CountRow[])[0]?.total ?? 0);
}

function mapJobRow(row: JobRow): Job {
  const deadlineISO = toTimestampISO(row.deadline) ?? "";
  const publishDate = toTimestampISO(row.publish_date);
  const scheduledFor = toTimestampISO(row.scheduled_for);
  const createdAt = toTimestampISO(row.created_at) ?? "";
  const updatedAt = toTimestampISO(row.updated_at) ?? createdAt;
  const verifiedAtISO = toTimestampISO(row.verified_at);
  const postedISO = publishDate ?? createdAt;
  const company = row.organization_name;
  const job = {
    id: row.id,
    slug: row.slug ?? row.id,
    title: row.title,
    positions: toJobPositions(row.positions),
    company,
    organizationLogo: row.organization_logo ?? null,
    organizationSlug: row.organization_slug ?? null,
    organizationId: row.organization_id,
    location: row.location ?? "",
    county: row.county ?? "",
    category: row.category_name,
    categoryId: row.category_id,
    type: row.employment_type || row.opportunity_type,
    opportunityType: row.opportunity_type,
    salary: row.salary || "Not disclosed",
    posted: formatDate(postedISO),
    deadline: formatDate(deadlineISO) || "Not specified",
    featured: row.featured,
    initials: initials(company),
    summary: row.summary ?? "",
    description: row.description ?? "",
    responsibilities: toStringArray(row.responsibilities),
    requirements: toStringArray(row.requirements),
    qualifications: toStringArray(row.qualifications).join("\n"),
    sector: row.opportunity_type,
    employment: row.employment_type ?? "",
    region: row.county || row.location || "Not specified",
    field: row.field ?? "",
    experience: row.experience_level ?? "",
    deadlineISO,
    postedISO,
    source: row.source_name,
    sourceUrl: row.source_url ?? "",
    applicationUrl: row.application_url ?? "",
    applicationEmail: row.application_email ?? "",
    applicationPhone: row.application_phone ?? "",
    applicationMethod: row.application_method,
    verifiedAt: formatDate(verifiedAtISO),
    ...(verifiedAtISO ? { verifiedAtISO } : {}),
    verifiedBy: row.verified_by ?? "",
    verificationStatus: row.verification_status,
    applicationInstructions: row.application_instructions,
    status: row.status,
    publishDate,
    scheduledFor,
    createdAt,
    updatedAt,
    deadlineState: "active",
  } satisfies Job;

  return { ...job, deadlineState: getDeadlineState(job) };
}

function toTimestampISO(value: string | Date | null) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function toStringArray(value: JobRow["requirements"]) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      return Array.isArray(parsed) ? parsed.map(String) : [value];
    } catch {
      return [value];
    }
  }
  return [];
}

function toJobPositions(value: JobRow["positions"]): JobPosition[] {
  let parsed: unknown = value;
  if (typeof parsed === "string") {
    try {
      parsed = JSON.parse(parsed) as unknown;
    } catch {
      return [];
    }
  }
  if (!Array.isArray(parsed)) return [];
  return parsed.filter(
    (position): position is JobPosition =>
      Boolean(position) &&
      typeof position === "object" &&
      typeof (position as JobPosition).title === "string" &&
      typeof (position as JobPosition).positionCount === "string" &&
      typeof (position as JobPosition).salary === "string" &&
      typeof (position as JobPosition).details === "string",
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 72);
}

async function uniqueJobSlug(title: string, id: string) {
  const base = makeSlug(title) || id;
  let slug = base;
  for (let index = 2; index < 50; index += 1) {
    const rows = await sql`select id from jobs where slug = ${slug} and id <> ${id} limit 1`;
    if ((rows as { id: string }[]).length === 0) return slug;
    slug = `${base}-${index}`;
  }
  return `${base}-${crypto.randomUUID().slice(0, 8)}`;
}

function sortJobs(a: Job, b: Job, sort = "newest") {
  if (sort === "oldest") return a.createdAt.localeCompare(b.createdAt);
  if (sort === "deadline") {
    if (!a.deadlineISO) return b.deadlineISO ? 1 : 0;
    if (!b.deadlineISO) return -1;
    return a.deadlineISO.localeCompare(b.deadlineISO);
  }
  if (sort === "updated") return b.updatedAt.localeCompare(a.updatedAt);
  return b.createdAt.localeCompare(a.createdAt);
}
