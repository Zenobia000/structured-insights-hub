# PainMap Worksheet — 品質檢核清單 (Quality Checklist)

> **版本**：v1.0 — 2026-05-01
> **適用對象**：PR reviewer、QA、release manager
> **真相源**：`painmap_brand_system.md` L24-30 / L86-100 / L359-374、`anti_gamification_guardrails.md`、`octalysis_white_hat_principles.md`、`product/data_model.md`、`references/pain_card_schema.md`、`references/exit_gates_matrix.md`
> **配套文件**：`implementation_guide.md`、`teaching_vs_production_mode.md`

---

## 0. 為什麼需要這份清單

PainMap Worksheet 同時要做三件互相衝突的事：(1) 訓練判斷力（需要進度感、成就感 → 容易偷渡黑帽）；(2) 嚴禁分數 / 排行榜 / 徽章（brand 鐵律）；(3) 工具教學（內部需要 0-25 score 鏡子，但生產模式禁止輸出）。這個張力導致 reviewer 容易「不小心放行」違規。本 checklist 把禁令、必檢項、灰色地帶判定一次列清楚。

**使用方式**：PR review 時對照逐項勾選；Pre-release 時跑完整清單，CRITICAL = 0、HIGH ≤ 3 才放行。

---

## 1. Brand Compliance Checklist（嚴格禁令掃描）

> 對應條款：`painmap_brand_system.md` L24-30 / L86-100；違反任一項 → CRITICAL，阻擋上線。

### 1.1 視覺禁令

- [ ] **沒有任何分數 UI**：不出現「23/25」「85%」「85 分」（除教學模式 `verdict.total_score` 內部反思鏡子，且必附 disclaimer）
- [ ] **沒有星等元件**：不出現 ⭐⭐⭐⭐⭐、4.5 stars、star animation
- [ ] **沒有等級標示**：不出現「Lv. 1」「青銅級」「黃金等級」「A 級痛點」
- [ ] **沒有徽章圖示**：不出現 badge SVG、achievement icon、award trophy
- [ ] **沒有排行榜**：不出現 leaderboard、Top 10、Best of week
- [ ] **沒有倒數計時器**：不出現 countdown timer、deadline progress、red urgency animation
- [ ] **沒有大面積紅色用於警告**：警告色克制使用
- [ ] **沒有「上次 vs 本週」比較圖**：不出現「比上週進度多 20%」這類比較

### 1.2 用詞紀律（必抓關鍵字）

開 PR diff 後 grep 以下關鍵字，命中即阻擋（除非在「禁令清單」這類引用脈絡）：

```
禁用詞：
  點子、idea（標題與按鈕）、評分、打分、評等、等級、總分、Score 數字
  徽章、Lv.、解鎖（用於遊戲化情境）、Top 10、最高分、KING、CHAMP
  限時、限量、最後 N 個、倒數、機不可失、現在不、再不
  神秘、神級、傳說、抽獎、轉盤、loot、彩蛋、驚喜禮物
  streak、連續 N 天、不間斷、過期、歸零、失效、即將消失
  恭喜、太棒了、你超越了 N% 的人、贏得、擊敗

允許詞：
  問題、痛點、結構化、釐清、驗證、下一步、判斷、訓練、書面
  完成 N / 9 卡片、過關條件、下一張、可中斷、可匯出、我也遇到
```

- [ ] grep 所有 `.tsx` / `.ts` / `.md`，**沒有命中任何禁用詞**
- [ ] 文案使用「問題 / 痛點 / 結構化 / 釐清 / 驗證 / 下一步」
- [ ] AI 輸出以「**可執行下一步**」作結，**不**以「分析結論」作結

### 1.3 互動禁令

- [ ] 沒有強制連續登入要求（N 天不登入無懲罰、無進度歸零）
- [ ] 沒有過期機制（資料永久保留，除非主動刪除）
- [ ] 沒有強制分享解鎖（分享是選項，不是任務）
- [ ] 沒有挽留 modal 過度設計

### 1.4 條款引用速查

| 違規 | 對應條款 |
| :--- | :--- |
| 分數 UI | brand L24 + `data_model.md` PainCardStatus 警示 |
| 徽章 | brand L28 + `octalysis_white_hat_principles.md` §2.4 |
| 倒數 / streak / 抽獎 | `anti_gamification_guardrails.md` §1.1 / §1.3 / §1.2 |
| FOMO 文案 | brand L29 + spec L137 |
| AI 不以下一步作結 | `ai_proxy_spec.md` §3.3 system prompt |

---

## 2. Octalysis Compliance Checklist

> 對應條款：`octalysis_white_hat_principles.md`、`anti_gamification_guardrails.md`
> 違反白帽偷渡 → CRITICAL；白帽用法不到位 → MEDIUM

### 2.1 白帽 #1 Epic Meaning（史詩般的意義）

- [ ] Landing 文案傳達「判斷力訓練」核心訊息（§1.3 文案模板）
- [ ] 沒有自我膨脹話術（如「成為判斷力大師」）
- [ ] 沒有 FOMO 包裝（如「再不練判斷力，你會被 AI 取代」）
- [ ] 痛點身份證封面文案使用「給未來的你看」賦權語氣

### 2.2 白帽 #2 Development & Accomplishment

- [ ] 9 步進度條只顯示「3 / 9 卡片完成」事實，**不顯示百分比 / 倒數**
- [ ] 過關條件用 ✅ checkmark 呈現，**不用分數 / 進度條**
- [ ] 痛點身份證 = 完成憑證，**不出現等級 / 徽章**
- [ ] 完成卡片時用「下一張卡片：___」，**不**用「再 N 張就升級」

### 2.3 白帽 #3 Empowerment of Creativity

- [ ] 卡 7「自己先猜 vs AI」實作時序鎖（先填猜測才解鎖讀 AI）
- [ ] 卡 7 強制 3 個 deltas（最大差異 / AI 補了什麼 / 我猜對哪些 AI 沒支持）
- [ ] 卡 5 矛盾單選（不可複選、不可隨機推薦）
- [ ] 卡 6 自選 AI 工具 + 1 句話寫理由
- [ ] 4 個檢查點由**使用者**勾選，不是 AI 自評
- [ ] 沒有「猜中即可解鎖獎勵」這類偷渡 #6 / #7 的偽白帽

### 2.4 白帽 #5 Social Influence

- [ ] 痛點身份證可分享，但**不顯示貢獻者排名**
- [ ] Pain Atlas 排序只有「最新 / 最多共鳴 / 你可能相關」（**不出現「最熱門 / 最高分」**）
- [ ] 「我也遇到」按鈕表達共鳴，**不用「按讚 / 評分」**
- [ ] 公開分享連結用匿名 ID，**不顯示原作者**
- [ ] 沒有強制分享解鎖

### 2.5 受限 #4 Ownership（僅限資料主權）

- [ ] 提供匯出（Markdown / JSON / PDF）功能
- [ ] 提供刪除功能（無挽留話術）
- [ ] 透明度：明確標示「資料存在你的瀏覽器裡」
- [ ] 沒有偷渡 #4 偽裝（如「集卡牌：填完 9 張卡片解鎖痛點獵人徽章」）
- [ ] 沒有「我的痛點博物館」這類過度浪漫化

### 2.6 黑帽 #6 / #7 / #8 完全沒偷渡

- [ ] **#6 Scarcity 沒偷渡**：grep「限時 / 限量 / 倒數 / 截止 / 機不可失」全無命中
- [ ] **#7 Unpredictability 沒偷渡**：grep「神秘 / 抽 / 隨機獎勵 / 彩蛋」全無命中
- [ ] **#8 Loss Avoidance 沒偷渡**：grep「streak / 連續 / 過期 / 歸零 / 即將消失」全無命中

### 2.7 灰色地帶測試

對照 `anti_gamification_guardrails.md` §3：
- [ ] Progress bar 是 #2 白帽（事實顯示），不是 #6 / #8（時間壓力 / 中斷懲罰）
- [ ] 過關時的視覺反饋是 #3 賦權（checkmark），不是 #7（抽卡動畫）
- [ ] 完成激勵是 #2 完成憑證，不是 #2 偷渡（等級 / 徽章）
- [ ] 社群展示是 #5 白帽（共鳴），不是 #5 偷渡（排名 / 強制分享）
- [ ] 提醒通知是中性引導，不是 #8 喚回焦慮

---

## 3. Schema Compliance Checklist

> 對應條款：`data_model.md`、`references/pain_card_schema.md`
> 欄位不一致 → CRITICAL；驗證規則缺失 → HIGH

### 3.1 PainCard 欄位完整性

- [ ] **Meta**：`id`、`schema_version === '1.0'`、`status`、`created_at`、`updated_at`、`current_step`
- [ ] **Card 1 complaint**：`verbatim`、`source_name`、`source_relation`、`datetime`、`scene`
- [ ] **Card 2 people**：`background` + `list` (length === 3)，每筆 `name` / `contact` / `relation`
- [ ] **Card 3 stuck_formula**：`user_draft`、`ai_polished`、`ai_clarifying_questions`、`confirmed`
- [ ] **Card 4 workaround**：`tool_name`、`why_still_stuck`、`ai_alternatives`、`user_dissatisfactions` (length ≥ 3)
- [ ] **Card 5 contradiction**：`triz_id` (1-6)、`triz_label`、`side_a`、`side_b`、`sacrificed`
- [ ] **Card 6 ai_evidence**：`ai_tool`、`ai_tool_reason`、`raw_response`、`eight_answers` (q1-q8)、`no_solution_check_passed`
- [ ] **Card 7 self_guess**：`guesses` (4 欄)、`ai_checkpoints_passed` (4 個)、`pain_judgment_table`、`deltas` (3 欄)
- [ ] **Card 8 interview_plan**：`targets` (length ≥ 1)、`questions` (length === 3)、`interview_taboos_understood`、`ai_simulated_response`
- [ ] **Card 9 verdict**：`scores` (5 維度)、`total_score`、`judgment`、`reason_100w`、`most_confident_evidence`、`least_confident`、`next_action`
- [ ] **exported**：`exported_at`、`formats[]`、`last_review_at`

### 3.2 Validation Rules R1-R4 全部實作

- [ ] **R1 結構**：欄位型別 / 必填 / length 限制
- [ ] **R1.2 連續性**：未完成卡 N-1 不可填卡 N
- [ ] **R2 內容**：
  - [ ] R2.1 `verbatim` 不可含「我覺得 / 應該需要」
  - [ ] R2.2 `people.list[].name` 不可為「老師 A / 同學 B」代稱
  - [ ] R2.4 `workaround.tool_name` 不可為「沒人解過 / 會自己想辦法」
  - [ ] R2.6 anti-solution mode regex 偵測（`ai_proxy_spec.md` §2.3）
- [ ] **R3 跨欄位一致性**：
  - [ ] 卡 7 `guesses.painful_person` 與卡 2 `people.list` 至少有交集
  - [ ] 卡 8 `targets[].persona` 與卡 7 / 卡 6 描述人群一致
- [ ] **R4 教學規則**：R4.1 教學模式 `total_score` 必附 disclaimer「分數只是鏡子」

### 3.3 教學/生產模式分流

- [ ] LocalStorage 永遠儲存完整 PainCard（含 score）
- [ ] API 預設 `mode=production`，回傳時 `verdict.scores=null`、不含 `total_score`
- [ ] `?mode=teaching` 才回傳完整 score
- [ ] 公開分享連結強制 `mode=production`
- [ ] 匯出 PDF 預設 `include_scores=false`
- [ ] PainMap App handoff 時丟棄 `verdict.scores` / `verdict.total_score`

詳見 `teaching_vs_production_mode.md`。

---

## 4. Functional Checklist

> 對應條款：`references/exit_gates_matrix.md`、PRD §5
> MVP 功能缺漏 → CRITICAL；P1 缺漏 → HIGH

### 4.1 9 個過關條件正確擋過 / 放行

- [ ] **卡 1**：5 欄位非空才放行
- [ ] **卡 2**：`people.list.length === 3` 且每筆完整
- [ ] **卡 3**：`user_draft` 非空 + `confirmed === true`
- [ ] **卡 4**：`tool_name` 非空 + `user_dissatisfactions.length >= 3`
- [ ] **卡 5**：`triz_id` 已選 + `side_a`/`side_b` 非空
- [ ] **卡 6**：8 題答案全非空 + `no_solution_check_passed === true`
- [ ] **卡 7**：4 個猜測 + 4 個 checkpoints + 3 個 deltas
- [ ] **卡 8**：`targets.length >= 1` + `questions.length === 3` + `interview_taboos_understood === true`
- [ ] **卡 9**：5 維度 scores + `judgment` 已選 + `reason_100w.length >= 100` + `next_action` 已選

### 4.2 失敗路由文案賦權不焦慮

對照 `references/exit_gates_matrix.md`：

- [ ] 卡 2 fail → 回卡 1，文案「你還沒接觸真人」
- [ ] 卡 3 fail → 回卡 1，文案「沒問清楚 → 再聽一次」
- [ ] 卡 4 fail → 回卡 1，文案「這個人沒在花時間解 → 換個人問」
- [ ] 卡 5 fail → 回卡 3，文案「拆得不夠細」
- [ ] 卡 6 fail → 補卡 1-5 細節再跑
- [ ] 卡 7 fail → 回卡 6 補資訊
- [ ] 卡 8 fail → 回卡 2，文案「你還沒進入這個社群」
- [ ] **沒有任何失敗訊息含「失敗 / 不及格 / 重新填寫」**等負面詞

### 4.3 LocalStorage 持久化跨 session 正確

- [ ] LocalStorage key === `painmap_worksheet:cards`
- [ ] 含 `current_card_id` / `cards: Record<string, PainCard>` / `schema_version`
- [ ] 寫入有 debounce（≥ 500ms）
- [ ] mount 時讀 `current_card_id` 跳轉到對應卡
- [ ] 容量超過 5MB 提示匯出（不擋使用者繼續用）

### 4.4 匯出三格式正確

- [ ] **Markdown**：痛點身份證模板含 9 卡摘要、生產模式預設不含分數
- [ ] **JSON**：完整 PainCard 物件（含 schema_version）
- [ ] **PDF**：美化版身份證、9 張全完成才可匯出
- [ ] 檔名格式：`paincard-{slug}-{YYYY-MM-DD}.{ext}`
- [ ] 教學模式可選 `include_scores=true`；公開分享強制 `false`

### 4.5 P0 必須有的功能（PRD §5.1）

- [ ] 入口頁 `/learn/worksheet`、9 張卡片頁 `/01`-`/09`、痛點身份證 `/result`
- [ ] PainCard schema 完整實作 + LocalStorage 持久化
- [ ] 過關條件 + 失敗回退
- [ ] 7 段內建 prompt 一鍵複製（卡 3 / 4 / 5 / 6 / 7 第一輪 / 7 第二輪 / 8）
- [ ] 匯出 Markdown + JSON
- [ ] 繁體中文 UI + 共用 PainMap brand system

---

## 5. A11y Checklist（無障礙）

> 對應條款：PRD §10.4 + WCAG AA；違反 → HIGH

**鍵盤可達**：tab 順序合理；Enter / Space 觸發按鈕；Escape 關閉 modal；無 keyboard trap；`focus-visible:ring` 可見。

**ARIA / 螢幕閱讀器**：表單 label 與 input 正確關聯；必填欄位 `aria-required="true"`；錯誤訊息用 `aria-describedby`；進度條 `role="progressbar"` + `aria-valuenow`；圖示 `aria-label`（裝飾用設 `aria-hidden="true"`）；Modal `role="dialog"` + `aria-modal="true"` + 焦點 trap。

**對比度（WCAG AA）**：正文對背景 ≥ 4.5:1；大字（≥ 18px）≥ 3:1；focus state ≥ 3:1；不只用顏色傳達意義（錯誤狀態 + icon + 文字）。

---

## 6. Performance Checklist

> 對應條款：PRD §10.5；違反 → MEDIUM

**Lighthouse / Web Vitals**：Performance ≥ 90（mobile）；FMP < 1.5s、LCP < 2.5s、CLS < 0.1、FID < 100ms、TTI < 3.5s。

**程式碼優化**：LocalStorage 寫入有 debounce（≥ 500ms）；大表單用 `react-hook-form`（uncontrolled）；卡片切換無 loading；LocalStorage 讀寫 < 50ms；圖片用 Next.js `<Image>`；PDF 匯出用 web worker；無 memory leak。

**套件 size 控制**：First-load JS < 200KB（gzip）；不引入 `lodash` 整包（用 `lodash-es` per-method）；不引入 `moment.js`（用 `date-fns` 或原生 `Intl`）；PDF library 動態 import。

---

## 7. Security & Privacy Checklist

> 對應條款：PRD §10.6 + `api_spec.md` §2；違反 → CRITICAL（隱私）/ HIGH（安全）

**隱私先行**：
- [ ] **不可未經同意上傳資料到後端**：MVP 階段所有資料留 LocalStorage
- [ ] 不收集 PII（不要求註冊、email、電話）
- [ ] 不做行為追蹤（MVP 不接 PostHog / GA / Hotjar）
- [ ] error logging 不含使用者填寫內容（只記 stack trace + URL）

**BYOK API key 加密存放（M2+）**：
- [ ] API key 使用對稱加密（KMS managed key）；永不回傳給前端
- [ ] 不出現在 server log（最多前 4 + 後 4 字元）
- [ ] 使用者可隨時「移除 key」→ 立刻硬刪除；HTTPS 強制

**公開分享連結禁止顯示分數**：
- [ ] 公開連結 URL 為匿名 ID（非 user UUID）；強制 `mode=production`
- [ ] 不顯示 `verdict.scores` / `verdict.total_score`
- [ ] 不顯示 `complaint.source_name`、`people.list[].name`、`interview_plan.targets[].contact_info` 等 PII

**一般安全**：CSP / CSRF / XSS 防護；無硬編碼 secret；`pnpm audit` 通過。

---

## 8. Code Quality Checklist

> 對應條款：`implementation_guide.md` §7；違反 → MEDIUM

- [ ] TypeScript strict mode 開啟；無 `any`（必要時用 `unknown` + type guard）
- [ ] zod schema 為 PainCard 唯一型別來源
- [ ] 函式 < 50 行；元件檔 < 200 行；巢狀 ≤ 3 層
- [ ] 過關條件函式為純函式；不可變更新（spread operator）
- [ ] ESLint + Prettier 通過；無 `console.log` 與 commented-out code

---

## 9. PR Template 草案

````markdown
## Background（為什麼）
<!-- 解決什麼問題？關聯哪個 PRD / spec 段落？-->

## Changes（做了什麼）
<!-- 核心決策、取捨。不是 file list。-->

## Impact（影響範圍）
- 影響頁面：
- 破壞性變更：有 / 無
- 需要 migration：有 / 無

## Compliance Self-Review
- [ ] Brand：沒有分數 UI / 星等 / 徽章 / 排行榜 / 倒數 / streak / 過期；文案用「問題 / 痛點 / 結構化」
- [ ] Octalysis：黑帽 #6/#7/#8 沒偷渡（用 anti_gamification_guardrails.md 灰區判定）；白帽 #1-3、#5 用法符合 octalysis_white_hat_principles.md
- [ ] Schema：PainCard 欄位與 data_model.md v1.0 一致；R1-R4 涉及項目已實作；教學/生產模式分流正確
- [ ] Functional：過關條件函式有單元測試；失敗訊息使用 brand voice；LocalStorage 寫入有 debounce；跨 session 復原驗證過

## Test Plan
- [ ] `pnpm test` 通過、`pnpm test:e2e` 通過
- [ ] 手動測試流程：<!-- 列出 -->
- [ ] Lighthouse Performance ≥ 90

## Quality Checklist 自我審查
我已對照 `quality_checklist.md` §1-§8 完成。CRITICAL = 0、HIGH ≤ 3。

🤖 Generated with [Claude Code](https://claude.com/claude-code)
````

---

## 10. 問題分級與通過標準

### 10.1 嚴重度分級

| 等級 | 定義 | 範例 |
| :--- | :--- | :--- |
| **CRITICAL** | 違反 brand 鐵律、schema 不一致、隱私洩漏、過關條件錯誤 | 出現分數 UI、`people.list` 接受 4 筆 |
| **HIGH** | 影響核心使用者旅程、A11y 違規、安全漏洞 | 過關文案焦慮、缺 ARIA、明文存 API key |
| **MEDIUM** | 體驗問題但有 workaround、效能未達標 | Lighthouse 80、debounce 缺失 |
| **LOW** | 細節優化 | typo、style 不一致 |

### 10.2 通過標準

| 結果 | 條件 |
| :--- | :--- |
| **通過** | CRITICAL = 0，HIGH ≤ 3，且通過所有 §1 / §3 / §4 必檢項 |
| **有條件通過** | CRITICAL = 0，HIGH ≤ 5，需排程修正 + 後續 PR 追蹤 |
| **不通過** | 有 CRITICAL，或 HIGH > 5 |

### 10.3 違規處理

PR 違規：標 PR「Needs revision」→ comment 引用對應段落 → 提供白帽替代方案 → 不直接 reject。
已上線發現違規：建 hotfix branch → 移除違規元素（不替換為弱化版黑帽）→ 補白帽設計 → CHANGELOG 記錄。

---

## 11. 自動化偵測（CI 整合）

**brand-lint rule**：建立 `eslint-plugin-painmap-brand` 自訂規則，掃描 `.tsx`/`.ts`/`.md` 中的 FORBIDDEN_PATTERNS（scores: Score 評分 打分；scarcity: 限時 限量 倒數 countdown last-chance；unpredictability: 抽獎 loot-box 神秘 彩蛋；loss_avoidance: streak 連續登入 過期 歸零 即將消失）→ 命中即 CI fail。

**視覺層檢查**：跑 Playwright visual regression（每張卡片截圖比對）；截圖無 countdown timer / loot box / star rating；Push / Email 文案無禁用關鍵字。

**schema 一致性**：`scripts/verify_schema.ts` 解析 `data_model.md` 抽出欄位 → 比對 zod schema → CI fail if mismatch。

---

## 12. 變更紀錄

| 版本 | 日期 | 變更 | 負責人 |
| :--- | :--- | :--- | :--- |
| v1.0 | 2026-05-01 | 首版；對應 brand v1.0、spec v1.0、data_model v1.0 | Sunny |

---

> **最後一句**：這份 checklist 不是「review 時的形式作業」，是「保護產品不被偷渡黑帽 / 不被分數 UI 污染」的最後防線。reviewer 跑完這 8 個 section 是 60 分鐘的工作，跑不完代表 PR 太大、應該拆。
