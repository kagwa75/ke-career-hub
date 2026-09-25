create table if not exists organizations (
  id text primary key,
  name text not null,
  slug text not null unique,
  website text,
  logo text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists categories (
  id text primary key,
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists jobs (
  id text primary key,
  slug text not null unique,
  title text not null,
  organization_id text references organizations(id),
  organization_name text not null,
  location text not null,
  county text,
  opportunity_type text not null,
  category_id text references categories(id),
  category_name text not null,
  field text,
  experience_level text,
  employment_type text,
  salary text,
  summary text not null,
  description text,
  responsibilities text[] not null default '{}'::text[],
  requirements text[] not null default '{}'::text[],
  qualifications text[] not null default '{}'::text[],
  application_method text not null,
  application_url text,
  application_email text,
  application_instructions text not null,
  source_name text not null,
  source_url text,
  verification_status text not null default 'unverified',
  verified_at timestamptz,
  verified_by text,
  status text not null default 'draft',
  featured boolean not null default false,
  publish_date timestamptz,
  scheduled_for timestamptz,
  deadline timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by text,
  updated_by text,
  constraint jobs_status_check check (status in ('draft', 'scheduled', 'published', 'expired', 'archived')),
  constraint jobs_verification_status_check check (verification_status in ('unverified', 'verified')),
  constraint jobs_application_method_check check (application_method in ('apply_online', 'email', 'employer_website', 'other'))
);

create index if not exists jobs_public_active_idx
  on jobs (status, featured, deadline, scheduled_for, publish_date);

create index if not exists jobs_search_idx
  on jobs using gin (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(organization_name, '') || ' ' || coalesce(location, '') || ' ' || coalesce(summary, ''))
  );

create table if not exists job_publications (
  id text primary key,
  job_id text not null references jobs(id) on delete cascade,
  platform text not null,
  format text not null,
  context text,
  content text,
  status text not null default 'published',
  metadata jsonb not null default '{}'::jsonb,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists job_publications_job_id_idx on job_publications (job_id, published_at desc);

insert into categories (id, name, slug)
values
  ('college-jobs', 'College Jobs', 'college-jobs'),
  ('county-jobs', 'County Jobs', 'county-jobs'),
  ('government-jobs', 'Government Jobs', 'government-jobs'),
  ('ngo-jobs', 'NGO Jobs', 'ngo-jobs')
on conflict (id) do nothing;
