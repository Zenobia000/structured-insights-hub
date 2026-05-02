/**
 * CardProgressStepper — 9 步進度條 + 結果頁身份證
 *
 * 唯一目的：讓使用者知道自己在哪、之前完成了哪幾張、後面還有哪幾張。
 * 不是排名工具、不是評分工具、不是激勵工具。
 *
 * 不顯示：完成度百分比、剩餘預估時間、與其他使用者的比較。
 */

import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { memo } from "react";

import { usePainCardStore } from "@/store/painCard";
import type { CurrentStep } from "@/types/painCard";
import { STEP_LABELS } from "@/types/painCard";
import { cn } from "@/lib/utils";

const STEPS: CurrentStep[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

type StepState = "completed" | "current" | "locked";

function stateOf(step: CurrentStep, current: CurrentStep): StepState {
  if (step < current) return "completed";
  if (step === current) return "current";
  return "locked";
}

// Lookup 表取代 template literal — 讓 pathFor 返回 literal union 型別，
// TanStack Router 的 <Link to> 才能在編譯期驗證路徑（消除 `as any` 逃逸）。
const STEP_PATHS = {
  1: "/learn/worksheet/01",
  2: "/learn/worksheet/02",
  3: "/learn/worksheet/03",
  4: "/learn/worksheet/04",
  5: "/learn/worksheet/05",
  6: "/learn/worksheet/06",
  7: "/learn/worksheet/07",
  8: "/learn/worksheet/08",
  9: "/learn/worksheet/09",
  10: "/learn/worksheet/result",
} as const;

type StepPath = (typeof STEP_PATHS)[keyof typeof STEP_PATHS];

function pathFor(step: CurrentStep | 10): StepPath {
  return STEP_PATHS[step];
}

export function CardProgressStepper() {
  const current = usePainCardStore((s) => s.card.current_step);
  const resultState: StepState =
    current === 10 ? "completed" : current >= 10 ? "completed" : "locked";

  return (
    <nav aria-label="痛點填空簿進度" className="w-full">
      {/* Mobile: 折疊文字 */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 text-sm">
        <span className="text-text-secondary">
          卡 <span className="font-semibold text-text-primary">{current}</span> / 9
          {current === 10 && " · 已完成"}
        </span>
        <span className="text-text-muted text-xs">{STEP_LABELS[current]}</span>
      </div>

      {/* Desktop / Tablet: 水平 stepper */}
      <ol className="hidden md:flex items-start justify-between gap-2 px-6 py-5 max-w-5xl mx-auto">
        {STEPS.map((step, i) => {
          const state = stateOf(step, current);
          const isLast = i === STEPS.length - 1;
          return (
            <li key={step} className="flex-1 flex items-start min-w-0">
              <div className="flex flex-col items-center min-w-0 flex-1">
                <StepDot step={step} state={state} />
                <span
                  className={cn(
                    "mt-2 text-xs font-medium truncate max-w-[64px]",
                    state === "completed" && "text-verified",
                    state === "current" && "text-secondary",
                    state === "locked" && "text-text-muted",
                  )}
                >
                  {STEP_LABELS[step]}
                </span>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "h-px flex-1 mt-5 mx-1",
                    state === "completed" ? "bg-verified" : "bg-border border-dashed",
                  )}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
        {/* 結果頁 / 身份證 */}
        <li className="flex items-start">
          <div
            className={cn(
              "h-px w-6 mt-5 mr-1",
              resultState === "completed" ? "bg-verified" : "bg-border border-dashed",
            )}
            aria-hidden
          />
          <div className="flex flex-col items-center">
            <Link
              to="/learn/worksheet/result"
              aria-label="痛點身份證 (結果頁)"
              className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center text-lg transition-colors",
                resultState === "completed"
                  ? "bg-verified text-verified-foreground"
                  : "bg-muted text-text-muted",
              )}
            >
              🪪
            </Link>
            <span className="mt-2 text-xs font-medium text-text-muted">身份證</span>
          </div>
        </li>
      </ol>
    </nav>
  );
}

// Memo'd: step 與 state 都是 primitive，shallow-equal 後 current_step 跳一格時
// 只有「先前的 current 點」與「新 current 點」會 re-render，其餘 7 個保持原狀。
const StepDot = memo(function StepDot({ step, state }: { step: CurrentStep; state: StepState }) {
  const content =
    state === "completed" ? (
      <Check className="h-4 w-4" aria-hidden />
    ) : (
      <span className="text-sm font-semibold">{step}</span>
    );

  const baseClasses = "h-10 w-10 rounded-full flex items-center justify-center transition-colors";

  if (state === "locked") {
    return (
      <div
        aria-current={undefined}
        aria-label={`卡 ${step}（鎖定）`}
        className={cn(baseClasses, "bg-muted text-text-muted")}
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      to={pathFor(step)}
      aria-current={state === "current" ? "step" : undefined}
      aria-label={`卡 ${step}（${state === "completed" ? "已完成" : "進行中"}）`}
      className={cn(
        baseClasses,
        state === "completed" && "bg-verified text-verified-foreground hover:opacity-90",
        state === "current" && "bg-secondary text-secondary-foreground ring-4 ring-secondary/20",
      )}
    >
      {content}
    </Link>
  );
});
