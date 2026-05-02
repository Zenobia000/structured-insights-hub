import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DIMENSIONS,
  type DimensionKey,
} from "@/lib/cardNineValidators";
import type { Score } from "@/types/painCard";

type Props = {
  values: Record<DimensionKey, Score | null>;
  onChange: (key: DimensionKey, value: Score) => void;
};

export function ScoresForm({ values, onChange }: Props) {
  return (
    <div className="space-y-4">
      {DIMENSIONS.map((d) => {
        const value = values[d.key];
        return (
          <div
            key={d.key}
            className="rounded-lg border border-border bg-surface p-4 sm:p-5 space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[16px] font-semibold text-text-primary">
                  {d.label}
                </h3>
                <p className="text-[13px] text-text-secondary leading-[1.55] mt-0.5">
                  {d.subtitle}
                </p>
              </div>
              {value !== null && (
                <span className="text-[11.5px] text-verified inline-flex items-center gap-1 shrink-0">
                  <Check className="h-3 w-3" /> 已打分
                </span>
              )}
            </div>

            <ul className="text-[12.5px] text-text-secondary space-y-0.5 leading-[1.55]">
              {d.levels.map((l) => (
                <li key={l.v}>
                  <span className="font-mono font-semibold text-text-primary">
                    {l.v}
                  </span>{" "}
                  {l.text}
                </li>
              ))}
            </ul>

            {/* Segmented scale 1-5 */}
            <div
              role="radiogroup"
              aria-label={d.label}
              className="flex gap-1.5"
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                  e.preventDefault();
                  const cur = value ?? 0;
                  const delta = e.key === "ArrowRight" ? 1 : -1;
                  const next = Math.min(5, Math.max(1, cur + delta));
                  onChange(d.key, next as Score);
                }
              }}
            >
              {[1, 2, 3, 4, 5].map((n) => {
                const selected = value === n;
                return (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => onChange(d.key, n as Score)}
                    className={cn(
                      "flex-1 h-10 rounded-md border text-[14px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary",
                      selected
                        ? "bg-secondary text-secondary-foreground border-secondary"
                        : "bg-surface text-text-primary border-border hover:border-secondary/60",
                    )}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
