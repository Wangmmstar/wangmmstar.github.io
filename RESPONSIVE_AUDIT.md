# Responsive audit — six research websites

Date: 2026-11-05. Baseline: `786cb08` on GitHub `main`; fetched and fast-forward checked before editing. The initial working tree was clean.

## Implementation and files

Only the published project was found locally: no `.astro` source, Astro configuration, package manifest, or build command. The implementation therefore uses stable HTML hooks and a named stylesheet; generated `_astro` files are untouched.

- Added `projects/research-layout.css`, linked last on all six pages.
- Updated `projects/{mobile-sar-copilot,bim2workface,bim-laser,lunar-construction,subsurface,fire-investigation}/index.html`.
- Integrated the approved dark palette in `projects/lunar-construction/lunar.css`, retaining the shared grid and removing superseded overlap calculations.
- Added `scripts/responsive-check.cjs`, `scripts/responsive-interactions.cjs`, `scripts/responsive-zoom.cjs`, and `scripts/validate-research.py`.
- Added this report and the screenshot/JSON evidence in `docs/responsive/`.
- Retained `docs/lunar-dark/` as supplemental theme review evidence; the final integrated layout is documented by `docs/responsive/`.

Future Astro rebuilds must retain the shared stylesheet link and `research-*` hooks, or port them into the source components. This stylesheet is the maintained source for the shared rules.

## Shared rules

One 1200px content grid, with fluid 20–48px gutters, governs section headings, figures and captions. Paragraphs alone use a 76ch reading measure. Body type scales from 16px to 18px; section headings from 28px to 40px; publication titles from 26px to 34px. Hero sizes remain composition-specific. Captions and affiliations use 13–14px type, with shared 12px image-to-caption spacing and 24–36px prose-to-media spacing. Sections use fluid 40–72px vertical padding.

Scientific images retain their intrinsic aspect ratios. Small equipment photographs remain intentionally smaller because their source resolution is low; carousel figures retain a bounded height; comparison panels preserve their original scientific framing. These are media-specific exceptions within the same grid. Videos use native-ratio frames with `contain`.

## Page changes and corrected issues

- **Mobile SAR:** replaced the negative-margin Hero with bounded text/photo grid columns and a dark neutral frame. The full robot and wall target remain visible. Stacked media stays near its pre-stack size to avoid sudden enlargement. Publication metadata, galleries, annotated deployment, QA/QC comparisons, task summary, results, and closing sections share the grid. Corrected image sizing inside the paired frames.
- **Lunar:** includes the approved dark theme with pale text and cyan accents. A full-width headline, supporting copy and complete annotated illustration occupy grid cells; a framed, floating relationship replaces offset formulas and image masks. Narrow screens stack the elements without enlarging the illustration suddenly. Publication, Apollo/localization videos, workflow, results chart, and RASSOR footage use the shared grid and typography.
- **BIM-to-Workface:** independent headline and native 16:9 video frame replace absolute video positioning, computed offsets and gradient masks. Preserved autoplay, looping, mute, inline playback and 2× speed. Moved every publication detail/link below the visual Hero. Standardized architecture diagrams, comparison, paired video tabs and result sections. Fixed headline word spacing when its explicit line break is suppressed.
- **BIM-Laser:** retained its dark Hero identity, with an independent headline and uncropped 16:9 projection video. Publication metadata and existing links sit below it. Grouped the legacy body into sections, aligned wide figures and reflowing hardware columns, and kept the working carousel and comparison slider.
- **Fire:** grid rows place the complete investigation image across the dark/light background boundary without negative margins. Description and attribution remain readable below it at every width. Approach, evidence, simulation and reasoning sections use the shared grid. Two-column layouts require readable minimum widths before stacking; the investigation trace reflows to three columns and then one.
- **Subsurface:** preserved the full-bleed image/video Hero, overlays, mobile focal positioning and animation controls. Unified body/figure alignment and publication hierarchy. Corrected the metric grid's 7px horizontal overflow at 320px through fluid number sizing and shrinkable tracks.

Both legacy BIM comparison islands emitted React hydration error 418 in the baseline. Removing whitespace-only formatting between their server-rendered tags corrected the mismatch. Their existing compiled components remain unchanged, and pointer/keyboard interactions pass.

No research narrative, numerical result, author, affiliation, year, original media reference, or original link was removed or rewritten. Automated comparison against the baseline confirms this. No temporary padded image derivatives were necessary: padding is in the media containers, so there is no original-to-derivative filename mapping.

## Verification

Real headless Google Chrome 150.0.7871.114, driven by Playwright on Node 24. No Astro build is available in this published-only repository.

- All six pages at **2560×1440, 1920×1080, 1440×900, 1200×800, 960×900, 768×1024, 600×900, 390×844, 320×700**: 54 viewport checks, no horizontal overflow, broken displayed images or page errors.
- Continuously resized each loaded document from 1920px to 320px in 16px steps: 606 checks. Captured intermediate Hero states, including both sides of the stacking breakpoint, and visually inspected their transitions.
- Native Chrome browser zoom **125% and 150%**, at 1920px and 960px window widths: 24 checks. Confirmed the actual browser zoom using `devicePixelRatio` and the reduced CSS viewport; this is not CSS zoom or pinch scaling. Zoom evidence stitches actual viewport captures because Chrome's single offscreen capture omitted some decoded image layers.
- Interactions at 1920px, 960px and 390px: 18 page/viewport combinations. Checked both BIM comparison sliders with drag and keyboard, all paired-video tabs/speeds/restart/synchronization, laser carousel navigation, every body video, Lunar motion/enlargement, Subsurface stages/range/motion controls, and Fire before/after switching.
- Inspected before/after screenshots for all six pages at all three requested widths, including lower-page sections, plus native zoom and intermediate resize captures. Corrected the frame sizing, word spacing, narrow metrics overflow and sudden media enlargement found during review.
- `python scripts/validate-research.py` verifies preserved text/media/links, local asset existence, unique IDs, viewport metadata, stylesheet order and untouched hashed assets. `git diff --check` passes.

Detailed evidence: [viewport and resize metrics](docs/responsive/after-metrics.json), [baseline metrics](docs/responsive/before-metrics.json), [interaction results](docs/responsive/interactions.json), [native zoom metrics](docs/responsive/zoom-metrics.json). Additional images follow `<page>-resize-<width>.jpg` and `<page>-zoom-<percent>-<window-width>.jpg` in the same directory.

## Before / after screenshots

Each link opens a full-page browser screenshot; videos are paused for capture.

- **Mobile SAR:** 1920px [before](docs/responsive/mobile-sar-copilot-before-1920.jpg) / [after](docs/responsive/mobile-sar-copilot-after-1920.jpg); 960px [before](docs/responsive/mobile-sar-copilot-before-960.jpg) / [after](docs/responsive/mobile-sar-copilot-after-960.jpg); 390px [before](docs/responsive/mobile-sar-copilot-before-390.jpg) / [after](docs/responsive/mobile-sar-copilot-after-390.jpg).
- **BIM-to-Workface:** 1920px [before](docs/responsive/bim2workface-before-1920.jpg) / [after](docs/responsive/bim2workface-after-1920.jpg); 960px [before](docs/responsive/bim2workface-before-960.jpg) / [after](docs/responsive/bim2workface-after-960.jpg); 390px [before](docs/responsive/bim2workface-before-390.jpg) / [after](docs/responsive/bim2workface-after-390.jpg).
- **BIM-Laser:** 1920px [before](docs/responsive/bim-laser-before-1920.jpg) / [after](docs/responsive/bim-laser-after-1920.jpg); 960px [before](docs/responsive/bim-laser-before-960.jpg) / [after](docs/responsive/bim-laser-after-960.jpg); 390px [before](docs/responsive/bim-laser-before-390.jpg) / [after](docs/responsive/bim-laser-after-390.jpg).
- **Lunar:** 1920px [before](docs/responsive/lunar-construction-before-1920.jpg) / [after](docs/responsive/lunar-construction-after-1920.jpg); 960px [before](docs/responsive/lunar-construction-before-960.jpg) / [after](docs/responsive/lunar-construction-after-960.jpg); 390px [before](docs/responsive/lunar-construction-before-390.jpg) / [after](docs/responsive/lunar-construction-after-390.jpg).
- **Subsurface:** 1920px [before](docs/responsive/subsurface-before-1920.jpg) / [after](docs/responsive/subsurface-after-1920.jpg); 960px [before](docs/responsive/subsurface-before-960.jpg) / [after](docs/responsive/subsurface-after-960.jpg); 390px [before](docs/responsive/subsurface-before-390.jpg) / [after](docs/responsive/subsurface-after-390.jpg).
- **Fire:** 1920px [before](docs/responsive/fire-investigation-before-1920.jpg) / [after](docs/responsive/fire-investigation-after-1920.jpg); 960px [before](docs/responsive/fire-investigation-before-960.jpg) / [after](docs/responsive/fire-investigation-after-960.jpg); 390px [before](docs/responsive/fire-investigation-before-390.jpg) / [after](docs/responsive/fire-investigation-after-390.jpg).

## Reproduce and limitations

Serve the repository with `python -m http.server 8766 --bind 127.0.0.1`. With Node 20+ and Playwright available, run `node scripts/responsive-check.cjs after`, `node scripts/responsive-interactions.cjs`, and `node scripts/responsive-zoom.cjs`. The zoom capture script also uses Python/Pillow to stitch viewport images. Set `PLAYWRIGHT_MODULE` to an externally installed Playwright module when it is not on Node's normal module path; `CHROME_BIN` can override `/usr/bin/google-chrome` and `PYTHON_BIN` can select Python. Use `RESPONSIVE_URL` for a different HTTP origin. The `before` capture mode is for the baseline checkout before applying changes.

Verification covers Chrome rendering and emulated viewport sizes, not physical iOS/Android devices or Safari/Firefox. Dense labels embedded in original raster figures remain limited by their original resolution at phone widths. Existing paper/GitHub destinations and coming-soon placeholders remain exactly as supplied. A future source rebuild must explicitly carry over the maintained stylesheet and markup hooks.
