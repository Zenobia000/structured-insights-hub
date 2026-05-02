/**
 * 6 種矛盾預覽（Section 2）— 純資訊不可選
 */
import { TRIZ_OPTIONS } from "@/lib/trizOptions";

export function SixContradictionsPreview() {
  return (
    <div className="rounded-lg border border-border bg-surface px-4 sm:px-5 py-4">
      <p className="text-[13px] text-text-secondary mb-3">
        6 種矛盾預覽（順序固定 · 之後在 Step 3 確認選擇）：
      </p>
      <ol className="space-y-1.5">
        {TRIZ_OPTIONS.map((o) => (
          <li key={o.id} className="flex gap-2 text-[14.5px] text-text-primary leading-[1.55]">
            <span className="font-mono font-semibold text-secondary shrink-0 w-5">{o.id}.</span>
            <span>{o.label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
