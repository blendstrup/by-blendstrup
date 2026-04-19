# Phase 3: Gallery & Works - Context

**Gathered:** 2026-04-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Ship the browsable works collection: a responsive image grid, per-piece detail pages, a URL-based for-sale filter, and graceful handling of sold pieces with a custom-order bridge.

This phase does NOT include: the shop page (Phase 4), the custom order form itself (Phase 5), homepage hero (Phase 4), or SEO/hreflang (Phase 6).

**Critical prerequisite:** The Keystatic `works` collection, `categories` collection, and `homepage` singleton schemas were removed from `keystatic.config.ts` in a post-Phase-2 refactor (commit `6dd2c38`). Phase 3 must re-add these schemas before building any gallery UI. The schema shape is fully documented in the Phase 2 verification report — see canonical refs below.

</domain>

<decisions>
## Implementation Decisions

### Grid Layout

- **D-01:** Responsive column count — 3 columns at ≥1024px (desktop), 2 columns at 640–1023px (tablet), 1 column below 640px (mobile). Use CSS grid with Tailwind responsive prefixes.
- **D-02:** Cards are image-only at rest — no text rendered below the image in the default state. The ceramics photography is the content; text belongs on the detail page.
- **D-03:** Status badges are small pill labels anchored to a corner of the image (top-left or top-right — Claude's discretion on which corner reads better). "Sold" uses the stone color; "For sale" uses terracotta. Portfolio-only pieces (not sold, not listed for sale) show no badge. Badge only appears when status is relevant.

### Filter UX

- **D-04:** URL-based filter — the active filter state lives in a `?filter=for-sale` query parameter. Two tab-style toggle buttons sit left-aligned above the grid: "All" (no param) and "For Sale" (`?filter=for-sale`). The URL is the source of truth, making the filtered view bookmarkable and shareable.
- **D-05:** Filter controls are left-aligned above the grid, consistent with the left-aligned content pattern in the existing layout shell.

### Detail Page Layout

- **D-06:** Desktop: side-by-side — the first image occupies the left column; title, description, and CTA occupy the right column. Additional images (if the piece has more than one) stack full-width below the side-by-side section. Mobile: images then title/description/CTA, stacked vertically.
- **D-07:** The right-column text block contains: piece title (serif, large), description, and — for for-sale pieces — a "Contact to buy" CTA. For sold pieces, the CTA is replaced by the sold treatment (see D-09). For portfolio-only pieces, no CTA is shown.

### Sold Piece Treatment

- **D-08:** On the grid card, sold pieces show a "Sold" badge (stone pill, corner of image — same system as D-03). The image itself is not desaturated or overlaid.
- **D-09:** On the detail page for a sold piece, below the description: a sentence "This piece has been sold." followed by a CTA button labelled "Commission something similar →". This CTA links to `/[locale]/custom-orders` (the custom order form — Phase 5 will build the target page; Phase 3 just needs to emit the correct href).
- **D-10:** Both the sold sentence and CTA copy must be bilingual — added to `messages/en.json` and `messages/da.json` as new i18n keys.

### Claude's Discretion

- URL path for gallery (`/gallery` vs `/works`) and detail pages (`/gallery/[slug]` vs `/works/[slug]`) — pick the most semantically correct option and be consistent
- Image aspect ratio enforcement on the grid (square vs 4:5 portrait vs natural) — choose what looks best with the existing design tokens
- Hover state on grid cards (subtle scale, opacity, or none) — keep consistent with Japandi restraint
- Max-width of the detail page content column
- Empty state copy when the gallery has no published works
- Empty state when the for-sale filter returns zero results (e.g. all pieces are sold or portfolio-only)
- Exact Keystatic schema field order and any minor field additions needed for Phase 3 RSC consumption

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design System (authoritative)
- `.planning/phases/01-foundation/01-UI-SPEC.md` — Complete design contract: fonts (Fraunces + DM Sans), full color palette (linen, oat, clay, stone, ink, terracotta, fault, ink-surface), spacing scale, Tailwind `@theme` block. All visual decisions must derive from this file.

### Keystatic Schema (re-add this in Phase 3)
- `.planning/phases/02-content-model-cms-ux/02-VERIFICATION.md` — Documents the full works/categories/homepage schema that was verified in Phase 2 and subsequently removed. Contains field names, types, labels, and helper text that the planner must re-implement verbatim. The test content entry at `content/works/bowl-test/index.yaml` shows the schema shape in practice.

### Stack Constraints and Integration Notes
- `CLAUDE.md` — next/image strategy (always use next/image, never `<img>`), i18n approach (next-intl, sibling-field pattern, message keys in `messages/*.json`), Keystatic Reader API usage in RSCs, what NOT to use.

### Phase Requirements (phase-scoped)
- `.planning/REQUIREMENTS.md` §GALL-01 — Uniform grid of all published pieces
- `.planning/REQUIREMENTS.md` §GALL-02 — Detail page with full imagery and localized description
- `.planning/REQUIREMENTS.md` §GALL-03 — Filter to show only for-sale pieces
- `.planning/REQUIREMENTS.md` §GALL-04 — Sold pieces visible with label and custom order CTA
- `.planning/REQUIREMENTS.md` §DSGN-04 — No e-commerce chrome (no cart icons, star ratings, stock counters, discount badges)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/app/[locale]/layout.tsx` — Locale layout shell (SiteHeader + main + SiteFooter) that all new pages mount into automatically. No changes needed.
- `src/app/globals.css` — Design tokens live here (`--color-*`, `--font-*`, `--spacing-*`). All Tailwind classes derive from this.
- `src/components/SiteHeader.tsx` — Existing sticky header. Navigation links for the gallery page will need to be added here or via a separate nav component.
- `src/components/LanguageToggle.tsx` — Client component for locale switching. Pattern to follow for any new client components.
- `content/works/bowl-test/index.yaml` — Test content entry from Phase 2 smoke test. Confirms the schema shape works end-to-end with the Reader API.

### Established Patterns
- RSC (React Server Component) for data fetching — use Keystatic Reader API (`createReader`) in server components; never in client components
- next-intl `useTranslations` / `getTranslations` for bilingual strings — UI copy keys go in `messages/en.json` and `messages/da.json`
- Tailwind v4 utility classes with design tokens from `@theme` — no inline styles, no arbitrary values where a token exists
- Biome for linting/formatting — run `pnpm biome check src/` (not `pnpm check .`) to avoid false positives from `.next/`

### Integration Points
- New routes: `src/app/[locale]/gallery/page.tsx` (gallery grid RSC) and `src/app/[locale]/gallery/[slug]/page.tsx` (detail page RSC)
- Filter toggle: a small client component that reads `searchParams` and calls `useRouter` / `useSearchParams` from `next/navigation` to update the `?filter=for-sale` param
- Sold CTA target: `/[locale]/custom-orders` — this route does not exist yet (Phase 5); Phase 3 emits the href, Phase 5 builds the destination
- `generateStaticParams` on the detail page to pre-render all published works at build time
- `keystatic.config.ts` must be updated to re-add `works`, `categories`, and `homepage` schemas before any RSC can call `reader.collections.works.all()`

</code_context>

<specifics>
## Specific Ideas

- Bilingual i18n keys needed for Phase 3: gallery page title, filter button labels ("All" / "For Sale"), sold badge label, sold detail copy ("This piece has been sold."), sold CTA ("Commission something similar"), "Contact to buy" CTA for for-sale pieces. All must have Danish equivalents.
- Corner badge color: "Sold" → stone (`#7a6a58`); "For sale" → terracotta (`#a85c3a`). Badge text should be small (Label size from UI-SPEC), uppercase or sentence case — Claude's discretion.
- The "Commission something similar" CTA on the detail page should be styled as a secondary/ghost button (not the primary filled style) to signal it's an alternative path, not the primary call to action.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 03-gallery-works*
*Context gathered: 2026-04-19*
