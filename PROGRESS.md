# By Blendstrup — Development Progress

> Last updated: 2026-04-18 (code review fixes applied)

---

## Current Status

**Active phase:** Phase 2 (not yet started)
**Last completed:** Phase 1: Foundation
**Overall progress:** 1 / 6 phases complete

---

## Phase Summary

| Phase | Name | Status | Plans |
|-------|------|--------|-------|
| 1 | Foundation | ✅ Complete (1 UAT item pending owner) | 3/3 |
| 2 | Content Model & CMS UX | ⬜ Not started | TBD |
| 3 | Gallery & Works | ⬜ Not started | TBD |
| 4 | Homepage, Shop & Contact | ⬜ Not started | TBD |
| 5 | Inquiries & Email Delivery | ⬜ Not started | TBD |
| 6 | Polish & Launch | ⬜ Not started | TBD |

---

## Phase 1: Foundation — Complete ✅

**What was built:**
- Next.js 15.5 App Router, TypeScript strict, Tailwind v4 with Japandi design tokens (8 earth-tone colors, 8 spacing tokens)
- Fraunces (serif) + DM Sans (sans) self-hosted via `next/font`
- next-intl bilingual routing — `/da` and `/en` with Accept-Language detection
- Sticky header, site footer, language toggle (DA | EN), skip link
- Keystatic Admin UI at `/keystatic` with `settings` singleton (siteTitle field)
- Environment-based storage: local YAML in dev, GitHub commits in production

**Pending owner action (non-blocking for development):**
The Keystatic → GitHub → Vercel deploy loop needs to be manually verified. Steps are in [.planning/phases/01-foundation/01-HUMAN-UAT.md](.planning/phases/01-foundation/01-HUMAN-UAT.md).

**Code review:** 4/4 critical+warning findings fixed ✅ — see [01-REVIEW-FIX.md](.planning/phases/01-foundation/01-REVIEW-FIX.md)

- Runtime guard added for missing GitHub env vars in `keystatic.config.ts`
- Tailwind v4 CSS variable syntax fixed in `[locale]/page.tsx`
- Locale type cast uses exported `Locale` type from routing config
- Skip link text now pulled from translation system via `getTranslations`
- 2 info findings left as-is (minor, non-blocking)

---

## Phase 2: Content Model & CMS UX — Next up

**Goal:** Full Keystatic schema for works, for-sale metadata, and the homepage singleton, with bilingual fields and plain-language labels for the owner.

**Requirements:** CMS-01, CMS-02, CMS-03, CMS-04, I18N-02

**Success criteria:**
1. Owner can create a ceramic piece with images, DA+EN title/description, category, for-sale status, price, lead time
2. Owner can toggle draft/published — drafts don't appear on the public site
3. Owner can curate the homepage singleton (hero + shop preview pieces)
4. All CMS fields show plain-language labels and helper text for a non-technical user
5. All public strings resolve correctly in DA and EN

---

## Commands — What to Run Next

Phase 1 code review fixes are done. Ready for Phase 2.

**Step 1 — Discuss Phase 2 approach (optional but recommended):**
```
/gsd-discuss-phase 2
```

**Step 2 — Plan Phase 2:**
```
/gsd-plan-phase 2
```

**Step 3 — Execute Phase 2:**
```
/gsd-execute-phase 2
```

---

## Owner Actions Required

| Item | What to do | File |
|------|-----------|------|
| Keystatic Cloud setup | Create Keystatic Cloud project, add Vercel env vars, verify GitHub deploy loop | [UAT steps](.planning/phases/01-foundation/01-HUMAN-UAT.md) |

---

## Dev Server

```bash
npm run dev
# Site: http://localhost:3000/da  (or /en)
# CMS:  http://localhost:3000/keystatic
```

---

## Key Files

| File | What it is |
|------|-----------|
| [src/app/globals.css](src/app/globals.css) | Tailwind v4 @theme — all design tokens |
| [keystatic.config.ts](keystatic.config.ts) | CMS schema — add new content types here |
| [src/i18n/routing.ts](src/i18n/routing.ts) | Locale config |
| [messages/da.json](messages/da.json) | Danish UI strings |
| [messages/en.json](messages/en.json) | English UI strings |
| [.env.local.example](.env.local.example) | Required env vars |
| [.planning/ROADMAP.md](.planning/ROADMAP.md) | Full project roadmap |
