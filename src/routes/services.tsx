import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/career-hub/section-heading";
import { Button } from "@/components/ui/button";
import {
  careerServices,
  servicePackages,
  type CareerService,
  type ServicePackage,
} from "@/data/services";
import { WHATSAPP_URL } from "@/lib/jobs/types";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services | Get Hired KE" },
      {
        name: "description",
        content:
          "Professional CV revamp, cover letter writing, interview preparation and career support for Kenyan job seekers.",
      },
      { property: "og:title", content: "Services | Get Hired KE" },
      {
        property: "og:description",
        content:
          "Practical professional support to help Kenyan job seekers prepare stronger applications.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Services,
});

const workSteps = [
  { number: "01", title: "Choose a service", text: "Select the support you need." },
  {
    number: "02",
    title: "Share your details",
    text: "Send your CV, target role, job description or other relevant information.",
  },
  {
    number: "03",
    title: "We work on it",
    text: "We review, improve or prepare the requested material.",
  },
  {
    number: "04",
    title: "Review & finalize",
    text: "Review the work and request reasonable adjustments before final delivery.",
  },
];

const trustPoints = [
  "Kenya-focused career support",
  "Practical, job-focused guidance",
  "Professional and readable documents",
  "Support tailored to your target opportunity",
];

const serviceTrustPoints = [
  {
    title: "ATS-friendly documents",
    text: "Clear, professional documents designed to be readable by applicant tracking systems.",
  },
  {
    title: "Tailored to your target role",
    text: "Your CV and career documents are aligned with the opportunity you're applying for.",
  },
  {
    title: "Professional presentation",
    text: "Clean, readable and recruiter-friendly formatting that presents your experience clearly.",
  },
  {
    title: "Confidential handling",
    text: "Your personal and career information is handled with care and confidentiality.",
  },
];

function Services() {
  return (
    <>
      <section className="relative overflow-hidden bg-hero">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-20">
          <div className="max-w-4xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/70 px-3 py-1.5 text-sm font-bold text-primary">
              <Sparkles className="size-4" />
              CAREER SUPPORT
            </p>
            <h1 className="mt-6 max-w-3xl font-heading text-4xl font-extrabold leading-[1.1] text-foreground sm:text-5xl lg:text-6xl">
              Practical support for your next career move.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              From building a stronger CV to preparing for your next interview, get practical career
              support designed to help you compete with confidence.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/services/$slug" params={{ slug: "cv-revamp" }}>
                  Get Started <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link to="/career-hub" search={{ q: "" }}>Explore Career Hub</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading
          eyebrow="Services"
          title="Professional career services"
          copy="Get practical, personalized support to help you put your best foot forward."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {careerServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface py-18 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Pricing"
            title="Simple pricing. Practical support."
            copy="Choose the package that fits what you need."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {servicePackages.map((item) => (
              <PackageCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Process"
            title="How it works"
            copy="Getting professional career support should be simple."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {workSteps.map((step) => (
              <div key={step.number} className="rounded-lg border border-border bg-card p-5">
                <p className="font-heading text-sm font-extrabold text-primary">{step.number}</p>
                <h3 className="mt-4 font-heading text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Trust"
            title="Why choose Get Hired KE?"
            copy="Practical career support designed around the opportunity you're pursuing."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {serviceTrustPoints.map((point) => (
              <div key={point.title} className="rounded-lg border border-border bg-card p-5">
                <span className="flex size-9 items-center justify-center rounded-md bg-primary-soft text-primary">
                  <Check className="size-5" />
                </span>
                <h3 className="mt-4 font-heading text-base font-bold">{point.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{point.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <SectionHeading
              eyebrow="Why Get Hired KE"
              title="Why get career support from Get Hired KE?"
              copy="Get Hired KE does not just show you opportunities. We also help you prepare for them with clear, practical support."
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {trustPoints.map((point) => (
                <div
                  key={point}
                  className="flex items-start gap-3 rounded-lg border border-border bg-card p-4"
                >
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                    <Check className="size-4" />
                  </span>
                  <p className="text-sm font-semibold leading-6">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Choose your path"
            title="Do it yourself or get professional help."
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <SupportPanel
              title="Learn for free"
              text="Explore practical career guides, checklists and resources in the Get Hired KE Career Hub."
              items={[
                "CV guides",
                "Interview guides",
                "Cover letter guides",
                "Career tips",
                "Free career resources",
              ]}
              cta="Explore Career Hub"
              to="/career-hub"
            />
            <SupportPanel
              title="Get professional support"
              text="Prefer someone to help you prepare? Choose a professional service that fits your needs."
              items={[
                "CV Revamp",
                "Cover Letter Writing",
                "Interview Preparation",
                "Application Support",
              ]}
              cta="Choose a Service"
              to="/services"
              emphasized
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="rounded-lg border border-border bg-card p-6 sm:p-8 md:flex md:items-center md:justify-between md:gap-8">
          <div className="max-w-2xl">
            <ShieldCheck className="size-7 text-primary" />
            <h2 className="mt-4 font-heading text-2xl font-extrabold sm:text-3xl">
              Ready to strengthen your next application?
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              Choose the support you need and take the next step toward presenting yourself
              professionally.
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row md:mt-0">
            <Button asChild size="lg">
              <Link to="/services/$slug" params={{ slug: "cv-revamp" }}>
                Get Started <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        <div className="overflow-hidden rounded-lg bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12 sm:py-16">
          <MessageCircle className="mx-auto size-9" />
          <h2 className="mx-auto mt-5 max-w-2xl font-heading text-3xl font-extrabold sm:text-4xl">
            Never miss your next opportunity.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-primary-foreground/80">
            Join the Get Hired KE WhatsApp channel for fresh jobs, internships, scholarships and
            career updates.
          </p>
          <Button asChild variant="gold" size="lg" className="mt-7">
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
              <MessageCircle className="size-5" />
              Join Get Hired KE on WhatsApp
            </a>
          </Button>
        </div>
      </section>
    </>
  );
}

function ServiceCard({ service }: { service: CareerService }) {
  const Icon = service.icon;

  return (
    <article
      className={`group flex h-full flex-col rounded-lg border bg-card p-5 transition duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-card ${service.featured ? "border-primary/35 shadow-card" : "border-border"}`}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary">
          <Icon className="size-5" />
        </span>
        {service.featured && (
          <span className="rounded-full bg-highlight-soft px-2.5 py-1 text-xs font-bold text-highlight-strong">
            Core service
          </span>
        )}
      </div>
      <h2 className="mt-5 font-heading text-xl font-bold text-card-foreground">{service.title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{service.description}</p>
      <div className="mt-4 rounded-md border border-border bg-surface px-3 py-2">
        <p className="font-heading text-base font-extrabold text-foreground">
          {service.pricingLabel}
        </p>
        {service.pricingSubtext && (
          <p className="mt-0.5 text-xs font-semibold text-muted-foreground">
            {service.pricingSubtext}
          </p>
        )}
      </div>
      <ul className="mt-5 space-y-2">
        {service.benefits.slice(0, service.secondary ? 4 : 5).map((benefit) => (
          <li key={benefit} className="flex gap-2 text-sm leading-5 text-muted-foreground">
            <Check className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-5">
        <Button asChild variant={service.featured ? "primary" : "secondary"}>
          <Link to="/services/$slug" params={{ slug: service.slug }}>
            {service.cta} <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </article>
  );
}

function PackageCard({ item }: { item: ServicePackage }) {
  return (
    <article
      className={`relative flex h-full flex-col rounded-lg border bg-card p-5 transition duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-card ${item.popular ? "border-primary/50 shadow-card ring-1 ring-primary/10" : "border-border"}`}
    >
      {item.popular && (
        <span className="absolute right-4 top-4 rounded-full bg-highlight px-2.5 py-1 text-xs font-extrabold uppercase text-highlight-foreground">
          Most Popular
        </span>
      )}
      <h3 className="pr-24 font-heading text-sm font-extrabold uppercase tracking-wide text-foreground">
        {item.title}
      </h3>
      <p className="mt-4 font-heading text-4xl font-extrabold leading-none text-primary">
        {item.price}
      </p>
      <p className="mt-3 border-b border-border pb-4 text-sm font-semibold leading-5 text-muted-foreground">
        Best for: {item.bestFor}
      </p>
      <ul className="mt-5 space-y-2">
        {item.features.map((feature) => (
          <li key={feature} className="flex gap-2 text-sm leading-5 text-muted-foreground">
            <Check className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-6">
        <Button asChild variant={item.popular ? "primary" : "secondary"} className="w-full">
          <Link to="/services/$slug" params={{ slug: item.serviceSlug }}>
            {item.cta} <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </article>
  );
}

function SupportPanel({
  title,
  text,
  items,
  cta,
  to,
  emphasized = false,
}: {
  title: string;
  text: string;
  items: string[];
  cta: string;
  to: "/career-hub" | "/services";
  emphasized?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-6 ${emphasized ? "border-primary/35 bg-card" : "border-border bg-card"}`}
    >
      <h2 className="font-heading text-xl font-bold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <p key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
            <Check className="size-4 text-primary" />
            {item}
          </p>
        ))}
      </div>
      <Button asChild variant={emphasized ? "primary" : "secondary"} className="mt-6">
        <Link to={to}>
          {cta} <ArrowRight className="size-4" />
        </Link>
      </Button>
    </div>
  );
}
