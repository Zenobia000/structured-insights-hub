/**
 * ExampleReference — 摺疊式範例面板（卡 1 林老師範例）。
 * 直接引用 worksheet 原文，不重寫。
 */
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const EXAMPLE = [
  ["抱怨原句", "「我每週六晚上要寫 30 個學生的家長 LINE,平常週間都要記筆記但常漏,到週末翻 7 次小考成績單、翻群組對話、翻學生作業,常寫到半夜兩點。」"],
  ["是誰說的", "林老師（新北永和補習班）"],
  ["什麼時候說的", "2026-04-15"],
  ["當時他在做什麼", "我陪他從 21:00 跟到 02:30 親眼看他寫"],
] as const;

export function ExampleReference() {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border border-border bg-page">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="example-content"
        className="w-full flex items-center justify-between gap-3 px-5 py-3.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
      >
        <span className="text-[15px] font-semibold text-text-primary">
          📖 看 worksheet 林老師範例
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-text-secondary transition-transform shrink-0",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {open && (
        <div id="example-content" className="px-5 pb-5">
          <blockquote className="border-l-2 border-secondary pl-4 space-y-2.5">
            {EXAMPLE.map(([k, v]) => (
              <div key={k} className="text-[14px] leading-[1.65]">
                <span className="font-semibold text-text-primary">{k}：</span>
                <span className="text-text-secondary">{v}</span>
              </div>
            ))}
          </blockquote>
          <p className="mt-3 text-[12px] text-text-muted">
            來自{" "}
            <code className="font-mono text-text-secondary">
              docs/workshop/painpoint_beginner_worksheet.md
            </code>{" "}
            卡片 1
          </p>
        </div>
      )}
    </div>
  );
}
