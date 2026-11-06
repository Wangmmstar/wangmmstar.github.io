# Fire Investigation editorial reduction

November 6, 2026. Replaces the previous long narrative with the supplied English copy: hero, problem, scene comparison, evidence annotation, hypothesis exploration, investigation record, and future research.

The original post-fire hero image, both scene images, both videos and posters, scene-toggle script, accessibility labels, and footer attribution links are retained. No authentic investigation-history screenshot was present among this project's media; the record section is text-only. All design changes are scoped to Fire Investigation in `fire-theme.css`; shared styles and other project pages are unchanged.

## Verification

- `node scripts/validate-fire-editorial.cjs`: exact headings/body text, section order, concise controls/captions, removal of ornamental components, unchanged video markup/toggle script/footer, local asset paths, unique IDs, and valid fragment links.
- `node scripts/check-fire-dark-theme.cjs`: Chrome checks at 1920, 1440, 1024, 768, 390, 375, and 320 CSS pixels. Hero copy stays inside the full-width scene image; no horizontal overflow, light surfaces, failed assets, or browser errors. Text precedes each full-width demonstration. Both scene states work with pointer and keyboard; videos play and seek with native controls. Both images remain visible without JavaScript.
- Desktop and mobile full-page screenshots were visually reviewed. Screenshots and measured results are local QA artifacts under `.codex-qa/fire-editorial/`.
- `git diff --check`.

This checkout contains production static HTML/CSS rather than Astro source or a package/build manifest. Serve the repository root with HTTP byte-range support; the browser script defaults to port 8772 (`RESPONSIVE_URL` overrides it). Set `PLAYWRIGHT_MODULE` and `CHROME_BIN` to existing installations if needed. Publishing continues through GitHub Pages from the root of `main`.

The older `docs/fire-dark-theme/` captures document the previous design. The historical all-page `validate-research.py` enforces the original prose and is not the validator for this explicitly requested copy replacement.
