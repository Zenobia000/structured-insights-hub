/**
 * StageRelationshipSection — Worksheet（階段一）vs PainMap App（階段二）。
 * 「階段一沒過，階段二一定會失敗」是誠實態度，不是嚇人。
 */
import { ArrowRight } from "lucide-react";
import { SectionFade } from "./SectionFade";

const STAGE_1 = {
  badge: "階段一：先想清楚（你現在在這）",
  product: "PainMap Worksheet（你正在用的這份）",
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
    <SectionFade ariaLabelledBy="stage-title" className="bg-surface border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-3xl mb-10">
          <h2
            id="stage-title"
            className="text-2xl sm:text-[28px] font-bold leading-[1.3] text-text-primary"
          >
            這份只是階段一 — 那階段二在做什麼？
          </h2>
        </div>

        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-3 items-stretch">
          <StageBlock {...STAGE_1} />

          {/* Arrow connector */}
          <div className="flex md:flex-col items-center justify-center px-4 py-2 md:py-0">
            <div className="hidden md:flex flex-col items-center gap-2 text-text-muted">
              <ArrowRight className="h-6 w-6" />
              <span className="text-[11px] font-medium text-center leading-tight max-w-[8rem]">
                走完階段一
                <br />
                再進階段二
              </span>
            </div>
            <div className="md:hidden flex items-center gap-2 text-text-muted">
              <ArrowRight className="h-5 w-5 rotate-90" />
              <span className="text-xs font-medium">走完階段一再進階段二</span>
            </div>
          </div>

          <StageBlock {...STAGE_2} />
        </div>

        <p className="mt-8 text-[13px] leading-[1.55] text-text-muted max-w-3xl">
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
      className={`rounded-xl border p-6 sm:p-7 ${
        active ? "border-secondary bg-primary-light/40" : "border-border bg-page"
      }`}
    >
      <div
        className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold mb-4 ${
          active ? "bg-secondary text-secondary-foreground" : "bg-muted-bg text-text-secondary"
        }`}
      >
        {badge}
      </div>

      <dl className="space-y-3 mb-4">
        <Row label="工具" value={product} />
        <Row label="你會帶走" value={output} />
        <Row label="時間" value={time} />
      </dl>

      <div>
        <p className="text-[11px] font-semibold text-text-muted tracking-wider uppercase mb-2">
          這階段在練的事
        </p>
        <ul className="space-y-1.5">
          {skills.map((s) => (
            <li key={s} className="text-[13px] leading-[1.55] text-text-primary flex gap-2">
              <span aria-hidden className="text-text-muted shrink-0">
                ·
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
    <div className="grid grid-cols-[4rem_1fr] gap-3 text-sm">
      <dt className="text-text-muted font-medium">{label}</dt>
      <dd className="text-text-primary leading-[1.5]">{value}</dd>
    </div>
  );
}
