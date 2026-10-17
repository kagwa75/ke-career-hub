import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BriefcaseBusiness,
  Code2,
  GraduationCap,
  HeartPulse,
  MapPin,
  Megaphone,
  MessageCircle,
  Search,
  Sparkles,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/job-card";
import { opportunityTypes, WHATSAPP_URL, type Category, type Job } from "@/lib/jobs/types";
import { getPublicHomeJobs } from "@/lib/jobs/public-actions.server";

type SearchParams = { category?: string };

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): SearchParams =>
    typeof search["category"] === "string" ? { category: search["category"] } : {},
  head: () => ({
    meta: [
      { title: "Jobs in Kenya | Get Hired KE" },
      {
        name: "description",
        content:
          "Discover fresh jobs, internships and graduate opportunities across Kenya with Get Hired KE.",
      },
      { property: "og:title", content: "Jobs in Kenya | Get Hired KE" },
      {
        property: "og:description",
        content: "Discover fresh jobs, internships and graduate opportunities across Kenya.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: () => getPublicHomeJobs(),
  component: HomePage,
});

const categoryIcons = {
  code: Code2,
  wallet: WalletCards,
  heart: HeartPulse,
  megaphone: Megaphone,
  graduation: GraduationCap,
  briefcase: BriefcaseBusiness,
};

function HomePage() {
  const loaderData = Route.useLoaderData();
  const jobs = loaderData.jobs;
  const categories = withCategoryMeta(loaderData.categories, jobs);
  const routeSearch = Route.useSearch();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState(routeSearch.category ?? "All categories");
  const [opportunityType, setOpportunityType] = useState("all");
  const [submitted, setSubmitted] = useState(Boolean(routeSearch.category));

  useEffect(() => {
    setCategory(routeSearch.category ?? "All categories");
    setSubmitted(Boolean(routeSearch.category));
  }, [routeSearch.category]);

  const results = useMemo(() => {
    if (!submitted && category === "All categories") return jobs;
    const term = keyword.toLowerCase().trim();
    const place = location.toLowerCase().trim();
    return jobs.filter(
      (job) =>
        (!term || `${job.title} ${job.positions.map((position) => position.title).join(" ")} ${job.company}`.toLowerCase().includes(term)) &&
        (!place || `${job.location} ${job.county}`.toLowerCase().includes(place)) &&
        (category === "All categories" || job.category === category) &&
        (opportunityType === "all" || job.opportunityType === opportunityType),
    );
  }, [category, keyword, location, opportunityType, submitted, jobs]);

  const resetSearch = () => {
    setKeyword("");
    setLocation("");
    setCategory("All categories");
    setOpportunityType("all");
    setSubmitted(false);
  };

  return (
    <>
      <section className="relative overflow-hidden bg-hero">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-24 lg:px-8 lg:pt-28">
          <div className="max-w-4xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/70 px-3 py-1.5 text-sm font-bold text-primary">
              <Sparkles className="size-4" />
              Fresh opportunities, every week
            </p>
            <h1 className="mt-6 max-w-3xl font-heading text-4xl font-extrabold leading-[1.1] text-foreground sm:text-5xl lg:text-6xl">
              Your next opportunity in Kenya starts here.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Search trusted jobs, internships and graduate roles from teams building Kenya’s
              future.
            </p>
          </div>
          <form
            className="mt-9 grid max-w-5xl gap-2 rounded-lg border border-border bg-card p-2 shadow-search md:grid-cols-[1.3fr_1fr_1fr_1fr_auto]"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
            }}
          >
            <label className="flex h-13 items-center gap-3 rounded-md px-3 focus-within:bg-surface">
              <Search className="size-5 text-primary" />
              <span className="sr-only">Job title or company</span>
              <input
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Job title or company"
              />
            </label>
            <label className="flex h-13 items-center gap-3 rounded-md border-t border-border px-3 focus-within:bg-surface md:border-l md:border-t-0">
              <MapPin className="size-5 text-primary" />
              <span className="sr-only">Location</span>
              <input
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Location"
              />
            </label>
            <label className="flex h-13 items-center rounded-md border-t border-border px-3 md:border-l md:border-t-0">
              <span className="sr-only">Category</span>
              <select
                className="w-full bg-transparent text-sm outline-none"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option>All categories</option>
                {categories.map((item) => (
                  <option key={item.name}>{item.name}</option>
                ))}
              </select>
            </label>
            <label className="flex h-13 items-center rounded-md border-t border-border px-3 md:border-l md:border-t-0">
              <span className="sr-only">Opportunity type</span>
              <select className="w-full bg-transparent text-sm outline-none" value={opportunityType} onChange={(event) => setOpportunityType(event.target.value)}>
                <option value="all">All opportunity types</option>
                {opportunityTypes.filter((item) => item.slug !== "all").map((item) => <option key={item.slug} value={item.slug}>{item.label}</option>)}
              </select>
            </label>
            <Button type="submit" size="lg">
              <Search className="size-4" />
              Search jobs
            </Button>
          </form>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span>
              <strong className="text-foreground">{jobs.length}</strong> active roles
            </span>
            <span>
              <strong className="text-foreground">
                {new Set(jobs.map((job) => job.company)).size}
              </strong>{" "}
              employers
            </span>
            <span>Across Kenya</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading
          eyebrow="Handpicked"
          title="Featured opportunities"
          copy="Standout roles with approaching deadlines."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {jobs
            .filter((job) => job.featured)
            .map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Browse"
              title={
                submitted || routeSearch.category
                  ? `${results.length} matching jobs`
                  : "Latest jobs"
              }
              copy="New roles from across the country."
            />
            {(submitted || routeSearch.category) && (
              <Button variant="ghost" size="sm" onClick={resetSearch}>
                <X className="size-4" />
                Clear search
              </Button>
            )}
          </div>
          {results.length ? (
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {results.map((job) => (
                <JobCard key={job.id} job={job} compact />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-lg border border-dashed border-border bg-background p-10 text-center">
              <Search className="mx-auto size-8 text-primary" />
              <h3 className="mt-4 font-heading text-xl font-bold">No matching jobs yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Try a broader keyword, location or category.
              </p>
              <Button className="mt-5" variant="secondary" onClick={resetSearch}>
                Reset search
              </Button>
              <p className="mt-4 text-sm text-muted-foreground">Want new listings as they arrive?</p>
              <a className="mt-2 inline-flex items-center justify-center gap-2 text-sm font-bold text-primary hover:underline" href="https://t.me/gethiredkenya" target="_blank" rel="noreferrer">
                <MessageCircle className="size-4" /> Join our Telegram updates
              </a>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading
          eyebrow="Find your field"
          title="Browse by category"
          copy="Start with the work that fits your strengths."
        />
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((item) => {
            const Icon = categoryIcons[item.icon];
            return (
              <Link
                key={item.name}
                to="/"
                search={{ category: item.name }}
                className="group rounded-lg border border-border bg-card p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card"
              >
                <span className="flex size-10 items-center justify-center rounded-md bg-primary-soft text-primary">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-5 font-heading text-sm font-bold leading-5">{item.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{item.count} roles</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 md:grid-cols-[0.8fr_1.2fr] md:items-center lg:px-8">
          <div className="relative min-h-64 overflow-hidden rounded-lg bg-about-pattern p-8">
            <div className="absolute bottom-7 left-7 right-7 rounded-md border border-background/20 bg-footer/90 p-5 text-footer-foreground">
              <p className="font-heading text-3xl font-extrabold">10,000+</p>
              <p className="mt-1 text-sm text-footer-muted">career seekers in our community</p>
            </div>
          </div>
          <div>
            <SectionHeading
              eyebrow="About Get Hired KE"
              title="Opportunity should be easier to find."
              copy="We bring useful roles, internships and career guidance into one clear, accessible place for people across Kenya."
            />
            <div className="mt-7 flex gap-7">
              <div>
                <p className="font-heading text-2xl font-extrabold text-primary">Fresh</p>
                <p className="text-sm text-muted-foreground">Regular updates</p>
              </div>
              <div>
                <p className="font-heading text-2xl font-extrabold text-primary">Local</p>
                <p className="text-sm text-muted-foreground">Kenya-focused</p>
              </div>
            </div>
            <Button asChild variant="secondary" className="mt-7">
              <Link to="/about">More about us</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="overflow-hidden rounded-lg bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12 sm:py-16">
          <MessageCircle className="mx-auto size-9" />
          <h2 className="mx-auto mt-5 max-w-2xl font-heading text-3xl font-extrabold sm:text-4xl">
            Never miss your next opportunity.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-primary-foreground/80">
            Join our WhatsApp channel for fresh jobs, internships and practical career updates.
          </p>
          <Button asChild variant="gold" size="lg" className="mt-7">
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
              <MessageCircle className="size-5" />
              Join the WhatsApp channel
            </a>
          </Button>
        </div>
      </section>
    </>
  );
}

function SectionHeading({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy: string;
}) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-primary">{eyebrow}</p>
      <h2 className="mt-2 font-heading text-2xl font-extrabold sm:text-3xl">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">{copy}</p>
    </div>
  );
}

function withCategoryMeta(categories: Category[], jobs: Job[]) {
  return categories.map((category) => ({
    ...category,
    icon: iconForCategory(category.name),
    count: jobs.filter((job) => job.categoryId === category.id || job.category === category.name).length,
  }));
}

function iconForCategory(name: string): keyof typeof categoryIcons {
  const value = name.toLowerCase();
  if (value.includes("tech")) return "code";
  if (value.includes("finance")) return "wallet";
  if (value.includes("health")) return "heart";
  if (value.includes("sales") || value.includes("marketing")) return "megaphone";
  if (value.includes("intern") || value.includes("graduate") || value.includes("college")) return "graduation";
  return "briefcase";
}
