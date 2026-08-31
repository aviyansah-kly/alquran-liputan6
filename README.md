# Al-Qur'an Liputan6 Revamp

Prototype and frontend handoff reference for the Liputan6 Al-Qur'an experience.

## Current product scope
- Quran Home: search, continue reading, surah discovery
- Surah Reader: Arabic text, translation, audio, qari selection, ayat navigation
- Ayat Detail: arti, tafsir, editorial sections, FAQ and share/audio actions
- Responsive desktop/tablet/mobile behavior
- Liputan6 global shell + Islami channel navigation

## Active handoff branch
`feat/quran-v7-design-system`

This branch is for UI/UX consolidation and frontend handoff readiness. Production `main` should only be updated after preview QA and PR approval.

## Frontend structure
Use `src/quran/` as the implementation-oriented reference:

```text
src/quran/
├── README.md
├── styles/
│   ├── index.css
│   ├── tokens.css
│   ├── base.css
│   ├── components.css
│   └── pages.css
└── js/
    └── routes.js
```

The existing versioned prototype files remain temporarily for regression comparison. They are not the recommended production architecture.

## Handoff documentation
See `QURAN-HANDOFF.md` for:
- information hierarchy
- design tokens
- component states
- accessibility requirements
- responsive acceptance criteria
- source attribution rules
- definition of done

## Deployment flow
Recommended project workflow:

`feature branch -> Cloudflare preview -> UI/UX + responsive QA -> PR approval -> merge main -> production Cloudflare deployment`

Current production reference:
`https://alquran-liputan6.avi-yansah.workers.dev/prototype-v6`

Do not merge UI refactoring directly to `main` before preview QA.
