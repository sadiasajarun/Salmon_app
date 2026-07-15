# DESIGN_SYSTEM — Variation B: "Modern Clean"

Contemporary, neutral, balanced. Geometric sans throughout, crisp white surfaces, maroon reserved for
key CTAs and active states. Reads equally well for client and partner.

## Colour tokens
| Token | Value | Use |
|---|---|---|
| primary | `#800020` | brand, primary CTA, active nav |
| primaryHover | `#66001A` | pressed |
| primaryTint | `#F5E7EB` | selected chips, subtle fills |
| ink | `#222222` | primary text |
| inkSubtle | `#6B7280` | secondary text |
| canvas | `#FFFFFF` | app background |
| surface | `#FFFFFF` | cards (separated by line, not bg) |
| surfaceАlt | `#F7F8FA` | grouped sections |
| line | `#E7E9EE` | hairlines / card borders |
| success | `#1E7A46` · warning `#B7791F` · error `#B4232B` · neutral `#6B7280` | status only |

## Type
- All: geometric/neutral sans (e.g. "Inter"/"Manrope"). Display 28/1.2, H1 22, H2 18, Body 15/1.5,
  Caption 13, Micro 11.
- Bengali: line-height 1.55.

## Shape & elevation
- Radius: cards 14, buttons 12, inputs 12, chips 999.
- Border-first (1px `line`) with minimal shadow `0 1px 2px rgba(16,24,40,.05)`.
- Gutter 16, section gap 20.

## Components
- Buttons: filled maroon / grey-outline. Height 48, radius 12.
- Segmented control for Map/List and tabs.
- Status pill: tinted, radius 999, label + dot.
- Bottom nav: 5 items, active maroon + tint pill behind icon.
- Cards: bordered, image 16:9 with rounded top.

## Rhythm
Client = spacious card feed, one hero action. Partner = balanced KPI grid (2×2), list rows 64px.
