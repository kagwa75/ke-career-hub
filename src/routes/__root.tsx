import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import posthog from "posthog-js";
import { PostHogProvider } from "@posthog/react";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useRef, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteLayout } from "../components/site-layout";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            search={{}}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Get Hired KE" },
      { name: "description", content: "Find jobs, internships and career opportunities across Kenya." },
      { name: "author", content: "Get Hired KE" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Get Hired KE | Jobs in Kenya" },
      {
        property: "og:description",
        content: "Find jobs, internships and career opportunities across Kenya.",
      },
      {
        property: "og:image",
        content: "https://gethired.bermudaappstudios.online/social-preview.png",
      },
      { property: "og:image:width", content: "1734" },
      { property: "og:image:height", content: "907" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Get Hired KE | Jobs in Kenya" },
      {
        name: "twitter:description",
        content: "Find jobs, internships and career opportunities across Kenya.",
      },
      {
        name: "twitter:image",
        content: "https://gethired.bermudaappstudios.online/social-preview.png",
      },
      { name: "twitter:image:alt", content: "Your next opportunity awaits in Kenya" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700;800&display=swap" },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isAdmin = pathname.startsWith("/admin");
  const posthogToken = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN;
  const posthogHost = import.meta.env.VITE_POSTHOG_HOST || "https://eu.i.posthog.com";
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!posthogToken || posthog.__loaded) return;

    posthog.init(posthogToken, {
      api_host: posthogHost,
      autocapture: false,
      capture_pageview: false,
      capture_pageleave: false,
      disable_session_recording: true,
    });
  }, [posthogHost, posthogToken]);

  useEffect(() => {
    if (!posthogToken || isAdmin || lastTrackedPath.current === pathname) return;

    lastTrackedPath.current = pathname;
    posthog.capture("$pageview", { $current_url: window.location.href });
  }, [isAdmin, pathname, posthogToken]);

  return (
    <PostHogProvider client={posthog}>
      <QueryClientProvider client={queryClient}>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        {isAdmin ? <Outlet /> : <SiteLayout><Outlet /></SiteLayout>}
      </QueryClientProvider>
    </PostHogProvider>
  );
}
