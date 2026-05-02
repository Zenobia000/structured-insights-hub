# Exit Gates Matrix — 9 卡過關條件 + 失敗路由矩陣

> **真相源**：
> - `docs/workshop/painpoint_beginner_worksheet.md` v1.0 各卡的「🚦 過關條件」段落
> - `docs/painmap_worksheet/product/data_model.md` v1.0 第 192-204 行「過關條件對應」
>
> **本檔角色**：把 worksheet 的「🚦 過關條件」翻譯成可程式化規則，對齊 PainCard schema 欄位，並設計失敗時的回退路由與友善提示文案。
>
> **設計鐵律**：每一張卡的 exit gate 都對應到 PainCard 的具體欄位驗證；不允許任何卡用「使用者自行勾選通過」就過關。

---

## 0. 設計原則

### 0.1 卡片狀態機

```
draft (卡 1 開始)
  ↓ pass exit-gate-1
in_progress (卡 2)
  ↓ pass exit-gate-2 ... ↓ pass exit-gate-8
in_progress (卡 9)
  ↓ pass exit-gate-9
structured (verdict=true_pain)
  | archived_fake (verdict=fake_pain)
  | pending_interview (verdict=pending_interview)
```

### 0.2 三層驗證

| 層級 | 範圍 | 範例 |
| :--- | :--- | :--- |
| L1：欄位驗證 | 必填 / 長度 / enum | `complaint.verbatim` 非空、長度 ≥ 10 字 |
| L2：內容反偵測 | 規則式驗證（見 `pain_card_schema.md` Rule 2） | 不可包含「我覺得」「應該需要」 |
| L3：跨欄位一致性 | 多欄位邏輯 | 卡 6 第 8 題訪談對象與卡 8 訪談人選需有交集 |

### 0.3「擋過關」 vs 「警告但放行」決策樹

```
這個驗證失敗會讓使用者拿到錯誤的「真痛點」結論嗎？
├── 是 → 擋過關（HARD GATE）
└── 否 → 警告但放行（SOFT WARNING）
        └── 但是是不是會誤導下一張卡？
              ├── 是 → 擋過關
              └── 否 → 警告
```

> 寫卡片時若不確定要不要擋，預設用 HARD GATE。worksheet 設計就是「擋住勝過放行」。

---

## 1. 9 張卡片過關條件矩陣

下表每張卡都列：worksheet 原始條件、對應 PainCard 欄位、L1/L2/L3 驗證、擋過關 or 警告。

### 卡 1 ｜ 抱怨原句

| Source | 條件原文（worksheet 第 84-87 行） |
| :--- | :--- |
| 過關條件 | 寫的是**原句**，不是你的解釋；至少有 1 個**有名字的真人** |

| ID | 規則 | 欄位 | 層級 | 行為 |
| :--- | :--- | :--- | :--- | :--- |
| G1.1 | `complaint.verbatim` 非空且長度 ≥ 10 字 | `complaint.verbatim` | L1 | 擋 |
| G1.2 | `complaint.source_name` 非空 | `complaint.source_name` | L1 | 擋 |
| G1.3 | `complaint.source_relation` 非空 | `complaint.source_relation` | L1 | 擋 |
| G1.4 | `complaint.datetime` 非空 | `complaint.datetime` | L1 | 擋 |
| G1.5 | `complaint.scene` 非空 | `complaint.scene` | L1 | 擋 |
| G1.6 | `complaint.verbatim` 不可包含「我覺得」「應該需要」「也許」「可能」「大概」 | `complaint.verbatim` | L2 | 擋 |
| G1.7 | `complaint.source_name` 不可為「同學 A」「老師 B」「某人」「朋友」這類代稱（需含真名特徵） | `complaint.source_name` | L2 | 警告 |

**擋過關 vs 警告**：
- G1.1-1.6 全部 HARD（worksheet 明白擋）
- G1.7 SOFT（有些情境只記得綽號；提示「最好補上真名」但放行）

---

### 卡 2 ｜ 三個有名字的人

| Source | 過關條件原文（worksheet 第 127-129 行） |
| :--- | :--- |
| 過關條件 | 3 個都有真名（不是「補習班老師 A」）；你**今天**就能聯絡到至少 1 位 |

| ID | 規則 | 欄位 | 層級 | 行為 |
| :--- | :--- | :--- | :--- | :--- |
| G2.1 | `people.background` 非空 | `people.background` | L1 | 擋 |
| G2.2 | `people.list.length === 3`（嚴格 3 筆） | `people.list` | L1 | 擋 |
| G2.3 | 每筆 `people.list[*].name` 非空 | — | L1 | 擋 |
| G2.4 | 每筆 `people.list[*].contact` 非空 | — | L1 | 擋 |
| G2.5 | 每筆 `people.list[*].relation` 非空 | — | L1 | 擋 |
| G2.6 | 每筆 `people.list[*].name` 不為「補習班老師 A / 同學 B / 用戶 C」等代稱 pattern | — | L2 | 擋 |
| G2.7 | 至少 1 筆 `contact` 是「今天就能聯絡」的形式（LINE ID / 電話 / Email；不是「以後再加」） | — | L2 | 警告 |

**worksheet 鐵律**：「AI 不能幫忙生 persona」（第 122 行）— 此頁前端必須完全禁用 AI 提案按鈕。

---

### 卡 3 ｜ 卡關公式

| Source | 過關條件原文（worksheet 第 178-180 行） |
| :--- | :--- |
| 過關條件 | 句子裡的兩個空格都**很具體**（不是「卡在效率不好」這種空話）；AI 列的「需要再問清楚」你能回答（或預約找主人翁問） |

| ID | 規則 | 欄位 | 層級 | 行為 |
| :--- | :--- | :--- | :--- | :--- |
| G3.1 | `stuck_formula.user_draft` 非空 | `stuck_formula.user_draft` | L1 | 擋 |
| G3.2 | `stuck_formula.confirmed === true`（使用者已確認版本） | `stuck_formula.confirmed` | L1 | 擋 |
| G3.3 | `stuck_formula.user_draft` 含「我每次要 ___」「卡在 ___」兩個語意位置（regex 校驗） | `stuck_formula.user_draft` | L2 | 警告 |
| G3.4 | 兩個空格內不可為抽象詞「效率不好 / 不順 / 太慢 / 太忙」單詞 | `stuck_formula.user_draft` | L2 | 警告 |
| G3.5 | 若 `ai_clarifying_questions.length > 0`，UI 須顯示「你能回答這 N 題嗎？□ 可以 □ 待問主人翁」（記入 metadata，不擋） | `stuck_formula.ai_clarifying_questions` | L3 | 紀錄 |

> ⚠️ G3.4 抓不出所有空話，因此採 SOFT WARNING；當使用者堅持送出，UI 仍顯示一行：「你寫的可能還太抽象，再去問主人翁一次會更穩。」

---

### 卡 4 ｜ 現在怎麼解

| Source | 過關條件原文（worksheet 第 232-234 行） |
| :--- | :--- |
| 過關條件 | 主人翁現在用的方法**有具體名字**；你能說出 **3 個他不滿意現有方法的具體理由** |

| ID | 規則 | 欄位 | 層級 | 行為 |
| :--- | :--- | :--- | :--- | :--- |
| G4.1 | `workaround.tool_name` 非空 | `workaround.tool_name` | L1 | 擋 |
| G4.2 | `workaround.tool_name` 不為「沒人解過 / 還沒解 / 自己想辦法 / 沒有」 | `workaround.tool_name` | L2 | 擋 |
| G4.3 | `workaround.user_dissatisfactions.length >= 3` | `workaround.user_dissatisfactions` | L1 | 擋 |
| G4.4 | 每個 dissatisfaction 字串長度 ≥ 5 字（避免「不好」「太慢」這種佔位） | — | L2 | 警告 |
| G4.5 | `workaround.why_still_stuck` 非空 | `workaround.why_still_stuck` | L1 | 擋 |

> worksheet 對「沒人解過」「會自己想辦法」的處置寫在 prompt 的規則 2（第 209 行）；此處 G4.2 擋住使用者層的同類答案。

---

### 卡 5 ｜ 兩件事不能同時要（TRIZ）

| Source | 過關條件原文（worksheet 第 290-292 行） |
| :--- | :--- |
| 過關條件 | **只選 1 個**（複選代表你還沒拆乾淨，退回卡片 3）；A、B 兩端都**具體**（不是抽象詞） |

| ID | 規則 | 欄位 | 層級 | 行為 |
| :--- | :--- | :--- | :--- | :--- |
| G5.1 | `contradiction.triz_id ∈ {1, 2, 3, 4, 5, 6}`（單選） | `contradiction.triz_id` | L1 | 擋 |
| G5.2 | `contradiction.side_a` 非空且長度 ≥ 8 字 | `contradiction.side_a` | L1 | 擋 |
| G5.3 | `contradiction.side_b` 非空且長度 ≥ 8 字 | `contradiction.side_b` | L1 | 擋 |
| G5.4 | `contradiction.sacrificed ∈ {'a', 'b'}` | `contradiction.sacrificed` | L1 | 擋 |
| G5.5 | A 端 / B 端不可為「品質好 / 速度快 / 成本低」單詞抽象描述（需含具體場景或量化） | — | L2 | 警告 |

> UI 設計：選擇控件本身就是 radio button（單選），透過 UI 阻擋複選（規則 G5.1 在 UI 層強制）。

---

### 卡 6 ｜ AI 證據蒐集

| Source | 過關條件原文（worksheet 第 347-350 行） |
| :--- | :--- |
| 過關條件 | AI 回了一份結構化證據（8 題都有答）；AI 沒有開始推薦解決方案／工具／App；你把 AI 的回覆**整段**存下來 |

| ID | 規則 | 欄位 | 層級 | 行為 |
| :--- | :--- | :--- | :--- | :--- |
| G6.1 | `ai_evidence.ai_tool ∈ {'chatgpt_dr', 'claude', 'perplexity', 'gemini'}` | `ai_evidence.ai_tool` | L1 | 擋 |
| G6.2 | `ai_evidence.ai_tool_reason` 非空 | `ai_evidence.ai_tool_reason` | L1 | 擋 |
| G6.3 | `ai_evidence.eight_answers` 全 8 題非空 | `ai_evidence.eight_answers.q1..q8` | L1 | 擋 |
| G6.4 | `ai_evidence.raw_response` 非空且長度 ≥ 200 字 | `ai_evidence.raw_response` | L1 | 擋 |
| G6.5 | `ai_evidence.no_solution_check_passed === true` | `ai_evidence.no_solution_check_passed` | L1 | 擋 |
| G6.6 | `raw_response` 不含「你應該開發」「建議製作 App」「可以做成 SaaS」等字串（自動偵測） | `ai_evidence.raw_response` | L2 | 自動將 G6.5 設為 false，提示重跑 |

> ⚠️ G6.6 若觸發 → 系統自動把 `no_solution_check_passed` 設為 false，UI 顯示補強 prompt 按鈕（見 `ai_prompt_library.md §4.8`）。

---

### 卡 7 ｜ 自己先猜 + 讀 AI

| Source | 過關條件原文（worksheet 第 417-420 行） |
| :--- | :--- |
| 過關條件 | 4 個檢查點全部通過；你寫得出「猜測 vs AI 的差異」；你有一張**痛點判斷表**（AI 整理的） |

| ID | 規則 | 欄位 | 層級 | 行為 |
| :--- | :--- | :--- | :--- | :--- |
| G7.1 | `self_guess.guesses` 4 欄全填（最痛的人 / 場景 / 不滿 / 假痛點） | `self_guess.guesses.*` | L1 | 擋 |
| G7.2 | 4 個 `ai_checkpoints_passed.*` 全 true | `self_guess.ai_checkpoints_passed.*` | L1 | 擋 |
| G7.3 | `self_guess.pain_judgment_table` 非空（AI 已產出表格） | `self_guess.pain_judgment_table` | L1 | 擋 |
| G7.4 | `self_guess.deltas` 3 欄全填 | `self_guess.deltas.*` | L1 | 擋 |
| G7.5 | UI 強制：使用者必須先填完 `guesses` 才能看到 AI 整理的判斷表（時序鎖） | — | L3 | UI 強制 |

> G7.5 是 **worksheet 第 425-427 行的核心訓練設計**：「先猜後看，你才會發現 AI 補了什麼 / 漏了什麼」。前端必須做時序鎖：`guesses` 全填 → 解鎖「請 AI 整理」按鈕。

---

### 卡 8 ｜ 真人訪談規劃

| Source | 過關條件原文（worksheet 第 491-494 行） |
| :--- | :--- |
| 過關條件 | 列出至少 1 位**有名字**或**有具體聯絡管道**的訪談對象；寫出 3 個訪談題（不是推銷題）；知道訪談時**不要做什麼** |

| ID | 規則 | 欄位 | 層級 | 行為 |
| :--- | :--- | :--- | :--- | :--- |
| G8.1 | `interview_plan.targets.length >= 1` | `interview_plan.targets` | L1 | 擋 |
| G8.2 | 每筆 target 的 `persona` 非空 + 有 `contact_known === true` 配 `contact_info` 真名，或 `contact_known === false` 配「具體去哪找」 | — | L1 | 擋 |
| G8.3 | `interview_plan.questions.length === 3` | `interview_plan.questions` | L1 | 擋 |
| G8.4 | 每題 `questions[i]` 不可為推銷題型（不含「會付錢嗎」「你會用嗎」「如果有 ___ 你會 ___」） | — | L2 | 擋 |
| G8.5 | `interview_plan.interview_taboos_understood === true`（使用者勾選「我看過訪談禁忌」） | `interview_plan.interview_taboos_understood` | L1 | 擋 |
| G8.6 | `interview_plan.targets[*].persona` 應與 `ai_evidence.eight_answers.q8_interview_targets` 列出的 5 種人有交集 | — | L3 | 警告 |

> G8.4 推銷題型偵測 keywords（黑名單）：`會付錢`、`會用嗎`、`如果有...你會`、`你覺得我做`、`你願意付`、`想不想要`、`覺得這個產品`。

---

### 卡 9 ｜ Pain Quality Score + 真假判斷

| Source | 過關條件原文（worksheet 第 550-553 行） |
| :--- | :--- |
| 過關條件 | 5 個維度都有打分；真假判斷有書面理由（不是想想就過）；寫出「下一步要做什麼」 |

| ID | 規則 | 欄位 | 層級 | 行為 |
| :--- | :--- | :--- | :--- | :--- |
| G9.1 | `verdict.scores.*` 5 維度全 1-5 分 | `verdict.scores.*` | L1 | 擋 |
| G9.2 | `verdict.judgment ∈ {'true_pain', 'fake_pain', 'pending_interview'}` | `verdict.judgment` | L1 | 擋 |
| G9.3 | `verdict.reason_100w` 非空且長度 ≥ 100 字 | `verdict.reason_100w` | L1 | 擋 |
| G9.4 | `verdict.most_confident_evidence` 非空 | `verdict.most_confident_evidence` | L1 | 擋 |
| G9.5 | `verdict.least_confident` 非空 | `verdict.least_confident` | L1 | 擋 |
| G9.6 | `verdict.next_action ∈ {'interview', 'more_evidence', 'change_topic'}` | `verdict.next_action` | L1 | 擋 |
| G9.7 | 若 `verdict.judgment === 'true_pain'` 且 `verdict.scores.evidence_credibility < 3`，系統提示「證據不足以判真，建議改為 pending_interview」 | — | L3 | 警告 |
| G9.8 | 教學模式可顯示 `verdict.total_score`；生產模式不對外輸出（pain_card_schema.md R4.1）。 | — | L3 | 模式守則 |

> ⚠️ 卡 9 不可有 AI 按鈕。判斷必須由使用者寫（worksheet 第 619 行：「替你判斷真假」是不可做的事）。

---

## 2. 失敗路由表（Failure Routing）

worksheet 的核心 UX 設計：每張卡失敗都有明確回退方向，告訴使用者「不是你不夠努力，是上一步還沒做到位」。

### 2.1 路由規則總覽

| 失敗卡 | 回退到 | 對應欄位行為 | 友善文案 |
| :--- | :--- | :--- | :--- |
| 卡 1 | 不可進卡 2 | `current_step` 不變 | 「先把抱怨原句寫完，3 個必填欄位都要有真實內容。下一步先重看一次原句。」 |
| 卡 2 | 回卡 1（你還沒接觸真人） | `current_step` 退回 1，保留資料 | 「找不到 3 個真人，代表這個圈子你還不熟。先去這群人聚集的地方混 1-2 週再回來，你的痛點會變得更清楚。」 |
| 卡 3 | 回卡 1（沒問清楚） | `current_step` 退回 1 | 「卡關公式還太抽象，代表抱怨原句裡的細節不夠。回去找說這句話的人，再聊 10 分鐘把場景問清楚。」 |
| 卡 4 | 回卡 1（這個人沒在花時間解） | `current_step` 退回 1 | 「他其實沒在花時間解這個問題，可能還沒到痛點門檻。回卡 1 換一個更有花時間在解的人。」 |
| 卡 5 | 回卡 3（拆得不夠細） | `current_step` 退回 3，保留卡 1-4 | 「6 個矛盾都不像，代表卡關公式還沒拆乾淨。回卡 3 把句子拆成更具體的兩個動詞或兩個目標。」 |
| 卡 6（AI 進入 solution mode） | 補強 prompt 重跑（不退卡） | `no_solution_check_passed = false` | 「AI 開始推銷產品了。點『重跑』使用補強 prompt，把 AI 拉回證據蒐集模式。」 |
| 卡 6（AI 答得太空泛） | 補卡 1-5 細節再跑 | 不退卡 | 「AI 給的太籠統，請回卡 1-5 補上更具體的細節（例如：人是誰、什麼場景、現在用什麼），再回來重跑。」 |
| 卡 7（4 檢查點未過） | 回卡 6 補資訊 | `current_step` 退回 6 | 「AI 給的證據不夠細。回卡 6 用補強 prompt 重跑，補上人群 / 場景 / 不滿 / 假痛點。」 |
| 卡 8 | 回卡 2（你還沒進入這個社群） | `current_step` 退回 2 | 「列不出真人訪談對象，代表這個社群你還沒進去。先回卡 2 補上 3 個有名字的人，再回來規劃訪談。」 |
| 卡 9 | 重新審視卡 1-8 | 不強制退卡 | 「分數很低或無法下判斷，是正常的。先看哪一維度最弱，回去補那張卡。例如『證據可信度』低就回卡 6 / 7 補。」 |

### 2.2 失敗路由 — 視覺化決策樹

```
卡 X 失敗
  ↓
這是「資料不全」(L1) 失敗嗎？
  ├── 是 → 留在卡 X，標出哪個欄位沒填
  └── 否
      ↓
這是「內容不夠具體」(L2) 失敗嗎？
  ├── 是 →
  │     ├── 卡 1, 2, 4 → 回卡 1（從真人源頭重來）
  │     ├── 卡 3 → 回卡 1（去問主人翁）
  │     ├── 卡 5 → 回卡 3（拆得不夠細）
  │     ├── 卡 6 → 不退卡，跑補強 prompt
  │     ├── 卡 7 → 回卡 6（補資訊重跑）
  │     ├── 卡 8 → 回卡 2（沒進入社群）
  │     └── 卡 9 → 重新審視卡 1-8（最弱維度先補）
  └── 否（L3 跨欄位不一致）
      ↓
顯示警告 + 「我了解，繼續」按鈕（不擋過關，但要使用者確認）
```

### 2.3 退卡時的資料行為

| 行為 | 規則 |
| :--- | :--- |
| 退卡時保留已填欄位 | 是。退到卡 N 不會刪除卡 N+1...M 的資料；標記為 `stale=true`。 |
| 重新進入卡 N+1 時 | 提示「你回退過卡 N，這張卡的內容可能需要更新」+ 一鍵「保留 / 清空 / 編輯」三選項 |
| 卡 9 完成後再回退 | 將 `verdict.*` 全部清空，`status` 退回 `in_progress` |
| 完成的痛點身份證再回退 | 不允許（卡 10 已匯出代表已 final）— 若使用者一定要改，提示「請建立新的 PainCard」 |

### 2.4 友善提示文案（與 brand voice 對齊）

每個失敗訊息都遵守：

1. 用「你」稱呼，不用「使用者 / 用戶」
2. 先說發生什麼（事實），再說怎麼修（行動）
3. 不出現「錯了」「失敗」「不及格」這類評判詞
4. 不出現分數 / 等級 / 排名
5. 不出現「FOMO 字眼」（沒有「再不做就...」「過期...」「機會錯過...」）

**範本**：

```
[訊號圖示] 這張卡還缺一些資訊。

具體是：[列出哪個欄位缺什麼]

下一步建議：[具體行動]
（例如：「回卡 N 把 ___ 補上，5 分鐘可以做完。」）

[主按鈕：去補資料] [次要按鈕：先存草稿]
```

---

## 3. 「擋過關」 vs 「警告但放行」決策守則

### 3.1 何時擋（HARD GATE）

- 必填欄位空缺（L1）
- 內容違反明確規則（如卡 4「沒人解過」、卡 8 推銷題）
- 時序錯誤（如卡 7 還沒寫猜測就要看 AI 答案）
- 跨欄位邏輯衝突且會誤導下一卡（如 `judgment === 'true_pain'` 但 `evidence_credibility === 1`）

### 3.2 何時警告（SOFT WARNING）

- 內容可能過度抽象但 L2 規則無法 100% 抓出
- 非結構性建議（例如「你可以補真名會更好」）
- 跨欄位差異但不影響下一卡邏輯

### 3.3 警告呈現方式

```
┌────────────────────────────────────────┐
│ [Caution Icon]                         │
│ 這個內容可能還可以更具體               │
│                                          │
│ 你目前寫的：「卡在效率不好」             │
│ 建議補上：發生時的具體動作或時間量化     │
│                                          │
│ [我了解，先送出] [回去再想想]            │
└────────────────────────────────────────┘
```

> 顏色：使用 `--color-caution: #D97706`（PainMap brand），不使用大面積紅色。

---

## 4. 進階：例外與覆寫

### 4.1 「我知道我在做什麼」覆寫權

- 卡 1 / 卡 2 / 卡 5 / 卡 9：**不允許覆寫**。這是訓練判斷力的核心，繞過會破壞訓練意義。
- 卡 3 / 卡 4 / 卡 6 / 卡 7 / 卡 8：允許 SOFT WARNING 覆寫，但會在 PainCard metadata 標記 `overrode_warning: ['G3.4', 'G4.4']`，匯出時保留。

### 4.2 教學模式 vs 生產模式的閘門差異

| Gate | 教學模式 | 生產模式 |
| :--- | :--- | :--- |
| `verdict.total_score` | 顯示 0-25，作為反思鏡子 | **不顯示**（pain_card_schema.md R4.1） |
| 失敗訊息 | 詳細說明「為什麼這樣設計」 | 精簡只顯示行動建議 |
| 補強 prompt | 顯示 worksheet 原文教學 | 直接觸發 API call |

---

## 5. 與其他文件的引用對應

| 本檔規則 | 對應 |
| :--- | :--- |
| 欄位名 | `data_model.md §完整 Schema` |
| 內容反偵測規則 | `pain_card_schema.md Rule 2` |
| 補強 prompt | `ai_prompt_library.md §4.7-4.8` |
| brand voice | `painmap_brand_system.md §文案規則` |
| 黑帽禁令（不可做 streak / 過期） | `anti_gamification_guardrails.md` |

---

## 6. 變更紀錄

| 版本 | 日期 | 變更 |
| :--- | :--- | :--- |
| 1.0 | 2026-05-01 | 首版；對應 worksheet v1.0、data_model.md v1.0 |
