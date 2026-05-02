/**
 * Card 9 validators — Verdict (no scores)
 *
 * 鐵律：
 * - reason_100w 強制 ≥ 100 字
 * - judgment 與 next_action 必選
 * - judgment → status 對應由 page 層 advance 時寫入
 */

import type { Judgment, NextAction, PainCardStatus } from "@/types/painCard";

export const REASON_MIN = 100;
export const REASON_MAX = 5000;
export const SHORT_REASON_MIN = 15;

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
    label: "回去把卡 6 的證據再補一輪",
    hint: "再跑一輪 AI 證據蒐集，把薄弱的環節補齊。",
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
