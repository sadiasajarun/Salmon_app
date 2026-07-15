# Variation Prompts — Salmon Developers Mobile App

Representative screens rendered per variation (mobile phone frames, 390px). Chosen to prove both
experiences and the highest-risk flow.

## Representative screen set (same 6 per variation)
1. **Client · Discovery** — map/list toggle, filter chips, project cards with status pill, price in
   display currency + hint of transaction currency.
2. **Client · Project detail + Booking** — hero media, 360 badge, facts, live unit availability,
   token amount + terms, Book CTA, unit lock countdown.
3. **Client · Pending payment** — the hardest screen: paid, webhook not landed. Waiting state,
   "you can leave, we'll notify you", background polling, disclaimer, no fake success.
4. **Partner · Dashboard** — Partner ID, territory, rank, KPI tiles, target progress, approved
   commission, pending settlement, quick actions.
5. **Partner · Leads (submit)** — contact fields, project interest, notes, **mandatory consent
   checkbox** gating submit; simplified status list.
6. **Partner · Commission & Settlement** — ledger rows with status pills, requestable balance
   (approved only), Request-settlement form with **no** bank/MFS/account fields + disclaimer.

## Fixed constraints in every mockup
- Brand: maroon `#800020`, ink `#222222`. Status colours per design guide (hue + label + dot).
- Bilingual proof: at least one Bengali label per screen, showing no overflow.
- Mobile-first 390px, bottom nav, safe-area padding, ≥44px targets.
- No card/bank/MFS fields anywhere. Disclaimers visible. Transaction currency shown at checkout.

## Per-variation styling
- **A**: serif display, warm ivory, pill buttons, radius 24, airy.
- **B**: geometric sans, white + borders, radius 12–14, segmented controls, balanced.
- **C**: tighter sans, soft-grey canvas, maroon app-bar on partner, radius 8–10, dense tiles/bars.
