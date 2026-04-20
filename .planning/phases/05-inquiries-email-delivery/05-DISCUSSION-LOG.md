# Phase 5: Inquiries & Email Delivery - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-20
**Phase:** 05-inquiries-email-delivery
**Areas discussed:** Purchase inquiry flow, Spam protection, Form submission mechanism, Email format & delivery

---

## Purchase Inquiry Flow

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — query param | CTA links to /contact/purchase?piece=slug, form pre-fills "Regarding: [piece title]" | ✓ |
| Yes — piece in URL path | Per-piece page at /gallery/[slug]/buy | |
| No — generic form only | Free-text field for visitor to type piece name | |

**User's choice:** Query param (`?piece=slug`) — form pre-populates from slug.

| Option | Description | Selected |
|--------|-------------|----------|
| /contact/purchase | Already stubbed, shared across all pieces | ✓ |
| Inline on gallery detail page | Form below piece details on /gallery/[slug] | |

**User's choice:** `/contact/purchase` — consistent with contact page stub.

---

## Spam Protection

| Option | Description | Selected |
|--------|-------------|----------|
| Honeypot field | Hidden field bots fill in, zero deps | ✓ |
| Cloudflare Turnstile | Smart invisible challenge, requires Cloudflare account | |
| Both — honeypot + rate limiting | More robust, still no Cloudflare needed | |

**User's choice:** Honeypot field — zero deps, sufficient for low-traffic ceramics site.

---

## Form Submission Mechanism

| Option | Description | Selected |
|--------|-------------|----------|
| Server Actions | Next.js 15 native, progressive enhancement | ✓ |
| API Route (/api/inquiries) | Traditional REST endpoint | |

**User's choice:** Server Actions.

| Option | Description | Selected |
|--------|-------------|----------|
| React Hook Form + Zod | Best-in-class validation UX, inline errors | ✓ |
| Plain HTML + server-only validation | Zero JS, full-page re-render on error | |
| Native browser validation only | HTML5 required/pattern, no custom messages | |

**User's choice:** React Hook Form + Zod.

---

## Email Format & Delivery

| Option | Description | Selected |
|--------|-------------|----------|
| Simple HTML email | Clean structure, bold labels, inline HTML string | ✓ |
| Plain text only | Simplest, no rendering issues | |

**User's choice:** Simple HTML email.

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — SPF/DKIM/DMARC in Phase 5 | CONT-02/CONT-03 require it; document DNS records | ✓ |
| Defer to Phase 6 | Wire Resend now, DNS later | |

**User's choice:** In scope for Phase 5 — deliverability must be verified end-to-end before phase is complete.

---

## Claude's Discretion

- Error and success UI states (toast, inline banner, redirect)
- Loading/pending state during submission
- Field order and grouping within each form
- Whether to use `useActionState` (React 19) or RHF-managed state
- Resend env var naming convention
- Whether recipient email reads from env var or Keystatic `settings.contactEmail`

## Deferred Ideas

- Auto-reply email to customer (v2 scope — SHOP-05, CUST-04)
- Cloudflare Turnstile (upgrade path available if honeypot proves insufficient)
- Rate limiting per IP
