# Domain Research — Salmon Developers Mobile App

## Niche
Real-estate sales + agent/referral network, Bangladesh, domestic + overseas buyers. Two audiences
in one app: aspirational property buyers (premium) and field sales partners (utility).

## Reference patterns (visual, not feature — HARD RULES still govern features)
- **Client experience** — premium property marketplaces (e.g. large-photo listing apps, editorial
  real-estate portfolios): big hero media, calm density, map+list discovery, trust/legal clarity at
  checkout. Emotional, considered, few elements per screen.
- **Partner experience** — field CRMs / sales dashboards: dense KPI tiles, progress bars, lists,
  quick actions, status pills. Information-rich, fast, glanceable.

## Cultural / market notes
- **Bilingual (English + Bengali).** Bengali text is typically **taller and ~15–30% wider** than the
  English equivalent — layouts must be flexible; never pin a width to fit English. Line-height must
  accommodate Bengali conjuncts.
- Overseas buyers → multi-currency display (BDT/USD/AED/GBP) but a single authoritative transaction
  currency at checkout.
- Trust and legal clarity are conversion-critical: disclaimers are mandatory UI, not fine print.

## Emotional targets
- Client: *premium, trustworthy, calm, aspirational.*
- Partner: *capable, organised, motivating, professional.*

## Colour psychology
- **Maroon `#800020`** — heritage, value, prestige; used as a confident brand anchor and primary
  action colour. Pairs with warm neutrals (client) or crisp neutrals (partner).
- **Deep charcoal `#222222`** — grounded, legible, premium text/dark surfaces.

## Accessibility constraints
- WCAG AA: text contrast ≥ 4.5:1 (maroon on white passes for body/large; charcoal on ivory/white
  passes). Status colours must not rely on hue alone — pair with label + icon.
- Touch targets ≥ 44px; mobile-first at 390px; safe-area aware.
