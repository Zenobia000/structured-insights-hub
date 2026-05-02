---
name: Grok 設計系統 UI 大重構執行記錄
description: 整個 painmap worksheet UI 套用 Grok dark-first 設計系統的執行報告
type: project
---

# Grok 設計系統 UI 大重構

- **日期**: 2026-05-02 19:00
- **任務**: 整個 painmap worksheet UI 套用 grok 設計系統 (docs/design-system-specs/grok)
- **範圍**: src/styles.css + 7 個 ui primitive + 9 個 landing + worksheet shell + card01 + card10 全部 + card02-09 wrapper
- **分支**: refactor/socratic-unification (使用者明確指示在原分支進行)

## 結論

### 已完成

**Phase 1 — 基礎層**
- ✅ src/styles.css 完全重寫：dark-first canvas/surface/border/text/accent/status token，新增 glow/eyebrow/dot-grid/spotlight utility，保留現有命名 alias 自動帶過全部 className
- ✅ Geist Sans + Geist Mono CDN 載入，html.dark 預設，font-feature ss01/cv11/cv05 啟用

**Phase 2 — 共用 primitives**
- ✅ src/components/ui/eyebrow.tsx (4 variants: plain/numbered/dotted/with-line)
- ✅ src/components/ui/section-shell.tsx (padding/maxWidth/bg variants)
- ✅ src/components/worksheet/WorksheetCardHeader.tsx (9 卡共用 header pattern)

**Phase 3 — Landing 9 元件全重做**
- ✅ LandingPage.tsx (full-page ambient glow)
- ✅ HeroSection (display.2xl + spotlight + 序列進場動畫 + gradient text)
- ✅ ProgressVisual (Grok 9-dot dark style)
- ✅ ThreeStepTeachingSection (Feature Triplet pattern + gap-px hairline)
- ✅ ExpectationCalibrationSection (Compare grid 兩欄)
- ✅ ExamplePainCardPreviewSection (Bento large card + verdict tag)
- ✅ StartOrResumeSection (CTA Block + glow border)
- ✅ StageRelationshipSection (Stage cards + arrow connector)
- ✅ CtaFooterSection (Centered CTA + spotlight-dual + glow.md)

**Phase 4 — Worksheet shell + 關鍵卡**
- ✅ CardProgressStepper (Grok dot stepper + accent.electric line + ID 結束標記)
- ✅ learn.worksheet.tsx layout (sticky header 64px + ambient glow + ◆ logo)
- ✅ Card01 全套：FormFields / AntiFakeCheckPanel / CardOneExitGateFooter / page header (用 WorksheetCardHeader)
- ✅ Card 02-09 wrapper className 批次替換 (max-w / padding / bg-canvas-base)
- ✅ Card 10 全套：CompletionHeader (gradient hero) / PainIdCard (Bento large + glow) / ExportActions (3 tile grid) / NextStepCta (3 variants) / StageHandoffPanel / FooterActions

**Phase 5 — Build 驗證**
- ✅ npm run build 通過 (server + client 兩階段)
- ✅ 無 TS error / 無 className 錯誤

### 視覺哲學轉換摘要

| 維度 | 原 (Indigo Light) | 現 (Grok Dark) |
|------|------------------|----------------|
| Canvas | #F7F8FA 暖灰 | #000000 純黑 |
| Primary action | 琥珀 #E8913A | Electric blue #5B8DEF |
| Border | OKLCH 暖灰 1px | #1F1F1F hairline 1px |
| Text primary | #1A2332 深藍黑 | #FAFAFA 純白 |
| Elevation | 暖色 box-shadow | Glow 發光 + 灰階抬升 |
| Radius | 4-20px (10px default) | 2-8px (8px max) |
| Font display | Noto Sans TC bold | Geist bold + tracking -0.04em |
| Eyebrow marker | 無 | font-mono uppercase + dotted variant |
| Background texture | 無 | dot-grid + spotlight + noise |

### 沒做的部分（將來迭代）

- Card 02-09 page header **未** 全部換成 WorksheetCardHeader pattern (只 Card01 用了)
  - 影響：每個 card 的「卡 N / 9」+ AI 標籤+ h1 顯示樣式仍是舊版
  - 現在會自動套到 dark theme 但不是 Grok eyebrow 風格
- Card 02-09 子元件（如 PersonGroupRepeater, AntiFakeCheckPanelCard2, AiToolSelector 等）**未**手動微調
  - 用 token alias 自動切換 dark color，但細節 polish 需要逐一 review

## 行動項目

- [ ] 啟動 dev server (`npm run dev`)，逐頁視覺驗證
- [ ] (可選) 為 card 02-09 統一套用 WorksheetCardHeader pattern
- [ ] (可選) 子元件細節 polish：PersonGroupRepeater / TagInputField / AiToolSelector 等
- [ ] Commit 拆分：建議分 4 個 commit
  - `refactor(ui): adopt Grok dark design tokens & Geist font`
  - `feat(ui): add Eyebrow / SectionShell / WorksheetCardHeader primitives`
  - `refactor(landing): apply Grok patterns to 9 landing sections`
  - `refactor(worksheet): apply Grok dark theme to shell + Card01 + Card10`

## 影響評估

- **嚴重度**: HIGH (全站視覺改頭換面)
- **影響範圍**: 23 個檔案實質改寫，~110 個檔案因 token alias 自動 dark mode 化
- **無破壞**: 所有路由保持原 URL 結構、所有功能邏輯零改動、build 與 TS 全綠
- **觀察點**: Geist 無中文字符 → 中文 fallback 到 Noto Sans TC（fallback chain 已設）
