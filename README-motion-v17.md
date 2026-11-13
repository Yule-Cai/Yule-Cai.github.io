# Academic portfolio · motion update v1.7

Adds progressive cross-document View Transitions to all seven page types, a brief fallback for older browsers, subtle section arrival cues, animated publication cards, mobile navigation, and modal exit animations.

- Duration: 150–275 ms, minimal travel, no full-screen loaders.
- Accessibility: respects `prefers-reduced-motion: reduce`, preserves links, hash history, browser back, and modal focus restoration.
- Deployment: `assets/motion.css` and `assets/motion.js` linked in the homepage, CV, research overview and four paper pages; publication-dialog exit handling updated in `app.js`.
- Browser compatibility: native same-origin View Transitions where supported; immediate navigation or short fallback where unsupported.
- Test status: JS syntax, CSS parse, markup and anchor/link consistency checked; container Chromium currently blocks local URLs so live visual QA must still be performed.
- Original content, scientific results and private repo access not changed.