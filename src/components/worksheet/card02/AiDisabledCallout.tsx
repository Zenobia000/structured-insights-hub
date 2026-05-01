/**
 * AiDisabledCallout — 卡 2 醒目「AI 鐵律禁用」區塊。
 * 直接引用 worksheet 卡 2「🤖 不能讓 AI 代填」段落原文，不重寫。
 */
import { AlertOctagon } from "lucide-react";

export function AiDisabledCallout() {
  return (
    <section
      role="region"
      aria-labelledby="ai-disabled-title"
      className="rounded-lg border-2 border-caution/60 bg-caution/10 p-5"
    >
      <div className="flex items-start gap-3">
        <AlertOctagon
          className="h-5 w-5 text-caution shrink-0 mt-0.5"
          aria-hidden
        />
        <div className="min-w-0">
          <h3
            id="ai-disabled-title"
            className="text-[18px] font-bold text-text-primary leading-[1.4]"
          >
            這張卡 AI 不能幫忙
          </h3>
          <blockquote className="mt-2.5 border-l-2 border-caution pl-3.5 space-y-1.5 text-[14.5px] leading-[1.65] text-text-primary">
            <p>
              這張卡片<span className="font-semibold">完全是你的功課</span>
              ，AI 不能幫忙。
            </p>
            <p>
              理由：AI 會生「合成 persona」（虛構的人），但虛構的人
              <span className="font-semibold">不會付錢</span>。
            </p>
          </blockquote>
          <ul className="mt-3 space-y-1 text-[13.5px] leading-[1.55] text-text-secondary list-disc list-inside">
            <li>本頁無「AI 推薦人選」按鈕</li>
            <li>本頁無「AI 自動補充背景描述」按鈕</li>
            <li>
              如果你想不出 3 個真名 →
              這代表你還不認識這個圈子（後面會教你怎麼辦）
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
