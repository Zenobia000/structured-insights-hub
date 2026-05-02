# PainMap Worksheet — REST API 規格

> **狀態**：規格文件（M1 spec 階段，M2 才會實作）
> **真相源**：`product/data_model.md` v1.0
> **MVP 注意**：MVP 階段全本地（LocalStorage），**不需要任何後端 API**。本檔列出的 P1 / P2 端點是 M2 雲端同步、M3 社群階段的規格定義。

---

## 1. 設計原則

仿 `docs/web_design/painmap` 既有風格，補上 worksheet 特有規範：

| # | 原則 | 說明 |
| :- | :--- | :--- |
| 1 | **本地優先 (Local-first)** | 所有寫入先進 LocalStorage，網路同步是 best-effort；離線可完成所有 9 張卡 |
| 2 | **資料主權** | 使用者隨時可匯出（Markdown / JSON / PDF）、刪除（軟刪除 30 天 grace period）、移交（一鍵 handoff 到 PainMap App） |
| 3 | **教學模式預設** | API 對外回傳預設**過濾掉** `verdict.scores` / `verdict.total_score`（防止使用者把分數當成果秀出來），需顯式 `?mode=teaching` 才回傳 |
| 4 | **錯誤先描述後建議** | 所有錯誤訊息遵循 brand voice：「先說發生什麼，再說怎麼修」 |
| 5 | **冪等性 (Idempotency)** | PATCH / PUT 須冪等；客戶端可帶 `Idempotency-Key` header 避免重送 |
| 6 | **Schema 一致** | request / response 與 `product/data_model.md` 完全一致；schema 變動須升 `schema_version` |
| 7 | **匿名性** | Pain Atlas 端點絕不回傳可識別個人的欄位（`people.list[].name` / `complaint.source_name` 等） |
| 8 | **無排名 / 無分數** | 對外公開的端點不得回傳排序分數、評等、星等 |

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
    "timestamp": "2026-05-01T10:00:00+08:00",
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
    "timestamp": "2026-05-01T10:00:00+08:00",
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

**Query params**：

| Param | 預設 | 說明 |
| :--- | :--- | :--- |
| `mode` | `production` | `teaching` 才回傳 `verdict.scores` / `verdict.total_score`；`production` 過濾掉 |

**Response 200**：完整 PainCard 物件（與 `data_model.md` 一致）。生產模式下 `verdict.scores` 為 `null`，`verdict.total_score` 不存在。

**Status codes**：200 / 401 UNAUTHENTICATED / 403 NOT_OWNER / 404 NOT_FOUND

---

#### 3.2.3 `PATCH /api/paincards/:id/cards/:step`

**用途**：更新單張卡片資料（partial update，只送該卡欄位）。`:step` ∈ {1..9}。

**Request 範例**（卡 1）：

```json
{ "verbatim": "我每週六晚上要寫...", "source_name": "林老師", "source_relation": "...", "datetime": "2026-04-15", "scene": "..." }
```

**Response 200**：`data: { id, current_step, exit_gate_passed, next_step_unlocked }`

**伺服器端驗證**（除 schema 外）：R1.2 連續性、R2.1 verbatim 不可含「我覺得 / 應該需要」、R2.2 people 真名規則、R2.4 workaround 不可空話、R3.* 跨欄位一致性（詳見 `references/pain_card_schema.md`）。

**Status codes**：200 / 400 VALIDATION_ERROR / 400 EXIT_GATE_NOT_REACHED / 401 / 403 / 404 / 409 STALE_VERSION。**Rate limit**：60 / hour / user / card。

---

#### 3.2.4 `GET /api/paincards`

**用途**：列出當前使用者所有 PainCards。

**Query params**：

| Param | 預設 | 說明 |
| :--- | :--- | :--- |
| `status` | `all` | `draft` / `in_progress` / `structured` / `pending_interview` / `archived_fake` |
| `page` | 1 | 分頁 |
| `page_size` | 20 | 上限 100 |
| `sort` | `-updated_at` | 僅支援 `created_at` / `updated_at`，**不支援按分數排序** |

**Response 200**：摘要列表（無 verdict.scores），每筆含 `id` / `status` / `current_step` / `complaint.verbatim` 前 60 字 / `created_at` / `updated_at`。

**Status codes**：200 / 401

---

#### 3.2.5 `DELETE /api/paincards/:id`

**用途**：軟刪除（30 天 grace period 後物理刪除）。

**Response 200**：`data: { id, deleted_at, purge_at }`。使用者可在 30 天內 `POST /api/paincards/:id/restore` 還原。

**Status codes**：200 / 401 / 403 / 404

---

#### 3.2.6 `POST /api/paincards/:id/export`

**用途**：產生匯出檔（Markdown / JSON / PDF）。

**Request**：`{ "format": "markdown" | "json" | "pdf", "include_scores": false }`

`include_scores=true` 僅在使用者明確勾選「我要在教學筆記中保留分數」時允許；公開分享連結強制 `include_scores=false`。

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
- `triz_label`
- `judgment`（`true_pain` / `pending_interview`，**絕不**包含 `fake_pain`）
- `contributed_at`（精度到日期）

**禁止欄位**：scores、total_score、source_name、people.list、interview_plan.targets。

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

## 5. 教學模式 vs 生產模式

預設 `mode=production`，必須顯式 `?mode=teaching` 才能取得分數。

| 欄位 | production（預設） | teaching |
| :--- | :--- | :--- |
| `verdict.scores` | `null` | 完整 5 維度 1-5 分 |
| `verdict.total_score` | 不存在 | 0-25 |
| `verdict.judgment` | 完整回傳 | 完整回傳 |
| `verdict.reason_100w` | 完整回傳 | 完整回傳 |

**理由**：分數是「給自己看的反思鏡子」，不是對外秀出的成績單。匿名貢獻到 Atlas、handoff 到 PainMap App、公開分享連結都強制使用 production 模式。

---

## 6. LocalStorage → 雲端同步策略

### 同步時機

| 觸發 | 動作 |
| :--- | :--- |
| 首次登入 | 把 LocalStorage 所有 cards 透過 `POST /api/paincards`（idempotent by id）一次同步上去 |
| 每次完成一張卡的 exit gate | 觸發 `PATCH /api/paincards/:id/cards/:step` |
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

---

## 7. 速率限制（Rate Limit）

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

## 8. 錯誤碼清單

依 brand voice 設計（先說發生什麼、再說怎麼修，不焦慮、賦權）：

| Code | HTTP | message 範本（中文） |
| :--- | :- | :--- |
| `UNAUTHENTICATED` | 401 | 你尚未登入。請從上方「登入」進來，本地的進度會自動同步上來。 |
| `NOT_OWNER` | 403 | 這張痛點卡片不屬於你。如果是你自己的，可能是用了不同帳號登入。 |
| `NOT_FOUND` | 404 | 找不到這張痛點卡片。可能是已被刪除或 ID 錯誤。 |
| `VALIDATION_ERROR` | 400 | （依 field 動態組合）「卡 N 的「{欄位}」{違反的規則}。{修法建議}。」 |
| `EXIT_GATE_NOT_REACHED` | 400 | 這張卡片還沒填妥。請補完 {缺漏欄位} 再進入下一張。 |
| `R2_1_VIOLATION` | 400 | 你寫的句子像是解讀（出現「我覺得 / 應該需要」）。請改寫成他親口說的原話。 |
| `R2_2_VIOLATION` | 400 | 「老師 A / 同學 B」這類代稱沒辦法幫你訪談。請填真名（即使對方還不認識你）。 |
| `R2_4_VIOLATION` | 400 | 「沒人解過 / 會自己想辦法」表示你還沒看清楚。請寫具體的工具或方法名稱。 |
| `R1_2_VIOLATION` | 400 | 你還沒完成卡 {N-1}，無法進入卡 {N}。回去把上一張補完。 |
| `STALE_VERSION` | 409 | 另一個裝置稍早修改過這張卡。請選擇保留哪個版本。 |
| `DUPLICATE_ID` | 409 | 這個 ID 已存在。可能是重送請求；通常會自動處理。 |
| `INCOMPLETE_CARD` | 422 | PDF 匯出需要 9 張卡都完成。Markdown / JSON 可隨時匯出當前進度。 |
| `NOT_TRUE_PAIN` | 422 | 只有判定為「真痛點」的卡片可以移交至 PainMap App 或貢獻到 Pain Atlas。 |
| `NO_CONSENT` | 422 | 你尚未勾選「我同意匿名貢獻給社群」。沒有同意就不會送出。 |
| `ALREADY_HANDED_OFF` | 409 | 這張卡片已經移交過了。在 PainMap App 中可以找到對應的 Pain Entry。 |
| `RATE_LIMITED` | 429 | 你最近的請求太頻繁了。{X} 秒後再試一次。 |
| `INTERNAL_ERROR` | 500 | 我們這邊出了狀況。請稍後重試；本地進度不會遺失。 |
| `SERVICE_UNAVAILABLE` | 503 | 服務暫時離線。本地可繼續使用，連線恢復會自動同步。 |

**禁止使用**的錯誤訊息字眼：「失敗」「錯誤」「不及格」「請重新填寫所有欄位」（破壞已輸入內容的提示）。

---

## 9. 版本控管

### Schema 版本

`schema_version` 在每個 PainCard 中固定，未來升級採用：

| 變更類型 | 版本變動 | 處理 |
| :--- | :--- | :--- |
| 新增可選欄位 | 1.0 → 1.1 | 向下相容，舊客戶端忽略新欄位 |
| 移除欄位 | 1.x → 2.0 | 須提供 migration endpoint |
| 改變欄位語意 | 1.x → 2.0 | 同上 |

### API 路徑版本

未來如有 v2，採用 `/api/v2/paincards/...`。M2 階段所有端點隱含 v1，路徑前綴 `/api/`（不加 v1）。

---

## 10. 變更紀錄

| 版本 | 日期 | 變更 |
| :--- | :--- | :--- |
| 1.0 | 2026-05-01 | 首版；MVP P0（無 API） + M2 P1（雲端同步 7 端點） + M3 P2（Atlas 2 端點） |
