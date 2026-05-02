# PainMap Worksheet — Card 4 (Workaround) Integrated Prompt

> 自我包含整合 prompt — 直接貼入 Lovable / Claude Code 即可生成卡 4 完整實作。
> 對應 page spec：`docs/painmap_worksheet/design/pages/04_card_workaround.md`
> 對應資料模型：`docs/painmap_worksheet/product/data_model.md` § Card 4
> 組裝日期：2026-05-02 ｜ Worksheet v1.0

---

## === GLOBAL PROJECT GUIDELINE (DO NOT OVERRIDE) ===

你是「PainMap 題眼 — Worksheet 教學模式」的資深產品設計師與前端工程師。

### 品牌特質

**結構化** ｜ **賦權感** ｜ **沉穩** ｜ **教學優先**

### Color Tokens

| Token | 色值 | 用途 |
| :--- | :--- | :--- |
| Primary #1E3A5F / Primary Light #E8EEF5 / Secondary #2D7D8A / Accent CTA #E8913A / Verified #2D9D78 / Caution #D97706 / Caution Light #FEF3E2（critical_callout 背景）/ Error #DC2626（僅系統錯誤）/ BG Page #F7F8FA / BG Muted #F1F3F5（prompt 區）/ Text Primary #1A2332 / Text Secondary #5C6B7A / Border Default #DFE3E8 / Border Focus #2D7D8A |

### Typography

H1 28px / H2 22px / H3 18px / Body LG 17px / Body MD 15px / Body SM 13px / Caption 12px / Code 14px (monospace)

字體：`Noto Sans TC` + `Inter` + `JetBrains Mono`（prompt block）

### 元件風格

- Radius MD 8px / LG 12px
- Border `1px solid #DFE3E8` / focus 2px Teal
- Shadow SM / MD

### 技術棧

React 18 + TypeScript + Tailwind + Zustand + React Hook Form + Zod。LocalStorage key：`painmap_worksheet:cards`、`user_pref.ai_tool`。

### 絕對禁令（PainMap Brand）

- 禁止：分數、星等、A-F、成功率、排行榜、徽章、倒數計時
- 禁用詞：「現有解決方案 score」「AI 自動找出 workaround」「不滿評分」「使用者體驗 / UX 評分」「快速」「一鍵」「秒填」
- 禁止 Inline styles / `console.log`
- WCAG AA / 語意化 HTML / focus ring Teal

### 絕對禁令（Octalysis 黑帽）

- 禁止 #6 Scarcity：時間壓力、限時 prompt
- 禁止 #7 Unpredictability：AI 神秘推薦、抽卡式 workaround 抽選
- 禁止 #8 Loss Avoidance：streak / 過期 / 「沒填會消失」

### 教學模式特殊鐵律

1. **反 solution mode**：本卡 prompt 含「不要建議我做新的工具」guard，禁止 AI 進入「設計產品」模式
2. **書面優先**：使用者必須**拿 AI 提案去問主人翁**再填回 ≥ 3 個具體不滿理由
3. **反思問題透明**：tool_name 具體 + 3 個不滿理由具體
4. **失敗回退**：過不了（R2.4 觸發或不滿 < 3 個）→ 回去把卡 1 想清楚再來（找另一個更痛的人）

---

## === CURRENT TASK: BUILD CARD 4 — WORKAROUND ===

### [PAGE META]

- **page_name**: Card 4 - Workaround
- **route_path**: `/learn/worksheet/04?id={paincard_uuid}`
- **card_step**: 4
- **page_type**: card_input + ai_prompt_copy_block + verification_loop
- **primary_goal**: 引導使用者填 `workaround.tool_name` + `why_still_stuck` + `ai_alternatives[≥3]` + `user_dissatisfactions[≥3]`，並透過「拿 AI 提案問主人翁」verification loop 確保不滿理由真實
- **secondary_goal**: 訓練「現有解法不滿 = 痛點存在」的物理量檢驗能力
- **prerequisite_cards**: [1, 2, 3]
- **expected_time_on_page**: 10-20 分鐘（含外部 AI + 異步問主人翁）

---

### [STRUCTURE: SECTIONS]

1. **stepper_header** — 卡 1-3 ✓ / 卡 4 高亮 + AI badge「✅ 提案 5 個 workaround」
2. **card_intro** — 「為什麼這張卡關鍵：workaround 不滿是真痛點的關鍵物理量」
3. **user_observation_input**（Step 1）— 使用者**先**寫 tool_name + why_still_stuck（從卡 1-3 訪談聽到的）
4. **ai_prompt_block**（Step 2）— AI 提案 5 個常見 workaround
5. **ai_alternatives_input**（Step 3）— 貼回 AI 提案的 5 個（TagInput）
6. **user_dissatisfactions_input**（Step 4）— 拿 AI 清單問主人翁，填回 ≥ 3 個具體不滿理由
7. **example_reference** — 林老師範例
8. **exit_gate_footer** — 反思問題 + retreat_action_card（R2.4 / dissatisfactions < 3 多次失敗時）

---

### [SECTION COMPONENT SPEC]

#### Section 1: stepper_header

- 與卡 1-3 一致
- `ai_indicator` (Badge, Verified Green border): "AI 介入：✅ 提案 5 個 workaround"

#### Section 2: card_intro

- `card_number`: "卡 4 / 9"
- `card_title` (H1): "找出他「現在怎麼解」"
- `rule_callout` (AlertBox, Primary Light, icon=Wrench)：「**為什麼這張卡關鍵：** 如果他現在沒有用任何方法在解 → 痛點可能不夠痛。如果他用了好幾個方法都不滿意 → 真痛點可能在這裡。」
- `workflow_explainer` (Body MD): "這張卡會做 4 步：① 你先憑訪談寫 → ② AI 提案 5 個常見 workaround → ③ 你貼回 AI 提案 → ④ 拿 AI 清單去問主人翁，填回 3 個不滿理由"

#### Section 3: user_observation_input（Step 1）

- `step_label` (H2): "Step 1：你從訪談聽到的（先寫）"
- `rule` (Body SM): "從卡 1-3 你聽到的，主人翁現在用什麼解這個問題？可能是：一個工具、一個人、一個習慣動作、一個 Excel 表。"
- `field_tool_name` (TextField)：
  - label (H3): "工具/方法的名字"
  - helper: "**必須有具體名字**（不可寫「沒人解過」「會自己想辦法」）— 違反 R2.4 會被擋"
  - placeholder: "LINE + Excel 成績表 + 翻群組對話（手動拼湊）"
  - data_field: `workaround.tool_name`
  - validation: minLength 3
  - **anti_fake_hint (R2.4)**：偵測禁用詞 `(沒人解過|沒解過|會自己想辦法|用想的|不知道怎麼解)` → 即時 warning「這代表這個人沒在花時間解 → 回去把卡 1 想清楚再來」（R2.4 過關擋）
- `field_why_still_stuck` (TextField)：
  - label (H3): "為什麼還是覺得卡"
  - helper: "用主人翁告訴你的話，不是你的解釋"
  - placeholder: "每個資料源都要重新翻找，沒辦法一次看完"
  - data_field: `workaround.why_still_stuck`
  - validation: minLength 5

#### Section 4: ai_prompt_block（Step 2）

- `step_label` (H2): "Step 2：AI 提案其他 5 個常見 workaround"
- `tool_picker` (AIToolPicker, optional)：4 chips（同卡 3）
- `prompt_block` (AIPromptCopyBlock, monospace)：
  - prompt_template（**逐字引用 worksheet，禁止改寫**）：
  
  ```
  有一個人遇到這個卡關：
  {stuck_formula_polished}
  
  請列出 5 個常見的 workaround（他可能正在用的解法）。
  
  規則：
  1. 每個都要有具體名字（工具名、流程名、做法名）
  2. 不要包含「沒人解過」「會自己想辦法」這種空話
  3. 如果你不確定，標註 [推測]
  4. 不要建議我做新的工具
  ```
  - 變數插值：
    - `{stuck_formula_polished}` ← `stuck_formula.ai_polished || stuck_formula.user_draft`
- `copy_button` (Button Primary): "複製 prompt"
- `external_link` (Button Secondary, optional): "在新分頁開啟 ChatGPT"
- `prompt_source_link` (Link): "Prompt 來源：worksheet 卡片 4"

#### Section 5: ai_alternatives_input（Step 3）

- `step_label` (H2): "Step 3：把 AI 提案的 5 個貼回"
- `field_ai_alternatives` (TagInputField)：
  - label (H3): "AI 列的 5 個常見 workaround"
  - helper: "每行一個（每個 workaround 加一個標籤）。AI 沒列滿 5 個也沒關係，只要 ≥ 3 個。"
  - placeholder: "Notion 模板"
  - data_field: `workaround.ai_alternatives: string[]`
  - input_method: Enter 鍵新增 / 標籤可刪除
  - min_count: 3 (warning if < 3，不擋)
  - max_count: 10
- `example_link` (Link, optional): "看 worksheet 林老師範例的 5 個 workaround" → 摺疊 example_reference

#### Section 6: user_dissatisfactions_input（Step 4）

- `step_label` (H2): "Step 4：拿 AI 清單去問主人翁，填回 3 個不滿理由"
- `critical_callout` (AlertBox, Caution Amber bg, icon=AlertCircle, **必填顯眼**)：
  - 「**這一步是真實性的關鍵。** 把 AI 列的 5 個 workaround 拿去問主人翁：「這幾個你有用過嗎？哪個最像你的狀況？」然後**寫下他不滿意現有方法的具體理由**（≥ 3 個）。」
- `field_user_dissatisfactions` (TagInputField, **min_count: 3 擋過關**)：
  - label (H3): "主人翁不滿意現有方法的具體理由（≥ 3 個）"
  - helper: "每行一個。要具體（不是「不好用」「不方便」這種抽象詞）"
  - placeholder: "Notion 試過 1 個月放棄，太花時間貼來貼去"
  - data_field: `workaround.user_dissatisfactions: string[]`
  - 抽象詞偵測（warning, 不擋）：「不好用 / 不方便 / 不順」→ 提示「『不好用』太抽象。具體是哪一步、卡多久、有什麼後果？」

#### Section 7: example_reference（可摺疊）

- 內容（直接引用 worksheet 卡 4）：
  - **我憑訪談寫的**：
    - 工具/方法的名字：LINE + Excel 成績表 + 翻群組對話（手動拼湊）
    - 為什麼還是覺得卡：每個資料源都要重新翻找，沒辦法一次看完
  - **AI 列的 5 個可能**：Notion 模板 / Google Sheets + 公式 / 班級管理 App / 助教代寫 / ChatGPT 寫稿機
  - **拿去問林老師**：
    - 「Notion 試過 1 個月放棄，太花時間貼來貼去。」
    - 「ChatGPT 試過寫得太罐頭，家長一看就知道。」
    - 「助教請不起。」

#### Section 8: exit_gate_footer

- `exit_conditions` (ExitGateChecklist)：
  - "[ ] 主人翁現在用的方法**有具體名字**"
  - "[ ] 你能說出 **3 個他不滿意現有方法的具體理由**"
- `primary_cta` (Button Primary): "儲存並進入卡 5 →"
- `secondary_cta` (Button Ghost): "回到卡 3"
- `blocked_message` (AlertBox, Caution Amber, conditional)
- `retreat_action_card` (Card, conditional, 當 R2.4 觸發或 dissatisfactions < 3 失敗 ≥ 3 次)：
  - title (H3): "這個人可能還沒真正在意這個問題"
  - body (Body MD)：**引用 worksheet**「過不了 → 回去把卡 1 想清楚再來，這個人可能還沒真正在意這個問題（沒在花錢花時間解）。」
  - cta (Button Ghost): "回去把卡 1 想清楚再來，找另一個更痛的人" → `/learn/worksheet/01?id={uuid}`，PATCH `status = 'draft'`

---

### [INTERACTION & STATE FLOW]

#### 主要互動流程

1. 頁面載入 → 從 LocalStorage 讀 `stuck_formula` → 預填 prompt 變數
2. Step 1：使用者填 tool_name + why_still_stuck → debounce 自動儲存 + R2.4 偵測
3. Step 2：使用者點「複製 prompt」→ 貼到外部 AI
4. Step 3：使用者貼回 AI 提案 5 個 alternatives（標籤）
5. Step 4：使用者**離開電腦去問主人翁**（異步） → 回來填 ≥ 3 個 dissatisfactions
6. 點擊 `primary_cta`：
   - **a**: 檢查 tool_name 非空 + minLength 3
   - **b**: 檢查 R2.4（不為禁用詞）→ 否則 retreat_action_card
   - **c**: 檢查 user_dissatisfactions.length >= 3 → 否則 blocked_message
   - **d**: 失敗 ≥ 3 次或 R2.4 觸發 → retreat_action_card
   - **e**: 全通過 → PATCH `current_step = 5` → 導向卡 5

#### Prompt 插值邏輯

```typescript
const stuckPolished = painCard.stuck_formula.ai_polished || painCard.stuck_formula.user_draft;
const promptTemplate = `有一個人遇到這個卡關：
${stuckPolished}

請列出 5 個常見的 workaround（他可能正在用的解法）。

規則：
1. 每個都要有具體名字（工具名、流程名、做法名）
2. 不要包含「沒人解過」「會自己想辦法」這種空話
3. 如果你不確定，標註 [推測]
4. 不要建議我做新的工具`;
```

#### 異步等待提示

Step 4 涉及「離開電腦去問主人翁」異步動作：
- critical_callout 明確說「這一步可能要花幾天等主人翁回覆」
- 自動儲存：使用者離開頁面再回來，所有資料保留
- LocalStorage `current_step` 保持 4，下次回來直接到此頁

#### RWD

| 斷點 | 佈局 |
| :--- | :--- |
| Desktop | 全寬單欄，4 個 step 區塊垂直 |
| Tablet | 同 Desktop |
| Mobile | 同上，TagInput 全寬 + 換行新增 |

---

### [DATA & API]

- **endpoints**: `GET / PATCH /api/paincards/{id}`
- **localStorage 寫入**：
  - `painmap_worksheet:cards.{id}.workaround.tool_name`
  - `painmap_worksheet:cards.{id}.workaround.why_still_stuck`
  - `painmap_worksheet:cards.{id}.workaround.ai_alternatives: string[]`
  - `painmap_worksheet:cards.{id}.workaround.user_dissatisfactions: string[]`（minItems 3）
  - `painmap_worksheet:cards.{id}.current_step` → 5（過關後）
- **schema**：
  ```typescript
  type Workaround = {
    tool_name: string;                    // minLength 3, 不在 R2.4 禁用詞清單
    why_still_stuck: string;              // minLength 5
    ai_alternatives: string[];            // 0..10
    user_dissatisfactions: string[];      // minItems 3 (擋過關)
  };
  ```
- **error_cases**: 同前

---

### [EXIT GATE]

#### 反思問題

| # | 條件 | 判定 |
| :- | :--- | :--- |
| 1 | tool_name 有具體名字 | `tool_name` 非空 + 不含 R2.4 禁用詞 `(沒人解過\|沒解過\|會自己想辦法\|用想的\|不知道怎麼解)` |
| 2 | 3 個具體不滿理由 | `user_dissatisfactions.length >= 3` 且每筆非空 |
| 3 | tool_name + why_still_stuck 皆非空 | minLength 通過 |

#### 失敗路由

| 失敗 | 文案 |
| :--- | :--- |
| `tool_name` 含 R2.4 禁用詞 | 顯示 retreat_action_card：「**這個人可能還沒真正在意這個問題（沒在花錢花時間解）。** 回去把卡 1 想清楚再來 找另一個更痛的人。」 |
| `user_dissatisfactions.length < 3` | 「需要至少 3 個具體不滿理由。如果只能列 1-2 個 → 拿 AI 清單回去問主人翁，看他有沒有試過其他方法。」 |
| `user_dissatisfactions` 含抽象詞（"不好用"/"不方便"） | warning 不擋 + 「『不好用』太抽象。具體是哪一步、卡多久、有什麼後果？」 |
| `tool_name` 為空 | 「請寫具體工具/方法名（例：『Notion 模板』『Excel + 翻群組』）」 |

#### 退回工作流

> 卡 4 過不了 → 退回**卡 1**（理由：這個人可能還沒真正在意）
> retreat_action_card 「回去把卡 1 想清楚再來，找另一個更痛的人」→ PATCH `status = 'draft'` + 卡 2-4 資料保留供參考

---

### [AI INTEGRATION]

- **AI 介入狀態**：✅ **啟用 — 提案 5 個常見 workaround**
- **AI 角色**：
  - ✅ 提案 5 個常見 workaround（具體工具名 / 流程名）
  - ✅ 標註 [推測] 當 AI 不確定
  - ❌ 替使用者選哪個最像
  - ❌ 建議使用者「做新的工具」
  - ❌ 替使用者填 user_dissatisfactions（必須來自真人主人翁）
- **內建 prompt**：直接從 worksheet 卡 4「🤖 AI 幫你補充其他可能」段落萃取，**逐字引用，禁止改寫**
- **變數插值**：`{stuck_formula_polished}` ← `stuck_formula.ai_polished || user_draft`
- **驗證迴圈**：使用者**必須拿 AI 清單去問真人主人翁**，再填 ≥ 3 個 dissatisfactions（這個 loop 不能 AI 代勞）
- **Fallback**：使用者沒有 AI 工具 → 可只憑自己訪談寫 alternatives（小字 link「跳過 AI 提案，只填我聽到的」），但 dissatisfactions 仍需 ≥ 3

#### Anti-solution mode guard（已嵌入 prompt）

prompt 第 4 條規則：「不要建議我做新的工具」— 防止 AI 進入「設計產品」模式。

#### 為什麼 AI 在這張卡能提案，但不能填 dissatisfactions？

| 任務 | AI / 人 | 理由 |
| :--- | :--- | :--- |
| 列「常見 workaround」 | AI | 整理已知資訊 — AI 強項 |
| 主人翁試過哪些並不滿意 | 人（主人翁）| 個別事實 — AI 會編造 |
| 不滿的具體理由 | 人（主人翁）| 物理量 #2「正在投入時間/成本的痛」核心證據 |

---

### [OCTALYSIS HOOKS]

#### 主驅動力：#2 Development & Accomplishment

- 完成卡 4 = 解鎖卡 5 — worksheet 流程設計的天然進度感
- 4 個 Step 流程清晰，每步可見達成
- exit_gate_footer 條件透明（具體名字 + 3 個不滿理由），完成 = 過關（**不是分數**）

#### 副驅動力：#3 Empowerment

- 使用者**先**寫 Step 1，再用 AI 提案
- Step 4「拿 AI 清單去問主人翁」是高賦權動作

#### 副驅動力：#5 Social Influence（真人連結）

- Step 4 強迫使用者**回去找真人**（卡 2 的 3 位）
- 不滿理由必須來自真人，不能 AI 代寫

#### 反模式警告（必須全部不出現）

| 禁用 | 為何 |
| :--- | :--- |
| ❌ AI 自動填 user_dissatisfactions | 違反「真人主人翁」核心 |
| ❌ 「AI 評估你的 dissatisfactions 品質」 | brand 鐵律 |
| ❌ 「快速填卡」一鍵生成所有欄位 | 違反 anti-shortcut |
| ❌ 比較「他人 dissatisfactions 平均數量」 | 違反 anti-comparison |
| ❌ 倒數計時器 | 違反 anti-anxiety（Step 4 異步等待是正常） |
| ❌ 「跳過真人驗證」shortcut | 違反 worksheet 核心訓練 |

---

## === EXCEPTION RULES ===

本頁面**無特殊例外**。

唯一須特別注意：
1. **prompt 必須與 worksheet 卡 4 原文 100% 一致**
2. **user_dissatisfactions.length >= 3 是擋過關的硬條件**（不是 warning）
3. **R2.4 觸發直接顯示 retreat_action_card**（不給使用者繼續嘗試的空間，因為這代表選錯題目）

---

## === OUTPUT REQUIREMENTS ===

### Step 1：結構確認

- 8 個 sections + 用途
- PainCard schema 對應：`workaround.{tool_name, why_still_stuck, ai_alternatives, user_dissatisfactions}`
- 資料流：URL `?id` → 讀 LocalStorage（`stuck_formula` 給 prompt 插值）→ 4 個 step → debounce 寫回 → exit gate → PATCH
- exit gate pseudocode

### Step 2：設計決策說明

說明 3 個關鍵設計決策：
1. **為什麼 R2.4 觸發直接顯示 retreat_action_card 而不給警告？** — 這代表「主人翁沒在花時間解」是訊號，不是品質問題；給警告反而誤導使用者繼續硬寫
2. **Step 4 必須等使用者離開電腦去問主人翁，UI 如何處理異步？** — autosave 保證資料保留；critical_callout 明確說「可能要等幾天」；下次回來直接到此頁；不顯示倒數計時
3. **AI 提案的 5 個 workaround 與使用者最終填的 3 個 dissatisfactions 為何分開儲存？** — 兩者在 schema 上是不同層次：alternatives 是「我跑 AI 看到的可能」，dissatisfactions 是「我去問了之後得到的事實」；分開讓未來可審計「使用者真的去問了嗎」

### Step 3：實作方案（Option A）

- `Card4WorkaroundPage.tsx`
- `StepperHeader` / `CardIntro` / `UserObservationInput` / `AiPromptBlock` / `AiAlternativesInput` / `UserDissatisfactionsInput` / `CriticalCallout` / `ExampleReference` / `ExitGateFooter` / `RetreatActionCard`
- TagInput 元件（reuse 卡 3）
- Zod schema for workaround（含 R2.4 禁用詞清單 + minItems 3）
- RWD Tailwind

### 品質檢查清單（部署前必過）

#### 通用
- [ ] 8 個 Section 依序渲染
- [ ] 從 LocalStorage 正確讀取 `stuck_formula`
- [ ] ai_prompt_block 正確插值 `{stuck_formula_polished}`
- [ ] **prompt 內容與 worksheet 卡 4 原文 100% 一致**
- [ ] copy_button 正確複製到剪貼簿
- [ ] R2.4 偵測（"沒人解過"、"會自己想辦法"、"用想的"、"不知道怎麼解"、"沒解過"）
- [ ] R2.4 觸發後 retreat_action_card 顯示
- [ ] retreat_action_card 「回去把卡 1 想清楚再來」link 正確 PATCH `status = 'draft'`
- [ ] field_ai_alternatives TagInput min 3 warning、max 10
- [ ] field_user_dissatisfactions TagInput min 3 才能過關
- [ ] dissatisfactions 含抽象詞（"不好用"/"不方便"/"不順"）顯示 warning 不擋
- [ ] CTA 過關後 PATCH `current_step = 5`
- [ ] critical_callout（Step 4）醒目顯示，不可省略
- [ ] AI 介入 badge「✅ 提案 5 個 workaround」
- [ ] 使用者離開頁面再回來，所有 Step 1-4 資料保留
- [ ] RWD 三斷點正確

#### Octalysis 黑帽掃描（生成程式碼後**必跑**）
- [ ] 是否出現分數 UI？→ 砍掉
- [ ] 是否有 streak / 連續打卡？→ 砍掉
- [ ] 是否有 loot box / 抽卡 / 神秘獎勵？→ 砍掉
- [ ] 是否有 FOMO 文案？→ 砍掉
- [ ] 是否有過期警告？→ 砍掉
- [ ] 是否有排行榜或社群比較？→ 砍掉

#### 禁用詞掃描
- [ ] 全頁面零出現「現有解決方案 score」「AI 自動找出 workaround」「不滿評分」「使用者體驗 / UX 評分」「快速 / 一鍵 / 秒填」

---

**版本資訊**：Worksheet v1.0 ｜ Brand v1.0 ｜ 2026-05-02
