---
phase: 02-content-model-cms-ux
reviewed: 2026-04-19T00:00:00Z
depth: standard
files_reviewed: 20
files_reviewed_list:
  - keystatic.config.ts
  - messages/en.json
  - messages/da.json
  - package.json
  - vitest.config.ts
  - src/__tests__/keystatic-schema.test.ts
  - src/__tests__/i18n-fields.test.ts
  - biome.json
  - src/components/LanguageToggle.tsx
  - src/components/SiteHeader.tsx
  - src/components/SiteFooter.tsx
  - src/app/[locale]/layout.tsx
  - src/app/[locale]/page.tsx
  - src/app/keystatic/[[...params]]/keystatic.tsx
  - src/app/keystatic/[[...params]]/page.tsx
  - src/app/keystatic/layout.tsx
  - src/middleware.ts
  - src/i18n/request.ts
  - src/i18n/routing.ts
  - src/i18n/navigation.ts
findings:
  critical: 0
  warning: 4
  info: 4
  total: 8
status: issues_found
---

# Phase 02: Code Review Report

**Reviewed:** 2026-04-19
**Depth:** standard
**Files Reviewed:** 20
**Status:** issues_found

## Summary

Phase 2 delivers the Keystatic schema (works, categories, homepage, settings), vitest test stubs, and expanded i18n message keys. The foundation wiring (middleware, routing, layout, i18n request handler) from Phase 1 is also in scope.

The overall quality is good. The schema is well-structured with clear CMS copy, the middleware regex correctly excludes Keystatic routes, and the locale validation in the layout guards against arbitrary locale injection. No critical security issues were found.

Four warnings require attention before the next phase builds on top of this layer, as two of them could produce runtime errors (missing `generateStaticParams` on locale routes will default to dynamic rendering, and the Biome lint gap means config files go unchecked). Four info-level items are cleanup and consistency suggestions.

## Warnings

### WR-01: `generateStaticParams` not exported from locale layout or page

**File:** `src/app/[locale]/layout.tsx` (entire file)

**Issue:** The `[locale]` dynamic segment has no `generateStaticParams` export. Without it, Next.js defaults to dynamic server rendering for all locale routes. CLAUDE.md explicitly requires "Keep the site statically rendered (`generateStaticParams`) wherever possible." For a two-locale site with a finite set of locales this is a trivial addition and is the stated architecture goal.

**Fix:**
```ts
// Add to src/app/[locale]/layout.tsx (or src/app/[locale]/page.tsx)
import { routing } from "@/i18n/routing"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
```

---

### WR-02: Biome `files.include` excludes root-level source files from linting

**File:** `biome.json:9`

**Issue:** `"include": ["src/**/*", "!src/paraglide"]` means `keystatic.config.ts`, `vitest.config.ts`, and any future root-level `.ts` files are silently skipped by `biome lint .` and `biome check --apply .`. Lint errors (unused imports, bad formatting, rule violations) in these files will not be caught by CI.

**Fix:**
```json
"files": {
  "include": [
    "src/**/*",
    "!src/paraglide",
    "keystatic.config.ts",
    "vitest.config.ts",
    "next.config.*",
    "tailwind.config.*"
  ]
}
```
Alternatively, remove `include` entirely and use `ignore` for generated directories — Biome defaults to processing all project files when no include filter is set.

---

### WR-03: Vitest has no path alias resolution — `@/` imports will fail in future tests

**File:** `vitest.config.ts:1-8`

**Issue:** The vitest config sets `environment: 'node'` but does not configure TypeScript path aliases. Source files (including `LanguageToggle`, `SiteHeader`, etc.) import from `@/components/...`, `@/i18n/...`, etc. As soon as any test imports a source module that itself uses `@/` aliases, vitest will throw a module resolution error at runtime. The current test files use only relative imports and avoid this, but the gap will silently bite future tests.

**Fix:**
```ts
import { defineConfig } from "vitest/config"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    include: ["src/__tests__/**/*.test.ts"],
  },
})
```
Add `vite-tsconfig-paths` as a dev dependency: `pnpm add -D vite-tsconfig-paths`.

---

### WR-04: `settings` singleton `siteTitle` can be saved empty despite `length.min: 1`

**File:** `keystatic.config.ts:212-218`

**Issue:** The `siteTitle` field has `validation: { length: { min: 1, max: 60 } }` but no `isRequired: true`. In Keystatic, `length.min` controls character count on a non-empty value but does not mark the field as required — a user can leave the field completely blank and save, producing an empty or `undefined` site title. This field is the SEO title for the entire site and should be required.

**Fix:**
```ts
siteTitle: fields.text({
  label: "Site Title",
  description: "The name that appears in browser tabs and search results.",
  defaultValue: "By Blendstrup",
  validation: { isRequired: true, length: { min: 1, max: 60 } },
}),
```

---

## Info

### IN-01: `SiteFooter` hardcodes brand name instead of using `site.name` message key

**File:** `src/components/SiteFooter.tsx:5`

**Issue:** The footer renders the literal string `"By Blendstrup"` while `messages/en.json` and `messages/da.json` both have `site.name` for exactly this purpose. `SiteHeader` uses `t("site.name")` correctly. If the brand name is ever changed in messages it will not update in the footer.

**Fix:**
```tsx
import { useTranslations } from "next-intl"

export default function SiteFooter() {
  const t = useTranslations()
  return (
    <footer className="bg-ink-surface px-12 py-12 lg:px-16 lg:py-16">
      <div className="mx-auto max-w-screen-xl">
        <p className="font-normal text-linen/80 text-sm">{t("site.name")}</p>
      </div>
    </footer>
  )
}
```

---

### IN-02: Schema description vs. validation mismatch on `heroWorks`

**File:** `keystatic.config.ts:170-176`

**Issue:** The `heroWorks` field description says "Choose 1–3 pieces" but the validation is `{ length: { min: 0, max: 3 } }` (min zero). The owner is told they must choose at least one, but the schema allows saving with none. This is not a runtime crash (the homepage component must handle zero hero works anyway), but it creates misleading CMS copy that could confuse the owner.

**Fix:** Either update the description to "Choose up to 3 pieces" (reflecting that zero is valid and intentional), or change the validation to `{ length: { min: 1, max: 3 } }` if at least one hero piece is actually required for the page to render correctly.

---

### IN-03: `i18n-fields.test.ts` uses an overly loose type cast that masks structural mismatches

**File:** `src/__tests__/i18n-fields.test.ts:5`

**Issue:** The `Messages` type `Record<string, Record<string, Record<string, string>>>` enforces exactly three nesting levels everywhere. The actual message files have mixed depths (e.g., `placeholder.heading` is two levels deep). The test relies on `as unknown as Messages` double-casting to suppress TypeScript's structural check, which means structural regressions (a key moved from depth 3 to depth 2, or a namespace removed) would still satisfy the type and the test would produce a runtime `undefined` rather than a compile-time error.

**Fix:** Use the imported JSON directly with its inferred type (TypeScript resolves JSON imports to their exact literal type):
```ts
import da from "../../messages/da.json"
import en from "../../messages/en.json"

it("has shop.saleStatus.available", () => {
  expect(en.shop.saleStatus.available).toBeDefined()
})
```
No cast needed — TypeScript will error at compile time if the key path does not exist.

---

### IN-04: `@keystatic/next` version (`^5.0.4`) appears mismatched with `@keystatic/core` (`^0.5.50`)

**File:** `package.json:19`

**Issue:** `@keystatic/next` is at major version 5 while `@keystatic/core` is at 0.5.x. While this may reflect Keystatic's historical versioning divergence, it is worth verifying that the installed combination is tested and supported. A breaking compatibility gap between the two packages would cause silent failures in the Admin UI or Reader API. Confirm via `pnpm ls @keystatic/core @keystatic/next` that the installed versions are compatible per Keystatic's release notes.

**Fix:** Verify peerDependency compatibility. If `@keystatic/next@5` requires a specific `@keystatic/core` range, align the range in `package.json`. No code change needed if the combination is confirmed supported.

---

_Reviewed: 2026-04-19_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
