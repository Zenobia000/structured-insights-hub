# Worksheet Page Spec Template (卡片頁專用)

> 這是 PainMap Worksheet **卡片頁專用範本**，仿 `docs/web_design/pages/page_template.md` 並擴充三個專屬區塊：
>
> - **EXIT GATE**：卡片過關條件、失敗路由、文案
> - **AI INTEGRATION**：AI prompt 來源、輸出處理、反 solution mode 偵測
> - **OCTALYSIS HOOKS**：主/副驅動力 + 設計手法
>
> 入口頁 (`00_landing.md`) 與結果頁 (`10_pain_id_export.md`) 不適用此範本，採用 `docs/web_design/pages/page_template.md` 原版。
>
> 後續每張卡片 (`01_card_complaint.md` ~ `09_card_verdict.md`) 直接複製此檔填空。

---

## [PAGE META]

- **page_name**: {例：Card 3 - 卡關公式}
- **route_path**: `/learn/worksheet/0X`
- **page_type**: `form_card` 或 `form_card_ai`（有 AI 整合的用 `form_card_ai`）
- **card_number**: 1 ~ 9
- **paincard_field**: {對應 PainCard schema 的欄位，例：`stuck_formula`}
- **primary_goal**: {這張卡片要產出 PainCard 的哪個欄位 / 哪些值}
- **secondary_goal**: {次要目的，例：訓練使用者的某種判斷}
- **target_users**:
  - 主要：{主要使用者，多半同 brand system 的 Aji / Vivian / Kai}
  - 次要：{次要使用者}
- **entry_point**: 從卡 (X-1) 過關後自動導向 / 從 stepper 點擊回看
- **expected_time_on_page**: {預期填寫時間，3-15 分鐘}

---

## [STRUCTURE: SECTIONS]

> 卡片頁標準 5 個 Section（依需要可加 1-2 個 AI 區塊）

1. **page_header**
   - section_type: header
   - section_purpose: 顯示卡片標題、卡 X / 9 進度、儲存狀態

2. **instruction_block**
   - section_type: instruction
   - section_purpose: 用 1-2 句話說明這張卡片要做什麼、為什麼要做

3. **user_input_block**
   - section_type: form
   - section_purpose: 「你來填」的核心欄位輸入區（依 PainCard schema）

4. **ai_assist_block**（僅 form_card_ai 才有）
   - section_type: ai_block
   - section_purpose: AI 校對 / 提案 / 證據蒐集，含 prompt 複製功能

5. **example_block**
   - section_type: example
   - section_purpose: 顯示範例（補習班老師案例或抽象示例），讓使用者看到「過關長什麼樣」

6. **exit_gate_block**
   - section_type: exit_gate
   - section_purpose: 過關條件檢核 + 「下一張」按鈕；失敗時顯示「還缺什麼」

---

## [SECTION COMPONENT SPEC]

### Section: page_header

- **layout**: 固定於 Sub-Navigation 之下，全寬，padding 24px
- **elements**:
  - card_title: H1 / required / 「卡 X｜{卡片名稱}」
  - card_subtitle: Body MD / optional / 1 句話說明這張卡片的本質
  - save_status: Caption / required / 「已儲存於 HH:MM」或「儲存中...」
- **states**:
  - default: 完整顯示
  - saving: save_status 顯示 spinner + "儲存中..."
  - saved: save_status 顯示綠色勾號 + "已儲存於 HH:MM"
  - error: save_status 顯示 amber 警告 + "儲存失敗，請重試"
- **copy_constraints**: card_title 最多 12 字中文；card_subtitle 最多 30 字中文

### Section: instruction_block

- **layout**: 全寬單欄，BG Surface（white）背景，padding 24px，圓角 12px
- **elements**:
  - icon: Illustration / optional / 對應卡片主題的 illustration（例：卡 1 = 對話氣泡 + 鉛筆）
  - heading: H2 / required / 例：「把抱怨寫下來」
  - description: Body MD / required / 2-3 行說明
  - rules_list: BulletList / optional / 規則列表（例：「規則：寫你聽到的原句，不要美化」）
- **states**:
  - default: 完整顯示
  - collapsed: Mobile 上 description 可收合（預設展開）
- **copy_constraints**: heading 最多 14 字中文；description 每行最多 30 字中文

### Section: user_input_block

- **layout**: 1-column form layout，欄位由上至下垂直排列
- **elements**:
  - {field_1}: {Type} / {required|optional} / {說明}
    - 例：verbatim_textarea: Textarea / required / 5 行高、placeholder「貼上你聽到的原句，不要美化」
  - {field_2}: ...
  - field_validation: InlineMessage / 即時 / 顯示「字數 0/200」「格式錯誤」等
- **states**:
  - default: 空白 / 預填既有資料
  - focus: Border Focus (Teal) + 字段標籤上移
  - error: Error Message inline 顯示 + 字段邊框 amber
  - filled: 字段已填寫，無 error
  - autosave: 每 5 秒或失焦時觸發 LocalStorage 寫入
- **copy_constraints**: 每個 textarea 上限依 schema 欄位定義（如 verbatim 上限 1000 字）

### Section: ai_assist_block（form_card_ai 才有）

> 引用 `components/ai_prompt_copy_block.md`

- **layout**: 全寬單欄，BG Muted 灰背景區分；Desktop 可選擇兩欄（左 prompt，右回覆）
- **elements**:
  - section_title: H3 / required / 「🤖 AI 幫你 {動詞}」（例：「AI 幫你校對」）
  - tool_selector: ToolSelector / required / chatgpt / claude / perplexity / gemini 4 選 1
  - prompt_textarea: PromptDisplay / required / 顯示 prompt 內容，含複製按鈕
  - external_link_btn: Button Secondary / optional / 「直接打開 ChatGPT」
  - response_textarea: Textarea / required / 「貼回 AI 的回覆」
  - validation_warning: InlineMessage / 條件顯示 / AI 進入 solution mode 時警告
- **states**:
  - default: prompt 顯示，response 空白
  - copied: 複製按鈕顯示 toast「已複製到剪貼簿」
  - response_filled: 偵測 solution mode 字串，顯示警告
  - validation_failed: AI 回覆未通過反 solution mode 檢查
- **copy_constraints**: section_title 最多 16 字中文

### Section: example_block

- **layout**: 全寬單欄，BG Primary Light 淡藍背景，padding 20px
- **elements**:
  - section_title: H3 / required / 「📖 範例」
  - example_content: PreFormattedText / required / 範例文字（採用 Code 字體呈現）
  - example_source: Caption / optional / 「補習班老師案例」「來自卡 X 的延伸」
- **states**:
  - default: 範例完整顯示
  - collapsed: Mobile 預設折疊，點「看範例」展開
- **copy_constraints**: example_content 最多 200 字中文

### Section: exit_gate_block

> 引用 `components/exit_gate_check.md`

- **layout**: 全寬單欄，sticky 在頁面底部，padding 24px，BG Surface
- **elements**:
  - checklist: ChecklistItems / required / 每個 exit condition 一條（顯示勾選或缺漏）
  - next_button: Button Primary / required / 「下一張卡片 →」（disabled 直到 checklist 全部通過）
  - retreat_link: Link Secondary / optional / 「先存檔離開」「回卡 X 補資訊」
  - help_tooltip: Tooltip / required / next_button disabled 時 hover 顯示「還缺：XXX」
- **states**:
  - locked: next_button disabled，checklist 顯示未通過項目
  - ready: next_button enabled，checklist 全綠
  - warning: 通過但有警告（例：卡 6 AI 解答夠用但有疑慮），按鈕變黃色「仍要繼續？」
- **copy_constraints**: next_button 文案固定為「下一張卡片 →」（卡 9 改為「產出我的痛點身份證」）

---

## [INTERACTION & STATE FLOW]

### 主要互動流程

1. {頁面載入} → 從 LocalStorage 讀取 PainCard，填入既有資料（若有）
2. {使用者填寫 user_input_block} → 每 5 秒 / 失焦時自動存 LocalStorage
3. {使用者觸發 AI 動作}（form_card_ai 才有） → 顯示 prompt → 使用者複製 → 貼回 response
4. {ai_validation 通過} → 自動填入對應的 PainCard 欄位
5. {checklist 全部通過} → next_button 解鎖
6. {點擊 next_button} → 寫入 PainCard.current_step + 1，導向下一張卡片

### RWD 行為差異

| 斷點 | 佈局 | 差異說明 |
| :--- | :--- | :--- |
| Desktop (>1280px) | 全寬內容置中，max-width 920px；ai_assist_block 採兩欄 | 完整體驗 |
| Tablet (768-1280px) | 同 Desktop 但寬度為 100%；ai_assist_block 採單欄堆疊 | 折疊 example_block 預設收合 |
| Mobile (<768px) | 全部單欄；instruction_block 可折疊；exit_gate sticky 底部 | example 收合，stepper 折成「卡 X / 9」 |

### 資料更新策略

- LocalStorage 寫入頻率：5 秒 debounce 或欄位失焦時觸發
- 不需網路：MVP 階段全部本地操作
- AI 整合：MVP 階段使用「複製 prompt 到外部 ChatGPT」模式（feature flag 切換 LLM API）

### 錯誤恢復

- LocalStorage 容量超過 5MB 時：顯示警告，建議使用者匯出後清除舊資料
- 瀏覽器禁用 LocalStorage 時：顯示告知 banner「你的瀏覽器禁用了本地儲存，無法保存進度」+ 解決步驟

---

## [DATA & API]

- **uses_api**: false（MVP 階段，全部本地）
- **localstorage_keys**:
  - `painmap_worksheet:cards` — Record<id, PainCard>（schema 詳見 `data_model.md`）
  - `painmap_worksheet:current_card_id` — 當前正在填寫的 card UUID
- **paincard_fields_read**: {從 PainCard 讀取哪些欄位}
  - 例：卡 3 讀取 `complaint`、`people.background`（用於 AI prompt 變數插值）
- **paincard_fields_write**: {寫入 PainCard 的哪些欄位}
  - 例：卡 3 寫入 `stuck_formula.user_draft`、`stuck_formula.ai_polished`、`stuck_formula.confirmed`
- **schema_validation**: 寫入前用 Zod 驗證對應 schema 區段
- **error_cases**:
  - LocalStorage 寫入失敗：Toast 顯示「儲存失敗」+ 重試按鈕
  - Schema 驗證失敗：欄位邊框 amber + 錯誤訊息 inline 顯示
  - AI 回覆解析失敗：保留原始 raw_response，不阻斷流程

---

## [EXIT GATE]

> 卡片頁特有區塊。對應 `references/exit_gates_matrix.md`。

### 過關條件 (Exit Conditions)

> 從 `data_model.md` 過關條件對應表複製。每個卡片在此明確列出。

- [ ] {例：`complaint.verbatim` 非空}
- [ ] {例：`complaint.source_name` 非空}
- [ ] {例：`complaint.scene` 非空}

### Validation Logic

```typescript
// 範例：卡 1
function validateCardComplaint(card: PainCard): ValidationResult {
  const errors: string[] = [];
  if (!card.complaint.verbatim) errors.push('原句未填');
  if (!card.complaint.source_name) errors.push('來源人物未填');
  // ...
  return { passed: errors.length === 0, errors };
}
```

### Failure Routes (失敗路由)

> 過不了關時的「建議回退」（不是強制）。

| 失敗條件 | 建議目標 | 文案 |
| :--- | :--- | :--- |
| {例：source_name 寫了「補習班老師」沒名字} | `/learn/worksheet/01` 重填 | "你寫的不是真名。回卡 1 寫真名（例：林老師）。" |
| {例：scene 太抽象} | （留在當頁） | "場景太抽象。試試寫『2026-04-15 21:00，他在書桌前打開 LINE』。" |

### 通過後的下一步

- 寫入 `PainCard.current_step = X + 1`
- 寫入 `PainCard.updated_at = now()`
- 導向 `/learn/worksheet/0(X+1)`
- Toast「已通過卡 X，進入卡 (X+1)」（不誇張，不喊「恭喜」）

---

## [AI INTEGRATION]

> 卡片頁特有區塊。卡 1, 2, 9 為「無 AI」，其他卡片有 AI 整合。

### AI 介入類型

- **AI 校對** (卡 3)：使用者先寫 → AI 校對句型 → 使用者確認
- **AI 提案** (卡 4, 5)：使用者填部分 → AI 提案多個選項 → 使用者選擇
- **AI 證據蒐集** (卡 6)：使用者貼背景 → AI 跑 8 題研究 → 使用者讀回覆
- **AI 整理** (卡 7)：使用者先猜 → AI 整理判斷表 → 使用者對照差異
- **AI 模擬** (卡 8)：使用者寫題目 → AI 扮演受訪者 → 使用者熱身

### Prompt 來源

引用自 `references/ai_prompt_library.md`，每個卡片頁固定 1-2 段 prompt：

```yaml
prompt_id: card_3_polish
description: 把抱怨改寫成卡關公式
inputs:
  - card_1_verbatim
  - card_2_background
template_path: references/ai_prompt_library.md#card-3-polish
```

### 變數插值機制

prompt 內含 `[貼上卡片 X 的原句]` 等變數，元件自動替換為 PainCard 對應欄位：

| 變數 | 替換來源 |
| :--- | :--- |
| `[貼上卡片 1 的原句]` | `card.complaint.verbatim` |
| `[貼上卡片 2 的「大概背景」]` | `card.people.background` |
| `[貼上卡片 3 的卡關公式]` | `card.stuck_formula.user_draft` |
| ... | ... |

### 反 solution mode 偵測

當 AI 回覆中含以下字串時，顯示警告：
- 「建議開發」「建議做一個」「應該設計」「建議使用 SaaS」「我們可以打造 App」「推薦工具：」「商業模式」「market opportunity」「TAM」

警告 UI（不是 modal，是 inline AmberBanner）：

```
⚠️ AI 開始推銷解法了。要不要重跑 prompt？
   建議在 prompt 開頭加一句「不要建議任何解決方案」
   [重跑 prompt]  [我了解，繼續]
```

### MVP vs 後期

- **MVP（M1）**：複製 prompt 到外部（ChatGPT / Claude / Perplexity / Gemini）
- **後期（M2+）**：feature flag 切換站內 LLM API（透過 Edge Function 代理）

詳見 `components/ai_prompt_copy_block.md`。

---

## [OCTALYSIS HOOKS]

> 卡片頁特有區塊。對應 `octalysis_card_mapping.md`。

### Primary Drive

- **#X {驅動力名稱}**：{在這張卡片如何體現}

### Secondary Drive(s)

- **#X {驅動力名稱}**：{輔助呈現方式}

### 設計手法 (Design Techniques)

- {例：「兩階段 UI — 先猜再讀 AI」}
- {例：「自由選擇 AI 工具，強化 #3 Creativity」}

### 反模式 (此卡禁止)

- ❌ {例：「禁止顯示『AI 推薦最佳答案』，會破壞 #3 Empowerment」}
- ❌ {例：「禁止打字機動畫模擬等待，違反『沉穩』」}

---

## [EXCEPTION TO GLOBAL RULES]

> 這個頁面需要違反 PainMap brand system 的地方。盡量最小化。

- {例：此頁面 BG 用 BG Page (#F7F8FA) 而非 BG Surface，因為焦點在輸入框}
- 若無例外：「無特殊例外，完全遵循 painmap_brand_system.md 規範。」

---

## [BRAND LANGUAGE RULES (PAGE-SPECIFIC)]

### 禁止用語（全站共用 + 此卡特有）

| 禁止 | 理由 |
| :--- | :--- |
| 「點子」「靈感」 | brand 禁令 |
| 「分數」「等級」 | brand 禁令 |
| 「立即」「現在不做就晚了」 | FOMO 禁令 |
| {頁面特有} | {理由} |

### 建議用語（此卡專用）

| 建議 | 場景 |
| :--- | :--- |
| 「下一張卡片」 | next button |
| 「先存檔離開」 | retreat link |
| 「再加一點具體細節」 | 過關失敗提示 |

---

## [ACCEPTANCE CRITERIA]

- [ ] 所有 Section 功能正常
- [ ] 所有狀態已實作（default / saving / error / disabled / focused）
- [ ] RWD 三斷點行為正確
- [ ] LocalStorage 自動儲存運作正常（5 秒 debounce）
- [ ] Stepper 對應的 step 顯示為 active 狀態
- [ ] Exit Gate 條件正確檢查 PainCard 欄位
- [ ] 失敗時 retreat link 文案正確顯示
- [ ] AI prompt 複製按鈕運作正常
- [ ] AI prompt 變數插值正確替換
- [ ] AI 回覆 solution mode 偵測準確（≥ 90% recall）
- [ ] Octalysis hooks 在 UI 上有具體體現（不是只在文件裡）
- [ ] 全頁面零出現禁止用語（分數 / 點子 / 排行榜）
- [ ] 全頁面零 FOMO 話術
- [ ] 字體 / 色彩 / 間距 完全遵循 painmap_brand_system.md
- [ ] a11y：所有按鈕有 aria-label，鍵盤可達
- [ ] 鍵盤操作：Tab 順序正確、Enter 觸發主按鈕、Esc 取消修改

---

## [VERSION]

| 版本 | 日期 | 變更 |
| :--- | :--- | :--- |
| 1.0 | 2026-05-01 | 首版範本；定義卡片頁 6 區塊 + 3 個專屬擴充區塊 |
