---
plan: 04-02
phase: 04-homepage-shop-contact
status: complete
completed: 2026-04-19
self_check: PASSED
---

## What Was Built

Added all Phase 4 i18n message keys to both `messages/en.json` and `messages/da.json` (navigation.shop/contact, home.*, shop.heading/empty/card, contact.*). Created the `NavLinks` client component with active-link detection using `usePathname` from `@/i18n/navigation`.

## Key Files

### Created
- `src/components/NavLinks.tsx` — `"use client"` component exporting `NavLinks`, renders Works/Shop/Contact links with active-state styling

### Modified
- `messages/en.json` — added navigation.shop, navigation.contact, home.*, shop.heading/empty/card, contact.* namespaces
- `messages/da.json` — Danish equivalents of all Phase 4 keys

## Commits

- `5d2b9be` feat(04-02): add Phase 4 i18n keys to en.json and da.json
- `b8dba58` feat(04-02): create NavLinks client component with active-link detection

## Verification

- All Phase 4 i18n key assertions from Plan 01 Task 2 are now GREEN ✓
- NavLinks exports named `NavLinks` function component ✓
- `"use client"` directive present ✓
- Imports `Link`, `usePathname` from `@/i18n/navigation` ✓

## Deviations

None.
