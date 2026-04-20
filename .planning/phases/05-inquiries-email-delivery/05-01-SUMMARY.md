---
phase: 05-inquiries-email-delivery
plan: 01
subsystem: validation
tags: [zod, react-hook-form, resend, honeypot, unit-tests, wave-0]
dependency_graph:
  requires: []
  provides:
    - src/lib/schemas/purchase-inquiry.ts
    - src/lib/schemas/custom-order.ts
    - src/lib/honeypot.ts
  affects:
    - src/actions/purchase-inquiry.ts (Plan 02 — will import purchaseInquirySchema)
    - src/actions/custom-order.ts (Plan 03 — will import customOrderSchema)
    - src/components/PurchaseInquiryForm.tsx (Plan 02 — will use zodResolver)
    - src/components/CustomOrderForm.tsx (Plan 03 — will use zodResolver)
tech_stack:
  added:
    - resend@6.12.2
    - react-hook-form@7.72.1
    - zod@4.3.6
    - "@hookform/resolvers@^5.2.2"
  patterns:
    - Shared Zod schema (no directive) — importable by both server action and client component
    - Pure function extraction for unit-testability (checkHoneypot)
    - Vitest unit tests mirroring gallery-filter.test.ts pattern
key_files:
  created:
    - src/lib/schemas/purchase-inquiry.ts
    - src/lib/schemas/custom-order.ts
    - src/lib/honeypot.ts
    - src/__tests__/purchase-inquiry-schema.test.ts
    - src/__tests__/custom-order-schema.test.ts
    - src/__tests__/honeypot.test.ts
  modified:
    - package.json
    - pnpm-lock.yaml
decisions:
  - "Schemas placed in src/lib/schemas/ with no directive to allow import from both server actions and client components — prevents build errors and ensures identical validation logic runs on both sides"
  - "checkHoneypot extracted as a pure function (not inline in server action) to enable unit testing without mocking Resend SDK or Next.js"
  - "Used Danish validation error messages inline in Zod schema (not via next-intl) since i18n was removed in Phase 4"
metrics:
  duration: "~8 minutes"
  completed: "2026-04-20T18:38:28Z"
  tasks_completed: 2
  tasks_total: 2
  files_created: 6
  files_modified: 2
---

# Phase 05 Plan 01: Validation Foundation — Zod Schemas + Honeypot Utility

**One-liner:** Shared Zod schemas for purchase inquiry and custom order forms, plus a pure honeypot check function, with full Wave 0 unit test coverage using Vitest.

## What Was Built

Three shared library modules and three Vitest test files forming the validation foundation for Phase 5's inquiry forms:

1. `src/lib/schemas/purchase-inquiry.ts` — Zod schema validating name, email, message (required) and pieceSlug, pieceTitle (optional). No server/client directive so it can be imported by both the server action (`safeParse`) and the client form component (`zodResolver`).

2. `src/lib/schemas/custom-order.ts` — Zod schema validating name, email, description (min 10 chars), quantity (required) and budget, timeline (optional per CUST-02). Same no-directive pattern.

3. `src/lib/honeypot.ts` — Pure `checkHoneypot(value)` function that returns `true` when the honeypot field is filled (indicating a bot), `false` for empty/null/undefined/whitespace-only values. Extracted as a pure function so it can be unit-tested without mocking the server action or Resend.

4. Three test files covering all Wave 0 requirements (CUST-01, CUST-02, CUST-03, SHOP-04): 17 new test cases, all passing green.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Install dependencies + create Zod schemas + honeypot utility | 7765987 | package.json, pnpm-lock.yaml, src/lib/schemas/purchase-inquiry.ts, src/lib/schemas/custom-order.ts, src/lib/honeypot.ts |
| 2 | Write Wave 0 test stubs for schemas and honeypot | ed065a9 | src/__tests__/purchase-inquiry-schema.test.ts, src/__tests__/custom-order-schema.test.ts, src/__tests__/honeypot.test.ts |

## Test Results

```
Test Files  6 passed (6)
     Tests  38 passed (38)
  Duration  571ms
```

All 38 tests pass including 17 new tests across 3 new files. No regressions in existing gallery-filter.test.ts, keystatic-schema.test.ts, or shop-filter.test.ts.

## Acceptance Criteria Verification

- [x] `package.json` contains `"resend": "6.12.2"` in dependencies
- [x] `package.json` contains `"react-hook-form": "7.72.1"` in dependencies
- [x] `package.json` contains `"zod": "4.3.6"` in dependencies
- [x] `package.json` contains `"@hookform/resolvers"` in dependencies
- [x] `src/lib/schemas/purchase-inquiry.ts` has no `'use server'` or `'use client'` directive
- [x] `src/lib/schemas/custom-order.ts` has no `'use server'` or `'use client'` directive
- [x] `src/lib/honeypot.ts` has no `'use server'` or `'use client'` directive
- [x] `purchaseInquirySchema` exported from purchase-inquiry.ts
- [x] `customOrderSchema` exported from custom-order.ts
- [x] `checkHoneypot` exported from honeypot.ts
- [x] `budget: z.string().optional()` present in custom-order.ts
- [x] `timeline: z.string().optional()` present in custom-order.ts
- [x] `pnpm test` exits 0 with all tests green

## Deviations from Plan

None — plan executed exactly as written. The TDD approach was collapsed into a single execution cycle since implementation and tests were created together (both passing green immediately), as permitted when the RED phase is known in advance from the plan spec.

## Known Stubs

None — all exported functions and schemas are fully implemented with correct business logic.

## Threat Surface

No new network endpoints, auth paths, or schema changes at trust boundaries introduced in this plan. The threat model mitigations from the plan's STRIDE register are all implemented:

- **T-5-01-01 (Spoofing):** `checkHoneypot` is a pure function covered by 6 unit tests
- **T-5-01-02 (Information Disclosure):** No directive in schema files — verified by grep (no output)
- **T-5-01-03 (Tampering):** Single schema source used for both client resolver and server-side safeParse — no duplication that could diverge

## Self-Check: PASSED

- [x] `src/lib/schemas/purchase-inquiry.ts` exists
- [x] `src/lib/schemas/custom-order.ts` exists
- [x] `src/lib/honeypot.ts` exists
- [x] `src/__tests__/purchase-inquiry-schema.test.ts` exists
- [x] `src/__tests__/custom-order-schema.test.ts` exists
- [x] `src/__tests__/honeypot.test.ts` exists
- [x] Commit 7765987 exists (Task 1)
- [x] Commit ed065a9 exists (Task 2)
- [x] `pnpm test` exits 0 — 38 tests passing
