# PainMap Worksheet — Card 7 (Self Guess Before AI) Integrated Prompt

> 自我包含整合 prompt — 直接貼入 Lovable / Claude Code 即可生成卡 7 完整實作。
> 對應 page spec：`docs/painmap_worksheet/design/pages/07_card_self_guess.md`
> 對應資料模型：`docs/painmap_worksheet/product/data_model.md` § Card 7
> 組裝日期：2026-05-02 ｜ Worksheet v1.0
>
> **這張卡是 Octalysis #3 Mighty Creation Pedestal 的教科書範例** — 透過「強制 self-articulation」遮罩 AI 回覆，逼迫使用者先寫下自己的猜測；解鎖後再對照差異。

---

## === GLOBAL PROJECT GUIDELINE (DO NOT OVERRIDE) ===

你是「PainMap 題眼 — Worksheet 教學模式」的資深產品設計師與前端工程師。

### 品牌特質

**結構化** ｜ **賦權感** ｜ **沉穩** ｜ **教學優先**

### Color Tokens

| Token | 色值 | 用途 |
| :--- | :--- | :--- |
| Primary #1E3A5F / Primary Light #E8EEF5 / Secondary #2D7D8A（Phase A border-left + focus）/ Accent CTA #E8913A / Verified #2D9D78（Phase B border-left + checkpoint passed）/ Caution #D97706 / BG Page #F7F8FA / BG Muted #F1F3F5 / Text Primary #1A2332 / Text Secondary #5C6B7A / Border Default #DFE3E8 / Border Focus #2D7D8A |

### Typography

H1 28px / H2 22px / H3 18px / Body LG 17px / Body MD 15px / Body SM 13px / Caption 12px / Code 14px (monospace JetBrains Mono — AI 回覆顯示)

字體：`Noto Sans TC` + `Inter` + `JetBrains Mono`

### 元件風格

- Radius MD 8px / LG 12px
- Border `1px solid #DFE3E8` / focus 2px Teal
- Shadow SM / MD

### 技術棧

React 18 + TypeScript + Tailwind + Zustand + React Hook Form + Zod。LocalStorage key：`painmap_worksheet:cards`。

### 絕對禁令（PainMap Brand）

- 禁止：分數、星等、A-F、成功率、排行榜、徽章、倒數計時
- 禁用詞：「猜對了 / 猜錯了」「正確答案」「準確度」「猜測分數」「闖關成功 / 解鎖成就」「其他人都猜什麼」「AI 比你聰明」
- 禁止 Inline styles / `console.log`
- WCAG AA / 語意化 HTML / focus ring Teal

### 絕對禁令（Octalysis 黑帽）

- 禁止 #6 Scarcity：「Phase B 限時 30 分鐘解鎖」
- 禁止 #7 Unpredictability：「Phase B 解鎖後會看到驚喜內容」、抽獎、神秘
- 禁止 #8 Loss Avoidance：「沒填完明天回來資料會消失」

### 教學模式特殊鐵律（Card 7 為 Mighty Creation Pedestal 教科書）

1. **強制 self-articulation 在前**：4 欄猜測必須先寫完，沒寫完看不到 AI（**物理上阻擋**，不只文案提醒）
2. **創造性沒有對錯**：4 欄沒有「正確答案」校驗，使用者怎麼猜都通過 Phase A
3. **反饋來自對比，不來自評分**：解鎖後給的不是「你猜得對 / 錯」，而是「你和 AI 的差異是什麼」
4. **Phase A readonly after unlock**：避免使用者看到 AI 後回頭修改猜測（破壞訓練本意）
5. **失敗回退**：回去把卡 6 想清楚再來 → 清空卡 7 所有資料（避免污染重來）

---

## === CURRENT TASK: BUILD CARD 7 — SELF GUESS BEFORE AI ===

### [PAGE META]

- **page_name**: Card 7 - Self Guess Before AI
- **route_path**: `/learn/worksheet/07?id={paincard_uuid}`
- **card_step**: 7
- **page_type**: card_input + two_phase_locked_unlock
- **primary_goal**: 透過「先猜後看」兩段式 UI 訓練 self-articulation；產出 4 欄猜測 + 4 個 AI 檢查點通過 + AI 痛點判斷表 + 3 deltas 對照
- **secondary_goal**: 建立「AI 是補強，不是替代」的認知；訓練「比對差異」的反思習慣
- **prerequisite_cards**: [1, 2, 3, 4, 5, 6]
- **expected_time_on_page**: 12-20 分鐘

---

### [STRUCTURE: SECTIONS]

1. **stepper_context** — 卡 1-6 ✓ / 卡 7 高亮 + AI badge「✅ 第二輪追問 prompt」
2. **card_intro** — 「為什麼要先猜」+ Mighty Creation 設計理念
3. **phase_a_self_guess**（Phase A — 鎖定 AI）— 4 欄猜測必須先填
4. **phase_b_locked_preview**（Phase A 期間顯示）— 遮罩 + blur AI 回覆輪廓
5. **phase_b_ai_review**（Phase A 完成後解鎖）— AI 回覆 + 4 checkpoint + 第二輪 prompt + 3 deltas
6. **exit_gate** — 過關 4 條件 + 「進入卡 8」CTA

---

### [SECTION COMPONENT SPEC]

#### Section 1: stepper_context

- 與卡 1-6 一致
- `ai_indicator` (Badge, Verified Green border): "AI 介入：✅ 第二輪追問 prompt"

#### Section 2: card_intro

- `card_label` (Caption): "卡片 7 / 9"
- `title` (H1): "自己先猜，再讀 AI 回覆"
- `one_liner` (Body LG): "如果你直接看 AI 回覆，你會被它牽著走，失去自己的判斷力。"
- `training_principle` (CalloutBox Empowering, icon=🧠)：
  - title: "為什麼要先猜？"
  - body: 「先寫下自己的猜測，再對照 AI 回覆。差異就是你要學的地方。AI 不是給你答案，是讓你看到自己的盲區。」
- `design_note` (Body SM Italic, optional): 「填完下面 4 欄之前，AI 回覆會被遮住。這是設計上的刻意。」

#### Section 3: phase_a_self_guess（鎖定 Phase B 的核心）

- **layout**: 全寬白底容器，padding 32px，最大寬 800px，**border-left 4px Teal #2D7D8A**
- **elements**:
  - `section_title` (H2): "Phase A：先寫你的猜測（不要偷看下面）"
  - `section_subtitle` (Body MD): "花 2 分鐘寫，不要超過 5 分鐘。沒有對錯，怎麼猜都過關。"
  - `timer_hint` (Caption Muted, optional): "建議花 2-5 分鐘"（**不是倒數計時器，只是文字建議**）
  - `context_summary` (ContextCard, 折疊式)：顯示卡 1-5 關鍵資料摘要
    - 抱怨原句（卡 1）
    - 主人翁背景（卡 2）
    - 卡關公式（卡 3）
    - 現在怎麼解（卡 4）
  - `guess_form` (4 個 Textarea 垂直堆疊)：

| 欄位 | label | hint | data_path | minLength | maxLength |
| :--- | :--- | :--- | :--- | :- | :- |
| guess_painful_person | "我猜『最痛』的人是" | "從卡 4 的 workaround 推論：誰在花最多時間 / 錢 / 情緒解這件事？" | `self_guess.guesses.most_painful_person` | 10 | 200 |
| guess_common_scene | "我猜『最常發生』的場景是" | "時間 + 地點 + 動作（例：週六晚上、家裡、寫家長信）" | `self_guess.guesses.most_common_scene` | 10 | 200 |
| guess_biggest_dissatisfaction | "我猜『他現在最不滿』的點是" | "從卡 4 的不滿理由中挑你直覺最強的那個" | `self_guess.guesses.biggest_dissatisfaction` | 10 | 200 |
| guess_possible_fake_pain | "我猜可能有 1 個假痛點是" | "我自己懷疑可能不是真的痛 / 可能會被現有工具解掉的部分" | `self_guess.guesses.possible_fake_pain` | 10 | 200 |

  - `phase_a_complete_button` (Button Primary): "我猜完了，解鎖 Phase B →" / **disabled until 4 欄都達 minLength**

**狀態**：default / filling（每欄達 minLength 後 ✓ 微標記）/ all_filled（button 解鎖 Amber CTA）/ completed（**Phase A 變 readonly + 灰化，仍可閱讀，不可修改**）

**反模式禁令**：
- ❌ 不可顯示「猜得越接近 AI 越好」這類訊息
- ❌ 不可顯示其他使用者的猜測樣本（社會比較）

#### Section 4: phase_b_locked_preview（Phase A 期間顯示）

- **layout**: 全寬，padding 32px，背景半透明 + `backdrop-filter: blur(8px)`
- **elements**:
  - `lock_icon` (Icon 🔒, 中性灰色，**非紅色警告**)
  - `locked_title` (H2): "填完上面 4 欄就會解鎖"
  - `locked_subtitle` (Body MD): 「AI 回覆 + 痛點判斷表 + 第二輪 prompt 在這下面，但你必須先寫完自己的猜測。」
  - `blurred_preview` (VisualPlaceholder)：用 CSS 顯示 phase_b_ai_review 的「結構輪廓」（H2、4 個 checkbox 框、textarea 框）但內容全部 blur(12px) 看不清
  - `design_explanation` (Body SM Italic): 「這不是 bug。我們刻意擋住，避免你被 AI 牽著走。」

**狀態**：locked / unlocked（淡出動畫 300ms，phase_b_ai_review 浮現）

**aria-hidden + 提示文字**讓螢幕閱讀器知曉。

#### Section 5: phase_b_ai_review（Phase A 完成後解鎖）

- **layout**: 全寬白底容器，padding 32px，最大寬 800px，**border-left 4px Verified Green**
- **elements**:
  - `section_title` (H2): "Phase B：讀 AI 回覆 + 對照差異"
  - `section_subtitle` (Body MD): "不是看 AI 對不對，是看 AI 看到了什麼你沒看到 / 漏了什麼你看到了。"
  - `ai_response_display` (AiResponseCard, monospace, 可滾動 max-height 400px)：從 `PainCard.ai_evidence.raw_response` 讀取顯示

##### `checkpoint_section` — 4 個 checkpoint

| Checkpoint | label | condition | data_path |
| :--- | :--- | :--- | :--- |
| 1. 它有沒有把人群切細？ | "✓ 通過" | 答案有具體職業 / 場景，不是「上班族」這種空話 | `self_guess.ai_checkpoints_passed.people_segmented` |
| 2. 它有沒有找到發生場景？ | "✓ 通過" | 至少 1 個可被觀察的場景（時間 + 地點 + 動作） | `self_guess.ai_checkpoints_passed.scenes_observable` |
| 3. 它有沒有提出現有解法的不滿？ | "✓ 通過" | 至少 3 個 workaround 各有不滿點 | `self_guess.ai_checkpoints_passed.workaround_dissatisfactions_listed` |
| 4. 它有沒有提醒哪些可能是假痛點？ | "✓ 通過" | 至少 1 個假痛點假設 | `self_guess.ai_checkpoints_passed.fake_pains_flagged` |

每個 checkpoint 為 Checkbox，使用者主動勾選（**不自動評估**，這是訓練「自己判斷 AI 回覆品質」的肌肉）。

##### `second_round_prompt_block` (AIPromptCopyBlock, monospace)

- title (H3): "第二輪追問 prompt（複製貼上回 AI）"
- subtitle: "AI 把上面的研究整理成一張『痛點判斷表』。"
- prompt_body（**逐字引用 worksheet 卡 7**）：

```
請把上面的研究整理成一張「痛點判斷表」。

欄位包含：
- 目標人群（具體職位/角色）
- 發生場景（時間+地點+動作）
- 發生頻率（一週/一月幾次）
- 現在解法（具體名稱）
- 主要不滿（分類）
- 可查證證據（連結或來源類型）
- 我應該訪談誰
- 訪談第一題

請用非常具體的中文，不要寫抽象名詞。

接著請挑出最值得優先研究的 1 個人群，並說明為什麼不是其他人群。
判斷標準只看痛點強度與證據，不看商業模式、不看技術可行性。
```
- copy_button: "複製第二輪 prompt"

##### `pain_judgment_table_input`

- label (H3): "貼上 AI 整理的痛點判斷表"
- input: Textarea (monospace, minLength 100, maxLength 10000)
- data_path: `self_guess.pain_judgment_table`

##### `deltas_section` — 3 個 deltas（**Card 7 核心反饋**）

| 欄位 | label | data_path | minLength |
| :--- | :--- | :--- | :- |
| biggest_diff | "我的猜測 vs AI 的答案，最大差異在" | `self_guess.deltas.biggest_diff` | 20 |
| ai_added | "AI 給我看到了什麼我沒想到的" | `self_guess.deltas.ai_added` | 20 |
| guess_unsupported | "我原本的猜測中，AI 證據沒支持的部分" | `self_guess.deltas.guess_unsupported` | 20 |

**狀態**：locked（隱藏）/ unlocked（淡入 300ms + slide-up 8px）/ filling / autosaved

**反模式禁令**（卡 7 最容易犯）：
- ❌ 不可使用「答對 / 答錯」「正確 / 錯誤」「分數」評判詞
- 用「差異」「補了 / 漏了」中性詞

#### Section 6: exit_gate（sticky bottom）

- 4 個 ExitGateCheck items：
  - check_1: 「Phase A 4 欄猜測已寫完」/ 自動勾選
  - check_2: 「4 個 AI checkpoint 全部通過」
  - check_3: 「3 個 deltas 都填寫完整」（每個 ≥ minLength 20）
  - check_4: 「有貼上 AI 痛點判斷表」（≥ 100 字）
- `cta_next` (Button Primary Large): "進入卡 8：真人訪談規劃 →" → `/learn/worksheet/08`
- `cta_back_to_card6` (Button Ghost, optional): "← 回去把卡 6 想清楚再來 補資訊"
- `help_link` (TextLink, optional): "我不知道怎麼填" → 開啟側邊 Drawer

---

### [INTERACTION & STATE FLOW]

#### 主要互動流程

1. 頁面載入 → 從 LocalStorage 讀 PainCard，渲染 Phase A + Phase B locked preview
2. 使用者在 Phase A 4 欄填寫 → 每 2 秒 autosave
3. 4 欄全部達 minLength → phase_a_complete_button 解鎖
4. 點 phase_a_complete_button → Phase A 變 readonly + 灰化 + Phase B 解鎖（淡入動畫）
5. Phase B 顯示 AI 回覆原文（從卡 6 raw_response 讀取）+ 4 checkpoint
6. 使用者勾選 checkpoint → 即時 autosave
7. 使用者點「複製第二輪 prompt」→ 寫入 clipboard
8. 使用者貼回 pain_judgment_table + 填 3 deltas → autosave
9. exit_gate 4 個 check 全通過 → cta_next 解鎖

#### Phase A → Phase B 解鎖機制（**Card 7 核心**）

- **強制條件**：4 欄 textarea 全部 ≥ minLength（10 字）才解鎖
- **不可繞過**：即使 LocalStorage 直接改 `self_guess.guesses.*`，Phase B 仍鎖（因為解鎖判定在前端 state，不純依資料）
- **不可回頭修改 Phase A**：解鎖 Phase B 後，Phase A 變 readonly。理由：避免使用者看到 AI 後回去修改猜測
- **例外**：使用者可從 stepper 回去把卡 6 想清楚再來，但會清空卡 7 所有資料 + 顯示確認 modal「退回會清空卡 7 進度，確定？」

#### 自動儲存策略

- LocalStorage debounce 2 秒
- Phase A 完成時間戳記寫入 `self_guess.phase_a_completed_at`（用於分析）

#### RWD

| 斷點 | 佈局 |
| :--- | :--- |
| Desktop (>1280px) | 完整體驗，Phase A / B 垂直堆疊；locked_preview blur 完整 |
| Tablet (768-1280px) | 同 Desktop，textarea 寬度縮小 |
| Mobile (<768px) | textarea 高度減半，checkpoint 改為堆疊；locked_preview 高度減為 200px |

---

### [DATA & API]

- **uses_api**: false（MVP 全部 LocalStorage）
- **localstorage_keys**: `painmap_worksheet:cards`
- **data_paths_written**:
  - `PainCard.self_guess.guesses.most_painful_person`
  - `PainCard.self_guess.guesses.most_common_scene`
  - `PainCard.self_guess.guesses.biggest_dissatisfaction`
  - `PainCard.self_guess.guesses.possible_fake_pain`
  - `PainCard.self_guess.ai_checkpoints_passed.people_segmented`（boolean）
  - `PainCard.self_guess.ai_checkpoints_passed.scenes_observable`
  - `PainCard.self_guess.ai_checkpoints_passed.workaround_dissatisfactions_listed`
  - `PainCard.self_guess.ai_checkpoints_passed.fake_pains_flagged`
  - `PainCard.self_guess.pain_judgment_table`（≥ 100 字）
  - `PainCard.self_guess.deltas.biggest_diff`
  - `PainCard.self_guess.deltas.ai_added`
  - `PainCard.self_guess.deltas.guess_unsupported`
  - `PainCard.current_step` → 8（過關後）
- **data_paths_read**:
  - `PainCard.complaint.*`、`people.*`、`stuck_formula.*`、`workaround.*` → 顯示 context_summary
  - `PainCard.ai_evidence.raw_response` → 顯示 ai_response_display
- **error_cases**:
  - 卡 6 raw_response 為空 → 「卡 6 還沒填完，請先回到卡 6 蒐集 AI 證據」+ 不可進入本頁
  - LocalStorage quota exceeded → 友善錯誤 + 建議匯出

---

### [EXIT GATE]

#### 反思問題

| # | 條件 | 自動判定 | 失敗訊息 |
| :- | :--- | :--- | :--- |
| 1 | Phase A 4 欄猜測已寫完 | `self_guess.guesses.*` 4 欄都 ≥ minLength 10 | 「Phase A 還沒寫完，請先猜」 |
| 2 | 4 個 AI checkpoint 全部通過 | `self_guess.ai_checkpoints_passed.*` 4 個都為 true | 「N 個 checkpoint 沒過，可以用第二輪 prompt 補」 |
| 3 | 有貼上 AI 痛點判斷表 | `pain_judgment_table.length >= 100` | 「請貼上第二輪 prompt 的回覆（痛點判斷表）」 |
| 4 | 3 個 deltas 都填寫完整 | `self_guess.deltas.*` 3 欄都 ≥ minLength 20 | 「請寫出『差異』，這是這張卡的核心」 |

#### 失敗路由

- 任一 checkpoint 未通過 → 留在當頁，顯示第二輪 prompt 引導
- 多個 checkpoint 未通過 + AI 回覆過於空泛 → 提示「回去把卡 6 想清楚再來 補更多細節」
- **回去把卡 6 想清楚再來 時清空卡 7 所有 self_guess 資料**（避免污染重來）

---

### [AI INTEGRATION]

- **AI 介入狀態**：✅ **第二輪追問 prompt（複製到外部 AI）**
- **AI 角色**：
  - ✅ 整理痛點判斷表（複製第二輪 prompt 到外部 AI）
  - ❌ 4 個 checkpoint 自動評估（讓使用者自己判斷）
  - ❌ 3 個 deltas 自動產生（**永久禁用**）
  - ❌ 評分使用者猜測（**永久禁用**）
- **內建 prompt**：第二輪 prompt 與 worksheet 卡 7 100% 一致，禁止改寫
- **不可在站內加任何「AI 自動完成 deltas」按鈕**（即使技術上可行）

#### worksheet 鐵律對應

| Worksheet 鐵律 | 軟體實作 |
| :--- | :--- |
| 「先寫下自己的猜測，再對照 AI 回覆」 | Phase A / B 兩段式 UI 強制執行 |
| 「差異就是你要學的地方」 | 3 deltas 欄位是必填 |
| 「AI 不能替你判斷對錯」 | checkpoint 必須使用者勾選；不自動 |
| 「先猜後看才會發現自己的盲區」 | Phase A 完成後 readonly，不可改猜測 |

---

### [OCTALYSIS HOOKS]

#### 主驅動力：#3 Empowerment of Creativity & Feedback（Mighty Creation Pedestal 教科書）

##### 設計實作 1: Phase A 強制 self-articulation
- 4 欄猜測必須先寫完才解鎖 AI 回覆
- 軟體層面：Phase B locked_preview 用 CSS blur **物理性遮蔽**，不只是文案提醒

##### 設計實作 2: 沒有「正確答案」校驗
- Phase A 4 欄沒有 AI 校對（不像卡 3 有 ai_polished）
- 沒有「猜對了 / 猜錯了」評分
- Creativity 的本質是「沒有對錯」

##### 設計實作 3: 反饋是「差異」，不是「分數」
- Phase B 核心產出是 3 deltas（差異），不是「你猜對 N 題」
- 差異引發反思，分數引發焦慮

##### 設計實作 4: 不可比較性（Anti Social Comparison）
- 不顯示其他使用者的猜測樣本
- 不顯示「平均使用者花多久」

#### 副驅動力：#1 Epic Meaning（隱含）

- 「不被 AI 牽著走」呼應品牌核心：判斷力訓練
- training_principle CalloutBox 強化使命感

#### 反模式檢查清單（Card 7 最容易犯，**必過全部不出現**）

- ❌ 顯示「猜對 N/4 題」進度條
- ❌ Phase A 提示「正確答案應該包含 X 元素」
- ❌ Phase B 解鎖時播放慶祝動畫（誤導：好像是闖關遊戲）
- ❌ 給「猜測準確度」徽章 / 點數
- ❌ 「最會猜的使用者排行榜」

---

## === EXCEPTION RULES ===

本頁面允許以下例外（已明確標記）：

1. **Phase A / Phase B 雙容器佈局**：違反全域「單欄為主」layout 原則。理由：兩段式 UI 是這張卡核心訓練機制，視覺分隔必須強烈。
2. **locked_preview blur 效果**：違反全域「不過度動畫」原則。理由：blur 是設計上的功能（物理遮蔽），不是裝飾。
3. **Phase A readonly after unlock**：違反一般「使用者隨時可改」原則。理由：避免使用者看到 AI 後回頭修改猜測，破壞訓練。

其餘設計決策完全遵循 Global Guideline。

---

## === OUTPUT REQUIREMENTS ===

### Step 1：結構確認

- 6 個 sections + 用途
- PainCard schema 對應：`self_guess.{guesses, ai_checkpoints_passed, pain_judgment_table, deltas}`
- 資料流：URL `?id` → 讀 LocalStorage（卡 1-6 給 context + raw_response）→ Phase A 4 欄 → 解鎖 Phase B → 4 checkpoint + pain_judgment_table + 3 deltas → exit gate
- 解鎖機制 pseudocode：
  ```
  Phase B unlocked = (
    guesses.most_painful_person.length >= 10 AND
    guesses.most_common_scene.length >= 10 AND
    guesses.biggest_dissatisfaction.length >= 10 AND
    guesses.possible_fake_pain.length >= 10 AND
    user clicked phase_a_complete_button
  )
  ```

### Step 2：設計決策說明

說明 3 個關鍵設計決策：
1. **為什麼 Phase B locked_preview 必須用 CSS blur 物理性遮蔽，而不是只用文案提醒？** — 95% 使用者會跳過文案提醒；blur 物理上阻止偷看 AI；這是 Mighty Creation Pedestal 的軟體實作核心
2. **Phase A 解鎖後變 readonly 的取捨** — 違反「使用者隨時可改」原則；但若允許修改，使用者看到 AI 後會「修正」猜測，破壞 self-articulation 訓練本意
3. **3 個 deltas 為何是「差異」而不是「分數」？** — 差異引發反思（reflection），分數引發焦慮（anxiety）；這是 #3 Empowerment 與 #2 偷渡 #5 比較的紅線

### Step 3：實作方案（Option A）

- `Card7SelfGuessPage.tsx`
- `StepperContext` / `CardIntro` / `PhaseAGuessForm` / `PhaseBLockedPreview` / `PhaseBAiReview` / `CheckpointList` / `SecondRoundPromptBlock` / `DeltasForm` / `ExitGate`
- `usePhaseLocking` hook（管理 Phase A → B 解鎖 state，front-end-state-based 不純資料）
- Zod schema for self_guess
- RWD Tailwind

### 品質檢查清單（部署前必過）

#### 通用
- [ ] 6 個 Section 依序渲染，stepper 顯示 current_step = 7
- [ ] Phase A 4 個 textarea 達 minLength 後 phase_a_complete_button 解鎖
- [ ] Phase A 完成後 Phase B locked_preview 淡出 + Phase B 解鎖
- [ ] Phase A 解鎖 Phase B 後變 readonly + 灰化（仍可閱讀）
- [ ] ai_response_display 正確從 `PainCard.ai_evidence.raw_response` 讀取顯示
- [ ] 4 個 checkpoint checkbox 可獨立勾選 + autosave
- [ ] **第二輪 prompt 與 worksheet 卡 7 100% 一致 + 「複製」功能正常**
- [ ] pain_judgment_table textarea 接受 ≥ 100 字輸入 + autosave
- [ ] 3 個 deltas 欄位達 minLength 20 後 exit_gate check 自動勾選
- [ ] exit_gate 4 個 check 全通過後 cta_next 解鎖
- [ ] 從 stepper 回去把卡 6 想清楚再來 → 顯示確認 modal「退回會清空卡 7 進度」+ 確認後清空
- [ ] LocalStorage 直接修改 `self_guess.guesses.*` 不能繞過 Phase B 鎖（前端 state 額外驗證）
- [ ] 鍵盤 Tab 順序：Phase A → unlock button → Phase B
- [ ] 無障礙：locked_preview blur 不影響螢幕閱讀器（aria-hidden + 提示文字）
- [ ] Phase A → Phase B 過渡動畫流暢（300ms，無閃爍）
- [ ] RWD 三斷點正確

#### Octalysis 黑帽掃描（生成程式碼後**必跑**，**Card 7 重點**）
- [ ] 是否出現分數 UI（「猜對 N/4」進度條）？→ 砍掉
- [ ] 是否有 streak / 連續打卡？→ 砍掉
- [ ] 是否有 loot box / 抽卡 / 神秘獎勵 / 慶祝動畫？→ 砍掉
- [ ] 是否有 FOMO 文案（「Phase B 限時 30 分鐘解鎖」）？→ 砍掉
- [ ] 是否有過期警告（「沒填完明天回來資料會消失」）？→ 砍掉
- [ ] 是否有排行榜（「最會猜的使用者排行榜」）？→ 砍掉
- [ ] 是否有「猜測準確度徽章」「點數」？→ 砍掉
- [ ] 是否提示「正確答案應該是 X」？→ 砍掉

#### 禁用詞掃描
- [ ] 全頁面零出現「猜對了 / 猜錯了 / 正確答案 / 準確度 / 猜測分數 / 闖關成功 / 解鎖成就 / 其他人都猜什麼 / AI 比你聰明」
- [ ] 用「差異」「補了 / 漏了」中性詞

---

**版本資訊**：Worksheet v1.0 ｜ Brand v1.0 ｜ 2026-05-02
