# PainMap Worksheet — 教學模式 vs 生產模式 切換指南

> **版本**：v1.0 — 2026-05-01
> **適用對象**：產品經理、工程師、QA、教師 / 工作坊主辦方、個人使用者
> **真相源**：`product/PRD.md` §1.3、`product/data_model.md` PainCardStatus 警示、`api/api_spec.md` §5、`product/stage1_to_stage2_handoff.md` §4、`references/anti_gamification_guardrails.md` §1.3 + FAQ Q5、`.claude/skills/sunnydata-pain-thinking/SKILL.md` Output: Two Modes
> **配套文件**：`implementation_guide.md`、`quality_checklist.md`

---

## 0. 為什麼有兩種模式

### 0.1 設計動機（核心張力）

PainMap Worksheet 卡 9 內部需要 0-25 分 Pain Quality Score（5 維度 × 1-5 分）作為**判斷力訓練的反思鏡子**。但 PainMap brand 鐵律明文禁止分數 UI（`painmap_brand_system.md` L24-30）：

> 禁：分數、星等、A-F 等級、排行榜、徽章、遊戲化激勵、FOMO 話術

這是 worksheet 作為**教學工具**獨有的張力：

- **教學工具的需要**：學員需要看到 5 維度分數，作為「我對痛點的理解夠不夠細」的反思
- **品牌鐵律的禁令**：分數 UI 永久禁用，因為市面上的 IdeaCheck 類產品把分數誤當答案（PRD §3.1 #4）

**Sunny 的解決方案是分模式**：教學模式（學員自己看的反思鏡子，可顯示 0-25 分附 disclaimer）；生產模式（給世界看的，永遠 status only、絕不顯示分數）。同源於 `.claude/skills/sunnydata-pain-thinking/SKILL.md` v2 的 Output: Two Modes。

### 0.2 為什麼不是「乾脆不要分數」？

完全不要分數：學員無法看到「卡 4 workaround 不滿是 1/5（太空泛）vs 4/5（具體）」；教學現場失去最直觀反思工具。

完全公開分數：違反 brand 鐵律、變成 IdeaCheck 類產品；學員把 24/25 當綠燈、跳過真人訪談；公開分享變成「曬分數」舞台。

**結論**：分模式是唯一既保留教學價值、又不破壞 brand 的方式。

---

## 1. 兩種模式的詳細對照

### 1.1 完整對照表

| 維度 | Teaching Mode | Production Mode |
| :--- | :--- | :--- |
| 顯示 5 維度評分 | ✅ 1-5 條狀視覺化 | ❌ 只顯示 ✓ checkmark |
| 顯示 `verdict.total_score` (0-25) | ✅ 卡 9 + 卡 10 內部反思 | ❌ 完全隱藏 |
| 分數帶解讀文案（20-25 / 15-19 / ≤14） | ✅ 教學提示 | ❌ 不顯示 |
| 必附 disclaimer | ✅ 「分數只是鏡子，不是答案」 | — |
| 公開分享連結 | ❌ 禁止使用教學模式分享 | ✅ 可分享（隱藏分數） |
| API 回傳 `verdict.scores` | ✅ when `?mode=teaching` | ❌ null |
| API 回傳 `verdict.total_score` | ✅ when `?mode=teaching` | ❌ 不存在 |
| Pain Atlas 顯示 | ❌ 不可貢獻教學模式資料 | ✅ 可匿名貢獻（已過濾分數） |
| PainMap App handoff | ❌ 不轉場（score 永不進生產） | ✅ 唯一可轉場模式 |
| 預設模式 | **Teaching**（worksheet 主要用途） | — |
| LocalStorage 儲存 | 完整 PainCard（含 score） | 完整 PainCard（含 score） |
| 顯示時過濾 | 透過 UI mode 切換 | 透過 UI mode 切換 |

### 1.2 兩種模式都禁的事項（紅線）

不分模式都絕對禁止：排行榜、等級 / 徽章、連續登入獎勵（streak）、過期失效機制、倒數計時器、抽獎 / loot box、FOMO 話術、比較其他使用者的分數（即使在教學模式內，也只比較自己歷史）。詳見 `references/anti_gamification_guardrails.md` §1.1 / §1.2 / §1.3。

### 1.3 為什麼預設是教學模式

Worksheet 80% 使用情境是學員 / 補習班老師 / 工作坊參與者 / 想學判斷力的初學者。對他們而言：第一次填寫需要 5 維度反思鏡子；第二次填寫仍需要分數對照「我這次比上次更具體嗎」；跟同學交流想看分數差異；上傳 Atlas / 跟同事討論才切到生產模式。故預設 teaching mode，使用者明確選擇切到 production 才隱藏分數。

---

## 2. 模式切換的實作機制

### 2.1 三層切換（優先序）

```
URL query > LocalStorage 偏好 > 預設值（teaching）
```

#### URL query string（最優先）

```
/learn/worksheet/09?mode=teaching       ← 強制教學模式
/learn/worksheet/09?mode=production     ← 強制生產模式
/learn/worksheet/09                     ← 沿用 LocalStorage / 預設
```

**使用情境**：教師分享教學連結給學員（`?mode=teaching`）；個人切生產跟同事討論（`?mode=production`）；公開分享連結 `/learn/worksheet/share/{anonymous-id}` 內部固定 production。

#### LocalStorage 偏好

```typescript
// localStorage key: "painmap_worksheet:preferences"
type Preferences = { display_mode: 'teaching' | 'production'; };
```

使用者在「設定」或卡 10 切換 → 寫入 LocalStorage → 跨 session 持久。

#### API query param（M2+）

```
GET /api/paincards/:id?mode=teaching
GET /api/paincards/:id?mode=production    ← 預設
```

API 預設 `mode=production`（防止外洩分數）。詳見 `api/api_spec.md` §5。

### 2.2 實作建議（zustand store）

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type DisplayMode = 'teaching' | 'production';

export const useDisplayMode = create<{ displayMode: DisplayMode; setDisplayMode: (m: DisplayMode) => void; }>()(
  persist(
    (set) => ({
      displayMode: 'teaching', // 預設教學
      setDisplayMode: (mode) => set({ displayMode: mode }),
    }),
    { name: 'painmap_worksheet:preferences' }
  )
);
```

頁面 mount 時：

```typescript
const searchParams = useSearchParams();
const urlMode = searchParams.get('mode') as DisplayMode | null;
const { displayMode, setDisplayMode } = useDisplayMode();

useEffect(() => {
  if (urlMode === 'teaching' || urlMode === 'production') setDisplayMode(urlMode);
}, [urlMode]);

const effectiveMode = urlMode ?? displayMode;
```

### 2.3 切換時的資料保護（核心鐵律）

**LocalStorage 永遠儲存完整 PainCard（含 `verdict.scores` / `verdict.total_score`）。模式只影響顯示層**：

```typescript
function VerdictDisplay({ verdict, mode }: Props) {
  return (
    <div>
      <div>判斷：{verdict.judgment}</div>
      <div>理由：{verdict.reason_100w}</div>

      {mode === 'teaching' && (
        <>
          <ScoresBar scores={verdict.scores} />
          <TotalScore value={verdict.total_score} />
          <Disclaimer>分數只是鏡子，不是答案。24 分的痛點仍可能是假；14 分的抱怨仍可能是真。</Disclaimer>
        </>
      )}

      {mode === 'production' && <CheckmarkDisplay scores={verdict.scores} />}
    </div>
  );
}
```

**好處**：使用者在 production 模式填寫，切回 teaching 仍看得到分數；切換不丟失任何輸入；不需要 migration。

### 2.4 公開分享的強制保護

```typescript
// app/learn/worksheet/share/[anonymousId]/page.tsx
export default function SharePage({ params }: Props) {
  const FORCED_MODE: DisplayMode = 'production'; // 強制 production，無視 URL query
  const anonymizedCard = usePublicShare(params.anonymousId);
  return <VerdictDisplay verdict={anonymizedCard.verdict} mode={FORCED_MODE} />;
}
```

公開分享必過鐵律：強制 `mode=production`；不顯示 `complaint.source_name`、`people.list[].name`、`interview_plan.targets[].contact_info`；URL 為匿名 ID 不可反查；不顯示分數（即使有人手動加 `?mode=teaching`）。

---

## 3. 與 sunnydata-pain-thinking Skill 的對應

### 3.1 Skill v2 的 Two Modes 設計

`.claude/skills/sunnydata-pain-thinking/SKILL.md` Output: Two Modes：

**Teaching mode**：
> "Pain Quality Score is the diagnostic mirror, NOT the verdict. A 24/25 pain can still be fake. A 14/25 complaint can still be real. The verdict comes from real interviews, not the score."

**Production mode**：
> "Output Validation Status. NEVER output 0–25 scores in this mode — it violates Anti-Score Brand. Status: draft | structured | verified_interview | verified_payment"

### 3.2 Worksheet 與 Skill 的同源性

| 維度 | Skill (Claude Code) | Worksheet (網頁) |
| :--- | :--- | :--- |
| 教學模式輸出 | 0-25 score + disclaimer | 0-25 score + disclaimer |
| 生產模式輸出 | Validation Status | `verdict.judgment` + `status` |
| Mode switch handover | 統一格式 handover card | 統一格式 handover card |
| 強制注入 disclaimer | 文字段落 | UI `<Disclaimer>` 元件 |

兩者**格式互通**：Skill 跑完產出 handover card → 可貼到 Worksheet 卡 10；Worksheet 跑完 handover card → 可貼到 Claude Code session 繼續用 Skill。

### 3.3 為什麼兩個工具並存

| 場景 | 工具選擇 | 模式 |
| :--- | :--- | :--- |
| 不懂 AI 的初學者 | Worksheet | Teaching |
| 補習班老師教學 | Worksheet | Teaching（學員間共享） |
| 已用 Claude Code 的開發者 | Skill | Teaching → Production（自切） |
| 想匯入 PainMap App | Worksheet | Production（強制） |
| 跟團隊討論真痛點 | Worksheet | Production（隱藏分數） |
| 公開分享 | Worksheet | Production（強制） |

---

## 4. 與 PainMap App 的銜接

### 4.1 PainMap App 永遠是 Production Mode

`docs/web_design/pages/painmap/`（PainMap 進階版）所有頁面（Pain Collector / Decomposer / Mapper / Atlas / Dashboard）：永遠不顯示 0-25 score；永遠以 `validation_status` 為決策依據；不接受任何 score 欄位的傳入。

### 4.2 Worksheet → PainMap App 轉場時必丟 score

對應 `product/stage1_to_stage2_handoff.md` §3.4：

```typescript
// lib/paincard/adapters/to_pain_entry.ts
function adaptPainCardToPainEntry(pc: PainCard): PainEntry {
  if (pc.verdict.judgment !== 'true_pain') {
    throw new Error('Only true_pain can be imported to Stage 2');
  }
  return {
    // ... 各欄位映射 ...
    // ⚠️ 關鍵：score 永遠不轉場
    // verdict.scores → NOT carried
    // verdict.total_score → NOT carried
  };
}
```

**為什麼這個鐵律重要**（`stage1_to_stage2_handoff.md` §10.2）：

> 「一旦 score 進入 Pain Entry，PainMap App 的 UI 就會被誘惑顯示它（即便標示『僅供參考』）。最安全的方式是**根本不讓 score 進入生產模式**。」

### 4.3 Mode Switch Handover Card

當使用者點擊「匯入 PainMap App」時，系統產出 handover card：

```
═══════════════════════════════════════════════════
              階段一 → 階段二 Handover
═══════════════════════════════════════════════════
  PainCard ID: [pc.id]
  痛點句:      [pc.stuck_formula.user_draft]
  教學模式分數: [pc.verdict.total_score] / 25 （僅供內部反思）
  生產模式狀態: structured
  真假判斷:    真痛點
  100 字理由:  [pc.verdict.reason_100w 摘要]
  轉場日期:    [imported_at]
  經辦:        [使用者]

  ⚠️ 重要備註:
  - 教學模式 score 僅供你個人反思，不對外輸出
  - 階段二的決策依據是 validation_status，不是 score
  - 24/25 score 仍可能是假痛點（你還沒真人訪談）
  - 14/25 抱怨仍可能是真痛點（你還沒挖深）
═══════════════════════════════════════════════════
```

這張 handover card 是**儀式感的合法 #2 Accomplishment**：明確告訴使用者「你從訓練畢業，進入實戰」，同時最後一次提醒「分數不是答案」。

---

## 5. 使用情境（Use Cases）

### 5.1 教師 / 工作坊主辦方

**場景 A：補習班老師「林老師」教學員**
林老師建立 demo PainCard（如「家長 LINE 寫不完」）走完 9 卡 → 複製卡 10 連結（自動帶 `?mode=teaching`）分享 → 學員看到 5 維度條狀分數 + 分數帶解讀 → 學員再做一張對照林老師版本。**鐵律**：分享連結是教學模式，但學員自己填寫的分數**只給自己看**（除非主動分享）。

**場景 B：工作坊現場帶 30 個學員**
主辦方建立工作坊範例 → 學員依序填寫全程 teaching → 卡 9 完成每位學員看自己 5 維度分數 → 主辦方投影幕展示「優秀範例」（學員自願提供）→ 工作坊結束學員自切 production 跟同事討論。

**場景 C：教師建立教學素材庫**
教師建 10 個示範 PainCard 涵蓋不同 TRIZ 矛盾、不同分數帶。學員可看到 24/25 但被判「待訪談」、14/25 但被判「真痛點」的範例，強化「分數只是鏡子」訊息。

### 5.2 個人使用者

**場景 D：工程師「小恆」**
獨自填寫（teaching 預設）→ 卡 9 看到 5 維度分數（如「人群具體性 2/5」）→ 反思「我對人群描述不夠細」回卡 2 補充 → 重跑卡 9 → 分數變 4/5 → 跟同事討論時切 production 隱藏分數 → 公開分享連結強制 production，同事看到的是「✓ 5 個維度都檢核過」+ 真假判斷 + 100 字理由。

**場景 E：內部創新負責人「Vicky」**
自己先做 3 張 PainCard（teaching）→ 篩選最值得做 1 張 → 切 production 取得不含分數版本 → 內部會議分享給高層 → 不顯示分數，避免高層把 24/25 當綠燈直接核 budget。

### 5.3 反例：教學模式不該被誤用

**反例 A**：用教學模式作「曬分數」工具
❌「我的分數 24/25！比你高！」
✅ 防護：公開分享強制 production；Pain Atlas 不接受教學資料；handover card 強調「分數只是鏡子」

**反例 B**：用 24/25 當綠燈跳過真人訪談
❌「分數高 → 直接寫 code 做 App」
✅ 防護：卡 9 必填 100 字理由 + `next_action`；卡 10 即使真痛點也優先推「先排訪談」；handover card 提醒「24/25 仍可能是假痛點」

---

## 6. 違規處理

### 6.1 紅線禁令（任何模式都禁）

如果有人提議以下功能 → **一律拒絕**，引用對應條款：

| 違規提議 | 拒絕引用 |
| :--- | :--- |
| 分數排行榜 | brand L24-30 + `anti_gamification_guardrails.md` §1.1 |
| 教學模式分數可分享到 Atlas | `api_spec.md` §3.3.2 + `stage1_to_stage2_handoff.md` §3.4 |
| PainMap App 顯示分數標「僅供參考」 | `stage1_to_stage2_handoff.md` §10.2 + `painmap_moat_design.md` Anti-Score Brand |
| 教學模式加 streak 鼓勵連續填卡 | `anti_gamification_guardrails.md` §1.3 #8 |
| 加倒數提示「今天不繼續會降級」 | `anti_gamification_guardrails.md` §1.1 #6 + §1.3 #8 |
| 教學模式加抽獎鼓勵多填 | `anti_gamification_guardrails.md` §1.2 #7 |

### 6.2 灰色地帶判定

| 提議 | 判定 |
| :--- | :--- |
| 教學模式顯示「你的分數比上次進步」 | ❌ 違規（比較焦慮，即使跟自己歷史比較） |
| 教學模式顯示「5 個維度全部 ≥ 3 分」 | ⚠️ 灰區，可接受但須附「鏡子」disclaimer |
| 公開分享頁顯示「此痛點檢核完整」 | ✅ 安全（事實陳述，無分數） |
| Atlas 顯示「200 個社群痛點」 | ✅ 安全（社群規模事實，非排名） |
| 教學模式加「下載 PDF 含分數」選項 | ⚠️ 灰區，需勾選 `include_scores=true` 且強制 disclaimer |

### 6.3 違規處理流程

reviewer / QA 發現違規時：立即標 PR「Needs revision」引用 §6.1 對應禁令；提供白帽替代（從 `octalysis_white_hat_principles.md` §文案模板）；不直接 reject。已上線發現違規：建 hotfix branch、立即移除違規元素、CHANGELOG 記錄。

---

## 7. UI 切換按鈕設計建議

**位置**：卡 10 右上角 mode toggle、設定頁「顯示偏好」section；**不**放在卡 1-9（避免中途切換造成混亂）。

**文案**：
```
[ 教學模式 ] [ 生產模式 ]
教學模式：顯示 5 維度反思鏡子（給自己看）
生產模式：隱藏分數，只顯示判斷結果（適合分享）
```

**禁止文案**：「進階 / 高手模式」（暗示等級）；「完整 / 精簡版」（暗示優劣）；「Pro / Free」（暗示付費）。

**切換提示**：切到生產「分數已隱藏。資料仍完整保留，可隨時切回教學模式。」；切到教學「5 維度分數已顯示。注意：分數只是鏡子，不是答案。」

**視覺**：用 segmented control（兩 tab，不用 toggle switch 避免 on/off 二元錯覺）；教學分數顯示用條狀（不用星星 / pie chart）；生產 checkmark 用驗證綠（`--color-verified: #2D9D78`）；disclaimer 用次要文字色 + 淡背景框（不用紅色警告）。

---

## 8. FAQ

**Q1：可以做「混合模式」嗎？**
不可以。模式必須二元。混合會增加實作複雜度、讓 reviewer 難判合規性、給黑帽偷渡留空間。

**Q2：在生產模式填寫，切到教學會看不到分數嗎？**
可以看到。LocalStorage 永遠儲存完整 PainCard。模式切換只影響顯示層。

**Q3：教學模式分數可以匯出到 PDF 嗎？**
可以，但必須使用者**主動勾選** `include_scores=true`。預設 PDF 不含分數。公開分享強制 `false`。

**Q4：可以在卡 1-8 也顯示「目前進度的分數」嗎？**
不可以。分數只在卡 9 完成後計算 + 顯示。會引導「衝高分數」而非「找真痛點」、製造焦慮。

**Q5：教學模式可以加「分數歷史趨勢圖」嗎？**
不可以（`anti_gamification_guardrails.md` §3.5）：「比上週進步 N 分」是比較焦慮、趨勢圖鼓勵把分數當目標。改用質性反思（如「我這次比上次的 100 字理由更具體」）。

**Q6：什麼時候強制 production？**
公開分享連結、Pain Atlas 貢獻、PainMap App handoff、API 對外回傳（除非顯式 `?mode=teaching`）。

**Q7：教師如何驗證學員分數是「自己給的」？**
分數**只能由使用者自己填**：卡 9 的 5 維度是 form input 不是 AI 自動計算；AI prompt 明確禁止「請給我打分」（`ai_proxy_spec.md` §3.3）；教學現場可要求口頭解釋。

**Q8：為什麼 PainMap App 不能顯示分數，但 Worksheet 可以？**
角色不同：Worksheet = 訓練工具（學員自己看作為反思鏡子）；PainMap App = 生產系統（分數會被誤用為決策依據，IdeaCheck 病）。對照 `stage1_to_stage2_handoff.md` §10.2：「最安全的方式是根本不讓 score 進入生產模式」。

---

## 9. 實作優先序

**MVP（M1 → M2）**：LocalStorage 永遠儲存完整 PainCard（含 score）；zustand `displayMode` + persist；URL query 覆蓋 LocalStorage 偏好；卡 9 / 卡 10 顯示層分流；disclaimer 元件；切換按鈕（卡 10 + 設定頁）；公開分享頁強制 production。

**M2（雲端同步啟動）**：API `?mode=teaching` query support；API 預設 production 過濾分數欄位；PainMap App handoff 強制丟分數；handover card 產出；Pain Atlas 拒絕教學模式資料。

**M2+（站內 LLM）**：AI 回應透過 production mode 注入 system prompt（不揭露分數）；BYOK 流程預設 production。

---

## 10. 變更紀錄

| 版本 | 日期 | 變更 | 負責人 |
| :--- | :--- | :--- | :--- |
| v1.0 | 2026-05-01 | 首版；對應 spec v1.0、SKILL v2、stage1_to_stage2_handoff v1.0 | Sunny |

---

> **最後一句**：教學模式不是「把分數悄悄藏起來」，是「把分數攤在使用者自己面前作為鏡子，但永遠不對外輸出作為答案」。這個界線守不住，PainMap 就退化成又一個 IdeaCheck。
