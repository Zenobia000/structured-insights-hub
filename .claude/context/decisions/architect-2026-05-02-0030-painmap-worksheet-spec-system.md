# architect 報告 — PainMap Worksheet Spec 系統建構

- **日期**: 2026-05-02 00:30
- **任務**: 將 `docs/workshop/painpoint_beginner_worksheet.md`（線下 9 卡填空簿）轉化為完整網頁應用 spec 系統
- **範圍**: 建立 `docs/painmap_worksheet/` 全套 50 份規格文件 + spec/plan in `docs/superpowers/`

## 結論

- 採「PainMap 初學者教學模式」定位，共用既有 `painmap_brand_system.md`，不重做設計系統。
- 以 Linus「good taste」原則：9 張卡片 = 同一個 PainCard 物件的 9 個欄位（不是 9 個獨立資料），消除特殊情況。
- 整合 Octalysis 動機設計：只用白帽 #1 Epic Meaning / #2 Accomplishment / #3 Creativity / #5 Social；限制 #4 Ownership 為「資料主權」；永久禁用黑帽 #6 Scarcity / #7 Unpredictability / #8 Loss Avoidance — 與 PainMap brand「禁分數/排行榜/FOMO」鐵律完全吻合。
- 教學模式 score 0-25 與 brand「禁分數 UI」的張力，透過 `mode=teaching|production` 切換解決：資料層保留 score（反思鏡子），UI 層依模式條件渲染；公開分享 / Atlas / API 預設過濾。
- 多 agent 並行產出 — Wave 0（主 agent）+ Wave 1（6 並行 agent，29 檔）+ Wave 2（3 並行 agent，17 檔），總 ~6500 行 markdown，無重複工。

## 行動項目

- [x] 50 份 spec 文件全部建立並非空（驗證通過）
- [x] PainCard schema 一致性驗證通過（核心欄位在 20+ 檔被引用，無偏離）
- [x] Brand 違規掃描通過（streak / 點子 / 打分 / 排行榜 全在禁令脈絡）
- [ ] M2 階段：依本系統的 `assembly/pages/*_integrated.md` 餵入 Lovable / Claude Code 產生程式碼
- [ ] M2 建議：先做 3 共用元件（card_progress_stepper / ai_prompt_copy_block / exit_gate_check）再做頁面，順序 00 → 09 → 10 → 01-08（頭尾優先）
- [ ] M2 建議：建立 brand_system 變更 → integrated prompts 同步腳本（避免漂移）
- [ ] 後續：Pain Atlas API（M3）+ 站內 LLM API（M2+）的實作優先級待 Sunny 決定

## 影響評估

- **嚴重度**: HIGH（建立了完整新產品線的設計基礎，後續 M2/M3 實作直接依賴）
- **影響範圍**:
  - `docs/painmap_worksheet/`（新增 50 檔）
  - `docs/superpowers/specs/`、`docs/superpowers/plans/`（新增 spec + plan）
  - 不影響既有 PainMap App（`docs/web_design/pages/painmap/`）
  - 後續工程實作所有檔案皆對齊本 spec
- **架構權衡**:
  - LocalStorage MVP（無雲端帳號）→ 摩擦低但無法跨裝置 → M2 才加雲端同步
  - MVP 複製 prompt 到外部 ChatGPT（非站內 LLM）→ 零 API 成本但體驗稍差 → M2+ 加 BYOK
  - 9 卡全做（不砍卡片）→ 卡片之間有強依賴，砍卡片會破壞訓練閉環

## 補充：執行統計

| Wave | Agent 數 | 檔案數 | 行數 | 耗時 |
| :--- | :-: | :-: | :-: | :--- |
| Wave 0 | 主 agent | 5 | ~1100 | 序列 |
| Wave 1 | 6 並行 | 29 | ~14600 | 最長 17 分 |
| Wave 2 | 3 並行 | 17 | ~9400 | 最長 33 分 |
| **總計** | — | **51**（含 spec/plan） | **~25100** | — |

## 參考連結

- Spec: `docs/superpowers/specs/2026-05-01-painmap-worksheet-design.md`
- Plan: `docs/superpowers/plans/2026-05-01-painmap-worksheet.md`
- 入口: `docs/painmap_worksheet/README.md`
- 真相源: `docs/workshop/painpoint_beginner_worksheet.md` v1.0
- 配套 skill: `.claude/skills/sunnydata-pain-thinking/SKILL.md`
