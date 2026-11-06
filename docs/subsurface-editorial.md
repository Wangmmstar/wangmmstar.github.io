# Subsurface editorial revision — 2026-11-06

The page now follows the requested sequence: GPR measurements → subsurface
permittivity reconstruction → pipe positions referenced to a reconstructed site.
The revision preserves the existing site typography, colors, full-width animated
hero, mobile text overlay, and video playback logic. The only new stylesheet is
`projects/subsurface/subsurface-editorial.css`, scoped to this page. Shared
styles and other project pages are outside this revision.

## Text and structure

All requested replacement paragraphs and captions are used verbatim. Replaced
opening and section headings:

| Previous | Replacement |
| --- | --- |
| Subsurface Intelligence / Mapping what lies beneath. | How can we map buried pipes without digging? |
| We need to know what’s buried before we dig. | GPR records reflections, not a map. |
| What is buried? / Reading the radar. | From radar reflections to buried pipes. |
| Where was it detected? / Putting the detection on the map. | Locating buried pipes on the site. |
| What we demonstrated. | What the experiments showed. |
| Where this research could go next. | Toward infrastructure-aware construction. |

The hero subtitle and problem, inversion, spatial mapping, outdoor demonstration,
and future-research paragraphs match the supplied request. Publication metadata
now appears in a compact block near the bottom, with the exact published title,
all four authors, journal, volume, article number, year, linked DOI and contact
email. The browser title and social description match the revised opening.
Section headings, prose and figures stack vertically; only the two comparison
plots sit beside one another on desktop and stack on phones.

## Selected figures and evidence

- **Fig. 12(a), real-data case 1:** complete existing
  `panels/real-radargram.png` and `panels/real-prediction-depth.png`. These are
  exact RGBA pixel matches to the original `real.png` at x=0–670 and
  x=1469–2249, both using the full y=0–640. The pair is from the same experiment.
  Captions are “Measured GPR radargram” and “Reconstructed subsurface
  permittivity (depth domain)”. No axes, scales or reference markers are removed.
  The small note correctly identifies the orange circles as actual reference
  pipe locations, consistent with the manuscript's Fig. 12 caption.
- **Fig. 14, pipeline geo-registration process:** complete `aboveground.jpg`,
  displayed once in the spatial mapping section. It includes the system diagram,
  aboveground camera/depth observations, SLAM point clouds and GPR trajectory,
  and all four field radargram/reconstruction pairs. The existing JPEG is
  byte-identical to the author-supplied original (SHA-256 in ATTRIBUTION.md).
  All research images link to their full-resolution originals; Fig. 14 also has
  an explicit full-resolution link for reading small labels on mobile.
- **Hero:** unchanged existing conceptual animation and poster, now visibly
  labeled “Conceptual animation”.
- **Sensing explainer:** unchanged supplied 10.715-second principle animation,
  distinct from the hero, with controls, caption track, and a visible caption
  distinguishing illustrative radargram formation from experimental data.
- **Controlled detection evaluation:** 96.2% precision and 78.4% recall retained
  after verification in the original accepted manuscript, §4.2.3/Table 6.
  The evaluation used 100 randomly selected simulated validation reconstructions,
  388 pipes, 304 true positives, 84 false negatives and 12 false positives.
  The page labels the evaluation context and separates it from the outdoor field
  demonstration. R²=0.957 is omitted to keep the results compact.

## Removed from the visible page

- The three-stage interactive slider, its controls, event-handler script and
  no-JavaScript three-stage explanation.
- The intermediate time-domain permittivity plot and repeated stage exposition.
- The conceptual site composite `hero_utility_map.png`, replaced by full Fig. 14.
- The three speculative future cards and their three concept images, including
  the buried-pipe-as-robot-landmark proposal.
- The standalone collaboration section, generic collaboration-topic paragraph
  and repeated Subsurface Intelligence label.
- The large opening publication block, replaced by a compact closing citation.

No source media was deleted or modified. No extra stock media, generated
research visualization, field localization accuracy, absolute positioning claim,
real-time claim, implemented robotic capability, or additional summary card was
introduced. The integrated field figure is not repeated in Results.

## Source verification and limits

Published metadata and abstract were verified at the
[University of Hong Kong record](https://hub.hku.hk/handle/10722/348177).
Numerical evaluation context, reference markers and field-study description were
verified in the
[original accepted manuscript mirror](https://www.scribd.com/document/898758870/1-s2-0-S0926580523002649-am),
specifically §4.2.3/Table 6, §4.3/Fig. 12 and §4.4/Fig. 14. Figure placement and
original asset provenance are detailed in
`projects/subsurface/assets/subsurface/ATTRIBUTION.md`.

The publisher full-text endpoint returned HTTP 403, and the university record has
no downloadable PDF. Final published full-text access was therefore unavailable;
the original accepted manuscript supplies the detailed evidence. No separate
verified field photograph was available, so the complete integrated Fig. 14
supports the field description without a duplicate figure in Results.

## Validation

- Pulled the latest `main` over HTTPS before editing; it was already up to date
  at `e1e3d80`. The configured SSH key was unavailable.
- This checkout contains published static HTML/assets, with no package manifest
  or source build pipeline. Validated the deployable HTML/CSS directly using a
  local static HTTP server and Chrome/Playwright.
- All twelve explicitly labeled supplied text replacements and the remaining
  results heading and figure captions were checked against the request.
- Desktop/mobile layouts passed at 320, 390, 600, 768, 1024, 1440 and 1920 pixels.
  Verified hero text stays within the hero, text/actions do not overlap its
  controls, plot aspect ratios are intact, and there is no horizontal overflow.
- Inspected full-page desktop and mobile screenshots. Scientific plots preserve
  complete annotations. The complete field figure opens at original resolution.
- All referenced local assets and fragment links passed; all four images decoded.
  No HTTP resource failures or JavaScript errors occurred.
- Hero play/pause, reduced-motion behavior for both videos and no-JavaScript
  figure visibility passed. Original playback code and template credits remain
  identical to the pre-revision page.
- One-off scripts, screenshots and detailed measurement JSON remain under the
  existing untracked `.codex-qa/` directory and are excluded from the commit.
- An unrelated concurrent change to `projects/bim-laser/index.html` was observed
  during validation and is excluded from this revision.
