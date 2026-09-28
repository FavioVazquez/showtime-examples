// Curtain Call lower thirds: one page per variant (bar.html, card.html, kicker.html, pill.html).
// The lower-third component draws the box, the name and the entrance/exit; anime.js adds a staggered
// entrance for the role line (ST.anime seeks the paused timeline, so every frame is a function of t). The
// letters start hidden in lt.css and the component's own role fade is off, so only the stagger reveals them.
import { LowerThird } from '/_st/components/index.js';
import { createTimeline, stagger } from '/_lib/animejs/dist/bundles/anime.esm.min.js';

const AT = 0.35;        // the lower third starts (s); frame 0 stays empty for a clean cut in the edit
const HOLD = 4.0;       // seconds on screen after landing

const variant = document.body.dataset.variant;
const alpha = !!(window.__ST_RENDER__ && window.__ST_RENDER__.alpha);
document.querySelector('.plate').hidden = alpha;   // preview plate only; alpha renders are transparent

const ready = fetch('names.json').then((r) => r.json()).then(async (names) => {
  await document.fonts.ready;
  const d = names[variant];
  const el = document.getElementById('lt');
  const lt = LowerThird(el, { variant, name: d.name, role: d.role, kicker: d.kicker || '', at: AT, hold: HOLD });
  await lt.ready;                                   // the component builds its DOM in setup
  const tl = createTimeline({ autoplay: false });
  // bar and kicker carry a Stage plate behind the text: it wipes open with the entrance instead of popping in
  if (variant === 'bar' || variant === 'kicker') {
    const start = AT + (variant === 'bar' ? 0.06 : 0.12);
    ST.onSeek((t) => {
      const plate = el.querySelector('.st-lt-text');   // the component builds its DOM lazily
      if (!plate) return;
      const p = Math.min(1, Math.max(0, (t - start) / 0.48));
      const e = 1 - Math.pow(1 - p, 3);
      plate.style.clipPath = `inset(0% ${((1 - e) * 100).toFixed(2)}% 0% 0%)`;
    });
  }
  const role = el.querySelector('.st-lt-role');
  if (role) {
    const text = role.textContent; role.textContent = '';
    for (const ch of text) { const s = document.createElement('span'); s.className = 'ch'; s.textContent = ch; role.append(s); }
    tl.add(role.querySelectorAll('.ch'), { opacity: [0, 1], translateY: ['0.25em', '0em'], duration: 320, delay: stagger(16), ease: 'outCubic' }, 420);
  }
  ST.anime(tl, { offset: AT });
});
ST.waitFor(ready, 'lower third');
