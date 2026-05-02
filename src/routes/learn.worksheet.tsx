import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

import { CardProgressStepper } from "@/components/worksheet/CardProgressStepper";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { usePainCardStore } from "@/store/painCard";

export const Route = createFileRoute("/learn/worksheet")({
  component: WorksheetLayout,
});

function WorksheetLayout() {
  return (
    <div className="relative min-h-screen flex flex-col bg-canvas-base text-text-primary">
      {/* Subtle ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse 600px 400px at 0% 0%, var(--accent-glow-soft), transparent 60%)",
        }}
      />
      <div className="relative z-10 flex flex-col flex-1">
        <Header />
        <CardProgressStepper />
        <div className="flex-1 flex flex-col">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function formatSavedTime(iso: string | undefined | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("zh-TW", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Header() {
  const savedTime = usePainCardStore((s) => formatSavedTime(s.card.updated_at));

  return (
    <header className="sticky top-0 z-40 border-b border-border-hairline bg-canvas-base/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="group inline-flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <span
            aria-hidden
            className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-accent-electric text-text-primary text-[10px] font-bold glow-accent-sm"
          >
            ◆
          </span>
          <span className="font-display font-semibold tracking-[-0.01em] text-text-primary">
            PainMap
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-tertiary">
            / Worksheet
          </span>
        </Link>
        <div className="flex items-center gap-3">
          {savedTime && (
            <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.06em] text-text-tertiary">
              <span className="h-1.5 w-1.5 rounded-full bg-status-success animate-pulse" />
              <span className="hidden sm:inline">Saved</span>
              <span className="tabular-nums text-text-secondary">{savedTime}</span>
            </span>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
