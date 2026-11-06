# Full-bleed research website audit

Date: 2026-11-05. Implementation baseline: `f57eb91`, the latest `origin/main` when work began. The working tree was clean; `git fetch origin main` and a fast-forward check confirmed it was current. Original BIM composition reference: `786cb08` and the retained `docs/responsive/*-before-*.jpg` captures.

## Implementation

All six research pages now use edge-to-edge media with foreground headlines. The two BIM pages restore their original layered video and academic metadata compositions. Mobile SAR, Lunar, and Fire keep publication information outside the media Hero. Subsurface retains its original image/video stack, gradients, focal positions, actions, and motion control.

This checkout contains the published HTML/CSS/JS, with no Astro source, package manifest, or build command. Generated `_astro` assets remain untouched. The maintained sources are:

- `projects/research-heroes.css`: shared background/primary-media/foreground layers, with explicit page-specific scene color, poster, height, source aspect ratio, safe media area, and gradient settings.
- `projects/research-layout.css`: body widths, fluid typography, publication hierarchy, caption spacing, responsive galleries, and section rhythm.
- The six `projects/<project>/index.html` files: semantic Hero layers and the stylesheet links. Dense BIM diagrams also link to their original PNGs for enlargement.
- `projects/lunar-construction/lunar-editorial.css`: retained dark visual identity; removed the old viewport-height Hero and negative offsets.
- `projects/lunar-construction/lunar-media.js`: hides a stale error notice when a video subsequently decodes successfully; existing fallback links and motion preferences remain available.

A future Astro rebuild must retain these source hooks/styles or port them into the source components. The final stylesheet order is generated CSS, Lunar editorial styling where applicable, shared layout, then shared Heroes.

## Media fill and focal placement

Each changed Hero has one original primary image/video, a scene-matched background from a still, and a foreground overlay. Strong background blur prevents recognizable duplicate subjects. Foreground media uses its natural aspect ratio with `contain` and feathered edges, with no stretching, mirrored subjects, video cloning, or hard borders. The backgrounds fill the complete available browser width. Height limits are fluid and independent of `100vh`/`100svh`.

- **BIM-to-Workface:** `white_side.mp4`, original 2× autoplay/loop/mute/inline behavior. The upper centered headline, lower paper title, four authors, affiliations, and resource links share one light Hero. The existing `white_side.jpg` supplies the blurred wall continuation; a white gradient blends the lower publication area. Primary video edges feather into the scene on desktop and mobile.
- **BIM-Laser:** `projector_rotation.mp4`, original autoplay/loop/mute/inline behavior. White title and academic metadata return to the dark video composition, with the green projection visible between them. A single derived poster supplies a subdued scene extension into black. The central projection remains visible and there is no white Hero border.
- **Mobile SAR Co-Pilot:** `hero_mobile_copilot.webp` replaces the text/photo grid. The headline occupies the upper wall extension; the complete robot and projection wall remain in the safely framed primary photograph. Background and edge fades integrate the photo. Publication metadata is an independent section immediately below the Hero.
- **Lunar Construction:** `lunar-simulation-scene.png` occupies a full-width dark scene with a centered upper title and supporting copy. The primary image starts below the text's safe region, preserving the fixed-projector, raycasting, and DEM annotations. Removed the old `100svh` minimum and large negative Hero margin. Publication metadata follows in the original dark editorial identity.
- **Subsurface:** preserved the reference Hero markup, original cutaway, optional scan-loop video, gradients, desktop/mobile focal positions, and controls. Its original 1200px foreground boundary remains unchanged while body compositions use the narrower shared boundary. Chrome's stable scrollbar gutter is excluded from the available layout-width measurement; no artificial viewport-width overflow is introduced.
- **Fire Investigation:** `postfire_scene.png` supplies the full-width charcoal scene. The headline sits above the central investigation details within the gradient-treated scene. The complete room is contained and feathered into a dark background fill. Original scene description, credit, author, and affiliation remain immediately below; the research narrative and investigation controls are preserved.

Original media files were not modified. The only new media derivative is `projects/bim-laser/assets/bim-laser/projector_rotation-poster.jpg`, extracted at 2 seconds from `projector_rotation.mp4` for background fill; it is not a second video or a replacement for the original.

## Body composition and typography

The available maximum boundary is 1200px. Typical text/figure groups use **980px**, with headings and prose centered in an **810px** reading group. Body type scales from 16–18px, section headings from 28–40px, and publication titles from 26–34px. Hero sizes remain specific to their source composition. Captions use 14px text with 12px separation; prose-to-media spacing is 24–36px and section padding is 40–72px.

- **SAR:** balanced the paired problem photographs, target illustrations, annotated room deployment, robot/pattern pair, QA/QC figures, task record, and results. Existing smaller equipment/media frames and all numerical results remain intact.
- **BIM-to-Workface:** balanced the comparison, target-to-alignment sequence, architecture figure, paired alignment videos, tab controls, quantitative results, and future-work text. Technical diagrams preserve all annotations and open their original PNGs for enlargement.
- **BIM-Laser:** balanced the comparison, laser-path animation, hardware explanation, pipeline, accuracy diagram, prototype pair, and carousel. Small equipment photographs remain bounded by their source resolution; the carousel preserves its navigation and scroll behavior. Dense pipeline/accuracy diagrams have enlargement links outside the hydrated comparison components.
- **Lunar:** the complete “Create landmarks where the work happens” composition is **980px** on desktop, with **810px** paragraphs. Its original 1273×706 technical workflow is displayed at 980px without extra white padding, retains its original enlargement link, and remains uncropped. Paired motion clips, result chart, and excavation video use balanced widths and shared spacing.
- **Subsurface:** body sections, publication, radar stages, site mapping, metrics, and research directions use the shared composition width. The existing sensing film, scientific panels, stage controls, and full Hero composition are preserved.
- **Fire:** balanced the problem/process comparison, approach panel, before/after scene viewer, evidence video, simulation video, reasoning records, and future direction. Text/media columns reflow when readable widths are unavailable; the investigation trace remains usable on phones.

All research text, authors, affiliations, numerical results, original links, images, videos, and controls are preserved. `scripts/validate-research.py` compares text and original references to `786cb08`, checks local asset existence, unique IDs, viewport metadata, stylesheet order, and untouched generated assets.

## Checkpoints

1. `526c2ae` — restored and visually inspected both original BIM Hero compositions before work on the remaining Heroes.
2. `4b9eb2e` — implemented the full-bleed Hero system on all six pages.
3. `df7f41f` — balanced body widths, figures, typography, and section spacing.
4. Final verification commit — final edge-feathering corrections, interaction verification, audit, and screenshot evidence.

## Responsive verification

Real headless Google Chrome, driven by Playwright with Node 24. Videos are paused for reproducible captures; playback is tested separately.

- **60 page/viewport checks:** all six pages at **2560×1440, 1920×1080, 1620×1000, 1440×900, 1200×800, 960×900, 768×1024, 600×900, 390×844, and 320×700**.
- **606 continuous resize checks:** each loaded document resized from 1920px down to 320px in 16px steps. Intermediate Hero screenshots include the regions around the mobile reflow. Mobile scene heights meet the desktop minimum continuously at the scene breakpoint; academic metadata remains in normal foreground flow as it wraps.
- Verified full available-width Hero coverage, no horizontal overflow, no broken displayed images, and no browser page errors. Primary images/video remain undistorted; actual screenshots were reviewed for scientific subject visibility, text/annotation collisions, scene continuity, and body balance.
- **18 interaction checks:** all six pages at 1920px, 960px, and 390px. Both BIM comparison sliders pass pointer/keyboard control; alignment tabs, paired playback/rates/restart/synchronization, laser carousel, all body videos, Lunar motion/enlargement, Subsurface stages/range/motion, and Fire before/after controls pass. Lunar's successful-decoding fallback correction also passes at all three widths.
- `python scripts/validate-research.py` and `git diff --check` pass.

Results: [viewport/resize metrics](docs/full-bleed/after-metrics.json), [interaction results](docs/full-bleed/interactions.json). The corrected enlargement wrappers are outside all hydrated islands; no React hydration warnings remain.

## Before/after and close-up evidence

“Before” below is the previous published refactor at `f57eb91`, retained in `docs/responsive/*-after-*.jpg`. “After” is this full-bleed implementation. Each page has full-page and Hero close-up evidence at all three requested widths. Additional resize captures are named `<project>-resize-<width>.jpg` in `docs/full-bleed/`.

### Mobile SAR Co-Pilot

- 1920px: [before](docs/responsive/mobile-sar-copilot-after-1920.jpg), [after full page](docs/full-bleed/mobile-sar-copilot-after-1920.jpg), [after Hero close-up](docs/full-bleed/mobile-sar-copilot-hero-1920.jpg).
- 960px: [before](docs/responsive/mobile-sar-copilot-after-960.jpg), [after full page](docs/full-bleed/mobile-sar-copilot-after-960.jpg), [after Hero close-up](docs/full-bleed/mobile-sar-copilot-hero-960.jpg).
- 390px: [before](docs/responsive/mobile-sar-copilot-after-390.jpg), [after full page](docs/full-bleed/mobile-sar-copilot-after-390.jpg), [after Hero close-up](docs/full-bleed/mobile-sar-copilot-hero-390.jpg).

### BIM-to-Workface

- 1920px: [before](docs/responsive/bim2workface-after-1920.jpg), [after full page](docs/full-bleed/bim2workface-after-1920.jpg), [after Hero close-up](docs/full-bleed/bim2workface-hero-1920.jpg).
- 960px: [before](docs/responsive/bim2workface-after-960.jpg), [after full page](docs/full-bleed/bim2workface-after-960.jpg), [after Hero close-up](docs/full-bleed/bim2workface-hero-960.jpg).
- 390px: [before](docs/responsive/bim2workface-after-390.jpg), [after full page](docs/full-bleed/bim2workface-after-390.jpg), [after Hero close-up](docs/full-bleed/bim2workface-hero-390.jpg).

### BIM-Laser

- 1920px: [before](docs/responsive/bim-laser-after-1920.jpg), [after full page](docs/full-bleed/bim-laser-after-1920.jpg), [after Hero close-up](docs/full-bleed/bim-laser-hero-1920.jpg).
- 960px: [before](docs/responsive/bim-laser-after-960.jpg), [after full page](docs/full-bleed/bim-laser-after-960.jpg), [after Hero close-up](docs/full-bleed/bim-laser-hero-960.jpg).
- 390px: [before](docs/responsive/bim-laser-after-390.jpg), [after full page](docs/full-bleed/bim-laser-after-390.jpg), [after Hero close-up](docs/full-bleed/bim-laser-hero-390.jpg).

### Lunar Construction

- 1920px: [before](docs/responsive/lunar-construction-after-1920.jpg), [after full page](docs/full-bleed/lunar-construction-after-1920.jpg), [after Hero close-up](docs/full-bleed/lunar-construction-hero-1920.jpg).
- 960px: [before](docs/responsive/lunar-construction-after-960.jpg), [after full page](docs/full-bleed/lunar-construction-after-960.jpg), [after Hero close-up](docs/full-bleed/lunar-construction-hero-960.jpg).
- 390px: [before](docs/responsive/lunar-construction-after-390.jpg), [after full page](docs/full-bleed/lunar-construction-after-390.jpg), [after Hero close-up](docs/full-bleed/lunar-construction-hero-390.jpg).

### Subsurface

- 1920px: [before](docs/responsive/subsurface-after-1920.jpg), [after full page](docs/full-bleed/subsurface-after-1920.jpg), [after Hero close-up](docs/full-bleed/subsurface-hero-1920.jpg).
- 960px: [before](docs/responsive/subsurface-after-960.jpg), [after full page](docs/full-bleed/subsurface-after-960.jpg), [after Hero close-up](docs/full-bleed/subsurface-hero-960.jpg).
- 390px: [before](docs/responsive/subsurface-after-390.jpg), [after full page](docs/full-bleed/subsurface-after-390.jpg), [after Hero close-up](docs/full-bleed/subsurface-hero-390.jpg).

### Fire Investigation

- 1920px: [before](docs/responsive/fire-investigation-after-1920.jpg), [after full page](docs/full-bleed/fire-investigation-after-1920.jpg), [after Hero close-up](docs/full-bleed/fire-investigation-hero-1920.jpg).
- 960px: [before](docs/responsive/fire-investigation-after-960.jpg), [after full page](docs/full-bleed/fire-investigation-after-960.jpg), [after Hero close-up](docs/full-bleed/fire-investigation-hero-960.jpg).
- 390px: [before](docs/responsive/fire-investigation-after-390.jpg), [after full page](docs/full-bleed/fire-investigation-after-390.jpg), [after Hero close-up](docs/full-bleed/fire-investigation-hero-390.jpg).

### Explicit BIM composition comparison

The original BIM-to-Workface [1920px](docs/responsive/bim2workface-before-1920.jpg) and [960px](docs/responsive/bim2workface-before-960.jpg) captures show the centered headline, projected target/robot, and lower academic byline in one light composition. The new [1920px](docs/full-bleed/bim2workface-hero-1920.jpg) and [960px](docs/full-bleed/bim2workface-hero-960.jpg) captures restore that hierarchy and extend the wall environment to the viewport edges. The video is no longer bounded by the old fixed-width panel.

The original BIM-Laser [1920px](docs/responsive/bim-laser-before-1920.jpg) and [960px](docs/responsive/bim-laser-before-960.jpg) captures show a white centered headline and academic byline layered over the black/green projection environment. The new [1920px](docs/full-bleed/bim-laser-hero-1920.jpg) and [960px](docs/full-bleed/bim-laser-hero-960.jpg) captures preserve that visual identity with responsive sizing and foreground flow. Phase 1 desktop captures are retained in `docs/full-bleed/*-phase1-1920.jpg`.

## Reproduce and limitations

Serve the checkout using `python -m http.server 8766 --bind 127.0.0.1`. With Node 20+ and Playwright available:

```sh
node scripts/full-bleed-check.cjs after
RESPONSIVE_EVIDENCE=docs/full-bleed node scripts/responsive-interactions.cjs
python scripts/validate-research.py
git diff --check
```

`PLAYWRIGHT_MODULE` selects an external Playwright module; `CHROME_BIN` overrides `/usr/bin/google-chrome`; `RESPONSIVE_URL` selects another HTTP origin. `RESPONSIVE_SITES` selects comma-separated page slugs for targeted reruns while preserving other pages' evidence. Run viewport checks sequentially when sharing the same JSON report.

Verification covers Chrome at emulated desktop/tablet/phone viewport sizes, not physical iOS/Android devices or Safari/Firefox. Embedded raster annotations require the retained original/enlargement view for full readability at phone widths. Original coming-soon resource placeholders and external destinations remain unchanged. The new work is deployed through the existing GitHub Pages `main` branch; no Sites-hosting project or unrelated repository changes were introduced.
