const { chromium } = require(process.env.PLAYWRIGHT_MODULE || '/home/mwang5/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.env.QA_URL || 'http://127.0.0.1:8793';
const output = process.env.QA_OUTPUT || 'docs/rescue-alignment';
const cases = {
 connection: { question: 'Are these two hidden voids connected?', response: 'Prioritize a measurement near the uncertain connection.', marker: 'translate(248 242)' },
 avoid: { question: 'Can the robot investigate without entering the hazardous area?', response: 'Exclude the hazardous region and seek an alternative accessible scanning position.', marker: 'translate(118 210)' }
};
(async () => {
 fs.mkdirSync(output, { recursive: true });
 const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
 const results = [];
 try {
  for (const width of [1440, 1024, 768, 390]) {
   const context = await browser.newContext({ viewport: { width, height: 1000 }, hasTouch: true });
   const page = await context.newPage();
   const errors = [];
   page.on('pageerror', e => errors.push(e.message));
   page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
   await page.goto(`${base}/projects/ground-penetrating-rescue-robots/`, { waitUntil: 'networkidle' });
   await page.evaluate(async () => {
    document.querySelectorAll('img').forEach(im => im.loading = 'eager');
    await Promise.all([...document.images].map(im => im.decode()));
    await document.fonts.ready;
   });
   assert.deepEqual(await page.locator('main > section').evaluateAll(es => es.map(e => e.id || e.className)), ['hero', 'challenge', 'sensing', 'inference', 'laser-guidance', 'follow-up']);
   assert.equal(await page.locator('#follow-up h2').innerText(), 'What should the robot investigate next?');
   assert.equal(await page.locator('#follow-up .section-intro p').innerText(), 'Rescuers may need to answer different questions as new evidence emerges. They can identify what matters next, while the robot selects an appropriate follow-up measurement.');
   assert.equal(await page.locator('button').count(), 2);
   assert.equal(await page.locator('h3,.eyebrow,.research-status,.response-label,.follow-up-figure').count(), 0);
   assert.equal(await page.locator('main img[src$="uncertainty_targeted_measurement.svg"]').count(), 0);
   assert.equal(await page.locator('main figure figcaption:not(.map-legend)').count(), 0);
   const metrics = await page.evaluate(() => {
    const box = e => { const r = e.getBoundingClientRect(); return { x: r.x, y: r.y + scrollY, w: r.width, h: r.height, right: r.right, bottom: r.bottom + scrollY }; };
    const hero = document.querySelector('.hero');
    return { width: innerWidth, scrollWidth: document.documentElement.scrollWidth, wrap: box(document.querySelector('.wrap')), hero: box(hero), heroImage: box(hero.querySelector('img')), heroText: [...hero.querySelectorAll('h1,p')].map(box), h1: parseFloat(getComputedStyle(document.querySelector('h1')).fontSize), sections: [...document.querySelectorAll('.section,.laser-section')].map(e => ({ heading: box(e.querySelector('h2')), text: box(e.querySelector('.section-intro')), paragraph: box(e.querySelector('.section-intro p')), figure: box(e.querySelector('figure')), h2: parseFloat(getComputedStyle(e.querySelector('h2')).fontSize), body: parseFloat(getComputedStyle(e.querySelector('.section-intro p')).fontSize), gap: parseFloat(getComputedStyle(e.querySelector('.section-intro')).marginBottom), copyGap: parseFloat(getComputedStyle(e.querySelector('.section-intro p')).marginTop), padding: getComputedStyle(e).paddingBlock })), images: [...document.querySelectorAll('main img')].map(im => ({ name: im.src.split('/').pop(), ...box(im), naturalWidth: im.naturalWidth, naturalHeight: im.naturalHeight, fit: getComputedStyle(im).objectFit })), sensors: [...document.querySelectorAll('.sensor-pair figure')].map(box) };
   });
   assert.equal(metrics.scrollWidth, width);
   assert(metrics.wrap.w <= 1100);
   assert.deepEqual(metrics.hero, metrics.heroImage);
   for (const t of metrics.heroText) assert(t.x >= 0 && t.right <= width && t.y >= 0 && t.bottom <= metrics.hero.bottom);
   assert(metrics.h1 >= (width < 600 ? 40 : 64) && metrics.h1 <= (width < 600 ? 48 : 80));
   for (const s of metrics.sections) {
    assert.equal(s.heading.x, metrics.wrap.x); assert.equal(s.paragraph.x, metrics.wrap.x); assert.equal(s.figure.x, metrics.wrap.x);
    assert(s.text.w <= 760); assert(s.figure.w <= 900);
    assert(s.heading.bottom < s.paragraph.y && s.paragraph.bottom < s.figure.y);
    assert(s.h2 >= (width < 600 ? 28 : 38) && s.h2 <= (width < 600 ? 32 : 42));
    assert.equal(s.body, width < 600 ? 16 : 18);
    assert.equal(s.gap, metrics.sections[0].gap); assert.equal(s.copyGap, metrics.sections[0].copyGap); assert.equal(s.padding, metrics.sections[0].padding);
   }
   const disaster = metrics.images[1], diagram = metrics.images[2];
   assert.equal(disaster.w, Math.min(900, metrics.wrap.w)); assert.equal(disaster.w, diagram.w); assert.equal(disaster.x, diagram.x);
   for (const im of metrics.images.filter(im => !['hero_belief_concept.webp','robot_drone_gpr.webp','gpr_waveform.webp'].includes(im.name))) assert(Math.abs(im.w / im.h - im.naturalWidth / im.naturalHeight) < .01);
   assert.equal(metrics.sensors[0].w, metrics.sensors[1].w); assert.equal(metrics.sensors[0].h, metrics.sensors[1].h);
   for (const im of metrics.images.filter(im => ['robot_drone_gpr.webp','gpr_waveform.webp'].includes(im.name))) assert.equal(im.fit, 'contain');
   assert(metrics.images.find(im => im.name === 'robot_laser_ar.webp').w <= 585);
   const states = [];
   async function verifyState(intent) {
    const expected = cases[intent];
    assert.equal(await page.locator(`[data-intent="${intent}"]`).getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('[data-intent][aria-pressed="true"]').count(), 1);
    assert.equal(await page.locator('#rescue-map').getAttribute('data-selection'), intent);
    assert.equal(await page.locator('#measurement-marker').getAttribute('transform'), expected.marker);
    assert.equal(await page.locator('#investigation-question').innerText(), expected.question);
    assert.equal(await page.locator('#sensing-response').innerText(), expected.response);
    const state = await page.evaluate(intent => {
     const svg = document.querySelector('#rescue-map'), map = svg.getBoundingClientRect();
     const route = svg.querySelector(`[data-map-state="${intent}"] .sensing-route`);
     const labels = [...svg.querySelectorAll('text')].map(t => { const r = t.getBoundingClientRect(); return { text: t.textContent.trim(), left: r.left, right: r.right, top: r.top, bottom: r.bottom, size: parseFloat(getComputedStyle(t).fontSize) * map.width / 480 }; });
     return { route: route.getAttribute('d'), routeDisplay: getComputedStyle(route.parentElement).display, markerColor: getComputedStyle(document.querySelector('#measurement-marker')).stroke, hazardOpacity: getComputedStyle(svg.querySelector('.hazard-area')).fillOpacity, labels, map: { left: map.left, right: map.right, top: map.top, bottom: map.bottom }, status: document.querySelector('[role="status"]').getAttribute('aria-live'), description: svg.querySelector('desc').textContent.trim() };
    }, intent);
    assert.notEqual(state.routeDisplay, 'none'); assert.equal(state.status, 'polite');
    for (const l of state.labels) { assert(l.left >= state.map.left && l.right <= state.map.right && l.top >= state.map.top && l.bottom <= state.map.bottom, `${l.text} is inside map`); assert(l.size >= 13); }
    states.push({ intent, ...state });
   }
   await verifyState('connection');
   await page.locator('[data-intent="avoid"]').click(); await verifyState('avoid');
   await page.locator('#follow-up').screenshot({ path: `${output}/avoid-${width}.jpg`, type: 'jpeg', quality: 90 });
   await page.locator('[data-intent="connection"]').tap(); await verifyState('connection');
   await page.locator('[data-intent="avoid"]').focus(); await page.keyboard.press('Enter'); await verifyState('avoid');
   await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Space'); await verifyState('connection');
   assert.notEqual(states[0].route, states[1].route); assert.notEqual(states[0].markerColor, states[1].markerColor); assert(Number(states[1].hazardOpacity) > Number(states[0].hazardOpacity)); assert.notEqual(states[0].description, states[1].description);
   await page.locator('#follow-up').screenshot({ path: `${output}/connection-${width}.jpg`, type: 'jpeg', quality: 90 });
   await page.evaluate(() => scrollTo(0, 0));
   await page.screenshot({ path: `${output}/full-${width}.jpg`, fullPage: true, type: 'jpeg', quality: 85 });
   await page.locator('#laser-guidance').screenshot({ path: `${output}/laser-${width}.jpg`, type: 'jpeg', quality: 90 });
   await page.locator('summary').focus(); await page.keyboard.press('Enter'); assert(await page.locator('details').evaluate(e => e.open));
   assert.deepEqual(errors, []);
   results.push({ ...metrics, states, errors });
   await context.close();
  }
  fs.writeFileSync(`${output}/verification.json`, JSON.stringify({ base, results }, null, 2) + '\n');
  console.log('PASS: 1440/1024/768/390 screenshots, aligned columns, equal sensing frames, native laser size, hero overlay, unclipped map labels, mouse/touch/keyboard scenario switching, live status, no script or resource errors.');
 } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exit(1); });
