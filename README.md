# Structured Insights Hub

PainMap Worksheet 網頁版 — 9 卡痛點發想填空簿。
TanStack Start (React 19) + Vite + Cloudflare Workers，狀態管理 Zustand，UI 使用 Radix + Tailwind v4。

---

## 啟動 SOP

### 0. 前置需求

| 項目 | 版本 | 說明 |
| :--- | :--- | :--- |
| Node.js | >= 20.x | 本機驗證 v20.20.0 可用 |
| Bun | latest | 主要套件管理器；`bun.lockb` 為權威 lockfile |
| Git | any | 版本控制 |

> Bun 安裝：`curl -fsSL https://bun.sh/install | bash`
> 若無法安裝 Bun，可改用 npm（`package-lock.json` 已保留），但**不可同時混用**兩種包管理器。

### 1. 取得程式碼

```bash
git clone <repo-url> structured-insights-hub
cd structured-insights-hub
```

### 2. 安裝依賴

```bash
# 推薦
bun install

# 替代方案
npm install
```

### 3. 環境變數（可選）

本專案 MVP 使用 LocalStorage，**無需後端與密鑰**。
若未來需要新增 Cloudflare Workers 環境變數，建立 `.dev.vars`（已在 `.gitignore` 中）：

```bash
# .dev.vars 範例
EXAMPLE_KEY=value
```

### 4. 啟動開發伺服器

```bash
bun run dev
# 或 npm run dev
```

Vite dev server 預設在 `http://localhost:8080`（由 `@lovable.dev/vite-tanstack-config` 設定）。
HMR 會自動重載；TanStack Router 會在 `src/routes/` 變動時自動重新生成 `src/routeTree.gen.ts`（**禁止手動編輯**）。

### 5. 驗證啟動結果

合法路由（依 [`docs/routing.md`](docs/routing.md)）：

- `/` — Landing 頁
- `/learn/worksheet/01` ～ `/learn/worksheet/09` — 9 張卡片（**唯一正確格式，固定兩位數補零**）
- `/learn/worksheet/result` — PainID Card 完成頁

驗收用反例（必須維持 404，**不可被 catch-all redirect 偷接走**）：

- `/01` ～ `/09`（短網址，無 `/learn/worksheet/` 前綴）— 依 routing spec §2.1 刻意保持 404
- `/learn/worksheet/1`（未補零）
- `/learn/worksheet/10`（不存在；卡 10 = `/learn/worksheet/result`）

---

## 常用指令

| 指令 | 用途 |
| :--- | :--- |
| `bun run dev` | 啟動開發伺服器（Vite + HMR） |
| `bun run build` | 生產環境建置 |
| `bun run build:dev` | 開發模式建置（保留 source map） |
| `bun run preview` | 預覽生產建置產物 |
| `bun run lint` | ESLint 檢查 |
| `bun run format` | Prettier 自動格式化 |

---

## 部署（Cloudflare Workers）

```bash
# 建置
bun run build

# 預覽
bun run preview

# 部署（需先 wrangler login）
bunx wrangler deploy
```

設定檔：`wrangler.jsonc`
- `name`: `tanstack-start-app`
- `main`: `@tanstack/react-start/server-entry`
- `compatibility_date`: `2025-09-24`
- `compatibility_flags`: `nodejs_compat`

---

## 專案結構

```
.
├── src/
│   ├── routes/          # TanStack Router 檔案式路由（禁止改 routeTree.gen.ts）
│   ├── components/      # UI 元件（Radix + shadcn/ui 風格）
│   ├── hooks/           # React hooks
│   ├── store/           # Zustand store（含 v1→v2 migration）
│   ├── lib/             # 工具函式
│   ├── types/           # TypeScript 型別定義
│   └── styles.css       # Tailwind v4 入口
├── docs/
│   ├── routing.md                # 路由規範（必讀）
│   └── painmap_worksheet/        # 完整產品 / 設計 / 實作規格
├── wrangler.jsonc       # Cloudflare Workers 設定
├── vite.config.ts       # Vite 設定（精簡，邏輯在 lovable preset）
└── package.json
```

---

## 疑難排解

| 症狀 | 可能原因 | 解法 |
| :--- | :--- | :--- |
| `vite.config.ts` 報重複 plugin 錯誤 | 手動加了 lovable preset 已有的 plugin | 移除 `tanstackStart` / `viteReact` / `tailwindcss` 等手動引入 |
| 路由 404 | 卡片網址未補零（如 `/learn/worksheet/1`） | 改為 `/learn/worksheet/01`（固定兩位數） |
| `routeTree.gen.ts` 衝突 | 手動編輯了該檔 | 刪除後重啟 dev server，由 plugin 重新生成 |
| 套件版本衝突 | 同時用了 bun 與 npm | 擇一使用，刪除另一個 lockfile 與 `node_modules` 後重裝 |
| 開發伺服器無法啟動於 8080 | 埠口被占用 | 關閉占用程序，或修改 `vite.config.ts` 設定 |

---

## 開發規範

詳見 `.claude/rules/`：

- `development-workflow.md` — 分支策略、實作流程
- `git-workflow.md` — Commit / PR 規範（Conventional Commits + WHY/WHAT/IMPACT）
- `coding-style.md` — 不可變性、命名、檔案組織
- `testing.md` — TDD 流程與覆蓋率要求
- `security.md` — 安全檢查清單
