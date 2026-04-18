---
phase: 01-foundation
fixed_at: 2026-04-18T00:00:00Z
review_path: .planning/phases/01-foundation/01-REVIEW.md
iteration: 1
findings_in_scope: 4
fixed: 4
skipped: 0
status: all_fixed
---

# Phase 01: Code Review Fix Report

**Fixed at:** 2026-04-18
**Source review:** .planning/phases/01-foundation/01-REVIEW.md
**Iteration:** 1

**Summary:**
- Findings in scope: 4 (1 Critical, 3 Warnings)
- Fixed: 4
- Skipped: 0

## Fixed Issues

### CR-01: Non-null assertions on required env vars produce silent undefined in GitHub storage mode

**Files modified:** `keystatic.config.ts`
**Commit:** 6d62133
**Applied fix:** Extracted env vars into named variables, added a guard that throws a descriptive `Error` when `KEYSTATIC_STORAGE_KIND=github` but either variable is unset, then retained `!` assertions in the storage literal (safe because the guard above already verified they are non-null).

### WR-01: `theme()` function in arbitrary value may not resolve in Tailwind v4

**Files modified:** `src/app/[locale]/page.tsx`
**Commit:** 6567f54
**Applied fix:** Replaced `theme(spacing.48)` with `var(--spacing-48)` in the `min-h-[calc(...)]` arbitrary value class, which is the correct Tailwind v4 Oxide-engine CSS variable reference.

### WR-02: Locale validation uses a stale type cast rather than the canonical `Locale` type

**Files modified:** `src/app/[locale]/layout.tsx`
**Commit:** 30e17e8
**Applied fix:** Added `type Locale` to the existing `@/i18n/routing` import and changed `locale as "da" | "en"` to `locale as Locale` so the cast stays in sync automatically when locales are added to routing config.

### WR-03: Skip link text bypasses the translation system

**Files modified:** `src/app/[locale]/layout.tsx`
**Commit:** 30e17e8
**Applied fix:** Added `getTranslations` to the `next-intl/server` import, called `await getTranslations("navigation")` after `getMessages()`, and replaced the inline `locale === "da" ? "Spring til indhold" : "Skip to content"` ternary with `{t("skipToContent")}`. Uses the idiomatic next-intl server-side pattern as recommended by the reviewer.

---

_Fixed: 2026-04-18_
_Fixer: Claude (gsd-code-fixer)_
_Iteration: 1_
