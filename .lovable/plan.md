## 問題

卡 2「這群人的特徵」目前的判定流程：

1. `cardTwoValidators.ts` 用**中文關鍵字字典**（年齡/職業/地點）即時跑 → 命中 ≥2 類才 `pass`
2. UI 上的 inline warning、`backgroundPass`、Anti-Fake 面板**全部**讀這個結果
3. 只有當使用者按「下一步」且 hardcoded warn 時，才 fallback call LLM 救一下

英文輸入（例：`Synergy business leaders, 30-45 year old, mostly located in Taipei`）命中不到字典 → UI 從頭到尾紅字、Anti-Fake 卡警示、按鈕擋下，雖然 LLM 其實會 pass，使用者體感就是「被無腦規則擋住」。

## 解法：改成 LLM 為主、hardcoded 為輔

### 調整後流程

1. 使用者輸入 background → debounce 800ms
2. 文字長度 ≥ 10 字 → 自動 call `judge('card2.background_specific', text)`（含 cache 命中走 cache）
3. UI 的 `backgroundPass` / inline warning / Anti-Fake 面板 **改讀 LLM verdict**
4. LLM 失敗 / no_key / rate_limit → fallback 走 hardcoded 字典結果（行為等同今天）
5. 「下一步」按鈕直接讀同一份 verdict，不再二次 call LLM

### 要改的檔案

**`src/routes/learn.worksheet.02.tsx`**
- 新增 `useEffect` debounce → call `judge()`，把結果存 `bgVerdict` state（`pass | warn | pending | fallback`）+ `bgReason`
- 寫入 cache：成功的 outcome 透過 `updateField('llm_cache.card2.background_specific', toCacheEntry(...))`
- `backgroundPass` 改用：LLM 有結果 → 用 LLM；fallback → 用 `checks.specificBackground === 'pass'`
- `backgroundWarning` 改顯示 LLM 給的 `reason`（pending 時顯示「正在分析…」）
- `handleAdvance` 中移除「specificBackground 才 call LLM」那段；改成等 `bgVerdict` 不是 `pending`
- inline highlight 條件同上

**`src/components/worksheet/card02/AntiFakeCheckPanelCard2.tsx`**
- 多接一個 prop：`backgroundLLMReason?: string`、`backgroundIsAnalyzing?: boolean`
- background 那條檢核項目改顯示 LLM reason（fallback 時還是顯示原本的 hardcoded 提示）

**不動的部分**
- `cardTwoValidators.ts` 完全不改（hardcoded 仍是 fallback 真相源）
- `llmJudge.ts` / `llmJudge.server.ts` / prompt 全部不動
- 其他 3 條 anti-fake check（realNames / contactable / allFilled）不動，理由：那 3 條是格式檢查（代稱黑名單、聯絡關鍵字、必填），LLM 無法給更好的判斷

### 邊界 / UX 細節

- `pending` 狀態：按鈕仍可按，但會顯示「分析中…」並等 verdict
- 連續輸入時取消舊 request：用 `AbortController` 或單純檢查 stale closure
- `bgVerdict` cache key 用 trim 後的文字，避免空白變動觸發 LLM
- LLM 失敗的訊息維持中性，不暴露錯誤細節

### 驗收

- 純中文輸入：行為與今天一致（LLM 多半 pass，少數 warn 時顯示 LLM reason）
- 純英文輸入（你剛剛那段）：LLM pass → UI 不再顯示警告，按鈕通行
- LLM 不可用時：自動退回今天的 hardcoded 行為
- 同一段文字編輯後再貼回：cache 命中、不重複呼叫
