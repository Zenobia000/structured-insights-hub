# Illustrations Prompt Library — Backup & Master Reference

**Source of truth** for all AI-generated illustration prompts in this project. Mirror what's in `public/illustrations/README.md` plus the extended set.

All prompts are **Grok v1.2 compliant**: pure black/white/gray monochrome, no color, no glow, no gradients, no 3D blobs.

---

## Why "only 8" in the original list?

Original plan (Grok+ era) had 10 prompts E1-E10 including **E7 risograph electric blue** and **E8 risograph fluorescent pink**. v1.2 spec purification banned all non-monochrome illustrations, so E7/E8 were cut → 8 remained.

This file expands to **16 prompts** to cover more worksheet positions and edge cases.

---

## Universal template

```
[STYLE ANCHOR] of [SUBJECT FORMULA] --ar [RATIO] --stylize 200 --sw [WEIGHT] --v 7
```

**Workflow rule for series consistency**:
1. Generate E1 first (the "anchor" image)
2. Take its image URL
3. Pass as `--sref <url>` to ALL subsequent prompts (E2 onwards)
4. Keep `--sw` weight ≥ 50 to honor the reference

This locks stroke weight, line density, and aesthetic across the whole series.

---

## Core 8 — original wired prompts

These names match the `IllustrationName` union type in `src/components/Illustration.tsx`. Use these filenames exactly.

### E1 — Knot unraveling (style anchor)
**File**: `e1-knot-unraveling.webp`
**Use site**: Card 01 empty state

```
single continuous line drawing of a tangled knot slowly unraveling into a straight line, pure white on black, no shading, 2px stroke --ar 4:3 --stylize 200 --sw 50 --v 7
```

### E2 — Fake pain anatomy
**File**: `e2-fake-pain-anatomy.webp`
**Use site**: Card 04 fake-pain anatomy callout

```
19th century scientific etching of anatomy of a fake pain point dissected like an insect specimen, white-on-black engraving, hairline cross-hatch, no text --ar 4:3 --stylize 200 --sw 100 --v 7
```

### E3 — Personas halftone
**File**: `e3-personas-halftone.webp`
**Use site**: Card 07/08 interview targets

```
halftone dot pattern of three abstract user persona silhouettes facing forward, no faces, pure black/white, 1px dot grid, brutalist composition --ar 4:3 --stylize 200 --sw 75 --v 7
```

### E4 — Validation funnel
**File**: `e4-validation-funnel.webp`
**Use site**: Card 06 validation matrix

```
isometric wireframe diagram of a five-stage validation funnel cross-section, 1.5px stroke, no fill, pure white lines on black canvas --ar 4:3 --stylize 200 --sw 30 --v 7
```

### E5 — Emotional topo
**File**: `e5-emotional-topo.webp`
**Use site**: Card 05 pain map header

```
topographic contour map of emotional terrain of a customer interview, valleys and ridges, white hairlines on black, no labels, abstract --ar 4:3 --stylize 200 --sw 75 --v 7
```

### E6 — Magnifier × question (square)
**File**: `e6-magnifier-question.webp`
**Use site**: 404 / error pages

```
flat geometric brutalist symbol of a magnifying glass overlapping a question mark, 2px stroke, square 1:1, monochrome white on black --ar 1:1 --stylize 200 --sw 50 --v 7
```

### E9 — Pain blueprint
**File**: `e9-pain-blueprint.webp`
**Use site**: Card 03 framework reveal

```
architectural blueprint of exploded view of a "real pain" assembled from evidence parts, white lines on black, dimension marks and arrows, mono --ar 4:3 --stylize 200 --sw 50 --v 7
```

### E10 — Interviewer portrait
**File**: `e10-interviewer-portrait.webp`
**Use site**: Landing News Highlights / ExamplePainCardPreview

```
wood engraving newspaper illustration of a portrait of a thoughtful interviewer mid-listening, side profile, pure black/white, fine parallel lines, editorial --ar 4:3 --stylize 200 --sw 100 --v 7
```

---

## Extended 8 — newly added (require type union update before wiring)

To wire these via `<Illustration name="..." />`, add the name to the `IllustrationName` union in `src/components/Illustration.tsx` after the asset lands.

### E11 — Hero anchor (landing)
**File**: `e11-listening-vessel.webp`
**Use site**: Landing Hero negative space (right side, optional)
**Aspect**: 4:3

```
single continuous line drawing of a hand cupping an ear shaped like an empty vessel waiting to be filled, pure white on black, 2px stroke, lots of negative space, brutalist composition --ar 4:3 --stylize 200 --sw 50 --v 7
```

### E12 — Three named people (Card 02)
**File**: `e12-three-named-people.webp`
**Use site**: Card 02 "3 個有名字的真人" intro

```
woodcut engraving of three name tags hanging from a single horizontal hairline, each tag a different shape (rectangle, oval, hexagon), pure black/white, fine parallel lines, editorial --ar 4:3 --stylize 200 --sw 100 --v 7
```

### E13 — Stuck formula loop (Card 03)
**File**: `e13-stuck-loop.webp`
**Use site**: Card 03 "卡關公式" header

```
isometric wireframe diagram of a closed loop with a single arrow pointing back to itself, breaking at one segment, 1.5px stroke, pure white on black, no fill --ar 4:3 --stylize 200 --sw 30 --v 7
```

### E14 — TRIZ contradiction balance (Card 05)
**File**: `e14-contradiction-scale.webp`
**Use site**: Card 05 "兩件事不能同時要" intro

```
19th century scientific etching of an old apothecary balance scale tilted to one side, two abstract weights labeled X and Y, white-on-black engraving, hairline cross-hatch --ar 4:3 --stylize 200 --sw 100 --v 7
```

### E15 — AI evidence stack (Card 06 alt)
**File**: `e15-evidence-stack.webp`
**Use site**: Card 06 evidence section secondary illustration

```
architectural blueprint of a stack of paper documents bound by a single hairline thread, exploded perspective showing each layer separately, white lines on black, dimension marks --ar 4:3 --stylize 200 --sw 50 --v 7
```

### E16 — Verdict gavel (Card 09)
**File**: `e16-verdict-gavel.webp`
**Use site**: Card 09 verdict judgment header

```
woodcut engraving of a courtroom gavel paused mid-strike above a sound block, side profile, pure black/white, fine parallel lines, editorial dramatic --ar 4:3 --stylize 200 --sw 100 --v 7
```

### E17 — Capstone certificate (Result page)
**File**: `e17-capstone-certificate.webp`
**Use site**: Result page CompletionHeader background or standalone

```
19th century scientific etching of a wax seal stamp pressed onto blank parchment, pure white on black, hairline cross-hatch around the seal radiating outward, no text inside seal --ar 4:3 --stylize 200 --sw 100 --v 7
```

### E18 — Stage 2 horizon (Stage handoff)
**File**: `e18-stage-two-horizon.webp`
**Use site**: Result page StageHandoffPanel — "what's next"

```
single continuous line drawing of a path receding into the distance over rolling hills toward a single horizon line, pure white on black, 2px stroke, vast negative space, brutalist minimalism --ar 4:3 --stylize 200 --sw 50 --v 7
```

---

## Quick reference table

| ID | Filename | Style | Use site | --ar | --sw |
|----|----------|-------|----------|------|------|
| E1 | e1-knot-unraveling | line | Card01 empty | 4:3 | 50 |
| E2 | e2-fake-pain-anatomy | etching | Card04 callout | 4:3 | 100 |
| E3 | e3-personas-halftone | halftone | Card07/08 | 4:3 | 75 |
| E4 | e4-validation-funnel | wireframe | Card06 | 4:3 | 30 |
| E5 | e5-emotional-topo | topo | Card05 | 4:3 | 75 |
| E6 | e6-magnifier-question | symbol | 404 | 1:1 | 50 |
| E9 | e9-pain-blueprint | blueprint | Card03 | 4:3 | 50 |
| E10 | e10-interviewer-portrait | woodcut | Landing | 4:3 | 100 |
| E11 | e11-listening-vessel | line | Hero | 4:3 | 50 |
| E12 | e12-three-named-people | woodcut | Card02 | 4:3 | 100 |
| E13 | e13-stuck-loop | wireframe | Card03 | 4:3 | 30 |
| E14 | e14-contradiction-scale | etching | Card05 | 4:3 | 100 |
| E15 | e15-evidence-stack | blueprint | Card06 alt | 4:3 | 50 |
| E16 | e16-verdict-gavel | woodcut | Card09 | 4:3 | 100 |
| E17 | e17-capstone-certificate | etching | Result hero | 4:3 | 100 |
| E18 | e18-stage-two-horizon | line | StageHandoff | 4:3 | 50 |

**Total: 16 prompts** across 5 style families (line, etching, halftone, wireframe, woodcut + 1 blueprint + 1 topo).

---

## Style family distribution

| Family | Count | When to pick |
|---|---|---|
| **Continuous line** | 4 (E1, E11, E18, +E13 wireframe-adjacent) | Open / aspirational moments — empty state, hero, "what's next" |
| **Etching** | 3 (E2, E14, E17) | Serious / analytical moments — anatomy, judgment scales, capstone |
| **Woodcut** | 3 (E10, E12, E16) | Editorial / human moments — portraits, named people, verdict |
| **Halftone** | 1 (E3) | Persona-as-data moments |
| **Wireframe** | 2 (E4, E13) | Process / structure moments — funnel, loop |
| **Blueprint** | 2 (E9, E15) | Construction / evidence moments |
| **Topo** | 1 (E5) | Emotional terrain |
| **Symbol** | 1 (E6) | Single-glyph moments — error, marker |

If a family feels over-used in a single page, swap to an adjacent family (etching ↔ woodcut, line ↔ wireframe).

---

## Generation checklist

Before sending a prompt to Midjourney v7:
- [ ] Style anchor explicitly says "pure white on black" / "white-on-black" / "pure black/white"
- [ ] No color names (blue, red, amber, etc.)
- [ ] No "glow", "halo", "spotlight", "aurora"
- [ ] No "3D", "blob", "fluid", "gradient mesh"
- [ ] `--sw` value reflects how strictly to inherit from anchor (30 = loose, 100+ = tight)
- [ ] If E1 already generated, append `--sref <e1-image-url>`

After receiving the result:
- [ ] No accidental color (re-roll if any)
- [ ] No text labels (re-roll or crop out)
- [ ] No lighting effects
- [ ] Convert to webp at quality 80, target < 100KB
- [ ] Save with exact filename from the table above into `public/illustrations/`
