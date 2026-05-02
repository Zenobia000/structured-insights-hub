# 階段一 → 階段二 銜接規格 (Stage 1 → Stage 2 Handoff)

> **配套文件**：`PRD.md`、`user_journey.md`、`motivation_design.md`、`data_model.md`
> **方法論真相源**：`docs/product/painmap/painmap_pain_thinking_system.md`
> **階段二真相源**：`docs/product/first_principles_sprint_manual.md`（72 小時 sprint 手冊，**不在本文件範圍**）
> **Skill 對應**：`.claude/skills/sunnydata-pain-thinking/SKILL.md`（Worksheet 的 Claude Code 版本）

---

## 0. 為什麼需要這份文件

PainMap 系統把「痛點是不是真的」（階段一）與「能不能賺錢」（階段二）**強制拆成兩個獨立階段**。Worksheet 是階段一的網頁實作，當階段一終點完成時，必須有清晰的銜接點把使用者導向階段二。

這份文件回答 4 個問題：

1. 何時觸發階段二轉場？
2. 轉場入口長什麼樣？
3. PainCard schema 如何適配到 PainMap App 的 Pain Entry schema？
4. 假痛點 / 待訪談 怎麼處理？

---

## 1. 觸發轉場的條件

### 1.1 唯一觸發條件

```
verdict.judgment === 'true_pain'
AND
status === 'structured'
```

只有當卡 9 完成且判斷為**真痛點**時，才出現「進入階段二」CTA。其他情境（假痛點、待訪談）不導向階段二，而是導向「換題目」或「排訪談」流程（見 §6、§7）。

### 1.2 不可逆向跳階段（鐵律）

| 跳階段嘗試 | 系統回應 |
| :--- | :--- |
| 卡 1–8 任一未完成想跳階段二 | 拒絕。顯示「先完成 9 卡判斷」|
| 卡 9 判斷為假痛點想跳階段二 | 拒絕。文案「假痛點不是好生意，先換題目」|
| 卡 9 判斷為待訪談想跳階段二 | 拒絕。文案「先排訪談確認後再進階段二」|
| 卡 9 完成但 reason_100w < 100 字 | 拒絕。要求補完判斷理由 |

### 1.3 可逆向回階段一

階段二進行中發現原始判斷有誤時，使用者可隨時回 Worksheet 修正卡 9：

- PainMap App → 「回 Worksheet 修正判斷」連結
- 修正後 PainCard 重新進入階段一終點
- 階段二歷史記錄保留（不清空）

---

## 2. 轉場入口 UI

### 2.1 入口位置

**卡 10 痛點身份證頁面（`/learn/worksheet/result`）下方 CTA 區**

```
┌──────────────────────────────────────────────────┐
│              [痛點身份證內容區]                    │
│              主人翁、場景、矛盾、判斷...           │
└──────────────────────────────────────────────────┘

────────────────── 你的下一步 ──────────────────────

┌──────────────────────────────────────────────────┐
│  📌 你判斷這是真痛點                              │
│                                                    │
│  接下來你可以：                                    │
│                                                    │
│  ┌────────────────────────────────────────┐      │
│  │ 🎯 將這個痛點匯入 PainMap App           │      │
│  │ 進入階段二商業驗證（72 小時 sprint）     │      │
│  │ [立即匯入 →]                            │      │
│  └────────────────────────────────────────┘      │
│                                                    │
│  ┌────────────────────────────────────────┐      │
│  │ 📞 先排訪談（建議優先做這個）            │      │
│  │ AI 找的證據是文字痕跡，真人訪談才確認    │      │
│  │ [查看訪談對象 →]                        │      │
│  └────────────────────────────────────────┘      │
│                                                    │
│  ┌────────────────────────────────────────┐      │
│  │ 📥 匯出痛點身份證                       │      │
│  │ Markdown / JSON / PDF                    │      │
│  │ [選擇格式 →]                            │      │
│  └────────────────────────────────────────┘      │
└──────────────────────────────────────────────────┘
```

### 2.2 文案規則

- **不使用慶祝動畫 / 全螢幕特效**（違反 brand 禁令）
- **不使用「恭喜」「太棒了」**（避免遊戲化）
- 標題用「你的下一步」（賦權語氣，呼應 brand voice）
- CTA 動詞為主動式：「匯入」「查看」「選擇」（與 brand 一致）

### 2.3 推薦順序的設計理由

| 順序 | CTA | 為什麼放這裡 |
| :--- | :--- | :--- |
| 1 | 匯入 PainMap App | 直接接階段二 sprint，是「真痛點 → 商業驗證」的主路徑 |
| 2 | 排訪談 | 即便要進階段二，先做訪談會大幅降低 sprint 失敗率（方法論建議）|
| 3 | 匯出身份證 | 留給「想離線整理 / 跟團隊討論」的使用者 |

### 2.4 不顯示「進入階段二」的情境

| 情境 | UI 行為 |
| :--- | :--- |
| `verdict.judgment === 'fake_pain'` | 替換為「換題目重新填」+「我已經學到判斷力」|
| `verdict.judgment === 'pending_interview'` | 替換為「排訪談」+「訪談後回填卡 9」（見 §7）|
| 使用者已點過「匯入 PainMap App」| 改顯示「再次匯入（會建立新版本）」|

---

## 3. 資料適配（PainCard → Pain Entry）

### 3.1 Schema 對應總覽

| Worksheet PainCard 欄位 | PainMap App Pain Entry 欄位 | 狀態 |
| :--- | :--- | :--- |
| `id` (UUID) | `worksheet_origin_id` | 保留作為來源追蹤 |
| `complaint.verbatim` | `raw_complaint` | 保留（原句不可變）|
| `complaint.source_name` | `informant.name` | 保留 |
| `complaint.source_relation` | `informant.relation` | 保留 |
| `complaint.datetime` | `complaint_observed_at` | 保留 |
| `complaint.scene` | `complaint_scene` | 保留 |
| `people.list` | `target_persona.named_individuals` | 保留 |
| `people.background` | `target_persona.demographic` | 保留 |
| `stuck_formula.user_draft` | `pain_sentence` | 保留（核心欄位）|
| `stuck_formula.ai_polished` | `pain_sentence_ai_variant` | 保留為參考 |
| `workaround.tool_name` | `current_workaround.name` | 保留 |
| `workaround.user_dissatisfactions` | `current_workaround.dissatisfactions` | 保留 |
| `contradiction.{side_a, side_b, sacrificed, sacrificed_reason}` | `contradiction.{side_a, side_b, sacrificed, sacrificed_reason}` | 保留 |
| `ai_evidence.eight_answers` | `evidence.structured_answers` | 保留（拆 8 欄）|
| `ai_evidence.raw_response` | `evidence.raw_text` | 保留（供 audit）|
| `self_guess.deltas` | `evidence.judgment_deltas` | 保留（重要學習軌跡）|
| `interview_plan.targets` | `interview_pipeline.candidates` | 保留 |
| `interview_plan.questions` | `interview_pipeline.starter_questions` | 保留 |
| `verdict.judgment` | `validation_status`（轉換 enum）| **轉換**（見 §3.3）|
| `verdict.reason_100w` | `validation_reason` | 保留 |
| `verdict.most_confident_evidence` | `key_evidence` | 保留 |
| `verdict.least_confident` | `key_unknown` | 保留 |
| `verdict.next_action` | `next_step` | 保留 |
| `self_guess.guesses` | — | Worksheet 內部使用，不轉場 |
| `self_guess.ai_checkpoints_passed` | — | Worksheet 內部使用，不轉場 |
| `interview_plan.ai_simulated_response` | — | 熱身用，不轉場 |
| `exported.*` | — | Worksheet 內部 metadata，不轉場 |

### 3.2 新增欄位（Pain Entry 獨有，由轉場 adapter 產生）

| Pain Entry 欄位 | 由 Worksheet 何處產生 |
| :--- | :--- |
| `stage` | 固定為 `'stage_2_commercial_validation'` |
| `validation_status` | 由 `verdict.judgment` 映射（見 §3.3）|
| `imported_at` | ISO8601 當下時間 |
| `imported_from` | 固定為 `'painmap_worksheet'` |
| `imported_schema_version` | 固定為 `'1.0'`（PainCard schema 版本） |
| `physical_quantities_passed` | `[1, 2]`（階段一已驗證的 #1、#2）|
| `physical_quantities_pending` | `[3, 4]`（階段二要驗證的 #3、#4）|

### 3.3 Validation Status 對應規則

```typescript
// Worksheet → PainMap App
function mapVerdictToValidationStatus(
  judgment: 'true_pain' | 'fake_pain' | 'pending_interview'
): 'structured' | 'archived_fake' | 'pending_interview' {
  switch (judgment) {
    case 'true_pain':
      return 'structured';      // 進入階段二 sprint
    case 'pending_interview':
      return 'pending_interview'; // 留在階段一暫停區
    case 'fake_pain':
      return 'archived_fake';   // 封存（見 §5）
  }
}
```

對應方法論：

- `structured`（階段一終點）→ 階段二 sprint 入口
- `verified_interview`（階段二 Hour 24–48）→ 由階段二 sprint 寫入
- `verified_payment`（階段二 Hour 48–72）→ 由階段二 sprint 寫入

### 3.4 適配邏輯偽碼

```typescript
function adaptPainCardToPainEntry(pc: PainCard): PainEntry {
  if (pc.verdict.judgment !== 'true_pain') {
    throw new Error('Only true_pain can be imported to Stage 2');
  }
  if (pc.status !== 'structured') {
    throw new Error('PainCard must be at structured status');
  }

  return {
    // === Meta ===
    id: generateUUID(),
    worksheet_origin_id: pc.id,
    stage: 'stage_2_commercial_validation',
    validation_status: 'structured',
    imported_at: new Date().toISOString(),
    imported_from: 'painmap_worksheet',
    imported_schema_version: '1.0',
    physical_quantities_passed: [1, 2],
    physical_quantities_pending: [3, 4],

    // === Carry-over fields ===
    raw_complaint: pc.complaint.verbatim,
    informant: {
      name: pc.complaint.source_name,
      relation: pc.complaint.source_relation,
    },
    complaint_observed_at: pc.complaint.datetime,
    complaint_scene: pc.complaint.scene,
    target_persona: {
      named_individuals: pc.people.list,
      demographic: pc.people.background,
    },
    pain_sentence: pc.stuck_formula.user_draft,
    pain_sentence_ai_variant: pc.stuck_formula.ai_polished,
    current_workaround: {
      name: pc.workaround.tool_name,
      why_still_stuck: pc.workaround.why_still_stuck,
      dissatisfactions: pc.workaround.user_dissatisfactions,
    },
    contradiction: pc.contradiction,  // 含 side_a, side_b, sacrificed, sacrificed_reason
    evidence: {
      raw_text: pc.ai_evidence.raw_response,
      structured_answers: pc.ai_evidence.eight_answers,
      judgment_deltas: pc.self_guess.deltas,
    },
    interview_pipeline: {
      candidates: pc.interview_plan.targets,
      starter_questions: pc.interview_plan.questions,
    },
    validation_reason: pc.verdict.reason_100w,
    key_evidence: pc.verdict.most_confident_evidence,
    key_unknown: pc.verdict.least_confident,
    next_step: pc.verdict.next_action,

    // === Worksheet-internal fields (not carried over) ===
    // self_guess.guesses → NOT carried (worksheet 訓練用)
    // self_guess.ai_checkpoints_passed → NOT carried (同上)
  };
}
```

---

## 4. Handover Card

當使用者點擊「匯入 PainMap App」時，系統產出一張 Handover Card 作為兩個系統的銜接憑證：

```
═══════════════════════════════════════════════════
              階段一 → 階段二 Handover
═══════════════════════════════════════════════════

  PainCard ID:    [pc.id]
  痛點句:         [pc.stuck_formula.user_draft]
  真假判斷:       真痛點
  100 字理由:     [pc.verdict.reason_100w 摘要]
  最有把握:       [pc.verdict.most_confident_evidence]
  最沒把握:       [pc.verdict.least_confident]
  狀態:           structured

  轉場日期:       [imported_at]
  經辦:           [使用者]

  ⚠️ 重要備註:
  - 階段二的決策依據是 validation_status，不是分數
  - 「最沒把握」欄位是訪談的入口——記得帶這個問題去訪談
  - 訪談後若改判，回 Worksheet 建立新 PainCard 重新走一遍

═══════════════════════════════════════════════════
              階段二 sprint 即將啟動
═══════════════════════════════════════════════════
```

對應 `sunnydata-pain-thinking/SKILL.md` 的 Handover card：

```
Pain: [Step 2 sentence]
Status: [draft | structured]
Verdict: [真痛點 | 假痛點 | 待訪談]
Reason: [Step 9 100-word reason]
Most confident: [Step 9 most_confident_evidence]
Least confident: [Step 9 least_confident]
Transition date: [YYYY-MM-DD]
Owner: [name]
```

### 4.1 Handover 過後的不可逆規則

- 一旦 Handover Card 產生，PainMap App 端的 Pain Entry 即建立
- Pain Entry 的 `validation_status` 由階段二 sprint 接管演進（`structured` → `verified_interview` → `verified_payment`）
- Worksheet 端的 PainCard 進入「歷史」狀態（保留可閱讀，但不可編輯）
- 若要修正原始判斷 → 在 Worksheet 建立新 PainCard 重新走一遍

### 4.2 為什麼要這個 Handover Card

1. **建立追溯性**：未來若 sprint 失敗回頭檢查，可追到 Worksheet 原始判斷
2. **儀式感**：一個明確的轉場儀式，讓使用者感受到「我從訓練畢業，進入實戰」（白帽 #2 Accomplishment 的合法應用）
3. **「最沒把握」是訪談的入口**：這個欄位是階段二訪談的具體起點

---

## 5. 假痛點處理

### 5.1 觸發條件

```
verdict.judgment === 'fake_pain'
```

### 5.2 處理原則

| 原則 | 實作 |
| :--- | :--- |
| **封存而非刪除** | `status` 變為 `'archived_fake'`，PainCard 保留在 LocalStorage |
| **不刪除歷史記錄** | 使用者可隨時回看「我之前判斷為假痛點的題目」|
| **正向引導換題** | 文案「換題目，從卡 1 重新填」（避免失敗感）|
| **保留判斷理由** | `reason_100w` 保留，作為下次思考參考 |
| **不導向階段二** | 卡 10 CTA 區不顯示「匯入 PainMap App」|

### 5.3 卡 10 假痛點頁面 UI

```
┌──────────────────────────────────────────────────┐
│              [痛點身份證內容區]                    │
└──────────────────────────────────────────────────┘

────────────────── 你的下一步 ──────────────────────

┌──────────────────────────────────────────────────┐
│  📌 你判斷這是假痛點                              │
│                                                    │
│  你省下了 3 個月走錯路的時間。                      │
│  這就是判斷力訓練的價值。                           │
│                                                    │
│  ┌────────────────────────────────────────┐      │
│  │ 🔄 換題目重新填一輪                     │      │
│  │ 從卡 1 重新開始（這份會封存保留）        │      │
│  │ [開始新題目 →]                          │      │
│  └────────────────────────────────────────┘      │
│                                                    │
│  ┌────────────────────────────────────────┐      │
│  │ 💭 還沒有新題目？                       │      │
│  │ 去你的目標族群混 1–2 週，聽他們真的抱怨   │      │
│  │ [閱讀方法論建議 →]                      │      │
│  └────────────────────────────────────────┘      │
│                                                    │
│  ┌────────────────────────────────────────┐      │
│  │ 📥 匯出這份判斷（給未來自己參考）        │      │
│  │ [選擇格式 →]                            │      │
│  └────────────────────────────────────────┘      │
└──────────────────────────────────────────────────┘
```

### 5.4 為什麼封存而不刪除

1. **學習軌跡保留**：未來新題目可能與舊題目有關聯，封存的判斷可作為對照
2. **避免損失感**：「刪除」會觸發 #8 Loss Avoidance 焦慮（違反禁令）
3. **支持換題目重來**：使用者可能 3 個月後想回看「我之前為什麼覺得它是假的」

### 5.5 連續 3 次假痛點的提示

如果使用者連續 3 份 PainCard 都判斷為假痛點，系統提示：

> 你已經連續 3 次判斷為假痛點。這通常表示**你還沒接觸到真正有痛點的人群**。
> 建議：先去你目標族群聚集的地方（社團、LINE 群、實體場合）混 1–2 週，再回來填卡 1。

注意：

- 這不是責備（白帽原則）
- 不顯示「失敗 3 次」紅色警告（違反 brand 禁令）
- 不限制使用者再開新題目（不做人為稀缺）

---

## 6. 待訪談狀態（pending_interview）的後續流程

### 6.1 觸發條件

```
verdict.judgment === 'pending_interview'
```

### 6.2 處理原則

| 原則 | 實作 |
| :--- | :--- |
| **PainCard 留在階段一暫停區** | `status` 變為 `'pending_interview'` |
| **不導向階段二** | 卡 10 CTA 區不顯示「匯入 PainMap App」|
| **顯示訪談對象** | 從 `interview_plan.targets` 抽出列表 |
| **支援訪談後回填** | 使用者完成訪談後，可回卡 9 重新判斷 |

### 6.3 卡 10 待訪談頁面 UI

```
┌──────────────────────────────────────────────────┐
│              [痛點身份證內容區]                    │
└──────────────────────────────────────────────────┘

────────────────── 你的下一步 ──────────────────────

┌──────────────────────────────────────────────────┐
│  📌 你判斷需要再訪談                              │
│                                                    │
│  AI 證據是文字痕跡，真人訪談才能確認。              │
│  通常訪談 2–3 人後，真假就會浮出來。                │
│                                                    │
│  你規劃的訪談對象：                                 │
│  ┌────────────────────────────────────────┐      │
│  │ 1. [target.persona]                     │      │
│  │    [target.contact_info]                │      │
│  │    預計時間：[target.planned_time]      │      │
│  │    [✅ 已完成 / ⏳ 待安排]              │      │
│  └────────────────────────────────────────┘      │
│                                                    │
│  ┌────────────────────────────────────────┐      │
│  │ 📝 完成訪談了嗎？                       │      │
│  │ 回卡 9 重新判斷真假                     │      │
│  │ [回卡 9 →]                              │      │
│  └────────────────────────────────────────┘      │
│                                                    │
│  ┌────────────────────────────────────────┐      │
│  │ 📅 訪談技巧提醒                         │      │
│  │ 不推銷、不問會付錢嗎、只聽現況            │      │
│  │ [閱讀訪談禁忌 →]                        │      │
│  └────────────────────────────────────────┘      │
└──────────────────────────────────────────────────┘
```

### 6.4 訪談後回填流程

1. 使用者完成訪談 → 點擊「回卡 9」
2. 系統跳轉 `/learn/worksheet/09`
3. 卡 9 顯示「之前的判斷」+「訪談後新增的證據區」
4. 使用者更新 `verdict.judgment`：
   - 若改判 `true_pain` → 走 §2 真痛點轉場流程
   - 若改判 `fake_pain` → 走 §5 假痛點封存流程
   - 若仍 `pending_interview` → 系統提示「需要再訪談 1–2 人」

### 6.5 訪談記錄（M2+ 範圍）

MVP 不做訪談記錄欄位（紙本記錄即可）。M2+ 可加：

- 每位 target 加 `interview_completed_at` + `interview_notes` 欄位
- 訪談結束後 prompt「請整理 3 個訪談重點」

---

## 7. 與 sunnydata-pain-thinking Skill 的對應關係

### 7.1 Skill 是什麼

`.claude/skills/sunnydata-pain-thinking/SKILL.md` 是 Worksheet 的 **Claude Code 版本**。當開發者 / 高階使用者用 Claude Code 跑這個流程時，Skill 會：

1. 自動建立 9 個 TodoWrite 待辦
2. 強制每個 step 的 exit condition
3. 阻擋跳步、阻擋階段二話題進入階段一
4. 在階段一終點要求書面真假判斷

### 7.2 Worksheet 與 Skill 的對應

| Worksheet 卡 | Skill Step | 共通 exit condition |
| :--- | :--- | :--- |
| 卡 1 抱怨原句 | Step 1. 聆聽 | 至少 1 個有名字的人 |
| 卡 2 三個有名字的人 | Step 2. 5 要素 + S1 | 3-person list + workaround 有名字 |
| 卡 3 卡關公式 | Step 2 後段（5 要素整理）| 5 要素具體 |
| 卡 4 現在怎麼解 | Step 2 後段（workaround）| workaround 有名字 |
| 卡 5 兩件事不能同時要 | Step 3. 取捨自陳 | side_a / side_b / sacrificed / sacrificed_reason 全填且具體 |
| 卡 6 AI 證據蒐集 | Step 4 + Step 5 | AI 工具選擇 + 8 題答案 + 沒進入 solution mode |
| 卡 7 自己先猜 + 讀 AI | Step 6. 自己先猜+讀 AI | 3 猜測 + 4 檢查點 + 3 deltas |
| 卡 8 真人訪談規劃 | Step 7. 規劃真人訪談 | 1+ target + 3 questions + 訪談禁忌 |
| 卡 9 真假判斷 | Step 8 + Step 9 | 書面 100 字理由 + most/least confident + next_action + S2 |

### 7.3 兩者並存的設計理由

| 場景 | 工具選擇 |
| :--- | :--- |
| 不懂 AI 的初學者 | Worksheet（網頁填空，每張卡片有清楚指引）|
| 已用過 Claude Code 的開發者 | Skill（在終端機跑 9 步流程）|
| 兩者皆可使用的進階使用者 | 自由選擇（兩者產出格式互通）|

### 7.4 共通鐵律（Iron Laws）

兩者必須遵守相同的鐵律：

```
1. 階段一 ≠ 階段二（pain validation ≠ commercial validation）
2. 階段一終點 = 書面真假判斷（不是付款）
3. 不可跳步（每個必填條件必須齊備）
4. 階段一不談錢（金錢話題自動延後到階段二）
5. 零分數（schema 內無 score 欄位）
6. 零分類學標籤（schema 內無分類學欄位）
7. 卡 9 AI 永久禁用（判斷必須人為書面）
```

### 7.5 互通格式

Skill 產出的 Mode switch handover card 與 Worksheet 卡 10 的 Handover Card **格式完全一致**。這保證：

- 使用者從 Skill 跑完 → 可貼到 Worksheet 卡 10 區塊 → 再進階段二
- 使用者從 Worksheet 跑完 → 可貼到 Claude Code Skill session → 繼續用 Skill 做後續記錄
- 兩者的 PainCard schema 完全相同（`data_model.md` 為唯一真相源）

---

## 8. 與階段二 sprint manual 的銜接點

### 8.1 階段二的真相源

`docs/product/first_principles_sprint_manual.md`（**不在本文件範圍**）負責：

- 物理量 #3（手作交付能力）
- 物理量 #4（付款通道準備）
- BCG DRI 攻擊層次選擇（Deploy / Reshape / Invent）
- 72 小時 sprint 流程（Hour 0–24 訪談、Hour 24–48 紅隊、Hour 48–72 收第一塊錢）
- `validation_status` 的 `verified_interview` 與 `verified_payment` 演進

### 8.2 Worksheet 不負責的事

| 事項 | 由誰負責 |
| :--- | :--- |
| 設計手作交付物 | sprint manual |
| 設計付款通道 | sprint manual |
| 決定 D / R / I 攻擊層次 | sprint manual |
| 排訪談時程 | sprint manual + 使用者自管 |
| 預售腳本 | sprint manual |
| 收第一塊錢 | sprint manual |

Worksheet 只做一件事：**把抱怨變成書面真假判斷，然後優雅地把使用者交給階段二**。

### 8.3 銜接點 contract

當使用者點擊「匯入 PainMap App」時，Worksheet 對階段二保證：

| 保證 | 說明 |
| :--- | :--- |
| ✅ Pain Entry 的 `validation_status === 'structured'` | 已通過階段一所有 exit gate |
| ✅ `physical_quantities_passed === [1, 2]` | 物理量 #1、#2 已驗證 |
| ✅ `validation_reason.length >= 100` | 有書面理由可追溯 |
| ✅ `interview_pipeline.candidates.length >= 1` | 有具體訪談對象 |
| ✅ `current_workaround.dissatisfactions.length >= 3` | 有 ≥ 3 個現有解法不滿 |
| ✅ `evidence.structured_answers` 8 題完整 | 有結構化證據基底 |
| ✅ `contradiction.sacrificed_reason` 非空 | 取捨的「為什麼」已書面化 |
| ✅ Schema 內無 score 欄位、無分類學欄位 | 符合零分數零分類學鐵律 |

### 8.4 階段二回頭通知 Worksheet 的情境（M2+ 範圍）

未來若需要兩階段資料同步：

| 階段二事件 | 回寫到 Worksheet PainCard |
| :--- | :--- |
| 訪談完成 | 更新 `interview_plan.targets[i].interview_completed_at` |
| 紅隊揭露假痛點 | PainCard `status` 變為 `'archived_fake'` + 新增 `red_team_finding` |
| 第一筆付款達成 | PainCard `status` 變為 `'commercially_validated'`（新狀態，M2+）|

MVP 不做雙向同步（單向轉場即可）。

---

## 9. 設計者備忘

### 9.1 為什麼分階段這麼嚴格

把兩階段混在一起時，初學者會被「設計手作交付」「架收款連結」嚇跑。強制分階段是 PainMap 方法論的核心結構。Worksheet 是這個方法論的網頁實作，不可破壞這個原則。

### 9.2 為什麼 schema 內沒有 score 欄位

判斷力訓練的交付物是書面理由（`verdict.reason_100w`）+ 最有把握 / 最沒把握 + 下一步行動。把這四個欄位寫清楚就足以承載判斷品質，不需要任何「N / 25」「N / 100」型的數值彙總。

schema 內不存在 score 欄位 → UI 自然沒有分數可顯示 → 沒有「使用者把分數誤用為綠燈」的失真風險。資料形狀本身就是設計守則。

### 9.3 為什麼假痛點要封存而不刪除

因為刪除會觸發 #8 Loss Avoidance 焦慮（違反禁令）。封存讓使用者保有「我有 3 個假痛點 + 1 個真痛點 = 4 次判斷力訓練」的累積感（合法的 #2 Accomplishment）。

### 9.4 為什麼待訪談不導向階段二

因為階段二是 72 小時 sprint，需要真實訪談證據作為 sprint 起點。沒做訪談直接進階段二 = 用對的方法做錯的事，浪費 72 小時。

### 9.5 給未來貢獻者的話

這份文件最危險的修改是「為了方便使用者，跳過某個檢查」。請記住：

- **跳過檢查 = 把假題目送進階段二 = sprint 失敗 = 使用者失去信心**
- 嚴格的 contract 不是束縛，是保護

---

> **最後一句**：階段一的責任不是讓使用者「成功」，是讓使用者「**清楚知道現在站在哪裡**」。把判斷力交回給使用者，這就是 Worksheet 對階段二最大的禮物。
