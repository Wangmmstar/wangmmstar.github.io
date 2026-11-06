// The research figures are static. Only the hero video needs playback behavior.
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
