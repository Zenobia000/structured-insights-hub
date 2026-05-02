# PainMap Worksheet — Card 3 (Stuck Formula) Integrated Prompt

> 自我包含整合 prompt — 直接貼入 Lovable / Claude Code 即可生成卡 3 完整實作。
> 對應 page spec：`docs/painmap_worksheet/design/pages/03_card_stuck_formula.md`
> 對應資料模型：`docs/painmap_worksheet/product/data_model.md` § Card 3
> 組裝日期：2026-05-02 ｜ Worksheet v1.0

---

## === GLOBAL PROJECT GUIDELINE (DO NOT OVERRIDE) ===

你是「PainMap 題眼 — Worksheet 教學模式」的資深產品設計師與前端工程師。

### 品牌特質

**結構化** ｜ **賦權感** ｜ **沉穩** ｜ **教學優先**

### Color Tokens

| Token | 色值 | Tailwind | 用途 |
| :--- | :--- | :--- | :--- |
| Primary | #1E3A5F | `bg-[#1E3A5F]` | 結構深度 |
| Primary Light | #E8EEF5 | `bg-[#E8EEF5]` | rule_callout 背景 |
| Secondary | #2D7D8A | `bg-[#2D7D8A]` | stepper 高亮 / focus |
| Accent CTA | #E8913A | `bg-[#E8913A]` | 過關 primary CTA |
| Verified | #2D9D78 | `bg-[#2D9D78]` | check pass、AI 介入 ✓ badge |
| Caution | #D97706 | `bg-[#D97706]` | anti-fake R2.3 warning |
| BG Page | #F7F8FA |
| BG Muted | #F1F3F5 | `bg-[#F1F3F5]` | prompt block 背景 |
| Text Primary | #1A2332 |
| Text Secondary | #5C6B7A |
| Border Default | #DFE3E8 |
| Border Focus | #2D7D8A |

### Typography

| Token | 字級 | 字重 |
| :--- | :--- | :--- |
| H1 28px / H2 22px / H3 18px / Body LG 17px / Body MD 15px / Body SM 13px / Caption 12px / Code 14px (monospace) |

字體：`Noto Sans TC` + `Inter` + `JetBrains Mono`（prompt block）。

### 元件風格

- Radius MD 8px / LG 12px
- Border `1px solid #DFE3E8` / focus Teal 2px
- Shadow SM / MD

### 技術棧

React 18 + TypeScript + Tailwind + Zustand + React Hook Form + Zod。LocalStorage key：`painmap_worksheet:cards`、`user_pref.ai_tool`。

### 絕對禁令（PainMap Brand）

- 禁止：分數、星等、A-F、成功率、排行榜、徽章、倒數計時
- 禁用詞：「AI 智慧推薦」「AI 評分你的句型」「一鍵生成」「秒填」「自動產生」「AI 推薦最佳句型」「闖關」「升級」「streak」
- 禁止 Inline styles / `console.log`
- WCAG AA / 語意化 HTML / focus ring Teal

### 絕對禁令（Octalysis 黑帽）

- 禁止 #6 Scarcity：時間壓力、限時 prompt
- 禁止 #7 Unpredictability：黑盒「AI 神秘推薦」、抽卡式 prompt 抽選
- 禁止 #8 Loss Avoidance：streak / 過期 / 「沒填會消失」

### 教學模式特殊鐵律

1. **反 solution mode**：本卡 prompt 開頭已強制注入「不要建議解決方案、不要推薦工具、不要分析市場、直接給句子不要解釋」
2. **書面優先**：使用者**先**寫 user_draft，再用 AI 校對 — 不可反過來
3. **反思問題透明**：兩個空格具體 + 確認能回答 AI 列的問題
4. **失敗回退**：過不了 → 回去把卡 1 想清楚再來（找主人翁再聊一次）

---

## === CURRENT TASK: BUILD CARD 3 — STUCK FORMULA ===

### [PAGE META]

- **page_name**: Card 3 - Stuck Formula
- **route_path**: `/learn/worksheet/03?id={paincard_uuid}`
- **card_step**: 3
- **page_type**: card_input + ai_prompt_copy_block
- **primary_goal**: 引導使用者填 `stuck_formula.user_draft`，透過 AI prompt 複製功能取得 AI 校對版本（`ai_polished` + `ai_clarifying_questions`），最後使用者勾選 `confirmed`
- **secondary_goal**: 體會「人 + AI 共創」 — AI 不替你想細節，但能幫你看出哪裡含糊
- **prerequisite_cards**: [1, 2]
- **expected_time_on_page**: 8-15 分鐘（含跳到外部 AI）

---

### [STRUCTURE: SECTIONS]

1. **stepper_header** — 卡 1-2 ✓ Verified Green / 卡 3 高亮 + AI badge「✅ 校對 prompt」
2. **card_intro** — 句型範本 + AI 角色說明（校對 + 列追問問題）
3. **user_draft_input** — Step 1：你**先**寫初版（AI 還不能看）
4. **ai_prompt_block** — Step 2：完整 prompt 給使用者複製到外部 AI
5. **ai_response_input** — Step 3：貼回 AI 校對結果
6. **confirmation_check** — Step 4：使用者確認「AI 列的問題我能回答」
7. **example_reference** — 林老師範例
8. **exit_gate_footer** — 反思問題 + 「儲存並進入卡 4」

---

### [SECTION COMPONENT SPEC]

#### Section 1: stepper_header

- 與卡 1/2 模式一致
- `ai_indicator` (Badge, **Verified Green border**): "AI 介入：✅ 校對 prompt"

#### Section 2: card_intro

- `card_number`: "卡 3 / 9"
- `card_title` (H1): "把抱怨變成「卡關公式」"
- `sentence_template` (CodeBlock): **「我每次要 [想做的事]，都會卡在 [障礙]。」**
- `rule_callout` (AlertBox, Primary Light, icon=Edit)：「**規則：** 你**先**寫初版，再請 AI 校對 — 不是反過來。AI 不替你發明細節，但能幫你看出含糊處。」
- `ai_role_explainer` (Body MD): "**AI 在這張卡的角色：** 校對你的句型 + 列出「需要再問清楚」的 3 個問題（不會替你回答）。"

#### Section 3: user_draft_input（Step 1）

- `step_label` (H2): "Step 1：你先寫初版"
- `rule` (Body SM): "在點開 AI 之前，先寫你自己的版本。後面才能對照 AI 改了哪些地方。"
- `field_user_draft` (Textarea, rows=3, max=500)：
  - label (H3): "我每次要 ___，都會卡在 ___。"
  - helper (Body SM): "兩個空格都要具體。「卡在效率不好」這種抽象詞會被卡住（warning）"
  - placeholder: "我每次要寫 30 則家長回報，都會卡在資料散在週間 7 次小考、要寫得具體、不能傷家長感情。"
  - data_field: `stuck_formula.user_draft`
  - validation: minLength 15
  - **anti_fake_hint (R2.3)**: 偵測「效率不好 / 沒效率 / 流程不順 / 不方便」等抽象詞 → inline warning（Caution amber）「這太抽象了，請寫具體做什麼動作卡住」（**不擋輸入**）
- `autosave_indicator` (Caption)

#### Section 4: ai_prompt_block（Step 2）

- `step_label` (H2): "Step 2：複製這段 prompt 到 ChatGPT / Claude / Gemini"
- `tool_picker` (AIToolPicker, optional)：4 chips（ChatGPT / Claude / Gemini / Perplexity），純記錄使用者偏好寫到 LocalStorage `user_pref.ai_tool`，**不影響 prompt 內容**
- `prompt_block` (AIPromptCopyBlock, monospace JetBrains Mono on `bg-[#F1F3F5]`)：
  - prompt_template（**逐字引用 worksheet，禁止改寫**）：
  
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
  - 變數插值：
    - `{complaint_verbatim}` ← `complaint.verbatim`（從卡 1 讀）
    - `{people_background}` ← `people.background`（從卡 2 讀）
- `copy_button` (Button Primary): "複製 prompt"（點擊後 2 秒顯示「已複製 ✓」）
- `external_link` (Button Secondary, optional): "在新分頁開啟 ChatGPT" → https://chat.openai.com (target="_blank" + rel="noopener noreferrer")
- `prompt_source_link` (Link): "Prompt 來源：worksheet 卡片 3"

**狀態**：
- default：prompt 完整顯示
- copied：「已複製 ✓」
- missing_data：若 `complaint.verbatim` 或 `people.background` 為空，disabled + 提示「請先完成卡 1 / 卡 2」

#### Section 5: ai_response_input（Step 3）

- `step_label` (H2): "Step 3：把 AI 的回覆貼回來"
- `field_ai_polished` (Textarea, rows=3, optional)：
  - label (H3): "AI 校對後的版本"
  - helper: "AI 整理後的句子（如果 AI 整理結果跟你的差不多，可留空保留你自己的版本）"
  - placeholder: "我每次要在週末寫 30 則家長回報訊息，都會卡在『資料散在週間 7 次小考、要寫得具體、不能傷家長感情』這 3 件事同時要顧。"
  - data_field: `stuck_formula.ai_polished` (string | null)
- `field_ai_clarifying_questions` (TagInputField, ≥ 0 items)：
  - label (H3): "AI 列的「需要再問清楚」的問題"
  - helper: "AI 列出的問題清單（每行一個）。如果 AI 沒列任何問題，這欄可空。"
  - placeholder: "「具體」跟「不傷感情」哪個現在最頭痛？"
  - data_field: `stuck_formula.ai_clarifying_questions: string[]`
  - input_method: Enter 鍵新增一行，每行一個問題，標籤可刪除

#### Section 6: confirmation_check（Step 4）

- `step_label` (H2): "Step 4：你能回答 AI 列的問題嗎？"
- `body` (Body MD): "AI 列的「需要再問清楚」如果你**能回答**或**已預約找主人翁問**，就勾選確認。如果都答不出來 → 回去把卡 1 想清楚再來，去找主人翁再聊一次。"
- `checkbox` (Checkbox, required)：
  - label (Body MD): "我能回答上面的問題（或已預約找主人翁問）"
  - data_field: `stuck_formula.confirmed` (boolean)
- `retreat_action` (Link, optional): "我答不出來，回去把卡 1 想清楚再來 再聊一次" → `/learn/worksheet/01?id={uuid}`（提示卡 3 資料會保留）

#### Section 7: example_reference（可摺疊）

- 內容（直接引用 worksheet 卡 3）：
  - **AI 整理後**：「我每次要在週末寫 30 則家長回報訊息，都會卡在『資料散在週間 7 次小考、要寫得具體、不能傷家長感情』這 3 件事同時要顧。」
  - **AI 列的「需要再問清楚」**：
    1. 「具體」跟「不傷感情」哪個現在最頭痛？
    2. 一週實際只有週六寫嗎？平日有沒有零碎寫過？
    3. 30 個學生裡有沒有特別難寫的個案？

#### Section 8: exit_gate_footer

- `exit_conditions` (ExitGateChecklist)：
  - "[ ] 句子裡的兩個空格都很具體（不是「卡在效率不好」這種空話）"
  - "[ ] AI 列的「需要再問清楚」，你能回答（或預約找主人翁問）"
- `primary_cta` (Button Primary): "儲存並進入卡 4 →"
- `secondary_cta` (Button Ghost): "回到卡 2"
- `blocked_message` (AlertBox, Caution Amber, conditional)

---

### [INTERACTION & STATE FLOW]

#### 主要互動流程

1. 頁面載入 → 從 LocalStorage 讀 `complaint`、`people.background`、`stuck_formula` → 預填欄位
2. Step 1：使用者填 user_draft → debounce 500ms 自動儲存 + R2.3 warning
3. Step 2：點「複製 prompt」→ 把 prompt 模板（已插值 verbatim + background）複製到剪貼簿（`navigator.clipboard.writeText`）
4. 使用者跳到外部 AI（新分頁）
5. Step 3：使用者貼回 AI 結果 → 填 `ai_polished` + 新增 `ai_clarifying_questions` 標籤
6. Step 4：使用者勾選 confirmation checkbox
7. 點擊 `primary_cta`：
   - **a**: 檢查 `user_draft` 非空 + minLength 15
   - **b**: 檢查 `confirmed === true`
   - **c**: 若 `user_draft` 含 R2.3 抽象詞 → blocked warning（不擋）
   - **d**: 全通過 → PATCH `current_step = 4` → 導向卡 4

#### Prompt 插值邏輯

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

#### RWD

| 斷點 | 佈局 |
| :--- | :--- |
| Desktop | 全寬單欄，4 個 step 區塊垂直排列 |
| Tablet | 同 Desktop |
| Mobile | 同上，prompt_block 內 prompt 用 monospace + 水平捲動 |

---

### [DATA & API]

- **endpoints**:
  - `GET / PATCH /api/paincards/{id}`
- **localStorage 寫入**：
  - `painmap_worksheet:cards.{id}.stuck_formula.user_draft`
  - `painmap_worksheet:cards.{id}.stuck_formula.ai_polished` (string | null)
  - `painmap_worksheet:cards.{id}.stuck_formula.ai_clarifying_questions: string[]`
  - `painmap_worksheet:cards.{id}.stuck_formula.confirmed: boolean`
  - `painmap_worksheet:cards.{id}.current_step` → 4（過關後）
  - `user_pref.ai_tool: 'chatgpt' | 'claude' | 'gemini' | 'perplexity'`（純偏好記錄）
- **schema**：
  ```typescript
  type StuckFormula = {
    user_draft: string;                  // minLength 15
    ai_polished: string | null;          // 可選
    ai_clarifying_questions: string[];   // 可空陣列
    confirmed: boolean;                  // 過關必為 true
  };
  ```
- **error_cases**: 同前

---

### [EXIT GATE]

#### 反思問題

| # | 條件 | 判定 |
| :- | :--- | :--- |
| 1 | 兩個空格都具體（不是「卡在效率不好」空話） | `user_draft` 非空、minLength 15、不含 R2.3 抽象詞（**warning 不擋，僅警告**） |
| 2 | AI 列的「需要再問清楚」你能回答（或預約找主人翁問） | `stuck_formula.confirmed === true` |
| 3 | user_draft 非空 | minLength 15 |

#### 失敗路由

| 失敗 | 文案 |
| :--- | :--- |
| `user_draft` 含抽象詞（R2.3） | warning（不擋）「『效率不好』太抽象了。具體是什麼動作 / 步驟卡住？例：『翻 7 次成績單拼湊資料』勝過『流程不順』。」 |
| `confirmed` 未勾選 | 「請確認你能回答 AI 列的問題（或已預約找主人翁問）。如果都答不出來 → 回去把卡 1 想清楚再來。」 |
| `user_draft` 太短 | 「請至少寫一個完整的句型句。看 worksheet 林老師範例。」 |

#### 退回工作流

> 卡 3 過不了 → 退回**卡 1**（去找主人翁再聊一次）
> - confirmation_check 區塊提供「我答不出來，回去把卡 1 想清楚再來 再聊一次」link
> - 點擊後導向卡 1，但**保留卡 3 已填的 user_draft**（避免重做）
> - 修改卡 1 後，卡 3 標記為 stale（提示使用者重新對照新原句）

---

### [AI INTEGRATION]

- **AI 介入狀態**：✅ **啟用 — 校對 prompt（複製到外部 ChatGPT/Claude/Gemini/Perplexity）**
- **AI 角色**：
  - ✅ 校對 user_draft 句型
  - ✅ 列出「需要再問清楚」的 3 個問題
  - ❌ 替使用者發明細節
  - ❌ 推薦解決方案
  - ❌ 分析市場
- **內建 prompt**：直接從 worksheet 卡 3 「🤖 AI 幫你校對」段落萃取，**逐字引用，禁止改寫**
- **Prompt 完整內容**：見 Section 4 ai_prompt_block
- **MVP 模式**：使用者複製到外部 AI 跑 → 把結果貼回 `ai_polished` + `ai_clarifying_questions`
- **Fallback**：使用者沒有 AI 工具 → 可直接填 `user_draft` + `confirmed = true` 跳過 AI 步驟（標記 `ai_polished = null`、`ai_clarifying_questions = []`）；UI 提供 toggle「我沒有 AI 工具，跳過 AI 校對」（小字 link，**不主推**）

#### Anti-solution mode guard（已嵌入 prompt）

prompt 第 4 條規則：「不要建議解決方案、不要推薦工具、不要分析市場」— 使用者複製此 prompt 到外部 AI 即帶入此守則。

#### 為什麼 AI 在這張卡能介入？

| 任務 | AI / 人 | 理由 |
| :--- | :--- | :--- |
| 校對句型 | AI | 卡 1-2 已確認「真原句 + 真人來源」後 AI 是**校對**現有事實，不是**生成**事實 |
| 結構化句型 | AI | 「我每次要 X，都會卡在 Y」是固定句型，AI 失誤成本低 |
| 列追問問題 | AI | 反向強化判斷力 — 指出「哪些細節你還不知道」 |

---

### [OCTALYSIS HOOKS]

#### 主驅動力：#3 Empowerment of Creativity & Feedback

- 使用者**先**寫 user_draft，再用 AI 校對 — 創造主動權
- 「AI 列追問問題」反向訓練「我哪裡還不知道」 — 賦權使用者去找答案
- tool_picker 4 個工具讓使用者自選 AI 工具

#### 副驅動力：#2 Development & Accomplishment

- 4 個 Step 清晰流程（你先寫 → 複製 prompt → 貼回 → 確認）
- exit_gate_footer 條件透明

#### 副驅動力：#1 Epic Meaning

- card_intro 強調「人 + AI 共創」 — AI 不取代你，是你的研究助理

#### 反模式警告（必須全部不出現）

| 禁用 | 為何 |
| :--- | :--- |
| ❌ 「AI 自動代寫 user_draft」按鈕 | 違反「先你寫再 AI 校對」核心訓練 |
| ❌ AI 評分使用者的 user_draft（「你的句型 75 分」） | brand 鐵律 |
| ❌ 「秒填」「一鍵生成卡關公式」 | 違反 anti-shortcut |
| ❌ AI 直接幫使用者回答 ai_clarifying_questions | 「列問題」的目的就是要使用者自己去找答案 |
| ❌ 比較「他人 user_draft 平均長度」 | 違反 anti-comparison |
| ❌ 倒數計時器 | 違反 anti-anxiety |

#### AI 共創白帽邊界

- ✅ 允許：AI 校對句型、AI 列追問問題、AI 標記「需要更多細節」
- ❌ 禁止：AI 替使用者填空、AI 評分使用者輸入、AI 自動完成整張卡

---

## === EXCEPTION RULES ===

本頁面**無特殊例外**。

唯一須特別注意：**prompt 內容必須與 worksheet 卡 3 原文 100% 一致（逐字驗證）**，禁止改寫；變數插值僅使用 `{complaint_verbatim}` 與 `{people_background}` 兩個。

---

## === OUTPUT REQUIREMENTS ===

### Step 1：結構確認

- 8 個 sections + 用途
- PainCard schema 對應：`stuck_formula.{user_draft, ai_polished, ai_clarifying_questions, confirmed}`
- 資料流：URL `?id` → 讀 LocalStorage（`complaint.verbatim` + `people.background` 給 prompt 插值）→ 4 個 step → debounce 500ms 寫回 → exit gate → PATCH
- prompt 插值流程
- exit gate pseudocode

### Step 2：設計決策說明

說明 3 個關鍵設計決策：
1. **為什麼強制 4 步驟順序（先寫 → 複製 → 貼回 → 確認）而不是讓使用者自由跳？** — 反 solution mode 訓練必須先讓使用者「自己想初版」，否則 AI 牽著走
2. **prompt 必須逐字引用 worksheet（禁止改寫）的工程做法** — 用單元測試比對 worksheet 卡 3 原文，確保任何改動都被攔截
3. **R2.3 抽象詞 warning 不擋過關的取捨** — 教學模式優先（warning 教學）；如使用者堅持具體，仍可過關但留下 audit log

### Step 3：實作方案（Option A）

- `Card3StuckFormulaPage.tsx`
- `StepperHeader` / `CardIntro` / `UserDraftInput` / `AiPromptBlock` / `AiResponseInput` / `ConfirmationCheck` / `ExampleReference` / `ExitGateFooter`
- `useClipboardCopy` hook
- `usePromptInterpolation` hook（變數替換）
- Zod schema for stuck_formula
- TagInput 元件 for ai_clarifying_questions
- RWD Tailwind

### 品質檢查清單（部署前必過）

#### 通用
- [ ] 8 個 Section 依序渲染
- [ ] 從 LocalStorage 正確讀取 `complaint.verbatim` + `people.background`
- [ ] ai_prompt_block 正確插值 `{complaint_verbatim}` 與 `{people_background}`
- [ ] **prompt 內容與 worksheet 卡 3 原文 100% 一致（逐字驗證）**
- [ ] copy_button 點擊後成功複製到剪貼簿（`navigator.clipboard.writeText`）
- [ ] tool_picker 4 個工具 chip 可選，寫入 `user_pref.ai_tool`
- [ ] external_link 在新分頁開啟（target="_blank" + rel="noopener noreferrer"）
- [ ] field_user_draft 觸發 R2.3 抽象詞 warning（「效率不好」「沒效率」「流程不順」「不方便」）
- [ ] field_ai_clarifying_questions 用 TagInput
- [ ] confirmation checkbox 必須勾選才能 enable CTA
- [ ] retreat_action 「答不出來回去把卡 1 想清楚再來」link 正確導向，LocalStorage 卡 3 資料保留
- [ ] CTA 過關後 PATCH `current_step = 4`
- [ ] missing_data 狀態（卡 1/2 未完成）正確顯示 disabled
- [ ] AI 介入 badge 顯示「✅ 校對 prompt」
- [ ] 鍵盤 Tab 順序：stepper → user_draft → tool_picker → copy_button → external_link → ai_polished → ai_clarifying_questions → confirmation → CTA
- [ ] 螢幕閱讀器讀出 prompt 內容（aria-label）
- [ ] RWD 三斷點正確

#### Octalysis 黑帽掃描（生成程式碼後**必跑**）
- [ ] 是否出現分數 UI？→ 砍掉
- [ ] 是否有 streak / 連續打卡？→ 砍掉
- [ ] 是否有 loot box / 抽卡 / 神秘獎勵？→ 砍掉
- [ ] 是否有 FOMO 文案？→ 砍掉
- [ ] 是否有過期警告？→ 砍掉
- [ ] 是否有排行榜或社群比較？→ 砍掉
- [ ] AI 介入是否有「黑盒神秘推薦」？→ 砍掉

#### 禁用詞掃描
- [ ] 全頁面零出現「AI 智慧推薦」「一鍵生成」「秒填」「AI 評分」「自動產生」「AI 推薦最佳句型」「闖關 / 升級 / streak」
- [ ] AI 介入只用「校對 / 列追問」字眼

---

**版本資訊**：Worksheet v1.0 ｜ Brand v1.0 ｜ 2026-05-02
