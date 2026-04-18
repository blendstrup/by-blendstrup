---
status: partial
phase: 01-foundation
source: [01-VERIFICATION.md]
started: 2026-04-18T20:09:37Z
updated: 2026-04-18T20:09:37Z
---

## Current Test

[awaiting human testing — Keystatic Cloud + Vercel deploy loop]

## Tests

### 1. Keystatic → GitHub → Vercel deploy loop
expected: Owner edits siteTitle in Keystatic admin on the deployed Vercel URL, a GitHub commit appears within 30 seconds, and Vercel redeploys within ~2 minutes

Steps:
1. Create a Keystatic Cloud project at https://keystatic.com — sign in, create project, connect the GitHub repository
2. Copy `KEYSTATIC_GITHUB_CLIENT_ID` and `KEYSTATIC_GITHUB_CLIENT_SECRET` from the Keystatic Cloud dashboard
3. Generate `KEYSTATIC_SECRET`: `openssl rand -hex 16`
4. Add all three plus `KEYSTATIC_STORAGE_KIND=github`, `GITHUB_REPO_OWNER=blendstrup`, `GITHUB_REPO_NAME=by-blendstrup-frontend` to Vercel project environment variables
5. Trigger a Vercel redeploy
6. Open `https://<your-vercel-url>/keystatic` — Keystatic Cloud OAuth should appear
7. Edit `siteTitle` to "Deploy Test" and save
8. Verify a GitHub commit appears in the repo within 30 seconds
9. Verify Vercel auto-deploys from that commit within ~2 minutes
10. Revert `siteTitle` back to "By Blendstrup" and save

result: [pending]

## Summary

total: 1
passed: 0
issues: 0
pending: 1
skipped: 0
blocked: 0

## Gaps
