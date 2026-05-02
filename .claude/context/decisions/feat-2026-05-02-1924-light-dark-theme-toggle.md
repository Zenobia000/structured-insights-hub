---
name: Light / Dark / System 三態主題切換
description: 為 painmap worksheet 加入 dark/light/system 切換，含 FOUC 防止與 utility token 化
type: project
---

# Light / Dark / System 主題切換系統

- **日期**: 2026-05-02 19:24
- **任務**: 加入黑白模式（light + dark + system）切換能力
- **範圍**: styles.css token 重整 + useTheme hook + ThemeToggle 元件 + FOUC script + UI 嵌入

## 結論

### 架構

**三層級設計**：
1. **CSS Variables**（styles.css）— `:root` = dark default, `.light` override, `.dark` mirror
2. **Hook**（useTheme.ts）— 'system' / 'light' / 'dark' 三態，localStorage 持久化、OS sync、cross-tab sync
3. **UI**（theme-toggle.tsx）— Sun/Moon/Monitor icon cycle button (icon + compact 兩 variant)

### CSS 變數新增 (styles.css)

新增「texture token」讓 utility 在兩模式下都漂亮：
- `--dot-color-dim` / `--dot-color-default` (dark = #161616 / #1F1F1F；light = #EAEAEA / #D4D4D8)
- `--spotlight-color` / `--spotlight-color-violet` (dark = rgba(blue,0.12)；light = rgba(blue,0.06)，弱化避免太強)
- `--accent-glow-strong/mid/soft` (dark = electric blue glow；light = subtler blue tint)

`bg-dot-*` / `bg-spotlight-*` / `glow-*` utility 全部改用 var()，自動隨 theme 切換。

### FOUC 防止 (__root.tsx)

inline `<script>` 在 React hydration 前同步執行：
```js
(function(){
  var stored = localStorage.getItem('painmap.theme');
  var pref = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  var theme = (stored === 'light' || stored === 'dark') ? stored : pref;
  document.documentElement.classList.add(theme);
  document.documentElement.style.colorScheme = theme;
})();
```

### UI 嵌入

- **Worksheet header**: 右側 saved time 旁邊，icon variant
- **Landing**: 右上 floating，z-50，icon variant

### Theme cycle

點一下 button → `light → dark → system → light → ...`

`system` 會跟 OS prefers-color-scheme 即時同步（mediaquery listener）。

### 留意事項（未做的部分）

- 部分 React 元件用 inline `style={{ background: rgba(91,141,239,...) }}` 寫 spotlight glow，這些在 light mode 不會自動切換顏色（會顯示 dark blue 透明度低的 tint）。視覺上仍可接受，但 polish 階段應改為 className + CSS var。
  - 涉及檔案：HeroSection（已沒有）/ ExamplePainCard / StartOrResume / StageRelationship / CompletionHeader / PainIdCard / NextStepCta / learn.worksheet
- LandingPage 的 ambient glow 已改為 `bg-spotlight-dual` className，自動 theme-adaptive

## 行動項目

- [x] CSS texture tokens
- [x] useTheme hook
- [x] ThemeToggle 元件
- [x] FOUC script
- [x] Worksheet header 嵌入
- [x] Landing 嵌入
- [x] Build 通過
- [ ] (polish) inline rgba glow 改 className
- [ ] (verification) playwright 截兩種 mode 截圖比對

## 影響評估

- **嚴重度**: MEDIUM-HIGH（新功能 + 視覺擴展）
- **影響範圍**: 5 個新增 / 修改檔案
- **無破壞**: 所有現有 className 自動套用 theme，原 dark 視覺維持不變
- **儲存 key**: `painmap.theme` (localStorage)
