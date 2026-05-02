/**
 * PainCard — 痛點身份證 v1.0
 * 對應 docs/workshop/painpoint_beginner_worksheet.md 的 9 張卡片 + 1 張結果頁。
 *
 * 設計原則：
 * - 9 張卡片 = 同一個 PainCard 物件的 9 個欄位（不是 9 個獨立資料）
 * - MVP 階段全部存 LocalStorage，無雲端同步
 * - 此檔為 Single Source of Truth，page spec / API spec 必須與此一致
 */

export type PainCardStatus =
  | "draft"
  | "in_progress"
  | "structured"
  | "pending_interview"
  | "archived_fake";

export type TrizId = 1 | 2 | 3 | 4 | 5 | 6;

export type TrizLabel =
  | "想快但又想做得好"
  | "想客製化但又想規模化"
  | "想快但又想正確"
  | "想很專業但又想新手好上手"
  | "想自動化但又怕失控"
  | "想多嘗試但又怕出包";

export type AiTool = "chatgpt_dr" | "claude" | "perplexity" | "gemini";

export type Score = 1 | 2 | 3 | 4 | 5;

export type Judgment = "true_pain" | "fake_pain" | "pending_interview";

export type NextAction = "interview" | "more_evidence" | "change_topic";

export type CurrentStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type PainCard = {
  // === Meta ===
  id: string;
  schema_version: "1.0";
  status: PainCardStatus;
  created_at: string;
  updated_at: string;
  current_step: CurrentStep;

  // === Card 1: 抱怨原句 ===
  complaint: {
    verbatim: string;
    source_name: string;
    source_relation: string;
    datetime: string;
    scene: string;
  };

  // === Card 2: 三個有名字的人 ===
  people: {
    background: string;
    list: Array<{
      name: string;
      contact: string;
      relation: string;
    }>;
  };

  // === Card 3: 卡關公式 ===
  stuck_formula: {
    user_draft: string;
    ai_polished: string | null;
    ai_clarifying_questions: string[];
    confirmed: boolean;
  };

  // === Card 4: 現在怎麼解 ===
  workaround: {
    tool_name: string;
    why_still_stuck: string;
    ai_alternatives: string[];
    user_dissatisfactions: string[];
  };

  // === Card 5: 兩件事不能同時要 (TRIZ) ===
  contradiction: {
    triz_id: TrizId | null;
    triz_label: TrizLabel | null;
    side_a: string;
    side_b: string;
    sacrificed: "a" | "b" | null;
  };

  // === Card 6: AI 證據蒐集 ===
  ai_evidence: {
    ai_tool: AiTool | null;
    ai_tool_reason: string;
    raw_response: string;
    eight_answers: {
      q1_specific_groups: string;
      q2_scenes_frequency: string;
      q3_workarounds: string;
      q4_dissatisfactions_categorized: string;
      q5_public_evidence: string;
      q6_jtbd: string;
      q7_possible_fake_pains: string;
      q8_interview_targets: string;
    };
    no_solution_check_passed: boolean;
  };

  // === Card 7: 自己先猜 + 讀 AI ===
  self_guess: {
    guesses: {
      most_painful_person: string;
      most_common_scene: string;
      biggest_dissatisfaction: string;
      possible_fake_pain: string;
    };
    ai_checkpoints_passed: {
      people_segmented: boolean;
      scenes_observable: boolean;
      workaround_dissatisfactions_listed: boolean;
      fake_pains_flagged: boolean;
    };
    pain_judgment_table: string;
    deltas: {
      biggest_diff: string;
      ai_added: string;
      guess_unsupported: string;
    };
    phase_a_completed_at?: string | null;
  };

  // === Card 8: 真人訪談規劃 ===
  interview_plan: {
    targets: Array<{
      persona: string;
      contact_known: boolean;
      contact_info: string;
      planned_time: string;
    }>;
    questions: string[];
    interview_taboos_understood: boolean;
    ai_simulated_response: string | null;
  };

  // === Card 9: Pain Quality Score + 真假判斷 ===
  // 注意：scores 僅教學模式內部使用，正式輸出禁止顯示
  verdict: {
    scores: {
      people_specificity: Score | null;
      frequency: Score | null;
      intensity: Score | null;
      workaround_dissatisfaction: Score | null;
      evidence_credibility: Score | null;
    };
    total_score: number | null;
    judgment: Judgment | null;
    reason_100w: string;
    most_confident_evidence: string;
    least_confident: string;
    next_action: NextAction | null;
  };

  // === Card 10: 痛點身份證匯出 ===
  exported: {
    exported_at: string | null;
    formats: Array<"markdown" | "json" | "pdf">;
    last_review_at: string | null;
  };
};

export const SCHEMA_VERSION = "1.0" as const;

export const STEP_LABELS: Record<CurrentStep, string> = {
  1: "抱怨",
  2: "人物",
  3: "公式",
  4: "解法",
  5: "矛盾",
  6: "證據",
  7: "自猜",
  8: "訪談",
  9: "判斷",
  10: "身份證",
};

export const STEP_TITLES: Record<CurrentStep, string> = {
  1: "抱怨原句",
  2: "三個有名字的人",
  3: "卡關公式",
  4: "現在怎麼解",
  5: "兩件事不能同時要",
  6: "AI 證據蒐集",
  7: "自己先猜 + 讀 AI",
  8: "真人訪談規劃",
  9: "真假判斷",
  10: "痛點身份證",
};
