import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import {
  BriefcaseBusiness,
  LayoutDashboard,
  LogOut,
  Plus,
  Rows3,
  ExternalLink,
} from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { logoutAdmin } from "@/lib/auth-actions.server";
import { Toaster } from "@/components/ui/sonner";

const items = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Jobs", to: "/admin/jobs", icon: Rows3 },
  { label: "Create Job", to: "/admin/jobs/new", icon: Plus },
] as const;

export function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAdmin();
    await router.invalidate();
    await router.navigate({ to: "/admin/login" });
  };

  return (
    <div className="min-h-screen bg-surface text-foreground">
      <Toaster />
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="border-b border-border bg-footer text-footer-foreground lg:border-b-0 lg:border-r">
          <div className="flex h-18 items-center gap-2 border-b border-footer-border px-5">
            <span className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <BriefcaseBusiness className="size-5" />
            </span>
            <div>
              <p className="font-heading text-sm font-extrabold">Get Hired KE</p>
              <p className="text-xs text-footer-muted">Admin</p>
            </div>
          </div>
          <nav className="flex gap-2 overflow-x-auto px-4 py-3 lg:flex-col lg:overflow-visible lg:py-5">
            {items.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${active ? "bg-primary text-primary-foreground" : "text-footer-muted hover:bg-white/10 hover:text-footer-foreground"}`}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="hidden border-t border-footer-border p-4 lg:block">
            <Button asChild variant="secondary" className="w-full">
              <Link to="/" search={{}}>
                <ExternalLink className="size-4" />
                View Website
              </Link>
            </Button>
            <div className="mt-3">
              <Button
                type="button"
                variant="ghost"
                className="w-full justify-start text-footer-muted hover:text-footer-foreground"
                onClick={handleLogout}
              >
                <LogOut className="size-4" />
                Logout
              </Button>
            </div>
          </div>
        </aside>
        <main className="min-w-0">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-primary">GHK Admin</p>
        <h1 className="mt-1 font-heading text-3xl font-extrabold">{title}</h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
