# Verdict Export 元件規格

> 卡 10「痛點身份證」匯出元件。
> 整合前 9 張卡片的精華，產出**單一格式**的痛點身份證：Markdown / JSON / PDF。所有使用者匯出相同內容。
> 提供「下一步去哪」CTA，引導使用者進入訪談、PainMap App、或重新開始。

---

## 1. 元件用途

- **位置**：`/learn/worksheet/result` 頁面的核心元件
- **責任**：
  1. 整合 PainCard 9 個欄位的精華資料，組合成單一「痛點身份證」格式
  2. 提供三種匯出格式：Markdown / JSON / PDF（單一內容，無模式切換）
  3. 提供預覽（在頁面上即時顯示身份證的內容）
  4. 提供「下一步去哪」CTA：訪談 / 進階版 / 換題目 / 我再想想
  5. 顯示隱私聲明
- **不負責**：
  - ❌ 不負責 PainCard 資料的計算或變換（資料來自卡 9 完成後的 PainCard 物件）
  - ❌ 不負責雲端儲存（M1 階段全部本地）

---

## 2. 三種匯出格式

| 格式 | 用途 | 副檔名 | MIME |
| :-- | :--- | :--- | :--- |
| Markdown | 分享、貼到部落格、Notion | `.md` | `text/markdown` |
| JSON | 跨工具搬移、備份、匯入 PainMap App | `.json` | `application/json` |
| PDF | 列印、面對面討論、收藏 | `.pdf` | `application/pdf` |

### 2.1 檔名規則

統一格式：`paincard-{slug}-{YYYY-MM-DD}.{ext}`

```typescript
function generateFilename(card: PainCard, ext: 'md' | 'json' | 'pdf'): string {
  const slug = slugify(card.complaint.verbatim.slice(0, 20));
  const date = new Date().toISOString().slice(0, 10);  // YYYY-MM-DD
  return `paincard-${slug}-${date}.${ext}`;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w一-龥]+/g, '-')  // 保留中文與英數
    .replace(/^-+|-+$/g, '')
    .slice(0, 30) || 'untitled';
}
```

範例：
- `paincard-我每週六晚上要寫-2026-05-01.md`
- `paincard-untitled-2026-05-01.json`（complaint.verbatim 為空時）

---

## 3. Markdown 模板

### 3.1 模板結構

直接對應 `painpoint_beginner_worksheet.md` 的「痛點身份證」格式：

```markdown
# 痛點身份證

> 由 PainMap Worksheet v1.0 產出於 {created_at}
> 最後檢核日期：{updated_at}

---

## 主人翁

**{people.list[0].name}**（{people.list[0].relation}）

聯絡方式：{people.list[0].contact}

## 場景

> {complaint.verbatim}

— {complaint.source_name}（{complaint.source_relation}），{complaint.datetime}，{complaint.scene}

## 卡關公式

「{stuck_formula.ai_polished or stuck_formula.user_draft}」

## 他現在怎麼解

**工具/方法**：{workaround.tool_name}

**為什麼還是覺得卡**：{workaround.why_still_stuck}

**他不滿意的點**：
1. {workaround.user_dissatisfactions[0]}
2. {workaround.user_dissatisfactions[1]}
3. {workaround.user_dissatisfactions[2]}

## 兩件事不能同時要

- A 端（他想要這個）：{contradiction.side_a}
- B 端（他也想要這個）：{contradiction.side_b}
- **通常會犧牲**：{sacrificed_label}
- **為什麼放掉那邊**：{contradiction.sacrificed_reason}

## AI 找到的證據

**研究工具**：{ai_evidence.ai_tool}

### 8 題回應摘要

1. **具體人群**：{ai_evidence.eight_answers.q1_specific_groups}
2. **場景與頻率**：{ai_evidence.eight_answers.q2_scenes_frequency}
3. **5 個 workaround**：{ai_evidence.eight_answers.q3_workarounds}
4. **不滿（分類）**：{ai_evidence.eight_answers.q4_dissatisfactions_categorized}
5. **公開證據**：{ai_evidence.eight_answers.q5_public_evidence}
6. **真正的 JTBD**：{ai_evidence.eight_answers.q6_jtbd}
7. **可能的假痛點**：{ai_evidence.eight_answers.q7_possible_fake_pains}
8. **訪談對象**：{ai_evidence.eight_answers.q8_interview_targets}

## 我自己猜 vs AI 的差異

**我猜最痛的人**：{self_guess.guesses.most_painful_person}
**我猜最常的場景**：{self_guess.guesses.most_common_scene}
**我猜最大的不滿**：{self_guess.guesses.biggest_dissatisfaction}
**我猜的假痛點**：{self_guess.guesses.possible_fake_pain}

**最大的差異**：{self_guess.deltas.biggest_diff}

**AI 補了什麼我沒想到的**：{self_guess.deltas.ai_added}

**我的猜測 AI 證據沒支持的**：{self_guess.deltas.guess_unsupported}

## 我會優先訪談

**對象 1**：{interview_plan.targets[0].persona}
- 認識：{contact_known_text}
- 預計時間：{interview_plan.targets[0].planned_time}

**訪談題目**：
1. {interview_plan.questions[0]}
2. {interview_plan.questions[1]}
3. {interview_plan.questions[2]}

---

## 我的判斷

**這是**：{judgment_label}

**書面理由**（{verdict.reason_100w.length} 字）：

{verdict.reason_100w}

**我最有把握的證據**：{verdict.most_confident_evidence}

**我最沒把握的地方**：{verdict.least_confident}

**下一步我會**：{next_action_label}

---

> ⚠️ 這張身份證裡沒有「錢」。
> 階段一（這份）只訓練判斷力。
> 商業驗證見 `docs/product/first_principles_sprint_manual.md`。
```

### 3.2 模板變數

| 變數 | 來源 | 預設值（缺資料時） |
| :--- | :--- | :--- |
| `{created_at}` | `card.created_at` | "未記錄" |
| `{updated_at}` | `card.updated_at` | 同上 |
| `{sacrificed_label}` | "A 端" 或 "B 端" | — |
| `{contradiction.sacrificed_reason}` | 使用者親筆原因 | — |
| `{contact_known_text}` | "已認識：{name}" 或 "怎麼找：{contact_info}" | — |
| `{judgment_label}` | "真痛點" / "假痛點" / "待訪談" | — |
| `{next_action_label}` | "排訪談" / "補證據" / "換題目" | — |

### 3.3 單一輸出格式

Markdown / PDF / JSON 三種格式產出**完全相同的內容**，沒有 mode 條件分支。判斷力訓練由「使用者親筆寫 100 字理由 + 最有把握的證據 + 最沒把握的地方」承載，不依賴分數。詳見 `docs/design/painmap_pain_thinking_system.md §0.5`。

---

## 4. JSON 模板

### 4.1 完整 PainCard JSON

直接序列化整個 PainCard 物件：

```json
{
  "schema_version": "1.0",
  "exported_at": "2026-05-01T22:31:00.000Z",
  "exported_by": "painmap_worksheet_v1",
  "card": {
    "id": "uuid-v4",
    "schema_version": "1.0",
    "status": "structured",
    "created_at": "2026-04-15T21:00:00.000Z",
    "updated_at": "2026-05-01T22:31:00.000Z",
    "current_step": 10,
    "complaint": { /* ... */ },
    "people": { /* ... */ },
    "stuck_formula": { /* ... */ },
    "workaround": { /* ... */ },
    "contradiction": { /* ... */ },
    "ai_evidence": { /* ... */ },
    "self_guess": { /* ... */ },
    "interview_plan": { /* ... */ },
    "verdict": { /* ... */ },
    "exported": {
      "exported_at": "2026-05-01T22:31:00.000Z",
      "formats": ["markdown", "json"],
      "last_review_at": null
    }
  }
}
```

### 4.2 用途

- 跨裝置搬移（M2+ 雲端版）
- 匯入 PainMap App 進階版（透過 adapter 轉換到 PainEntry schema）
- 備份

### 4.3 隱私

- 包含使用者填寫的所有資料（包含 people 真名 / 聯絡方式）
- 預設**不分享**（檔案下載到使用者本地）
- 警告：「JSON 含真名與聯絡方式。若要分享，請先手動移除 people 區塊。」

---

## 5. PDF 模板

### 5.1 設計原則

- 視覺上比 Markdown 更接近「身份證」概念
- 採用 PainMap brand 色票（Deep Indigo + Deep Teal + Warm Amber）
- 適合列印（A4 縱向，2-3 頁）

### 5.2 結構

```
┌─────────────────────────────────────────────┐
│  [PainMap Logo]            痛點身份證 v1.0   │
│  ─────────────────────────────────────────  │
│                                              │
│  主人翁                                      │
│  林老師（補習班老師）                        │
│                                              │
│  場景                                        │
│  「我每週六晚上要寫 30 個學生的家長 LINE...」│
│  — 林老師，2026-04-15，書桌前打開 LINE      │
│                                              │
│  卡關公式                                    │
│  我每次要「在週末寫家長回報」，都會卡在     │
│  「資料散在週間 7 次小考、要寫得具體、不能   │
│  傷家長感情」這 3 件事同時要顧。             │
│                                              │
│  ─────────────────────────────────────────  │
│                                              │
│  我的判斷                                    │
│  ┌──────────────────────────────────────┐ │
│  │  ✓ 真痛點                              │ │
│  └──────────────────────────────────────┘ │
│                                              │
│  書面理由：                                  │
│  ［100 字以上的判斷理由］                    │
│                                              │
│  下一步：排訪談                              │
│                                              │
│  ─────────────────────────────────────────  │
│  建立日期：2026-04-15                        │
│  最後檢核：2026-05-01                        │
└─────────────────────────────────────────────┘
```

### 5.3 技術實作

- **MVP**：用 `react-pdf` 或 `jsPDF` 在前端產生（純 client-side，無伺服器）
- **頁面元素**：標題、分隔線、文字段落、判斷標籤（綠色 / amber / 灰色背景方塊）
- **字體嵌入**：Noto Sans TC（必須嵌入確保所有設備正確渲染中文）
- **A4 尺寸**：210mm x 297mm，邊距 20mm

### 5.4 不在 PDF 中顯示

- ❌ 個人聯絡方式（people.list[].contact）— PDF 用於分享，避免外洩
- ❌ 創建用的 metadata（card.id, schema_version 等）

---

## 6. 預覽呈現

### 6.1 預覽區結構

頁面中央顯示「身份證預覽」，使用者選擇格式 tab 切換：

```
┌─────────────────────────────────────────────────────────┐
│  你的痛點身份證                                          │
│                                                          │
│  [Markdown ●] [JSON ○] [PDF ○]                         │
│                                                          │
│  ┌──────────────────────────────────────────────────┐ │
│  │                                                    │ │
│  │  # 痛點身份證                                       │ │
│  │  ...                                               │ │
│  │  （即時渲染預覽）                                    │ │
│  │                                                    │ │
│  └──────────────────────────────────────────────────┘ │
│                                                          │
│  [📥 下載 paincard-xxx.md]  [📋 複製內容到剪貼簿]      │
└─────────────────────────────────────────────────────────┘
```

### 6.2 三種 tab 的預覽差異

| Tab | 預覽方式 |
| :--- | :--- |
| Markdown | 用 markdown renderer 渲染為 HTML 顯示（保留段落結構） |
| JSON | 用 syntax highlighter 顯示 JSON tree（折疊巢狀） |
| PDF | 顯示 PDF 縮圖預覽 + 「在新分頁開啟完整 PDF」按鈕 |

### 6.3 互動

- Tab 切換：即時預覽（不重新生成內容，只切換顯示方式）
- 下載按鈕：觸發瀏覽器下載 (`<a download={filename}>`)
- 複製按鈕：將 Markdown 或 JSON 內容複製到剪貼簿

---

## 7. 「下一步去哪」CTA

### 7.1 依 `verdict.judgment` 動態顯示

#### 7.1.1 真痛點 (`true_pain`) 的 CTA

```
┌──────────────────────────────────────────────────────┐
│  你的下一步                                            │
│                                                        │
│  你判斷這是真痛點。AI 證據只是文字痕跡，               │
│  真人訪談才能確認。                                    │
│                                                        │
│  [📞 排訪談（建議）]   [→ 進入 PainMap App 進階版]   │
│                                                        │
│  訪談對象：{interview_plan.targets[0].persona}        │
│  訪談題目：3 題已準備                                  │
└──────────────────────────────────────────────────────┘
```

- **主 CTA「排訪談」**：開啟 modal 顯示卡 8 的訪談規劃 + 「我已完成訪談，回來更新」連結
- **次 CTA「進入 PainMap App」**：路由到 `/app/start?from=worksheet&pain={card.id}`，並透過 adapter 轉換 schema

#### 7.1.2 假痛點 (`fake_pain`) 的 CTA

```
┌──────────────────────────────────────────────────────┐
│  你的下一步                                            │
│                                                        │
│  你判斷這是假痛點。這就是這份卡片的價值——              │
│  幫你省下 3 個月走錯路的時間。                         │
│                                                        │
│  [↻ 換題目重新填一輪]                                 │
│                                                        │
│  小提醒：如果 3 個題目都被判假，你可能還沒接觸到       │
│  真正有痛點的人群。先去那個社群混 1-2 週再回來。       │
└──────────────────────────────────────────────────────┘
```

- **主 CTA「換題目」**：建立新的 PainCard，路由到 `/learn/worksheet/01`
- 文案重點：不批評使用者「失敗」，反而強調「省下時間」的價值

#### 7.1.3 待訪談 (`pending_interview`) 的 CTA

```
┌──────────────────────────────────────────────────────┐
│  你的下一步                                            │
│                                                        │
│  你還無法判斷，這是最常見的結果——很正常。              │
│  通常訪談 2-3 人後，真假就會浮出來。                   │
│                                                        │
│  [📞 排訪談（建議）]   [💾 我再想想]                  │
│                                                        │
│  訪談對象：{interview_plan.targets[0].persona}        │
└──────────────────────────────────────────────────────┘
```

- **主 CTA「排訪談」**：同 true_pain
- **次 CTA「我再想想」**：路由到 `/learn/worksheet`（入口頁），保留資料供日後檢視

### 7.2 CTA 文案撰寫原則

| 原則 | 範例 |
| :--- | :--- |
| 給選擇權 | 永遠提供 ≥ 2 個選項，不強制單一路徑 |
| 不評判結果 | 「假痛點」不是失敗，是「省下時間」 |
| 連結到下一階段 | 真痛點 → 訪談 / 進階版；不只停在「完成」 |
| 保留退出路徑 | 「我再想想」永遠存在 |

---

## 8. 隱私聲明

### 8.1 永久顯示位置

頁面底部固定顯示：

```
┌──────────────────────────────────────────────────────┐
│ 🔒 你的資料主權                                        │
│                                                        │
│ 你填寫的內容只在你的瀏覽器（LocalStorage）。            │
│ 我們不會把你的資料傳到伺服器。                         │
│ 匯出的檔案由你自己管理。                               │
│ 想刪除？清除瀏覽器資料即可，或點 [刪除我的卡片]。      │
└──────────────────────────────────────────────────────┘
```

### 8.2 匯出前提示

點擊下載按鈕時，第一次顯示確認 dialog：

```
你即將下載 paincard-XXX.md

這份檔案包含：
- 你聽到的原句
- 3 個有名字的人（含聯絡方式）⚠️
- 你的卡關判斷與書面理由

下載後檔案在你的電腦，請自己保管好。
若分享給他人，建議先移除「3 個有名字的人」區塊。

[下載]  [取消]
```

第二次起的下載不再顯示（記錄 LocalStorage `seen_export_warning: true`）。

### 8.3 「刪除我的卡片」按鈕

- 位於頁面最底部的隱私區塊
- 點擊後二段確認：「確定刪除這張痛點身份證？此動作無法復原」
- 確認後從 LocalStorage 刪除該 PainCard，路由回入口頁

---

## 9. 元件 API

```typescript
type VerdictExportProps = {
  /** 已完成的 PainCard（必須 current_step >= 10） */
  card: PainCard;

  /** 「進入 PainMap App」回調 */
  onEnterPainMapApp?: (card: PainCard) => void;

  /** 「換題目」回調 */
  onRestartNewCard?: () => void;

  /** 「刪除卡片」回調 */
  onDeleteCard?: (cardId: string) => void;
};
```

> 沒有 mode prop——所有使用者看到同一份身份證。

---

## 10. 反模式（CRITICAL）

### 10.1 過度炫耀禁令

- ❌ 「立即分享到 Twitter / Facebook / LinkedIn」
- ❌ 「展示你的痛點身份證徽章」
- ❌ 「你是第 N 個完成的使用者」
- ❌ 「你的痛點 quality 排在前 X%」
- 替代：提供「複製連結」「複製 Markdown 內容」（M2+ 雲端版才有公開分享連結）

### 10.2 升級誘導禁令

- ❌ 「升級 Pro 解鎖 PDF 匯出」（PDF 是基本功能）
- ❌ 「升級 Pro 同步到雲端」（M1 階段不存在 Pro）
- M2+ 加入 Pro 時，升級提示應該在「主動需要時」出現（如使用者點擊「我想跨裝置同步」），不是匯出時打斷

### 10.3 慶祝過度禁令

- ❌ 撒花動畫 / confetti effect
- ❌ 「太棒了！你完成了！」過度文案
- ❌ 「達成成就：第一張痛點身份證」徽章 UI
- 替代：靜態的「✓ 已完成」標記 + 中性文案

### 10.4 強制收尾禁令

- ❌ 「離開前必須匯出」攔截 modal
- ❌ 「不下載就會丟失資料」FOMO
- 資料永久保存在 LocalStorage，使用者隨時可回來

### 10.5 評分輸出禁令

- ❌ 任何輸出格式（Markdown / JSON / PDF）中出現 0-25 分、5 維度評分、Pain Quality Score
- ❌ 任何形式的「品質排名」「品質徽章」
- ❌ 任何 mode toggle UI（teaching / production / 教學版 / 產出版）
- 資料層沒有 scores 欄位；任何 export 出現分數 = 程式碼 bug，需立即修正

---

## 11. 互動行為

### 11.1 頁面載入

```typescript
useEffect(() => {
  const card = loadCardFromLocalStorage();

  // 守衛：必須卡 9 已完成
  if (!card || card.current_step < 10) {
    router.push('/learn/worksheet');
    return;
  }

  // 預先生成三種格式的內容（lazy 但提早觸發）
  setMarkdownContent(generateMarkdown(card));
  setJsonContent(generateJSON(card));
  // PDF 在使用者點擊 PDF tab 時才生成（耗時較長）
}, []);
```

### 11.2 下載觸發

```typescript
function handleDownload(format: 'md' | 'json' | 'pdf'): void {
  // 第一次下載顯示確認
  if (!localStorage.getItem('seen_export_warning')) {
    showWarningDialog();
    return;
  }

  const content = generateContent(format, card);
  const filename = generateFilename(card, format);
  const blob = new Blob([content], { type: getMimeType(format) });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);

  // 更新 PainCard.exported.formats
  updatePainCard({
    exported: {
      ...card.exported,
      exported_at: new Date().toISOString(),
      formats: [...new Set([...card.exported.formats, format])],
    },
  });

  // Toast（克制版）
  toast.success(`已下載 ${filename}`, { duration: 2000 });
}
```

### 11.3 「進入 PainMap App」轉換

```typescript
function handleEnterPainMapApp(card: PainCard): void {
  // 透過 adapter 轉換 schema
  const painEntry = paincard_to_painentry_adapter(card);

  // 暫存到一個專用的 LocalStorage key（PainMap App 啟動時讀取）
  localStorage.setItem('painmap_app:imported_pain', JSON.stringify(painEntry));

  // 路由到 PainMap App 入口
  router.push(`/app/start?from=worksheet&pain=${card.id}`);
}
```

詳見 `product/stage1_to_stage2_handoff.md`。

---

## 12. 無障礙 (a11y)

### 12.1 ARIA 標記

```html
<section aria-labelledby="export-title">
  <h2 id="export-title">你的痛點身份證</h2>

  <div role="tablist" aria-label="匯出格式選擇">
    <button role="tab" aria-selected="true"  aria-controls="panel-md">Markdown</button>
    <button role="tab" aria-selected="false" aria-controls="panel-json">JSON</button>
    <button role="tab" aria-selected="false" aria-controls="panel-pdf">PDF</button>
  </div>

  <div role="tabpanel" id="panel-md" aria-labelledby="tab-md">
    <pre>{markdown content}</pre>
  </div>

  <button aria-label="下載 paincard-xxx.md 到本地">📥 下載</button>
  <button aria-label="複製 Markdown 內容到剪貼簿">📋 複製內容</button>
</section>

<aside role="complementary" aria-labelledby="next-step-title">
  <h2 id="next-step-title">你的下一步</h2>
  <!-- ... -->
</aside>
```

### 12.2 鍵盤操作

- Tab 進入順序：tab list → 預覽區 → 下載按鈕 → 複製按鈕 → 「下一步」CTA → 隱私區塊
- Tab list 內：Arrow keys 切換 tab（依 WAI-ARIA Tabs Pattern）
- Esc：關閉確認 dialog

### 12.3 螢幕閱讀器體驗

- 預覽區用 `<pre>` 包覆 Markdown / JSON，閱讀器可朗讀內容
- PDF tab 切換時，aria-live 宣告「PDF 預覽載入中...」
- 下載成功時，aria-live 宣告「已下載 {filename}」

---

## 13. Acceptance Criteria

- [ ] 三種匯出格式 (MD / JSON / PDF) 內容正確產出
- [ ] 檔名遵循 `paincard-{slug}-{YYYY-MM-DD}.{ext}` 格式
- [ ] 預覽區即時渲染，tab 切換流暢
- [ ] Markdown 模板對應 worksheet 末尾的「痛點身份證」格式
- [ ] JSON 包含完整 PainCard schema
- [ ] PDF 在 client side 產生（無伺服器依賴）
- [ ] 下載按鈕觸發瀏覽器下載
- [ ] 第一次下載顯示隱私警告 dialog
- [ ] 「下一步」CTA 依 `judgment` 動態顯示對應選項
- [ ] 真痛點 → 訪談 + 進階版 兩個 CTA
- [ ] 假痛點 → 換題目 CTA + 「省下時間」鼓勵文案
- [ ] 待訪談 → 訪談 + 我再想想 CTA
- [ ] 隱私區塊永久顯示
- [ ] 「刪除我的卡片」按鈕運作正常（二段確認）
- [ ] 沒有出現「分享到社群」按鈕
- [ ] 沒有出現「升級解鎖」誘導
- [ ] 沒有 confetti / 過度慶祝動畫
- [ ] PDF / Markdown / JSON 三種格式均不包含 5 維度分數
- [ ] **沒有** mode toggle UI（teaching / production）
- [ ] **沒有** `teachingMode` prop / `?mode=` URL 參數
- [ ] 鍵盤可達所有按鈕
- [ ] aria-tablist / role="tab" / role="tabpanel" 正確標記
- [ ] 進入 PainMap App 的 schema 轉換正確（透過 adapter）
