// Homepage color preference. Storage may be unavailable in private/file previews.
(() => {
  const root = document.documentElement;
  let theme = 'light';
  try {
    if (localStorage.getItem('mengjun-homepage-theme') === 'dark') theme = 'dark';
  } catch (_) {}
  root.dataset.theme = theme;

  document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('theme-toggle');
    const updateLabel = () => {
      const isDark = root.dataset.theme === 'dark';
      const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
      button.setAttribute('aria-label', label);
      button.title = label;
    };
    updateLabel();
    button.hidden = false;
    button.addEventListener('click', () => {
      root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      updateLabel();
      try {
        localStorage.setItem('mengjun-homepage-theme', root.dataset.theme);
      } catch (_) {}
    });
  });
})();
