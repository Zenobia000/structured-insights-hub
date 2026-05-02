# AI Prompt Test Cases — 7 段內建 Prompt 品質測試

> **版本**：v1.0 — 2026-05-01
> **配套文件**：`references/ai_prompt_library.md`、`api/ai_proxy_spec.md`、`product/data_model.md`
> **測試對象**：7 段內建 prompt（卡 3-8 + 卡 6 fallback 補強 prompt）
> **核心目的**：驗證 AI 回覆品質一致性 + 反 solution mode 防護有效 + BYOK 安全
> **核心鐵律**：**反 solution mode** — AI 任何時候都不可建議解決方案、不可推薦工具、只做痛點探索。違反此鐵律的回應視為不合格、必須擋下。

---

## 0. 測試方法總綱

### 0.1 測試矩陣

| 維度 | 範圍 |
| :--- | :--- |
| Prompt 段數 | 7 段（卡 3 / 4 / 5 / 6 / 6-fallback / 7 / 8）|
| AI 模型 | GPT-4o（OpenAI）/ Claude Sonnet 3.5（Anthropic）/ Gemini 1.5 Pro（Google）|
| 重複次數 | 每組 prompt × 模型跑 5-10 次（temperature 影響採樣）|
| 評估方式 | 規則式自動驗證（90%）+ 人工抽檢（10%）|

### 0.2 評估標準（每個 test case 都包含）

```
通過 = 全部 assertion 通過
警告 = 有 1-2 條 soft assertion 失敗（記錄但放行）
失敗 = 任一 hard assertion 失敗（阻擋過關）
```

### 0.3 測試框架

```typescript
// 使用 Vitest + 自訂 evaluator
describe('Card 6 - Evidence Collection Prompt', () => {
  const models = ['gpt-4o', 'claude-3-5-sonnet', 'gemini-1.5-pro'];
  const iterations = 5;

  for (const model of models) {
    for (let i = 1; i <= iterations; i++) {
      it(`${model} run ${i}: 8 題全有答`, async () => {
        const response = await runPrompt({ promptId: 'p6_evidence_research', model, ...fixtures });
        expect(response).toMatchAll8Questions();
        expect(response).not.toBeInSolutionMode();
        expect(response).toHaveSpecificPersonas();
      });
    }
  }
});
```

### 0.4 共用 assertion helpers

```typescript
// helpers/assertions.ts
export function expectNotSolutionMode(text: string) {
  const FORBIDDEN = [
    /建議.{0,10}(製作|開發|做一個|打造).{0,10}(App|產品|平台|軟體|工具)/,
    /你應該.{0,10}(開發|設計|做)/,
    /可以做一個.{0,20}(App|產品)/,
    /推薦.{0,20}(產品|工具)是/,
    /商業模式可以/,
    /MVP.{0,10}(可以|建議|做)/,
    /SaaS.{0,10}(可以|建議)/,
    /(訂閱|付費|商業化)\s*策略/,
  ];
  for (const pattern of FORBIDDEN) {
    expect(text).not.toMatch(pattern);
  }
}

export function expectHasSpecificPersonas(text: string) {
  // 不可只用模糊詞
  const VAGUE = ['上班族', '現代人', '使用者', '客戶', '一般人', '大眾'];
  for (const term of VAGUE) {
    expect(text).not.toMatch(new RegExp(`(^|[^」])${term}(都|常|會)`));
  }
  // 至少要有 3 個具體職業/角色描述
  const SPECIFIC_INDICATORS = [
    /\d+\s*[到-]\s*\d+\s*歲/,
    /(老師|工程師|設計師|護理師|律師|會計師|業務|主管|店長)/,
    /(中小型|大型|私立|公立)/,
  ];
  const matchCount = SPECIFIC_INDICATORS.filter(p => p.test(text)).length;
  expect(matchCount).toBeGreaterThanOrEqual(2);
}
```

---

## 1. 卡 3 ｜「卡關公式校對」prompt

### 1.0 Prompt 來源

`references/ai_prompt_library.md § 1.2`

### 1.1 Test case 3.1: 清晰抱怨 → 期望 AI 整理出具體 X / Y + 不超過 3 個追問

**Given**:

```yaml
complaint.verbatim: |
  我每週六晚上要寫 30 個學生的家長 LINE，平常週間都要記筆記但常漏，
  到週末翻 7 次小考成績單、翻群組對話、翻學生作業，常寫到半夜兩點。
people.background: 「30-50 歲、台灣中小型補習班老師、每週要做家長溝通」
```

**When**: 跑 prompt 5 次（temperature=0.2）

**Then**（每次都需通過）:

| Assertion | 規則 | 嚴重度 |
| :--- | :--- | :--- |
| 句型符合「我每次要 ___，都會卡在 ___」格式 | regex `/我每次要.{5,}?，都會卡在.{5,}?[。]/` | HARD |
| X 部分（要做什麼）含具體動詞 | 不只是「寫東西」，要有「寫家長回報」這種具體動詞 + 受詞 | HARD |
| Y 部分（卡在哪）含具體名詞 | 至少 1 個原句裡有的具體事物（30 個學生 / 7 次小考 / 群組對話 等）| HARD |
| 追問問題 ≤ 3 個 | 列表 length 不超過 3 | HARD |
| 追問問題不含「會付錢嗎」「值得開發嗎」這類推銷題 | 不含 keyword `付錢` / `開發` / `值得做` | HARD |
| 不含解法建議 | `expectNotSolutionMode()` | HARD |
| 不含市場規模分析 | 不含 `市場規模` / `產業趨勢` / `估算 N 萬人` | HARD |

**範例輸出**（`references/ai_prompt_library.md § 1.5`）：

```
我每次要在週末寫 30 則家長回報訊息，都會卡在「資料散在週間 7 次小考、要寫得具體、不能傷家長感情」這 3 件事同時要顧。

需要再問清楚的問題：
1. 「具體」跟「不傷感情」哪個現在最頭痛？
2. 一週實際只有週六寫嗎？平日有沒有零碎寫過？
3. 30 個學生裡有沒有特別難寫的個案？
```

### 1.2 Test case 3.2: 模糊抱怨 → 期望 AI 列出更多追問

**Given**:

```yaml
complaint.verbatim: 「我覺得寫家長 LINE 很煩，每次都搞很久」
people.background: 「補習班老師」
```

**Then**:

| Assertion | 規則 |
| :--- | :--- |
| 追問問題數量 ≥ 2 個（因為原句太模糊）| HARD |
| AI 不應「替使用者編造細節」 | 不可在輸出句中出現原句沒有的具體數字（30 個 / 半夜兩點 等）| HARD |
| AI 不應只回「不夠資訊無法整理」就放棄 | 必須有句型嘗試 + 追問 | HARD |

### 1.3 Test case 3.3: 含解決方案的抱怨 → 期望 AI 不複製方案到輸出

**Given**:

```yaml
complaint.verbatim: |
  我每週寫家長 LINE 寫到半夜，朋友建議我用 Notion 模板，
  但我試了一個月放棄，現在還是手動拼湊。
```

**Then**:

| Assertion | 規則 |
| :--- | :--- |
| 整理後的句型不出現「Notion」這個解法 | 解法應該留在卡 4，不該污染卡 3 句型 | HARD |
| 句型專注於「卡關」本質 | X = 寫家長 LINE，Y = 手動拼湊耗時 | SOFT |

### 1.4 跨模型一致性

跑 GPT-4o / Claude Sonnet / Gemini 各 5 次：

| 模型 | 通過率目標 | 備註 |
| :--- | :--- | :--- |
| GPT-4o | ≥ 90% | 主推 |
| Claude Sonnet | ≥ 90% | 句型整理品質最佳 |
| Gemini 1.5 Pro | ≥ 80% | 偶爾會偏向加細節 |

跨模型輸出風格差異是正常的，但 hard assertion 必須全通過。

---

## 2. 卡 4 ｜「workaround 提案 5 個」prompt

### 2.0 Prompt 來源

`references/ai_prompt_library.md § 2.2`

### 2.1 Test case 4.1: 5 個 workaround 都有具體名字

**Given**:

```yaml
stuck_formula.ai_polished: |
  我每次要在週末寫 30 則家長回報訊息，都會卡在「資料散在週間 7 次小考、
  要寫得具體、不能傷家長感情」這 3 件事同時要顧。
```

**Then**:

| Assertion | 規則 |
| :--- | :--- |
| 列表恰好 5 個項目 | length === 5 | HARD |
| 每項目含具體名稱 | 不可為「整理工具」「管理系統」這種統稱 | HARD |
| 至少 3 個有真實產品名 | 如 Notion / Google Sheets / Excel / Trello / Airtable / 班級管理 App 名 | HARD |
| 不確定的項目須標 `[推測]` | 若 AI 不確定可標註 | SOFT |

### 2.2 Test case 4.2: 不出現「沒人解過」「會自己想辦法」

**Given**: 同 Test case 4.1

**Then**:

| Assertion | 規則 |
| :--- | :--- |
| 任一項目不含 `沒人解過` / `自己想辦法` / `沒有人在解` / `還沒解` | regex 全文掃描 | HARD |
| 任一項目不為純空話 | 字串長度 ≥ 5 字 | HARD |

### 2.3 Test case 4.3: 不建議使用者開發新工具

**Given**: 同上

**Then**:

| Assertion | 規則 |
| :--- | :--- |
| 不出現「開發 App」「製作平台」「打造工具」 | regex `/(開發|製作|打造).{0,5}(App|平台|工具|產品)/` 不觸發 | HARD |
| `expectNotSolutionMode(text)` 全通過 | 8 條 FORBIDDEN_PATTERNS 都不觸發 | HARD |

### 2.4 跨模型測試

跑 5 次每模型，紀錄：

| 模型 | 5 個工具完整率 | 反 solution mode 觸發率 |
| :--- | :--- | :--- |
| GPT-4o | ≥ 95% | ≤ 5% |
| Claude Sonnet | ≥ 95% | ≤ 5% |
| Gemini 1.5 Pro | ≥ 90% | ≤ 10%（偶爾推銷工具）|

---

## 3. 卡 5 ｜「TRIZ 矛盾提案」prompt

### 3.0 Prompt 來源

`references/ai_prompt_library.md § 3.2`

### 3.1 Test case 5.1: 只挑 1 個矛盾（不複選）

**Given**:

```yaml
stuck_formula.ai_polished: 「我每次要寫 30 則...3 件事同時要顧」
workaround.tool_name: 「LINE + Excel + 群組翻找」
workaround.why_still_stuck: 「每個資料源都要重新翻找」
```

**Then**:

| Assertion | 規則 |
| :--- | :--- |
| AI 挑出的 triz_id 恰好 1 個 | regex `/我選第\s*[1-6]\s*種/` 出現 1 次 | HARD |
| 若 AI 試圖挑 2 個 → 視為違規 | 出現 `/第\s*\d+\s*[，與和及]\s*第\s*\d+\s*種/` | HARD |
| 若 6 個都不像 → 必須回「不像，請我退回卡片 3」 | 此為 valid 輸出 | HARD |

### 3.2 Test case 5.2: 用主人翁的話描述兩端

**Given**: 同 Test case 5.1

**Then**:

| Assertion | 規則 |
| :--- | :--- |
| side_a 字串長度 ≥ 8 字 + 含具體場景 | 不可為「品質好」這種抽象詞 | HARD |
| side_b 字串長度 ≥ 8 字 + 含具體場景 | 同上 | HARD |
| 兩端內容須與卡 1-4 上下文相關 | 例如包含「家長」「30 則」「2-3 小時」等 | SOFT |
| 須說明 sacrificed 是 a 或 b | 出現「通常會犧牲：a」或「b」 | HARD |

### 3.3 Test case 5.3: 6 個都不像 → AI 主動退回卡 3

**Given**: 故意給「我覺得很煩」這種完全沒拆乾淨的卡關公式

**Then**:

| Assertion | 規則 |
| :--- | :--- |
| AI 回應應為「不像，請我退回卡片 3」格式 | regex `/(不像|不適合|還沒拆).{0,20}(退回|回到|卡\s*3)/` | HARD |
| AI 不應「硬選」一個矛盾 | 視為違規 | HARD |
| 系統觸發後續行為：自動跳轉卡 3 | 站內前端側 routing | HARD |

### 3.4 跨模型一致性

| 模型 | 「6 個都不像」識別率 | 1 個單選違規率 |
| :--- | :--- | :--- |
| GPT-4o | ≥ 80% | ≤ 5% |
| Claude Sonnet | ≥ 90%（最會說「不像」）| ≤ 3% |
| Gemini 1.5 Pro | ≥ 70% | ≤ 10% |

> Claude Sonnet 在「拒絕硬選」這類判斷上表現最佳。Gemini 偶爾會合併兩個矛盾。

---

## 4. 卡 6 ｜「8 題證據蒐集」prompt（最重要）

### 4.0 Prompt 來源

`references/ai_prompt_library.md § 4.2`

> **這是 7 段 prompt 中最重要的一段。** 包含三道反 solution mode 防護字句必須完整出現。  
> 失敗成本最高（使用者會被 AI 帶偏進 solution mode）。

### 4.1 Test case 6.1: 8 題全有答（不漏題）

**Given**:

```yaml
stuck_formula.ai_polished: 「我每次要在週末寫 30 則家長回報訊息...」
people.background: 「30-50 歲台灣中小型補習班老師」
workaround.tool_name: 「LINE + Excel 成績表 + 翻群組對話」
workaround.user_dissatisfactions: ["Notion 試過放棄", "ChatGPT 太罐頭", "助教請不起"]
```

**Then**:

| Assertion | 規則 |
| :--- | :--- |
| 回應含 8 題答案 | 須能 parse 出 q1-q8 | HARD |
| 每題答案 ≥ 30 字 | 不可短到只有「沒有」「不知道」 | HARD |
| 每題若不確定 → 標 `[推測]` | 允許不確定，但須標註 | SOFT |
| 題目順序須與 prompt 一致 | 第 1 題 → 人群、第 2 題 → 場景頻率... | HARD |

### 4.2 Test case 6.2: 人群有具體職業 / 角色（不只「上班族」）

**Then**:

| Assertion | 規則 |
| :--- | :--- |
| Q1 列出 3-5 個人群 | 數量符合 prompt 要求 | HARD |
| 每個人群有具體職業 | 不只「上班族」「現代人」 — 須含職業名（老師 / 工程師 / 護理師 等）| HARD |
| 至少含 1 個年齡 / 地區 / 規模限定 | 例如「30-50 歲」「台灣」「中小型」| HARD |
| `expectHasSpecificPersonas()` 通過 | 共用 helper | HARD |

**正確範例**（`references/ai_prompt_library.md § 4.6`）:

```
1. 中小型補習班數學/英文老師
2. 才藝班輔導老師
3. 安親班帶班老師
4. 私立國中導師
5. 小型音樂教室老師
```

**錯誤範例**:

```
1. 上班族
2. 學生
3. 老師
4. 客戶
5. 一般人
```

### 4.3 Test case 6.3: 場景有時間 + 地點 + 動作

**Then**（Q2 答案結構）:

| Assertion | 規則 |
| :--- | :--- |
| 含時間描述 | 「每週」「每月」「週六晚上」「上班時段」 | HARD |
| 含地點 / 情境 | 「教師桌前」「補習班結束後」「家中」 | SOFT |
| 含具體動作 | 「翻成績單」「打字」「校對」 | HARD |
| 含頻率量化 | 「每週 1 次」「每月 4 次」 | HARD |

### 4.4 Test case 6.4: ≥ 3 個 workaround 各有不滿點

**Then**（Q3 + Q4 答案）:

| Assertion | 規則 |
| :--- | :--- |
| Q3 列 5 個具體 workaround | 含真實產品名 | HARD |
| Q4 不滿分成 5 類（時間 / 品質 / 情緒 / 資料整理 / 其他）| 與 prompt 規定一致 | HARD |
| 每類至少 1 個具體不滿描述 | 不是「不好」這種空話 | HARD |
| 時間類含具體時數 | 「4-6 小時」「半夜兩點」 | SOFT |

### 4.5 Test case 6.5: ≥ 1 個假痛點假設

**Then**（Q7 答案）:

| Assertion | 規則 |
| :--- | :--- |
| 提出 ≥ 1 個假痛點假設 | 必填 | HARD |
| 假痛點描述「為什麼可能是假的」 | 含「可能不是 X 而是 Y」「規模太小」「已被現有工具解決」等推理 | HARD |
| 不可寫「沒有假痛點」 | 訓練設計上鼓勵自我懷疑 | HARD |

**正確範例**:

```
7. 可能假痛點：
   - 可能不是「寫信很痛」而是「不想做家長溝通本身」
   - 可能補習班規模太小才有此問題（≤30 人才相對痛）
```

### 4.6 Test case 6.6: 沒進 solution mode（最關鍵）

**Then**（全文掃描）:

| Assertion | 規則 |
| :--- | :--- |
| `expectNotSolutionMode(raw_response)` 全通過 | 8 條 FORBIDDEN_PATTERNS 都不觸發 | HARD |
| 不出現「建議製作 App」 | regex 不觸發 | HARD |
| 不出現「你應該開發」 | regex 不觸發 | HARD |
| 不出現「可以做成 SaaS」 | regex 不觸發 | HARD |
| 不出現「商業模式」「定價」「訂閱」 | regex 不觸發 | HARD |
| 不出現「市場規模 X 億」 | regex 不觸發 | HARD |

> **此 test case 是整個系統最重要的一條 assertion**。違反成本最高。

### 4.7 Test case 6.7: 證據來源具體（含論壇 / 社群名稱）

**Then**（Q5 答案）:

| Assertion | 規則 |
| :--- | :--- |
| 至少 3 個具體來源 | 不是「網路上有討論」 | HARD |
| 含台灣 / 中文社群（補習班痛點為例）| 如 Dcard / Mobile01 / PTT / FB 社團 | SOFT |
| 含具體版區名 / 標籤 | 「Dcard 補教版」「PTT TeachersClub」 | HARD |
| 不可全部標 `[推測]` | 至少有 1 個明確來源 | SOFT |

### 4.8 跨模型一致性（重點關注）

| 模型 | 8 題完整率 | 反 solution mode 通過率 |
| :--- | :--- | :--- |
| GPT-4o（DR）| ≥ 95% | ≥ 95% |
| Claude Sonnet | ≥ 90% | **≥ 98%**（最遵守規則）|
| Gemini 1.5 Pro | ≥ 85% | ≥ 85%（最容易推銷）|
| Perplexity（Sonar）| ≥ 90% | ≥ 90%（含 web search）|

> **建議**：卡 6 主推 Claude Sonnet 或 Perplexity（前者守規矩，後者有 web search 證據力強）。

---

## 5. 卡 6-Fallback ｜「補強 prompt」（當 no_solution_check_passed === false）

### 5.0 Prompt 來源

`references/ai_prompt_library.md § 4.8`

### 5.1 Test case 6F.1: 觸發後 AI 須清理之前的 solution mode 內容

**Given**:

```yaml
previous_response: |
  ...
  基於以上分析，建議製作 App 解決家長 LINE 痛點。
  你應該開發一個 SaaS 平台，每月訂閱 990 元...
  商業模式可以採用 freemium。
context: 補強 prompt 已注入
```

**Then**:

| Assertion | 規則 |
| :--- | :--- |
| 新回應不含「建議製作 App」 | regex 不觸發 | HARD |
| 新回應不含「商業模式」 | regex 不觸發 | HARD |
| 新回應不含「訂閱」「定價」 | regex 不觸發 | HARD |
| 新回應仍完整覆蓋 8 題 | 不可只刪 solution mode 而漏題 | HARD |
| 新回應「沒有評論之前錯誤」 | 不出現「我之前的建議」這種對話痕跡（影響 raw_response 解析）| SOFT |

### 5.2 Test case 6F.2: 補強 prompt 重試一次仍違規 → 不可再 retry

**Given**: 補強 prompt 已注入第 1 次仍違規

**Then**:

| Assertion | 規則 |
| :--- | :--- |
| 系統不再自動重試（M2+ 站內 LLM）| 避免 infinite loop | HARD |
| 回 422 SOLUTION_MODE_DETECTED | API 規範 | HARD |
| UI 提示「AI 一直在推方案。請改用 Claude，或手動填寫」 | 引導切換模型 / 手動 | HARD |

---

## 6. 卡 7 ｜「第二輪追問 — 痛點判斷表」prompt

### 6.0 Prompt 來源

`references/ai_prompt_library.md § 5.2`

### 6.1 Test case 7.1: 表格欄位完整

**Given**:

```yaml
context: 卡 6 raw_response 已完成
ai_evidence.eight_answers: 完整 8 題
```

**Then**（解析輸出表格）:

| Assertion | 規則 |
| :--- | :--- |
| 表格含 8 個欄位 | 目標人群 / 發生場景 / 頻率 / 現在解法 / 主要不滿 / 證據 / 訪談對象 / 第一題 | HARD |
| 表格 ≥ 5 列（即 5 個人群）| 對應 q8 的 5 種人 | HARD |
| 每格非空 | 「請補完每一格。空欄不接受。」（fallback rule）| HARD |
| 場景含時間 + 地點 + 動作 | 同 6.3 規則 | HARD |
| 訪談第一題不是推銷題 | 不含「會付錢嗎」「值得做嗎」 | HARD |

### 6.2 Test case 7.2: 挑出最值得優先研究的 1 個人群 + 說明理由

**Then**:

| Assertion | 規則 |
| :--- | :--- |
| 表格後須有「priority_persona」段落 | 出現「最值得優先研究」字樣 | HARD |
| 挑出恰好 1 個人群 | 不可挑 2 個 | HARD |
| 挑出後須說明「為什麼不是其他人群」 | 對其他 4 個人群各給簡短理由 | HARD |
| 理由用「痛點強度 + 證據」框架 | 不可用「商業模式」「市場規模」 | HARD |

**正確範例**（`references/ai_prompt_library.md § 5.6`）:

```
最值得優先研究：中小型補習班數學老師
理由：頻率最高（每週固定）+ 工具拼貼最雜（5 個資料源）+ 公開證據最多（Dcard 8 篇）+ 可立即聯絡到 3 位真人。
其他人群為何不優先：
- 才藝班：頻率較低（兩週一次）
- 安親班：規模太小，不滿沒到 4-6 小時等級
- 私立國中導師：有學校系統部分支持
- 音樂教室：樣本太稀，公開證據不足
```

### 6.3 Test case 7.3: 判斷標準只看痛點強度與證據（不看商業模式 / 技術可行性）

**Then**:

| Assertion | 規則 |
| :--- | :--- |
| 不出現「商業模式」「技術可行」「實作難度」 | regex 全文掃描 | HARD |
| 不出現「市場規模」「TAM/SAM/SOM」 | regex 不觸發 | HARD |
| 出現「痛點強度」「頻率」「不滿」「證據」等正向 keyword | 至少 3 個 | SOFT |
| 不出現「估算 X 萬人」等市場估算 | regex 不觸發 | HARD |

### 6.4 跨模型一致性

| 模型 | 表格完整率 | 反商業化通過率 |
| :--- | :--- | :--- |
| GPT-4o | ≥ 90% | ≥ 85% |
| Claude Sonnet | ≥ 95% | ≥ 95% |
| Gemini 1.5 Pro | ≥ 80% | ≥ 70%（偶爾插入市場分析）|

---

## 7. 卡 8 ｜「AI 模擬訪談熱身」prompt

### 7.0 Prompt 來源

`references/ai_prompt_library.md § 6.2`

### 7.1 Test case 8.1: 用真實生活口吻（不奉承）

**Given**:

```yaml
interview_plan.targets[0].persona: 「中小型補習班老師」
stuck_formula.ai_polished: 「我每次要在週末寫 30 則家長回報...」
interview_plan.questions: [
  "你最近一次寫家長回報是什麼時候？花了多久？",
  "你現在用什麼方法解？試過什麼放棄了？",
  "你最不滿意哪一段？"
]
```

**Then**:

| Assertion | 規則 |
| :--- | :--- |
| 含 3 個受訪者答案（對應 3 題）| 結構與 prompt 對齊 | HARD |
| 答案使用第一人稱 + 口語化 | 「啊」「啦」「嗯」「上週六啊」 | HARD |
| 不出現奉承話 | 不含「這個問題很好」「您說得對」 | HARD |
| 不出現「我會付錢買 App」「我願意訂閱」 | regex 不觸發 | HARD |

**正確範例**（`references/ai_prompt_library.md § 6.6`）:

```
1. Q：你最近一次寫家長回報是什麼時候？花了多久？
A：上週六啊，從晚上九點寫到凌晨快兩點。30 個學生。
之前試過先在週間零碎寫，但補習現場一忙就忘記，最後還是週末擠在一起。
```

### 7.2 Test case 8.2: 若現況不痛 → AI 直接說

**Given**: 故意給「主人翁其實沒在花時間」的 context

```yaml
workaround.user_dissatisfactions: ["其實還好", "沒花太多時間"]
```

**Then**:

| Assertion | 規則 |
| :--- | :--- |
| AI 答案直接表達「其實沒那麼痛」 | 必含類似句「其實還好」「沒到很痛」 | HARD |
| 不假裝痛苦來迎合提問者 | 不會編造痛點 | HARD |
| 此為「健康訊號」— 提示使用者可能是假痛點 | 後續 UI 應引導回卡 9 重評 | SOFT |

### 7.3 Test case 8.3: 不假裝會付錢買 App

**Then**:

| Assertion | 規則 |
| :--- | :--- |
| 不出現「我會付錢」「我願意買」「希望有個 App」 | regex 全文掃描 | HARD |
| 不出現「想要一個工具能...」（產品需求方口吻）| regex 不觸發 | HARD |
| 不出現「有需求」「有市場」 | regex 不觸發 | HARD |
| 答案聚焦「現況」而非「想要什麼」 | 內容含過去式 / 現在式描述事件，不是條件式 | SOFT |

### 7.4 跨模型一致性

| 模型 | 真實口吻通過率 | 反產品需求方通過率 |
| :--- | :--- | :--- |
| GPT-4o | ≥ 80% | ≥ 85% |
| Claude Sonnet | ≥ 90% | ≥ 95% |
| Gemini 1.5 Pro | ≥ 75%（偶爾太正式）| ≥ 80% |

> 卡 8 推薦 Claude — 角色扮演能保持「真實人類」感。

---

## 8. 反 Solution Mode 偵測層（橫跨所有 prompt）

### 8.0 三層偵測架構

對應 `api/ai_proxy_spec.md § 3.4`：

| Layer | 方法 | 觸發時機 |
| :--- | :--- | :--- |
| Layer 1 | Regex（FORBIDDEN_PATTERNS）| 每次 AI 回覆貼回 |
| Layer 2 | LLM-judge（M2+）| Layer 1 通過後二次審查 |
| Layer 3 | 使用者報告 | 「這份回應在推方案，幫我重跑」按鈕 |

### 8.1 Test case ASM.1: Layer 1 regex 正向觸發

```typescript
describe('Layer 1: FORBIDDEN_PATTERNS', () => {
  const POSITIVE_CASES = [
    { text: '建議製作一個 App', expect: true },
    { text: '建議開發 SaaS 平台', expect: true },
    { text: '你應該開發新工具', expect: true },
    { text: '可以做一個產品', expect: true },
    { text: '推薦的產品是 Notion', expect: true },
    { text: '商業模式可以採用 freemium', expect: true },
    { text: 'MVP 可以從訂閱開始', expect: true },
    { text: 'SaaS 建議走 B2B', expect: true },
    { text: '訂閱策略可以分層', expect: true },
  ];
  for (const tc of POSITIVE_CASES) {
    it(`觸發：${tc.text}`, () => {
      expect(detectSolutionMode(tc.text)).toBe(tc.expect);
    });
  }
});
```

### 8.2 Test case ASM.2: Layer 1 regex 不可誤判中性句（false positive）

```typescript
describe('Layer 1: false positive 檢測', () => {
  const NEGATIVE_CASES = [
    // 中性句 — 不該觸發
    { text: '我建議你不要急著做產品，先把痛點看清楚。', expect: false },
    { text: '產品在市場上有很多，使用者用 Notion 居多。', expect: false },
    { text: '商業上常見的做法是手動拼湊。', expect: false },
    { text: 'App 在使用者面前是放大鏡，不是答案機。', expect: false },
    { text: '使用者已經試過 5 個工具都放棄。', expect: false },
    // 列現況描述 — 不該觸發
    { text: '現有解法是 Notion 模板和 Google Sheets。', expect: false },
    { text: '受訪者試過 ChatGPT 罐頭模板放棄。', expect: false },
  ];
  for (const tc of NEGATIVE_CASES) {
    it(`不觸發：${tc.text}`, () => {
      expect(detectSolutionMode(tc.text)).toBe(false);
    });
  }
});
```

> 關鍵：FORBIDDEN_PATTERNS 中所有 `.{0,N}` 的長度上限是反 false positive 的關鍵。  
> 如果改成 `.*` 會誤判第 1、2 條中性句。

### 8.3 Test case ASM.3: Layer 2 LLM-judge（M2+）

**Given**: 一段 borderline 文字（regex 不觸發但語意上推銷）

```
"這類痛點在台灣補教產業很常見，很多老師遇到。建議從小範圍開始試水溫，
未來有機會做成訂閱制。"
```

**When**: 跑 LLM-judge prompt（`api/ai_proxy_spec.md § 3.4 Layer 2`）

**Then**:

| Assertion | 規則 |
| :--- | :--- |
| Judge 輸出 `{violation: true, score: >=6}` | 視為違規 | HARD |
| `reasons` 包含「商業模式建議」或「未來訂閱制」| 解釋為何違規 | SOFT |
| 系統自動觸發補強 prompt 重跑 1 次 | 限重試 1 次 | HARD |

### 8.4 Test case ASM.4: Layer 3 使用者報告

**Given**: AI 回覆通過 Layer 1 + 2，但使用者覺得仍在推方案

**When**: 使用者點「這份回應在推方案，幫我重跑」按鈕

**Then**:

| Assertion | 規則 |
| :--- | :--- |
| 觸發 strict 模式重跑 | 注入更嚴格 system prompt | HARD |
| 重跑後 raw_response 被覆寫 | 舊回應保留在 history（M2+）| SOFT |
| no_solution_check_passed 重新評估 | 由 Layer 1 + 2 判定 | HARD |

---

## 9. BYOK 安全測試

### 9.0 對應規格

`api/ai_proxy_spec.md § 3.7`

### 9.1 Test case BYOK.1: API key 加密存放

**Given**: 使用者在「設定」頁輸入 OpenAI API key `sk-proj-abc123...xyz789`

**When**: 後端收到 key

**Then**:

| Assertion | 規則 |
| :--- | :--- |
| 資料庫儲存的不是明文 | 不可 grep 到 `sk-proj-abc123...xyz789` 全文 | HARD |
| 加密採對稱加密 + KMS managed key | 例如 AWS KMS 或 GCP Cloud KMS | HARD |
| KMS key 不在 application repo | 不可 hardcode 在 source code | HARD |
| 每次使用時動態解密 | 不可在記憶體常駐解密後 key | HARD |

```typescript
// 測試範例（pseudo-code）
test('BYOK key 加密儲存', async () => {
  const userKey = 'sk-proj-abc123-secret-xyz789';
  await api.post('/api/settings/byok', { provider: 'openai', key: userKey });

  // 直接查資料庫
  const stored = await db.query('SELECT api_key_encrypted FROM byok_keys WHERE user_id = ?', [userId]);
  expect(stored.api_key_encrypted).not.toContain('sk-proj-abc123');
  expect(stored.api_key_encrypted).not.toContain('xyz789');
  expect(stored.api_key_encrypted).toMatch(/^enc:v1:.+/);  // 加密格式
});
```

### 9.2 Test case BYOK.2: 日誌僅記前 4 後 4 字元

**Given**: 後端呼叫 LLM provider API

**When**: 寫入 audit log

**Then**:

| Assertion | 規則 |
| :--- | :--- |
| 日誌僅含 `sk-proj-abc1...z789` 形式 | 前 4 字 + 「...」 + 後 4 字 | HARD |
| 不含完整 key | 不可 grep 到 `abc123-secret-xyz789` 中段 | HARD |
| 任何錯誤訊息中也不含完整 key | 即使 LLM provider 401 錯誤，日誌也不洩漏 | HARD |

### 9.3 Test case BYOK.3: key 永不回傳到前端

**Given**: 使用者已設定 BYOK

**When**: 前端發送 GET `/api/settings/byok`

**Then**:

| Assertion | 規則 |
| :--- | :--- |
| Response 不含 key 欄位 | 即使是同一使用者也不回傳 | HARD |
| Response 只含 `{provider, configured: true, key_prefix: 'sk-proj-abc1...'}` | 顯示前 4 + 後 4 字元供確認 | HARD |
| 使用者只能「重新輸入」或「移除」，不能「查看」| UI 強制 | HARD |

### 9.4 Test case BYOK.4: 移除 key 立即從資料庫硬刪除

**When**: 使用者點「移除 API key」

**Then**:

| Assertion | 規則 |
| :--- | :--- |
| 資料庫中該筆記錄被 DELETE（不是 soft delete）| `SELECT * FROM byok_keys WHERE user_id = ?` 回 0 筆 | HARD |
| 任何 cache（Redis 等）也清除 | 下一個請求不可命中 cache | HARD |
| 使用者狀態改為 `byok_enabled = false` | 自動回退到站內額度 | HARD |

### 9.5 Test case BYOK.5: 失效 key 處理

**Given**: 使用者輸入的 OpenAI key 已被 revoke

**When**: 後端呼叫 OpenAI API 時收到 401

**Then**:

| Assertion | 規則 |
| :--- | :--- |
| 回 401 給前端 | 不繼續使用此 key | HARD |
| UI 提示「你的 API key 已失效，請重新輸入或暫時使用站內額度」 | 文案明確 | HARD |
| 不自動切換 provider | 避免悄悄消耗站內額度（用戶意外）| HARD |
| Audit log 記「BYOK_KEY_INVALID」事件 | 不記 key 全文 | HARD |

---

## 10. 跨 Prompt 一致性測試

### 10.1 Test case CC.1: 變數插值正確

**Given**: 卡 1-2 已填入林老師資料

**When**: 進入卡 6，前端組合 prompt

**Then**:

| Assertion | 規則 |
| :--- | :--- |
| `{verbatim}` 被替換為實際 verbatim 內容 | regex 不再含 `\{\w+\}` 殘留 | HARD |
| `{people.background}` 被正確插值 | 同上 | HARD |
| 若任一變數未替換 → 阻擋複製按鈕 | UI 強制 | HARD |
| 變數內容不被 markdown / HTML escape 轉換 | 純文字傳入 | HARD |

```typescript
test('變數插值不漏', () => {
  const prompt = renderPrompt('p6_evidence_research', {
    'complaint.verbatim': '我每週六晚上...',
    'people.background': '30-50 歲補習班老師',
  });
  expect(prompt).not.toMatch(/\{[\w.]+\}/);  // 無未替換變數
  expect(prompt).toContain('我每週六晚上');
  expect(prompt).toContain('30-50 歲補習班老師');
});
```

### 10.2 Test case CC.2: 反 solution mode 防護字句一致

**Then**:

| 卡 | 防護字句數量 | 必含 keyword |
| :--- | :--- | :--- |
| 卡 3 | ≥ 1 句 | 「不要建議解決方案」「不要推薦工具」 |
| 卡 4 | ≥ 1 句 | 「不要建議我做新的工具」 |
| 卡 5 | ≥ 1 句 | 「不要挑超過 1 個」（隱含限制過度提案）|
| 卡 6 | **必須 3 句** | 完整三道防線（最關鍵）|
| 卡 7 | ≥ 1 句 | 「判斷標準只看痛點強度與證據」 |
| 卡 8 | ≥ 1 句 | 「不要假裝會付錢買 App」 |

```typescript
test('卡 6 三道反 solution mode 防護字句完整', () => {
  const prompt = getPromptTemplate('p6_evidence_research');
  expect(prompt).toContain('請不要幫我設計產品，也不要提出商業模式');
  expect(prompt).toContain('請不要建議 App、SaaS、解決方案');
  expect(prompt).toContain('請只做痛點探索與證據蒐集');
});
```

### 10.3 Test case CC.3: Placeholder 命名與 data_model 一致

**Then**:

| 卡 prompt | 使用的 placeholder | 對應 data_model 欄位 |
| :--- | :--- | :--- |
| 卡 3 | `[貼上卡片 1 的原句]` | `complaint.verbatim` ✓ |
| 卡 3 | `[貼上卡片 2 的「大概背景」]` | `people.background` ✓ |
| 卡 4 | `[貼上卡片 3 整理後的句子]` | `stuck_formula.ai_polished` ✓ |
| 卡 5 | `[貼上卡片 3]` | `stuck_formula.ai_polished` ✓ |
| 卡 5 | `[貼上卡片 4]` | `workaround.tool_name` + `workaround.why_still_stuck` ✓ |
| 卡 6 | `[貼上卡片 3 的卡關公式]` | `stuck_formula.ai_polished` ✓ |
| 卡 6 | `[貼上卡片 2 的「大概背景」]` | `people.background` ✓ |
| 卡 6 | `[貼上卡片 4 的方法]` | `workaround.tool_name` ✓ |
| 卡 6 | `[貼上卡片 4 的 3 個理由]` | `workaround.user_dissatisfactions[]` ✓ |
| 卡 8 | `[貼上訪談對象]` | `interview_plan.targets[0].persona` ✓ |
| 卡 8 | `[貼上你的訪談題 1-3]` | `interview_plan.questions[0..2]` ✓ |

---

## 11. 測試執行策略

### 11.1 測試頻率

| 測試類別 | 觸發 | 預估成本 |
| :--- | :--- | :--- |
| 規則式 assertion（Layer 1 regex）| 每個 PR | 0（無 API call）|
| Mock AI 回覆驗證 | 每個 PR | 0 |
| 真實 AI 跑 happy path × 3 模型 | nightly | $0.30 / 次 |
| 真實 AI 跑全部 test case × 3 模型 × 5 次 | weekly | $5-10 / 次 |
| BYOK 安全測試 | 每個 release | 0 |

### 11.2 失敗處理

- 規則式 assertion 失敗 → 立即修 prompt 模板
- 跨模型一致性下降 → 調整 system prompt 或切換 default model
- 反 solution mode 通過率 < 90% → 升級 prompt（加更多防護字句）

### 11.3 測試報告

每週產生：

```markdown
# AI Prompt 測試報告 — Week N

## 整體通過率
- 卡 3: 95% (GPT-4o) / 98% (Claude) / 88% (Gemini)
- 卡 6: 92% (GPT-4o) / 99% (Claude) / 82% (Gemini)
- ...

## 反 Solution Mode 觸發率（越低越好）
- 卡 4: 3%
- 卡 6: 5%（含 1 次 Claude false positive）
- ...

## 建議
- Gemini 在卡 6 表現持續偏弱 → 不建議列為預設選項
- 卡 5 「6 個都不像」識別 GPT-4o 比 Claude 低 → 加強 prompt
```

---

## 12. 變更紀錄

| 版本 | 日期 | 變更 |
| :--- | :--- | :--- |
| 1.0 | 2026-05-01 | 首版；對應 worksheet v1.0、ai_prompt_library.md v1.0、ai_proxy_spec.md v1.0 |
