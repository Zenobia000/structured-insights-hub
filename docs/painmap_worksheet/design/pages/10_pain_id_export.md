# Page-Level Spec: Pain ID Export — 痛點身份證匯出

> 對應 worksheet「最後組合：你的痛點身份證」。  
> 整合 9 卡產出的整合視圖 + 三種匯出格式（Markdown / JSON / PDF）+ 依 verdict 動態的「下一步去哪」CTA。  
> 這是整套 worksheet 的 capstone — 使用者第一次看見「9 張卡片是同一個物件」的完整輸出。

---

## [PAGE META]

- **page_name**: Pain ID Export
- **route_path**: `/learn/worksheet/result`
- **page_type**: capstone_export
- **primary_goal**: 把 9 卡精華組合成「痛點身份證」視覺呈現 + 提供 Markdown / JSON / PDF 匯出 + 引導使用者依 verdict 走向對應下一步
- **secondary_goal**: 強化「資料主權」品牌敘事；建立「身份證 = 完成憑證」的 Accomplishment 體驗
- **target_users**:
  - 主要：完成 9 卡、第一次看到完整輸出的初學者
  - 次要：回頭重新查看舊痛點身份證的進階使用者
- **entry_point**: 卡 9 完成後自動跳轉；或從 stepper 點 result step
- **expected_time_on_page**: 5-15 分鐘（看完整身份證 + 選一種匯出 + 點擊下一步）
- **prev_card**: `/learn/worksheet/09`（卡 9：真假判斷）
- **next_step**: 依 verdict 動態（true_pain → PainMap App / fake_pain → 換題目 / pending_interview → 排訪談）

---

## [STRUCTURE: SECTIONS]

1. **stepper_context**
   - section_type: progress_stepper
   - section_purpose: 顯示 9 卡進度（current_step = 10，全部完成）
2. **completion_header**
   - section_type: capstone_header
   - section_purpose: 用沉穩語氣告訴使用者「你完成了判斷力訓練」（不慶祝，不徽章）
3. **pain_id_card**
   - section_type: identity_card_visual
   - section_purpose: 完整呈現痛點身份證（仿 worksheet ASCII 框架的視覺化版本）
4. **export_actions**
   - section_type: export_panel
   - section_purpose: 三種匯出格式 + 隱私聲明 + 「不需登入」確認
5. **next_step_cta**
   - section_type: next_action_router
   - section_purpose: 依 verdict.judgment 動態顯示對應 CTA（真 / 假 / 待訪談 三種路由）
6. **stage_handoff_panel**
   - section_type: stage_handoff
   - section_purpose: 與階段二（first-dollar sprint）的銜接連結 + 階段差異說明
7. **footer_actions**
   - section_type: footer_actions
   - section_purpose: 「重新填一張」「查看舊身份證」「分享」「刪除本機資料」次要操作

---

## [SECTION COMPONENT SPEC]

### Section: stepper_context

- **layout**: 全寬 sticky top，淺色背景，高度 56px
- **elements**:
  - stepper: CardProgressStepper / required / 9 個圓點全部 completed（Verified Green）+ 第 10 個 active（result 步驟）
  - back_link: TextLink Ghost / required / 「← 卡 9」/ -> `/learn/worksheet/09`
  - autosave_indicator: Caption Muted / required / 「資料只在你的本機 · HH:mm 最後更新」
- **states**: default
- **copy_constraints**: 不顯示「100% 完成」這類百分比；用「全部完成」或✓符號

### Section: completion_header

- **layout**: 全寬白底容器，padding 48px，最大寬 800px 置中
- **elements**:
  - icon: Icon / required / 🪪（中性 Teal 色，非慶祝符號）
  - title: H1 / required / 「你的痛點身份證」
  - subtitle: Body LG / required / 「9 卡的精華組合在這裡。看一遍，匯出一份，去做你的下一步。」
  - completion_meta: MetaPanel / required / 顯示完成 metadata
    - created_at: Caption / required / 「建立日期：YYYY-MM-DD」
    - updated_at: Caption / required / 「最後更新：YYYY-MM-DD HH:mm」
    - status_badge: StatusBadge / required / 動態顯示 PainCard.status：
      - `structured` → Verified Green「真痛點」
      - `pending_interview` → Caution Amber「待訪談」
      - `archived_fake` → Muted Gray「假痛點（已封存）」
  - epic_meaning_line: Body MD Italic / required / 「這份身份證裡沒有『錢』。階段一只訓練判斷力。」
- **states**: default
- **copy_constraints**: title ≤ 10 字；subtitle ≤ 50 字中文；不可使用「恭喜」「達成」「成就」「闖關成功」等遊戲化語言

### Section: pain_id_card

- **layout**: 全寬白底容器，最大寬 880px 置中；padding 40px；shadow-md；border 2px Primary Light；圓角 lg
- **elements**:
  - card_visual_frame: VisualFrame / required / 仿 worksheet 末尾 ASCII 框架的設計化版本：
    - top_decoration: HorizontalRule / 「═══════════════════════════════════」（裝飾線）
    - card_label: H2 / required / 「痛點身份證」（置中）
    - bottom_decoration: HorizontalRule / 同上
  - card_body: PainIdBody / required / 9 個欄位區塊垂直堆疊
    - field_protagonist:
      - label: H3 / required / 「主人翁」
      - content: Body LG / required / 從 `PainCard.people.list[0]` 顯示「{name}（{relation}）」
    - field_scene:
      - label: H3 / required / 「場景」
      - content: Body LG / required / 整合 `PainCard.complaint` + `PainCard.stuck_formula.ai_polished`：
        - 第一行：complaint.verbatim（≤ 200 字截斷）
        - 第二行：「卡關公式：{stuck_formula.ai_polished 或 user_draft}」
    - field_workaround:
      - label: H3 / required / 「他現在怎麼解」
      - content: Body MD / required / 從 `PainCard.workaround.tool_name` 顯示
      - dissatisfactions: List / required / 從 `PainCard.workaround.user_dissatisfactions` 顯示前 3 項
    - field_contradiction:
      - label: H3 / required / 「兩件事不能同時要」
      - content: Body MD / required / 從 `PainCard.contradiction` 顯示：
        - triz_label: TRIZ 標籤（如「想客製化但又想規模化」）
        - side_a / side_b 各一行
        - sacrificed: 「他通常會犧牲：{a 或 b 的內容}」
    - field_ai_evidence:
      - label: H3 / required / 「AI 找到的關鍵證據」
      - content: Body MD / required / 從 `PainCard.self_guess.pain_judgment_table` 顯示精華（前 5 行 + 「展開完整判斷表 ▼」按鈕）
      - extra: Caption / required / 「AI 工具：{ai_evidence.ai_tool}」
    - field_self_guess_delta:
      - label: H3 / required / 「我自己猜 vs AI 答的差異」
      - content: List / required / 從 `PainCard.self_guess.deltas` 顯示 3 個 delta：
        - 「最大差異：{biggest_diff}」
        - 「AI 補了：{ai_added}」
        - 「我猜但 AI 沒支持：{guess_unsupported}」
    - field_interview:
      - label: H3 / required / 「我會優先訪談」
      - content: Body MD / required / 從 `PainCard.interview_plan.targets[0]` 顯示
      - questions: List / required / 從 `PainCard.interview_plan.questions[0..2]` 顯示 3 題
    - field_verdict:
      - label: H3 / required / 「我的判斷」
      - content: VerdictDisplay / required / 顯示
        - judgment_badge: 大字 Body LG / 動態：
          - `true_pain` → ✓ 真痛點（Verified Green）
          - `fake_pain` → ✗ 假痛點（Muted Gray）
          - `pending_interview` → ? 待訪談（Caution Amber）
        - reason_full: Body MD / 從 `PainCard.verdict.reason_100w` 顯示完整 100+ 字
        - most_confident: Caption / 「最有把握：{most_confident_evidence}」
        - least_confident: Caption / 「最沒把握：{least_confident}」
    - field_pain_quality（**僅在 mode === 'teaching' 顯示**）:
      - label: H3 / required / 「Pain Quality（5 維度反思）」
      - content: Body MD / 顯示 total_score「{total_score} / 25」+ 5 維度小列表
      - teaching_note: Caption Italic / required / 「分數只是工具，不是答案。」
    - field_next_action:
      - label: H3 / required / 「下一步」
      - content: Body LG / required / 動態文字依 `verdict.next_action`：
        - `interview` → 「訪談卡 8 的對象」
        - `more_evidence` → 「退回卡 6 找更多證據」
        - `change_topic` → 「換題目重新填一輪」
  - card_footer:
    - signature_line: Caption / required / 「═══════════════════════════════════」
    - meta_dates: Caption / required / 「建立：{created_at} ｜ 最後檢核：{updated_at}」
- **states**:
  - default: 全部欄位展開
  - collapsed_views: 使用者可點 `field_ai_evidence.extra` 等展開完整判斷表
  - production_mode: field_pain_quality 隱藏
- **copy_constraints**: 不可使用「分數」「等級」「排名」UI 元素；teaching_note 不可省略

### Section: export_actions

- **layout**: 全寬白底容器，最大寬 800px 置中；padding 32px
- **elements**:
  - section_title: H2 / required / 「匯出你的身份證」
  - section_subtitle: Body MD / required / 「資料只在你本機。匯出後請自己保存。」
  - export_buttons: ExportButtonGroup / required / 3 個按鈕並排（共用元件 `design/components/verdict_export.md`）
    - export_markdown:
      - icon: 📄
      - label: Body Bold / required / 「Markdown」
      - description: Caption / required / 「給 Notion / GitHub / 部落格用」
      - file_extension: `.md`
      - cta: Button Secondary / required / 「下載 .md」
      - format_preview: PopoverPreview / optional / hover 顯示前 20 行預覽
    - export_json:
      - icon: 🔧
      - label: Body Bold / required / 「JSON」
      - description: Caption / required / 「跨工具搬移、備份、給開發者用」
      - file_extension: `.json`
      - cta: Button Secondary / required / 「下載 .json」
    - export_pdf:
      - icon: 📑
      - label: Body Bold / required / 「PDF」
      - description: Caption / required / 「列印、面對面討論」
      - file_extension: `.pdf`
      - cta: Button Secondary / required / 「下載 .pdf」
  - filename_format: Caption Muted / required / 「檔名：paincard-{slug}-{YYYY-MM-DD}.{ext}」
  - privacy_statement: PrivacyCallout / required /
    - icon: 🔒
    - title: 「你的資料主權」
    - body:
      - 「所有資料只在你的瀏覽器 LocalStorage」
      - 「我們沒有伺服器收集你的痛點」
      - 「不需要登入、不需要帳號、不需要 Email」
      - 「匯出後你完全自管」
    - learn_more_link: TextLink / optional / 「資料隱私詳情」/ -> `/privacy`
- **states**:
  - default: 3 個按鈕並排
  - exporting: 點擊後按鈕顯示 spinner + 「準備中...」
  - exported: 下載完成後 toast 顯示「已下載 paincard-xxx.md」
  - error: 下載失敗顯示「下載失敗，請重試」+ 重試按鈕
- **copy_constraints**: 不可使用「立即匯出」「快速分享」（FOMO）；不可在匯出按鈕旁顯示「需登入」「升級 Pro 才能匯出」

### Section: next_step_cta

- **layout**: 全寬，最大寬 800px 置中；padding 40px；背景色依 verdict 動態
  - `true_pain` → Verified Light Green 背景
  - `pending_interview` → Caution Light Amber 背景
  - `fake_pain` → Muted Gray 背景
- **elements**:
  - section_title: H2 / required / 「下一步去哪？」
  - dynamic_cta_card: DynamicCtaCard / required / 依 verdict 動態渲染 3 種變體
    - variant_true_pain（`judgment === 'true_pain'`）:
      - status_message: Body LG / required / 「你判定這是真痛點。」
      - reasoning: Body MD / required / 「卡 8 的訪談對象排起來，現場確認後，可以進入 PainMap App 進階版繼續分析。」
      - primary_cta: Button Primary Large / required / 「進入 PainMap App →」/ -> `/app/start?import_paincard={id}`
      - secondary_cta: Button Ghost / required / 「先去訪談（卡 8 對象）」/ -> 顯示訪談對象列表 modal
      - tertiary_link: TextLink / optional / 「我想再回顧一次」/ -> `/learn/worksheet/01`（保留資料）
    - variant_pending_interview（`judgment === 'pending_interview'`）:
      - status_message: Body LG / required / 「你還無法判斷，這是最常見的結果，很正常。」
      - reasoning: Body MD / required / 「訪談 2-3 人後回來重新打分。通常訪談完，真假就會浮出來。」
      - primary_cta: Button Primary Large / required / 「查看訪談對象 →」/ -> 顯示訪談對象 modal + 連結到行事曆
      - secondary_cta: Button Ghost / required / 「訪談完後回來重打分」/ -> `/learn/worksheet/09`
      - tertiary_link: TextLink / optional / 「先看看其他人的痛點身份證」/ -> `/atlas`（社群）
    - variant_fake_pain（`judgment === 'fake_pain'`）:
      - status_message: Body LG / required / 「你判定這是假痛點。」
      - reasoning: Body MD / required / 「不要難過。這就是這份卡片的價值 — 幫你省下 3 個月走錯路的時間。換題目，從卡 1 重新填。」
      - primary_cta: Button Primary Large / required / 「換題目，從卡 1 開始 →」/ -> `/learn/worksheet/01?new=true`
      - secondary_cta: Button Ghost / required / 「保留這張作為學習紀錄」/ -> 寫入 archived_fake，列入歷史
      - tertiary_link: TextLink / optional / 「為什麼這是好結果？」/ 開啟側邊 Drawer 顯示 worksheet 「如果你判定是假痛點」段落
- **states**:
  - default: 依 verdict 渲染對應 variant
  - hover: primary_cta 微妙 scale(1.02)
  - clicked_secondary: 對應 modal / drawer 開啟
- **copy_constraints**: 假痛點變體不可用「失敗」「不對」等貶義詞；用 worksheet 原文「省下 3 個月走錯路的時間」這類賦權語

### Section: stage_handoff_panel

- **layout**: 全寬白底容器，最大寬 800px 置中；padding 32px；border 1px Border Default
- **elements**:
  - section_title: H2 / required / 「階段一 vs 階段二：你在哪？」
  - stage_diagram: VisualDiagram / required / 兩階段視覺對照
    - stage_1_block:
      - title: Body Bold / required / 「階段一：判斷力訓練（這份）」
      - completion_indicator: Verified Badge / required / 「✓ 你已完成」
      - description: Body MD / required / 「9 張卡片，30-90 分鐘。產出：真假判斷的書面交付。不需要：寫程式、收錢、做產品。」
    - arrow: Icon / required / ↓（連接）
    - stage_2_block:
      - title: Body Bold / required / 「階段二：商業驗證（後續）」
      - status_indicator: ConditionalBadge / required / 動態：
        - true_pain → Caution Amber「待開始」
        - pending_interview → Muted Gray「先訪談再評估」
        - fake_pain → Hidden（不顯示，避免誤導）
      - description: Body MD / required / 「72 小時 sprint。產出：第一筆真實付款。讀：first_principles_sprint_manual.md」
  - handoff_cta: ConditionalCta / required / 動態
    - true_pain → Button Secondary / 「了解階段二（first-dollar sprint）→」/ -> `/docs/first-dollar-sprint`
    - pending_interview → 不顯示（先訪談）
    - fake_pain → 不顯示
  - why_two_stages: CalloutBox Info / optional /
    - icon: 💡
    - body: 「為什麼分階段？因為『痛點是不是真的』和『能不能賺錢』是兩個不同問題。階段一沒過 → 階段二一定會失敗。」
- **states**:
  - default: 依 verdict 顯示對應狀態
  - true_pain: stage_2_block 顯示 「待開始」
  - pending_interview: stage_2_block 顯示 「先訪談再評估」
  - fake_pain: stage_2_block 隱藏（避免誤導使用者繼續）
- **copy_constraints**: 不可暗示「階段二一定要做」（白帽 — 使用者自由選擇）；不可使用「升級到階段二」（遊戲化等級暗示）

### Section: footer_actions

- **layout**: 全寬，最大寬 800px 置中；padding 24px；背景 BG Muted
- **elements**:
  - secondary_action_group: ActionGroup / required / 4 個次要操作橫排（Desktop）/ 堆疊（Mobile）
    - action_new:
      - icon: ➕
      - label: TextLink / required / 「重新填一張新身份證」/ -> `/learn/worksheet/01?new=true`
      - hint: Caption / required / 「這張會保留，新的另存」
    - action_history:
      - icon: 📚
      - label: TextLink / required / 「查看我的舊身份證」/ -> `/learn/worksheet/history`
      - hint: Caption / required / 「LocalStorage 保留所有歷史」
    - action_share:
      - icon: 🔗
      - label: TextLink / required / 「分享身份證」/ 開啟分享 modal
      - hint: Caption / required / 「複製連結 / 匯出後分享 .md」
    - action_delete:
      - icon: 🗑️
      - label: TextLink Danger / required / 「刪除本機資料」/ 開啟確認 modal
      - hint: Caption / required / 「資料主權 — 隨時可刪」
  - share_modal: ShareModal / conditional / 點 action_share 開啟
    - share_options: List / required
      - 「複製可分享連結（短網址，僅分享你選的欄位）」
      - 「下載 .md 後手動分享」
      - 「轉成圖片（生成中... M2 範圍）」
    - privacy_warning: CalloutBox Warning / required / 「分享連結預設不包含 5 維度評分（生產模式輸出規則 R4.2）。要包含分數嗎？」
    - share_field_selector: CheckboxGroup / required / 讓使用者選哪些欄位要分享（預設只勾 verdict.judgment + reason_100w）
  - delete_confirm_modal: DeleteConfirmModal / conditional / 點 action_delete 開啟
    - title: H2 / required / 「真的刪除這份痛點身份證？」
    - body: Body MD / required / 「資料只在你的本機。刪除後無法復原。建議先匯出再刪除。」
    - export_first_button: Button Secondary / required / 「先匯出 .md 再刪」
    - confirm_button: Button Danger / required / 「我已備份，刪除」
    - cancel_button: Button Ghost / required / 「取消」
- **states**:
  - default: 4 個 action 平排
  - share_modal_open: 顯示分享選項 + 欄位選擇器
  - delete_modal_open: 顯示確認對話框
- **copy_constraints**: 「刪除本機資料」按鈕用 Danger 色（紅）— 但僅限這個 destructive action，全頁其他地方禁用紅色

---

## [INTERACTION & STATE FLOW]

### 主要互動流程

1. 頁面載入 → 從 LocalStorage 讀取 PainCard，從 settings 讀取 display_mode
2. 渲染完整 pain_id_card（依 PainCard 9 個欄位填入）
3. 使用者點 export 按鈕 → 觸發對應格式生成：
   - Markdown：用 template 字串組合 9 卡資料 + worksheet 框架
   - JSON：直接 `JSON.stringify(PainCard, null, 2)`
   - PDF：使用 jsPDF 或 React-PDF 將 pain_id_card DOM 轉 PDF
4. 下載完成 → toast 通知 + 寫入 `PainCard.exported.formats` + `PainCard.exported.exported_at`
5. 使用者點 next_step_cta primary 按鈕 → 依 verdict 路由：
   - true_pain → 跳 `/app/start?import_paincard={id}`（帶 PainCard ID 給 PainMap App 接管）
   - pending_interview → 開啟訪談對象 modal
   - fake_pain → 跳 `/learn/worksheet/01?new=true`（保留舊資料，建立新 PainCard）

### 匯出格式詳細規格

#### Markdown 格式

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
- 類型：{contradiction.triz_label}
- A 端：{contradiction.side_a}
- B 端：{contradiction.side_b}
- 通常犧牲：{sacrificed_label}

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

## Pain Quality（5 維度反思，僅教學模式）
- 人群具體度：{score}/5
- 發生頻率：{score}/5
- 痛苦強度：{score}/5
- 現有解法不滿：{score}/5
- 證據可信度：{score}/5
- 總分：{total_score}/25

> 分數只是工具，不是答案。

## 下一步
{next_action_label}
```

**生產模式下**：Pain Quality 區塊整段不輸出。

#### JSON 格式

直接輸出完整 PainCard 物件（包含 verdict.scores），檔名 `paincard-{slug}-{YYYY-MM-DD}.json`。

**對外分享連結時**：依 R4.1 規則過濾 verdict.scores + total_score。

#### PDF 格式

- A4 一頁版（適合列印）
- 字體：Noto Sans TC
- 結構同 Markdown
- 教學模式才包含 Pain Quality 區塊

### 自動儲存策略

- 進入此頁時，PainCard.current_step 已 = 10（卡 9 過關時寫入）
- 匯出時更新 `PainCard.exported.formats` (push 對應格式) + `PainCard.exported.exported_at`
- 不修改其他欄位（這頁是 read-only view + export action）

### RWD 行為差異

| 斷點 | 佈局 | 差異說明 |
| --- | --- | --- |
| Desktop (>1280px) | pain_id_card 全寬展示；export 3 按鈕並排；footer 4 actions 並排 | 完整體驗 |
| Tablet (768-1280px) | 同 Desktop；export 按鈕縮小 | — |
| Mobile (<768px) | pain_id_card padding 減半；export 3 按鈕垂直堆疊；footer 改為 2x2 grid | next_step_cta primary 改為固定底部 sticky |

---

## [DATA & API]

- **uses_api**: false（MVP 階段全部 LocalStorage）
- **localstorage_keys**:
  - `painmap_worksheet:cards`（讀取整個 PainCard）
  - `painmap_worksheet:settings.display_mode`（讀取教學 / 生產模式）
- **data_paths_read**: 全部 PainCard 欄位（這頁是整合 view）
- **data_paths_written**:
  - `PainCard.exported.formats` (push 'markdown' / 'json' / 'pdf')
  - `PainCard.exported.exported_at` (ISO8601)
  - `PainCard.exported.last_review_at` (進入此頁時更新)
- **匯出檔名規則**: `paincard-{slug}-{YYYY-MM-DD}.{ext}`，slug = `complaint.verbatim` 前 20 字（移除特殊字符 + 取代空格為 `-`）
- **error_cases**:
  - PainCard 不完整（卡 1-9 任一未填）→ 顯示「資料不完整，請先回到卡 N」+ 不可離開
  - 匯出失敗（瀏覽器封鎖下載）→ 顯示「下載被瀏覽器封鎖，請允許下載 painmap.com」+ 重試
  - PDF 生成超時（> 5 秒）→ 顯示「PDF 產生中，請稍候」spinner

---

## [EXIT GATE（這頁不適用「過關」概念）]

此頁是 capstone view，不是「卡片」，所以**沒有 exit_gate 過關條件**。

但有以下「進入此頁的前置條件」：

| # | 前置條件 | 自動判定 |
| :- | :--- | :--- |
| 1 | PainCard.current_step === 10 | LocalStorage 讀取 |
| 2 | PainCard.verdict.judgment 非 null | LocalStorage 讀取 |
| 3 | PainCard.verdict.reason_100w.length >= 100 | LocalStorage 讀取 |

任一不滿足 → 自動 redirect 回對應卡片頁。

---

## [AI INTEGRATION]

### AI 介入策略

| 項目 | 是否使用 AI | 說明 |
| :--- | :--- | :--- |
| 自動產生 Markdown 摘要 | ❌ 不做 | Markdown 是固定 template，不需 AI |
| AI 美化身份證視覺 | ❌ 不做 | 沉穩、結構化即可，不需花俏 |
| 推薦下一步 | ❌ 不做 | 由 verdict.next_action 決定，不由 AI 決定 |
| 連結到階段二的智能引導 | ❌ M1 不做 | M2 範圍：可考慮加「依痛點類型推薦階段二案例」，但須符合白帽原則 |

### worksheet 鐵律對應

| Worksheet 鐵律 | 軟體實作 |
| :--- | :--- |
| 「這份身份證裡沒有錢」 | 全頁不顯示任何貨幣 / 收入 / 商業數字 |
| 「階段一只訓練判斷力」 | stage_handoff_panel 明確區分階段 |
| 「換題目，從卡 1 重新填」（假痛點時）| variant_fake_pain primary_cta 直接連到卡 1 |

---

## [OCTALYSIS HOOKS]

### 主驅動力：#2 Development & Accomplishment（發展與成就）

**設計實作**：
- pain_id_card 視覺呈現 = 「完成憑證」的 capstone moment（仿身份證形式強化「正式文件」感）
- stepper 顯示 9 卡全部 ✓ + 第 10 步 active
- completion_header 用沉穩「你的痛點身份證」非興奮的「恭喜完成」
- export_actions 3 種格式 = 「你可以帶走的成果」

**為什麼是 #2 而非 #1**：使命感（Epic Meaning）在卡 8 已經做完；卡 10 的核心是「看見自己完成的東西」— 這是 Accomplishment 的純粹體現。

**反模式禁令**：
- ❌ 不撒紙花動畫
- ❌ 不發徽章
- ❌ 不解鎖「完成 3 張身份證的成就」
- ❌ 不用「Level Up」字眼

### 副驅動力：#4 Ownership & Possession（資料主權）

**設計實作**：
- privacy_statement 強調「你的資料只在你本機」
- 三種匯出格式 = 「你完全自管」的展現
- footer_actions 提供「刪除本機資料」 = Ownership 的終極形式
- next_step_cta 不強推 PainMap App，給「先去訪談」「再回顧」等多選項

**「Ownership = 資料主權」的限定**：
- ✅ 可用「你的身份證」「你的判斷」「你的資料」這類敘事
- ❌ 不可用「IKEA 效應」（如「你已經填了 9 張卡片，不要放棄繼續做產品」）
- ❌ 不可用「沉沒成本」綁架（如「不繼續會浪費你的努力」）

### 副驅動力：#5 Social Influence & Relatedness（限定使用）

**設計實作**：
- action_share 提供分享身份證功能（白帽社交，不是炫耀）
- 階段二可選擇進入 Pain Atlas 社群（M2 範圍）

**Social 限定**：
- ✅ 可分享身份證連結（白帽：「我做了這份判斷，給你看」）
- ❌ 不可顯示「N 個人覺得你的判斷準確」（社會比較焦慮）
- ❌ 不可顯示「同類痛點排行榜」
- ❌ 分享連結預設不包含 5 維度評分（避免異化為比較工具）

### 永久禁用驅動力

| 驅動力 | 為什麼這裡會誘惑出現 | 守則 |
| :--- | :--- | :--- |
| #6 Scarcity & Impatience | 「24 小時內進入階段二有獎勵」 | 完全不出現 |
| #7 Unpredictability | 「驚喜身份證模板」 | 完全不出現 |
| #8 Loss Avoidance | 「不匯出資料明天會消失」 | 完全不出現；LocalStorage 永久保留 |

### 反模式檢查清單（卡 10 最容易犯）

- ❌ 慶祝動畫（紙花、煙火、勝利音效）
- ❌ 「成就解鎖」徽章 / 點數
- ❌ 「分享得 X 點」
- ❌ 「你是第 N 位完成的使用者」（社會比較）
- ❌ 「身份證收藏冊」（IKEA 收集誘導）
- ❌ 「強制登入才能匯出」（**最嚴重反模式 — 違反資料主權**）
- ❌ 「Pro 才能匯出 PDF」（功能勒索）
- ❌ 「每月只能匯出 1 次」（人為稀缺）
- ❌ 跨身份證比較「你之前的判斷準確嗎」

詳見 `references/anti_gamification_guardrails.md`。

---

## [EXCEPTION TO GLOBAL RULES]

- **「刪除本機資料」按鈕用 Danger 色（紅）**：違反全域「紅色僅用於系統錯誤」原則。理由：destructive action（刪除）是少數應該用紅色警示的場景；但僅限這一個按鈕。
- **pain_id_card 使用裝飾線「═══════════════════════════════════」**：違反「結構優於裝飾」原則。理由：這是仿 worksheet 末尾 ASCII 框架的設計化呈現，是內容的一部分（向 worksheet 致敬），不是裝飾。
- **PDF 匯出可能花 3-5 秒**：違反全域「互動響應 < 100ms」原則。理由：PDF 生成本質上需要時間；用 spinner 處理，不影響其他互動。
- **next_step_cta 使用三種背景色（依 verdict）**：違反「BG Surface 統一白底」原則。理由：判定結果的視覺差異需要強烈對比，幫助使用者一眼看出自己的路徑。

---

## [BRAND LANGUAGE RULES (PAGE-SPECIFIC)]

### 禁止用語

| 禁止 | 理由 |
| :--- | :--- |
| 「恭喜完成」「達成成就」「闖關成功」 | 遊戲化 — 違反 brand |
| 「Level Up」「升級」「進階」（作為動詞） | 等級制 — 違反 brand |
| 「你的痛點得分」（公開頁面） | 違反生產模式輸出規則 R4.2 |
| 「立即匯出」「快速分享」 | FOMO — 違反 brand |
| 「需要登入才能匯出」 | 違反資料主權 — 嚴重反模式 |
| 「Pro 解鎖更多匯出格式」 | 功能勒索 — 違反 brand |
| 「分享後可獲得 X 點」 | 遊戲化禁令 |
| 「你是第 N 位完成」 | 社會比較焦慮 |

### 建議用語

| 建議 | 場景 |
| :--- | :--- |
| 「你的痛點身份證」 | 主敘事 |
| 「9 卡的精華組合」 | 整合視圖描述 |
| 「資料只在你本機」 | 隱私聲明 |
| 「你完全自管」 | 資料主權 |
| 「下一步去哪」 | next_step_cta |
| 「省下 3 個月走錯路的時間」 | 假痛點賦權語（worksheet 原文） |

### 語調

- **Calm capstone**：完成是沉穩的事實，不是興奮的成就
- **Empowering**：強調「你來判斷 + 你的資料」
- **Anti-anxiety**：fake_pain 不是失敗，是節省時間
- **Honest**：明確告訴使用者「階段二的 first-dollar 是另一回事」

---

## [ACCEPTANCE CRITERIA]

### 通用驗收

- 7 個 Section 依序正確渲染，stepper 顯示 9 卡 ✓ + 第 10 步 active
- pain_id_card 完整顯示 9 卡精華（無欄位缺失）
- completion_header 不出現任何慶祝動畫 / 徽章 / 點數
- privacy_statement 強制顯示，不可被關閉

### 匯出驗收

- 點 Markdown 按鈕 → 下載 `paincard-{slug}-{YYYY-MM-DD}.md`
- 點 JSON 按鈕 → 下載 `paincard-{slug}-{YYYY-MM-DD}.json`
- 點 PDF 按鈕 → 5 秒內下載 `paincard-{slug}-{YYYY-MM-DD}.pdf`
- 匯出後 PainCard.exported.formats 正確 push 對應格式
- PainCard.exported.exported_at 正確寫入 ISO8601
- **不需要登入即可匯出**（嚴格驗收 — 違反此項即為嚴重 bug）

### Verdict 路由驗收

- judgment === 'true_pain' → next_step_cta 顯示「進入 PainMap App」primary CTA
- judgment === 'pending_interview' → next_step_cta 顯示「查看訪談對象」primary CTA
- judgment === 'fake_pain' → next_step_cta 顯示「換題目」primary CTA
- 三種 variant 的背景色正確（Verified Light / Caution Light / Muted）

### Stage Handoff 驗收

- stage_2_block 在 fake_pain 時隱藏（避免誤導）
- handoff_cta 在 pending_interview 時不顯示（先訪談）
- 階段二連結正確指向 first_principles_sprint_manual.md

### Footer Actions 驗收

- 「重新填一張」→ 建立新 PainCard，舊的保留在 history
- 「查看舊身份證」→ `/learn/worksheet/history`（M2 範圍可預留）
- 「分享」→ 開啟 modal，預設不勾選分享 5 維度評分
- 「刪除本機資料」→ 開啟確認 modal，提示先匯出

### 教學 / 生產模式驗收

- mode === 'teaching' → field_pain_quality 顯示
- mode === 'production' → field_pain_quality 隱藏
- 切換模式不影響 export 行為（生產模式分享連結仍過濾分數）

### 反模式驗收（必須全部不出現）

- 慶祝動畫（紙花、煙火）
- 成就徽章 / 點數系統
- 強制登入匯出
- Pro 鎖定匯出格式
- 「N 個人完成」社會比較
- 收藏冊 IKEA 誘導
- 跨身份證比較

### 無障礙驗收

- pain_id_card 用語意化 `<article>` 標籤
- 9 個 field 用 `<section>` + heading 階層
- export 按鈕有 aria-label 描述格式
- delete 確認 modal 焦點管理正確（trap focus）

### RWD 驗收

- 三斷點佈局正確
- Mobile 下 next_step_cta primary 為 sticky bottom
- export 按鈕在 Mobile 垂直堆疊
