import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, BookOpenCheck, CalendarDays, ChevronRight, Clock3, UserRound } from "lucide-react";
import { ArticleCard } from "@/components/career-hub/article-card";
import { JobCategoryCta, ServiceCta, WhatsappCta } from "@/components/career-hub/cta-sections";
import { SectionHeading } from "@/components/career-hub/section-heading";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/job-card";
import {
  careerArticles,
  careerCategories,
  formatArticleDate,
  getArticlesByCategory,
  getCareerArticle,
  getCareerCategory,
  getRelatedArticles,
  type CareerArticle,
  type CareerCategory,
} from "@/data/career-hub";
import { getPublicHomeJobs } from "@/lib/jobs/public-actions.server";
import type { Job } from "@/lib/jobs/types";

export const Route = createFileRoute("/career-hub/$slug")({
  beforeLoad: ({ params }) => {
    const article = getCareerArticle(params.slug);
    const category = getCareerCategory(params.slug);
    if (!article && !category) throw notFound();
  },
  head: ({ params }) => {
    const article = getCareerArticle(params.slug);
    const category = getCareerCategory(params.slug);

    if (article) {
      return {
        meta: [
          { title: article.seoTitle },
          { name: "description", content: article.seoDescription },
          { property: "og:title", content: article.seoTitle },
          { property: "og:description", content: article.seoDescription },
          { property: "og:type", content: "article" },
          { property: "article:published_time", content: article.publishedAt },
          ...(article.updatedAt ? [{ property: "article:modified_time", content: article.updatedAt }] : []),
          { name: "author", content: article.author },
          { name: "twitter:card", content: "summary_large_image" },
        ],
        links: [{ rel: "canonical", href: `/career-hub/${article.slug}` }],
      };
    }

    return {
      meta: [
        { title: `${category?.title ?? "Career Guides"} | Get Hired KE` },
        { name: "description", content: category?.description ?? "Free career guides and resources for Kenyan job seekers." },
        { property: "og:title", content: `${category?.title ?? "Career Guides"} | Get Hired KE` },
        { property: "og:description", content: category?.description ?? "Free career guides and resources for Kenyan job seekers." },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/career-hub/${params.slug}` }],
    };
  },
  loader: () => getPublicHomeJobs(),
  component: CareerHubSlugPage,
});

function CareerHubSlugPage() {
  const { slug } = Route.useParams();
  const { jobs } = Route.useLoaderData();
  const article = getCareerArticle(slug);
  const category = getCareerCategory(slug);

  if (article) return <ArticlePage article={article} jobs={jobs} />;
  if (category) return <CategoryPage category={category} jobs={jobs} />;
  return null;
}

function CategoryPage({ category, jobs }: { category: CareerCategory; jobs: Job[] }) {
  const categoryArticles = getArticlesByCategory(category.slug);
  const featured = categoryArticles[0] ?? careerArticles[0]!;
  const latest = categoryArticles.slice(1, 7);
  const popular = [...categoryArticles].sort((a, b) => b.views - a.views).slice(0, 4);
  const relatedJobs = jobs.slice(0, 3);
  const Icon = category.icon;

  return (
    <>
      <section className="border-b border-border bg-hero">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <Breadcrumb current={category.title} />
          <div className="mt-8 flex size-12 items-center justify-center rounded-md bg-primary-soft text-primary"><Icon className="size-6" /></div>
          <p className="mt-5 text-xs font-bold uppercase tracking-wide text-primary">Career Hub category</p>
          <h1 className="mt-2 max-w-3xl font-heading text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">{category.title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">{category.description}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading eyebrow="Start here" title="Featured Guide" copy="A practical first read for this topic." />
        <div className="mt-8 max-w-3xl"><ArticleCard article={featured} /></div>
      </section>

      <section className="border-y border-border bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Latest" title="Latest Articles" />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{latest.length ? latest.map((item) => <ArticleCard key={item.id} article={item} compact />) : <ArticleCard article={featured} compact />}</div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_1fr] lg:px-8">
        <div>
          <SectionHeading eyebrow="Popular" title="Popular Articles" />
          <div className="mt-6 grid gap-3">
            {(popular.length ? popular : [featured]).map((item) => (
              <Link key={item.id} to="/career-hub/$slug" params={{ slug: item.slug }} search={{ q: "" }} className="rounded-lg border border-border bg-card p-4 transition hover:border-primary/35 hover:shadow-card">
                <p className="font-heading text-base font-bold">{item.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{item.readingTime}</p>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <SectionHeading eyebrow="Opportunities" title="Related Job Opportunities" copy="Move from learning into live roles when you are ready." />
          <div className="mt-6 grid gap-4">{relatedJobs.map((job) => <JobCard key={job.id} job={job} compact />)}</div>
        </div>
      </section>
    </>
  );
}

function ArticlePage({ article, jobs }: { article: CareerArticle; jobs: Job[] }) {
  const category = careerCategories.find((item) => item.slug === article.category);
  const relatedArticles = getRelatedArticles(article);
  const relatedJobs = jobs.filter((job) => article.jobCta?.type === "all" || !article.jobCta ? true : job.sector === article.jobCta.type).slice(0, 3);

  return (
    <>
      <article>
        <header className="border-b border-border bg-hero">
          <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <Breadcrumb current={article.title} parent={category} />
            <p className="mt-8 text-xs font-bold uppercase tracking-wide text-primary">{category?.title ?? "Career Guide"}</p>
            <h1 className="mt-3 font-heading text-4xl font-extrabold leading-tight sm:text-5xl">{article.title}</h1>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">{article.intro}</p>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-4 text-primary" />Published {formatArticleDate(article.publishedAt)}</span>
              {article.updatedAt && <span className="inline-flex items-center gap-1.5"><BookOpenCheck className="size-4 text-primary" />Updated {formatArticleDate(article.updatedAt)}</span>}
              <span className="inline-flex items-center gap-1.5"><Clock3 className="size-4 text-primary" />{article.readingTime}</span>
              <span className="inline-flex items-center gap-1.5"><UserRound className="size-4 text-primary" />{article.author}</span>
            </div>
          </div>
        </header>

        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,760px)_320px] lg:px-8">
          <div className="min-w-0">
            <div className="mb-10 flex aspect-[16/7] items-center justify-center rounded-lg border border-border bg-surface">
              <div className="text-center">
                <BookOpenCheck className="mx-auto size-8 text-primary" />
                <p className="mt-3 text-sm font-semibold text-muted-foreground">Career guide illustration</p>
              </div>
            </div>

            <div className="space-y-10">
              {article.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="font-heading text-2xl font-extrabold leading-snug">{section.heading}</h2>
                  <div className="mt-4 space-y-4 text-base leading-8 text-muted-foreground">
                    {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                    {section.bullets && <ul className="list-disc space-y-2 pl-6">{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul>}
                    {section.ordered && <ol className="list-decimal space-y-2 pl-6">{section.ordered.map((item) => <li key={item}>{item}</li>)}</ol>}
                    {section.note && <div className="rounded-lg border border-primary/20 bg-primary-soft p-5 text-sm font-medium leading-7 text-foreground">{section.note}</div>}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-2">
              {article.jobCta && <JobCategoryCta title={article.jobCta.type === "ngo" ? "Looking for NGO opportunities?" : article.jobCta.type === "graduate" ? "Looking for graduate opportunities?" : article.jobCta.type === "remote" ? "Looking for remote opportunities?" : "Ready to apply?"} text="Move from this guide into current opportunities on Get Hired KE." label={article.jobCta.label} type={article.jobCta.type} />}
              {article.serviceCta && <ServiceCta title={article.serviceCta.title} text={article.serviceCta.text} label={article.serviceCta.label} />}
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-lg border border-border bg-card p-5">
              <p className="font-heading text-sm font-bold">In this guide</p>
              <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
                {article.sections.map((section) => <span key={section.heading}>{section.heading}</span>)}
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <p className="font-heading text-sm font-bold">Tags</p>
              <div className="mt-4 flex flex-wrap gap-2">{article.tags.map((tag) => <span key={tag} className="rounded-full bg-primary-soft px-3 py-1.5 text-xs font-bold text-primary">{tag}</span>)}</div>
            </div>
          </aside>
        </div>
      </article>

      <section className="border-y border-border bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Keep learning" title="Related Career Guides" />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{relatedArticles.map((item) => <ArticleCard key={item.id} article={item} compact />)}</div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <SectionHeading eyebrow="Apply next" title="Latest Opportunities" copy="Relevant jobs from the Get Hired KE opportunity system." />
          <Button asChild variant="secondary"><Link to="/categories" search={{ type: article.jobCta?.type ?? "all", q: "", location: "", employment: "", field: "", experience: "", deadline: "", sort: "newest", page: 1 }}>View more jobs <ArrowRight className="size-4" /></Link></Button>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">{relatedJobs.map((job) => <JobCard key={job.id} job={job} />)}</div>
      </section>

      <WhatsappCta />
    </>
  );
}

function Breadcrumb({ current, parent }: { current: string; parent?: CareerCategory | undefined }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
      <Link to="/" search={{}} className="font-semibold hover:text-foreground">Home</Link>
      <ChevronRight className="size-4" />
      <Link to="/career-hub" search={{ q: "" }} className="font-semibold hover:text-foreground">Career Hub</Link>
      {parent && (
        <>
          <ChevronRight className="size-4" />
          <Link to="/career-hub/$slug" params={{ slug: parent.slug }} search={{ q: "" }} className="font-semibold hover:text-foreground">{parent.title}</Link>
        </>
      )}
      <ChevronRight className="size-4" />
      <span className="font-semibold text-foreground">{current}</span>
    </nav>
  );
}
