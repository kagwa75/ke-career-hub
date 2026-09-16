import { Link, useRouterState } from "@tanstack/react-router";
import { BriefcaseBusiness, ChevronDown, Menu, MessageCircle, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { opportunityTypes, WHATSAPP_URL } from "@/data/jobs";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Career Hub", to: "/career-hub" },
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contact" },
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    setMobileOpen(false);
    setCategoriesOpen(false);
  }, [pathname]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setCategoriesOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            search={{}}
            className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <BriefcaseBusiness className="size-5" />
            </span>
            <span className="font-heading text-lg font-extrabold">
              Get Hired <span className="text-primary">KE</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            <Link to="/" search={{}} activeOptions={{ exact: true }} className="nav-link">
              Home
            </Link>
            <div className="relative" ref={menuRef}>
              <Button
                variant="ghost"
                size="sm"
                aria-expanded={categoriesOpen}
                aria-haspopup="menu"
                onClick={() => setCategoriesOpen((open) => !open)}
              >
                Categories{" "}
                <ChevronDown
                  className={`size-4 transition-transform ${categoriesOpen ? "rotate-180" : ""}`}
                />
              </Button>
              {categoriesOpen && (
                <div
                  className="absolute left-0 top-11 max-h-96 w-72 overflow-y-auto rounded-lg border border-border bg-card p-2 shadow-card"
                  role="menu"
                >
                  {opportunityTypes.map((item) => (
                    <Link
                      key={item.slug}
                      to="/categories"
                      search={{
                        type: item.slug,
                        q: "",
                        location: "",
                        employment: "",
                        field: "",
                        experience: "",
                        deadline: "",
                        sort: "newest",
                        page: 1,
                      }}
                      className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted"
                      role="menuitem"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {navItems.slice(1).map((item) => (
              <Link key={item.to} to={item.to} className="nav-link">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden lg:block">
            <Button asChild variant="primary">
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                <MessageCircle className="size-4" />
                Join WhatsApp
              </a>
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
        {mobileOpen && (
          <nav
            className="border-t border-border bg-background px-4 py-4 lg:hidden"
            aria-label="Mobile navigation"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  search={{}}
                  className="rounded-md px-3 py-3 text-sm font-semibold hover:bg-muted"
                >
                  {item.label}
                </Link>
              ))}
              <p className="px-3 pb-1 pt-3 text-xs font-bold uppercase text-muted-foreground">
                Categories
              </p>
              <div className="grid grid-cols-2 gap-1">
                {opportunityTypes.slice(1, 7).map((item) => (
                  <Link
                    key={item.slug}
                    to="/categories"
                    search={{
                      type: item.slug,
                      q: "",
                      location: "",
                      employment: "",
                      field: "",
                      experience: "",
                      deadline: "",
                      sort: "newest",
                      page: 1,
                    }}
                    className="rounded-md px-3 py-2 text-sm hover:bg-muted"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <Button asChild className="mt-3 w-full">
                <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                  <MessageCircle className="size-4" />
                  Join WhatsApp
                </a>
              </Button>
            </div>
          </nav>
        )}
      </header>
      <main>{children}</main>
      <footer className="border-t border-border bg-footer text-footer-foreground">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
          <div>
            <div className="flex items-center gap-2 font-heading text-lg font-bold">
              <BriefcaseBusiness className="size-5 text-primary" />
              Get Hired KE
            </div>
            <p className="mt-3 max-w-sm text-sm leading-6 text-footer-muted">
              Useful opportunities, practical career guidance, and a simpler path to your next move.
            </p>
          </div>
          <div>
            <p className="font-heading text-sm font-bold">Explore</p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-footer-muted">
              <Link to="/services">Services</Link>
              <Link to="/career-hub">Career Hub</Link>
              <Link to="/about">About Us</Link>
            </div>
          </div>
          <div>
            <p className="font-heading text-sm font-bold">Legal</p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-footer-muted">
              <Link to="/privacy-policy">Privacy Policy</Link>
            </div>
          </div>
          <div>
            <p className="font-heading text-sm font-bold">Stay connected</p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary"
            >
              <MessageCircle className="size-4" />
              Join our WhatsApp channel
            </a>
          </div>
        </div>
        <div className="border-t border-footer-border px-4 py-5 text-center text-xs text-footer-muted">
          © 2026 Get Hired KE. Opportunities. Growth. Success.
        </div>
      </footer>
    </div>
  );
}
