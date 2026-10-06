import { useState } from "react";
import { AlertTriangle, Check, LoaderCircle, Sparkles } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { extractQuickImport, saveQuickImportDrafts } from "@/lib/jobs/import-actions.server";
import type { Category, Organization } from "@/lib/jobs/types";
import { opportunityTypes } from "@/lib/jobs/types";
import type { ExtractedOpportunity } from "@/lib/jobs/import-schema";

type Duplicate = {
  id: string;
  title: string;
  organizationName: string;
  status: string;
  sourceUrl: string | null;
} | null;
type ExtractedReview = ExtractedOpportunity & {
  category_id: string | null;
  organization_id: string | null;
  duplicate: Duplicate;
};
type ReviewRecord = {
  importId: string;
  selected: boolean;
  title: string;
  organizationName: string;
  organizationId: string | null;
  createOrganization: boolean;
  location: string;
  county: string;
  opportunityType: string;
  categoryId: string;
  field: string;
  experienceLevel: string;
  employmentType: string;
  summary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  qualifications: string[];
  applicationMethod: string;
  applicationUrl: string;
  applicationEmail: string;
  applicationPhone: string;
  applicationInstructions: string;
  deadline: string;
  sourceName: string;
  sourceUrl: string;
  missingInformation: string[];
  needsReview: boolean;
  duplicate: Duplicate;
  allowDuplicate: boolean;
  saveError: string;
};

const APPLICATION_METHODS = [
  "Online",
  "Email",
  "WhatsApp",
  "Phone",
  "Website",
  "Physical application",
  "Other",
];

export function QuickImport({
  categories,
  organizations,
}: {
  categories: Category[];
  organizations: Organization[];
}) {
  const [rawText, setRawText] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [records, setRecords] = useState<ReviewRecord[]>([]);

  async function handleExtract() {
    setError("");
    setNotice("");
    setExtracting(true);
    try {
      const extracted = await extractQuickImport({ data: { rawText } });
      setRecords(extracted.map(toReviewRecord));
      if (extracted.length === 0)
        setError("No opportunities were detected. Check the text and try again.");
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "AI extraction is temporarily unavailable. Please try again.",
      );
    } finally {
      setExtracting(false);
    }
  }

  function updateRecord(index: number, patch: Partial<ReviewRecord>) {
    setRecords((current) =>
      current.map((record, recordIndex) =>
        recordIndex === index ? { ...record, ...patch } : record,
      ),
    );
  }

  function selectAll(selected: boolean) {
    setRecords((current) => current.map((record) => ({ ...record, selected })));
  }

  async function saveSelected() {
    const selected = records.filter((record) => record.selected);
    if (!selected.length) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const result = await saveQuickImportDrafts({ data: { opportunities: selected } });
      const resultById = new Map(result.results.map((item) => [item.importId, item]));
      setRecords((current) =>
        current.flatMap((record) => {
          const saved = resultById.get(record.importId);
          if (!saved) return [record];
          return saved.ok
            ? []
            : [
                {
                  ...record,
                  selected: true,
                  saveError: saved.error ?? "This opportunity could not be saved.",
                  ...(saved.duplicate ? { duplicate: saved.duplicate } : {}),
                },
              ];
        }),
      );
      const failedCount = result.results.length - result.savedCount;
      setNotice(
        failedCount
          ? `${result.savedCount} saved as drafts. ${failedCount} needs correction; its review data is still here.`
          : `${result.savedCount} ${result.savedCount === 1 ? "opportunity" : "opportunities"} saved as drafts.`,
      );
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "The selected opportunities could not be saved.",
      );
    } finally {
      setSaving(false);
    }
  }

  const selectedCount = records.filter((record) => record.selected).length;
  const totalWarnings = records.reduce((total, record) => total + warningsFor(record).length, 0);

  return (
    <>
      <AdminPageHeader
        title="Quick Import"
        description="Paste one or more raw job posts and GHK will extract structured opportunity records for review. Nothing is saved or published until you choose to save drafts."
      />

      <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <Label htmlFor="quick-import-source" className="text-sm font-semibold">
          Raw opportunity posts
        </Label>
        <Textarea
          id="quick-import-source"
          value={rawText}
          onChange={(event) => setRawText(event.target.value.slice(0, 100_000))}
          maxLength={100_000}
          rows={10}
          className="mt-2 min-h-56"
          placeholder="Paste job posts here..."
          disabled={extracting}
        />
        <div className="mt-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            {rawText.length.toLocaleString()} / 100,000 characters · Up to 50 opportunities per
            import
          </p>
          <Button
            type="button"
            onClick={handleExtract}
            disabled={extracting || rawText.trim().length < 10}
          >
            {extracting ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            {extracting ? "Extracting opportunities…" : "Extract Opportunities"}
          </Button>
        </div>
      </section>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </p>
      )}
      {notice && (
        <p
          role="status"
          className="mt-4 rounded-md border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-foreground"
        >
          {notice}
        </p>
      )}

      {records.length > 0 && (
        <section className="mt-7 space-y-4">
          <div className="flex flex-col justify-between gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-heading text-xl font-extrabold">Review opportunities</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {records.length} detected · {totalWarnings} review warnings ·{" "}
                {
                  records.filter((record) => record.needsReview || warningsFor(record).length > 0)
                    .length
                }{" "}
                requiring review
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="secondary" onClick={() => selectAll(true)}>
                Select All
              </Button>
              <Button type="button" variant="secondary" onClick={() => selectAll(false)}>
                Clear Selection
              </Button>
            </div>
          </div>

          {records.map((record, index) => (
            <ReviewCard
              key={record.importId}
              record={record}
              index={index}
              categories={categories}
              organizations={organizations}
              onChange={(patch) => updateRecord(index, patch)}
            />
          ))}

          <div className="sticky bottom-0 z-10 flex flex-col justify-between gap-3 rounded-lg border border-border bg-background/95 p-4 backdrop-blur sm:flex-row sm:items-center">
            <p className="text-sm text-muted-foreground">
              Selected: {selectedCount} · All saved records will be drafts.
            </p>
            <Button type="button" onClick={saveSelected} disabled={saving || selectedCount === 0}>
              {saving ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" />
              )}
              {saving ? "Saving drafts…" : "Save Selected as Drafts"}
            </Button>
          </div>
        </section>
      )}
    </>
  );
}

function ReviewCard({
  record,
  index,
  categories,
  organizations,
  onChange,
}: {
  record: ReviewRecord;
  index: number;
  categories: Category[];
  organizations: Organization[];
  onChange: (patch: Partial<ReviewRecord>) => void;
}) {
  const warnings = warningsFor(record);
  const organizationOptions = organizations.map((item) => item.name);

  function setOrganizationName(name: string) {
    const existing = organizations.find(
      (item) => item.name.toLocaleLowerCase() === name.trim().toLocaleLowerCase(),
    );
    onChange({
      organizationName: existing?.name ?? name,
      organizationId: existing?.id ?? null,
      createOrganization: existing ? false : record.createOrganization,
    });
  }

  return (
    <article className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <Checkbox
          checked={record.selected}
          onCheckedChange={(checked) => onChange({ selected: checked === true })}
          aria-label={`Select opportunity ${index + 1}`}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-bold uppercase tracking-wide text-primary">
              Opportunity {index + 1}
            </p>
            {(record.needsReview || warnings.length > 0) && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900">
                Needs review
              </span>
            )}
          </div>
          <Input
            className="mt-2 font-heading text-lg font-bold"
            value={record.title}
            onChange={(event) => onChange({ title: event.target.value })}
            placeholder="Job title"
          />
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="Organization">
              <Input
                list={`org-options-${record.importId}`}
                value={record.organizationName}
                onChange={(event) => setOrganizationName(event.target.value)}
                placeholder="Organization not specified"
              />
              <datalist id={`org-options-${record.importId}`}>
                {organizationOptions.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
              {!!record.organizationName && !record.organizationId && (
                <label className="mt-2 flex items-center gap-2 text-xs font-normal text-muted-foreground">
                  <Checkbox
                    checked={record.createOrganization}
                    onCheckedChange={(checked) =>
                      onChange({ createOrganization: checked === true })
                    }
                  />
                  Create this organization when saving the draft
                </label>
              )}
            </Field>
            <Field label="Location (optional)">
              <Input
                value={record.location}
                onChange={(event) => onChange({ location: event.target.value })}
                placeholder="Not specified"
              />
            </Field>
            <Field label="County">
              <Input
                value={record.county}
                onChange={(event) => onChange({ county: event.target.value })}
              />
            </Field>
            <Field label="Opportunity type">
              <select
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={record.opportunityType}
                onChange={(event) => onChange({ opportunityType: event.target.value })}
              >
                {opportunityTypes
                  .filter((item) => item.slug !== "all")
                  .map((item) => (
                    <option key={item.slug} value={item.slug}>
                      {item.label}
                    </option>
                  ))}
              </select>
            </Field>
            <Field label="Category">
              <select
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={record.categoryId}
                onChange={(event) => onChange({ categoryId: event.target.value })}
              >
                <option value="">Select category</option>
                {categories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Field">
              <Input
                value={record.field}
                onChange={(event) => onChange({ field: event.target.value })}
              />
            </Field>
            <Field label="Experience level">
              <Input
                value={record.experienceLevel}
                maxLength={200}
                onChange={(event) => onChange({ experienceLevel: event.target.value })}
              />
            </Field>
            <Field label="Employment type">
              <Input
                value={record.employmentType}
                onChange={(event) => onChange({ employmentType: event.target.value })}
              />
            </Field>
            <Field label="Deadline">
              <Input
                type="date"
                value={record.deadline}
                onChange={(event) => onChange({ deadline: event.target.value })}
              />
              <span className="text-xs font-normal text-muted-foreground">
                {record.deadline ? "" : "Deadline not specified"}
              </span>
            </Field>
          </div>

          <div className="mt-5 grid gap-4">
            <Field label="Summary (optional)">
              <Textarea
                rows={3}
                value={record.summary}
                onChange={(event) => onChange({ summary: event.target.value })}
              />
            </Field>
            <Field label="Description (optional)">
              <Textarea
                rows={5}
                value={record.description}
                onChange={(event) => onChange({ description: event.target.value })}
              />
            </Field>
            <ArrayField
              label="Responsibilities (optional)"
              values={record.responsibilities}
              onChange={(values) => onChange({ responsibilities: values })}
            />
            <ArrayField
              label="Requirements (optional)"
              values={record.requirements}
              onChange={(values) => onChange({ requirements: values })}
            />
            <ArrayField
              label="Qualifications (optional)"
              values={record.qualifications}
              onChange={(values) => onChange({ qualifications: values })}
            />
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Field label="Application method">
              <select
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={record.applicationMethod}
                onChange={(event) => onChange({ applicationMethod: event.target.value })}
              >
                <option value="">Not specified</option>
                {APPLICATION_METHODS.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Application URL">
              <Input
                value={record.applicationUrl}
                onChange={(event) => onChange({ applicationUrl: event.target.value })}
              />
            </Field>
            <Field label="Application email">
              <Input
                type="email"
                value={record.applicationEmail}
                onChange={(event) => onChange({ applicationEmail: event.target.value })}
              />
            </Field>
            <Field label="Application phone">
              <Input
                value={record.applicationPhone}
                onChange={(event) => onChange({ applicationPhone: event.target.value })}
              />
            </Field>
            <Field label="Application instructions">
              <Textarea
                rows={3}
                value={record.applicationInstructions}
                onChange={(event) => onChange({ applicationInstructions: event.target.value })}
              />
            </Field>
            <Field label="Source name">
              <Input
                value={record.sourceName}
                onChange={(event) => onChange({ sourceName: event.target.value })}
              />
            </Field>
            <Field label="Source URL (optional)">
              <Input
                value={record.sourceUrl}
                onChange={(event) => onChange({ sourceUrl: event.target.value })}
                placeholder="Add a link when available"
              />
            </Field>
          </div>

          {warnings.length > 0 && (
            <div className="mt-5 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950">
              <p className="flex items-center gap-2 font-semibold">
                <AlertTriangle className="size-4" />
                Review warnings
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                {warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </div>
          )}
          {record.duplicate && (
            <div className="mt-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950">
              <p className="font-semibold">Possible duplicate found</p>
              <p className="mt-1">
                {record.duplicate.title} · {record.duplicate.organizationName} ·{" "}
                {record.duplicate.status}
              </p>
              <label className="mt-3 flex items-center gap-2">
                <Checkbox
                  checked={record.allowDuplicate}
                  onCheckedChange={(checked) => onChange({ allowDuplicate: checked === true })}
                />
                Save as a separate opportunity anyway
              </label>
            </div>
          )}
          {record.saveError && (
            <p role="alert" className="mt-4 text-sm font-medium text-destructive">
              {record.saveError}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      <span>{label}</span>
      {children}
    </label>
  );
}

function ArrayField({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
}) {
  return (
    <Field label={`${label} (one item per line)`}>
      <Textarea
        rows={Math.min(6, Math.max(2, values.length))}
        value={values.join("\n")}
        onChange={(event) => onChange(event.target.value.split("\n"))}
      />
    </Field>
  );
}

function toReviewRecord(value: ExtractedReview): ReviewRecord {
  const organizationName = value.organization_name ?? "";
  return {
    importId: crypto.randomUUID(),
    selected: true,
    title: value.title ?? "",
    organizationName,
    organizationId: value.organization_id,
    createOrganization: false,
    location: value.location ?? "",
    county: value.county ?? "",
    opportunityType: value.opportunity_type ?? "job",
    categoryId: value.category_id ?? "",
    field: value.field ?? "",
    experienceLevel: value.experience_level ?? "",
    employmentType: value.employment_type ?? "",
    summary: value.summary ?? "",
    description: value.description ?? "",
    responsibilities: value.responsibilities,
    requirements: value.requirements,
    qualifications: value.qualifications,
    applicationMethod: value.application_method ?? "",
    applicationUrl: value.application_url ?? "",
    applicationEmail: value.application_email ?? "",
    applicationPhone: value.application_phone ?? "",
    applicationInstructions: value.application_instructions ?? "",
    deadline: value.deadline ?? "",
    sourceName: value.source_name ?? "",
    sourceUrl: value.source_url ?? "",
    missingInformation: value.missing_information,
    needsReview: value.needs_review,
    duplicate: value.duplicate,
    allowDuplicate: false,
    saveError: "",
  };
}

function warningsFor(record: ReviewRecord) {
  let visible = [...record.missingInformation];
  const filterIfResolved = (pattern: RegExp, resolved: boolean) => {
    if (resolved) visible = visible.filter((warning) => !pattern.test(warning));
  };
  filterIfResolved(/organization/i, Boolean(record.organizationName));
  filterIfResolved(/location/i, Boolean(record.location));
  filterIfResolved(/deadline/i, Boolean(record.deadline));
  filterIfResolved(/category/i, Boolean(record.categoryId));
  const hasRoute = Boolean(
    record.applicationUrl || record.applicationEmail || record.applicationPhone,
  );
  filterIfResolved(/application/i, Boolean(record.applicationMethod) && hasRoute);
  if (!record.organizationName) visible.push("Organization not specified.");
  if (!record.location) visible.push("Location not specified.");
  if (!record.deadline) visible.push("Deadline not specified.");
  if (!record.categoryId) visible.push("Category needs review.");
  if (!record.applicationMethod) visible.push("Application method not specified.");
  if (!hasRoute) visible.push("Application URL, email, or phone missing.");
  return [...new Set(visible)];
}
