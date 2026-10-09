# API Contracts

Every endpoint the Express backend exposes, as it behaves today. These shapes are the
contract the frontend depends on — a refactor must not change any of them without a
corresponding frontend change and explicit approval.

**Base URL:** `NEXT_PUBLIC_API_URL` (dev `http://localhost:4000`, prod the
`edubeacon-backend` Cloud Run URL)

---

## Authentication

Protected endpoints read `Authorization: Bearer <token>`, accepting **either**:

- an **admin JWT** from `POST /api/admin/auth/login` — `{ sub, email, kind: "admin" }`, 8 h
- a **Clerk session token** — verified via `CLERK_SECRET_KEY`

`requireAuth` accepts only a Clerk token. `requireAdmin` tries the admin JWT first, then
Clerk, and in both cases requires the email to exist in `admins` with `active: true`.

---

## Public

### `GET /health`
```json
{ "status": "ok" }
```

### `GET /api/settings/ticker`
```json
{ "enabled": true, "label": "Live", "items": ["...", "..."] }
```
Returns `DEFAULT_TICKER` if nothing is stored **and** if the read throws — this endpoint
never fails, by design, because the public site renders from it.

### `POST /api/registrations/vendor`
Required: `companyName`, `contactPerson`, `email`.
Also accepts `designation`, `phone`, `website`, `category`, `companyDescription`, `productDescription`.

| Code | Body |
|---|---|
| 200 | `{ "success": true, "id": "<ObjectId>" }` |
| 400 | `{ "error": "Missing required fields" }` |
| 500 | `{ "error": "Failed to save vendor registration" }` |

### `POST /api/registrations/interest`
Required: `name`, `email`. Also `school`, `designation`, `phone`, `requirement`, `vendorName`.
Responses as above (`"Failed to save interest lead"`).

### `POST /api/registrations/award`
Required: `category`, `nomineeName`, `nominatorEmail`. Also `nomineeOrg`, `reason`, `nominatorName`.
Responses as above (`"Failed to save award nomination"`).

### `POST /api/admin/auth/login`
```json
{ "email": "...", "password": "..." }
```

| Code | Body |
|---|---|
| 200 | `{ "token": "<jwt>", "admin": { "email", "name" } }` |
| 400 | `{ "error": "Email and password are required" }` |
| 401 | `{ "error": "Invalid email or password" }` |
| 429 | `{ "error": "Too many failed attempts. Try again in 15 minutes." }` |
| 500 | `{ "error": "Login failed" }` |

401 is returned identically for unknown email and wrong password, and a bcrypt comparison
runs in both cases. **Do not "improve" the error messages** — the ambiguity is the feature.

### `POST /api/webhooks/clerk`
Svix-signed. Handles `user.created`, `user.updated`, `user.deleted` → upserts `users`.

| Code | Body |
|---|---|
| 200 | `{ "received": true }` |
| 400 | `{ "error": "Missing svix headers" }` / `{ "error": "Invalid webhook signature" }` |
| 500 | `{ "error": "Webhook secret not configured" }` |

> **Currently returns 500 in production** — `CLERK_WEBHOOK_SECRET` is not set by CI.

---

## Authenticated (`requireAuth` — Clerk token only)

### `POST /api/registrations/conference`
Upserts on `clerkUserId` from the token. Body is the full registration object.

| Code | Body |
|---|---|
| 200 | `{ "success": true, "id": "<ObjectId>" }` |
| 401 | `{ "error": "Unauthorized" }` / `{ "error": "Invalid or expired session token" }` |
| 500 | `{ "error": "Failed to save registration" }` |

**Ordering matters:** the route reads the existing record, upserts, **responds**, and only
then dispatches the email — and only when no prior record existed. Any refactor must keep
the response before the email and keep the first-time-only condition.

### `GET /api/registrations/conference`
Returns the caller's own record, or `null`. Never another user's.

---

## Admin (`requireAdmin`)

### `GET /api/admin/registrations`
Without `?type` — counts:
```json
{ "conference": 1, "vendor": 1, "interest": 0, "award": 0 }
```
With `?type=conference|vendor|interest|award` — a plain JSON **array** of full documents
(not wrapped in an envelope). Sorting, filtering and pagination are **client-side**; the
endpoint returns everything.

### `PATCH /api/admin/registrations`
```json
{ "type": "conference", "id": "<ObjectId>", "status": "confirmed" }
```

### `PUT /api/settings/ticker`
```json
{ "enabled": true, "label": "Live", "items": ["line 1", "line 2"] }
```
Server sanitises: trims each item, caps at 160 chars, drops blanks, caps at 12 items, label
capped at 24 chars and defaults to `"Live"`. Rejects with 400 if no item survives.

Returns `{ "success": true, "value": {...}, "updatedAt": "..." }`.

### `POST /api/settings/ticker/reset`
Restores `DEFAULT_TICKER`. Returns `{ "success": true, "value": {...} }`.

---

## Error-shape convention

Every error is `{ "error": "<human-readable string>" }`. There are no error codes, no
`details` array, no field-level validation messages. The frontend displays `body.error`
directly.

Introducing a richer error envelope would be an improvement but is a **breaking contract
change** and needs approval.

---

## CORS

```js
origin: (process.env.FRONTEND_URL ?? "http://localhost:3000").split(",").map(s => s.trim())
credentials: true
```

Production value: `https://edubeacon.co.in,https://www.edubeacon.co.in`

`credentials: true` is set but unused — auth travels in the `Authorization` header, not
cookies. Harmless; worth knowing if cookie auth is ever introduced.

---

## Middleware order (`index.ts`)

1. CORS
2. `express.raw()` on `/api/webhooks` + manual `JSON.parse` — **must stay before
   `express.json()`**, because svix signature verification needs the raw body
3. `express.json()`
4. `/health`
5. Routers

Reordering 2 and 3 silently breaks webhook signature verification.
