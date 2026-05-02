# AI Prompt Copy Block 元件規格

> PainMap Worksheet 的 AI 互動核心元件。
> 出現在卡 3, 4, 5, 6, 7, 8 — 讓使用者一鍵複製內建的 prompt 到 ChatGPT / Claude / Perplexity / Gemini，並把 AI 回覆貼回來。
> **MVP 階段：複製到外部**；後期：站內 LLM API（feature flag 切換）。

---

## 1. 元件用途

- **責任**：提供使用者一個「半自助」的 AI 工作流：
  1. 顯示一段預先設計好的 prompt（已根據 PainCard 自動填入變數）
  2. 提供「複製到剪貼簿」按鈕 + 「直接打開 ChatGPT」連結
  3. 提供 textarea 讓使用者貼回 AI 回覆
  4. 偵測 AI 回覆是否進入「solution mode」（推銷產品 / 商業模式）並警告

- **不負責**：
  - ❌ 不負責呼叫 LLM API（M1 階段）— 那是 M2+ 的 `api/ai_proxy_spec.md`
  - ❌ 不負責驗證 AI 回覆的「正確性」（沒有正確答案，只看是否違反 solution mode）
  - ❌ 不負責「自動填入 PainCard」— 解析 AI 回覆是另一個元件 (`AIResponseParser`)

---

## 2. 結構

### 2.1 整體 Layout（Desktop > 1280px）

兩欄：左 prompt 區，右 response 區。

```
┌───────────────────────────────────────────────────────────────┐
│  🤖 AI 幫你校對                                               │
│                                                                │
│  ┌─ 選擇 AI 工具 ───────────────────────────────────────────┐ │
│  │  [● ChatGPT]  [○ Claude]  [○ Perplexity]  [○ Gemini]   │ │
│  │  AI 不會幫你設計產品。它只幫你整理、校對、找證據。      │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌─ 複製這段 prompt ───────────┐  ┌─ 貼回 AI 的回覆 ────────┐ │
│  │ 我有一個抱怨原句：            │  │                       │ │
│  │ {complaint.verbatim}         │  │  (空白 textarea)       │ │
│  │                              │  │                       │ │
│  │ 抱怨主人翁是：                │  │                       │ │
│  │ {people.background}          │  │                       │ │
│  │ ...                          │  │                       │ │
│  │                              │  │                       │ │
│  │ [📋 複製] [↗ 打開 ChatGPT]  │  │                       │ │
│  └─────────────────────────┘  └─────────────────────────┘ │
│                                                                │
│  (條件性顯示) ⚠️ AI 開始推銷解法了。要不要重跑 prompt？     │
└───────────────────────────────────────────────────────────────┘
```

### 2.2 Mobile（< 768px）

單欄垂直堆疊：tool selector → prompt 區 → response 區 → 警告區。

### 2.3 元件結構

| 區塊 | 元素 | 必/選 |
| :--- | :--- | :--- |
| 標題列 | section_title (H3 + emoji) | 必 |
| 工具選擇器 | ToolSelector (4 選 1) | 必 |
| 反 solution mode 提示 | InlineText | 必 |
| Prompt 顯示區 | PromptDisplay (含複製按鈕) | 必 |
| 外部連結按鈕 | ExternalLinkButton | 必 |
| 回覆貼回區 | ResponseTextarea | 必 |
| 警告 banner | ValidationWarning | 條件顯示 |

---

## 3. 元素細節

### 3.1 Section Title

- 字級：H3 (18px / 600)
- 格式：`🤖 AI 幫你 {動詞}`
  - 卡 3: `🤖 AI 幫你校對`
  - 卡 4: `🤖 AI 幫你補充其他可能`
  - 卡 5: `🤖 AI 幫你提案矛盾`
  - 卡 6: `🤖 AI 幫你跑研究`
  - 卡 7: `🤖 AI 幫你整理判斷表`
  - 卡 8: `🤖 AI 幫你模擬訪談（熱身）`

### 3.2 Tool Selector

```typescript
type ToolOption = {
  id: 'chatgpt' | 'claude' | 'perplexity' | 'gemini';
  label: string;
  external_url: string;
  recommended_for_card: number[];
};

const TOOLS: ToolOption[] = [
  { id: 'chatgpt',    label: 'ChatGPT',    external_url: 'https://chat.openai.com',     recommended_for_card: [3, 4, 5, 6, 7, 8] },
  { id: 'claude',     label: 'Claude',     external_url: 'https://claude.ai',           recommended_for_card: [6, 7] },
  { id: 'perplexity', label: 'Perplexity', external_url: 'https://www.perplexity.ai',   recommended_for_card: [6] },
  { id: 'gemini',     label: 'Gemini',     external_url: 'https://gemini.google.com',   recommended_for_card: [6] },
];
```

#### UI 規格

- 4 個 button radio 並排（Desktop）/ 2x2 grid（Mobile）
- 預設選擇：依卡片不同（卡 6 預設 ChatGPT Deep Research，其他預設 ChatGPT）
- 選中態：Border 2px Deep Teal + bg Primary Light
- 未選中態：Border 1px Default + bg white
- Hover：Border Deep Teal

#### 反 solution mode 提示

工具選擇器下方固定顯示：

```
AI 不會幫你設計產品。它只幫你整理、校對、找證據。
```

- 字級 Body SM (13px)
- 色彩 Text Secondary (#5C6B7A)
- 不可關閉，永久顯示

### 3.3 Prompt 顯示區 (PromptDisplay)

#### 視覺

- 容器：`bg-[#F1F3F5]` (BG Muted) + 圓角 8px + padding 16px
- 字體：JetBrains Mono (等寬字體) 14px / 1.5
- 內容：完整 prompt 文字，含已替換的變數

#### 變數插值機制

prompt 模板含 `[貼上卡片 X 的原句]` 等占位符，元件自動替換為 PainCard 對應欄位值：

```typescript
const VARIABLE_MAP: Record<string, (card: PainCard) => string> = {
  '[貼上卡片 1 的原句]':           (c) => c.complaint.verbatim,
  '[貼上卡片 2 的「大概背景」]':    (c) => c.people.background,
  '[貼上卡片 3]':                  (c) => c.stuck_formula.user_draft || c.stuck_formula.ai_polished || '',
  '[貼上卡片 3 的卡關公式]':        (c) => c.stuck_formula.ai_polished || c.stuck_formula.user_draft,
  '[貼上卡片 4]':                  (c) => `${c.workaround.tool_name} — ${c.workaround.why_still_stuck}`,
  '[貼上卡片 4 的方法]':           (c) => c.workaround.tool_name,
  '[貼上卡片 4 的 3 個理由]':      (c) => c.workaround.user_dissatisfactions.join('；'),
  '[貼上訪談對象]':                (c) => c.interview_plan.targets[0]?.persona || '',
  '[貼上你的訪談題 1]':            (c) => c.interview_plan.questions[0] || '',
  '[貼上你的訪談題 2]':            (c) => c.interview_plan.questions[1] || '',
  '[貼上你的訪談題 3]':            (c) => c.interview_plan.questions[2] || '',
};

function interpolate(template: string, card: PainCard): string {
  let result = template;
  for (const [key, getter] of Object.entries(VARIABLE_MAP)) {
    if (result.includes(key)) {
      const value = getter(card);
      if (!value) {
        // 標示缺資料（紅色提示但不阻斷）
        result = result.replace(key, `❌「${key}」尚未填寫`);
      } else {
        result = result.replace(key, value);
      }
    }
  }
  return result;
}
```

#### 缺資料處理

如果使用者在卡 3 觸發 AI 校對，但卡 1 還沒填 `complaint.verbatim`：
- prompt 顯示處標示「❌「卡片 1 的原句」尚未填寫」
- 複製按鈕變 disabled，tooltip：「請先回卡 1 填寫原句」
- 提供「回卡 1」連結

### 3.4 複製按鈕

```html
<button class="copy-btn" aria-label="複製 prompt 到剪貼簿">
  <Icon name="clipboard" />
  複製 prompt
</button>
```

#### 互動

- 點擊：呼叫 `navigator.clipboard.writeText(promptText)`
- 成功：顯示 Toast「已複製到剪貼簿」+ 按鈕短暫變綠 + icon 切為 ✓ 0.6s
- 失敗（瀏覽器不支援 / 權限被拒）：fallback 用 `document.execCommand('copy')` 或顯示「請手動複製：[textarea 自動 select 文字]」

#### 反模式

- ❌ 禁止「複製成功！太棒了！」等過度激勵文案
- ❌ 禁止複製成功後彈出 modal「想知道更多技巧嗎？」（破壞流程）

### 3.5 外部連結按鈕

```html
<a href="https://chat.openai.com"
   target="_blank"
   rel="noopener noreferrer"
   class="external-link-btn">
  ↗ 打開 ChatGPT
</a>
```

- 字級 Body MD
- 開啟新分頁，避免使用者離開 worksheet
- 文案依當前選中工具動態變化：「打開 Claude」「打開 Perplexity」「打開 Gemini」

### 3.6 Response Textarea

#### 視覺

- 高度：min-height 200px，可拉伸
- placeholder：「貼回 AI 的回覆（整段，不要美化）」
- 字數計數：右下角顯示「字數 X」（不設上限，但顯示用於使用者參考）

#### 互動

- onChange：debounce 5 秒寫入 LocalStorage 對應欄位（如 `ai_evidence.raw_response`）
- onBlur：立即寫入並觸發 solution mode 偵測

### 3.7 反 solution mode 偵測 (Validation Warning)

#### 偵測邏輯

```typescript
const SOLUTION_MODE_PATTERNS: RegExp[] = [
  /建議開發/,
  /建議做一個/,
  /應該設計/,
  /建議使用 SaaS/,
  /我們可以打造 App/,
  /建議的解決方案/,
  /推薦工具：/,
  /商業模式/,
  /market opportunity/i,
  /TAM/,
  /SAM/,
  /MVP[^A-Z]/,  // 「MVP（最小可行產品）」這類，但避免誤判單字
  /訂閱模式/,
  /訂閱費/,
];

function detectSolutionMode(response: string): {
  detected: boolean;
  matched_patterns: string[];
} {
  const matched = SOLUTION_MODE_PATTERNS
    .filter(pattern => pattern.test(response))
    .map(p => p.source);

  return {
    detected: matched.length > 0,
    matched_patterns: matched,
  };
}
```

#### Warning UI

```
┌────────────────────────────────────────────────────┐
│ ⚠️ AI 開始推銷解法了。要不要重跑 prompt？           │
│                                                     │
│ 偵測到關鍵字：「建議開發」「商業模式」              │
│                                                     │
│ 建議在 prompt 開頭加一句：                          │
│ 「不要建議任何解決方案，只回答證據面」              │
│                                                     │
│ [重跑 prompt]   [我了解，繼續]                     │
└────────────────────────────────────────────────────┘
```

- 容器：`bg-[#FEF3E2]` (Accent Light) + border 1px Accent + padding 16px
- 不阻斷流程：使用者可選擇「我了解，繼續」忽略警告
- 「重跑 prompt」：清空 response textarea + 重新顯示 prompt（強調建議補充的提示）

#### 卡片特定豁免

某些卡片不啟用此偵測：
- 卡 5（矛盾選擇）：AI 必須給出「建議的矛盾」，這是預期行為
- 其他需 AI 提案的卡片：依 prompt 設計判斷是否需要

每個卡片在 spec 中明確標示 `enable_solution_mode_detection: true | false`。

---

## 4. MVP vs 後期模式

### 4.1 MVP（M1）：複製到外部

```typescript
const AI_INTEGRATION_MODE: 'external_copy' | 'internal_api' = 'external_copy';
```

行為：
- 顯示 prompt + 複製按鈕 + 外部連結
- 使用者必須手動操作 ChatGPT
- response 由使用者貼回

### 4.2 後期（M2+）：站內 LLM API

```typescript
const AI_INTEGRATION_MODE: 'internal_api' = 'internal_api';
```

行為：
- 顯示 prompt（仍然顯示，讓使用者看到 AI 收到什麼）
- 增加「呼叫 AI」按鈕（取代「複製」+「打開 ChatGPT」）
- 點擊後透過 Edge Function 代理到 LLM API
- 串流回覆顯示在 response 區
- 仍保留「自己改 prompt」與「複製到外部」選項

### 4.3 Feature Flag 切換

```typescript
// .env / runtime config
PAINMAP_AI_MODE=external_copy
// 或
PAINMAP_AI_MODE=internal_api
```

```typescript
function AIPromptCopyBlock(props: AIPromptCopyBlockProps) {
  const mode = useFeatureFlag('PAINMAP_AI_MODE');
  // ... 依 mode 渲染對應 UI
}
```

---

## 5. 反模式（CRITICAL）

### 5.1 等待焦慮禁令

- ❌ **禁止 typing animation**（打字機效果）模擬 AI 思考
  - 理由：違反 brand 「沉穩」原則；製造「AI 在等我」的焦慮
  - 替代：M1 階段沒有等待時間（外部複製）；M2+ 用步驟文字「正在向 AI 請求...」「正在串流回覆...」（不超過 3 步驟）
- ❌ 禁止「AI 思考中... 請稍候」+ 旋轉 spinner 過度動畫
- ❌ 禁止顯示「AI 正在分析您的痛點」這種誇大文案

### 5.2 過度激勵禁令

- ❌ 禁止「太棒了！AI 給了你絕佳的回答！」
- ❌ 禁止「你已經完成 N 次 AI 互動」（偽進度）
- ❌ 禁止「升級 Pro 解鎖更聰明的 AI」（M2+ 即使有付費版也不在元件裡推銷）

### 5.3 失控信任禁令

- ❌ 禁止「AI 給的答案 100% 正確」
- ❌ 禁止「AI 推薦你下一步做 X」（直接違反 brand「行動優於分析」中「行動由使用者決定」的精神）

### 5.4 資料外洩禁令

- ❌ 禁止把使用者的 PainCard 內容傳到第三方分析服務
- ❌ 禁止 LocalStorage 內容透過 query string 傳到外部 ChatGPT URL（即使是「便利」也不行）
- 「打開 ChatGPT」按鈕只導向 chat.openai.com 首頁，不帶 prompt

---

## 6. 元件 API

```typescript
type AIPromptCopyBlockProps = {
  /** 對應卡片號 (3, 4, 5, 6, 7, 8) */
  cardNumber: 3 | 4 | 5 | 6 | 7 | 8;

  /** Prompt 模板 ID（從 references/ai_prompt_library.md） */
  promptId: string;

  /** PainCard 資料，用於變數插值 */
  card: PainCard;

  /** 寫回 PainCard 的 callback */
  onResponseChange: (response: string) => void;

  /** 是否啟用 solution mode 偵測 */
  enableSolutionModeDetection?: boolean;

  /** AI 工具預設選擇 */
  defaultTool?: 'chatgpt' | 'claude' | 'perplexity' | 'gemini';

  /** AI 整合模式（feature flag） */
  mode?: 'external_copy' | 'internal_api';
};
```

---

## 7. 狀態定義

| 狀態 | 條件 | 視覺 |
| :--- | :--- | :--- |
| `default` | 元件初始載入 | prompt 顯示，response 空白，複製按鈕 enabled |
| `missing_data` | 變數插值失敗 | prompt 顯示「❌ 缺資料」，複製按鈕 disabled |
| `copied` | 複製成功 0.6s 內 | 複製按鈕變綠 + icon ✓ |
| `response_filled` | response 有內容 | 字數計數顯示，無警告 |
| `solution_mode_warning` | 偵測到 solution mode | Amber banner 顯示 |
| `internal_api_loading` (M2+) | 呼叫站內 API 中 | 「呼叫 AI」按鈕變 spinner + 文字「正在請求...」 |
| `internal_api_error` (M2+) | API 呼叫失敗 | 顯示「呼叫失敗，請手動複製到 ChatGPT」 + fallback |

---

## 8. 無障礙 (a11y)

### 8.1 ARIA 標記

```html
<section role="region" aria-labelledby="ai-prompt-title">
  <h3 id="ai-prompt-title">🤖 AI 幫你校對</h3>

  <fieldset>
    <legend>選擇 AI 工具</legend>
    <input type="radio" name="ai-tool" id="tool-chatgpt" />
    <label for="tool-chatgpt">ChatGPT</label>
    <!-- ... -->
  </fieldset>

  <pre aria-label="預先設計的 prompt 內容" tabindex="0">
    {prompt content}
  </pre>

  <button aria-label="複製 prompt 到剪貼簿">複製</button>

  <textarea
    aria-label="貼回 AI 的回覆"
    aria-describedby="response-help"
    placeholder="貼回 AI 的回覆"
  ></textarea>
  <p id="response-help">把 AI 在 ChatGPT 的整段回覆貼到這裡</p>
</section>
```

### 8.2 鍵盤操作

- Tab 順序：tool selector → 複製按鈕 → 外部連結 → response textarea
- prompt 區為 `tabindex="0"` 讓螢幕閱讀器朗讀，但不可編輯
- Esc 鍵：關閉警告 banner

### 8.3 警告 banner 的螢幕閱讀器宣告

- 使用 `role="alert"` + `aria-live="polite"` 讓警告自然朗讀
- 不使用 `aria-live="assertive"`（避免打斷使用者輸入）

---

## 9. Acceptance Criteria

- [ ] 4 個 AI 工具選擇器運作正常
- [ ] Prompt 變數插值正確替換（VARIABLE_MAP 全部覆蓋）
- [ ] 變數缺資料時 prompt 顯示提示，複製按鈕 disabled
- [ ] 複製按鈕在所有主流瀏覽器運作（Chrome / Firefox / Safari / Edge）
- [ ] 複製失敗有 fallback（手動 select textarea）
- [ ] 外部連結按鈕在新分頁開啟，不帶任何 query string
- [ ] response textarea 自動 5 秒 debounce 寫入 LocalStorage
- [ ] solution mode 偵測 ≥ 90% recall（含「建議開發」「商業模式」等關鍵字）
- [ ] 偵測命中時顯示 amber banner，不阻斷流程
- [ ] 「重跑 prompt」按鈕正確清空 response 並提示補充
- [ ] 「我了解，繼續」按鈕關閉警告，不再彈出
- [ ] 沒有 typing animation
- [ ] 沒有「太棒了」「AI 推薦你」等過度文案
- [ ] 沒有把 PainCard 內容傳到第三方
- [ ] 鍵盤可達所有按鈕與 textarea
- [ ] aria-label / aria-live / role="alert" 正確標記
- [ ] M2+ 模式：feature flag 切換正常，內部 API 失敗有 fallback

---

## 10. 變更紀錄

| 版本 | 日期 | 變更 |
| :--- | :--- | :--- |
| 1.0 | 2026-05-01 | 首版；定義工具選擇器、prompt 變數插值、solution mode 偵測、MVP/M2 模式切換 |
