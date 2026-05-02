/**
 * ExpectationCalibrationSection — 主動劃清界線。
 * 「你不會學到」用 XCircle + Text Secondary 色（**禁止用紅色**）。
 */
import { CheckCircle2, XCircle } from "lucide-react";
import { SectionFade } from "./SectionFade";

const WILL_LEARN = [
  "聽到一句抱怨，怎麼判斷它是不是真的",
  "把一團模糊抱怨拆成一句話：「我每次要 X，都會卡在 Y」",
  "用 AI 找公開證據，但不被 AI 牽著走",
  "規劃一場真人訪談 — 問對問題、不誘導對方",
  "親手寫完一張屬於你自己的痛點身份證",
];

const WILL_NOT_LEARN = [
  "做產品、寫程式、架網站",
  "收錢、定價、商業模式",
  "AI 模型訓練、prompt engineering 的細節",
  "完整的創新理論或 TRIZ 體系（我們只用其中 6 種矛盾）",
  "怎麼把這個痛點變成第一筆收入（那是階段二的事）",
];

export function ExpectationCalibrationSection() {
  return (
    <SectionFade ariaLabelledBy="expectation-title" className="bg-muted-bg border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2
            id="expectation-title"
            className="text-2xl sm:text-[28px] font-bold leading-[1.3] text-text-primary"
          >
            開始之前，我們先把話說清楚
          </h2>
          <p className="mt-3 text-[15px] leading-[1.6] text-text-secondary">
            你會學到什麼、不會學到什麼 — 這份只練一件事。
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {/* Will learn */}
          <div className="rounded-xl border border-verified/30 bg-surface p-6 sm:p-7">
            <h3 className="text-[18px] font-semibold text-text-primary mb-5">這份你會學到</h3>
            <ul className="space-y-3.5">
              {WILL_LEARN.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-verified shrink-0 mt-0.5" aria-hidden />
                  <span className="text-[15px] leading-[1.6] text-text-primary">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Will NOT learn — 灰色（不是紅色） */}
          <div className="rounded-xl border border-border bg-surface p-6 sm:p-7">
            <h3 className="text-[18px] font-semibold text-text-primary mb-5">這份不會教的事</h3>
            <ul className="space-y-3.5">
              {WILL_NOT_LEARN.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-text-secondary shrink-0 mt-0.5" aria-hidden />
                  <span className="text-[15px] leading-[1.6] text-text-secondary">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-8 text-[13px] leading-[1.5] text-text-muted text-center max-w-xl mx-auto">
          這份只練一件事：聽到一句抱怨，判斷它是不是真的。其他的，我們留給之後。
        </p>
      </div>
    </SectionFade>
  );
}
