---
phase: 06-polish-launch
reviewed: 2026-04-22T00:00:00Z
depth: standard
files_reviewed: 20
files_reviewed_list:
  - src/lib/blur-placeholder.ts
  - src/__tests__/blur-placeholder.test.ts
  - next.config.ts
  - src/lib/metadata.ts
  - src/app/sitemap.ts
  - src/app/robots.ts
  - .env.example
  - src/app/gallery/[slug]/page.tsx
  - src/actions/custom-order.ts
  - src/actions/purchase-inquiry.ts
  - src/app/contact/page.tsx
  - src/app/gallery/page.tsx
  - src/app/page.tsx
  - src/components/WorkCard.tsx
  - src/components/ShopCard.tsx
  - src/components/WorkDetail.tsx
  - src/components/GalleryGrid.tsx
  - src/app/layout.tsx
  - src/app/contact/purchase/page.tsx
  - src/app/custom-orders/page.tsx
  - docs/cms-guide.md
findings:
  critical: 0
  warning: 4
  info: 4
  total: 8
status: issues_found
---

# Phase 06: Code Review Report

**Reviewed:** 2026-04-22
**Depth:** standard
**Files Reviewed:** 20
**Status:** issues_found

## Summary

Reviewed 20 source files covering blur-placeholder generation, SEO infrastructure (metadata, sitemap, robots), server actions for forms, page components, and the CMS guide. The codebase is well-structured: server-only utilities are correctly isolated, user input is HTML-escaped before email interpolation, Keystatic reads verify slugs server-side before trusting client data, and draft content is consistently filtered before rendering.

No critical security vulnerabilities were found. Four warnings relate to correctness issues — a flawed test assertion that can never fail, a missing image height constraint that causes the primary WorkDetail image to be unresponsive above its minimum, two undocumented required environment variables in the committed `.env.example`, and a `pieceTitle` field that is accepted from the client but never used in the email (wasted trust boundary). Four info items cover TODO comments left in layout, a duplicate type declaration, a magic inline style, and a minor gap in the `docs/cms-guide.md` which does not mention custom orders copy or the About singleton.

---

## Warnings

### WR-01: Blur-placeholder test has a conditional assertion that can never fail

**File:** `src/__tests__/blur-placeholder.test.ts:14`

**Issue:** The first test wraps the core assertion inside `if (result !== undefined)`. If the test image path does not exist on disk, `result` is `undefined` and the assertion is silently skipped — the test passes vacuously. This means the test provides no coverage guarantee and will silently pass in CI even when the feature is broken (e.g. if the image path changes or `plaiceholder` stops working).

**Fix:** Either commit the test fixture image at the expected path and remove the conditional, or explicitly assert both branches:
```typescript
it("returns a base64 data URI for a valid image path", async () => {
  const result = await getBlurDataUrl(
    "/images/works/bowl-test/images/0/image.png",
  )
  // Assert unconditionally — this test only runs when the fixture exists
  expect(result).toMatch(/^data:image\//)
})
```
If the fixture may be absent in some environments, use `vitest`'s `skipIf` to skip the test explicitly rather than silently swallow the assertion:
```typescript
import { describe, expect, it } from "vitest"
import { existsSync } from "node:fs"
import path from "node:path"

const FIXTURE = "/images/works/bowl-test/images/0/image.png"
const fixtureExists = existsSync(path.join(process.cwd(), "public", FIXTURE))

describe.skipIf(!fixtureExists)("getBlurDataUrl — fixture tests", () => {
  it("returns a base64 data URI for a valid image path", async () => {
    const result = await getBlurDataUrl(FIXTURE)
    expect(result).toMatch(/^data:image\//)
  })
})
```

---

### WR-02: WorkDetail primary image uses `fill` inside a container with no defined height — breaks at certain viewport widths

**File:** `src/components/WorkDetail.tsx:36-49`

**Issue:** The primary image `<Image fill ...>` is placed inside:
```tsx
<div className="relative w-full">          {/* no height */}
  <div className="relative w-full" style={{ minHeight: "400px" }}>
    <Image fill ... />
  </div>
</div>
```
A `fill`-mode image requires its nearest positioned ancestor to have an explicit, non-zero height — not just a `minHeight`. While `minHeight: 400px` causes the div to render at exactly 400px when empty (which works), the outer wrapper has zero intrinsic height and the approach does not scale proportionally with viewport. On large screens the image is always capped at 400px regardless of available width, making the detail view feel cramped on desktop. More importantly, if CSS is loaded after the HTML (e.g., SSR with flash), the lack of an aspect-ratio constraint can briefly collapse the layout.

**Fix:** Replace the double-wrapper with a single element using an explicit aspect ratio:
```tsx
<div className="relative aspect-[4/5] w-full overflow-hidden">
  <Image
    src={images[0]?.image ?? ""}
    alt={images[0]?.alt ?? ""}
    priority
    fill
    className="object-contain"
    sizes="(max-width: 1024px) 100vw, 55vw"
    placeholder={blurUrls[0] ? "blur" : "empty"}
    blurDataURL={blurUrls[0]}
  />
</div>
```
Or, if a minimum height below a certain breakpoint is required, use `min-h-[400px]` via Tailwind rather than an inline style, and ensure the outer wrapper also has `relative`.

---

### WR-03: `.env.example` is missing required email environment variables, creating a silent misconfiguration risk

**File:** `.env.example:1-5`

**Issue:** `.env.example` (the file committed to the repo that developers copy) only documents `NEXT_PUBLIC_SITE_URL` and has a commented-out `RESEND_API_KEY`. The variables `RECIPIENT_EMAIL` and `RESEND_FROM_ADDRESS` — both checked at runtime in the server actions and causing a user-facing error if absent — are only documented in `.env.local.example`. If a developer copies `.env.example` (the more conventional name), they will be missing three required variables and forms will silently fail at runtime without a clear indication of why.

**Fix:** Merge the two example files into one, or at minimum add the missing variables to `.env.example`:
```bash
# Public site URL — required for sitemap.ts and robots.ts
NEXT_PUBLIC_SITE_URL=https://byblendstrup.dk

# Resend API key — get from resend.com → API Keys
RESEND_API_KEY=re_...

# Owner email address — receives all inquiry notifications
RECIPIENT_EMAIL=owner@example.com

# Sender address — must be on a Resend-verified domain
# Use onboarding@resend.dev for local testing before DNS setup
RESEND_FROM_ADDRESS=onboarding@resend.dev
```

---

### WR-04: `pieceTitle` is read from the client `FormData` but never used — the verified title from Keystatic is used instead

**File:** `src/actions/purchase-inquiry.ts:35` and `src/lib/schemas/purchase-inquiry.ts:9`

**Issue:** `pieceTitle` is extracted from `FormData` at line 35, validated by the Zod schema as `z.string().optional()`, but the `buildPurchaseEmail` call on line 80 receives `verifiedPieceTitle` (re-fetched from Keystatic), never `result.data.pieceTitle`. This means the schema unnecessarily trusts and validates a client-supplied value that is then discarded. The dead validation is not harmful — it actually reflects the correct security intent — but it creates confusion: a reader might think `result.data.pieceTitle` is used somewhere or wonder why it is validated.

**Fix:** Either remove `pieceTitle` from the Zod schema and the `FormData` extraction entirely (since it is always overridden by the Keystatic re-fetch), or add a comment making the intent explicit:
```typescript
// pieceTitle from client is intentionally ignored — we re-verify via Keystatic
// (see verifiedPieceTitle below) to prevent subject-line spoofing
const raw = {
  name: formData.get("name"),
  email: formData.get("email"),
  message: formData.get("message"),
  pieceSlug: formData.get("pieceSlug") || undefined,
  // pieceTitle deliberately omitted — verified server-side via pieceSlug
}
```

---

## Info

### IN-01: Two TODO comments left in layout.tsx — should be tracked in planning, not in committed source

**File:** `src/app/layout.tsx:33-34`

**Issue:**
```typescript
//TODO Use video for hero section and make text/cta more clear
//TODO Add preview of selected item when making request for specific piece and add to email
```
These are product backlog items committed directly in source. For a production launch, they leave unclear whether these are pre-launch blockers or post-launch ideas.

**Fix:** Remove the comments and track as issues/tickets. The second TODO ("add preview of selected item to email") is particularly relevant given it aligns with WR-04 — the code intentionally discards `pieceTitle`, but the CMS guide's Task 4 implies the owner can see which piece was requested.

---

### IN-02: Duplicate type declaration in `gallery/[slug]/page.tsx`

**File:** `src/app/gallery/[slug]/page.tsx:9-13`

**Issue:** `WorkDetailPageProps` and `Props` are declared separately but are identical:
```typescript
interface WorkDetailPageProps {
  params: Promise<{ slug: string }>
}

type Props = { params: Promise<{ slug: string }> }
```
`Props` is used for `generateMetadata` and `WorkDetailPageProps` for the page function. They can be unified.

**Fix:**
```typescript
type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> { ... }
export default async function WorkDetailPage({ params }: PageProps) { ... }
```

---

### IN-03: Inline `style={{ minHeight: "400px" }}` should be a Tailwind class

**File:** `src/components/WorkDetail.tsx:38`

**Issue:** The project uses Tailwind exclusively for styling. An inline `style` prop is inconsistent with this convention and bypasses the design-token layer.

**Fix:** Replace with `className="relative w-full min-h-[400px]"` (or, preferably, address via WR-02 above by switching to an aspect-ratio-based layout which removes the need for this value entirely).

---

### IN-04: `docs/cms-guide.md` does not mention the About singleton or custom-orders page copy

**File:** `docs/cms-guide.md`

**Issue:** The guide covers Pieces (Task 1–2), Homepage curation (Task 3), and Site Settings (Task 4). It does not mention the About singleton (artist statement, studio photo, photo alt text) or the Custom Orders singleton (page copy). If the owner needs to update their bio or the custom-orders page intro, they have no guidance and may contact the developer unnecessarily — which violates the "no developer help for routine content updates" requirement from CLAUDE.md.

**Fix:** Add Task 5 — Editing the About page (photo, bio text, photo alt) and Task 6 — Editing Custom Orders page copy. Follow the same format as the existing tasks.

---

_Reviewed: 2026-04-22_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
