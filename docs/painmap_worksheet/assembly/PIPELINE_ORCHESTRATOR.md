# PainMap Worksheet — Assembly Prompt Template (Pipeline Orchestrator)

> 將 PainMap Brand System + Worksheet Page Spec 組裝為可直接餵給 Lovable / Claude Code 的完整 Prompt。
> 對應 `docs/superpowers/specs/2026-05-01-painmap-worksheet-design.md` → M1 設計文件交付。
> 仿照 `docs/web_design/assembly/PIPELINE_ORCHESTRATOR.md`，針對 Worksheet 的「9 卡片 + 蘇格拉底式取捨 + 反 solution mode」特性加上額外區塊。

---

## 使用說明

### 從頁面規格 → 整合 prompt 的 3 步流程

1. **挑壓縮版品牌系統**：從 `docs/web_design/global/painmap_brand_system.md` 只擷取**當前頁面用得到**的 Tokens（色彩、字級、元件樣式）。整份 brand system 約 380 行，Worksheet 單頁通常只需要 80-120 行的子集。
2. **貼入頁面規格**：從 `docs/painmap_worksheet/design/pages/{NN_card_name}.md` 複製 PAGE META + SECTIONS + INTERACTION + RWD + DATA & API + EXIT GATE + AI INTEGRATION + OCTALYSIS HOOKS 八個區塊。
3. **填例外規則**：填入該頁面允許的例外（如「卡 1-2 完全禁用 AI，本頁不得呼叫任何 AI 端點」）。若無例外，明確寫「無特殊例外」。

### 將 11 個頁面 spec 變成 11 個整合 prompts

對應目錄：`docs/painmap_worksheet/assembly/pages/`

| 順序 | 來源 spec | 產出 integrated prompt |
| :-- | :--- | :--- |
| 0 | `design/pages/00_landing.md` | `assembly/pages/00_landing_integrated.md` |
| 1 | `design/pages/01_card_complaint.md` | `assembly/pages/01_card_complaint_integrated.md` |
| 2 | `design/pages/02_card_people.md` | `assembly/pages/02_card_people_integrated.md` |
| 3 | `design/pages/03_card_stuck_formula.md` | `assembly/pages/03_card_stuck_formula_integrated.md` |
| 4 | `design/pages/04_card_workaround.md` | `assembly/pages/04_card_workaround_integrated.md` |
| 5 | `design/pages/05_card_contradiction.md` | `assembly/pages/05_card_contradiction_integrated.md` |
| 6 | `design/pages/06_card_ai_evidence.md` | `assembly/pages/06_card_ai_evidence_integrated.md` |
| 7 | `design/pages/07_card_self_guess.md` | `assembly/pages/07_card_self_guess_integrated.md` |
| 8 | `design/pages/08_card_interview_plan.md` | `assembly/pages/08_card_interview_plan_integrated.md` |
| 9 | `design/pages/09_card_verdict.md` | `assembly/pages/09_card_verdict_integrated.md` |
| 10 | `design/pages/10_pain_id_export.md` | `assembly/pages/10_pain_id_export_integrated.md` |

### Token 節省技巧

| 技巧 | 節省幅度 |
| :--- | :--- |
| Brand system 只取當前頁用到的 color tokens（通常 8-10 個 token，不要整份 22 個） | -40% |
| 排版只引用當前頁實際出現的字級（多數頁面只用 H1 / H2 / Body MD / Caption 4 級） | -30% |
| Anti-pattern registry 不重複，改為「請參考 brand system 第 359-373 行」一行帶過 | -50% |
| AI prompt 完整內文放在 `references/ai_prompt_library.md`，本 prompt 只 reference prompt_id | -60% |
| 範例資料只貼 1 個（範例林老師），不貼 3 個 | -65% |

實測：完整 brand system 約 12k tokens，壓縮後單頁整合 prompt 約 4-6k tokens。

---

## === GLOBAL PROJECT GUIDELINE (DO NOT OVERRIDE) ===

你是「PainMap 題眼 — Worksheet 教學模式」的資深產品設計師與前端工程師，負責維護整個專案的設計一致性與動機設計倫理。

### 品牌特質

**結構化 (Structured)** / **賦權感 (Empowering)** / **沉穩 (Calm)** / **蘇格拉底式 (Socratic)**

### Color Tokens（壓縮版，當前頁面常用子集）

| Token | 色值 | Tailwind Class | 用途 |
| :--- | :--- | :--- | :--- |
| Primary | #1E3A5F | `bg-[#1E3A5F]` | 結構與深度 |
| Secondary | #2D7D8A | `bg-[#2D7D8A]` | 引導、連結 |
| Accent (CTA) | #E8913A | `bg-[#E8913A]` | 行動按鈕 |
| Verified | #2D9D78 | `bg-[#2D9D78]` | 已通過 exit gate |
| Caution | #D97706 | `bg-[#D97706]` | 需要補充資訊 |
| BG Page | #F7F8FA | `bg-[#F7F8FA]` | 頁面底色 |
| Text Primary | #1A2332 | `text-[#1A2332]` | 主要文字 |
| Text Secondary | #5C6B7A | `text-[#5C6B7A]` | 說明文字 |

### Typography（壓縮版）

| Token | 字級 | 行高 | 字重 |
| :--- | :--- | :--- | :--- |
| H1 | 28px | 1.3 | 700 |
| H2 | 22px | 1.3 | 600 |
| Body LG | 17px | 1.7 | 400 |
| Body MD | 15px | 1.6 | 400 |
| Caption | 12px | 1.4 | 400 |

字體：`Noto Sans TC`（中文）+ `Inter`（英文）。

### 元件風格

- Radius：MD 8px（按鈕/輸入框） / LG 12px（卡片）
- Shadow：SM `0 1px 3px rgba(30,58,95,0.06)` 預設；MD `0 4px 8px rgba(30,58,95,0.08)` hover
- Border：`1px solid #DFE3E8` 預設 / `2px solid #2D7D8A` focus

### 技術棧

React 18 + TypeScript + Tailwind CSS + Zustand（本地狀態） + React Hook Form + Zod。LocalStorage 為 MVP 唯一持久層（key: `painmap_worksheet:cards`）。

### 絕對禁令（PainMap Brand）

- 禁止：分數 (0-25 / 0-100)、星等、A-F 等級、成功率預測、排行榜、遊戲化徽章、倒數計時、過期警告
- 禁用詞：「點子 / idea / 評分 / 打分 / 成功率 / 可行性分析 / 革命性 / 極致體驗」

### 絕對禁令（Octalysis 黑帽）

- 禁止 #6 Scarcity & Impatience：不可有「限時優惠」「最後 X 個名額」
- 禁止 #7 Unpredictability：不可有抽卡 / loot box / 神秘獎勵
- 禁止 #8 Loss Avoidance：不可有 streak（連續打卡）、過期警告、進度倒退恐嚇

### 蘇格拉底式特殊鐵律

1. **反 solution mode**：卡 3-8 任何 AI 互動，後端與前端皆須注入 guard prompt「不可建議解決方案、不可推薦工具、只做痛點探索」
2. **書面優先於 UI 體驗**：使用者必須產出可帶離本網站的書面 PainCard，UI 美化不得以削弱書面結構為代價
3. **反思問題透明，不擋人**：每張卡片的反思問題須在頁面顯示給使用者看；卡片只**建議**回頭重想，不擋你前進
4. **回頭重想路徑中性**：回頭重想時的訊息使用「想想看 / 回去把卡 X 想清楚再來」中性語氣，不出現「失敗」「不及格」「過關」「退回」字眼
5. **零分數**：worksheet 系統內**永遠不出現**任何「N / 25」「N / 100」「N 星」型分數 UI（schema 內無 score 欄位）
6. **零分類學**：AI 任何時候不可給編號 / 等級 / 分類學標籤（TRIZ、設計模式、商業書名詞）
7. **卡 9 AI 永久禁用**：判斷層所有欄位（judgment / reason_100w / most_confident_evidence / least_confident / next_action）一律由使用者親自寫，即使 M2+ 站內 LLM 上線也不開放

---

## === CURRENT TASK: BUILD ONE WORKSHEET PAGE ===

本次任務：根據上方 Global Guideline，設計並實作「{頁面名稱}」。

### [PAGE META]

- **page_name**: `{頁面名稱}`
- **route_path**: `/learn/worksheet/{NN}`
- **card_step**: `{1-9 或 0=landing / 10=result}`
- **page_type**: `card_input | landing | result_export`
- **primary_goal**: `{該頁面的主要任務}`
- **secondary_goal**: `{選填，引導下一步}`
- **target_users**:
  - 主要：不懂 AI 的初學者，剛接觸「找痛點」的概念
  - 次要：教練 / 老師（會把 worksheet 帶給學生用）
- **expected_time_on_page**: `{該卡片預計花費分鐘數}`
- **prerequisite_cards**: `{進入本卡片前必須通過的卡片，如 [1, 2, 3]}`

---

### [STRUCTURE: SECTIONS]

由上至下列出 sections（範例見下方「模板填入後的範例」）。每個 section 須包含：

- 用途（一句話）
- 元件清單（必填欄位、選填欄位、互動元件）
- 狀態（default / hover / focus / loading / error / empty / disabled）

---

### [INTERACTION]

- 必填欄位的即時驗證規則（前端 Zod schema）
- AI 提示複製/貼回流程（如有）
- 過關按鈕的 enable / disable 條件
- 鍵盤操作（Tab 順序 / Enter 提交 / Escape 取消）
- 可訪問性（ARIA labels、focus visible、screen reader 友善）

---

### [RWD]

- Desktop（> 1280px）：通常為左右欄佈局（左：題目說明 / 右：填寫表單）
- Tablet（768-1280px）：上下堆疊但保持 2 欄
- Mobile（< 768px）：單欄垂直堆疊，sticky bottom 行動列固定底部

---

### [DATA & API]

- 對應 PainCard 的欄位（refer `product/data_model.md`）
- LocalStorage 讀寫（key: `painmap_worksheet:cards`）
- M2 雲端同步端點（refer `api/api_spec.md` — 標 M2 P1）
- AI 整合端點（如有，refer `api/ai_proxy_spec.md`）
- 錯誤處理：請使用 brand voice「先說發生什麼，再說怎麼修」

---

### [REFLECTION HINTS]

依 `references/exit_gates_matrix.md` 嚴格執行：

- 反思問題（中性提示，不擋人）
- 必填欄位狀態（CTA disable 直到資料齊備，這不算「擋」，是「資料還沒齊」）
- 真實性護欄觸發時的中性 hint 文案（不可用「失敗」「錯誤」「不及格」「過關」「退回」字眼）
- 回頭重想路徑（refer matrix §2）
- 卡片寫完後狀態更新（更新 PainCard.current_step）

---

### [AI INTEGRATION]

選擇模式（卡 1, 2, 9 應為「無 AI」；其他卡視 prompt 而定）：

| 模式 | 適用卡片 | 元件 |
| :--- | :--- | :--- |
| **無 AI** | 卡 1, 2, 9 | 純表單，無任何 AI 元件 |
| **MVP 複製模式** | 卡 3-8 | `<AIPromptCopyBlock>`：顯示 prompt + 複製鈕 + 貼回 textarea + 解析按鈕 |
| **M2+ 站內 LLM** | 同上，但後端代理 | 同上元件 + 「直接執行」按鈕呼叫 `/api/ai/run-prompt` |

prompt 內文一律從 `references/ai_prompt_library.md` 引用，不得在頁面 prompt 中重複完整內文（只放 prompt_id）。

#### Anti-solution mode guard（卡 3-8 必含）

prompt 開頭強制注入：

```
你正在協助使用者進行「痛點教學」流程。請嚴格遵守：
1. 不可建議任何產品 / App / 工具的開發方案
2. 不可推薦現成的解決方案產品
3. 只能協助使用者把痛點看得更清楚
4. 若使用者問「應該開發什麼」，請回答「現在不是討論方案的時候，先把痛點搞清楚」
```

---

### [OCTALYSIS HOOKS]

本頁啟用的白帽驅動力（refer `references/octalysis_white_hat_principles.md`）：

| 驅動力 | 應用方式 | 注意事項 |
| :--- | :--- | :--- |
| #1 Epic Meaning | `{如何呼應「判斷力訓練」品牌敘事}` | 文案不誇大 |
| #2 Development & Accomplishment | `{過關條件視覺化方式}` | 不顯示分數 |
| #3 Empowerment of Creativity | `{使用者選擇 / 思辨的橋段}` | 至少給 2 個有意義選項 |
| #5 Social Influence | `{是否觸及痛點身份證分享、Pain Atlas 等社群元素}` | 完全選擇性 |

#### 黑帽掃描必過

每個頁面組裝完成後，必須跑下列 checklist：

- [ ] 頁面是否出現任何分數 UI（0-100、A-F、星等）？→ 若有，**直接砍掉**
- [ ] 是否有 streak / 連續打卡 / 連續登入獎勵？→ 若有，**直接砍掉**
- [ ] 是否有 loot box / 抽卡 / 神秘獎勵？→ 若有，**直接砍掉**
- [ ] 是否有 FOMO 文案（「最後 X 個名額」「限時優惠」）？→ 若有，**直接砍掉**
- [ ] 是否有過期警告（「資料 7 天後刪除」「進度即將過期」）？→ 若有，**直接砍掉**
- [ ] 「下一步」按鈕文案是否中性（不催促、不焦慮）？→ 若否，重寫
- [ ] 失敗回退提示是否使用「失敗」「不及格」字眼？→ 若是，重寫

---

## === EXCEPTION RULES ===

本頁面允許的例外（如有）：

1. `{exception_1_description}` — 原因：`{reason}`
2. `{exception_2_description}` — 原因：`{reason}`

若無例外，填入「無特殊例外，完全遵循 Global Guideline」。

範例例外（卡 1）：
- 「本頁完全禁用 AI 輔助」— 原因：抱怨原句必須由使用者親自記錄真人原話，AI 介入會污染原始信號

---

## === OUTPUT REQUIREMENTS ===

請依照以下步驟輸出：

### Step 1：結構確認

列出本頁面的：

- 主要 sections 及其用途（與 PAGE SPEC 一致）
- 每個 section 的關鍵元件 + 必填 / 選填欄位
- 與 PainCard schema 對應的欄位（明確列出 `complaint.verbatim` 等 path）
- 資料流：LocalStorage 讀 → React state → form → 驗證 → exit gate → 寫回 LocalStorage
- exit gate 判定邏輯（pseudocode）

### Step 2：設計決策說明

說明 2-3 個關鍵設計決策：

- 為什麼選用某種 layout（如「左右欄而非單欄」）
- 如何避免黑帽 Octalysis 元素
- 任何必要的權衡考量（如「為了反 solution mode，犧牲一鍵 AI 自動填入功能」）

### Step 3：實作方案

選以下之一輸出格式：

**Option A：完整程式碼**（推薦給 Lovable / Claude Code 直接生成）

```tsx
// 完整 React 元件 + Tailwind classes + Zod schema + LocalStorage 操作
```

**Option B：架構示意**（推薦給複雜頁面初步規劃）

```ts
// 介面定義 + 主要元件結構 + 關鍵邏輯說明
```

### 品質檢查（必過）

- [ ] 色彩系統一致性（無自創色，全部來自 brand tokens）
- [ ] 字體層級正確（H1 / H2 / Body 用法符合語意）
- [ ] 元件風格統一（圓角 / 陰影 / 邊框 spec 一致）
- [ ] 響應式設計完整（Desktop / Tablet / Mobile 三斷點皆驗證）
- [ ] 所有狀態已處理（Loading / Error / Empty / Disabled / Focus）
- [ ] 無障礙支援（鍵盤完整 Tab 順序 + ARIA labels + WCAG AA 對比度）
- [ ] PainCard schema 對應正確（欄位名 / 型別 / 必填規則與 `data_model.md` 一致）
- [ ] 反思提示規則正確（與 `references/exit_gates_matrix.md` 一致）
- [ ] 無 brand 禁令（無分數 UI / 排行榜 / FOMO）
- [ ] 無 Octalysis 黑帽（無 streak / loot box / 過期）
- [ ] AI 整合（若有）含 anti-solution guard
- [ ] 文案符合 brand voice（賦權、結構化、不焦慮）

---

## 模板填入後的範例（卡 1：抱怨原句）

以下示範如何將卡 1 的 spec 填入模板：

### [PAGE META]

- **page_name**: 抱怨原句（卡 1）
- **route_path**: `/learn/worksheet/01`
- **card_step**: 1
- **page_type**: card_input
- **primary_goal**: 引導使用者紀錄一個有名字、有時間、有場景的真人抱怨原句（不得改寫、不得分析）
- **target_users**: 不懂 AI 的初學者，第一次嘗試把口頭抱怨書面化
- **expected_time_on_page**: 5-8 分鐘
- **prerequisite_cards**: 無

### [STRUCTURE: SECTIONS]

1. **header_progress** — 顯示「卡 1 / 9」進度 stepper（refer `design/components/card_progress_stepper.md`）
2. **task_intro** — H2「先寫下你親耳聽到的那句抱怨」+ Body MD 提示（不要解讀、不要美化、保留原句）
3. **complaint_form** — 5 個必填欄位（verbatim / source_name / source_relation / datetime / scene）
4. **anti_pattern_warning** — 提示框：「不可寫『他應該需要 X』『我覺得他想要 Y』— 這是你的解讀，不是原句」
5. **exit_gate_status** — 5 欄位填寫進度（5/5 才可進下一張）
6. **action_footer** — sticky 底部行動列：「儲存並進入卡 2」（disabled 直到 exit gate 通過）

### [INTERACTION]

- `verbatim` 欄位即時驗證：≥ 10 字 + 不可包含「我覺得 / 應該需要 / 大概是」（R2.1）
- 觸發 R2.1 時，提示文案：「這像是你的解讀。請寫他原話怎麼說，例如『他說：「每次都要弄到半夜」』」
- 進入下一張按鈕：5 欄填妥才 enable（從灰 → Accent #E8913A）

### [RWD]

- Desktop：左欄題目說明 + 右欄表單（60/40）
- Tablet：上下堆疊
- Mobile：單欄 + sticky bottom action

### [DATA & API]

- 寫入 LocalStorage `painmap_worksheet:cards` 的 `cards[currentId].complaint`
- M2 同步：PATCH `/api/paincards/:id/cards/1`
- 無 AI 整合（卡 1 完全禁用 AI）

### [REFLECTION HINTS]

必填欄位（CTA disable 直到齊備）：`complaint.verbatim`/`source_name`/`source_relation`/`datetime`/`scene` 全部非空 且 verbatim ≥ 10 字。

中性 hint 文案（不擋過）：
- verbatim 太短：「再聽一次他的原話。10 字以上比較能保留情境。」
- 觸發 R2.1：「想想看：這幾個字像不像是你自己幫他想的？」

### [AI INTEGRATION]

無（卡 1 完全禁用）。

### [OCTALYSIS HOOKS]

| 驅動力 | 應用 |
| :--- | :--- |
| #1 Epic Meaning | task_intro 文案：「這 5 分鐘的紀錄，是判斷力訓練的起點」 |
| #2 Development & Accomplishment | header_progress 顯示「1 / 9」，但不顯示百分比、不顯示分數 |
| #3 Empowerment | 不採用（本卡不涉及思辨選擇） |
| #5 Social Influence | 不採用（本卡是個人紀錄） |

### 黑帽掃描

- [x] 無分數 UI（schema 內無 score 欄位）
- [x] 無分類學標籤（schema 內無分類學欄位）
- [x] 無 streak
- [x] 無 loot box
- [x] 無 FOMO
- [x] 無過期警告
- [x] 行動按鈕文案中性：「儲存並進入卡 2」
- [x] 中性 hint 無「失敗 / 不及格 / 過關 / 退回」字眼

---

## 執行優先順序

1. **Global 規範** > **Page 特定需求** > **Exception**
2. PainMap brand 禁令 > Octalysis 白帽應用（衝突時禁令優先）
3. 蘇格拉底式鐵律（反 solution mode、零分數、零分類學、書面優先）> UI 美觀

---

## 真相源

- Brand System：`docs/web_design/global/painmap_brand_system.md`
- Worksheet Spec：`docs/painmap_worksheet/product/data_model.md`、`design/pages/`、`references/`
