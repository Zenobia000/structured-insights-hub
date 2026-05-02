/**
 * 卡 3 林老師範例（直接引用 worksheet 原文）。
 */
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const QUESTIONS = [
  "「具體」跟「不傷感情」哪個現在最頭痛？",
  "一週實際只有週六寫嗎？平日有沒有零碎寫過？",
  "30 個學生裡有沒有特別難寫的個案？",
];

export function ExampleReferenceCard3() {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-border bg-page">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="example-content-card3"
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
        <div id="example-content-card3" className="px-5 pb-5 space-y-3">
          <div>
            <p className="text-[13px] font-semibold text-text-primary mb-1.5">
              AI 整理後
            </p>
            <blockquote className="border-l-2 border-secondary pl-4 text-[14px] leading-[1.7] text-text-secondary">
              我每次要在週末寫 30 則家長回報訊息，都會卡在「資料散在週間 7 次小考、要寫得具體、不能傷家長感情」這 3 件事同時要顧。
            </blockquote>
          </div>
          <div>
            <p className="text-[13px] font-semibold text-text-primary mb-1.5">
              AI 列的「需要再問清楚」
            </p>
            <ol className="border-l-2 border-secondary pl-4 space-y-1 text-[13.5px] leading-[1.7] text-text-secondary list-decimal list-inside">
              {QUESTIONS.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ol>
          </div>
          <p className="text-[12px] text-text-muted">
            來自{" "}
            <code className="font-mono text-text-secondary">
              docs/workshop/painpoint_beginner_worksheet.md
            </code>{" "}
            卡片 3
          </p>
        </div>
      )}
    </div>
  );
}
