---
phase: quick-260428-vrt
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - keystatic.config.ts
  - src/components/MediaGallery.tsx
  - src/components/WorkDetail.tsx
  - src/app/(site)/page.tsx
  - src/__tests__/keystatic-schema.test.ts
  - src/lib/video-embed.ts
  - content/works/bowl-test/index.yaml
  - content/homepage.yaml
autonomous: true
requirements:
  - QUICK-260428-vrt
must_haves:
  truths:
    - "Owner can upload an .mp4 to any of the 4 video fields via Keystatic admin UI"
    - "Uploaded videos land in public/videos/ subdirectories and are served as static assets"
    - "The site renders <video autoPlay muted loop playsInline preload=\"metadata\"> for every video field, never an iframe"
    - "When an optional poster image is set, the <video> element uses it via the poster attribute; otherwise it falls back to bg-oat"
    - "src/lib/video-embed.ts is removed and no file imports toEmbedUrl"
    - "Existing seed content with stale YouTube/Vimeo or path-style URLs no longer breaks Keystatic schema validation"
  artifacts:
    - path: "keystatic.config.ts"
      provides: "4 fields.file video fields (works.video, works.mediaGallery[].video, homepage.heroVideo, homepage.mediaGallery[].video) + matching optional poster image siblings"
      contains: "fields.file"
    - path: "src/components/MediaGallery.tsx"
      provides: "Native <video> rendering with poster fallback to bg-oat"
      contains: "<video"
    - path: "src/components/WorkDetail.tsx"
      provides: "Native <video> for works.video with poster fallback"
      contains: "<video"
    - path: "src/app/(site)/page.tsx"
      provides: "Native <video> for homepage.heroVideo with poster fallback"
      contains: "<video"
  key_links:
    - from: "Keystatic file field"
      to: "public/videos/* on disk"
      via: "directory + publicPath config"
      pattern: "directory: 'public/videos"
    - from: "<video> element"
      to: "uploaded mp4 path"
      via: "src attribute resolved from Keystatic file field"
      pattern: "src=\\{.*video"
    - from: "<video> element"
      to: "optional poster image"
      via: "poster attribute (omitted when absent — falls back to bg-oat container)"
      pattern: "poster=\\{"
---

<objective>
Switch Keystatic's 4 video fields from `fields.url` (YouTube/Vimeo embeds via iframe) to `fields.file` (self-hosted .mp4 in `public/videos/`), and render every video with a native `<video>` element. Add an optional sibling poster image to each video field. Hard cutover — no backward compatibility for existing URL values.

Purpose: Owner currently has to upload videos to YouTube/Vimeo first, copy a public URL into Keystatic, and accept an iframe-shaped chrome embed. Self-hosted .mp4s with `<video autoplay muted loop playsInline>` give true background-loop semantics with zero third-party chrome, no cookie/tracking concerns, and a simpler owner workflow (drag-and-drop in Keystatic). The infrastructure is partially in place — `public/videos/{gallery,works,hero}/` directories already exist and one seed entry already references `/videos/...` paths that the URL field can't validate.

Output:
- 4 schema fields converted (works.video, works.mediaGallery[].video, homepage.heroVideo, homepage.mediaGallery[].video) with optional sibling poster image fields.
- 3 render sites updated (MediaGallery, WorkDetail, homepage hero).
- `src/lib/video-embed.ts` deleted; all imports gone.
- Existing seed content cleaned so `pnpm test` and the Keystatic admin UI both load without schema errors.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@CLAUDE.md
@keystatic.config.ts
@src/lib/video-embed.ts
@src/components/MediaGallery.tsx
@src/components/WorkDetail.tsx
@src/app/(site)/page.tsx
@src/__tests__/keystatic-schema.test.ts
@content/works/bowl-test/index.yaml
@content/homepage.yaml

<interfaces>
<!-- Key shapes the executor needs. Extracted from codebase — no exploration needed. -->

Keystatic file field syntax (from @keystatic/core 0.5.50):
```ts
fields.file({
  label: "Video",
  description: "...",
  directory: "public/videos/works",
  publicPath: "/videos/works/",
  validation: { isRequired: false },
  // Restrict to .mp4 only:
  // Keystatic 0.5.x exposes either a `validation.extension` constraint or an
  // `accept` HTML hint depending on field. If `extension` is unsupported in
  // this version, set the HTML `accept: "video/mp4"` and document the .mp4
  // expectation in the field `description` so the admin UI is unambiguous.
})
```

The file field returns a string URL path (e.g. `/videos/works/my-piece/video.mp4`) at read time via `createReader`, just like `fields.image`. Treat it as `string | null` in the consumer.

Existing render pattern to mirror (from MediaGallery.tsx:44-69) — keep the same:
- container: `relative aspect-4/5 overflow-hidden rounded-2xl bg-oat`
- empty fallback: `<div className="absolute inset-0 bg-oat" />`
- absolute-positioned media: `className="absolute inset-0 h-full w-full object-cover"`

Required <video> attributes (background-loop semantics, matches current YouTube `controls=0` + Vimeo `background=1`):
```tsx
<video
  src={videoSrc}
  poster={posterSrc ?? undefined}
  autoPlay
  muted
  loop
  playsInline
  preload="metadata"
  controls={false}
  aria-label={altText}
  className="absolute inset-0 h-full w-full object-cover"
/>
```

Existing MediaGalleryItem interface (will need extension):
```ts
interface MediaGalleryItem {
  type: "image" | "video"
  image: string | null
  imageAlt: string
  video: string | null
  title: string
  tags: string[]
  // ADD: poster: string | null
}
```
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Schema cutover — replace 4 url fields with file fields + optional poster siblings, clean seed content</name>
  <files>keystatic.config.ts, src/__tests__/keystatic-schema.test.ts, content/works/bowl-test/index.yaml, content/homepage.yaml</files>
  <action>
**Edit keystatic.config.ts** — replace each of the 4 `fields.url` video fields with a `fields.file` field, and add a new optional sibling `videoPoster` (works.video, homepage.heroVideo) or `poster` (gallery items) image field next to each. Keep the existing localized alt/title sibling fields untouched. Use these directory layouts:

1. **`works.video` (line 109)** — replace with:
   ```ts
   video: fields.file({
     label: "Video",
     description: "Valgfri MP4-video til dette stykke. Vises i galleriet og på detaljesiden som baggrundsloop (muted autoplay, ingen kontroller). Kun .mp4.",
     directory: "public/videos/works",
     publicPath: "/videos/works/",
     validation: { isRequired: false },
   }),
   videoPoster: fields.image({
     label: "Video poster (valgfri)",
     description: "Valgfrit posterbillede vist før videoen indlæses. Hvis tomt, vises en oat-baggrund.",
     directory: "public/images/works/posters",
     publicPath: "/images/works/posters/",
   }),
   ```

2. **`works.mediaGallery[].video` (line 134)** — replace with:
   ```ts
   video: fields.file({
     label: "Video (MP4)",
     description: "Valgfri MP4-video til dette mediaelement. Kun .mp4.",
     directory: "public/videos/gallery",
     publicPath: "/videos/gallery/",
     validation: { isRequired: false },
   }),
   poster: fields.image({
     label: "Video poster (valgfri)",
     description: "Valgfrit posterbillede vist før videoen indlæses.",
     directory: "public/images/gallery/posters",
     publicPath: "/images/gallery/posters/",
   }),
   ```

3. **`homepage.heroVideo` (line 206)** — replace with:
   ```ts
   heroVideo: fields.file({
     label: "Hero-video (MP4)",
     description: "Valgfri MP4-video som baggrundsloop i heroen. Muted autoplay. Når sat, erstatter herobilledet. Kun .mp4.",
     directory: "public/videos/hero",
     publicPath: "/videos/hero/",
     validation: { isRequired: false },
   }),
   heroVideoPoster: fields.image({
     label: "Hero-video poster (valgfri)",
     description: "Valgfrit posterbillede vist før hero-videoen indlæses.",
     directory: "public/images/hero",
     publicPath: "/images/hero/",
   }),
   ```

4. **`homepage.mediaGallery[].video` (line 288)** — same shape as #2 but with `directory: "public/videos/gallery"` (already shared with works mediaGallery — fine, Keystatic disambiguates per-item).

**.mp4 enforcement:** Keystatic 0.5.x may not expose a `validation.extension` option on `fields.file`. If TypeScript compilation rejects an `extension` key, omit it and rely on:
  - The Danish description text "Kun .mp4." in every video field.
  - A runtime guard in render code (Task 2) that bails early on non-.mp4 src values.
DO NOT introduce a custom validator that would prevent Keystatic from saving — the description + render guard is sufficient for a single-owner CMS.

**Update src/__tests__/keystatic-schema.test.ts** — add a new `describe("Phase quick-260428-vrt — file-based video fields")` block with these assertions (use the same `KeystaticConfigShape` cast pattern already in the file):
  - `cfg.collections.works.schema.video` exists.
  - `cfg.collections.works.schema.videoPoster` exists.
  - `cfg.singletons.homepage.schema.heroVideo` exists.
  - `cfg.singletons.homepage.schema.heroVideoPoster` exists.
  - The `works.schema.video` field's `kind` (or whatever the internal discriminator is — inspect the runtime shape with a quick `console.log` during dev if unclear) is NOT a url-shaped field. The simplest portable assertion: `expect(JSON.stringify(cfg.collections.works.schema.video)).not.toContain("url")` — this catches the regression that "the field is still fields.url" without coupling to Keystatic internals.
  - Existing tests must still pass.

**Clean seed content** so Keystatic doesn't reject the YAML on next admin load:
- `content/works/bowl-test/index.yaml` lines 14-19 — both `mediaGallery` items currently have `video: /videos/gallery/bowl-test/mediaGallery/{0,1}/video.mp4`. The new file field will accept these paths IF the files actually exist on disk at those locations. Verify with `ls public/videos/gallery/bowl-test/mediaGallery/0/video.mp4`. If the files do NOT exist, replace those entries with empty stubs:
  ```yaml
  mediaGallery: []
  ```
  and note in the task summary that the owner must re-upload via Keystatic admin. If the files DO exist, leave the YAML as-is — the new file field reads file paths in the same shape.
- `content/homepage.yaml` — already has `mediaGallery: []` and no `heroVideo` key. Nothing to change.

DO NOT touch `src/lib/video-embed.ts` yet — Task 2 deletes it after the consumers stop importing it.
  </action>
  <verify>
    <automated>pnpm test -- keystatic-schema && pnpm tsc --noEmit</automated>
  </verify>
  <done>
- 4 video fields are `fields.file`, each with a sibling optional poster image field.
- `keystatic-schema.test.ts` asserts the new field shape and passes.
- `pnpm tsc --noEmit` is clean (no schema-shape regressions).
- Seed YAML matches the new schema (either valid file paths or empty arrays).
  </done>
</task>

<task type="auto">
  <name>Task 2: Render cutover — replace iframe + toEmbedUrl with native &lt;video&gt; in 3 sites, delete video-embed.ts</name>
  <files>src/components/MediaGallery.tsx, src/components/WorkDetail.tsx, src/app/(site)/page.tsx, src/lib/video-embed.ts</files>
  <action>
**1. Update `src/components/MediaGallery.tsx`:**

a. Remove the `import { toEmbedUrl } from "@/lib/video-embed"` line.

b. Extend the `MediaGalleryItem` interface to add `poster: string | null`:
   ```ts
   export interface MediaGalleryItem {
     type: "image" | "video"
     image: string | null
     imageAlt: string
     video: string | null
     poster: string | null  // NEW
     title: string
     tags: string[]
   }
   ```

c. Replace the iframe render branch (current lines 41-55) with a native `<video>` element. The new structure inside the `aspect-4/5` container, video branch:
   ```tsx
   {item.type === "video" ? (
     item.video && item.video.endsWith(".mp4") ? (
       <video
         src={item.video}
         poster={item.poster ?? undefined}
         autoPlay
         muted
         loop
         playsInline
         preload="metadata"
         controls={false}
         aria-label={item.imageAlt || item.title || "Video"}
         className="absolute inset-0 h-full w-full object-cover"
       />
     ) : (
       <div className="absolute inset-0 bg-oat" />
     )
   ) : item.image ? ( /* unchanged */ ) : (
     <div className="absolute inset-0 bg-oat" />
   )}
   ```
   The `.endsWith(".mp4")` guard is the runtime enforcement of the .mp4-only rule from locked decision #1 — it silently no-ops on legacy values rather than crashing.

**2. Update `src/components/WorkDetail.tsx`:**

a. Remove the `import { toEmbedUrl } from "@/lib/video-embed"` line.

b. Extend the `WorkDetailProps` interface to add `videoPoster?: string | null` next to `video?: string | null`.

c. Update the `WorkDetail` function signature destructure to include `videoPoster`.

d. Delete the `const embedSrc = toEmbedUrl(video)` line.

e. Replace the primary-media rendering (current lines 51-77) with:
   ```tsx
   <div className="relative w-full">
     {video && video.endsWith(".mp4") ? (
       <div className="relative aspect-4/5 w-full overflow-hidden rounded-2xl bg-oat">
         <video
           src={video}
           poster={videoPoster ?? undefined}
           autoPlay
           muted
           loop
           playsInline
           preload="metadata"
           controls={false}
           aria-label={title}
           className="absolute inset-0 h-full w-full object-cover"
         />
       </div>
     ) : images.length > 0 ? (
       /* unchanged image branch */
     ) : (
       <div className="relative aspect-4/5 rounded-2xl bg-oat" />
     )}
   </div>
   ```

f. Update the call site (the consumer that passes props to `<WorkDetail>` — likely `src/app/(site)/works/[slug]/page.tsx` or similar; if not yet wired through, the schema read will need to pass `videoPoster: entry.videoPoster ?? null`). Search for `<WorkDetail` usages and add the new prop. If the call site is out of scope of the listed files, leave a clear `TODO(260428-vrt):` comment in `WorkDetail.tsx` rather than silently breaking the build — but prefer wiring it through if the file is small.

g. Update the `mediaGallery` mapping at the bottom of `WorkDetail.tsx` (line 157) to include `poster` from each item if the consumer here builds `MediaGalleryItem`s. If the items are already typed as `MediaGalleryItem[]`, ensure the upstream construction passes `poster`.

**3. Update `src/app/(site)/page.tsx`:**

a. Remove the `import { toEmbedUrl } from "@/lib/video-embed"` line.

b. Delete `const heroEmbedSrc = toEmbedUrl(homepageData?.heroVideo as string | null)`.

c. Compute new locals:
   ```ts
   const heroVideoSrc =
     typeof homepageData?.heroVideo === "string" &&
     homepageData.heroVideo.endsWith(".mp4")
       ? homepageData.heroVideo
       : null
   const heroVideoPoster =
     typeof homepageData?.heroVideoPoster === "string"
       ? homepageData.heroVideoPoster
       : null
   const heroImage = heroVideoSrc ? null : (heroWork?.images?.[0] ?? null)
   ```

d. Replace the `<iframe>` block (lines 87-95) with:
   ```tsx
   {heroVideoSrc ? (
     <video
       src={heroVideoSrc}
       poster={heroVideoPoster ?? undefined}
       autoPlay
       muted
       loop
       playsInline
       preload="metadata"
       controls={false}
       aria-hidden="true"
       tabIndex={-1}
       className="absolute inset-0 h-full w-full object-cover"
     />
   ) : heroImage?.image ? ( /* unchanged image branch */ ) : null}
   ```

e. Update the `mediaGallery` mapping at the bottom of the file (lines 268-289) to also pass `poster: (item.poster as string | null) ?? null` in the per-item shape, and add `poster: string | null` to the inline TypeScript type literal.

**4. Delete `src/lib/video-embed.ts`** — only AFTER steps 1-3 above have been saved, so the file is no longer imported. Verify no remaining imports first:
   ```sh
   grep -r "video-embed\|toEmbedUrl" --include="*.ts" --include="*.tsx" src/
   ```
   This grep MUST return zero results before deletion. There is no test file for `video-embed.ts` to remove (verified — the test directory contains no `video-embed.test.ts`).

DO NOT add new dependencies. DO NOT add a poster-generation pipeline (out of scope — owner uploads posters manually as image files when desired). DO NOT change the existing `bg-oat` empty-state styling.
  </action>
  <verify>
    <automated>grep -r "video-embed\|toEmbedUrl" --include="*.ts" --include="*.tsx" src/ ; pnpm test && pnpm tsc --noEmit && pnpm next build</automated>
  </verify>
  <done>
- The grep returns zero results (no stale imports).
- `src/lib/video-embed.ts` no longer exists on disk.
- All 3 render sites use `<video>` with the required attributes (`autoPlay`, `muted`, `loop`, `playsInline`, `preload="metadata"`, `controls={false}`).
- Each render site falls back to `bg-oat` when `video` is missing or non-.mp4.
- Each render site passes `poster={posterSrc ?? undefined}` when a poster is provided.
- `pnpm test`, `pnpm tsc --noEmit`, and `pnpm next build` all pass.
- The dev server (`pnpm dev`) loads `/keystatic` without schema errors and the homepage renders without console errors when `heroVideo` is empty.
  </done>
</task>

</tasks>

<verification>
**Schema layer:**
- `pnpm test -- keystatic-schema` passes including the new file-field assertions.
- `pnpm tsc --noEmit` is clean — Keystatic's generated types accept the new fields.

**Render layer:**
- `grep -rn "toEmbedUrl\|video-embed\|<iframe" src/` returns zero matches (no stale references, no surviving iframes for video).
- `pnpm next build` completes successfully.
- Manual smoke (optional, `pnpm dev` then visit `/`):
  - With `heroVideo` empty → hero shows the work image fallback (existing behaviour preserved).
  - With a placed `.mp4` in `public/videos/hero/` and matching `heroVideo` value in `content/homepage.yaml` → hero plays the video muted on autoplay, loops, no chrome visible.
  - With `videoPoster` set → poster image flashes before video starts.

**Dead code:**
- `ls src/lib/video-embed.ts` returns "No such file or directory".

**Seed content:**
- `pnpm dev` loads `/keystatic` admin without YAML validation errors on the works/homepage entries.
</verification>

<success_criteria>
1. Owner can drag-and-drop an `.mp4` into any of the 4 video fields in Keystatic admin and have it land in the correct `public/videos/{works,gallery,hero}/` subdirectory.
2. Every rendered video uses native `<video autoPlay muted loop playsInline preload="metadata" controls={false}>` — no iframes for video anywhere in the codebase.
3. Optional poster image renders via the `poster` HTML attribute when set; falls back to the existing `bg-oat` empty-state when absent.
4. `src/lib/video-embed.ts` is deleted and no source file imports `toEmbedUrl`.
5. All existing tests pass; new schema-shape tests pass; `tsc --noEmit` is clean; `next build` succeeds.
6. Existing seed content does not break Keystatic admin or `next build`.

**Note for owner:** Any pre-existing YouTube/Vimeo URLs that may have been entered in production content will need to be cleared in Keystatic admin and the corresponding `.mp4` files re-uploaded. Per project state, content is minimal/seeded — re-upload is trivial.
</success_criteria>

<output>
After completion, create `.planning/quick/260428-vrt-switch-keystatic-from-youtube-vimeo-url-/260428-vrt-SUMMARY.md` summarizing:
- Final schema field names and their `directory`/`publicPath` mappings.
- The 3 render sites updated and the exact `<video>` attribute set used.
- Confirmation that `src/lib/video-embed.ts` is deleted and grep returns zero `toEmbedUrl` references.
- Any seed-content adjustments made (and any owner re-upload work pending).
</output>
