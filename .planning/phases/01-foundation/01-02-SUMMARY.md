---
phase: 01-foundation
plan: "02"
subsystem: i18n-shell
tags: [next-intl, i18n, layout, header, footer, language-toggle, a11y]
dependency_graph:
  requires: [01-01]
  provides: [next-intl-routing, locale-layout-shell, language-toggle, focus-ring-system]
  affects: [01-03]
tech_stack:
  added:
    - next-intl (latest)
  patterns:
    - next-intl defineRouting with localeDetection: true
    - [locale] App Router segment with locale validation via notFound()
    - Root layout as passthrough, locale layout owns html/body/lang
    - NextIntlClientProvider in locale layout, font variables on html element
    - "use client" LanguageToggle with useLocale + useRouter from next-intl navigation
    - Global focus ring via *:focus-visible in globals.css
key_files:
  created:
    - src/i18n/routing.ts
    - src/i18n/navigation.ts
    - src/i18n/request.ts
    - src/middleware.ts
    - messages/da.json
    - messages/en.json
    - src/app/[locale]/layout.tsx
    - src/app/[locale]/page.tsx
    - src/components/SiteHeader.tsx
    - src/components/SiteFooter.tsx
    - src/components/LanguageToggle.tsx
  modified:
    - next.config.ts
    - src/app/layout.tsx
    - src/app/globals.css
decisions:
  - Root layout made passthrough (no html/body) so locale layout can own lang={locale} and font variable injection
  - Font loading (Fraunces + DM Sans) moved from root layout to locale layout to keep html attributes co-located
  - Skip link uses inline locale check (da/en) rather than useTranslations to avoid adding a server translation call just for one string
metrics:
  duration_minutes: 8
  completed_date: "2026-04-18T10:10:00Z"
  tasks_completed: 2
  tasks_total: 2
  files_created: 11
  files_modified: 3
---

# Phase 1 Plan 02: i18n Routing & Layout Shell Summary

next-intl bilingual routing with Accept-Language detection, sticky 64px oat header, ink-surface footer, DA|EN language toggle (terracotta active state), skip link, and global terracotta focus ring wired across /da and /en placeholder routes.

## Tasks Completed

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | Install next-intl, configure routing and middleware, create message files | 11e710c | src/i18n/routing.ts, src/i18n/request.ts, src/middleware.ts, next.config.ts, messages/da.json, messages/en.json |
| 2 | Build locale layout, placeholder page, SiteHeader, SiteFooter, LanguageToggle | 3fb732d | src/app/[locale]/layout.tsx, src/app/[locale]/page.tsx, src/components/SiteHeader.tsx, src/components/SiteFooter.tsx, src/components/LanguageToggle.tsx, src/app/globals.css |

## Verification Results

- `npx tsc --noEmit` exits 0
- `pnpm run build` exits 0 — all 5 static pages generated
- `localeDetection: true` confirmed in src/i18n/routing.ts
- `min-h-[44px]` confirmed in LanguageToggle.tsx (WCAG 2.5.5 AA touch target)
- `sr-only` + `focus-visible:not-sr-only` confirmed on skip link
- `:focus-visible` focus ring rule confirmed in globals.css
- `notFound()` locale guard confirmed in locale layout (T-02-01 mitigation)
- `lang={locale}` confirmed on html element
- "Kommer snart" in messages/da.json, "Coming soon" in messages/en.json

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Font variables moved to locale layout**
- **Found during:** Task 2
- **Issue:** Plan called for root layout to become a passthrough (return children only), but font variables (Fraunces + DM Sans CSS variable injection) were declared in root layout. Moving them out would break font loading.
- **Fix:** Moved font declarations from root layout to locale layout so `html` element receives both `lang={locale}` and the font variable classNames together. Root layout becomes a true passthrough (`return children`).
- **Files modified:** src/app/[locale]/layout.tsx, src/app/layout.tsx
- **Commit:** 3fb732d

## Known Stubs

- `src/app/[locale]/page.tsx` returns placeholder "Coming soon / Kommer snart" — intentional, replaced in Phase 4 with homepage content
- `src/app/page.tsx` (root) — not present; root `/` handled by middleware redirect to `/da` or `/en`

## Threat Flags

None — no new network endpoints, auth paths, or file access patterns beyond what the plan's threat model covers. T-02-01 locale validation (`notFound()`) implemented as specified.

## Self-Check: PASSED

- src/i18n/routing.ts: EXISTS
- src/middleware.ts: EXISTS
- messages/da.json: EXISTS
- messages/en.json: EXISTS
- src/app/[locale]/layout.tsx: EXISTS
- src/app/[locale]/page.tsx: EXISTS
- src/components/SiteHeader.tsx: EXISTS
- src/components/SiteFooter.tsx: EXISTS
- src/components/LanguageToggle.tsx: EXISTS
- Commit 11e710c: EXISTS
- Commit 3fb732d: EXISTS
