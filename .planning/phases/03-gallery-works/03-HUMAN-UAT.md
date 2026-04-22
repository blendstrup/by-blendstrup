---
status: complete
phase: 03-gallery-works
source: [03-VERIFICATION.md]
started: 2026-04-19T00:00:00Z
updated: 2026-04-22T00:00:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Gallery grid layout
expected: 3 columns ≥1024px, 2 columns 640–1023px, 1 column mobile; cards 4:5 aspect ratio, subtle hover scale
result: pass

### 2. Status badge rendering
expected: Terracotta "For Sale" badge overlaid on card image for available works
result: pass

### 3. Filter tab interaction
expected: Clicking "For Sale" tab updates URL to ?filter=for-sale and filters grid; active tab has terracotta bottom border
result: pass

### 4. Detail page layout
expected: 55/45 desktop grid (image left, info right); stacked single column on mobile
result: pass

### 5. Available CTA
expected: Terracotta "Contact to buy" button linking to /custom-orders
result: pass

### 6. Sold treatment
expected: Sold message text + ghost "Commission something similar →" CTA; no primary button
result: pass

### 7. 404 for unknown slug
expected: /en/gallery/does-not-exist returns Next.js 404 page
result: pass

### 8. Language toggle on gallery
expected: Toggle DA↔EN updates URL and navigation copy
result: pass

### 9. Language toggle on detail
expected: Title and description switch to correct locale field (titleDa/titleEn)
result: pass

## Summary

total: 9
passed: 9
issues: 0
pending: 0
skipped: 0
blocked: 0

## Gaps
