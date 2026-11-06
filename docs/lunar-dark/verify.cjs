const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const {createHash}=require('node:crypto');
const sourceFiles=['projects/lunar-construction/index.html','projects/lunar-construction/lunar-editorial.css','projects/lunar-construction/lunar-media.js'];
const hashes=()=>Object.fromEntries(sourceFiles.map(p=>[p,createHash('sha256').update(fs.readFileSync(p)).digest('hex')]));
const initialHashes=hashes();
const output='docs/lunar-dark';
fs.mkdirSync(output,{recursive:true});
fs.mkdirSync('/tmp/lunar-dark',{recursive:true});
const getMetrics=()=>{
 const box=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom};};
 const h=document.querySelector('h1'), sub=document.querySelector('.lunar-subtitle');
 const hb=box(h),sb=box(sub),hero=document.querySelector('.lunar-hero');
 const lines={};const node=h.firstChild;let m;const re=/\S+/g;
 while((m=re.exec(node.textContent))){const r=document.createRange();r.setStart(node,m.index);r.setEnd(node,m.index+m[0].length);const b=r.getBoundingClientRect();(lines[b.y]??=[]).push(m[0]);}
 const videos=[...document.querySelectorAll('video')].map(v=>({...box(v),fit:getComputedStyle(v).objectFit,ratio:v.videoWidth/v.videoHeight,error:v.error?.message??null,ready:v.readyState,paused:v.paused}));
 const overflow=[...document.querySelectorAll('main *,footer')].filter(e=>{if(!e.getBoundingClientRect().height)return false;const r=e.getBoundingClientRect();return r.left<-.5||r.right>innerWidth+.5;}).map(e=>e.className);
 return {width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,hero:box(hero),title:hb,subtitle:sb,titleLines:Object.values(lines).map(s=>s.join(' ')),titleFont:getComputedStyle(h).fontSize,overflow,videos,background:getComputedStyle(document.body).backgroundColor,brokenImages:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),captions:[...document.querySelectorAll('.lunar-comparison figcaption')].map(box),barRatios:[...document.querySelectorAll('.lunar-bar')].map(e=>e.offsetWidth/e.parentElement.offsetWidth)};
};
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_BIN || '/usr/bin/google-chrome',args:['--no-sandbox']});
 const page=await browser.newPage({reducedMotion:'reduce'});
 const report={sourceHashes:initialHashes,screens:[],sweepCount:0,sweepFailures:[],heightJumps:[],errors:[],requests:[],interactions:{}};
 page.on('pageerror',e=>report.errors.push(e.message));
 page.on('response',r=>{if(r.status()>=400)report.requests.push({url:r.url(),status:r.status()});});
 await page.goto('http://127.0.0.1:8766/projects/lunar-construction/',{waitUntil:'load'});
 await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));});
 await page.waitForFunction(()=>[...document.querySelectorAll('video')].every(v=>v.readyState>=2));
 report.interactions.reducedMotionPaused=await page.locator('video').evaluateAll(vs=>vs.every(v=>v.paused));
 assert(report.interactions.reducedMotionPaused,'reduced motion must pause all videos');
 assert.equal(await page.locator('.lunar-motion-toggle').textContent(),'Play motion');
 await page.getByRole('button',{name:'Play motion',exact:true}).click();
 await page.waitForFunction(()=>[...document.querySelectorAll('video')].every(v=>!v.paused));
 report.interactions.playAll=true;
 await page.getByRole('button',{name:'Pause motion',exact:true}).click();
 assert(await page.locator('video').evaluateAll(vs=>vs.every(v=>v.paused)));
 report.interactions.pauseAll=true;
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.waitForFunction(()=>[...document.querySelectorAll('video')].every(v=>!v.paused));
 report.interactions.preferenceChangePlays=true;
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.waitForFunction(()=>[...document.querySelectorAll('video')].every(v=>v.paused));
 report.interactions.preferenceChangePauses=true;
 const image=page.locator('.lunar-workflow a');
 const [popup]=await Promise.all([page.waitForEvent('popup'),image.click()]);
 await popup.waitForLoadState();
 assert(popup.url().endsWith('projected-landmarks-overview.png'));
 report.interactions.figureEnlarges=true;await popup.close();
 await page.evaluate(()=>{scrollTo(0,0);document.querySelectorAll('video').forEach(v=>v.currentTime=1);});
 for(const [width,height] of [[2560,1440],[1920,1080],[1440,900],[1200,800],[960,900],[768,1024],[700,900],[600,900],[390,844],[320,700]]){
  await page.setViewportSize({width,height});
  const m=await page.evaluate(getMetrics);report.screens.push(m);
  assert(m.hero.height>=height-1,`Hero must fill viewport at ${width}`);
  assert(m.scrollWidth<=width,`overflow ${width}`);assert.equal(m.overflow.length,0,`element overflow ${width}: ${m.overflow}`);
  assert.equal(m.brokenImages.length,0);assert(m.subtitle.y>=m.title.bottom-1,'title/subtitle collision');
  for(const v of m.videos){assert.equal(v.fit,'contain');assert(Math.abs(v.width/v.height-16/9)<.01,'16:9 stage');assert.equal(v.error,null);}
  if(width>700){assert(Math.abs(m.videos[0].y-m.videos[1].y)<1,'video top alignment');assert(Math.abs(m.videos[0].width-m.videos[1].width)<1,'equal video widths');assert(Math.abs(m.captions[0].y-m.captions[1].y)<1,'caption top alignment');}
  else assert(m.videos[1].y>m.videos[0].bottom,'mobile video stacking');
  for(const v of await page.locator('video').all()){await v.scrollIntoViewIfNeeded();await page.waitForTimeout(120);}
  await page.evaluate(()=>scrollTo(0,0));
  await page.waitForTimeout(120);
  if([1920,960,390].includes(width)) await page.screenshot({path:`${output}/after-${width}.jpg`,fullPage:true,type:'jpeg',quality:85});
  await page.locator('.lunar-hero').screenshot({path:`/tmp/lunar-dark/hero-${width}.jpg`,type:'jpeg',quality:85});
 }
 // Resize the same document through every CSS pixel, including half-screen widths.
 let previous;
 for(let width=1920;width>=320;width--){
  await page.setViewportSize({width,height:900});
  const m=await page.evaluate(getMetrics);report.sweepCount++;
  if(m.scrollWidth>width||m.overflow.length||m.subtitle.y<m.title.bottom-.5)report.sweepFailures.push(m);
  if(previous&&Math.abs(m.hero.height-previous.hero.height)>80)report.heightJumps.push({width,change:m.hero.height-previous.hero.height});
  previous=m;
 }
 // Simulate unavailable media and verify the original-source fallbacks appear.
 const fallback=await browser.newPage({reducedMotion:'reduce'});
 await fallback.route('**/*.mp4',r=>r.abort());
 await fallback.goto('http://127.0.0.1:8766/projects/lunar-construction/');
 await fallback.waitForFunction(()=>[...document.querySelectorAll('.lunar-media-error')].every(e=>!e.hidden));
 report.interactions.videoFallbacks=await fallback.locator('.lunar-media-error:visible a').count();
 assert.equal(report.interactions.videoFallbacks,3);
 await fallback.close();
 assert.deepEqual(hashes(),initialHashes,'Application source changed during browser verification');
 fs.writeFileSync(`${output}/verification.json`,JSON.stringify(report,null,2));
 console.log(JSON.stringify({screens:report.screens.map(m=>({width:m.width,heroHeight:m.hero.height,titleLines:m.titleLines})),sweepCount:report.sweepCount,sweepFailures:report.sweepFailures.length,heightJumps:report.heightJumps,errors:report.errors,requests:report.requests,interactions:report.interactions},null,2));
 assert.equal(report.sweepFailures.length,0);assert.equal(report.heightJumps.length,0);assert.equal(report.errors.length,0);assert.equal(report.requests.length,0);
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
