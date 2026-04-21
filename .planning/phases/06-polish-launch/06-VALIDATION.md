---
phase: 6
slug: polish-launch
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-21
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest (unit/integration) + Playwright (e2e) |
| **Config file** | `vitest.config.ts` / `playwright.config.ts` |
| **Quick run command** | `pnpm test --run` |
| **Full suite command** | `pnpm test --run && pnpm build` |
| **Estimated runtime** | ~30 seconds (unit), ~2 minutes (full) |

---

## Sampling Rate

- **After every task commit:** Run `pnpm test --run`
- **After every plan wave:** Run `pnpm test --run && pnpm build`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 06-01-01 | 01 | 1 | DSGN-02 | — | N/A | build | `pnpm build` | ✅ | ⬜ pending |
| 06-01-02 | 01 | 1 | DSGN-02 | — | N/A | manual | Lighthouse CLI on `/` | ✅ | ⬜ pending |
| 06-02-01 | 02 | 1 | I18N-04 | — | N/A | build | `pnpm build` | ✅ | ⬜ pending |
| 06-03-01 | 03 | 2 | DSGN-03 | — | N/A | manual | viewport QA checklist | ✅ | ⬜ pending |
| 06-04-01 | 04 | 2 | DSGN-04 | — | N/A | grep | `grep -r "cart\|star-rating\|stock" src/` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements — this phase is primarily QA, audit, and content-level fixes with no new test framework installation needed.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Blur placeholder renders on images | DSGN-02 | Visual check, no automated assertion | Load gallery page, observe shimmer before image loads |
| No horizontal scroll on mobile | DSGN-03 | Requires real device / browser resize | Open Chrome DevTools → iPhone 12 viewport, scroll all pages |
| hreflang alternates in page source | I18N-04 | Page source inspection | `curl https://byblendstrup.dk/ | grep hreflang` |
| Owner CMS flow (add piece, mark sold, curate homepage) | DSGN-04 | Human demonstration | Run documented onboarding steps with owner |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
