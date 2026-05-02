/**
 * ProgressVisual — 9 個圓點水平排列 (Grok dark theme)。
 *
 * 嚴格規定：
 * - 不顯示百分比、不顯示分數、不是進度條
 * - 每點下方標註「卡 N · X-Y 分鐘」
 * - 圓點呼吸動畫（純視覺，無 score 含意）
 * - aria 給螢幕閱讀器列出每一步名稱
 */
import { cn } from "@/lib/utils";
import { STEP_TITLES, type CurrentStep } from "@/types/painCard";

const STEP_TIMES: Record<number, string> = {
  1: "5-10",
  2: "5-10",
  3: "10-15",
  4: "5-10",
  5: "5-10",
  6: "10-15",
  7: "10-15",
  8: "5-10",
  9: "5-10",
};

export function ProgressVisual() {
  const steps = Array.from({ length: 9 }, (_, i) => (i + 1) as CurrentStep);

  return (
    <div role="list" aria-label="9 個步驟概覽，從卡 1 抱怨原句到卡 9 真假判斷" className="w-full">
      <ol className="flex items-start justify-between gap-1">
        {steps.map((n, idx) => (
          <li
            key={n}
            role="listitem"
            aria-label={`第 ${n} 步：${STEP_TITLES[n]}`}
            className="group flex flex-1 flex-col items-center text-center min-w-0"
          >
            <div className="relative flex h-5 items-center justify-center w-full">
              {idx > 0 && (
                <span
                  aria-hidden
                  className="absolute right-1/2 left-0 top-1/2 -translate-y-1/2 h-px bg-border-hairline"
                />
              )}
              <span
                aria-hidden
                className={cn(
                  "relative z-10 flex items-center justify-center",
                  "h-2.5 w-2.5 rounded-full",
                  "bg-accent-electric/70 ring-[3px] ring-accent-electric/15",
                  "transition-all duration-300 group-hover:bg-accent-electric group-hover:ring-accent-electric/25",
                  "animate-pulse",
                )}
                style={{ animationDelay: `${idx * 120}ms`, animationDuration: "2.4s" }}
              />
            </div>
            <span className="mt-3 font-mono text-[10px] uppercase tracking-[0.08em] text-text-tertiary">
              {String(n).padStart(2, "0")}
            </span>
            <span className="mt-1 text-[11px] tabular-nums text-text-secondary leading-tight">
              {STEP_TIMES[n]} 分鐘
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
