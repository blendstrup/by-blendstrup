---
phase: 5
slug: inquiries-email-delivery
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-20
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.4 |
| **Config file** | none — uses default config (scans `src/**/*.test.ts`) |
| **Quick run command** | `pnpm test` |
| **Full suite command** | `pnpm test` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm test`
- **After every plan wave:** Run `pnpm test`
- **Before `/gsd-verify-work`:** Full suite must be green + manual email delivery verified
- **Max feedback latency:** ~15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 5-01-01 | 01 | 0 | CUST-01 | — | Zod rejects missing required fields | unit | `pnpm test -- --testPathPattern custom-order-schema` | ❌ W0 | ⬜ pending |
| 5-01-02 | 01 | 0 | CUST-02 | — | Optional budget/timeline pass when absent | unit | `pnpm test -- --testPathPattern custom-order-schema` | ❌ W0 | ⬜ pending |
| 5-01-03 | 01 | 0 | CUST-03 | T-5-01 | Non-empty honeypot returns `{ success: true }` without sending email | unit | `pnpm test -- --testPathPattern honeypot` | ❌ W0 | ⬜ pending |
| 5-02-01 | 02 | 0 | SHOP-04 | — | Purchase inquiry Zod schema validates required fields | unit | `pnpm test -- --testPathPattern purchase-inquiry-schema` | ❌ W0 | ⬜ pending |
| 5-03-01 | 03 | 1 | CONT-02 | T-5-02 | `RESEND_API_KEY` env var not prefixed `NEXT_PUBLIC_` | manual | grep source files | — | ⬜ pending |
| 5-03-02 | 03 | 1 | CONT-03 | T-5-02 | Email delivered, SPF/DKIM pass in mail headers | manual | test submission → inbox check | — | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/__tests__/custom-order-schema.test.ts` — stubs for CUST-01, CUST-02
- [ ] `src/__tests__/purchase-inquiry-schema.test.ts` — stubs for SHOP-04
- [ ] `src/__tests__/honeypot.test.ts` — stubs for CUST-03 (pure honeypot check function)

Mirror existing `gallery-filter.test.ts` pattern — import pure functions, test against plain objects, no Resend mocking required.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Email delivered to owner inbox within seconds | CONT-02, CONT-03 | Resend live API call cannot be unit-tested without live credentials | Submit both forms in staging/production, check owner inbox, inspect mail headers for SPF=pass, DKIM=pass |
| DNS records (SPF, DKIM, DMARC) propagated and correct | CONT-02, CONT-03 | DNS propagation is infrastructure, not code | Run `dig TXT send.[owner-domain]`, `dig TXT resend._domainkey.[owner-domain]`, `dig TXT _dmarc.[owner-domain]` after DNS setup |
| Resend dashboard shows domain verified | CONT-02, CONT-03 | Dashboard state cannot be queried from code | Log in to resend.com/domains and confirm domain status = Verified |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
