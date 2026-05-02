/**
 * TrizSelector — 6 選 1 RadioGroup（順序固定 1-6，無動畫）
 *
 * 鐵律：
 * - 標準 <input type="radio">（單選）
 * - 垂直排列、順序 1-6 固定
 * - 禁止 carousel / shuffle / flip / spin / 翻牌動畫
 */
import type { TrizId } from "@/types/painCard";
import { TRIZ_OPTIONS } from "@/lib/trizOptions";
import { cn } from "@/lib/utils";

type Props = {
  value: TrizId | null;
  onChange: (id: TrizId) => void;
  highlight?: boolean;
};

export function TrizRadioSelector({ value, onChange, highlight }: Props) {
  return (
    <fieldset
      className={cn(
        "rounded-lg border bg-surface p-2 sm:p-3 space-y-1.5",
        highlight ? "border-secondary ring-2 ring-secondary/30" : "border-border",
      )}
      aria-label="6 種矛盾單選"
    >
      <legend className="sr-only">從 6 種矛盾選 1 個</legend>
      {TRIZ_OPTIONS.map((o) => {
        const checked = value === o.id;
        const inputId = `triz-${o.id}`;
        return (
          <label
            key={o.id}
            htmlFor={inputId}
            className={cn(
              "flex items-start gap-3 rounded-md border px-3 py-2.5 cursor-pointer",
              "focus-within:ring-2 focus-within:ring-ring",
              checked
                ? "border-secondary bg-secondary/5"
                : "border-border bg-surface hover:bg-muted-bg/40",
            )}
          >
            <input
              id={inputId}
              type="radio"
              name="triz_id"
              value={o.id}
              checked={checked}
              onChange={() => onChange(o.id)}
              className="mt-1 h-4 w-4 accent-secondary cursor-pointer"
            />
            <span className="min-w-0 flex-1">
              <span className="flex items-baseline gap-2">
                <span className="font-mono text-[13px] font-semibold text-secondary">{o.id}.</span>
                <span className="text-[15px] font-semibold text-text-primary leading-[1.4]">
                  {o.label}
                </span>
                <span className="text-[11px] text-text-muted font-mono">{o.en}</span>
              </span>
              <span className="block mt-1 text-[13px] text-text-secondary leading-[1.55]">
                典型範例：{o.example}
              </span>
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}
