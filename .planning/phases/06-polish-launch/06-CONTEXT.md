# Phase 6: Polish & Launch - Context

**Gathered:** 2026-04-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Close out launch readiness across four areas:

1. **SEO metadata** — `generateMetadata` per route (title, description, OG tags, og:image), `sitemap.ts`, and `robots.ts` (blocking `/keystatic/*`). No hreflang — site is Danish-only.
2. **Image optimization** — blur placeholders via `plaiceholder` for all ceramic images; explicit AVIF configuration in `next.config.ts`.
3. **Responsive QA** — Lighthouse mobile simulation on homepage, gallery, work detail, shop page, contact page, and both inquiry forms.
4. **Owner CMS training** — Written Markdown guide committed to the repo covering: adding a piece, marking as sold, curating the homepage, and editing site settings.

This phase does NOT include: animated page transitions, auto-reply emails (v2), Cloudflare Turnstile (deferred), or new content pages (v2 About/FAQ/Care).

</domain>

<decisions>
## Implementation Decisions

### SEO Metadata

- **D-01:** Use App Router `generateMetadata` (exported from each page file) — no extra library. Per-page output: `title`, `description`, `openGraph.title`, `openGraph.description`, `openGraph.images`.
- **D-02:** Hreflang dropped entirely. The site is Danish-only (i18n removed in Phase 1 quick task). I18N-04 is retired from v1 scope.
- **D-03:** `sitemap.ts` in `src/app/` using the App Router built-in. Lists all static routes (homepage, gallery, shop, contact, custom-orders) plus dynamic gallery detail pages (read from Keystatic at build time).
- **D-04:** `robots.ts` in `src/app/` — `Allow: /`, `Disallow: /keystatic/`. Blocks the CMS admin from search engine indexing.
- **D-05:** `og:image` for pages without a ceramic photo (homepage, contact, custom-orders): a static fallback image committed to `/public` (e.g., `/public/og-default.jpg`). Gallery detail pages use the first ceramic image.
- **D-06:** OG image dimensions: 1200×630px (standard). The fallback image should be a high-quality ceramic photograph — sourced from the owner's existing assets.

### Image Optimization

- **D-07:** Install `plaiceholder` to generate `blurDataURL` at build time. Apply `placeholder="blur"` + `blurDataURL` to all `next/image` instances rendering ceramic images (`WorkCard`, `ShopCard`, `WorkDetail`). Keystatic stores images in `/public/images/` — `plaiceholder` reads the file at build time from the filesystem path.
- **D-08:** Add `images: { formats: ['image/avif', 'image/webp'] }` to `next.config.ts`. Ensures AVIF is the primary delivery format for supporting browsers.
- **D-09:** No change to `sizes` props — they are already correct on `WorkCard` and `ShopCard`. Only add `placeholder` and `blurDataURL`.

### Responsive QA

- **D-10:** Lighthouse mobile simulation (Chrome DevTools Lighthouse, mobile preset) on: homepage, gallery index, gallery detail page, shop page, contact page, purchase inquiry form, and custom order form.
- **D-11:** Target: Lighthouse Performance ≥ 80, Accessibility ≥ 90 on mobile. If any page scores below these thresholds, fix before marking phase complete.
- **D-12:** The planner should include a checkpoint plan that documents the Lighthouse results for each page as the verification artifact for DSGN-02 and DSGN-03.

### Owner CMS Training

- **D-13:** A written Markdown guide committed to the repo at `docs/cms-guide.md`. Written for a non-technical owner — plain language, step-by-step, no code references.
- **D-14:** Guide covers exactly four tasks:
  1. Adding a new ceramic piece (upload image, fill title/description, set category, for-sale status, price, lead time, publish)
  2. Marking a piece as sold (change saleStatus field, save → auto-deploy)
  3. Curating the homepage (picking hero piece and shop preview pieces in the homepage singleton)
  4. Editing site settings (contact email, Instagram handle in the settings singleton)
- **D-15:** Guide includes the Keystatic admin URL and how to access it (Keystatic Cloud login flow). No developer intervention needed for routine updates.

### Claude's Discretion

- Exact `generateMetadata` default title format (e.g., `"[Page name] | By Blendstrup"` vs `"By Blendstrup – [Page name]"`)
- Whether to use a shared `baseMetadata` object to avoid repeating common fields across pages
- Placement and naming of the `og-default.jpg` fallback image in `/public/`
- How `plaiceholder` is invoked — module-level at component import time, or a shared utility function in `src/lib/`
- Exact Lighthouse score thresholds (D-11 sets floor; planner can tighten if scores are strong)
- CMS guide formatting — whether to use headers + numbered steps, or a simpler checklist style

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design System (authoritative)
- `.planning/phases/01-foundation/01-UI-SPEC.md` — Complete design contract: Fraunces + DM Sans fonts, full color palette, spacing scale, Tailwind `@theme` block. Any visual decisions in Phase 6 must stay within these tokens.

### Stack Constraints and Integration Notes
- `CLAUDE.md` — next/image strategy (always use next/image, never `<img>`), what NOT to use, Keystatic Reader API usage in RSCs. Confirm: site is Danish-only (i18n removed); no locale prefix in routes; App Router built-in `sitemap.ts`/`robots.ts` preferred over `next-sitemap` library.

### Phase Requirements (phase-scoped)
- `.planning/REQUIREMENTS.md` §DSGN-02 — Ceramics imagery at high quality with fast load times (next/image with AVIF, blur placeholders)
- `.planning/REQUIREMENTS.md` §DSGN-03 — Fully responsive across mobile, tablet, and desktop
- `.planning/REQUIREMENTS.md` §DSGN-04 — No e-commerce chrome (audit-only in this phase)
- `.planning/REQUIREMENTS.md` §I18N-04 — Hreflang tags (**RETIRED** — site is Danish-only; this requirement is out of scope for v1)

### Prior Phase Context (integration)
- `.planning/phases/05-inquiries-email-delivery/05-CONTEXT.md` — Documents the form routes, server actions, and Resend setup from Phase 5. Phase 6 QA must cover the form pages.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/WorkCard.tsx` — Uses `next/image` with `fill` + `sizes`. Needs `placeholder="blur"` + `blurDataURL` added. No other changes expected.
- `src/components/ShopCard.tsx` — Same pattern as WorkCard. Same blur placeholder update needed.
- `src/components/WorkDetail.tsx` — Detail page images. Same blur placeholder update needed.
- `src/app/layout.tsx` — Root layout. No `generateMetadata` exported here — add site-level default metadata here.
- `src/app/page.tsx` — Homepage. Needs `generateMetadata` added.
- `src/app/gallery/page.tsx`, `src/app/gallery/[slug]/page.tsx` — Gallery routes. Need `generateMetadata`.
- `src/app/contact/page.tsx`, `src/app/contact/purchase/page.tsx`, `src/app/custom-orders/page.tsx` — Form pages. Need `generateMetadata`.

### Established Patterns
- Keystatic Reader API (`createReader`) in RSCs — use this in `sitemap.ts` to enumerate published works for dynamic gallery URLs.
- Tailwind v4 utility classes with design tokens — no changes to styling in this phase.
- `next.config.ts` is currently empty (`{}`). Add `images.formats` here.
- Biome for linting/formatting — run before committing.

### Integration Points
- `sitemap.ts` needs the Keystatic reader to enumerate gallery slugs at build time.
- `robots.ts` is a simple static file with no external dependencies.
- `plaiceholder` reads images from the filesystem at build time — images must be accessible at the path stored in Keystatic (e.g., `/public/images/works/[slug].[ext]`).
- `docs/cms-guide.md` is a new file — no existing `docs/` directory to check for.

</code_context>

<specifics>
## Specific Ideas

- **`generateMetadata` pattern:** Export a `generateMetadata` function from each page file. For static pages, return a literal object. For dynamic pages (gallery detail), accept `params` and read the work entry via `createReader` to get the title and first image for og:image.
- **`sitemap.ts` pattern:** App Router built-in. Return an array of `{ url, lastModified }` entries. Dynamic entries come from `createReader().collections.works.list()`.
- **`plaiceholder` usage:** `import { getPlaiceholder } from 'plaiceholder'` in a server-only context. Call it with the image file path, receive `{ base64 }` to use as `blurDataURL`. This runs at build time in RSCs.
- **OG fallback image:** Name it `og-default.jpg` at `/public/og-default.jpg`. Reference via the site's base URL in metadata: `process.env.NEXT_PUBLIC_SITE_URL + '/og-default.jpg'` (or hardcode the Vercel domain if env var not set).
- **CMS guide location:** `docs/cms-guide.md` at repo root. Plain language, screenshots described in text (owner can follow without seeing the exact screenshot if UI changes slightly).

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 06-polish-launch*
*Context gathered: 2026-04-21*
