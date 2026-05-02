import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Judgment } from "@/types/painCard";

type Props = {
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
  const hints = [
    { label: "想想看你選了哪一種判斷（真 / 假 / 待訪談）", done: judgmentChosen },
    {
      label: `想想看你的書面理由有沒有寫到 ${reasonMin} 字（目前 ${reasonLen}）`,
      done: reasonPassed,
    },
    { label: "想想看你之後最想做哪一件事", done: nextActionChosen },
  ];
  const allDone = hints.every((h) => h.done);
  const statusPreview = judgment ? STATUS_LABEL[judgment] : null;

  return (
    <div className="sticky bottom-0 left-0 right-0 z-10 border-t border-border bg-surface/95 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text-primary">想想看</h3>
          {allDone && (
            <span className="text-xs font-medium text-verified inline-flex items-center gap-1">
              <Check className="h-3 w-3" /> 三個都想清楚了
            </span>
          )}
        </div>
        <ul className="space-y-1.5">
          {hints.map((h, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-text-secondary leading-[1.55]"
            >
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-text-muted shrink-0" aria-hidden />
              <span>{h.label}</span>
            </li>
          ))}
        </ul>

        {statusPreview && allDone && (
          <p className="text-[12.5px] text-text-secondary">
            <span className="text-text-primary font-medium">送出後 status 將寫入：</span>{" "}
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
            ← 回去把卡 8 想清楚再來
          </Button>
          <Button
            onClick={onAdvance}
            disabled={!allDone || submitting}
            className="bg-accent text-accent-foreground hover:bg-accent/90 disabled:bg-muted disabled:text-text-muted"
          >
            {submitting ? "前往中…" : "查看你的痛點身份證 →"}
          </Button>
        </div>
      </div>
    </div>
  );
}
