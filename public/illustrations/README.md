# Illustrations

AI-generated monochrome illustrations referenced by `src/components/Illustration.tsx`.

## File requirements

- **Format**: `.webp` (preferred — small bundle) or `.png` fallback
- **Aspect ratio**: 4:3 default (1:1 only for E6)
- **Color**: Pure black/white/gray only — Grok v1.2 §10 forbids any color (electric blue, risograph, etc.)
- **Naming**: Must match the `IllustrationName` union in `src/components/Illustration.tsx`

## Prompt library (Midjourney v7 / Flux)

General template:
```
[STYLE ANCHOR] of [SUBJECT FORMULA] --ar 4:3 --stylize 200 --sw [WEIGHT] --v 7
```

**Workflow tip**: generate `e1-knot-unraveling.webp` first. Take its image URL,
pass as `--sref <url>` to all subsequent prompts. This locks stroke weight,
composition rhythm, and aesthetic across the series.

| Filename | Style anchor | Subject formula | --sw | Used in |
|---|---|---|---|---|
| `e1-knot-unraveling.webp` | single continuous line drawing, pure white on black, no shading, 2px stroke | a tangled knot slowly unraveling into a straight line | 50 | Card 01 empty state |
| `e2-fake-pain-anatomy.webp` | 19th century scientific etching, white-on-black engraving, hairline cross-hatch, no text | anatomy of a fake pain point dissected like an insect specimen | 100 | Card 04 fake-pain anatomy |
| `e3-personas-halftone.webp` | halftone dot pattern, pure black/white, 1px dot grid, brutalist composition | three abstract user persona silhouettes facing forward, no faces | 75 | Card 07/08 interview targets |
| `e4-validation-funnel.webp` | isometric wireframe diagram, 1.5px stroke, no fill, pure white lines on black canvas | a five-stage validation funnel cross-section | 30 | Card 06 validation matrix |
| `e5-emotional-topo.webp` | topographic contour map, white hairlines on black, no labels, abstract | emotional terrain of a customer interview, valleys and ridges | 75 | Card 05 pain map header |
| `e6-magnifier-question.webp` | flat geometric brutalist symbol, 2px stroke, square 1:1, monochrome white on black (use `--ar 1:1`) | a magnifying glass overlapping a question mark | 50 | 404 / error pages |
| `e9-pain-blueprint.webp` | architectural blueprint, white lines on black, dimension marks and arrows, mono | exploded view of a "real pain" assembled from evidence parts | 50 | Card 03 framework reveal |
| `e10-interviewer-portrait.webp` | wood engraving newspaper illustration, pure black/white, fine parallel lines, editorial | a portrait of a thoughtful interviewer mid-listening, side profile | 100 | Landing News / ExamplePainCardPreview |

## How to wire a generated illustration

1. Drop the file here as `e1-knot-unraveling.webp` (matching the table above)
2. Use anywhere with:
   ```tsx
   import { Illustration } from "@/components/Illustration";
   <Illustration name="e1-knot-unraveling" alt="一段糾結的線慢慢拉直" />
   ```
3. Until the file exists, the component renders a hairline dot-grid placeholder
   so the layout doesn't shift when you add the asset later.

## What NOT to do

- ✗ No color (even one accent) — violates Grok v1.2 §10
- ✗ No risograph 2-color (the prior plan mentioned it; v1.2 purged it)
- ✗ No 3D blobs / fluid shapes / gradient meshes — common AI cliche
- ✗ No glow / drop-shadow / spotlight aura around the subject
- ✗ Don't rename files — the union type in `Illustration.tsx` enforces names
