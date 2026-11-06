// Run against the published static checkout, served with HTTP Range support.
// PLAYWRIGHT_MODULE and CHROME_BIN can select existing local installations.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const output = '.codex-qa/fire-editorial';
const base = process.env.RESPONSIVE_URL || 'http://127.0.0.1:8772';
(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_BIN || '/usr/bin/google-chrome',
    headless: true, args: ['--no-sandbox'],
  });
  const results = [];
  try {
    for (const width of [1920, 1440, 1024, 768, 390, 375, 320]) {
      const context = await browser.newContext({
        viewport: { width, height: width < 700 ? 844 : 1000 },
        isMobile: width < 700, hasTouch: width < 700,
      });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()}: ${r.url()}`); });
      await page.goto(`${base}/projects/fire-investigation/`, { waitUntil: 'networkidle' });
      await page.evaluate(async () => {
        await document.fonts.ready;
        document.querySelectorAll('img').forEach(i => i.loading = 'eager');
        await Promise.all([...document.images].map(i => i.decode()));
      });
      const metrics = await page.evaluate(() => {
        const box = e => {
          const r = e.getBoundingClientRect();
          return { x: r.x, y: r.y, width: r.width, height: r.height, right: r.right, bottom: r.bottom };
        };
        const hero = document.querySelector('.project-hero');
        const image = hero.querySelector('img');
        const whiteSurfaces = [...document.querySelectorAll('body *')].filter(e => {
          if (['IMG', 'VIDEO', 'SCRIPT', 'STYLE'].includes(e.tagName)) return false;
          const s = getComputedStyle(e), rgb = s.backgroundColor.match(/[\d.]+/g)?.map(Number);
          const r = e.getBoundingClientRect();
          return rgb && rgb.slice(0, 3).every(v => v > 210) && (rgb[3] ?? 1) > .8 && r.width > 100 && r.height > 40;
        }).map(e => e.className);
        return {
          width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
          hero: box(hero), image: box(image), imageFit: getComputedStyle(image).objectFit,
          title: box(hero.querySelector('h1')),
          description: box(hero.querySelector('.fire-hero-description')),
          author: box(hero.querySelector('.fire-author')),
          demonstrations: [...document.querySelectorAll('.fire-demonstration')].map(e => ({
            heading: box(e.querySelector('h2')), body: box(e.querySelector('p')), visual: box(e.querySelector('figure')),
          })),
          bodyBackground: getComputedStyle(document.body).backgroundColor,
          sectionColors: [...document.querySelectorAll('h2')].map(e => ({ text: e.textContent.trim(), color: getComputedStyle(e).color })),
          whiteSurfaces,
          mediaStyles: [...document.querySelectorAll('img, video')].map(e => ({ filter: getComputedStyle(e).filter, mask: getComputedStyle(e).maskImage })),
          imagesLoaded: [...document.images].every(i => i.complete && i.naturalWidth > 0),
        };
      });
      assert.equal(metrics.scrollWidth, width, 'No horizontal overflow');
      assert.equal(metrics.hero.x, 0);
      assert.equal(metrics.hero.width, width, 'Full viewport width Hero');
      assert.deepEqual(metrics.image, metrics.hero, 'Photo fills Hero completely');
      assert.equal(metrics.imageFit, 'cover');
      for (const text of [metrics.title, metrics.description, metrics.author]) {
        assert(text.x >= 0 && text.right <= width && text.y >= metrics.hero.y && text.bottom <= metrics.hero.bottom, 'Copy stays on photo');
      }
      for (const demo of metrics.demonstrations) {
        assert(demo.heading.bottom <= demo.body.y && demo.body.bottom < demo.visual.y, 'Copy precedes the demonstration');
        assert(demo.visual.width >= Math.min(980, width - 96), 'Demonstration uses full content width');
      }
      assert.equal(metrics.bodyBackground, 'rgb(11, 13, 18)');
      assert(metrics.sectionColors.every(e => e.color === 'rgb(245, 245, 245)'), 'Section heading contrast');
      assert.deepEqual(metrics.whiteSurfaces, [], 'No accidental white surfaces');
      assert(metrics.mediaStyles.every(s => s.filter === 'none' && s.mask === 'none'), 'No media filters or masks');
      assert(metrics.imagesLoaded, 'Existing images load');
      assert.equal(await page.locator('h1').count(), 1);
      const before = page.locator('[data-scene="before"]');
      const after = page.locator('[data-scene="after"]');
      assert.equal(await before.getAttribute('aria-pressed'), 'true');
      await after.click();
      assert.equal(await after.getAttribute('aria-pressed'), 'true');
      assert.equal(await before.getAttribute('aria-pressed'), 'false');
      assert(await page.locator('#fire-scene-after').isVisible());
      assert(await page.locator('#fire-scene-before').isHidden());
      if (width === 1440 || width === 390) {
        await page.locator('.fire-comparison').screenshot({ path: `${output}/comparison-after-${width}.jpg`, type: 'jpeg', quality: 88 });
      }
      await before.focus();
      await page.keyboard.press('Enter');
      assert.equal(await before.getAttribute('aria-pressed'), 'true', 'Keyboard selector works');
      assert(await page.locator('#fire-scene-before').isVisible());
      assert(await page.locator('#fire-scene-after').isHidden());
      const videos = page.locator('video');
      assert.equal(await videos.count(), 2, 'Both research demonstrations preserved');
      for (const video of await videos.all()) {
        await video.scrollIntoViewIfNeeded();
        await video.evaluate(async v => { v.preload = 'auto'; await v.play(); });
        await page.waitForTimeout(300);
        assert(await video.evaluate(v => v.controls && v.playsInline && !v.paused && v.currentTime > 0 && !v.error), 'Video plays with native controls');
        await video.evaluate(v => { v.pause(); v.currentTime = 2; });
        await page.waitForFunction(src => {
          const v = [...document.querySelectorAll('video')].find(v => v.src === src);
          return !v.seeking && Math.abs(v.currentTime - 2) < .1;
        }, await video.getAttribute('src').then(src => new URL(src, base).href));
        // Restore the original poster after exercising playback and seeking.
        await video.evaluate(v => { v.preload = 'none'; v.load(); });
      }
      await page.evaluate(() => { document.activeElement?.blur(); scrollTo(0, 0); });
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: `${output}/viewport-${width}.jpg`, type: 'jpeg', quality: 90 });
      await page.locator('.project-hero').screenshot({ path: `${output}/hero-${width}.jpg`, type: 'jpeg', quality: 92 });
      await page.screenshot({ path: `${output}/full-page-${width}.jpg`, type: 'jpeg', quality: 85, fullPage: true });
      assert.deepEqual(errors, [], 'No browser or HTTP errors');
      results.push({ ...metrics, browserErrors: errors });
      console.log(`${width}px: hero, dark surfaces, overflow, comparison, keyboard and video checks passed`);
      await context.close();
    }
    // Progressive enhancement: both scene images remain available without JS.
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(`${base}/projects/fire-investigation/`);
    assert(await page.locator('#fire-scene-before').isVisible());
    assert(await page.locator('#fire-scene-after').isVisible());
    assert(await page.locator('.fire-scene-controls').isHidden());
    await context.close();
    fs.writeFileSync(`${output}/verification.json`, JSON.stringify(results, null, 2) + '\n');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exit(1); });
