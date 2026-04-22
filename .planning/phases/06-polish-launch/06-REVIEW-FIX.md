---
phase: 06-polish-launch
fixed_at: 2026-04-22T00:00:00Z
review_path: .planning/phases/06-polish-launch/06-REVIEW.md
fix_scope: critical_warning
findings_in_scope: 4
fixed: 4
skipped: 0
iteration: 1
status: all_fixed
---

# Phase 06: Code Review Fix Report

**Fixed at:** 2026-04-22
**Source review:** .planning/phases/06-polish-launch/06-REVIEW.md
**Iteration:** 1

**Summary:**
- Findings in scope: 4
- Fixed: 4
- Skipped: 0

## Fixed Issues

### WR-01: Blur-placeholder test has a conditional assertion that can never fail

**Files modified:** `src/__tests__/blur-placeholder.test.ts`
**Commit:** 61a796c
**Applied fix:** Replaced the `if (result !== undefined)` guard with the `describe.skipIf` pattern using `existsSync` to check whether the fixture image is present on disk. The unconditional `expect(result).toMatch(/^data:image\//)` now runs when the fixture exists and the whole describe block is explicitly skipped (not silently vacuous) when it does not. The existing fixture at `public/images/works/bowl-test/images/0/image.png` was confirmed present, so the test will run in this environment.

### WR-02: WorkDetail primary image uses `fill` inside a container with no defined height

**Files modified:** `src/components/WorkDetail.tsx`
**Commit:** 5ed53e6
**Applied fix:** Replaced the double-wrapper (`<div relative w-full>` + `<div relative w-full style={{ minHeight: "400px" }}>`) with a single `<div className="relative aspect-[4/5] w-full overflow-hidden">`. The `fill`-mode `<Image>` now has a positioned ancestor with an intrinsic height derived from the aspect ratio, scales proportionally at all viewport widths, and eliminates the inline style (which also resolves IN-03).

### WR-03: `.env.example` is missing required email environment variables

**Files modified:** `.env.example`
**Commit:** cdc6498
**Applied fix:** Added `RESEND_API_KEY`, `RECIPIENT_EMAIL`, and `RESEND_FROM_ADDRESS` with descriptive comments matching the style of `.env.local.example`. The file now documents all variables required for forms to function, so a developer copying `.env.example` will not encounter silent runtime failures.

### WR-04: `pieceTitle` is read from client `FormData` but never used

**Files modified:** `src/lib/schemas/purchase-inquiry.ts`, `src/actions/purchase-inquiry.ts`, `src/__tests__/purchase-inquiry-schema.test.ts`
**Commit:** 597b1bd
**Applied fix:** Removed `pieceTitle: z.string().optional()` from the Zod schema and removed the `pieceTitle: formData.get("pieceTitle") || undefined` line from the action's `raw` object. Both locations now carry a comment explaining that the piece title is intentionally re-verified via Keystatic (as `verifiedPieceTitle`) to prevent subject-line spoofing. The schema test's first case was also updated to remove the now-absent `pieceTitle` input, keeping the test consistent with the schema. The `PurchaseInquiryForm` hidden input and the page-level prop were left in place — the client may still submit the field but the server ignores it, which is the correct security boundary.

---

_Fixed: 2026-04-22_
_Fixer: Claude (gsd-code-fixer)_
_Iteration: 1_
