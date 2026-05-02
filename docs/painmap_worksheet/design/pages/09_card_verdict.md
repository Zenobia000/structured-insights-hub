# Page-Level Spec: Card 9 — Pain Quality Score + 真假判斷

> 對應 worksheet「卡片 9 ｜ Pain Quality Score + 真假痛點判斷」。  
> **這是整套 worksheet 最敏感的頁面**：5 維度評分 + 真假判斷的書面理由，必須嚴格區分「教學模式」與「生產模式」。  
> AI 在這張卡是**完全禁用**的（worksheet 鐵律：判斷必須人為書面）。

---

## [PAGE META]

- **page_name**: Card 9 — Pain Quality Score & Verdict
- **route_path**: `/learn/worksheet/09`
- **page_type**: worksheet_card_critical
- **primary_goal**: 引導使用者完成 5 維度反思評分（教學模式）+ 書面真假判斷（≥ 100 字）+ 下一步行動選擇
- **secondary_goal**: 訓練「分數只是工具，不是答案」的認知；建立「書面判斷」的職業習慣
- **target_users**:
  - 主要：完成卡 1-8、第一次寫真假判斷的初學者
  - 次要：教師 / coach 用「教學模式」帶學員（顯示 5 維度反思）
  - 第三：產品團隊用「生產模式」做痛點 inbox 篩選（只看 status，不看分數）
- **entry_point**: 卡 8 完成後自動推進
- **expected_time_on_page**: 20-40 分鐘（書面判斷 ≥ 100 字需要思考時間）
- **prev_card**: `/learn/worksheet/08`（卡 8：訪談規劃）
- **next_card**: `/learn/worksheet/result`（痛點身份證匯出）

---

## [CRITICAL DESIGN: TEACHING MODE vs PRODUCTION MODE]

### 為什麼這張卡需要兩種模式

worksheet 卡 9 包含一個 0-25 的「Pain Quality Score」分數帶，但 PainMap brand 鐵律明確禁止「分數 / 等級 / 排名」UI（`painmap_brand_system.md` L24-30）。

這不是矛盾，而是**情境差異**：

| 情境 | 分數的角色 | UI 呈現 |
| :--- | :--- | :--- |
| **教學情境**（線下工作坊、自學初學者）| 分數是反思鏡子 — 「我為什麼給人群具體度 2 分？」這個問題本身比答案更重要 | 顯示 5 維度 × 1-5 分 + 教學提示 |
| **生產情境**（在 PainMap App 內看痛點 inbox、Pain Atlas 集體痛點庫）| 分數會異化為「品質排名」，違反 brand「結構優於評分」原則 | 只顯示 status enum，永不顯示數字 |

### 模式切換規則

- URL query: `?mode=teaching` 或 `?mode=production`
- 預設值：`teaching`（worksheet 是「初學者教學工具」，預設模式應符合此定位）
- 模式狀態存於 LocalStorage `painmap_worksheet:settings.display_mode`，session-level
- **資料層永遠相同**：`PainCard.verdict.scores` + `total_score` 一定會存（因為使用者要做反思），只是 UI 是否呈現的差異

### 嚴重反模式（紅線禁令）

以下行為**永久禁止**，無論在哪種模式：

| 反模式 | 為什麼禁 | 替代 |
| :--- | :--- | :--- |
| 把 0-25 分轉換為 A-F 等級 | 學校式評判 — 違反 brand | 用 `judgment` enum |
| 顯示「平均使用者得 X 分」 | 社會比較焦慮 | 不顯示他人分數 |
| 痛點分數排行榜（高分痛點榜） | 競爭焦慮 + 違反 brand | Pain Atlas 用「最近活動 / 最多共鳴」排序 |
| 推送通知「你的痛點得分提升了」| 製造焦慮 + streak 黑帽 | 不推送任何分數變化通知 |
| API 對外回傳 `verdict.scores`（生產模式） | 違反 R4.1 規則 | 過濾掉，只回傳 `judgment` |
| 公開分享連結顯示分數 | 違反 R4.2 規則 | 只顯示 `judgment` + `reason_100w` |
| 把 5 維度評分做成可愛的進度條 / 雷達圖（生產模式） | 美化 = 鼓勵分享 = 異化為比較 | 用文字描述「基於 5 維度反思的判斷」 |
| 「你的 Pain Quality 提升了 +3 分」每日通知 | 黑帽遊戲化 | 不推送 |

### 與 PainCardStatus 的對應

| `verdict.judgment` | 預期 `PainCard.status` | 後續路由 |
| :--- | :--- | :--- |
| `true_pain` | `structured` | 卡 10（匯出）→ PainMap App |
| `pending_interview` | `pending_interview` | 卡 10 → 排訪談後回來重打 |
| `fake_pain` | `archived_fake` | 卡 10 → 換題目（從卡 1 重來）|

---

## [STRUCTURE: SECTIONS]

1. **stepper_context**
   - section_type: progress_stepper
   - section_purpose: 顯示 9 卡進度（current_step = 9，最後一張）
2. **card_intro**
   - section_type: card_header
   - section_purpose: 強調「這是這份填空簿的唯一交付物」+ AI 禁用聲明
3. **mode_indicator**
   - section_type: mode_banner
   - section_purpose: 明確顯示當前是「教學模式」或「生產模式」+ 可切換
4. **scores_form**（teaching 模式專屬，production 模式隱藏）
   - section_type: reflection_scoring
   - section_purpose: 5 維度 × 1-5 分反思評分 + 教學提示「分數只是工具」
5. **scores_summary**（production 模式專屬，teaching 模式合併到 scores_form 底部）
   - section_type: status_indicator
   - section_purpose: 只顯示「已完成 5 維度反思」狀態指示，不顯示數字
6. **judgment_form**
   - section_type: critical_decision_form
   - section_purpose: 真假判斷單選 + ≥ 100 字書面理由 + most_confident / least_confident / next_action
7. **exit_gate**
   - section_type: exit_gate
   - section_purpose: 過關條件勾選 + 「查看你的痛點身份證」CTA

---

## [SECTION COMPONENT SPEC]

### Section: stepper_context

- **layout**: 全寬 sticky top，淺色背景，高度 56px
- **elements**:
  - stepper: CardProgressStepper / required / 9 個圓點，第 9 個 active（同時是 last step）
  - back_link: TextLink Ghost / required / 「← 卡 8」/ -> `/learn/worksheet/08`
  - autosave_indicator: Caption Muted / required / 「已自動儲存於本機 · HH:mm」
- **states**: default
- **copy_constraints**: 不顯示百分比；不顯示「最後一關」這種戲劇化文案

### Section: card_intro

- **layout**: 全寬白底容器，padding 32px，最大寬 800px 置中
- **elements**:
  - card_label: Caption / required / 「卡片 9 / 9」
  - title: H1 / required / 「真假痛點的書面判斷」
  - one_liner: Body LG / required / 「走到這裡，你要做的只有一件事：書面回答『這是真痛點還是假痛點？為什麼？』」
  - ai_disabled_banner: AlertBanner Critical / required /
    - icon: 🚫
    - title: 「這張卡片 AI 完全不參與」
    - body: 「真假判斷是這套訓練的唯一交付物。AI 可以幫你蒐集證據（卡 6）、整理表（卡 7）、模擬訪談（卡 8），但『真的嗎』『值得嗎』這兩題永遠是你來判。」
  - delivery_reminder: CalloutBox Empowering / required /
    - icon: 🪪
    - title: 「這份填空簿的唯一交付物」
    - body: 「你不需要做產品、不需要架網站、不需要收錢。你只需要交出這個書面判斷。」
- **states**: default
- **copy_constraints**: title ≤ 14 字；one_liner ≤ 70 字中文；ai_disabled_banner 不可省略

### Section: mode_indicator

- **layout**: 全寬橫條，padding 12px，最大寬 800px 置中；teaching 模式：Verified Light 綠底；production 模式：Primary Light 藍底
- **elements**:
  - mode_label: Body Bold / required / 動態顯示
    - teaching: 「📖 教學模式（顯示 5 維度反思評分）」
    - production: 「📦 生產模式（只顯示判斷狀態，不顯示分數）」
  - mode_explanation: Body SM / required /
    - teaching: 「分數是讓你反思『為什麼給這個維度 X 分？』，不是答案。」
    - production: 「在 PainMap App 內，痛點以狀態分類，不以分數排名。」
  - switch_link: TextLink / optional / 動態
    - teaching → 顯示「切到生產模式 →」
    - production → 顯示「切到教學模式 →」
  - mode_persistence: HiddenLogic / required / 模式狀態寫入 LocalStorage `painmap_worksheet:settings.display_mode`
- **states**:
  - teaching: 綠底，顯示反思導向文案
  - production: 藍底，顯示狀態導向文案
- **copy_constraints**: 不可使用「進階模式 / 簡單模式」這種隱含優劣的詞；用「教學 / 生產」明確功能差異

### Section: scores_form（teaching 模式專屬）

- **layout**: 全寬白底容器，最大寬 800px 置中；padding 32px；只在 mode === 'teaching' 時顯示
- **elements**:
  - section_title: H2 / required / 「第一步：5 維度反思評分」
  - section_subtitle: Body MD / required / 「這 5 個維度幫你檢視卡 1-8 的證據強度。每個維度問自己：『我為什麼給這個分數？』」
  - score_dimensions: ScoreDimension[5] / required
    - dimension_1_people_specificity:
      - dimension_label: H3 / required / 「人群具體度」
      - dimension_subtitle: Body SM / required / 「我對痛點主人翁的描述有多具體？」
      - level_descriptions: LevelDescriptor[3] / required（不是 5 個按鈕，而是 3 個描述 + 中間插值）
        - level_1: Body SM / required / 「1 分：只知道大概族群（如『上班族』）」
        - level_3: Body SM / required / 「3 分：知道是哪群但說不出名字」
        - level_5: Body SM / required / 「5 分：能說清楚職位、場景、任務」
      - score_input: SegmentedScale / required / 1-5 分（5 個按鈕）
        - data_path: `verdict.scores.people_specificity`
      - reflection_prompt: Caption / required / 「你給 X 分，因為什麼？」（只是引導，不存資料）
    - dimension_2_frequency: 結構同 dimension_1
      - label: 「發生頻率」
      - subtitle: 「他多常遇到這個問題？」
      - levels: 「1 分：偶爾發生 / 3 分：一個月幾次 / 5 分：每週、每天或高頻」
      - data_path: `verdict.scores.frequency`
    - dimension_3_intensity:
      - label: 「痛苦強度」
      - subtitle: 「這個問題對他造成多大影響？」
      - levels: 「1 分：只是小麻煩 / 3 分：願意花一點時間解 / 5 分：造成明顯時間 / 金錢 / 壓力 / 風險」
      - data_path: `verdict.scores.intensity`
    - dimension_4_workaround_dissatisfaction:
      - label: 「現有解法不滿」
      - subtitle: 「他對現有 workaround 多不滿？」
      - levels: 「1 分：已有好工具或流程 / 3 分：有但不夠好 / 5 分：仍靠土法、拼貼、手工處理」
      - data_path: `verdict.scores.workaround_dissatisfaction`
    - dimension_5_evidence_credibility:
      - label: 「證據可信度」
      - subtitle: 「我手上的證據強度？」
      - levels: 「1 分：只有自己的想像 / 3 分：問過 1 個人或看到 1 篇文章 / 5 分：多來源證據與真人可訪談」
      - data_path: `verdict.scores.evidence_credibility`
  - total_score_display: TotalScoreCard / required / 顯示「總分：N / 25」
    - calculation: HiddenLogic / required / `total_score = sum(scores.*)`
    - score_band_hint: Body MD / required / 動態（不是「等級」，是「下一步建議」）：
      - 20-25 分：「這份證據強度建議你排真人訪談（卡 8 對象）」
      - 15-19 分：「建議先縮小人群或換場景再研究（退回卡 2 或 3）」
      - 14 分以下：「可能只是抱怨，不是好痛點。可以考慮換題」
    - **NOT** 顯示「等級」「排名」「優秀 / 良好」這類詞
  - teaching_warning: CalloutBox Warning / required /
    - icon: ⚠️
    - title: 「為什麼分數只是工具，不是答案？」
    - body:
      - 「24 分的痛點，仍可能是假痛點（你還沒真人訪談）」
      - 「14 分的抱怨，仍可能是真痛點（你還沒挖深）」
      - 「分數只訓練判斷力，不是給你答案。」
      - 「答案永遠來自真人訪談（卡 8）。」
- **states**:
  - default: 5 個 SegmentedScale 都未選；total_score 顯示「— / 25」
  - filling: 每選一個維度後 total 即時更新
  - all_scored: 5 維度都選完，total_score 顯示完整數字 + score_band_hint
- **copy_constraints**: dimension_label ≤ 8 字中文；level descriptions 從 worksheet 卡 9 對照表 100% 萃取；不可使用「等級 A-F」「優 / 良 / 中 / 差」

### Section: scores_summary（production 模式專屬）

- **layout**: 全寬白底容器，最大寬 800px 置中；padding 32px；只在 mode === 'production' 時顯示
- **elements**:
  - section_title: H2 / required / 「5 維度反思（已完成）」
  - status_indicator: StatusBadge / required / 「✓ 已完成 5 維度反思」（不顯示分數）
  - production_explanation: Body MD / required / 「這個痛點已通過 5 維度反思評分。生產模式不顯示分數，避免異化為品質排名。如需查看分數請切到教學模式。」
  - quick_summary: List / required / 顯示哪些維度已評分（不顯示分數值）
    - 「✓ 人群具體度」
    - 「✓ 發生頻率」
    - 「✓ 痛苦強度」
    - 「✓ 現有解法不滿」
    - 「✓ 證據可信度」
- **states**:
  - default: 顯示 5 個 ✓ checkmark
  - incomplete: 若 scores 未填完整 → 顯示「請先切到教學模式完成 5 維度反思」+ 切換按鈕
- **copy_constraints**: 整段不可出現任何 1-5 數字 / 0-25 數字；只用 ✓ / ✗ / 已完成 / 未完成

### Section: judgment_form

- **layout**: 全寬白底容器，最大寬 800px 置中；padding 32px；border-left 4px Accent #E8913A 強調這是「最終判斷區」
- **elements**:
  - section_title: H2 / required / 「第二步：書面判斷（這份填空簿的唯一交付物）」
  - judgment_radio: RadioGroup / required / 3 個選項，必須單選
    - option_true_pain:
      - value: `true_pain`
      - label: H3 / required / 「✓ 真痛點」
      - description: Body MD / required / 「我有足夠證據相信這是真的。下一步排訪談 / 進階段二。」
    - option_fake_pain:
      - value: `fake_pain`
      - label: H3 / required / 「✗ 假痛點」
      - description: Body MD / required / 「證據不支持。換題目，從卡 1 重新來。」
    - option_pending_interview:
      - value: `pending_interview`
      - label: H3 / required / 「？ 還無法判斷」
      - description: Body MD / required / 「需要訪談 2-3 人後再回來重打分。這是最常見的結果，很正常。」
    - data_path: `verdict.judgment`
  - reason_input:
    - label: H3 / required / 「書面理由（≥ 100 字）」
    - hint: Caption / required / 「不是想想就過。具體寫：你看到了什麼證據、你還沒看到什麼、為什麼這樣判。」
    - input: Textarea / required / minLength: 100 / maxLength: 5000 / 高度 240px
    - char_counter: Body SM / required / 動態顯示「已寫 N / 至少 100 字」；達 100 字後變 Verified Green
    - data_path: `verdict.reason_100w`
  - most_confident_input:
    - label: Body Bold / required / 「我最有把握的證據是」
    - hint: Caption / required / 「從卡 6 + 卡 7 抽 1 個具體證據（不是空話）」
    - input: Textarea / required / minLength: 15
    - data_path: `verdict.most_confident_evidence`
  - least_confident_input:
    - label: Body Bold / required / 「我最沒把握的地方是」
    - hint: Caption / required / 「誠實寫出你的不確定。這比假裝有把握更有價值。」
    - input: Textarea / required / minLength: 15
    - data_path: `verdict.least_confident`
  - next_action_radio:
    - label: Body Bold / required / 「下一步我會」
    - hint: Caption / required / 「依你的判斷選一個」
    - options: RadioGroup / required
      - 「訪談卡 8 的對象」/ value: `interview`（true_pain / pending_interview 預設）
      - 「退回卡 6 找更多證據」/ value: `more_evidence`
      - 「換題目重新填一輪」/ value: `change_topic`（fake_pain 預設）
    - data_path: `verdict.next_action`
- **states**:
  - default: 所有欄位空白
  - judgment_selected: 選擇 judgment 後，next_action 自動預選對應選項（可手動改）
  - reason_filling: char_counter 即時更新；< 100 字時顯示紅字（不擋輸入），≥ 100 字變 Verified Green
  - autosaved: debounce 2 秒
- **copy_constraints**: judgment 文案必須與 worksheet 卡 9 一致；reason_100w minLength 強制 100 字（驗證在前端 + 過關判定）

### Section: exit_gate

- **layout**: 全寬 sticky bottom，白底容器，padding 24px，shadow-md
- **elements**:
  - exit_gate_check: ExitGateCheck / required
    - check_1: Checklist Item / 「5 維度都打分（教學模式）/ 已完成 5 維度反思（生產模式）」/ 自動勾選（依 5 個 scores 都填）
    - check_2: Checklist Item / 「judgment 已選」/ 自動勾選（依 judgment 非 null）
    - check_3: Checklist Item / 「書面理由 ≥ 100 字」/ 自動勾選（依 reason_100w.length >= 100）
    - check_4: Checklist Item / 「next_action 已選」/ 自動勾選
  - completion_status: Body MD / required / 「✓ 4/4 已通過」或「還差 N 項」
  - cta_next: Button Primary Large / required / 「查看你的痛點身份證 →」/ -> `/learn/worksheet/result`
  - cta_back: Button Ghost / optional / 「← 退回卡 8」/ -> `/learn/worksheet/08`
  - status_change_preview: StatusPreview / required / 顯示「PainCard.status 即將變為：」+ 對應狀態
    - true_pain → `structured`
    - pending_interview → `pending_interview`
    - fake_pain → `archived_fake`
- **states**:
  - default: 4 個 check 都未勾選，cta_next disabled
  - all_passed: cta_next 變 Amber CTA + 微妙 scale(1.02)
- **copy_constraints**: cta_next ≤ 18 字；不可用「恭喜判定」「闖關成功」（避免遊戲化）

---

## [INTERACTION & STATE FLOW]

### 主要互動流程

1. 頁面載入 → 從 LocalStorage 讀取 PainCard + display_mode
2. mode_indicator 渲染對應模式 banner
3. mode === 'teaching' → 渲染 scores_form；mode === 'production' → 渲染 scores_summary
4. 教學模式下，使用者選 5 維度評分 → total_score 即時計算 + score_band_hint 動態更新
5. 使用者選 judgment → next_action 自動預選對應選項
6. 使用者寫 reason_100w → char_counter 即時更新，達 100 字變綠
7. exit_gate 4 個 check 全通過 → cta_next 解鎖
8. 點 cta_next → 寫入 PainCard.status + current_step = 10 + 跳轉 `/learn/worksheet/result`

### 模式切換流程

- 點 mode_indicator 的 switch_link
- 模式立即切換（無確認 modal — 因為資料層不變）
- 教學 → 生產：scores_form 隱藏（CSS display:none），scores_summary 顯示
- 生產 → 教學：scores_summary 隱藏，scores_form 顯示（保留已填分數）
- LocalStorage `painmap_worksheet:settings.display_mode` 寫入新值

### 自動儲存策略

- LocalStorage debounce 2 秒
- judgment 切換時，next_action 自動更新但不覆寫使用者已手動選的值（用 dirty flag 判斷）

### 過關後狀態變更

```
verdict.judgment === 'true_pain' →
  PainCard.status = 'structured'
  PainCard.current_step = 10
  → /learn/worksheet/result

verdict.judgment === 'pending_interview' →
  PainCard.status = 'pending_interview'
  PainCard.current_step = 10
  → /learn/worksheet/result

verdict.judgment === 'fake_pain' →
  PainCard.status = 'archived_fake'
  PainCard.current_step = 10
  → /learn/worksheet/result（顯示「換題目」CTA 為主）
```

### RWD 行為差異

| 斷點 | 佈局 | 差異說明 |
| --- | --- | --- |
| Desktop (>1280px) | 5 個 dimension card 垂直堆疊；judgment 3 選項橫排 | 完整體驗 |
| Tablet (768-1280px) | 同 Desktop，dimension card 寬度縮小 | — |
| Mobile (<768px) | dimension card 縮小 padding；SegmentedScale 5 按鈕仍橫排（觸控優先）；judgment 3 選項堆疊 | exit_gate 改為固定底部 sticky |

---

## [DATA & API]

- **uses_api**: false（MVP）
- **localstorage_keys**:
  - `painmap_worksheet:cards`
  - `painmap_worksheet:settings.display_mode`
- **data_paths_written**:
  - `PainCard.verdict.scores.people_specificity` (1-5)
  - `PainCard.verdict.scores.frequency` (1-5)
  - `PainCard.verdict.scores.intensity` (1-5)
  - `PainCard.verdict.scores.workaround_dissatisfaction` (1-5)
  - `PainCard.verdict.scores.evidence_credibility` (1-5)
  - `PainCard.verdict.total_score` (computed: sum of scores, 0-25)
  - `PainCard.verdict.judgment` (true_pain / fake_pain / pending_interview)
  - `PainCard.verdict.reason_100w` (≥ 100 字)
  - `PainCard.verdict.most_confident_evidence`
  - `PainCard.verdict.least_confident`
  - `PainCard.verdict.next_action` (interview / more_evidence / change_topic)
  - `PainCard.status` (依 judgment 自動寫入)
  - `PainCard.current_step` → 10
- **data_paths_read**:
  - `PainCard.complaint.*`、`people.*`、`stuck_formula.*`、`workaround.*`、`contradiction.*` → 顯示在側邊摘要
  - `PainCard.ai_evidence.*` → 顯示在側邊摘要（reason_100w 寫作時參考）
  - `PainCard.self_guess.*` → 顯示在側邊摘要
  - `PainCard.interview_plan.*` → 顯示在側邊摘要
- **生產模式 API 過濾規則（M2 範圍預留）**:
  - 對外 API（Pain Atlas / 分享連結）回傳 PainCard 時，必須過濾 `verdict.scores` + `verdict.total_score`
  - 只回傳 `verdict.judgment` + `verdict.reason_100w` + `verdict.next_action`
  - 詳見 `references/pain_card_schema.md` Rule 4
- **error_cases**:
  - 卡 1-8 任一卡未完成 → 顯示「卡 N 還沒完成，請先回去」+ 不可離開
  - LocalStorage quota exceeded → 友善錯誤

---

## [EXIT GATE]

### 過關條件（必須全部通過）

| # | 條件 | 自動判定邏輯 | 失敗訊息 |
| :- | :--- | :--- | :--- |
| 1 | 5 維度都打分 | `verdict.scores.*` 5 個欄位都 ∈ [1, 5] | 「還有 N 個維度沒打分」 |
| 2 | judgment 已選 | `verdict.judgment` ∈ ['true_pain', 'fake_pain', 'pending_interview'] | 「請選真 / 假 / 待訪談」 |
| 3 | 書面理由 ≥ 100 字 | `verdict.reason_100w.length >= 100` | 「再多寫 N 字。具體說你看到 / 沒看到什麼」 |
| 4 | next_action 已選 | `verdict.next_action` ∈ ['interview', 'more_evidence', 'change_topic'] | 「請選下一步行動」 |

### 失敗路由

- 任一條件未過 → 留在當頁，顯示具體缺什麼
- **卡 9 沒有「失敗退回上一卡」路由**（因為卡 9 是判斷本身，不是資訊蒐集）
- 例外：使用者主動點 cta_back 退回卡 8（保留卡 9 已填資料）

### 狀態機影響

- 過關時：依 `verdict.judgment` 寫入 `PainCard.status`：
  - `true_pain` → `structured`
  - `pending_interview` → `pending_interview`
  - `fake_pain` → `archived_fake`
- `PainCard.current_step` → 10
- 跳轉到 `/learn/worksheet/result`

---

## [AI INTEGRATION]

### AI 介入策略

| 項目 | 是否使用 AI | 說明 |
| :--- | :--- | :--- |
| 評分 5 維度 | ❌ **永久禁用** | worksheet 鐵律：判斷必須人為書面 |
| 寫 reason_100w | ❌ **永久禁用** | 同上；100 字書面是「使用者必須親自做的職業訓練」 |
| 自動判定 true / fake | ❌ **永久禁用** | 違反 brand 第三原則：證據優於意見；不可由 AI 替代判斷 |
| 自動填 most_confident / least_confident | ❌ **永久禁用** | 自我反思必須親自做 |

### worksheet 鐵律對應

| Worksheet 鐵律 | 軟體實作 |
| :--- | :--- |
| 「真假判斷有書面理由（不是想想就過）」 | reason_100w minLength 100 字強制 |
| 「分數只訓練判斷力，不是給你答案」 | teaching_warning CalloutBox 強制顯示 |
| 「答案永遠來自真人訪談（卡 8）」 | next_action 預設 interview |
| 「AI 不可參與此卡」 | ai_disabled_banner 強制顯示 + 沒有任何 AI prompt 區塊 |

### 反模式：AI 輔助寫作的誘惑（卡 9 最容易出錯）

某些產品會做「AI 幫你潤飾 reason」「AI 建議下一步」，這在卡 9 必須**完全禁止**：

- ❌ 不可加「AI 幫你檢查 reason 是否完整」按鈕
- ❌ 不可加「AI 推薦下一步」按鈕
- ❌ 不可在 reason textarea 旁邊放「灌入 AI 模板」shortcut
- ❌ 即使是 M2+ 站內 LLM 串接，這張卡的 4 個 textarea 也永遠不可有 AI 輔助

理由：判斷力訓練的本質是「親自寫出 100 字」。如果讓 AI 代寫，就違反了整套 worksheet 的訓練目的。

---

## [OCTALYSIS HOOKS]

### 主驅動力：#2 Development & Accomplishment（發展與成就）

**設計實作**：
- 卡 9 通關 = 痛點身份證即將產出（整套 worksheet 的 capstone moment）
- 5 維度評分讓使用者「看到自己思考的厚度」
- reason_100w 達 100 字後 char_counter 變 Verified Green → 微小成就感
- 過關後自動進入卡 10（匯出），形成完整閉環

**為什麼是 #2 而非 #1**：卡 9 的核心是「**完成判斷這件事本身**」，而不是「重塑使命感」。Epic Meaning 在卡 8 已強化過，卡 9 是收網。

### 副驅動力：#4 Ownership & Possession（限定使用）

**設計實作**：
- 「**你的**判斷」這個敘事貫穿全頁
- judgment 是 single-decision，沒有「AI 建議」混淆
- LocalStorage 確保資料主權（在你本機）
- 匯出後的痛點身份證 = 「你的」資產

**限定使用的邊界**：
- ✅ 可用「資料主權」「你的判斷」這類 Ownership 敘事
- ❌ 不可用「IKEA 效應」誘導（如「你已經填了 90% 不放棄吧」）
- ❌ 不可用「沉沒成本」綁架（如「不繼續會失去 N 小時投入」）

### 反模式檢查清單（卡 9 最容易犯）

- ❌ 把 0-25 分轉換為 A-F 等級
- ❌ 「Pain Quality 排行榜」顯示同類痛點分數
- ❌ 推送通知「你的 Pain Quality 提升了 +3」
- ❌ 把 5 維度做成可愛的雷達圖（生產模式）
- ❌ 「分享你的 Pain Quality Score 到社群」按鈕
- ❌ 把 judgment 結果做成「成就徽章」（true_pain = 金徽章 / fake_pain = 銅徽章）
- ❌ 跨 PainCard 比較「你之前的痛點得 18 分，這次 23 分」
- ❌ AI 自動寫 reason_100w
- ❌ 「你的判斷準確嗎？AI 來幫你看看」（違反整套訓練）

詳見 `references/anti_gamification_guardrails.md`。

### 永久禁用驅動力

| 驅動力 | 為什麼這裡會誘惑出現 | 守則 |
| :--- | :--- | :--- |
| #6 Scarcity & Impatience | 「24 小時內判定有獎勵」 | 完全不出現 |
| #7 Unpredictability | 「驚喜 Pain Score」「神秘判斷模式」 | 完全不出現 |
| #8 Loss Avoidance | 「沒判定明天 status 會降為 draft」 | 完全不出現；status 變更只由使用者主動觸發 |

---

## [EXCEPTION TO GLOBAL RULES]

- **這是唯一一張在「教學模式下」可以顯示 1-5 分數值的頁面**：違反全域「禁止分數 UI」原則。理由：worksheet 卡 9 的訓練本質就是「填分 + 反思為什麼填這個分」；分數是反思鏡子，非評判工具。生產模式下嚴格隱藏。
- **mode_indicator 在頁面頂部 sticky 顯示**：違反「不過度視覺強調」原則。理由：模式區別是這張卡的 critical 設計，必須讓使用者隨時看見當前模式。
- **AI 完全禁用 + ai_disabled_banner 強制顯示**：違反一般「AI 是助手」的全站定位。理由：判斷力訓練的核心。
- **reason_100w minLength 100 字強制**：違反一般「不限制輸入長度」原則。理由：worksheet 鐵律。

---

## [BRAND LANGUAGE RULES (PAGE-SPECIFIC)]

### 禁止用語

| 禁止 | 理由 |
| :--- | :--- |
| 「等級 A / B / C」「優秀 / 良好 / 普通 / 差」 | 學校式評判 — 違反 brand |
| 「Pain Quality 排行榜」「最佳痛點」 | 競爭遊戲化 — 違反 brand |
| 「成功率」「可行性 X%」 | 全域禁令 |
| 「AI 推薦你選真痛點」「AI 判斷這是真的」 | 違反 worksheet 鐵律 |
| 「你的判斷準確度」 | 違反 Empowerment（暗示有「正確答案」） |
| 「分享你的得分」「比比看誰得分高」 | 違反 brand + 反模式 |
| 「升級為真痛點 / 降級為假痛點」 | 遊戲化等級制 |

### 建議用語

| 建議 | 場景 |
| :--- | :--- |
| 「5 維度反思」 | 教學模式 |
| 「已完成反思」 | 生產模式狀態描述 |
| 「真痛點 / 假痛點 / 待訪談」 | judgment 三選 |
| 「書面理由」 | reason_100w |
| 「下一步行動」 | next_action |
| 「分數只是工具，不是答案」 | teaching_warning |

### 語調

- **Empowering**：「你來判斷，不是 AI 判斷」
- **Calm**：reason_100w 達 100 字時不用慶祝動畫，只變綠
- **Anti-anxiety**：判定假痛點不是「失敗」，是「省下 3 個月走錯路的時間」
- **Honest**：least_confident 鼓勵誠實寫不確定 — 「假裝有把握」是這套訓練的最大反模式

---

## [ACCEPTANCE CRITERIA]

### 通用驗收

- 7 個 Section 依序正確渲染，stepper 顯示 current_step = 9
- ai_disabled_banner 強制顯示，不可被收合或關閉
- reason_100w textarea 接受 ≥ 100 字輸入；< 100 字時 char_counter 顯示紅字
- judgment 三選一切換時，next_action 自動預選對應選項
- exit_gate 4 個 check 全通過後 cta_next 解鎖
- 過關後 PainCard.status 依 judgment 正確寫入（true_pain → structured 等）
- 過關後 PainCard.current_step 寫入 10
- 不出現禁用語（「等級」「成功率」「AI 推薦」等）

### 教學模式專屬驗收

- mode === 'teaching' 時，scores_form 顯示
- 5 個 SegmentedScale 可獨立選擇 1-5 分
- total_score 即時計算（sum of 5 scores），顯示為「N / 25」
- score_band_hint 依 total_score 動態顯示對應建議（20-25 / 15-19 / 0-14）
- teaching_warning CalloutBox 強制顯示，不可收合
- 不顯示「等級 A-F」或任何等級轉換
- level descriptions 與 worksheet 卡 9 對照表 100% 一致

### 生產模式專屬驗收

- mode === 'production' 時，scores_form 隱藏，scores_summary 顯示
- scores_summary 不顯示任何 1-5 數字 / 0-25 數字
- 只用 ✓ checkmark 顯示「已完成 5 維度反思」
- 切回教學模式時，已填分數保留（無資料丟失）

### 模式切換驗收

- mode_indicator switch_link 可切換模式
- LocalStorage `painmap_worksheet:settings.display_mode` 正確寫入
- URL query `?mode=teaching` / `?mode=production` 可初始化模式
- 預設值為 teaching

### 反模式驗收（必須全部不出現）

- 0-25 分轉 A-F 等級的 UI 元素
- Pain Quality Score 排行榜
- 推送通知「你的 Pain Quality 提升 +N 分」
- 5 維度雷達圖 / 進度條（生產模式）
- 「分享你的得分」按鈕
- judgment 徽章（金 / 銀 / 銅）
- AI 輔助寫 reason 按鈕
- 跨 PainCard 分數比較

### 資料層驗收

- M2+ 預留：對外 API 回傳 PainCard 時必須過濾 verdict.scores + total_score（除非 mode=teaching 顯式請求）
- 公開分享連結禁止顯示分數（只顯示 judgment + reason_100w + next_action）

### RWD / 無障礙驗收

- 三斷點佈局正確
- SegmentedScale 鍵盤可操作（左右箭頭切分數）
- ai_disabled_banner 用 role="alert" + aria-live="polite"
- reason_100w textarea 有 aria-describedby 連結到 char_counter
