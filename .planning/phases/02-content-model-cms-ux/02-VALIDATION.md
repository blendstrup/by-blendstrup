---
phase: 2
slug: content-model-cms-ux
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-18
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest (already configured in Phase 1) |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `pnpm vitest run` |
| **Full suite command** | `pnpm vitest run && pnpm tsc --noEmit` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm vitest run`
- **After every plan wave:** Run `pnpm vitest run && pnpm tsc --noEmit`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 2-01-01 | 01 | 1 | CMS-01 | — | N/A | type-check | `pnpm tsc --noEmit` | ✅ | ⬜ pending |
| 2-01-02 | 01 | 1 | CMS-02 | — | N/A | type-check | `pnpm tsc --noEmit` | ✅ | ⬜ pending |
| 2-01-03 | 01 | 1 | CMS-03 | — | N/A | type-check | `pnpm tsc --noEmit` | ✅ | ⬜ pending |
| 2-01-04 | 01 | 1 | CMS-04 | — | N/A | manual | Keystatic Admin UI visual check | ❌ W0 | ⬜ pending |
| 2-01-05 | 01 | 1 | I18N-02 | — | N/A | unit | `pnpm vitest run` | ✅ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] `src/__tests__/keystatic-schema.test.ts` — stubs validating schema exports and field types
- [x] `src/__tests__/i18n-fields.test.ts` — stubs for bilingual sibling-field resolution

*If none: "Existing infrastructure covers all phase requirements."*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| CMS field labels and helper text are plain-language and non-technical | CMS-04 | Subjective UX quality; no automated assertion possible | Open `/keystatic`, create a new work entry, read every label and helper text aloud — confirm a non-developer would understand each field |
| Owner can curate homepage hero and shop preview | CMS-03 | Requires Keystatic Admin UI navigation | Open `/keystatic`, go to Homepage singleton, use the relationship picker to add/remove works from hero and preview slots |
| Draft pieces invisible on public site | CMS-02 | Requires running dev server and checking rendered output | Set a work's `published` to false, visit `/`, confirm the work does not appear |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 15s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved
