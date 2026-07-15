# PIPELINE_STATUS — salmon-app

Project: **Salmon Developers Mobile App** (Flutter, Android + iOS)
Track: **PM** (`/fullstack-pm`) — P1-spec → P2-prd → P3-design
Source of truth: `CLAUDE.md` (provided spec) — authoritative.

> NOTE: This pipeline's Dev track (`/fullstack-dev`) targets **NestJS + React (web)** and cannot
> build Flutter. The PM slice produces a PRD + HTML design references only. The actual Flutter
> implementation is a separate hand-scaffold effort (see project plan).

## Progress Table

| Phase | Status | Score | Output |
|---|---|---|---|
| P1-spec | Complete | 0.92 | `status/salmon-app/seed-salmon-app-v1.yaml` |
| P2-prd | Complete | 0.94 | `docs/PRD.md` (archive `prd/salmon-app_PRD.md`, snapshot `prd/history/PRD_v1.md`) |
| P3-design | Complete | 0.93 | `design/html/{shared,client,partner}/*.page.html` (Variation A) |

## Execution Log

| When | Phase | Action | Result |
|---|---|---|---|
| 2026-07-14 | P1-spec | Generate seed from CLAUDE.md (authoritative) | Complete — ambiguity 0.08 |
| 2026-07-14 | P2-prd | Generate PRD (two-role mobile, §2 NFRs, §12 open questions) | Complete — v1 snapshot recorded |
| 2026-07-14 | P3-design | 3 variations → user picked A → 11 role-folder pages → QA PASS | Complete — phase_complete:true |
| 2026-07-14 | P3-design (client expansion) | Fully designed Global Client (§6): +13 pages → 24 total → QA PASS | Complete — bundle rehashed |

## Config

- seed_id: `seed-salmon-app-v1`
- prd_hash_v1: `11f34831008cceefb8cb1addbd7d6546aee6c0b5691845499a51344d2a3b0c19`
- html_bundle_hash: `0382cc46765010e19fb556f3ae3c0e6505c0f7097772ca6db84737b982e84266`
- selected_variation: A
- last_run: 2026-07-14
- pipeline_score: 0.93
- pm_track_status: COMPLETE (P1 + P2 + P3 done)
- active_group: pm
- notes: §12 undefined business rules are intentionally NOT resolved; tracked in OPEN_QUESTIONS.md.
