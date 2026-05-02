# Page-Level Spec: Card 6 — AI 證據蒐集

> 對應 worksheet「卡片 6 ｜ 用 AI 蒐集證據」。  
> 把卡 1-5 的具體素材送進使用者自選的 AI 工具，回收 8 題結構化證據。  
> 這張卡是「判斷力訓練」的轉折點：從**個人觀察**走向**公開證據對照**，但仍嚴禁 AI 進入「設計產品 / 推銷解法」模式。

---

## [PAGE META]

- **page_name**: Card 6 — AI Evidence Collection
- **route_path**: `/learn/worksheet/06`
- **page_type**: worksheet_card
- **primary_goal**: 讓使用者選一個 AI 工具，跑完「8 題證據蒐集 prompt」，並把回覆原文 + 8 題結構化結果完整保存至 `PainCard.ai_evidence`
- **secondary_goal**: 訓練「不要叫 AI 想 App」的反直覺，建立 prompt 工程的初步意識
- **target_users**:
  - 主要：完成卡 1-5、第一次用 AI 做研究的初學者（Aji / Kai）
  - 次要：已熟練但想用模板加速的進階使用者（Vivian / David）
- **entry_point**: 卡 5 完成後自動推進；或從 stepper 退回此卡修改
- **expected_time_on_page**: 15-25 分鐘（含外部 AI 工具來回貼上）
- **prev_card**: `/learn/worksheet/05`（卡 5：兩件事不能同時要）
- **next_card**: `/learn/worksheet/07`（卡 7：自己先猜 + 讀 AI）

---

## [STRUCTURE: SECTIONS]

1. **stepper_context**
   - section_type: progress_stepper
   - section_purpose: 顯示 9 卡進度（current_step = 6），讓使用者看到自己「走到哪裡」
2. **card_intro**
   - section_type: card_header
   - section_purpose: 用兩句話講清楚「這張要做什麼 / 不要做什麼」，建立反推銷防線
3. **ai_tool_selector**
   - section_type: tool_picker
   - section_purpose: 讓使用者從 4 個 AI 工具挑 1 個 + 寫下 1 句話為什麼選
4. **prompt_copy_block**
   - section_type: ai_prompt_block
   - section_purpose: 呈現完整「證據蒐集 prompt」，提供一鍵複製，並引導去外部 AI 工具貼上
5. **eight_answers_form**
   - section_type: structured_form
   - section_purpose: 收回 AI 回覆後，把 8 題答案分別貼進 8 個 textarea + 一個 raw_response 完整原文欄
6. **anti_solution_check**
   - section_type: validator_panel
   - section_purpose: 自動偵測 raw_response 是否進入「設計產品」模式；若是則顯示 fallback prompt
7. **exit_gate**
   - section_type: exit_gate
   - section_purpose: 反思問題三項勾選 + 「進入卡 7」CTA

---

## [SECTION COMPONENT SPEC]

### Section: stepper_context

- **layout**: 全寬 sticky top，淺色背景（`bg-[#F1F3F5]`），高度 56px
- **elements**:
  - stepper: CardProgressStepper / required / 9 個圓點 + 連線，第 6 個為 active（Teal #2D7D8A 填色），第 1-5 個為 completed（Verified Green #2D9D78 勾選），第 7-9 個為 disabled
  - back_link: TextLink Ghost / required / 「← 卡 5」/ -> `/learn/worksheet/05`
  - autosave_indicator: Caption Muted / required / 「已自動儲存於本機 · HH:mm」
- **states**:
  - default: 顯示完整 stepper
  - hover: 已完成的步驟可點擊回去（顯示底線）；未來步驟不可點
- **copy_constraints**: 不顯示百分比；不顯示倒數計時

### Section: card_intro

- **layout**: 全寬，白底容器，padding 32px，最大寬 800px 置中
- **elements**:
  - card_label: Caption / required / 「卡片 6 / 9」
  - title: H1 / required / 「用 AI 蒐集證據」
  - one_liner: Body LG / required / 「你已經有自己的猜測（卡 1-5）。現在用 AI 去找公開證據，看看你的猜測有沒有支撐。」
  - this_is_not: CalloutBox Warning / required / 標題「這張不是什麼」+ 條列：
    - 「不是設計產品」
    - 「不是談商業模式」
    - 「不是想 App」
  - rule_reminder: Body MD / required / 「最重要的一句 prompt 是：『請不要幫我設計產品，也不要提出商業模式』。」
- **states**:
  - default: 全部展開
  - collapsed: 進階使用者可點擊「我知道了，收起說明」收合（LocalStorage 記憶偏好）
- **copy_constraints**: 標題 ≤ 12 字；one_liner ≤ 60 字；不可使用「點子」「靈感」「腦力激盪」

### Section: ai_tool_selector

- **layout**: 4 張卡片並排（Desktop）/ 2x2 grid（Tablet）/ 垂直堆疊（Mobile）；每張卡片寬度等分，padding 20px
- **elements**:
  - section_title: H2 / required / 「第一步：選一個 AI 工具」
  - tool_cards: ToolCard[4] / required / 單選（radio behaviour）
    - tool_chatgpt_dr:
      - tool_id: `chatgpt_dr`
      - icon: Illustration / required / ChatGPT 圖示
      - tool_name: Body Bold / required / 「ChatGPT Deep Research」
      - best_for: Body SM / required / 「從公開資料找討論、文章、評論、外部證據」
      - recommend_badge: Badge Verified / required / 「🟢 第一次先用這個」
      - reason_hint: Caption / required / 「適合從模糊問題開始整理證據」
    - tool_claude:
      - tool_id: `claude`
      - icon: Illustration / required / Claude 圖示
      - tool_name: Body Bold / required / 「Claude」
      - best_for: Body SM / required / 「整理長文字（訪談逐字稿、LINE 對話、客服紀錄）」
      - reason_hint: Caption / required / 「你手上已有大量文字資料時用」
    - tool_perplexity:
      - tool_id: `perplexity`
      - icon: Illustration / required / Perplexity 圖示
      - tool_name: Body Bold / required / 「Perplexity」
      - best_for: Body SM / required / 「補資料來源、查最新趨勢與報告」
      - reason_hint: Caption / required / 「想做外部資料查核時用」
    - tool_gemini:
      - tool_id: `gemini`
      - icon: Illustration / required / Gemini 圖示
      - tool_name: Body Bold / required / 「Gemini Deep Research」
      - best_for: Body SM / required / 「補資料來源、查最新趨勢與報告」
      - reason_hint: Caption / required / 「想做外部資料查核時用」
  - tool_reason_input: Textarea / required / placeholder「為什麼選這個工具？（1 句話）」/ minLength: 5, maxLength: 80
- **states**:
  - default: 預設無工具被選中；`recommend_badge` 在 ChatGPT Deep Research 卡上顯示
  - selected: 被選中的卡片 border 變為 2px Teal #2D7D8A，背景變為 `bg-[#E8EEF5]`；其餘卡片淡化（opacity 0.6）
  - hover: 邊框變 Teal，輕微上移 -2px
  - error: 未選擇時點下一步 → 顯示 inline 錯誤「請先選一個 AI 工具」
- **copy_constraints**: tool_name ≤ 20 字元；best_for ≤ 30 字中文；不可加分數 / 評等
- **data_binding**: `PainCard.ai_evidence.ai_tool` + `PainCard.ai_evidence.ai_tool_reason`

### Section: prompt_copy_block

- **layout**: 全寬白底容器，最大寬 800px 置中；prompt 區塊使用淺灰底（`bg-[#F1F3F5]`）+ 等寬字體（JetBrains Mono）
- **elements**:
  - section_title: H2 / required / 「第二步：複製這段證據蒐集 prompt」
  - prompt_block: AiPromptCopyBlock / required（共用元件 `design/components/ai_prompt_copy_block.md`）
    - prompt_header: Body Bold / required / 「證據蒐集 prompt」
    - prompt_body: PreformattedText / required / 完整 prompt 內容（從 worksheet 卡 6 萃取，動態填入卡 1-5 資料）：
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
    - copy_button: Button Primary / required / 「複製 prompt」/ 點擊後文字變「✓ 已複製」+ 維持 2 秒
    - external_link_hint: Body SM / required / 「複製後到 {{selected_tool_name}} 貼上跑一次，再回來填下面的欄位。」
  - dynamic_link: ExternalLink / required / 依 ai_tool 顯示對應外部連結（chatgpt.com / claude.ai / perplexity.ai / gemini.google.com），點擊在新分頁開啟
- **states**:
  - default: prompt 內容預覽顯示前 8 行 + 「展開完整 prompt」按鈕
  - expanded: 顯示完整 prompt
  - copied: copy_button 變 Verified Green + 顯示「✓ 已複製」
  - tool_not_selected: prompt_block 灰化 + tooltip「請先在上方選擇 AI 工具」
- **copy_constraints**: prompt 內容必須與 worksheet 卡 6 100% 一致；不可省略「請不要幫我設計產品」這句

### Section: eight_answers_form

- **layout**: 全寬，最大寬 800px 置中；每題一個 Card，垂直堆疊；title + textarea + char counter
- **elements**:
  - section_title: H2 / required / 「第三步：把 AI 回覆貼回來」
  - section_subtitle: Body MD / required / 「先貼整段原文（保存用），再把 8 題答案分別貼進對應欄位。」
  - raw_response_field:
    - label: Body Bold / required / 「AI 回覆原文（完整貼上）」
    - input: Textarea / required / minLength: 200, maxLength: 50000 / monospace font / 高度 200px
    - hint: Caption / required / 「整段原文會保存在你的本機，未來查核用。」
  - eight_questions: AnswerCard[8] / required
    - q1_specific_groups:
      - question: H3 / required / 「Q1. 哪些具體人群最常遇到這個問題？」
      - hint: Caption / required / 「應有 3-5 群，每群有具體職業/角色」
      - input: Textarea / required / minLength: 30
      - data_path: `ai_evidence.eight_answers.q1_specific_groups`
    - q2_scenes_frequency:
      - question: H3 / required / 「Q2. 在什麼場景發生？頻率多高？」
      - hint: Caption / required / 「至少 1 個可被觀察的場景：時間 + 地點 + 動作」
      - input: Textarea / required / minLength: 20
      - data_path: `ai_evidence.eight_answers.q2_scenes_frequency`
    - q3_workarounds:
      - question: H3 / required / 「Q3. 他們現在怎麼解？5 個 workaround」
      - hint: Caption / required / 「每個都要有具體名字（工具名 / 流程名）」
      - input: Textarea / required / minLength: 30
      - data_path: `ai_evidence.eight_answers.q3_workarounds`
    - q4_dissatisfactions_categorized:
      - question: H3 / required / 「Q4. 現有解法的不滿（5 類分類）」
      - hint: Caption / required / 「分類：時間 / 品質 / 情緒 / 資料整理 / 其他」
      - input: Textarea / required / minLength: 40
      - data_path: `ai_evidence.eight_answers.q4_dissatisfactions_categorized`
    - q5_public_evidence:
      - question: H3 / required / 「Q5. 公開證據來源」
      - hint: Caption / required / 「論壇、社群、產業文章、工具評論、搜尋趨勢」
      - input: Textarea / required / minLength: 20
      - data_path: `ai_evidence.eight_answers.q5_public_evidence`
    - q6_jtbd:
      - question: H3 / required / 「Q6. 真正的 Job-to-be-Done」
      - hint: Caption / required / 「他真正想完成的事，不是表面行為」
      - input: Textarea / required / minLength: 20
      - data_path: `ai_evidence.eight_answers.q6_jtbd`
    - q7_possible_fake_pains:
      - question: H3 / required / 「Q7. 可能的假痛點」
      - hint: Caption / required / 「看起來很煩，但其實不夠頻繁 / 不夠痛 / 已被解決」
      - input: Textarea / required / minLength: 20
      - data_path: `ai_evidence.eight_answers.q7_possible_fake_pains`
    - q8_interview_targets:
      - question: H3 / required / 「Q8. 該訪談哪 5 種人 + 各 3 題」
      - hint: Caption / required / 「卡 8 會用到，請完整貼上」
      - input: Textarea / required / minLength: 80
      - data_path: `ai_evidence.eight_answers.q8_interview_targets`
- **states**:
  - default: 8 個欄位都空白；raw_response 灰化提示
  - filling: 每題 char counter 顯示 `已填 N 字（最少需 X 字）`；達標後 counter 變 Verified Green
  - error: 未達 minLength 時 inline 提示「這題還太短，AI 回覆應該更具體」（不擋過關，但顯示警告）
  - autosaved: 每 2 秒 debounce 自動寫入 LocalStorage；右上 Caption 顯示「✓ 已儲存」
- **copy_constraints**: question 標題 ≤ 25 字中文；hint ≤ 30 字中文；不可顯示「分數」「等級」

### Section: anti_solution_check

- **layout**: 全寬警示區，僅在偵測到問題時顯示；最大寬 800px 置中
- **elements**:
  - section_title: H2 / optional / 「⚠️ 反推銷檢查」
  - check_summary: Body MD / required / 顯示偵測結果
  - detection_rules: HiddenLogic / required / 對 `raw_response` + 8 題答案做關鍵字偵測：
    - 觸發詞清單：「建議製作 App」「你應該開發」「設計一個 SaaS」「市場機會」「商業模式建議」「投資報酬率」「定價策略」「MVP 規劃」
    - 命中任一 → `no_solution_check_passed = false`
  - fallback_prompt_block: AiPromptCopyBlock / conditional（僅在 `no_solution_check_passed === false` 時顯示）/
    - title: H3 / required / 「AI 開始推銷解法了 → 用這段補強 prompt 重跑」
    - prompt_body: PreformattedText / required /
      ```
      上面的回覆裡有提到產品建議 / App / 商業模式 / SaaS / 市場機會。
      請忽略所有解法相關內容，重新回答上面 8 題。
      只做：痛點探索、人群描述、現有解法觀察、公開證據蒐集。
      不要：推薦工具、建議產品、提商業模式、給定價建議、做 MVP 規劃。
      ```
    - copy_button: Button Primary / required / 「複製補強 prompt」
  - manual_override: Checkbox / required / 「我已確認 AI 回覆沒有推銷解法（手動覆寫）」 → 強制設 `no_solution_check_passed = true`，但會在 LocalStorage 留 audit log
- **states**:
  - hidden: 預設不顯示；偵測到觸發詞才浮出
  - warning: 顯示偵測結果 + fallback_prompt_block + 警告語「AI 偷偷進入『設計產品』模式了」
  - passed: 顯示 Verified Green Badge「✓ AI 沒有推銷解法」
  - manually_overridden: 顯示 Caption「已手動確認」
- **copy_constraints**: 不可使用威脅性語氣（如「失敗」「錯誤」），用「補強」「重跑」等中性詞

### Section: exit_gate

- **layout**: 全寬 sticky bottom，白底容器，padding 24px，shadow-md
- **elements**:
  - exit_gate_check: ExitGateCheck / required（共用元件 `design/components/exit_gate_check.md`）
    - check_1: Checklist Item / 「AI 回了 8 題（每題都有實質內容）」/ 自動勾選（依 8 題 minLength 通過）
    - check_2: Checklist Item / 「AI 沒有推銷解法」/ 自動勾選（依 `no_solution_check_passed`）
    - check_3: Checklist Item / 「raw_response 已完整保存」/ 自動勾選（依 raw_response.length >= 200）
  - completion_status: Body MD / required / 動態顯示「✓ 3/3 已通過，可進入卡 7」或「還差 N 項」
  - cta_next: Button Primary Large / required / 「進入卡 7：自己先猜 + 讀 AI →」/ -> `/learn/worksheet/07`
  - cta_back: Button Ghost / optional / 「← 回去把卡 5 想清楚再來 補資訊」/ -> `/learn/worksheet/05`
  - help_link: TextLink Secondary / optional / 「我不知道怎麼填」/ 開啟側邊 Drawer 顯示 worksheet 卡 6 完整說明
- **states**:
  - default: 3 個 check 都未勾選，cta_next disabled（灰化）
  - partial: 部分通過，cta_next disabled + 顯示「還差 N 項」
  - all_passed: 3 個都通過，cta_next 變 Amber CTA + 微妙 scale(1.02) 入場動畫
  - failed_route: 若 `no_solution_check_passed === false` 且使用者放棄手動覆寫 → 顯示「補強 prompt 已給你，重跑後再回來」（不退卡，留在當頁）
- **copy_constraints**: cta_next 文案 ≤ 18 字；不可用「恭喜」「達成」（避免成就感欺騙）

---

## [INTERACTION & STATE FLOW]

### 主要互動流程

1. 頁面載入 → 從 LocalStorage 讀取 `current_card`，渲染卡 1-5 已填資料 + 卡 6 既有進度
2. 使用者選擇 AI 工具 → 觸發動態填入 prompt 中的 placeholder（卡 1-5 資料）
3. 使用者點「複製 prompt」→ navigator.clipboard.writeText + 顯示「✓ 已複製」+ 自動滾動到 external_link_hint
4. 使用者點外部 AI 連結 → 新分頁開啟，使用者自行貼上 prompt 並跑 AI
5. 使用者回到本頁，貼 raw_response → 觸發反推銷偵測（debounce 1 秒）
6. 偵測到推銷詞 → 浮出 anti_solution_check 區塊 + fallback_prompt_block
7. 使用者填 8 題答案 → 每 2 秒 debounce autosave 至 LocalStorage
8. 3 個 exit_gate check 全通過 → cta_next 解鎖，可進入卡 7

### 自動儲存策略

- LocalStorage key: `painmap_worksheet:cards`
- 寫入頻率：textarea blur 或 debounce 2 秒
- 寫入後 UI Caption 顯示「已自動儲存於本機 · HH:mm」
- 不上傳任何資料到伺服器（MVP 階段）

### RWD 行為差異

| 斷點 | 佈局 | 差異說明 |
| --- | --- | --- |
| Desktop (>1280px) | 4 工具卡並排；prompt block 全寬展開 | 完整體驗 |
| Tablet (768-1280px) | 工具卡 2x2 grid；prompt block 全寬 | 工具卡縮小 |
| Mobile (<768px) | 工具卡垂直堆疊；prompt block 全寬；textarea 高度減半 | exit_gate 改為固定底部 sticky |

---

## [DATA & API]

- **uses_api**: false（MVP 階段全部使用 LocalStorage）
- **localstorage_keys**:
  - `painmap_worksheet:cards` — 完整 PainCard 物件
- **data_paths_written**:
  - `PainCard.ai_evidence.ai_tool` ← ai_tool_selector
  - `PainCard.ai_evidence.ai_tool_reason` ← tool_reason_input
  - `PainCard.ai_evidence.raw_response` ← raw_response_field
  - `PainCard.ai_evidence.eight_answers.q1_specific_groups` … `q8_interview_targets` ← eight_answers_form
  - `PainCard.ai_evidence.no_solution_check_passed` ← anti_solution_check（自動偵測 + 手動覆寫）
  - `PainCard.current_step` → 7（過關後寫入）
  - `PainCard.updated_at` → ISO8601（每次 autosave）
- **data_paths_read**:
  - `PainCard.complaint.*` → 顯示在側邊資料摘要（可選）
  - `PainCard.people.background` → 注入 prompt placeholder
  - `PainCard.stuck_formula.user_draft / ai_polished` → 注入 prompt
  - `PainCard.workaround.tool_name / user_dissatisfactions` → 注入 prompt
- **error_cases**:
  - LocalStorage 寫入失敗（quota exceeded）→ 顯示「儲存失敗，你的瀏覽器空間不足。請匯出資料或清空舊紀錄。」
  - 反推銷偵測誤判 → 提供「手動覆寫」選項
  - prompt placeholder 缺失（卡 1-5 未完成）→ 顯示「卡 1-5 還沒填完，請先回到 ___」+ 不可離開本頁

---

## [EXIT GATE]

### 反思問題（必須全部通過）

| # | 條件 | 自動判定邏輯 | 失敗訊息 |
| :- | :--- | :--- | :--- |
| 1 | AI 回了 8 題（每題有實質內容） | `eight_answers` 8 個欄位都 ≥ minLength | 「Q3 還太短，請貼上 AI 給的完整答案」 |
| 2 | AI 沒有推銷解法 | `no_solution_check_passed === true`（自動偵測或手動覆寫） | 「補強 prompt 已給你，跑完再回來」 |
| 3 | raw_response 已完整保存 | `raw_response.length >= 200` | 「請把 AI 回覆原文整段貼上」 |

### 失敗路由（不退卡）

- 任一條件未過 → 留在當頁，顯示具體缺什麼
- 反推銷偵測命中 → 提供 fallback prompt + 手動覆寫
- **絕不回去把卡 1 想清楚再來-5**（與卡 7 不同；卡 6 的 fail 是「補資訊重跑」，不是「重新發想」）

### 狀態機影響

- 過關時：`PainCard.status` → `in_progress`（保持），`current_step` → 7
- 不修改 `complaint / people / stuck_formula / workaround / contradiction`（這些是上游卡資料，不可被卡 6 影響）

---

## [AI INTEGRATION]

### AI 介入策略

| 項目 | 是否使用 AI | 說明 |
| :--- | :--- | :--- |
| 蒐集 8 題證據 | ✅ 使用者自選 AI（外部跑） | MVP 不串站內 LLM；使用者複製 prompt 到 ChatGPT/Claude/Perplexity/Gemini 自行跑 |
| 反推銷偵測 | 🟡 規則式關鍵字（無 LLM） | 用正則 + 觸發詞清單；不用 ML 模型 |
| 自動分類 8 題 | ❌ 不做 | 由使用者手動貼到對應 textarea，這是「自己對 AI 回覆做結構化」的訓練 |
| 評分 / 等級 | ❌ 永久禁用 | 違反 brand 禁令 |

### Prompt 工程原則

- prompt 必須與 worksheet 卡 6 100% 一致（不可改寫，不可省略）
- placeholder（如 `{{stuck_formula.user_draft}}`）用 `{{...}}` 雙花括號標示，不用 `${...}`（避免與 JS template literal 混淆）
- prompt 內必含「請不要幫我設計產品」這句鐵律
- 反推銷偵測規則文件：`references/anti_gamification_guardrails.md`

### 未來擴充（M2+ 範圍）

- 站內 LLM proxy：使用者授權後可直接在頁內跑 prompt（不離開站內）
- AI 自動把 raw_response 拆成 8 題（但需保留「使用者手動確認」步驟，不可全自動）
- prompt A/B testing：追蹤哪種 prompt 變體產出更具體的證據

---

## [OCTALYSIS HOOKS]

### 主驅動力：#3 Empowerment of Creativity & Feedback（賦權創造與反饋）

**設計實作**：
- **自選 AI 工具**：4 種工具讓使用者依自己情境決定（不是系統指派），每個工具搭配「適合做什麼」說明 → 使用者感受到「我在做明智選擇」
- **prompt 透明化**：完整顯示 prompt 內容（不隱藏 black box），使用者可閱讀、修改、學習 → 培養「prompt engineering 是可學會的技藝」
- **反推銷檢查 + 手動覆寫**：系統不獨裁判定，給使用者「我可以否決系統判斷」的權力 → Ownership of agency

**為什麼是 #3 而非 #2**：卡 6 的核心是「**選擇** AI 工具 + **客製化** prompt」，這是 Creativity 的實作；#2 Accomplishment 在這張卡是副驅動力（只是過完一關）。

### 副驅動力：#2 Development & Accomplishment（發展與成就）

**設計實作**：
- stepper 顯示卡 6 為 active（第 6/9）→ 進度視覺化
- 8 題答案逐題填寫，每題達 minLength 後 char counter 變 Verified Green → 微小成就累積
- exit_gate 3 個 check 自動勾選 → 「我看到自己達標了」

**反模式禁令**：
- ❌ 不顯示 8 題的「完成百分比」（38%、50%）— 用「8 題中已填 N 題」中性敘述
- ❌ 不給徽章 / 點數 / 連勝獎勵
- ❌ 不顯示「平均使用者花了 X 分鐘」（避免比較焦慮）

### 永久禁用驅動力

| 驅動力 | 為什麼這裡會誘惑出現 | 守則 |
| :--- | :--- | :--- |
| #6 Scarcity & Impatience | AI 工具搶先試用、限時折扣 | 完全不出現 |
| #7 Unpredictability | 「神秘 prompt」「驚喜結果」 | 完全不出現，prompt 100% 透明 |
| #8 Loss Avoidance | 「3 天沒回來進度會消失」 | 完全不出現，LocalStorage 永久保留 |

### 對應 `references/octalysis_white_hat_principles.md`

詳見該文件第 6 卡章節。

---

## [EXCEPTION TO GLOBAL RULES]

- **prompt 區塊使用等寬字體**（JetBrains Mono）— 與全域 Body 字體（Noto Sans TC）不同；理由：prompt 是技術內容，等寬字體強化「這是要原樣複製貼上的東西」
- **ai_tool_selector 使用 4 卡並排**（高資訊密度）— 違反一般 brand 「3 卡為主」原則；理由：AI 工具市場主流就是 4 個，硬塞成 3 個會誤導使用者

---

## [BRAND LANGUAGE RULES (PAGE-SPECIFIC)]

### 禁止用語

| 禁止 | 理由 |
| :--- | :--- |
| 「智慧推薦」「AI 智能分析」 | 空泛行銷話術 — 違反全域禁令 |
| 「AI 幫你判斷」 | 違反 worksheet 鐵律：判斷永遠是使用者的事 |
| 「最佳 AI 工具」「神器」 | 評價性詞彙 — 違反「結構優於評分」原則 |
| 「點子驗證」「靈感蒐集」 | 全域禁用（D-003）|
| 「成功率」「可行性」 | 預測類禁用 |

### 建議用語

| 建議 | 場景 |
| :--- | :--- |
| 「找公開證據」 | 卡 6 動詞 |
| 「跑一次 prompt」 | AI 操作描述 |
| 「貼回原文」 | 證據保存動作 |
| 「補強 prompt」 | 反推銷修正動作 |

### 語調

- **Empowering**：「你來選工具，AI 來跑研究」
- **Calm**：絕無「快點」「不能等」等 FOMO
- **Structured**：8 題就是 8 題，不可裝飾為「智慧分析報告」
- **Anti-anxiety**：偵測到推銷時用「補強」非「失敗 / 警告」

---

## [ACCEPTANCE CRITERIA]

- 7 個 Section 依序正確渲染，stepper 顯示 current_step = 6
- AI 工具 4 個選項可單選；ChatGPT Deep Research 預設帶 recommend_badge
- prompt_block 動態注入卡 1-5 資料（無 hardcoded placeholder 殘留）
- 「複製 prompt」按鈕成功將 prompt 寫入 clipboard，無 console error
- 外部 AI 連結點擊後在新分頁開啟對應網站
- 8 題 textarea 全部能 autosave 至 LocalStorage（debounce 2 秒），不丟資料
- 反推銷偵測：raw_response 含「建議製作 App」→ no_solution_check_passed = false → fallback_prompt_block 浮出
- 反推銷偵測：raw_response 不含觸發詞 → no_solution_check_passed = true → 顯示 Verified Badge
- 手動覆寫 checkbox 勾選後 → no_solution_check_passed = true（強制）+ LocalStorage 留 audit log
- exit_gate 3 個 check 自動判定，cta_next 在全通過時解鎖
- 過關後 PainCard.current_step 寫入 7，updated_at 寫入 ISO8601 時間
- 不出現任何分數 / 等級 / 排行榜 / 徽章 / 倒數計時元素
- 不出現禁用語（「智慧推薦」「成功率」「點子」等）
- RWD：Desktop / Tablet / Mobile 三斷點佈局正確
- 鍵盤操作：Tab 順序正確，Enter 觸發 cta_next（已通過時）
- 無障礙：所有 textarea 有 aria-label，所有 button 有可讀文字
- LocalStorage quota exceeded 時顯示友善錯誤 + 建議匯出
- prompt 內容與 worksheet 卡 6 100% 一致（單元測試對比）
