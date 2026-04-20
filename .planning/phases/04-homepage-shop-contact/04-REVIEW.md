---
phase: 04-homepage-shop-contact
reviewed: 2026-04-20T00:00:00Z
depth: standard
files_reviewed: 11
files_reviewed_list:
  - src/components/NavLinks.tsx
  - src/components/StatusBadge.tsx
  - src/i18n/navigation.ts
  - src/components/ShopCard.tsx
  - src/app/[locale]/page.tsx
  - src/app/[locale]/contact/page.tsx
  - src/components/SiteHeader.tsx
  - messages/en.json
  - messages/da.json
  - src/__tests__/shop-filter.test.ts
  - src/__tests__/i18n-fields.test.ts
findings:
  critical: 0
  warning: 5
  info: 4
  total: 9
status: issues_found
---

# Phase 04: Code Review Report

**Reviewed:** 2026-04-20
**Depth:** standard
**Files Reviewed:** 11
**Status:** issues_found

## Summary

Reviewed all eleven files changed during Phase 04 (homepage, shop preview, contact page, NavLinks refactor, i18n messages, and tests). The overall implementation is solid: RSC data fetching patterns are correct, locale validation in the layout is good, and the i18n test coverage is well-structured. No critical security vulnerabilities were found.

Five warnings require attention before the phase is considered production-ready:

- `SiteHeader` uses a client-hooks import (`useTranslations`) in an RSC — this works today but is inconsistent with the rest of the codebase and fragile under future compilation changes.
- The layout wraps children in `<main>` while both page files also render `<main>`, producing nested `<main>` elements — an HTML validity and accessibility violation.
- `ShopCard` accepts `labels.sold` / `labels.forSale` props that are never consumed, suggesting `StatusBadge` was accidentally left out of the shop-preview card.
- The `locale` prop on `ShopCard` is typed `string` rather than the narrower `"da" | "en"` union, losing type-safety.
- The about-text paragraph key is derived from the first 40 chars of text content, which is fragile and will produce React key warnings if two paragraphs share an identical opening.

---

## Warnings

### WR-01: `ShopCard` passes `labels.sold` / `labels.forSale` that are never used — sold items are indistinguishable from available ones

**File:** `src/components/ShopCard.tsx:17-19` and `src/app/[locale]/page.tsx:142-145`

**Issue:** `ShopCard` declares `labels.sold` and `labels.forSale` in its props interface and the homepage passes both values, but the component body never reads them — `labels.contactToBuy` is the only label actually rendered (lines 68, 79). There is no `StatusBadge` rendered inside `ShopCard`. As a result, a `saleStatus: "sold"` work in the shop preview shows no sold indicator and still displays the "Contact to buy" CTA, which is actively misleading to a visitor.

Compare `WorkCard.tsx` (line 46) which correctly renders `<StatusBadge status={entry.saleStatus} labels={labels} />`. The same component was almost certainly intended here.

**Fix:** Render `StatusBadge` in the card's image area (positioning it at `top-2 left-2` matches `StatusBadge`'s own absolute positioning), then conditionally suppress the CTA links when `saleStatus === "sold"`:

```tsx
// ShopCard.tsx — inside <div className="relative aspect-[4/5]">
// Add after the Image / placeholder block:
<StatusBadge status={entry.saleStatus} labels={labels} />

// Conditionally render CTAs only when item is available:
{entry.saleStatus === "available" && (
  <>
    {/* Desktop hover CTA */}
    <div className="absolute inset-0 hidden ...">
      <Link href="/contact" ...>{labels.contactToBuy}</Link>
    </div>
    {/* Mobile CTA */}
    <div className="sm:hidden">
      <Link href="/contact" ...>{labels.contactToBuy}</Link>
    </div>
  </>
)}
```

Also add the import at the top of `ShopCard.tsx`:
```tsx
import { StatusBadge } from "./StatusBadge"
```

---

### WR-02: Nested `<main>` elements — layout and both page files each render `<main>`

**File:** `src/app/[locale]/layout.tsx:37`, `src/app/[locale]/page.tsx:56`, `src/app/[locale]/contact/page.tsx:55`

**Issue:** `LocaleLayout` renders `<main id="main-content" className="min-h-screen">{children}</main>`. Both `HomePage` and `ContactPage` then return their own `<main>` element as their root, producing `<main><main>...</main></main>` in the final HTML. The `<main>` landmark must appear exactly once per page per ARIA spec; screen readers (NVDA, VoiceOver) expose it as the "main region" and the nesting breaks landmark navigation.

**Fix:** Change `layout.tsx` to use a `<div>` wrapper and keep the single `<main>` inside each page component (which already exists and is more semantically correct since each page controls its own content boundary):

```tsx
// layout.tsx — replace the <main> wrapper:
<div id="main-content" className="min-h-screen">
  {children}
</div>
```

No changes needed to `page.tsx` or `contact/page.tsx` — they already use `<main>` correctly.

---

### WR-03: `SiteHeader` (RSC) imports and calls `useTranslations` — a client-side hook

**File:** `src/components/SiteHeader.tsx:2,7`

**Issue:** `SiteHeader` has no `"use client"` directive, making it an RSC. It imports `useTranslations` from `next-intl` (line 2) and calls it on line 7. While `next-intl` v3 does support calling `useTranslations` in RSCs as a compatibility bridge, this is non-standard: the `use` prefix conventionally means React hook (client only). All other server components in the codebase correctly use `getTranslations` (async). If a future next-intl version enforces the RSC / client boundary more strictly, this will silently break. It also bypasses the async data-fetching pattern that makes RSC translations type-safe.

**Fix:** Convert to the standard RSC pattern:

```tsx
// SiteHeader.tsx
import { getTranslations } from "next-intl/server"
// remove: import { useTranslations } from "next-intl"

export default async function SiteHeader() {
  const t = await getTranslations("site")
  // ...
  {t("name")}
```

This also means the namespace can be narrowed from the top-level (no namespace) to `"site"`, making the call to `t("name")` instead of `t("site.name")`.

---

### WR-04: `ShopCard` `locale` prop typed as `string` rather than `"da" | "en"`

**File:** `src/components/ShopCard.tsx:16`

**Issue:** The `locale` prop is typed `string`. The locale selection on line 25 (`locale === "da" ? entry.titleDa : entry.titleEn`) silently falls through to English for any unexpected locale value. Because `routing.ts` defines `Locale = "da" | "en"`, this type is already available and should be used here so TypeScript can catch mismatches at call sites.

**Fix:**
```tsx
// ShopCard.tsx
import type { Locale } from "@/i18n/routing"

interface ShopCardProps {
  slug: string
  entry: ShopCardEntry
  locale: Locale          // was: locale: string
  labels: { ... }
}
```

The same pattern applies to `WorkCard.tsx` (not in review scope, but should be updated for consistency).

---

### WR-05: About-text paragraph React key derived from text content is fragile

**File:** `src/app/[locale]/page.tsx:192-198`

**Issue:** The key for each paragraph element is `paragraph.slice(0, 40)` (line 192). If the CMS content has two paragraphs that start with the same 40 characters (e.g. two sentences beginning "I work from a small studio in Copenhagen"), React will emit a duplicate-key warning and may incorrectly reuse DOM nodes during reconciliation.

**Fix:** Use the paragraph index instead — it is stable within a single render:

```tsx
.map((paragraph, index) => (
  <p
    key={index}
    className="..."
  >
    {paragraph}
  </p>
))
```

Index-based keys are appropriate here because the list is purely display-only (no reorder, no user interaction with individual items).

---

## Info

### IN-01: `labels.sold` and `labels.forSale` are dead parameters in `ShopCard` interface

**File:** `src/components/ShopCard.tsx:18-19`

**Issue:** Even if `StatusBadge` is intentionally excluded from `ShopCard` (design decision: CTA-only card without a status badge), the `sold` and `forSale` entries in the `labels` prop interface are unused. The parent page (and any future caller) passes them unnecessarily.

**Fix:** If `StatusBadge` is intentionally absent, remove the dead fields from both the interface and the call site:

```tsx
// ShopCard.tsx
labels: {
  contactToBuy: string
  // remove: sold: string
  // remove: forSale: string
}

// page.tsx — remove the two unused labels:
labels={{
  contactToBuy: tShop("card.contactToBuy"),
}}
```

---

### IN-02: `SiteHeader` calls `useTranslations()` without a namespace — reduces type safety

**File:** `src/components/SiteHeader.tsx:7`

**Issue:** `useTranslations()` is called without a namespace argument, making `t("site.name")` a dynamic dot-path lookup that TypeScript cannot fully validate against the message schema. All other call sites in the codebase pass an explicit namespace (e.g. `useTranslations("navigation")`).

**Fix:** Pass `"site"` as the namespace and update the key:
```tsx
const t = useTranslations("site")
// ...
{t("name")}
```

(This is a corollary fix to WR-03 — both are resolved together by converting to `getTranslations("site")`.)

---

### IN-03: `i18n-fields.test.ts` does not verify `home.hero.headline` or `home.hero.cta` keys

**File:** `src/__tests__/i18n-fields.test.ts:87-109`

**Issue:** The Phase 4 key checklist (lines 87–109) includes `home.hero.scrollIndicator` but omits `home.hero.headline` and `home.hero.cta`, which are equally required by `page.tsx` (lines 79, 85). A future CMS editor accidentally removing those keys would go undetected.

**Fix:** Add both keys to the `phase4Keys` array:
```ts
const phase4Keys = [
  // existing keys ...
  "home.hero.headline",
  "home.hero.cta",
  "home.hero.scrollIndicator",
  // ...
]
```

---

### IN-04: `instagramHandle` CMS value used directly in `href` without URL-character validation

**File:** `src/app/[locale]/contact/page.tsx:107`

**Issue:** `href={`https://instagram.com/${instagramHandle}`}` is constructed directly from the CMS value. Instagram handles are constrained to alphanumeric + underscore + period by Instagram's own rules, and the value comes from the owner's own CMS (not user input), so exploitability is very low. However, a handle containing URL path characters (`/`, `?`, `#`) would silently produce a malformed or unintended URL.

**Fix:** Add a lightweight guard before rendering the link, or strip unexpected characters:
```ts
const safeHandle = instagramHandle.replace(/[^a-zA-Z0-9_.]/g, "")
// then use safeHandle in the href
```

Alternatively add a `validation` pattern to the Keystatic `instagramHandle` field in `keystatic.config.ts`.

---

_Reviewed: 2026-04-20_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
