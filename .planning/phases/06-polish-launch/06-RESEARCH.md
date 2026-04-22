# Phase 6: Polish & Launch - Research

**Researched:** 2026-04-21
**Domain:** Next.js App Router metadata, plaiceholder image placeholders, Lighthouse QA, CMS documentation
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**SEO Metadata**
- D-01: Use App Router `generateMetadata` per page file — no extra library. Output: `title`, `description`, `openGraph.title`, `openGraph.description`, `openGraph.images`.
- D-02: Hreflang dropped entirely. Site is Danish-only. I18N-04 is retired from v1 scope.
- D-03: `sitemap.ts` in `src/app/` using the App Router built-in. Lists all static routes + dynamic gallery detail pages (read from Keystatic at build time).
- D-04: `robots.ts` in `src/app/` — `Allow: /`, `Disallow: /keystatic/`.
- D-05: `og:image` fallback for pages without a ceramic photo: static image at `/public/og-default.jpg`.
- D-06: OG image dimensions: 1200×630px. Fallback sourced from owner's existing assets.

**Image Optimization**
- D-07: Install `plaiceholder` to generate `blurDataURL` at build time. Apply `placeholder="blur"` + `blurDataURL` to all `next/image` instances rendering ceramic images in `WorkCard`, `ShopCard`, `WorkDetail`.
- D-08: Add `images: { formats: ['image/avif', 'image/webp'] }` to `next.config.ts`.
- D-09: No change to `sizes` props — already correct. Only add `placeholder` and `blurDataURL`.

**Responsive QA**
- D-10: Lighthouse mobile simulation (Chrome DevTools, mobile preset) on: homepage, gallery index, gallery detail, contact, purchase inquiry form, custom order form.
- D-11: Target: Lighthouse Performance >= 80, Accessibility >= 90 on mobile.
- D-12: Planner includes a checkpoint plan documenting Lighthouse results per page as verification artifact.

**Owner CMS Training**
- D-13: Written Markdown guide at `docs/cms-guide.md`. Plain language, no code references.
- D-14: Guide covers exactly four tasks: adding a piece, marking as sold, curating homepage, editing site settings.
- D-15: Guide includes Keystatic admin URL and Keystatic Cloud login flow.

### Claude's Discretion
- Exact `generateMetadata` default title format (D-02 clarified: `[Page name] — By Blendstrup` with em dash per UI-SPEC)
- Whether to use a shared `baseMetadata` object (UI-SPEC recommends: yes, in `src/lib/metadata.ts`)
- Placement/naming of `og-default.jpg` in `/public/`
- How `plaiceholder` is invoked — module-level or shared utility in `src/lib/`
- Exact Lighthouse score thresholds (D-11 sets floor)
- CMS guide formatting style

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| I18N-04 | hreflang tags for search engines | RETIRED — site is Danish-only (confirmed in CONTEXT.md D-02). No action required. |
| DSGN-02 | Ceramics imagery at high quality with fast load times (next/image + AVIF + blur placeholders) | plaiceholder v3 API verified; AVIF config in next.config.ts documented; image path pattern from Keystatic confirmed |
| DSGN-03 | Site fully responsive across mobile, tablet, desktop | Lighthouse methodology and breakpoints documented; existing pages inventoried |
| DSGN-04 | No e-commerce chrome on any page | Audit checklist documented; existing code reviewed — none found currently |
</phase_requirements>

---

## Summary

Phase 6 closes out four focused areas: SEO metadata, image blur placeholders, responsive QA, and a CMS training guide. The codebase is already well-structured for all of these — no architectural changes are needed.

The three largest implementation tasks are: (1) adding `generateMetadata` exports to every page file and creating `sitemap.ts`/`robots.ts`, (2) installing `plaiceholder` + `sharp` and threading `blurDataURL` into `WorkCard`, `ShopCard`, and `WorkDetail`, and (3) running and documenting Lighthouse results. The CMS guide is a writing task, not a code task.

I18N-04 (hreflang) is retired with no code work. DSGN-04 (no e-commerce chrome) is confirmed already satisfied by the existing codebase — the audit is a pass check only.

**Primary recommendation:** Sequence the work in four waves: (1) `next.config.ts` AVIF + install plaiceholder, (2) blur placeholders on all three components, (3) metadata + sitemap + robots, (4) Lighthouse QA + CMS guide. This order means image optimization is validated before QA runs.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js (App Router) | 15.5.15 (installed) | `generateMetadata`, `sitemap.ts`, `robots.ts` built-ins | No extra library needed — App Router ships all metadata primitives |
| plaiceholder | 3.0.0 (latest on npm) | Generate base64 blur placeholders from image files | The canonical "LQIP as blurDataURL" solution for next/image; no client JS |
| sharp | 0.34.5 (latest on npm) | plaiceholder peer dependency — image processing | Required by plaiceholder; already used by Next.js internally on Vercel |

[VERIFIED: npm registry — plaiceholder 3.0.0 published, sharp 0.34.5 published, peer dep `sharp >= 0.30.6`]

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| fs (Node built-in) | — | Read image files as Buffer for plaiceholder | Used inside RSCs at build time; `fs.readFileSync(path)` |
| `type { Metadata } from 'next'` | — | TypeScript type for metadata return objects | All `generateMetadata` exports |
| `type { MetadataRoute } from 'next'` | — | TypeScript type for sitemap return array | `sitemap.ts` |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| plaiceholder | next/image native blur (shimmer) | plaiceholder produces image-accurate blur; shimmer is a static gray gradient — lower visual quality for ceramics photography |
| App Router sitemap.ts | next-sitemap library | next-sitemap is explicitly rejected in CLAUDE.md; App Router built-in covers all needs |
| Per-page metadata objects | next-seo library | next-seo is unnecessary; App Router metadata API is first-class and sufficient |

**Installation:**

```bash
pnpm add plaiceholder sharp
```

Note: `sharp` may already be installed as a transitive dependency of Next.js on Vercel. Install explicitly to guarantee it is present in `devDependencies` for local builds.

[VERIFIED: npm registry — plaiceholder 3.0.0, sharp 0.34.5]

---

## Architecture Patterns

### Recommended Project Structure

No new directories needed. New files slot into existing structure:

```
src/
├── app/
│   ├── sitemap.ts            # NEW — App Router built-in
│   ├── robots.ts             # NEW — App Router built-in
│   ├── layout.tsx            # MODIFY — add metadata export + metadataBase
│   ├── page.tsx              # MODIFY — add generateMetadata export
│   ├── gallery/
│   │   ├── page.tsx          # MODIFY — add generateMetadata export
│   │   └── [slug]/
│   │       └── page.tsx      # MODIFY — add generateMetadata export (reads work)
│   ├── contact/
│   │   ├── page.tsx          # MODIFY — add generateMetadata export
│   │   └── purchase/
│   │       └── page.tsx      # MODIFY — add generateMetadata export
│   └── custom-orders/
│       └── page.tsx          # MODIFY — add generateMetadata export
├── lib/
│   └── metadata.ts           # NEW — baseMetadata shared object
└── components/
    ├── WorkCard.tsx           # MODIFY — add placeholder + blurDataURL
    ├── ShopCard.tsx           # MODIFY — add placeholder + blurDataURL
    └── WorkDetail.tsx         # MODIFY — replace static BLUR_DATA_URL with real plaiceholder output
docs/
└── cms-guide.md              # NEW — owner training guide
public/
└── og-default.jpg            # NEW — 1200×630px fallback OG image
next.config.ts                # MODIFY — add images.formats AVIF
```

### Pattern 1: Shared baseMetadata in src/lib/metadata.ts

**What:** A single exported object holding fields shared by every page. Individual pages spread it and override `title`, `description`, and `openGraph.images`.

**When to use:** All pages. Avoids repeating `metadataBase`, `openGraph.siteName`, `openGraph.locale`, `robots`, and `twitter.card` on every file.

**Example:**

```typescript
// src/lib/metadata.ts
// Source: Next.js generateMetadata docs (nextjs.org/docs/app/api-reference/functions/generate-metadata)
import type { Metadata } from "next"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://byblendstrup.dk"

export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "By Blendstrup",
    template: "%s — By Blendstrup",
  },
  description: "Håndlavede keramikker fra By Blendstrup.",
  openGraph: {
    siteName: "By Blendstrup",
    locale: "da_DK",
    type: "website",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "By Blendstrup — håndlavet keramik",
      },
    ],
  },
  robots: { index: true, follow: true },
  twitter: { card: "summary_large_image" },
}
```

[VERIFIED: nextjs.org/docs/app/api-reference/functions/generate-metadata — metadataBase, openGraph, robots fields confirmed]

### Pattern 2: Static page metadata

**What:** Export a `metadata` const (not a function) from pages with no dynamic data.

**When to use:** Homepage, gallery index, contact, purchase inquiry, custom-orders.

**Example:**

```typescript
// src/app/contact/page.tsx
// Source: nextjs.org/docs/app/api-reference/functions/generate-metadata
import type { Metadata } from "next"
import { baseMetadata } from "@/lib/metadata"

export const metadata: Metadata = {
  ...baseMetadata,
  title: "Kontakt",
  description: "Kontakt By Blendstrup for køb af keramik eller generelle spørgsmål.",
  openGraph: {
    ...baseMetadata.openGraph,
    title: "Kontakt — By Blendstrup",
    description: "Kontakt By Blendstrup for køb af keramik eller generelle spørgsmål.",
  },
}
```

### Pattern 3: Dynamic page metadata with generateMetadata

**What:** Export an async `generateMetadata` function that reads Keystatic data. Used for gallery detail pages where title and OG image come from the work entry.

**When to use:** `src/app/gallery/[slug]/page.tsx` only.

**Example:**

```typescript
// src/app/gallery/[slug]/page.tsx
// Source: nextjs.org/docs/app/api-reference/functions/generate-metadata
import type { Metadata } from "next"
import { createReader } from "@keystatic/core/reader"
import { baseMetadata } from "@/lib/metadata"
import keystaticConfig from "../../../../keystatic.config"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const reader = createReader(process.cwd(), keystaticConfig)
  const work = await reader.collections.works.read(slug)

  if (!work || !work.published) {
    return { title: "Keramik — By Blendstrup" }
  }

  const firstImage = work.images[0]?.image ?? null
  const descriptionTrimmed = work.description
    ? work.description.slice(0, 120).replace(/\s+\S*$/, "") + " — By Blendstrup."
    : undefined

  return {
    ...baseMetadata,
    title: work.title,
    description: descriptionTrimmed,
    openGraph: {
      ...baseMetadata.openGraph,
      title: `${work.title} — By Blendstrup`,
      description: descriptionTrimmed,
      images: firstImage
        ? [{ url: firstImage, width: 1200, height: 630, alt: work.images[0]?.alt ?? work.title }]
        : baseMetadata.openGraph?.images,
    },
  }
}
```

### Pattern 4: plaiceholder blur generation in RSCs

**What:** Call `getPlaiceholder` with a Buffer read from the filesystem. Returns `{ base64 }` passed to `next/image` as `blurDataURL`.

**When to use:** `WorkCard`, `ShopCard`, `WorkDetail` — anywhere a ceramic image is displayed.

**Critical API detail:** plaiceholder v3 accepts a raw `Buffer`, not a file path string. You must `fs.readFileSync(absolutePath)` first.

**Image path mapping:** Keystatic stores image paths as public paths (e.g., `/images/works/bowl-test/images/0/image.png`). To get the filesystem path, prepend `process.cwd() + "/public"`.

**Example — shared utility:**

```typescript
// src/lib/blur-placeholder.ts
// Source: plaiceholder.co/docs/usage (verified 2026-04-21)
import { getPlaiceholder } from "plaiceholder"
import fs from "node:fs"
import path from "node:path"

export async function getBlurDataUrl(publicPath: string | null): Promise<string | undefined> {
  if (!publicPath) return undefined
  try {
    const absolutePath = path.join(process.cwd(), "public", publicPath)
    const file = fs.readFileSync(absolutePath)
    const { base64 } = await getPlaiceholder(file)
    return base64
  } catch {
    return undefined
  }
}
```

**Usage in RSC parent (WorkCard is a client component — blur generation happens in the server parent that renders it):**

```typescript
// In the RSC that renders WorkCard / ShopCard
const blurDataUrl = await getBlurDataUrl(entry.images[0]?.image ?? null)
// Pass blurDataUrl as a prop to the component
```

**Important:** `WorkCard` and `ShopCard` are currently pure client-renderable components (no `"use client"` directive found, but they receive props from RSC pages). The blur URL is computed in the RSC parent and passed as a prop. `WorkDetail` is already a server-renderable component and can call the utility directly.

[VERIFIED: plaiceholder.co/docs/usage — API accepts Buffer, returns { base64 }]

### Pattern 5: sitemap.ts with Keystatic data

**What:** App Router `sitemap.ts` at `src/app/sitemap.ts`. Reads Keystatic to enumerate published work slugs for dynamic gallery URLs.

**Example:**

```typescript
// src/app/sitemap.ts
// Source: nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
import type { MetadataRoute } from "next"
import { createReader } from "@keystatic/core/reader"
import keystaticConfig from "../../keystatic.config"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://byblendstrup.dk"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const reader = createReader(process.cwd(), keystaticConfig)
  const works = await reader.collections.works.all()
  const publishedSlugs = works
    .filter((w) => w.entry.published)
    .map((w) => w.slug)

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/gallery`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/custom-orders`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ]

  const dynamicRoutes: MetadataRoute.Sitemap = publishedSlugs.map((slug) => ({
    url: `${SITE_URL}/gallery/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  return [...staticRoutes, ...dynamicRoutes]
}
```

[VERIFIED: nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap — MetadataRoute.Sitemap type, async default export confirmed]

### Pattern 6: robots.ts

```typescript
// src/app/robots.ts
// Source: Next.js docs (metadataRoute.Robots)
import type { MetadataRoute } from "next"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://byblendstrup.dk"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/keystatic/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
```

### Pattern 7: AVIF format config in next.config.ts

```typescript
// next.config.ts
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
}

export default nextConfig
```

[VERIFIED: CLAUDE.md — `images: { formats: ['image/avif', 'image/webp'] }` is documented as the correct pattern]

### Anti-Patterns to Avoid

- **Spreading baseMetadata shallowly without re-spreading openGraph:** The Next.js metadata merging is shallow — if you spread `baseMetadata` and set `openGraph`, the entire parent `openGraph` is replaced. Always re-spread `...baseMetadata.openGraph` when extending it.
- **Calling getPlaiceholder with a URL string or public path:** v3 API requires a Buffer. Passing a string path will throw at build time.
- **Calling plaiceholder in a client component:** `fs.readFileSync` is not available in the browser. All blur generation must stay in RSC context (server components or utility functions called from them).
- **Generating blurDataURL per-render on dynamic routes:** For gallery detail pages, `generateStaticParams` already pre-renders at build time, so `readFileSync` inside `generateMetadata` or the page RSC is safe and runs once per slug.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| LQIP blur placeholders | Custom base64 shimmer generator | `plaiceholder` | Handles multiple image formats (JPEG, PNG, WebP), edge cases in sampling, sharp integration |
| Sitemap generation | Custom sitemap XML string builder | App Router `sitemap.ts` | Built-in type safety, auto-served at `/sitemap.xml`, handles encoding |
| robots.txt | Static file in /public | App Router `robots.ts` | Programmatic; environment-aware (can switch `disallow` based on env) |
| OG metadata | Custom `<head>` injection | `generateMetadata` | Next.js handles deduplication, streaming, bot detection |

---

## Common Pitfalls

### Pitfall 1: plaiceholder fails silently on missing images

**What goes wrong:** If a work entry has an image path stored in Keystatic but the file is not on disk (e.g., deleted from `/public/images/works/`), `fs.readFileSync` throws. If uncaught, the entire RSC render fails and the page returns 500.

**Why it happens:** Keystatic stores the path string; the file's presence is not validated at read time.

**How to avoid:** Wrap `getPlaiceholder` call in try/catch (shown in the shared utility pattern above). Return `undefined` on failure — `next/image` renders without blur rather than crashing.

**Warning signs:** Build-time errors mentioning `ENOENT` or `no such file` in the images path.

### Pitfall 2: OpenGraph fields silently dropped due to shallow merge

**What goes wrong:** If page-level metadata sets `openGraph: { title: "..." }` without re-spreading `baseMetadata.openGraph`, the OG image, siteName, and locale from `baseMetadata` are dropped.

**Why it happens:** `generateMetadata` merges metadata shallowly — nested objects are replaced entirely, not deep-merged.

**How to avoid:** Always spread the parent: `openGraph: { ...baseMetadata.openGraph, title: "...", description: "..." }`.

**Warning signs:** OG image missing from page head when checked with an OG debugger.

### Pitfall 3: sitemap.ts caches at build time (may miss recently added works)

**What goes wrong:** App Router caches `sitemap.ts` output by default because it's treated as a Route Handler. On Vercel's ISR/static model, the sitemap is built once and doesn't update without a redeploy.

**Why it happens:** Keystatic's git-based model means every content change triggers a Vercel redeploy anyway, so this is acceptable behavior for this project. But the developer needs to know this is by design.

**How to avoid:** No action needed — Keystatic's auto-deploy loop ensures the sitemap rebuilds with each content update. Do not add `export const dynamic = "force-dynamic"` to sitemap.ts, as that would hit the Keystatic Reader on every bot request.

### Pitfall 4: WorkCard and ShopCard receive images as props — blur must be passed from the RSC parent

**What goes wrong:** `WorkCard` and `ShopCard` receive `entry.images` as props from the gallery RSC. If blur generation is attempted inside the component file, it either fails (no `fs` access) or requires making the component async (which breaks the client-rendered hover interactions on ShopCard).

**Why it happens:** Components that accept props from an RSC parent are not themselves RSCs — they are rendered in the RSC context but can also be reused in client contexts.

**How to avoid:** Generate `blurDataURL` for each work's first image in the RSC page before passing to the card component. Add `blurDataUrl?: string` to the card prop interfaces.

**Warning signs:** TypeScript error `Cannot find module 'fs'` in a component file.

### Pitfall 5: NEXT_PUBLIC_SITE_URL not set in local development

**What goes wrong:** `sitemap.ts` and `robots.ts` fall back to a hardcoded domain when `NEXT_PUBLIC_SITE_URL` is not set. This is fine — but if the env var is missing at Vercel deploy time, URLs in the sitemap will be wrong.

**How to avoid:** Add `NEXT_PUBLIC_SITE_URL=https://byblendstrup.dk` to Vercel environment variables (all environments). Document this in the CMS guide's "first deploy" section or a separate `.env.example`.

### Pitfall 6: Lighthouse QA on localhost vs. production

**What goes wrong:** Lighthouse mobile simulation on localhost may show lower scores than production due to missing caching headers, uncompressed assets, and dev-mode React overhead.

**How to avoid:** Run Lighthouse against `next build && next start` (production build) locally, or use the deployed Vercel preview URL. Never baseline Lighthouse against `next dev`.

---

## Code Examples

### Copy strings from UI-SPEC (authoritative)

All title/description strings are defined in the UI Design Contract (`06-UI-SPEC.md`) and must be used verbatim:

| Page | title | description |
|------|-------|-------------|
| Root layout | `By Blendstrup` (default) | `Håndlavede keramikker fra By Blendstrup. Unikke stykker til salg og mulighed for at bestille specialfremstillede keramikker.` |
| Homepage | `By Blendstrup — Håndlavet keramik` | `Oplev håndlavede keramikker skabt med omhu. Se aktuelle stykker til salg og bestil din egen specialkeramik.` |
| Gallery | `Keramik — By Blendstrup` | `Gennemse alle håndlavede keramikker fra By Blendstrup. Filtrer efter stykker til salg.` |
| Gallery detail | `[Work title] — By Blendstrup` | `[Work description, first 120 chars] — By Blendstrup.` |
| Contact | `Kontakt — By Blendstrup` | `Kontakt By Blendstrup for køb af keramik eller generelle spørgsmål.` |
| Purchase inquiry | `Købsforespørgsel — By Blendstrup` | `Send en forespørgsel om køb af et keramikstykke fra By Blendstrup.` |
| Custom orders | `Specialbestilling — By Blendstrup` | `Bestil din egen specialfremstillede keramik fra By Blendstrup. Fortæl hvad du drømmer om.` |

Title format: `[Page name] — By Blendstrup` (em dash U+2014, not hyphen). [VERIFIED: 06-UI-SPEC.md]

Note: There is no `/shop` route. The shop is the gallery filtered by `?filter=for-sale` (confirmed in STATE.md — Phase 4 decision). Remove the "Shop" sitemap entry; it does not exist as a separate route.

### Root layout metadata (title template approach)

```typescript
// src/app/layout.tsx — add at top level (do not export alongside default export)
import type { Metadata } from "next"
import { baseMetadata } from "@/lib/metadata"

export const metadata: Metadata = {
  ...baseMetadata,
  title: {
    default: "By Blendstrup",
    template: "%s — By Blendstrup",
  },
  description: "Håndlavede keramikker fra By Blendstrup. Unikke stykker til salg og mulighed for at bestille specialfremstillede keramikker.",
}
```

With `title.template` set in the root layout, individual pages only need to set `title: "Kontakt"` and Next.js automatically produces `"Kontakt — By Blendstrup"`.

[VERIFIED: nextjs.org/docs/app/api-reference/functions/generate-metadata#template]

### WorkCard update (add blurDataUrl prop)

```typescript
// src/components/WorkCard.tsx — modified interface and Image usage
interface WorkCardProps {
  slug: string
  entry: WorkCardEntry
  labels: { sold: string; forSale: string }
  blurDataUrl?: string  // NEW
}

// In the Image component:
<Image
  src={entry.images[0]?.image ?? ""}
  alt={entry.images[0]?.alt ?? ""}
  fill
  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  placeholder={blurDataUrl ? "blur" : "empty"}  // NEW
  blurDataURL={blurDataUrl}                       // NEW
/>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `next-sitemap` as external library | App Router built-in `sitemap.ts` | Next.js 13.3 | One less dependency; type-safe; auto-served |
| Static `blurDataURL` shimmer (current in codebase) | plaiceholder-generated per-image base64 | Phase 6 | Blur matches actual image colors — better visual UX for ceramics |
| `themeColor` / `colorScheme` in metadata | `generateViewport` (separate export) | Next.js 14 | Viewport config is now separate from metadata — do not put themeColor in metadata object |
| `metadata.openGraph.images` as string | Array of `{ url, width, height, alt }` objects | Next.js 13+ | Richer OG preview; required for Twitter cards |

**Deprecated/outdated:**
- `next-intl` for i18n: package is still installed in `package.json` but all usage was removed in the quick task. It can be removed in Phase 6 (`pnpm remove next-intl`) as a cleanup step, but is not blocking anything.

---

## Runtime State Inventory

Step 2.5: SKIPPED — Phase 6 is not a rename, refactor, or migration phase. No runtime state inventory required.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | plaiceholder (fs.readFileSync) | Yes | 25.8.1 | — |
| sharp | plaiceholder peer dep | Not installed locally | Latest: 0.34.5 | Must install — plaiceholder will throw without it |
| plaiceholder | blur placeholder generation | Not installed | Latest: 3.0.0 | Must install — no viable alternative |
| Chrome DevTools | Lighthouse QA | Yes (assumed — dev machine) | — | Use Lighthouse CLI (`npm i -g lighthouse`) |

**Missing dependencies with no fallback:**
- `sharp` — required by plaiceholder. Install via `pnpm add sharp`.
- `plaiceholder` — install via `pnpm add plaiceholder`.

**Missing dependencies with fallback:**
- `NEXT_PUBLIC_SITE_URL` env var — not set locally. Hardcoded fallback `https://byblendstrup.dk` is acceptable for builds. Must be set in Vercel project settings before go-live.

[VERIFIED: npm registry — sharp 0.34.5, plaiceholder 3.0.0; local environment probed]

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.4 |
| Config file | none — default Vitest config auto-detects |
| Quick run command | `pnpm test` |
| Full suite command | `pnpm test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DSGN-02 | plaiceholder returns base64 for a valid image path | unit | `pnpm test -- blur-placeholder` | No — Wave 0 |
| DSGN-02 | blur utility returns undefined for missing file (no crash) | unit | `pnpm test -- blur-placeholder` | No — Wave 0 |
| DSGN-03 | Responsive layout — manual Lighthouse | manual | Chrome DevTools Lighthouse, mobile preset | N/A |
| DSGN-04 | No e-commerce chrome elements — code grep | manual | `grep -r "cart\|rating\|stock\|discount\|add-to-cart" src/` | N/A |
| I18N-04 | RETIRED — no test needed | — | — | N/A |

### Sampling Rate

- **Per task commit:** `pnpm test`
- **Per wave merge:** `pnpm test`
- **Phase gate:** Full suite green + Lighthouse results documented before `/gsd-verify-work`

### Wave 0 Gaps

- [ ] `src/__tests__/blur-placeholder.test.ts` — covers DSGN-02 blur utility (happy path + missing file)

*(All other existing tests continue to pass unchanged — this phase touches no existing test-covered logic)*

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | — |
| V3 Session Management | no | — |
| V4 Access Control | partial | robots.ts disallows `/keystatic/` from indexing (not auth, but reduces exposure) |
| V5 Input Validation | no | Phase 6 adds no new user inputs |
| V6 Cryptography | no | — |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Keystatic admin exposed to search engine indexing | Information Disclosure | `robots.ts` disallows `/keystatic/` — implemented in this phase |
| OG image URL reflecting unvalidated work slug | Tampering | `generateMetadata` reads from Keystatic Reader — only published works are read; 404 guard in place |

Phase 6 introduces minimal new attack surface. The primary security deliverable is `robots.ts` blocking `/keystatic/` from crawlers.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | The Vercel production domain will be `byblendstrup.dk` (used as fallback in sitemap/robots) | Code Examples | If domain differs, sitemap URLs are wrong — must update `NEXT_PUBLIC_SITE_URL` env var before launch |
| A2 | `WorkCard` and `ShopCard` have no `"use client"` directive (making them RSC-compatible for async props) | Architecture Patterns | If they use hooks or event handlers requiring `"use client"`, blur must be passed as a prop from the server parent — the shared utility pattern already handles this correctly either way |
| A3 | The owner will use Keystatic Cloud for production CMS access (referenced in D-15) | CMS Training | If Keystatic Cloud setup is incomplete, the CMS guide instructions for login will be incorrect |

---

## Open Questions

1. **OG fallback image asset availability**
   - What we know: D-05 specifies a static `/public/og-default.jpg` at 1200×630px sourced from owner's existing assets.
   - What's unclear: The owner has not yet provided this asset. The planner should include a task for the executor to either use an existing photo from `/public/images/` resized/cropped, or request the asset from the owner.
   - Recommendation: Have the executor pick the best existing ceramic photo from `/public/images/works/` and crop it to 1200×630px using an image editor or sharp script.

2. **next-intl removal**
   - What we know: `next-intl` is in `package.json` but unused. Removed from source in the quick task.
   - What's unclear: Whether removing the package is in scope for Phase 6 or left as a v2 cleanup.
   - Recommendation: Include as a low-effort cleanup task in Wave 1 (`pnpm remove next-intl`) since it reduces bundle size and removes a stale dependency.

3. **NEXT_PUBLIC_SITE_URL environment variable**
   - What we know: sitemap.ts and robots.ts fall back to a hardcoded domain.
   - What's unclear: Whether the Vercel project is already configured with this env var.
   - Recommendation: Planner includes a verification step — check Vercel dashboard or add `NEXT_PUBLIC_SITE_URL` to `.env.example` with instructions.

---

## Sources

### Primary (HIGH confidence)
- nextjs.org/docs/app/api-reference/functions/generate-metadata — generateMetadata API, title template, openGraph fields, metadataBase (verified 2026-04-21)
- nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap — MetadataRoute.Sitemap type and async export pattern (verified 2026-04-21)
- plaiceholder.co/docs/usage — getPlaiceholder API: accepts Buffer, returns { base64 }, peer dep sharp >= 0.30.6 (verified 2026-04-21)
- npm registry: plaiceholder@3.0.0, sharp@0.34.5 (verified 2026-04-21)
- Codebase grep: WorkCard.tsx, ShopCard.tsx, WorkDetail.tsx, all page files, keystatic.config.ts, next.config.ts, public/images/ structure (verified 2026-04-21)
- 06-CONTEXT.md — locked decisions D-01 through D-15 (authoritative)
- 06-UI-SPEC.md — copywriting contract, breakpoint matrix, color audit rules (authoritative)

### Secondary (MEDIUM confidence)
- Keystatic image path convention confirmed via `content/works/bowl-test/index.yaml` — images stored as `/images/works/[slug]/images/[index]/image.[ext]`, absolute filesystem path is `process.cwd() + "/public" + publicPath`

### Tertiary (LOW confidence)
- A3 (Keystatic Cloud production setup) — not verified in this session; depends on external service configuration

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — npm registry verified, plaiceholder v3 API confirmed via official docs
- Architecture: HIGH — Next.js docs verified, patterns derived directly from existing codebase inspection
- Pitfalls: HIGH — derived from plaiceholder v3 changelog (Buffer-only API), Next.js metadata merging behavior (official docs), and existing code patterns
- QA methodology: HIGH — Lighthouse mobile simulation is standard; thresholds from CONTEXT.md D-11

**Research date:** 2026-04-21
**Valid until:** 2026-05-21 (30 days — stable stack)
