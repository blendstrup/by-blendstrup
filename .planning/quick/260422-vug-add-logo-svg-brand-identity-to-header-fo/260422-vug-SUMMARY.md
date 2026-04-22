---
quick_id: 260422-vug
title: Add logo SVG brand identity to header, footer, and email
completed: "2026-04-22T21:03:53Z"
duration_minutes: 4
tasks_completed: 3
tasks_total: 3
commits:
  - hash: 14e828f
    message: "feat(260422-vug): add logo to SiteHeader and rebuild SiteFooter with brand identity"
  - hash: 73a9afa
    message: "feat(260422-vug): add inline SVG logo to transactional email templates"
key_files:
  created:
    - public/logo.svg
  modified:
    - src/components/SiteHeader.tsx
    - src/components/SiteFooter.tsx
    - src/lib/email-utils.ts
decisions:
  - "logo.svg copied to public/ from main repo (was untracked); staged and committed as part of Task 1"
  - "Biome class-sort enforced via main-repo biome binary (worktree lacks node_modules); auto-fix applied"
  - "max-w-screen-xl kept over max-w-7xl (canonical suggestion) for consistency with rest of codebase"
  - "LOGO_SVG defined as module-level const outside emailShell — not user-supplied, no escHtml needed"
tags: [brand, logo, header, footer, email, svg]
---

# Quick Task 260422-vug: Add Logo SVG Brand Identity to Header, Footer, and Email

**One-liner:** Ceramic spiral SVG logo integrated across site header nav, rebuilt footer with contact details, and transactional email shell via inline SVG string.

## What Was Done

### Task 1 — SiteHeader logo

Added `next/image` import and placed the logo before the site name text inside the `<Link href="/">` block. The link now uses `flex items-center gap-2.5` so logo and text sit on the same baseline. `width={36} height={36} priority` renders the mark as a compact header icon. Hover opacity applies to the whole link as a unit.

### Task 2 — SiteFooter rebuild

Replaced the single-line placeholder footer with a structured two-column footer:
- **Brand block:** logo (inverted via `invert opacity-80` for dark background) + "By Blendstrup" in serif + Japandi tagline
- **Contact block:** email mailto link + Instagram external link
- **Bottom rule:** hairline border + copyright

Responsive: stacked on mobile, side-by-side at `sm` breakpoint.

### Task 3 — Email inline SVG

Added `LOGO_SVG` constant containing the two ceramic spiral path elements with `viewBox="150 330 290 290"` to crop the A4 canvas to just the mark area (44×44px rendered). Updated `emailShell` header block to use a table-based logo + brand name pair (required for email client compatibility — no flexbox). Subject line remains escaped via `escHtml`; `LOGO_SVG` is static and requires no escaping.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] logo.svg untracked in worktree**
- **Found during:** Task 1 setup
- **Issue:** `public/logo.svg` existed in the main repo as an untracked file but was absent from the worktree's working directory
- **Fix:** Copied logo.svg from main repo to worktree public/ and staged it as part of Task 1 commit
- **Files modified:** `public/logo.svg`
- **Commit:** 14e828f

**2. [Rule 1 - Bug] Biome class-sort errors in SiteFooter and SiteHeader**
- **Found during:** Tasks 1 and 2 (post-edit IDE diagnostics)
- **Issue:** Tailwind class ordering did not match Biome's `useSortedClasses` rule
- **Fix:** Ran `biome check --write` from main repo (worktree lacks node_modules); auto-sorted classes in both components
- **Files modified:** `src/components/SiteHeader.tsx`, `src/components/SiteFooter.tsx`
- **Commit:** 14e828f

## Known Stubs

None. All links and data are wired: email links to `mailto:jonasblendstrup@gmail.com`, Instagram to `https://www.instagram.com/byblendstrup`, logo served from `/public/logo.svg`.

## Threat Flags

None. No new network endpoints, auth paths, or schema changes introduced.

## Verification

- `pnpm build` — exits 0, no TypeScript errors
- `pnpm test` — 82/82 tests pass (run from main repo)
- `biome check` — no errors on all three modified files

## Self-Check: PASSED

- [x] `public/logo.svg` — exists in worktree
- [x] `src/components/SiteHeader.tsx` — Image import + logo in nav link
- [x] `src/components/SiteFooter.tsx` — rebuilt with brand + contact blocks
- [x] `src/lib/email-utils.ts` — LOGO_SVG const + updated emailShell header
- [x] Commit 14e828f — exists (`git log --oneline | grep 14e828f`)
- [x] Commit 73a9afa — exists (`git log --oneline | grep 73a9afa`)
