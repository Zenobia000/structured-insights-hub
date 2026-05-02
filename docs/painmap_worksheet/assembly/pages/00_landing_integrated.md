# PainMap Worksheet — Landing Page Integrated Prompt (00)

> 自我包含整合 prompt — 直接貼入 Lovable / Claude Code 即可生成完整 Worksheet Landing Page。
> 組裝來源：`global/painmap_brand_system.md`（壓縮版） + `design/pages/00_landing.md`
> 對應 page spec 真相源：`docs/painmap_worksheet/design/pages/00_landing.md`
> 組裝日期：2026-05-01 ｜ Worksheet v1.0 ｜ Brand System v1.0

---

## === GLOBAL PROJECT GUIDELINE (DO NOT OVERRIDE) ===

你是「PainMap 題眼 — Worksheet 教學模式」的資深產品設計師與前端工程師，負責維護全站設計一致性與動機設計倫理。

### 品牌特質

**結構化 (Structured)** ｜ **賦權感 (Empowering)** ｜ **沉穩 (Calm)** ｜ **教學優先 (Teaching-first)**

### Color Tokens（landing 用得到的子集）

| Token | 色值 | Tailwind | 用途 |
| :--- | :--- | :--- | :--- |
| Primary | #1E3A5F | `bg-[#1E3A5F]` | 結構深色（cta_footer 背景）|
| Primary Light | #E8EEF5 | `bg-[#E8EEF5]` | 卡片高亮背景 |
| Secondary | #2D7D8A | `bg-[#2D7D8A]` | 引導、focus、stage_2 連結 |
| Accent (CTA) | #E8913A | `bg-[#E8913A]` | 主要行動按鈕（hero / cta_footer）|
| Accent Hover | #D07A2B | `hover:bg-[#D07A2B]` | CTA hover |
| Verified | #2D9D78 | `bg-[#2D9D78]` | 已完成的進度圓點 |
| Caution | #D97706 | `bg-[#D97706]` | 待補充提示（不用紅色避免焦慮）|
| BG Page | #F7F8FA | `bg-[#F7F8FA]` | 頁面底色 |
| BG Surface | #FFFFFF | `bg-white` | 卡片底色 |
| BG Muted | #F1F3F5 | `bg-[#F1F3F5]` | 對照表區段背景 |
| Text Primary | #1A2332 | `text-[#1A2332]` | 主要文字 |
| Text Secondary | #5C6B7A | `text-[#5C6B7A]` | 說明文字 |
| Border Default | #DFE3E8 | `border-[#DFE3E8]` | 預設邊框 |

### Typography（landing 用到的字級）

| Token | 字級 | 行高 | 字重 | 用途 |
| :--- | :--- | :--- | :--- | :--- |
| Display | 36px | 1.2 | 700 | Hero headline |
| H1 | 28px | 1.3 | 700 | section title |
| H2 | 22px | 1.3 | 600 | section title |
| H3 | 18px | 1.4 | 600 | step / column title |
| Body LG | 17px | 1.7 | 400 | hero subheadline / 重要描述 |
| Body MD | 15px | 1.6 | 400 | 標準段落 |
| Body SM | 13px | 1.5 | 400 | 次要說明 |
| Caption | 12px | 1.4 | 400 | metadata、subtext |

字體：`Noto Sans TC`（中文）+ `Inter`（英文）。

### 元件風格

- Radius MD 8px（按鈕／輸入框）／ LG 12px（卡片、ProgressVisual 圓點區）
- Shadow SM `0 1px 3px rgba(30,58,95,0.06)` 預設；Shadow MD `0 4px 8px rgba(30,58,95,0.08)` hover
- Border：`1px solid #DFE3E8` 預設 ／ `2px solid #2D7D8A` focus

### 技術棧

React 18 + TypeScript + Tailwind CSS。State 用 Zustand；Forms 用 React Hook Form + Zod。LocalStorage 為 MVP 唯一持久層（key：`painmap_worksheet:cards`、`painmap_worksheet:settings.display_mode`）。Hosting：Vercel SSG + ISR。

### 絕對禁令（PainMap Brand）

- 禁止：分數（0-25 ／ 0-100）、星等、A-F 等級、成功率預測、排行榜、遊戲化徽章、倒數計時、過期警告
- 禁用詞：「點子 / idea / 評分 / 打分 / 成功率 / 可行性分析 / 革命性 / 極致體驗 / 闖關 / 升級」
- 禁止 Inline styles（全部 Tailwind）；禁止 `console.log` 殘留；禁止未經 Zod schema 驗證的 AI 回應直接渲染。
- 顏色對比度 ≥ 4.5:1（WCAG AA）；語意化 HTML；完整 Tab 順序 + Focus ring（Teal #2D7D8A）。

### 絕對禁令（Octalysis 黑帽）

- 禁止 #6 Scarcity & Impatience：不可有「限時優惠」「最後 X 個名額」「倒數計時」
- 禁止 #7 Unpredictability：不可有抽卡 / loot box / 神秘獎勵 / 隨機推薦
- 禁止 #8 Loss Avoidance：不可有 streak（連續打卡）、過期警告、進度倒退恐嚇

### 教學模式特殊鐵律

1. **反 solution mode**：本頁不直接呼叫 AI，但描述卡 3-8 流程時須強調「AI 不建議解決方案、不推薦工具、只做痛點探索」
2. **書面優先於 UI 體驗**：landing 是入口頁，但承諾的是「30-90 分鐘後產出可帶離的書面 PainCard」
3. **過關條件透明**：用 step indicator（9 個圓點）展現 worksheet 流程，不隱藏
4. **失敗回退路徑**：landing 不涉及 exit gate 失敗，但 stage_relationship 區塊須誠實說「階段一沒過，階段二一定會失敗」

---

## === CURRENT TASK: BUILD WORKSHEET LANDING PAGE ===

本次任務：根據上方 Global Guideline，設計並實作「PainMap Worksheet Landing Page」。

### [PAGE META]

- **page_name**: Worksheet Landing Page
- **route_path**: `/learn/worksheet`
- **card_step**: 0（landing，非 worksheet 卡片）
- **page_type**: landing（教學工具入口）
- **primary_goal**: 將初學者轉化為「卡 1 填寫者」— 點擊「30 秒開始」CTA，建立新 PainCard 並導向 `/learn/worksheet/01`
- **secondary_goal**: 校正期待（判斷力訓練 vs 做產品）；提供「未完成 PainCard」恢復入口
- **target_users**:
  - 主要：完全沒做過產品開發、聽朋友抱怨想動手做東西的初學者
  - 次要：已用過 PainMap 進階版但想重訓基本功的使用者
- **expected_time_on_page**: 60-180 秒
- **prerequisite_cards**: 無

---

### [STRUCTURE: SECTIONS]（由上至下）

1. **hero** — 一句話擊中「不會判斷一句抱怨值不值得動手」+ 承諾 30-90 分鐘 + 一張痛點身份證
2. **three_step_teaching** — 三段教學（聽抱怨／用 AI 找證據／真假判斷）預覽流程
3. **expectation_calibration** — 「會學到什麼／不會學到什麼」對照表（誠實標出邊界）
4. **example_paincard_preview** — 林老師補習班案例完整 PainCard 預覽
5. **start_or_resume** — 「30 秒開始新的 PainCard」+「我有未完成的 PainCard」（依 LocalStorage 動態顯示）
6. **stage_relationship** — Worksheet（階段一）與 PainMap App（階段二）關係流程圖
7. **cta_footer** — 最終轉化推力，深色背景 + 強調「資料只在你瀏覽器」

---

### [SECTION COMPONENT SPEC]

#### Section 1: hero

- **layout**: 全寬單欄垂直置中。Desktop 左側文案 + 右側 9 圓點 ProgressVisual；Mobile 堆疊。
- **elements**:
  - `eyebrow` (Caption, required): "PainMap Worksheet · 教學模式"
  - `headline` (Display, required): "9 張卡片填空，學會判斷一句抱怨是真痛點還是假痛點"
  - `subheadline` (Body LG, required): "第一次 90 分鐘，熟練後 30 分鐘。你不需要懂創新理論、AI 模型、創業框架；你只需要會抄、會問、會打電話。"
  - `primary_cta` (Button Primary Large, required): "30 秒開始第一張卡" → 觸發建立新 PainCard 流程
  - `secondary_cta` (Button Ghost, optional): "看看 9 張卡片長什麼樣" → 平滑捲動到 `three_step_teaching`
  - `hero_visual` (ProgressVisual, required): 9 個圓點水平排列，每點下方標註「卡 N · 5-15 分鐘」；圓點以**微妙呼吸動畫**（不是進度條 score）
- **states**: default ／ hover (CTA 加深 + scale(1.02)) ／ loading（文案 SSR、ProgressVisual lazy load）

#### Section 2: three_step_teaching

- **layout**: Desktop 1×3 等寬 / Mobile 垂直堆疊帶 step connector
- **elements**:
  - `section_title` (H2): "三段教學，從一句抱怨到書面判斷"
  - `section_subtitle` (Body MD): "這不是「找答案」的工具，是判斷力訓練器。"
  - 3 張 `TeachingStepCard`：
    - **01 聽抱怨（卡 1-2）** — 把聽到的原句寫下來、找出 3 個有名字的真人。AI 在這兩張卡完全不能介入。**產出：抱怨原句 + 3 個真名 + 聯絡方式**
    - **02 用 AI 找證據（卡 3-7）** — 把抱怨改寫成卡關公式、找出現有解法、選矛盾、跑 AI 證據蒐集，自己先猜再對照 AI。**產出：卡關公式 + 5 個 workaround + 痛點判斷表**
    - **03 真假判斷（卡 8-9）** — 規劃真人訪談、書面回答「真痛點 / 假痛點 / 待訪談」並寫下下一步。**產出：書面判斷 + 訪談題目 3 題 + 下一步行動**
  - `step_connector` (SVG)：Desktop 橫向 ／ Mobile 垂直流程線
- **states**: default / hover (邊框變 Teal + 上移 -2px) / loading

#### Section 3: expectation_calibration

- **layout**: 全寬，淺灰背景 `bg-[#F1F3F5]`，左右 2 欄對照（Desktop）／ 垂直堆疊（Mobile）
- **elements**:
  - `section_title` (H2): "你會學到什麼 / 不會學到什麼"
  - **left column「你會學到」** (CheckCircle Verified Green)：
    - 從一句抱怨判斷它是不是真痛點
    - 把模糊抱怨拆成「我每次要 X，都會卡在 Y」
    - 用 AI 找公開證據，不被 AI 牽著走
    - 規劃一場有用的真人訪談
    - 書面交付一張完整的「痛點身份證」
  - **right column「你不會學到」** (XCircle Text Secondary 色，**不用紅色**)：
    - 做產品、寫程式、架網站
    - 收錢、定價、商業模式
    - AI 模型訓練、prompt engineering 細節
    - 創新理論、矛盾分類法的完整體系
    - 怎麼把痛點變成第一筆收入（那是階段二的事）
  - `footer_note` (Body SM): "這份只訓練：從一句抱怨判斷真痛點還是假痛點。"

#### Section 4: example_paincard_preview

- **layout**: Desktop 60% 預覽卡 + 40% 案例說明 / Mobile 堆疊
- **elements**:
  - `section_title` (H2): "30-90 分鐘後，你會產出像這樣的痛點身份證"
  - `section_subtitle` (Body MD): "範例：林老師（補習班家長 LINE 案例）"
  - `paincard_preview` (PainCardPreviewCard)：仿 worksheet「🪪 最後組合」格式，包含：
    - 主人翁：林老師（30-50 歲補習班數學老師）
    - 場景：每週六晚上寫 30 則家長 LINE，常寫到半夜兩點
    - 現在怎麼解：LINE + Excel 成績表 + 翻群組對話（手動拼湊）
    - 兩件事不能同時要：想客製化但又想規模化
    - AI 找到的證據：Dcard 補教版 + 5 種具體職業人群
    - 我的判斷：✅ 真痛點
    - 下一步：訪談 2 位安親班輔導老師
  - `status_badge` (VerifiedTag)："真痛點"（Verified Green）— **不顯示 0-25 分數**（遵守 R4.1 / R4.2）
  - `case_explainer`：三段說明（怎麼開始 / 90 分鐘做了什麼 / 然後呢）
- **互動**：點擊預覽卡 → modal 顯示完整 9 卡內容（來自 `references/pain_card_schema.md` 範例 1）

#### Section 5: start_or_resume

- **layout**: 全寬置中，Desktop 2 卡並排 / Mobile 堆疊
- **elements**:
  - `start_card` (ActionCard, required)：
    - title (H3): "30 秒開始新的 PainCard"
    - description: "建立一張空白的痛點身份證，從卡 1 開始填。"
    - subtext (Caption): "你需要：一個你最近反覆遇到的麻煩 + 30 分鐘不被打擾的時間"
    - cta (Button Primary): "建立新 PainCard" → POST `/api/paincards` → 寫 LocalStorage → 導向 `/learn/worksheet/01?id={uuid}`
  - `resume_card` (ActionCard, conditional)：**僅當 LocalStorage 有未完成 PainCard（status !== 'structured' && !== 'archived_fake'）時顯示**
    - title (H3): "我有未完成的 PainCard"
    - description: "上次填到「卡 {current_step}：{card_name}」，繼續嗎？"
    - subtext (Caption): "建立於 {created_at} · 最後修改 {updated_at}"
    - cta (Button Secondary): "繼續上次的進度" → 讀取 LocalStorage `current_card_id` → 導向對應 step
    - secondary_action (Link): "捨棄這份，從頭開始" → 確認 modal → 刪除 LocalStorage → 重新載入

#### Section 6: stage_relationship

- **layout**: 水平流程圖（Desktop）/ 垂直流程圖（Mobile）
- **elements**:
  - `section_title` (H2): "這份是「階段一」— 跟進階版 PainMap App 是什麼關係？"
  - `stage_1_block`：
    - 「階段一：判斷力訓練（你現在在這）」
    - 產品：PainMap Worksheet（本系統）
    - 產出：一張書面判斷的痛點身份證｜時間：30-90 分鐘
    - 訓練技能：聽抱怨找真人寫卡關公式 / 用 AI 找證據自己先猜對照 AI / 規劃訪談書面真假判斷
  - `arrow_connector` (SVG): "通過階段一才進階段二"
  - `stage_2_block`：
    - 「階段二：商業驗證」
    - 產品：PainMap App（進階版）
    - 產出：第一筆真實付款｜時間：72 小時 sprint
    - 訓練技能：Pain Collector / Essence Decomposer / Disruption Mapper、手作交付預售收第一塊錢、GTM 策略
    - cta (Button Ghost, optional)："了解進階版 PainMap App" → `/`
  - `footer_note` (Body SM): "為什麼分階段？因為「痛點是不是真的」和「能不能賺錢」是兩個不同問題。階段一沒過，階段二一定會失敗（用對的方法做錯的事）。"

#### Section 7: cta_footer

- **layout**: 全寬深色背景 `bg-[#1E3A5F]`，白色文案，垂直置中
- **elements**:
  - `headline` (H2, white): "不需要懂 AI，也能開始判斷"
  - `subheadline` (Body LG, white opacity-85): "選一個你最近反覆遇到的麻煩 — 自己的或聽別人說的都行 — 30 分鐘後你會有一張書面判斷的痛點身份證。"
  - `primary_cta` (Button Primary Large, Accent #E8913A): "建立第一張 PainCard" → POST `/api/paincards` → `/learn/worksheet/01?id={uuid}`
  - `trust_line` (Caption, white opacity-70): "資料只存在你自己的瀏覽器（LocalStorage），不需要註冊、不上傳雲端。可隨時匯出 Markdown / JSON / PDF。"

---

### [INTERACTION & STATE FLOW]

#### 主要互動流程

1. 頁面載入 → SSR 文案；client-side 讀取 LocalStorage `painmap_worksheet:cards` 判斷是否顯示 resume_card
2. 訪客捲動 → IntersectionObserver 各 Section fade-in
3. 點擊 hero `primary_cta` 或 cta_footer `primary_cta` → POST `/api/paincards` 建立空白 PainCard → 寫 LocalStorage → 導向 `/learn/worksheet/01?id={uuid}`
4. 點擊 hero `secondary_cta` → 平滑捲動到 three_step_teaching
5. 點擊 example_paincard_preview → 開啟 modal 顯示完整林老師案例
6. 點擊 resume_card cta → 讀取 `current_card_id` → 導向對應 step
7. 點擊 resume_card secondary_action → 確認 modal → 確認後刪除 LocalStorage → 重新載入

#### LocalStorage 讀取邏輯（resume_card 顯示判定）

```typescript
const stored = localStorage.getItem('painmap_worksheet:cards');
if (!stored) return { showResume: false };
const data = JSON.parse(stored);
const currentCard = data.cards[data.current_card_id];
if (!currentCard) return { showResume: false };
if (['structured', 'archived_fake'].includes(currentCard.status)) {
  return { showResume: false };
}
return {
  showResume: true,
  currentStep: currentCard.current_step,
  cardName: CARD_NAMES[currentCard.current_step],
  createdAt: currentCard.created_at,
  updatedAt: currentCard.updated_at,
};
```

#### RWD

| 斷點 | 佈局 |
| :--- | :--- |
| Desktop (>1280px) | Hero 左右分欄；三段教學 3 欄；對照表 2 欄；CTA 區 2 欄 |
| Tablet (768-1280px) | Hero 堆疊；三段教學 3 欄縮小；對照表 2 欄；CTA 區 2 欄 |
| Mobile (<768px) | 全部單欄堆疊；三段教學垂直 + step connector；對照表垂直；CTA 垂直；preview 縮 90% 寬 |

---

### [DATA & API]

- **endpoints**:
  - `POST /api/paincards` — 建立新 PainCard，回傳 `{ id, schema_version: '1.0', status: 'draft', current_step: 1, ...empty_fields }`
- **localStorage_keys**:
  - `painmap_worksheet:cards` — 結構詳見 `data_model.md` § 持久化策略
- **PainCard 欄位讀取**（resume_card）：
  - `cards[currentId].current_step`
  - `cards[currentId].status`
  - `cards[currentId].created_at`
  - `cards[currentId].updated_at`
- **error_cases**:
  - 建立 PainCard 失敗 → inline 錯誤 "建立失敗，請重試"，CTA 重置為可點擊
  - LocalStorage quota exceeded → toast "瀏覽器儲存已滿，請清除舊資料或匯出後刪除"
  - LocalStorage 禁用（隱私模式）→ 降級 modal 提示

---

### [EXIT GATE]

> Landing 頁本身無 exit gate。**「進入卡 1」的前置條件**：

| 條件 | 檢查 |
| :--- | :--- |
| PainCard 已建立 | POST 回傳 200 + valid UUID |
| LocalStorage 寫入成功 | `current_card_id` 已設 |
| URL 含正確 query | `/learn/worksheet/01?id={uuid}` |

**失敗友善文案**（不用「失敗」「不及格」字眼）：
- API 失敗：「建立失敗。請檢查網路後重試，或重新整理頁面。」
- LocalStorage 失敗：「無法儲存到瀏覽器。這份填空簿需要本地儲存才能保留你的進度。請允許此網站使用儲存空間，或關閉隱私模式後重試。」

---

### [AI INTEGRATION]

- **AI 介入狀態**：❌ **不適用**
- **理由**：landing 是教學說明 + 進入點，不涉及任何 PainCard 欄位填寫。AI 介入從卡 3 才開始。
- **內建 prompt**：無
- **Fallback**：無

---

### [OCTALYSIS HOOKS]

#### 主驅動力：#1 Epic Meaning（史詩般的意義）

- hero headline 使用「判斷力訓練」而非「找產品點子」
- expectation_calibration 主動劃清界線（「你不會學到做產品、收錢、寫程式」）— 透明度本身就是 epic meaning 的訴求
- stage_relationship 強調「階段一沒過，階段二一定會失敗」

#### 副驅動力：#3 Empowerment of Creativity & Feedback

- 「30 秒開始」CTA 把進入門檻降到最低 — 創造力來自開始動手
- 三段教學讓使用者預覽流程，知道每張卡都有「自己寫」的部分

#### 副驅動力：#4 Ownership（限制使用 — 僅資料主權）

- cta_footer trust_line：「資料只存在你自己的瀏覽器」「不上傳雲端」「可隨時匯出 / 刪除」
- **不誘導 IKEA 效應** — 不說「你已經填了 3 張卡，現在放棄就浪費了」

#### 反模式警告（必須全部不出現）

| 禁用 | 為何 |
| :--- | :--- |
| ❌ Streak（連續天數） | 違反 anti-anxiety；入口頁不能用「你已 N 天沒回來」 |
| ❌ FOMO（「限時開放」「名額有限」） | 教學工具沒有時間壓力 |
| ❌ 排行榜（「本月完成 PainCard 最多的人」） | 違反 anti-gamification 鐵律 |
| ❌ 點數 / 徽章 | 違反 brand 禁令 |
| ❌ 進度百分比（「你已完成 0%」） | 偽裝成 score 的進度條 — 用 step indicator 取代 |
| ❌ 成功率預測（「90% 的人能找到真痛點」） | 沒有人能預測 |
| ❌ 倒數計時器（「30 秒內開始」變成倒數） | 製造焦慮 — 「30 秒」是承諾入門時間 |

---

## === EXCEPTION RULES ===

本頁面允許以下例外（需明確實作）：

1. **Hero 全寬佈局**：Hero 區塊使用全寬，不受全域 Grid 最大寬度（1200px）限制。理由：最大化第一印象衝擊力。
2. **cta_footer 深色背景反轉**：cta_footer 使用 Primary #1E3A5F 深色背景，覆蓋全域淺色背景規則。理由：最終轉化區需要強烈視覺對比。
3. **expectation_calibration 淺灰背景**：使用 BG Muted (#F1F3F5)，打破全域白色背景一致性。理由：刻意視覺對比，強化「宣言」感。

其餘設計決策完全遵循 Global Guideline。

---

## === OUTPUT REQUIREMENTS ===

請依以下步驟輸出：

### Step 1：結構確認

列出本頁面的：
- 7 個主要 sections 及其用途
- 每個 section 的關鍵元件 + 必填／選填欄位
- IntersectionObserver 動畫、PainCard 建立流程、LocalStorage 恢復邏輯
- 資料流：LocalStorage 讀 → React state → form → 驗證 → 寫回 LocalStorage

### Step 2：設計決策說明

說明 3 個關鍵設計決策：
1. 如何透過色彩系統（Indigo / Teal / Amber / 灰階）傳達「結構化、賦權、沉穩、教學優先」品牌調性，同時確保 CTA 轉化率
2. 如何用 9 個圓點 ProgressVisual 取代百分比進度條，避免黑帽 Octalysis 元素，又能傳達「步驟可預期」的安心感
3. 如何在 expectation_calibration 主動劃清界線（「你不會學到做產品 / 收錢 / 寫程式」），把這個「拒絕承諾」轉化為品牌信任

### Step 3：實作方案（Option A：完整程式碼）

輸出要求：
- 7 個 sections 各自獨立 React Component（`HeroSection.tsx`, `ThreeStepTeachingSection.tsx`, `ExpectationCalibrationSection.tsx`, `ExamplePainCardPreviewSection.tsx`, `StartOrResumeSection.tsx`, `StageRelationshipSection.tsx`, `CtaFooterSection.tsx`）
- `LandingPage.tsx` 主檔整合所有 sections
- LocalStorage hook（`useLocalStorageRecovery`）讀取 painmap_worksheet:cards 並判斷 resume_card 顯示
- React Hook Form + Zod schema for paincard creation
- IntersectionObserver for scroll fade-in
- 9 圓點 ProgressVisual 元件（純視覺，不含百分比、不含倒數）
- 所有 RWD 斷點 Tailwind responsive classes
- 所有元件狀態（default / hover / loading / error）

### 品質檢查清單（部署前必過）

#### 通用
- [ ] 7 個 Section 全部依序渲染
- [ ] hero `primary_cta` 點擊後 POST `/api/paincards` 並導向 `/learn/worksheet/01?id={uuid}`
- [ ] LocalStorage 有未完成 PainCard 時 resume_card 正確顯示
- [ ] LocalStorage 為空或已完成時，僅顯示 start_card
- [ ] 「捨棄重新開始」確認 modal 正確清除 LocalStorage
- [ ] example_paincard_preview 顯示林老師案例，**不顯示 0-25 分數**
- [ ] expectation_calibration 5 項各列完整
- [ ] stage_relationship 流程圖正確標示「階段一 = 你現在在這」
- [ ] 色彩系統一致（無自創色，全部來自 brand tokens）
- [ ] 字體層級正確（Display / H1 / H2 / H3 / Body LG / Body MD / Body SM / Caption）
- [ ] RWD 三斷點行為正確（Desktop / Tablet / Mobile）
- [ ] WCAG AA 對比度 ≥ 4.5:1
- [ ] 鍵盤可完整 Tab + Focus ring (Teal #2D7D8A)
- [ ] 螢幕閱讀器讀出 9 圓點為「9 個步驟，第 1 步：抱怨原句」等語意化文字
- [ ] Lighthouse Performance ≥ 90（SSG）；FMP < 1.5s

#### Octalysis 黑帽掃描（生成程式碼後**必跑**）
- [ ] 頁面是否出現任何分數 UI（0-100、A-F、星等）？→ 若有，直接砍掉
- [ ] 是否有 streak / 連續打卡 / 連續登入獎勵？→ 若有，直接砍掉
- [ ] 是否有 loot box / 抽卡 / 神秘獎勵？→ 若有，直接砍掉
- [ ] 是否有 FOMO 文案（「最後 X 個名額」「限時優惠」）？→ 若有，直接砍掉
- [ ] 是否有過期警告（「資料 7 天後刪除」「進度即將過期」）？→ 若有，直接砍掉
- [ ] 「下一步」按鈕文案是否中性（不催促、不焦慮）？→ 若否，重寫
- [ ] 失敗回退提示是否使用「失敗 / 不及格」字眼？→ 若是，重寫

#### 禁用詞掃描
- [ ] 全頁面零出現「驗證你的點子」「AI 評分」「成功率」「點子」「分數」「徽章」「streak」「FOMO」「快速」「速成」「一鍵」
- [ ] hero ProgressVisual 用 step indicator 呈現（**非進度條 score**）
- [ ] 不出現「N% 的人完成」這類社會比較

---

**執行優先順序**：
1. Global Guideline（色彩 / 字體 / 禁止模式 / 黑帽禁令）— 最高
2. Page Spec（7 個 section 結構與 copy）— 次之
3. Exception Rules（3 項明確例外）— 最後且最小化

**版本資訊**：
- Global System v1.0 ｜ Worksheet Spec v1.0 ｜ Assembly Template v1.0
- 組裝日期：2026-05-01
