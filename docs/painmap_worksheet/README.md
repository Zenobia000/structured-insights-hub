# 📋 PainMap Worksheet — 痛點發想填空簿（網頁版）

> **本資料夾是什麼？**
> 將 `docs/workshop/painpoint_beginner_worksheet.md`（線下紙本 9 卡填空簿）轉化為網頁應用的**完整設計規格**。
> 仿照 `docs/web_design/` 文件架構 + 加入 Octalysis 動機設計層。

---

## 🎯 產品定位

**PainMap Worksheet = PainMap 進階版的「初學者教學模式」**

| 階段 | 對應產品 | 對應流程 | 文件位置 |
| :--- | :--- | :--- | :--- |
| **入口** | PainMap Worksheet（本資料夾） | 9 卡 → 真痛點書面判斷 | `docs/painmap_worksheet/` |
| **進階** | PainMap App（既有） | Collector / Decomposer / Atlas | `docs/web_design/pages/painmap/` |
| **商業驗證** | First-Dollar Sprint | 72 小時手作 + 預售 | `docs/product/first_principles_sprint_manual.md` |

## 📐 Iron Laws（鐵律）

1. **共用 PainMap brand system**（不重做設計系統）
2. **不違反 brand 禁令**：分數、星等、排行榜、徽章、FOMO 永久禁用
3. **Octalysis 只取白帽**：#1 Epic Meaning / #2 Accomplishment / #3 Creativity / #5 Social；黑帽 #6/#7/#8 永久封鎖
4. **9 張卡片是同一個資料物件**（PainCard）的 9 個欄位，不是 9 個獨立資料
5. **MVP 範圍**：LocalStorage + 複製 prompt 到外部 ChatGPT；不做雲端帳號、不串站內 LLM API

---

## 📁 文件結構

```
docs/painmap_worksheet/
├── README.md                           ← 你在這裡
│
├── product/                            ← A. 產品策略層
│   ├── PRD.md                         ← 產品需求文件
│   ├── user_journey.md                ← 9 卡使用者流程
│   ├── data_model.md                  ← ★ Pain Card schema（單一真相源）
│   ├── motivation_design.md           ← Octalysis 動機設計總綱
│   └── stage1_to_stage2_handoff.md    ← 與 PainMap 進階版銜接規格
│
├── design/                             ← B. 設計層
│   ├── ia_sitemap.md                  ← 資訊架構
│   ├── octalysis_card_mapping.md      ← 9 卡 × 4 白帽驅動力對照
│   ├── pages/                         ← 11 個頁面規格
│   │   ├── page_template.md           ← 頁面範本
│   │   ├── 00_landing.md              ← 入口頁
│   │   ├── 01_card_complaint.md       ← 卡 1: 抱怨原句
│   │   ├── 02_card_people.md          ← 卡 2: 三個有名字的人
│   │   ├── 03_card_stuck_formula.md   ← 卡 3: 卡關公式
│   │   ├── 04_card_workaround.md      ← 卡 4: 現在怎麼解
│   │   ├── 05_card_contradiction.md   ← 卡 5: 矛盾選擇 (TRIZ)
│   │   ├── 06_card_ai_evidence.md     ← 卡 6: AI 證據蒐集
│   │   ├── 07_card_self_guess.md      ← 卡 7: 自己先猜 + 讀 AI
│   │   ├── 08_card_interview_plan.md  ← 卡 8: 真人訪談規劃
│   │   ├── 09_card_verdict.md         ← 卡 9: 真假判斷
│   │   └── 10_pain_id_export.md       ← 痛點身份證匯出
│   └── components/                    ← 共用元件規格
│       ├── card_progress_stepper.md   ← 9 步進度條
│       ├── ai_prompt_copy_block.md    ← AI prompt 複製區塊
│       ├── exit_gate_check.md         ← 過關條件檢核
│       └── verdict_export.md          ← 身份證匯出元件
│
├── assembly/                           ← C. 組裝層 (給 Lovable / Claude Code)
│   ├── PIPELINE_ORCHESTRATOR.md
│   └── pages/                         ← 11 個整合 prompts
│
├── api/                                ← D. 後端規格
│   ├── api_spec.md                    ← REST API 規格
│   └── ai_proxy_spec.md               ← AI 整合規格（複製 vs 站內）
│
├── references/                         ← E. 參考層
│   ├── pain_card_schema.md            ← Pain Card schema 詳版
│   ├── ai_prompt_library.md           ← 7 段內建 AI prompts
│   ├── exit_gates_matrix.md           ← 9 卡過關條件 + 失敗路由
│   ├── triz_contradictions.md         ← TRIZ 六矛盾配方
│   ├── octalysis_white_hat_principles.md  ← 白帽應用規則
│   └── anti_gamification_guardrails.md ← 黑帽禁令清單
│
├── guides/                             ← F. 指南層
│   ├── implementation_guide.md        ← 實作 SOP
│   ├── quality_checklist.md           ← QA 檢核
│   └── teaching_vs_production_mode.md ← 教學 / 生產模式切換
│
└── tests/                              ← G. 測試層
    ├── e2e_scenarios.md               ← 端對端測試劇本
    ├── ai_prompt_test_cases.md        ← AI prompt 測試
    └── exit_gate_test_cases.md        ← 過關條件測試
```

---

## 🚀 快速上手

### 路徑 A：我要理解整體設計（PM / 設計師）
1. 讀 [`product/PRD.md`](product/PRD.md) — 產品需求總覽
2. 讀 [`product/user_journey.md`](product/user_journey.md) — 9 卡使用者旅程
3. 讀 [`product/motivation_design.md`](product/motivation_design.md) — Octalysis 動機設計
4. 讀 [`design/ia_sitemap.md`](design/ia_sitemap.md) — 資訊架構

### 路徑 B：我要實作這個系統（前端 / 全端工程師）
1. 讀 [`product/data_model.md`](product/data_model.md) — 資料 schema
2. 讀 [`api/api_spec.md`](api/api_spec.md) — API 規格
3. 讀 [`design/pages/`](design/pages/) — 各頁面規格
4. 讀 [`design/components/`](design/components/) — 共用元件
5. 讀 [`guides/implementation_guide.md`](guides/implementation_guide.md) — 實作 SOP

### 路徑 C：我要用 AI 直接生成程式碼（Lovable / Claude Code）
1. 從 [`assembly/pages/`](assembly/pages/) 找對應頁面的整合 prompt
2. 將 prompt 整段貼到 AI 工具
3. 對照 [`guides/quality_checklist.md`](guides/quality_checklist.md) 驗收

### 路徑 D：我要驗證實作品質（QA / 測試工程師）
1. 讀 [`tests/e2e_scenarios.md`](tests/e2e_scenarios.md) — 端對端劇本
2. 讀 [`tests/exit_gate_test_cases.md`](tests/exit_gate_test_cases.md) — 過關條件測試
3. 讀 [`tests/ai_prompt_test_cases.md`](tests/ai_prompt_test_cases.md) — AI prompt 測試

---

## 🔗 相關文件

| 連結 | 說明 |
| :--- | :--- |
| [`docs/workshop/painpoint_beginner_worksheet.md`](../workshop/painpoint_beginner_worksheet.md) | 線下紙本原版（v1.0, 2026-05-01）— 內容真相源 |
| [`docs/web_design/global/painmap_brand_system.md`](../web_design/global/painmap_brand_system.md) | 共用品牌設計系統 |
| [`docs/web_design/pages/painmap/`](../web_design/pages/painmap/) | PainMap 進階版頁面規格（IA 銜接對象） |
| [`docs/product/painmap/painmap_pain_thinking_system.md`](../product/painmap/painmap_pain_thinking_system.md) | 完整理論方法論 |
| [`.claude/skills/sunnydata-pain-thinking/SKILL.md`](../../.claude/skills/sunnydata-pain-thinking/SKILL.md) | 配套 Claude Code skill（v2 階段一） |

---

## 📝 變更紀錄

| 版本 | 日期 | 變更 | 負責人 |
| :--- | :--- | :--- | :--- |
| v1.0 | 2026-05-01 | 首版發布；43 個 spec 文件建立 | Sunny |
