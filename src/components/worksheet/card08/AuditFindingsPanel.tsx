/**
 * AuditFindingsPanel — UX researcher audit 結果（Hairline Ledger 風格）。
 *
 * Pure display layer: render user-pasted AI audit text inside an
 * editorial code-block frame with mono eyebrow header.
 */
import { ClipboardCheck } from "lucide-react";

type Props = {
  content: string;
};

export function AuditFindingsPanel({ content }: Props) {
  return (
    <section className="rounded-md border border-border-hairline overflow-hidden">
      <header className="flex items-center justify-between gap-3 px-5 py-2.5 border-b border-border-hairline bg-canvas-raised">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-text-tertiary inline-flex items-center gap-2">
          <ClipboardCheck className="h-3 w-3 text-text-primary" aria-hidden />
          Audit / Findings
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-tertiary">
          you pasted
        </span>
      </header>
      <pre className="font-mono text-[12.5px] leading-[1.7] text-text-primary whitespace-pre-wrap max-h-96 overflow-auto px-5 py-4 bg-canvas-sunken">
        {content}
      </pre>
      <p className="px-5 py-3 border-t border-border-subtle text-[12px] leading-[1.55] text-text-tertiary">
        把這份 audit 當作「真人訪談前的提醒清單」 — 別跟受訪者唸出來，自己看就好。
      </p>
    </section>
  );
}
