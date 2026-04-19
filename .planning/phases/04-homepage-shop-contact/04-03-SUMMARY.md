---
phase: 04-homepage-shop-contact
plan: "03"
subsystem: components
tags:
  - shop
  - card
  - ui-component
  - hover
  - mobile

dependency_graph:
  requires:
    - 04-01 (design system tokens: clay, oat, ink, terracotta, linen, stone)
    - src/components/StatusBadge.tsx
    - src/i18n/navigation.ts (locale-aware Link)
  provides:
    - ShopCard (component)
    - ShopCardEntry (TypeScript interface)
  affects:
    - 04-04 (homepage shop preview consumes ShopCard)
    - 04-05 (shop page consumes ShopCard)

tech_stack:
  added: []
  patterns:
    - "group/group-hover pattern for hover-reveal CTA on desktop"
    - "sm:hidden / hidden sm:flex breakpoint split for mobile-always-visible vs desktop-hover CTA"
    - "bg-gradient-to-t from-ink/70 to-transparent for overlay scrim"
    - "next/image fill + object-cover + aspect-[4/5] for ceramic card images"

key_files:
  created:
    - src/components/ShopCard.tsx
  modified: []

decisions:
  - "ShopCard is a standalone component (not a WorkCard variant) — overlay/CTA logic would couple concerns if mixed into WorkCard via props"
  - "Outer wrapper is a div (not Link) because the primary action is the CTA button, not the whole card"
  - "href is a compile-time constant /contact — locale prefix injected by @/i18n/navigation Link (no open redirect risk)"

metrics:
  duration: "~1 minute"
  completed: "2026-04-19"
  tasks_completed: 1
  files_created: 1
  files_modified: 0
---

# Phase 04 Plan 03: ShopCard Component Summary

**One-liner:** New ShopCard component with ink/70 gradient scrim overlay showing price/lead time, desktop hover-reveal CTA, and mobile always-visible CTA — built for the shop page and homepage preview.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create ShopCard component | 738acef | src/components/ShopCard.tsx (created) |

## What Was Built

`src/components/ShopCard.tsx` — fully typed standalone component distinct from WorkCard:

- **Image area:** `aspect-[4/5]`, `next/image` with `fill` + `object-cover`, group-hover scale animation inherited from WorkCard
- **Overlay scrim:** `bg-gradient-to-t from-ink/70 to-transparent h-[40%]`, always visible, contains price text (`text-linen`) and lead time text (`text-linen/80`)
- **Desktop CTA:** absolutely positioned over image, `hidden sm:flex`, `opacity-0 group-hover:opacity-100 transition-opacity duration-200` — invisible at rest, fades in on hover
- **Mobile CTA:** sibling block below image, `sm:hidden w-full` — always visible on narrow screens
- **CTA link:** `/contact` via `Link` from `@/i18n/navigation` (locale prefix automatic)
- **StatusBadge:** retained for visual consistency
- **Card title:** below mobile CTA, `px-3 py-2 font-sans text-ink text-sm font-medium`

## Verification Results

All checks pass:
- `pnpm build` exits 0 with no TypeScript errors
- No `dangerouslySetInnerHTML` in file
- No `import from "next/link"` — uses `@/i18n/navigation`
- `group-hover:opacity-100` present (desktop hover CTA)
- `sm:hidden` present (mobile always-visible CTA)
- `bg-gradient-to-t from-ink/70 to-transparent` present (overlay scrim)
- All visual contracts from 04-UI-SPEC.md ShopCard section implemented

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — ShopCard is a pure UI component with no hardcoded data. Consumers (04-04 homepage preview, 04-05 shop page) will wire it to real Keystatic content.

## Threat Surface Scan

No new network endpoints, auth paths, or schema changes introduced. All CMS strings (price, leadTime, title, alt) rendered as JSX text nodes — React escapes HTML entities automatically. CTA href is a compile-time constant. Threat model T-04-03-01, T-04-03-02, T-04-03-03 all mitigated as specified in plan.

## Self-Check: PASSED

- [x] `src/components/ShopCard.tsx` exists
- [x] Commit `738acef` exists in git log
- [x] `pnpm build` exits 0
