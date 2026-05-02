# PainMap Worksheet — Card 5 (TRIZ Contradiction) Integrated Prompt

> 自我包含整合 prompt — 直接貼入 Lovable / Claude Code 即可生成卡 5 完整實作。
> 對應 page spec：`docs/painmap_worksheet/design/pages/05_card_contradiction.md`
> 對應資料模型：`docs/painmap_worksheet/product/data_model.md` § Card 5
> 組裝日期：2026-05-02 ｜ Worksheet v1.0

---

## === GLOBAL PROJECT GUIDELINE (DO NOT OVERRIDE) ===

你是「PainMap 題眼 — Worksheet 教學模式」的資深產品設計師與前端工程師。

### 品牌特質

**結構化** ｜ **賦權感** ｜ **沉穩** ｜ **教學優先**

### Color Tokens

| Token | 色值 | 用途 |
| :--- | :--- | :--- |
| Primary #1E3A5F / Primary Light #E8EEF5 / Secondary #2D7D8A / Accent CTA #E8913A / Verified #2D9D78 / Caution #D97706（selector_warning）/ BG Page #F7F8FA / BG Muted #F1F3F5 / Text Primary #1A2332 / Text Secondary #5C6B7A / Border Default #DFE3E8 / Border Focus #2D7D8A |

### Typography

H1 28px / H2 22px / H3 18px / Body LG 17px / Body MD 15px / Body SM 13px / Caption 12px

字體：`Noto Sans TC` + `Inter` + `JetBrains Mono`（prompt block）

### 元件風格

- Radius MD 8px / LG 12px
- Border `1px solid #DFE3E8` / focus 2px Teal
- Shadow SM / MD

### 技術棧

React 18 + TypeScript + Tailwind + Zustand + React Hook Form + Zod。LocalStorage key：`painmap_worksheet:cards`、`user_pref.ai_tool`。

### 絕對禁令（PainMap Brand）

- 禁止：分數、星等、A-F、成功率、排行榜、徽章、倒數計時
- 禁用詞：「抽 1 個」「抽到」「神秘」「神奇」「AI 神秘推薦」「AI 智慧匹配」「解鎖第 7 種」「你的命運矛盾」「百搭組合」「複合矛盾」「闖關」「升級」「streak」
- 禁止 Inline styles / `console.log`
- WCAG AA / 語意化 HTML / focus ring Teal

### 絕對禁令（Octalysis 黑帽 — 卡 5 為**反 #7 警示最高**）

- 禁止 #6 Scarcity：時間壓力、「神秘第 7 種限時開放」
- **禁止 #7 Unpredictability**（**卡 5 重點警示**）：
  - 不可有 carousel / shuffle / flip / spin 動畫
  - 不可隨機顯示 6 種選項順序
  - 不可有「神秘 AI 推薦」黑盒
  - 不可有抽卡式 UI、卡片翻轉動畫、解鎖音效
- 禁止 #8 Loss Avoidance：streak / 過期 / 「沒選會消失」

### 教學模式特殊鐵律

1. **反 solution mode**：本卡 prompt 含「不要建議解決方案」guard
2. **書面優先**：A、B 兩端必須具體（不是抽象詞）
3. **過關條件透明**：單選 + side_a/b 具體 + sacrificed 已選
4. **失敗回退**：6 個都不像 → 退回卡 3（拆得不夠細）

---

## === CURRENT TASK: BUILD CARD 5 — TRIZ CONTRADICTION ===

### [PAGE META]

- **page_name**: Card 5 - TRIZ Contradiction
- **route_path**: `/learn/worksheet/05?id={paincard_uuid}`
- **card_step**: 5
- **page_type**: card_input + ai_prompt_copy_block + structured_selector
- **primary_goal**: 引導使用者填 `contradiction.triz_id`（單選 1 種，禁止複選）+ `side_a` + `side_b` + `sacrificed`，透過 AI 提案選擇最符合的矛盾
- **secondary_goal**: 訓練「真痛點背後通常是兩件事不能同時要」的拆解思維
- **prerequisite_cards**: [1, 2, 3, 4]
- **expected_time_on_page**: 8-15 分鐘

---

### [STRUCTURE: SECTIONS]

1. **stepper_header** — 卡 1-4 ✓ / 卡 5 高亮 + AI badge「✅ TRIZ 提案」
2. **card_intro** — 「真痛點 = 兩件事不能同時要」+ 6 種矛盾預覽（純資訊不可選）
3. **ai_prompt_block**（Step 1）— AI 從 6 種挑 1 個
4. **ai_response_input**（Step 2）— 貼回 AI 推薦的矛盾編號 + 解釋（暫存 UI）
5. **triz_selector**（Step 3）— 確認選擇（單選 radio）+ 填 side_a/b/sacrificed
6. **example_reference** — 林老師範例
7. **exit_gate_footer** — 過關條件 + retreat_action_card（6 個都不像時）

---

### [SECTION COMPONENT SPEC]

#### Section 1: stepper_header

- 與卡 1-4 一致
- `ai_indicator` (Badge, Verified Green border): "AI 介入：✅ TRIZ 提案"

#### Section 2: card_intro

- `card_number`: "卡 5 / 9"
- `card_title` (H1): "找出「兩件事不能同時要」"
- `rule_callout` (AlertBox, Primary Light, icon=GitMerge)：「**為什麼這張卡關鍵：** 很多痛點背後其實是「他想要兩件事，但只能選一個」。看清這個矛盾，後面才知道訪談要怎麼問、產品要怎麼切。」
- `six_contradictions_preview` (純資訊列表，**不可點選**；選擇放在 triz_selector)：
  1. 想快但又想做得好
  2. 想客製化但又想規模化
  3. 想快但又想正確
  4. 想很專業但又想新手好上手
  5. 想自動化但又怕失控
  6. 想多嘗試但又怕出包
- `reference_link` (Link): "查看 6 種矛盾的詳細說明" → `references/triz_contradictions.md`

#### Section 3: ai_prompt_block（Step 1）

- `step_label` (H2): "Step 1：請 AI 從 6 種挑 1 個最像的"
- `tool_picker` (AIToolPicker, optional)：4 chips
- `prompt_block` (AIPromptCopyBlock, monospace)：
  - prompt_template（**逐字引用 worksheet，禁止改寫**）：
  
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
  - 變數插值：
    - `{stuck_formula}` ← `stuck_formula.ai_polished || user_draft`
    - `{workaround}` ← `${workaround.tool_name} — ${workaround.why_still_stuck}（不滿：${workaround.user_dissatisfactions.join("、")}）`
- `copy_button` (Button Primary): "複製 prompt"
- `external_link` (Button Secondary, optional): "在新分頁開啟 ChatGPT"

#### Section 4: ai_response_input（Step 2）

- `step_label` (H2): "Step 2：AI 推薦的是哪個？（記下來）"
- `field_ai_recommendation` (TextField, optional, **僅 UI 暫存**)：
  - label (H3): "AI 推薦的矛盾類型"
  - helper: "把 AI 推薦的選項編號（1-6）填這裡。如果 AI 回「不像，請退回卡片 3」，點下方退回 link"
  - placeholder: "2"
- `field_ai_explanation` (Textarea, rows=3, optional, **僅 UI 暫存，用於 selector 預填**)：
  - label (H3): "AI 用主人翁的話說明的版本"
- `retreat_link` (Link, conditional): "AI 說 6 個都不像 → 退回卡 3" → `/learn/worksheet/03?id={uuid}`（顯示確認 modal）

#### Section 5: triz_selector（Step 3）

- `step_label` (H2): "Step 3：確認選擇 + 填 A/B 兩端"
- `selector_warning` (AlertBox, Caution Amber, icon=AlertTriangle, **必填顯眼**)：
  - 「**單選**（不可複選）— 複選代表你還沒拆乾淨，會被擋過關。如果你覺得超過一個，退回卡 3 再聊。」
- `triz_radio_selector` (RadioGroup, **single select, 順序固定 1-6, 禁止 carousel/shuffle/flip 動畫**)：
  - 6 個 radio button，**垂直排列**（Desktop / Mobile 都垂直）
  - data_field: `contradiction.triz_id` (1-6) + `contradiction.triz_label` (auto-fill)
  - options（依 `data_model.md` § TrizLabel）：

| triz_id | triz_label | EN |
| :-- | :--- | :--- |
| 1 | 想快但又想做得好 | Speed vs Quality |
| 2 | 想客製化但又想規模化 | Personalization vs Scale |
| 3 | 想快但又想正確 | Speed vs Accuracy |
| 4 | 想很專業但又想新手好上手 | Expert vs Novice |
| 5 | 想自動化但又怕失控 | Automation vs Control |
| 6 | 想多嘗試但又怕出包 | Experimentation vs Risk |

  - hint_per_option: 每個選項下方顯示「典型範例」（來自 `references/triz_contradictions.md`）

- `field_side_a` (Textarea, rows=2, **enabled 才能填**)：
  - label (H3): "A 端（他想要這個）"
  - helper: "選了矛盾後，A 端是什麼？用主人翁的話寫具體"
  - placeholder: "家長要看見「我的孩子」被個別關照（具體事件、語氣有溫度）"
  - data_field: `contradiction.side_a`
  - validation: minLength 10
- `field_side_b` (Textarea, rows=2)：
  - label (H3): "B 端（他也想要這個）"
  - helper: "B 端是什麼？跟 A 端對立的另一邊"
  - placeholder: "老師一週只有 2-3 小時可寫 30 則（每則 < 6 分鐘）"
  - data_field: `contradiction.side_b`
  - validation: minLength 10
- `field_sacrificed` (RadioGroup, single select)：
  - label (H3): "如果只能選一邊，他通常會犧牲哪邊？"
  - options:
    - 「犧牲 A 端」/ value: `'a'`
    - 「犧牲 B 端」/ value: `'b'`
  - data_field: `contradiction.sacrificed`

#### Section 6: example_reference（可摺疊）

- 內容（直接引用 worksheet 卡 5）：
  - **AI 挑的：第 2 種（想客製化但又想規模化）**
  - A 端（個人化）：家長要看見「我的孩子」被個別關照（具體事件、語氣有溫度）
  - B 端（規模化）：老師一週只有 2-3 小時可寫 30 則（每則 < 6 分鐘）
  - 通常會犧牲：A 端（罐頭訊息、家長一看就知道沒在用心）

#### Section 7: exit_gate_footer

- `exit_conditions` (ExitGateChecklist)：
  - "[ ] 只選 1 個（複選代表你還沒拆乾淨，退回卡片 3）"
  - "[ ] A、B 兩端都具體（不是抽象詞）"
- `primary_cta` (Button Primary): "儲存並進入卡 6 →"
- `secondary_cta` (Button Ghost): "回到卡 4"
- `blocked_message` (AlertBox, Caution Amber, conditional)
- `retreat_action_card` (Card, conditional, AI 回「都不像」或使用者不知如何選)：
  - title (H3): "6 個都不像？拆得不夠細"
  - body：**引用 worksheet**「過不了 → 退回卡片 3，拆得不夠細。」
  - cta (Button Ghost): "退回卡 3 重新拆" → `/learn/worksheet/03?id={uuid}`

---

### [INTERACTION & STATE FLOW]

#### 主要互動流程

1. 頁面載入 → 從 LocalStorage 讀 `stuck_formula` + `workaround` → 預填 prompt 變數
2. Step 1：使用者點「複製 prompt」→ 跳到外部 AI
3. Step 2：使用者貼回 AI 推薦的矛盾編號 + 解釋（暫存 UI state）
4. Step 3：使用者在 triz_radio_selector 確認選擇（單選） → triz_label 自動填入 → 填 side_a / side_b / sacrificed
5. 點擊 `primary_cta`：
   - **a**: 檢查 triz_id 已選（1-6）
   - **b**: 檢查 side_a / side_b minLength 10
   - **c**: 檢查 sacrificed 已選 a or b
   - **d**: 全通過 → PATCH `current_step = 6` → 導向卡 6

#### Triz 選擇器互動細節（**反 #7 鐵律**）

- **單選互動**：`<input type="radio">` 標準語意（不是自訂 chip 多選）
- **無動畫切換**：選擇 radio **不觸發旋轉、卡片翻轉、隨機洗牌動畫**
- **順序固定**：6 種矛盾按 1-6 編號顯示，**絕對不可隨機排序**
- **未選擇時的下游欄位**：side_a / side_b / sacrificed 為 disabled 灰色，視覺提示「先選矛盾」

#### Prompt 插值邏輯

```typescript
const stuck = painCard.stuck_formula.ai_polished || painCard.stuck_formula.user_draft;
const workaroundStr = `${painCard.workaround.tool_name} — ${painCard.workaround.why_still_stuck}（不滿：${painCard.workaround.user_dissatisfactions.join("、")}）`;
```

#### RWD

| 斷點 | 佈局 |
| :--- | :--- |
| Desktop | 全寬單欄，6 個 radio 垂直，side_a/b 並排 2 欄 |
| Tablet | 同 Desktop，side_a/b 維持並排 |
| Mobile | 全部單欄，side_a/b 垂直堆疊 |

---

### [DATA & API]

- **endpoints**: `GET / PATCH /api/paincards/{id}`
- **localStorage 寫入**：
  - `painmap_worksheet:cards.{id}.contradiction.triz_id` (1-6)
  - `painmap_worksheet:cards.{id}.contradiction.triz_label` (auto-fill)
  - `painmap_worksheet:cards.{id}.contradiction.side_a`
  - `painmap_worksheet:cards.{id}.contradiction.side_b`
  - `painmap_worksheet:cards.{id}.contradiction.sacrificed` ('a' | 'b')
  - `painmap_worksheet:cards.{id}.current_step` → 6（過關後）
- **schema**：
  ```typescript
  type Contradiction = {
    triz_id: 1 | 2 | 3 | 4 | 5 | 6;        // single select
    triz_label: string;                     // 對應 TrizLabel enum
    side_a: string;                         // minLength 10
    side_b: string;                         // minLength 10
    sacrificed: 'a' | 'b';
  };
  ```
- **error_cases**: 同前

---

### [EXIT GATE]

#### 過關條件

| # | 條件 | 判定 |
| :- | :--- | :--- |
| 1 | 只選 1 個 | `triz_id` 為 1-6 之一（單值，UI 強制 single select） |
| 2 | A、B 兩端都具體 | `side_a.length >= 10` 且 `side_b.length >= 10` |
| 3 | sacrificed 已選 | `sacrificed === 'a' \|\| 'b'` |

#### 失敗路由

| 失敗 | 文案 |
| :--- | :--- |
| `triz_id` 未選 | 「請選 1 種矛盾。如果 6 個都不像，點「退回卡 3 重新拆」。」 |
| AI 回「6 個都不像，請退回卡 3」 | retreat_action_card：「**拆得不夠細。** 退回卡 3 再聊一次主人翁，把卡關句寫得更具體。」 |
| `side_a` 或 `side_b` 太短 | 「兩端要具體（不是「想要好」「想要快」這種抽象詞）。看 worksheet 林老師範例如何具體描述。」 |
| `sacrificed` 未選 | 「請選通常會犧牲哪邊。」 |

#### 退回工作流

> 卡 5 過不了 → 退回**卡 3**（拆得不夠細）
> retreat_action_card 「退回卡 3 重新拆」→ 保留卡 3-5 資料，提示「修改卡 3 後請回來重新跑卡 5 的 AI prompt」

---

### [AI INTEGRATION]

- **AI 介入狀態**：✅ **啟用 — TRIZ 提案**
- **AI 角色**：
  - ✅ 從固定的 6 種矛盾中挑 1 個最像的
  - ✅ 用主人翁的話說明 A、B 兩端具體是什麼
  - ✅ 如果 6 個都不像，AI 可建議「退回卡 3」
  - ❌ 替使用者最終確認（使用者要在 triz_selector 確認選擇）
  - ❌ 提案 6 種以外的新矛盾類型
- **內建 prompt**：直接從 worksheet 卡 5「🤖 AI 幫你提案」段落萃取，**逐字引用，禁止改寫**
- **變數插值**：`{stuck_formula}` + `{workaround}`
- **MVP 模式**：使用者複製到外部 AI 跑 → 貼回 ai_recommendation + ai_explanation（暫存 UI）→ 在 triz_selector 確認
- **Fallback**：使用者沒有 AI 工具 → 可直接在 triz_selector 自選（小字 link「跳過 AI 提案，我自己選」），但仍須滿足過關條件

#### Anti-solution mode guard

prompt 不直接含「不要建議方案」字眼，但限定 AI 只能在 6 種固定範圍內挑選，自然防止解決方案推銷。

---

### [OCTALYSIS HOOKS]

#### 主驅動力：#3 Empowerment of Creativity & Feedback

- 6 種矛盾的選擇是**思辨選擇** — 使用者要主動判斷
- AI 提案後使用者**仍要在 triz_selector 主動確認**
- 「6 個都不像 → 退回卡 3」是高度賦權

#### 副驅動力：#1 Epic Meaning

- card_intro 引用 worksheet 進階詞彙「TRIZ 矛盾識別」
- 「拆出真正的矛盾」是判斷力訓練的核心高光時刻

#### 副驅動力：#2 Development & Accomplishment

- 完成卡 5 = 真正進入「結構化思考」（過了一半）

#### 反模式警告（**這張卡反模式警示級別最高**）

| 禁用 | 為何 |
| :--- | :--- |
| ❌ **「抽卡」式 UI**（隨機顯示、shuffle 動畫、卡片翻轉） | 違反 #7 Unpredictability — TRIZ 是結構化框架，不是運氣 |
| ❌ **隨機排序 6 種選項** | 違反「結構優於裝飾」brand 原則 |
| ❌ **AI 自動寫入 triz_id** | 違反「思辨選擇」核心訓練 |
| ❌ **複選機制** | 違反 worksheet 鐵律「只選 1 個」 |
| ❌ **AI 解鎖動畫**（「叮咚！AI 為你選好了！」） | 過度遊戲化 |
| ❌ **「神秘第 7 種」彩蛋** | 違反「6 種固定範圍」鐵律 |
| ❌ **「你的選擇與 X% 使用者相同」** | 違反 anti-comparison |
| ❌ **倒數計時器** | 違反 anti-anxiety |

#### #3 Empowerment vs #7 Unpredictability 紅線

| 白帽 #3 | 黑帽 #7 |
| :--- | :--- |
| ✅ 主動選從固定 6 種挑 1 個 | ❌ 隨機顯示讓使用者「期待下一個更好」 |
| ✅ 順序、選項、含義皆透明 | ❌ Shuffle / 抽卡 / 翻牌動畫 |
| ✅ AI 提案有清楚 prompt 邏輯 | ❌ 黑盒「AI 神秘推薦」 |
| ✅ 結果可被質疑（「都不像」） | ❌ 結果是「命運」不可挑戰 |

---

## === EXCEPTION RULES ===

本頁面**無特殊例外**，但有兩個鐵律加強條款：

1. **6 種矛盾順序固定為 1-6，絕對不可隨機**（schema 強制 + UI 強制）
2. **triz_radio_selector 不使用任何 carousel / shuffle / flip / spin 動畫**（即使是「酷炫」的微互動也禁止）

---

## === OUTPUT REQUIREMENTS ===

### Step 1：結構確認

- 7 個 sections + 用途
- PainCard schema 對應：`contradiction.{triz_id, triz_label, side_a, side_b, sacrificed}`
- 資料流：URL `?id` → 讀 `stuck_formula` + `workaround` → 3 個 step → debounce 寫回 → exit gate → PATCH
- exit gate pseudocode

### Step 2：設計決策說明

說明 3 個關鍵設計決策：
1. **為什麼 6 種矛盾必須單選 + 順序固定？** — TRIZ 是結構化框架，不是運氣；複選代表還沒拆乾淨；隨機順序會偷渡 #7 Unpredictability 黑帽
2. **如何確保 triz_radio_selector 沒有偷渡「抽卡感」？** — 用 HTML standard `<input type="radio">`、垂直排列、無動畫；測試清單明確列出禁止 carousel/shuffle/flip/spin
3. **AI 提案 vs 使用者確認的雙層設計** — AI 在外部跑只提供建議；使用者在 triz_selector 主動確認；「6 個都不像」是高賦權出口

### Step 3：實作方案（Option A）

- `Card5ContradictionPage.tsx`
- `StepperHeader` / `CardIntro` / `SixContradictionsPreview` / `AiPromptBlock` / `AiResponseInput` / `TrizSelector` / `ExampleReference` / `ExitGateFooter` / `RetreatActionCard`
- Zod schema for contradiction
- TrizLabel constants（從 `data_model.md` § TrizLabel 對應）
- RWD Tailwind

### 品質檢查清單（部署前必過）

#### 通用
- [ ] 7 個 Section 依序渲染
- [ ] 從 LocalStorage 正確讀取 `stuck_formula` + `workaround`
- [ ] ai_prompt_block 正確插值 `{stuck_formula}` + `{workaround}`
- [ ] **prompt 內容與 worksheet 卡 5 原文 100% 一致**
- [ ] copy_button 正確複製到剪貼簿
- [ ] triz_radio_selector 為**單選**（HTML radio group），UI 強制 single select
- [ ] **triz_radio_selector 6 個選項順序固定為 1-6，不隨機**
- [ ] **triz_radio_selector 不使用 carousel / shuffle / flip / spin 動畫**
- [ ] triz_id 對應 triz_label 自動填入
- [ ] field_side_a + field_side_b 在 triz_id 未選時為 disabled
- [ ] field_side_a / side_b minLength 10 才能過關
- [ ] field_sacrificed 為單選 radio（'a' / 'b'）
- [ ] retreat_action_card「退回卡 3 重新拆」link 正確導向（保留卡 3-5 資料）
- [ ] CTA 過關後 PATCH `current_step = 6`
- [ ] selector_warning 醒目顯示「單選」
- [ ] AI 介入 badge「✅ TRIZ 提案」
- [ ] 鍵盤 Tab 順序：stepper → tool_picker → copy_button → external_link → ai_recommendation → ai_explanation → 6 個 radio → side_a → side_b → sacrificed radio → CTA
- [ ] 螢幕閱讀器讀出 6 個 radio 為單選 group（aria-radiogroup）
- [ ] RWD 三斷點正確

#### Octalysis 黑帽掃描（生成程式碼後**必跑**，**卡 5 重點**）
- [ ] 是否出現分數 UI？→ 砍掉
- [ ] 是否有 streak / 連續打卡？→ 砍掉
- [ ] **是否有 loot box / 抽卡 / 神秘獎勵 / shuffle / flip / spin / carousel？→ 砍掉**
- [ ] 是否有 FOMO 文案？→ 砍掉
- [ ] 是否有過期警告？→ 砍掉
- [ ] 是否有排行榜 / 「你的選擇與 X% 使用者相同」？→ 砍掉
- [ ] 是否有「神秘第 7 種」「複合矛盾」「百搭組合」？→ 砍掉

#### 禁用詞掃描
- [ ] 全頁面零出現「抽 1 個 / 抽到 / 神秘 / 神奇 / AI 神秘推薦 / AI 智慧匹配 / 解鎖第 7 種 / 你的命運矛盾 / 百搭組合 / 複合矛盾」

---

**版本資訊**：Worksheet v1.0 ｜ Brand v1.0 ｜ 2026-05-02
