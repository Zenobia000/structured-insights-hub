# PainMap Worksheet — Card 5 (兩件事不能同時要) Integrated Prompt

> 自我包含整合 prompt — 直接貼入 Lovable / Claude Code 即可生成卡 5 完整實作。
> 對應 page spec：`docs/painmap_worksheet/design/pages/05_card_contradiction.md`
> 對應資料模型：`docs/painmap_worksheet/product/data_model.md` § Card 5
>
> **核心設計**：蘇格拉底式取捨自陳。使用者用自己的話寫 side_a / side_b、選犧牲哪邊、寫**為什麼那邊會被犧牲**（`sacrificed_reason`）。AI 協助使用者把腦中的話寫清楚，**不**給編號、**不**給分類學標籤。

---

## === GLOBAL PROJECT GUIDELINE (DO NOT OVERRIDE) ===

你是「PainMap 題眼 — Worksheet」的資深產品設計師與前端工程師。

### 品牌特質

**結構化** ｜ **賦權感** ｜ **沉穩** ｜ **蘇格拉底式**

### Color Tokens

| Token | 色值 | 用途 |
| :--- | :--- | :--- |
| Primary #1E3A5F / Primary Light #E8EEF5 / Secondary #2D7D8A / Accent CTA #E8913A / Verified #2D9D78 / Caution #D97706 / BG Page #F7F8FA / BG Muted #F1F3F5 / Text Primary #1A2332 / Text Secondary #5C6B7A / Border Default #DFE3E8 / Border Focus #2D7D8A |

### Typography

H1 28px / H2 22px / H3 18px / Body LG 17px / Body MD 15px / Body SM 13px / Caption 12px

字體：`Noto Sans TC` + `Inter` + `JetBrains Mono`（prompt block）

### 元件風格

- Radius MD 8px / LG 12px
- Border `1px solid #DFE3E8` / focus 2px Teal
- Shadow SM / MD

### 技術棧

React 18 + TypeScript + Tailwind + Zustand + React Hook Form + Zod。LocalStorage key：`painmap-worksheet-v2`、`user_pref.ai_tool`。

### 絕對禁令（PainMap Brand）

- 禁止：分數、星等、A-F 等級、成功率、排行榜、徽章、倒數計時
- **禁止：分類學標籤（編號、等級、分類學名詞）**
- 禁用詞：「神秘」「神奇」「闖關」「升級」「streak」
- 禁止 Inline styles / `console.log`
- WCAG AA / 語意化 HTML / focus ring Teal

### 絕對禁令（Octalysis 黑帽）

- 禁止 #6 Scarcity：時間壓力
- 禁止 #7 Unpredictability：carousel / shuffle / flip / spin / 抽卡式 UI
- 禁止 #8 Loss Avoidance：streak / 過期 / 「沒選會消失」

### 蘇格拉底式特殊鐵律

1. **反 solution mode**：本卡 prompt 含「不要建議解決方案」guard
2. **反分類學**：AI prompt 明確要求「不要給編號 / 不要給分類學標籤」
3. **書面優先**：A、B 兩端必須具體（不是抽象詞）；sacrificed_reason 必須 ≥ 1 句完整描述
4. **反思問題透明**：UI 顯示反思問題（不是「過關條件」）
5. **回頭重想中性**：AI 認為卡關句沒拆乾淨時，中性建議「回去把卡 3 想清楚再來」（不寫「退回卡 3」）

---

## === CURRENT TASK: BUILD CARD 5 — 兩件事不能同時要 ===

### [PAGE META]

- **page_name**: Card 5 - Contradiction Articulation
- **route_path**: `/learn/worksheet/05?id={paincard_uuid}`
- **card_step**: 5
- **page_type**: card_input + ai_prompt_copy_block + tradeoff_articulation
- **primary_goal**: 引導使用者用自己的話寫出 `contradiction.side_a` + `side_b` + `sacrificed` + `sacrificed_reason`，透過 AI 協助釐清取捨；**不**做任何分類學選擇
- **secondary_goal**: 訓練「真痛點 = 兩件事不能同時要 + 為什麼那邊會被犧牲」的拆解思維
- **prerequisite_cards**: [1, 2, 3, 4]
- **expected_time_on_page**: 8-15 分鐘

---

### [STRUCTURE: SECTIONS]

1. **stepper_header** — 卡 1-4 ✓ / 卡 5 高亮 + AI badge「協助釐清取捨」
2. **card_intro** — 「真痛點 = 兩件事不能同時要」+ 蘇格拉底引導句
3. **ai_prompt_block**（Step 1）— AI 協助使用者用自己的話寫兩端 + 為什麼犧牲
4. **ai_response_input**（Step 2）— 貼回 AI 回應（暫存 UI，用於下一步預填）
5. **tradeoff_form**（Step 3）— 4 個欄位：side_a / side_b / sacrificed / sacrificed_reason
6. **example_reference** — 林老師範例（A/B 兩端 + 被犧牲端 + 為什麼會被犧牲，純自由書寫）
7. **reflection_footer** — 反思問題 + 中性「回去把卡 3 想清楚再來」link

> 此卡片**不**列出固定矛盾類型清單，**不**從固定選項清單挑選；使用者用自己的話寫 A/B 兩端與被犧牲的原因。

---

### [SECTION COMPONENT SPEC]

#### Section 1: stepper_header

- 與卡 1-4 一致
- `ai_indicator` (Badge, Verified Green border): "AI 介入：協助你用自己的話寫"

#### Section 2: card_intro

- `card_number`: "卡 5 / 9"
- `card_title` (H1): "兩件事不能同時要"
- `socratic_callout` (AlertBox, Primary Light, icon=GitMerge)：
  - 「**他想要 ___，但又同時想要 ___。如果他能放掉其中一邊，他不會卡在這裡——所以他放不下哪邊？為什麼那邊會被犧牲？**」
- `intro_body` (Body MD): 「真痛點背後通常是『他想要兩件事，但只能選一個』。看清這個取捨，後面才知道訪談要怎麼問、答案會在哪裡浮出來。」

#### Section 3: ai_prompt_block（Step 1）

- `step_label` (H2): "Step 1：請 AI 協助你釐清取捨"
- `tool_picker` (AIToolPicker, optional)：4 chips
- `prompt_block` (AIPromptCopyBlock, monospace)：
  - prompt_template（**逐字引用 ai_prompt_library.md §3**）：

  ```
  有一個人遇到這個卡關：
  {stuck_formula}

  他現在用：
  {workaround}

  我想用「他想要 ___，但又同時想要 ___」這個結構，看清他到底卡在哪。

  請協助我：
  1. 用主人翁自己的話寫出他想要的 A 端（具體事件、語氣、量化都好）
  2. 用主人翁自己的話寫出他想要的 B 端（跟 A 端對立的另一邊）
  3. 在 A、B 之間，他通常會犧牲哪一邊？為什麼那邊會被犧牲？

  規則：
  1. 不要給編號、不要給分類學標籤、不要說「這屬於哪一種矛盾」
  2. 不要建議解決方案、不要推薦工具
  3. 不要替我下判斷說「他應該犧牲 X」——只描述他現況通常會犧牲哪邊、原因是什麼
  4. 用主人翁的話寫，不要用抽象詞（避免「品質好」「速度快」這種空話）
  5. 如果你覺得這個卡關句還拆不出兩邊，直接說「卡關句還沒拆清楚，建議回去把卡 3 想得更具體」
  ```

  - 變數插值：
    - `{stuck_formula}` ← `stuck_formula.ai_polished || user_draft`
    - `{workaround}` ← `${workaround.tool_name} — ${workaround.why_still_stuck}（不滿：${workaround.user_dissatisfactions.join("、")}）`
- `copy_button` (Button Primary): "複製 prompt"
- `external_link` (Button Secondary, optional): "在新分頁開啟 ChatGPT"

#### Section 4: ai_response_input（Step 2）

- `step_label` (H2): "Step 2：貼回 AI 的回應（會自動帶入下方欄位）"
- `field_ai_raw_response` (Textarea, rows=8, optional, **僅 UI 暫存**)：
  - label (H3): "AI 回應原文"
  - helper: "貼回 AI 的回應後，下方 4 個欄位會嘗試自動帶入。你可以直接編輯。"
- `parse_button` (Button Secondary): "解析並填入下方欄位"
  - 解析規則：用 regex 偵測「A 端」「B 端」「通常會犧牲」「為什麼會被犧牲」段落，分別填入下方欄位
  - 同時跑 anti-taxonomy 檢查（CARD_5_ANTI_TAXONOMY_PATTERNS，見 `ai_proxy_spec.md §2.3`），若偵測到任何編號 / 分類學標籤 → 顯示提示「AI 偷渡了分類學標籤，請複製這段補強 prompt 重跑」
- 兩端拆不出來時的中性出口：在 reflection_footer 提供「回去把卡 3 想清楚再來」link（不擋前進）

#### Section 5: tradeoff_form（Step 3）

- `step_label` (H2): "Step 3：4 個欄位（用主人翁的話寫）"

##### `field_side_a` (Textarea, rows=2)

- label (H3): "A 端（他想要這個）"
- helper: "用主人翁自己的話寫具體事件 / 語氣 / 量化"
- placeholder: "家長要看見「我的孩子」被個別關照（具體事件、語氣有溫度）"
- data_field: `contradiction.side_a`
- validation: minLength 10

##### `field_side_b` (Textarea, rows=2)

- label (H3): "B 端（他也想要這個）"
- helper: "跟 A 端對立的另一邊"
- placeholder: "老師一週只有 2-3 小時可寫 30 則（每則 < 6 分鐘）"
- data_field: `contradiction.side_b`
- validation: minLength 10

##### `field_sacrificed` (RadioGroup, single select)

- label (H3): "如果只能選一邊，他通常會犧牲哪邊？"
- options:
  - 「犧牲 A 端」/ value: `'a'`
  - 「犧牲 B 端」/ value: `'b'`
- data_field: `contradiction.sacrificed`

##### `field_sacrificed_reason` (Textarea, rows=4)

- label (H3): "為什麼那邊會被犧牲？"
- helper: "用 1-2 句話說明：為什麼在他現況裡，那邊會被犧牲？（時間壓力？利益順序？心理門檻？）"
- placeholder: "因為時間是硬上限（家長期待週日早上前要收到），具體性可以靠模板偷工。一旦時間壓力出現，老師會選擇『先有訊息發出去』勝過『訊息有溫度』。"
- data_field: `contradiction.sacrificed_reason`
- validation: minLength 15（建議 ≥ 1 句完整描述）

#### Section 6: example_reference（可摺疊）

- 內容：
  - **A 端（家長端）**：家長要看見「我的孩子」被個別關照（具體事件、語氣有溫度）
  - **B 端（時間端）**：老師一週只有 2-3 小時可寫 30 則（每則 < 6 分鐘）
  - **通常會犧牲**：A 端
  - **為什麼會被犧牲**：因為時間是硬上限（家長期待週日早上前要收到），具體性可以靠模板偷工。一旦時間壓力出現，老師會選擇「先有訊息發出去」勝過「訊息有溫度」。家長會察覺，但抱怨後老師仍會在下次重複同樣選擇——時間是不可協商的，溫度是可協商的。

#### Section 7: reflection_footer

- `reflection_hints` (`<ReflectionHint>` 元件)：
  - "想想看：A、B 兩端都用主人翁的話寫了嗎？（不是「想要好」「想要快」這種空話）"
  - "想想看：『為什麼那邊會被犧牲』寫得夠清楚嗎？（時間？利益？心理？）"
- `primary_cta` (Button Primary): "繼續到卡 6 →"
  - enable 條件：side_a ≥ 10 字 AND side_b ≥ 10 字 AND sacrificed ∈ {'a', 'b'} AND sacrificed_reason ≥ 15 字
- `secondary_cta` (Button Ghost): "回到卡 4"
- `back_to_card_3_link` (TextLink, optional, 中性語氣): "兩端拆不出來？回去把卡 3 想清楚再來" → `/learn/worksheet/03?id={uuid}`（保留卡 3-5 資料）

---

### [INTERACTION & STATE FLOW]

#### 主要互動流程

1. 頁面載入 → 從 LocalStorage `painmap-worksheet-v2` 讀 `stuck_formula` + `workaround` → 預填 prompt 變數
2. Step 1：使用者點「複製 prompt」→ 跳到外部 AI
3. Step 2：使用者貼回 AI 回應 → 點「解析」→ 自動帶入 side_a / side_b / sacrificed / sacrificed_reason；同時跑 anti-taxonomy 檢查
4. Step 3：使用者編輯 / 確認 4 個欄位
5. 點擊 `primary_cta`：
   - **a**: 檢查 side_a / side_b minLength 10
   - **b**: 檢查 sacrificed ∈ {'a', 'b'}
   - **c**: 檢查 sacrificed_reason minLength 15
   - **d**: 全通過 → 寫入 PainCard.contradiction → `current_step = 6` → 導向卡 6

#### Anti-taxonomy 檢測流程

```ts
const CARD_5_ANTI_TAXONOMY_PATTERNS = [
  /(矛盾編號|這屬於第 ?\d+ ?種|矛盾類型 ?\d+)/i,
  /(挑 ?1 ?個|選 ?1 ?個)/,
];
```

若解析時偵測到任一 pattern → 顯示中性提示框：
> 「AI 偷渡了分類學標籤。我們不需要這些。請複製這段補強 prompt 重跑：『請刪除任何編號或分類學標籤，只用主人翁的話寫 A/B 兩端。』」

#### Prompt 插值邏輯

```typescript
const stuck = painCard.stuck_formula.ai_polished || painCard.stuck_formula.user_draft;
const workaroundStr = `${painCard.workaround.tool_name} — ${painCard.workaround.why_still_stuck}（不滿：${painCard.workaround.user_dissatisfactions.join("、")}）`;
```

#### RWD

| 斷點 | 佈局 |
| :--- | :--- |
| Desktop | 全寬單欄；side_a/b 並排 2 欄；sacrificed_reason 全寬 |
| Tablet | 同 Desktop |
| Mobile | 全部單欄垂直堆疊 |

---

### [DATA & API]

- **endpoints**: `GET / PATCH /api/paincards/{id}/cards/5`
- **localStorage 寫入**：
  - `painmap-worksheet-v2.{id}.contradiction.side_a`
  - `painmap-worksheet-v2.{id}.contradiction.side_b`
  - `painmap-worksheet-v2.{id}.contradiction.sacrificed` ('a' | 'b')
  - `painmap-worksheet-v2.{id}.contradiction.sacrificed_reason`
  - `painmap-worksheet-v2.{id}.current_step` → 6
- **schema**：
  ```typescript
  type Contradiction = {
    side_a: string;             // minLength 10
    side_b: string;             // minLength 10
    sacrificed: 'a' | 'b';
    sacrificed_reason: string;  // minLength 15
  };
  ```

---

### [REFLECTION HINTS]

#### 必填條件（CTA disable 直到齊備）

| # | 條件 | 判定 |
| :- | :--- | :--- |
| 1 | A 端具體 | `side_a.length >= 10` |
| 2 | B 端具體 | `side_b.length >= 10` |
| 3 | sacrificed 已選 | `sacrificed === 'a' \|\| 'b'` |
| 4 | sacrificed_reason 寫了原因 | `sacrificed_reason.length >= 15` |

#### 中性提示文案

| 情況 | 文案 |
| :--- | :--- |
| `side_a` 或 `side_b` 太短 | 「想想看：用主人翁的話寫，會更具體（不是「想要好」「想要快」這種抽象詞）」 |
| `sacrificed_reason` 太短 | 「想想看：為什麼那邊會被犧牲？（時間？利益？心理？用 1-2 句話寫清楚）」 |
| 兩端拆不出來 | 「兩件事拆不出來，通常代表卡關句還沒拆乾淨。回去把卡 3 想清楚再來。」（中性 link，不強制） |

---

### [AI INTEGRATION]

- **AI 介入狀態**：✅ **啟用 — 協助釐清取捨**
- **AI 角色**（蘇格拉底式）：
  - ✅ 用主人翁的話寫 A、B 兩端具體是什麼
  - ✅ 描述他現況通常會犧牲哪邊
  - ✅ 寫為什麼那邊會被犧牲
  - ❌ 給編號 / 分類學標籤
  - ❌ 替使用者下規範性判斷（「他應該犧牲 X」）
  - ❌ 推薦解法
- **內建 prompt**：直接從 `ai_prompt_library.md` §3 引用，**逐字引用，禁止改寫**
- **變數插值**：`{stuck_formula}` + `{workaround}`
- **MVP 模式**：使用者複製到外部 AI 跑 → 貼回 ai_raw_response → 點「解析」→ 自動帶入 4 欄位
- **Fallback**：使用者沒有 AI 工具 → 可直接在 tradeoff_form 自填，仍須滿足必填條件

#### Anti-solution mode + Anti-taxonomy guard

prompt 內建兩種 guard：
1. 規則 1「不要給編號、不要給分類學標籤」
2. 規則 2「不要建議解決方案、不要推薦工具」
3. 規則 3「不要替我下判斷說『他應該犧牲 X』」

---

### [OCTALYSIS HOOKS]

#### 主驅動力：#3 Empowerment of Creativity & Feedback

- 使用者用自己的話寫 4 個欄位（最高賦權）
- AI 是放大鏡，不是裁判
- 「兩端拆不出來 → 回去把卡 3 想清楚再來」是高賦權自決

#### 副驅動力：#1 Epic Meaning

- card_intro 強調「看清取捨是判斷力訓練的核心」

#### 副驅動力：#2 Development & Accomplishment

- 寫完卡 5 = 真正進入「結構化思考」（過了一半）

#### 反模式警告

| 禁用 | 為何 |
| :--- | :--- |
| ❌ **固定矛盾類型 radio group** | 鐵律：worksheet 不貼分類學標籤 |
| ❌ **「請挑 1 個」「不可複選」「神秘第 N 種」** | 鐵律 |
| ❌ **「抽卡」式 UI**（隨機顯示、shuffle 動畫、卡片翻轉） | 違反 #7 Unpredictability |
| ❌ **AI 給規範性判斷「他應該犧牲 X」** | 違反「描述現況」蘇格拉底原則 |
| ❌ **AI 解鎖動畫**（「叮咚！AI 為你選好了！」） | 過度遊戲化 |

---

## === EXCEPTION RULES ===

本頁面**無特殊例外**。

---

## === OUTPUT REQUIREMENTS ===

### Step 1：結構確認

- 7 個 sections + 用途
- PainCard schema 對應：`contradiction.{side_a, side_b, sacrificed, sacrificed_reason}`
- 資料流：URL `?id` → 讀 `stuck_formula` + `workaround` → 3 個 step → debounce 寫回 → 必填條件檢查 → PATCH

### Step 2：設計決策說明

說明 3 個關鍵設計決策：
1. **不貼分類學標籤** — 分類學是借權威包裝，本質是通用 trade-off 識別。蘇格拉底式工具不貼分類，只問問題。使用者用自己的話寫，比挑編號更能訓練判斷力。
2. **sacrificed_reason 欄位的設計意義** — 「他想要 X 但又想要 Y」只是觀察；「為什麼 Y 會被犧牲」才是判斷。寫出原因 = 訓練「看到取捨背後的力量」。
3. **AI 角色定位為『協助釐清』** — AI 越主動，使用者越被動。AI 只協助使用者把腦中的話寫清楚，使用者保有判斷主權。

### Step 3：實作方案（Option A）

- `Card5ContradictionPage.tsx`
- `StepperHeader` / `CardIntro` / `AiPromptBlock` / `AiResponseInput` / `TradeoffForm` / `ExampleReference` / `ReflectionFooter`
- Zod schema for contradiction
- RWD Tailwind

### 品質檢查清單（部署前必過）

#### 通用
- [ ] 7 個 Section 依序渲染
- [ ] 從 LocalStorage `painmap-worksheet-v2` 正確讀取 `stuck_formula` + `workaround`
- [ ] ai_prompt_block 正確插值 `{stuck_formula}` + `{workaround}`
- [ ] **prompt 內容與 ai_prompt_library.md §3 100% 一致**
- [ ] copy_button 正確複製到剪貼簿
- [ ] field_side_a / field_side_b minLength 10 才能繼續
- [ ] field_sacrificed 為單選 radio（'a' / 'b'）
- [ ] field_sacrificed_reason minLength 15 才能繼續
- [ ] Anti-taxonomy 檢測：解析 AI 回應時跑 CARD_5_ANTI_TAXONOMY_PATTERNS
- [ ] 完成後 PATCH `current_step = 6`
- [ ] AI 介入 badge「協助你用自己的話寫」
- [ ] 鍵盤 Tab 順序：stepper → tool_picker → copy_button → external_link → ai_raw_response → parse_button → side_a → side_b → sacrificed radio → sacrificed_reason → CTA
- [ ] RWD 三斷點正確

#### 反模式掃描（生成程式碼後**必跑**）
- [ ] **是否出現固定矛盾類型 radio group？→ 砍掉**
- [ ] **是否出現「請挑 1 個」「不可複選」UI？→ 砍掉**
- [ ] **是否出現任何分類學標籤欄位？→ 砍掉**
- [ ] 是否有 loot box / 抽卡 / shuffle / flip / spin / carousel？→ 砍掉
- [ ] 是否有 FOMO 文案？→ 砍掉
- [ ] 是否有「失敗 / 過關 / 退回卡 3」字眼？→ 砍掉

#### 禁用詞掃描
- [ ] 全頁面零出現「請挑 1 個」「神秘」「抽 1 個」「過關條件」「退回卡 3」
