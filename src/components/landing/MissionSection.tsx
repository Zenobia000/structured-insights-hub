/**
 * MissionSection — Variant A Mission Statement per Grok v1.2 §1.3a.
 *
 * Spec rules:
 * - max-width: 32em
 * - paragraph: type.display.md (44px) or display.lg (56px)
 * - Single Learn more → link, mt-32px
 * - Left-aligned (same as Hero)
 * - Container max-width 1280px, padding-y section.lg (128px)
 *
 * Replaces the v2.0 StageRelationshipSection (two-card stage compare).
 * The "stage one vs stage two" info is consolidated into the mission
 * paragraph + a single hairline footnote — no decorative card grid.
 */
import { SectionFade } from "./SectionFade";

export function MissionSection() {
  return (
    <SectionFade
      ariaLabelledBy="mission-title"
      className="relative border-t border-border-hairline bg-canvas-base"
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12 section-lg">
        <p
          id="mission-title"
          className="max-w-[32em] font-display font-semibold leading-[1.15] tracking-[-0.03em] text-text-primary text-[32px] sm:text-[40px] lg:text-[56px]"
        >
          這份只練一件事 —<br />
          聽到一句抱怨，判斷它是不是真的。
        </p>

        <p className="mt-10 max-w-[44em] text-base sm:text-lg leading-[1.7] text-text-secondary">
          我們不教你做產品、收錢、寫程式。這是階段一 ——
          先把痛點寫得清清楚楚，再考慮其他事。階段一沒走通，階段二再快也只是用對的方法做錯的事。
        </p>

        <div className="mt-12 pt-8 border-t border-border-hairline max-w-[44em] grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-12">
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
