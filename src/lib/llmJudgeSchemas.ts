/**
 * llmJudgeSchemas — LLM 語意判定共用型別 + zod schema
 *
 * 8 個 judge 全部共用「pass / warn」二態結果 + 一句話 reason，
 * 與既有 hardcoded validators 的 CheckStatus 體系銜接（warn = 不 pass）。
 */
import { z } from "zod";

/** LLM 判定結果（成功時的 payload） */
export const LLMVerdictSchema = z.object({
  verdict: z.enum(["pass", "warn"]),
  reason: z.string().min(1).max(500),
});

export type LLMVerdict = z.infer<typeof LLMVerdictSchema>;

/** 全部 judge 種類（用於 cache key 與 server-side dispatch） */
export const JudgeKindSchema = z.enum([
  "card1.analysis_words", // 抱怨原句是否摻分析語
  "card1.forbidden_source_name", // source_name 是否泛稱
  "card2.background_specific", // 背景具體性
  "card2.forbidden_person_name", // person.name 是否代稱
  "card4.tool_is_real_attempt", // workaround tool 是否真在解
  "card4.dissatisfactions_concrete", // 不滿理由具體性
  "card6.no_solution_push", // AI 回覆是否推銷
  "card8.no_selling_questions", // 訪談題是否誘導 / 推銷
  // Card 9 紅隊 audit — 鐵律例外：使用者主動觸發、僅供參考、絕不阻擋
  // 判斷 reason_100w 是否與前面 8 卡證據一致；不替使用者下任何判斷。
  "card9.verdict_audit",
]);

export type JudgeKind = z.infer<typeof JudgeKindSchema>;

/** Server function 入口 payload */
export const JudgeRequestSchema = z.object({
  kind: JudgeKindSchema,
  /** 主要待判文字（用於 prompt 內主體） */
  text: z.string().min(1).max(4000),
  /** 額外脈絡（card 4 需要 toolName + whyStuck，card 8 需要 questions[] join） */
  context: z.string().max(2000).optional(),
});

export type JudgeRequest = z.infer<typeof JudgeRequestSchema>;

/** Server function 回應 — verdict + 給 client 寫 cache 用的 hash */
export const JudgeResponseSchema = z.object({
  ok: z.boolean(),
  verdict: LLMVerdictSchema.nullable(),
  /** SHA-256 of (kind || text || context)，client cache 用 */
  input_hash: z.string(),
  /** 失敗時的錯誤代碼（rate_limit / timeout / openai_error / no_key） */
  error: z.string().nullable(),
});

export type JudgeResponse = z.infer<typeof JudgeResponseSchema>;
