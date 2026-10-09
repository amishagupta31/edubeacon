# Route & Feature Inventory

Baseline captured 2026-10-06. Use this as the regression checklist: after any refactor,
every row must still behave identically.

---

## Public routes — 20

All render as static (`○`) in the Next.js build. None has a server-side data dependency.

| # | Route | Purpose | Key behaviour to preserve |
|---|---|---|---|
| 1 | `/` | Homepage | Ticker strip; hero carousel (4s auto-rotate, arrows, dots, pause-on-hover, 8s resume after manual click); stats; about; solutions grid + filters; featured vendors; curated meetings; awards; GSAP entrance; scroll-reveal |
| 2 | `/events` | Events hub | Cards linking to the four event types |
| 3 | `/events/conference` | Conference | **Countdown to 2026-10-25T09:00+05:30**; scroll-progress agenda rail; IntersectionObserver count-up stats; focus pillars; speakers; panels; round tables; awards; participating schools; embedded map iframe; FAQ accordion; sponsor logos; dual registration CTAs |
| 4 | `/events/conference/register` | **Shareable registration link** | Auto-opens registration modal ~400 ms after mount; OG + Twitter metadata; background video; benefits; venue + directions; sponsor logo |
| 5 | `/events/roadshows` | City roadshows | 6 city cards |
| 6 | `/events/roadshow` | *Duplicate of 5* | See issue A |
| 7 | `/events/roundtable` | Executive round tables | |
| 8 | `/events/round-table` | *Duplicate of 7* | See issue A |
| 9 | `/events/philanthropy` | Philanthropy & CSR | Impact stats; CSR tiers; donation form |
| 10 | `/solutions` | Solutions directory | Category filtering; vendor cards → interest modal |
| 11 | `/about/our-story` | About | |
| 12 | `/about/schools` | Schools | |
| 13 | `/about/vendors` | Vendors | |
| 14 | `/about/speakers` | Speakers | |
| 15 | `/about/sponsors` | Sponsors | Sponsorship tiers incl. magazine placements |
| 16 | `/about/news-stories` | News + magazine | `MagazineSection` (anchor `#magazine`) + testimonials |
| 17 | `/contact` | Contact | |
| 18 | `/register/educator` | **Broken** — see issue B | Form present, no `onSubmit` |
| 19 | `/register/partner` | **Broken** — see issue B | Form present, no `onSubmit` |
| 20 | `/admin` | Admin panel | Client-gated; see below |

**Layout note:** `SiteChrome` hides `SiteHeader`/`SiteFooter` on any path starting `/admin`.
Everything else renders inside them.

---

## Admin panel (`/admin`)

Single route; two views switched by sidebar state. Not server-protected — gating is
client-side only, which is safe because every data call is authorised server-side.

**Sign-in gate**
- Tab 1 **Password** — email + password → `POST /api/admin/auth/login` → JWT to `localStorage` (`eb_admin_token`)
- Tab 2 **Email OTP** — Clerk `signUp.create` → falls back to `signIn` for existing accounts → email code → `finalize()`
- `<div id="clerk-captcha">` present (required for Clerk bot protection)
- Show/hide password toggle; distinct errors for wrong password vs unknown email

**Records view** — four types (conference / vendor / interest / award)
- Sidebar nav with live counts per type
- Four stat cards with proportion bars; clickable to switch type
- Search across all fields; status filter pills
- **Sortable columns** — click to sort, click again to reverse. Type-aware: ISO dates
  chronologically, numerics numerically, text via `localeCompare`, blanks always last
- **Pagination** — page buttons with ellipsis gaps, first/prev/next/last, 10/25/50/100 per
  page, "Showing X–Y of Z". `#` column shows the **global** index, not per-page
- Page resets to 1 on search / filter / sort / tab change
- Inline status dropdown — optimistic update, then PATCH, then refresh counts
- Expandable row → every field in a grid with humanised labels
- **CSV export** of the currently filtered set
- Refresh button with spinner

**Ticker view**
- Live animated preview of the public strip
- Per-line text inputs; reorder ↑↓; delete; add (max 12)
- Badge text field (max 24 chars); enable/disable toggle
- Save and Restore Default

**Error states** — `Backend Offline` (fetch threw, shows API URL + retry) and
`Access Denied` (HTTP 403, shows the signed-in email)

---

## Registration workflows — 4

| Type | Auth | Trigger points | Collection | Statuses |
|---|---|---|---|---|
| Conference | **Clerk OTP required** | Homepage hero, conference page ×2, `/events/conference/register` | `conferenceregistrations` | pending → confirmed / cancelled |
| Vendor | Open | Homepage hero, conference page | `vendorregistrations` | pending → approved / rejected |
| Interest | Open | Vendor cards (passes `vendorName`) | `interestleads` | new → contacted → closed |
| Award | Open | Awards sections, agenda row | `awardnominations` | submitted → shortlisted → winner / not-selected |

All four are modals registered in `ModalProvider`; all four send a confirmation email.
Conference upserts on `clerkUserId` (re-submitting edits rather than duplicates) and emails
**only on first creation**.

---

## CLI scripts — 8

> The brief lists nine. There are **eight** npm scripts plus `DEFAULT_TICKER`, an exported
> constant in `models/SiteSetting.ts` rather than a script. Counting that as the ninth
> reconciles the two numbers.

| Command | Mutates | Notes |
|---|---|---|
| `npm run seed:admin -- <email> <password> ["Name"]` | **DB** | Upserts admin, bcrypt cost 12 |
| `npm run check:admin -- <email>` | no | Clerk account status |
| `npm run set:password -- <email> "<pw>"` | **Clerk** | Sets Clerk password |
| `npm run test:email -- <to> [type\|all]` | **sends mail** | Verifies SMTP then sends |
| `npm run preview:email` | writes files | → `backend/email-previews/*.html` |
| `npm run try:smtp -- [user] [pass] [host] [port]` | no | Credential check |
| `npm run try:brevo -- "<xkeysib-key>"` | no | Validates key, lists verified senders |
| `npm run mail:log -- "<key>" [recipient]` | no | Brevo delivery events |

`seed:admin`, `set:password` and `test:email` must never run against production without
intent. All read `backend/.env`.

---

## Email templates — 4

Each produces an HTML and a plain-text part from `lib/emailTemplates.ts`.

| Trigger | Subject |
|---|---|
| Conference | `Thank You for Your Registration – Principal Conclave on AI in School Education` |
| Vendor | `Thank You for Your Application – Principal Conclave on AI in School Education` |
| Interest | `Thank You for Your Interest – EduBeacon` |
| Award | `Nomination Received – Excellence in Education Awards` |

Shared shell: dark-green header, event block (date / time / full venue address / landmark),
optional static map image (only when `GOOGLE_MAPS_API_KEY` is set), "Get Directions" button,
the submitter's own details, closing line, and Dr. Amit Sehgal's signature block.

---

## Features with no backend

Present in the UI, not wired to anything:

- Magazine — "Read Latest Issue", "Advertise in the Magazine", "Read Article" (×4). Article
  list is the hardcoded `magazineArticles` array in `lib/data.ts`
- `/register/educator` and `/register/partner` forms
- Philanthropy donation form
- Contact page form *(not individually verified — assume unwired until checked)*
