---
name: Grok Design System 規格摘要
description: docs/design-system-specs/grok 5 份規格的結構化摘要，供 painmap worksheet UI 重構參考
type: reference
---

# Grok 設計系統摘要 (供 painmap worksheet 重構)

- **日期**: 2026-05-02 18:56
- **任務**: 解析 grok/ 5 份設計系統規格 (foundations/components/patterns/templates/documentation)
- **範圍**: 全 painmap worksheet UI 重構

## 結論

### 1. 視覺哲學 (與現況最大差異)
- **Dark-first**：純黑 canvas.base (#000000) → raised (#0A0A0A) → overlay (#111111) 灰階抬升，**無陰影靠灰階做 elevation**
- **冷色強調**：accent.electric (#5B8DEF) 取代現況琥珀 (#E8913A)
- **零圓角主義**：radius.md=6px / radius.lg=8px **為上限**，不用大圓角
- **發光取代陰影**：glow.accent.sm/md/lg + glow.focus 構成 dark mode 的層次感
- **Grok 特色 Eyebrow**：font-mono uppercase letter-spacing 0.08em，4 種 variant (plain/numbered/dotted/with-line)

### 2. 字體系統
- font.sans: **Geist** → Inter → SF Pro Display fallback
- font.mono: **Geist Mono** → JetBrains Mono → SF Mono fallback
- font.display: **Geist** / Inter Display
- 共 17 個 type token (display.2xl 96px → mono.sm 12px)
- 數字一律 `font-variant-numeric: tabular-nums`

### 3. Spacing 系統 (8px base)
- 17 個 spacing token (space.0.5=2px → space.40=160px)
- 4 個 semantic section token (sm/md/lg/xl = 64/96/128/160px)
- 3 個 stack token (tight/default/loose = 8/16/32px)
- 3 個 gap token (tight/default/loose = 12/24/48px)

### 4. 20 個核心元件 (Tier 1 必先)
Button (7 var × 5 size × 6 state) / Input / Card (含 Bento) / Tag / Badge / Chip / Select / Combobox / Checkbox / Radio / Switch / Modal / Tooltip / Popover / Toast / Tabs / Eyebrow / Avatar / Code Block / Kbd

### 5. 20 個 Pattern (本專案直接用到)
Hero Section / CTA Block / Feature Triplet / Bento Grid / Form Section / Empty State / Marquee / Top Nav / Sidebar / FAQ Accordion / Stats Strip / Pricing Table / Data Table / Compare Slider / Code Demo Panel / Chat Conversation / Command Palette / Notification Center / Marquee Banner / Logo Wall

### 6. 12 個 Template (本專案 painmap 對應)
- **Landing / Marketing Home** → 對應現況 LandingPage (7 sections)
- **Settings Page** → Worksheet shell 可參考 (Sidebar tabs + Form Section)
- **Auth Flow** → 未來可能用到

## 行動項目

- [x] 建立 explore 報告
- [ ] Phase 1: 重寫 styles.css 套用 Grok token
- [ ] Phase 1: 換 Geist 字體
- [ ] Phase 2: 建 Eyebrow / SectionShell primitives
- [ ] Phase 3: 改 9 個 landing 元件
- [ ] Phase 4: 改 worksheet shell + 10 張卡片
- [ ] Phase 5: 視覺驗證 + build

## 影響評估

- **嚴重度**: HIGH (全站視覺大改)
- **影響範圍**: 全部 112 個 .tsx 檔案 (lights vs dark + cool vs warm 完全反轉)
- **風險點**: 字體切換後中文 fallback 必須測試 (Geist 無中文字符)
