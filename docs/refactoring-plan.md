# Refactoring Plan

**Status:** Awaiting approval. No file has been moved.

---

## 1. What the audit changes about the brief

Three findings materially alter the proposed scope.

### Finding 1 — Frontend/backend separation is already complete

The brief treats independent deployment as future work (§4, deliverable 12). It exists today:
two Dockerfiles, two Cloud Run services, two CI jobs, communicating over HTTP with a CORS
allowlist. The frontend has **no** Next.js API routes, **no** server actions and **no**
middleware — every dynamic call already goes to Express from the browser.

**Consequence:** the single largest workstream in the brief is already delivered. What
remains is internal code organisation.

### Finding 2 — There are zero tests

The brief requires regression protection before each refactoring step (§9). There is nothing
to protect with. No test files, no test script, no framework in either package.

**Consequence:** writing tests is not a parallel task, it is the prerequisite. Reorganising
20 routes and 55 components with no safety net, against a live production site, is the
single riskiest thing this project could do.

### Finding 3 — Two production defects outrank the refactor

- `CLERK_WEBHOOK_SECRET` is absent from CI, so the Clerk webhook has been returning 500 in
  production
- Open registration endpoints have no rate limiting or spam protection

Neither is a refactoring concern. Both are worth more than any folder move.

---

## 2. Recommended sequence

> **The honest recommendation: do Phase 1 and 2, then reassess whether Phase 3 is worth
> doing at all.**

### Phase 1 — Fix production defects *(small, high value)*

1. Add `CLERK_WEBHOOK_SECRET` to the CI env vars; verify a webhook round-trip
2. Remove `ADMIN_EMAILS` from CI, or restore it as a documented bootstrap path
3. Add a post-deploy smoke step calling `/health` on both services
4. Create a staging Cloud Run service (free at `min-instances 0`)

No source restructuring. Each item is independently revertible.

### Phase 2 — Establish a safety net *(the real prerequisite)*

5. Add Vitest to both packages
6. **Backend integration tests** against `mongodb-memory-server`, with Clerk and Brevo
   mocked, covering: all four registration persistence paths, the conference upsert and
   first-time-only email, both admin login methods, `requireAdmin` rejection, ticker
   validation, and the sanitiser
7. **Frontend tests** for the pure logic — the `compare()` sort comparator, `pageRange()`,
   `toCSV()`, ticker fallback
8. **Route smoke test** asserting all 20 routes return 200 and the build emits 20 static pages
9. Wire both into CI as a required gate

At the end of Phase 2 the codebase is genuinely safe to restructure. **If the project stops
here, it is still strictly better off than before.**

### Phase 3 — Modular restructuring *(only with a green suite)*

Backend first — smaller, better bounded, lower blast radius:

10. `src/modules/<domain>/` for each of the six domains, each holding its route, model and
    service. Move one domain at a time, run the suite after each.
11. `src/integrations/{clerk,brevo}/`, `src/config/` for env access, `src/database/`
12. Extract business logic from routes **only where it is reused**. Do not create a service
    layer for a 20-line handler that nothing else calls.

Frontend after, and more cautiously:

13. `components/` → `components/{ui,layout}` + `features/<domain>/`
14. Centralise API calls in a typed client (currently `API` is re-declared in six files)
15. Optional `packages/contracts` for shared request/response types — **only if** the
    duplication becomes a real maintenance cost

### Phase 4 — Deferred items needing separate approval

Each is a behaviour change, out of scope here:

- Duplicate event routes → canonical + redirect
- `/register/educator` and `/register/partner` → wire up or remove
- Magazine → implement or disable the dead controls
- 9 AM / 10 AM discrepancy → **needs your factual answer, not an engineering decision**
- Rate limiting on open endpoints
- Admin JWT → httpOnly cookie
- Indexes on `status` / `createdAt`

---

## 3. Proposed target structure

Adapted to what exists. **Not** the monorepo in the brief — `apps/` and `packages/` would
add workspace tooling to solve a problem this codebase does not have.

### Backend

```
backend/src/
├── server.ts                    was index.ts
├── config/env.ts                single validated env read
├── database/connection.ts       was lib/mongodb.ts
├── modules/
│   ├── conference-registrations/{routes,model,service}.ts
│   ├── vendor-registrations/
│   ├── interest-leads/
│   ├── award-nominations/
│   ├── admins/                  auth routes, model, token signing
│   └── site-settings/           ticker
├── integrations/
│   ├── clerk/                   client, webhook handler
│   └── brevo/                   mailer, templates
├── middleware/                  auth, errors
├── shared/                      types, helpers
└── scripts/                     unchanged
```

### Frontend

```
frontend/src/
├── app/                         UNCHANGED — URLs must not move
├── components/
│   ├── ui/                      Button, Container, Eyebrow, Reveal, SectionHeading
│   └── layout/                  SiteHeader, SiteFooter, SiteChrome, ScrollReveal
├── features/
│   ├── home/                    Hero, HeroCarousel, HeroStats, EventTicker, …
│   ├── conference/              AgendaSection, SpeakersSection, …
│   ├── solutions/               SolutionsGrid, FeaturedVendors
│   ├── registrations/           the four modals + ModalProvider
│   └── admin/                   admin panel components split out of page.tsx
├── lib/
│   ├── api/                     typed client — replaces 6 scattered API consts
│   └── data.ts, images.ts
└── fonts/
```

**`app/` does not move.** Every public URL stays exactly where it is.

---

## 4. What will not be done

Per the brief and the audit:

- No route deleted, renamed or redirected
- No page content, layout, styling or animation changed
- No collection renamed; no field removed; no destructive migration
- No API response shape changed
- No auth provider replaced; no bcrypt cost or session lifetime altered
- No dependency upgraded during structural work
- No Kubernetes, Redis, Pub/Sub, new database or new auth provider
- No DNS, traffic-routing or Cloud Run topology change
- No commit, deploy or destructive Git command without authorisation

---

## 5. Open questions

Needed before Phase 3; the first two block Phase 4.

1. **Is the conference at 9:00 AM or 10:00 AM?** Only you can answer. Registrants are
   currently receiving contradictory information — this is live, and worth more than the
   refactor.
2. **Are the duplicate event routes linked from anywhere external** — printed material,
   ads, partner sites? Determines whether they can redirect.
3. **How much appetite is there for Phase 3?** The current structure is flat but not
   broken. Honest assessment: for a 20-route site with one backend developer, the
   reorganisation is a modest maintainability gain, while Phases 1 and 2 fix real problems.
4. **Should staging be created?** Recommended, effectively free, and makes everything after
   it safer.

---

## 6. Recommendation

Approve **Phase 1 and Phase 2**. They fix a live production defect and build the safety net
that makes everything else sane.

Then look again at Phase 3 with tests in place and decide whether the reorganisation earns
its risk. It may well — but it should be a decision made from a position of safety, not
before one exists.
