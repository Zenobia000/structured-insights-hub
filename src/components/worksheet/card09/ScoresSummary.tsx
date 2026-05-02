import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DIMENSIONS, type DimensionKey } from "@/lib/cardNineValidators";

type Props = {
  filled: Record<DimensionKey, boolean>;
  allFilled: boolean;
  onSwitchToTeaching: () => void;
};

export function ScoresSummary({ filled, allFilled, onSwitchToTeaching }: Props) {
  if (!allFilled) {
    return (
      <div className="rounded-lg border border-border bg-surface p-5 sm:p-6 space-y-3 max-w-3xl">
        <h2 className="text-[20px] font-bold text-text-primary">5 維度反思</h2>
        <p className="text-[14.5px] text-text-secondary leading-[1.6]">
          5 維度反思尚未完成。生產模式不顯示打分介面 — 請先切到教學模式完成 5 維度反思。
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={onSwitchToTeaching}
          className="border-secondary text-secondary hover:bg-secondary/10"
        >
          切到教學模式 →
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-5 sm:p-6 space-y-4 max-w-3xl">
      <header className="space-y-1">
        <h2 className="text-[20px] font-bold text-text-primary">
          5 維度反思（已完成）
        </h2>
        <p className="text-[13.5px] text-text-secondary leading-[1.55]">
          這個痛點已通過 5 維度反思評分。生產模式不顯示分數，避免異化為品質排名。如需查看分數請切到教學模式。
        </p>
      </header>
      <ul className="space-y-1.5">
        {DIMENSIONS.map((d) => (
          <li
            key={d.key}
            className="flex items-center gap-2 text-[14px] text-text-primary"
          >
            <Check className="h-4 w-4 text-verified shrink-0" aria-hidden />
            <span>{d.label.replace(/^\d+\.\s*/, "")}</span>
          </li>
        ))}
      </ul>
      <span
        className="inline-flex items-center gap-1.5 rounded-md border-2 border-verified/50 bg-verified/5 px-2.5 py-1 text-[12px] font-bold text-verified"
        aria-label="5 維度反思狀態"
      >
        <Check className="h-3 w-3" /> 已完成 5 維度反思
      </span>
    </div>
  );
}
