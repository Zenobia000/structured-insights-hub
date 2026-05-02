/**
 * CardSixExitGateFooter — sticky bottom，3 個自動勾選
 * 卡 6 失敗不退卡，留在頁面補資訊
 */
import { ArrowRight, AlertTriangle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { ReflectionHint } from "@/components/worksheet/ReflectionHint";

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
  const canAdvance = answersAllPassed && noSolutionPassed && rawResponseLong && !submitting;

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
        <ul className="flex flex-col gap-2">
          <ReflectionHint
            question="AI 給你的 8 個答案裡，哪一個讓你最意外？為什麼意外？"
            state={answersAllPassed ? "ok" : answersPassedCount > 0 ? "thinking" : "pending"}
            hint={
              !answersAllPassed
                ? `8 題中已填 ${answersPassedCount} 題（每題需達最少字數）。`
                : undefined
            }
          />
          <ReflectionHint
            question="AI 是在描述這群人，還是在試圖賣你一個解法？"
            state={noSolutionPassed ? "ok" : "thinking"}
            hint={
              !noSolutionPassed
                ? "AI 回覆出現推銷詞 — 用補強 prompt 重跑、或把推銷段落手動覆寫掉。"
                : undefined
            }
          />
          <ReflectionHint
            question="原始回覆都留下來了嗎？以後你要回看的是 AI 原話，不是你的摘要。"
            state={rawResponseLong ? "ok" : "pending"}
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
            to="/learn/worksheet/05"
            className="text-[13px] text-text-secondary hover:text-text-primary underline-offset-2 hover:underline self-center sm:self-auto"
          >
            ← 回去把卡 5 想清楚再來
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
              {submitting ? "儲存中…" : "繼續到卡 7：自己先猜 + 讀 AI"}
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

