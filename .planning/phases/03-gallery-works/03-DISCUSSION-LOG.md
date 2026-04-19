# Phase 3: Gallery & Works - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-19
**Phase:** 03-gallery-works
**Areas discussed:** Grid layout & card anatomy, Filter UX, Detail page image layout, Sold piece treatment

---

## Grid layout & card anatomy

| Option | Description | Selected |
|--------|-------------|----------|
| 3-col desktop, 2-col tablet, 1-col mobile | Standard responsive photography grid | ✓ |
| 2-col desktop, 1-col mobile | Larger images, more editorial feel | |
| 4-col desktop, 2-col tablet, 2-col mobile | Denser grid, gallery-style | |

**User's choice:** 3-col desktop, 2-col tablet, 1-col mobile

---

| Option | Description | Selected |
|--------|-------------|----------|
| Image only | Full-bleed image, no text at rest | ✓ |
| Image + title below | Title in small serif below the image | |
| Image + title + price | Title and price visible on card | |

**User's choice:** Image only — ceramics photography speaks for itself; text on detail page.

---

| Option | Description | Selected |
|--------|-------------|----------|
| Corner badge on the image | Small pill label anchored to corner | ✓ |
| Subtle image overlay on sold | Desaturating overlay + centred "Sold" text | |
| Status only on hover / detail page | No badge on card at rest | |

**User's choice:** Corner badge — "Sold" in stone, "For sale" in terracotta.

---

## Filter UX

| Option | Description | Selected |
|--------|-------------|----------|
| Two toggle buttons: All / For Sale | Client-side, instant | |
| URL-based filter (?filter=for-sale) | Filter state in URL — bookmarkable, shareable | ✓ |
| No dedicated filter — separate /shop page | Gallery shows all; shop page handles for-sale only | |

**User's choice:** URL-based filter (`?filter=for-sale`)

---

| Option | Description | Selected |
|--------|-------------|----------|
| Left-aligned above the grid | Flush left | ✓ |
| Centred above the grid | Symmetrical placement | |

**User's choice:** Left-aligned

---

## Detail page image layout

| Option | Description | Selected |
|--------|-------------|----------|
| Vertical stack — images flow top-to-bottom | Simple, no JS, editorial | |
| Hero + thumbnail strip | Large main image + clickable thumbnails | |
| Side-by-side — images left, text right | Classic product layout | ✓ |

**User's choice:** Side-by-side

**Clarification follow-up:** After selecting "side-by-side" and then "below all images" in a second question (which appeared contradictory), user confirmed the intended layout:
- Desktop: first image left column, title + description + CTA right column. Additional images stack full-width below.
- Mobile: images then text, stacked vertically.

---

## Sold piece treatment

| Option | Description | Selected |
|--------|-------------|----------|
| Badge: 'Sold' • CTA: 'Commission something similar' | Warm, reframes sold piece as custom order inspiration | ✓ |
| Badge: 'Sold' • CTA: 'Order something like this' | Shorter CTA copy | |
| Badge: 'Unavailable' • CTA: 'Get in touch' | Softer language, less specific | |

**User's choice:** "Sold" badge + "Commission something similar →" CTA

---

| Option | Description | Selected |
|--------|-------------|----------|
| Custom order form page | Links directly to /[locale]/custom-orders | ✓ |
| Pre-fills form with piece as context | URL includes ?ref=slug for form pre-fill | |

**User's choice:** Direct link to custom order form — no pre-fill query param.

---

## Claude's Discretion

- URL path for gallery and detail pages (`/gallery` vs `/works`)
- Image aspect ratio on the grid
- Hover state on grid cards
- Max-width of detail page content column
- Empty state copy (no works, or no for-sale results)
- Exact Keystatic schema field additions for Phase 3

## Deferred Ideas

None — discussion stayed within phase scope.
