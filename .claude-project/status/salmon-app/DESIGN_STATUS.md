---
project: salmon-app
selected_variation: A
approved: true
approved_at: 2026-07-14T00:00:00Z
phase_complete: true
roles: [client, partner, shared]
prd_hash_at_generation: "11f34831008cceefb8cb1addbd7d6546aee6c0b5691845499a51344d2a3b0c19"
prd_version: "v1"
html_bundle_hash: "0382cc46765010e19fb556f3ae3c0e6505c0f7097772ca6db84737b982e84266"
generated_at: "2026-07-14T00:00:00Z"
---

# DESIGN_STATUS — salmon-app

## Status: ✅ P3-design complete

**Selected variation:** A — Editorial Warmth (serif display, warm ivory, pill buttons, airy premium
rhythm). Locked system: `.claude-project/design/DESIGN_SYSTEM.md`.

## Handoff artifacts
- Canonical PRD: `.claude-project/docs/PRD.md` (hash matches `prd_hash_at_generation` → Tier 2 OK)
- Approved HTML (role folders): `.claude-project/design/html/{shared,client,partner}/*.page.html`
- Shared stylesheet: `.claude-project/design/html/_shared.css`

## Role folders
| Role | Pages |
|---|---|
| shared | login, profile, notifications, notices, support |
| client | discovery, discovery-map, filters, project-detail, project-gallery, project-progress, kyc, booking-review, payment-checkout, payment-pending ★, payment-result (all branches), installments, invoice-detail, consultation |
| partner | dashboard, leads, commission, investment, approval-status |

**Global Client experience is now fully designed** (§6 client + client-facing shared). Partner
experience remains the earlier representative set.

## QA
See `DESIGN_QA_STATUS.md` — PASS. Cross-links resolve, tokens consistent, §2 HARD RULES spot-checked
clean (no card/bank/MFS fields; disclaimers present; no client-side confirmation).

## Note
This pipeline's Dev track (`/fullstack-dev`) is NestJS + React and cannot build Flutter. These HTML
pages are **visual reference for the Flutter build**, not shippable web code. The Flutter
implementation follows CLAUDE.md §4 architecture and §11 build order in a separate effort.
