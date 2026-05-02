/**
 * Card 7 validators — self-guess + AI review
 *
 * Phase A 解鎖規則：4 欄猜測各 ≥ 10 字 + 使用者點擊「我猜完了」按鈕。
 * 注意：解鎖判定一半在 state（rawAllReached），一半在使用者意願（unlockClicked），
 * 不純粹依 LocalStorage 的 phase_a_completed_at — 即使有人手改 LS，UI 仍會擋。
 */

import type { PainCard } from "@/types/painCard";

export const GUESS_MIN = 10;
export const GUESS_MAX = 200;
export const TABLE_MIN = 100;
export const DELTA_MIN = 20;

export type GuessKey =
  | "most_painful_person"
  | "most_common_scene"
  | "biggest_dissatisfaction"
  | "possible_fake_pain";

export type CheckpointKey =
  | "people_segmented"
  | "scenes_observable"
  | "workaround_dissatisfactions_listed"
  | "fake_pains_flagged";

export type DeltaKey = "biggest_diff" | "ai_added" | "guess_unsupported";

export const GUESS_FIELDS: Array<{
  key: GuessKey;
  label: string;
  hint: string;
}> = [
  {
    key: "most_painful_person",
    label: "我猜「最痛」的人是",
    hint: "從卡 4 的 workaround 推論：誰在花最多時間 / 錢 / 情緒解這件事？",
  },
  {
    key: "most_common_scene",
    label: "我猜「最常發生」的場景是",
    hint: "時間 + 地點 + 動作（例：週六晚上、家裡、寫家長信）",
  },
  {
    key: "biggest_dissatisfaction",
    label: "我猜「他現在最不滿」的點是",
    hint: "從卡 4 的不滿理由中挑你直覺最強的那個",
  },
  {
    key: "possible_fake_pain",
    label: "我猜可能有 1 個假痛點是",
    hint: "我自己懷疑可能不是真的痛 / 可能會被現有工具解掉的部分",
  },
];

export const CHECKPOINT_FIELDS: Array<{
  key: CheckpointKey;
  question: string;
  criterion: string;
}> = [
  {
    key: "people_segmented",
    question: "1. 它有沒有把人群切細？",
    criterion: "答案有具體職業 / 場景，不是「上班族」這種空話",
  },
  {
    key: "scenes_observable",
    question: "2. 它有沒有找到發生場景？",
    criterion: "至少 1 個可被觀察的場景（時間 + 地點 + 動作）",
  },
  {
    key: "workaround_dissatisfactions_listed",
    question: "3. 它有沒有提出現有解法的不滿?",
    criterion: "至少 3 個 workaround 各有不滿點",
  },
  {
    key: "fake_pains_flagged",
    question: "4. 它有沒有提醒哪些可能是假痛點？",
    criterion: "至少 1 個假痛點假設",
  },
];

export const DELTA_FIELDS: Array<{ key: DeltaKey; label: string; hint: string }> = [
  {
    key: "biggest_diff",
    label: "我的猜測 vs AI 的答案，最大差異在",
    hint: "用「差異」「補了 / 漏了」這類中性詞，不要用「對 / 錯」",
  },
  {
    key: "ai_added",
    label: "AI 給我看到了什麼我沒想到的",
    hint: "AI 補上的人群、場景、不滿、假痛點 — 任何新觀點",
  },
  {
    key: "guess_unsupported",
    label: "我原本的猜測中，AI 證據沒支持的部分",
    hint: "可能是我憑印象猜的，但其實沒有公開證據支持的部分",
  },
];

export function evaluatePhaseA(sg: PainCard["self_guess"]) {
  const filled: Record<GuessKey, boolean> = {
    most_painful_person: sg.guesses.most_painful_person.trim().length >= GUESS_MIN,
    most_common_scene: sg.guesses.most_common_scene.trim().length >= GUESS_MIN,
    biggest_dissatisfaction:
      sg.guesses.biggest_dissatisfaction.trim().length >= GUESS_MIN,
    possible_fake_pain: sg.guesses.possible_fake_pain.trim().length >= GUESS_MIN,
  };
  const allFilled = Object.values(filled).every(Boolean);
  return { filled, allFilled };
}

export function evaluateCheckpoints(sg: PainCard["self_guess"]) {
  const c = sg.ai_checkpoints_passed;
  const passedCount = [
    c.people_segmented,
    c.scenes_observable,
    c.workaround_dissatisfactions_listed,
    c.fake_pains_flagged,
  ].filter(Boolean).length;
  return { passedCount, allPassed: passedCount === 4 };
}

export function evaluateDeltas(sg: PainCard["self_guess"]) {
  const d = sg.deltas;
  const filled: Record<DeltaKey, boolean> = {
    biggest_diff: d.biggest_diff.trim().length >= DELTA_MIN,
    ai_added: d.ai_added.trim().length >= DELTA_MIN,
    guess_unsupported: d.guess_unsupported.trim().length >= DELTA_MIN,
  };
  const allFilled = Object.values(filled).every(Boolean);
  return { filled, allFilled };
}

export function evaluateTable(sg: PainCard["self_guess"]) {
  return sg.pain_judgment_table.trim().length >= TABLE_MIN;
}

export const SECOND_ROUND_PROMPT = `請把上面的研究整理成一張「痛點判斷表」。

欄位包含：
- 目標人群（具體職位/角色）
- 發生場景（時間+地點+動作）
- 發生頻率（一週/一月幾次）
- 現在解法（具體名稱）
- 主要不滿（分類）
- 可查證證據（連結或來源類型）
- 我應該訪談誰
- 訪談第一題

請用非常具體的中文，不要寫抽象名詞。

接著請挑出最值得優先研究的 1 個人群，並說明為什麼不是其他人群。
判斷標準只看痛點強度與證據，不看商業模式、不看技術可行性。`;
