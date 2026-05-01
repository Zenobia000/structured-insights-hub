/**
 * StageRelationshipSection — Worksheet（階段一）vs PainMap App（階段二）。
 * 「階段一沒過，階段二一定會失敗」是誠實態度，不是嚇人。
 */
import { ArrowRight } from "lucide-react";
import { SectionFade } from "./SectionFade";

const STAGE_1 = {
  badge: "階段一：判斷力訓練（你現在在這）",
  product: "PainMap Worksheet（本系統）",
  output: "一張書面判斷的痛點身份證",
  time: "30-90 分鐘",
  skills: [
    "聽抱怨找真人寫卡關公式",
    "用 AI 找證據自己先猜對照 AI",
    "規劃訪談書面真假判斷",
  ],
  active: true,
};

const STAGE_2 = {
  badge: "階段二：商業驗證",
  product: "PainMap App（進階版）",
  output: "第一筆真實付款",
  time: "72 小時 sprint",
  skills: [
    "Pain Collector / Essence Decomposer / Disruption Mapper",
    "手作交付預售收第一塊錢",
    "GTM 策略",
  ],
  active: false,
};

export function StageRelationshipSection() {
  return (
    <SectionFade
      ariaLabelledBy="stage-title"
      className="bg-surface border-b border-border"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-3xl mb-10">
          <h2
            id="stage-title"
            className="text-2xl sm:text-[28px] font-bold leading-[1.3] text-text-primary"
          >
            這份是「階段一」— 跟進階版 PainMap App 是什麼關係？
          </h2>
        </div>

        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-3 items-stretch">
          <StageBlock {...STAGE_1} />

          {/* Arrow connector */}
          <div className="flex md:flex-col items-center justify-center px-4 py-2 md:py-0">
            <div className="hidden md:flex flex-col items-center gap-2 text-text-muted">
              <ArrowRight className="h-6 w-6" />
              <span className="text-[11px] font-medium text-center leading-tight max-w-[8rem]">
                通過階段一<br />才進階段二
              </span>
            </div>
            <div className="md:hidden flex items-center gap-2 text-text-muted">
              <ArrowRight className="h-5 w-5 rotate-90" />
              <span className="text-xs font-medium">通過階段一才進階段二</span>
            </div>
          </div>

          <StageBlock {...STAGE_2} />
        </div>

        <p className="mt-8 text-[13px] leading-[1.55] text-text-muted max-w-3xl">
          為什麼分階段？因為「痛點是不是真的」和「能不能賺錢」是兩個不同問題。階段一沒過，階段二一定會失敗（用對的方法做錯的事）。
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
        active
          ? "border-secondary bg-primary-light/40"
          : "border-border bg-page"
      }`}
    >
      <div
        className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold mb-4 ${
          active
            ? "bg-secondary text-secondary-foreground"
            : "bg-muted-bg text-text-secondary"
        }`}
      >
        {badge}
      </div>

      <dl className="space-y-3 mb-4">
        <Row label="產品" value={product} />
        <Row label="產出" value={output} />
        <Row label="時間" value={time} />
      </dl>

      <div>
        <p className="text-[11px] font-semibold text-text-muted tracking-wider uppercase mb-2">
          訓練技能
        </p>
        <ul className="space-y-1.5">
          {skills.map((s) => (
            <li
              key={s}
              className="text-[13px] leading-[1.55] text-text-primary flex gap-2"
            >
              <span aria-hidden className="text-text-muted shrink-0">·</span>
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
