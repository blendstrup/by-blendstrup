# Requirements: By Blendstrup

**Defined:** 2026-04-18
**Core Value:** A visitor should immediately feel the quality and uniqueness of By Blendstrup's ceramics — imagery and products must be front and center, so every page makes them want to own a piece.

## v1 Requirements

### Homepage

- [ ] **HOME-01**: Visitor sees a hero section with large, full-bleed imagery of featured ceramics chosen by the owner
- [ ] **HOME-02**: Visitor sees a shop preview section showing currently for-sale pieces
- [ ] **HOME-03**: Visitor sees a custom order call-to-action that links to the custom order form
- [ ] **HOME-04**: Visitor sees an About section on the homepage describing the maker and process (no separate About page)

### Gallery

- [ ] **GALL-01**: Visitor can browse all ceramic pieces in a uniform grid
- [ ] **GALL-02**: Visitor can click any piece to view a detail page with full images and description
- [ ] **GALL-03**: Visitor can filter the gallery to show only currently for-sale pieces
- [ ] **GALL-04**: Sold pieces remain visible in the gallery with a "Sold" label and a custom order CTA

### Shop

- [ ] **SHOP-01**: Visitor can view a dedicated for-sale listings page showing only currently available pieces
- [ ] **SHOP-02**: Each for-sale piece displays its price
- [ ] **SHOP-03**: Each for-sale piece displays a lead time or availability note set by the owner
- [ ] **SHOP-04**: Each for-sale piece has a "Contact to buy" CTA that opens a purchase inquiry form

### Custom Orders

- [ ] **CUST-01**: Visitor can submit a custom order request with: what they want, quantity, free-form description, contact info
- [ ] **CUST-02**: Custom order form includes optional budget range and desired timeline fields
- [ ] **CUST-03**: Custom order form has spam protection (Turnstile or honeypot)

### Bilingual

- [ ] **I18N-01**: Visitor can switch between Danish and English via a header toggle
- [ ] **I18N-02**: All page content (UI labels, CMS content, form text) is available in both Danish and English
- [ ] **I18N-03**: Language preference is reflected in the URL path (/da/... and /en/...)
- [ ] **I18N-04**: hreflang tags are present so search engines index the correct language version

### Contact

- [ ] **CONT-01**: Visitor can find a contact page with general contact information
- [ ] **CONT-02**: Purchase inquiry emails are delivered reliably to the owner (SPF/DKIM/DMARC configured)
- [ ] **CONT-03**: Custom order inquiry emails are delivered reliably to the owner

### CMS

- [ ] **CMS-01**: Owner can add a new ceramic piece with: images, title (DA + EN), description (DA + EN), category, for-sale status, price, lead time note
- [ ] **CMS-02**: Owner can set draft/published status on any piece — drafts are not visible on the public site
- [ ] **CMS-03**: Owner can curate the homepage — select which pieces appear in the hero and shop preview sections
- [ ] **CMS-04**: All CMS fields have clear labels and helper text usable by a non-technical owner

### Design & Performance

- [ ] **DSGN-01**: Site uses a Japandi/minimalist visual design — muted earth tones, generous whitespace, clean serif+sans typography
- [ ] **DSGN-02**: Ceramics photography is displayed at high quality with fast load times (next/image with AVIF, blur placeholders)
- [ ] **DSGN-03**: Site is fully responsive across mobile, tablet, and desktop
- [ ] **DSGN-04**: Site has no e-commerce chrome (no cart icons, star ratings, stock counters, or discount badges)

## v2 Requirements

### Content Pages

- **PAGE-01**: Dedicated About page with the maker's full story, process, and philosophy
- **PAGE-02**: Care instructions page for handmade ceramics
- **PAGE-03**: FAQ page (ordering, shipping, custom work)

### Shop Enhancements

- **SHOP-05**: Auto-reply email to customer when they submit a purchase inquiry
- **SHOP-06**: Collections or series grouping for pieces

### Gallery Enhancements

- **GALL-05**: Lightbox zoom for piece images
- **GALL-06**: Series/collection browse view

### Custom Order Enhancements

- **CUST-04**: Auto-reply email to customer confirming custom order receipt (in their language)
- **CUST-05**: Option for customer to upload a reference image with their custom order

### Newsletter

- **NEWS-01**: Visitor can sign up for a newsletter to be notified of new works
- **NEWS-02**: Owner can send newsletter updates via integrated service

## Out of Scope

| Feature | Reason |
|---------|--------|
| Online payments / checkout | Owner preference — purchases handled offline, avoids payment processing fees and complexity |
| Customer accounts / login | Not needed for contact-to-buy model |
| Inventory / stock tracking | Owner manages manually; automating adds complexity without proportional benefit |
| Star ratings / reviews | Would cheapen the premium craft positioning |
| "You may also like" carousels | E-commerce chrome — against Japandi restraint and premium feel |
| Mobile app | Web-first; ceramics shoppers use desktop/mobile web |
| Real-time availability updates | Static site; owner marks items as sold manually via CMS |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| HOME-01 | Phase 4 | Pending |
| HOME-02 | Phase 4 | Pending |
| HOME-03 | Phase 4 | Pending |
| HOME-04 | Phase 4 | Pending |
| GALL-01 | Phase 3 | Pending |
| GALL-02 | Phase 3 | Pending |
| GALL-03 | Phase 3 | Pending |
| GALL-04 | Phase 3 | Pending |
| SHOP-01 | Phase 4 | Pending |
| SHOP-02 | Phase 4 | Pending |
| SHOP-03 | Phase 4 | Pending |
| SHOP-04 | Phase 4 | Pending |
| CUST-01 | Phase 5 | Pending |
| CUST-02 | Phase 5 | Pending |
| CUST-03 | Phase 5 | Pending |
| I18N-01 | Phase 1 | Pending |
| I18N-02 | Phase 2 | Pending |
| I18N-03 | Phase 1 | Pending |
| I18N-04 | Phase 6 | Pending |
| CONT-01 | Phase 4 | Pending |
| CONT-02 | Phase 5 | Pending |
| CONT-03 | Phase 5 | Pending |
| CMS-01 | Phase 2 | Pending |
| CMS-02 | Phase 2 | Pending |
| CMS-03 | Phase 2 | Pending |
| CMS-04 | Phase 2 | Pending |
| DSGN-01 | Phase 1 | Pending |
| DSGN-02 | Phase 6 | Pending |
| DSGN-03 | Phase 6 | Pending |
| DSGN-04 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 30 total
- Mapped to phases: 30
- Unmapped: 0

---
*Requirements defined: 2026-04-18*
*Last updated: 2026-04-18 after roadmap creation*
