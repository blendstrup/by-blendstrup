# Phase 5: Inquiries & Email Delivery - Context

**Gathered:** 2026-04-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Stand up the two inquiry forms and wire transactional email delivery:

1. **Purchase inquiry form** (`/contact/purchase`) — pre-populated with piece context via `?piece=slug` query param; sent from gallery card and detail page CTAs
2. **Custom order form** (`/custom-orders`) — captures what they want, quantity, description, contact info, optional budget and timeline
3. **Spam protection** — honeypot field on both forms
4. **Resend transactional email** — simple HTML email to owner, SPF/DKIM/DMARC DNS records documented and applied

This phase does NOT include: auto-reply emails to the customer (v2 scope), Turnstile integration (not chosen), or UI polish / responsive QA (Phase 6).

</domain>

<decisions>
## Implementation Decisions

### Purchase Inquiry Flow

- **D-01:** Purchase inquiry form lives at `/contact/purchase` — already stubbed in the contact page (Phase 4).
- **D-02:** "Contact to buy" CTAs on gallery cards (`ShopCard`, `WorkDetail`) link to `/contact/purchase?piece=slug`. The form reads the `piece` query param and pre-fills a "Regarding:" field showing the piece title. The piece slug is used to look up the title via the Keystatic Reader API at render time (RSC).
- **D-03:** The piece reference is a read-only display field on the form (visitor cannot change it), plus a hidden input that carries the slug value into the submission.

### Custom Order Form

- **D-04:** Custom order form lives at `/custom-orders` — already linked from the contact page stub and the homepage CTA.
- **D-05:** Required fields: name, email, description of what they want, quantity. Optional fields: budget range, desired timeline. All field labels in Danish (site is Danish-only).

### Spam Protection

- **D-06:** Honeypot field on both forms. A visually hidden input (positioned off-screen via CSS, not `display:none` or `visibility:hidden` — screen readers see `display:none` variants better; use `aria-hidden` + absolute position off-screen) with a name that sounds enticing to bots (e.g., `website`). If the field is non-empty on submission, silently discard the submission and return a fake success response.

### Form Submission Mechanism

- **D-07:** Server Actions (Next.js 15 native). Forms use `action={serverAction}` — no client JS required for basic submission. Progressive enhancement by default.
- **D-08:** React Hook Form + Zod for client-side validation UX. Zod schema is defined server-side and shared/re-used for server-side validation inside the server action. Field errors appear inline without a page reload.

### Email Format & Delivery

- **D-09:** Simple HTML email to the owner. No template engine — Resend accepts inline HTML strings. Structure: bold field labels with values below, piece/form type in the subject line.
  - Purchase inquiry subject: `Ny forespørgsel: [piece title]`
  - Custom order subject: `Ny specialbestilling fra [name]`
- **D-10:** Resend is the email provider. Installed as a new dependency.
- **D-11:** SPF, DKIM, and DMARC are in scope for Phase 5. The planner must document the exact DNS records to add to the owner's domain (Resend provides these during domain setup). The phase is not complete until email delivery is verified end-to-end (test submission → owner inbox, SPF/DKIM pass).

### Claude's Discretion

- Exact honeypot field name and CSS off-screen technique
- Error and success UI states on the forms (toast, inline banner, or redirect to a thank-you state)
- Whether to use `useFormState` / `useActionState` (React 19) or a simpler controlled approach with RHF
- Loading/pending state indication during submission (button disabled + spinner, or text change)
- Field order and grouping within each form
- Resend API key env var name (`RESEND_API_KEY` is the convention)
- Whether to add a `RECIPIENT_EMAIL` env var or read from the Keystatic `settings.contactEmail` field at server action time

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design System (authoritative)
- `.planning/phases/01-foundation/01-UI-SPEC.md` — Complete design contract: Fraunces + DM Sans fonts, full color palette (linen, oat, clay, stone, ink, terracotta, fault, ink-surface), spacing scale, Tailwind `@theme` block. All form and page visual decisions must derive from this file.

### Keystatic Schema Reference
- `.planning/phases/02-content-model-cms-ux/02-VERIFICATION.md` — Documents the full works/categories/homepage schema. Phase 5 needs to read `works` collection entries to look up piece titles from slugs (for the purchase inquiry pre-population).

### Stack Constraints and Integration Notes
- `CLAUDE.md` — next/image strategy, Keystatic Reader API usage in RSCs (read piece title server-side from slug), what NOT to use. Confirm: site is Danish-only (i18n removed); no locale prefix in routes.

### Phase Requirements (phase-scoped)
- `.planning/REQUIREMENTS.md` §CUST-01 — Custom order form fields: what they want, quantity, description, contact info
- `.planning/REQUIREMENTS.md` §CUST-02 — Optional budget range and desired timeline fields
- `.planning/REQUIREMENTS.md` §CUST-03 — Spam protection (honeypot chosen)
- `.planning/REQUIREMENTS.md` §CONT-02 — Purchase inquiry emails delivered reliably (SPF/DKIM/DMARC)
- `.planning/REQUIREMENTS.md` §CONT-03 — Custom order inquiry emails delivered reliably

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/app/contact/page.tsx` — Contact page with stubs already linking to `/contact/purchase` (purchase inquiry) and `/custom-orders` (custom order). Phase 5 builds the target pages; the stubs need no changes.
- `src/components/WorkDetail.tsx` — Renders the "Contact to buy" CTA on gallery detail pages. CTA href must be updated to `/contact/purchase?piece=[slug]`.
- `src/components/ShopCard.tsx` — Renders the "Contact to buy" CTA on shop/gallery cards. CTA href must be updated to `/contact/purchase?piece=[slug]`.
- `src/app/globals.css` — Design tokens live here. All form input/button styles must use these tokens.
- `messages/da.json` — Existing Danish strings at `contact.purchase.*` and `contact.customOrders.*` already defined. Phase 5 will extend these with form field labels, validation messages, and success/error copy.

### Established Patterns
- RSC for data fetching — Keystatic Reader API (`createReader`) in server components; never in client components. Use this to read piece title from slug in the purchase inquiry page.
- Tailwind v4 utility classes with design tokens from `@theme` — no inline styles, no arbitrary values where a token exists.
- Biome for linting/formatting.
- Server Actions: Next.js 15 App Router supports `use server` functions and `action={}` on `<form>`. Follow this pattern.

### Integration Points
- New routes needed: `src/app/contact/purchase/page.tsx` (purchase inquiry form + server action), `src/app/custom-orders/page.tsx` (custom order form + server action)
- `WorkDetail` and `ShopCard` CTAs need `?piece=slug` appended to their `/contact/purchase` href
- Resend: new dependency to install (`resend` npm package). Server action imports and calls Resend client.
- Env vars: `RESEND_API_KEY` must be added to `.env.local` and Vercel project settings.

</code_context>

<specifics>
## Specific Ideas

- Purchase inquiry form "Regarding" field: read piece title server-side (RSC) from the `?piece` query param using `createReader`. Render it as a read-only `<p>` or disabled input above the form, not an editable field. If the slug is invalid or missing, show the form without the pre-fill (general purchase inquiry fallback).
- Honeypot: `<input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] opacity-0 pointer-events-none" />`. Name `website` is a classic bot attractor.
- Email HTML: minimal structure — `<h2>` for form type, `<strong>` labels, `<p>` values, `<hr>` between sections. Match ink/terracotta color scheme if inline styles are used.
- Server action pattern: `'use server'` at top of action file, validate with Zod, check honeypot, call Resend, return `{ success: boolean, error?: string }`.

</specifics>

<deferred>
## Deferred Ideas

- Auto-reply email to customer (v2 — SHOP-05 and CUST-04 in REQUIREMENTS.md v2 section)
- Cloudflare Turnstile (not chosen for Phase 5 — honeypot is sufficient for low-traffic site; upgrade path exists)
- Rate limiting per IP (could complement honeypot; deferred as unnecessary for current traffic)

</deferred>

---

*Phase: 05-inquiries-email-delivery*
*Context gathered: 2026-04-20*
