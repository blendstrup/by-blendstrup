# Phase 3: Gallery & Works - Research

**Researched:** 2026-04-19
**Domain:** Keystatic Reader API, Next.js App Router dynamic routes, next-intl RSC patterns, URL-based filter state, responsive image grid
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Grid columns — 3 at ≥1024px, 2 at 640–1023px, 1 below 640px. CSS Grid with Tailwind responsive prefixes.
- **D-02:** Cards are image-only at rest — no text below the image in default state. Text belongs on the detail page.
- **D-03:** Status badges are small pill labels anchored to a corner of the image. "Sold" uses stone; "For sale" uses terracotta. Portfolio-only pieces show no badge.
- **D-04:** URL-based filter — `?filter=for-sale` query param. Two tab-style toggle buttons ("All" / "For Sale") left-aligned above the grid.
- **D-05:** Filter controls left-aligned above the grid, consistent with left-aligned content pattern.
- **D-06:** Desktop: side-by-side (first image left, title/description/CTA right). Additional images stack full-width below. Mobile: images then text, stacked vertically.
- **D-07:** Right column: title (serif, large), description, CTA per status. "Contact to buy" for for-sale; sold treatment for sold; no CTA for portfolio-only.
- **D-08:** Grid card sold pieces show "Sold" badge (stone pill). Image is NOT desaturated.
- **D-09:** Detail page for sold piece: "This piece has been sold." sentence + "Commission something similar →" CTA linking to `/[locale]/custom-orders`. CTA styled as secondary/ghost button.
- **D-10:** Both sold texts must be bilingual — added to `messages/en.json` and `messages/da.json`.

### Claude's Discretion

- URL path for gallery (`/gallery` vs `/works`) and detail pages — pick most semantically correct, be consistent.
- Image aspect ratio enforcement on the grid (square vs 4:5 portrait vs natural).
- Hover state on grid cards — keep consistent with Japandi restraint.
- Max-width of the detail page content column.
- Empty state copy when gallery has no published works.
- Empty state when for-sale filter returns zero results.
- Exact Keystatic schema field order and any minor field additions needed for Phase 3 RSC consumption.

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| GALL-01 | Visitor can browse all ceramic pieces in a uniform grid | Keystatic `reader.collections.works.all()` filtered by `published: true`; CSS Grid; `next/image` per card |
| GALL-02 | Visitor can click any piece to view a detail page with full images and localized description | `generateStaticParams` + `reader.collections.works.read(slug)`; locale-based field selection (titleDa/titleEn, descriptionDa/descriptionEn); `next/image` array |
| GALL-03 | Visitor can filter the gallery to show only currently for-sale pieces | URL param `?filter=for-sale`; RSC reads `searchParams` and filters `saleStatus === 'available'`; client toggle component updates URL |
| GALL-04 | Sold pieces remain visible with "Sold" label and custom order CTA | `saleStatus === 'sold'` drives badge rendering on card; sold treatment block on detail page; CTA href `/[locale]/custom-orders` |
</phase_requirements>

---

## Summary

Phase 3 builds on a fully-verified Phase 2 schema (works + categories + homepage singletons all confirmed via tests and content files). The primary task is: restore those schemas to `keystatic.config.ts` (they were removed post-Phase-2 per commit `6dd2c38`), then build the gallery grid page and detail pages as React Server Components consuming the Keystatic Reader API.

The Keystatic Reader API (`@keystatic/core/reader`, v0.5.50 installed) exposes `reader.collections.works.all()` returning `{ slug: string; entry: WorkEntry }[]` and `reader.collections.works.read(slug)` returning `WorkEntry | null`. Both are async and must be called in Server Components only. The `entry` shape exactly matches the fields in the Phase 2 schema: `published`, `titleDa`, `titleEn`, `descriptionDa`, `descriptionEn`, `saleStatus`, `price`, `leadTime`, `categories`, `images`. Filter by `entry.published === true` to enforce the draft/published gate (deferred from Phase 2, implemented here).

URL-based filtering is the only pattern that preserves bookmarkability and avoids client-state mismatch with SSR. The filter toggle must be a `"use client"` component (reads/writes `useSearchParams`); the gallery page RSC reads `searchParams` as a server prop and passes the filtered array to the grid. The `next-intl` 4.9.1 installed in the project uses `getTranslations` (server) / `useTranslations` (client) — established patterns from Phase 1/2 apply unchanged.

**Primary recommendation:** Restore the Phase 2 schema first (no schema = no Reader API calls), then build gallery page → detail page → filter toggle in that order. All RSC patterns, i18n patterns, and design tokens are already established in the codebase — Phase 3 applies them to new routes.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@keystatic/core` | 0.5.50 (installed) | Reader API for fetching works from git-based CMS | Project-locked CMS; `createReader` is the only way to read content in RSCs |
| `next` | 15.5.15 (installed) | App Router, RSC, `generateStaticParams`, `searchParams` | Project-locked framework |
| `next-intl` | 4.9.1 (installed) | `getTranslations` (server), `useTranslations` (client), locale-aware `Link` | Project-locked i18n layer |
| `next/image` | built-in | Ceramics photography with AVIF/WebP, blur placeholder, responsive sizes | CLAUDE.md: never use `<img>` for content imagery |
| `tailwindcss` | 4.2.2 (installed) | Utility classes from established `@theme` design tokens | Project-locked styling |

[VERIFIED: package.json in repo]

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@/i18n/navigation` (project module) | — | Locale-aware `Link` and `useRouter` | All internal links in client components — already used by LanguageToggle |
| `next/navigation` | built-in | `useSearchParams`, `useRouter` in client components | Filter toggle component reading/writing the URL param |
| `vitest` | 4.1.4 (installed) | Unit tests for schema and i18n key coverage | Regression tests for re-added schema and new message keys |

[VERIFIED: package.json, src/i18n/navigation.ts in repo]

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| URL param filter | React `useState` filter | `useState` loses state on navigation, breaks bookmarks, breaks SSR filter — URL param is the correct pattern for this use case |
| `generateStaticParams` | Dynamic server rendering per request | Static pre-render is faster; works are small in number; `generateStaticParams` matches CLAUDE.md guidance |
| Sibling-field i18n (titleDa/titleEn) | Separate Keystatic locale files | Sibling fields are the established Phase 2 schema — changing approach would break existing content |

**Installation:** No new packages required. All dependencies are already installed.

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── app/
│   └── [locale]/
│       └── gallery/
│           ├── page.tsx                  # Gallery grid RSC — reads searchParams
│           └── [slug]/
│               └── page.tsx              # Detail page RSC — generateStaticParams
├── components/
│   ├── GalleryGrid.tsx                   # Pure display component (RSC-compatible)
│   ├── WorkCard.tsx                      # Single card — image + optional badge
│   ├── WorkDetail.tsx                    # Detail layout — side-by-side + additional images
│   ├── StatusBadge.tsx                   # Pill badge (sold/for-sale/none)
│   └── GalleryFilterToggle.tsx           # "use client" — reads/writes ?filter=for-sale
```

Route path decision (Claude's discretion): **`/gallery`** and **`/gallery/[slug]`**.

Rationale: `/works` is more technically precise but `/gallery` is the term a ceramics buyer expects to click. Consistent with analogous craft/art portfolio sites. Detail pages live at `/gallery/[slug]` — shorter, scannable URLs.

### Pattern 1: Keystatic Reader in a Gallery RSC

The Reader must be instantiated at the top of the server component. Filter is applied in-memory on the `all()` result — the collection is small enough that no pagination or streaming is needed.

```typescript
// src/app/[locale]/gallery/page.tsx
// Source: @keystatic/core/dist/declarations/src/reader/index.d.ts (verified)
import { createReader } from "@keystatic/core/reader"
import keystaticConfig from "../../../../keystatic.config"

interface GalleryPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ filter?: string }>
}

export default async function GalleryPage({ params, searchParams }: GalleryPageProps) {
  const { locale } = await params
  const { filter } = await searchParams

  const reader = createReader(process.cwd(), keystaticConfig)
  const allWorks = await reader.collections.works.all()

  // Draft gate — deferred from Phase 2, implemented here (CMS-02)
  const published = allWorks.filter(w => w.entry.published)

  // For-sale filter
  const works = filter === "for-sale"
    ? published.filter(w => w.entry.saleStatus === "available")
    : published

  // ... render GalleryGrid
}
```

[VERIFIED: Reader API type signature from `@keystatic/core` 0.5.50 installed; bowl-test content confirms field names]

### Pattern 2: generateStaticParams for Detail Pages

```typescript
// src/app/[locale]/gallery/[slug]/page.tsx
// Source: Next.js 15 App Router documentation (ASSUMED — standard pattern)
export async function generateStaticParams({ params }: { params: Promise<{ locale: string }> }) {
  const reader = createReader(process.cwd(), keystaticConfig)
  const works = await reader.collections.works.all()
  const published = works.filter(w => w.entry.published)
  return published.map(w => ({ slug: w.slug }))
}
```

Note: `generateStaticParams` at the `[slug]` level does NOT need to return `locale` — Next.js inherits the locale from the parent `[locale]` segment's `generateStaticParams`. The `[locale]` segment's `generateStaticParams` is handled by next-intl's plugin or can be added at that level. [ASSUMED — verify against existing locale segment behavior]

### Pattern 3: Locale-Aware Field Selection

The Phase 2 schema stores bilingual content as sibling fields (titleDa/titleEn, descriptionDa/descriptionEn). Selection uses the locale from `params`:

```typescript
// In any RSC consuming a work entry
const title = locale === "da" ? entry.titleDa : entry.titleEn
const description = locale === "da" ? entry.descriptionDa : entry.descriptionEn
```

[VERIFIED: bowl-test/index.yaml confirms `titleDa`, `titleEn`, `descriptionDa`, `descriptionEn` field names; messages files confirm `da`/`en` locale values]

### Pattern 4: URL-Based Filter Toggle (Client Component)

The filter toggle must be `"use client"` because it reads `useSearchParams` and writes to the URL. It does NOT own the data — that lives in the RSC above.

```typescript
// src/components/GalleryFilterToggle.tsx
"use client"
import { useRouter, usePathname } from "@/i18n/navigation"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"

export default function GalleryFilterToggle() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const t = useTranslations("gallery")
  const isFiltered = searchParams.get("filter") === "for-sale"

  function setFilter(active: boolean) {
    const params = new URLSearchParams(searchParams)
    if (active) {
      params.set("filter", "for-sale")
    } else {
      params.delete("filter")
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex gap-2">
      <button type="button" onClick={() => setFilter(false)}
        aria-pressed={!isFiltered}>{t("filterAll")}</button>
      <button type="button" onClick={() => setFilter(true)}
        aria-pressed={isFiltered}>{t("filterForSale")}</button>
    </div>
  )
}
```

[VERIFIED: `@/i18n/navigation` module exists with `useRouter`, `usePathname`; LanguageToggle.tsx confirms the established client component pattern]

### Pattern 5: next-intl in Server Components

The project uses next-intl 4.9.1. The server-side translation function import is established:

```typescript
// Server components
import { getTranslations } from "next-intl/server"
const t = await getTranslations("gallery")

// Client components
import { useTranslations } from "next-intl"
const t = useTranslations("gallery")
```

[VERIFIED: `src/app/[locale]/layout.tsx` shows `getTranslations` from `"next-intl/server"`; `src/components/LanguageToggle.tsx` shows `useTranslations` pattern]

### Pattern 6: next/image for Ceramics Photography

Image paths from the Keystatic schema are relative paths like `/images/works/bowl-test/images/0/image.png` (confirmed from bowl-test content). These are served from `/public`.

```tsx
// Grid card image
<Image
  src={entry.images[0].image}
  alt={entry.images[0].alt}
  fill
  className="object-cover"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>

// Detail page hero image
<Image
  src={entry.images[0].image}
  alt={entry.images[0].alt}
  priority
  fill
  className="object-cover"
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

[VERIFIED: bowl-test/index.yaml confirms image path format `/images/works/bowl-test/images/0/image.png`; CLAUDE.md specifies sizes strings]

### Grid Aspect Ratio Decision (Claude's Discretion)

Recommendation: **4:5 portrait ratio** for grid cards.

Rationale: Ceramics photography naturally favors portrait orientation (tall bowls, vessels, mugs). 4:5 is the "tall square" — tighter than full portrait, wider than 3:4. It's used by Instagram for portrait posts and ceramic artist sites specifically because it allows the object to breathe vertically without feeling cramped. It pairs well with 3-column desktop grids at standard viewport widths. Use a `relative` wrapper with `aspect-[4/5]` (Tailwind v4).

### Hover State Decision (Claude's Discretion)

Recommendation: **Subtle scale + overlay** — `group-hover:scale-[1.02]` on the image with `transition-transform duration-300`. No opacity change; no text reveal. The scale is imperceptibly small — it signals interactivity without spectacle, consistent with Japandi restraint.

### Detail Page Max-Width (Claude's Discretion)

Recommendation: Side-by-side layout max-width `max-w-5xl` (1024px) centered within the existing `max-w-screen-xl` shell. This gives the image column ~50% and the text column ~50% with gap. Additional images below stack at full content width.

### Empty States (Claude's Discretion)

- No published works: Short centered message in DM Sans body size, stone color — "No pieces to show yet. / Ingen stykker at vise endnu."
- No for-sale results: "All pieces are currently sold or not listed for sale. Commission something similar →" linking to `/[locale]/custom-orders` — turns an empty state into a conversion path.

### Anti-Patterns to Avoid

- **Client component for data fetching:** Never call `createReader` inside a `"use client"` component. The Reader requires the Node.js filesystem — it will throw at runtime in a browser context. [VERIFIED: Keystatic reader exports `node` condition]
- **`<img>` tag for ceramics photos:** CLAUDE.md explicitly forbids this. Always `<Image>` from `next/image`.
- **Hardcoded locale strings:** Never `locale === "da" ? "Solgt" : "Sold"` in component files. All copy goes through next-intl message keys.
- **`searchParams` as synchronous prop in Next.js 15:** In Next.js 15, `searchParams` is a Promise and must be awaited — `const { filter } = await searchParams`. Same for `params`. [VERIFIED: layout.tsx shows `await params` pattern already established]
- **Missing `published` filter:** Every RSC that reads works must filter `w.entry.published === true`. Forgetting this exposes draft content on the public site (CMS-02 deferred item from Phase 2).
- **Re-instantiating reader per component:** Create one reader instance at the page level and pass data as props to child components. Avoid calling `createReader` in multiple nested server components — it performs filesystem I/O each time.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Image optimization/format conversion | Custom resize pipeline | `next/image` | Handles AVIF, WebP, responsive srcset, blur placeholder, CLS prevention automatically |
| Locale-aware internal links | Manual `/${locale}/gallery` string concat | `Link` from `@/i18n/navigation` | Already established; handles locale prefix correctly, avoids wrong-locale links |
| URL search param manipulation | Manual string concatenation | `new URLSearchParams(searchParams)` → `.set()` / `.delete()` | Built-in Web API; safe, spec-compliant |
| Content retrieval from YAML | Custom YAML parser | Keystatic Reader API | Already handles all field types, relationships, file resolution |
| Static generation of work slugs | Manual slug list | `generateStaticParams` + `reader.collections.works.all()` | Next.js handles ISR/static routing automatically |

**Key insight:** Every infrastructure concern (images, routing, content, i18n) is already solved by installed dependencies. Phase 3 is UI composition, not plumbing.

---

## Critical Prerequisite: Schema Restoration

The CONTEXT.md explicitly flags this as the first task: `keystatic.config.ts` currently contains only the `settings` singleton (verified by reading the file). The `works`, `categories`, and `homepage` schema code that was verified in Phase 2 has been removed (commit `6dd2c38`).

**The Phase 2 VERIFICATION.md documents the exact field names.** The executor must re-add:

1. `categories` collection — fields: `name`, `nameDa`, `nameEn`
2. `works` collection — fields: `slug` (slugField), `published` (checkbox), `titleDa`, `titleEn`, `descriptionDa`, `descriptionEn`, `saleStatus` (select: available/sold/notListed), `price`, `leadTime`, `categories` (multiRelationship → categories), `images` (array of {image, alt})
3. `homepage` singleton — fields: `heroWorks` (multiRelationship, max 3), `shopPreviewWorks` (multiRelationship, max 6)
4. `ui.navigation` groupings — Pieces (works), Taxonomy (categories), Pages (homepage + settings)

These must be re-added **verbatim** from Phase 2 to pass the existing schema regression test (`src/__tests__/keystatic-schema.test.ts`), which asserts `cfg.collections.works`, `cfg.collections.categories`, `cfg.singletons.homepage`, and `cfg.ui.navigation`.

[VERIFIED: Current `keystatic.config.ts` confirms schema is absent; `src/__tests__/keystatic-schema.test.ts` confirms test expectations; `02-VERIFICATION.md` confirms the expected field names]

---

## i18n Keys Required for Phase 3

New message keys that must be added to both `messages/en.json` and `messages/da.json`. The existing files currently contain `site`, `navigation`, `languageToggle`, and `placeholder` namespaces.

Note: `messages/en.json` already contains `shop.saleStatus.*`, `shop.filterAll`, `shop.filterAvailable`, `shop.contactToBuy` (verified in Phase 2 VERIFICATION.md). Phase 3 needs a `gallery` namespace plus the sold-piece treatment keys.

**Keys to add:**

```json
// messages/en.json additions
{
  "gallery": {
    "title": "Gallery",
    "filterAll": "All",
    "filterForSale": "For Sale",
    "soldLabel": "Sold",
    "forSaleLabel": "For Sale",
    "contactToBuy": "Contact to buy",
    "soldMessage": "This piece has been sold.",
    "soldCta": "Commission something similar →",
    "emptyAll": "No pieces to show yet.",
    "emptyForSale": "All pieces are currently sold or not listed for sale."
  }
}
```

```json
// messages/da.json additions
{
  "gallery": {
    "title": "Galleri",
    "filterAll": "Alle",
    "filterForSale": "Til salg",
    "soldLabel": "Solgt",
    "forSaleLabel": "Til salg",
    "contactToBuy": "Kontakt for køb",
    "soldMessage": "Dette stykke er solgt.",
    "soldCta": "Bestil noget lignende →",
    "emptyAll": "Ingen stykker at vise endnu.",
    "emptyForSale": "Alle stykker er pt. solgt eller ikke til salg."
  }
}
```

[VERIFIED: Existing message files confirmed by `cat messages/*.json`; Phase 2 VERIFICATION.md confirms existing shop.* keys already present]

---

## Common Pitfalls

### Pitfall 1: `searchParams` is a Promise in Next.js 15

**What goes wrong:** `const { filter } = searchParams` throws "searchParams is not iterable" or silently returns undefined.
**Why it happens:** Next.js 15 made both `params` and `searchParams` asynchronous Promises. The existing `layout.tsx` shows `await params` — the same applies to `searchParams`.
**How to avoid:** Always `const { filter } = await searchParams` in RSC page components.
**Warning signs:** TypeScript will warn if strict mode is on and you attempt to destructure a Promise directly.

[VERIFIED: `src/app/[locale]/layout.tsx` line 32 shows `const { locale } = await params` — the async params pattern is already established]

### Pitfall 2: Reader instantiated in Client Components

**What goes wrong:** Runtime error — `fs` module not available in browser.
**Why it happens:** Keystatic Reader uses Node.js `fs` internally. Next.js tree-shakes server-only code, but if `createReader` is called in a `"use client"` component the server-only code is bundled for the browser.
**How to avoid:** Call `createReader` only in Server Components (files without `"use client"` at the top). Pass data as props to any client component children.
**Warning signs:** Build error "Module 'fs' is not found" or hydration errors.

### Pitfall 3: Missing `published` filter exposes drafts

**What goes wrong:** Draft works (published: false) appear in the public gallery.
**Why it happens:** `reader.collections.works.all()` returns ALL entries regardless of `published` flag. The filter is the developer's responsibility.
**How to avoid:** Every RSC that reads the works collection must apply `.filter(w => w.entry.published)` before rendering or passing data.
**Warning signs:** The `bowl-test` entry has `published: false` — if it appears in the gallery, the filter is missing.

### Pitfall 4: Schema regression test fails after keystatic.config.ts edit

**What goes wrong:** `pnpm test` fails with "expected cfg.collections to have property 'works'".
**Why it happens:** The existing test at `src/__tests__/keystatic-schema.test.ts` asserts all four collections/singletons. If the schema is partially restored or field names differ, the test fails.
**How to avoid:** Run `pnpm test` immediately after restoring the schema and before writing any UI code.
**Warning signs:** TypeScript compiler will also catch field name mismatches when RSCs reference `entry.titleDa` etc.

### Pitfall 5: `generateStaticParams` for `[slug]` must only return published slugs

**What goes wrong:** `notFound()` is called at build time if a draft work's slug is in `generateStaticParams` but the RSC filters it out.
**Why it happens:** Mismatch between the params generated and the page behavior.
**How to avoid:** Apply the same `published` filter inside `generateStaticParams` as in the RSC.

### Pitfall 6: Locale-aware `Link` vs plain `<a>` for the sold CTA

**What goes wrong:** The "Commission something similar" CTA href `/[locale]/custom-orders` uses a literal `[locale]` placeholder instead of the actual locale value.
**Why it happens:** Forgetting to use locale-aware routing. `<a href={`/${locale}/custom-orders`}>` works but bypasses next-intl's locale handling.
**How to avoid:** Use `Link` from `@/i18n/navigation` with `href="/custom-orders"` — it prepends the current locale automatically.
**Warning signs:** The link navigates to `/[locale]/custom-orders` literally (404).

### Pitfall 7: i18n keys missing from one language file

**What goes wrong:** `useTranslations("gallery")` works in English but throws "Missing message 'gallery.soldMessage' in messages for locale 'da'" at runtime (or a warning in dev).
**Why it happens:** Adding keys to `en.json` but forgetting `da.json`.
**How to avoid:** Add keys to both files atomically. The existing `src/__tests__/i18n-fields.test.ts` pattern can be extended to assert new gallery keys.
**Warning signs:** Next-intl will log a warning in dev; in production it falls back to the key name.

---

## Code Examples

### Full Reader instantiation and filtering

```typescript
// Source: Keystatic Reader type definitions (@keystatic/core 0.5.50 installed)
import { createReader } from "@keystatic/core/reader"
import keystaticConfig from "../../../../keystatic.config"

const reader = createReader(process.cwd(), keystaticConfig)

// All published works
const allWorks = await reader.collections.works.all()
const published = allWorks.filter(w => w.entry.published)

// For-sale only
const forSale = published.filter(w => w.entry.saleStatus === "available")

// Single work by slug — returns null if not found
const work = await reader.collections.works.read(slug)
if (!work || !work.published) notFound()
```

### Status badge rendering

```tsx
// StatusBadge.tsx — no "use client" needed
type Status = "available" | "sold" | "notListed"

interface StatusBadgeProps {
  status: Status
  labels: { sold: string; forSale: string }
}

export function StatusBadge({ status, labels }: StatusBadgeProps) {
  if (status === "notListed") return null
  const isForSale = status === "available"
  return (
    <span
      className={[
        "absolute top-2 left-2 rounded-full px-2 py-0.5 text-xs font-medium text-linen",
        isForSale ? "bg-terracotta" : "bg-stone",
      ].join(" ")}
      aria-label={isForSale ? labels.forSale : labels.sold}
    >
      {isForSale ? labels.forSale : labels.sold}
    </span>
  )
}
```

Badge positioned top-left (left is the natural reading start; top-left is where the eye goes first in a grid card).

### Grid container

```tsx
// Tailwind v4 CSS Grid — responsive columns per D-01
<ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
  {works.map(({ slug, entry }) => (
    <li key={slug}>
      <WorkCard slug={slug} entry={entry} locale={locale} />
    </li>
  ))}
</ul>
```

### Detail page sold treatment

```tsx
// Ghost/secondary button pattern — lower visual weight than primary CTA
<Link
  href="/custom-orders"
  className="inline-block border border-stone px-6 py-3 text-sm font-medium text-stone hover:border-ink hover:text-ink transition-colors"
>
  {t("gallery.soldCta")}
</Link>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `params`/`searchParams` as plain objects | Both are Promises, must be `await`ed | Next.js 15 | Affects every RSC page in this project — already handled in existing pages |
| `next-intl` v3 `getServerSideTranslations` | `getTranslations` from `"next-intl/server"` | next-intl 4.x | Already established in `layout.tsx`; same API for new pages |
| Keystatic `storage: { kind: 'local' }` only | `storage: { kind: 'github' }` for production | Ongoing | Phase 3 uses local; production switch is env-var driven (already in `keystatic.config.ts`) |

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `generateStaticParams` at the `[slug]` level inherits the locale from the parent `[locale]` segment without needing to return locale | Architecture Patterns > Pattern 2 | If wrong, `generateStaticParams` must also enumerate locales, producing `{ locale, slug }` pairs — doubles the generated pages and changes the return type |
| A2 | The `saleStatus` field uses the exact string values `"available"`, `"sold"`, `"notListed"` as confirmed by bowl-test content | Architecture Patterns > Pattern 1 | If field values differ, filter comparisons silently return wrong results |
| A3 | Danish translations in `gallery.*` namespace are idiomatic — they should be reviewed by a native Danish speaker before launch | i18n Keys Required | Minor: copy quality, not functional correctness |

A2 is LOW risk — bowl-test content explicitly shows `saleStatus: sold` and Phase 2 schema defines the select options. A1 is MEDIUM risk — standard Next.js behavior but not verified against this specific project layout.

---

## Open Questions

1. **Does `generateStaticParams` at `[slug]` need to include locale?**
   - What we know: The `[locale]` segment exists as a parent. Next.js typically handles multi-segment `generateStaticParams` by composing parent + child results.
   - What's unclear: Whether next-intl's plugin wraps this behavior or whether both levels must explicitly export `generateStaticParams`.
   - Recommendation: Test with the simplest approach (slug only at `[slug]` level) and fall back to `{ locale, slug }` pairs if static generation produces 404s.

2. **Navigation link to gallery in `SiteHeader`**
   - What we know: `SiteHeader.tsx` currently has only the brand name and `LanguageToggle` — no nav links.
   - What's unclear: Whether Phase 3 adds a "Gallery" nav link to the header or defers nav to Phase 4 (which builds the full homepage).
   - Recommendation: Phase 3 should add the "Gallery" nav link to `SiteHeader` since the gallery page needs to be discoverable. Phase 4 adds remaining nav links (Shop, etc.).

---

## Environment Availability

Step 2.6: All required tools are already installed in the project (`@keystatic/core`, `next`, `next-intl`, `tailwindcss`, `vitest`). No external services, databases, or CLI tools are required for Phase 3 beyond what's already present. SKIPPED (no new external dependencies).

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | vitest 4.1.4 |
| Config file | `vitest.config.ts` (or inferred from `package.json`) |
| Quick run command | `pnpm test` |
| Full suite command | `pnpm test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| GALL-01 | Gallery RSC renders only published works | unit | `pnpm test --reporter=verbose` (keystatic-schema + gallery tests) | Partial — schema test exists; gallery test is Wave 0 gap |
| GALL-02 | Detail page RSC resolves slug and locale fields | unit | `pnpm test` | Wave 0 gap |
| GALL-03 | Filter param produces correct subset | unit | `pnpm test` | Wave 0 gap |
| GALL-04 | Sold status produces correct badge and CTA | unit | `pnpm test` | Wave 0 gap |
| CMS-02 (deferred) | `published: false` entries absent from filtered array | unit | `pnpm test` | Wave 0 gap |
| Schema restored | `keystatic.config.ts` has works, categories, homepage | unit | `pnpm test` (existing `keystatic-schema.test.ts`) | Exists — will FAIL until schema is restored |
| i18n keys | `gallery.*` keys present in both locales | unit | `pnpm test` (extend `i18n-fields.test.ts`) | Partial — file exists, gallery keys not yet asserted |

### Sampling Rate

- **Per task commit:** `pnpm test && pnpm tsc --noEmit && pnpm biome check src/`
- **Per wave merge:** `pnpm test && pnpm build`
- **Phase gate:** Full suite green + `pnpm build` succeeds before `/gsd-verify-work`

### Wave 0 Gaps

- [ ] `src/__tests__/gallery-filter.test.ts` — unit tests for the published filter logic and for-sale filter (covers GALL-01, GALL-03, GALL-04, CMS-02 deferred)
- [ ] `src/__tests__/i18n-fields.test.ts` — extend existing file to assert `gallery.*` keys in both locales
- [ ] Schema restoration: `keystatic.config.ts` must be updated (not a test gap, but a prerequisite before any test runs)

---

## Security Domain

Phase 3 is read-only server rendering with no user input, no authentication, and no data mutation. The applicable ASVS categories are minimal:

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | No auth in this phase |
| V3 Session Management | No | No sessions |
| V4 Access Control | No | Public gallery — no access control |
| V5 Input Validation | Partial | `slug` from URL params — use `notFound()` if `reader.collections.works.read(slug)` returns null; never trust slug blindly |
| V6 Cryptography | No | No secrets in this phase |

**Slug validation:** The detail page receives `slug` from the URL. The Reader API returns `null` for unknown slugs — always call `notFound()` on null response. This prevents information leakage about non-existent slugs. [VERIFIED: Reader type shows `read()` returns `T | null`]

**No other threat surface:** The gallery reads from a static YAML content directory committed to git. There is no database query, no user-supplied content rendered, and no server action. XSS is not applicable (no dynamic HTML injection). CSRF is not applicable (no mutations).

---

## Project Constraints (from CLAUDE.md)

| Directive | Impact on Phase 3 |
|-----------|-------------------|
| Always use `next/image`, never `<img>` | All ceramics photography must use `<Image>` with `fill` or explicit dimensions |
| RSC: `createReader(process.cwd(), config)` in server components only | Never call Reader in `"use client"` components |
| next-intl sibling-field pattern for content strings | `titleDa`/`titleEn`, `descriptionDa`/`descriptionEn` — no alternative |
| UI copy keys in `messages/en.json` and `messages/da.json` | All Phase 3 strings go through next-intl, not hardcoded |
| Tailwind v4 utility classes with design tokens from `@theme` | No inline styles, no arbitrary CSS values where a token exists |
| Biome for linting/formatting — run `pnpm biome check src/` | Not `pnpm check .` (avoids `.next/` false positives) |
| No e-commerce chrome (DSGN-04) | No cart icons, star ratings, stock counters, discount badges — even on for-sale pieces |
| Keystatic admin route must run in Node runtime | Existing `/keystatic` route has this; Phase 3 doesn't touch it |
| Do not put Keystatic behind auth middleware | Middleware matcher already excludes `/keystatic/*` — do not change |

---

## Sources

### Primary (HIGH confidence)

- `@keystatic/core` 0.5.50 — `dist/declarations/src/reader/index.d.ts`, `generic.d.ts` — Reader API, `createReader` signature, `CollectionReader.all()` / `.read()` return types [VERIFIED: installed in project node_modules]
- `src/app/[locale]/layout.tsx` — confirms async `params` / `await params` pattern for Next.js 15 [VERIFIED: read from repo]
- `src/i18n/navigation.ts` — confirms `useRouter`, `usePathname`, `Link` from `@/i18n/navigation` [VERIFIED: read from repo]
- `src/components/LanguageToggle.tsx` — confirms client component pattern with next-intl `useTranslations` [VERIFIED: read from repo]
- `content/works/bowl-test/index.yaml` — confirms exact field names (`saleStatus: sold`, `titleDa`, `titleEn`, `images[].image`, `images[].alt`) [VERIFIED: read from repo]
- `.planning/phases/02-content-model-cms-ux/02-VERIFICATION.md` — confirms full schema field list and all test results from Phase 2 [VERIFIED: read from repo]
- `.planning/phases/01-foundation/01-UI-SPEC.md` — confirms color tokens, typography scale, spacing, layout shell specs [VERIFIED: read from repo]
- `messages/en.json`, `messages/da.json` — confirms existing key structure and what needs to be added [VERIFIED: read from repo]
- `keystatic.config.ts` — confirms current state (schema absent, only `settings` singleton) [VERIFIED: read from repo]
- `src/__tests__/keystatic-schema.test.ts` — confirms regression test assertions that schema restoration must pass [VERIFIED: read from repo]
- `package.json` — confirms all installed versions [VERIFIED: read from repo]

### Secondary (MEDIUM confidence)

- Next.js 15 App Router documentation — `generateStaticParams`, async `searchParams` behavior [ASSUMED — based on training data and confirmed by existing code patterns]

### Tertiary (LOW confidence)

- `generateStaticParams` locale inheritance behavior in multi-segment dynamic routes with next-intl — flagged as Open Question A1

---

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH — all libraries installed and versions confirmed from `package.json`
- Architecture patterns: HIGH — Reader API types read directly from installed package; existing code patterns confirmed in repo
- i18n keys: HIGH — existing message files read; Phase 2 verification confirms shop.* keys already present
- Schema restoration: HIGH — current `keystatic.config.ts` and Phase 2 VERIFICATION.md both read
- `generateStaticParams` locale behavior: LOW — flagged as open question

**Research date:** 2026-04-19
**Valid until:** 2026-05-19 (stable stack; no fast-moving dependencies introduced)
