---
phase: 03-gallery-works
verified: 2026-04-19T16:25:00Z
status: human_needed
score: 9/9 must-haves verified
overrides_applied: 0
human_verification:
  - test: "Navigate to /en/gallery and inspect the grid layout at three breakpoints"
    expected: "3-column grid at >=1024px, 2-column at 640-1023px, 1-column below 640px. Cards are image-only with 4:5 aspect ratio. Hovering shows a subtle scale effect."
    why_human: "Responsive layout and hover transitions cannot be verified without a running browser."
  - test: "Open Keystatic at /keystatic, set bowl-test to published:true and saleStatus:'available', save, reload /en/gallery"
    expected: "Piece appears in the grid with a terracotta 'For Sale' badge overlaid on the image."
    why_human: "No published test content exists in the repo (bowl-test has published:false). Status badge rendering requires a live browser with published content."
  - test: "With a published piece visible, change saleStatus to 'sold' in Keystatic and reload /en/gallery"
    expected: "Stone 'Sold' badge appears at top-left of the card image."
    why_human: "Requires live content state and browser rendering."
  - test: "Click the 'For Sale' filter tab on the gallery page"
    expected: "URL changes to ?filter=for-sale, grid narrows to available pieces only. Active tab has terracotta bottom border, inactive tab has transparent border."
    why_human: "URL update and active-state CSS require a running browser."
  - test: "Click a piece card to navigate to its detail page (e.g. /en/gallery/bowl-test after publishing it)"
    expected: "Desktop: primary image occupies ~55% left column, title + description + CTA on the right. Mobile (375px): image stacked above text."
    why_human: "CSS grid side-by-side layout and responsive stacking require a running browser."
  - test: "On the detail page of an available piece, verify the 'Contact to buy' CTA"
    expected: "Terracotta filled button. Clicking links to /custom-orders (locale-prepended)."
    why_human: "CTA rendering and link target require browser interaction."
  - test: "On the detail page of a sold piece, verify the sold treatment"
    expected: "'This piece has been sold.' text visible. Ghost 'Commission something similar →' button below. No filled CTA."
    why_human: "Conditional CTA rendering requires live content with sold status."
  - test: "Visit /en/gallery/does-not-exist"
    expected: "Next.js 404 page returned — not a crash or blank page."
    why_human: "notFound() behavior needs browser verification, though code grep confirms it is present."
  - test: "Toggle language on the gallery page and on a detail page"
    expected: "Gallery: URL changes to /da/gallery or /en/gallery. Detail page: title and description switch to the Danish or English variant."
    why_human: "Locale switching and locale-aware field rendering require a live browser."
---

# Phase 3: Gallery & Works Verification Report

**Phase Goal:** Build the public-facing Gallery & Works section — schema, grid page, and detail page — so visitors can browse and discover ceramic works.
**Verified:** 2026-04-19T16:25:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Visitor can browse every published piece in a uniform grid layout | VERIFIED | `GalleryGrid` renders `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` ul; gallery RSC filters `w.entry.published`, passes works array to GalleryGrid |
| 2 | Visitor can click a piece and land on a detail page with full imagery and description in their chosen language | VERIFIED | Detail page RSC at `[slug]/page.tsx` reads `locale`, selects `titleDa/titleEn` and `descriptionDa/descriptionEn`, passes to `WorkDetail`; `WorkCard` wraps in `<Link href="/gallery/{slug}">` |
| 3 | Visitor can filter the gallery to show only currently for-sale pieces | VERIFIED | Gallery RSC reads `searchParams.filter`, applies `saleStatus === "available"` filter when `filter === "for-sale"`; `GalleryFilterToggle` client component sets `?filter=for-sale` param via `useRouter.push` |
| 4 | Sold pieces remain visible in the grid with a clear "Sold" label and a CTA linking to the custom order form | VERIFIED | `StatusBadge` renders `bg-stone` "Sold" badge for `saleStatus === "sold"`; sold pieces pass `publishedFilter` but not `forSaleFilter`; detail page renders `soldMessage` + ghost CTA to `/custom-orders` |
| 5 | Keystatic schema exports works collection, categories collection, and homepage singleton | VERIFIED | `keystatic.config.ts` defines `works`, `categories` collections and `homepage`, `settings` singletons; all 5 `keystatic-schema.test.ts` assertions pass |
| 6 | Both message files contain gallery.* namespace with all 13 required keys in EN and DA | VERIFIED | `messages/en.json` and `messages/da.json` both contain `gallery` object with 13 keys (title, filterAll, filterForSale, soldLabel, forSaleLabel, contactToBuy, soldMessage, soldCta, emptyAllHeading, emptyAllBody, emptyForSaleHeading, emptyForSaleBody, emptyForSaleCta) |
| 7 | Draft pieces (published:false) are never shown in the gallery grid or accessible via detail page URL | VERIFIED | Gallery RSC: `.filter((w) => w.entry.published)` present line 27. Detail page RSC: `if (!work || !work.published) notFound()` present line 24. `generateStaticParams` also filters published-only. |
| 8 | SiteHeader contains a Works / Arbejder nav link pointing to /gallery | VERIFIED | `SiteHeader.tsx` has `<Link href="/gallery">` rendering `t("navigation.gallery")`; `navigation.gallery = "Works"` in en.json, `"Arbejder"` in da.json |
| 9 | All published works are pre-rendered at build time via generateStaticParams | VERIFIED | `[slug]/page.tsx` exports `generateStaticParams` filtering published works; build output shows `/[locale]/gallery/[slug]` with `● (SSG)` indicator |

**Score:** 9/9 truths verified (automated). Human verification required for visual/interactive behaviors.

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `keystatic.config.ts` | works + categories + homepage schema | VERIFIED | `collections.works`, `collections.categories`, `singletons.homepage` all present; `slugField`, bilingual fields, `multiRelationship`, images array all correct |
| `messages/en.json` | English gallery namespace | VERIFIED | 13 gallery.* keys present; `navigation.gallery = "Works"` |
| `messages/da.json` | Danish gallery namespace | VERIFIED | 13 gallery.* keys present; `navigation.gallery = "Arbejder"` |
| `src/__tests__/gallery-filter.test.ts` | Filter logic unit tests | VERIFIED | 8 tests covering publishedFilter, forSaleFilter, sold exclusion, notListed exclusion, empty input, combined filter chain |
| `src/__tests__/i18n-fields.test.ts` | Extended with gallery.* key assertions | VERIFIED | gallery.* describe block added with key assertions for both locales; 45/45 tests green |
| `src/app/[locale]/gallery/page.tsx` | Gallery grid RSC | VERIFIED | Imports createReader, keystaticConfig, GalleryGrid, GalleryFilterToggle; filters published + for-sale; `force-dynamic` export |
| `src/components/GalleryGrid.tsx` | Pure grid display component | VERIFIED | `grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8` ul; exports `WorkCardEntry` type |
| `src/components/WorkCard.tsx` | Single card with image + badge + link | VERIFIED | `aspect-[4/5]`, `group-hover:scale-[1.015]`, Link from `@/i18n/navigation`, StatusBadge overlay |
| `src/components/StatusBadge.tsx` | Status pill badge | VERIFIED | Returns null for notListed; `bg-stone` for sold; `bg-terracotta` for available; `aria-label` present |
| `src/components/GalleryFilterToggle.tsx` | Client filter toggle | VERIFIED | `"use client"`, `fieldset`/`legend`, two buttons with `aria-pressed`, `min-h-[44px]`, `border-terracotta` active state |
| `src/components/SiteHeader.tsx` | Nav link to /gallery | VERIFIED | `<nav>` with `<Link href="/gallery">` rendering `t("navigation.gallery")` |
| `src/app/[locale]/gallery/[slug]/page.tsx` | Detail page RSC | VERIFIED | `generateStaticParams`, `notFound()` guard, locale-aware field selection, passes ctaLabels to WorkDetail |
| `src/components/WorkDetail.tsx` | Side-by-side detail layout | VERIFIED | `grid-cols-1 lg:grid-cols-[55fr_45fr]`; conditional CTA for available/sold/notListed; Link from `@/i18n/navigation`; `next/image` only (no `<img>`) |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `gallery/page.tsx` | `keystatic.config.ts collections.works` | `createReader(...).collections.works.all()` | WIRED | Line 24: `reader.collections.works.all()` confirmed |
| `gallery/page.tsx` | `GalleryGrid.tsx` | props: works array after published + filter | WIRED | Line 71-75: `<GalleryGrid works={works} locale={locale} labels={...} />` |
| `WorkCard.tsx` | `[slug]/page.tsx` | `<Link href="/gallery/{slug}">` from `@/i18n/navigation` | WIRED | Line 21-24: `<Link href={'/gallery/' + slug}>` using `@/i18n/navigation` |
| `GalleryFilterToggle.tsx` | `gallery/page.tsx` | URL `?filter=for-sale` drives RSC `searchParams` filter | WIRED | Toggle sets `params.set("filter", "for-sale")`, gallery RSC reads `filter === "for-sale"` |
| `[slug]/page.tsx` | `keystatic.config.ts collections.works` | `reader.collections.works.read(slug)` | WIRED | Line 21: `reader.collections.works.read(slug)` confirmed |
| `[slug]/page.tsx` | `WorkDetail.tsx` | props: entry fields + locale + translated strings | WIRED | Lines 34-49: `<WorkDetail title={...} description={...} saleStatus={...} images={...} ctaLabels={...} />` |
| `WorkDetail.tsx` | `/custom-orders` route | `Link href="/custom-orders"` from `@/i18n/navigation` | WIRED | Lines 64 and 76: both CTAs use `<Link href="/custom-orders">` with `@/i18n/navigation` |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `gallery/page.tsx` | `works` array | `reader.collections.works.all()` → filter published → filter saleStatus | Yes — Keystatic Reader reads git-committed YAML files in `content/works/*/` | FLOWING |
| `[slug]/page.tsx` | `work` entry | `reader.collections.works.read(slug)` | Yes — Keystatic Reader reads specific slug's YAML | FLOWING |
| `WorkDetail.tsx` | `title`, `description`, `saleStatus`, `images`, `ctaLabels` | All passed as props from `[slug]/page.tsx` RSC | Yes — derived from Keystatic data + translated strings | FLOWING |

Note: No published works currently exist in test content (bowl-test has `published: false`). The data pipeline is correctly wired and will flow real data when the owner publishes a piece via Keystatic. This is correct behavior, not a gap.

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Full test suite green | `pnpm test` | 3 files, 45 tests passed | PASS |
| TypeScript compiles clean | `pnpm tsc --noEmit` | No output (exit 0) | PASS |
| Build succeeds with gallery routes | `pnpm build` | All 5 routes built; `/[locale]/gallery` as ƒ (dynamic), `/[locale]/gallery/[slug]` as ● (SSG) | PASS |
| No raw `<img>` tags in gallery files | `grep -rn "<img" ...` | No matches | PASS |
| Draft gate present | `grep "entry.published" gallery/page.tsx` | Line 27: `.filter((w) => w.entry.published)` | PASS |
| notFound guard present | `grep "notFound" [slug]/page.tsx` | Line 24: `if (!work \|\| !work.published) notFound()` | PASS |
| generateStaticParams filters published | `grep "generateStaticParams" [slug]/page.tsx` | Present, with `.filter((w) => w.entry.published)` | PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| GALL-01 | 03-01, 03-02 | Visitor can browse all ceramic pieces in a uniform grid | SATISFIED | `GalleryGrid` renders responsive 3-column grid; gallery RSC loads all published works |
| GALL-02 | 03-01, 03-03 | Visitor can click any piece to view a detail page with full images and description | SATISFIED | `[slug]/page.tsx` + `WorkDetail.tsx` deliver full detail with locale-aware title/description and primary + additional images |
| GALL-03 | 03-01, 03-02 | Visitor can filter gallery to show only for-sale pieces | SATISFIED | `GalleryFilterToggle` sets `?filter=for-sale` URL param; gallery RSC applies `saleStatus === "available"` filter |
| GALL-04 | 03-01, 03-02, 03-03 | Sold pieces remain visible with "Sold" label and custom order CTA | SATISFIED | `StatusBadge` shows stone "Sold" label in grid; detail page shows soldMessage + ghost CTA to `/custom-orders` |

No orphaned requirements found. All four Phase 3 requirement IDs are claimed by plans and evidenced in the codebase.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `StatusBadge.tsx` | 8 | `return null` | Info | Intentional — notListed status should render nothing. Not a stub. |
| `WorkDetail.tsx` | 16, 43, 103 | "placeholder" (next/image attribute) | Info | Intentional — `placeholder="blur"` is the next/image prop. 1x1 JPEG blurDataURL is documented as a Phase 6 plaiceholder enhancement target. |

No blockers. No warnings. The only grep matches are intentional and documented patterns.

### Human Verification Required

The automated checks are fully green (9/9 truths verified, all artifacts and links wired, build succeeds). The following items require a running browser with at least one published content entry to verify.

**Prerequisite:** Open Keystatic at `/keystatic`, open the "bowl-test" work, check "Published", set saleStatus to a value you want to test, save.

#### 1. Gallery Grid Layout

**Test:** Load `/en/gallery` at viewport widths: >1024px, 640-1023px, <640px.
**Expected:** 3-column, 2-column, 1-column respectively. Cards show only the image (no text below). Cards have 4:5 portrait crop. Hovering a card produces a very subtle scale (1.5%) effect.
**Why human:** Responsive grid and CSS transition cannot be verified without a browser.

#### 2. Status Badge Rendering

**Test:** With a published piece set to "For Sale" in Keystatic, load `/en/gallery`.
**Expected:** Terracotta pill badge "For Sale" appears at top-left of the card image.
**Why human:** Badge rendering requires live content and browser.

#### 3. Filter Tab Interaction

**Test:** Click the "For Sale" tab above the grid.
**Expected:** URL changes to `?filter=for-sale`. Only available pieces visible. Active tab shows terracotta bottom border; inactive tab border disappears.
**Why human:** URL update and active-state CSS require browser interaction.

#### 4. Detail Page Layout

**Test:** Click a published piece card to navigate to `/en/gallery/[slug]`.
**Expected:** Desktop: primary image in ~55% left column, title + description + CTA on right. Mobile (375px): image stacked above text content.
**Why human:** CSS grid side-by-side layout and responsive stacking require a browser.

#### 5. Available CTA

**Test:** On the detail page of an available piece.
**Expected:** Terracotta filled "Contact to buy" button visible in right column. Clicking navigates to `/en/custom-orders`.
**Why human:** CTA rendering and link behavior require browser.

#### 6. Sold Treatment

**Test:** Set a published piece to "Sold" in Keystatic, load its detail page.
**Expected:** "This piece has been sold." text in stone color. Below: ghost "Commission something similar →" button linking to `/en/custom-orders`. No filled/primary CTA.
**Why human:** Conditional CTA rendering requires live sold-status content.

#### 7. 404 for Unknown Slug

**Test:** Visit `/en/gallery/does-not-exist`.
**Expected:** Next.js 404 page. No error crash or blank page.
**Why human:** `notFound()` behavior needs browser verification (though code confirms the guard is present).

#### 8. Language Toggle on Gallery and Detail

**Test:** On `/en/gallery`, toggle language to DA.
**Expected:** URL changes to `/da/gallery`. "Works" heading becomes "Arbejder". Filter tabs show "Alle" / "Til salg".
**Test (detail):** On a detail page, toggle language.
**Expected:** Title and description switch to the Danish field values.
**Why human:** Locale switching and locale-aware field rendering require a live browser.

### Gaps Summary

No automated gaps found. All must-haves are verified. The phase is blocked from a `passed` status only because the human verification items (visual layout, interactive behaviors, live content rendering) cannot be assessed programmatically.

---

_Verified: 2026-04-19T16:25:00Z_
_Verifier: Claude (gsd-verifier)_
