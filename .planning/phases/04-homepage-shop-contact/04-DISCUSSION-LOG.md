# Phase 4: Homepage, Shop & Contact - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-19
**Phase:** 04-homepage-shop-contact
**Areas discussed:** Homepage hero, About section shape, Shop page listing style, Contact page scope

---

## Homepage Hero

| Option | Description | Selected |
|--------|-------------|----------|
| Single full-bleed image | One hero piece fills the viewport width — maximum visual impact | ✓ |
| Two images side-by-side | Two hero pieces share the viewport width as a split | |
| Mosaic of up to 3 | One large + two smaller stacked images on the right | |

**User's choice:** Single full-bleed image

---

| Option | Description | Selected |
|--------|-------------|----------|
| Full viewport height (100vh) | Image fills the entire screen on load | ✓ |
| 75vh — shows a content peek | Tall but hints at content below the fold | |
| Fixed tall banner (~600px) | Consistent height regardless of screen size | |

**User's choice:** Full viewport height (100vh)

---

| Option | Description | Selected |
|--------|-------------|----------|
| Clean image only — no overlay | No text or overlay on the hero | |
| Subtle brand overlay | Small wordmark or tagline in a corner | |
| Scroll prompt only | Small scroll indicator at the bottom | ✓ |

**User's choice:** Scroll prompt only (no text, just a scroll indicator)

---

## About Section Shape

| Option | Description | Selected |
|--------|-------------|----------|
| Text + photo | Portrait/studio photo alongside bilingual artist statement | ✓ |
| Text only | Bilingual paragraphs, no photo | |
| Text + optional photo | Text required, photo optional in CMS | |

**User's choice:** Text + photo (both required)

---

| Option | Description | Selected |
|--------|-------------|----------|
| Own 'about' singleton | Dedicated Keystatic singleton with about fields | ✓ |
| Add fields to homepage singleton | About fields merged into existing homepage singleton | |

**User's choice:** Own 'about' singleton

---

| Option | Description | Selected |
|--------|-------------|----------|
| Photo left, text right | 50/50 or 40/60 split, photo on left | ✓ |
| Text left, photo right | Text leads, photo follows on the right | |
| Full-width text, photo below | Text at full width, image below | |

**User's choice:** Photo left, text right (stacks on mobile: photo above text)

---

## Shop Page Listing Style

| Option | Description | Selected |
|--------|-------------|----------|
| Below-image info row | Price + lead time as text row below the card image | |
| Overlay on image bottom | Translucent scrim across bottom of image with price + lead time | ✓ |
| Separate list view alongside grid | Horizontal rows — image left, details right | |

**User's choice:** Overlay on image bottom (dark scrim + text over image)

---

| Option | Description | Selected |
|--------|-------------|----------|
| On hover only (always visible mobile) | CTA fades in on hover; always visible on mobile | ✓ |
| Always visible below image | CTA always shown below each card | |
| Only on the detail page | Shop cards link to detail page; CTA is on detail page only | |

**User's choice:** On hover only on desktop, always visible on mobile

---

## Contact Page Scope

| Option | Description | Selected |
|--------|-------------|----------|
| Email + Instagram | Two primary craft seller channels | ✓ |
| Email only | Minimal — just the inquiry email | |
| Email + Instagram + physical location | Adds studio/city location | |

**User's choice:** Email + Instagram

---

| Option | Description | Selected |
|--------|-------------|----------|
| Links to future forms + raw contact info | Contact info + stub links to Phase 5 form routes | ✓ |
| Raw contact info only | Just email and Instagram, no form links until Phase 5 | |
| Contact info + brief purchasing explainer | Short bilingual explainer + contact details | |

**User's choice:** Links to future forms + raw contact info

---

| Option | Description | Selected |
|--------|-------------|----------|
| Extend the settings singleton | Add contactEmail + instagramHandle to existing settings | ✓ |
| New 'contact' singleton | Dedicated contact singleton | |

**User's choice:** Extend the settings singleton

---

## Claude's Discretion

- Scroll indicator design (arrow icon, animated chevron — keep minimal)
- About section background color (linen vs oat)
- Homepage sections order below hero (shop preview, about, custom order CTA)
- Shop page empty state
- Exact Keystatic field labels and helper text for the about singleton
- Whether ShopCard is a new component or an extended WorkCard variant
- About photo aspect ratio

## Deferred Ideas

None — discussion stayed within phase scope.
