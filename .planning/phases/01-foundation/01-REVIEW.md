---
phase: 01-foundation
reviewed: 2026-04-18T00:00:00Z
depth: standard
files_reviewed: 24
files_reviewed_list:
  - .eslintrc.json
  - .gitignore
  - .prettierrc
  - messages/da.json
  - messages/en.json
  - next.config.ts
  - package.json
  - postcss.config.mjs
  - src/app/[locale]/layout.tsx
  - src/app/[locale]/page.tsx
  - src/app/globals.css
  - src/app/layout.tsx
  - src/app/page.tsx
  - src/components/LanguageToggle.tsx
  - src/components/SiteFooter.tsx
  - src/components/SiteHeader.tsx
  - src/i18n/navigation.ts
  - src/i18n/request.ts
  - src/i18n/routing.ts
  - src/middleware.ts
  - tsconfig.json
  - keystatic.config.ts
  - src/app/keystatic/layout.tsx
  - src/app/keystatic/[[...params]]/page.tsx
  - src/app/api/keystatic/[...params]/route.ts
findings:
  critical: 1
  warning: 3
  info: 2
  total: 6
status: issues_found
---

# Phase 01: Code Review Report

**Reviewed:** 2026-04-18
**Depth:** standard
**Files Reviewed:** 24
**Status:** issues_found

## Summary

The foundation phase establishes the Next.js + next-intl + Keystatic + Tailwind v4 scaffolding. The overall structure is clean and well-considered: strict TypeScript, locale validation, correct Keystatic runtime directives, and a sensible middleware matcher. One critical runtime crash path exists in the Keystatic GitHub-storage configuration. Three warnings cover a Tailwind v4 compatibility issue with `theme()` in arbitrary values, a locale validation type that will drift as locales are added, and a skip-link that bypasses the translation system it should use. Two info items round out the report.

## Critical Issues

### CR-01: Non-null assertions on required env vars produce silent undefined in GitHub storage mode

**File:** `keystatic.config.ts:9-10`
**Issue:** `process.env.GITHUB_REPO_OWNER!` and `process.env.GITHUB_REPO_NAME!` use TypeScript non-null assertions. TypeScript strips these at compile time — at runtime, if either variable is unset, the value is `undefined`, which Keystatic will silently receive as the repo owner/name. The result is a confusing "repo not found" or authentication error rather than a clear "missing configuration" message. This only triggers when `KEYSTATIC_STORAGE_KIND=github`, which is the production path.

**Fix:**
```typescript
// keystatic.config.ts
const githubRepoOwner = process.env.GITHUB_REPO_OWNER;
const githubRepoName = process.env.GITHUB_REPO_NAME;

if (process.env.KEYSTATIC_STORAGE_KIND === "github") {
  if (!githubRepoOwner || !githubRepoName) {
    throw new Error(
      "GITHUB_REPO_OWNER and GITHUB_REPO_NAME must be set when KEYSTATIC_STORAGE_KIND=github"
    );
  }
}

const storage =
  process.env.KEYSTATIC_STORAGE_KIND === "github"
    ? ({
        kind: "github",
        repo: {
          owner: githubRepoOwner!,
          name: githubRepoName!,
        },
      } as const)
    : ({ kind: "local" } as const);
```

## Warnings

### WR-01: `theme()` function in arbitrary value may not resolve in Tailwind v4

**File:** `src/app/[locale]/page.tsx:7`
**Issue:** The class `min-h-[calc(100vh-64px-theme(spacing.48))]` uses `theme()` inside an arbitrary value. In Tailwind v4, `theme()` inside arbitrary value brackets is not supported in the same way as v3 — the Oxide engine resolves design tokens via CSS variables (`var(--spacing-48)`), not the `theme()` CSS function in arbitrary bracket syntax. If this does not resolve, the `calc()` produces `calc(100vh - 64px - theme(spacing.48))` verbatim in CSS, which is invalid, and the element collapses to `min-h-[0]` or inherits incorrectly.

**Fix:**
```tsx
// Use a CSS variable reference instead of theme()
<div className="min-h-[calc(100vh-64px-var(--spacing-48))] flex flex-col items-center justify-center px-6 py-24">
```
Alternatively, define the header height as a CSS variable in `globals.css` (e.g., `--header-height: 64px`) and reference it directly, which is more maintainable.

### WR-02: Locale validation uses a stale type cast rather than the canonical `Locale` type

**File:** `src/app/[locale]/layout.tsx:35`
**Issue:** `routing.locales.includes(locale as "da" | "en")` uses a hard-coded union cast. The file already imports `routing` from `@/i18n/routing`, and `routing.ts` exports the `Locale` type derived from `routing.locales`. If a third locale is added to `routing.locales`, this cast remains `"da" | "en"` and TypeScript will not flag the mismatch, meaning the validation check and the cast diverge silently.

**Fix:**
```tsx
// src/app/[locale]/layout.tsx
import { routing, type Locale } from "@/i18n/routing";

// ...
if (!routing.locales.includes(locale as Locale)) {
  notFound();
}
```

### WR-03: Skip link text bypasses the translation system

**File:** `src/app/[locale]/layout.tsx:50`
**Issue:** The skip link renders `locale === "da" ? "Spring til indhold" : "Skip to content"` inline. Both `messages/da.json` and `messages/en.json` already define `navigation.skipToContent` for exactly this string. The inline ternary duplicates the translation, meaning a content editor cannot update it via Keystatic, and a future locale addition requires a code change rather than a message file addition.

The layout is a server component with `getMessages()` already called, so `useTranslations` is unavailable here, but the translation can be accessed via the `messages` object that is already fetched.

**Fix:**
```tsx
// After: const messages = await getMessages();
// Access the nested key directly from the messages object:
const skipLabel =
  (messages as Record<string, Record<string, string>>)?.navigation
    ?.skipToContent ?? (locale === "da" ? "Spring til indhold" : "Skip to content");

// Then in JSX:
<a href="#main-content" className="...">
  {skipLabel}
</a>
```

Or, if the layout is refactored to use `setRequestLocale` + `getTranslations` (the server-side equivalent of `useTranslations`):
```tsx
import { getTranslations } from "next-intl/server";
// ...
const t = await getTranslations("navigation");
// ...
<a href="#main-content" className="...">
  {t("skipToContent")}
</a>
```
The second approach is cleaner and is the idiomatic next-intl server-side pattern.

## Info

### IN-01: `SiteHeader` calls `useTranslations()` with no namespace, loading the full message tree

**File:** `src/components/SiteHeader.tsx:5`
**Issue:** `useTranslations()` without a namespace argument loads every message key from the current locale's message file. Currently the file is tiny, but as message files grow this passes the entire object through the client bundle when this component is used in a client context. The component is currently a server component, so it is not a runtime issue today, but if it ever gains interactivity and a `"use client"` directive is added, the full message tree would be bundled.

**Fix:** Scope the namespace:
```tsx
const t = useTranslations("site");
// then use t("name") instead of t("site.name")
```

### IN-02: `src/app/page.tsx` root page returns `null` with no redirect

**File:** `src/app/page.tsx:2`
**Issue:** The root page (`/`) returns `null`. Middleware should redirect `/` to `/da` (the default locale), but if middleware is bypassed or the matcher excludes this path (e.g., a future misconfiguration), the user sees a blank page with no error. A defensive redirect keeps the behavior correct regardless of middleware state.

**Fix:**
```tsx
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/da");
}
```
This is a belt-and-suspenders measure; the middleware already handles this in normal operation.

---

_Reviewed: 2026-04-18_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
