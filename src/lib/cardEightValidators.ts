/**
 * Card 8 validators — interview plan
 *
 * - 推銷題偵測：警告但不擋過關（人類自由意志優先；audit-log 留在 LocalStorage）
 * - rules_table 文案 100% 引自 worksheet 卡 8
 */

import type { PainCard } from "@/types/painCard";

export const PERSONA_MIN = 10;
export const CONTACT_MIN = 5;
export const PLANNED_MIN = 5;
export const QUESTION_MIN = 15;
export const QUESTION_MAX = 300;
export const TARGETS_MIN = 2;
export const TARGETS_MAX = 5;

export const SELLING_KEYWORDS = [
  "會付",
  "會買",
  "願意花",
  "定價",
  "會用嗎",
  "好不好",
  "想法是",
  "如果有 App",
  "如果有app",
  "方案",
  "訂閱",
] as const;

export function findSellingHits(text: string): string[] {
  const t = text.toLowerCase().replace(/\s+/g, " ");
  const hits: string[] = [];
  for (const kw of SELLING_KEYWORDS) {
    if (t.includes(kw.toLowerCase())) hits.push(kw);
  }
  return hits;
}

export function evaluateTargets(plan: PainCard["interview_plan"]) {
  const targets = plan.targets;
  const personaOk = targets
    .map((t) => t.persona.trim().length >= PERSONA_MIN);
  const contactOk = targets.map((t) => t.contact_info.trim().length >= CONTACT_MIN);
  const plannedOk = targets.map((t) => t.planned_time.trim().length >= PLANNED_MIN);
  const anyContact = contactOk.some(Boolean);
  return { personaOk, contactOk, plannedOk, anyContact };
}

export function evaluateQuestions(plan: PainCard["interview_plan"]) {
  const qs = plan.questions;
  const filled = [0, 1, 2].map((i) => (qs[i] ?? "").trim().length >= QUESTION_MIN);
  const allFilled = filled.every(Boolean);
  return { filled, allFilled };
}

export const RULES_TABLE: Array<{ dont: string; do: string }> = [
  {
    dont: "「我有一個想法是 ___，你覺得好不好？」",
    do: "「你最近一次遇到這個問題是什麼時候？發生了什麼？」",
  },
  {
    dont: "「如果有 App 可以 ___，你會用嗎？」",
    do: "「你現在用什麼方法在解這個問題？」",
  },
  {
    dont: "「這個你會付多少錢？」",
    do: "「你現在花多少時間在做這件事？」",
  },
  {
    dont: "推銷你的解法",
    do: "只聽他說現況",
  },
];

export const SAMPLE_QUESTIONS = [
  "你最近一次寫家長回報是什麼時候？花了多久？發生了什麼？",
  "你現在用什麼方法在解這個問題？試過什麼放棄了？",
  "你現在花多少時間在做這件事？最不滿意哪一段？",
  "上一次這個問題讓你最煩躁的是哪個瞬間？",
  "如果這件事完全沒做，會發生什麼？",
  "你身邊有沒有人也在做這件事？他們怎麼解？",
  "為了這件事你花了多少錢 / 多少時間？",
  "你之前有想過自己解嗎？最後為什麼沒做？",
  "你最近一次跟別人聊到這個問題是什麼時候？對方的反應？",
];

/**
 * 從卡 6 q8 文字解析候選人群 chips。
 * 規則：抓編號（1. / 2. / -）或換行，每行第一句話前的人群名稱。
 * 寬鬆解析，最多回 6 個。
 */
export function parseQ8Candidates(q8Raw: string): string[] {
  if (!q8Raw) return [];
  const lines = q8Raw
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);

  const candidates: string[] = [];
  for (const line of lines) {
    // 去掉編號、標號、emoji
    const stripped = line.replace(/^[-•·\d]+[\.\)、:：\s]*/, "").trim();
    if (!stripped) continue;
    // 取冒號 / 破折號前一段，如「中小型補習班數學老師：…」→「中小型補習班數學老師」
    const head = stripped.split(/[：:—\-—（(]/)[0].trim();
    if (head.length >= 4 && head.length <= 50) {
      if (!candidates.includes(head)) candidates.push(head);
    }
    if (candidates.length >= 6) break;
  }
  return candidates;
}
