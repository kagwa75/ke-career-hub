import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { careerServices, servicePackages } from "@/data/services";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = careerServices.find((item) => item.slug === params.slug);
    if (!service) throw notFound();
    return service;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData.title} | Get Hired KE Services` },
      { name: "description", content: loaderData.description },
      { property: "og:title", content: `${loaderData.title} | Get Hired KE Services` },
      { property: "og:description", content: loaderData.description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ServiceDetail,
});

function ServiceDetail() {
  const service = Route.useLoaderData();
  const Icon = service.icon;
  const relatedPackages = servicePackages.filter((item) => item.serviceSlug === service.slug);

  return (
    <>
      <section className="relative overflow-hidden bg-hero">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-20">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <ArrowLeft className="size-4" />
            Back to Services
          </Link>
          <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-primary">
                CAREER SUPPORT
              </p>
              <h1 className="mt-3 max-w-3xl font-heading text-4xl font-extrabold leading-[1.1] text-foreground sm:text-5xl">
                {service.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                {service.description}
              </p>
              <div className="mt-6 inline-flex flex-col rounded-lg border border-border bg-card px-4 py-3 shadow-card">
                <span className="font-heading text-lg font-extrabold text-foreground">
                  {service.pricingLabel}
                </span>
                {service.pricingSubtext && (
                  <span className="mt-1 text-xs font-semibold text-muted-foreground">
                    {service.pricingSubtext}
                  </span>
                )}
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link to="/contact">
                    Get Started <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link to="/career-hub">Explore Career Hub</Link>
                </Button>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-6 shadow-card">
              <span className="flex size-12 items-center justify-center rounded-md bg-primary-soft text-primary">
                <Icon className="size-6" />
              </span>
              <h2 className="mt-5 font-heading text-xl font-bold">
                What this service can help with
              </h2>
              <ul className="mt-5 space-y-3">
                {service.benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                    <Check className="mt-1 size-4 shrink-0 text-primary" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        {relatedPackages.length > 0 && (
          <div className="mb-8 rounded-lg border border-border bg-card p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-extrabold">Related package</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPackages.map((item) => (
                <div key={item.id} className="rounded-lg border border-border bg-surface p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-heading text-sm font-extrabold uppercase tracking-wide text-muted-foreground">
                      {item.title}
                    </h3>
                    {item.popular && (
                      <span className="rounded-full bg-highlight-soft px-2.5 py-1 text-xs font-bold uppercase text-highlight-strong">
                        Most Popular
                      </span>
                    )}
                  </div>
                  <p className="mt-4 font-heading text-3xl font-extrabold">{item.price}</p>
                  <ul className="mt-4 space-y-2">
                    {item.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex gap-2 text-sm leading-5 text-muted-foreground"
                      >
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="rounded-lg border border-border bg-card p-6 sm:p-8 md:flex md:items-center md:justify-between md:gap-8">
          <div>
            <Send className="size-7 text-primary" />
            <h2 className="mt-4 font-heading text-2xl font-extrabold">
              Ready to request this service?
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              The request workflow can connect here when service forms and payments are ready. For
              now, contact Get Hired KE to share the details for your support request.
            </p>
          </div>
          <Button asChild size="lg" className="mt-6 md:mt-0">
            <Link to="/contact">
              Contact Us <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
