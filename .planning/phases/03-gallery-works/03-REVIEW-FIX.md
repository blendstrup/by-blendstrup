---
phase: 03-gallery-works
fixed_at: 2026-04-19T00:00:00Z
review_path: .planning/phases/03-gallery-works/03-REVIEW.md
iteration: 1
findings_in_scope: 4
fixed: 4
skipped: 0
status: all_fixed
---

# Phase 03: Code Review Fix Report

**Fixed at:** 2026-04-19
**Source review:** .planning/phases/03-gallery-works/03-REVIEW.md
**Iteration:** 1

**Summary:**
- Findings in scope: 4
- Fixed: 4
- Skipped: 0

## Fixed Issues

### CR-01: `generateStaticParams` omits `locale` — detail page static generation is broken

**Files modified:** `src/app/[locale]/gallery/[slug]/page.tsx`
**Commit:** 1a01cd7
**Applied fix:** Changed `generateStaticParams` from returning `{ slug }` only to using `flatMap` over `["da", "en"]` locales, returning `{ locale, slug }` pairs for every published work — ensuring Next.js pre-renders detail pages for both locales.

### WR-01: Work title is never rendered in `WorkCard`

**Files modified:** `src/components/WorkCard.tsx`
**Commit:** 6ef6937
**Applied fix:** Added `locale` to the function destructuring, derived `title` from `entry.titleDa` or `entry.titleEn` based on locale, and appended a `<p>` element below the image block to render the title. Biome auto-sorted the Tailwind class order on the new paragraph element.

### WR-02: `fieldset` legend text is the "All" button label, not a group description

**Files modified:** `src/components/GalleryFilterToggle.tsx`, `messages/en.json`, `messages/da.json`
**Commit:** b4c337d
**Applied fix:** Changed `<legend>` to use `t("filterLabel")` instead of `t("filterAll")`. Added `"filterLabel": "Filter works"` to `en.json` and `"filterLabel": "Filtrer arbejder"` to `da.json` inside the `gallery` namespace.

### WR-03: React key based on image path is fragile in `WorkDetail`

**Files modified:** `src/components/WorkDetail.tsx`
**Commit:** b8a09b6
**Applied fix:** Changed `images.slice(1).map((img) => ...)` to `images.slice(1).map((img, i) => ...)` and updated the key from `key={img.image}` to `key={img.image || i}`, so empty-path images fall back to their array index instead of all colliding on key `""`.

---

_Fixed: 2026-04-19_
_Fixer: Claude (gsd-code-fixer)_
_Iteration: 1_
