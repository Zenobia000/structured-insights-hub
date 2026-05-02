/**
 * 卡 5 範例（折疊）— 林老師
 *
 * 蘇格拉底版：示範如何用主人翁自己的話寫 A / B / 犧牲哪邊 / 為什麼。
 * 不貼分類學標籤、不援引 TRIZ。
 */
import { useState } from "react";
import { ChevronDown, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export function ExampleReferenceCard5() {
  const [open, setOpen] = useState(false);
  return (
    <section className="rounded-lg border border-border bg-surface">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <span className="inline-flex items-center gap-2 text-[14px] font-semibold text-text-primary">
          <BookOpen className="h-4 w-4 text-secondary" aria-hidden />看 worksheet 林老師範例
        </span>
        <ChevronDown
          className={cn("h-4 w-4 text-text-secondary transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>
      {open && (
        <div className="border-t border-border px-4 sm:px-6 py-5 space-y-3 text-[14px] leading-[1.65] text-text-primary">
          <div className="border-l-2 border-primary/40 pl-3 space-y-1.5">
            <p>
              <span className="font-semibold">他想要 A：</span>
              家長要看見「我的孩子」被個別關照（具體事件、語氣有溫度）
            </p>
            <p>
              <span className="font-semibold">他同時又想要 B：</span>
              老師一週只有 2-3 小時可寫 30 則（每則 &lt; 6 分鐘）
            </p>
            <p>
              <span className="font-semibold">通常會犧牲：</span>A 端
            </p>
            <p>
              <span className="font-semibold">為什麼會被犧牲：</span>
              時間到了就用罐頭訊息頂著，家長一看就知道沒在用心，但老師也沒辦法。
            </p>
          </div>
          <p className="text-[12px] text-text-muted">來自 worksheet 卡片 5</p>
        </div>
      )}
    </section>
  );
}
