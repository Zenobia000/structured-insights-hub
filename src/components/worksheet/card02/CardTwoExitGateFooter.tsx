/**
 * CardTwoExitGateFooter — 卡 2 sticky 底部行動列。
 *
 * 失敗 ≥ 3 次顯示 fallback_action_card（「暫存先去找人」）。
 */
import { ArrowRight, AlertTriangle, Coffee } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { ReflectionHint } from "@/components/worksheet/ReflectionHint";

type Props = {
  realNamesPass: boolean;
  contactablePass: boolean;
  backgroundPass: boolean;
  allFilledPass: boolean;
  commitment: boolean;
  submitting?: boolean;
  blockedMessage?: string | null;
  failureCount: number;
  onAdvance: () => void;
  onParkAndExit: () => void;
};

export function CardTwoExitGateFooter({
  realNamesPass,
  contactablePass,
  backgroundPass,
  allFilledPass,
  commitment,
  submitting,
  blockedMessage,
  failureCount,
  onAdvance,
  onParkAndExit,
}: Props) {
  const canAdvance =
    allFilledPass &&
    realNamesPass &&
    contactablePass &&
    backgroundPass &&
    commitment &&
    !submitting;

  const tooltip = !allFilledPass
    ? "請先填完背景 + 3 組（姓名 / 聯絡方式 / 關係）"
    : !realNamesPass
      ? "有人選還是代稱（「老師 A」），請填具體姓名"
      : !contactablePass
        ? "至少要有 1 位寫了你今天能傳訊息的方式"
        : !backgroundPass
          ? "背景描述太籠統，請寫年齡 / 職業 / 地點任 2 項"
          : !commitment
            ? "請勾選右側「我確認今天能聯絡到至少 1 位」"
            : undefined;

  const showFallback = failureCount >= 3 && !canAdvance;

  return (
    <div className="sticky bottom-0 left-0 right-0 z-20 border-t border-border bg-surface/95 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 space-y-3">
        <h3 className="text-sm font-semibold text-text-primary">反思問題</h3>
        {/* Reflection hints (Socratic, not pass/fail) */}
        <ul className="flex flex-col gap-2">
          <ReflectionHint
            question="你能不能今天就傳訊息給其中一個？如果不能，那他算「有名字的人」嗎？"
            state={
              realNamesPass && contactablePass && commitment && allFilledPass
                ? "ok"
                : !allFilledPass
                  ? "pending"
                  : "thinking"
            }
            hint={
              allFilledPass && !realNamesPass
                ? "代稱（例如「補習班老師 A」）很難讓你今天就傳訊息出去。"
                : undefined
            }
          />
          <ReflectionHint
            question="這 3 個人的背景，你能不能用一句話告訴別人他們是誰？"
            state={backgroundPass ? "ok" : !allFilledPass ? "pending" : "thinking"}
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

        {/* Fallback action card */}
        {showFallback && (
          <div className="rounded-lg border-2 border-secondary/30 bg-secondary/5 p-4">
            <div className="flex items-start gap-3">
              <Coffee className="h-5 w-5 text-secondary shrink-0 mt-0.5" aria-hidden />
              <div className="min-w-0">
                <h3 className="text-[15px] font-bold text-text-primary leading-[1.4]">
                  想不到 3 個真名怎麼辦？
                </h3>
                <p className="mt-1.5 text-[13.5px] leading-[1.6] text-text-secondary">
                  你還不認識這個圈子。解法：先去這群人聚集的地方混 1-2 週（社團、LINE
                  群、實體場合），再回來。
                </p>
                <button
                  type="button"
                  onClick={onParkAndExit}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3.5 py-1.5 text-[13px] font-semibold text-text-primary hover:bg-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  暫存這份 PainCard，先去找人
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-2">
          <Link
            to="/learn/worksheet/01"
            className="text-[13px] text-text-secondary hover:text-text-primary underline-offset-2 hover:underline self-center sm:self-auto"
          >
            ← 回到卡 1（修改）
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
              {submitting ? "儲存中…" : "繼續到卡 3"}
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
