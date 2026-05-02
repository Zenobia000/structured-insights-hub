/**
 * Card 1 ExitGate footer — sticky 底部行動列。
 *
 * 本卡專屬：blocked_message 動態文案、CTA disabled tooltip、anti-fake check 整合。
 */
import { ArrowRight, AlertTriangle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { ReflectionHint } from "@/components/worksheet/ReflectionHint";

type Props = {
  /** 5 個欄位是否全部填滿（含 verbatim minLength 10） */
  allFilled: boolean;
  /** anti-fake R2.1 通過？（無分析詞） */
  noAnalysisWords: boolean;
  /** anti-fake R2.2 通過？（非代稱） */
  realPerson: boolean;
  /** 提交中 */
  submitting?: boolean;
  /** 上次提交但被擋住的訊息（friendly copy） */
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
        ? "來源不是真人姓名,請改成具體姓名"
        : undefined;

  return (
    <div className="sticky bottom-0 left-0 right-0 z-20 border-t border-border bg-surface/95 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 space-y-3">
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
            className="flex items-start gap-2.5 rounded-md border-2 border-caution/50 bg-caution/5 px-3 py-2.5 text-[13.5px] leading-[1.55] text-text-primary"
          >
            <AlertTriangle className="h-4 w-4 text-caution shrink-0 mt-0.5" aria-hidden />
            <span>{blockedMessage}</span>
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-2">
          <Link
            to="/"
            className="text-[13px] text-text-secondary hover:text-text-primary underline-offset-2 hover:underline self-center sm:self-auto"
          >
            回到入口
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
              {submitting ? "儲存中…" : "繼續到卡 2"}
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
