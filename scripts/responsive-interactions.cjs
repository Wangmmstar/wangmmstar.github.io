const fs = require('node:fs');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.RESPONSIVE_URL || 'http://127.0.0.1:8766';
const selected=process.env.RESPONSIVE_SITES?.split(',');
const priorFile=(process.env.RESPONSIVE_EVIDENCE || 'docs/responsive')+'/interactions.json';
const results=selected && fs.existsSync(priorFile) ? JSON.parse(fs.readFileSync(priorFile,'utf8')).filter(x=>!selected.includes(x.site)) : [];
const check = (condition, message) => assert(condition, message);

async function advancing(page, video) {
  await video.scrollIntoViewIfNeeded();
  await video.evaluate(async v => {
    v.muted=true;
    if (!v.getAttribute('src') && v.dataset.src) { v.src=v.dataset.src; v.load(); }
    await v.play();
  });
  const before=await video.evaluate(v=>v.currentTime);
  await page.waitForTimeout(300);
  const state=await video.evaluate(v=>({time:v.currentTime,ready:v.readyState,error:v.error?.message,rate:v.playbackRate}));
  check(!state.error && state.ready>=2 && state.time>before,`Video failed to advance: ${JSON.stringify(state)}`);
  await video.evaluate(v=>v.pause());
  return state;
}

(async()=>{
  const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',args:['--no-sandbox']});
  try {
    for(const width of [1920,960,390]) {
      const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
      const errors=[]; page.on('pageerror',e=>errors.push(e.message));
      for(const site of ['bim2workface','bim-laser','lunar-construction','subsurface','fire-investigation','mobile-sar-copilot']) {
        if(selected && !selected.includes(site))continue;
        await page.goto(`${base}/projects/${site}/`);
        await page.evaluate(()=>document.fonts.ready);
        if(site==='bim2workface'||site==='bim-laser') {
          const slider=page.locator('[role="slider"]');
          await slider.scrollIntoViewIfNeeded();
          await page.waitForFunction(()=>!document.querySelector('astro-island[component-export="Comparison"]').hasAttribute('ssr'));
          await slider.focus(); const initial=Number(await slider.getAttribute('aria-valuenow'));
          await page.keyboard.press('ArrowRight');
          check(Number(await slider.getAttribute('aria-valuenow'))>initial,'Comparison keyboard control failed');
          const rect=await slider.locator('..').boundingBox();
          await page.mouse.move(rect.x+rect.width*.5,rect.y+rect.height*.5); await page.mouse.down();
          await page.mouse.move(rect.x+rect.width*.7,rect.y+rect.height*.5); await page.mouse.up();
          check(Number(await slider.getAttribute('aria-valuenow'))>60,'Comparison drag failed');
          const hero=page.locator('header video');const state=await advancing(page,hero);
          check(state.rate===(site==='bim2workface'?2:1),'Hero playback rate changed');
        }
        if(site==='bim2workface') {
          const tabs=page.locator('[data-tabs-trigger]');
          for(let i=0;i<await tabs.count();i++) {
            await tabs.nth(i).click();
            const panel=page.locator('[data-tabs-content][data-state="active"]');
            await panel.scrollIntoViewIfNeeded();
            check(await panel.count()===1,'Expected one active alignment panel');
            const play=page.locator('[data-play]');
            if((await play.textContent()).includes('Play')) await play.click();
            await page.waitForFunction(()=>[...document.querySelectorAll('[data-tabs-content][data-state="active"] video')].every(v=>!v.paused&&v.readyState>=2));
            const videos=await panel.locator('video').evaluateAll(vs=>vs.map(v=>({rate:v.playbackRate,time:v.currentTime})));
            const speed=Number(await panel.getAttribute('data-speed'));
            check(videos.length===2 && videos.every(v=>v.rate===speed),'Paired video rate incorrect');
            check(Math.abs(videos[0].time-videos[1].time)<.4,'Paired video synchronization failed');
            await page.locator('[data-restart]').click();
            await play.click();
          }
          await tabs.first().click(); await page.keyboard.press('ArrowRight');
          check(await tabs.nth(1).getAttribute('tabindex')==='0','Tab keyboard navigation failed');
        }
        if(site==='bim-laser') {
          const wrapper=page.locator('.carousel-wrapper'); await wrapper.scrollIntoViewIfNeeded();
          const dots=wrapper.locator('.page-button');
          for(let i=1;i<3;i++) { await dots.nth(i).click(); await page.waitForTimeout(700); check(await dots.nth(i).evaluate(e=>e.classList.contains('active')),'Carousel page control failed'); }
          await wrapper.locator('.prev-button').click();await page.waitForTimeout(700);
          check(await dots.nth(1).evaluate(e=>e.classList.contains('active')),'Carousel previous control failed');
          await advancing(page,page.locator('main video').nth(1));
        }
        if(site==='lunar-construction') {
          for(const video of await page.locator('video').all()) {
            await advancing(page,video);
            check(await video.evaluate(v=>v.parentElement.querySelector('.lunar-media-error').hidden),'Decoded Lunar video shows an error notice');
          }
          const toggle=page.locator('.lunar-motion-toggle');await toggle.scrollIntoViewIfNeeded();
          if(await toggle.isVisible()) {await toggle.click();await page.waitForTimeout(200);await toggle.click();}
          check(await page.locator('.lunar-workflow a').getAttribute('target')==='_blank','Workflow enlargement link changed');
        }
        if(site==='subsurface') {
          const buttons=page.locator('[data-select-stage]');
          for(let i=0;i<3;i++) {await buttons.nth(i).click();check(await buttons.nth(i).getAttribute('aria-pressed')==='true','Subsurface stage failed');check(await page.locator('[data-stage]:visible').count()===1,'Subsurface stage visibility failed');}
          const range=page.locator('input[type="range"]');await range.focus();await page.keyboard.press('Home');
          check(await range.inputValue()==='0','Subsurface range keyboard failed');
          await advancing(page,page.locator('[data-ss-sensing-video]'));
          await page.evaluate(()=>document.documentElement.style.scrollBehavior='auto');
          await page.emulateMedia({reducedMotion:'no-preference'});await page.locator('header').scrollIntoViewIfNeeded();
          await page.waitForFunction(()=>document.querySelector('[data-ss-video]').classList.contains('is-playing'));
          const motion=page.locator('[data-ss-motion]');await motion.waitFor({state:'visible'});
          await motion.click();check(await page.locator('[data-ss-video]').evaluate(v=>v.paused),'Subsurface pause failed');
          await motion.click();await page.waitForFunction(()=>!document.querySelector('[data-ss-video]').paused);
          await page.emulateMedia({reducedMotion:'reduce'});
        }
        if(site==='fire-investigation') {
          for(const scene of ['after','before']) {const btn=page.locator(`[data-scene="${scene}"]`);await btn.click();check(await btn.getAttribute('aria-pressed')==='true','Fire comparison failed');check(await page.locator(`[data-scene-panel="${scene}"]`).isVisible(),'Fire panel not shown');}
          for(const video of await page.locator('video').all()) await advancing(page,video);
        }
        results.push({site,width,passed:true});console.log(`Interactions: ${site} ${width} passed`);
      }
      check(errors.length===0,errors.join('\n'));await page.close();
    }
  } finally {fs.writeFileSync(priorFile,JSON.stringify(results,null,2)+'\n');await browser.close();}
})();
