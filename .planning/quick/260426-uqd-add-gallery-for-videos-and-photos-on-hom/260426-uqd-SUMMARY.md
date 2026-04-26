---
phase: 260426-uqd
plan: "01"
subsystem: CMS schema + UI components
tags: [media-gallery, keystatic, next-image, video, works, homepage]
dependency_graph:
  requires: []
  provides: [mediaGallery-schema, MediaGallery-component]
  affects: [keystatic.config.ts, WorkDetail, homepage]
tech_stack:
  added: []
  patterns: [async-server-component, blur-placeholder, keystatic-fields-array]
key_files:
  created:
    - src/components/MediaGallery.tsx
    - public/images/gallery/.gitkeep
    - public/videos/gallery/.gitkeep
  modified:
    - keystatic.config.ts
    - src/components/WorkDetail.tsx
    - src/app/(site)/gallery/[slug]/page.tsx
    - src/app/(site)/page.tsx
    - messages/da.json
decisions:
  - "Reused existing getBlurDataUrl pattern from WorkDetail for gallery image blur placeholders"
  - "Used border border-clay on gallery item containers to match existing detail images style"
  - "Homepage gallery section placed after custom orders section with matching border-clay border-t separator"
metrics:
  duration: ~15min
  completed: 2026-04-26
---

# Phase 260426-uqd: Add Media Gallery for Videos and Photos Summary

**One-liner:** Keystatic `mediaGallery` array field on works + homepage, with a reusable async `MediaGallery` server component rendering a 2/3-col Japandi grid supporting image blur placeholders and muted autoplay video.

## Tasks Completed

| # | Name | Commit | Files |
|---|------|--------|-------|
| 1 | Extend Keystatic schema with mediaGallery array on works and homepage | a9bb116 | keystatic.config.ts, public/images/gallery/.gitkeep, public/videos/gallery/.gitkeep |
| 2 | Build MediaGallery component and wire into WorkDetail + homepage | c14c9cb | src/components/MediaGallery.tsx, src/components/WorkDetail.tsx, src/app/(site)/gallery/[slug]/page.tsx, src/app/(site)/page.tsx, messages/da.json |

## What Was Built

- **Keystatic schema:** `mediaGallery` `fields.array` added to both the `works` collection (after `video`) and `homepage` singleton (after `heroVideo`). Each item has: `type` (select: image/video), `image`, `imageAlt`, `video`, `title`, `tags` array.
- **Upload directories:** `public/images/gallery/` and `public/videos/gallery/` pre-created with `.gitkeep` files.
- **`MediaGallery` component:** Async server component at `src/components/MediaGallery.tsx`. Renders a `grid-cols-2 lg:grid-cols-3` responsive grid. Image items use `next/image` with `getBlurDataUrl` blur placeholder. Video items use `<video autoPlay muted loop playsInline>`. Optional `title` and `tags` chips render below each item.
- **`WorkDetail` wired:** Accepts `mediaGallery?: MediaGalleryItem[]` prop; renders `<MediaGallery items={mediaGallery} heading="Galleri" />` in a `<section className="mt-16">` after the detail images grid.
- **Gallery detail page wired:** `src/app/(site)/gallery/[slug]/page.tsx` casts `work.mediaGallery` to `MediaGalleryItem[]` and passes it to `<WorkDetail>`.
- **Homepage wired:** Gallery section rendered after custom orders section when `homepageData.mediaGallery` has items.
- **da.json:** `home.gallery.heading = "Galleri"` added.

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — all data sources are wired from Keystatic reader. Gallery sections are conditionally rendered only when items exist, so empty state is invisible (intentional).

## Threat Flags

None — no new network endpoints, auth paths, or trust boundary changes introduced. Gallery media served as static public assets (T-uqd-02, T-uqd-03 accepted in plan threat model).

## Self-Check: PASSED

- FOUND: src/components/MediaGallery.tsx
- FOUND: public/images/gallery/.gitkeep
- FOUND: public/videos/gallery/.gitkeep
- FOUND commit: a9bb116
- FOUND commit: c14c9cb
