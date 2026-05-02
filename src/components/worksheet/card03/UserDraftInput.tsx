/**
 * Step 1：使用者先寫 stuck_formula.user_draft 初版（在 AI 之前）。
 */
import { TextareaField } from "@/components/worksheet/card01/FormFields";
import { abstractKeywordsHit, USER_DRAFT_MAX, USER_DRAFT_MIN } from "@/lib/cardThreeValidators";

type Props = {
  value: string;
  onChange: (v: string) => void;
  highlight?: boolean;
};

export function UserDraftInput({ value, onChange, highlight }: Props) {
  const hits = abstractKeywordsHit(value);
  const tooShort = value.trim().length > 0 && value.trim().length < USER_DRAFT_MIN;

  const warning = hits.length > 0
    ? `「${hits.join("、")}」這太抽象了，請寫具體做什麼動作 / 步驟卡住。例：「翻 7 次成績單拼湊資料」勝過「流程不順」。`
    : null;

  return (
    <section
      aria-labelledby="step-1-label"
      className="rounded-lg border border-border bg-surface p-5 sm:p-6 space-y-4"
    >
      <header>
        <p className="text-[12px] font-semibold tracking-widest uppercase text-secondary">
          Step 1
        </p>
        <h2 id="step-1-label" className="mt-1 text-[20px] font-bold text-text-primary leading-[1.35]">
          你先寫初版
        </h2>
        <p className="mt-1.5 text-[13.5px] text-text-secondary leading-[1.6]">
          在點開 AI 之前，先寫你自己的版本。後面才能對照 AI 改了哪些地方。
        </p>
      </header>

      <TextareaField
        id="stuck-user-draft"
        label="我每次要 ___，都會卡在 ___。"
        helper="兩個空格都要具體。寫具體動作 / 步驟，避免「效率不好」這種抽象詞。"
        placeholder="我每次要寫 30 則家長回報，都會卡在資料散在週間 7 次小考、要寫得具體、不能傷家長感情。"
        value={value}
        onChange={onChange}
        rows={3}
        maxLength={USER_DRAFT_MAX}
        required
        highlight={highlight}
        warning={warning}
        error={tooShort ? `至少 ${USER_DRAFT_MIN} 字（目前 ${value.trim().length}）。` : null}
      />
    </section>
  );
}
