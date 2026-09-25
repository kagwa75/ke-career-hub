import { createFileRoute, Link, Outlet, redirect, useNavigate, useRouterState } from "@tanstack/react-router";
import { Archive, Copy, Eye, Megaphone, Pencil, Plus, Search, Send, Star } from "lucide-react";
import { useState } from "react";

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
      await navigate({ search });
    } catch (error) {
      setStatusError(error instanceof Error ? error.message : "The job status could not be updated.");
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
          className="grid gap-3 lg:grid-cols-[1fr_repeat(5,160px)]"
          onSubmit={(event) => {
            event.preventDefault();
            update({ q });
          }}
        >
          <label className="flex h-10 items-center gap-2 rounded-md border border-input bg-background px-3">
            <Search className="size-4 text-primary" />
            <input
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              value={q}
              onChange={(event) => setQ(event.target.value)}
              placeholder="Title, organization, location"
            />
          </label>
          <Select
            value={search.status ?? "all"}
            onChange={(value) => update({ status: value })}
            options={["all", "draft", "scheduled", "published", "expired", "archived"]}
          />
          <Select
            value={search.categoryId ?? "all"}
            onChange={(value) => update({ categoryId: value })}
            options={["all", ...categories.map((item) => item.id)]}
            labels={Object.fromEntries(categories.map((item) => [item.id, item.name]))}
          />
          <Select
            value={search.opportunityType ?? "all"}
            onChange={(value) => update({ opportunityType: value })}
            options={opportunityTypes.map((item) => item.slug)}
            labels={Object.fromEntries(opportunityTypes.map((item) => [item.slug, item.label]))}
          />
          <Select
            value={search.deadlineState ?? "all"}
            onChange={(value) => update({ deadlineState: value })}
            options={["all", "active", "closing-soon", "expired", "scheduled", "draft", "archived"]}
          />
          <Select
            value={search.sort ?? "updated"}
            onChange={(value) => update({ sort: value })}
            options={["updated", "newest", "oldest", "deadline"]}
          />
        </form>
      </div>
      {statusError && (
        <p role="alert" className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {statusError}
        </p>
      )}
      <div className="mt-5 overflow-hidden rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="border-b border-border bg-surface text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Organization</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Deadline</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td className="px-4 py-3 font-semibold">{job.title}</td>
                  <td className="px-4 py-3">{job.company}</td>
                  <td className="px-4 py-3">{job.location}</td>
                  <td className="px-4 py-3">{job.opportunityType}</td>
                  <td className="px-4 py-3">{job.category}</td>
                  <td className="px-4 py-3">{job.deadline}</td>
                  <td className="px-4 py-3">
                    <JobStatusBadge job={job} />
                  </td>
                  <td className="px-4 py-3">
                    {job.featured ? (
                      <Star className="size-4 fill-highlight text-highlight" />
                    ) : (
                      "No"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(job.updatedAt).toLocaleDateString("en-KE")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
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
                        aria-label="Publish"
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
                        disabled={statusSaving === job.id}
                        onClick={() => mutateStatus(job.id, "archived")}
                      >
                        <Archive className="size-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {jobs.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-muted-foreground">
            No jobs match these filters.
          </p>
        )}
      </div>
    </>
  );
}

function Select({
  value,
  onChange,
  options,
  labels = {},
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  labels?: Record<string, string>;
}) {
  return (
    <select
      className="h-10 rounded-md border border-input bg-background px-3 text-sm"
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
