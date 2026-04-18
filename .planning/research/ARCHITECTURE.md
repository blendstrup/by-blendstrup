# Architecture Research — By Blendstrup

**Researched:** 2026-04-18
**Scope:** Architecture dimension (system structure, components, data flow, deployment)
**Overall confidence:** MEDIUM-HIGH (based on Keystatic + Next.js App Router documented patterns; WebSearch was unavailable during research, so specific Keystatic API shapes below should be verified against current docs before implementation)

> Note: External web search tools were unavailable for this research session. Findings are drawn from established patterns for Next.js App Router, Keystatic (as of its stable 1.x line), Vercel, and Resend. Any item marked [VERIFY] below should be cross-checked against the current official docs during implementation.

---

## System Overview

By Blendstrup is a **statically-generated, content-driven brochure+catalog site** with a CMS that writes directly to the Git repo. There is no traditional backend server; every "dynamic" concern is resolved at build time or via small serverless functions on Vercel.

```
┌────────────────────────────────────────────────────────────────────────┐
│                         Owner's Browser                                │
│        (Keystatic Admin UI at /keystatic — GitHub OAuth auth)          │
└────────────────────┬───────────────────────────────────────────────────┘
                     │ edits content (products, images, highlights)
                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│   Keystatic (GitHub mode) — commits .md/.yaml/.json + images to repo   │
└────────────────────┬───────────────────────────────────────────────────┘
                     │ git push → main
                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         GitHub (content store)                         │
└────────────────────┬───────────────────────────────────────────────────┘
                     │ push webhook
                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│  Vercel — builds Next.js (App Router), runs SSG, deploys static site   │
└────────────────────┬───────────────────────────────────────────────────┘
                     │ serves
                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         Visitors (Danish + English)                    │
│    - Browse gallery, for-sale, custom orders (static HTML + images)    │
│    - Submit inquiry form → POST to /api/inquiry (Vercel function)      │
└────────────────────┬───────────────────────────────────────────────────┘
                     │ form POST
                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│  /api/inquiry (Vercel serverless) → Resend API → Owner's inbox         │
└────────────────────────────────────────────────────────────────────────┘
```

**Key architectural properties:**
- **Content = repo files.** No database. Content changes = git commits.
- **Build = deployment.** Every content edit triggers a Vercel build + redeploy (~30–60s typical for a small site).
- **Public pages are static** (pre-rendered HTML + CDN). Fast, cheap, SEO-friendly.
- **Only serverless code** is the inquiry-form submit handler (one route).
- **Images** live in the repo (or Keystatic cloud storage — see Decision below). Next.js `<Image>` optimizes at build time + on-demand.

---

## Keystatic Content Schema

Keystatic distinguishes **collections** (many items, e.g. products) from **singletons** (one-of, e.g. homepage). Schema is defined in `keystatic.config.ts`. Everything below assumes **bilingual content is stored as parallel `_da` / `_en` fields within one entry**, not as separate locale-scoped collections — this keeps the owner's mental model simple ("one product, two languages") and makes it impossible to forget translating a field.

### Collections

#### `works` — the full gallery of ceramics (past + current)
```
slug                     (auto from title_en)
title_da, title_en       (text, required)
description_da,          (markdoc / wysiwyg)
  description_en
yearCreated              (number)
category                 (select: "vase" | "bowl" | "plate" | "sculpture" | "tableware" | "other")
primaryImage             (image, required) — hero shot
gallery                  (array of images) — additional angles/details
dimensions               (text, e.g. "Ø 18 × H 12 cm")
materials_da,            (text)
  materials_en
tags                     (array of strings) — freeform for filtering
featured                 (boolean) — eligible for homepage highlight
createdAt                (date, auto)
```

#### `forSale` — items currently available to purchase
Modeled as a **separate collection** rather than a flag on `works`, because for-sale items have distinct fields (price, availability status, lead time) and the owner thinks of them as a separate list to maintain. A for-sale item *may* reference a `works` entry, or may be standalone.

```
slug                     (auto)
title_da, title_en
description_da,
  description_en
images                   (array of images, required, min 1)
price                    (number, DKK)
priceDisplay_da,         (text, optional override — e.g. "Sold as a pair")
  priceDisplay_en
status                   (select: "available" | "reserved" | "sold")
dimensions
materials_da, materials_en
linkedWork               (relationship → works, optional)
order                    (number) — manual sort
```

> Owner workflow: when an item sells, owner sets `status: sold`. Optionally we hide sold items with a toggle, or keep them visible with a "Sold" badge (recommended — conveys demand).

#### `customOrderOptions` — the catalog of things a customer can request
```
slug
name_da, name_en
description_da, description_en
exampleImage
leadTimeWeeks            (number)
startingPrice            (number, optional)
active                   (boolean)
```
Used to populate the custom-order form's dropdown/selector.

### Singletons

#### `homepage`
```
heroImage                (image, required)
heroHeadline_da,
  heroHeadline_en
heroSubtext_da,
  heroSubtext_en
featuredWorks            (array of relationships → works, max 6)
featuredForSale          (array of relationships → forSale, max 3)
aboutBlurb_da,           (markdoc)
  aboutBlurb_en
ctaText_da, ctaText_en
```

#### `siteSettings`
```
siteName
logo                     (image)
ogImage                  (image) — social share
defaultOgDescription_da,
  defaultOgDescription_en
contactEmail             (text) — destination for inquiry forms
socialLinks              (array of { label, url })
footerText_da, footerText_en
```

#### `about`
```
portraitImage
bio_da, bio_en           (markdoc)
studioLocation_da,
  studioLocation_en
philosophy_da,
  philosophy_en          (optional longer prose)
```

#### `customOrderPage`
```
intro_da, intro_en       (markdoc)
processSteps             (array of { title_da, title_en, body_da, body_en })
leadTimeNote_da,
  leadTimeNote_en
formDestination          (text, email) — override for siteSettings.contactEmail
```

### Storage decisions

- **Content files** → commit to repo under `content/works/*.mdoc`, `content/forSale/*.mdoc`, etc. (Keystatic default layout).
- **Images** → two options:
  1. **Repo storage** (default) — commits images alongside content. Pro: fully self-contained, free. Con: repo grows; large PNG uploads feel slow for the owner.
  2. **Keystatic Cloud** — images stored separately, repo only holds references. Pro: fast uploads, optimized delivery. Con: adds a dependency (though free tier is generous).

  **Recommendation:** Start with repo storage (aligns with "zero ongoing cost"); revisit if repo size or upload UX degrades.

---

## Page Architecture

Route structure uses App Router with a `[locale]` dynamic segment:

```
app/
├── [locale]/
│   ├── layout.tsx             # locale provider, fonts, header/footer
│   ├── page.tsx               # homepage (SSG)
│   ├── works/
│   │   ├── page.tsx           # gallery index (SSG)
│   │   └── [slug]/page.tsx    # work detail (SSG, generateStaticParams)
│   ├── shop/
│   │   ├── page.tsx           # for-sale index (ISR, revalidate: 60)
│   │   └── [slug]/page.tsx    # for-sale detail (ISR)
│   ├── custom-orders/page.tsx # custom order page + form
│   ├── about/page.tsx
│   └── not-found.tsx
├── api/
│   └── inquiry/route.ts       # form submit handler
├── keystatic/
│   └── [[...params]]/page.tsx # Keystatic admin UI
├── layout.tsx                 # root (html/body)
├── robots.ts
└── sitemap.ts
```

### Rendering strategy per page

| Page | Strategy | Why |
|------|----------|-----|
| `/` homepage | **SSG** | Fully static; rebuilds on any content change anyway. |
| `/works` | **SSG** | Gallery listing, rebuilt on content change. |
| `/works/[slug]` | **SSG + `generateStaticParams`** | Pre-render every work at build time. |
| `/shop` | **SSG (or ISR 60s)** | Owner changes availability often; SSG is fine since every edit triggers a rebuild. ISR only if we ever want status changes without commits. |
| `/shop/[slug]` | **SSG + `generateStaticParams`** | Same as works. |
| `/custom-orders` | **SSG** | Mostly static marketing + form. Form submits client-side. |
| `/about` | **SSG** | Rarely changes. |
| `/keystatic/*` | **Dynamic (client)** | Keystatic admin must run client-side with GitHub auth. Wrapped so it's excluded from static export. |
| `/api/inquiry` | **Dynamic (node runtime)** | Needs env vars (Resend API key). |

**Locale handling:**
- `generateStaticParams` at each route returns `[{ locale: 'da' }, { locale: 'en' }]` × each slug.
- Root `/` redirects to `/da` (default) via middleware, or uses `Accept-Language` detection for first visit.
- Language toggle switches the `[locale]` segment while preserving the rest of the path — requires a slug-translation lookup if slugs differ per locale (recommendation: **use the same slug for both locales**, derived from the English title, to keep URLs canonical and simpler).

### Data fetching

Keystatic provides a **Reader API** (`createReader`) for reading content at build time inside Server Components. Typical pattern:

```ts
// lib/content.ts
import { createReader } from '@keystatic/core/reader';
import config from '../keystatic.config';
export const reader = createReader(process.cwd(), config);

// app/[locale]/works/page.tsx (Server Component)
export default async function WorksPage({ params: { locale } }) {
  const works = await reader.collections.works.all();
  return <WorksGrid works={works} locale={locale} />;
}
```

[VERIFY] Exact Reader API surface against current Keystatic docs.

---

## Deployment Pipeline

### Path A — Owner edits content via Keystatic admin (GitHub mode)

1. Owner opens `https://byblendstrup.com/keystatic` and authenticates with GitHub (one-time — she uses a GitHub account created for her, or the owner's personal account).
2. Owner edits a product / uploads image / updates homepage.
3. On Save, Keystatic commits directly to the `main` branch via the GitHub API (or to a branch + PR if we configure branched workflow — not needed for a single-editor site).
4. GitHub receives the push; its webhook notifies Vercel.
5. Vercel runs `next build`:
   - Keystatic Reader reads the freshly committed files.
   - `generateStaticParams` enumerates all works/shop items.
   - Next.js emits static HTML + optimized images.
6. Vercel promotes the new build to production (~30–90s total from Save to live).

### Path B — Developer edits code

Standard git flow: push to branch → PR → merge to `main` → Vercel builds.

### Preview deployments

Any PR (including Keystatic's branched saves if enabled) gets a Vercel preview URL. Useful if we ever let the owner review changes before they go live (toggle `storage.kind: 'github'` with `branchPrefix`).

### Build config notes

- **Next.js Image**: use `next/image`; enable `images.remotePatterns` only if we switch to Keystatic Cloud hosting.
- **Env vars on Vercel**: `RESEND_API_KEY`, `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` [VERIFY exact names against Keystatic auth setup docs].
- **Build caching**: Vercel caches `.next/cache` between builds → image optimization results persist.

---

## Email / Form Submission Strategy

No backend server, but we have Vercel serverless functions. Three options evaluated:

### Option 1: Resend + Next.js API route (**recommended**)
- Add `app/api/inquiry/route.ts` with a POST handler.
- Validate with `zod`; send with `resend` SDK.
- Free tier: 3,000 emails/month, 100/day — vastly more than needed.
- Pro: First-class DX, React Email support for nice templates, keeps domain identity (`inquiries@byblendstrup.com`).
- Con: Requires domain DNS setup (SPF/DKIM) — one-time.

```ts
// app/api/inquiry/route.ts
import { Resend } from 'resend';
import { z } from 'zod';

const Body = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  message: z.string().min(10).max(4000),
  desiredItem: z.string().optional(),
  quantity: z.number().int().positive().optional(),
  locale: z.enum(['da', 'en']),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return Response.json({ ok: false }, { status: 400 });

  const resend = new Resend(process.env.RESEND_API_KEY!);
  await resend.emails.send({
    from: 'By Blendstrup <inquiries@byblendstrup.com>',
    to: process.env.INQUIRY_TO!,
    replyTo: parsed.data.email,
    subject: `New inquiry from ${parsed.data.name}`,
    text: formatInquiry(parsed.data),
  });
  return Response.json({ ok: true });
}
```

### Option 2: Formspree / Basin / Formsubmit
- No API route needed — form POSTs directly to their endpoint.
- Pro: Zero-code.
- Con: Branded emails on free tier, less control over spam handling, external dependency for a core flow. Free tiers typically 50/month.
- Use only if we want to defer Resend setup.

### Option 3: Web3Forms / mailto: links
- Ruled out: mailto breaks on mobile and reveals email address to scrapers; Web3Forms has the same branding trade-off as Formspree.

### Spam protection
- **Honeypot field** (hidden input that bots fill) — catches 90%+ of bots.
- **Cloudflare Turnstile** (invisible, free) — recommended for the custom-order form.
- Rate limit at the route: Vercel KV or Upstash free tier if abuse becomes a problem (defer).

### Email templates
- Use **React Email** (pairs with Resend) to render the inquiry as a tidy HTML email with product image + customer details.
- Send a **plain-text confirmation** to the customer so they have a record.

---

## Component Structure

```
components/
├── layout/
│   ├── Header.tsx                # logo + nav + language toggle
│   ├── Footer.tsx
│   ├── LanguageToggle.tsx        # swaps [locale] segment
│   └── Nav.tsx
├── ceramics/                     # domain-specific
│   ├── WorkCard.tsx              # thumbnail card used in grids
│   ├── WorkGrid.tsx              # responsive masonry/grid
│   ├── WorkDetail.tsx            # hero + gallery + metadata
│   ├── ForSaleCard.tsx           # includes price + status badge
│   ├── ForSaleDetail.tsx         # + "Contact to buy" CTA
│   ├── Gallery.tsx               # lightbox / carousel for multiple images
│   └── StatusBadge.tsx           # Available / Reserved / Sold
├── forms/
│   ├── InquiryForm.tsx           # custom order form
│   ├── ContactForSaleForm.tsx    # shorter form prefilled with item
│   ├── Field.tsx                 # consistent field wrapper
│   └── SubmitButton.tsx          # loading/success/error states
├── primitives/                   # Japandi design system
│   ├── Container.tsx             # max-width + padding
│   ├── Section.tsx               # vertical rhythm
│   ├── Heading.tsx               # serif display + sans body pairing
│   ├── Prose.tsx                 # typography wrapper for markdoc output
│   ├── Image.tsx                 # wraps next/image with consistent ratios
│   └── Button.tsx
├── content/
│   ├── Markdoc.tsx               # renders Keystatic markdoc fields
│   └── LocalizedField.tsx        # picks _da or _en based on locale
└── seo/
    ├── Metadata.ts               # generateMetadata helpers
    └── JsonLd.tsx                # Product / LocalBusiness schema
```

### Design system principles (Japandi)

- **Two fonts max**: a quiet humanist serif for headings (e.g. Fraunces, Cormorant) + a neutral sans for body (e.g. Inter, Söhne). Load via `next/font`.
- **Muted palette**: off-white, warm beige, clay, charcoal. Define as CSS variables in `globals.css` and consume via Tailwind theme tokens (or vanilla CSS — Tailwind recommended for DX).
- **Generous whitespace**: grid with large gutters; hero images occupy 70–90vh.
- **Imagery-first**: no card chrome on thumbnails — image + title + nothing else. Metadata revealed on detail view.
- **Motion**: near-zero. Subtle fade-in on scroll at most.

### Styling recommendation

**Tailwind CSS v4** with a custom theme file encoding the palette + typography scale. Tailwind's utility density keeps the component count low and makes iterating on spacing/color trivial — important for a designer-driven site. Alternatively, CSS Modules work fine; avoid CSS-in-JS runtime libraries (Emotion etc.) — they add bundle weight that fights the "quiet, fast" aesthetic.

---

## Build Order

Dependencies flow from foundation → content layer → pages → integrations. Build in this order:

### 1. Foundation (must exist before anything else)
1. Next.js App Router scaffold with `[locale]` segment + i18n middleware.
2. Tailwind + font setup + color tokens.
3. Root layout (Header, Footer, LanguageToggle — can be stubs).
4. `primitives/` (Container, Section, Heading, Image, Button).

### 2. Content layer
5. Keystatic config with `siteSettings` + `homepage` singletons (smallest surface, lets us test the admin + deploy loop end-to-end).
6. Keystatic Reader wiring + `LocalizedField` / `Markdoc` helpers.
7. First real page: **homepage** reading from the `homepage` singleton.
8. Verify end-to-end: edit homepage in admin → commit → Vercel rebuild → see change live. **Do not proceed until this loop works.**

### 3. Core content types
9. Add `works` collection schema.
10. Build `WorkCard` + `WorkGrid` + `/works` index page.
11. Build `WorkDetail` + `/works/[slug]` with `generateStaticParams`.
12. Add `forSale` collection schema + `StatusBadge`.
13. Build `/shop` index + `/shop/[slug]` detail.

### 4. Forms + email
14. Resend account + domain verification + env vars in Vercel.
15. `/api/inquiry/route.ts` with zod validation.
16. `InquiryForm` + `/custom-orders` page.
17. `ContactForSaleForm` wired into `ForSaleDetail`.
18. Spam protection (honeypot + optional Turnstile).

### 5. Polish
19. `about` page + singleton.
20. SEO: `generateMetadata`, OG images, sitemap.ts, robots.ts, Product JSON-LD.
21. 404 page, loading states, error boundaries.
22. Performance pass: image sizes, font preload, Lighthouse.
23. Analytics (Vercel Web Analytics — free, privacy-friendly).

### Critical-path dependencies

```
Foundation (1-4) ──┬──► Content layer (5-8) ──► works (9-11) ──► shop (12-13)
                   │                                                  │
                   └──► primitives used by ──────────────────────────┘
                                                                      │
                                                      forms (14-18) ──┤
                                                                      │
                                                          polish (19-23)
```

**Single biggest de-risk:** Steps 5–8. Everything else is conventional Next.js. The Keystatic → GitHub → Vercel loop is the one piece that is unusual and must be proven early with the smallest possible surface (the homepage singleton) before investing in collection schemas.

---

## Sources & Confidence

| Area | Confidence | Basis |
|------|------------|-------|
| Next.js App Router + `[locale]` pattern | HIGH | Established, well-documented pattern. |
| Keystatic schema shape (collections/singletons/fields) | MEDIUM | Reflects Keystatic 1.x as of training data; exact field type names [VERIFY] against current docs. |
| Keystatic GitHub mode + auto-deploy via Vercel | HIGH | Core documented flow; this is why Keystatic was chosen. |
| Resend as email provider | HIGH | De-facto standard for Next.js serverless email in 2024–2026. |
| Rendering strategy (SSG for everything public) | HIGH | Content-change-triggers-rebuild model makes SSG correct. |
| Image storage (repo vs Keystatic Cloud) | MEDIUM | Trade-off is real; owner-experience impact should be validated in use. |
| Japandi design system specifics | MEDIUM | Opinionated recommendations, not prescriptive requirements. |

### Items to verify before implementation
- Exact Keystatic field type names + Reader API surface against the current version.
- Keystatic auth env var names.
- Resend free-tier limits at time of implementation.
- Whether to enable Vercel's image optimization for repo-hosted images (likely yes).
