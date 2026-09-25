import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import {
  BriefcaseBusiness,
  CalendarClock,
  Clock3,
  FileText,
  Plus,
  Star,
  TimerOff,
} from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-layout";
import { JobStatusBadge } from "@/components/admin/job-status-badge";
import { Button } from "@/components/ui/button";
import { getAdminDashboard } from "@/lib/jobs/admin-actions.server";

export const Route = createFileRoute("/admin/")({
  loader: async () => {
    try {
      return await getAdminDashboard();
    } catch (error) {
      if (error instanceof Response && [401, 403].includes(error.status)) {
        throw redirect({ to: "/admin/login" });
      }
      throw error;
    }
  },
  component: AdminDashboard,
});

function AdminDashboard() {
  const { summary, recentJobs } = Route.useLoaderData();
  const cards = [
    { label: "Published Jobs", value: summary.published, icon: BriefcaseBusiness },
    { label: "Drafts", value: summary.drafts, icon: FileText },
    { label: "Scheduled", value: summary.scheduled, icon: CalendarClock },
    { label: "Expiring Soon", value: summary.expiringSoon, icon: Clock3 },
    { label: "Expired", value: summary.expired, icon: TimerOff },
    { label: "Featured Jobs", value: summary.featured, icon: Star },
  ];

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="Manage Get Hired KE opportunities from the Neon-backed source of truth."
        action={
          <Button asChild>
            <Link to="/admin/jobs/new">
              <Plus className="size-4" />
              Add New Job
            </Link>
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-muted-foreground">{card.label}</p>
                <Icon className="size-5 text-primary" />
              </div>
              <p className="mt-4 font-heading text-3xl font-extrabold">{card.value}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-8 rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <h2 className="font-heading text-lg font-extrabold">Recent jobs</h2>
          <Button asChild variant="secondary" size="sm">
            <Link to="/admin/jobs">Manage Jobs</Link>
          </Button>
        </div>
        <div className="divide-y divide-border">
          {recentJobs.map((job) => (
            <div
              key={job.id}
              className="flex flex-col justify-between gap-3 px-5 py-4 sm:flex-row sm:items-center"
            >
              <div>
                <p className="font-heading font-bold">{job.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {job.company} · {job.location}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <JobStatusBadge job={job} />
                <Button asChild variant="secondary" size="sm">
                  <Link to="/admin/jobs/$jobId/edit" params={{ jobId: job.id }}>
                    Edit
                  </Link>
                </Button>
              </div>
            </div>
          ))}
          {recentJobs.length === 0 && (
            <p className="px-5 py-8 text-sm text-muted-foreground">No jobs in Neon yet.</p>
          )}
        </div>
      </div>
    </>
  );
}
