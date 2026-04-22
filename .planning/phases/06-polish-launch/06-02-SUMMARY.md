---
phase: 06-polish-launch
plan: 02
subsystem: seo
tags: [seo, metadata, sitemap, robots, og-image]
dependency_graph:
  requires: []
  provides: [baseMetadata, sitemap.xml, robots.txt, og-default.jpg]
  affects: [all-pages, search-engines]
tech_stack:
  added: []
  patterns: [App Router sitemap.ts, App Router robots.ts, shared Metadata object]
key_files:
  created:
    - src/lib/metadata.ts
    - src/app/sitemap.ts
    - src/app/robots.ts
    - public/og-default.jpg
    - .env.example
  modified:
    - src/app/gallery/[slug]/page.tsx
    - src/actions/custom-order.ts
    - src/actions/purchase-inquiry.ts
    - src/app/contact/page.tsx
    - src/app/gallery/page.tsx
    - src/app/page.tsx
    - src/__tests__/shop-filter.test.ts
decisions:
  - "I18N-04 (hreflang) formally retired — site is Danish-only, no hreflang code written"
  - "OG image created from existing ceramic photograph (bowl-test) using sips; 1200x630 JPEG"
  - "Pre-existing biome format/import violations fixed across src/ to allow build gate to pass"
metrics:
  duration: ~15min
  completed: "2026-04-22"
  tasks_completed: 2
  tasks_total: 2
  files_created: 5
  files_modified: 7
---

# Phase 06 Plan 02: SEO Infrastructure Summary

**One-liner:** Shared baseMetadata object, App Router sitemap.xml with dynamic Keystatic gallery routes, robots.txt blocking /keystatic/, and 1200x630 OG fallback image from ceramic photo.

## What Was Built

Complete SEO infrastructure for By Blendstrup:

1. **`src/lib/metadata.ts`** — Exports `baseMetadata` with `metadataBase` (from `NEXT_PUBLIC_SITE_URL` env var), title template (`%s — By Blendstrup`), Danish-language description, OpenGraph config pointing to og-default.jpg, robots allow all, Twitter card.

2. **`src/app/sitemap.ts`** — Async App Router sitemap function. Reads published works from Keystatic via `createReader` + `reader.collections.works.all()`. Static routes: `/`, `/gallery`, `/contact`, `/custom-orders`. Dynamic routes: `/gallery/${slug}` for each published work.

3. **`src/app/robots.ts`** — Robots function disallowing `/keystatic/` from all user agents. Includes sitemap URL. Mitigates T-06-04 (admin UI exposure to search engines).

4. **`public/og-default.jpg`** — 1200x630 JPEG created from existing bowl-test ceramic photograph using `sips` (macOS). Serves as fallback for all pages without dedicated ceramic photos.

5. **`.env.example`** — Documents `NEXT_PUBLIC_SITE_URL=https://byblendstrup.dk` and comments `RESEND_API_KEY` for deployment reference.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed pre-existing biome format/import order violations**
- **Found during:** Task 1 (running `pnpm biome check src/` per acceptance criteria)
- **Issue:** 7 existing files had biome format and import order violations — these were pre-existing but blocked the task's verification gate
- **Fix:** Applied `pnpm biome check --fix src/` to automatically resolve all violations
- **Files modified:** `src/app/gallery/[slug]/page.tsx`, `src/actions/custom-order.ts`, `src/actions/purchase-inquiry.ts`, `src/app/contact/page.tsx`, `src/app/gallery/page.tsx`, `src/app/page.tsx`, `src/__tests__/shop-filter.test.ts`
- **Commit:** 64f45d4

**2. [Rule 3 - Blocking] Used sips instead of sharp for OG image generation**
- **Found during:** Task 2
- **Issue:** sharp was not installed in the worktree node_modules (plan assumed it was available)
- **Fix:** Used macOS built-in `sips` tool to convert and resize the PNG ceramic photo to 1200x630 JPEG
- **Files created:** `public/og-default.jpg`
- **Commit:** cf4df0e

## Key Decisions

- **I18N-04 formally retired:** No hreflang code written. Site is Danish-only (confirmed in Phase 4 i18n removal). This decision closes the requirement formally.
- **No /shop route in sitemap:** Shop = gallery?filter=for-sale per Phase 4 decision. Sitemap includes `/gallery` but not `/shop`.
- **NEXT_PUBLIC_SITE_URL fallback:** Hardcoded to `https://byblendstrup.dk` so builds don't fail without the env var set.

## Known Stubs

None. All files wire to real data sources (Keystatic for sitemap dynamic routes, env var for SITE_URL).

## Threat Flags

| Flag | File | Description |
|------|------|-------------|
| threat_flag: information_disclosure mitigated | src/app/robots.ts | /keystatic/ admin UI blocked from search engine indexing (T-06-04) |

## Self-Check: PASSED

- `src/lib/metadata.ts` — FOUND
- `src/app/sitemap.ts` — FOUND
- `src/app/robots.ts` — FOUND
- `public/og-default.jpg` — FOUND
- `.env.example` — FOUND
- Commit `64f45d4` — FOUND
- Commit `cf4df0e` — FOUND
- `pnpm build` exits 0 — CONFIRMED (routes include /robots.txt and /sitemap.xml)
- `pnpm biome check src/` exits 0 — CONFIRMED
