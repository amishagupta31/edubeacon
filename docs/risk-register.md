# Risk Register

Ordered by expected damage. Each entry states what breaks, how it would be noticed, and what
prevents it.

---

## Critical — must be mitigated before restructuring

### R1 · No automated tests
**Impact:** Any regression ships silently to production. The build passing proves
compilation, not behaviour. 20 routes, 4 registration flows, 2 auth paths and an admin panel
with sorting/pagination/export have **zero** coverage.

**Detection today:** a user reports it.

**Mitigation:** Phase 2 before any file move. This is the single highest-leverage item in
the project.

### R2 · Clerk webhook broken in production
**Impact:** `CLERK_WEBHOOK_SECRET` absent from CI → every delivery returns 500 → `users`
unsynced. Recurring 500s in production logs.

**Detection today:** none — nothing reads `users`, so it fails invisibly.

**Mitigation:** add the secret; verify a round-trip. Phase 1.

### R3 · Breaking the registration/email ordering
**Impact:** The conference route reads `existing` **before** the upsert, responds **before**
emailing, and does not `await` the send. Disturbing any of the three causes duplicate
confirmation emails, SMTP latency on every response, or mail failures turning saved
registrations into 500s.

**Detection today:** only in production.

**Mitigation:** the invariants are documented in `registration-flows.md`; Phase 2 covers
them with tests before the code is touched.

---

## High

### R4 · Open endpoints have no abuse protection
Vendor, interest and award accept unauthenticated POSTs with no throttle, CAPTCHA or
honeypot — and each sends an email. A script could flood the collections and damage the
Brevo sending reputation, which would break confirmations for genuine registrants.

**Most exploitable gap in the system.** Fix is Phase 4; worth bringing forward.

### R5 · Silent frontend failure on registration
All four modals set `submitted = true` in a `finally` block, so the success screen shows
even on network failure or a 400. A registrant believes they registered when nothing was
saved.

**This has already happened during development** — "Failed to fetch" errors showed success
screens. Changing it alters user-visible behaviour, so it needs approval.

### R6 · No staging environment
`main` deploys straight to production. A refactor deploy is validated in production, by
users.

**Mitigation:** Phase 1 creates staging. Free at `min-instances 0`.

### R7 · Clerk OTP flow is fragile and untestable
`SchoolRegistrationModal` handles `session_exists`, `form_identifier_exists`, the
sign-up/sign-in fork, a generated password, and two different verify paths — all against
Clerk's API, with no test coverage. It is the only authenticated registration path.

**Mitigation:** do not touch it during restructuring. Treat as frozen.

---

## Medium

### R8 · `NEXT_PUBLIC_*` are build-time only
Changing `NEXT_PUBLIC_API_URL` requires a rebuild; a redeploy silently does nothing. Easy
to get wrong when adding a staging environment.

### R9 · Middleware ordering is load-bearing
`express.raw()` on `/api/webhooks` must precede `express.json()`, or svix verification
breaks. Natural-looking cleanup could reorder it. Failure is silent until a webhook arrives.

### R10 · Four ESLint errors already in the baseline
`react-hooks/set-state-in-effect` in `admin/page.tsx`. `next build` does not run lint, so
they ship. If lint becomes a CI gate, CI fails on day one.

**Must be recorded as pre-existing** so they are not misattributed to the refactor.

### R11 · In-memory rate limiting
Per-instance, resets on cold start, `max-instances 3` → effectively 15 attempts/window.

### R12 · Admin JWT in `localStorage`
XSS on `/admin` yields an 8-hour admin session. Mitigated by the page rendering no
user-generated content.

### R13 · Missing indexes
Admin queries sort by `createdAt` and filter by `status`; neither indexed. Irrelevant at
current volume, relevant in the low thousands.

### R14 · Component reorganisation touches 55 files
Highest-churn step in Phase 3, and the most likely to produce a subtle import or styling
regression. GSAP components with `useIsomorphicLayoutEffect` and cleanup are especially
sensitive.

**Mitigation:** move by feature, one at a time, build after each.

---

## Low

### R15 · Duplicate event routes
Four URLs, two pages. SEO dilution. Deliberately unchanged.

### R16 · Dead forms at `/register/educator` and `/register/partner`
Submissions silently discarded. Not linked from nav, but live and indexable.

### R17 · Magazine controls non-functional
Every button lacks a handler, while sponsorship tiers sell magazine placement.

### R18 · 9 AM vs 10 AM discrepancy
Emails and ticker say 9:00 AM; agenda starts 10:00 AM. **Needs a factual answer, not an
engineering decision.**

### R19 · Credentials shared in plaintext during development
Gitignored and never committed, but rotation is advisable — the Brevo SMTP key in
particular.

### R20 · `cloudbuild.yaml` of unknown status
Lives in `frontend/`, may be superseded by the Actions workflow. Not inspected for active
use. **Do not delete without checking.**

---

## Rollback readiness

| | |
|---|---|
| Code | Branch per phase; squash-merge; revertible |
| Backend deploy | `gcloud run services update-traffic edubeacon-backend --to-revisions <REV>=100` |
| Frontend deploy | same for `edubeacon` |
| Database | **No schema change planned.** Any migration gets its own approval and reversal script |
| Secrets | Changes are additive; removing `ADMIN_EMAILS` is reversible |

**Before any refactor deploy, record the current good revision of both services.** Rolling
back one without the other is only safe while API contracts are unchanged — which is why
this plan does not change them.
