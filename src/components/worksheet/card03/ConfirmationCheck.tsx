/**
 * Step 4：確認 AI 列的問題你能回答（或預約找主人翁問）。
 * 提供 retreat link 退回卡 1，但保留 stuck_formula 已填內容。
 */
import { Link } from "@tanstack/react-router";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

type Props = {
  confirmed: boolean;
  onConfirmedChange: (v: boolean) => void;
  highlight?: boolean;
};

export function ConfirmationCheck({ confirmed, onConfirmedChange, highlight }: Props) {
  return (
    <section
      aria-labelledby="step-4-label"
      className={cn(
        "rounded-lg border bg-surface p-5 sm:p-6 space-y-4 transition-colors",
        highlight ? "border-secondary ring-2 ring-secondary/30" : "border-border",
      )}
    >
      <header>
        <p className="text-[12px] font-semibold tracking-widest uppercase text-secondary">
          Step 4
        </p>
        <h2 id="step-4-label" className="mt-1 text-[20px] font-bold text-text-primary leading-[1.35]">
          你能回答 AI 列的問題嗎？
        </h2>
        <p className="mt-1.5 text-[13.5px] text-text-secondary leading-[1.6]">
          AI 列的「需要再問清楚」如果你<span className="font-semibold text-text-primary">能回答</span>，或<span className="font-semibold text-text-primary">已預約找主人翁問</span>，就勾選確認。如果都答不出來 → 退回卡 1，去找主人翁再聊一次。
        </p>
      </header>

      <label
        htmlFor="stuck-confirmed"
        className="flex items-start gap-3 cursor-pointer rounded-md border border-border bg-page/60 p-3.5 hover:border-secondary/40 transition-colors"
      >
        <Checkbox
          id="stuck-confirmed"
          checked={confirmed}
          onCheckedChange={(v) => onConfirmedChange(v === true)}
          className="mt-0.5"
        />
        <span className="text-[14.5px] leading-[1.6] text-text-primary">
          我能回答上面的問題（或已預約找主人翁問）
        </span>
      </label>

      <p className="text-[12.5px] text-text-secondary">
        答不出來？{" "}
        <Link
          to="/learn/worksheet/01"
          className="text-secondary underline-offset-2 hover:underline font-medium"
        >
          退回卡 1 再聊一次 →
        </Link>{" "}
        （卡 3 已填內容會保留）
      </p>
    </section>
  );
}
