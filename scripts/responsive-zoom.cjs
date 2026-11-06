/* Real Chrome browser zoom via profile preferences, not CSS zoom or pinch scale. */
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.RESPONSIVE_URL||'http://127.0.0.1:8766';
const host=new URL(base).hostname;
const sites=['mobile-sar-copilot','bim2workface','bim-laser','lunar-construction','subsurface','fire-investigation'];
const reports=[];
(async()=>{
  for(const zoom of [1.25,1.5])for(const windowWidth of [1920,960]) {
    const dir=fs.mkdtempSync(path.join(os.tmpdir(),'research-zoom-'));
    fs.mkdirSync(path.join(dir,'Default'));
    fs.writeFileSync(path.join(dir,'Default/Preferences'),JSON.stringify({partition:{per_host_zoom_levels:{x:{[host]:{last_modified:'13400000000000000',zoom_level:Math.log(zoom)/Math.log(1.2)}}}}}));
    const context=await chromium.launchPersistentContext(dir,{executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',headless:true,viewport:null,reducedMotion:'reduce',args:['--no-sandbox',`--window-size=${windowWidth},1000`]});
    try {
      const page=context.pages()[0];
      for(const site of sites) {
        await page.goto(`${base}/projects/${site}/`,{waitUntil:'load'});
        await page.evaluate(async()=>{
          await document.fonts.ready;
          document.querySelectorAll('img').forEach(i=>i.loading='eager');
          for(let y=0;y<document.body.scrollHeight;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,40));}
          scrollTo(0,0);
          await Promise.race([Promise.all([...document.images].map(i=>i.decode().catch(()=>{}))),new Promise(r=>setTimeout(r,3000))]);
        });
        await page.waitForTimeout(800);
        const m=await page.evaluate(()=>({innerWidth,outerWidth,dpr:devicePixelRatio,scrollWidth:document.documentElement.scrollWidth,heroHeight:document.querySelector('h1').closest('header').offsetHeight}));
        assert(Math.abs(m.dpr-zoom)<.01,`Browser zoom was not applied: ${JSON.stringify(m)}`);
        assert(m.scrollWidth<=m.innerWidth,`${site} overflow at ${zoom*100}% / ${windowWidth}: ${JSON.stringify(m)}`);
        // Native viewport tiles avoid Chrome's blank offscreen image layers in
        // captureBeyondViewport screenshots at browser zoom. Never reset zoom.
        const cdp=await context.newCDPSession(page);
        const dimensions=await page.evaluate(()=>({height:document.documentElement.scrollHeight,step:innerHeight}));
        const tiles=[];
        for(let y=0;y<dimensions.height;y+=dimensions.step) {
          const top=await page.evaluate(y=>{scrollTo(0,y);return scrollY},y);
          if(tiles.length && Math.round(top*zoom)<=tiles.at(-1).y)break;
          await page.waitForTimeout(100);
          const shot=await cdp.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
          const file=path.join(dir,`${site}-tile-${tiles.length}.png`);
          fs.writeFileSync(file,Buffer.from(shot.data,'base64'));tiles.push({file,y:Math.round(top*zoom)});
        }
        const stitch=spawnSync(process.env.PYTHON_BIN||'python',['-c',
          'import sys,json; from PIL import Image; d=json.load(sys.stdin); out=Image.new("RGB",(Image.open(d["tiles"][0]["file"]).width,d["height"]),"white"); [(out.paste(Image.open(t["file"]),(0,t["y"]))) for t in d["tiles"]]; out.save(d["output"],quality=78)'
        ],{input:JSON.stringify({tiles,height:Math.ceil(dimensions.height*zoom),output:`docs/responsive/${site}-zoom-${zoom*100}-${windowWidth}.jpg`}),encoding:'utf8'});
        assert.equal(stitch.status,0,stitch.stderr);
        await cdp.detach();reports.push({site,zoom,windowWidth,...m});
      }
      console.log(`Native zoom ${zoom*100}% at ${windowWidth}: all six passed`);
    } finally {await context.close();fs.rmSync(dir,{recursive:true,force:true});fs.writeFileSync('docs/responsive/zoom-metrics.json',JSON.stringify(reports,null,2)+'\n');}
  }
})();
