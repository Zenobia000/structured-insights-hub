import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Judgment } from "@/types/painCard";

type Props = {
  scoresAllFilled: boolean;
  judgmentChosen: boolean;
  reasonPassed: boolean;
  nextActionChosen: boolean;
  reasonLen: number;
  reasonMin: number;
  judgment: Judgment | null;
  blockedMessage: string | null;
  submitting: boolean;
  onAdvance: () => void;
  onBack: () => void;
};

const STATUS_LABEL: Record<string, string> = {
  true_pain: "structured（已結構化）",
  pending_interview: "pending_interview（待訪談）",
  fake_pain: "archived_fake（封存為假痛點）",
};

export function CardNineExitGateFooter({
  scoresAllFilled,
  judgmentChosen,
  reasonPassed,
  nextActionChosen,
  reasonLen,
  reasonMin,
  judgment,
  blockedMessage,
  submitting,
  onAdvance,
  onBack,
}: Props) {
  const checks = [
    { label: "已完成 5 維度反思", passed: scoresAllFilled },
    { label: "已選 真 / 假 / 待訪談", passed: judgmentChosen },
    {
      label: `書面理由 ≥ ${reasonMin} 字（目前 ${reasonLen}）`,
      passed: reasonPassed,
    },
    { label: "已選下一步行動", passed: nextActionChosen },
  ];
  const allPassed = checks.every((c) => c.passed);
  const statusPreview = judgment ? STATUS_LABEL[judgment] : null;

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

        {statusPreview && allPassed && (
          <p className="text-[12.5px] text-text-secondary">
            <span className="text-text-primary font-medium">過關後 status 將寫入：</span>{" "}
            {statusPreview}
          </p>
        )}

        {blockedMessage && (
          <div className="rounded-md border-2 border-secondary/40 bg-secondary/5 px-3 py-2 text-sm text-text-secondary">
            <span className="font-medium text-text-primary">還缺什麼：</span> {blockedMessage}
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-2 pt-1">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-text-secondary hover:text-text-primary"
          >
            ← 退回卡 8
          </Button>
          <Button
            onClick={onAdvance}
            disabled={!allPassed || submitting}
            className="bg-accent text-accent-foreground hover:bg-accent/90 disabled:bg-muted disabled:text-text-muted"
          >
            {submitting ? "前往中…" : "查看你的痛點身份證 →"}
          </Button>
        </div>
      </div>
    </div>
  );
}
