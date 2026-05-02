# PainMap Worksheet — Card 9 (Pain Quality Score & Verdict) Integrated Prompt

> 自我包含整合 prompt — 直接貼入 Lovable / Claude Code 即可生成卡 9 完整實作。
> 對應 page spec：`docs/painmap_worksheet/design/pages/09_card_verdict.md`
> 對應資料模型：`docs/painmap_worksheet/product/data_model.md` § Card 9
> 組裝日期：2026-05-02 ｜ Worksheet v1.0
>
> **這是整套 worksheet 最敏感的頁面** — 5 維度評分 + 真假判斷的書面理由，必須嚴格區分「教學模式」與「生產模式」。AI 在這張卡是**完全禁用**的（worksheet 鐵律：判斷必須人為書面）。

---

## === GLOBAL PROJECT GUIDELINE (DO NOT OVERRIDE) ===

你是「PainMap 題眼 — Worksheet 教學模式」的資深產品設計師與前端工程師。

### 品牌特質

**結構化** ｜ **賦權感** ｜ **沉穩** ｜ **教學優先**

### Color Tokens

| Token | 色值 | 用途 |
| :--- | :--- | :--- |
| Primary #1E3A5F / Primary Light #E8EEF5（生產模式 banner 背景）/ Secondary #2D7D8A / Accent CTA #E8913A（judgment_form border-left）/ Verified #2D9D78（教學模式 banner 背景 + check pass + reason ≥ 100 字綠）/ Verified Light #E6F5EF / Caution #D97706 / BG Page #F7F8FA / BG Muted #F1F3F5 / Text Primary #1A2332 / Text Secondary #5C6B7A / Border Default #DFE3E8 / Border Focus #2D7D8A |

### Typography

H1 28px / H2 22px / H3 18px / Body LG 17px / Body MD 15px / Body SM 13px / Caption 12px

字體：`Noto Sans TC` + `Inter`

### 元件風格

- Radius MD 8px / LG 12px
- Border `1px solid #DFE3E8` / focus 2px Teal
- Shadow SM / MD

### 技術棧

React 18 + TypeScript + Tailwind + Zustand + React Hook Form + Zod。LocalStorage key：`painmap_worksheet:cards`、`painmap_worksheet:settings.display_mode`。

### 絕對禁令（PainMap Brand）

- 禁止：分數轉 A-F 等級、星等、排行榜、徽章、倒數計時
- 禁用詞：「等級 A / B / C」「優秀 / 良好 / 普通 / 差」「Pain Quality 排行榜」「最佳痛點」「成功率 / 可行性 X%」「AI 推薦你選真痛點」「AI 判斷這是真的」「你的判斷準確度」「分享你的得分」「升級為真痛點 / 降級為假痛點」「闖關」「streak」
- **特殊規則**：1-5 分數值僅限教學模式可見，生產模式絕對隱藏（API 過濾）
- 禁止 Inline styles / `console.log`
- WCAG AA / 語意化 HTML / focus ring Teal

### 絕對禁令（Octalysis 黑帽）

- 禁止 #6 Scarcity：「24 小時內判定有獎勵」
- 禁止 #7 Unpredictability：「驚喜 Pain Score」「神秘判斷模式」
- 禁止 #8 Loss Avoidance：「沒判定明天 status 會降為 draft」、streak

### 教學模式特殊鐵律（Card 9 為**最敏感卡**）

1. **AI 完全禁用**（worksheet 鐵律：判斷必須人為書面）
2. **書面優先**：reason_100w 必須 ≥ 100 字（**強制 minLength**）
3. **過關條件透明**：5 維度評分 + judgment + reason 100+ + next_action 全部填妥
4. **失敗回退**：卡 9 沒有「失敗退回上一卡」路由（卡 9 是判斷本身，不是資訊蒐集）
5. **教學 / 生產模式切換**：URL `?mode=teaching|production` + LocalStorage `display_mode`，預設 `teaching`

---

## === CURRENT TASK: BUILD CARD 9 — PAIN QUALITY SCORE & VERDICT ===

### [PAGE META]

- **page_name**: Card 9 - Pain Quality Score & Verdict
- **route_path**: `/learn/worksheet/09?id={paincard_uuid}&mode={teaching|production}`
- **card_step**: 9（最後一張 worksheet 卡片）
- **page_type**: worksheet_card_critical（dual mode: teaching / production）
- **primary_goal**: 引導使用者完成 5 維度反思評分（教學模式）+ 書面真假判斷（≥ 100 字）+ 下一步行動選擇
- **secondary_goal**: 訓練「分數只是工具，不是答案」的認知；建立「書面判斷」的職業習慣
- **prerequisite_cards**: [1, 2, 3, 4, 5, 6, 7, 8]
- **expected_time_on_page**: 20-40 分鐘（書面判斷 ≥ 100 字需思考）

---

### [STRUCTURE: SECTIONS]

1. **stepper_context** — 卡 1-8 ✓ / 卡 9 高亮
2. **card_intro** — 「這是這份填空簿的唯一交付物」+ AI 完全禁用聲明
3. **mode_indicator** — 教學模式 / 生產模式 banner + 切換 link
4. **scores_form**（teaching 專屬）— 5 維度 × 1-5 分 + 教學提示「分數只是工具」
5. **scores_summary**（production 專屬）— 只顯示「已完成 5 維度反思」狀態（**不顯示數字**）
6. **judgment_form** — 真假判斷單選 + ≥ 100 字書面理由 + most/least confident + next_action
7. **exit_gate** — 過關 4 條件 + 「查看你的痛點身份證」CTA

---

### [SECTION COMPONENT SPEC]

#### Section 1: stepper_context

- 與卡 1-8 一致
- `ai_indicator` (Badge, **Error red border**): "AI 介入：❌ 完全禁用（鐵律）"

#### Section 2: card_intro

- `card_label` (Caption): "卡片 9 / 9"
- `title` (H1): "真假痛點的書面判斷"
- `one_liner` (Body LG): "走到這裡，你要做的只有一件事：書面回答『這是真痛點還是假痛點？為什麼？』"
- `ai_disabled_banner` (AlertBanner Critical, role="alert", **必填顯示，不可收合**)：
  - icon: 🚫
  - title: "這張卡片 AI 完全不參與"
  - body: 「真假判斷是這套訓練的唯一交付物。AI 可以幫你蒐集證據（卡 6）、整理表（卡 7）、模擬訪談（卡 8），但『真的嗎』『值得嗎』這兩題永遠是你來判。」
- `delivery_reminder` (CalloutBox Empowering, icon=🪪)：
  - title: "這份填空簿的唯一交付物"
  - body: 「你不需要做產品、不需要架網站、不需要收錢。你只需要交出這個書面判斷。」

#### Section 3: mode_indicator

- **layout**: 全寬橫條，padding 12px，最大寬 800px
- **背景**：teaching → Verified Light `#E6F5EF`；production → Primary Light `#E8EEF5`
- **elements**:
  - `mode_label` (Body Bold)：
    - teaching: "📖 教學模式（顯示 5 維度反思評分）"
    - production: "📦 生產模式（只顯示判斷狀態，不顯示分數）"
  - `mode_explanation` (Body SM)：
    - teaching: "分數是讓你反思『為什麼給這個維度 X 分？』，不是答案。"
    - production: "在 PainMap App 內，痛點以狀態分類，不以分數排名。"
  - `switch_link` (TextLink, optional)：
    - teaching → "切到生產模式 →"
    - production → "切到教學模式 →"
  - `mode_persistence` (HiddenLogic)：模式狀態寫入 LocalStorage `painmap_worksheet:settings.display_mode`

#### Section 4: scores_form（teaching 專屬，mode === 'teaching' 時顯示）

- `section_title` (H2): "第一步：5 維度反思評分"
- `section_subtitle` (Body MD): "這 5 個維度幫你檢視卡 1-8 的證據強度。每個維度問自己：『我為什麼給這個分數？』"

##### 5 個 ScoreDimension（每個包含：label + subtitle + 3 個 level descriptions + SegmentedScale 1-5 + reflection_prompt）

| dimension | label | subtitle | levels | data_path |
| :--- | :--- | :--- | :--- | :--- |
| 1 | 人群具體度 | 我對痛點主人翁的描述有多具體？ | 1: 只知道大概族群（如「上班族」）/ 3: 知道是哪群但說不出名字 / 5: 能說清楚職位、場景、任務 | `verdict.scores.people_specificity` |
| 2 | 發生頻率 | 他多常遇到這個問題？ | 1: 偶爾發生 / 3: 一個月幾次 / 5: 每週、每天或高頻 | `verdict.scores.frequency` |
| 3 | 痛苦強度 | 這個問題對他造成多大影響？ | 1: 只是小麻煩 / 3: 願意花一點時間解 / 5: 造成明顯時間/金錢/壓力/風險 | `verdict.scores.intensity` |
| 4 | 現有解法不滿 | 他對現有 workaround 多不滿？ | 1: 已有好工具或流程 / 3: 有但不夠好 / 5: 仍靠土法、拼貼、手工處理 | `verdict.scores.workaround_dissatisfaction` |
| 5 | 證據可信度 | 我手上的證據強度？ | 1: 只有自己的想像 / 3: 問過 1 個人或看到 1 篇文章 / 5: 多來源證據與真人可訪談 | `verdict.scores.evidence_credibility` |

每個 SegmentedScale 為 5 個按鈕（1-5），鍵盤可用左右箭頭切換。

##### `total_score_display` (TotalScoreCard)

- 顯示 「總分：N / 25」
- `calculation`: `total_score = sum(scores.*)`
- `score_band_hint` (Body MD)：動態（**不是「等級」，是「下一步建議」**）：
  - 20-25 分：「這份證據強度建議你排真人訪談（卡 8 對象）」
  - 15-19 分：「建議先縮小人群或換場景再研究（退回卡 2 或 3）」
  - 14 分以下：「可能只是抱怨，不是好痛點。可以考慮換題」
- **不顯示「等級」「排名」「優秀 / 良好」這類詞**

##### `teaching_warning` (CalloutBox Warning, **必填**)

- icon: ⚠️
- title: "為什麼分數只是工具，不是答案？"
- body：
  - 「24 分的痛點，仍可能是假痛點（你還沒真人訪談）」
  - 「14 分的抱怨，仍可能是真痛點（你還沒挖深）」
  - 「分數只訓練判斷力，不是給你答案。」
  - 「答案永遠來自真人訪談（卡 8）。」

#### Section 5: scores_summary（production 專屬，mode === 'production' 時顯示）

- **layout**: 全寬白底容器，padding 32px，最大寬 800px
- **elements**:
  - `section_title` (H2): "5 維度反思（已完成）"
  - `status_indicator` (StatusBadge): "✓ 已完成 5 維度反思"（**不顯示分數**）
  - `production_explanation` (Body MD): 「這個痛點已通過 5 維度反思評分。生產模式不顯示分數，避免異化為品質排名。如需查看分數請切到教學模式。」
  - `quick_summary` (List)：5 個 ✓ checkmark（不顯示分數值）
    - ✓ 人群具體度 / ✓ 發生頻率 / ✓ 痛苦強度 / ✓ 現有解法不滿 / ✓ 證據可信度
  - 若 scores 未填完整 → 「請先切到教學模式完成 5 維度反思」+ 切換按鈕

**整段不可出現任何 1-5 / 0-25 數字**。

#### Section 6: judgment_form（**核心區塊**）

- **layout**: 全寬白底容器，padding 32px，最大寬 800px，**border-left 4px Accent #E8913A**
- `section_title` (H2): "第二步：書面判斷（這份填空簿的唯一交付物）"
- `judgment_radio` (RadioGroup, 3 個選項，**必須單選**)：
  - option_true_pain: value=`true_pain`, label="✓ 真痛點"（H3）, description="我有足夠證據相信這是真的。下一步排訪談 / 進階段二。"
  - option_fake_pain: value=`fake_pain`, label="✗ 假痛點"（H3）, description="證據不支持。換題目，從卡 1 重新來。"
  - option_pending_interview: value=`pending_interview`, label="？ 還無法判斷"（H3）, description="需要訪談 2-3 人後再回來重打分。這是最常見的結果，很正常。"
  - data_path: `verdict.judgment`
- `reason_input` (Textarea, **核心欄位**)：
  - label (H3): "書面理由（≥ 100 字）"
  - hint: "不是想想就過。具體寫：你看到了什麼證據、你還沒看到什麼、為什麼這樣判。"
  - input: Textarea (高度 240px, **minLength 100, maxLength 5000, 強制 minLength**)
  - char_counter (Body SM)：動態顯示「已寫 N / 至少 100 字」；達 100 字後變 Verified Green
  - data_path: `verdict.reason_100w`
- `most_confident_input` (Textarea)：
  - label (Body Bold): "我最有把握的證據是"
  - hint: "從卡 6 + 卡 7 抽 1 個具體證據（不是空話）"
  - minLength 15
  - data_path: `verdict.most_confident_evidence`
- `least_confident_input` (Textarea)：
  - label (Body Bold): "我最沒把握的地方是"
  - hint: "誠實寫出你的不確定。這比假裝有把握更有價值。"
  - minLength 15
  - data_path: `verdict.least_confident`
- `next_action_radio` (RadioGroup)：
  - label (Body Bold): "下一步我會"
  - options:
    - "訪談卡 8 的對象" / value: `interview`（true_pain / pending_interview 預設）
    - "退回卡 6 找更多證據" / value: `more_evidence`
    - "換題目重新填一輪" / value: `change_topic`（fake_pain 預設）
  - data_path: `verdict.next_action`

**狀態**：
- judgment_selected → next_action 自動預選對應選項（可手動改）
- reason_filling：char_counter 即時更新；< 100 字時顯示紅字（**不擋輸入**），≥ 100 字變 Verified Green
- autosaved (debounce 2 秒)

#### Section 7: exit_gate（sticky bottom）

- 4 個 ExitGateCheck items：
  - check_1: 「5 維度都打分（教學模式）/ 已完成 5 維度反思（生產模式）」/ 自動勾選
  - check_2: 「judgment 已選」
  - check_3: 「書面理由 ≥ 100 字」
  - check_4: 「next_action 已選」
- `cta_next` (Button Primary Large): "查看你的痛點身份證 →" → `/learn/worksheet/result`
- `cta_back` (Button Ghost, optional): "← 退回卡 8"
- `status_change_preview` (StatusPreview)：顯示「PainCard.status 即將變為：」+ 對應狀態：
  - true_pain → `structured`
  - pending_interview → `pending_interview`
  - fake_pain → `archived_fake`

---

### [INTERACTION & STATE FLOW]

#### 主要互動流程

1. 頁面載入 → 從 LocalStorage 讀 PainCard + display_mode
2. mode_indicator 渲染對應模式 banner
3. mode === 'teaching' → 渲染 scores_form；mode === 'production' → 渲染 scores_summary
4. 教學模式下，使用者選 5 維度評分 → total_score 即時計算 + score_band_hint 動態更新
5. 使用者選 judgment → next_action 自動預選對應選項
6. 使用者寫 reason_100w → char_counter 即時更新，達 100 字變綠
7. exit_gate 4 個 check 全通過 → cta_next 解鎖
8. 點 cta_next → 寫入 PainCard.status + current_step = 10 + 跳轉 `/learn/worksheet/result`

#### 模式切換流程

- 點 mode_indicator switch_link
- 模式立即切換（**無確認 modal** — 因為資料層不變）
- 教學 → 生產：scores_form 隱藏（CSS display:none），scores_summary 顯示
- 生產 → 教學：scores_summary 隱藏，scores_form 顯示（**保留已填分數**）
- LocalStorage `painmap_worksheet:settings.display_mode` 寫入新值

#### 過關後狀態變更

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
  → /learn/worksheet/result
```

#### RWD

| 斷點 | 佈局 |
| :--- | :--- |
| Desktop (>1280px) | 5 個 dimension card 垂直堆疊；judgment 3 選項橫排 |
| Tablet (768-1280px) | 同 Desktop，dimension card 寬度縮小 |
| Mobile (<768px) | dimension card 縮小 padding；SegmentedScale 5 按鈕仍橫排（觸控優先）；judgment 3 選項堆疊；exit_gate sticky bottom |

---

### [DATA & API]

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
  - `PainCard.verdict.total_score` (computed: sum, 0-25)
  - `PainCard.verdict.judgment` (`'true_pain' | 'fake_pain' | 'pending_interview'`)
  - `PainCard.verdict.reason_100w` (≥ 100 字)
  - `PainCard.verdict.most_confident_evidence`
  - `PainCard.verdict.least_confident`
  - `PainCard.verdict.next_action` (`'interview' | 'more_evidence' | 'change_topic'`)
  - `PainCard.status` (依 judgment 自動寫入)
  - `PainCard.current_step` → 10
- **生產模式 API 過濾規則（M2 預留）**:
  - 對外 API（Pain Atlas / 分享連結）回傳 PainCard 時，**必須過濾 `verdict.scores` + `verdict.total_score`**
  - 只回傳 `verdict.judgment` + `verdict.reason_100w` + `verdict.next_action`
  - 詳見 R4.1 / R4.2

---

### [EXIT GATE]

#### 過關條件

| # | 條件 | 自動判定 | 失敗訊息 |
| :- | :--- | :--- | :--- |
| 1 | 5 維度都打分 | `verdict.scores.*` 5 個欄位都 ∈ [1, 5] | 「還有 N 個維度沒打分」 |
| 2 | judgment 已選 | `verdict.judgment` ∈ ['true_pain', 'fake_pain', 'pending_interview'] | 「請選真 / 假 / 待訪談」 |
| 3 | 書面理由 ≥ 100 字 | `verdict.reason_100w.length >= 100` | 「再多寫 N 字。具體說你看到 / 沒看到什麼」 |
| 4 | next_action 已選 | `verdict.next_action` ∈ ['interview', 'more_evidence', 'change_topic'] | 「請選下一步行動」 |

#### 失敗路由

- 任一條件未過 → 留在當頁，顯示具體缺什麼
- **卡 9 沒有「失敗退回上一卡」路由**（卡 9 是判斷本身，不是資訊蒐集）
- 例外：使用者主動點 cta_back 退回卡 8（保留卡 9 已填資料）

---

### [AI INTEGRATION]

- **AI 介入狀態**：❌ **永久禁用**
- **理由**（worksheet 鐵律）：判斷必須人為書面
- **設計手法**：
  - ai_disabled_banner 強制顯示，不可收合或關閉（role="alert"）
  - **不可加**「AI 幫你檢查 reason 是否完整」按鈕
  - **不可加**「AI 推薦下一步」按鈕
  - **不可在 reason textarea 旁邊放**「灌入 AI 模板」shortcut
  - **即使是 M2+ 站內 LLM 串接，這張卡的 4 個 textarea 也永遠不可有 AI 輔助**

| AI 任務 | 是否使用 | 說明 |
| :--- | :--- | :--- |
| 評分 5 維度 | ❌ 永久禁用 | worksheet 鐵律 |
| 寫 reason_100w | ❌ 永久禁用 | 必須使用者親自做的職業訓練 |
| 自動判定 true / fake | ❌ 永久禁用 | 違反 brand 第三原則（證據優於意見）|
| 自動填 most_confident / least_confident | ❌ 永久禁用 | 自我反思必須親自做 |

---

### [OCTALYSIS HOOKS]

#### 主驅動力：#2 Development & Accomplishment

- 卡 9 通關 = 痛點身份證即將產出（capstone moment）
- 5 維度評分讓使用者「看到自己思考的厚度」
- reason_100w 達 100 字後 char_counter 變 Verified Green（**微小成就感，不慶祝**）
- 過關後自動進入卡 10（匯出），形成完整閉環

#### 副驅動力：#4 Ownership & Possession（限定使用）

- 「**你的**判斷」敘事貫穿全頁
- judgment 是 single-decision，沒有「AI 建議」混淆
- LocalStorage 確保資料主權

**限定邊界**：
- ✅ 可用「資料主權」「你的判斷」這類 Ownership 敘事
- ❌ 不可用「IKEA 效應」誘導（「你已經填了 90% 不放棄吧」）
- ❌ 不可用「沉沒成本」綁架（「不繼續會失去 N 小時投入」）

#### 反模式檢查清單（Card 9 最容易犯，**必過全部不出現**）

- ❌ 把 0-25 分轉換為 A-F 等級
- ❌ 「Pain Quality 排行榜」顯示同類痛點分數
- ❌ 推送通知「你的 Pain Quality 提升了 +3」
- ❌ 把 5 維度做成可愛的雷達圖（生產模式）
- ❌ 「分享你的 Pain Quality Score 到社群」按鈕
- ❌ 把 judgment 結果做成「成就徽章」（true_pain = 金徽章）
- ❌ 跨 PainCard 比較「你之前的痛點得 18 分，這次 23 分」
- ❌ AI 自動寫 reason_100w
- ❌ 「你的判斷準確嗎？AI 來幫你看看」（違反整套訓練）

---

## === EXCEPTION RULES ===

本頁面允許以下例外（已明確標記）：

1. **這是唯一一張在「教學模式下」可以顯示 1-5 分數值的頁面**：違反全域「禁止分數 UI」原則。理由：worksheet 卡 9 訓練本質就是「填分 + 反思為什麼填這個分」；分數是反思鏡子，非評判工具。**生產模式下嚴格隱藏**。
2. **mode_indicator 在頁面頂部 sticky 顯示**：違反「不過度視覺強調」原則。理由：模式區別是這張卡的 critical 設計，必須讓使用者隨時看見。
3. **AI 完全禁用 + ai_disabled_banner 強制顯示**：違反一般「AI 是助手」全站定位。理由：判斷力訓練的核心。
4. **reason_100w minLength 100 字強制**：違反一般「不限制輸入長度」原則。理由：worksheet 鐵律。

---

## === OUTPUT REQUIREMENTS ===

### Step 1：結構確認

- 7 個 sections + 用途
- PainCard schema 對應：`verdict.{scores.{5 個維度}, total_score, judgment, reason_100w, most_confident_evidence, least_confident, next_action}`
- 資料流：URL `?id&mode` → 讀 LocalStorage（含 display_mode）→ 模式切換渲染 scores_form / scores_summary → judgment_form → exit gate → PATCH status + current_step
- exit gate pseudocode

### Step 2：設計決策說明

說明 3 個關鍵設計決策：
1. **教學模式 vs 生產模式為何用同一個頁面 + URL query？** — 資料層永遠相同（scores 一定存）；UI 是否呈現的差異；URL query + LocalStorage 雙保險；無確認 modal 切換（因資料不變）
2. **reason_100w 為何強制 minLength 100 字（不允許過關放寬）？** — 「100 字書面」是這套訓練的唯一交付物；放寬等於放棄訓練本質
3. **AI 完全禁用 + ai_disabled_banner role="alert" 的設計** — Card 9 是「判斷力訓練」最後守門員；即使 M2+ 站內 LLM 串接也永遠不開放本卡 AI 輔助；role="alert" 確保螢幕閱讀器使用者也看到鐵律

### Step 3：實作方案（Option A）

- `Card9VerdictPage.tsx`
- `StepperContext` / `CardIntro` / `AiDisabledBanner` / `ModeIndicator` / `ScoresForm` / `ScoresSummary` / `JudgmentForm` / `SegmentedScale` / `ExitGate`
- `useDisplayMode` hook（讀 URL query + LocalStorage）
- `useScoreCalculation` hook（5 維度 → total_score）
- Zod schema for verdict（含 minLength 100 強制）
- RWD Tailwind

### 品質檢查清單（部署前必過）

#### 通用驗收
- [ ] 7 個 Section 依序渲染，stepper 顯示 current_step = 9
- [ ] ai_disabled_banner 強制顯示，不可被收合或關閉（role="alert" + aria-live="polite"）
- [ ] reason_100w textarea 接受 ≥ 100 字輸入；< 100 字時 char_counter 顯示紅字
- [ ] judgment 三選一切換時，next_action 自動預選對應選項
- [ ] exit_gate 4 個 check 全通過後 cta_next 解鎖
- [ ] 過關後 PainCard.status 依 judgment 正確寫入（true_pain → structured 等）
- [ ] 過關後 PainCard.current_step 寫入 10
- [ ] SegmentedScale 鍵盤可操作（左右箭頭切分數）
- [ ] reason_100w textarea 有 aria-describedby 連結到 char_counter

#### 教學模式專屬
- [ ] mode === 'teaching' 時 scores_form 顯示
- [ ] 5 個 SegmentedScale 可獨立選擇 1-5 分
- [ ] total_score 即時計算（sum of 5 scores），顯示為「N / 25」
- [ ] score_band_hint 依 total_score 動態顯示對應建議（20-25 / 15-19 / 0-14）
- [ ] teaching_warning CalloutBox 強制顯示，不可收合
- [ ] 不顯示「等級 A-F」或任何等級轉換
- [ ] level descriptions 與 worksheet 卡 9 對照表 100% 一致

#### 生產模式專屬
- [ ] mode === 'production' 時 scores_form 隱藏，scores_summary 顯示
- [ ] scores_summary 不顯示任何 1-5 / 0-25 數字
- [ ] 只用 ✓ checkmark 顯示「已完成 5 維度反思」
- [ ] 切回教學模式時，已填分數保留（無資料丟失）

#### 模式切換
- [ ] mode_indicator switch_link 可切換模式
- [ ] LocalStorage `painmap_worksheet:settings.display_mode` 正確寫入
- [ ] URL query `?mode=teaching` / `?mode=production` 可初始化模式
- [ ] 預設值為 teaching

#### Octalysis 黑帽掃描（生成程式碼後**必跑**，**Card 9 重點**）
- [ ] 是否出現 0-25 分轉 A-F 等級的 UI？→ 砍掉
- [ ] 是否有 Pain Quality Score 排行榜？→ 砍掉
- [ ] 是否有推送通知「你的 Pain Quality 提升 +N 分」？→ 砍掉
- [ ] 是否有 5 維度雷達圖 / 進度條（生產模式）？→ 砍掉
- [ ] 是否有「分享你的得分」按鈕？→ 砍掉
- [ ] 是否有 judgment 徽章（金 / 銀 / 銅）？→ 砍掉
- [ ] 是否有 AI 輔助寫 reason 按鈕？→ 砍掉（**Card 9 鐵律**）
- [ ] 是否有跨 PainCard 分數比較？→ 砍掉
- [ ] 是否有 streak / 過期警告？→ 砍掉

#### 禁用詞掃描
- [ ] 全頁面零出現「等級 A / B / C」「優秀 / 良好 / 普通 / 差」「Pain Quality 排行榜」「最佳痛點」「成功率 / 可行性」「AI 推薦你選真痛點」「AI 判斷這是真的」「你的判斷準確度」「分享你的得分」「升級為真痛點 / 降級為假痛點」「闖關」「streak」

#### 資料層
- [ ] M2+ 預留：對外 API 回傳 PainCard 時必須過濾 verdict.scores + total_score（除非 mode=teaching 顯式請求）
- [ ] 公開分享連結禁止顯示分數（只顯示 judgment + reason_100w + next_action）

---

**版本資訊**：Worksheet v1.0 ｜ Brand v1.0 ｜ 2026-05-02
