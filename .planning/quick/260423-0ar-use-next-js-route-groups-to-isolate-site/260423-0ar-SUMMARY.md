---
phase: quick-260423-0ar
plan: 01
subsystem: routing
tags: [route-groups, layout, keystatic, next-js]
dependency_graph:
  requires: []
  provides: [site-layout-isolation, keystatic-full-viewport]
  affects: [src/app/layout.tsx, src/app/(site)/layout.tsx, src/app/keystatic/layout.tsx]
tech_stack:
  added: []
  patterns: [Next.js route groups, nested layouts]
key_files:
  created:
    - src/app/(site)/layout.tsx
  modified:
    - src/app/layout.tsx
    - src/app/keystatic/layout.tsx
    - src/app/(site)/page.tsx
    - src/app/(site)/gallery/page.tsx
    - src/app/(site)/gallery/[slug]/page.tsx
    - src/app/(site)/contact/page.tsx
    - src/app/(site)/contact/purchase/page.tsx
    - src/app/(site)/custom-orders/page.tsx
decisions:
  - Route group (site)/ used to isolate SiteHeader/SiteFooter from keystatic and admin-login routes
  - Relative import paths updated in all moved files (keystatic.config and messages/da.json)
  - git mv used for all page moves to preserve rename history
metrics:
  duration: "~2.5 minutes"
  completed: "2026-04-22T22:17:14Z"
  tasks_completed: 2
  tasks_total: 3
  files_modified: 9
---

# Quick Task 260423-0ar: Use Next.js Route Groups to Isolate Site Layout — Summary

**One-liner:** Extracted SiteHeader/SiteFooter into a `(site)` route group layout so Keystatic admin occupies full viewport height without layout offset.

## What Was Done

### Task 1: Strip root layout to minimal shell and create (site) route group layout

- `src/app/layout.tsx` stripped to minimal html/body/font shell — removed SiteHeader, SiteFooter, skip-to-content link, `#main-content` div, and `da` import
- Created `src/app/(site)/layout.tsx` with SiteHeader, SiteFooter, skip-to-content `<a>`, and `#main-content` div
- `(site)/layout.tsx` uses 3-level relative import (`../../../messages/da.json`) for the da.json translation strings
- Commit: `df3f4a7`

### Task 2: Move site pages into (site) route group and simplify keystatic layout

- Moved 6 page files via `git mv` to preserve rename history:
  - `src/app/page.tsx` → `src/app/(site)/page.tsx`
  - `src/app/gallery/` → `src/app/(site)/gallery/`
  - `src/app/contact/` → `src/app/(site)/contact/`
  - `src/app/custom-orders/` → `src/app/(site)/custom-orders/`
- Fixed relative imports for `keystatic.config` and `messages/da.json` in all moved files (each needed one additional `../` level due to the added `(site)` directory)
- Simplified `src/app/keystatic/layout.tsx` to `<>{children}</>` fragment passthrough — removed `<html>` and `<body>` wrapper tags
- Commit: `80b0443`

### Task 3: Human verification (skipped per constraints)

Requires manual verification: `pnpm dev` → confirm `/` and `/gallery` render with header/footer, `/keystatic` fills viewport without header/footer, video choose-file button is visible without overscrolling.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Updated broken relative import paths in all moved page files**
- **Found during:** Task 2
- **Issue:** Moving files into `(site)/` adds one filesystem directory level. All files with relative imports to `keystatic.config` and `messages/da.json` had paths that were one `../` short after the move.
- **Fix:** Added one additional `../` segment to each affected import in all 6 moved pages.
- **Files modified:** `(site)/page.tsx`, `(site)/gallery/page.tsx`, `(site)/gallery/[slug]/page.tsx`, `(site)/contact/page.tsx`, `(site)/contact/purchase/page.tsx`, `(site)/custom-orders/page.tsx`
- **Commit:** `80b0443`

## Known Stubs

None.

## Threat Flags

None — route group restructure does not introduce new network endpoints or auth boundaries. The admin-login middleware and `/keystatic` protection remain unchanged.

## Self-Check: PASSED

- `src/app/(site)/layout.tsx` exists: FOUND
- `src/app/layout.tsx` stripped (no SiteHeader/SiteFooter): FOUND
- `src/app/keystatic/layout.tsx` simplified: FOUND
- All 6 site pages under `src/app/(site)/`: FOUND
- Commits df3f4a7 and 80b0443: FOUND
- TypeScript source errors: 0 (stale `.next/` cache entries resolve on next build)
