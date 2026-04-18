# Pitfalls — By Blendstrup

**Domain:** Handmade ceramics portfolio + contact-to-buy shop (Next.js App Router + Keystatic + Vercel, DA/EN bilingual)
**Researched:** 2026-04-18
**Overall confidence:** MEDIUM (training-data based — WebSearch was unavailable during this research pass; live verification of version-specific Keystatic/next-intl behavior is recommended before locking architecture)

This document catalogues the mistakes projects like this commonly make. Each pitfall includes **warning signs**, **prevention**, and the **phase** it should be addressed in. Phases map to the proposed roadmap structure (Foundation → Content Model → Gallery/Shop → Inquiry Forms → i18n → Polish/Launch).

---

## CMS & Content Management Pitfalls

### Critical: Schema designed for developers, not the owner

**What goes wrong:** Keystatic schemas modelled after database tables — nested relationships, obscure field names (`slug`, `metaDescription`, `featuredOrder`), and required fields that make sense to engineers but baffle a ceramicist.

**Warning signs:** Owner asks "what does 'slug' mean?", leaves optional fields blank because she's unsure what they do, publishes a piece and it doesn't appear because a required relationship wasn't set.

**Prevention:**
- Use the `label` and `description` properties on every field. A description like "This becomes the URL. Use lowercase with dashes, e.g. `blue-vase-1`" beats any onboarding doc.
- Auto-generate slugs from titles where possible (`slug` field with a derived default) and hide them behind a "Show advanced" group.
- Group fields with `fields.object({...})` into clear sections: "Basic info", "Photos", "For sale", "SEO (optional)".
- Prefer `fields.select` with explicit options over free-text (e.g., status: "draft" / "available" / "sold") — eliminates typo-driven bugs.
- Name collections in the owner's language: "Works", "For Sale", "Homepage" — not "entries", "products", "posts".

**Phase:** Content Model (Phase 2) — schema is the foundation of owner UX.

**Confidence:** HIGH — this is the single most common CMS failure mode across every CMS.

---

### Critical: Missing preview / no visual feedback before publish

**What goes wrong:** Keystatic's admin UI shows form fields, not the rendered page. Owner edits a piece, hits save, and only discovers the layout broke when she visits the live site — which on git-based CMS means the mistake is already deployed.

**Warning signs:** Owner asks "how do I see what this will look like before publishing?", broken images / empty sections appear on production, owner is afraid to edit for fear of "breaking things".

**Prevention:**
- Enable Keystatic's **local-mode preview** for development, and configure **preview URLs** in cloud mode so she can open a preview branch before merging.
- If using GitHub mode, route owner edits through **draft branches + Vercel preview deployments** — Vercel auto-comments a preview URL on every PR. She can visually check before approving.
- Provide a "draft" / "published" toggle in the schema and gate site rendering on `status === 'published'`. She can save WIP without affecting the live site.

**Phase:** Content Model (Phase 2), reinforced in Polish/Launch (Phase 6).

**Confidence:** HIGH.

---

### Moderate: Relationship fields without constraints

**What goes wrong:** "Featured homepage pieces" implemented as a free `fields.array(fields.relationship(...))` — owner can add the same piece twice, leave it empty, or forget to set the order, and the homepage silently breaks.

**Warning signs:** Duplicates on homepage, empty hero slots, weird ordering.

**Prevention:**
- Use `validation: { length: { min, max } }` on arrays (e.g., homepage hero: min 3, max 6).
- Use `fields.relationship` (singular) with explicit slots (Hero 1, Hero 2, Hero 3) rather than an open-ended array when order matters and count is fixed.
- Fall back gracefully in the renderer: if fewer than N featured items, show what exists rather than crashing.

**Phase:** Content Model (Phase 2).

**Confidence:** HIGH.

---

### Moderate: Image fields without guidance

**What goes wrong:** Owner uploads 12MB iPhone photos in portrait orientation for a landscape hero slot. Aspect ratio fights the layout, file sizes tank performance, and the CMS either chokes or commits bloat to git.

**Warning signs:** Git repo ballooning, slow Keystatic saves, layout distortion, owner asks "why does my photo look cut off?"

**Prevention:**
- Use Keystatic's `image` field with a documented aspect-ratio guide in the field description ("Use landscape photos, ideally 3:2. Portrait photos may be cropped on the homepage.").
- Set a clear **image storage strategy** — either (a) commit optimised images to the repo under a size limit, (b) use Keystatic Cloud's asset storage, or (c) offload images to a dedicated host (Cloudinary, Vercel Blob). Do NOT mix strategies.
- If using git storage, enforce a pre-commit image size check or a Keystatic-side warning. A 2MB hard cap per image is a sane starting point for web photography.
- Require `alt` text as a field next to every image (accessibility + SEO + bilingual alt is critical).

**Phase:** Content Model (Phase 2), image delivery in Gallery/Shop (Phase 3).

**Confidence:** HIGH.

---

### Moderate: No safe "delete" — owner loses work

**What goes wrong:** Owner deletes a piece she later wanted back. Git history technically preserves it, but she has no way to recover it without developer help.

**Prevention:**
- Prefer a `status: archived` option over deletion in the schema. Archived items hide from the site but remain in the CMS.
- Document (in the repo README or a one-page owner doc) that "deleted" content can be restored from git — and that developer help is needed to do so.

**Phase:** Content Model (Phase 2).

**Confidence:** MEDIUM.

---

## i18n Implementation Pitfalls

### Critical: Routing strategy chosen without commitment

**What goes wrong:** Starts with `/en/...` and `/da/...` prefixes, then later wants root-locale (`/` = Danish, `/en/...` = English) — or vice versa. Retrofitting breaks every internal link, SEO, and bookmarks.

**Warning signs:** Mid-project debates about URL structure, inconsistent link behaviour, language toggle that sometimes drops you on the homepage instead of the equivalent page.

**Prevention:**
- **Decide early and document it.** For a Danish-owned shop targeting Danish as primary with international reach, the common recommendation is `/` = Danish (default, no prefix) and `/en/...` for English. This signals primary market and is SEO-kind to Danish queries.
- Alternative: prefix both (`/da` and `/en`) — simpler routing code, uglier URLs. Pick one.
- Use `next-intl` (or Next.js built-in i18n routing via middleware) — do NOT roll your own locale detection.
- Implement the language toggle as a **page-equivalent** switch: toggling on `/works/blue-vase` should land on `/en/works/blue-vase`, not `/en`. This requires localised slugs or a slug mapping — plan for it.

**Phase:** i18n (Phase 5) — but the routing decision must be made in Foundation (Phase 1).

**Confidence:** HIGH.

---

### Critical: Translation drift — content exists in one language but not the other

**What goes wrong:** Owner adds a new piece, fills in Danish title and description, forgets English. The English site shows blank fields or half-translated entries.

**Warning signs:** English pages with Danish copy, missing titles, "undefined" rendering, mixed-language cards.

**Prevention:**
- Model localised fields as **required in both languages** at the schema level. Keystatic doesn't have first-class i18n field types, so the common pattern is:
  ```
  title: fields.object({
    da: fields.text({ validation: { isRequired: true } }),
    en: fields.text({ validation: { isRequired: true } }),
  })
  ```
- Render a **fallback** (show Danish with a small "translation pending" badge) rather than breaking, so an incomplete translation never produces a blank page.
- Add a CMS-side "missing translations" dashboard or a build-time check that lists entries with empty target-language fields.
- UI strings (buttons, labels) go into `messages/da.json` and `messages/en.json` — never hardcode Danish or English in components.

**Phase:** Content Model (Phase 2) and i18n (Phase 5).

**Confidence:** HIGH.

---

### Moderate: `hreflang` and SEO metadata forgotten

**What goes wrong:** Both language versions are live but Google indexes only one, or indexes them as duplicate content. No `<link rel="alternate" hreflang="...">` tags.

**Prevention:**
- Emit `hreflang` alternates in the `<head>` of every page, including `x-default`.
- Localise `<title>`, meta description, and Open Graph tags per locale.
- Use `generateMetadata` in Next.js App Router per route, reading locale from the route segment.

**Phase:** i18n (Phase 5) / Polish (Phase 6).

**Confidence:** HIGH.

---

### Moderate: Date, number, and currency formatting hardcoded

**What goes wrong:** "Posted on 04/18/2026" renders identically in Danish — but Danes write `18.04.2026` or `18. april 2026`. Prices show as "$120" when listing in DKK.

**Prevention:**
- Use `Intl.DateTimeFormat` and `Intl.NumberFormat` with the active locale.
- Decide currency display policy: show DKK by default; if showing EUR for English, make the conversion source explicit.

**Phase:** i18n (Phase 5).

**Confidence:** HIGH.

---

### Minor: Language toggle forgets the user's choice

**What goes wrong:** Every reload or deep link resets to default locale. Frustrating for English-speaking returning visitors.

**Prevention:** Persist locale in a cookie (`NEXT_LOCALE`) and respect it on entry routes. `next-intl` handles this out of the box — use it.

**Phase:** i18n (Phase 5).

**Confidence:** HIGH.

---

## Image & Performance Pitfalls

### Critical: Unoptimised hero images on the homepage

**What goes wrong:** Ceramics photography is the product. Owner uploads 4000×6000 JPEGs at 8MB each. Homepage LCP goes from 1.2s to 7s on mobile. Visitors bounce before seeing anything.

**Warning signs:** Lighthouse LCP > 2.5s, mobile data warnings, slow initial paint, low Core Web Vitals scores.

**Prevention:**
- Use `next/image` with explicit `sizes` per breakpoint — not defaults.
- Generate modern formats (AVIF + WebP) — Vercel's image optimisation does this automatically but **only if you use `next/image`**, not raw `<img>`.
- Set `priority` on above-the-fold hero images only; NEVER set it on gallery grids (priority on everything = priority on nothing).
- Use `placeholder="blur"` with generated blur data URLs for perceived-load speed.
- Be aware of **Vercel's image optimisation quotas on the free tier** — if gallery is large, budget source image count, or offload to Cloudinary / self-host with `next/image` `loader`.

**Phase:** Gallery/Shop (Phase 3), verified in Polish (Phase 6).

**Confidence:** HIGH.

---

### Critical: Art-direction ignored — same crop on desktop and mobile

**What goes wrong:** A beautiful landscape product shot that works on desktop becomes a sliver of clay on mobile. The product looks tiny and unimpressive.

**Prevention:**
- Where the hero is critical, author **two crops per image** (desktop wide + mobile tall) and serve with `<picture>` source media queries, or use a CMS "mobile variant" image field.
- For gallery cards, stick to a consistent square or 4:5 aspect ratio and instruct the owner via schema description.

**Phase:** Gallery/Shop (Phase 3).

**Confidence:** MEDIUM — may be over-engineering for MVP; revisit after launch based on real mobile behaviour.

---

### Moderate: Lazy loading breaks the "wow" moment

**What goes wrong:** Over-aggressive lazy loading means gallery images pop in late as the user scrolls, or initial gallery view shows empty placeholders. Kills the premium feel.

**Prevention:**
- Eager-load the first row of gallery images (top 3-6 visible on viewport).
- Use `loading="eager"` or `priority` selectively; `loading="lazy"` below the fold.
- Use proper `placeholder="blur"` or a solid matched-tone background so gaps feel intentional, not broken.

**Phase:** Gallery/Shop (Phase 3).

**Confidence:** HIGH.

---

### Moderate: CLS from images without dimensions

**What goes wrong:** Cumulative Layout Shift as images load and push content around. Cheap-feeling and bad for SEO.

**Prevention:**
- Always pass `width` and `height` to `next/image`, or use `fill` with a sized parent. Keystatic image fields should store dimensions — query them.
- Reserve aspect-ratio space via CSS (`aspect-ratio: 3/2`) even before JS hydrates.

**Phase:** Gallery/Shop (Phase 3).

**Confidence:** HIGH.

---

### Minor: Repo bloat from committed images

**What goes wrong:** Keystatic git-mode commits images to the repo. Six months in, the repo is 2GB, git clones are slow, Vercel build cache thrashes.

**Prevention:**
- Decide image storage strategy upfront (see CMS section).
- If committing to git, enforce per-image size caps and periodically audit.
- Use Keystatic Cloud storage or Vercel Blob to keep the code repo lean.

**Phase:** Content Model (Phase 2).

**Confidence:** MEDIUM.

---

## Design Pitfalls

### Critical: Using a template aesthetic that fights the product

**What goes wrong:** Generic "e-commerce starter" UI — product grid with star ratings, "Add to cart" buttons, stock counters, bright CTAs. The ceramics get lost inside SaaS chrome. Immediately reads as "dropshipping" rather than "artisan".

**Warning signs:** Site looks like every other Shopify template. Owner says "it doesn't feel like mine". Visitors don't linger.

**Prevention:**
- Design system-first: commit to a restrained palette (off-white, bone, muted earth, one accent), a pairing of serif display + neutral sans or a single humanist sans, generous whitespace.
- Remove e-commerce chrome you don't need (no cart icon, no wishlist, no "users also bought"). The "contact to buy" flow should feel curated, not transactional.
- Favour editorial layouts over grid-everything. Asymmetric spreads, large single-image sections, generous margins.

**Phase:** Foundation (Phase 1) for design system, revisited in Polish (Phase 6).

**Confidence:** HIGH.

---

### Critical: Typography that undermines craft

**What goes wrong:** System fonts, too many weights, loud type, tight letter spacing on body copy. Makes a hand-made product look machine-made.

**Prevention:**
- Choose 1-2 typefaces deliberately. A quiet serif (e.g., editorial workhorse like Tiempos, Söhne Serif, or a free alternative like Fraunces/Instrument Serif) paired with a neutral sans works for Japandi.
- Load via `next/font` to avoid FOUT and layout shift.
- Body text: generous line-height (1.6-1.7), measured line length (60-75ch max).

**Phase:** Foundation (Phase 1).

**Confidence:** HIGH.

---

### Moderate: Inconsistent image treatment

**What goes wrong:** Some photos are bright daylight on white, others are moody studio shots, some have shadows, some don't. The gallery feels chaotic.

**Prevention:**
- Write a one-page photography guide for the owner: background, lighting, angle conventions. Even rough consistency helps.
- If inconsistency is unavoidable, let the **design frame** carry consistency — same aspect ratio, same background crop, same subtle card treatment.
- Avoid drop shadows, borders, or decorative frames that date quickly.

**Phase:** Polish (Phase 6), but introduce the guide at Gallery/Shop (Phase 3).

**Confidence:** MEDIUM.

---

### Moderate: Over-animation

**What goes wrong:** Parallax, fade-in-on-scroll on every element, hover-zoom everywhere. Feels like a 2018 Dribbble shot, not a calm craft site.

**Prevention:**
- Use motion sparingly: a subtle fade on page transition, a gentle image hover state, and that's it.
- Respect `prefers-reduced-motion`.

**Phase:** Polish (Phase 6).

**Confidence:** HIGH.

---

### Moderate: Dense, loud copy on hero / about pages

**What goes wrong:** Hero reads "Welcome to By Blendstrup — Premium Handcrafted Artisanal Ceramics for the Discerning Collector!" Reads like a mattress site.

**Prevention:**
- Write short, quiet copy. One or two lines. Let imagery carry the mood.
- The About page is the exception — let the owner's voice show, bilingually.

**Phase:** Polish (Phase 6).

**Confidence:** HIGH.

---

### Minor: Mobile nav that shouts

**What goes wrong:** Full-screen drawer with huge buttons and animations feels aggressive for a calm brand.

**Prevention:** Quiet hamburger → slim overlay with type-led links. Avoid neon focus rings; use subtle underlines.

**Phase:** Polish (Phase 6).

**Confidence:** MEDIUM.

---

## Form & Email Pitfalls

### Critical: Inquiries land in the spam folder

**What goes wrong:** Form submissions routed through a free SMTP relay or raw `mailto:` — end up in Gmail spam, or never arrive. Owner quietly loses customers and has no idea.

**Warning signs:** "I submitted a form and never heard back" — from a customer or from test runs. Owner rarely checks spam.

**Prevention:**
- Use a **transactional email provider** (Resend, Postmark, SendGrid) — not `mailto:` and not unauthenticated SMTP.
- Send from a domain the owner controls (`inquiries@byblendstrup.com`), with **SPF, DKIM, and DMARC** configured. Resend makes this straightforward.
- Set `Reply-To` to the customer's email so the owner can reply directly from Gmail.
- **Send a confirmation email to the customer** (they get reassurance; if it bounces, you know the address is bad).
- **CC / BCC a second address** (owner's personal Gmail) as a backup delivery path.

**Phase:** Inquiry Forms (Phase 4).

**Confidence:** HIGH.

---

### Critical: No submission persistence — email is the only record

**What goes wrong:** Email delivery fails silently. The submission is gone forever. No way to audit, no way to recover.

**Prevention:**
- Persist every submission somewhere: a database row (Vercel Postgres / Neon / Supabase free tier), a row in an airtable/sheet via webhook, or a JSON log file. Even a simple append-only log.
- Email is then a *notification*, not the system of record.
- Show the owner a simple admin route (behind basic auth) listing recent inquiries.

**Phase:** Inquiry Forms (Phase 4).

**Confidence:** HIGH.

---

### Critical: No spam protection — inbox flooded by bots

**What goes wrong:** Form indexed by bots within weeks. Owner gets 50 SEO/crypto spam inquiries a day, misses real ones.

**Prevention:**
- Add a **honeypot field** (invisible input; if filled, drop the submission). Cheap and effective.
- Add **Cloudflare Turnstile** (free, privacy-friendly) or **hCaptcha** for a stronger second layer. Avoid Google reCAPTCHA v3 — worse UX and privacy concerns for an EU audience.
- Rate-limit by IP (Vercel Edge middleware or Upstash Redis).

**Phase:** Inquiry Forms (Phase 4).

**Confidence:** HIGH.

---

### Moderate: Validation errors are unhelpful

**What goes wrong:** Customer submits, gets "Error", has no idea what's wrong, gives up.

**Prevention:**
- Server-side validation with Zod (or similar), surfaced as specific field-level errors in the UI.
- Localise all error messages (DA + EN).
- Keep field names human: "Din e-mail / Your email" not "emailAddress".

**Phase:** Inquiry Forms (Phase 4).

**Confidence:** HIGH.

---

### Moderate: Form submission UX doesn't give confidence

**What goes wrong:** Button click, nothing happens, user clicks again, gets two submissions. Or page reloads and they think it failed.

**Prevention:**
- Disable submit button while pending, show loading state.
- On success, navigate to a dedicated `/thanks` (or locale-equivalent) page with clear next-steps copy ("You'll hear from [owner name] within 2-3 days").
- Server-side de-duplication by timestamp+email hash (defensive).

**Phase:** Inquiry Forms (Phase 4).

**Confidence:** HIGH.

---

### Moderate: GDPR omissions

**What goes wrong:** Danish / EU audience, form collects personal data, no privacy policy or consent language. Legally exposed.

**Prevention:**
- Short privacy statement linked from every form ("We'll only use your details to reply to your inquiry. We don't share them.").
- If storing submissions, mention that.
- No need for a cookie banner if you don't use analytics cookies — consider Vercel Analytics (cookieless) or Plausible for privacy-friendly stats.

**Phase:** Polish (Phase 6).

**Confidence:** MEDIUM — always worth a legal review before launch.

---

## Deployment Pipeline Pitfalls

### Critical: Owner commits via CMS break the build — and the site goes down

**What goes wrong:** Owner saves a piece with an empty required field (or a schema change deployed faster than her local Keystatic refreshed). Vercel builds, fails, site serves the last good deploy — or worse, partial deploys break pages.

**Warning signs:** Red build emails to the developer. Owner panicking.

**Prevention:**
- Vercel preserves the last successful deploy by default — **verify this is true on the free tier** and don't disable it.
- Use **Vercel preview deployments for every Keystatic edit** if using GitHub mode. Owner merges PRs only after preview is green.
- Schema migrations: never rename or remove fields without a migration plan. Deprecate (hide) first, remove after content is moved.
- Add a minimal build-time content validation step (Zod schema run against content JSON/MD) to fail fast with a clear error rather than breaking at runtime.

**Phase:** Foundation (Phase 1) for CI setup, ongoing through all phases.

**Confidence:** HIGH.

---

### Critical: Keystatic GitHub app permissions misconfigured

**What goes wrong:** Owner's GitHub login lacks write access to the repo, or the Keystatic GitHub app was installed to the wrong account. She can't save edits — gets a permissions error she doesn't understand.

**Prevention:**
- Set up Keystatic with a **dedicated GitHub org or the owner's own account** — pick one and stick with it.
- Document (for yourself) the exact install steps and auth flow.
- Test the full flow as the owner's GitHub account (not yours) before handoff.
- Consider **Keystatic Cloud** — paid but handles auth and reduces GitHub-setup friction. Evaluate cost vs. your time supporting her.

**Phase:** Foundation (Phase 1), verified in Polish (Phase 6) with owner walkthrough.

**Confidence:** MEDIUM — Keystatic auth details change; verify against current docs.

---

### Moderate: Long build times frustrate the owner

**What goes wrong:** Owner saves a small typo fix. Vercel rebuilds the entire site for 3 minutes. She assumes something broke.

**Prevention:**
- Use **Incremental Static Regeneration (ISR)** or on-demand revalidation — revalidate only the pages affected by a content change, not the whole site.
- With Next.js App Router + Keystatic reader, use `revalidateTag` / `revalidatePath` on content-change webhooks if feasible.
- Set expectations: tell the owner "changes appear within ~1 minute".

**Phase:** Content Model (Phase 2) / Polish (Phase 6).

**Confidence:** MEDIUM.

---

### Moderate: Environment variables missing on Vercel

**What goes wrong:** Resend API key, Turnstile secret, database URL set locally in `.env`, forgotten on Vercel. Forms work in dev, fail silently in production.

**Prevention:**
- Maintain an `.env.example` with every required key.
- Add a build-time check that throws on missing critical env vars.
- Use Vercel's environment variable UI; scope dev/preview/prod separately.

**Phase:** Inquiry Forms (Phase 4) / Polish (Phase 6).

**Confidence:** HIGH.

---

### Moderate: Image optimisation quota silently hit on Vercel free tier

**What goes wrong:** Traffic spikes (e.g., an Instagram post), Vercel's free image transform quota maxes out, images start serving as originals (huge) or not at all.

**Prevention:**
- Monitor Vercel image transformation usage.
- Pre-size images in Keystatic (via a build-time image pipeline or image CDN) so runtime `next/image` has less work.
- Consider Cloudflare Images or a self-hosted image CDN for heavy galleries.

**Phase:** Polish (Phase 6).

**Confidence:** MEDIUM — verify current Vercel free-tier quotas at build time.

---

### Minor: No staging environment for owner training

**What goes wrong:** You hand her the production CMS and say "go". She's scared to try anything because it's live.

**Prevention:**
- Give her a staging branch with preview CMS + preview site. She can experiment freely. Once comfortable, she graduates to production edits.
- Record a 5-minute screencast walkthrough — one-time cost, massive confidence boost.

**Phase:** Polish (Phase 6).

**Confidence:** HIGH.

---

## Phase-Specific Summary

| Phase | Biggest Pitfalls to Watch |
|-------|---------------------------|
| **1. Foundation** | i18n routing decision, design system restraint, typography choice, Keystatic auth setup |
| **2. Content Model** | Schema UX for non-tech owner, localised required fields, image storage strategy, status/draft workflow |
| **3. Gallery/Shop** | Image optimisation, CLS, art-direction for mobile, photography consistency guide |
| **4. Inquiry Forms** | Email deliverability (SPF/DKIM/DMARC), submission persistence, spam protection, localised validation |
| **5. i18n** | Translation drift, hreflang/SEO, locale-aware formatting, language-toggle page-equivalence |
| **6. Polish/Launch** | Preview workflow, owner training, GDPR, motion restraint, quota monitoring, env var audit |

---

## Top 5 "If You Only Fix These, Fix These"

1. **Design the Keystatic schema for the owner, not the database.** Grouped fields, human labels, good descriptions, required-where-it-matters. This is the single highest-leverage investment — it determines whether she'll actually use the site after launch.
2. **Pick the i18n routing pattern on day one and commit.** Localised fields as required-in-both-languages from the start. Retrofitting either is painful.
3. **Use a real transactional email provider with SPF/DKIM/DMARC, and persist every submission.** Lost inquiries = lost revenue and lost trust.
4. **Invest in the design system in Phase 1.** Restrained palette, deliberate type, quiet motion. The ceramics must be the loudest thing on the page.
5. **Give the owner a preview environment and a screencast walkthrough before handing over production.** Confidence beats documentation.

---

## Sources & Confidence

- This research was performed without live WebSearch (permission denied during this pass) and is grounded in training-data knowledge of: Keystatic schema patterns, Next.js App Router i18n (next-intl), Vercel platform behaviour, web performance best practices (Core Web Vitals, image optimisation), transactional email deliverability, and portfolio-site design conventions.
- **HIGH confidence items** reflect well-established, cross-project patterns unlikely to change with version bumps (e.g., email deliverability, CLS, schema UX failures).
- **MEDIUM confidence items** depend on specific Keystatic / Vercel / next-intl behaviour that should be verified against current docs before locking architectural decisions — specifically: Keystatic GitHub auth flow, Keystatic Cloud pricing/features, current Vercel free-tier image transform quotas, `next-intl` latest routing APIs.
- **Recommended follow-up before Phase 1 locks in:** a live-docs verification pass for Keystatic (keystatic.com/docs), next-intl (next-intl.dev), and Vercel free-tier limits.
