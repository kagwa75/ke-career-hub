import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  MessageCircle,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/job-card";
import {
  careerFields,
  deadlineOptions,
  employmentTypes,
  experienceLevels,
  locationOptions,
  opportunityTypes,
  WHATSAPP_URL,
  type Job,
} from "@/lib/jobs/types";
import { getPublicJobsByFilters } from "@/lib/jobs/public-actions.server";

type CategorySearch = {
  type: string;
  q: string;
  location: string;
  employment: string;
  field: string;
  experience: string;
  deadline: string;
  sort: string;
  page: number;
};

const str = (value: unknown, fallback = "") => (typeof value === "string" ? value : fallback);

export const Route = createFileRoute("/categories")({
  validateSearch: (search: Record<string, unknown>): CategorySearch => ({
    type: str(search["type"], "all"),
    q: str(search["q"]),
    location: str(search["location"]),
    employment: str(search["employment"]),
    field: str(search["field"]),
    experience: str(search["experience"]),
    deadline: str(search["deadline"]),
    sort: str(search["sort"], "newest"),
    page: Number(search["page"]) > 0 ? Math.floor(Number(search["page"])) : 1,
  }),
  head: () => ({
    meta: [
      { title: "Browse Job Categories in Kenya | Get Hired KE" },
      {
        name: "description",
        content:
          "Filter government, county, NGO, private sector, remote, internship, graduate and scholarship opportunities across Kenya by location, field and deadline.",
      },
      { property: "og:title", content: "Browse Job Categories in Kenya | Get Hired KE" },
      {
        property: "og:description",
        content:
          "Discover and filter fresh Kenyan opportunities by type, location, field, experience and deadline.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) =>
    getPublicJobsByFilters({
      data: {
        q: deps.q,
        opportunityType: deps.type,
        sort: deps.sort,
      },
    }),
  component: CategoriesPage,
});

const PAGE_SIZE = 9;

function daysToDeadline(job: Job) {
  if (!job.deadlineISO) return Number.POSITIVE_INFINITY;
  return Math.round(
    (new Date(job.deadlineISO).getTime() - Date.now()) / 86_400_000,
  );
}

function CategoriesPage() {
  const loaderData = Route.useLoaderData();
  const jobs = loaderData.jobs;
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/categories" });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [keyword, setKeyword] = useState(search.q);

  const update = (patch: Partial<CategorySearch>) =>
    navigate({ search: { ...search, ...patch, page: patch.page ?? 1 } });

  const activeType =
    opportunityTypes.find((item) => item.slug === search.type) ?? opportunityTypes[0]!;

  const filtered = useMemo(() => {
    const term = search.q.toLowerCase().trim();
    const list = jobs.filter((job) => {
      if (search.type !== "all" && job.sector !== search.type) return false;
      if (term && !`${job.title} ${job.company} ${job.summary}`.toLowerCase().includes(term))
        return false;
      if (search.location === "Remote") {
        if (job.region !== "Remote" && job.employment !== "Remote") return false;
      } else if (search.location && job.region !== search.location) return false;
      if (search.employment && job.employment !== search.employment) return false;
      if (search.field && job.field !== search.field) return false;
      if (search.experience && job.experience !== search.experience) return false;
      if (search.deadline) {
        const days = daysToDeadline(job);
        if (days < 0) return false;
        if (search.deadline === "Closing soon" && days > 3) return false;
        if (search.deadline === "This week" && days > 7) return false;
        if (search.deadline === "This month" && days > 30) return false;
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (search.sort === "deadline") return daysToDeadline(a) - daysToDeadline(b);
      if (search.sort === "featured") return Number(b.featured) - Number(a.featured);
      return b.postedISO.localeCompare(a.postedISO);
    });
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, search.page), totalPages);
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activeFilters = [
    { key: "location" as const, value: search.location },
    { key: "employment" as const, value: search.employment },
    { key: "field" as const, value: search.field },
    { key: "experience" as const, value: search.experience },
    { key: "deadline" as const, value: search.deadline },
    { key: "q" as const, value: search.q },
  ].filter((item) => item.value);

  const clearAll = () => {
    setKeyword("");
    navigate({
      search: {
        type: search.type,
        q: "",
        location: "",
        employment: "",
        field: "",
        experience: "",
        deadline: "",
        sort: "newest",
        page: 1,
      },
    });
  };

  const filterPanel = (
    <div className="flex flex-col gap-6">
      <FilterGroup
        label="Location"
        options={[...locationOptions]}
        value={search.location}
        onChange={(value) => update({ location: value })}
      />
      <FilterGroup
        label="Employment type"
        options={[...employmentTypes]}
        value={search.employment}
        onChange={(value) => update({ employment: value })}
      />
      <FilterGroup
        label="Career field"
        options={[...careerFields]}
        value={search.field}
        onChange={(value) => update({ field: value })}
      />
      <FilterGroup
        label="Experience level"
        options={[...experienceLevels]}
        value={search.experience}
        onChange={(value) => update({ experience: value })}
      />
      <FilterGroup
        label="Application deadline"
        options={[...deadlineOptions]}
        value={search.deadline}
        onChange={(value) => update({ deadline: value })}
      />
    </div>
  );

  return (
    <>
      <section className="border-b border-border bg-hero">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mb-5 flex size-12 items-center justify-center rounded-md bg-primary-soft text-primary">
            <LayoutGrid className="size-6" />
          </div>
          <p className="text-xs font-bold uppercase tracking-wide text-primary">
            Browse categories
          </p>
          <h1 className="mt-2 max-w-3xl font-heading text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
            {activeType.heading}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            Filter by location, field, experience and deadline to find the opportunities that fit
            you, then apply directly.
          </p>

          <form
            className="mt-8 grid max-w-3xl gap-2 rounded-lg border border-border bg-card p-2 shadow-search sm:grid-cols-[1fr_auto]"
            onSubmit={(event) => {
              event.preventDefault();
              update({ q: keyword });
            }}
          >
            <label className="flex h-13 items-center gap-3 rounded-md px-3 focus-within:bg-surface">
              <Search className="size-5 text-primary" />
              <span className="sr-only">Search opportunities</span>
              <input
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Search by role, employer or keyword"
              />
            </label>
            <Button type="submit" size="lg">
              <Search className="size-4" />
              Search
            </Button>
          </form>

          <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Opportunity types">
            {opportunityTypes.map((item) => (
              <Link
                key={item.slug}
                to="/categories"
                search={{ ...search, type: item.slug, page: 1 }}
                role="tab"
                aria-selected={item.slug === search.type}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${item.slug === search.type ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2" aria-label="Quick filters">
            <span className="mr-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">Quick filters</span>
            <QuickFilterChip label="Closing soon" active={search.deadline === "Closing soon"} onClick={() => update({ deadline: search.deadline === "Closing soon" ? "" : "Closing soon" })} />
            <QuickFilterChip label="Remote" active={search.location === "Remote" || search.employment === "Remote"} onClick={() => {
              const active = search.location === "Remote" || search.employment === "Remote";
              update({ location: active ? "" : "Remote", employment: "" });
            }} />
            <QuickFilterChip label="No experience required" active={search.experience === "No experience"} onClick={() => update({ experience: search.experience === "No experience" ? "" : "No experience" })} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid lg:grid-cols-[280px_1fr] lg:px-8">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-lg border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="font-heading text-sm font-bold">Filters</p>
              {activeFilters.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAll}>
                  <X className="size-4" />
                  Clear
                </Button>
              )}
            </div>
            <div className="mt-5">{filterPanel}</div>
          </div>
        </aside>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-xl font-extrabold sm:text-2xl">
                {filtered.length} {filtered.length === 1 ? "opportunity" : "opportunities"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {activeType.label} · updated regularly
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="lg:hidden"
                onClick={() => setFiltersOpen(true)}
              >
                <SlidersHorizontal className="size-4" />
                Filters{activeFilters.length ? ` (${activeFilters.length})` : ""}
              </Button>
              <label className="flex h-10 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm">
                <span className="text-muted-foreground">Sort</span>
                <span className="sr-only">Sort opportunities</span>
                <select
                  className="bg-transparent text-sm font-semibold outline-none"
                  value={search.sort}
                  onChange={(event) => update({ sort: event.target.value })}
                >
                  <option value="newest">Newest</option>
                  <option value="deadline">Deadline soonest</option>
                  <option value="featured">Featured first</option>
                </select>
              </label>
            </div>
          </div>

          {activeFilters.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {activeFilters.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    if (item.key === "q") setKeyword("");
                    update({ [item.key]: "" } as Partial<CategorySearch>);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-bold text-primary"
                >
                  {item.value}
                  <X className="size-3.5" />
                </button>
              ))}
              <button
                type="button"
                onClick={clearAll}
                className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-muted-foreground hover:text-foreground"
              >
                Clear all
              </button>
            </div>
          )}

          {visible.length ? (
            <>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {visible.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
              {totalPages > 1 && (
                <nav
                  className="mt-10 flex items-center justify-center gap-2"
                  aria-label="Pagination"
                >
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => update({ page: page - 1 })}
                  >
                    <ChevronLeft className="size-4" />
                    Previous
                  </Button>
                  <span className="px-3 text-sm font-semibold">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => update({ page: page + 1 })}
                  >
                    Next
                    <ChevronRight className="size-4" />
                  </Button>
                </nav>
              )}
            </>
          ) : (
            <div className="mt-6 rounded-lg border border-dashed border-border bg-surface p-10 text-center">
              <Search className="mx-auto size-8 text-primary" />
              <h3 className="mt-4 font-heading text-xl font-bold">
                No opportunities match these filters
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Try removing a filter or browsing another category.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Button variant="secondary" onClick={clearAll}>
                  Clear filters
                </Button>
                <Button asChild variant="gold">
                  <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                    <MessageCircle className="size-4" />
                    Get alerts on WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col bg-background shadow-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <p className="font-heading text-base font-bold">Filters</p>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setFiltersOpen(false)}
                aria-label="Close filters"
              >
                <X className="size-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">{filterPanel}</div>
            <div className="flex gap-3 border-t border-border px-5 py-4">
              <Button variant="secondary" className="flex-1" onClick={clearAll}>
                Clear all
              </Button>
              <Button className="flex-1" onClick={() => setFiltersOpen(false)}>
                Show {filtered.length} results
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
        {label}
      </legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = value === option;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(selected ? "" : option)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${selected ? "border-primary bg-primary-soft text-primary" : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function QuickFilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${active ? "border-primary bg-primary-soft text-primary" : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}
    >
      {label}
    </button>
  );
}
