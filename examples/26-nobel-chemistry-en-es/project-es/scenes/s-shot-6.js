/* shot-6: scene-local, registers through ST.onSeek; all helpers private to this file */
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
  /* shot-6 Soai's copier (full video): autocatalysis only. Grey simple-ingredient dots are turned
     into NEW orange molecules by orange ones, 1 -> 2 -> 4 -> 8. No teal, no mixed pairs.
     Scene-local time only (word times from cues-shot-6.txt). */
  const SID = 'shot-6', P = 's6', DUR = 10.821;
  const root = document.getElementById(SID);
  const svg = root.querySelector('.s6-svg');
  const defs = el('defs', {}, svg);
  gridPaper(svg, defs, P + '-grid');
  const $ = (s) => root.querySelector(s);
  const W = { tick3: [2.92, 3.34], ring: [4.26, 4.80], births: [5.03, 5.67, 6.58], same: 7.45, simple: 8.90 };

  // ---------- recap strip: Frank's three boxes, top-left ----------
  const strip = el('g', {}, svg);
  const boxes = [0, 1, 2].map((k) => {
    const x = 128 + k * 110, y = 54;
    el('path', { d: taper([[x, y], [x + 40, y + 1], [x + 40, y + 40], [x - 1, y + 40]], 3, 70 + k, true), fill: C.ink }, strip);
    const tk = inkLine(strip, defs, [[x + 7, y + 20], [x + 17, y + 32], [x + 44, y - 6]], 5, C.ink, 80 + k, P);
    return tk;
  });

  // ---------- ingredient dots ----------
  const field = el('g', {}, svg);
  const rnd = ST.rand('s6-field');
  const keepOut = (x, y) => (x > 470 && x < 1450 && y > 220 && y < 750) || (x > 660 && x < 1260 && y > 740 && y < 870)
    || (x > 1430 && x < 1830 && y > 760 && y < 860) || (y < 240 && x < 800);
  const free = [];
  while (free.length < 30) {
    const x = rnd.range(170, 1760), y = rnd.range(250, 880);
    if (keepOut(x, y) || free.some((d) => Math.hypot(d.x - x, d.y - y) < 92)) continue;
    free.push({ x, y, s: free.length });
  }
  const LABEL_DOT = { x: 1470, y: 816, s: 99 };
  free.push(LABEL_DOT);
  const dotEl = (parent) => el('circle', { r: 10.5, fill: C.g, stroke: '#6c6761', 'stroke-width': 1.6 }, parent);
  free.forEach((d) => { d.e = dotEl(field); });

  // ---------- the molecules ----------
  const L = {
    1: [[960, 520]],
    2: [[840, 520], [1080, 520]],
    4: [[840, 410], [1080, 410], [840, 640], [1080, 640]],
    8: [[840, 410], [1080, 410], [840, 640], [1080, 640], [600, 410], [1320, 410], [600, 640], [1320, 640]]
  };
  const EMERGE = 0.62, APPROACH = 0.62;
  const mols = [];
  for (let j = 0; j < 8; j++) {
    const gen = j === 0 ? -1 : Math.floor(Math.log2(j));
    const nPrev = gen < 0 ? 1 : 1 << gen;
    mols.push({ j, gen, born: gen < 0 ? -1 : W.births[gen], parent: gen < 0 ? -1 : j - nPrev, rot: j === 0 ? -8 : rnd.range(-18, 18) });
  }
  // where molecule j sits at time t (follows the layouts as the group grows)
  const LAY = [1, 2, 4, 8];
  function posAt(j, t) {
    let p = null;
    for (let g = 0; g < 3; g++) {
      const n = LAY[g + 1], b = W.births[g];
      if (j >= n) continue;
      const q = io(pr(t, b, b + EMERGE));
      if (j < LAY[g]) {
        const a = p || L[LAY[g]][j];
        p = [lerp(a[0], L[n][j][0], q), lerp(a[1], L[n][j][1], q)];
      } else if (mols[j].gen === g) {
        const par = posAt(mols[j].parent, b);
        p = [lerp(par[0], L[n][j][0], q), lerp(par[1], L[n][j][1], q)];
      }
    }
    return p || L[1][0];
  }
  // seven fed dots: they start in the field and travel to the molecule that turns them into a new one
  const fed = [];
  for (let j = 1; j < 8; j++) {
    const tgt = L[LAY[mols[j].gen + 1]][j];
    // start on the side the new molecule will go to, a little further out
    const side = tgt[0] < 960 ? -1 : 1;
    const sx = 960 + side * rnd.range(560, 720), sy = clamp(tgt[1] + rnd.range(-170, 170), 250, 860);
    const d = { j, x: sx, y: sy, s: 40 + j };
    d.e = dotEl(field);
    fed.push(d);
  }
  mols.forEach((m) => { m.g = el('g', {}, svg); molecule(m.g, 'o', false, 11 + m.j, {}); });
  const ring = el('circle', { cx: 960, cy: 520, r: 118, fill: 'none', stroke: C.ink, 'stroke-width': 2.6, 'stroke-dasharray': '745', 'stroke-linecap': 'round' }, svg);
  ring.setAttribute('transform', 'rotate(-90 960 520)');
  // "same hand" pictogram next to its label; leader from the label dot
  const sameHand = hand(svg, 766, 264, 50, 'left', C.o);
  const leader = inkLine(svg, defs, [[1486, 812], [1512, 802]], 2.4, C.ink, 7, P);

  // every ingredient drifts slowly toward the molecules (the feed), with a little seeded wobble
  // each dot's drift stops 40 px short of the molecules, the counter and the labels
  const reach = (d) => { const sg = Math.sign(960 - d.x); let k = 0; while (k < 80 && !keepOut(d.x + sg * (k + 40), d.y)) k += 2; return k; };
  free.forEach((d) => { d.reach = reach(d); });
  const wob = (d, t) => [d.x + Math.sign(960 - d.x) * Math.min(d.reach == null ? 80 : d.reach, 8 * t) + 9 * ST.noise(t * 0.28, 900 + d.s), d.y + 9 * ST.noise(t * 0.25, 700 + d.s)];
  const show = (sel, p, dy) => { const e = $(sel); e.style.opacity = p.toFixed(3); e.style.transform = `translateY(${((1 - p) * (dy || 18)).toFixed(1)}px)`; };

  function draw(t) {
    // strip: boxes 1 and 2 already ticked; box 3 inks on "ticked box three"
    boxes[0].set(1); boxes[1].set(1); boxes[2].set(io(pr(t, W.tick3[0], W.tick3[1])));
    show('.s6-note', io(pr(t, 1.70, 2.15)), 14);
    free.forEach((d) => { const [x, y] = d === LABEL_DOT ? [d.x + 4 * ST.noise(t * 0.3, 99), d.y + 4 * ST.noise(t * 0.3, 98)] : wob(d, t); d.e.setAttribute('cx', x.toFixed(1)); d.e.setAttribute('cy', y.toFixed(1)); });
    fed.forEach((d) => {
      const m = mols[d.j], b = m.born;
      const par = posAt(m.parent, b);
      const tg = L[LAY[m.gen + 1]][d.j];
      const ux = tg[0] - par[0], uy = tg[1] - par[1], ul = Math.hypot(ux, uy) || 1;
      const contact = [par[0] + ux / ul * 84, par[1] + uy / ul * 84];
      const w = wob(d, t), q = ioS(pr(t, b - APPROACH, b));
      const x = lerp(w[0], contact[0], q), y = lerp(w[1], contact[1], q);
      const gone = pr(t, b, b + 0.16);
      d.e.setAttribute('cx', x.toFixed(1)); d.e.setAttribute('cy', y.toFixed(1));
      d.e.setAttribute('r', (10.5 * (1 - 0.5 * gone)).toFixed(2));
      d.e.setAttribute('opacity', (1 - gone).toFixed(3));
      d.e.style.display = gone >= 1 ? 'none' : '';
    });
    mols.forEach((m) => {
      const [x0, y0] = posAt(m.j, t);
      let s = 1.45, o = 1;
      if (m.j > 0) {
        const q = io(pr(t, m.born, m.born + EMERGE));
        s = lerp(0.6, 1.45, q); o = pr(t, m.born, m.born + 0.2);
      }
      // a parent swells a little while it builds a new one
      mols.forEach((c) => { if (c.parent === m.j) s *= 1 + 0.06 * Math.sin(Math.PI * pr(t, c.born - 0.15, c.born + 0.45)); });
      const x = x0 + 3 * ST.noise(t * 0.3, 200 + m.j), y = y0 + 3 * ST.noise(t * 0.27, 300 + m.j);
      const r = m.rot + 4 * ST.noise(t * 0.22, 400 + m.j);
      m.g.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${r.toFixed(1)}) scale(${s.toFixed(3)})`);
      m.g.setAttribute('opacity', o.toFixed(3));
      m.g.style.display = o <= 0.001 ? 'none' : '';
    });
    const rp = io(pr(t, W.ring[0], W.ring[1]));
    ring.setAttribute('stroke-dashoffset', ((1 - rp) * 745).toFixed(1));
    ring.setAttribute('opacity', (0.85 * (1 - pr(t, 5.0, 5.35))).toFixed(3));
    ring.style.display = rp <= 0 || t > 5.35 ? 'none' : '';
    // counter 1 -> 2 -> 4 -> 8, each step on its birth
    W.births.forEach((b, g) => show('.s6-c' + (g + 1), io(pr(t, b + 0.22, b + 0.62)), 12));
    const sp = io(pr(t, W.same, W.same + 0.45));
    show('.s6-same', sp, 14); sameHand.setAttribute('opacity', sp.toFixed(3));
    const ip = io(pr(t, W.simple, W.simple + 0.4));
    show('.s6-simple', ip, 12); leader.set(ip);
  }
  function localT(t) { const c = ST.clips().find((k) => k.id === SID); return c ? t - c.start : t; }
  ST.onSeek((t) => { draw(clamp(localT(t), 0, DUR)); });
  draw(0);
})();
