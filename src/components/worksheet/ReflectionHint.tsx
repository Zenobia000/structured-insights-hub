/**
 * ReflectionHint — 蘇格拉底式反思提示元件。
 *
 * 取代舊的 ConditionItem「過關 / 不過關」二元提示，
 * 改為以中性色彩、不評分的方式呈現「你還可以再想想什麼」。
 *
 * 設計原則：
 * - 不用紅色（fail）或綠色（pass）的對立色階
 * - 用 text-text-secondary 與 text-text-muted 的層級
 * - 圖示僅作視覺錨點，不施加道德壓力
 */
import { cn } from "@/lib/utils";

export type ReflectionHintState = "pending" | "thinking" | "ok";

export type ReflectionHintProps = {
  /** 蘇格拉底自問句，例：「這句話是他說的、還是你幫他歸納的？」 */
  question: string;
  /** 此問題對應的當前狀態：尚未填 / 已填得粗糙 / 已填得具體（影響圖示而非評分） */
  state: ReflectionHintState;
  /** 額外提示，例如「我們在你的輸入裡看到『可能』『應該』這類分析語」 */
  hint?: string;
};

/** state -> 圖示符號 */
const STATE_GLYPH: Record<ReflectionHintState, string> = {
  pending: "○",
  thinking: "◇",
  ok: "✓",
};

/** state -> 圖示色階（皆為中性，不施壓） */
const STATE_TONE: Record<ReflectionHintState, string> = {
  pending: "text-text-muted",
  thinking: "text-text-secondary",
  ok: "text-text-secondary",
};

/** state -> 文字主色（不分對錯，僅是視覺權重） */
const STATE_TEXT: Record<ReflectionHintState, string> = {
  pending: "text-text-secondary",
  thinking: "text-text-primary",
  ok: "text-text-primary",
};

export function ReflectionHint({ question, state, hint }: ReflectionHintProps) {
  return (
    <li className="flex items-start gap-2">
      <span
        aria-hidden
        className={cn(
          "mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center text-[12px] leading-none",
          STATE_TONE[state],
        )}
      >
        {STATE_GLYPH[state]}
      </span>
      <div className="min-w-0 space-y-0.5">
        <p className={cn("text-[13px] leading-[1.55]", STATE_TEXT[state])}>{question}</p>
        {hint && (
          <p className="text-[12px] leading-[1.5] text-text-muted">{hint}</p>
        )}
      </div>
    </li>
  );
}
