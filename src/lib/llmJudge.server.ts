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

/**
 * 通用前綴：明示判定範圍跨領域、不偏特定產業 / 工具 / 國別 / 商業模式。
 * 所有 8 個 judge 共享這段，避免 LLM 因範例選擇而偏向某類情境。
 */
const DOMAIN_AGNOSTIC_PREFIX = `# 判定範圍（重要）
你判定的內容**不限特定產業、場景、地區或商業模式**。可能的案例包括但不限於：
- 教育、醫療、零售、餐飲、製造、農業、傳產、物流、家事、寵物、藝術、宗教、運動、政府、NGO
- 痛點主人翁可能是：個人 / 家庭主婦 / 小店主 / 員工 / 自由業 / 創作者 / 組織決策者 / 學生 / 客戶
- 「他現在怎麼解」可能是：數位工具 (App/SaaS) / 紙本流程 / 電話 / 面對面 / 手寫筆記 / 找人幫忙 / 自製 Excel / 完全沒解
- **不要假設情境必定是 SaaS / B2C / 數位 / 都市 / 台灣**

請依「判定原則」純粹從文字內容判斷，不要因為案例不像「典型科技創業情境」就 warn。`;

const RESPONSE_FORMAT = `\n\n# 回應規則
- 只能輸出 JSON，格式：{"verdict": "pass" | "warn", "reason": "<一句話、繁中、≤80 字>"}
- 不要 markdown、不要前後說明。`;

function buildPrompt(kind: JudgeKind, text: string, context?: string): string {
  switch (kind) {
    case "card1.analysis_words":
      return `${DOMAIN_AGNOSTIC_PREFIX}

# 任務
審視使用者寫下的「抱怨原句」。

# 判定原則
這段文字是**忠實複述當事人原話**，還是摻入了使用者自己的解釋 / 推測 / 分析？
- 摻入「我覺得 / 應該 / 可能 / 似乎 / 大概 / 或許」這類推測詞 → warn
- 直接引述他人說的話（即使含「他覺得」「他說可能」也算 pass，因為是描述他的話）→ pass

# 跨領域範例
- pass：「他在診間說『我吃這個藥三個月還是失眠』」（醫療）
- pass：「她抱怨『每次客人多就忙不過來』」（餐飲）
- pass：「老闆說『機台壞了找不到人修』」（製造）
- warn：「我覺得家長應該都很煩寫訊息」（使用者推測，非引述）
- warn：「可能客人都很在意等候時間」（使用者推測）

# 輸入
「${text}」${RESPONSE_FORMAT}`;

    case "card1.forbidden_source_name":
      return `${DOMAIN_AGNOSTIC_PREFIX}

# 任務
審視使用者填的「抱怨來源人名」。

# 判定原則
這個名字是否指向**一個具體可聯絡的真人**（含化名 / 暱稱 / 代號）？
- 具體姓名 / 暱稱 / 親屬稱呼（連帶上下文） → pass
- 泛稱、群體名、抽象代詞 → warn

# 跨領域範例
- pass：「林老師」「王醫師」「Eric」「Mary」「老陳」「阿明阿姨」「房東」「我表妹」
- warn：「現代人」「上班族」「大家」「很多人」「某人」「他們」「客戶群」

# 輸入
「${text}」${RESPONSE_FORMAT}`;

    case "card2.background_specific":
      return `${DOMAIN_AGNOSTIC_PREFIX}

# 任務
審視「目標族群的背景描述」是否具體。

# 判定原則
是否有 ≥ 2 個可定位的具體屬性？屬性類別**不限**「年齡 / 職業 / 地點」三類，只要能讓人聯想到「這是誰、在哪、做什麼」即算具體。可接受的屬性包括：
- 年齡 / 世代（30 歲、八年級生、退休族）
- 職業 / 角色（補習班老師、急診醫師、麵包師、自由攝影師、村長、家庭主婦）
- 規模 / 階段（中小企業、剛開店第一年、創業前 90 天）
- 地點 / 區域（台北、南投山區、Tokyo、海外華僑、東南亞工廠）
- 場景 / 動作（每週要做家長溝通、每月要報稅、每天接送小孩）
- 組織型角色（醫院門診部、品牌社群小編、教會主日學老師）

只要 ≥ 2 類具體屬性即 pass。

# 跨領域範例
- pass：「30-50 歲台灣補習班數學老師、每週要做家長溝通」
- pass：「南投有機小農、每年只有 2 次外銷出貨」
- pass：「中小企業會計、每月底要對五家銀行帳」
- pass：「都會區單親媽、孩子 3-6 歲、上班通勤 1 小時」
- pass：「30 歲剛接手家裡麵包店的二代」（年齡 + 角色 + 階段）
- warn：「年輕人」「上班族」「大家」「現代人」「客戶」（單一泛稱）

# 輸入
「${text}」${RESPONSE_FORMAT}`;

    case "card2.forbidden_person_name":
      return `${DOMAIN_AGNOSTIC_PREFIX}

# 任務
審視「人名」是否指向具體真人。

# 判定原則
是否能聯想到**一個具體可指認的人**（含化名 / 暱稱 / 代號）？
- 具體姓名、暱稱、化名 → pass
- 純編號代稱、泛稱、抽象代詞 → warn

# 跨領域範例
- pass：「林老師」「王醫師」「Eric」「Mary」「老陳」「阿明阿姨」「Sarah from accounting」
- warn：「老師 A」「同學 B」「persona 1」「user 2」「某老師」「那位醫師」「客戶 1 號」

# 輸入
「${text}」${RESPONSE_FORMAT}`;

    case "card4.tool_is_real_attempt":
      return `${DOMAIN_AGNOSTIC_PREFIX}

# 任務
審視「主人翁現在用什麼方法解這個問題」。

# 判定原則
他描述的是**真的有花時間 / 心力 / 金錢在做的具體方法**（不論數位或非數位），還是消極無作為？
- 任何具體可描述的「動作 / 工具 / 流程」都算 pass，**不限數位工具**
- 只有「沒解 / 沒想過 / 算了 / 忍著 / 自己想辦法（沒下文）」這類消極語才 warn

# 跨領域範例（pass — 真的在解，不論工具類型）
- 數位：「LINE + Excel 模板」「Notion 試了 1 個月」「自寫的 Python 腳本」
- 非數位：「自己手寫筆記本」「找鄰居幫忙顧店」「打電話給原廠」「每週去市場跟農夫聊」
- 混合：「找了個 freelance、再用 Google Sheets 追進度」
- 內建功能：「就用 LINE 群組廣播」（即使簡陋，仍是「方法」）

# 跨領域範例（warn — 沒在解）
- 「沒人解過」「自己想辦法（沒說怎麼想）」「用想的」「忍著」「算了不管」
- 「他還沒花時間在這上面」（明確表態不投入）

# 輸入
「${text}」
${context ? `他為什麼還是覺得卡：「${context}」` : ""}${RESPONSE_FORMAT}`;

    case "card4.dissatisfactions_concrete":
      return `${DOMAIN_AGNOSTIC_PREFIX}

# 任務
審視「主人翁不滿現有解法的理由」是否具體。

# 判定原則
每個理由是否寫到**具體的後果 / 時長 / 步驟 / 情境 / 數字**？還是孤立的抽象形容詞？
- 含具體後果或量化（時間、頻率、金額、發生情境）→ pass
- 只有抽象形容詞（不好用、不方便、麻煩、不爽、卡卡的、效果差）→ warn

# 跨領域範例（pass — 寫到具體後果）
- 數位：「Notion 試 1 個月放棄，太花時間貼來貼去」
- 服務業：「找代工常做不到精度，每次都要重做、平均多花 2 週」
- 醫療：「自己寫衛教單，每個病人問同樣的問題，1 天解釋 5 遍」
- 製造：「每週手工盤點 3 小時，月底還是對不出來」
- 客服：「用罐頭訊息回，客人一看就知道、續約率掉 20%」

# 跨領域範例（warn — 抽象空話）
- 孤立出現的「不好用」「不方便」「麻煩」「不爽」「卡卡的」「不順手」「效果差」（沒接具體後果）

# 輸入（每行一個理由）
${text}${RESPONSE_FORMAT}`;

    case "card6.no_solution_push":
      return `${DOMAIN_AGNOSTIC_PREFIX}

# 任務
審視 AI 給的回覆是否進入「設計解決方案 / 推銷做生意」模式。

# 判定原則
回覆是否出現「建議他做某種解決方案、開始談變現方式、推測市場機會、規劃產品」這類**從探索痛點切換到設計產品/服務**的內容？
- 注意：解決方案不只指數位產品。也包含「你應該開實體店」「辦講座」「賣顧問服務」「做品牌」「收會員費」等
- 純粹**列現況 / 列證據 / 列他人 workaround / 列假痛點疑慮 / 列訪談對象** → pass
- 開始**建議做產品、設計商業模式、估算市場規模、講變現策略** → warn

# 跨領域範例（pass — 純探索）
- 「以下是 5 種常見 workaround：A、B、C、D、E」
- 「PTT 親子板有 3 篇相關 thread；Dcard 有 5 則」
- 「可能假痛點：他其實已經接受現狀、家長也不在意」

# 跨領域範例（warn — 開始推銷做產品）
- 「建議製作一個 App / 做 SaaS / MVP 規劃 / 變現模式」
- 「你應該開一家店 / 做品牌 / 辦工作坊變現」
- 「市場機會很大 / 月活躍用戶估算 / 訂閱方案 / TAM 分析」
- 「你可以收 XX 元 / 定價 / 收會員費 / 接案模式」

# 輸入
「${text}」${RESPONSE_FORMAT}`;

    case "card8.no_selling_questions":
      return `${DOMAIN_AGNOSTIC_PREFIX}

# 任務
審視「訪談題」是否誘導 / 推銷。

# 判定原則
題目是否在**推銷預設解法、假設受訪者會付錢、用二選一框架、問「會不會用」這類假設性問題**？
- 開放式 / 回顧具體經驗 / 詢問現況與不滿 → pass
- 推銷感（「你會買嗎」「會用嗎」「如果有 X」）/ 定價問題（「願意花多少錢」） → warn

# 跨領域範例（pass — 開放回顧型）
- 「你最近一次怎麼處理這件事？花了多久？」
- 「你現在用什麼方法？哪一步最費時間？」
- 「你寫完 / 做完 / 完成後最不滿意自己的是什麼？」
- 「你嘗試過哪些方式？為什麼放棄？」

# 跨領域範例（warn — 推銷誘導）
- 「你會付多少錢」「會花錢買嗎」「願意花多少」「定價多少合理」
- 「會用 App 嗎」「如果有 X 你會用嗎」「你需要這個功能嗎」
- 「我有一個想法是 ___，好不好？」（推銷自己的解法）
- 「比較喜歡 A 還是 B？」（二選一框架，限制了他的真實狀況）

# 輸入（每行一題）
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
