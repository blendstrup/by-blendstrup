---
id: 260420-c1o
type: quick
phase: quick
plan: 260420-c1o
subsystem: i18n / routing / components
tags: [i18n-removal, refactor, danish-only, routing, keystatic-schema]
dependency_graph:
  requires: []
  provides: [danish-only-routing, single-language-schema, no-locale-prefix-urls]
  affects: [all-pages, all-components, keystatic-cms, content-yaml]
tech_stack:
  removed: [next-intl middleware, i18n routing, LanguageToggle, bilingual schema fields]
  patterns: [direct-json-import for UI strings, next/link everywhere, single-language Keystatic fields]
key_files:
  deleted:
    - src/middleware.ts
    - src/i18n/routing.ts
    - src/i18n/navigation.ts
    - src/i18n/request.ts
    - messages/en.json
    - src/components/LanguageToggle.tsx
    - src/__tests__/i18n-fields.test.ts
    - src/app/[locale]/layout.tsx
    - src/app/[locale]/page.tsx
    - src/app/[locale]/gallery/page.tsx
    - src/app/[locale]/gallery/[slug]/page.tsx
    - src/app/[locale]/contact/page.tsx
  created:
    - src/app/gallery/page.tsx
    - src/app/gallery/[slug]/page.tsx
    - src/app/contact/page.tsx
  modified:
    - src/app/layout.tsx
    - src/app/page.tsx
    - src/components/SiteHeader.tsx
    - src/components/NavLinks.tsx
    - src/components/GalleryFilterToggle.tsx
    - src/components/GalleryGrid.tsx
    - src/components/WorkCard.tsx
    - src/components/ShopCard.tsx
    - src/components/WorkDetail.tsx
    - keystatic.config.ts
    - next.config.ts
    - content/about.yaml
    - content/works/bowl-test/index.yaml
    - content/categories/bowls.yaml
decisions:
  - "Direct import of messages/da.json replaces next-intl useTranslations/getTranslations"
  - "Pages moved from /[locale]/* to /* — root paths, no locale prefix"
  - "Keystatic schema fields consolidated from Da/En pairs to single fields (title, description, aboutText, photoAlt, displayName)"
  - "GalleryGrid and WorkCard drop locale prop — single title field used directly"
  - "next.config.ts exports plain NextConfig — next-intl plugin removed"
metrics:
  duration: "~20 minutes"
  completed_date: "2026-04-20"
  tasks_completed: 3
  files_changed: 27
---

# Quick Task 260420-c1o: Remove i18n Setup and English Language Support

**One-liner:** Stripped next-intl entirely — pages moved to root paths, Keystatic schema consolidated from Da/En pairs to single Danish fields, all components wired to direct da.json imports.

## What Was Done

The site is now Danish-only with no locale prefix in URLs. All three tasks executed cleanly:

**Task 1 — Delete i18n infrastructure and move pages:**
- Deleted `src/middleware.ts`, `src/i18n/` directory, `messages/en.json`, `LanguageToggle.tsx`, `i18n-fields.test.ts`
- Deleted entire `src/app/[locale]/` directory
- Rewrote `src/app/layout.tsx` — now includes SiteHeader/SiteFooter, `lang="da"`, skip link using `da.navigation.skipToContent`, no NextIntlClientProvider
- Created `src/app/page.tsx`, `src/app/gallery/page.tsx`, `src/app/gallery/[slug]/page.tsx`, `src/app/contact/page.tsx` with direct `da.json` imports replacing all `getTranslations` calls
- `next.config.ts` — plain `NextConfig`, no next-intl plugin

**Task 2 — Consolidate Keystatic schema:**
- `works` schema: `titleDa`/`titleEn` → `title`; `descriptionDa`/`descriptionEn` → `description`
- `about` singleton: `aboutTextDa`/`aboutTextEn` → `aboutText`; `photoAltDa`/`photoAltEn` → `photoAlt`
- `categories` schema: `nameDa`/`nameEn` → `displayName`
- All content YAML files updated to match: `content/about.yaml`, `content/works/bowl-test/index.yaml`, `content/categories/bowls.yaml`

**Task 3 — Remove next-intl from components:**
- `SiteHeader`: replaced `useTranslations` + `@/i18n/navigation Link` with standard `next/link` + direct `da.json`
- `NavLinks`: replaced `useTranslations` + `@/i18n/navigation` with `next/navigation` + direct `da.json`
- `GalleryFilterToggle`: replaced `@/i18n/navigation` router/pathname with `next/navigation`; replaced `useTranslations` with direct `da.json`
- `GalleryGrid`: removed `locale` prop
- `WorkCard`: removed `locale` prop + Da/En title branching; `WorkCardEntry` uses single `title` field
- `ShopCard`: removed `locale` prop + Da/En title branching; `ShopCardEntry` uses single `title` field
- `WorkDetail`: replaced `@/i18n/navigation Link` with `next/link`

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed pre-existing TypeScript strict error in shop-filter.test.ts**
- **Found during:** Task 3 verification (`npx tsc --noEmit`)
- **Issue:** `result[0].slug` on line 23 — TypeScript strict mode flags array element access as possibly undefined
- **Fix:** Changed to `result[0]?.slug` optional chaining
- **Files modified:** `src/__tests__/shop-filter.test.ts`
- **Commit:** 1daf834

**2. [Rule 3 - Blocking] Cleared stale .next/types cache**
- **Found during:** First TypeScript check after Task 1
- **Issue:** `.next/types/app/[locale]/` directory still referenced deleted files, causing 13 spurious errors
- **Fix:** Deleted `.next/` directory before final TypeScript check
- **Impact:** None — .next is a build artifact, not source

## Verification

- `grep -r "next-intl|@/i18n|useTranslations|getTranslations" src/` → no matches
- `npx tsc --noEmit` → zero errors
- `pnpm vitest run` → 116 tests pass (7 test files)
- `src/app/[locale]/` directory → deleted
- `src/i18n/` directory → deleted
- `content/about.yaml` → no `aboutTextDa`, `photoAltDa`, `photoAltEn` fields

## Known Stubs

None introduced by this plan. Pre-existing stubs (contact/purchase form, custom-orders page) are unchanged.

## Threat Flags

None. This refactor reduces attack surface by removing the locale-injection vector that previously existed in middleware (T-c1o-01 accepted). No new network endpoints or auth paths introduced.

## Self-Check: PASSED

- `src/app/gallery/page.tsx` — exists
- `src/app/gallery/[slug]/page.tsx` — exists
- `src/app/contact/page.tsx` — exists
- `src/app/layout.tsx` — exists, contains `lang="da"` and SiteHeader/SiteFooter
- `keystatic.config.ts` — single-language fields confirmed
- Commit `1daf834` — verified in git log
- All 116 tests pass
