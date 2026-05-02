/**
 * llmJudge.server.ts — Server-only LLM 語意判定（TanStack Server Function）
 *
 * 本檔執行時機：Cloudflare Workers runtime（部署後）/ vite-node SSR（本地 dev）。
 * 永遠 server-side，OpenAI key 與內部邏輯絕不進 client bundle。
 *
 * 設計原則：
 * - 8 個 judge 共用同一個 server function（dispatch by `kind`）
 * - 每次呼叫獨立、無狀態（rate limit 走 in-memory map，重啟 reset — POC 階段足夠）
 * - 4 秒 timeout；任何錯誤回 ok:false，由 client wrapper 退到 hardcoded fallback
 * - **不存使用者輸入原文上後端**，只回 verdict + reason；client 自己 hash + cache
 */
import { createServerFn } from "@tanstack/react-start";
import OpenAI from "openai";

import { JudgeRequestSchema, type JudgeKind, type JudgeResponse } from "@/lib/llmJudgeSchemas";

// ─── Env access (cross-runtime safe) ────────────────────────────────────────

function getEnv(key: string): string | undefined {
  // Node / vite-node SSR
  if (typeof process !== "undefined" && process.env) {
    const v = process.env[key];
    if (v) return v;
  }
  // Cloudflare Workers — env injected on globalThis by some adapters
  const g = globalThis as Record<string, unknown>;
  const v = g[key];
  return typeof v === "string" ? v : undefined;
}

// ─── Rate limit (in-memory; per-instance) ───────────────────────────────────

type Bucket = { minuteCount: number; minuteResetAt: number; dayCount: number; dayResetAt: number };
const buckets = new Map<string, Bucket>();

function rateLimit(ip: string): { allowed: boolean; reason?: string } {
  const now = Date.now();
  const perMin = Number(getEnv("LLM_RATE_LIMIT_PER_MIN") ?? "10");
  const perDay = Number(getEnv("LLM_RATE_LIMIT_PER_DAY") ?? "1000");

  let b = buckets.get(ip);
  if (!b) {
    b = { minuteCount: 0, minuteResetAt: now + 60_000, dayCount: 0, dayResetAt: now + 86_400_000 };
    buckets.set(ip, b);
  }
  if (now > b.minuteResetAt) {
    b.minuteCount = 0;
    b.minuteResetAt = now + 60_000;
  }
  if (now > b.dayResetAt) {
    b.dayCount = 0;
    b.dayResetAt = now + 86_400_000;
  }
  if (b.minuteCount >= perMin) return { allowed: false, reason: "rate_limit_minute" };
  if (b.dayCount >= perDay) return { allowed: false, reason: "rate_limit_day" };
  b.minuteCount++;
  b.dayCount++;
  return { allowed: true };
}

// ─── Hashing (Web Crypto, runtime-agnostic) ─────────────────────────────────

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ─── Prompt builders ────────────────────────────────────────────────────────

function buildPrompt(kind: JudgeKind, text: string, context?: string): string {
  const RESPONSE_FORMAT = `\n\n回應規則：
- 只能輸出 JSON，格式：{"verdict": "pass" | "warn", "reason": "<一句話、繁中、≤80 字>"}
- 不要 markdown、不要前後說明。`;

  switch (kind) {
    case "card1.analysis_words":
      return `你在審視使用者寫下的「抱怨原句」。
判定準則：這段文字是否摻入了**使用者自己的解釋 / 推測 / 分析**（如「我覺得」「應該」「可能」「似乎」「大概」），而非忠實複述當事人原話？
- 若是「忠實複述他人原話」→ verdict: pass
- 若摻入了使用者自己的分析詞 → verdict: warn，reason 指出哪幾個字眼有問題

輸入：「${text}」${RESPONSE_FORMAT}`;

    case "card1.forbidden_source_name":
      return `你在審視使用者填的「抱怨來源人名」。
判定準則：這個名字是否是**具體可聯絡的真人姓名**（含化名）？
- 若是具體姓名（不論是否真名）→ verdict: pass
- 若是泛稱（「現代人」「上班族」「大家」「很多人」「某人」）→ verdict: warn

輸入：「${text}」${RESPONSE_FORMAT}`;

    case "card2.background_specific":
      return `你在審視「目標族群的背景描述」是否具體。
判定準則：是否含有 ≥ 2 個可定位的具體屬性（年齡 / 職業 / 地點 / 工作場景 / 角色）？
- 「30-50 歲、台灣補習班數學老師」→ pass（年齡 + 職業 + 地點）
- 「30 歲做麵包的」→ pass（年齡 + 職業）
- 「資深 SaaS 產品經理 in Tokyo」→ pass（職業 + 地點）
- 「年輕人」「上班族」「大家」「現代人」→ warn（過於泛稱）

輸入：「${text}」${RESPONSE_FORMAT}`;

    case "card2.forbidden_person_name":
      return `你在審視「人名」是否是真人。
判定準則：是否是**具體可指認的真人姓名**（含化名）？
- 「林老師」「Eric」「Mary」「老陳」→ pass
- 「老師 A」「同學 B」「persona 1」「user 2」「某老師」「那位老師」→ warn

輸入：「${text}」${RESPONSE_FORMAT}`;

    case "card4.tool_is_real_attempt":
      return `你在審視「主人翁現在用什麼方法解這個問題」。
判定準則：他描述的是**真的有花時間在做的具體方法**，還是消極回答（沒人解過、自己想辦法、用想的、忍著）？
- 若是具體工具/流程/做法（「LINE + Excel 模板」「Notion 試了 1 個月」）→ pass
- 若是「沒解 / 沒想過 / 自己想辦法 / 忍著 / 算了」這類消極語 → warn（代表他可能還不夠痛）

輸入：「${text}」
${context ? `他為什麼還是覺得卡：「${context}」` : ""}${RESPONSE_FORMAT}`;

    case "card4.dissatisfactions_concrete":
      return `你在審視「主人翁不滿現有解法的理由」是否具體。
判定準則：每個理由是否寫到**具體的後果 / 時長 / 步驟 / 情境**？還是抽象詞彙（「不好用」「不方便」「麻煩」「不爽」「卡卡的」）？
- 「Notion 試 1 個月放棄，太花時間貼來貼去」→ pass
- 「ChatGPT 訊息太罐頭、家長一看就知道」→ pass
- 「不好用」「不方便」「麻煩」（孤立出現）→ warn

輸入（每行一個理由）：
${text}${RESPONSE_FORMAT}`;

    case "card6.no_solution_push":
      return `你在審視 AI 給的回覆是否進入**設計產品 / 推銷解法**模式。
判定準則：回覆是否出現「建議製作 App / 你應該開發 / SaaS 機會 / MVP 規劃 / 變現模式 / 市場機會 / 你可以收費」這類往「做產品」方向走的內容？
- 純粹列現況、列證據、列 workaround → pass
- 開始建議做產品 / 商業模式 / 訂閱方案 → warn

輸入：「${text}」${RESPONSE_FORMAT}`;

    case "card8.no_selling_questions":
      return `你在審視「3 道訪談題」是否誘導 / 推銷。
判定準則：題目是否在**推銷預設解法 / 假設使用者會付錢 / 二選一框架**？
- 「你最近一次怎麼處理這件事」「你現在用什麼方法」「為什麼還是覺得卡」→ pass（開放、回顧、具體）
- 「你會付多少錢」「會用 App 嗎」「如果有 X 你會買嗎」「願意花多少錢」→ warn

輸入（每行一題）：
${text}${RESPONSE_FORMAT}`;
  }
}

// ─── Server Function ────────────────────────────────────────────────────────

export const judgeWithLLM = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => JudgeRequestSchema.parse(input))
  .handler(async ({ data }): Promise<JudgeResponse> => {
    const { kind, text, context } = data;
    const composed = `${kind}::${text}::${context ?? ""}`;
    const input_hash = await sha256Hex(composed);

    // Rate limit — Cloudflare 環境可從 request 拿 IP；fallback 用 "default"
    // POC：所有請求共用同一 bucket（不夠精確，但夠用）
    const ip = "default";
    const rl = rateLimit(ip);
    if (!rl.allowed) {
      return { ok: false, verdict: null, input_hash, error: rl.reason ?? "rate_limit" };
    }

    const apiKey = getEnv("OPENAI_API_KEY");
    if (!apiKey) {
      return { ok: false, verdict: null, input_hash, error: "no_key" };
    }

    const model = getEnv("OPENAI_MODEL") ?? "gpt-4o-mini";
    const prompt = buildPrompt(kind, text, context);

    try {
      const client = new OpenAI({ apiKey });
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 4000);
      const completion = await client.chat.completions.create(
        {
          model,
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          max_tokens: 200,
          temperature: 0.1,
        },
        { signal: controller.signal },
      );
      clearTimeout(timer);

      const raw = completion.choices[0]?.message?.content?.trim();
      if (!raw) return { ok: false, verdict: null, input_hash, error: "empty_response" };

      let parsed: { verdict?: string; reason?: string };
      try {
        parsed = JSON.parse(raw);
      } catch {
        return { ok: false, verdict: null, input_hash, error: "parse_error" };
      }

      const verdict = parsed.verdict === "pass" ? "pass" : "warn";
      const reason = String(parsed.reason ?? "").slice(0, 500) || "（AI 未提供理由）";
      return { ok: true, verdict: { verdict, reason }, input_hash, error: null };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "openai_error";
      console.error("[llmJudge] failed:", msg);
      return {
        ok: false,
        verdict: null,
        input_hash,
        error: msg.includes("aborted") ? "timeout" : "openai_error",
      };
    }
  });
