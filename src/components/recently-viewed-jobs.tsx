import { useEffect, useState } from "react";

import { JobCard } from "@/components/job-card";
import { getRecentlyViewedJobIds, subscribeToJobPreferences } from "@/lib/jobs/browser-preferences";
import type { Job } from "@/lib/jobs/types";

export function RecentlyViewedJobs({ jobs }: { jobs: Job[] }) {
  const [viewedIds, setViewedIds] = useState<string[]>([]);

  useEffect(() => {
    const update = () => setViewedIds(getRecentlyViewedJobIds());
    update();
    return subscribeToJobPreferences(update);
  }, []);

  const viewed = viewedIds.map((id) => jobs.find((job) => job.id === id)).filter((job): job is Job => Boolean(job)).slice(0, 3);
  if (!viewed.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
      <h2 className="font-heading text-xl font-extrabold">Recently viewed</h2>
      <p className="mt-1 text-sm text-muted-foreground">Pick up where you left off.</p>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {viewed.map((job) => <JobCard key={job.id} job={job} compact />)}
      </div>
    </section>
  );
}
