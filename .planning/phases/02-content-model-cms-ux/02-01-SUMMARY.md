---
phase: "02-content-model-cms-ux"
plan: "01"
subsystem: "cms-schema"
tags: ["keystatic", "schema", "i18n", "vitest", "content-model"]

dependency_graph:
  requires:
    - "01-03: Keystatic Admin UI and settings singleton installed"
  provides:
    - "works collection with full ceramics data model (bilingual, multi-image, saleStatus)"
    - "categories collection for bilingual taxonomy"
    - "homepage singleton for hero/shop-preview curation via multiRelationship"
    - "vitest test suite for schema regression detection"
    - "shop.saleStatus i18n keys for Phase 3/4 gallery and shop pages"
  affects:
    - "Phase 3 gallery RSCs (read works via Reader API)"
    - "Phase 4 homepage/shop RSCs (read homepage singleton + works)"

tech_stack:
  added:
    - "vitest ^4.1.4 — unit test runner"
    - "@vitest/ui ^4.1.4 — test UI"
  patterns:
    - "fields.multiRelationship for cross-collection references (categories on works, hero/shop picks on homepage)"
    - "fields.array(fields.object({image, alt})) for ordered multi-image with required alt text"
    - "Sibling bilingual fields: titleDa/titleEn, descriptionDa/descriptionEn, nameDa/nameEn"
    - "fields.slug as slugField on both collections"
    - "columns: ['saleStatus', 'published'] for admin list-view inventory management"

key_files:
  created:
    - "vitest.config.ts"
    - "src/__tests__/keystatic-schema.test.ts"
    - "src/__tests__/i18n-fields.test.ts"
  modified:
    - "keystatic.config.ts — added works, categories collections; homepage singleton; ui.navigation grouping"
    - "messages/en.json — added shop.saleStatus.{available,sold,notListed} and shop.filter* keys"
    - "messages/da.json — added Danish translations for all shop.* keys"
    - "package.json — added vitest devDependencies and test/test:ui scripts"

decisions:
  - "Used fields.multiRelationship (not fields.multiselect) for category refs — multiselect stores static strings only"
  - "Kept settings singleton inline in config() call (not a named const) — preserves existing structure"
  - "Used unknown-cast type alias instead of 'as any' in test file to satisfy ESLint no-explicit-any rule"
  - "image directory: 'public/images/works' with publicPath: '/images/works/' — /public prefix stripped for Next.js serving"

metrics:
  duration: "~12 minutes"
  completed: "2026-04-19"
  tasks_completed: 2
  tasks_total: 2
  files_created: 3
  files_modified: 4
---

# Phase 02 Plan 01: Keystatic Schema — Works, Categories, Homepage Summary

Keystatic data model for a ceramics shop: works collection with bilingual fields, multi-image upload, three-state sale status, and draft/publish toggle; categories collection with bilingual names; homepage singleton with multiRelationship-based hero and shop-preview curation; vitest schema regression tests; and public-facing i18n shop keys.

## What Was Built

### Task 1: Vitest setup and RED test stubs (commit a32c110)

- Installed `vitest ^4.1.4` and `@vitest/ui` as devDependencies
- Added `"test": "vitest run"` and `"test:ui": "vitest --ui"` scripts to `package.json`
- Created `vitest.config.ts` with node environment targeting `src/__tests__/**/*.test.ts`
- Created `src/__tests__/keystatic-schema.test.ts` — asserts collections.works, collections.categories, singletons.homepage, and ui.navigation exist
- Created `src/__tests__/i18n-fields.test.ts` — asserts shop.saleStatus.{available,sold,notListed} keys exist in both message files
- Both test files compiled cleanly (`pnpm tsc --noEmit` exits 0); `pnpm test` correctly failed (RED state — schema not yet extended)

### Task 2: Schema extension + i18n keys (commit 5dad246)

**`keystatic.config.ts` additions:**

- `categories` collection: `slugField: 'name'`, bilingual `nameDa`/`nameEn` text fields, stored in `content/categories/*`
- `works` collection: `slugField: 'slug'`, `columns: ['saleStatus', 'published']`, full field set:
  - `published` checkbox (default false) — draft/publish toggle
  - `titleDa`/`titleEn` required text (max 120)
  - `descriptionDa`/`descriptionEn` multiline text
  - `saleStatus` select with three options: available / sold / not-listed (default: not-listed)
  - `price` and `leadTime` optional text fields
  - `categories` multiRelationship pointing at categories collection
  - `images` array of objects ({image: fields.image, alt: fields.text}), min 1 max 8, with drag-to-reorder
- `homepage` singleton: `heroWorks` and `shopPreviewWorks` multiRelationship fields (max 3 and 6 respectively)
- `ui.navigation` grouping: Pieces / Taxonomy / Pages

**`messages/en.json` and `messages/da.json`:** Added `shop` namespace with `saleStatus.{available,sold,notListed}`, `filterAll`, `filterAvailable`, `contactToBuy` keys.

**Verification passed:** `pnpm tsc --noEmit` exits 0, `pnpm test` 11/11 green, `pnpm build` succeeds.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] TypeScript type error in i18n-fields.test.ts cast**
- **Found during:** Task 1 — `pnpm tsc --noEmit` verification
- **Issue:** `(en as Record<string, Record<string, Record<string, string>>>)` was rejected by strict TypeScript because the concrete JSON type doesn't overlap with the triple-nested Record type
- **Fix:** Added intermediate `as unknown` cast: `(en as unknown as Messages)` with a named `Messages` type alias
- **Files modified:** `src/__tests__/i18n-fields.test.ts`
- **Commit:** a32c110

**2. [Rule 1 - Bug] ESLint no-explicit-any blocked build in keystatic-schema.test.ts**
- **Found during:** Task 2 — `pnpm build` verification
- **Issue:** `keystaticConfig as any` casts in schema test file triggered `@typescript-eslint/no-explicit-any` ESLint rule during Next.js build lint pass
- **Fix:** Replaced `as any` casts with a named `KeystaticConfigShape` type alias and `as unknown as KeystaticConfigShape` double cast
- **Files modified:** `src/__tests__/keystatic-schema.test.ts`
- **Commit:** 5dad246 (included in Task 2 commit)

## Known Stubs

None. This plan delivers a pure schema and message key layer — no public-facing UI, no data rendering. All fields in the Keystatic Admin UI are fully wired to the YAML storage layer.

## Threat Flags

None. All threat model items from the plan were reviewed:
- T-02-04 (`fields.image` write path): `directory: 'public/images/works'` is a hardcoded string literal with no env var or template interpolation — path traversal is not possible.
- T-02-01 (Admin UI auth): No new routes added; existing `/keystatic` auth from Phase 1 unchanged.
- T-02-02/T-02-03: Accepted per plan disposition.

## Self-Check: PASSED

| Check | Result |
|-------|--------|
| keystatic.config.ts exists | FOUND |
| vitest.config.ts exists | FOUND |
| src/__tests__/keystatic-schema.test.ts exists | FOUND |
| src/__tests__/i18n-fields.test.ts exists | FOUND |
| messages/en.json exists | FOUND |
| messages/da.json exists | FOUND |
| commit a32c110 (Task 1) exists | FOUND |
| commit 5dad246 (Task 2) exists | FOUND |
