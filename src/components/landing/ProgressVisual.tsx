/**
 * ProgressVisual — Hero 右側 flow preview (Grok dark theme)。
 *
 * 設計意圖：
 * - 不再是 9 點 stepper（純裝飾、對首次造訪者沒意義）
 * - 用 3 段 micro card 行銷型回答「這 9 張卡到底要我做什麼」
 * - 與下方 ThreeStepTeachingSection 形成「縮影 → 詳述」遞進關係
 * - 標題與卡片範圍直接借用 ThreeStep 的單一真相源
 */
import { Ear, Search, Scale } from "lucide-react";

type FlowStep = {
  index: string;
  cards: string;
  title: string;
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
};

const FLOW_STEPS: FlowStep[] = [
  { index: "01", cards: "卡 1-2", title: "先安靜地聽", Icon: Ear },
  { index: "02", cards: "卡 3-7", title: "再請 AI 一起對證據", Icon: Search },
  { index: "03", cards: "卡 8-9", title: "最後你自己寫下判斷", Icon: Scale },
];

export function ProgressVisual() {
  return (
    <ol role="list" aria-label="3 段流程概覽：先聽、再對證據、最後自己判斷" className="space-y-3">
      {FLOW_STEPS.map(({ index, cards, title, Icon }, idx) => (
        <li
          key={index}
          className="group flex items-center gap-4 rounded-md border border-border-hairline bg-canvas-base/60 px-4 py-3.5 transition-colors hover:bg-surface-hover hover:border-border-default animate-grok-fade-up"
          style={{ animationDelay: `${400 + idx * 120}ms` }}
        >
          <span
            aria-hidden
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent-electric-subtle text-accent-electric ring-1 ring-accent-electric/20 transition-all group-hover:ring-accent-electric/40"
          >
            <Icon className="h-5 w-5" strokeWidth={1.5} />
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-tertiary">
              {index} · {cards}
            </p>
            <p className="mt-0.5 text-[14.5px] font-semibold text-text-primary leading-tight">
              {title}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
