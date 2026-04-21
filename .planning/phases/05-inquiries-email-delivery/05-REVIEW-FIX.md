---
phase: 05-inquiries-email-delivery
fixed_at: 2026-04-21T22:44:00Z
review_path: .planning/phases/05-inquiries-email-delivery/05-REVIEW.md
iteration: 1
findings_in_scope: 4
fixed: 4
skipped: 0
status: all_fixed
---

# Phase 05: Code Review Fix Report

**Fixed at:** 2026-04-21T22:44:00Z
**Source review:** .planning/phases/05-inquiries-email-delivery/05-REVIEW.md
**Iteration:** 1

**Summary:**
- Findings in scope: 4
- Fixed: 4
- Skipped: 0

## Fixed Issues

### CR-01: XSS via unescaped user input in email HTML

**Files modified:** `src/lib/email-utils.ts`, `src/actions/custom-order.ts`, `src/actions/purchase-inquiry.ts`
**Commit:** 39e99f3
**Applied fix:** Created `src/lib/email-utils.ts` with an `escHtml` helper that escapes `& < > " '`. Applied `escHtml()` to every `${data.*}` interpolation in `buildCustomOrderEmail` and `buildPurchaseEmail`, including `href="mailto:..."` attributes.

### WR-01: ShopCard shows purchase link for sold items

**Files modified:** `src/components/ShopCard.tsx`
**Commit:** ad3fb0b
**Applied fix:** Wrapped both the desktop hover overlay `<div>` and the mobile fallback `<div>` in `{entry.saleStatus === "available" && (...)}` guards. Sold and notListed pieces no longer render the "Kontakt for køb" link.

### WR-02: `RESEND_FROM_ADDRESS` missing is silent; `RECIPIENT_EMAIL` missing is an error

**Files modified:** `src/actions/custom-order.ts`, `src/actions/purchase-inquiry.ts`
**Commit:** 39e99f3
**Applied fix:** Replaced the unconditional `?? "onboarding@resend.dev"` fallback with an explicit `fromAddress` variable that uses `"onboarding@resend.dev"` only when `NODE_ENV === "development"`, and returns the user-visible error when `fromAddress` is `undefined` in production. Applied identically to both action files.

### WR-03: Client-controlled `pieceTitle` injected into email subject and body without server verification

**Files modified:** `src/actions/purchase-inquiry.ts`
**Commit:** 39e99f3
**Applied fix:** Added Keystatic imports (`createReader`, `keystaticConfig`) to `purchase-inquiry.ts`. After schema validation, if `pieceSlug` is present the action now calls `reader.collections.works.read(pieceSlug)` to obtain a `verifiedPieceTitle` from the server-side content store. The email subject and `buildPurchaseEmail` call use `verifiedPieceTitle` instead of the client-submitted `pieceTitle` field. `buildPurchaseEmail` signature updated to accept `verifiedPieceTitle?: string` as a second parameter.

---

_Fixed: 2026-04-21T22:44:00Z_
_Fixer: Claude (gsd-code-fixer)_
_Iteration: 1_
