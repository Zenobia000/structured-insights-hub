/**
 * CardFourExitGateFooter — 卡 4 sticky 底部
 *
 * 失敗 ≥ 3 次 或 R2.4 觸發 → 顯示 retreat_action_card「退回卡 1」
 */
import { ArrowRight, AlertTriangle, RotateCcw } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

type Props = {
  toolNamePass: boolean;
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
  dissatisfactionsPass,
  submitting,
  blockedMessage,
  failureCount,
  forbiddenTriggered,
  onAdvance,
  onRetreat,
}: Props) {
  const canAdvance = toolNamePass && dissatisfactionsPass && !submitting && !forbiddenTriggered;

  const tooltip = forbiddenTriggered
    ? "工具/方法包含禁用詞 — 這個人可能還沒在花時間解"
    : !toolNamePass
      ? "請填具體工具/方法名（≥ 3 字）"
      : !dissatisfactionsPass
        ? "至少需要 3 個來自主人翁的具體不滿理由"
        : undefined;

  const showRetreat = forbiddenTriggered || (failureCount >= 3 && !canAdvance);

  return (
    <div className="sticky bottom-0 left-0 right-0 z-20 border-t border-border bg-surface/95 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 space-y-3">
        <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-[13px]">
          <ConditionItem
            passed={toolNamePass && !forbiddenTriggered}
            label="主人翁現在用的方法有具體名字"
          />
          <ConditionItem passed={dissatisfactionsPass} label="3 個他不滿意現有方法的具體理由" />
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
                  這個人可能還沒真正在意這個問題
                </h3>
                <p className="mt-1.5 text-[13.5px] leading-[1.6] text-text-secondary">
                  過不了 → 退回卡片 1，這個人可能還沒真正在意這個問題（沒在花錢花時間解）。 卡 2-4
                  的資料會保留供參考。
                </p>
                <button
                  type="button"
                  onClick={onRetreat}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3.5 py-1.5 text-[13px] font-semibold text-text-primary hover:bg-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  退回卡 1，找另一個更痛的人
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-2">
          <Link
            to="/learn/worksheet/03"
            className="text-[13px] text-text-secondary hover:text-text-primary underline-offset-2 hover:underline self-center sm:self-auto"
          >
            ← 回到卡 3
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
              {submitting ? "儲存中…" : "儲存並進入卡 5"}
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
