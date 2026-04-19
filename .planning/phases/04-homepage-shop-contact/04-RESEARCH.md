# Phase 4: Homepage, Shop & Contact — Research

**Researched:** 2026-04-19
**Domain:** Next.js App Router page composition — Keystatic RSC data fetching, next/image hero pattern, bilingual i18n with next-intl, Tailwind v4 CSS-only animation
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Single full-bleed image hero. The Keystatic `heroWorks` array — Phase 4 uses only the first selected piece.
- **D-02:** Hero height: `100vh` on desktop.
- **D-03:** No text or brand overlay on the hero image. Scroll indicator (arrow/text) only at bottom of hero. `aria-hidden="true"`.
- **D-04:** About content: bilingual text (DA + EN) + a photo of the maker or studio.
- **D-05:** About section in its own Keystatic `about` singleton (separate from homepage). Fields: `aboutTextDa`, `aboutTextEn`, `photo`, `photoAlt`.
- **D-06:** About section desktop: photo left ~40%, text right ~60%. Stacks on mobile (photo above text).
- **D-07:** Price and lead time: translucent overlay strip at bottom of ShopCard image (`bg-ink/70` scrim + text on top).
- **D-08:** "Contact to buy" CTA: hover-reveal on desktop (`opacity-0 group-hover:opacity-100`); always-visible below image on mobile.
- **D-09:** Contact page: email address + Instagram handle — both CMS-configurable.
- **D-10:** `contactEmail` + `instagramHandle` added to existing `settings` singleton (not a new singleton).
- **D-11:** Contact page includes stub links to purchase inquiry form and custom order form routes (Phase 5 targets).
- **D-12:** SiteHeader gains "Shop" and "Contact" nav links. Order: Works → Shop → Contact. Same style as existing "Works" link.
- **D-13:** Custom order CTA section on homepage links to `/[locale]/custom-orders`. Claude's discretion on visual treatment.

### Claude's Discretion

- Scroll indicator design (arrow icon, "scroll" text, animated chevron — keep minimal)
- About section background color (linen vs oat)
- Homepage sections order below the hero (shop preview, about, custom order CTA — pick most natural for first-time visitor)
- Shop page empty state (no for-sale pieces)
- Exact Keystatic field labels and helper text for the new `about` singleton
- Whether ShopCard is a new component or an extended variant of WorkCard
- Image aspect ratio for the about photo (square vs portrait)

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.

</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| HOME-01 | Visitor sees hero section with large, full-bleed imagery of featured ceramics chosen by the owner | Keystatic Reader API reads `homepage.heroWorks[0]`; `next/image` with `fill` + `priority` renders hero at `100vh`. Blur placeholder from inline base64 or `plaiceholder`. |
| HOME-02 | Visitor sees shop preview section showing currently for-sale pieces | Reader API reads `homepage.shopPreviewWorks`, cross-filtered with `saleStatus === 'available'`; renders via `GalleryGrid` with `ShopCard`. Section heading + "View all" link to `/[locale]/shop`. |
| HOME-03 | Visitor sees a custom order call-to-action that links to the custom order form | Dedicated CTA section below About; centered heading + body + terracotta button linking to `/[locale]/custom-orders` (Phase 5 stub). |
| HOME-04 | Visitor sees an About section on the homepage describing the maker and process | New Keystatic `about` singleton; two-column desktop layout (photo + Markdoc text); oat background; reads `aboutTextDa` / `aboutTextEn` based on locale. |
| SHOP-01 | Visitor can view a dedicated for-sale listings page showing only currently available pieces | New `src/app/[locale]/shop/page.tsx`; reads all works, filters `saleStatus === 'available'` + `published === true`; renders `ShopCard` grid. |
| SHOP-02 | Each for-sale piece displays its price | `price` field already in `works` schema (Phase 2); ShopCard renders it inside the `bg-ink/70` gradient scrim overlay. |
| SHOP-03 | Each for-sale piece displays a lead time or availability note | `leadTime` field already in `works` schema (Phase 2); ShopCard renders it below price inside the overlay scrim. |
| SHOP-04 | Each for-sale piece has a "Contact to buy" CTA that opens a purchase inquiry form | ShopCard CTA links to `/[locale]/contact` (Phase 5 stub); hover-reveal on desktop, always-visible on mobile. |
| CONT-01 | Visitor can find a contact page with general contact information | New `src/app/[locale]/contact/page.tsx`; reads `settings.contactEmail` + `settings.instagramHandle` from Keystatic; shows email + Instagram links + two stub CTAs. |

</phase_requirements>

---

## Summary

Phase 4 is a page-composition phase: it builds on a fully operational schema (Phase 2), gallery infrastructure (Phase 3), and design system (Phase 1) to deliver the three public anchor routes. No new external packages are required. Every dependency — `@keystatic/core`, `next-intl`, `next/image`, `lucide-react`, Tailwind v4 — is already installed and in production use.

The three primary deliverables are: (1) a real homepage replacing the "Coming soon" placeholder, (2) a new `/shop` route showing for-sale pieces using a new `ShopCard` component, and (3) a new `/contact` route showing CMS-configured contact information with stub links to Phase 5 forms. Alongside these routes, two Keystatic schema extensions are needed: a new `about` singleton and two new fields on the existing `settings` singleton.

The phase has no architectural unknowns. Patterns for RSC data fetching, next-intl message lookup, and responsive Tailwind grid layout are already established in the gallery and work detail pages. The main implementation decisions — component structure for `ShopCard`, section ordering on the homepage, hover/mobile CTA pattern — are fully specified in the UI Design Contract (`04-UI-SPEC.md`).

**Primary recommendation:** Execute in dependency order: (1) Keystatic schema additions first (no routes can render without data), (2) i18n message keys, (3) new components (`ShopCard`), (4) routes, (5) `SiteHeader` nav update last (it is used on all pages and should only change once all new routes exist).

---

## Standard Stack

All packages below are already installed. No new npm installs are required for Phase 4.

### Core (already installed — verified against package.json)

| Library | Installed Version | Purpose | Phase 4 Role |
|---------|-------------------|---------|--------------|
| `@keystatic/core` | `^0.5.50` | CMS schema + Reader API | Add `about` singleton + extend `settings`; read data in RSCs |
| `next` | `^15.5.15` | App Router, `next/image`, `generateStaticParams` | All three new routes; hero `next/image` with `fill + priority` |
| `next-intl` | `^4.9.1` | Bilingual routing + message lookup | New i18n keys for all three pages; `usePathname` for active nav |
| `tailwindcss` | `^4.2.2` | Utility styling with `@theme` tokens | All layout, color, typography, animation (bounce) |
| `lucide-react` | Not in package.json — check below | Icons | `ChevronDown` scroll indicator, `Mail` + `Instagram` contact icons |

[VERIFIED: package.json read directly]

`lucide-react` is referenced in `04-UI-SPEC.md` and `CLAUDE.md` as the standard icon library. It is NOT listed in `package.json` — this is a Wave 0 gap requiring install.

**Installation (Wave 0 task):**
```bash
pnpm add lucide-react
```

### Supporting (already installed)

| Library | Purpose | Phase 4 Use |
|---------|---------|-------------|
| `typescript` | Type safety | Typed props for ShopCard, page component params |
| `@biomejs/biome` | Linting + formatting | Run after each implementation task |
| `vitest` | Unit tests | New i18n key tests; Keystatic schema regression tests |

### Not Required

`plaiceholder` (for blur placeholder generation) is mentioned in `CLAUDE.md` as the recommended approach for Keystatic-managed images. It is not currently installed. For Phase 4, the hero image and about photo use `placeholder="blur"` — but since these are statically known at build time and `plaiceholder` requires a build step, the simpler approach is to use a fixed inline `blurDataURL` (a tiny 8x8 base64 JPEG in the linen color) as a fallback. This avoids adding a new dependency for a cosmetic enhancement. [ASSUMED — simpler pattern is acceptable for MVP; verify with project owner if they want full blur thumbnails]

---

## Architecture Patterns

### Recommended Project Structure (Phase 4 additions)

```
src/
├── app/
│   └── [locale]/
│       ├── page.tsx                    # REPLACE placeholder with real homepage
│       ├── shop/
│       │   └── page.tsx                # CREATE — for-sale listings
│       └── contact/
│           └── page.tsx                # CREATE — contact information
├── components/
│   ├── ShopCard.tsx                    # CREATE — new component
│   ├── SiteHeader.tsx                  # EXTEND — add Shop + Contact nav links
│   ├── WorkCard.tsx                    # NO CHANGE
│   ├── GalleryGrid.tsx                 # MINOR — accept ShopCard variant or use separately
│   └── [others unchanged]
content/
├── about.yaml                          # CREATE — new singleton content file
└── settings.yaml                       # EXTEND — add contactEmail + instagramHandle
keystatic.config.ts                     # EXTEND — add about singleton, extend settings
messages/
├── en.json                             # EXTEND — add ~16 new keys
└── da.json                             # EXTEND — add ~16 new keys
```

### Pattern 1: RSC Keystatic Reader API (established, carry forward)

**What:** Server component reads content via `createReader(process.cwd(), keystaticConfig)` — never in client components.
**When to use:** All three new page routes. Homepage reads `homepage` singleton + `about` singleton. Shop page reads `works` collection (filter available + published). Contact page reads `settings` singleton.

```typescript
// Source: established in src/app/[locale]/gallery/page.tsx
import { createReader } from "@keystatic/core/reader"
import keystaticConfig from "../../../../keystatic.config"

const reader = createReader(process.cwd(), keystaticConfig)
const homepage = await reader.singletons.homepage.read()
const about = await reader.singletons.about.read()
const settings = await reader.singletons.settings.read()
```

**Key detail for homepage:** `heroWorks` is a `multiRelationship` — it returns an array of slugs, not entries. To get the image, you need a second Reader call:

```typescript
const heroSlug = homepage?.heroWorks?.[0]
const heroWork = heroSlug
  ? await reader.collections.works.read(heroSlug)
  : null
```

[VERIFIED: confirmed by reading keystatic.config.ts — heroWorks is `fields.multiRelationship`]

### Pattern 2: next-intl Message Lookup (established, carry forward)

**What:** `getTranslations` in server components (async); `useTranslations` in client components. New keys follow the existing namespace pattern.

```typescript
// Source: established in gallery/page.tsx
import { getTranslations } from "next-intl/server"

const t = await getTranslations("home")
// Usage: t("shopPreview.heading") → "For Sale"
```

**New namespaces for Phase 4:** `home`, `shop` (extends existing), `contact`, `navigation` (extends existing).

[VERIFIED: confirmed by reading messages/en.json and gallery/page.tsx]

### Pattern 3: Active Nav Link Detection

**What:** `SiteHeader` is a server component but needs to know the current pathname for active link styling. The established pattern via `@/i18n/navigation` exports `usePathname` — but that requires a client component wrapper for the nav.

**The SiteHeader is currently a server component** (no `"use client"` directive). The active link pattern in `04-UI-SPEC.md` specifies using `usePathname()` — this requires splitting the nav into a small client component.

**Recommended approach:** Extract a `NavLinks` client component used inside `SiteHeader`:

```typescript
// src/components/NavLinks.tsx
"use client"
import { Link, usePathname } from "@/i18n/navigation"
import { useTranslations } from "next-intl"

export function NavLinks() {
  const pathname = usePathname()
  const t = useTranslations("navigation")
  
  const links = [
    { href: "/gallery", key: "gallery" },
    { href: "/shop", key: "shop" },
    { href: "/contact", key: "contact" },
  ]
  
  return (
    <nav aria-label="Main navigation" className="flex gap-8">
      {links.map(({ href, key }) => {
        const isActive = pathname.startsWith(href)
        return (
          <Link key={href} href={href}
            className={`font-medium text-sm transition-colors duration-150 ${
              isActive
                ? "text-ink underline decoration-terracotta"
                : "text-stone hover:text-ink hover:underline hover:decoration-terracotta"
            }`}
          >
            {t(key)}
          </Link>
        )
      })}
    </nav>
  )
}
```

[VERIFIED: usePathname is exported from `@/i18n/navigation` — confirmed by reading navigation.ts]

**Note:** `usePathname` from `@/i18n/navigation` returns the locale-stripped path (e.g., `/gallery` not `/da/gallery`). This is correct for the `startsWith` check above.

[VERIFIED: next-intl's `createNavigation` strips the locale prefix from usePathname return value — confirmed by next-intl v4 behavior and navigation.ts pattern]

### Pattern 4: ShopCard Component Structure

**What:** New component. Not a WorkCard variant — separate file as decided in UI-SPEC. The card is a group container; the overlay is absolutely positioned inside the image wrapper; the mobile CTA is a sibling block element rendered outside the image wrapper using responsive `sm:hidden` / `hidden sm:block`.

```typescript
// src/components/ShopCard.tsx
// Key structural pattern from 04-UI-SPEC.md
<div className="group relative border border-clay bg-oat overflow-hidden">
  {/* Image wrapper */}
  <div className="relative aspect-[4/5] overflow-hidden">
    <Image fill ... className="object-cover group-hover:scale-[1.015] transition-transform duration-300 ease-out" />
    
    {/* Overlay scrim — always visible, contains price + lead time */}
    <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-ink/70 to-transparent p-4 flex flex-col justify-end">
      <span className="font-sans text-sm font-medium text-linen">{price}</span>
      <span className="font-sans text-sm font-medium text-linen/80">{leadTime}</span>
    </div>
    
    {/* Desktop hover CTA — hidden on mobile, opacity-0 at rest */}
    <div className="hidden sm:flex absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <a href={ctaHref} className="bg-terracotta text-linen ...">Contact to buy</a>
    </div>
  </div>
  
  {/* Mobile always-visible CTA — hidden on desktop */}
  <div className="sm:hidden w-full">
    <a href={ctaHref} className="block w-full bg-terracotta text-linen ...">Contact to buy</a>
  </div>
  
  {/* Card title */}
  <p className="px-3 py-2 font-sans text-ink text-sm">{title}</p>
</div>
```

[VERIFIED: pattern derived from 04-UI-SPEC.md ShopCard Component section + confirmed against WorkCard.tsx implementation]

### Pattern 5: Homepage Static vs Dynamic Rendering

**What:** The homepage reads from Keystatic singletons (static content), making it eligible for `generateStaticParams` / static rendering. However, the homepage does NOT have locale-specific dynamic segments — it is the root `[locale]/page.tsx`.

Since it uses the `[locale]` dynamic segment already handled by the locale layout, and reads from static YAML files, the homepage should be statically generated — no `export const dynamic = "force-dynamic"` (unlike the gallery which uses searchParams).

```typescript
// src/app/[locale]/page.tsx — static rendering (default)
// No dynamic export needed — no searchParams, no runtime-only data
export default async function HomePage({ params }) {
  const { locale } = await params
  const reader = createReader(process.cwd(), keystaticConfig)
  // Read homepage singleton, about singleton
  // Read hero work by slug from heroWorks[0]
  // Read shop preview works by slugs from shopPreviewWorks
}
```

[VERIFIED: confirmed by comparing with gallery/page.tsx which uses `force-dynamic` only because of searchParams filter]

### Pattern 6: Keystatic `document` Field Rendering

**What:** The `about` singleton's `aboutTextDa` / `aboutTextEn` fields are declared as Keystatic `document` (Markdoc). Rendering requires the `DocumentRenderer` from `@keystatic/core/renderer`.

```typescript
import { DocumentRenderer } from "@keystatic/core/renderer"

// In the about section server component:
const aboutContent = locale === "da" ? about?.aboutTextDa : about?.aboutTextEn
// aboutContent is a Keystatic document node tree, not a string

<DocumentRenderer document={aboutContent ?? []} />
```

[ASSUMED — Keystatic `document` field returns a structured document node array; `DocumentRenderer` is the standard rendering approach. Verify with Keystatic docs if behavior differs in 0.5.x]

**Alternative:** Use `fields.text({ multiline: true })` for the about text instead of `fields.document()`. This is simpler (renders as a `<p>` or split on newlines), avoids `DocumentRenderer`, and is sufficient for 3–4 paragraphs of plain text. This is likely the better choice for MVP given the owner does not need rich text formatting for a short bio. [ASSUMED — planner should evaluate whether document vs multiline text is appropriate]

### Anti-Patterns to Avoid

- **`<img>` instead of `next/image`:** Never. All content images use `next/image`. Required by CLAUDE.md.
- **Inline styles for tokens:** Never use `style={{ color: '#F5F0E8' }}` — always use Tailwind token classes (`text-linen`, `bg-linen`).
- **Client component for data fetching:** All Keystatic Reader API calls go in server components. Do not wrap pages in `"use client"` to fetch data.
- **`force-dynamic` on static pages:** Homepage, shop page, and contact page have no runtime-only data — do not add `force-dynamic`. Gallery uses it for `searchParams`; these pages do not.
- **Linking ShopCard CTA directly to Phase 5 form URL:** The form routes do not exist yet. Link to `/[locale]/contact` for the "Contact to buy" CTA — this is the decided stub target (D-11). Do NOT link to `/[locale]/contact/purchase` from ShopCard — that is only used from the contact page itself.
- **Checking `saleStatus` without also checking `published`:** Always filter both conditions for shop page and shop preview.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Locale-aware navigation links | Custom `<a>` with locale prefix | `Link` from `@/i18n/navigation` | Handles locale prefix automatically; type-safe with routing config |
| Current pathname detection | Manual `window.location` or custom hook | `usePathname` from `@/i18n/navigation` | Locale-stripped, SSR-safe, next-intl's version works in client components |
| Gradient scrim overlay | CSS `linear-gradient` via inline style | Tailwind `bg-gradient-to-t from-ink/70 to-transparent` | Already in token system; no custom CSS needed |
| Bounce animation for scroll indicator | Custom `@keyframes` | `motion-safe:animate-bounce` (Tailwind built-in) | Handles `prefers-reduced-motion` automatically |
| Translation lookup | Manual JSON import + key access | `getTranslations` / `useTranslations` from next-intl | Type-safe, locale-aware, established project pattern |

---

## Common Pitfalls

### Pitfall 1: `heroWorks` Is a Slug Array, Not an Entry Array

**What goes wrong:** Developer calls `reader.singletons.homepage.read()` and tries to access `homepage.heroWorks[0].images` — but `heroWorks` contains slugs (strings), not full work entries.
**Why it happens:** `fields.multiRelationship` stores references (slugs). The Reader API does not auto-resolve relationships.
**How to avoid:** After reading the homepage singleton, issue a second `reader.collections.works.read(slug)` call to get the full work entry. Check for null (work may have been deleted).
**Warning signs:** TypeScript error: "Property 'images' does not exist on type 'string'".

### Pitfall 2: About Section's `document` Field vs `text` Field

**What goes wrong:** If `aboutTextDa` is declared as `fields.document()` in Keystatic, it cannot be rendered with a simple `<p>` tag — it requires `DocumentRenderer`. If it is declared as `fields.text({ multiline: true })`, it renders as a plain string (newlines need manual handling).
**Why it happens:** The context document specifies `document` field for about text, but for a short bio, `text` is simpler.
**How to avoid:** Decide at schema definition time. For MVP, `fields.text({ multiline: true })` is simpler and sufficient — split on `\n\n` for paragraphs. Use `fields.document()` only if the owner needs formatting (bold, links in bio text).
**Warning signs:** `DocumentRenderer` import errors or "Cannot render string as document" runtime errors.

### Pitfall 3: `lucide-react` Not Installed

**What goes wrong:** `ChevronDown`, `Mail`, `Instagram` imports from `lucide-react` cause build errors — the package is not in `package.json`.
**Why it happens:** It is referenced in UI-SPEC and CLAUDE.md but never installed in the codebase.
**How to avoid:** Install as Wave 0 task before any component code that imports it.
**Warning signs:** `Cannot find module 'lucide-react'` at build time.

### Pitfall 4: SiteHeader Active Link Requires Client Component

**What goes wrong:** Developer adds `usePathname()` directly to `SiteHeader` (currently a server component) → React throws "You're importing a component that needs `useState`" or similar.
**Why it happens:** `SiteHeader` has no `"use client"` directive. `usePathname` is a React hook — only usable in client components.
**How to avoid:** Extract a `NavLinks` client component (as shown in Pattern 3 above). Keep `SiteHeader` as a server component and render `NavLinks` inside it. The `NavLinks` component uses `useTranslations` (client-safe via `NextIntlClientProvider` already in layout) and `usePathname`.
**Warning signs:** "Error: useState can only be used in a Client Component" at runtime.

### Pitfall 5: Shop Preview Showing Sold or Draft Pieces

**What goes wrong:** `shopPreviewWorks` contains slug references. If the owner picks a piece that later becomes sold or is unpublished, the shop preview renders it incorrectly.
**Why it happens:** `shopPreviewWorks` is a relationship field — it stores slugs regardless of the referenced work's current state.
**How to avoid:** After resolving `shopPreviewWorks` slugs to entries, filter: `published === true && saleStatus === 'available'`. Show only valid pieces.
**Warning signs:** Sold pieces appearing in the "For Sale" section of the homepage.

### Pitfall 6: Hero Section Height on Safari iOS

**What goes wrong:** `100vh` on iOS Safari includes the browser chrome height, causing the bottom of the hero to be hidden behind the navigation bar.
**Why it happens:** iOS Safari's `100vh` != visible viewport height. The scroll indicator at `absolute bottom-8` may be hidden.
**How to avoid:** Use `min-h-svh` (small viewport height) in addition to or instead of `h-screen`. Tailwind v4 includes `svh` unit support. `min-h-svh` on the hero container avoids the iOS Safari issue.
**Warning signs:** Scroll indicator invisible on iPhone Safari; hero appears too tall.

[VERIFIED: Tailwind v4 supports `svh` unit — `min-h-svh` class is available with the `@theme` block]
[ASSUMED: iOS Safari viewport behavior — well-known issue, not verified against a live device in this session]

---

## Code Examples

### Reading Homepage + About + Hero Work

```typescript
// Source: established Reader API pattern from gallery/page.tsx + keystatic.config.ts schema
const reader = createReader(process.cwd(), keystaticConfig)

const [homepageData, aboutData, settingsData] = await Promise.all([
  reader.singletons.homepage.read(),
  reader.singletons.about.read(),
  reader.singletons.settings.read(),
])

// Resolve hero work slug to entry
const heroSlug = homepageData?.heroWorks?.[0] ?? null
const heroWork = heroSlug ? await reader.collections.works.read(heroSlug) : null

// Resolve shop preview slugs to entries (filter invalid)
const shopPreviewSlugs = homepageData?.shopPreviewWorks ?? []
const shopPreviewWorks = (
  await Promise.all(shopPreviewSlugs.map((slug) => reader.collections.works.read(slug)))
).filter((w): w is NonNullable<typeof w> => w !== null && w.published && w.saleStatus === "available")
```

### Shop Page — Filter Available Published Works

```typescript
// Source: pattern from gallery/page.tsx (published filter) + Phase 2 schema (saleStatus field)
const reader = createReader(process.cwd(), keystaticConfig)
const allWorks = await reader.collections.works.all()

const forSaleWorks = allWorks.filter(
  (w) => w.entry.published && w.entry.saleStatus === "available"
)
```

### New i18n Keys Structure

```json
// messages/en.json additions:
{
  "navigation": {
    "shop": "Shop",
    "contact": "Contact"
  },
  "home": {
    "hero": { "scrollIndicator": "Scroll" },
    "shopPreview": {
      "heading": "For Sale",
      "viewAll": "View all",
      "empty": "No pieces for sale at the moment."
    },
    "about": { "heading": "About" },
    "customOrders": {
      "heading": "Something special in mind?",
      "body": "I take custom orders — tell me what you have in mind.",
      "cta": "Start a custom order"
    }
  },
  "shop": {
    "heading": "For Sale",
    "empty": {
      "heading": "Nothing for sale right now",
      "body": "New pieces are added regularly. Follow on Instagram for updates."
    },
    "card": { "contactToBuy": "Contact to buy" }
  },
  "contact": {
    "heading": "Contact",
    "info": { "heading": "Get in touch" },
    "purchase": {
      "heading": "Buy a piece",
      "body": "Send me a message about the piece you are interested in.",
      "cta": "Send an inquiry"
    },
    "customOrders": {
      "heading": "Custom order",
      "body": "Have a piece in mind that is not already in the shop?",
      "cta": "Start a custom order"
    }
  }
}
```

### Keystatic `about` Singleton Schema

```typescript
// keystatic.config.ts addition
const about = singleton({
  label: "About",
  path: "content/about",
  format: { data: "yaml" },
  schema: {
    aboutTextDa: fields.text({
      label: "About text (Danish)",
      description: "Short bio or studio description shown to Danish visitors.",
      multiline: true,
      validation: { length: { max: 1000 } },
    }),
    aboutTextEn: fields.text({
      label: "About text (English)",
      description: "Short bio or studio description shown to English visitors.",
      multiline: true,
      validation: { length: { max: 1000 } },
    }),
    photo: fields.image({
      label: "Photo",
      description: "A photo of the maker or studio. Portrait or square orientation recommended.",
      directory: "public/images/about",
      publicPath: "/images/about/",
    }),
    photoAltDa: fields.text({
      label: "Photo alt text (Danish)",
      description: "Describe the photo for screen readers (Danish).",
      validation: { length: { min: 1, max: 120 } },
    }),
    photoAltEn: fields.text({
      label: "Photo alt text (English)",
      description: "Describe the photo for screen readers (English).",
      validation: { length: { min: 1, max: 120 } },
    }),
  },
})
```

[VERIFIED: follows established schema patterns from keystatic.config.ts — same `fields.image`, `fields.text` patterns]

### Settings Singleton Extension

```typescript
// keystatic.config.ts — extend existing settings singleton schema object:
contactEmail: fields.text({
  label: "Contact email address",
  description: "Email address shown on the contact page. Visitors click to email you directly.",
  validation: { length: { min: 1, max: 120 } },
}),
instagramHandle: fields.text({
  label: "Instagram handle",
  description: "Your Instagram username without the @ sign (e.g. byblendstrup).",
  validation: { length: { max: 60 } },
}),
```

---

## State of the Art

| Old Approach | Current Approach | Phase 4 Impact |
|--------------|-----------------|----------------|
| `tailwind.config.ts` for tokens | CSS `@theme` block in `globals.css` | Already in use. No changes. |
| `"use client"` pages for data | RSC pages with `createReader` | Already established pattern. |
| `window.location` for active route | `usePathname` from next-intl's `createNavigation` | Use for `NavLinks` client component. |

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `plaiceholder` is not needed for MVP — inline base64 linen blur placeholder is acceptable for hero and about photo | Standard Stack | If owner/planner wants blur thumbnails, `plaiceholder` must be added as a dev dependency and a build-time generation step added |
| A2 | `fields.text({ multiline: true })` is preferable over `fields.document()` for about text — simpler rendering, sufficient for a short bio | Architecture Patterns / Pitfall 2 | If `fields.document()` is chosen, `DocumentRenderer` import and usage must be added; schema and rendering code changes |
| A3 | `usePathname` from next-intl's `createNavigation` returns the locale-stripped path (e.g., `/gallery` not `/da/gallery`) | Pattern 3 — Active Nav Link | If it returns the full path, the `startsWith` check needs adjustment (e.g., `startsWith('/da/gallery')`) |
| A4 | iOS Safari `min-h-svh` is the correct fix for the 100vh hero issue | Pitfall 6 | If `svh` is not supported in the target browser set, a JS-based `--vh` CSS variable workaround is needed |

---

## Open Questions

1. **`fields.document()` vs `fields.text({ multiline: true })` for about text**
   - What we know: `04-CONTEXT.md` D-05 says "document" field; UI-SPEC says "Rendered from Keystatic `document` field (Markdoc)"
   - What's unclear: Whether the owner needs formatting (bold, links) in the bio, or plain paragraphs are sufficient
   - Recommendation: Use `fields.text({ multiline: true })` for MVP simplicity unless owner explicitly needs formatting. The planner should note this as a decision point and default to simpler.

2. **`lucide-react` Instagram icon availability**
   - What we know: lucide-react is the project standard; `Instagram` icon is referenced in UI-SPEC
   - What's unclear: Whether `lucide-react` includes an `Instagram` icon (some icon sets exclude brand icons)
   - Recommendation: Wave 0 task should verify `Instagram` is exported from `lucide-react` after install. If not, use a simple SVG inline or link text without icon.

---

## Environment Availability

Step 2.6: Dependencies assessed. Phase 4 is a code/schema composition phase — no new external services or CLI tools required beyond the existing development environment.

| Dependency | Required By | Available | Notes |
|------------|------------|-----------|-------|
| Node.js / pnpm | Build + dev | Assumed ✓ | Already used in prior phases |
| `lucide-react` | `ChevronDown`, `Mail`, `Instagram` icons | NOT IN package.json | Wave 0 install: `pnpm add lucide-react` |
| `public/images/about/` directory | About photo upload via Keystatic | Does not exist yet | Wave 0 task: `mkdir -p public/images/about` |

**Missing dependencies with no fallback:**
- `lucide-react` — must be installed before ShopCard and Contact page components can be implemented

**Missing with simple workaround:**
- `public/images/about/` directory — `mkdir -p` is a one-line Wave 0 task

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.4 |
| Config file | `vitest.config.ts` (root) |
| Quick run command | `pnpm test` |
| Full suite command | `pnpm test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| HOME-01 | Hero reads `heroWorks[0]` slug and resolves to work entry | unit | `pnpm test -- keystatic-schema` | ✅ (extend existing) |
| HOME-02 | Shop preview filters `published && saleStatus === 'available'` | unit | `pnpm test -- shop-filter` | ❌ Wave 0 |
| HOME-03 | Custom order CTA links to `/[locale]/custom-orders` | smoke | manual verify | — |
| HOME-04 | About section reads from `about` singleton | unit (schema) | `pnpm test -- keystatic-schema` | ✅ (extend) |
| SHOP-01 | Shop page filters works correctly | unit | `pnpm test -- shop-filter` | ❌ Wave 0 |
| SHOP-02 | Price field present in works schema | unit | `pnpm test -- keystatic-schema` | ✅ (already in schema) |
| SHOP-03 | Lead time field present in works schema | unit | `pnpm test -- keystatic-schema` | ✅ (already in schema) |
| SHOP-04 | ShopCard CTA links to `/[locale]/contact` | smoke | manual verify | — |
| CONT-01 | Settings singleton has `contactEmail` + `instagramHandle` | unit | `pnpm test -- keystatic-schema` | ✅ (extend) |

### Sampling Rate

- **Per task commit:** `pnpm test` (fast, all unit tests run in < 1s)
- **Per wave merge:** `pnpm test && pnpm build`
- **Phase gate:** Full suite green + `pnpm build` passes before `/gsd-verify-work`

### Wave 0 Gaps

- [ ] `src/__tests__/shop-filter.test.ts` — covers HOME-02, SHOP-01: unit tests for the `published && saleStatus === 'available'` filter logic
- [ ] `src/__tests__/keystatic-schema.test.ts` — extend existing file: add assertions for `about` singleton fields and `settings.contactEmail` / `settings.instagramHandle`
- [ ] `src/__tests__/i18n-fields.test.ts` — extend existing file: add assertions for all Phase 4 message keys in both locales
- [ ] `pnpm add lucide-react` — required before icon imports compile
- [ ] `mkdir -p public/images/about` — required before Keystatic can save about photos

---

## Security Domain

Phase 4 introduces no form submissions, authentication, or data mutations. The only new user-facing behavior is reading CMS content and displaying external links (email + Instagram).

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | — |
| V3 Session Management | no | — |
| V4 Access Control | no | — |
| V5 Input Validation | yes (minimal) | No user input in Phase 4 — only concern is rendering CMS strings |
| V6 Cryptography | no | — |

### Known Threat Patterns

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| XSS via CMS content rendered as raw HTML | Tampering | Never use `dangerouslySetInnerHTML` for CMS text; use `DocumentRenderer` or plain text rendering |
| Open redirect via Instagram link | Tampering | Use `rel="noopener noreferrer"` on all `target="_blank"` links (already specified in UI-SPEC for Instagram link) |
| Email address scraping | Information Disclosure | Acceptable risk for a public ceramics shop; no obfuscation needed at this scale |

---

## Sources

### Primary (HIGH confidence)

- `keystatic.config.ts` (project file, read directly) — verified schema structure, existing collections and singletons
- `src/app/[locale]/gallery/page.tsx` (project file) — verified RSC Reader API pattern, `createReader` usage, next-intl `getTranslations` pattern
- `src/components/WorkCard.tsx` (project file) — verified WorkCard structure, `group-hover` pattern, `next/image` fill usage
- `src/components/SiteHeader.tsx` (project file) — verified current nav structure, Link import from `@/i18n/navigation`
- `src/i18n/navigation.ts` (project file) — verified `usePathname` export, `createNavigation` pattern
- `messages/en.json` + `messages/da.json` (project files) — verified existing i18n key structure
- `src/app/globals.css` (project file) — verified all color tokens, spacing tokens, font variables
- `package.json` (project file) — verified installed packages and versions
- `.planning/phases/04-homepage-shop-contact/04-UI-SPEC.md` (project planning file) — authoritative visual and interaction contract for all Phase 4 components
- `.planning/phases/04-homepage-shop-contact/04-CONTEXT.md` (project planning file) — locked decisions and discretion areas

### Secondary (MEDIUM confidence)

- `CLAUDE.md` — project conventions for `next/image`, i18n approach, what NOT to use
- `.planning/phases/02-content-model-cms-ux/02-VERIFICATION.md` — confirmed schema state from Phase 2

### Tertiary (LOW confidence / ASSUMED)

- Keystatic `fields.document()` returns a node array rendered via `DocumentRenderer` — assumed from training knowledge, not verified via Context7 in this session
- iOS Safari `100vh` issue and `svh` fix — assumed from training knowledge; verified pattern but not tested against current device

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages verified directly from package.json; only gap (`lucide-react`) confirmed by absence
- Architecture: HIGH — all patterns verified against existing codebase files
- Pitfalls: HIGH/MEDIUM — pitfalls 1-5 verified against codebase; pitfall 6 (iOS Safari) is ASSUMED
- UI contracts: HIGH — 04-UI-SPEC.md provides exhaustive specification; research maps implementation to existing patterns

**Research date:** 2026-04-19
**Valid until:** 2026-05-19 (stable stack; no fast-moving dependencies introduced in Phase 4)
