import { useNavigate } from "@tanstack/react-router";
import { Eye, Plus, Save, Send, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { saveAdminJob } from "@/lib/jobs/admin-actions.server";
import {
  careerFields,
  employmentTypes,
  experienceLevels,
  jobStatuses,
  opportunityTypes,
  type Category,
  type Job,
  type JobFormInput,
  type JobPosition,
  type Organization,
} from "@/lib/jobs/types";
import type { z } from "zod";
import { jobFormSchema } from "@/lib/jobs/validation";

type ApplicationMethod = z.infer<typeof jobFormSchema>["applicationMethod"];
type FormState = Omit<
  JobFormInput,
  "applicationMethod" | "location" | "summary" | "responsibilities" | "requirements"
> & {
  applicationMethod: ApplicationMethod;
  location: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  positions: JobPosition[];
};

export function JobForm({
  job,
  categories,
  organizations,
}: {
  job?: Job | null;
  categories: Category[];
  organizations: Organization[];
}) {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>(() => toFormState(job, categories[0]?.id ?? ""));

  const organizationOptions = useMemo(() => organizations.map((item) => item.name), [organizations]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const submit = async (status?: FormState["status"]) => {
    setSaving(true);
    setError(null);
    try {
      const targetStatus = status ?? form.status;
      const payload = {
        ...form,
        status: targetStatus,
        verifiedAt: toISOString(form.verifiedAt),
        publishDate: toISOString(form.publishDate),
        scheduledFor: toISOString(form.scheduledFor),
        deadline: toISOString(form.deadline) || null,
      };
      const result = await saveAdminJob({ data: payload });
      if (targetStatus === "published") {
        toast.success("Job published successfully.");
        await navigate({ to: "/admin/jobs/$jobId", params: { jobId: result.jobId } });
      } else {
        await navigate({ to: "/admin/jobs/$jobId/edit", params: { jobId: result.jobId } });
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The job could not be saved. Check the form and try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      {error && <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}
      <Section title="Basic information">
        <Field label="Job title"><Input value={form.title} onChange={(event) => set("title", event.target.value)} /></Field>
        <Field label="Organization">
          <Input
            list="organizations"
            value={form.organizationName}
            onChange={(event) => {
              const organizationName = event.target.value;
              const existing = organizations.find(
                (item) => item.name.toLowerCase() === organizationName.trim().toLowerCase(),
              );
              setForm((current) => ({
                ...current,
                organizationName,
                organizationId: existing?.id,
              }));
            }}
          />
          <datalist id="organizations">{organizationOptions.map((name) => <option key={name} value={name} />)}</datalist>
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Location (optional)"><Input value={form.location} onChange={(event) => set("location", event.target.value)} /></Field>
          <Field label="County"><Input value={form.county ?? ""} onChange={(event) => set("county", event.target.value)} /></Field>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Opportunity type">
            <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.opportunityType} onChange={(event) => set("opportunityType", event.target.value)}>
              {opportunityTypes.filter((item) => item.slug !== "all").map((item) => <option key={item.slug} value={item.slug}>{item.label}</option>)}
            </select>
          </Field>
          <Field label="Category">
            <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.categoryId} onChange={(event) => set("categoryId", event.target.value)}>
              {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </Field>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Field">
            <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.field ?? ""} onChange={(event) => set("field", event.target.value)}>
              <option value="">Select field</option>
              {careerFields.map((item) => <option key={item}>{item}</option>)}
            </select>
          </Field>
          <Field label="Experience level">
            <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.experienceLevel ?? ""} onChange={(event) => set("experienceLevel", event.target.value)}>
              <option value="">Select experience</option>
              {experienceLevels.map((item) => <option key={item}>{item}</option>)}
            </select>
          </Field>
          <Field label="Employment type">
            <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.employmentType ?? ""} onChange={(event) => set("employmentType", event.target.value)}>
              <option value="">Select type</option>
              {employmentTypes.map((item) => <option key={item}>{item}</option>)}
            </select>
          </Field>
        </div>
      </Section>

      <Section title="Content">
        <Field label="Summary (optional)"><Textarea value={form.summary} onChange={(event) => set("summary", event.target.value)} /></Field>
        <Field label="Description"><Textarea value={form.description ?? ""} onChange={(event) => set("description", event.target.value)} /></Field>
        <ListField label="Responsibilities (optional)" items={form.responsibilities} onChange={(items) => set("responsibilities", items)} />
        <ListField label="Requirements (optional)" items={form.requirements} onChange={(items) => set("requirements", items)} />
        <Field label="Qualifications (optional)"><Textarea value={form.qualifications ?? ""} onChange={(event) => set("qualifications", event.target.value)} /></Field>
      </Section>

      <Section title="Positions in this announcement">
        <p className="text-sm text-muted-foreground">Use this for a single announcement that lists several roles. Leave it empty for a single-role opportunity.</p>
        {form.positions.map((position, index) => (
          <div key={index} className="space-y-3 rounded-md border border-border p-4">
            <div className="grid gap-3 md:grid-cols-3">
              <Field label={`Position ${index + 1}`}><Input value={position.title} onChange={(event) => set("positions", form.positions.map((item, itemIndex) => itemIndex === index ? { ...item, title: event.target.value } : item))} /></Field>
              <Field label="Number of openings (optional)"><Input value={position.positionCount} onChange={(event) => set("positions", form.positions.map((item, itemIndex) => itemIndex === index ? { ...item, positionCount: event.target.value } : item))} /></Field>
              <Field label="Salary (optional)"><Input value={position.salary} onChange={(event) => set("positions", form.positions.map((item, itemIndex) => itemIndex === index ? { ...item, salary: event.target.value } : item))} /></Field>
            </div>
            <div className="flex gap-3">
              <Field label="Role details (optional)"><Textarea value={position.details} onChange={(event) => set("positions", form.positions.map((item, itemIndex) => itemIndex === index ? { ...item, details: event.target.value } : item))} /></Field>
              <Button type="button" variant="ghost" size="icon" className="mt-6 shrink-0" onClick={() => set("positions", form.positions.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Remove position ${index + 1}`}><Trash2 className="size-4" /></Button>
            </div>
          </div>
        ))}
        <Button type="button" variant="secondary" size="sm" onClick={() => set("positions", [...form.positions, { title: "", positionCount: "", salary: "", details: "" }])}>
          <Plus className="size-4" /> Add position
        </Button>
      </Section>

      <Section title="Application">
        <div className="grid gap-4 md:grid-cols-4">
          <Field label="Application method">
            <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.applicationMethod} onChange={(event) => set("applicationMethod", event.target.value as ApplicationMethod)}>
              <option value="apply_online">Apply Online</option>
              <option value="email">Email</option>
              <option value="employer_website">Employer Website</option>
              <option value="other">Other</option>
            </select>
          </Field>
          <Field label="Application URL"><Input value={form.applicationUrl ?? ""} onChange={(event) => set("applicationUrl", event.target.value)} /></Field>
          <Field label="Application email"><Input value={form.applicationEmail ?? ""} onChange={(event) => set("applicationEmail", event.target.value)} /></Field>
          <Field label="Application phone"><Input value={form.applicationPhone ?? ""} onChange={(event) => set("applicationPhone", event.target.value)} /></Field>
        </div>
        <Field label="Application instructions"><Textarea value={form.applicationInstructions} onChange={(event) => set("applicationInstructions", event.target.value)} /></Field>
      </Section>

      <Section title="Source and verification">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Source name"><Input value={form.sourceName} onChange={(event) => set("sourceName", event.target.value)} /></Field>
          <Field label="Source URL (optional)" hint="Add a link when the opportunity has an online source."><Input value={form.sourceUrl ?? ""} onChange={(event) => set("sourceUrl", event.target.value)} /></Field>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Verification status">
            <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.verificationStatus} onChange={(event) => set("verificationStatus", event.target.value as FormState["verificationStatus"])}>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </Field>
          <Field label="Verified at"><Input type="datetime-local" value={toLocalInput(form.verifiedAt)} onChange={(event) => set("verifiedAt", event.target.value)} /></Field>
          <Field label="Verified by"><Input value={form.verifiedBy ?? ""} onChange={(event) => set("verifiedBy", event.target.value)} /></Field>
        </div>
      </Section>

      <Section title="Publishing">
        <div className="grid gap-4 md:grid-cols-4">
          <Field label="Status">
            <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.status} onChange={(event) => set("status", event.target.value as FormState["status"])}>
              {jobStatuses.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </Field>
          <Field label="Deadline (optional)" hint="Leave blank if the employer did not specify a closing date."><Input type="datetime-local" value={toLocalInput(form.deadline)} onChange={(event) => set("deadline", event.target.value)} /></Field>
          <Field label="Publish date"><Input type="datetime-local" value={toLocalInput(form.publishDate)} onChange={(event) => set("publishDate", event.target.value)} /></Field>
          <Field label="Scheduled for"><Input type="datetime-local" value={toLocalInput(form.scheduledFor)} onChange={(event) => set("scheduledFor", event.target.value)} /></Field>
        </div>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <Checkbox checked={form.featured} onCheckedChange={(checked) => set("featured", checked === true)} />
          Featured opportunity
        </label>
      </Section>

      <div className="sticky bottom-0 z-10 flex flex-wrap justify-end gap-2 border-t border-border bg-background/95 px-4 py-4 backdrop-blur">
        {job && (
          <Button type="button" variant="secondary" onClick={() => navigate({ to: "/admin/jobs/$jobId", params: { jobId: job.id } })}>
            <Eye className="size-4" />
            Preview
          </Button>
        )}
        <Button type="button" variant="secondary" disabled={saving} onClick={() => submit("draft")}>
          <Save className="size-4" />
          Save Draft
        </Button>
        <Button type="button" variant="gold" disabled={saving} onClick={() => submit("scheduled")}>
          Schedule
        </Button>
        <Button type="button" disabled={saving} onClick={() => submit("published")}>
          <Send className="size-4" />
          Publish
        </Button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <h2 className="font-heading text-lg font-extrabold">{title}</h2>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <Label className="grid gap-2 text-sm font-semibold">
      <span>{label}</span>
      {children}
      {hint && <span className="text-xs font-normal text-muted-foreground">{hint}</span>}
    </Label>
  );
}

function ListField({ label, items, onChange }: { label: string; items: string[]; onChange: (items: string[]) => void }) {
  return (
    <div>
      <Label className="text-sm font-semibold">{label}</Label>
      <div className="mt-2 space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input value={item} onChange={(event) => onChange(items.map((value, itemIndex) => itemIndex === index ? event.target.value : value))} />
            <Button type="button" variant="ghost" size="icon" onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Remove ${label} item`}>
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="secondary" size="sm" className="mt-2" onClick={() => onChange([...items, ""])}>
        <Plus className="size-4" />
        Add item
      </Button>
    </div>
  );
}

function toFormState(job: Job | null | undefined, fallbackCategoryId: string): FormState {
  if (!job) {
    return {
      title: "",
      organizationName: "",
      location: "",
      county: "",
      opportunityType: "job",
      categoryId: fallbackCategoryId,
      field: "",
      experienceLevel: "",
      employmentType: "",
      salary: "",
      summary: "",
      description: "",
      responsibilities: [""],
      requirements: [""],
      positions: [],
      qualifications: "",
      applicationMethod: "apply_online",
      applicationUrl: "",
      applicationEmail: "",
      applicationPhone: "",
      applicationInstructions: "",
      sourceName: "",
      sourceUrl: "",
      verificationStatus: "pending",
      verifiedAt: "",
      verifiedBy: "",
      status: "draft",
      featured: false,
      publishDate: "",
      scheduledFor: "",
      deadline: "",
    };
  }

  return {
    id: job.id,
    slug: job.slug,
    title: job.title,
    organizationId: job.organizationId ?? undefined,
    organizationName: job.company,
    location: job.location,
    county: job.county,
    opportunityType: job.opportunityType,
    categoryId: job.categoryId ?? fallbackCategoryId,
    field: job.field,
    experienceLevel: job.experience,
    employmentType: job.employment,
    salary: job.salary,
    summary: job.summary,
    description: job.description,
    responsibilities: job.responsibilities.length ? job.responsibilities : [""],
    requirements: job.requirements.length ? job.requirements : [""],
    positions: job.positions ?? [],
    qualifications: job.qualifications,
    applicationMethod: job.applicationMethod as ApplicationMethod,
    applicationUrl: job.applicationUrl,
    applicationEmail: job.applicationEmail,
    applicationPhone: job.applicationPhone,
    applicationInstructions: job.applicationInstructions,
    sourceName: job.source,
    sourceUrl: job.sourceUrl,
    verificationStatus: job.verificationStatus,
    verifiedAt: job.verifiedAtISO ?? job.verifiedAt,
    verifiedBy: job.verifiedBy,
    status: job.status,
    featured: job.featured,
    publishDate: job.publishDate ?? "",
    scheduledFor: job.scheduledFor ?? "",
    deadline: job.deadlineISO,
  };
}

function toLocalInput(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function toISOString(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString();
}
