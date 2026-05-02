# Page-Level Prompt: Card 5 — 兩件事不能同時要 (TRIZ 矛盾)

> Worksheet 第五張卡片。對應「卡片 5 ｜ 找出兩件事不能同時要」。AI 介入從 6 種矛盾中**挑出 1 個最符合**的，使用者填 side_a / side_b / sacrificed。**反模式警告：禁止「抽卡」式 UI**（避免偷渡 Octalysis #7 Unpredictability 黑帽驅動力）— 6 種矛盾必須以**清晰選擇器**呈現，不是隨機抽取。

---

## [PAGE META]

- **page_name**: Card 5 - TRIZ Contradiction
- **route_path**: `/learn/worksheet/05?id={paincard_uuid}`
- **page_type**: worksheet_card (input form + AI prompt copy block + structured selector)
- **primary_goal**: 引導使用者填 `contradiction.triz_id`（單選 1 種，禁止複選）+ `side_a` + `side_b` + `sacrificed`，透過 AI 提案來選擇最符合的矛盾
- **secondary_goal**: 訓練「真痛點背後通常是兩件事不能同時要」的拆解思維 — TRIZ 矛盾識別（worksheet 進階詞彙）
- **target_users**: 已通過卡 4 的使用者
- **entry_point**: 卡 4 過關後 PATCH 跳轉 / LocalStorage 恢復 `current_step === 5`
- **expected_time_on_page**: 8-15 分鐘（含跳到外部 AI 跑 prompt）
- **corresponds_to_worksheet**: `docs/workshop/painpoint_beginner_worksheet.md` 卡片 5
- **corresponds_to_data_model**: `PainCard.contradiction` 物件
- **corresponds_to_reference**: `references/triz_contradictions.md` 6 種矛盾配方

---

## [STRUCTURE: SECTIONS]

1. **stepper_header**
2. **card_intro**
   - section_purpose: 說明「真痛點 = 兩件事不能同時要」+ 6 種矛盾的概念
3. **ai_prompt_block** (Step 1: AI 從 6 種挑 1 個)
4. **ai_response_input** (Step 2: 貼回 AI 答案 — AI 推薦的 triz_id)
5. **triz_selector** (Step 3: 確認選擇 + 填 side_a/side_b/sacrificed)
6. **example_reference**
7. **exit_gate_footer**

---

## [SECTION COMPONENT SPEC]

### Section: stepper_header

- 與卡 1-4 一致
- ai_indicator: Badge (Verified Green border) / required / "AI 介入：✅ TRIZ 提案"

### Section: card_intro

- **layout**: 全寬，標題 + 說明區
- **elements**:
  - card_number: Eyebrow / required / "卡 5 / 9"
  - card_title: H1 / required / "找出「兩件事不能同時要」"
  - rule_callout: AlertBox (Primary Light bg) / required
    - icon: GitMerge
    - text: Body MD / "**為什麼這張卡關鍵：** 很多痛點背後其實是「他想要兩件事，但只能選一個」。看清這個矛盾，後面才知道訪談要怎麼問、產品要怎麼切。"
  - six_contradictions_preview: SixContradictionsList / required / 6 種矛盾預覽（純資訊，不可點選 — 選擇放在 triz_selector）
    - "1. 想快但又想做得好"
    - "2. 想客製化但又想規模化"
    - "3. 想快但又想正確"
    - "4. 想很專業但又想新手好上手"
    - "5. 想自動化但又怕失控"
    - "6. 想多嘗試但又怕出包"
  - reference_link: Link / required / "查看 6 種矛盾的詳細說明" / -> `references/triz_contradictions.md`
- **states**: default / loading
- **copy_constraints**: card_title 最多 14 字

### Section: ai_prompt_block (Step 1)

- **layout**: 步驟區塊 + 完整 prompt 複製 widget
- **elements**:
  - step_label: H2 / required / "Step 1：請 AI 從 6 種挑 1 個最像的"
  - tool_picker: AIToolPicker / optional
  - prompt_block: AIPromptCopyBlock / required
    - prompt_template: 直接從 worksheet 卡 5「🤖 AI 幫你提案（複製這段 prompt）」段落萃取，**不重寫**
    - 內含變數：
      - `{stuck_formula}` ← `stuck_formula.ai_polished || stuck_formula.user_draft`
      - `{workaround}` ← `workaround.tool_name + " — " + workaround.why_still_stuck + "（不滿：" + workaround.user_dissatisfactions.join("、") + "）"`
    - 最終文字：
```
有一個人遇到這個卡關：
{stuck_formula}

他現在用：
{workaround}

從以下 6 種「兩件事不能同時要」中，挑出最符合他的 1 種：

1. 想快但又想做得好
2. 想客製化但又想規模化
3. 想快但又想正確
4. 想很專業但又想新手好上手
5. 想自動化但又怕失控
6. 想多嘗試但又怕出包

請挑 1 個，並用主人翁的話說明這 2 件事在他身上具體是什麼。
不要挑超過 1 個。如果你覺得 6 個都不像，回答「不像，請我退回卡片 3」。
```
  - copy_button: Button Primary / required / "複製 prompt"
  - external_link: Button Secondary / optional / "在新分頁開啟 ChatGPT"
  - prompt_source_link: Link / required / "Prompt 來源：worksheet 卡片 5"
- **states**: default / copied / missing_data / loading
- **copy_constraints**: prompt 內容**逐字引用 worksheet**

### Section: ai_response_input (Step 2)

- **layout**: 步驟區塊 + 文字輸入
- **elements**:
  - step_label: H2 / required / "Step 2：AI 推薦的是哪個？（記下來）"
  - field_ai_recommendation: TextField / optional
    - label: H3 / "AI 推薦的矛盾類型"
    - helper: Body SM / "把 AI 推薦的選項編號（1-6）填這裡。如果 AI 回「不像，請退回卡片 3」，點下方退回 link"
    - placeholder: "2"
    - data_field: 不直接寫 schema，僅 UI 暫存
  - field_ai_explanation: TextareaField / optional
    - label: H3 / "AI 用主人翁的話說明的版本"
    - helper: Body SM / "AI 解釋這 2 件事在主人翁身上具體是什麼（可貼整段）"
    - rows: 3
    - data_field: 不直接寫 schema，僅 UI 暫存（用於下方 selector 預填）
  - retreat_link: Link / conditional / "AI 說 6 個都不像 → 退回卡 3" / -> `/learn/worksheet/03?id={uuid}` (顯示確認 modal)
- **states**: default / typing / loading
- **copy_constraints**: helper 最多 35 字

### Section: triz_selector (Step 3)

- **layout**: 步驟區塊 + 矛盾選擇器 + 3 個欄位
- **elements**:
  - step_label: H2 / required / "Step 3：確認選擇 + 填 A/B 兩端"
  - selector_warning: AlertBox (Caution Amber) / required
    - icon: AlertTriangle
    - text: Body SM / "**單選**（不可複選）— 複選代表你還沒拆乾淨，會被擋過關。如果你覺得超過一個，退回卡 3 再聊。"
  - triz_radio_selector: RadioGroup / required (single select)
    - data_field: `contradiction.triz_id` (1-6) + `contradiction.triz_label` (auto-fill)
    - options: 對應 `references/triz_contradictions.md` 6 種
      - radio_1: { id: 1, label: "想快但又想做得好", en: "Speed vs Quality" }
      - radio_2: { id: 2, label: "想客製化但又想規模化", en: "Personalization vs Scale" }
      - radio_3: { id: 3, label: "想快但又想正確", en: "Speed vs Accuracy" }
      - radio_4: { id: 4, label: "想很專業但又想新手好上手", en: "Expert vs Novice" }
      - radio_5: { id: 5, label: "想自動化但又怕失控", en: "Automation vs Control" }
      - radio_6: { id: 6, label: "想多嘗試但又怕出包", en: "Experimentation vs Risk" }
    - layout: 6 個 radio button，垂直排列（Desktop / Mobile 都垂直）— **絕對禁止 carousel / shuffle / random 顯示順序**
    - hint_per_option: 每個選項下方顯示「典型範例」（來自 `references/triz_contradictions.md`）
  - field_side_a: TextareaField / required (after selection)
    - label: H3 / "A 端（他想要這個）"
    - helper: Body SM / "選了矛盾後，A 端是什麼？用主人翁的話寫具體"
    - placeholder: "家長要看見「我的孩子」被個別關照（具體事件、語氣有溫度）"
    - rows: 2
    - data_field: `contradiction.side_a`
    - validation: minLength 10
  - field_side_b: TextareaField / required (after selection)
    - label: H3 / "B 端（他也想要這個）"
    - helper: Body SM / "B 端是什麼？跟 A 端對立的另一邊"
    - placeholder: "老師一週只有 2-3 小時可寫 30 則（每則 < 6 分鐘）"
    - rows: 2
    - data_field: `contradiction.side_b`
    - validation: minLength 10
  - field_sacrificed: RadioGroup / required (single select)
    - label: H3 / "如果只能選一邊，他通常會犧牲哪邊？"
    - options:
      - radio_a: "犧牲 A 端"
      - radio_b: "犧牲 B 端"
    - data_field: `contradiction.sacrificed` (`'a' | 'b'`)
- **states**:
  - default: 6 個 radio 未選，side_a/b 與 sacrificed 為 disabled
  - selected: triz_id 已選，下方欄位 enabled
  - filled: 全部欄位有值
  - loading: Skeleton
- **copy_constraints**: helper 最多 35 字；side_a/b minLength 10

### Section: example_reference

- **layout**: 全寬可摺疊（預設摺疊）
- **elements**:
  - toggle_header: ToggleHeader / required / "📖 看 worksheet 林老師範例"
  - example_content: ExamplePanel / required (when expanded)
    - block_1: BlockQuote / required / **AI 挑的：第 2 種（想客製化但又想規模化）**
    - block_2: BlockQuote / required
      - "A 端（個人化）：家長要看見「我的孩子」被個別關照（具體事件、語氣有溫度）"
      - "B 端（規模化）：老師一週只有 2-3 小時可寫 30 則（每則 < 6 分鐘）"
      - "通常會犧牲：A 端（罐頭訊息、家長一看就知道沒在用心）"
  - source_link: Link / "來自 worksheet 卡片 5"
- **states**: collapsed / expanded
- **copy_constraints**: 引用 worksheet

### Section: exit_gate_footer

- **layout**: 全寬固定底部
- **elements**:
  - exit_conditions: ExitGateChecklist / required
    - condition_1: "[ ] 只選 1 個（複選代表你還沒拆乾淨，退回卡片 3）"
    - condition_2: "[ ] A、B 兩端都具體（不是抽象詞）"
  - primary_cta: Button Primary / required / "儲存並進入卡 6 →"
  - secondary_cta: Button Ghost / optional / "回到卡 4"
  - blocked_message: AlertBox / conditional
  - retreat_action_card: Card / conditional / 當 AI 回「都不像」或使用者不知如何選時顯示
    - title: H3 / "6 個都不像？拆得不夠細"
    - body: Body MD / 引用 worksheet：「過不了 → 退回卡片 3，拆得不夠細。」
    - cta: Button Ghost / "退回卡 3 重新拆" / -> `/learn/worksheet/03?id={uuid}`
- **states**: 同前
- **copy_constraints**: blocked_message 最多 80 字

---

## [INTERACTION & STATE FLOW]

### 主要互動流程

1. 頁面載入 → 從 LocalStorage 讀 `stuck_formula` + `workaround` → 預填 prompt 變數
2. Step 1：使用者點「複製 prompt」→ 跳到外部 AI
3. Step 2：使用者貼回 AI 推薦的矛盾編號 + 解釋（暫存於 UI state，輔助 Step 3）
4. Step 3：使用者在 triz_radio_selector 確認選擇（單選） → triz_label 自動填入 → 填 side_a / side_b / sacrificed
5. 點擊 `primary_cta`：
   - 步驟 a：檢查 triz_id 已選（1-6）
   - 步驟 b：檢查 side_a / side_b minLength 10
   - 步驟 c：檢查 sacrificed 已選 a or b
   - 步驟 d：全通過 → PATCH `current_step = 6` → 導向卡 6

### Prompt 插值邏輯

```typescript
const stuck = painCard.stuck_formula.ai_polished || painCard.stuck_formula.user_draft;
const workaround = `${painCard.workaround.tool_name} — ${painCard.workaround.why_still_stuck}（不滿：${painCard.workaround.user_dissatisfactions.join("、")}）`;
const promptTemplate = `有一個人遇到這個卡關：
${stuck}

他現在用：
${workaround}

從以下 6 種「兩件事不能同時要」中，挑出最符合他的 1 種：
...
`;
```

### Triz 選擇器互動細節

- **單選互動**：使用 `<input type="radio">` 標準語意（不是自訂 chip 多選）
- **無動畫切換**：選擇 radio 不觸發旋轉、卡片翻轉、隨機洗牌動畫（避免 #7 Unpredictability 黑帽驅動力）
- **順序固定**：6 種矛盾按 1-6 編號顯示，**絕對不可隨機排序**（保證可預期）
- **未選擇時的下游欄位**：side_a / side_b / sacrificed 為 disabled 灰色，視覺提示「先選矛盾」

### RWD 行為差異

| 斷點 | 佈局 |
| :--- | :--- |
| Desktop | 全寬單欄，6 個 radio 垂直，side_a/b 並排（2 欄） |
| Tablet | 同 Desktop，side_a/b 維持並排 |
| Mobile | 全部單欄，side_a/b 垂直堆疊 |

---

## [DATA & API]

- **uses_api**: true
- **endpoints**: GET / PATCH `/api/paincards/{id}`
- **localStorage_keys**: `painmap_worksheet:cards.{id}.contradiction`
- **schema_reference**: `product/data_model.md` § Card 5 + JSON Schema `contradiction`
- **error_cases**: 同前

---

## [EXIT GATE]

> **過關條件 100% 對應 worksheet「🚦 過關條件」段落（卡片 5）**

### 過關條件

| # | 條件 | 資料層判定 | UI 反饋 |
| :- | :--- | :--- | :--- |
| 1 | 只選 1 個（複選代表你還沒拆乾淨，退回卡 3） | `contradiction.triz_id` 為 1-6 之一（單值，UI 強制 single select） | radio 已選 |
| 2 | A、B 兩端都具體（不是抽象詞） | `side_a.length >= 10` 且 `side_b.length >= 10` | 欄位通過 |
| 3 | sacrificed 已選 | `sacrificed === 'a' \|\| 'b'` | radio 已選 |

### 失敗路由

| 失敗情境 | 路由 | 友善文案 |
| :--- | :--- | :--- |
| `triz_id` 未選 | 高亮 triz_radio_selector | 「請選 1 種矛盾。如果 6 個都不像，點「退回卡 3 重新拆」。」 |
| AI 回覆「6 個都不像，請退回卡 3」 | retreat_action_card 顯示 | 「**拆得不夠細。** 退回卡 3 再聊一次主人翁，把卡關句寫得更具體。」 |
| `side_a` 或 `side_b` 太短或抽象 | 高亮欄位 + warning | 「兩端要具體（不是「想要好」「想要快」這種抽象詞）。看 worksheet 林老師範例如何具體描述。」 |
| `sacrificed` 未選 | 高亮 sacrificed radio | 「請選通常會犧牲哪邊。」 |

### 退回工作流

> 卡 5 過不了 → 退回**卡 3**

理由（引用 worksheet）：「過不了 → 退回卡片 3，拆得不夠細。」

實作：
- retreat_action_card 提供「退回卡 3 重新拆」link
- 點擊後導向卡 3，**保留卡 3-5 的資料**，提示「修改卡 3 後請回來重新跑卡 5 的 AI prompt」

---

## [AI INTEGRATION]

- **AI 介入狀態**：✅ **啟用 — TRIZ 提案（複製到外部 ChatGPT/Claude/Gemini）**
- **AI 角色**：
  - ✅ 從固定的 6 種矛盾中挑 1 個最像的
  - ✅ 用主人翁的話說明 A、B 兩端具體是什麼
  - ✅ 如果 6 個都不像，AI 可建議「退回卡 3」
  - ❌ 替使用者最終確認（使用者要在 triz_selector 確認選擇）
  - ❌ 提案 6 種以外的新矛盾類型（嚴格限定在 worksheet 既定的 6 種）
- **內建 prompt**：直接從 worksheet 卡 5「🤖 AI 幫你提案」段落萃取，**逐字引用，禁止改寫**
- **變數插值**：`{stuck_formula}` + `{workaround}` 從 LocalStorage 自動填入
- **MVP 模式**：使用者複製到外部 AI 跑 → 貼回 ai_recommendation + ai_explanation（暫存 UI）→ 在 triz_selector 確認
- **Fallback**：如使用者沒有 AI 工具：可直接在 triz_selector 自選（小字 link「跳過 AI 提案，我自己選」），但必須仍滿足過關條件

### 為什麼 AI 在這張卡能介入？

| 任務 | AI / 人 | 理由 |
| :--- | :--- | :--- |
| 從 6 種挑最像的 1 個 | AI 提案 + 人確認 | 6 種是固定範圍，AI 適合做 pattern matching |
| 用主人翁的話描述 A/B 端 | AI 草稿 + 人改寫 | 但最終 side_a/b 必須由使用者填，避免 AI 編造 |
| 確認最終選擇 | 人 | 使用者要為這個判斷負責 |

### prompt 引用文件

- 完整 prompt：`references/ai_prompt_library.md` § 卡 5 prompt
- 6 種矛盾詳細說明：`references/triz_contradictions.md`
- 元件：`design/components/ai_prompt_copy_block.md`

---

## [OCTALYSIS HOOKS]

### 主驅動力

- **#3 Empowerment of Creativity & Feedback（賦權創造）— 主驅動力**
  - 設計手法：
    - 6 種矛盾的選擇是**思辨選擇** — 使用者要主動判斷「我看到的痛點屬於哪一種對立？」
    - AI 提案後使用者**仍要在 triz_selector 主動確認** — 不是 AI 直接寫入
    - 「6 個都不像 → 退回卡 3」是高度賦權 — 你可以拒絕系統提案

### 副驅動力

- **#1 Epic Meaning（史詩感）— 副驅動力**
  - 設計手法：
    - card_intro 引用 worksheet 進階詞彙「TRIZ 矛盾識別」 — 讓使用者知道這是經典框架（教學模式可顯示）
    - 「拆出真正的矛盾」是判斷力訓練的核心高光時刻
- **#2 Development & Accomplishment（成就感）— 副驅動力**
  - 設計手法：
    - 完成卡 5 = 真正進入「結構化思考」 — 過了一半，前半段（卡 1-5）是真痛點輪廓，後半段（卡 6-9）是證據與判斷

### 設計手法清單

| 元件 | Octalysis 手法 | 說明 |
| :--- | :--- | :--- |
| six_contradictions_preview | #1 Epic Meaning | 介紹 6 種矛盾，傳達「這是經典思維框架」 |
| ai_prompt_block | #3 工具選擇 | AI 是助理 |
| triz_radio_selector | #3 思辨選擇 | 單選 + 順序固定 |
| selector_warning（單選提示） | 反 #7 Unpredictability | 強調結構化選擇，禁止偷渡抽卡感 |
| retreat_action_card | #3 拒絕系統 | 你可以說「都不像」 |

### 反模式警告（黑帽禁用清單）

> **這張卡的反模式警告級別最高 — 因為「6 種選 1」結構容易被誤設計成「抽卡」。**

| 禁用 | 為何不能用 |
| :--- | :--- |
| ❌ **「抽卡」式 UI**（隨機顯示 6 種、shuffle 動畫、卡片翻轉） | 違反 #7 Unpredictability 黑帽 — TRIZ 是結構化框架，不是運氣 |
| ❌ **隨機排序 6 種選項** | 違反「結構優於裝飾」brand 原則 |
| ❌ **AI 自動寫入 triz_id**（不需使用者確認） | 違反「思辨選擇」核心訓練 |
| ❌ **複選機制** | 違反 worksheet 鐵律「只選 1 個」 |
| ❌ **AI 解鎖動畫**（「叮咚！AI 為你選好了！」） | 過度遊戲化 |
| ❌ **「神秘第 7 種」彩蛋** | 違反「6 種固定範圍」鐵律 |
| ❌ **「你的選擇與 X% 使用者相同」** | 違反 anti-comparison + 製造從眾壓力 |
| ❌ **倒數計時器** | 違反 anti-anxiety |

### 特別警示：#3 Empowerment vs #7 Unpredictability 的紅線

| 白帽 #3 | 黑帽 #7 |
| :--- | :--- |
| ✅ 使用者**主動選**從固定 6 種中挑 1 個 | ❌ 隨機顯示讓使用者「期待下一個更好」 |
| ✅ 順序、選項、含義皆透明可預期 | ❌ Shuffle / 抽卡 / 翻牌動畫 |
| ✅ AI 提案有清楚 prompt 邏輯 | ❌ 黑盒「AI 神秘推薦」 |
| ✅ 結果可被質疑（「都不像」） | ❌ 結果是「命運」不可挑戰 |

---

## [BRAND LANGUAGE RULES (PAGE-SPECIFIC)]

### 禁止用語

| 禁止 | 替代 |
| :--- | :--- |
| 「抽 1 個」「抽到」 | 「選 1 個」 |
| 「神秘 / 神奇」 | 「結構化的 6 種」 |
| 「AI 神秘推薦」「AI 智慧匹配」 | 「AI 提案」 |
| 「解鎖第 7 種」 | 不存在 |
| 「你的命運矛盾」 | 不出現 |
| 「百搭組合」「複合矛盾」 | 違反「只選 1 個」 |

### 建議用語

| 建議 | 場景 |
| :--- | :--- |
| 「兩件事不能同時要」 | worksheet 大白話 |
| 「TRIZ 矛盾」 | 進階詞彙（教學模式） |
| 「思辨選擇」 | 強調主動判斷 |
| 「6 種固定範圍」 | 強調結構化 |

### 語調

- **Structured**：6 種固定，不浮誇
- **Empowering**：你來判斷，AI 只提案
- **Anti-randomness**：明確拒絕「抽卡感」

---

## [ACCEPTANCE CRITERIA]

- [ ] 7 個 Section 依序正確渲染
- [ ] 從 LocalStorage 正確讀取 `stuck_formula` + `workaround`
- [ ] ai_prompt_block 正確插值 `{stuck_formula}` + `{workaround}`
- [ ] **prompt 內容與 worksheet 卡 5 原文 100% 一致（逐字驗證）**
- [ ] copy_button 正確複製到剪貼簿
- [ ] triz_radio_selector 為**單選**（HTML radio group），UI 強制 single select
- [ ] **triz_radio_selector 的 6 個選項順序固定為 1-6，不隨機**
- [ ] **triz_radio_selector 不使用 carousel / shuffle / flip / spin 動畫**
- [ ] triz_id 對應 triz_label 自動填入（依 `references/triz_contradictions.md`）
- [ ] field_side_a + field_side_b 在 triz_id 未選時為 disabled
- [ ] field_side_a / side_b minLength 10 才能過關
- [ ] field_sacrificed 為單選 radio（'a' / 'b'）
- [ ] retreat_action_card「退回卡 3 重新拆」link 正確導向（保留卡 3-5 資料）
- [ ] CTA 過關後 PATCH `current_step = 6` → 導向 `/learn/worksheet/06?id={uuid}`
- [ ] selector_warning 醒目顯示「單選」
- [ ] example_reference 引用 worksheet 林老師範例（第 2 種矛盾）
- [ ] AI 介入 badge 顯示「✅ TRIZ 提案」
- [ ] **全頁面零「抽卡」式 UI、零隨機動畫、零 shuffle**
- [ ] **全頁面不出現「神秘第 7 種」「複合矛盾」「百搭組合」這類違反鐵律的選項**
- [ ] 全頁面零分數 UI、零星等、零排行榜、零 streak
- [ ] 鍵盤 Tab 順序：stepper → tool_picker → copy_button → external_link → ai_recommendation → ai_explanation → 6 個 radio → side_a → side_b → sacrificed radio → CTA
- [ ] 螢幕閱讀器讀出 6 個 radio 為單選 group（aria-radiogroup）
- [ ] LocalStorage 自動儲存
- [ ] RWD 三斷點正確
- [ ] 符合 PainMap brand 視覺規範
