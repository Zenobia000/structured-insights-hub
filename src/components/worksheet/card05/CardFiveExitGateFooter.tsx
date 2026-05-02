/**
 * CardFiveExitGateFooter — sticky 底部
 *
 * 蘇格拉底改版：拿掉「過關 / 退回」這套對抗框架，改用蘇格拉底問句與 ReflectionHint。
 * 與 Card 1-4、6-9 共用同一套「反思問題」格式（ReflectionHint + h3 標題）。
 */
import { ArrowRight, AlertTriangle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { ReflectionHint, type ReflectionHintState } from "@/components/worksheet/ReflectionHint";

type Props = {
  sidesPass: boolean;
  sacrificedPass: boolean;
  sacrificedReasonPass: boolean;
  submitting?: boolean;
  blockedMessage?: string | null;
  onAdvance: () => void;
};

export function CardFiveExitGateFooter({
  sidesPass,
  sacrificedPass,
  sacrificedReasonPass,
  submitting,
  blockedMessage,
  onAdvance,
}: Props) {
  const canAdvance = sidesPass && sacrificedPass && sacrificedReasonPass && !submitting;

  const tooltip = !sidesPass
    ? "回去把 A、B 兩端想清楚再來（每端至少 10 字）"
    : !sacrificedPass
      ? "回去想想他通常會犧牲哪邊"
      : !sacrificedReasonPass
        ? "回去把「為什麼那邊會被犧牲」用一句話寫清楚"
        : undefined;

  return (
    <div className="sticky bottom-0 left-0 right-0 z-20 border-t border-border bg-surface/95 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 space-y-3">
        <div>
          <p className="text-[12px] font-semibold tracking-wide uppercase text-text-secondary mb-1.5">
            想想看
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-[13px]">
            <ConditionItem passed={sidesPass} label="A、B 兩端都寫具體了嗎" />
            <ConditionItem passed={sacrificedPass} label="標出通常會犧牲哪邊了嗎" />
            <ConditionItem passed={sacrificedReasonPass} label="為什麼那邊會被犧牲，寫清楚了嗎" />
          </ul>
        </div>

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
          "mt-[7px] inline-block h-1.5 w-1.5 rounded-full shrink-0",
          passed ? "bg-text-primary" : "bg-text-muted/50",
        )}
      />
      <span className={cn(passed ? "text-text-primary" : "text-text-secondary")}>{label}</span>
    </li>
  );
}
