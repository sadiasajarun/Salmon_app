# DESIGN_SYSTEM — Variation C: "Structured Professional"

Enterprise, field-ready. Stronger maroon presence in headers, boxier cards, tighter type scale, high
information density. Leans into the partner work-tool while staying clean enough for client premium.

## Colour tokens
| Token | Value | Use |
|---|---|---|
| primary | `#800020` | brand, headers, primary CTA, active nav |
| primaryHover | `#66001A` | pressed |
| primaryDeep | `#5C0018` | header gradient end |
| onPrimary | `#FDF3F1` | text on maroon header |
| ink | `#222222` | primary text |
| inkSubtle | `#5C636E` | secondary text |
| canvas | `#F4F5F7` | app background (soft grey) |
| surface | `#FFFFFF` | cards |
| line | `#E2E5EA` | hairlines |
| success | `#1E7A46` · warning `#B7791F` · error `#B4232B` · neutral `#6B7280` | status only |

## Type
- All: neutral sans (e.g. "Inter"), tighter scale. Display 26/1.2, H1 21, H2 17, Body 14.5/1.45,
  Caption 12.5, Micro 11.
- Bengali: line-height 1.5.

## Shape & elevation
- Radius: cards 10, buttons 8, inputs 8, chips 8.
- Cards: 1px `line` + `0 1px 2px rgba(34,34,34,.05)`.
- Maroon app-bar (gradient primary→primaryDeep) on partner; slim maroon top rule on client.
- Gutter 16, section gap 16, list row 60.

## Components
- Buttons: filled maroon / ghost. Height 46, radius 8.
- KPI tiles: 2×2 or 3-up compact, number-forward, small delta.
- Progress bars for targets (maroon fill on grey track).
- Status pill: square-ish (radius 6), tinted, label + dot.
- Bottom nav: 5 items, active maroon underline + filled icon.

## Rhythm
Client = editorial hero but with structured info blocks below. Partner = data-dense: tiles, bars,
compact list rows, quick-action chips.
