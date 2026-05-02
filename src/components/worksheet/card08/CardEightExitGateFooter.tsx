import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  hasContact: boolean;
  questionsAllFilled: boolean;
  taboosUnderstood: boolean;
  blockedMessage: string | null;
  submitting: boolean;
  noContactAtAll: boolean;
  onAdvance: () => void;
  onBackToCard2: () => void;
};

export function CardEightExitGateFooter({
  hasContact,
  questionsAllFilled,
  taboosUnderstood,
  blockedMessage,
  submitting,
  noContactAtAll,
  onAdvance,
  onBackToCard2,
}: Props) {
  const checks = [
    { label: "至少 1 位有名字 / 聯絡管道的訪談對象", passed: hasContact },
    { label: "3 題訪談題已寫完（推銷題只警告，不擋）", passed: questionsAllFilled },
    { label: "知道訪談時不要做什麼", passed: taboosUnderstood },
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
            variant={noContactAtAll ? "default" : "ghost"}
            onClick={onBackToCard2}
            className={
              noContactAtAll
                ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                : "text-text-secondary hover:text-text-primary"
            }
          >
            ← 退回卡 2{noContactAtAll ? "（你還沒接觸這群人）" : ""}
          </Button>
          <Button
            onClick={onAdvance}
            disabled={!allPassed || submitting}
            className="bg-accent text-accent-foreground hover:bg-accent/90 disabled:bg-muted disabled:text-text-muted"
          >
            {submitting ? "前往中…" : "進入卡 9：真假判斷 →"}
          </Button>
        </div>
      </div>
    </div>
  );
}
