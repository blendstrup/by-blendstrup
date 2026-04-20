---
phase: 05-inquiries-email-delivery
verified: 2026-04-20T22:40:00Z
status: human_needed
score: 11/12 must-haves verified
overrides_applied: 0
human_verification:
  - test: "Submit both inquiry forms end-to-end with real env vars set"
    expected: "Emails arrive in owner inbox with SPF=pass, DKIM=pass — subject 'Ny forespørgsel: [piece]' and 'Ny specialbestilling fra [name]'"
    why_human: "Cannot verify Resend API call, DNS SPF/DKIM pass, and inbox delivery from code alone. Plan 04 SUMMARY claims email-verified signal received 2026-04-20 but this must be independently confirmed."
  - test: "Test honeypot rejection: fill the hidden website field and submit a form"
    expected: "Success state shown to user but NO email arrives in owner inbox"
    why_human: "Honeypot code path is verified in unit tests, but the fake-success-without-email behavior requires a live form submission to confirm Resend is truly not called."
---

# Phase 5: Inquiries & Email Delivery — Verification Report

**Phase Goal:** Customers can submit purchase inquiries and custom order requests via dedicated forms that deliver email notifications to the shop owner. Both forms are validated, spam-protected, and wired to Resend for reliable email delivery.
**Verified:** 2026-04-20T22:40:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths (from Roadmap Success Criteria)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| SC-1 | Visitor can submit a custom order request capturing what they want, quantity, free-form description, contact info, plus optional budget and timeline | VERIFIED | `CustomOrderForm.tsx` renders all 6 fields (name, email, description, quantity, budget[optional], timeline[optional]). `customOrderSchema` validates all. `src/app/custom-orders/page.tsx` renders the form. |
| SC-2 | Visitor can submit a purchase inquiry from any for-sale piece's "Contact to buy" CTA, carrying the piece reference into the email | VERIFIED | `ShopCard.tsx` both CTAs link to `/contact/purchase?piece=${slug}`. `WorkDetail.tsx` available CTA links to `/contact/purchase?piece=${slug}`. `contact/purchase/page.tsx` reads the slug, does Keystatic lookup for title, and passes it to `PurchaseInquiryForm`. Hidden `pieceSlug`/`pieceTitle` fields carry context into the server action. |
| SC-3 | Both forms reject spam via honeypot without blocking legitimate submissions | VERIFIED | Both `PurchaseInquiryForm.tsx` and `CustomOrderForm.tsx` include a `name="website"` input with `className="-left-[9999px]"`, `aria-hidden="true"`, `tabIndex={-1}`. Both server actions call `checkHoneypot(formData.get("website"))` before any Zod or Resend logic. 6 unit tests in `honeypot.test.ts` pass. |
| SC-4 | Owner receives every submission as a deliverable email (SPF, DKIM, and DMARC pass) within seconds | UNCERTAIN | Server actions call `resend.emails.send()` with correct subjects. `RESEND_API_KEY`, `RECIPIENT_EMAIL`, `RESEND_FROM_ADDRESS` env vars are used. Plan 04 SUMMARY claims email delivery confirmed with SPF/DKIM pass, but cannot verify DNS records or actual delivery from code. Requires human confirmation. |

**Score:** 11/12 must-haves verified (SC-4 requires human confirmation)

### Additional Plan Must-Haves

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| P01-1 | Zod schemas exist as shared modules with no server/client directive | VERIFIED | `src/lib/schemas/purchase-inquiry.ts` and `src/lib/schemas/custom-order.ts` — no `use server` or `use client` directive. Grep output empty. |
| P01-2 | purchaseInquirySchema validates name, email, message as required; pieceSlug/pieceTitle optional | VERIFIED | File read confirms schema structure. 5 unit tests pass in `purchase-inquiry-schema.test.ts`. |
| P01-3 | customOrderSchema validates name, email, description, quantity as required; budget and timeline optional | VERIFIED | File read confirms `budget: z.string().optional()`, `timeline: z.string().optional()`. 7 unit tests pass in `custom-order-schema.test.ts`. |
| P01-4 | checkHoneypot returns true when filled, false when empty/null/whitespace | VERIFIED | `src/lib/honeypot.ts` — pure function, no directive. 6 unit tests in `honeypot.test.ts` all pass. |
| P01-5 | All 3 Wave 0 test files exist and pass green | VERIFIED | `pnpm test` exits 0 — 285/285 tests pass across 34 test files including all 3 new Phase 5 files. |
| P01-6 | resend, react-hook-form, @hookform/resolvers, zod in package.json | VERIFIED | resend@6.12.2, react-hook-form@7.72.1, zod@4.3.6, @hookform/resolvers@^5.2.2 confirmed in package.json. |
| P02-1 | ShopCard CTAs (desktop + mobile) link to /contact/purchase?piece=[slug] | VERIFIED | `ShopCard.tsx` line 58 and 68 both have `href={\`/contact/purchase?piece=${slug}\`}`. |
| P02-2 | WorkDetail available CTA links to /contact/purchase?piece=[slug] | VERIFIED | `WorkDetail.tsx` line 67: `href={\`/contact/purchase?piece=${slug}\`}`. Sold CTA correctly remains at `/custom-orders`. |
| P02-3 | Visiting /contact/purchase page: reads piece slug, Keystatic lookup, graceful fallback | VERIFIED | `page.tsx` awaits `searchParams` (Next.js 15 pattern), calls `reader.collections.works.read(slug)`, handles `undefined` entry gracefully. |
| P02-4 | RESEND_API_KEY not prefixed NEXT_PUBLIC_ | VERIFIED | Grep for `NEXT_PUBLIC_` in both action files returns empty. |
| P03-1 | Optional budget and timeline labelled with (valgfri) in stone color | VERIFIED | `CustomOrderForm.tsx` lines 171/188: `da.contact.customOrders.form.budgetOptional` and `timelineOptional` in `<span className="font-normal text-stone">`. da.json contains `"budgetOptional": "(valgfri)"` and `"timelineOptional": "(valgfri)"`. |
| P04-1 | .env.local.example documents all three required env vars | VERIFIED | File confirmed to contain `RESEND_API_KEY=`, `RECIPIENT_EMAIL=`, `RESEND_FROM_ADDRESS=` with comment referencing resend.com. |

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/lib/schemas/purchase-inquiry.ts` | Zod schema for purchase inquiry form | VERIFIED | Exports `purchaseInquirySchema`, `PurchaseInquiryData`. No directive. |
| `src/lib/schemas/custom-order.ts` | Zod schema for custom order form | VERIFIED | Exports `customOrderSchema`, `CustomOrderFormData`. No directive. `budget` and `timeline` are optional. |
| `src/lib/honeypot.ts` | Pure honeypot check function | VERIFIED | Exports `checkHoneypot`. No directive. |
| `src/__tests__/purchase-inquiry-schema.test.ts` | Unit tests for purchase inquiry schema | VERIFIED | 5 test cases, all pass. |
| `src/__tests__/custom-order-schema.test.ts` | Unit tests for custom order schema | VERIFIED | 7 test cases, all pass. |
| `src/__tests__/honeypot.test.ts` | Unit tests for honeypot utility | VERIFIED | 6 test cases, all pass. |
| `src/actions/purchase-inquiry.ts` | Server action — honeypot, Zod, Resend | VERIFIED | `'use server'`, `_prevState` signature, `checkHoneypot` called first, `purchaseInquirySchema.safeParse`, Resend with correct subject. |
| `src/app/contact/purchase/page.tsx` | RSC page — reads searchParams, Keystatic lookup | VERIFIED | `await searchParams`, `createReader(...).collections.works.read(slug)`, renders `PurchaseInquiryForm`. |
| `src/components/PurchaseInquiryForm.tsx` | Client form with useActionState + RHF | VERIFIED | `'use client'`, `useActionState(submitPurchaseInquiry)`, `zodResolver(purchaseInquirySchema)`, honeypot field, hidden piece fields. |
| `src/components/SubmitButton.tsx` | Reusable submit button | VERIFIED | `'use client'`, accepts `isPending`, `label`, `pendingLabel`. |
| `src/actions/custom-order.ts` | Server action — honeypot, Zod, Resend | VERIFIED | `'use server'`, `_prevState` signature, `checkHoneypot` first, `customOrderSchema.safeParse`, Resend with subject `Ny specialbestilling fra [name]`. |
| `src/app/custom-orders/page.tsx` | RSC page shell — renders CustomOrderForm | VERIFIED | Imports and renders `CustomOrderForm`. Heading/subCopy from da.json. |
| `src/components/CustomOrderForm.tsx` | Client form with useActionState + RHF | VERIFIED | `'use client'`, `useActionState(submitCustomOrder)`, `zodResolver(customOrderSchema)`, honeypot field, optional fields with `(valgfri)` labels. |
| `.env.local.example` | Documentation of required env vars | VERIFIED | Contains `RESEND_API_KEY=`, `RECIPIENT_EMAIL=`, `RESEND_FROM_ADDRESS=` with instructions. |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/actions/purchase-inquiry.ts` | `src/lib/schemas/purchase-inquiry.ts` | `import { purchaseInquirySchema }` + `safeParse` | WIRED | Line 5-7: import. Line 35: `purchaseInquirySchema.safeParse(raw)`. |
| `src/components/PurchaseInquiryForm.tsx` | `src/lib/schemas/purchase-inquiry.ts` | `zodResolver(purchaseInquirySchema)` | WIRED | Line 10: import. Line 37: `resolver: zodResolver(purchaseInquirySchema)`. |
| `src/actions/purchase-inquiry.ts` | `src/lib/honeypot.ts` | `checkHoneypot(formData.get('website'))` | WIRED | Line 3: import. Line 23: `checkHoneypot(formData.get("website"))`. |
| `src/app/contact/purchase/page.tsx` | Keystatic works collection | `reader.collections.works.read(slug)` | WIRED | Lines 17-18: `createReader(...)` then `reader.collections.works.read(slug)`. |
| `src/components/PurchaseInquiryForm.tsx` | `src/actions/purchase-inquiry.ts` | `useActionState(submitPurchaseInquiry)` | WIRED | Line 28-31: `useActionState(submitPurchaseInquiry, initialState)`. |
| `src/components/ShopCard.tsx` | `/contact/purchase` | `href={/contact/purchase?piece=${slug}}` | WIRED | Lines 58, 68: both desktop and mobile CTAs. |
| `src/components/WorkDetail.tsx` | `/contact/purchase` | `href={/contact/purchase?piece=${slug}}` | WIRED | Line 67: available CTA. |
| `src/components/CustomOrderForm.tsx` | `src/actions/custom-order.ts` | `useActionState(submitCustomOrder)` | WIRED | Line 24-27: `useActionState(submitCustomOrder, initialState)`. |
| `src/actions/custom-order.ts` | `src/lib/honeypot.ts` | `checkHoneypot(formData.get('website'))` | WIRED | Line 3: import. Line 23: call. |
| `src/actions/custom-order.ts` | `src/lib/schemas/custom-order.ts` | `customOrderSchema.safeParse(raw)` | WIRED | Lines 4-7: import. Line 36: `customOrderSchema.safeParse(raw)`. |
| `src/actions/purchase-inquiry.ts` | Resend API | `process.env.RESEND_API_KEY` | WIRED (code) | Line 10: `new Resend(process.env.RESEND_API_KEY)`. Actual delivery requires human verification. |
| `src/actions/custom-order.ts` | Resend API | `process.env.RESEND_API_KEY` | WIRED (code) | Line 10: `new Resend(process.env.RESEND_API_KEY)`. Actual delivery requires human verification. |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|-------------------|--------|
| `PurchaseInquiryForm.tsx` | `state` (from useActionState) | `submitPurchaseInquiry` server action | Yes — server action runs Zod + Resend with FormData | FLOWING |
| `contact/purchase/page.tsx` | `pieceTitle` | `reader.collections.works.read(slug)` → `entry?.title` | Yes — reads from Keystatic/git content | FLOWING |
| `CustomOrderForm.tsx` | `state` (from useActionState) | `submitCustomOrder` server action | Yes — server action runs Zod + Resend with FormData | FLOWING |
| `custom-orders/page.tsx` | Static content | da.json heading/subCopy strings | Yes — static strings, no query needed | FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| 285 unit tests pass | `pnpm test` | 285/285 pass, 34 files | PASS |
| Honeypot module exports `checkHoneypot` | Node eval | `export function checkHoneypot` found, no directive | PASS |
| Purchase subject format | grep in action | `Ny forespørgsel:` present | PASS |
| Custom order subject format | grep in action | `Ny specialbestilling fra` present | PASS |
| No `NEXT_PUBLIC_` on secrets | grep | Empty output | PASS |
| Resend installed at correct version | package.json | `resend@6.12.2` | PASS |
| End-to-end email delivery (purchase form) | Manual submission required | Cannot verify from code | SKIP — human needed |
| End-to-end email delivery (custom order form) | Manual submission required | Cannot verify from code | SKIP — human needed |
| SPF/DKIM pass on delivered emails | Email header inspection | Cannot verify from code | SKIP — human needed |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| CUST-01 | 05-01, 05-03 | Visitor can submit custom order with what they want, quantity, description, contact info | SATISFIED | `CustomOrderForm.tsx` has all 4 required fields wired to server action and Zod schema. |
| CUST-02 | 05-01, 05-03 | Custom order form includes optional budget and timeline | SATISFIED | `customOrderSchema` has `budget: z.string().optional()`, `timeline: z.string().optional()`. Form renders both with `(valgfri)` labels. |
| CUST-03 | 05-01, 05-02, 05-03 | Custom order form has spam protection | SATISFIED | Honeypot field in `CustomOrderForm.tsx` (off-screen, aria-hidden). `submitCustomOrder` calls `checkHoneypot` before any other logic. Also applied to purchase inquiry form. |
| SHOP-04 | 05-02 | Each for-sale piece has "Contact to buy" CTA opening purchase inquiry form | SATISFIED | `ShopCard.tsx` both CTAs (desktop/mobile) link to `/contact/purchase?piece=${slug}`. `WorkDetail.tsx` available CTA does same. |
| CONT-02 | 05-02, 05-04 | Purchase inquiry emails delivered reliably (SPF/DKIM/DMARC configured) | NEEDS HUMAN | Server code is wired to Resend. DNS/SPF/DKIM/DMARC cannot be verified from code. Plan 04 SUMMARY claims human confirmation received. |
| CONT-03 | 05-03, 05-04 | Custom order inquiry emails delivered reliably | NEEDS HUMAN | Server code is wired to Resend. Same DNS concern as CONT-02. |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `PurchaseInquiryForm.tsx` | 94, 128, 161-162 | `placeholder:text-stone` in CSS class strings | INFO | Not a stub — these are Tailwind CSS modifier classes, not placeholder content. |
| `CustomOrderForm.tsx` | 17, 122, 149, 178, 195 | `placeholder` in inputClass and textarea props | INFO | Not a stub — CSS modifier class and prop values from da.json. All placeholder text is real copy from da.json. |

No blockers or warnings found. All apparent matches are CSS class modifiers or legitimate placeholder prop values from the localization file.

### Human Verification Required

#### 1. End-to-end email delivery — Purchase inquiry form

**Test:** With `RESEND_API_KEY`, `RECIPIENT_EMAIL`, and `RESEND_FROM_ADDRESS` set in `.env.local` (or Vercel), navigate to `/contact/purchase?piece=[a valid work slug]`. Fill in Name, Email, and Message. Submit.
**Expected:** (1) Form shows success state ("Tak for din henvendelse"). (2) Owner inbox receives email within seconds. (3) Email headers show `SPF=pass` and `DKIM=pass`. (4) Subject line reads "Ny forespørgsel: [piece title]".
**Why human:** DNS records, SPF/DKIM signing, and inbox delivery cannot be verified from code. Resend API response is only observable at runtime with real credentials.

#### 2. End-to-end email delivery — Custom order form

**Test:** Navigate to `/custom-orders`. Fill in all required fields (Name, Email, What you want, Quantity). Leave Budget and Timeline empty. Submit.
**Expected:** (1) Form shows success state ("Tak for din bestilling"). (2) Owner inbox receives email within seconds. (3) Subject line reads "Ny specialbestilling fra [Name]". (4) Email body does not include Budget or Timeline sections (optional fields left empty).
**Why human:** Same as above — Resend delivery and DNS authentication are runtime concerns.

#### 3. Honeypot live test (optional but recommended)

**Test:** On either form, open DevTools → Elements, find the `name="website"` input (positioned off-screen), remove the hiding CSS, type any text, and submit.
**Expected:** Form shows success state (fake success) but NO email arrives in the owner inbox.
**Why human:** The honeypot logic is unit-tested but the "no Resend call" behavior in the live environment must be confirmed to ensure the server action branch is actually reached and short-circuits before `resend.emails.send()`.

### Gaps Summary

No code gaps found. All artifacts exist, are substantive, and are fully wired. All key links verified manually. 285 unit tests pass.

The one remaining uncertainty (SC-4 / CONT-02 / CONT-03) is operational, not a code gap: email delivery, DNS SPF/DKIM/DMARC configuration, and Vercel env var setup require human confirmation. The Plan 04 SUMMARY documents that this was completed by the owner on 2026-04-20, but independent verification from code is not possible.

---

_Verified: 2026-04-20T22:40:00Z_
_Verifier: Claude (gsd-verifier)_
