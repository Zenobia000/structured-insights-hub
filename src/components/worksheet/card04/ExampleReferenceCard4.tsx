/**
 * 卡 4 範例參考 — 林老師（折疊）
 */
import { useState } from "react";
import { ChevronDown, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export function ExampleReferenceCard4() {
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
        <div className="border-t border-border px-4 sm:px-6 py-5 space-y-4 text-[14px] leading-[1.65] text-text-primary">
          <Block title="我憑訪談寫的：">
            <p>工具/方法的名字：LINE + Excel 成績表 + 翻群組對話（手動拼湊）</p>
            <p>為什麼還是覺得卡：每個資料源都要重新翻找，沒辦法一次看完</p>
          </Block>
          <Block title="AI 列的 5 個可能：">
            <ol className="list-decimal pl-5 space-y-0.5">
              <li>Notion 模板（標準學生回報模板）</li>
              <li>Google Sheets + 公式（自動拉成績）</li>
              <li>班級管理 App（如：1 對 1 補教系統）</li>
              <li>助教代寫</li>
              <li>ChatGPT 寫稿機（直接餵成績丟出草稿）</li>
            </ol>
          </Block>
          <Block title="拿去問林老師：">
            <ul className="list-disc pl-5 space-y-0.5">
              <li>「Notion 試過 1 個月放棄，太花時間貼來貼去。」</li>
              <li>「ChatGPT 試過寫得太罐頭，家長一看就知道。」</li>
              <li>「助教請不起。」</li>
            </ul>
          </Block>
          <p className="text-[12px] text-text-muted">來自 worksheet 卡片 4</p>
        </div>
      )}
    </section>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-l-2 border-primary/40 pl-3">
      <p className="text-[13px] font-semibold text-text-secondary mb-1">{title}</p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}
