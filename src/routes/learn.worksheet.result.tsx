/**
 * Card 10 — Pain Id Export (capstone)
 *
 * Routing pattern: 此頁是 worksheet capstone view，沒有 exit_gate；
 * 但有「進入此頁的前置條件」：
 *   1. current_step === 10
 *   2. verdict.judgment 非 null
 *   3. verdict.reason_100w.length >= 100
 * 任一不滿足 → 自動 redirect 到對應卡片頁
 *
 * 教學/生產模式（display_mode）控制 Pain Quality 5 維度是否顯示
 */
import { useEffect } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { CardProgressStepper } from "@/components/worksheet/CardProgressStepper";
import { CompletionHeader } from "@/components/worksheet/card10/CompletionHeader";
import { PainIdCard } from "@/components/worksheet/card10/PainIdCard";
import { ExportActions } from "@/components/worksheet/card10/ExportActions";
import { NextStepCta } from "@/components/worksheet/card10/NextStepCta";
import { StageHandoffPanel } from "@/components/worksheet/card10/StageHandoffPanel";
import { FooterActions } from "@/components/worksheet/card10/FooterActions";
import { usePainCardStore } from "@/store/painCard";
import { useDisplayModeStore, type DisplayMode } from "@/store/displayMode";
import { isCardCompleteForResult } from "@/lib/cardTenExport";

export const Route = createFileRoute("/learn/worksheet/result")({
  head: () => ({
    meta: [
      { title: "你的痛點身份證 — PainMap Worksheet" },
      { name: "robots", content: "noindex" },
      {
        name: "description",
        content: "9 卡精華組合成的痛點身份證，可匯出為 Markdown / JSON / PDF。資料只在你本機。",
      },
    ],
  }),
  component: ResultPage,
});

function ResultPage() {
  const navigate = useNavigate();
  const card = usePainCardStore((s) => s.card);
  const hydrated = usePainCardStore((s) => s.hydrated);
  const setMode = useDisplayModeStore((s) => s.setMode);
  const updateField = usePainCardStore((s) => s.updateField);

  // URL ?mode=teaching|production 雙保險（hash 與 search 任一）
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const m = url.searchParams.get("mode");
    if (m === "teaching" || m === "production") {
      setMode(m as DisplayMode);
    }
  }, [setMode]);

  // 進入此頁的前置條件檢查
  useEffect(() => {
    if (!hydrated) return;
    const check = isCardCompleteForResult(card);
    if (!check.ok && check.redirect) {
      navigate({ to: check.redirect });
    } else {
      // 紀錄最後檢核時間
      updateField("exported.last_review_at", new Date().toISOString());
    }
    // 只在 hydrate 完成時跑一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  if (!hydrated) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-12 text-center text-text-muted">
        正在讀取你本機的痛點身份證…
      </main>
    );
  }

  const check = isCardCompleteForResult(card);
  if (!check.ok) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-12 text-center space-y-4">
        <p className="text-text-primary font-medium">{check.reason}</p>
        <Link
          to={(check.redirect || "/learn/worksheet") as "/learn/worksheet"}
          className="inline-block text-secondary underline"
        >
          回到對應卡片
        </Link>
      </main>
    );
  }

  return (
    <main className="bg-background min-h-screen pb-16">
      {/* Stepper */}
      <div className="border-b border-border bg-surface">
        <CardProgressStepper />
      </div>

      {/* Back link + autosave */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 flex items-center justify-between text-xs">
        <Link
          to="/learn/worksheet/09"
          className="inline-flex items-center gap-1 text-text-secondary hover:text-secondary"
        >
          <ArrowLeft className="h-3 w-3" /> 卡 9
        </Link>
        <span className="text-text-muted">
          資料只在你的本機 ·{" "}
          {card.updated_at.slice(11, 16)} 最後更新
        </span>
      </div>

      <div className="px-4 sm:px-6 mt-6 space-y-8">
        <CompletionHeader />
        <PainIdCard />
        <ExportActions />
        <NextStepCta />
        <StageHandoffPanel />
        <FooterActions />
      </div>
    </main>
  );
}
