/**
 * AiToolSelector — 4 張並排（Desktop） / 2x2（Tablet） / 垂直（Mobile）
 * 單選 + 1 句話為什麼選
 */
import type { AiTool } from "@/types/painCard";
import { AI_TOOLS } from "@/lib/cardSixHelpers";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

type Props = {
  selected: AiTool | null;
  onSelect: (id: AiTool) => void;
  reason: string;
  onReasonChange: (v: string) => void;
  highlight?: boolean;
};

export function AiToolSelector({
  selected,
  onSelect,
  reason,
  onReasonChange,
  highlight,
}: Props) {
  return (
    <div className="space-y-4">
      <fieldset
        className={cn(
          "rounded-lg",
          highlight && !selected && "ring-2 ring-secondary/30 p-1",
        )}
      >
        <legend className="sr-only">選 1 個 AI 工具</legend>
        <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {AI_TOOLS.map((t) => {
            const active = selected === t.id;
            const inputId = `tool-${t.id}`;
            return (
              <li key={t.id}>
                <label
                  htmlFor={inputId}
                  className={cn(
                    "block rounded-lg border-2 p-4 cursor-pointer h-full",
                    "focus-within:ring-2 focus-within:ring-ring transition-all",
                    active
                      ? "border-secondary bg-primary-light"
                      : selected
                        ? "border-border bg-surface opacity-60 hover:opacity-100"
                        : "border-border bg-surface hover:border-secondary hover:-translate-y-0.5",
                  )}
                >
                  <input
                    id={inputId}
                    type="radio"
                    name="ai_tool"
                    value={t.id}
                    checked={active}
                    onChange={() => onSelect(t.id)}
                    className="sr-only"
                  />
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[15px] font-bold text-text-primary leading-[1.35]">
                      {t.name}
                    </span>
                    {t.recommended && (
                      <span className="inline-flex items-center gap-1 rounded-md border border-verified/40 bg-verified/10 px-1.5 py-0.5 text-[10.5px] font-bold text-verified shrink-0">
                        <Sparkles className="h-3 w-3" aria-hidden />
                        第一次先用
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-[12.5px] text-text-secondary leading-[1.55]">
                    {t.bestFor}
                  </p>
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>

      <div className="space-y-1.5">
        <label
          htmlFor="ai_tool_reason"
          className="block text-[15px] font-semibold text-text-primary"
        >
          為什麼選這個工具？（1 句話）
        </label>
        <input
          id="ai_tool_reason"
          type="text"
          value={reason}
          onChange={(e) => onReasonChange(e.target.value)}
          placeholder="想找公開討論證據，所以用 ChatGPT Deep Research"
          maxLength={80}
          className="w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-[15px] text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-ring focus:border-secondary"
        />
        <p className="text-[12px] text-text-muted text-right">{reason.length} / 80</p>
      </div>
    </div>
  );
}
