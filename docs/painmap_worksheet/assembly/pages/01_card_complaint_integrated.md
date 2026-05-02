# PainMap Worksheet — Card 1 (Complaint Verbatim) Integrated Prompt

> 自我包含整合 prompt — 直接貼入 Lovable / Claude Code 即可生成卡 1 完整實作。
> 對應 page spec 真相源：`docs/painmap_worksheet/design/pages/01_card_complaint.md`
> 對應資料模型：`docs/painmap_worksheet/product/data_model.md` § Card 1
> 組裝日期：2026-05-01 ｜ Worksheet v1.0

---

## === GLOBAL PROJECT GUIDELINE (DO NOT OVERRIDE) ===

你是「PainMap 題眼 — Worksheet 教學模式」的資深產品設計師與前端工程師。

### 品牌特質

**結構化 (Structured)** ｜ **賦權感 (Empowering)** ｜ **沉穩 (Calm)** ｜ **教學優先 (Teaching-first)**

### Color Tokens（卡 1 用到的子集）

| Token | 色值 | Tailwind | 用途 |
| :--- | :--- | :--- | :--- |
| Primary | #1E3A5F | `bg-[#1E3A5F]` | 結構與深度 |
| Primary Light | #E8EEF5 | `bg-[#E8EEF5]` | rule_callout 背景 |
| Secondary | #2D7D8A | `bg-[#2D7D8A]` | stepper 高亮、focus ring |
| Accent (CTA) | #E8913A | `bg-[#E8913A]` | 過關 primary CTA |
| Verified | #2D9D78 | `bg-[#2D9D78]` | anti-fake check pass、stepper 已完成 |
| Caution | #D97706 | `bg-[#D97706]` | anti-fake warning（**不用紅色**） |
| Error | #DC2626 | `bg-[#DC2626]` | 僅限系統驗證錯誤（minLength） |
| BG Page | #F7F8FA | `bg-[#F7F8FA]` |
| Text Primary | #1A2332 | `text-[#1A2332]` |
| Text Secondary | #5C6B7A | `text-[#5C6B7A]` |
| Border Default | #DFE3E8 | `border-[#DFE3E8]` |
| Border Focus | #2D7D8A | `focus:border-[#2D7D8A]` |

### Typography

| Token | 字級 | 行高 | 字重 |
| :--- | :--- | :--- | :--- |
| H1 | 28px | 1.3 | 700 |
| H2 | 22px | 1.3 | 600 |
| H3 | 18px | 1.4 | 600 |
| Body LG | 17px | 1.7 | 400 |
| Body MD | 15px | 1.6 | 400 |
| Body SM | 13px | 1.5 | 400 |
| Caption | 12px | 1.4 | 400 |

字體：`Noto Sans TC` + `Inter`。

### 元件風格

- Radius MD 8px（按鈕／輸入框）／ LG 12px（卡片）
- Shadow SM（預設）／ Shadow MD（hover）
- Border `1px solid #DFE3E8` 預設 ／ `2px solid #2D7D8A` focus

### 技術棧

React 18 + TypeScript + Tailwind CSS + Zustand + React Hook Form + Zod。LocalStorage key：`painmap_worksheet:cards`。

### 絕對禁令（PainMap Brand）

- 禁止：分數、星等、A-F 等級、成功率預測、排行榜、徽章、倒數計時、過期警告
- 禁用詞：「點子 / idea / 評分 / 打分 / 成功率 / 分數 / 等級 / 快速 / 一鍵 / 秒填 / 闖關 / 升級 / streak」
- 禁止 Inline styles；禁止 `console.log` 殘留；禁止任何 emoji 在按鈕文字中（icon 用 SVG）
- WCAG AA 對比度 ≥ 4.5:1；語意化 HTML；focus ring Teal #2D7D8A

### 絕對禁令（Octalysis 黑帽）

- 禁止 #6 Scarcity & Impatience：不可有「卡 1 限時 10 分鐘」
- 禁止 #7 Unpredictability：不可有「AI 自動生成範例填入」「秒填」按鈕
- 禁止 #8 Loss Avoidance：不可有 streak（連續填卡 N 天）、過期警告

### 教學模式特殊鐵律

1. **反 solution mode**：本卡無 AI 介入，但若日後接 AI 必須注入 guard prompt「不可建議解決方案、不可推薦工具、只做痛點探索」
2. **書面優先**：使用者必須產出可帶離的書面 PainCard，UI 美化不得削弱書面結構
3. **反思問題透明**：exit gate 規則須顯示給使用者看，不可隱藏
4. **失敗回退路徑**：失敗時引導回前面卡片補資訊，不用「失敗」「不及格」字眼

---

## === CURRENT TASK: BUILD CARD 1 — COMPLAINT VERBATIM ===

本次任務：根據上方 Global Guideline，設計並實作「Card 1 — 抱怨原句」。

### [PAGE META]

- **page_name**: Card 1 - Complaint Verbatim
- **route_path**: `/learn/worksheet/01?id={paincard_uuid}`
- **card_step**: 1
- **page_type**: card_input（form, no AI）
- **primary_goal**: 引導使用者填入 5 個欄位（`complaint.verbatim` / `source_name` / `source_relation` / `datetime` / `scene`），透過 anti-fake validators 確保品質
- **secondary_goal**: 體會「先聽再判斷」的紀律 — 不允許 AI 介入、不允許美化、不允許用「我覺得」
- **target_users**: 從 landing 進入的初學者，第一次使用 worksheet
- **expected_time_on_page**: 5-15 分鐘（首次）／ 3-8 分鐘（熟練後）
- **prerequisite_cards**: 無（卡 1 為起點）

---

### [STRUCTURE: SECTIONS]

1. **stepper_header** — 9 卡 stepper（卡 1 高亮）+ AI 介入 badge「❌ 禁用」
2. **card_intro** — 說明「規則：寫原句不要美化、不要解釋、不要分析」
3. **input_form** — 5 個必填欄位
4. **example_reference** — 林老師範例（可摺疊）
5. **anti_fake_check** — 即時 R2.1 / R2.2 validators 結果
6. **exit_gate_footer** — 反思問題 checklist + sticky 行動列

---

### [SECTION COMPONENT SPEC]

#### Section 1: stepper_header

- **layout**: 全寬 sticky top，水平 9 圓點 + label（Desktop）／ 水平捲動小圓點（Mobile）
- **elements**:
  - `back_link` (Link): "← 回到入口" → `/learn/worksheet`
  - `stepper` (CardProgressStepper, 9 個 step)：卡 1 高亮 Teal、其他 Border Default 灰
  - `paincard_meta` (Caption): "PainCard #{id_short} · 建立於 {created_at}"
  - `ai_indicator` (Badge with red border): "AI 介入：❌ 禁用"

#### Section 2: card_intro

- **elements**:
  - `card_number` (Eyebrow): "卡 1 / 9"
  - `card_title` (H1): "把抱怨寫下來"
  - `rule_callout` (AlertBox, Primary Light bg)：「**規則：** 寫你聽到的原句，不要美化、不要解釋、不要分析。」
  - `guidance` (Body MD)：「你應該有聽過某人說：「欸，要是有人做一個 ___ 就好了！」這張卡的任務不是分析這句話，是**忠實複述**它。」

#### Section 3: input_form

- **layout**: 單欄表單，5 個欄位垂直排列
- **欄位定義**（5 個必填）：

| 欄位 | 元件 | label | placeholder | data_field | 驗證 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1. 抱怨原句 | Textarea (rows=4, max=500) | "抱怨原句" | 「我每週六晚上要寫 30 個學生的家長 LINE，常寫到半夜兩點。」 | `complaint.verbatim` | minLength 10 + R2.1（不含分析詞） |
| 2. 是誰說的 | TextField | "是誰說的" | "林老師" | `complaint.source_name` | minLength 1 + R2.2（不為代稱） |
| 3. 你跟他的關係 | TextField | "你跟他的關係" | "我表妹的數學老師" | `complaint.source_relation` | minLength 1 |
| 4. 什麼時候說的 | TextField | "什麼時候說的" | "2026-04-15" | `complaint.datetime` | minLength 1 |
| 5. 當時他在做什麼 | TextField | "當時他在做什麼" | "我陪他從 21:00 跟到 02:30 親眼看他寫" | `complaint.scene` | minLength 1 |

每個欄位下方須有 helper text（≤ 35 字）。
verbatim 欄位含 inline anti-fake hint：偵測「我覺得 / 應該需要 / 可能 / 大概 / 或許 / 似乎」→ Caution amber 邊框 + warning「這像是你的解釋，不是原句」（**不擋輸入，過關時 exit gate 才擋**）。

- `autosave_indicator` (Caption): "已自動儲存到瀏覽器 · {timestamp_ago}"

**狀態**：default / filled / focus（Border Focus + Focus Ring）／ error（紅僅限 minLength 系統錯誤）／ warning（Caution amber 邊框，anti-fake）／ loading

#### Section 4: example_reference（可摺疊，預設摺疊）

- toggle_header："📖 看 worksheet 林老師範例"
- 內容（直接引用 worksheet 卡 1，不重寫）：
  - **抱怨原句：** 「我每週六晚上要寫 30 個學生的家長 LINE，平常週間都要記筆記但常漏，到週末翻 7 次小考成績單、翻群組對話、翻學生作業，常寫到半夜兩點。」
  - **是誰說的：** 林老師（新北永和補習班）
  - **什麼時候說的：** 2026-04-15
  - **當時他在做什麼：** 我陪他從 21:00 跟到 02:30 親眼看他寫
- copy_button (Button Ghost, optional)："複製這個範例的格式"（**不複製內容到表單，只示範格式**）
- source_link：連結到 worksheet 原文

#### Section 5: anti_fake_check

- **layout**: 右側固定面板（Desktop）／ 底部展開面板（Mobile）
- **elements**:
  - `panel_title` (H3): "即時檢核"
  - `panel_subtitle` (Body SM): "這是品質提示，不是評分。"
  - 3 個 check items：

| Check | Label | Logic | On Fail Hint |
| :--- | :--- | :--- | :--- |
| check_1 | 原句不含「我覺得 / 應該需要 / 可能」等分析詞 | `!/(我覺得\|應該需要\|可能\|大概\|或許\|似乎)/.test(complaint.verbatim)` | "如果你寫的是『我覺得他需要 X』，這是你的解釋，不是原句。" |
| check_2 | 來源是有具體名字的真人（不是「上班族」「現代人」） | `source_name` 非空且不在禁用代稱清單 `^(現代人\|上班族\|大家\|很多人\|某人)$` | "「現代人」不是一個你能找到的人。請填具體姓名。" |
| check_3 | 場景可被觀察（有時間 + 動作） | `complaint.scene.length >= 5` | "場景越具體越好（例：「他從 21:00 寫到 02:30」勝過「他在工作」）" |

狀態用 pass（Verified Green）／ warning（Caution amber）／ pending（灰）。**debounce 500ms** 即時更新。**aria-live="polite"** 讓螢幕閱讀器讀出。

#### Section 6: exit_gate_footer

- **layout**: 全寬 sticky 底部行動列
- **elements**:
  - `exit_conditions` (ExitGateChecklist)：
    - "[ ] 寫的是**原句**，不是你的解釋"（對應 check_1）
    - "[ ] 至少有 1 個**有名字的真人**"（對應 check_2 + source_name 非空）
  - `primary_cta` (Button Primary): "儲存並進入卡 2 →" — disabled 直到 5 欄位皆填且 R2.1 + R2.2 通過
  - `secondary_cta` (Button Ghost): "回到入口" → `/learn/worksheet`
  - `blocked_message` (AlertBox, Caution Amber, conditional)：點擊 CTA 但 exit gate 不通過時顯示動態文案

---

### [INTERACTION & STATE FLOW]

#### 主要互動流程

1. 頁面載入 → 從 URL `?id={uuid}` 讀 LocalStorage `painmap_worksheet:cards.{id}.complaint` → 預填 5 欄位
2. 使用者輸入 → debounce 500ms → 寫 LocalStorage + 更新 `updated_at`
3. 即時觸發 anti_fake_check 邏輯 → 更新右側面板狀態
4. 點擊 `primary_cta`：
   - **a**: 檢查 5 個必填欄位皆 minLength 通過 → 否則高亮空白欄位
   - **b**: 檢查 R2.1（不含分析詞）→ 否則 blocked_message：「這像是你的解釋，不是原句。請改寫成你**聽到**的具體句子。」
   - **c**: 檢查 R2.2（source_name 非代稱）→ 否則 blocked_message：「請填具體姓名（可化名但要是真人）」
   - **d**: 全通過 → PATCH `current_step = 2` + `status = 'in_progress'` → 導向 `/learn/worksheet/02?id={uuid}`

#### 自動儲存策略

- 每個欄位 onBlur 觸發儲存
- 連續輸入 debounce 500ms 觸發儲存
- 儲存成功 autosave_indicator 顯示「已自動儲存 · 剛剛」
- 儲存失敗（quota 滿）→ toast「儲存失敗，請匯出後刪除舊 PainCard」

#### RWD

| 斷點 | 佈局 |
| :--- | :--- |
| Desktop (>1280px) | 左 70% 表單 + 右 30% anti_fake_check 固定面板 |
| Tablet (768-1280px) | 全寬表單，anti_fake_check 為摺疊面板（預設展開） |
| Mobile (<768px) | 全寬單欄；anti_fake_check 在表單下方；stepper 水平捲動 |

---

### [DATA & API]

- **endpoints**:
  - `GET /api/paincards/{id}` — hydration（主要還是用 LocalStorage）
  - `PATCH /api/paincards/{id}` — 更新 `complaint` + `current_step` + `updated_at`
- **localStorage 寫入欄位**：
  - `painmap_worksheet:cards.{id}.complaint.verbatim`
  - `painmap_worksheet:cards.{id}.complaint.source_name`
  - `painmap_worksheet:cards.{id}.complaint.source_relation`
  - `painmap_worksheet:cards.{id}.complaint.datetime`
  - `painmap_worksheet:cards.{id}.complaint.scene`
  - `painmap_worksheet:cards.{id}.current_step` → 2（過關後）
  - `painmap_worksheet:cards.{id}.updated_at`
  - `painmap_worksheet:cards.{id}.status` → `in_progress`（過關後）
- **schema**：
  ```typescript
  type Complaint = {
    verbatim: string;       // minLength 10
    source_name: string;    // minLength 1
    source_relation: string;
    datetime: string;
    scene: string;
  };
  ```
- **error_cases**:
  - `?id={uuid}` 無效 → 顯示「找不到這份 PainCard」+「建立新的 PainCard」CTA
  - 自動儲存失敗 → toast 提示，不阻斷使用者輸入
  - PATCH 失敗 → LocalStorage 仍寫入，下次連線自動重試（offline-first）

---

### [EXIT GATE]

#### 反思問題（資料層判定）

| # | 條件 | 判定 | UI 反饋 |
| :- | :--- | :--- | :--- |
| 1 | 5 個欄位皆非空 | `verbatim/source_name/source_relation/datetime/scene` 皆 minLength 1（verbatim minLength 10）| 欄位邊框正常 |
| 2 | 寫的是原句，不是解釋 | R2.1：`verbatim` 不含分析詞 | check_1 Verified Green |
| 3 | 至少有 1 個有名字的真人 | R2.2：`source_name` 非空且不在禁用代稱清單 | check_2 Verified Green |

#### 失敗路由（友善文案，不用「失敗 / 不及格」）

| 失敗情境 | 文案 |
| :--- | :--- |
| `verbatim` 含分析詞 | 「這像是你的解釋，不是原句。請改寫成你**聽到**的具體句子。例：『他在飯局上說「我每週都...」』」 |
| `source_name` 為代稱 | 「「現代人」「上班族」不是你能聯絡到的人。請填**具體姓名**（可化名，但要是真人）。如果你想不到一個名字，這還不是你的題目 — 去找一個真人聊聊再回來。」 |
| 任一欄位空白 | 「請填寫所有 5 個欄位。如果你不確定怎麼填，看下方林老師範例。」 |
| `verbatim` < 10 字 | 「原句太短了。聽到的抱怨通常不只一句話 — 把完整的那段話寫下來。」 |

#### 退回工作流

> 卡 1 是起點，**沒有更前面的卡可退**。如使用者覺得題目錯了：
> - 提供「捨棄這份 PainCard 重新開始」（卡片 menu）→ 確認 modal → 刪除 LocalStorage → 導向 `/learn/worksheet`

---

### [AI INTEGRATION]

- **AI 介入狀態**：❌ **完全禁用**
- **理由**（直接引自 worksheet）：「這張卡片**完全是你的功課**，AI 不能幫忙。AI 會生「合成 persona」（虛構的人）和「合成抱怨」（虛構的句子），但虛構的東西**不會付錢**。」
- **設計手法**：
  - UI 顯示明顯「AI 介入：❌ 禁用」badge
  - **不提供**「AI 改寫我的抱怨」「AI 美化句子」「自動產生範例抱怨」按鈕
- **內建 prompt**：無
- **Fallback**：無

#### 為什麼禁 AI？

| 風險 | 說明 |
| :--- | :--- |
| 合成原句 | AI 會生「我每天加班到 11 點」這類聽起來像但不存在的句子 — 違反「原句」原則 |
| 美化解釋 | AI 會把錯誤的「我覺得他應該需要 X」優化成正確的「他需要 X」— 但使用者寫的本來就是錯的，需要被擋住 |
| 提示作弊 | 允許 AI 生成範例填入欄位 → 使用者跳過「真的去聽真人說話」這個訓練重點 |

---

### [OCTALYSIS HOOKS]

#### 主驅動力：#3 Empowerment of Creativity & Feedback

- 整張卡完全由使用者填寫，沒有 AI 介入 — 100% 創作自主權
- anti_fake_check 提供即時反饋（不是評分，是品質提示）
- 反思問題清晰可見（exit_gate_footer），使用者能自己判斷「我準備好進下一張了嗎」

#### 副驅動力：#1 Epic Meaning

- card_intro `rule_callout` 強調「這是判斷力訓練」
- AI 禁用 badge 反向強化「這張你必須親自完成」的價值

#### 副驅動力：#2 Development & Accomplishment（限制使用）

- stepper_header 視覺化「卡 1 / 9」進度 — **不顯示百分比、不顯示分數**
- exit_gate_footer 反思問題 checklist — 完成感來自「我做到了過關標準」

#### 反模式警告（必須全部不出現）

| 禁用 | 為何 |
| :--- | :--- |
| ❌ Streak（「連續填卡 N 天」） | 違反 anti-anxiety；填卡是判斷力練習，不是打卡 |
| ❌ 倒數計時器（「卡 1 限時 10 分鐘完成」） | 製造焦慮；卡片可任意暫停與恢復 |
| ❌ 評分條（「你的卡 1 品質 85 分」） | brand 鐵律 — 用 anti-fake check 取代 |
| ❌ 「快速填卡」按鈕（AI 自動生成範例填入） | 違反「親自聽真人」核心訓練 |
| ❌ 解鎖音效 / 視覺特效 | 過度遊戲化 |
| ❌ 「跳過這張」按鈕 | 卡 1 是起點，跳過 = 整份失效 |

---

## === EXCEPTION RULES ===

本頁面**無特殊例外**，完全遵循 Global Guideline。

唯一須特別注意：**AI 完全禁用**是本頁鐵律（與 worksheet 卡 1 / 卡 2 一致），即使日後接站內 LLM 也不可開放本頁的 AI 輔助。

---

## === OUTPUT REQUIREMENTS ===

### Step 1：結構確認

- 6 個 sections + 用途
- 每個 section 元件 + 必填／選填
- PainCard schema 對應：明確列出 `complaint.verbatim` / `source_name` / `source_relation` / `datetime` / `scene`
- 資料流：URL `?id` → LocalStorage 讀 → form state → debounce 500ms 寫回 LocalStorage + PATCH best-effort
- exit gate pseudocode：
  ```
  IF 5_fields_filled AND verbatim.length >= 10 AND R2.1_pass AND R2.2_pass
  THEN PATCH current_step=2, status='in_progress' AND redirect /02?id=...
  ELSE show blocked_message + highlight failed field
  ```

### Step 2：設計決策說明

說明 3 個關鍵設計決策：
1. **為什麼右側固定 anti_fake_check 面板，而不是 inline tooltip？** — 即時、不擋輸入、aria-live="polite" 螢幕閱讀器友善；同時讓使用者視覺上「看著規則寫」
2. **如何讓「AI 禁用 badge」不焦慮、反而強化價值？** — 用反向 framing：「這張你必須親自完成」是判斷力訓練的核心，不是限制
3. **anti_fake validator 用 Caution amber（不擋輸入）vs exit gate 擋過關（紅色僅限系統錯誤）的雙層設計** — 教學優先：邊寫邊看品質，不打斷思路；過關才嚴格

### Step 3：實作方案（Option A：完整程式碼）

輸出要求：
- `Card1ComplaintPage.tsx` 主檔
- `StepperHeader.tsx`、`CardIntro.tsx`、`InputForm.tsx`、`ExampleReference.tsx`、`AntiFakeCheck.tsx`、`ExitGateFooter.tsx`
- Zod schema for complaint validation
- React Hook Form + debounce LocalStorage write hook
- anti-fake validator pure functions（含 R2.1 / R2.2 regex）
- RWD Tailwind responsive classes
- 所有元件狀態（default / focus / warning / error / disabled / loading）

### 品質檢查清單（部署前必過）

#### 通用
- [ ] 6 個 Section 依序渲染
- [ ] URL `?id={uuid}` 從 LocalStorage 正確讀取 PainCard 並填入 5 個欄位
- [ ] 5 個欄位 onBlur / debounce 500ms 自動儲存到 LocalStorage（PATCH 為 best-effort）
- [ ] anti_fake_check 三個 check item 即時更新狀態
- [ ] check_1（R2.1）正確偵測「我覺得 / 應該需要 / 可能 / 大概 / 或許 / 似乎」
- [ ] check_2（R2.2）正確偵測「現代人 / 上班族 / 大家 / 很多人 / 某人」代稱
- [ ] CTA 在 5 欄位皆填且 R2.1 + R2.2 通過時才 enable
- [ ] CTA disabled 時 hover 顯示 tooltip 說明原因
- [ ] CTA 點擊後正確 PATCH `current_step = 2` + `status = 'in_progress'`
- [ ] 4 種失敗情境顯示對應友善文案
- [ ] AI 介入 badge 顯示「❌ 禁用」
- [ ] **不**出現「AI 改寫」「AI 美化」「自動產生範例」按鈕
- [ ] 鍵盤 Tab 順序：back_link → 5 個欄位 → secondary_cta → primary_cta
- [ ] 螢幕閱讀器讀出 anti_fake_check 結果（aria-live="polite"）
- [ ] LocalStorage quota 滿時顯示降級提示
- [ ] RWD 三斷點正確

#### Octalysis 黑帽掃描（生成程式碼後**必跑**）
- [ ] 是否出現分數 UI？→ 砍掉
- [ ] 是否有 streak / 連續打卡？→ 砍掉
- [ ] 是否有 loot box / 抽卡 / 神秘獎勵？→ 砍掉
- [ ] 是否有 FOMO 文案？→ 砍掉
- [ ] 是否有過期警告？→ 砍掉
- [ ] 是否有排行榜 / 社群比較？→ 砍掉
- [ ] 「下一步」按鈕文案中性？→ 否則重寫
- [ ] 失敗回退無「失敗 / 不及格」字眼？→ 否則重寫

#### 禁用詞掃描
- [ ] 全頁面零出現「分數」「評分」「品質分」「快速」「一鍵」「秒填」「想法」「點子」「闖關」「升級」

---

**版本資訊**：Worksheet v1.0 ｜ Brand v1.0 ｜ 2026-05-01
