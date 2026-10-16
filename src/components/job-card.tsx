import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock3, MapPin } from "lucide-react";
import type { Job } from "@/lib/jobs/types";

export function JobCard({ job, compact = false }: { job: Job; compact?: boolean }) {
  return (
    <article className="group flex h-full flex-col rounded-lg border border-border bg-card p-5 transition duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-md bg-primary-soft font-heading text-sm font-bold text-primary">
            <span>{job.initials}</span>
            {job.organizationLogo && <img src={job.organizationLogo} alt="" className="absolute inset-0 size-full bg-card object-contain p-1" onError={(event) => { event.currentTarget.style.display = "none"; }} />}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-muted-foreground">{job.company}</p>
            <h3 className="mt-0.5 font-heading text-lg font-bold text-card-foreground">{job.title}</h3>
          </div>
        </div>
        {job.featured && <span className="rounded-full bg-highlight-soft px-2.5 py-1 text-xs font-bold text-highlight-strong">Featured</span>}
      </div>
      {!compact && job.summary && <p className="mt-4 line-clamp-2 text-sm leading-6 text-muted-foreground">{job.summary}</p>}
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><MapPin className="size-4 text-primary" />{job.location || "Location not specified"}</span>
        <span className="inline-flex items-center gap-1.5"><Clock3 className="size-4 text-primary" />{job.type}</span>
      </div>
      <div className="mt-auto flex items-end justify-between gap-3 border-t border-border pt-4">
        <div>
          <p className="font-heading text-sm font-bold text-foreground">
            {job.positions.length > 0 ? `${job.positions.length} listed roles` : job.salary}
          </p>
          <p className="mt-1 text-xs font-semibold text-highlight-strong">Deadline: {job.deadline}</p>
        </div>
        <Link
          to="/jobs/$jobId"
          params={{ jobId: job.id }}
          className="inline-flex size-9 items-center justify-center rounded-md border border-border text-primary transition-colors hover:border-primary hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`View ${job.title} at ${job.company}`}
        >
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </article>
  );
}
