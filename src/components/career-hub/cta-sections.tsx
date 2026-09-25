import { Link } from "@tanstack/react-router";
import { BriefcaseBusiness, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WHATSAPP_URL } from "@/lib/jobs/types";

const jobSearch = (type: string) => ({ type, q: "", location: "", employment: "", field: "", experience: "", deadline: "", sort: "newest", page: 1 });

export function JobCategoryCta({ title = "Ready to find opportunities?", text, label, type }: { title?: string; text: string; label: string; type: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <BriefcaseBusiness className="size-6 text-primary" />
      <h2 className="mt-4 font-heading text-xl font-bold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
      <Button asChild className="mt-5">
        <Link to="/categories" search={jobSearch(type)}>{label}</Link>
      </Button>
    </div>
  );
}

export function ServiceCta({ title, text, label }: { title: string; text: string; label: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <Sparkles className="size-6 text-highlight-strong" />
      <h2 className="mt-4 font-heading text-xl font-bold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
      <Button asChild variant="secondary" className="mt-5">
        <Link to="/services">{label}</Link>
      </Button>
    </div>
  );
}

export function WhatsappCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="overflow-hidden rounded-lg bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12 sm:py-16">
        <MessageCircle className="mx-auto size-9" />
        <h2 className="mx-auto mt-5 max-w-2xl font-heading text-3xl font-extrabold sm:text-4xl">Don't Miss Your Next Opportunity</h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-primary-foreground/80">Get the latest jobs, internships, scholarships and career opportunities directly on WhatsApp.</p>
        <Button asChild variant="gold" size="lg" className="mt-7">
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer"><MessageCircle className="size-5" />Join Get Hired KE on WhatsApp</a>
        </Button>
      </div>
    </section>
  );
}
