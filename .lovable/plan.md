
# 卡 3「卡關公式」交互重構

## 問題診斷

**Step 1 現況不對**：強迫使用者用「我每次要 ___，都會卡在 ___」句型寫初稿。但這個結構化動作正是 Step 2 prompt 要 AI 幫忙做的事（PROMPT_TEMPLATE 第 5 行：「請幫我把它整理成…這個句型」）。使用者等於被要求做兩遍同樣的翻譯，且第一遍還沒 AI 校對協助，門檻過高。

**Step 4 現況是空殼**：`stuck_formula.confirmed` 只是 boolean。AI 在 `ai_clarifying_questions` 列 1~10 個問題，使用者**完全不必寫任何回答**就能勾選「我能回答」過關。這跟卡 1/2 的反假鐵律不一致，也讓卡 3 的學習目標（逼使用者把抱怨補具體）落空。

---

## 改動範圍

### A. Step 1 改為「自然語言抱怨初稿」

**`src/components/worksheet/card03/UserDraftInput.tsx`**
- 標題：「你先寫初版」→「先用自己的話描述卡點」
- helper：移除「兩個空格都要具體」「句型句」等措辭
- placeholder：改成自然口語，例如「我每週末光是要寫家長回報訊息就花掉整個下午，因為小考成績要從週間翻 7 次紀錄拼起來，又怕寫太直接會傷家長…」
- 維持 `USER_DRAFT_MIN = 15`（仍要避免一兩個字過關），但把「至少 15 字（目前 X）」訊息軟化為「再多寫一點，讓 AI 能讀出脈絡」
- R2.3 抽象詞 warning 維持（這是教學重點），但提示文案調整成「這詞太抽象，AI 會用它列出更多釐清問題；可選擇現在改、或等 AI 校對後再說」

**`src/lib/cardThreeValidators.ts`**
- `PROMPT_TEMPLATE` 微調第一段，把使用者初稿一起餵給 AI（目前只餵 complaint.verbatim + people.background，使用者 Step 1 寫的東西其實沒進 prompt，這是 bug）：
  ```
  我有一個抱怨原句：{complaint_verbatim}
  抱怨主人翁是：{people_background}
  使用者已嘗試的初稿描述：{user_draft}

  請幫我把上述材料整理成「我每次要 ___，都會卡在 ___」這個句型。
  規則：…（維持原 4 條）
  ```
- `interpolatePrompt(complaintVerbatim, peopleBackground, userDraft)` 簽名加第三參數
- `src/routes/learn.worksheet.03.tsx` 的 `useMemo` 帶入 `stuck.user_draft`

**`src/components/worksheet/card03/AiPromptBlock.tsx`**
- 文案微調：「AI 在這張卡的角色：把你寫的抱怨整理成卡關公式句型，並列出需要再問清楚的問題」

### B. Step 4 改為「逐題回答 AI 釐清問題」

**Schema 擴充（`src/types/painCard.ts`）**
- `stuck_formula` 新增欄位：
  ```ts
  ai_clarifying_answers: Array<{ question: string; answer: string }>
  ```
  以「題目原文」為 key 儲存對應回答，避免 question 順序變動時錯位。
- 維持 `confirmed: boolean` 用於「我已預約找主人翁問」這個逃生口

**`src/components/worksheet/card03/ConfirmationCheck.tsx` 重構成「ClarifyingQAPanel」**
- 渲染邏輯：
  - 若 `ai_clarifying_questions` 為空 → 顯示「AI 沒列出需要再問清楚的問題 ✓」綠色狀態，免填，可直接過關
  - 若有問題 → 對每一題渲染一個 textarea，至少 10 字才算「已回答」
  - 下方保留逃生口 checkbox：「答不出來，我已預約找主人翁問」(confirmed=true)。勾了之後該題 textarea disabled、不必填
- 進度提示：「已回答 X / N 題（其餘已標記預約問）」

**Validator 更新（`src/lib/cardThreeValidators.ts`）**
- 新增 `evaluateClarifyingAnswered(card)`：回傳每題是否「已回答 (≥10 字)」或「已勾選預約問」
- `evaluateCardThree` 的 `confirmed` 欄位改為衍生值：
  - 沒問題 → true
  - 有問題 → 所有題目都 (有 ≥10 字答案 OR 勾了預約)

**`src/components/worksheet/card03/CardThreeExitGateFooter.tsx`**
- ConditionItem 文案：「AI 列的每個問題你都已回答（或標記預約問）」
- blockedMessage 區分「還有 N 題未回答」vs「初稿太短」

### C. Route 整合（`src/routes/learn.worksheet.03.tsx`）

- `interpolatePrompt` 帶入 user_draft 第三參數
- 把舊的 `setConfirmed` 拆成兩個 setter：`setAnswerForQuestion(question, text)` 與 `setReservedToAsk(question, bool)`
- `handleAdvance` blocked 訊息列出「還有 N 題沒回答」

---

## 不動的部分

- 路由結構、AI tool picker、ExampleReferenceCard3、卡 4 入口
- AI prompt 的 4 條規則（逐字維持，只在材料區加 user_draft）
- Step 3「貼回 AI 校對結果」的兩個欄位（ai_polished + ai_clarifying_questions）

---

## 風險與相容

- **Schema 新增欄位** → painCard store 既有資料缺 `ai_clarifying_answers` 時 default `[]`，並在 hydrate 時 backfill
- **Prompt 多一個變數** → 純文字附加，未影響現有 AI 工具相容性
- **Step 4 從 1 個 checkbox 變多 textarea** → 既有使用者若已 `confirmed=true`，把 confirmed 解讀為「全部標記預約問」（最寬鬆），不擋他繼續

---

## 完成條件

1. Step 1 placeholder/helper 不再要求句型，使用者可用自然語言描述
2. AI prompt 包含使用者初稿
3. Step 4 顯示 AI 列的每個問題並要求 textarea 回答（或勾選預約問）
4. 任一題未答 + 未勾預約 → footer 擋下並顯示具體缺幾題
5. AI 沒列任何問題時，Step 4 顯示綠色通過狀態、自動放行
