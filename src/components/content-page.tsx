import type { LucideIcon } from "lucide-react";

export function ContentPage({ eyebrow, title, intro, icon: Icon, children }: { eyebrow: string; title: string; intro: string; icon: LucideIcon; children: React.ReactNode }) {
  return (
    <div>
      <section className="border-b border-border bg-surface py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-5 flex size-12 items-center justify-center rounded-md bg-primary-soft text-primary"><Icon className="size-6" /></div>
          <p className="text-sm font-bold uppercase tracking-wide text-primary">{eyebrow}</p>
          <h1 className="mt-3 max-w-3xl font-heading text-4xl font-extrabold leading-tight sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{intro}</p>
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">{children}</section>
    </div>
  );
}