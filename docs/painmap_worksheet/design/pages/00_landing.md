# Page-Level Prompt: Worksheet Landing Page (入口頁)

> PainMap Worksheet 系統的入口頁。將「不懂 AI、想找到值得做的事」的初學者轉化為「30 秒內開始填第一張卡」的試用者。傳達核心承諾：9 張卡片填空，30-90 分鐘，學會判斷一句抱怨是真痛點還是假痛點。

---

## [PAGE META]

- **page_name**: Worksheet Landing Page
- **route_path**: `/learn/worksheet`
- **page_type**: landing (教學工具入口)
- **primary_goal**: 將初學者轉化為「卡 1 填寫者」— 點擊「30 秒開始」CTA，建立新 PainCard 並導向 `/learn/worksheet/01`
- **secondary_goal**: 重述「判斷力訓練 vs 做產品」的定位差異，校正期待；並提供「未完成 PainCard」恢復入口
- **target_users**:
  - 主要：完全沒做過產品開發、聽朋友抱怨想動手做東西的初學者
  - 次要：已用過 PainMap 進階版但想重訓基本功的使用者
- **entry_point**: 內部分享連結 / `/`(PainMap landing) 二級入口 / `docs/workshop` 連回
- **expected_time_on_page**: 60-180 秒（讀完三段教學 + 對照表後決定是否開始）

---

## [STRUCTURE: SECTIONS]

1. **hero**
   - section_type: hero
   - section_purpose: 一句話擊中「不會判斷一句抱怨值不值得動手」的痛點，並承諾具體時間（30-90 分鐘）與產出（一張痛點身份證）
2. **three_step_teaching**
   - section_type: feature_showcase
   - section_purpose: 用三段教學（聽抱怨 → 用 AI 找證據 → 真假判斷）讓使用者預覽流程，降低「我會不會卡住」的焦慮
3. **expectation_calibration**
   - section_type: comparison_table
   - section_purpose: 「會學到什麼 / 不會學到什麼」對照表，校正期待 — 呼應 worksheet 開場「這份不會教你」段落，避免使用者期待這是「做產品教學」
4. **example_paincard_preview**
   - section_type: artifact_preview
   - section_purpose: 展示林老師補習班案例的完整 PainCard 預覽，讓使用者具體看到「30-90 分鐘後會產出什麼」
5. **start_or_resume**
   - section_type: cta_zone
   - section_purpose: 提供「30 秒開始」與「我有未完成的 PainCard」兩條路徑，降低決策摩擦
6. **stage_relationship**
   - section_type: context_explainer
   - section_purpose: 說明 Worksheet 與進階版 PainMap App 的關係（階段一判斷力 → 階段二商業驗證），避免使用者以為這就是產品全貌
7. **cta_footer**
   - section_type: cta_banner
   - section_purpose: 最終轉化推力 — 強調「不需要準備任何東西，只需要 30 分鐘和一個你聽過的抱怨」

---

## [SECTION COMPONENT SPEC]

### Section: hero

- **layout**: 全寬單欄，垂直置中。左側文案 + 右側「9 卡片進度條」視覺（Desktop）；堆疊（Mobile）
- **elements**:
  - eyebrow: Caption / required / "PainMap Worksheet · 教學模式"
  - headline: Display / required / "9 張卡片填空，學會判斷一句抱怨是真痛點還是假痛點"
  - subheadline: Body LG / required / "第一次 90 分鐘，熟練後 30 分鐘。你不需要懂創新理論、AI 模型、創業框架；你只需要會抄、會問、會打電話。"
  - primary_cta: Button Primary Large / required / "30 秒開始第一張卡" / -> 建立新 PainCard 並導向 `/learn/worksheet/01`
  - secondary_cta: Button Ghost / optional / "看看 9 張卡片長什麼樣" / -> 平滑捲動到 `three_step_teaching`
  - hero_visual: ProgressVisual / required / 9 個圓點水平排列，標示「卡 1 抱怨 → 卡 2 三個人 → 卡 3 公式 → 卡 4 解法 → 卡 5 矛盾 → 卡 6 證據 → 卡 7 對照 → 卡 8 訪談 → 卡 9 判斷」，每個圓點下方標註該卡時長（5-15 分鐘）
- **states**:
  - default: 完整展示，hero_visual 9 個圓點以微妙呼吸動畫提示「步驟可預期」
  - hover: primary_cta 背景色加深 10%，scale(1.02)
  - loading: 文案先 SSR；hero_visual 用骨架圖
- **copy_constraints**: headline 最多 30 字中文；subheadline 最多 60 字中文；CTA 最多 12 字

### Section: three_step_teaching

- **layout**: 1 行 3 欄等寬卡片（Desktop）/ 垂直堆疊帶 step connector（Mobile）
- **elements**:
  - section_title: H2 / required / "三段教學，從一句抱怨到書面判斷"
  - section_subtitle: Body MD / required / "這不是「找答案」的工具，是判斷力訓練器。"
  - step_cards: TeachingStepCard[3] / required
    - step_1_listen:
      - step_number: Badge / required / "01"
      - icon: Illustration / required / 耳朵 + 真人對話氣泡
      - title: H3 / required / "聽抱怨"
      - subtitle: Body SM / required / "卡 1-2"
      - description: Body MD / required / "把聽到的原句寫下來、找出 3 個有名字的真人。AI 在這兩張卡完全不能介入。"
      - sample_output: Caption / required / "產出：抱怨原句 + 3 個真名 + 聯絡方式"
    - step_2_evidence:
      - step_number: Badge / required / "02"
      - icon: Illustration / required / 放大鏡 + AI 對話框
      - title: H3 / required / "用 AI 找證據"
      - subtitle: Body SM / required / "卡 3-7"
      - description: Body MD / required / "把抱怨改寫成卡關公式、找出現有解法、選矛盾、跑 AI 證據蒐集，自己先猜再對照 AI。"
      - sample_output: Caption / required / "產出：卡關公式 + 5 個 workaround + 痛點判斷表"
    - step_3_judge:
      - step_number: Badge / required / "03"
      - icon: Illustration / required / 天秤 + 真假判斷
      - title: H3 / required / "真假判斷"
      - subtitle: Body SM / required / "卡 8-9"
      - description: Body MD / required / "規劃真人訪談、書面回答「真痛點 / 假痛點 / 待訪談」並寫下下一步。"
      - sample_output: Caption / required / "產出：書面判斷 + 訪談題目 3 題 + 下一步行動"
  - step_connector: SVG Line / required / 三步驟之間的橫向流程連接線（Desktop）/ 垂直連接線（Mobile）
- **states**:
  - default: 三步驟並排，sample_output 永遠可見（不需展開）
  - hover: 卡片邊框變為 Deep Teal (#2D7D8A)，輕微上移 (-2px)
  - loading: Skeleton cards
- **copy_constraints**: 每步 title 最多 8 字；description 最多 60 字

### Section: expectation_calibration

- **layout**: 全寬，置中對齊，淺灰背景區分（#F1F3F5）。左右 2 欄對照表（Desktop）/ 垂直堆疊（Mobile）
- **elements**:
  - section_title: H2 / required / "你會學到什麼 / 不會學到什麼"
  - section_subtitle: Body MD / required / "在開始前先說清楚這份填空簿的邊界。"
  - learn_column: ExpectationColumn / required
    - column_title: H3 / required / "你會學到"
    - column_icon: CheckCircle / required / Verified Green
    - items: BulletList / required
      - "從一句抱怨判斷它是不是真痛點"
      - "把模糊抱怨拆成「我每次要 X，都會卡在 Y」"
      - "用 AI 找公開證據，不被 AI 牽著走"
      - "規劃一場有用的真人訪談"
      - "書面交付一張完整的「痛點身份證」"
  - skip_column: ExpectationColumn / required
    - column_title: H3 / required / "你不會學到"
    - column_icon: XCircle / required / Text Secondary（不用紅色，避免焦慮）
    - items: BulletList / required
      - "做產品、寫程式、架網站"
      - "收錢、定價、商業模式"
      - "AI 模型訓練、prompt engineering 細節"
      - "創新理論、TRIZ 完整體系（只用其中 6 種矛盾）"
      - "怎麼把痛點變成第一筆收入（那是階段二的事）"
  - footer_note: Body SM / required / "這份只訓練：從一句抱怨判斷真痛點還是假痛點。"
- **states**:
  - default: 兩欄並排，icon + 文字對照清晰
  - hover: 不需特別 hover 狀態
  - loading: Skeleton list
- **copy_constraints**: 每個 bullet 最多 25 字中文

### Section: example_paincard_preview

- **layout**: 左側完成的 PainCard 預覽卡（60%）+ 右側案例說明（40%）（Desktop）/ 堆疊（Mobile）
- **elements**:
  - section_title: H2 / required / "30-90 分鐘後，你會產出像這樣的痛點身份證"
  - section_subtitle: Body MD / required / "範例：林老師（補習班家長 LINE 案例）"
  - paincard_preview: PainCardPreviewCard / required
    - preview_layout: 模仿 worksheet 「🪪 最後組合」段落格式
    - sections:
      - "主人翁：林老師（30-50 歲補習班數學老師）"
      - "場景：每週六晚上寫 30 則家長 LINE，常寫到半夜兩點"
      - "現在怎麼解：LINE + Excel 成績表 + 翻群組對話（手動拼湊）"
      - "兩件事不能同時要：想客製化但又想規模化"
      - "AI 找到的證據：Dcard 補教版 + 5 種具體職業人群"
      - "我的判斷：✅ 真痛點"
      - "下一步：訪談 2 位安親班輔導老師"
    - status_badge: VerifiedTag / required / "真痛點"（Verified Green）— 但不顯示 0-25 分數（遵守 R4.1 / R4.2 生產輸出限制）
  - case_explainer: Body MD / required / 三段說明
    - 段 1：「這個案例是怎麼開始的？」— 「從表妹的補習班數學老師（林老師）一句『我每週要寫到半夜兩點』開始」
    - 段 2：「90 分鐘做了什麼？」— 「卡 1 寫原句、卡 2 找了 3 個有名字的補教老師、卡 3-5 拆出『個人化 vs 規模化』矛盾、卡 6-7 用 ChatGPT Deep Research 找 Dcard 證據、卡 8 規劃訪談、卡 9 寫 100 字書面判斷」
    - 段 3：「然後呢？」— 「判定為真痛點，下一步：訪談 2 位安親班輔導老師（卡 8 的對象），確認是否同類型痛點。**這份就到此為止。產品開發、收錢是階段二的事。**」
- **states**:
  - default: 預覽卡完整顯示
  - hover: 預覽卡微妙抬升 (-2px)，提示可點擊查看完整範例
  - active: 點擊展開完整範例（modal 或側邊滑出，顯示完整 9 張卡片內容 — 來自 `references/pain_card_schema.md` § 範例 1）
  - loading: Skeleton card
- **copy_constraints**: 預覽卡每行最多 35 字中文；case_explainer 三段各最多 80 字

### Section: start_or_resume

- **layout**: 全寬置中，2 個並排 CTA 卡（Desktop）/ 垂直堆疊（Mobile）
- **elements**:
  - section_title: H2 / required / "現在開始"
  - start_card: ActionCard / required
    - title: H3 / required / "30 秒開始新的 PainCard"
    - description: Body MD / required / "建立一張空白的痛點身份證，從卡 1 開始填。"
    - subtext: Caption / required / "你需要：一個你最近反覆遇到的麻煩 + 30 分鐘不被打擾的時間"
    - cta: Button Primary / required / "建立新 PainCard" / -> POST `/api/paincards` 建立後導向 `/learn/worksheet/01?id={uuid}`
  - resume_card: ActionCard / conditional / 僅當 LocalStorage 有未完成的 PainCard（status !== 'structured' && status !== 'archived_fake'）時顯示
    - title: H3 / required / "我有未完成的 PainCard"
    - description: Body MD / required / "上次填到「卡 {current_step}：{card_name}」，繼續嗎？"
    - subtext: Caption / required / "建立於 {created_at} · 最後修改 {updated_at}"
    - cta: Button Secondary / required / "繼續上次的進度" / -> 讀取 LocalStorage 的 `current_card_id` 並導向 `/learn/worksheet/{current_step}?id={uuid}`
    - secondary_action: Link / optional / "捨棄這份，從頭開始" / -> 確認 modal 後刪除 LocalStorage 並建立新卡
- **states**:
  - default: 兩張卡片並排（如有未完成 PainCard）/ 僅 start_card（如無）
  - hover: ActionCard 邊框變 Teal，輕微上移
  - loading: Skeleton cards（從 LocalStorage 讀取需 < 100ms）
  - empty: 僅顯示 start_card
- **copy_constraints**: title 最多 16 字；description 最多 30 字；subtext 最多 35 字

### Section: stage_relationship

- **layout**: 全寬置中，水平流程圖（Desktop）/ 垂直流程圖（Mobile）
- **elements**:
  - section_title: H2 / required / "這份是「階段一」— 跟進階版 PainMap App 是什麼關係？"
  - flow_diagram: StageFlowDiagram / required
    - stage_1:
      - label: H3 / required / "階段一：判斷力訓練（你現在在這）"
      - product: Caption / required / "PainMap Worksheet（本系統）"
      - output: Body SM / required / "產出：一張書面判斷的痛點身份證"
      - duration: Body SM / required / "時間：30-90 分鐘"
      - skills: BulletList / required
        - "聽抱怨、找真人、寫卡關公式"
        - "用 AI 找證據、自己先猜對照 AI"
        - "規劃訪談、書面真假判斷"
    - arrow_connector: SVGArrow / required / "通過階段一才進階段二"
    - stage_2:
      - label: H3 / required / "階段二：商業驗證"
      - product: Caption / required / "PainMap App（進階版）"
      - output: Body SM / required / "產出：第一筆真實付款"
      - duration: Body SM / required / "時間：72 小時 sprint"
      - skills: BulletList / required
        - "Pain Collector / Essence Decomposer / Disruption Mapper"
        - "手作交付、預售、收第一塊錢"
        - "GTM 策略 + 第一筆收入路徑"
      - cta: Button Ghost / optional / "了解進階版 PainMap App" / -> `/`
  - footer_note: Body SM / required / "為什麼分階段？因為「痛點是不是真的」和「能不能賺錢」是兩個不同問題。階段一沒過，階段二一定會失敗（用對的方法做錯的事）。"
- **states**:
  - default: 兩個階段並排，視覺強調「階段一是現在這份」
  - hover: stage_2 cta 顯示底線
  - loading: Skeleton
- **copy_constraints**: stage label 最多 24 字；output / duration / skills 各 bullet 最多 30 字

### Section: cta_footer

- **layout**: 全寬深色背景（Primary #1E3A5F），白色文案，垂直置中
- **elements**:
  - headline: H2 / required / "不需要懂 AI，也能開始判斷"
  - subheadline: Body LG / required / "選一個你最近反覆遇到的麻煩 — 自己的或聽別人說的都行 — 30 分鐘後你會有一張書面判斷的痛點身份證。"
  - primary_cta: Button Primary Large (Amber) / required / "建立第一張 PainCard" / -> POST `/api/paincards` → `/learn/worksheet/01?id={uuid}`
  - trust_line: Caption / required / "資料只存在你自己的瀏覽器（LocalStorage），不需要註冊、不上傳雲端。可隨時匯出 Markdown / JSON / PDF。"
- **states**:
  - default: 深色背景 + 白色文案 + Amber CTA 高對比
  - hover: CTA 背景色加深 + scale(1.02)
  - loading: 不適用（靜態）
- **copy_constraints**: headline 最多 16 字；subheadline 最多 70 字；trust_line 最多 60 字

---

## [INTERACTION & STATE FLOW]

### 主要互動流程

1. 頁面載入 → SSR 渲染文案；client-side 讀取 LocalStorage `painmap_worksheet:cards`，判斷是否顯示 resume_card
2. 訪客捲動 → 各 Section 依序 fade-in（IntersectionObserver）
3. 點擊 hero `primary_cta` 或 cta_footer `primary_cta` → POST `/api/paincards` 建立空白 PainCard → 寫入 LocalStorage → 導向 `/learn/worksheet/01?id={uuid}`
4. 點擊 hero `secondary_cta` → 平滑捲動到 `three_step_teaching` section
5. 點擊 example_paincard_preview 卡片 → 開啟 modal 顯示完整林老師範例（來自 `references/pain_card_schema.md` § 範例 1）
6. 點擊 resume_card `cta` → 讀取 `current_card_id` → 導向對應 step 頁面
7. 點擊 resume_card `secondary_action`（捨棄）→ 顯示確認 modal → 確認後刪除 LocalStorage → 重新載入頁面（此時僅顯示 start_card）

### LocalStorage 讀取邏輯（resume_card 顯示判定）

```typescript
const stored = localStorage.getItem('painmap_worksheet:cards');
if (!stored) return { showResume: false };

const data = JSON.parse(stored);
const currentCard = data.cards[data.current_card_id];
if (!currentCard) return { showResume: false };

// 已完成或封存的不顯示 resume
if (['structured', 'archived_fake'].includes(currentCard.status)) {
  return { showResume: false };
}

return {
  showResume: true,
  currentStep: currentCard.current_step,
  cardName: CARD_NAMES[currentCard.current_step],  // e.g., 'card_complaint'
  createdAt: currentCard.created_at,
  updatedAt: currentCard.updated_at,
};
```

### RWD 行為差異

| 斷點 | 佈局 | 差異說明 |
| :--- | :--- | :--- |
| Desktop (>1280px) | Hero 左右分欄；三段教學 3 欄；對照表 2 欄；CTA 區 2 欄 | 完整體驗 |
| Tablet (768-1280px) | Hero 堆疊；三段教學 3 欄（縮小）；對照表 2 欄；CTA 區 2 欄 | 縮小但維持結構 |
| Mobile (<768px) | 全部單欄堆疊；三段教學垂直 + step connector 線；對照表垂直堆疊；CTA 區垂直 | 預覽卡縮小至 90% 寬度 |

### 資料更新策略

- 頁面為靜態生成（SSG），每日重新建置一次
- LocalStorage 讀取為 client-side（hydration 後執行），未水合前 resume_card 用 skeleton 佔位

---

## [DATA & API]

- **uses_api**: true（建立新 PainCard 與 LocalStorage 同步）
- **endpoints**:
  - POST `/api/paincards` — 建立新 PainCard，回傳 `{ id, schema_version: '1.0', status: 'draft', current_step: 1, ...empty_fields }`
- **localStorage_keys**:
  - `painmap_worksheet:cards` — 結構詳見 `product/data_model.md` § 持久化策略
- **error_cases**:
  - 建立 PainCard 失敗（網路錯誤）：顯示 inline 錯誤 "建立失敗，請重試"，CTA 按鈕重置為可點擊
  - LocalStorage 讀取失敗（quota exceeded）：顯示 toast "瀏覽器儲存已滿，請清除舊資料或匯出後刪除" + 連結到「我的 PainCards」管理頁（M2 範圍）

---

## [EXIT GATE]

> Landing 頁本身無 exit gate（不是 worksheet 卡片）。但有「進入卡 1」的前置條件。

### 進入卡 1 的前置條件

| 條件 | 檢查方式 |
| :--- | :--- |
| PainCard 已建立 | POST `/api/paincards` 回傳 200 + valid UUID |
| LocalStorage 寫入成功 | `painmap_worksheet:cards.current_card_id` 已設為新建 UUID |
| URL 含正確 query | `/learn/worksheet/01?id={uuid}` |

### 失敗路由

| 失敗情境 | 處理 |
| :--- | :--- |
| API 建立失敗 | 停留在 landing，顯示 inline 錯誤 + 重試按鈕 |
| LocalStorage 寫入失敗（隱私模式 / quota 滿） | 顯示降級 modal「你的瀏覽器禁用了本地儲存，請改用一般模式或允許此網站儲存資料」 |

### 友善文案

- 建立失敗：「建立失敗。請檢查網路後重試，或重新整理頁面。」
- LocalStorage 失敗：「無法儲存到瀏覽器。這份填空簿需要本地儲存才能保留你的進度。請允許此網站使用儲存空間，或關閉隱私模式後重試。」

---

## [AI INTEGRATION]

- **AI 介入狀態**：❌ 不適用（landing 頁不需要 AI）
- **理由**：入口頁是教學說明 + 進入點，不涉及任何 PainCard 欄位填寫。AI 介入的階段從卡 3（卡關公式校對）才開始。
- **內建 prompt 引用**：無
- **Fallback**：無

---

## [OCTALYSIS HOOKS]

### 主驅動力

- **#1 Epic Meaning（史詩感與使命感）— 主驅動力**
  - 設計手法：
    - hero headline 使用「判斷力訓練」而非「找產品點子」— 對齊 worksheet 「AI 時代最稀缺的不是工具、不是模型、不是資料 — 是判斷力」的最後一句
    - expectation_calibration 主動劃清界線（「你不會學到做產品、收錢、寫程式」），這個透明度本身就是 epic meaning 的訴求 — 我們不在賣速成幻想
    - stage_relationship 強調「階段一沒過，階段二一定會失敗」— 把這份填空簿放在使用者的「終身判斷力訓練」脈絡裡

### 副驅動力

- **#3 Empowerment of Creativity & Feedback（賦權創造）— 副驅動力**
  - 設計手法：
    - 「30 秒開始」CTA 把進入門檻降到最低 — 創造力來自開始動手
    - 三段教學讓使用者預覽流程，知道每張卡都有「自己寫」的部分（不會被 AI 包辦）
- **#4 Ownership & Possession（資料主權版）— 限制使用**
  - 設計手法：
    - cta_footer trust_line 強調「資料只存在你自己的瀏覽器」「不上傳雲端」「可隨時匯出 / 刪除」
    - 僅限「資料主權」面向，**不誘導 IKEA 效應**（不說「你已經填了 3 張卡，現在放棄就浪費了」這類話）

### 設計手法清單

| 元件 | Octalysis 手法 | 說明 |
| :--- | :--- | :--- |
| hero ProgressVisual（9 圓點） | #2 預期感 | 讓使用者看到完整流程，降低不確定焦慮（**不是進度條 score**，僅是 step indicator） |
| three_step_teaching 三段卡 | #1 + #3 | 把「判斷力訓練」拆成可理解的三段，讓使用者覺得「這個我做得到」 |
| expectation_calibration 對照表 | #1 透明度 | 主動說「不會學到什麼」反而提升信任感 |
| example_paincard_preview | #2 具體預期 | 用真實案例讓使用者看到「30 分鐘後我會有什麼」 |
| resume_card | #4 資料主權 | 「你的進度在你自己的瀏覽器裡」— 不催促回來，只提供入口 |

### 反模式警告（黑帽禁用清單）

| 禁用 | 為何不能用 |
| :--- | :--- |
| ❌ Streak（連續天數） | 違反 anti-anxiety brand 原則 — 入口頁不能用「你已經 3 天沒回來填卡了」 |
| ❌ FOMO 話術（「限時開放」「名額有限」） | 違反 brand voice — 教學工具沒有時間壓力 |
| ❌ 排行榜（「本月完成 PainCard 最多的人」） | 違反 anti-gamification 鐵律 |
| ❌ 點數 / 徽章（「完成第一張卡得 100 點」） | 違反 brand 禁令 — 不做遊戲化激勵 |
| ❌ 進度百分比（「你已完成 0%」） | 偽裝成 score 的進度條 — 用 step indicator 取代 |
| ❌ 「成功率預測」（「按此流程 90% 的人能找到真痛點」） | 沒有人能預測，破壞信任 |
| ❌ 倒數計時器（「30 秒內開始」變成倒數） | 製造焦慮 — 「30 秒」是承諾入門時間，不是計時 |

---

## [BRAND LANGUAGE RULES (PAGE-SPECIFIC)]

本頁面嚴格遵守 PainMap brand voice 與 worksheet 用詞紀律。

### 禁止用語

| 禁止 | 理由 |
| :--- | :--- |
| 「驗證你的點子」 | 框架錯誤 — 我們在「判斷一句抱怨」，不是「驗證點子」 |
| 「AI 評分 / 打分」 | brand 禁令 |
| 「成功率 / 可行性 / 機率」 | 沒有人能預測 |
| 「點子 / idea / 靈感 / 腦力激盪」 | 用「抱怨 / 痛點」取代 |
| 「分數 / 等級 / 星等 / 排名」 | brand 鐵律 |
| 「徽章 / 連續完成天數 / streak」 | 黑帽禁用 |
| 「快速 / 速成 / 一鍵」 | 暗示走捷徑，違反「判斷力訓練」核心 |

### 建議用語

| 建議 | 場景 |
| :--- | :--- |
| 「判斷一句抱怨是真痛點還是假痛點」 | 核心承諾 |
| 「填空簿 / 痛點身份證」 | 產出物名稱 |
| 「30-90 分鐘」 | 時間預期 |
| 「你來填 / AI 幫填」 | 卡片屬性區分 |
| 「下一步」 | 行動導向 |

### 語調

- **Empowering**：你已經聽過這個抱怨了，我們幫你結構化判斷
- **Calm**：不催促、不限時、不焦慮
- **Honest**：主動說「不會學到什麼」
- **Anti-anxiety**：禁止「錯過就沒了 / 限時開放 / 名額有限」

---

## [ACCEPTANCE CRITERIA]

- [ ] 7 個 Section 依序正確渲染
- [ ] hero `primary_cta` 點擊後成功 POST `/api/paincards` 並導向 `/learn/worksheet/01?id={uuid}`
- [ ] LocalStorage 有未完成 PainCard 時，`start_or_resume` section 正確顯示 resume_card
- [ ] LocalStorage 為空或 PainCard 已完成時，僅顯示 start_card
- [ ] resume_card 顯示的 `current_step` 與 `card_name` 與 LocalStorage 資料一致
- [ ] 「捨棄重新開始」secondary_action 顯示確認 modal，確認後正確清除 LocalStorage
- [ ] example_paincard_preview 顯示林老師案例，**不顯示 0-25 分數**（遵守 R4.1 / R4.2）
- [ ] 點擊 paincard preview 開啟 modal 顯示完整 9 卡內容（來自 `references/pain_card_schema.md`）
- [ ] expectation_calibration 對照表「會學到 / 不會學到」5 項各列完整
- [ ] stage_relationship 流程圖正確標示「階段一 = 你現在在這 / 階段二 = PainMap App」
- [ ] 全頁面零出現禁止用語（「驗證你的點子」「AI 評分」「成功率」「點子」「分數」「徽章」「streak」「FOMO 話術」）
- [ ] 全頁面不出現任何數字評分、星等、排名、進度百分比元素
- [ ] hero ProgressVisual 用 step indicator 呈現（非進度條 score）
- [ ] RWD 三個斷點行為正確（Desktop / Tablet / Mobile）
- [ ] Lighthouse Performance Score >= 90（SSG）
- [ ] FMP < 1.5s
- [ ] 鍵盤可完整 tab 走完所有 CTA，focus ring 正確顯示（Teal #2D7D8A）
- [ ] 螢幕閱讀器讀出 hero 9 圓點 ProgressVisual 為「9 個步驟，第 1 步：抱怨原句」等語意化文字
- [ ] 符合 PainMap brand 視覺規範（字體、色彩、間距、Radius）
