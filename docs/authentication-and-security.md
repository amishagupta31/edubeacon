# Authentication & Security

Current posture, verified by inspection. Documents what exists, what protects it, and where
the gaps are.

---

## Roles

Three effective roles. Only one is stored; the others are states.

| Role | Established by | Stored in |
|---|---|---|
| Public | no credentials | — |
| Registrant | Clerk email OTP | Clerk; `users` collection (sync currently broken) |
| Admin | email present in `admins` with `active: true` | MongoDB `admins` |

**There is no role hierarchy and no permission granularity.** An admin has everything:
all registrant PII across four collections, CSV export, status mutation, and site settings.
There is no editor, viewer, or scoped role.

---

## Admin authentication — two paths

### Password
```
POST /api/admin/auth/login { email, password }
  → Admin.findOne({ email, active: true }).select("+passwordHash")
  → bcrypt.compare(password, hash || DUMMY_HASH)
  → signAdminToken({ sub, email })        8-hour HS256 JWT
  → Admin.updateOne({ lastLoginAt: now })
```

### Clerk OTP
```
Clerk sign-in/sign-up → session token
  → requireAdmin → verifyToken(CLERK_SECRET_KEY)
  → clerk.users.getUser(sub) → primary email
  → Admin.findOne({ email, active: true })
```

Both converge on the same `admins` lookup. Revoking access means setting `active: false`,
which kills both paths at once.

---

## Protections in place

| Control | Implementation |
|---|---|
| Password hashing | bcrypt, cost 12 |
| Hash exposure | `passwordHash` has `select: false` — excluded unless explicitly requested |
| Timing attack | bcrypt runs against `DUMMY_HASH` when no account matches |
| Email enumeration | Identical 401 + message for unknown email and wrong password |
| Brute force | 5 attempts per email per 15 min |
| Session lifetime | 8 h, enforced by JWT `exp` |
| Secret strength | `signAdminToken` throws if `ADMIN_JWT_SECRET` < 32 chars |
| Webhook authenticity | svix signature over the raw body |
| CORS | Explicit origin allowlist from `FRONTEND_URL` |
| Secret isolation | No secret has a `NEXT_PUBLIC_` prefix |
| Container hardening | Both images run as non-root (uid 1001) |
| CI credentials | Workload Identity Federation — no static service-account keys |

**Server-side enforcement is correct.** Every protected operation checks authorisation on
the backend. The `/admin` page gate is client-side only, but that is cosmetic — the page is
inert without data, and all data is authorised server-side.

---

## Gaps

### 1. Rate limiting is per-instance and in-memory
`adminAuth.ts` holds attempt counts in a module-level `Map`. With `max-instances 3` an
attacker effectively gets 15 attempts per window, and every counter resets on cold start —
which, at `min-instances 0`, happens often.

Adequate for a single admin with a strong password. Inadequate if admin count grows or if
the login URL becomes widely known. A shared store would fix it, but adding Redis for one
login endpoint is disproportionate; a MongoDB-backed counter would be cheaper.

### 2. Admin JWT in `localStorage`
Readable by any script running on the page, so an XSS anywhere on `/admin` yields an 8-hour
admin session. An httpOnly cookie would be strictly stronger.

Mitigating factors: `/admin` renders no user-generated content, and the app has no
third-party script tags. Worth revisiting before admin count grows.

### 3. No rate limiting on open registration endpoints
`vendor`, `interest` and `award` accept unauthenticated POSTs with no throttle, CAPTCHA or
honeypot. A script could flood those collections and trigger a confirmation email per
submission — which also risks the Brevo sending reputation.

**This is the most exploitable gap in the current system.**

### 4. `CLERK_WEBHOOK_SECRET` missing in production
Not included in the CI `--set-env-vars` list, so `/api/webhooks/clerk` returns 500 for every
delivery. Clerk retries then gives up. The `users` collection is not being maintained.

Nothing currently reads `users`, so there is no user-visible impact — but the feature is
silently dead and the production logs carry recurring 500s.

### 5. `ADMIN_EMAILS` is deployed but dead
Still passed by CI and still read as a fallback in an earlier revision, but `requireAdmin`
now checks only the `admins` collection. Editing the secret has no effect. Misleading to
anyone operating the system.

### 6. No audit trail
`lastLoginAt` is the only trace. Status changes, CSV exports and ticker edits are not
logged. With one admin this is tolerable; with several, there is no way to answer "who
changed this record".

### 7. Credentials have been handled insecurely during development
SMTP keys and passwords were pasted in plaintext into a chat session. They are correctly
gitignored and were never committed, but **rotation is advisable** for anything shared that
way — the Brevo SMTP key in particular.

---

## Secrets inventory

| Secret | Where | Exposure |
|---|---|---|
| `MONGODB_URI` | backend env | server only |
| `CLERK_SECRET_KEY` | backend env | server only |
| `CLERK_WEBHOOK_SECRET` | **missing in prod** | — |
| `ADMIN_JWT_SECRET` | backend env | server only |
| `SMTP_PASS` | backend env | server only |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | frontend build arg | **public by design** |
| `NEXT_PUBLIC_API_URL` | frontend build arg | **public by design** |

Both `NEXT_PUBLIC_*` values are inlined into the client bundle at build time. This is
correct — a Clerk publishable key and an API base URL are not secrets. The Dockerfile
carries a comment explaining why they must be build args rather than runtime env vars.

No private secret is exposed to the browser.

---

## Constraints for the refactor

Do not, without explicit approval:

- Replace Clerk or the JWT scheme
- Change bcrypt cost from 12
- Alter the 8-hour session lifetime
- Make admin login errors more specific
- Remove the dummy-hash comparison
- Loosen CORS or cookie settings for local-dev convenience
- Move any server secret behind a `NEXT_PUBLIC_` prefix
- Trust a client-side role check for a protected operation
- Log passwords, OTPs, tokens or registrant PII
