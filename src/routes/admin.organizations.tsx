import { createFileRoute, Link, redirect, useRouter } from "@tanstack/react-router";
import { Building2, ExternalLink, Pencil, Plus, Save, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AdminPageHeader } from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getAdminOrganizations, saveAdminOrganization } from "@/lib/jobs/admin-actions.server";
import type { Organization } from "@/lib/jobs/types";

export const Route = createFileRoute("/admin/organizations")({
  loader: async () => {
    try {
      return await getAdminOrganizations();
    } catch (error) {
      if (error instanceof Response && [401, 403].includes(error.status))
        throw redirect({ to: "/admin/login" });
      throw error;
    }
  },
  component: OrganizationsPage,
});

type OrganizationForm = {
  id?: string;
  name: string;
  website: string;
  logo: string;
  description: string;
};

const emptyForm = (): OrganizationForm => ({ name: "", website: "", logo: "", description: "" });

function OrganizationsPage() {
  const { organizations } = Route.useLoaderData();
  const router = useRouter();
  const [form, setForm] = useState<OrganizationForm | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const edit = (organization?: Organization) => {
    setError(null);
    setForm(organization ? {
      id: organization.id,
      name: organization.name,
      website: organization.website ?? "",
      logo: organization.logo ?? "",
      description: organization.description ?? "",
    } : emptyForm());
  };

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form) return;
    setSaving(true);
    setError(null);
    try {
      await saveAdminOrganization({ data: form });
      toast.success(form.id ? "Organization updated." : "Organization added.");
      setForm(null);
      await router.invalidate();
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Could not save this organization.";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Organizations"
        description="Manage employer names, websites, logos, and profiles used across your opportunities."
        action={<Button type="button" onClick={() => edit()}><Plus className="size-4" /> Add Organization</Button>}
      />

      {form && (
        <form onSubmit={save} className="mb-6 rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-heading text-lg font-extrabold">{form.id ? "Edit organization" : "Add organization"}</h2>
            <Button type="button" variant="ghost" size="icon" aria-label="Close form" onClick={() => setForm(null)}><X className="size-4" /></Button>
          </div>
          {error && <p role="alert" className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Organization name"><Input required maxLength={300} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></Field>
            <Field label="Website"><Input type="url" placeholder="https://example.org" value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} /></Field>
            <Field label="Logo URL or site path" hint="Paste an image URL or use a path such as /org-logos/example.png.">
              <Input type="text" placeholder="https://example.org/logo.png" value={form.logo} onChange={(event) => setForm({ ...form, logo: event.target.value })} />
            </Field>
            <Field label="About the organization"><Textarea rows={4} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></Field>
          </div>
          {form.logo && (
            <div className="mt-4 flex items-center gap-3 rounded-md bg-muted/40 p-3">
              <img src={form.logo} alt="Logo preview" className="size-12 rounded-md border border-border bg-white object-contain p-1" />
              <span className="text-xs text-muted-foreground">Logo preview</span>
            </div>
          )}
          <div className="mt-5 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setForm(null)}>Cancel</Button>
            <Button type="submit" disabled={saving}><Save className="size-4" />{saving ? "Saving…" : "Save organization"}</Button>
          </div>
        </form>
      )}

      <div className="mb-3 text-sm text-muted-foreground">{organizations.length} organizations</div>
      <div className="grid gap-3">
        {organizations.map((organization) => (
          <article key={organization.id} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center">
            <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/30">
              {organization.logo ? <img src={organization.logo} alt={`${organization.name} logo`} className="size-full object-contain p-1" /> : <Building2 className="size-6 text-muted-foreground" />}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-heading font-bold">{organization.name}</h2>
              {organization.description && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{organization.description}</p>}
              {organization.website && <a className="mt-1 inline-flex items-center gap-1 text-sm text-primary hover:underline" href={organization.website} target="_blank" rel="noreferrer">{organization.website}<ExternalLink className="size-3.5" /></a>}
            </div>
            <Button type="button" variant="secondary" size="sm" onClick={() => edit(organization)}><Pencil className="size-4" /> Edit</Button>
          </article>
        ))}
        {organizations.length === 0 && <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No organizations yet. Add one here, or create an opportunity and it will be added automatically.</div>}
      </div>
      <div className="mt-6"><Button asChild variant="ghost"><Link to="/admin/jobs">Back to jobs</Link></Button></div>
    </>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return <Label className="grid gap-2 text-sm font-semibold"><span>{label}</span>{children}{hint && <span className="text-xs font-normal text-muted-foreground">{hint}</span>}</Label>;
}
