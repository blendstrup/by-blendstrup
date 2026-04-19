---
plan: 04-04
phase: 04-homepage-shop-contact
subsystem: pages
tags:
  - homepage
  - hero
  - shop-preview
  - about
  - custom-orders-cta
  - keystatic-reader
  - rsc

dependency_graph:
  requires:
    - 04-01 (about singleton in keystatic.config.ts, lucide-react)
    - 04-02 (home.* i18n keys in messages/en.json + messages/da.json)
    - 04-03 (ShopCard component + ShopCardEntry interface)
  provides:
    - Homepage (src/app/[locale]/page.tsx — real 4-section page)
  affects:
    - All visitors — this is the primary landing page

tech_stack:
  added: []
  patterns:
    - "createReader(process.cwd(), keystaticConfig) in RSC — established Keystatic Reader API pattern"
    - "reader.collections.works.read(slug) returns entry directly (not {slug, entry}) — slug tracked separately in map"
    - "shopPreviewWorksRaw.filter() with published===true && saleStatus==='available' — CMS content gate"
    - "LINEN_BLUR inline base64 blur placeholder — avoids plaiceholder dependency for MVP"
    - "aboutText split on \\n\\n for paragraph rendering — no dangerouslySetInnerHTML, no DocumentRenderer"
    - "paragraph.slice(0, 40) as React key — avoids index key lint error"

key_files:
  created: []
  modified:
    - src/app/[locale]/page.tsx

decisions:
  - "Both tasks implemented in one atomic file write — incrementally modifying a file that was placeholder-only would have left it in an intermediate broken state; single complete write is cleaner"
  - "paragraph.slice(0, 40) used as React list key for about text paragraphs — stable key from content avoids Biome no-array-index-key lint error"
  - "max-w-screen-xl retained (not rewritten to max-w-7xl) — Biome warning only, not error; consistent with gallery page pattern"

metrics:
  duration: "~15 minutes"
  completed: "2026-04-19"
  tasks_completed: 2
  files_created: 0
  files_modified: 1
---

# Phase 04 Plan 04: Homepage Summary

**One-liner:** Real homepage replacing "Coming soon" placeholder — full-bleed 100vh hero, shop preview grid (filtered published+available), bilingual about section with photo, and custom order CTA — all driven by Keystatic Reader API in RSC.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Replace homepage placeholder with hero + shop preview | 9a73f18 | src/app/[locale]/page.tsx |
| 2 | Add about section and custom order CTA | 9a73f18 | src/app/[locale]/page.tsx (same commit) |

## What Was Built

`src/app/[locale]/page.tsx` — fully statically-rendered homepage with four sections:

**Hero Section (HOME-01)**
- Full-bleed `h-screen min-h-svh` section (iOS Safari viewport fix from RESEARCH.md Pitfall 6)
- `next/image` with `fill`, `priority`, `sizes="100vw"` and inline LINEN_BLUR base64 placeholder
- Graceful empty state when no hero work is configured in CMS
- Scroll indicator: `aria-hidden="true"` div with ChevronDown (lucide-react) and `motion-safe:animate-bounce`

**Shop Preview Section (HOME-02)**
- Two-line header: section heading (left) + "View all" link to `/shop` (right)
- `reader.collections.works.read(slug)` pattern — slug tracked via `shopPreviewWorksRaw.map()`, filter applied after
- Filter: `published === true && saleStatus === "available"` (RESEARCH.md Pitfall 5 fix)
- Responsive grid: 1 col → 2 col sm → 3 col lg, max 6 cards via `.slice(0, 6)`
- ShopCard receives reconstructed `entry` shape from reader data + locale-aware labels

**About Section (HOME-04)**
- `bg-oat` background, asymmetric 2-column grid on lg (`lg:grid-cols-[2fr_3fr]`)
- Photo: `next/image` fill + `object-cover`, locale-aware alt text, fallback empty `bg-oat` div
- Bio text: `.split("\n\n")` paragraphs from `fields.text({ multiline: true })` — no `dangerouslySetInnerHTML`, no `DocumentRenderer`

**Custom Order CTA Section (HOME-03)**
- Centered, `max-w-2xl`, terracotta button linking to `/custom-orders`
- `Link` from `@/i18n/navigation` — locale prefix automatic (`/da/custom-orders`, `/en/custom-orders`)
- Route may 404 until Phase 5 delivers the custom orders page — acceptable stub behavior

## Verification Results

All plan verification checks passed:
- `pnpm build` exits 0 — compiled successfully, 7/7 static pages generated
- No `dangerouslySetInnerHTML` in file
- No "Coming soon" text in file
- `h-screen min-h-svh` present (iOS Safari fix)
- `aria-hidden="true"` present on scroll indicator
- `/custom-orders` href present (CTA link)
- `published === true` filter present
- `createReader` from `@keystatic/core/reader` used
- `Image` from `"next/image"` used (not `<img>`)
- `split("\n\n")` present for paragraph rendering

## Deviations from Plan

### Implementation Notes

**1. Tasks 1 and 2 implemented in single atomic commit**
- **Found during:** Task 1 execution
- **Reason:** `page.tsx` was a placeholder — writing the complete file in one go is cleaner than incrementally adding sections to an intermediate broken state. Both tasks modify the same file and are logically coupled.
- **Impact:** Single commit `9a73f18` covers both tasks. All done criteria for both tasks are satisfied.

**2. [Rule 2 - Missing validation] paragraph.slice(0, 40) as React key**
- **Found during:** Task 2 — Biome `noArrayIndexKey` lint error on `key={i}` in paragraph map
- **Fix:** Replaced `key={i}` with `key={paragraph.slice(0, 40)}` — stable, content-derived key
- **Rationale:** About text paragraphs don't reorder, so slice key is stable and avoids the lint error

**3. [Rule 1 - Bug] CSS class ordering fixed for Biome useSortedClasses**
- **Found during:** Task 1 — IDE diagnostics reported multiple class ordering errors
- **Fix:** Reordered Tailwind utility classes to match Biome's expected sort order throughout the file
- **Key changes:** `flex -translate-x-1/2 flex-col` → `flex ... flex-col` (layout before transforms), `transition-colors ... hover:underline hover:decoration-...` reordered

## Known Stubs

- `/custom-orders` link in CTA section — route doesn't exist yet. Will 404 until Phase 5 (plan 04-06 or Phase 5) delivers the custom orders page. The link itself is correct and locale-aware; this is an intentional inter-phase dependency.

## Threat Surface Scan

No new network endpoints, auth paths, or schema changes introduced. All CMS strings (about text, titles, alt text) rendered as JSX text nodes via React — HTML entities escaped automatically. No `dangerouslySetInnerHTML`. Threat model T-04-04-01 through T-04-04-04 all handled as specified.

## Self-Check: PASSED

- [x] `src/app/[locale]/page.tsx` exists and contains all 4 sections
- [x] Commit `9a73f18` exists in git log
- [x] `pnpm build` exits 0
- [x] All plan verification grep checks pass
