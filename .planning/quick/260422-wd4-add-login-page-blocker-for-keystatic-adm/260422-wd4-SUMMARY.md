---
phase: quick-260422-wd4
plan: 01
subsystem: auth
tags: [middleware, edge, authentication, keystatic, admin]
dependency_graph:
  requires: []
  provides: [admin-login-gate, keystatic-protection]
  affects: [src/middleware.ts, src/app/admin-login]
tech_stack:
  added: [Web Crypto API (Edge runtime), Node crypto (server action)]
  patterns: [HMAC-SHA256 cookie token, useActionState (React 19), httpOnly session cookie]
key_files:
  created:
    - src/middleware.ts
    - src/app/admin-login/actions.ts
    - src/app/admin-login/page.tsx
  modified: []
decisions:
  - CSS variable mapping from generic plan names to actual project tokens (linen/oat/clay/stone/ink/fault)
  - Error text color uses --color-fault instead of red-600 to stay within the design system
  - loginAction typed with _prevState parameter for useActionState compatibility
metrics:
  duration: "~10 minutes"
  completed_date: "2026-04-22"
  tasks_completed: 2
  files_created: 3
---

# Phase quick-260422-wd4 Plan 01: Admin Login Gate Summary

**One-liner:** HMAC-SHA256 Edge middleware + React 19 useActionState login page protecting /keystatic with an 8-hour httpOnly session cookie.

## What Was Built

An authentication gate for the Keystatic admin UI at `/keystatic`. Without this, any visitor could reach the CMS editor.

**Flow:**
1. User visits `/keystatic` — middleware checks `admin_session` cookie
2. If cookie missing or invalid → redirect to `/admin-login?next=/keystatic`
3. User submits credentials → server action validates against `ADMIN_USERNAME`/`ADMIN_PASSWORD` env vars
4. On success → sets 8-hour httpOnly session cookie, redirects to `/keystatic`
5. On failure → returns Danish error message, stays on login page

## Files Created

| File | Purpose |
|------|---------|
| `src/middleware.ts` | Edge middleware — matches `/keystatic` and `/keystatic/:path*`, derives HMAC-SHA256 expected token via Web Crypto API, redirects unauthenticated requests |
| `src/app/admin-login/actions.ts` | Server actions — `loginAction` validates credentials and sets cookie, `logoutAction` clears cookie |
| `src/app/admin-login/page.tsx` | Client component — login form with `useActionState`, Danish labels, Japandi styling using actual project CSS variables |

## Decisions Made

**CSS variable mapping:** The plan referenced generic names (`--color-background`, `--color-surface`, `--color-border`, `--color-muted`) that do not exist in globals.css. Mapped to actual project tokens:
- `--color-background` → `--color-linen`
- `--color-surface` → `--color-oat`
- `--color-border` → `--color-clay`
- `--color-muted` → `--color-stone`
- Error text: `--color-fault` (instead of `red-600`) to stay within design system

**loginAction signature:** Added `_prevState` parameter (typed `{ error: string } | null`) to match the `useActionState` contract which passes previous state as first argument before `formData`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical Functionality] useActionState requires prevState parameter in action signature**
- **Found during:** Task 2
- **Issue:** The plan's action signature `loginAction(formData: FormData)` is incompatible with `useActionState`, which calls the action as `action(prevState, formData)`. TypeScript would reject the mismatch.
- **Fix:** Added `_prevState: { error: string } | null` as first parameter to `loginAction`.
- **Files modified:** `src/app/admin-login/actions.ts`
- **Commit:** 2331bd0

## Threat Surface

Per the plan's threat model, all mitigations are implemented:
- T-wd4-01: Cookie value is HMAC-SHA256 — unforgeable without env vars
- T-wd4-02: httpOnly prevents JS access; HMAC validated in middleware
- T-wd4-06: No credentials in source — env vars only

## Commits

| Task | Commit | Message |
|------|--------|---------|
| Task 1: Middleware | 3503df5 | feat(260422-wd4): add Edge middleware to protect /keystatic routes |
| Task 2: Login page + actions | 2331bd0 | feat(260422-wd4): add admin login page and server actions |

## Self-Check: PASSED

- `src/middleware.ts` — FOUND
- `src/app/admin-login/actions.ts` — FOUND
- `src/app/admin-login/page.tsx` — FOUND
- Commit 3503df5 — FOUND
- Commit 2331bd0 — FOUND
- TypeScript: clean (no errors)
- `/api/keystatic/*` NOT in middleware matcher — open as required
