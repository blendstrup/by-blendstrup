---
phase: 260428-uah
plan: 01
subsystem: homepage
tags: [homepage, keystatic, faq, accessibility, animation, content-model]
requires:
  - keystatic.config.ts (homepage singleton)
  - src/app/(site)/page.tsx (homepage server component)
  - lucide-react (existing dep — ChevronDown)
provides:
  - homepage.faqHeading + homepage.faqItems Keystatic fields
  - FaqAccordion client component (single-open, CSS-animated, ARIA-correct)
  - Public FAQ section between About and Custom Order CTA on /
affects:
  - Homepage rendering order on /
tech-stack:
  added: []
  patterns:
    - "Single-open accordion via useState<number> with -1 meaning all closed"
    - "CSS-only height animation: grid-template-rows 0fr → 1fr (no JS measurement)"
    - "Editor-friendly array seeding via existing content/homepage.yaml file"
key-files:
  created:
    - src/components/FaqAccordion.tsx
  modified:
    - keystatic.config.ts
    - src/app/(site)/page.tsx
    - content/homepage.yaml
decisions:
  - "Used grid-template-rows trick instead of framer-motion to keep zero new dependencies and respect codebase animation conventions"
  - "Removed redundant role='list' on <ul> at Biome's request (Rule 3 - blocking lint failure)"
metrics:
  duration: 231s
  completed: 2026-04-28
  tasks: 3
  files: 4
---

# Quick Task 260428-uah: Add FAQ Section to Homepage with Keystatic Summary

Owner-editable FAQ section on the homepage backed by Keystatic, rendered as accessible single-open accordions with a pure-CSS open/close animation — no new npm dependencies.

## Goal

Resolve common buyer questions inline on the homepage so visitors don't bounce to find purchase / shipping / lead-time / care information, while keeping the editing experience entirely in Keystatic (no code change required to update FAQs).

## What Was Built

### 1. Keystatic schema (homepage singleton)

Two fields added at the end of the `homepage` singleton schema, after `mediaGallery`:

- `faqHeading: fields.text` — section heading, default `"Ofte stillede spørgsmål"`, length 1–80
- `faqItems: fields.array(fields.object({ question, answer }))` — Danish-labeled "Spørgsmål" + multiline "Svar"; array `itemLabel` shows the question text once filled; array description hints that the first item is the one shown open on load

Pattern matches the existing `galleryHeading` + `mediaGallery` convention so the owner UX feels consistent with the rest of the homepage CMS.

### 2. `FaqAccordion` client component

`src/components/FaqAccordion.tsx` (~88 lines, including imports). Contract:

```ts
export type FaqItem = { question: string; answer: string }

export interface FaqAccordionProps {
  heading: string           // section heading
  items: FaqItem[]          // ordered; pre-filtered to non-empty by caller
  defaultOpenIndex?: number // defaults to 0; -1 = none open
}
```

Behavior:

- **Single-open:** clicking an open item closes it (sets index to `-1`); clicking a different item makes it the new open one. State is a single `useState<number>`.
- **First-open-on-load:** `defaultOpenIndex` defaults to `0`. Out-of-range values fall back to `0`.
- **Animation:** the panel wrapper uses `grid grid-rows-[0fr]` ↔ `grid-rows-[1fr]` plus an `opacity` transition, both 300ms ease-out. The chevron rotates 180° in lockstep. All three transitions get `motion-reduce:transition-none`.
- **Accessibility:** real `<button>` triggers (Enter/Space work natively); `aria-expanded`, `aria-controls` on the trigger; `role="region"` + `aria-labelledby` on the panel; relies on the existing global `*:focus-visible` terracotta ring (no redeclaration).
- **Empty defense:** returns `null` if `items.length === 0` (homepage also guards).

Visuals reuse Japandi tokens only — `border-clay`, `divide-clay`, `text-ink`, `text-stone`, `font-serif`, `font-sans`, `hover:text-terracotta`. No new colors or fonts. Section wrapper matches the `border-clay border-t py-24` rhythm of adjacent homepage sections.

### 3. Homepage rendering

In `src/app/(site)/page.tsx`:

- `FaqAccordion` imported alongside other `@/components` imports
- After the existing `Promise.all`, FAQ items are derived and filtered:
  - trimmed `question`/`answer`
  - dropped if either is empty (so an in-progress entry in the CMS doesn't render a blank row)
- JSX block inserted **between the About section and the Custom Order CTA**, conditional on `faqItems.length > 0` so the section is fully hidden (no orphan heading) when there are no items

### 4. Content seed

Added two sample Danish entries to `content/homepage.yaml` so the section renders out of the box in `pnpm dev`:

- "Hvor lang tid tager det at lave en specialbestilling?" → "Typisk 4–8 uger afhængigt af størrelse og glasering."
- "Sender I til hele Danmark?" → "Ja — og til EU efter aftale. Forsendelse aftales individuelt."

## Final Section Order on `/`

1. Hero
2. Til salg (shop preview)
3. Om Laura (about)
4. **Ofte stillede spørgsmål (NEW)**
5. Noget særligt i tankerne? (custom order CTA)
6. Galleri (conditional media gallery)

## Verification

| Check | Result |
| --- | --- |
| `tsc --noEmit` | Pass (no errors) |
| `pnpm lint` | Pass for new/modified files; one pre-existing error in `admin-login/actions.ts` (deferred — see below) |
| `pnpm build` | Pass; `/` remains statically rendered (`○` in the route table) |
| Manual: section appears between About and Custom Order CTA | Confirmed via build output and code review |
| Manual: first item open by default | Confirmed by `defaultOpenIndex={0}` and `useState<number>(initialIndex)` |
| Manual: aria wiring | `aria-expanded`, `aria-controls`, `role="region"`, `aria-labelledby` all present |
| Manual: reduced motion | `motion-reduce:transition-none` on chevron rotation and panel transition |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 — Blocking] Removed redundant `role="list"` on `<ul>`**

- **Found during:** Task 2 (lint verification)
- **Issue:** Biome (project's linter) errored on `role="list"` on a `<ul>` because the role is implied by the element. The plan included a `// biome-ignore` comment intended to suppress this, but Biome's `lint/a11y/noRedundantRoles` rule flags it regardless and the suppression alone wasn't sufficient.
- **Fix:** Dropped the `role="list"` attribute and the now-unneeded biome-ignore comment. The `<ul>` retains its native list semantics — `divide-y` doesn't strip them, so accessibility is unchanged.
- **Files modified:** `src/components/FaqAccordion.tsx`
- **Commit:** included in `95dff40`

No other deviations — plan executed essentially as written.

## Deferred Issues

Tracked in `.planning/quick/260428-uah-add-faq-section-to-homepage-with-keystat/deferred-items.md`:

- **`src/app/admin-login/actions.ts:2`** — Biome flags `import { createHmac } from "crypto"` (should be `node:crypto`). Pre-existing from commit `2331bd0` (260422-wd4); out of scope for an FAQ task. Suggest a separate quick task to flip the import.

## Owner Workflow

To add or edit FAQs:

1. Open `/keystatic` → **Homepage**
2. Edit the **FAQ-sektion — overskrift** field (heading)
3. Use the **FAQ-elementer** array to add, reorder, or remove items
4. Each item has **Spørgsmål** + multiline **Svar** fields
5. Save — Keystatic commits the change to `content/homepage.yaml`; Vercel redeploys

The first item in the list is the one shown expanded when the page loads.

## Self-Check: PASSED

Verified files exist on disk:

- `src/components/FaqAccordion.tsx` — FOUND
- `keystatic.config.ts` — FOUND (with `faqHeading` + `faqItems`)
- `src/app/(site)/page.tsx` — FOUND (with `FaqAccordion` import + JSX)
- `content/homepage.yaml` — FOUND (seed entries present)

Verified commits exist on the worktree branch:

- `3f1585e` feat(260428-uah): add FAQ schema to homepage singleton — FOUND
- `95dff40` feat(260428-uah): add FaqAccordion client component — FOUND
- `cd156f6` feat(260428-uah): render FAQ section on homepage — FOUND
