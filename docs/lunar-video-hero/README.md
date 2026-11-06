# Lunar Construction video Hero verification

The Hero now uses the supplied lunar localization recording with the existing title and subtitle over its sky. The headline group is horizontally centered at every width, and the subtitle uses font weight 700. Only the Lunar page loads `lunar-hero.css`. The media covers the entire Hero with no side margins, feathering, or blurred extension. The phone crop favors the projected landmarks and worker; the full recording remains in the asset. The existing motion control also pauses the Hero.

## Optimized media

- Source: `/home/mwang5/Videos/Screencasts/lunar_localization.webm`, 57,197,096 bytes. Original unchanged; SHA-256 `7e184a06037e31b4ddbe3c65dc73e9e3e20e0c43c26edfa1bec3ed096150f4d6`.
- Delivery: `lunar-localization-hero.mp4`, **13,178,305 bytes (13.18 MB / 12.57 MiB)**; H.264 High, level 4.1, `yuv420p`, fast-start MP4, no audio.
- 1856 × 1016: the original 1855 × 1015 image is retained with one padding pixel on the right and bottom for H.264 compatibility. All 435 source frames and their variable timing are retained; output duration 14.564 seconds (including final frame duration).
- CRF 21, slow preset. Frame-aligned FFmpeg SSIM comparison with the decoded original: **0.988089**. Source and compressed frames were also inspected visually.
- Poster: JPEG extracted at 10 seconds, used both as the video poster and a CSS background. Reduced motion hides and pauses the video, and its source media query prevents downloading it in the tested browser. Runtime preference changes were tested in both directions.
- WebM is omitted because the supplied VP8 recording is much larger; H.264 provides the requested compatible delivery source.

Encoding command (output path abbreviated):

```sh
ffmpeg -i /home/mwang5/Videos/Screencasts/lunar_localization.webm \
  -vf 'pad=ceil(iw/2)*2:ceil(ih/2)*2,setpts=PTS-STARTPTS' \
  -c:v libx264 -preset slow -crf 21 -profile:v high -level:v 4.1 \
  -pix_fmt yuv420p -fps_mode vfr -enc_time_base 1:1000 \
  -video_track_timescale 1000 -movflags +faststart -an lunar-localization-hero.mp4
```

## Browser and visual checks

Passed at **1440, 1024, 768, 390, and 375 CSS pixels** in installed Chrome. The two phone widths use mobile/touch emulation. Screenshots at every requested width were inspected, including beginning, middle, and end frames at desktop and phone sizes. All text remains inside the video; the foreground landmarks stay below the text; the next section begins directly after the Hero. No horizontal overflow or script errors occurred. Laptop text was lifted into the sky after visual inspection, and the phone crop was moved left to retain the localization activity.

The browser checks cover:

- Full viewport width and full Hero height, with text containment and no horizontal overflow.
- Muted autoplay with inline playback; playback time advancing on desktop and emulated phones.
- Looping, and the existing motion control pausing/resuming the Hero and demonstrations.
- The reduced-motion poster without a Hero-video request, plus runtime preference changes.
- Exact adjacency of the unchanged paper metadata section.

[Desktop Hero](hero-1440.jpg), [laptop Hero](hero-1024.jpg), [tablet Hero](hero-768.jpg), [390px Hero](hero-390.jpg), [375px Hero](hero-375.jpg), [mobile reduced motion](reduced-motion-390.jpg). `viewport-*.jpg` includes the start of the following section; `hero-*-time-*.jpg` samples camera motion. Numeric results are in `verification.json`.

Other research pages passed desktop/phone smoke checks. `scripts/validate-research.py` passed for all six pages. The Lunar HTML after `</header>` is byte-for-byte identical to pre-change commit `a3badb9`. Existing videos, figures, captions, paper metadata, narrative sections, shared CSS, and other project pages were not edited. `git diff --check` passed.

These checks use Chrome mobile emulation, not physical iOS/Android hardware or Safari.

To repeat, serve the repository with HTTP byte-range support (needed for accurate video seeking), then run with Node 20+ and Playwright:

```sh
RESPONSIVE_URL=http://127.0.0.1:8771 node scripts/check-lunar-hero.cjs
python3 scripts/validate-research.py
git diff --check
```

`PLAYWRIGHT_MODULE` and `CHROME_BIN` can select an existing Playwright installation and browser. The verification here used the installed Codex Node runtime and `/usr/bin/google-chrome`.

## Production build result

`npm run build` was attempted and returned **ENOENT: package.json missing**. This GitHub Pages repository contains published Astro output, with no `package.json`, Astro configuration, or `.astro` sources. An Astro build cannot be reproduced from this checkout. The static production HTML/CSS/JS/media were served locally and validated directly; generated `_astro` assets remain unchanged. An upstream Astro rebuild must port the page-local Hero markup, stylesheet, and motion handling into its source project.
