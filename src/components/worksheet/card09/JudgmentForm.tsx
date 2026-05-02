import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  NEXT_ACTION_OPTIONS,
  REASON_MAX,
  REASON_MIN,
  SHORT_REASON_MIN,
} from "@/lib/cardNineValidators";
import type { Judgment, NextAction } from "@/types/painCard";

type Props = {
  judgment: Judgment | null;
  onJudgmentChange: (v: Judgment) => void;
  reason: string;
  onReasonChange: (v: string) => void;
  mostConfident: string;
  onMostConfidentChange: (v: string) => void;
  leastConfident: string;
  onLeastConfidentChange: (v: string) => void;
  nextAction: NextAction | null;
  onNextActionChange: (v: NextAction) => void;
};

const JUDGMENT_OPTIONS: Array<{
  value: Judgment;
  marker: string;
  label: string;
  description: string;
}> = [
  {
    value: "true_pain",
    marker: "✓",
    label: "真痛點",
    description: "我有足夠證據相信這是真的。下一步排訪談 / 進階段二。",
  },
  {
    value: "fake_pain",
    marker: "✗",
    label: "假痛點",
    description: "證據不支持。換題目，從卡 1 重新來。",
  },
  {
    value: "pending_interview",
    marker: "?",
    label: "還無法判斷",
    description: "需要訪談 2-3 人後再回來重打分。這是最常見的結果，很正常。",
  },
];

export function JudgmentForm({
  judgment,
  onJudgmentChange,
  reason,
  onReasonChange,
  mostConfident,
  onMostConfidentChange,
  leastConfident,
  onLeastConfidentChange,
  nextAction,
  onNextActionChange,
}: Props) {
  const reasonLen = reason.trim().length;
  const reasonPassed = reasonLen >= REASON_MIN;
  const mostOk = mostConfident.trim().length >= SHORT_REASON_MIN;
  const leastOk = leastConfident.trim().length >= SHORT_REASON_MIN;

  return (
    <section className="rounded-lg bg-surface border border-border border-l-4 border-l-accent p-6 sm:p-8 space-y-6 max-w-3xl">
      <header>
        <h2 className="text-[22px] font-bold text-text-primary">
          第二步：書面判斷（這份填空簿的唯一交付物）
        </h2>
        <p className="text-[14.5px] text-text-secondary leading-[1.6] mt-1">
          這 4 題只能你自己寫。AI 不參與。
        </p>
      </header>

      {/* judgment */}
      <fieldset className="space-y-2">
        <legend className="text-[16px] font-semibold text-text-primary">
          這是真痛點還是假痛點？
        </legend>
        <p className="sr-only">可用 Tab 進入後，按方向鍵切換選項，按 Enter 或空白鍵確認。</p>
        <RadioGroup
          value={judgment ?? ""}
          onValueChange={(v) => onJudgmentChange(v as Judgment)}
          className="grid gap-2 sm:grid-cols-3"
        >
          {JUDGMENT_OPTIONS.map((opt) => {
            const selected = judgment === opt.value;
            return (
              <label
                key={opt.value}
                htmlFor={`j-${opt.value}`}
                className={cn(
                  "rounded-lg border p-3 cursor-pointer flex flex-col gap-1 items-start text-left transition-colors",
                  "focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2",
                  selected
                    ? "border-accent ring-2 ring-accent/30 bg-accent/5"
                    : "border-border bg-surface hover:border-accent/40",
                )}
              >
                <RadioGroupItem
                  id={`j-${opt.value}`}
                  value={opt.value}
                  aria-label={`${opt.label}：${opt.description}`}
                  className="sr-only"
                />
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[15px] font-bold text-text-primary">
                    {opt.marker}
                  </span>
                  <span className="text-[15px] font-semibold text-text-primary">{opt.label}</span>
                </div>
                <p className="text-[12.5px] text-text-secondary leading-[1.55]">
                  {opt.description}
                </p>
              </label>
            );
          })}
        </RadioGroup>
      </fieldset>

      {/* reason 100w */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <label htmlFor="reason-100w" className="text-[16px] font-semibold text-text-primary">
            書面理由（≥ {REASON_MIN} 字）
          </label>
          {reasonPassed && (
            <span className="text-[12px] text-verified inline-flex items-center gap-1">
              <Check className="h-3 w-3" /> 已達字數
            </span>
          )}
        </div>
        <p className="text-[12.5px] text-text-secondary leading-[1.55]">
          不是想想就過。具體寫：你看到了什麼證據、你還沒看到什麼、為什麼這樣判。
        </p>
        <Textarea
          id="reason-100w"
          value={reason}
          onChange={(e) => onReasonChange(e.target.value.slice(0, REASON_MAX))}
          placeholder="例：我看到 3 位老師都用 LINE 群組通知家長，但 2 位提到週日晚上要花 2 小時整理回報訊息。我還沒訪談過家長端，不知道對方真的需要這個資訊還是只是禮貌性已讀。所以..."
          className="min-h-[240px] text-[14.5px] leading-[1.7]"
        />
        <p
          className={cn(
            "text-[12.5px] font-medium",
            reasonPassed ? "text-verified" : "text-caution",
          )}
        >
          已寫 {reasonLen} / 至少 {REASON_MIN} 字
          {!reasonPassed && reasonLen > 0 && `（再多寫 ${REASON_MIN - reasonLen} 字）`}
        </p>
      </div>

      {/* most / least confident */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="most-confident" className="text-[14px] font-semibold text-text-primary">
              我最有把握的證據是
            </label>
            {mostOk && (
              <span className="text-[11.5px] text-verified inline-flex items-center gap-1">
                <Check className="h-3 w-3" /> 已寫
              </span>
            )}
          </div>
          <p className="text-[12px] text-text-secondary leading-[1.55]">
            從卡 6 + 卡 7 抽 1 個具體證據（不是空話）
          </p>
          <Textarea
            id="most-confident"
            value={mostConfident}
            onChange={(e) => onMostConfidentChange(e.target.value)}
            placeholder="例：卡 6 q5 找到 3 篇 PTT 文章，2024 年都有家長提..."
            className="min-h-[100px]"
          />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="least-confident"
              className="text-[14px] font-semibold text-text-primary"
            >
              我最沒把握的地方是
            </label>
            {leastOk && (
              <span className="text-[11.5px] text-verified inline-flex items-center gap-1">
                <Check className="h-3 w-3" /> 已寫
              </span>
            )}
          </div>
          <p className="text-[12px] text-text-secondary leading-[1.55]">
            誠實寫出你的不確定。這比假裝有把握更有價值。
          </p>
          <Textarea
            id="least-confident"
            value={leastConfident}
            onChange={(e) => onLeastConfidentChange(e.target.value)}
            placeholder="例：我還沒問過家長端，不知道他們真的看不看回報..."
            className="min-h-[100px]"
          />
        </div>
      </div>

      {/* next action */}
      <fieldset className="space-y-2">
        <legend className="text-[16px] font-semibold text-text-primary">下一步我會</legend>
        <p className="sr-only">可用 Tab 進入後，按方向鍵切換選項，按 Enter 或空白鍵確認。</p>
        <RadioGroup
          value={nextAction ?? ""}
          onValueChange={(v) => onNextActionChange(v as NextAction)}
          className="space-y-2"
        >
          {NEXT_ACTION_OPTIONS.map((opt) => {
            const selected = nextAction === opt.value;
            return (
              <label
                key={opt.value}
                htmlFor={`na-${opt.value}`}
                className={cn(
                  "block rounded-md border p-3 cursor-pointer text-left transition-colors",
                  "focus-within:ring-2 focus-within:ring-secondary focus-within:ring-offset-2",
                  selected
                    ? "border-secondary ring-2 ring-secondary/30 bg-secondary/5"
                    : "border-border bg-surface hover:border-secondary/40",
                )}
              >
                <RadioGroupItem
                  id={`na-${opt.value}`}
                  value={opt.value}
                  aria-label={`${opt.label}：${opt.hint}`}
                  className="sr-only"
                />
                <span className="block text-[14.5px] font-semibold text-text-primary">
                  {opt.label}
                </span>
                <span className="block text-[12.5px] text-text-secondary leading-[1.55]">
                  {opt.hint}
                </span>
              </label>
            );
          })}
        </RadioGroup>
      </fieldset>
    </section>
  );
}
