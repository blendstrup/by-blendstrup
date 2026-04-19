---
phase: 02-content-model-cms-ux
verified: 2026-04-19T09:45:00Z
status: human_needed
score: 4/5 must-haves verified
overrides_applied: 0
deferred:
  - truth: "Owner can flip any piece between draft and published, and drafts do not appear on the public site"
    addressed_in: "Phase 3"
    evidence: "Phase 3 success criteria: 'Visitor can browse every published piece in a uniform grid layout' — the Reader API filtering (w.entry.published) is implemented in Phase 3 RSCs, not Phase 2"
human_verification:
  - test: "Admin UI smoke test — sidebar navigation"
    expected: "Sidebar shows three groups: Pieces (containing Ceramic Pieces), Taxonomy (containing Categories), Pages (containing Homepage and Site Settings)"
    why_human: "Admin UI visual rendering cannot be verified by grep or file inspection; requires a browser session at http://localhost:3000/keystatic"
  - test: "Admin UI smoke test — works form field visibility and labels"
    expected: "Creating a new ceramic piece shows all fields in order (slug, Published checkbox, Title DA, Title EN, Description DA, Description EN, Sale status dropdown, Price, Lead time, Categories multi-picker, Images array) each with a plain-language description below the label"
    why_human: "Keystatic field registration in config does not guarantee the Admin UI renders every field correctly — broken relationship pickers or missing validation UI require browser verification"
  - test: "Admin UI smoke test — homepage singleton relationship pickers"
    expected: "Opening Pages > Homepage shows Hero pieces and Shop preview pieces as relationship pickers that can select from available works"
    why_human: "multiRelationship field rendering in the Admin UI depends on runtime collection wiring that cannot be verified statically"
  - test: "Admin UI smoke test — categories relationship picker in works form"
    expected: "The Categories field in the works creation form shows a multi-select/combobox populated with existing categories (e.g. Bowls/Skåle)"
    why_human: "Cross-collection relationship resolution in the Admin UI requires a live dev server to confirm"
---

# Phase 2: Content Model & CMS UX Verification Report

**Phase Goal:** Define the full Keystatic schema for works, for-sale metadata, and the homepage singleton, with bilingual fields and clear, non-technical labels so the owner can manage all content unaided.
**Verified:** 2026-04-19T09:45:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Owner can create a ceramic piece with images, DA+EN title, DA+EN description, category, for-sale status, price, and lead time | VERIFIED | `keystatic.config.ts` lines 63–159: works collection with titleDa, titleEn, descriptionDa, descriptionEn, saleStatus (select), price, leadTime, categories (multiRelationship), images (array of {image, alt}) — all present and substantive |
| 2 | Owner can set draft/published status on any piece | VERIFIED (partial — field only) | `published: fields.checkbox({ defaultValue: false })` exists in schema (line 77). Draft enforcement on the public site (filtering in RSCs) is deferred to Phase 3 — see Deferred Items |
| 3 | Owner can curate the homepage by picking hero pieces and shop preview pieces | VERIFIED | `homepage` singleton with `heroWorks` and `shopPreviewWorks` as `fields.multiRelationship({ collection: 'works' })` (lines 170–184). Smoke test content `content/homepage.yaml` confirms `heroWorks: [bowl-test]` was saved correctly |
| 4 | Every CMS field shows a plain-language label and helper text written for a non-technical owner | HUMAN NEEDED | Every field in config has both `label` and `description` strings (verified by read). Visual rendering in the Admin UI requires browser confirmation — cannot verify Keystatic actually displays description text without a live session |
| 5 | All public-facing sale status strings resolve correctly in both Danish and English | VERIFIED | `messages/en.json` contains `shop.saleStatus.{available, sold, notListed}` and `shop.filter*` keys. `messages/da.json` contains Danish equivalents ("Til salg", "Solgt", "Portfoliestykke"). Tests 11/11 green confirming key presence |

**Score:** 4/5 truths verified (1 human-needed, 1 partially deferred — see Deferred Items)

### Deferred Items

Items not yet met but explicitly addressed in later milestone phases.

| # | Item | Addressed In | Evidence |
|---|------|-------------|----------|
| 1 | Draft pieces not appearing on the public site (enforcement logic) | Phase 3 | Phase 3 success criteria: "Visitor can browse every published piece in a uniform grid layout" — the Reader API filtering `allWorks.filter(w => w.entry.published)` is a Phase 3 RSC concern |

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `keystatic.config.ts` | works + categories collections, homepage singleton, ui.navigation | VERIFIED | 223 lines; imports `collection`; defines `categories`, `works`, `homepage` as named consts; config() call wires all collections and singletons with navigation groups |
| `messages/en.json` | English public UI strings for saleStatus and gallery filter | VERIFIED | Contains `shop.saleStatus.{available, sold, notListed}`, `shop.filterAll`, `shop.filterAvailable`, `shop.contactToBuy` |
| `messages/da.json` | Danish public UI strings for saleStatus and gallery filter | VERIFIED | Contains identical key structure with Danish translations |
| `src/__tests__/keystatic-schema.test.ts` | Schema regression tests — asserts collections.works, categories, singletons.homepage, ui.navigation | VERIFIED | 43 lines; imports keystaticConfig; 5 tests covering all required properties; 5/5 passing |
| `src/__tests__/i18n-fields.test.ts` | i18n regression tests — asserts shop.saleStatus keys in both locales | VERIFIED | 39 lines; imports both message files; 6 tests for DA+EN saleStatus keys; 6/6 passing |
| `content/works/bowl-test/index.yaml` | At least one test work entry from smoke test | VERIFIED | Exists with full field set: slug, published: false, titleDa, titleEn, saleStatus: sold, categories: [bowls], images with alt |
| `content/categories/bowls.yaml` | At least one test category from smoke test | VERIFIED | Exists with name, nameDa: "Skåle", nameEn: "Bowls" |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `keystatic.config.ts collections.works` | `content/works/*/` | `path: 'content/works/*/'` | VERIFIED | Path configured at line 66; `content/works/bowl-test/index.yaml` exists as proof the link resolves |
| `keystatic.config.ts singletons.homepage` | `keystatic.config.ts collections.works` | `fields.multiRelationship({ collection: 'works' })` | VERIFIED | heroWorks and shopPreviewWorks both reference `collection: 'works'`; `content/homepage.yaml` shows `heroWorks: [bowl-test]` saved and resolved |
| `keystatic.config.ts collections.works` | `keystatic.config.ts collections.categories` | `fields.multiRelationship({ collection: 'categories' })` | VERIFIED | `categories: fields.multiRelationship({ collection: 'categories' })` at line 127; `content/works/bowl-test/index.yaml` shows `categories: [bowls]` referencing the bowls entry |

### Data-Flow Trace (Level 4)

Not applicable. Phase 2 delivers schema and CMS admin layer only — no public-facing components render dynamic data. Phase 3 will introduce the Reader API calls that read this schema.

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| vitest schema + i18n tests pass | `pnpm test` | 11 passed (11) in 131ms | PASS |
| TypeScript compiles cleanly | `pnpm tsc --noEmit` | exit 0, no output | PASS |
| Next.js build succeeds | `pnpm build` | All routes built successfully | PASS |
| Biome lint is clean | `pnpm biome check src/` | Checked 18 files, No fixes applied | PASS |
| works collection path resolves to content | `ls content/works/` | bowl-test/ directory exists | PASS |
| categories path resolves to content | `ls content/categories/` | bowls.yaml exists | PASS |
| homepage singleton saved correctly | `cat content/homepage.yaml` | heroWorks: [bowl-test] | PASS |
| multiRelationship count | `grep -c "fields.multiRelationship" keystatic.config.ts` | 3 (categories on works, heroWorks, shopPreviewWorks) | PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| CMS-01 | 02-01-PLAN.md | Owner can add a new ceramic piece with images, title (DA+EN), description (DA+EN), category, for-sale status, price, lead time note | SATISFIED | works collection has all required fields: images (array), titleDa/titleEn, descriptionDa/descriptionEn, categories (multiRelationship), saleStatus (select), price, leadTime |
| CMS-02 | 02-01-PLAN.md | Owner can set draft/published status — drafts not visible on public site | PARTIAL | published checkbox field exists (schema layer complete); draft enforcement in RSCs is Phase 3 work — see Deferred Items |
| CMS-03 | 02-01-PLAN.md | Owner can curate homepage — select pieces for hero and shop preview | SATISFIED | homepage singleton with heroWorks (max 3) and shopPreviewWorks (max 6) multiRelationship fields; smoke test confirmed save |
| CMS-04 | 02-01-PLAN.md | All CMS fields have clear labels and helper text for non-technical owner | NEEDS HUMAN | Every field has label + description in config — Admin UI rendering requires browser smoke test confirmation |
| I18N-02 | 02-01-PLAN.md | All page content available in both Danish and English | SATISFIED (partial scope) | Bilingual sibling fields (titleDa/titleEn, descriptionDa/descriptionEn, nameDa/nameEn) present throughout; shop.saleStatus keys in both message files. Full public-facing bilingual content rendering deferred to Phases 3–4 |

**Orphaned requirements check:** No Phase 2 requirements in REQUIREMENTS.md are missing from plan frontmatter. All 5 (CMS-01, CMS-02, CMS-03, CMS-04, I18N-02) are covered.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `content/works/bowl-test/index.yaml` | — | Test content entry committed to repo | Info | Smoke-test artifact; owner should delete before public launch per threat model T-02-05 — no functional impact |
| `content/categories/bowls.yaml` | — | Test category entry committed to repo | Info | Same as above |

No stub patterns, TODO comments, empty implementations, or hardcoded empty data found in any source file.

### Human Verification Required

#### 1. Admin UI Sidebar Navigation

**Test:** Start `pnpm dev`, open http://localhost:3000/keystatic
**Expected:** Sidebar shows three groups: "Pieces" (containing "Ceramic Pieces"), "Taxonomy" (containing "Categories"), "Pages" (containing "Homepage" and "Site Settings")
**Why human:** Admin UI visual rendering is controlled by Keystatic's runtime — the `ui.navigation` config is present but the Admin UI's actual sidebar grouping requires a browser to confirm

#### 2. Works Form — All Fields Visible with Plain-Language Labels

**Test:** Go to Pieces > Ceramic Pieces > New entry
**Expected:** All 11 fields appear in order with description text below each label. Sale status dropdown shows "Available for purchase", "Sold", "Not for sale" with "Not for sale" as default. Published is an unchecked checkbox by default.
**Why human:** Field rendering, description display, and dropdown option rendering in the Keystatic Admin UI requires a live browser session — static grep cannot confirm the CMS actually shows these to the owner

#### 3. Homepage Singleton Relationship Pickers

**Test:** Go to Pages > Homepage
**Expected:** "Hero pieces" and "Shop preview pieces" both show relationship pickers populated with available works (at minimum the bowl-test piece)
**Why human:** multiRelationship cross-collection wiring in the Admin UI depends on runtime resolution that must be confirmed in a browser

#### 4. Categories Relationship Picker in Works Form

**Test:** In Pieces > Ceramic Pieces > New entry, find the Categories field
**Expected:** Shows a multi-select/combobox that lists available categories (Bowls/Skåle)
**Why human:** Cross-collection relationship pickers require a live Admin UI session to confirm they populate correctly

**Note:** The 02-02-PLAN.md checkpoint was completed and approved (human checkpoint task marked done in SUMMARY), which provides strong evidence these checks pass. The human_needed status reflects that the verifier cannot independently confirm the live Admin UI behavior — the smoke test approval is the source of truth.

### Gaps Summary

No blocking gaps found. All schema artifacts exist, are substantive, and are wired correctly. Tests pass. Build succeeds. Lint is clean.

The `human_needed` status is driven by four Admin UI behavioral checks that require browser confirmation. Per 02-02-SUMMARY.md, these were confirmed by a human checkpoint that was approved — but the verifier cannot independently re-confirm live UI behavior without running a browser session.

CMS-02's draft-enforcement on the public site is deferred to Phase 3 where Reader API filtering logic will be implemented — this is explicitly covered by Phase 3's first success criterion.

---

_Verified: 2026-04-19T09:45:00Z_
_Verifier: Claude (gsd-verifier)_
