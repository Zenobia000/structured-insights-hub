/**
 * ProgressVisual — 9 個圓點水平排列。
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
  1: "5-10 分",
  2: "5-10 分",
  3: "10-15 分",
  4: "5-10 分",
  5: "5-10 分",
  6: "10-15 分",
  7: "10-15 分",
  8: "5-10 分",
  9: "5-10 分",
};

export function ProgressVisual() {
  const steps = Array.from({ length: 9 }, (_, i) => (i + 1) as CurrentStep);

  return (
    <div
      role="list"
      aria-label="9 個步驟概覽，從卡 1 抱怨原句到卡 9 真假判斷"
      className="w-full"
    >
      <ol className="flex items-start justify-between gap-1 sm:gap-2">
        {steps.map((n, idx) => (
          <li
            key={n}
            role="listitem"
            aria-label={`第 ${n} 步：${STEP_TITLES[n]}`}
            className="flex-1 flex flex-col items-center text-center min-w-0"
          >
            <div className="relative flex items-center justify-center w-full">
              {idx > 0 && (
                <span
                  aria-hidden
                  className="absolute right-1/2 left-0 top-1/2 -translate-y-1/2 h-px bg-border"
                />
              )}
              <span
                aria-hidden
                className={cn(
                  "relative z-10 flex items-center justify-center",
                  "h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full",
                  "bg-secondary/70 ring-4 ring-secondary/10",
                  "animate-pulse",
                )}
                style={{ animationDelay: `${idx * 120}ms`, animationDuration: "2.4s" }}
              />
            </div>
            <span className="mt-2 text-[11px] sm:text-xs font-semibold text-text-primary">
              卡 {n}
            </span>
            <span className="text-[10px] sm:text-[11px] text-text-muted leading-tight mt-0.5">
              {STEP_TIMES[n]}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
