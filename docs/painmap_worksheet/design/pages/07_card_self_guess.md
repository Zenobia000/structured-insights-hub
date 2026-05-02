# Page-Level Spec: Card 7 — 自己先猜，再讀 AI 回覆

> 對應 worksheet「卡片 7 ｜ 自己先猜，再讀 AI 回覆」。  
> **這張卡是 Octalysis #3 Mighty Creation Pedestal 的教科書範例**。  
> 透過「強制 self-articulation」遮罩 AI 回覆，逼迫使用者先寫下自己的猜測；解鎖後再對照差異。  
> 訓練的不是「找答案」，而是「不被 AI 牽著走」的判斷力。

---

## [PAGE META]

- **page_name**: Card 7 — Self Guess Before AI
- **route_path**: `/learn/worksheet/07`
- **page_type**: worksheet_card
- **primary_goal**: 透過「先猜後看」兩段式 UI 訓練使用者的 self-articulation；產出 4 欄猜測 + 4 個 AI 檢查點通過 + AI 痛點判斷表 + 3 deltas 對照
- **secondary_goal**: 建立「AI 是補強，不是替代」的認知；訓練「比對差異」的反思習慣
- **target_users**:
  - 主要：剛跑完卡 6、還沒打開 AI 回覆的初學者
  - 次要：習慣「直接看 AI」的進階使用者（強制再學一次）
- **entry_point**: 卡 6 完成後自動推進；不可從 stepper 直接跳入（必須卡 6 通過才能進）
- **expected_time_on_page**: 12-20 分鐘（含猜測 5 分鐘 + 對照 10 分鐘）
- **prev_card**: `/learn/worksheet/06`（卡 6：AI 證據蒐集）
- **next_card**: `/learn/worksheet/08`（卡 8：真人訪談規劃）

---

## [DESIGN PHILOSOPHY: WHY MIGHTY CREATION PEDESTAL]

### 為什麼這張卡需要兩段式 UI

worksheet 卡 7 開頭原文：

> 「如果你**直接看 AI 回覆**，你會被它牽著走，失去自己的判斷力。  
> 訓練法：**先寫下自己的猜測，再對照 AI 回覆**。差異就是你要學的地方。」

這個訓練法的軟體實作必須做到「物理上阻止」使用者偷看 AI。如果只在文案層提醒「請先猜再看」，95% 的使用者會跳過猜測直接讀 AI。

**解法**：兩段式 UI（Phase A 鎖 / Phase B 解鎖）。Phase A 完成前，AI 回覆區塊以遮罩 + blur 方式呈現，看得到輪廓但讀不到內容。Phase A 4 欄填完才解鎖 Phase B。

### 這是 Octalysis #3 Mighty Creation Pedestal 的應用

**定義**：Empowerment of Creativity & Feedback — 讓使用者「先創造、再得到反饋」，而非「先看標準答案、再模仿」。

**為什麼是教科書範例**：
1. **強制 self-articulation 在前**：4 欄猜測必須先寫完，沒寫完看不到 AI
2. **創造性沒有對錯**：4 欄沒有「正確答案」校驗，使用者怎麼猜都通過 Phase A
3. **反饋來自對比，不來自評分**：解鎖後給的不是「你猜得對 / 錯」，而是「你和 AI 的差異是什麼」
4. **白帽動機**：訓練使用者的判斷肌肉，不是製造焦慮 / FOMO / 競爭

**禁止的反模式**：
- ❌ 不可在 Phase A 提示「正確答案應該是 X」（這會引誘使用者作弊）
- ❌ 不可在 Phase B 給「你猜對了 N/4」評分（這就變成測驗，不是訓練）
- ❌ 不可顯示「其他人都怎麼猜」（社會比較焦慮）

---

## [STRUCTURE: SECTIONS]

1. **stepper_context**
   - section_type: progress_stepper
   - section_purpose: 顯示 9 卡進度（current_step = 7）
2. **card_intro**
   - section_type: card_header
   - section_purpose: 用兩句話講清楚「這張為什麼要先猜」+ 顯示 Mighty Creation 設計理念（簡化版）
3. **phase_a_self_guess**（Phase A — 鎖定 AI 回覆）
   - section_type: structured_form
   - section_purpose: 4 欄猜測，必須先填才能解鎖 Phase B
4. **phase_b_locked_preview**（Phase A 期間顯示）
   - section_type: locked_preview
   - section_purpose: 以遮罩 + blur 方式展示 AI 回覆區塊輪廓，告知「填完上面才能解鎖」
5. **phase_b_ai_review**（Phase A 完成後解鎖）
   - section_type: comparison_panel
   - section_purpose: 顯示 AI 回覆 + 4 個 checkpoint checkbox + 第二輪追問 prompt + 3 deltas 欄
6. **exit_gate**
   - section_type: exit_gate
   - section_purpose: 反思問題 4 項勾選 + 「進入卡 8」CTA

---

## [SECTION COMPONENT SPEC]

### Section: stepper_context

- **layout**: 全寬 sticky top，淺色背景，高度 56px
- **elements**:
  - stepper: CardProgressStepper / required / 9 個圓點，第 7 個 active，第 1-6 個 completed，第 8-9 個 disabled
  - back_link: TextLink Ghost / required / 「← 卡 6」/ -> `/learn/worksheet/06`
  - autosave_indicator: Caption Muted / required / 「已自動儲存於本機 · HH:mm」
- **states**: default / hover（點擊回上一卡）
- **copy_constraints**: 不顯示完成度百分比

### Section: card_intro

- **layout**: 全寬白底容器，padding 32px，最大寬 800px 置中
- **elements**:
  - card_label: Caption / required / 「卡片 7 / 9」
  - title: H1 / required / 「自己先猜，再讀 AI 回覆」
  - one_liner: Body LG / required / 「如果你直接看 AI 回覆，你會被它牽著走，失去自己的判斷力。」
  - training_principle: CalloutBox Empowering / required /
    - icon: 🧠
    - title: 「為什麼要先猜？」
    - body: 「先寫下自己的猜測，再對照 AI 回覆。差異就是你要學的地方。AI 不是給你答案，是讓你看到自己的盲區。」
  - design_note: Body SM Italic / optional / 「填完下面 4 欄之前，AI 回覆會被遮住。這是設計上的刻意。」
- **states**:
  - default: 全部展開
  - collapsed: 進階使用者可收合 training_principle（LocalStorage 記偏好）
- **copy_constraints**: 標題 ≤ 14 字；one_liner ≤ 30 字中文

### Section: phase_a_self_guess

- **layout**: 全寬白底容器，最大寬 800px 置中；padding 32px；border-left 4px Teal #2D7D8A 強調這是「你的猜測區」
- **elements**:
  - section_title: H2 / required / 「Phase A：先寫你的猜測（不要偷看下面）」
  - section_subtitle: Body MD / required / 「花 2 分鐘寫，不要超過 5 分鐘。沒有對錯，怎麼猜都過關。」
  - timer_hint: Caption Muted / optional / 「建議花 2-5 分鐘」（**不是倒數計時器，只是文字建議**）
  - context_summary: ContextCard / required / 顯示卡 1-5 的關鍵資料摘要（折疊式）：
    - 抱怨原句（卡 1）
    - 主人翁背景（卡 2）
    - 卡關公式（卡 3）
    - 現在怎麼解（卡 4）
  - guess_form: GuessForm / required / 4 個欄位垂直堆疊
    - guess_painful_person:
      - label: H3 / required / 「我猜『最痛』的人是」
      - hint: Caption / required / 「從卡 4 的 workaround 推論：誰在花最多時間 / 錢 / 情緒解這件事？」
      - input: Textarea / required / minLength: 10 / maxLength: 200
      - data_path: `self_guess.guesses.most_painful_person`
    - guess_common_scene:
      - label: H3 / required / 「我猜『最常發生』的場景是」
      - hint: Caption / required / 「時間 + 地點 + 動作（例：週六晚上、家裡、寫家長信）」
      - input: Textarea / required / minLength: 10 / maxLength: 200
      - data_path: `self_guess.guesses.most_common_scene`
    - guess_biggest_dissatisfaction:
      - label: H3 / required / 「我猜『他現在最不滿』的點是」
      - hint: Caption / required / 「從卡 4 的不滿理由中挑你直覺最強的那個」
      - input: Textarea / required / minLength: 10 / maxLength: 200
      - data_path: `self_guess.guesses.biggest_dissatisfaction`
    - guess_possible_fake_pain:
      - label: H3 / required / 「我猜可能有 1 個假痛點是」
      - hint: Caption / required / 「我自己懷疑可能不是真的痛 / 可能會被現有工具解掉的部分」
      - input: Textarea / required / minLength: 10 / maxLength: 200
      - data_path: `self_guess.guesses.possible_fake_pain`
  - phase_a_complete_button: Button Primary / required / 「我猜完了，解鎖 Phase B →」/ disabled until 4 欄都達 minLength
- **states**:
  - default: 4 個 textarea 空白；button disabled
  - filling: 每欄達 minLength 後 label 旁出現 ✓ 微標記（小，不誇張）
  - all_filled: phase_a_complete_button 解鎖（變 Amber CTA）
  - completed: phase_a_complete_button 點擊後消失，4 個 textarea 變 readonly + 灰化（仍可閱讀，不可修改 — 避免使用者看到 AI 後改猜測）
- **copy_constraints**: label ≤ 14 字中文；hint ≤ 30 字；不可使用「正確答案」「應該猜什麼」等引導性詞
- **anti_pattern**:
  - ❌ 不可顯示「猜得越接近 AI 越好」這類訊息（這違反 self-articulation 訓練）
  - ❌ 不可顯示其他使用者的猜測樣本（社會比較）

### Section: phase_b_locked_preview（Phase A 期間顯示）

- **layout**: 全寬，容器 padding 32px，背景半透明 + backdrop-filter blur(8px)
- **elements**:
  - lock_icon: Icon / required / 🔒（中性灰色，非紅色警告）
  - locked_title: H2 / required / 「填完上面 4 欄就會解鎖」
  - locked_subtitle: Body MD / required / 「AI 回覆 + 痛點判斷表 + 第二輪 prompt 在這下面，但你必須先寫完自己的猜測。」
  - blurred_preview: VisualPlaceholder / required / 用 CSS 顯示 phase_b_ai_review 的「結構輪廓」（H2、4 個 checkbox 框、textarea 框）但內容全部 blur(12px) 看不清
  - design_explanation: Body SM Italic / required / 「這不是 bug。我們刻意擋住，避免你被 AI 牽著走。」
- **states**:
  - locked: 顯示遮罩 + blur preview
  - unlocked: 整個 section 移除（淡出動畫 300ms），phase_b_ai_review 浮現
- **copy_constraints**: locked_subtitle ≤ 50 字中文；不可使用「禁止」「不准」等強硬詞

### Section: phase_b_ai_review（Phase A 完成後解鎖）

- **layout**: 全寬白底容器，最大寬 800px 置中；padding 32px；border-left 4px Verified Green 強調「這是對照區」
- **elements**:
  - section_title: H2 / required / 「Phase B：讀 AI 回覆 + 對照差異」
  - section_subtitle: Body MD / required / 「不是看 AI 對不對，是看 AI 看到了什麼你沒看到 / 漏了什麼你看到了。」
  - ai_response_display: AiResponseCard / required / 從 `PainCard.ai_evidence.raw_response` 讀取並顯示，monospace 字體，可滾動，最大高度 400px
  - checkpoint_section:
    - subsection_title: H3 / required / 「先確認：AI 回覆有沒有過這 4 關？」
    - checkpoint_explainer: Body SM / required / 「沒過 → 用第二輪追問 prompt 補。」
    - checkpoints: CheckpointItem[4] / required
      - checkpoint_1_people_segmented:
        - label: Body Bold / required / 「✓ 它有沒有把人群切細？」
        - condition: Body SM / required / 「答案有具體職業 / 場景，不是『上班族』這種空話」
        - check_input: Checkbox / required / 「✓ 通過」
        - data_path: `self_guess.ai_checkpoints_passed.people_segmented`
      - checkpoint_2_scenes_observable:
        - label: Body Bold / required / 「✓ 它有沒有找到發生場景？」
        - condition: Body SM / required / 「至少 1 個可被觀察的場景（時間 + 地點 + 動作）」
        - check_input: Checkbox / required
        - data_path: `self_guess.ai_checkpoints_passed.scenes_observable`
      - checkpoint_3_workaround_dissatisfactions:
        - label: Body Bold / required / 「✓ 它有沒有提出現有解法的不滿？」
        - condition: Body SM / required / 「至少 3 個 workaround 各有不滿點」
        - check_input: Checkbox / required
        - data_path: `self_guess.ai_checkpoints_passed.workaround_dissatisfactions_listed`
      - checkpoint_4_fake_pains_flagged:
        - label: Body Bold / required / 「✓ 它有沒有提醒哪些可能是假痛點？」
        - condition: Body SM / required / 「至少 1 個假痛點假設」
        - check_input: Checkbox / required
        - data_path: `self_guess.ai_checkpoints_passed.fake_pains_flagged`
  - second_round_prompt_block: AiPromptCopyBlock / required（共用元件 `design/components/ai_prompt_copy_block.md`）
    - title: H3 / required / 「第二輪追問 prompt（複製貼上回 AI）」
    - subtitle: Body SM / required / 「AI 把上面的研究整理成一張『痛點判斷表』。」
    - prompt_body: PreformattedText / required / 從 worksheet 卡 7 萃取的完整 prompt：
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
    - copy_button: Button Primary / required / 「複製第二輪 prompt」
  - pain_judgment_table_input:
    - label: H3 / required / 「貼上 AI 整理的痛點判斷表」
    - input: Textarea / required / minLength: 100 / maxLength: 10000 / monospace 字體
    - data_path: `self_guess.pain_judgment_table`
  - deltas_section:
    - subsection_title: H3 / required / 「最重要：對照你的猜測 vs AI 的答案」
    - subsection_subtitle: Body MD / required / 「這 3 題是這張卡的核心。差異越具體，你學到越多。」
    - delta_inputs: DeltaForm / required / 3 個欄位
      - biggest_diff:
        - label: Body Bold / required / 「我的猜測 vs AI 的答案，最大差異在」
        - input: Textarea / required / minLength: 20
        - data_path: `self_guess.deltas.biggest_diff`
      - ai_added:
        - label: Body Bold / required / 「AI 給我看到了什麼我沒想到的」
        - input: Textarea / required / minLength: 20
        - data_path: `self_guess.deltas.ai_added`
      - guess_unsupported:
        - label: Body Bold / required / 「我原本的猜測中，AI 證據沒支持的部分」
        - input: Textarea / required / minLength: 20
        - data_path: `self_guess.deltas.guess_unsupported`
- **states**:
  - locked: section 整個隱藏（Phase A 未完成）
  - unlocked: 淡入動畫（300ms fade-in + slight slide-up 8px）
  - filling: 每個 checkpoint 勾選後，label 變 Verified Green
  - autosaved: 每 2 秒 debounce autosave
- **copy_constraints**: 不可使用「答對 / 答錯」「正確 / 錯誤」「分數」等評判詞；用「差異」「補了 / 漏了」等中性詞

### Section: exit_gate

- **layout**: 全寬 sticky bottom，白底容器，padding 24px，shadow-md
- **elements**:
  - exit_gate_check: ExitGateCheck / required
    - check_1: Checklist Item / 「4 個 AI checkpoint 全部通過」/ 自動勾選（依 4 個 checkbox 狀態）
    - check_2: Checklist Item / 「3 個 deltas 都填寫完整」/ 自動勾選（依 minLength）
    - check_3: Checklist Item / 「有貼上 AI 痛點判斷表」/ 自動勾選（依 pain_judgment_table.length >= 100）
    - check_4: Checklist Item / 「Phase A 4 欄猜測已寫完」/ 自動勾選（已被 Phase A 控制）
  - completion_status: Body MD / required / 「✓ 4/4 已通過」或「還差 N 項」
  - cta_next: Button Primary Large / required / 「進入卡 8：真人訪談規劃 →」/ -> `/learn/worksheet/08`
  - cta_back_to_card6: Button Ghost / optional / 「← 回去把卡 6 想清楚再來 補資訊」/ -> `/learn/worksheet/06`
  - help_link: TextLink Secondary / optional / 「我不知道怎麼填」/ 開啟側邊 Drawer
- **states**:
  - default: 4 個 check 都未勾選，cta_next disabled
  - all_passed: cta_next 變 Amber CTA + 微妙 scale(1.02)
  - failed_route: 任一 checkpoint 未通過 → 顯示「沒過 N 項。可以用第二輪 prompt 補強，或回去把卡 6 想清楚再來」
- **copy_constraints**: cta_next ≤ 18 字；不可用「恭喜」「達成」

---

## [INTERACTION & STATE FLOW]

### 主要互動流程

1. 頁面載入 → 從 LocalStorage 讀取 PainCard，渲染 Phase A 表單 + Phase B locked preview
2. 使用者在 Phase A 4 欄填寫 → 每 2 秒 autosave
3. 4 欄全部達 minLength → phase_a_complete_button 解鎖
4. 使用者點 phase_a_complete_button → Phase A 變 readonly + 灰化 + Phase B 解鎖（淡入動畫）
5. Phase B 顯示 AI 回覆原文（從卡 6 raw_response 讀取）+ 4 個 checkpoint
6. 使用者勾選 checkpoint → 即時 autosave
7. 使用者點「複製第二輪 prompt」→ 寫入 clipboard
8. 使用者貼回 pain_judgment_table + 填 3 個 deltas → autosave
9. exit_gate 4 個 check 全通過 → cta_next 解鎖

### Phase A → Phase B 解鎖機制

- **強制條件**：4 欄 textarea 全部 ≥ minLength（10 字）才能解鎖
- **不可繞過**：即使 LocalStorage 直接改 `self_guess.guesses.*` 欄位，Phase B 仍鎖（因為解鎖判定在前端 state，不純依資料）
- **不可回頭修改 Phase A**：解鎖 Phase B 後，Phase A 變 readonly。理由：避免使用者看到 AI 後回去修改猜測（這會破壞訓練本意）
- **例外**：使用者可從 stepper 回去把卡 6 想清楚再來，但會清空卡 7 所有資料 + 顯示確認 modal「退回會清空卡 7 進度，確定？」

### 自動儲存策略

- LocalStorage debounce 2 秒
- Phase A 完成時間戳記寫入 `self_guess.phase_a_completed_at`（用於分析使用者花多久猜）

### RWD 行為差異

| 斷點 | 佈局 | 差異說明 |
| --- | --- | --- |
| Desktop (>1280px) | 完整體驗，Phase A / B 垂直堆疊 | locked_preview blur 效果完整 |
| Tablet (768-1280px) | 同 Desktop，textarea 寬度縮小 | — |
| Mobile (<768px) | textarea 高度減半，checkpoint 改為堆疊 | locked_preview 高度減為 200px |

---

## [DATA & API]

- **uses_api**: false
- **localstorage_keys**:
  - `painmap_worksheet:cards`
- **data_paths_written**:
  - `PainCard.self_guess.guesses.most_painful_person`
  - `PainCard.self_guess.guesses.most_common_scene`
  - `PainCard.self_guess.guesses.biggest_dissatisfaction`
  - `PainCard.self_guess.guesses.possible_fake_pain`
  - `PainCard.self_guess.ai_checkpoints_passed.people_segmented`
  - `PainCard.self_guess.ai_checkpoints_passed.scenes_observable`
  - `PainCard.self_guess.ai_checkpoints_passed.workaround_dissatisfactions_listed`
  - `PainCard.self_guess.ai_checkpoints_passed.fake_pains_flagged`
  - `PainCard.self_guess.pain_judgment_table`
  - `PainCard.self_guess.deltas.biggest_diff`
  - `PainCard.self_guess.deltas.ai_added`
  - `PainCard.self_guess.deltas.guess_unsupported`
  - `PainCard.current_step` → 8（過關後）
- **data_paths_read**:
  - `PainCard.complaint.*`、`people.*`、`stuck_formula.*`、`workaround.*` → 顯示在 context_summary
  - `PainCard.ai_evidence.raw_response` → 顯示在 ai_response_display
- **error_cases**:
  - 卡 6 raw_response 為空 → 顯示「卡 6 還沒填完，請先回到卡 6 蒐集 AI 證據」+ 不可進入本頁
  - LocalStorage quota exceeded → 顯示友善錯誤 + 建議匯出

---

## [EXIT GATE]

### 反思問題（必須全部通過）

| # | 條件 | 自動判定邏輯 | 失敗訊息 |
| :- | :--- | :--- | :--- |
| 1 | Phase A 4 欄猜測已寫完 | `self_guess.guesses.*` 4 欄都 ≥ minLength | 「Phase A 還沒寫完，請先猜」 |
| 2 | 4 個 AI checkpoint 全部通過 | `self_guess.ai_checkpoints_passed.*` 4 個都為 true | 「N 個 checkpoint 沒過，可以用第二輪 prompt 補」 |
| 3 | 有貼上 AI 痛點判斷表 | `self_guess.pain_judgment_table.length >= 100` | 「請貼上第二輪 prompt 的回覆（痛點判斷表）」 |
| 4 | 3 個 deltas 都填寫完整 | `self_guess.deltas.*` 3 欄都 ≥ minLength | 「請寫出『差異』，這是這張卡的核心」 |

### 失敗路由

- 任一 checkpoint 未通過 → 留在當頁，顯示第二輪 prompt 引導
- 多個 checkpoint 未通過 + AI 回覆過於空泛 → 提示「回去把卡 6 想清楚再來 補更多細節」
- **回去把卡 6 想清楚再來 時清空卡 7 所有 self_guess 資料**（避免污染重來）

### 狀態機影響

- 過關時：`PainCard.status` → `in_progress`，`current_step` → 8

---

## [AI INTEGRATION]

### AI 介入策略

| 項目 | 是否使用 AI | 說明 |
| :--- | :--- | :--- |
| 整理痛點判斷表 | ✅ 使用者複製第二輪 prompt 到外部 AI | 與卡 6 同樣是 prompt-copy 策略 |
| 4 個 checkpoint 自動評估 | ❌ 不做（讓使用者自己判斷） | 因為這是訓練「自己判斷 AI 回覆品質」的肌肉，不可外包給系統 |
| 3 個 deltas 自動產生 | ❌ 永久禁用 | 違反 worksheet 鐵律：「替你判斷對錯」是 AI 不能做的事 |
| 評分使用者猜測 | ❌ 永久禁用 | 違反 brand + Mighty Creation 原則 |

### Prompt 工程原則

- 第二輪 prompt 與 worksheet 卡 7 100% 一致
- 不可在站內加任何「AI 自動完成 deltas」按鈕（即使技術上可行，也違反訓練本意）

### 鐵律對應 worksheet

| Worksheet 鐵律 | 軟體實作 |
| :--- | :--- |
| 「先寫下自己的猜測，再對照 AI 回覆」 | Phase A / B 兩段式 UI 強制執行 |
| 「差異就是你要學的地方」 | 3 deltas 欄位是必填 |
| 「AI 不能替你判斷對錯」 | checkpoint 必須使用者勾選；不自動 |
| 「先猜後看才會發現自己的盲區」 | Phase A 完成後 readonly，不可改猜測 |

---

## [OCTALYSIS HOOKS]

### 主驅動力：#3 Empowerment of Creativity & Feedback（Mighty Creation Pedestal）

**這是教科書範例，必須詳細說明**：

#### 設計實作 1: Phase A 強制 self-articulation

- 4 欄猜測必須先寫完才能解鎖 AI 回覆
- 設計理由：Mighty Creation 的核心是「使用者先創造，再得到反饋」。如果直接給 AI 回覆，使用者就只是 receiver；先猜後看，使用者是 creator
- 軟體層面：Phase B locked_preview 用 CSS blur 物理性遮蔽，不只是文案提醒

#### 設計實作 2: 沒有「正確答案」校驗

- Phase A 4 欄沒有 AI 校對（不像卡 3 有 ai_polished）
- 沒有「猜對了 / 猜錯了」評分
- 設計理由：Creativity 的本質是「沒有對錯」。如果系統替使用者打分，就破壞了 Empowerment

#### 設計實作 3: 反饋是「差異」，不是「分數」

- Phase B 的核心產出是 3 deltas（差異），不是「你猜對 N 題」
- 設計理由：差異引發反思（reflection），分數引發焦慮（anxiety）

#### 設計實作 4: 不可比較性（Anti Social Comparison）

- 不顯示其他使用者的猜測樣本
- 不顯示「平均使用者花多久」
- 設計理由：Mighty Creation 是個人創造，不是群體競爭

### 副驅動力：#1 Epic Meaning & Calling（隱含）

- 「不被 AI 牽著走」這個敘事呼應品牌核心：判斷力訓練
- training_principle CalloutBox 強化使命感

### 永久禁用驅動力

| 驅動力 | 為什麼這裡會誘惑出現 | 守則 |
| :--- | :--- | :--- |
| #6 Scarcity & Impatience | 「Phase B 限時 30 分鐘解鎖」 | 完全不出現 |
| #7 Unpredictability | 「Phase B 解鎖後會看到驚喜內容」 | 完全不出現，預覽 blur 但結構透明 |
| #8 Loss Avoidance | 「沒填完明天回來資料會消失」 | 完全不出現 |

### 反模式檢查清單（卡 7 最容易犯）

- ❌ 顯示「猜對 N/4 題」進度條
- ❌ Phase A 提示「正確答案應該包含 X 元素」
- ❌ Phase B 解鎖時播放慶祝動畫（誤導：好像是闖關遊戲）
- ❌ 給「猜測準確度」徽章 / 點數
- ❌ 「最會猜的使用者排行榜」

詳見 `references/anti_gamification_guardrails.md`。

---

## [EXCEPTION TO GLOBAL RULES]

- **Phase A / Phase B 雙容器佈局**：違反全域「單欄為主」的 layout 原則。理由：兩段式 UI 是這張卡的核心訓練機制，視覺分隔必須強烈
- **locked_preview blur 效果**：違反全域「不過度動畫」原則。理由：blur 是設計上的功能（物理遮蔽），不是裝飾
- **Phase A readonly after unlock**：違反一般「使用者隨時可改」原則。理由：避免使用者看到 AI 後回頭修改猜測，破壞訓練

---

## [BRAND LANGUAGE RULES (PAGE-SPECIFIC)]

### 禁止用語

| 禁止 | 理由 |
| :--- | :--- |
| 「猜對了 / 猜錯了」「正確答案」 | 違反 Mighty Creation Pedestal — 沒有對錯 |
| 「準確度」「猜測分數」 | 違反 brand 禁令 |
| 「闖關成功」「解鎖成就」 | 遊戲化 — 違反 brand |
| 「其他人都猜什麼」 | 社會比較焦慮 |
| 「AI 比你聰明」 | 貶低使用者 — 違反 Empowerment |

### 建議用語

| 建議 | 場景 |
| :--- | :--- |
| 「你的猜測」 | Phase A |
| 「對照差異」 | Phase B |
| 「AI 補了 / 漏了什麼」 | deltas 區 |
| 「沒過這 4 關」 | checkpoint 未過 |
| 「先猜後看」 | 訓練法描述 |

### 語調

- **Empowering**：「你來判斷 AI 的回覆夠不夠好」
- **Calm**：Phase A locked_preview 用「填完就會解鎖」非「禁止偷看」
- **Anti-anxiety**：3 deltas 框住的是學習，不是評分

---

## [ACCEPTANCE CRITERIA]

- 6 個 Section 依序正確渲染，stepper 顯示 current_step = 7
- Phase A 4 個 textarea 達 minLength 後，phase_a_complete_button 解鎖
- Phase A 完成後，Phase B locked_preview 淡出 + Phase B 解鎖
- Phase A 解鎖 Phase B 後變 readonly + 灰化（仍可閱讀）
- ai_response_display 正確從 `PainCard.ai_evidence.raw_response` 讀取並顯示
- 4 個 checkpoint checkbox 可獨立勾選 + autosave
- 第二輪 prompt 與 worksheet 卡 7 100% 一致 + 「複製」功能正常
- pain_judgment_table textarea 接受 ≥ 100 字輸入 + autosave
- 3 個 deltas 欄位達 minLength 後 exit_gate check 自動勾選
- exit_gate 4 個 check 全通過後，cta_next 解鎖
- 從 stepper 回去把卡 6 想清楚再來 → 顯示確認 modal「退回會清空卡 7 進度」+ 確認後清空
- LocalStorage 直接修改 `self_guess.guesses.*` 不能繞過 Phase B 鎖（前端 state 額外驗證）
- 不出現禁用語（「猜對 / 猜錯」「準確度」「闖關」等）
- 不出現倒數計時器 / 進度百分比 / 排行榜元素
- RWD 三斷點佈局正確
- 鍵盤操作：Tab 順序遵循 Phase A → unlock button → Phase B
- 無障礙：locked_preview blur 不影響螢幕閱讀器（aria-hidden + 提示文字）
- Phase A → Phase B 過渡動畫流暢（300ms，無閃爍）
