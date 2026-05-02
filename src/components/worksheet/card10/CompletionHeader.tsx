/**
 * CompletionHeader — 卡 10 沉穩標頭 (Grok dark hero variant)
 */
import { usePainCardStore } from "@/store/painCard";
import { JUDGMENT_LABEL } from "@/lib/cardTenExport";
import { Eyebrow } from "@/components/ui/eyebrow";
import { CheckCircle2, Clock, Archive } from "lucide-react";

export function CompletionHeader() {
  const card = usePainCardStore((s) => s.card);
  const j = card.verdict.judgment;

  const statusBadge = (() => {
    if (card.status === "structured" || j === "true_pain") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-md border border-status-success/40 bg-status-success-bg px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.06em] text-status-success">
          <CheckCircle2 className="h-3 w-3" />
          Verified pain
        </span>
      );
    }
    if (j === "pending_interview") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-md border border-status-warning/40 bg-status-warning-bg px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.06em] text-status-warning">
          <Clock className="h-3 w-3" />
          Pending interview
        </span>
      );
    }
    if (j === "fake_pain" || card.status === "archived_fake") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-md border border-border-default bg-surface-elevated px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.06em] text-text-secondary">
          <Archive className="h-3 w-3" />
          Archived (fake)
        </span>
      );
    }
    return null;
  })();

  return (
    <header className="relative isolate overflow-hidden rounded-lg border border-border-hairline bg-canvas-raised">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse 600px 300px at 50% 0%, var(--accent-glow-mid), transparent 70%)",
        }}
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-dot-dim opacity-40" />

      <div className="px-7 sm:px-12 py-10 sm:py-14 max-w-4xl mx-auto">
        <Eyebrow variant="dotted">You finished · Pain ID is ready</Eyebrow>

        <h1 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.05] tracking-[-0.03em] text-text-primary">
          你寫完了 —<br />
          <span className="bg-gradient-to-r from-text-primary via-accent-electric to-text-primary bg-clip-text text-transparent">
            這是你的痛點身份證。
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-lg leading-[1.65] text-text-secondary max-w-2xl">
          9 張卡走過的痕跡，全部收在這一頁。看一遍，挑一個格式匯出帶走，再去做你想做的下一步。
        </p>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-8 pt-6 border-t border-border-subtle">
          <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-text-tertiary">
            <span className="text-text-secondary">Started</span>{" "}
            <span className="text-text-primary tabular-nums">
              {card.created_at.slice(0, 10)}
            </span>
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-text-tertiary">
            <span className="text-text-secondary">Last edit</span>{" "}
            <span className="text-text-primary tabular-nums">
              {card.updated_at.slice(0, 16).replace("T", " ")}
            </span>
          </span>
          {statusBadge}
        </div>

        <p className="mt-5 text-[13px] italic text-text-tertiary">
          這份身份證裡沒有「錢」也沒有「分數」 — 階段一只練一件事：判斷力。
        </p>
        {j && <p className="sr-only">當前判斷：{JUDGMENT_LABEL[j]}</p>}
      </div>
    </header>
  );
}
