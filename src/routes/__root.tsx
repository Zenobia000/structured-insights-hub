import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import { Toaster } from "@/components/ui/sonner";
import { GrokMotionConfig } from "@/lib/motion";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-canvas-base px-4">
      <div className="relative max-w-md text-center">
        <p className="eyebrow mb-6">● ERROR / NOT_FOUND</p>
        <h1 className="font-mono text-7xl font-bold tracking-tight text-text-primary tabular-nums">
          404
        </h1>
        <h2 className="mt-6 text-xl font-semibold text-text-primary">這條路不通</h2>
        <p className="mt-3 text-sm text-text-secondary">
          你要找的頁面不在這裡 — 可能拼錯了，或這頁已經被收起來了。
        </p>
        <div className="mt-10 flex justify-center gap-3">
          <Link
            to="/"
            className="inline-flex h-10 items-center justify-center rounded-md bg-text-primary px-5 text-sm font-medium text-text-inverse transition-colors hover:bg-text-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary/40"
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
      // Inline SVG favicon — 避免 favicon.ico 404，用品牌 ◆ glyph
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%2300d4ff'/%3E%3Ctext x='50%25' y='52%25' text-anchor='middle' dominant-baseline='middle' font-size='40' font-weight='bold' fill='%23000'%3E%E2%97%86%3C/text%3E%3C/svg%3E",
      },
      // Preconnect Google Fonts only (Noto Sans TC). Geist self-hosted
      // → no jsdelivr connection needed.
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      // Preload self-hosted Geist variable fonts. Same origin = no extra
      // TLS handshake; preload tells browser to start fetch immediately
      // (parallel to JS) without waiting for CSS parse to discover them.
      {
        rel: "preload",
        as: "font",
        type: "font/woff2",
        href: "/fonts/geist-sans-variable.woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        as: "font",
        type: "font/woff2",
        href: "/fonts/geist-mono-variable.woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;600;700&display=swap",
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

/**
 * Inline FOUC-prevention script.
 *
 * Runs synchronously before any React hydration so the correct theme class
 * (light / dark) is on <html> by the time the first paint happens. This
 * avoids the dark→light flash for users who chose 'light' on a prior visit.
 *
 * Storage key & resolution must match src/hooks/useTheme.ts.
 */
const themeBootstrap = `(function(){try{
var k='painmap.theme';
var stored=localStorage.getItem(k);
var pref=window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';
var theme=(stored==='light'||stored==='dark')?stored:pref;
var html=document.documentElement;
html.classList.remove('light','dark');
html.classList.add(theme);
html.style.colorScheme=theme;
}catch(e){document.documentElement.classList.add('dark');}})();`;

function RootShell({ children }: { children: React.ReactNode }) {
  // suppressHydrationWarning：themeBootstrap inline script 會在 React hydrate 前
  // 動態調整 <html> 的 className / colorScheme，server render 與 client 看到的
  // attribute 必然不同（這是設計意圖，不是 bug），告訴 React 別警告。
  return (
    <html lang="zh-Hant" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
        <HeadContent />
      </head>
      <body className="bg-canvas-base text-text-primary antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <GrokMotionConfig>
      <Outlet />
      <Toaster position="top-center" richColors />
    </GrokMotionConfig>
  );
}
