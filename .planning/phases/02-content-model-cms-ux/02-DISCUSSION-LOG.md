# Phase 2: Content Model & CMS UX - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-18
**Phase:** 02-content-model-cms-ux
**Areas discussed:** Images per piece, Category taxonomy, For-sale status model

---

## Images per piece

| Option | Description | Selected |
|--------|-------------|----------|
| Multiple images (1–8) | Owner uploads several angles — front, side, detail shot, in-use | ✓ |
| Single image | One hero image per piece. Simpler CMS form | |

**User's choice:** Multiple images (1–8)

---

| Option | Description | Selected |
|--------|-------------|----------|
| First image is always the thumbnail | Simple rule: owner puts best shot first | ✓ |
| Explicit 'primary image' field | Owner uploads all images, then picks one as cover | |

**User's choice:** First image is always the thumbnail

---

| Option | Description | Selected |
|--------|-------------|----------|
| Required alt text per image | Owner writes a short description for each photo. Required for a11y and SEO | ✓ |
| Optional alt text | Owner can leave it blank. Simpler but accessibility gaps | |
| Claude's discretion | Let the planner decide | |

**User's choice:** Required alt text per image

---

## Category taxonomy

| Option | Description | Selected |
|--------|-------------|----------|
| Fixed dropdown list | Predefined options (Bowl, Vase, Mug, Plate, Other) | |
| Free-form text field | Owner types category name freely | |
| Managed category collection | Separate Keystatic collection the owner maintains | ✓ |

**User's choice:** Managed category collection

---

| Option | Description | Selected |
|--------|-------------|----------|
| One category per piece | Owner picks exactly one | |
| Multiple categories allowed | A piece can belong to multiple categories | ✓ |

**User's choice:** Multiple categories allowed

---

| Option | Description | Selected |
|--------|-------------|----------|
| Bilingual category names (DA + EN) | Each category has nameDa and nameEn | ✓ |
| Single language (English only) | Categories in English across both locales | |

**User's choice:** Bilingual category names (DA + EN)

---

## For-sale status model

| Option | Description | Selected |
|--------|-------------|----------|
| Three-state: Available / Sold / Not listed | Available = in shop with price. Sold = was for sale, now gone. Not listed = portfolio piece | ✓ |
| Two fields: for-sale toggle + sold toggle | Separate checkboxes. More flexible but potentially confusing | |

**User's choice:** Three-state: Available / Sold / Not listed

---

| Option | Description | Selected |
|--------|-------------|----------|
| Price number + currency label | Numeric price + static 'kr.' label | |
| Free-form price text | Owner types any string: '1.200 kr.', 'From 800 kr.', 'Price on request' | ✓ |
| Claude's discretion | Let the planner decide | |

**User's choice:** Free-form price text

---

## Claude's Discretion

- Homepage curation UX (CMS-03): Planner decides whether to use relationship fields in the homepage singleton or featured flags on each work
- About singleton: Planner decides whether to include in Phase 2 or defer to Phase 4
- Draft/publish implementation detail: Requirements define the behavior; planner decides the field structure

## Deferred Ideas

None — discussion stayed within phase scope.
