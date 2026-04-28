---
quick_id: 260428-vrt
description: Switch keystatic from YouTube/Vimeo URL embeds to self-hosted video uploads
date: 2026-04-28
status: complete
tasks_completed: 2
tasks_total: 2
---

# Quick Task 260428-vrt — Summary

**Description:** Switch keystatic setup from YouTube/Vimeo URL embeds to self-hosted video uploads.

## What changed

### Task 1 — Schema cutover (commit `7531a1d`)

Replaced the four `fields.url` video locations in `keystatic.config.ts` with Keystatic file fields, each paired with an optional sibling poster image field:

| Location | Before | After |
|---|---|---|
| `works.video` (line ~109) | `fields.url` | `fields.file` (`directory: 'public/videos/works'`, `publicPath: '/videos/works/'`) + `videoPoster` image |
| `homepage.featuredWorks[].video` (line ~134) | `fields.url` | `fields.file` (`public/videos/gallery`) + `videoPoster` image |
| `homepage.heroVideo` (line ~206) | `fields.url` | `fields.file` (`public/videos/hero`) + `heroVideoPoster` image |
| Gallery singleton items[].video (line ~288) | `fields.url` | `fields.file` (`public/videos/gallery`) + `videoPoster` image |

Locked decisions enforced:
- **`.mp4` only** — description-text guidance + render-time `.endsWith(".mp4")` guard (Keystatic 0.5.50 does not surface `validation.extension` on file fields).
- **Storage:** `public/videos/{works,gallery,hero}` — directories already existed.
- **Poster:** optional sibling image field on each video field; absent → `bg-oat` empty-state fallback (matches existing pattern).
- **Hard cutover:** field type replaced outright. No backward-compat for legacy URL strings.

Schema test (`src/__tests__/keystatic-schema.test.ts`) extended with 6 new assertions covering the file-field shape, directory, publicPath, and poster sibling presence at each location.

### Task 2 — Render cutover (commit `1531e68`)

Replaced the iframe rendering pipeline with native HTML `<video>` elements at three call sites:

- `src/components/MediaGallery.tsx` — `<iframe src={toEmbedUrl(...)}>` → `<video src={...} poster={...} autoPlay muted loop playsInline preload="metadata">` styled `absolute inset-0 h-full w-full object-cover` to match existing layout exactly.
- `src/components/WorkDetail.tsx` — same swap for the works detail page hero video.
- `src/app/(site)/page.tsx` — homepage hero video swapped from iframe to `<video>` with poster fallback.
- `src/app/(site)/gallery/[slug]/page.tsx` — call-site wired through `videoPoster` to MediaGallery items.

Background-loop semantics preserved: muted autoplay, looping, no controls, `playsInline` (iOS safari), `preload="metadata"` (page weight cap when multiple gallery videos render).

`src/lib/video-embed.ts` deleted — `toEmbedUrl` was the last consumer; no remaining imports across the codebase.

## Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit` | clean |
| `npx vitest run` | 7 files / 47 tests passed (incl. 6 new schema-shape assertions) |
| `npx biome check` (4 changed files) | clean |
| `grep -rn "toEmbedUrl\|video-embed\|<iframe" src/` | zero matches |
| `npx next build` | 6.4s, 11/11 pages |

## Files touched

- `keystatic.config.ts` (modified)
- `src/components/MediaGallery.tsx` (modified)
- `src/components/WorkDetail.tsx` (modified)
- `src/app/(site)/page.tsx` (modified)
- `src/app/(site)/gallery/[slug]/page.tsx` (modified)
- `src/__tests__/keystatic-schema.test.ts` (modified — 6 new assertions)
- `src/lib/video-embed.ts` (deleted)

## Notes

- No content edits required: existing seed `content/works/bowl-test/index.yaml` already pointed at on-disk `.mp4` paths under `public/videos/`. Verified files exist; new schema reads them directly.
- A user-side Keystatic admin commit (`9c3dc46`, `2fdae18` — "Update content/homepage") landed mid-execution and was fast-forward-merged cleanly into history.
- No backward-compat layer for legacy YouTube/Vimeo URL values: any pre-existing non-`.mp4` string in production content silently falls back to the `bg-oat` empty state (per the locked hard-cutover decision).

## Commits

- `7531a1d` — feat(quick-260428-vrt): switch 4 video fields from url to file in Keystatic schema
- `1531e68` — feat(quick-260428-vrt): render videos with native `<video>`, drop iframe + toEmbedUrl
