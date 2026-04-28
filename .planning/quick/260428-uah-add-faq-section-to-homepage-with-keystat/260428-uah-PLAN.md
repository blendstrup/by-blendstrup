---
phase: 260428-uah
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - keystatic.config.ts
  - src/components/FaqAccordion.tsx
  - src/app/(site)/page.tsx
autonomous: true
requirements:
  - QUICK-260428-uah

must_haves:
  truths:
    - "The owner can add, edit, reorder and remove FAQ items in Keystatic on the Homepage singleton (question + answer per item)."
    - "The homepage renders a section titled 'Ofte stillede spørgsmål' that lists those FAQ items as accordions, in the order defined in Keystatic."
    - "On initial render the first FAQ item is expanded; the rest are collapsed."
    - "Clicking a closed item expands it with a smooth height + opacity animation; opening one item collapses any previously open item (single-open behavior)."
    - "Each accordion is keyboard-operable (Enter / Space toggles, focus is visible) and announces its open/closed state to assistive tech via aria-expanded / aria-controls."
    - "The section is hidden when no FAQ items exist (no empty heading on the page)."
    - "Visual style matches the existing Japandi tokens (linen/oat/clay/stone/ink, font-serif heading, hairline borders, generous padding) — no new colors or fonts."
  artifacts:
    - path: "keystatic.config.ts"
      provides: "faqHeading text field + faqItems array field on the homepage singleton"
      contains: "faqItems"
    - path: "src/components/FaqAccordion.tsx"
      provides: "Client component rendering a single-open accordion list with smooth CSS height/opacity animation and proper ARIA semantics"
      exports: ["FaqAccordion"]
    - path: "src/app/(site)/page.tsx"
      provides: "Reads faqItems from the homepage singleton and renders the FAQ section using FaqAccordion, conditionally and in the correct position"
      contains: "FaqAccordion"
  key_links:
    - from: "keystatic.config.ts (homepage.faqItems)"
      to: "src/app/(site)/page.tsx (homepageData.faqItems)"
      via: "createReader().singletons.homepage.read()"
      pattern: "homepageData\\??\\.faqItems"
    - from: "src/app/(site)/page.tsx"
      to: "src/components/FaqAccordion.tsx"
      via: "import + JSX render with items prop"
      pattern: "<FaqAccordion"
    - from: "FaqAccordion button"
      to: "FaqAccordion panel"
      via: "aria-controls / id pairing + aria-expanded toggle + grid-rows transition"
      pattern: "aria-expanded"
---

<objective>
Add an owner-editable FAQ section to the homepage. Each FAQ item is a question + answer pair authored in Keystatic. The section renders as a stack of single-open accordions with a smooth CSS-based open/close animation; the first item is open on initial load. Section heading is the Danish copy "Ofte stillede spørgsmål".

Purpose: Resolve common buyer questions inline on the homepage so visitors don't bounce to find purchase / shipping / lead-time / care information. Keeps the editing experience entirely in Keystatic (no code change needed to update FAQs).

Output: An updated Keystatic schema (homepage singleton gains `faqHeading` + `faqItems`), a new `FaqAccordion` client component, and the homepage rendering the FAQ block in its established Japandi style.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@./CLAUDE.md
@keystatic.config.ts
@src/app/(site)/page.tsx
@src/app/globals.css
@src/components/MediaGallery.tsx
@src/components/GalleryFilterToggle.tsx

<interfaces>
<!-- Key contracts the executor will use. Extracted directly so no codebase exploration is required. -->

From keystatic.config.ts — the existing homepage singleton already follows an "array of objects" pattern (see `mediaGallery`) and a "section heading text field" pattern (see `galleryHeading`, `shopPreviewHeading`). The new fields MUST follow these same conventions for owner UX consistency. Existing relevant snippet:

```ts
// keystatic.config.ts — homepage singleton (excerpt)
const homepage = singleton({
  label: "Homepage",
  path: "content/homepage",
  format: { data: "yaml" },
  schema: {
    // ...existing fields (heroHeadline, shopPreviewHeading, aboutHeading, customOrdersHeading, etc.)
    galleryHeading: fields.text({
      label: "Galleri-sektion — overskrift",
      defaultValue: "Galleri",
      validation: { length: { max: 60 } },
    }),
    mediaGallery: fields.array(
      fields.object({ /* ... */ }),
      {
        label: "Media galleri",
        description: "Valgfrie fotos og videoer med titel og tags.",
        itemLabel: (p) => p.fields.title.value || p.fields.type.value || "Mediaelement",
      },
    ),
  },
});
```

From src/app/(site)/page.tsx — the homepage is a server component that calls `createReader(process.cwd(), keystaticConfig)` and reads `reader.singletons.homepage.read()` into `homepageData`. The current section order in `<main>` is:

1. Hero (`relative h-[calc(100svh-4rem)]`)
2. "Til salg" / Shop Preview (`border-clay border-t py-24`)
3. "Om Laura" / About (`border-clay border-t bg-oat py-24`)
4. "Noget særligt i tankerne?" / Custom Order CTA (`border-clay border-t bg-oat py-24`)
5. Media Gallery (conditional) (`border-clay border-t py-24`)

The new FAQ section MUST be inserted **immediately before the Custom Order CTA section** (so visitor questions are answered just before the conversion ask), keeping the established `border-clay border-t py-24` pattern with a `mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-16` content container.

From src/app/globals.css — design tokens already defined: `--color-linen #f5f0e8`, `--color-oat #ede7d9`, `--color-clay #c4a882`, `--color-stone #7a6a58`, `--color-ink #2c2418`, `--color-terracotta #a85c3a`, `--font-serif Fraunces`, `--font-sans DM Sans`. Focus ring is global (`*:focus-visible { outline: 2px solid var(--color-terracotta); outline-offset: 2px; }`) — do NOT redeclare it.

From the codebase: framer-motion / Motion is mentioned in CLAUDE.md but is NOT installed in package.json and is NOT used anywhere in src/. Existing components animate with plain CSS Tailwind transitions (e.g. `transition-colors duration-150`). Therefore: do NOT add framer-motion; implement the open/close animation in pure CSS using the well-supported `grid-template-rows: 0fr → 1fr` technique with `transition`. This stays consistent with the codebase, adds zero JS bundle weight, and respects `motion-safe` / `motion-reduce`.
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add FAQ schema to Keystatic homepage singleton</name>
  <files>keystatic.config.ts</files>
  <action>
On the `homepage` singleton schema (the constant `const homepage = singleton({ ... })`), add two new fields placed at the END of the schema object (after `mediaGallery`), following the existing Danish-labeled, default-valued pattern used by `galleryHeading` + `mediaGallery`:

1. `faqHeading: fields.text({ ... })`
   - `label: "FAQ-sektion — overskrift"`
   - `defaultValue: "Ofte stillede spørgsmål"`
   - `validation: { length: { min: 1, max: 80 } }`

2. `faqItems: fields.array(fields.object({ question, answer }), { ... })`
   - Inner object fields:
     - `question: fields.text({ label: "Spørgsmål", validation: { length: { min: 1, max: 200 } } })`
     - `answer: fields.text({ label: "Svar", multiline: true, validation: { length: { min: 1, max: 1000 } } })`
   - Array options:
     - `label: "FAQ-elementer"`
     - `description: "Ofte stillede spørgsmål med svar. Det første element vises åbent når siden indlæses."`
     - `itemLabel: (props) => props.fields.question.value || "Spørgsmål"`

Do NOT change anything else in `keystatic.config.ts`. Do not introduce a new singleton or collection — `homepage` is the established home for homepage-section content.
  </action>
  <verify>
    <automated>pnpm tsc --noEmit</automated>
  </verify>
  <done>
- `keystatic.config.ts` compiles under TypeScript strict mode with the two new fields present on the `homepage` singleton schema.
- `pnpm dev` boots and `/keystatic` shows the new "FAQ-sektion — overskrift" text field and "FAQ-elementer" array field on the Homepage page, with item-level Spørgsmål + Svar inputs.
  </done>
</task>

<task type="auto">
  <name>Task 2: Build FaqAccordion client component (single-open, CSS-animated, accessible)</name>
  <files>src/components/FaqAccordion.tsx</files>
  <action>
Create `src/components/FaqAccordion.tsx` as a "use client" component. It owns ALL interactivity for the FAQ section. The homepage server component will pass it pre-shaped data + a heading.

Component contract (export named `FaqAccordion`):

```ts
export type FaqItem = { question: string; answer: string };

export interface FaqAccordionProps {
  heading: string;          // section heading, e.g. "Ofte stillede spørgsmål"
  items: FaqItem[];         // ordered list, already filtered to non-empty
  defaultOpenIndex?: number; // defaults to 0; -1 = none open
}

export function FaqAccordion(props: FaqAccordionProps): JSX.Element;
```

Implementation requirements:

1. State: `const [openIndex, setOpenIndex] = useState<number>(props.defaultOpenIndex ?? 0)`. Single-open behavior: clicking the open item closes it (set to -1); clicking a different item sets `openIndex` to that index.

2. Markup:
   - Outer `<section className="border-clay border-t py-24">` wrapping `<div className="mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-16">` to match the homepage section rhythm.
   - `<h2 className="font-normal font-serif text-[28px] text-ink tracking-tight mb-8">{heading}</h2>` (matches `shopPreviewHeading` h2 styling exactly).
   - A `<ul role="list" className="divide-y divide-clay border-y border-clay">` (hairline borders are the Japandi cue).
   - Each item is an `<li>` containing:
     - A `<button>` (NOT a `<div>`):
       - `type="button"`
       - `id={`faq-trigger-${i}`}`
       - `aria-expanded={openIndex === i}`
       - `aria-controls={`faq-panel-${i}`}`
       - Class: `flex w-full items-center justify-between gap-6 py-6 text-left font-serif text-lg text-ink transition-colors duration-150 hover:text-terracotta`
       - Children: `<span>{item.question}</span>` and a chevron icon (use `ChevronDown` from `lucide-react` — already a dependency, see homepage hero) with class `shrink-0 transition-transform duration-300 ease-out` and a conditional `rotate-180` when open.
     - A panel wrapper that animates height via grid-rows trick:
       - Outer: `<div role="region" id={`faq-panel-${i}`} aria-labelledby={`faq-trigger-${i}`} className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${openIndex === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>`
       - Inner: `<div className="min-h-0 overflow-hidden">` containing `<div className="pb-6 pr-12 font-sans text-base text-stone leading-relaxed whitespace-pre-line">{item.answer}</div>` (whitespace-pre-line so editors get paragraph breaks for free from multiline text).
       - The opacity transition shares the same duration so fade and height feel like one motion (per constraint: "smooth height + opacity animation").

3. Accessibility:
   - Keyboard: native `<button>` already handles Enter/Space. Do NOT intercept these.
   - Focus: relies on the global `*:focus-visible` ring already in `globals.css`. Do NOT redeclare ring styles.
   - Reduced motion: `motion-reduce:transition-none` on both the rotate AND the panel wrapper so users with `prefers-reduced-motion` get instant open/close.
   - The panel uses `role="region"` + `aria-labelledby={triggerId}` so screen readers announce "Spørgsmål, region" when entering.

4. Empty / single-item edge cases: if `items.length === 0` return `null` (the homepage will also guard, but defense in depth). If `defaultOpenIndex` is out of range, fall back to 0.

5. Do NOT install any new dependency. Use only React, lucide-react (already used on the homepage hero), and Tailwind v4 utilities. NO framer-motion.

Verification helpers — keep the implementation small (~80–110 lines including imports and the export). No `useEffect`, no `useRef`, no measuring DOM heights — the grid-rows trick handles smooth animation declaratively.
  </action>
  <verify>
    <automated>pnpm tsc --noEmit && pnpm lint</automated>
  </verify>
  <done>
- `FaqAccordion` exists, exports the typed contract above, and type-checks.
- Lint (Biome) passes with no errors on the new file.
- Manual smoke (will be verified together with Task 3 in dev): clicking a question expands its answer with a smooth animation; opening another closes the previous; first item is open on mount; tabbing focuses the trigger buttons; Enter/Space toggle works; `aria-expanded` flips correctly in DevTools.
  </done>
</task>

<task type="auto">
  <name>Task 3: Render the FAQ section on the homepage</name>
  <files>src/app/(site)/page.tsx</files>
  <action>
In `src/app/(site)/page.tsx`:

1. Add an import at the top with the other component imports:
   ```ts
   import { FaqAccordion } from "@/components/FaqAccordion"
   ```

2. After the `Promise.all` already in the function body, derive the FAQ items list from `homepageData`:
   ```ts
   const faqItems = (homepageData?.faqItems ?? [])
     .map((item) => ({
       question: (item?.question ?? "").trim(),
       answer: (item?.answer ?? "").trim(),
     }))
     .filter((item) => item.question.length > 0 && item.answer.length > 0)
   ```
   Cast through `as Array<{ question: string; answer: string }>` only if the inferred Keystatic type requires it; prefer letting TypeScript infer.

3. In the JSX, insert the FAQ section **immediately BEFORE** the existing `{/* ─── Custom Order CTA Section (HOME-03, D-13) ─── */}` section and AFTER the About section. Render conditionally so the section is hidden when there are no items:
   ```tsx
   {faqItems.length > 0 && (
     <FaqAccordion
       heading={homepageData?.faqHeading ?? "Ofte stillede spørgsmål"}
       items={faqItems}
       defaultOpenIndex={0}
     />
   )}
   ```
   The `FaqAccordion` already wraps itself in its own `<section>` with `border-clay border-t py-24`, so do NOT wrap it in another `<section>` here — that would double the border and padding.

4. Do NOT change any other section, copy, ordering, or styling. Do NOT touch the hero, shop preview, about, custom-order CTA, or media gallery sections.

5. Owner content seed: after the code change, also add at minimum two sample FAQ entries by editing `content/homepage/index.yaml` (Keystatic's local storage file for the homepage singleton — same directory layer as the other `content/...` data) so the section renders during local verification. If the file path differs, run `pnpm dev`, open `/keystatic`, and add 2 items via the UI; commit the resulting yaml change. Use realistic Danish copy such as:
   - Q: "Hvor lang tid tager det at lave en specialbestilling?" / A: "Typisk 4–8 uger afhængigt af størrelse og glasering."
   - Q: "Sender I til hele Danmark?" / A: "Ja — og til EU efter aftale. Forsendelse aftales individuelt."
  </action>
  <verify>
    <automated>pnpm tsc --noEmit && pnpm lint && pnpm build</automated>
  </verify>
  <done>
- `pnpm build` succeeds; the homepage statically renders without runtime errors.
- Visiting `/` in `pnpm dev` shows the new "Ofte stillede spørgsmål" section between the About section and the Custom Order CTA section.
- The first FAQ item's panel is visible on initial paint (no flash of all-closed).
- Clicking the second question opens it and closes the first with a smooth height + fade transition (~300ms).
- With `prefers-reduced-motion: reduce` set in the browser, opening/closing is instant (no animation) but still functional.
- Removing all FAQ items in `/keystatic` and reloading hides the entire section (no orphan heading).
- Lighthouse Accessibility score on `/` does not regress; axe DevTools shows no new issues on the FAQ region.
  </done>
</task>

</tasks>

<verification>
End-to-end check after all three tasks:

1. **CMS UX (owner perspective):**
   - Open `/keystatic` → Homepage. The "FAQ-sektion — overskrift" text field shows with the default "Ofte stillede spørgsmål".
   - Below it, "FAQ-elementer" appears as an empty/expandable array with an "Add" button. Adding an item shows clearly labeled "Spørgsmål" and "Svar" fields. The item label in the array list shows the question text once filled.
   - Saving commits a yaml change to `content/homepage/index.yaml`.

2. **Public site (visitor perspective):**
   - Section "Ofte stillede spørgsmål" appears between the About section and the Custom Order CTA on `/`.
   - First item is expanded on load; chevron is rotated 180°.
   - Clicking another question: previous closes, new one opens, both transitions feel like one motion (height + opacity, ~300ms).
   - Clicking the open question closes it (no item open is a valid state).
   - Hairline borders (`border-clay`) separate items; heading uses `font-serif` and the section uses the same `py-24` rhythm as adjacent sections.
   - No new colors or fonts introduced (verify with browser DevTools — only existing CSS variables in use).

3. **Accessibility:**
   - Tabbing reaches each question button; the global terracotta focus ring is visible.
   - Enter/Space toggles the focused item.
   - `aria-expanded` reflects state in DevTools; `aria-controls` points to the corresponding panel id; panel has `role="region"` + `aria-labelledby` pointing to the trigger.
   - With `prefers-reduced-motion: reduce`, animations are suppressed but functionality is intact.

4. **Build & lint:**
   - `pnpm tsc --noEmit` passes.
   - `pnpm lint` passes.
   - `pnpm build` succeeds and the homepage remains statically rendered (no new dynamic data sources introduced).

5. **No-regression sanity:**
   - Homepage still renders hero video/image, shop preview, about, custom-order CTA, and media gallery exactly as before.
   - No new npm dependencies were added (verify `package.json` diff shows no changes).
</verification>

<success_criteria>
- Owner can fully author and reorder FAQs from `/keystatic` without touching code.
- Section title "Ofte stillede spørgsmål" appears on the homepage in Danish.
- Each FAQ item is an accordion with smooth height + opacity open/close animation.
- First item is open by default on initial render.
- Single-open behavior: opening one closes any previously open item.
- Accordions are accessible: real `<button>` triggers, correct `aria-expanded` / `aria-controls` / `role="region"` / `aria-labelledby` wiring, keyboard operable, focus visible, reduced-motion respected.
- Visual style is indistinguishable from the existing Japandi sections — same tokens, same spacing rhythm, hairline borders.
- Zero new npm dependencies; zero changes to non-FAQ homepage sections.
- `pnpm tsc --noEmit`, `pnpm lint`, and `pnpm build` all pass.
</success_criteria>

<output>
After completion, create `.planning/quick/260428-uah-add-faq-section-to-homepage-with-keystat/260428-uah-SUMMARY.md` documenting:
- Final schema fields added on the homepage singleton (`faqHeading`, `faqItems`).
- Component contract for `FaqAccordion` (props, single-open behavior, CSS animation technique used).
- Final placement of the section on the homepage.
- Any deviations from this plan and why.
</output>
