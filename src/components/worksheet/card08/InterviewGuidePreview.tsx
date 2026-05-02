/**
 * InterviewGuidePreview — 顯示 Stage 3 訪綱預覽 + 內聯匯出按鈕
 *
 * 純展示層 + 一個立即匯出快捷鍵。result 頁的 ExportActions 也會接到同一個匯出函式。
 */
import { useState } from "react";
import { Check, Copy, Download, FileText } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { exportInterviewGuide } from "@/lib/cardTenExport";
import type { PainCard } from "@/types/painCard";

type Props = {
  content: string;
  card: PainCard;
};

export function InterviewGuidePreview({ content, card }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success("訪綱已複製到剪貼簿");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("複製失敗，請手動選取文字");
    }
  }

  function handleExport() {
    try {
      exportInterviewGuide(card);
      toast.success("已下載訪綱 .md");
    } catch (err) {
      toast.error("匯出失敗，請改用複製");
      console.error(err);
    }
  }

  return (
    <section className="rounded-md border border-status-success/30 bg-status-success-bg/40 p-5">
      <header className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="h-4 w-4 text-status-success shrink-0" aria-hidden />
          <h3 className="text-[14px] font-semibold text-text-primary">你的訪綱（可直接帶走）</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={handleCopy} className="h-8">
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 mr-1" /> 已複製
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 mr-1" /> 複製
              </>
            )}
          </Button>
          <Button
            size="sm"
            onClick={handleExport}
            className="h-8 bg-status-success text-text-inverse hover:bg-status-success/90"
          >
            <Download className="h-3.5 w-3.5 mr-1" /> 下載 .md
          </Button>
        </div>
      </header>
      <pre className="font-mono text-[12.5px] leading-[1.65] text-text-primary whitespace-pre-wrap max-h-[480px] overflow-auto">
        {content}
      </pre>
      <p className="mt-3 text-[12px] leading-[1.55] text-text-tertiary">
        這份訪綱是給你自己面對真人時用的劇本。AI 沒辦法幫你看見受訪者的猶豫 —
        那些只有你親自坐下來才會出現。
      </p>
    </section>
  );
}
