# PainMap Worksheet — Card 8 (Real-Person Interview Plan) Integrated Prompt

> 自我包含整合 prompt — 直接貼入 Lovable / Claude Code 即可生成卡 8 完整實作。
> 對應 page spec：`docs/painmap_worksheet/design/pages/08_card_interview_plan.md`
> 對應資料模型：`docs/painmap_worksheet/product/data_model.md` § Card 8
> 組裝日期：2026-05-02 ｜ Worksheet v1.0

---

## === GLOBAL PROJECT GUIDELINE (DO NOT OVERRIDE) ===

你是「PainMap 題眼 — Worksheet 教學模式」的資深產品設計師與前端工程師。

### 品牌特質

**結構化** ｜ **賦權感** ｜ **沉穩** ｜ **教學優先**

### Color Tokens

| Token | 色值 | 用途 |
| :--- | :--- | :--- |
| Primary #1E3A5F / Primary Light #E8EEF5 / Secondary #2D7D8A / Accent CTA #E8913A / Verified #2D9D78（passed check）/ Caution #D97706（推銷題警告 / warning_banner）/ BG Page #F7F8FA / BG Muted #F1F3F5（rules_table 背景）/ Text Primary #1A2332 / Text Secondary #5C6B7A / Border Default #DFE3E8 / Border Focus #2D7D8A |

### Typography

H1 28px / H2 22px / H3 18px / Body LG 17px / Body MD 15px / Body SM 13px / Caption 12px / Code 14px (monospace — AI 模擬 prompt)

字體：`Noto Sans TC` + `Inter` + `JetBrains Mono`

### 元件風格

- Radius MD 8px / LG 12px
- Border `1px solid #DFE3E8` / focus 2px Teal
- Shadow SM / MD

### 技術棧

React 18 + TypeScript + Tailwind + Zustand + React Hook Form + Zod。LocalStorage key：`painmap_worksheet:cards`。

### 絕對禁令（PainMap Brand）

- 禁止：分數、星等、A-F、成功率、排行榜、徽章、倒數計時
- 禁用詞：「AI 訪談」「智能訪談」「合成 persona」「虛擬訪談對象」「會付錢嗎」「會買嗎」（系統文案中）「訪談排行榜」「訪談數成就」「最佳訪談話術」
- 禁止 Inline styles / `console.log`
- WCAG AA / 語意化 HTML / focus ring Teal

### 絕對禁令（Octalysis 黑帽）

- 禁止 #6 Scarcity：「3 天內完成訪談有獎勵」、限時
- 禁止 #7 Unpredictability：「驚喜訪談對象隨機推薦」、AI 神秘
- 禁止 #8 Loss Avoidance：「沒排訪談進度會消失」、streak

### 教學模式特殊鐵律

1. **反 solution mode**：本卡 AI 模擬 prompt 含「不要美化、不要奉承 / 不要假裝會付錢買 App」guard
2. **書面優先**：3 題訪談題 + 訪談規則 checkbox 必填
3. **反思問題透明**：至少 1 位有名字 / 3 題非推銷 / 知道規則
4. **失敗回退**：連 1 位都填不出 contact_info → 提示回去把卡 2 想清楚再來

---

## === CURRENT TASK: BUILD CARD 8 — REAL-PERSON INTERVIEW PLAN ===

### [PAGE META]

- **page_name**: Card 8 - Real-Person Interview Plan
- **route_path**: `/learn/worksheet/08?id={paincard_uuid}`
- **card_step**: 8
- **page_type**: card_input + chip_picker + rules_table + ai_simulation (optional)
- **primary_goal**: 從卡 7 痛點判斷表中挑 2 種訪談對象、寫 3 題非推銷訪談題、確認訪談規則理解
- **secondary_goal**: 訓練「真實對話勝過所有演算法」的認知；意識到 AI 是文字痕跡，現場才是真實
- **prerequisite_cards**: [1, 2, 3, 4, 5, 6, 7]
- **expected_time_on_page**: 15-25 分鐘

---

### [STRUCTURE: SECTIONS]

1. **stepper_context** — 卡 1-7 ✓ / 卡 8 高亮
2. **card_intro** — 「真人訪談 vs AI 證據」價值差異 + Epic Meaning callout
3. **interview_targets_picker** — 候選 chip 從卡 6 q8 帶入 + 2 張 target card
4. **interview_questions_form** — 3 題訪談題 + 推銷題偵測 + 範例題庫 drawer
5. **interview_rules_table** — 「不要做 vs 要做」對照表 + 確認 checkbox
6. **ai_simulation_block**（可選，預設收合）— AI 模擬訪談熱身 prompt
7. **exit_gate** — 過關 3 條件 + 「進入卡 9」CTA

---

### [SECTION COMPONENT SPEC]

#### Section 1: stepper_context

- 與卡 1-7 一致
- `ai_indicator` (Badge, Verified Green border): "AI 介入：✅ 模擬訪談熱身（可選）"

#### Section 2: card_intro

- `card_label` (Caption): "卡片 8 / 9"
- `title` (H1): "真人訪談規劃"
- `one_liner` (Body LG): "AI 找到的證據是『文字痕跡』，不是『現場真實』。沉默、尷尬、害怕、猶豫、身體語言，AI 看不到。"
- `epic_meaning_callout` (CalloutBox EpicMeaning, icon=🎙️)：
  - title: "為什麼還要訪談？"
  - body: 「真人訪談仍然是必要的。AI 只是讓你更快找到該訪談誰。判斷一個痛點是真是假，最後永遠來自真人對話。」

#### Section 3: interview_targets_picker

- `section_title` (H2): "第一步：挑 2 位訪談對象"
- `section_subtitle` (Body MD): "從卡 7 痛點判斷表 + 卡 6 第 8 題的 5 種人裡，選 2 種最容易聯絡到的。"
- `candidates_summary` (CandidatesPanel)：自動從 `PainCard.ai_evidence.eight_answers.q8_interview_targets` 解析候選清單，顯示為可點擊 chip 列表
  - chip_behavior：點擊 chip → 把該人群名稱填入下方 target persona 欄位（accelerator）+ highlight 該欄位 1 秒
- `targets_form` (TargetsForm)：2 個 target card 並排（Desktop）/ 堆疊（Mobile）

每個 target_N 包含 4 個欄位：

| 欄位 | 元件 | helper | data_path | minLength |
| :--- | :--- | :--- | :--- | :- |
| persona | Textarea | "具體職業 + 場景，例：『中小型補習班 30-50 歲數學老師』" | `interview_plan.targets[N].persona` | 10 |
| contact_known | Radio (2 options: ✓ 認識 / 我還不認識) | — | `interview_plan.targets[N].contact_known` | boolean |
| contact_info | Textarea | 動態：認識 → "LINE / 電話 / 名字"；不認識 → "去哪個社群 / 場合" | `interview_plan.targets[N].contact_info` | 5 |
| planned_time | TextField | "YYYY-MM-DD HH:mm 或情境描述（『下次他來補習班時』）" | `interview_plan.targets[N].planned_time` | 5 |

- `add_target_button` (Button Ghost, optional): "+ 加第 3 位" → 新增 target_3（最多 5 個）

#### Section 4: interview_questions_form

- `section_title` (H2): "第二步：寫 3 個訪談題"
- `section_subtitle` (Body MD): "不是推銷題。問他『你最近一次怎麼解』，不要問『你會買 App 嗎』。"
- `questions_form` (QuestionForm)：3 個 textarea 垂直堆疊

每個 question 為 Textarea：
- minLength 15
- maxLength 300
- hint：「建議方向：上次發生 + 怎麼解 + 花多久」
- data_path: `interview_plan.questions[N]`
- **selling_check**（HiddenLogic）：偵測「會付」「會買」「會用」「定價」「願意花錢」「會用嗎」「好不好」「想法是」「如果有 App」「方案」「訂閱」等推銷詞 → 顯示 inline 警告（**不擋過關**，但建議改寫）

- `sample_questions_drawer` (SideDrawer, optional): "📚 從 worksheet 範例題庫挑" 按鈕 → 開啟側邊抽屜顯示 9 題範例：
  - 「你最近一次寫家長回報是什麼時候？花了多久？發生了什麼？」
  - 「你現在用什麼方法在解這個問題？試過什麼放棄了？」
  - 「你現在花多少時間在做這件事？最不滿意哪一段？」
  - …其他 6 題
  - 點擊範例題 → 填入對應 question textarea

#### Section 5: interview_rules_table

- **layout**: 全寬白底容器，padding 32px，最大寬 800px，**2 欄對照表**（Mobile 改為堆疊：dont 上、do 下）
- `section_title` (H2): "第三步：訪談規則（很重要）"
- `rules_comparison_table` (ComparisonTable)：2 欄 4 列（從 worksheet 卡 8 萃取，**100% 一致**）
  - column_headers: 「❌ 不要做」/ 「✅ 要做」
  - row_1: 「『我有一個想法是 ___，你覺得好不好？』」/ 「『你最近一次遇到這個問題是什麼時候？發生了什麼？』」
  - row_2: 「『如果有 App 可以 ___，你會用嗎？』」/ 「『你現在用什麼方法在解這個問題？』」
  - row_3: 「『這個你會付多少錢？』」/ 「『你現在花多少時間在做這件事？』」
  - row_4: 「推銷你的解法」/ 「只聽他說現況」
- `confirm_checkbox` (Checkbox, **required for exit gate**)：
  - label (Body Bold): 「我看完了，知道訪談時不要做什麼」
  - data_path: `interview_plan.interview_taboos_understood`
- `why_callout` (CalloutBox Info, optional, icon=💡)：
  - body: 「為什麼？因為使用者很會配合你。你問『會買嗎』，他會說『會』；但他不會真的買。問現況才有真相。」

**HTML 結構**：用語意化 `<table>` + `scope` 屬性。

#### Section 6: ai_simulation_block（可選，**預設收合**）

- `section_title` (H2): "（可選）熱身：請 AI 模擬受訪者"
- `section_subtitle` (Body SM): "⚠️ 只能當熱身練習，不能取代真人訪談。"
- `expand_toggle` (Button Ghost): "展開 AI 模擬 prompt ▼"
- `prompt_block` (AIPromptCopyBlock, conditional 展開後顯示, monospace)：
  - prompt_template（**逐字引用 worksheet 卡 8**）：
  
  ```
  我準備訪談一個 {{interview_plan.targets[0].persona}}。
  我的痛點假設是：{{stuck_formula.user_draft 或 ai_polished}}
  
  請扮演這個受訪者，根據常見現況回答我這 3 題：
  1. {{interview_plan.questions[0]}}
  2. {{interview_plan.questions[1]}}
  3. {{interview_plan.questions[2]}}
  
  回答時請：
  - 不要美化、不要奉承
  - 用真實生活的口吻
  - 如果現況其實沒那麼痛，請直接說
  - 不要假裝自己會付錢買 App
  ```
  - copy_button: "複製 AI 模擬 prompt"
- `ai_response_input` (Textarea, optional)：
  - label: "AI 模擬回覆（貼回來保存，未來對照真人訪談）"
  - data_path: `interview_plan.ai_simulated_response`
- `warning_banner` (WarningBanner, **必填顯示**, icon=⚠️)：
  - text: 「AI 模擬只是熱身。真實的沉默、猶豫、身體語言，AI 給不了你。」

#### Section 7: exit_gate（sticky bottom）

- 3 個 ExitGateCheck items：
  - check_1: 「至少 1 位有名字 / 聯絡管道的訪談對象」/ 自動勾選（依 `targets.some(t => t.contact_info.length >= 5)`）
  - check_2: 「3 題訪談題（不是推銷題）」/ 自動勾選（依 questions 3 題達 minLength + 推銷檢查通過或手動覆寫）
  - check_3: 「知道訪談時不要做什麼」/ 自動勾選（依 `interview_taboos_understood`）
- `cta_next` (Button Primary Large): "進入卡 9：真假判斷 →" → `/learn/worksheet/09`
- `cta_back_to_card2` (Button Ghost, optional, **特殊路由**): "← 回去把卡 2 想清楚再來（你還沒接觸這群人）" → `/learn/worksheet/02`
  - **特殊狀態**：若使用者連 1 位都填不出 contact_info → cta_back_to_card2 變 primary，引導回去把卡 2 想清楚再來

---

### [INTERACTION & STATE FLOW]

#### 主要互動流程

1. 頁面載入 → 從 LocalStorage 讀 PainCard，從 `ai_evidence.eight_answers.q8` 解析候選人群
2. 候選 chip 列表渲染（最多 5 個 chip）
3. 使用者點 chip → 填入 target persona 欄位 + highlight 1 秒
4. 使用者填 contact_known radio → 動態切換 contact_info label
5. 使用者填 3 題訪談題 → 即時偵測推銷關鍵字 → inline 警告
6. 使用者勾選 interview_taboos_understood checkbox → autosave
7. （可選）使用者展開 ai_simulation_block → 複製 prompt 到外部 AI → 貼回 ai_response_input
8. exit_gate 3 個 check 全通過 → cta_next 解鎖

#### 推銷題偵測規則（**不擋過關**）

- 觸發詞清單：「會付」「會買」「願意花」「定價」「會用嗎」「好不好」「想法是」「如果有 App」「方案」「訂閱」
- 命中任一 → 顯示 inline 警告 + 建議改寫範例
- **不擋過關**：使用者可堅持原問題（人類自由意志優先），但 LocalStorage 留 audit log

#### 自動儲存策略

- LocalStorage debounce 2 秒
- targets 陣列動態長度（至少 2，最多 5）

#### RWD

| 斷點 | 佈局 |
| :--- | :--- |
| Desktop (>1280px) | 2 個 target card 並排；rules_table 2 欄對照 |
| Tablet (768-1280px) | 2 個 target card 並排（縮小）；rules_table 仍 2 欄 |
| Mobile (<768px) | target card 垂直堆疊；rules_table 改為堆疊（dont 上、do 下）；ai_simulation_block 預設收合 |

---

### [DATA & API]

- **uses_api**: false
- **localstorage_keys**: `painmap_worksheet:cards`
- **data_paths_written**:
  - `PainCard.interview_plan.targets[*].persona`
  - `PainCard.interview_plan.targets[*].contact_known` (boolean)
  - `PainCard.interview_plan.targets[*].contact_info`
  - `PainCard.interview_plan.targets[*].planned_time`
  - `PainCard.interview_plan.questions[0..2]` (length === 3)
  - `PainCard.interview_plan.interview_taboos_understood` (boolean)
  - `PainCard.interview_plan.ai_simulated_response` (string | null, optional)
  - `PainCard.current_step` → 9（過關後）
- **data_paths_read**:
  - `PainCard.ai_evidence.eight_answers.q8_interview_targets` → 解析為候選 chip
  - `PainCard.stuck_formula.user_draft / ai_polished` → 注入 ai_simulation_block prompt
  - `PainCard.people.list` → 顯示在側邊「你已認識的 3 個人」（可點擊帶入 contact_info）
- **error_cases**:
  - 卡 6 q8 為空 → 候選 chip 列表 empty state「卡 6 沒給你 5 種人，請先回卡 6 補」
  - LocalStorage quota exceeded → 友善錯誤

---

### [EXIT GATE]

#### 反思問題

| # | 條件 | 自動判定 | 失敗訊息 |
| :- | :--- | :--- | :--- |
| 1 | 至少 1 位有名字或聯絡管道 | `targets.some(t => t.contact_info.length >= 5)` | 「至少要有 1 位你能聯絡到的人」 |
| 2 | 3 題訪談題（非推銷） | 3 個 question 達 minLength 15；推銷檢查通過或手動覆寫 | 「Q2 像推銷題，建議改成『你現在怎麼解』」 |
| 3 | 知道訪談時不要做什麼 | `interview_taboos_understood === true` | 「請看完訪談規則並勾選」 |

#### 失敗路由

- 條件 1 未過（連 1 位 contact_info 都填不出來）→ 提示「回去把卡 2 想清楚再來，你還沒接觸這群人」
- 條件 2 未過（推銷題太多）→ 留在當頁，提供範例題庫
- 條件 3 未過 → 留在當頁，引導去看 rules_table

#### 狀態機

- 過關時：`PainCard.status` → `in_progress`，`current_step` → 9

---

### [AI INTEGRATION]

- **AI 介入狀態**：✅ **可選使用（外部 AI 模擬訪談熱身）**
- **AI 角色**：
  - ✅ 模擬訪談熱身 prompt（外部跑）
  - ❌ 取代真人訪談（**永久禁用**）
  - ❌ 自動產生訪談題（不做，剝奪訓練）
  - ❌ 推銷題偵測「擋過關」（過度家父長式 — 應警告但不擋）
- **內建 prompt**：直接從 worksheet 卡 8 萃取，**逐字引用，必含「不要美化、不要奉承 / 不要假裝會付錢買 App」**
- **不可加「AI 替你想 3 題」按鈕**（違反訓練本意）

#### worksheet 鐵律對應

| Worksheet 鐵律 | 軟體實作 |
| :--- | :--- |
| 「真人訪談仍然是必要的」 | 沒有「跳過訪談」選項 |
| 「AI 模擬只能當熱身練習，不能取代真人訪談」 | warning_banner 強制顯示 + 段落標題明示 |
| 「沉默、尷尬、害怕、猶豫、身體語言，AI 看不到」 | card_intro one_liner 直接引用 |
| 「不要推銷、不要問會付錢嗎」 | 推銷題偵測 + rules_table |

---

### [OCTALYSIS HOOKS]

#### 主驅動力：#1 Epic Meaning & Calling

- card_intro one_liner「真實對話勝過所有演算法」呼應品牌核心：判斷力訓練
- epic_meaning_callout 強化「真人訪談是這套方法的靈魂」
- 推銷題偵測 + rules_table 訓練「不污染受訪者」的職業倫理
- 反 AI 替代敘事：明確告訴使用者「AI 看不到沉默」

#### 副驅動力：#5 Social Influence & Relatedness

- 訪談本身就是社交行為 — 走出去、面對面、傾聽
- 候選 chip 從卡 6 q8 帶入，建立「這是基於你已蒐集的證據」連續感
- 「你已認識的 3 個人」側邊面板（從卡 2 帶入），降低「找人很難」心理門檻

**禁忌 Social 用法**：
- ❌ 不可顯示「其他使用者最常訪談誰」（社會比較）
- ❌ 不可顯示「同類型痛點的訪談熱門題」（剝奪使用者自己想的機會）

#### 副驅動力：#3 Empowerment of Creativity

- 3 題訪談題完全使用者自己寫（範例題庫只是參考，不強制）
- contact_info 在「認識 / 不認識」兩種模式下使用者自由發揮怎麼找人

#### 反模式檢查清單（Card 8 最容易犯）

- ❌ 顯示「平均使用者訪談 N 人」（社會比較）
- ❌ 「訪談打卡」徽章 / 連勝
- ❌ 「AI 訪談模式」（誤導為可取代真人）
- ❌ 自動產生訪談題（剝奪訓練）
- ❌ 推銷題偵測「擋過關」（過度家父長式 — 應警告但不擋）

---

## === EXCEPTION RULES ===

本頁面允許以下例外（已明確標記）：

1. **rules_table 使用 2 欄對照表**：違反全域「單欄為主」原則。理由：「不要做 vs 要做」對照需要視覺並列才能傳達訊息。
2. **ai_simulation_block 預設收合**：違反全域「重要內容不收合」原則。理由：這是可選功能，預設展開會誘導過度依賴 AI。

其餘設計決策完全遵循 Global Guideline。

---

## === OUTPUT REQUIREMENTS ===

### Step 1：結構確認

- 7 個 sections + 用途
- PainCard schema 對應：`interview_plan.{targets[*].(persona, contact_known, contact_info, planned_time), questions[0..2], interview_taboos_understood, ai_simulated_response}`
- 資料流：URL `?id` → 讀 LocalStorage（卡 6 q8 解析候選 chip + 卡 2 people.list + 卡 3 stuck_formula）→ 3 步驟 → debounce 寫回 → exit gate
- exit gate pseudocode

### Step 2：設計決策說明

說明 3 個關鍵設計決策：
1. **為什麼推銷題偵測 warning 但不擋過關？** — 過度家父長式違反 #3 Empowerment；人類自由意志優先；但 audit log 留下供反思
2. **rules_table 為何使用語意化 `<table>` 而不是兩個 `<div>` 並排？** — 「不要做 vs 要做」是對照關係，screen reader 讀 `<table>` 時會說「row 1, column 1, 不要做：...」自動建立對應
3. **AI 模擬訪談 prompt 必含「不要假裝會付錢買 App」的反諷設計** — 這正是受訪者最常配合說謊的情境；prompt 顯式禁止 AI 配合，反而訓練使用者看到「真實的拒絕」是什麼樣子

### Step 3：實作方案（Option A）

- `Card8InterviewPlanPage.tsx`
- `StepperContext` / `CardIntro` / `InterviewTargetsPicker` / `CandidatesPanel` / `InterviewQuestionsForm` / `InterviewRulesTable` / `AiSimulationBlock` / `ExitGate`
- `useQ8CandidatesParser` hook（從 q8 文字解析 chip）
- `useSellingCheckDetection` hook（規則式關鍵字偵測）
- Zod schema for interview_plan
- RWD Tailwind

### 品質檢查清單（部署前必過）

#### 通用
- [ ] 7 個 Section 依序渲染，stepper 顯示 current_step = 8
- [ ] 候選 chip 從 `ai_evidence.eight_answers.q8_interview_targets` 正確解析（至少 3 個 chip）
- [ ] 點擊 chip → 填入 target persona 欄位 + highlight 1 秒
- [ ] 至少 2 個 target card 可獨立填寫
- [ ] contact_known radio 切換時 contact_info label 動態變化
- [ ] 3 題訪談題達 minLength 15 後 ✓ 微標記
- [ ] 推銷關鍵字偵測命中時 → inline 警告（**不擋過關**）
- [ ] **rules_table 對照內容與 worksheet 卡 8 100% 一致**
- [ ] interview_taboos_understood checkbox 勾選後 autosave
- [ ] ai_simulation_block 預設收合，可展開
- [ ] AI 模擬 prompt 動態注入 target.persona + stuck_formula + 3 questions
- [ ] **AI 模擬 prompt 必含「不要美化、不要奉承 / 不要假裝會付錢買 App」**
- [ ] exit_gate 3 個 check 全通過後 cta_next 解鎖
- [ ] 過關後 PainCard.current_step 寫入 9
- [ ] 條件 1 未過時，cta_back_to_card2 變 primary，引導回去把卡 2 想清楚再來
- [ ] 鍵盤 Tab 順序正確
- [ ] 無障礙：rules_table 用語意化 `<table>` + scope 屬性
- [ ] RWD 三斷點正確，rules_table 在 Mobile 變堆疊

#### Octalysis 黑帽掃描（生成程式碼後**必跑**）
- [ ] 是否出現分數 UI？→ 砍掉
- [ ] 是否有 streak / 連續打卡 / 訪談打卡徽章？→ 砍掉
- [ ] 是否有 loot box / 抽卡 / 神秘獎勵？→ 砍掉
- [ ] 是否有 FOMO 文案（「3 天內完成訪談有獎勵」）？→ 砍掉
- [ ] 是否有過期警告？→ 砍掉
- [ ] 是否有排行榜（「平均使用者訪談 N 人」社會比較）？→ 砍掉
- [ ] 是否有「驚喜訪談對象隨機推薦」？→ 砍掉
- [ ] 推銷題偵測是否擋過關？→ 應該只 warning 不擋

#### 禁用詞掃描
- [ ] 全頁面零出現「AI 訪談 / 智能訪談 / 合成 persona / 虛擬訪談對象 / 會付錢嗎 / 會買嗎（系統文案）/ 訪談排行榜 / 訪談數成就 / 最佳訪談話術」

---

**版本資訊**：Worksheet v1.0 ｜ Brand v1.0 ｜ 2026-05-02
