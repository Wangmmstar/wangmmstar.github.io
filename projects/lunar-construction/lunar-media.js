// Keep the supplied media files unchanged. Motion is controlled at playback time.
(() => {
  const videos = [...document.querySelectorAll('.lunar-page video[data-motion]')];
  const hero = document.querySelector('.lunar-hero-video');
  const toggle = document.querySelector('.lunar-motion-toggle');
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = preference.matches;

  const applyMotion = () => {
    videos.forEach(video => {
      video.muted = true;
      video.autoplay = !paused;
      if (paused) video.pause();
      else if (!video.error) video.play().catch(() => {
        // The global play button remains available when autoplay is restricted.
      });
    });
    if (hero) {
      // The Hero stays on its poster whenever reduced motion is requested.
      const playHero = !paused && !preference.matches;
      hero.muted = true;
      hero.autoplay = playHero;
      if (!playHero) hero.pause();
      else hero.play().catch(() => {
        // Keep the poster visible if this browser restricts autoplay.
      });
    }
    toggle.textContent = paused ? 'Play motion' : 'Pause motion';
  };

  videos.forEach(video => {
    const notice = video.parentElement.querySelector('.lunar-media-error');
    const clearError = () => { notice.hidden = true; };
    const showError = () => { notice.hidden = video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA; };
    // A transient source event can be followed by successful decoding.
    video.addEventListener('canplay', clearError);
    video.addEventListener('error', showError);
    video.querySelector('source').addEventListener('error', showError);
    // A cached or fast source failure can precede this deferred script.
    if (video.error || video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) showError();
    // In reduced-motion mode, show a decoded still frame instead of a black player.
    video.addEventListener('loadeddata', () => {
      clearError();
      if (paused) video.pause();
    });
  });
  toggle.hidden = false;
  toggle.addEventListener('click', () => { paused = !paused; applyMotion(); });
  preference.addEventListener('change', () => {
    paused = preference.matches;
    // Re-evaluate the Hero source's media query when the preference changes.
    if (hero) hero.load();
    applyMotion();
  });
  applyMotion();
})();
