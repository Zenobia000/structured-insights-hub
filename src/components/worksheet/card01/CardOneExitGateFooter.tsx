/**
 * Card 1 ExitGate footer — sticky 底部行動列 (Grok dark)。
 *
 * 本卡專屬：blocked_message 動態文案、CTA disabled tooltip、anti-fake check 整合。
 */
import { ArrowRight, AlertTriangle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { ReflectionHint } from "@/components/worksheet/ReflectionHint";

type Props = {
  allFilled: boolean;
  noAnalysisWords: boolean;
  realPerson: boolean;
  submitting?: boolean;
  blockedMessage?: string | null;
  onAdvance: () => void;
};

export function CardOneExitGateFooter({
  allFilled,
  noAnalysisWords,
  realPerson,
  submitting,
  blockedMessage,
  onAdvance,
}: Props) {
  const canAdvance = allFilled && noAnalysisWords && realPerson && !submitting;

  const tooltip = !allFilled
    ? "請先填完 5 個欄位"
    : !noAnalysisWords
      ? "原句裡有分析詞，請改寫成你聽到的具體句子"
      : !realPerson
        ? "來源不是真人姓名，請改成具體姓名"
        : undefined;

  return (
    <div className="sticky bottom-0 left-0 right-0 z-20 border-t border-border-hairline bg-canvas-base/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-5 space-y-3">
        {/* Reflection hints (Socratic, not pass/fail) */}
        <ul className="flex flex-col gap-2">
          <ReflectionHint
            question="這句話是他說的、還是你幫他歸納的？"
            state={noAnalysisWords && allFilled ? "ok" : !allFilled ? "pending" : "thinking"}
            hint={
              !noAnalysisWords && allFilled
                ? "我們在你的輸入裡看到『可能』『應該』這類分析語，回去看看是不是你自己的解釋。"
                : undefined
            }
          />
          <ReflectionHint
            question="這個人有名字嗎？還是只是一個代稱？"
            state={realPerson ? "ok" : !allFilled ? "pending" : "thinking"}
          />
        </ul>

        {/* Blocked message */}
        {blockedMessage && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-md border border-status-warning/40 bg-status-warning-bg px-3.5 py-3 text-[13.5px] leading-[1.6] text-text-primary"
          >
            <AlertTriangle className="h-4 w-4 text-status-warning shrink-0 mt-0.5" aria-hidden />
            <span>{blockedMessage}</span>
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.06em] text-text-tertiary hover:text-text-primary self-center sm:self-auto transition-colors"
          >
            ← Back to home
          </Link>

          <div className="relative group">
            <button
              type="button"
              onClick={onAdvance}
              disabled={!canAdvance}
              aria-disabled={!canAdvance}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-md h-11 px-6 text-[14px] font-medium",
                "transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-electric focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-base",
                canAdvance
                  ? "bg-accent-electric text-text-primary hover:bg-accent-electric-hover glow-accent-sm"
                  : "border border-border-hairline bg-surface-elevated text-text-tertiary cursor-not-allowed",
              )}
            >
              {submitting ? "儲存中…" : "繼續到卡 02"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            {tooltip && !canAdvance && (
              <span
                role="tooltip"
                className="pointer-events-none absolute bottom-full right-0 mb-2 hidden group-hover:block group-focus-within:block whitespace-nowrap rounded-md border border-border-default bg-canvas-overlay px-2.5 py-1.5 text-[12px] text-text-primary shadow-lg"
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
