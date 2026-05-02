# Page-Level Spec: Card 9 — 真假判斷（純書寫）

> 對應 worksheet「卡片 9 ｜ 真假痛點判斷」。
> 卡 9 只有書寫——5 個蘇格拉底反思提示（純 UI 文字，不存資料）+ judgment + 100 字理由 + most_confident + least_confident + next_action。
> AI 在這張卡是**完全禁用**的（worksheet 鐵律：判斷必須人為書面）。

---

## [PAGE META]

- **page_name**: Card 9 — Verdict (Socratic Reflection)
- **route_path**: `/learn/worksheet/09`
- **page_type**: worksheet_card_critical
- **primary_goal**: 引導使用者完成書面真假判斷（≥ 100 字）+ most_confident / least_confident / next_action
- **secondary_goal**: 用 5 個蘇格拉底自問句（純 UI）幫使用者寫 100 字理由前先想清楚
- **target_users**: 完成卡 1-8、第一次寫真假判斷的初學者
- **entry_point**: 卡 8 完成後自動推進
- **expected_time_on_page**: 20-40 分鐘（書面判斷 ≥ 100 字需要思考時間）
- **prev_card**: `/learn/worksheet/08`（卡 8：訪談規劃）
- **next_card**: `/learn/worksheet/result`（痛點身份證匯出）

---

## [STRUCTURE: SECTIONS]

1. **stepper_context**
2. **card_intro**（含 AI 禁用聲明 + 唯一交付物宣告）
3. **socratic_reflection_panel**（5 個自問句純 UI 提示，不存資料）
4. **judgment_form**（judgment + reason_100w + most_confident + least_confident + next_action）
5. **reflection_footer**（反思條件 + 進入痛點身份證 CTA）

---

## [SECTION COMPONENT SPEC]

### Section: stepper_context

- **layout**: 全寬 sticky top，淺色背景，高度 56px
- **elements**:
  - stepper: CardProgressStepper / required / 9 個圓點，第 9 個 active
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
    - title: 「這張卡片 AI 完全不參與」
    - body: 「真假判斷是這套訓練的唯一交付物。AI 可以幫你蒐集證據（卡 6）、整理表（卡 7）、模擬訪談（卡 8），但『真的嗎』『值得嗎』這兩題永遠是你來判。」
  - delivery_reminder: CalloutBox Empowering / required /
    - title: 「這份填空簿的唯一交付物」
    - body: 「你不需要做產品、不需要架網站、不需要收錢。你只需要交出這個書面判斷。」
- **states**: default
- **copy_constraints**: title ≤ 14 字；ai_disabled_banner 不可省略

### Section: socratic_reflection_panel

> **這個區塊是純 UI 文字，不存任何資料**。5 個自問句僅作為使用者寫 100 字理由前的思考引導。

- **layout**: 全寬白底容器，最大寬 800px 置中；padding 32px；border-left 4px Primary Light
- **elements**:
  - section_title: H2 / required / 「先想想：寫 100 字理由前，自問這 5 件事」
  - section_subtitle: Body MD / required / 「這 5 個問題不會被存起來，純粹是讓你寫之前先把腦袋整理清楚。」
  - reflection_questions: ReflectionQuestion[5] / required（純文字 list，無輸入框）
    - q1:
      - icon: Body Bold / "1."
      - text: Body MD / 「**你能不能說出 3 個有名字的人，他們各自怎麼遇到這個問題？**」
    - q2:
      - icon: Body Bold / "2."
      - text: Body MD / 「**你看到這事每週發生幾次？是你猜的，還是有人具體告訴你？**」
    - q3:
      - icon: Body Bold / "3."
      - text: Body MD / 「**他為這個問題付出了什麼（時間、錢、心力、關係）？最多的那個是什麼？**」
    - q4:
      - icon: Body Bold / "4."
      - text: Body MD / 「**他現在的解法，最讓他不爽的一個點是什麼？用他的話寫。**」
    - q5:
      - icon: Body Bold / "5."
      - text: Body MD / 「**你最有把握的證據是什麼？最薄弱的環節是什麼？**」
  - bridge_text: Caption Italic / required / 「想清楚這 5 件事後，下面開始寫你的判斷。」
- **states**: default（純靜態文字，無互動）
- **copy_constraints**: 5 個問題完全用使用者第二人稱（「你」），不打分、不評等；最後一題（q5）會在下方 judgment_form 變成兩個必填欄位（most_confident / least_confident）

### Section: judgment_form

- **layout**: 全寬白底容器，最大寬 800px 置中；padding 32px；border-left 4px Accent #E8913A 強調這是「最終判斷區」
- **elements**:
  - section_title: H2 / required / 「你的書面判斷（這份填空簿的唯一交付物）」
  - judgment_radio: RadioGroup / required / 3 個選項，必須單選
    - option_true_pain:
      - value: `true_pain`
      - label: H3 / required / 「真痛點」
      - description: Body MD / required / 「我有足夠證據相信這是真的。下一步排訪談 / 進階段二。」
    - option_fake_pain:
      - value: `fake_pain`
      - label: H3 / required / 「假痛點」
      - description: Body MD / required / 「證據不支持。換題目，從卡 1 重新來。」
    - option_pending_interview:
      - value: `pending_interview`
      - label: H3 / required / 「還無法判斷」
      - description: Body MD / required / 「需要訪談 2-3 人後再回來重寫理由。這是最常見的結果，很正常。」
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
      - 「回去把卡 6 想清楚再來」/ value: `more_evidence`
      - 「換題目重新填一輪」/ value: `change_topic`（fake_pain 預設）
    - data_path: `verdict.next_action`
- **states**:
  - default: 所有欄位空白
  - judgment_selected: 選擇 judgment 後，next_action 自動預選對應選項（可手動改）
  - reason_filling: char_counter 即時更新；< 100 字時顯示紅字（不擋輸入），≥ 100 字變 Verified Green
  - autosaved: debounce 2 秒
- **copy_constraints**: judgment 文案必須與 worksheet 卡 9 一致；reason_100w minLength 強制 100 字（驗證在前端 + 反思條件判定）

### Section: reflection_footer

- **layout**: 全寬 sticky bottom，白底容器，padding 24px，shadow-md
- **elements**:
  - reflection_check: ReflectionHint / required
    - check_1: Bullet / 「judgment 已選」/ 自動勾選
    - check_2: Bullet / 「書面理由 ≥ 100 字」/ 自動勾選
    - check_3: Bullet / 「最有把握 + 最沒把握 都寫了」/ 自動勾選
    - check_4: Bullet / 「next_action 已選」/ 自動勾選
  - completion_status: Body MD / required / 「✓ 4/4 已寫完」或「還可以再想想 N 項」
  - cta_next: Button Primary Large / required / 「查看你的痛點身份證 →」/ -> `/learn/worksheet/result`
  - cta_back: Button Ghost / optional / 「← 回到卡 8」/ -> `/learn/worksheet/08`
  - status_change_preview: StatusPreview / required / 顯示「PainCard.status 即將變為：」+ 對應狀態
    - true_pain → `structured`
    - pending_interview → `pending_interview`
    - fake_pain → `archived_fake`
- **states**:
  - default: 4 個 check 都未滿足，cta_next 一般顯示
  - all_filled: cta_next 變 Amber CTA
- **copy_constraints**: cta_next ≤ 18 字；不可用「恭喜判定」「闖關成功」（避免遊戲化）

---

## [INTERACTION & STATE FLOW]

### 主要互動流程

1. 頁面載入 → 從 LocalStorage 讀取 PainCard
2. 渲染 5 個蘇格拉底反思提示（純 UI 靜態文字）
3. 使用者讀完 5 個自問句後，開始填 judgment_form
4. 使用者選 judgment → next_action 自動預選對應選項
5. 使用者寫 reason_100w → char_counter 即時更新，達 100 字變綠
6. 使用者填 most_confident + least_confident
7. 4 項全填 → cta_next 解鎖
8. 點 cta_next → 寫入 PainCard.status + current_step = 10 + 跳轉 `/learn/worksheet/result`

### 自動儲存策略

- LocalStorage debounce 2 秒
- judgment 切換時，next_action 自動更新但不覆寫使用者已手動選的值（用 dirty flag 判斷）

### 反思滿足後狀態變更

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
| Desktop (>1280px) | 5 個反思提示垂直堆疊；judgment 3 選項橫排 | 完整體驗 |
| Tablet (768-1280px) | 同 Desktop | — |
| Mobile (<768px) | reflection_panel padding 縮小；judgment 3 選項堆疊 | reflection_footer 改為固定底部 sticky |

---

## [DATA & API]

- **uses_api**: false（MVP）
- **localstorage_keys**:
  - `painmap-worksheet-v2`
- **data_paths_written**:
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
- **error_cases**:
  - 卡 1-8 任一卡未完成 → 顯示「卡 N 還沒完成，請先回去」+ 不可離開
  - LocalStorage quota exceeded → 友善錯誤

---

## [REFLECTION CONDITIONS]

### 反思條件（4 項全達才解鎖 cta_next）

| # | 條件 | 自動判定邏輯 | 未滿足訊息 |
| :- | :--- | :--- | :--- |
| 1 | judgment 已選 | `verdict.judgment` ∈ ['true_pain', 'fake_pain', 'pending_interview'] | 「想想看：請選真 / 假 / 待訪談」 |
| 2 | 書面理由 ≥ 100 字 | `verdict.reason_100w.length >= 100` | 「再多寫 N 字。具體說你看到 / 沒看到什麼」 |
| 3 | 最有把握 + 最沒把握 都寫了 | both `length >= 15` | 「寫一下你的把握與不確定」 |
| 4 | next_action 已選 | `verdict.next_action` ∈ ['interview', 'more_evidence', 'change_topic'] | 「請選下一步行動」 |

### 未滿足時

- 任一條件未滿足 → cta_next 仍可點，但顯示提示「想想看，再想清楚一點」
- **卡 9 沒有「失敗退回上一卡」路由**（因為卡 9 是判斷本身，不是資訊蒐集）
- 例外：使用者主動點 cta_back 回到卡 8（保留卡 9 已填資料）

### 狀態機影響

- 滿足條件離開時：依 `verdict.judgment` 寫入 `PainCard.status`：
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
| 寫 reason_100w | ❌ **永久禁用** | 100 字書面是「使用者必須親自做的職業訓練」 |
| 自動判定 true / fake | ❌ **永久禁用** | 違反 brand 第三原則：證據優於意見；不可由 AI 替代判斷 |
| 自動填 most_confident / least_confident | ❌ **永久禁用** | 自我反思必須親自做 |

### worksheet 鐵律對應

| Worksheet 鐵律 | 軟體實作 |
| :--- | :--- |
| 「真假判斷有書面理由（不是想想就過）」 | reason_100w minLength 100 字強制 |
| 「答案永遠來自真人訪談（卡 8）」 | next_action 預設 interview |
| 「AI 不可參與此卡」 | ai_disabled_banner 強制顯示 + 沒有任何 AI prompt 區塊 |

### 反模式：AI 輔助寫作的誘惑（卡 9 最容易出錯）

某些產品會做「AI 幫你潤飾 reason」「AI 建議下一步」，這在卡 9 必須**完全禁止**：

- ❌ 不可加「AI 幫你檢查 reason 是否完整」按鈕
- ❌ 不可加「AI 推薦下一步」按鈕
- ❌ 不可在 reason textarea 旁邊放「灌入 AI 模板」shortcut
- ❌ 即使是 M2+ 站內 LLM 串接，這張卡的 textarea 也永遠不可有 AI 輔助

理由：判斷力訓練的本質是「親自寫出 100 字」。如果讓 AI 代寫，就違反了整套 worksheet 的訓練目的。

---

## [OCTALYSIS HOOKS]

### 主驅動力：#2 Development & Accomplishment（發展與成就）

**設計實作**：
- 卡 9 通關 = 痛點身份證即將產出（整套 worksheet 的 capstone moment）
- reason_100w 達 100 字後 char_counter 變 Verified Green → 微小成就感
- 過關後自動進入卡 10（匯出），形成完整閉環

### 副驅動力：#4 Ownership & Possession

**設計實作**：
- 「**你的**判斷」這個敘事貫穿全頁
- judgment 是 single-decision，沒有「AI 建議」混淆
- LocalStorage 確保資料主權

### 反模式檢查清單（卡 9 最容易犯）

- ❌ 把 judgment 結果做成「成就徽章」（true_pain = 金徽章 / fake_pain = 銅徽章）
- ❌ 「分享你的判斷到社群」按鈕
- ❌ 跨 PainCard 比較「你之前的判斷準確嗎」
- ❌ AI 自動寫 reason_100w
- ❌ 「你的判斷準確嗎？AI 來幫你看看」（違反整套訓練）
- ❌ 任何分數 / 等級 / 排名 UI（鐵律：資料層完全沒有分數）

詳見 `references/anti_gamification_guardrails.md`。

---

## [EXCEPTION TO GLOBAL RULES]

- **AI 完全禁用 + ai_disabled_banner 強制顯示**：違反一般「AI 是助手」的全站定位。理由：判斷力訓練的核心。
- **reason_100w minLength 100 字強制**：違反一般「不限制輸入長度」原則。理由：worksheet 鐵律。

---

## [BRAND LANGUAGE RULES (PAGE-SPECIFIC)]

### 禁止用語

| 禁止 | 理由 |
| :--- | :--- |
| 「Pain Quality Score」「品質分數」「總分」 | 鐵律：資料層沒有分數 |
| 「等級 A / B / C」「優秀 / 良好 / 普通 / 差」 | 學校式評判 — 違反 brand |
| 「教學模式」「生產模式」「mode toggle」 | 鐵律：沒有雙模式 |
| 「成功率」「可行性 X%」 | 全域禁令 |
| 「AI 推薦你選真痛點」「AI 判斷這是真的」 | 違反 worksheet 鐵律 |
| 「分享你的得分」「比比看誰得分高」 | 違反 brand + 反模式 |
| 「升級為真痛點 / 降級為假痛點」 | 遊戲化等級制 |
| 「過關條件」「闖關成功」 | 反蘇格拉底措辭 |

### 建議用語

| 建議 | 場景 |
| :--- | :--- |
| 「想想看」 | 反思提示 |
| 「真痛點 / 假痛點 / 待訪談」 | judgment 三選 |
| 「書面理由」 | reason_100w |
| 「下一步行動」 | next_action |
| 「省下 3 個月走錯路的時間」 | 假痛點賦權語（worksheet 原文） |

### 語調

- **Empowering**：「你來判斷，不是 AI 判斷」
- **Calm**：reason_100w 達 100 字時不用慶祝動畫，只變綠
- **Anti-anxiety**：判定假痛點不是「失敗」，是「省下 3 個月走錯路的時間」
- **Honest**：least_confident 鼓勵誠實寫不確定 — 「假裝有把握」是這套訓練的最大反模式

---

## [ACCEPTANCE CRITERIA]

### 通用驗收

- 5 個 Section 依序正確渲染，stepper 顯示 current_step = 9
- ai_disabled_banner 強制顯示，不可被收合或關閉
- 5 個蘇格拉底反思提示為純 UI 靜態文字（**不是輸入欄位**，不寫入資料）
- reason_100w textarea 接受 ≥ 100 字輸入；< 100 字時 char_counter 顯示紅字
- judgment 三選一切換時，next_action 自動預選對應選項
- 4 項反思條件全達 → cta_next 一般可點 / 未達 → cta_next 仍可點但顯示提示
- 過關後 PainCard.status 依 judgment 正確寫入（true_pain → structured 等）
- 過關後 PainCard.current_step 寫入 10
- 不出現禁用語（「等級」「成功率」「AI 推薦」「分數」等）

### 反模式驗收（必須全部不出現）

- ❌ 任何分數 UI（雷達圖、進度條、總分）
- ❌ mode toggle / 教學或生產模式切換
- ❌ AI 輔助寫 reason 按鈕
- ❌ 「成就徽章」（金 / 銀 / 銅）

### 資料層驗收

- `PainCard.verdict` 只有 5 個欄位：judgment、reason_100w、most_confident_evidence、least_confident、next_action
- LocalStorage key 為 `painmap-worksheet-v2`

### RWD / 無障礙驗收

- 三斷點佈局正確
- ai_disabled_banner 用 role="alert" + aria-live="polite"
- reason_100w textarea 有 aria-describedby 連結到 char_counter
- 5 個蘇格拉底提示用語意化 `<ol>` 標籤
