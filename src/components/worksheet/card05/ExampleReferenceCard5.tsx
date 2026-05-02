/**
 * 卡 5 範例（折疊）— 林老師
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
          <BookOpen className="h-4 w-4 text-secondary" aria-hidden />
          📖 看 worksheet 林老師範例
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-text-secondary transition-transform",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>
      {open && (
        <div className="border-t border-border px-4 sm:px-6 py-5 space-y-3 text-[14px] leading-[1.65] text-text-primary">
          <p>
            <span className="font-semibold">AI 挑的：</span>第 2 種（想客製化但又想規模化）
          </p>
          <div className="border-l-2 border-primary/40 pl-3 space-y-1">
            <p>
              <span className="font-semibold">A 端（個人化）：</span>家長要看見「我的孩子」被個別關照（具體事件、語氣有溫度）
            </p>
            <p>
              <span className="font-semibold">B 端（規模化）：</span>老師一週只有 2-3 小時可寫 30 則（每則 &lt; 6 分鐘）
            </p>
            <p>
              <span className="font-semibold">通常會犧牲：</span>A 端（罐頭訊息、家長一看就知道沒在用心）
            </p>
          </div>
          <p className="text-[12px] text-text-muted">來自 worksheet 卡片 5</p>
        </div>
      )}
    </section>
  );
}
