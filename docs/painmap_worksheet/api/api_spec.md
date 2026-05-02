# PainMap Worksheet — REST API 規格

> **狀態**：規格文件（M1 spec 階段，M2 才會實作）
> **真相源**：`product/data_model.md`
> **MVP 注意**：MVP 階段全本地（LocalStorage），**不需要任何後端 API**。本檔列出的 P1 / P2 端點是 M2 雲端同步、M3 社群階段的規格定義。

---

## 1. 設計原則

仿 `docs/web_design/painmap` 既有風格，補上 worksheet 特有規範：

| # | 原則 | 說明 |
| :- | :--- | :--- |
| 1 | **本地優先 (Local-first)** | 所有寫入先進 LocalStorage，網路同步是 best-effort；離線可完成所有 9 張卡 |
| 2 | **資料主權** | 使用者隨時可匯出（Markdown / JSON / PDF）、刪除（軟刪除 30 天 grace period）、移交（一鍵 handoff 到 PainMap App） |
| 3 | **錯誤先描述後建議** | 所有錯誤訊息遵循 brand voice：「先說發生什麼，再說怎麼修」 |
| 4 | **冪等性 (Idempotency)** | PATCH / PUT 須冪等；客戶端可帶 `Idempotency-Key` header 避免重送 |
| 5 | **Schema 一致** | request / response 與 `product/data_model.md` 完全一致；schema 變動須升 `schema_version` |
| 6 | **匿名性** | Pain Atlas 端點絕不回傳可識別個人的欄位（`people.list[].name` / `complaint.source_name` 等） |
| 7 | **無排名 / 無分數** | schema 內無 score 欄位；對外公開的端點絕不回傳排序分數、評等、星等 |

---

## 2. 共用回應信封 (Envelope)

所有 API 回應統一格式：

```json
{
  "success": true,
  "data": { /* 端點 specific payload，失敗時為 null */ },
  "error": null,
  "meta": {
    "request_id": "req_abc123",
    "timestamp": "2026-05-02T10:00:00+08:00",
    "schema_version": "1.0",
    "page": 1,
    "page_size": 20,
    "total": 42
  }
}
```

### 失敗回應

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "卡 1 的「抱怨原句」少於 10 字。請再聽一次原話，盡量保留 10 字以上以保留情境。",
    "field": "complaint.verbatim",
    "rule": "minLength=10",
    "details": {}
  },
  "meta": {
    "request_id": "req_abc124",
    "timestamp": "2026-05-02T10:00:00+08:00",
    "schema_version": "1.0"
  }
}
```

**Field**：`success` (必填 bool) / `data` (各端點 schema) / `error.code` (見第 8 節) / `error.message` (中文 brand voice) / `error.field` (欄位 path 選填) / `error.rule` (validation rule id 選填) / `meta.page` 等 (僅分頁端點)。

---

## 3. 端點清單（依優先級）

### 3.1 MVP P0 — 無後端

MVP 階段所有資料留在 LocalStorage，**沒有任何後端端點需要實作**。

設計原因：
- 降低 MVP 部署成本（無資料庫、無 auth、無 API）
- 隱私先行（使用者資料不離開瀏覽器）
- 快速驗證 worksheet 流程是否能讓使用者完成 9 卡

僅有「AI 整合」例外，但屬複製模式 — 由前端產生 prompt 文字、使用者自己貼到外部 ChatGPT，不走後端。詳見 `api/ai_proxy_spec.md`。

---

### 3.2 M2 P1 — 雲端同步

啟用 cookie session 認證後，提供以下端點：

#### 3.2.1 `POST /api/paincards`

**用途**：建立新 PainCard（首次登入或從 LocalStorage 同步）。

**Request**（headers：`Cookie: session=...` + `Idempotency-Key: <client-uuid>`）：

```json
{ "id": "550e8400-...", "schema_version": "1.0", "status": "draft", "current_step": 1, "complaint": { /* 可選 */ } }
```

**Response 201**：`data: { id, created_at, updated_at }`

**Status codes**：201 / 400 VALIDATION_ERROR / 401 UNAUTHENTICATED / 409 DUPLICATE_ID / 429。**Rate limit**：10 / hour / user。

---

#### 3.2.2 `GET /api/paincards/:id`

**用途**：取得單張 PainCard。

**Response 200**：完整 PainCard 物件（與 `data_model.md` 一致）。

**PainCard 範例**（節錄關鍵欄位）：

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "schema_version": "1.0",
  "status": "structured",
  "current_step": 10,
  "complaint": {
    "verbatim": "我每週六晚上要寫 30 個學生的家長 LINE...",
    "source_name": "林老師",
    "source_relation": "補習班數學老師",
    "datetime": "2026-04-15T22:00:00+08:00",
    "scene": "週末晚上備課桌前"
  },
  "people": {
    "background": "30-50 歲台灣中小型補習班老師",
    "list": [
      { "name": "林志明", "contact": "LINE: liimingaa", "relation": "補習班同行" }
    ]
  },
  "stuck_formula": {
    "user_draft": "我每次要在週末寫 30 則家長回報訊息，都會卡在...",
    "ai_polished": "...",
    "ai_clarifying_questions": ["..."],
    "confirmed": true
  },
  "workaround": {
    "tool_name": "LINE + Excel + 群組翻找",
    "why_still_stuck": "三個資料源要手動翻",
    "user_dissatisfactions": ["每週 4-6 小時", "罐頭文字被識破", "寫到深夜"]
  },
  "contradiction": {
    "side_a": "家長要看見「我的孩子」被個別關照（具體事件、有溫度）",
    "side_b": "老師一週只有 2-3 小時可寫 30 則（每則 < 6 分鐘）",
    "sacrificed": "a",
    "sacrificed_reason": "因為時間是硬上限（家長期待週日早上前要收到），具體性可以靠模板偷工。一旦時間壓力出現，老師會選擇『先有訊息發出去』勝過『訊息有溫度』。"
  },
  "ai_evidence": {
    "ai_tool": "chatgpt_dr",
    "ai_tool_reason": "需要深度研究補教產業現況",
    "raw_response": "...",
    "eight_answers": { "q1_specific_groups": "...", "q2_scenes_frequency": "...", "...": "..." },
    "no_solution_check_passed": true
  },
  "self_guess": {
    "guesses": { "most_painful_person": "...", "scene": "...", "dissatisfaction": "...", "possible_fake_pain": "..." },
    "ai_checkpoints_passed": { "people_segmented": true, "scenes_observable": true, "workaround_dissatisfactions_listed": true, "fake_pains_flagged": true },
    "pain_judgment_table": "...",
    "deltas": { "biggest_diff": "...", "ai_added": "...", "guess_unsupported": "..." }
  },
  "interview_plan": {
    "targets": [{ "persona": "中小型補習班數學老師", "contact_known": true, "contact_info": "林志明" }],
    "questions": ["你週末花多久寫家長 LINE？", "...", "..."],
    "interview_taboos_understood": true
  },
  "verdict": {
    "judgment": "true_pain",
    "reason_100w": "我有 3 個有名字的同行可以聯絡。林志明每週六固定 4-6 小時。他付出最多的是時間。最有把握：Dcard 補教版有 8 篇類似抱怨。最沒把握：可能補習班規模 ≤ 30 人才相對痛...（≥ 100 字）",
    "most_confident_evidence": "Dcard 補教版 8 篇貼文",
    "least_confident": "規模門檻假設未驗證",
    "next_action": "interview"
  },
  "exported": { "formats": ["markdown"], "exported_at": "2026-05-02T15:30:00+08:00", "last_review_at": "..." },
  "created_at": "2026-04-15T22:00:00+08:00",
  "updated_at": "2026-05-02T15:30:00+08:00"
}
```

**Schema 重點**：
- schema 內無 score 欄位
- schema 內無分類學欄位
- `contradiction.sacrificed_reason`：一句話寫為什麼那邊會被犧牲

**Status codes**：200 / 401 UNAUTHENTICATED / 403 NOT_OWNER / 404 NOT_FOUND

---

#### 3.2.3 `PATCH /api/paincards/:id/cards/:step`

**用途**：更新單張卡片資料（partial update，只送該卡欄位）。`:step` ∈ {1..9}。

**Request 範例**（卡 5）：

```json
{
  "side_a": "家長要看見「我的孩子」被個別關照（具體事件、有溫度）",
  "side_b": "老師一週只有 2-3 小時可寫 30 則（每則 < 6 分鐘）",
  "sacrificed": "a",
  "sacrificed_reason": "因為時間是硬上限...（≥ 1 句完整描述）"
}
```

**Request 範例**（卡 9）：

```json
{
  "judgment": "true_pain",
  "reason_100w": "（≥ 100 字書面理由）",
  "most_confident_evidence": "Dcard 補教版 8 篇貼文",
  "least_confident": "規模門檻假設未驗證",
  "next_action": "interview"
}
```

> 卡 9 schema 內無 `scores` / `total_score` 欄位。

**Response 200**：`data: { id, current_step, fields_complete, next_step_unlocked }`

**伺服器端驗證**（除 schema 外）：
- 連續性檢查（必須先完成卡 N-1 才能寫卡 N）
- R2.1 verbatim 不可含「我覺得 / 應該需要」（中性 hint，不擋過）
- R2.2 people 真名規則
- R2.4 workaround 不可空話
- 卡 5：side_a / side_b ≥ 10 字、sacrificed ∈ {'a', 'b'}、sacrificed_reason 非空
- 卡 9：reason_100w ≥ 100 字、judgment ∈ {'true_pain', 'fake_pain', 'pending_interview'}

**Status codes**：200 / 400 VALIDATION_ERROR / 401 / 403 / 404 / 409 STALE_VERSION。**Rate limit**：60 / hour / user / card。

---

#### 3.2.4 `GET /api/paincards`

**用途**：列出當前使用者所有 PainCards。

**Query params**：

| Param | 預設 | 說明 |
| :--- | :--- | :--- |
| `status` | `all` | `draft` / `in_progress` / `structured` / `pending_interview` / `archived_fake` |
| `page` | 1 | 分頁 |
| `page_size` | 20 | 上限 100 |
| `sort` | `-updated_at` | 僅支援 `created_at` / `updated_at`，**不支援按分數排序**（schema 內無分數） |

**Response 200**：摘要列表，每筆含 `id` / `status` / `current_step` / `complaint.verbatim` 前 60 字 / `created_at` / `updated_at`。

**Status codes**：200 / 401

---

#### 3.2.5 `DELETE /api/paincards/:id`

**用途**：軟刪除（30 天 grace period 後物理刪除）。

**Response 200**：`data: { id, deleted_at, purge_at }`。使用者可在 30 天內 `POST /api/paincards/:id/restore` 還原。

**Status codes**：200 / 401 / 403 / 404

---

#### 3.2.6 `POST /api/paincards/:id/export`

**用途**：產生匯出檔（Markdown / JSON / PDF）。

**Request**：`{ "format": "markdown" | "json" | "pdf" }`

> 匯出 = 完整 PainCard 內容。schema 內無 score 欄位，故無 `include_scores` 之類的篩選選項。

**Response 200**：`data: { format, url (signed, 15min 過期), expires_at, filename }`

**Status codes**：200 / 400 / 401 / 403 / 404 / 422 INCOMPLETE_CARD（PDF 須 9 張全完成；md / json 隨時可匯出）。**Rate limit**：20 / hour / user。

---

#### 3.2.7 `POST /api/paincards/:id/handoff-to-painmap-app`

**用途**：將 worksheet 完成的 PainCard 移交至 PainMap App（進階版），對映成 PainMap App 的 Pain Entry schema。

**前置條件**：
- `verdict.judgment === 'true_pain'`（假痛點 / 待訪談不可移交）
- `current_step >= 9`

**Request**：`{ target_workspace_id, preserve_evidence: true }`

**Response 201**：`data: { pain_entry_id, painmap_app_url, mapped_fields[] }`。對映規則詳見 `product/stage1_to_stage2_handoff.md`。

**Status codes**：201 / 400 NOT_TRUE_PAIN / 401 / 403 / 404 / 409 ALREADY_HANDED_OFF。**Rate limit**：10 / hour / user。

---

### 3.3 M3 P2 — 社群（Pain Atlas）

#### 3.3.1 `GET /api/atlas/preview`

**用途**：Pain Atlas 預覽（無須登入，匿名公開）。

**Query params**：`category` / `page` / `page_size`

**Response 200**：匿名痛點摘要陣列。每筆**僅含**：

- `category`（如「補教 / 自由業 / 醫療」）
- `complaint_anonymized`（移除 source_name，verbatim 截短至 80 字）
- `contradiction_summary`（從 side_a + side_b 自動產生 60 字以內摘要）
- `judgment`（`true_pain` / `pending_interview`，**絕不**包含 `fake_pain`）
- `contributed_at`（精度到日期）

> Atlas response 不含任何分類學標籤欄位。以 `contradiction_summary` 動態文字呈現「兩件事不能同時要」的概念。

**禁止欄位**：source_name、people.list、interview_plan.targets、contact 任何形式。

**Status codes**：200

---

#### 3.3.2 `POST /api/atlas/contribute`

**用途**：把自己的 PainCard 匿名貢獻到 Pain Atlas。

**Request**：`{ paincard_id, anonymize_level: "full", consent_data_use: true, category_hint }`

**處理**：(1) 驗證 `verdict.judgment === 'true_pain'` (2) 移除所有 PII 欄位 (3) 必須前端勾選「我同意匿名貢獻給社群」(4) 寫入 atlas store。

**Response 201**：`data: { atlas_entry_id, anonymized_preview }`

**Status codes**：201 / 400 / 401 / 403 / 422 NOT_TRUE_PAIN / 422 NO_CONSENT。**Rate limit**：5 / day / user。

---

## 4. 認證機制

### M2：Cookie Session

- Session cookie：`session=...`，httpOnly + secure + sameSite=lax
- 過期時間：30 天滑動續期
- 無認證 → 401 `UNAUTHENTICATED`，導向登入

### M3+：（規劃）社群帳號 OAuth

未在 M2 範圍。

---

## 5. LocalStorage → 雲端同步策略

### 同步時機

| 觸發 | 動作 |
| :--- | :--- |
| 首次登入 | 把 LocalStorage 所有 cards 透過 `POST /api/paincards`（idempotent by id）一次同步上去 |
| 每次完成一張卡 | 觸發 `PATCH /api/paincards/:id/cards/:step` |
| 視窗 focus / 每 5 分鐘 | 跑一次「diff & sync」 |
| 使用者手動「強制同步」 | 全量比對 |

### 衝突解決

採用 **last-write-wins + conflict detection**：

1. 客戶端送 PATCH 時帶 `If-Match: <updated_at>` header（HTTP ETag pattern）
2. 伺服器若發現本地 `updated_at` ≠ DB 版本 → 回傳 409 `STALE_VERSION` + 兩個版本
3. 客戶端 UI 顯示衝突解決畫面：「另一個裝置稍早修改過這張卡。請選擇保留哪個版本，或手動合併。」
4. 不自動合併（因為痛點內容是書面思考結果，自動合併會破壞語意）

### 離線降級

- 完全離線可完成 9 張卡（卡 3-8 的 AI 整合可用 MVP 複製模式繼續運作）
- 連線恢復後自動同步

### Schema 不匹配處理

- 不寫遷移函式：persist version 不匹配時直接拋棄舊資料
- LocalStorage key 與 schema 版本綁定，徹底跟舊資料切割
- 使用者重新填即可（這是設計決策，不是 bug）

---

## 6. 速率限制（Rate Limit）

防止 AI prompt 濫用 + 攻擊：

| 端點 | 限制 |
| :--- | :--- |
| `POST /api/paincards` | 10 / hour / user |
| `PATCH /api/paincards/:id/cards/:step` | 60 / hour / user / card |
| `POST /api/paincards/:id/export` | 20 / hour / user |
| `POST /api/atlas/contribute` | 5 / day / user |
| `GET /api/atlas/preview` | 100 / hour / IP（無須登入） |
| `POST /api/ai/run-prompt`（M2+） | 詳見 `ai_proxy_spec.md` |

超過限制：`429 RATE_LIMITED`，header 含 `Retry-After: <秒數>`。

---

## 7. 錯誤碼清單

依 brand voice 設計（先說發生什麼、再說怎麼修，不焦慮、賦權）：

| Code | HTTP | message 範本（中文） |
| :--- | :- | :--- |
| `UNAUTHENTICATED` | 401 | 你尚未登入。請從上方「登入」進來，本地的進度會自動同步上來。 |
| `NOT_OWNER` | 403 | 這張痛點卡片不屬於你。如果是你自己的，可能是用了不同帳號登入。 |
| `NOT_FOUND` | 404 | 找不到這張痛點卡片。可能是已被刪除或 ID 錯誤。 |
| `VALIDATION_ERROR` | 400 | （依 field 動態組合）「卡 N 的「{欄位}」{違反的規則}。{修法建議}。」 |
| `FIELD_INCOMPLETE` | 400 | 這張卡片還缺一些資訊。請補完 {缺漏欄位} 再繼續。 |
| `R2_1_HINT` | 200 + warning | 想想看：這幾個字像不像是你自己幫他想的？（中性 hint，不擋過） |
| `R2_2_HINT` | 200 + warning | 想想看：這個算真名嗎？（中性 hint，不擋過） |
| `R2_4_HINT` | 200 + warning | 想想看：他過去 30 天有沒有真的花時間或錢試圖解？（中性 hint，不擋過） |
| `STEP_NOT_REACHABLE` | 400 | 你還沒寫卡 {N-1}，無法進入卡 {N}。回去把上一張寫一寫。 |
| `STALE_VERSION` | 409 | 另一個裝置稍早修改過這張卡。請選擇保留哪個版本。 |
| `DUPLICATE_ID` | 409 | 這個 ID 已存在。可能是重送請求；通常會自動處理。 |
| `INCOMPLETE_CARD` | 422 | PDF 匯出需要 9 張卡都寫完。Markdown / JSON 可隨時匯出當前進度。 |
| `NOT_TRUE_PAIN` | 422 | 只有判定為「真痛點」的卡片可以移交至 PainMap App 或貢獻到 Pain Atlas。 |
| `NO_CONSENT` | 422 | 你尚未勾選「我同意匿名貢獻給社群」。沒有同意就不會送出。 |
| `ALREADY_HANDED_OFF` | 409 | 這張卡片已經移交過了。在 PainMap App 中可以找到對應的 Pain Entry。 |
| `RATE_LIMITED` | 429 | 你最近的請求太頻繁了。{X} 秒後再試一次。 |
| `INTERNAL_ERROR` | 500 | 我們這邊出了狀況。請稍後重試；本地進度不會遺失。 |
| `SERVICE_UNAVAILABLE` | 503 | 服務暫時離線。本地可繼續使用，連線恢復會自動同步。 |

**禁止使用**的錯誤訊息字眼：「失敗」「錯誤」「不及格」「過關」「退回」「重新填寫所有欄位」（破壞已輸入內容的提示）。

---

## 8. 版本控管

### Schema 版本

`schema_version` 在每個 PainCard 中固定，未來升級採用：

| 變更類型 | 版本變動 | 處理 |
| :--- | :--- | :--- |
| 新增可選欄位 | minor 升版 | 向下相容，舊客戶端忽略新欄位 |
| 移除欄位 / 改變欄位語意 | major 升版 | 直接拋棄舊資料（persist key 同時換名）|

### API 路徑版本

未來如有破壞性變更的 API 路徑，採用 `/api/v2/paincards/...`。當前所有端點隱含 v1 路徑前綴 `/api/`（不加 v1）。
