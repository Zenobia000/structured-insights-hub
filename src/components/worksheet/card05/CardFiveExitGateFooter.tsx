/**
 * CardFiveExitGateFooter — sticky 底部
 * AI 回「都不像」或多次失敗 → retreat to 卡 3
 */
import { ArrowRight, AlertTriangle, RotateCcw } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

type Props = {
  trizPass: boolean;
  sidesPass: boolean;
  sacrificedPass: boolean;
  submitting?: boolean;
  blockedMessage?: string | null;
  showRetreat: boolean;
  onAdvance: () => void;
  onRetreat: () => void;
};

export function CardFiveExitGateFooter({
  trizPass,
  sidesPass,
  sacrificedPass,
  submitting,
  blockedMessage,
  showRetreat,
  onAdvance,
  onRetreat,
}: Props) {
  const canAdvance = trizPass && sidesPass && sacrificedPass && !submitting;

  const tooltip = !trizPass
    ? "請先從 6 種矛盾選 1 個"
    : !sidesPass
      ? "A、B 兩端都需要具體（≥ 10 字）"
      : !sacrificedPass
        ? "請選通常會犧牲哪邊"
        : undefined;

  return (
    <div className="sticky bottom-0 left-0 right-0 z-20 border-t border-border bg-surface/95 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 space-y-3">
        <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-[13px]">
          <ConditionItem passed={trizPass} label="只選 1 個矛盾" />
          <ConditionItem passed={sidesPass} label="A、B 兩端都具體" />
          <ConditionItem passed={sacrificedPass} label="已標記犧牲哪邊" />
        </ul>

        {blockedMessage && !showRetreat && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-md border-2 border-caution/50 bg-caution/5 px-3 py-2.5 text-[13.5px] leading-[1.55] text-text-primary"
          >
            <AlertTriangle className="h-4 w-4 text-caution shrink-0 mt-0.5" aria-hidden />
            <span>{blockedMessage}</span>
          </div>
        )}

        {showRetreat && (
          <div className="rounded-lg border-2 border-secondary/30 bg-secondary/5 p-4">
            <div className="flex items-start gap-3">
              <RotateCcw className="h-5 w-5 text-secondary shrink-0 mt-0.5" aria-hidden />
              <div className="min-w-0">
                <h3 className="text-[15px] font-bold text-text-primary leading-[1.4]">
                  6 個都不像？拆得不夠細
                </h3>
                <p className="mt-1.5 text-[13.5px] leading-[1.6] text-text-secondary">
                  過不了 → 退回卡片 3 再聊一次主人翁，把卡關句寫得更具體。 卡 3-5
                  的資料會保留，修改卡 3 後請回來重新跑卡 5 的 AI prompt。
                </p>
                <button
                  type="button"
                  onClick={onRetreat}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3.5 py-1.5 text-[13px] font-semibold text-text-primary hover:bg-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  退回卡 3 重新拆
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-2">
          <Link
            to="/learn/worksheet/04"
            className="text-[13px] text-text-secondary hover:text-text-primary underline-offset-2 hover:underline self-center sm:self-auto"
          >
            ← 回到卡 4
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
              {submitting ? "儲存中…" : "儲存並進入卡 6"}
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
      <span className={cn(passed ? "text-text-primary" : "text-text-secondary")}>{label}</span>
    </li>
  );
}
