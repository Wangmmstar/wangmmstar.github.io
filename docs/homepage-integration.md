# Homepage research integration — October 26, 2026

The user authorized publication after the local integration was completed. This report records the implementation and prepublication verification; the public 404 results below describe the state before publication.
The existing biography, news, CV, profile links, Teaching & Mentoring, and Misc. markup was compared with HEAD and is unchanged. theme.js and the existing four research articles are unchanged. No dependencies were added. The centered 800px layout, typography, blue links, theme toggle, and 160px thumbnails are preserved.

## Final research order

Selected Research:
1. Robotic Alignment of Construction Components via a BIM-to-Workface Projection Interface
2. BIM-driven laser spatial augmented reality for in-situ layout and assembly
3. Robotic localization via active projected fiducials for space construction
4. Underground infrastructure detection and localization using deep learning enabled radargram inversion and vision-based mapping
5. Interactive Fire Investigation Training through Simulation

Collaborative Research:
1. Autonomous Robotic Disinfection — contributions to selected collaborative studies.
2. Disaster Reconnaissance and Damage Assessment — contribution to an earlier technical report.

Related Lab Research (compact, text only): Augmented Reality for Post-Disaster Void Exploration — explicitly described as research led by lab collaborators.

## Thumbnail provenance

All sources are genuine existing project assets under `/data/Webpage/academic-project-astro-template/public/`. Originals were left unchanged. All thumbnails display at 160px wide with automatic height, preserving aspect ratio; no CSS crop, stretch, or fixed-height frame is applied.

- Fire: `projects/fire-investigation/postfire_scene.png` → `/home/mwang5/Desktop/wangmmstar.github.io/images/fire-investigation.jpg`. The actual hero scene makes the investigation environment recognizable without the tiny labels in the evidence-annotation screenshot. Full frame retained; resized from 1585×790 to 480×239; optimized JPEG quality 88 (41,316 bytes).
- Disinfection: `projects/disinfection-robot/robot-real.png` → `/home/mwang5/Desktop/wangmmstar.github.io/images/disinfection-robot.jpg`. Uses the physical robot experiment rather than the concept-rendered hero. The left photograph was selected from the two-photo figure with crop bounds (0, 0, 640, 532), excluding the second photograph and center divider, then resized to 480×399; optimized JPEG quality 88 (30,942 bytes). No scientific labels or results were altered.
- Disaster: `assets/disaster-reconnaissance/problem-aerial.jpg` → `/home/mwang5/Desktop/wangmmstar.github.io/images/disaster-reconnaissance.jpg`. A recognizable community-scale aerial tornado scene is clearer at 160px than the hero's detection boxes and tiny labels. Full frame retained; resized from 565×414 to 480×352; optimized JPEG quality 88 (71,323 bytes). Original project caption credits NWS/NOAA; that credit is retained in thumbnail alt text and the project page.
- Void AR: no homepage image.

## Routes and publication status

Each route was verified against Astro configuration, built with its actual PROJECT_PAGE target, copied into its own previously absent directory in the homepage checkout, opened through the homepage link, and verified over local HTTP (200):

- Fire: https://wangmmstar.github.io/projects/fire-investigation/ — local `/projects/fire-investigation/`; public 404 at verification.
- Disinfection: https://wangmmstar.github.io/projects/disinfection-robot/ — local `/projects/disinfection-robot/`; public 404 at verification.
- Disaster: https://wangmmstar.github.io/projects/disaster-reconnaissance/ — local `/projects/disaster-reconnaissance/`; public 404 at verification.
- Void AR: https://wangmmstar.github.io/projects/see-through-rubble/ — local `/projects/see-through-rubble/`; public 404 at verification.

The public homepage is already hosted by GitHub Pages. Publishing requires reviewing, committing, and pushing the homepage, thumbnails, and all four generated project folders together through the existing repository workflow. The initial task prohibited an automatic push; the user subsequently authorized publication. The homepage, thumbnails, and generated project folders are being published together to avoid broken route targets. Deployment confirmation is provided in the chat after checking GitHub Pages and the public URLs.

## Build and integration

The existing source is `/data/Webpage/academic-project-astro-template/`. Its README and `deploy-to-personal-site.sh` document the static-build procedure: Node.js 24+, `PROJECT_PAGE=<target> npm run build`, then copy the contents of dist into `projects/<target>/` in the personal site. The helper does not commit or push.

For this integration, the bundled Node 24.22.1 runtime was used. `npm run check` passed across 47 files with 0 errors, 0 warnings, and one pre-existing unused `parentHandler` hint. All four Astro production builds passed. Each build used an isolated ignored `.astro/homepage-integration/<target>/` output on the source filesystem, leaving the existing dist outputs untouched. Astro cannot rename generated files across filesystems, so /tmp was unsuitable as an output directory.

Copied each generated index.html, favicon, _astro assets, available _fonts assets, and the corresponding public project's media subtree. Unrelated public project/media directories were omitted. All copied files are byte-for-byte build output; source project pages were not rewritten. The four existing project directories and homepage assets were not overwritten. The existing .nojekyll preserves serving of underscored Astro asset directories.

## Academic attribution

Fire has no fabricated publication, authors, or funding leadership claims on the homepage. Disinfection's Paper link specifically identifies “Object detection in hospital facilities: A comprehensive dataset and performance evaluation” in its accessible label. DOI registry metadata for https://doi.org/10.1016/j.engappai.2023.106223 verifies Da Hu, Shuai Li, and Mengjun Wang as authors. The publisher page is https://www.sciencedirect.com/science/article/pii/S0952197623004074 (indexed and identified; direct automated fetching can receive 403).

No reliable technical-report title or URL was identified for the earlier disaster contribution; no Report link was invented. The later journal paper shown on the existing disaster project page is not presented as Mengjun Wang's publication on the homepage. Void AR is explicitly lab-led related research.

Separate attribution review note: the existing Fire project page lists Mengjun Wang alone in its author header and uses “Research by Mengjun Wang” in metadata. This does not establish leadership of the whole funded program. Review whether that project page should additionally credit the broader lab/program team. It was preserved unchanged in accordance with the requested scope. The existing disaster and Void AR pages retain their collaborator author lists.

## Verification

- 1440×1000, 768×1000, and 390×1000 CSS viewports, each in light and dark themes: no horizontal overflow, every homepage image loaded, all seven thumbnails 160px wide, natural title wrapping, and text-only Related Lab Research.
- Screenshots were visually inspected at desktop and mobile sizes. Collaboration entries use fewer text lines and tighter spacing; related work uses 14px text and a secondary heading.
- Theme button toggles both directions, updates its accessible label, and persists the selected theme across reload.
- News archive expands and collapses. CV and homepage resources resolve locally.
- All four new project links were clicked and opened the correct generated page.
- 408 local HTTP resource checks passed (200), including all four routes, the three new thumbnails, every copied static file, homepage, stylesheet, script, and CV.
- Static HTML/CSS/JS asset-reference inspection found no missing files in the four generated project pages.
- `git diff --check` passed.
- Project scripts and media were copied unchanged to preserve the existing interactions.

## Files and evidence

The exact changed/added repository paths are in `homepage-integration-files.txt` next to this report, including every generated asset. The generated-project SHA-256 manifest is in `generated-project-manifest.json` in the evidence directory.

Evidence directory: `/home/mwang5/.codex/visualizations/2026/10/26/01a1789e-bf40-7b72-b43c-ca684cae0304/homepage-verification/`.

- `research-1440-light.jpg`, `research-1440-dark.jpg`: all research entries at desktop size.
- `research-768-light.jpg`, `research-768-dark.jpg`: tablet research screenshots.
- `research-390-light.jpg`, `research-390-dark.jpg`: all research entries at mobile size.
- `homepage-<width>-<theme>-full.jpg`: complete homepage screenshots for all six combinations.
- `responsive-results.json`: observed viewport/layout/image/theme results.
- `local-http-checks.json`: all 408 HTTP results.
- `project-asset-check.json`: generated-page asset-reference results.
