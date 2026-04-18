# Features Research — By Blendstrup

**Domain:** Handmade ceramics shop / artisan portfolio (Japandi/minimalist, bilingual DA/EN, contact-to-buy)
**Researched:** 2026-04-18
**Confidence:** MEDIUM (based on training-data knowledge of artisan/craft web conventions; WebSearch was unavailable during this research — findings should be validated against 3–5 current reference sites before finalizing the design system)

**Reference archetypes used (from training-data knowledge of the craft/ceramics web landscape):**
- Japanese/Scandinavian potters with portfolio-first sites (e.g., Jono Smart, Ingrid Tufts, Florian Gadsby, Akiko Hirai, Lilith Rockett, Ayumi Horie)
- Scandinavian studio shops (Bornholm/Copenhagen-based potters, Tortus Copenhagen-style presentation)
- Boutique lifestyle/home goods (Kinfolk, Analogue Life, Native & Co)
- Keystatic-based sites (lightweight, git-based content)

Where a convention is near-universal across these archetypes, it is marked HIGH confidence. Where it is common but varies, MEDIUM. Specific claims about individual sites should be verified.

---

## Table Stakes

Features visitors to an artisan ceramics site expect. Absence creates friction, looks amateurish, or breaks purchase intent.

| Feature | Why Expected | Complexity | Confidence |
|---|---|---|---|
| **Large, high-quality hero imagery** | First impression = quality signal. Craft buyers judge by photography quality before anything else. | Low (CMS-managed) | HIGH |
| **Works/gallery index** with thumbnail grid | Core browse surface. Users want to scan available pieces quickly. | Low | HIGH |
| **Individual product/piece detail pages** | Each piece is unique; needs its own URL, multiple photos, dimensions, materials, price (or "price on request"), availability state. | Medium | HIGH |
| **Multiple images per piece** (3–6 typical) | Ceramics must be shown from multiple angles; texture/glaze detail requires close-ups. Single image feels thin. | Low | HIGH |
| **Clear availability state per piece** ("Available", "Sold", "Reserved") | Gallery contains both sold and available work; ambiguity kills purchase intent. Must be instantly scannable. | Low | HIGH |
| **"Contact to buy" CTA on available pieces** | Replaces add-to-cart in this model. Needs to be obvious but not pushy. | Low | HIGH |
| **Contact form / email link** | Primary conversion mechanism. Needs to work reliably. | Low | HIGH |
| **Custom order inquiry page/form** | Explicitly promised in requirements. Users expect a dedicated flow, not buried in generic contact. | Medium | HIGH |
| **About / Maker story page** | Craft buyers buy the story as much as the object. "Who makes this?" is a near-universal click. | Low | HIGH |
| **Language switcher (DA ⇄ EN)** | Bilingual site → visible toggle in header is the expected pattern. | Low | HIGH |
| **Responsive / mobile-first layout** | Instagram is the primary discovery channel for ceramics; most inbound traffic is mobile. | Low | HIGH |
| **Fast image loading** (responsive images, lazy load) | Image-heavy site + mobile traffic = speed is perceived quality. Slow = cheap. | Medium | HIGH |
| **Basic SEO metadata** (title, description, OG image per piece) | Pieces get shared on Pinterest/Instagram; OG images must render. | Low | HIGH |
| **Instagram link / social proof** | Almost universal for makers. Visitors check Instagram to verify "real" studio. | Low | HIGH |
| **Footer with contact email, location (city/country), copyright** | Trust signals; expected placement. | Low | HIGH |
| **Email confirmation** after form submission (user-facing + owner notification) | Without a confirmation, users re-submit or assume it failed. | Medium | HIGH |
| **Legible typography / generous whitespace** | Japandi aesthetic is a table stake for this positioning, not a differentiator. | Low | HIGH |

---

## Differentiators

Features that signal premium craft positioning and elevate the experience above a generic Shopify/Etsy feel.

| Feature | Why It Differentiates | Complexity | Confidence |
|---|---|---|---|
| **Editorial-style piece pages** with long-form notes | Many shop pages are just "name + price". A paragraph on the clay body, firing, glaze, or intent reads as craft, not commodity. | Low (CMS field) | HIGH |
| **Materials & process metadata** (clay, glaze, firing type, wheel/hand-built, dimensions in cm) | Signals maker's literacy and respects the informed buyer. Standard among serious potters. | Low | HIGH |
| **"One of one" / uniqueness framing** — each piece has a title or number, not a SKU | Reinforces that this isn't mass production. Small detail, big signal. | Low | MEDIUM |
| **Collections / series grouping** (e.g., "Tea series", "Winter 2026") | Lets the maker curate narrative, not just dump inventory. Matches how galleries present work. | Medium | HIGH |
| **Past works archive** (sold pieces remain browsable) | Builds portfolio depth and FOMO. "You should have bought last season's" is a real psychological driver. | Low | HIGH |
| **Process / studio photography** interspersed (hands, wheel, kiln) | Humanizes the brand. Very common among top ceramics sites. | Low (content task) | HIGH |
| **Slow, deliberate transitions** (subtle fades, no aggressive motion) | Reinforces Japandi calm. Generic Shopify animations feel cheap here. | Medium | MEDIUM |
| **Monochrome / muted palette discipline** — no colored buttons, no sale badges | Removing e-commerce chrome is itself a signal of premium positioning. | Low | HIGH |
| **High-resolution zoom** or image lightbox on piece pages | Lets buyer inspect glaze detail; replicates the "hold it up to the light" moment. | Medium | MEDIUM |
| **Newsletter signup** for new drops | Fits the "new works arrive in batches" model better than real-time stock. Builds an audience the owner owns. | Low–Medium | MEDIUM |
| **Waitlist / "notify me" on sold-but-similar pieces** | Captures intent when something is already gone — without needing real e-commerce. | Medium | MEDIUM (validate demand) |
| **Custom order lead times stated upfront** ("4–6 weeks from confirmation") | Removes a common back-and-forth question; signals professionalism. | Low | HIGH |
| **Care instructions** (dishwasher, microwave, food-safety) surfaced on piece pages | Functional ceramics buyers ask this; answering proactively = trust. | Low | HIGH |
| **Prices displayed in local currency** (DKK for DA, EUR or DKK for EN) | Avoids friction for international buyers. Opinion: show DKK primary with EUR hint, or localize by language. | Low | MEDIUM |
| **Shipping information page** (domestic DK, EU, international — rough costs & timing) | Major pre-purchase question. Writing it once prevents dozens of inquiries. | Low | HIGH |

---

## Anti-Features

Things to **deliberately NOT include**. Most of these cheapen the experience by importing e-commerce conventions that don't fit a handmade, contact-to-buy model.

| Anti-Feature | Why Avoid | What to Do Instead |
|---|---|---|
| **Shopping cart / checkout UI** | Already out-of-scope, but also: even vestigial cart language ("Add to cart", "Buy now") cheapens it. | "Enquire" or "Contact to purchase" button. |
| **Sale badges / discount banners / countdown timers** | Pure e-commerce chrome. Antithetical to "each piece has a fair, considered price". | Don't discount. If a piece doesn't sell, archive it. |
| **Star ratings / customer reviews on pieces** | Each piece is unique — reviews don't apply. Also reads as Amazon-esque. | Testimonials on About page, curated by owner. |
| **Related products / "You may also like" recommendation carousels** | Algorithmic cross-sell cheapens the curation. The maker curates, not a widget. | Hand-picked "From the same series" via CMS relation. |
| **Live chat widget / chatbot** | Implies scale and automation. Wrong signal for a one-person studio. | Clearly stated response time ("I reply within 2–3 days"). |
| **Stock counters** ("Only 2 left!") | Artificial urgency. Every piece is 1-of-1 — that's already the urgency. | "Available" vs "Sold" state is enough. |
| **Pop-up newsletter modals on first visit** | Intrusive; breaks the calm of Japandi. | Inline signup in footer or after content. |
| **Autoplay video backgrounds with sound** | Noisy, disrespects the aesthetic. | Muted, looping b-roll at most — or stills. |
| **Dark patterns** (pre-checked marketing opt-ins, hidden fees) | GDPR issue in DK + brand-destroying. | Explicit, unchecked consent; no tricks. |
| **Excessive "NEW" badges or trending labels** | Marketplace language. | A "Latest works" section is enough. |
| **Gamified elements** (spin-to-win, loyalty points) | Wrong universe entirely. | — |
| **Auto-translate browser prompt / IP-based language redirect** | Guesses wrong often; frustrating. Danes abroad want Danish; expats in DK want English. | Manual toggle, remember preference. |
| **Heavy hero video / parallax scroll gymnastics** | Slow, distracts from the ceramics themselves. | Still photography, done extraordinarily well. |
| **Generic stock-photo "lifestyle" imagery** (not the owner's) | Inauthentic immediately. | Only the owner's photography of her own pieces. |

---

## Custom Order Flow Patterns

### What information to collect (minimum viable inquiry)

Collect *just enough* to reply intelligently — every extra field drops conversion. Recommended fields, in order:

1. **Name** (required, single line)
2. **Email** (required, validated)
3. **What are you interested in?** (required, short text or dropdown: e.g., "Tableware set", "Vase", "Coffee cups", "Other / Not sure")
4. **Describe what you have in mind** (required, multi-line textarea — free-form)
5. **Quantity / size of order** (optional, short text — e.g., "6 cups" or "Not sure yet")
6. **Preferred timeline** (optional — "No rush", "Within 1 month", "Within 3 months", "Specific date")
7. **Budget range** (optional, dropdown or free text — filters mismatched expectations early)
8. **Where did you hear about By Blendstrup?** (optional — useful analytics for the owner)
9. **Language preference for reply** (auto-detected from site language, but let user override)

**Confidence:** MEDIUM. This is a synthesis of common artisan/commission inquiry forms; specific fields should be validated with the owner based on the type of questions she currently gets most often.

### UX patterns that work

| Pattern | Rationale | Confidence |
|---|---|---|
| **Single page, not multi-step wizard** | Inquiry volume is low; wizards add friction and abandonment. | HIGH |
| **Set expectations before the form** — a short paragraph: "Tell me about your idea. I reply within X days. Custom pieces typically take 4–6 weeks from confirmation." | Reduces repeat "when will you reply?" emails and anxious re-submissions. | HIGH |
| **Show example custom work** above/beside the form | Grounds the inquiry in what's actually possible; primes better briefs. | MEDIUM |
| **Optional image upload** (reference / inspiration) | Dramatically improves brief quality. Requires storage strategy (e.g., email attachment via form service, or Vercel Blob / Cloudinary). | MEDIUM |
| **Honeypot + basic rate-limit spam prevention** (not visible CAPTCHA) | CAPTCHA harms UX; honeypot is invisible and usually sufficient at this scale. | HIGH |
| **Thank-you page (not toast)** with "What happens next" — and a link back to the gallery | Replaces the anxiety gap between submit and owner's reply. | HIGH |
| **Owner gets a clean, formatted email** (not a raw JSON dump) | Makes the owner's life easier; increases likelihood she replies fast. | HIGH |
| **Auto-reply in the user's chosen language** | Confirms receipt + sets timeline expectation. | HIGH |
| **GDPR consent checkbox** (explicit, unchecked) for storing their message and contacting them back | Required in DK/EU. | HIGH |

### Also consider (for the "contact to buy" flow on individual pieces)

- **Pre-fill the inquiry** with the piece name / link when the user clicks "Enquire" on a specific piece — reduces friction and ambiguity ("which one?").
- Use the **same form component** as custom orders but with a different intro and a pre-filled "Interested in" field. Simpler to maintain.

---

## Bilingual UX Patterns

Danish + English, manual toggle, shared layout. Confidence: HIGH on the general patterns below — these are conventions across well-executed Scandinavian bilingual sites.

### Language switching

| Pattern | Recommendation | Confidence |
|---|---|---|
| **Toggle placement** | Top-right of header, visible on all pages. Compact. | HIGH |
| **Toggle label** | `DA / EN` with the current language emphasized (bold or underlined). Avoid flags — Danish flag excludes English-speaking non-Brits, English flag is ambiguous (UK/US). Text is universally clearer. | HIGH |
| **URL structure** | Path-based: `/da/...` and `/en/...` (or `/` defaults to one and `/en/...` for the other). Enables per-language SEO, shareable links, browser back/forward working intuitively. Avoid query strings (`?lang=en`) and cookie-only switching (breaks sharing & SEO). | HIGH |
| **Default language** | Decide deliberately. Options: (a) Danish as `/` default with English at `/en/` — signals Danish brand; (b) detect `Accept-Language` on first visit only, then respect user's manual choice via cookie. **Recommendation:** Danish-first at `/` for brand identity; respect explicit user toggle thereafter. | MEDIUM |
| **Persist user choice** | Cookie or localStorage remembering the last chosen language — but never override an explicit URL. | HIGH |
| **Hreflang tags** in `<head>` | `<link rel="alternate" hreflang="da" ...>` + `<link rel="alternate" hreflang="en" ...>` + `x-default`. Critical for Google to serve the right language. | HIGH |
| **Switcher keeps user on the equivalent page** | Toggling on `/da/works/blue-vase` should land on `/en/works/blue-vase` (same piece, other language) — not the EN homepage. Requires stable piece slugs or a mapping. | HIGH |
| **No automatic redirect on subsequent visits** based on IP | IP geolocation is unreliable and surprising. Only respect explicit toggle + saved preference. | HIGH |

### Content strategy

| Pattern | Recommendation | Confidence |
|---|---|---|
| **All user-facing strings localized**, including form labels, validation messages, email auto-replies, 404, and error states | Half-translated sites read as unprofessional. | HIGH |
| **Piece titles and descriptions are fully translated** — not machine-translated | Owner writes both. Keystatic supports per-locale fields. Machine translation for poetic product copy is noticeably bad. | HIGH |
| **Numbers/units**: dimensions in cm (both locales), weight in grams. Prices DKK primary; optionally show EUR hint on EN. | HIGH |
| **Dates** in EN should use "18 April 2026" (unambiguous); DA can use "18. april 2026". Avoid MM/DD vs DD/MM ambiguity. | HIGH |
| **Slugs**: URL-safe, can be identical across locales (simpler) or localized (better SEO). For small sites, identical slugs are fine. | MEDIUM |
| **Fallback behavior** if a piece is missing a translation: show the available language with a small note, or hide from that locale's index. Decide deliberately in the CMS schema. | HIGH |

### Keystatic-specific note

Keystatic supports localized fields via its schema. The owner will need a clear editor UX where DA and EN fields appear side-by-side per piece — this is important to confirm in the CMS setup phase. Confidence: MEDIUM — verify exact Keystatic localization capabilities in the Architecture phase.

---

## Gallery / Portfolio Patterns

How ceramics and craft sites effectively present work.

### Index / listing page patterns

| Pattern | Description | Recommendation | Confidence |
|---|---|---|---|
| **Grid, not masonry** | Uniform aspect-ratio tiles (square or 4:5) read as a curated collection; masonry reads as a feed. | Square or 4:5 tiles, 2 cols mobile, 3–4 cols desktop. | HIGH |
| **One image per tile, one piece per tile** | No carousels in thumbnails. Let the hero shot do the work. | HIGH |
| **Minimal tile metadata** | Name + availability state on hover/below; price optional on index, definitely on detail. | HIGH |
| **Filter: Available / All / Sold** | Low-friction way to let buyers narrow to buyable pieces without hiding the portfolio. | MEDIUM |
| **Collections as separate pages** | "Tea series", "Winter 2026" etc. — each a curated page, rather than a tag filter. | HIGH |
| **Chronological order by default** (newest first) | Matches visitor expectation; owner controls via CMS `publishedDate`. | HIGH |
| **Lazy-load below the fold** with proper placeholders (blur-up or solid tone) | Image-heavy page; don't block initial paint. | HIGH |

### Piece detail page patterns

| Pattern | Description | Confidence |
|---|---|---|
| **Large primary image, full-bleed or near-full-bleed** | The photograph is the content. | HIGH |
| **Secondary images in a vertical column or below** (not auto-rotating carousel) | Buyers want to inspect at their own pace. | HIGH |
| **Click to enlarge / lightbox** on images | Enables detail inspection without leaving context. | MEDIUM |
| **Metadata block**: name, year, dimensions, materials, price, availability | Right of or below the hero image. Restrained typography. | HIGH |
| **Description / maker's note** | 1–3 short paragraphs. Owner's voice. | HIGH |
| **"Enquire" / "Contact to buy" CTA** prominent but not gaudy | One primary action. Pre-fills the contact form with piece reference. | HIGH |
| **"Back to works"** breadcrumb or back link | Don't trap users. | HIGH |
| **Prev / next piece** navigation at page bottom | Encourages exploration. | MEDIUM |
| **Sold pieces: keep the page, mark clearly** | Portfolio value. Replace CTA with "This piece has sold — enquire about a similar custom piece" linking to the custom order form. | HIGH |
| **Share / save**: a copy-link button is plenty | No noisy social share buttons. | MEDIUM |

### Photography guidance (to surface in the CMS brief for the owner)

Not a feature per se, but the single biggest quality lever:

- Consistent background across pieces (neutral, textured but quiet)
- Consistent lighting direction
- Same rough camera distance / framing for index shots, then variable for detail shots
- Color calibration — avoid Instagram filters on canonical product shots
- Shoot at high resolution; responsive images downscale. Don't upscale.

This is owner-executed, but the site should enforce / hint at these through image aspect-ratio fields and the CMS brief.

---

## MVP Recommendation

**Ship first** (Phase 1 — foundational features, all table-stakes):
1. Homepage with hero + featured pieces + short maker intro
2. Works index (grid, newest first, with Available/Sold states)
3. Piece detail page (multiple images, metadata, "Enquire" CTA pre-filled)
4. Contact / custom order form (single page, email delivery, auto-reply, thank-you page)
5. About / maker page
6. Bilingual DA/EN with header toggle and `/da`, `/en` routing
7. Responsive design
8. Keystatic schema for all the above, fully localized
9. Basic SEO + OG images per piece

**Ship second** (Phase 2 — differentiators that elevate perception):
10. Collections / series pages
11. Past works archive view / filter
12. Shipping info & care instructions pages
13. Newsletter signup (footer, inline) — only if owner commits to sending it
14. Image lightbox on piece pages

**Defer / consider later**:
- Waitlist / notify-me (needs validated demand)
- Optional image upload on custom order form
- EUR price hints on EN locale
- Prev/next piece navigation

---

## Gaps / Open Questions for Owner Validation

These should be resolved during design/scope conversations, not assumed:

1. **Price display policy**: show price on all available pieces, or "price on request" for some? Most boutique potters show prices — hiding them signals gallery, not shop.
2. **Sold-piece visibility**: keep sold pieces in main index (marked), or move to archive sub-page? Affects perceived inventory.
3. **Newsletter**: owner willing/able to send it consistently? If not, don't build it.
4. **Shipping**: domestic DK only, or EU/international? Affects shipping info page and customer expectations.
5. **Custom order budget question**: does the owner want to ask for a budget upfront? Some makers find it useful, others find it presumptuous.
6. **Reference images on custom orders**: is the owner comfortable receiving image uploads (privacy, storage), or should users paste links?
7. **Response time commitment**: what can the owner realistically promise (48 hours? 3 days? within a week)? This drives the auto-reply copy.
8. **Fallback translation policy**: if a piece has DA only, should it appear on `/en/` (with DA text) or be hidden?

---

## Sources & Confidence Notes

- **WebSearch was unavailable** during this research session. Findings are synthesized from training-data knowledge (cutoff January 2026) of the artisan ceramics / craft website landscape and general web UX conventions.
- **Domain conventions** (table stakes, anti-features, gallery patterns) are HIGH confidence — they are long-stable across the craft/boutique web.
- **Specific UX recommendations** (form field ordering, exact toggle placement, etc.) are MEDIUM confidence and should be validated against 3–5 current reference sites during the design phase.
- **Keystatic-specific localization capabilities** should be verified against current Keystatic docs (Context7 or official docs) in the Architecture / Stack phase before finalizing the schema approach.
- **No post-mortems, reviews, or competitor audits were consulted** — recommend a short reference-site audit (owner + designer picking 5–8 ceramics sites they admire) before finalizing visual/interaction patterns.
