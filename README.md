# Al-Quran Liputan6 Revamp

Prototype and frontend handoff reference for the Liputan6 Al-Quran revamp.

## Working flow
1. Work in a feature branch.
2. Cloudflare builds the branch for preview QA.
3. Complete UI/UX, responsive and accessibility QA.
4. Review the pull request.
5. Merge to `main` only after approval.
6. Deploy `main` to production.

## Current QA branch
`feat/quran-v7-design-system`

## Frontend handoff reference
Use `src/quran/` and `QURAN-HANDOFF.md` as the implementation reference. The legacy `v4/v5/v6` files remain temporarily for prototype/regression comparison and should not become the production architecture.

## Cloudflare
`wrangler.jsonc` currently configures repository-root static assets so branch preview builds can render the existing prototype without changing application logic. This is a preview-stage configuration.

Before production handoff, publish only an explicit runtime output directory such as `dist/` rather than exposing the repository root as the asset directory.

## QA entry point
For the current prototype use `/prototype-v6` (or `/prototype-v6.html` depending on Worker routing).
