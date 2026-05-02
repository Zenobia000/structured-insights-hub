# E2E Scenarios — PainMap Worksheet 端對端測試劇本

> **配套文件**：`product/data_model.md`、`references/exit_gates_matrix.md`、`design/pages/00-10_*.md`、`api/ai_proxy_spec.md`
> **測試對象**：MVP 階段（LocalStorage + 外部 ChatGPT 複製模式）
> **測試框架建議**：Playwright + 中文 locale（`zh-TW`）+ Vitest（單元）
> **測試鐵律**：所有失敗訊息必須符合 brand voice — 不焦慮、賦權、結構化；任何頁面不可出現分數百分比 / 倒數計時 / streak / 排行榜 / FOMO 文案。

---

## 0. 測試框架建議

### 0.1 工具棧

| 用途 | 工具 | 備註 |
| :--- | :--- | :--- |
| E2E 自動化 | Playwright @ latest | 支援 chromium / webkit / firefox 跨瀏覽器 |
| 中文 locale | `playwright.config.ts` 設定 `locale: 'zh-TW'`、`timezoneId: 'Asia/Taipei'` | 影響 `Intl.DateTimeFormat`、accessibility tree 文案 |
| Mock LocalStorage | `page.addInitScript()` 注入 `localStorage.setItem(...)` | 跨 session 持續性場景必備 |
| Mock AI 回覆 | `page.fill()` 直接灌入 textarea，不走真實 API | MVP 是複製模式，AI 回覆由使用者貼回，不需 mock 網路層 |
| 視覺比對 | `expect(page).toHaveScreenshot()` | 用於 brand 違規檢測（截圖比對黑帽元素） |
| A11y | `@axe-core/playwright` | WCAG AA 自動掃描 |

### 0.2 測試目錄結構

```
tests/e2e/
├── fixtures/
│   ├── lin-teacher-paincard.json    # 林老師完整 PainCard（happy path 用）
│   ├── lin-teacher-incomplete.json  # 卡 5 為止的中段 PainCard（resume 用）
│   ├── ai-responses/
│   │   ├── card-3-stuck-formula.txt    # 卡 3 AI 校對範例回覆
│   │   ├── card-4-workaround-list.txt  # 卡 4 AI 5 個 workaround
│   │   ├── card-5-tradeoff.txt         # 卡 5 AI 兩端取捨候選
│   │   ├── card-6-evidence-good.txt    # 卡 6 8 題正常回覆
│   │   ├── card-6-evidence-solution-mode.txt  # 卡 6 含「建議製作 App」
│   │   ├── card-7-judgment-table.txt   # 卡 7 痛點判斷表
│   │   └── card-8-interview-sim.txt    # 卡 8 模擬訪談熱身
├── helpers/
│   ├── localStorage.ts             # setStoredPainCard / getStoredPainCard
│   ├── stepper.ts                  # expectStepperCompleted(n)
│   └── brandGuards.ts              # expectNoBlackHatElements(page)
├── scenario-01-happy-true-pain.spec.ts
├── scenario-02-happy-fake-pain.spec.ts
├── scenario-03-pending-interview.spec.ts
├── scenario-04-card2-fail-route.spec.ts
├── scenario-05-card6-solution-mode.spec.ts
├── scenario-06-cross-session.spec.ts
├── scenario-07-export-formats.spec.ts
├── scenario-08-a11y-keyboard.spec.ts
└── scenario-09-blackhat-octalysis.spec.ts
```

### 0.3 共用 helpers（pseudo-code）

```typescript
// tests/e2e/helpers/localStorage.ts
export async function setStoredPainCard(page: Page, paincard: PainCard) {
  await page.addInitScript((data) => {
    localStorage.setItem('painmap_worksheet:cards', JSON.stringify({
      current_card_id: data.id,
      cards: { [data.id]: data },
      schema_version: '1.0',
    }));
  }, paincard);
}

export async function getStoredPainCard(page: Page): Promise<PainCard | null> {
  return await page.evaluate(() => {
    const raw = localStorage.getItem('painmap_worksheet:cards');
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data.cards[data.current_card_id] ?? null;
  });
}

// tests/e2e/helpers/brandGuards.ts
export async function expectNoBlackHatElements(page: Page) {
  // 違規關鍵字（DOM 文字）
  const forbiddenPhrases = [
    '恭喜', '達成成就', '闖關成功', 'Level Up', '解鎖',
    '限時開放', '名額有限', '錯過就沒了', '再不做就',
    '排行榜', '本月最強', '徽章', 'streak', '連續完成天數',
    '已完成 0%', '已完成 33%',  // 進度百分比偽 score
    '成功率', '可行性 %',
  ];
  const html = await page.content();
  for (const phrase of forbiddenPhrases) {
    expect(html, `禁止用語出現：${phrase}`).not.toContain(phrase);
  }

  // 不可有倒數計時器（除「30 秒開始第一張卡」這個時間承諾）
  const timers = await page.locator('[data-countdown="true"]').count();
  expect(timers).toBe(0);

  // 不可有星等 / 排名圖示
  expect(await page.locator('.star-rating, .rank-badge, .achievement-icon').count()).toBe(0);
}
```

---

## 1. 測試環境

### 1.1 LocalStorage Mock 策略

| 場景 | 策略 |
| :--- | :--- |
| Happy path（從零開始）| `page.context().clearCookies()` + 不注入 LocalStorage |
| 跨 session 恢復 | `setStoredPainCard()` 注入未完成卡的 fixture |
| 已完成可匯出 | 注入 status === 'structured' 的完整 PainCard |

### 1.2 AI 回覆 Mock

MVP 階段為「複製到外部 ChatGPT」模式，AI 回覆由使用者**手動貼回 textarea**。測試只需：

1. 不真的開啟 ChatGPT
2. 用 `page.fill()` 將 fixture 中的 AI 回覆灌入對應 textarea
3. 觸發前端解析（`button:has-text("解析並填入下方欄位")`）

**M2+ 站內 LLM API**（不在本測試範圍）：另以 `MSW` 或 Playwright `route()` 攔截 `/api/ai/run-prompt`。

### 1.3 測試資料 Fixture（林老師補習班範例）

引用 `references/pain_card_schema.md § 範例 1`，產出 `lin-teacher-paincard.json`（完整 PainCard）。  
另產 `lin-teacher-incomplete.json`（only 填到卡 5）作為 resume 場景輸入。

---

## 2. 測試劇本

### Scenario 1: Happy path — 真痛點完整流程

**目的**：驗證從入口頁進入 → 9 卡填寫 → 卡 9 判斷真痛點 → 卡 10 匯出 Markdown → CTA 進 PainMap App 全流程資料一致性。

#### Given

- 全新訪客，瀏覽器 LocalStorage 為空
- 測試資料：林老師補習班案例（fixture: `lin-teacher-paincard.json`）

#### When / Then（Gherkin 結構）

```gherkin
Scenario: 真痛點完整流程
  Given 我打開 https://painmap.local/learn/worksheet
  Then 我看到 hero headline「9 張卡片填空，學會判斷一句抱怨是真痛點還是假痛點」
  And  我看到「30 秒開始第一張卡」CTA
  And  我「不」看到「我有未完成的 PainCard」resume_card

  When 我點擊「30 秒開始第一張卡」
  Then 系統 POST /api/paincards 建立 PainCard（status='draft', current_step=1）
  And  LocalStorage 寫入 painmap_worksheet:cards.current_card_id
  And  我被導向 /learn/worksheet/01?id={uuid}

  # === 卡 1: 抱怨原句 ===
  When 我在 verbatim 欄位填入林老師原句（≥ 10 字）
  And  我填入 source_name="林老師", source_relation="我表妹的數學老師"
  And  我填入 datetime="2026-04-15", scene="陪他從 21:00 跟到 02:30"
  And  我點擊「下一張卡 →」
  Then LocalStorage 中 PainCard.complaint 5 個欄位皆已寫入
  And  Stepper 顯示卡 1 已完成（Verified Green ✓）
  And  我被導向 /learn/worksheet/02

  # === 卡 2: 三個有名字的人 ===
  When 我填入 background="30-50 歲補習班老師"
  And  我填入 list[0]={name:"林老師", contact:"LINE", relation:"表妹的數學老師"}
  And  我填入 list[1]={name:"王老師", contact:"FB Messenger", relation:"林老師介紹"}
  And  我填入 list[2]={name:"陳老師", contact:"電話", relation:"國中同學的爸爸"}
  And  我點擊「下一張卡 →」
  Then LocalStorage 中 PainCard.people.list.length === 3
  And  Stepper 顯示卡 2 已完成
  And  我被導向 /learn/worksheet/03

  # === 卡 3: 卡關公式（AI 校對）===
  When 我點擊「📋 複製 prompt 到 ChatGPT」
  Then 剪貼簿包含內建 prompt + 卡 1+2 變數已插值
  When 我（模擬外部跑 AI）將 ai-responses/card-3-stuck-formula.txt 貼到 raw_response
  And  我手動填入 ai_polished（用「我每次要 ___，都會卡在 ___」句型）
  And  我填入 3 個 ai_clarifying_answers（回答 AI 的 3 個追問）
  And  我勾選「我確認此版本」（confirmed = true）
  And  我點擊「下一張卡 →」
  Then LocalStorage 中 stuck_formula.confirmed === true
  And  我被導向 /learn/worksheet/04

  # === 卡 4: 現在怎麼解 ===
  When 我填入 tool_name="LINE + Excel 成績表"
  And  我填入 why_still_stuck="每個資料源都要重新翻找"
  And  我點擊「請 AI 列 5 個常見 workaround」並貼回 5 個 ai_alternatives
  And  我填入 user_dissatisfactions[0]="Notion 試過放棄, 太花時間"
  And  我填入 user_dissatisfactions[1]="ChatGPT 寫得太罐頭"
  And  我填入 user_dissatisfactions[2]="助教請不起"
  And  我點擊「下一張卡 →」
  Then LocalStorage 中 workaround.user_dissatisfactions.length >= 3
  And  我被導向 /learn/worksheet/05

  # === 卡 5: 兩件事不能同時要 ===
  When 我填入 side_a="家長要看見「我的孩子」被個別關照（具體事件、語氣有溫度）"
  And  我填入 side_b="老師一週只有 2-3 小時可寫 30 則（每則 < 6 分鐘）"
  And  我選擇 sacrificed='a'
  And  我填入 sacrificed_reason="時間先到，所以個別溫度被擠壓成模板化句子"
  And  我點擊「下一張卡 →」
  Then LocalStorage 中 contradiction.side_a.length >= 10
  And  LocalStorage 中 contradiction.sacrificed === 'a'
  And  LocalStorage 中 contradiction.sacrificed_reason.length >= 10
  And  我被導向 /learn/worksheet/06

  # === 卡 6: AI 證據蒐集（最重要）===
  When 我選擇 ai_tool="chatgpt_dr"
  And  我填入 ai_tool_reason="第一次跑研究"
  And  我點擊「📋 複製證據蒐集 prompt」
  Then 剪貼簿 prompt 包含三道反 solution mode 防護字句
       - "請不要幫我設計產品，也不要提出商業模式"
       - "請不要建議 App、SaaS、解決方案"
       - "請只做痛點探索與證據蒐集"
  When 我貼回 ai-responses/card-6-evidence-good.txt 到 raw_response
  And  我點擊「解析並填入下方欄位」
  Then 系統 regex 偵測「不含」FORBIDDEN_PATTERNS（建議製作 App / 你應該開發 / SaaS 模式 等）
  And  no_solution_check_passed === true
  When 我手動分欄填入 8 題答案（q1-q8）
  And  我點擊「下一張卡 →」
  Then LocalStorage 中 ai_evidence.eight_answers 8 題全非空
  And  我被導向 /learn/worksheet/07

  # === 卡 7: 自己先猜 + 讀 AI ===
  Given AI 回覆區處於毛玻璃模糊狀態（時序鎖）
  When 我填入 guesses 4 欄（最痛人 / 場景 / 不滿 / 假痛點）
  Then 「請 AI 整理痛點判斷表」按鈕解鎖
  And  AI 回覆區（卡 6 raw_response）解除模糊
  When 我勾選 4 個 ai_checkpoints_passed 全 true
  And  我貼回 ai-responses/card-7-judgment-table.txt 到 pain_judgment_table
  And  我填入 deltas 3 欄（biggest_diff / ai_added / guess_unsupported）
  And  我點擊「下一張卡 →」
  Then 我被導向 /learn/worksheet/08

  # === 卡 8: 訪談規劃 ===
  When 我填入 targets[0]={persona:"中小型補習班老師", contact_known:true, contact_info:"林老師", planned_time:"2026-04-22"}
  And  我填入 questions = ["你最近一次寫家長回報是什麼時候？花了多久？", ...]
  And  我勾選 interview_taboos_understood = true
  And  我（可選）點擊「請 AI 模擬訪談（熱身）」並貼回 ai_simulated_response
  And  我點擊「下一張卡 →」
  Then 我被導向 /learn/worksheet/09

  # === 卡 9: 真假判斷（AI 完全禁用）===
  Then 頁面上「不」存在任何 AI 按鈕（aria-label 不含 "AI"）
  And  頁面頂端顯示 5 個 Socratic 提示問題（純 UI，無 input）
  When 我選擇 judgment="true_pain"
  And  我填入 reason_100w（≥ 100 字 — 用 fixture 林老師範例）
  And  我填入 most_confident_evidence + least_confident
  And  我選擇 next_action="interview"
  And  我點擊「產出痛點身份證 →」
  Then LocalStorage 中 PainCard.status === 'structured'
  And  PainCard.verdict.reason_100w.length >= 100
  And  PainCard.current_step === 10
  And  我被導向 /learn/worksheet/result

  # === 卡 10: 痛點身份證匯出 ===
  Then 我看到「你的痛點身份證」H1
  And  status_badge 顯示 Verified Green「真痛點」
  And  pain_id_card 9 個欄位區塊全部正確顯示（從 LocalStorage 讀取）
  And  next_step_cta 顯示 variant_true_pain 變體（背景 Verified Light Green）
  And  primary_cta 文字「進入 PainMap App →」

  When 我點擊「下載 .md」
  Then 瀏覽器下載檔名為 paincard-{slug}-2026-04-15.md（slug = verbatim 前 20 字）
  And  Markdown 內容包含 9 卡精華
  And  LocalStorage 中 PainCard.exported.formats 包含 'markdown'

  When 我點擊「進入 PainMap App →」
  Then 我被導向 /app/start?import_paincard={uuid}
```

#### Verify（資料層斷言）

| 檢查項 | 期望值 |
| :--- | :--- |
| `localStorage['painmap_worksheet:cards'].cards[id].status` | `'structured'` |
| `.current_step` | `10` |
| `.complaint.verbatim.length` | `>= 10` |
| `.people.list.length` | `=== 3` |
| `.workaround.user_dissatisfactions.length` | `>= 3` |
| `.ai_evidence.no_solution_check_passed` | `true` |
| `.verdict.judgment` | `'true_pain'` |
| `.verdict.reason_100w.length` | `>= 100` |
| `.exported.formats` | `includes 'markdown'` |

#### 預期 UI / 文案

- 全程不出現「成功率」「點子驗證」「Level Up」字眼
- 卡 9 過關後**不**播放慶祝動畫 / 紙花
- pain_id_card 不顯示「已完成 100%」百分比

---

### Scenario 2: Happy path — 假痛點流程

**目的**：驗證卡 9 判斷 fake_pain 後 PainCard 封存、文案賦權、CTA 換題目重來。

#### Given

- 已完成卡 1-8 的 PainCard fixture
- 但人群 / 證據都偏弱（modified fixture: `weak-evidence-paincard.json`）

#### When / Then

```gherkin
Scenario: 假痛點流程
  Given LocalStorage 已注入 PainCard.current_step=9 + 卡 1-8 全填（證據偏弱版本）

  When  我打開 /learn/worksheet/09
  And   我選擇 judgment="fake_pain"
  And   我填入 reason_100w="親眼觀察後發現他其實沒在花時間解這個問題..."（≥ 100 字）
  And   我填入 most_confident_evidence + least_confident
  And   我選擇 next_action="change_topic"
  And   我點擊「產出痛點身份證 →」
  Then  LocalStorage 中 PainCard.status === 'archived_fake'

  When  我被導向 /learn/worksheet/result
  Then  status_badge 顯示 Muted Gray「假痛點（已封存）」
  And   next_step_cta 顯示 variant_fake_pain 變體（背景 Muted Gray）
  And   reasoning 文字包含 worksheet 原文「省下 3 個月走錯路的時間」
  And   primary_cta 文字「換題目，從卡 1 開始 →」
  And   stage_handoff_panel 中 stage_2_block 隱藏（避免誤導）

  When  我點擊「換題目，從卡 1 開始 →」
  Then  舊 PainCard 保留 status='archived_fake'
  And   建立新 PainCard（new uuid）
  And   我被導向 /learn/worksheet/01?id={new_uuid}
```

#### Verify

| 檢查項 | 期望值 |
| :--- | :--- |
| 舊 PainCard `.status` | `'archived_fake'` |
| 舊 PainCard 在 LocalStorage `.cards[old_uuid]` | 仍存在（資料保留） |
| 新 PainCard `.status` | `'draft'` |
| `current_card_id` | 切換為 new_uuid |
| 文案不出現 | 「失敗」「不對」「錯誤」「重來吧」 |
| 文案出現 | 「省下 3 個月走錯路的時間」（worksheet 原文） |

---

### Scenario 3: 待訪談流程

**目的**：驗證卡 9 判斷 pending_interview 後狀態暫停、提醒訪談、可從 landing 恢復。

```gherkin
Scenario: 待訪談流程
  Given 已填到卡 9，證據力中等
  When  我選擇 judgment="pending_interview"
  And   我填入 reason_100w（≥ 100 字，包含「樣本不足，需訪談 2-3 人才能判斷」）
  And   我填入 most_confident_evidence + least_confident
  And   我選擇 next_action="interview"
  And   我點擊「產出痛點身份證 →」
  Then  LocalStorage 中 PainCard.status === 'pending_interview'

  When  我被導向 /learn/worksheet/result
  Then  status_badge 顯示 Caution Amber「待訪談」
  And   next_step_cta 顯示 variant_pending_interview 變體（背景 Caution Light Amber）
  And   reasoning 文字「訪談 2-3 人後回來重新打分」
  And   primary_cta 文字「查看訪談對象 →」
  And   stage_handoff_panel 中 handoff_cta 不顯示（先訪談）

  # 跨 session 恢復
  When  我關閉瀏覽器
  And   我重新打開 /learn/worksheet
  Then  我看到「我有未完成的 PainCard」resume_card
  And   resume_card 文字「上次填到「卡 10：身份證匯出」（待訪談）」
  And   resume_card subtext 顯示 created_at + updated_at

  When  我點擊「繼續上次的進度」
  Then  我被導向 /learn/worksheet/result?id={uuid}
  And   pain_id_card 完整顯示
```

#### Verify

| 檢查項 | 期望值 |
| :--- | :--- |
| `.status` | `'pending_interview'` |
| Resume card 顯示條件 | `status !== 'structured' && status !== 'archived_fake'` ✓ |
| Pending interview 仍顯示 resume | true（waorksheet 設計：訪談中可重打分） |

---

### Scenario 4: 失敗路由 — 卡 2 失敗回卡 1

**目的**：驗證卡 2 填合成 persona（「補習班老師 A」）→ 過關擋住 → 友善提示 → 點「回卡 1」。

```gherkin
Scenario: 卡 2 合成 persona 擋過關
  Given 我已通過卡 1（complaint 5 欄位齊備）
  When  我打開 /learn/worksheet/02
  And   我填入 background="30-50 歲補習班老師"
  And   我填入 list[0]={name:"補習班老師 A", contact:"無", relation:"代稱"}
  And   我點擊「下一張卡 →」
  Then  G2.6 觸發（name pattern 偵測代稱）
  And   過關按鈕保持 disabled
  And   彈出 caution panel（不是紅色 alert）
  And   panel 文案：
        - icon: caution（橘色 #D97706）
        - title: 「這張卡還缺一些資訊」
        - body: 「你寫的「補習班老師 A」可能是代稱，請填真名」
        - primary_cta: 「回卡 1，找一個真人聊再回來」
        - secondary_cta: 「先存草稿」
  And   panel 文案「不」包含「失敗」「錯誤」「不及格」「打分」字眼

  When  我點擊 primary_cta「回卡 1」
  Then  我被導向 /learn/worksheet/01
  And   complaint 欄位資料保留
  And   people 已填內容也保留（標記為 stale=true，方便回填修正）
```

#### Verify

| 檢查項 | 期望值 |
| :--- | :--- |
| 過關按鈕狀態 | `disabled` |
| Caution panel 顏色 token | `--color-caution: #D97706`（不是 `--color-error: red`） |
| 文案禁用詞 | 不出現「錯」「失敗」「不及格」 |
| LocalStorage 退卡時 | `current_step` 退回 1，但 `people.list` 保留 |

---

### Scenario 5: 反 solution mode — 卡 6 AI 推銷解法

**目的**：驗證卡 6 貼入含「建議製作 App」的 AI 回覆 → `no_solution_check_passed = false` → 顯示 fallback prompt。

```gherkin
Scenario: 卡 6 AI 進入 solution mode
  Given 我已通過卡 1-5
  When  我打開 /learn/worksheet/06
  And   我選擇 ai_tool="chatgpt_dr" + ai_tool_reason="第一次"
  And   我點擊「📋 複製證據蒐集 prompt」
  And   我（模擬）將下列違規回覆貼到 raw_response：
        """
        基於以上分析，建議製作 App 解決家長 LINE 的痛點。
        你應該開發一個 SaaS 平台，每月訂閱 990 元...
        商業模式可以採用 freemium...
        """
  And   我點擊「解析並填入下方欄位」
  Then  系統 regex 偵測（FORBIDDEN_PATTERNS）：
        - /建議.{0,10}(製作|開發|做一個|打造).{0,10}(App|產品|平台|軟體|工具)/  ✓ 觸發
        - /你應該.{0,10}(開發|設計|做)/  ✓ 觸發
        - /商業模式可以/  ✓ 觸發
  And   ai_evidence.no_solution_check_passed = false（自動寫入）
  And   過關按鈕保持 disabled
  And   彈出 fallback panel：
        - title: 「AI 在回覆裡幫你想了解決方案」
        - body: 「這會把你帶離痛點探索。請複製這段 guard 回 ChatGPT 重跑：『不要建議產品方案，只幫我把痛點看清楚。』」
        - primary_cta: 「重置 prompt 並重新複製（含補強 guard）」
        - secondary_cta: 「我自己手動清理回覆」

  When  我點擊 primary_cta
  Then  剪貼簿被覆寫為「補強 prompt」（ai_prompt_library.md §4.8）：
        包含「⚠️ 鐵律：我現在不是要做產品...」
  And   raw_response textarea 被清空（但卡 1-5 變數仍保留）

  When  我（模擬）將乾淨版本回覆貼回 raw_response
  And   我點擊「解析並填入下方欄位」
  Then  regex 偵測未觸發
  And   no_solution_check_passed = true
  And   過關按鈕變為 enabled
```

#### Verify — 故意觸發 false positive

```gherkin
Scenario: 反 solution mode — 不可誤判中性句
  Given 我貼入 raw_response 為：
        "我建議你不要急著做產品，先把痛點看清楚。"
  Then  regex /建議.{0,10}(製作|開發|做一個|打造).{0,10}(App|產品|平台|軟體|工具)/
        - 「建議...不要急著做產品」中間 > 10 字 → 不觸發 ✓
  And   no_solution_check_passed 不被誤改為 false
```

> **注意**：FORBIDDEN_PATTERNS 中 `{0,10}` 字元上限是反 false positive 的關鍵。  
> 如果改成 `.*` 會誤判此中性句，必須保留長度限制。

---

### Scenario 6: 跨 session 持續性

**目的**：填到卡 5 → 關閉 tab → 重新打開 landing → 點 resume → 恢復到卡 5。

```gherkin
Scenario: 跨 session 恢復
  Given 我打開 /learn/worksheet 並建立新 PainCard
  And   我完成卡 1-5（current_step = 5）
  And   LocalStorage 自動寫入（debounce 500ms 後）

  When  我關閉 tab
  And   我重新打開 /learn/worksheet
  Then  resume_card 顯示
  And   resume_card title「我有未完成的 PainCard」
  And   resume_card description「上次填到「卡 5：矛盾選擇」，繼續嗎？」
  And   resume_card subtext「建立於 YYYY-MM-DD HH:mm · 最後修改 YYYY-MM-DD HH:mm」

  When  我點擊「繼續上次的進度」
  Then  系統讀取 current_card_id
  And   我被導向 /learn/worksheet/05?id={uuid}
  And   卡 5 已填欄位（side_a, side_b, sacrificed, sacrificed_reason）正確復原
  And   stepper 顯示卡 1-4 ✓ + 卡 5 active

  # 同樣場景但選擇捨棄
  When  我點擊「捨棄這份，從頭開始」
  Then  彈出確認 modal「真的捨棄嗎？資料只在本機，無法復原」
  When  我點擊「我已備份，捨棄」
  Then  LocalStorage 被清除舊 PainCard
  And   建立新 PainCard
  And   我被導向 /learn/worksheet/01?id={new_uuid}
```

#### Verify

| 檢查項 | 期望值 |
| :--- | :--- |
| Auto-save debounce | `500ms` |
| Resume card 條件 | `status !== 'structured' && !== 'archived_fake'` |
| 「捨棄」按 cancel | LocalStorage 不變 |
| 「捨棄」按 confirm | 舊 paincard 被刪 + 建立新的 |

---

### Scenario 7: 匯出三格式驗證

**目的**：驗證 Markdown / JSON / PDF 三格式檔名 + 內容。

```gherkin
Scenario: 三格式匯出
  Given 我已完成 PainCard（structured，林老師案例）

  # === Markdown ===
  When  我點擊「下載 .md」
  Then  下載檔名 paincard-我每週六晚上要寫-2026-04-15.md
        - slug = complaint.verbatim 前 20 字（取代空格為 -，移除特殊字）
        - YYYY-MM-DD = updated_at 日期
  And   檔案 mime type === 'text/markdown'
  And   檔案內容包含區塊：
        - "# 痛點身份證"
        - "**主人翁**: 林老師"
        - "**判定**: 真痛點"
        - "## 場景" + 完整 verbatim
        - "## 兩件事不能同時要" + side_a / side_b / sacrificed / sacrificed_reason
        - "## AI 找到的關鍵證據"
        - "## 我自己猜 vs AI 答的差異"
        - "## 我的判斷" + reason_100w + most_confident_evidence + least_confident + next_action
  And   PainCard.exported.formats 已 push 'markdown'
  And   PainCard.exported.exported_at 為 ISO8601

  # === JSON ===
  When  我點擊「下載 .json」
  Then  下載檔名 paincard-我每週六晚上要寫-2026-04-15.json
  And   內容是有效的 JSON
  And   parsed JSON 完整等於 PainCard 物件
  And   JSON Schema 驗證通過（references/pain_card_schema.md）

  # === PDF ===
  When  我點擊「下載 .pdf」
  Then  loading spinner 顯示「PDF 產生中」
  And   5 秒內下載完成
  And   檔名 paincard-我每週六晚上要寫-2026-04-15.pdf
  And   PDF 為 A4 一頁
  And   字體為 Noto Sans TC
  And   PDF 內容包含 9 卡精華

  # === 分享連結（不是檔案下載）===
  When  我點擊「分享身份證」並選「複製可分享連結」
  Then  share_field_selector 預設只勾 "verdict.judgment + reason_100w"

  When  我複製連結並用無痕視窗打開
  Then  分享頁面只顯示 judgment + reason_100w + 我選擇分享的欄位
```

#### Verify — 匯出反模式

```gherkin
Scenario: 匯出不需要登入
  Given 我未登入（無 auth cookie）
  When  我點擊「下載 .md」
  Then  下載成功（不需登入）
  And   不出現「需要登入才能匯出」彈窗
  And   不出現「Pro 解鎖更多匯出格式」字眼
```

---

### Scenario 8: A11y 鍵盤瀏覽

**目的**：驗證所有可互動元素 keyboard accessible，無鍵盤陷阱。

```gherkin
Scenario: 鍵盤完整 tab 走完 landing
  Given 我打開 /learn/worksheet
  And   我未使用滑鼠

  When  我按 Tab 鍵 1 次
  Then  焦點在 hero primary_cta「30 秒開始第一張卡」
  And   focus ring 顯示為 PainMap Teal #2D7D8A

  When  我按 Tab 鍵 2 次
  Then  焦點在 hero secondary_cta「看看 9 張卡片長什麼樣」

  When  我按 Tab 鍵繼續
  Then  焦點順序為：three_step_teaching 三段卡 → expectation_calibration 連結 → example_paincard_preview → start_or_resume → stage_relationship → cta_footer

  When  我在 hero primary_cta 上按 Enter
  Then  CTA 觸發（建立 PainCard + 導向 /01）

  When  我在 hero primary_cta 上按 Space
  Then  CTA 觸發（同 Enter）

  # === 卡 9 進階測試 ===
  Given 我打開 /learn/worksheet/09
  When  我用 Tab 走判斷三選一 radio group
  Then  radio 之間可用 ← → 方向鍵切換
  And   螢幕閱讀器讀出「真痛點，3 個選項中的第 1 個」

  # === 鍵盤陷阱檢測 ===
  Given 我在卡 10 中開啟 delete_confirm_modal
  When  我按 Tab 鍵在 modal 內循環
  Then  焦點在 modal 內 trap（不會 tab 出去）
  And   按 Esc 鍵關閉 modal 並返回觸發按鈕
```

#### Verify — A11y 自動掃描

```typescript
// 使用 @axe-core/playwright
test('卡 1 通過 WCAG AA', async ({ page }) => {
  await page.goto('/learn/worksheet/01');
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2aa', 'wcag21aa'])
    .analyze();
  expect(violations).toEqual([]);
});
```

#### 預期 A11y 屬性

| 元素 | 屬性 |
| :--- | :--- |
| 9 卡 stepper 圓點 | `aria-current="step"` 在 active；`aria-label="卡 N: {card_name}, 已完成"` 等 |
| 過關 CTA disabled 時 | `aria-disabled="true"` + tooltip 提示哪個欄位缺 |
| AI 回覆毛玻璃覆蓋（卡 7）| `aria-live="polite"` 通知「先寫猜測才能看 AI」 |
| 匯出按鈕 | `aria-label="下載 Markdown 格式的痛點身份證"` |

---

### Scenario 9: 黑帽 Octalysis 違規偵測

**目的**：整站爬蟲檢查 — 無分數百分比 / 無倒數計時 / 無 streak / 無排行榜 / 無 FOMO 文案。**這是 brand 安全網**。

```gherkin
Scenario: 全站黑帽元素掃描
  Given 我用爬蟲走過全部 11 個頁面 + 設定頁 + 歷史頁

  Then  整站不出現以下文案（regex 全文搜）：
        - "恭喜" / "達成成就" / "闖關成功"
        - "Level Up" / "等級提升" / "解鎖"
        - "限時開放" / "名額有限" / "倒數" / "錯過就沒了"
        - "排行榜" / "本月最強" / "Top 10"
        - "徽章" / "streak" / "連續 N 天" / "連勝"
        - "你已完成 33%" / "完成度 50%"  # 進度百分比偽 score
        - "成功率" / "可行性 95%"
        - "你是第 N 位完成的使用者"
        - "立即匯出" / "快速分享"  # FOMO

  And   整站不出現以下 DOM 元素：
        - data-countdown="true"
        - .star-rating
        - .achievement-badge
        - .leaderboard
        - .progress-bar[data-style="percentage"]

  And   整站只有以下「合法」進度視覺：
        - hero ProgressVisual: 9 個圓點 step indicator（無百分比）
        - card_progress_stepper: 9 步進度條（顯示 active / completed，不顯示 %）

  # === 文案賦權 vs 焦慮檢測 ===
  And   失敗訊息使用以下「合法」用詞：
        - "這張卡還缺一些資訊" ✓
        - "下一步建議：[具體行動]" ✓
        - "回卡 N 把 ___ 補上" ✓
  And   失敗訊息「不」使用以下「禁用」用詞：
        - "錯了" / "失敗" / "不及格"
        - "你做錯了" / "重來吧"

  # === 紅色限制檢測 ===
  And   全站僅有 1 個地方使用紅色 (#D63031 或同色)：
        - 卡 10 footer_actions 中「刪除本機資料」按鈕
  And   錯誤 / 失敗訊息使用 PainMap Caution Amber (#D97706)，不用紅色
```

#### Verify — 自動化 brand guard

```typescript
test.describe('全站 brand 違規掃描', () => {
  const pages = [
    '/learn/worksheet',
    '/learn/worksheet/01', '/learn/worksheet/02', '/learn/worksheet/03',
    '/learn/worksheet/04', '/learn/worksheet/05', '/learn/worksheet/06',
    '/learn/worksheet/07', '/learn/worksheet/08', '/learn/worksheet/09',
    '/learn/worksheet/result',
  ];
  for (const url of pages) {
    test(`頁面 ${url} 無黑帽元素`, async ({ page }) => {
      await page.goto(url);
      await expectNoBlackHatElements(page);  // 共用 helper
    });
  }
});
```

---

## 3. CI/CD 整合建議

### 3.1 Pipeline 配置（GitHub Actions 範例）

```yaml
name: E2E Tests
on: [pull_request, push]
jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npx playwright install --with-deps chromium webkit firefox
      - run: npm run dev &
      - run: npx wait-on http://localhost:3000
      - run: npx playwright test --reporter=html
      - if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
```

### 3.2 測試分類與觸發策略

| 測試類別 | 觸發 | 預估時間 |
| :--- | :--- | :--- |
| Smoke（Scenario 1 + 9）| 每個 PR | 2-3 分鐘 |
| Full E2E（9 個 scenarios）| `main` 合併後 | 10-15 分鐘 |
| 跨瀏覽器（chromium/webkit/firefox）| nightly | 30-45 分鐘 |
| A11y 完整掃描 | 週末 | 5 分鐘 |
| 視覺回歸（screenshot diff）| 設計變更 PR | 5 分鐘 |

### 3.3 失敗處理

- 主分支 E2E 失敗 → 立即通知 Slack
- PR E2E 失敗 → 阻擋 merge（rule: required check）
- Flaky test → 自動重試 1 次 + 標記 `@flaky` 隔離

### 3.4 測試資料管理

- Fixture 檔案放 `tests/e2e/fixtures/`，版本控制
- 不在 fixture 中放真實使用者資料（GDPR）
- AI 回覆 fixture 須與 `references/ai_prompt_library.md` § 範例輸出對齊

### 3.5 報告與監控

- Playwright HTML report 上傳至 GitHub Actions artifacts（保留 30 天）
- 失敗截圖 / video 自動附在 report
- 趨勢監控：通過率、平均執行時間、flaky rate

