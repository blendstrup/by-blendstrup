---
phase: 01-foundation
verified: 2026-04-18T10:20:20Z
status: human_needed
score: 3/4 must-haves verified
overrides_applied: 0
human_verification:
  - test: "Owner completes Keystatic Cloud setup and proves GitHub deploy loop end-to-end"
    expected: "Owner edits siteTitle in Keystatic admin on the deployed Vercel URL, a GitHub commit appears within 30 seconds, and Vercel redeploys within ~2 minutes"
    why_human: "Requires owner to create a Keystatic Cloud project, configure Vercel env vars (KEYSTATIC_GITHUB_CLIENT_ID, KEYSTATIC_GITHUB_CLIENT_SECRET, KEYSTATIC_SECRET, KEYSTATIC_STORAGE_KIND=github), and manually verify the live deploy cycle. Cannot be verified programmatically."
---

# Phase 1: Foundation Verification Report

**Phase Goal:** Establish the technical substrate — Next.js App Router, Tailwind design tokens, next-intl bilingual routing, Keystatic admin skeleton, and a proven Keystatic → GitHub → Vercel deploy loop — so every subsequent phase builds on locked-in conventions.
**Verified:** 2026-04-18T10:20:20Z
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths (Roadmap Success Criteria)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Visitor can load `/da` and `/en` routes and see a locale-aware placeholder page | ✓ VERIFIED | `src/app/[locale]/page.tsx` renders t("placeholder.heading") — "Coming soon" for /en, "Kommer snart" for /da, wired via NextIntlClientProvider in locale layout |
| 2 | Visitor can toggle language from a header control and the URL path updates to the matching locale | ✓ VERIFIED | `LanguageToggle.tsx` uses `useRouter` + `useLocale` from `@/i18n/navigation` (next-intl typed helpers), calls `router.push(pathname, { locale: nextLocale })` on button click; SiteHeader wires it at `sticky top-0` header |
| 3 | Owner can edit a test content entry in Keystatic, commit to GitHub, and see the change deployed on Vercel within one cycle | ? HUMAN NEEDED | Code path is complete (keystatic.config.ts has GitHub storage mode controlled by `KEYSTATIC_STORAGE_KIND=github`), but the end-to-end deploy loop requires owner to create Keystatic Cloud project, set Vercel env vars, and manually verify a live cycle. Local admin verified by owner; GitHub loop not yet proven. |
| 4 | Site renders a minimal Japandi-leaning shell (typography scale, muted palette tokens, spacing tokens) applied via Tailwind | ✓ VERIFIED | `globals.css` @theme block declares all 8 color tokens and 8 spacing tokens verbatim from UI-SPEC; Fraunces + DM Sans wired via next/font with CSS variable names matching @theme tokens; layout uses `bg-linen text-ink font-sans antialiased` |

**Score:** 3/4 truths verified (1 requires human)

### Plan-Level Must-Have Truths

**Plan 01 (Scaffold + Design Tokens)**

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Next.js 15 project builds without errors | ✓ VERIFIED | Commit log shows `npm run build exits 0`; package.json has `"next": "^15.5.15"` |
| 2 | TypeScript strict mode is active | ✓ VERIFIED | tsconfig.json: `"strict": true`, `"noUncheckedIndexedAccess": true` |
| 3 | Fraunces and DM Sans fonts self-hosted via next/font | ✓ VERIFIED | `src/app/[locale]/layout.tsx` imports both from `"next/font/google"` with `variable: "--font-serif"` and `variable: "--font-sans"` |
| 4 | Tailwind v4 @theme block declares all 8 colors and 8 spacing tokens verbatim from UI-SPEC | ✓ VERIFIED | globals.css contains all 8 colors (linen, oat, clay, stone, ink, terracotta, fault, ink-surface) and all 8 spacing tokens (xs through 4xl) |
| 5 | Default Tailwind palette not accessible | ✓ VERIFIED | No `tailwind.config.ts` or `tailwind.config.js` exists; grep for `blue-500/red-400/green-600` returns empty |
| 6 | ESLint and Prettier run clean | ✓ VERIFIED | `.eslintrc.json` extends `next/core-web-vitals` + `next/typescript`; `.prettierrc` with `prettier-plugin-tailwindcss`; SUMMARY confirms clean run |

**Plan 02 (i18n Routing + Layout Shell)**

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Visiting / redirects to /da or /en based on Accept-Language | ✓ VERIFIED | `src/middleware.ts` uses `createMiddleware(routing)` with `localeDetection: true` in routing config |
| 2 | Visiting /da loads Danish placeholder page with 'Kommer snart' heading | ✓ VERIFIED | `messages/da.json` has `"heading": "Kommer snart"`; page.tsx renders `t("heading")` |
| 3 | Visiting /en loads English placeholder page with 'Coming soon' heading | ✓ VERIFIED | `messages/en.json` has `"heading": "Coming soon"` |
| 4 | Language toggle shows DA | EN with active locale in terracotta | ✓ VERIFIED | LanguageToggle.tsx renders buttons with `text-terracotta font-medium` for active, `text-stone font-normal hover:underline` for inactive |
| 5 | Clicking inactive locale navigates to matching /locale path | ✓ VERIFIED | `router.push(pathname, { locale: nextLocale })` in switchLocale function |
| 6 | Skip link is the first focusable element and links to #main-content | ✓ VERIFIED | locale layout renders `<a href="#main-content" className="sr-only focus-visible:not-sr-only ...">` as first child inside NextIntlClientProvider, before SiteHeader |
| 7 | Layout shell: 64px sticky oat header, ink-surface footer, 1280px max content width | ✓ VERIFIED | SiteHeader: `sticky top-0 h-16 bg-oat`, `max-w-screen-xl mx-auto`; SiteFooter: `bg-ink-surface`; `max-w-screen-xl` = 1280px |
| 8 | Focus ring: 2px solid terracotta, focus-visible only | ✓ VERIFIED | globals.css: `*:focus-visible { outline: 2px solid var(--color-terracotta); outline-offset: 2px; }` |

**Plan 03 (Keystatic CMS)**

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Keystatic admin UI accessible at /keystatic in local dev | ✓ VERIFIED | SUMMARY confirms owner verified local admin; `src/app/keystatic/layout.tsx` + `[[...params]]/page.tsx` exist with Node.js runtime |
| 2 | Keystatic config defines 'settings' singleton with siteTitle field | ✓ VERIFIED | keystatic.config.ts: `settings: singleton({ schema: { siteTitle: fields.text(...) } })` |
| 3 | Editing siteTitle creates/updates content/settings.yaml | ? HUMAN NEEDED | SUMMARY confirms owner verified this locally. `content/` directory not present in repo yet (no edit has been committed). Code path correct: `path: "content/settings"`, `format: { data: "yaml" }` |
| 4 | In production (KEYSTATIC_STORAGE_KIND=github), admin uses GitHub storage | ? HUMAN NEEDED | Code path verified: `process.env.KEYSTATIC_STORAGE_KIND === "github"` switches to GitHub storage mode with repo config. Not yet proven live. |
| 5 | /keystatic route uses Node.js runtime | ✓ VERIFIED | `src/app/keystatic/layout.tsx`: `export const runtime = "nodejs"` |
| 6 | /keystatic route NOT behind auth middleware | ✓ VERIFIED | `src/middleware.ts` matcher excludes `keystatic` and `api/keystatic` paths |
| 7 | .env.local.example documents all required env vars | ✓ VERIFIED | .env.local.example documents KEYSTATIC_STORAGE_KIND, KEYSTATIC_GITHUB_CLIENT_ID, KEYSTATIC_GITHUB_CLIENT_SECRET, KEYSTATIC_SECRET, GITHUB_REPO_OWNER, GITHUB_REPO_NAME |

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `package.json` | Project manifest with all required dependencies | ✓ VERIFIED | next@15.5.15, next-intl@4.9.1, @keystatic/core@0.5.50, @keystatic/next@5.0.4, tailwindcss@4.2.2 |
| `tsconfig.json` | TypeScript strict config | ✓ VERIFIED | strict: true, noUncheckedIndexedAccess: true |
| `next.config.ts` | Next.js 15 App Router config with next-intl plugin | ✓ VERIFIED | withNextIntl wrapping nextConfig, points to src/i18n/request.ts |
| `src/app/globals.css` | Tailwind v4 @import + @theme block with all tokens | ✓ VERIFIED | All 8 colors, 8 spacing tokens, font tokens, focus ring rules |
| `src/app/layout.tsx` | Root layout (passthrough) with globals.css import | ✓ VERIFIED | Imports globals.css, returns children as passthrough |
| `src/middleware.ts` | next-intl middleware, localeDetection: true, locales: [da, en] | ✓ VERIFIED | createMiddleware(routing), matcher excludes keystatic/api paths |
| `src/i18n/routing.ts` | next-intl routing config | ✓ VERIFIED | defineRouting with locales: ["da","en"], defaultLocale: "da", localeDetection: true |
| `messages/da.json` | Danish UI strings | ✓ VERIFIED | "Kommer snart", "Spring til indhold", "Dansk"/"English" toggle labels |
| `messages/en.json` | English UI strings | ✓ VERIFIED | "Coming soon", "Skip to content", "Dansk"/"English" toggle labels |
| `src/app/[locale]/layout.tsx` | Locale layout with NextIntlClientProvider, html lang, font variables | ✓ VERIFIED | lang={locale}, font variables on html element, NextIntlClientProvider, skip link, SiteHeader/SiteFooter |
| `src/app/[locale]/page.tsx` | Placeholder page with locale-aware heading | ✓ VERIFIED | useTranslations("placeholder"), renders t("heading") and t("body") |
| `src/components/LanguageToggle.tsx` | DA | EN toggle client component | ✓ VERIFIED | "use client", useLocale + useRouter from @/i18n/navigation, router.push on click |
| `src/components/SiteHeader.tsx` | Sticky 64px header | ✓ VERIFIED | sticky top-0 h-16 bg-oat, max-w-screen-xl, renders LanguageToggle |
| `src/components/SiteFooter.tsx` | ink-surface footer | ✓ VERIFIED | bg-ink-surface, text-linen/80 |
| `keystatic.config.ts` | Keystatic config with storage switching + settings singleton | ✓ VERIFIED | env-based storage, settings singleton with siteTitle field |
| `src/app/keystatic/layout.tsx` | Keystatic layout with Node.js runtime | ✓ VERIFIED | export const runtime = "nodejs", html/body shell |
| `src/app/keystatic/[[...params]]/page.tsx` | Keystatic Admin UI catch-all page | ✓ VERIFIED | Imports KeystaticApp from ./keystatic |
| `src/app/api/keystatic/[...params]/route.ts` | Keystatic API route handler | ✓ VERIFIED | export const runtime = "nodejs", makeRouteHandler from @keystatic/next/route-handler |
| `.env.local.example` | Env var documentation | ✓ VERIFIED | All 6 required vars documented |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/app/globals.css` | `src/app/layout.tsx` | `import "./globals.css"` | ✓ WIRED | layout.tsx line 1 imports globals.css |
| `src/app/[locale]/layout.tsx` | next/font | font variables on html className | ✓ WIRED | `className={\`${fraunces.variable} ${dmSans.variable}\`}` on `<html>` |
| `src/middleware.ts` | `src/i18n/routing.ts` | imports routing config | ✓ WIRED | `import { routing } from "./i18n/routing"` |
| `src/app/[locale]/layout.tsx` | `messages/{locale}.json` | getMessages() → NextIntlClientProvider | ✓ WIRED | `const messages = await getMessages()` passed to `<NextIntlClientProvider messages={messages}>` |
| `src/components/LanguageToggle.tsx` | next-intl useRouter/useLocale | router.push on locale change | ✓ WIRED | `useLocale()` from next-intl, `useRouter` from `@/i18n/navigation`, `router.push(pathname, { locale: nextLocale })` |
| `keystatic.config.ts` | content/settings.yaml | Keystatic Reader API at build time | ✓ WIRED | `singleton({ path: "content/settings", format: { data: "yaml" } })` — storage path correctly configured |

### Data-Flow Trace (Level 4)

Not applicable for Phase 1 — no dynamic data-fetching components. The placeholder page renders static i18n strings from message files; the layout renders design tokens from CSS. No DB queries or API data flows in scope.

### Behavioral Spot-Checks

Step 7b: SKIPPED — node_modules not installed in this environment. Build verification relies on git commit log evidence (SUMMARY reports `npm run build exits 0` for all three plans, confirmed by commit messages).

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| I18N-01 | 01-02-PLAN | Visitor can switch between Danish and English via a header toggle | ✓ SATISFIED | LanguageToggle in SiteHeader, useLocale + useRouter wired, terracotta active state |
| I18N-03 | 01-02-PLAN, 01-03-PLAN | Language preference reflected in URL path (/da/... and /en/...) | ✓ SATISFIED | next-intl [locale] segment routing, defineRouting with locales: ["da","en"], middleware with localeDetection |
| DSGN-01 | 01-01-PLAN, 01-02-PLAN | Japandi/minimalist design — muted earth tones, whitespace, serif+sans typography | ✓ SATISFIED | All 8 earth-tone color tokens in @theme, 8 spacing tokens, Fraunces + DM Sans via next/font, layout shell with correct spacing |

All 3 Phase 1 requirements are satisfied. No orphaned requirements (REQUIREMENTS.md maps I18N-01, I18N-03, and DSGN-01 to Phase 1).

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `src/app/page.tsx` | 2 | `return null` | ℹ️ Info | Intentional — root `/` is handled by middleware redirect to `/da` or `/en`. This page is never rendered. Documented in SUMMARY as known stub. |
| `src/app/[locale]/page.tsx` | 3-4 | `LocalePlaceholderPage` / `"placeholder"` translation key | ℹ️ Info | Intentional — spec-mandated placeholder page for Phase 1. Will be replaced in Phase 4 with homepage content. |

No blockers. No warnings. Both "stubs" are intentional, spec-documented, and do not prevent the phase goal.

### Human Verification Required

#### 1. Keystatic → GitHub → Vercel Deploy Loop

**Test:** Complete the Keystatic Cloud setup and verify the full deploy cycle:
1. Create a Keystatic Cloud project at https://keystatic.com — sign in, create project, connect the GitHub repository
2. Copy `KEYSTATIC_GITHUB_CLIENT_ID` and `KEYSTATIC_GITHUB_CLIENT_SECRET` from the Keystatic Cloud dashboard
3. Generate `KEYSTATIC_SECRET`: `openssl rand -hex 16`
4. Add all three plus `KEYSTATIC_STORAGE_KIND=github`, `GITHUB_REPO_OWNER=blendstrup`, `GITHUB_REPO_NAME=by-blendstrup-frontend` to Vercel project environment variables
5. Trigger a Vercel redeploy
6. Open `https://<your-vercel-url>/keystatic` — you should see the Keystatic admin with Keystatic Cloud OAuth
7. Edit `siteTitle` to "Deploy Test" and save
8. Verify a GitHub commit appears in the repo within 30 seconds
9. Verify Vercel auto-deploys from that commit within ~2 minutes
10. Revert `siteTitle` back to "By Blendstrup" and save

**Expected:** Owner sees Keystatic Cloud OAuth at the production URL, edits create GitHub commits, commits trigger Vercel deploys automatically.

**Why human:** Requires active Vercel deployment, Keystatic Cloud account creation, and live verification of an async deploy cycle. Cannot be tested with static code analysis or build-time checks.

### Gaps Summary

No code gaps found. All artifacts exist, are substantive, and are correctly wired. All three Phase 1 requirements (I18N-01, I18N-03, DSGN-01) are satisfied by the codebase.

The only outstanding item is Roadmap Success Criterion 3 (GitHub deploy loop), which is blocked on owner-side setup (Keystatic Cloud account + Vercel env vars), not a code deficiency. The implementation is complete and correct — `KEYSTATIC_STORAGE_KIND=github` activates GitHub storage mode with the documented credentials. Phase 1 is code-complete; human verification unblocks SC3.

---

_Verified: 2026-04-18T10:20:20Z_
_Verifier: Claude (gsd-verifier)_
