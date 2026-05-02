# Page-Level Prompt: Card 3 — 卡關公式

> Worksheet 第三張卡片。對應「卡片 3 ｜ 把抱怨變成卡關公式」。使用者把抱怨改寫成「我每次要 X，都會卡在 Y」句型，AI 介入校對 + 列出「需要再問清楚」的問題。**這是 AI 第一次出場的卡片** — 共創模式：你寫初版，AI 校對。

---

## [PAGE META]

- **page_name**: Card 3 - Stuck Formula
- **route_path**: `/learn/worksheet/03?id={paincard_uuid}`
- **page_type**: worksheet_card (input form + AI prompt copy block)
- **primary_goal**: 引導使用者填入 `stuck_formula.user_draft`（自己寫的卡關句型），透過 AI 提示複製功能取得 AI 校對版本（`ai_polished` + `ai_clarifying_questions`），最後使用者勾選 `confirmed`
- **secondary_goal**: 讓使用者體會「人 + AI 共創」 — AI 不替你想細節，但能幫你看出哪裡含糊
- **target_users**: 已通過卡 2 的使用者
- **entry_point**: 卡 2 過關後 PATCH 跳轉 / LocalStorage 恢復 `current_step === 3`
- **expected_time_on_page**: 8-15 分鐘（含跳到外部 ChatGPT 跑 prompt 的時間）
- **corresponds_to_worksheet**: `docs/workshop/painpoint_beginner_worksheet.md` 卡片 3
- **corresponds_to_data_model**: `PainCard.stuck_formula` 物件

---

## [STRUCTURE: SECTIONS]

1. **stepper_header**
   - section_type: progress_indicator
   - section_purpose: 顯示 9 卡 stepper（卡 1-2 verified / 卡 3 高亮）
2. **card_intro**
   - section_type: instruction
   - section_purpose: 說明「我每次要 X，都會卡在 Y」句型 + AI 介入 ✅ 校對的標示
3. **user_draft_input**
   - section_type: form
   - section_purpose: 使用者**先**自己寫初版（Step 1，AI 還不能看）
4. **ai_prompt_block**
   - section_type: ai_prompt_copy_block
   - section_purpose: 顯示完整 prompt 給使用者複製到 ChatGPT/Claude（Step 2）
5. **ai_response_input**
   - section_type: form
   - section_purpose: 使用者貼回 AI 校對結果（`ai_polished` + `ai_clarifying_questions`）（Step 3）
6. **confirmation_check**
   - section_type: confirmation_panel
   - section_purpose: 使用者確認「AI 列的問題我能回答」+ 勾選 `confirmed`
7. **example_reference**
   - section_type: example_card
   - section_purpose: 顯示 worksheet 林老師範例（AI 整理後 + 3 個追問）
8. **exit_gate_footer**
   - section_type: action_footer
   - section_purpose: 反思問題 + 「儲存並進入卡 4」

---

## [SECTION COMPONENT SPEC]

### Section: stepper_header

- 與卡 1/2 一致
- ai_indicator: Badge (Verified Green border) / required / "AI 介入：✅ 校對 prompt"

### Section: card_intro

- **layout**: 全寬，標題 + 說明區
- **elements**:
  - card_number: Eyebrow / required / "卡 3 / 9"
  - card_title: H1 / required / "把抱怨變成「卡關公式」"
  - sentence_template: CodeBlock / required / 顯示句型範本
    - "**「我每次要 [想做的事]，都會卡在 [障礙]。」**"
  - rule_callout: AlertBox (Primary Light bg) / required
    - icon: Edit
    - text: Body MD / "**規則：** 你**先**寫初版，再請 AI 校對 — 不是反過來。AI 不替你發明細節，但能幫你看出含糊處。"
  - ai_role_explainer: Body MD / required / "**AI 在這張卡的角色：** 校對你的句型 + 列出「需要再問清楚」的 3 個問題（不會替你回答）。"
- **states**: default / loading
- **copy_constraints**: card_title 最多 14 字

### Section: user_draft_input (Step 1: 你先寫)

- **layout**: 編號區塊 + 表單
- **elements**:
  - step_label: H2 / required / "Step 1：你先寫初版"
  - rule: Body SM / required / "在點開 AI 之前，先寫你自己的版本。後面才能對照 AI 改了哪些地方。"
  - field_user_draft: TextareaField / required
    - label: H3 / "我每次要 ___，都會卡在 ___。"
    - helper: Body SM / "兩個空格都要具體。「卡在效率不好」這種抽象詞會被卡住（warning）"
    - placeholder: "我每次要寫 30 則家長回報，都會卡在資料散在週間 7 次小考、要寫得具體、不能傷家長感情。"
    - rows: 3
    - data_field: `stuck_formula.user_draft`
    - validation: minLength 15
    - anti_fake_hint: 包含「效率不好 / 沒效率 / 流程不順 / 不方便」等抽象詞時 inline warning「這太抽象了，請寫具體做什麼動作卡住」（R2.3，warning 不擋）
  - autosave_indicator: Caption / required
- **states**: default / focus / warning / loading
- **copy_constraints**: helper 最多 35 字

### Section: ai_prompt_block (Step 2: 跳到 AI)

- **layout**: 步驟區塊 + 完整 prompt 複製 widget
- **elements**:
  - step_label: H2 / required / "Step 2：複製這段 prompt 到 ChatGPT / Claude / Gemini"
  - tool_picker: AIToolPicker / optional / 4 個 chip（ChatGPT / Claude / Gemini / Perplexity），純記錄使用者偏好（寫到 LocalStorage `user_pref.ai_tool`），不影響 prompt 內容
  - prompt_block: AIPromptCopyBlock / required / 詳見 `design/components/ai_prompt_copy_block.md`
    - prompt_template: 直接從 worksheet 卡 3 萃取，**不重寫**
    - 內含變數插值：
      - `{complaint_verbatim}` ← `complaint.verbatim`（從卡 1 讀取）
      - `{people_background}` ← `people.background`（從卡 2 讀取）
    - 最終文字：
```
我有一個抱怨原句：
{complaint_verbatim}

抱怨主人翁是：
{people_background}

請幫我把它整理成「我每次要 ___，都會卡在 ___」這個句型。

規則：
1. 不要替我發明細節，只能用原句裡有的事實
2. 如果原句不夠具體，請列出 3 個我需要再問清楚的問題
3. 不要建議解決方案、不要推薦工具、不要分析市場
4. 直接給我句子，不要解釋為什麼
```
  - copy_button: Button Primary / required / "複製 prompt"
  - external_link: Button Secondary / optional / "在新分頁開啟 ChatGPT" / -> https://chat.openai.com (target="_blank")
  - prompt_source_link: Link / required / "Prompt 來源：worksheet 卡片 3" / -> 連結到 worksheet 原文段落
- **states**:
  - default: prompt 完整顯示，copy_button 為「複製 prompt」
  - copied: copy_button 變「已複製 ✓」並 2 秒後復原
  - missing_data: 如果 `complaint.verbatim` 或 `people.background` 為空，顯示 disabled 狀態 + 提示「請先完成卡 1 / 卡 2」
  - loading: Skeleton
- **copy_constraints**: prompt 內容**逐字引用 worksheet**，禁止改寫

### Section: ai_response_input (Step 3: 貼回 AI 答案)

- **layout**: 步驟區塊 + 兩個輸入欄
- **elements**:
  - step_label: H2 / required / "Step 3：把 AI 的回覆貼回來"
  - field_ai_polished: TextareaField / optional
    - label: H3 / "AI 校對後的版本"
    - helper: Body SM / "AI 整理後的句子（如果 AI 整理結果跟你的差不多，可留空保留你自己的版本）"
    - placeholder: "我每次要在週末寫 30 則家長回報訊息，都會卡在『資料散在週間 7 次小考、要寫得具體、不能傷家長感情』這 3 件事同時要顧。"
    - rows: 3
    - data_field: `stuck_formula.ai_polished`
  - field_ai_clarifying_questions: TagInputField / required (≥ 0 items)
    - label: H3 / "AI 列的「需要再問清楚」的問題"
    - helper: Body SM / "AI 列出的問題清單（每行一個）。如果 AI 沒列任何問題，這欄可空。"
    - placeholder: "「具體」跟「不傷感情」哪個現在最頭痛？"
    - data_field: `stuck_formula.ai_clarifying_questions`
    - input_method: Enter 鍵新增一行 / 每行一個問題 / 顯示為標籤可刪除
- **states**: default / typing / loading
- **copy_constraints**: 直接引用 worksheet 林老師範例

### Section: confirmation_check

- **layout**: 區塊 + 確認 checkbox
- **elements**:
  - step_label: H2 / required / "Step 4：你能回答 AI 列的問題嗎？"
  - body: Body MD / required / "AI 列的「需要再問清楚」如果你**能回答**或**已預約找主人翁問**，就勾選確認。如果都答不出來 → 回去把卡 1 想清楚再來，去找主人翁再聊一次。"
  - checkbox: Checkbox / required
    - label: Body MD / "我能回答上面的問題（或已預約找主人翁問）"
    - data_field: `stuck_formula.confirmed`
  - retreat_action: Link / optional / "我答不出來，回去把卡 1 想清楚再來 再聊一次" / -> `/learn/worksheet/01?id={uuid}` （提示卡 3 資料會保留）
- **states**: unchecked / checked / loading
- **copy_constraints**: body 最多 80 字

### Section: example_reference

- **layout**: 全寬可摺疊面板（預設摺疊）
- **elements**:
  - toggle_header: ToggleHeader / required / "📖 看 worksheet 林老師範例"
  - example_content: ExamplePanel / required (when expanded)
    - block_1: BlockQuote / required / **AI 整理後：**
      - "「我每次要在週末寫 30 則家長回報訊息，都會卡在『資料散在週間 7 次小考、要寫得具體、不能傷家長感情』這 3 件事同時要顧。」"
    - block_2: BlockQuote / required / **AI 列的「需要再問清楚」：**
      - "1. 「具體」跟「不傷感情」哪個現在最頭痛？"
      - "2. 一週實際只有週六寫嗎？平日有沒有零碎寫過？"
      - "3. 30 個學生裡有沒有特別難寫的個案？"
  - source_link: Link / "來自 worksheet 卡片 3"
- **states**: collapsed / expanded
- **copy_constraints**: 引用 worksheet

### Section: exit_gate_footer

- **layout**: 全寬固定底部
- **elements**:
  - exit_conditions: ExitGateChecklist / required
    - condition_1: "[ ] 句子裡的兩個空格都很具體（不是「卡在效率不好」這種空話）"
    - condition_2: "[ ] AI 列的「需要再問清楚」，你能回答（或預約找主人翁問）"
  - primary_cta: Button Primary / required / "儲存並進入卡 4 →"
  - secondary_cta: Button Ghost / optional / "回到卡 2"
  - blocked_message: AlertBox / conditional
- **states**: 同卡 1/2 模式
- **copy_constraints**: blocked_message 最多 80 字

---

## [INTERACTION & STATE FLOW]

### 主要互動流程

1. 頁面載入 → 從 LocalStorage 讀 `complaint`、`people.background`、`stuck_formula` → 預填 Step 1/3 欄位
2. 使用者填 Step 1 user_draft → debounce 500ms 自動儲存 + R2.3 warning 提示
3. 使用者點擊 Step 2 「複製 prompt」 → 把 prompt 模板（已插值 verbatim + background）複製到剪貼簿 → 顯示「已複製」反饋
4. 使用者跳到外部 AI（建議在新分頁，不離開本頁）
5. 使用者貼回 AI 結果 → 填 `ai_polished` + 新增 `ai_clarifying_questions` 標籤
6. 使用者勾選 confirmation_check checkbox
7. 點擊 `primary_cta`：
   - 步驟 a：檢查 `user_draft` 非空且 minLength 15
   - 步驟 b：檢查 `confirmed === true`
   - 步驟 c：若 `user_draft` 包含 R2.3 抽象詞且使用者未補充具體細節 → blocked_message warning（不擋，但提示）
   - 步驟 d：全通過 → PATCH `current_step = 4` → 導向卡 4

### Prompt 插值邏輯

```typescript
const promptTemplate = `我有一個抱怨原句：
${painCard.complaint.verbatim}

抱怨主人翁是：
${painCard.people.background}

請幫我把它整理成「我每次要 ___，都會卡在 ___」這個句型。

規則：
1. 不要替我發明細節，只能用原句裡有的事實
2. 如果原句不夠具體，請列出 3 個我需要再問清楚的問題
3. 不要建議解決方案、不要推薦工具、不要分析市場
4. 直接給我句子，不要解釋為什麼`;
```

### RWD 行為差異

| 斷點 | 佈局 |
| :--- | :--- |
| Desktop | 全寬單欄，4 個 step 區塊垂直排列 |
| Tablet | 同 Desktop |
| Mobile | 同上，prompt_block 內 prompt 用 monospace 等寬字體 + 水平捲動 |

---

## [DATA & API]

- **uses_api**: true
- **endpoints**:
  - GET / PATCH `/api/paincards/{id}`
- **localStorage_keys**: `painmap_worksheet:cards.{id}.stuck_formula` + `user_pref.ai_tool`
- **schema_reference**: `product/data_model.md` § Card 3
- **error_cases**: 同前

---

## [EXIT GATE]

> **反思問題 100% 對應 worksheet「🚦 反思問題」段落（卡片 3）**

### 反思問題

| # | 條件 | 資料層判定 | UI 反饋 |
| :- | :--- | :--- | :--- |
| 1 | 句子裡的兩個空格都很具體（不是「卡在效率不好」這種空話） | `stuck_formula.user_draft` 非空、minLength 15、不含抽象詞 R2.3 | 欄位無 warning |
| 2 | AI 列的「需要再問清楚」你能回答（或預約找主人翁問） | `stuck_formula.confirmed === true` | checkbox 勾選 |
| 3 | user_draft 非空 | `stuck_formula.user_draft` minLength 15 | 欄位通過驗證 |

### 失敗路由

| 失敗情境 | 路由 | 友善文案 |
| :--- | :--- | :--- |
| `user_draft` 含抽象詞（R2.3） | warning（不擋）+ 提示具體化 | 「『效率不好』太抽象了。具體是什麼動作 / 步驟卡住？例：『翻 7 次成績單拼湊資料』勝過『流程不順』。」 |
| `confirmed` 未勾選 | 停留卡 3 + 高亮 confirmation_check | 「請確認你能回答 AI 列的問題（或已預約找主人翁問）。如果都答不出來 → 回去把卡 1 想清楚再來。」 |
| `user_draft` 太短 | 停留卡 3 + 高亮 user_draft 欄位 | 「請至少寫一個完整的句型句。看 worksheet 林老師範例。」 |

### 退回工作流

> 卡 3 過不了 → 退回**卡 1**

理由（引用 worksheet）：「過不了 → 回去把卡 1 想清楚再來，去找主人翁再聊一次。」

實作：
- confirmation_check 區塊提供「我答不出來，回去把卡 1 想清楚再來 再聊一次」link
- 點擊後導向卡 1，但 LocalStorage 中卡 3 已填的 user_draft 保留（避免重做）
- 修改卡 1 後，卡 3 標記為 stale（提示使用者重新對照新原句）

---

## [AI INTEGRATION]

- **AI 介入狀態**：✅ **啟用 — 校對 prompt（複製到外部 ChatGPT/Claude/Gemini）**
- **AI 角色**：
  - ✅ 校對 user_draft 的句型
  - ✅ 列出「需要再問清楚」的 3 個問題
  - ❌ 替使用者發明細節
  - ❌ 推薦解決方案
  - ❌ 分析市場
- **內建 prompt**：直接從 worksheet 卡 3 「🤖 AI 幫你校對（複製這段 prompt）」段落萃取，逐字引用，**禁止改寫**
- **Prompt 完整內容**：見上方 `ai_prompt_block` section
- **變數插值**：`{complaint_verbatim}` 與 `{people_background}` 從 LocalStorage 自動填入
- **MVP 模式**：使用者複製到外部 AI 工具跑（ChatGPT / Claude / Gemini / Perplexity）→ 把結果貼回 `ai_polished` + `ai_clarifying_questions`
- **未來模式**（M2 範圍，本 M1 不實作）：站內 LLM proxy 直接呼叫，但 prompt 內容相同
- **Fallback**：
  - 如使用者沒有 AI 工具：可直接填 `user_draft` + `confirmed = true` 跳過 AI 步驟（標記 `ai_polished = null`、`ai_clarifying_questions = []`）
  - UI 提供 toggle「我沒有 AI 工具，跳過 AI 校對」（小字 link，不主推）

### 為什麼 AI 在這張卡能介入？

| 理由 | 說明 |
| :--- | :--- |
| 使用者已有事實基礎 | 卡 1-2 確認「真原句 + 真人來源」後才允許 AI 介入 — AI 是**校對**現有事實，不是**生成**事實 |
| 句型結構化是低風險任務 | 「我每次要 X，都會卡在 Y」是固定句型，AI 失誤成本低 |
| 「列追問問題」反向強化判斷力 | AI 不直接給答案，而是指出「哪些細節你還不知道」 — 這正是判斷力訓練 |

### prompt 引用文件

- 完整 prompt 與設計理由：`references/ai_prompt_library.md` § 卡 3 prompt
- 元件規格：`design/components/ai_prompt_copy_block.md`

---

## [OCTALYSIS HOOKS]

### 主驅動力

- **#3 Empowerment of Creativity & Feedback（賦權創造）— 主驅動力**
  - 設計手法：
    - 使用者**先**寫 user_draft，再用 AI 校對 — 創造主動權在使用者
    - 「AI 列追問問題」反向訓練使用者「我哪裡還不知道」 — 賦權使用者去找答案
    - 工具選擇器（ChatGPT/Claude/Gemini/Perplexity）讓使用者自選 AI 工具

### 副驅動力

- **#2 Development & Accomplishment（成就感）— 副驅動力**
  - 設計手法：
    - 4 個 Step 清晰流程（你先寫 → 複製 prompt → 貼回 → 確認），每步可見進度
    - exit_gate_footer 條件透明
- **#1 Epic Meaning（史詩感）— 副驅動力**
  - 設計手法：
    - card_intro 強調「人 + AI 共創」 — AI 不取代你，是你的研究助理

### 設計手法清單

| 元件 | Octalysis 手法 | 說明 |
| :--- | :--- | :--- |
| user_draft_input（Step 1） | #3 Empowerment | 強迫先寫初版，避免 AI 牽著走 |
| ai_prompt_block | #3 工具選擇 | 提供 4 個工具選擇 |
| ai_response_input | #3 + #2 | 使用者主動貼回 AI 結果，是「我用 AI」非「AI 用我」 |
| confirmation_check | #3 自我評估 | 「你能回答嗎」是賦權自評 |
| stepper_header | #2 Step indicator | 進度可見，非 score |

### 反模式警告（黑帽禁用清單）

| 禁用 | 為何不能用 |
| :--- | :--- |
| ❌ 「AI 自動代寫 user_draft」按鈕 | 違反「先你寫再 AI 校對」核心訓練 |
| ❌ AI 評分使用者的 user_draft（「你的句型 75 分」） | brand 鐵律 |
| ❌ 「秒填」「一鍵生成卡關公式」 | 違反 anti-shortcut |
| ❌ AI 直接幫使用者回答 ai_clarifying_questions | 「列問題」的目的就是要使用者自己去找答案 |
| ❌ 比較「他人 user_draft 的平均長度」 | 違反 anti-comparison |
| ❌ 倒數計時器 | 違反 anti-anxiety |

### 特別警示：AI 共創的白帽邊界

- ✅ 允許：AI 校對句型、AI 列追問問題、AI 標記「需要更多細節」
- ❌ 禁止：AI 替使用者填空、AI 評分使用者輸入、AI 自動完成整張卡

---

## [BRAND LANGUAGE RULES (PAGE-SPECIFIC)]

### 禁止用語

| 禁止 | 替代 |
| :--- | :--- |
| 「AI 智慧推薦」 | 「AI 校對」「AI 列追問」 |
| 「一鍵生成」「秒填」 | 移除速成暗示 |
| 「AI 評分你的句型」 | brand 鐵律 |
| 「自動產生」 | 「你寫，AI 校對」 |
| 「AI 推薦最佳句型」 | 不出現 |

### 建議用語

| 建議 | 場景 |
| :--- | :--- |
| 「校對」「列追問」 | AI 角色描述 |
| 「你先寫」 | Step 1 強調 |
| 「複製 prompt」 | 行動導向 |
| 「貼回」 | 強調使用者主動 |
| 「確認」 | 自評 |

### 語調

- **Co-creative**：人寫，AI 校對 — 強調共創
- **Anti-laziness**：不允許跳過 Step 1
- **Tool-agnostic**：4 個 AI 工具平等對待，不推銷單一品牌

---

## [ACCEPTANCE CRITERIA]

- [ ] 8 個 Section 依序正確渲染
- [ ] 從 LocalStorage 正確讀取 `complaint.verbatim` + `people.background`
- [ ] ai_prompt_block 正確插值 `{complaint_verbatim}` 與 `{people_background}`
- [ ] **prompt 內容與 worksheet 卡 3 原文 100% 一致（逐字驗證）**
- [ ] copy_button 點擊後成功複製到剪貼簿（驗證 navigator.clipboard.writeText）
- [ ] tool_picker 4 個工具 chip 可選，選擇寫入 `user_pref.ai_tool`
- [ ] external_link 在新分頁開啟（target="_blank" + rel="noopener noreferrer"）
- [ ] field_user_draft 觸發 R2.3 抽象詞 warning（「效率不好」「沒效率」「流程不順」「不方便」）
- [ ] field_ai_clarifying_questions 用 TagInput 介面，每行一個問題
- [ ] confirmation_check checkbox 必須勾選才能 enable CTA
- [ ] retreat_action 「答不出來回去把卡 1 想清楚再來」link 正確導向，且 LocalStorage 卡 3 資料保留
- [ ] CTA 過關後 PATCH `current_step = 4` → 導向 `/learn/worksheet/04?id={uuid}`
- [ ] missing_data 狀態（卡 1/2 未完成）正確顯示 disabled
- [ ] example_reference 引用 worksheet 林老師範例
- [ ] AI 介入 badge 顯示「✅ 校對 prompt」
- [ ] 全頁面**不**出現「AI 自動代寫 user_draft」「AI 評分」「秒填」這類按鈕或文案
- [ ] 全頁面零分數 UI、零星等、零排行榜
- [ ] 鍵盤 Tab 順序：stepper → user_draft → tool_picker → copy_button → external_link → ai_polished → ai_clarifying_questions → confirmation checkbox → CTA
- [ ] 螢幕閱讀器讀出 prompt 內容（aria-label）
- [ ] LocalStorage 自動儲存
- [ ] RWD 三斷點正確
- [ ] 符合 PainMap brand 視覺規範
