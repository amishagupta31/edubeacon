# Deployment & Environment

---

## Topology

Two independent Cloud Run services, already separated. Built from two Dockerfiles, deployed
by one GitHub Actions workflow on push to `main`.

```
                    push to main
                         │
          ┌──────────────┴──────────────┐
          │                             │
   deploy-backend                deploy-frontend
   (runs first)                  (needs: deploy-backend)
          │                             │
   edubeacon-backend  ◄── HTTP ──  edubeacon
   port 4000                       port 3000
          │
   MongoDB Atlas · Clerk · Brevo
```

**Project** `edubeacon` · **Region** `asia-southeast1` · **Registry** `edubeacon-repo`
**Domain** `edubeacon.co.in` (+ `www`)

Both services: 512 Mi / 1 CPU, min 0 / max 3 instances, `--allow-unauthenticated`.

`min-instances 0` means cold starts. For the backend that includes establishing the MongoDB
connection, so the first request after idle is noticeably slower.

---

## CI/CD — `.github/workflows/deploy.yml`

Auth to GCP uses Workload Identity Federation via `WIF_PROVIDER` / `WIF_SERVICE_ACCOUNT`.
No static service-account keys.

**Backend job:** checkout → auth → `docker build ./backend` → push → `gcloud run deploy`
with `--set-env-vars` using `^##^` as the delimiter (so values may contain commas —
necessary for the comma-separated `FRONTEND_URL`).

**Frontend job:** same, but passes two `--build-arg` values because `NEXT_PUBLIC_*` must be
present at build time.

### Critical: build-time vs runtime variables

`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `NEXT_PUBLIC_API_URL` are **inlined into the client
bundle during `next build`**. Setting them as Cloud Run runtime env vars has **no effect** —
the bundle is already compiled.

Changing either requires a rebuild, not a redeploy. The frontend Dockerfile documents this.

---

## Environment variables

### Backend

| Variable | Required | Set by CI | Purpose |
|---|---|---|---|
| `PORT` | — | Cloud Run | Defaults 4000 |
| `MONGODB_URI` | **yes** | ✅ | Atlas connection |
| `CLERK_SECRET_KEY` | **yes** | ✅ | Verifies Clerk tokens |
| `CLERK_WEBHOOK_SECRET` | for webhooks | ❌ **MISSING** | svix verification |
| `ADMIN_JWT_SECRET` | **yes** | ✅ | Signs admin JWTs (min 32 chars) |
| `FRONTEND_URL` | **yes** | ✅ | CORS allowlist, comma-separated |
| `SMTP_HOST` / `PORT` / `USER` / `PASS` | for email | ✅ | Brevo relay |
| `MAIL_FROM` | for email | ✅ | **Must be a Brevo-verified sender** |
| `MAIL_REPLY_TO` | no | ✅ | Reply address |
| `ADMIN_EMAILS` | **no — dead** | ✅ | No longer read by `requireAdmin` |
| `GOOGLE_MAPS_API_KEY` | no | ❌ | Enables static map in emails |

### Frontend

| Variable | Required | Stage |
|---|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | **yes** | **build** |
| `NEXT_PUBLIC_API_URL` | **yes** | **build** |

### Two defects

1. **`CLERK_WEBHOOK_SECRET` is absent** → `/api/webhooks/clerk` returns 500 for every
   delivery. Clerk retries, then stops. `users` is not synced.
2. **`ADMIN_EMAILS` is still deployed** but unused. Editing it changes nothing.

---

## Local development

```bash
# terminal 1
cd edubeacon/backend
npm install
cp .env.example .env     # then fill in
npm run dev              # :4000

# terminal 2
cd edubeacon/frontend
npm install
npm run dev              # :3000, or 3002 if taken
```

Both must run. The frontend calls the backend for ticker content, all registrations, and
the entire admin panel.

**If the dev server picks a different port** (3002 when 3000 is busy), add it to
`FRONTEND_URL` in `backend/.env` or CORS will block every request.

**Startup tells you the mail status:**
```
[mail] READY       - user@host via smtp-relay.brevo.com
[mail] NOT WORKING - ... (registrations will still save)
[mail] DISABLED    - missing SMTP_PASS in .env (emails will be skipped)
```

### Dev-only gotchas observed

- **Stale processes serve stale env.** `ts-node-dev` watches `.ts` files, not `.env`. After
  editing `.env`, fully restart. A stale process caused a confusing 500 during development.
- **PowerShell 5.1 mangles UTF-8.** Posting JSON with `·` or `–` via `Invoke-RestMethod`
  corrupts the characters. Use the browser or a UTF-8-capable client when testing content.

---

## Docker images

Both are multi-stage, Alpine, non-root (uid 1001), and reasonably lean.

**Backend:** `builder` (npm ci + tsc) → `prod-deps` (`npm ci --omit=dev`) → `runner`
(node_modules + dist + package.json). Runs `node dist/index.js`.

**Frontend:** `deps` → `builder` (`next build` with build args) → `runner` (public +
`.next/standalone` + `.next/static`). Runs `node server.js`. Relies on
`output: "standalone"` in `next.config.ts` — **do not remove that setting**, the image
depends on it.

---

## Health checks

`GET /health` → `{"status":"ok"}`. Returns 200 whenever the process is up.

**It does not check MongoDB.** The connection is established before `listen()`, so a dead
database means the process never starts and never serves `/health` at all — the signal is
indirect but functional. A connection lost *after* startup would still report healthy.

The frontend has no health endpoint; Cloud Run uses TCP readiness on port 3000.

---

## Rollback

Each deploy creates a new Cloud Run revision tagged with the commit SHA.

```bash
gcloud run revisions list --service edubeacon-backend --region asia-southeast1
gcloud run services update-traffic edubeacon-backend \
    --region asia-southeast1 --to-revisions <REVISION>=100
```

Same for `edubeacon`. **Record the current good revision of both services before any
refactor deploy.**

Caveat: if frontend and backend revisions must match (e.g. after an API contract change),
roll both back together. Keeping contracts backward-compatible avoids this entirely — which
is why the refactor should not change response shapes.

---

## Observations for the refactor

1. **Separation is complete.** The remaining work is code organisation, not topology.
2. **No staging environment exists.** `main` deploys straight to production. A staging
   service would make refactor verification far safer, and costs nothing at
   `min-instances 0`.
3. **No smoke test after deploy.** CI prints the service URL but never calls it. A single
   `curl /health` step would catch a broken deploy immediately.
4. **Frontend waits on backend unnecessarily.** `needs: deploy-backend` means a backend
   failure blocks a frontend-only change. Reasonable while contracts are in flux; worth
   revisiting.
5. **Repo-level files live inside `frontend/`** — `README.md`, `DEPLOYMENT.md`, `CLAUDE.md`,
   `AGENTS.md`, `cloudbuild.yaml`, `conference-page-content.csv`. They are not
   frontend-specific. `cloudbuild.yaml` may be superseded by the Actions workflow; it was
   not inspected for active use and **must not be deleted without checking**.
