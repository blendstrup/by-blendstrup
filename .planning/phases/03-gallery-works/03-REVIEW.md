---
phase: 03-gallery-works
reviewed: 2026-04-19T00:00:00Z
depth: standard
files_reviewed: 15
files_reviewed_list:
  - keystatic.config.ts
  - messages/da.json
  - messages/en.json
  - src/__tests__/gallery-filter.test.ts
  - src/__tests__/i18n-fields.test.ts
  - src/app/[locale]/gallery/[slug]/page.tsx
  - src/app/[locale]/gallery/page.tsx
  - src/app/[locale]/layout.tsx
  - src/app/layout.tsx
  - src/components/GalleryFilterToggle.tsx
  - src/components/GalleryGrid.tsx
  - src/components/SiteHeader.tsx
  - src/components/StatusBadge.tsx
  - src/components/WorkCard.tsx
  - src/components/WorkDetail.tsx
findings:
  critical: 1
  warning: 3
  info: 3
  total: 7
status: issues_found
---

# Phase 03: Code Review Report

**Reviewed:** 2026-04-19
**Depth:** standard
**Files Reviewed:** 15
**Status:** issues_found

## Summary

Phase 03 delivers the gallery page, work detail page, supporting components, Keystatic schema, i18n messages, and unit tests. The overall structure is clean and follows project conventions. Two issues are worth immediate attention: `generateStaticParams` on the detail page omits the required `locale` segment (causing broken static generation in production), and `WorkCard` silently drops the work title from the rendered output entirely. Three further warnings cover a misleading accessibility label, a fragile React key, and a layout stability risk on the detail image.

---

## Critical Issues

### CR-01: `generateStaticParams` omits `locale` — detail page static generation is broken

**File:** `src/app/[locale]/gallery/[slug]/page.tsx:14`
**Issue:** The route lives under `[locale]/gallery/[slug]`, so `generateStaticParams` must return objects containing **both** `locale` and `slug`. The current implementation returns only `{ slug }`. Next.js static generation for a nested dynamic segment requires all dynamic segments to be present; when `locale` is absent Next.js either skips static generation silently or throws at build time, depending on the version. In either case, detail pages will not be pre-rendered for either locale.
**Fix:**
```ts
export async function generateStaticParams() {
  const reader = createReader(process.cwd(), keystaticConfig)
  const works = await reader.collections.works.all()
  const locales = ["da", "en"] // or import from routing config

  return works
    .filter((w) => w.entry.published)
    .flatMap((w) => locales.map((locale) => ({ locale, slug: w.slug })))
}
```

---

## Warnings

### WR-01: Work title is never rendered in `WorkCard`

**File:** `src/components/WorkCard.tsx:19`
**Issue:** The `locale` prop is declared in `WorkCardProps` (line 15) and passed from `GalleryGrid`, but it is silently dropped in the function signature on line 19 (`{ slug, entry, labels }` — `locale` is omitted). As a result, neither the localized `titleDa` nor `titleEn` is rendered anywhere in the card. The gallery grid shows only the image with no visible text label, which is a significant UX regression and an accessibility failure (the link has no discernible text beyond the image alt).
**Fix:**
```tsx
export function WorkCard({ slug, entry, locale, labels }: WorkCardProps) {
  const title = locale === "da" ? entry.titleDa : entry.titleEn

  return (
    <Link
      href={`/gallery/${slug}`}
      className="group relative block cursor-pointer overflow-hidden border border-clay bg-oat"
    >
      {entry.images.length === 0 ? (
        <div className="relative aspect-[4/5] bg-oat" />
      ) : (
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={entry.images[0]?.image ?? ""}
            alt={entry.images[0]?.alt ?? ""}
            fill
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.015]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <StatusBadge status={entry.saleStatus} labels={labels} />
        </div>
      )}
      <p className="px-3 py-2 font-sans text-sm text-ink">{title}</p>
    </Link>
  )
}
```

### WR-02: `fieldset` legend text is the "All" button label, not a group description

**File:** `src/components/GalleryFilterToggle.tsx:33`
**Issue:** The `<legend>` reads `t("filterAll")` which resolves to "All" / "Alle". Screen readers announce this as the purpose of the entire control group, so a user hears "All — All (button) — For Sale (button)". The legend should describe *what the buttons control*, not echo one of the button labels.
**Fix:**
```tsx
// Add a dedicated key to messages, e.g. gallery.filterLabel = "Filter works"
<legend className="sr-only">{t("filterLabel")}</legend>
```
Add `"filterLabel": "Filter works"` to `en.json` and `"filterLabel": "Filtrer arbejder"` to `da.json`.

### WR-03: React key based on image path is fragile in `WorkDetail`

**File:** `src/components/WorkDetail.tsx:95`
**Issue:** `key={img.image}` uses the image file path as the React key for the additional-images grid. If `img.image` is an empty string (which can happen — the field is nullable upstream and is coerced to `""` in `[slug]/page.tsx:41`), multiple images without paths will collide on the same key `""`, causing React reconciliation bugs and a console warning.
**Fix:** Use the array index as a stable fallback key, or enforce non-empty paths earlier:
```tsx
{images.slice(1).map((img, i) => (
  <div
    key={img.image || i}
    className="relative aspect-[4/5] overflow-hidden bg-oat"
  >
```

---

## Info

### IN-01: Primary image container in `WorkDetail` has no intrinsic height, only `minHeight`

**File:** `src/components/WorkDetail.tsx:35`
**Issue:** The primary image uses `fill` positioning, which requires the parent to establish a height. The container sets only `style={{ minHeight: "400px" }}` with no explicit height or aspect-ratio. On mobile this works incidentally because `minHeight` provides the floor, but the image container height will not adapt to portrait or landscape images — it stays at exactly `400px` regardless of aspect ratio. Using a fixed aspect ratio (matching the 4:5 convention used elsewhere) is more predictable and avoids potential layout shift on slow networks.
**Fix:**
```tsx
{/* Replace minHeight style with aspect-ratio class */}
<div className="relative aspect-[4/5] w-full overflow-hidden">
  <Image
    src={images[0]?.image ?? ""}
    alt={images[0]?.alt ?? ""}
    priority
    fill
    className="object-contain"
    sizes="(max-width: 1024px) 100vw, 55vw"
    placeholder="blur"
    blurDataURL={BLUR_DATA_URL}
  />
</div>
```

### IN-02: `saleStatus` cast with `as` in detail page instead of type-narrowing

**File:** `src/app/[locale]/gallery/[slug]/page.tsx:37`
**Issue:** `work.saleStatus as "available" | "sold" | "notListed"` silences the TypeScript compiler but does not validate the value at runtime. If Keystatic ever returns an unexpected value (e.g., a future CMS migration or a hand-edited YAML file), the cast will suppress a type error while the incorrect value propagates to `WorkDetail`. A narrow helper or Zod parse would catch this at the boundary.
**Fix:**
```ts
const VALID_STATUSES = ["available", "sold", "notListed"] as const
type SaleStatus = typeof VALID_STATUSES[number]

function toSaleStatus(raw: string): SaleStatus {
  return VALID_STATUSES.includes(raw as SaleStatus)
    ? (raw as SaleStatus)
    : "notListed"
}
```

### IN-03: i18n key parity between locales is not enforced by the tests

**File:** `src/__tests__/i18n-fields.test.ts:44-75`
**Issue:** The tests check that specific named keys exist in both `en.json` and `da.json`, but the `galleryKeys` array is manually maintained. If a key is added to `en.json` but forgotten in `da.json` (or vice versa), no test will fail unless someone also updates `galleryKeys`. A structural parity test (comparing the key sets of both objects) would catch omissions automatically.
**Fix:**
```ts
it("da.gallery has the same keys as en.gallery", () => {
  const enKeys = Object.keys((en as unknown as FlatMessages).gallery ?? {}).sort()
  const daKeys = Object.keys((da as unknown as FlatMessages).gallery ?? {}).sort()
  expect(daKeys).toEqual(enKeys)
})
```

---

_Reviewed: 2026-04-19_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
