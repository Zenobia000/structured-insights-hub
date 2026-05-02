/**
 * ThreeStepTeachingSection — 三段教學預覽。
 * 不是「賣特色」，是「告訴你流程怎麼跑」— 透明度本身是 epic meaning。
 */
import { Ear, Search, Scale } from "lucide-react";
import { SectionFade } from "./SectionFade";

type Step = {
  index: string;
  title: string;
  cards: string;
  body: string;
  output: string;
  Icon: React.ComponentType<{ className?: string }>;
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
      className="bg-surface border-b border-border scroll-mt-20"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2
            id="three-step-title"
            className="text-2xl sm:text-[28px] font-bold leading-[1.3] text-text-primary"
          >
            從一句抱怨，到一張你說得清楚的判斷
          </h2>
          <p className="mt-3 text-[15px] leading-[1.6] text-text-secondary">
            我們不會給你答案。我們陪你練習，怎麼自己想清楚。
          </p>
        </div>

        <ol className="grid md:grid-cols-3 gap-4 md:gap-5">
          {STEPS.map(({ index, title, cards, body, output, Icon }) => (
            <li
              key={index}
              className="group relative rounded-xl border border-border bg-surface p-6 shadow-[0_1px_3px_rgba(30,58,95,0.06)] hover:border-secondary hover:-translate-y-0.5 hover:shadow-[0_4px_8px_rgba(30,58,95,0.08)] transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center h-10 w-10 rounded-md bg-primary-light text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-xs font-mono font-semibold text-text-muted">
                  {index} · {cards}
                </span>
              </div>
              <h3 className="text-[18px] font-semibold text-text-primary leading-[1.4]">{title}</h3>
              <p className="mt-2.5 text-[15px] leading-[1.6] text-text-secondary">{body}</p>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-[11px] font-semibold text-text-muted tracking-wider uppercase mb-1">
                  你會帶走
                </p>
                <p className="text-[13px] leading-[1.5] text-text-primary">{output}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </SectionFade>
  );
}
