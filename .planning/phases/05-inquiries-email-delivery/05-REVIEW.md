---
phase: 05-inquiries-email-delivery
reviewed: 2026-04-20T00:00:00Z
depth: standard
files_reviewed: 18
files_reviewed_list:
  - biome.json
  - messages/da.json
  - package.json
  - src/__tests__/custom-order-schema.test.ts
  - src/__tests__/honeypot.test.ts
  - src/__tests__/purchase-inquiry-schema.test.ts
  - src/actions/custom-order.ts
  - src/actions/purchase-inquiry.ts
  - src/app/contact/purchase/page.tsx
  - src/app/custom-orders/page.tsx
  - src/app/gallery/[slug]/page.tsx
  - src/components/CustomOrderForm.tsx
  - src/components/PurchaseInquiryForm.tsx
  - src/components/ShopCard.tsx
  - src/components/SubmitButton.tsx
  - src/components/WorkDetail.tsx
  - src/lib/honeypot.ts
  - src/lib/schemas/custom-order.ts
  - src/lib/schemas/purchase-inquiry.ts
findings:
  critical: 1
  warning: 3
  info: 3
  total: 7
status: issues_found
---

# Phase 05: Code Review Report

**Reviewed:** 2026-04-20
**Depth:** standard
**Files Reviewed:** 18
**Status:** issues_found

## Summary

This phase implements inquiry forms (purchase and custom-order), server actions that validate submissions and dispatch emails via Resend, a honeypot spam guard, and the related page and component layer. The overall architecture is solid: schemas are shared between server and client, the honeypot check is correct, error messages are never leaked from Resend to the client, and `searchParams`/`params` are properly awaited for Next.js 15.

One critical issue requires fixing before shipping: user-controlled values are interpolated directly into the email HTML without escaping, which is an XSS / email-injection vector. Three warnings cover a logic gap (sold items still show a purchase link in ShopCard), an environment-variable inconsistency between the two actions, and hidden form fields whose values can be client-side tampered. Three info items cover code duplication, a placeholder mismatch, and a minor key instability.

## Critical Issues

### CR-01: XSS via unescaped user input in email HTML

**File:** `src/actions/custom-order.ts:75-87` and `src/actions/purchase-inquiry.ts:73-89`

**Issue:** `buildCustomOrderEmail` and `buildPurchaseEmail` interpolate user-supplied strings (`data.name`, `data.email`, `data.description`, `data.quantity`, `data.budget`, `data.timeline`, `data.message`, `data.pieceTitle`) directly into an HTML template string with no escaping. A submitter can inject arbitrary HTML tags into the email body. While most email clients strip `<script>`, they do render `<a href>`, `<img src>`, `<style>`, and other tags, enabling phishing payloads, CSS injection, and image-beacon tracking inside the owner's inbox.

**Fix:** Add a minimal HTML-escape helper and apply it to every interpolated field:

```typescript
function escHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}
```

Then replace bare interpolations:

```typescript
// Before
<p><strong>Navn:</strong><br>${data.name}</p>

// After
<p><strong>Navn:</strong><br>${escHtml(data.name)}</p>
```

Apply `escHtml()` to every `${data.*}` call in both `buildCustomOrderEmail` and `buildPurchaseEmail`, including the `href="mailto:${data.email}"` attribute. Place the helper in `src/lib/email-utils.ts` so both action files can share it.

## Warnings

### WR-01: ShopCard shows purchase link for sold items

**File:** `src/components/ShopCard.tsx:56-73`

**Issue:** Both the desktop hover overlay (line 57-63) and the mobile fallback block (line 66-73) unconditionally render a "Kontakt for køb" link regardless of `entry.saleStatus`. A visitor browsing sold items is directed to inquire about something unavailable, which creates a confusing experience and may generate wasted emails. `WorkDetail` correctly suppresses the CTA when `saleStatus === "sold"`.

**Fix:** Guard the links on `saleStatus`:

```tsx
{/* Desktop overlay — only for available pieces */}
{entry.saleStatus === "available" && (
  <div className="absolute inset-0 hidden items-center justify-center bg-ink/15 opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:flex">
    <Link href={`/contact/purchase?piece=${slug}`} ...>
      {labels.contactToBuy}
    </Link>
  </div>
)}

{/* Mobile fallback */}
{entry.saleStatus === "available" && (
  <div className="sm:hidden">
    <Link href={`/contact/purchase?piece=${slug}`} ...>
      {labels.contactToBuy}
    </Link>
  </div>
)}
```

Optionally render a "Solgt" badge when `saleStatus === "sold"`, mirroring how the gallery filter treats sold items.

### WR-02: `RESEND_FROM_ADDRESS` missing is silent; `RECIPIENT_EMAIL` missing is an error

**File:** `src/actions/custom-order.ts:47-57` and `src/actions/purchase-inquiry.ts:46-56`

**Issue:** Both actions return a user-visible error when `RECIPIENT_EMAIL` is absent (correct). But when `RESEND_FROM_ADDRESS` is absent the code silently falls back to `"onboarding@resend.dev"` and sends the email anyway. In production this produces emails that appear to come from Resend's onboarding domain, which looks like phishing to the recipient. The silent fallback also means a misconfigured deployment goes undetected until someone checks the inbox. The two env vars should be treated consistently.

**Fix:** Add the same guard for `RESEND_FROM_ADDRESS`:

```typescript
const fromAddress = process.env.RESEND_FROM_ADDRESS
if (!fromAddress) {
  return {
    success: false,
    error: "Noget gik galt. Prøv igen, eller send mig en e-mail direkte.",
  }
}

const { error } = await resend.emails.send({
  from: fromAddress,
  to: recipientEmail,
  ...
})
```

If a dev-only fallback is needed during local development, gate it explicitly:

```typescript
const fromAddress =
  process.env.RESEND_FROM_ADDRESS ??
  (process.env.NODE_ENV === "development" ? "onboarding@resend.dev" : undefined)
```

### WR-03: Client-controlled `pieceTitle` injected into email subject and body without server verification

**File:** `src/components/PurchaseInquiryForm.tsx:66-67` and `src/actions/purchase-inquiry.ts:58`

**Issue:** `pieceTitle` is rendered as a hidden `<input>` in the form (line 67 of the component). A user can edit the DOM or use DevTools to change this value before submitting. The server action uses the submitted `pieceTitle` verbatim in the email subject line (`Ny forespørgsel: ${result.data.pieceTitle}`) and body. This allows a user to fabricate an arbitrary subject / piece reference in the email delivered to the owner — a low-severity spoofing vector.

**Fix:** In the server action, re-fetch the actual piece title from Keystatic using the submitted `pieceSlug` rather than trusting the submitted `pieceTitle`:

```typescript
// In submitPurchaseInquiry, after schema validation:
let verifiedPieceTitle: string | undefined
if (result.data.pieceSlug) {
  const reader = createReader(process.cwd(), keystaticConfig)
  const entry = await reader.collections.works.read(result.data.pieceSlug)
  verifiedPieceTitle = entry?.title
}

// Use verifiedPieceTitle in buildPurchaseEmail and email subject
```

This also closes the gap where `pieceSlug` refers to an invalid or draft work (the page already handles this gracefully, but the action does not re-check).

## Info

### IN-01: `ActionState` type duplicated across both action files

**File:** `src/actions/custom-order.ts:12-16` and `src/actions/purchase-inquiry.ts:12-16`

**Issue:** Both files export an identical `ActionState` type. Any future change requires a synchronised edit in two places.

**Fix:** Extract to `src/actions/types.ts`:

```typescript
// src/actions/types.ts
export type ActionState = {
  success: boolean
  error?: string
  fieldErrors?: Record<string, string[]>
}
```

Import in both action files and both form components.

### IN-02: Wrong placeholder used for the custom-order description textarea

**File:** `src/components/CustomOrderForm.tsx:122`

**Issue:** The textarea registered as the `description` field displays `da.contact.customOrders.form.descriptionPlaceholder` ("Størrelse, farve, tekstur, brug — jo mere, jo bedre."). Its label (line 116) is `da.contact.customOrders.form.whatLabel` ("Hvad ønsker du?"). In `messages/da.json`, `whatLabel` is paired with `whatPlaceholder` ("F.eks. en skål til frugt, fire matchende krus..."), while `descriptionPlaceholder` is meant to accompany a separate `descriptionLabel` field. The form collapsed two fields into one textarea but took the placeholder from the wrong field key, so the hint text does not match the prompt.

**Fix:** Change line 122 to use `whatPlaceholder`:

```tsx
placeholder={da.contact.customOrders.form.whatPlaceholder}
```

### IN-03: Image key uses file path which may not be unique

**File:** `src/components/WorkDetail.tsx:96`

**Issue:** `key={img.image || i}` uses the image src path as the React key for the additional-images grid. If an image were duplicated in the CMS entry (same file path appearing twice), two children would share a key, triggering a React reconciliation warning and potentially unexpected DOM behaviour.

**Fix:** Use only the array index, which is always unique within the slice:

```tsx
{images.slice(1).map((img, i) => (
  <div key={i} ...>
```

Or, if a more stable key is preferred, combine both:

```tsx
key={`${img.image}-${i}`}
```
---

_Reviewed: 2026-04-20_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
