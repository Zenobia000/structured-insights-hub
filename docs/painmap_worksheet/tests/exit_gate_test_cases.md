# Exit Gate Test Cases — 9 卡過關條件測試矩陣

> **版本**：v1.0 — 2026-05-01
> **配套文件**：`references/exit_gates_matrix.md`、`product/data_model.md`、`references/pain_card_schema.md`
> **測試對象**：9 張卡片的 exit gate 規則（L1 欄位驗證 + L2 內容反偵測 + L3 跨欄位一致性）
> **測試框架**：Vitest（單元）+ Playwright（互動）
> **測試鐵律**：所有失敗訊息必須符合 brand voice（不焦慮、賦權、結構化）；所有 hard gate 不可被使用者繞過。

---

## 0. 測試方法總綱

### 0.1 Test case 結構（每個 case 都採用）

```yaml
TC ID: 卡N.M
Given:
  state: PainCard 當前欄位狀態（JSON）
  current_step: 當前在哪張卡
When:
  action: 使用者觸發的動作（按過關 / 解析 AI 回覆 / 切換選項）
Then:
  gate_result: passed | blocked | warning
  ui_response: 預期 UI 反應（哪個 panel 出現 / 哪個按鈕 disabled）
  expected_message: 友善提示文案（須符合 brand voice）
  failure_routing: 失敗時導向哪張卡（若有）
  data_state: PainCard 預期狀態變化
```

### 0.2 共用 assertion helpers

```typescript
// helpers/exitGate.ts
export function expectGateBlocked(page: Page, reason: string) {
  expect(page.locator('button[data-action="next-card"]')).toBeDisabled();
  expect(page.locator('[role="alert"]').first()).toContainText(reason);
}

export function expectGatePassed(page: Page) {
  expect(page.locator('button[data-action="next-card"]')).toBeEnabled();
}

export function expectFriendlyMessage(text: string) {
  // 不可包含的字
  const FORBIDDEN = ['失敗', '錯了', '不及格', '不對', '錯誤', '重來吧'];
  for (const word of FORBIDDEN) {
    expect(text).not.toContain(word);
  }
  // 須包含的字之一（賦權）
  const ENCOURAGING = ['還缺', '建議', '回卡', '補上', '具體', '下一步'];
  expect(ENCOURAGING.some(w => text.includes(w))).toBe(true);
}
```

### 0.3 Brand voice 範本（友善文案）

```
[訊號圖示]  // 用 caution amber 不用紅色
這張卡還缺一些資訊。

具體是：[列出哪個欄位缺什麼]

下一步建議：[具體行動]
（例如：「回卡 N 把 ___ 補上，5 分鐘可以做完。」）

[主按鈕：去補資料]  [次要按鈕：先存草稿]
```

---

## 1. 卡 1 ｜ 抱怨原句

### 規則來源

`exit_gates_matrix.md § 卡 1` G1.1 - G1.7

### TC 1.1 ✅ 正向過關

**Given**:

```json
{
  "complaint": {
    "verbatim": "我每週六晚上要寫 30 個學生的家長 LINE，常寫到半夜兩點。",
    "source_name": "林老師",
    "source_relation": "我表妹的數學老師",
    "datetime": "2026-04-15",
    "scene": "我陪他從 21:00 跟到 02:30 親眼看他寫"
  }
}
```

**When**: 點擊「下一張卡 →」

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `passed` |
| `current_step` | 從 1 → 2 |
| 跳轉 | `/learn/worksheet/02` |
| Stepper | 卡 1 顯示 ✓（Verified Green）|

### TC 1.2 ❌ verbatim 含「我覺得」（解釋而非原句）

**Given**:

```json
{ "complaint": { "verbatim": "我覺得寫家長 LINE 很麻煩，應該需要工具", ... } }
```

**When**: 點擊「下一張卡 →」

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `blocked`（G1.6 觸發）|
| 過關按鈕 | `disabled` |
| Caution panel 文案 | 「verbatim 是「原句」不是你的解釋。請寫他真實說的話（含「我覺得」「應該需要」「也許」「可能」「大概」這類分析詞代表這是你的解釋）」 |
| 提示動作 | 「請貼上他真正講的話，不是你聽完後的詮釋」 |
| `expectFriendlyMessage()` | 通過 |

### TC 1.3 ❌ source_name 缺失

**Given**:

```json
{ "complaint": { "verbatim": "我每週六晚上要寫...", "source_name": "", ... } }
```

**When**: 點擊「下一張卡 →」

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `blocked`（G1.2 觸發）|
| Inline 錯誤訊息 | 「source_name 必填 — 請填寫說這句話的人的名字」 |
| 該欄位 border | Caution Amber |
| Focus | 自動跳到 source_name input |

### TC 1.4 ❌ verbatim 太短（< 10 字）

**Given**:

```json
{ "complaint": { "verbatim": "好煩", ... } }
```

**When**: 點擊「下一張卡 →」

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `blocked`（G1.1 觸發）|
| 字數提示 | 「目前 2 字，至少需要 10 字」 |
| 提示文案 | 「他可能說了更完整的話，請完整寫出來」 |

### TC 1.5 ❌ scene 為空

**Given**:

```json
{ "complaint": { "verbatim": "...", "source_name": "林老師", "source_relation": "...", "datetime": "2026-04-15", "scene": "" } }
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `blocked`（G1.5 觸發）|
| 提示文案 | 「scene 必填 — 當時他在做什麼？（例：陪他從 21:00 跟到 02:30）」 |

### TC 1.6 ⚠️ source_name 是「同學 A」（代稱）

**Given**:

```json
{ "complaint": { "source_name": "同學 A", ... } }
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `warning`（G1.7 SOFT WARNING）|
| 過關按鈕 | `enabled`（放行）|
| Caution panel | 「『同學 A』可能是代稱。最好補上真名，但你可以先送出。」 |
| 兩個按鈕 | `[我了解，先送出] [回去補真名]` |

### TC 1.7 ❌ 包含其他分析詞「也許」「可能」

**Given**:

```json
{ "verbatim": "也許他需要一個更好的方法，可能寫信很煩" }
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `blocked`（G1.6）|
| 提示文案 | 「verbatim 含「也許 / 可能」這是分析詞，不是原句」 |

---

## 2. 卡 2 ｜ 三個有名字的人

### 規則來源

`exit_gates_matrix.md § 卡 2` G2.1 - G2.7

### TC 2.1 ✅ 3 個都有真名 + 聯絡方式

**Given**:

```json
{
  "people": {
    "background": "30-50 歲補習班老師",
    "list": [
      { "name": "林老師", "contact": "LINE", "relation": "我表妹的數學老師" },
      { "name": "王老師", "contact": "FB Messenger", "relation": "林老師介紹" },
      { "name": "陳老師", "contact": "電話", "relation": "我國中同學的爸爸" }
    ]
  }
}
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `passed` |
| `current_step` | 2 → 3 |
| Stepper | 卡 2 顯示 ✓ |

### TC 2.2 ❌ 名字為「補習班老師 A」（代稱）

**Given**:

```json
{ "list": [{ "name": "補習班老師 A", "contact": "無", "relation": "代稱" }, ...] }
```

**When**: 點擊「下一張卡 →」

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `blocked`（G2.6 觸發 — 代稱 pattern 偵測）|
| 過關按鈕 | `disabled` |
| Caution panel 文案 | 「找不到 3 個真人，代表這個圈子你還不熟。先去這群人聚集的地方混 1-2 週再回來，你的痛點會變得更清楚。」 |
| 失敗路由 CTA | `[回卡 1，找一個真人聊再回來]` |
| 失敗路由 secondary | `[暫存退出，2 週後回來]` |

### TC 2.3 ❌ 只有 2 個人

**Given**:

```json
{ "list": [{ ... }, { ... }] }
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `blocked`（G2.2 觸發 — list 必須恰好 3 筆）|
| 提示文案 | 「目前只有 2 個人。卡 2 設計上規定 3 個 — 沒湊滿代表這個圈子你還不熟」 |
| UI 動作 | 第 3 個 row 的「新增第 3 個人」按鈕高亮 |

### TC 2.4 ❌ contact 為空

**Given**:

```json
{ "list": [{ "name": "林老師", "contact": "", "relation": "..." }, ...] }
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `blocked`（G2.4 觸發）|
| 該欄位 border | Caution Amber |
| 提示文案 | 「林老師的聯絡方式必填 — 你有他的 LINE / FB / 電話 / Email？」 |

### TC 2.5 ⚠️ contact 是「以後再加」（不是今天能聯絡的）

**Given**:

```json
{ "list": [{ "name": "林老師", "contact": "以後再加", "relation": "..." }, ...] }
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `warning`（G2.7 SOFT WARNING）|
| 過關按鈕 | `enabled`（放行）|
| Caution panel | 「『以後再加』代表你今天聯絡不到。建議補上真實 contact，但你可以先送出」 |

### TC 2.6 ❌ AI 自動產生 persona（前端應禁止）

**Given**: 使用者點擊「請 AI 幫我生成 3 個 persona」按鈕

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| 前端 | **此按鈕在卡 2 不存在**（worksheet 鐵律 + ai_prompt_library §7）|
| 即使透過 console 注入 | 後端 API `/api/ai/run-prompt` 拒絕 `card_step=2`（card_step ∈ {3, 4, 5, 6, 7, 8} only）|

---

## 3. 卡 3 ｜ 卡關公式

### 規則來源

`exit_gates_matrix.md § 卡 3` G3.1 - G3.5

### TC 3.1 ✅ confirmed === true + user_draft 非空

**Given**:

```json
{
  "stuck_formula": {
    "user_draft": "我每次要寫 30 則家長回報，都會卡在資料散在 7 次小考",
    "ai_polished": "我每次要在週末寫 30 則家長回報訊息...",
    "ai_clarifying_questions": ["...", "..."],
    "confirmed": true
  }
}
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `passed` |
| `current_step` | 3 → 4 |

### TC 3.2 ⚠️ user_draft 含「卡在效率不好」（空話）— SOFT WARNING

**Given**:

```json
{ "user_draft": "我每次要做事情，都會卡在效率不好", "confirmed": true }
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `warning`（G3.4 觸發）|
| 過關按鈕 | `enabled`（放行）|
| Caution panel 文案 | 「你寫的可能還太抽象（「效率不好」），再去問主人翁一次會更穩」 |
| 兩個按鈕 | `[我了解，先送出] [回卡 1 再去問]` |
| LocalStorage metadata | `overrode_warning: ['G3.4']` 寫入（匯出時保留）|

### TC 3.3 ❌ confirmed === false

**Given**:

```json
{ "user_draft": "...", "confirmed": false }
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `blocked`（G3.2 觸發）|
| 提示文案 | 「請確認此版本（勾選『我確認此版本』checkbox）」 |
| Focus | 自動跳到 confirmed checkbox |

### TC 3.4 ❌ user_draft 為空

**Given**:

```json
{ "user_draft": "", "confirmed": true }
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `blocked`（G3.1 觸發）|
| 提示文案 | 「user_draft 必填 — 用「我每次要 ___，都會卡在 ___」句型寫一句」 |

### TC 3.5 ⚠️ user_draft 不含「我每次要 / 卡在」句型

**Given**:

```json
{ "user_draft": "寫信很麻煩", "confirmed": true }
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `warning`（G3.3 SOFT WARNING）|
| 過關按鈕 | `enabled`（放行）|
| Caution panel | 「你寫的不太像「我每次要 X，都會卡在 Y」句型。建議先請 AI 校對，但你可以送出」 |

### TC 3.6 失敗路由：退回卡 1

**When**: TC 3.4 發生 → 使用者點 `[回卡 1 再去問]`

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| 跳轉 | `/learn/worksheet/01` |
| `current_step` | 3 → 1 |
| 卡 1 資料 | 完整保留 |
| 卡 2 資料 | 完整保留（標記 stale=false 不影響）|
| 卡 3 資料 | 保留為 draft（再進卡 3 仍可看到原內容）|

---

## 4. 卡 4 ｜ 現在怎麼解

### 規則來源

`exit_gates_matrix.md § 卡 4` G4.1 - G4.5

### TC 4.1 ✅ tool_name + 3 個 dissatisfactions

**Given**:

```json
{
  "workaround": {
    "tool_name": "LINE + Excel 成績表 + 翻群組對話",
    "why_still_stuck": "每個資料源都要重新翻找",
    "user_dissatisfactions": [
      "Notion 試過 1 個月放棄，太花時間",
      "ChatGPT 寫得太罐頭",
      "助教請不起"
    ]
  }
}
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `passed` |

### TC 4.2 ❌ tool_name 為「沒人解過」

**Given**:

```json
{ "tool_name": "沒人解過", ... }
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `blocked`（G4.2 觸發）|
| 提示文案 | 「他其實沒在花時間解這個問題，可能還沒到痛點門檻。回卡 1 換一個更有花時間在解的人」 |
| 失敗路由 | `[回卡 1 換主人翁]` |

### TC 4.3 ❌ dissatisfactions 只有 2 個

**Given**:

```json
{ "user_dissatisfactions": ["Notion 太花時間", "ChatGPT 太罐頭"] }
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `blocked`（G4.3 觸發）|
| 提示文案 | 「目前 2 個不滿，至少需要 3 個。3 個是篩出真痛點的關鍵 — 不夠 3 個代表這個工具其實夠用」 |

### TC 4.4 ❌ tool_name 為「會自己想辦法」

**Given**:

```json
{ "tool_name": "會自己想辦法" }
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `blocked`（G4.2 觸發 — 黑名單 pattern）|
| 提示文案 | 「『會自己想辦法』太模糊。請寫出具體的工具/流程名（例：LINE / Excel / Notion / ChatGPT 等）」 |

### TC 4.5 ⚠️ dissatisfactions 字串太短

**Given**:

```json
{ "user_dissatisfactions": ["不好", "太慢", "煩"] }
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `warning`（G4.4 SOFT WARNING）|
| 過關按鈕 | `enabled`（放行）|
| Caution panel | 「不滿理由太短（每個 ≥ 5 字），可能不夠具體。建議補上原因，但你可以先送出」 |

### TC 4.6 ❌ why_still_stuck 為空

**Given**:

```json
{ "tool_name": "LINE + Excel", "why_still_stuck": "", ... }
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `blocked`（G4.5 觸發）|
| 提示文案 | 「why_still_stuck 必填 — 為什麼這個工具/流程還是讓他卡？」 |

---

## 5. 卡 5 ｜ TRIZ 矛盾

### 規則來源

`exit_gates_matrix.md § 卡 5` G5.1 - G5.5

### TC 5.1 ✅ triz_id 已選 + side_a/b 具體

**Given**:

```json
{
  "contradiction": {
    "triz_id": 2,
    "triz_label": "想客製化但又想規模化",
    "side_a": "家長要看見「我的孩子」被個別關照（具體事件、語氣有溫度）",
    "side_b": "老師一週只有 2-3 小時可寫 30 則（每則 < 6 分鐘）",
    "sacrificed": "a"
  }
}
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `passed` |

### TC 5.2 ❌ triz_id === null

**Given**:

```json
{ "triz_id": null, "side_a": "...", "side_b": "...", "sacrificed": "a" }
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `blocked`（G5.1 觸發）|
| 提示文案 | 「請從 6 個矛盾中選 1 個。如果 6 個都不像，回卡 3 把句子拆得更具體」 |
| Failure routing | 提供 `[回卡 3]` 選項 |

### TC 5.3 UI 強制單選（不可達 invalid state）

**Given**: 使用者試圖選 2 個矛盾

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| UI 控件類型 | `radio button`（不是 checkbox）|
| 點選第 2 個 | 自動取消第 1 個（單選邏輯）|
| LocalStorage | `triz_id` 始終為 1 個值，不可能存兩個 |

### TC 5.4 ❌ side_a 太短（< 8 字）

**Given**:

```json
{ "triz_id": 2, "side_a": "品質好", "side_b": "...具體...", ... }
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `blocked`（G5.2 觸發）|
| 提示文案 | 「A 端需要 ≥ 8 字 + 具體場景。「品質好」太抽象，請用主人翁的話描述」 |

### TC 5.5 ⚠️ side_a 為「品質好」「速度快」這類抽象詞

**Given**:

```json
{ "side_a": "想要品質好的回報" }
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `warning`（G5.5 SOFT WARNING）|
| 過關按鈕 | `enabled` |
| Caution panel | 「A 端「品質好」太抽象，建議含具體場景或量化（例：『家長要看見「我的孩子」被個別關照』）」 |

### TC 5.6 ❌ sacrificed 未選

**Given**:

```json
{ "triz_id": 2, "side_a": "...", "side_b": "...", "sacrificed": null }
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `blocked`（G5.4 觸發）|
| 提示文案 | 「請選通常會犧牲哪一邊：A 或 B」 |

### TC 5.7 失敗路由：退回卡 3

**When**: AI 回應「6 個都不像，請我退回卡 3」

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| 自動跳轉 | `/learn/worksheet/03` |
| `current_step` | 5 → 3 |
| 卡 4 資料 | 保留 |
| 提示文案 | 「AI 認為這個卡關還沒拆乾淨，回到卡 3 把句子說得更具體吧」 |

---

## 6. 卡 6 ｜ AI 證據蒐集

### 規則來源

`exit_gates_matrix.md § 卡 6` G6.1 - G6.6

### TC 6.1 ✅ 8 題全填 + no_solution_check_passed === true

**Given**:

```json
{
  "ai_evidence": {
    "ai_tool": "chatgpt_dr",
    "ai_tool_reason": "第一次跑研究",
    "raw_response": "...（≥ 200 字）...",
    "eight_answers": {
      "q1_specific_groups": "1. 中小型補習班數學老師...",
      "q2_scenes_frequency": "每週 1 次（週末）...",
      "q3_workarounds": "Notion / Google Sheets...",
      "q4_dissatisfactions_categorized": "時間：4-6 小時...",
      "q5_public_evidence": "Dcard 補教版...",
      "q6_jtbd": "週末把整週的學生狀況打包...",
      "q7_possible_fake_pains": "可能不是寫信很痛...",
      "q8_interview_targets": "1. 中小型補習班數學老師..."
    },
    "no_solution_check_passed": true
  }
}
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `passed` |

### TC 6.2 ❌ AI 回覆含「建議製作 App」→ 自動觸發

**Given**: 使用者貼回 raw_response：

```text
基於以上分析，建議製作 App 解決家長 LINE 痛點。
你應該開發一個 SaaS 平台...
```

**When**: 系統自動跑 G6.6 regex 偵測

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Layer 1 regex 觸發 | `/建議.{0,10}(製作|開發|做一個|打造).{0,10}(App|產品|平台|軟體|工具)/` ✓ |
| `no_solution_check_passed` | 自動寫入 `false` |
| Gate result | `blocked`（G6.5 觸發）|
| Fallback panel | 顯示「AI 在回覆裡幫你想了解決方案。請複製這段 guard 回 ChatGPT 重跑：『不要建議產品方案，只幫我把痛點看清楚。』」 |
| 重跑按鈕 | 出現「重置 prompt 並重新複製」按鈕 |
| Failure routing | 不退卡，留在卡 6 重跑 |

### TC 6.3 ❌ 8 題只填 6 題

**Given**:

```json
{
  "eight_answers": {
    "q1_specific_groups": "...",
    "q2_scenes_frequency": "...",
    "q3_workarounds": "...",
    "q4_dissatisfactions_categorized": "...",
    "q5_public_evidence": "",
    "q6_jtbd": "",
    "q7_possible_fake_pains": "可能不是...",
    "q8_interview_targets": "..."
  }
}
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `blocked`（G6.3 觸發）|
| 提示文案 | 「q5 和 q6 沒填。AI 給的太籠統，請回卡 1-5 補上更具體的細節再重跑」 |
| 缺漏題標記 | q5 / q6 textarea 邊框 caution amber |

### TC 6.4 ❌ raw_response 太短（< 200 字）

**Given**:

```json
{ "raw_response": "AI 給了一些建議。" }
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `blocked`（G6.4 觸發）|
| 提示文案 | 「AI 回覆太短（目前 12 字，至少 200 字）。可能 AI 沒有正確跑 8 題 — 重新貼上完整回覆」 |

### TC 6.5 ❌ ai_tool 未選

**Given**:

```json
{ "ai_tool": null, ... }
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `blocked`（G6.1 觸發）|
| 提示文案 | 「請從 ChatGPT DR / Claude / Perplexity / Gemini 中選一個」 |

### TC 6.6 ❌ ai_tool_reason 為空

**Given**:

```json
{ "ai_tool": "chatgpt_dr", "ai_tool_reason": "" }
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `blocked`（G6.2 觸發）|
| 提示文案 | 「為什麼選這個工具？1 句話即可（強迫思考工具屬性）」 |

### TC 6.7 反 solution mode 不誤判

**Given**: AI 回覆是中性句

```text
我建議你不要急著做產品，先把痛點看清楚。
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Layer 1 regex | 不觸發（「建議...不要急著做產品」中間 > 10 字）|
| `no_solution_check_passed` | 維持 true（若使用者勾選） |
| Gate result | 取決於其他條件 |

> **此 TC 確保 FORBIDDEN_PATTERNS 中 `{0,10}` 字元上限正確抓 false positive。**

---

## 7. 卡 7 ｜ 自己先猜 + 讀 AI

### 規則來源

`exit_gates_matrix.md § 卡 7` G7.1 - G7.5

### TC 7.1 ✅ guesses 4 欄填 + 4 checkpoints + 3 deltas + judgment table

**Given**:

```json
{
  "self_guess": {
    "guesses": {
      "most_painful_person": "中小型補習班 30-50 歲老師",
      "most_common_scene": "週六晚上寫 LINE",
      "biggest_dissatisfaction": "資料散在 3 處",
      "possible_fake_pain": "可能只是不喜歡跟家長溝通"
    },
    "ai_checkpoints_passed": {
      "people_segmented": true,
      "scenes_observable": true,
      "workaround_dissatisfactions_listed": true,
      "fake_pains_flagged": true
    },
    "pain_judgment_table": "...AI 整理的表格...",
    "deltas": {
      "biggest_diff": "AI 提到『補習班規模 ≤30 人』我沒想到",
      "ai_added": "Dcard 補教版證據連結 + JTBD 描述",
      "guess_unsupported": "我以為「不喜歡跟家長溝通」是主因，但 AI 證據顯示老師其實在意"
    }
  }
}
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `passed` |

### TC 7.2 ❌ 嘗試在填 guess 前讀 AI 回覆（時序鎖）

**Given**: 使用者剛進卡 7

**When**: 試圖看 AI 回覆區（卡 6 raw_response）

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| AI 回覆區 UI | 毛玻璃模糊覆蓋 |
| 覆蓋層文案 | 「先寫猜測才能看 AI（順序錯了會失去判斷力）」 |
| 「請 AI 整理判斷表」按鈕 | `disabled` |
| `aria-live="polite"` 通知 | 「先寫猜測才能看 AI」 |

**When**: 使用者填完 guesses 4 欄

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| 毛玻璃模糊 | 自動解除 |
| 「請 AI 整理判斷表」按鈕 | enabled |
| `aria-live` 通知 | 「現在可以看 AI 回覆了」 |

### TC 7.3 ❌ 4 checkpoints 只勾 3 個

**Given**:

```json
{
  "ai_checkpoints_passed": {
    "people_segmented": true,
    "scenes_observable": true,
    "workaround_dissatisfactions_listed": true,
    "fake_pains_flagged": false
  }
}
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `blocked`（G7.2 觸發）|
| 提示文案 | 「fake_pains_flagged 沒過 — AI 沒提醒哪些可能是假痛點。回卡 6 用補強 prompt 重跑」 |
| Failure routing | 退回卡 6 |

### TC 7.4 ❌ deltas 3 欄缺 1

**Given**:

```json
{
  "deltas": {
    "biggest_diff": "AI 提到...",
    "ai_added": "Dcard...",
    "guess_unsupported": ""
  }
}
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `blocked`（G7.4 觸發）|
| 提示文案 | 「guess_unsupported 必填 — 你猜的哪一條 AI 沒支持？這是反思核心」 |

### TC 7.5 ❌ guesses 缺 1 欄

**Given**:

```json
{
  "guesses": {
    "most_painful_person": "...",
    "most_common_scene": "...",
    "biggest_dissatisfaction": "",
    "possible_fake_pain": "..."
  }
}
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `blocked`（G7.1 觸發）|
| 提示文案 | 「biggest_dissatisfaction 必填 — 你猜他最大的不滿是什麼？」 |

### TC 7.6 ❌ pain_judgment_table 為空

**Given**:

```json
{ ..., "pain_judgment_table": "" }
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `blocked`（G7.3 觸發）|
| 提示文案 | 「請貼上 AI 整理的痛點判斷表（從卡 6 對話延續第二輪 prompt 跑出來）」 |

---

## 8. 卡 8 ｜ 訪談規劃

### 規則來源

`exit_gates_matrix.md § 卡 8` G8.1 - G8.6

### TC 8.1 ✅ ≥ 1 target + 3 questions + interview_taboos_understood

**Given**:

```json
{
  "interview_plan": {
    "targets": [
      {
        "persona": "中小型補習班數學老師",
        "contact_known": true,
        "contact_info": "林老師（已聯絡）",
        "planned_time": "2026-04-22 21:00"
      }
    ],
    "questions": [
      "你最近一次寫家長回報是什麼時候？花了多久？",
      "你現在用什麼方法解？試過什麼放棄了？",
      "你最不滿意哪一段？"
    ],
    "interview_taboos_understood": true,
    "ai_simulated_response": null
  }
}
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `passed` |

### TC 8.2 ❌ questions 含「會付多少錢」（推銷題）

**Given**:

```json
{
  "questions": [
    "你最近一次寫家長回報是什麼時候？",
    "你會付多少錢買一個工具？",
    "你會用嗎？"
  ]
}
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `blocked`（G8.4 觸發）|
| 黑名單 keyword 偵測 | `會付錢` / `會用嗎` 觸發 |
| 提示文案 | 「Q2「會付多少錢買」是推銷題，不是訪談題。請改問現況：他現在花多少時間？花多少錢？最不滿哪段？」 |
| 違規題 highlight | Q2 + Q3 邊框 caution amber |

### TC 8.3 ❌ targets 為空

**Given**:

```json
{ "targets": [] }
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `blocked`（G8.1 觸發）|
| 提示文案 | 「列不出真人訪談對象，代表這個社群你還沒進去。先回卡 2 補上 3 個有名字的人」 |
| Failure routing | 退回卡 2 |

### TC 8.4 ❌ contact_known === false 但 contact_info 為空

**Given**:

```json
{
  "targets": [
    { "persona": "安親班老師", "contact_known": false, "contact_info": "", "planned_time": "..." }
  ]
}
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `blocked`（G8.2 觸發）|
| 提示文案 | 「不認識的話，請填具體去哪找（例：「家附近安親班直接拜訪」）」 |

### TC 8.5 ❌ interview_taboos_understood === false

**Given**:

```json
{ "interview_taboos_understood": false, ... }
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `blocked`（G8.5 觸發）|
| 提示文案 | 「請先閱讀「訪談禁忌」並勾選『我看過』— 訪談技巧很重要，沒準備會浪費受訪者時間」 |
| UI 動作 | 自動 scroll 到禁忌清單區塊 |

### TC 8.6 ⚠️ targets[].persona 與卡 6 q8 沒交集

**Given**:

```json
{
  "targets": [{ "persona": "工程師" }]  // 但卡 6 q8 列的是 5 種補習班老師
}
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `warning`（G8.6 SOFT WARNING）|
| 過關按鈕 | `enabled` |
| Caution panel | 「你選的訪談對象（工程師）跟卡 6 AI 建議的 5 種人沒交集。確定要訪這個人嗎？」 |

### TC 8.7 ❌ questions 只有 2 題

**Given**:

```json
{ "questions": ["...", "..."] }
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `blocked`（G8.3 觸發）|
| 提示文案 | 「目前 2 題，至少需要 3 題。請從卡 6 q8 訪談題庫挑或自己寫第 3 題」 |

---

## 9. 卡 9 ｜ 真假判斷

### 規則來源

`exit_gates_matrix.md § 卡 9` G9.1 - G9.8

### TC 9.1 ✅ 5 scores + judgment + reason ≥ 100 字 + next_action

**Given**:

```json
{
  "verdict": {
    "scores": {
      "people_specificity": 5,
      "frequency": 5,
      "intensity": 4,
      "workaround_dissatisfaction": 5,
      "evidence_credibility": 4
    },
    "total_score": 23,
    "judgment": "true_pain",
    "reason_100w": "親眼觀察 5.5 小時、有 3 個有名字的真人、現有 workaround...（≥ 100 字）...",
    "most_confident_evidence": "親眼觀察林老師從 21:00 寫到 02:30 的具體行為",
    "least_confident": "≥50 人規模補習班是否同樣痛",
    "next_action": "interview"
  }
}
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `passed` |
| `current_step` | 9 → 10 |
| `status` | 從 `in_progress` → `structured` |

### TC 9.2 ❌ reason 只有 50 字

**Given**:

```json
{ "reason_100w": "親眼觀察了補習班老師寫到半夜兩點，這是真痛點。" }  // 22 字
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `blocked`（G9.3 觸發）|
| 字數提示 | 「目前 22 字，至少需要 100 字」 |
| 提示文案 | 「再補一些細節，這是這份填空簿的唯一交付物 — 你的書面判斷理由」 |

### TC 9.3 ❌ judgment === null

**Given**:

```json
{ "judgment": null, "scores": {...全填}, ... }
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `blocked`（G9.2 觸發）|
| 提示文案 | 「請選真痛點 / 假痛點 / 待訪談 三選一」 |

### TC 9.4 ❌ scores 任一未填

**Given**:

```json
{ "scores": { "people_specificity": 5, "frequency": null, ... } }
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `blocked`（G9.1 觸發）|
| 提示文案 | 「frequency 維度沒打分。請給 1-5 分」 |
| UI 標記 | 該分數條 highlight |

### TC 9.5 ⚠️ judgment === 'true_pain' 但 evidence_credibility < 3

**Given**:

```json
{
  "scores": { ..., "evidence_credibility": 2 },
  "judgment": "true_pain",
  "reason_100w": "..." // 100+ 字
}
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `warning`（G9.7 SOFT WARNING）|
| 過關按鈕 | `enabled` |
| Caution panel | 「證據可信度只有 2/5，但你判斷為真痛點。建議改為 pending_interview，先訪談 2-3 人再判」 |
| 兩個按鈕 | `[改為 pending_interview] [我堅持，繼續]` |

### TC 9.6 ❌ next_action === null

**Given**:

```json
{ ..., "next_action": null }
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `blocked`（G9.6 觸發）|
| 提示文案 | 「請選下一步：訪談 / 補證據 / 換題目」 |

### TC 9.7 ❌ most_confident_evidence 為空

**Given**:

```json
{ "most_confident_evidence": "" }
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Gate result | `blocked`（G9.4 觸發）|
| 提示文案 | 「最有把握的證據必填 — 你判斷的最強支撐是什麼？」 |

### TC 9.8 ❌ AI 按鈕不存在於卡 9

**Given**: 使用者打開 /learn/worksheet/09

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| 頁面 DOM | 不存在 `[data-action="ai-help"]` |
| 頁面 DOM | 不存在 `aria-label*="AI"` 元素 |
| 即使透過 console 注入 | 後端 API `/api/ai/run-prompt?card_step=9` 拒絕 |

### TC 9.9 教學模式 vs 生產模式 total_score 顯示

**Given**:

```json
{ "total_score": 23, "scores": {...} }
```

**Then**（依 settings.display_mode）:

| 模式 | UI 行為 |
| :--- | :--- |
| `teaching` | 顯示 `23 / 25` + 5 條分數條 + teaching_note「分數只是工具，不是答案」 |
| `production` | 不顯示分數，只顯示 ✓ Verified Green「真痛點」 status badge |
| LocalStorage | 兩模式皆保留 `verdict.scores` 與 `total_score` |
| 對外分享連結 | 兩模式皆過濾分數（R4.2）|

---

## 10. 失敗路由整合測試

對應 `exit_gates_matrix.md § 2.1 路由規則總覽`。

### TC FR.1 卡 2 fail → 回卡 1（保留資料）

**Given**: 卡 1 已完成，卡 2 列不出 3 個真人

**When**: 點 `[回卡 1，找一個真人聊再回來]`

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| 跳轉 | `/learn/worksheet/01` |
| `current_step` | 2 → 1 |
| 卡 1 資料 | 完整保留 |
| 卡 2 資料 | 保留（但標記 `stale=false`，再進卡 2 時提示「你回退過卡 1，要更新嗎？」）|

### TC FR.2 卡 6 AI 推銷 → 不退卡，重跑 prompt

**Given**: 卡 6 raw_response 觸發 G6.6

**When**: 系統自動處理

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| 不退卡 | `current_step` 維持 6 |
| Failure routing | 「補強 prompt 重跑」（不是退卡）|
| `no_solution_check_passed` | 自動寫入 false |
| UI | 顯示「重置 prompt 並重新複製」按鈕 |

### TC FR.3 卡 9 完成後再回退（清空 verdict）

**Given**: 卡 9 已完成，`status === 'structured'`，已產生身份證

**When**: 使用者從 stepper 點卡 9 試圖修改

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| 提示 modal | 「修改卡 9 會清空 verdict 並退回 in_progress 狀態，確定？」 |
| 兩個按鈕 | `[取消] [我了解，退回修改]` |
| 確認後 | `verdict.*` 全部清空，`status: structured → in_progress` |

### TC FR.4 卡 10 完成後不允許回退

**Given**: 痛點身份證已匯出（`exported.formats.length > 0`）

**When**: 使用者試圖修改卡 9

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| 提示 modal | 「身份證已匯出代表已 final。如需修改，請建立新的 PainCard」 |
| 唯一按鈕 | `[建立新 PainCard]` → 跳轉 `/learn/worksheet?new=true` |
| 舊 PainCard | 保留（`status === 'structured'`）|

---

## 11. Fuzz Testing — 極端輸入

### TC FUZZ.1 卡 1 verbatim 輸入 10000 字

**Given**:

```json
{ "verbatim": "我每週六晚上...".repeat(500) }  // ~10000 字
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| 前端 input | 接受輸入（無字數上限）|
| 過關規則 | passed（≥ 10 字）|
| LocalStorage | 寫入成功 |
| 渲染 | 不卡頓（< 100ms）|
| 卡 10 PDF 匯出 | 截斷到合理長度（前 200 字 + 「...」）或多頁分頁 |

### TC FUZZ.2 全 emoji / 全空白字元

**Given**:

```json
{ "verbatim": "🎉🎊🥳" }  // 3 個 emoji
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| 字數計算 | 應計算字符數（3 個 emoji = 3 字符）→ blocked（< 10 字）|
| 提示文案 | 「verbatim 太短（3 字）」 |

**Given**:

```json
{ "verbatim": "                          " }  // 26 個空格
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| 前端應 trim 空白 | trim 後 length === 0 |
| Gate result | `blocked` |
| 提示文案 | 「verbatim 必填」 |

### TC FUZZ.3 SQL Injection 嘗試

**Given**:

```json
{ "verbatim": "'; DROP TABLE paincards; -- " }
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| LocalStorage 寫入 | 成功（純字串，不會 inject 到任何 SQL）|
| 後端（M2+ 站內 LLM）| Parameterized query / ORM 處理，不會 inject |
| 顯示時 | 純文字 escape，不會被誤認為 SQL |

### TC FUZZ.4 XSS 嘗試

**Given**:

```json
{ "verbatim": "<script>alert('xss')</script>" }
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| 前端渲染 | 自動 HTML escape（React / Vue 預設）|
| 不會執行 script | 純文字顯示 `<script>...</script>` |
| Markdown 匯出 | escape 為 `&lt;script&gt;...` 或保留純文字 |

### TC FUZZ.5 LocalStorage quota 滿

**Given**: LocalStorage 已用 4.9MB（接近 5MB 上限）

**When**: 嘗試寫入新 PainCard

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| 觸發 `QuotaExceededError` | 前端 catch |
| 提示 toast | 「瀏覽器儲存已滿，請清除舊資料或匯出後刪除」 |
| 連結 | `[管理 PainCards]` → 歷史頁（M2 範圍）|
| 不靜默失敗 | 不可寫入失敗但 UI 不告知 |

### TC FUZZ.6 卡 9 reason_100w 輸入超長字串

**Given**:

```json
{ "reason_100w": "理由理由理由...".repeat(10000) }  // ~50000 字
```

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| 前端 input | 接受（無上限）|
| Gate result | `passed`（≥ 100）|
| LocalStorage 序列化 | 不超過 PainCard 預估 50KB 限制（若超過提示警告）|
| Markdown 匯出 | 完整輸出 |

---

## 12. Race Condition 測試

### TC RC.1 同時開兩個 tab 編輯同一 PainCard

**Given**: Tab A 和 Tab B 都打開 `/learn/worksheet/04?id={uuid}`

**When**: 兩 tab 同時填 `tool_name`

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| LocalStorage 不衝突 | 後寫入的覆蓋先寫入的（last-write-wins）|
| Tab A 失去焦點時 | `storage` event 觸發，提示「另一個視窗已修改此 PainCard，要重新載入嗎？」 |
| 兩個按鈕 | `[重新載入] [保留我的編輯]` |

### TC RC.2 卡 7 時序鎖：使用者快速點擊解鎖

**Given**: 使用者連續快速填 4 個 guesses（短時間內 < 500ms）

**When**: 系統判定何時解鎖 AI 回覆

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| 解鎖條件 | 4 欄全填 + onChange 事件全觸發 |
| Debounce | 不需要（這是即時判定，不是 auto-save）|
| 防止抖動 | 解鎖後不會因為使用者再次清空一欄就重新鎖（避免突兀 UX）|

### TC RC.3 自動儲存衝突（debounce 500ms）

**Given**: 使用者連續快速 typing 10 次（每次 < 50ms）

**When**: Debounce 500ms 後寫入 LocalStorage

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| 只寫入 1 次 | 最後一次 typing 後 500ms |
| 不會寫入 10 次 | 避免 LocalStorage 過度寫入 |
| `beforeunload` 強制儲存 | 即使在 debounce 期間關閉視窗，最後狀態也會保留 |

### TC RC.4 跨卡片切換時的暫存

**Given**: 使用者在卡 4 填到一半（dissatisfactions 只填 2 個）

**When**: 點擊 stepper 跳到卡 1 重看

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| 卡 4 資料 | 保留（即使未過關）|
| `current_step` | 不變更（只是切換 view）|
| 卡 4 stepper 圖示 | 顯示為「進行中」（不是 ✓ 也不是 disabled）|
| 切回卡 4 | 資料還在 |

---

## 13. 教學模式 vs 生產模式閘門差異

對應 `exit_gates_matrix.md § 4.2`。

### TC MODE.1 教學模式：失敗訊息詳細

**Given**: `display_mode === 'teaching'`，卡 2 觸發 G2.6（合成 persona）

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Caution panel 文案 | 完整版（含「為什麼這樣設計」教學說明）：「找不到 3 個真人，代表這個圈子你還不熟。**這是訓練設計上的關鍵卡點 — worksheet 第 122 行明白擋。** 先去這群人聚集的地方混 1-2 週再回來」 |
| 補強 prompt | 顯示 worksheet 原文教學 |

### TC MODE.2 生產模式：失敗訊息精簡

**Given**: `display_mode === 'production'`，卡 2 觸發 G2.6

**Then**:

| 檢查 | 期望值 |
| :--- | :--- |
| Caution panel 文案 | 精簡版：「找不到 3 個真名 — 請填真名或回卡 1 找真人」 |
| 補強 prompt | 直接觸發（不顯示教學說明）|

### TC MODE.3 卡 9 total_score 顯示差異

對應 `TC 9.9`。

---

## 14. 複合測試矩陣

### TC MATRIX.1 全部 hard gate 不可繞過

```typescript
describe('全部 hard gate 不可繞過', () => {
  for (const card of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    test(`卡 ${card} 必填欄位不可空`, async () => {
      const paincard = createEmptyPainCardAtStep(card);
      const result = await checkExitGate(card, paincard);
      expect(result.passed).toBe(false);
      expect(result.failures.length).toBeGreaterThan(0);
    });
  }
});
```

### TC MATRIX.2 全部 soft warning 可放行

```typescript
describe('全部 soft warning 可放行', () => {
  const softWarnings = [
    { card: 1, fixture: 'card-1-source-name-pseudonym' },  // G1.7
    { card: 2, fixture: 'card-2-contact-future' },         // G2.7
    { card: 3, fixture: 'card-3-vague-stuck' },            // G3.4
    { card: 4, fixture: 'card-4-short-dissatisfaction' },  // G4.4
    { card: 5, fixture: 'card-5-abstract-side' },          // G5.5
    { card: 8, fixture: 'card-8-no-q8-overlap' },          // G8.6
    { card: 9, fixture: 'card-9-true-pain-low-evidence' }, // G9.7
  ];
  for (const tc of softWarnings) {
    test(`卡 ${tc.card} soft warning ${tc.fixture} 可放行`, async () => {
      const paincard = loadFixture(tc.fixture);
      const result = await checkExitGate(tc.card, paincard);
      expect(result.passed).toBe(true);  // 放行
      expect(result.warnings.length).toBeGreaterThan(0);  // 但有警告
      // 確認 metadata 紀錄
      expect(paincard.metadata.overrode_warning).toContain(tc.fixture.split('-').pop());
    });
  }
});
```

### TC MATRIX.3 友善文案掃描

```typescript
test('全部失敗訊息符合 brand voice', async () => {
  const allFailureMessages = await collectAllFailureMessages();
  for (const msg of allFailureMessages) {
    expectFriendlyMessage(msg);
  }
});
```

---

## 15. 測試執行策略

### 15.1 測試頻率

| 測試類別 | 觸發 | 預估時間 |
| :--- | :--- | :--- |
| 規則式 unit test（all TC）| 每個 PR | 10-30 秒 |
| 互動測試（Playwright）| 每個 PR | 5-10 分鐘 |
| Fuzz testing | nightly | 30-60 分鐘 |
| Race condition | weekly | 5 分鐘 |

### 15.2 測試覆蓋率目標

- 9 卡 × 每張卡 ≥ 5 個 TC = ≥ 45 個正向 / 失敗 TC
- 失敗路由全覆蓋（10 條規則）
- Fuzz testing 6 個極端 case
- Race condition 4 個並發 case
- **總計 ≥ 65 個 TC**

### 15.3 失敗處理

- Hard gate 失敗 → 立即修
- Soft warning 文案不符 brand voice → 文案 PR 處理
- Fuzz test 失敗 → 加 input validation
- Race condition 失敗 → 加 storage event listener / debounce

---

## 16. 變更紀錄

| 版本 | 日期 | 變更 |
| :--- | :--- | :--- |
| 1.0 | 2026-05-01 | 首版；對應 worksheet v1.0、exit_gates_matrix.md v1.0、data_model.md v1.0 |
