/**
 * AuditFindingsPanel — 顯示 Stage 2 UX researcher audit 結果的解讀面板
 *
 * 純展示層：把使用者貼回的 AI 文字內容做最簡單的可讀化處理（區塊標題 highlight）。
 * 不做 AI 解析，不做評分 — 只是讓使用者好讀。
 */
import { ClipboardCheck } from "lucide-react";

type Props = {
  content: string;
};

export function AuditFindingsPanel({ content }: Props) {
  return (
    <section className="rounded-md border border-border-hairline bg-canvas-base/60 p-5">
      <header className="flex items-center gap-2 mb-3">
        <ClipboardCheck className="h-4 w-4 text-status-success shrink-0" aria-hidden />
        <h3 className="text-[14px] font-semibold text-text-primary">Audit 結果（你貼回的內容）</h3>
      </header>
      <pre className="font-mono text-[12.5px] leading-[1.65] text-text-primary whitespace-pre-wrap max-h-96 overflow-auto">
        {content}
      </pre>
      <p className="mt-3 text-[12px] leading-[1.55] text-text-tertiary">
        把這份 audit 當作「真人訪談前的提醒清單」 — 別跟受訪者唸出來，自己看就好。
      </p>
    </section>
  );
}
