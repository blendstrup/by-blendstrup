---
phase: 01-foundation
plan: "01"
subsystem: scaffold
tags: [next.js, tailwind, typescript, fonts, design-tokens]
dependency_graph:
  requires: []
  provides: [next15-scaffold, tailwind-v4-tokens, next-font-fraunces-dmsans]
  affects: [01-02, 01-03]
tech_stack:
  added:
    - next@15.5.15
    - react@19
    - tailwindcss@4
    - "@tailwindcss/postcss"
    - prettier + prettier-plugin-tailwindcss
  patterns:
    - Tailwind v4 CSS-native @theme block (no tailwind.config.js)
    - next/font/google self-hosted fonts with CSS variable names matching @theme tokens
    - TypeScript strict + noUncheckedIndexedAccess
key_files:
  created:
    - package.json
    - tsconfig.json
    - next.config.ts
    - postcss.config.mjs
    - .eslintrc.json
    - .prettierrc
    - .gitignore
    - src/app/globals.css
    - src/app/layout.tsx
    - src/app/page.tsx
  modified: []
decisions:
  - Next.js 15.5.15 installed (scaffolder defaulted to 16.2.4; downgraded to satisfy plan constraint)
  - esModuleInterop forced true by Next.js SWC requirement (overrode plan's false setting)
  - noEmit: true added by Next.js auto-reconfigure on first build (required)
  - lang="en" added to root html element (a11y Rule 2 — ESLint flagged missing lang attribute)
  - Kept eslint.config.mjs alongside .eslintrc.json (flat config remains from scaffold; .eslintrc.json is primary per plan)
metrics:
  duration_minutes: 3
  completed_date: "2026-04-18T09:55:42Z"
  tasks_completed: 2
  tasks_total: 2
  files_created: 10
  files_modified: 0
---

# Phase 1 Plan 01: Project Scaffold & Design Tokens Summary

Next.js 15 App Router project bootstrapped with TypeScript strict mode, Tailwind v4 CSS-native @theme block (all 8 UI-SPEC colors + 8 spacing tokens verbatim), and Fraunces + DM Sans self-hosted via next/font with CSS variable names wired to @theme tokens.

## Tasks Completed

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | Initialise Next.js 15 with TypeScript, ESLint, Prettier | 0da4929 | package.json, tsconfig.json, .eslintrc.json, .prettierrc, .gitignore |
| 2 | Install Tailwind v4, configure @theme tokens, wire next/font | 835e77f | src/app/globals.css, src/app/layout.tsx, postcss.config.mjs |

## Verification Results

- `npx tsc --noEmit` exits 0
- `npm run build` exits 0
- No default Tailwind palette in use (`grep -r "blue-500|red-400|green-600" src/` returns empty)
- `strict: true` confirmed in tsconfig.json
- All 8 color tokens and 8 spacing tokens present verbatim in globals.css
- No `tailwind.config.ts` or `tailwind.config.js` exists

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing a11y] Added lang attribute to root html element**
- **Found during:** Task 1
- **Issue:** ESLint/JSX a11y rule requires `lang` attribute on `<html>` element
- **Fix:** Added `lang="en"` to root layout (will be replaced by locale-aware `lang` in Plan 02 when next-intl is wired)
- **Files modified:** src/app/layout.tsx
- **Commit:** 0da4929

### Framework-enforced tsconfig changes

Next.js SWC mandates `esModuleInterop: true` and adds `noEmit: true` on first build. These overrode the plan's explicit `esModuleInterop: false` setting. This is a Next.js hard requirement, not a deviation from intent.

### Scaffolder version difference

`create-next-app` defaulted to Next.js 16.2.4 (latest at install time). Downgraded to `^15.5.15` per plan constraint. `npm install next@15` resolved to 15.5.15.

## Known Stubs

- `src/app/page.tsx` returns `null` — placeholder, replaced in Plan 02 by locale-aware routing shell
- `lang="en"` in root layout is a placeholder — Plan 02 will replace with dynamic locale value from next-intl

## Threat Flags

None — no new network endpoints, auth paths, file access patterns, or schema changes introduced. `.env.local` excluded from git via `.gitignore` per T-01-02 mitigation.

## Self-Check: PASSED

- src/app/globals.css: EXISTS
- src/app/layout.tsx: EXISTS
- tsconfig.json (strict: true): EXISTS
- postcss.config.mjs: EXISTS
- Commit 0da4929: EXISTS
- Commit 835e77f: EXISTS
