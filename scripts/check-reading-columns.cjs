/* Measure the Fire reading-column fix and guard the other five page layouts.
   Run before, then after against the same local server. See RESPONSIVE_AUDIT.md. */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const stage = process.argv[2] || 'after';
const output = path.resolve('docs/fire-alignment');
const sites = ['fire-investigation','mobile-sar-copilot','bim2workface','bim-laser','lunar-construction','subsurface'];
const sections = ['problem','approach','exploration','evidence','simulation','reasoning','vision'];
const report = [];
const base = process.env.RESPONSIVE_URL || 'http://127.0.0.1:8766';
const near=(a,b,message)=>assert(Math.abs(a-b)<.25,`${message}: ${a} vs ${b}`);
(async()=>{
  fs.mkdirSync(output,{recursive:true});
  const browser = await chromium.launch({executablePath:process.env.CHROME_BIN || '/usr/bin/google-chrome',args:['--no-sandbox']});
  try {
    for (const site of sites) for (const width of [1920,960,390]) {
      const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
      const errors=[];page.on('pageerror',e=>errors.push(e.message));
      await page.goto(`${base}/projects/${site}/`);
      await page.evaluate(async()=>{
        await document.fonts.ready;
        for(let y=0;y<document.body.scrollHeight;y+=700){scrollTo(0,y);await new Promise(r=>setTimeout(r,20));}
        await Promise.race([Promise.all([...document.images].map(i=>i.decode().catch(()=>{}))),new Promise(r=>setTimeout(r,3000))]);
        document.querySelectorAll('video').forEach(v=>v.pause());scrollTo(0,0);
      });
      await page.waitForTimeout(150);
      const data=await page.evaluate(()=>{
        const rect=e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return {x:r.x,y:r.y+scrollY,width:r.width,height:r.height,fontSize:s.fontSize,lineHeight:s.lineHeight,color:s.color,textAlign:s.textAlign,marginLeft:s.marginLeft,marginRight:s.marginRight}};
        const summary=e=>({tag:e.tagName,class:e.className,text:e.textContent.trim().slice(0,100),...rect(e)});
        return {
          scrollWidth:document.documentElement.scrollWidth,
          // Media boxes and all text boxes detect unintended page-wide changes.
          layout:[...document.querySelectorAll('main :is(h1,h2,h3,p,img,video,figure)')].map(summary),
          groups:[...document.querySelectorAll('.research-section')].map(sec=>({
            id:sec.id,section:rect(sec),
            direct:[...sec.children].filter(e=>e.matches('h2,p')).map(summary),
            evidence: [...sec.querySelectorAll('.fire-evidence-copy > :is(h2,p),.fire-approach > div:first-child > :is(h2,p),.fire-simulation-intro > p,.fire-simulation-intro > div > :is(h2,p)')].map(summary),
            media:[...sec.querySelectorAll(':scope > .research-wide,:scope > figure,:scope > .fire-reasoning-comparison')].map(summary)
          }))
        };
      });
      assert(!errors.length,errors.join('\n'));
      assert(data.scrollWidth<=width,`${site} overflow at ${width}`);
      report.push({site,width,...data});
      if(site==='fire-investigation') {
        await page.screenshot({path:path.join(output,`fire-${stage}-${width}.jpg`),fullPage:true,type:'jpeg',quality:85});
        for(const id of sections) await page.locator(`#${id}`).screenshot({path:path.join(output,`${id}-${stage}-${width}.jpg`),type:'jpeg',quality:88});
        if(stage==='after') {
          for(const group of data.groups) {
            if(['problem','exploration','reasoning','vision'].includes(group.id)) {
              const related=group.direct.filter(e=>!e.class.includes('fire-emphasis')&&!e.class.includes('fire-closing'));
              assert(related.length===3,`${group.id}: expected kicker, heading and intro`);
              for(const e of related){near(e.x,related[0].x,`${group.id} left at ${width}`);near(e.width,related[0].width,`${group.id} width at ${width}`);}
            }
            if(['approach','evidence'].includes(group.id)) {
              for(const e of group.evidence)near(e.x,group.evidence[0].x,`${group.id} nested left at ${width}`);
            }
            if(group.id==='simulation') {
              const [kicker,heading,intro]=group.evidence;
              near(kicker.x,heading.x,`simulation heading left at ${width}`);
              // Compare the responsive split/stack geometry to its baseline below.
            }
            if(group.id!=='evidence') for(const media of group.media)near(media.x+media.width/2,group.section.x+group.section.width/2,`${group.id} media center at ${width}`);
          }
        }
      } else if(stage==='after') {
        await page.screenshot({path:path.join(output,`${site}-after-${width}.jpg`),fullPage:true,type:'jpeg',quality:78});
      }
      console.log(`${stage}: ${site} ${width}`);await page.close();
    }
    if(stage==='after') {
      const before=JSON.parse(fs.readFileSync(path.join(output,'before.json'),'utf8'));
      for(const current of report) {
        const prior=before.find(e=>e.site===current.site&&e.width===current.width);
        assert(prior,'Missing baseline');
        if(current.site!=='fire-investigation') assert.deepEqual(current.layout,prior.layout,`${current.site} changed at ${current.width}`);
        else {
          for(let i=0;i<current.layout.length;i++) for(const field of ['fontSize','lineHeight','color','textAlign']) assert.equal(current.layout[i][field],prior.layout[i][field],`Fire ${field} changed`);
          // Intentional nested layouts, editorial closing copy, and media widths stay intact.
          for(const group of current.groups) {
            const old=prior.groups.find(e=>e.id===group.id);
            const withoutY=items=>items.map(({y,...rest})=>rest);
            assert.deepEqual(withoutY(group.evidence),withoutY(old.evidence),`${group.id} nested layout changed`);
            group.media.forEach((m,i)=>{near(m.x,old.media[i].x,'Media left');near(m.width,old.media[i].width,'Media width');});
          }
        }
      }
    }
  } finally {
    fs.writeFileSync(path.join(output,`${stage}.json`),JSON.stringify(report,null,2)+'\n');
    await browser.close();
  }
})();
