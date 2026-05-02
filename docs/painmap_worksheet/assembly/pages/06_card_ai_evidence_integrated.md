# PainMap Worksheet — Card 6 (AI Evidence Collection) Integrated Prompt

> 自我包含整合 prompt — 直接貼入 Lovable / Claude Code 即可生成卡 6 完整實作。
> 對應 page spec：`docs/painmap_worksheet/design/pages/06_card_ai_evidence.md`
> 對應資料模型：`docs/painmap_worksheet/product/data_model.md` § Card 6
> 組裝日期：2026-05-02 ｜ Worksheet v1.0

---

## === GLOBAL PROJECT GUIDELINE (DO NOT OVERRIDE) ===

你是「PainMap 題眼 — Worksheet 教學模式」的資深產品設計師與前端工程師。

### 品牌特質

**結構化** ｜ **賦權感** ｜ **沉穩** ｜ **教學優先**

### Color Tokens

| Token | 色值 | 用途 |
| :--- | :--- | :--- |
| Primary #1E3A5F / Primary Light #E8EEF5（selected tool card 背景）/ Secondary #2D7D8A（focus / selected border）/ Accent CTA #E8913A / Verified #2D9D78（recommend badge / passed check）/ Caution #D97706（反推銷警示）/ BG Page #F7F8FA / BG Muted #F1F3F5（prompt block 背景）/ Text Primary #1A2332 / Text Secondary #5C6B7A / Border Default #DFE3E8 / Border Focus #2D7D8A |

### Typography

H1 28px / H2 22px / H3 18px / Body LG 17px / Body MD 15px / Body SM 13px / Caption 12px / Code 14px (monospace JetBrains Mono — prompt + raw_response)

字體：`Noto Sans TC` + `Inter` + `JetBrains Mono`

### 元件風格

- Radius MD 8px / LG 12px
- Border `1px solid #DFE3E8` / focus 2px Teal
- Shadow SM / MD

### 技術棧

React 18 + TypeScript + Tailwind + Zustand + React Hook Form + Zod。LocalStorage key：`painmap_worksheet:cards`。

### 絕對禁令（PainMap Brand）

- 禁止：分數、星等、A-F、成功率、排行榜、徽章、倒數計時
- 禁用詞：「智慧推薦」「AI 智能分析」「AI 幫你判斷」「最佳 AI 工具」「神器」「點子驗證」「靈感蒐集」「成功率 / 可行性」「闖關 / 升級 / streak」
- 禁止 Inline styles / `console.log`
- WCAG AA / 語意化 HTML / focus ring Teal

### 絕對禁令（Octalysis 黑帽）

- 禁止 #6 Scarcity：AI 工具搶先試用、限時折扣、「快點跑 prompt」
- 禁止 #7 Unpredictability：「神秘 prompt」「驚喜結果」「AI 隨機推薦」
- 禁止 #8 Loss Avoidance：「3 天沒回來進度會消失」、streak

### 教學模式特殊鐵律（卡 6 為 anti-solution mode 重點）

1. **反 solution mode（最關鍵）**：
   - prompt 必含「請不要幫我設計產品，也不要提出商業模式」鐵律句
   - 反推銷偵測（規則式關鍵字）會偵測 raw_response 是否進入「設計產品」模式
   - 命中 → 提供 fallback prompt 重跑
2. **書面優先**：raw_response 必須完整保存（≥ 200 字），未來查核用
3. **反思問題透明**：8 題答案各達 minLength + 反推銷通過 + raw_response 完整
4. **失敗回退**：偵測到推銷詞 → fallback prompt 補強重跑（不退回上一卡）

---

## === CURRENT TASK: BUILD CARD 6 — AI EVIDENCE COLLECTION ===

### [PAGE META]

- **page_name**: Card 6 - AI Evidence Collection
- **route_path**: `/learn/worksheet/06?id={paincard_uuid}`
- **card_step**: 6
- **page_type**: card_input + ai_prompt_copy_block + tool_picker + structured_form
- **primary_goal**: 讓使用者選一個 AI 工具，跑完「8 題證據蒐集 prompt」，把回覆原文 + 8 題結構化結果完整保存至 `PainCard.ai_evidence`
- **secondary_goal**: 訓練「不要叫 AI 想 App」的反直覺，建立 prompt 工程的初步意識
- **prerequisite_cards**: [1, 2, 3, 4, 5]
- **expected_time_on_page**: 15-25 分鐘（含外部 AI 來回貼上）

---

### [STRUCTURE: SECTIONS]

1. **stepper_context** — 卡 1-5 ✓ / 卡 6 高亮
2. **card_intro** — 「這張不是設計產品 / 不是談商業模式 / 不是想 App」
3. **ai_tool_selector** — 4 個 AI 工具卡單選 + 寫 1 句話為什麼
4. **prompt_copy_block** — 完整證據蒐集 prompt + 一鍵複製 + 外部連結
5. **eight_answers_form** — raw_response + 8 題結構化欄位
6. **anti_solution_check** — 自動偵測推銷詞 + fallback prompt（**Card 6 核心反 solution mode 機制**）
7. **exit_gate** — 反思問題 3 項 + 「進入卡 7」CTA

---

### [SECTION COMPONENT SPEC]

#### Section 1: stepper_context

- 與卡 1-5 一致
- `ai_indicator` (Badge, Verified Green border): "AI 介入：✅ 8 題證據蒐集"

#### Section 2: card_intro

- `card_label` (Caption): "卡片 6 / 9"
- `title` (H1): "用 AI 蒐集證據"
- `one_liner` (Body LG): "你已經有自己的猜測（卡 1-5）。現在用 AI 去找公開證據，看看你的猜測有沒有支撐。"
- `this_is_not` (CalloutBox Warning, Caution Light bg)：
  - title: "這張不是什麼"
  - 條列：
    - 「不是設計產品」
    - 「不是談商業模式」
    - 「不是想 App」
- `rule_reminder` (Body MD): 「最重要的一句 prompt 是：『請不要幫我設計產品，也不要提出商業模式』。」
- 進階使用者可收合（LocalStorage 記憶偏好）

#### Section 3: ai_tool_selector

- `section_title` (H2): "第一步：選一個 AI 工具"
- `tool_cards` (4 張並排 Desktop / 2x2 Tablet / 垂直 Mobile, single select)：

| tool_id | tool_name | best_for | recommend_badge |
| :--- | :--- | :--- | :--- |
| `chatgpt_dr` | ChatGPT Deep Research | 從公開資料找討論、文章、評論、外部證據 | 🟢 第一次先用這個 |
| `claude` | Claude | 整理長文字（訪談逐字稿、LINE 對話、客服紀錄） | — |
| `perplexity` | Perplexity | 補資料來源、查最新趨勢與報告 | — |
| `gemini` | Gemini Deep Research | 補資料來源、查最新趨勢與報告 | — |

- `tool_reason_input` (Textarea, minLength 5, maxLength 80): placeholder「為什麼選這個工具？（1 句話）」
- data_binding：
  - `ai_evidence.ai_tool` ← 選中的 tool_id
  - `ai_evidence.ai_tool_reason` ← 使用者填入

**狀態**：default / selected (邊框 2px Teal + bg `#E8EEF5`，其餘卡片 opacity 0.6) / hover (邊框 Teal + 上移 -2px) / error（未選）

#### Section 4: prompt_copy_block

- `section_title` (H2): "第二步：複製這段證據蒐集 prompt"
- `prompt_block` (AIPromptCopyBlock, monospace JetBrains Mono on `bg-[#F1F3F5]`)：
  - prompt_template（**逐字引用 worksheet 卡 6，禁止省略「請不要幫我設計產品」這句**）：
  
  ```
  我想研究一個可能的痛點：

  「{{stuck_formula.user_draft 或 ai_polished}}」
  痛點主人翁特徵：{{people.background}}
  他現在用：{{workaround.tool_name}}
  不滿之處：{{workaround.user_dissatisfactions[0..2]}}

  ⚠️ 重要規則：
  - 請不要幫我設計產品，也不要提出商業模式
  - 請不要建議 App、SaaS、解決方案
  - 請只做痛點探索與證據蒐集

  請回答以下 8 題：
  1. 哪些具體人群最常遇到這個問題？請列 3-5 群（要有具體職業/角色，不要寫「上班族」這種模糊詞）
  2. 這個問題通常在什麼場景發生？頻率多高？
  3. 他們現在怎麼解決？請列 5 個具體 workaround（工具名/流程名）
  4. 現有解法有哪些不滿？請分成：時間成本、品質壓力、情緒壓力、資料整理壓力、其他
  5. 有哪些公開證據支持這個痛點？請找：論壇、社群、產業文章、工具評論、搜尋趨勢
  6. 這個痛點背後真正的 Job-to-be-Done 是什麼？
  7. 哪些可能是假痛點？也就是看起來很煩，但其實不夠頻繁、不夠痛、或已經被現有工具解決
  8. 如果我要做真人訪談，最應該訪談哪 5 種人？每種人給 3 個訪談問題

  不要對任何結論加裝飾性評論。如果某題你不確定，標 [推測]。
  ```
- `copy_button` (Button Primary): "複製 prompt"（點擊後 2 秒「✓ 已複製」）
- `external_link_hint` (Body SM): "複製後到 {{selected_tool_name}} 貼上跑一次，再回來填下面的欄位。"
- `dynamic_link` (ExternalLink, target="_blank")：依 ai_tool 顯示對應外部連結（chatgpt.com / claude.ai / perplexity.ai / gemini.google.com）

#### Section 5: eight_answers_form

- `section_title` (H2): "第三步：把 AI 回覆貼回來"
- `section_subtitle` (Body MD): "先貼整段原文（保存用），再把 8 題答案分別貼進對應欄位。"

##### `raw_response_field`
- label (Body Bold): "AI 回覆原文（完整貼上）"
- input: Textarea (monospace, 高度 200px, minLength 200, maxLength 50000)
- data_path: `ai_evidence.raw_response`
- hint: "整段原文會保存在你的本機，未來查核用。"

##### 8 個 AnswerCard（每張：title + textarea + char counter）

| # | data_path | label | hint | minLength |
| :- | :--- | :--- | :--- | :- |
| Q1 | `ai_evidence.eight_answers.q1_specific_groups` | 哪些具體人群最常遇到這個問題？ | 應有 3-5 群，每群有具體職業/角色 | 30 |
| Q2 | `ai_evidence.eight_answers.q2_scenes_frequency` | 在什麼場景發生？頻率多高？ | 至少 1 個可被觀察的場景：時間 + 地點 + 動作 | 20 |
| Q3 | `ai_evidence.eight_answers.q3_workarounds` | 他們現在怎麼解？5 個 workaround | 每個都要有具體名字（工具名 / 流程名） | 30 |
| Q4 | `ai_evidence.eight_answers.q4_dissatisfactions_categorized` | 現有解法的不滿（5 類分類） | 分類：時間 / 品質 / 情緒 / 資料整理 / 其他 | 40 |
| Q5 | `ai_evidence.eight_answers.q5_public_evidence` | 公開證據來源 | 論壇、社群、產業文章、工具評論、搜尋趨勢 | 20 |
| Q6 | `ai_evidence.eight_answers.q6_jtbd` | 真正的 Job-to-be-Done | 他真正想完成的事，不是表面行為 | 20 |
| Q7 | `ai_evidence.eight_answers.q7_possible_fake_pains` | 可能的假痛點 | 看起來很煩，但其實不夠頻繁 / 不夠痛 / 已被解決 | 20 |
| Q8 | `ai_evidence.eight_answers.q8_interview_targets` | 該訪談哪 5 種人 + 各 3 題 | 卡 8 會用到，請完整貼上 | 80 |

每題 char counter 顯示 `已填 N 字（最少需 X 字）`；達標變 Verified Green。Autosave debounce 2 秒。

#### Section 6: anti_solution_check（**Card 6 核心反 solution 機制**）

- **layout**: 全寬警示區，僅在偵測到問題時顯示
- **detection_rules** (規則式關鍵字偵測 raw_response + 8 題答案)：
  - 觸發詞清單：「建議製作 App」、「你應該開發」、「設計一個 SaaS」、「市場機會」、「商業模式建議」、「投資報酬率」、「定價策略」、「MVP 規劃」
  - 命中任一 → `no_solution_check_passed = false`
- `fallback_prompt_block` (AIPromptCopyBlock, conditional, 僅 `no_solution_check_passed === false` 時顯示)：
  - title (H3): "AI 開始推銷解法了 → 用這段補強 prompt 重跑"
  - prompt_body：
  
  ```
  上面的回覆裡有提到產品建議 / App / 商業模式 / SaaS / 市場機會。
  請忽略所有解法相關內容，重新回答上面 8 題。
  只做：痛點探索、人群描述、現有解法觀察、公開證據蒐集。
  不要：推薦工具、建議產品、提商業模式、給定價建議、做 MVP 規劃。
  ```
  - copy_button: "複製補強 prompt"
- `manual_override` (Checkbox)：「我已確認 AI 回覆沒有推銷解法（手動覆寫）」 → 強制設 `no_solution_check_passed = true`，但會在 LocalStorage 留 audit log

**狀態**：hidden（預設）/ warning（偵測到觸發詞 → 顯示 fallback_prompt_block）/ passed（顯示 Verified Green Badge「✓ AI 沒有推銷解法」）/ manually_overridden

#### Section 7: exit_gate（sticky bottom）

- 3 個 ExitGateCheck items：
  - check_1: 「AI 回了 8 題（每題都有實質內容）」/ 自動勾選（依 8 題 minLength 通過）
  - check_2: 「AI 沒有推銷解法」/ 自動勾選（依 `no_solution_check_passed`）
  - check_3: 「raw_response 已完整保存」/ 自動勾選（依 raw_response.length >= 200）
- `cta_next` (Button Primary Large): "進入卡 7：自己先猜 + 讀 AI →" → `/learn/worksheet/07`
- `cta_back` (Button Ghost, optional): "← 回去把卡 5 想清楚再來 補資訊"

---

### [INTERACTION & STATE FLOW]

#### 主要互動流程

1. 頁面載入 → 從 LocalStorage 讀 PainCard，渲染卡 1-5 已填 + 卡 6 既有進度
2. 使用者選擇 AI 工具 → 觸發動態填入 prompt placeholder（卡 1-5 資料）
3. 使用者點「複製 prompt」→ `navigator.clipboard.writeText` + 顯示「✓ 已複製」+ 自動滾動到 external_link_hint
4. 使用者點外部 AI 連結 → 新分頁開啟，使用者自行貼上 prompt 跑 AI
5. 使用者回到本頁，貼 raw_response → 觸發反推銷偵測（debounce 1 秒）
6. 偵測到推銷詞 → 浮出 anti_solution_check + fallback_prompt_block
7. 使用者填 8 題答案 → 每 2 秒 debounce autosave
8. 3 個 exit_gate check 全通過 → cta_next 解鎖

#### 自動儲存策略

- LocalStorage debounce 2 秒
- 寫入後 UI Caption 顯示「已自動儲存於本機 · HH:mm」

#### RWD

| 斷點 | 佈局 |
| :--- | :--- |
| Desktop (>1280px) | 4 工具卡並排；prompt block 全寬展開 |
| Tablet (768-1280px) | 工具卡 2x2；prompt block 全寬 |
| Mobile (<768px) | 工具卡垂直堆疊；prompt block 全寬；textarea 高度減半；exit_gate sticky bottom |

---

### [DATA & API]

- **uses_api**: false（MVP 全部 LocalStorage）
- **localstorage_keys**: `painmap_worksheet:cards`
- **data_paths_written**:
  - `PainCard.ai_evidence.ai_tool` (`'chatgpt_dr' | 'claude' | 'perplexity' | 'gemini'`)
  - `PainCard.ai_evidence.ai_tool_reason` (string, ≤ 80)
  - `PainCard.ai_evidence.raw_response` (string, ≥ 200)
  - `PainCard.ai_evidence.eight_answers.q1_specific_groups` … `q8_interview_targets`
  - `PainCard.ai_evidence.no_solution_check_passed` (boolean)
  - `PainCard.current_step` → 7（過關後）
  - `PainCard.updated_at` (ISO8601)
- **data_paths_read**:
  - `PainCard.complaint.*`、`people.background`、`stuck_formula.*`、`workaround.*` → 注入 prompt placeholder
- **error_cases**:
  - LocalStorage 寫入失敗（quota exceeded）→ 「儲存失敗，你的瀏覽器空間不足。請匯出資料或清空舊紀錄。」
  - 反推銷偵測誤判 → 提供「手動覆寫」選項
  - prompt placeholder 缺失（卡 1-5 未完成）→ 「卡 1-5 還沒填完，請先回到 ___」+ 不可離開本頁

---

### [EXIT GATE]

#### 反思問題

| # | 條件 | 自動判定 | 失敗訊息 |
| :- | :--- | :--- | :--- |
| 1 | AI 回了 8 題（每題有實質內容） | `eight_answers` 8 個欄位都 ≥ minLength | 「Q3 還太短，請貼上 AI 給的完整答案」 |
| 2 | AI 沒有推銷解法 | `no_solution_check_passed === true`（自動偵測或手動覆寫） | 「補強 prompt 已給你，跑完再回來」 |
| 3 | raw_response 已完整保存 | `raw_response.length >= 200` | 「請把 AI 回覆原文整段貼上」 |

#### 失敗路由（**不退卡**）

- 任一條件未過 → 留在當頁，顯示具體缺什麼
- 反推銷偵測命中 → 提供 fallback prompt + 手動覆寫
- **絕不回去把卡 1 想清楚再來-5**（與卡 7 不同；卡 6 的 fail 是「補資訊重跑」）

#### 狀態機

- 過關時：`PainCard.status` → `in_progress`（保持），`current_step` → 7

---

### [AI INTEGRATION]

- **AI 介入狀態**：✅ **使用者自選 AI（外部跑）**
- **內建 prompt**：直接從 worksheet 卡 6 萃取，**逐字引用，不可省略「請不要幫我設計產品」這句**
- **變數插值**：`{{stuck_formula.user_draft 或 ai_polished}}` / `{{people.background}}` / `{{workaround.tool_name}}` / `{{workaround.user_dissatisfactions[0..2]}}`
- **MVP 模式**：使用者複製到外部 AI 工具跑 → 把結果貼回 raw_response + 8 題
- **反推銷偵測**：規則式關鍵字（無 LLM），用觸發詞清單

#### Anti-solution mode guard（**Card 6 核心**）

prompt 開頭強制注入「⚠️ 重要規則：請不要幫我設計產品，也不要提出商業模式 / 請不要建議 App、SaaS、解決方案 / 請只做痛點探索與證據蒐集」。

raw_response 偵測命中 → 提供 fallback prompt 重跑：

```
上面的回覆裡有提到產品建議 / App / 商業模式 / SaaS / 市場機會。
請忽略所有解法相關內容，重新回答上面 8 題。
只做：痛點探索、人群描述、現有解法觀察、公開證據蒐集。
不要：推薦工具、建議產品、提商業模式、給定價建議、做 MVP 規劃。
```

---

### [OCTALYSIS HOOKS]

#### 主驅動力：#3 Empowerment of Creativity & Feedback

- **自選 AI 工具**：4 種讓使用者依情境決定（不是系統指派），每個工具搭配「適合做什麼」說明
- **prompt 透明化**：完整顯示 prompt 內容（不隱藏 black box）
- **反推銷檢查 + 手動覆寫**：系統不獨裁判定，給使用者「我可以否決系統判斷」的權力

#### 副驅動力：#2 Development & Accomplishment

- stepper 顯示卡 6 為 active（第 6/9）
- 8 題答案逐題填寫，每題達 minLength 後 char counter 變 Verified Green
- exit_gate 3 個 check 自動勾選

**反模式禁令**：
- ❌ 不顯示 8 題的「完成百分比」（38%、50%）— 用「8 題中已填 N 題」中性敘述
- ❌ 不給徽章 / 點數 / 連勝獎勵
- ❌ 不顯示「平均使用者花了 X 分鐘」

#### 反模式警告（必須全部不出現）

| 禁用 | 為何 |
| :--- | :--- |
| ❌ AI 工具搶先試用、限時折扣 | #6 Scarcity |
| ❌ 「神秘 prompt」「驚喜結果」 | #7 Unpredictability — prompt 100% 透明 |
| ❌ 「3 天沒回來進度會消失」 | #8 Loss Avoidance — LocalStorage 永久保留 |
| ❌ 自動分類 8 題（AI 自動拆答案） | 違反「自己對 AI 回覆做結構化」訓練 |
| ❌ 評分 / 等級 | brand 鐵律 |

---

## === EXCEPTION RULES ===

本頁面允許以下例外（已明確標記）：

1. **prompt 區塊使用等寬字體（JetBrains Mono）**：與全域 Body 字體（Noto Sans TC）不同。理由：prompt 是技術內容，等寬字體強化「這是要原樣複製貼上的東西」。
2. **ai_tool_selector 使用 4 卡並排**：違反一般 brand「3 卡為主」原則。理由：AI 工具市場主流就是 4 個，硬塞成 3 個會誤導使用者。

其餘設計決策完全遵循 Global Guideline。

---

## === OUTPUT REQUIREMENTS ===

### Step 1：結構確認

- 7 個 sections + 用途
- PainCard schema 對應：`ai_evidence.{ai_tool, ai_tool_reason, raw_response, eight_answers.q1..q8, no_solution_check_passed}`
- 資料流：URL `?id` → 讀 LocalStorage（卡 1-5 給 prompt 插值）→ 4 步驟 → debounce 2 秒寫回 → 反推銷偵測 → exit gate
- exit gate pseudocode

### Step 2：設計決策說明

說明 3 個關鍵設計決策：
1. **為什麼 prompt 必須逐字引用且包含「請不要幫我設計產品」？** — 這是 Card 6 反 solution mode 的核心鐵律；用單元測試比對 worksheet 原文確保不被改寫
2. **反推銷偵測為何用規則式關鍵字而不用 LLM？** — 規則式可審計、可重現、無黑盒；LLM 偵測會引入新的不確定性
3. **手動覆寫機制的權衡** — 系統不獨裁；給使用者「我可以否決系統判斷」的賦權；但 audit log 可追蹤

### Step 3：實作方案（Option A）

- `Card6AiEvidencePage.tsx`
- `StepperContext` / `CardIntro` / `AiToolSelector` / `PromptCopyBlock` / `EightAnswersForm` / `AntiSolutionCheck` / `ExitGate`
- `useAntiSolutionDetection` hook（規則式關鍵字偵測）
- `usePromptInterpolation` hook
- Zod schema for ai_evidence
- RWD Tailwind

### 品質檢查清單（部署前必過）

#### 通用
- [ ] 7 個 Section 依序渲染，stepper 顯示 current_step = 6
- [ ] AI 工具 4 個選項可單選；ChatGPT Deep Research 預設帶 recommend_badge
- [ ] prompt_block 動態注入卡 1-5 資料（無 hardcoded placeholder 殘留）
- [ ] 「複製 prompt」按鈕成功將 prompt 寫入 clipboard，無 console error
- [ ] 外部 AI 連結點擊後在新分頁開啟對應網站
- [ ] 8 題 textarea 全部能 autosave 至 LocalStorage（debounce 2 秒），不丟資料
- [ ] **反推銷偵測**：raw_response 含「建議製作 App」→ no_solution_check_passed = false → fallback_prompt_block 浮出
- [ ] 反推銷偵測：raw_response 不含觸發詞 → no_solution_check_passed = true → 顯示 Verified Badge
- [ ] 手動覆寫 checkbox 勾選後 → no_solution_check_passed = true（強制）+ LocalStorage 留 audit log
- [ ] exit_gate 3 個 check 自動判定，cta_next 在全通過時解鎖
- [ ] 過關後 PainCard.current_step 寫入 7，updated_at 寫入 ISO8601
- [ ] **prompt 內容與 worksheet 卡 6 100% 一致（單元測試對比）**
- [ ] **prompt 不可省略「請不要幫我設計產品」這句**

#### Octalysis 黑帽掃描（生成程式碼後**必跑**）
- [ ] 是否出現分數 UI？→ 砍掉
- [ ] 是否有 streak / 連續打卡？→ 砍掉
- [ ] 是否有 loot box / 抽卡 / 神秘獎勵？→ 砍掉
- [ ] 是否有 FOMO 文案（限時、限量、AI 工具搶先試用）？→ 砍掉
- [ ] 是否有過期警告（「3 天沒回來」）？→ 砍掉
- [ ] 是否有排行榜或社群比較？→ 砍掉
- [ ] 是否有「神秘 prompt」「驚喜結果」？→ 砍掉

#### 禁用詞掃描
- [ ] 全頁面零出現「智慧推薦」「AI 智能分析」「AI 幫你判斷」「最佳 AI 工具」「神器」「點子驗證」「靈感蒐集」「成功率 / 可行性」「闖關 / 升級」

---

**版本資訊**：Worksheet v1.0 ｜ Brand v1.0 ｜ 2026-05-02
