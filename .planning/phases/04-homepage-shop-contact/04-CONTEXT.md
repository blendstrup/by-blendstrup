# Phase 4: Homepage, Shop & Contact - Context

**Gathered:** 2026-04-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver the three public anchor pages:
1. **Homepage** — full-bleed hero (single CMS-selected ceramic), shop preview section, about section, custom order CTA
2. **Shop page** — for-sale pieces only, each showing price + lead time via an image-bottom overlay and a hover-reveal "Contact to buy" CTA
3. **Contact page** — email + Instagram handle (CMS-configured), links to future inquiry form routes

This phase does NOT include: the inquiry/custom order forms themselves (Phase 5), SEO/hreflang (Phase 6), or animations beyond the scroll indicator.

</domain>

<decisions>
## Implementation Decisions

### Homepage Hero

- **D-01:** Single full-bleed image hero. The Keystatic `heroWorks` array supports up to 3 entries — Phase 4 uses only the first selected piece. Future phases may extend this.
- **D-02:** Hero height: `100vh` on desktop. The ceramic fills the entire viewport on load — maximum visual impact.
- **D-03:** No text or brand overlay on the hero image. The only addition is a scroll indicator (arrow or text prompt) anchored to the bottom of the hero. Nothing else overlays the ceramic photography.

### About Section

- **D-04:** About content: bilingual text (DA + EN) + a photo of the maker or studio.
- **D-05:** About section lives in its own Keystatic `about` singleton — separate from the homepage singleton. Fields: `aboutTextDa`, `aboutTextEn`, `photo` (with alt text). Clean separation allows independent editing and future extension (v2 full About page).
- **D-06:** About section desktop layout: photo on the left (~40% width), text on the right (~60% width). Stacks vertically on mobile (photo above text).

### Shop Page Listing Style

- **D-07:** Price and lead time are shown as a translucent overlay strip at the bottom of each card image (dark scrim + text on top). The existing WorkCard component needs a new variant or a dedicated ShopCard component that supports this overlay.
- **D-08:** "Contact to buy" CTA appears on hover on desktop (fades in over the card). On mobile (no hover state), the CTA is always visible below the image. This keeps cards clean at rest on desktop while remaining accessible on touch devices.

### Contact Page

- **D-09:** Contact page shows email address and Instagram handle — both CMS-configurable.
- **D-10:** Contact info fields (`contactEmail`, `instagramHandle`) are added to the existing `settings` singleton in Keystatic. Owner edits them in the same place as the site title.
- **D-11:** Contact page includes links to the purchase inquiry form and custom order form routes (stubs — Phase 5 builds the target pages). This completes the navigation structure now so Phase 5 only needs to build the form, not re-wire links.

### Navigation

- **D-12:** SiteHeader gains two new nav links: "Shop" and "Contact". Order: Works → Shop → Contact (left to right, logical browse → buy → enquire flow). Claude's discretion on exact spacing and active-link treatment, consistent with existing "Works" link style.

### Custom Order CTA Section (Homepage)

- **D-13:** A dedicated CTA section on the homepage links to `/[locale]/custom-orders`. Claude's discretion on visual treatment — should be clearly distinct from the shop preview but not overwhelming. A centered or left-aligned section with a short bilingual headline and a button is sufficient.

### Claude's Discretion

- Scroll indicator design on the hero (arrow icon, "scroll" text, animated chevron — keep minimal)
- About section background color (linen vs oat — pick what creates the best rhythm with adjacent sections)
- Homepage sections order below the hero (shop preview, about, custom order CTA — Claude picks the order that feels most natural for a first-time visitor)
- Shop page empty state (no for-sale pieces right now)
- Exact Keystatic field labels and helper text for the new `about` singleton
- Whether ShopCard is a new component or an extended variant of WorkCard
- Image aspect ratio for the about photo (square vs portrait — match what looks best with the text column)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design System (authoritative)
- `.planning/phases/01-foundation/01-UI-SPEC.md` — Complete design contract: Fraunces + DM Sans fonts, full color palette (linen, oat, clay, stone, ink, terracotta, fault, ink-surface), spacing scale (including the 96px 4xl major section break token), Tailwind `@theme` block. All visual decisions must derive from this file.

### Keystatic Schema Reference
- `.planning/phases/02-content-model-cms-ux/02-VERIFICATION.md` — Documents the works/categories/homepage schema verified in Phase 2. Phase 4 extends this with a new `about` singleton and extends the `settings` singleton.

### Stack Constraints and Integration Notes
- `CLAUDE.md` — next/image strategy (always use next/image, never `<img>`), i18n approach (next-intl, sibling-field pattern, message keys in `messages/*.json`), Keystatic Reader API usage in RSCs, what NOT to use.

### Phase Requirements (phase-scoped)
- `.planning/REQUIREMENTS.md` §HOME-01 — Full-bleed hero with featured ceramics
- `.planning/REQUIREMENTS.md` §HOME-02 — Shop preview section on homepage
- `.planning/REQUIREMENTS.md` §HOME-03 — Custom order CTA on homepage
- `.planning/REQUIREMENTS.md` §HOME-04 — About section on homepage (no separate About page in v1)
- `.planning/REQUIREMENTS.md` §SHOP-01 — Dedicated for-sale listings page
- `.planning/REQUIREMENTS.md` §SHOP-02 — Price visible on each for-sale listing
- `.planning/REQUIREMENTS.md` §SHOP-03 — Lead time visible on each for-sale listing
- `.planning/REQUIREMENTS.md` §SHOP-04 — "Contact to buy" CTA on each for-sale listing
- `.planning/REQUIREMENTS.md` §CONT-01 — Contact page with general contact information
- `.planning/REQUIREMENTS.md` §DSGN-04 — No e-commerce chrome

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/WorkCard.tsx` — Image-first card with 4:5 aspect, StatusBadge, title below image. Phase 4 needs a ShopCard variant that adds the price/lead time overlay and hover-reveal CTA.
- `src/components/GalleryGrid.tsx` — 3/2/1 column responsive grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`). Reusable for the shop page and homepage shop preview section.
- `src/components/StatusBadge.tsx` — Pill badge (terracotta for available, stone for sold). Already handles the saleStatus values.
- `src/components/SiteHeader.tsx` — Sticky header. Needs Shop + Contact nav links added (same style as existing "Works" link).
- `src/components/SiteFooter.tsx` — ink-surface footer with "By Blendstrup" text. No changes expected.

### Keystatic Schema State
- `keystatic.config.ts` — `works`, `categories`, `homepage` (heroWorks + shopPreviewWorks), `settings` (siteTitle only) are defined. Phase 4 adds: `about` singleton (new), extends `settings` with `contactEmail` + `instagramHandle`.
- `content/homepage.yaml` — Has `heroWorks: [bowl-test]` and `shopPreviewWorks: []` from Phase 2/3.

### Established Patterns
- RSC for data fetching — Keystatic Reader API (`createReader`) in server components only
- next-intl `getTranslations` for bilingual strings — new i18n keys go in `messages/en.json` and `messages/da.json`
- Tailwind v4 utility classes with tokens from `globals.css` `@theme` block — no inline styles, no arbitrary values where a token exists
- Biome for linting/formatting

### Integration Points
- New routes: `src/app/[locale]/page.tsx` (replace placeholder with real homepage), `src/app/[locale]/shop/page.tsx`, `src/app/[locale]/contact/page.tsx`
- Homepage replaces the placeholder "Coming soon" page — `src/app/[locale]/page.tsx` is currently a simple component returning the placeholder
- Custom order CTA links to `/[locale]/custom-orders` (Phase 5 target — emit href now, page built in Phase 5)
- Contact page links to `/[locale]/contact` (purchase inquiry) and `/[locale]/custom-orders` (custom order) — both Phase 5 targets

</code_context>

<specifics>
## Specific Ideas

- Hero scroll indicator: minimal — a small downward arrow or animated chevron at the bottom center of the hero. CSS-only or a simple SVG, no JS animation library needed for this.
- Shop card overlay: dark semi-transparent scrim (e.g., `bg-ink/70`) across the bottom 30–40% of the image, with price in serif and lead time in smaller sans below it. The "Contact to buy" CTA button fades in over this scrim on hover.
- About photo: should be stored via a Keystatic `image` field (same pattern as works images) — `directory: "public/images/about"`, `publicPath: "/images/about/"`.
- New i18n keys needed for Phase 4: homepage section headings, shop page title, contact page title, custom order CTA headline + button label, about section heading. All with Danish equivalents.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 04-homepage-shop-contact*
*Context gathered: 2026-04-19*
