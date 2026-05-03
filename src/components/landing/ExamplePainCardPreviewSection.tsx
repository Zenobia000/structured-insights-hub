/**
 * ExamplePainCardPreviewSection — 林老師範例 (Grok Bento large card)。
 *
 * 規格鐵律：
 * - VerifiedTag 顯示「真痛點」綠色，**禁止顯示 0-25 分數**（R4.1 / R4.2）
 * - 點擊預覽卡 → 開 modal 顯示完整 9 卡內容
 *
 * 互動升級：
 * - Modal 內左側 9 卡可點選切換，右側顯示卡內容 + schema 欄位 + 在
 *   「可驗證痛點格式」中扮演的角色，讓使用者一眼看到欄位如何對應。
 * - 支援 URL hash `#example-paincard-open` 自動打開 modal（給 Hero 次要 CTA 用）。
 */
import { useEffect, useState } from "react";
import { CheckCircle2, ExternalLink, ChevronRight } from "lucide-react";
import { SectionFade } from "./SectionFade";
import { Eyebrow } from "@/components/ui/eyebrow";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const SUMMARY_ROWS: Array<[string, string]> = [
  ["主人翁", "林老師（30-50 歲補習班數學老師）"],
  ["場景", "每週六晚上寫 30 則家長 LINE，常寫到半夜兩點"],
  ["現在怎麼解", "LINE + Excel 成績表 + 翻群組對話（手動拼湊）"],
  ["兩件事不能同時要", "想客製化但又想規模化"],
  ["AI 找到的證據", "Dcard 補教版 + 5 種具體職業人群"],
  ["下一步", "訪談 2 位安親班輔導老師"],
];

type CardDetail = {
  step: number;
  title: string;
  field: string; // schema 欄位名稱
  role: string; // 在可驗證痛點格式中扮演的角色
  body: string;
};

const FULL_CARDS: CardDetail[] = [
  {
    step: 1,
    title: "抱怨原句",
    field: "complaint.raw_quote",
    role: "鎖定原始訊號 — 不是你的詮釋，是當事人說過的話",
    body: "「我每週六晚上要寫 30 則家長 LINE，常寫到半夜兩點，但家長還是覺得我沒講到他孩子的重點。」— 林老師，2026/03/15 補習班下班路上。",
  },
  {
    step: 2,
    title: "3 個有名字的真人",
    field: "people[]",
    role: "把抱怨綁在可聯絡的真人，避免變成空泛假設",
    body: "林老師（補習班）、王主任（安親班）、陳老師（家教平台）— 都有 LINE 與電話。",
  },
  {
    step: 3,
    title: "卡關公式",
    field: "stuck_formula",
    role: "把模糊抱怨壓縮成「每次要 X，都會卡在 Y」的可驗證句型",
    body: "我每次要『寫家長週報』，都會卡在『要兼顧個人化又要快』。",
  },
  {
    step: 4,
    title: "現有解法 + 為什麼還卡",
    field: "workarounds[]",
    role: "證據：他們已經在花力氣 — 代表痛是真的、且現有方案不夠",
    body: "LINE + Excel + 翻聊天記錄。卡在：每個家長要的重點不同，套版會被嫌『沒看我孩子』，全手寫又寫不完。",
  },
  {
    step: 5,
    title: "TRIZ 矛盾選擇",
    field: "contradiction",
    role: "找出真正不能同時要的兩件事 — 這是痛的核心",
    body: "客製化 vs 規模化。為了客製化，犧牲了睡眠與週末。",
  },
  {
    step: 6,
    title: "AI 證據蒐集",
    field: "ai_evidence",
    role: "從公開資料證明這不是只有一個人的問題",
    body: "Perplexity 撈到 Dcard 補教版 12 篇相關貼文、5 種具體職業（補習班、安親班、家教、線上課老師、學科顧問）都有類似抱怨。",
  },
  {
    step: 7,
    title: "自己先猜 vs AI 對照",
    field: "self_guess_vs_ai",
    role: "暴露你的盲點 — 訓練判斷力，不是接受 AI 的答案",
    body: "猜：最痛是補習班老師。AI 補：安親班輔導老師更頻繁（每天而非每週）。盲點：低估了頻率維度。",
  },
  {
    step: 8,
    title: "訪談計畫",
    field: "interview_plan",
    role: "把書面假設變成 72 小時內可執行的真人對話",
    body: "訪 2 位安親班老師。題目：1) 上週六最後一則訊息幾點？2) 為什麼不用現成模板？3) 願意花多少錢解決？",
  },
  {
    step: 9,
    title: "我的判斷",
    field: "verdict",
    role: "書面交付：真痛點 / 假痛點 / 待訪談 + 下一步",
    body: "✅ 真痛點。理由：5 種職業有重疊抱怨、有現成 workaround 但仍不滿意、頻率高（每週至少 1 次）。下一步：72 小時內完成 2 場訪談。",
  },
];

const OPEN_HASH = "#example-paincard-open";

export function ExamplePainCardPreviewSection() {
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  // 支援從 Hero CTA 透過 hash 直接打開 modal
  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkHash = () => {
      if (window.location.hash === OPEN_HASH) {
        setOpen(true);
        // 清掉 hash 避免重複觸發
        history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    };
    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, []);

  const active = FULL_CARDS.find((c) => c.step === activeStep) ?? FULL_CARDS[0];

  return (
    <SectionFade
      id="example-paincard"
      ariaLabelledBy="example-title"
      className="relative border-t border-border-hairline bg-canvas-base scroll-mt-20"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 py-20 md:py-32">
        <div className="max-w-2xl mb-16">
          <Eyebrow variant="numbered" index={3}>
            Example output
          </Eyebrow>
          <h2
            id="example-title"
            className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.05] tracking-[-0.03em] text-text-primary"
          >
            30-90 分鐘後，
            <br />
            你會產出像這樣的痛點身份證。
          </h2>
          <p className="mt-5 text-base sm:text-lg leading-[1.6] text-text-secondary">
            範例：林老師（補習班家長 LINE 案例）— 點開可看到每張卡如何對應到可驗證的痛點欄位。
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8 items-start">
          {/* PainCard preview — Bento large (col 1-3) */}
          <div className="lg:col-span-3">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="group relative w-full text-left rounded-lg border border-border-hairline bg-canvas-raised p-8 md:p-10 transition-all duration-300 hover:border-border-default hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-base"
                >
                  <div className="relative flex items-center justify-between mb-7">
                    <Eyebrow variant="numbered" index={9}>
                      Pain ID · LIN-2026-03-15
                    </Eyebrow>
                    {/* VerifiedTag — 不顯示分數 */}
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-status-success/40 px-2.5 py-1 text-[11px] font-mono uppercase tracking-[0.06em] text-status-success">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified Pain
                    </span>
                  </div>

                  <h3 className="relative font-display text-2xl font-semibold tracking-[-0.02em] text-text-primary mb-7">
                    林老師 · 家長 LINE 寫到半夜
                  </h3>

                  <dl className="relative space-y-3.5">
                    {SUMMARY_ROWS.map(([k, v]) => (
                      <div
                        key={k}
                        className="grid grid-cols-[7rem_1fr] gap-4 text-[14px] border-b border-border-subtle pb-3.5 last:border-0 last:pb-0"
                      >
                        <dt className="font-mono text-[11px] uppercase tracking-[0.06em] text-text-tertiary pt-0.5">
                          {k}
                        </dt>
                        <dd className="text-text-primary leading-[1.6]">{v}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="relative mt-8 pt-6 border-t border-border-subtle flex items-center justify-between">
                    <span className="text-[12px] text-text-tertiary">
                      點擊查看完整 9 張卡與欄位對應
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-text-primary group-hover:text-text-primary">
                      Open
                      <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </button>
              </DialogTrigger>

              <DialogContent className="max-w-4xl max-h-[88vh] overflow-hidden bg-canvas-overlay border-border-default p-0 flex flex-col">
                <DialogHeader className="px-6 pt-6 pb-4 border-b border-border-hairline">
                  <DialogTitle className="font-display text-xl tracking-[-0.01em]">
                    林老師案例 · 9 卡 ↔ 可驗證痛點格式
                  </DialogTitle>
                  <DialogDescription className="text-text-secondary">
                    左側點選任一張卡，右側顯示填寫內容 + 對應的 schema 欄位 + 它在格式中扮演的角色。
                  </DialogDescription>
                </DialogHeader>

                <div className="grid md:grid-cols-[14rem_1fr] gap-0 flex-1 overflow-hidden">
                  {/* 左側：9 卡 list */}
                  <nav
                    aria-label="9 張卡"
                    className="border-r border-border-hairline overflow-y-auto bg-canvas-base/40 p-3 md:p-4 max-h-[40vh] md:max-h-none"
                  >
                    <ol className="space-y-1">
                      {FULL_CARDS.map((c) => {
                        const isActive = c.step === activeStep;
                        return (
                          <li key={c.step}>
                            <button
                              type="button"
                              onClick={() => setActiveStep(c.step)}
                              aria-current={isActive ? "step" : undefined}
                              className={cn(
                                "w-full text-left rounded-md px-3 py-2.5 text-[13px] transition-colors flex items-center gap-2.5 group",
                                isActive
                                  ? "bg-canvas-raised border border-text-primary/40 text-text-primary"
                                  : "border border-transparent text-text-secondary hover:bg-surface-hover hover:text-text-primary",
                              )}
                            >
                              <span
                                className={cn(
                                  "font-mono text-[10px] uppercase tracking-[0.08em] shrink-0",
                                  isActive ? "text-text-primary" : "text-text-tertiary",
                                )}
                              >
                                {String(c.step).padStart(2, "0")}
                              </span>
                              <span className="flex-1 truncate font-medium">{c.title}</span>
                              {isActive && (
                                <ChevronRight className="h-3.5 w-3.5 text-text-primary shrink-0" />
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ol>
                  </nav>

                  {/* 右側：active card detail */}
                  <div className="overflow-y-auto p-6 md:p-8">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-tertiary">
                        Card {String(active.step).padStart(2, "0")} / 09
                      </span>
                      <span className="h-1 w-1 rounded-full bg-border-default" />
                      <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-primary">
                        {active.field}
                      </span>
                    </div>

                    <h3 className="font-display text-2xl font-semibold tracking-[-0.02em] text-text-primary mb-2">
                      {active.title}
                    </h3>
                    <p className="text-[13px] leading-[1.6] text-text-tertiary mb-6 italic">
                      {active.role}
                    </p>

                    <div className="rounded-md border border-border-hairline bg-canvas-raised p-5">
                      <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-tertiary mb-2">
                        Filled content
                      </div>
                      <p className="text-[15px] leading-[1.7] text-text-primary whitespace-pre-line">
                        {active.body}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between text-[12px] text-text-tertiary">
                      <button
                        type="button"
                        onClick={() => setActiveStep((s) => Math.max(1, s - 1))}
                        disabled={activeStep === 1}
                        className="rounded-md px-3 py-1.5 border border-border-hairline hover:bg-surface-hover disabled:opacity-40 disabled:hover:bg-transparent"
                      >
                        ← 上一張
                      </button>
                      <span>
                        {activeStep} / {FULL_CARDS.length}
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveStep((s) => Math.min(FULL_CARDS.length, s + 1))}
                        disabled={activeStep === FULL_CARDS.length}
                        className="rounded-md px-3 py-1.5 border border-border-hairline hover:bg-surface-hover disabled:opacity-40 disabled:hover:bg-transparent"
                      >
                        下一張 →
                      </button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Case explainer (col 4-5) */}
          <div className="lg:col-span-2 space-y-6 lg:pt-4">
            <Explainer
              eyebrow="01 / origin"
              title="怎麼開始"
              body="林老師的朋友只是隨口抱怨「最近寫家長 LINE 寫到崩潰」。我把那句話原封不動寫進卡 1。"
            />
            <Explainer
              eyebrow="02 / process"
              title="90 分鐘做了什麼"
              body="卡 1-2 找出 3 個真人。卡 3-7 用 AI 撈 Dcard 補教版證據、發現安親班老師頻率更高。卡 8-9 排好訪談題目。"
            />
            <Explainer
              eyebrow="03 / outcome"
              title="然後呢"
              body="這張卡不會告訴你「該做什麼產品」。它只告訴你：這個痛是真的，下一步是去訪 2 位安親班老師。"
            />
          </div>
        </div>
      </div>
    </SectionFade>
  );
}

function Explainer({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div className="border-l-2 border-border-hairline pl-5 hover:border-text-primary transition-colors duration-300">
      <Eyebrow className="mb-2">{eyebrow}</Eyebrow>
      <h3 className="text-base font-semibold text-text-primary mb-1.5">{title}</h3>
      <p className="text-[14px] leading-[1.7] text-text-secondary">{body}</p>
    </div>
  );
}
