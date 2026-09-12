import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { CareerCategory } from "@/data/career-hub";

export function CategoryCard({ category }: { category: CareerCategory }) {
  const Icon = category.icon;

  return (
    <Link to="/career-hub/$slug" params={{ slug: category.slug }} className="group rounded-lg border border-border bg-card p-5 transition duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-card">
      <span className="flex size-11 items-center justify-center rounded-md bg-primary-soft text-primary"><Icon className="size-5" /></span>
      <h3 className="mt-5 font-heading text-lg font-bold leading-snug">{category.title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{category.description}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-primary">Explore guides <ArrowRight className="size-4" /></span>
    </Link>
  );
}
