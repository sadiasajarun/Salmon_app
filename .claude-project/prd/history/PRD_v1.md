# Salmon Developers Mobile App — PRD (2026-07-14)

> **Source of truth:** `CLAUDE.md` (signed-scope engineering spec). This PRD restates that scope in
> product terms for the PM→Dev handoff. Where the two ever disagree, **CLAUDE.md §2 HARD RULES win.**
> Undefined commercial rules (§12) are listed under *Open Questions* — they are **not** guessed here.

---

# Part 1: Basic Information

## Title
Salmon Developers Mobile App

## Project Type
- **iOS + Android** — single Flutter binary (stable channel, Dart).
- Backend: **Laravel REST API** (`{BASE_URL}/api/v1`, Bearer token).
- A separate **React web CRM/Admin** exists for staff (managers, finance, legal, admin). **Staff do
  NOT log into this app** — the admin dashboard is out of scope for this PRD.

## Description
A dual-experience real-estate mobile app for Salmon Developers (Bangladesh), selling property to
buyers domestically and overseas. One binary presents two completely separate experiences chosen by
role at login: a **premium property-listing + checkout** app for Global Clients, and a **dense
field-sales work tool** for Sales Partners. The two share only authentication, settings,
notifications, networking and storage. **The app never holds, moves, calculates, or promises money.**

## Goals
1. Let Global Clients discover projects, book a unit (server-locked), and pay via **hosted gateway
   checkout** with a fully robust, backend-driven confirmation flow.
2. Give Sales Partners a work tool for leads, sales kit, record-only bookings, and a **display-only**
   commission/settlement ledger — with zero money movement in-app.
3. Enforce every legal/financial/security HARD RULE (§2) as a non-negotiable product constraint.
4. Fully bilingual (English + Bengali, hot-switch, no restart) and OWASP-MASVS-aligned.

## User Types
- **Global Client** (`globalClient`) — property buyer, any country. Sees the client experience.
- **Sales Partner** (`salesPartner`) — nationwide agent/referral network. Sees the partner
  experience **only after `accountStatus == approved`**. Carries:
  - `programs: {zeroInvestment?, withInvestment?}` — may be enrolled in both.
  - `isTeamLead: bool` — a flag that reveals the Team module; **not** a separate role.
  - `accountStatus: pending | approved | rejected | suspended`.
- **Staff (out of app scope)** — managers/finance/legal/admin operate the web CRM only.

> **The app never infers a role.** Role, programs, teamLead, KYC status, preferences, and token are
> returned by the backend at login.

## User Relationships
- Client ↔ Project/Unit/Booking/Payment/Installment (1:N).
- Partner ↔ Lead/Commission/Settlement/Investment/Task/Meeting (1:N).
- Team Lead ↔ Partners (1:N, strictly within permission boundary).
- Partner ↔ Programs (M:N, up to both programs).

## Terminology (single source of truth — §7 enums)

| Term | Definition |
|---|---|
| PartnerAccountStatus | `pending, approved, rejected, suspended` |
| KycStatus | `notSubmitted, pending, verified, rejected` |
| LeadStatus | `submitted, contacted, meetingScheduled, visitCompleted, converted, closed` |
| UnitStatus | `available, reserved, booked, sold` |
| BookingStatus | `pending, confirmed, expired, cancelled` |
| PaymentStatus | `initiated, pending, success, failed, cancelled, expired` |
| InstallmentStatus | `upcoming, due, paid, overdue` |
| CommissionStatus | `pending, approved, settlementRequested, settled` |
| SettlementStatus | `submitted, approved, rejected, onHold, settled` |
| ReturnEntryStatus | `paid, pending, onHold` |
| MeetingStatus | `requested, confirmed, rescheduled, cancelled, completed` |
| TicketStatus | `open, inProgress, resolved, reopened` |
| TaskStatus | `assigned, inProgress, complete, overdue` |
| UserRole | `globalClient, salesPartner` |
| PartnerProgram | `zeroInvestment, withInvestment` |
| PartnerRank | `silver, gold, platinum` (manually assigned by admin) |
| Territory | `Division › District › Upazila/Thana › Union` |
| Pending payment state | Buyer has paid, gateway webhook not yet verified by backend — a waiting/polling state, never a fake success |
| Unit lock | Server-side hold on a unit for a configured window after a pending booking |

> Any API enum value the app does not recognise maps to a safe `unknown` fallback and is **logged,
> never crashed on**. The app must never invent, derive, or reorder a state.

## System Modules — key step-by-step flows

### M1 — Login & role routing
1. User authenticates (email+password / phone+OTP / Google / Apple).
2. Backend returns id, role, programs, teamLead, KYC status, preferences, token.
3. App stores token in **Keychain/Keystore**, then routes:
   - `globalClient` → client shell.
   - `salesPartner` + `approved` → partner shell (Team module iff `isTeamLead`).
   - `salesPartner` + `pending/rejected/suspended` → **status screen only**, no partner features.
   - Unauthenticated → `/login`.

### M2 — Booking + payment (highest-risk; build the `pending` state first)
1. Client selects an **available** unit → app shows token booking amount + terms (values from config,
   not hardcoded).
2. Tap **Book** → backend creates a **pending booking** and **locks the unit** for a configured
   window → app shows a **countdown**.
3. Tap **Pay** → backend returns a hosted-checkout URL → app opens it in WebView/in-app browser.
4. Gateway return is treated only as a **hint to start polling**. App polls `payments/{id}`.
5. Payment becomes `success` **only** after the backend verifies the gateway's signed webhook; app
   push-notifies on resolution. **The app never confirms from the client-side callback.**
6. Failure branches, all handled: lock expiry (unit → available, booking → expired), `cancelled`,
   `failed`, webhook-delayed (`pending`), duplicate submit (blocked server-side), app killed
   mid-checkout (resume by polling on relaunch).

### M3 — Lead submission (partner)
1. Partner enters contact, project interest, notes.
2. **Mandatory, non-skippable consent checkbox** confirming the referred person permitted sharing
   their details (legal requirement).
3. Submit → backend creates lead (`submitted`). Partner tracks a **simplified** status only; internal
   staff notes/assignments are never shown. Commission eligibility is created only after staff verify
   conversion.

### M4 — Commission & settlement (partner, display-only)
1. Ledger lists commissions with amount, related lead/project/program, approval date, status.
2. Requestable balance counts **only `approved`** commission.
3. Tap **Request settlement** → form with **NO bank details, NO MFS number, NO account fields**.
4. App blocks requests exceeding balance and duplicate active requests. Finance pays externally and
   records a reference. Status flips to `settled`; partner is notified. **Partner sees status only** —
   never internal evidence or finance reference.

### M5 — With-Investment (partner, record-only; blocked on legal)
1. Partner expresses interest; staff record the confirmed share offline.
2. App displays the share record and a **manually recorded** return schedule (`paid/pending/onHold`)
   with **client-approved disclaimers**. **No calculator, no payout button, no guaranteed-return copy.**

## 3rd-Party Integrations
- **Push:** Firebase Cloud Messaging.
- **Maps:** `MapProvider` interface — **TBD Google Maps or Mapbox** (mock impl now).
- **Payments:** `PaymentGateway` interface — hosted checkout — **TBD gateways** (Stripe / PayPal /
  SSLCommerz / international wire / local MFS) (mock impl now).
- **Chat/Support:** `SupportChannel` interface — **TBD WhatsApp Business API or in-app** (mock now).
- **Meetings:** external **Zoom / Google Meet** links only (no in-app video).
- **Media/360:** client-supplied CDN assets + Matterport/360 embeds (short-lived signed URLs).
- **OTP provider, CDN, map API, gateway merchant accounts:** client-supplied (see Open Questions).

---

# Part 2: User Application PRD

## Non-Functional Requirements (NFR) — HARD RULES from §2 (mandatory)

These are product acceptance constraints, not preferences. Violating any is a defect even if requested.

**Money**
- No wallet / stored balance / escrow / in-app credit. No payout button anywhere.
- Never collects bank / MFS (bKash/Nagad) / IBAN / routing numbers / merchant credentials.
- Never calculates commission or investment returns — display human-approved numbers only.
- Never displays guaranteed-return language; client-approved disclaimer text is mandatory UI.

**Cards & payments**
- Never builds a card form (no card number, CVV, expiry, PIN). Payment only via gateway hosted/
  tokenized checkout.
- Never confirms booking/payment from a client-side gateway callback — backend + verified webhook only.
- Card data, CVV, PIN, OTP, gateway credentials never appear in logs, crash reports, analytics, or
  screenshots.

**Security**
- Auth tokens in iOS Keychain / Android Keystore only — never SharedPreferences / plain file / global.
- UI hiding is UX only; every permission enforced server-side.
- Protected media/documents via short-lived signed URLs; never cached unencrypted; never a permanent
  public URL.
- Biometric unlock = session convenience only; enabled only after a successful primary login;
  biometric data never leaves the device.
- OWASP MASVS baseline; TLS only; certificate pinning preferred.

**Scope exclusions**
- No in-app video calling · no automated KYC/OCR/e-signature/sanctions/identity-matching · no
  automated rank calculation · no self-created 360/3D assets · no AI / lead scoring / recommendations.

**Cross-cutting engineering NFRs (§9/§10)**
- i18n: all text via ARB; English + Bengali; hot-switch, no restart; Bengali expands — never fix a
  width to English.
- Every async screen handles four states: **loading / empty / error / data** (shared widgets).
- Money as integer minor units + currency code — never `double`. **Display currency ≠ transaction
  currency**; the authoritative transaction currency is shown at checkout regardless of display choice.
- Time stored/transmitted UTC ISO-8601; rendered in the user's timezone; never device-local for logic.
- Theme tokens: primary Light Maroon `#800020`, ink Deep Charcoal `#222222`. Client = premium/
  editorial; Partner = functional/dense.

## 1. Common (both roles)

### Splash / Bootstrap
- Token check, force-update check (from `/config` min supported version), role routing. States:
  loading → routed shell / login / force-update wall.

### Login
- **Inputs / methods:** email + password; international phone + OTP (country-code picker, resend
  cooldown, attempt limit); Google Sign-In; **Sign in with Apple (mandatory since Google is offered)**.
- **On success:** backend returns id, role, programs, teamLead, KYC status, preferences, token → store
  token securely → route by role.
- **Errors:** typed `Failure` rendering (invalid credentials, locked, network, OTP expired/exhausted).

### Forgot / reset password
- Request reset (email/phone) → backend-driven reset flow. No secrets echoed.

### Sign up
- Client self-registration and Partner registration (Partner registration required fields are **TBD —
  Open Questions**). Partner signup ends at the **pending approval gate**.

### Biometric unlock
- Toggle in preferences; only offered after a successful primary login; unlocks an existing stored
  session. Never a primary auth method.

### Profile & preferences (shared)
- Language (English/Bengali hot-switch), display currency (BDT/USD/AED/GBP), timezone, notification
  prefs, biometric toggle. Logout revokes the device token server-side.

### Notifications (shared)
- FCM; deep-link to the relevant record. **Never put sensitive content in a payload** (no settlement
  evidence, finance references, or document contents).

### Notices (shared)
- Admin-published, targeted by team/territory/rank/program. Render what the backend returns.

### Support (shared)
- Tickets to Customer Care / Sales / Accounts / Admin: category, subject, description, attachment.
  Thread view, reopen. `TicketStatus`.

---

## 2. Global Client

### 2.1 Navigation
1. Discovery (map/list) · 2. Bookings & Payments · 3. Installments · 4. Consultation · 5. Profile
(KYC and Notifications reachable from Profile/entry points).

### 2.2 Page architecture

**KYC** — upload passport/NID + photo. `KycStatus: notSubmitted/pending/verified/rejected`; show
rejection reason if present. (No OCR/automated verification — staff verify.)

**Discovery** — interactive map with project pins + list ↔ map toggle. Filters: status
(ongoing/completed/upcoming), location, category (apartment, commercial, shop, land/plot share,
hospital/hotel share), bedrooms, area, price range, availability. Prices in display currency; **the
authoritative transaction currency is shown at checkout regardless.**

**Project detail** — HD gallery (CDN responsive variants, lazy load), promo video, 360°/Matterport
embed, pinch-zoom floor plans, dated construction-progress feed, facts, amenities, live unit
availability (`UnitStatus`), downloadable brochures.

**Booking** — select an available unit → token amount + terms → **Book** → server pending booking +
unit lock + **countdown**. Graceful lock-expiry handling; duplicate booking prevented server-side.
`BookingStatus`.

**Payment** — hosted checkout handoff; channels TBD. **The `pending` (webhook-delayed) state is the
highest-risk screen — build it first:** clear waiting UI, user may leave, background polling,
push-notify on resolve, never fake success. `PaymentStatus`.
  - ⚠️ **Known Risks:** double-submit booking/payment (block client + server); client-side callback
    treated as truth (forbidden — poll backend); app killed mid-checkout (resume via poll on relaunch);
    currency conflation (show transaction currency at checkout).

**Installments** — total price, verified paid, outstanding, upcoming schedule, overdue flagged; pay an
installment (same gateway flow); chronological history; server-generated PDF invoices/receipts;
timezone-aware due/overdue reminders. `InstallmentStatus`.

**Consultation** — one live chat channel (provider TBD). Book/reschedule/cancel a slot; confirmed
slots attach an **external Zoom/Meet link**. `MeetingStatus`.

---

## 3. Sales Partner

> **Approval gate:** until `accountStatus == approved`, the partner sees a **status-only screen** —
> no partner features. `pending/rejected/suspended` never reach the partner shell.

### 3.1 Navigation (approved partner)
1. Dashboard · 2. Leads · 3. Sales Kit · 4. Commission · 5. More (Programs, Bookings, Investment,
Meetings, Tasks, Training, Team*, Support). *Team visible only if `isTeamLead`.

### 3.2 Page architecture

**Onboarding** — register → submit profile → accept terms → **pending approval gate**. On approval:
Partner ID, territory (Division›District›Upazila/Thana›Union), rank (Silver/Gold/Platinum, manual),
shareable digital business card. Enrol in one or both programs. (ID format, required fields, approval
steps — **TBD, Open Questions**.)

**Dashboard** — Partner ID, territory, rank, active programs, lead counts, upcoming meetings, open
tasks, target-vs-achievement, approved commission, pending settlement, investment info (if
applicable), recent notifications, quick actions. (Dense/functional layout.)

**Programs** — *Zero Investment* (refer buyers, earn commission on verified conversion) and *With
Investment* (buy an approved project share, view a client-approved return schedule + higher-tier
commission). Both show client-approved eligibility, conditions, and **disclaimers**. The app never
presents Salmon as a guarantor or investment adviser. (Rates/eligibility/triggers — **TBD**.)

**Leads** — submit contact + project interest + notes + **mandatory consent checkbox** (non-skippable,
legal). Track a **simplified** `LeadStatus` only; internal notes/assignments never shown. Commission
eligibility created only after staff verify conversion.
  - ⚠️ **Known Risks:** consent checkbox must gate submit (never optional); simplified status must not
    leak internal staff fields.

**Sales kit** — projects, live inventory, downloadable brochures/layouts/scripts; content targeted by
program/rank/team/territory — **render what the backend returns, assume nothing.**

**Bookings (record-only)** — an authorised partner logs a sale against a **verified** lead: booking
date, unit, down payment, offline payment method, non-sensitive reference, attachments. **No money
moves.** Entries are unverified until finance confirms on the web panel.

**Commission & settlement** — ledger (amount, related lead/project/program, approval date, status);
requestable balance counts **only `approved`** commission; **Request settlement** form has **NO bank/
MFS/account fields**; blocks over-balance and duplicate active requests; partner sees **status only**.
`CommissionStatus`, `SettlementStatus`.
  - ⚠️ **Known Risks:** any account/bank/MFS field here is a HARD-RULE violation; over-balance or
    duplicate requests must be blocked; finance reference must never be shown.

**Investment (record-only)** — express interest; staff record the confirmed share offline; view share
record + manual return schedule (`ReturnEntryStatus: paid/pending/onHold`). **No calculator, no payout
button, no guaranteed-return copy.** (Blocked on legal sign-off, not engineering.)

**Team (Team Lead only)** — referral code/link (new users join under the correct team + territory);
roster, territory coverage, team targets, sales volume — strictly within the permission boundary.

**Meetings** — request a virtual meeting or site visit; view offered slots; confirmed/rescheduled/
cancelled status; confirmed bookings carry an **external meeting link** or a physical location;
recurring head-office meetings appear in the calendar with attendance status. `MeetingStatus`.

**Tasks & targets** — view assigned tasks, mark complete with note/evidence, see target-vs-achievement
progress. `TaskStatus`.

**Training** — categorised content library (policies, guidelines, FAQs, video tutorials). **Library
only — no quizzes, no certification, no LMS.**

---

# Open Questions (Client confirmation required — §12; do NOT guess)

> These commercial rules are intentionally undefined. Build the *mechanism* behind an interface + mock
> and drive the value from `/config` or mock data. Full list maintained in
> `.claude-project/OPEN_QUESTIONS.md`.

## Required clarifications
| # | Question | Why it's needed |
|:-:|---|---|
| 1 | Which payment gateways ship, in which countries? | Determines `PaymentGateway` adapters and checkout UX |
| 2 | Token booking amount model (fixed/per-project/%) and inventory lock duration? | Drives booking screen + countdown |
| 3 | Is display-currency conversion informational or transactional? Rate source + rounding? | Affects checkout currency handling (HARD RULE on currency separation) |
| 4 | Partner ID format, required registration fields, approval steps + approver? | Blocks partner onboarding spec |
| 5 | What event counts as "conversion" and who declares it? | Gates commission eligibility |
| 6 | Legally approved With-Investment return terms + disclosure wording? | **Blocked on legal counsel** — record display only |
| 7 | Chat provider (WhatsApp Business API vs in-app)? Maps (Google vs Mapbox)? Meetings (Zoom vs Meet)? | Selects the single implementation behind each interface |
| 8 | Does any client action require Verified KYC? | Determines KYC gating on booking/payment |

## Recommended clarifications
| # | Question | Why it's needed |
|:-:|---|---|
| 1 | Silver/Gold/Platinum criteria (assigned manually — on what basis)? | Rank display context |
| 2 | Zero-Investment commission rates; With-Investment higher-tier rate/eligibility/trigger? | Ledger context (display only) |
| 3 | Minimum settlement amount; hold/rejection/reversal rules? | Settlement request validation |
| 4 | Refund & cancellation policy; invoice numbering, tax fields, legal wording? | Installments/receipts |
| 5 | Consultation slot availability + cancellation rules? | Consultation booking |

---

# Notes
- No Part 3 (Admin Dashboard): staff use a separate React web CRM — out of scope for this app.
- Build order (§11) governs delivery sequence; **Phase 3 (booking + payment)** is the highest-risk
  work — the `pending` payment state is built first.
- This PRD is the PM→Dev handoff input **for a Flutter build**. The pipeline's own Dev track is
  NestJS/React (web) and cannot build Flutter; the Flutter implementation is a separate effort driven
  by CLAUDE.md §4 architecture.
