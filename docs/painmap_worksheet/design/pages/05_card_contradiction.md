# Page-Level Spec: Card 5 — 兩件事不能同時要（取捨自陳）

> Worksheet 第五張卡片。對應「卡片 5 ｜ 找出兩件事不能同時要」。使用者用自己的話寫 side_a / side_b、選 sacrificed、自陳 sacrificed_reason。蘇格拉底原則：問題取代評分，使用者親筆書寫即反思。

---

## [PAGE META]

- **page_name**: Card 5 - Contradiction (Socratic Trade-off)
- **route_path**: `/learn/worksheet/05?id={paincard_uuid}`
- **page_type**: worksheet_card (input form, 純使用者書寫)
- **primary_goal**: 引導使用者用自己的話寫出 `contradiction.side_a`（≥10 字）+ `side_b`（≥10 字）+ 選 `sacrificed` (a/b) + 自陳 `sacrificed_reason`（≥1 句）
- **secondary_goal**: 訓練「真痛點背後通常是兩件事不能同時要」的取捨思維 — 由使用者親筆拆解，不依賴預設分類學
- **target_users**: 已通過卡 4 反思的使用者
- **entry_point**: 卡 4 完成後 PATCH 跳轉 / LocalStorage 恢復 `current_step === 5`
- **expected_time_on_page**: 5-10 分鐘（純書寫，無 AI prompt）
- **corresponds_to_worksheet**: `docs/workshop/painpoint_beginner_worksheet.md` 卡片 5
- **corresponds_to_data_model**: `PainCard.contradiction` 物件

---

## [蘇格拉底核心提示]

> **頁面頂部固定顯示，使用者寫作前先讀**：
>
> 「他想要 ___，但又同時想要 ___。如果他能放掉其中一邊，他不會卡在這裡——所以他**放不下哪邊**？為什麼？」

使用者必須自己拆出這兩件事，不從預設清單裡認領。寫作即反思。

---

## [STRUCTURE: SECTIONS]

1. **stepper_header**
2. **card_intro**（含蘇格拉底核心提示）
3. **trade_off_form**（side_a + side_b + sacrificed + sacrificed_reason 四欄）
4. **example_reference**（worksheet 林老師範例，可摺疊）
5. **reflection_footer**（反思提示，不擋前進）

---

## [SECTION COMPONENT SPEC]

### Section: stepper_header

- 與卡 1-4 一致
- ai_indicator: Badge / required / "AI 介入：❌ 純書寫"

### Section: card_intro

- **layout**: 全寬，標題 + 蘇格拉底引導區
- **elements**:
  - card_number: Eyebrow / required / "卡 5 / 9"
  - card_title: H1 / required / "找出「兩件事不能同時要」"
  - socratic_prompt: AlertBox (Primary Light bg) / required
    - icon: GitMerge
    - text: Body MD / "**他想要 ___，但又同時想要 ___。如果他能放掉其中一邊，他不會卡在這裡——所以他放不下哪邊？為什麼？**"
  - rule_callout: Body MD / required / "很多痛點背後其實是『他想要兩件事，但只能選一個』。看清這個取捨，後面才知道訪談要怎麼問。"
- **states**: default
- **copy_constraints**: card_title 最多 14 字；socratic_prompt 強制顯示，不可收合

### Section: trade_off_form

- **layout**: 步驟區塊 + 4 個欄位垂直排列
- **elements**:
  - field_side_a: TextareaField / required
    - label: H3 / "A 端（他想要這個）"
    - helper: Body SM / "用主人翁的話寫具體。不是「想要好」「想要快」這種抽象詞。"
    - placeholder: "家長要看見「我的孩子」被個別關照（具體事件、語氣有溫度）"
    - rows: 3
    - data_field: `contradiction.side_a`
    - validation: minLength 10
  - field_side_b: TextareaField / required
    - label: H3 / "B 端（他也想要這個）"
    - helper: Body SM / "跟 A 端對立的另一邊。同樣要具體。"
    - placeholder: "老師一週只有 2-3 小時可寫 30 則（每則 < 6 分鐘）"
    - rows: 3
    - data_field: `contradiction.side_b`
    - validation: minLength 10
  - field_sacrificed: RadioGroup / required
    - label: H3 / "如果只能選一邊，他通常會犧牲哪邊？"
    - options:
      - radio_a: "犧牲 A 端"
      - radio_b: "犧牲 B 端"
    - data_field: `contradiction.sacrificed` (`'a' | 'b'`)
  - field_sacrificed_reason: TextareaField / required
    - label: H3 / "為什麼是這邊被犧牲？"
    - helper: Body SM / "用一句話寫。這個自陳會讓你看清楚他真正卡在哪裡。"
    - placeholder: "因為時間是硬限制，個人化只能讓步——他週六晚上沒辦法多生出 3 小時"
    - rows: 2
    - data_field: `contradiction.sacrificed_reason`
    - validation: minLength 1（至少 1 句）
- **states**:
  - default: 4 個欄位空白
  - filling: 即時 minLength 提示
  - filled: 全部欄位有值
- **copy_constraints**: side_a / side_b minLength 10；sacrificed_reason 至少要寫 1 句完整話

### Section: example_reference

- **layout**: 全寬可摺疊（預設摺疊）
- **elements**:
  - toggle_header: ToggleHeader / required / "看 worksheet 林老師範例"
  - example_content: ExamplePanel / required (when expanded)
    - block_a: BlockQuote / "A 端：家長要看見「我的孩子」被個別關照（具體事件、語氣有溫度）"
    - block_b: BlockQuote / "B 端：老師一週只有 2-3 小時可寫 30 則（每則 < 6 分鐘）"
    - block_sacrificed: BlockQuote / "通常犧牲：A 端"
    - block_reason: BlockQuote / "為什麼：因為時間是硬限制，個人化只能被罐頭訊息取代——家長一看就知道沒在用心，但老師寫不完。"
  - source_link: Link / "來自 worksheet 卡片 5"
- **states**: collapsed / expanded

### Section: reflection_footer

- **layout**: 全寬固定底部
- **elements**:
  - reflection_hints: ReflectionHint[] / required
    - hint_1: Bullet / "想想看：A、B 兩端都具體嗎？（不是抽象詞）"
    - hint_2: Bullet / "想想看：sacrificed_reason 是不是寫了完整一句話？"
    - hint_3: Bullet / "想想看：如果你寫的兩端他可以同時擁有，那這就不是矛盾——回去再想"
  - primary_cta: Button Primary / required / "繼續到卡 6 →"
  - secondary_cta: Button Ghost / optional / "回到卡 4"
- **states**:
  - default: 4 欄填齊 → primary_cta 一般可點
  - missing_required: 4 欄未滿足 → 顯示提示「想想看，再寫具體一點」（**不擋前進**）
- **copy_constraints**: 不使用「過關條件」「未通過」「失敗」等詞；用「想想看」「回去再想」中性措辭

---

## [INTERACTION & STATE FLOW]

### 主要互動流程

1. 頁面載入 → 從 LocalStorage 讀 `complaint`、`stuck_formula`、`workaround` 顯示在側邊摘要供參考
2. 使用者讀蘇格拉底核心提示
3. 使用者依序填 side_a → side_b → sacrificed → sacrificed_reason
4. 點擊 `primary_cta`：
   - 若 4 欄達反思條件：PATCH `current_step = 6` → 導向卡 6
   - 若未達：顯示反思提示 hint，但**仍允許繼續**（蘇格拉底守門但不擋）

### RWD 行為差異

| 斷點 | 佈局 |
| :--- | :--- |
| Desktop | 全寬單欄；side_a/b 並排（2 欄） |
| Tablet | 同 Desktop |
| Mobile | 全部單欄垂直堆疊 |

---

## [DATA & API]

- **uses_api**: true
- **endpoints**: GET / PATCH `/api/paincards/{id}`
- **localStorage_keys**: `painmap-worksheet-v2.cards.{id}.contradiction`
- **schema_reference**: `product/data_model.md` § Card 5 + JSON Schema `contradiction`

---

## [REFLECTION CONDITIONS]

> **過關條件已改為反思條件**：4 欄滿足代表「資料完整」，但**不擋前進**。

| # | 條件 | 資料層判定 | UI 反饋 |
| :- | :--- | :--- | :--- |
| 1 | A、B 兩端都具體 | `side_a.length >= 10` 且 `side_b.length >= 10` | 欄位通過 |
| 2 | sacrificed 已選 | `sacrificed === 'a' \|\| 'b'` | radio 已選 |
| 3 | sacrificed_reason 至少 1 句 | `sacrificed_reason.length >= 1` | 欄位通過 |

### 未滿足時

| 情境 | UI 反饋 | 行為 |
| :--- | :--- | :--- |
| `side_a` 或 `side_b` 太短 | hint：「兩端要具體（不是『想要好』『想要快』）。看 worksheet 林老師範例」 | 不擋前進 |
| `sacrificed` 未選 | hint：「請選通常會犧牲哪邊」 | 不擋前進 |
| `sacrificed_reason` 空白 | hint：「為什麼這邊被犧牲？用一句話寫」 | 不擋前進 |

---

## [AI INTEGRATION]

- **AI 介入狀態**：❌ **AI 完全不參與**
- **AI 角色**：無
- **理由**：這張卡是純使用者自陳。使用者親筆寫作即反思——AI 介入會稀釋訓練效果。

---

## [OCTALYSIS HOOKS]

### 主驅動力

- **#3 Empowerment of Creativity & Feedback（賦權創造）— 主驅動力**
  - 設計手法：
    - 使用者必須**自己拆出**兩件事——沒有預設清單可選
    - sacrificed_reason 自陳取代從預設標籤裡認領

### 副驅動力

- **#1 Epic Meaning（史詩感）**
  - 設計手法：「拆出真正的取捨」是判斷力訓練的核心高光時刻

### 反模式警告（黑帽禁用清單）

| 禁用 | 為何不能用 |
| :--- | :--- |
| ❌ 「抽卡」式 UI / 隨機顯示選項 | 違反 #7 Unpredictability 黑帽 |
| ❌ AI 自動寫入 side_a / side_b | 違反「使用者自陳」核心訓練 |
| ❌ 預設下拉選單給「常見矛盾」| 鐵律：沒有預設分類學 |
| ❌ 「神秘第 7 種」「複合矛盾」彩蛋 | 違反「使用者完全自陳」原則 |
| ❌ 倒數計時器 | 違反 anti-anxiety |

---

## [BRAND LANGUAGE RULES (PAGE-SPECIFIC)]

### 禁止用語

| 禁止 | 替代 |
| :--- | :--- |
| 「TRIZ 矛盾」「6 種矛盾」 | 「兩件事不能同時要」「取捨」 |
| 「過關條件」「退回卡 X」 | 「想想看」「回去再想」 |
| 「AI 推薦」「AI 智慧匹配」 | 不出現（這張卡 AI 不參與）|
| 「神秘 / 神奇」 | 不出現 |

### 建議用語

| 建議 | 場景 |
| :--- | :--- |
| 「兩件事不能同時要」 | worksheet 大白話 |
| 「取捨」「自陳」 | 蘇格拉底用語 |
| 「想想看」 | 反思提示 |

### 語調

- **Empowering**：使用者自己拆，不靠分類學
- **Anti-randomness**：明確拒絕「抽卡感」與預設清單
- **Calm**：欄位未滿足只「想想看」，不施壓

---

## [ACCEPTANCE CRITERIA]

- [ ] 5 個 Section 依序正確渲染
- [ ] 蘇格拉底核心提示頁面頂部固定顯示
- [ ] field_side_a / side_b minLength 10 才達反思條件（但不擋前進）
- [ ] field_sacrificed 為單選 radio（'a' / 'b'）
- [ ] field_sacrificed_reason 至少 1 句才達反思條件
- [ ] 4 欄達反思條件 → primary_cta 一般可點 / 未達 → 顯示 hint 但仍允許前進
- [ ] CTA 點擊後 PATCH `current_step = 6` → 導向 `/learn/worksheet/06?id={uuid}`
- [ ] example_reference 引用 worksheet 林老師範例（含 sacrificed_reason）
- [ ] AI 介入 badge 顯示「❌ 純書寫」
- [ ] **全頁面零 TRIZ 標籤、零 6 矛盾預覽、零 AI prompt 區塊**
- [ ] **全頁面零分數 UI、零星等、零排行榜、零 streak**
- [ ] 不出現「過關條件」「退回卡 X」「失敗」等遊戲化措辭
- [ ] 鍵盤 Tab 順序：stepper → side_a → side_b → sacrificed radio → sacrificed_reason → CTA
- [ ] LocalStorage 自動儲存（key: `painmap-worksheet-v2`）
- [ ] RWD 三斷點正確
- [ ] 符合 PainMap brand 視覺規範
