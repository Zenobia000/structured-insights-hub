# Page-Level Prompt: Card 1 — 抱怨原句

> Worksheet 第一張卡片。對應 worksheet「卡片 1 ｜ 把抱怨寫下來」。使用者必須寫下**聽到的原句**（不是解釋、不是分析），並指出**有名字的真人**來源。AI 在這張卡完全不能介入 — 這是判斷力訓練的起點。

---

## [PAGE META]

- **page_name**: Card 1 - Complaint Verbatim
- **route_path**: `/learn/worksheet/01?id={paincard_uuid}`
- **page_type**: worksheet_card (input form, no AI)
- **primary_goal**: 引導使用者填入 5 個欄位（`complaint.verbatim` / `source_name` / `source_relation` / `datetime` / `scene`），並透過 anti-fake validators 確保品質
- **secondary_goal**: 讓使用者體會「先聽再判斷」的紀律 — 不允許 AI 介入、不允許美化、不允許用「我覺得」
- **target_users**: 已從 landing 進入的初學者，第一次使用 worksheet
- **entry_point**:
  - 從 `/learn/worksheet`（landing）的「30 秒開始」CTA
  - 從 LocalStorage 恢復 `current_step === 1` 的 PainCard
- **expected_time_on_page**: 5-15 分鐘（首次使用），3-8 分鐘（熟練後）
- **corresponds_to_worksheet**: `docs/workshop/painpoint_beginner_worksheet.md` 卡片 1
- **corresponds_to_data_model**: `PainCard.complaint` 物件（5 欄位）

---

## [STRUCTURE: SECTIONS]

1. **stepper_header**
   - section_type: progress_indicator
   - section_purpose: 顯示 9 卡 stepper（卡 1 高亮），讓使用者知道「在哪、還剩幾張」— 非 score，是 step indicator
2. **card_intro**
   - section_type: instruction
   - section_purpose: 用 worksheet 原文「規則：寫你聽到的原句，不要美化、不要解釋、不要分析」校正使用者期待
3. **input_form**
   - section_type: form
   - section_purpose: 5 個欄位輸入（verbatim / source_name / source_relation / datetime / scene）
4. **example_reference**
   - section_type: example_card
   - section_purpose: 顯示 worksheet 林老師範例，可摺疊
5. **anti_fake_check**
   - section_type: validation_panel
   - section_purpose: 即時顯示 R2.1 anti-fake validators 結果（不擋輸入，過關時才檢核）
6. **exit_gate_footer**
   - section_type: action_footer
   - section_purpose: 反思問題 checklist + 「儲存並進入卡 2」按鈕；過不了顯示友善阻擋

---

## [SECTION COMPONENT SPEC]

### Section: stepper_header

- **layout**: 全寬置頂，水平 9 個圓點 + label（Desktop）/ 水平捲動 9 個小圓點（Mobile）
- **elements**:
  - back_link: Link / required / "← 回到入口" / -> `/learn/worksheet`
  - stepper: CardProgressStepper / required / 詳見 `design/components/card_progress_stepper.md`
    - 9 個 step：標示 `current_step === 1`（高亮 Teal）/ 已完成（Verified Green Check）/ 未開始（Border Default 灰）
    - 點擊已完成的 step 可回退編輯（會觸發 R1.3 警告：後續 step 資料會標記為 stale）
  - paincard_meta: Caption / required / "PainCard #{id_short} · 建立於 {created_at}"
  - ai_indicator: Badge / required / "AI 介入：❌ 禁用"（紅色框，Body SM）
- **states**:
  - default: 卡 1 高亮，其他灰色
  - hover: 已完成 step hover 顯示 tooltip "點此回退編輯"
  - loading: Skeleton stepper
- **copy_constraints**: 每個 step label 最多 6 字

### Section: card_intro

- **layout**: 全寬，標題 + 說明區
- **elements**:
  - card_number: Eyebrow / required / "卡 1 / 9"
  - card_title: H1 / required / "把抱怨寫下來"
  - rule_callout: AlertBox (Primary Light bg) / required
    - icon: Info / required
    - text: Body MD / required / "**規則：** 寫你聽到的原句，不要美化、不要解釋、不要分析。"
  - guidance: Body MD / required / "你應該有聽過某人說：「欸，要是有人做一個 ___ 就好了！」這張卡的任務不是分析這句話，是**忠實複述**它。"
- **states**:
  - default: 完整顯示
  - loading: Skeleton
- **copy_constraints**: card_title 最多 12 字；guidance 最多 100 字

### Section: input_form

- **layout**: 單欄表單，欄位垂直排列。每個欄位有 label + helper text + input + validation hint
- **elements**:
  - field_verbatim: TextareaField / required
    - label: H3 / "抱怨原句"
    - helper: Body SM / "聽到的原句（一字不改）。如果你只記得大意，先去找他再聊一次。"
    - placeholder: "「我每週六晚上要寫 30 個學生的家長 LINE，常寫到半夜兩點。」"
    - rows: 4
    - max_length: 500
    - data_field: `complaint.verbatim`
    - validation: minLength 10
    - anti_fake_hint: 包含「我覺得」「應該需要」「可能」等分析詞時，inline warning「這像是你的解釋，不是原句」（不擋輸入，過關時擋）
  - field_source_name: TextField / required
    - label: H3 / "是誰說的"
    - helper: Body SM / "真人姓名（可化名，但要是你認識的具體一個人，不是「現代人」「上班族」）"
    - placeholder: "林老師"
    - data_field: `complaint.source_name`
    - validation: minLength 1
  - field_source_relation: TextField / required
    - label: H3 / "你跟他的關係"
    - helper: Body SM / "你怎麼認識他的？這影響你能不能找他第二次"
    - placeholder: "我表妹的數學老師"
    - data_field: `complaint.source_relation`
    - validation: minLength 1
  - field_datetime: TextField / required
    - label: H3 / "什麼時候說的"
    - helper: Body SM / "日期或情境描述（不一定要精確，但要有「那個下午 / 那次飯局」這種錨點）"
    - placeholder: "2026-04-15"
    - data_field: `complaint.datetime`
    - validation: minLength 1
  - field_scene: TextField / required
    - label: H3 / "當時他在做什麼"
    - helper: Body SM / "場景：他在做哪件事的時候說的？這個動作是觀察痛點的關鍵錨點"
    - placeholder: "我陪他從 21:00 跟到 02:30 親眼看他寫"
    - data_field: `complaint.scene`
    - validation: minLength 1
  - autosave_indicator: Caption / required / "已自動儲存到瀏覽器 · {timestamp_ago}"
- **states**:
  - default: 5 個欄位空白
  - filled: 欄位有值，邊框 Border Default
  - focus: Border Focus（Teal #2D7D8A）+ Focus Ring
  - error: Border Error（紅色僅用於系統驗證錯誤如 minLength，不用於 anti-fake 警告）
  - warning: anti-fake validator 警告 — 用 Caution amber 邊框 + 黃色 inline 警告文字
  - loading: 從 LocalStorage 讀入時顯示 skeleton
- **copy_constraints**: helper 最多 35 字；placeholder 直接引用 worksheet 範例

### Section: example_reference

- **layout**: 全寬可摺疊面板（預設摺疊）
- **elements**:
  - toggle_header: ToggleHeader / required
    - label: H3 / "📖 看 worksheet 林老師範例"
    - state: collapsed / expanded
  - example_content: ExamplePanel / required (when expanded)
    - quote_block: BlockQuote / required
      - "**抱怨原句：** 「我每週六晚上要寫 30 個學生的家長 LINE，平常週間都要記筆記但常漏，到週末翻 7 次小考成績單、翻群組對話、翻學生作業，常寫到半夜兩點。」"
      - "**是誰說的：** 林老師（新北永和補習班）"
      - "**什麼時候說的：** 2026-04-15"
      - "**當時他在做什麼：** 我陪他從 21:00 跟到 02:30 親眼看他寫"
    - copy_button: Button Ghost / optional / "複製這個範例的格式" / 不複製內容到表單，只示範格式
  - source_link: Link / required / "來自 docs/workshop/painpoint_beginner_worksheet.md 卡片 1" / -> 連結到 worksheet 原文
- **states**:
  - collapsed: 僅顯示 toggle_header
  - expanded: 顯示完整範例
  - loading: Skeleton
- **copy_constraints**: 直接引用 worksheet 範例原文，不重寫

### Section: anti_fake_check

- **layout**: 右側固定面板（Desktop）/ 底部展開面板（Mobile）
- **elements**:
  - panel_title: H3 / required / "即時檢核"
  - panel_subtitle: Body SM / required / "這是品質提示，不是評分。"
  - check_items: AntiFakeCheckList / required
    - check_1_no_analysis_words:
      - label: Body MD / "原句不含「我覺得 / 應該需要 / 可能」等分析詞"
      - status: pass / warning / pending
      - rule_id: R2.1
      - logic: `!/(我覺得|應該需要|可能|大概|或許|似乎)/.test(complaint.verbatim)`
      - on_fail: warning amber color + inline hint "如果你寫的是『我覺得他需要 X』，這是你的解釋，不是原句。"
    - check_2_real_person:
      - label: Body MD / "來源是有具體名字的真人（不是「上班族」「現代人」）"
      - status: pass / warning / pending
      - rule_id: R2.2 (適用於 source_name)
      - logic: `complaint.source_name.length > 0 && !/^(現代人|上班族|大家|很多人|某人)$/.test(complaint.source_name)`
      - on_fail: warning amber + hint "「現代人」不是一個你能找到的人。請填具體姓名。"
    - check_3_observable_scene:
      - label: Body MD / "場景可被觀察（有時間 + 動作）"
      - status: pass / warning / pending
      - logic: `complaint.scene.length >= 5`
      - on_fail: hint "場景越具體越好（例：「他從 21:00 寫到 02:30」勝過「他在工作」）"
- **states**:
  - default: 所有 check 顯示 pending（灰）
  - typing: 即時更新 check 狀態（debounce 500ms）
  - all_pass: 全部 Verified Green check
  - some_warning: 顯示 amber 警告（不擋輸入，過關時 exit gate 才擋）
- **copy_constraints**: check label 最多 30 字

### Section: exit_gate_footer

- **layout**: 全寬固定底部行動列（sticky）
- **elements**:
  - exit_conditions: ExitGateChecklist / required / 詳見 `design/components/exit_gate_check.md`
    - condition_1: "[ ] 寫的是**原句**，不是你的解釋"
      - check_logic: 對應 anti_fake_check check_1
    - condition_2: "[ ] 至少有 1 個**有名字的真人**"
      - check_logic: 對應 anti_fake_check check_2 + `complaint.source_name` 非空
  - primary_cta: Button Primary / required / "儲存並進入卡 2 →" / 點擊觸發 exit gate 檢核
  - secondary_cta: Button Ghost / optional / "回到入口" / -> `/learn/worksheet`
  - blocked_message: AlertBox / conditional / 當 exit gate 不通過時顯示
    - icon: AlertTriangle (Caution Amber)
    - text: Body MD / 動態文案，根據未通過的 condition 顯示
- **states**:
  - default: CTA 為 disabled 灰色 + tooltip「請先填完 5 個欄位」
  - all_required_filled: CTA 為 active Primary Amber
  - clicked_with_failure: 顯示 blocked_message + 高亮未通過的 condition
  - clicked_with_pass: CTA loading 狀態 → POST 寫入 `complaint` → 更新 `current_step = 2` → 導向 `/learn/worksheet/02?id={uuid}`
- **copy_constraints**: blocked_message 最多 80 字

---

## [INTERACTION & STATE FLOW]

### 主要互動流程

1. 頁面載入 → 從 URL `?id={uuid}` 讀取 PainCard → 從 LocalStorage 讀 `complaint` 物件 → 填入 5 個欄位
2. 使用者輸入 → debounce 500ms → 寫入 LocalStorage `painmap_worksheet:cards.{id}.complaint` → 更新 `updated_at`
3. 即時觸發 anti_fake_check 邏輯 → 更新右側面板 check 狀態
4. 點擊 `primary_cta`（儲存並進入卡 2）：
   - 步驟 a：檢查 5 個必填欄位皆 minLength 通過 → 否則高亮空白欄位
   - 步驟 b：檢查 R2.1（原句不含分析詞）→ 否則顯示 blocked_message：「這像是你的解釋，不是原句。請改寫成你**聽到**的具體句子，例：『他說「我每週都...」』」
   - 步驟 c：檢查 R2.2（source_name 非代稱）→ 否則 blocked_message：「請填具體姓名（可化名但要是真人）」
   - 步驟 d：全通過 → 更新 `current_step = 2`、`status = 'in_progress'` → 導向卡 2

### 自動儲存策略

- 每個欄位 `onBlur` 觸發儲存
- 連續輸入時 debounce 500ms 觸發儲存
- 儲存成功時 autosave_indicator 顯示「已自動儲存 · 剛剛」
- 儲存失敗（LocalStorage quota 滿）顯示 toast「儲存失敗，請匯出後刪除舊 PainCard」

### RWD 行為差異

| 斷點 | 佈局 | 差異說明 |
| :--- | :--- | :--- |
| Desktop (>1280px) | 左側 70% 表單 + 右側 30% anti_fake_check 固定面板 | 完整體驗 |
| Tablet (768-1280px) | 全寬表單，anti_fake_check 改為摺疊面板（預設展開） | 縮小但維持結構 |
| Mobile (<768px) | 全寬單欄，anti_fake_check 在表單下方，stepper 改為水平捲動 | 簡化佈局 |

---

## [DATA & API]

- **uses_api**: true
- **endpoints**:
  - GET `/api/paincards/{id}` — 讀取現有 PainCard（hydration 用，主要還是 LocalStorage）
  - PATCH `/api/paincards/{id}` — 更新 `complaint` 欄位 + `current_step` + `updated_at`
- **localStorage_keys**:
  - `painmap_worksheet:cards.{id}.complaint`
  - `painmap_worksheet:cards.{id}.current_step`
  - `painmap_worksheet:cards.{id}.updated_at`
- **schema_reference**: `product/data_model.md` § Card 1 + `references/pain_card_schema.md` § JSON Schema `complaint`
- **error_cases**:
  - URL `?id={uuid}` 無效或 LocalStorage 找不到對應 PainCard：顯示「找不到這份 PainCard」+ CTA 「建立新的 PainCard」
  - 自動儲存失敗：toast 提示，不阻斷使用者輸入
  - PATCH 失敗（網路錯誤）：LocalStorage 仍寫入，下次連線自動重試（offline-first）

---

## [EXIT GATE]

> **反思問題 100% 對應 worksheet「🚦 反思問題」段落**

### 反思問題（Pass Criteria）

| # | 條件 | 資料層判定 | UI 反饋 |
| :- | :--- | :--- | :--- |
| 1 | 寫的是原句，不是解釋 | `complaint.verbatim` 不含 `/(我覺得\|應該需要\|可能\|大概\|或許\|似乎)/` 模式 | check_1 顯示 Verified Green |
| 2 | 至少有 1 個有名字的真人 | `complaint.source_name` 非空 + 不在禁用代稱清單（"現代人"/"上班族"/"大家"/"很多人"/"某人"） | check_2 顯示 Verified Green |
| 3 | 5 個欄位皆非空 | `verbatim`/`source_name`/`source_relation`/`datetime`/`scene` 皆 minLength 1（verbatim minLength 10） | 5 個欄位邊框正常（無紅框） |

### 失敗路由（Fail Routing）

| 失敗情境 | 路由 | 友善文案 |
| :--- | :--- | :--- |
| `complaint.verbatim` 含分析詞 | 停留卡 1 + 高亮 verbatim 欄位 | 「這像是你的解釋，不是原句。請改寫成你**聽到**的具體句子。例：『他在飯局上說「我每週都...」』」 |
| `complaint.source_name` 為代稱 | 停留卡 1 + 高亮 source_name 欄位 | 「「現代人」「上班族」不是你能聯絡到的人。請填**具體姓名**（可化名，但要是真人）。如果你想不到一個名字，這還不是你的題目 — 去找一個真人聊聊再回來。」 |
| 任一欄位空白 | 停留卡 1 + 高亮空白欄位 | 「請填寫所有 5 個欄位。如果你不確定怎麼填，看下方林老師範例。」 |
| `complaint.verbatim` < 10 字 | 停留卡 1 + 高亮 verbatim | 「原句太短了。聽到的抱怨通常不只一句話 — 把完整的那段話寫下來。」 |

### 友善文案總原則

- 永遠告訴使用者「為什麼擋」+「怎麼修」
- 不用紅色擋（紅色只用於系統錯誤）
- 用 Caution Amber + 引導文字
- 失敗時不刪除已輸入內容

### 退回工作流（Backward Routing）

> 卡 1 是起點，**沒有更前面的卡可退**。如使用者覺得題目錯了：
> - 點擊「捨棄這份 PainCard 重新開始」（在卡片 menu 提供）→ 確認 modal → 刪除 LocalStorage → 導向 `/learn/worksheet`

---

## [AI INTEGRATION]

- **AI 介入狀態**：❌ **完全禁用**
- **理由**（直接引自 worksheet「卡 2 ｜ 不能讓 AI 代填」段落，邏輯延伸到卡 1）：
  > 這張卡片**完全是你的功課**，AI 不能幫忙。理由：AI 會生「合成 persona」（虛構的人）和「合成抱怨」（虛構的句子），但虛構的東西**不會付錢**。
- **設計手法**：
  - UI 上顯示明顯的「AI 介入：❌ 禁用」badge
  - 不提供「AI 改寫我的抱怨」「AI 美化句子」這類按鈕
  - 不提供「自動產生範例抱怨」按鈕（範例是固定的 worksheet 林老師案例，不是 AI 生成）
- **內建 prompt 引用**：無（這張卡無 AI prompt）
- **Fallback**：無

### 為什麼這張卡禁 AI？

| 風險 | 說明 |
| :--- | :--- |
| 合成原句 | AI 會生「我每天加班到 11 點」這類聽起來像但不存在的句子 — 違反「原句」原則 |
| 美化解釋 | AI 會把「我覺得他應該需要 X」優化成「他需要 X」— 但使用者寫的本來就是錯的，需要被擋住而非被優化 |
| 提示作弊 | 如果允許 AI 生成範例填入欄位，使用者會用 AI 跳過「真的去聽真人說話」這個訓練重點 |

---

## [OCTALYSIS HOOKS]

### 主驅動力

- **#3 Empowerment of Creativity & Feedback（賦權創造）— 主驅動力**
  - 設計手法：
    - 整張卡完全由使用者填寫，沒有 AI 介入 — 使用者擁有 100% 創作自主權
    - anti_fake_check 提供即時反饋（不是評分，是品質提示），讓使用者「立刻看到自己有沒有寫對」
    - 反思問題清晰可見（exit_gate_footer），使用者能自己判斷「我準備好進下一張了嗎」

### 副驅動力

- **#1 Epic Meaning（史詩感）— 副驅動力**
  - 設計手法：
    - card_intro `rule_callout` 強調「這是判斷力訓練」— 你正在做的不只是填表，是訓練自己不被 AI 牽著走
    - AI 禁用 badge 反向強化「這張你必須親自完成」的價值
- **#2 Development & Accomplishment（成就感版）— 副驅動力（限制使用）**
  - 設計手法：
    - stepper_header 視覺化「卡 1 / 9」進度 — 但不顯示百分比、不顯示分數
    - exit_gate_footer 反思問題 checklist — 完成感來自「我做到了過關標準」而非「我得了高分」

### 設計手法清單

| 元件 | Octalysis 手法 | 說明 |
| :--- | :--- | :--- |
| stepper_header | #2 Step indicator | 9 卡進度可見，但用 step 而非 score |
| anti_fake_check | #3 即時反饋 | 使用者邊寫邊看品質，自己決定何時送出 |
| example_reference（摺疊預設） | #3 賦權選擇 | 使用者選擇「需要時才看範例」，不強迫看 |
| exit_gate_footer | #2 + #3 | 條件透明，使用者掌握主動權 |
| AI 禁用 badge | #1 Epic Meaning | 反向 framing：「這張必須你自己來」是價值不是限制 |

### 反模式警告（黑帽禁用清單）

| 禁用 | 為何不能用 |
| :--- | :--- |
| ❌ Streak（「連續填卡 N 天」） | 違反 anti-anxiety；填卡是判斷力練習，不是打卡 |
| ❌ 倒數計時器（「卡 1 限時 10 分鐘完成」） | 製造焦慮；卡片可任意暫停與恢復 |
| ❌ 評分條（「你的卡 1 品質 85 分」） | brand 鐵律 — 用 anti-fake check 取代 |
| ❌ 「快速填卡」按鈕（AI 自動生成範例填入） | 違反「親自聽真人」核心訓練；違反 worksheet 卡 2 「AI 不能幫忙」鐵律 |
| ❌ 解鎖音效 / 視覺特效（「叮咚！卡 1 完成！」） | 過度遊戲化，違反 calm voice |
| ❌ 「跳過這張」按鈕 | 卡 1 是起點，跳過 = 整份失效 |

---

## [BRAND LANGUAGE RULES (PAGE-SPECIFIC)]

### 禁止用語

| 禁止 | 替代 |
| :--- | :--- |
| 「分數」「評分」「品質分」 | 「即時檢核」「反思問題」 |
| 「快速」「一鍵」「秒填」 | 移除速成暗示 |
| 「想法」「點子」 | 「抱怨」「原句」 |
| 「你的痛點 score」 | 不顯示 |

### 建議用語

| 建議 | 場景 |
| :--- | :--- |
| 「原句」「忠實複述」 | 強調紀律 |
| 「真人」「具體姓名」 | 強調 R2.2 |
| 「下一步」「進入卡 2」 | 行動導向 |
| 「即時檢核」 | 取代「即時評分」 |

### 語調

- **Strict but kind**：規則嚴格（擋住分析詞），但文案溫和（解釋為什麼擋）
- **Empowering**：你能自己判斷有沒有過關
- **Anti-shortcut**：不提供任何「跳過真人觀察」的捷徑

---

## [ACCEPTANCE CRITERIA]

- [ ] 6 個 Section 依序正確渲染
- [ ] URL `?id={uuid}` 從 LocalStorage 正確讀取 PainCard 並填入 5 個欄位
- [ ] 5 個欄位 onBlur / debounce 500ms 自動儲存到 LocalStorage（PATCH `/api/paincards/{id}` 為 best-effort）
- [ ] anti_fake_check 三個 check item 即時更新狀態
- [ ] check_1（R2.1）正確偵測「我覺得 / 應該需要 / 可能 / 大概 / 或許 / 似乎」
- [ ] check_2（R2.2）正確偵測「現代人 / 上班族 / 大家 / 很多人 / 某人」代稱
- [ ] check_3 場景長度檢核
- [ ] exit_gate_footer 在 5 欄位皆填且 R2.1 + R2.2 通過時 CTA 才 enable
- [ ] CTA disabled 時 hover 顯示 tooltip 說明原因
- [ ] CTA 點擊後正確 PATCH `current_step = 2` + `status = 'in_progress'` → 導向 `/learn/worksheet/02?id={uuid}`
- [ ] 失敗時顯示對應友善文案（4 種失敗情境）
- [ ] example_reference 摺疊面板可開合，內容引用 worksheet 林老師範例
- [ ] AI 介入 badge 顯示「❌ 禁用」
- [ ] 全頁面**不**出現「AI 改寫」「AI 美化」「自動產生範例」這類按鈕
- [ ] 全頁面零分數 UI、零星等、零排行榜、零徽章
- [ ] 鍵盤 Tab 順序：back_link → 5 個欄位 → secondary_cta → primary_cta
- [ ] 螢幕閱讀器讀出 anti_fake_check 結果（aria-live="polite"）
- [ ] LocalStorage quota 滿時顯示降級提示
- [ ] RWD 三斷點正確
- [ ] 符合 PainMap brand 視覺規範
- [ ] 無 emoji 在按鈕文字中（icon 用 SVG）
