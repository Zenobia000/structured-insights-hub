# Page-Level Prompt: Card 2 — 三個有名字的人

> Worksheet 第二張卡片。對應「卡片 2 ｜ 找出 3 個有名字的人」。**這張卡完全是使用者的功課，AI 絕對不能介入** — 因為 AI 會生「合成 persona」，但虛構的人不會付錢。這張卡是判斷「你真的接觸過這個圈子嗎？」的試金石。

---

## [PAGE META]

- **page_name**: Card 2 - Three Named People
- **route_path**: `/learn/worksheet/02?id={paincard_uuid}`
- **page_type**: worksheet_card (input form, no AI — STRICT)
- **primary_goal**: 引導使用者填入 `people.background` 與 `people.list[3]`（每筆 name / contact / relation），確保 3 個都是**真名 + 你今天能聯絡到至少 1 位**
- **secondary_goal**: 讓使用者體會「合成 persona = 不會付錢的虛構人物」這個鐵律，建立「先有真人才有真痛點」的紀律
- **target_users**: 已通過卡 1 的使用者
- **entry_point**:
  - 從卡 1 過關後 PATCH 跳轉
  - 從 LocalStorage 恢復 `current_step === 2` 的 PainCard
- **expected_time_on_page**: 5-15 分鐘（首次），或更久 — 如使用者卡在「想不到 3 個真名」
- **corresponds_to_worksheet**: `docs/workshop/painpoint_beginner_worksheet.md` 卡片 2
- **corresponds_to_data_model**: `PainCard.people` 物件

---

## [STRUCTURE: SECTIONS]

1. **stepper_header**
   - section_type: progress_indicator
   - section_purpose: 顯示 9 卡 stepper（卡 2 高亮，卡 1 已 verified green）
2. **card_intro**
   - section_type: instruction
   - section_purpose: 說明「為什麼必須是 3 個有名字的真人」+ AI 鐵律提示
3. **ai_disabled_callout**
   - section_type: warning_callout
   - section_purpose: 醒目顯示 worksheet 原文「AI 不能讓代填」段落，避免使用者誤以為可以用 AI 生 persona
4. **input_form**
   - section_type: form
   - section_purpose: 1 個 background 欄 + 3 組 (name / contact / relation) 重複輸入
5. **example_reference**
   - section_type: example_card
   - section_purpose: 顯示 worksheet 林老師案例的 3 位補教老師
6. **anti_fake_check**
   - section_type: validation_panel
   - section_purpose: 即時檢核 R2.2（不是「老師 A」代稱）+「contactable today」確認題
7. **exit_gate_footer**
   - section_type: action_footer
   - section_purpose: 反思問題 + 「儲存並進入卡 3」；過不了顯示回去把卡 1 想清楚再來 路徑

---

## [SECTION COMPONENT SPEC]

### Section: stepper_header

- **layout**: 全寬置頂，水平 9 個圓點
- **elements**:
  - back_link: Link / required / "← 回到卡 1（修改）" / -> `/learn/worksheet/01?id={uuid}` （提示：修改卡 1 會將卡 2 標記為 stale）
  - stepper: CardProgressStepper / required / 卡 1 = Verified Green check / 卡 2 = Teal 高亮 / 其他 = 灰
  - paincard_meta: Caption / required / "PainCard #{id_short}"
  - ai_indicator: Badge (Error red border) / required / "AI 介入：❌ 禁用（鐵律）"
- **states**:
  - default: 卡 2 高亮
  - hover on completed step: tooltip "點此回退編輯（後續卡片會清空）"
  - loading: Skeleton
- **copy_constraints**: 與卡 1 一致

### Section: card_intro

- **layout**: 全寬，標題 + 說明區
- **elements**:
  - card_number: Eyebrow / required / "卡 2 / 9"
  - card_title: H1 / required / "找出 3 個有名字的人"
  - rule_callout: AlertBox (Primary Light bg) / required
    - icon: Users
    - text: Body MD / "**規則：** 抱怨主人翁是誰？這種人你能聯絡到 **3 個**嗎？必須是**真名**（不是「補習班老師 A」），且你**今天**就能聯絡到至少 1 位。"
  - guidance: Body MD / required / "為什麼是 3 個？因為 1 個可能是個案、2 個可能是巧合，3 個才是模式的開始。"
- **states**: default / loading
- **copy_constraints**: card_title 最多 12 字；guidance 最多 50 字

### Section: ai_disabled_callout

- **layout**: 全寬深色背景區塊（Caution Light #FEF3E2）+ 紅框
- **elements**:
  - icon: AlertOctagon (Caution amber)
  - title: H3 / required / "這張卡 AI 不能幫忙"
  - body: BlockQuote / required / 直接引用 worksheet 卡 2「🤖 不能讓 AI 代填」段落原文：
    - "這張卡片**完全是你的功課**，AI 不能幫忙。"
    - "理由：AI 會生「合成 persona」（虛構的人），但虛構的人**不會付錢**。"
  - implications: BulletList / required
    - "本頁無「AI 推薦人選」按鈕"
    - "本頁無「AI 自動補充背景描述」按鈕"
    - "如果你想不出 3 個真名 → 這代表你還不認識這個圈子（後面會教你怎麼辦）"
- **states**: default / loading
- **copy_constraints**: title 最多 12 字；body 引用 worksheet 原文，不重寫

### Section: input_form

- **layout**: 單欄表單 — 1 個 background 欄 + 3 組重複的 person 區塊
- **elements**:
  - field_background: TextareaField / required
    - label: H3 / "這群人的特徵（大概是什麼背景）"
    - helper: Body SM / "年齡 / 職業 / 地點 / 角色。例：30-50 歲、台灣中小型補習班老師、每週要做家長溝通"
    - placeholder: "30–50 歲、台灣中小型補習班老師、每週要做家長溝通"
    - rows: 3
    - data_field: `people.background`
  - person_group_repeat: PersonGroupRepeater / required (固定 3 組，不可增刪)
    - person_1, person_2, person_3 各包含：
      - field_name: TextField / required
        - label: H4 / "1. 姓名"（依序 1/2/3）
        - helper: Body SM / "真名（可化名但要是你認識的具體一個人）"
        - placeholder: "林老師"
        - data_field: `people.list[i].name`
      - field_contact: TextField / required
        - label: H4 / "聯絡方式"
        - helper: Body SM / "LINE / 電話 / Email / Messenger 等 — 你今天就能傳訊息的方式"
        - placeholder: "LINE"
        - data_field: `people.list[i].contact`
      - field_relation: TextField / required
        - label: H4 / "你跟他的關係"
        - helper: Body SM / "影響你能不能找他第二次"
        - placeholder: "我表妹的數學老師"
        - data_field: `people.list[i].relation`
  - autosave_indicator: Caption / required / "已自動儲存到瀏覽器 · {timestamp_ago}"
- **states**:
  - default: 1 個 background 空白 + 3 組 person 空白
  - filled: 個別欄位 Border Default
  - focus: Border Focus Teal + Focus Ring
  - error: 系統驗證錯誤（minLength 1）才用紅色
  - warning: anti-fake validator 警告用 amber
- **copy_constraints**: helper 最多 35 字；placeholder 引用 worksheet 範例

### Section: example_reference

- **layout**: 全寬可摺疊面板（預設摺疊）
- **elements**:
  - toggle_header: ToggleHeader / required
    - label: H3 / "📖 看 worksheet 林老師範例"
  - example_content: ExamplePanel / required (when expanded)
    - quote_block: BlockQuote / required
      - "**大概是什麼背景：** 30–50 歲、台灣中小型補習班老師、每週要做家長溝通"
      - "1. 林老師｜LINE｜我表妹的數學老師"
      - "2. 王老師｜FB Messenger｜林老師介紹的同業"
      - "3. 陳老師｜電話｜我國中同學的爸爸"
    - explanation: Body SM / "注意：3 個人的關係都很**具體**（表妹的老師 / 林介紹的同業 / 國中同學的爸爸）— 這代表填寫者真的能找到他們。"
  - source_link: Link / required / "來自 docs/workshop/painpoint_beginner_worksheet.md 卡片 2"
- **states**: collapsed / expanded / loading
- **copy_constraints**: 直接引用 worksheet

### Section: anti_fake_check

- **layout**: 右側固定面板（Desktop）/ 底部展開面板（Mobile）
- **elements**:
  - panel_title: H3 / required / "即時檢核"
  - panel_subtitle: Body SM / required / "這是品質提示，不是評分。"
  - check_items: AntiFakeCheckList / required
    - check_1_real_names:
      - label: Body MD / "3 個都是真名（不是「老師 A / 同學 B」）"
      - status: pass / warning / pending
      - rule_id: R2.2
      - logic: 對 `people.list[*].name` 檢查不為空、不在禁用代稱清單（"老師 A"、"老師 B"、"老師 C"、"同學 A"、"同學 B"、"persona 1"、"User 1"、"A"、"B"、"C" 等）
      - on_fail: warning amber + "「老師 A」這種代稱代表你還不認識這個人。請填具體姓名（可化名但要是真人）。"
    - check_2_contactable_today:
      - label: Body MD / "你今天就能聯絡到至少 1 位"
      - status: pass / warning / pending
      - logic: 至少 1 個 `people.list[i].contact` 包含可立即傳訊的關鍵字（LINE / 電話 / Email / Messenger / WhatsApp / FB / IG / 簡訊 等），且 `relation` 非空
      - on_confirm: 額外顯示一個 checkbox 讓使用者勾選「我確認今天能聯絡到至少 1 位」 — 這是自我承諾，UI 上不擋（人為勾選），但與 exit gate 連動
    - check_3_specific_background:
      - label: Body MD / "背景描述夠具體（年齡 / 職業 / 地點任 2 項）"
      - status: pass / warning / pending
      - logic: `people.background.length >= 10` 且至少包含 2 個關鍵類別關鍵字（年齡、職業、地點等）
      - on_fail: hint "「年輕人」「上班族」太寬。請至少寫 2 個具體屬性（例：30-50 歲、補習班數學老師、台灣）。"
- **states**:
  - default: 三個 check 顯示 pending
  - typing: debounce 500ms 更新
  - all_pass: 全部 Verified Green
  - some_warning: amber 不擋輸入
- **copy_constraints**: check label 最多 30 字

### Section: exit_gate_footer

- **layout**: 全寬固定底部行動列（sticky）
- **elements**:
  - exit_conditions: ExitGateChecklist / required
    - condition_1: "[ ] 3 個都有真名（不是「補習班老師 A」）"
    - condition_2: "[ ] 你今天就能聯絡到至少 1 位"
  - primary_cta: Button Primary / required / "儲存並進入卡 3 →"
  - secondary_cta: Button Ghost / optional / "回到卡 1（修改）" / -> `/learn/worksheet/01?id={uuid}`
  - blocked_message: AlertBox / conditional
    - icon: AlertTriangle (Caution Amber)
    - text: Body MD / 動態文案
  - fallback_action_card: Card / conditional / 當 exit gate 多次失敗時顯示
    - title: H3 / "想不到 3 個真名怎麼辦？"
    - body: Body MD / 引用 worksheet 原文 — "你還不認識這個圈子。解法：先去這群人聚集的地方混 1-2 週（社團、LINE 群、實體場合），再回來。"
    - cta: Button Ghost / "暫存這份 PainCard，先去找人" / 點擊將 PainCard 標記 `status = 'draft'`，導向 `/learn/worksheet`
- **states**:
  - default: CTA disabled 灰色 + tooltip
  - all_required_filled: CTA Active Primary Amber
  - clicked_with_failure_first: 顯示 blocked_message
  - clicked_with_failure_third+: 額外顯示 fallback_action_card
  - clicked_with_pass: CTA loading → PATCH → 導向卡 3
- **copy_constraints**: blocked_message 最多 80 字；fallback_action_card 引用 worksheet

---

## [INTERACTION & STATE FLOW]

### 主要互動流程

1. 頁面載入 → 從 LocalStorage 讀 `people` 物件 → 填入 background + 3 組 person
2. 使用者輸入 → debounce 500ms → 寫 LocalStorage → 更新 anti_fake_check
3. 即時觸發 R2.2 檢核（代稱偵測）
4. 點擊 `primary_cta`：
   - 步驟 a：檢查 background 非空 + 3 組 person 各 3 欄位皆非空
   - 步驟 b：檢查 R2.2（無代稱）→ 否則顯示 blocked_message
   - 步驟 c：檢查至少 1 個 contact 包含可聯絡關鍵字 → 否則顯示「請至少有 1 位你今天能傳訊息的人」
   - 步驟 d：失敗 ≥ 3 次 → 額外顯示 fallback_action_card 引導退場
   - 步驟 e：全通過 → 更新 `current_step = 3` → 導向卡 3

### 回去把卡 1 想清楚再來 的資料同步

如使用者點擊「回到卡 1 修改」：
- 提示 modal：「修改卡 1 後，本卡（卡 2）的資料會保留，但建議你重新檢查 3 位人選是否還合適。確認嗎？」
- 確認後導向卡 1，但 `current_step` 不變（仍為 2）

### RWD 行為差異

| 斷點 | 佈局 |
| :--- | :--- |
| Desktop | 左側 70% 表單（3 組 person 並排或垂直）+ 右側 30% anti_fake_check |
| Tablet | 全寬表單，3 組 person 垂直排列，anti_fake_check 摺疊面板 |
| Mobile | 全寬單欄，3 組 person 用 accordion 摺疊（預設展開第 1 組） |

---

## [DATA & API]

- **uses_api**: true
- **endpoints**:
  - GET `/api/paincards/{id}`
  - PATCH `/api/paincards/{id}` — 更新 `people` + `current_step`
- **localStorage_keys**: `painmap_worksheet:cards.{id}.people`
- **schema_reference**: `product/data_model.md` § Card 2 + `references/pain_card_schema.md` § JSON Schema `people`
- **error_cases**: 同卡 1

---

## [EXIT GATE]

> **反思問題 100% 對應 worksheet「🚦 反思問題」段落（卡片 2）**

### 反思問題

| # | 條件 | 資料層判定 | UI 反饋 |
| :- | :--- | :--- | :--- |
| 1 | 3 個都有真名（不是「補習班老師 A」） | `people.list.length === 3` 且每筆 `name` 非空且不在禁用代稱清單 | check_1 Verified Green |
| 2 | 你今天就能聯絡到至少 1 位 | 至少 1 個 `people.list[i].contact` 包含可聯絡關鍵字（LINE/電話/Email/Messenger 等）+ 使用者勾選自我承諾 checkbox | check_2 Verified Green |
| 3 | 3 組 (name/contact/relation) + background 皆非空 | 全部 minLength 1 | 欄位無紅框 |

### 失敗路由

| 失敗情境 | 路由 | 友善文案 |
| :--- | :--- | :--- |
| `people.list[i].name` 為代稱（"老師 A"等） | 停留卡 2 + 高亮對應 name 欄位 | 「「老師 A」這種代稱代表你還不認識這個人。請填具體姓名（可化名但要是真人）。」 |
| 無人可今天聯絡 | 停留卡 2 + 顯示 fallback_action_card | 「**你還不認識這個圈子。** 解法（引用 worksheet）：先去這群人聚集的地方混 1-2 週（社團、LINE 群、實體場合），再回來。」 |
| 任一欄位空白 | 停留卡 2 + 高亮空白 | 「請填寫所有欄位。需要 3 位真人 + 各自的聯絡方式。」 |
| `people.background` < 10 字 | 停留卡 2 + 高亮 background | 「背景描述太籠統。至少寫 2 個具體屬性（年齡 / 職業 / 地點）。」 |

### 退回工作流

> 卡 2 過不了 → 退回**卡 1**（你還沒接觸真人）

理由（引用 worksheet）：「過不了 → 你還不認識這個圈子。先去這群人聚集的地方混 1-2 週，再回來。」

實作：
- exit_gate_footer 多次失敗時顯示 fallback_action_card → 點擊「暫存這份 PainCard，先去找人」→
  - PATCH `status = 'draft'` + `current_step` 保持 2（讓使用者下次回來繼續）
  - 導向 `/learn/worksheet`，顯示「你的 PainCard 已暫存。先去認識 3 位{background}，再回來繼續。」

### 友善文案總原則

- 不羞辱使用者「你不夠努力」
- 引用 worksheet 既有解法（「先去這群人聚集的地方混 1-2 週」）
- 提供「暫存」出口，避免逼使用者亂填

---

## [AI INTEGRATION]

- **AI 介入狀態**：❌ **完全禁用（鐵律 — strictest）**
- **理由**（直接引自 worksheet 卡 2 「🤖 不能讓 AI 代填」段落）：
  > 這張卡片**完全是你的功課**，AI 不能幫忙。理由：AI 會生「合成 persona」（虛構的人），但虛構的人**不會付錢**。
- **設計手法**：
  - ai_disabled_callout 醒目區塊（Caution amber 框）放在 input_form 之前，讓使用者進頁面就看到
  - 不提供「AI 推薦相似人選」「AI 補充背景描述」「AI 生成 persona」按鈕
  - 不提供「我想不到 3 個人，幫我列舉典型 persona」這類捷徑
- **內建 prompt 引用**：無
- **Fallback**：無

### 為什麼這張卡是「鐵律」級別禁用？

| 風險 | 說明 |
| :--- | :--- |
| 合成 persona 不會付錢 | 這是 worksheet 明確標註的核心原則 — 整份方法論建立在「真實樣本」上，AI 生 persona 直接破壞前提 |
| 跳過社群混入訓練 | worksheet 的失敗路由就是「先去這群人聚集的地方混 1-2 週」— 如果允許 AI 補 persona，使用者會跳過這個關鍵訓練 |
| 後續卡片連鎖失效 | 卡 4「workaround」、卡 8「真人訪談」都依賴卡 2 的真人 — 如果這 3 個人是 AI 生的，後面全部失效 |

---

## [OCTALYSIS HOOKS]

### 主驅動力

- **#5 Social Influence & Relatedness（社交影響）— 主驅動力**
  - 設計手法：
    - 整張卡的核心是「真人連結」— 強調「你必須認識這 3 個人」是社交關係的訴求
    - 但**禁止排行榜、禁止「他人也填了 X 位」這類社群比較**（避免黑帽化）
    - example_reference 提供範例但不提供「最受歡迎的 persona」這類社交證明 — 純粹是格式參考

### 副驅動力

- **#2 Development & Accomplishment（成就感）— 副驅動力**
  - 設計手法：
    - exit_gate_footer 反思問題清晰 — 完成 3 位真人 = 達成里程碑（但不發徽章、不顯示分數）
    - 卡 1 → 卡 2 的 stepper 進度視覺化（但用 step indicator 非 score）
- **#1 Epic Meaning（史詩感）— 副驅動力**
  - 設計手法：
    - ai_disabled_callout 強化「這是判斷力訓練」的使命感
    - 「先去這個圈子混 1-2 週」的退場路徑反而強化「這份功課值得花時間」的使命感

### 設計手法清單

| 元件 | Octalysis 手法 | 說明 |
| :--- | :--- | :--- |
| ai_disabled_callout | #1 Epic Meaning | 反向 framing：禁用 AI 是訓練價值的核心 |
| input_form 3 組 person | #5 真人連結 | 強迫使用者面對「我認識誰」這個社交事實 |
| anti_fake_check | #3 即時反饋 | 即時提示品質 |
| fallback_action_card | #1 + #5 | 「先去混 1-2 週」是社群參與的 epic 框架 |
| exit_gate_footer | #2 反思問題 | 透明可見，不需推測 |

### 反模式警告（黑帽禁用清單）

| 禁用 | 為何不能用 |
| :--- | :--- |
| ❌ 排行榜（「本月填卡 2 完成最快的人」） | brand 鐵律 — 違反 anti-leaderboard |
| ❌ 「90% 使用者第一次都填不出 3 個真名」社群比較 | 製造焦慮（即使是真的）— 違反 anti-anxiety |
| ❌ 「AI 推薦你可能認識的人」按鈕 | 違反鐵律禁用 |
| ❌ 「自動補充 background 描述」按鈕 | AI 會生合成 persona |
| ❌ 「跳過此卡，3 天後再填」按鈕 | 卡 2 是判斷力訓練的試金石 — 跳過 = 整份失效 |
| ❌ Streak / 連續登入獎勵 | 違反 anti-anxiety |
| ❌ 「不滿意現有人選？AI 給你新提案」 | 違反鐵律 |

### 特別警示：#5 Social Influence 的白帽邊界

- ✅ 允許：「真人連結」「具體姓名」「能聯絡到」（強調**真實社交關係**）
- ❌ 禁止：「比較他人進度」「公開分享你的 persona 列表」「按讚 / 評分他人 PainCard」（這是黑帽操作）

---

## [BRAND LANGUAGE RULES (PAGE-SPECIFIC)]

### 禁止用語

| 禁止 | 替代 |
| :--- | :--- |
| 「persona」（單獨使用） | 「真人」「具體姓名」 |
| 「目標客戶 / TA」 | 「主人翁」「這群人」 |
| 「想像的使用者」 | 不出現（這張卡禁止想像） |
| 「分數 / 評分」 | 「即時檢核」 |
| 「比他人快 / 排名 / 平均完成時間」 | 不出現 |

### 建議用語

| 建議 | 場景 |
| :--- | :--- |
| 「真名」「具體姓名」 | 強調 R2.2 |
| 「你今天就能聯絡到」 | 強調可達成性 |
| 「這個圈子」 | 引用 worksheet 退場路徑 |
| 「混 1-2 週」 | 引用 worksheet 解法 |

### 語調

- **Strict but kind**：禁止 AI 介入是鐵律，但用 worksheet 原文解釋為什麼
- **Honest about difficulty**：明確告訴使用者「想不到 3 個真名是常見的，這代表你還沒接觸圈子」
- **No shame**：失敗不是道德瑕疵，是訊號

---

## [ACCEPTANCE CRITERIA]

- [ ] 7 個 Section 依序正確渲染
- [ ] URL `?id={uuid}` 從 LocalStorage 正確讀取 PainCard
- [ ] background + 3 組 person 自動儲存到 LocalStorage
- [ ] anti_fake_check check_1（R2.2）正確偵測代稱（"老師 A"、"同學 B"、"persona 1"、"A"、"B"、"C" 等）
- [ ] anti_fake_check check_2 偵測「至少 1 個 contact 包含可聯絡關鍵字」
- [ ] anti_fake_check check_2 「我確認今天能聯絡到至少 1 位」checkbox 必須勾選才過關
- [ ] anti_fake_check check_3 background 至少 2 個具體屬性
- [ ] exit_gate_footer 在所有條件通過時 CTA enable
- [ ] CTA 點擊失敗 ≥ 3 次後額外顯示 fallback_action_card
- [ ] fallback_action_card「暫存先去找人」正確 PATCH `status = 'draft'` 並導向 landing
- [ ] CTA 過關後 PATCH `current_step = 3` → 導向 `/learn/worksheet/03?id={uuid}`
- [ ] ai_disabled_callout 醒目顯示，引用 worksheet 卡 2 原文
- [ ] **全頁面不出現任何「AI 推薦」「AI 生成」「AI 補充」按鈕**
- [ ] **全頁面不出現排行榜、社群比較、徽章、streak**
- [ ] example_reference 引用 worksheet 林老師 3 位老師範例
- [ ] 鍵盤 Tab 順序正確
- [ ] 螢幕閱讀器讀出 ai_disabled_callout 文字（aria-live="polite"）
- [ ] LocalStorage quota 滿時降級提示
- [ ] RWD 三斷點正確
- [ ] 符合 PainMap brand 視覺規範
