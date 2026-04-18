# Phase 2: Content Model & CMS UX - Research

**Researched:** 2026-04-18
**Domain:** Keystatic schema design — collections, singletons, fields API, bilingual content, reader API
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Each ceramic piece supports 1–8 images via a Keystatic `array` of `image` fields.
- **D-02:** First image in the array is the grid thumbnail / hero image. No explicit "primary image" picker — owner controls order.
- **D-03:** Each image requires a mandatory alt text field. Label should suggest the piece title as a starting point.
- **D-04:** Categories are a managed Keystatic `collection` — owner maintains the list via the CMS.
- **D-05:** A ceramic piece can belong to multiple categories (array of relationship or slug references to the categories collection).
- **D-06:** Category entries are bilingual — `nameDa` + `nameEn` fields per category entry.
- **D-07:** Works use a three-state `saleStatus` field: `available` | `sold` | `not-listed`.
- **D-08:** `price` and `leadTime` are free-form text fields. Only shown when `saleStatus` is `available`. Planner renders this conditionally on the public site — the CMS always shows both fields.
- **Bilingual pattern:** Sibling fields — `titleDa` + `titleEn`, `descriptionDa` + `descriptionEn` on the same document. RSC selects by locale.
- **Storage:** Do not change storage switching logic or `settings` singleton — extend `keystatic.config.ts` only by adding to `collections` and `singletons` keys.
- **Content directory:** Content stored in `content/` as YAML files committed to git (established pattern).

### Claude's Discretion

- **Homepage curation UX:** Whether to use relationship fields in the `homepage` singleton or featured flags on each work is open. Research recommends a pattern; planner decides.
- **About singleton:** Whether included in Phase 2 or deferred to Phase 4 is open. Planner decides based on dependency analysis.
- **Draft/published implementation detail:** Simple boolean `published` field per piece is specified; planner decides any extra validation or UX polish.

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.

</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CMS-01 | Owner can add a new ceramic piece with: images, title (DA+EN), description (DA+EN), category, for-sale status, price, lead time note | `works` collection schema covers all fields — see Standard Stack and Code Examples |
| CMS-02 | Owner can set draft/published status on any piece — drafts not visible publicly | `fields.checkbox` + reader-side filter pattern documented |
| CMS-03 | Owner can curate the homepage — select which pieces appear in hero and shop preview | `homepage` singleton with `fields.multiRelationship` — recommended pattern documented |
| CMS-04 | All CMS fields have clear labels and helper text usable by a non-technical owner | Every field in code examples includes `label` and `description` with plain-language copy |
| I18N-02 | All page content (UI labels and CMS content) available in both Danish and English | Sibling-field bilingual pattern throughout schema; public-facing UI strings extend `messages/en.json` and `messages/da.json` |

</phase_requirements>

---

## Summary

Phase 2 is purely a data layer phase: no public-facing pages, only the Keystatic Admin UI at `/keystatic`. The deliverable is an extended `keystatic.config.ts` with three new additions — a `works` collection, a `categories` collection, and a `homepage` singleton — plus any Danish/English UI strings (CMS labels are English-only in the admin; the public-facing message files get no new keys in this phase unless the planner determines otherwise).

The installed Keystatic version is `0.5.50` (verified from `node_modules`). All field types needed for this schema are available in this version: `fields.text`, `fields.checkbox`, `fields.select`, `fields.image`, `fields.array`, `fields.object`, `fields.relationship`, `fields.multiRelationship`, and `fields.slug`. The `multiRelationship` field is the correct primitive for D-05 (multiple categories per piece) and for the homepage curation singleton — it stores an array of slugs referencing another collection, renders a multi-select combobox in the Admin UI, and reads back as `string[]` via the Reader API.

The critical architectural point for Phase 2: `keystatic.config.ts` is the single config file. The existing `settings` singleton and storage switching logic must not be touched — only the `collections` and `singletons` keys are extended. All content lands in `content/` as YAML files (established by Phase 1 foundation). Images should be stored in `public/images/works/` with `publicPath: '/images/works/'` so `next/image` can serve them directly.

**Primary recommendation:** Use `fields.multiRelationship` for category references on works and for homepage curation picks. Use `fields.array(fields.object({...}))` for the multi-image structure. Keep all field labels in English (the Keystatic Admin UI is English-only by design). Public-facing translation strings for sale status labels and category filter labels are out of scope for this phase — they are consumed in Phase 3/4 and can be added to `messages/*.json` then.

---

## Standard Stack

### Core (installed, verified from node_modules)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@keystatic/core` | 0.5.50 | Schema definition, Admin UI, field primitives | Locked by project constraints |
| `@keystatic/next` | 5.0.4 | Next.js route handlers for Admin UI and API | Required companion for Next.js integration |

[VERIFIED: node_modules/@keystatic/core/package.json]

### Field Types Used in This Phase

| Field | API | Purpose |
|-------|-----|---------|
| `fields.slug` | `slugField` on collection | Human-readable, URL-safe entry identifier with auto-generation |
| `fields.text` | `{ label, description, multiline?, validation? }` | Short text (titles) and multiline text (descriptions) |
| `fields.checkbox` | `{ label, description }` | Published boolean toggle |
| `fields.select` | `{ label, description, options, defaultValue }` | Three-state saleStatus |
| `fields.image` | `{ label, description, directory, publicPath, validation }` | Single image upload |
| `fields.array` | wraps `fields.object({...})` | Repeatable image+alt structure |
| `fields.object` | `{ fields: {...} }` | Groups image + alt text per image slot |
| `fields.multiRelationship` | `{ label, description, collection, validation? }` | Multiple category refs per work; homepage picks |
| `fields.relationship` | `{ label, description, collection }` | Single collection ref (not needed in this phase but available) |

[VERIFIED: node_modules/@keystatic/core/dist/declarations/src/form/fields/index.d.ts]

### No New Dependencies

This phase installs no new packages. Everything needed is already installed.

---

## Architecture Patterns

### Recommended Content Directory Structure

```
content/
├── settings/
│   └── index.yaml           # existing settings singleton
├── categories/
│   └── bowls.yaml           # example category entry
│   └── mugs.yaml
├── works/
│   └── leirskaal-01/
│       └── index.yaml       # work entry (images stored separately)
└── homepage/
    └── index.yaml           # homepage singleton
public/
└── images/
    └── works/
        └── leirskaal-01/    # images uploaded via Keystatic for this work
            ├── image-1.jpg
            └── image-2.jpg
```

Images are stored in `public/images/works/{slug}/` so they are served by Next.js directly and compatible with `next/image`. The `publicPath` on `fields.image` is set to `/images/works/{slug}/` at the collection level — Keystatic appends the entry slug automatically when `directory` is set relative to the collection path. [VERIFIED: keystatic.com/docs/fields/image]

### Pattern 1: `works` Collection

**What:** Keystatic `collection()` with `slugField` pointing to a `fields.slug` field. One YAML file per work in `content/works/*/index.yaml`. Images stored in `public/images/works/`.

**Key schema fields:**
- `slug` — `fields.slug({ name: { label: 'Piece name (URL slug)' } })` — auto-generates URL-safe slug from title
- `titleDa`, `titleEn` — `fields.text(...)` required, max 120 chars
- `descriptionDa`, `descriptionEn` — `fields.text({ multiline: true })` optional
- `published` — `fields.checkbox(...)` default false
- `saleStatus` — `fields.select(...)` with three options
- `price` — `fields.text(...)` optional, shown only when saleStatus=available on the public site
- `leadTime` — `fields.text(...)` optional, same conditional display
- `categories` — `fields.multiRelationship({ collection: 'categories' })`
- `images` — `fields.array(fields.object({ image: fields.image(...), alt: fields.text(...) }), { label: 'Images', itemLabel: props => props.fields.alt.value || 'Image' })`

**`columns` option:** Set `columns: ['saleStatus', 'published']` on the collection so the Admin UI list view shows sale status and draft flag at a glance — critical for a non-technical owner to manage inventory.

### Pattern 2: `categories` Collection

**What:** A minimal `collection()` with two text fields (bilingual names) and a slug. No images. Owner adds/removes categories freely.

**Key schema fields:**
- `name` — `fields.slug(...)` — the slug source and display name in admin list
- `nameDa` — `fields.text(...)` required
- `nameEn` — `fields.text(...)` required

**Path:** `content/categories/*` (single YAML file per category, no trailing slash needed)

### Pattern 3: `homepage` Singleton

**What:** A `singleton()` with two `fields.multiRelationship` fields pointing at the `works` collection. The owner picks which works appear in the hero section and the shop preview section.

**Key schema fields:**
- `heroWorks` — `fields.multiRelationship({ label: 'Hero featured pieces', collection: 'works', validation: { length: { min: 1, max: 3 } } })`
- `shopPreviewWorks` — `fields.multiRelationship({ label: 'Shop preview pieces', collection: 'works', validation: { length: { min: 1, max: 6 } } })`

**Why this over "featured flag on each work":** The relationship-in-singleton approach gives the owner an explicit curatorial UX — she picks N pieces from a list, reorders them (array field handles ordering), and the homepage renders exactly those pieces. A boolean flag on each work would require the owner to un-feature old works manually when adding new ones; there is no ordering control; and the homepage singleton approach keeps curatorial intent in one place. [ASSUMED — architectural recommendation based on UX reasoning, not Keystatic documentation]

### Pattern 4: `ui.navigation` for Admin Sidebar

**What:** Keystatic's `ui.navigation` config groups collections and singletons in the sidebar. Recommended grouping:

```typescript
ui: {
  brand: { name: 'By Blendstrup' },
  navigation: {
    'Ceramic Pieces': ['works'],
    'Taxonomy': ['categories'],
    'Pages': ['homepage', 'settings'],
  }
}
```

[VERIFIED: node_modules/@keystatic/core/dist/declarations/src/config.d.ts — `navigation` key confirmed]

### Pattern 5: Reader API Usage (for downstream phases)

Phases 3 and 4 consume this schema via:

```typescript
// Source: keystatic.com/docs/reader-api
import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../../keystatic.config';

const reader = createReader(process.cwd(), keystaticConfig);

// All works (Phase 3 gallery)
const works = await reader.collections.works.all();

// Only published works
const published = works.filter(w => w.entry.published);

// Homepage picks (Phase 4)
const homepage = await reader.singletons.homepage.read();
const heroSlugs = homepage?.heroWorks ?? [];
const heroWorks = await Promise.all(
  heroSlugs.map(slug => reader.collections.works.read(slug))
);
```

[CITED: keystatic.com/docs/reader-api]

### Anti-Patterns to Avoid

- **Putting non-public image directories outside `public/`:** Next.js Image Optimization requires images to be in `public/` or a configured remote pattern. Always set `directory: 'public/images/works/...'` on `fields.image`.
- **Hardcoding category values as `fields.select` options:** Decision D-04 locks categories to a managed collection. Never use a static `select` for categories.
- **Using `fields.multiselect` for category references:** `multiselect` stores plain strings (not slugs referencing another collection). Use `fields.multiRelationship` for dynamic cross-collection references.
- **Editing the storage block or settings singleton:** The context document is explicit — extend only `collections` and `singletons` keys.
- **Expecting the Keystatic Admin UI to show conditional fields:** The CMS always shows all fields regardless of `saleStatus`. Conditional field display (hide price when status is not-listed) is a public-site rendering concern, not a CMS schema concern.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Multi-image array with alt text | Custom React component + state | `fields.array(fields.object({image, alt}))` | Keystatic handles drag-to-reorder, add/remove, validation in the Admin UI |
| Multiple category references | Comma-delimited text field | `fields.multiRelationship` | Correct type, combobox UI, stored as `string[]`, refactored at the schema level |
| Homepage curation | Custom drag-and-drop picker | `fields.multiRelationship` in singleton | Built-in multi-select combobox; slugs stored as array for ordered reference |
| Admin sidebar grouping | Custom UI wrapper | `ui.navigation` in config | Native Keystatic feature — no extra code |
| Slug generation from title | Custom `kebabCase` util | `fields.slug` | Auto-generates, enforces uniqueness, editable in the UI |

**Key insight:** Keystatic's field primitives handle all the complex Admin UI rendering. The only code this phase writes is TypeScript schema declarations in `keystatic.config.ts` — no React components, no UI code.

---

## Common Pitfalls

### Pitfall 1: `fields.multiRelationship` reference integrity

**What goes wrong:** If a category slug is renamed after being referenced by a work, the stored slug value becomes a broken reference. Keystatic does not auto-update stored slugs. [CITED: keystatic.com/docs/fields/relationship — "If the slug of the entry in question changes, the stored value will not be updated"]

**Why it happens:** Relationship fields store a static string snapshot of the slug at time of selection.

**How to avoid:** Treat category slugs as immutable after creation. The `fields.slug` field prevents accidental slug edits in the Admin UI (it can be locked). Alternatively, document this constraint in the admin helper text.

**Warning signs:** After renaming a category, works that referenced it show an empty/invalid category in the Admin UI.

### Pitfall 2: Image `directory` vs `publicPath` confusion

**What goes wrong:** Images are uploaded but `next/image` cannot serve them because the `publicPath` does not match the directory where files are saved.

**Why it happens:** `directory` controls where Keystatic writes the file; `publicPath` controls what path is stored in the YAML (what the RSC reads). If mismatched, the stored path is wrong.

**How to avoid:** Keep them in sync. If `directory: 'public/images/works'`, then `publicPath: '/images/works/'`. The `/public` prefix must be stripped for Next.js serving (Next.js serves `/public/*` as `/*`). [CITED: keystatic.com/docs/fields/image]

**Warning signs:** Images appear broken on the public site; the YAML contains paths like `public/images/works/...` (with the `public/` prefix, which is wrong).

### Pitfall 3: `fields.text` multiline vs single-line for descriptions

**What goes wrong:** Using the default (single-line) `fields.text` for DA/EN descriptions results in a one-line input, which is difficult for the owner to write meaningful product descriptions in.

**Why it happens:** `fields.text` defaults to a single-line `<input>`. The `multiline: true` option switches it to a `<textarea>`.

**How to avoid:** Set `multiline: true` for `descriptionDa` and `descriptionEn`. [VERIFIED: node_modules declaration — `multiline?: boolean` confirmed on text field]

### Pitfall 4: `slugField` must reference a `fields.slug` field

**What goes wrong:** Setting `slugField: 'titleEn'` on the collection causes a TypeScript type error because `slugField` must reference a `SlugFormField`, not a plain `fields.text`.

**Why it happens:** Keystatic uses the `SlugFormField` type to enforce uniqueness and URL-safe generation.

**How to avoid:** Always use `fields.slug({ name: { ... } })` as the field referenced by `slugField`, and make the slug field key (e.g., `slug`) the same value passed to `slugField`. [VERIFIED: type declaration — `slugField: SlugField extends string` on Collection type]

### Pitfall 5: `homepage` singleton reads before any `works` exist

**What goes wrong:** Phase 4's RSC calls `reader.singletons.homepage.read()` and gets null or empty arrays before the owner has curated any pieces. If the code does `.heroWorks.map(...)` without null-checking, the site throws.

**Why it happens:** Singletons that have never been saved return `null` from the Reader API.

**How to avoid:** Always null-check singleton reads. Use `homepage?.heroWorks ?? []`. This is a Phase 3/4 concern but the schema design should default `heroWorks` and `shopPreviewWorks` to empty arrays in the YAML (Keystatic writes defaults on first save). [ASSUMED — standard defensive coding pattern]

---

## Code Examples

### `works` collection (complete schema skeleton)

```typescript
// Source: verified against @keystatic/core 0.5.50 type declarations
import { config, collection, singleton, fields } from "@keystatic/core";

const works = collection({
  label: 'Ceramic Pieces',
  slugField: 'slug',
  path: 'content/works/*/',
  format: { data: 'yaml' },
  columns: ['saleStatus', 'published'],
  schema: {
    slug: fields.slug({
      name: {
        label: 'Piece name',
        description: 'The name of this ceramic piece. Used to generate the URL — keep it short and descriptive.',
      },
    }),
    published: fields.checkbox({
      label: 'Published',
      description: 'Tick to make this piece visible on the public site. Unticked pieces are drafts — only you can see them here.',
      defaultValue: false,
    }),
    titleDa: fields.text({
      label: 'Title (Danish)',
      description: 'The piece name shown to Danish visitors. Example: "Leirskål med glasur".',
      validation: { isRequired: true, length: { min: 1, max: 120 } },
    }),
    titleEn: fields.text({
      label: 'Title (English)',
      description: 'The piece name shown to English visitors. Example: "Glazed clay bowl".',
      validation: { isRequired: true, length: { min: 1, max: 120 } },
    }),
    descriptionDa: fields.text({
      label: 'Description (Danish)',
      description: 'A short description of this piece for Danish visitors — material, technique, size, or story. A few sentences is enough.',
      multiline: true,
    }),
    descriptionEn: fields.text({
      label: 'Description (English)',
      description: 'The same description in English.',
      multiline: true,
    }),
    saleStatus: fields.select({
      label: 'Sale status',
      description: 'Choose "Available for purchase" to show this piece in the shop. "Sold" keeps it in the gallery with a Sold label. "Not for sale" shows it as a portfolio piece only.',
      options: [
        { label: 'Available for purchase', value: 'available' },
        { label: 'Sold', value: 'sold' },
        { label: 'Not for sale', value: 'not-listed' },
      ],
      defaultValue: 'not-listed',
    }),
    price: fields.text({
      label: 'Price',
      description: 'Write the price exactly as you want it to appear — for example "1.200 kr.", "From 800 kr.", or "Price on request". Only shown when the piece is available for purchase.',
    }),
    leadTime: fields.text({
      label: 'Lead time / availability note',
      description: 'Optional note about availability or delivery time. Example: "Ready to ship" or "Allow 2–3 weeks". Only shown when the piece is available for purchase.',
    }),
    categories: fields.multiRelationship({
      label: 'Categories',
      description: 'Choose one or more categories for this piece. Categories help visitors filter the gallery.',
      collection: 'categories',
    }),
    images: fields.array(
      fields.object({
        image: fields.image({
          label: 'Image',
          description: 'Upload a photo of this piece (JPEG, max 20 MB). The first image in the list is used as the main photo in the gallery.',
          directory: 'public/images/works',
          publicPath: '/images/works/',
          validation: { isRequired: true },
        }),
        alt: fields.text({
          label: 'Image description (alt text)',
          description: 'Describe what is shown in the photo — used by screen readers and search engines. Example: "Handthrown clay bowl with ash glaze, front view".',
          validation: { isRequired: true, length: { min: 1, max: 200 } },
        }),
      }),
      {
        label: 'Images',
        description: 'Add 1–8 photos. Drag to reorder — the first photo becomes the main image.',
        itemLabel: props => props.fields.alt.value || 'Photo',
        validation: { length: { min: 1, max: 8 } },
      }
    ),
  },
});
```

### `categories` collection

```typescript
const categories = collection({
  label: 'Categories',
  slugField: 'name',
  path: 'content/categories/*',
  format: { data: 'yaml' },
  schema: {
    name: fields.slug({
      name: {
        label: 'Category name (for URL)',
        description: 'A short identifier used in the URL. Will be auto-generated from the English name. Example: "bowls".',
      },
    }),
    nameDa: fields.text({
      label: 'Name in Danish',
      description: 'The category label shown to Danish visitors. Example: "Skåle".',
      validation: { isRequired: true, length: { min: 1, max: 60 } },
    }),
    nameEn: fields.text({
      label: 'Name in English',
      description: 'The category label shown to English visitors. Example: "Bowls".',
      validation: { isRequired: true, length: { min: 1, max: 60 } },
    }),
  },
});
```

### `homepage` singleton

```typescript
const homepage = singleton({
  label: 'Homepage',
  path: 'content/homepage',
  format: { data: 'yaml' },
  schema: {
    heroWorks: fields.multiRelationship({
      label: 'Hero pieces',
      description: 'Choose 1–3 pieces to feature in the large hero section at the top of the homepage. The first piece gets the most visual prominence.',
      collection: 'works',
      validation: { length: { min: 0, max: 3 } },
    }),
    shopPreviewWorks: fields.multiRelationship({
      label: 'Shop preview pieces',
      description: 'Choose up to 6 pieces to show in the "Available now" section on the homepage. Only pieces marked "Available for purchase" will show a price.',
      collection: 'works',
      validation: { length: { min: 0, max: 6 } },
    }),
  },
});
```

### Extended `keystatic.config.ts` (final shape)

```typescript
export default config({
  storage,
  ui: {
    brand: { name: 'By Blendstrup' },
    navigation: {
      'Pieces': ['works'],
      'Taxonomy': ['categories'],
      'Pages': ['homepage', 'settings'],
    },
  },
  collections: {
    works,
    categories,
  },
  singletons: {
    settings,  // existing — unchanged
    homepage,
  },
});
```

### Reader API usage (for Phases 3 and 4 reference)

```typescript
// In an RSC — Server Component only
import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '@/../../keystatic.config';

const reader = createReader(process.cwd(), keystaticConfig);

// Fetch all published works
const allWorks = await reader.collections.works.all();
const published = allWorks.filter(w => w.entry.published);

// Fetch homepage curation
const homepageData = await reader.singletons.homepage.read();
const heroSlugs: string[] = homepageData?.heroWorks ?? [];
```

[CITED: keystatic.com/docs/reader-api]

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `tailwind.config.ts` for tokens | `@theme` block in CSS (Tailwind v4) | Tailwind v4 (2024) | Config already uses v4 pattern — no impact on this phase |
| `fields.array(fields.relationship(...))` for multi-ref | `fields.multiRelationship` | Added in Keystatic 0.5.x | Cleaner API, native combobox UI, correct type |
| Pages Router + `getStaticProps` for reading content | RSC + `createReader(process.cwd(), config)` in server component | Next.js App Router | All downstream phases use RSC pattern |

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Homepage singleton with `multiRelationship` is better UX than per-work featured flag | Architecture Patterns — Pattern 3 | If wrong, the planner should use `fields.checkbox({ label: 'Feature on homepage hero' })` per work instead — still valid, just different UX tradeoff |
| A2 | Images stored in `public/images/works/` are served correctly by `next/image` without additional config | Architecture Patterns | If wrong, a `remotePatterns` or `localPatterns` config is needed in `next.config.ts` — low risk, next/image serves all `/public` files by default |
| A3 | `homepage` singleton returns `null` from Reader API if never saved | Common Pitfalls | If wrong (returns empty object), the null-check pattern still works safely — zero risk |
| A4 | `fields.multiRelationship` renders an ordered multi-select that preserves insertion order in the stored array | Standard Stack | If ordering is not preserved, Phase 4 cannot rely on array index for display order — fallback: add an `order` integer field |

---

## Open Questions

1. **About singleton scope**
   - What we know: CLAUDE.md lists an `about` singleton; 02-CONTEXT.md says it is Claude's Discretion whether to include it in Phase 2 or Phase 4.
   - What's unclear: Whether any Phase 3/4 page will need to read `about` content before Phase 4 builds those pages.
   - Recommendation: Defer to Phase 4. The `about` content is rendered on the homepage (HOME-04) and no other page in v1. Phase 4 is the natural home.

2. **`fields.multiRelationship` ordering guarantee**
   - What we know: The type declaration shows it stores `string[]` — an ordered array.
   - What's unclear: Whether the Admin UI combobox allows reordering after selection (drag-to-reorder).
   - Recommendation: If ordering matters (hero slot 1 vs slot 2), wrap in `fields.array(fields.relationship(...))` instead — arrays always support drag-to-reorder. The planner should decide based on importance of hero slot ordering.

---

## Environment Availability

Step 2.6: No new external dependencies — this phase installs nothing new and makes no external service calls. All tooling is already available from Phase 1.

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| `@keystatic/core` | Schema authoring | yes | 0.5.50 | — |
| `@keystatic/next` | Admin UI route | yes | 5.0.4 | — |
| `pnpm` | Package management | yes | (Phase 1 established) | — |
| TypeScript | Config file compilation | yes | 5.x | — |

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None established (no test runner installed) |
| Config file | None |
| Quick run command | `pnpm build` (TypeScript compile catches schema errors) |
| Full suite command | `pnpm build && pnpm lint` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CMS-01 | `works` collection schema accepts all required fields | Type-check | `pnpm build` (tsc validates schema types) | N/A — schema file is Wave 0 |
| CMS-02 | `published: false` works filter works correctly | Type-check + manual | `pnpm build` | N/A |
| CMS-03 | `homepage` singleton schema accepts multiRelationship fields | Type-check | `pnpm build` | N/A |
| CMS-04 | All fields have `label` and `description` | Code review | Manual inspection | N/A |
| I18N-02 | DA/EN sibling fields present in schema | Type-check | `pnpm build` | N/A |

### Sampling Rate

- **Per task commit:** `pnpm build` — TypeScript compilation validates all schema field types
- **Per wave merge:** `pnpm build && pnpm check` — build + Biome lint/format check
- **Phase gate:** Full build green + manual smoke test of Admin UI at `/keystatic` (create a test work, verify all fields appear with correct labels)

### Wave 0 Gaps

- [ ] No automated tests exist for Keystatic schema validation beyond TypeScript compilation — this is acceptable for a schema-only phase. Manual smoke test of the Admin UI is the primary validation method.

---

## Security Domain

This phase adds no authentication, forms, user input processing, or external API calls. The Keystatic Admin UI is already secured by the existing route setup from Phase 1. No new ASVS categories apply.

| ASVS Category | Applies | Notes |
|---------------|---------|-------|
| V2 Authentication | no | Admin UI auth is an existing route concern, not changed in Phase 2 |
| V3 Session Management | no | No session logic in this phase |
| V4 Access Control | no | No new routes |
| V5 Input Validation | partial | Keystatic field `validation` options (length, isRequired) provide schema-level validation in the Admin UI. No server-side user-submitted data in this phase. |
| V6 Cryptography | no | No secrets or encryption |

---

## Sources

### Primary (HIGH confidence)
- `node_modules/@keystatic/core/dist/declarations/src/form/fields/index.d.ts` — complete list of available field types verified from installed 0.5.50
- `node_modules/@keystatic/core/dist/declarations/src/form/fields/multiRelationship/index.d.ts` — `multiRelationship` API signature verified
- `node_modules/@keystatic/core/dist/declarations/src/config.d.ts` — `Collection` type, `columns`, `ui.navigation` verified
- `node_modules/@keystatic/core/dist/declarations/src/form/fields/text/index.d.ts` — `multiline` option confirmed
- [keystatic.com/docs/fields/image](https://keystatic.com/docs/fields/image) — `directory`, `publicPath` options
- [keystatic.com/docs/fields/array](https://keystatic.com/docs/fields/array) — `itemLabel`, `slugField`, nested `fields.object` pattern
- [keystatic.com/docs/fields/relationship](https://keystatic.com/docs/fields/relationship) — slug reference semantics, one-to-many via array wrap
- [keystatic.com/docs/fields/select](https://keystatic.com/docs/fields/select) — `options`, `defaultValue` API
- [keystatic.com/docs/fields/multiselect](https://keystatic.com/docs/fields/multiselect) — confirmed static options only (not dynamic collection refs)
- [keystatic.com/docs/reader-api](https://keystatic.com/docs/reader-api) — `createReader`, collection/singleton read pattern
- [keystatic.com/docs/content-organisation](https://keystatic.com/docs/content-organisation) — path with/without trailing slash, image directory independence

### Secondary (MEDIUM confidence)
- [keystatic.com/docs/singletons](https://keystatic.com/docs/singletons) — singleton config options confirmed
- [keystatic.com/docs/collections](https://keystatic.com/docs/collections) — `columns`, `entryLayout`, `parseSlugForSort` options

### Tertiary (LOW confidence)
- Architectural recommendation for homepage singleton vs. per-work featured flag is reasoning-based, not from official documentation.

---

## Metadata

**Confidence breakdown:**
- Standard stack (field APIs): HIGH — verified directly from installed package type declarations and official docs
- Architecture patterns: HIGH for schema design; MEDIUM for homepage curation UX (A1 assumption)
- Pitfalls: HIGH — all cross-referenced with official docs
- Reader API: HIGH — verified from official docs

**Research date:** 2026-04-18
**Valid until:** 2026-10-18 (Keystatic 0.5.x is stable; field API unlikely to change in this window)
