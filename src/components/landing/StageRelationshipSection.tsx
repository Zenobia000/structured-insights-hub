/**
 * StageRelationshipSection — Worksheet（階段一）vs PainMap App（階段二）。
 * 「階段一沒過，階段二一定會失敗」是誠實態度，不是嚇人。
 */
import { ArrowRight } from "lucide-react";
import { SectionFade } from "./SectionFade";
import { Eyebrow } from "@/components/ui/eyebrow";

const STAGE_1 = {
  badge: "階段一：先想清楚（你現在在這）",
  product: "PainMap Worksheet",
  output: "一張你親手寫完的痛點身份證",
  time: "30 ~ 90 分鐘",
  skills: [
    "聽見一句抱怨、找出說這句話的真人、寫出卡關公式",
    "用 AI 找證據，但自己先猜一輪再對照",
    "規劃真人訪談，寫下你自己的真假判斷",
  ],
  active: true,
};

const STAGE_2 = {
  badge: "階段二：再想能不能賺到錢",
  product: "PainMap App（進階版）",
  output: "第一筆真的有人付的錢",
  time: "72 小時 sprint",
  skills: [
    "Pain Collector / Essence Decomposer / Disruption Mapper",
    "手作交付、預售、收第一塊錢",
    "GTM 策略",
  ],
  active: false,
};

export function StageRelationshipSection() {
  return (
    <SectionFade
      ariaLabelledBy="stage-title"
      className="relative border-t border-border-hairline bg-canvas-base"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 py-20 md:py-32">
        <div className="max-w-3xl mb-16">
          <Eyebrow variant="numbered" index={4}>
            Two stages · honest scope
          </Eyebrow>
          <h2
            id="stage-title"
            className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.05] tracking-[-0.03em] text-text-primary"
          >
            這份只是階段一 — <br />
            那階段二在做什麼？
          </h2>
        </div>

        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-3 items-stretch">
          <StageBlock {...STAGE_1} />

          {/* Arrow connector */}
          <div className="flex md:flex-col items-center justify-center px-4 py-2 md:py-0">
            <div className="hidden md:flex flex-col items-center gap-3 text-text-tertiary">
              <span className="font-mono text-[10px] uppercase tracking-[0.08em]">
                走完 → 進階段二
              </span>
              <ArrowRight className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <div className="md:hidden flex items-center gap-2 text-text-tertiary">
              <ArrowRight className="h-5 w-5 rotate-90" strokeWidth={1.5} />
              <span className="font-mono text-[11px] uppercase tracking-[0.06em]">
                走完階段一再進階段二
              </span>
            </div>
          </div>

          <StageBlock {...STAGE_2} />
        </div>

        <p className="mt-12 text-[13px] leading-[1.65] text-text-tertiary max-w-3xl">
          為什麼要分階段？因為「這個痛點是不是真的」和「能不能賺到錢」是兩件不一樣的事。階段一沒走通，階段二再快也只是用對的方法做錯的事
          — 我們希望你少走那段冤枉路。
        </p>
      </div>
    </SectionFade>
  );
}

type StageProps = {
  badge: string;
  product: string;
  output: string;
  time: string;
  skills: string[];
  active: boolean;
};

function StageBlock({ badge, product, output, time, skills, active }: StageProps) {
  return (
    <article
      className={
        active
          ? "relative rounded-lg border border-accent-electric/40 bg-canvas-raised p-7 md:p-8 overflow-hidden"
          : "relative rounded-lg border border-border-hairline bg-canvas-raised/40 p-7 md:p-8"
      }
    >
      {active && (
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 400px 200px at 50% 0%, rgba(91,141,239,0.10), transparent 70%)",
          }}
        />
      )}

      <div
        className={
          active
            ? "inline-flex items-center gap-2 rounded-md border border-accent-electric/40 bg-accent-electric-subtle px-2.5 py-1 mb-5"
            : "inline-flex items-center gap-2 rounded-md border border-border-hairline bg-surface-elevated px-2.5 py-1 mb-5"
        }
      >
        <span
          className={
            active
              ? "h-1.5 w-1.5 rounded-full bg-accent-electric shadow-[0_0_8px_rgba(91,141,239,0.6)]"
              : "h-1.5 w-1.5 rounded-full bg-text-tertiary"
          }
        />
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-secondary">
          {badge}
        </span>
      </div>

      <h3 className="text-2xl font-semibold tracking-[-0.02em] text-text-primary mb-5">
        {product}
      </h3>

      <dl className="space-y-3 mb-6 pb-6 border-b border-border-subtle">
        <Row label="你會帶走" value={output} />
        <Row label="時間" value={time} />
      </dl>

      <div>
        <Eyebrow className="mb-3">這階段在練的事</Eyebrow>
        <ul className="space-y-2">
          {skills.map((s) => (
            <li key={s} className="flex gap-2.5 text-[13px] leading-[1.6] text-text-primary">
              <span aria-hidden className="text-accent-electric shrink-0 mt-0.5">
                →
              </span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[5rem_1fr] gap-3">
      <dt className="font-mono text-[10px] uppercase tracking-[0.06em] text-text-tertiary pt-1">
        {label}
      </dt>
      <dd className="text-[14px] text-text-primary leading-[1.6]">{value}</dd>
    </div>
  );
}
