/**
 * CardFourExitGateFooter — 卡 4 sticky 底部 (Grok dark)
 *
 * 失敗 ≥ 3 次 或 R2.4 觸發 → 顯示 retreat_action_card「回去把卡 1 想清楚再來」
 *
 * v2 變更：加入 aiAlternativesPass — 必須走過 AI 流程才能繼續
 *   （從「可選 AI」升級為「強制 AI」的核心 gate）
 */
import { ArrowRight, AlertTriangle, RotateCcw } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { ReflectionHint } from "@/components/worksheet/ReflectionHint";

type Props = {
  toolNamePass: boolean;
  /** v2: AI 必須列過 ≥3 個 workaround 才能繼續（強制 AI） */
  aiAlternativesPass: boolean;
  dissatisfactionsPass: boolean;
  submitting?: boolean;
  blockedMessage?: string | null;
  failureCount: number;
  forbiddenTriggered: boolean;
  onAdvance: () => void;
  onRetreat: () => void;
};

export function CardFourExitGateFooter({
  toolNamePass,
  aiAlternativesPass,
  dissatisfactionsPass,
  submitting,
  blockedMessage,
  failureCount,
  forbiddenTriggered,
  onAdvance,
  onRetreat,
}: Props) {
  const canAdvance =
    toolNamePass &&
    aiAlternativesPass &&
    dissatisfactionsPass &&
    !submitting &&
    !forbiddenTriggered;

  const tooltip = forbiddenTriggered
    ? "工具/方法包含禁用詞 — 這個人可能還沒在花時間解"
    : !toolNamePass
      ? "請填具體工具/方法名（≥ 3 字）"
      : !aiAlternativesPass
        ? "等 AI 列完 ≥3 個 workaround 並貼回 Step 3"
        : !dissatisfactionsPass
          ? "至少需要 3 個來自主人翁的具體不滿理由"
          : undefined;

  const showRetreat = forbiddenTriggered || (failureCount >= 3 && !canAdvance);

  return (
    <div className="sticky bottom-0 left-0 right-0 z-20 border-t border-border-hairline bg-canvas-base/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-5 space-y-3">
        <ul className="flex flex-col gap-2">
          <ReflectionHint
            question="他過去 30 天有沒有真的花時間或錢試圖解？如果沒有，這真的痛嗎？"
            state={
              toolNamePass && !forbiddenTriggered
                ? "ok"
                : forbiddenTriggered
                  ? "thinking"
                  : "pending"
            }
            hint={
              forbiddenTriggered
                ? "你寫的方法名暗示他可能還沒花時間解 — 也許這個人沒這麼痛。"
                : undefined
            }
          />
          <ReflectionHint
            question="AI 列的 5 個 workaround，你看完並挑選後才繼續。"
            state={aiAlternativesPass ? "ok" : "pending"}
            hint={
              !aiAlternativesPass
                ? "Step 2 複製 prompt 給 AI，把回的 5 個方案貼回 Step 3。"
                : undefined
            }
          />
          <ReflectionHint
            question="他不滿意現有方法的理由，是他自己說的嗎？還是你猜的？"
            state={dissatisfactionsPass ? "ok" : "pending"}
          />
        </ul>

        {blockedMessage && !showRetreat && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-md border border-status-warning/40 bg-status-warning-bg px-3.5 py-3 text-[13.5px] leading-[1.6] text-text-primary"
          >
            <AlertTriangle className="h-4 w-4 text-status-warning shrink-0 mt-0.5" aria-hidden />
            <span>{blockedMessage}</span>
          </div>
        )}

        {showRetreat && (
          <div className="rounded-md border border-accent-electric/40 bg-accent-electric-subtle/40 p-4">
            <div className="flex items-start gap-3">
              <RotateCcw className="h-5 w-5 text-accent-electric shrink-0 mt-0.5" aria-hidden />
              <div className="min-w-0">
                <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-text-primary leading-[1.4]">
                  這個人可能還沒真正在意這個問題
                </h3>
                <p className="mt-1.5 text-[13.5px] leading-[1.65] text-text-secondary">
                  回去把卡 1 想清楚再來，這個人可能還沒真正在意這個問題（沒在花錢花時間解）。卡 2-4
                  的資料會保留供參考。
                </p>
                <button
                  type="button"
                  onClick={onRetreat}
                  className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-md border border-border-default bg-transparent px-3.5 text-[13px] font-medium text-text-primary hover:bg-surface-hover hover:border-border-strong transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-electric"
                >
                  回去把卡 1 想清楚再來，找另一個更痛的人
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-3">
          <Link
            to="/learn/worksheet/03"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.06em] text-text-tertiary hover:text-text-primary self-center sm:self-auto transition-colors"
          >
            ← Back to Card 03
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
              {submitting ? "儲存中…" : "繼續到卡 05"}
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
