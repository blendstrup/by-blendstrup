---
phase: 05-inquiries-email-delivery
plan: "02"
subsystem: purchase-inquiry-form
tags:
  - server-action
  - resend
  - react-hook-form
  - zod
  - honeypot
  - keystatic-reader
dependency_graph:
  requires:
    - "05-01 (purchaseInquirySchema, checkHoneypot)"
  provides:
    - "submitPurchaseInquiry server action"
    - "/contact/purchase RSC page"
    - "PurchaseInquiryForm client component"
    - "SubmitButton reusable component"
    - "ShopCard CTAs → /contact/purchase?piece=[slug]"
    - "WorkDetail available CTA → /contact/purchase?piece=[slug]"
  affects:
    - "src/components/ShopCard.tsx"
    - "src/components/WorkDetail.tsx"
    - "src/app/gallery/[slug]/page.tsx"
    - "messages/da.json"
tech_stack:
  added: []
  patterns:
    - "useActionState + RHF + zodResolver — dual validation (client UX + server truth)"
    - "Server action _prevState signature — required for useActionState compatibility"
    - "Next.js 15 await searchParams — mandatory for page search param access"
    - "Keystatic reader in RSC — createReader(process.cwd(), config) for slug lookup"
    - "Honeypot field at -left-[9999px] — off-screen, aria-hidden, tabIndex=-1"
    - "Generic Danish error messages — Resend details never exposed to client"
key_files:
  created:
    - src/actions/purchase-inquiry.ts
    - src/app/contact/purchase/page.tsx
    - src/components/PurchaseInquiryForm.tsx
    - src/components/SubmitButton.tsx
  modified:
    - src/components/ShopCard.tsx
    - src/components/WorkDetail.tsx
    - src/app/gallery/[slug]/page.tsx
    - messages/da.json
    - biome.json
decisions:
  - "Regarding panel uses <p> not <label> — labeling a read-only <div> (not an input) triggers a11y/noLabelWithoutControl; <p> is semantically correct"
  - "isPending from useActionState passed as prop to SubmitButton — avoids useFormStatus/useActionState coexistence issue in React 19"
  - "Revert biome.json to v1 syntax — package.json installs @biomejs/biome@1.9.4; global biome binary is 2.x; local pnpm exec biome is the correct tool"
  - "onboarding@resend.dev as from address in dev — replace with noreply@[owner-domain] after DNS setup (D-11)"
metrics:
  duration: "~25 minutes"
  completed_date: "2026-04-20"
  tasks_completed: 2
  tasks_total: 2
  files_created: 4
  files_modified: 5
---

# Phase 05 Plan 02: Purchase Inquiry Form Summary

**One-liner:** Full purchase inquiry flow — ShopCard/WorkDetail CTAs updated, /contact/purchase RSC page with Keystatic slug lookup, PurchaseInquiryForm with useActionState + RHF + Zod, submitPurchaseInquiry server action with honeypot + Zod + Resend delivery.

## What Was Built

### Task 1: CTA updates + da.json purchase form keys

- **ShopCard.tsx**: Both desktop hover overlay CTA and mobile fallback CTA changed from `href="/contact"` to `href={/contact/purchase?piece=${slug}}`. Slug was already available as a prop.
- **WorkDetail.tsx**: Added `slug: string` to `WorkDetailProps`. The "available" CTA changed from `href="/custom-orders"` to `href={/contact/purchase?piece=${slug}}`. The "sold" CTA remains at `/custom-orders` as required.
- **src/app/gallery/[slug]/page.tsx**: Passes the `slug` prop (from route params) to `WorkDetail`.
- **messages/da.json**: Added `contact.purchase.form` object with all required keys (heading, regardingLabel, nameLabel, emailLabel, messageLabel, messagePlaceholder, submit, submitting, successHeading, successBody, errorBanner, validationRequired, validationEmail). All existing keys preserved unchanged.

### Task 2: Server action + RSC page + client components

- **src/actions/purchase-inquiry.ts**: `'use server'` directive. `submitPurchaseInquiry(_prevState, formData)` signature. Honeypot check first (silent fake success). Zod `safeParse` for all fields. `RECIPIENT_EMAIL` env check. Resend send with subject `"Ny forespørgsel: [pieceTitle]"`. Generic Danish error on Resend failure — no internal details leaked. `RESEND_API_KEY` and `RECIPIENT_EMAIL` are server-only (no `NEXT_PUBLIC_` prefix).
- **src/app/contact/purchase/page.tsx**: RSC. `await searchParams` (Next.js 15 pitfall fixed). Keystatic reader lookup for piece title. Graceful fallback — invalid/missing slug renders form without "Regarding" panel.
- **src/components/PurchaseInquiryForm.tsx**: `'use client'`. `useActionState(submitPurchaseInquiry, initialState)` — isPending from this, not useFormStatus. RHF + zodResolver for client-side UX validation. Honeypot at `-left-[9999px]`, `aria-hidden="true"`, `tabIndex={-1}`. Hidden fields for pieceSlug/pieceTitle. "Regarding" read-only panel (shown when pieceTitle present). Name, email, message fields with dual error display (RHF + server fieldErrors). Success state replaces form. Error banner for submission failures.
- **src/components/SubmitButton.tsx**: `'use client'`. Accepts `isPending`, `label`, `pendingLabel`, `className?`. Disabled with clay background + cursor-not-allowed when pending.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] biome.json config keys wrong for installed biome version**
- **Found during:** Task 1 (first biome check run)
- **Issue:** The global `pnpm biome` resolved to biome v2.1.3 (which uses `includes`, `assist`), but `package.json` installs `@biomejs/biome@1.9.4` (which uses `include`, `organizeImports`, `assists`). An earlier fix introduced v2 keys that broke the local binary.
- **Fix:** Reverted biome.json to v1.9.4 syntax; used `pnpm exec biome` to invoke the correct local binary.
- **Files modified:** `biome.json`
- **Commits:** 11b693e, 9faf1bf

**2. [Rule 2 - A11y] Regarding panel label changed from `<label>` to `<p>`**
- **Found during:** Task 2 (biome a11y check)
- **Issue:** `noLabelWithoutControl` lint rule flagged a `<label>` without `htmlFor` targeting a form input — the "Regarding" panel labels a read-only `<div>`, not an input, so a `<label>` element is semantically incorrect.
- **Fix:** Changed `<label>` to `<p>` with the same styles. Semantically correct — this is display text, not a form field label.
- **Files modified:** `src/components/PurchaseInquiryForm.tsx`
- **Commit:** 9faf1bf

## Known Stubs

None. All data flows are wired:
- ShopCard/WorkDetail CTAs carry real slug values from Keystatic content
- /contact/purchase page looks up piece title via Keystatic reader
- PurchaseInquiryForm wires to submitPurchaseInquiry server action
- Server action calls Resend with real env vars

The only intentional placeholder is the `from` email address (`onboarding@resend.dev`) — documented inline as a dev placeholder pending DNS setup (D-11). This does not block form functionality.

## Threat Surface Scan

No new threat surface beyond the plan's threat model. All mitigations in T-5-02-01 through T-5-02-06 are implemented:
- T-5-02-01: checkHoneypot called before Zod validation
- T-5-02-02: Zod safeParse server-side (client RHF is UX only)
- T-5-02-03: Generic Danish error string returned — Resend error never forwarded
- T-5-02-04: RESEND_API_KEY has no NEXT_PUBLIC_ prefix (verified by grep)
- T-5-02-05: Invalid slug → undefined → form renders without piece context, no crash
- T-5-02-06: Accepted (rate limiting deferred per CONTEXT.md)

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| Task 1 | 11b693e | feat(05-02): update ShopCard/WorkDetail CTAs + add da.json purchase form keys |
| Task 2 | 9faf1bf | feat(05-02): purchase inquiry server action + RSC page + client form |

## Self-Check: PASSED

All created files confirmed present on disk. Both task commits (11b693e, 9faf1bf) confirmed in git log. Build clean (exit 0). Tests green (38/38).
