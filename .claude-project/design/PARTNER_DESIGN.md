# Partner app — design rhythm statement

> Same tokens as the client app (`_shared.css`: Light Maroon `#800020`, Deep Charcoal `#222222`,
> Variation A serif/sans). **Opposite composition.** The client app is a shop; the partner app is a
> workplace. Shahin isn't being seduced — he's clocking in on a 3G connection outside his shop.

## How the partner rhythm differs (same tokens, different moves)

- **Density over air.** Client screens breathe (one hero per fold, 20px gutters, big media). Partner
  screens are packed and scannable: **16px gutter**, tight vertical rhythm, list-and-tile layouts,
  no decorative hero imagery. A partner opens this thirty times a day between customers — every screen
  earns its space.
- **Type scale drops.** The serif display is used **sparingly** (only the identity/credential moments:
  Partner ID reveal, business card). Everywhere else it's the **sans utility face**, smaller steps
  (H2 18 → 17, body 14.5), for a tool feel closer to a banking/field-service app than a brochure.
- **A maroon working app-bar**, not a floating translucent back button. The partner top bar is a solid
  maroon `#800020`→`#5c0018` band — it reads as "you are inside a system," and it's legible on a cheap
  screen in daylight. (The client used quiet chrome to let photography breathe; there is no
  photography to protect here.)
- **Boxier components.** Radius drops from the client's 24 to **10–12**; cards are bordered and
  functional, buttons full-width and unmissable (≥48px) for thumbs on a mid-range Android.
- **Progress is explicit.** Registration is a numbered stepper (1–6) so Shahin always knows where he
  is and that nothing was lost.
- **Credential moments get weight.** P07 (the wall), P10 (approved), P11–P12 (identity + business
  card) are the exceptions where the serif returns and spacing opens up — because these are the
  emotional beats. Everything between them is dense utility.

## Bengali-first

Every screen is authored in **Bengali** (Shahin's primary language) and defaults to `lang='bn'`, with
an EN toggle. If it fits in Bengali (20–30% longer, different line-breaks) it fits in English. No
fixed-width buttons, no truncation, generous line-height (1.5) for Bengali conjuncts.

## Offline is first-class

Shahin is on 3G outside his shop. Registration **drafts every field to localStorage** so a dropped
connection never loses input; submission is guarded by the network simulator and fails **honestly**
(never silently). The account-status wall (P07) updates in place when the decision lands.

## The disciplines

- **No invented business rules in the UI.** Rank has **no progress bar** (criteria undefined). SLA,
  Partner-ID format, field lists, referral binding — all shown as placeholders, logged in
  OPEN_QUESTIONS.md. If a rule is undefined, the UI must not imply one exists.
- **The wall is a trust-holding state, not a spinner** (P07): a human is reviewing, an SLA slot, a way
  to reach a person now, and a preview of the identity that's coming.
- **The business card (P12) is a real credential** — branded, print-clean, shareable as an image,
  legible at thumbnail size in a WhatsApp chat.

## Dashboard hierarchy (P15 redesign)
- **Three tiers, one hero.** Tier 1 = approved commission (largest number, the ONLY body maroon, the one primary "Request settlement" button); Tier 2 = leads as a single "N active · M moved today" row (per-status detail lives on the Leads screen — no horizontal scroller); Tier 3 = Today + Target merged on a **lighter recessed surface** so it visibly recedes. Quick actions are a fixed 2×2 grid (no horizontal scroll). One card style (.5px border, 12px radius), one 8/12/16 spacing scale. Pending settlement is supporting text, never a card. No rank progress bar, no forecast, no on-device maths. This screen sets the density standard for the whole partner app.
