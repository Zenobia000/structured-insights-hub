# PainMap Worksheet — Pain ID Export (Capstone) Integrated Prompt

> 自我包含整合 prompt — 直接貼入 Lovable / Claude Code 即可生成痛點身份證匯出頁完整實作。
> 對應 page spec：`docs/painmap_worksheet/design/pages/10_pain_id_export.md`
> 對應資料模型：`docs/painmap_worksheet/product/data_model.md` § Card 10
>
> **核心設計**：單一匯出格式；身份證內容為 8 個欄位區塊（含 `contradiction.sacrificed_reason`），無分數、無分類學標籤。

---

## === GLOBAL PROJECT GUIDELINE (DO NOT OVERRIDE) ===

你是「PainMap 題眼 — Worksheet」的資深產品設計師與前端工程師。

### 品牌特質

**結構化** ｜ **賦權感** ｜ **沉穩** ｜ **蘇格拉底式**

### Color Tokens

| Token | 色值 | 用途 |
| :--- | :--- | :--- |
| Primary #1E3A5F / Primary Light #E8EEF5（pain_id_card border 2px）/ Secondary #2D7D8A / Accent CTA #E8913A / Verified #2D9D78（true_pain badge / 完成 stepper）/ Verified Light #E6F5EF（true_pain 背景）/ Caution #D97706（pending_interview badge）/ Caution Light #FEF3E2 / Muted Gray（fake_pain badge）/ Error #DC2626（**僅限 destructive 刪除按鈕**）/ BG Page #F7F8FA / BG Surface #FFFFFF / BG Muted #F1F3F5 / Text Primary #1A2332 / Text Secondary #5C6B7A / Border Default #DFE3E8 / Border Focus #2D7D8A |

### Typography

H1 28px / H2 22px / H3 18px / Body LG 17px / Body MD 15px / Body SM 13px / Caption 12px

字體：`Noto Sans TC` + `Inter`

### 元件風格

- Radius MD 8px / LG 12px（pain_id_card）
- Border `1px solid #DFE3E8` / focus 2px Teal
- Shadow SM / MD（pain_id_card）/ LG（modals）

### 技術棧

React 18 + TypeScript + Tailwind + Zustand + React Hook Form + Zod + jsPDF（或 React-PDF for PDF 匯出）。LocalStorage key：`painmap-worksheet-v2`。

### 絕對禁令（PainMap Brand）

- **禁止：任何分數 UI**（schema 內無 score 欄位）
- **禁止：分類學標籤**（schema 內無此類欄位）
- 禁止：星等、A-F 等級、排行榜、徽章、倒數計時
- 禁用詞：「恭喜完成」「達成成就」「闖關成功」「Level Up」「升級」「進階」（動詞）「你的痛點得分」「立即匯出」「快速分享」「需要登入才能匯出」「Pro 解鎖更多匯出格式」「分享後可獲得 X 點」「你是第 N 位完成」「總分」
- **Card 10 嚴重反模式**：強制登入匯出、Pro 鎖定匯出格式、人為稀缺
- 禁止 Inline styles / `console.log`
- WCAG AA / 語意化 HTML / focus ring Teal

### 絕對禁令（Octalysis 黑帽）

- 禁止 #6 Scarcity：「24 小時內進入階段二有獎勵」、「限時匯出」
- 禁止 #7 Unpredictability：「驚喜身份證模板」
- 禁止 #8 Loss Avoidance：「不匯出資料明天會消失」、streak

### 蘇格拉底式特殊鐵律

1. **資料主權**：所有資料只在使用者本機 LocalStorage，**不需要登入即可匯出**
2. **書面優先**：產出可帶離本網站的書面 PainCard（Markdown / JSON / PDF）
3. **單一匯出格式**：無切換選項
4. **失敗回退**：PainCard 不完整 → redirect 對應卡片頁
5. **匯出範本必須包含 `contradiction.sacrificed_reason`**

---

## === CURRENT TASK: BUILD PAIN ID EXPORT (CAPSTONE) ===

### [PAGE META]

- **page_name**: Pain ID Export
- **route_path**: `/learn/worksheet/result?id={paincard_uuid}`
- **card_step**: 10（capstone，全部完成）
- **page_type**: capstone_export
- **primary_goal**: 把 9 卡精華組合成「痛點身份證」視覺呈現 + 提供 Markdown / JSON / PDF 匯出 + 引導使用者依 verdict 走向對應下一步
- **secondary_goal**: 強化「資料主權」品牌敘事；建立「身份證 = 完成憑證」的 Accomplishment 體驗
- **prerequisite_cards**: [1, 2, 3, 4, 5, 6, 7, 8, 9]
- **expected_time_on_page**: 5-15 分鐘

---

### [STRUCTURE: SECTIONS]

1. **stepper_context** — 9 卡 ✓ + 第 10 步 active
2. **completion_header** — 沉穩告訴使用者「你完成了判斷力訓練」（**不慶祝、不徽章**）
3. **pain_id_card** — 完整呈現痛點身份證（單一格式）
4. **export_actions** — 3 種匯出格式 + 隱私聲明 + 「不需登入」
5. **next_step_cta** — 依 verdict.judgment 動態（真 / 假 / 待訪談 三變體）
6. **stage_handoff_panel** — 階段一 vs 階段二銜接
7. **footer_actions** — 「重新填一張」「查看舊身份證」「分享」「刪除本機資料」

---

### [SECTION COMPONENT SPEC]

#### Section 1: stepper_context

- 9 個圓點全部 completed（Verified Green）+ 第 10 個 active
- `back_link`: "← 卡 9" → `/learn/worksheet/09`
- `autosave_indicator` (Caption Muted): "資料只在你的本機 · HH:mm 最後更新"

#### Section 2: completion_header

- **layout**: 全寬白底，padding 48px，最大寬 800px
- **elements**:
  - icon: 🪪（中性 Teal 色，**非慶祝符號**）
  - `title` (H1): "你的痛點身份證"
  - `subtitle` (Body LG): "9 卡的精華組合在這裡。看一遍，匯出一份，去做你的下一步。"
  - `completion_meta` (MetaPanel)：
    - created_at (Caption): "建立日期：YYYY-MM-DD"
    - updated_at (Caption): "最後更新：YYYY-MM-DD HH:mm"
    - status_badge (StatusBadge)：動態
      - `structured` → Verified Green「真痛點」
      - `pending_interview` → Caution Amber「待訪談」
      - `archived_fake` → Muted Gray「假痛點（已封存）」
  - `epic_meaning_line` (Body MD Italic): "這份身份證裡沒有『錢』。階段一只訓練判斷力。"

**禁止**：慶祝動畫（紙花、煙火）、勝利音效、徽章、點數。

#### Section 3: pain_id_card（**核心視覺**，單一格式）

- **layout**: 全寬白底，最大寬 880px，padding 40px，shadow-md，border 2px Primary Light，圓角 lg
- **card_visual_frame**：
  - top_decoration: HorizontalRule 「═══════════════════════════════════」
  - card_label (H2): 「痛點身份證」（置中）
  - bottom_decoration: 同上
- **card_body**：8 個欄位區塊垂直堆疊：

| 欄位 | label | content_source |
| :--- | :--- | :--- |
| protagonist | 主人翁 | `people.list[0]` → "{name}（{relation}）" |
| scene | 場景 | `complaint.verbatim`（≤ 200 字截斷）+ "卡關公式：{stuck_formula.ai_polished 或 user_draft}" |
| workaround | 他現在怎麼解 | `workaround.tool_name` + `user_dissatisfactions` 前 3 項 |
| **contradiction** | 兩件事不能同時要 | **A 端**：`contradiction.side_a`<br>**B 端**：`contradiction.side_b`<br>**通常犧牲**：`contradiction.sacrificed`（顯示為 A 端 / B 端）<br>**為什麼會被犧牲**：`contradiction.sacrificed_reason` |
| ai_evidence | AI 找到的關鍵證據 | `self_guess.pain_judgment_table` 前 5 行 + 「展開完整判斷表 ▼」 + extra: "AI 工具：{ai_evidence.ai_tool}" |
| self_guess_delta | 我自己猜 vs AI 答的差異 | `self_guess.deltas.{biggest_diff, ai_added, guess_unsupported}` |
| interview | 我會優先訪談 | `interview_plan.targets[0]` + `questions[0..2]` |
| verdict | 我的判斷 | judgment_badge（true_pain ✓ / fake_pain ✗ / pending_interview ?）+ reason_100w 完整 + most_confident + least_confident |
| next_action | 下一步 | 動態文字依 `verdict.next_action`：interview → "訪談卡 8 的對象" / more_evidence → "回卡 6 找更多證據" / change_topic → "換題目重新填一輪" |

- **card_footer**：
  - signature_line: "═══════════════════════════════════"
  - meta_dates: "建立：{created_at} ｜ 最後檢核：{updated_at}"

#### Section 4: export_actions

- `section_title` (H2): "匯出你的身份證"
- `section_subtitle` (Body MD): "資料只在你本機。匯出後請自己保存。"
- `export_buttons` (ExportButtonGroup)：3 個按鈕並排（Mobile 垂直）

| 格式 | icon | description | file_extension |
| :--- | :--- | :--- | :--- |
| Markdown | 📄 | 給 Notion / GitHub / 部落格用 | `.md` |
| JSON | 🔧 | 跨工具搬移、備份、給開發者用 | `.json` |
| PDF | 📑 | 列印、面對面討論 | `.pdf` |

每個按鈕為 Button Secondary，hover 顯示 PopoverPreview（前 20 行預覽）。

- `filename_format` (Caption Muted): "檔名：paincard-{slug}-{YYYY-MM-DD}.{ext}"
- `privacy_statement` (PrivacyCallout, **必填**, icon=🔒)：
  - title: "你的資料主權"
  - body：
    - 「所有資料只在你的瀏覽器 LocalStorage」
    - 「我們沒有伺服器收集你的痛點」
    - 「不需要登入、不需要帳號、不需要 Email」
    - 「匯出後你完全自管」
  - learn_more_link: "資料隱私詳情" → `/privacy`

#### Section 5: next_step_cta（依 verdict 動態三變體）

- **layout**: 全寬，最大寬 800px，padding 40px，**背景色依 verdict 動態**：
  - true_pain → Verified Light Green `#E6F5EF`
  - pending_interview → Caution Light Amber `#FEF3E2`
  - fake_pain → Muted Gray
- `section_title` (H2): "下一步去哪？"

##### variant_true_pain（`judgment === 'true_pain'`）

- status_message (Body LG): "你判定這是真痛點。"
- reasoning (Body MD): 「卡 8 的訪談對象排起來，現場確認後，可以進入 PainMap App 進階版繼續分析。」
- primary_cta (Button Primary Large): "進入 PainMap App →" → `/app/start?import_paincard={id}`
- secondary_cta (Button Ghost): "先去訪談（卡 8 對象）"
- tertiary_link (TextLink, optional): "我想再回顧一次" → `/learn/worksheet/01`（保留資料）

##### variant_pending_interview（`judgment === 'pending_interview'`）

- status_message: "你還無法判斷，這是最常見的結果，很正常。"
- reasoning: 「訪談 2-3 人後回來重新打分。通常訪談完，真假就會浮出來。」
- primary_cta: "查看訪談對象 →"
- secondary_cta: "訪談完後回來重打" → `/learn/worksheet/09`
- tertiary_link: "先看看其他人的痛點身份證" → `/atlas`

##### variant_fake_pain（`judgment === 'fake_pain'`）

- status_message: "你判定這是假痛點。"
- reasoning: 「**不要難過。這就是這份卡片的價值 — 幫你省下 3 個月走錯路的時間。** 換題目，從卡 1 重新填。」
- primary_cta: "換題目，從卡 1 開始 →" → `/learn/worksheet/01?new=true`
- secondary_cta: "保留這張作為學習紀錄" → 寫入 archived_fake
- tertiary_link: "為什麼這是好結果？" → 開啟側邊 Drawer

#### Section 6: stage_handoff_panel

- **layout**: 全寬白底，最大寬 800px，padding 32px，border 1px Border Default
- `section_title` (H2): "階段一 vs 階段二：你在哪？"
- `stage_diagram` (VisualDiagram)：兩階段視覺對照
  - **stage_1_block**:
    - title: "階段一：判斷力訓練（這份）"
    - completion_indicator (Verified Badge): "✓ 你已完成"
    - description: 「9 張卡片，30-90 分鐘。產出：真假判斷的書面交付。不需要：寫程式、收錢、做產品。」
  - arrow: ↓
  - **stage_2_block**:
    - title: "階段二：商業驗證（後續）"
    - status_indicator (ConditionalBadge)：動態
      - true_pain → Caution Amber「待開始」
      - pending_interview → Muted Gray「先訪談再評估」
      - fake_pain → **Hidden（不顯示，避免誤導）**
    - description: 「72 小時 sprint。產出：第一筆真實付款。讀：first_principles_sprint_manual.md」
- `handoff_cta` (ConditionalCta)：
  - true_pain → Button Secondary「了解階段二（first-dollar sprint）→」
  - 其他 → 不顯示
- `why_two_stages` (CalloutBox Info, optional, icon=💡)：
  - body: 「為什麼分階段？因為『痛點是不是真的』和『能不能賺錢』是兩個不同問題。階段一沒過 → 階段二一定會失敗。」

#### Section 7: footer_actions

- **layout**: 全寬，最大寬 800px，padding 24px，背景 BG Muted
- `secondary_action_group` (ActionGroup)：4 個次要操作

| Action | icon | label | hint | 行為 |
| :--- | :--- | :--- | :--- | :--- |
| 重新填一張 | ➕ | "重新填一張新身份證" | 這張會保留，新的另存 | → `/learn/worksheet/01?new=true` |
| 查看舊身份證 | 📚 | "查看我的舊身份證" | LocalStorage 保留所有歷史 | → `/learn/worksheet/history` |
| 分享 | 🔗 | "分享身份證" | 複製連結 / 匯出後分享 .md | 開啟 ShareModal |
| 刪除 | 🗑️ | "刪除本機資料" | 資料主權 — 隨時可刪 | 開啟 DeleteConfirmModal（**Danger 色**） |

##### `share_modal` (ShareModal, conditional)

- share_options：
  - 「複製可分享連結（短網址，僅分享你選的欄位）」
  - 「下載 .md 後手動分享」
  - 「轉成圖片（生成中... M2 範圍）」
- `share_field_selector` (CheckboxGroup)：讓使用者選哪些欄位要分享
  - 預設勾選：`verdict.judgment` + `verdict.reason_100w`
  - 可選勾選：`contradiction`（含 sacrificed_reason）、`stuck_formula`、`workaround`

##### `delete_confirm_modal` (DeleteConfirmModal, conditional)

- title (H2): "真的刪除這份痛點身份證？"
- body: 「資料只在你的本機。刪除後無法復原。建議先匯出再刪除。」
- export_first_button (Button Secondary): "先匯出 .md 再刪"
- confirm_button (Button **Danger**): "我已備份，刪除"
- cancel_button (Button Ghost): "取消"

---

### [INTERACTION & STATE FLOW]

#### 主要互動流程

1. 頁面載入 → 從 LocalStorage `painmap-worksheet-v2` 讀取 PainCard
2. 渲染完整 pain_id_card（依 PainCard 8 個欄位填入）
3. 使用者點 export 按鈕 → 觸發對應格式生成
4. 下載完成 → toast 通知 + 寫入 `PainCard.exported.formats` (push) + `exported_at`
5. 使用者點 next_step_cta primary 按鈕 → 依 verdict 路由

#### 匯出格式詳細規格

##### Markdown template

```markdown
# 痛點身份證

**主人翁**: {name}（{relation}）
**建立日期**: {created_at}
**最後更新**: {updated_at}
**判定**: {judgment_label}

## 場景
{complaint.verbatim}

**卡關公式**: {stuck_formula.ai_polished}

## 他現在怎麼解
- 工具/方法：{workaround.tool_name}
- 不滿意：
  - {dissatisfactions[0]}
  - {dissatisfactions[1]}
  - {dissatisfactions[2]}

## 兩件事不能同時要
- A 端：{contradiction.side_a}
- B 端：{contradiction.side_b}
- 通常犧牲：{sacrificed_label}
- **為什麼會被犧牲**：{contradiction.sacrificed_reason}

## AI 找到的關鍵證據
{self_guess.pain_judgment_table}

**AI 工具**：{ai_evidence.ai_tool}

## 我自己猜 vs AI 答的差異
- 最大差異：{deltas.biggest_diff}
- AI 補了：{deltas.ai_added}
- 我猜但 AI 沒支持：{deltas.guess_unsupported}

## 我會優先訪談
- 對象：{interview_plan.targets[0].persona}
- 訪談題：
  1. {questions[0]}
  2. {questions[1]}
  3. {questions[2]}

## 我的判斷
**{judgment}**

{reason_100w}

- 最有把握：{most_confident_evidence}
- 最沒把握：{least_confident}

## 下一步
{next_action_label}
```

##### JSON 格式

直接輸出完整 PainCard 物件，檔名 `paincard-{slug}-{YYYY-MM-DD}.json`。

```typescript
function buildShareableJson(card: PainCard): string {
  return JSON.stringify(card, null, 2);
}
```

##### PDF 格式

- A4 一頁版（適合列印）
- 字體：Noto Sans TC
- 結構同 Markdown
- PDF 生成 5 秒內完成；超過 3 秒顯示 spinner

#### RWD

| 斷點 | 佈局 |
| :--- | :--- |
| Desktop (>1280px) | pain_id_card 全寬展示；export 3 按鈕並排；footer 4 actions 並排 |
| Tablet | 同 Desktop；export 按鈕縮小 |
| Mobile | pain_id_card padding 減半；export 3 按鈕垂直堆疊；footer 改為 2x2 grid；next_step_cta primary 為固定底部 sticky |

---

### [DATA & API]

- **uses_api**: false（MVP 全部 LocalStorage）
- **localstorage_keys**:
  - `painmap-worksheet-v2`（讀整個 PainCard）
- **data_paths_read**: 全部 PainCard 欄位
- **data_paths_written**:
  - `PainCard.exported.formats` (push 'markdown' / 'json' / 'pdf')
  - `PainCard.exported.exported_at` (ISO8601)
  - `PainCard.exported.last_review_at` (進入此頁時更新)
- **匯出檔名規則**: `paincard-{slug}-{YYYY-MM-DD}.{ext}`，slug = `complaint.verbatim` 前 20 字（移除特殊字符 + 空格 → `-`）
- **error_cases**:
  - PainCard 不完整（卡 1-9 任一未填）→ 「資料不完整，請先回到卡 N」+ 不可離開
  - 匯出失敗（瀏覽器封鎖下載）→ 「下載被瀏覽器封鎖，請允許下載 painmap.com」+ 重試
  - PDF 生成超時（> 5 秒）→ spinner

---

### [REFLECTION HINTS]

> 此頁是 capstone view，**沒有反思提示**。

但有「進入此頁的前置條件」：

| # | 條件 | 自動判定 |
| :- | :--- | :--- |
| 1 | PainCard.current_step === 10 | LocalStorage 讀取 |
| 2 | verdict.judgment 非 null | LocalStorage 讀取 |
| 3 | verdict.reason_100w.length >= 100 | LocalStorage 讀取 |

任一不滿足 → 自動 redirect 回對應卡片頁。

---

### [AI INTEGRATION]

- **AI 介入狀態**：❌ **不適用**（capstone 頁不需 AI）
- **理由**：Markdown 是固定 template，不需 AI；視覺化用沉穩結構即可，不需花俏；推薦下一步由 verdict.next_action 決定，不由 AI 決定
- **內建 prompt**：無
- **Fallback**：無

#### worksheet 鐵律對應

| 鐵律 | 軟體實作 |
| :--- | :--- |
| 「這份身份證裡沒有錢」 | 全頁不顯示任何貨幣 / 收入 / 商業數字 |
| 「階段一只訓練判斷力」 | stage_handoff_panel 明確區分階段 |
| 「換題目，從卡 1 重新填」（假痛點） | variant_fake_pain primary_cta 直接連到卡 1 |
| **「零分數」** | pain_id_card 不顯示任何分數 / 等級 / N/M 數字 |
| **「零分類學」** | contradiction 區塊顯示 sacrificed_reason，不貼任何分類標籤 |

---

### [OCTALYSIS HOOKS]

#### 主驅動力：#2 Development & Accomplishment

- pain_id_card 視覺呈現 = 「完成憑證」（仿身份證形式強化「正式文件」感）
- stepper 顯示 9 卡全部 ✓ + 第 10 步 active
- completion_header 用沉穩「你的痛點身份證」**非**興奮的「恭喜完成」
- export_actions 3 種格式 = 「你可以帶走的成果」

**反模式禁令**：
- ❌ 不撒紙花動畫
- ❌ 不發徽章
- ❌ 不解鎖「完成 3 張身份證的成就」
- ❌ 不用「Level Up」字眼

#### 副驅動力：#4 Ownership & Possession（資料主權）

- privacy_statement 強調「你的資料只在你本機」
- 三種匯出格式 = 「你完全自管」
- footer_actions 提供「刪除本機資料」 = Ownership 終極形式
- next_step_cta 不強推 PainMap App，給「先去訪談」「再回顧」等多選項

#### 副驅動力：#5 Social Influence（限定使用）

- action_share 提供分享身份證功能（白帽社交，不是炫耀）

#### 反模式檢查清單（Card 10 最容易犯）

- ❌ 慶祝動畫（紙花、煙火、勝利音效）
- ❌ 「成就解鎖」徽章 / 點數
- ❌ 「分享得 X 點」
- ❌ 「你是第 N 位完成的使用者」（社會比較）
- ❌ 「身份證收藏冊」（IKEA 收集誘導）
- ❌ **「強制登入才能匯出」**（**最嚴重反模式 — 違反資料主權**）
- ❌ **「Pro 才能匯出 PDF」**（功能勒索）
- ❌ 「每月只能匯出 1 次」（人為稀缺）
- ❌ 跨身份證比較
- ❌ **任何分數 UI**（schema 內無 score 欄位）
- ❌ **任何分類學標籤顯示**

---

## === EXCEPTION RULES ===

本頁面允許以下例外（已明確標記）：

1. **「刪除本機資料」按鈕用 Danger 色（紅）**：違反全域「紅色僅用於系統錯誤」原則。理由：destructive action（刪除）是少數應該用紅色警示的場景；**但僅限這一個按鈕**。
2. **pain_id_card 使用裝飾線「═══════════════════════════════════」**：違反「結構優於裝飾」原則。理由：仿 worksheet 末尾 ASCII 框架的設計化呈現。
3. **PDF 匯出可能花 3-5 秒**：違反全域「互動響應 < 100ms」原則。理由：PDF 生成本質需要時間。
4. **next_step_cta 使用三種背景色（依 verdict）**：違反「BG Surface 統一白底」原則。理由：判定結果視覺差異需強烈對比。

---

## === OUTPUT REQUIREMENTS ===

### Step 1：結構確認

- 7 個 sections + 用途
- PainCard schema 對應：read 全部欄位（含 sacrificed_reason）+ write `exported.{formats, exported_at, last_review_at}`
- 資料流：URL `?id` → 讀 LocalStorage `painmap-worksheet-v2` → 渲染 pain_id_card → 匯出觸發 → 寫回 exported metadata

### Step 2：設計決策說明

說明 3 個關鍵設計決策：
1. **為什麼匯出絕對不需要登入？** — 資料主權是 brand 鐵律；強制登入匯出 = 最嚴重反模式；LocalStorage + jsPDF 全 client-side 即可實現
2. **為什麼單一匯出格式？** — schema 內無 score 欄位，沒有「需要切換隱藏」的東西；單一格式 = 更簡單、更誠實
3. **為什麼匯出範本含 sacrificed_reason？** — sacrificed_reason 是判斷力的精華（為什麼那邊被犧牲）。匯出範本永遠跟 schema 一致。

### Step 3：實作方案（Option A）

- `PainIdExportPage.tsx`
- `StepperContext` / `CompletionHeader` / `PainIdCard` / `ExportActions` / `NextStepCta` / `StageHandoffPanel` / `FooterActions`
- `useMarkdownExport` / `useJsonExport` / `usePdfExport` hooks
- `useNextStepRouter` hook
- ShareModal / DeleteConfirmModal 元件
- jsPDF 或 React-PDF 整合
- RWD Tailwind

### 品質檢查清單（部署前必過）

#### 通用
- [ ] 7 個 Section 依序渲染，stepper 顯示 9 卡 ✓ + 第 10 步 active
- [ ] pain_id_card 完整顯示 8 個欄位
- [ ] contradiction 區塊正確顯示 side_a + side_b + sacrificed + **sacrificed_reason**
- [ ] **contradiction 區塊無分類學標籤顯示**
- [ ] completion_header 不出現任何慶祝動畫 / 徽章 / 點數
- [ ] privacy_statement 強制顯示，不可被關閉

#### 匯出
- [ ] 點 Markdown 按鈕 → 下載 `paincard-{slug}-{YYYY-MM-DD}.md`
- [ ] 點 JSON 按鈕 → 下載 `paincard-{slug}-{YYYY-MM-DD}.json`
- [ ] 點 PDF 按鈕 → 5 秒內下載 `paincard-{slug}-{YYYY-MM-DD}.pdf`
- [ ] **Markdown 範本內含 `## 兩件事不能同時要 → 為什麼會被犧牲：{sacrificed_reason}`**
- [ ] **Markdown 範本不含任何分數區塊或分類學標籤**
- [ ] JSON 輸出完整 schema（含 sacrificed_reason）
- [ ] 匯出後 PainCard.exported.formats 正確 push 對應格式
- [ ] **不需要登入即可匯出**（嚴格驗收 — 違反此項即為嚴重 bug）

#### Verdict 路由
- [ ] judgment === 'true_pain' → 顯示「進入 PainMap App」primary CTA
- [ ] judgment === 'pending_interview' → 顯示「查看訪談對象」primary CTA
- [ ] judgment === 'fake_pain' → 顯示「換題目」primary CTA
- [ ] 三種 variant 背景色正確

#### Stage Handoff
- [ ] stage_2_block 在 fake_pain 時隱藏
- [ ] handoff_cta 在 pending_interview 時不顯示

#### Footer Actions
- [ ] 「重新填一張」→ 建立新 PainCard，舊的保留在 history
- [ ] 「查看舊身份證」→ `/learn/worksheet/history`（M2 預留）
- [ ] 「分享」→ 開啟 modal，使用者可選擇分享哪些欄位
- [ ] 「刪除本機資料」→ 開啟確認 modal

#### 反模式驗收（必須全部不出現）
- [ ] **無任何分數 UI / 雷達圖 / total_score 欄位**
- [ ] **無分類學標籤顯示**
- [ ] 慶祝動畫（紙花、煙火）
- [ ] 成就徽章 / 點數系統
- [ ] **強制登入匯出**
- [ ] **Pro 鎖定匯出格式**
- [ ] 「N 個人完成」社會比較

#### 禁用詞掃描
- [ ] 全頁面零出現「恭喜完成」「達成成就」「闖關成功」「Level Up」「升級 / 進階」（動詞）「你的痛點得分」「立即匯出」「快速分享」「需要登入才能匯出」「Pro 解鎖更多匯出格式」「總分」

#### 無障礙
- [ ] pain_id_card 用語意化 `<article>` 標籤
- [ ] 8 個 field 用 `<section>` + heading 階層
- [ ] export 按鈕有 aria-label 描述格式
- [ ] delete 確認 modal 焦點管理正確（trap focus）

#### RWD
- [ ] 三斷點佈局正確
- [ ] Mobile 下 next_step_cta primary 為 sticky bottom
- [ ] export 按鈕在 Mobile 垂直堆疊
