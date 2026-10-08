/* shot-8: scene-local, registers through ST.onSeek; all helpers private to this file */
(function () {
  /* ink helpers (scene-local copy; everything inside this IIFE) */
  const NS = 'http://www.w3.org/2000/svg';
  const C = { o: '#b13d0b', oDark: '#7d2a07', t: '#2b8a8f', tTint: '#e3efed', g: '#8a8580', gTint: '#e6e2db',
              ink: '#1c1a17', muted: '#59534a', paper: '#f6f0e4' };
  function el(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const pr = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
  const io = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const ioS = (x) => -(Math.cos(Math.PI * x) - 1) / 2;
  const lerp = (a, b, p) => a + (b - a) * p;
  function sample(pts, step, closed) {
    const P = closed ? pts.concat([pts[0]]) : pts;
    const out = [P[0]];
    for (let i = 1; i < P.length; i++) {
      const [x0, y0] = P[i - 1], [x1, y1] = P[i];
      const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / step));
      for (let k = 1; k <= n; k++) out.push([x0 + (x1 - x0) * k / n, y0 + (y1 - y0) * k / n]);
    }
    if (closed) out.pop();
    return out;
  }
  function plen(p) { let L = 0; for (let i = 1; i < p.length; i++) L += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); return L; }
  // a tapered, slightly uneven pen stroke along a polyline, as a filled outline (crisp vector)
  function taper(pts, w, seed, closed) {
    const p = sample(pts, 5, closed), n = p.length, L = [], R = [];
    for (let i = 0; i < n; i++) {
      const a = closed ? p[(i - 1 + n) % n] : p[Math.max(0, i - 1)];
      const b = closed ? p[(i + 1) % n] : p[Math.min(n - 1, i + 1)];
      let dx = b[0] - a[0], dy = b[1] - a[1]; const d = Math.hypot(dx, dy) || 1; dx /= d; dy /= d;
      const u = n > 1 ? i / (n - 1) : 0;
      const prof = closed ? 0.9 : 0.42 + 0.58 * Math.pow(Math.sin(Math.PI * u), 0.55);
      const h = w * prof * (1 + 0.11 * ST.noise(i * 0.09, seed || 1)) / 2;
      L.push([p[i][0] - dy * h, p[i][1] + dx * h]); R.push([p[i][0] + dy * h, p[i][1] - dx * h]);
    }
    const f = (q) => q.map((v) => v[0].toFixed(1) + ' ' + v[1].toFixed(1)).join('L');
    if (closed) return 'M' + f(L) + 'ZM' + f(R.reverse()) + 'Z';
    return 'M' + f(L.concat(R.reverse())) + 'Z';
  }
  // ink line that draws on: tapered fill revealed by a mask stroke along its centre line
  let maskN = 0;
  function inkLine(parent, defs, pts, w, color, seed, prefix) {
    const id = prefix + '-m' + (maskN++);
    const c = sample(pts, 5, false), L = plen(c);
    const m = el('mask', { id, maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: 1920, height: 1080 }, defs);
    const mp = el('path', { d: 'M' + c.map((v) => v[0].toFixed(1) + ' ' + v[1].toFixed(1)).join('L'), fill: 'none',
      stroke: '#fff', 'stroke-width': w * 3 + 6, 'stroke-linecap': 'round', 'stroke-dasharray': L + ' ' + (L + 20) }, m);
    const path = el('path', { d: taper(pts, w, seed), fill: color, mask: 'url(#' + id + ')' }, parent);
    const set = (p) => { mp.setAttribute('stroke-dashoffset', ((1 - p) * (L + 10)).toFixed(1)); };
    set(1);
    return { path, set };
  }
  function hatch(defs, id, line, tint, gap) {
    const pt = el('pattern', { id, patternUnits: 'userSpaceOnUse', width: gap, height: gap, patternTransform: 'rotate(45)' }, defs);
    el('rect', { width: gap, height: gap, fill: tint }, pt);
    el('rect', { x: 0, y: 0, width: Math.max(2, gap * 0.32), height: gap, fill: line }, pt);
  }
  function gridPaper(svg, defs, id) {
    const pt = el('pattern', { id, patternUnits: 'userSpaceOnUse', width: 48, height: 48 }, defs);
    el('path', { d: 'M48 0V48M0 48H48', fill: 'none', stroke: 'rgb(28 26 23 / 0.055)', 'stroke-width': 1.5 }, pt);
    el('rect', { x: 0, y: 0, width: 1920, height: 1080, fill: C.paper }, svg);
    el('rect', { x: 0, y: 0, width: 1920, height: 1080, fill: 'url(#' + id + ')' }, svg);
  }
  // tiny hand pictogram, back of the hand, fingers up; the left hand has its thumb on the right
  const HAND = 'M6 22L6 10Q6 8 7.5 8Q9 8 9 10L9 4Q9 2.5 10.5 2.5Q12 2.5 12 4L12 3Q12 1.5 13.5 1.5Q15 1.5 15 3L15 4.5Q15 3 16.5 3Q18 3 18 4.5L18 14L20 11.5Q21.2 10.3 22.2 11.3Q23 12.2 22 13.5L17.5 20Q16 22 13.5 22Z';
  function hand(parent, x, y, size, which, fill, stroke) {
    const s = size / 24;
    const tr = which === 'left' ? `translate(${x - size / 2} ${y - size / 2}) scale(${s})`
                                : `translate(${x + size / 2} ${y - size / 2}) scale(${-s} ${s})`;
    return el('path', { d: HAND, transform: tr, fill, stroke: stroke || 'none', 'stroke-width': stroke ? 1.6 : 0, 'stroke-linejoin': 'round' }, parent);
  }
  // ball-and-stick molecule: a centre and four different groups; mirror = reflected across a vertical line
  const ATOMS = [[0, -44, 14], [-40, 24, 11.5], [35, 31, 8.5], [42, -14, 7]];
  function molecule(parent, kind, mirror, seed, hatchIds) {
    const g = el('g', {}, parent), sx = mirror ? -1 : 1;
    const fill = kind === 'o' ? C.o : kind === 't' ? 'url(#' + hatchIds.t + ')' : kind === 'g' ? C.g : 'url(#' + hatchIds.g + ')';
    const line = kind === 'o' ? C.oDark : kind === 't' ? C.t : '#6c6761';
    ATOMS.forEach(([x, y], i) => {
      if (i === 3) el('path', { d: `M${sx * -3} -3L${sx * x} ${y - 5}L${sx * x} ${y + 5}L${sx * 3} 3Z`, fill: C.ink }, g); // wedge
      else el('path', { d: taper([[0, 0], [sx * x, y]], 6.5, seed + i * 7), fill: C.ink }, g);
    });
    const ball = (x, y, r) => {
      el('circle', { cx: x, cy: y, r, fill, stroke: line, 'stroke-width': kind === 'o' || kind === 'g' ? 1.6 : 2.6 }, g);
      if (kind === 'o' || kind === 'g') el('circle', { cx: x - r * 0.35, cy: y - r * 0.38, r: r * 0.28, fill: '#fff', opacity: 0.32 }, g);
    };
    ATOMS.forEach(([x, y, r]) => ball(sx * x, y, r));
    ball(0, 0, 17);
    return g;
  }
  /* shot-8 the coin flip: no one-handed ingredient added; 37 runs, 19 lean one hand, 18 the other,
     each only partly one-handed (lead 15-91 points). Scene-local time only (cues-shot-8.txt). */
  const SID = 'shot-8', P = 's8', DUR = 10.751;
  const root = document.getElementById(SID);
  const svg = root.querySelector('.s8-svg');
  const defs = el('defs', {}, svg);
  gridPaper(svg, defs, P + '-grid');
  hatch(defs, P + '-ht', C.t, C.tTint, 8);
  const $ = (s) => root.querySelector(s);
  const W = { strike: [0.82, 1.30], fill0: 2.98, step: 0.072, FILL: 0.5, small: 4.98, runs: 6.19,
              one: 7.45, other: 9.06, both: 9.95 };

  // header: an orange seed dot, struck through in ink
  const seed = el('g', {}, svg);
  el('circle', { cx: 560, cy: 158, r: 24, fill: C.o, stroke: C.oDark, 'stroke-width': 2 }, seed);
  el('circle', { cx: 552, cy: 150, r: 7, fill: '#fff', opacity: 0.3 }, seed);
  const strike = inkLine(svg, defs, [[524, 192], [598, 122]], 5, C.ink, 4, P);

  // seeded runs: exactly 19 lean one hand, 18 the other, shuffled (not alternating)
  const r = ST.rand('s8-runs-37');
  const kinds = Array.from({ length: 37 }, (_, i) => (i < 19 ? 'o' : 't'));
  for (let i = kinds.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [kinds[i], kinds[j]] = [kinds[j], kinds[i]]; }
  // illustrative lead per run inside the reported 15-91 point range (both ends used once)
  const ee = kinds.map(() => r.range(0.22, 0.84));
  ee[5] = 0.15; ee[30] = 0.91;
  const order = Array.from({ length: 37 }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
  const startAt = []; order.forEach((idx, k) => { startAt[idx] = W.fill0 + k * W.step + r.range(-0.02, 0.02); });

  const OUT = [[-15, -64], [-12, -61], [-12, -30], [-43, 41], [-37, 52], [37, 52], [43, 41], [12, -30], [12, -61], [15, -64]];
  const cp = el('clipPath', { id: P + '-body', clipPathUnits: 'userSpaceOnUse' }, defs);
  el('path', { d: 'M-10 -32L-40 40L-35 49L35 49L40 40L10 -32Z' }, cp);
  const LIQ_TOP = -14, LIQ_BOT = 50, LH = LIQ_BOT - LIQ_TOP;
  const rows = [13, 12, 12], ROWY = [366, 528, 690], DX = 124;
  const flasks = [];
  let n = 0;
  rows.forEach((cnt, ri) => {
    const x0 = 960 - (cnt - 1) * DX / 2;
    for (let c = 0; c < cnt; c++, n++) {
      const x = x0 + c * DX + r.range(-4, 4), y = ROWY[ri] + r.range(-3, 3), rot = r.range(-2.5, 2.5);
      const outer = el('g', {}, svg);
      const g = el('g', { transform: `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(2)}) scale(1.22)` }, outer);
      const liq = el('g', { 'clip-path': 'url(#' + P + '-body)' }, g);
      const handR = el('rect', { x: -50, width: 100, fill: kinds[n] === 'o' ? C.o : 'url(#' + P + '-ht)' }, liq);
      const mix = el('rect', { x: -50, width: 100, fill: C.g, opacity: 0.45 }, liq);
      const line = el('rect', { x: -50, width: 100, height: 2, fill: C.ink, opacity: 0 }, liq);
      el('path', { d: taper(OUT, 3.0, 40 + n), fill: C.ink }, g);
      flasks.push({ n, outer, handR, mix, line, kind: kinds[n], ee: ee[n], at: startAt[n] });
    }
  });
  // counter chips: a tiny flask tint + hand pictogram, in front of the ink numbers
  const c1 = el('g', {}, svg), c2 = el('g', {}, svg);
  el('rect', { x: 700, y: 784, width: 40, height: 40, rx: 6, fill: C.o, stroke: C.oDark, 'stroke-width': 2.4 }, c1);
  hand(c1, 772, 804, 38, 'left', C.o);
  el('rect', { x: 1058, y: 784, width: 40, height: 40, rx: 6, fill: 'url(#' + P + '-ht)', stroke: C.t, 'stroke-width': 2.4 }, c2);
  hand(c2, 1130, 804, 38, 'right', 'url(#' + P + '-ht)', C.t);

  const show = (sel, p, dy) => { const e = $(sel); e.style.opacity = p.toFixed(3); e.style.transform = `translateY(${((1 - p) * (dy || 18)).toFixed(1)}px)`; };
  function draw(t) {
    strike.set(io(pr(t, W.strike[0], W.strike[1])));
    seed.setAttribute('opacity', (1 - 0.45 * pr(t, W.strike[1], W.strike[1] + 0.4)).toFixed(3));
    // which group is being counted: one hand on "nineteen", the other on "eighteen", then both
    const a1 = io(pr(t, W.one, W.one + 0.4)) * (1 - io(pr(t, W.other, W.other + 0.4)));
    const a2 = io(pr(t, W.other, W.other + 0.4)) * (1 - io(pr(t, W.both, W.both + 0.5)));
    flasks.forEach((f) => {
      const q = ioS(pr(t, f.at, f.at + W.FILL));
      const total = LH * q, hh = total * f.ee, mh = total - hh;
      f.handR.setAttribute('y', (LIQ_BOT - hh).toFixed(2)); f.handR.setAttribute('height', hh.toFixed(2));
      f.mix.setAttribute('y', (LIQ_BOT - total).toFixed(2)); f.mix.setAttribute('height', mh.toFixed(2));
      f.line.setAttribute('y', (LIQ_BOT - total - 1).toFixed(2)); f.line.setAttribute('opacity', q > 0.02 ? 0.5 : 0);
      const mine = f.kind === 'o' ? a1 : a2, other = f.kind === 'o' ? a2 : a1;
      f.outer.setAttribute('transform', `translate(0 ${(-8 * mine).toFixed(2)})`);
      f.outer.setAttribute('opacity', (1 - 0.6 * other).toFixed(3));
    });
    show('.s8-small', io(pr(t, W.small, W.small + 0.45)), 12);
    show('.s8-note', io(pr(t, W.runs, W.runs + 0.4)), 12);
    const p1 = io(pr(t, W.one, W.one + 0.4)), p2 = io(pr(t, W.other, W.other + 0.4));
    show('.s8-n1', p1, 14); c1.setAttribute('opacity', p1.toFixed(3));
    show('.s8-n2', p2, 14); c2.setAttribute('opacity', p2.toFixed(3));
  }
  function localT(t) { const c = ST.clips().find((k) => k.id === SID); return c ? t - c.start : t; }
  ST.onSeek((t) => { draw(clamp(localT(t), 0, DUR)); });
  draw(0);
})();
