# Subsurface image sources

## utility_strike.jpg

- Photograph: **Gas Line Rupture – Natural Gas Break** (Laramie, Wyoming, 2024).
- Photographer: **Tony Webster**.
- Source: https://commons.wikimedia.org/wiki/File:Gas_Line_Rupture_-_Natural_Gas_Break_(54124032675).jpg
- License: **Creative Commons Attribution-ShareAlike 2.0** — https://creativecommons.org/licenses/by-sa/2.0/
- Downloaded Wikimedia's 1280-pixel rendition without editing the file. The page uses an aspect-ratio display crop under the same license and visibly credits the photographer, source, and license.
- The photograph documents the aftermath/repair of a gas-line rupture, not the instant of an excavation strike.

## hero_utility_map.png

An exact, lossless pixel crop of the supplied `hero_visual.png`: left 1290, top 40, right 1830, bottom 585. The crop isolates the integrated utility illustration, retaining its map inset, pipeline annotations, and detected-utilities label. No data, colors, or locations were regenerated or modified. The four supplied scientific PNG originals remain unchanged.

## Scientific figure audit — 2026-10-26

All six existing raster assets were visually inspected. Their roles are:

- `hero_visual.png`: conceptual sequence of radargram slices, permittivity slices,
  and an integrated utility-mapping illustration. It is not a field accuracy plot.
- `hero_utility_map.png`: existing isolated integrated illustration, retained only
  in the Hero. Its source crop is documented above; no new Hero crop was made.
- `system.png`: composite system overview, including a camera street view, a
  colorized street/depth-style view, sensing hardware, a radargram/inversion pair,
  and a conceptual integrated map with trajectory. The supplied file alone does
  not verify that its colorized view is a completed SLAM reconstruction or a pose
  result. No part of this overview is used as field-result evidence on the page.
- `inversion_results.png`: two complete validation cases, each with five columns:
  radargram, ground-truth time-domain permittivity, predicted time-domain
  permittivity, ground-truth depth-domain permittivity, predicted depth-domain
  permittivity. The page retains both cases, all columns, axes and color scales.
- `real.png`: measured radargram and time-/depth-domain predictions, including
  reference pipe markers in the depth view. The original composite is retained.
- `utility_strike.jpg`: rupture aftermath/repair photograph; attribution above.

### Mobile scientific panels

Desktop renders `inversion_results.png` and `real.png` in full. Mobile renders
complete source columns, exported by `scripts/export-subsurface-panels.py` from
those PNGs, never from screenshots. All original rows are retained. Boundaries
are located inside fully transparent inter-column gutters, rather than selected
according to a desired layout box:

- `inversion_results.png`: x boundaries 0, 357, 763, 1168, 1584, 2000; full y 0–749.
- `real.png`: x boundaries 0, 670, 1469, 2249; full y 0–640.

The eight `panels/*.png` files are lossless, unscaled source columns. The exporter
checks transparent boundaries and verifies byte-for-byte RGBA equality after
reassembling all columns. No source pixel, plot, axis, scale or case is omitted.

### Earlier field-image provenance limit (superseded by supplied Fig. 14 below)

No paper PDF or independently identified Fig. 14 image was found in the project
or supplied attachments. The publisher record is
https://www.sciencedirect.com/science/article/pii/S0926580523002649
(DOI 10.1016/j.autcon.2023.105004); the full-page fetch returned HTTP 403 during
this audit, so Fig. 14 could not be inspected or verified. The field-study summary
therefore uses text only. The former colorized-street-as-SLAM labels and repeated
Hero illustration in Method were removed.


## aboveground.jpg — supplied paper Fig. 14, 2026-10-26

The author supplied the original field-experiment figure and identified it as
Fig. 14 of “Underground infrastructure detection and localization using deep
learning enabled radargram inversion and vision based mapping”
(DOI 10.1016/j.autcon.2023.105004).

The requested Downloads filename had a `.jpg` suffix; the actual source was the
extensionless JPEG `/home/mwang5/Downloads/website/aboveground` (2126 × 1090).
It was copied byte-for-byte to `aboveground.jpg`, with no cropping, resampling,
redrawing or changes to the scientific content.
SHA-256: `6436499e5f52cec147409352eb9136dc9776a6cc0310ca94dc08722a0021d0f1`.

The complete image was inspected. Its left side shows ZED-camera/GPR setup; the
upper right distinguishes camera/depth observations with points from the actual
3D point-cloud reconstruction and GPR trajectory; the lower right shows real
radargrams, predicted permittivity maps and indicated pipeline detections.
The component uses the complete original once in the outdoor field-study
subsection. Desktop display remains capped at 1050px. The initial mobile horizontal viewport
was replaced by the complete-region presentation documented below.
The field evidence is not assigned the controlled-validation depth-error metric.


## Mobile Fig. 14 regions — 2026-10-26

No separate originals for the three field-study regions were available in the
project or supplied website assets. `scripts/export-subsurface-field-panels.py`
extracts three complete regions from the decoded original `aboveground.jpg`.
There is no resampling, AI generation, redrawing, JPEG recompression or alteration
of scientific results. The original desktop JPEG remains byte-identical.

- `field-panels/system-integration.png` (1000 × 1114): complete system frame,
  camera/GPR setup and text, plus both complete SLAM/Predict labels and arrows.
  It retains source rectangles (0, 0, 825, 1090), (765, 80, 976, 215), and
  (765, 745, 976, 865) on white, with 12px external padding. The shaped extraction
  excludes neighboring camera/plot fragments beyond the workflow, while retaining
  every source pixel within those complete workflow regions.
- `field-panels/aboveground-reconstruction.png` (1172 × 563): source rectangle
  (978, 0, 2126, 539), with 12px external padding. Original title, both camera/depth
  rows, point-cloud views, trajectory arrows and complete label are retained.
- `field-panels/subsurface-mapping.png` (1190 × 574): source rectangle
  (960, 540, 2126, 1090), with 12px external padding. All four real radargrams,
  four predicted maps, title, pipeline annotations, axes, units and color scales
  are retained. Only the unrelated duplicate Predict-arrow tip in source
  x=960–978/y=790–870 is replaced with white; its complete original is retained
  in the System Integration panel. No plot or axis occupies that area.

The exporter asserts exact source-pixel equality for the complete workflow,
aboveground region, subsurface scientific panels, and left-side axis strips.
All three exported files were visually inspected for complete labels and margins.

At widths up to 800px, these regions stack vertically at the available content
width with natural image height and `object-fit: contain`. A native modal viewer
provides keyboard-accessible fit, zoom and close controls for small annotations.
Each modal initially fits the entire selected region; panning is available only
when the reader explicitly zooms. The inline mobile page has no horizontal
carousel, scrolling image track, oversized image width or clipping container.

## Research showcase redesign — 2026-10-31

This update supersedes the earlier *page-placement* notes above. The original
scientific images and documented mobile panels remain unchanged. The page now
uses `real.png` in the sensing/inversion section, `aboveground.jpg` in the
site-referencing section, and `inversion_results.png` in expandable validation
details. At narrower widths their existing complete source panels appear instead
of the desktop composites. The rupture photograph, `hero_visual.png`, and
`hero_utility_map.png` remain archived public assets but are no longer rendered
by this page.

The supplied Subsurface Intelligence Agent Kit is preserved in full at
`source-media/subsurface/Subsurface_Intelligence_Agent_Kit/`, outside the build
output and outside the public asset tree. Its manifest identifies the hero,
above/below-ground fusion, and excavation illustrations as original AI-generated
concepts and the hero animation as an original concept animation, cleared for
use with conceptual labels. All receive visible concept captions on the page.

Production `concepts/` contains WebP derivatives of the three original PNGs,
the unchanged original hero MP4, and the supplied authored SVG explainer. PNG to
WebP conversion preserves the full 1672 × 941 frame. The SVG motion was converted
from SMIL to CSS to honor reduced-motion preferences directly in the asset.
No concept illustration is represented as measured research evidence.

The PPT-extracted reference video with unverified rights and its reference
screenshot are preserved only in the nonpublic kit, never copied to production.
See `docs/subsurface-redesign/implementation.md` for the complete audit and
reviewed responsive screenshots.

## Targeted revision — 2026-10-31, round 2

The user explicitly confirmed in this chat that the InfraSono PPT animation's
rights are cleared for public website use. This supersedes the earlier
rights-unverified classification for that supplied clip. The source
`assets/optional_reference/scan_animation_FROM_PPT_check_rights.mp4` in the
preserved kit is copied byte-for-byte to
`video/gpr-sensing-principle.mp4`. It is shown as a **principle illustration** in
the engineering problem / GPR sensing section, with muted inline playback,
native playback controls, and an English explanatory caption track. It is not
labeled as an experimental radargram. `video/gpr-sensing-poster.jpg` is an
unaltered frame extracted at 6.5 seconds; `gpr-sensing-en.vtt` describes the
illustrated sequence. The separate 4-second generated hero animation remains
in the hero only.

The real-data comparison now uses a discrete three-stage scrubber and the
existing complete `real-*.png` source columns, all from the single original
`real.png`. No time/depth pixel alignment or before/after wipe is implied.

The main field-study narrative uses three exact, unscaled JPEG-pixel crops,
encoded losslessly as PNG by `scripts/export-subsurface-story-panels.py`:

- `field-story/camera.png`: source rectangle (145, 30, 665, 365), the published
  ZED-camera localization diagram, including its original position/pose label.
- `field-story/point-cloud.png`: source rectangle (1720, 35, 2126, 539), both
  point-cloud views, GPR trajectory, and all associated original labels/arrows.
- `field-story/detected-utility.png`: source rectangle (1200, 580, 1480, 850),
  one complete field-study predicted depth-permittivity map, with original
  detection box, depth and distance axes, units, and color scale.

The field-study crop is a different example from `real.png`; it is explicitly
identified as field-study evidence, not one of the scrubber stages. No camera
image is relabeled as a point cloud. The original annotated `aboveground.jpg`
and `real.png` are retained together in an expandable Technical details panel.
Future research now uses large editorial images with one research question and
one short sentence, all labeled as concept illustrations.

## Editorial research narrative — 2026-11-06

This entry supersedes earlier page-placement notes. All original scientific,
concept, animation, and intermediate time-domain assets remain unchanged.

- Inversion: Fig. 12(a), the three-pipe real-data case, uses the complete existing
  `panels/real-radargram.png` (670 × 640) and
  `panels/real-prediction-depth.png` (780 × 640). These were verified as exact
  RGBA pixel matches to `real.png` rectangles (0, 0, 670, 640) and
  (1469, 0, 2249, 640). Axes, units, color scale and orange pipe references are
  intact. The accepted-manuscript Fig. 12 caption identifies the orange dots as
  real pipes; the page identifies them as reference locations, not detections.
- Spatial mapping: the complete, unchanged author-supplied Fig. 14,
  `aboveground.jpg` (2126 × 1090), is displayed once. Its SHA-256 remains
  `6436499e5f52cec147409352eb9136dc9776a6cc0310ca94dc08722a0021d0f1`.
  The figure retains the system diagram, aboveground observations, SLAM point
  clouds and GPR trajectory, and all four underground radargram/reconstruction
  examples. It has a full-resolution link for small annotations on phones.
  The conceptual system diagram embedded within the published figure is not
  presented as an additional field photograph or a measured accuracy result.
- The existing hero animation is visibly labeled conceptual. The separate
  10.715-second GPR sensing animation is retained as a compact principle
  illustration, with its illustrative-data caption restored. Neither is
  presented as experimental evidence.
- Metrics: accepted-manuscript §4.2.3/Table 6 reports 304 true positives,
  84 false negatives and 12 false positives in 100 randomly selected validation
  reconstructions containing 388 simulated pipelines. Thus precision is
  304/316 = 96.2% and recall is 304/388 = 78.4% (rounded). The page explicitly
  labels these controlled simulated validation results, separate from the
  outdoor demonstration in §4.4/Fig. 14. The optional R² metric is omitted to
  keep the results compact.

Verification sources:

- Publisher/DOI: https://doi.org/10.1016/j.autcon.2023.105004
- University metadata and published abstract:
  https://hub.hku.hk/handle/10722/348177
- Original accepted manuscript, publicly readable mirror (Table 6, Fig. 12,
  §4.4 and Fig. 14):
  https://www.scribd.com/document/898758870/1-s2-0-S0926580523002649-am

The publisher's full-text endpoint returned HTTP 403. The university record
provides no downloadable paper. Therefore numerical context and marker meaning
were checked against the original accepted manuscript available at the mirror;
the published title, authors, journal, year, DOI and abstract were cross-checked
against the university record. No paper PDF or new field photograph was added.
