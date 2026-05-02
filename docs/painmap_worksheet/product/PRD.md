# PainMap Worksheet — 產品需求文件 (PRD)

> **狀態**：M1 規格定稿（不寫程式碼，僅產出設計文件）
> **真相源**：`docs/workshop/painpoint_beginner_worksheet.md`、`docs/painmap_worksheet/product/data_model.md`
> **品牌守則**：`docs/web_design/global/painmap_brand_system.md`
> **姐妹文件**：`product/user_journey.md`、`product/motivation_design.md`、`product/stage1_to_stage2_handoff.md`

---

## 1. 產品定位

### 1.1 一句話定位

**PainMap Worksheet 是 PainMap 進階版的「初學者教學模式」。它是一個 9 卡片網頁化填空簿，把一句抱怨變成書面的「真痛點 / 假痛點」判斷，作為使用者進入 PainMap App 主流程之前的判斷力訓練器。**

### 1.2 在 PainMap 產品族中的位置

```
       Worksheet                PainMap App                first-dollar
     /learn/worksheet           /app/* (既有)            sprint manual
   ─────────────────────  →  ───────────────────────  →  ───────────────
   階段一：判斷力訓練         階段一→二銜接              階段二：商業驗證
   產出：書面真假判斷         產出：結構化痛點 entry      產出：第一筆付款
   時間：30–90 分鐘           時間：依使用情境            時間：72 小時 sprint
   工具：複製 prompt          工具：站內 AI / Atlas       工具：手作交付 + 付款
```

- Worksheet 是**初階教學版**，承擔「不懂 AI、想找到值得做的事」的入門使用者
- PainMap App 進階版（Pain Collector / Decomposer / Mapper / Atlas / Dashboard）承擔結構化痛點的長期管理
- 兩者共用同一套 brand system（`painmap_brand_system.md`），但 IA 與資料模型獨立
- Worksheet 不重做 brand system、不重複 worksheet 卡片內容、不寫程式碼（M1 範圍）

### 1.3 與「方法論真相源」的關係

Worksheet 是 `docs/product/painmap/painmap_pain_thinking_system.md` 階段一的網頁實作。所有設計決策必須與該文件一致：

- 階段一只訓練判斷力，不談錢、不做手作交付、不架收款連結
- 階段一終點是書面「真痛點 / 假痛點 / 待訪談」判斷，不是付款
- 階段二（first-dollar sprint）由另一份方法論文件接手，Worksheet 不負責
- **零分數 UI**：worksheet 不打分數、不評等、不分類；卡 9 只有書面判斷 + 100 字理由

---

## 2. 目標用戶 Persona

> 三個 persona 全部都是「不懂 AI 但想找到值得做的事」的初學者版本。為了與 PainMap App 進階版的 Aji / Vivian / Kai 區隔，這裡刻意拉低技術門檻、放大行為焦慮。

### Persona A — 補習班老師「林老師」（教學現場第一線）

- **背景**：43 歲、經營新北永和小型補習班、每週六晚上要寫 30 個學生的家長 LINE
- **AI 經驗**：用過 ChatGPT 寫家長訊息草稿，覺得「太罐頭家長一看就知道」，再也沒打開
- **觸發場景**：朋友轉貼一份「AI 教你怎麼把抱怨變成生意」的文章，想看看自己每週六熬到半夜的事是不是「值得做」
- **痛點**：知道有問題，但不知道該怎麼把模糊的痛感變成可以行動的判斷
- **Worksheet 對他的承諾**：不教他寫 App、不教他賺錢；教他用 9 個固定欄位寫下「我的痛是真是假」這個判斷
- **失敗情境**：如果 Worksheet 一開始就要他想商業模式或評分，他會立刻關掉

### Persona B — 第一次想創業的工程師「小恆」（被 AI 焦慮推著走）

- **背景**：28 歲、4 年後端工程師、聽朋友說 AI 浪潮要趕快上車、開始想做 side project
- **AI 經驗**：訂閱了 ChatGPT Plus，平常拿來查文件，但從沒系統化用過 prompt
- **觸發場景**：在臉書社團看到「不要再想 idea 了，先驗證痛點」的觀念貼文，被打到
- **痛點**：手上有 5 個「點子」想做，但每個都做不到一半就懷疑是不是真痛，浪費時間
- **Worksheet 對他的承諾**：把他從「想 idea」拉回「找有名字的人」，用 9 張卡片強迫他承認哪幾個 idea 是假的
- **失敗情境**：如果工具給他任何分數呈現結果，他會誤以為高分就是綠燈，跳過真人訪談直接寫 code

### Persona C — 內部創新負責人「Vicky」（被 KPI 推著找新題目）

- **背景**：35 歲、傳產家族企業二代、被指派做「數位轉型」、不知從何開始
- **AI 經驗**：公司有買 ChatGPT Team，但她每次只敢用來翻譯 email
- **觸發場景**：去聽了一場「用 AI 找痛點」的 workshop，拿到紙本填空簿，回辦公室想用網頁版方便整理
- **痛點**：聽到太多「員工抱怨」，但不知道哪些是真值得解、哪些只是情緒
- **Worksheet 對她的承諾**：用 9 張卡片把員工抱怨變成書面證據，作為內部會議的討論材料
- **失敗情境**：如果工具強迫她填社群帳號或公開分享她公司內部的痛點，她會直接放棄

### Persona 共通需求

| 需求 | 設計回應 |
| :--- | :--- |
| 不想學 AI 框架 | 9 張卡片每張都標「你來填 / AI 幫填」，prompt 直接複製不教理論 |
| 不想被打分 | 全站禁用分數 UI、星等、A-F 等級（與 PainMap brand 禁令一致）|
| 怕浪費時間 | 30–90 分鐘可完成；中斷後可從 LocalStorage 復原 |
| 不想暴露隱私 | 不需要註冊帳號，所有資料本地儲存 |
| 怕做錯 | 每張卡片有蘇格拉底反思提示，欄位不足時建議「回去把 X 想清楚再來」（不擋前進）|

---

## 3. 問題陳述

### 3.1 為什麼需要這個工具

#### 觀察到的現象

1. **Idea 焦慮病**：初學者在 ChatGPT 時代被「想 100 個 idea」教學淹沒，但 99% 的 idea 沒有人付錢。問題不在缺 idea，而在缺判斷力
2. **AI 諂媚陷阱**：直接問 AI「這是不是真痛點」，AI 會根據提問者的描述順著回答「是的這是好題目」，產生虛假的綠燈
3. **跳步反模式**：從「聽到一個抱怨」直接跳到「我來做 App」，跳過所有「有名字的人」「現在怎麼解」「兩件事不能同時要」的中間結構
4. **評分系統的惡性循環**：市面上的 IdeaCheck 類產品給「85/100」分數，使用者把分數誤認為答案，跳過真人訪談，浪費 3 個月驗證錯題目
5. **線下紙本 worksheet 的限制**：紙本 worksheet (`painpoint_beginner_worksheet.md`) 已成熟可用，但缺乏：
   - 跨 session 持續性（紙本掉了就沒了）
   - 蘇格拉底反思提示（紙本沒辦法即時提醒「想想看」）
   - prompt 一鍵複製（紙本只能手抄）
   - 匯出整合（紙本沒辦法生成 Markdown / PDF）

#### 衍生問題

- 使用者寫到一半發現上一張卡填錯，但沒有結構化的回退路徑
- AI 回覆混在 ChatGPT history 裡找不到，無法跟 Worksheet 卡片對應
- 想分享「痛點身份證」給朋友看，卻沒有統一格式
- 想從教學模式畢業到 PainMap App 主流程，沒有銜接點

### 3.2 痛點優先序

| 痛點 | 嚴重性 | Worksheet 處理方式 |
| :--- | :--- | :--- |
| 跳步、想 App、想商業模式 | CRITICAL | 9 卡 stepper 強制順序 + 卡 6 prompt 內建「不要設計產品」鐵律 |
| 評分系統誤用 | CRITICAL | 永久禁用任何分數 UI（資料層完全不存分數欄位）|
| AI 諂媚 | HIGH | 卡 7「自己先猜 + 讀 AI」對照差異，訓練判斷力 |
| 跨 session 持續性 | HIGH | LocalStorage 持久化 + 自動儲存 |
| Prompt 散落 | MEDIUM | 每張卡片內建 prompt 複製按鈕 |
| 結果分享 | MEDIUM | 卡 10 痛點身份證匯出 Markdown / JSON / PDF |

---

## 4. 解決方案概述

### 4.1 核心架構：9 張卡片 + 1 張身份證 + 1 個入口

```
入口頁 (/learn/worksheet)
    ↓ 開始
[卡 1] 抱怨原句          ← 你來寫（蘇格拉底提示：這是他說的還是你幫他想的？）
    ↓ 反思提示
[卡 2] 三個有名字的人     ← 你來寫（蘇格拉底提示：今天傳得到他訊息嗎？）
    ↓ 反思提示
[卡 3] 卡關公式          ← 你來寫 + AI 校對（你寫的公式句別人聽得懂嗎？）
    ↓ 反思提示
[卡 4] 現在怎麼解        ← 你來寫 + AI 提案（他過去 30 天有花過時間或錢嗎？）
    ↓ 反思提示
[卡 5] 兩件事不能同時要   ← 你自陳 side_a/side_b/sacrificed/sacrificed_reason
    ↓ 反思提示
[卡 6] AI 證據蒐集        ← AI 跑研究（8 個答案裡哪一個讓你最意外？）
    ↓ 反思提示
[卡 7] 自己先猜 + 讀 AI   ← 你先寫猜測 → AI 整理判斷表 → 對照差異
    ↓ 反思提示
[卡 8] 真人訪談規劃       ← 你選對象（這 3 道題你今晚能傳給其中一個人嗎？）
    ↓ 反思提示
[卡 9] 真假判斷           ← 你來判（5 個蘇格拉底提示，僅 UI；資料層只有 judgment + 100 字理由）
    ↓ 反思提示
[卡 10] 痛點身份證        ← 整合匯出
```

**反思提示 (Reflection Prompts) 取代過關條件**：每張卡片只「建議」使用者回頭把 X 想清楚再來，**不擋前進**。蘇格拉底工具不評等。

### 4.2 共用 PainCard 物件

9 張卡片填的不是 9 份獨立資料，而是同一個 `PainCard` 物件的 9 個欄位（schema 見 `data_model.md`）。這保證：

- 跨卡片資料一致（卡 6 的 prompt 自動讀卡 1–5 內容）
- 匯出時所有資訊整合在一張身份證裡
- 使用者主動回頭修改先前卡片時資料保留（不會因為回到卡 1 就清空卡 4）

### 4.3 Octalysis 動機設計（白帽限定）

| 驅動力 | 應用 |
| :--- | :--- |
| #1 Epic Meaning | 「判斷力訓練 / 不被 AI 牽著走」品牌敘事 |
| #2 Development & Accomplishment | 9 卡 stepper 進度、反思條件視覺化、痛點身份證 = 完成憑證 |
| #3 Empowerment of Creativity | 卡 7「自己先猜 vs AI」、卡 5「矛盾思辨」、自選 AI 工具 |
| #5 Social Influence | 痛點身份證可分享、Pain Atlas 集體智慧入口（M2+）|

詳見 `motivation_design.md`。

### 4.4 AI 整合策略（MVP）

- **MVP 階段**：使用者複製 prompt 到外部 ChatGPT / Claude / Gemini，AI 回覆貼回 Worksheet
- **後期階段**：站內 LLM 直接呼叫（M2+ 範圍，本 PRD 不涵蓋）
- **理由**：
  1. 降低 MVP 啟動門檻（不必處理 LLM API 成本與穩定性）
  2. 使用者保有對 AI 工具的選擇權（#3 Empowerment of Creativity）
  3. 即使站內 LLM 失效，外部複製 prompt 流程仍可運作

---

## 5. MVP 功能範圍

### 5.1 P0（必須有，否則無法上線）

- [ ] 入口頁 (`/learn/worksheet`)：說明這是什麼、誰適合用、預計時間
- [ ] 9 張卡片頁面（`/learn/worksheet/01` 至 `/09`）：依 worksheet 內容實作
- [ ] 痛點身份證頁面 (`/learn/worksheet/result`)：整合 9 卡產出
- [ ] PainCard schema 完整實作（含 `current_step`、`status`、所有欄位）
- [ ] LocalStorage 持久化（key: `painmap-worksheet`）
- [ ] 蘇格拉底反思提示（reflection prompts）：欄位空白時建議回頭，**不擋前進**
- [ ] 真實性護欄（anti-fake validators）：卡 1 禁分析語、卡 2 真實人名等，回傳 `{kind: "ok" | "hint"}` 不說 fail
- [ ] 6 段內建 prompt（卡 3 / 4 / 6 / 7 第一輪 / 7 第二輪 / 8）一鍵複製（卡 5 改為使用者自陳，無 AI prompt）
- [ ] 匯出 Markdown 格式（痛點身份證模板）
- [ ] 匯出 JSON 格式（完整 PainCard 物件）
- [ ] 繁體中文 UI（所有文案、按鈕、提示）
- [ ] 共用 PainMap brand system（color tokens、typography、spacing）

### 5.2 P1（強烈建議，但延後不致命）

- [ ] 9 卡 stepper 視覺化進度條
- [ ] 卡片內 inline AI 回覆貼上區（自動 parsing 8 題答案）
- [ ] 痛點身份證 PDF 匯出
- [ ] 多份 PainCard 並存（左側列表 + 切換）
- [ ] 跨卡片自動引用（卡 6 prompt 自動填入卡 1–5 內容）
- [ ] 中斷恢復提示（「你上次填到卡 5，是否繼續？」）

### 5.3 P2（未來迭代）

- [ ] 站內 LLM 直接呼叫（取代外部複製 prompt）
- [ ] 痛點身份證匯入 PainMap App 一鍵轉場
- [ ] Pain Atlas 社群分享（匿名貢獻）
- [ ] 多語言支援（英文版）
- [ ] 訪談排程整合（卡 8 → Google Calendar）
- [ ] AI 模擬訪談即時對話（卡 8 進階版）
- [ ] 雲端帳號系統與跨裝置同步

---

## 6. 範圍排除（Out of Scope）

> 以下事項在 M1 與 MVP 階段**明確不做**。寫出來是為了避免規格膨脹。

| 項目 | 為什麼不做 |
| :--- | :--- |
| 寫 React / 後端程式碼 | M1 只交付規格文件 |
| 視覺稿 / Figma | 共用既有 PainMap brand system，不重做設計 |
| 雲端帳號系統 | MVP 階段只用 LocalStorage，避免帳號設計爆炸 |
| LLM API 站內整合 | 先驗證流程價值再決定是否值得整合（成本考量）|
| 階段二商業驗證 | 由 `first_principles_sprint_manual.md` 負責，不在 Worksheet 裡 |
| 手作交付 / 預售 / 收第一塊錢 | 階段二範圍 |
| BCG DRI 攻擊層次 | 階段二範圍（在真痛點確認後才有意義）|
| 痛點分數排行榜 | 違反 PainMap brand 禁令（永久不做）|
| 遊戲化徽章 / streak | 違反白帽 Octalysis 原則（永久不做）|
| FOMO 文案 / 倒數計時 | 違反 brand voice（永久不做）|
| 多人協作 / 共筆 | MVP 不需要，避免狀態同步爆炸 |
| 行動 App（iOS / Android）| 響應式網頁優先，原生 App 之後再評估 |
| 學員班級管理 | 是 workshop 教學工具的範圍，不是個人工具的範圍 |

---

## 7. 成功指標

### 7.1 North Star Metric

**「完成 9 卡並產出書面真假判斷的使用者比例」（Verdict Completion Rate）**

- 計算方式：`完成卡 9 的 session 數 ÷ 進入卡 1 的 session 數`
- 目標（MVP 6 個月內）：≥ 30%
- 為什麼是這個：與紙本 worksheet 一致，唯一交付物是「書面判斷」。任何使用者完成 9 卡都產出有價值的學習結果，無論判斷是真是假
- 為什麼不是「真痛點比例」：真假比例由使用者實況決定，不是工具品質指標。即便 100% 都判斷為假痛點，工具也成功訓練了判斷力

### 7.2 輔助指標

| 指標 | 定義 | 目標 |
| :--- | :--- | :--- |
| 啟動完成率 | 進入入口頁 → 開始填卡 1 的轉換率 | ≥ 60% |
| 卡片完成率 | 每張卡片反思條件達成率（單獨計算）| 卡 1–5 ≥ 70%；卡 6–8 ≥ 50%；卡 9 ≥ 80% |
| 跨 session 復原率 | 中斷後回來繼續填的比例 | ≥ 40% |
| 匯出觸發率 | 完成卡 9 → 觸發匯出的比例 | ≥ 70% |
| 主動回頭使用率 | 寫到一半主動回去把先前卡修清楚的比例 | ≥ 60%（健康訊號）|
| 平均完成時間 | 卡 1 開始到卡 9 完成的中位時間 | 第一次 60–90 分鐘；熟練後 30 分鐘 |
| 換題率 | 卡片反思後使用者主動棄用此 PainCard 重新建立的比例 | ≤ 30%（過高代表入門門檻太高）|

### 7.3 不該追的虛榮指標（Anti-Metrics）

- 註冊用戶數（沒有帳號系統）
- DAU / MAU（這是訓練工具不是日常 app）
- 平均使用時長（時間長不一定好，可能代表卡關）
- 痛點身份證分享數（社交分享不是核心目標）

---

## 8. 與 PainMap 進階版的銜接（轉化漏斗）

```
[Worksheet 1000 進場使用者]
   ↓ 啟動完成率 60%
[600 使用者開始填卡 1]
   ↓ Verdict Completion Rate 30%
[300 使用者完成卡 9 書面判斷]
   ├── 200 判斷為真痛點 → 進 PainMap App / 階段二 sprint
   ├── 80 判斷為待訪談  → 留在 Worksheet 排訪談，訪談後回填卡 9
   └── 20 判斷為假痛點  → 封存 PainCard，鼓勵重啟新題目
```

### 銜接時機

- **`verdict.judgment === 'true_pain'`**：卡 10 痛點身份證下方出現 CTA「將這個痛點匯入 PainMap App」
- **`verdict.judgment === 'pending_interview'`**：CTA 改為「排訪談」+ 顯示卡 8 對象清單
- **`verdict.judgment === 'fake_pain'`**：CTA 改為「換題目重新填」，PainCard 封存但保留歷史記錄

詳見 `stage1_to_stage2_handoff.md`。

---

## 9. 競品對照（差異化立場）

### 9.1 反 idea score 立場

市面上的「想 idea / 評估 idea / 打分 idea」工具（統稱 IdeaCheck 類）共通病：

- 用 0–100 分數量化 idea 品質，使用者把分數誤認為答案
- 鼓勵 brainstorm 100 個 idea，造成決策疲勞
- 不訓練判斷力，只給結論
- 從「想 idea」開始，跳過「找有名字的人」這個物理量

### 9.2 Worksheet 立場

| 維度 | IdeaCheck 類 | PainMap Worksheet |
| :--- | :--- | :--- |
| 起點 | 你的 idea | 別人的抱怨 |
| 終點 | idea 分數 | 書面真假判斷 |
| AI 角色 | 評估 idea | 蒐集證據（不評估）|
| 用語 | 點子 / 靈感 / 評分 | 痛點 / 結構化 / 釐清 / 驗證 |
| 數字 | 85/100 顯眼 | **資料層完全不存分數**（無 score 欄位）|
| 結果呈現 | 排行榜 / 星等 | 痛點身份證（單張，無比較）|
| 訓練目標 | 篩選好 idea | 訓練判斷力 |
| 動機設計 | 黑帽（FOMO、稀缺、徽章）| 白帽（意義、進度、創造力）|

### 9.3 與紙本 worksheet 的關係

- 內容真相源（`painpoint_beginner_worksheet.md`）由紙本 worksheet 維護
- 網頁版**不重新發明**內容，只把紙本可填的 9 張卡片網頁化
- 所有 prompt 模板必須與紙本 worksheet 100% 一致
- 反思條件、蘇格拉底提示文字一律引用紙本

---

## 10. 技術約束

### 10.1 資料持久化

- LocalStorage 為主，schema 見 `data_model.md`
- key: `painmap-worksheet`
- 不使用 IndexedDB（MVP 資料量小、Local 已足夠）
- 不做雲端同步（M2+ 範圍）

### 10.2 AI 整合

- MVP：複製 prompt 到外部 ChatGPT / Claude / Gemini / Perplexity
- AI 回覆貼回 Worksheet（純文字 textarea；P1 階段可加 parsing）
- 不要求使用者註冊任何 AI 帳號（使用者選擇）

### 10.3 語言

- 繁體中文 (zh-Hant) 優先
- 技術術語可保留英文（API、JSON、UUID、JTBD、SECI、Octalysis、CTA 等）
- 文案禁用詞嚴格遵守 `painmap_brand_system.md` L86-100：禁用「點子」「idea」「評分」「打分」等
- 反思措辭使用蘇格拉底式「想想看」「回去把 X 想清楚再來」，不用「過關 / 退回 / 闖關」

### 10.4 前端技術

- 共用 PainMap App 進階版的 React 18 + TypeScript + Tailwind CSS
- 不引入新框架；新元件只在 `painmap_worksheet/components/` 內定義
- 響應式：手機 / 平板 / 桌面（Mobile First）
- 無障礙：WCAG AA（顏色對比 ≥ 4.5:1、語意化 HTML、鍵盤完整操作）

### 10.5 效能

- 首次有效繪製 (FMP) < 1.5s
- 卡片切換無 loading（純 client-side state）
- LocalStorage 讀寫 < 50ms

### 10.6 隱私

- 不收集任何個人識別資訊（PII）
- LocalStorage 資料僅存在使用者瀏覽器
- 不做行為追蹤分析（M2+ 才考慮 opt-in 匿名分析）
- 痛點身份證匯出由使用者主動觸發

---

## 11. 風險與緩解

| 風險 | 機率 | 影響 | 緩解 |
| :--- | :--- | :--- | :--- |
| 使用者跳過外部 AI 複製貼回流程，直接放棄 | HIGH | HIGH | P1 階段優先做 inline AI 回覆 parsing；MVP 階段提供「先讀範例後再開始」說明 |
| 使用者誤期待卡 9 給出分數 / 等級 | LOW | MEDIUM | 資料層完全沒有分數欄位；卡 9 純書面判斷 + 100 字理由 |
| LocalStorage 容量上限被打爆 | LOW | MEDIUM | 單一 PainCard < 50KB；多份並存 < 5MB；超過上限時提示匯出 |
| 卡片內容與紙本 worksheet 漂移 | HIGH | HIGH | 紙本 worksheet 為內容真相源，所有頁面 spec 必須引用 |
| Octalysis 設計偷渡黑帽動機 | MEDIUM | CRITICAL | `motivation_design.md` 列禁令清單；PR review 必檢查 |
| 使用者誤解「真痛點」== 「能賺錢」 | MEDIUM | HIGH | 卡 9 + 痛點身份證明確標示「這是判斷力訓練，不是商業判斷」|

---

> **最後一句**：這份 PRD 不是「我們要做的功能清單」，是「我們不做什麼的邊界書」。每個排除項都是過去的痛——別讓它們再回來。
