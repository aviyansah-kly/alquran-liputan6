# Quran v7 frontend structure

This folder is the handoff-oriented source layout for the Al-Qur'an Liputan6 revamp. It separates design-system rules from page-specific behavior so frontend engineers do not need to inherit the prototype's `v6 -> v4/v5` patch chain.

## Target structure

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

## Ownership

- `tokens.css`: colors, spacing, radius, typography and control-size tokens only.
- `base.css`: accessibility defaults, focus-visible, reduced motion, language/RTL helpers.
- `components.css`: reusable Quran UI component normalization.
- `pages.css`: Home / Surah Reader / Ayat Detail layout rules only.
- `routes.js`: route names/URL builders only; no API logic.

## Production mapping

Frontend framework implementation may map this structure into existing KLY conventions (React/Vue/server templates/etc.), but should preserve the same separation of concerns:

- Global Liputan6 shell is shared, not copied per Quran page.
- Quran data/API services are separate from presentation components.
- Home, Surah Reader and Ayat Detail consume the same tokens/components.
- No production implementation should depend on prototype version redirects.

See `/QURAN-HANDOFF.md` for acceptance criteria.