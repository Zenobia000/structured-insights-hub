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
5. **零分數、零分類學**：資料層不存任何打分結果或預設標籤
6. **問題取代評分**：每張卡片讓使用者先寫，AI 只在使用者寫完後出現作為對照
7. **守門但不評等**：anti-fake validator 為真實性護欄，回傳中性提示而非「過關 / 失敗」

---

## 完整 Schema (TypeScript)

```typescript
/**
 * PainCard — 痛點身份證
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
    verbatim: string;             // 必填，原句不美化
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

  // === Card 5: 兩件事不能同時要（取捨自陳）===
  contradiction: {
    side_a: string;                    // A 端：他想要這個（≥10 字，使用者自己寫）
    side_b: string;                    // B 端：他也想要這個（≥10 字，使用者自己寫）
    sacrificed: 'a' | 'b';             // 通常會犧牲哪一邊
    sacrificed_reason: string;         // 為什麼那邊會被犧牲（≥1 句，使用者自陳理由）
  };

  // === Card 6: AI 證據蒐集 ===
  ai_evidence: {
    ai_tool: 'chatgpt_dr' | 'claude' | 'perplexity' | 'gemini';
    ai_tool_reason: string;            // 1 句話為什麼選這個工具
    raw_response: string;              // AI 回覆原文（整段保存）
    eight_answers: {                   // 對應 prompt 的 8 題
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
    guesses: {                          // 在讀 AI 之前先寫
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
    phase_a_completed_at: string | null;  // 鎖 deltas 編輯（卡 7 phase A 完成時間戳）
  };

  // === Card 8: 真人訪談規劃 ===
  interview_plan: {
    targets: Array<{
      persona: string;
      contact_known: boolean;
      contact_info: string;
      planned_time: string;
    }>;
    questions: string[];                 // 必須 = 3 題
    interview_taboos_understood: boolean;
    ai_simulated_response: string | null;
  };

  // === Card 9: 真假判斷（純書面，無分數）===
  verdict: {
    judgment: 'true_pain' | 'fake_pain' | 'pending_interview';
    reason_100w: string;                 // ≥ 100 字書面理由
    most_confident_evidence: string;     // 最有把握的證據
    least_confident: string;             // 最沒把握的地方
    next_action: 'interview' | 'more_evidence' | 'change_topic';
  };

  // === Card 10: 痛點身份證（不是新資料，而是上述整合輸出）===
  exported: {
    exported_at: string | null;
    formats: Array<'markdown' | 'json' | 'pdf'>;
    last_review_at: string | null;
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

---

## 反思條件對應 (Reflection Prompts)

每張卡片完成的條件由其欄位狀態決定。詳見 `references/exit_gates_matrix.md`。卡片**不擋住前進**——只在欄位空白時建議使用者「回去把 X 想清楚再來」。

| 卡片 | 反思條件（資料層判定） |
| :-- | :--- |
| 1 | `complaint.verbatim`、`source_name`、`source_relation`、`datetime`、`scene` 全非空 |
| 2 | `people.list.length === 3` 且每筆 `name`/`contact`/`relation` 非空 |
| 3 | AI 對話完成 + `confirmed === true` |
| 4 | `workaround.tool_name` 非空 + `user_dissatisfactions.length >= 3` |
| 5 | `contradiction.side_a.length >= 10` + `side_b.length >= 10` + `sacrificed` 已選 + `sacrificed_reason` 非空 |
| 6 | `ai_evidence.eight_answers` 8 題全非空 + `no_solution_check_passed === true` |
| 7 | `self_guess.guesses` 4 欄非空 + 4 個 `ai_checkpoints_passed === true` + `deltas` 3 欄非空 |
| 8 | `interview_plan.targets.length >= 1` + `questions.length === 3` + `interview_taboos_understood === true` |
| 9 | `judgment` 已選 + `reason_100w.length >= 100` + `most_confident_evidence`/`least_confident` 非空 + `next_action` 已選 |

---

## 持久化策略 (MVP)

### LocalStorage 結構

```typescript
// localStorage key: "painmap-worksheet"
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
PainCard
  ↓ adapter
PainMap App's Pain Entry (進階 schema)
  ↓
進入 Pain Collector / Essence Decomposer 流程
```

詳見 `product/stage1_to_stage2_handoff.md`。
