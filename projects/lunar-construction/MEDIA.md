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
