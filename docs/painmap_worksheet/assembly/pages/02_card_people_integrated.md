# PainMap Worksheet — Card 2 (Three Named People) Integrated Prompt

> 自我包含整合 prompt — 直接貼入 Lovable / Claude Code 即可生成卡 2 完整實作。
> 對應 page spec：`docs/painmap_worksheet/design/pages/02_card_people.md`
> 對應資料模型：`docs/painmap_worksheet/product/data_model.md` § Card 2
> 組裝日期：2026-05-01 ｜ Worksheet v1.0

---

## === GLOBAL PROJECT GUIDELINE (DO NOT OVERRIDE) ===

你是「PainMap 題眼 — Worksheet 教學模式」的資深產品設計師與前端工程師。

### 品牌特質

**結構化** ｜ **賦權感** ｜ **沉穩** ｜ **教學優先**

### Color Tokens（卡 2 用到的子集）

| Token | 色值 | Tailwind | 用途 |
| :--- | :--- | :--- | :--- |
| Primary | #1E3A5F | `bg-[#1E3A5F]` | 結構深度 |
| Primary Light | #E8EEF5 | `bg-[#E8EEF5]` | rule_callout 背景 |
| Secondary | #2D7D8A | `bg-[#2D7D8A]` | stepper 高亮、focus |
| Accent CTA | #E8913A | `bg-[#E8913A]` | 過關 primary CTA |
| Verified | #2D9D78 | `bg-[#2D9D78]` | check pass、卡 1 已完成 |
| Caution | #D97706 | `bg-[#D97706]` | anti-fake warning、ai_disabled_callout 框 |
| Caution Light | #FEF3E2 | `bg-[#FEF3E2]` | ai_disabled_callout 背景 |
| Error | #DC2626 | `bg-[#DC2626]` | 僅限系統驗證錯誤 |
| BG Page | #F7F8FA |
| Text Primary | #1A2332 |
| Text Secondary | #5C6B7A |
| Border Default | #DFE3E8 |
| Border Focus | #2D7D8A |

### Typography

| Token | 字級 | 字重 |
| :--- | :--- | :--- |
| H1 | 28px | 700 |
| H2 | 22px | 600 |
| H3 | 18px | 600 |
| H4 | 16px | 600 |
| Body MD | 15px | 400 |
| Body SM | 13px | 400 |
| Caption | 12px | 400 |

字體：`Noto Sans TC` + `Inter`。

### 元件風格

- Radius MD 8px / LG 12px
- Border `1px solid #DFE3E8` 預設 / `2px solid #2D7D8A` focus
- Shadow SM (default) / Shadow MD (hover)

### 技術棧

React 18 + TypeScript + Tailwind CSS + Zustand + React Hook Form + Zod。LocalStorage key：`painmap_worksheet:cards`。

### 絕對禁令（PainMap Brand）

- 禁止：分數、星等、A-F 等級、成功率預測、排行榜、徽章、倒數計時
- 禁用詞：「persona」單獨使用 / 「目標客戶 / TA」 / 「想像的使用者」 / 「分數」「評分」 / 「比他人快 / 排名」 / 「快速」「一鍵」 / 「闖關」「升級」「streak」
- WCAG AA ≥ 4.5:1 / 語意化 HTML / focus ring Teal

### 絕對禁令（Octalysis 黑帽）

- 禁止 #6 Scarcity & Impatience：不可有時間壓力、限定名額
- 禁止 #7 Unpredictability：不可有「AI 推薦相似人選」「神秘 persona」
- 禁止 #8 Loss Avoidance：不可有 streak / 過期 / 「3 天不填消失」

### 教學模式特殊鐵律（卡 2 為**最嚴格鐵律**）

1. **AI 完全禁用**（worksheet 鐵律：合成 persona = 不會付錢的虛構人物）
2. **書面優先**：3 位真人的真名、聯絡方式、關係必須具體可驗證
3. **反思問題透明**：3 個都有真名 + 至少 1 位今天能聯絡到
4. **失敗回退**：過不了 → 回去把卡 1 想清楚再來 / 暫存先去找人，不用「失敗」字眼

---

## === CURRENT TASK: BUILD CARD 2 — THREE NAMED PEOPLE ===

### [PAGE META]

- **page_name**: Card 2 - Three Named People
- **route_path**: `/learn/worksheet/02?id={paincard_uuid}`
- **card_step**: 2
- **page_type**: card_input（form, no AI — STRICT）
- **primary_goal**: 引導使用者填入 `people.background` 與 `people.list[3]`（每筆 name / contact / relation），確保 3 個都是**真名 + 你今天能聯絡到至少 1 位**
- **secondary_goal**: 體會「合成 persona = 不會付錢的虛構人物」鐵律
- **prerequisite_cards**: [1]
- **expected_time_on_page**: 5-15 分鐘（首次）

---

### [STRUCTURE: SECTIONS]

1. **stepper_header** — 9 卡 stepper（卡 1 ✓ Verified Green / 卡 2 高亮 Teal）+ AI 介入 badge「❌ 禁用（鐵律）」
2. **card_intro** — 「為什麼必須是 3 個有名字的真人」
3. **ai_disabled_callout** — 醒目區塊（Caution amber 框）引用 worksheet「AI 不能讓代填」段落
4. **input_form** — 1 個 background + 3 組 person 輸入
5. **example_reference** — 林老師範例（3 位補教老師）
6. **anti_fake_check** — R2.2（不是「老師 A」代稱）+ contactable today 勾選
7. **exit_gate_footer** — 反思問題 + 失敗 ≥ 3 次顯示 fallback_action_card

---

### [SECTION COMPONENT SPEC]

#### Section 1: stepper_header

- `back_link`: "← 回到卡 1（修改）" → `/learn/worksheet/01?id={uuid}`（提示：修改卡 1 會將卡 2 標記為 stale）
- `stepper`: 9 卡，卡 1 = Verified Green check / 卡 2 = Teal 高亮 / 其他 = 灰
- `paincard_meta` (Caption): "PainCard #{id_short}"
- `ai_indicator` (Badge, **Error red border**): "AI 介入：❌ 禁用（鐵律）"

#### Section 2: card_intro

- `card_number` (Eyebrow): "卡 2 / 9"
- `card_title` (H1): "找出 3 個有名字的人"
- `rule_callout` (AlertBox, Primary Light bg, icon=Users)：
  - 「**規則：** 抱怨主人翁是誰？這種人你能聯絡到 **3 個**嗎？必須是**真名**（不是「補習班老師 A」），且你**今天**就能聯絡到至少 1 位。」
- `guidance` (Body MD): "為什麼是 3 個？因為 1 個可能是個案、2 個可能是巧合，3 個才是模式的開始。"

#### Section 3: ai_disabled_callout（醒目區塊）

- **layout**: 全寬，背景 Caution Light `#FEF3E2`，邊框 Caution amber 1px
- **elements**:
  - icon: AlertOctagon (Caution amber)
  - title (H3): "這張卡 AI 不能幫忙"
  - body (BlockQuote)：**直接引用 worksheet 卡 2 原文，不重寫**：
    - "這張卡片**完全是你的功課**，AI 不能幫忙。"
    - "理由：AI 會生「合成 persona」（虛構的人），但虛構的人**不會付錢**。"
  - implications (BulletList)：
    - "本頁無「AI 推薦人選」按鈕"
    - "本頁無「AI 自動補充背景描述」按鈕"
    - "如果你想不出 3 個真名 → 這代表你還不認識這個圈子（後面會教你怎麼辦）"

**aria-live="polite"** 讓螢幕閱讀器讀出。

#### Section 4: input_form

- **layout**: 單欄表單 — 1 個 background 欄 + 3 組重複的 person 區塊
- **欄位定義**：

| 欄位 | 元件 | label | placeholder | data_field | minLength |
| :--- | :--- | :--- | :--- | :--- | :--- |
| background | Textarea (rows=3) | "這群人的特徵（大概是什麼背景）" | "30–50 歲、台灣中小型補習班老師、每週要做家長溝通" | `people.background` | 1 |
| person_1.name | TextField | "1. 姓名" | "林老師" | `people.list[0].name` | 1（且不在禁用代稱清單）|
| person_1.contact | TextField | "聯絡方式" | "LINE" | `people.list[0].contact` | 1 |
| person_1.relation | TextField | "你跟他的關係" | "我表妹的數學老師" | `people.list[0].relation` | 1 |
| person_2.* | 同 person_1，data_field 改為 `people.list[1].*` | | "王老師" / "FB Messenger" / "林老師介紹的同業" | | |
| person_3.* | 同 person_1，data_field 改為 `people.list[2].*` | | "陳老師" / "電話" / "我國中同學的爸爸" | | |

PersonGroupRepeater 固定 3 組，**不可增刪**（schema `list.length === 3`）。

`autosave_indicator` (Caption): "已自動儲存到瀏覽器 · {timestamp_ago}"

#### Section 5: example_reference（可摺疊，預設摺疊）

- toggle_header："📖 看 worksheet 林老師範例"
- 內容（直接引用 worksheet 卡 2，不重寫）：
  - **大概是什麼背景：** 30–50 歲、台灣中小型補習班老師、每週要做家長溝通
  - 1. 林老師｜LINE｜我表妹的數學老師
  - 2. 王老師｜FB Messenger｜林老師介紹的同業
  - 3. 陳老師｜電話｜我國中同學的爸爸
  - explanation (Body SM): "注意：3 個人的關係都很**具體**（表妹的老師 / 林介紹的同業 / 國中同學的爸爸）— 這代表填寫者真的能找到他們。"

#### Section 6: anti_fake_check（右側固定面板 Desktop / 底部展開 Mobile）

- `panel_title` (H3): "即時檢核"
- `panel_subtitle` (Body SM): "這是品質提示，不是評分。"
- 3 個 check items：

| Check | Label | Logic | On Fail |
| :--- | :--- | :--- | :--- |
| check_1 (R2.2) | 3 個都是真名（不是「老師 A / 同學 B」） | 對 `people.list[*].name` 檢查不為空、不在禁用代稱清單 `^(老師 [ABC]\|同學 [ABC]\|persona [123]\|User [123]\|[ABC])$` | "「老師 A」這種代稱代表你還不認識這個人。請填具體姓名（可化名但要是真人）。" |
| check_2 | 你今天就能聯絡到至少 1 位 | 至少 1 個 `list[i].contact` 包含可立即傳訊關鍵字（LINE/電話/Email/Messenger/WhatsApp/FB/IG/簡訊）+ 使用者勾選自我承諾 checkbox「我確認今天能聯絡到至少 1 位」 | "請至少有 1 位你今天能傳訊息的人" |
| check_3 | 背景描述夠具體（年齡 / 職業 / 地點任 2 項） | `background.length >= 10` 且至少 2 個關鍵類別關鍵字 | "「年輕人」「上班族」太寬。請至少寫 2 個具體屬性（例：30-50 歲、補習班數學老師、台灣）。" |

**狀態**：pass / warning / pending（debounce 500ms 更新）

#### Section 7: exit_gate_footer（sticky bottom）

- `exit_conditions` (ExitGateChecklist)：
  - "[ ] 3 個都有真名（不是「補習班老師 A」）"
  - "[ ] 你今天就能聯絡到至少 1 位"
- `primary_cta` (Button Primary): "儲存並進入卡 3 →"
- `secondary_cta` (Button Ghost): "回到卡 1（修改）"
- `blocked_message` (AlertBox, Caution Amber, conditional)：點擊 CTA 失敗時顯示動態文案
- `fallback_action_card` (Card, conditional)：當 exit gate 失敗 ≥ 3 次時顯示
  - title (H3): "想不到 3 個真名怎麼辦？"
  - body (Body MD)：**引用 worksheet 原文**「你還不認識這個圈子。解法：先去這群人聚集的地方混 1-2 週（社團、LINE 群、實體場合），再回來。」
  - cta (Button Ghost): "暫存這份 PainCard，先去找人" → PATCH `status = 'draft'`，導向 `/learn/worksheet`，顯示「你的 PainCard 已暫存。先去認識 3 位{background}，再回來繼續。」

---

### [INTERACTION & STATE FLOW]

#### 主要互動流程

1. 頁面載入 → 從 LocalStorage 讀 `people` → 填入 background + 3 組 person
2. 使用者輸入 → debounce 500ms → 寫 LocalStorage → 更新 anti_fake_check
3. 即時觸發 R2.2（代稱偵測）
4. 點擊 `primary_cta`：
   - **a**: 檢查 background 非空 + 3 組 person 各 3 欄位皆非空
   - **b**: 檢查 R2.2（無代稱）→ 否則 blocked_message
   - **c**: 檢查至少 1 個 contact 可聯絡 + 使用者勾選 checkbox → 否則 blocked_message
   - **d**: 失敗 ≥ 3 次 → 額外顯示 `fallback_action_card`
   - **e**: 全通過 → PATCH `current_step = 3` → 導向 `/learn/worksheet/03?id={uuid}`

#### 回去把卡 1 想清楚再來 同步

點「回到卡 1 修改」：
- 提示 modal：「修改卡 1 後，本卡（卡 2）的資料會保留，但建議你重新檢查 3 位人選是否還合適。確認嗎？」
- 確認後導向卡 1，但 `current_step` 不變（仍為 2）

#### RWD

| 斷點 | 佈局 |
| :--- | :--- |
| Desktop (>1280px) | 左 70% 表單（3 組 person 並排或垂直）+ 右 30% anti_fake_check |
| Tablet | 全寬表單，3 組 person 垂直，anti_fake_check 摺疊面板 |
| Mobile | 全寬單欄，3 組 person accordion 摺疊（預設展開第 1 組） |

---

### [DATA & API]

- **endpoints**:
  - `GET /api/paincards/{id}` — hydration
  - `PATCH /api/paincards/{id}` — 更新 `people` + `current_step`
- **localStorage 寫入欄位**：
  - `painmap_worksheet:cards.{id}.people.background`
  - `painmap_worksheet:cards.{id}.people.list[0..2].{name, contact, relation}`
  - `painmap_worksheet:cards.{id}.current_step` → 3（過關後）
- **schema**：
  ```typescript
  type People = {
    background: string;          // minLength 1
    list: Array<{                // length === 3 strict
      name: string;              // minLength 1, 不在禁用代稱清單
      contact: string;           // minLength 1
      relation: string;          // minLength 1
    }>;
  };
  ```
- **error_cases**: 同卡 1（找不到 PainCard / quota / PATCH 失敗）

---

### [EXIT GATE]

#### 反思問題

| # | 條件 | 判定 |
| :- | :--- | :--- |
| 1 | 3 個都有真名 | `list.length === 3` 且每筆 `name` 非空且不在禁用代稱清單 |
| 2 | 至少 1 位今天能聯絡 | 至少 1 個 `list[i].contact` 包含可聯絡關鍵字 + 使用者勾選自我承諾 checkbox |
| 3 | 3 組 + background 皆非空 | 全部 minLength 1 |

#### 失敗路由

| 失敗 | 文案 |
| :--- | :--- |
| `list[i].name` 為代稱 | 「「老師 A」這種代稱代表你還不認識這個人。請填具體姓名（可化名但要是真人）。」 |
| 無人可今天聯絡 | 顯示 fallback_action_card：「**你還不認識這個圈子。** 解法（引用 worksheet）：先去這群人聚集的地方混 1-2 週（社團、LINE 群、實體場合），再回來。」 |
| 任一欄位空白 | 「請填寫所有欄位。需要 3 位真人 + 各自的聯絡方式。」 |
| `background` < 10 字 | 「背景描述太籠統。至少寫 2 個具體屬性（年齡 / 職業 / 地點）。」 |

#### 退回工作流

> 卡 2 過不了 → 退回**卡 1**（理由：你還沒接觸真人）
> - fallback_action_card「暫存先去找人」→ PATCH `status = 'draft'` + `current_step` 仍為 2 → 導向 landing

---

### [AI INTEGRATION]

- **AI 介入狀態**：❌ **完全禁用（鐵律 — strictest）**
- **理由**（直接引自 worksheet 卡 2）：「這張卡片**完全是你的功課**，AI 不能幫忙。AI 會生「合成 persona」（虛構的人），但虛構的人**不會付錢**。」
- **設計手法**：
  - ai_disabled_callout 醒目區塊（Caution amber 框）放在 input_form 之前
  - **不提供**「AI 推薦相似人選」「AI 補充背景描述」「AI 生成 persona」「我想不到，幫我列舉典型 persona」按鈕
- **內建 prompt**：無
- **Fallback**：無

#### 為什麼這張卡是「鐵律」級禁用？

| 風險 | 說明 |
| :--- | :--- |
| 合成 persona 不會付錢 | worksheet 明確標註的核心原則 — 整份方法論建立在「真實樣本」上 |
| 跳過社群混入訓練 | worksheet 的失敗路由就是「先去這群人聚集的地方混 1-2 週」 |
| 後續卡片連鎖失效 | 卡 4「workaround」、卡 8「真人訪談」都依賴卡 2 的真人 |

---

### [OCTALYSIS HOOKS]

#### 主驅動力：#5 Social Influence & Relatedness

- 整張卡核心是「真人連結」— 強調「你必須認識這 3 個人」是社交關係訴求
- **禁止排行榜、禁止「他人也填了 X 位」這類社群比較**

#### 副驅動力：#2 Development & Accomplishment

- exit_gate_footer 反思問題清晰 — 完成 3 位真人 = 達成里程碑（**不發徽章、不顯示分數**）

#### 副驅動力：#1 Epic Meaning

- ai_disabled_callout 強化「這是判斷力訓練」的使命感
- 「先去這個圈子混 1-2 週」反而強化「這份功課值得花時間」

#### 反模式警告（必須全部不出現）

| 禁用 | 為何 |
| :--- | :--- |
| ❌ 排行榜（「本月填卡 2 完成最快」） | brand 鐵律 |
| ❌ 「90% 使用者第一次都填不出 3 個真名」社群比較 | 製造焦慮 |
| ❌ 「AI 推薦你可能認識的人」按鈕 | 違反鐵律 |
| ❌ 「自動補充 background 描述」按鈕 | AI 會生合成 persona |
| ❌ 「跳過此卡，3 天後再填」按鈕 | 卡 2 是判斷力訓練的試金石 |
| ❌ Streak | 違反 anti-anxiety |

#### #5 Social Influence 白帽邊界

- ✅ 允許：「真人連結」「具體姓名」「能聯絡到」（強調**真實社交關係**）
- ❌ 禁止：「比較他人進度」「公開分享你的 persona 列表」「按讚 / 評分他人 PainCard」

---

## === EXCEPTION RULES ===

本頁面**無特殊例外**，但有兩個鐵律加強條款：

1. **AI 完全禁用是鐵律**（strictest 級別）— 即使日後接站內 LLM 也不可開放本頁的 AI 輔助。
2. **3 組 person 結構為固定 length === 3**（schema 強制）— 不可開放新增 / 刪除組數。

其餘設計決策完全遵循 Global Guideline。

---

## === OUTPUT REQUIREMENTS ===

### Step 1：結構確認

- 7 個 sections + 用途
- 每個 section 元件 + 必填／選填
- PainCard schema 對應：`people.background` / `people.list[0..2].{name, contact, relation}`
- 資料流：URL `?id` → LocalStorage 讀 → form state → debounce 500ms 寫回 → exit gate → PATCH
- exit gate pseudocode：
  ```
  IF background.length >= 10 AND list.length === 3
     AND every list[i].{name, contact, relation} non-empty
     AND every list[i].name NOT IN forbidden_pseudonyms
     AND at least one list[i].contact has contact-keyword
     AND user checked "我確認今天能聯絡到至少 1 位"
  THEN PATCH current_step=3 AND redirect /03?id=...
  ELSE IF failure_count >= 3 THEN show fallback_action_card
  ELSE show blocked_message
  ```

### Step 2：設計決策說明

說明 3 個關鍵設計決策：
1. **為什麼 3 組 person 是固定數量（不開放增刪）？** — worksheet 鐵律「1 個個案、2 個巧合、3 個模式」；schema `list.length === 3` 強制；UI 不提供新增按鈕
2. **如何讓 AI 完全禁用感覺像「價值」而不是「限制」？** — ai_disabled_callout 直接引用 worksheet「合成 persona 不會付錢」原文 + 反向 framing「這張你必須親自完成」
3. **失敗 ≥ 3 次顯示 fallback_action_card 的時機選擇** — 不在第一次失敗就顯示（避免羞辱），給使用者試 2 次的空間；第 3 次顯示「先去找人再回來」是賦權出口而非懲罰

### Step 3：實作方案（Option A：完整程式碼）

- `Card2PeoplePage.tsx` 主檔
- `StepperHeader.tsx`（reuse 卡 1）/ `CardIntro.tsx` / `AiDisabledCallout.tsx` / `PersonGroupRepeater.tsx` / `ExampleReference.tsx` / `AntiFakeCheck.tsx` / `ExitGateFooter.tsx` / `FallbackActionCard.tsx`
- Zod schema for people validation（含禁用代稱清單）
- React Hook Form `useFieldArray` for 3 person groups
- anti-fake validator regex
- RWD Tailwind responsive classes

### 品質檢查清單（部署前必過）

#### 通用
- [ ] 7 個 Section 依序渲染
- [ ] background + 3 組 person 自動儲存到 LocalStorage
- [ ] R2.2 正確偵測代稱（"老師 A"、"同學 B"、"persona 1"、"A"、"B"、"C" 等）
- [ ] check_2 偵測「至少 1 個 contact 包含可聯絡關鍵字」+ 使用者勾選 checkbox 才過
- [ ] check_3 background 至少 2 個具體屬性
- [ ] CTA 失敗 ≥ 3 次後額外顯示 fallback_action_card
- [ ] 「暫存先去找人」正確 PATCH `status = 'draft'` 並導向 landing
- [ ] CTA 過關後 PATCH `current_step = 3`
- [ ] ai_disabled_callout 醒目顯示，引用 worksheet 卡 2 原文
- [ ] **不**出現任何「AI 推薦」「AI 生成」「AI 補充」按鈕
- [ ] 鍵盤 Tab 順序正確
- [ ] 螢幕閱讀器讀出 ai_disabled_callout（aria-live="polite"）
- [ ] LocalStorage quota 滿時降級提示
- [ ] RWD 三斷點正確

#### Octalysis 黑帽掃描（生成程式碼後**必跑**）
- [ ] 是否出現分數 UI？→ 砍掉
- [ ] 是否有 streak / 連續打卡？→ 砍掉
- [ ] 是否有 loot box / 抽卡 / 神秘獎勵？→ 砍掉
- [ ] 是否有 FOMO 文案？→ 砍掉
- [ ] 是否有過期警告？→ 砍掉
- [ ] 是否有排行榜或「N% 使用者完成」社群比較？→ 砍掉

#### 禁用詞掃描
- [ ] 全頁面零出現「persona」（單獨）「目標客戶 / TA」「想像的使用者」「分數 / 評分」「比他人快 / 排名 / 平均完成時間」「快速 / 一鍵 / 秒填」

---

**版本資訊**：Worksheet v1.0 ｜ Brand v1.0 ｜ 2026-05-01
