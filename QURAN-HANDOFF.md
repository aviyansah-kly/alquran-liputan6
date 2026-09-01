# Al-Qur'an Liputan6 — UI/UX & Design System Handoff

## Status
This document is the implementation contract for consolidating the Quran prototype into a production-ready UI system. The feature branch must not change Quran data, source attribution, or API behavior unless explicitly reviewed.

## Product hierarchy
### Quran Home
1. Search / finder
2. Continue Reading (when last-read data exists)
3. Surah selection
4. Supporting portal content / right rail

### Surah Reader
1. Surah identity and metadata
2. Arabic reading content
3. Translation
4. Reader controls and audio
5. Previous / next navigation

### Ayat Detail
1. Verse text
2. Arti
3. Tafsir
4. Editorially verified Poin Penting
5. Asbabun Nuzul when a verified source exists
6. FAQ

## Design tokens
Use `quran-design-system-v7.css` as the source of truth for Quran-specific tokens.

### Spacing
4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64px.
Avoid introducing arbitrary spacing values without design review.

### Radius
- Small: 4px
- Medium: 8px
- Large: 12px
- XL: 16px
- Full: 999px

### Typography
- Caption / metadata: 12px
- Navigation / controls: 14px
- Reading body, translation and Tafsir: 16px minimum
- Section heading: 20px+
- Page title: 28px mobile / 32px desktop
- Arabic reader typography is intentionally larger and must preserve generous line-height.

### Interaction sizing
- Desktop interactive control: 40px minimum height
- Mobile interactive control: 44px target height
- Full Surah cards should be clickable targets, not only their labels.

## Required component states
Where relevant, components must specify and implement:
- Default
- Hover
- Focus-visible
- Pressed / active
- Disabled
- Loading
- Error

## Accessibility acceptance criteria
- All interactive actions use semantic `<button>` or `<a href>` elements; avoid clickable `<div>` elements.
- Keyboard focus must be visible.
- Current navigation state should use `aria-current` where applicable.
- Quran Arabic content uses `lang="ar"` and `dir="rtl"`.
- Indonesian content retains `lang="id"` at document level.
- Accordion controls expose expanded/collapsed state.
- Audio controls are keyboard accessible and have accessible names.
- Animation respects `prefers-reduced-motion`.
- Body text and controls must meet WCAG AA contrast.

## Responsive behavior
Do not treat responsive work as a single desktop/mobile collapse.
QA at minimum:
- 320px
- 375/390px
- 768px
- 1024px
- 1280px+

Mobile priorities:
- Preserve Arabic readability.
- Keep primary controls at comfortable touch sizes.
- Stack reader tools instead of compressing them into a dense horizontal toolbar.
- Keep horizontal channel/anchor navigation scrollable when necessary.
- Hide non-essential portal chrome in focused reading contexts.

## Reading mode rules
Surah Reader and Ayat Detail are focus experiences.
- Trending content should not compete with the Quran reading task.
- Header behavior may collapse on scroll but must not cause layout jump.
- Ads must not split Arabic text from its corresponding translation or Tafsir context.

## Content provenance
Religious-source content and editorial content must be visually and semantically distinguishable.
- Translation: show source metadata.
- Tafsir: show source metadata.
- Poin Penting: label as editorially prepared/reviewed content.
- Asbabun Nuzul: render only when a verified source exists.

## Engineering architecture target
Production implementation should converge on shared components rather than the current prototype redirect/patch chain.

Target structure:
- QuranShell
  - GlobalHeader
  - IslamiChannelNav
  - QuranHome
  - SurahReader
  - AyatDetail
  - RightRail
  - Footer
- Shared Quran components
  - SearchFinder
  - ContinueReading
  - SurahCard
  - SurahFilter
  - ReaderToolbar
  - AudioPlayer
  - AyatActions
  - DetailAnchorNav
  - SourceNote
  - PreviousNextNavigation

Do not carry the `v6 -> v4/v5` redirect architecture into production.

## Definition of Done
A handoff is production-ready when:
1. Home, Surah Reader and Ayat Detail use one shared token/component system.
2. No visual behavior depends on version redirect chains.
3. Desktop, tablet and mobile states are documented and QA'd.
4. Keyboard/focus/RTL/touch-target requirements pass QA.
5. Loading and error states are implemented for API-driven surfaces.
6. Religious and editorial source attribution is explicit.
7. No Quran data/API logic is changed as part of UI-only refactoring without separate review.
