# Phase 6: Polish & Launch - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-21
**Phase:** 06-polish-launch
**Areas discussed:** SEO metadata scope, Image optimization depth, Responsive QA approach, Owner training format

---

## SEO Metadata Scope

| Option | Description | Selected |
|--------|-------------|----------|
| Standard — titles + OG tags | generateMetadata per page: title, description, og:title, og:description, og:image | ✓ |
| Minimal — titles only | Just page titles and meta description | |
| Comprehensive — OG + structured data | OG tags + JSON-LD structured data | |

**User's choice:** Standard — titles + OG tags

---

| Option | Description | Selected |
|--------|-------------|----------|
| Drop hreflang entirely | Site is Danish-only; hreflang adds no value | ✓ |
| Keep self-referencing hreflang | Single hreflang="da" self-referencing tag | |

**User's choice:** Drop hreflang entirely
**Notes:** i18n was removed in Phase 1 quick task; I18N-04 retired from v1 scope

---

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, include both sitemap.ts + robots.ts | App Router built-ins, no extra deps | ✓ |
| Sitemap only | Skip robots.ts | |
| Skip both for now | Post-launch addition | |

**User's choice:** Yes, include both

---

| Option | Description | Selected |
|--------|-------------|----------|
| Static fallback image in /public | Single high-quality ceramic photo as default og:image | ✓ |
| Skip og:image on non-ceramic pages | Only set on gallery/work detail pages | |
| Dynamic OG image via Next.js ImageResponse | Generated on demand with text overlays | |

**User's choice:** Static fallback image

---

## Image Optimization Depth

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, add blur placeholders | Install plaiceholder for blurDataURL at build time | ✓ |
| Skip blur placeholders | Keep current next/image setup as-is | |

**User's choice:** Yes, add blur placeholders
**Notes:** Apply to WorkCard, ShopCard, and WorkDetail components

---

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, set AVIF as primary format | Add formats: ['image/avif', 'image/webp'] to next.config.ts | ✓ |
| Skip — Vercel defaults are fine | No explicit config needed | |

**User's choice:** Yes, set AVIF as primary format

---

## Responsive QA Approach

| Option | Description | Selected |
|--------|-------------|----------|
| Manual browser testing | Chrome DevTools at 375/768/1280px breakpoints | |
| Playwright viewport tests | Automated screenshot tests | |
| Lighthouse mobile simulation | Lighthouse mobile preset on key pages | ✓ |

**User's choice:** Lighthouse mobile simulation

---

| Option | Description | Selected |
|--------|-------------|----------|
| Homepage | Hero, shop preview, about, CTA | ✓ |
| Gallery + Work detail | Grid layout and detail page | ✓ |
| Contact + Forms | Contact page, purchase inquiry, custom order | ✓ |
| Shop page | For-sale grid with ShopCards | ✓ |

**User's choice:** All pages selected

---

## Owner Training Format

| Option | Description | Selected |
|--------|-------------|----------|
| Written guide committed to repo | Markdown file at docs/cms-guide.md | ✓ |
| Live session you run | Real-time walkthrough, no doc artifact | |
| Both — written guide + live walkthrough | Guide + session | |

**User's choice:** Written guide committed to the repo

---

| Option | Description | Selected |
|--------|-------------|----------|
| Add a new ceramic piece | Upload image, fill fields, publish | ✓ |
| Mark a piece as sold | Change saleStatus, save + deploy | ✓ |
| Curate the homepage | Pick hero and shop preview pieces | ✓ |
| Edit site settings | Contact email and Instagram handle | ✓ |

**User's choice:** All four tasks

---

## Claude's Discretion

- Default `generateMetadata` title format
- Shared `baseMetadata` object for common fields
- Placement and naming of the fallback og:image in /public
- How `plaiceholder` is invoked (component-level vs shared utility)
- Exact Lighthouse score thresholds (floor: Performance ≥ 80, Accessibility ≥ 90)
- CMS guide formatting style (numbered steps vs checklist)

## Deferred Ideas

None — discussion stayed within phase scope.
