import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Sidebar } from "@/components/Sidebar";

function NotFoundComponent() {
  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="brutal-card p-10 max-w-md text-center bg-banana">
        <p className="text-7xl font-black">404</p>
        <p className="mt-2 text-xl font-black uppercase">Quest not found</p>
        <a href="/" className="inline-block mt-6 px-6 py-3 bg-coral border-4 border-ink rounded-2xl font-black brutal-shadow-sm">
          Back to base
        </a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="brutal-card p-8 max-w-md text-center bg-peach">
        <h1 className="text-2xl font-black">Oops! Something tripped.</h1>
        <p className="mt-2 text-sm font-bold text-ink/70">Try again or head back home.</p>
        <div className="mt-6 flex gap-3 justify-center">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="px-5 py-2 bg-mint border-4 border-ink rounded-2xl font-black brutal-shadow-sm"
          >
            Try again
          </button>
          <a href="/" className="px-5 py-2 bg-card border-4 border-ink rounded-2xl font-black brutal-shadow-sm">
            Home
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
      { title: "QuestKid — Gamified Learning for Curious Kids" },
      { name: "description", content: "A bright, playful learning platform where kids unlock courses, earn badges, and climb the leaderboard." },
      { property: "og:title", content: "QuestKid — Gamified Learning" },
      { property: "og:description", content: "Bright, playful, gamified learning for curious kids." },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&display=swap",
      },
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

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="lg:pl-80 lg:pr-6 px-4 pt-6 pb-28 lg:pb-6 max-w-[1400px] mx-auto">
          <Outlet />
        </main>
      </div>
    </QueryClientProvider>
  );
}
