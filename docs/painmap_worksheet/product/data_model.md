# Pain Card 資料模型 (Data Model)

> **此文件為唯一真相源 (Single Source of Truth)。**
> 所有 page spec、API spec、test case 的欄位定義必須與本檔一致。
> 對應 `docs/workshop/painpoint_beginner_worksheet.md` 的 9 張卡片。

---

## 設計原則

1. **單一物件原則**：9 張卡片是 **同一個 PainCard 物件** 的 9 個欄位，不是 9 個獨立資料
2. **不可變更新**：每次卡片填寫產生新的 PainCard 版本（appendOnly），舊版本保留為 history
3. **本地優先**：MVP 階段所有資料存在 LocalStorage，無雲端同步
4. **可匯出**：完整 PainCard 可匯出為 Markdown / JSON / PDF

---

## 完整 Schema (TypeScript)

```typescript
/**
 * PainCard — 痛點身份證
 * v1.0 — 對應 worksheet v1.0 (2026-05-01)
 */
type PainCard = {
  // === Meta ===
  id: string;                     // UUID v4
  schema_version: '1.0';
  status: PainCardStatus;
  created_at: string;             // ISO8601
  updated_at: string;             // ISO8601
  current_step: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;  // 10 = 已匯出

  // === Card 1: 抱怨原句 ===
  complaint: {
    verbatim: string;             // 必填，原句不美化（必須保留以驗證 exit gate）
    source_name: string;          // 必填，誰說的（真名）
    source_relation: string;      // 必填，你跟他的關係
    datetime: string;             // 必填，YYYY-MM-DD 或情境描述
    scene: string;                // 必填，當時他在做什麼
  };

  // === Card 2: 三個有名字的人 ===
  people: {
    background: string;           // 大概是什麼背景（年齡 / 職業 / 地點）
    list: Array<{
      name: string;               // 必填，真名（不可為「補習班老師 A」）
      contact: string;            // 必填，LINE / 電話 / Email 等
      relation: string;           // 必填，你跟他的關係
    }>;                           // length 必須 = 3
  };

  // === Card 3: 卡關公式 ===
  stuck_formula: {
    user_draft: string;           // 使用者自填的「我每次要 X，都會卡在 Y」
    ai_polished: string | null;   // AI 校對後的版本（可選）
    ai_clarifying_questions: string[];  // AI 列出「需要再問清楚」的問題（≥ 0 個）
    confirmed: boolean;           // 使用者是否確認此版本
  };

  // === Card 4: 現在怎麼解 ===
  workaround: {
    tool_name: string;            // 必填，現有工具/方法的名字（具體，不可為「沒人解過」）
    why_still_stuck: string;      // 必填，為什麼還是覺得卡
    ai_alternatives: string[];    // AI 提案的 5 個常見 workaround
    user_dissatisfactions: string[];  // 必須 ≥ 3 個具體不滿理由
  };

  // === Card 5: 兩件事不能同時要 (TRIZ) ===
  contradiction: {
    triz_id: 1 | 2 | 3 | 4 | 5 | 6;   // 必選 1（不可複選）
    triz_label: TrizLabel;             // 對應的中文標籤
    side_a: string;                    // A 端：他想要這個
    side_b: string;                    // B 端：他也想要這個
    sacrificed: 'a' | 'b';             // 通常會犧牲哪一邊
  };

  // === Card 6: AI 證據蒐集 ===
  ai_evidence: {
    ai_tool: 'chatgpt_dr' | 'claude' | 'perplexity' | 'gemini';
    ai_tool_reason: string;            // 1 句話為什麼選這個工具
    raw_response: string;              // AI 回覆原文（整段保存）
    eight_answers: {                   // 對應 prompt 的 8 題
      q1_specific_groups: string;        // 哪些具體人群最常遇到
      q2_scenes_frequency: string;       // 場景與頻率
      q3_workarounds: string;            // 5 個 workaround
      q4_dissatisfactions_categorized: string;  // 不滿（分類：時間 / 品質 / 情緒 / 資料整理 / 其他）
      q5_public_evidence: string;        // 公開證據來源
      q6_jtbd: string;                   // 真正的 JTBD
      q7_possible_fake_pains: string;    // 可能的假痛點
      q8_interview_targets: string;      // 5 種人 + 各 3 題
    };
    no_solution_check_passed: boolean;   // AI 沒進入「設計產品」模式
  };

  // === Card 7: 自己先猜 + 讀 AI ===
  self_guess: {
    guesses: {                          // 在讀 AI 之前先寫
      most_painful_person: string;
      most_common_scene: string;
      biggest_dissatisfaction: string;
      possible_fake_pain: string;
    };
    ai_checkpoints_passed: {             // 讀 AI 時的 4 個檢查點
      people_segmented: boolean;
      scenes_observable: boolean;
      workaround_dissatisfactions_listed: boolean;
      fake_pains_flagged: boolean;
    };
    pain_judgment_table: string;         // AI 整理的痛點判斷表（第二輪 prompt 產出）
    deltas: {                           // 猜測 vs AI 的差異
      biggest_diff: string;
      ai_added: string;
      guess_unsupported: string;
    };
  };

  // === Card 8: 真人訪談規劃 ===
  interview_plan: {
    targets: Array<{
      persona: string;                   // 目標角色描述
      contact_known: boolean;            // 是否已認識
      contact_info: string;              // 認識：填名字；不認識：填怎麼找
      planned_time: string;              // 預計訪談時間
    }>;                                  // length 應 ≥ 1
    questions: string[];                 // 必須 = 3 題
    interview_taboos_understood: boolean; // 知道訪談時不要做什麼（不推銷、不問「會付錢嗎」等）
    ai_simulated_response: string | null; // AI 模擬訪談的熱身產出（可選）
  };

  // === Card 9: Pain Quality Score + 真假判斷 ===
  verdict: {
    scores: {                            // 5 維度 × 1-5 分
      people_specificity: 1 | 2 | 3 | 4 | 5;
      frequency: 1 | 2 | 3 | 4 | 5;
      intensity: 1 | 2 | 3 | 4 | 5;
      workaround_dissatisfaction: 1 | 2 | 3 | 4 | 5;
      evidence_credibility: 1 | 2 | 3 | 4 | 5;
    };
    total_score: number;                 // 0-25，僅教學模式顯示，不對外輸出
    judgment: 'true_pain' | 'fake_pain' | 'pending_interview';
    reason_100w: string;                 // ≥ 100 字書面理由
    most_confident_evidence: string;
    least_confident: string;
    next_action: 'interview' | 'more_evidence' | 'change_topic';
  };

  // === Card 10: 痛點身份證（不是新資料，而是上述整合輸出）===
  exported: {
    exported_at: string | null;
    formats: Array<'markdown' | 'json' | 'pdf'>;  // 已匯出格式
    last_review_at: string | null;       // 最後檢核日期
  };
};
```

---

## 列舉型別 (Enums)

### PainCardStatus

對應 `painmap_pain_thinking_system.md` 的兩階段狀態：

| 狀態 | 觸發條件 | 階段 |
| :--- | :--- | :--- |
| `draft` | 剛建立或卡 1 完成 | 階段一 |
| `in_progress` | 卡 2-8 進行中 | 階段一 |
| `structured` | 卡 9 完成 + 真痛點判斷 | 階段一終點 |
| `pending_interview` | 卡 9 完成但判斷為「待訪談」 | 階段一暫停 |
| `archived_fake` | 卡 9 完成 + 假痛點判斷（封存） | 階段一終點 |

> ⚠️ **生產模式禁止輸出 0-25 score**（違反 `painmap_moat_design.md M3` 的 Anti-Score Brand）。score 僅用於教學模式的內部反思鏡子。

### TrizLabel

對應 worksheet 卡片 5 的 6 種矛盾：

| triz_id | TrizLabel (中) | EN |
| :-- | :--- | :--- |
| 1 | 想快但又想做得好 | Speed vs Quality |
| 2 | 想客製化但又想規模化 | Personalization vs Scale |
| 3 | 想快但又想正確 | Speed vs Accuracy |
| 4 | 想很專業但又想新手好上手 | Expert vs Novice |
| 5 | 想自動化但又怕失控 | Automation vs Control |
| 6 | 想多嘗試但又怕出包 | Experimentation vs Risk |

---

## 過關條件對應 (Exit Gates)

每張卡片完成的條件由其欄位狀態決定。詳見 `references/exit_gates_matrix.md`。

| 卡片 | 過關條件（資料層判定） |
| :-- | :--- |
| 1 | `complaint.verbatim`、`source_name`、`source_relation`、`datetime`、`scene` 全非空 |
| 2 | `people.list.length === 3` 且每筆 `name`/`contact`/`relation` 非空 |
| 3 | `stuck_formula.user_draft` 非空 + `confirmed === true` |
| 4 | `workaround.tool_name` 非空 + `user_dissatisfactions.length >= 3` |
| 5 | `contradiction.triz_id` 已選 + `side_a`/`side_b` 非空 |
| 6 | `ai_evidence.eight_answers` 8 題全非空 + `no_solution_check_passed === true` |
| 7 | `self_guess.guesses` 4 欄非空 + 4 個 `ai_checkpoints_passed === true` + `deltas` 3 欄非空 |
| 8 | `interview_plan.targets.length >= 1` + `questions.length === 3` + `interview_taboos_understood === true` |
| 9 | `verdict.scores` 5 欄已填 + `judgment` 已選 + `reason_100w.length >= 100` + `next_action` 已選 |

---

## 持久化策略 (MVP)

### LocalStorage 結構

```typescript
// localStorage key: "painmap_worksheet:cards"
type LocalStorage = {
  current_card_id: string;              // 目前正在編輯的 card UUID
  cards: Record<string, PainCard>;      // 所有 cards 以 id 為 key
  schema_version: '1.0';
};
```

### 匯出格式

| 格式 | 用途 | 包含 |
| :-- | :--- | :--- |
| Markdown | 分享、貼到部落格 | 痛點身份證模板 + 9 卡摘要 |
| JSON | 跨工具搬移、備份 | 完整 PainCard 物件 |
| PDF | 列印、面對面討論 | 美化版痛點身份證 |

匯出檔名格式：`paincard-{slug}-{YYYY-MM-DD}.{ext}`，slug 由 `complaint.verbatim` 前 20 字產生。

---

## 與 PainMap 進階版銜接

當 `verdict.judgment === 'true_pain'` 時，可一鍵匯出至 PainMap App：

```
PainCard (v1.0)
  ↓ adapter
PainMap App's Pain Entry (進階 schema)
  ↓
進入 Pain Collector / Essence Decomposer 流程
```

詳見 `product/stage1_to_stage2_handoff.md`。

---

## 變更紀錄

| 版本 | 日期 | 變更 |
| :--- | :--- | :--- |
| 1.0 | 2026-05-01 | 首版；對應 worksheet v1.0 |
