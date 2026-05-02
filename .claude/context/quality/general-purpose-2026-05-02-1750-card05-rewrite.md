# Card 5 Rewrite 報告

- **日期**: 2026-05-02 17:50
- **任務**: 卡 5 (兩件事不能同時要) 蘇格拉底大一統重寫，移除 TRIZ 分類學
- **範圍**: src/lib/cardFiveValidators.ts, src/components/worksheet/card05/*, src/routes/learn.worksheet.05.tsx

## 結論

- 已刪除 TRIZ 相關靜態資料 (`trizOptions.ts`, `cardFiveTypes.ts`) 與兩支元件 (`TrizRadioSelector.tsx`, `SixContradictionsPreview.tsx`)。
- 驗證器改吃 `PainCard["contradiction"]`，回傳 `pass | warning | pending`，新增 `sacrificedReasonFilled` 檢查。
- ExitGate footer 拋棄「過關／退回卡 3」對抗框架，改成中性 bullet「想想看」清單，tooltip 改「回去把 X 想清楚再來」。
- 主頁三段結構：A textarea / B textarea / 犧牲 radio + 為什麼 textarea；移除 AI prompt copy block 與 `aiSaysNoneFit` 退回旗標。
- ExampleReferenceCard5 改用主人翁第一人稱框架，不再援引「第 2 種」TRIZ 編號。
- Card 5 範圍 TS 檢查零錯誤；剩餘 errors 集中在 `card10/` 與 `routes/learn.worksheet.result.tsx`（Card 10 agent 負責）。

## 行動項目

- [ ] Card 10 agent 需移除 `cardTenExport.ts` 對 `trizOptions` 與 `triz_id/triz_label` 的引用，改用 `sacrificed_reason` 寫入 markdown。
- [ ] 後續可考慮把 `getTrizById` 替代邏輯一併從 `painIdCard` 預覽抽掉。

## 影響評估

- **嚴重度**: HIGH
- **影響範圍**: 卡 5 完整使用流程；卡 10 匯出 markdown 仍引用 TRIZ 欄位（需後續 agent 修復）；不影響卡 1-4、卡 6-9。
