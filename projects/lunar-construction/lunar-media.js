// Keep the supplied media files unchanged. Motion is controlled at playback time.
(() => {
  const videos = [...document.querySelectorAll('.lunar-page video[data-motion]')];
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
    toggle.textContent = paused ? 'Play motion' : 'Pause motion';
  };

  videos.forEach(video => {
    const showError = () => {
      video.parentElement.querySelector('.lunar-media-error').hidden = false;
    };
    video.addEventListener('error', showError);
    video.querySelector('source').addEventListener('error', showError);
    // In reduced-motion mode, show a decoded still frame instead of a black player.
    video.addEventListener('loadeddata', () => {
      if (paused) video.pause();
    });
  });
  toggle.hidden = false;
  toggle.addEventListener('click', () => { paused = !paused; applyMotion(); });
  preference.addEventListener('change', () => { paused = preference.matches; applyMotion(); });
  applyMotion();
})();
