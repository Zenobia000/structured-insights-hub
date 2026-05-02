# 路由規範（Routing Spec）

本文件定義本專案所有對外可達網址的正確格式，以及對「短網址」與其他非正式入口的處理策略。
所有新增 / 修改路由必須遵守本規範，避免再次出現 404 或重複入口。

---

## 1. 路由總覽（Source of Truth）

採用 TanStack Router 檔案式路由，路由檔位於 `src/routes/`，
`src/routeTree.gen.ts` 由 plugin 自動產生，**禁止手動編輯**。

### 1.1 正式對外路由

| URL | 路由檔 | 說明 |
|---|---|---|
| `/` | `src/routes/index.tsx` | Landing / 首頁（同時取代 worksheet landing） |
| `/learn/worksheet` | `src/routes/learn.worksheet.tsx` | Worksheet layout（含 Header + Stepper + `<Outlet />`） |
| `/learn/worksheet/` | `src/routes/learn.worksheet.index.tsx` | **重導向至 `/`**，避免重複內容 |
| `/learn/worksheet/01` ～ `/learn/worksheet/09` | `src/routes/learn.worksheet.0X.tsx` | 9 張痛點卡片（教學模式 / 一般模式共用） |
| `/learn/worksheet/result` | `src/routes/learn.worksheet.result.tsx` | 完成頁（卡 10：PainID Card） |

### 1.2 卡片網址格式（必讀）

> **唯一正確格式：`/learn/worksheet/0X`**（X = 1–9，固定兩位數補零）

- ✅ 正確：`/learn/worksheet/01`、`/learn/worksheet/09`
- ❌ 錯誤：
  - `/01`、`/08`（短網址，**沒有對應路由**）
  - `/learn/worksheet/1`（未補零）
  - `/learn/worksheet/10`（不存在；卡 10 = `/learn/worksheet/result`）
  - `/learn/worksheet/01/`（trailing slash，TanStack 規範禁止）

所有 `<Link to="...">`、`navigate({ to })`、規格文件、文案連結，**必須使用完整路徑**。

---

## 2. 短網址策略

「短網址」指 `/01`、`/02` … `/09` 這類沒有 `/learn/worksheet/` 前綴的路徑。

### 2.1 現行策略：**維持 404（Do Nothing）**

理由：
1. 沒有對外宣傳任何短網址，使用者沒有合理路徑會打到。
2. 多一層 catch-all route 會增加維護面積與型別噪音。
3. TanStack Router 的 `__root.tsx` `notFoundComponent` 已提供乾淨 404 頁面與「回首頁」CTA。

驗收：直接在瀏覽器網址列輸入 `/01` ～ `/09` 應出現 404 頁面（非白屏、非錯誤頁）。

### 2.2 備援策略：Catch Route Redirect（**目前不啟用**）

僅當未來確定要對外推廣短網址時才啟用。實作方式：

```tsx
// src/routes/$step.tsx  ← 不要先建立
import { createFileRoute, redirect, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/$step")({
  beforeLoad: ({ params }) => {
    if (/^0[1-9]$/.test(params.step)) {
      throw redirect({ to: "/learn/worksheet/$step", params: { step: params.step } });
    }
    throw notFound();
  },
  component: () => null,
});
```

啟用條件（必須全部滿足才可加上）：
- [ ] PM / 行銷確認要對外推廣 `painmap.app/0X` 形式
- [ ] 有對應的分析需求（區分短網址導流量）
- [ ] 在本文件 §2.1 改為「已棄用」並補上啟用日期

---

## 3. 命名與檔案約定

- 採 **flat dot-separated** 命名：`learn.worksheet.03.tsx`，**禁止**用資料夾巢狀（`learn/worksheet/03.tsx`）。
- Layout 路由（有 `<Outlet />`）與其同名子路由共存：
  - `learn.worksheet.tsx` → layout
  - `learn.worksheet.03.tsx` → 子頁
  - `learn.worksheet.index.tsx` → `/learn/worksheet/` 的內容（本專案用於 redirect）
- **不得**建立 `src/routes/_app/index.tsx`、`src/pages/`、`app/layout.tsx` 等其他框架慣例。
- 路由檔內 `createFileRoute("/path")` 的字串必須與檔名映射一致；不得使用 trailing slash。

---

## 4. Not-Found / Error 規範

- `__root.tsx` 必須定義 `notFoundComponent`（已實作）。
- `router.tsx` 必須定義 `defaultErrorComponent`（已實作，含 retry / go home）。
- 任何使用 `loader` 的 route 必須同時定義 `errorComponent` 與 `notFoundComponent`。
- 在 `notFoundComponent` 內**不得**使用 `useLoaderData`，請改用 `Route.useParams()` / `useSearch()`。

---

## 5. 變更流程

新增或調整路由時：

1. 在 `src/routes/` 建立 / 改名檔案（依 §3 命名）。
2. 等 plugin 重新產生 `routeTree.gen.ts`（**不要手改**）。
3. 更新本文件 §1.1 / §1.2 的對應表。
4. 全文搜尋舊網址字串（`rg "/learn/worksheet/0"`、`rg "to=\""`），確認所有 `<Link>`、`navigate()`、文件連結都更新。
5. 手動驗證：
   - 直接打開新網址不會 404。
   - 重新整理（F5）仍可正確渲染（SSR）。
   - 短網址 `/0X` 仍維持 404（除非已啟用 §2.2）。
