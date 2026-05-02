/**
 * CompletionHeader — 卡 10 沉穩標頭（不慶祝、不徽章）
 */
import { usePainCardStore } from "@/store/painCard";
import { JUDGMENT_LABEL } from "@/lib/cardTenExport";

export function CompletionHeader() {
  const card = usePainCardStore((s) => s.card);
  const j = card.verdict.judgment;

  const statusBadge = (() => {
    if (card.status === "structured" || j === "true_pain") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-verified-light text-verified">
          ✓ 真痛點
        </span>
      );
    }
    if (j === "pending_interview") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-accent-light text-caution">
          待訪談
        </span>
      );
    }
    if (j === "fake_pain" || card.status === "archived_fake") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-text-secondary">
          假痛點（已封存）
        </span>
      );
    }
    return null;
  })();

  return (
    <header className="bg-surface px-6 sm:px-12 py-10 sm:py-12 max-w-3xl mx-auto rounded-lg border border-border">
      <div className="flex items-start gap-4 mb-4">
        <div className="text-4xl text-secondary" aria-hidden>
          🪪
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold text-text-primary">你寫完了 — 這是你的痛點身份證</h1>
          <p className="mt-2 text-text-secondary text-base sm:text-lg">
            9 張卡走過的痕跡，全部收在這一頁。看一遍，挑一個格式匯出帶走，再去做你想做的下一步。
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-text-muted pt-4 border-t border-border">
        <span>開始於：{card.created_at.slice(0, 10)}</span>
        <span>最後寫於：{card.updated_at.slice(0, 16).replace("T", " ")}</span>
        {statusBadge}
      </div>

      <p className="mt-4 italic text-sm text-text-secondary">
        這份身份證裡沒有「錢」也沒有「分數」 — 階段一只練一件事：判斷力。
      </p>
      {j && <p className="sr-only">當前判斷：{JUDGMENT_LABEL[j]}</p>}
    </header>
  );
}
