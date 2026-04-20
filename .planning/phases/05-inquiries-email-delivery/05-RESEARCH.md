# Phase 5: Inquiries & Email Delivery - Research

**Researched:** 2026-04-20
**Domain:** Next.js 15 Server Actions, Resend transactional email, honeypot spam protection, Zod validation
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Purchase inquiry form lives at `/contact/purchase` — already stubbed in the contact page (Phase 4).
- **D-02:** "Contact to buy" CTAs on gallery cards (`ShopCard`, `WorkDetail`) link to `/contact/purchase?piece=slug`. The form reads the `piece` query param and pre-fills a "Regarding:" field showing the piece title. The piece slug is used to look up the title via the Keystatic Reader API at render time (RSC).
- **D-03:** The piece reference is a read-only display field on the form (visitor cannot change it), plus a hidden input that carries the slug value into the submission.
- **D-04:** Custom order form lives at `/custom-orders` — already linked from the contact page stub and the homepage CTA.
- **D-05:** Required fields: name, email, description of what they want, quantity. Optional fields: budget range, desired timeline. All field labels in Danish.
- **D-06:** Honeypot field on both forms. Visually hidden input with a name that sounds enticing to bots (e.g., `website`). If field is non-empty on submission, silently discard and return fake success.
- **D-07:** Server Actions (Next.js 15 native). Forms use `action={serverAction}` — no client JS required for basic submission. Progressive enhancement by default.
- **D-08:** React Hook Form + Zod for client-side validation UX. Zod schema defined server-side and shared/re-used for server-side validation inside the server action. Field errors appear inline without page reload.
- **D-09:** Simple HTML email to the owner. No template engine — Resend accepts inline HTML strings. Subject formats: `Ny forespørgsel: [piece title]` (purchase), `Ny specialbestilling fra [name]` (custom order).
- **D-10:** Resend is the email provider. Installed as a new dependency.
- **D-11:** SPF, DKIM, and DMARC are in scope for Phase 5. The planner must document the exact DNS records. Phase is not complete until email delivery is verified end-to-end (test submission → owner inbox, SPF/DKIM pass).

### Claude's Discretion

- Exact honeypot field name and CSS off-screen technique
- Error and success UI states on the forms (toast, inline banner, or redirect to a thank-you state)
- Whether to use `useFormState` / `useActionState` (React 19) or a simpler controlled approach with RHF
- Loading/pending state indication during submission (button disabled + spinner, or text change)
- Field order and grouping within each form
- Resend API key env var name (`RESEND_API_KEY` is the convention)
- Whether to add a `RECIPIENT_EMAIL` env var or read from the Keystatic `settings.contactEmail` field at server action time

### Deferred Ideas (OUT OF SCOPE)

- Auto-reply email to customer (v2 — SHOP-05 and CUST-04)
- Cloudflare Turnstile (not chosen for Phase 5)
- Rate limiting per IP
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CUST-01 | Visitor can submit a custom order request with: what they want, quantity, free-form description, contact info | D-04, D-05, D-07, D-08 — form fields + server action delivery |
| CUST-02 | Custom order form includes optional budget range and desired timeline fields | D-05 — optional fields pattern with Zod `.optional()` |
| CUST-03 | Custom order form has spam protection (honeypot) | D-06 — honeypot technique documented below |
| SHOP-04 | Each for-sale piece has a "Contact to buy" CTA that opens a purchase inquiry form | D-01, D-02, D-03 — ShopCard + WorkDetail CTA updates |
| CONT-02 | Purchase inquiry emails are delivered reliably to the owner (SPF/DKIM/DMARC configured) | D-09, D-10, D-11 — Resend + DNS records |
| CONT-03 | Custom order inquiry emails are delivered reliably to the owner | D-09, D-10, D-11 — Resend + DNS records |
</phase_requirements>

---

## Summary

Phase 5 builds two server-rendered inquiry forms wired to Resend transactional email. The technical foundation is well-established: Next.js 15 Server Actions are stable and ship with React 19's `useActionState` hook for inline error display and pending state management. Zod provides the shared validation schema that runs identically on client (via RHF resolver) and server (inside the action). Resend's Node.js SDK integrates with a single `resend.emails.send()` call.

The only new dependency is `resend` (v6.x) — `react-hook-form` and `zod` are not yet installed and must both be added. The Keystatic Reader API pattern is already established in the codebase (used in the contact page and gallery) for server-side piece title lookup. The DNS deliverability work (SPF, DKIM, DMARC) is a configuration-only task that requires access to the owner's DNS provider — the planner should document this as a human-checkpoint task.

The two CTAs in `ShopCard` and `WorkDetail` currently link to `/contact` — they need updating to `/contact/purchase?piece=[slug]`. This is a straightforward change that touches two component files.

**Primary recommendation:** Use `useActionState` (React 19, built into this project's React 19.x) for server action state management rather than layering RHF over it. RHF adds client-side UX for inline field errors — wire it via a `zodResolver` that shares the same Zod schema as the server action. The form submits via `formAction` from `useActionState`, giving progressive enhancement plus client-side feedback.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| resend | 6.12.2 | Transactional email delivery | Locked by D-10; official Next.js integration partner; free tier; simple API |
| react-hook-form | 7.72.1 | Client-side form UX and inline error display | Locked by D-08; minimal client JS; works alongside `useActionState` |
| zod | 4.3.6 | Schema validation shared between client and server | Locked by D-08; used via `zodResolver` in RHF and `safeParse` in server action |

[VERIFIED: npm registry — versions confirmed 2026-04-20]

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @hookform/resolvers | latest (~3.x) | Connects Zod schema to RHF | Required for `zodResolver(schema)` in `useForm()` |

[ASSUMED — `@hookform/resolvers` version; verify with `npm view @hookform/resolvers version` before install]

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `useActionState` + RHF | RHF-only with `handleSubmit` | RHF-only loses progressive enhancement; server actions work without JS |
| Resend inline HTML | React Email templates | React Email adds a dependency and build complexity for simple owner-notification emails — inline HTML is sufficient |
| Shared Zod schema file | Duplicate validation | Never duplicate — one schema, used in both action and RHF resolver |

**Installation:**

```bash
pnpm add resend react-hook-form @hookform/resolvers zod
```

**Version verification:**

```bash
npm view resend version        # → 6.12.2 (verified 2026-04-20)
npm view react-hook-form version  # → 7.72.1 (verified 2026-04-20)
npm view zod version           # → 4.3.6 (verified 2026-04-20)
npm view @hookform/resolvers version  # verify before install
```

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── app/
│   ├── contact/
│   │   └── purchase/
│   │       └── page.tsx          # RSC: reads ?piece=slug, renders PurchaseForm
│   └── custom-orders/
│       └── page.tsx              # RSC: renders CustomOrderForm
├── actions/
│   ├── purchase-inquiry.ts       # 'use server' — Zod validate, honeypot check, Resend
│   └── custom-order.ts           # 'use server' — Zod validate, honeypot check, Resend
├── components/
│   ├── PurchaseInquiryForm.tsx   # 'use client' — useActionState + RHF
│   ├── CustomOrderForm.tsx       # 'use client' — useActionState + RHF
│   └── SubmitButton.tsx          # 'use client' — reads isPending, disables during submission
└── lib/
    └── schemas/
        ├── purchase-inquiry.ts   # Zod schema (shared, no directive)
        └── custom-order.ts       # Zod schema (shared, no directive)
```

**Key structural rule:** Zod schema files MUST NOT have `'use server'` or `'use client'` — they are plain modules imported by both server actions and client components.

### Pattern 1: Server Action with Zod + Honeypot

**What:** A `'use server'` function validates FormData with Zod, checks honeypot, sends email, returns typed state object.
**When to use:** Both form submissions in this phase.

```typescript
// src/actions/purchase-inquiry.ts
// Source: https://nextjs.org/docs/app/guides/forms
'use server'

import { Resend } from 'resend'
import { purchaseInquirySchema } from '@/lib/schemas/purchase-inquiry'

const resend = new Resend(process.env.RESEND_API_KEY)

export type ActionState = {
  success: boolean
  error?: string
  fieldErrors?: Record<string, string[]>
}

export async function submitPurchaseInquiry(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  // Honeypot check — silent discard
  const honeypot = formData.get('website')
  if (honeypot) {
    return { success: true } // fake success
  }

  const raw = {
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
    pieceSlug: formData.get('pieceSlug'),
    pieceTitle: formData.get('pieceTitle'),
  }

  const result = purchaseInquirySchema.safeParse(raw)
  if (!result.success) {
    return {
      success: false,
      fieldErrors: result.error.flatten().fieldErrors,
    }
  }

  const recipientEmail = process.env.RECIPIENT_EMAIL ?? ''

  const { error } = await resend.emails.send({
    from: 'By Blendstrup <noreply@byblendstrup.dk>',
    to: recipientEmail,
    subject: `Ny forespørgsel: ${result.data.pieceTitle ?? 'Generel forespørgsel'}`,
    html: buildPurchaseEmail(result.data),
  })

  if (error) {
    return { success: false, error: 'Der opstod en fejl. Prøv igen.' }
  }

  return { success: true }
}
```

[CITED: https://nextjs.org/docs/app/guides/forms — `useActionState` + server action pattern]
[CITED: https://resend.com/docs/send-with-nextjs — Resend SDK usage]

### Pattern 2: Client Form Component with `useActionState`

**What:** A `'use client'` component that wires RHF for inline client validation and `useActionState` for server-driven state and pending flag.
**When to use:** Both form components in this phase.

```typescript
// src/components/PurchaseInquiryForm.tsx
// Source: https://nextjs.org/docs/app/guides/forms (useActionState pattern)
'use client'

import { useActionState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { submitPurchaseInquiry, type ActionState } from '@/actions/purchase-inquiry'
import { purchaseInquirySchema } from '@/lib/schemas/purchase-inquiry'

const initialState: ActionState = { success: false }

export function PurchaseInquiryForm({ pieceSlug, pieceTitle }: Props) {
  const [state, formAction, isPending] = useActionState(
    submitPurchaseInquiry,
    initialState,
  )

  const { register, formState: { errors } } = useForm({
    resolver: zodResolver(purchaseInquirySchema),
  })

  if (state.success) {
    return <p className="font-sans text-base text-ink">...</p> // success state
  }

  return (
    <form action={formAction}>
      {/* Honeypot — hidden from humans, visible to bots */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] opacity-0 pointer-events-none"
      />

      {/* Hidden piece reference */}
      <input type="hidden" name="pieceSlug" value={pieceSlug ?? ''} />
      <input type="hidden" name="pieceTitle" value={pieceTitle ?? ''} />

      {/* ... form fields ... */}

      <button
        type="submit"
        disabled={isPending}
        className="bg-terracotta px-6 py-3 font-medium font-sans text-linen text-sm ..."
      >
        {isPending ? 'Sender...' : 'Send forespørgsel'}
      </button>

      {state.error && (
        <p role="alert" aria-live="polite" className="font-sans text-sm text-fault">
          {state.error}
        </p>
      )}
    </form>
  )
}
```

[CITED: https://nextjs.org/docs/app/guides/forms]

### Pattern 3: RSC Page — Piece Title Lookup

**What:** The purchase inquiry RSC page reads the `?piece` query param, looks up the piece title via Keystatic Reader API, passes it to the client form.
**When to use:** `src/app/contact/purchase/page.tsx`

```typescript
// src/app/contact/purchase/page.tsx
import { createReader } from '@keystatic/core/reader'
import keystaticConfig from '../../../../keystatic.config'
import { PurchaseInquiryForm } from '@/components/PurchaseInquiryForm'

interface Props {
  searchParams: Promise<{ piece?: string }>
}

export default async function PurchaseInquiryPage({ searchParams }: Props) {
  const { piece: slug } = await searchParams

  let pieceTitle: string | undefined

  if (slug) {
    const reader = createReader(process.cwd(), keystaticConfig)
    const entry = await reader.collections.works.read(slug)
    pieceTitle = entry?.title ?? undefined
  }

  return (
    <main className="py-24 pb-16">
      <div className="mx-auto max-w-screen-md px-6 sm:px-12 lg:px-16">
        <h1 className="mb-12 font-normal font-serif text-5xl text-ink tracking-tight">
          {/* da.contact.purchase.heading */}
        </h1>
        <PurchaseInquiryForm pieceSlug={slug} pieceTitle={pieceTitle} />
      </div>
    </main>
  )
}
```

**Critical note on Next.js 15 searchParams:** In Next.js 15, `searchParams` is now a Promise in page components. Always `await searchParams` before accessing its properties. [CITED: Next.js 15 App Router docs]

### Pattern 4: Resend HTML Email Construction

**What:** Inline HTML string passed to `resend.emails.send()` — no template library needed.
**When to use:** Both server actions.

```typescript
// Source: https://resend.com/docs/send-with-nextjs
function buildPurchaseEmail(data: PurchaseInquiryData): string {
  return `
    <div style="font-family: sans-serif; color: #2C2418; max-width: 600px;">
      <h2 style="color: #A85C3A; margin-bottom: 24px;">Ny forespørgsel</h2>
      ${data.pieceTitle ? `
        <p><strong>Stykke:</strong><br>${data.pieceTitle}</p>
        <hr style="border-color: #C4A882; margin: 16px 0;" />
      ` : ''}
      <p><strong>Navn:</strong><br>${data.name}</p>
      <p><strong>Email:</strong><br><a href="mailto:${data.email}">${data.email}</a></p>
      <p><strong>Besked:</strong><br>${data.message}</p>
    </div>
  `
}
```

[CITED: https://resend.com/docs/send-with-nextjs]

### Pattern 5: CTA Updates in ShopCard and WorkDetail

**What:** Both components currently link to `/contact`. They must be updated to pass the piece slug as a query param.
**ShopCard:** receives `slug` prop already — update href from `/contact` to `/contact/purchase?piece=${slug}`.
**WorkDetail:** does not currently receive a `slug` prop — the parent page must pass it, or the component's own props must be extended.

```typescript
// ShopCard — existing slug prop, update href in two places (hover overlay + mobile fallback)
href={`/contact/purchase?piece=${slug}`}

// WorkDetail — parent RSC page passes slug as new prop
// Add slug to WorkDetailProps interface
// Update href from '/custom-orders' to `/contact/purchase?piece=${slug}`
```

**Note on WorkDetail:** Currently the `available` CTA links to `/custom-orders` — this must be corrected to `/contact/purchase?piece=[slug]`. The `sold` CTA correctly links to `/custom-orders`. [VERIFIED: reading WorkDetail.tsx source]

### Anti-Patterns to Avoid

- **Zod schema in server action file:** Importing the schema inside the `'use server'` file works, but prevents reuse in the client component without bundling server code. Keep schemas in `src/lib/schemas/` with no directive.
- **`display:none` for honeypot:** Bots can detect `display:none` and ignore the field. Use CSS off-screen positioning: `absolute -left-[9999px] opacity-0 pointer-events-none`. [CITED: CONTEXT.md D-06 — same technique]
- **Hardcoding recipient email:** Read from `RECIPIENT_EMAIL` env var or `settings.contactEmail` via Reader. Never hardcode an email address in source.
- **Throwing in server actions:** Return `{ success: false, error: string }` instead of throwing — thrown errors in server actions surface as unhandled rejections or error boundaries, not inline form errors.
- **`useFormStatus` in the same component as `useActionState`:** These cannot coexist in the same component in React 19. The `isPending` from `useActionState` is the preferred single source for button disabled state. [CITED: https://nextjs.org/docs/app/guides/forms]
- **Awaiting `searchParams` inside a server component — missing await:** In Next.js 15, `searchParams` is a Promise. `const slug = searchParams.piece` (without await) returns `undefined` silently. Always `const { piece } = await searchParams`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Form validation | Custom validation logic | Zod + zodResolver | Edge cases with email formats, optional fields, custom messages — Zod handles all of these; hand-rolled validation diverges from server validation |
| Email delivery | `nodemailer` + SMTP config | Resend SDK | SMTP setup, SPF/DKIM alignment, bounce handling, TLS — Resend abstracts all of this with a one-call API |
| Pending state tracking | `useState(isSubmitting)` | `useActionState` isPending | React 19 canonical; works with progressive enhancement; no manual state sync needed |
| Honeypot CSS | Inline `style={{ position: 'absolute', left: '-9999px' }}` | Tailwind `absolute -left-[9999px] opacity-0 pointer-events-none` | Consistency with project conventions; same effect |

**Key insight:** The email deliverability problem (SPF/DKIM/DMARC) is solved entirely at the DNS and provider configuration layer, not in code. Time spent hand-rolling an SMTP stack delivers worse deliverability than Resend's AWS SES-backed infrastructure.

---

## Common Pitfalls

### Pitfall 1: `searchParams` is a Promise in Next.js 15

**What goes wrong:** Code like `const slug = searchParams.piece` returns `undefined` because `searchParams` is now a Promise in Next.js 15 page components.
**Why it happens:** Next.js 15 made `searchParams` asynchronous to support streaming; the type is `Promise<Record<string, string | string[] | undefined>>`.
**How to avoid:** Always `const { piece } = await searchParams` at the top of the page component.
**Warning signs:** Form always renders without piece pre-fill even when `?piece=slug` is in the URL.
[CITED: Next.js 15 App Router docs]

### Pitfall 2: Server Action receives `prevState` as first argument when using `useActionState`

**What goes wrong:** Server action defined as `async function submitForm(formData: FormData)` fails when used with `useActionState` — the hook passes `prevState` as the first argument, shifting `formData` to the second.
**Why it happens:** `useActionState` wraps the action to inject the previous state.
**How to avoid:** Define server actions used with `useActionState` as `async function submitForm(prevState: ActionState, formData: FormData)`.
**Warning signs:** TypeScript error on the action signature, or `formData.get()` returning null for all fields.
[CITED: https://nextjs.org/docs/app/guides/forms — "When using `useActionState`, the Server function signature will change to receive a new `prevState` parameter as its first argument"]

### Pitfall 3: Resend `from` address must be on a verified domain

**What goes wrong:** Using `from: 'noreply@gmail.com'` or any unverified domain causes Resend to reject the send with a 422 error.
**Why it happens:** Resend requires the sending domain to be verified with SPF/DKIM before allowing custom `from` addresses. In development, `onboarding@resend.dev` can be used as a test sender.
**How to avoid:** Use `onboarding@resend.dev` for local testing. Switch to `noreply@[owner-domain]` only after DNS records are verified on the Resend dashboard.
**Warning signs:** 422 error from `resend.emails.send()` in local dev or staging.
[CITED: https://resend.com/docs/send-with-nextjs — "Prerequisites: verify your domain at resend.com/domains"]

### Pitfall 4: Zod schema with `'use server'` or `'use client'` directive

**What goes wrong:** If Zod schema files include a `'use server'` directive, importing them in client components causes a build error. If they include `'use client'`, server actions cannot import them without bundling client code.
**Why it happens:** Next.js enforces server/client module boundaries strictly.
**How to avoid:** Schema files in `src/lib/schemas/` must have no directive — they are plain shared modules.
**Warning signs:** Build error "You're importing a component that needs `use server`..." or "cannot import server-only module".

### Pitfall 5: Honeypot field visible to screen readers if misimplemented

**What goes wrong:** Using `visibility: hidden` or `display: none` hides the honeypot from bots (defeating its purpose) but also hides it from screen readers.
**Why it happens:** Screen readers skip `display:none` and `visibility:hidden` elements.
**How to avoid:** Use `aria-hidden="true"` plus absolute CSS positioning off-screen: `absolute -left-[9999px]`. The field exists in the DOM (bots see it), is ignored by screen readers (`aria-hidden`), and is never visible on screen.
**Warning signs:** A11y audit flags a hidden input that assistive technology is trying to read.
[CITED: CONTEXT.md D-06]

### Pitfall 6: Missing `RESEND_API_KEY` in Vercel project settings

**What goes wrong:** Email works in local dev (`.env.local`) but fails in production — Resend SDK throws "Missing API key" at runtime.
**Why it happens:** `.env.local` is gitignored and not deployed; Vercel requires env vars to be set separately in project settings.
**How to avoid:** After adding to `.env.local`, immediately document the required Vercel env var additions as a human-checkpoint task in the plan.
**Warning signs:** 500 errors on form submission in production; "Missing API key" in Vercel function logs.

---

## Code Examples

### Resend SDK basic usage

```typescript
// Source: https://resend.com/docs/send-with-nextjs
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const { data, error } = await resend.emails.send({
  from: 'By Blendstrup <noreply@byblendstrup.dk>',
  to: 'owner@example.com',
  subject: 'Ny forespørgsel: [piece title]',
  html: '<p>Inline HTML body</p>',
})

if (error) {
  // handle error — do not throw; return error state to caller
}
```

### Zod schema — custom order form

```typescript
// src/lib/schemas/custom-order.ts
// No 'use server' or 'use client' directive — shared module
import { z } from 'zod'

export const customOrderSchema = z.object({
  name: z.string().min(1, 'Navn er påkrævet'),
  email: z.string().email('Ugyldig emailadresse'),
  description: z.string().min(10, 'Beskriv venligst hvad du ønsker'),
  quantity: z.string().min(1, 'Antal er påkrævet'),
  budget: z.string().optional(),
  timeline: z.string().optional(),
})

export type CustomOrderFormData = z.infer<typeof customOrderSchema>
```

### Keystatic Reader — piece title lookup

```typescript
// Source: Phase 2 VERIFICATION.md + existing codebase pattern
import { createReader } from '@keystatic/core/reader'
import keystaticConfig from '../../../../keystatic.config'

const reader = createReader(process.cwd(), keystaticConfig)
const entry = await reader.collections.works.read(slug)
// entry?.title is the piece title (single-language after i18n removal)
```

[VERIFIED: reading keystatic.config.ts — works collection uses `title` field (not titleDa/titleEn — i18n was removed in quick task 260420-c1o)]

### Danish message keys needed in `messages/da.json`

The following key paths must be added. The form already has `contact.purchase.*` and `contact.customOrders.*` keys for the stub copy on the contact page:

```json
{
  "contact": {
    "purchase": {
      "form": {
        "regarding": "Angående",
        "name": "Navn",
        "email": "Email",
        "message": "Besked",
        "submit": "Send forespørgsel",
        "submitting": "Sender...",
        "success": "Tak! Din forespørgsel er modtaget.",
        "error": "Der opstod en fejl. Prøv igen."
      }
    },
    "customOrders": {
      "form": {
        "name": "Navn",
        "email": "Email",
        "description": "Hvad ønsker du?",
        "quantity": "Antal",
        "budget": "Budget (valgfrit)",
        "timeline": "Ønsket tidslinje (valgfrit)",
        "submit": "Send specialbestilling",
        "submitting": "Sender...",
        "success": "Tak! Din bestilling er modtaget.",
        "error": "Der opstod en fejl. Prøv igen."
      }
    }
  }
}
```

[ASSUMED — exact Danish copy; owner should review wording before launch]

---

## DNS Records for Email Deliverability

Resend provides the exact record values in its dashboard during domain setup. The planner must document this as a human-checkpoint task: the owner (or developer with DNS access) must add these records after creating a domain in the Resend dashboard.

### Record types Resend generates

| Record | Type | Name | Value |
|--------|------|------|-------|
| SPF | TXT | `send` (subdomain) | `v=spf1 include:amazonses.com ~all` |
| DKIM | TXT or CNAME | `resend._domainkey` | Public key value from Resend dashboard |
| MX (bounce routing) | MX | `send` | `feedback-smtp.us-east-1.amazonses.com` (priority 10) |

[CITED: https://resend.com/docs/dashboard/domains/cloudflare — Cloudflare-specific DNS config guide]
[CITED: https://dmarc.wiki/resend — community SPF/DKIM/DMARC reference for Resend]

### DMARC — owner-added record

Resend handles SPF and DKIM automatically through its dashboard. DMARC is a separate record that the owner/developer adds independently:

| Record | Type | Name | Value |
|--------|------|------|-------|
| DMARC | TXT | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:dmarc@[owner-domain]` |

**DMARC policy guidance:**
- Start with `p=none` (monitor only) to avoid blocking legitimate mail during initial setup
- Upgrade to `p=quarantine` after confirming SPF/DKIM pass in mail headers
- The `rua` address receives aggregate reports — use the owner's email or a dedicated inbox

[CITED: https://dmarcdkim.com/setup/how-to-setup-resend-spf-dkim-and-dmarc-records]
[VERIFIED: https://resend.com/blog/email-authentication-a-developers-guide — "SPF and DKIM are handled for you when using Resend"]

### Verification command (post-setup)

```bash
# Verify SPF record has propagated
dig TXT send.[owner-domain]

# Verify DKIM record
dig TXT resend._domainkey.[owner-domain]

# Verify DMARC
dig TXT _dmarc.[owner-domain]
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `useFormState` (React-DOM) | `useActionState` (React) | React 19 / Next.js 15 | Import from `react`, not `react-dom`; same API |
| `useFormStatus` for pending | `isPending` from `useActionState` | React 19 | Simpler — no separate child component needed for basic pending state |
| Pages Router API route for email | App Router Server Action | Next.js 13+ | No separate `/api/send/route.ts` needed; action co-located with form |
| `searchParams` as sync object | `searchParams` as Promise | Next.js 15 | Must `await searchParams` in page components |

**Deprecated/outdated:**
- `useFormState` from `react-dom`: replaced by `useActionState` from `react` in React 19. Do not use the old import.
- `nodemailer` with SMTP: viable but requires self-managed SMTP credentials, higher deliverability risk. Resend is the locked choice.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `@hookform/resolvers` version and compatibility with RHF 7.72.1 and Zod 4.x | Standard Stack | Package may need specific version pinning; verify with `npm view @hookform/resolvers version` before install |
| A2 | Exact Danish copy for form field labels and success/error messages | Code Examples | Owner may want different wording — treat as draft copy, not final |
| A3 | Owner's domain DNS provider is accessible and DNS propagation takes < 48 hours | DNS Records | Some providers have slow propagation; plan should include a waiting step |
| A4 | Resend free tier supports the expected volume (low-traffic ceramics site) | DNS Records | Free tier limits should be verified at resend.com/pricing before launch |
| A5 | WorkDetail `available` CTA should link to `/contact/purchase?piece=slug` not `/custom-orders` | Architecture Patterns | This interpretation follows D-02; if confirmed, fixes a pre-existing routing error in the component |

---

## Open Questions

1. **Recipient email source: env var vs. Keystatic settings singleton**
   - What we know: `settings.contactEmail` field exists in Keystatic (verified in keystatic.config.ts). A `RECIPIENT_EMAIL` env var is simpler to deploy and avoids a Reader call inside the server action.
   - What's unclear: Owner preference. Reading from Keystatic at action time means the owner can change the email via CMS without a redeploy; env var requires a Vercel settings change.
   - Recommendation: Use `RECIPIENT_EMAIL` env var as primary (simple, secure, no async I/O in action path). Document reading from `settings.contactEmail` as the fallback if the env var is absent. This matches how `RESEND_API_KEY` is handled.

2. **`from` sender domain**
   - What we know: The `from` address must use a Resend-verified domain. The owner's domain is unknown from the codebase.
   - What's unclear: What domain the owner will verify with Resend.
   - Recommendation: Plan includes a placeholder `noreply@[owner-domain]`; the executing developer must substitute the actual verified domain. For local dev, use `onboarding@resend.dev`.

3. **WorkDetail slug availability**
   - What we know: `WorkDetail` component currently has no `slug` prop. The parent gallery detail page (`src/app/gallery/[slug]/page.tsx`) has the slug from the route param.
   - What's unclear: Whether the parent page already passes slug-derived data to WorkDetail, or whether the component interface needs extending.
   - Recommendation: Plan should include adding `slug` to `WorkDetailProps` and passing it from the detail page. This is a trivial change.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Server actions, Resend SDK | ✓ | 20+ (Vercel) | — |
| pnpm | Package installation | ✓ | current | npm |
| resend npm package | Email delivery | ✗ (not installed) | — | Install: `pnpm add resend` |
| react-hook-form | Client form UX | ✗ (not installed) | — | Install: `pnpm add react-hook-form @hookform/resolvers` |
| zod | Schema validation | ✗ (not installed) | — | Install: `pnpm add zod` |
| DNS access to owner domain | SPF/DKIM/DMARC | unknown | — | Human checkpoint — requires owner/developer DNS access |
| Resend account + API key | Email delivery | unknown | — | Human checkpoint — requires Resend dashboard setup |

[VERIFIED: package.json — resend, react-hook-form, zod not present in dependencies]

**Missing dependencies with no fallback:**
- DNS access and Resend account: cannot be automated — human checkpoint required before end-to-end email verification can pass.

**Missing dependencies with fallback (install step):**
- `resend`, `react-hook-form`, `@hookform/resolvers`, `zod` — all installable via `pnpm add`.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.4 |
| Config file | none — vitest uses default config (scans `src/**/*.test.ts`) |
| Quick run command | `pnpm test` |
| Full suite command | `pnpm test` |

[VERIFIED: package.json — vitest 4.1.4 in devDependencies; no dedicated vitest.config.ts found]

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CUST-01 | Custom order Zod schema validates required fields (name, email, description, quantity) | unit | `pnpm test -- --testPathPattern custom-order` | ❌ Wave 0 |
| CUST-02 | Optional budget + timeline fields pass validation when absent | unit | `pnpm test -- --testPathPattern custom-order` | ❌ Wave 0 |
| CUST-03 | Honeypot check: non-empty `website` field returns `{ success: true }` without sending email | unit | `pnpm test -- --testPathPattern honeypot` | ❌ Wave 0 |
| SHOP-04 | Purchase inquiry Zod schema validates required fields | unit | `pnpm test -- --testPathPattern purchase-inquiry` | ❌ Wave 0 |
| CONT-02 / CONT-03 | Email sent via Resend with correct subject format | manual-only | — | manual: test submission in staging |

**Note on CONT-02/CONT-03:** Resend email delivery cannot be unit-tested without mocking the SDK or making live API calls. The plan should include a manual end-to-end verification step: submit both forms and confirm delivery + mail header inspection (SPF=pass, DKIM=pass).

### Sampling Rate

- **Per task commit:** `pnpm test`
- **Per wave merge:** `pnpm test`
- **Phase gate:** Full test suite green + manual email delivery verified before `/gsd-verify-work`

### Wave 0 Gaps

- [ ] `src/__tests__/purchase-inquiry-schema.test.ts` — covers CUST-01 (partial), SHOP-04
- [ ] `src/__tests__/custom-order-schema.test.ts` — covers CUST-01, CUST-02
- [ ] `src/__tests__/honeypot.test.ts` — covers CUST-03 (tests the pure honeypot check function extracted from server action)

**Recommended Wave 0 test pattern:** Mirror the existing `gallery-filter.test.ts` approach — import pure functions extracted from the action files and test them against plain objects. No Resend mocking required if the honeypot check is a standalone pure function.

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | No auth in Phase 5 |
| V3 Session Management | no | Stateless form submission |
| V4 Access Control | no | Forms are public-facing |
| V5 Input Validation | yes | Zod schema on both client and server |
| V6 Cryptography | no | Resend handles transport security |
| V7 Error Handling | yes | Never expose internal errors to the client |
| V8 Data Protection | yes | Honeypot check before processing; no PII stored |

### Known Threat Patterns for this Stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Form spam / bot submission | Spoofing | Honeypot field (D-06) |
| Email header injection | Tampering | Zod validation strips malicious input; Resend SDK sanitizes headers |
| API key exposure | Information Disclosure | `RESEND_API_KEY` in env var only; never in source; not prefixed `NEXT_PUBLIC_` |
| Excessive email volume | Denial of Service | Resend free tier rate limits; deferred rate-per-IP limiting acceptable for low-traffic v1 |
| Internal error messages leaked | Information Disclosure | Server actions return `{ success: false, error: 'generic Danish message' }` — never expose Resend error details to client |

**Security note on env vars:** `RESEND_API_KEY` and `RECIPIENT_EMAIL` must NOT be prefixed with `NEXT_PUBLIC_` — doing so would expose them to client-side JavaScript bundles. Server actions run on the server and can access non-prefixed env vars safely.

[ASSUMED — ASVS category applicability; based on phase scope analysis]

---

## Project Constraints (from CLAUDE.md)

| Directive | Impact on Phase 5 |
|-----------|------------------|
| CMS: Keystatic only — no Sanity/Contentful/Payload | Use `createReader` for piece title lookup in RSC — already the codebase pattern |
| Hosting: Vercel free tier | Server Actions run as serverless functions — compatible; no long-running processes |
| Tech stack: Next.js App Router | Use Server Actions, not API routes for form submission |
| Forms: React Hook Form + Zod + Next Server Actions | Directly matches D-07 and D-08 |
| Spam protection: Cloudflare Turnstile (preferred in CLAUDE.md) vs. Honeypot (chosen in D-06) | CONTEXT.md D-06 overrides CLAUDE.md recommendation — Turnstile explicitly deferred. Honeypot is the chosen approach. |
| Form delivery: Resend | Directly matches D-10 |
| Spam: Turnstile preferred in CLAUDE.md | Overridden by D-06 (honeypot chosen) — no conflict, D-06 is the locked decision |
| Use `next/image` for imagery | Not applicable — Phase 5 has no new imagery |
| Never use `<img>` for content imagery | Not applicable to forms |
| Biome for linting/formatting | All new files must pass `pnpm biome check src/` |
| Danish-only site (i18n removed) | No locale routing, all labels in Danish, no `next-intl` usage needed for form strings |
| Tailwind v4 + CSS `@theme` tokens | All form styles use tokens from `globals.css` — no arbitrary values where a token exists |
| `next/font` with Fraunces + DM Sans | Already configured in layout; form labels use `font-sans` (DM Sans) |

---

## Sources

### Primary (HIGH confidence)

- Next.js official docs: https://nextjs.org/docs/app/guides/forms — `useActionState`, server action form patterns, Zod validation
- Resend official docs: https://resend.com/docs/send-with-nextjs — SDK usage, `resend.emails.send()` parameters
- Resend DNS guide (Cloudflare): https://resend.com/docs/dashboard/domains/cloudflare — SPF, DKIM, MX record structure
- Codebase reading: `keystatic.config.ts`, `ShopCard.tsx`, `WorkDetail.tsx`, `contact/page.tsx`, `da.json`, `package.json`

### Secondary (MEDIUM confidence)

- https://dmarc.wiki/resend — DMARC record format for Resend
- https://dmarcdkim.com/setup/how-to-setup-resend-spf-dkim-and-dmarc-records — SPF/DKIM/DMARC values cross-reference
- https://resend.com/blog/email-authentication-a-developers-guide — SPF/DKIM handled by Resend automatically

### Tertiary (LOW confidence / Assumed)

- Danish copy for form field labels (A2) — treat as draft
- `@hookform/resolvers` version compatibility with RHF 7.72.1 + Zod 4.x (A1) — verify before install

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — versions verified via npm registry
- Architecture: HIGH — patterns verified against official Next.js and Resend docs
- DNS records: MEDIUM — structure verified via official docs; exact values are generated per-account by Resend dashboard
- Pitfalls: HIGH — verified against official docs and codebase reading
- Danish copy: LOW — draft only

**Research date:** 2026-04-20
**Valid until:** 2026-05-20 (30 days — stable ecosystem)
