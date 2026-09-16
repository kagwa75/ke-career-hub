import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowRight,
  BookOpenText,
  BriefcaseBusiness,
  Check,
  FileCheck2,
  HeartHandshake,
  MessageCircle,
  Search,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/career-hub/section-heading";
import { Button } from "@/components/ui/button";
import { WHATSAPP_URL } from "@/data/jobs";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      {
        title: "About Get Hired KE | Jobs, Career Opportunities & Resources in Kenya",
      },
      {
        name: "description",
        content:
          "Learn about Get Hired KE, a growing career platform helping people discover job opportunities, internships, career resources and professional support in Kenya.",
      },
      {
        property: "og:title",
        content: "About Get Hired KE | Jobs, Career Opportunities & Resources in Kenya",
      },
      {
        property: "og:description",
        content:
          "Learn about Get Hired KE, a growing career platform helping people discover job opportunities, internships, career resources and professional support in Kenya.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const workItems = [
  {
    title: "Jobs & Opportunities",
    text: "Discover jobs, internships, graduate opportunities and other career opportunities from across Kenya.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Career Hub",
    text: "Access practical guides and resources covering CVs, interviews, applications, careers and more.",
    icon: BookOpenText,
    cta: "Explore Career Hub",
    to: "/career-hub",
  },
  {
    title: "Career Services",
    text: "Get professional support with CVs, cover letters, interview preparation and more.",
    icon: FileCheck2,
    cta: "Explore Services",
    to: "/services",
  },
  {
    title: "Community",
    text: "Stay connected through the Get Hired KE WhatsApp community and career updates.",
    icon: Users,
    cta: "Join WhatsApp",
    href: WHATSAPP_URL,
  },
];

const sources = [
  "Official employer websites",
  "LinkedIn",
  "Government portals",
  "NGO websites",
  "Other reputable job platforms",
];

const principles = [
  {
    number: "01",
    title: "Relevant opportunities",
    text: "We focus on making useful opportunities easier for job seekers to discover.",
  },
  {
    number: "02",
    title: "Clear information",
    text: "We simplify job information so requirements, deadlines and application instructions are easier to understand.",
  },
  {
    number: "03",
    title: "Practical career support",
    text: "Beyond job listings, we provide career guides, resources and professional services.",
  },
  {
    number: "04",
    title: "Community-driven",
    text: "Get Hired KE grew from a real job-search challenge and continues to be built around the needs of job seekers.",
  },
];

const ecosystem = [
  { step: "Discover", text: "Jobs & Opportunities" },
  { step: "Learn", text: "Career Hub" },
  { step: "Prepare", text: "Career Services" },
  { step: "Connect", text: "Get Hired KE Community" },
  { step: "Grow", text: "Career development" },
];

const audiences = [
  "Students",
  "Graduates",
  "Entry-level job seekers",
  "Experienced professionals",
  "Career changers",
  "Job seekers returning to work",
];

function About() {
  return (
    <>
      <section className="border-b border-border bg-hero">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-20">
          <div className="max-w-4xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/70 px-3 py-1.5 text-sm font-bold text-primary">
              <Sparkles className="size-4" />
              ABOUT GET HIRED KE
            </p>
            <h1 className="mt-6 max-w-3xl font-heading text-4xl font-extrabold leading-[1.1] text-foreground sm:text-5xl lg:text-6xl">
              Making opportunities easier to find.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Get Hired KE is a career platform helping people discover verified job opportunities,
              practical career resources and professional support — all in one place.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/" search={{}}>
                  Explore Opportunities <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                  Join Our WhatsApp Channel <ArrowRight className="size-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <SectionHeading
            eyebrow="Our Story"
            title="From a job search challenge to a growing career platform."
            copy="Get Hired KE started from a real problem many job seekers understand."
          />
          <div className="rounded-lg border border-border bg-card p-6 text-sm leading-7 text-muted-foreground shadow-card sm:p-8 sm:text-base">
            <p>
              Get Hired KE was founded on 6 July 2026, after a simple realization during a personal
              job search: finding good opportunities shouldn't be so difficult.
            </p>
            <p className="mt-5">
              At the time, many friends were also looking for work and facing the same challenge.
              Opportunities were out there, but finding relevant ones, understanding the
              requirements and keeping up with new openings was not always easy.
            </p>
            <div className="my-6 rounded-md border border-primary/20 bg-primary-soft p-4">
              <p className="font-heading text-lg font-extrabold leading-7 text-foreground">
                Why not make it easier for other job seekers too?
              </p>
            </div>
            <p>
              Get Hired KE started as a community built around sharing useful opportunities with
              other job seekers. What began with a WhatsApp community has grown into a wider career
              platform designed to help people discover opportunities, prepare for them and continue
              developing their careers.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="What We Do"
            title="What we do"
            copy="We bring opportunities, career knowledge and practical support together in one place."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {workItems.map((item) => (
              <WorkCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SectionHeading
            eyebrow="Where We Find Opportunities"
            title="Opportunities you can discover with confidence."
            copy="We source opportunities from trusted platforms and verify the available information before sharing them with our community."
          />
          <div>
            <div className="grid gap-3 sm:grid-cols-2">
              {sources.map((source) => (
                <div
                  key={source}
                  className="flex items-start gap-3 rounded-lg border border-border bg-card p-4"
                >
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                    <Check className="size-4" />
                  </span>
                  <p className="text-sm font-semibold leading-6">{source}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 rounded-lg border border-border bg-surface p-5 text-sm leading-6 text-muted-foreground">
              We review opportunities before sharing them to ensure the information we provide is as
              accurate and useful as possible, including details such as the role, requirements,
              location, deadline and application process.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Why Get Hired KE"
            title="Why Get Hired KE?"
            copy="We don't just dump hundreds of jobs on people. We find opportunities, verify them, simplify the information and make them easy to discover."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((principle) => (
              <div key={principle.number} className="rounded-lg border border-border bg-card p-5">
                <p className="font-heading text-sm font-extrabold text-primary">
                  {principle.number}
                </p>
                <h3 className="mt-4 font-heading text-lg font-bold">{principle.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{principle.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:px-8">
        <MissionPanel
          eyebrow="OUR MISSION"
          title="Make career opportunities easier to discover, understand and pursue."
          text="Get Hired KE exists to make career opportunities easier to discover, understand and pursue by connecting job seekers with verified opportunities, practical career resources and professional support."
        />
        <MissionPanel
          eyebrow="OUR VISION"
          title="To become the go-to platform for opportunities and career growth in Kenya."
          text="Our vision is to become the go-to platform for opportunities and career growth in Kenya."
        />
      </section>

      <section className="border-y border-border bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="The Get Hired KE Ecosystem"
            title="More than a job board."
            copy="Get Hired KE is growing into a connected career ecosystem built around the complete job-seeker journey."
          />
          <div className="mt-8 grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr] lg:items-center">
            {ecosystem.map((item, index) => (
              <EcosystemStep key={item.step} item={item} showArrow={index < ecosystem.length - 1} />
            ))}
          </div>
          <p className="mt-6 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
            From discovering an opportunity to preparing an application and developing your career,
            Get Hired KE aims to support every stage of the journey, with the WhatsApp community as
            one part of the wider ecosystem.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SectionHeading
            eyebrow="Who We Serve"
            title="Built for people building their careers."
            copy="Get Hired KE is for anyone looking for opportunities or practical career guidance."
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {audiences.map((audience) => (
              <div
                key={audience}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-4"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary">
                  <Users className="size-4" />
                </span>
                <p className="text-sm font-semibold leading-6">{audience}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-border bg-card p-6 sm:p-8 md:flex md:items-center md:justify-between md:gap-8">
            <div className="max-w-2xl">
              <HeartHandshake className="size-7 text-primary" />
              <h2 className="mt-4 font-heading text-2xl font-extrabold sm:text-3xl">
                Growing with our community.
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                Get Hired KE started as a WhatsApp community and continues to grow as part of a
                wider career ecosystem helping people discover opportunities, learn, prepare and
                stay connected.
              </p>
            </div>
            <Button asChild size="lg" className="mt-6 md:mt-0">
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                <MessageCircle className="size-5" />
                Join Get Hired KE on WhatsApp <ArrowRight className="size-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="rounded-lg border border-border bg-card p-6 sm:p-8 md:flex md:items-center md:justify-between md:gap-8">
          <div className="max-w-2xl">
            <Search className="size-7 text-primary" />
            <h2 className="mt-4 font-heading text-2xl font-extrabold sm:text-3xl">
              Ready to find your next opportunity?
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              Explore the latest opportunities, build your career knowledge and get the support you
              need to take your next step.
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row md:mt-0">
            <Button asChild size="lg">
              <Link to="/" search={{}}>
                Browse Opportunities <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link to="/career-hub">Explore Career Hub</Link>
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
              Join Get Hired KE on WhatsApp <ArrowRight className="size-4" />
            </a>
          </Button>
        </div>
      </section>
    </>
  );
}

function WorkCard({
  item,
}: {
  item: {
    title: string;
    text: string;
    icon: LucideIcon;
    cta?: string;
    to?: "/career-hub" | "/services";
    href?: string;
  };
}) {
  const Icon = item.icon;

  return (
    <article className="flex h-full flex-col rounded-lg border border-border bg-card p-5 transition duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-card">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary">
        <Icon className="size-5" />
      </span>
      <h3 className="mt-5 font-heading text-lg font-bold">{item.title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
      {item.cta && item.to && (
        <div className="mt-auto pt-5">
          <Button asChild variant="secondary">
            <Link to={item.to}>
              {item.cta} <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      )}
      {item.cta && item.href && (
        <div className="mt-auto pt-5">
          <Button asChild variant="secondary">
            <a href={item.href} target="_blank" rel="noreferrer">
              {item.cta} <ArrowRight className="size-4" />
            </a>
          </Button>
        </div>
      )}
    </article>
  );
}

function MissionPanel({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div className="rounded-lg border border-primary/25 bg-card p-6 shadow-card sm:p-8">
      <p className="text-xs font-bold uppercase tracking-wide text-primary">{eyebrow}</p>
      <h2 className="mt-3 font-heading text-2xl font-extrabold leading-tight sm:text-3xl">
        {title}
      </h2>
      <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base">{text}</p>
    </div>
  );
}

function EcosystemStep({
  item,
  showArrow,
}: {
  item: { step: string; text: string };
  showArrow: boolean;
}) {
  return (
    <>
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-primary">{item.step}</p>
        <p className="mt-2 font-heading text-base font-bold leading-6">{item.text}</p>
      </div>
      {showArrow && (
        <div className="flex items-center justify-center text-primary">
          <ArrowRight className="hidden size-5 lg:block" />
          <ArrowDown className="size-5 lg:hidden" />
        </div>
      )}
    </>
  );
}
