# Phase 1: Foundation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-18
**Phase:** 01-foundation
**Areas discussed:** Locale detection, Design tokens, Keystatic deploy loop

---

## Gray Areas Presented

| Option | Description | Selected |
|--------|-------------|----------|
| Default locale | DA or EN at root URL? | ✓ |
| Typography selection | Which serif + sans font pair? | — |
| Japandi shell depth | How much layout shell in Phase 1? | — |
| Design token scope | How many tokens to define now? | — |

**User's response (free text):** "The default locale should follow the users device settings. Typography and colors are already defined in the 01-UI-SPEC.md file in the first phase."

---

## Default Locale / Locale Detection

| Option | Description | Selected |
|--------|-------------|----------|
| Device settings (Accept-Language) | next-intl middleware auto-detects from browser | ✓ |
| Hardcoded DA default | Danish-first, simpler config | |
| Hardcoded EN default | English-first, broader reach | |

**User's choice:** Device settings — root `/` redirects to detected locale, no hardcoded default.

---

## Design Tokens (Typography + Colors + Spacing)

**User's choice:** Already defined in `01-UI-SPEC.md` — use that file as the authoritative source. No discussion needed.

---

## Keystatic Deploy Loop Scope

| Option | Description | Selected |
|--------|-------------|----------|
| Full deploy loop in Phase 1 | Local dev + Keystatic Cloud + GitHub storage + Vercel auto-deploy | ✓ |
| Local dev only in Phase 1 | GitHub/Vercel wiring deferred | |

**User's choice:** Full deploy loop in Phase 1 — matches the roadmap success criteria.

---

## Claude's Discretion

- next-intl middleware config details (pathnames vs bare locales)
- Keystatic Cloud account setup steps and environment variable names
- Test content entry field structure
- Git branch strategy for Keystatic GitHub storage
- TypeScript strict config, Biome, Biome setup

## Deferred Ideas

None.
