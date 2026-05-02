/**
 * Step 3：使用者貼回 AI 校對結果（ai_polished + ai_clarifying_questions）。
 */
import { TextareaField } from "@/components/worksheet/card01/FormFields";
import { TagInputField } from "@/components/worksheet/card04/TagInputField";

type Props = {
  aiPolished: string;
  onAiPolishedChange: (v: string) => void;
  questions: string[];
  onQuestionsChange: (v: string[]) => void;
};

export function AiResponseInput({
  aiPolished,
  onAiPolishedChange,
  questions,
  onQuestionsChange,
}: Props) {
  return (
    <section
      aria-labelledby="step-3-label"
      className="rounded-lg border border-border bg-surface p-5 sm:p-6 space-y-5"
    >
      <header>
        <p className="text-[12px] font-semibold tracking-widest uppercase text-secondary">
          Step 2
        </p>
        <h2 id="step-3-label" className="mt-1 text-[20px] font-bold text-text-primary leading-[1.35]">
          把 AI 的回覆貼回來
        </h2>
        <p className="mt-1.5 text-[13.5px] text-text-secondary leading-[1.6]">
          貼回 AI 整理後的句子與它列出的「需要再問清楚」問題。如果 AI 沒列任何問題，下方欄位可空。
        </p>
      </header>

      <TextareaField
        id="stuck-ai-polished"
        label="AI 校對後的版本"
        helper="如果 AI 整理結果跟你的差不多，可留空、保留你自己的版本。"
        placeholder="我每次要在週末寫 30 則家長回報訊息，都會卡在『資料散在週間 7 次小考、要寫得具體、不能傷家長感情』這 3 件事同時要顧。"
        value={aiPolished}
        onChange={onAiPolishedChange}
        rows={3}
        maxLength={500}
      />

      <TagInputField
        id="stuck-ai-questions"
        label="AI 列的「需要再問清楚」的問題"
        helper="每行一個問題（按 Enter 新增）。如果 AI 沒列任何問題，這欄可空。"
        placeholder="例：「具體」跟「不傷感情」哪個現在最頭痛？"
        values={questions}
        onChange={onQuestionsChange}
        maxCount={10}
      />
    </section>
  );
}
