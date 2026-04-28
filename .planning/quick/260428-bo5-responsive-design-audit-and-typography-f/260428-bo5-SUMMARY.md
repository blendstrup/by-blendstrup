---
phase: quick-260428-bo5
plan: 01
subsystem: typography / layout
tags: [responsive, typography, mobile, padding, tailwind]
dependency_graph:
  requires: []
  provides: [responsive-mobile-typography, consistent-padding-system]
  affects: [SiteHeader, SiteFooter, WorkDetail, all page routes]
tech_stack:
  added: []
  patterns: [mobile-first responsive typography scale, px-6 sm:px-8 lg:px-16 padding system]
key_files:
  created: []
  modified:
    - src/components/SiteHeader.tsx
    - src/components/SiteFooter.tsx
    - src/components/WorkDetail.tsx
    - src/app/(site)/page.tsx
    - src/app/(site)/gallery/page.tsx
    - src/app/(site)/custom-orders/page.tsx
    - src/app/(site)/contact/page.tsx
    - src/app/(site)/contact/purchase/page.tsx
decisions:
  - "Mobile-first h1 scale: text-3xl (30px) → text-4xl (36px) → text-5xl (48px) at sm/lg breakpoints"
  - "Header title reduced to text-lg (18px) mobile, sm:text-[22px] — fits logo+text in 320px at px-4"
  - "Til salg h2 changed from text-5xl to text-[28px] to match Om Laura h2 — parity without complexity"
  - "Uniform padding system: px-6 sm:px-8 lg:px-16 across all page containers, header, footer, WorkDetail"
metrics:
  duration: "~12 minutes"
  completed: "2026-04-28"
  tasks_completed: 3
  files_modified: 8
---

# Quick Task 260428-bo5: Responsive Design Audit and Typography Fix — Summary

**One-liner:** Introduced mobile-first `text-3xl → text-4xl → text-5xl` h1 scale and `px-6 sm:px-8 lg:px-16` padding system across all pages, header, footer, and WorkDetail to eliminate heading overflow and visual imbalance on 320–375px viewports.

## What Was Changed

### SiteHeader.tsx
- **Horizontal padding:** `px-12 lg:px-16` → `px-4 sm:px-8 lg:px-16`
  - Frees 88px of total horizontal space on 320px viewports (48px → 8px per side)
- **Title font size:** `text-[24px]` → `text-lg sm:text-[22px]`
  - 18px on mobile keeps "By Blendstrup" + 36px logo in a single row at 320px

### src/app/(site)/page.tsx (Homepage)
- **Shop Preview container:** `px-12 lg:px-16` → `px-6 sm:px-8 lg:px-16`
- **About section container:** `px-12 lg:px-16` → `px-6 sm:px-8 lg:px-16`
- **Custom Orders CTA container:** `px-12 text-center lg:px-16` → `px-6 sm:px-8 text-center lg:px-16`
- **Media Gallery container:** `px-12 lg:px-16` → `px-6 sm:px-8 lg:px-16`
- **Shop Preview h2:** `text-5xl` → `text-[28px]` — matches "Om Laura" h2 at line 207 for visual parity
- Hero h1 and hero padding left unchanged (full-bleed image, text-5xl is safe at px-8)

### src/app/(site)/gallery/page.tsx
- **Wrapper:** `px-12 py-16 lg:px-16 lg:py-24` → `px-6 py-16 sm:px-8 lg:px-16 lg:py-24`
- **h1:** `text-5xl` → `text-3xl sm:text-4xl lg:text-5xl`

### src/app/(site)/custom-orders/page.tsx
- **Wrapper:** `px-12 lg:px-16` → `px-6 sm:px-8 lg:px-16`
- **h1:** `text-5xl` → `text-3xl sm:text-4xl lg:text-5xl`

### src/app/(site)/contact/page.tsx
- **Wrapper:** `px-12 lg:px-16` → `px-6 sm:px-8 lg:px-16`
- **h1:** `text-5xl` → `text-3xl sm:text-4xl lg:text-5xl`
- Section h2s (`text-[28px]`) left unchanged — already appropriate

### src/app/(site)/contact/purchase/page.tsx
- **Wrapper:** `px-12 lg:px-16` → `px-6 sm:px-8 lg:px-16`
- **h1:** `text-5xl` → `text-3xl sm:text-4xl lg:text-5xl`

### src/components/WorkDetail.tsx
- **Article padding:** `px-12 py-16 lg:px-16 lg:py-24` → `px-6 py-16 sm:px-8 lg:px-16 lg:py-24`
- Work title h1 (`text-[28px]`) left unchanged — intentionally modest beside the image
- "Detaljer" h2 (`text-[22px]`) left unchanged — appropriate for a sub-section label

### src/components/SiteFooter.tsx
- **Footer padding:** `px-12 py-12 lg:px-16 lg:py-16` → `px-6 py-12 sm:px-8 lg:px-16 lg:py-16`

## Before / After Typography Scale

| Element | Before | After (mobile → sm → lg) |
|---------|--------|--------------------------|
| Header title | `text-[24px]` fixed | `text-lg` (18px) → `text-[22px]` |
| Page h1 (gallery, contact, etc.) | `text-5xl` (48px) fixed | `text-3xl` (30px) → `text-4xl` → `text-5xl` |
| Homepage "Til salg" h2 | `text-5xl` (48px) fixed | `text-[28px]` fixed (matches "Om Laura") |
| WorkDetail title h1 | `text-[28px]` fixed | unchanged (intentional) |
| Contact section h2s | `text-[28px]` fixed | unchanged |

## Before / After Padding System

| Container | Before | After |
|-----------|--------|-------|
| Header | `px-12 lg:px-16` | `px-4 sm:px-8 lg:px-16` |
| All page wrappers | `px-12 lg:px-16` | `px-6 sm:px-8 lg:px-16` |
| WorkDetail article | `px-12 lg:px-16` | `px-6 sm:px-8 lg:px-16` |
| SiteFooter | `px-12 lg:px-16` | `px-6 sm:px-8 lg:px-16` |

## Deviations from Plan

None — plan executed exactly as written. Biome class-sort auto-fixes applied on each file (expected with responsive breakpoint class additions).

## Known Stubs

None.

## Threat Flags

None — typography-only changes, no new data flow, endpoints, or auth paths introduced.

## Self-Check: PASSED

Files modified:
- `src/components/SiteHeader.tsx` — FOUND
- `src/components/SiteFooter.tsx` — FOUND
- `src/components/WorkDetail.tsx` — FOUND
- `src/app/(site)/page.tsx` — FOUND
- `src/app/(site)/gallery/page.tsx` — FOUND
- `src/app/(site)/custom-orders/page.tsx` — FOUND
- `src/app/(site)/contact/page.tsx` — FOUND
- `src/app/(site)/contact/purchase/page.tsx` — FOUND

Commits:
- `fe24b42` — fix(quick-260428-bo5): responsive header padding and title sizing
- `cc5c91c` — fix(quick-260428-bo5): responsive h1 sizing and padding across all pages
- `c6f5376` — fix(quick-260428-bo5): responsive padding on WorkDetail and SiteFooter

Build: `pnpm build` passed with zero errors, 12/12 static pages generated.
