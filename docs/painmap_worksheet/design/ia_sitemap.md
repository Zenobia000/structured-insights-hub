# PainMap Worksheet — 資訊架構與站點地圖 (IA & Sitemap)

> 此文件定義 PainMap Worksheet 系統的所有頁面、路由、導航結構與跳轉規則。
> 是後續所有 page spec、assembly、router 設計的唯一真相源。
> 對應 `painmap_worksheet/product/data_model.md` 的 PainCard schema 與 `references/exit_gates_matrix.md` 的反思提示矩陣。

---

## 1. 設計目標

1. **線性主流程，但允許回看** — 9 張卡片是有序流程，使用者可以「完成後回去檢視」，但不能「跳卡」未完成的卡片
2. **永遠知道自己在哪** — 每一步都清楚告訴使用者目前在第幾張卡片、距離終點還有多遠
3. **卡住有方向** — 必填還沒齊備時，回退建議是「友善提示」而非「失敗懲罰」
4. **公開可分享，不誘導註冊** — MVP 全部資料在本地，不做帳號系統；SEO 開放給入口頁與教學頁，卡片頁與結果頁 noindex

---

## 2. 完整 Sitemap（11 個頁面）

```
/learn/worksheet                          ← 入口頁（公開）
├─ /learn/worksheet/01                    ← 卡 1：抱怨原句（你來填）
├─ /learn/worksheet/02                    ← 卡 2：三個有名字的人（你來填）
├─ /learn/worksheet/03                    ← 卡 3：卡關公式（AI 校對）
├─ /learn/worksheet/04                    ← 卡 4：現在怎麼解（AI 提案）
├─ /learn/worksheet/05                    ← 卡 5：兩件事不能同時要（蘇格拉底取捨自陳）
├─ /learn/worksheet/06                    ← 卡 6：AI 證據蒐集
├─ /learn/worksheet/07                    ← 卡 7：自己先猜 + 讀 AI
├─ /learn/worksheet/08                    ← 卡 8：訪談規劃
├─ /learn/worksheet/09                    ← 卡 9：真假判斷（你來判）
└─ /learn/worksheet/result                ← 卡 10：痛點身份證匯出
```

| # | 路由 | 頁面名稱 | page_type | SEO | 必要前置 |
| :- | :--- | :--- | :--- | :-: | :--- |
| 0 | `/learn/worksheet` | 入口頁 | landing | indexable | — |
| 1 | `/learn/worksheet/01` | 抱怨原句 | form_card | noindex | 已建立 PainCard |
| 2 | `/learn/worksheet/02` | 三個有名字的人 | form_card | noindex | 卡 1 完成 |
| 3 | `/learn/worksheet/03` | 卡關公式 | form_card_ai | noindex | 卡 2 完成 |
| 4 | `/learn/worksheet/04` | 現在怎麼解 | form_card_ai | noindex | 卡 3 完成 |
| 5 | `/learn/worksheet/05` | 兩件事不能同時要 | form_card_ai | noindex | 卡 4 完成 |
| 6 | `/learn/worksheet/06` | AI 證據蒐集 | form_card_ai | noindex | 卡 5 完成 |
| 7 | `/learn/worksheet/07` | 自己先猜 + 讀 AI | form_card_ai | noindex | 卡 6 完成 |
| 8 | `/learn/worksheet/08` | 訪談規劃 | form_card_ai | noindex | 卡 7 完成 |
| 9 | `/learn/worksheet/09` | 真假判斷 | form_card | noindex | 卡 8 完成 |
| 10 | `/learn/worksheet/result` | 痛點身份證匯出 | export_view | noindex | 卡 9 完成 |

---

## 3. URL 命名規則

### 3.1 路徑前綴

- 全部位於 `/learn/worksheet/*` 命名空間下
- 與 PainMap 主站 (`/app/*`) 區隔，明示「教學模式」
- 與 `/atlas` (公開圖譜) 平行，皆是公共可訪問的入口

### 3.2 卡片頁路徑

- 採用兩位數字 `01` ~ `09`，不使用 `1` ~ `9`
  - 理由：URL 排序穩定（`/01`, `/02`, ..., `/09`, `/10` 字典序與數字序一致）
  - 視覺一致性：所有路徑長度相同
- 卡 10「痛點身份證」使用語義化 slug `result`，不使用 `/10`
  - 理由：卡 10 不是 PainCard 的新欄位，而是整合輸出，命名上與前 9 張的「填卡」性質區隔

### 3.3 資料識別

- MVP 階段：URL 不帶 PainCard ID（資料在 LocalStorage 由前端管理）
- 未來雲端版本（M2+）保留欄位：`/learn/worksheet/{cardId}/01`
  - 過渡策略：URL 加 query string `?card={id}` 不破壞既有路由

### 3.4 禁止的命名

- 禁用 `/step-1`, `/card-one` 等冗長語義（與 query string 衝突風險）
- 禁用 `/01-complaint`, `/02-people` 等含內容語義的 slug（內容若改名 URL 即崩）
- 禁用 query string 表達卡片進度（`?step=3` 不利分享、不利瀏覽器歷史）

---

## 4. 主要導航結構

### 4.1 全站 Header（共用）

PainMap Worksheet 共用 PainMap 主站的 Top Navigation，但在 Worksheet 命名空間下顯示「教學模式」標記：

```
+------------------------------------------------------------------+
| [PainMap Logo]   首頁   Pain Atlas   定價   [教學模式]   [回主站]|
+------------------------------------------------------------------+
```

| 項目 | 連結 | 顯示條件 |
| :--- | :--- | :--- |
| Logo | `/` | 永遠 |
| 首頁 | `/` | 永遠 |
| Pain Atlas | `/atlas` | 永遠 |
| 定價 | `/#pricing` | 永遠 |
| 教學模式 | `/learn/worksheet` | 在 `/learn/worksheet/*` 路徑時 highlight |
| 回主站 | `/app` | 在 `/learn/worksheet/*` 路徑時顯示，否則隱藏 |

### 4.2 卡片頁 Sub-Navigation（Worksheet 專用）

進入卡片頁後（`/learn/worksheet/01` ~ `/09`、`/result`），Top Nav 下方加入第二層導航條：

```
+------------------------------------------------------------------+
| 痛點填空簿     卡 3 / 9：卡關公式      [儲存中]    [離開填寫]     |
+------------------------------------------------------------------+
```

- 左側：模式標題
- 中央：當前卡片 + 9 卡進度 stepper（詳見 `components/card_progress_stepper.md`）
- 右側：自動儲存狀態（`儲存中` / `已儲存於 XX:XX`）
- 最右：離開填寫按鈕（不確認 dialog，因為 LocalStorage 永久保存）

### 4.3 Footer（共用）

PainMap Worksheet 共用主站 Footer，但加入「離開填寫」與「匯出資料」兩個快捷連結（僅在 `/learn/worksheet/*` 路徑顯示）。

| 區塊 | 連結 |
| :--- | :--- |
| 產品 | Pain Atlas / 教學模式 / 定價 |
| 教學 | 9 步驟總覽 / 詞彙翻譯表 / 完整理論 |
| 法務 | 隱私政策 / 條款 / 資料主權聲明 |
| 聯絡 | 聯絡我們 / GitHub |

### 4.4 Breadcrumb

卡片頁與結果頁顯示 breadcrumb：

```
首頁 > 教學模式 > 卡 3：卡關公式
```

- 入口頁 `/learn/worksheet` 不顯示 breadcrumb（已是頂層）
- 卡片頁 breadcrumb 點擊「教學模式」回到入口頁
- 卡片名稱來自 `card_progress_stepper.md` 的 step label

---

## 5. 與 PainMap App 主站的整合策略

### 5.1 Header 共用，路由分離

- **共用元件**：Logo、主導航、語言切換、登入按鈕（M2+）
- **獨立元件**：Sub-Navigation（卡片進度條）、Footer 快捷連結
- **獨立路由**：`/learn/worksheet/*` 為 Worksheet 命名空間，與 `/app/*`（PainMap 進階版）平行

### 5.2 視覺一致性

- 共用 `painmap_brand_system.md` 全部 design tokens（色彩、字體、元件風格）
- 不另外建立 Worksheet 專屬色票
- 唯一差異：Top Nav 的「教學模式」標記用 Caption 字級的 Teal Badge 標示

### 5.3 跨系統跳轉點

| 來源 | 觸發條件 | 目標 | 文案 |
| :--- | :--- | :--- | :--- |
| `/` (Landing) | 有 CTA「不熟練？先試試 9 卡教學」 | `/learn/worksheet` | "從 9 張小卡片開始" |
| `/learn/worksheet/result` | 卡 9 判斷為 `true_pain` | `/app/start?from=worksheet&pain={id}` | "進入 PainMap 進階版" |
| `/learn/worksheet/result` | 卡 9 判斷為 `fake_pain` | `/learn/worksheet`（重新開始） | "換個題目再試" |
| `/app/*` | 進階版用戶想複習基礎流程 | `/learn/worksheet` | "回到教學模式" |

### 5.4 Header 在 Worksheet 流程中的「沉默」

進入卡片頁時：
- Top Nav 仍可見，但其他連結（首頁、Atlas、定價）以較淡的 Text Secondary 色彩顯示
- 避免使用者在填寫過程中分心點開外部連結
- 不做 modal 攔截（違反「賦權」原則），使用者離開時靜默存檔即可

---

## 6. 9 卡 Stepper 的位置與行為

### 6.1 顯示位置

- **卡片頁 (`/01` ~ `/09`)**：固定位於 Sub-Navigation 中央，永遠可見
- **入口頁 (`/learn/worksheet`)**：顯示為「9 步驟預覽」，作為流程說明的視覺元素
- **結果頁 (`/result`)**：顯示為「全部完成」狀態，所有 step 為 verified 綠色

### 6.2 三種狀態

| 狀態 | 視覺 | 互動 |
| :--- | :--- | :--- |
| 已完成 (verified) | Verified Green 圓點 + 勾號 | 可點擊回去檢視 |
| 進行中 (active) | Deep Teal 圓點 + 動態邊框 | 當前頁面，不可重複點擊 |
| 鎖定 (locked) | Border Default 灰色圓點 | 不可點擊，hover 顯示 tooltip 「先完成卡 X」 |

### 6.3 反模式

- ❌ 禁止顯示「百分比」「3/9 = 33%」等量化進度
- ❌ 禁止顯示「剩餘預估時間」（製造焦慮）
- ❌ 禁止以紅色或警告色標示「未完成」（違反 brand）
- 詳細元件規格見 `components/card_progress_stepper.md`

---

## 7. 跳轉規則 (Routing Logic)

### 7.1 必填齊備後自動導向

每張卡片底部「下一步」按鈕按下後：

| 當前 | 完成後目標 | 必填未齊備時 |
| :--- | :--- | :--- |
| `/01` | `/02` | CTA disabled，顯示「還缺什麼」中性提示 |
| `/02` | `/03` | CTA disabled + tooltip |
| `/03` | `/04` | CTA disabled + tooltip |
| `/04` | `/05` | CTA disabled + tooltip |
| `/05` | `/06` | CTA disabled + tooltip |
| `/06` | `/07` | CTA disabled + tooltip（含 AI 反 solution mode 警告） |
| `/07` | `/08` | CTA disabled + tooltip |
| `/08` | `/09` | CTA disabled + tooltip |
| `/09` | `/result` | CTA disabled + tooltip |
| `/result` | （終點） | — |

### 7.2 卡住時的中性建議路徑

依據 `references/exit_gates_matrix.md`，使用者寫到一半覺得卡住時，系統不強制路由，而是「建議」：

| 卡片 | 觸發情境 | 建議方向 | 文案範例 |
| :--- | :--- | :--- | :--- |
| 卡 2 | 還沒接觸真人 | 回卡 1 | "想想看：你今天傳得到他訊息嗎？先去找一個真人聊聊再回來。" |
| 卡 3 | 句子不夠具體 | 回卡 1 | "句子裡的兩個空格還太抽象，你可能要再去問主人翁一次。" |
| 卡 4 | 不滿意理由不足 | 回卡 1 | "他現在用的方法說不出 3 個不滿，可能他沒在花時間解。" |
| 卡 5 | 兩端拆不出來 | 回卡 3 | "卡關句還沒拆清楚，建議回去把卡 3 想得更具體。" |
| 卡 6 | AI 進入 solution mode | 重跑 prompt | "AI 開始推銷解法了。加一句『不要建議任何解決方案』再跑一次。" |
| 卡 7 | 4 個檢查點未過 | 補卡 6 | "AI 給的不夠具體。回到卡 6 補更多細節再跑一次。" |
| 卡 8 | 找不到聯絡管道 | 回卡 2 | "你還沒進入這個社群。先去那個圈子混 1-2 週再回來。" |

回頭建議按鈕設計原則：
- 用 Secondary 樣式（不是 Primary），表達「建議」而非「強制」
- 永遠保留「我想先存檔離開」的選項
- 不出現「失敗 / 過關 / 退回」字眼，使用「想想看」「還缺什麼」「再加一點」等中性文案

### 7.3 自由跳轉（已完成卡片）

使用者可隨時點擊 stepper 中已完成的 step，回去檢視或修改：

- 路由：`router.push('/learn/worksheet/0X')`
- 進入後：表單自動填入既有資料，可編輯
- 修改後儲存：不會清空後續卡片資料，但會在頁面頂端顯示警告「修改卡 3 可能會讓卡 6 的證據不再對應，建議檢視」
- 修改不重置 PainCard.status，僅更新 `updated_at` 與該欄位

### 7.4 禁止的跳轉

- ❌ 直接點擊未解鎖的 stepper step（按鈕 disabled）
- ❌ 透過 URL 直接打 `/learn/worksheet/05`（卻沒過 1-4）→ 自動導向最後解鎖的卡片
- ❌ 在卡 6 / 卡 7 之間「並行填寫」（嚴格線性，因為 7 依賴 6 的輸出）

---

## 8. Deep Link 處理（直接打卡片頁 URL）

### 8.1 三種情境

| 情境 | URL | 處理 |
| :--- | :--- | :--- |
| 1. 沒有任何 PainCard | `/learn/worksheet/05` | 導向 `/learn/worksheet`（入口頁） + Toast「先從第 1 張卡片開始」 |
| 2. 有 PainCard，但 current_step < 5 | `/learn/worksheet/05` | 導向最後解鎖的卡片（如 `/03`） + Toast「你還在卡 3，先完成它吧」 |
| 3. 有 PainCard，current_step ≥ 5 | `/learn/worksheet/05` | 正常顯示卡 5（已填則為「檢視 / 編輯」模式） |

### 8.2 SSR vs CSR

- 卡片頁採用 CSR（Client-Side Rendering），因為資料在 LocalStorage
- SSR 只渲染外殼（Header + Stepper 骨架 + Loading），實際內容由 Client 取得 LocalStorage 後填入
- 對 SEO 不重要（noindex），對使用者體驗也合適（首次進入會看到「載入中」骨架）

### 8.3 分享連結的隱私

- 卡片頁 URL **不可分享給他人讀取使用者資料**（資料只在本地 LocalStorage）
- 若使用者複製 `/learn/worksheet/05` 連結貼給朋友：朋友打開只會看到自己 LocalStorage 的卡片進度（如果朋友還沒填過 → 自動導入口頁）
- 結果頁 `/result` 同上，不是「公開分享 PainCard」的頁面
- 真正的分享機制：`verdict_export.md` 元件匯出 Markdown / PDF 檔案

---

## 9. 未登入訪客 vs 已登入用戶（MVP 範圍）

### 9.1 MVP（M1）：無登入系統

- 全部頁面為「公開頁面」，但卡片資料只在本地
- 不顯示登入 / 註冊按鈕
- 不顯示「同步到雲端」CTA
- Header 右側無使用者頭像，僅顯示「教學模式」標記

### 9.2 後期（M2+）：可選登入

未來加入帳號系統時的差異：

| 區域 | 未登入 | 已登入 |
| :--- | :--- | :--- |
| 資料儲存 | LocalStorage | LocalStorage + 雲端同步 |
| 卡片進度 | 單裝置 | 跨裝置 |
| Pain Atlas 貢獻 | 唯讀 | 可匿名貢獻已驗證痛點 |
| 匯出歷史 | 無 | 可查看歷史匯出記錄 |
| AI proxy | 複製到外部 | 可選站內 LLM API（feature flag） |

M1 文件不細談 M2，但 IA 設計時保留擴充空間：
- Header 右上角預留「使用者區」位置（M1 為空）
- LocalStorage schema 已含 UUID，未來可一鍵 migrate 上雲

---

## 10. SEO 策略

### 10.1 Indexable 頁面（公開）

| 路徑 | meta description | OG Image |
| :--- | :--- | :--- |
| `/learn/worksheet` | "9 張卡片，30 分鐘，判斷你聽到的抱怨是真痛點還是假痛點。給不懂 AI、想找到值得做的事的初學者。" | 9 卡片視覺概覽 |

入口頁是唯一可索引頁面。理由：
- 卡片頁與結果頁顯示使用者本地資料，沒有公開可索引內容
- 結果頁是個人 PainCard，與 SEO 無關

### 10.2 Noindex 頁面

```html
<meta name="robots" content="noindex, nofollow">
```

| 路徑 | 理由 |
| :--- | :--- |
| `/learn/worksheet/01` ~ `/09` | 顯示本地資料的工作介面，無公開內容 |
| `/learn/worksheet/result` | 個人輸出頁，不應被搜尋引擎索引 |

### 10.3 結構化資料

入口頁 `/learn/worksheet` 加入 `LearningResource` schema.org 結構化資料：

```json
{
  "@context": "https://schema.org",
  "@type": "LearningResource",
  "name": "PainMap 痛點填空簿",
  "description": "9 張卡片教你判斷真痛點與假痛點",
  "educationalLevel": "Beginner",
  "learningResourceType": "Worksheet",
  "timeRequired": "PT30M"
}
```

### 10.4 Sitemap.xml

主站 sitemap 僅包含：
- `/learn/worksheet`（priority: 0.8, changefreq: monthly）

不包含個別卡片頁。

---

## 11. 路由表（給工程實作參考）

```typescript
// React Router v6 / Next.js App Router 對應

const routes = [
  { path: '/learn/worksheet',          page: 'LandingPage',    indexable: true  },
  { path: '/learn/worksheet/01',       page: 'CardComplaint',  indexable: false },
  { path: '/learn/worksheet/02',       page: 'CardPeople',     indexable: false },
  { path: '/learn/worksheet/03',       page: 'CardStuckFormula', indexable: false },
  { path: '/learn/worksheet/04',       page: 'CardWorkaround', indexable: false },
  { path: '/learn/worksheet/05',       page: 'CardContradiction', indexable: false },
  { path: '/learn/worksheet/06',       page: 'CardAIEvidence', indexable: false },
  { path: '/learn/worksheet/07',       page: 'CardSelfGuess',  indexable: false },
  { path: '/learn/worksheet/08',       page: 'CardInterviewPlan', indexable: false },
  { path: '/learn/worksheet/09',       page: 'CardVerdict',    indexable: false },
  { path: '/learn/worksheet/result',   page: 'PainIDExport',   indexable: false },
];
```

每個 page component 需呼叫 guard hook：

```typescript
useWorksheetGuard({
  requiredStep: 5,
  fallback: '/learn/worksheet',  // 沒有 PainCard 時回入口頁
  fallbackToLastUnlocked: true,  // 有 PainCard 但尚未解鎖此 step 時回最後解鎖
});
```

---

