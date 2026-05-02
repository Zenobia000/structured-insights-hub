# PainMap Worksheet — 實作指南 (Implementation Guide)

> **適用對象**：前端 / 全端工程師、AI 輔助開發者
> **真相源**：`product/data_model.md`、`api/api_spec.md`、`api/ai_proxy_spec.md`、`design/pages/*.md`、`design/components/*.md`、`assembly/pages/*_integrated.md`
> **配套文件**：`quality_checklist.md`

---

## 0. 為什麼需要這份指南

PainMap Worksheet 的 spec 完整，但 spec 本身**不是實作 SOP**。工程師仍會問：從哪檔案動工？Phase 邊界是什麼？共用元件先做還是頁面先做？11 個頁面實作順序？哪些 MVP 必做、哪些 M2？怎麼用 `assembly/pages/*_integrated.md` 加速？

這份指南是「明天就能用」的工程地圖。

---

## 1. 從 0 到 1：7 步驟實作流程

```
Step 1. 環境設定                ← Phase 0
Step 2. 注入 brand tokens       ← Phase 0
Step 3. 共用元件先做             ← Phase 0
Step 4. MVP 11 頁面骨架          ← Phase 1（先頭尾，後內部）
Step 5. PainCard 持久化          ← Phase 1
Step 6. 反思提示 + 失敗路由      ← Phase 1
Step 7. 匯出三格式 + QA          ← Phase 1
Phase 2 / Phase 3 為後續迭代（M2、M2+）
```

每一步有「進入條件」與「離開條件」，未通過不可進下一步（與 worksheet 9 卡的中性反思哲學一致）。

### Step 1. 環境設定（半天）

**動作**：
1. Node.js 20+（`nvm use 20`）
2. monorepo 內建立 Next.js 14 App Router 專案 `apps/painmap-worksheet/`
3. 安裝核心依賴（見 §2）
4. ESLint + Prettier + TypeScript strict mode
5. Vitest + Playwright（測試框架先架）
6. Husky pre-commit hook（lint + type-check）

**離開條件**：`pnpm dev` 啟動空白 `/learn/worksheet`、`pnpm test` 跑空測試成功。

### Step 2. 注入 brand tokens（半天）

1. 讀 `docs/web_design/global/painmap_brand_system.md`
2. color tokens / typography / spacing / breakpoints 寫進 `tailwind.config.ts`
3. `app/globals.css` 注入 CSS variables
4. `components/ui/` 放共用 primitives（Button / Input / Card）
5. **嚴格禁令掃描**：確認沒有任何分數、星等、徽章、排行榜的 token

**離開條件**：頁面顯示 brand 標準字色、字級、按鈕樣式正確。

### Step 3. 共用元件先做（2-3 天）

**為什麼共用元件先做**：4 個共用元件在 11 個頁面被反覆使用。先做頁面再回頭改元件 → 每次調整都影響多個頁面。

依序實作：
1. `CardProgressStepper.tsx`（顯示「3 / 9」事實，不顯示百分比 / 倒數）
2. `ReflectionHintFooter.tsx`（中性提示 + CTA 啟用判定，必填齊備才解鎖下一步）
3. `AIPromptCopyBlock.tsx`（變數插值 + clipboard + 貼回 textarea + R2.6 regex）
4. `VerdictExport.tsx`（Markdown / JSON / PDF 三格式）

**離開條件**：每個共用元件有獨立預覽 + 單元測試。

### Step 4. MVP 11 頁面骨架（5-7 天）

**頭尾優先順序**：先打通入口（00）→ 真假判斷（09）→ 匯出（10）骨架，再回頭填中間 8 卡。避免做完 9 張卡才發現匯出格式設計錯被迫重做。

| 優先 | 頁面 | 理由 |
| :--- | :--- | :--- |
| 1 | `00_landing` | 定義第一印象與 brand voice |
| 2 | `09_card_verdict` | 終點頁定義整個流程交付物 |
| 3 | `10_pain_id_export` | 匯出頁定義 PainCard 最終格式 |
| 4-7 | `01-04` | 使用者自填卡，無 AI 整合，先打底 |
| 8 | `05_card_contradiction` | 蘇格拉底式取捨自陳 |
| 9-11 | `06-08` | AI 整合卡（複製 prompt 模式），最後做 |

**離開條件**：每頁達到 `design/pages/{NN}_*.md` ACCEPTANCE 全通過。

### Step 5. PainCard 持久化（2-3 天）

1. `lib/paincard/schema.ts` — zod schema（與 `data_model.md` 一致）
2. `lib/paincard/storage.ts` — LocalStorage CRUD（key: `painmap_worksheet:cards`）
3. `lib/paincard/store.ts` — zustand store（debounced auto-save ≥ 500ms）
4. `lib/paincard/schema_version.ts` — schema_version 控制
5. mount 時讀 `current_card_id` 跳轉到對應卡

**離開條件**：填到一半關掉再開回來，內容完整 + 自動跳到上次的卡。

### Step 6. 反思提示 + CTA 啟用判定（2 天）

1. `lib/paincard/cta_rules.ts` — 9 個 CTA 啟用判定函式（純函式）
2. `lib/paincard/validation.ts` — R1-R3 驗證（`references/pain_card_schema.md`）
3. `lib/paincard/failure_routing.ts` — 中性回頭建議（`references/exit_gates_matrix.md` §2）
4. ReflectionHintFooter 接到每張卡 footer
5. 提示文案使用 `api_spec.md` §7 中文 brand voice（中性、不焦慮）

**離開條件**：9 個 CTA 啟用判定正確；提示文案賦權不焦慮，無「過關 / 退回」字眼。

### Step 7. 匯出三格式 + QA 收尾（2 天）

1. `exporters/markdown.ts`、`exporters/json.ts`、`exporters/pdf.tsx`（`@react-pdf/renderer`）
2. 跑 `quality_checklist.md` 全項目
3. Lighthouse 跑分（Performance ≥ 90）
4. Playwright E2E 全綠

**離開條件**：QA 全綠 + Lighthouse ≥ 90 + E2E 全通過。

---

## 2. 推薦技術棧

| 層級 | 技術 | 為什麼 |
| :--- | :--- | :--- |
| Framework | **Next.js 14 App Router** | 與 PainMap App 進階版一致；server-side PDF 方便 |
| Styling | **Tailwind CSS** | 與 brand system 一致；token-based 防漂移 |
| State | **zustand** | 比 Redux 輕；persist 直接寫 LocalStorage |
| Validation | **zod** | TS-first；schema + runtime check 雙用 |
| Forms | **react-hook-form + zod resolver** | controlled forms |
| Persistence | **LocalStorage**（MVP）/ IndexedDB（M2+） | 規格指定 |
| Testing | **Vitest + Testing Library + Playwright** | 三層測試 |
| PDF | **@react-pdf/renderer**（client）/ puppeteer（server） | client-only 為主 |
| Lint | **ESLint + Prettier** + brand-lint rule | brand 禁用詞自動掃描 |
| Package | **pnpm** | monorepo 友善 |

**禁用清單**（避免污染 brand）：
- 禁星等元件庫（`react-rating-stars-component`）
- 禁慶祝動畫（`react-confetti`）
- 禁倒數計時器（`react-countdown`，違反 #6 Scarcity 禁令）
- 禁任何 leaderboard / badge UI library

---

## 3. Repository 結構建議

```
apps/painmap-worksheet/
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   └── learn/worksheet/
│       ├── layout.tsx                   ← 含 progress stepper
│       ├── page.tsx                     ← 00 入口頁
│       ├── 01/page.tsx ... 09/page.tsx  ← 9 卡片
│       └── result/page.tsx              ← 10 痛點身份證
├── components/
│   ├── ui/                              ← brand primitives
│   └── worksheet/
│       ├── CardProgressStepper.tsx
│       ├── ReflectionHintFooter.tsx
│       ├── AIPromptCopyBlock.tsx
│       ├── VerdictExport.tsx
│       ├── PainCardEditor.tsx
│       └── HandoffCard.tsx
├── lib/paincard/
│   ├── schema.ts                        ← zod
│   ├── storage.ts                       ← LocalStorage CRUD
│   ├── store.ts                         ← zustand
│   ├── cta_rules.ts                     ← 9 個 CTA 啟用判定
│   ├── validation.ts                    ← R1-R3
│   ├── failure_routing.ts
│   ├── prompt_library.ts                ← 7 段內建 prompts
│   ├── prompt_interpolator.ts           ← 變數插值
│   ├── solution_mode_detector.ts        ← R2.6 regex
│   ├── exporters/                       ← markdown / json / pdf
│   └── adapters/to_pain_entry.ts        ← 階段一→階段二
└── tests/
    ├── unit/                            ← Vitest
    ├── e2e/                             ← Playwright
    └── fuzz/cta_rules_fuzz.spec.ts
```

**命名**：元件 PascalCase / 工具 camelCase / 型別 `*.types.ts` / 路由全小寫。

---

## 4. Phase 0：環境 + brand tokens + 共用元件

### 4.1 共用元件先做還是頁面先做？決策樹

```
這個元件會被 ≥ 3 個頁面用到嗎？
├─ 是 → 共用元件先做（Phase 0）
└─ 否
    └─ 包含 CTA 啟用判定 / 持久化邏輯嗎？
        ├─ 是 → 共用元件先做
        └─ 否 → 跟頁面一起做
```

**判定**：CardProgressStepper（11 頁都需要）→ 先做；ReflectionHintFooter（9 頁需要）→ 先做；AIPromptCopyBlock（6 頁需要）→ 先做；VerdictExport（只有卡 10 但邏輯重）→ 先做。

### 4.2 brand tokens 注入 checklist

- [ ] color tokens 全映射到 Tailwind（含 `--color-verified`）
- [ ] typography scale（Display / H1 / H2 / Body / Small / Caption）
- [ ] spacing scale（4, 8, 12, 16, 24, 32, 48, 64...）
- [ ] breakpoints（sm / md / lg / xl）
- [ ] 不引入任何 brand 禁令詞彙（star / badge / leaderboard / score-bar / streak）

---

## 5. Phase 1：MVP 11 頁面實作

### 5.1 wave 順序

```
Wave 1 (頭尾骨架):       00 → 09 → 10
Wave 2 (使用者自填卡):   01 → 02 → 03 → 04
Wave 3 (蘇格拉底取捨):   05
Wave 4 (AI 整合卡):       06 → 07 → 08
```

每 wave 結束跑一次端對端測試（00 走到目前已做的最後一頁）。

### 5.2 與 `assembly/pages/*_integrated.md` 的關係

`assembly/pages/{NN}_integrated.md` 是給 Lovable / Claude Code 等 AI 程式生成器的「整合 prompt」，把該頁的 Global brand system（壓縮版）+ Page spec + Component specs 合併成一段 prompt，可直接貼給 AI 生成 React 元件。

**使用情境**：
- 想快速生成原型 → 把 `00_landing_integrated.md` 整段貼給 Claude / Lovable
- AI 生成完後對照 `quality_checklist.md` 驗收
- 修改後保留為 PR 初始 commit

**注意**：不要直接拿 AI 生成版本上 production；AI 可能偷渡 brand 禁令（如自動加星等）→ 用 `quality_checklist.md` brand compliance scan 抓出來；多頁不要一次貼，AI 在 long context 下品質下降。

---

## 6. Phase 2 / Phase 3：後續迭代

### Phase 2：API 串接時機（M2）

`api/api_spec.md` 7 個 P1 端點屬 M2。**MVP 不要做**。

啟動條件：MVP 上線 ≥ 4 週、Verdict Completion Rate ≥ 30%、有清晰雲端同步需求。第一個做：`POST /api/paincards`（離線 → 雲端首次同步）。

### Phase 3：站內 LLM 整合時機（M2+）

`api/ai_proxy_spec.md` 的 `POST /api/ai/run-prompt` 屬 M2+。

啟動條件：≥ 50% 使用者反映「複製貼上 ChatGPT 太麻煩」、預算允許 $5 USD/月/user（或 BYOK）。

**鐵律**：system prompt 強制注入統一版本（`ai_proxy_spec.md` §3.3）；三層 anti-solution + anti-taxonomy 偵測（regex + LLM judge + 使用者回報）；站內 LLM 失效時複製模式必須仍可運作（fallback）。

---

## 7. 程式碼風格約定

### 7.1 型別優先 + 不可變

```typescript
// ✅ zod schema 衍生型別
type PainCard = z.infer<typeof PainCardSchema>;

// ✅ spread 建新物件
const updated = { ...painCard, status: 'structured' };

// ❌ any / 直接 mutate
function updateCard(data: any) { painCard.status = 'structured'; }
```

### 7.2 小檔案 / 函式短小

- 元件檔 < 200 行；超過 → 拆 sub-components
- 函式 < 50 行
- 巢狀 ≤ 3 層（Linus rule）
- CTA 啟用判定函式必須是純函式（pure function）

```typescript
// ✅ 純函式
export function isCardOneCtaEnabled(card: PainCard): CtaResult {
  const c = card.complaint;
  const fields = [c.verbatim, c.source_name, c.source_relation, c.datetime, c.scene];
  return {
    enabled: fields.every(f => f.trim().length > 0),
    missing_fields: fields.map((f, i) => ({ idx: i, empty: f.trim() === '' })),
  };
}
```

### 7.3 錯誤處理

- 所有 user-facing 訊息使用 `api_spec.md` §7 中文 brand voice
- 不使用「失敗 / 錯誤 / 不及格 / 過關 / 退回」這類字眼
- LocalStorage 寫入失敗 fallback 到 in-memory state（不擋使用者）

---

## 8. 測試策略

### 8.1 三層測試

| 層級 | 工具 | 涵蓋範圍 | 覆蓋率 |
| :--- | :--- | :--- | :--- |
| 單元測試 | Vitest | CTA 啟用判定、validation、adapters、interpolator | 90%+ |
| 元件測試 | Testing Library | 共用元件、表單 | 80%+ |
| E2E | Playwright | 9 卡完整走完、復原、匯出 | 主流程 100% |

### 8.2 CTA 啟用判定 fuzz testing

CTA 啟用判定是 worksheet 核心契約，必須對「邊界輸入」做大量測試：

```typescript
import { fc } from 'fast-check';
test('卡 1 CTA 啟用判定 fuzz', () => {
  fc.assert(fc.property(
    fc.record({ verbatim: fc.string(), source_name: fc.string(), /* ... */ }),
    (complaint) => {
      const result = isCardOneCtaEnabled({ complaint } as PainCard);
      const anyEmpty = Object.values(complaint).some(v => v.trim() === '');
      expect(result.enabled).toBe(!anyEmpty);
    }
  ));
});
```

### 8.3 必跑 E2E 劇本

對照 `tests/e2e_scenarios.md`：
1. happy path：完整走完 9 卡 + 匯出 Markdown
2. 中性回頭建議：卡 2 必填未齊備 → CTA disabled，hint 出現「想想看」中性提示
3. 跨 session 復原：填到卡 5 關掉，重開後跳到卡 5
4. AI prompt 複製：clipboard 內容含正確變數插值
5. anti-solution：貼回違規 AI 回應 → 系統警告
6. 真痛點轉場：卡 9 判 true_pain → 卡 10 顯示「匯入 PainMap App」CTA
7. 假痛點封存：卡 9 判 fake_pain → status 變 archived_fake

---

## 9. 部署 Checklist

### 9.1 MVP 上線前

- [ ] `pnpm build` 無錯誤無警告
- [ ] `pnpm test` 全綠（unit + 元件）
- [ ] `pnpm test:e2e` Playwright 全綠
- [ ] Lighthouse Performance ≥ 90、A11y ≥ 95
- [ ] `quality_checklist.md` 全通過
- [ ] brand-lint CI 通過（自動掃描禁用詞）
- [ ] LocalStorage 容量測試（多份 PainCard 不爆 5MB）
- [ ] keyboard-only navigation 可達所有頁
- [ ] zh-Hant 文案校對（無錯字、無禁用詞）

### 9.2 部署環境

- 推薦：Vercel / Cloudflare Pages（Next.js 友善）
- CDN：靜態資產上 CDN
- 監控：MVP 不接 PostHog / GA（隱私先行）

### 9.3 上線後 monitoring

MVP 階段刻意**不接行為追蹤**。需要：
- error logging（Sentry / 自建）— 只記 stack trace + URL，不記使用者填寫內容
- LocalStorage quota 監測（client-side console warning）
- 使用者主動回報的 bug intake

---

## 10. 給維護者的話

### 10.1 修改 spec 時的 SOP

PRD / data_model 變更時：
1. 先改 `data_model.md`（唯一真相源）
2. 升 `schema_version`（破壞性變更時 persist key 一併換名）
3. 更新 `api_spec.md` 對應端點
4. 更新所有 `design/pages/*.md` + `assembly/pages/*_integrated.md`
5. 跑 `quality_checklist.md` 重新驗收

### 10.2 PR review 必檢查

- [ ] 沒有 brand 禁令偷渡（用 `quality_checklist.md` brand compliance）
- [ ] 沒有黑帽 Octalysis（用 `anti_gamification_guardrails.md`）
- [ ] schema 與 `data_model.md` 一致
- [ ] CTA 啟用判定函式有對應單元測試
- [ ] 提示訊息使用 brand voice，無「過關 / 退回」字眼

### 10.3 給未來貢獻者

最大危險是「為了快速上線跳過某個 phase」。請記住：
> **跳過 Phase 0 = brand tokens 不一致 → 11 頁面長得不像同個產品**
> **跳過共用元件 → 9 個地方改一次按鈕樣式，必有遺漏**
> **跳過 fuzz testing → CTA 啟用判定被使用者用奇葩輸入打爆**

嚴格的 SOP 不是束縛，是保護。

---

> **最後一句**：這份指南不是「我們會做的功能清單」，是「用什麼順序、什麼工具、把 spec 變成可執行軟體」的工程地圖。明天打開 IDE 就照 §1 七步驟走，不要繞路。
