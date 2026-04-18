# Phase 2: Content Model & CMS UX - Context

**Gathered:** 2026-04-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Define the full Keystatic schema for: the `works` collection (ceramic pieces), a managed `categories` collection, and the `homepage` singleton. Bilingual fields throughout. Clear, non-technical labels and helper text for a non-developer owner.

This phase delivers no public-facing pages — it delivers the CMS data layer that Phases 3 and 4 read from. The Keystatic Admin UI at `/keystatic` is the only interface being built.

</domain>

<decisions>
## Implementation Decisions

### Images per piece
- **D-01:** Each ceramic piece supports multiple images (1–8). Owner uploads several angles — front, side, detail, in-use. Keystatic `array` of `image` fields.
- **D-02:** First image in the array is always the grid thumbnail / hero image. No explicit "primary image" picker — owner controls order by placing their best shot first.
- **D-03:** Each image requires an alt text field. Alt text is mandatory (a11y + SEO). The field label should suggest the piece title as a starting point so the owner understands what to write.

### Category taxonomy
- **D-04:** Categories are a managed Keystatic `collection` — the owner maintains the list themselves via the CMS, not a hardcoded dropdown.
- **D-05:** A ceramic piece can belong to multiple categories (Keystatic `array` of relationship or slug references to the categories collection).
- **D-06:** Category entries are bilingual — each category has a Danish name (`nameDa`) and an English name (`nameEn`). Public-facing filter labels use the locale-appropriate name.

### For-sale status model
- **D-07:** Works use a three-state `saleStatus` field: `available` | `sold` | `not-listed`. 
  - `available` — shown in the shop with price and "Contact to buy" CTA
  - `sold` — was for sale, now gone; remains visible in gallery with a "Sold" label and custom-order CTA
  - `not-listed` — in the gallery as a portfolio piece, never had a price shown
- **D-08:** Price is a free-form text field (e.g., "1.200 kr.", "From 800 kr.", "Price on request"). Owner writes any string. Only shown when `saleStatus` is `available`. Lead time is also a free-form text field.

### Draft / publish
- Simple boolean `published` field per piece. Drafts (`published: false`) are not visible on the public site. Already specified in requirements (CMS-02). Planner has discretion on implementation detail.

### Homepage curation
- **Claude's Discretion:** The owner must be able to pick which pieces appear in the homepage hero and shop preview (CMS-03). Planner decides the UX pattern — either relationship fields in the `homepage` singleton or featured flags on each work. Requirements are the binding constraint; approach is open.

### About singleton
- **Claude's Discretion:** CLAUDE.md lists an `about` singleton (artist statement, studio photo, contact info, all localized). Whether this is included in Phase 2 or deferred to Phase 4 is for the planner to decide based on dependency analysis. It is not blocked here.

### Bilingual approach (carried forward from CLAUDE.md / Phase 1)
- Sibling-field pattern: `titleDa` + `titleEn`, `descriptionDa` + `descriptionEn` on the same Keystatic document. One form, both languages side-by-side. The RSC selects the correct field based on the current locale.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### CMS Schema & Stack
- `keystatic.config.ts` — Existing config with `settings` singleton and storage pattern. Phase 2 extends this file — do not replace the storage logic or `settings` singleton.
- `CLAUDE.md` §"Keystatic + Next.js App Router" — Integration notes, storage mode, Keystatic Cloud auth, runtime='nodejs' requirement, schema patterns for ceramics portfolio. Read the "Schema patterns" section specifically for the full list of singletons and collections scoped to the project.

### Design System
- `.planning/phases/01-foundation/01-UI-SPEC.md` — Authoritative design tokens. CMS fields don't render the design system directly, but any helper text or label copy should be consistent with the voice described there.

### Requirements (phase-scoped)
- `.planning/REQUIREMENTS.md` §CMS-01 — Field list for a ceramic piece: images, title (DA+EN), description (DA+EN), category, for-sale status, price, lead-time note
- `.planning/REQUIREMENTS.md` §CMS-02 — Draft/published toggle; drafts not visible publicly
- `.planning/REQUIREMENTS.md` §CMS-03 — Owner can curate homepage hero and shop preview
- `.planning/REQUIREMENTS.md` §CMS-04 — All fields must have plain-language labels and helper text
- `.planning/REQUIREMENTS.md` §I18N-02 — All page content (UI labels, CMS content) available in both Danish and English

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `keystatic.config.ts` — Already exports `config()` with `settings` singleton and env-driven storage switching. Phase 2 adds collections and singletons to this same file.
- `src/app/keystatic/` — Admin UI route already live at `/keystatic`. No changes needed to route files.
- `src/app/api/keystatic/` — API route for Keystatic already set up.

### Established Patterns
- Storage switching via `KEYSTATIC_STORAGE_KIND` env var — local dev uses `local`, production uses `github`. Phase 2 inherits this without changes.
- Content stored in `content/` directory as YAML files committed to git.
- Sibling bilingual fields (established in CLAUDE.md, carried forward from Phase 1 planning).

### Integration Points
- `keystatic.config.ts` is the single config file — Phase 2 extends its `collections` and `singletons` keys.
- Phase 3 (Gallery) reads the `works` collection via the Keystatic Reader API in RSCs.
- Phase 4 (Homepage) reads the `homepage` singleton via the same Reader API.

</code_context>

<specifics>
## Specific Ideas

- Categories managed collection allows the owner to freely add new types as her work evolves (e.g., seasonal series, collaboration pieces) — not locked to initial values.
- The three-state `saleStatus` is designed to be self-explanatory in the Keystatic UI: "Available for purchase", "Sold", "Not for sale" as labels. Planner should use those exact label strings (or Danish equivalents).
- Free-form price allows the owner to write "Price on request" for bespoke commissions without awkward empty price fields.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 02-content-model-cms-ux*
*Context gathered: 2026-04-18*
