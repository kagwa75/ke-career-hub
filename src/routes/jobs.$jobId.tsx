import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  MapPin,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/job-card";
import { getPublicHomeJobs, getPublicJobDetails } from "@/lib/jobs/public-actions.server";

export const Route = createFileRoute("/jobs/$jobId")({
  loader: async ({ params }) => {
    const [job, listing] = await Promise.all([
      getPublicJobDetails({ data: { jobId: params.jobId } }),
      getPublicHomeJobs(),
    ]);
    if (!job) throw notFound();
    return { job, jobs: listing.jobs };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.job
          ? `${loaderData.job.title} at ${loaderData.job.company} | Get Hired KE`
          : "Job not found | Get Hired KE",
      },
      {
        name: "description",
        content: loaderData?.job.summary ?? "Explore jobs and opportunities in Kenya.",
      },
      {
        property: "og:title",
        content: loaderData?.job ? `${loaderData.job.title} at ${loaderData.job.company}` : "Job not found",
      },
      {
        property: "og:description",
        content: loaderData?.job.summary ?? "Explore jobs and opportunities in Kenya.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JobDetails,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="font-heading text-3xl font-extrabold">This role is no longer available</h1>
      <p className="mt-3 text-muted-foreground">Browse the latest opportunities instead.</p>
      <Button asChild className="mt-6">
        <Link to="/" search={{}}>
          Browse jobs
        </Link>
      </Button>
    </div>
  ),
});

function JobDetails() {
  const { job, jobs } = Route.useLoaderData();
  const sameCategory = jobs.filter((item) => item.id !== job.id && item.category === job.category);
  const related = (
    sameCategory.length ? sameCategory : jobs.filter((item) => item.id !== job.id)
  ).slice(0, 2);
  return (
    <>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <Link
            to="/"
            search={{}}
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="size-4" />
            Back to jobs
          </Link>
          <div className="mt-7 flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <div className="flex items-start gap-4">
              <div className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-primary-soft font-heading font-bold text-primary">
                <span>{job.initials}</span>
                <img src={job.organizationLogo || "/job_placeholder.jpeg"} alt={job.organizationLogo ? `${job.company} logo` : ""} className="absolute inset-0 size-full bg-surface object-contain p-1" onError={(event) => { event.currentTarget.style.display = "none"; }} />
              </div>
              <div>
                {job.featured && (
                  <span className="rounded-full bg-highlight-soft px-2.5 py-1 text-xs font-bold text-highlight-strong">
                    Featured opportunity
                  </span>
                )}
                <h1 className="mt-3 font-heading text-3xl font-extrabold sm:text-4xl">
                  {job.title}
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">{job.company}</p>
              </div>
            </div>
            <Button asChild size="lg">
              <a href={job.applicationUrl} target="_blank" rel="noreferrer">
                <Send className="size-4" />
                Apply at source
              </a>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Meta icon={MapPin} text={job.location || "Location not specified"} />
            <Meta icon={BriefcaseBusiness} text={job.type} />
            <Meta icon={Clock3} text={job.posted} />
            <Meta
              icon={CalendarDays}
              text={
                job.deadline === "Not specified"
                  ? "Deadline not specified"
                  : `Apply by ${job.deadline}`
              }
            />
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1fr_320px] lg:px-8">
        <article className="space-y-10">
          {(job.summary || job.description) && (
            <div>
              <h2 className="font-heading text-2xl font-extrabold">About the role</h2>
              <p className="mt-4 leading-7 text-muted-foreground">
                {job.summary || job.description}
              </p>
            </div>
          )}
          {job.positions.length > 0 && (
            <section>
              <h2 className="font-heading text-2xl font-extrabold">
                Positions in this announcement ({job.positions.length})
              </h2>
              <div className="mt-4 space-y-3">
                {job.positions.map((position, index) => (
                  <article
                    key={`${position.title}-${index}`}
                    className="rounded-lg border border-border bg-card p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h3 className="font-heading text-lg font-bold">{position.title}</h3>
                      {position.positionCount && (
                        <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
                          {position.positionCount}
                        </span>
                      )}
                    </div>
                    {position.salary && (
                      <p className="mt-2 text-sm font-semibold text-foreground">
                        Salary: {position.salary}
                      </p>
                    )}
                    {position.details && (
                      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">
                        {position.details}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}
          <DetailList title="What you’ll do" items={job.responsibilities} />
          <DetailList title="What you’ll bring" items={job.requirements} />
          <DetailList
            title="Qualifications"
            items={job.qualifications.split("\n").filter(Boolean)}
          />
          <div>
            <h2 className="font-heading text-2xl font-extrabold">How to apply</h2>
            <p className="mt-4 leading-7 text-muted-foreground">{job.applicationInstructions}</p>
            <a
              href={job.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
            >
              <ExternalLink className="size-4" />
              View source listing
            </a>
          </div>
        </article>
        <aside>
          <div className="rounded-lg border border-border bg-card p-6 lg:sticky lg:top-24">
            <p className="text-xs font-bold uppercase text-primary">Role overview</p>
            <p className="mt-4 font-heading text-2xl font-extrabold">
              {job.positions.length > 0 ? "Varies by position" : job.salary}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {job.positions.length > 0 ? `${job.positions.length} roles listed` : "Salary or stipend"}
            </p>
            <div className="my-5 border-t border-border" />
            <p className="text-sm font-semibold">Deadline</p>
            <p className="mt-1 text-sm font-bold text-highlight-strong">{job.deadline}</p>
            <p className="mt-4 text-sm font-semibold">Source</p>
            <p className="mt-1 text-sm text-muted-foreground">{job.source}</p>
            <p className="mt-1 text-xs text-muted-foreground">Checked {job.verifiedAt}</p>
            <Button asChild className="mt-6 w-full">
              <a href={job.applicationUrl} target="_blank" rel="noreferrer">
                <Send className="size-4" />
                Apply at source
              </a>
            </Button>
          </div>
        </aside>
      </section>
      {related.length > 0 && (
        <section className="border-t border-border bg-surface py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading text-2xl font-extrabold">Similar opportunities</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {related.map((item) => (
                <JobCard key={item.id} job={item} compact />
              ))}
            </div>
          </div>
        </section>
      )}
      <div className="sticky bottom-0 z-40 border-t border-border bg-background p-3 lg:hidden">
        <Button asChild className="w-full">
          <a href={job.applicationUrl} target="_blank" rel="noreferrer">
            <Send className="size-4" />
            Apply at source
          </a>
        </Button>
      </div>
    </>
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
      <h2 className="font-heading text-2xl font-extrabold">{title}</h2>
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
