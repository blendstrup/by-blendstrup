---
phase: 260426-uqd
plan: "01"
type: execute
wave: 1
depends_on: []
files_modified:
  - keystatic.config.ts
  - src/components/MediaGallery.tsx
  - src/components/WorkDetail.tsx
  - src/app/(site)/page.tsx
  - messages/da.json
  - public/videos/gallery/.gitkeep
autonomous: true
requirements: []
must_haves:
  truths:
    - "CMS owner can add media gallery items (image or video) to any work with optional title and tags"
    - "CMS owner can add media gallery items to the homepage with optional title and tags"
    - "Gallery items render in a responsive grid on work detail pages below the main media"
    - "Gallery items render in a new section on the homepage"
    - "Video gallery items autoplay muted and looping; image items use next/image with blur placeholder"
    - "Optional title appears below each item; optional tags appear as small chips below the title"
  artifacts:
    - path: keystatic.config.ts
      provides: "mediaGallery array field on works collection and homepage singleton"
      contains: "mediaGallery"
    - path: src/components/MediaGallery.tsx
      provides: "Reusable gallery component rendering items with title/tag overlays"
      exports: [MediaGallery]
    - path: src/components/WorkDetail.tsx
      provides: "MediaGallery wired below existing detail images"
    - path: src/app/(site)/page.tsx
      provides: "Homepage gallery section wired from homepage.mediaGallery"
  key_links:
    - from: keystatic.config.ts
      to: src/components/MediaGallery.tsx
      via: "mediaGallery field shape matches MediaGalleryItem type"
    - from: src/app/(site)/page.tsx
      to: src/components/MediaGallery.tsx
      via: "reader.singletons.homepage.read() → mediaGallery prop"
    - from: src/components/WorkDetail.tsx
      to: src/components/MediaGallery.tsx
      via: "work.mediaGallery prop"
---

<objective>
Add a curated media gallery (photos + videos, each with optional title and tags) to the homepage and work detail pages.

Purpose: Allow the owner to showcase process shots, studio footage, and styled imagery alongside products — enriching the brand experience without touching the product-focused primary images.
Output: Keystatic schema extended with `mediaGallery` array on works + homepage; reusable `MediaGallery` component; both pages wired.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@keystatic.config.ts
@src/components/WorkDetail.tsx
@src/app/(site)/page.tsx
@messages/da.json
</context>

<tasks>

<task type="auto">
  <name>Task 1: Extend Keystatic schema with mediaGallery array on works and homepage</name>
  <files>keystatic.config.ts, public/videos/gallery/.gitkeep</files>
  <action>
Add a `mediaGallery` field to both the `works` collection and the `homepage` singleton in `keystatic.config.ts`.

Each gallery item is a `fields.object` with:
- `type`: `fields.select` with options `[{ label: "Billede", value: "image" }, { label: "Video", value: "video" }]`, defaultValue `"image"` — tells the CMS owner which media type they are adding
- `image`: `fields.image({ label: "Billede", directory: "public/images/gallery", publicPath: "/images/gallery/" })` — only filled for image items
- `imageAlt`: `fields.text({ label: "Alt-tekst", description: "Beskriv billedet for skærmlæsere.", validation: { length: { max: 120 } } })` — required for a11y when image is used
- `video`: `fields.file({ label: "Video", directory: "public/videos/gallery", publicPath: "/videos/gallery/", validation: { isRequired: false } })` — only filled for video items
- `title`: `fields.text({ label: "Titel", description: "Valgfri billedtekst.", validation: { length: { max: 80 } } })` — optional, shown below item
- `tags`: `fields.array(fields.text({ label: "Tag" }), { label: "Tags", description: "Valgfrie tags (f.eks. 'stentøj', 'process').", itemLabel: (p) => p.value || "Tag" })` — optional tag chips

Wrap in `fields.array(fields.object({ ... }), { label: "Media galleri", description: "Valgfrie fotos og videoer med titel og tags.", itemLabel: (p) => p.fields.title.value || p.fields.type.value || "Mediaelement" })`.

Add to works collection schema after the existing `video` field.
Add to homepage singleton schema after the existing `heroVideo` field.

Create `public/videos/gallery/.gitkeep` and `public/images/gallery/.gitkeep` to pre-create upload directories.
  </action>
  <verify>
    <automated>cd /Users/jonasblendstrup/Documents/projects/byblendstrup/code/by-blendstrup && npx tsc --noEmit 2>&1 | head -20</automated>
  </verify>
  <done>
    - `keystatic.config.ts` has `mediaGallery` array field on both `works` collection and `homepage` singleton
    - `public/images/gallery/.gitkeep` and `public/videos/gallery/.gitkeep` exist
    - `npx tsc --noEmit` passes with no errors
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Build MediaGallery component and wire into WorkDetail + homepage</name>
  <files>src/components/MediaGallery.tsx, src/components/WorkDetail.tsx, src/app/(site)/page.tsx, messages/da.json</files>
  <action>
**1. Create `src/components/MediaGallery.tsx`**

Server component (no "use client"). Props:

```typescript
interface MediaGalleryItem {
  type: "image" | "video"
  image: string | null       // publicPath value
  imageAlt: string           // alt text
  video: string | null       // publicPath value
  title: string              // optional, empty string if not set
  tags: string[]             // optional, empty array if not set
}

interface MediaGalleryProps {
  items: MediaGalleryItem[]
  heading?: string           // section heading, e.g. "Galleri"
}
```

Each item renders in a `relative` div with `aspect-4/5` for consistent Japandi rhythm.

- If `type === "video"` and `video` is non-null: render `<video src={video} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" />`
- Otherwise if `image` is non-null: render `<Image src={image} alt={imageAlt} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" placeholder={blurDataUrl ? "blur" : "empty"} blurDataURL={blurDataUrl} />` — compute blur via `getBlurDataUrl` (import from `@/lib/blur-placeholder`), computed in parallel via `Promise.all` before rendering
- If neither: render a `div` with `bg-oat` placeholder

Below the media container: if `title` is non-empty, render `<p className="mt-3 font-sans text-sm text-ink">{title}</p>`. If `tags` array is non-empty, render a flex-wrap row of `<span>` chips with `rounded-full border border-clay px-2 py-0.5 font-sans text-xs text-stone`.

Grid layout: `grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6`

If `heading` is provided, render it as `<h2 className="mb-8 font-normal font-serif text-[22px] text-ink tracking-tight">{heading}</h2>` above the grid.

Import `getBlurDataUrl` from `@/lib/blur-placeholder` and `Image` from `next/image`. Make the component `async` since it calls `getBlurDataUrl`.

**2. Wire into `WorkDetail` component (`src/components/WorkDetail.tsx`)**

Add `mediaGallery?: MediaGalleryItem[]` to `WorkDetailProps`.

After the closing of the existing additional-images section (after `images.length > 1` block), add:

```tsx
{mediaGallery && mediaGallery.length > 0 && (
  <section className="mt-16">
    <MediaGallery items={mediaGallery} heading="Galleri" />
  </section>
)}
```

Import `MediaGallery` and `MediaGalleryItem` from `@/components/MediaGallery`.

**3. Wire into gallery detail page (`src/app/(site)/gallery/[slug]/page.tsx`)**

Pass `work.mediaGallery` to `<WorkDetail>`. Cast each item to `MediaGalleryItem` shape: `type`, `image`, `imageAlt`, `video`, `title` (default `""`), `tags` (default `[]`).

**4. Wire into homepage (`src/app/(site)/page.tsx`)**

After the custom orders section, read `homepageData.mediaGallery`. If it has items, add a new section:

```tsx
{homepageData?.mediaGallery && homepageData.mediaGallery.length > 0 && (
  <section className="border-clay border-t py-24">
    <div className="mx-auto max-w-screen-xl px-12 lg:px-16">
      <MediaGallery
        items={homepageData.mediaGallery.map(...cast to MediaGalleryItem shape...)}
        heading={da.home.gallery.heading}
      />
    </div>
  </section>
)}
```

**5. Add da.json key**

Add to `da.json` under `"home"`:
```json
"gallery": {
  "heading": "Galleri"
}
```

**Keystatic type note:** `mediaGallery` items read from Keystatic will have the shape of the `fields.object` definition. Cast defensively: `item.type as "image" | "video"`, `(item.image as string | null) ?? null`, `(item.video as string | null) ?? null`, `item.title ?? ""`, `(item.tags as string[]) ?? []`, `item.imageAlt ?? ""`.
  </action>
  <verify>
    <automated>cd /Users/jonasblendstrup/Documents/projects/byblendstrup/code/by-blendstrup && npx tsc --noEmit 2>&1 | head -20</automated>
  </verify>
  <done>
    - `src/components/MediaGallery.tsx` exists with `MediaGallery` async server component
    - `WorkDetail` accepts and renders `mediaGallery` prop
    - Gallery detail page passes `work.mediaGallery` to `WorkDetail`
    - Homepage renders gallery section when `homepageData.mediaGallery` has items
    - `da.json` has `home.gallery.heading`
    - `npx tsc --noEmit` passes
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <what-built>
    Media gallery support for works and homepage:
    - Keystatic CMS now has a "Media galleri" array field on each work and on the homepage, where the owner can add image/video items with optional title and tags
    - MediaGallery component renders a responsive 2/3-column grid with Japandi styling
    - Work detail pages show the gallery below existing detail images
    - Homepage shows a gallery section when items exist
  </what-built>
  <how-to-verify>
    1. Run `pnpm dev` and open `http://localhost:3000/keystatic`
    2. Open any work entry — verify a "Media galleri" section appears at the bottom of the form with an "Add" button
    3. Add a gallery item — set type to "Billede", upload an image, add a title like "Detalje" and a tag like "ler"
    4. Save the entry, then visit the work's detail page (e.g. `/gallery/{slug}`) — verify the gallery section "Galleri" appears below the detail images grid with the item, title chip, and tag chip
    5. Open the Homepage singleton in Keystatic — verify "Media galleri" is present
    6. Add a gallery item to the homepage, save, visit `http://localhost:3000` — verify a "Galleri" section appears after the custom orders section
    7. Test video type: add a gallery item with type "Video" and upload an MP4 — verify it autoplays muted in the grid
  </how-to-verify>
  <resume-signal>Type "approved" or describe issues found</resume-signal>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| CMS admin → file storage | Gallery items (images/videos) uploaded via Keystatic admin, written to /public directories |
| public/ → CDN/browser | Gallery media served as static assets, no server-side processing |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-uqd-01 | Spoofing | Keystatic admin upload | accept | Admin is behind existing admin-login auth (T-wd4 from prior task). No new auth surface. |
| T-uqd-02 | Tampering | public/images/gallery, public/videos/gallery | accept | Git-based storage; files committed via Keystatic. No user-facing upload path. |
| T-uqd-03 | Information Disclosure | mediaGallery items rendered publicly | accept | Gallery items are content the owner explicitly publishes. No PII or secrets in media files. |
| T-uqd-04 | Denial of Service | Large video files served from public/ | accept | Vercel CDN serves static assets; no server-side video processing. Owner advised 20MB limit in field description. |
</threat_model>

<verification>
- `npx tsc --noEmit` passes after all changes
- `pnpm dev` starts without errors
- Keystatic admin shows `mediaGallery` field on works entries and homepage singleton
- Detail page renders gallery when `work.mediaGallery` has items
- Homepage renders gallery section when `homepageData.mediaGallery` has items
</verification>

<success_criteria>
- CMS owner can add any number of image/video gallery items to a work or the homepage
- Each item optionally has a title (shown below) and tags (shown as chips)
- Gallery renders in a 2-column mobile / 3-column desktop responsive grid
- Videos autoplay muted + looping; images use next/image with blur placeholder
- TypeScript compiles without errors
</success_criteria>

<output>
After completion, create `.planning/quick/260426-uqd-add-gallery-for-videos-and-photos-on-hom/260426-uqd-SUMMARY-01.md` using the summary template.
</output>
