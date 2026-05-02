# Page-Level Prompt: Card 4 — 現在怎麼解

> Worksheet 第四張卡片。對應「卡片 4 ｜ 找出他現在怎麼解」。使用者填工具/方法名 + 為什麼還卡，AI 介入提案 5 個常見 workaround。**重點：使用者必須拿 AI 提案去問主人翁，再填回 ≥ 3 個具體不滿理由。** 過不了 → 回去把卡 1 想清楚再來（這個人沒在花時間解）。

---

## [PAGE META]

- **page_name**: Card 4 - Workaround
- **route_path**: `/learn/worksheet/04?id={paincard_uuid}`
- **page_type**: worksheet_card (input form + AI prompt copy block + verification loop)
- **primary_goal**: 引導使用者填入 `workaround.tool_name` + `workaround.why_still_stuck` + `workaround.ai_alternatives[5]` + `workaround.user_dissatisfactions[≥3]`，並透過「拿 AI 提案問主人翁」的 verification loop 確保不滿理由是真實的
- **secondary_goal**: 訓練「現有解法不滿 = 痛點存在」的物理量檢驗能力（worksheet 進階詞彙：物理量 #2 — 正在投入時間/成本的痛）
- **target_users**: 已通過卡 3 的使用者
- **entry_point**: 卡 3 過關後 PATCH 跳轉 / LocalStorage 恢復 `current_step === 4`
- **expected_time_on_page**: 10-20 分鐘（含跳到外部 AI 跑 prompt + 回去問主人翁 — 後者通常異步完成）
- **corresponds_to_worksheet**: `docs/workshop/painpoint_beginner_worksheet.md` 卡片 4
- **corresponds_to_data_model**: `PainCard.workaround` 物件

---

## [STRUCTURE: SECTIONS]

1. **stepper_header**
2. **card_intro**
   - section_purpose: 說明「workaround 不滿是真痛點的關鍵物理量」
3. **user_observation_input** (Step 1: 你憑訪談寫的)
   - section_purpose: 使用者填 tool_name + why_still_stuck（從卡 1-3 訪談中聽到的）
4. **ai_prompt_block** (Step 2: AI 提案 5 個 workaround)
5. **ai_alternatives_input** (Step 3: 貼回 AI 提案的 5 個)
6. **user_dissatisfactions_input** (Step 4: 拿 AI 清單問主人翁，填回不滿)
7. **example_reference**
8. **exit_gate_footer**

---

## [SECTION COMPONENT SPEC]

### Section: stepper_header

- 與卡 1-3 一致
- ai_indicator: Badge (Verified Green border) / required / "AI 介入：✅ 提案 5 個 workaround"

### Section: card_intro

- **layout**: 全寬，標題 + 說明區
- **elements**:
  - card_number: Eyebrow / required / "卡 4 / 9"
  - card_title: H1 / required / "找出他「現在怎麼解」"
  - rule_callout: AlertBox (Primary Light bg) / required
    - icon: Wrench
    - text: Body MD / "**為什麼這張卡關鍵：** 如果他現在沒有用任何方法在解 → 痛點可能不夠痛。如果他用了好幾個方法都不滿意 → 真痛點可能在這裡。"
  - workflow_explainer: Body MD / required / "這張卡會做 4 步：① 你先憑訪談寫 → ② AI 提案 5 個常見 workaround → ③ 你貼回 AI 提案 → ④ 拿 AI 清單去問主人翁，填回 3 個不滿理由"
- **states**: default / loading
- **copy_constraints**: card_title 最多 12 字

### Section: user_observation_input (Step 1)

- **layout**: 編號區塊 + 表單
- **elements**:
  - step_label: H2 / required / "Step 1：你從訪談聽到的（先寫）"
  - rule: Body SM / required / "從卡 1-3 你聽到的，主人翁現在用什麼解這個問題？可能是：一個工具、一個人、一個習慣動作、一個 Excel 表。"
  - field_tool_name: TextField / required
    - label: H3 / "工具/方法的名字"
    - helper: Body SM / "**必須有具體名字**（不可寫「沒人解過」「會自己想辦法」）— 違反 R2.4 會被擋"
    - placeholder: "LINE + Excel 成績表 + 翻群組對話（手動拼湊）"
    - data_field: `workaround.tool_name`
    - validation: minLength 3
    - anti_fake_hint: 偵測 R2.4 禁用詞（"沒人解過"、"沒解過"、"會自己想辦法"、"用想的"、"不知道怎麼解"），即時 warning「這代表這個人沒在花時間解 → 回去把卡 1 想清楚再來」
  - field_why_still_stuck: TextField / required
    - label: H3 / "為什麼還是覺得卡"
    - helper: Body SM / "用主人翁告訴你的話，不是你的解釋"
    - placeholder: "每個資料源都要重新翻找，沒辦法一次看完"
    - data_field: `workaround.why_still_stuck`
    - validation: minLength 5
- **states**: default / focus / warning / error / loading
- **copy_constraints**: helper 最多 35 字

### Section: ai_prompt_block (Step 2)

- **layout**: 步驟區塊 + 完整 prompt 複製 widget
- **elements**:
  - step_label: H2 / required / "Step 2：AI 提案其他 5 個常見 workaround"
  - tool_picker: AIToolPicker / optional / 4 個 chip（同卡 3）
  - prompt_block: AIPromptCopyBlock / required
    - prompt_template: 直接從 worksheet 卡 4「🤖 AI 幫你補充其他可能（複製這段 prompt）」段落萃取，**不重寫**
    - 內含變數：
      - `{stuck_formula_polished}` ← `stuck_formula.ai_polished` 或 `stuck_formula.user_draft`
    - 最終文字：
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
  - copy_button: Button Primary / required / "複製 prompt"
  - external_link: Button Secondary / optional / "在新分頁開啟 ChatGPT"
  - prompt_source_link: Link / required / "Prompt 來源：worksheet 卡片 4"
- **states**:
  - default: prompt 完整顯示
  - copied: 「已複製 ✓」
  - missing_data: 如 `stuck_formula` 為空，disabled + 提示「請先完成卡 3」
  - loading: Skeleton
- **copy_constraints**: prompt 內容**逐字引用 worksheet**

### Section: ai_alternatives_input (Step 3)

- **layout**: 步驟區塊 + 標籤輸入
- **elements**:
  - step_label: H2 / required / "Step 3：把 AI 提案的 5 個貼回"
  - field_ai_alternatives: TagInputField / required
    - label: H3 / "AI 列的 5 個常見 workaround"
    - helper: Body SM / "每行一個（每個 workaround 加一個標籤）。AI 沒列滿 5 個也沒關係，只要 ≥ 3 個。"
    - placeholder: "Notion 模板"
    - data_field: `workaround.ai_alternatives`
    - input_method: Enter 鍵新增 / 標籤可刪除
    - min_count: 3 (warning if < 3)
    - max_count: 10
  - example_link: Link / optional / "看 worksheet 林老師範例的 5 個 workaround" / 摺疊 example_reference
- **states**: default / typing / loading
- **copy_constraints**: helper 最多 35 字

### Section: user_dissatisfactions_input (Step 4)

- **layout**: 步驟區塊 + 標籤輸入 + 重要提示
- **elements**:
  - step_label: H2 / required / "Step 4：拿 AI 清單去問主人翁，填回 3 個不滿理由"
  - critical_callout: AlertBox (Caution Amber bg) / required
    - icon: AlertCircle
    - text: Body MD / "**這一步是真實性的關鍵。** 把 AI 列的 5 個 workaround 拿去問主人翁：「這幾個你有用過嗎？哪個最像你的狀況？」然後**寫下他不滿意現有方法的具體理由**（≥ 3 個）。"
  - field_user_dissatisfactions: TagInputField / required (≥ 3 items)
    - label: H3 / "主人翁不滿意現有方法的具體理由（≥ 3 個）"
    - helper: Body SM / "每行一個。要具體（不是「不好用」「不方便」這種抽象詞）"
    - placeholder: "Notion 試過 1 個月放棄，太花時間貼來貼去"
    - data_field: `workaround.user_dissatisfactions`
    - input_method: Enter 鍵新增 / 標籤可刪除
    - min_count: 3 (擋過關)
- **states**: default / typing / warning (count < 3) / loading
- **copy_constraints**: critical_callout 最多 80 字

### Section: example_reference

- **layout**: 全寬可摺疊（預設摺疊）
- **elements**:
  - toggle_header: ToggleHeader / required / "📖 看 worksheet 林老師範例"
  - example_content: ExamplePanel / required (when expanded)
    - block_1: BlockQuote / required / **我憑訪談寫的：**
      - "工具/方法的名字：LINE + Excel 成績表 + 翻群組對話（手動拼湊）"
      - "為什麼還是覺得卡：每個資料源都要重新翻找，沒辦法一次看完"
    - block_2: BlockQuote / required / **AI 列的 5 個可能：**
      - "1. Notion 模板（標準學生回報模板）"
      - "2. Google Sheets + 公式（自動拉成績）"
      - "3. 班級管理 App（如：1 對 1 補教系統）"
      - "4. 助教代寫"
      - "5. ChatGPT 寫稿機（直接餵成績丟出草稿）"
    - block_3: BlockQuote / required / **拿去問林老師：**
      - "「Notion 試過 1 個月放棄，太花時間貼來貼去。」"
      - "「ChatGPT 試過寫得太罐頭，家長一看就知道。」"
      - "「助教請不起。」"
  - source_link: Link / "來自 worksheet 卡片 4"
- **states**: collapsed / expanded
- **copy_constraints**: 引用 worksheet

### Section: exit_gate_footer

- **layout**: 全寬固定底部
- **elements**:
  - exit_conditions: ExitGateChecklist / required
    - condition_1: "[ ] 主人翁現在用的方法**有具體名字**"
    - condition_2: "[ ] 你能說出 **3 個他不滿意現有方法的具體理由**"
  - primary_cta: Button Primary / required / "儲存並進入卡 5 →"
  - secondary_cta: Button Ghost / optional / "回到卡 3"
  - blocked_message: AlertBox / conditional
  - retreat_action_card: Card / conditional / 當 R2.4 觸發或 dissatisfactions < 3 多次失敗時顯示
    - title: H3 / "這個人可能還沒真正在意這個問題"
    - body: Body MD / 引用 worksheet：「過不了 → 回去把卡 1 想清楚再來，這個人可能還沒真正在意這個問題（沒在花錢花時間解）。」
    - cta: Button Ghost / "回去把卡 1 想清楚再來，找另一個更痛的人" / -> `/learn/worksheet/01?id={uuid}`
- **states**:
  - default: CTA disabled
  - all_required_filled: CTA Active
  - clicked_with_failure_first: 顯示 blocked_message
  - clicked_with_failure_third+ or R2.4_triggered: 顯示 retreat_action_card
- **copy_constraints**: blocked_message 最多 80 字

---

## [INTERACTION & STATE FLOW]

### 主要互動流程

1. 頁面載入 → 從 LocalStorage 讀 `stuck_formula` → 預填 prompt 變數
2. Step 1：使用者填 tool_name + why_still_stuck → debounce 自動儲存 + R2.4 偵測
3. Step 2：使用者點擊「複製 prompt」→ 貼到外部 AI
4. Step 3：使用者貼回 AI 提案的 5 個 alternatives（標籤形式）
5. Step 4：使用者**離開電腦去問主人翁**（異步） → 回來填 ≥ 3 個 dissatisfactions
6. 點擊 `primary_cta`：
   - 步驟 a：檢查 tool_name 非空且 minLength 3
   - 步驟 b：檢查 R2.4（不為禁用詞「沒人解過」等）→ 否則 retreat_action_card
   - 步驟 c：檢查 user_dissatisfactions.length >= 3 → 否則 blocked_message
   - 步驟 d：失敗 ≥ 3 次或 R2.4 觸發 → retreat_action_card
   - 步驟 e：全通過 → PATCH `current_step = 5` → 導向卡 5

### Prompt 插值邏輯

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

### 異步等待提示

Step 4 涉及「離開電腦去問主人翁」這個異步動作。UI 提示：

- critical_callout 明確說「這一步可能要花幾天等主人翁回覆」
- 自動儲存 — 使用者離開頁面再回來，所有資料保留
- LocalStorage `current_step` 保持 4，下次回來直接到此頁

### RWD 行為差異

| 斷點 | 佈局 |
| :--- | :--- |
| Desktop | 全寬單欄，4 個 step 區塊垂直 |
| Tablet | 同 Desktop |
| Mobile | 同上，TagInput 用全寬輸入框 + 換行新增 |

---

## [DATA & API]

- **uses_api**: true
- **endpoints**: GET / PATCH `/api/paincards/{id}`
- **localStorage_keys**: `painmap_worksheet:cards.{id}.workaround`
- **schema_reference**: `product/data_model.md` § Card 4 + JSON Schema `workaround` (`user_dissatisfactions` minItems 3)
- **error_cases**: 同前

---

## [EXIT GATE]

> **反思問題 100% 對應 worksheet「🚦 反思問題」段落（卡片 4）**

### 反思問題

| # | 條件 | 資料層判定 | UI 反饋 |
| :- | :--- | :--- | :--- |
| 1 | 主人翁現在用的方法有具體名字 | `workaround.tool_name` 非空 + 不含 R2.4 禁用詞 | 欄位無 warning |
| 2 | 你能說出 3 個他不滿意現有方法的具體理由 | `workaround.user_dissatisfactions.length >= 3` 且每筆非空 | 標籤數量 ≥ 3 |
| 3 | tool_name + why_still_stuck 皆非空 | minLength 通過 | 欄位通過驗證 |

### 失敗路由

| 失敗情境 | 路由 | 友善文案 |
| :--- | :--- | :--- |
| `tool_name` 含 R2.4 禁用詞（「沒人解過」/「會自己想辦法」/「用想的」） | 顯示 retreat_action_card | 「**這個人可能還沒真正在意這個問題（沒在花錢花時間解）。** 回去把卡 1 想清楚再來 找另一個更痛的人。」 |
| `user_dissatisfactions.length < 3` | 停留卡 4 + 高亮 dissatisfactions 欄位 | 「需要至少 3 個具體不滿理由。如果只能列 1-2 個 → 拿 AI 清單回去問主人翁，看他有沒有試過其他方法。」 |
| `user_dissatisfactions` 中含抽象詞（「不好用」「不方便」） | warning 不擋 + 提示具體化 | 「『不好用』太抽象。具體是哪一步、卡多久、有什麼後果？」 |
| `tool_name` 為空 | 高亮欄位 | 「請寫具體工具/方法名（例：『Notion 模板』『Excel + 翻群組』）」 |

### 退回工作流

> 卡 4 過不了 → 退回**卡 1**

理由（引用 worksheet）：「過不了 → 回去把卡 1 想清楚再來，這個人可能還沒真正在意這個問題（沒在花錢花時間解）。」

實作：
- retreat_action_card 提供「回去把卡 1 想清楚再來，找另一個更痛的人」link
- 點擊後導向卡 1，但**將 PainCard 標記 `status = 'draft'`**，提示使用者「你可能需要重選主人翁 — 卡 2-4 的資料保留供參考」

---

## [AI INTEGRATION]

- **AI 介入狀態**：✅ **啟用 — 提案 5 個常見 workaround（複製到外部 ChatGPT/Claude/Gemini）**
- **AI 角色**：
  - ✅ 提案 5 個常見 workaround（具體工具名 / 流程名）
  - ✅ 標註 [推測] 當 AI 不確定
  - ❌ 替使用者選哪個最像
  - ❌ 建議使用者「做新的工具」
  - ❌ 替使用者填 user_dissatisfactions（這必須來自真人主人翁）
- **內建 prompt**：直接從 worksheet 卡 4「🤖 AI 幫你補充其他可能」段落萃取，**逐字引用，禁止改寫**
- **變數插值**：`{stuck_formula_polished}` ← `stuck_formula.ai_polished || stuck_formula.user_draft`
- **MVP 模式**：使用者複製到外部 AI 跑 → 貼回 5 個 alternatives
- **驗證迴圈**：使用者**必須拿 AI 清單去問真人主人翁**，再填 ≥ 3 個 dissatisfactions（這個 loop 不能 AI 代勞）
- **Fallback**：如使用者沒有 AI 工具：可只憑自己訪談寫 alternatives（小字 link「跳過 AI 提案，只填我聽到的」），但 dissatisfactions 仍需 ≥ 3

### 為什麼 AI 在這張卡能提案，但不能填 dissatisfactions？

| 任務 | AI / 人 | 理由 |
| :--- | :--- | :--- |
| 列「常見 workaround」 | AI | 這是「整理已知資訊」 — AI 強項 |
| 主人翁試過哪些並不滿意 | 人（主人翁）| 這是個別事實 — AI 會編造 |
| 不滿的具體理由 | 人（主人翁）| 這是物理量 #2「正在投入時間/成本的痛」的核心證據 |

### prompt 引用文件

- 完整 prompt：`references/ai_prompt_library.md` § 卡 4 prompt
- 元件：`design/components/ai_prompt_copy_block.md`

---

## [OCTALYSIS HOOKS]

### 主驅動力

- **#2 Development & Accomplishment（成就感）— 主驅動力**
  - 設計手法：
    - 完成卡 4 = 解鎖卡 5（兩件事不能同時要） — 這是 worksheet 流程設計的天然進度感
    - 4 個 Step 流程清晰，每步可見達成
    - exit_gate_footer 條件透明（具體名字 + 3 個不滿理由），完成 = 過關（不是分數）

### 副驅動力

- **#3 Empowerment of Creativity & Feedback（賦權創造）— 副驅動力**
  - 設計手法：
    - 使用者**先**寫 Step 1，再用 AI 提案 — 創造主動權
    - Step 4「拿 AI 清單去問主人翁」是高賦權動作（你決定問什麼）
- **#5 Social Influence（真人連結）— 副驅動力**
  - 設計手法：
    - Step 4 強迫使用者**回去找真人**（卡 2 的 3 位）— 強化真實社交關係
    - 不滿理由必須來自真人，不能 AI 代寫

### 設計手法清單

| 元件 | Octalysis 手法 | 說明 |
| :--- | :--- | :--- |
| user_observation_input（Step 1） | #3 賦權 | 先你寫 |
| ai_prompt_block | #3 工具選擇 | AI 是助理 |
| user_dissatisfactions_input（Step 4） | #5 真人連結 | 必須回去問真人 |
| critical_callout | #1 史詩感 | 強調「這一步是真實性的關鍵」 |
| retreat_action_card | #2 容錯機制 | 失敗也是訊號，不是失敗 |

### 反模式警告（黑帽禁用清單）

| 禁用 | 為何不能用 |
| :--- | :--- |
| ❌ AI 自動填 user_dissatisfactions | 違反「真人主人翁」核心 |
| ❌ 「AI 評估你的 dissatisfactions 品質」 | brand 鐵律 |
| ❌ 「快速填卡」一鍵生成所有欄位 | 違反 anti-shortcut |
| ❌ 比較「他人 dissatisfactions 平均數量」 | 違反 anti-comparison |
| ❌ 倒數計時器 | 違反 anti-anxiety（Step 4 異步等待是正常） |
| ❌ 「跳過真人驗證」shortcut | 違反 worksheet 核心訓練 |

---

## [BRAND LANGUAGE RULES (PAGE-SPECIFIC)]

### 禁止用語

| 禁止 | 替代 |
| :--- | :--- |
| 「現有解決方案 score」 | 不出現 |
| 「AI 自動找出 workaround」 | 「AI 提案 5 個常見 workaround」 |
| 「不滿評分」 | 「具體不滿理由」 |
| 「使用者體驗 / UX 評分」 | 不出現 |

### 建議用語

| 建議 | 場景 |
| :--- | :--- |
| 「workaround」「現有解法」 | 中性技術詞 |
| 「具體不滿理由」 | 強調具體性 |
| 「拿去問主人翁」 | 強調真人驗證 |
| 「物理量 #2」 | 進階詞彙（教學模式可顯示） |

### 語調

- **Practical**：強調「具體、可查證、來自真人」
- **Anti-shortcut**：4 個 Step 都不能跳
- **Realistic about timing**：明確說 Step 4 可能要等幾天

---

## [ACCEPTANCE CRITERIA]

- [ ] 8 個 Section 依序正確渲染
- [ ] 從 LocalStorage 正確讀取 `stuck_formula`
- [ ] ai_prompt_block 正確插值 `{stuck_formula_polished}`
- [ ] **prompt 內容與 worksheet 卡 4 原文 100% 一致（逐字驗證）**
- [ ] copy_button 正確複製到剪貼簿
- [ ] R2.4 偵測（"沒人解過"、"會自己想辦法"、"用想的"、"不知道怎麼解"、"沒解過"）
- [ ] R2.4 觸發後 retreat_action_card 顯示
- [ ] retreat_action_card 「回去把卡 1 想清楚再來」link 正確 PATCH `status = 'draft'`
- [ ] field_ai_alternatives 用 TagInput，min 3、max 10
- [ ] field_user_dissatisfactions TagInput，min 3 才能過關
- [ ] dissatisfactions 含抽象詞（"不好用"/"不方便"/"不順"）顯示 warning 不擋
- [ ] CTA 過關後 PATCH `current_step = 5` → 導向 `/learn/worksheet/05?id={uuid}`
- [ ] critical_callout（Step 4）醒目顯示
- [ ] example_reference 引用 worksheet 林老師範例
- [ ] AI 介入 badge 顯示「✅ 提案 5 個 workaround」
- [ ] 全頁面**不**出現「AI 自動填 dissatisfactions」「AI 評估」「快速填卡」
- [ ] 全頁面零分數 UI、零星等、零排行榜
- [ ] 鍵盤 Tab 順序正確
- [ ] 螢幕閱讀器讀出 critical_callout
- [ ] LocalStorage 自動儲存
- [ ] 使用者離開頁面再回來，所有 Step 1-4 資料保留
- [ ] RWD 三斷點正確
- [ ] 符合 PainMap brand 視覺規範
