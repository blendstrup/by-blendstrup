<!-- GSD:project-start source:PROJECT.md -->
## Project

**By Blendstrup**

By Blendstrup is a website for a handmade ceramics shop that showcases the owner's latest works, lists items currently available for purchase, and allows customers to submit custom order inquiries. It is not a traditional e-commerce shop — inventory changes often, purchases are handled via direct contact, and the overall experience is designed to convey the quality and craft behind each piece.

**Core Value:** A visitor should immediately feel the quality and uniqueness of By Blendstrup's ceramics — imagery and products must be front and center, so every page makes them want to own a piece.

### Constraints

- **CMS**: Keystatic — git-based, completely free, no server or recurring cost
- **Hosting**: Vercel free tier — sufficient for this scale
- **Budget**: Zero ongoing infrastructure cost required
- **Tech stack**: Next.js (App Router) — best pairing with Keystatic and Vercel
- **CMS UX**: Must be usable by a non-technical owner without any developer help for routine content updates
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Recommended Stack

| Layer | Choice | Version (verify at install) | Rationale | Confidence |
|---|---|---|---|---|
| Framework | Next.js (App Router) | 15.x | Locked by constraints. App Router is the current default; best fit for Vercel + Keystatic. RSC reduces client JS for image-heavy pages. | HIGH |
| Runtime | Node.js / ppnpm | 20 LTS (or 22 LTS) | Vercel default; required by Next 15 + Keystatic. ppnpm for faster, disk-efficient package management. | HIGH |
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
| Linting/format | Biome | latest | Unified, fast tool for linting and formatting; replaces Biome/Biome. | HIGH |

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

- `collection: works` — every ceramic piece (whether for sale or archived).
- `singleton: homepage` — featured works ordering, hero copy (localized), intro paragraph.
- `singleton: about` — artist statement, studio photo, contact info (all localized).
- `singleton: customOrders` — page copy describing what's possible, lead times, starting prices (localized).
- `singleton: settings` — site title, SEO defaults, social links, inquiry recipient email.

## i18n Approach

- Use `next-intl`'s middleware for locale negotiation (`Accept-Language` header → redirect).
- UI strings (nav labels, button text, form validation) live in `messages/en.json` and `messages/da.json` — short files, committed with code. These are developer strings, not content.
- Content strings (work titles, descriptions, page copy) come from Keystatic via the sibling-field pattern. Selected via the current locale in the RSC.
- Language toggle is a simple client component that calls `next-intl`'s `useRouter()` with the other locale — preserves path.
- Set `<html lang={locale}>` in the locale layout for a11y/SEO.
- `hreflang` alternates in `generateMetadata` for SEO.

## Image Strategy

- **Always use `next/image`.** Never `<img>` for content imagery.
- **Source assets:** export from Lightroom/Capture One as sRGB JPEG at ~2400px long edge, quality 85. `next/image` handles downscaling and format conversion. Don't ship TIFF or HEIC.
- **Hero/featured:** `priority` + explicit `sizes="(max-width: 768px) 100vw, 80vw"`.
- **Gallery grid:** `sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"`. Lazy load by default.
- **Blur placeholder:** use `placeholder="blur"` with a generated `blurDataURL`. For Keystatic-managed images, generate at build time with `plaiceholder` (pairs with `next/image`).
- **Aspect ratios:** constrain in the design system — recommend a single hero ratio (e.g. 4:5 portrait) and square for grid thumbs. Consistency enforces Japandi rhythm.
- **Color space:** deliver sRGB; avoid wide-gamut exports — color will shift on non-P3 screens.
- **Alt text:** required in the Keystatic schema for every image field. Localized. Non-negotiable for a11y + SEO.

## Styling Decision

- Japandi is defined by restraint — generous whitespace, few type sizes, muted palette, hairline borders, quiet transitions. Tailwind forces you to restate every value, which normally feels verbose, but with a token-locked config it *enforces* consistency (which is exactly what a minimalist aesthetic needs).
- Override the default palette entirely. Ship ~8 custom neutrals (warm off-white, oat, clay, stone, ink) + 1–2 accent earth tones. Delete everything else so developers literally can't reach for a stray color.
- Use Tailwind's spacing scale but lean on the larger end (`py-24`, `gap-16`) — Japandi breathes.
- One serif display face + one sans body face, 4–5 sizes total.
- Native CSS `@theme` block replaces `tailwind.config.ts` for tokens — simpler to hand off.
- Oxide engine is faster; no measurable build impact on a site this size.
- Works with `next/font` out of the box.

## Animation & Transitions

- **Framer Motion (now Motion)** for:
- **CSS-only** for:
- **View Transitions API** (optional, progressive enhancement) for cross-fade between gallery → detail page. Fallback gracefully on unsupported browsers.

## Forms

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

## Open Questions / Flags

- **Keystatic Cloud pricing & limits in 2026** — verify at <https://keystatic.com> before committing the GitHub-storage path for production. (LOW confidence)
- **Vercel Image Optimization transformation quota on hobby tier in 2026** — verify current cap before launch; have a fallback plan if exceeded. (LOW confidence)
- **Next.js View Transitions API** — still experimental; treat as progressive enhancement only. (LOW confidence)
- **Default locale decision (da vs en)** — needs owner input. Affects middleware config and canonical URLs.
- **Tailwind v4 stability** — v4 stable channel should be production-ready by 2026; verify no regressions for `next/font` + Turbopack before adoption. If in doubt, pin Tailwind v3.4 for MVP and migrate later. (MEDIUM confidence)

## Sources

- Training-data knowledge of: Next.js 15 App Router, Keystatic 0.5+, next-intl 3.x, Tailwind v4, Framer Motion, React Hook Form, Zod, Resend, Cloudflare Turnstile.
- **Live web verification was unavailable during this research pass** — findings flagged LOW confidence (version numbers, pricing tiers, quota limits, API stability) should be verified against official docs before any install/commit decision. Recommend running a quick Context7 pass on `keystatic`, `next-intl`, and `tailwindcss` once tooling permits.
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, or `.github/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:

- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
