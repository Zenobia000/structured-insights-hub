/**
 * ExamplePainCardPreviewSection — 林老師範例。
 *
 * 規格鐵律：
 * - VerifiedTag 顯示「真痛點」綠色，**禁止顯示 0-25 分數**（R4.1 / R4.2）
 * - 點擊預覽卡 → 開 modal 顯示完整 9 卡內容
 */
import { useState } from "react";
import { CheckCircle2, ExternalLink } from "lucide-react";
import { SectionFade } from "./SectionFade";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const SUMMARY_ROWS: Array<[string, string]> = [
  ["主人翁", "林老師（30-50 歲補習班數學老師）"],
  ["場景", "每週六晚上寫 30 則家長 LINE，常寫到半夜兩點"],
  ["現在怎麼解", "LINE + Excel 成績表 + 翻群組對話（手動拼湊）"],
  ["兩件事不能同時要", "想客製化但又想規模化"],
  ["AI 找到的證據", "Dcard 補教版 + 5 種具體職業人群"],
  ["下一步", "訪談 2 位安親班輔導老師"],
];

const FULL_CARDS: Array<{ step: number; title: string; body: string }> = [
  {
    step: 1,
    title: "抱怨原句",
    body: "「我每週六晚上要寫 30 則家長 LINE，常寫到半夜兩點，但家長還是覺得我沒講到他孩子的重點。」— 林老師，2026/03/15 補習班下班路上。",
  },
  {
    step: 2,
    title: "3 個有名字的真人",
    body: "林老師（補習班）、王主任（安親班）、陳老師（家教平台）— 都有 LINE 與電話。",
  },
  { step: 3, title: "卡關公式", body: "我每次要『寫家長週報』，都會卡在『要兼顧個人化又要快』。" },
  {
    step: 4,
    title: "現在怎麼解 + 為什麼還卡",
    body: "LINE + Excel + 翻聊天記錄。卡在：每個家長要的重點不同，套版會被嫌『沒看我孩子』，全手寫又寫不完。",
  },
  { step: 5, title: "TRIZ 矛盾選擇", body: "客製化 vs 規模化。為了客製化，犧牲了睡眠與週末。" },
  {
    step: 6,
    title: "AI 證據蒐集",
    body: "Perplexity 撈到 Dcard 補教版 12 篇相關貼文、5 種具體職業（補習班、安親班、家教、線上課老師、學科顧問）都有類似抱怨。",
  },
  {
    step: 7,
    title: "自己先猜 vs AI 對照",
    body: "猜：最痛是補習班老師。AI 補：安親班輔導老師更頻繁（每天而非每週）。盲點：低估了頻率維度。",
  },
  {
    step: 8,
    title: "訪談計畫",
    body: "訪 2 位安親班老師。題目：1) 上週六最後一則訊息幾點？2) 為什麼不用現成模板？3) 願意花多少錢解決？",
  },
  {
    step: 9,
    title: "我的判斷",
    body: "✅ 真痛點。理由：5 種職業有重疊抱怨、有現成 workaround 但仍不滿意、頻率高（每週至少 1 次）。下一步：72 小時內完成 2 場訪談。",
  },
];

export function ExamplePainCardPreviewSection() {
  const [open, setOpen] = useState(false);

  return (
    <SectionFade ariaLabelledBy="example-title" className="bg-surface border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-2xl mb-10">
          <h2
            id="example-title"
            className="text-2xl sm:text-[28px] font-bold leading-[1.3] text-text-primary"
          >
            30-90 分鐘後，你會產出像這樣的痛點身份證
          </h2>
          <p className="mt-3 text-[15px] leading-[1.6] text-text-secondary">
            範例：林老師（補習班家長 LINE 案例）
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8 items-start">
          {/* PainCard preview — 60% */}
          <div className="lg:col-span-3">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="group w-full text-left rounded-xl border border-border bg-surface p-6 sm:p-7 shadow-[0_1px_3px_rgba(30,58,95,0.06)] hover:border-secondary hover:shadow-[0_4px_8px_rgba(30,58,95,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <span aria-hidden className="text-xl">
                        🪪
                      </span>
                      <span className="font-semibold text-text-primary">最後組合</span>
                    </div>
                    {/* VerifiedTag — 不顯示分數 */}
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-verified-light text-verified px-2.5 py-1 text-xs font-semibold">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      真痛點
                    </span>
                  </div>

                  <dl className="space-y-3">
                    {SUMMARY_ROWS.map(([k, v]) => (
                      <div key={k} className="grid grid-cols-[7rem_1fr] gap-3 text-sm">
                        <dt className="text-text-muted font-medium shrink-0">{k}</dt>
                        <dd className="text-text-primary leading-[1.55]">{v}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-xs">
                    <span className="text-text-muted">點擊查看完整 9 張卡內容</span>
                    <ExternalLink className="h-3.5 w-3.5 text-secondary group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              </DialogTrigger>

              <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>林老師案例 · 完整 9 卡</DialogTitle>
                  <DialogDescription>
                    這是已完成的 PainCard 範例，每一卡都有具體填寫內容。
                  </DialogDescription>
                </DialogHeader>
                <ol className="mt-4 space-y-4">
                  {FULL_CARDS.map((c) => (
                    <li key={c.step} className="rounded-md border border-border bg-page p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-xs text-text-muted">
                          卡 {String(c.step).padStart(2, "0")}
                        </span>
                        <span className="font-semibold text-sm text-text-primary">{c.title}</span>
                      </div>
                      <p className="text-[14px] leading-[1.65] text-text-secondary">{c.body}</p>
                    </li>
                  ))}
                </ol>
              </DialogContent>
            </Dialog>
          </div>

          {/* Case explainer — 40% */}
          <div className="lg:col-span-2 space-y-5">
            <Explainer
              title="怎麼開始"
              body="林老師的朋友只是隨口抱怨「最近寫家長 LINE 寫到崩潰」。我把那句話原封不動寫進卡 1。"
            />
            <Explainer
              title="90 分鐘做了什麼"
              body="卡 1-2 找出 3 個真人。卡 3-7 用 AI 撈 Dcard 補教版證據、發現安親班老師頻率更高。卡 8-9 排好訪談題目。"
            />
            <Explainer
              title="然後呢"
              body="這張卡不會告訴你「該做什麼產品」。它只告訴你：這個痛是真的，下一步是去訪 2 位安親班老師。"
            />
          </div>
        </div>
      </div>
    </SectionFade>
  );
}

function Explainer({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="text-[15px] font-semibold text-text-primary mb-1.5">{title}</h3>
      <p className="text-[14px] leading-[1.65] text-text-secondary">{body}</p>
    </div>
  );
}
