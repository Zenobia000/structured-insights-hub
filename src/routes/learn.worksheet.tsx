import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { CardProgressStepper } from "@/components/worksheet/CardProgressStepper";
import { usePainCardStore } from "@/store/painCard";

export const Route = createFileRoute("/learn/worksheet")({
  component: WorksheetLayout,
});

function WorksheetLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-page">
      <Header />
      <CardProgressStepper />
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
    </div>
  );
}

function Header() {
  const updatedAt = usePainCardStore((s) => s.card.updated_at);
  const [savedTime, setSavedTime] = useState<string>("");

  useEffect(() => {
    if (!updatedAt) return;
    const d = new Date(updatedAt);
    setSavedTime(
      d.toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" }),
    );
  }, [updatedAt]);

  return (
    <header className="border-b border-border bg-surface">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-lg" aria-hidden>
            🪪
          </span>
          <span className="font-semibold text-text-primary group-hover:text-secondary transition-colors">
            痛點填空簿
          </span>
        </Link>
        {savedTime && (
          <span className="text-xs text-text-muted">已儲存於 {savedTime}</span>
        )}
      </div>
    </header>
  );
}
