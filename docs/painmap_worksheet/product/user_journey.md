# PainMap Worksheet — 使用者旅程地圖 (User Journey Map)

> **配套文件**：`PRD.md`、`data_model.md`、`motivation_design.md`、`stage1_to_stage2_handoff.md`
> **內容真相源**：`docs/workshop/painpoint_beginner_worksheet.md`
> **設計原則**：每張卡片都是 `PainCard` 物件的一個欄位，不是 9 份獨立資料。文案中性化（「想想看 / 回去把卡 X 想清楚再來」），無「過關 / 退回」字眼。

---

## 0. 快速地圖（一頁看完）

```
┌──────────────────────────────────────────────────────────────────────┐
│   入口            ──→  9 張卡片（線性 + 反思問題）  ──→  痛點身份證 │
│   /worksheet            /worksheet/01..09                /result     │
│                                                                       │
│   情緒曲線：                                                          │
│     好奇 ─ 卡關 ─ 釋懷 ─ 緊張 ─ 開竅 ─ 疲勞 ─ 反思 ─ 行動 ─ 完成   │
│      0      1      2      3      4      5      6      7      8       │
│                                                                       │
│   AI 介入點：                                                         │
│     卡 1 ❌  卡 2 ❌  卡 3 ✅  卡 4 ✅  卡 5 ✅  卡 6 ✅  卡 7 ✅    │
│     卡 8 ✅  卡 9 ❌  卡 10 ─                                         │
│                                                                       │
│   最常卡關：卡 2（找不到 3 個真名）、卡 6（AI 跑出 solution mode）   │
│   Aha moment：卡 7（猜測 vs AI 差異）、卡 9（書面真假判斷）          │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 1. 完整 User Journey

### Phase 0 — 進場（Discovery）

| Touchpoint | 使用者狀態 | 系統行為 |
| :--- | :--- | :--- |
| 朋友轉貼連結 / Google 搜尋 / Workshop 後跟進 | 帶著一個模糊的「我覺得有問題」進來 | — |
| 入口頁 `/learn/worksheet` | 想知道「這要花我多久 / 適不適合我」 | 顯示「30–90 分鐘、不需要懂 AI、9 張卡片填空」三句話定位 |
| 點擊「開始填寫」 | 願意花時間試試 | 1. 檢查 LocalStorage 是否有未完成 PainCard<br>2. 有 → 提示「上次填到卡 N，是否繼續？」<br>3. 無 → 建立新 PainCard，跳轉 `/worksheet/01` |

**反思提示**：無（任何人都可以開始）

**情緒**：好奇 / 略帶懷疑（「這跟之前看過的 idea 評分工具有什麼不同？」）

**設計回應**：入口頁明確標示「**這不是 idea 評分工具**。我們不打分，我們訓練判斷力」（直接對齊使用者疑慮）

---

### Phase 1 — 抱怨原句（卡 1）

| 階段 | 內容 |
| :--- | :--- |
| 路徑 | `/learn/worksheet/01` |
| 對應欄位 | `complaint.{verbatim, source_name, source_relation, datetime, scene}` |
| AI 介入 | ❌ 完全禁用（這是你的功課）|

**User flow**

1. 進場：看到「把抱怨寫下來」標題 + 範例（林老師家長 LINE 案例）
2. 填空 5 個欄位：原句、誰說、何時、何地、當時做什麼
3. 即時驗證：
   - 原句字數 ≥ 10 字
   - 至少 1 個有名字的人（不是「現代人」「上班族」）
4. 點擊「下一張卡 →」

**反思提示**

- [ ] `verbatim` 非空且 ≥ 10 字
- [ ] `source_name` 非空（不允許「自己」「朋友」這類稱謂；P1 階段加 NLP 檢測）
- [ ] `source_relation` / `datetime` / `scene` 全非空

**Failure routing**：未通過 → 顯示「這還不是你的題目，去找一個真人聊聊再回來」+ 留在卡 1（不允許跳卡）

**情緒**：好奇 → 略略卡（「我要寫到多具體？」）

**設計回應**：右側固定範例區（可摺疊），每個欄位下方有「不能過關的例子」紅框（如「現代人都很焦慮 ❌ — 沒有具體的人」）

---

### Phase 2 — 三個有名字的人（卡 2）

| 階段 | 內容 |
| :--- | :--- |
| 路徑 | `/learn/worksheet/02` |
| 對應欄位 | `people.{background, list[3]}` |
| AI 介入 | ❌ 完全禁用（AI 會生合成 persona，不會付錢）|

**User flow**

1. 進場：看到「找出 3 個有名字的人」+ 警告「AI 不能幫忙，這是你的功課」
2. 填空：背景描述 + 3 筆 `{name, contact, relation}`
3. 即時驗證：3 筆 `name` / `contact` / `relation` 全非空
4. 點擊「下一張卡 →」

**反思提示**

- [ ] `people.list.length === 3`
- [ ] 每筆 `name` / `contact` / `relation` 非空
- [ ] `name` 不是「補習班老師 A」「客戶甲」這類佔位符（P1 階段加格式檢測）

**Failure routing**：未通過 → 「你還不認識這個圈子。去這群人聚集的地方混 1–2 週再回來」+ 提供「先去聊聊 / 暫存退出」兩個選項

**情緒**：卡關（「我真的認識 3 個人嗎？」）→ 反思（「我之前以為自己懂這個族群，原來連 3 個名字都湊不出來」）

**設計回應**：這是工具刻意的「最大魔王關」。設計上不要給「跳過」選項，但要給「暫存退出，2 週後回來」的合理出口（避免使用者放棄）

**Aha moment 機率**：HIGH — 大部分使用者會在這一卡發現「我以為的痛點，其實只是我自己的猜測」

---

### Phase 3 — 卡關公式（卡 3）

| 階段 | 內容 |
| :--- | :--- |
| 路徑 | `/learn/worksheet/03` |
| 對應欄位 | `stuck_formula.{user_draft, ai_polished, ai_clarifying_questions, confirmed}` |
| AI 介入 | ✅ AI 校對句型 + 列出「需要再問清楚」|

**User flow**

1. 進場：看到「我每次要 ___，都會卡在 ___」句型範本 + 範例
2. 使用者先填 `user_draft`
3. 點擊「複製 prompt 到 ChatGPT」按鈕（內建 prompt 模板，已自動填入卡 1 + 卡 2 內容）
4. 使用者外部跑 AI → 把回覆貼回 `ai_polished` + `ai_clarifying_questions`
5. 確認句型 + 勾選 `confirmed = true`
6. 點擊「下一張卡 →」

**反思提示**

- [ ] `user_draft` 非空
- [ ] `confirmed === true`（可選擇直接用 user_draft，不一定要用 ai_polished）

**Failure routing**：句子裡的兩個空格不夠具體（如「卡在效率不好」）→ 回去把卡 1 想清楚再來，再去找主人翁聊一次

**情緒**：釋懷（「原來我可以這樣表達我的痛」）

**設計回應**：句型完成後給予正向回饋（「你已經把抱怨變成可分析的句子」），不使用慶祝動畫（避免遊戲化）

---

### Phase 4 — 現在怎麼解（卡 4）

| 階段 | 內容 |
| :--- | :--- |
| 路徑 | `/learn/worksheet/04` |
| 對應欄位 | `workaround.{tool_name, why_still_stuck, ai_alternatives, user_dissatisfactions}` |
| AI 介入 | ✅ AI 提案 5 個常見 workaround |

**User flow**

1. 進場：先填 `tool_name` + `why_still_stuck`（你聽到主人翁說的）
2. 點擊「複製 prompt 到 ChatGPT」→ AI 列出 5 個常見 workaround
3. 把 AI 列出的清單**拿去問主人翁**（線下動作，工具提示）
4. 回填 `user_dissatisfactions`（≥ 3 個具體不滿理由）
5. 點擊「下一張卡 →」

**反思提示**

- [ ] `tool_name` 非空（具體名字，不是「沒人解過」）
- [ ] `user_dissatisfactions.length >= 3`

**Failure routing**：未通過 → 「這個人可能還沒真正在意這個問題（沒在花時間 / 花錢解）」→ 回去把卡 1 想清楚再來

**情緒**：緊張（「我要再去找主人翁問一次嗎？」）

**設計回應**：明確標示「這一卡需要你回去問主人翁，不是現在就完成。可暫存退出」，提供「我已經問過了 / 我下次再問」兩個按鈕

---

### Phase 5 — 兩件事不能同時要（卡 5）

| 階段 | 內容 |
| :--- | :--- |
| 路徑 | `/learn/worksheet/05` |
| 對應欄位 | `contradiction.{side_a, side_b, sacrificed, sacrificed_reason}` |
| AI 介入 | ✅ AI 協助使用者用自己的話寫兩端 + 為什麼犧牲 |

**User flow**

1. 進場：看到「兩件事不能同時要」蘇格拉底引導句（「他想要 ___，但又同時想要 ___，他放不下哪邊？為什麼？」）
2. 點擊「複製 prompt 到 ChatGPT」→ AI 協助用主人翁的話寫 A、B 兩端 + 為什麼那邊會被犧牲（**不**給編號、**不**給分類學標籤）
3. 貼回 AI 回應 → 點「解析」→ 自動帶入 4 欄位（同時跑 anti-taxonomy 檢查）
4. 編輯 / 確認：填 `side_a` / `side_b` / `sacrificed` / `sacrificed_reason`
5. 點擊「下一張卡 →」

**反思提示**

- [ ] `side_a` / `side_b` 非空且具體（≥ 10 字）
- [ ] `sacrificed` 已選（'a' or 'b'）
- [ ] `sacrificed_reason` 寫了 1-2 句完整描述（≥ 15 字）

**回頭重想路徑**：使用者覺得兩端拆不出來 → AI 會回應「卡關句還沒拆清楚，建議回去把卡 3 想清楚再來」→ 中性 link（不強制跳轉）

**情緒**：開竅（「原來我面對的是這種取捨，原來那邊會被犧牲是因為時間 / 利益 / 心理」）

**Aha moment 機率**：MEDIUM-HIGH — 寫「為什麼會被犧牲」常常是這套訓練最開竅的時刻

**設計回應**：4 個 textarea / radio 並排，不使用 quiz 式互動（避免分類學偽裝）

---

### Phase 6 — AI 證據蒐集（卡 6）

| 階段 | 內容 |
| :--- | :--- |
| 路徑 | `/learn/worksheet/06` |
| 對應欄位 | `ai_evidence.{ai_tool, ai_tool_reason, raw_response, eight_answers, no_solution_check_passed}` |
| AI 介入 | ✅ AI 跑研究（這是 AI 介入最多的一卡）|

**User flow**

1. 進場：看到「選一個 AI 工具」（ChatGPT DR / Claude / Perplexity / Gemini）+ 比較表
2. 選 `ai_tool` + 填 `ai_tool_reason`（1 句話為什麼選這個）
3. 點擊「複製證據蒐集 prompt」→ 內建 prompt 已自動填入卡 1–5 內容
4. 使用者外部跑 AI（這一輪通常需要 5–10 分鐘）
5. 把 AI 整段回覆貼回 `raw_response`
6. 系統 parse 出 8 題答案（P1 階段；MVP 階段使用者手動分欄填）
7. 勾選 `no_solution_check_passed`（AI 沒進入「設計產品」模式）
8. 點擊「下一張卡 →」

**反思提示**

- [ ] `ai_tool` 已選 + `ai_tool_reason` 非空
- [ ] `eight_answers` 8 題全非空
- [ ] `no_solution_check_passed === true`

**Failure routing**：
- AI 開始推銷解法 → 系統提示「複製這句話再跑一次：不要建議任何解決方案，只回答證據面」
- AI 答得太空泛 → 系統提示「補上更多卡 1–5 的具體細節再跑一次」

**情緒**：疲勞（這一卡時間最長）+ 充實（「我終於有真實證據了」）

**設計回應**：
- 提供「儲存進度，等等再回來」按鈕（這一卡很可能需要切到外部 AI 工具，回來時要復原）
- raw_response 與 8 題答案分欄存放（即使 8 題還沒填完，raw_response 已先保存）

---

### Phase 7 — 自己先猜 + 讀 AI（卡 7）

| 階段 | 內容 |
| :--- | :--- |
| 路徑 | `/learn/worksheet/07` |
| 對應欄位 | `self_guess.{guesses, ai_checkpoints_passed, pain_judgment_table, deltas}` |
| AI 介入 | ✅ AI 整理痛點判斷表（第二輪 prompt）|

**User flow**

1. 進場：看到「先寫猜測，再讀 AI」+ 警告「順序錯了會失去判斷力」
2. **第一階段（鎖住 AI 回覆）**：使用者寫 4 個猜測（最痛人、場景、不滿、可能假痛點）
3. 寫完後**才解鎖** AI 回覆顯示（強制順序，UI 設計層面）
4. **第二階段（讀 AI）**：4 個檢查點逐一勾選
5. **第三階段（追問）**：點「複製第二輪 prompt」→ AI 整理「痛點判斷表」
6. 把判斷表貼回 `pain_judgment_table`
7. **第四階段（對照差異）**：填 `deltas.{biggest_diff, ai_added, guess_unsupported}`
8. 點擊「下一張卡 →」

**反思提示**

- [ ] `guesses` 4 欄非空
- [ ] 4 個 `ai_checkpoints_passed` 全 true
- [ ] `deltas` 3 欄非空

**Failure routing**：4 個檢查點任一沒過 → 回去把卡 6 想清楚再來 補資訊

**情緒**：反思 / 開竅（「我猜的跟 AI 答的差很多，原來我之前自以為懂」）

**Aha moment 機率**：HIGH — 這是工具設計上最重要的學習時刻

**設計回應**：
- 寫猜測階段，AI 回覆區用毛玻璃模糊+「先寫猜測才能看 AI」覆蓋
- 用 2 分鐘倒數提示（不是壓力倒數，是「2 分鐘已經夠了，不要超過 5 分鐘」的緩衝提示）
- 對照差異區用左右並列（猜測 / AI），視覺強調差異

---

### Phase 8 — 真人訪談規劃（卡 8）

| 階段 | 內容 |
| :--- | :--- |
| 路徑 | `/learn/worksheet/08` |
| 對應欄位 | `interview_plan.{targets, questions, interview_taboos_understood, ai_simulated_response}` |
| AI 介入 | ✅ AI 模擬訪談（熱身）|

**User flow**

1. 進場：看到「從卡 7 判斷表挑 2 個訪談對象」
2. 填 `targets`（≥ 1 個，建議 2 個）
3. 從卡 6 訪談題庫中挑 3 題（系統建議題目，使用者可改寫）
4. 閱讀「訪談禁忌清單」+ 勾選 `interview_taboos_understood`
5. **可選**：點「複製模擬訪談 prompt」→ AI 扮演受訪者（熱身）
6. 點擊「下一張卡 →」

**反思提示**

- [ ] `targets.length >= 1`
- [ ] `questions.length === 3`
- [ ] `interview_taboos_understood === true`

**Failure routing**：使用者列不出訪談對象 → 回去把卡 2 想清楚再來「你還沒接觸這群人」

**情緒**：行動感（「我有具體下一步了」）

**設計回應**：訪談禁忌清單以「不要做 / 要做」對照表呈現，不要用條列勾選（避免「打分」感）

---

### Phase 9 — 真假判斷（卡 9）

| 階段 | 內容 |
| :--- | :--- |
| 路徑 | `/learn/worksheet/09` |
| 對應欄位 | `verdict.{judgment, reason_100w, most_confident_evidence, least_confident, next_action}` |
| AI 介入 | ❌ 完全永久禁用（這是你的判斷）|

**User flow**

1. 進場：看到「這張是終點」+ 警告「AI 不能幫你判斷」
2. **Socratic 反思區**：閱讀 5 個 Socratic 反思問句（純螢幕提示，**不對應任何 textarea**）：
   - 你能說出 3 個有名字的人嗎？
   - 你看到他每週遇到幾次？是猜的還是有人告訴你？
   - 他付出最多的是時間、錢、心力還是關係？
   - 他現在解法最讓他不爽的點，能用他的話寫出來嗎？
   - 最有把握的證據 vs 最薄弱的環節分別是什麼？
3. **書面判斷區**：寫 `judgment`（真痛點 / 假痛點 / 待訪談）
4. 寫 `reason_100w`（≥ 100 字）
5. 寫 `most_confident_evidence` / `least_confident`（各 ≥ 15 字）
6. 選 `next_action`（訪談 / 補證據 / 換題目）
7. 點擊「產出痛點身份證 →」

**反思提示**

- [ ] `judgment` 已選
- [ ] `reason_100w.length >= 100`
- [ ] `most_confident_evidence` / `least_confident` 非空（各 ≥ 15 字）
- [ ] `next_action` 已選

**Failure routing**：書面理由 < 100 字 → 中性提示「再補一些細節，這是這份填空簿的唯一交付物」（不擋過）

**情緒**：完成感 / 反思（「我終於有書面判斷了，無論是真是假，都是學習」）

**設計回應**：
- 5 個 Socratic 反思問句**純螢幕顯示**，不寫進資料（避免 over-engineer 變成另一套 score）
- **無分數 UI、無模式切換**（schema 內無分數欄位）
- 即便判斷為「假痛點」，也給正向回饋：「你省下 3 個月走錯路的時間」

---

### Phase 10 — 痛點身份證匯出（卡 10）

| 階段 | 內容 |
| :--- | :--- |
| 路徑 | `/learn/worksheet/result` |
| 對應欄位 | `exported.{exported_at, formats, last_review_at}` |
| AI 介入 | — |

**User flow**

1. 進場：看到「你的痛點身份證」整合頁
2. 預覽身份證內容（紙本 worksheet 的最後組合區塊）
3. 選擇匯出格式：
   - Markdown（給部落格 / Notion）
   - JSON（給工具搬移 / 備份）
   - PDF（列印 / 面對面討論）
4. 下方 CTA 區依 `judgment` 顯示不同選項：
   - **真痛點**：「將這個痛點匯入 PainMap App」+「排訪談」
   - **待訪談**：「排訪談」+「訪談後回填卡 9」
   - **假痛點**：「換題目重新填一輪」+「我已經學到判斷力」
5. 結束流程或回到 Dashboard（M2+ 範圍）

**反思提示**：無（已是終點）

**情緒**：完成

**設計回應**：身份證視覺以「正式文件」風格呈現（無遊戲化、無慶祝動畫）

---

## 2. 失敗回退路徑（Failure Routing Map）

```
[卡 1 fail] ─→ 留在卡 1，提示「找一個真人聊再回來」
[卡 2 fail] ─→ 留在卡 2，提示「去這群人聚集的地方混 1–2 週」
[卡 3 fail] ─→ 回去把卡 1 想清楚再來，提示「沒問清楚，再去問」
[卡 4 fail] ─→ 回去把卡 1 想清楚再來，提示「這個人沒在花時間花錢解」
[卡 5 fail] ─→ 回去把卡 3 想清楚再來，提示「拆得不夠細」
[卡 6 fail] ─→ 補卡 1–5 細節再跑（不退卡，重新跑 prompt）
              └─ 子情境 A：AI 推銷解法 → 強化 prompt 規則
              └─ 子情境 B：AI 答得空泛 → 補上更多卡 1–5 細節
[卡 7 fail] ─→ 回去把卡 6 想清楚再來，AI 給的不夠具體
[卡 8 fail] ─→ 回去把卡 2 想清楚再來，「你還沒接觸這群人」
[卡 9 fail] ─→ 留在卡 9（書面理由不足）
              └─ 真假判斷無法定 → 自動標 `pending_interview`
```

### 設計原則

- **fail 不是懲罰，是訊號**：UI 用沉穩 Teal 邊框提示，不用紅色（避免焦慮）
- **資料保留**：退回上一卡時，已填寫的欄位不清空，只是要求重新確認
- **暫存退出永遠可用**：每一卡頁都有「暫存退出」按鈕，下次進場可從中斷點繼續

---

## 3. 情緒曲線（Emotion Curve）

```
情緒強度
   ↑
高 |        ★Aha7         ★完成9
   |       ╱              ╱
中 |     ╱   ★釋懷3   ★行動8
   |   ╱    ╱      ╲    ╱
低 |  ╱   ╱         ╲  ╱
   | ╱   ╱           ╲╱
基 |─────────────────╲────────→ 時間
   0  1  2  3  4  5  6  7  8  9  10
   入 卡 卡 卡 卡 卡 卡 卡 卡 卡 身
   口 1 2 3 4 5 6 7 8 9 證
```

### 關鍵時刻

| 時刻 | 情緒 | 設計策略 |
| :--- | :--- | :--- |
| 卡 2 卡關 | 挫折（「我認識 3 個真名嗎？」）| 提供合理出口「暫存 2 週後回來」，不羞辱使用者 |
| 卡 6 疲勞 | 累（外部跑 AI 5–10 分鐘）| 進度條 + 隨時可暫存 + 完成後給「你即將進入最有趣的卡 7」|
| 卡 7 開竅 | 興奮（「我猜的跟 AI 差好多」）| 對照差異視覺強調，但**不**慶祝動畫 |
| 卡 9 完成 | 完成感 | 用「正式文件」風格呈現身份證，不遊戲化 |
| 假痛點判斷 | 失落 → 釋懷 | 文案「你省下 3 個月走錯路的時間」，重新引導下一張 |

---

## 4. AI 介入時機（Prompt Copy Block 出現點）

| 卡 | 第幾個 prompt | 內建模板 | 使用者操作 |
| :-- | :--- | :--- | :--- |
| 1 | — | ❌ 無 | — |
| 2 | — | ❌ 無 | — |
| 3 | Prompt #1 | 句型校對 prompt（自動填入卡 1+2） | 複製 → 外部跑 → 貼回 |
| 4 | Prompt #2 | 5 個 workaround 提案 prompt（自動填入卡 3） | 複製 → 外部跑 → 貼回 → 拿去問主人翁 |
| 5 | Prompt #3 | 取捨自陳協助 prompt（協助使用者用自己的話寫 side_a / side_b / sacrificed_reason）| 複製 → 外部跑 → 貼回 |
| 6 | Prompt #4 | 8 題證據蒐集 prompt（自動填入卡 1–5） | 複製 → 外部跑 → 貼回 raw_response |
| 7 | Prompt #5 | 痛點判斷表整理 prompt | **必須先寫猜測再使用** |
| 8 | Prompt #6 | 模擬訪談 prompt（可選） | 複製 → 外部跑 → 貼回（熱身用）|
| 9 | — | ❌ 無 | — |

### Prompt Copy Block 元件規格（簡述）

- 一律使用「📋 複製到 ChatGPT」按鈕（單一動詞，不誇飾）
- 點擊後變色 1 秒 + 顯示「已複製」（不使用慶祝動畫）
- 下方有「需要 AI 工具？」連結（指向卡 6 的工具選擇說明）
- 詳見 `design/components/ai_prompt_copy_block.md`

---

## 5. 跨 Session 持續性（Cross-session Persistence）

### 5.1 自動儲存策略

- 每個欄位 `onChange` debounce 500ms 後寫入 LocalStorage
- 卡片切換時強制儲存
- 視窗關閉時 `beforeunload` 強制儲存

### 5.2 復原流程

```
使用者打開 /learn/worksheet
   ↓
檢查 LocalStorage `painmap_worksheet:cards`
   ↓
有未完成 PainCard？
   ├── 有（status !== 'structured' && status !== 'archived_fake'）
   │     ↓
   │   顯示「上次填到卡 N（建立於 YYYY-MM-DD），是否繼續？」
   │     ├── 繼續 → 跳轉 /worksheet/{N}
   │     └── 開新 → 詢問「保留舊的 / 取代舊的」（避免誤刪）
   │
   └── 沒有（首次或全部已完成）
         ↓
        顯示入口頁，CTA「開始填寫第一張卡」
```

### 5.3 多份 PainCard 並存（P1 範圍）

- LocalStorage `cards: Record<string, PainCard>` 儲存多份
- 入口頁左側列表（P1 階段）顯示所有 PainCard 縮略
- 切換時更新 `current_card_id`
- 已完成（`structured` / `archived_fake`）的卡片標示為「歷史」

### 5.4 容量管理

- 單份 PainCard 預估 < 50KB（含 `raw_response`）
- 5MB LocalStorage 上限可存 ~100 份
- 超過上限提示「請匯出舊資料釋出空間」

### 5.5 跨裝置同步（M2+ 範圍）

- 不在 MVP 範圍
- 未來方向：optional 雲端帳號 + 端到端加密同步

---

## 6. 三個 Persona 的旅程差異

### Persona A — 林老師（補習班老師）

- **入口**：朋友轉貼連結，桌面瀏覽器
- **預估時間**：第一次 90 分鐘（卡 6 跑 AI 證據最久）
- **關鍵卡點**：卡 4（要回去問主人翁；他自己就是主人翁所以可內省）
- **預期結果**：判斷為真痛點（高機率）→ 進入排訪談階段（其他補習班老師）

### Persona B — 小恆（工程師）

- **入口**：臉書社團貼文，桌面瀏覽器
- **預估時間**：第一次 60 分鐘（他熟悉 ChatGPT）
- **關鍵卡點**：卡 2（他可能列不出 3 個真名 → 自我認知衝擊）
- **預期結果**：50% 機率第一輪判斷為假痛點（換題目重來）

### Persona C — Vicky（內部創新負責人）

- **入口**：Workshop 後跟進，可能桌面+平板
- **預估時間**：第一次 90 分鐘（涉及多個員工抱怨需排序）
- **關鍵卡點**：卡 8（內部訪談有政治顧慮）
- **預期結果**：判斷為待訪談 → 內部排訪談 → 後續 2 週回來回填卡 9

---

## 7. 旅程指標（與 PRD §7 對應）

| 階段 | 觀察指標 | 設計目標 |
| :--- | :--- | :--- |
| 入口 → 卡 1 | 啟動完成率 | ≥ 60% |
| 卡 1 → 卡 5 | 中段過關率 | 每卡 ≥ 70% |
| 卡 6 → 卡 8 | AI 介入段過關率 | 每卡 ≥ 50%（外部 AI 步驟使流失提高）|
| 卡 9 完成 | Verdict Completion Rate（North Star）| ≥ 30% |
| 卡 10 匯出 | 匯出觸發率 | ≥ 70% |
| 跨 session 復原 | 復原成功率 | ≥ 40% |
| 失敗回退 | 回退使用率 | ≥ 60%（健康訊號）|

---

> **設計鐵律**：旅程不是漏斗，是訓練。流失率不是失敗，**換題目**才是真實學習的訊號。
