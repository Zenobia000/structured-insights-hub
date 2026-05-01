import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { usePainCardStore } from "@/store/painCard";
import { STEP_TITLES, type CurrentStep } from "@/types/painCard";

export const Route = createFileRoute("/learn/worksheet/")({
  head: () => ({
    meta: [
      { title: "痛點填空簿 · 入口 — PainMap" },
      {
        name: "description",
        content: "9 張卡片帶你結構化一個真實痛點。完全免費、資料只存在你的瀏覽器。",
      },
    ],
  }),
  component: WorksheetIndexPage,
});

const CARD_DESCRIPTIONS: Record<CurrentStep, string> = {
  1: "寫下你聽到的那句抱怨原話。誰說的、什麼時候、在做什麼。",
  2: "列出 3 個有名字的真人，他們可能也遇到這個問題。",
  3: "用「我每次要 X，都會卡在 Y」的格式把問題定型，AI 幫你校對。",
  4: "他現在怎麼解？為什麼還是覺得卡？",
  5: "TRIZ 矛盾：他想要的兩件事，為什麼不能同時要到？",
  6: "拿 prompt 去問 AI 找證據，把回覆貼回來。",
  7: "讀 AI 之前先猜一輪，讀完比對自己的盲點。",
  8: "規劃要訪談誰、問哪 3 題。",
  9: "你自己判斷：這是真痛點、假痛點、還是要先訪談再說？",
  10: "整合前 9 張，匯出你的痛點身份證。",
};

function WorksheetIndexPage() {
  const card = usePainCardStore((s) => s.card);
  const createCard = usePainCardStore((s) => s.createCard);
  const reset = usePainCardStore((s) => s.reset);

  const hasStarted = !!card.complaint.verbatim || card.current_step > 1;
  const cardNum = String(card.current_step).padStart(2, "0");
  const continuePath =
    card.current_step === 10
      ? "/learn/worksheet/result"
      : (`/learn/worksheet/${cardNum}` as const);

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-text-primary">痛點填空簿</h1>
        <p className="text-text-secondary leading-relaxed">
          9 張卡片，幫你把一個模糊的抱怨整理成結構化的「痛點身份證」。
          填完之後你會清楚知道：誰會遇到、為什麼會卡、現在怎麼解、值不值得花時間解。
        </p>
        <p className="text-sm text-text-muted">
          全部資料只存在你的瀏覽器，沒有雲端、沒有帳號、沒有追蹤。
        </p>
      </header>

      <section className="mt-8">
        {hasStarted ? (
          <div className="rounded-lg border border-secondary/30 bg-secondary/5 p-5 space-y-3">
            <p className="text-sm text-text-secondary">
              你正在進行中，目前在
              <span className="font-semibold text-text-primary mx-1">
                卡 {card.current_step} · {STEP_TITLES[card.current_step]}
              </span>
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Link
                to={continuePath}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-accent text-accent-foreground px-5 py-2.5 font-semibold hover:bg-accent/90 transition-colors"
              >
                繼續填寫 <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={() => {
                  if (confirm("確定要清空目前的痛點重新開始嗎？")) reset();
                }}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-surface px-5 py-2.5 text-text-secondary hover:text-text-primary transition-colors"
              >
                清空重新開始
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              createCard();
              window.location.href = "/learn/worksheet/01";
            }}
            className="inline-flex items-center gap-2 rounded-md bg-accent text-accent-foreground px-6 py-3 font-semibold hover:bg-accent/90 transition-colors"
          >
            從卡 1 開始 <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-base font-semibold text-text-primary mb-4">
          9 張卡片預覽
        </h2>
        <ol className="space-y-2">
          {(Object.keys(STEP_TITLES) as Array<`${CurrentStep}`>)
            .map(Number)
            .filter((n) => n <= 9)
            .map((n) => {
              const step = n as CurrentStep;
              return (
                <li
                  key={step}
                  className="flex items-start gap-4 rounded-md border border-border bg-surface px-4 py-3"
                >
                  <span className="text-sm font-mono text-text-muted shrink-0 w-8">
                    卡 {step}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-text-primary">
                      {STEP_TITLES[step]}
                    </div>
                    <div className="text-sm text-text-secondary mt-0.5">
                      {CARD_DESCRIPTIONS[step]}
                    </div>
                  </div>
                </li>
              );
            })}
          <li className="flex items-start gap-4 rounded-md border-2 border-verified/30 bg-verified/5 px-4 py-3">
            <span className="text-lg shrink-0 w-8" aria-hidden>
              🪪
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-text-primary">痛點身份證</div>
              <div className="text-sm text-text-secondary mt-0.5">
                {CARD_DESCRIPTIONS[10]}
              </div>
            </div>
          </li>
        </ol>
      </section>
    </main>
  );
}
