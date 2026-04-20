---
phase: 05-inquiries-email-delivery
plan: 03
subsystem: custom-orders
tags: [form, server-action, resend, honeypot, zod, rhf]
dependency_graph:
  requires:
    - 05-01  # custom-order schema, honeypot utility
    - 05-02  # SubmitButton component
  provides:
    - /custom-orders route — fully functional custom order form
    - src/actions/custom-order.ts — server action with Resend delivery
    - src/components/CustomOrderForm.tsx — client form component
  affects:
    - messages/da.json — extended with contact.customOrders.form keys
tech_stack:
  added: []
  patterns:
    - useActionState + RHF + zodResolver (same pattern as Plan 02)
    - server action with honeypot check before validation before Resend
    - da.json key-reference for localized strings (no literal Danish in components)
key_files:
  created:
    - src/actions/custom-order.ts
    - src/app/custom-orders/page.tsx
    - src/components/CustomOrderForm.tsx
  modified:
    - messages/da.json
decisions:
  - Optional fields (budget, timeline) use da.json key references for "(valgfri)" label — not hardcoded strings
  - Honeypot hidden with -left-[9999px] absolute positioning, matching Plan 02 pattern
  - /custom-orders rendered as static page (no Keystatic lookup needed for custom orders)
metrics:
  duration: ~12 minutes
  completed: 2026-04-20
  tasks_completed: 2
  tasks_total: 2
  files_changed: 4
---

# Phase 05 Plan 03: Custom Order Form Summary

Custom order form at `/custom-orders` — six-field form with Resend delivery, honeypot spam protection, and Zod validation via useActionState + React Hook Form.

## What Was Built

### Task 1: Extend da.json with custom order form keys (commit 4685d9d)

Added `contact.customOrders.form` sub-object with 19 keys to `messages/da.json`. All existing keys (`contact.customOrders.{heading,body,cta}` and `contact.purchase.form.*` from Plan 02) preserved unchanged.

### Task 2: Custom order server action + RSC page + client form (commit 4352f7a)

**`src/actions/custom-order.ts`** — Server action with `'use server'` directive:
- `_prevState: ActionState` as first argument (useActionState requirement)
- Honeypot check fires before Zod validation and before Resend call
- Non-empty `website` field returns `{ success: true }` without calling Resend (CUST-03)
- Zod validates all six fields; budget and timeline are optional in schema (CUST-02)
- Resend subject: `Ny specialbestilling fra ${result.data.name}` (D-09)
- `RESEND_API_KEY` is NOT prefixed `NEXT_PUBLIC_` (T-5-03-04)
- Resend errors return generic Danish message; SDK details never reach client (T-5-03-03)

**`src/app/custom-orders/page.tsx`** — RSC shell importing `CustomOrderForm`. Statically prerendered (no dynamic data needed). Heading and sub-copy from da.json.

**`src/components/CustomOrderForm.tsx`** — Client component with:
- `useActionState(submitCustomOrder, initialState)` hook
- RHF + zodResolver for client-side validation UX
- Field order per UI-SPEC: Name → Email → What → Quantity → Budget (optional) → Timeline (optional) → Submit
- Honeypot input: `name="website"`, `tabIndex={-1}`, `aria-hidden="true"`, class `-left-[9999px] pointer-events-none absolute opacity-0`
- Optional field labels render `da.contact.customOrders.form.budgetOptional` / `timelineOptional` in `text-stone` span (CUST-02)
- Success state replaces form with successHeading + successBody
- Error banner with `role="alert"` and `aria-live="polite"`

## Verification Results

```
pnpm test    — 38/38 tests pass (6 test files)
pnpm build   — exits 0; /custom-orders renders as ○ Static
grep NEXT_PUBLIC_RESEND src/ — empty (PASS)
grep 'Ny specialbestilling fra' — PASS (D-09)
grep '-left-[9999px]' — PASS (honeypot off-screen)
contact.customOrders.heading preserved — "Specialbestilling"
contact.purchase.form.heading preserved — "Forespørgsel"
```

## Deviations from Plan

None — plan executed exactly as written.

The acceptance criteria used grep patterns that assumed single-line function signatures (`async function submitCustomOrder(_prevState`) and literal "valgfri" text in the component file. Both are false negatives: the function signature is formatted across two lines (Biome's output), and the "(valgfri)" string is correctly referenced via da.json key — the string resolves at runtime. Code is semantically correct.

## Known Stubs

None. All six fields are wired to the server action. Resend delivery is complete (pending `RESEND_API_KEY` and `RECIPIENT_EMAIL` env vars in production — documented as deployment concern in 05-01).

## Threat Surface Scan

No new network endpoints or trust boundaries beyond what the plan's threat model covers. The `/custom-orders` page is statically prerendered; `submitCustomOrder` is the only server-side surface and is fully covered by T-5-03-01 through T-5-03-05.

## Self-Check: PASSED

Files created:
- src/actions/custom-order.ts — FOUND
- src/app/custom-orders/page.tsx — FOUND
- src/components/CustomOrderForm.tsx — FOUND

Commits verified:
- 4685d9d — feat(05-03): extend da.json with custom order form keys — FOUND
- 4352f7a — feat(05-03): custom order server action + RSC page + client form — FOUND
