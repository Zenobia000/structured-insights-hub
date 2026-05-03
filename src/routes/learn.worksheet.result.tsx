/**
 * Card 10 — Pain Id Export (capstone, Grok dark theme)
 *
 * Routing pattern: 此頁是 worksheet capstone view，沒有 exit_gate；
 * 但有「進入此頁的前置條件」：
 *   1. current_step === 10
 *   2. verdict.judgment 非 null
 *   3. verdict.reason_100w.length >= 100
 * 任一不滿足 → 自動 redirect 到對應卡片頁
 */
import { useEffect } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { CompletionHeader } from "@/components/worksheet/card10/CompletionHeader";
import { NumericStats } from "@/components/worksheet/card10/NumericStats";
import { PainIdCard } from "@/components/worksheet/card10/PainIdCard";
import { ExportActions } from "@/components/worksheet/card10/ExportActions";
import { NextStepCta } from "@/components/worksheet/card10/NextStepCta";
import { StageHandoffPanel } from "@/components/worksheet/card10/StageHandoffPanel";
import { FooterActions } from "@/components/worksheet/card10/FooterActions";
import { usePainCardStore } from "@/store/painCard";
import { isCardCompleteForResult } from "@/lib/cardTenExport";

export const Route = createFileRoute("/learn/worksheet/result")({
  head: () => ({
    meta: [
      { title: "你的痛點身份證 — PainMap Worksheet" },
      { name: "robots", content: "noindex" },
      {
        name: "description",
        content:
          "你親手寫完的痛點身份證 — 9 張卡的精華都在這裡，可以匯出 Markdown / JSON / PDF 帶走。資料只在你的本機。",
      },
    ],
  }),
  component: ResultPage,
});

function ResultPage() {
  const navigate = useNavigate();
  const card = usePainCardStore((s) => s.card);
  const hydrated = usePainCardStore((s) => s.hydrated);
  const updateField = usePainCardStore((s) => s.updateField);

  useEffect(() => {
    if (!hydrated) return;
    const check = isCardCompleteForResult(card);
    if (!check.ok && check.redirect) {
      navigate({ to: check.redirect });
    } else {
      updateField("exported.last_review_at", new Date().toISOString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  if (!hydrated) {
    return (
      <main className="max-w-3xl mx-auto px-5 py-16 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
          Loading
        </p>
        <p className="mt-2 text-text-secondary">正在從你的瀏覽器把痛點身份證找出來…</p>
      </main>
    );
  }

  const check = isCardCompleteForResult(card);
  if (!check.ok) {
    return (
      <main className="max-w-3xl mx-auto px-5 py-16 text-center space-y-5">
        <p className="text-text-primary font-medium">{check.reason}</p>
        <Link
          to={(check.redirect || "/learn/worksheet") as "/learn/worksheet"}
          className="inline-flex items-center gap-2 rounded-md border border-border-default bg-canvas-raised px-4 h-10 text-[14px] text-text-primary hover:bg-surface-hover hover:border-border-strong transition-colors"
        >
          回去那張卡接著寫
        </Link>
      </main>
    );
  }

  return (
    <main className="bg-canvas-base min-h-screen pb-20">
      {/* Back link + autosave */}
      <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-12 pt-8 flex items-center justify-between">
        <Link
          to="/learn/worksheet/09"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.06em] text-text-tertiary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="h-3 w-3" /> Back to Card 09
        </Link>
        <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.06em] text-text-tertiary">
          <span className="h-1.5 w-1.5 rounded-full bg-status-success" />
          Local-only · {card.updated_at.slice(11, 16)}
        </span>
      </div>

      <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-12 mt-8 space-y-10">
        <CompletionHeader />
        <NumericStats />
        <PainIdCard />
        <ExportActions />
        <NextStepCta />
        <StageHandoffPanel />
        <FooterActions />
      </div>
    </main>
  );
}
