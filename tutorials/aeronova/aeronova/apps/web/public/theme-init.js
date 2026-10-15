// Runs before first paint so the page never flashes the wrong theme.
(function () {
  var pref = 'system';
  try {
    pref = localStorage.getItem('aeronova.theme') || 'system';
  } catch {
    // Storage blocked (private mode): fall back to the system preference.
  }
  var dark =
    pref === 'dark' || (pref !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
})();
