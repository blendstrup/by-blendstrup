---
phase: 3
slug: gallery-works
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-19
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 4.1.4 |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `pnpm test` |
| **Full suite command** | `pnpm test && pnpm build` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm test && pnpm tsc --noEmit && pnpm biome check src/`
- **After every plan wave:** Run `pnpm test && pnpm build`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** ~15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 3-W0-01 | Wave 0 | 0 | GALL-01, GALL-03, GALL-04 | — | N/A | unit | `pnpm test src/__tests__/gallery-filter.test.ts` | ❌ W0 | ⬜ pending |
| 3-W0-02 | Wave 0 | 0 | GALL-01..04 | — | N/A | unit | `pnpm test src/__tests__/i18n-fields.test.ts` | Partial | ⬜ pending |
| 3-01-01 | 01 | 1 | GALL-01..04 | T-3-01 | `read(slug)` returns null → `notFound()` called | unit | `pnpm test` | ❌ W0 | ⬜ pending |
| 3-01-02 | 01 | 1 | GALL-01 | — | Published filter applied before render | unit | `pnpm test` | ❌ W0 | ⬜ pending |
| 3-01-03 | 01 | 1 | GALL-02 | — | Slug resolves to correct locale fields | unit | `pnpm test` | ❌ W0 | ⬜ pending |
| 3-01-04 | 01 | 1 | GALL-03 | — | `?filter=for-sale` returns only `saleStatus === 'available'` | unit | `pnpm test` | ❌ W0 | ⬜ pending |
| 3-01-05 | 01 | 1 | GALL-04 | — | Sold status renders badge and CTA href | unit | `pnpm test` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/__tests__/gallery-filter.test.ts` — unit tests for published filter logic and for-sale filter (covers GALL-01, GALL-03, GALL-04, CMS-02 deferred)
- [ ] `src/__tests__/i18n-fields.test.ts` — extend existing file to assert `gallery.*` keys present in both `en.json` and `da.json`
- [ ] Schema restoration prerequisite: `keystatic.config.ts` must include `works`, `categories`, and `homepage` collections before any gallery test runs (not a test file gap — handled in Wave 1 plan)

*Existing `src/__tests__/keystatic-schema.test.ts` will fail until schema is restored — this is expected and tracked.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Grid renders correctly at 320px, 768px, 1280px | GALL-01 | Visual layout — no automated viewport test | Open `/en/gallery` in browser DevTools at each breakpoint; confirm 1/2/3-column layout |
| Detail page image layout (side-by-side desktop, stacked mobile) | GALL-02 | Visual layout | Open any piece detail at 1280px (side-by-side) and 375px (stacked) |
| For-sale badge renders in terracotta, sold badge in stone | GALL-03, GALL-04 | Color/visual | Inspect badge element; verify Tailwind token class applied |
| Language toggle switches gallery content to DA/EN | GALL-02 | Integration (locale + RSC) | Toggle language on detail page; verify title and description change |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
