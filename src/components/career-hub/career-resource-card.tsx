import { ArrowRight } from "lucide-react";
import type { CareerResource } from "@/data/career-hub";

export function CareerResourceCard({ resource }: { resource: CareerResource }) {
  const Icon = resource.icon;

  return (
    <article className="flex h-full flex-col rounded-lg border border-border bg-card p-5">
      <span className="flex size-11 items-center justify-center rounded-md bg-primary-soft text-primary"><Icon className="size-5" /></span>
      <h3 className="mt-5 font-heading text-lg font-bold">{resource.title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{resource.description}</p>
      <button type="button" className="mt-auto inline-flex items-center gap-1.5 pt-5 text-left text-sm font-bold text-primary">
        Preview resource <ArrowRight className="size-4" />
      </button>
    </article>
  );
}
