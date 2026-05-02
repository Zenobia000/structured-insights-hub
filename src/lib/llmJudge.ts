/**
 * llmJudge.ts — Client-side wrapper for LLM 語意判定
 *
 * 職責：
 * - 包裝 server function `judgeWithLLM` 的呼叫
 * - 走 PainCard.llm_cache 避免重複呼叫（key = JudgeKind）
 * - LLM 失敗 / timeout 時 caller 自行 fallback to hardcoded validator
 *
 * 介面設計：
 * - 統一回傳 { verdict: "pass"|"warn"|"fallback", reason: string }
 * - "fallback" 表示 LLM 無結果，caller 應退到既有 hardcoded 邏輯
 */
import { judgeWithLLM } from "@/lib/llmJudge.server";
import type { JudgeKind, LLMVerdict } from "@/lib/llmJudgeSchemas";

export type JudgeOutcome =
  | { source: "llm"; verdict: "pass" | "warn"; reason: string; input_hash: string }
  | { source: "cache"; verdict: "pass" | "warn"; reason: string; input_hash: string }
  | { source: "fallback"; reason: string; input_hash: string };

export type LLMCacheEntry = {
  input_hash: string;
  verdict: "pass" | "warn";
  reason: string;
  judged_at: string;
};

export type LLMCache = Record<string, LLMCacheEntry>;

/** 同步：檢查 cache 是否命中（caller 在送 server function 前先試這個） */
export function lookupCache(
  cache: LLMCache | undefined,
  kind: JudgeKind,
  expectedHash: string,
): LLMCacheEntry | null {
  if (!cache) return null;
  const entry = cache[kind];
  if (!entry) return null;
  if (entry.input_hash !== expectedHash) return null;
  return entry;
}

/**
 * 主要呼叫 — async。
 * - 先試 cache
 * - 沒命中 → call server function
 * - server 失敗 → 回 fallback 讓 caller 跑 hardcoded
 */
export async function judge(
  kind: JudgeKind,
  text: string,
  context?: string,
  cache?: LLMCache,
): Promise<JudgeOutcome> {
  // Hash 在 client 端先算（與 server 端用相同 algorithm 確保 cache 對得上）
  const composed = `${kind}::${text}::${context ?? ""}`;
  const input_hash = await sha256Hex(composed);

  const hit = lookupCache(cache, kind, input_hash);
  if (hit) {
    return {
      source: "cache",
      verdict: hit.verdict,
      reason: hit.reason,
      input_hash,
    };
  }

  try {
    const res = await judgeWithLLM({ data: { kind, text, context } });
    if (res.ok && res.verdict) {
      const v: LLMVerdict = res.verdict;
      return {
        source: "llm",
        verdict: v.verdict,
        reason: v.reason,
        input_hash: res.input_hash,
      };
    }
    return {
      source: "fallback",
      reason: res.error ?? "llm_unavailable",
      input_hash: res.input_hash,
    };
  } catch (err) {
    const reason = err instanceof Error ? err.message : "client_error";
    return { source: "fallback", reason, input_hash };
  }
}

/** Build cache entry from a successful LLM/cache outcome (for store update) */
export function toCacheEntry(outcome: JudgeOutcome): LLMCacheEntry | null {
  if (outcome.source === "fallback") return null;
  return {
    input_hash: outcome.input_hash,
    verdict: outcome.verdict,
    reason: outcome.reason,
    judged_at: new Date().toISOString(),
  };
}

// ─── crypto.subtle SHA-256 (browser & node 20+ 都支援) ──────────────────────

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
