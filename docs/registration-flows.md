# Registration Flows

End-to-end traces from form submission through validation, persistence, email and UI
response. These sequences are the behaviour a refactor must preserve exactly.

---

## 1. Conference registration — the only authenticated flow

**Component:** `components/modals/SchoolRegistrationModal.tsx`

```
User enters email
   │
   ├─ clerk.session exists and matches this email? ──────── yes ─→ mark verified, skip OTP
   │
   ├─ signUp.create({ emailAddress })
   │     ├─ error "session_exists"          → clerk.signOut() → retry create
   │     ├─ error "form_identifier_exists"  → EXISTING USER PATH
   │     │       signIn.create({ identifier })
   │     │       signIn.emailCode.sendCode()          → mode = "signin"
   │     └─ no error                        → NEW USER PATH
   │             signUp.password({ random })          ← only if missingFields includes it
   │             signUp.verifications.sendEmailCode() → mode = "signup"
   │
   ├─ User enters 6-digit code
   │     signin → signIn.emailCode.verifyCode() → signIn.finalize()
   │     signup → signUp.verifications.verifyEmailCode() → signUp.finalize()
   │
   ├─ emailVerified = true, rest of the form unlocks
   │
   └─ Submit
         getToken()                                    ← Clerk session token
         POST /api/registrations/conference  Bearer <token>
              │
              requireAuth → verifyToken() → req.userId = payload.sub
              │
              existing = findOne({ clerkUserId })      ← checked BEFORE the write
              findOneAndUpdate({ clerkUserId }, {...}, { upsert: true })
              │
              res.json({ success: true, id })          ← RESPONDS HERE
              │
              if (!existing && registration.email)     ← first registration only
                  void sendMail(conferenceEmail(...))  ← not awaited
```

**Four invariants:**

1. **Upsert on `clerkUserId`** — one record per Clerk account. Re-submitting edits.
2. **`existing` is read before the upsert** — this is what makes "email only on first
   registration" work. Reading it after would always find a record and never email.
3. **Response is sent before `sendMail`** — SMTP latency never delays the user.
4. **`void sendMail(...)` is deliberately not awaited** — a mail failure cannot turn a saved
   registration into an error response.

A random password is generated for Clerk sign-up because the instance has password auth
enabled and requires one. Side effect: every OTP-created account has an unknown password.
Harmless for registrants; relevant for admins, who should set one via `seed:admin`.

---

## 2 / 3 / 4. Vendor · Interest · Award — open flows

Structurally identical, differing only in fields and endpoint.

```
User fills form → handleSubmit
   │
   POST /api/registrations/{vendor|interest|award}
   │     (no Authorization header)
   │
   ├─ required-field check → 400 on failure
   ├─ Model.create(req.body)
   ├─ res.json({ success: true, id })        ← RESPONDS HERE
   └─ void sendMail(...)                      ← after response, not awaited
   │
Frontend: finally { setIsSubmitting(false); setSubmitted(true) }
```

**Known weakness, unchanged:** the frontend `finally` block sets `submitted = true`
regardless of outcome. A network failure or a 400 still shows the success screen. The error
is logged to console only.

This is how the live site behaves today and is **not** being changed in this phase. It is
logged in the risk register as a candidate fix.

**Field mapping quirks to preserve:**
- Interest: frontend `message` → backend `requirement`; `vendorName` injected from modal meta
- Award: frontend `awardCategory` → backend `category`; `nomineeDesignation` and
  `nominatorPhone` are collected but **never sent**

---

## Email dispatch

```
sendMail({ to, subject, html, text })
   │
   getTransporter()                     ← memoised; null when SMTP env is incomplete
   │
   ├─ null  → log "[mail] SKIPPED", return false
   │
   └─ transporter.sendMail({ from: MAIL_FROM, replyTo: MAIL_REPLY_TO, ... })
         ├─ success → "[mail] SENT   <to> | <subject> (Nms)"   green
         └─ throw   → "[mail] FAILED <to> | <subject>"          red
                      "       reason: <translated>"
```

`sendMail` **never throws**. It returns a boolean nobody checks, because callers invoke it
with `void`.

Error codes are translated to plain language: `535`/`EAUTH` → credentials;
`ECONNECTION`/`ETIMEDOUT`/`ESOCKET` → unreachable; `550`/`553` → sender not authorised;
`554` → rejected as spam.

At startup `reportMailStatus()` prints `READY` / `NOT WORKING` / `DISABLED`, so a
misconfiguration surfaces on boot rather than on the first registration.

**A caveat worth recording:** SMTP accepting a message is not delivery. Brevo returns `250
OK` at handoff and can still reject internally — this exact failure occurred during
development when `MAIL_FROM` was an unverified sender. `[mail] SENT` therefore means
"handed to the relay", not "landed in the inbox". `npm run mail:log` queries Brevo for the
true outcome.

---

## Status lifecycles

| Type | Default | Transitions |
|---|---|---|
| Conference | `pending` | → confirmed / cancelled |
| Vendor | `pending` | → approved / rejected |
| Interest | `new` | → contacted → closed |
| Award | `submitted` | → shortlisted → winner / not-selected |

Enforced by Mongoose `enum`. Any value is reachable from any other — there is no state
machine, and the admin UI offers every option at every point. Intentional.

---

## Refactoring hazards

| Hazard | Consequence |
|---|---|
| Moving `sendMail` before `res.json` | SMTP latency added to every registration response |
| `await`ing `sendMail` | Mail outage turns saved registrations into 500s |
| Reading `existing` after the upsert | Duplicate confirmation emails on every edit |
| Changing the upsert key off `clerkUserId` | Duplicate conference records per user |
| "Fixing" the login error messages | Enables email enumeration |
| Reordering `express.raw` / `express.json` | Webhook signature verification breaks |
| Adding caching to admin reads | Stale registration data shown to admins |
