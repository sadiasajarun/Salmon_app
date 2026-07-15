# The front door — unified entry & role routing (decision)

> One binary, two experiences. The screens G01–G06 are thin; the real deliverable is
> `assets/js/auth-router.js` — an explicit state machine a Flutter `go_router` guard will later mirror.

## The decision: hybrid (fork on sign-up, unified on sign-in)

- **Sign-UP is a fork (G03).** A new person genuinely *is* one or the other, and the two registration
  flows are irreconcilable: a **buyer** sets display currency + timezone and gets immediate access; a
  **partner** picks a program, enters a territory, and hits an **approval wall**. You cannot merge
  these, so we ask up front — two visibly *different* doors (aspirational vs professional), and the
  partner door is **honest that approval is required** ("Apply to join…", not "Start selling now").
- **Sign-IN is unified (G04).** A returning user shouldn't have to remember which "kind" they are.
  One identifier + method (password/OTP, Google, Apple); on success the **backend returns the role +
  account status** and the app **routes silently**. We only ask a question in one case (below).

Why: forcing a returning partner to tap "I'm a partner" every launch is friction; forcing a new
buyer through partner registration fields is broken. The hybrid respects both.

## The one edge case that breaks a clean fork: dual-role (G05)

One person can be **both** — Shahin refers buyers *and* is quietly buying a flat himself, so his
phone maps to two accounts. On sign-in this resolves to two roles, and the honest answer is **not to
force one identity to win**: present both ("Continue as Buyer" / "Continue as Sales Partner
SDP-CUM-…") and let him **choose per session**.

- **Where the in-app role switch would live (flagged, not built):** inside the shared **Profile /
  account** area — a "Switch to Buyer / Partner" row that re-runs `auth-router` without a full
  sign-out. Both shells already have a Profile surface to host it.
- **Policy question logged:** *does Salmon allow one identity (phone/email) to hold both a client and
  a partner account, or must they be separate identifiers?* This changes the data model and the G05
  flow (OPEN_QUESTIONS).

## Wrong-door recovery (G06)

Someone taps "Become a Sales Partner" on G03 but already has a **client** account on that number (or
the reverse). Don't dead-end and don't silently merge: "This number is already registered as a buyer.
Sign in as a buyer, or use a different number to apply as a partner." Route to the right door.

## Returning-session fast path (G01)

If a valid session exists, **the fork never appears.** Splash → validate token → route straight to
the role's home (client home · partner dashboard · partner status screen). Biometric unlock sits
here. The fork is for new users and fresh sign-ins only — a logged-in user is never asked
"client or partner?" again.

## Brand

The front door belongs to **neither** sub-app — it's Salmon's shared threshold, the parent brand from
which the client's editorial calm and the partner's functional density both descend. Same tokens
(maroon `#800020`, charcoal `#222222`). G02 gets a little aspirational polish (it's Salmon's face);
everything else is fast and honest. Bengali-capable throughout — the partner path leans Bengali.

## The routing state machine (auth-router.js)

```
routeSignIn(account):
  no account            -> NO_ACCOUNT (offer sign-up → G03)
  roles = {client,partner} -> RESOLVER (G05)
  roles ∋ partner:
      status approved   -> PARTNER_DASHBOARD
      status pending    -> PARTNER_STATUS(pending)   (P07)
      status rejected   -> PARTNER_STATUS(rejected)  (P08)
      status suspended  -> PARTNER_STATUS(suspended) (P09)
  roles ∋ client        -> CLIENT_HOME

routeSignUp(path):  client -> CLIENT_SIGNUP ;  partner -> PARTNER_REGISTER (P02)
checkDoor(path, account): flags wrong-door when the chosen path ≠ the account's existing role
bootstrap(session): valid session -> routeSignIn(session) ; else -> WELCOME
```
