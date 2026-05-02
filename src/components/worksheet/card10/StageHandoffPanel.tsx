/**
 * StageHandoffPanel — 階段一 vs 階段二 (Grok dark)
 *
 * fake_pain 時隱藏階段二區塊（避免誤導）
 */
import { ArrowDown, ArrowRight, CheckCircle2 } from "lucide-react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { usePainCardStore } from "@/store/painCard";

export function StageHandoffPanel() {
  const j = usePainCardStore((s) => s.card.verdict.judgment);
  const showStage2 = j !== "fake_pain";

  return (
    <section className="max-w-4xl mx-auto rounded-lg border border-border-hairline bg-canvas-raised p-7 sm:p-9">
      <Eyebrow variant="numbered" index={2}>
        Stage handoff · where you are
      </Eyebrow>
      <h2 className="mt-3 font-display text-2xl font-semibold tracking-[-0.02em] text-text-primary">
        階段一 vs 階段二：你在哪？
      </h2>

      <div className="mt-6 space-y-3">
        {/* Stage 1 — completed */}
        <div className="rounded-md border border-status-success/30 bg-status-success-bg/30 p-5">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h3 className="font-display text-base font-semibold tracking-[-0.01em] text-text-primary">
              階段一：判斷力訓練（這份）
            </h3>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-status-success/40 bg-status-success-bg px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.06em] text-status-success">
              <CheckCircle2 className="h-3 w-3" />
              你已完成
            </span>
          </div>
          <p className="mt-3 text-[13.5px] text-text-secondary leading-[1.65]">
            9 張卡片，30-90 分鐘。產出：真假判斷的書面交付。 不需要：寫程式、收錢、做產品。
          </p>
        </div>

        {showStage2 && (
          <>
            <div className="flex justify-center text-text-tertiary py-1" aria-hidden>
              <ArrowDown className="h-4 w-4" strokeWidth={1.5} />
            </div>

            <div className="rounded-md border border-border-default bg-canvas-base/50 p-5">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h3 className="font-display text-base font-semibold tracking-[-0.01em] text-text-primary">
                  階段二：商業驗證（後續）
                </h3>
                {j === "true_pain" && (
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-status-warning/40 bg-status-warning-bg px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.06em] text-status-warning">
                    待開始
                  </span>
                )}
                {j === "pending_interview" && (
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-border-default bg-surface-elevated px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.06em] text-text-secondary">
                    先訪談再評估
                  </span>
                )}
              </div>
              <p className="mt-3 text-[13.5px] text-text-secondary leading-[1.65]">
                72 小時 sprint。產出：第一筆真實付款。 讀：first_principles_sprint_manual.md
              </p>
              {j === "true_pain" && (
                <a
                  href="/docs/first-dollar-sprint"
                  rel="noopener"
                  className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-md border border-border-default bg-transparent px-3 text-[12.5px] text-text-primary hover:bg-surface-hover hover:border-border-strong transition-colors"
                >
                  了解階段二（first-dollar sprint）
                  <ArrowRight className="h-3 w-3" />
                </a>
              )}
            </div>
          </>
        )}

        <aside className="text-[13px] text-text-secondary border border-border-hairline bg-canvas-base/40 rounded-md p-4 mt-3 leading-[1.65]">
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-accent-electric mb-1.5">
            Why two stages
          </p>
          為什麼分階段？因為「痛點是不是真的」和「能不能賺錢」是兩個不同問題。 階段一沒過 →
          階段二一定會失敗。
        </aside>
      </div>
    </section>
  );
}
