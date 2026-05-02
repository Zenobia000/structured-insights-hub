import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import { Toaster } from "@/components/ui/sonner";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">這條路不通</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          你要找的頁面不在這裡 — 可能拼錯了，或這頁已經被收起來了。
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            回首頁
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "PainMap 題眼 · 痛點填空簿" },
      {
        name: "description",
        content:
          "把一團模糊的抱怨整理成你說得清楚的問題 — 9 張卡片，陪你從「我覺得有問題」走到「我知道問題在哪」。",
      },
      { name: "author", content: "PainMap" },
      { property: "og:title", content: "PainMap 題眼 · 痛點填空簿" },
      {
        property: "og:description",
        content: "9 張卡片，陪你親手寫出一張屬於自己的痛點身份證。",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "PainMap 題眼 · 痛點填空簿" },
      {
        name: "description",
        content:
          "PainMap Studio structures pain points into actionable problems for problem solvers.",
      },
      {
        property: "og:description",
        content:
          "PainMap Studio structures pain points into actionable problems for problem solvers.",
      },
      {
        name: "twitter:description",
        content:
          "PainMap Studio structures pain points into actionable problems for problem solvers.",
      },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/fd2ca7ed-977c-4db7-9a9e-827d1a78fa75/id-preview-a4a4d1e5--d0139ee1-9f0d-4539-a1a8-5a4fdd46360e.lovable.app-1777712052394.png",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/fd2ca7ed-977c-4db7-9a9e-827d1a78fa75/id-preview-a4a4d1e5--d0139ee1-9f0d-4539-a1a8-5a4fdd46360e.lovable.app-1777712052394.png",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Noto+Sans+TC:wght@400;500;600;700&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
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
  return (
    <>
      <Outlet />
      <Toaster position="top-center" richColors />
    </>
  );
}
