/* shot-11: scene-local time, registers through ST.onSeek; all helpers private to this file */
(function () {
  /* ink helpers (scene-local copy, adapted from the short's shot-5 fragment; everything inside this IIFE) */
  const NS = 'http://www.w3.org/2000/svg';
  const C = { o: '#b13d0b', oDark: '#7d2a07', t: '#2b8a8f', tDark: '#1f6a6e', tTint: '#e3efed', g: '#8a8580', gTint: '#e6e2db',
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
  function quad(a, c, b, n) { const o = []; for (let i = 0; i <= n; i++) { const s = i / n, m = 1 - s; o.push([m * m * a[0] + 2 * m * s * c[0] + s * s * b[0], m * m * a[1] + 2 * m * s * c[1] + s * s * b[1]]); } return o; }
  function join(parts) { let o = []; parts.forEach((p, k) => { o = o.concat(k ? p.slice(1) : p); }); return o; }
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
    const m = el('mask', { id, maskUnits: 'userSpaceOnUse', x: -400, y: -400, width: 2720, height: 1880 }, defs);
    const mp = el('path', { d: 'M' + c.map((v) => v[0].toFixed(1) + ' ' + v[1].toFixed(1)).join('L'), fill: 'none',
      stroke: '#fff', 'stroke-width': w * 3 + 6, 'stroke-linecap': 'round', 'stroke-dasharray': L + ' ' + (L + 20) }, m);
    const path = el('path', { d: taper(pts, w, seed), fill: color, mask: 'url(#' + id + ')' }, parent);
    const set = (p) => { mp.setAttribute('stroke-dashoffset', ((1 - p) * (L + 10)).toFixed(1)); path.style.display = p <= 0.001 ? 'none' : ''; };
    set(1);
    return { path, set };
  }
  function hatch(defs, id, line, tint, gap) {
    const pt = el('pattern', { id, patternUnits: 'userSpaceOnUse', width: gap, height: gap, patternTransform: 'rotate(45)' }, defs);
    el('rect', { width: gap, height: gap, fill: tint }, pt);
    el('rect', { x: 0, y: 0, width: Math.max(2, gap * 0.34), height: gap, fill: line }, pt);
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
  // the final-lead histogram (shared by shot-9 and shot-10): 41 bins from all mirror hand (-1) to all one hand (+1)
  const CH = { x0: 880, x1: 1800, base: 760, top: 330 };
  function makeChart(parent, defs, P, HID) {
    const g = el('g', {}, parent);
    const W = (CH.x1 - CH.x0) / 41;
    const axisX = inkLine(g, defs, [[CH.x0 - 16, CH.base + 2], [CH.x1 + 16, CH.base]], 4.2, C.ink, 5, P);
    const axisY = inkLine(g, defs, [[CH.x0 - 16, CH.base + 4], [CH.x0 - 18, CH.top - 40]], 3.6, C.ink, 3, P);
    const mid = el('path', { d: `M${(CH.x0 + CH.x1) / 2} ${CH.base + 14}V${CH.top + 20}`, stroke: C.ink, 'stroke-width': 2, 'stroke-dasharray': '7 9', fill: 'none', opacity: 0.45 }, g);
    const bars = [];
    for (let i = 0; i < 41; i++) {
      const c = i === 20 ? 'g' : i < 20 ? 't' : 'o';
      const x = CH.x0 + i * W + 1.5;
      const fill = c === 'o' ? C.o : c === 't' ? 'url(#' + HID.t + ')' : C.g;
      const r = el('rect', { x, y: CH.base, width: W - 3, height: 0, fill, stroke: c === 'o' ? C.oDark : c === 't' ? C.t : '#6c6761', 'stroke-width': c === 't' ? 2.2 : 1.4 }, g);
      bars.push(r);
    }
    const hl = hand(g, CH.x0 + 10, CH.base + 34, 34, 'right', 'url(#' + HID.t + ')', C.t);
    const hr = hand(g, CH.x1 - 10, CH.base + 34, 34, 'left', C.o);
    function set(counts, ymax, ap) {
      const H = CH.base - CH.top;
      for (let i = 0; i < 41; i++) {
        const h = Math.max(0, counts[i] / ymax * H);
        bars[i].setAttribute('y', (CH.base - h).toFixed(2));
        bars[i].setAttribute('height', h.toFixed(2));
        bars[i].style.display = h < 0.3 ? 'none' : '';
      }
      const a = ap == null ? 1 : ap;
      axisX.set(a); axisY.set(a); mid.setAttribute('opacity', (0.45 * a).toFixed(3));
      hl.setAttribute('opacity', a.toFixed(3)); hr.setAttribute('opacity', a.toFixed(3));
    }
    return { g, set, W };
  }
  const fmt = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  /* shot-11 why it matters: scene-local time only. Frame 0 = both keys, the lock and the mirror line.
     "medicines" 1.66: the Nobel Committee line (needs >= 6.3 s on screen, so it comes in early);
     "one form" 2.77: the orange key slides in, turns on "does" 3.34, the shackle opens on "job" 3.64;
     "mirror image" 4.71: the hatched mirror key edges toward the lock (it does not fit);
     "cause" 5.61: its ink label writes on; payoff typed 7.25-7.85 (held 2.5 s to the end). */
  const SID = 'shot-11', P = 's11', DUR = 10.547;
  const root = document.getElementById(SID);
  const svg = root.querySelector('.s11-svg');
  const defs = el('defs', {}, svg);
  const $ = (s) => root.querySelector(s);
  gridPaper(svg, defs, P + '-grid');
  hatch(defs, P + '-ht', C.t, C.tTint, 10);
  const show = (sel, p, dy) => { const e = $(sel); e.style.opacity = p.toFixed(3); e.style.transform = `translateY(${((1 - p) * (dy == null ? 14 : dy)).toFixed(1)}px)`; };
  const reveal = (sel, p) => { const e = $(sel); e.style.opacity = p > 0 ? 1 : 0; e.style.clipPath = `inset(-10px ${((1 - p) * 100).toFixed(2)}% -10px -10px)`; };

  const KY = 600, REST = 420;
  const art = el('g', { transform: 'translate(960 600) scale(1.2) translate(-960 -600)' }, svg);   // keys, lock and mirror line
  // the mirror line
  el('path', { d: 'M960 360V800', stroke: C.ink, 'stroke-width': 3, 'stroke-dasharray': '14 12', fill: 'none', opacity: 0.55 }, art);
  // the shackle (behind the key and the body)
  const shG = el('g', {}, art);
  el('path', { d: taper(join([[[900, 540], [900, 456]], quad([900, 456], [900, 394], [960, 394], 10), quad([960, 394], [1020, 394], [1020, 456], 10), [[1020, 456], [1020, 540]]]), 22, 61), fill: C.ink }, shG);

  // one key, bow at the origin, pointing right; teeth below the blade (a flat key is its own 2-D hand)
  const BLADE = 'M50 -15L300 -15L318 -4L318 15L300 15L292 46L270 46L262 32L244 32L236 56L212 56L204 28L186 28L178 44L156 44L150 15L50 15Z';
  const BOW = 'M62 0A62 62 0 1 1 -62 0A62 62 0 1 1 62 0ZM-17 0A13 13 0 1 0 -43 0A13 13 0 1 0 -17 0Z';
  function key(parent, kind) {
    const g = el('g', {}, parent);
    const fill = kind === 'o' ? C.o : 'url(#' + P + '-ht)', line = kind === 'o' ? C.oDark : C.t, sw = kind === 'o' ? 2.6 : 3.6;
    el('path', { d: BLADE, fill, stroke: line, 'stroke-width': sw, 'stroke-linejoin': 'round' }, g);
    el('path', { d: 'M70 -1L292 -1', stroke: kind === 'o' ? C.oDark : C.t, 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.8 }, g);
    el('path', { d: BOW, fill, stroke: line, 'stroke-width': sw, 'fill-rule': 'evenodd' }, g);
    if (kind === 'o') hand(g, 16, 0, 50, 'left', C.paper);
    else { el('circle', { cx: 16, cy: 0, r: 30, fill: C.paper, stroke: C.t, 'stroke-width': 2 }, g); hand(g, 16, 0, 46, 'left', C.paper, C.tDark); }
    return g;
  }
  const keyO = key(art, 'o');
  const mirrorG = el('g', { transform: 'translate(1920 0) scale(-1 1)' }, art);   // reflected across the mirror line x = 960
  const keyT = key(mirrorG, 't');
  // the lock body (in front of the blade)
  const body = el('g', {}, art);
  el('path', { d: 'M886 524L1034 524L1060 550L1060 678L1034 704L886 704L860 678L860 550Z', fill: '#e7dfcf' }, body);
  el('path', { d: taper([[886, 524], [1034, 524], [1060, 550], [1060, 678], [1034, 704], [886, 704], [860, 678], [860, 550]], 5, 63, true), fill: C.ink }, body);
  el('rect', { x: 856, y: 582, width: 14, height: 36, rx: 3, fill: C.ink }, body);
  el('circle', { cx: 960, cy: 648, r: 9, fill: 'none', stroke: C.ink, 'stroke-width': 2.4, opacity: 0.6 }, body);
  // ink tick for "does the job"
  const tick = inkLine(svg, defs, [[318, 770], [334, 790], [372, 742]], 6, C.o, 65, P);
  // payoff typed letter by letter
  const pay = $('.s11-pay'), TEXT = 'La química aprendió a elegir una mano.';
  const chars = TEXT.split('').map((ch) => { const s = document.createElement('span'); s.textContent = ch; pay.appendChild(s); return s; });

  const T = { foot: [1.60, 2.05], ins: [2.75, 3.30], turn: [3.34, 3.70], open: [3.62, 3.98], job: [3.34, 3.74], nudge: [4.65, 5.20],
              s1: [5.50, 6.10], s2: [6.00, 6.60], type: [7.25, 7.85] };
  function draw(t) {
    const dx = 300 * io(pr(t, T.ins[0], T.ins[1])), sy = lerp(1, 0.3, ioS(pr(t, T.turn[0], T.turn[1])));
    keyO.setAttribute('transform', `translate(${(REST + dx).toFixed(1)} ${KY}) scale(1 ${sy.toFixed(3)})`);
    const nd = 70 * io(pr(t, T.nudge[0], T.nudge[1])) + 2.5 * ST.noise(t * 0.4, 9) * pr(t, T.nudge[1], T.nudge[1] + 0.5);
    keyT.setAttribute('transform', `translate(${(REST + nd).toFixed(1)} ${KY})`);
    shG.setAttribute('transform', `translate(0 ${(-38 * io(pr(t, T.open[0], T.open[1]))).toFixed(1)})`);
    show('.s11-job', io(pr(t, T.job[0], T.job[1])), 12);
    tick.set(io(pr(t, T.job[0] + 0.15, T.job[1] + 0.2)));
    reveal('.s11-side1', ioS(pr(t, T.s1[0], T.s1[1])));
    reveal('.s11-side2', ioS(pr(t, T.s2[0], T.s2[1])));
    show('.s11-foot', io(pr(t, T.foot[0], T.foot[1])), 10);
    const n = TEXT.length * pr(t, T.type[0], T.type[1]);
    chars.forEach((s, i) => { s.style.opacity = clamp(n - i, 0, 1).toFixed(3); });
  }
  function localT(t) { const c = ST.clips().find((k) => k.id === SID); return c ? t - c.start : t; }
  ST.onSeek((t) => { draw(clamp(localT(t), 0, DUR)); });
  draw(0);

})();
