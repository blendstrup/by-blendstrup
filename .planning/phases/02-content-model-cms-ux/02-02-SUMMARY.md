---
phase: "02-content-model-cms-ux"
plan: "02"
subsystem: "cms-schema"
tags: ["keystatic", "admin-ui", "smoke-test", "biome", "a11y"]

dependency_graph:
  requires:
    - "02-01: Keystatic schema — works, categories, homepage singleton"
  provides:
    - "Human-verified Admin UI: all schema fields confirmed visible and labelled correctly"
    - "Confirmed sidebar grouping: Pieces / Taxonomy / Pages"
    - "Test content entries: content/works/bowl-test, content/categories/bowls.yaml"
    - "biome.json with correct key names (include, assists, organizeImports)"
    - "LanguageToggle buttons with explicit type=\"button\" for a11y"
  affects:
    - "Phase 3 gallery RSCs — confirmed schema is CMS-UX ready for real content entry"

tech_stack:
  added: []
  patterns:
    - "pnpm biome check src/ — target src/ explicitly to avoid scanning .next/ build output"

key_files:
  created:
    - "content/works/bowl-test/ — test ceramic piece entry from smoke test"
    - "content/categories/bowls.yaml — test category entry from smoke test"
  modified:
    - "biome.json — fixed invalid key names: includes→include, assist→assists, removed invalid organizeImports from assists.actions.source"
    - "src/__tests__/keystatic-schema.test.ts — fixed computed key access cfg.ui?.[\"navigation\"] → cfg.ui?.navigation"
    - "src/components/LanguageToggle.tsx — added type=\"button\" to both locale toggle buttons"

key-decisions:
  - "Test content entries (bowl-test piece, bowls category) committed to repo as harmless smoke-test artifacts; owner should delete before launch"
  - "biome check scoped to src/ in CI to avoid false positives from .next/ build output"

patterns-established:
  - "Run pnpm biome check src/ (not pnpm check .) to target only source files"

requirements-completed:
  - CMS-01
  - CMS-02
  - CMS-03
  - CMS-04

duration: "~15 minutes"
completed: "2026-04-19"
---

# Phase 02 Plan 02: Admin UI Smoke Test Summary

**Keystatic Admin UI human-verified: all schema fields visible with plain-language labels, sidebar groups correct, relationship pickers functional, draft/publish toggle confirmed — plus biome.json and a11y lint fixes.**

## Performance

- **Duration:** ~15 minutes
- **Started:** 2026-04-19T00:00:00Z
- **Completed:** 2026-04-19
- **Tasks:** 2 (Task 1: dev server start; Task 2: human checkpoint — approved)
- **Files modified:** 4

## Accomplishments

- Human smoke test passed all 6 checklist sections: sidebar navigation, category creation, ceramic piece creation, list view columns, homepage singleton relationship pickers, and draft/publish toggle
- Test content committed: `content/works/bowl-test/` (draft piece) and `content/categories/bowls.yaml` (Bowls/Skåle)
- Fixed invalid `biome.json` keys that caused `pnpm check` to fail with configuration errors
- Fixed pre-existing a11y lint errors in `LanguageToggle.tsx` and computed key access in schema test

## Task Commits

1. **Task 1: Dev server start and pre-flight** - `973d382` (chore)
2. **Task 2: Human checkpoint approved — post-verification fixes** - committed as part of this summary

**Plan metadata:** to be committed after this summary

## Files Created/Modified

- `content/works/bowl-test/` - Test ceramic piece entry (draft, "Testskål / Test Bowl", saleStatus: available)
- `content/categories/bowls.yaml` - Test category entry (nameDa: "Skåle", nameEn: "Bowls")
- `biome.json` - Fixed `files.includes` → `files.include`, `assist` → `assists`, removed invalid `organizeImports` from `assists.actions.source`; moved import organisation to top-level `organizeImports` key
- `src/__tests__/keystatic-schema.test.ts` - Fixed `cfg.ui?.["navigation"]` → `cfg.ui?.navigation` (lint/complexity/useLiteralKeys)
- `src/components/LanguageToggle.tsx` - Added `type="button"` to both DA and EN locale toggle buttons (lint/a11y/useButtonType)

## Decisions Made

- Test entries (bowl-test piece, bowls category) are kept in the repo — harmless lorem-ipsum stand-ins per threat model item T-02-05. Owner should delete before launch.
- `biome.json` `assists` block simplified to `{ "enabled": true }` — the `organizeImports` action belongs in the top-level `organizeImports` key, not inside `assists.actions.source`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed invalid biome.json configuration keys**
- **Found during:** Post-checkpoint verification (`pnpm check`)
- **Issue:** `files.includes` should be `files.include`; `assist` should be `assists`; `assists.actions.source.organizeImports` is not a valid key (valid source actions are `sortJsxProps` and `useSortedKeys` only)
- **Fix:** Renamed keys to correct names; moved `organizeImports` to the top-level `organizeImports: { enabled: true }` block
- **Files modified:** `biome.json`
- **Verification:** `pnpm biome check src/` exits 0 with no configuration errors
- **Committed in:** this summary commit

**2. [Rule 1 - Bug] Fixed computed key access in schema test**
- **Found during:** Post-checkpoint `pnpm biome check src/`
- **Issue:** `cfg.ui?.["navigation"]` triggers `lint/complexity/useLiteralKeys` — Biome flags it as unnecessarily complex
- **Fix:** Simplified to `cfg.ui?.navigation`
- **Files modified:** `src/__tests__/keystatic-schema.test.ts`
- **Verification:** `pnpm biome check src/` exits 0
- **Committed in:** this summary commit

**3. [Rule 2 - Missing Critical] Added `type="button"` to LanguageToggle buttons**
- **Found during:** Post-checkpoint `pnpm biome check src/`
- **Issue:** Both buttons in `LanguageToggle.tsx` lacked explicit `type` attribute — default `type="submit"` can trigger unexpected form submission when the component appears inside a `<form>` element
- **Fix:** Added `type="button"` to both DA and EN toggle buttons
- **Files modified:** `src/components/LanguageToggle.tsx`
- **Verification:** `pnpm biome check src/` exits 0
- **Committed in:** this summary commit

---

**Total deviations:** 3 auto-fixed (1 config bug, 1 lint bug, 1 missing a11y/correctness attribute)
**Impact on plan:** All fixes are correctness/config issues unrelated to the smoke test goal. No scope creep. Build and lint now clean.

## Issues Encountered

- `pnpm check` (without path argument) scans `.next/` build artifacts, producing thousands of false-positive lint errors from minified output. Scoping to `pnpm biome check src/` is the correct invocation for source-only checks.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Keystatic schema fully verified in Admin UI — ready for Phase 3 gallery RSCs to consume via Reader API
- Test content entries (`bowl-test`, `bowls`) provide a live data fixture for Phase 3 development
- Owner can begin entering real content at any time via `/keystatic`
- Reminder: delete test entries (`content/works/bowl-test/`, `content/categories/bowls.yaml`) before public launch

## Known Stubs

None. This plan is a verification plan with no public-facing UI. The schema delivers real data — test entries are smoke-test artifacts, not stubs.

## Threat Flags

None. No new network endpoints, auth paths, or file access patterns introduced beyond those already reviewed in Plan 01 and the Plan 02-02 threat model.

---
*Phase: 02-content-model-cms-ux*
*Completed: 2026-04-19*
