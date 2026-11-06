# Lunar Construction — dark editorial redesign

Updated only the Lunar Construction page. Unrelated six-page responsive work was left in the working tree.

The page uses a continuous #090D13 background, Noto Sans, off-white headings, muted gray-blue body text, and restrained cyan accents. The full-viewport opening uses fluid, balanced typography and the original research simulation blended with CSS masks. The original image is unchanged; no generated artwork was introduced.

The content grid follows the shared 1200px width and clamp(20px, 3.4vw, 48px) gutters. Lunar's dedicated `lunar-editorial.css` supplies matching defaults independently so publishing this page does not require publishing the unfinished shared refactor. Research sections use generous spacing and subtle dividers. The complete publication metadata remains immediately after the Hero.

Apollo 16 and the conceptual drift animation occupy equal 16:9 stages, with object-fit: contain and black backgrounds. They stack below 701px. All original footage, captions, attribution, scientific image content, and figure enlargement links remain unchanged. The Results chart keeps its 67.1mm and 4.8mm values, original proportional bar lengths, and common 0–70mm scale.

## Review evidence

The six JPEGs in this directory are full-page before/after screenshots at 1920×1080, 960×900, and 390×844 viewports. Baseline screenshots use the uncommitted working-tree Lunar page as received. Video frames are paused around one second for comparison. The full research narrative, paired videos, publication, technical figure, Results chart, and NASA RASSOR footage were visually reviewed.

`verification.json` records browser measurements at 2560, 1920, 1440, 1200, 960, 768, 700, 600, 390, and 320px. A continuous resize of the same document tests every CSS pixel from 1920 through 320 (1,601 widths).

Verified:

- No horizontal scrolling, elements extending beyond the viewport, title/subtitle collisions, broken images, media errors, or JavaScript errors.
- No Hero height jumps above 80px between adjacent viewport widths.
- Equal-width, top-aligned 16:9 video stages and caption positions on desktop; automatic stacking on narrow screens.
- Play/pause for all three videos, reduced-motion startup, and changes to the OS motion preference.
- Original figure opens at full size. All three video fallbacks appear when media requests fail.
- Complete visible research text and media/source-link attributes match the received page. The original image remains byte-for-byte unchanged. Playback controls are retained; an initial network-state check also handles media failures that occur before the deferred script attaches its listeners. Chart percentage widths match the original CSS.
- Theme text contrasts against #090D13: headings 17.15:1, body/captions 9.35:1, cyan accents 12.10:1, supporting Hero copy 11.22:1.

## Repeat the browser verification

Serve the repository root at http://127.0.0.1:8766. With Node 20+ and Playwright installed, run from the repository root:

```sh
node docs/lunar-dark/verify.cjs
```

Set `PLAYWRIGHT_MODULE` to an installed Playwright module path if it is outside the normal Node resolution path. The script uses `/usr/bin/google-chrome`, writes after screenshots and `verification.json` here, and writes additional Hero review images to `/tmp/lunar-dark`. It does not modify application files or publish anything.
