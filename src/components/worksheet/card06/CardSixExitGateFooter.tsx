/**
 * CardSixExitGateFooter — sticky bottom，3 個自動勾選
 * 卡 6 失敗不退卡，留在頁面補資訊
 */
import { ArrowRight, AlertTriangle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

type Props = {
  answersAllPassed: boolean;
  answersPassedCount: number;
  noSolutionPassed: boolean;
  rawResponseLong: boolean;
  submitting?: boolean;
  blockedMessage?: string | null;
  onAdvance: () => void;
};

export function CardSixExitGateFooter({
  answersAllPassed,
  answersPassedCount,
  noSolutionPassed,
  rawResponseLong,
  submitting,
  blockedMessage,
  onAdvance,
}: Props) {
  const canAdvance =
    answersAllPassed && noSolutionPassed && rawResponseLong && !submitting;

  const tooltip = !rawResponseLong
    ? "請貼 AI 回覆原文（≥ 200 字）"
    : !answersAllPassed
      ? `8 題中已填 ${answersPassedCount} 題（每題需達最少字數）`
      : !noSolutionPassed
        ? "AI 回覆出現推銷詞 — 請用補強 prompt 重跑或手動覆寫"
        : undefined;

  return (
    <div className="sticky bottom-0 left-0 right-0 z-20 border-t border-border bg-surface/95 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 space-y-3">
        <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-[13px]">
          <ConditionItem
            passed={answersAllPassed}
            label={`AI 回了 8 題（已填 ${answersPassedCount} / 8）`}
          />
          <ConditionItem passed={noSolutionPassed} label="AI 沒有推銷解法" />
          <ConditionItem passed={rawResponseLong} label="raw_response 已完整保存" />
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
            to="/learn/worksheet/05"
            className="text-[13px] text-text-secondary hover:text-text-primary underline-offset-2 hover:underline self-center sm:self-auto"
          >
            ← 退回卡 5 補資訊
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
              {submitting ? "儲存中…" : "進入卡 7：自己先猜 + 讀 AI"}
              <ArrowRight className="h-4 w-4" />
            </button>
            {tooltip && !canAdvance && (
              <span
                role="tooltip"
                className="pointer-events-none absolute bottom-full right-0 mb-2 hidden group-hover:block group-focus-within:block max-w-xs whitespace-normal rounded-md bg-text-primary px-2.5 py-1.5 text-[12px] text-primary-foreground shadow-md"
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
      <span className={cn(passed ? "text-text-primary" : "text-text-secondary")}>{label}</span>
    </li>
  );
}
