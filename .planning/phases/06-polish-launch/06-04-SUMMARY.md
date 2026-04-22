---
phase: 06-polish-launch
plan: "04"
subsystem: seo-metadata
tags: [seo, metadata, generateMetadata, openGraph, og-image, gallery-detail]
dependency_graph:
  requires: [06-02, 06-03]
  provides: [page-metadata-all-routes, dynamic-gallery-detail-metadata]
  affects: [all-pages, search-engines, social-sharing]
tech_stack:
  added: []
  patterns: [App Router metadata export, generateMetadata async function, baseMetadata spread, openGraph re-spread]
key_files:
  created: []
  modified:
    - src/app/layout.tsx
    - src/app/page.tsx
    - src/app/gallery/page.tsx
    - src/app/contact/page.tsx
    - src/app/contact/purchase/page.tsx
    - src/app/custom-orders/page.tsx
    - src/app/gallery/[slug]/page.tsx
decisions:
  - "All pages spread baseMetadata then override — avoids any accidental metadata reset"
  - "All openGraph overrides re-spread baseMetadata.openGraph to preserve siteName, locale, and fallback OG image"
  - "generateMetadata for draft/unpublished slugs returns generic 'Keramik' fallback — no draft content in metadata (T-06-11)"
  - "Description trimmed at 120 chars at word boundary using template literal (biome useTemplate compliance)"
  - "I18N-04 remains retired — no hreflang exported from any page"
metrics:
  duration: ~12min
  completed: "2026-04-22"
  tasks_completed: 2
  tasks_total: 2
  files_created: 0
  files_modified: 7
---

# Phase 06 Plan 04: Page Metadata Summary

**One-liner:** generateMetadata exports added to all 7 public routes — static pages spread baseMetadata with UI-SPEC strings, gallery detail uses async Keystatic reader for work title and first image.

## What Was Built

### Task 1: Static page metadata (6 files)

All six static page files received a `metadata` export near the top (after imports, before default export). Each spreads `baseMetadata` and overrides `title`, `description`, and `openGraph` with the exact strings from the UI-SPEC:

| Route | Title | Description |
|-------|-------|-------------|
| `/` (layout) | template: `%s — By Blendstrup` | Håndlavede keramikker fra By Blendstrup... |
| `/` (homepage) | By Blendstrup — Håndlavet keramik | Oplev håndlavede keramikker skabt med omhu... |
| `/gallery` | Keramik (→ Keramik — By Blendstrup) | Gennemse alle håndlavede keramikker... |
| `/contact` | Kontakt (→ Kontakt — By Blendstrup) | Kontakt By Blendstrup for køb af keramik... |
| `/contact/purchase` | Købsforespørgsel | Send en forespørgsel om køb... |
| `/custom-orders` | Specialbestilling | Bestil din egen specialfremstillede keramik... |

Every `openGraph` object re-spreads `...baseMetadata.openGraph` to preserve `siteName`, `locale`, and the fallback OG image — following the ANTI-PATTERN warning in the plan.

### Task 2: Dynamic generateMetadata for gallery detail

`src/app/gallery/[slug]/page.tsx` now exports an async `generateMetadata` function that:
- Reads the work entry from Keystatic via `createReader` (same reader pattern as the page component)
- Returns generic `{ title: "Keramik" }` fallback for missing/unpublished slugs (mitigates T-06-11)
- For valid published works: sets `title = work.title`, trims `description` at 120 chars at a word boundary, and conditionally replaces `openGraph.images` with the work's first image when available
- Co-exists with `generateStaticParams` — build confirmed SSG still prerendering `/gallery/bowl-test`

## Verification Results

| Check | Result |
|-------|--------|
| `grep "template.*By Blendstrup" src/app/layout.tsx` | Found |
| `grep "baseMetadata" src/app/layout.tsx` | Found |
| `grep "Keramik" src/app/gallery/page.tsx` | Found |
| `grep "Kontakt" src/app/contact/page.tsx` | Found |
| `grep "Købsforespørgsel" src/app/contact/purchase/page.tsx` | Found |
| `grep "Specialbestilling" src/app/custom-orders/page.tsx` | Found |
| `grep "baseMetadata.openGraph" src/app/page.tsx` | Found |
| `grep "cart\|checkout\|rating\|discount" all metadata files` | No matches |
| `grep "export async function generateMetadata" gallery/[slug]/page.tsx` | Found |
| `grep "work.title" gallery/[slug]/page.tsx` | Found |
| `grep "baseMetadata.openGraph" gallery/[slug]/page.tsx` | Found |
| `grep "120" gallery/[slug]/page.tsx` | Found |
| `pnpm vitest run` (41 tests) | All pass |
| `pnpm build` | Exit 0 |
| `pnpm biome check src/` | Exit 0 — no errors |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Biome] Fixed import order in layout.tsx**
- **Found during:** Task 1 biome check (`pnpm biome check src/` exit 1)
- **Issue:** Added imports placed `Metadata` before `baseMetadata` — biome's `organizeImports` requires alphabetical order within the same import group
- **Fix:** Reordered to `baseMetadata` before `Metadata` (both `@/lib/...` and `next` groups follow biome's sort rules)
- **Files modified:** src/app/layout.tsx

**2. [Rule 1 - Biome] Fixed string concatenation → template literal in gallery/[slug]/page.tsx**
- **Found during:** Task 2 biome check (`pnpm biome check src/` exit 1)
- **Issue:** `rawDesc.slice(0, 120)... + " — By Blendstrup."` triggered `lint/style/useTemplate`
- **Fix:** Changed to `` `${rawDesc.slice(0, 120).replace(...)} — By Blendstrup.` ``
- **Files modified:** src/app/gallery/[slug]/page.tsx

## Known Stubs

None. All metadata strings are final UI-SPEC values. The gallery detail `generateMetadata` reads live Keystatic data — no hardcoded placeholder titles or descriptions.

## Threat Flags

None. The `generateMetadata` function checks `!work.published` before returning work-specific metadata — T-06-11 (draft content disclosure) is mitigated. No new network endpoints or auth paths introduced.

## Self-Check: PASSED

- src/app/layout.tsx — FOUND, contains `template: "%s — By Blendstrup"` and `baseMetadata`
- src/app/page.tsx — FOUND, contains `By Blendstrup — Håndlavet keramik` and `baseMetadata.openGraph`
- src/app/gallery/page.tsx — FOUND, contains `Keramik` title
- src/app/contact/page.tsx — FOUND, contains `Kontakt` title
- src/app/contact/purchase/page.tsx — FOUND, contains `Købsforespørgsel` title
- src/app/custom-orders/page.tsx — FOUND, contains `Specialbestilling` title
- src/app/gallery/[slug]/page.tsx — FOUND, contains `generateMetadata`, `work.title`, `baseMetadata.openGraph`, `120`
- Commit `bba3d7b` — FOUND (Task 1)
- Commit `f6bd489` — FOUND (Task 2)
- `pnpm build` exits 0 — CONFIRMED
- `pnpm biome check src/` exits 0 — CONFIRMED
- `pnpm vitest run` 41/41 tests pass — CONFIRMED
