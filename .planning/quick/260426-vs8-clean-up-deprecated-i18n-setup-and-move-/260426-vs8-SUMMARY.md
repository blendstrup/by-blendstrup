---
phase: quick
plan: 260426-vs8
subsystem: cms-content
tags: [keystatic, content-migration, i18n-cleanup, server-components]
dependency_graph:
  requires: []
  provides: [keystatic-gallery-singleton, keystatic-contact-singleton, keystatic-homepage-text-fields]
  affects: [homepage, gallery, contact, custom-orders, purchase-inquiry]
tech_stack:
  added: []
  patterns: [keystatic-reader-in-rsc, inline-ui-strings-in-client-components]
key_files:
  created:
    - content/gallery.yaml
    - content/contact.yaml
  modified:
    - keystatic.config.ts
    - content/homepage.yaml
    - src/app/(site)/page.tsx
    - src/app/(site)/layout.tsx
    - src/app/(site)/gallery/page.tsx
    - src/app/(site)/gallery/[slug]/page.tsx
    - src/app/(site)/contact/page.tsx
    - src/app/(site)/custom-orders/page.tsx
    - src/app/(site)/contact/purchase/page.tsx
    - src/components/SiteHeader.tsx
    - src/components/NavLinks.tsx
    - src/components/GalleryFilterToggle.tsx
    - src/components/CustomOrderForm.tsx
    - src/components/PurchaseInquiryForm.tsx
  deleted:
    - messages/da.json
decisions:
  - "Owner-editable copy (page headings, CTAs, section copy) lives in Keystatic singletons — gallery and contact singletons added"
  - "Dev-owned UI strings (form labels, validation, nav labels, filter toggles) are inlined directly in components — no translation layer needed for a Danish-only site"
  - "ShopCard and GalleryGrid status badge labels (Solgt, Til salg) inlined — never owner-edited"
metrics:
  duration: ~15 minutes
  completed: "2026-04-26"
  tasks_completed: 3
  files_changed: 15
---

# Quick Task 260426-vs8: Clean Up Deprecated i18n Setup Summary

**One-liner:** Migrated all owner-editable page copy from messages/da.json into Keystatic gallery and contact singletons, and inlined developer-owned UI strings directly in client components — da.json deleted.

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Extend Keystatic singletons with owner-editable text fields | e44ce2b | keystatic.config.ts, content/homepage.yaml, content/gallery.yaml, content/contact.yaml |
| 2 | Update server components to read content from Keystatic, remove da.json imports | 36853b6 | 8 files in src/app/(site)/ and src/components/ |
| 3 | Inline client component strings and delete da.json | 26f1ba9 | 4 client components, messages/da.json deleted |

## What Was Done

### Task 1: Keystatic schema extension
- Added 11 text fields to the homepage singleton: `heroHeadline`, `heroCta`, `heroScrollIndicator`, `shopPreviewHeading`, `shopPreviewViewAll`, `shopPreviewEmpty`, `aboutHeading`, `customOrdersHeading`, `customOrdersBody`, `customOrdersCta`, `galleryHeading`
- Created new `gallery` singleton with empty-state copy, sold message, CTA text, and contactToBuy label (9 fields)
- Created new `contact` singleton with all contact page headings, body copy, CTAs, and form headings (11 fields)
- Added `gallery` and `contact` to the Keystatic admin Pages nav group
- Seeded content/homepage.yaml with new field values (preserving existing heroWorks/shopPreviewWorks/mediaGallery arrays)
- Created content/gallery.yaml and content/contact.yaml with default Danish values

### Task 2: Server component migration
- `src/app/(site)/page.tsx`: all `da.home.*` replaced with `homepageData?.fieldName ?? "fallback"`; ShopCard status badge labels inlined
- `src/app/(site)/layout.tsx`: skip-to-content string inlined
- `src/app/(site)/gallery/page.tsx`: gallery singleton read via Promise.all; empty state and title from `galleryContent`; GalleryGrid labels inlined
- `src/app/(site)/gallery/[slug]/page.tsx`: gallery singleton read via Promise.all alongside work; ctaLabels from `galleryContent`
- `src/app/(site)/contact/page.tsx`: contact singleton read in Promise.all; all page copy from `contactContent`
- `src/app/(site)/custom-orders/page.tsx`: converted to async; reads contact singleton for form heading and subCopy
- `src/app/(site)/contact/purchase/page.tsx`: reads contact singleton for purchase form heading
- `src/components/SiteHeader.tsx`: site name inlined as literal string

### Task 3: Client component inlining
- `NavLinks.tsx`: nav labels hardcoded (`"Keramik"`, `"Kontakt"`)
- `GalleryFilterToggle.tsx`: filter button labels and sr-only legend inlined
- `CustomOrderForm.tsx`: all form labels, placeholders, validation fallbacks, success/pending strings inlined
- `PurchaseInquiryForm.tsx`: all form labels, placeholders, validation fallbacks, success/pending strings inlined
- `messages/da.json` deleted; `messages/` directory removed

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None. All content fields are wired to real Keystatic singletons backed by seed YAML files. No placeholder text flows to rendered UI.

## Threat Flags

None. The new content/*.yaml files follow the same trust model as existing content/works/ entries — git-tracked, owner-editable only via authenticated Keystatic admin. No new network endpoints or auth paths introduced.

## Self-Check: PASSED

| Check | Result |
|-------|--------|
| content/gallery.yaml exists | FOUND |
| content/contact.yaml exists | FOUND |
| content/homepage.yaml exists | FOUND |
| messages/da.json deleted | CONFIRMED |
| Commit e44ce2b exists | FOUND |
| Commit 36853b6 exists | FOUND |
| Commit 26f1ba9 exists | FOUND |
| TypeScript errors | 0 |
| grep "messages/da" src/ | 0 matches |
