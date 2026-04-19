---
phase: 03-gallery-works
plan: 02
subsystem: gallery-ui, components, i18n, navigation
tags: [gallery, rsc, keystatic, next-image, tailwind, filter, i18n, a11y]
dependency_graph:
  requires:
    - 03-01-PLAN.md (works schema + gallery i18n keys)
  provides:
    - src/app/[locale]/gallery/page.tsx
    - src/components/GalleryGrid.tsx
    - src/components/WorkCard.tsx
    - src/components/StatusBadge.tsx
    - src/components/GalleryFilterToggle.tsx
    - messages/en.json#navigation.gallery
    - messages/da.json#navigation.gallery
  affects:
    - Plan 03-03 (detail page shares WorkCard types + StatusBadge)
    - SiteHeader (Works nav link added)
tech_stack:
  added: []
  patterns:
    - RSC pattern for Keystatic Reader API (createReader in async server component)
    - force-dynamic export for searchParams-driven RSC filtering
    - Client component filter toggle using useSearchParams + useRouter from @/i18n/navigation
    - WorkCardEntry interface exported from WorkCard for reuse in GalleryGrid
    - fieldset/legend for accessible button group (replaces role="group" on div)
key_files:
  created:
    - src/app/[locale]/gallery/page.tsx
    - src/components/GalleryGrid.tsx
    - src/components/WorkCard.tsx
    - src/components/StatusBadge.tsx
    - src/components/GalleryFilterToggle.tsx
  modified:
    - src/components/SiteHeader.tsx
    - messages/en.json
    - messages/da.json
    - src/__tests__/gallery-filter.test.ts
decisions:
  - Used force-dynamic instead of force-static — searchParams cannot be read at build time in a statically exported page; dynamic rendering is required for the filter to work per-request
  - Used fieldset/legend for GalleryFilterToggle button group instead of div[role="group"] — fieldset is the semantic HTML element for grouping form controls, avoids a11y linting error
  - WorkCardEntry interface uses ReadonlyArray with readonly image to match Keystatic Reader API return type (noUncheckedIndexedAccess + readonly arrays from @keystatic/core)
metrics:
  duration: "~25 minutes"
  completed: "2026-04-19"
  tasks_completed: 2
  files_changed: 9
---

# Phase 03 Plan 02: Gallery Grid Page Summary

**One-liner:** Gallery grid RSC at /[locale]/gallery with Keystatic Reader, URL-based for-sale filter, 3-column responsive WorkCard grid, StatusBadge pill overlay, GalleryFilterToggle client component, and Works nav link in SiteHeader.

## What Was Built

**Task 1 — Gallery RSC + WorkCard + StatusBadge + GalleryGrid components**

Created four files in dependency order:

- `src/components/StatusBadge.tsx` — Server-compatible pill badge. Returns null for `notListed`, `bg-stone text-linen` for `sold`, `bg-terracotta text-linen` for `available`. Position: `absolute top-2 left-2`. aria-label passes the label string.

- `src/components/WorkCard.tsx` — Server-compatible card component. `Link` from `@/i18n/navigation` wraps a `relative aspect-[4/5] overflow-hidden` div containing a `next/image` fill image with `group-hover:scale-[1.015]` transition and a `StatusBadge` overlay. Handles empty images array with an oat placeholder div.

- `src/components/GalleryGrid.tsx` — Pure display component. Renders `<ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">` with `WorkCard` per item. Exports `WorkCardEntry` type for reuse.

- `src/app/[locale]/gallery/page.tsx` — Async RSC. Reads `searchParams.filter`, calls `createReader().collections.works.all()`, filters by `published` (draft gate, T-3-05 mitigation), then by `saleStatus === "available"` when `filter === "for-sale"`. Renders empty-state copy for both filter states (with custom-orders CTA link for for-sale empty state).

**Task 2 — GalleryFilterToggle client component + SiteHeader nav link**

- `src/components/GalleryFilterToggle.tsx` — `"use client"` component. Two buttons inside a `<fieldset>` (semantic grouping). Active tab: `border-b-2 border-terracotta font-medium text-ink`. Inactive tab: `border-transparent text-stone hover:underline hover:decoration-terracotta`. Both buttons: `min-h-[44px]` for WCAG 2.5.5 touch targets. Uses `useSearchParams` + `useRouter` from `@/i18n/navigation`.

- `src/components/SiteHeader.tsx` — Added `<nav>` with a single `Link href="/gallery"` rendering `t("navigation.gallery")`. Nav link classes: `text-sm font-medium text-stone hover:text-ink hover:underline hover:decoration-terracotta transition-colors duration-150`.

- `messages/en.json` — Added `navigation.gallery = "Works"`.
- `messages/da.json` — Added `navigation.gallery = "Arbejder"`.

Final state: 45 tests pass, tsc clean, biome clean, `pnpm build` succeeds with `/[locale]/gallery` as a dynamic route (ƒ).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Changed force-static to force-dynamic**
- **Found during:** Task 1 — plan specified `export const dynamic = "force-static"` but Next.js cannot statically pre-render a page that reads `searchParams` at request time
- **Issue:** `force-static` causes searchParams to always be empty `{}`, breaking the URL-based filter entirely (GALL-03 would silently fail)
- **Fix:** Changed to `force-dynamic` so the RSC reads actual searchParams on each request
- **Files modified:** src/app/[locale]/gallery/page.tsx
- **Commit:** 106934c

**2. [Rule 1 - Bug] Fixed noUncheckedIndexedAccess errors in pre-existing test file**
- **Found during:** Task 1 verification — `pnpm tsc --noEmit` flagged `result[0]` as possibly undefined in gallery-filter.test.ts
- **Issue:** `tsconfig.json` has `noUncheckedIndexedAccess: true`; the test file from Plan 01 used `result[0].entry.*` without optional chaining
- **Fix:** Changed to `result[0]?.entry.*` at lines 23 and 49 of gallery-filter.test.ts
- **Files modified:** src/__tests__/gallery-filter.test.ts
- **Commit:** 106934c

**3. [Rule 2 - A11y] Used fieldset/legend instead of div[role="group"] for GalleryFilterToggle**
- **Found during:** Task 2 — IDE diagnostic flagged `role="group"` on a `<div>` as an a11y error (ARIA role should use the native HTML equivalent)
- **Fix:** Replaced `<div role="group" aria-label={...}>` with `<fieldset><legend className="sr-only">` — native semantic HTML for grouping form controls, no ARIA role needed
- **Files modified:** src/components/GalleryFilterToggle.tsx
- **Commit:** 3486094

**4. [Rule 1 - Bug] WorkCardEntry.images typed as ReadonlyArray with readonly image**
- **Found during:** Task 1 verification — tsc reported incompatibility between Keystatic's `readonly { image: string | null; alt: string }[]` and the original `Array<{ image: string; alt: string }>`
- **Fix:** Updated `WorkCardEntry.images` to `ReadonlyArray<{ readonly image: string | null; readonly alt: string }>` to match Keystatic Reader API return type
- **Files modified:** src/components/WorkCard.tsx
- **Commit:** 106934c

## Known Stubs

None. All components render live data from the Keystatic Reader API. GalleryFilterToggle stub from Task 1 was replaced with full implementation in the same task sequence before Task 1 commit.

## Threat Flags

None — no new network endpoints, auth paths, or external trust boundaries introduced beyond what the plan's threat model covers.

- T-3-05 (draft gate): `.filter(w => w.entry.published)` is present in gallery/page.tsx line 27.
- T-3-04 (filter param tampering): `filter === "for-sale"` string comparison with fallback to "show all" is implemented correctly.

## Self-Check: PASSED

Files verified present:
- src/app/[locale]/gallery/page.tsx — contains `.filter(w => w.entry.published)` and `filter === "for-sale"`
- src/components/GalleryGrid.tsx — contains `grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3`
- src/components/WorkCard.tsx — contains `aspect-[4/5]` and `group-hover:scale-[1.015]`
- src/components/StatusBadge.tsx — returns null for `notListed`, `bg-stone` for `sold`, `bg-terracotta` for `available`
- src/components/GalleryFilterToggle.tsx — `"use client"`, `min-h-[44px]`, `aria-pressed`, `border-terracotta`
- src/components/SiteHeader.tsx — contains `href="/gallery"` and `t("navigation.gallery")`
- messages/en.json — `navigation.gallery = "Works"`
- messages/da.json — `navigation.gallery = "Arbejder"`

Commits verified:
- 106934c — feat(03-02): gallery RSC + WorkCard + StatusBadge + GalleryGrid components
- 3486094 — feat(03-02): GalleryFilterToggle client component + SiteHeader nav link

Build verified: `pnpm build` exits 0, `/[locale]/gallery` route present as dynamic (ƒ).
