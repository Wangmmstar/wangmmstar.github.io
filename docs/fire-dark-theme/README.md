# Fire Investigation dark redesign

Baseline: `2155b87`. Date: November 5, 2026.

The Fire Investigation page now uses a continuous charcoal theme, the existing unfiltered post-fire image as a full-width Hero, a directional gradient behind the overlaid title, and a compact introduction immediately afterward. All research text, section order, media, attribution, and interaction code are preserved. No other project page or shared stylesheet is modified.

`projects/fire-investigation/fire-theme.css` loads last and scopes every rule to this project. Keep that stylesheet link if regenerating the published HTML.

## Rendered verification

Chrome/Playwright checks passed at 1440, 1024, 768, 390, and 375 CSS pixels:

- The image fills the Hero; title and category label remain over it at every width.
- There is no horizontal overflow or unintended white surface.
- Research headings use the primary light text color; images and videos have no CSS filters or masks.
- Before/After selection works with mouse/touch and keyboard, updates pressed states, and displays the matching image.
- Both research videos play and seek with native controls.
- All images load, with no browser errors or failed HTTP responses.
- Without JavaScript, both scene images remain available and the nonfunctional selector stays hidden.

The `hero-*.jpg`, `viewport-*.jpg`, and `full-page-*.jpg` files are actual browser screenshots at each requested width. `comparison-after-*.jpg` records the alternate scene at desktop and mobile widths. `verification.json` contains measured geometry and computed-style checks.

Run `node scripts/check-fire-dark-theme.cjs` against a static preview with HTTP byte-range support on port 8771, or set `RESPONSIVE_URL`. Set `PLAYWRIGHT_MODULE` and `CHROME_BIN` when using existing local installations.

Run `python scripts/validate-research.py` to verify content, media, links, and generated assets across all six research pages. `git diff --check` also passes.

## Production

This repository contains the production static files, without Astro source, a package manifest, or a local build command. GitHub Pages builds from `main` at the repository root. Pushing the changes invokes that existing production publishing pipeline.
