import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock3, MapPin } from "lucide-react";
import type { Job } from "@/lib/jobs/types";
import { SaveJobButton } from "@/components/save-job-button";

export function JobCard({ job, compact = false }: { job: Job; compact?: boolean }) {
  return (
    <article className="group flex h-full min-w-0 max-w-full flex-col rounded-lg border border-border bg-card p-3 transition duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-card sm:p-5">
      <div className="flex min-w-0 items-start justify-between gap-2 sm:gap-4">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-primary-soft font-heading text-sm font-bold text-primary sm:size-11">
            <span>{job.initials}</span>
            <img src={job.organizationLogo || "/job_placeholder.jpeg"} alt="" className="absolute inset-0 size-full bg-card object-contain p-1" onError={(event) => { event.currentTarget.style.display = "none"; }} />
          </div>
          <div className="min-w-0">
            {job.organizationSlug ? (
              <Link to="/employers/$slug" params={{ slug: job.organizationSlug }} className="block truncate text-sm font-medium text-muted-foreground hover:text-primary hover:underline">
                {job.company}
              </Link>
            ) : (
              <p className="truncate text-sm font-medium text-muted-foreground">{job.company}</p>
            )}
            <h3 className="mt-0.5 break-words font-heading text-base font-bold leading-snug text-card-foreground sm:text-lg">{job.title}</h3>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          {job.featured && <span className="rounded-full bg-highlight-soft px-2 py-1 text-[10px] font-bold text-highlight-strong sm:px-2.5 sm:text-xs">Featured</span>}
          {job.verificationStatus === "verified" && <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2 py-1 text-[11px] font-bold text-primary">Verified</span>}
        </div>
      </div>
      {!compact && job.summary && <p className="mt-4 line-clamp-2 text-sm leading-6 text-muted-foreground">{job.summary}</p>}
      <div className="mt-3 flex min-w-0 flex-wrap gap-x-3 gap-y-2 text-xs text-muted-foreground sm:mt-4 sm:gap-x-4 sm:text-sm">
        <span className="inline-flex min-w-0 items-center gap-1.5"><MapPin className="size-4 shrink-0 text-primary" /><span className="break-words">{job.location || "Location not specified"}</span></span>
        <span className="inline-flex items-center gap-1.5"><Clock3 className="size-4 shrink-0 text-primary" />{job.type}</span>
      </div>
      <div className="mt-auto flex min-w-0 items-end justify-between gap-2 border-t border-border pt-3 sm:gap-3 sm:pt-4">
        <div className="min-w-0">
          <p className="font-heading text-sm font-bold text-foreground">
            {job.positions.length > 0 ? `${job.positions.length} listed roles` : job.salary}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Posted: {job.posted}</p>
          <p className="mt-1 text-xs font-semibold text-highlight-strong">Deadline: {job.deadline}</p>
        </div>
        <div className="flex items-center gap-1">
          <SaveJobButton jobId={job.id} compact />
          <Link
            to="/jobs/$jobId"
            params={{ jobId: job.id }}
            className="inline-flex size-9 items-center justify-center rounded-md border border-border text-primary transition-colors hover:border-primary hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`View ${job.title} at ${job.company}`}
          >
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
