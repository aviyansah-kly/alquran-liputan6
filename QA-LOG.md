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
**Status:** PASS (code/behavior), preview visual verification required.

Changes:
- Initial Surah DOM renders 30 ayat instead of the entire Surah.
- Additional batches load through IntersectionObserver before the reader reaches them.
- Browsers without IntersectionObserver fall back to full rendering.

Regression checks:
- Deep-link/jump ensures target ayat exists before scrolling.
- Audio auto-next ensures the next ayat is rendered before highlighting.
- Bookmark and share still operate on the original full API dataset.
- API error state remains unchanged.

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
3. Scroll Al-Baqarah beyond ayat 30, 60 and 90 to confirm progressive continuity.
4. Jump to a late ayat (e.g. 255).
5. Audio play and auto-next across a batch boundary (e.g. ayat 30 -> 31).
6. Open Detail Ayat and confirm Arabic/translation appear before Tafsir if Tafsir is slower.
7. Previous/next ayat and Surah navigation.
8. Mobile sticky navigation / audio dock.

Do not proceed to the next structural cleanup if this preview gate exposes a regression.