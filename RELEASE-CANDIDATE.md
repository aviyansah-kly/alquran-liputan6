# Al-Qur'an Liputan6 — Release Candidate

Status: READY FOR REVIEW (pre-merge)

## Final release cleanup
- Canonical Quran Home route is `prototype-v6.html`.
- Shared global shell no longer sends the Al-Qur'an channel link to `prototype-v4.html`.
- Central route helper points directly to the runtime pages: Home `prototype-v6.html`, Surah `surah-v4.html`, Ayat Detail `ayat-v5.html`.
- `quran-shell-v6.js` no longer uses `prototype-v4.html` as its background shell source; it consumes the canonical v6 Home shell.
- Cloudflare static asset upload excludes documentation, QA/handoff docs, repo config and non-runtime notes through `.assetsignore`.

## Regression gates passed in source review
- Home renders directly without `document.write()` reconstruction.
- Surah initial render is capped at 10 ayat with explicit Load More.
- Deep-link / jump-to-ayat retains target rendering.
- Surah audio supports Play / Pause / Resume without restarting.
- Detail Ayat core content renders before Tafsir completes.
- Detail Ayat and Surah use skeleton loading and reduced-motion support.
- Detail Ayat audio trigger and bottom player remain synchronized.
- Sticky Surah and Detail Ayat navigation provides destination context on desktop.
- Detail Ayat non-sticky toolbar does not expose cramped Prev/Next controls.
- Quran action buttons use shared interaction states and 40px desktop / 44px mobile targets.
- Detail Ayat bottom audio player follows the Surah black-player visual pattern.
- Arabic reader content uses RTL/language semantics.

## Pre-merge browser smoke test
Use the latest Cloudflare branch preview and verify:
1. Home search and Surah navigation.
2. Al-Baqarah 10 -> 20 -> 30 Load More.
3. Jump to ayat 255.
4. Surah Play -> Pause -> Resume.
5. Detail Ayat skeleton and progressive Tafsir.
6. Detail Ayat bottom player Play/Pause/Close.
7. Sticky Prev/Next Surah and Ayat at desktop width.
8. No overflow at 320, 390, 768, 1024 and 1280+ widths.

## Merge policy
Merge to `main` only after the newest Cloudflare preview build is green and the browser smoke test above does not expose a regression.
