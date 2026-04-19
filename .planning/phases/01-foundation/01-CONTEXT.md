# Phase 1: Foundation - Context

**Gathered:** 2026-04-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Establish the technical substrate that all later phases build on: Next.js App Router project scaffold, Tailwind v4 design tokens (from UI-SPEC), next-intl bilingual routing with device-based locale detection, a Keystatic admin skeleton with a test content entry, and a fully proven Keystatic → GitHub → Vercel auto-deploy loop.

This phase delivers no public-facing product features — it delivers locked conventions, a working locale-aware placeholder shell, and a deploy pipeline the owner can use from a browser.

</domain>

<decisions>
## Implementation Decisions

### Locale Detection
- **D-01:** Default locale follows the visitor's device language settings — `Accept-Language` header detection via next-intl middleware (`localeDetection: true`). The root `/` redirects automatically to either `/da` or `/en`. No hardcoded default locale.
- **D-02:** Supported locales: `da` and `en`. Danish is the primary market but neither is "default" — detection decides.

### Design Tokens
- **D-03:** All typography, color, and spacing tokens are locked in `01-UI-SPEC.md`. Downstream agents MUST read that file — it is the authoritative source. Do not derive tokens from CLAUDE.md recommendations; the UI-SPEC overrides them where they differ.
- **D-04:** The Tailwind v4 `@theme` block from the UI-SPEC must be implemented verbatim in the root CSS file. No additions or substitutions in Phase 1.

### Keystatic Deploy Loop
- **D-05:** Phase 1 must deliver a fully working Keystatic → GitHub → Vercel deploy loop, not just local dev storage. This means:
  1. Local dev configured with `storage: { kind: 'local' }`
  2. Production (and the branch/PR preview on Vercel) configured with `storage: { kind: 'github' }` via Keystatic Cloud auth
  3. The owner must be able to edit a test content entry from a browser (no local install needed) and see the change auto-deployed on Vercel within one cycle.
- **D-06:** Keystatic Cloud is the auth layer for the GitHub storage path. Verify current free tier limits at https://keystatic.com before finalising — confidence is LOW on 2026 pricing.

### Keystatic Content Schema (Phase 1 scope)
- **D-07:** Phase 1 defines one minimal singleton — `settings` — with a test text field (e.g., site title) to validate the deploy loop end-to-end. Full content schemas (works collection, homepage singleton) belong to Phase 2. Planner has discretion on the exact field structure as long as it exercises the full read/write/deploy path.

### Layout Shell
- **D-08:** Phase 1 ships the layout shell as specified in UI-SPEC (sticky 64px header in oat, ink-surface footer, 1280px max-content-width, responsive horizontal padding). Placeholder screen focal point is the "Coming soon / Kommer snart" heading centered in the main area, per UI-SPEC §Layout Shell.

### Claude's Discretion
- Exact Keystatic Cloud account setup steps and environment variable names — follow Keystatic official docs
- next-intl middleware `pathnames` vs bare `locales` config — choose the simpler path for a 2-locale site with no custom path mapping
- Test content entry field name and structure — only needs to exercise the full deploy loop
- Git branch strategy for Keystatic GitHub storage — use `main` as the content branch unless Keystatic docs recommend otherwise
- TypeScript strict config and Biome/Biome setup — follow CLAUDE.md recommendations

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design System (authoritative)
- `.planning/phases/01-foundation/01-UI-SPEC.md` — Complete design contract: fonts (Fraunces + DM Sans), color palette, spacing scale, layout shell dimensions, language toggle interaction, placeholder copy in DA + EN, Tailwind `@theme` block. This file overrides any conflicting token recommendations elsewhere.

### Project Constraints and Stack Rationale
- `CLAUDE.md` — Tech stack decisions, Keystatic + Next.js App Router integration notes (local vs GitHub storage, Keystatic Cloud auth, runtime = 'nodejs' requirement, do-not-put-behind-auth rule), next-intl i18n approach, image strategy, what NOT to use. **Read the "Key Integration Notes" and "i18n Approach" sections specifically.**

### Requirements (phase-scoped)
- `.planning/REQUIREMENTS.md` §I18N-01 — Language toggle in header (acceptance criterion)
- `.planning/REQUIREMENTS.md` §I18N-03 — Locale-aware URL paths `/da/...` and `/en/...`
- `.planning/REQUIREMENTS.md` §DSGN-01 — Japandi/minimalist design (muted earth tones, whitespace, serif+sans)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — greenfield project. No existing components, hooks, or utilities.

### Established Patterns
- None yet — this phase establishes the patterns that all future phases will follow.

### Integration Points
- Phase 1 creates the App Router layout tree that every subsequent phase mounts into (`app/[locale]/layout.tsx`, `app/[locale]/page.tsx`)
- Phase 1 creates the Tailwind `@theme` block and root CSS file that all later component styles import
- Phase 1 wires next-intl middleware and providers that all later i18n usage relies on
- Phase 1 creates the Keystatic config (`keystatic.config.ts`) that Phase 2 extends with full content schemas

</code_context>

<specifics>
## Specific Ideas

- Language toggle visual: `DA | EN` side-by-side text control in the header, hairline divider between them. Active locale in terracotta at 500 weight; inactive in stone at 400 weight with underline on hover. Exactly as specified in UI-SPEC §Interaction Contracts.
- Skip link: first focusable element, visually hidden until focused, links to `#main-content`. Required for a11y.
- Focus ring: 2px solid terracotta, 2px offset, `:focus-visible` only (no suppression).
- Placeholder heading copy already specified in UI-SPEC §Copywriting Contract — use exactly those strings, no additional copy needed in Phase 1.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-04-18*
