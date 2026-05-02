/**
 * ThreeStepTeachingSection — 三段教學預覽 (Grok Feature Triplet pattern)。
 * 不是「賣特色」，是「告訴你流程怎麼跑」— 透明度本身是 epic meaning。
 */
import { Ear, Search, Scale } from "lucide-react";
import { SectionFade } from "./SectionFade";
import { Eyebrow } from "@/components/ui/eyebrow";

type Step = {
  index: string;
  title: string;
  cards: string;
  body: string;
  output: string;
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
};

const STEPS: Step[] = [
  {
    index: "01",
    title: "先安靜地聽",
    cards: "卡 1-2",
    body: "把聽到的那句抱怨一字不改寫下來，找出 3 個說得出名字的真人。這兩張卡 AI 不能進來 — 因為有些事，只有真人會說出口。",
    output: "抱怨原句 · 3 個有名字的人 · 聯絡方式",
    Icon: Ear,
  },
  {
    index: "02",
    title: "再請 AI 一起對證據",
    cards: "卡 3-7",
    body: "把那句抱怨翻譯成卡關公式，看看他現在怎麼解、卡在哪個矛盾。AI 來找線索，但你先自己猜一輪 — 這樣你才知道，自己跟證據之間差了多少。",
    output: "卡關公式 · 5 種 workaround · 痛點判斷表",
    Icon: Search,
  },
  {
    index: "03",
    title: "最後，你自己寫下判斷",
    cards: "卡 8-9",
    body: "把證據攤開來，規劃要找誰真人聊聊。最後一張卡，留給你一個人安靜地寫：這是真痛點、假痛點、還是要再訪談？接下來你打算做什麼？",
    output: "書面判斷 · 3 題訪談題目 · 下一步行動",
    Icon: Scale,
  },
];

export function ThreeStepTeachingSection() {
  return (
    <SectionFade
      id="three-step-teaching"
      ariaLabelledBy="three-step-title"
      className="relative scroll-mt-20 border-t border-border-hairline bg-canvas-base"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 py-20 md:py-32">
        <div className="max-w-2xl mb-16">
          <Eyebrow variant="numbered" index={1}>
            How it works
          </Eyebrow>
          <h2
            id="three-step-title"
            className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.05] tracking-[-0.03em] text-text-primary"
          >
            從一句抱怨，
            <br />
            到一張你說得清楚的判斷。
          </h2>
          <p className="mt-5 text-base sm:text-lg leading-[1.6] text-text-secondary">
            我們不會給你答案。我們陪你練習，怎麼自己想清楚。
          </p>
        </div>

        {/* Feature Triplet: gap-px on hairline bg = 自動產生分隔線 */}
        <ol className="grid md:grid-cols-3 gap-px bg-border-hairline border border-border-hairline rounded-lg overflow-hidden">
          {STEPS.map(({ index, title, cards, body, output, Icon }) => (
            <li
              key={index}
              className="group relative bg-canvas-base p-8 md:p-10 transition-colors duration-300 hover:bg-surface-hover"
            >
              {/* Icon + step marker */}
              <div className="flex items-start justify-between mb-8">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-accent-electric-subtle text-accent-electric ring-1 ring-accent-electric/20">
                  <Icon className="h-6 w-6" strokeWidth={1.5} />
                </span>
                <span className="font-mono text-xs uppercase tracking-[0.08em] text-text-tertiary">
                  {index} / {cards}
                </span>
              </div>

              <h3 className="text-xl font-semibold tracking-[-0.01em] text-text-primary">
                {title}
              </h3>
              <p className="mt-3 text-[15px] leading-[1.65] text-text-secondary">{body}</p>

              <div className="mt-8 pt-6 border-t border-border-subtle">
                <Eyebrow className="mb-2">你會帶走</Eyebrow>
                <p className="text-[14px] leading-[1.55] text-text-primary">{output}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </SectionFade>
  );
}
