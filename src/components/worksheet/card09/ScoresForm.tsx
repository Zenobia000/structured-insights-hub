import { useEffect, useRef, useId } from "react";
import { Check, Keyboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { DIMENSIONS, type DimensionKey } from "@/lib/cardNineValidators";
import type { Score } from "@/types/painCard";

type Props = {
  values: Record<DimensionKey, Score | null>;
  onChange: (key: DimensionKey, value: Score) => void;
};

/**
 * 5 維度評分卡 — 完整鍵盤無障礙
 *
 * 鍵盤模型（每個維度是一個 ARIA radiogroup，roving tabindex）：
 *  - Tab：依序進入每個維度的 radiogroup（每組只佔一個 tab stop）
 *  - ←/→：在當前維度切換 1↔5（含焦點移動）
 *  - ↑/↓：跳到上一/下一個維度的同分（或 1）
 *  - Home/End：跳到當前維度的 1 / 5
 *  - 1-5 數字鍵：直接設定當前維度的分數
 *  - Enter / Space：確認當前 focus 的數字
 */
export function ScoresForm({ values, onChange }: Props) {
  // 5 維度 × 5 分 的 button refs
  const refs = useRef<Record<DimensionKey, Array<HTMLButtonElement | null>>>({
    people_specificity: [],
    frequency: [],
    intensity: [],
    workaround_dissatisfaction: [],
    evidence_credibility: [],
  });

  function focusCell(dimIdx: number, score: number) {
    const dim = DIMENSIONS[dimIdx];
    if (!dim) return;
    const btn = refs.current[dim.key][score - 1];
    btn?.focus();
  }

  function handleKey(
    e: React.KeyboardEvent<HTMLDivElement>,
    dimIdx: number,
    dimKey: DimensionKey,
    currentValue: Score | null,
  ) {
    const cur = currentValue ?? 0;
    // 1-5 直接選
    if (/^[1-5]$/.test(e.key)) {
      e.preventDefault();
      const n = Number(e.key) as Score;
      onChange(dimKey, n);
      focusCell(dimIdx, n);
      return;
    }
    switch (e.key) {
      case "ArrowRight": {
        e.preventDefault();
        const next = Math.min(5, Math.max(1, cur + 1));
        onChange(dimKey, next as Score);
        focusCell(dimIdx, next);
        return;
      }
      case "ArrowLeft": {
        e.preventDefault();
        const next = Math.min(5, Math.max(1, (cur || 2) - 1));
        onChange(dimKey, next as Score);
        focusCell(dimIdx, next);
        return;
      }
      case "Home": {
        e.preventDefault();
        onChange(dimKey, 1);
        focusCell(dimIdx, 1);
        return;
      }
      case "End": {
        e.preventDefault();
        onChange(dimKey, 5);
        focusCell(dimIdx, 5);
        return;
      }
      case "ArrowDown": {
        e.preventDefault();
        const nextIdx = Math.min(DIMENSIONS.length - 1, dimIdx + 1);
        if (nextIdx === dimIdx) return;
        focusCell(nextIdx, cur || 1);
        return;
      }
      case "ArrowUp": {
        e.preventDefault();
        const nextIdx = Math.max(0, dimIdx - 1);
        if (nextIdx === dimIdx) return;
        focusCell(nextIdx, cur || 1);
        return;
      }
      default:
        return;
    }
  }

  return (
    <div className="space-y-4">
      <KeyboardHint />
      {DIMENSIONS.map((d, dimIdx) => (
        <DimensionRow
          key={d.key}
          dimIdx={dimIdx}
          dimension={d}
          value={values[d.key]}
          onChange={onChange}
          onKeyDown={handleKey}
          registerRef={(scoreIdx, el) => {
            refs.current[d.key][scoreIdx] = el;
          }}
        />
      ))}
    </div>
  );
}

function KeyboardHint() {
  return (
    <div
      role="note"
      className="flex items-start gap-2 rounded-md border border-secondary/30 bg-secondary/5 px-3 py-2 text-[12.5px] leading-[1.55] text-text-secondary"
    >
      <Keyboard
        className="h-3.5 w-3.5 text-secondary shrink-0 mt-0.5"
        aria-hidden
      />
      <p>
        <span className="font-semibold text-text-primary">鍵盤操作：</span>
        <kbd className="px-1 mx-0.5 rounded bg-muted text-[11px]">Tab</kbd>進入維度，
        <kbd className="px-1 mx-0.5 rounded bg-muted text-[11px]">1-5</kbd>直接選分，
        <kbd className="px-1 mx-0.5 rounded bg-muted text-[11px]">←</kbd>
        <kbd className="px-1 mx-0.5 rounded bg-muted text-[11px]">→</kbd>調整，
        <kbd className="px-1 mx-0.5 rounded bg-muted text-[11px]">↓</kbd>下一維度，
        <kbd className="px-1 mx-0.5 rounded bg-muted text-[11px]">Enter</kbd>確認。
      </p>
    </div>
  );
}

type DimensionRowProps = {
  dimIdx: number;
  dimension: (typeof DIMENSIONS)[number];
  value: Score | null;
  onChange: (key: DimensionKey, value: Score) => void;
  onKeyDown: (
    e: React.KeyboardEvent<HTMLDivElement>,
    dimIdx: number,
    dimKey: DimensionKey,
    currentValue: Score | null,
  ) => void;
  registerRef: (scoreIdx: number, el: HTMLButtonElement | null) => void;
};

function DimensionRow({
  dimIdx,
  dimension: d,
  value,
  onChange,
  onKeyDown,
  registerRef,
}: DimensionRowProps) {
  const labelId = useId();
  const descId = useId();

  // roving tabindex：已選中的格子 = 0；未選時第一格 = 0；其他 = -1
  function tabIndexOf(n: number): 0 | -1 {
    if (value !== null) return value === n ? 0 : -1;
    return n === 1 ? 0 : -1;
  }

  // 焦點進入時若還沒選，預設 focus 第一格（瀏覽器自動處理 tabIndex=0）
  // 焦點跨維度時保持當前焦點目標的視覺一致

  // 進入 group 後同步 focus indicator（純樣式，已在按鈕 focus-visible 上處理）

  // levels 文字摘要（給 screen reader）
  const levelsText = d.levels.map((l) => `${l.v} ${l.text}`).join("，");

  // 同步 focus 進入時：當 value 變化時不主動搶 focus（避免打斷使用者）
  useEffect(() => {
    /* no-op: focus 由 handleKey 控制 */
  }, [value]);

  return (
    <div className="rounded-lg border border-border bg-surface p-4 sm:p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 id={labelId} className="text-[16px] font-semibold text-text-primary">
            {d.label}
          </h3>
          <p
            id={descId}
            className="text-[13px] text-text-secondary leading-[1.55] mt-0.5"
          >
            {d.subtitle}
          </p>
        </div>
        {value !== null && (
          <span className="text-[11.5px] text-verified inline-flex items-center gap-1 shrink-0">
            <Check className="h-3 w-3" />
            <span aria-live="polite" aria-atomic="true">
              已打 {value} 分
            </span>
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

      {/* Segmented scale 1-5 — ARIA radiogroup with roving tabindex */}
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        aria-describedby={descId}
        className="flex gap-1.5"
        onKeyDown={(e) => onKeyDown(e, dimIdx, d.key, value)}
      >
        <span className="sr-only">
          {d.label}。可用方向鍵或數字鍵 1-5 選擇分數。{levelsText}。
        </span>
        {[1, 2, 3, 4, 5].map((n) => {
          const selected = value === n;
          return (
            <button
              key={n}
              ref={(el) => registerRef(n - 1, el)}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={`${n} 分`}
              tabIndex={tabIndexOf(n)}
              onClick={() => onChange(d.key, n as Score)}
              className={cn(
                "flex-1 h-10 rounded-md border text-[14px] font-semibold transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-1",
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
}
