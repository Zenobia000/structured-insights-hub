/**
 * Step 1：使用者用「自然語言」描述卡點。
 *
 * 設計變更（2026-05）：
 * 不再強迫使用者套「我每次要 ___，都會卡在 ___」句型。
 * 那個結構化動作交給 Step 2 的 AI 去做（避免重複勞動 + 降低門檻）。
 * 這裡只要使用者用自己的話描述清楚，AI 之後會幫忙整理。
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
  const len = value.trim().length;
  const tooShort = len > 0 && len < USER_DRAFT_MIN;

  const warning = hits.length > 0
    ? `「${hits.join("、")}」這詞太抽象。可以現在改成具體動作 / 步驟，或先寫下去、等 AI 校對時再補。`
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
          先用自己的話描述卡點
        </h2>
        <p className="mt-1.5 text-[13.5px] text-text-secondary leading-[1.6]">
          像對朋友抱怨一樣寫下來就好，不用照公式。下一步 AI 會幫你整理成「我每次要 ___，都會卡在 ___」的句型。
        </p>
      </header>

      <TextareaField
        id="stuck-user-draft"
        label="這件事是怎麼卡住的？"
        helper="把人物、場景、動作、為什麼卡寫進去。寫越具體，AI 整理出來的卡關公式越準。"
        placeholder="例：我每週末要寫 30 則家長回報訊息就花掉整個下午。週間 7 次小考的成績要從不同檔案翻出來拼湊，又怕寫太直接會傷家長的感情，所以每則都改了又改。"
        value={value}
        onChange={onChange}
        rows={4}
        maxLength={USER_DRAFT_MAX}
        required
        highlight={highlight}
        warning={warning}
        error={tooShort ? `再多寫一點，讓 AI 能讀出脈絡（目前 ${len} 字、至少 ${USER_DRAFT_MIN} 字）。` : null}
      />
    </section>
  );
}
