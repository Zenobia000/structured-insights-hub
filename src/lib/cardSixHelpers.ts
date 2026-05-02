/**
 * Card 6 — AI 工具 metadata + 反推銷偵測
 */
import type { AiTool } from "@/types/painCard";

export type AiToolMeta = {
  id: AiTool;
  name: string;
  bestFor: string;
  url: string;
  recommended?: boolean;
};

export const AI_TOOLS: ReadonlyArray<AiToolMeta> = [
  {
    id: "chatgpt_dr",
    name: "ChatGPT Deep Research",
    bestFor: "從公開資料找討論、文章、評論、外部證據",
    url: "https://chat.openai.com/",
    recommended: true,
  },
  {
    id: "claude",
    name: "Claude",
    bestFor: "整理長文字（訪談逐字稿、LINE 對話、客服紀錄）",
    url: "https://claude.ai/",
  },
  {
    id: "perplexity",
    name: "Perplexity",
    bestFor: "補資料來源、查最新趨勢與報告",
    url: "https://www.perplexity.ai/",
  },
  {
    id: "gemini",
    name: "Gemini Deep Research",
    bestFor: "補資料來源、查最新趨勢與報告",
    url: "https://gemini.google.com/",
  },
];

export function getToolById(id: AiTool | null): AiToolMeta | undefined {
  if (!id) return undefined;
  return AI_TOOLS.find((t) => t.id === id);
}

// 反推銷觸發詞
export const SOLUTION_PUSH_KEYWORDS = [
  "建議製作 App",
  "建議製作App",
  "建議開發 App",
  "建議開發App",
  "你應該開發",
  "你應該做一個",
  "設計一個 SaaS",
  "設計一個SaaS",
  "市場機會",
  "商業模式建議",
  "投資報酬率",
  "ROI",
  "定價策略",
  "MVP 規劃",
  "MVP規劃",
  "建議推出",
  "可以推出",
  "可以開發一個",
  "可以做一個 App",
  "建議開發一個產品",
];

export function findSolutionPushHits(text: string): string[] {
  if (!text) return [];
  const t = text;
  return SOLUTION_PUSH_KEYWORDS.filter((kw) => t.includes(kw));
}

// 8 題的 minLength
export const EIGHT_ANSWERS_MIN: Record<keyof EightAnswersInput, number> = {
  q1_specific_groups: 30,
  q2_scenes_frequency: 20,
  q3_workarounds: 30,
  q4_dissatisfactions_categorized: 40,
  q5_public_evidence: 20,
  q6_jtbd: 20,
  q7_possible_fake_pains: 20,
  q8_interview_targets: 80,
};

export type EightAnswersInput = {
  q1_specific_groups: string;
  q2_scenes_frequency: string;
  q3_workarounds: string;
  q4_dissatisfactions_categorized: string;
  q5_public_evidence: string;
  q6_jtbd: string;
  q7_possible_fake_pains: string;
  q8_interview_targets: string;
};

export const EIGHT_ANSWERS_META: ReadonlyArray<{
  key: keyof EightAnswersInput;
  num: number;
  label: string;
  hint: string;
}> = [
  {
    key: "q1_specific_groups",
    num: 1,
    label: "哪些具體人群最常遇到這個問題？",
    hint: "應有 3-5 群，每群有具體職業/角色（不要寫「上班族」這種模糊詞）",
  },
  {
    key: "q2_scenes_frequency",
    num: 2,
    label: "在什麼場景發生？頻率多高？",
    hint: "至少 1 個可被觀察的場景：時間 + 地點 + 動作",
  },
  {
    key: "q3_workarounds",
    num: 3,
    label: "他們現在怎麼解？5 個 workaround",
    hint: "每個都要有具體名字（工具名 / 流程名）",
  },
  {
    key: "q4_dissatisfactions_categorized",
    num: 4,
    label: "現有解法的不滿（5 類分類）",
    hint: "分類：時間 / 品質 / 情緒 / 資料整理 / 其他",
  },
  {
    key: "q5_public_evidence",
    num: 5,
    label: "公開證據來源",
    hint: "論壇、社群、產業文章、工具評論、搜尋趨勢",
  },
  {
    key: "q6_jtbd",
    num: 6,
    label: "真正的 Job-to-be-Done",
    hint: "他真正想完成的事，不是表面行為",
  },
  {
    key: "q7_possible_fake_pains",
    num: 7,
    label: "可能的假痛點",
    hint: "看起來很煩，但其實不夠頻繁 / 不夠痛 / 已被解決",
  },
  {
    key: "q8_interview_targets",
    num: 8,
    label: "該訪談哪 5 種人 + 各 3 題",
    hint: "卡 8 會用到，請完整貼上",
  },
];

export function evaluateEightAnswers(answers: EightAnswersInput) {
  const filled: Record<keyof EightAnswersInput, boolean> = {
    q1_specific_groups: false,
    q2_scenes_frequency: false,
    q3_workarounds: false,
    q4_dissatisfactions_categorized: false,
    q5_public_evidence: false,
    q6_jtbd: false,
    q7_possible_fake_pains: false,
    q8_interview_targets: false,
  };
  let passedCount = 0;
  (Object.keys(EIGHT_ANSWERS_MIN) as Array<keyof EightAnswersInput>).forEach((k) => {
    const ok = answers[k].trim().length >= EIGHT_ANSWERS_MIN[k];
    filled[k] = ok;
    if (ok) passedCount += 1;
  });
  return { filled, passedCount, allPassed: passedCount === 8 };
}
