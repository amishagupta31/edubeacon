# Production Deployment — GCP Cloud Run

This documents how Clerk's keys are supplied in production and exactly what
GCP configuration is required. No Clerk middleware/auth code was touched —
this is deploy-time configuration only.

## Why this isn't a code change

`CLERK_SECRET_KEY` is never read anywhere in this app's own source. It is
read exactly once, internally, by the `@clerk/nextjs` package
(`server/constants.js`, a synchronous top-level `process.env.CLERK_SECRET_KEY`
read at server start-up) — used by `<ClerkProvider>` in
[`src/app/layout.tsx`](src/app/layout.tsx). Clerk's SDK has no supported hook
to supply this value asynchronously (e.g. by awaiting a Secret Manager call
inside app code); it must simply already be a real environment variable on
the process before it starts serving requests.

Cloud Run's native Secret Manager integration does exactly that: GCP's
control plane fetches the secret value using IAM (not app code) and injects
it into the container's environment before your first request is served —
functionally "fetching the secret from Secret Manager," with zero
application code involved, the secret never touching source control, build
logs, or the Docker image, and centralized rotation/revocation. This is the
standard, supported pattern for this exact situation and is why the fix
below is entirely `gcloud`/Secret Manager configuration, not a code change.

`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is different: Next.js inlines every
`NEXT_PUBLIC_*` reference into the JS bundle **at `next build` time**
(confirmed in the bundled Next.js docs — see
`node_modules/next/dist/docs/01-app/02-guides/environment-variables.md`).
Setting it only as a Cloud Run *runtime* env var has no effect, since the
client bundle is already built by then. The [Dockerfile](Dockerfile) builder
stage previously had no way to receive it — that was the actual root cause
of the "Clerk deployment error" (the deployed client bundle was shipping
with an empty publishable key). It's now accepted as a Docker build arg
(`ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`) and is safe to pass as a plain
build parameter since it is not a secret, per Clerk's own docs.

**Nothing in `src/` changed.** Login/session/redirect/protected-route
behavior (currently: the inline email-verification flow inside
[`SchoolRegistrationModal.tsx`](src/components/modals/SchoolRegistrationModal.tsx),
scoped only to conference registration — this app has no sitewide
middleware, no `getAuth()`/`clerkClient()` usage, and no dashboard/protected
routes today) is unchanged because nothing that drives it was touched.

## One-time GCP setup

```bash
PROJECT_ID="your-gcp-project-id"
REGION="asia-south1"                 # pick your Cloud Run region
SERVICE="edubeacon"
RUN_SA="edubeacon-run@${PROJECT_ID}.iam.gserviceaccount.com"

# 1. Enable required APIs
gcloud services enable \
  run.googleapis.com \
  secretmanager.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  --project="$PROJECT_ID"

# 2. Create a dedicated runtime service account for the Cloud Run service
#    (don't use the default compute SA in production)
gcloud iam service-accounts create edubeacon-run \
  --display-name="EduBeacon Cloud Run runtime SA" \
  --project="$PROJECT_ID"

# 3. Store the Clerk secret key in Secret Manager (do this once; rotate via
#    `gcloud secrets versions add` later, never by editing app code)
printf '%s' 'sk_live_xxxxxxxxxxxxxxxxxxxxxxxx' | \
  gcloud secrets create clerk-secret-key \
    --data-file=- \
    --replication-policy="automatic" \
    --project="$PROJECT_ID"

# 4. Grant ONLY the Cloud Run runtime service account access to that secret
gcloud secrets add-iam-policy-binding clerk-secret-key \
  --member="serviceAccount:${RUN_SA}" \
  --role="roles/secretmanager.secretAccessor" \
  --project="$PROJECT_ID"

# 5. Artifact Registry repo for the image
gcloud artifacts repositories create edubeacon \
  --repository-format=docker \
  --location="$REGION" \
  --project="$PROJECT_ID"
```

`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is **not** a secret (Clerk's own docs
say so explicitly) — it does not need Secret Manager or IAM. It's passed
straight as a build/deploy parameter below.

## Build (bakes the publishable key into the client bundle)

```bash
IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/edubeacon/${SERVICE}:$(git rev-parse --short HEAD)"

docker build \
  --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_xxxxxxxxxxxxxxxxxxxxxxxx" \
  -t "$IMAGE" .

docker push "$IMAGE"
```

Or via Cloud Build, using [`cloudbuild.yaml`](cloudbuild.yaml):

```bash
gcloud builds submit \
  --config=cloudbuild.yaml \
  --substitutions=_REGION="$REGION",_SERVICE="$SERVICE",_AR_REPO=edubeacon,_RUN_SA="$RUN_SA",_CLERK_PUBLISHABLE_KEY="pk_live_xxxxxxxxxxxxxxxxxxxxxxxx" \
  --project="$PROJECT_ID"
```

## Deploy (injects the secret key from Secret Manager at runtime)

```bash
gcloud run deploy "$SERVICE" \
  --image="$IMAGE" \
  --region="$REGION" \
  --service-account="$RUN_SA" \
  --update-secrets=CLERK_SECRET_KEY=clerk-secret-key:latest \
  --update-env-vars=NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_xxxxxxxxxxxxxxxxxxxxxxxx" \
  --allow-unauthenticated \
  --project="$PROJECT_ID"
```

`--update-secrets=CLERK_SECRET_KEY=clerk-secret-key:latest` mounts the
Secret Manager secret `clerk-secret-key` as the `CLERK_SECRET_KEY`
environment variable on the running container — the value is never written
to the image, a Dockerfile, `cloudbuild.yaml`, or source control. Use
`:latest` to always track the newest version, or pin an explicit version
number (`:3`) if you want rotations to require a redeploy.

## Rotating the secret later

```bash
printf '%s' 'sk_live_NEW_VALUE' | \
  gcloud secrets versions add clerk-secret-key --data-file=- --project="$PROJECT_ID"

# If pinned to :latest, a new revision picks it up automatically on the next
# deploy; force one immediately with:
gcloud run services update "$SERVICE" --region="$REGION" --project="$PROJECT_ID"
```

## Local development

Unchanged — `.env.local` (already gitignored) continues to hold both keys
for `next dev`, exactly as before.
