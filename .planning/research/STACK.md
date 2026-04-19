# Stack Research — By Blendstrup

**Researched:** 2026-04-18
**Mode:** Ecosystem (Stack dimension)
**Overall confidence:** MEDIUM-HIGH (core stack is well-established; live web verification was unavailable during this pass, so version numbers and a few integration specifics are flagged LOW and should be verified against current docs before install)

---

## Recommended Stack

| Layer | Choice | Version (verify at install) | Rationale | Confidence |
|---|---|---|---|---|
| Framework | Next.js (App Router) | 15.x | Locked by constraints. App Router is the current default; best fit for Vercel + Keystatic. RSC reduces client JS for image-heavy pages. | HIGH |
| Runtime | Node.js | 20 LTS (or 22 LTS) | Vercel default; required by Next 15 + Keystatic. | HIGH |
| Language | TypeScript | 5.x (strict) | Keystatic schemas are TS-native; type-safety across content → UI is a major DX win. | HIGH |
| CMS | Keystatic | latest 0.5.x / 1.x line | Locked by constraints. Git-based, free, ships a local Admin UI (`/keystatic`) and a Next.js Reader API. | HIGH |
| Content storage | Markdoc / MDX via Keystatic `document` or `markdoc` field | — | Markdoc is Keystatic's first-class rich-text format; structured, sanitizable, easier to theme than raw Markdown. | MEDIUM |
| Styling | Tailwind CSS v4 | 4.x | De-facto standard for Next.js + Vercel; utility-first keeps Japandi restraint trivial to enforce via a tiny design-token layer. v4 has Oxide engine + native CSS config. | HIGH |
| Design tokens | CSS variables + `@theme` block (Tailwind v4) | — | Centralizes Japandi palette (muted earth tones) and typography scale; swaps trivially. | MEDIUM |
| Typography | `next/font` with a serif + humanist sans pairing (e.g. Fraunces / Cormorant Garamond + Inter / DM Sans) | — | `next/font` self-hosts Google fonts with zero CLS. Serif display + clean sans matches Japandi. | HIGH |
| i18n | `next-intl` | 3.x | App-Router-native, RSC-friendly, supports the `[locale]` segment pattern Keystatic's bilingual content fits cleanly into. | HIGH |
| Image optimization | `next/image` with Vercel Image Optimization | built-in | Automatic AVIF/WebP, responsive `sizes`, blur placeholders. Required for ceramics photography at acceptable perf. | HIGH |
| Image source | Files committed to repo via Keystatic `image` field, served from `/public` or a Keystatic-managed directory | — | Keeps the "git-based, zero infra" promise intact. | HIGH |
| Animation | `framer-motion` (Motion) | latest | Subtle fade/slide/scale; RSC-compatible via client boundaries. Alternative: CSS-only `@starting-style` + view transitions for zero JS. | MEDIUM |
| Page transitions | Next.js View Transitions API (experimental) or CSS only | — | Elegant cross-fade on route change fits Japandi restraint. Keep JS-free where possible. | LOW |
| Forms | React Hook Form + Zod + Next Server Actions | RHF 7.x, Zod 3.x | Accessible validation, minimal JS; server action posts to email provider. | HIGH |
| Form delivery | Resend (or Postmark) via server action | — | Free tier covers low-volume inquiry forms; simple API; good deliverability. | MEDIUM |
| Spam protection | Cloudflare Turnstile | — | Free, privacy-respecting, simpler than hCaptcha/reCAPTCHA; works with server actions. | MEDIUM |
| Icons | `lucide-react` | latest | Clean, consistent line icons that suit minimalist aesthetic. | HIGH |
| Analytics (optional) | Vercel Analytics or Plausible | — | Cookieless, lightweight; Plausible has an affordable EU-hosted tier (not free). Vercel Analytics is free on hobby at low volume. | MEDIUM |
| SEO | `next-sitemap` or built-in `sitemap.ts` + `robots.ts` + `generateMetadata` per route | — | App Router has first-class metadata APIs; no extra lib strictly needed. | HIGH |
| Linting/format | Biome (next config) + Biome + `@biomejs/biome` | — | Keeps Tailwind class order stable. | HIGH |

---

## Key Integration Notes

### Keystatic + Next.js App Router

- **Two entry points.** Keystatic ships an Admin UI (mounted at `/keystatic` via a catch-all route) and a Reader API used in server components to read content at build / request time.
- **Storage mode.** Start with `storage: { kind: 'local' }` for development. For production on Vercel, switch to `storage: { kind: 'github' }` so non-technical edits go through Keystatic Cloud → GitHub commits → Vercel redeploys. This preserves the "no server" promise.
- **Keystatic Cloud** is the recommended auth layer for GitHub storage when the owner is editing from a browser without installing anything. It is free for individuals at time of training data — verify current pricing before committing (LOW confidence on tier details).
- **Reader API in RSC.** Call `createReader(process.cwd(), config)` inside server components; never in client components. Cache is automatic per-build.
- **Content change → redeploy.** Every Keystatic save is a git commit; Vercel auto-deploys. Builds must stay fast (target <60s) so a content edit feels near-instant. Keep the site statically rendered (`generateStaticParams`) wherever possible.
- **Local dev gotcha.** The Keystatic admin route must run in the Node runtime, not Edge. Force it via `export const runtime = 'nodejs'` in the catch-all page/route.
- **Do not put Keystatic behind auth middleware** that blocks `/keystatic/*` — the Admin UI needs its own routes to function.

### Schema patterns for a ceramics portfolio/shop

Recommended collections and singletons:

- `collection: works` — every ceramic piece (whether for sale or archived).
  - `title` (text, required, localized)
  - `slug` (slug, from title)
  - `year` (integer)
  - `status` (select: `available` | `sold` | `archived` | `custom-only`)
  - `price` (text, optional — display-only, e.g. "1.200 DKK"; no checkout)
  - `dimensions` (text, localized — e.g. "Ø 12 × 8 cm")
  - `materials` (multiselect or array of text)
  - `heroImage` (image, required)
  - `gallery` (array of image fields, recommend 3–8 images per work)
  - `description` (markdoc/document, localized)
  - `featured` (checkbox — drives homepage highlights)
  - `sortOrder` (integer, optional)
- `singleton: homepage` — featured works ordering, hero copy (localized), intro paragraph.
- `singleton: about` — artist statement, studio photo, contact info (all localized).
- `singleton: customOrders` — page copy describing what's possible, lead times, starting prices (localized).
- `singleton: settings` — site title, SEO defaults, social links, inquiry recipient email.

**Localization pattern:** Keystatic does not have first-class i18n at the field level in all versions. Two proven patterns:
1. **Sibling-field pattern (recommended for simplicity):** `title_en` and `title_da` as two text fields on the same entry. One source of truth per work, both locales co-located.
2. **Parallel collections pattern:** `works-en` and `works-da` collections mirrored by slug. More duplication risk; avoid unless the owner will realistically curate locales independently.

Go with sibling fields. Wrap them with a small typed helper `t(entry, locale)` on the reader side.

---

## i18n Approach

**Recommendation:** `next-intl` with the `[locale]` dynamic segment pattern.

**Routing:**
```
app/
  [locale]/
    layout.tsx
    page.tsx                 # home
    works/
      page.tsx               # gallery
      [slug]/page.tsx        # work detail
    for-sale/page.tsx
    custom/page.tsx
    about/page.tsx
    contact/page.tsx
  keystatic/[[...params]]/page.tsx   # admin, NOT localized
  api/
```

**Supported locales:** `en`, `da`. **Default:** `da` (owner is Danish, primary audience is local — but verify with owner; if international reach is higher priority, flip to `en`).

**Strategy:**
- Use `next-intl`'s middleware for locale negotiation (`Accept-Language` header → redirect).
- UI strings (nav labels, button text, form validation) live in `messages/en.json` and `messages/da.json` — short files, committed with code. These are developer strings, not content.
- Content strings (work titles, descriptions, page copy) come from Keystatic via the sibling-field pattern. Selected via the current locale in the RSC.
- Language toggle is a simple client component that calls `next-intl`'s `useRouter()` with the other locale — preserves path.
- Set `<html lang={locale}>` in the locale layout for a11y/SEO.
- `hreflang` alternates in `generateMetadata` for SEO.

**Why not `next-i18next`:** Pages-Router era; not recommended for App Router.
**Why not DIY JSON loading:** Gets you 70% there but loses typed messages, middleware, and formatted messages — `next-intl` is small and battle-tested.

---

## Image Strategy

Ceramics photography is the product. This layer matters more than any other.

**Configuration (`next.config.ts`):**
```ts
images: {
  formats: ['image/avif', 'image/webp'],  // AVIF first — 30-50% smaller than WebP
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560],
  minimumCacheTTL: 60 * 60 * 24 * 30,    // 30 days; content is git-versioned
}
```

**Per-image rules:**
- **Always use `next/image`.** Never `<img>` for content imagery.
- **Source assets:** export from Lightroom/Capture One as sRGB JPEG at ~2400px long edge, quality 85. `next/image` handles downscaling and format conversion. Don't ship TIFF or HEIC.
- **Hero/featured:** `priority` + explicit `sizes="(max-width: 768px) 100vw, 80vw"`.
- **Gallery grid:** `sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"`. Lazy load by default.
- **Blur placeholder:** use `placeholder="blur"` with a generated `blurDataURL`. For Keystatic-managed images, generate at build time with `plaiceholder` (pairs with `next/image`).
- **Aspect ratios:** constrain in the design system — recommend a single hero ratio (e.g. 4:5 portrait) and square for grid thumbs. Consistency enforces Japandi rhythm.
- **Color space:** deliver sRGB; avoid wide-gamut exports — color will shift on non-P3 screens.
- **Alt text:** required in the Keystatic schema for every image field. Localized. Non-negotiable for a11y + SEO.

**Vercel Image Optimization quota.** Free hobby tier has a monthly-transformation cap (verify current limit — LOW confidence on exact number). For a portfolio this is almost certainly fine; monitor in the first month. If exceeded, switch strategies: either pre-optimize at build with `sharp` and serve static files, or move image origin to Cloudflare R2/Images.

---

## Styling Decision

**Recommendation: Tailwind CSS v4** with a deliberately narrow design system.

**Rationale for Japandi aesthetic:**
- Japandi is defined by restraint — generous whitespace, few type sizes, muted palette, hairline borders, quiet transitions. Tailwind forces you to restate every value, which normally feels verbose, but with a token-locked config it *enforces* consistency (which is exactly what a minimalist aesthetic needs).
- Override the default palette entirely. Ship ~8 custom neutrals (warm off-white, oat, clay, stone, ink) + 1–2 accent earth tones. Delete everything else so developers literally can't reach for a stray color.
- Use Tailwind's spacing scale but lean on the larger end (`py-24`, `gap-16`) — Japandi breathes.
- One serif display face + one sans body face, 4–5 sizes total.

**v4 specifics:**
- Native CSS `@theme` block replaces `tailwind.config.ts` for tokens — simpler to hand off.
- Oxide engine is faster; no measurable build impact on a site this size.
- Works with `next/font` out of the box.

**Why not CSS Modules:** Viable but slower iteration; no enforced design system; more boilerplate. Fine if the team were purely designers; for a solo-dev project shipping fast, Tailwind wins.
**Why not vanilla-extract / Panda / StyleX:** Overkill. No runtime styling needs. No theme-switching requirement beyond what CSS variables handle.
**Why not Tailwind + shadcn/ui:** shadcn components are excellent but visually "SaaS-default." For a craft/artisan aesthetic you'll end up deleting most of their styling. Pull individual primitives only if needed (e.g. `Dialog` from Radix UI directly).

**Component primitives:** Radix UI primitives (headless) for Dialog, Popover, Select, Toast — accessible, unstyled, stylable with Tailwind. Add only as features demand.

---

## Animation & Transitions

**Keep it almost invisible.** Japandi is the opposite of motion-heavy.

- **Framer Motion (now Motion)** for:
  - Fade-in on scroll for gallery items (`whileInView`, small `y` translate, 400–600ms, easeOut).
  - Hero text reveal on initial load (single, subtle).
  - Image hover: scale 1.02, 600ms. That's it.
- **CSS-only** for:
  - Link underline reveals.
  - Button press feedback.
- **View Transitions API** (optional, progressive enhancement) for cross-fade between gallery → detail page. Fallback gracefully on unsupported browsers.

**Ban list:** parallax scrolling, 3D transforms, spring bounces, stagger cascades with >300ms delay, loading spinners (use skeletons or nothing).

---

## Forms

**Stack:** React Hook Form + Zod + Next.js Server Actions + Resend.

**Flow:**
1. Client component with RHF + Zod resolver for instant validation feedback.
2. Form posts via a Server Action to `/actions/inquiry.ts`.
3. Server Action re-validates with the same Zod schema (never trust the client), sends email via Resend's SDK to the owner's inbox (configured via env var + Keystatic `settings` singleton for the "to" address).
4. Turnstile token verified server-side before email send.
5. Success state = inline thank-you message + reset form. No redirect.

**Fields (custom-order inquiry):** name, email, optional phone, item type (select from options managed in Keystatic), quantity, budget range (optional), message, preferred locale (auto-filled).

**Rate limit:** Upstash Redis free tier + `@upstash/ratelimit` (5 submissions/hour/IP). Optional for MVP but recommended before launch.

**Accessibility:** every field labeled, errors announced via `aria-live="polite"`, keyboard-navigable, no custom selects unless via Radix.

---

## What NOT to Use

| Rejected | Reason |
|---|---|
| Pages Router | App Router is the current default and required for best Keystatic integration patterns going forward. |
| `next-i18next` | Pages-Router era; not App-Router-native. |
| Sanity / Contentful / Payload | Violates the zero-cost / no-server constraint. Keystatic was selected for this reason. |
| Contentlayer | Unmaintained; MDX-first; Keystatic is the chosen CMS. |
| Styled-components / Emotion | Runtime CSS-in-JS has SSR/RSC friction in App Router. Tailwind + CSS vars covers all needs. |
| Chakra UI / Mantine / MUI | Opinionated visual language that fights a Japandi aesthetic — you'd spend more time overriding than building. |
| shadcn/ui (as a system) | Great primitives, wrong aesthetic baseline. Pull Radix directly if needed. |
| GSAP | Overkill for the motion vocabulary we want. Framer Motion or CSS is lighter and sufficient. |
| Lottie | Implies animation-forward design; contradicts Japandi restraint. |
| Stripe / Shopify Hydrogen / Medusa | Out of scope — no payments. Do not install an e-commerce stack "just in case." |
| Algolia / Typesense | Fewer than 100 works for foreseeable future; client-side filter on a pre-loaded list is faster to build and feels more tactile. |
| Google reCAPTCHA v3 | Privacy concerns (EU audience), heavier JS. Turnstile is the current best-in-class free choice. |
| Google Analytics | Cookie banner overhead; Vercel Analytics or Plausible are cookieless alternatives. |
| `next-sitemap` (as a separate lib) | App Router has first-class `sitemap.ts` — one less dependency. |
| Framer Motion's `LazyMotion` optimization layer for MVP | Premature optimization on a site with minimal animation surface. Add later if bundle analysis flags it. |

---

## Open Questions / Flags

- **Keystatic Cloud pricing & limits in 2026** — verify at https://keystatic.com before committing the GitHub-storage path for production. (LOW confidence)
- **Vercel Image Optimization transformation quota on hobby tier in 2026** — verify current cap before launch; have a fallback plan if exceeded. (LOW confidence)
- **Next.js View Transitions API** — still experimental; treat as progressive enhancement only. (LOW confidence)
- **Default locale decision (da vs en)** — needs owner input. Affects middleware config and canonical URLs.
- **Tailwind v4 stability** — v4 stable channel should be production-ready by 2026; verify no regressions for `next/font` + Turbopack before adoption. If in doubt, pin Tailwind v3.4 for MVP and migrate later. (MEDIUM confidence)

---

## Sources

- Training-data knowledge of: Next.js 15 App Router, Keystatic 0.5+, next-intl 3.x, Tailwind v4, Framer Motion, React Hook Form, Zod, Resend, Cloudflare Turnstile.
- **Live web verification was unavailable during this research pass** — findings flagged LOW confidence (version numbers, pricing tiers, quota limits, API stability) should be verified against official docs before any install/commit decision. Recommend running a quick Context7 pass on `keystatic`, `next-intl`, and `tailwindcss` once tooling permits.
