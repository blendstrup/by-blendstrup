---
phase: 6
slug: polish-launch
status: draft
nyquist_compliant: true
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
| 06-01-01 | 01 | 1 | DSGN-02 | T-06-03 | getBlurDataUrl wraps readFileSync in try/catch — no path traversal crash | build + biome | `pnpm build && pnpm biome check src/` | ✅ | ⬜ pending |
| 06-01-02 | 01 | 1 | DSGN-02 | — | blur returns data URI for valid path, undefined for missing/null | unit | `pnpm test --run` | ✅ (created in task) | ⬜ pending |
| 06-02-01 | 02 | 1 | DSGN-04, I18N-04 | T-06-04 | robots.ts disallows /keystatic/; no hreflang written | build + biome | `pnpm build && pnpm biome check src/` | ✅ | ⬜ pending |
| 06-02-02 | 02 | 1 | DSGN-02 | — | og-default.jpg present at 1200x630px | file check | `ls -lh public/og-default.jpg` | N/A (generated) | ⬜ pending |
| 06-03-01 | 03 | 2 | DSGN-02 | — | WorkCard/ShopCard accept blurDataUrl prop; no "use client" added | build + biome | `pnpm build && pnpm biome check src/` | ✅ | ⬜ pending |
| 06-03-02 | 03 | 2 | DSGN-02 | T-06-10 | WorkDetail async; BLUR_DATA_URL removed; gallery/homepage RSCs pass blur | build + test + biome | `pnpm build && pnpm test --run && pnpm biome check src/` | ✅ | ⬜ pending |
| 06-04-01 | 04 | 3 | DSGN-04 | T-06-11 | static page metadata exports; no e-commerce chrome in strings | build + biome | `pnpm build && pnpm biome check src/` | ✅ | ⬜ pending |
| 06-04-02 | 04 | 3 | DSGN-04 | T-06-11 | generateMetadata guards unpublished works; OG spread pattern correct | build + biome | `pnpm build && pnpm biome check src/` | ✅ | ⬜ pending |
| 06-05-01 | 05 | 4 | DSGN-03 | — | cms-guide.md covers four tasks; keystatic.cloud URL present | file check + test | `ls docs/cms-guide.md && pnpm test --run` | N/A (created in task) | ⬜ pending |
| 06-05-02 | 05 | 4 | DSGN-03, DSGN-04 | — | Biome clean; no e-commerce chrome grep; Lighthouse >= 80/90 mobile | biome + build + test + manual | `pnpm biome check src/ && pnpm build && pnpm test --run` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/__tests__/blur-placeholder.test.ts` — created in Plan 06-01 Task 2 (TDD RED phase runs before implementation). Covers DSGN-02 blur utility: happy path returns data URI, missing file returns undefined, null input returns undefined.

*All other existing tests continue to pass unchanged — this phase touches no existing test-covered logic.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Blur placeholder renders on images | DSGN-02 | Visual check, no automated assertion | Load gallery page, observe shimmer before image loads |
| No horizontal scroll on mobile | DSGN-03 | Requires real device / browser resize | Open Chrome DevTools → iPhone 14 viewport (390px), scroll all pages |
| Owner CMS flow (add piece, mark sold, curate homepage) | DSGN-03 | Human demonstration | Run documented onboarding steps with owner using docs/cms-guide.md |
| Lighthouse Performance >= 80 on mobile | DSGN-03 | Requires Chrome DevTools or Lighthouse CLI | Run against `pnpm build && pnpm start` on all 6 pages (mobile preset) |
| Lighthouse Accessibility >= 90 on mobile | DSGN-03 | Requires Chrome DevTools or Lighthouse CLI | Same as above |
| /sitemap.xml lists correct URLs | DSGN-04 | HTTP response check | `curl http://localhost:3000/sitemap.xml` — confirm gallery slugs present |
| /robots.txt shows Disallow: /keystatic/ | DSGN-04 | HTTP response check | `curl http://localhost:3000/robots.txt` — confirm disallow line |
| Page OG metadata in source | DSGN-04 | Page source inspection | Cmd+U in browser — confirm og:image, og:title, description present |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify commands (build, test, biome, or file check)
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers the MISSING reference (blur-placeholder.test.ts created in 06-01 Task 2)
- [x] No watch-mode flags in any verify command
- [x] Feedback latency < 30s for unit/build checks
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending execution
