---
phase: 06-polish-launch
plan: "01"
subsystem: image-optimization
tags: [plaiceholder, sharp, avif, blur-placeholder, tdd]
dependency_graph:
  requires: []
  provides: [blur-placeholder-utility, avif-image-config]
  affects: [06-03, 06-04]
tech_stack:
  added: [plaiceholder@3.0.0, sharp@0.34.5]
  removed: [next-intl@4.9.1]
  patterns: [server-only-utility, try-catch-undefined-fallback, tdd-red-green]
key_files:
  created:
    - src/lib/blur-placeholder.ts
    - src/__tests__/blur-placeholder.test.ts
  modified:
    - next.config.ts
    - package.json
    - pnpm-lock.yaml
decisions:
  - plaiceholder v3 requires a Buffer (not a string path) — utility wraps fs.readFileSync then passes to getPlaiceholder
  - try/catch returns undefined on any error to prevent build-time crashes from missing images
  - Pre-existing biome format/import-sort issues in 7 src files fixed as part of acceptance criteria
metrics:
  duration_seconds: 367
  completed_date: "2026-04-22"
  tasks_completed: 2
  files_changed: 12
---

# Phase 06 Plan 01: Image Optimization Foundation Summary

**One-liner:** plaiceholder + sharp installed with AVIF-first config and a server-side blur-placeholder utility validated by 3 TDD tests.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Install dependencies + AVIF config + remove next-intl | d5e83b7 | next.config.ts, package.json, pnpm-lock.yaml, 7 biome-fixed files |
| 2 (RED) | Failing tests for blur-placeholder | c6746a7 | src/__tests__/blur-placeholder.test.ts |
| 2 (GREEN) | Implement blur-placeholder utility | f566772 | src/lib/blur-placeholder.ts |

## What Was Built

### next.config.ts — AVIF-first image delivery
`images.formats: ["image/avif", "image/webp"]` tells Next.js to serve AVIF as the primary format, falling back to WebP. This applies to all `next/image` usage across the site.

### src/lib/blur-placeholder.ts — Shared blur generation utility
`getBlurDataUrl(publicPath: string | null): Promise<string | undefined>`

- Resolves the Keystatic-stored public path to an absolute filesystem path
- Reads file with `fs.readFileSync`, passes raw Buffer to `getPlaiceholder`
- Returns base64 data URI on success, `undefined` on any error (missing file, null input, corrupt data)
- Server-only — must not be imported from client components

### next-intl removed
Package was unused since the i18n quick task removed all next-intl source usage. Removing it reduces install size.

## Verification Results

| Check | Result |
|-------|--------|
| `grep "image/avif" next.config.ts` | Found |
| `grep "next-intl" package.json` | Not found (removed) |
| `grep "plaiceholder" package.json` | Found — `^3.0.0` |
| `grep "sharp" package.json` | Found — `^0.34.5` |
| `pnpm test --run` (41 tests) | All pass |
| `pnpm build` | Exit 0 |
| `pnpm biome check src/` | Exit 0 — no errors |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Pre-existing biome violations] Applied biome safe fixes to 7 pre-existing files**
- **Found during:** Task 1 verification (`pnpm biome check src/` exit 1)
- **Issue:** 7 files from prior phases had import-sort and formatting violations that caused biome to fail. The plan's acceptance criteria required `pnpm biome check src/` to exit 0.
- **Fix:** Ran `pnpm biome check --write src/` to apply safe (non-destructive) fixes — import reordering and line-break reformatting only. No logic was changed.
- **Files modified:** src/actions/purchase-inquiry.ts, src/actions/custom-order.ts, src/app/gallery/[slug]/page.tsx, src/app/contact/page.tsx, src/app/gallery/page.tsx, src/app/page.tsx, src/__tests__/shop-filter.test.ts
- **Commit:** d5e83b7 (included in Task 1 commit)

## Known Stubs

None. The blur-placeholder utility is fully wired — it reads real files and returns real base64 data URIs. Plans 03 and 04 will call it from RSC page components.

## Threat Flags

T-06-03 mitigation verified: path is always `process.cwd() + "/public" + keystatic_stored_path`. The try/catch prevents path traversal from causing 500s at build time. No new trust boundaries introduced beyond what the threat model covers.

## Self-Check: PASSED

- src/lib/blur-placeholder.ts: EXISTS
- src/__tests__/blur-placeholder.test.ts: EXISTS
- next.config.ts: contains `image/avif`
- package.json: contains plaiceholder, sharp; does NOT contain next-intl
- Commits d5e83b7, c6746a7, f566772: all exist in git log
