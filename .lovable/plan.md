
# PainMap Worksheet — 骨架建置計畫

建立網站骨架：路由、Layout、4 個共用元件、LocalStorage 持久化、brand tokens。**頁面內容刻意留空 stub**，後續再貼真實表單與邏輯。

## 技術棧調整

原指令是 Next.js 14，但本專案是 **TanStack Start v1（React 19 + Vite + Tailwind v4）**，已徵得同意改用 TanStack Start。所有功能 100% 等價，只是 import 路徑與檔案位置不同。

---

## 一、Brand Tokens（設計系統）

在 `src/styles.css` 註冊 PainMap 的色票、字體、圓角、陰影為 CSS variables + Tailwind utility：

- **顏色**：primary (Deep Indigo #1E3A5F)、secondary (Deep Teal #2D7D8A)、accent (Warm Amber #E8913A)、verified (Green #2D9D78)、caution、page bg、surface、muted bg、text-primary/secondary/muted、border default。每個都對應 Tailwind class（例：`bg-primary`、`text-secondary`）。
- **字體**：在 `__root.tsx` 的 `head()` 加 Google Fonts link 載入 Noto Sans TC、Inter、JetBrains Mono。設定 `font-sans`（Noto + Inter）、`font-mono`（JetBrains Mono）。
- **圓角**：sm 4px / md 8px / lg 12px / xl 16px。
- **陰影**：sm / md / lg 三層，色調帶 Indigo 微染（符合品牌）。
- **頁面底色**：`body` 改用 `bg-page` (#F7F8FA)、`text-text-primary`。

## 二、路由結構

採 TanStack 檔案路由（flat dot-separated 命名）：

```
src/routes/
├── __root.tsx                       ← 加字體、加全域 meta
├── index.tsx                        ← 改為極簡導引頁（取代 placeholder）
├── learn.worksheet.tsx              ← Worksheet Layout（含 Header + Stepper + <Outlet />）
├── learn.worksheet.index.tsx        ← /learn/worksheet 入口頁 stub
├── learn.worksheet.01.tsx           ← 卡 1 stub
├── learn.worksheet.02.tsx           ← 卡 2 stub
├── learn.worksheet.03.tsx           ← 卡 3 stub
├── learn.worksheet.04.tsx           ← 卡 4 stub
├── learn.worksheet.05.tsx           ← 卡 5 stub
├── learn.worksheet.06.tsx           ← 卡 6 stub
├── learn.worksheet.07.tsx           ← 卡 7 stub
├── learn.worksheet.08.tsx           ← 卡 8 stub
├── learn.worksheet.09.tsx           ← 卡 9 stub
└── learn.worksheet.result.tsx       ← 卡 10 結果頁 stub
```

**SEO 規則**：
- `/` 與 `/learn/worksheet` indexable，各自寫 `head()` 標題與描述。
- `/learn/worksheet/01` ~ `/09` 與 `/result` 全部 `noindex`（在 `head()` meta 加 `{ name: "robots", content: "noindex" }`）。

**首頁 `/`**：放極簡導引（產品名 + 一句話 +「開始痛點填空簿」按鈕指向 `/learn/worksheet`），不是 redirect，給 SEO 一個入口。

**Worksheet Layout**：頂部固定 Header（產品名 + 「已儲存於 HH:mm」時間戳）+ 中段 `<CardProgressStepper />` + `<main><Outlet /></main>` + 底部 `<ExitGateCheck />` slot（但 layout 不放，留給各 stub 頁自己擺，因為每張卡的檢查項目不同）。

**Stub 內容深度**：每個卡片 stub 包含 — 頁面標題（卡 N · 名稱）、該卡填寫目標的一段說明、欄位 label 列表（純文字占位、無實際 input）、Exit Gate 殼（顯示該卡 checklist 文字、disabled「下一張」按鈕）。

## 三、四個共用元件

放在 `src/components/worksheet/`，純結構殼 + 視覺，不接真實業務邏輯：

### 1. `CardProgressStepper.tsx`
- 9 個 step + 結果頁身份證 emoji（🪪）。
- 從 zustand store 讀 `current_step`。
- 三種狀態：已完成（深綠 + 勾號）、進行中（Teal + 動態邊框）、鎖定（淺灰）。
- Desktop：水平展開，顯示步驟名稱。
- Mobile：折疊為「卡 X / 9」文字（modal 展開先不做，留 TODO）。
- 已完成步驟可點擊回看，鎖定步驟不可點。

### 2. `ExitGateCheck.tsx`
- Sticky 底部容器。
- Props：`checks: { label: string; passed: boolean }[]`、`hint?: string`、`onAdvance: () => void`。
- 顯示 checklist（✓ / ✗）、「還缺什麼」提示框（Teal 邊框，非紅色）、「先存檔離開」次按鈕、「下一張卡片」主按鈕（Amber，未全通過時 disabled）。
- 不做檢查邏輯本身，純呈現上層傳入的結果。

### 3. `AIPromptCopyBlock.tsx`
- 兩欄殼（Desktop）/ 上下堆疊（Mobile）。
- AI 工具 radio：ChatGPT、Claude、Perplexity、Gemini。
- 左欄：prompt 文字區（接 `prompt: string` props）+「複製到剪貼簿」+「打開 ChatGPT/Claude/...」按鈕。
- 右欄：response textarea（受控元件，接 `value` / `onChange`）。
- Solution mode 偵測 **不做**，留 TODO 註解。
- 提醒文字：「AI 不會幫你設計產品。它只幫你整理、校對、找證據。」

### 4. `VerdictExport.tsx`
- 預覽區：簡單呈現 PainCard 主要欄位的 Markdown 草版。
- 三顆匯出按鈕：MD、JSON、PDF。
- **MD 與 JSON 真的接通**（純前端，blob download，幾行程式）。
- **PDF 留 TODO**（需要外部套件，骨架階段不裝）。
- 底部「下一步去哪」CTA 區：4 張卡片（訪談 / 進階版 / 換題目 / 我再想想），純視覺、不接行動。
- 隱私聲明文字。

## 四、LocalStorage 持久化層

`src/store/painCard.ts`，用 zustand + `persist` middleware：

- 完整 `PainCard` TypeScript schema，**嚴格照 `data_model.md`**：包含 9 張卡片所有欄位（complaint、people、stuck_formula、workaround、tradeoff、evidence、my_guess、interview_plan、verdict）、meta（id、schema_version、status、created_at、updated_at、current_step）。
- Actions：
  - `createCard()` — 初始化新 PainCard（UUID v4）
  - `updateField(path, value)` — dot-path 更新單一欄位
  - `advanceStep(n)` — 前進到第 n 卡，更新 `current_step` 與 `updated_at`
  - `reset()` — 清空
  - `exportSnapshot()` — 回傳當前 PainCard 完整物件
- LocalStorage key：`painmap-worksheet-v1`
- Schema version 標記為 `'1.0'`，預留 `migrate` hook（先空實作）。
- **不**做 exit gate 驗證、**不**接 AI、**不**做雲端同步。

## 五、套件安裝

新增：`zustand`、`uuid` + `@types/uuid`。

---

## 明確不做的事（避免誤會）

- 不實作任何 exit gate 驗證規則（各卡片的「過關條件」邏輯）
- 不實作 AI prompt 模板的變數填值（只用 `{placeholder}` 字串）
- 不實作 PDF 匯出
- 不實作 solution mode 偵測
- 不實作 Mobile stepper 的 modal 展開
- 不接任何後端、不做 Supabase、不做帳號系統
- 不實作各卡片頁的真實表單（input / textarea / AI 互動）
- 不實作從 stub「下一張」按鈕真的能前進（它會永遠 disabled，因為沒有檢查邏輯）

## 完成後你會看到什麼

- 從 `/` 看到極簡導引頁，按鈕進入 `/learn/worksheet`
- 入口頁可預覽 9 步 Stepper 與每張卡的目標
- 點任何卡片連結（先做卡 1 連結 enabled，其餘鎖定）能進到該卡 stub
- 每張卡 stub 顯示：標題、填寫目標、欄位 label 占位、Exit Gate 殼
- 結果頁 stub 可看到 Verdict Export 的視覺結構，MD / JSON 匯出可用（會匯出空殼 PainCard）
- 重新整理瀏覽器，store 內容會從 LocalStorage 還原

## 下一輪可以做什麼

骨架完成後，建議下一輪挑 **1 張卡片**做完整實作（含表單、欄位驗證、Exit Gate 接通），驗證整套架構好不好用，再批次擴展到其他卡片。
