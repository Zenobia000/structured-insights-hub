/**
 * PainCard zustand store — LocalStorage 持久化層 (v2.0 蘇格拉底重構)
 *
 * - 全部資料在 LocalStorage（key: painmap-worksheet-v2）
 * - POC 模式：v1 資料不相容，直接 reset；persist version=3 + 新 key 雙保險
 * - 無雲端同步、無帳號系統
 *
 * 此 store 只負責「資料存取」，不負責：
 * - Exit gate 驗證邏輯（由各頁面實作）
 * - AI 呼叫（由 AI Prompt Copy Block 元件處理）
 */

import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { CurrentStep, PainCard, PainCardStatus } from "@/types/painCard";
import { SCHEMA_VERSION } from "@/types/painCard";

const STORAGE_KEY = "painmap-worksheet-v2";
const PERSIST_THROTTLE_MS = 500;

/**
 * Throttled localStorage：合併 keystroke 期間的 setItem 呼叫，
 * 避免每按一字就同步序列化整張 card 寫 localStorage（main thread 阻塞主因）。
 *
 * - getItem/removeItem：透傳，不改語意（hydration 仍同步）
 * - setItem：trailing-edge throttle，500ms 內只寫最後一次；
 *   pagehide/beforeunload 時 flush 最終值，避免遺失
 */
const throttledLocalStorage: Storage = (() => {
  // 真正的 storage instance 在 SSR-safe 守衛裡才 dereference
  const real = typeof window !== "undefined" ? window.localStorage : null;
  let timer: ReturnType<typeof setTimeout> | null = null;
  const pending = new Map<string, string>();

  const flush = () => {
    if (!real) return;
    for (const [key, value] of pending) {
      try {
        real.setItem(key, value);
      } catch (err) {
        // QuotaExceeded 等錯誤靜默處理，避免 throttle timer 卡死

        console.error("[painCard persist] setItem failed:", err);
      }
    }
    pending.clear();
    timer = null;
  };

  if (typeof window !== "undefined") {
    // 確保關頁/切頁前最後一次寫入
    window.addEventListener("pagehide", flush);
    window.addEventListener("beforeunload", flush);
  }

  return {
    get length() {
      return real?.length ?? 0;
    },
    clear() {
      pending.clear();
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      real?.clear();
    },
    getItem(key) {
      // 若有 pending 寫入，回傳最新值（保證 read-your-write 一致性）
      if (pending.has(key)) return pending.get(key) ?? null;
      return real?.getItem(key) ?? null;
    },
    key(index) {
      return real?.key(index) ?? null;
    },
    removeItem(key) {
      pending.delete(key);
      real?.removeItem(key);
    },
    setItem(key, value) {
      pending.set(key, value);
      if (timer) return;
      timer = setTimeout(flush, PERSIST_THROTTLE_MS);
    },
  };
})();

function emptyPainCard(): PainCard {
  const now = new Date().toISOString();
  return {
    id: uuidv4(),
    schema_version: SCHEMA_VERSION,
    status: "draft",
    created_at: now,
    updated_at: now,
    current_step: 1,

    complaint: {
      verbatim: "",
      source_name: "",
      source_relation: "",
      datetime: "",
      scene: "",
    },

    people: {
      background: "",
      list: [],
    },

    stuck_formula: {
      ai_polished: null,
      ai_clarifying_questions: [],
      ai_clarifying_answers: [],
      confirmed: false,
    },

    workaround: {
      tool_name: "",
      why_still_stuck: "",
      ai_alternatives: [],
      user_dissatisfactions: [],
    },

    contradiction: {
      side_a: "",
      side_b: "",
      sacrificed: null,
      sacrificed_reason: "",
    },

    ai_evidence: {
      ai_tool: null,
      ai_tool_reason: "",
      raw_response: "",
      eight_answers: {
        q1_specific_groups: "",
        q2_scenes_frequency: "",
        q3_workarounds: "",
        q4_dissatisfactions_categorized: "",
        q5_public_evidence: "",
        q6_jtbd: "",
        q7_possible_fake_pains: "",
        q8_interview_targets: "",
      },
      no_solution_check_passed: false,
    },

    self_guess: {
      guesses: {
        most_painful_person: "",
        most_common_scene: "",
        biggest_dissatisfaction: "",
        possible_fake_pain: "",
      },
      ai_checkpoints_passed: {
        people_segmented: false,
        scenes_observable: false,
        workaround_dissatisfactions_listed: false,
        fake_pains_flagged: false,
      },
      pain_judgment_table: "",
      deltas: {
        biggest_diff: "",
        ai_added: "",
        guess_unsupported: "",
      },
    },

    interview_plan: {
      targets: [],
      questions: [],
      interview_taboos_understood: false,
      ai_simulated_response: null,
    },

    verdict: {
      judgment: null,
      reason_100w: "",
      most_confident_evidence: "",
      least_confident: "",
      next_action: null,
    },

    exported: {
      exported_at: null,
      formats: [],
      last_review_at: null,
    },
  };
}

/**
 * 用 dot-path 更新巢狀欄位（不可變）。
 * 只 clone 路徑節點，不深拷貝整張物件 — keystroke hot path 必須 O(深度) 而非 O(整張卡)。
 * 例：updateField("complaint.verbatim", "我每週六晚上要寫家長訊息...")
 */
function setByPath<T extends Record<string, unknown>>(obj: T, path: string, value: unknown): T {
  const keys = path.split(".");
  const result: Record<string, unknown> = { ...obj };
  let cursor = result;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const child = cursor[key];
    cursor[key] =
      typeof child === "object" && child !== null
        ? Array.isArray(child)
          ? [...child]
          : { ...child }
        : {};
    cursor = cursor[key] as Record<string, unknown>;
  }
  cursor[keys[keys.length - 1]] = value;
  return result as T;
}

type PainCardStore = {
  card: PainCard;
  hydrated: boolean;
  /** 重新建立一張全新 PainCard（會覆蓋現有資料） */
  createCard: () => void;
  /** 用 dot-path 更新單一欄位 */
  updateField: (path: string, value: unknown) => void;
  /** 前進到第 n 卡，更新 current_step 與 updated_at */
  advanceStep: (step: CurrentStep) => void;
  /** 將 PainCard 標記為 draft（用於卡 2 的「先去找人」退場），不改 current_step */
  markAsDraft: () => void;
  /** 確保 people.list 至少有 N 個空槽（用於卡 2 永遠 3 組） */
  ensurePeopleSlots: (n: number) => void;
  /** 完整重置 */
  reset: () => void;
  /** 取得當前 PainCard 完整快照（用於匯出） */
  exportSnapshot: () => PainCard;
  /**
   * 原子化提交：同時寫入 status + current_step（卡 9 過關用）。
   * 內部對整個 card 做快照，任一步驟失敗就回滾，不留下 status 已改但 step 未進的不一致狀態。
   * 回傳 { ok: true } 或 { ok: false, error }。
   */
  commitVerdict: (input: {
    status: PainCardStatus;
    nextStep: CurrentStep;
  }) => { ok: true } | { ok: false; error: string };
};

export const usePainCardStore = create<PainCardStore>()(
  persist(
    (set, get) => ({
      card: emptyPainCard(),
      hydrated: false,

      createCard: () => {
        set({ card: emptyPainCard() });
      },

      updateField: (path, value) => {
        set((state) => ({
          card: {
            ...setByPath(state.card, path, value),
            updated_at: new Date().toISOString(),
          },
        }));
      },

      advanceStep: (step) => {
        set((state) => ({
          card: {
            ...state.card,
            current_step: step,
            updated_at: new Date().toISOString(),
            status: step >= 9 ? "structured" : "in_progress",
          },
        }));
      },

      markAsDraft: () => {
        set((state) => ({
          card: {
            ...state.card,
            status: "draft",
            updated_at: new Date().toISOString(),
          },
        }));
      },

      ensurePeopleSlots: (n) => {
        set((state) => {
          const list = state.card.people.list;
          if (list.length >= n) return state;
          const filled = [...list];
          while (filled.length < n) {
            filled.push({ name: "", contact: "", relation: "" });
          }
          return {
            card: {
              ...state.card,
              people: { ...state.card.people, list: filled },
            },
          };
        });
      },

      reset: () => {
        set({ card: emptyPainCard() });
      },

      exportSnapshot: () => get().card,

      commitVerdict: ({ status, nextStep }) => {
        // 1. 先做整張卡的快照（深拷貝），用於失敗時回滾
        const snapshot = structuredClone(get().card);
        try {
          // 2. 驗證輸入合法性（防呆，避免寫入無效列舉）
          const validStatuses: PainCardStatus[] = [
            "draft",
            "in_progress",
            "structured",
            "pending_interview",
            "archived_fake",
          ];
          if (!validStatuses.includes(status)) {
            throw new Error(`invalid status: ${String(status)}`);
          }
          if (![1, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(nextStep as number)) {
            throw new Error(`invalid nextStep: ${String(nextStep)}`);
          }
          // 3. 驗證 status / nextStep 一致性：判定後一定要走到第 10 卡
          if (
            (status === "structured" ||
              status === "pending_interview" ||
              status === "archived_fake") &&
            nextStep !== 10
          ) {
            throw new Error(`verdict status "${status}" requires nextStep=10, got ${nextStep}`);
          }

          // 4. 原子寫入：一次 set 同時更新 status + current_step + updated_at
          set((state) => ({
            card: {
              ...state.card,
              status,
              current_step: nextStep,
              updated_at: new Date().toISOString(),
            },
          }));
          return { ok: true };
        } catch (err) {
          // 5. 任何失敗 → 回滾整張卡到提交前的快照
          set({ card: snapshot });
          const message = err instanceof Error ? err.message : "commitVerdict failed";

          console.error("[commitVerdict] rolled back:", message);
          return { ok: false, error: message };
        }
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => {
        // SSR-safe：伺服器端用 noop storage
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => undefined,
            removeItem: () => undefined,
          };
        }
        return throttledLocalStorage;
      }),
      // 只持久化 card；hydrated 是 runtime flag、actions 是函式，都不該寫入 localStorage
      partialize: (state) => ({ card: state.card }),
      version: 3,
      // POC 模式：v1/v2 資料直接拋棄。新 key (painmap-worksheet-v2) 已切割舊資料；
      // 若 zustand 偵測到舊 version 也直接重置而不嘗試遷移。
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    },
  ),
);
