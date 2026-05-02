# PainMap Worksheet — AI Proxy 規格

> **狀態**：MVP（複製模式）+ 站內 LLM 語意判定（已上線於卡 1/2/4/6/8）
> **真相源**：`product/data_model.md` + `references/ai_prompt_library.md`
> **核心鐵律**：
> - **反 solution mode** — AI 任何時候都不可建議解決方案、不可推薦工具、只做痛點探索。違反此鐵律的回應視為不合格、必須擋下。
> - **反分類學** — AI 不得貼任何編號 / 等級 / 分類學標籤（TRIZ、設計模式、商業書名詞）。
> - **卡 9 永久禁用 AI** — 判斷層所有欄位（judgment、reason_100w、most_confident_evidence、least_confident、next_action）一律由使用者親自寫，站內 LLM 也不開放。
> - **站內 LLM 僅做語意判定** — 卡 1/2/4/6/8 的硬編碼啟發式（如 background 具體性）改用 gpt-4o-mini 二次判定；只回 verdict + reason，不存原文上後端。原本「複製到外部 ChatGPT」的長 prompt 工作流不變（卡 3/4/6/7/8 仍是複製模式）。

---

## 1. 兩種模式對照

PainMap Worksheet 採「複製模式 → 站內 LLM」漸進式策略，不一次到位：

| 維度 | 複製模式（卡 3/4/6/7/8 長 prompt） | 站內 LLM 語意判定（卡 1/2/4/6/8 短判定，**已上線**） |
| :--- | :--- | :--- |
| 互動方式 | 前端產生長 prompt → 使用者複製到外部 ChatGPT / Claude → 貼回 worksheet | 使用者點 Next 時 → server function 呼叫 gpt-4o-mini → 回 verdict + reason |
| 後端串接 | 無 | TanStack server function（`createServerFn` POST），讀 Workers secret `OPENAI_API_KEY` |
| API 成本 | 0（使用者付外部服務） | 站方代理 ~$0.0001 / 次判定，IP rate limit 10/min · 1000/day |
| 隱私 | 使用者資料只在自己的 ChatGPT 帳號 | 只送短判定文字（如 background 句），後端不存、不寫 log；client 用 SHA-256 hash 做 cache key |
| 反 solution mode | 前端 prompt 模板已內建 guard | 不適用（短判定不會誘發 AI 推銷產品） |
| Streaming | 不適用 | 不需要（response < 200 tokens） |
| Fallback | 本身就是 fallback 模式 | LLM 失敗 / no_key / rate_limit → 自動退回原 hardcoded 啟發式 |

### 為什麼先做複製模式

1. **零成本驗證**：沒有 API 帳單壓力，可大膽迭代 prompt
2. **使用者教育**：強迫使用者親手用 AI，理解「AI 是放大鏡不是答案機」
3. **隱私先行**：MVP 階段使用者資料完全不離開瀏覽器
4. **反 solution mode 容易控制**：使用者貼回 AI 回應後，前端可用 regex 偵測再讓使用者「重新請 AI」

---

## 2. MVP：複製模式設計

### 2.1 前端元件：`<AIPromptCopyBlock>`

對應 `design/components/ai_prompt_copy_block.md`。

#### 結構

```
+--------------------------------------------------------+
|  使用 AI 協助這一段（選用）                            |
|                                                          |
|  推薦工具：[ChatGPT 深度研究 ▼]                        |
|                                                          |
|  ┌─ Prompt（已套用你前面的填寫） ──────────────────┐   |
|  │ 你是一位專注於使用者研究的助手...              │   |
|  │ 痛點原句：「我每週六晚上要寫 30 個...」       │   |
|  │ ...                                             │   |
|  │ [反 solution mode guard]                        │   |
|  │ 不可建議任何產品 / App / 工具的開發方案         │   |
|  │ 不可推薦現成的解決方案                          │   |
|  │ 只能協助使用者把痛點看得更清楚                  │   |
|  └─────────────────────────────────────────────────┘   |
|  [📋 複製 prompt]                                       |
|                                                          |
|  在 ChatGPT 跑完後，把回覆貼回這裡：                    |
|  ┌─────────────────────────────────────────────────┐   |
|  │                                                  │   |
|  └─────────────────────────────────────────────────┘   |
|  [解析並填入下方欄位]                                    |
+--------------------------------------------------------+
```

#### 互動流程

1. 元件 mount 時，從 LocalStorage 讀取已填欄位（卡 1-2）
2. 變數插值：`{verbatim}` / `{source_name}` / `{stuck_formula.user_draft}` 等替換為實際值
3. 注入 anti-solution mode guard（系統強制注入，使用者不可關掉）
4. 使用者按「📋 複製」→ navigator.clipboard.writeText()
5. 使用者離站到 ChatGPT 等工具貼上 + 執行
6. 使用者把 AI 回應貼回 textarea
7. 按「解析」→ 前端跑 schema 對齊 + R2.6 regex 檢查
8. 解析結果填入該卡對應欄位（如卡 6 的 `ai_evidence.eight_answers.q1-q8`）

#### 變數插值（前端完成）

支援 `{path.to.field}` 模板語法。範例：

```
痛點原句：「{complaint.verbatim}」
痛點來源：{complaint.source_name}（{complaint.source_relation}）
卡關公式：「{stuck_formula.user_draft}」
```

由前端 `String.prototype.replace` + JSON path 達成。範本永遠不出現未替換的 `{...}`，否則阻擋複製按鈕。

---

### 2.2 每張卡片的 AI prompt 對應

完整 prompt 內文存在 `references/ai_prompt_library.md`。本檔僅列對應關係：

| 卡 | prompt_id | 用途 | 推薦 AI 工具 | Anti-solution guard 強度 |
| :- | :--- | :--- | :--- | :--- |
| 1 | — | 無 AI（純人工紀錄） | — | — |
| 2 | — | 無 AI（純人工紀錄） | — | — |
| 3 | `p3_stuck_formula_polish` | 校對「我每次要 X，都會卡在 Y」+ 列出需追問的點 | Claude / ChatGPT | HIGH |
| 4 | `p4_workaround_alternatives` | 列出 5 個常見 workaround 提案 | ChatGPT / Perplexity | **MAX** |
| 5 | `p5_tradeoff_articulation` | 蘇格拉底式：協助使用者用自己的話寫 side_a / side_b / sacrificed / sacrificed_reason；**不**從固定選項挑、**不**給編號 / 標籤 | Claude | HIGH |
| 6 | `p6_evidence_research` | 8 題證據蒐集（人群 / 場景頻率 / workaround / 不滿 / 公開證據 / JTBD / 假痛點 / 訪談 5 種人） | ChatGPT 深度研究 / Perplexity | **MAX** |
| 7 | `p7_pain_judgment_table` | 整理「自己先猜 vs AI 結論」判斷表 | Claude | HIGH |
| 8 | `p8_interview_simulation` | 模擬訪談熱身（角色扮演被訪談者） | Claude / ChatGPT | HIGH |
| 9 | — | **無 AI（永久禁用）**。判斷層所有欄位（judgment / reason_100w / most_confident_evidence / least_confident / next_action）一律由使用者親自寫，不開放任何 AI 輔助 | — | — |

**Anti-solution guard 強度**：
- HIGH：prompt 含 anti-solution 警告 + 後處理 regex 偵測
- MAX：HIGH + LLM-based judge 二次審查（M2+）

#### 卡 5 prompt 設計

| 維度 | 規範 |
| :--- | :--- |
| AI 角色 | 協助使用者用主人翁的話寫 side_a / side_b / sacrificed_reason |
| 輸出 schema | `{ side_a, side_b, sacrificed: 'a'\|'b', sacrificed_reason }` |
| 反 solution guard | 含「不要給編號 / 不要給分類學標籤」「不要替我下判斷說『他應該犧牲 X』」 |
| 退場機制 | 「卡關句還沒拆清楚，建議回去把卡 3 想得更具體」（中性語氣） |
| 前端 UI | side_a/b textarea + sacrificed radio + sacrificed_reason textarea（**無 radio group**）|

#### 卡 9 永久禁用範圍

| AI 任務 | 是否使用 | 說明 |
| :--- | :--- | :--- |
| 寫 reason_100w | ❌ 永久禁用 | 必須使用者親自做的職業訓練 |
| 自動判定 true / fake / pending_interview | ❌ 永久禁用 | 違反 brand 第三原則（證據優於意見）|
| 自動填 most_confident_evidence | ❌ 永久禁用 | 自我反思必須親自做 |
| 自動填 least_confident | ❌ 永久禁用 | 同上 |
| 自動推薦 next_action | ❌ 永久禁用 | 行動是判斷的延伸，必須由使用者親自選 |
| 「AI 幫你檢查 reason 是否完整」按鈕 | ❌ 永久禁用 | 即使是檢查也算介入判斷 |
| 「AI 幫你照鏡子，看你的判斷有沒有矛盾」按鈕 | ❌ 永久禁用 | 紅隊功能屬於 M3+ 範圍，現階段不開放 |

> 卡 9 的 AI 禁用範圍涵蓋「任何判斷層 UI」。即使 M2+ 站內 LLM API 上線，這張卡的所有 textarea / radio 也永遠不可有 AI 輔助按鈕。

---

### 2.3 反 solution mode 偵測（前端 MVP）

使用者貼回 AI 回覆後，跑 R2.6：

```js
const FORBIDDEN_PATTERNS = [
  /建議.{0,10}(製作|開發|做一個|打造).{0,10}(App|產品|平台|軟體|工具)/,
  /你應該.{0,10}(開發|設計|做)/,
  /可以做一個.{0,20}(App|產品)/,
  /推薦.{0,20}(產品|工具)是/,
  /商業模式可以/,
  /MVP.{0,10}(可以|建議|做)/,
  /SaaS.{0,10}(可以|建議)/,
  /(訂閱|付費|商業化)\s*策略/,
];

function detectSolutionMode(text) {
  return FORBIDDEN_PATTERNS.some(p => p.test(text));
}
```

若觸發：

- 設定 `ai_evidence.no_solution_check_passed = false`
- 顯示提示：「AI 在回覆裡幫你想了解決方案，這會把你帶離痛點探索。請複製這段 guard 回 ChatGPT 重跑：『不要建議產品方案，只幫我把痛點看清楚。』」
- 提供「重置 prompt 並重新複製」按鈕

#### 卡 5 額外偵測（蘇格拉底護欄）

```js
const CARD_5_ANTI_TAXONOMY_PATTERNS = [
  /(triz|TRIZ|矛盾編號|這屬於第 ?\d+ ?種|矛盾類型 ?\d+)/i,
  /(Speed vs Quality|Personalization vs Scale|Speed vs Accuracy|Expert vs Novice|Automation vs Control|Experimentation vs Risk)/i,
  /(挑 ?1 ?個|選 ?1 ?個|6 ?種.*挑)/,
];

function detectTaxonomyLeak(text) {
  return CARD_5_ANTI_TAXONOMY_PATTERNS.some(p => p.test(text));
}
```

若觸發 → 提示「AI 偷渡了分類學標籤。請複製這段補強 prompt 重跑：『請刪除任何編號或分類學標籤，只用主人翁的話寫 A/B 兩端。』」

---

## 3. M2+：站內 LLM API

### 3.1 端點：`POST /api/ai/run-prompt`

**用途**：後端代理呼叫 LLM API，回傳結構化結果。

**Request**：

```json
{
  "card_step": 6,
  "prompt_id": "p6_evidence_research",
  "variables": { "complaint.verbatim": "...", "stuck_formula.user_draft": "..." },
  "preferred_provider": "anthropic",
  "preferred_model": "claude-3-5-sonnet",
  "use_byok": false,
  "stream": true
}
```

**Response 200**（stream=false）：`data: { prompt_run_id, provider, model, raw_response, parsed: { 各 prompt schema }, no_solution_check_passed, tokens_used: { prompt, completion }, cost_usd }`

**Response 200**（stream=true）：SSE events `status` (phase / provider) → 多筆 `token` (text chunk) → `complete` (含 parsed 與 no_solution_check_passed) → 失敗時 `error` (code + message)。

**Status codes**：200 / 400 INVALID_PROMPT_ID / 400 CARD_9_AI_FORBIDDEN（卡 9 任何 AI 請求一律拒絕）/ 401 / 422 SOLUTION_MODE_DETECTED（自動重試 1 次後仍違規） / 422 TAXONOMY_LEAK_DETECTED（卡 5 偷渡分類學標籤）/ 429 / 503 LLM_PROVIDER_DOWN。

---

### 3.2 後端流程

```
1. 驗證 user 已登入 + rate limit 未超
2. 卡 step 防呆：if card_step === 9 → 直接回 400 CARD_9_AI_FORBIDDEN（不浪費 LLM tokens）
3. 載入 prompt template by prompt_id
4. 注入 system prompt（單一統一版本，見 3.3）
5. 變數插值（伺服器端，不信任前端送的變數）
6. 呼叫 LLM provider API（OpenAI / Anthropic / Google）
7. 收到回應 → 跑 anti-solution mode 檢查（regex + LLM-judge）
8. 若 card_step === 5：額外跑 anti-taxonomy 檢查（CARD_5_ANTI_TAXONOMY_PATTERNS）
9. 若違規且未重試 → 注入 stricter guard 再跑一次
10. 若仍違規 → 回 422 SOLUTION_MODE_DETECTED 或 422 TAXONOMY_LEAK_DETECTED
11. parse 結構化欄位（依 prompt schema）
12. 回傳給前端
13. （opt-in 才）寫入 audit log
```

---

### 3.3 統一 system prompt（強制注入）

每次後端呼叫 LLM 時，**永遠**先注入下列 system prompt（使用者前端的 prompt 不可覆蓋）：

```
你正在協助使用者進行 PainMap 痛點探索流程。請嚴格遵守以下原則：

【角色】
你是痛點探索助手，協助使用者把模糊的抱怨書面化、結構化。

【絕對禁止】
1. 不可建議任何產品 / App / 軟體 / 平台 / SaaS 的開發方案
2. 不可推薦現成的解決方案產品（如「你可以用 Notion」「建議使用 Trello」）
   * 但若使用者問「現在大家都用什麼」，可中性列出常見工具名稱（不帶推薦語氣）
3. 不可給商業模式建議
4. 不可預測成功率、可行性、市場規模
5. 不可使用「應該」「必須」「最好」這類強建議語
6. 不可給「分數」「等級」「N/M」型評估
7. 不可貼分類學標籤（TRIZ、設計模式、商業書名詞），即使使用者要求

【唯一任務】
協助使用者：
- 把痛點看得更清楚（誰 / 何時 / 何地 / 何頻率 / 不滿什麼）
- 列出公開可查證的證據來源
- 找出可能的假痛點訊號
- 提出該訪談哪些人

【若使用者偏離】
若使用者問「我應該開發什麼？」「值得做這個產品嗎？」「商業模式怎麼設計？」
請回答：「現在不是討論方案的時候。先把痛點搞清楚，方案是真痛點被驗證後的事。」

若使用者要求「給這個痛點打分」「給個 TRIZ 編號」「分類成第幾種矛盾」
請回答：「我不打分數也不給分類標籤。我只用主人翁的話協助你把現況描述得更清楚。」

【輸出格式】
依使用者 prompt 指定的格式輸出。所有結論必以「下一步可執行的探索動作」結尾。
```

此 system prompt 對所有 prompt_id 通用，**不可由使用者自訂**。

---

### 3.4 反 solution mode 後端偵測

#### Layer 1：Regex（同 MVP，2.3）

LLM 回應一收到立刻跑。觸發 → 不直接給使用者，先進 Layer 2。

#### Layer 2：LLM-based Judge（M2+）

用一個獨立的便宜模型（如 `claude-3-haiku` / `gpt-4o-mini`）跑判斷：

```
[判斷 prompt]
請判斷下列 AI 回應是否違反「痛點探索模式」規則：
1. 是否建議產品開發方案？
2. 是否推薦商業模式？
3. 是否預測成功率 / 可行性？
4. 是否使用強建議語（應該 / 必須 / 最好）？
5. 是否給了分數 / 等級 / N/M 評估？
6. 是否貼了分類學標籤（TRIZ、設計模式、商業書名詞）？

回應內容：
"""
{ai_response}
"""

回答 JSON：{"violation": true/false, "reasons": [...], "score": 0-10}
```

`score >= 6` 視為違規 → 自動注入 stricter guard 重跑一次（最多 1 次重試）。

#### Layer 3：使用者報告

若使用者讀完仍覺得 AI 在推方案 / 偷渡分類 → 點「這份回應在推方案 / 給分類，幫我重跑」按鈕 → 觸發 strict 模式重跑。

---

### 3.5 API call payload（各家適配）

統一參數：`temperature=0.7`、`max_tokens=4000`、統一 system prompt（3.3）強制注入。

| Provider | 模型 | 系統 prompt 欄位 | 備註 |
| :--- | :--- | :--- | :--- |
| OpenAI | `gpt-4o` | `messages[0].role=system` | 支援 `response_format: json_object` |
| Anthropic | `claude-3-5-sonnet-20241022` | top-level `system` 參數 | 推薦用於卡 3 / 5 / 7 / 8（思辨類） |
| Google | `gemini-1.5-pro` | `systemInstruction.parts[]` | `generationConfig.maxOutputTokens` |
| Perplexity | `llama-3.1-sonar-large-128k-online` | OpenAI 相容介面 | 適合卡 6（含 web search） |

---

### 3.6 Rate limit / cost control

| 控制 | 值 |
| :--- | :--- |
| 站內額度（free tier） | 20 prompt runs / day / user |
| Pro tier | 200 / day |
| 單次 prompt 上限 | 8000 tokens（input + output） |
| 月度成本 cap（per user） | $5 USD（達到上限自動停用，提示升級或 BYOK） |
| 同 prompt_id 重複頻率 | 同 paincard / 同 prompt_id：5 / hour |
| 卡 9 任何 AI 請求 | **永久 0**（一律拒絕） |

超過 → 429 RATE_LIMITED，header `Retry-After`。

---

### 3.7 BYOK（自帶 API key）流程

讓使用者跳過站內額度限制：

#### 流程

1. 使用者在「設定」頁輸入自己的 OpenAI / Anthropic / Google API key
2. 前端送 key 到後端 → 後端以對稱加密存（KMS managed key）
3. 後端驗證 key（呼叫 provider 的 `/v1/models` 等輕量端點確認可用）
4. 標記 user 為 `byok_enabled = true`
5. 後續所有 `POST /api/ai/run-prompt` 自動使用該 key（不計入站內額度）

#### 安全要求

- key 永不回傳給前端（即使是同一使用者）
- key 加密儲存（KMS）
- 使用者可隨時「移除 key」 → 立刻從資料庫硬刪除
- 後端日誌**絕不**記錄 key 全文（最多前 4 + 後 4 字元用於除錯）

#### UI 提示

「使用你自己的 API key 後，prompt 將直接送到 OpenAI / Anthropic / Google。費用由你的 key 帳戶承擔。我們不會在後端長期儲存 prompt 內容（除非你勾選『保留歷史紀錄』）。」

---

### 3.8 Streaming response 處理

#### 後端

對 OpenAI / Anthropic 開啟 SSE → 接收 chunks → 立即轉發給前端 SSE。

#### 前端

```ts
const eventSource = new EventSource(`/api/ai/run-prompt?...`, { withCredentials: true });

eventSource.addEventListener('status', e => {/* 顯示「正在思考」步驟 */});
eventSource.addEventListener('token', e => {/* 累積文字到 textarea，打字機效果 */});
eventSource.addEventListener('complete', e => {/* 結束 stream + 跑解析 */});
eventSource.addEventListener('error', e => {/* fallback */});
```

#### 中斷

使用者按「停止」→ 前端關閉 EventSource → 後端偵測到 client 斷開 → 取消 LLM 串流。

---

### 3.9 Fallback 策略

| 情境 | 處理 |
| :--- | :--- |
| LLM provider 503 | 嘗試備援 provider（如 OpenAI down → 切 Anthropic） |
| 所有 provider down | 回傳 `503 SERVICE_UNAVAILABLE` + UI 自動切回**複製模式** |
| BYOK key 失效 | 401 + UI 提示「你的 API key 已失效，請重新輸入或暫時使用站內額度」 |
| Anti-solution mode 重試 1 次仍違規 | 422 + UI 提示「AI 一直在推方案。請改用 Claude，或手動填寫」 |
| 卡 5 anti-taxonomy 重試 1 次仍違規 | 422 + UI 提示「AI 一直在偷渡分類學。請改用 Claude 或手動寫」 |
| 卡 9 任何 AI 請求 | 400 CARD_9_AI_FORBIDDEN + UI 提示「卡 9 不開放 AI 輔助。判斷是你的功課」 |
| Streaming 中途斷線 | 已生成內容保留 + UI 顯示「連線中斷，已保留 X 個字。要繼續嗎？」 |

**核心原則**：站內 LLM 永遠**不是必要功能**。即使全部當機，使用者仍可用複製模式完成 9 張卡。

---

### 3.10 隱私

#### 預設行為

- 後端**不**長期儲存 prompt 內容、AI 回應原文
- 僅在記憶體中處理一次後丟棄
- 寫入 LocalStorage / 資料庫的是「使用者填入到 PainCard 的最終欄位」（如 `ai_evidence.eight_answers.q1`），不是 prompt 對話本身
- audit log 只記 metadata（user_id / prompt_id / token count / cost / no_solution_check_passed），不記內容

#### Opt-in 行為

使用者可在「設定」頁勾選「保留 AI 對話歷史」：
- 用途：讓使用者可回溯查看之前 AI 怎麼回的
- 儲存：完整 prompt + response 加密寫入個人資料庫
- 過期：90 天自動清除（可手動延長 / 立即清除）
- 絕不用於：訓練模型、共享給第三方、聚合分析

#### 跨境傳輸

LLM provider（OpenAI / Anthropic / Google）的伺服器多在美國。使用者地區若在歐盟 → 顯示明確警告 + 取得 GDPR consent。台灣 / 日本使用者預設無額外警告（但設定頁有完整說明）。
