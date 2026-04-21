# Roadmap: By Blendstrup

**Created:** 2026-04-18
**Granularity:** standard (5-8 phases)
**Coverage:** 30/30 v1 requirements mapped

## Phases

- [ ] **Phase 1: Foundation** — Next.js + Tailwind + next-intl i18n routing + Keystatic skeleton + deploy pipeline proven end-to-end
- [ ] **Phase 2: Content Model & CMS UX** — Full Keystatic schema (works, for-sale, homepage singleton) with bilingual fields and owner-friendly labels
- [ ] **Phase 3: Gallery & Works** — Works grid, piece detail pages, for-sale filter, sold piece treatment
- [ ] **Phase 4: Homepage, Shop & Contact** — Homepage (hero, about, shop preview, CTA), dedicated shop page, contact page
- [ ] **Phase 5: Inquiries & Email Delivery** — Purchase inquiry form, custom order form, Resend delivery with SPF/DKIM, spam protection
- [ ] **Phase 6: Polish & Launch** — SEO metadata, AVIF image optimization, blur placeholders, responsive QA, owner CMS training

## Phase Details

### Phase 1: Foundation
**Goal**: Establish the technical substrate — Next.js App Router, Tailwind design tokens, next-intl bilingual routing, Keystatic admin skeleton, and a proven Keystatic → GitHub → Vercel deploy loop — so every subsequent phase builds on locked-in conventions.
**Depends on**: Nothing (first phase)
**Requirements**: I18N-01, I18N-03, DSGN-01
**Success Criteria** (what must be TRUE):
  1. Visitor can load `/da` and `/en` routes and see a locale-aware placeholder page
  2. Visitor can toggle language from a header control and the URL path updates to the matching locale
  3. Owner can edit a test content entry in Keystatic, commit to GitHub, and see the change deployed on Vercel within one cycle
  4. Site renders a minimal Japandi-leaning shell (typography scale, muted palette tokens, spacing tokens) applied via Tailwind
**Plans**: 3 plans
Plans:
- [ ] 01-01-PLAN.md — Next.js 15 scaffold + Tailwind v4 design tokens + next/font
- [ ] 01-02-PLAN.md — next-intl i18n routing, locale layout shell, language toggle, placeholder pages
- [ ] 01-03-PLAN.md — Keystatic settings singleton, Admin UI, GitHub storage, deploy loop checkpoint
**UI hint**: yes

### Phase 2: Content Model & CMS UX
**Goal**: Define the full Keystatic schema for works, for-sale metadata, and the homepage singleton, with bilingual fields and clear, non-technical labels so the owner can manage all content unaided.
**Depends on**: Phase 1
**Requirements**: CMS-01, CMS-02, CMS-03, CMS-04, I18N-02
**Success Criteria** (what must be TRUE):

1. Owner can create a new ceramic piece in Keystatic with images, DA+EN title, DA+EN description, category, for-sale status, price, and lead-time note
2. Owner can flip any piece between draft and published, and drafts do not appear on the public site
3. Owner can curate the homepage singleton by picking which pieces appear in the hero and shop preview
4. Every CMS field shows a plain-language label and helper text written for a non-technical user
5. All public-facing strings (UI labels and content) resolve correctly in both Danish and English

**Plans**: 2 plans

- [x] 02-01-PLAN.md — vitest setup + Keystatic schema (works, categories, homepage) + i18n message keys
- [x] 02-02-PLAN.md — Admin UI smoke-test checkpoint (human verify)

### Phase 3: Gallery & Works
**Goal**: Ship the browsable works collection — uniform grid, detail pages, for-sale filter, and graceful handling of sold pieces with a custom-order bridge.
**Depends on**: Phase 2
**Requirements**: GALL-01, GALL-02, GALL-03, GALL-04
**Success Criteria** (what must be TRUE):
  1. Visitor can browse every published piece in a uniform grid layout
  2. Visitor can click a piece and land on a detail page with full imagery and description in their chosen language
  3. Visitor can filter the gallery to show only currently for-sale pieces
  4. Sold pieces remain visible in the grid with a clear "Sold" label and a CTA linking to the custom order form
**Plans**: TBD
**UI hint**: yes

### Phase 4: Homepage, Shop & Contact
**Goal**: Deliver the three public anchor pages — homepage (hero, about, shop preview, CTA), dedicated shop page, and contact page — all driven by CMS content.
**Depends on**: Phase 2, Phase 3
**Requirements**: HOME-01, HOME-02, HOME-03, HOME-04, SHOP-01, SHOP-02, SHOP-03, SHOP-04, CONT-01
**Success Criteria** (what must be TRUE):
  1. Visitor landing on the homepage sees a full-bleed hero of owner-selected featured ceramics
  2. Visitor sees a shop preview section on the homepage listing currently for-sale pieces, plus an About section describing the maker
  3. Visitor sees a prominent custom order CTA on the homepage linking to the custom order form
  4. Visitor can open a dedicated shop page listing only for-sale pieces, each showing price, lead time, and a "Contact to buy" CTA
  5. Visitor can find a contact page with general contact information in their chosen language
**Plans**: 6 plans
Plans:
- [x] 04-01-PLAN.md — Keystatic about singleton + settings extensions + lucide-react + Wave 0 tests
- [x] 04-02-PLAN.md — Phase 4 i18n keys (en.json + da.json) + NavLinks client component
- [x] 04-03-PLAN.md — ShopCard component (overlay scrim, hover CTA, always-visible mobile CTA)
- [x] 04-04-PLAN.md — Homepage: hero + shop preview + about section + custom order CTA
- [x] 04-05-PLAN.md — Shop page (for-sale grid) + Contact page (email, Instagram, stub CTAs)
- [ ] 04-06-PLAN.md — SiteHeader NavLinks update + final build+test checkpoint
**UI hint**: yes

### Phase 5: Inquiries & Email Delivery
**Goal**: Stand up the two inquiry forms (purchase and custom order) with spam protection and reliable transactional email via Resend with SPF/DKIM/DMARC configured.
**Depends on**: Phase 4
**Requirements**: CUST-01, CUST-02, CUST-03, SHOP-04, CONT-02, CONT-03
**Success Criteria** (what must be TRUE):
  1. Visitor can submit a custom order request capturing what they want, quantity, free-form description, contact info, plus optional budget and timeline
  2. Visitor can submit a purchase inquiry from any for-sale piece's "Contact to buy" CTA, carrying the piece reference into the email
  3. Both forms reject spam via honeypot without blocking legitimate submissions
  4. Owner receives every submission as a deliverable email (SPF, DKIM, and DMARC pass) within seconds
**Plans**: 4 plans
Plans:
- [x] 05-01-PLAN.md — Dependencies (resend, react-hook-form, zod) + Zod schemas + honeypot utility + Wave 0 tests
- [x] 05-02-PLAN.md — Purchase inquiry form (/contact/purchase), server action, ShopCard + WorkDetail CTA updates
- [x] 05-03-PLAN.md — Custom order form (/custom-orders), server action, all required + optional fields
- [x] 05-04-PLAN.md — Resend DNS setup (SPF/DKIM/DMARC), env vars, end-to-end email verification checkpoint
**UI hint**: yes

### Phase 6: Polish & Launch
**Goal**: Close out launch readiness — SEO metadata on every page, AVIF image delivery, blur placeholders on ceramic images, responsive QA, e-commerce-chrome audit, and a written owner training guide for the CMS. I18N-04 (hreflang) is retired — site is Danish-only.
**Depends on**: Phase 5
**Requirements**: I18N-04, DSGN-02, DSGN-03, DSGN-04
**Success Criteria** (what must be TRUE):
  1. I18N-04 retired — site is Danish-only; no hreflang code needed (D-02 decision)
  2. Ceramics imagery loads via next/image with AVIF output and real blur placeholders from plaiceholder; Lighthouse performance scores ≥ 80 on mobile
  3. Every page renders cleanly on mobile, tablet, and desktop breakpoints with no horizontal scroll or broken layouts
  4. Site contains no e-commerce chrome — no cart icons, star ratings, stock counters, or discount badges
  5. Owner CMS guide committed at docs/cms-guide.md covering: add piece, mark sold, curate homepage, edit settings
**Plans**: 5 plans
Plans:
- [ ] 06-01-PLAN.md — Install plaiceholder + sharp, AVIF config in next.config.ts, remove next-intl, blur-placeholder utility + unit tests
- [ ] 06-02-PLAN.md — SEO infrastructure: baseMetadata, sitemap.ts, robots.ts, og-default.jpg, .env.example
- [ ] 06-03-PLAN.md — Apply blur placeholders: WorkCard, ShopCard, WorkDetail + RSC parents (gallery, homepage)
- [ ] 06-04-PLAN.md — generateMetadata on all 7 page files (layout + 6 routes)
- [ ] 06-05-PLAN.md — Owner CMS guide + Lighthouse QA checkpoint (DSGN-03 + DSGN-04 audit)
**UI hint**: yes

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 0/3 | Not started | - |
| 2. Content Model & CMS UX | 0/0 | Not started | - |
| 3. Gallery & Works | 0/0 | Not started | - |
| 4. Homepage, Shop & Contact | 0/6 | Planned | - |
| 5. Inquiries & Email Delivery | 0/4 | Planned | - |
| 6. Polish & Launch | 0/5 | Planned | - |

## Coverage

All 30 v1 requirements mapped to exactly one phase. No orphans, no duplicates.

| Phase | Requirements | Count |
|-------|-------------|-------|
| 1 | I18N-01, I18N-03, DSGN-01 | 3 |
| 2 | CMS-01, CMS-02, CMS-03, CMS-04, I18N-02 | 5 |
| 3 | GALL-01, GALL-02, GALL-03, GALL-04 | 4 |
| 4 | HOME-01, HOME-02, HOME-03, HOME-04, SHOP-01, SHOP-02, SHOP-03, SHOP-04, CONT-01 | 9 |
| 5 | CUST-01, CUST-02, CUST-03, SHOP-04 (shared CTA target), CONT-02, CONT-03 | 5 unique + 1 shared |
| 6 | I18N-04, DSGN-02, DSGN-03, DSGN-04 | 4 |

**Total unique v1 requirements mapped:** 30/30

**Note on SHOP-04:** The "Contact to buy" CTA itself ships in Phase 4 (the button exists), but the inquiry form it opens is built in Phase 5. The requirement is owned by Phase 4; Phase 5 completes its behavior.

**Note on I18N-04:** Hreflang is retired from v1 scope. The site is Danish-only (i18n removed in quick task 260420-c1o). I18N-04 appears in Phase 6 plans as a formal retirement decision, not as code work.

---
*Roadmap created: 2026-04-18*
*Updated: 2026-04-18 — Phase 1 plans added (01-01, 01-02, 01-03)*
*Updated: 2026-04-19 — Phase 4 plans added (04-01 through 04-06)*
*Updated: 2026-04-20 — Phase 5 plans added (05-01 through 05-04)*
*Updated: 2026-04-21 — Phase 6 plans added (06-01 through 06-05); I18N-04 retired*
