import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BriefcaseBusiness,
  Mail,
  MessageCircle,
  Phone,
  type LucideIcon,
} from "lucide-react";
import type { FormEvent, ReactNode } from "react";
import { useId, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SectionHeading } from "@/components/career-hub/section-heading";
import { WHATSAPP_URL } from "@/lib/jobs/types";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact | Get Hired KE" },
      {
        name: "description",
        content:
          "Contact Get Hired KE through WhatsApp, phone or email for career support, partnerships and enquiries.",
      },
      { property: "og:title", content: "Contact | Get Hired KE" },
      {
        property: "og:description",
        content: "Reach Get Hired KE through WhatsApp, phone or email for support and enquiries.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

const whatsappContactUrl = "https://wa.me/254746221954";
const phoneHref = "tel:+254746221954";
const emailHref = "mailto:support@bermudaappstudios.online";

const reasons = [
  "General enquiry",
  "Career services",
  "Job opportunity",
  "Partnership",
  "Employer enquiry",
  "Website issue",
  "Other",
];

const faqs = [
  {
    question: "How can I request a CV service?",
    answer:
      "You can contact us through WhatsApp or email and tell us which service you need. We'll guide you through the next steps.",
  },
  {
    question: "How can I share a job opportunity with Get Hired KE?",
    answer:
      "Contact us through WhatsApp or email with the opportunity details. We'll review the information and guide you on the next steps.",
  },
  {
    question: "How can I partner with Get Hired KE?",
    answer:
      "Send us your partnership idea through WhatsApp or email, or select 'Partnership' in the contact form.",
  },
  {
    question: "How long does it take to receive a CV or other career service?",
    answer:
      "Turnaround time depends on the service and the information provided. We’ll confirm the expected delivery time when your service is requested.",
  },
  {
    question: "Where can I find the latest jobs?",
    answer:
      "Follow the Get Hired KE WhatsApp channel for fresh jobs, internships, scholarships and career updates.",
  },
];

type FieldKey = "fullName" | "email" | "reason" | "message";

function Contact() {
  const formId = useId();
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [notice, setNotice] = useState("");

  function chooseReason(value: string) {
    setReason(value);
    setNotice("");
    document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const nextErrors: Partial<Record<FieldKey, string>> = {};

    if (!String(formData.get("fullName") || "").trim()) {
      nextErrors.fullName = "Please enter your full name.";
    }

    if (!String(formData.get("email") || "").trim()) {
      nextErrors.email = "Please enter your email address.";
    }

    if (!reason) {
      nextErrors.reason = "Please choose a reason.";
    }

    if (!String(formData.get("message") || "").trim()) {
      nextErrors.message = "Please enter your message.";
    }

    setErrors(nextErrors);
    setNotice(
      Object.keys(nextErrors).length
        ? ""
        : "This form is ready for a submission service to be connected. For now, please send your message through WhatsApp, phone or email.",
    );
  }

  return (
    <>
      <section className="border-b border-border bg-hero">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-wide text-primary">GET IN TOUCH</p>
            <h1 className="mt-3 font-heading text-4xl font-extrabold leading-[1.1] text-foreground sm:text-5xl">
              We're here to help.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Have a question, need career support, or want to work with Get Hired KE? Reach out
              through WhatsApp or email and we'll be happy to hear from you.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading
          eyebrow="Contact options"
          title="How can we help?"
          copy="Choose the contact method that's most convenient for you."
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <ContactCard
            icon={MessageCircle}
            title="WhatsApp or Call"
            description="Reach us directly for career services, questions, general enquiries and support."
            actions={
              <>
                <Button asChild>
                  <a href={whatsappContactUrl} target="_blank" rel="noreferrer">
                    Chat on WhatsApp <ArrowRight className="size-4" />
                  </a>
                </Button>
                <Button asChild variant="secondary">
                  <a href={phoneHref}>
                    <Phone className="size-4" />
                    Call us <ArrowRight className="size-4" />
                  </a>
                </Button>
              </>
            }
          />
          <ContactCard
            icon={Mail}
            title="Email Us"
            description="For general enquiries, partnerships, service questions and other matters, send us an email."
            actions={
              <Button asChild>
                <a href={emailHref}>
                  Send an Email <ArrowRight className="size-4" />
                </a>
              </Button>
            }
          />
        </div>
        <div className="mt-5 rounded-lg border border-primary/20 bg-primary-soft p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div>
            <h2 className="font-heading text-lg font-bold">Prefer WhatsApp?</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Most Get Hired KE enquiries are handled directly through WhatsApp for a faster
              response.
            </p>
          </div>
          <Button asChild className="mt-4 sm:mt-0">
            <a href={whatsappContactUrl} target="_blank" rel="noreferrer">
              Chat with Get Hired KE <ArrowRight className="size-4" />
            </a>
          </Button>
        </div>
      </section>

      <section id="contact-form" className="border-y border-border bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Message"
            title="Send us a message"
            copy="Have something specific you'd like to ask? Fill out the form and we'll get back to you."
          />
          <form
            noValidate
            onSubmit={handleSubmit}
            className="mt-8 rounded-lg border border-border bg-card p-5 sm:p-6"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id={`${formId}-full-name`} label="Full Name" error={errors.fullName}>
                <Input id={`${formId}-full-name`} name="fullName" autoComplete="name" />
              </Field>
              <Field id={`${formId}-email`} label="Email Address" error={errors.email}>
                <Input id={`${formId}-email`} name="email" type="email" autoComplete="email" />
              </Field>
              <Field id={`${formId}-phone`} label="Phone Number (optional)">
                <Input id={`${formId}-phone`} name="phone" type="tel" autoComplete="tel" />
              </Field>
              <Field id={`${formId}-reason`} label="Reason for contacting us" error={errors.reason}>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger id={`${formId}-reason`} className="h-11 bg-background">
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {reasons.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <div className="mt-5">
              <Field id={`${formId}-message`} label="Message" error={errors.message}>
                <Textarea id={`${formId}-message`} name="message" className="min-h-32" />
              </Field>
            </div>
            {notice && (
              <p className="mt-5 rounded-md border border-primary/20 bg-primary-soft px-4 py-3 text-sm leading-6 text-foreground">
                {notice}
              </p>
            )}
            <Button type="submit" className="mt-6">
              Send Message <ArrowRight className="size-4" />
            </Button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="rounded-lg border border-border bg-card p-6 sm:p-8 md:flex md:items-center md:justify-between md:gap-8">
          <div className="max-w-2xl">
            <BriefcaseBusiness className="size-7 text-primary" />
            <h2 className="mt-4 font-heading text-2xl font-extrabold sm:text-3xl">
              Want to work with Get Hired KE?
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              We're open to partnerships, employer opportunities and collaborations that create
              value for our job-seeking community.
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row md:mt-0">
            <Button type="button" onClick={() => chooseReason("Partnership")}>
              Partner With Us <ArrowRight className="size-4" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => chooseReason("Job opportunity")}
            >
              Share an Opportunity <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Quick help" title="Frequently asked questions" />
          <Accordion
            type="single"
            collapsible
            className="mt-8 rounded-lg border border-border bg-card px-5"
          >
            {faqs.map((item) => (
              <AccordionItem key={item.question} value={item.question}>
                <AccordionTrigger className="font-heading text-base font-bold hover:text-primary hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-6 text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <Button asChild variant="secondary" className="mt-6">
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
              <MessageCircle className="size-4" />
              Join Get Hired KE on WhatsApp <ArrowRight className="size-4" />
            </a>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
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

function ContactCard({
  icon: Icon,
  title,
  description,
  actions,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actions: ReactNode;
}) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-border bg-card p-5 shadow-card sm:p-6">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary">
        <Icon className="size-5" />
      </span>
      <h2 className="mt-5 font-heading text-xl font-bold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
      <div className="mt-auto flex flex-col gap-3 pt-6 sm:flex-row">{actions}</div>
    </article>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string | undefined;
  children: ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="mt-2">{children}</div>
      {error && <p className="mt-2 text-sm font-semibold text-destructive">{error}</p>}
    </div>
  );
}
