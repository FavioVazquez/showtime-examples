// showtime corner mark (motion-A). Visible from the start of scene data-from-scene to the start of scene
// data-to-scene (video time, read from ST.clips(), so a retime moves it too); data-from-s / data-to-s are the
// fallback seconds (main video: 7.617 / 138.968). 0.3 s fade in and out, inside the window. Pure function of t.
(function () {
  const el = document.querySelector('.st-brandmark');
  if (!el || !window.ST) return;
  const FADE = 0.3;
  let win = null;
  function resolve() {
    let a = parseFloat(el.dataset.fromS), b = parseFloat(el.dataset.toS);
    try {
      const clips = ST.clips() || [];
      const from = clips.find((c) => c.id === el.dataset.fromScene);
      const to = clips.find((c) => c.id === el.dataset.toScene);
      if (from && Number.isFinite(from.start)) a = from.start;
      if (to && Number.isFinite(to.start)) b = to.start;
    } catch (e) { /* keep the fallback seconds */ }
    return [a, b];
  }
  ST.onSeek((t) => {
    if (!win) win = resolve();                       // static config, resolved once (same value every frame)
    const [a, b] = win;
    const op = Math.min(ST.clamp((t - a) / FADE, 0, 1), ST.clamp((b - t) / FADE, 0, 1));
    el.style.opacity = String(op);
    el.style.visibility = op > 0 ? 'visible' : 'hidden';
  });
})();
