# Deferred Items — 260428-uah

Items discovered during execution that are out of scope for this quick task.

## Pre-existing Lint Errors (Not Caused by This Task)

### `src/app/admin-login/actions.ts:2`

Biome flags `import { createHmac } from "crypto"` — should use `node:crypto` protocol.

- **Status:** Pre-existing — introduced in prior commit `2331bd0` (260422-wd4)
- **Why deferred:** Out of scope. This task only adds an FAQ section to the homepage and does not touch `admin-login/`.
- **Suggested fix:** Change to `import { createHmac } from "node:crypto"` in a separate quick task.
