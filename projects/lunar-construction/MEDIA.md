# Lunar Construction media

All inputs were supplied in `C:\Users\mwang5\OneDrive - University of Florida\PhD-Career\Storytelling\Lunar`. Published media follow this page's existing `projects/lunar-construction/media/` convention beneath its project directory.

| Published filename | Supplied input | Source and treatment |
| --- | --- | --- |
| `lunar-simulation-scene.png` | `scene.png` | Research simulation supplied by Mengjun Wang; copied unchanged, including its original labels. |
| `projected-landmarks-overview.png` | `overview.png` | Complete research Offline / Online workflow supplied by Mengjun Wang; copied unchanged. |
| `apollo16-rover.mp4` | `Ap16_rover.ogv` | [NASA Apollo 16, 1972, via Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Ap16_rover.ogv). Converted to H.264 MP4 with user authorization after the original Theora video failed browser playback. Full 15.066-second duration and 960 × 720 image retained; no crop, audio, or added frames. |
| `lunar-localization-problem.mp4` | `lunar_localization_problem.mp4` | Supplied conceptual localization animation; copied unchanged. Not Apollo mission data or measured results. |
| `rassor-excavation.mp4` | `rossover.mp4` | Supplied prepared NASA RASSOR clip; copied unchanged (10.667 seconds). [Original NASA source, via Wikimedia Commons](https://commons.wikimedia.org/wiki/File:RASSOR_Excavation_Testing_Timelapse_(KSC-20250616-RV-FMX01-WON-M14153).webm). Earth-based testing with regolith simulant, not a demonstration of the localization method. |

`terrain.jpg`, old AI-generated artwork, the previous Earth construction timelapse, and physical validation results are not referenced by the updated page. Old project assets remain in place.

## Repository structure

This repository contains published Astro output, including the existing `index.html` and `_astro/` assets. It does not contain `package.json`, an Astro configuration, or `.astro` source files. The update therefore edits the existing published page, with project-local `lunar.css` and `lunar-media.js`; it introduces no framework, dependencies, or shared-style changes. An Astro install/build cannot be run from this repository. The original source project would be needed to reproduce an Astro build.

The upstream page contained no Paper URL. Its paper title, authors, affiliations, journal, year, and footer are preserved; no publication or repository link has been invented.

## Video Hero replacement

The current Hero uses `lunar-localization-hero.mp4` and `lunar-localization-hero-poster.jpg` in the same existing public media directory. The MP4 is a 13.18 MB H.264 High encode of `/home/mwang5/Videos/Screencasts/lunar_localization.webm`; the source recording is unchanged. All 435 frames are retained with their variable timing, plus a single padding pixel at the right and bottom for even 1856 × 1016 dimensions. The poster is extracted at 10 seconds. The previous simulation image remains available as an unchanged asset.

The page-local `lunar-hero.css` overrides the shared Hero layout only on this page. The existing `lunar-media.js` motion control also handles the Hero, while reduced motion always uses its poster. See [verification and encoding details](../../docs/lunar-video-hero/README.md) for screenshots, playback checks, and the unavailable Astro build result.

The unified academic Hero now contains the main heading, paper title, authors and journal/year together over the video, following BIM-Laser’s hierarchy. The introductory subtitle and separate below-video paper block are removed. Both original affiliations are accessible through an expandable disclosure inside the Hero. Research sections and demonstration media are unchanged.
