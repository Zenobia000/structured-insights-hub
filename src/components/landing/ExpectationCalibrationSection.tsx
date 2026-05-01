/**
 * ExpectationCalibrationSection — 主動劃清界線。
 * 「你不會學到」用 XCircle + Text Secondary 色（**禁止用紅色**）。
 */
import { CheckCircle2, XCircle } from "lucide-react";
import { SectionFade } from "./SectionFade";

const WILL_LEARN = [
  "從一句抱怨判斷它是不是真痛點",
  "把模糊抱怨拆成「我每次要 X，都會卡在 Y」",
  "用 AI 找公開證據，不被 AI 牽著走",
  "規劃一場有用的真人訪談",
  "書面交付一張完整的「痛點身份證」",
];

const WILL_NOT_LEARN = [
  "做產品、寫程式、架網站",
  "收錢、定價、商業模式",
  "AI 模型訓練、prompt engineering 細節",
  "創新理論、TRIZ 完整體系（只用其中 6 種矛盾）",
  "怎麼把痛點變成第一筆收入（那是階段二的事）",
];

export function ExpectationCalibrationSection() {
  return (
    <SectionFade
      ariaLabelledBy="expectation-title"
      className="bg-muted-bg border-b border-border"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2
            id="expectation-title"
            className="text-2xl sm:text-[28px] font-bold leading-[1.3] text-text-primary"
          >
            你會學到什麼 / 不會學到什麼
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {/* Will learn */}
          <div className="rounded-xl border border-verified/30 bg-surface p-6 sm:p-7">
            <h3 className="text-[18px] font-semibold text-text-primary mb-5">
              你會學到
            </h3>
            <ul className="space-y-3.5">
              {WILL_LEARN.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2
                    className="h-5 w-5 text-verified shrink-0 mt-0.5"
                    aria-hidden
                  />
                  <span className="text-[15px] leading-[1.6] text-text-primary">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Will NOT learn — 灰色（不是紅色） */}
          <div className="rounded-xl border border-border bg-surface p-6 sm:p-7">
            <h3 className="text-[18px] font-semibold text-text-primary mb-5">
              你不會學到
            </h3>
            <ul className="space-y-3.5">
              {WILL_NOT_LEARN.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <XCircle
                    className="h-5 w-5 text-text-secondary shrink-0 mt-0.5"
                    aria-hidden
                  />
                  <span className="text-[15px] leading-[1.6] text-text-secondary">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-8 text-[13px] leading-[1.5] text-text-muted text-center max-w-xl mx-auto">
          這份只訓練：從一句抱怨判斷真痛點還是假痛點。
        </p>
      </div>
    </SectionFade>
  );
}
