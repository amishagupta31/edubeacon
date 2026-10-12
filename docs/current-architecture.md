# Current Architecture

**Audited:** 2026-10-06 · **Branch:** `main` @ `97fd64c` · **Working tree:** clean

This describes what the repository actually contains, verified by inspection. It is not a
proposal. Where the brief's assumed baseline differs from reality, the difference is noted.

---

## 1. Repository shape

One Git repository containing two independent npm packages:

```
edubeacon/
├── .github/workflows/deploy.yml     CI/CD for both services
├── frontend/                        Next.js 16.3.4 (App Router)
│   ├── package.json  package-lock.json  tsconfig.json
│   ├── Dockerfile    .dockerignore      next.config.ts
│   └── src/{app,components,lib,fonts}
├── backend/                         Express 4 + TypeScript + Mongoose
│   ├── package.json  package-lock.json  tsconfig.json
│   ├── Dockerfile    .dockerignore      .env.example
│   └── src/{routes,models,middleware,lib,scripts}
└── docs/                            this audit
```

There is **no monorepo tooling** — no npm workspaces, no Turborepo, no Nx. Each package has
its own `package-lock.json` and is built independently. The root has no `package.json`.

This is simpler than it looks and is working well. Adding workspace tooling is not required
by anything in the current codebase.

---

## 2. Deployment topology

> **This is the most important finding of the audit.**
>
> The brief treats frontend/backend separation as future work. **It is already done.**
> Two independent Cloud Run services are built from two Dockerfiles and deployed by CI today.

| | Frontend | Backend |
|---|---|---|
| Cloud Run service | `edubeacon` | `edubeacon-backend` |
| Port | 3000 | 4000 |
| Image | `edubeacon:$SHA` | `edubeacon-backend:$SHA` |
| Memory / CPU | 512Mi / 1 | 512Mi / 1 |
| Instances | 0–3 | 0–3 |
| Auth | `--allow-unauthenticated` | `--allow-unauthenticated` |

**Project:** `edubeacon` · **Region:** `asia-southeast1` · **Registry:** `edubeacon-repo`

CI triggers on push to `main`. The frontend job declares `needs: deploy-backend`, so the
backend deploys first and a backend failure blocks the frontend. Authentication to GCP uses
Workload Identity Federation (no long-lived service-account keys) — good practice.

Consequence for this project: **deliverable 12 (future separation migration plan) is largely
moot.** The remaining work is code organisation, not deployment topology.

---

## 3. Frontend

**Next.js 16.3.4, App Router, `output: "standalone"`**, React 19, Tailwind CSS v4,
TypeScript strict, GSAP for animation, Clerk for user auth.

```
src/
├── app/            25 files — routes (20 pages) + layout + globals.css
├── components/     55 files — flat, with eduwecan/, modals/, ui/ subfolders
├── lib/             2 files — data.ts (content), images.ts
└── fonts/           3 files — self-hosted Inter + Fraunces woff2
```

**Rendering:** every one of the 20 routes prerenders as static (`○` in build output). There
are no Next.js API routes, no server actions, and no `middleware.ts`. All dynamic data is
fetched client-side from the Express backend.

That matters: the frontend has **zero server-side coupling to the backend**. Nothing needs
extracting from the Next.js runtime. The brief's section 4 concern ("if the current backend
uses Next.js runtime functionality…") does not apply.

**Component organisation is the main weakness.** 55 components sit mostly flat in
`components/`, mixing reusable UI (`ui/Button`, `ui/Container`), layout (`SiteHeader`,
`SiteFooter`, `SiteChrome`), page-specific sections (`AgendaSection`, `SponsorshipPackages`),
and a parallel `eduwecan/` set that appears to be an earlier design system. Nothing indicates
which page a given component belongs to.

---

## 4. Backend

**Express 4.21, TypeScript (CommonJS, ES2020), Mongoose 8.15.**

```
src/
├── index.ts            entry: CORS, body parsing, route mounting, startup
├── routes/      8      one file per domain; HTTP + validation + business logic + DB access
├── models/      7      Mongoose schemas
├── middleware/  1      clerkAuth.ts — requireAuth + requireAdmin
├── lib/         4      mongodb, mailer, emailTemplates, adminToken
└── scripts/     8      CLI tools
```

**Layering:** routes currently do everything — HTTP handling, validation, business rules and
database access in one function. For files this small (20–80 lines) that is reasonable and
readable. It becomes a problem when a rule needs to be shared between a route and a CLI
script, which has not happened yet.

**Database connection:** `lib/mongodb.ts` uses a module-level `isConnected` flag and connects
once from `start()` before `app.listen()`. Mongoose then manages the pool. **No per-request
connections** — the brief's concern here is already satisfied.

---

## 5. External dependencies

| Service | Used by | Purpose | Failure mode |
|---|---|---|---|
| MongoDB Atlas | backend | All persistence | Backend won't start |
| Clerk | **both** | Frontend: email OTP. Backend: token verification | Conference registration blocked |
| Brevo SMTP | backend | Confirmation emails | Logged, registration still saves |
| Google Fonts | frontend | Inter + Plus Jakarta Sans | Falls back to system fonts |
| Unsplash | frontend | Stock imagery | Broken images |
| Google Maps | both | Embedded map (iframe), email static map | Map absent |

**Clerk spans the boundary deliberately.** The frontend runs the OTP flow with
`@clerk/nextjs`; the backend verifies the resulting session token with `@clerk/backend`. The
secret key never reaches the browser. This is correct, not a leak.

---

## 6. Data layer

Six collections in database `edubeacon`:

| Collection | Model | Indexes beyond `_id` |
|---|---|---|
| `conferenceregistrations` | ConferenceRegistration | `clerkUserId` unique |
| `vendorregistrations` | VendorRegistration | — |
| `interestleads` | InterestLead | — |
| `awardnominations` | AwardNomination | — |
| `admins` | Admin | `email` unique |
| `sitesettings` | SiteSetting | `key` unique |

A seventh model exists — `User.ts`, written by the Clerk webhook — but the webhook is
non-functional in production (see §8), so the `users` collection is likely empty or stale.
Nothing reads it.

All six collections use Mongoose `timestamps: true`. Admin list queries sort by `createdAt`
and filter by `status`; neither is indexed. At current volume (single-digit records) this is
irrelevant. It becomes relevant in the low thousands.

---

## 7. Authentication

Two independent admin paths converging on one authorisation check:

1. **Password** → `POST /api/admin/auth/login` → bcrypt (cost 12) against
   `admins.passwordHash` → 8-hour JWT signed with `ADMIN_JWT_SECRET`
2. **Clerk OTP** → Clerk session token → verified with `CLERK_SECRET_KEY`

`requireAdmin` tries the admin JWT first, then falls back to Clerk. Either path requires the
email to exist in `admins` with `active: true`.

Login protections in place: bcrypt comparison against a dummy hash when no account matches
(flattens response timing), identical error text for both failure modes, and a 5-attempt /
15-minute per-email lockout held in process memory.

**The lockout is per-instance.** With `max-instances 3`, an attacker gets up to 15 attempts
per window across instances, and all counters reset on cold start. Acceptable for one admin
account; worth noting.

---

## 8. Known defects found during audit

Recorded, not fixed. Items A–D were specified in the brief; E–H are new.

| | Issue | Impact |
|---|---|---|
| **A** | `/events/roadshow` + `/events/roadshows`, `/events/round-table` + `/events/roundtable` | 4 URLs, 2 pages — duplicate content, split SEO |
| **B** | `/register/educator` and `/register/partner` have `<form>` with no `onSubmit` | Submissions silently discarded |
| **C** | Magazine panel — all 3 button types have no handler | Dead UI; sponsorship tiers sell magazine placement |
| **D** | Emails/ticker say 9:00 AM; conference agenda starts 10:00 AM | Contradictory information to registrants |
| **E** | **`CLERK_WEBHOOK_SECRET` is absent from the CI deploy env vars** | **Clerk webhook returns 500 in production; user sync is dead** |
| **F** | **Zero automated tests** | No regression protection for any refactor |
| **G** | 4 ESLint errors (`react-hooks/set-state-in-effect`) in `admin/page.tsx` | Baseline failure; `next build` does not run lint so it ships |
| **H** | `ADMIN_EMAILS` still deployed but no longer read by `requireAdmin` | Misleading — editing it has no effect |

**E and F are the two that should be resolved before any structural work begins.**

---

## 9. Baseline check results

Executed 2026-10-06 against a clean tree.

| Check | Result |
|---|---|
| `backend: tsc --noEmit` | **PASS** |
| `backend: npm run build` | **PASS** |
| `backend: lint` | No lint script configured |
| `backend: test` | No test script configured |
| `frontend: tsc --noEmit` | **PASS** |
| `frontend: next build` | **PASS** — 20 routes, all static |
| `frontend: eslint src` | **FAIL** — 4 errors, 27 warnings |
| Automated tests (either package) | **None exist** |

**Not executed** — require credentials or a running environment, and were out of scope for a
read-only audit:

- Live Cloud Run endpoint verification
- MongoDB Atlas index/perf inspection against production
- Brevo SMTP delivery (would email real addresses)
- Clerk webhook round-trip
- The 8 CLI scripts (several mutate data)

No check result in this document is inferred. Anything not run is listed above as not run.
