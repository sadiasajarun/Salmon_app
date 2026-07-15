# DESIGN_QA_STATUS — salmon-app (P3f)

Selected system: **Variation A — Editorial Warmth** (`design/DESIGN_SYSTEM.md`).
Date: 2026-07-14 · Result: **PASS**

## Checks

| # | Check | Result | Notes |
|:-:|---|:--:|---|
| 1 | Routing valid (all cross-role hrefs resolve) | ✅ | 0 broken links (verified via realpath scan) |
| 2 | Shared component consistency (navbar/footer/tokens) | ✅ | All pages import `../_shared.css`; nav markup identical per role |
| 3 | Design-system compliance (colors/fonts/spacing) | ✅ | Tokens from DESIGN_SYSTEM.md: primary #800020, ink #222222, serif display, radius 24 |
| 4 | Role-folder presence (≥1 HTML per role) | ✅ | shared=2, client=4, partner=5 |
| 5 | Role match (folders == DESIGN_STATUS.roles) | ✅ | `[client, partner, shared]` |
| 6 | Cross-role navigation prefixes | ✅ | Links use `../client/*`, `../partner/*`, `../shared/*` |

## HARD-RULE (§2) spot-check on artifacts

| Rule | Result | Evidence |
|---|:--:|---|
| No card form (number/CVV/expiry/PIN) | ✅ | No such inputs; forbidden-term grep returns only disclaimer negations |
| No bank/MFS/IBAN/account fields | ✅ | Settlement screen explicitly states "no bank, no bKash/Nagad, no account number, no IBAN" |
| No client-side payment confirmation | ✅ | Pending screen: "confirmed only after the bank's verified notification — never from this screen alone" |
| No guaranteed-return language | ✅ | Investment screen carries the not-a-guarantor/not-adviser + "returns are not guaranteed" disclaimer |
| Consent gates lead submit | ✅ | Leads screen: mandatory consent checkbox, "Submit stays disabled until consent is ticked" |
| Transaction currency shown at checkout | ✅ | Discovery + project detail show display currency + "Transaction currency: BDT" |
| Bilingual tolerance | ✅ | Each screen carries a Bengali label without layout overflow |
| Four async states pattern | ✅ | Loading (pending payment spinner), empty/error notes, data lists present |

## Coverage note (updated 2026-07-14 — Global Client expansion)

Bundle is now **24 pages** (shared 5, client 14, partner 5), re-verified: 0 broken links, all pages
import `../_shared.css`, forbidden-field scan clean (only compliant negations).

**Global Client — fully designed** per CLAUDE.md §6 + client-facing shared:
- KYC (upload + rejected-with-reason), Discovery list + **map** + **full filter sheet**, Project
  detail + **media (gallery/360/video/floor plans)** + **dated progress feed**, **Booking review**
  (token + terms + lock), **Payment checkout** (channel select + hosted WebView handoff),
  **Pending payment ★**, **Payment result — every branch** (success/failed/cancelled/expired-lock/
  wire-pending), Installments + **invoice/receipt**, **Consultation** (chat + slots + external link),
  and shared **Notifications / Notices / Support**.

Client HARD-RULE spot-check (re-verified):
- Payment checkout: channel picker + WebView only, "Salmon never sees or stores your card number,
  CVV or PIN"; result screen: confirmation only after verified webhook.
- Booking: creates pending + lock; result screen shows lock-expiry branch explicitly.
- Media/documents framed as CDN + server-issued; receipts are server PDFs.
- Bengali label on every screen; four async states represented (loading spinner, empty/error notes,
  data lists).

**Partner** remains the earlier representative set (dashboard, leads, commission, investment,
approval-status). Remaining partner screens (onboarding forms, sales kit, bookings record-only,
meetings, tasks, training, team) inherit the same locked DESIGN_SYSTEM.md. No route-coverage gate
applies (PM-only run, no `routes.yaml`).
