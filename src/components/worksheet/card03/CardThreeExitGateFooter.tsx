/**
 * CardThreeExitGateFooter — 卡 3 sticky 底部行動列。
 *
 * 過關條件（2026-05 簡化）：
 * - aiPolishedPass：使用者已貼回 AI 整理後的卡關公式句
 * - confirmedPass：AI 沒列釐清問題，或全部已回答 / 預約問
 */
import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  aiPolishedPass: boolean;
  confirmedPass: boolean;
  submitting?: boolean;
  blockedMessage?: string | null;
  onAdvance: () => void;
};

export function CardThreeExitGateFooter({
  aiPolishedPass,
  confirmedPass,
  submitting,
  blockedMessage,
  onAdvance,
}: Props) {
  const canAdvance = aiPolishedPass && confirmedPass && !submitting;
  const tooltip = !aiPolishedPass
    ? "請先貼回 AI 整理後的卡關公式（≥15 字）"
    : !confirmedPass
      ? "請回答 AI 列的每個釐清問題（或勾「預約找主人翁問」）"
      : undefined;

  return (
    <div className="sticky bottom-0 left-0 right-0 z-20 border-t border-border bg-surface/95 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 space-y-3">
        <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-[13px]">
          <ConditionItem
            passed={aiPolishedPass}
            label="已貼回 AI 整理後的卡關公式句"
          />
          <ConditionItem
            passed={confirmedPass}
            label="AI 列的釐清問題已全部回答（或標記預約問）"
          />
        </ul>

        {blockedMessage && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-md border-2 border-caution/50 bg-caution/5 px-3 py-2.5 text-[13.5px] leading-[1.55] text-text-primary"
          >
            <AlertTriangle className="h-4 w-4 text-caution shrink-0 mt-0.5" aria-hidden />
            <span>{blockedMessage}</span>
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-2">
          <Link
            to="/learn/worksheet/02"
            className="text-[13px] text-text-secondary hover:text-text-primary underline-offset-2 hover:underline self-center sm:self-auto"
          >
            ← 回到卡 2
          </Link>

          <div className="relative group">
            <button
              type="button"
              onClick={onAdvance}
              disabled={!canAdvance}
              aria-disabled={!canAdvance}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 font-semibold text-[15px]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all",
                canAdvance
                  ? "bg-accent text-accent-foreground hover:bg-accent/90 hover:scale-[1.01]"
                  : "bg-muted text-text-muted cursor-not-allowed",
              )}
            >
              {submitting ? "儲存中…" : "儲存並進入卡 4"}
              <ArrowRight className="h-4 w-4" />
            </button>
            {tooltip && !canAdvance && (
              <span
                role="tooltip"
                className="pointer-events-none absolute bottom-full right-0 mb-2 hidden group-hover:block group-focus-within:block whitespace-nowrap rounded-md bg-text-primary px-2.5 py-1.5 text-[12px] text-primary-foreground shadow-md"
              >
                {tooltip}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ConditionItem({ passed, label }: { passed: boolean; label: string }) {
  return (
    <li className="flex items-start gap-1.5">
      <span
        aria-hidden
        className={cn(
          "mt-0.5 inline-flex items-center justify-center h-4 w-4 rounded-sm border text-[10px] font-bold",
          passed
            ? "bg-verified text-verified-foreground border-verified"
            : "bg-surface border-border text-transparent",
        )}
      >
        ✓
      </span>
      <span className={cn(passed ? "text-text-primary" : "text-text-secondary")}>
        {label}
      </span>
    </li>
  );
}
