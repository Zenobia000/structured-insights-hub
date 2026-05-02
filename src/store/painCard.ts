/**
 * PainCard zustand store — LocalStorage 持久化層
 *
 * MVP 階段：
 * - 全部資料在 LocalStorage（key: painmap-worksheet-v1）
 * - 無雲端同步、無帳號系統
 * - Schema migration 預留 hook，目前只有 v1.0
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

const STORAGE_KEY = "painmap-worksheet-v1";

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
      triz_id: null,
      triz_label: null,
      side_a: "",
      side_b: "",
      sacrificed: null,
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
      scores: {
        people_specificity: null,
        frequency: null,
        intensity: null,
        workaround_dissatisfaction: null,
        evidence_credibility: null,
      },
      total_score: null,
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
 * 例：updateField("complaint.verbatim", "我每週六晚上要寫家長訊息...")
 */
function setByPath<T extends Record<string, unknown>>(
  obj: T,
  path: string,
  value: unknown,
): T {
  const keys = path.split(".");
  const next = structuredClone(obj);
  let cursor: Record<string, unknown> = next as Record<string, unknown>;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (typeof cursor[key] !== "object" || cursor[key] === null) {
      cursor[key] = {};
    }
    cursor = cursor[key] as Record<string, unknown>;
  }
  cursor[keys[keys.length - 1]] = value;
  return next;
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
          if (
            ![1, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(nextStep as number)
          ) {
            throw new Error(`invalid nextStep: ${String(nextStep)}`);
          }
          // 3. 驗證 status / nextStep 一致性：判定後一定要走到第 10 卡
          if (
            (status === "structured" ||
              status === "pending_interview" ||
              status === "archived_fake") &&
            nextStep !== 10
          ) {
            throw new Error(
              `verdict status "${status}" requires nextStep=10, got ${nextStep}`,
            );
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
          const message =
            err instanceof Error ? err.message : "commitVerdict failed";
          // eslint-disable-next-line no-console
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
        return localStorage;
      }),
      version: 1,
      // 預留 migration hook（目前只有 v1）
      migrate: (persistedState, _version) => persistedState as PainCardStore,
      onRehydrateStorage: () => (state) => {
        if (state) {
          const sf = state.card?.stuck_formula as
            | (typeof state.card.stuck_formula & { user_draft?: string })
            | undefined;
          if (sf) {
            // Backfill: ai_clarifying_answers (added later)
            if (!Array.isArray(sf.ai_clarifying_answers)) {
              const questions = sf.ai_clarifying_questions ?? [];
              const wasConfirmed = sf.confirmed === true;
              sf.ai_clarifying_answers = questions.map((q) => ({
                question: q,
                answer: "",
                // 舊使用者已勾選 confirmed → 全部當作「已預約找主人翁問」（最寬鬆，不擋繼續）
                reserved: wasConfirmed,
              }));
            }
            // Migration: 移除 user_draft；若 ai_polished 為空，把 user_draft 內容搬過去
            if (typeof sf.user_draft === "string") {
              if (!sf.ai_polished && sf.user_draft.trim().length > 0) {
                sf.ai_polished = sf.user_draft;
              }
              delete sf.user_draft;
            }
          }
          state.hydrated = true;
        }
      },
    },
  ),
);
