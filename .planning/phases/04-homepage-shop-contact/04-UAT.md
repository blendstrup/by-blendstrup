---
status: complete
phase: 04-homepage-shop-contact
source: [04-01-SUMMARY.md, 04-02-SUMMARY.md, 04-03-SUMMARY.md, 04-04-SUMMARY.md, 04-05-SUMMARY.md, 04-06-SUMMARY.md]
started: 2026-04-22T00:00:00Z
updated: 2026-04-22T12:00:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Homepage hero
expected: Visit / (or /en). A full-bleed hero image fills the entire viewport height. A bouncing chevron-down arrow appears near the bottom of the hero. No "Coming soon" placeholder text.
result: pass

### 2. Homepage shop preview grid
expected: Below the hero, a section shows ShopCards for available works. Each card has a 4:5 image, price and lead time text in the lower overlay, and a "Contact to buy" link (desktop: fades in on hover; mobile: always visible below image). Max 6 cards shown.
result: pass

### 3. Homepage about section
expected: An about section with a warm background colour shows the studio/artist photo alongside multi-paragraph bio text from the CMS. Alt text is set on the photo. Paragraphs are separated correctly (no raw \n\n leaking into the rendered text).
result: pass

### 4. Homepage custom order CTA
expected: A centered section with a terracotta-coloured button labelled something like "Order custom" or "Bestil specialbestilling". Clicking it navigates to /custom-orders (may 404 — that's expected until Phase 5).
result: pass

### 5. Shop page
expected: Navigating to /shop (or /en/shop) shows a responsive grid of ShopCards — only published works with saleStatus=available are shown. If all works are sold/unlisted, an empty-state message appears instead of a blank page.
result: pass

### 6. Contact page
expected: /contact shows the shop's email as a clickable mailto: link and the Instagram handle as an external link that opens in a new tab. Both are pulled from CMS settings (not hardcoded).
result: pass

### 7. Navigation active states
expected: SiteHeader shows three nav links (Works, Shop, Contact). The link for the current page is visually distinguished (e.g. underlined or different opacity) from the inactive links.
result: pass

### 8. Sold item — badge and no CTA
expected: A work with saleStatus=sold that appears in the homepage shop preview shows a "Sold" status badge and does NOT show the "Contact to buy" CTA button. (Requires a sold item to be configured in CMS shopPreviewWorks — skip if not set up.)
result: pass

### 9. Language switch
expected: Toggling the locale (e.g. EN → DA) from any page updates all visible UI strings (nav labels, button text, headings) to Danish. Content (piece titles, descriptions) also switches. The URL updates to /da/... and back to /en/....
result: pass

## Summary

total: 9
passed: 9
issues: 0
pending: 0
skipped: 0
blocked: 0

## Gaps

[none yet]
