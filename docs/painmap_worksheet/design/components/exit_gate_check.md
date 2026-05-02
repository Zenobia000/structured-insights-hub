# Reflection Hint Footer 元件規格

> 每張卡片底部的「繼續到下一張」按鈕區塊。
> 責任：以中性反思提示提醒使用者「這一題是否寫到位」，**不評等、不擋路**——只建議。
> 對應 `references/reflection_hints_matrix.md` 的完整反思提示規則。

---

## 1. 元件用途

- **位置**：每個卡片頁 (`/learn/worksheet/01` ~ `/09`) 的底部，採 sticky 定位
- **責任**：
  1. 即時檢查當前 PainCard 對應欄位是否寫到反思檢核標準
  2. 顯示中性反思清單：哪些已寫、哪些還可以再想想
  3. 控制「繼續到下一張」按鈕的視覺強度（推薦 / 一般 / 還可以再想想）——**永遠 enabled**
  4. 寫得還不夠時提供蘇格拉底反思提示（建議性，不是強制）
  5. 記錄通過後寫入 `current_step` 並導向下一張

- **不負責**：
  - ❌ 不負責驗證 AI 回覆品質（那是 AI Prompt Copy Block 的事）
  - ❌ 不負責欄位即時驗證（那是 form 元件本身的事，例如 textarea 的字數計數）
  - ❌ 不負責資料儲存（那是 LocalStorage 自動儲存的事）

---

## 2. 結構

### 2.1 視覺 Layout（三態：pending / thinking / ok）

> 採用蘇格拉底式三態，所有圖示中性（bullet / 思考雲 / 中性勾），不用紅色 ✗ 或綠色 ✓。

#### `pending` 狀態（還可以再想想）

```
┌──────────────────────────────────────────────────────────────┐
│ 想想看                                                        │
│                                                                │
│  • 寫的是原句，不是你的解釋                                   │
│  • 至少有 1 個有名字的真人                                    │
│  ◦ 場景描述還可以更具體                                       │
│                                                                │
│  ┌─ 蘇格拉底提示 ─────────────────────────────────────────┐ │
│  │ 試試寫「2026-04-15 21:00，他在書桌前打開 LINE 寫家長    │ │
│  │ 訊息」這種具體時間 + 地點 + 動作。                       │ │
│  │ 寫不出來也沒關係——可以先繼續，等之後想到再回來。       │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                                │
│  [先存檔離開]                       [繼續到下一張 →]          │
└──────────────────────────────────────────────────────────────┘
```

#### `thinking` 狀態（AI 偵測到值得二想的訊號）

```
┌──────────────────────────────────────────────────────────────┐
│ 想想看                                                        │
│                                                                │
│  • 8 題 prompt 都有 AI 回答                                   │
│  ⊙ AI 提到「建議開發 App」——這像不像 solution mode？        │
│                                                                │
│  ┌─ 蘇格拉底提示 ─────────────────────────────────────────┐ │
│  │ AI 偷渡了解法建議。你可以選擇：                          │ │
│  │ 1. 重跑 prompt 加一句「不要建議任何解決方案」            │ │
│  │ 2. 自己手動忽略 AI 的解法建議部分，繼續下一張           │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                                │
│  [重新跑一次卡 6]                   [繼續到下一張 →]          │
└──────────────────────────────────────────────────────────────┘
```

#### `ok` 狀態（已寫到位）

```
┌──────────────────────────────────────────────────────────────┐
│ 已寫到位                                                      │
│                                                                │
│  • 寫的是原句，不是你的解釋                                   │
│  • 至少有 1 個有名字的真人                                    │
│  • 場景描述具體                                               │
│                                                                │
│  [先存檔離開]                       [繼續到下一張 →]          │
└──────────────────────────────────────────────────────────────┘
```

### 2.2 共用元件 `ReflectionHint`

共用元件位於 `src/components/worksheet/ReflectionHint.tsx`，9 張卡片共用。

```typescript
type ReflectionHintProps = {
  /** 三態之一 */
  kind: 'pending' | 'thinking' | 'ok';
  /** 該反思項目的中性描述 */
  message: string;
};
```

| kind | 圖示 | 顏色 | 語意 |
| :--- | :--- | :--- | :--- |
| `pending` | `◦` (空心 bullet) | Text Secondary | 還可以再想想；不是失敗 |
| `thinking` | `⊙` (中性問號雲) | Amber 但不刺眼 | 偵測到值得二想的訊號 |
| `ok` | `•` (實心 bullet) | Text Primary | 已寫到位；不是綠色勾勾 |

**禁用：** ✗（紅）、✓（綠）、紅色背景方塊、警示三角形。

### 2.3 元件結構

| 區塊 | 元素 | 必/選 |
| :--- | :--- | :--- |
| 標題列 | header_title (動態：「想想看」/「已寫到位」) | 必 |
| Reflection list | reflection_items (每個反思檢核一條，使用 `ReflectionHint`) | 必 |
| 蘇格拉底提示區 | socratic_hint (寫不到位時的具體建議) | 條件顯示 |
| 主按鈕 | next_button (永遠 enabled，視覺強度依狀態) | 必 |
| 退出按鈕 | retreat_link (Secondary, link style) | 必 |

---

## 3. 三種狀態

### 3.1 `pending` — 還可以再想想

| 屬性 | 值 |
| :--- | :--- |
| header_title | "想想看" + 中性圖示 |
| reflection 視覺 | 已寫到位 `•` Text Primary，還可再想 `◦` Text Secondary |
| socratic_hint | 顯示，蘇格拉底式建議「再想想看 X」 |
| next_button | **永遠 enabled**，但採用 secondary 樣式（不是 primary CTA） |
| 觸發條件 | `validateReflection(card)` 回傳 `kind: "hint"` |

> **設計原則：** 沒有 `disabled` 按鈕。蘇格拉底工具不擋路；它只問問題。使用者寫得不夠仍能前進——卡片**建議**回頭，不**強迫**回頭。

### 3.2 `thinking` — 偵測到值得二想的訊號

| 屬性 | 值 |
| :--- | :--- |
| header_title | "想想看" + 中性圖示 |
| reflection 視覺 | 已寫到位 `•`，二想項目 `⊙` |
| socratic_hint | 顯示，建議重跑或繼續 |
| next_button | enabled，採用 amber secondary 樣式 |
| 觸發條件 | 內容有寫但 AI 偵測到反模式訊號（如 solution mode） |

#### 二想場景（依卡片）

- 卡 6：AI 回覆偵測到 solution mode 字串
- 卡 7：「猜 vs AI 差異」textarea 字數少於 30 字
- 卡 9：書面理由字數少於 100 字（接近邊界）

繼續後不阻斷流程，但會在下一張卡片頭部顯示中性提醒「卡 X 有反思提示，要不要回去看看？」

### 3.3 `ok` — 已寫到位

| 屬性 | 值 |
| :--- | :--- |
| header_title | "已寫到位" + 中性圖示（不是綠色勾） |
| reflection 視覺 | 全部 `•` Text Primary |
| socratic_hint | 隱藏 |
| next_button | enabled，Primary 樣式（Amber CTA） |
| 觸發條件 | `validateReflection(card)` 回傳 `kind: "ok"` |

---

## 4. 反思檢核 Validation Logic

### 4.1 通用介面

> 回傳值統一為 `{ kind: "ok" | "hint" | "thinking", message?: string }`，**永不**回傳 `passed: false` 或 `fail`。蘇格拉底工具不評等。

```typescript
type ReflectionResult = {
  /** 三態之一——ok / hint(pending) / thinking */
  kind: 'ok' | 'hint' | 'thinking';
  /** 還可以再想想的具體事項（kind="hint" 或 "thinking" 時填） */
  hints: ReflectionHintItem[];
};

type ReflectionHintItem = {
  /** 還可以再想想的事 */
  reason: string;
  /** 建議回頭看哪張卡（純建議，不強制） */
  suggested_card?: number;
  /** 給使用者的中性蘇格拉底提示 */
  suggestion: string;
};

function validateReflection(
  cardNumber: number,
  card: PainCard,
  metadata?: { ai_response_signals?: string[] }
): ReflectionResult { /* ... */ }
```

### 4.2 各卡片的 Validation 邏輯（摘要）

> 完整邏輯詳見 `references/reflection_hints_matrix.md`。本元件依此邏輯執行檢查。

#### 卡 1：抱怨原句

```typescript
function validateCard1(card: PainCard): ReflectionResult {
  const hints: ReflectionHintItem[] = [];

  if (!card.complaint.verbatim || card.complaint.verbatim.length < 10) {
    hints.push({
      reason: '原句還可以更具體',
      suggestion: '回憶你聽到的具體話語，逐字寫下來。',
    });
  }
  if (!card.complaint.source_name) {
    hints.push({ reason: '來源人物還沒填', suggestion: '寫下這句話是誰說的。' });
  }
  if (!card.complaint.source_relation) {
    hints.push({ reason: '與來源關係還沒填', suggestion: '寫下你和他的關係。' });
  }
  if (!card.complaint.datetime) {
    hints.push({ reason: '時間或情境還沒填', suggestion: '寫下你聽到這句話的時間。' });
  }
  if (!card.complaint.scene) {
    hints.push({ reason: '當時場景還沒填', suggestion: '寫下當時的具體場景。' });
  }

  // 蘇格拉底護欄（保留——這是真實性提示，不是評分）
  if (card.complaint.source_name?.match(/老師 ?[A-Z]|某人|匿名/)) {
    hints.push({
      reason: '來源像是匿名或代號',
      suggestion: '想想看：這幾個字像不像是你自己幫他想的？',
    });
  }

  return {
    kind: hints.length === 0 ? 'ok' : 'hint',
    hints,
  };
}
```

#### 卡 2：三個有名字的人

```typescript
function validateCard2(card: PainCard): ReflectionResult {
  const hints: ReflectionHintItem[] = [];

  if (card.people.list.length !== 3) {
    hints.push({
      reason: `想想看：還需要 ${3 - card.people.list.length} 個有名字的人`,
      suggested_card: 1,
      suggestion: '你能不能今天就傳訊息給其中一個？如果不能，那他算「有名字的人」嗎？',
    });
  }

  card.people.list.forEach((p, i) => {
    if (!p.name || p.name.match(/^老師[A-Z]$|^某|^匿名/)) {
      hints.push({
        reason: `第 ${i + 1} 個人：名字像是代號`,
        suggested_card: 1,
        suggestion: '你還不認識這個圈子。先去這群人聚集的地方混 1-2 週，再回來吧。',
      });
    }
    if (!p.contact) hints.push({ reason: `第 ${i + 1} 個人：聯絡方式還沒填`, suggestion: '寫下你能傳訊息給他的方式。' });
    if (!p.relation) hints.push({ reason: `第 ${i + 1} 個人：關係還沒填`, suggestion: '寫下你和他的關係。' });
  });

  return {
    kind: hints.length === 0 ? 'ok' : 'hint',
    hints,
  };
}
```

#### 卡 3-9：依此類推

完整 9 個 validation function 詳見 `references/reflection_hints_matrix.md`。

---

## 5. 蘇格拉底反思提示文案

### 5.1 通用文案模板

```typescript
const REFLECTION_HINT_TEMPLATES: Record<string, ReflectionHintItem> = {
  card_2_no_real_people: {
    reason: '還沒接觸真人',
    suggested_card: 1,
    suggestion: '你還不認識這個圈子。先去這群人聚集的地方混 1-2 週，再回來吧。',
  },
  card_3_too_abstract: {
    reason: '卡關公式還可以更具體',
    suggested_card: 1,
    suggestion: '句子裡的兩個空格還太抽象。回去把卡 1 想清楚再來——再去找主人翁聊一次。',
  },
  card_4_no_dissatisfaction: {
    reason: '說不出 3 個不滿',
    suggested_card: 1,
    suggestion: '主人翁說不出 3 個不滿，可能他沒在花時間解這個問題。他過去 30 天有沒有真的花時間或錢試圖解？',
  },
  card_5_no_tradeoff: {
    reason: 'side_a / side_b 還沒寫到位',
    suggested_card: 3,
    suggestion: '想想看：他想要 ___，但又同時想要 ___。如果他能放掉其中一邊，他不會卡在這裡——所以他放不下哪邊？',
  },
  card_6_solution_mode: {
    reason: 'AI 進入 solution mode',
    suggestion: 'AI 開始推銷解法了。加一句「不要建議任何解決方案」再跑一次。',
  },
  card_6_too_vague: {
    reason: 'AI 答得還太空泛',
    suggestion: '補上更多卡片 1-5 的具體細節，再跑一次 prompt。',
  },
  card_7_checkpoints_thin: {
    reason: '4 個自問點還沒檢視完',
    suggested_card: 6,
    suggestion: 'AI 給的不夠具體。回去把卡 6 想清楚再來——補更多細節再跑一次。',
  },
  card_8_no_contact: {
    reason: '還沒找到聯絡管道',
    suggested_card: 2,
    suggestion: '你還沒進入這個社群。先去那個圈子混 1-2 週再回來。',
  },
  card_9_short_reason: {
    reason: '書面理由還可以再多寫一點',
    suggestion: '想想看：這 100 字是要說服未來的你。再加一些「為什麼真 / 為什麼假」的證據。',
  },
};
```

### 5.2 文案撰寫原則

#### ✓ 應該

- 中性、解釋性：「你還沒接觸真人」「句子還可以更具體」
- 提供蘇格拉底問句：「他過去 30 天有沒有真的花時間或錢試圖解？」
- 提供溫和回頭路徑：「回去把卡 X 想清楚再來」
- 用「你」稱呼，保持平等對話感

#### ✗ 禁止

- 焦慮話術：「不繼續就失去進度」「再不填就過期」
- FOMO：「24 小時內未完成資料消失」
- 評判：「你做得不夠好」「失敗了」「未通過」「未過關」
- 過度激勵：「再加把勁！」「衝衝衝！」
- 比較：「平均使用者 2 分鐘就過了」
- pass/fail 措辭：「過關」「退回卡 X」「擋住前進」

---

## 6. 反模式（CRITICAL）

### 6.1 焦慮 / FOMO 禁令

- ❌ 「再不填就失去進度」
- ❌ 「24 小時內未完成資料消失」
- ❌ 「streak 將被打斷」
- ❌ 「跳過此關將扣分」
- ❌ 倒數計時器 / 進度過期警告

### 6.2 評判 / 比較禁令

- ❌ 「未完成扣分」UI（系統不存在 score 可扣）
- ❌ 「你低於平均水準」
- ❌ 「失敗 3 次將鎖定」（沒有失敗次數）
- ❌ 任何形式的 0-25 分、5 維度評分、Pain Quality Score
- ❌ 紅色 ✗ 標示（用 Text Secondary 灰色 bullet `◦` 或中性 `⊙`）
- ❌ 綠色 ✓ pass 勾（用中性 bullet `•` 取代）
- ❌ 「過關 / 未過關」措辭

### 6.3 強制路徑禁令

- ❌ 強制路由（不給「先存檔離開」選項）
- ❌ 任何 disabled 主按鈕（next_button 永遠 enabled——蘇格拉底工具不擋路）
- ❌ 反思不到位時 modal 攔截
- ❌ 「您必須先完成卡 X 才能查看」這種命令式文案
- ❌ 「退回卡 X」措辭（改用「回去把卡 X 想清楚再來」）

### 6.4 過度說教禁令

- ❌ 反思不到位時跳出長篇教學「您應該理解，痛點驗證的本質是...」
- ❌ 連結到外部論文 / 學術資源
- 替代：給 1-2 句蘇格拉底問句 + 一個動作按鈕（建議性回頭 / 留下繼續編輯）

---

## 7. 互動行為

### 7.1 即時檢查

- 元件 mount 時執行 `validateReflection(cardNumber, card)`
- PainCard 變更時（透過 Zustand subscribe）重新執行驗證
- Reflection 結果存入元件 state，觸發 UI 更新

### 7.2 next_button 點擊（永遠 enabled）

```typescript
async function handleNextClick(): Promise<void> {
  // next_button 永遠 enabled。不檢查 reflection 結果——使用者寫得不夠仍能前進。
  // 反思提示已經在 UI 上顯示，由使用者自己決定是否要回頭。

  // 寫入 PainCard
  await updatePainCard({
    current_step: cardNumber + 1,
    updated_at: new Date().toISOString(),
  });

  // 顯示 Toast（克制版）
  toast.success(`繼續到卡 ${cardNumber + 1}`, {
    duration: 2000,  // 2 秒消失
  });

  // 路由跳轉
  router.push(`/learn/worksheet/${String(cardNumber + 1).padStart(2, '0')}`);
}
```

### 7.3 retreat_link 點擊

- 「先存檔離開」：路由到 `/learn/worksheet`（入口頁）
- 「回卡 X 想想看」：路由到對應卡片，預填既有資料（編輯模式）；文案中性，不用「補」、「退回」措辭

### 7.4 thinking 狀態的提醒

`thinking` 狀態下不使用 modal 攔截，也不顯示「仍要繼續」確認 dialog。`socratic_hint` 區塊已經把訊息傳達給使用者；使用者決定要不要點 retreat_link 還是 next_button。蘇格拉底工具不打斷使用者；它只放下提示牌。

---

## 8. 元件 API

```typescript
type ReflectionFooterProps = {
  /** 卡片號 (1-9) */
  cardNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

  /** 當前 PainCard */
  card: PainCard;

  /** 額外的驗證 metadata（如 AI 偵測訊號） */
  metadata?: {
    ai_response_signals?: string[];
    custom_signals?: string[];
  };

  /** 點擊 next 後的路由（預設下一張） */
  onAdvance?: () => void | Promise<void>;

  /** 「先存檔離開」的目標路由（預設入口頁） */
  retreatTarget?: string;

  /** 卡 9 的特殊文案（最後一張） */
  isLastCard?: boolean;
};
```

### 卡 9 的特殊處理

當 `cardNumber === 9` 時：
- next_button 文案改為「產出我的痛點身份證」
- 點擊後路由到 `/learn/worksheet/result`（不是 `/10`）

---

## 9. 文案模板

### 9.1 `ok` 狀態文案

| 元素 | 文案 |
| :--- | :--- |
| header_title | "已寫到位" |
| next_button | "繼續到下一張 →"（卡 9 例外：「產出我的痛點身份證」） |
| retreat_link | "先存檔離開" |

### 9.2 `pending` 狀態文案

| 元素 | 文案 |
| :--- | :--- |
| header_title | "想想看" |
| socratic_hint title | "蘇格拉底提示" |
| socratic_hint body | 依卡片 + 反思項目動態填入 |
| next_button | "繼續到下一張 →"（永遠 enabled，secondary 樣式） |
| retreat_link | "先存檔離開" 或 "回去把卡 X 想清楚再來" |

### 9.3 `thinking` 狀態文案

| 元素 | 文案 |
| :--- | :--- |
| header_title | "想想看" |
| socratic_hint title | "蘇格拉底提示" |
| socratic_hint body | 依偵測訊號動態填入 |
| next_button | "繼續到下一張 →"（amber secondary 樣式） |
| retreat_link | "重新跑一次卡 X" |

> **禁用文案：** 「過關」、「通過」、「未通過」、「失敗」、「退回」、「警告」、「擋住」、「仍要繼續」（暗示有阻擋）。

---

## 10. 無障礙 (a11y)

### 10.1 ARIA 標記

```html
<section role="region" aria-labelledby="reflection-title" aria-live="polite">
  <h2 id="reflection-title">想想看</h2>

  <ul role="list" aria-label="反思檢核清單">
    <li>
      <span aria-hidden="true">•</span>
      寫的是原句，不是你的解釋
    </li>
    <li>
      <span aria-hidden="true">◦</span>
      場景描述還可以更具體
      <span class="sr-only">還可以再想想</span>
    </li>
  </ul>

  <div role="status" aria-live="polite">
    <strong>蘇格拉底提示：</strong>
    <p>試試寫「2026-04-15 21:00...」這種具體時間 + 地點 + 動作。</p>
  </div>

  <button type="button">繼續到下一張 →</button>
</section>
```

### 10.2 鍵盤操作

- Tab 進入順序：retreat_link → next_button
- next_button **永遠 enabled**（蘇格拉底工具不擋路）
- Enter 觸發 next_button

### 10.3 螢幕閱讀器體驗

- 狀態變化時 aria-live 朗讀「已寫到位」或「想想看：XXX」
- thinking 狀態用 `role="status"` 主動朗讀（不用 `role="alert"`——這不是錯誤，是反思）
- 反思提示文字完整朗讀，不依賴顏色

---

## 11. Acceptance Criteria

- [ ] 三種狀態 (`pending` / `thinking` / `ok`) 視覺正確區分，使用共用 `ReflectionHint` 元件
- [ ] reflection list 顯示所有反思檢核，視覺中性（無 ✗ 紅、無 ✓ 綠）
- [ ] socratic_hint 文案正確依反思項目動態顯示
- [ ] **next_button 永遠 enabled**——任何狀態下都可前進
- [ ] retreat_link 永遠可點，導向入口頁或建議卡片
- [ ] 沒有出現「失敗」「扣分」「過期」「過關」「未過關」「退回」等措辭
- [ ] 沒有 streak / 倒數計時器
- [ ] 沒有紅色 ✗ 或綠色 ✓（用中性 bullet `•` / `◦` / `⊙`）
- [ ] 沒有任何 0-25 分、5 維度評分、Pain Quality Score 顯示
- [ ] 點擊後 PainCard.current_step 正確更新
- [ ] 路由到下一張卡片
- [ ] 卡 9 點擊後路由到 `/result`
- [ ] 鍵盤可達所有按鈕
- [ ] aria-live / role="status" 正確朗讀狀態變化（不用 role="alert"）
- [ ] 文案完全符合 brand voice（沒有 FOMO / 比較 / 評判 / pass-fail）
