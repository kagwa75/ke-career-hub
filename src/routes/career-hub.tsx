import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, BookOpenCheck, Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { ArticleCard } from "@/components/career-hub/article-card";
import { CareerResourceCard } from "@/components/career-hub/career-resource-card";
import { CategoryCard } from "@/components/career-hub/category-card";
import { JobCategoryCta, WhatsappCta } from "@/components/career-hub/cta-sections";
import { SectionHeading } from "@/components/career-hub/section-heading";
import { Button } from "@/components/ui/button";
import { careerArticles, careerCategories, careerResources } from "@/data/career-hub";

type CareerHubSearch = { q: string };

export const Route = createFileRoute("/career-hub")({
  validateSearch: (search: Record<string, unknown>): CareerHubSearch => ({
    q: typeof search["q"] === "string" ? search["q"] : "",
  }),
  head: () => ({
    meta: [
      { title: "Career Hub | Get Hired KE" },
      { name: "description", content: "Free career advice, CV guides, interview tips and job search resources for Kenyan job seekers." },
      { property: "og:title", content: "Career Hub | Get Hired KE" },
      { property: "og:description", content: "Practical career advice, job search guides, interview tips and resources for Kenyan job seekers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CareerHub,
});

function CareerHub() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/career-hub" });
  const [query, setQuery] = useState(search.q);
  const submittedQuery = search.q.toLowerCase().trim();

  const featuredArticles = careerArticles.slice(0, 6);
  const latestArticles = [...careerArticles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, 8);
  const popularArticles = [...careerArticles].sort((a, b) => b.views - a.views).slice(0, 6);

  const searchResults = useMemo(() => {
    if (!submittedQuery) return [];
    return careerArticles.filter((article) => {
      const category = careerCategories.find((item) => item.slug === article.category);
      return `${article.title} ${article.excerpt} ${article.tags.join(" ")} ${category?.title ?? ""}`.toLowerCase().includes(submittedQuery);
    });
  }, [submittedQuery]);

  return (
    <>
      <section className="relative overflow-hidden bg-hero">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-24 lg:px-8 lg:pt-28">
          <div className="max-w-4xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/70 px-3 py-1.5 text-sm font-bold text-primary"><Sparkles className="size-4" />Free Kenyan career guidance</p>
            <h1 className="mt-6 max-w-3xl font-heading text-4xl font-extrabold leading-[1.1] text-foreground sm:text-5xl lg:text-6xl">Build Your Career. Get Hired.</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">Practical career advice, job search guides, interview tips and resources to help you move forward in your career.</p>
          </div>

          <form
            className="mt-9 grid max-w-3xl gap-2 rounded-lg border border-border bg-card p-2 shadow-search sm:grid-cols-[1fr_auto]"
            onSubmit={(event) => {
              event.preventDefault();
              navigate({ search: { q: query.trim() } });
            }}
          >
            <label className="flex h-13 items-center gap-3 rounded-md px-3 focus-within:bg-surface">
              <Search className="size-5 text-primary" />
              <span className="sr-only">Search career guides, tips and resources</span>
              <input className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search career guides, tips & resources..." />
            </label>
            <Button type="submit" size="lg"><Search className="size-4" />Search</Button>
          </form>
        </div>
      </section>

      {submittedQuery && (
        <section className="border-b border-border bg-surface py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading title={`${searchResults.length} career ${searchResults.length === 1 ? "guide" : "guides"} for "${search.q}"`} copy="This search is wired to the sample article data and can later connect to a CMS or article database." />
            {searchResults.length ? <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{searchResults.map((article) => <ArticleCard key={article.id} article={article} compact />)}</div> : <p className="mt-6 rounded-lg border border-dashed border-border bg-background p-6 text-sm text-muted-foreground">No guides match that search yet. Try CV, interview, internship, salary, graduate jobs or cover letter.</p>}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading eyebrow="Explore topics" title="Career Hub Categories" copy="Start with the guidance you need today, then move directly into relevant opportunities." />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{careerCategories.map((category) => <CategoryCard key={category.id} category={category} />)}</div>
      </section>

      <section className="border-y border-border bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Featured" title="Featured Career Guides" copy="Practical reads for stronger CVs, applications, interviews and safer job searches." />
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{featuredArticles.map((article) => <ArticleCard key={article.id} article={article} />)}</div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <SectionHeading eyebrow="Recently published" title="Latest Career Advice" copy="Fresh guidance for job seekers, students and professionals across Kenya." />
          <Button asChild variant="secondary"><Link to="/career-hub/$slug" params={{ slug: "career-tips" }} search={{ q: "" }}>View All Guides <ArrowRight className="size-4" /></Link></Button>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">{latestArticles.map((article) => <ArticleCard key={article.id} article={article} compact />)}</div>
      </section>

      <section className="border-y border-border bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Tools" title="Free Career Resources" copy="Useful free checklists, templates and planning tools for your job search." />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{careerResources.map((resource) => <CareerResourceCard key={resource.title} resource={resource} />)}</div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <SectionHeading eyebrow="Popular" title="Popular With Job Seekers" copy="Guides that answer the questions many job seekers ask before they apply." />
          <div className="grid gap-3 sm:grid-cols-2">
            {popularArticles.map((article) => (
              <Link key={article.id} to="/career-hub/$slug" params={{ slug: article.slug }} search={{ q: "" }} className="group rounded-lg border border-border bg-card p-4 transition hover:border-primary/35 hover:shadow-card">
                <p className="font-heading text-sm font-bold leading-5">{article.title}</p>
                <p className="mt-2 text-xs text-muted-foreground">{article.readingTime}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
          <div className="md:col-span-1">
            <BookOpenCheck className="size-7 text-primary" />
            <h2 className="mt-4 font-heading text-2xl font-extrabold">Learn, then apply.</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Career Hub connects practical guides to actual opportunities on Get Hired KE.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 md:col-span-2">
            <JobCategoryCta title="Looking for NGO opportunities?" text="Use the guide, then browse current NGO and development roles." label="Browse NGO Jobs" type="ngo" />
            <JobCategoryCta title="Starting your career?" text="Find internships, attachments and graduate trainee programmes." label="Browse Graduate Jobs" type="graduate" />
            <JobCategoryCta title="Prefer flexible work?" text="Explore roles listed as remote for Kenyan job seekers." label="Browse Remote Jobs" type="remote" />
          </div>
        </div>
      </section>

      <WhatsappCta />
    </>
  );
}
