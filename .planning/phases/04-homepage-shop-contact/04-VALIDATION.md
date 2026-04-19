---
phase: 4
slug: homepage-shop-contact
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-19
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.4 |
| **Config file** | `vitest.config.ts` (root) |
| **Quick run command** | `pnpm test` |
| **Full suite command** | `pnpm test && pnpm build` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm test`
- **After every plan wave:** Run `pnpm test && pnpm build`
- **Before `/gsd-verify-work`:** Full suite must be green + `pnpm build` passes
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 4-01-01 | 01 | 0 | HOME-04, CONT-01 | — | N/A | unit | `pnpm test -- keystatic-schema` | ✅ extend existing | ⬜ pending |
| 4-02-01 | 02 | 0 | HOME-02, SHOP-01 | — | N/A | unit | `pnpm test -- shop-filter` | ❌ Wave 0 | ⬜ pending |
| 4-03-01 | 03 | 1 | HOME-01 | T-XSS | No `dangerouslySetInnerHTML` for CMS strings | unit | `pnpm test -- keystatic-schema` | ✅ extend | ⬜ pending |
| 4-04-01 | 04 | 1 | HOME-02, SHOP-01, SHOP-02, SHOP-03, SHOP-04 | T-XSS | No raw HTML render | smoke | manual verify | — | ⬜ pending |
| 4-05-01 | 05 | 2 | HOME-03, HOME-04, CONT-01 | T-REDIR | `rel="noopener noreferrer"` on external links | smoke | manual verify | — | ⬜ pending |
| 4-06-01 | 06 | 2 | HOME-01, HOME-02, HOME-03, HOME-04, SHOP-01, SHOP-02, SHOP-03, SHOP-04, CONT-01 | — | N/A | integration | `pnpm build` | — | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/__tests__/shop-filter.test.ts` — unit tests for `published && saleStatus === 'available'` filter logic (covers HOME-02, SHOP-01)
- [ ] `src/__tests__/keystatic-schema.test.ts` — extend existing: assertions for `about` singleton fields + `settings.contactEmail` / `settings.instagramHandle` (covers HOME-04, CONT-01)
- [ ] `src/__tests__/i18n-fields.test.ts` — extend existing: assertions for all Phase 4 message keys in both `en` and `da` locales
- [ ] `pnpm add lucide-react` — required before any icon imports compile
- [ ] `mkdir -p public/images/about` — required before Keystatic can save about photos

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Custom order CTA links to `/[locale]/custom-orders` | HOME-03 | Route is a Phase 5 stub — no page exists to validate navigation | Click CTA in browser, confirm href resolves correctly even if page returns 404 |
| ShopCard "Contact to buy" CTA links to `/[locale]/contact` | SHOP-04 | Hover interaction requires real browser | Hover card on desktop; confirm CTA fades in + link href is correct |
| Scroll indicator visible at hero bottom | HOME-01 | CSS animation requires browser | Confirm chevron bounces, `aria-hidden="true"` set |
| About section stacks correctly on mobile | HOME-04 | Responsive layout requires browser resize | Verify photo above text at <640px viewport |
| Instagram link uses `rel="noopener noreferrer"` | CONT-01 | Security attribute | Inspect element in browser dev tools |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
