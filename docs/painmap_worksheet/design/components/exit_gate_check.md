# Exit Gate Check 元件規格

> 每張卡片底部的「下一步」按鈕區塊。
> 責任：檢查 PainCard 對應欄位是否符合過關條件，符合則放行，未符合則顯示「還缺什麼」。
> 對應 `references/exit_gates_matrix.md` 的完整失敗回退規則。

---

## 1. 元件用途

- **位置**：每個卡片頁 (`/learn/worksheet/01` ~ `/09`) 的底部，採 sticky 定位
- **責任**：
  1. 即時檢查當前 PainCard 是否符合該卡片的過關條件
  2. 顯示 checklist：哪些通過、哪些還缺
  3. 控制「下一張卡片」按鈕的 enabled / disabled 狀態
  4. 失敗時提供「友善建議」回退路徑（不是強制）
  5. 記錄通過後寫入 `current_step` 並導向下一張

- **不負責**：
  - ❌ 不負責驗證 AI 回覆品質（那是 AI Prompt Copy Block 的事）
  - ❌ 不負責欄位即時驗證（那是 form 元件本身的事，例如 textarea 的字數計數）
  - ❌ 不負責資料儲存（那是 LocalStorage 自動儲存的事）

---

## 2. 結構

### 2.1 視覺 Layout

#### 未通過狀態（locked）

```
┌──────────────────────────────────────────────────────────────┐
│ 過關檢查                                                      │
│                                                                │
│  ✓ 寫的是原句，不是你的解釋                                   │
│  ✓ 至少有 1 個有名字的真人                                    │
│  ✗ 場景描述太抽象                                             │
│                                                                │
│  ┌─ 還缺什麼 ─────────────────────────────────────────────┐ │
│  │ 場景太抽象。試試寫「2026-04-15 21:00，他在書桌前打開    │ │
│  │ LINE 寫家長訊息」這種具體時間 + 地點 + 動作。            │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                                │
│  [先存檔離開]                       [下一張卡片 →] (disabled) │
└──────────────────────────────────────────────────────────────┘
```

#### 通過狀態（ready）

```
┌──────────────────────────────────────────────────────────────┐
│ ✓ 過關檢查通過                                                │
│                                                                │
│  ✓ 寫的是原句，不是你的解釋                                   │
│  ✓ 至少有 1 個有名字的真人                                    │
│  ✓ 場景描述具體                                               │
│                                                                │
│  [先存檔離開]                       [下一張卡片 →]            │
└──────────────────────────────────────────────────────────────┘
```

#### 警告通過狀態（warning，可繼續但建議檢視）

```
┌──────────────────────────────────────────────────────────────┐
│ ⚠️ 通過但有疑慮                                                │
│                                                                │
│  ✓ 8 題 prompt 都有 AI 回答                                   │
│  ⚠️ 偵測到 AI 提到「建議開發 App」                            │
│                                                                │
│  ┌─ 建議 ────────────────────────────────────────────────┐ │
│  │ AI 偷渡了解法建議。你可以選擇：                          │ │
│  │ 1. 重跑 prompt 加一句「不要建議任何解決方案」            │ │
│  │ 2. 自己手動忽略 AI 的解法建議部分，繼續下一張           │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                                │
│  [回去重跑]                         [仍要繼續 →] (amber)      │
└──────────────────────────────────────────────────────────────┘
```

### 2.2 元件結構

| 區塊 | 元素 | 必/選 |
| :--- | :--- | :--- |
| 標題列 | gate_title (動態：通過 / 未通過 / 警告) | 必 |
| Checklist | check_items (每個 exit condition 一條) | 必 |
| 「還缺什麼」說明區 | failure_hint | 條件顯示 |
| 主按鈕 | next_button (Primary / disabled / amber) | 必 |
| 退出按鈕 | retreat_link (Secondary, link style) | 必 |

---

## 3. 三種狀態

### 3.1 `locked` — 未通過

| 屬性 | 值 |
| :--- | :--- |
| gate_title | "過關檢查" + 中性灰圖示 |
| checklist 視覺 | 通過項目 ✓ 綠色，未通過項目 ✗ Text Secondary 灰色 |
| failure_hint | 顯示，列出缺什麼 + 具體建議 |
| next_button | disabled，hover tooltip 顯示「還缺：XXX」 |
| 觸發條件 | `validateExitGate(card)` 回傳 `passed: false` |

#### Tooltip 文案

next_button 為 disabled 時，hover 顯示：
- 單一缺項：「還缺：場景描述」
- 多項缺：「還缺：場景描述、3 個有名字的人」

### 3.2 `ready` — 通過

| 屬性 | 值 |
| :--- | :--- |
| gate_title | "✓ 過關檢查通過" + 綠色圖示 |
| checklist 視覺 | 全部 ✓ 綠色 |
| failure_hint | 隱藏 |
| next_button | enabled，Primary 樣式（Amber CTA） |
| 觸發條件 | `validateExitGate(card)` 回傳 `passed: true` 且無警告 |

### 3.3 `warning` — 通過但有疑慮

| 屬性 | 值 |
| :--- | :--- |
| gate_title | "⚠️ 通過但有疑慮" + amber 圖示 |
| checklist 視覺 | 通過項目 ✓ 綠色，警告項目 ⚠️ amber |
| failure_hint | 顯示，建議重跑或繼續 |
| next_button | enabled，但採用 amber 樣式（不是綠色 CTA） |
| 觸發條件 | `passed: true` 且 `warnings.length > 0` |

#### 警告場景（依卡片）

- 卡 6：AI 回覆偵測到 solution mode 字串
- 卡 7：「猜 vs AI 差異」textarea 字數少於 30 字
- 卡 9：書面理由字數少於 100 字（接近邊界）

警告通過後不阻斷流程，但會在下一張卡片頭部顯示「卡 X 有警告，要不要回去檢視？」reminder。

---

## 4. 過關條件 Validation Logic

### 4.1 通用介面

```typescript
type ValidationResult = {
  passed: boolean;
  errors: string[];        // 未通過原因
  warnings: string[];      // 通過但有疑慮的原因
  failure_routes: FailureRoute[];  // 失敗時的回退建議
};

type FailureRoute = {
  reason: string;          // 失敗的具體原因
  target_card: number | 'stay';  // 建議目標卡片號或留在當頁
  suggestion: string;      // 給使用者的建議文案
};

function validateExitGate(
  cardNumber: number,
  card: PainCard,
  metadata?: { ai_response_warnings?: string[] }
): ValidationResult { /* ... */ }
```

### 4.2 各卡片的 Validation 邏輯（摘要）

> 完整邏輯詳見 `references/exit_gates_matrix.md`。本元件依此邏輯執行檢查。

#### 卡 1：抱怨原句

```typescript
function validateCard1(card: PainCard): ValidationResult {
  const errors: string[] = [];

  if (!card.complaint.verbatim || card.complaint.verbatim.length < 10) {
    errors.push('原句太短或未填');
  }
  if (!card.complaint.source_name) errors.push('來源人物未填');
  if (!card.complaint.source_relation) errors.push('與來源關係未填');
  if (!card.complaint.datetime) errors.push('時間或情境未填');
  if (!card.complaint.scene) errors.push('當時場景未填');

  // 反模式偵測
  if (card.complaint.source_name?.match(/老師 ?[A-Z]|某人|匿名/)) {
    errors.push('來源是匿名或代號（如「老師 A」），不是真名');
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings: [],
    failure_routes: errors.includes('原句太短或未填')
      ? [{ reason: '原句不夠', target_card: 'stay', suggestion: '回憶你聽到的具體話語' }]
      : [],
  };
}
```

#### 卡 2：三個有名字的人

```typescript
function validateCard2(card: PainCard): ValidationResult {
  const errors: string[] = [];

  if (card.people.list.length !== 3) {
    errors.push(`需要 3 個人，目前 ${card.people.list.length} 個`);
  }

  card.people.list.forEach((p, i) => {
    if (!p.name || p.name.match(/^老師[A-Z]$|^某|^匿名/)) {
      errors.push(`第 ${i + 1} 個人：名字不是真名`);
    }
    if (!p.contact) errors.push(`第 ${i + 1} 個人：聯絡方式未填`);
    if (!p.relation) errors.push(`第 ${i + 1} 個人：關係未填`);
  });

  return {
    passed: errors.length === 0,
    errors,
    warnings: [],
    failure_routes: errors.length > 0
      ? [{
          reason: '還沒接觸真人',
          target_card: 1,
          suggestion: '你還不認識這個圈子。先去這群人聚集的地方混 1-2 週，再回來吧。',
        }]
      : [],
  };
}
```

#### 卡 3-9：依此類推

完整 13 個 validation function 詳見 `references/exit_gates_matrix.md`。

---

## 5. 失敗路由文案

### 5.1 通用文案模板

```typescript
const FAILURE_ROUTE_TEMPLATES: Record<string, FailureRoute> = {
  card_2_no_real_people: {
    reason: '還沒接觸真人',
    target_card: 1,
    suggestion: '你還不認識這個圈子。先去這群人聚集的地方混 1-2 週，再回來吧。',
  },
  card_3_too_abstract: {
    reason: '卡關公式太抽象',
    target_card: 1,
    suggestion: '句子裡的兩個空格還太抽象。退回卡 1，再去找主人翁聊一次。',
  },
  card_4_no_dissatisfaction: {
    reason: '說不出 3 個不滿',
    target_card: 1,
    suggestion: '主人翁說不出 3 個不滿，可能他沒在花時間解這個問題。',
  },
  card_5_multiple_picked: {
    reason: '矛盾沒拆乾淨',
    target_card: 3,
    suggestion: '你選了多個矛盾，代表還沒拆到「兩件事不能同時要」。回卡 3 把卡關公式講清楚。',
  },
  card_6_solution_mode: {
    reason: 'AI 進入 solution mode',
    target_card: 'stay',
    suggestion: 'AI 開始推銷解法了。加一句「不要建議任何解決方案」再跑一次。',
  },
  card_6_too_vague: {
    reason: 'AI 答得太空泛',
    target_card: 'stay',
    suggestion: '補上更多卡片 1-5 的具體細節，再跑一次 prompt。',
  },
  card_7_checkpoints_fail: {
    reason: '4 個檢查點未過',
    target_card: 6,
    suggestion: 'AI 給的不夠具體。退回卡 6 補更多細節再跑一次。',
  },
  card_8_no_contact: {
    reason: '找不到聯絡管道',
    target_card: 2,
    suggestion: '你還沒進入這個社群。先去那個圈子混 1-2 週再回來。',
  },
  card_9_short_reason: {
    reason: '書面理由不足 100 字',
    target_card: 'stay',
    suggestion: '理由還太短。書面交付物需要 ≥ 100 字，包括「為什麼真 / 為什麼假」。',
  },
};
```

### 5.2 文案撰寫原則

#### ✓ 應該

- 中性、解釋性：「你還沒接觸真人」「句子太抽象」
- 提供具體建議：「退回卡 X」「再加一句『不要建議...』」
- 給出「為什麼」：「可能他沒在花時間解這個問題」
- 用「你」稱呼，保持平等對話感

#### ✗ 禁止

- 焦慮話術：「不繼續就失去進度」「再不填就過期」
- FOMO：「24 小時內未完成資料消失」
- 評判：「你做得不夠好」「失敗了」
- 過度激勵：「再加把勁！」「衝衝衝！」
- 比較：「平均使用者 2 分鐘就過了」

---

## 6. 反模式（CRITICAL）

### 6.1 焦慮 / FOMO 禁令

- ❌ 「再不填就失去進度」
- ❌ 「24 小時內未完成資料消失」
- ❌ 「streak 將被打斷」
- ❌ 「跳過此關將扣分」
- ❌ 倒數計時器 / 進度過期警告

### 6.2 評判 / 比較禁令

- ❌ 「未完成扣分」UI（即使內部有 score 也不在 exit gate 顯示）
- ❌ 「你低於平均水準」
- ❌ 「失敗 3 次將鎖定」（沒有失敗次數一說）
- ❌ 「Pain Quality 不夠高，無法繼續」
- ❌ 紅色 ✗ 標示（用 Text Secondary 灰色或 Amber）

### 6.3 強制路徑禁令

- ❌ 強制路由（不給「先存檔離開」選項）
- ❌ 失敗時 modal 攔截（必須點某按鈕才能繼續）
- ❌ 「您必須先完成卡 X 才能查看」這種命令式文案

### 6.4 過度說教禁令

- ❌ 失敗時跳出長篇教學「您應該理解，痛點驗證的本質是...」
- ❌ 連結到外部論文 / 學術資源
- 替代：給 1-2 句具體建議 + 一個動作按鈕（回卡 X / 留下繼續編輯）

---

## 7. 互動行為

### 7.1 即時檢查

- 元件 mount 時執行 `validateExitGate(cardNumber, card)`
- PainCard 變更時（透過 Zustand subscribe）重新執行驗證
- Validation 結果存入元件 state，觸發 UI 更新

### 7.2 next_button 點擊

```typescript
async function handleNextClick(): Promise<void> {
  // 雙重檢查（防止 race condition）
  const result = validateExitGate(cardNumber, card);
  if (!result.passed) return;  // disabled 應該不會觸發，但保險

  // 寫入 PainCard
  await updatePainCard({
    current_step: cardNumber + 1,
    updated_at: new Date().toISOString(),
  });

  // 顯示 Toast（克制版）
  toast.success(`已通過卡 ${cardNumber}，進入卡 ${cardNumber + 1}`, {
    duration: 2000,  // 2 秒消失
  });

  // 路由跳轉
  router.push(`/learn/worksheet/${String(cardNumber + 1).padStart(2, '0')}`);
}
```

### 7.3 retreat_link 點擊

- 「先存檔離開」：路由到 `/learn/worksheet`（入口頁）
- 「回卡 X 補資訊」：路由到對應卡片，預填既有資料（編輯模式）

### 7.4 警告通過時的兩階段確認

`warning` 狀態下，next_button 文案改為「仍要繼續 →」，點擊後：
1. 第一次點擊：顯示確認 dialog「AI 提到了解法建議，仍要繼續嗎？回去重跑可能會更好」
2. 確認後才路由

不使用 `confirm()` native dialog，而是 inline 的 amber 確認區塊（避免破壞 UX）。

---

## 8. 元件 API

```typescript
type ExitGateCheckProps = {
  /** 卡片號 (1-9) */
  cardNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

  /** 當前 PainCard */
  card: PainCard;

  /** 額外的驗證 metadata（如 AI 回覆警告） */
  metadata?: {
    ai_response_warnings?: string[];
    custom_warnings?: string[];
  };

  /** 通過後的路由（預設下一張） */
  onPass?: () => void | Promise<void>;

  /** 「先存檔離開」的目標路由（預設入口頁） */
  retreatTarget?: string;

  /** 卡 9 的特殊文案（最後一張） */
  isLastCard?: boolean;
};
```

### 卡 9 的特殊處理

當 `cardNumber === 9` 時：
- next_button 文案改為「產出我的痛點身份證」
- 通過後路由到 `/learn/worksheet/result`（不是 `/10`）

---

## 9. 文案模板

### 9.1 通過 (ready) 文案

| 元素 | 文案 |
| :--- | :--- |
| gate_title | "✓ 過關檢查通過" |
| next_button | "下一張卡片 →"（卡 9 例外：「產出我的痛點身份證」） |
| retreat_link | "先存檔離開" |

### 9.2 未通過 (locked) 文案

| 元素 | 文案 |
| :--- | :--- |
| gate_title | "過關檢查" |
| failure_hint title | "還缺什麼" |
| failure_hint body | 依卡片 + 失敗原因動態填入 |
| next_button | "下一張卡片 →"（disabled） |
| next_button tooltip | "還缺：{失敗項目列表}" |
| retreat_link | "先存檔離開" 或 "回卡 X 補資訊" |

### 9.3 警告通過 (warning) 文案

| 元素 | 文案 |
| :--- | :--- |
| gate_title | "⚠️ 通過但有疑慮" |
| failure_hint title | "建議" |
| failure_hint body | 依警告類型動態填入 |
| next_button | "仍要繼續 →"（amber 樣式） |
| 第二步確認 | "AI 提到了解法建議，仍要繼續嗎？" |
| retreat_link | "回去重跑" |

---

## 10. 無障礙 (a11y)

### 10.1 ARIA 標記

```html
<section role="region" aria-labelledby="exit-gate-title" aria-live="polite">
  <h2 id="exit-gate-title">過關檢查</h2>

  <ul role="list" aria-label="過關條件清單">
    <li aria-checked="true">
      <span aria-hidden="true">✓</span>
      寫的是原句，不是你的解釋
    </li>
    <li aria-checked="false">
      <span aria-hidden="true">✗</span>
      場景描述太抽象
      <span class="sr-only">未通過</span>
    </li>
  </ul>

  <div role="alert" aria-live="polite">
    <strong>還缺什麼：</strong>
    <p>場景太抽象。試試寫「2026-04-15 21:00...」</p>
  </div>

  <button
    type="button"
    aria-disabled="true"
    aria-describedby="next-button-hint"
  >
    下一張卡片 →
  </button>
  <p id="next-button-hint" class="sr-only">還缺：場景描述。先補完再點下一張。</p>
</section>
```

### 10.2 鍵盤操作

- Tab 進入順序：retreat_link → next_button
- next_button disabled 時仍可被 Tab 聚焦（讓使用者知道有此按鈕，並透過 aria-describedby 朗讀缺什麼）
- Enter 觸發 next_button（僅在 enabled 狀態）

### 10.3 螢幕閱讀器體驗

- 過關狀態變化時 aria-live 朗讀「過關檢查通過」或「還缺：XXX」
- 警告狀態用 `role="alert"` 主動朗讀
- 失敗 hint 文字完整朗讀，不依賴顏色

---

## 11. Acceptance Criteria

- [ ] 三種狀態 (locked / ready / warning) 視覺正確區分
- [ ] checklist 顯示所有過關條件，視覺清楚
- [ ] failure_hint 文案正確依失敗類型動態顯示
- [ ] next_button 在 locked 狀態下 disabled，hover 顯示具體缺什麼
- [ ] next_button 在 warning 狀態下顯示 amber + 二段確認
- [ ] retreat_link 永遠可點，導向入口頁或建議卡片
- [ ] 沒有出現「失敗」「扣分」「過期」等焦慮文案
- [ ] 沒有 streak / 倒數計時器
- [ ] 沒有紅色 ✗（用灰色或 amber）
- [ ] 通過後 PainCard.current_step 正確更新
- [ ] 通過後路由到下一張卡片
- [ ] 卡 9 通過後路由到 `/result`
- [ ] 鍵盤可達所有按鈕
- [ ] aria-live / role="alert" 正確朗讀狀態變化
- [ ] 文案完全符合 brand voice（沒有 FOMO / 比較 / 評判）

---

## 12. 變更紀錄

| 版本 | 日期 | 變更 |
| :--- | :--- | :--- |
| 1.0 | 2026-05-01 | 首版；定義三態、validation 邏輯、失敗路由文案、反模式禁令 |
