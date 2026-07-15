# Design Guide — Salmon Developers Mobile App

## Fixed anchors (from CLAUDE.md §10 — do not change)
- Primary: **Light Maroon `#800020`**
- Ink / dark surface: **Deep Charcoal `#222222`**
- Style: clean, minimalist, generous whitespace.
- **Client UI:** premium & editorial — large media, calm density, few elements per screen.
- **Partner UI:** functional & dense — lists, counters, progress bars, quick actions.
- Same tokens, different rhythm. **Both must work in Bengali.**

## What the 3 variations explore (brand colour is fixed; only rhythm/type/shape vary)
| | A — Editorial Warmth | B — Modern Clean | C — Structured Pro |
|---|---|---|---|
| Feel | Boutique, magazine | Contemporary, neutral | Enterprise, field-ready |
| Neutrals | Warm ivory `#FAF6F1` | Cool white `#FFFFFF` | Soft grey `#F4F5F7` |
| Display type | Serif headings | Geometric sans | Sans, tighter scale |
| Corner radius | 20–28px, soft | 12–16px | 8–10px, boxier |
| Density | Airy (client-leaning) | Balanced | Compact (partner-leaning) |
| Accent use | Maroon sparingly, as ink | Maroon on key CTAs | Maroon in headers + CTAs |

## Status colour map (shared, hue + label + icon — never hue alone)
- success/paid/approved/verified → `#1E7A46` · pending/upcoming → `#B7791F` · error/failed/rejected/
  overdue → `#B4232B` · neutral/reserved/onHold → `#6B7280`. Maroon is **brand**, not a status colour.

## Mandatory UI rules carried from spec
- Every disclaimer (guaranteed-return, investment-adviser) is visible UI, not hidden.
- Checkout always shows the **authoritative transaction currency** even if display currency differs.
- Lead form: consent checkbox gates submit. Settlement form: **no** bank/MFS/account fields.
- Every async screen: loading / empty / error / data.
- Bilingual: sample Bengali strings included in mockups to prove no overflow.

## Type scale (base, variations adjust family + step)
Display 28 · H1 22 · H2 18 · Body 15 · Caption 13 · Micro 11. Line-height ≥ 1.4 (≥ 1.5 for Bengali).

## Spacing tokens
4 / 8 / 12 / 16 / 20 / 24 / 32. Screen gutter 20 (A), 16 (B), 16 (C). Touch target ≥ 44px.
