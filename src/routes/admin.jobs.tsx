import { createFileRoute, Link, Outlet, redirect, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Archive,
  Building2,
  CalendarDays,
  Copy,
  Eye,
  MapPin,
  Megaphone,
  Pencil,
  Plus,
  Search,
  Send,
  Star,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AdminPageHeader } from "@/components/admin/admin-layout";
import { JobStatusBadge } from "@/components/admin/job-status-badge";
import { Button } from "@/components/ui/button";
import { getAdminJobs, setAdminJobStatus } from "@/lib/jobs/admin-actions.server";
import { opportunityTypes } from "@/lib/jobs/types";

type SearchParams = {
  q?: string | undefined;
  status?: string | undefined;
  categoryId?: string | undefined;
  opportunityType?: string | undefined;
  featured?: string | undefined;
  deadlineState?: string | undefined;
  sort?: string | undefined;
};

const str = (value: unknown) => (typeof value === "string" ? value : undefined);

export const Route = createFileRoute("/admin/jobs")({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    q: str(search["q"]),
    status: str(search["status"]) ?? "all",
    categoryId: str(search["categoryId"]) ?? "all",
    opportunityType: str(search["opportunityType"]) ?? "all",
    featured: str(search["featured"]) ?? "all",
    deadlineState: str(search["deadlineState"]) ?? "all",
    sort: str(search["sort"]) ?? "updated",
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    try {
      return await getAdminJobs({ data: deps });
    } catch (error) {
      if (error instanceof Response && [401, 403].includes(error.status))
        throw redirect({ to: "/admin/login" });
      throw error;
    }
  },
  component: AdminJobsPage,
});

function AdminJobsPage() {
  const { jobs, categories } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/admin/jobs" });
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [q, setQ] = useState(search.q ?? "");
  const [statusError, setStatusError] = useState<string | null>(null);
  const [statusSaving, setStatusSaving] = useState<string | null>(null);

  const update = (patch: Partial<SearchParams>) => navigate({ search: { ...search, ...patch } });
  const mutateStatus = async (jobId: string, status: "published" | "draft" | "archived") => {
    setStatusSaving(jobId);
    setStatusError(null);
    try {
      await setAdminJobStatus({ data: { jobId, status } });
      if (status === "published") toast.success("Opportunity published successfully.");
      if (status === "archived") toast.success("Opportunity archived.");
      if (status === "draft") toast.success("Opportunity moved to drafts.");
      await navigate({ search });
    } catch (error) {
      const message = error instanceof Error ? error.message : "The job status could not be updated.";
      setStatusError(message);
      toast.error(message);
    } finally {
      setStatusSaving(null);
    }
  };

  if (pathname !== "/admin/jobs") return <Outlet />;

  return (
    <>
      <AdminPageHeader
        title="Jobs"
        description="Search, filter and manage the master opportunity records stored in Neon."
        action={
          <Button asChild>
            <Link to="/admin/jobs/new">
              <Plus className="size-4" />
              Add New Job
            </Link>
          </Button>
        }
      />
      <div className="rounded-lg border border-border bg-card p-4">
        <form
          className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
          onSubmit={(event) => {
            event.preventDefault();
            update({ q });
          }}
        >
          <label className="flex h-10 min-w-0 items-center gap-2 rounded-md border border-input bg-background px-3 xl:col-span-1">
            <Search className="size-4 text-primary" />
            <input
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              value={q}
              onChange={(event) => setQ(event.target.value)}
              placeholder="Title, organization, location"
            />
          </label>
          <Select
            label="Filter by status"
            value={search.status ?? "all"}
            onChange={(value) => update({ status: value })}
            options={["all", "draft", "scheduled", "published", "expired", "archived"]}
          />
          <Select
            label="Filter by category"
            value={search.categoryId ?? "all"}
            onChange={(value) => update({ categoryId: value })}
            options={["all", ...categories.map((item) => item.id)]}
            labels={Object.fromEntries(categories.map((item) => [item.id, item.name]))}
          />
          <Select
            label="Filter by opportunity type"
            value={search.opportunityType ?? "all"}
            onChange={(value) => update({ opportunityType: value })}
            options={opportunityTypes.map((item) => item.slug)}
            labels={Object.fromEntries(opportunityTypes.map((item) => [item.slug, item.label]))}
          />
          <Select
            label="Filter by deadline"
            value={search.deadlineState ?? "all"}
            onChange={(value) => update({ deadlineState: value })}
            options={["all", "active", "closing-soon", "expired", "scheduled", "draft", "archived"]}
          />
          <Select
            label="Sort opportunities"
            value={search.sort ?? "updated"}
            onChange={(value) => update({ sort: value })}
            options={["updated", "newest", "oldest", "deadline"]}
          />
        </form>
        <p className="mt-3 text-xs text-muted-foreground">
          {jobs.length} {jobs.length === 1 ? "opportunity" : "opportunities"} shown
        </p>
      </div>
      {statusError && (
        <p role="alert" className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {statusError}
        </p>
      )}
      <div className="mt-5 grid gap-3">
        {jobs.map((job) => (
          <article
            key={job.id}
            className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/35 sm:p-5"
          >
            <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <JobStatusBadge job={job} />
                  {job.featured && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-highlight/15 px-2.5 py-1 text-xs font-semibold text-highlight">
                      <Star className="size-3.5 fill-current" /> Featured
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    Updated {new Date(job.updatedAt).toLocaleDateString("en-KE")}
                  </span>
                </div>
                <h2 className="mt-2 break-words text-base font-bold leading-snug text-foreground sm:text-lg">
                  {job.title}
                </h2>
                <div className="mt-1 flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="inline-flex min-w-0 items-center gap-1.5">
                    <Building2 className="size-4 shrink-0" />
                    <span className="break-words">{job.company || "Organization not specified"}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="size-4 shrink-0" />
                    <span>{job.location || "Location not specified"}</span>
                  </span>
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border pt-3 text-sm sm:grid-cols-5">
                  <Metadata label="Opportunity type" value={job.opportunityType} />
                  <Metadata label="Category" value={job.category} />
                  <Metadata label="Experience" value={job.experience} />
                  <Metadata label="Employment" value={job.employment} />
                  <Metadata
                    label="Deadline"
                    value={job.deadline || "Not specified"}
                    icon={<CalendarDays className="size-3.5" />}
                  />
                </dl>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-1 border-t border-border pt-3 lg:border-0 lg:pt-0">
                <IconLink
                  label="Preview"
                  to="/admin/jobs/$jobId"
                  jobId={job.id}
                  icon={<Eye className="size-4" />}
                />
                <IconLink
                  label="Edit"
                  to="/admin/jobs/$jobId/edit"
                  jobId={job.id}
                  icon={<Pencil className="size-4" />}
                />
                <IconLink
                  label="Posts"
                  to="/admin/jobs/$jobId"
                  jobId={job.id}
                  icon={<Megaphone className="size-4" />}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Publish and verify"
                  title="Publish and verify"
                  disabled={statusSaving === job.id}
                  onClick={() => mutateStatus(job.id, "published")}
                >
                  <Send className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Unpublish"
                  title="Move to drafts"
                  disabled={statusSaving === job.id}
                  onClick={() => mutateStatus(job.id, "draft")}
                >
                  <Copy className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Archive"
                  title="Archive"
                  disabled={statusSaving === job.id}
                  onClick={() => mutateStatus(job.id, "archived")}
                >
                  <Archive className="size-4" />
                </Button>
              </div>
            </div>
          </article>
        ))}
        {jobs.length === 0 && (
          <p className="rounded-xl border border-dashed border-border bg-card px-5 py-12 text-center text-sm text-muted-foreground">
            No jobs match these filters.
          </p>
        )}
      </div>
    </>
  );
}

function Metadata({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 flex min-w-0 items-center gap-1.5 break-words font-medium text-foreground">
        {icon}
        <span>{value || "Not specified"}</span>
      </dd>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  labels = {},
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  labels?: Record<string, string>;
}) {
  return (
    <select
      aria-label={label}
      className="h-10 min-w-0 w-full rounded-md border border-input bg-background px-3 text-sm"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {labels[option] ?? option}
        </option>
      ))}
    </select>
  );
}

function IconLink({
  label,
  to,
  jobId,
  icon,
}: {
  label: string;
  to: "/admin/jobs/$jobId" | "/admin/jobs/$jobId/edit";
  jobId: string;
  icon: React.ReactNode;
}) {
  return (
    <Button asChild variant="ghost" size="icon" aria-label={label}>
      <Link to={to} params={{ jobId }}>
        {icon}
      </Link>
    </Button>
  );
}
