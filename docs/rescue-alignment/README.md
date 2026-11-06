# Rescue page alignment and two-scenario interaction

November 6, 2026. Target: https://wangmmstar.github.io/projects/ground-penetrating-rescue-robots/

Authoritative source: `/data/Webpage/academic-project-astro-template/src/ground-penetrating-rescue-robots/`.
Build with Node 24: `npm run build:ground-penetrating-rescue-robots`.
Astro check: 0 errors, warnings, or hints; isolated production build passed.
Only this route's output is copied to the portfolio. Publication follows the
existing GitHub Pages legacy `main` / root workflow.

Shared outer/text/main-figure limits are 1100/760/900 CSS pixels. All five
sections share heading/paragraph/figure spacing and left alignment. Disaster
and void images are stacked at matching widths, retaining their proportions.
Sensing uses equal 3:2 frames with `object-fit: contain`, stacked on mobile.
The dark laser section remains fourth; its image is left aligned at native
585 × 400 size. Inspection of all embedded media in the original Figures PPT
confirmed there is no larger copy of that scene. The supplied training diagram
is absent from the PPT; its 749 × 451 crop is the highest-resolution supplied
copy. It remains unchanged at the requested 900px maximum display width.

The original lightweight SVG and two scenarios were recovered from
`ba179f3563b41637e3a6f5f3b19911dfc8f23c6a`. Both choices update the question,
response, route, target position/color, hazard highlighting, SVG description,
and `aria-pressed` state. Native buttons support mouse, touch, Enter and Space;
a polite atomic status announces the changed question and response. The
standalone targeted-measurement SVG is no longer rendered. Requested captions,
redundant labels, and standalone research-status paragraph were removed.
Research limitations and attribution are retained in one footer disclosure.

`node scripts/check-rescue-alignment.cjs` (Node 20+; set PLAYWRIGHT_MODULE if
needed) captures and checks 1440, 1024, 768, and 390px. The adjacent full-page,
laser, and both-scenario screenshots were visually inspected. Checks include
shared left edges and widths, equal sensing frames, image proportions, native
laser dimensions, heading/body sizes, consistent spacing, hero text overlay,
no horizontal overflow, map labels within the SVG bounds and at least 13px,
mouse/touch/keyboard switching in both directions, keyboard footer disclosure,
and no browser script or HTTP resource errors. Metrics are in verification.json.
