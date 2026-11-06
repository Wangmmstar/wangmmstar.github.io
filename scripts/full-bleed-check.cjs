/* Run with Node and Playwright. See RESPONSIVE_AUDIT.md for setup and modes. */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.RESPONSIVE_URL || 'http://127.0.0.1:8766';
const stage = process.argv[2] || 'after';
const output = path.resolve('docs/full-bleed');
const allSites = ['mobile-sar-copilot', 'bim2workface', 'bim-laser', 'lunar-construction', 'subsurface', 'fire-investigation'];
const sites = process.env.RESPONSIVE_SITES ? process.env.RESPONSIVE_SITES.split(',') : allSites;
assert(sites.every(s=>allSites.includes(s)), 'Unknown responsive site');
const viewports = [[2560,1440],[1920,1080],[1620,1000],[1440,900],[1200,800],[960,900],[768,1024],[600,900],[390,844],[320,700]];
const priorFile=path.join(output, `${stage}-metrics.json`);
const prior=process.env.RESPONSIVE_SITES && fs.existsSync(priorFile) ? JSON.parse(fs.readFileSync(priorFile,'utf8')) : {};
const retain=items=>(items||[]).filter(x=>!sites.includes(x.site));
const report = { stage, viewports: retain(prior.viewports), sweeps: retain(prior.sweeps), errors: retain(prior.errors) };
fs.mkdirSync(output, {recursive:true});

async function settle(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    // Trigger lazy images and hydrated components throughout the complete page.
    for (let y = 0; y < document.body.scrollHeight; y += 700) { scrollTo(0,y); await new Promise(r=>setTimeout(r,25)); }
    scrollTo(0,0);
    await Promise.race([
      Promise.all([...document.images].map(i=>i.decode().catch(()=>{}))),
      new Promise(r=>setTimeout(r,3000))
    ]);
  });
  await page.waitForTimeout(200);
}
async function metrics(page) {
  return page.evaluate(() => {
    const visible = e => e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().height > 0;
    const box = e => { const r = e.getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height}; };
    const h = document.querySelector('h1');
    const hero = h.closest('header');
    return {
      width:innerWidth, clientWidth:document.documentElement.clientWidth, layoutWidth:document.body.getBoundingClientRect().width, height:innerHeight, scrollWidth:document.documentElement.scrollWidth,
      hero:box(hero), title:box(h), titleSize:getComputedStyle(h).fontSize,
      primary: [...document.querySelectorAll('.hero-media-primary img,.hero-media-primary video')].map(e=>({ ...box(e), fit:getComputedStyle(e).objectFit })),
      publication:[...document.querySelectorAll('.hero-byline,.lunar-paper,.ss-publication')].map(box),
      brokenImages:[...document.images].filter(i=>visible(i)&&i.complete&&!i.naturalWidth).map(i=>i.src),
      overflow:[...document.querySelectorAll('main *')].filter(e=>{
        if (!visible(e) || e.closest('.carousel, [data-rcs], .hero-media-background') || ['SCRIPT','STYLE'].includes(e.tagName)) return false;
        const r=e.getBoundingClientRect(); return r.left < -1 || r.right > innerWidth+1;
      }).slice(0,12).map(e=>({tag:e.tagName,class:e.className,...box(e)})),
      headings:[...document.querySelectorAll('h2')].map(e=>({text:e.textContent.trim(),...box(e),font:getComputedStyle(e).fontSize})),
      videos:[...document.querySelectorAll('video')].map(v=>({src:v.getAttribute('src')||v.dataset.src||v.querySelector('source')?.src,ready:v.readyState,error:v.error?.message,fit:getComputedStyle(v).objectFit,...box(v)}))
    };
  });
}
async function capture(page, site, width) {
  await page.evaluate(() => document.querySelectorAll('video').forEach(v=>v.pause()));
  await page.screenshot({path:path.join(output,`${site}-${stage}-${width}.jpg`),fullPage:true,type:'jpeg',quality:82});
  await page.locator('header').screenshot({path:path.join(output,`${site}-hero-${width}.jpg`),type:'jpeg',quality:88});
}
(async()=>{
  const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
  try {
    for (const site of sites) {
      const page=await browser.newPage({reducedMotion:'reduce'});
      page.on('pageerror',e=>report.errors.push({site,message:e.message}));
      for (const [width,height] of stage==='before' ? [[1920,1080],[960,900],[390,844]] : viewports) {
        await page.setViewportSize({width,height});
        await page.goto(`${base}/projects/${site}/`,{waitUntil:'load'});
        await settle(page);
        const result={site,...await metrics(page)}; report.viewports.push(result);
        if ([1920,960,390].includes(width)) await capture(page,site,width);
        else {
          await page.evaluate(()=>document.querySelectorAll('video').forEach(v=>v.pause()));
          await page.locator('header').screenshot({path:path.join(output,`${site}-hero-${width}.jpg`),type:'jpeg',quality:85});
        }
        if(stage!=='before') {
          assert(Math.abs(result.hero.x)<1 && Math.abs(result.hero.width-result.layoutWidth)<1,`${site} Hero must fill the viewport`);
          assert(result.scrollWidth<=width,`${site} horizontal overflow at ${width}`);
          assert.equal(result.brokenImages.length,0,`${site} broken images`);
          assert.equal(result.overflow.length,0,`${site} content outside viewport at ${width}: ${JSON.stringify(result.overflow)}`);
        }
      }
      if(stage!=='before') {
        // Keep the same document live while resizing through every intermediate step.
        for(let width=1920;width>=320;width-=16) {
          await page.setViewportSize({width,height:900});
          await page.waitForTimeout(15);
          const m=await metrics(page);
          report.sweeps.push({site,width,heroHeight:m.hero.height,titleSize:m.titleSize,scrollWidth:m.scrollWidth});
          assert(m.scrollWidth<=width,`${site} resize overflow at ${width}`);
          if ((1920-width)%128===0 || [864,848,768,640,512,384,320].includes(width)) {
            const hero=page.locator('header');
            await hero.screenshot({path:path.join(output,`${site}-resize-${width}.jpg`),type:'jpeg',quality:70});
          }
        }
      }
      console.log(`${stage}: ${site} complete`);
      await page.close();
    }
  } finally {
    fs.writeFileSync(path.join(output,`${stage}-metrics.json`),JSON.stringify(report,null,2)+'\n');
    await browser.close();
  }
  if(stage!=='before')assert.equal(report.errors.length,0,JSON.stringify(report.errors));
})();
