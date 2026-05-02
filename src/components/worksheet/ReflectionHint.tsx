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
 *
 * 2026-05 新增：examples — 卡住時顯示可一鍵複製的填寫範例
 */
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export type ReflectionHintState = "pending" | "thinking" | "ok";

export type ReflectionExample = {
  /** 範例分類標籤，例：「LINE」「IG」「Email」 */
  label: string;
  /** 可直接複製到輸入框的範例文字 */
  text: string;
};

export type ReflectionHintProps = {
  /** 蘇格拉底自問句，例：「這句話是他說的、還是你幫他歸納的？」 */
  question: string;
  /** 此問題對應的當前狀態：尚未填 / 已填得粗糙 / 已填得具體（影響圖示而非評分） */
  state: ReflectionHintState;
  /** 額外提示，例如「我們在你的輸入裡看到『可能』『應該』這類分析語」 */
  hint?: string;
  /** 卡住時可一鍵複製的填寫範例（state !== "ok" 時才顯示） */
  examples?: ReflectionExample[];
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

export function ReflectionHint({ question, state, hint, examples }: ReflectionHintProps) {
  const showExamples = state !== "ok" && examples && examples.length > 0;

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
      <div className="min-w-0 flex-1 space-y-1">
        <p className={cn("text-[13px] leading-[1.55]", STATE_TEXT[state])}>{question}</p>
        {hint && <p className="text-[12px] leading-[1.5] text-text-muted">{hint}</p>}
        {showExamples && <ExampleStrip examples={examples} />}
      </div>
    </li>
  );
}

/* ============================================================
   ExampleStrip — 一行 chips，每個都能點擊複製
   ============================================================ */
function ExampleStrip({ examples }: { examples: ReflectionExample[] }) {
  return (
    <div className="mt-1.5 space-y-1.5">
      <p className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-text-muted">
        Quick fill — 點任一個複製到剪貼簿
      </p>
      <div className="flex flex-wrap gap-1.5">
        {examples.map((ex) => (
          <ExampleChip key={ex.label} example={ex} />
        ))}
      </div>
    </div>
  );
}

function ExampleChip({ example }: { example: ReflectionExample }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(example.text);
      setCopied(true);
      toast.success(`已複製 ${example.label} 範例,貼到欄位後改成你的真實資料`, {
        duration: 4000,
      });
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("複製失敗,請手動選取下方文字");
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={example.text}
      className={cn(
        "group inline-flex max-w-full items-center gap-1.5 rounded-md border px-2 py-1 text-left transition-colors",
        "border-border-default bg-canvas-raised hover:border-accent-electric/50 hover:bg-surface-hover",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-electric/40",
      )}
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-accent-electric shrink-0">
        {example.label}
      </span>
      <span className="truncate text-[11.5px] text-text-secondary group-hover:text-text-primary">
        {example.text}
      </span>
      {copied ? (
        <Check className="h-3 w-3 shrink-0 text-status-success" />
      ) : (
        <Copy className="h-3 w-3 shrink-0 text-text-muted group-hover:text-text-primary" />
      )}
    </button>
  );
}
