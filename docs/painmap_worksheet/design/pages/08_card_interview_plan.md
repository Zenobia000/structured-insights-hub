# Page-Level Spec: Card 8 — 真人訪談規劃

> 對應 worksheet「卡片 8 ｜ 真人訪談規劃」。  
> 把卡 6-7 累積的「文字證據」轉化為「現場行動計畫」：選 2 位訪談對象 + 寫 3 題訪談題 + 知道訪談時不要做什麼。  
> AI 在這張卡是「熱身教練」，不是「替代訪談的演員」。

---

## [PAGE META]

- **page_name**: Card 8 — Real-Person Interview Plan
- **route_path**: `/learn/worksheet/08`
- **page_type**: worksheet_card
- **primary_goal**: 從卡 7 痛點判斷表中挑 2 種訪談對象、寫 3 題非推銷訪談題、確認訪談規則理解
- **secondary_goal**: 訓練「真實對話勝過所有演算法」的認知；讓使用者意識到 AI 是文字痕跡，現場才是真實
- **target_users**:
  - 主要：完成卡 7 但從未做過真人訪談的初學者
  - 次要：做過訪談但常犯「推銷訪談」錯誤的進階使用者
- **entry_point**: 卡 7 完成後自動推進
- **expected_time_on_page**: 15-25 分鐘（含 AI 模擬熱身）
- **prev_card**: `/learn/worksheet/07`（卡 7：自己先猜 + 讀 AI）
- **next_card**: `/learn/worksheet/09`（卡 9：Pain Quality Score + 真假判斷）

---

## [STRUCTURE: SECTIONS]

1. **stepper_context**
   - section_type: progress_stepper
   - section_purpose: 顯示 9 卡進度（current_step = 8）
2. **card_intro**
   - section_type: card_header
   - section_purpose: 用一句話建立「真人訪談 vs AI 證據」的價值差異
3. **interview_targets_picker**
   - section_type: target_selection_form
   - section_purpose: 從卡 7 痛點判斷表 + 卡 6 q8 帶入候選人群，挑 2 種 + 填聯絡資訊
4. **interview_questions_form**
   - section_type: question_form
   - section_purpose: 寫 3 題訪談題（非推銷題），有規則檢查 + 範例對照
5. **interview_rules_table**
   - section_type: rules_comparison
   - section_purpose: 「不要做 vs 要做」對照表 + 確認 checkbox
6. **ai_simulation_block**（可選）
   - section_type: ai_prompt_block
   - section_purpose: 提供 AI 模擬訪談 prompt 作為熱身（標註：不可取代真人）
7. **exit_gate**
   - section_type: exit_gate
   - section_purpose: 反思問題 3 項勾選 + 「進入卡 9」CTA

---

## [SECTION COMPONENT SPEC]

### Section: stepper_context

- **layout**: 全寬 sticky top，淺色背景，高度 56px
- **elements**:
  - stepper: CardProgressStepper / required / 9 個圓點，第 8 個 active
  - back_link: TextLink Ghost / required / 「← 卡 7」/ -> `/learn/worksheet/07`
  - autosave_indicator: Caption Muted / required / 「已自動儲存於本機 · HH:mm」
- **states**: default / hover
- **copy_constraints**: 不顯示百分比

### Section: card_intro

- **layout**: 全寬白底容器，padding 32px，最大寬 800px 置中
- **elements**:
  - card_label: Caption / required / 「卡片 8 / 9」
  - title: H1 / required / 「真人訪談規劃」
  - one_liner: Body LG / required / 「AI 找到的證據是『文字痕跡』，不是『現場真實』。沉默、尷尬、害怕、猶豫、身體語言，AI 看不到。」
  - epic_meaning_callout: CalloutBox EpicMeaning / required /
    - icon: 🎙️
    - title: 「為什麼還要訪談？」
    - body: 「真人訪談仍然是必要的。AI 只是讓你更快找到該訪談誰。判斷一個痛點是真是假，最後永遠來自真人對話。」
- **states**: default / collapsed
- **copy_constraints**: title ≤ 10 字；one_liner ≤ 70 字中文

### Section: interview_targets_picker

- **layout**: 全寬白底容器，最大寬 800px 置中；padding 32px
- **elements**:
  - section_title: H2 / required / 「第一步：挑 2 位訪談對象」
  - section_subtitle: Body MD / required / 「從卡 7 痛點判斷表 + 卡 6 第 8 題的 5 種人裡，選 2 種最容易聯絡到的。」
  - candidates_summary: CandidatesPanel / required / 自動從 `PainCard.ai_evidence.eight_answers.q8_interview_targets` 解析出候選清單，顯示為可點擊 chip 列表
    - chip_behavior: 點擊 chip 會把該人群名稱填入下方 target persona 欄位（accelerator）
  - targets_form: TargetsForm / required / 2 個 target card 並排（Desktop）/ 堆疊（Mobile）
    - target_1:
      - card_title: Body Bold / required / 「優先訪談對象 1」
      - persona_input:
        - label: H3 / required / 「他是誰（人群描述）」
        - hint: Caption / required / 「具體職業 + 場景，例：『中小型補習班 30-50 歲數學老師』」
        - input: Textarea / required / minLength: 10 / maxLength: 200
        - data_path: `interview_plan.targets[0].persona`
      - contact_known_radio:
        - label: Body Bold / required / 「我認識這種人嗎？」
        - options: Radio[2] / required
          - 「✓ 認識」/ value: true
          - 「我還不認識」/ value: false
        - data_path: `interview_plan.targets[0].contact_known`
      - contact_info_input:
        - label: Body Bold / required / 動態：認識 → 「他的名字 / 聯絡管道」；不認識 → 「我打算怎麼找到他」
        - hint: Caption / required / 動態：認識 → 「LINE / 電話 / 名字」；不認識 → 「去哪個社群 / 場合」
        - input: Textarea / required / minLength: 5 / maxLength: 300
        - data_path: `interview_plan.targets[0].contact_info`
      - planned_time_input:
        - label: Body Bold / required / 「預計訪談時間」
        - hint: Caption / required / 「YYYY-MM-DD HH:mm 或情境描述（『下次他來補習班時』）」
        - input: Text / required / minLength: 5
        - data_path: `interview_plan.targets[0].planned_time`
    - target_2: 結構同 target_1，data_path 為 `interview_plan.targets[1].*`
  - add_target_button: Button Ghost / optional / 「+ 加第 3 位」/ 點擊後新增 target_3 card（最多 5 個）
- **states**:
  - default: 2 張 target card 空白
  - candidate_chip_clicked: 對應 target persona 欄位填入 chip 文字，並 highlight 該欄位 1 秒
  - filling: 每欄達 minLength 後 ✓ 微標記
  - autosaved: debounce 2 秒寫入 LocalStorage
- **copy_constraints**: persona ≤ 200 字；contact_info ≤ 300 字；不可使用「合成 persona」「虛擬使用者」（違反 worksheet 鐵律）

### Section: interview_questions_form

- **layout**: 全寬白底容器，最大寬 800px 置中；padding 32px
- **elements**:
  - section_title: H2 / required / 「第二步：寫 3 個訪談題」
  - section_subtitle: Body MD / required / 「不是推銷題。問他『你最近一次怎麼解』，不要問『你會買 App 嗎』。」
  - questions_form: QuestionForm / required / 3 個 textarea 垂直堆疊
    - question_1:
      - label: H3 / required / 「Q1」
      - hint: Caption / required / 「建議方向：上次發生 + 怎麼解 + 花多久」
      - input: Textarea / required / minLength: 15 / maxLength: 300
      - data_path: `interview_plan.questions[0]`
      - selling_check: HiddenLogic / required / 偵測「會付」「會買」「會用」「定價」「願意花錢」等推銷詞 → 顯示 inline 警告
    - question_2: 結構同 question_1
    - question_3: 結構同 question_1
  - sample_questions_drawer: SideDrawer / optional / 「📚 從 worksheet 範例題庫挑」按鈕，開啟側邊抽屜顯示 9 題範例（從 worksheet 萃取）：
    - 「你最近一次寫家長回報是什麼時候？花了多久？發生了什麼？」
    - 「你現在用什麼方法在解這個問題？試過什麼放棄了？」
    - 「你現在花多少時間在做這件事？最不滿意哪一段？」
    - …其他 6 題
    - 點擊範例題 → 填入對應 question textarea
- **states**:
  - default: 3 個 textarea 空白
  - filling: 每題 char counter
  - selling_detected: 顯示 inline 警告「這像推銷題。試試問『你最近怎麼解』」（不擋過關，但顯示警告）
  - autosaved: debounce 2 秒
- **copy_constraints**: question 每題 ≤ 300 字；不可使用「會付多少錢」「會用嗎」（推銷反模式）

### Section: interview_rules_table

- **layout**: 全寬白底容器，最大寬 800px 置中；padding 32px；2 欄對照表
- **elements**:
  - section_title: H2 / required / 「第三步：訪談規則（很重要）」
  - rules_comparison_table: ComparisonTable / required / 2 欄 4 列（從 worksheet 卡 8 萃取）
    - column_headers: 「❌ 不要做」/ 「✅ 要做」
    - row_1:
      - dont: 「『我有一個想法是 ___，你覺得好不好？』」
      - do: 「『你最近一次遇到這個問題是什麼時候？發生了什麼？』」
    - row_2:
      - dont: 「『如果有 App 可以 ___，你會用嗎？』」
      - do: 「『你現在用什麼方法在解這個問題？』」
    - row_3:
      - dont: 「『這個你會付多少錢？』」
      - do: 「『你現在花多少時間在做這件事？』」
    - row_4:
      - dont: 「推銷你的解法」
      - do: 「只聽他說現況」
  - confirm_checkbox: Checkbox / required /
    - label: Body Bold / required / 「我看完了，知道訪談時不要做什麼」
    - data_path: `interview_plan.interview_taboos_understood`
  - why_callout: CalloutBox Info / optional /
    - icon: 💡
    - body: 「為什麼？因為使用者很會配合你。你問『會買嗎』，他會說『會』；但他不會真的買。問現況才有真相。」
- **states**:
  - default: checkbox 未勾選
  - checked: checkbox 勾選 + autosave + 變 Verified Green
- **copy_constraints**: dont / do 文案必須與 worksheet 卡 8 訪談規則表 100% 一致

### Section: ai_simulation_block（可選）

- **layout**: 全寬，可收合容器，預設收合；最大寬 800px 置中
- **elements**:
  - section_title: H2 / required / 「（可選）熱身：請 AI 模擬受訪者」
  - section_subtitle: Body SM / required / 「⚠️ 只能當熱身練習，不能取代真人訪談。」
  - expand_toggle: Button Ghost / required / 「展開 AI 模擬 prompt ▼」
  - prompt_block: AiPromptCopyBlock / conditional / 展開後顯示
    - prompt_body: PreformattedText / required / 從 worksheet 卡 8 萃取：
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
    - copy_button: Button Primary / required / 「複製 AI 模擬 prompt」
  - ai_response_input:
    - label: Body Bold / optional / 「AI 模擬回覆（貼回來保存，未來對照真人訪談）」
    - input: Textarea / optional / maxLength: 10000
    - data_path: `interview_plan.ai_simulated_response`
  - warning_banner: WarningBanner / required /
    - icon: ⚠️
    - text: 「AI 模擬只是熱身。真實的沉默、猶豫、身體語言，AI 給不了你。」
- **states**:
  - collapsed: 預設收合，顯示 expand_toggle
  - expanded: 顯示 prompt + ai_response_input
  - copied: copy_button 變 Verified Green
- **copy_constraints**: warning_banner 文案不可省略；不可使用「AI 訪談」（誤導為可取代）；用「AI 模擬熱身」明確區分

### Section: exit_gate

- **layout**: 全寬 sticky bottom，白底容器，padding 24px，shadow-md
- **elements**:
  - exit_gate_check: ExitGateCheck / required
    - check_1: Checklist Item / 「至少 1 位有名字 / 聯絡管道的訪談對象」/ 自動勾選（依 targets 至少 1 位 contact_info ≥ minLength）
    - check_2: Checklist Item / 「3 題訪談題（不是推銷題）」/ 自動勾選（依 questions 3 題達 minLength + 無推銷關鍵字 OR 使用者手動覆寫推銷檢查）
    - check_3: Checklist Item / 「知道訪談時不要做什麼」/ 自動勾選（依 interview_taboos_understood）
  - completion_status: Body MD / required / 「✓ 3/3 已通過」或「還差 N 項」
  - cta_next: Button Primary Large / required / 「進入卡 9：真假判斷 →」/ -> `/learn/worksheet/09`
  - cta_back_to_card2: Button Ghost / optional / 「← 回去把卡 2 想清楚再來（你還沒接觸這群人）」/ -> `/learn/worksheet/02`
  - help_link: TextLink Secondary / optional / 「我不知道怎麼填」/ 開啟側邊 Drawer
- **states**:
  - default: 3 個 check 都未勾選，cta_next disabled
  - all_passed: cta_next 變 Amber CTA
  - failed_route_card2: 若使用者連 1 位都填不出 contact_info → 顯示「你還沒接觸這群人。回去把卡 2 想清楚再來 先去找 3 個有名字的真人」+ cta_back_to_card2 變 primary
- **copy_constraints**: cta_next ≤ 18 字；不可用「闖關」「達成」

---

## [INTERACTION & STATE FLOW]

### 主要互動流程

1. 頁面載入 → 從 LocalStorage 讀取 PainCard，從 `ai_evidence.eight_answers.q8` 解析候選人群
2. 候選 chip 列表渲染（最多 5 個 chip）
3. 使用者點 chip → 填入 target persona 欄位 + highlight 1 秒
4. 使用者填 contact_known radio → 動態切換 contact_info label
5. 使用者填 3 題訪談題 → 即時偵測推銷關鍵字，inline 警告
6. 使用者勾選 interview_taboos_understood checkbox → autosave
7.（可選）使用者展開 ai_simulation_block → 複製 prompt 到外部 AI → 貼回 ai_response_input
8. exit_gate 3 個 check 全通過 → cta_next 解鎖

### 推銷題偵測規則（不擋過關）

- 觸發詞清單：「會付」「會買」「願意花」「定價」「會用嗎」「好不好」「想法是」「如果有 App」「方案」「訂閱」
- 命中任一 → 顯示 inline 警告 + 建議改寫範例
- **不擋過關**：使用者可堅持原問題（人類自由意志優先），但會在 LocalStorage 留 audit log

### 自動儲存策略

- LocalStorage debounce 2 秒
- targets 陣列動態長度（至少 2，最多 5）

### RWD 行為差異

| 斷點 | 佈局 | 差異說明 |
| --- | --- | --- |
| Desktop (>1280px) | 2 個 target card 並排；rules_table 2 欄對照 | 完整體驗 |
| Tablet (768-1280px) | 2 個 target card 並排（縮小）；rules_table 仍 2 欄 | — |
| Mobile (<768px) | target card 垂直堆疊；rules_table 改為堆疊（dont 上、do 下） | ai_simulation_block 預設收合 |

---

## [DATA & API]

- **uses_api**: false
- **localstorage_keys**:
  - `painmap_worksheet:cards`
- **data_paths_written**:
  - `PainCard.interview_plan.targets[*].persona`
  - `PainCard.interview_plan.targets[*].contact_known`
  - `PainCard.interview_plan.targets[*].contact_info`
  - `PainCard.interview_plan.targets[*].planned_time`
  - `PainCard.interview_plan.questions[0..2]`
  - `PainCard.interview_plan.interview_taboos_understood`
  - `PainCard.interview_plan.ai_simulated_response`（可選）
  - `PainCard.current_step` → 9（過關後）
- **data_paths_read**:
  - `PainCard.ai_evidence.eight_answers.q8_interview_targets` → 解析為候選 chip
  - `PainCard.stuck_formula.user_draft / ai_polished` → 注入 ai_simulation_block prompt
  - `PainCard.people.list` → 顯示在側邊「你已認識的 3 個人」（可點擊帶入 contact_info）
- **error_cases**:
  - 卡 6 q8 為空 → 候選 chip 列表顯示 empty state「卡 6 沒給你 5 種人，請先回卡 6 補」
  - LocalStorage quota exceeded → 友善錯誤訊息

---

## [EXIT GATE]

### 反思問題（必須全部通過）

| # | 條件 | 自動判定邏輯 | 失敗訊息 |
| :- | :--- | :--- | :--- |
| 1 | 至少 1 位有名字或聯絡管道 | `targets.some(t => t.contact_info.length >= 5)` | 「至少要有 1 位你能聯絡到的人」 |
| 2 | 3 題訪談題（非推銷） | 3 個 question 達 minLength；推銷檢查通過或手動覆寫 | 「Q2 像推銷題，建議改成『你現在怎麼解』」 |
| 3 | 知道訪談時不要做什麼 | `interview_taboos_understood === true` | 「請看完訪談規則並勾選」 |

### 失敗路由

- 條件 1 未過（連 1 位 contact_info 都填不出來）→ 提示「回去把卡 2 想清楚再來，你還沒接觸這群人」
- 條件 2 未過（推銷題太多）→ 留在當頁，提供範例題庫
- 條件 3 未過 → 留在當頁，引導去看 rules_table

### 狀態機影響

- 過關時：`PainCard.status` → `in_progress`，`current_step` → 9

---

## [AI INTEGRATION]

### AI 介入策略

| 項目 | 是否使用 AI | 說明 |
| :--- | :--- | :--- |
| 模擬訪談熱身 | ✅ 可選使用（外部 AI） | 提供 prompt，使用者自行決定要不要做 |
| 推銷題偵測 | 🟡 規則式關鍵字 | 不用 LLM，用觸發詞清單 |
| 候選人群解析 | 🟡 規則式（簡單字串切分） | 從 q8 答案解析，不用 LLM |
| 取代真人訪談 | ❌ 永久禁用 | 違反 worksheet 鐵律：AI 看不到沉默、身體語言 |
| 自動產生訪談題 | ❌ 不做 | 使用者必須自己想（範例題庫只是參考） |

### Prompt 工程原則

- AI 模擬訪談 prompt 必須包含「不要美化、不要奉承」「不要假裝會付錢買 App」這兩句鐵律
- 不可在站內加「AI 替你想 3 題」按鈕（違反訓練本意）

### worksheet 鐵律對應

| Worksheet 鐵律 | 軟體實作 |
| :--- | :--- |
| 「真人訪談仍然是必要的」 | 沒有「跳過訪談」選項 |
| 「AI 模擬只能當熱身練習，不能取代真人訪談」 | warning_banner 強制顯示 + 段落標題明示 |
| 「沉默、尷尬、害怕、猶豫、身體語言，AI 看不到」 | card_intro one_liner 直接引用 |
| 「不要推銷、不要問會付錢嗎」 | 推銷題偵測 + rules_table |

---

## [OCTALYSIS HOOKS]

### 主驅動力：#1 Epic Meaning & Calling（史詩意義與使命感）

**設計實作**：
- card_intro 的 one_liner 「真實對話勝過所有演算法」呼應品牌核心：判斷力訓練
- epic_meaning_callout 強化「真人訪談是這套方法的靈魂」
- 推銷題偵測 + rules_table 訓練「不污染受訪者」的職業倫理
- 反 AI 替代敘事：明確告訴使用者「AI 看不到沉默」是這套方法相信「人」的核心信念

**為什麼是 #1**：卡 8 的核心不是「完成一張表」（那是 #2），而是「重建對真人對話的信心」。在 AI 全能的時代，這張卡是抵抗「AI 萬能」幻覺的最後一道防線。

### 副驅動力：#5 Social Influence & Relatedness（社會影響與歸屬感）

**設計實作**：
- 訪談本身就是社交行為 — 走出去、面對面、傾聽
- 候選 chip 從卡 6 q8 帶入，建立「這是基於你已蒐集的證據」的連續感
- 「你已認識的 3 個人」側邊面板（從卡 2 帶入），降低「找人很難」的心理門檻

**禁忌 Social 用法**：
- ❌ 不可顯示「其他使用者最常訪談誰」（社會比較）
- ❌ 不可顯示「同類型痛點的訪談熱門題」（剝奪使用者自己想的機會）

### 副驅動力：#3 Empowerment of Creativity（次要）

**設計實作**：
- 3 題訪談題完全使用者自己寫（範例題庫只是參考，不是強制）
- contact_info 在「認識 / 不認識」兩種模式下使用者自由發揮怎麼找人

### 永久禁用驅動力

| 驅動力 | 為什麼這裡會誘惑出現 | 守則 |
| :--- | :--- | :--- |
| #6 Scarcity & Impatience | 「3 天內完成訪談有獎勵」 | 完全不出現 |
| #7 Unpredictability | 「驚喜訪談對象隨機推薦」 | 完全不出現 |
| #8 Loss Avoidance | 「沒排訪談進度會消失」 | 完全不出現 |

### 反模式檢查清單（卡 8 最容易犯）

- ❌ 顯示「平均使用者訪談 N 人」（社會比較）
- ❌ 「訪談打卡」徽章 / 連勝
- ❌ 「AI 訪談模式」（誤導為可取代真人）
- ❌ 自動產生訪談題（剝奪訓練）
- ❌ 推銷題偵測「擋過關」（過度家父長式 — 應警告但不擋）

詳見 `references/anti_gamification_guardrails.md`。

---

## [EXCEPTION TO GLOBAL RULES]

- **rules_table 使用 2 欄對照表**：違反全域「單欄為主」原則。理由：「不要做 vs 要做」對照需要視覺並列才能傳達訊息
- **ai_simulation_block 預設收合**：違反全域「重要內容不收合」原則。理由：這是可選功能，預設展開會誘導過度依賴 AI

---

## [BRAND LANGUAGE RULES (PAGE-SPECIFIC)]

### 禁止用語

| 禁止 | 理由 |
| :--- | :--- |
| 「AI 訪談」「智能訪談」 | 誤導為 AI 可取代真人 |
| 「合成 persona」「虛擬訪談對象」 | 違反 worksheet 鐵律：訪談對象必須是真人 |
| 「會付錢嗎」「會買嗎」（系統文案中） | 推銷反模式 — 即使是教學示範也不可作為「建議題」 |
| 「訪談排行榜」「訪談數成就」 | 遊戲化禁令 |
| 「最佳訪談話術」 | 評價性 — 違反 brand |

### 建議用語

| 建議 | 場景 |
| :--- | :--- |
| 「真人訪談」 | 全頁主軸 |
| 「現場真實」 | 對比 AI 文字痕跡 |
| 「不要推銷，只聽現況」 | 規則描述 |
| 「熱身練習」 | AI 模擬定位 |
| 「你還沒接觸這群人」 | 失敗訊息（卡 2 退回） |

### 語調

- **Empowering**：「你能找到真人對話 = 你已經在做最有價值的事」
- **Calm**：不催促訪談時程
- **Anti-anxiety**：訪談沒做好不評分，只引導下次怎麼問
- **Epic**：強調真人對話的不可取代性

---

## [ACCEPTANCE CRITERIA]

- 7 個 Section 依序正確渲染，stepper 顯示 current_step = 8
- 候選 chip 從 `ai_evidence.eight_answers.q8_interview_targets` 正確解析（至少 3 個 chip）
- 點擊 chip → 填入 target persona 欄位 + highlight 1 秒
- 至少 2 個 target card 可獨立填寫
- contact_known radio 切換時，contact_info label 動態變化
- 3 題訪談題達 minLength 後 ✓ 微標記
- 推銷關鍵字偵測命中時 → inline 警告（不擋過關）
- rules_table 對照內容與 worksheet 卡 8 100% 一致
- interview_taboos_understood checkbox 勾選後 autosave
- ai_simulation_block 預設收合，可展開
- AI 模擬 prompt 動態注入 target.persona + stuck_formula + 3 questions
- exit_gate 3 個 check 全通過後 cta_next 解鎖
- 過關後 PainCard.current_step 寫入 9
- 條件 1 未過時，cta_back_to_card2 變 primary，引導回去把卡 2 想清楚再來
- 不出現禁用語（「AI 訪談」「合成 persona」「最佳訪談話術」等）
- 不出現倒數 / 排行榜 / 徽章元素
- RWD 三斷點佈局正確，rules_table 在 Mobile 變堆疊
- 鍵盤操作：Tab 順序正確
- 無障礙：rules_table 用語意化 `<table>` 標籤 + scope 屬性
