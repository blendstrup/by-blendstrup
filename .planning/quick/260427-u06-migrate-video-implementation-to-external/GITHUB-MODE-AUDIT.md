# Keystatic GitHub Mode Audit

**Date:** 2026-04-27
**Auditor:** Claude (automated analysis)
**Scope:** Readiness of the By Blendstrup Next.js project to switch Keystatic from `local` to `github` storage mode.

---

## Summary Table

| # | Area | Status | Action Required |
|---|------|--------|-----------------|
| 1 | Storage mode switch — env var wiring | FAIL | Fix two env var name mismatches before switching |
| 2 | Required GitHub/Keystatic env vars | WARN | Vars are listed in `.env.local` but not yet set; must be provisioned in Vercel |
| 3 | API route handler (`/api/keystatic`) | PASS | Correct handler, correct runtime |
| 4 | Admin page runtime | PASS | Both page and layout export `runtime = "nodejs"` |
| 5 | Middleware — could it block `/keystatic/*`? | FAIL | Custom HMAC auth blocks the GitHub OAuth callback; must be patched before switching |
| 6 | `generateStaticParams` compatibility | PASS | Compatible with GitHub storage |
| 7 | Overall readiness verdict | NOT READY | Fix items 1 and 5 first |

---

## 1. Storage Mode Switch

**File:** `keystatic.config.ts` (lines 4–14)

```ts
const storage =
  process.env.KEYSTATIC_STORAGE_KIND === "github"
    ? ({
        kind: "github",
        repo: {
          owner: process.env.GITHUB_REPO_OWNER!,
          name: process.env.GITHUB_REPO_NAME!,
        },
      } as const)
    : ({ kind: "local" } as const);
```

**Verdict: FAIL — two env var name mismatches**

### Mismatch 1: Storage kind trigger

| Where | Env var name |
|-------|-------------|
| `keystatic.config.ts` reads | `KEYSTATIC_STORAGE_KIND` |
| `.env.local` defines | `NEXT_PUBLIC_KEYSTATIC_STORAGE_KIND` |

The `NEXT_PUBLIC_` prefix makes the variable available to the browser bundle. Server-side code (like `keystatic.config.ts`, which runs in the Node.js context) will receive `undefined` when reading `process.env.KEYSTATIC_STORAGE_KIND` because the actual env var is named `NEXT_PUBLIC_KEYSTATIC_STORAGE_KIND`. **The storage mode switch will never activate.**

**Fix:** Either rename the env var in `.env.local` to `KEYSTATIC_STORAGE_KIND` (and in Vercel environment variables), or update `keystatic.config.ts` to read `process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE_KIND`. The former is preferred — there is no reason to expose the storage backend choice to the browser.

### Mismatch 2: GitHub repo owner and name

| Where | Env var name |
|-------|-------------|
| `keystatic.config.ts` reads | `GITHUB_REPO_OWNER` |
| `.env.local` defines | `NEXT_PUBLIC_GITHUB_REPO_OWNER` |
| `keystatic.config.ts` reads | `GITHUB_REPO_NAME` |
| `.env.local` defines | `NEXT_PUBLIC_GITHUB_REPO_NAME` |

Same issue — the `NEXT_PUBLIC_` prefix means `process.env.GITHUB_REPO_OWNER` will be `undefined` at runtime. The `!` non-null assertion will pass TypeScript but the value will be `undefined`, causing Keystatic's GitHub storage to be misconfigured.

**Fix:** Rename to `GITHUB_REPO_OWNER` and `GITHUB_REPO_NAME` in `.env.local` and in Vercel environment variables (no `NEXT_PUBLIC_` prefix needed — these are server-only values).

---

## 2. Required Env Vars for GitHub Mode

Keystatic GitHub storage requires three additional secrets beyond the repo coordinates:

| Env var | Purpose | In `keystatic.config.ts`? | In `.env.local`? |
|---------|---------|--------------------------|-----------------|
| `KEYSTATIC_GITHUB_CLIENT_ID` | OAuth app client ID | Not referenced (Keystatic reads internally) | Yes (key present, value not set) |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | OAuth app client secret | Not referenced (Keystatic reads internally) | Yes (key present, value not set) |
| `KEYSTATIC_SECRET` | Signs Keystatic session tokens | Not referenced (Keystatic reads internally) | Yes (key present, value not set) |

**Verdict: WARN**

The keys are inventoried in `.env.local` as placeholders. Before enabling GitHub mode you must:

1. Create a GitHub OAuth App at `https://github.com/settings/developers`:
   - Homepage URL: your Vercel deployment URL
   - Callback URL: `https://your-domain.vercel.app/api/keystatic/github/oauth/callback`
2. Copy the Client ID and Client Secret into Vercel environment variables.
3. Generate a random secret (e.g. `openssl rand -hex 32`) for `KEYSTATIC_SECRET`.

These vars are read by `@keystatic/next` internally — no changes to `keystatic.config.ts` are needed for these three.

---

## 3. API Route Handler

**File:** `src/app/api/keystatic/[...params]/route.ts`

```ts
export const runtime = "nodejs"

import { makeRouteHandler } from "@keystatic/next/route-handler"
import config from "../../../../../keystatic.config"

export const { GET, POST } = makeRouteHandler({ config })
```

**Verdict: PASS**

- `runtime = "nodejs"` is correctly exported — the route will not run on the Edge runtime.
- `makeRouteHandler` from `@keystatic/next/route-handler` is the correct import.
- The path `/api/keystatic/[...params]` matches the expected route for Keystatic's API, including the GitHub OAuth callback at `/api/keystatic/github/oauth/callback`.

---

## 4. Admin Page Runtime

**File:** `src/app/keystatic/[[...params]]/page.tsx`

```ts
export const runtime = "nodejs"
```

**File:** `src/app/keystatic/layout.tsx`

```ts
export const runtime = "nodejs"
```

**Verdict: PASS**

Both the admin page and its layout correctly export `runtime = "nodejs"`. The Keystatic admin UI requires the Node.js runtime because it uses Node-specific APIs for local file access (in local mode) and for OAuth handling (in GitHub mode).

---

## 5. Middleware — Could It Block `/keystatic/*`?

**File:** `src/middleware.ts`

```ts
export const config = {
  matcher: ["/keystatic", "/keystatic/:path*"],
}
```

The middleware implements custom HMAC cookie authentication. **Any request to `/keystatic` or `/keystatic/:path*` that does not carry a valid `admin_session` cookie is redirected to `/admin-login`.**

**Verdict: FAIL — GitHub OAuth callback will be blocked**

### The problem

When GitHub mode is enabled, Keystatic performs an OAuth flow:

1. The CMS editor is redirected to GitHub to authorize.
2. GitHub redirects back to: `/api/keystatic/github/oauth/callback?code=...`

The OAuth callback path is `/api/keystatic/...`, which is **not** in the middleware matcher — so the callback itself is fine.

However, there is a second problem: the Keystatic admin UI at `/keystatic` initiates the OAuth flow. The HMAC middleware intercepts all `/keystatic/*` requests and requires a valid session cookie. **A fresh browser session without the cookie will be redirected to `/admin-login` before Keystatic can serve its UI or redirect to GitHub.**

In local mode this is acceptable — the developer is already logged in. In GitHub mode on Vercel, the intended workflow is:

- Owner visits `your-domain.vercel.app/keystatic`
- Keystatic redirects to GitHub OAuth
- GitHub redirects back; Keystatic sets its own session
- Owner edits content

With the current middleware, step 1 is blocked unless the owner first authenticates via `/admin-login`. This is not necessarily wrong — the admin login gate is intentional — but it means **the owner must know to visit `/admin-login` first**, and the `ADMIN_USERNAME` / `ADMIN_PASSWORD` env vars must be set in Vercel as well.

### Assessment

The middleware does NOT block the OAuth callback (`/api/keystatic/...` is not in the matcher). The admin login gate at `/keystatic` is intentional and will work in GitHub mode, provided:

- `ADMIN_USERNAME` and `ADMIN_PASSWORD` are set in Vercel environment variables.
- The owner knows to authenticate at `/admin-login` before accessing `/keystatic`.

**No code change is required**, but this flow must be documented for the owner.

---

## 6. `generateStaticParams` Compatibility

**File:** `src/app/(site)/gallery/[slug]/page.tsx`

```ts
export async function generateStaticParams() {
  const reader = createReader(process.cwd(), keystaticConfig)
  const works = await reader.collections.works.all()
  return works.filter((w) => w.entry.published).map((w) => ({ slug: w.slug }))
}
```

**Verdict: PASS**

`generateStaticParams` uses the Keystatic Reader API (`createReader`), which reads content from the local file system at build time. In GitHub storage mode, content changes are committed to GitHub, and Vercel triggers a new build. At build time the files are present on disk — the Reader API works identically regardless of whether the storage mode is `local` or `github`. No changes required.

---

## 7. Overall Readiness Verdict

**Status: NOT READY — two blockers must be fixed first.**

### Blocker 1 (FAIL): Env var name mismatches

The storage mode switch will never activate because `keystatic.config.ts` reads env vars without the `NEXT_PUBLIC_` prefix, but `.env.local` (and presumably Vercel) define them with it.

**Required action:**
1. In `.env.local`, rename:
   - `NEXT_PUBLIC_KEYSTATIC_STORAGE_KIND` → `KEYSTATIC_STORAGE_KIND`
   - `NEXT_PUBLIC_GITHUB_REPO_OWNER` → `GITHUB_REPO_OWNER`
   - `NEXT_PUBLIC_GITHUB_REPO_NAME` → `GITHUB_REPO_NAME`
2. Apply the same renames in Vercel → Settings → Environment Variables.
3. Set `KEYSTATIC_STORAGE_KIND=github` in the Vercel Production environment.

### Blocker 2 (WARN → resolved by documentation): Admin login flow

The middleware correctly gates `/keystatic`. In GitHub mode, the owner must log in via `/admin-login` before Keystatic's UI is accessible. Document this in the owner handoff guide.

### Items already correct (PASS)

- API route handler: correct import, correct runtime, correct path.
- Admin page and layout: both export `runtime = "nodejs"`.
- `generateStaticParams`: compatible with GitHub storage.
- OAuth callback path (`/api/keystatic/...`): not blocked by middleware.

### Step-by-step: Enabling GitHub mode

1. **Rename env vars** (see Blocker 1 above) in `.env.local` and in Vercel.
2. **Create a GitHub OAuth App:**
   - Go to `https://github.com/settings/developers` → OAuth Apps → New OAuth App.
   - Application name: `By Blendstrup CMS`
   - Homepage URL: `https://your-vercel-domain.vercel.app`
   - Authorization callback URL: `https://your-vercel-domain.vercel.app/api/keystatic/github/oauth/callback`
   - Copy Client ID and Client Secret.
3. **Set Vercel environment variables** (Production only):
   - `KEYSTATIC_STORAGE_KIND=github`
   - `GITHUB_REPO_OWNER=<your-github-username>`
   - `GITHUB_REPO_NAME=<your-repo-name>`
   - `KEYSTATIC_GITHUB_CLIENT_ID=<from step 2>`
   - `KEYSTATIC_GITHUB_CLIENT_SECRET=<from step 2>`
   - `KEYSTATIC_SECRET=<openssl rand -hex 32>`
   - `ADMIN_USERNAME=<chosen username>`
   - `ADMIN_PASSWORD=<chosen password>`
4. **Redeploy** on Vercel (trigger manually or push a commit).
5. **Test:** Visit `https://your-vercel-domain.vercel.app/admin-login`, log in, then navigate to `/keystatic`. Verify the GitHub OAuth flow completes and content can be edited and saved (which creates a git commit on the repo).

### Note on local MP4 files

The directory `public/videos/gallery/` contains MP4 files committed to the repository (approximately 65 MB). These should be removed from git once the owner has re-hosted the videos on YouTube or Vimeo and updated the CMS video URL fields. Do NOT delete them before the owner has the external URLs ready. Once removed, run:

```bash
git rm public/videos/gallery/*.mp4
git commit -m "chore: remove local video files — now hosted externally"
```

Also check `public/videos/works/` and `public/videos/hero/` for any committed video files and remove those the same way.
