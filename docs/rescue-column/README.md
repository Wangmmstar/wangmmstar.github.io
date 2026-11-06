# Rescue page: shared 980px content column

November 6, 2026. Target: https://wangmmstar.github.io/projects/ground-penetrating-rescue-robots/

Authoritative source: `/data/Webpage/academic-project-astro-template/src/ground-penetrating-rescue-robots/`.
Only `research.css` and `pages/index.astro` were edited there. The isolated
`npm run build:ground-penetrating-rescue-robots` passed under Node 24.22.1;
Astro check reported zero errors, warnings, or hints. Only this route's HTML
and generated CSS were copied into the portfolio. Global styles and other
project pages were not modified.

All five story sections share one centered 980px maximum column, with responsive
20–48px gutters. Headings, full-width paragraphs, primary media, scenario buttons,
status, and SVG map align to that column. Heading-to-paragraph spacing is 16px;
paragraph-to-media spacing is 32px. The existing full-screen Hero retains its
original geometry, typography, image crop, and overlay. Before/after Hero PNGs
were pixel-identical at 1440, 768, and 390px.

The problem section renders only the disaster photograph. The unused supporting
figure styles were removed; the training diagram remains in the media directory.
Sensing retains its drone and radargram. Inference retains its concept rendering
and accessibility/provenance information. Laser Guidance pairs the quadruped
platform on the left with the laser illustration on the right, in equal-height
frames using `object-fit: contain`. Both image pairs stack below 600px. The laser
paragraph uses the requested wording. The footer explicitly distinguishes the
platform graphic from a validated integrated rescue laser system.

`node scripts/check-rescue-alignment.cjs` checks 1440, 1024, 768, and 390px and
produces the adjacent screenshots and `verification.json`. Checks cover full-width
left-aligned text, shared media and interaction boundaries, responsive image pairs,
uncropped scientific images, exact section/image selection, typography and spacing,
absence of the void diagram and extra labels, readable unclipped map labels,
both scenarios with mouse/touch/keyboard, changed routes/markers/hazard emphasis,
live status and accessible descriptions, keyboard-operable credits, no horizontal
overflow, and no browser script or HTTP resource errors. Screenshots at all three
requested widths were visually inspected.

Publication uses the existing GitHub Pages legacy build from `main` at repository
root. To rerun the same checks against the deployed page without replacing local
evidence:

```sh
QA_URL=https://wangmmstar.github.io QA_OUTPUT=/tmp/rescue-live node scripts/check-rescue-alignment.cjs
```
