import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  phaseAComplete: boolean;
  checkpointsAllPassed: boolean;
  checkpointsPassedCount: number;
  tablePassed: boolean;
  deltasAllFilled: boolean;
  blockedMessage: string | null;
  submitting: boolean;
  onAdvance: () => void;
  onBack?: () => void;
};

export function CardSevenExitGateFooter({
  phaseAComplete,
  checkpointsAllPassed,
  checkpointsPassedCount,
  tablePassed,
  deltasAllFilled,
  blockedMessage,
  submitting,
  onAdvance,
  onBack,
}: Props) {
  const checks = [
    { label: "Phase A 4 欄猜測已寫完", passed: phaseAComplete },
    {
      label: `4 個 AI checkpoint 全部通過（${checkpointsPassedCount}/4）`,
      passed: checkpointsAllPassed,
    },
    { label: "有貼上 AI 痛點判斷表（≥ 100 字）", passed: tablePassed },
    { label: "3 個 deltas 都填寫完整（每欄 ≥ 20 字）", passed: deltasAllFilled },
  ];
  const allPassed = checks.every((c) => c.passed);

  return (
    <div className="sticky bottom-0 left-0 right-0 z-10 border-t border-border bg-surface/95 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text-primary">過關檢查</h3>
          {allPassed && (
            <span className="text-xs font-medium text-verified inline-flex items-center gap-1">
              <Check className="h-3 w-3" /> 全部通過
            </span>
          )}
        </div>
        <ul className="space-y-1.5">
          {checks.map((c, i) => (
            <li
              key={i}
              className={cn(
                "flex items-start gap-2 text-sm",
                c.passed ? "text-text-primary" : "text-text-secondary",
              )}
            >
              {c.passed ? (
                <Check className="h-4 w-4 mt-0.5 text-verified shrink-0" aria-hidden />
              ) : (
                <X className="h-4 w-4 mt-0.5 text-text-muted shrink-0" aria-hidden />
              )}
              <span>{c.label}</span>
            </li>
          ))}
        </ul>

        {blockedMessage && (
          <div className="rounded-md border-2 border-secondary/40 bg-secondary/5 px-3 py-2 text-sm text-text-secondary">
            <span className="font-medium text-text-primary">還缺什麼：</span>{" "}
            {blockedMessage}
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-2 pt-1">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-text-secondary hover:text-text-primary"
          >
            ← 退回卡 6 補資訊
          </Button>
          <Button
            onClick={onAdvance}
            disabled={!allPassed || submitting}
            className="bg-accent text-accent-foreground hover:bg-accent/90 disabled:bg-muted disabled:text-text-muted"
          >
            {submitting ? "前往中…" : "進入卡 8：真人訪談規劃 →"}
          </Button>
        </div>
      </div>
    </div>
  );
}
