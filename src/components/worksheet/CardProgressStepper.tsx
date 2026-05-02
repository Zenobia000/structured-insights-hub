/**
 * CardProgressStepper — 9 步進度條 + 結果頁身份證 (Grok dark theme)
 *
 * 唯一目的：讓使用者知道自己在哪、之前完成了哪幾張、後面還有哪幾張。
 * 不是排名工具、不是評分工具、不是激勵工具。
 *
 * 不顯示：完成度百分比、剩餘預估時間、與其他使用者的比較。
 */

import { Link, useLocation } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { memo } from "react";

import { usePainCardStore } from "@/store/painCard";
import type { CurrentStep } from "@/types/painCard";
import { STEP_LABELS } from "@/types/painCard";
import { cn } from "@/lib/utils";

const STEPS: CurrentStep[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

type StepState = "completed" | "current" | "locked";

/**
 * step 顯示狀態:
 * - current: 使用者目前正在這一卡(看 URL,而不是 store)
 * - completed: 已經到過(<= maxReached)且不是當前頁
 * - locked: 還沒解鎖(> maxReached)
 */
function stateOf(step: CurrentStep, current: CurrentStep, maxReached: CurrentStep): StepState {
  if (step === current) return "current";
  if (step <= maxReached) return "completed";
  return "locked";
}

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

/** 從 URL pathname 解析出目前在第幾卡;不在 worksheet 卡片內就回 store 的 current_step */
function stepFromPath(pathname: string, fallback: CurrentStep): CurrentStep {
  const m = pathname.match(/\/learn\/worksheet\/(\d{2})/);
  if (m) {
    const n = Number(m[1]);
    if (n >= 1 && n <= 9) return n as CurrentStep;
  }
  if (pathname.includes("/learn/worksheet/result")) return 10;
  return fallback;
}

export function CardProgressStepper() {
  const maxReached = usePainCardStore((s) => s.card.current_step);
  const { pathname } = useLocation();
  const current = stepFromPath(pathname, maxReached);
  const resultState: StepState =
    current === 10 ? "current" : maxReached === 10 ? "completed" : "locked";

  return (
    <nav
      aria-label="痛點填空簿進度"
      className="w-full border-b border-border-hairline bg-canvas-base/80 backdrop-blur-md"
    >
      {/* Mobile: 折疊文字 */}
      <div className="md:hidden flex items-center justify-between px-5 py-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
          Card{" "}
          <span className="text-text-primary tabular-nums">{String(current).padStart(2, "0")}</span>
          {" / 09"}
          {current === 10 && " · DONE"}
        </span>
        <span className="text-[13px] text-text-secondary truncate max-w-[60%]">
          {STEP_LABELS[current]}
        </span>
      </div>

      {/* Desktop / Tablet: 水平 stepper */}
      <ol className="hidden md:flex items-start justify-between gap-1 px-8 py-5 max-w-6xl mx-auto">
        {STEPS.map((step, i) => {
          const state = stateOf(step, current, maxReached);
          const isLast = i === STEPS.length - 1;
          return (
            <li key={step} className="flex-1 flex items-start min-w-0">
              <div className="flex flex-col items-center min-w-0 flex-1">
                <StepDot step={step} state={state} />
                <span
                  className={cn(
                    "mt-2.5 font-mono text-[10px] uppercase tracking-[0.06em] truncate max-w-[72px]",
                    state === "completed" && "text-text-secondary",
                    state === "current" && "text-accent-electric",
                    state === "locked" && "text-text-tertiary",
                  )}
                >
                  {STEP_LABELS[step]}
                </span>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "h-px flex-1 mt-3.5 mx-1 transition-colors",
                    step < maxReached ? "bg-accent-electric/60" : "bg-border-hairline",
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
              "h-px w-6 mt-3.5 mr-1 transition-colors",
              maxReached === 10 ? "bg-accent-electric/60" : "bg-border-hairline",
            )}
            aria-hidden
          />
          <div className="flex flex-col items-center">
            <Link
              to="/learn/worksheet/result"
              aria-label="痛點身份證 (結果頁)"
              className={cn(
                "h-7 w-7 rounded-full flex items-center justify-center text-[12px] font-medium transition-all duration-200",
                resultState === "completed"
                  ? "bg-accent-electric text-text-primary glow-accent-sm"
                  : "border border-border-hairline bg-canvas-raised text-text-tertiary hover:border-border-default",
              )}
            >
              ◆
            </Link>
            <span className="mt-2.5 font-mono text-[10px] uppercase tracking-[0.06em] text-text-tertiary">
              ID
            </span>
          </div>
        </li>
      </ol>
    </nav>
  );
}

const StepDot = memo(function StepDot({ step, state }: { step: CurrentStep; state: StepState }) {
  const baseClasses =
    "h-7 w-7 rounded-full flex items-center justify-center transition-all duration-200 font-mono text-[11px] tabular-nums";

  const numberLabel = String(step).padStart(2, "0");

  if (state === "locked") {
    return (
      <div
        aria-current={undefined}
        aria-label={`卡 ${step}（鎖定）`}
        className={cn(
          baseClasses,
          "border border-border-hairline bg-canvas-raised text-text-tertiary",
        )}
      >
        {numberLabel}
      </div>
    );
  }

  if (state === "completed") {
    return (
      <Link
        to={pathFor(step)}
        aria-label={`卡 ${step}（已完成）`}
        className={cn(
          baseClasses,
          "border border-accent-electric/40 bg-accent-electric-subtle text-accent-electric hover:bg-accent-electric-subtle hover:border-accent-electric",
        )}
      >
        <Check className="h-3 w-3" strokeWidth={2.5} aria-hidden />
      </Link>
    );
  }

  // current
  return (
    <Link
      to={pathFor(step)}
      aria-current="step"
      aria-label={`卡 ${step}（進行中）`}
      className={cn(baseClasses, "bg-accent-electric text-text-primary glow-accent-sm")}
    >
      {numberLabel}
    </Link>
  );
});
