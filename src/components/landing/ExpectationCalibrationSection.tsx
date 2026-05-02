/**
 * ExpectationCalibrationSection — 主動劃清界線 (Grok Compare pattern)。
 * 「你不會學到」用 XCircle + text-tertiary 色（**禁止用紅色**）。
 */
import { Check, X } from "lucide-react";
import { SectionFade } from "./SectionFade";
import { Eyebrow } from "@/components/ui/eyebrow";

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
    <SectionFade
      ariaLabelledBy="expectation-title"
      className="relative border-t border-border-hairline bg-canvas-sunken"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 py-20 md:py-32">
        <div className="max-w-2xl mb-16">
          <Eyebrow variant="numbered" index={2}>
            Scope · what you get
          </Eyebrow>
          <h2
            id="expectation-title"
            className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.05] tracking-[-0.03em] text-text-primary"
          >
            開始之前，
            <br />
            我們先把話說清楚。
          </h2>
          <p className="mt-5 text-base sm:text-lg leading-[1.6] text-text-secondary">
            你會學到什麼、不會學到什麼 — 這份只練一件事。
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-border-hairline border border-border-hairline rounded-lg overflow-hidden">
          {/* Will learn */}
          <div className="relative bg-canvas-base p-8 md:p-10">
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-status-success to-transparent opacity-40"
            />
            <Eyebrow className="mb-6 text-status-success">
              <Check className="h-3 w-3" /> Inside scope
            </Eyebrow>
            <h3 className="text-xl font-semibold tracking-[-0.01em] text-text-primary mb-8">
              這份你會學到
            </h3>
            <ul className="space-y-4">
              {WILL_LEARN.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-status-success-bg text-status-success">
                    <Check className="h-3 w-3" strokeWidth={2.5} />
                  </span>
                  <span className="text-[15px] leading-[1.65] text-text-primary">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Will NOT learn */}
          <div className="relative bg-canvas-base p-8 md:p-10">
            <Eyebrow className="mb-6">
              <X className="h-3 w-3" /> Out of scope
            </Eyebrow>
            <h3 className="text-xl font-semibold tracking-[-0.01em] text-text-primary mb-8">
              這份不會教的事
            </h3>
            <ul className="space-y-4">
              {WILL_NOT_LEARN.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-elevated text-text-tertiary">
                    <X className="h-3 w-3" strokeWidth={2.5} />
                  </span>
                  <span className="text-[15px] leading-[1.65] text-text-tertiary line-through decoration-border-default decoration-1 underline-offset-2">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-12 text-[13px] leading-[1.6] text-text-tertiary text-center max-w-xl mx-auto">
          這份只練一件事：聽到一句抱怨，判斷它是不是真的。其他的，我們留給之後。
        </p>
      </div>
    </SectionFade>
  );
}
