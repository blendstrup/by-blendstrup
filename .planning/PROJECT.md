# By Blendstrup

## What This Is

By Blendstrup is a website for a handmade ceramics shop that showcases the owner's latest works, lists items currently available for purchase, and allows customers to submit custom order inquiries. It is not a traditional e-commerce shop — inventory changes often, purchases are handled via direct contact, and the overall experience is designed to convey the quality and craft behind each piece.

## Core Value

A visitor should immediately feel the quality and uniqueness of By Blendstrup's ceramics — imagery and products must be front and center, so every page makes them want to own a piece.

## Requirements

### Validated

- [x] Owner can manage all content via Keystatic CMS (no code required): add/edit products, upload images, highlight homepage features — *Validated in Phase 02: content-model-cms-ux (works collection, categories, homepage singleton, Admin UI smoke test)*
- [x] Bilingual support — Danish and English with a language toggle — *Partially validated in Phase 02: bilingual field structure (DA/EN sibling fields, i18n message keys); toggle validated in Phase 01*

### Active

- [ ] Homepage that showcases featured/highlighted ceramics with large imagery
- [ ] Works gallery — browsable collection of current and past pieces
- [ ] For-sale listings — items available to purchase with "contact to buy" flow
- [ ] Custom order inquiry form (what they want, quantity, contact info) — owner responds by email
- [ ] Bilingual support — Danish and English with a language toggle
- [ ] Owner can manage all content via Keystatic CMS (no code required): add/edit products, upload images, highlight homepage features
- [ ] Minimal, Japandi-inspired visual design — lots of white space, clean typography, muted earth tones
- [ ] Responsive across desktop and mobile

### Out of Scope

- Online payments / checkout — purchases handled offline (owner preference: simpler, no fees)
- User accounts / login for customers — not needed for contact-to-buy model
- Inventory management / stock tracking — owner manages this manually
- Blog or editorial content — not part of initial scope

## Context

- Shop owner is the sole ceramics maker and website content manager — not technically adept, so CMS UX is critical
- Content changes frequently (new works, items selling out, new custom order options)
- The "for sale" section differs from the general gallery: items are explicitly marked as available and have a contact/buy CTA
- Keystatic CMS chosen: git-based, free, no server required — content edits auto-deploy via Vercel
- Owner has an existing logo ready to integrate
- Visual identity: Japandi / minimalist — ceramics and photography should do the talking
- Frontend deployed on Vercel (free tier, pairs naturally with Next.js + Keystatic)

## Constraints

- **CMS**: Keystatic — git-based, completely free, no server or recurring cost
- **Hosting**: Vercel free tier — sufficient for this scale
- **Budget**: Zero ongoing infrastructure cost required
- **Tech stack**: Next.js (App Router) — best pairing with Keystatic and Vercel
- **CMS UX**: Must be usable by a non-technical owner without any developer help for routine content updates

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| No online payments | Simpler, no fees, fits the contact-based purchasing model the owner prefers | — Pending |
| Keystatic over Sanity/Payload | Free, git-based, no server cost, great Next.js integration | — Pending |
| Vercel hosting | Free tier, zero-config Next.js deployment, auto-deploys on Keystatic content edits | — Pending |
| Bilingual (DA + EN) | Owner wants to reach both Danish and international audiences | — Pending |
| Imagery-first layout | Products and craftsmanship should be immediately visible — design serves the ceramics, not vice versa | — Pending |
| pppnpm | Faster, disk-efficient package management | — Decided |
| Biome | Unified, fast tool for linting and formatting (replaces Biome/Biome) | — Decided |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-19 after Phase 02 complete — Keystatic content model delivered*
