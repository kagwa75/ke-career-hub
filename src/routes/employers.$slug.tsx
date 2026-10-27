import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, BriefcaseBusiness, Building2, ExternalLink } from "lucide-react";

import { JobCard } from "@/components/job-card";
import { Button } from "@/components/ui/button";
import { getPublicOrganizationProfile } from "@/lib/jobs/public-actions.server";

export const Route = createFileRoute("/employers/$slug")({
  loader: async ({ params }) => {
    const profile = await getPublicOrganizationProfile({ data: { slug: params.slug } });
    if (!profile) throw notFound();
    return profile;
  },
  head: ({ loaderData }) => {
    const organization = loaderData?.organization;
    const image = organization?.logo
      ? new URL(organization.logo, "https://gethired.bermudaappstudios.online").toString()
      : "https://gethired.bermudaappstudios.online/job_placeholder.jpeg";
    return {
      meta: [
        { title: organization ? `${organization.name} Jobs | Get Hired KE` : "Employer | Get Hired KE" },
        { name: "description", content: organization?.description || `View current job opportunities from ${organization?.name ?? "this employer"} on Get Hired KE.` },
        { property: "og:title", content: organization ? `${organization.name} | Get Hired KE` : "Employer | Get Hired KE" },
        { property: "og:description", content: organization?.description || "Explore current employer opportunities on Get Hired KE." },
        { property: "og:image", content: image },
        { property: "og:image:alt", content: organization ? `${organization.name} logo` : "Get Hired KE" },
        { name: "twitter:image", content: image },
        { name: "twitter:image:alt", content: organization ? `${organization.name} logo` : "Get Hired KE" },
      ],
    };
  },
  component: EmployerProfilePage,
  notFoundComponent: () => (
    <section className="mx-auto max-w-3xl px-4 py-24 text-center">
      <Building2 className="mx-auto size-10 text-primary" />
      <h1 className="mt-4 font-heading text-3xl font-extrabold">Employer not found</h1>
      <p className="mt-3 text-muted-foreground">This employer profile may have moved or is not available.</p>
      <Button asChild className="mt-6"><Link to="/categories" search={{ type: "all", q: "", location: "", employment: "", field: "", experience: "", deadline: "", sort: "newest", page: 1 }}>Browse opportunities</Link></Button>
    </section>
  ),
});

function EmployerProfilePage() {
  const { organization, jobs } = Route.useLoaderData();
  return (
    <>
      <section className="border-b border-border bg-hero">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <Link to="/categories" search={{ type: "all", q: "", location: "", employment: "", field: "", experience: "", deadline: "", sort: "newest", page: 1 }} className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary">
            <ArrowLeft className="size-4" /> Browse opportunities
          </Link>
          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-card p-2 shadow-sm sm:size-28">
              <Building2 className="size-9 text-muted-foreground" />
              <img src={organization.logo || "/job_placeholder.jpeg"} alt={organization.logo ? `${organization.name} logo` : ""} className="absolute inset-0 size-full bg-card object-contain p-2" onError={(event) => { event.currentTarget.style.display = "none"; }} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wide text-primary">Employer profile</p>
              <h1 className="mt-2 font-heading text-3xl font-extrabold sm:text-4xl">{organization.name}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><Building2 className="size-4 text-primary" />{jobs.length} active {jobs.length === 1 ? "opportunity" : "opportunities"}</span>
                {organization.website && <a href={organization.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline">Official website <ExternalLink className="size-3.5" /></a>}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {organization.description && (
          <section className="mb-10 max-w-4xl">
            <h2 className="font-heading text-2xl font-extrabold">About {organization.name}</h2>
            <p className="mt-3 whitespace-pre-line text-base leading-7 text-muted-foreground">{organization.description}</p>
          </section>
        )}
        <section>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-primary">Open positions</p>
              <h2 className="mt-1 font-heading text-2xl font-extrabold">Opportunities at {organization.name}</h2>
            </div>
            <span className="rounded-full bg-primary-soft px-3 py-1.5 text-sm font-bold text-primary">{jobs.length} active</span>
          </div>
          {jobs.length ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {jobs.map((job) => <JobCard key={job.id} job={job} />)}
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-dashed border-border bg-surface px-6 py-12 text-center">
              <BriefcaseBusiness className="mx-auto size-8 text-primary" />
              <h3 className="mt-3 font-heading text-lg font-bold">No active openings right now</h3>
              <p className="mt-2 text-sm text-muted-foreground">Check back later or browse other opportunities.</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
