# 00_Foundations — xAI Grok 風格 基礎系統規格

> 全站的物理定律。以 xAI / Grok / X 的視覺語言為基底：純黑、銳利、幾何、極簡、單色冷感 + 一抹電氣霓虹。
> 本文件為 Single Source of Truth，所有 UI 元件、模板、頁面均以此為準。

---

## 設計哲學（DNA）

| 維度 | 價值觀 | 反例 |
|------|--------|------|
| **顏色** | 純黑底為主，白字為輔，幾乎無中間灰度 | 漸層背景、彩色卡片 |
| **形狀** | 銳利幾何，最大 radius = 8px | 大圓角、膠囊、毛玻璃 |
| **字體** | 大字壓制、緊縮字距、無襯線冷感 | 手寫感、襯線、裝飾字 |
| **空間** | 大量留白、極長 vertical rhythm | 緊湊資訊密度 |
| **動效** | 短促、線性、技術感 | 彈跳、Spring、緩入緩出 |
| **意象** | 終端、CLI、太空、AI 黑盒 | 親民、卡通、擬物 |

---

## 目錄

1. [Grid & Layout System](#1-grid--layout-system)
2. [Color System](#2-color-system)
3. [Typography System](#3-typography-system)
4. [Spacing System](#4-spacing-system)
5. [Border & Radius System](#5-border--radius-system)
6. [Elevation & Glow System](#6-elevation--glow-system)
7. [Z-Index System](#7-z-index-system)
8. [Iconography](#8-iconography)
9. [Motion & Animation](#9-motion--animation)
10. [Texture & Background](#10-texture--background)
11. [Design Tokens 命名規範](#11-design-tokens-命名規範)
12. [Token Mode 管理](#12-token-mode-管理)

---

## 1. Grid & Layout System

Grok 是 Desktop-first、單一 codebase、極寬內容區 + 邊欄留白。Mobile 採垂直堆疊。

### 1.1 Container

| 屬性 | 值 | 說明 |
|------|-----|------|
| `layout.container.max-width` | 1280px | 主內容區最大寬度（聚焦感） |
| `layout.container.wide-max-width` | 1440px | 全寬區段（Hero、表格） |
| `layout.container.narrow-max-width` | 768px | 文章、文件閱讀寬度 |
| `layout.container.padding.mobile` | 20px | < 768px |
| `layout.container.padding.tablet` | 32px | 768px–1023px |
| `layout.container.padding.desktop` | 48px | >= 1024px |
| `layout.container.center` | `margin: 0 auto` | 居中策略 |

### 1.2 Grid

| 斷點 | 欄數 | Gutter | Margin | Container |
|------|------|--------|--------|-----------|
| Mobile (< 640px) | 4 | 16px | 20px | 100% |
| Tablet (640px–1023px) | 8 | 24px | 32px | 100% |
| Desktop (1024px–1279px) | 12 | 32px | 48px | 100% |
| Wide (>= 1280px) | 12 | 32px | 48px | 1280px max |
| Ultra (>= 1440px) | 12 | 32px | 48px | 1440px max（僅 Hero） |

### 1.3 Breakpoints

| Token | 值 | 說明 |
|-------|-----|------|
| `breakpoint.sm` | 640px | Mobile → Tablet |
| `breakpoint.md` | 768px | 內容區結構切換 |
| `breakpoint.lg` | 1024px | Tablet → Desktop |
| `breakpoint.xl` | 1280px | Container 鎖寬 |
| `breakpoint.2xl` | 1440px | Ultra wide |

### 1.4 Header / Sidebar Layout

| 屬性 | 值 | 說明 |
|------|-----|------|
| `space.header` | 64px | 頂部 navbar 高度 |
| `space.header.hairline` | 1px | 頂部下緣髮絲線 |
| `space.sidebar` | 240px | 桌面版側邊欄（如 Console UI） |
| `space.sidebar.collapsed` | 56px | 收合時 |
| `space.bottom-bar` | 56px | Mobile 底部導航 |

### 1.5 Layout Primitives

| 名稱 | 規則 | 用途 |
|------|------|------|
| App Shell | `min-h-screen flex flex-col bg-canvas` | 頁面外殼 |
| Sticky Nav | `h-16 sticky top-0 z-sticky border-b border-hairline backdrop-blur` | 頂部導航 |
| Hero Block | `min-h-[80vh] flex items-center` | 首屏視覺 |
| Console Layout | `grid grid-cols-[240px_1fr]` | 工具型頁面（Sidebar + Main） |
| Content Stack | `flex flex-col gap-section py-section` | 主內容垂直堆疊 |
| Two Column | `grid grid-cols-1 md:grid-cols-2 gap-12` | 平分兩欄 |
| Asymmetric Split | `grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16` | 標題 + 內容 |
| Sticky Footer | `mt-auto py-section border-t border-hairline` | 頁尾 |

### 1.6 共通 RWD 行為規則

```
規則 1：Desktop-first 寬度
  - Container 在 1280px 以下吃螢幕全寬
  - 1280px 以上鎖寬，左右自然留白即是視覺呼吸

規則 2：Mobile 垂直化
  - 所有 grid 退化為單欄堆疊
  - 字級不縮減（保持 Grok 大字風格），改為調整 line-height

規則 3：Sidebar 行為
  - Console 類頁面：Desktop 240px、Tablet 56px icon-only、Mobile 抽屜
  - 落地頁不使用 Sidebar

規則 4：圖片策略
  - 所有圖片優先採用 SVG / monochrome PNG
  - 全幅背景圖必須加 noise overlay（見 §10.3）
  - 暗色模式為主，圖片需 invert 處理或預先輸出深色版本
```

---

## 2. Color System

Grok 的色彩語言 = **黑、白、灰階八度音 + 一個霓虹強調色**。幾乎不出現飽和的中間色。

### 2.1 Canvas（畫布層級）

從最底到最上的灰階層次，模擬 OLED 黑底上的微微抬升。

| Token | 值 | 用途 | 對比（vs `text.primary` #FAFAFA） |
|-------|-----|------|----------------------|
| `color.canvas.base` | #000000 | 頁面最底層、Hero、暗黑模式預設背景 | 21:1 AAA |
| `color.canvas.raised` | #0A0A0A | 卡片、區塊（細微抬升 1 層） | 19.8:1 AAA |
| `color.canvas.overlay` | #111111 | Modal、Popover、Dropdown | 18.6:1 AAA |
| `color.canvas.sunken` | #050505 | 凹陷區、Code block 背景 | 20.4:1 AAA |
| `color.canvas.inverse` | #FAFAFA | 反相區（白底黑字反差段落） | — |

### 2.2 Surface（卡片與區塊）

| Token | 值 | 用途 |
|-------|-----|------|
| `color.surface.default` | #0A0A0A | 卡片預設 |
| `color.surface.hover` | #141414 | hover 抬升 |
| `color.surface.active` | #1A1A1A | active / pressed |
| `color.surface.elevated` | #181818 | 巢狀卡片內第二層 |
| `color.surface.disabled` | #050505 | 停用卡片（搭配低對比文字） |

### 2.3 Hairline / Border（線條）

Grok 不使用粗框線，使用 1px 髮絲線界定區塊。

| Token | 值 | 用途 |
|-------|-----|------|
| `color.border.hairline` | #1F1F1F | 預設區塊分隔（最常用） |
| `color.border.subtle` | #161616 | 極弱分隔（卡片內部分組） |
| `color.border.default` | #2A2A2A | Input 預設邊框 |
| `color.border.strong` | #3F3F3F | 強調邊框、表格表頭 |
| `color.border.focus` | #FAFAFA | Focus ring（高對比白） |
| `color.border.accent` | `color.accent.electric` | 強調框（CTA outlined） |

### 2.4 Text（文字層級）

| Token | 值 | 用途 | 對比（vs `canvas.base`） |
|-------|-----|------|----------------------|
| `color.text.primary` | #FAFAFA | 主要內文、標題 | 19.6:1 AAA |
| `color.text.secondary` | #A1A1AA | 次要說明文字 | 9.7:1 AAA |
| `color.text.tertiary` | #71717A | 標籤、metadata、時間戳 | 5.0:1 AA |
| `color.text.disabled` | #52525B | 停用 | 3.3:1（僅大字） |
| `color.text.inverse` | #0A0A0A | 白底上的深色字 | — |
| `color.text.accent` | #FFFFFF | 純白強調（標題重點） | 21:1 AAA |
| `color.text.link` | `color.accent.electric` | 連結 | — |

### 2.5 Accent（強調色）

Grok 主視覺只用一個霓虹強調色（電光藍紫）。其他語意色僅用於系統訊息。

| Token | 值 | 用途 |
|-------|-----|------|
| `color.accent.electric` | #5B8DEF | 主強調色（連結、focus、selected） |
| `color.accent.electric.hover` | #7BA5F5 | hover |
| `color.accent.electric.active` | #4070D0 | active / pressed |
| `color.accent.electric.subtle` | #1A2540 | 強調色淺底（tag 背景、selected row） |
| `color.accent.electric.glow` | rgba(91, 141, 239, 0.35) | 發光特效（focus ring outer） |

備選強調色（特殊主題、節慶、Hero 切換）：

| Token | 值 | 用途 |
|-------|-----|------|
| `color.accent.violet` | #8B5CF6 | 替代主色（AI 主題） |
| `color.accent.cyan` | #22D3EE | 資料 / 圖表強調 |
| `color.accent.amber` | #F59E0B | 警告 / 限時 |

### 2.6 Status（系統語意色）

低彩度版，避免破壞純黑風格。

| 狀態 | Token | main | bg（暗底） | text（暗底上） |
|------|-------|------|-----------|------|
| Info | `color.status.info` | #5B8DEF | #1A2540 | #BFD4FA |
| Success | `color.status.success` | #4ADE80 | #0F2A1B | #BBF7D0 |
| Warning | `color.status.warning` | #FBBF24 | #2A1F0A | #FDE68A |
| Danger | `color.status.danger` | #F87171 | #2A0F0F | #FECACA |
| Neutral | `color.status.neutral` | #71717A | #1F1F1F | #D4D4D8 |

### 2.7 Data Visualization（資料視覺化）

低飽和、暗底友善的調色盤。最多 8 色循環。

| Token | 值 |
|-------|-----|
| `color.viz.1` | #5B8DEF |
| `color.viz.2` | #8B5CF6 |
| `color.viz.3` | #22D3EE |
| `color.viz.4` | #4ADE80 |
| `color.viz.5` | #FBBF24 |
| `color.viz.6` | #F87171 |
| `color.viz.7` | #E879F9 |
| `color.viz.8` | #94A3B8 |

---

## 3. Typography System

字體選擇遵循 **「Geist 系（Vercel/X 風）優先 → JetBrains Mono fallback」** 的策略，呈現工程冷感。

### 3.1 Font Family

| Token | Stack | 用途 |
|-------|-------|------|
| `font.sans` | `Geist, Inter, "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` | 全站預設 UI |
| `font.mono` | `"Geist Mono", "JetBrains Mono", "SF Mono", Menlo, Consolas, monospace` | Code、數據、Eyebrow tag |
| `font.display` | `Geist, "Inter Display", sans-serif` | Hero / 大字標題（同 sans 但允許更大字距收緊） |

### 3.2 Font Weight

| Token | 值 | 用途 |
|-------|-----|------|
| `font.weight.regular` | 400 | 內文 |
| `font.weight.medium` | 500 | UI 標籤、按鈕、表頭 |
| `font.weight.semibold` | 600 | 副標題 |
| `font.weight.bold` | 700 | 標題、Hero |

> Grok 風格幾乎不使用 light（300）以下字重，避免脆弱感。

### 3.3 Type Scale（極端對比尺度）

Grok 風格的核心：**Hero 巨大、Body 偏小、之間幾乎沒有中間級**，製造視覺張力。

| Token | size / line-height | 字重 | 字距 | 用途 |
|-------|----|------|------|------|
| `type.display.2xl` | 96px / 96px | 700 | -0.04em | Hero 主標題（desktop） |
| `type.display.xl` | 72px / 76px | 700 | -0.04em | Hero 主標題（tablet） |
| `type.display.lg` | 56px / 60px | 700 | -0.03em | 區段大標 |
| `type.display.md` | 44px / 48px | 700 | -0.03em | Section title |
| `type.display.sm` | 36px / 40px | 600 | -0.02em | Sub section title |
| `type.heading.xl` | 28px / 36px | 600 | -0.02em | Card 主標題 |
| `type.heading.lg` | 22px / 28px | 600 | -0.01em | Modal 標題、Sidebar group |
| `type.heading.md` | 18px / 24px | 600 | 0 | List item title |
| `type.heading.sm` | 16px / 22px | 600 | 0 | Form group label |
| `type.body.lg` | 18px / 28px | 400 | 0 | 大段文章內文 |
| `type.body.md` | 15px / 24px | 400 | 0 | 預設內文 |
| `type.body.sm` | 13px / 20px | 400 | 0 | 次要說明 |
| `type.body.xs` | 11px / 16px | 400 | 0.02em | 標籤、metadata |
| `type.label.md` | 13px / 16px | 500 | 0.04em | UI 按鈕、Tab |
| `type.label.sm` | 11px / 14px | 500 | 0.06em | Caps eyebrow（搭配 uppercase） |
| `type.mono.md` | 14px / 22px | 400 | 0 | Code、JSON、命令 |
| `type.mono.sm` | 12px / 18px | 400 | 0 | inline code |

### 3.4 Eyebrow Pattern（眉題）

Grok 標誌性元素：每個段落上方一個 mono / uppercase 小字眉題，用 `/` 分隔。

```
 ── 規則 ──
 type.label.sm + uppercase + letter-spacing 0.08em
 + color.text.tertiary
 + 前後留 24px 距離
 + 範例：「01 / FOUNDATIONS / COLOR」
```

### 3.5 Numeric / Data Display

```
 - 所有數字、金額、百分比、時間戳：強制 font-variant-numeric: tabular-nums
 - 大數字（KPI）：使用 type.display.lg 或更大 + font-mono
 - Token: typography.tabular-nums
```

---

## 4. Spacing System

8px base scale + 大區段刻度（Grok 大量使用 80–160px section padding）。

### 4.1 Base Scale

| Token | 值 | 用途 |
|-------|-----|------|
| `space.0` | 0px | 無 |
| `space.0.5` | 2px | hairline padding |
| `space.1` | 4px | icon 與文字間距 |
| `space.2` | 8px | 緊湊元件內距 |
| `space.3` | 12px | input padding（縱向） |
| `space.4` | 16px | 預設區塊內距 |
| `space.5` | 20px | 卡片內距 |
| `space.6` | 24px | 卡片間距 |
| `space.8` | 32px | 區塊內 row 間距 |
| `space.10` | 40px | 子段落間距 |
| `space.12` | 48px | 區段標題下方 |
| `space.16` | 64px | 小型 section padding |
| `space.20` | 80px | 預設 section padding |
| `space.24` | 96px | Hero 上下 padding（mobile） |
| `space.32` | 128px | Hero 上下 padding（desktop） |
| `space.40` | 160px | 大 Hero、Landing 區段 |

### 4.2 Semantic Spacing

| Token | 值 | 用途 |
|-------|-----|------|
| `space.section.sm` | 64px | 緊湊段落上下 padding |
| `space.section.md` | 96px | 預設段落 |
| `space.section.lg` | 128px | 大段落 |
| `space.section.xl` | 160px | Hero / Landing 主段落 |
| `space.stack.tight` | 8px | 緊湊堆疊 |
| `space.stack.default` | 16px | 預設堆疊 |
| `space.stack.loose` | 32px | 寬鬆堆疊 |
| `space.gap.tight` | 12px | grid gap 緊湊 |
| `space.gap.default` | 24px | grid gap 預設 |
| `space.gap.loose` | 48px | grid gap 寬鬆 |

---

## 5. Border & Radius System

Grok 風格 = 銳利。**最大圓角 = 8px**，多數元件使用 0–4px。

### 5.1 Border Width

| Token | 值 | 用途 |
|-------|-----|------|
| `border.width.0` | 0 | 無 |
| `border.width.hairline` | 1px | 預設（98% 場景） |
| `border.width.thick` | 2px | Focus ring、強調框 |

> 不使用 3px 以上。

### 5.2 Radius

| Token | 值 | 用途 |
|-------|-----|------|
| `radius.none` | 0 | Hero 區塊、全幅圖片、表格、Code block |
| `radius.xs` | 2px | Tag、Inline code |
| `radius.sm` | 4px | Input、Button、Badge |
| `radius.md` | 6px | Card 預設 |
| `radius.lg` | 8px | Modal、Dropdown menu（最大允許） |
| `radius.full` | 9999px | Avatar、僅限圓形元件（如 IconButton 圓形版） |

> **不使用** `radius.xl` 以上。膠囊按鈕（pill）僅用於 Avatar 和 Status dot。

### 5.3 Stroke Patterns

| Token | 值 | 用途 |
|-------|-----|------|
| `stroke.dashed` | `1px dashed color.border.subtle` | 上傳區、placeholder zone |
| `stroke.divider.horizontal` | `1px solid color.border.hairline` | 內容區水平分隔 |
| `stroke.divider.vertical` | `1px solid color.border.hairline` | Sidebar 與內容分隔 |

---

## 6. Elevation & Glow System

Grok 在純黑底上**不使用陰影**（陰影在黑底上不可見）。改用：
1. **Surface 抬升**（用 `canvas.raised` / `surface.hover` 等灰階差異）
2. **Glow / Halo**（強調元件 outer ring）
3. **Hairline border**（界定層次）

### 6.1 Elevation（無陰影，靠灰階）

| Token | Surface | Border | 用途 |
|-------|---------|--------|------|
| `elevation.flat` | `canvas.base` | 無 | 平面段落 |
| `elevation.raised` | `canvas.raised` | `border.subtle` | 卡片 |
| `elevation.overlay` | `canvas.overlay` | `border.hairline` | Dropdown、Popover |
| `elevation.dialog` | `canvas.overlay` | `border.default` | Modal、Sheet |

### 6.2 Glow（霓虹強調）

| Token | 值 | 用途 |
|-------|-----|------|
| `glow.focus` | `0 0 0 2px color.accent.electric.glow` | Focus ring（input、button） |
| `glow.accent.sm` | `0 0 16px color.accent.electric.glow` | 強調卡片邊緣發光 |
| `glow.accent.md` | `0 0 32px rgba(91, 141, 239, 0.25)` | Hero CTA 周圍 halo |
| `glow.accent.lg` | `0 0 80px rgba(91, 141, 239, 0.18)` | 大區塊背景光暈 |
| `glow.danger` | `0 0 0 2px rgba(248, 113, 113, 0.4)` | 錯誤 input focus |

### 6.3 淺色模式 Shadow（僅 light mode 使用）

| Token | 值 | 用途 |
|-------|-----|------|
| `shadow.sm` | `0 1px 2px rgba(0,0,0,0.04)` | 淺色 hover 卡片 |
| `shadow.md` | `0 4px 12px rgba(0,0,0,0.06)` | 淺色 dropdown |
| `shadow.lg` | `0 16px 48px rgba(0,0,0,0.08)` | 淺色 modal |

---

## 7. Z-Index System

| Token | 值 | 用途 |
|-------|-----|------|
| `z.base` | 0 | 預設 |
| `z.docked` | 10 | Sticky footer |
| `z.sticky` | 100 | Sticky header / nav |
| `z.dropdown` | 1000 | Dropdown menu |
| `z.popover` | 1100 | Popover、Tooltip |
| `z.bottomsheet` | 1150 | Mobile bottom sheet |
| `z.overlay` | 1200 | Backdrop（Modal 背景遮罩） |
| `z.modal` | 1300 | Modal dialog |
| `z.toast` | 1400 | Toast / Snackbar |
| `z.command` | 1500 | Command palette（最高） |

---

## 8. Iconography

Grok 偏好**幾何、線性、stroke-only** 的圖示風格。

### 8.1 Icon Library

| 用途 | 推薦庫 | 風格 |
|------|--------|------|
| 主要 UI Icon | **Lucide** | stroke 1.5px，幾何極簡，與 Grok 風格最契合 |
| 替代選項 | Phosphor (Light/Regular)、Tabler Icons | 同類風格 |
| 品牌 / 社群 logo | Simple Icons | 單色 |
| Emoji（謹慎使用） | 平台原生 | 僅限對話、Status |

### 8.2 Icon Sizes

| Token | 值 | 用途 |
|-------|-----|------|
| `icon.xs` | 12px | inline 內聯（搭配 type.body.xs） |
| `icon.sm` | 14px | 表單、tag |
| `icon.md` | 16px | 預設 UI（搭配 button、input） |
| `icon.lg` | 20px | Sidebar、Tab、卡片 hero icon |
| `icon.xl` | 24px | 大型 IconButton、Hero |
| `icon.2xl` | 32px | Section icon |
| `icon.3xl` | 48px | Empty state |

### 8.3 Icon Colors

| 場景 | Color Token |
|------|------------|
| 預設 | `color.text.secondary` |
| Hover | `color.text.primary` |
| Active / Selected | `color.accent.electric` |
| Disabled | `color.text.disabled` |
| 危險 | `color.status.danger` |

### 8.4 Stroke Width Convention

```
 - 預設 stroke = 1.5px（Lucide 預設）
 - 大尺寸（>= 24px）可用 2px
 - 不使用 fill 圖示，除非語意明確（例如 ★ 已收藏）
```

---

## 9. Motion & Animation

Grok 動效準則：**短、線、技術感**。避免彈跳、avoid bouncy spring。

### 9.1 Duration

| Token | 值 | 用途 |
|-------|-----|------|
| `motion.duration.instant` | 50ms | hover color 切換 |
| `motion.duration.fast` | 120ms | tooltip、Tab 切換 |
| `motion.duration.default` | 180ms | 預設 transition |
| `motion.duration.slow` | 280ms | Modal、Dropdown 進場 |
| `motion.duration.crawl` | 480ms | Hero 元件序列入場 |

### 9.2 Easing

| Token | 值 | 用途 |
|-------|-----|------|
| `motion.ease.linear` | `cubic-bezier(0, 0, 1, 1)` | 進度條、infinity loader |
| `motion.ease.standard` | `cubic-bezier(0.2, 0, 0.13, 1)` | 預設（接近 ease-out 但更銳利） |
| `motion.ease.out` | `cubic-bezier(0, 0, 0.2, 1)` | 元件退場 |
| `motion.ease.in` | `cubic-bezier(0.4, 0, 1, 1)` | 元件進場 |
| `motion.ease.snappy` | `cubic-bezier(0.5, 0, 0, 1)` | 快速切換感 |

> **不提供** spring / bounce easing。

### 9.3 Common Motion Patterns

| Pattern | 規則 |
|---------|------|
| Fade in | `opacity 0 → 1`，`motion.duration.default`，`motion.ease.standard` |
| Slide up | `translateY(8px) → 0` + fade in |
| Modal enter | `scale(0.96) → 1` + fade in，`motion.duration.slow` |
| Hover lift | `background-color` 切換，`motion.duration.fast`（**不做 translate**） |
| Focus ring | `box-shadow` 切換，`motion.duration.instant` |
| Glow pulse | `box-shadow` 0%/100% 同色 + 50% 加深，infinity，`motion.duration.crawl × 6` |

### 9.4 Reduce Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 10. Texture & Background

Grok 視覺常用兩種背景紋理：**dot grid** 與 **noise**。用得克制。

### 10.1 Dot Grid

```css
/* token: bg.dot-grid */
background-image: radial-gradient(circle, #1F1F1F 1px, transparent 1px);
background-size: 24px 24px;
background-position: 0 0;
```

| Token | 值 | 用途 |
|-------|-----|------|
| `bg.dot.dim` | dot color = `#161616`，間距 24px | Hero 大區塊背景 |
| `bg.dot.default` | dot color = `#1F1F1F`，間距 24px | 一般區塊強化 |
| `bg.dot.dense` | dot color = `#1F1F1F`，間距 16px | 小型 panel |

### 10.2 Line Grid

```css
/* token: bg.line-grid */
background-image:
  linear-gradient(to right, #161616 1px, transparent 1px),
  linear-gradient(to bottom, #161616 1px, transparent 1px);
background-size: 64px 64px;
```

用於 Console 類介面的網格背景，不超過 8% 不透明度。

### 10.3 Noise Overlay

```css
/* token: bg.noise */
background-image: url("data:image/svg+xml;base64, ..."); /* 64x64 noise svg */
opacity: 0.03;
mix-blend-mode: overlay;
```

| Token | 值 | 用途 |
|-------|-----|------|
| `bg.noise.subtle` | opacity 0.02 | 大區塊抗條帶（banding） |
| `bg.noise.default` | opacity 0.03 | 預設 |
| `bg.noise.strong` | opacity 0.06 | 復古質感（Hero 特殊頁） |

### 10.4 Spotlight / Radial Gradient

```css
/* token: bg.spotlight */
background: radial-gradient(
  ellipse 80% 50% at 50% 0%,
  rgba(91, 141, 239, 0.15),
  transparent 70%
);
```

| Token | 用途 |
|-------|------|
| `bg.spotlight.top` | Hero 頂部聚光 |
| `bg.spotlight.center` | 區塊中心聚光 |
| `bg.spotlight.dual` | 雙色（電光藍 + 紫）對角聚光 |

### 10.5 Star Field（特殊頁、品牌時刻）

```
 - 隨機散布的小白點（透明度 10–40%）
 - 數量：80–120 個 / 1440×900 視窗
 - 視差層：3 層深度（背、中、前），慢速移動
 - 僅用於 Login、404、Brand Page，不用於日常 UI
```

---

## 11. Design Tokens 命名規範

### 11.1 命名結構

```
{category}.{property}.{variant?}.{state?}
```

範例：

```
color.canvas.base
color.text.primary
color.accent.electric.hover
type.display.2xl
space.section.lg
radius.md
motion.duration.fast
glow.accent.md
```

### 11.2 Tier 系統

| Tier | 範圍 | 範例 |
|------|------|------|
| **Tier 1：Primitive Tokens** | 純色值、純尺寸 | `color.gray.900` = #0A0A0A |
| **Tier 2：Semantic Tokens** | 賦予意義 | `color.surface.default` = `color.gray.900` |
| **Tier 3：Component Tokens** | 元件專用 | `button.primary.bg` = `color.text.primary` |

實作優先序：**Tier 2 給設計系統使用者，Tier 3 給元件實作者**。

### 11.3 命名禁忌

```
✗ color.background-1     （數字編號無語意）
✗ color.dark             （形容詞，不可組合）
✗ space.medium-large     （含糊）
✗ color.brand-primary    （多重連字號難解析）

✓ color.canvas.raised
✓ space.section.md
✓ color.accent.electric.hover
```

---

## 12. Token Mode 管理

### 12.1 預設模式：Dark First

Grok 風格的預設模式 **永遠是 dark**。Light mode 為次要選項，給「白天閱讀模式」使用者。

```
 規則：
 1. 所有元件設計從 dark mode 出發
 2. Light mode 為對偶映射，不可有「dark only」元件（例外：星空背景）
 3. 系統偏好檢測：prefers-color-scheme: light → 提示用戶可切換
 4. 切換不重整頁面，500ms 內完成（CSS variables 即時切換）
```

### 12.2 Mode Token 對應表

| Semantic Token | Dark | Light |
|----------------|------|-------|
| `color.canvas.base` | #000000 | #FFFFFF |
| `color.canvas.raised` | #0A0A0A | #FAFAFA |
| `color.canvas.overlay` | #111111 | #FFFFFF |
| `color.canvas.sunken` | #050505 | #F4F4F5 |
| `color.surface.default` | #0A0A0A | #FFFFFF |
| `color.surface.hover` | #141414 | #F4F4F5 |
| `color.surface.active` | #1A1A1A | #E4E4E7 |
| `color.border.hairline` | #1F1F1F | #E4E4E7 |
| `color.border.subtle` | #161616 | #F4F4F5 |
| `color.border.default` | #2A2A2A | #D4D4D8 |
| `color.border.strong` | #3F3F3F | #A1A1AA |
| `color.text.primary` | #FAFAFA | #0A0A0A |
| `color.text.secondary` | #A1A1AA | #52525B |
| `color.text.tertiary` | #71717A | #71717A |
| `color.text.disabled` | #52525B | #A1A1AA |
| `color.accent.electric` | #5B8DEF | #2563EB |
| `color.accent.electric.subtle` | #1A2540 | #DBEAFE |

### 12.3 模式切換實作建議

```css
:root {
  /* dark mode tokens (預設) */
  --color-canvas-base: #000000;
  --color-text-primary: #FAFAFA;
  /* ... */
}

[data-theme="light"] {
  --color-canvas-base: #FFFFFF;
  --color-text-primary: #0A0A0A;
  /* ... */
}

/* 系統偏好（僅在使用者未明確選擇時） */
@media (prefers-color-scheme: light) {
  :root:not([data-theme]) {
    /* light mode override */
  }
}
```

### 12.4 圖片模式適配

```
 - SVG：使用 currentColor，自動跟隨模式
 - PNG/JPG：提供 dark / light 兩版本，<picture> 切換
 - Hero 影片：dark mode 預設，light mode 不播放
 - 截圖：必有 dark / light 兩版（或加 noise overlay 統一質感）
```

---

## 附錄 A：與 Smart Lock 平台 Token 的差異

| 維度 | Smart Lock | Grok 風格 |
|------|-----------|----------|
| 預設模式 | Light first | Dark first |
| 主色 | Trust Blue #2563EB | Electric #5B8DEF（dark） |
| Radius 上限 | 12px | 8px |
| Section padding | 64–96px | 96–160px |
| 字體 | Inter + Noto Sans TC | Geist + Geist Mono |
| 陰影 | 4 層彩色陰影 | 無陰影，改 glow + hairline |
| Eyebrow | 不使用 | 必用（mono uppercase） |

如需在 Smart Lock 平台中嵌入 Grok 風格區塊（例如 AI 對話模組），請以本規格為主，並在容器外加 `.theme-grok` class 隔離 token 作用域。

---

## 附錄 B：實作優先序清單

1. **建立 CSS variables**（覆蓋本文件 §12.2 全表）
2. **設定 Tailwind config**（color、spacing、typography 對映 token）
3. **載入 Geist 字型**（self-host 或 Google Fonts）
4. **設定 base 樣式**（body 預設 dark，font.sans，行高，font-feature-settings 開啟 tabular-nums）
5. **建立 Layout primitives**（Container、Stack、Grid Wrapper）
6. **再進入 01_components_spec.md** 實作元件層

---

**版本**：v1.0
**最後更新**：2026-05-02
**維護**：每次新增 design token 必須同步更新本文件並通知 Tailwind config 維護者
