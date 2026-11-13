# Local image optimization (v1.6)

- **Avatar:** `profile.png` is retained unchanged as the recoverable original. `assets/profile-420.webp` and `assets/profile-900.webp` are resized, metadata-stripped display versions.
- **Project figures:** sourced solely from two confirmed public `Yule-Cai/*` project repositories and kept as actual results, not illustrative AI art. Original GitHub source links stay on each project card. Only public repository figures are converted; private repositories are shown with labeled illustrative SVGs, no links to their files. Local optimized WebP assets have original public-source and SVG fallbacks.
- **Sensors / KA-IHO:** MDPI figure reused with paper DOI attribution under the journal's CC BY policy. The original publisher is linked from the page.
- **Other publisher figures:** Springer figure images are still served from the original publisher rather than copied or re-encoded, until reuse permissions are checked.
- **Regeneration:** `.github/workflows/build-web-images.yml` runs on its own addition or manually; Python source is `scripts/build_web_images.py`. It does not access private research files.
- **Verification:** After image assets have been committed, check publication and project cards at 320, 390, 760 and 1440 px. Do not claim production Core Web Vitals without field measurements.