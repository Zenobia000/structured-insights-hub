/**
 * MissionSection — Editorial manifesto with right-side illustration.
 *
 * Editorial principles:
 * - Section bg uses canvas-sunken (alternating rhythm vs Hero's canvas-base)
 * - lg+: title/body/footnotes occupy left 7 cols; illustration anchors right 5 cols
 *   (mirror inverse of Hero's 7/5, creating visual zig-zag down the page)
 * - Mobile: illustration drops below copy, full-bleed
 * - Title ranges from 32px (mobile) to 64px (xl) — slightly bumped from prior 56px
 *   to register as a "section anchor" against the surrounding canvas
 */
import { Illustration } from "@/components/Illustration";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionFade } from "./SectionFade";

export function MissionSection() {
  return (
    <SectionFade
      ariaLabelledBy="mission-title"
      className="relative border-t border-border-hairline bg-canvas-sunken"
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12 section-lg">
        <div className="grid grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Copy block: left 7 cols on lg+ */}
          <div className="col-span-12 lg:col-span-7">
            <Eyebrow variant="numbered" index={2} className="mb-6">
              Mission
            </Eyebrow>
            <p
              id="mission-title"
              className="font-display font-semibold leading-[1.1] tracking-[-0.03em] text-text-primary text-[clamp(32px,5vw,64px)]"
            >
              這份只練一件事 —<br />
              聽到一句抱怨，<br className="hidden sm:inline" />
              判斷它是不是真的。
            </p>

            <p className="mt-10 max-w-[36em] text-base sm:text-lg leading-[1.7] text-text-secondary">
              我們不教你做產品、收錢、寫程式。這是階段一 ——
              先把痛點寫得清清楚楚，再考慮其他事。階段一沒走通，階段二再快也只是用對的方法做錯的事。
            </p>

            <div className="mt-12 pt-8 border-t border-border-hairline grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-12 max-w-[44em]">
              <Footnote
                label="階段一 · 你現在在這"
                product="PainMap Worksheet"
                output="一張你親手寫完的痛點身份證"
                time="30 ~ 90 分鐘"
                active
              />
              <Footnote
                label="階段二 · 之後再說"
                product="PainMap App"
                output="第一筆真的有人付的錢"
                time="72 小時 sprint"
              />
            </div>
          </div>

          {/* Illustration anchor: right 5 cols on lg+; below copy on mobile */}
          <div className="col-span-12 lg:col-span-5 lg:sticky lg:top-24">
            <Illustration
              name="e18-stage-two-horizon"
              alt="一條線通向遠方地平線 — 階段二是後話"
              aspect="4/3"
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="border-0 bg-transparent"
            />
          </div>
        </div>
      </div>
    </SectionFade>
  );
}

function Footnote({
  label,
  product,
  output,
  time,
  active = false,
}: {
  label: string;
  product: string;
  output: string;
  time: string;
  active?: boolean;
}) {
  return (
    <div className={active ? "" : "opacity-60"}>
      <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-tertiary mb-3">
        {label}
      </p>
      <p className="text-base font-semibold text-text-primary mb-3">{product}</p>
      <dl className="space-y-1.5 text-[13px] leading-[1.6]">
        <div className="grid grid-cols-[5rem_1fr] gap-3">
          <dt className="font-mono text-[10px] uppercase tracking-[0.06em] text-text-tertiary pt-0.5">
            帶走
          </dt>
          <dd className="text-text-secondary">{output}</dd>
        </div>
        <div className="grid grid-cols-[5rem_1fr] gap-3">
          <dt className="font-mono text-[10px] uppercase tracking-[0.06em] text-text-tertiary pt-0.5">
            時間
          </dt>
          <dd className="text-text-secondary">{time}</dd>
        </div>
      </dl>
    </div>
  );
}
