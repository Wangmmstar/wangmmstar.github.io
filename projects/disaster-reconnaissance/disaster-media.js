// Preserve hero playback and restore the original research interactions.
const video = document.querySelector('[data-hero-video]');
const toggle = document.querySelector('[data-motion-toggle]');

if (video && toggle) {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection;
  let userPaused = motion.matches || Boolean(connection?.saveData);
  let visible = false;
  let playbackRequest = 0;

  const updateToggle = () => {
    toggle.classList.toggle('is-paused', video.paused);
    toggle.setAttribute('aria-label', video.paused ? 'Play video' : 'Pause video');
  };

  const syncPlayback = async () => {
    const request = ++playbackRequest;
    if (!visible || document.hidden || userPaused) {
      video.pause();
      return;
    }
    if (!video.getAttribute('src')) video.src = video.dataset.src;
    try {
      await video.play();
      if (request === playbackRequest && (!visible || document.hidden || userPaused)) video.pause();
    } catch {
      // Keep the poster and a manual play control when autoplay is unavailable.
    }
    updateToggle();
  };

  toggle.hidden = false;
  updateToggle();
  video.addEventListener('play', updateToggle);
  video.addEventListener('pause', updateToggle);
  video.addEventListener('error', () => { toggle.hidden = true; });
  toggle.addEventListener('click', () => {
    userPaused = !video.paused;
    syncPlayback();
  });
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncPlayback();
  }, { threshold: 0.05 }).observe(video);
  document.addEventListener('visibilitychange', syncPlayback);
  motion.addEventListener('change', () => {
    userPaused = motion.matches || Boolean(connection?.saveData);
    syncPlayback();
  });
}

// Six-level damage selector — recovered from 76b1d5c.
const n=document.querySelector("[data-damage-selector]");if(n){const c=JSON.parse(n.dataset.levels),e=n.querySelector("[data-damage-photo]"),o=n.querySelector('input[type="range"]'),g=n.querySelector("output"),l=n.querySelector("[data-damage-previous]"),d=n.querySelector("[data-damage-next]"),i=matchMedia("(prefers-reduced-motion: reduce)");let t=2;const s=r=>{t=Math.max(0,Math.min(c.length-1,r));const a=c[t];o.value=String(t),o.setAttribute("aria-valuetext",`${a.name} damage, level ${t+1} of ${c.length}`),g.value=`${a.name} damage`,e.alt=a.alt,e.width=a.width,e.height=a.height,e.getAttribute("src")!==a.src&&(e.src=a.src),l.disabled=t===0,d.disabled=t===c.length-1};o.addEventListener("input",()=>s(Number(o.value))),l.addEventListener("click",()=>s(t-1)),d.addEventListener("click",()=>s(t+1)),e.addEventListener("load",()=>{e.getAnimations().forEach(r=>r.cancel()),i.matches||e.animate([{opacity:.75},{opacity:1}],{duration:180,easing:"ease-out"})}),i.addEventListener("change",()=>{i.matches&&e.getAnimations().forEach(r=>r.cancel())}),n.querySelector(".damage-selector-controls").hidden=!1,s(t);const u=new IntersectionObserver(([r])=>{if(r.isIntersecting){for(const a of c){const m=new Image;m.src=a.src}u.disconnect()}},{rootMargin:"300px"});u.observe(n)}

// Draggable damage-map comparison — recovered from 76b1d5c.
const s=document.querySelector("[data-damage-comparison]"),r=s?.querySelector(".map-stage"),e=s?.querySelector("input");if(r&&e){const a=()=>{r.style.setProperty("--split",`${e.value}%`),e.setAttribute("aria-valuetext",`${e.value}% original map, ${100-Number(e.value)}% inference map`)};e.addEventListener("input",a);let n=!1;const i=t=>{const o=r.getBoundingClientRect();e.value=String(Math.round(Math.max(0,Math.min(100,(t.clientX-o.left)/o.width*100)))),a()};e.addEventListener("pointerdown",t=>{t.button===0&&(t.preventDefault(),e.focus({preventScroll:!0}),n=!0,e.setPointerCapture(t.pointerId),i(t))}),e.addEventListener("pointermove",t=>{n&&i(t)}),e.addEventListener("pointerup",()=>{n=!1}),e.addEventListener("pointercancel",()=>{n=!1}),e.addEventListener("lostpointercapture",()=>{n=!1})}

// Mission-planning scenario tabs — recovered from 76b1d5c.
const a=document.querySelector("[data-mission-planning]");if(a){const r=[...a.querySelectorAll('[role="tab"]')],c=[...a.querySelectorAll('[role="tabpanel"]')];a.querySelector('[role="tablist"]').hidden=!1,a.querySelectorAll(".scenario-fallback").forEach(t=>{t.hidden=!0});const s=(t,o=!1)=>{r.forEach((l,e)=>{l.setAttribute("aria-selected",String(e===t)),l.tabIndex=e===t?0:-1,c[e].hidden=e!==t}),o&&r[t].focus()};r.forEach((t,o)=>{t.addEventListener("click",()=>s(o)),t.addEventListener("keydown",l=>{let e=o;if(l.key==="ArrowRight")e=(o+1)%r.length;else if(l.key==="ArrowLeft")e=(o-1+r.length)%r.length;else if(l.key==="Home")e=0;else if(l.key==="End")e=r.length-1;else return;l.preventDefault(),s(e,!0)})}),s(0)}
