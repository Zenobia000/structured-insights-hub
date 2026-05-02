# Reflection Hints Matrix — 9 卡反思問題與回頭重想路徑

> **真相源**：
> - `docs/workshop/painpoint_beginner_worksheet.md` 各卡的「想想看」段落
> - `docs/painmap_worksheet/product/data_model.md` 的欄位驗證對應
>
> **本檔角色**：把 worksheet 的「想想看」翻譯成可程式化規則，對齊 PainCard schema 欄位，並設計回頭重想時的中性提示文案。
>
> **設計鐵律**（蘇格拉底式）：
> - 卡片不擋人，只**建議**回頭重想；不出現「過關 / 退回 / 失敗」字眼。
> - 唯一的硬性規則是「真實性護欄」（Card 1 反分析語、Card 2 真名規則）—— 觸發時以中性提示（`{ kind: "ok" | "hint" }`）呈現，從不說 "fail"。
> - 沒有任何卡片 hard-block 前進；卡片只**標記**「這裡可能還沒想清楚」並讓使用者自決。

---

## 0. 設計原則

### 0.1 卡片狀態演進

```
draft (卡 1 開始)
  ↓ 寫一寫
in_progress (卡 2..卡 8)
  ↓ 寫到卡 9 完成
卡 9 真假判斷寫完
  ↓
status 由 verdict.judgment 決定：
  - true_pain → structured
  - fake_pain → archived_fake
  - pending_interview → pending_interview
```

### 0.2 兩層提示

| 層級 | 範圍 | 範例 |
| :--- | :--- | :--- |
| L1：欄位填寫狀態 | 必填 / 長度 | `complaint.verbatim` 非空、長度 ≥ 10 字 |
| L2：真實性護欄（從不擋過，只給中性 hint） | 規則式提示 | 不可包含「我覺得」「應該需要」 |

### 0.3 「卡片建議回頭」 vs 「卡片擋你前進」

```
鐵律：卡片永遠不擋你前進。

只有兩種情況：
1. 必填欄位空白 → 「下一步」按鈕灰色（無法點）
2. 真實性護欄被觸發 → 顯示中性提示「想想看：這幾個字像不像是你自己幫他想的？」
   但仍可前進（使用者自決）
```

> 寫卡片時不需要區分 HARD / SOFT。所有提示都是 SOFT（中性反思），只有必填欄位的填寫狀態決定 CTA 是否可點。

---

## 1. 9 張卡片反思問題矩陣

下表每張卡都列：worksheet 原始反思問題、對應 PainCard 欄位、欄位驗證 / 真實性護欄。

### 卡 1 ｜ 抱怨原句

| Source | 反思問題 |
| :--- | :--- |
| 想想看 | 寫的是**原句**還是你的解釋？至少有 1 個**有名字的真人**？ |

| ID | 規則 | 欄位 | 行為 |
| :--- | :--- | :--- | :--- |
| G1.1 | `complaint.verbatim` 非空且長度 ≥ 10 字 | `complaint.verbatim` | CTA 灰色直到寫滿 |
| G1.2 | `complaint.source_name` 非空 | `complaint.source_name` | CTA 灰色直到寫滿 |
| G1.3 | `complaint.source_relation` 非空 | `complaint.source_relation` | CTA 灰色直到寫滿 |
| G1.4 | `complaint.datetime` 非空 | `complaint.datetime` | CTA 灰色直到寫滿 |
| G1.5 | `complaint.scene` 非空 | `complaint.scene` | CTA 灰色直到寫滿 |
| G1.6 | `complaint.verbatim` 不可包含「我覺得」「應該需要」「也許」「可能」「大概」 | `complaint.verbatim` | 中性 hint「這幾個字像不像是你自己幫他想的？」（不擋前進） |
| G1.7 | `complaint.source_name` 不可為「同學 A」「老師 B」「某人」「朋友」這類代稱 | `complaint.source_name` | 中性 hint「最好補上真名」（不擋前進） |

---

### 卡 2 ｜ 三個有名字的人

| Source | 反思問題 |
| :--- | :--- |
| 想想看 | 3 個都有真名嗎？你**今天**就能傳訊息給其中 1 位嗎？如果不能，那他算「有名字的人」嗎？ |

| ID | 規則 | 欄位 | 行為 |
| :--- | :--- | :--- | :--- |
| G2.1 | `people.background` 非空 | `people.background` | CTA 灰色直到寫滿 |
| G2.2 | `people.list.length === 3`（嚴格 3 筆） | `people.list` | CTA 灰色直到寫滿 |
| G2.3 | 每筆 `people.list[*].name` 非空 | — | CTA 灰色直到寫滿 |
| G2.4 | 每筆 `people.list[*].contact` 非空 | — | CTA 灰色直到寫滿 |
| G2.5 | 每筆 `people.list[*].relation` 非空 | — | CTA 灰色直到寫滿 |
| G2.6 | 每筆 `people.list[*].name` 不為代稱 | — | 中性 hint「想想看：這個算真名嗎？」（不擋前進） |
| G2.7 | 至少 1 筆 `contact` 是「今天就能聯絡」的形式 | — | 中性 hint「你今天傳得到他訊息嗎？」（不擋前進） |

**worksheet 鐵律**：「AI 不能幫忙生 persona」— 此頁前端禁用 AI 提案按鈕。

---

### 卡 3 ｜ 卡關公式

| Source | 反思問題 |
| :--- | :--- |
| 想想看 | 句子裡的兩個空格都**很具體**嗎？你寫的公式句，能不能被一個外人聽完就重複給第三個人？ |

| ID | 規則 | 欄位 | 行為 |
| :--- | :--- | :--- | :--- |
| G3.1 | `stuck_formula.user_draft` 非空 | `stuck_formula.user_draft` | CTA 灰色直到寫滿 |
| G3.2 | `stuck_formula.confirmed === true`（使用者已確認版本） | `stuck_formula.confirmed` | CTA 灰色直到勾選 |
| G3.3 | `stuck_formula.user_draft` 含「我每次要 ___」「卡在 ___」兩個語意位置 | `stuck_formula.user_draft` | 中性 hint「兩個空格都填具體了嗎？」 |
| G3.4 | 兩個空格內不可為抽象詞「效率不好 / 不順 / 太慢 / 太忙」單詞 | `stuck_formula.user_draft` | 中性 hint「你寫的可能還太抽象，再去問主人翁一次會更穩」 |
| G3.5 | 若 `ai_clarifying_questions.length > 0`，UI 提示「你能回答這 N 題嗎？□ 可以 □ 待問主人翁」 | `stuck_formula.ai_clarifying_questions` | 紀錄 metadata，不擋 |

---

### 卡 4 ｜ 現在怎麼解

| Source | 反思問題 |
| :--- | :--- |
| 想想看 | 主人翁現在用的方法**有具體名字**嗎？他過去 30 天有沒有真的花時間或錢試圖解？如果沒有，這真的痛嗎？ |

| ID | 規則 | 欄位 | 行為 |
| :--- | :--- | :--- | :--- |
| G4.1 | `workaround.tool_name` 非空 | `workaround.tool_name` | CTA 灰色直到寫滿 |
| G4.2 | `workaround.tool_name` 不為「沒人解過 / 還沒解 / 自己想辦法 / 沒有」 | `workaround.tool_name` | 中性 hint「他過去 30 天有沒有真的花時間或錢試圖解？」 |
| G4.3 | `workaround.user_dissatisfactions.length >= 3` | `workaround.user_dissatisfactions` | CTA 灰色直到 3 個 |
| G4.4 | 每個 dissatisfaction 字串長度 ≥ 5 字 | — | 中性 hint「想想看：這個夠具體嗎？」 |
| G4.5 | `workaround.why_still_stuck` 非空 | `workaround.why_still_stuck` | CTA 灰色直到寫滿 |

---

### 卡 5 ｜ 兩件事不能同時要

| Source | 反思問題 |
| :--- | :--- |
| 想想看 | 他想要 ___，但又同時想要 ___。如果他能放掉其中一邊，他不會卡在這裡——所以他**放不下哪邊**？為什麼那邊會被犧牲？ |

| ID | 規則 | 欄位 | 行為 |
| :--- | :--- | :--- | :--- |
| G5.1 | `contradiction.side_a` 非空且長度 ≥ 10 字 | `contradiction.side_a` | CTA 灰色直到寫滿 |
| G5.2 | `contradiction.side_b` 非空且長度 ≥ 10 字 | `contradiction.side_b` | CTA 灰色直到寫滿 |
| G5.3 | `contradiction.sacrificed ∈ {'a', 'b'}` | `contradiction.sacrificed` | CTA 灰色直到選 |
| G5.4 | `contradiction.sacrificed_reason` 非空且 ≥ 1 句完整描述（建議 ≥ 15 字） | `contradiction.sacrificed_reason` | CTA 灰色直到寫滿 |
| G5.5 | A 端 / B 端不可為「品質好 / 速度快 / 成本低」單詞抽象描述 | — | 中性 hint「想想看：用主人翁的話寫，會更具體」 |

> 卡 5 是蘇格拉底式取捨自陳：使用者用自己的話寫 A/B 兩端、選犧牲哪邊、寫為什麼那邊會被犧牲。AI 的角色僅是協助使用者把自己腦中的話寫清楚。

---

### 卡 6 ｜ AI 證據蒐集

| Source | 反思問題 |
| :--- | :--- |
| 想想看 | AI 給你的 8 個答案裡，哪一個讓你最意外？為什麼意外？ |

| ID | 規則 | 欄位 | 行為 |
| :--- | :--- | :--- | :--- |
| G6.1 | `ai_evidence.ai_tool ∈ {'chatgpt_dr', 'claude', 'perplexity', 'gemini'}` | `ai_evidence.ai_tool` | CTA 灰色直到選 |
| G6.2 | `ai_evidence.ai_tool_reason` 非空 | `ai_evidence.ai_tool_reason` | CTA 灰色直到寫滿 |
| G6.3 | `ai_evidence.eight_answers` 全 8 題非空 | `ai_evidence.eight_answers.q1..q8` | CTA 灰色直到 8 題全填 |
| G6.4 | `ai_evidence.raw_response` 非空且長度 ≥ 200 字 | `ai_evidence.raw_response` | CTA 灰色直到寫滿 |
| G6.5 | `ai_evidence.no_solution_check_passed === true` | `ai_evidence.no_solution_check_passed` | CTA 灰色直到勾選 |
| G6.6 | `raw_response` 不含「你應該開發」「建議製作 App」「可以做成 SaaS」等字串 | `ai_evidence.raw_response` | 自動將 G6.5 設為 false，提示重跑補強 prompt |

> G6.6 若觸發 → 系統自動把 `no_solution_check_passed` 設為 false，UI 顯示補強 prompt 按鈕（見 `ai_prompt_library.md §4.8`）。

---

### 卡 7 ｜ 自己先猜 + 讀 AI

| Source | 反思問題 |
| :--- | :--- |
| 想想看 | 4 個檢查點都過了嗎？你的猜想跟 AI 差最大的地方，反映了你想當然了什麼？ |

| ID | 規則 | 欄位 | 行為 |
| :--- | :--- | :--- | :--- |
| G7.1 | `self_guess.guesses` 4 欄全填 | `self_guess.guesses.*` | CTA 灰色直到 4 欄全填 |
| G7.2 | 4 個 `ai_checkpoints_passed.*` 全 true | `self_guess.ai_checkpoints_passed.*` | CTA 灰色直到 4 個全勾 |
| G7.3 | `self_guess.pain_judgment_table` 非空（AI 已產出表格） | `self_guess.pain_judgment_table` | CTA 灰色直到貼回 |
| G7.4 | `self_guess.deltas` 3 欄全填 | `self_guess.deltas.*` | CTA 灰色直到 3 欄全填 |
| G7.5 | UI 強制：使用者必須先填完 `guesses` 才能看到 AI 整理的判斷表（時序鎖） | — | UI 強制（這是卡 7 的核心訓練設計） |

> G7.5 是 **worksheet 的核心訓練設計**：「先猜後看，你才會發現 AI 補了什麼 / 漏了什麼」。前端必須做時序鎖：`guesses` 全填 → 解鎖「請 AI 整理」按鈕。

---

### 卡 8 ｜ 真人訪談規劃

| Source | 反思問題 |
| :--- | :--- |
| 想想看 | 你列出了至少 1 位**有名字**或**有具體聯絡管道**的訪談對象嗎？這 3 道題，你今晚就能傳給其中一個人嗎？ |

| ID | 規則 | 欄位 | 行為 |
| :--- | :--- | :--- | :--- |
| G8.1 | `interview_plan.targets.length >= 1` | `interview_plan.targets` | CTA 灰色直到 1 個 |
| G8.2 | 每筆 target 的 `persona` 非空 + 有 `contact_known === true` 配 `contact_info` 真名，或 `contact_known === false` 配「具體去哪找」 | — | CTA 灰色直到寫滿 |
| G8.3 | `interview_plan.questions.length === 3` | `interview_plan.questions` | CTA 灰色直到 3 題 |
| G8.4 | 每題 `questions[i]` 不可為推銷題型 | — | 中性 hint「這題像不像在問『你會不會買』？訪談禁忌」 |
| G8.5 | `interview_plan.interview_taboos_understood === true` | `interview_plan.interview_taboos_understood` | CTA 灰色直到勾選 |

> G8.4 推銷題型偵測 keywords（黑名單）：`會付錢`、`會用嗎`、`如果有...你會`、`你覺得我做`、`你願意付`、`想不想要`、`覺得這個產品`。

---

### 卡 9 ｜ 真假判斷

| Source | 反思問題 |
| :--- | :--- |
| 想想看（純螢幕提示，**不寫進資料**） | 1. 你能說出 3 個有名字的人嗎？<br>2. 你看到他每週遇到幾次？是猜的還是有人告訴你？<br>3. 他付出最多的是時間、錢、心力還是關係？<br>4. 他現在解法最讓他不爽的點，能用他的話寫出來嗎？<br>5. 最有把握的證據 vs 最薄弱的環節分別是什麼？ |

| ID | 規則 | 欄位 | 行為 |
| :--- | :--- | :--- | :--- |
| G9.1 | `verdict.judgment ∈ {'true_pain', 'fake_pain', 'pending_interview'}` | `verdict.judgment` | CTA 灰色直到選 |
| G9.2 | `verdict.reason_100w` 非空且長度 ≥ 100 字 | `verdict.reason_100w` | CTA 灰色直到寫滿 |
| G9.3 | `verdict.most_confident_evidence` 非空 | `verdict.most_confident_evidence` | CTA 灰色直到寫滿 |
| G9.4 | `verdict.least_confident` 非空 | `verdict.least_confident` | CTA 灰色直到寫滿 |
| G9.5 | `verdict.next_action ∈ {'interview', 'more_evidence', 'change_topic'}` | `verdict.next_action` | CTA 灰色直到選 |

> 卡 9 不可有 AI 按鈕。判斷必須由使用者親自寫。
>
> 5 個 Socratic 反思問句只當作螢幕上的提示文字（純 UI），**不寫進資料**。資料層只有：judgment + reason_100w + most_confident_evidence + least_confident + next_action 五欄。

---

## 2. 回頭重想路徑（中性建議，不強制）

每張卡如果使用者寫到一半覺得卡住，可以**自願**回頭重想前面的卡片。系統不主動把人擋下、不主動 redirect。

### 2.1 中性建議文案

每張卡片的 hint 都遵守：

1. 用「你」稱呼，不用「使用者 / 用戶」
2. 先說發生什麼（事實），再說怎麼修（行動）
3. **不出現**「錯了」「失敗」「不及格」「過關」「退回」這類字眼
4. 不出現分數 / 等級 / 排名
5. 不出現「FOMO 字眼」（沒有「再不做就...」「過期...」「機會錯過...」）

### 2.2 回頭重想時的中性建議模板

```
卡 N 寫到一半覺得卡住？
  ↓
看下面這幾個建議：

| 卡 | 反思建議文案 |
| :- | :--- |
| 1 | 「想想看：這句話是他說的、還是你幫他想的？」 |
| 2 | 「想想看：你今天傳得到他訊息嗎？」 |
| 3 | 「回去把卡 1 想清楚再來：沒問清楚的話，公式句一定寫不細。」 |
| 4 | 「回去把卡 1 想清楚再來：他過去 30 天有沒有真的花時間或錢試圖解？」 |
| 5 | 「回去把卡 3 想清楚再來：兩件事拆不出來，通常代表卡關句還沒拆乾淨。」 |
| 6 | 「補強 prompt 重跑：AI 給的太籠統的話，回去卡 1-5 補上更具體的細節再來。」 |
| 7 | 「回去把卡 6 想清楚再來：4 個檢查點任一沒過，補資訊重跑就好。」 |
| 8 | 「回去把卡 2 想清楚再來：列不出訪談對象，代表這群人你還沒進去。」 |
| 9 | 「想想看：無法下判斷是正常的。先看哪一邊最弱，回去補那張卡。」 |
```

### 2.3 卡片重新進入時的資料行為

| 行為 | 規則 |
| :--- | :--- |
| 回頭重想時保留已填欄位 | 是。回到卡 N 不會刪除卡 N+1...M 的資料；標記為 `stale=true`。 |
| 重新進入卡 N+1 時 | 提示「你回頭改過卡 N，這張卡的內容可能需要更新」+ 一鍵「保留 / 清空 / 編輯」三選項 |
| 卡 9 完成後再回頭改 | 將 `verdict.*` 全部清空，`status` 退回 `in_progress` |
| 完成的痛點身份證再回頭改 | 不允許（卡 10 已匯出代表已 final）— 若使用者一定要改，提示「請建立新的 PainCard」 |

### 2.4 中性提示視覺呈現

```
┌────────────────────────────────────────┐
│ [Caution Icon]                         │
│ 想想看：這個內容可能還可以更具體         │
│                                          │
│ 你目前寫的：「卡在效率不好」             │
│ 試著想想：發生時的具體動作或時間量化     │
│                                          │
│ [我了解，先送出] [回去再想想]            │
└────────────────────────────────────────┘
```

> 顏色：使用 `--color-caution: #D97706`（PainMap brand），不使用大面積紅色。

---

## 3. 設計守則

### 3.1 三個原則

1. **必填欄位空白 → CTA 灰色**（這不是「擋」，是「資料還沒齊」）
2. **真實性護欄觸發 → 中性 hint**（顯示但不擋前進）
3. **使用者自決何時前進**（無任何閘門擋人，因此不需要「我知道我在做什麼」覆寫機制）

### 3.2 不分 HARD / SOFT

所有提示都遵循以下二分：

- 規則 100% 可程式化（必填 / 長度）→ 用 CTA disable 表達
- 規則無法 100% 抓出（過度抽象 / 真實性）→ 改成中性 hint，使用者自決

兩者都不會出現「失敗 / 過關 / 退回」字眼。

---

## 4. 與其他文件的引用對應

| 本檔規則 | 對應 |
| :--- | :--- |
| 欄位名 | `data_model.md §完整 Schema` |
| 內容真實性護欄規則 | `pain_card_schema.md`（保留 anti-fake 規則，回應為中性） |
| 補強 prompt | `ai_prompt_library.md §4.7-4.8` |
| brand voice | `painmap_brand_system.md §文案規則` |
| 黑帽禁令（不可做 streak / 過期） | `anti_gamification_guardrails.md` |
