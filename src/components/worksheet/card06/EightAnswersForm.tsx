/**
 * EightAnswersForm — raw_response + 8 題結構化 textarea
 */
import { type ChangeEvent } from "react";
import { Check } from "lucide-react";
import {
  EIGHT_ANSWERS_META,
  EIGHT_ANSWERS_MIN,
  type EightAnswersInput,
} from "@/lib/cardSixHelpers";
import { cn } from "@/lib/utils";

type Props = {
  rawResponse: string;
  onRawChange: (v: string) => void;
  answers: EightAnswersInput;
  onAnswerChange: (key: keyof EightAnswersInput, v: string) => void;
  attempted?: boolean;
};

export function EightAnswersForm({
  rawResponse,
  onRawChange,
  answers,
  onAnswerChange,
  attempted,
}: Props) {
  const rawOk = rawResponse.trim().length >= 200;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label
          htmlFor="raw_response"
          className="flex items-center justify-between text-[15px] font-semibold text-text-primary"
        >
          <span>
            AI 回覆原文（完整貼上）
            <span aria-hidden className="text-text-muted ml-1">
              *
            </span>
          </span>
          <span
            className={cn("text-[12px] font-normal", rawOk ? "text-verified" : "text-text-muted")}
          >
            {rawResponse.length} 字{rawOk ? " ✓" : "（最少 200 字）"}
          </span>
        </label>
        <p className="text-[13px] text-text-secondary">整段原文會保存在你的本機，未來查核用。</p>
        <textarea
          id="raw_response"
          value={rawResponse}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onRawChange(e.target.value)}
          placeholder="把 AI 給的整段回覆貼進來…"
          rows={8}
          className={cn(
            "w-full rounded-md border bg-muted-bg px-3.5 py-2.5 font-mono text-[13.5px] leading-[1.55]",
            "text-text-primary placeholder:text-text-muted",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:border-secondary",
            attempted && !rawOk ? "border-destructive" : "border-border",
          )}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-[15px] font-semibold text-text-primary">
          再把 8 題答案分別貼進對應欄位
        </h3>

        {EIGHT_ANSWERS_META.map((meta) => {
          const value = answers[meta.key];
          const min = EIGHT_ANSWERS_MIN[meta.key];
          const ok = value.trim().length >= min;
          const fieldId = `answer-${meta.key}`;
          return (
            <div
              key={meta.key}
              className="rounded-lg border border-border bg-surface p-4 space-y-2"
            >
              <div className="flex items-baseline justify-between gap-3">
                <label
                  htmlFor={fieldId}
                  className="text-[14.5px] font-semibold text-text-primary leading-[1.4]"
                >
                  <span className="font-mono text-secondary mr-1.5">Q{meta.num}.</span>
                  {meta.label}
                </label>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 text-[11.5px] shrink-0",
                    ok ? "text-verified font-semibold" : "text-text-muted",
                  )}
                >
                  {ok && <Check className="h-3 w-3" aria-hidden />}
                  已填 {value.length} 字（最少 {min} 字）
                </span>
              </div>
              <p className="text-[12.5px] text-text-secondary leading-[1.5]">{meta.hint}</p>
              <textarea
                id={fieldId}
                value={value}
                onChange={(e) => onAnswerChange(meta.key, e.target.value)}
                rows={4}
                placeholder="貼上 AI 對這題的完整回答…"
                className={cn(
                  "w-full rounded-md border bg-surface px-3 py-2 text-[14px] leading-[1.55]",
                  "text-text-primary placeholder:text-text-muted",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:border-secondary",
                  attempted && !ok ? "border-destructive" : "border-border",
                )}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
