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

  const sidesState: ReflectionHintState = sidesPass ? "ok" : "pending";
  const sacrificedState: ReflectionHintState = sacrificedPass ? "ok" : "pending";
  const reasonState: ReflectionHintState = sacrificedReasonPass
    ? "ok"
    : sacrificedPass
      ? "thinking"
      : "pending";

  return (
    <div className="sticky bottom-0 left-0 right-0 z-20 border-t border-border bg-surface/95 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 space-y-3">
        <h3 className="text-sm font-semibold text-text-primary">反思問題</h3>
        <ul className="flex flex-col gap-2">
          <ReflectionHint
            question="A、B 兩端，你能不能各自用一句話讓別人聽得懂？"
            state={sidesState}
            hint={!sidesPass ? "兩端都需要寫到 ≥ 10 字才算具體。" : undefined}
          />
          <ReflectionHint
            question="這個人通常會犧牲哪一邊？你有標出來嗎？"
            state={sacrificedState}
          />
          <ReflectionHint
            question="為什麼是那邊被犧牲？是他自己說的、還是你猜的？"
            state={reasonState}
            hint={
              !sacrificedReasonPass && sacrificedPass
                ? "用一句話把原因寫清楚，不要只是「比較不重要」這種空話。"
                : undefined
            }
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

