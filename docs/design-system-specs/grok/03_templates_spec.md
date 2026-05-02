# 03_Templates — xAI Grok 風格 模板規格

> 模板層（Pages）。整合 patterns + components 形成完整頁面藍圖。
> 每個模板包含：頁面區段、模式引用、互動行為、SEO 與性能要求。

---

## 目錄

1. [Landing / Marketing Home](#1-landing--marketing-home)
2. [Product Detail Page](#2-product-detail-page)
3. [Pricing Page](#3-pricing-page)
4. [Documentation Page](#4-documentation-page)
5. [Blog Index / Article](#5-blog-index--article)
6. [Console Dashboard](#6-console-dashboard)
7. [Chat Workspace](#7-chat-workspace)
8. [Settings Page](#8-settings-page)
9. [Auth Flow（Login / Signup）](#9-auth-flow)
10. [404 / Error Page](#10-404--error-page)
11. [Status Page](#11-status-page)
12. [Changelog Page](#12-changelog-page)

---

## 1. Landing / Marketing Home

最重要的頁面 — 品牌第一接觸點。Grok 風格的 Landing 必須極具張力。

### 1.1 區段順序

```
1. Top Navigation (transparent)
2. Hero Section (with-terminal 或 text-only)
3. Marquee Banner (logo wall - optional)
4. Stats Strip (3-4 個關鍵數字)
5. Feature Bento Grid (產品核心能力展示，6-8 格)
6. Feature Triplet × 1-2 (條列功能說明)
7. Compare Slider 或 Code Demo Panel (展示「之前 vs 之後」)
8. Pricing Preview (簡化版)
9. FAQ (5-7 條最常見)
10. CTA Block (centered, with spotlight)
11. Footer (full)
```

### 1.2 區段間距規則

| 區段 | padding-top | padding-bottom |
|------|-------------|----------------|
| Hero | `space.section.xl` (160px) | `space.section.lg` (128px) |
| Stats Strip | `space.section.md` | `space.section.md` |
| Bento / Feature | `space.section.lg` | `space.section.lg` |
| FAQ | `space.section.lg` | `space.section.md` |
| CTA Block | `space.section.xl` | `space.section.xl` |
| Footer | `space.section.lg` | 64px |

### 1.3 視覺 / 動效

```
 - Hero 進場動畫：序列 fade + slide up（見 Patterns §2.3）
 - Scroll-triggered fade in：每個區段進入 viewport 80% 時 fade in（180ms ease.out）
 - 不使用 parallax（與 Grok 銳利風格衝突）
 - Hero 背景：bg.spotlight.top 或 bg.dot.dim + bg.noise.subtle
 - 全頁背景：canvas.base
```

### 1.4 SEO / Meta

```
 - title: max 60 字元，「{Product} — One-line tagline」
 - description: max 160 字元，含主關鍵字
 - og:image: 1200×630 dark mode 視覺，含 logo + tagline
 - twitter:card: summary_large_image
 - schema.org: SoftwareApplication / Organization
```

### 1.5 Performance Budget

```
 - LCP: < 2.0s（Hero 文字必須在 1.5s 內顯示）
 - CLS: < 0.05
 - 首屏 JS: < 80KB gzipped
 - 字型：preload Geist Variable，font-display: swap
 - 圖片：所有 Hero 視覺使用 next/image priority + AVIF
```

### 1.6 Mobile 行為

```
 - Hero 字級降一級（display.2xl → display.lg）
 - Bento Grid 退化為單欄
 - Feature Triplet 退化為單欄
 - Pricing Preview 改為水平捲動 cards
 - FAQ 保持原樣
```

---

## 2. Product Detail Page

單一產品 / 模組的深度介紹頁。

### 2.1 區段順序

```
1. Top Navigation (default)
2. Page Hero (eyebrow + title + subtitle，無 CTA 大型元素)
3. Anchor Nav (sticky 子導航，連結到頁內各區段)
4. Overview Section (左圖右文 / 上圖下文)
5. Capability Section × 3-5 (each with code demo / visual)
6. Integration Bento (生態整合)
7. Use Case Cards (3 個典型場景)
8. Spec Table (技術規格表)
9. Related Products (3 卡)
10. CTA Block
11. Footer
```

### 2.2 Anchor Nav

```
 ┌──────────────────────────────────────────────────────────────────┐
 │ Overview · Capabilities · Integrations · Use Cases · Specs       │
 └──────────────────────────────────────────────────────────────────┘
 - sticky top: 64px (header 下方)
 - h: 48px
 - bg: canvas.base + backdrop-blur(16px)
 - border-bottom: 1px hairline
 - 連結：type.label.md，間距 24px
 - active: text.primary + 下方 2px accent.electric underline，scroll-spy 自動高亮
```

### 2.3 Capability Section

```
 ─── 02 / CAPABILITIES (eyebrow.with-line)

 Realtime Inference

 Stream tokens at 200/sec...

 ┌───────────────────────────────┬──────────────────────────────┐
 │ Description text here.        │   [Code demo panel]          │
 │ Key features bullet list:     │   ─────────────              │
 │ • Point one                   │   $ grok stream...           │
 │ • Point two                   │                              │
 │                               │                              │
 │ [Learn more →]                │                              │
 └───────────────────────────────┴──────────────────────────────┘
```

| 屬性 | 值 |
|------|-----|
| Layout | `grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20` |
| Section padding-y | `space.section.lg` |
| 多個 capability 之間 | border-top 1px `border.hairline`（連續區段視覺分隔） |
| 偶數區段反向 | 左右對調，避免單調 |

---

## 3. Pricing Page

### 3.1 區段順序

```
1. Top Navigation
2. Page Hero (短版，eyebrow + title + 一句副標)
3. Billing Toggle (Monthly / Annual)
4. Pricing Table (3 plan)
5. Compare Table (詳細功能對比 — 約 20-30 row)
6. Add-ons Grid (附加服務)
7. FAQ (Pricing 專屬問題)
8. CTA Block (聯繫銷售 + 自助註冊)
9. Footer
```

### 3.2 Hero（精簡版）

```
                  [eyebrow GET STARTED]

           Pricing that scales.

           Start free. Pay only when you grow.
```

| 屬性 | 值 |
|------|-----|
| 標題 | `type.display.xl`（比 Landing 小一級） |
| 副標 | `type.body.lg` + `text.secondary` |
| padding-y | `space.section.lg`（比 Landing Hero 短） |
| text-align | center |
| 背景 | `bg.spotlight.top` 弱 |

### 3.3 Compare Table

```
 ─── DETAILED COMPARISON

 ┌──────────────────────────┬─────┬─────┬──────┐
 │                          │ Free│ Pro │ Ent. │
 ├──────────────────────────┼─────┼─────┼──────┤
 │ CORE FEATURES            │     │     │      │
 │   API requests / month   │ 1K  │ 100K│ ∞    │
 │   Models                 │ Mini│ All │ All+ │
 │   Latency SLA            │  –  │ 99% │ 99.9%│
 ├──────────────────────────┼─────┼─────┼──────┤
 │ ADVANCED                 │     │     │      │
 │   Custom fine-tune       │  ✕  │  –  │  ✓   │
 │   Dedicated capacity     │  ✕  │  ✕  │  ✓   │
 │   SOC2 / HIPAA           │  ✕  │  –  │  ✓   │
 ├──────────────────────────┼─────┼─────┼──────┤
 │ SUPPORT                  │     │     │      │
 │   Community              │  ✓  │  ✓  │  ✓   │
 │   Email                  │  ✕  │  ✓  │  ✓   │
 │   Slack channel          │  ✕  │  ✕  │  ✓   │
 │   Dedicated CSM          │  ✕  │  ✕  │  ✓   │
 └──────────────────────────┴─────┴─────┴──────┘
```

| 屬性 | 值 |
|------|-----|
| 第一欄 | 左對齊，`type.body.sm` |
| 後續欄 | 置中對齊，width 120px |
| Group label | `type.label.sm` uppercase + `text.tertiary`，padding-y 16px，無 border |
| Row | h 48px，border-bottom 1px `border.subtle` |
| ✓ / ✕ | 16px icon，✓ `text.primary`、✕ `text.disabled` |
| `–` | dash，`text.tertiary` |
| 數字 | font-mono tabular-nums |
| Sticky 表頭 | scroll 時 plan 名稱 sticky 到 navigator 下方 |

---

## 4. Documentation Page

### 4.1 三欄結構

```
┌─────────────┬─────────────────────────────────┬──────────────┐
│             │                                 │              │
│  Sidebar    │       Article Content           │   On-page    │
│  (240px)    │       (max 768px center)        │   TOC (240px)│
│             │                                 │              │
└─────────────┴─────────────────────────────────┴──────────────┘
```

### 4.2 規格

| 區塊 | 屬性 | 值 |
|------|------|-----|
| 容器 | grid | `grid-cols-[240px_minmax(0,1fr)_240px]` |
| 容器 | gap | 0 |
| 容器 | min-height | calc(100vh - 64px) |
| Sidebar | 同 §10 Sidebar Navigation（docs 變體） |
| Sidebar | sticky | top 64px (header 下) |
| Article | max-width | 768px |
| Article | padding | 64px 48px |
| Article | margin | `mx-auto` |
| TOC | sticky | top 64px |
| TOC | padding | 64px 24px 64px 0 |
| TOC | width | 240px |
| TOC | border-left | 無（純粹空間分隔） |

### 4.3 Article 排版

| 元素 | 樣式 |
|------|------|
| H1 | `type.display.md`，margin-bottom 16px |
| Eyebrow | 文章前置 `Eyebrow.dotted`，顯示分類路徑（DOCS / API / AUTH） |
| Lead paragraph | `type.body.lg` + `text.secondary`，margin-bottom 32px |
| H2 | `type.heading.xl`，margin-top 48px，margin-bottom 16px，前綴 anchor link icon |
| H3 | `type.heading.lg`，margin-top 32px，margin-bottom 12px |
| H4 | `type.heading.md`，margin-top 24px，margin-bottom 8px |
| 段落 | `type.body.md`，margin-bottom 16px |
| ul / ol | margin-bottom 16px，item 間距 8px |
| Inline code | 同元件 §16.1 |
| Code block | 同元件 §16.2 |
| Callout（警告 / 提示） | 見下 §4.4 |
| Image | full-width，radius `radius.md`，border 1px `border.hairline` |
| Image caption | `type.body.sm` + `text.tertiary`，margin-top 8px |
| Table | 同 §11 Data Table 簡化版 |
| Quote | left 4px `accent.electric` + padding-left 16px + italic |

### 4.4 Callout

```
┌────────────────────────────────────────┐
│ ℹ  Note                                │
│ This is informational text.            │
└────────────────────────────────────────┘
```

| Variant | left border | icon | bg |
|---------|-------------|------|-----|
| `note` | `accent.electric` 3px | ℹ | `accent.electric.subtle` 8% |
| `tip` | `status.success` 3px | ✦ | `status.success.bg` 8% |
| `warning` | `status.warning` 3px | ⚠ | `status.warning.bg` 8% |
| `danger` | `status.danger` 3px | ✕ | `status.danger.bg` 8% |

### 4.5 On-page TOC

```
 ── ON THIS PAGE
 Overview
 Authentication
   Bearer tokens
   API keys
 Rate limits
 Errors
```

| 屬性 | 值 |
|------|-----|
| Eyebrow | `Eyebrow.with-line` 「ON THIS PAGE」 |
| Item | `type.body.sm` + `text.secondary`，行高 28px |
| Active item | `text.primary` + 左 2px `accent.electric` |
| Sub item | indent 16px，`type.body.xs` |
| Scroll spy | IntersectionObserver，當前 viewport 中心對應 H 高亮 |

### 4.6 Pagination（章節導航）

```
 ┌─ Previous ──────────────┐  ┌─────────────── Next ─┐
 │ ← Authentication        │  │ Rate limits        → │
 └─────────────────────────┘  └──────────────────────┘
```

| 屬性 | 值 |
|------|-----|
| 容器 | `grid grid-cols-1 md:grid-cols-2 gap-4`，margin-top 96px |
| 每張卡 | Card.flat，padding 24px，hover bg `surface.hover` |
| Eyebrow | `type.label.sm` + `text.tertiary`，「Previous」/「Next」 |
| Title | `type.heading.md` |

---

## 5. Blog Index / Article

### 5.1 Blog Index

```
1. Top Navigation
2. Hero (短版 + 大標)
3. Featured Article (左圖右文 1×1 大卡)
4. Article Grid (3 欄，10-12 篇)
5. Pagination
6. Newsletter Inline Form
7. Footer
```

### 5.2 Article Card（Index 用）

```
┌──────────────────────────────────────┐
│ [Cover Image, aspect 16/9]           │
├──────────────────────────────────────┤
│ Tag                                  │
│                                      │
│ Article Title (heading.xl)           │
│                                      │
│ Description preview (body.md)        │
│                                      │
│ ───────                              │
│ [Avatar] Author · 5 min · 2026-04-30 │
└──────────────────────────────────────┘
```

| 屬性 | 值 |
|------|-----|
| Card | 同 Card.interactive |
| Cover | aspect-ratio 16/9，full bleed，無 padding |
| Tag | Tag.outline.sm |
| Title | `type.heading.xl`，`text.primary`，hover `accent.electric` |
| Description | `type.body.md` + `text.secondary`，line-clamp 3 |
| Footer | `type.body.sm` + `text.tertiary`，flex items-center gap 8px |

### 5.3 Article Page

```
1. Top Navigation
2. Article Header
   - Tag chip
   - Title (display.lg)
   - Subtitle (body.lg + text.secondary)
   - Author row (avatar + name + date + read time)
3. Cover Image (full-bleed wide variant)
4. Article Body (max-width 768px center)
5. Author Bio Card
6. Related Articles (3 卡)
7. Newsletter Inline Form
8. Footer
```

---

## 6. Console Dashboard

### 6.1 結構

```
┌──────────────┬──────────────────────────────────────────────────┐
│              │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│  Sidebar     │  Breadcrumb / Title / Page Actions              │
│  Navigation  │ ──────────────────────────────────────────────── │
│  (240px)     │                                                  │
│              │  Stats Strip (4 KPIs)                            │
│              │                                                  │
│              │  ┌─────────────┬─────────────┐                  │
│              │  │ Chart 1     │ Chart 2     │                  │
│              │  └─────────────┴─────────────┘                  │
│              │                                                  │
│              │  Activity Table                                  │
│              │                                                  │
└──────────────┴──────────────────────────────────────────────────┘
```

### 6.2 Page Header

| 元素 | 樣式 |
|------|------|
| 容器 | h 80px，padding 24px 32px，border-bottom 1px `border.hairline` |
| Breadcrumb | `type.body.sm` |
| Title | `type.heading.xl` |
| Description | `type.body.sm` + `text.secondary`，optional |
| Actions | 右側 button group（Filter、Export、+ New） |

### 6.3 Content Area

| 屬性 | 值 |
|------|-----|
| padding | 32px |
| 最大寬 | 1280px（內部） |
| 區塊間距 | 24px |
| KPI Card | 同 Bento 1×1，但更小（min-h 120px） |

### 6.4 Chart Card

```
┌───────────────────────────────────────────────────┐
│ Title                              [7d ▼] [⋯]    │
│ Description text                                  │
├───────────────────────────────────────────────────┤
│                                                   │
│   [Chart canvas]                                  │
│                                                   │
└───────────────────────────────────────────────────┘
```

| 屬性 | 值 |
|------|-----|
| Card.default |
| Header h 64px，padding 20px 24px，border-bottom hairline |
| Body padding 24px |
| Chart 高 240px（標準）/ 360px（大） |
| 樣式 | `color.viz.*` 調色盤，line stroke 1.5px，dot 4px |
| Grid lines | `border.subtle` 1px dashed |
| Axis label | `type.body.xs` + `text.tertiary` |
| Tooltip | 同 §8 Tooltip |

---

## 7. Chat Workspace

Grok 風格的對話式 AI 介面 — 全螢幕。

### 7.1 結構

```
┌─────────────┬──────────────────────────────────────────────────┐
│             │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│  Sidebar    │  Chat title / Model selector / Share button     │
│  (Threads)  │ ──────────────────────────────────────────────── │
│  280px      │                                                  │
│             │  ┌───────────────────────────────────────┐      │
│             │  │ Conversation messages                  │      │
│             │  │ (scroll body, padding 24px)           │      │
│             │  │                                       │      │
│             │  │ User msg                              │      │
│             │  │ Grok msg                              │      │
│             │  │ ...                                   │      │
│             │  │                                       │      │
│             │  └───────────────────────────────────────┘      │
│             │                                                  │
│             │  ╔═══════════════════════════════════════╗      │
│             │  ║ Ask anything...           [↑]         ║      │
│             │  ║ [📎] [/]    [Model: Grok-3 ▼]         ║      │
│             │  ╚═══════════════════════════════════════╝      │
│             │                                                  │
└─────────────┴──────────────────────────────────────────────────┘
```

### 7.2 Sidebar (Thread List)

| 屬性 | 值 |
|------|-----|
| 寬 | 280px |
| bg | `canvas.raised` |
| border-right | 1px `border.hairline` |
| 頂部 | 「+ New chat」 按鈕（Button.outline.full-width.md） |
| Search | Input.sm，bg `canvas.sunken` |
| Group label | 時間分組（Today / Yesterday / Last 7 days）`type.label.sm` uppercase |
| Thread item | h 40px，padding 0 16px，title line-clamp 1，`type.body.sm` |
| Active thread | bg `surface.hover` + 左 2px `accent.electric` |
| Hover ⋯ | 顯示三點按鈕（Rename / Delete） |

### 7.3 Conversation Body

| 屬性 | 值 |
|------|-----|
| max-width | 768px，置中 |
| padding | 32px 24px |
| 訊息間距 | 24px |
| 輸入區 | sticky bottom 24px（同 §15.3） |

### 7.4 Empty State

當 thread 為空時顯示：

```
                ◆

         Grok knows.

   Ask anything. Get truth.

   [Suggest 1] [Suggest 2] [Suggest 3] [Suggest 4]
```

- 大型 ◆ icon (64px) `accent.electric`
- 標題 `type.display.sm`
- 副標 `type.body.lg` + `text.secondary`
- 建議 chip：4 個範例問題，按一下自動填入輸入框

---

## 8. Settings Page

### 8.1 結構

```
┌──────────────┬──────────────────────────────────────────────────┐
│              │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│ Settings     │  Settings · Profile                              │
│ Sidebar      │ ──────────────────────────────────────────────── │
│ (vertical    │                                                  │
│ tabs)        │  Profile Section (form-section pattern)          │
│              │                                                  │
│ Profile      │  Account Section                                 │
│ Account      │                                                  │
│ Billing      │  Notifications Section                           │
│ Notifications│                                                  │
│ API Keys     │                                                  │
│ Team         │                                                  │
│ Danger Zone  │                                                  │
└──────────────┴──────────────────────────────────────────────────┘
```

### 8.2 規格

| 元素 | 樣式 |
|------|------|
| Settings Sidebar | 240px，使用 vertical tabs（同元件 §12.3） |
| Content | max-width 768px，padding 64px 48px |
| 多個 form section | 用 §13 Form Section 模式，section 間距 64px |

### 8.3 Danger Zone

```
 ─── DANGER ZONE ─────────

 ┌────────────────────────────────────────────┐
 │ Delete account                             │
 │ Permanently remove your account and data.  │
 │                                  [Delete]  │
 └────────────────────────────────────────────┘
```

| 屬性 | 值 |
|------|-----|
| Eyebrow | uppercase + `status.danger` |
| Card border | 1px `status.danger` 30% opacity |
| Card bg | `status.danger.bg` 透明度 5% |
| Button | `Button.danger` |
| 觸發 | Modal 確認流程，需輸入帳號名稱才能 Confirm |

---

## 9. Auth Flow

### 9.1 Login / Signup 結構（Centered）

```
┌──────────────────────────────────────┐
│              [logo]                   │
│                                       │
│          Welcome back                 │
│          Sign in to continue.         │
│                                       │
│   ┌─────────────────────────────┐    │
│   │ [G] Continue with Google    │    │
│   ├─────────────────────────────┤    │
│   │ [X] Continue with X         │    │
│   ├─────────────────────────────┤    │
│   │ [GH] Continue with GitHub   │    │
│   └─────────────────────────────┘    │
│                                       │
│   ─────── OR ───────                 │
│                                       │
│   [Email input]                       │
│   [Password input]                    │
│                                       │
│   [Sign in]                           │
│                                       │
│   Forgot password?  ·  Sign up        │
└──────────────────────────────────────┘

           （背景：bg.spotlight.dual + bg.noise.subtle）
```

### 9.2 規格

| 屬性 | 值 |
|------|-----|
| Card max-width | 400px |
| Card | bg `canvas.raised`，border 1px `border.hairline`，radius `radius.lg`，padding 40px |
| 容器 | `min-h-screen flex items-center justify-center`，bg `canvas.base` |
| Logo | 高 32px，置中，margin-bottom 32px |
| 標題 | `type.heading.xl`，置中 |
| 副標 | `type.body.sm` + `text.secondary`，置中，margin-bottom 32px |
| OAuth 按鈕 | Button.outline.full-width.lg，圖示 + 文字，間距 8px |
| Divider | 「OR」divider，§18 |
| Email/Password | Input.lg，full-width，間距 12px |
| Submit | Button.primary.lg.full-width，margin-top 24px |
| 底部連結 | `type.body.sm` + center align，margin-top 24px |

### 9.3 Variants

| 頁面 | 差異 |
|------|------|
| Sign up | 副標改「Create your account」，加 Terms checkbox |
| Forgot password | 只留 email input + 「Send reset link」 |
| Reset password | 兩個密碼欄位 + Confirm |
| 2FA | 6 位數驗證碼輸入（6 個獨立 input box，自動切焦點） |
| Magic link sent | 提示「Check your email」+ 重發倒數 |

### 9.4 背景特效

```
 - bg.spotlight.dual：左上電光藍 + 右下紫色聚光
 - 可選 Star Field（§Foundations 10.5），50-80 個點
 - bg.noise.subtle 疊加
 - 完全不影響閱讀（聚光中心避開卡片區域）
```

---

## 10. 404 / Error Page

### 10.1 結構

```
                        ◆

                  404

           This page does not exist.

      [Go home]   [Search docs]


      （背景：星空 + 大型 spotlight）
```

| 屬性 | 值 |
|------|-----|
| 容器 | `min-h-screen flex flex-col items-center justify-center`，bg `canvas.base` |
| Mark | 64px ◆ `accent.electric`，optional |
| 數字 | `type.display.2xl` font-mono，`text.primary`，可帶 `glow.accent.lg` |
| 描述 | `type.body.lg` + `text.secondary`，margin-top 16px，max-width 32em |
| CTA | flex gap 12px，margin-top 48px |
| 背景 | Star Field + bg.spotlight.center，僅在 404 / 500 / Maintenance 使用 |

### 10.2 Variants

| 錯誤 | 標題 | 副標 |
|------|------|------|
| 404 | `404` | This page does not exist. |
| 403 | `403` | You don't have access. |
| 500 | `500` | Something broke on our end. |
| 503 | `Maintenance` | We'll be back shortly. |
| Network | `Offline` | Check your connection. |

---

## 11. Status Page

```
1. Top Navigation (minimal)
2. Hero
   - 大狀態指示燈 (●)
   - 「All systems operational」/ 「Some systems degraded」
3. Service List
   - 各服務 row (name + status + uptime)
4. Incident History (90 days)
   - 每日方塊條 (90 個小方塊)
5. Past Incidents (timeline)
6. Footer (minimal)
```

### 11.1 Service Row

```
 ┌──────────────────────────────────────────────────────┐
 │ ● API                                  Operational   │
 │   ▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮  99.99%        │
 ├──────────────────────────────────────────────────────┤
 │ ● Console                              Operational   │
 │   ▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮  99.97%        │
 ├──────────────────────────────────────────────────────┤
 │ ▲ Webhooks                            Degraded       │
 │   ▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▯▯▮▮▮▮▮  99.62%        │
 └──────────────────────────────────────────────────────┘
```

| 屬性 | 值 |
|------|-----|
| Row | padding 20px 24px，border-bottom 1px `border.hairline` |
| Status dot | 8px，依狀態色 |
| Service name | `type.body.md` |
| Uptime bar | 90 個方塊（每個代表一天），`gap: 2px` |
| 方塊 | 4×24，`status.success` 預設，事故日 `status.danger` 或 `status.warning` |
| Uptime % | font-mono tabular-nums `text.tertiary` |

---

## 12. Changelog Page

### 12.1 結構

```
1. Top Navigation
2. Hero (eyebrow + Title + Subscribe button)
3. Filter Bar (All / Features / Improvements / Fixes)
4. Entry List
5. Pagination / Load More
6. Footer
```

### 12.2 Entry

```
 ─── 2026-04-30  ─────────────────────────────────────

   [v3.2.0]  [Feature]

   Realtime streaming improvements

   Tokens now stream at 240/sec, up from 120/sec.
   This applies to Grok-3 model on all plans.

   - Improved websocket framing
   - Reduced server-side buffering
   - New `stream.chunk_size` parameter

                  ───────────

 ─── 2026-04-22  ─────────────────────────────────────
```

| 屬性 | 值 |
|------|-----|
| Date eyebrow | `Eyebrow.with-line`（左日期 + 後續 hairline 延伸） |
| Date | `font-mono` + `type.label.sm` |
| Tags | Tag.outline.sm 並排 |
| Title | `type.heading.xl` |
| Body | `type.body.md` + `text.secondary`，max-width 64ch |
| Bullet list | margin-top 16px |
| Entry 間距 | margin-bottom 64px |

### 12.3 Subscribe / RSS

```
 - 頂部右側 「Subscribe」 按鈕，Popover 提供：
   1. RSS feed URL
   2. Email subscribe input
   3. Webhook URL（pro plan 以上）
```

---

## 模板實作優先序

1. **Landing / Marketing Home** — 品牌門面，最關鍵
2. **Documentation Page** — 開發者社群必備
3. **Pricing Page** — 商業轉換
4. **Console Dashboard** — 產品核心介面
5. **Chat Workspace** — Grok 招牌應用
6. **Auth Flow** — 入口流程
7. 其餘模板 — 視業務需求補上

---

## 跨模板共通規則

### 響應式策略

| Viewport | 行為 |
|----------|------|
| < 640px | 單欄垂直堆疊，sidebar 改抽屜 |
| 640px – 1023px | 大部分元素單欄，部分 2 欄（如 Pricing） |
| 1024px – 1279px | 標準 desktop 排版 |
| >= 1280px | Container 鎖寬 1280px |
| >= 1440px | 僅 Hero 等特殊區段擴展到 1440px |

### Performance Budget

| 模板 | LCP | CLS | First JS |
|------|-----|-----|----------|
| Landing | < 2.0s | < 0.05 | < 80KB |
| Docs | < 1.5s | < 0.02 | < 60KB |
| Console | < 2.5s | < 0.05 | < 200KB |
| Chat | < 2.0s | < 0.05 | < 150KB |

### Accessibility 要求

- 所有頁面通過 WCAG AA 對比度
- Tab 順序合理，焦點 ring 必顯示
- 所有圖片有 alt
- ARIA landmarks 正確（main、nav、banner、contentinfo）
- 鍵盤導航：Cmd+K command palette、Tab 切換、Esc 關閉
- prefers-reduced-motion 自動降低動效

---

**版本**：v1.0
**最後更新**：2026-05-02
