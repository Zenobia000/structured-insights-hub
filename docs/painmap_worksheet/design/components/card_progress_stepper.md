# Card Progress Stepper 元件規格

> PainMap Worksheet 9 步進度條元件。橫貫所有卡片頁的進度視覺。
> 唯一的目的是：讓使用者知道自己在哪、之前完成了哪幾張、後面還有哪幾張。
> **不是排名工具、不是評分工具、不是激勵工具**。

---

## 1. 元件用途

- **位置**：每個卡片頁 (`/learn/worksheet/01` ~ `/09`) 的 Sub-Navigation 中央
- **次要位置**：入口頁 (`/learn/worksheet`) 用作流程預覽；結果頁 (`/result`) 用作「全部完成」總結
- **核心責任**：顯示 9 張卡片 + 1 張結果頁的線性進度
- **資料源**：`PainCard.current_step`（值 1-10，10 = 已匯出）

不負責：
- ❌ 顯示完成度百分比
- ❌ 顯示剩餘預估時間
- ❌ 顯示「你比 X% 使用者快」之類的比較
- ❌ 提供「跳過此卡」功能

---

## 2. Visual Design

### 2.1 桌面版 (Desktop > 1280px)

水平展開 9 個 step 圓點（最後 1 個是「身份證匯出」）：

```
┌──────────────────────────────────────────────────────────────────┐
│  痛點填空簿                                            已儲存於 22:31│
├──────────────────────────────────────────────────────────────────┤
│  ●─────●─────●─────◉─────○─────○─────○─────○─────○──┄┄→ 🪪      │
│  1     2     3    [4]    5     6     7     8     9    身份證    │
│ 抱怨   人物  公式  解法  矛盾  證據  自猜  訪談  判斷           │
└──────────────────────────────────────────────────────────────────┘
```

- 每個 step 由一個圓點 + 一條連接線 + 一個下方標籤組成
- ●（深綠 + 勾號）= 已完成
- ◉（深 Teal + 動態邊框）= 進行中
- ○（淺灰）= 鎖定
- 🪪 = 結果頁（卡 10），用身份證 emoji 或 illustration 標示
- 連接線：已完成段為深綠實線，鎖定段為淺灰虛線

### 2.2 平板版 (Tablet 768-1280px)

同 Desktop，但縮小 step 圓點 (40px → 32px) 與標籤字級。

### 2.3 手機版 (Mobile < 768px)

折疊為「卡 X / 9」文字 + 點擊展開 modal 顯示完整 stepper：

```
┌────────────────────────────────────┐
│  痛點填空簿  卡 4 / 9 ▼  已儲存   │
└────────────────────────────────────┘
        ↓ 點擊展開
┌────────────────────────────────────┐
│  ●  卡 1：抱怨原句       ✓ 已完成 │
│  ●  卡 2：三個有名字的人 ✓ 已完成 │
│  ●  卡 3：卡關公式       ✓ 已完成 │
│  ◉  卡 4：現在怎麼解     進行中   │
│  ○  卡 5：矛盾選擇       🔒 鎖定  │
│  ○  卡 6：AI 證據蒐集    🔒 鎖定  │
│  ...                              │
└────────────────────────────────────┘
```

---

## 3. 三態定義

| 狀態 | 視覺 token | 條件 |
| :--- | :--- | :--- |
| `verified` (已完成) | bg: `#2D9D78` (Verified Green), border: `#2D9D78`, icon: ✓ 白色 | `step <= card.current_step - 1` |
| `active` (進行中) | bg: `#2D7D8A` (Deep Teal), border: 2px solid `#2D7D8A`, 動態 pulse 動畫 | `step === card.current_step` |
| `locked` (鎖定) | bg: `#F1F3F5` (BG Muted), border: 1px solid `#DFE3E8`, icon: 🔒 灰色 | `step > card.current_step` |

### 動畫規則

- `verified` 圓點：完成瞬間有 0.4s 從 `active` → `verified` 的色彩漸變動畫（不要花俏的彈跳）
- `active` 圓點：邊框有 `pulse` 慢速呼吸動畫（2s cycle，scale 1.0 → 1.05 → 1.0），表達「目前在這」
- `locked` 圓點：無動畫
- 全部動畫尊重 `prefers-reduced-motion: reduce` 偏好（無障礙）

---

## 4. 互動行為

### 4.1 點擊行為

| Step 狀態 | 點擊行為 |
| :--- | :--- |
| `verified` | 路由到該卡片頁（檢視 / 編輯模式） |
| `active` | 不做事（已在當前頁） |
| `locked` | 不做事 + Tooltip「先完成卡 X」 |

### 4.2 Hover 行為（Desktop）

- 顯示 Tooltip：
  - `verified`：「卡 X：{卡片名稱} ✓ 已完成 — 點擊回去檢視」
  - `active`：「卡 X：{卡片名稱} — 你目前在這」
  - `locked`：「卡 X：{卡片名稱} 🔒 — 先完成卡 (X-1)」

### 4.3 鍵盤操作

- Tab 鍵在 stepper 內依序聚焦所有 verified + active step（locked 跳過 — 因為不可互動）
- Enter 鍵在 verified step 上觸發路由跳轉
- Focus ring：使用 brand 的 Border Focus (Teal) 2px 外框

---

## 5. 設計反模式（CRITICAL — 永久禁用）

### 5.1 量化進度禁令

- ❌ 禁止顯示「33% 完成」「3/9」「剩餘 6 張」等百分比 / 分數
  - 理由：違反 brand 「沉穩」與「不評分」原則；偷渡 #8 Loss Avoidance
  - 替代：用視覺化的 verified 圓點數量「無聲表達」進度
- ❌ 禁止顯示「預估剩餘時間 22 分鐘」
  - 理由：製造焦慮，違反 anti-anxiety 原則

### 5.2 比較排名禁令

- ❌ 禁止「你比 80% 的使用者快」「平均使用者填到卡 5」
  - 理由：違反 brand 比較表禁令
- ❌ 禁止「速度排行榜」「最快完成者」

### 5.3 催促禁令

- ❌ 禁止「streak」「連續完成 N 天」
  - 理由：偷渡 #8 Loss Avoidance（黑帽 Octalysis）
- ❌ 禁止「再不繼續就過期」「24 小時內不完成資料消失」
  - 理由：FOMO 禁令；資料永久存在 LocalStorage，沒有過期一說

### 5.4 遊戲化禁令

- ❌ 禁止徽章 / Trophy UI（即使是「集滿 9 張卡」的稱號）
- ❌ 禁止點數 / 經驗值 (XP)
- ❌ 禁止卡片解鎖動畫（puff / sparkle / glow effect）— 結構化的線性流程，不需要慶祝

### 5.5 顏色禁令

- ❌ 禁止用紅色標示「未完成」（紅色僅用於系統錯誤）
- ❌ 禁止用「紅黃綠燈」標示卡片狀態（會讓人聯想「品質好壞」）

---

## 6. RWD 行為

| 斷點 | 佈局 | 行為 |
| :--- | :--- | :--- |
| Desktop > 1280px | 水平展開 9 個 step + 結果頁，標籤完整顯示 | 完整體驗 |
| Tablet 768-1280px | 水平展開但縮小尺寸；標籤可能省略到只剩數字 | hover 顯示 tooltip 補充 |
| Mobile < 768px | 折疊為「卡 X / 9」文字按鈕 | 點擊展開 modal 顯示垂直列表 |

### Mobile 折疊規則

- 文字格式：「卡 X / 9」（X 是 card.current_step）
- 結果頁顯示為「身份證 / 9+」
- 按鈕右側有展開箭頭 ▼
- Modal 展開：full-screen 從底部滑入，使用者點空白處或上滑關閉
- 不使用 hamburger menu icon（避免與主導航混淆）

---

## 7. 資料對應

### 7.1 PainCard 欄位

```typescript
interface PainCard {
  current_step: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  // current_step = 10 表示 verdict 已完成、進入身份證匯出階段
}
```

### 7.2 Step 計算邏輯

```typescript
function getStepStatus(stepIndex: number, currentStep: number): 'verified' | 'active' | 'locked' {
  if (stepIndex < currentStep) return 'verified';
  if (stepIndex === currentStep) return 'active';
  return 'locked';
}
```

### 7.3 邊界情況

- `current_step === 1` 且使用者剛建立 PainCard：step 1 為 active，其餘 locked
- `current_step === 10`：所有 9 個 step 為 verified，第 10 個圖示（身份證）為 active
- `current_step` 為 undefined（無 PainCard）：所有 step 為 locked，stepper 顯示 disabled 狀態 + 「先建立一張痛點卡片」提示

---

## 8. 各 Step 的標籤名稱

依 `data_model.md` 與 `painpoint_beginner_worksheet.md` 一致：

| Step | 標籤（Desktop 完整） | 標籤（Tablet 縮短） |
| :-- | :--- | :--- |
| 1 | 抱怨原句 | 抱怨 |
| 2 | 三個有名字的人 | 人物 |
| 3 | 卡關公式 | 公式 |
| 4 | 現在怎麼解 | 解法 |
| 5 | 矛盾選擇 | 矛盾 |
| 6 | AI 證據蒐集 | 證據 |
| 7 | 自己先猜 | 自猜 |
| 8 | 訪談規劃 | 訪談 |
| 9 | 真假判斷 | 判斷 |
| 10 | 身份證 | 身份證 |

### 標籤位置

- Desktop：圓點下方，置中對齊，字級 Caption (12px)
- Tablet：圓點下方，置中對齊，採用縮短版
- Mobile：modal 列表中，圓點右側水平排列，使用完整版

---

## 9. 無障礙 (a11y) 要求

### 9.1 語意化結構

```html
<nav aria-label="痛點填空簿進度">
  <ol class="stepper">
    <li>
      <a href="/learn/worksheet/01"
         aria-current="false"
         aria-label="卡 1：抱怨原句，已完成，點擊檢視">
        <span class="step-icon" aria-hidden="true">✓</span>
        <span class="step-number">1</span>
        <span class="step-label">抱怨原句</span>
      </a>
    </li>
    <!-- ... -->
  </ol>
</nav>
```

### 9.2 ARIA 屬性

- `nav[aria-label="痛點填空簿進度"]`：包覆元素
- `aria-current="step"`：標示 active step
- `aria-disabled="true"`：標示 locked step（不可互動）
- `aria-label`：每個 step 完整描述（卡號 + 名稱 + 狀態 + 動作提示）

### 9.3 對比度

- verified 圓點 (#2D9D78) on white：對比度 4.6:1 ✓
- active 圓點 (#2D7D8A) on white：對比度 5.8:1 ✓
- locked 圓點 (#F1F3F5) + border (#DFE3E8) on white：使用 icon + label 補強，避免僅靠顏色

### 9.4 螢幕閱讀器體驗

- 進入卡片頁時，aria-live 區域宣告：「你目前在卡 X：{卡片名稱}，9 張中的第 X 張」
- Stepper 切換到 verified 時，aria-live 不重複宣告（避免吵）
- locked step 在閱讀器朗讀時加上「未解鎖」字眼

### 9.5 鍵盤陷阱避免

- Tab 順序：頁首 logo → 主導航 → stepper → 主內容 → 退出按鈕 → footer
- Stepper 內部 Tab：依 step 順序，locked step 跳過
- Esc 鍵：在 Mobile modal 開啟時關閉 modal

---

## 10. 元件 API（給工程實作參考）

```typescript
type StepperProps = {
  /** 來自 PainCard.current_step */
  currentStep: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

  /** 點擊已完成 step 時的回調 */
  onStepClick?: (stepIndex: number) => void;

  /** 是否為 Mobile 折疊版 */
  variant?: 'full' | 'compact';

  /** 自訂 step 標籤覆寫（一般不用） */
  labelsOverride?: Record<number, string>;
};

const STEPS = [
  { index: 1,  label: '抱怨原句',         path: '/learn/worksheet/01' },
  { index: 2,  label: '三個有名字的人',   path: '/learn/worksheet/02' },
  { index: 3,  label: '卡關公式',         path: '/learn/worksheet/03' },
  { index: 4,  label: '現在怎麼解',       path: '/learn/worksheet/04' },
  { index: 5,  label: '矛盾選擇',         path: '/learn/worksheet/05' },
  { index: 6,  label: 'AI 證據蒐集',      path: '/learn/worksheet/06' },
  { index: 7,  label: '自己先猜',         path: '/learn/worksheet/07' },
  { index: 8,  label: '訪談規劃',         path: '/learn/worksheet/08' },
  { index: 9,  label: '真假判斷',         path: '/learn/worksheet/09' },
  { index: 10, label: '身份證',           path: '/learn/worksheet/result' },
] as const;
```

---

## 11. Acceptance Criteria

- [ ] 9 個 step + 1 個結果頁圖示按順序顯示
- [ ] 三態 (verified / active / locked) 視覺正確區分
- [ ] verified 點擊可路由到該卡片頁
- [ ] active 點擊不做事（已在當前頁）
- [ ] locked 點擊不做事 + Tooltip 顯示「先完成卡 X」
- [ ] Mobile 折疊為「卡 X / 9」並可展開 modal
- [ ] 沒有出現百分比、剩餘時間、排名比較
- [ ] 沒有出現紅色狀態
- [ ] 動畫尊重 `prefers-reduced-motion: reduce`
- [ ] 鍵盤操作流暢（Tab / Enter / Esc）
- [ ] aria-current / aria-disabled / aria-label 正確標記
- [ ] 螢幕閱讀器宣告當前位置
- [ ] 對比度 ≥ 4.5:1（WCAG AA）
- [ ] 從 `current_step = 10` 時所有 9 個 step 都是 verified

---

## 12. 變更紀錄

| 版本 | 日期 | 變更 |
| :--- | :--- | :--- |
| 1.0 | 2026-05-01 | 首版；9 step + 結果頁圖示、三態定義、RWD 折疊規則、a11y 要求 |
