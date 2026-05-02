/**
 * StageHandoffPanel — 階段一 vs 階段二
 *
 * fake_pain 時隱藏階段二區塊（避免誤導）
 */
import { ArrowDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePainCardStore } from "@/store/painCard";

export function StageHandoffPanel() {
  const j = usePainCardStore((s) => s.card.verdict.judgment);
  const showStage2 = j !== "fake_pain";

  return (
    <section className="max-w-3xl mx-auto bg-surface rounded-lg border border-border p-6 sm:p-8">
      <h2 className="text-xl font-bold text-text-primary">階段一 vs 階段二：你在哪？</h2>

      <div className="mt-5 space-y-3">
        <div className="rounded-lg border border-verified/30 bg-verified-light/40 p-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h3 className="font-semibold text-text-primary">階段一：判斷力訓練（這份）</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-verified text-verified-foreground font-medium">
              ✓ 你已完成
            </span>
          </div>
          <p className="mt-2 text-sm text-text-secondary leading-relaxed">
            9 張卡片，30-90 分鐘。產出：真假判斷的書面交付。
            不需要：寫程式、收錢、做產品。
          </p>
        </div>

        {showStage2 && (
          <>
            <div className="flex justify-center text-text-muted" aria-hidden>
              <ArrowDown className="h-5 w-5" />
            </div>

            <div className="rounded-lg border border-border bg-muted-bg/30 p-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h3 className="font-semibold text-text-primary">階段二：商業驗證（後續）</h3>
                {j === "true_pain" && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-accent-light text-caution font-medium">
                    待開始
                  </span>
                )}
                {j === "pending_interview" && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-text-secondary font-medium">
                    先訪談再評估
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                72 小時 sprint。產出：第一筆真實付款。
                讀：first_principles_sprint_manual.md
              </p>
              {j === "true_pain" && (
                <Button variant="outline" size="sm" className="mt-3" asChild>
                  <a href="/docs/first-dollar-sprint" rel="noopener">
                    了解階段二（first-dollar sprint）→
                  </a>
                </Button>
              )}
            </div>
          </>
        )}

        <aside className="text-sm text-text-secondary bg-muted-bg/40 border border-border rounded-md p-3 mt-2">
          <span aria-hidden>💡 </span>
          為什麼分階段？因為「痛點是不是真的」和「能不能賺錢」是兩個不同問題。
          階段一沒過 → 階段二一定會失敗。
        </aside>
      </div>
    </section>
  );
}
