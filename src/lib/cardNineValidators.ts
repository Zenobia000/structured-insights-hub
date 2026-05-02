/**
 * Card 9 validators — Pain Quality Score & Verdict
 *
 * 鐵律：
 * - reason_100w 強制 ≥ 100 字
 * - 5 維度評分強制（教學模式 UI / 生產模式隱藏分數）
 * - judgment 與 next_action 必選
 * - judgment → status 對應由 page 層 advance 時寫入
 */

import type {
  Judgment,
  NextAction,
  PainCard,
  PainCardStatus,
  Score,
} from "@/types/painCard";

export const REASON_MIN = 100;
export const REASON_MAX = 5000;
export const SHORT_REASON_MIN = 15;

export type DimensionKey =
  | "people_specificity"
  | "frequency"
  | "intensity"
  | "workaround_dissatisfaction"
  | "evidence_credibility";

export const DIMENSIONS: Array<{
  key: DimensionKey;
  label: string;
  subtitle: string;
  levels: { v: number; text: string }[];
}> = [
  {
    key: "people_specificity",
    label: "1. 人群具體度",
    subtitle: "我對痛點主人翁的描述有多具體？",
    levels: [
      { v: 1, text: "只知道大概族群（如「上班族」）" },
      { v: 3, text: "知道是哪群但說不出名字" },
      { v: 5, text: "能說清楚職位、場景、任務" },
    ],
  },
  {
    key: "frequency",
    label: "2. 發生頻率",
    subtitle: "他多常遇到這個問題？",
    levels: [
      { v: 1, text: "偶爾發生" },
      { v: 3, text: "一個月幾次" },
      { v: 5, text: "每週、每天或高頻" },
    ],
  },
  {
    key: "intensity",
    label: "3. 痛苦強度",
    subtitle: "這個問題對他造成多大影響？",
    levels: [
      { v: 1, text: "只是小麻煩" },
      { v: 3, text: "願意花一點時間解" },
      { v: 5, text: "造成明顯時間 / 金錢 / 壓力 / 風險" },
    ],
  },
  {
    key: "workaround_dissatisfaction",
    label: "4. 現有解法不滿",
    subtitle: "他對現有 workaround 多不滿？",
    levels: [
      { v: 1, text: "已有好工具或流程" },
      { v: 3, text: "有但不夠好" },
      { v: 5, text: "仍靠土法、拼貼、手工處理" },
    ],
  },
  {
    key: "evidence_credibility",
    label: "5. 證據可信度",
    subtitle: "我手上的證據強度？",
    levels: [
      { v: 1, text: "只有自己的想像" },
      { v: 3, text: "問過 1 個人或看到 1 篇文章" },
      { v: 5, text: "多來源證據與真人可訪談" },
    ],
  },
];

export function evaluateScores(v: PainCard["verdict"]) {
  const filled: Record<DimensionKey, boolean> = {
    people_specificity: typeof v.scores.people_specificity === "number",
    frequency: typeof v.scores.frequency === "number",
    intensity: typeof v.scores.intensity === "number",
    workaround_dissatisfaction:
      typeof v.scores.workaround_dissatisfaction === "number",
    evidence_credibility: typeof v.scores.evidence_credibility === "number",
  };
  const filledCount = Object.values(filled).filter(Boolean).length;
  const allFilled = filledCount === 5;
  const total = allFilled
    ? (v.scores.people_specificity ?? 0) +
      (v.scores.frequency ?? 0) +
      (v.scores.intensity ?? 0) +
      (v.scores.workaround_dissatisfaction ?? 0) +
      (v.scores.evidence_credibility ?? 0)
    : null;
  return { filled, filledCount, allFilled, total };
}

export function bandHint(total: number | null): string | null {
  if (total === null) return null;
  if (total >= 20)
    return "這份證據強度建議你排真人訪談（卡 8 對象）。";
  if (total >= 15)
    return "建議先縮小人群或換場景再研究（退回卡 2 或 3）。";
  return "可能只是抱怨，不是好痛點。可以考慮換題。";
}

export function judgmentToStatus(j: Judgment | null): PainCardStatus {
  if (j === "true_pain") return "structured";
  if (j === "fake_pain") return "archived_fake";
  if (j === "pending_interview") return "pending_interview";
  return "in_progress";
}

export const NEXT_ACTION_OPTIONS: Array<{
  value: NextAction;
  label: string;
  hint: string;
}> = [
  {
    value: "interview",
    label: "訪談卡 8 的對象",
    hint: "把卡 8 規劃的人約出來，問現況不要推銷。",
  },
  {
    value: "more_evidence",
    label: "退回卡 6 找更多證據",
    hint: "再跑一輪 AI 證據蒐集，補齊弱維度。",
  },
  {
    value: "change_topic",
    label: "換題目重新填一輪",
    hint: "證據不支持，從卡 1 重新挑一個抱怨。",
  },
];

export function defaultNextAction(j: Judgment | null): NextAction | null {
  if (j === "true_pain" || j === "pending_interview") return "interview";
  if (j === "fake_pain") return "change_topic";
  return null;
}

export function isScore(n: unknown): n is Score {
  return n === 1 || n === 2 || n === 3 || n === 4 || n === 5;
}
