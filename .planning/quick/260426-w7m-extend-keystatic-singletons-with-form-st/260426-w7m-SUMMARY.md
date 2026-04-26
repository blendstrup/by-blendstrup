---
phase: quick-260426-w7m
plan: "01"
subsystem: cms-content
tags: [keystatic, forms, content-management, danish-strings]
dependency_graph:
  requires: [260426-vs8]
  provides: [cms-editable-form-strings, cms-editable-badge-labels]
  affects: [contact-singleton, gallery-singleton, PurchaseInquiryForm, CustomOrderForm]
tech_stack:
  added: []
  patterns: [cms-string-prop-threading, defaultStrings-fallback]
key_files:
  created: []
  modified:
    - keystatic.config.ts
    - content/contact.yaml
    - content/gallery.yaml
    - src/components/PurchaseInquiryForm.tsx
    - src/components/CustomOrderForm.tsx
    - src/app/(site)/contact/purchase/page.tsx
    - src/app/(site)/custom-orders/page.tsx
    - src/app/(site)/gallery/page.tsx
decisions:
  - "defaultStrings fallback constants in each form component ensure safe rendering when CMS content is absent"
  - "(valgfri) optional indicators kept as hardcoded UI pattern strings per plan spec — not content"
metrics:
  duration: ~8 minutes
  completed: "2026-04-26T21:19:38Z"
  tasks_completed: 2
  files_modified: 8
---

# Phase quick-260426-w7m Plan 01: Extend Keystatic Singletons with Form Strings Summary

**One-liner:** Extended contact and gallery Keystatic singletons with 23 new CMS-editable form string fields, seeded YAML content, and wired strings through server components as typed props into both client form components.

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Extend Keystatic schemas and seed YAML content | b045868 | keystatic.config.ts, content/contact.yaml, content/gallery.yaml |
| 2 | Wire Keystatic strings through server pages into form components | da12a9c | PurchaseInquiryForm.tsx, CustomOrderForm.tsx, purchase/page.tsx, custom-orders/page.tsx, gallery/page.tsx |

## What Was Built

### Task 1: Schema Extension and YAML Seeding

Added 23 new fields to `keystatic.config.ts`:

- **contact singleton** — 9 purchase inquiry form string fields (`purchaseFormRegarding`, `purchaseFormNameLabel`, `purchaseFormEmailLabel`, `purchaseFormMessageLabel`, `purchaseFormMessagePlaceholder`, `purchaseFormSubmit`, `purchaseFormPending`, `purchaseFormSuccessHeading`, `purchaseFormSuccessBody`) and 14 custom order form string fields (`customOrderFormNameLabel` through `customOrderFormSuccessBody`)
- **gallery singleton** — 2 badge label fields (`soldBadge`, `forSaleBadge`)

Seeded `content/contact.yaml` with all 23 new fields using their Danish default values. Seeded `content/gallery.yaml` with `soldBadge: Solgt` and `forSaleBadge: Til salg`.

### Task 2: String Prop Threading

**PurchaseInquiryForm.tsx** — Added `PurchaseInquiryStrings` interface and `strings?: PurchaseInquiryStrings` prop. Added `defaultStrings` constant as safe fallback. Replaced all hardcoded Danish strings in JSX with `s.*` references (9 strings total).

**CustomOrderForm.tsx** — Added `CustomOrderStrings` interface with 14 string fields and `strings?: CustomOrderStrings` prop. Added `defaultStrings` constant. Replaced all hardcoded Danish strings in JSX with `s.*` references. Kept `(valgfri)` optional indicators as hardcoded UI pattern strings per plan spec.

**purchase/page.tsx** — Builds `purchaseFormStrings` object from `contactContent` with `??` fallbacks, passes to both `<PurchaseInquiryForm>` instances (two-column and full-width layouts).

**custom-orders/page.tsx** — Builds `customOrderStrings` object from `contactContent` with `??` fallbacks, passes to `<CustomOrderForm>`.

**gallery/page.tsx** — Replaced hardcoded `"Solgt"` / `"Til salg"` badge label strings with `galleryContent?.soldBadge ?? "Solgt"` / `galleryContent?.forSaleBadge ?? "Til salg"`.

## Decisions Made

1. **defaultStrings fallback constants** — Each form component retains a `defaultStrings` constant so the component renders correctly even if the server page fails to read CMS content (e.g., during local dev before YAML is seeded). This is a defence-in-depth pattern, not a stub.
2. **(valgfri) optional indicators kept hardcoded** — Per plan spec, `(valgfri)` strings on Budget and Timeline fields are UI pattern indicators, not editable content. Left as-is.

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None. All form strings are now wired from Keystatic CMS. The `defaultStrings` constants are safe fallbacks, not stubs — they mirror the CMS default values.

## Threat Flags

None. No new network endpoints, auth paths, file access patterns, or schema changes at trust boundaries introduced. CMS strings are developer-committed YAML (trusted content).

## Self-Check: PASSED

- keystatic.config.ts — FOUND (contains purchaseFormRegarding, customOrderFormNameLabel, soldBadge, forSaleBadge)
- content/contact.yaml — FOUND (contains all 23 new seeded fields)
- content/gallery.yaml — FOUND (contains soldBadge and forSaleBadge)
- src/components/PurchaseInquiryForm.tsx — FOUND (all JSX uses s.* references)
- src/components/CustomOrderForm.tsx — FOUND (all JSX uses s.* references)
- Commits b045868 and da12a9c — FOUND in git log
- npx tsc --noEmit — zero errors
