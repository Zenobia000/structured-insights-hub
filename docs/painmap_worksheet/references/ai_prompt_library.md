# AI Prompt Library — 7 段內建 Prompt 完整規格

> **真相源**：`docs/workshop/painpoint_beginner_worksheet.md`、卡片 3、4、5、6、7、8。
> **本檔角色**：彙整 worksheet 中所有「複製這段 prompt」的原文，補上觸發時機、變數插值、反 solution mode 防護字句、範例、失敗 fallback、兩種輸出方式（外部 ChatGPT vs 站內 LLM API）。
> **嚴禁**：自行改寫 worksheet prompt 內容；自行新增不在 worksheet 裡的 prompt。
>
> **核心鐵律**：
> - 任何 prompt 都不得要求 AI 給「分數」「等級」「真假判斷」「分類學編號 / 標籤」
> - 卡 5 是蘇格拉底式取捨自陳：AI 只協助使用者用自己的話寫出 side_a / side_b / sacrificed / sacrificed_reason
> - 卡 1 / 卡 2 / 卡 9 永久禁用 AI 輔助
> - 所有 prompt 文案中性，不出現「過關 / 退回 / 失敗」

---

## 0. 通用設計原則（每個 prompt 都遵守）

1. **反 solution mode 防護字句必須出現**：每個 prompt 都帶有「請不要建議 App / SaaS / 解決方案」段落。AI 一旦進入「設計產品 / 想商業模式」就視同 prompt 失敗。
2. **變數插值 placeholder 嚴格命名**：使用 `[貼上卡片 N 的 ___]` 格式，與 worksheet 對應一致；前端帶入時必須是純文字（不可帶入 HTML / Markdown 標題）。
3. **不接受 AI 自行加分數 / 等級 / 標籤**：所有 prompt 都不要 AI 給「真假判斷」「分數」「推薦度」「分類學編號」「分類學標籤」。AI 的角色是放大鏡，不是裁判。
4. **失敗 fallback 必須輕柔**：補強 prompt 不能羞辱使用者；失敗訊息以「結構化＋下一步」呈現，不出現「你錯了」「重來」「過不了」「退回」。
5. **兩種輸出方式**：
   - **方式 A：複製到外部 ChatGPT / Claude / Perplexity / Gemini**（MVP 預設）
   - **方式 B：站內 LLM API call**（M2 後期；採用 OpenAI / Anthropic Edge Function 代理，payload 範例附於每段末）

---

## 1. 卡 3 ｜「卡關公式校對」prompt

### 1.1 觸發時機

- **頁面**：`/learn/worksheet/03`（卡片 3 — 把抱怨變成卡關公式）
- **按鈕**：「請 AI 幫我校對句子」（位於使用者填寫 `stuck_formula.user_draft` 之後）
- **前置條件**：卡 1 與卡 2 已寫好（`complaint.verbatim`、`people.list[*]` 已備齊）

### 1.2 Prompt 原文（與 worksheet 一致）

```
我有一個抱怨原句：
[貼上卡片 1 的原句]

抱怨主人翁是：
[貼上卡片 2 的「大概背景」]

請幫我把它整理成「我每次要 ___，都會卡在 ___」這個句型。

規則：
1. 不要替我發明細節，只能用原句裡有的事實
2. 如果原句不夠具體，請列出 3 個我需要再問清楚的問題
3. 不要建議解決方案、不要推薦工具、不要分析市場
4. 直接給我句子，不要解釋為什麼
```

### 1.3 變數插值 placeholder

| Placeholder | 對應欄位 | 必填 |
| :--- | :--- | :--- |
| `[貼上卡片 1 的原句]` | `complaint.verbatim` | ✅ |
| `[貼上卡片 2 的「大概背景」]` | `people.background` | ✅ |

### 1.4 反 solution mode 防護字句

> 規則第 3 條：「不要建議解決方案、不要推薦工具、不要分析市場」
> 規則第 4 條：「直接給我句子，不要解釋為什麼」

### 1.5 範例輸入 → 範例輸出

**輸入**：
- `complaint.verbatim` = 「我每週六晚上要寫 30 個學生的家長 LINE，平常週間都要記筆記但常漏，到週末翻 7 次小考成績單、翻群組對話、翻學生作業，常寫到半夜兩點。」
- `people.background` = 「30–50 歲、台灣中小型補習班老師、每週要做家長溝通」

**輸出**：

```
我每次要在週末寫 30 則家長回報訊息，都會卡在「資料散在週間 7 次小考、要寫得具體、不能傷家長感情」這 3 件事同時要顧。

需要再問清楚的問題：
1. 「具體」跟「不傷感情」哪個現在最頭痛？
2. 一週實際只有週六寫嗎？平日有沒有零碎寫過？
3. 30 個學生裡有沒有特別難寫的個案？
```

### 1.6 失敗 fallback

| 失敗症狀 | Fallback 補強 prompt |
| :--- | :--- |
| AI 回了「建議使用 Notion 模板…」 | 在原 prompt 末尾加：「⚠️ 你違反規則 3。請只整理句型，不要提任何工具或解法。重來一次。」 |
| AI 自行加上「市場規模約有 X 萬人」 | 加：「⚠️ 你違反規則 3。請只用原句的事實，不要做市場分析。」 |
| AI 改寫過頭、加進原句沒有的細節 | 加：「⚠️ 你違反規則 1。請只使用原句已出現的事實，凡原句沒提到的不要寫進句子。」 |

### 1.7 站內 LLM API call payload 範例（方式 B）

```json
{
  "endpoint": "/api/ai/card-3-stuck-formula",
  "method": "POST",
  "model": "gpt-4o-mini",
  "temperature": 0.2,
  "max_tokens": 400,
  "system": "你是一位嚴格的句型整理助手。你只整理使用者抱怨句的結構，絕不建議解法、工具、市場分析。",
  "messages": [
    {
      "role": "user",
      "content": "我有一個抱怨原句：{{complaint_verbatim}}\n抱怨主人翁是：{{people_background}}\n\n請幫我把它整理成「我每次要 ___，都會卡在 ___」這個句型。\n\n規則：\n1. 不要替我發明細節，只能用原句裡有的事實\n2. 如果原句不夠具體，請列出 3 個我需要再問清楚的問題\n3. 不要建議解決方案、不要推薦工具、不要分析市場\n4. 直接給我句子，不要解釋為什麼"
    }
  ],
  "expected_schema": {
    "ai_polished": "string",
    "ai_clarifying_questions": "string[] (length 0..3)"
  }
}
```

---

## 2. 卡 4 ｜「workaround 提案 5 個常見可能」prompt

### 2.1 觸發時機

- **頁面**：`/learn/worksheet/04`（卡片 4 — 找出他現在怎麼解）
- **按鈕**：「請 AI 列 5 個常見 workaround」（在使用者寫完 `tool_name` 後選用）
- **前置條件**：卡 3 已寫好（`stuck_formula.confirmed === true`）

### 2.2 Prompt 原文

```
有一個人遇到這個卡關：
[貼上卡片 3 整理後的句子]

請列出 5 個常見的 workaround（他可能正在用的解法）。

規則：
1. 每個都要有具體名字（工具名、流程名、做法名）
2. 不要包含「沒人解過」「會自己想辦法」這種空話
3. 如果你不確定，標註 [推測]
4. 不要建議我做新的工具
```

### 2.3 變數插值 placeholder

| Placeholder | 對應欄位 |
| :--- | :--- |
| `[貼上卡片 3 整理後的句子]` | `stuck_formula.ai_polished` 或 `stuck_formula.user_draft` |

### 2.4 反 solution mode 防護字句

> 規則第 4 條：「不要建議我做新的工具」
> 規則第 2 條：「不要包含『沒人解過』『會自己想辦法』這種空話」

### 2.5 範例輸入 → 範例輸出

**輸入**：「我每次要在週末寫 30 則家長回報訊息，都會卡在『資料散在週間 7 次小考、要寫得具體、不能傷家長感情』這 3 件事同時要顧。」

**輸出**：
```
1. Notion 模板（標準學生回報模板）
2. Google Sheets + 公式（自動拉成績）
3. 班級管理 App（如 Aimer、補教雲、1 對 1 補教系統）
4. 助教代寫
5. ChatGPT 寫稿機（直接餵成績丟出草稿）[推測：依據常見補教圈做法]
```

### 2.6 使用後的人工流程

> ⚠️ 重點：AI 列完不是終點。worksheet 規定「**把 AI 列出的清單拿去問主人翁**：『這幾個你有用過嗎？哪個最像你的狀況？』」站內版本應提示使用者「拿這 5 個回去問卡 2 的人，把不滿理由寫回欄位 `workaround.user_dissatisfactions`（至少 3 個）」。

### 2.7 失敗 fallback

| 失敗症狀 | Fallback |
| :--- | :--- |
| AI 列出「應該開發一個 App」之類 | 「⚠️ 你違反規則 4。請只列現有的工具或做法名稱，不要建議我做新東西。」 |
| AI 給的都是抽象詞如「整理工具」 | 「請給每個項目具體名字（產品名、流程名、做法名），不要用『整理工具』這種統稱。」 |
| AI 列少於 5 個 | 「請列滿 5 個。如果想不到 5 個，把第 4、第 5 個標 [推測] 也可以。」 |

### 2.8 站內 LLM API payload

```json
{
  "endpoint": "/api/ai/card-4-workaround-list",
  "model": "gpt-4o-mini",
  "temperature": 0.3,
  "max_tokens": 500,
  "messages": [
    { "role": "system", "content": "你只列現有 workaround，不建議新工具，不討論市場規模。" },
    { "role": "user", "content": "有一個人遇到這個卡關：{{stuck_formula_polished}}\n\n請列出 5 個常見的 workaround...（其餘同 worksheet）" }
  ],
  "expected_schema": {
    "ai_alternatives": "string[] (length = 5)"
  }
}
```

---

## 3. 卡 5 ｜「取捨自陳協助」prompt

> AI 的唯一角色是**協助使用者用自己的話**寫出兩端，並寫出**為什麼那邊會被犧牲**。AI 不給編號、不給分類學標籤、不從固定選項挑。

### 3.1 觸發時機

- **頁面**：`/learn/worksheet/05`（卡片 5 — 兩件事不能同時要）
- **按鈕**：「請 AI 協助我釐清取捨」
- **前置條件**：卡 3、卡 4 都已寫好

### 3.2 Prompt 原文（蘇格拉底式）

```
有一個人遇到這個卡關：
[貼上卡片 3]

他現在用：
[貼上卡片 4]

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

### 3.3 變數插值

| Placeholder | 對應欄位 |
| :--- | :--- |
| `[貼上卡片 3]` | `stuck_formula.ai_polished` |
| `[貼上卡片 4]` | `workaround.tool_name` + `workaround.why_still_stuck` |

### 3.4 反 solution mode 防護字句

> 規則第 1 條：「不要給編號、不要給分類學標籤」 — 不允許 AI 偷渡任何分類框架
> 規則第 2 條：「不要建議解決方案、不要推薦工具」
> 規則第 3 條：「不要替我下判斷說『他應該犧牲 X』」 — AI 只觀察現況，不給規範性建議
> 規則第 5 條：提供退場機制（卡 3 沒拆乾淨時 AI 可中性建議使用者回頭重想）

### 3.5 範例輸入 → 範例輸出

**輸出**（不再有「我選第 N 種」這種編號）：

```
A 端（他想要這個）：
家長要看見「我的孩子」被個別關照，要具體事件（這週這個學生哪一題答錯）、要有溫度（不要罐頭話）。

B 端（他也想要這個）：
他一週只有 2-3 小時可寫 30 則，每則必須 < 6 分鐘，否則整週的備課時間會被吃掉。

通常會犧牲：A 端
為什麼會被犧牲：因為時間是硬上限（家長期待週日早上前要收到），而具體性可以靠模板偷工。一旦時間壓力出現，老師會選擇「先有訊息發出去」勝過「訊息有溫度」。家長會察覺，但抱怨後老師仍會在下次重複同樣選擇——時間是不可協商的，溫度是可協商的。
```

### 3.6 失敗 fallback

| 失敗症狀 | Fallback |
| :--- | :--- |
| AI 還是給編號 / 標籤（如「這屬於 Speed vs Quality 矛盾」） | 「請刪除任何編號或分類學標籤。我只想看主人翁的話，不要看你的分類框架。」 |
| AI 推薦解法（「他應該用 Notion 模板自動填」） | 「你違反規則 2。請刪除任何工具或解法建議，只描述現況的取捨。」 |
| AI 給規範性判斷（「他應該犧牲 B 端比較好」） | 「請改寫成『他現況通常會犧牲 X 端』，不要給規範性建議。我要看的是現況，不是你的意見。」 |
| A、B 兩端都太抽象 | 「請用主人翁的話、具體事件 / 量化描述。把『品質好』改成具體的『家長看到罐頭話會私訊抱怨』之類。」 |
| AI 回「卡關句還沒拆清楚」 | 系統把這個訊息中性顯示給使用者，並建議「回去把卡 3 想得更具體再來」 |

### 3.7 站內 LLM API payload

```json
{
  "endpoint": "/api/ai/card-5-tradeoff-articulation",
  "model": "gpt-4o-mini",
  "temperature": 0.3,
  "max_tokens": 500,
  "expected_schema": {
    "side_a": "string (用主人翁的話)",
    "side_b": "string (用主人翁的話)",
    "sacrificed": "a | b | null (null 表示 AI 認為卡關句還沒拆清楚)",
    "sacrificed_reason": "string (為什麼那邊會被犧牲，至少 1 句完整描述)"
  },
  "post_validation": "若 sacrificed === null，前端中性顯示「AI 認為卡關句可以再拆細一點，要不要回去把卡 3 想清楚再來？」（不強制跳轉，使用者自選）"
}
```

---

## 4. 卡 6 ｜「8 題證據蒐集」prompt（最重要）

### 4.1 觸發時機

- **頁面**：`/learn/worksheet/06`（卡片 6 — 用 AI 蒐集證據）
- **按鈕**：「複製 prompt 到外部 AI」或「使用站內 AI 跑研究」
- **前置條件**：卡 1-5 都寫好（系統需要 5 個欄位才能組裝 prompt）

> ⚠️ 這是 9 卡中**最重要、最長、最容易失敗**的 prompt。整段 worksheet 規範這支 prompt 的核心反 solution mode 防護是「請不要幫我設計產品，也不要提出商業模式」。

### 4.2 Prompt 原文

```
我想研究一個可能的痛點：

「[貼上卡片 3 的卡關公式]」
痛點主人翁特徵：[貼上卡片 2 的「大概背景」]
他現在用：[貼上卡片 4 的方法]
不滿之處：[貼上卡片 4 的 3 個理由]

⚠️ 重要規則：
- 請不要幫我設計產品，也不要提出商業模式
- 請不要建議 App、SaaS、解決方案
- 請只做痛點探索與證據蒐集

請回答以下 8 題：
1. 哪些具體人群最常遇到這個問題？請列 3–5 群（要有具體職業/角色，不要寫「上班族」這種模糊詞）
2. 這個問題通常在什麼場景發生？頻率多高？
3. 他們現在怎麼解決？請列 5 個具體 workaround（工具名/流程名）
4. 現有解法有哪些不滿？請分成：時間成本、品質壓力、情緒壓力、資料整理壓力、其他
5. 有哪些公開證據支持這個痛點？請找：論壇、社群、產業文章、工具評論、搜尋趨勢
6. 這個痛點背後真正的 Job-to-be-Done 是什麼？
7. 哪些可能是假痛點？也就是看起來很煩，但其實不夠頻繁、不夠痛、或已經被現有工具解決
8. 如果我要做真人訪談，最應該訪談哪 5 種人？每種人給 3 個訪談問題

不要對任何結論加裝飾性評論。如果某題你不確定，標 [推測]。
```

### 4.3 變數插值

| Placeholder | 對應欄位 |
| :--- | :--- |
| `[貼上卡片 3 的卡關公式]` | `stuck_formula.ai_polished` |
| `[貼上卡片 2 的「大概背景」]` | `people.background` |
| `[貼上卡片 4 的方法]` | `workaround.tool_name` |
| `[貼上卡片 4 的 3 個理由]` | `workaround.user_dissatisfactions[]` |

### 4.4 反 solution mode 防護字句（三道防線）

1. 「請不要幫我設計產品，也不要提出商業模式」
2. 「請不要建議 App、SaaS、解決方案」
3. 「請只做痛點探索與證據蒐集」

> ⚠️ 這三句必須**完整保留**，不可拆任何一句。worksheet 明文：「最重要的一句是『請不要幫我設計產品，也不要提出商業模式』」。

### 4.5 寫入欄位

| 欄位 | 寫入規則 |
| :--- | :--- |
| `ai_evidence.eight_answers.q1_specific_groups` | 8 題的第 1 題答案 |
| `ai_evidence.eight_answers.q2_scenes_frequency` | 第 2 題 |
| `ai_evidence.eight_answers.q3_workarounds` | 第 3 題 |
| `ai_evidence.eight_answers.q4_dissatisfactions_categorized` | 第 4 題 |
| `ai_evidence.eight_answers.q5_public_evidence` | 第 5 題 |
| `ai_evidence.eight_answers.q6_jtbd` | 第 6 題 |
| `ai_evidence.eight_answers.q7_possible_fake_pains` | 第 7 題 |
| `ai_evidence.eight_answers.q8_interview_targets` | 第 8 題 |
| `ai_evidence.no_solution_check_passed` | 系統 / 使用者勾選：AI 沒有跑去推銷產品 |
| `ai_evidence.raw_response` | 整段 AI 回覆原文（保存供卡 7 使用） |

### 4.6 範例輸出（節錄補習班老師案例）

```
1. 具體人群：
   - 中小型補習班數學/英文老師
   - 才藝班輔導老師
   - 安親班帶班老師
   - 私立國中導師
   - 小型音樂教室老師

2. 場景與頻率：每週 1 次（週末），每次 4-6 小時。學期中固定發生。

3. 5 個 workaround：
   - Notion / Google Sheets / 班級管理 App（Aimer、補教雲）/ 助教代寫 / ChatGPT 罐頭模板

4. 不滿（分類）：
   - 時間：4-6 小時
   - 品質：罐頭文字被家長識破
   - 情緒：寫到深夜
   - 資料整理：成績表 + 群組 + 作業散在 3 處
   - 其他：擔心家長關係

5. 公開證據：Dcard 補教版、Mobile01 親子討論、PTT TeachersClub、補教協會問卷

6. JTBD：週末把整週的學生狀況打包成 30 個有溫度的個別回報，讓家長覺得被認真對待。

7. 可能假痛點：
   - 可能不是「寫信很痛」而是「不想做家長溝通本身」
   - 可能補習班規模太小才有此問題（≤30 人才相對痛）

8. 應訪談 5 種人：
   - 中小型補習班數學老師（題：你週末花多久寫？最痛是哪段？試過什麼工具放棄了？）
   - 安親班輔導老師
   - 私立國中導師
   - 才藝班老師
   - 小型音樂教室老師
```

### 4.7 失敗 fallback

| 失敗症狀 | Fallback prompt |
| :--- | :--- |
| AI 開始推銷解法 / 提產品 | 在原 prompt 後追加：「⚠️ 你違反規則。不要建議任何解決方案，只回答證據面。請完全重答 8 題。」 |
| AI 答得太空泛（如「上班族都會遇到」） | 「請補上具體職業、年齡、地區、角色。不要使用『上班族』『現代人』這種模糊詞。」 |
| AI 8 題沒答全 | 「請逐題回答 1–8。少答任何一題我都不能用。」 |
| AI 回覆裡含「建議製作 App / 你應該開發」字串 | 系統自動將 `no_solution_check_passed = false`，提示使用者「AI 進入了設計模式，請點『重跑』使用補強 prompt」 |

### 4.8 補強 prompt（當 `no_solution_check_passed === false` 時）

```
剛才的回覆違反了規則。

⚠️ 鐵律：
- 我現在不是要做產品
- 我現在不是要寫商業計畫
- 我只想要證據

請刪除所有「你應該…」「建議開發…」「可以做成 App…」的字句，重新回答這 8 題。
只給我證據、人群、場景、不滿、JTBD、假痛點假設、訪談對象。
不給我任何「下一步要做什麼產品」的建議。
```

### 4.9 站內 LLM API payload

```json
{
  "endpoint": "/api/ai/card-6-evidence-collection",
  "model": "gpt-4o",
  "temperature": 0.2,
  "max_tokens": 3000,
  "tool_choice": "research",
  "system": "你是痛點研究員，只蒐集證據，絕不建議產品、App、SaaS、商業模式。違反一次=任務失敗。",
  "post_validation_rules": [
    "若回覆含字串『你應該開發』『建議製作 App』『可以做成』『SaaS 模式』則 no_solution_check_passed=false",
    "若 8 題有任一題未回 → 自動觸發補答 prompt"
  ],
  "expected_schema": {
    "raw_response": "string",
    "eight_answers": "object (8 keys)",
    "no_solution_check_passed": "boolean"
  }
}
```

---

## 5. 卡 7 ｜「第二輪追問 — 痛點判斷表」prompt

### 5.1 觸發時機

- **頁面**：`/learn/worksheet/07`（卡片 7 — 自己先猜，再讀 AI 回覆）
- **按鈕**：「請 AI 整理痛點判斷表」（在使用者完成 4 個檢查點後）
- **前置條件**：使用者已先寫下自己的 4 個猜測（`self_guess.guesses` 全填）；卡 6 的 `eight_answers` 全備齊

### 5.2 Prompt 原文

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

### 5.3 變數插值

> ⚠️ 此 prompt 在原 worksheet 設計上是**第二輪追問**，必須接在卡 6 對話之後。
> 站內版本：把 `ai_evidence.raw_response` 作為對話前文（system context），再附上此 prompt。
> 外部版本：使用者直接在卡 6 對話框後貼此 prompt。

| Placeholder | 對應欄位 |
| :--- | :--- |
| 「上面的研究」 | `ai_evidence.raw_response`（前一輪 AI 8 題回覆） |

### 5.4 反 solution mode 防護字句

> 「判斷標準只看痛點強度與證據，不看商業模式、不看技術可行性」

### 5.5 4 個檢查點（先讓使用者自評）

| 檢查點 | 反思問題 | PainCard 欄位 |
| :--- | :--- | :--- |
| 1 | 它有沒有把人群切細？（具體職業 / 場景，不是「上班族」） | `self_guess.ai_checkpoints_passed.people_segmented` |
| 2 | 它有沒有找到發生場景？（時間+地點+動作） | `self_guess.ai_checkpoints_passed.scenes_observable` |
| 3 | 它有沒有提出現有解法的不滿？（≥3 個 workaround 各有不滿） | `self_guess.ai_checkpoints_passed.workaround_dissatisfactions_listed` |
| 4 | 它有沒有提醒哪些可能是假痛點？（≥1 個假痛點假設） | `self_guess.ai_checkpoints_passed.fake_pains_flagged` |

> 4 點任一還沒勾起來 → 建議回去把卡 6 補資訊重跑再來看判斷表。

### 5.6 範例輸出

```
痛點判斷表：

| 目標人群 | 發生場景 | 頻率 | 現在解法 | 主要不滿 | 可查證證據 | 應訪談誰 | 訪談第一題 |
| 中小型補習班數學老師 | 週六 21:00-02:00 教師桌前 | 每週 1 次 | LINE+Excel+群組翻找 | 時間/品質 | Dcard 補教版 8 篇 | 林老師 | 你週末花多久寫家長 LINE？ |
| ...（共 5 列）

最值得優先研究：中小型補習班數學老師
理由：頻率最高（每週固定）+ 工具拼貼最雜（5 個資料源）+ 公開證據最多（Dcard 8 篇）+ 可立即聯絡到 3 位真人。
其他人群為何不優先：
- 才藝班：頻率較低（兩週一次）
- 安親班：規模太小，不滿沒到 4-6 小時等級
- 私立國中導師：有學校系統部分支持
- 音樂教室：樣本太稀，公開證據不足
```

### 5.7 失敗 fallback

| 失敗症狀 | Fallback |
| :--- | :--- |
| 表格欄位被偷工，沒寫場景或頻率 | 「請補完每一格。空欄不接受。」 |
| AI 推薦了「建議用什麼商業模式」 | 「請刪掉所有商業模式建議，只看痛點強度與證據。」 |
| AI 沒挑出優先人群 | 「請從表格中挑 1 個你最有信心的人群，並用 1 段話說明為什麼不是其他人群。」 |

### 5.8 站內 LLM API payload

```json
{
  "endpoint": "/api/ai/card-7-judgment-table",
  "model": "gpt-4o-mini",
  "temperature": 0.2,
  "max_tokens": 2000,
  "messages": [
    { "role": "system", "content": "你是痛點研究員，只整理表格，不評估商業模式或技術可行性。" },
    { "role": "user", "content": "{{ai_evidence_raw_response}}" },
    { "role": "user", "content": "請把上面的研究整理成一張「痛點判斷表」...（其餘同 worksheet）" }
  ],
  "expected_schema": {
    "pain_judgment_table": "string (markdown table)",
    "priority_persona": "string",
    "priority_reason": "string"
  }
}
```

---

## 6. 卡 8 ｜「AI 模擬訪談熱身」prompt

### 6.1 觸發時機

- **頁面**：`/learn/worksheet/08`（卡片 8 — 真人訪談規劃）
- **按鈕**：「請 AI 模擬訪談（熱身）」（可選，非必填）
- **前置條件**：使用者已寫完 3 個訪談題、選好 ≥1 個訪談對象

### 6.2 Prompt 原文

```
我準備訪談一個 [貼上訪談對象]。
我的痛點假設是：[貼上卡片 3]

請扮演這個受訪者，根據常見現況回答我這 3 題：
1. [貼上你的訪談題 1]
2. [貼上你的訪談題 2]
3. [貼上你的訪談題 3]

回答時請：
- 不要美化、不要奉承
- 用真實生活的口吻
- 如果現況其實沒那麼痛，請直接說
- 不要假裝自己會付錢買 App
```

### 6.3 變數插值

| Placeholder | 對應欄位 |
| :--- | :--- |
| `[貼上訪談對象]` | `interview_plan.targets[0].persona` |
| `[貼上卡片 3]` | `stuck_formula.ai_polished` |
| `[貼上你的訪談題 1-3]` | `interview_plan.questions[0..2]` |

### 6.4 反 solution mode 防護字句

> 「不要美化、不要奉承」
> 「如果現況其實沒那麼痛，請直接說」
> 「不要假裝自己會付錢買 App」

### 6.5 ⚠️ 使用限制

> 「AI 模擬只能當熱身練習，**不能取代真人訪談**。」

站內 UI 必須在這個按鈕旁邊持續顯示提示：「這只是熱身。真痛點 / 假痛點的判斷一定要去問真人（卡 2 的 3 個人）。」

### 6.6 範例輸出

```
受訪者（補習班老師角色）：

1. Q：你最近一次寫家長回報是什麼時候？花了多久？
A：上週六啊，從晚上九點寫到凌晨快兩點。30 個學生。
之前試過先在週間零碎寫，但補習現場一忙就忘記，最後還是週末擠在一起。

2. Q：你現在用什麼方法在解這個問題？試過什麼放棄了？
A：LINE 是主力，加上 Excel 成績表跟翻群組對話。
Notion 試過一個月，太花時間貼來貼去就放棄了。
ChatGPT 試過產草稿，太罐頭，家長一看就知道沒在用心。

3. Q：你現在花多少時間在做這件事？最不滿意哪一段？
A：每週 4-6 小時跑不掉。
最不滿意的是「資料散在三個地方要手動翻」這段，
寫得內容反而還好，因為我認識每個學生。
```

### 6.7 失敗 fallback

| 失敗症狀 | Fallback |
| :--- | :--- |
| AI 演得太順、太正面 | 「演得不夠真實。請加入猶豫、抱怨、卡住的口吻，不要美化。」 |
| AI 自願「我會付錢」 | 「你違反規則。請不要假裝自己會付錢買 App。重來。」 |
| AI 給出產品建議「我希望有一個工具能…」 | 「不要演成『產品需求方』。只說現況，不說想要什麼。」 |

### 6.8 站內 LLM API payload

```json
{
  "endpoint": "/api/ai/card-8-interview-warmup",
  "model": "gpt-4o-mini",
  "temperature": 0.6,
  "max_tokens": 1500,
  "messages": [
    { "role": "system", "content": "你扮演真實受訪者，會猶豫、會抱怨、不奉承、不假裝會付錢。" },
    { "role": "user", "content": "我準備訪談 {{persona}}...（其餘同 worksheet）" }
  ],
  "expected_schema": {
    "ai_simulated_response": "string"
  },
  "ui_disclaimer": "AI 模擬只能當熱身練習，不能取代真人訪談。"
}
```

---

## 7. 卡 1 / 卡 2 / 卡 9 ｜ 不可使用 AI

| 卡片 | 不能讓 AI 代填的理由 |
| :--- | :--- |
| 卡 1 | AI 不能代替你聽真人說話。原句必須來自真人。 |
| 卡 2 | AI 會生「合成 persona」（虛構的人），但虛構的人不會付錢。 |
| 卡 9 | 真假判斷必須由你自己寫。AI 可幫你紅隊（red-team），但不能代你下判斷。 |

> 站內這 3 頁**禁止顯示 AI 按鈕**。即使有 LLM API 可用，也不開放這 3 頁呼叫。
>
> **卡 9 特別強化**：判斷層所有欄位（judgment、reason_100w、most_confident_evidence、least_confident、next_action）一律由使用者親自寫。任何「AI 幫你檢查 reason」「AI 推薦 next_action」之類的功能皆**永久禁用**。

---

## 8. Prompt 共通設計檢核（PR review checklist）

新增或修改任何 prompt 時，逐項檢查：

- [ ] 是否與 worksheet 卡 3-8 的 prompt 文字 100% 一致？
- [ ] 三道反 solution mode 防護字句是否齊全（卡 6 必須三句；其他卡至少一句）？
- [ ] 是否包含 `[貼上卡片 N 的 ___]` placeholder，命名與 data_model.md 欄位對得上？
- [ ] 是否提供失敗 fallback prompt？
- [ ] 是否同時提供「外部複製」與「站內 API call」兩種使用方式？
- [ ] 卡 1 / 卡 2 / 卡 9 是否仍維持「不開放 AI 按鈕」？
- [ ] payload 範例是否標明 `expected_schema`，能對應到 PainCard 欄位？
- [ ] 是否確認沒有任何 prompt 要求 AI 給「分數」「等級」「分類學編號」「分類學標籤」？
- [ ] 卡 5 prompt 是否完全不要求 AI 從固定選項挑一個？
