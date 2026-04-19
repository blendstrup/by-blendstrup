---
phase: 03-gallery-works
plan: 01
subsystem: cms-schema, i18n, testing
tags: [keystatic, schema, i18n, vitest, gallery, filter]
dependency_graph:
  requires: []
  provides:
    - keystatic.config.ts#collections.works
    - keystatic.config.ts#collections.categories
    - keystatic.config.ts#singletons.homepage
    - messages/en.json#gallery
    - messages/da.json#gallery
    - src/__tests__/gallery-filter.test.ts
    - src/__tests__/i18n-fields.test.ts#gallery
  affects:
    - Plans 02 and 03 (Reader API calls require works + categories collections)
tech_stack:
  added: []
  patterns:
    - Keystatic collection with slugField + bilingual text fields pattern
    - Pure function filter pattern for RSC gallery logic tested without mocking
    - i18n namespace iteration pattern using for..of loop in describe blocks
key_files:
  created:
    - src/__tests__/gallery-filter.test.ts
  modified:
    - keystatic.config.ts
    - messages/en.json
    - messages/da.json
    - src/__tests__/i18n-fields.test.ts
decisions:
  - Used slugField: "slug" on works collection (verbatim field from Phase 2 YAML content files)
  - Navigation groups use bare names ("works", "categories") not prefixed strings — confirmed from Keystatic 0.5.50 API
  - Restored shop.saleStatus namespace alongside new gallery namespace (pre-existing i18n tests referenced it)
metrics:
  duration: "~15 minutes"
  completed: "2026-04-19"
  tasks_completed: 2
  files_changed: 5
---

# Phase 03 Plan 01: Schema Restore & Gallery i18n Summary

**One-liner:** Keystatic works/categories/homepage schema restored with slugField, bilingual fields, and multiRelationship wiring; gallery i18n namespace (13 keys EN + DA) added; Wave 0 filter and i18n regression tests green at 45/45.

## What Was Built

**Task 1 — Restore Keystatic schema (works + categories + homepage)**

Rewrote `keystatic.config.ts` to add:
- `categories` collection (`slugField: "name"`, path `content/categories/*`, bilingual nameDa/nameEn)
- `works` collection (`slugField: "slug"`, path `content/works/*/`, with published, bilingual title/description, saleStatus select, price, leadTime, categories multiRelationship, images array)
- `homepage` singleton (heroWorks + shopPreviewWorks multiRelationship fields, both capped at 3 and 6 respectively)
- `ui.navigation` with Pieces / Taxonomy / Pages groups using bare collection/singleton names

All 5 assertions in `keystatic-schema.test.ts` pass. TypeScript compiles clean (`tsc --noEmit` exits 0).

**Task 2 — Add gallery i18n keys + Wave 0 test files**

- Extended `messages/en.json` and `messages/da.json` with `gallery` namespace (13 keys each) using the copywriting contract from 03-UI-SPEC.md
- Restored `shop.saleStatus` namespace in both message files (removed in Phase 2 cleanup, referenced by pre-existing i18n test)
- Created `src/__tests__/gallery-filter.test.ts` with 8 tests covering publishedFilter, forSaleFilter, sold exclusion, notListed exclusion, and empty-input safety
- Extended `src/__tests__/i18n-fields.test.ts` with 26 gallery.* key assertions for both locales

Final test suite: 45 tests, 3 files, all green. Biome check clean.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Added slugField to collection definitions**
- **Found during:** Task 1 — tsc --noEmit flagged missing `slugField` property
- **Issue:** Keystatic 0.5.50 `collection()` requires `slugField` to be specified; omitting it causes a TypeScript error
- **Fix:** Added `slugField: "name"` to categories and `slugField: "slug"` to works; added `slug: fields.slug(...)` to works schema
- **Files modified:** keystatic.config.ts
- **Commit:** bdc5367

**2. [Rule 1 - Bug] Fixed navigation format from prefixed to bare names**
- **Found during:** Task 1 — tsc --noEmit flagged type incompatibility on navigation values
- **Issue:** Navigation groups in Keystatic 0.5.50 expect bare collection/singleton names (`"works"`) not prefixed strings (`"collections.works"`)
- **Fix:** Changed all navigation values to bare names matching the keys in `collections:` and `singletons:`
- **Files modified:** keystatic.config.ts
- **Commit:** bdc5367

**3. [Rule 1 - Bug] Restored shop.saleStatus namespace**
- **Found during:** Task 2 — pre-existing i18n-fields.test.ts was failing because shop.saleStatus keys were removed in Phase 2 cleanup
- **Issue:** `i18n-fields.test.ts` asserted `shop.saleStatus.available/sold/notListed` but these keys no longer existed in either message file
- **Fix:** Restored `shop` namespace with `saleStatus`, `filterAll`, `filterAvailable`, `contactToBuy` keys in both EN and DA
- **Files modified:** messages/en.json, messages/da.json
- **Commit:** 9d5b04c

## Known Stubs

None — this plan creates schema and test infrastructure only; no UI rendering code was written.

## Threat Flags

None — no new network endpoints, auth paths, or schema changes at external trust boundaries introduced. The published filter logic (T-3-01 mitigation) is verified by gallery-filter.test.ts.

## Self-Check: PASSED

Files verified:
- keystatic.config.ts — present, contains `collections.works`, `collections.categories`, `singletons.homepage`, `ui.navigation`
- messages/en.json — present, contains `gallery` namespace with 13 keys
- messages/da.json — present, contains `gallery` namespace with 13 keys
- src/__tests__/gallery-filter.test.ts — present, 8 tests
- src/__tests__/i18n-fields.test.ts — present, extended with gallery.* assertions

Commits verified:
- bdc5367 — feat(03-01): restore Keystatic schema
- 9d5b04c — feat(03-01): add gallery i18n namespace + Wave 0 test files
