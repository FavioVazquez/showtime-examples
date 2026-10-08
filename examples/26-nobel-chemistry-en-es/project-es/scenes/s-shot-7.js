/* shot-7: scene-local, registers through ST.onSeek; all helpers private to this file */
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
  /* shot-7 the staircase: four notebook bars, start (a hairline) -> run 1 57% -> run 2 99% -> run 3 >99.5%.
     The y-axis is "lead" (defined on screen the whole shot). Scene-local time only (cues-shot-7.txt). */
  const SID = 'shot-7', P = 's7', DUR = 16.334;
  const root = document.getElementById(SID);
  const svg = root.querySelector('.s7-svg');
  const defs = el('defs', {}, svg);
  gridPaper(svg, defs, P + '-grid');
  const $ = (s) => root.querySelector(s);
  const W = {
    lead: [2.74, 3.30],                // underline "ventaja" on its word
    hair: [3.17, 3.55], callout: [3.40, 3.85],
    arrows: [[6.00, 6.45], [6.30, 6.75], [6.60, 7.05]], seeds: 6.04,
    grow: [[7.30, 8.10], [9.55, 10.35], [11.58, 12.45]],
    val: [7.76, 9.95, 11.90]
  };
  const BASE = 762, TOP = 344, H = BASE - TOP;      // 100 % = 418 px
  const AX = 300, BX = [520, 860, 1200, 1540], BW = 168;
  const chart = el('g', {}, svg);
  // axes, already drawn at frame 0 (the page is set up; the data arrives on its words)
  el('path', { d: taper([[AX, BASE + 6], [AX + 1, TOP - 30]], 4, 3), fill: C.ink }, chart);
  el('path', { d: taper([[AX - 6, BASE], [1680, BASE + 2]], 4.2, 5), fill: C.ink }, chart);
  el('path', { d: taper([[AX - 16, TOP], [AX + 14, TOP]], 3, 9), fill: C.ink }, chart);
  el('path', { d: taper([[AX - 16, BASE - H / 2], [AX + 10, BASE - H / 2]], 2.6, 10), fill: C.ink }, chart);
  el('path', { d: `M${AX + 20} ${TOP}H1660`, stroke: C.ink, 'stroke-width': 1.5, 'stroke-dasharray': '3 10', opacity: 0.32 }, chart);
  // a pencilled base slot for each bar
  BX.forEach((x, i) => el('path', { d: `M${x - BW / 2} ${BASE - 1}V${BASE - 14}M${x + BW / 2} ${BASE - 1}V${BASE - 14}`, stroke: C.ink, 'stroke-width': 2, opacity: 0.35 }, chart));
  const vals = [0, 0.57, 0.99, 0.996];
  const bars = BX.map((x, i) => {
    const g = el('g', {}, chart);
    if (i === 0) return { g };
    const h = vals[i] * H;
    el('rect', { x: x - BW / 2, y: BASE - h, width: BW, height: h, fill: C.o }, g);
    el('path', { d: taper([[x - BW / 2, BASE], [x - BW / 2, BASE - h], [x + BW / 2, BASE - h], [x + BW / 2, BASE]], 3.4, 30 + i), fill: C.oDark }, g);
    hand(g, x, BASE - 30, 32, 'left', C.paper);
    return { g };
  });
  // start: a hairline, a ring around it and a leader up to the callout
  const hair = el('rect', { x: BX[0] - BW / 2, y: BASE - 3, width: BW, height: 3, fill: C.o }, chart);
  const ring = el('ellipse', { cx: BX[0], cy: BASE - 2, rx: BW / 2 + 16, ry: 15, fill: 'none', stroke: C.ink, 'stroke-width': 2.4 }, chart);
  const lead = inkLine(chart, defs, [[BX[0], BASE - 20], [BX[0] + 2, 640]], 2.6, C.ink, 13, P);
  // small ink arrows between the bars: each run's product seeds the next
  const arrows = [0, 1, 2].map((k) => {
    const x0 = BX[k] + BW / 2 + 14, x1 = BX[k + 1] - BW / 2 - 14, y = BASE - 58;
    const mid = [(x0 + x1) / 2, y - 40];
    const pts = [];
    for (let s = 0; s <= 16; s++) { const u = s / 16; pts.push([lerp(lerp(x0, mid[0], u), lerp(mid[0], x1, u), u), lerp(lerp(y, mid[1], u), lerp(mid[1], y + 6, u), u)]); }
    const body = inkLine(chart, defs, pts, 3.4, C.ink, 60 + k, P);
    const head = el('path', { d: taper([[x1 - 18, y - 12], [x1, y + 6], [x1 - 24, y + 10]], 3.4, 70 + k), fill: C.ink }, chart);
    return { body, head };
  });
  // the underline under "ventaja" (Spanish label, wider)
  const ul = inkLine(svg, defs, [[98, 246], [262, 248]], 4, C.o, 21, P);

  const show = (sel, p, dy) => { const e = $(sel); e.style.opacity = p.toFixed(3); e.style.transform = `translateY(${((1 - p) * (dy || 18)).toFixed(1)}px)`; };
  // the start slot inks under its label on "started"
  const startLine = inkLine(chart, defs, [[BX[0] - BW / 2 - 6, BASE + 66], [BX[0] + BW / 2 + 6, BASE + 68]], 3.4, C.o, 17, P);
  function draw(t) {
    show('.s7-note', io(pr(t, 0.40, 0.85)), 12);
    startLine.set(io(pr(t, 2.21, 2.70)));
    ul.set(io(pr(t, W.lead[0], W.lead[1])));
    const hp = io(pr(t, W.hair[0], W.hair[1]));
    hair.setAttribute('opacity', hp.toFixed(3));
    ring.setAttribute('opacity', (0.9 * hp).toFixed(3));
    lead.set(io(pr(t, W.hair[0] + 0.1, W.hair[1] + 0.2)));
    show('.s7-callout', io(pr(t, W.callout[0], W.callout[1])), 14);
    arrows.forEach((a, k) => {
      const q = io(pr(t, W.arrows[k][0], W.arrows[k][1]));
      a.body.set(q); a.head.setAttribute('opacity', pr(t, W.arrows[k][1] - 0.12, W.arrows[k][1]).toFixed(3));
    });
    show('.s7-seeds', io(pr(t, W.seeds, W.seeds + 0.45)), 12);
    bars.forEach((b, i) => {
      if (i === 0) return;
      const g = io(pr(t, W.grow[i - 1][0], W.grow[i - 1][1]));
      b.g.setAttribute('transform', `translate(0 ${BASE}) scale(1 ${Math.max(0.0001, g).toFixed(4)}) translate(0 ${-BASE})`);
      b.g.style.display = g > 0 ? '' : 'none';
      show('.s7-v' + i, io(pr(t, W.val[i - 1], W.val[i - 1] + 0.4)), 14);
    });
  }
  function localT(t) { const c = ST.clips().find((k) => k.id === SID); return c ? t - c.start : t; }
  ST.onSeek((t) => { draw(clamp(localT(t), 0, DUR)); });
  draw(0);
})();
