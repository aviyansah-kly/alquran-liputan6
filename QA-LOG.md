# Al-Qur'an Liputan6 — Incremental QA Log

This branch follows a strict **implement -> QA -> proceed** workflow. A step must pass its QA gate before the next structural change is started.

## QA-01 — Detail Ayat critical loading
**Status:** PASS (code/architecture), preview visual verification required.

Changes:
- Main ayat data (`/surat/{id}`) renders before Tafsir completes.
- Tafsir loads progressively and no longer blocks Arabic text / translation.
- html2canvas/share-media moved outside the critical page-loading path.

Regression checks:
- Ayat, Latin, translation, navigation and audio setup remain based on the same Quran API data.
- Tafsir source/data logic unchanged.

## QA-02 — Long Surah progressive rendering
**Commit:** `7f8fbb1`
**Status:** SUPERSEDED by QA-05 manual 10-ayat loading.

Original changes:
- Initial Surah DOM rendered 30 ayat instead of the entire Surah.
- Additional batches used IntersectionObserver.

## QA-03 — Navigation redirect hop removal
**Commit:** `e24ec2e`
**Status:** PASS (code/routing), preview verification required.

Changes:
- Home -> Surah navigates directly to `surah-v4.html` runtime.
- Home/Surah -> Detail navigates directly to `ayat-v5.html` runtime.
- Removed unnecessary `surah-v6 -> v4` and `ayat-v6 -> v5` document hops from user flows.

Regression checks:
- `surah` and `ayat` query parameters preserved.
- Quran Home still points to `prototype-v6.html`.

## QA-04 — Quran Home direct document render
**Commit:** `52fe88b`
**Status:** PASS (structural/performance), preview visual verification required.

Changes:
- `prototype-v6.html` is now a direct document.
- Removed runtime fetch of `prototype-v4.html`.
- Removed `document.write()` reconstruction.
- Added preconnect to EQuran API.

Regression checks:
- Existing Home data/search logic still uses `prototype-v4.js`.
- v7 design-system CSS remains loaded.
- Quran shell/global-shell scripts retain execution order.

## QA-05 — Surah 10-ayat manual Load More + button states
**Commit:** `9c4be1d`
**Status:** PASS (code/behavior/accessibility), preview visual verification required.

Changes:
- Initial Surah render reduced to 10 ayat.
- Automatic IntersectionObserver batching replaced by explicit `Tampilkan 10 Ayat Berikutnya` action.
- Remaining count adapts for the final batch.
- Loading/disabled feedback appears while a batch is appended.
- Shared button behavior includes hover, pressed, focus-visible, disabled and pointer states.
- Arabic reader markup explicitly includes `lang="ar" dir="rtl"`.

Regression checks:
- No duplicate batch rendering in normal load-more flow.
- Deep-link and ayat jump ensure the requested ayat exists before scrolling.
- Audio auto-next, bookmark and share continue to use the complete API dataset.
- API failure still replaces the reader with a readable error state.
- Focus-visible from the shared accessibility layer remains intact.

## QA-06 — Reader and Detail Ayat skeleton loading
**Commits:** `09458e4`, `cc6bace`
**Status:** PASS (structural/behavior/reduced-motion), preview visual verification required.

Changes:
- Surah reader displays a stable ayat skeleton while `/surat/{id}` is pending.
- Detail Ayat displays skeletons for title/meta, Arabic, Latin and translation while core data is pending.
- Tafsir uses a separate skeleton and can remain loading after Arabic/translation are already readable.
- Detail page now consumes the v7 shared component stylesheet.
- Added API preconnect on Detail Ayat.

Regression checks:
- Core skeleton is removed as soon as `/surat` resolves.
- Tafsir skeleton is removed independently in success or error states.
- Core API failure removes skeletons and exposes readable error content.
- Skeleton animation is disabled under `prefers-reduced-motion`.
- Skeleton elements are non-interactive / hidden from assistive semantics where applicable.

## Visual QA Gate before next structural pass
Test preview deployment at minimum:
- 320px
- 375/390px
- 768px
- 1024px
- 1280px+

Flows:
1. Home initial load and search.
2. Open Al-Fatihah and Al-Baqarah.
3. Confirm Al-Baqarah initially shows 10 ayat only.
4. Use `Tampilkan 10 Ayat Berikutnya` repeatedly and verify continuity 10 -> 20 -> 30.
5. Verify Load More hover / pressed / keyboard focus / disabled-loading behavior.
6. Jump to a late ayat (e.g. 255) and confirm the target renders and scrolls correctly.
7. Audio play and auto-next across a batch boundary (e.g. ayat 10 -> 11).
8. Open Detail Ayat and confirm skeleton appears immediately.
9. Confirm Arabic/translation replace their skeleton before Tafsir when Tafsir is slower.
10. Previous/next ayat and Surah navigation.
11. Mobile sticky navigation / audio dock.
12. Confirm no major layout jump when skeletons are replaced with real content.

Do not proceed to the next structural cleanup if this preview gate exposes a regression.
