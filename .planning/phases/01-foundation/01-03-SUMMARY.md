---
phase: 01-foundation
plan: "03"
subsystem: cms
tags: [keystatic, cms, admin-ui, content, yaml, github-storage, env-vars]

dependency_graph:
  requires:
    - phase: 01-02
      provides: next-intl middleware with /keystatic exclusion pattern
  provides:
    - keystatic-admin-ui-local
    - keystatic-settings-singleton
    - github-storage-config
    - env-vars-documented
  affects: [01-04, works-collection, homepage-singleton, about-singleton, custom-orders-singleton]

tech-stack:
  added:
    - "@keystatic/core"
    - "@keystatic/next"
  patterns:
    - Environment-based storage switching via KEYSTATIC_STORAGE_KIND env var
    - Keystatic admin route uses Node.js runtime (export const runtime = 'nodejs')
    - Keystatic admin layout wraps with html/body shell to satisfy Next.js html structure requirement
    - Keystatic excluded from next-intl middleware matcher via negative lookahead
    - content/ directory stores YAML singletons committed to git (git-based CMS pattern)

key-files:
  created:
    - keystatic.config.ts
    - src/app/keystatic/layout.tsx
    - src/app/keystatic/[[...params]]/page.tsx
    - src/app/keystatic/[[...params]]/keystatic.tsx
    - src/app/api/keystatic/[...params]/route.ts
    - .env.local.example
  modified:
    - src/middleware.ts

key-decisions:
  - "GitHub deploy loop (Keystatic Cloud + Vercel env vars) deferred — requires owner to create Keystatic Cloud project; local admin UI verified working"
  - "Keystatic layout wraps children in html/body shell to satisfy Next.js App Router missing-html-body error, while inner locale layout still owns the real html/body"

patterns-established:
  - "Keystatic route: always set export const runtime = 'nodejs' on layout, page, and API route"
  - "Storage switching: KEYSTATIC_STORAGE_KIND=github for production, unset/local for dev"
  - ".env.local.example documents all env vars — never commit actual secrets"

requirements-completed:
  - I18N-03

duration: 25min
completed: "2026-04-18"
---

# Phase 1 Plan 03: Keystatic CMS Setup Summary

**Keystatic Admin UI at /keystatic with settings singleton (siteTitle), environment-based local/GitHub storage switching, and env var documentation; local edit loop verified by owner, GitHub deploy loop deferred pending Keystatic Cloud setup.**

## Performance

- **Duration:** ~25 min
- **Started:** 2026-04-18T10:15:00Z
- **Completed:** 2026-04-18T10:40:00Z
- **Tasks:** 2 (Task 1 auto, Task 2 checkpoint — local portion verified)
- **Files modified:** 7

## Accomplishments

- Keystatic installed and configured with `settings` singleton (siteTitle field, YAML storage, "By Blendstrup" branding)
- Admin UI accessible at /keystatic in local dev with Node.js runtime correctly forced
- Storage mode switches between `local` (dev) and `github` (production) via `KEYSTATIC_STORAGE_KIND` env var
- All required environment variables documented in `.env.local.example`
- next-intl middleware updated to exclude `/keystatic` and `/api/keystatic` paths
- Owner verified: admin UI loads, Site Settings visible, siteTitle field editable

## Task Commits

Each task was committed atomically:

1. **Task 1: Install Keystatic with settings singleton, Admin UI, API routes** - `ecd3478` (feat)
2. **Fix: Add html/body shell to keystatic layout** - `6afc9d5` (fix)

**Plan metadata:** (this commit)

## Files Created/Modified

- `keystatic.config.ts` - Keystatic config with environment-based storage switching and settings singleton
- `src/app/keystatic/layout.tsx` - Keystatic layout with Node.js runtime + html/body shell
- `src/app/keystatic/[[...params]]/page.tsx` - Admin UI catch-all page entry point
- `src/app/keystatic/[[...params]]/keystatic.tsx` - Client component using makePage from @keystatic/next
- `src/app/api/keystatic/[...params]/route.ts` - API route handler with Node.js runtime
- `.env.local.example` - Documents all env vars for GitHub storage mode
- `src/middleware.ts` - Added keystatic and api/keystatic exclusions to next-intl matcher

## Decisions Made

- **GitHub deploy loop deferred.** The plan's Task 2 checkpoint requires Keystatic Cloud project creation and Vercel env var configuration by the owner. This is a user-setup dependency, not a code issue. Local admin UI is fully functional. The GitHub storage path is coded and ready — it activates when `KEYSTATIC_STORAGE_KIND=github` is set with the required credentials.
- **Keystatic layout wraps with html/body shell.** Next.js App Router requires every layout tree to contain html/body elements. Since the Keystatic catch-all sits outside the `[locale]` segment (which owns the real html/body), the Keystatic layout provides its own minimal shell. This resolves the "Missing html/body" console error without affecting the main locale layout structure.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Added html/body shell to Keystatic layout**
- **Found during:** Task 1 (post-commit, during local verification)
- **Issue:** Next.js App Router raised "Missing html/body" error because the Keystatic catch-all route tree (`src/app/keystatic/`) sits outside the `[locale]` segment that owns `<html>/<body>`. Without its own shell, the Keystatic admin rendered without proper document structure.
- **Fix:** Updated `src/app/keystatic/layout.tsx` to wrap `{children}` with `<html lang="en"><body>`. Retained `export const runtime = "nodejs"`.
- **Files modified:** src/app/keystatic/layout.tsx
- **Verification:** Keystatic admin UI loads correctly at /keystatic without console errors
- **Committed in:** 6afc9d5

---

**Total deviations:** 1 auto-fixed (Rule 1 — bug)
**Impact on plan:** Fix was necessary for correct admin UI rendering. No scope creep.

## Issues Encountered

None beyond the html/body fix documented above.

## User Setup Required

The GitHub deploy loop requires owner action before production use:

1. Create a Keystatic Cloud project at https://keystatic.com — sign in, create project, connect GitHub repo
2. Copy `KEYSTATIC_GITHUB_CLIENT_ID` and `KEYSTATIC_GITHUB_CLIENT_SECRET` from Keystatic Cloud dashboard
3. Generate `KEYSTATIC_SECRET`: `openssl rand -hex 16`
4. Add all three to Vercel project settings under Environment Variables
5. Also add `KEYSTATIC_STORAGE_KIND=github`, `GITHUB_REPO_OWNER=blendstrup`, `GITHUB_REPO_NAME=by-blendstrup-frontend`
6. Redeploy on Vercel — then verify /keystatic on the production URL triggers Keystatic Cloud OAuth

All env var names are documented in `.env.local.example`.

## Known Stubs

None — this plan delivers infrastructure only (config + routes). No UI content stubs.

## Threat Flags

None — no new public network endpoints beyond Keystatic's own `/keystatic` and `/api/keystatic` routes, which are intentional per plan and covered by T-03-01 (Keystatic Cloud OAuth protects production access). `.env.local` is gitignored per T-03-02.

## Next Phase Readiness

- Keystatic config is ready to accept additional singletons and collections (works, homepage, about, customOrders) in later phases
- Reader API pattern (`createReader(process.cwd(), config)`) is established for use in server components
- GitHub deploy loop is code-complete; unblocked once owner completes Keystatic Cloud setup
- No blockers for Phase 1 completion — remaining phases (if any) can proceed

## Self-Check: PASSED

- keystatic.config.ts: EXISTS
- src/app/keystatic/layout.tsx: EXISTS
- src/app/keystatic/[[...params]]/page.tsx: EXISTS
- src/app/api/keystatic/[...params]/route.ts: EXISTS
- .env.local.example: EXISTS
- Commit ecd3478: EXISTS
- Commit 6afc9d5: EXISTS

---
*Phase: 01-foundation*
*Completed: 2026-04-18*
