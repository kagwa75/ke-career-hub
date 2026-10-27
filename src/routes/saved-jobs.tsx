import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark, CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";

import { DeadlineReminderButton } from "@/components/deadline-reminder-button";
import { JobCard } from "@/components/job-card";
import { Button } from "@/components/ui/button";
import { getSavedJobIds, setSavedJobIds, subscribeToJobPreferences } from "@/lib/jobs/browser-preferences";
import { getPublicHomeJobs } from "@/lib/jobs/public-actions.server";

export const Route = createFileRoute("/saved-jobs")({
  loader: () => getPublicHomeJobs(),
  component: SavedJobsPage,
});

function SavedJobsPage() {
  const { jobs } = Route.useLoaderData();
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    const update = () => setSavedIds(getSavedJobIds());
    update();
    return subscribeToJobPreferences(update);
  }, []);

  const savedJobs = savedIds.map((id) => jobs.find((job) => job.id === id)).filter((job): job is (typeof jobs)[number] => Boolean(job));

  useEffect(() => {
    const activeIds = new Set(jobs.map((job) => job.id));
    const validIds = savedIds.filter((id) => activeIds.has(id));
    if (validIds.length !== savedIds.length) setSavedJobIds(validIds);
  }, [jobs, savedIds]);

  return (
    <section className="mx-auto min-h-[60vh] max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-primary">Your shortlist</p>
          <h1 className="mt-2 font-heading text-3xl font-extrabold sm:text-4xl">Saved jobs</h1>
          <p className="mt-2 text-sm text-muted-foreground">Saved opportunities are stored in this browser.</p>
        </div>
        <span className="rounded-full bg-primary-soft px-3 py-1.5 text-sm font-bold text-primary">{savedJobs.length} saved</span>
      </div>
      {savedJobs.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {savedJobs.map((job) => (
            <div key={job.id} className="flex flex-col rounded-xl border border-border bg-card p-3">
              <JobCard job={job} compact />
              <div className="flex flex-wrap items-center justify-between gap-2 px-2 pb-2 pt-3">
                <DeadlineReminderButton job={job} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-surface px-6 py-14 text-center">
          {savedIds.length ? <CalendarDays className="mx-auto size-9 text-primary" /> : <Bookmark className="mx-auto size-9 text-primary" />}
          <h2 className="mt-4 font-heading text-xl font-bold">{savedIds.length ? "Your saved listings have closed" : "No saved jobs yet"}</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
            {savedIds.length ? "Closed listings are removed from your active saved list." : "Use the Save job button on any listing to keep it here and add a calendar deadline reminder."}
          </p>
          <Button asChild className="mt-5"><Link to="/categories" search={{ type: "all", q: "", location: "", employment: "", field: "", experience: "", deadline: "", sort: "newest", page: 1 }}>Browse opportunities</Link></Button>
        </div>
      )}
    </section>
  );
}
