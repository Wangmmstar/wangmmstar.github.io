// Requires Node 20+ and Playwright. Serve with HTTP byte-range support for frame captures.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const assert = require('node:assert/strict');
(async () => {
 const browser = await chromium.launch({executablePath:process.env.CHROME_BIN || '/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
 const results = [];
 const base = process.env.RESPONSIVE_URL || 'http://127.0.0.1:8771';
 fs.mkdirSync('docs/lunar-video-hero', {recursive:true});
 try {
  for(const width of [1440,1024,768,390,375]) {
   const context = await browser.newContext({viewport:{width,height:width<700?844:1000},isMobile:width<700,hasTouch:width<700,reducedMotion:'no-preference'});
   const page=await context.newPage();
   const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto(`${base}/projects/lunar-construction/`,{waitUntil:'load'});
   await page.evaluate(()=>document.fonts.ready);
   await page.waitForFunction(()=>{const v=document.querySelector('.lunar-hero-video');return v.readyState>=3&&!v.paused&&v.currentTime>.5});
   if (width === 1440 || width === 390) {
    // Confirm that the video loops in both desktop and mobile browser contexts.
    await page.locator('.lunar-hero-video').evaluate(v => { v.currentTime = v.duration - .3; });
    await page.waitForFunction(() => { const v = document.querySelector('.lunar-hero-video'); return !v.seeking && v.currentTime < 1; });
   }
   const a=await page.locator('.lunar-hero-video').evaluate(v=>v.currentTime);
   await page.waitForTimeout(500);
   assert(await page.locator('.lunar-hero-video').evaluate(v=>v.currentTime)>a,'Playback must advance');
   await page.locator('.lunar-hero-video').evaluate(v=>{v.pause();v.currentTime=10});
   await page.waitForFunction(()=>!document.querySelector('.lunar-hero-video').seeking);
   await page.waitForTimeout(300);
   assert(Math.abs(await page.locator('.lunar-hero-video').evaluate(v=>v.currentTime)-10)<.1,'Seek must reach the requested frame (preview server needs HTTP range support)');
   const m=await page.evaluate(()=>{
    const box=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom}};
    const hero=document.querySelector('.lunar-hero');const v=hero.querySelector('video');
    return {width:innerWidth,scrollWidth:document.documentElement.scrollWidth,hero:box(hero),video:box(v),text:[...hero.querySelectorAll('.lunar-identity,h1,.lunar-subtitle')].map(e=>({text:e.textContent,...box(e)})),paper:box(document.querySelector('.lunar-paper')),currentTime:v.currentTime,videoWidth:v.videoWidth,videoHeight:v.videoHeight,muted:v.muted,inline:v.playsInline,autoplay:v.autoplay,loop:v.loop,error:v.error?.message};
   });
   assert.equal(m.scrollWidth,width,'Horizontal overflow');
   assert.equal(m.hero.width,width,'Full width Hero');
   assert.equal(m.video.height,m.hero.height,'Full height video');
   assert.equal(m.video.width,m.hero.width,'Full width video');
   for(const t of m.text) assert(t.x>=0&&t.right<=width&&t.y>=m.hero.y&&t.bottom<=m.hero.bottom,'Text contained in video');
   assert.equal(m.paper.y,m.hero.bottom,'Clean next section');
   assert(m.muted&&m.inline&&m.autoplay&&m.loop&&!m.error,'Video configuration');
   assert.equal(errors.length,0,JSON.stringify(errors));
   await page.screenshot({path:`docs/lunar-video-hero/viewport-${width}.jpg`,type:'jpeg',quality:88});
   await page.locator('.lunar-hero').screenshot({path:`docs/lunar-video-hero/hero-${width}.jpg`,type:'jpeg',quality:92});
   if (width === 1440 || width === 390) {
    for (const time of [0,6,13]) {
     await page.locator('.lunar-hero-video').evaluate((v,time)=>new Promise(resolve=>{v.addEventListener('seeked',resolve,{once:true});v.currentTime=time}),time);
     await page.waitForTimeout(250);
     await page.locator('.lunar-hero').screenshot({path:`docs/lunar-video-hero/hero-${width}-time-${time}.jpg`,type:'jpeg',quality:88});
    }
    await page.getByRole('button',{name:'Pause motion'}).click();
    assert(await page.locator('video').evaluateAll(videos=>videos.every(v=>v.paused)),'Pause motion controls Hero and existing demonstrations');
    await page.getByRole('button',{name:'Play motion'}).click();
    await page.waitForFunction(()=>!document.querySelector('.lunar-hero-video').paused);
   }
   results.push(m);
   await context.close();
  }
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  const requested=[];
  page.on('request',r=>{if(r.url().includes('lunar-localization-hero.mp4'))requested.push(r.url())});
  await page.goto(`${base}/projects/lunar-construction/`,{waitUntil:'load'});
  await page.evaluate(()=>document.fonts.ready);
  const reduced=await page.locator('.lunar-hero-video').evaluate(v=>({paused:v.paused,visibility:getComputedStyle(v).visibility,poster:v.poster,autoplay:v.autoplay}));
  assert(reduced.paused&&reduced.visibility==='hidden'&&!reduced.autoplay,'Reduced motion uses poster');
  assert.equal(requested.length,0,'Reduced motion must not download hero video');
  await page.screenshot({path:'docs/lunar-video-hero/reduced-motion-390.jpg',type:'jpeg',quality:90});
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.waitForFunction(()=>{const v=document.querySelector('.lunar-hero-video');return !v.paused&&v.currentTime>.5});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForFunction(()=>document.querySelector('.lunar-hero-video').paused);
  results.push({reduced,heroRequestsInitially:0,preferenceChanges:'passed'});
  fs.writeFileSync('docs/lunar-video-hero/verification.json',JSON.stringify(results,null,2)+'\n');
  console.log('All five viewport checks, desktop/mobile autoplay, reduced-motion poster and preference changes passed.');
 } finally {await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
