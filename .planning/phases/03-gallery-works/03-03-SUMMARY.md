---
phase: 03-gallery-works
plan: 03
subsystem: gallery-ui, detail-page, rsc, i18n
tags: [gallery, detail, rsc, keystatic, next-image, tailwind, notFound, generateStaticParams]
dependency_graph:
  requires:
    - 03-01-PLAN.md (works schema + gallery i18n keys including contactToBuy, soldMessage, soldCta)
    - 03-02-PLAN.md (WorkCard types, StatusBadge, GalleryGrid, SiteHeader nav link)
  provides:
    - src/app/[locale]/gallery/[slug]/page.tsx
    - src/components/WorkDetail.tsx
  affects:
    - Phase 4 (custom-orders page — detail page CTAs already link to /custom-orders)
    - Phase 6 (plaiceholder blur placeholder enhancement)
tech_stack:
  added: []
  patterns:
    - generateStaticParams slug-only approach (locale inherited from parent segment)
    - notFound() guard for null work OR unpublished work (T-3-01 + T-3-08)
    - Locale-aware sibling-field selection (titleDa/titleEn, descriptionDa/descriptionEn)
    - CSS Grid lg:grid-cols-[55fr_45fr] for side-by-side desktop layout
    - 1x1 JPEG base64 blurDataURL for placeholder on dynamic image src paths
    - Image null coalesce mapping (Keystatic returns string | null, WorkDetail expects string)
key_files:
  created:
    - src/components/WorkDetail.tsx
    - src/app/[locale]/gallery/[slug]/page.tsx
  modified: []
decisions:
  - Used 1x1 JPEG base64 blurDataURL inline rather than plaiceholder — plaiceholder is a Phase 6 enhancement; inline placeholder satisfies next/image requirement without a build-time image processing step
  - generateStaticParams returns slug-only (not locale+slug pairs) — Next.js inherits locale from parent [locale] segment, confirmed by build passing without locale in return type
  - Images array cast to Array<{ image: string | null; alt: string }> then mapped to string (null coalesce) — Keystatic Reader returns nullable image field, WorkDetail interface requires string; cast + map is safer than any suppression
metrics:
  duration: "~15 minutes"
  completed: "2026-04-19"
  tasks_completed: 2
  files_changed: 2
---

# Phase 03 Plan 03: Work Detail Page Summary

**One-liner:** Work detail page RSC at /[locale]/gallery/[slug] with side-by-side desktop layout (55/45 grid), sold treatment ghost CTA, notFound guard for draft/unknown slugs, and generateStaticParams for all published works.

## What Was Built

**Task 1 — WorkDetail component**

Created `src/components/WorkDetail.tsx` — server-compatible component (no "use client").

Structure:
- Outer `<article>` with `max-w-screen-lg mx-auto px-12 py-16 lg:px-16 lg:py-24`
- `grid grid-cols-1 gap-8 lg:grid-cols-[55fr_45fr]` — stacked mobile, side-by-side desktop
- Left column: primary image with `next/image` fill, `priority`, `placeholder="blur"`, 1x1 JPEG blurDataURL, `sizes="(max-width: 1024px) 100vw, 55vw"`. Falls back to `bg-oat` placeholder div when images array is empty.
- Right column: `h1` in Fraunces serif 28px, description paragraph, conditional CTA block:
  - `available`: terracotta filled `bg-terracotta text-linen hover:bg-fault` Link to /custom-orders
  - `sold`: stone soldMessage text + ghost `border-terracotta text-terracotta hover:bg-terracotta hover:text-linen` Link to /custom-orders
  - `notListed`: no CTA (comment explains intentional omission)
- Additional images (slice 1+): `grid grid-cols-2 gap-4` with `aspect-[4/5] overflow-hidden`, lazy loaded
- All Links use `@/i18n/navigation` (locale-prepended automatically)
- All images use `next/image` Image component (no `<img>` tags)

**Task 2 — Detail page RSC with generateStaticParams and notFound guard**

Created `src/app/[locale]/gallery/[slug]/page.tsx` — async RSC.

- `generateStaticParams`: calls `reader.collections.works.all()`, filters `.filter(w => w.entry.published)`, maps to `{ slug: w.slug }` — slug-only (locale inherited from parent segment)
- Page component: awaits `params` (Next.js 15 async params), calls `reader.collections.works.read(slug)`, guards with `if (!work || !work.published) notFound()` covering T-3-01 (unknown slug) and T-3-08 (draft access)
- Locale-aware field selection: `locale === "da" ? work.titleDa : work.titleEn`
- Images mapped from Keystatic's `string | null` to `string` (null coalesce) before passing to WorkDetail
- `ctaLabels` sourced from `getTranslations("gallery")` — keys `contactToBuy`, `soldMessage`, `soldCta`

Build output: `pnpm build` succeeds. `generateStaticParams` returns empty array (no published works in test data — bowl-test has `published: false`), so the route is registered but not pre-rendered as static pages at build time. This is correct behavior per the plan.

Final verification: 90/90 tests pass, `tsc --noEmit` clean, `biome check src/` clean (26 files, no errors), no `<img>` tags in gallery/detail files.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed Biome class-sort violations in WorkDetail**
- **Found during:** Task 1 verification — `biome check` reported `useSortedClasses` errors on 4 class strings
- **Issue:** Tailwind class order in the plan's code snippets didn't match Biome's expected canonical sort order (e.g. `font-serif text-[28px] font-normal` → `font-normal font-serif text-[28px]`)
- **Fix:** Reordered class strings to match Biome's sort — purely cosmetic, no behavioral change
- **Files modified:** src/components/WorkDetail.tsx
- **Commit:** 118a3a4

**2. [Rule 1 - Bug] Used image path as key instead of array index in additional images map**
- **Found during:** Task 1 verification — Biome flagged `noArrayIndexKey` and the `biome-ignore` suppression as unused (because Biome's suppression comment must appear on the same line as the linted node, not the line before)
- **Issue:** `key={i}` in additional images `.map((img, i) => ...)` triggered `noArrayIndexKey`; the suppress comment was placed incorrectly and triggered `suppressions/unused`
- **Fix:** Changed key to `key={img.image}` — image paths are unique per entry, making index keys unnecessary
- **Files modified:** src/components/WorkDetail.tsx
- **Commit:** 118a3a4

**3. [Rule 1 - Bug] Fixed Biome formatter violations in detail page**
- **Found during:** Task 2 verification — Biome formatter expected single-line chained `.filter().map()` call and reformatted `images` prop to inline form
- **Issue:** Multi-line chained call and braced images prop JSX formatting did not match Biome's print width rules
- **Fix:** Collapsed to single-line `.filter().map()` and removed outer braces on images prop
- **Files modified:** src/app/[locale]/gallery/[slug]/page.tsx
- **Commit:** 844ccd4

## Known Stubs

None. The WorkDetail component renders live data passed from the detail page RSC. The 1x1 blurDataURL placeholder is intentional and documented — it is not a data stub but a performance implementation choice (plaiceholder is Phase 6).

## Threat Flags

None — no new network endpoints or external trust boundaries introduced beyond what the plan's threat model covers.

Security mitigations confirmed:
- T-3-01: `if (!work || !work.published) notFound()` present in `src/app/[locale]/gallery/[slug]/page.tsx` line 26
- T-3-08: Same guard covers draft work access (unpublished slug returns 404)
- T-3-10: Link href="/custom-orders" is hardcoded internal path; no user-controlled input in href

## Self-Check: PASSED

Files verified present:
- src/components/WorkDetail.tsx — contains `grid-cols-1`, `lg:grid-cols-[55fr_45fr]`, `saleStatus === "available"`, `saleStatus === "sold"`, `@/i18n/navigation`, no `<img>` tags
- src/app/[locale]/gallery/[slug]/page.tsx — contains `generateStaticParams`, `.filter((w) => w.entry.published)`, `notFound()`, `!work.published`, `locale === "da" ? work.titleDa : work.titleEn`

Commits verified:
- 118a3a4 — feat(03-03): WorkDetail component — side-by-side desktop layout with conditional CTAs
- 844ccd4 — feat(03-03): detail page RSC with generateStaticParams and notFound guard

Build verified: `pnpm build` exits 0, 90/90 tests pass, tsc clean, biome clean.
