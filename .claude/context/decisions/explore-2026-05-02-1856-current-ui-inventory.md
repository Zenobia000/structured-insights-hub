---
name: Painmap Worksheet UI 現況盤點
description: 重構前的技術棧、元件清單、路由、現有設計 token 完整快照
type: reference
---

# Painmap Worksheet UI 現況盤點

- **日期**: 2026-05-02 18:56
- **任務**: 重構前盤點現有 UI
- **範圍**: 全專案 src/

## 結論

### 技術棧
- React 19.2 + TanStack Router 1.168 + TanStack Start (Meta framework)
- Tailwind 4.2.1 + shadcn/ui (new-york style, 46 個 primitive)
- Radix UI 全套 + cva + clsx + tailwind-merge
- React Hook Form + Zod + Zustand (painCard store)
- Recharts / sonner / jsPDF 周邊

### 字體 (待換)
- Noto Sans TC (中文) + Inter (英文) + JetBrains Mono
- font-feature-settings: "ss01", "cv11" 已啟用

### 設計 token (待換)
- OKLCH 格式，**light-first**
- Primary 深藍靛 #1E3A5F、Secondary 蒂爾 #2D7D8A、Accent 琥珀 #E8913A
- 5 個 radius (4/8/12/16/20px) — 比 Grok 大太多
- shadow 用 rgba(30,58,95,*) 暖色陰影 — 與 Grok dark glow 哲學相反

### 元件統計
- Landing 元件：9 個 (LandingPage + 7 section + ProgressVisual + SectionFade)
- shadcn UI primitive：46 個 (吃 CSS variables，改 token 自動套用)
- Worksheet 共用：3 個 (CardProgressStepper / ReflectionHint / AIPromptCopyBlock)
- Card 01-09 子元件：48 個
- Card 10 子元件：6 個
- **總計 112 個 .tsx**，~10,700 LOC

### 路由
- `/` Landing
- `/learn/worksheet` shell
- `/learn/worksheet/01` ~ `/09` (9 卡)
- `/learn/worksheet/result` (Card 10 痛點身份證)
- 規格文檔 100% 已實作，無待補頁面

### 現有 className 模式
- 所有 bg-/text-/border- **都用 token**（無寫死 HEX），改 CSS variables 即自動套用
- max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 為主要 container 模式
- 已用 sm/lg responsive 但未用 md/xl 分級
- 部分用 text-[15px] / text-[18px] 寫死數字 → 待改 type token

### 缺漏
- **無測試**（src/**/*.test.* 為 0）
- **無 Storybook**
- 重構只能靠視覺 + build 驗證

## 行動項目

- [x] 完成現況盤點
- [ ] 重構不需要建測試 (使用者目前無此要求)，但每個 commit 後跑 build

## 影響評估

- **嚴重度**: HIGH
- **影響範圍**: 100-110 個 .tsx 檔需檢視 (token 替換波及範圍)
- **優勢**: shadcn 46 個元件吃 CSS vars，styles.css 一改全套用
- **風險**: card01-09 中部分 hard-coded text-[15px] 等需手動轉換
