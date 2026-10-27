import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Menu, MessageCircle, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { opportunityTypes, WHATSAPP_URL } from "@/lib/jobs/types";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Career Hub", to: "/career-hub" },
  { label: "Saved Jobs", to: "/saved-jobs" },
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contact" },
] as const;

const communityLinks = [
  {
    platform: "telegram",
    label: "Join our Telegram for resources and updates",
    href: "https://t.me/gethiredkenya",
  },
  { platform: "facebook", label: "Follow us on Facebook", href: "https://www.facebook.com/share/19PnJJiWCY/" },
  { platform: "x", label: "Follow Get Hired KE on X", href: "https://x.com/ghke26" },
  {
    platform: "instagram",
    label: "Follow Get Hired KE on Instagram",
    href: "https://www.instagram.com/gethiredke?igsi=MWhjb2FrNHYwMm82Yw%3D%3D",
  },
  {
    platform: "play",
    label: "Check out CT on the Play Store",
    href: "https://play.google.com/store/apps/details?id=com.y3vq3cz.calorietracker&pcampaignid=web_share",
  },
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
            <img src="/GHKE_logo.ico" alt="" className="size-11 rounded-md object-contain" />
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
              <img src="/GHKE_logo.ico" alt="" className="size-10 rounded-md object-contain" />
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
              <Link to="/career-hub" search={{ q: "" }}>Career Hub</Link>
              <Link to="/about">About Us</Link>
            </div>
          </div>
          <div>
            <p className="font-heading text-sm font-bold">Legal</p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-footer-muted">
              <Link to="/privacy-policy">Privacy Policy</Link>
              <Link to="/terms-and-conditions">Terms & Conditions</Link>
            </div>
          </div>
          <div>
            <p className="font-heading text-sm font-bold">Stay connected</p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-footer-muted">
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-footer-foreground">
                <SocialIcon platform="whatsapp" /> Join our WhatsApp channel
              </a>
              {communityLinks.map((item) => (
                <a key={item.href} href={item.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-footer-foreground">
                  <SocialIcon platform={item.platform} /> {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-footer-border px-4 py-5 text-center text-xs text-footer-muted">
          © 2026 Get Hired KE. Opportunities. Growth. Success.
        </div>
      </footer>
    </div>
  );
}

function SocialIcon({ platform }: { platform: string }) {
  const common = { className: "size-4 shrink-0", viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true as const };
  if (platform === "telegram") return <svg {...common}><path d="M21.8 3.1 18.6 20c-.2 1.2-.9 1.5-1.8.9l-5-3.7-2.4 2.3c-.3.3-.6.6-1.2.6l.4-5.1 9.3-8.4c.4-.4-.1-.6-.6-.2L5.8 13.7 1 12.2c-1-.3-1-1 .2-1.5L20 3.4c.9-.3 1.9.2 1.8-.3Z" /></svg>;
  if (platform === "facebook") return <svg {...common}><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V8c0-.9.3-1.5 1.6-1.5h1.7V3.7c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.2v2.1H7.7V13h2.7v8h3.1Z" /></svg>;
  if (platform === "x") return <svg {...common}><path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.8 5.7 22H2.5l7.3-8.4L1.8 2h6.5l4.5 6.7L18.9 2Zm-1.1 17.9h1.7L7.2 4H5.4l12.4 15.9Z" /></svg>;
  if (platform === "instagram") return <svg {...common} fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" /></svg>;
  if (platform === "play") return <svg {...common}><path d="M4.2 2.8c-.4.3-.7.8-.7 1.5v15.4c0 .7.3 1.2.7 1.5L13 12 4.2 2.8Z" /><path d="m15 10 2.7-2.8-11-5.9 8.3 8.7Z" /><path d="m15 14-8.3 8.7 11-5.9L15 14Z" /><path d="m19.2 8-3.1 3.3 3.1 3.3 2-1.1c1.3-.7 1.3-1.8 0-2.5l-2-1Z" /></svg>;
  return <svg {...common}><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20Zm4.4-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.8.9-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.3.1-.5l.4-.4.2-.4c.1-.1 0-.3 0-.4l-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.3c.1.2 1.6 2.4 3.8 3.3.5.2 1 .4 1.3.5.5.2 1 .1 1.3.1.4-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.3-.2-.5-.3Z" /></svg>;
}
