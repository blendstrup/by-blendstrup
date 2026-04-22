---
phase: 06-polish-launch
plan: "03"
subsystem: blur-placeholder-threading
tags: [plaiceholder, blur-placeholder, workcard, shopcard, workdetail, gallery, homepage, lqip]
dependency_graph:
  requires: [06-01]
  provides: [blur-placeholder-threaded]
  affects: []
tech_stack:
  added: []
  removed: []
  patterns: [prop-threading, async-rsc, promise-all-parallelisation]
key_files:
  created: []
  modified:
    - src/components/WorkCard.tsx
    - src/components/ShopCard.tsx
    - src/components/WorkDetail.tsx
    - src/components/GalleryGrid.tsx
    - src/app/gallery/page.tsx
    - src/app/page.tsx
decisions:
  - WorkDetail made async RSC — calls getBlurDataUrl directly for all its images (primary and secondary)
  - GalleryGrid updated to thread blurDataUrl?: string per work item — required to pass RSC-computed blur to WorkCard (not in original plan file list, applied as Rule 1 deviation)
  - Static BLUR_DATA_URL constant removed from WorkDetail — replaced with real plaiceholder-generated base64 data URIs
  - LINEN_BLUR constant in homepage retained for hero image and about photo — those are not WorkCard/ShopCard instances and are outside this plan's scope
metrics:
  duration_seconds: 480
  completed_date: "2026-04-22"
  tasks_completed: 2
  files_changed: 6
---

# Phase 06 Plan 03: Blur Placeholder Threading Summary

**One-liner:** plaiceholder-generated LQIP blur placeholders threaded to WorkCard, ShopCard, and WorkDetail via RSC prop-passing and async component patterns.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Add blurDataUrl prop to WorkCard and ShopCard | c950e47 | src/components/WorkCard.tsx, src/components/ShopCard.tsx |
| 2 | Compute and pass blurDataUrl in gallery page, homepage, and WorkDetail | 3a5a01c | src/app/gallery/page.tsx, src/app/page.tsx, src/components/WorkDetail.tsx, src/components/GalleryGrid.tsx |

## What Was Built

### WorkCard and ShopCard — blur prop support
Both components received `blurDataUrl?: string` added to their props interface. The `<Image>` element in each now uses `placeholder={blurDataUrl ? "blur" : "empty"}` and `blurDataURL={blurDataUrl}`. Neither component gained a `"use client"` directive — they remain server-renderable.

### WorkDetail — async RSC with real LQIP
The static `BLUR_DATA_URL` constant (a generic gray 1x1 JPEG) was removed. `WorkDetail` is now an `async` server component that calls `getBlurDataUrl` for every image it renders (primary and secondary) via `Promise.all`. The gallery detail page (`gallery/[slug]/page.tsx`) was not modified — WorkDetail is the sole blur caller for the detail view, as specified in the plan.

### gallery/page.tsx — blur computed per card
`getBlurDataUrl` is imported and called in parallel via `Promise.all` for each published work's first image before the return statement. The result array (with `blurDataUrl`) is passed to `GalleryGrid`.

### GalleryGrid.tsx — blur threaded to WorkCard
The `works` array type was updated to include `blurDataUrl?: string`. Each `WorkCard` receives the prop. This file was not in the plan's `files_modified` list but was required to thread the prop from the RSC page to the card component.

### page.tsx (homepage) — blur computed for ShopCards
`getBlurDataUrl` is imported and called in parallel for each `shopPreviewWork`'s first image. The resolved `blurDataUrl` is passed to each `ShopCard` in the JSX. The hero image and about photo retain the static `LINEN_BLUR` constant — those are not ceramic work cards and are out of scope for this plan.

## Verification Results

| Check | Result |
|-------|--------|
| `grep "blurDataURL={blurDataUrl}" src/components/WorkCard.tsx` | Found |
| `grep "blurDataURL={blurDataUrl}" src/components/ShopCard.tsx` | Found |
| `grep "BLUR_DATA_URL" src/components/WorkDetail.tsx` | Not found (removed) |
| `grep "async function WorkDetail" src/components/WorkDetail.tsx` | Found |
| `grep "getBlurDataUrl" src/app/gallery/page.tsx` | Found |
| `grep "getBlurDataUrl" src/app/page.tsx` | Found |
| `grep "getBlurDataUrl" src/components/WorkDetail.tsx` | Found |
| `grep "use client" src/components/WorkCard.tsx` | Not found |
| `grep "use client" src/components/ShopCard.tsx` | Not found |
| `pnpm vitest run` (41 tests) | All pass |
| `pnpm build` | Exit 0 |
| `pnpm biome check src/` | Exit 0 — no errors |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Required intermediary] Updated GalleryGrid to thread blurDataUrl**
- **Found during:** Task 2
- **Issue:** The gallery page passes works to `GalleryGrid`, which renders `WorkCard` instances. The plan's approach of passing `blurDataUrl` to each WorkCard required threading the prop through GalleryGrid. Without updating GalleryGrid, the blur prop could not reach WorkCard.
- **Fix:** Added `blurDataUrl?: string` to the `works` array type in `GalleryGridProps`, destructured it in the map callback, and passed it as a prop to `WorkCard`.
- **Files modified:** src/components/GalleryGrid.tsx
- **Commit:** 3a5a01c

**2. [Rule 1 - Biome formatting] Applied biome format to GalleryGrid.tsx and page.tsx**
- **Found during:** Task 2 verification (`pnpm biome check src/` exit 1)
- **Issue:** New JSX added to GalleryGrid and page.tsx had lines that exceeded biome's print width — formatting-only violations.
- **Fix:** Ran `pnpm biome check --write` on the two affected files. No logic was changed.
- **Files modified:** src/components/GalleryGrid.tsx, src/app/page.tsx
- **Commit:** 3a5a01c (included in Task 2 commit)

## Known Stubs

None. All ceramic work card images now receive real plaiceholder-generated blur placeholders. The hero image and about section photo in `page.tsx` use the inline `LINEN_BLUR` constant — this is intentional and documented (those are not ceramic work card instances; the hero blur strategy is outside this plan's scope).

## Threat Flags

None. No new network endpoints, auth paths, file access patterns, or schema changes introduced. The `getBlurDataUrl` path resolution pattern was already assessed in Plan 01 (T-06-10: mitigated via try/catch).

## Self-Check: PASSED

- src/components/WorkCard.tsx: contains `blurDataUrl?: string` and `blurDataURL={blurDataUrl}`
- src/components/ShopCard.tsx: contains `blurDataUrl?: string` and `blurDataURL={blurDataUrl}`
- src/components/WorkDetail.tsx: contains `getBlurDataUrl`, does NOT contain `BLUR_DATA_URL`, exports `async function WorkDetail`
- src/components/GalleryGrid.tsx: threads `blurDataUrl` to WorkCard
- src/app/gallery/page.tsx: imports and calls `getBlurDataUrl`
- src/app/page.tsx: imports and calls `getBlurDataUrl`, passes `blurDataUrl` to ShopCard
- Commits c950e47, 3a5a01c: both exist in git log
