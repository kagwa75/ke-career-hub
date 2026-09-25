import { BriefcaseBusiness, CalendarDays, CheckCircle2, Clock3, ExternalLink, MapPin, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Job } from "@/lib/jobs/types";

export function JobPreview({ job }: { job: Job }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-background">
      <section className="border-b border-border bg-surface">
        <div className="px-5 py-8 sm:px-8">
          <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <div className="flex items-start gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-md bg-primary-soft font-heading font-bold text-primary">
                {job.initials}
              </div>
              <div>
                {job.featured && (
                  <span className="rounded-full bg-highlight-soft px-2.5 py-1 text-xs font-bold text-highlight-strong">
                    Featured opportunity
                  </span>
                )}
                <h2 className="mt-3 font-heading text-3xl font-extrabold">{job.title}</h2>
                <p className="mt-2 text-lg text-muted-foreground">{job.company}</p>
              </div>
            </div>
            <Button size="lg" disabled>
              <Send className="size-4" />
              Apply at source
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Meta icon={MapPin} text={job.location} />
            <Meta icon={BriefcaseBusiness} text={job.type} />
            <Meta icon={Clock3} text={job.posted || "Draft"} />
            <Meta icon={CalendarDays} text={job.deadline === "Not specified" ? "Deadline: Not specified" : `Apply by ${job.deadline}`} />
          </div>
        </div>
      </section>
      <section className="grid gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[1fr_280px]">
        <article className="space-y-8">
          <div>
            <h3 className="font-heading text-2xl font-extrabold">About the role</h3>
            <p className="mt-4 leading-7 text-muted-foreground">{job.summary}</p>
          </div>
          <DetailList title="What you'll do" items={job.responsibilities} />
          <DetailList title="What you'll bring" items={job.requirements} />
          <div>
            <h3 className="font-heading text-2xl font-extrabold">How to apply</h3>
            <p className="mt-4 leading-7 text-muted-foreground">{job.applicationInstructions}</p>
            {job.sourceUrl && (
              <p className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary">
                <ExternalLink className="size-4" />
                View source listing
              </p>
            )}
          </div>
        </article>
        <aside className="rounded-lg border border-border bg-card p-6">
          <p className="text-xs font-bold uppercase text-primary">Role overview</p>
          <p className="mt-4 font-heading text-2xl font-extrabold">{job.salary}</p>
          <p className="mt-1 text-sm text-muted-foreground">Salary or stipend</p>
          <div className="my-5 border-t border-border" />
          <p className="text-sm font-semibold">Deadline</p>
          <p className="mt-1 text-sm font-bold text-highlight-strong">{job.deadline}</p>
          <p className="mt-4 text-sm font-semibold">Source</p>
          <p className="mt-1 text-sm text-muted-foreground">{job.source}</p>
          <p className="mt-1 text-xs text-muted-foreground">Checked {job.verifiedAt || "Not verified"}</p>
        </aside>
      </section>
    </div>
  );
}

function Meta({ icon: Icon, text }: { icon: typeof MapPin; text: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
      <Icon className="size-4 text-primary" />
      {text}
    </span>
  );
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div>
      <h3 className="font-heading text-2xl font-extrabold">{title}</h3>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-muted-foreground">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
            <span className="leading-7">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
