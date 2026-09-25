import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock3 } from "lucide-react";
import { careerCategories, formatArticleDate, type CareerArticle } from "@/data/career-hub";

export function ArticleCard({ article, compact = false }: { article: CareerArticle; compact?: boolean }) {
  const category = careerCategories.find((item) => item.slug === article.category);

  return (
    <article className="group flex h-full flex-col rounded-lg border border-border bg-card p-5 transition duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-card">
      <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wide text-primary">
        <span>{category?.title ?? "Career Guide"}</span>
        <span className="text-muted-foreground">•</span>
        <span className="inline-flex items-center gap-1 normal-case tracking-normal text-muted-foreground"><Clock3 className="size-3.5" />{article.readingTime}</span>
      </div>
      <h3 className="mt-3 font-heading text-lg font-bold leading-snug text-card-foreground">{article.title}</h3>
      <p className={`mt-3 text-sm leading-6 text-muted-foreground ${compact ? "line-clamp-2" : ""}`}>{article.excerpt}</p>
      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        <p className="text-xs font-semibold text-muted-foreground">{formatArticleDate(article.publishedAt)}</p>
        <Link to="/career-hub/$slug" params={{ slug: article.slug }} search={{ q: "" }} className="inline-flex items-center gap-1.5 text-sm font-bold text-primary transition-colors hover:text-primary/80">
          Read Guide <ArrowRight className="size-4" />
        </Link>
      </div>
    </article>
  );
}
