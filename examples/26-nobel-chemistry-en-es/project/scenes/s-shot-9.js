/* shot-9: scene-local time, registers through ST.onSeek; all helpers private to this file */
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

  /* shot-9 our mirror race: scene-local time only. Beats from cues-shot-9.txt (scene-relative):
     race 0.45-2.90 (one copy-only toy run from race_runs.json) -> "ten" 3.23 histogram builds run by run
     (first_400_bin for ~0.8 s, then eased to the 10,000-run counts), flat on "anywhere" 4.61 ->
     "Add" 5.70 switch card, tick on "two," 6.42 -> pair forms on "pair" 8.85, label on "stop" 9.36 ->
     morph 9.80-12.60 into the with_antagonism counts, done on "taking over" 12.56-12.84 ->
     coin on "Which" 13.68, counters on "coin" 14.45. */
  const SID = 'shot-9', P = 's9', DUR = 17.499;
  const root = document.getElementById(SID);
  const svg = root.querySelector('.s9-svg');
  const defs = el('defs', {}, svg);
  const $ = (s) => root.querySelector(s);
  gridPaper(svg, defs, P + '-grid');
  hatch(defs, P + '-ht', C.t, C.tTint, 9);
  hatch(defs, P + '-hg', C.g, C.gTint, 9);
  hatch(defs, P + '-htc', C.t, C.tTint, 12);
  const HID = { t: P + '-ht', g: P + '-hg' };
  const show = (sel, p, dy) => { const e = $(sel); e.style.opacity = p.toFixed(3); e.style.transform = `translateY(${((1 - p) * (dy == null ? 14 : dy)).toFixed(1)}px)`; };

  // ---------- the flask (left column) ----------
  const FX = (X) => 360 + (X - 760) * 0.78, FY = (Y) => 250 + (Y - 146) * 0.78;
  const flaskPts = join([
    quad([672, 146], [700, 146], [700, 172], 6), [[700, 172], [700, 360], [482, 792]], quad([482, 792], [458, 850], [532, 850], 12),
    [[532, 850], [988, 850], [1038, 792]].slice(0, 2), quad([988, 850], [1062, 850], [1038, 792], 12),
    [[1038, 792], [820, 360], [820, 172]], quad([820, 172], [820, 146], [848, 146], 6)
  ]).map(([x, y]) => [FX(x), FY(y)]);
  const flaskG = el('g', {}, svg);
  el('path', { d: taper(flaskPts, 6, 21), fill: C.ink }, flaskG);
  // seeded dot slots, packed bottom-up (shot-3's packing, finer)
  const rnd = ST.rand('s9-flask');
  const halfWidth = (y) => { let hw = 60 + (Math.min(y, 792) - 360) / 432 * 218 - 22; if (y > 796) hw -= (y - 796) * 1.25; return hw; };
  const slots = [];
  for (let y = 828, row = 0; slots.length < 120 && y > 300; y -= 30, row++) {
    const hw = halfWidth(y), xs = [], off = row % 2 ? 17 : 0;
    for (let x = -400 + off; x <= 400; x += 34) if (Math.abs(x) <= hw) xs.push(x);
    for (let k = xs.length - 1; k > 0; k--) { const j = Math.floor(rnd() * (k + 1)); [xs[k], xs[j]] = [xs[j], xs[k]]; }
    xs.forEach((x) => slots.push([FX(760 + x + rnd.range(-2.5, 2.5)), FY(y + rnd.range(-2.5, 2.5))]));
  }
  slots.length = Math.min(slots.length, 120);
  const NDOT = slots.length;
  const dotG = el('g', {}, flaskG);
  // tally bar under the flask: share of each hand among the dots made so far
  const TB = { x: 190, y: 830, w: 340, h: 30 };
  const tallyG = el('g', {}, flaskG);
  const tO = el('rect', { x: TB.x, y: TB.y, width: 0, height: TB.h, fill: C.o }, tallyG);
  const tT = el('rect', { x: TB.x, y: TB.y, width: 0, height: TB.h, fill: 'url(#' + HID.t + ')' }, tallyG);
  el('rect', { x: TB.x, y: TB.y, width: TB.w, height: TB.h, fill: 'none', stroke: C.ink, 'stroke-width': 2.4, rx: 3 }, tallyG);
  el('path', { d: `M${TB.x + TB.w / 2} ${TB.y - 12}V${TB.y + TB.h + 12}`, stroke: C.ink, 'stroke-width': 2.2, 'stroke-dasharray': '6 6' }, tallyG);
  hand(tallyG, TB.x - 26, TB.y + TB.h / 2, 30, 'left', C.o);
  hand(tallyG, TB.x + TB.w + 26, TB.y + TB.h / 2, 30, 'right', 'url(#' + HID.t + ')', C.t);

  // ---------- the chart (right) ----------
  const chart = makeChart(svg, defs, P, HID);
  const flatLine = el('path', { d: '', stroke: C.ink, 'stroke-width': 2.4, 'stroke-dasharray': '10 8', fill: 'none' }, svg);

  // ---------- box 2: the switch card and the grey pair (left column) ----------
  const swG = el('g', {}, svg);
  const box = el('rect', { x: 86, y: 208, width: 40, height: 40, rx: 4, fill: 'none', stroke: C.ink, 'stroke-width': 3, 'stroke-dasharray': '170', 'stroke-dashoffset': '170' }, swG);
  const tick = inkLine(swG, defs, [[93, 226], [104, 241], [133, 200]], 6, C.o, 17, P);
  const under = inkLine(swG, defs, [[142, 262], [440, 264], [760, 260]], 3, C.ink, 19, P);
  const pairG = el('g', {}, svg);
  const mO = el('g', {}, pairG); molecule(mO, 'o', false, 31, HID);
  const mT = el('g', {}, pairG); molecule(mT, 't', true, 37, HID);
  const grey = el('g', { opacity: 0 }, pairG);
  el('rect', { x: -140, y: -72, width: 280, height: 144, rx: 36, fill: 'none', stroke: C.g, 'stroke-width': 3, 'stroke-dasharray': '2 9', 'stroke-linecap': 'round' }, grey);
  const ga = el('g', { transform: 'translate(-56 0) scale(0.92)' }, grey); molecule(ga, 'g', false, 31, HID);
  const gb = el('g', { transform: 'translate(56 0) scale(0.92)' }, grey); molecule(gb, 'gh', true, 37, HID);
  const strike = inkLine(pairG, defs, [[282, 602], [560, 436]], 4, C.ink, 23, P);

  // ---------- the coin ----------
  const coin = el('g', { opacity: 0 }, svg);
  const coinRim = el('ellipse', { cx: 0, cy: 0, rx: 50, ry: 50, fill: '#5e2005' }, coin);
  const coinFace = el('ellipse', { cx: 0, cy: 0, rx: 46, ry: 46, fill: C.o, stroke: C.oDark, 'stroke-width': 2 }, coin);
  const coinInner = el('ellipse', { cx: 0, cy: 0, rx: 36, ry: 36, fill: 'none', stroke: C.paper, 'stroke-width': 2, opacity: 0.7 }, coin);
  const coinHandL = hand(coin, 0, 0, 40, 'left', C.paper);
  const coinHandR = hand(coin, 0, 0, 40, 'right', C.paper, C.tDark);

  // ---------- data ----------
  let D = null;
  function hist(binList, n) {
    const c = new Array(41).fill(0), k = Math.floor(n);
    for (let i = 0; i < k && i < binList.length; i++) c[binList[i]] += 1;
    if (k < binList.length && n > k) c[binList[k]] += n - k;   // the next run's block lands smoothly
    return c;
  }
  function prepare(h, r) {
    const run = r.copy_only.runs[1];                                 // one real copy-only toy run (final lead +0.41)
    const used = r.molecules_used, N = r.N;
    const at = (m) => {                                              // free one / mirror molecules after m of A used
      let j = 1; while (j < used.length - 1 && used[j] < m) j++;
      const u = clamp((m - used[j - 1]) / ((used[j] - used[j - 1]) || 1), 0, 1);
      return [lerp(run.one[j - 1], run.one[j], u), lerp(run.mirror[j - 1], run.mirror[j], u)];
    };
    const hands = []; let no = 0;
    for (let k = 1; k <= NDOT; k++) {
      const [a, b] = at(k * N / NDOT), target = Math.round(k * a / Math.max(1e-9, a + b));
      if (target > no) { hands.push('o'); no++; } else hands.push('t');
    }
    const dots = slots.map((p, k) => {
      const g = el('g', { opacity: 0 }, dotG);
      if (hands[k] === 'o') el('circle', { r: 10.5, fill: C.o, stroke: C.oDark, 'stroke-width': 1.4 }, g);
      else el('circle', { r: 10.5, fill: 'url(#' + HID.t + ')', stroke: C.t, 'stroke-width': 2.4 }, g);
      return { g, hand: hands[k], to: p, from: [360 + rnd.range(-16, 16), 236], t0: 0.45 + 2.45 * k / NDOT };
    });
    const c400 = hist(h.first_400_bin.copy_only, 400);
    D = { dots, copy: h.counts.copy_only, anta: h.counts.with_antagonism, b400: h.first_400_bin.copy_only, c400 };
  }

  const T = { fade: [5.10, 5.60], axes: [2.95, 3.45], b1: [3.25, 4.05], b2: [4.05, 4.75], flat: [4.70, 5.10], flatOut: [6.55, 6.85],
              card: [5.70, 6.15], tick: [6.42, 6.72], cond: [6.42, 6.90], mol: [6.95, 7.35], meet: [8.20, 8.85], grey: [8.85, 9.15],
              plab: [9.36, 9.76], rescale: [9.80, 10.80], morph: [10.20, 12.60], pct: [12.40, 12.80], coin: [13.62, 13.95],
              cnt: [14.45, 14.85], coinOut: [16.85, 17.35] };
  // the last half second clears everything but the bars and the label, so shot-10 starts from the bare chart

  function draw(t) {
    if (!D) return;
    // flask and its run
    const fo = 1 - ioS(pr(t, T.fade[0], T.fade[1]));
    const off = 600 * (1 - io(pr(t, 2.85, 3.45)));                 // the flask starts centred, then makes room for the chart
    flaskG.setAttribute('opacity', fo.toFixed(3));
    flaskG.setAttribute('transform', `translate(${off.toFixed(1)} 0)`);
    $('.s9-runlab').style.transform = `translateX(${off.toFixed(1)}px)`;
    flaskG.style.display = fo <= 0.001 ? 'none' : '';
    $('.s9-runlab').style.opacity = fo.toFixed(3);
    let no = 0, nt = 0;
    D.dots.forEach((d, k) => {
      const p = io(pr(t, d.t0, d.t0 + 0.42));
      if (p <= 0) { d.g.setAttribute('opacity', 0); return; }
      if (p >= 0.5) { if (d.hand === 'o') no++; else nt++; }
      const x = lerp(d.from[0], d.to[0], p) + 1.6 * ST.noise(t * 0.4, 70 + k) * p, y = lerp(d.from[1], d.to[1], p) + 1.6 * ST.noise(t * 0.35, 170 + k) * p;
      d.g.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
      d.g.setAttribute('opacity', pr(t, d.t0, d.t0 + 0.12).toFixed(3));
    });
    const tot = no + nt, fo2 = tot ? no / tot : 0.5, fill = pr(t, 0.45, 0.9);
    tO.setAttribute('width', (TB.w * fo2 * fill).toFixed(1));
    tT.setAttribute('x', (TB.x + TB.w * fo2 * fill + TB.w * (1 - fill) * 0.5 * 0).toFixed(1));
    tT.setAttribute('width', (TB.w * (1 - fo2) * fill).toFixed(1));
    if (fill < 1) tT.setAttribute('x', (TB.x + TB.w - TB.w * (1 - fo2) * fill).toFixed(1));

    const eo = 1 - io(pr(t, T.coinOut[0], T.coinOut[1]));
    // chart: build (copy only), then morph (with box 2)
    const ap = io(pr(t, T.axes[0], T.axes[1]));
    let counts, n, ymax;
    if (t < T.b1[1]) {
      const q = pr(t, T.b1[0], T.b1[1]);
      n = 400 * q * q;
      counts = hist(D.b400, n);
      ymax = Math.max(8, 1.8 * n / 41);
    } else if (t < T.rescale[0]) {
      const q = ioS(pr(t, T.b2[0], T.b2[1]));
      n = lerp(400, 10000, q);
      counts = D.c400.map((c, i) => lerp(c, D.copy[i], q));
      ymax = Math.max(8, 1.8 * n / 41);
    } else {
      n = 10000;
      const q = ioS(pr(t, T.morph[0], T.morph[1]));
      counts = D.copy.map((c, i) => lerp(c, D.anta[i], q));
      ymax = lerp(1.8 * 10000 / 41, 1.08 * Math.max(...D.anta), ioS(pr(t, T.rescale[0], T.rescale[1])));
    }
    chart.set(counts, ymax, ap);
    $('.s9-runs-n').textContent = fmt(Math.floor(n));
    show('.s9-runs', io(pr(t, 3.20, 3.50)) * eo, 8);
    show('.s9-axis', io(pr(t, 3.20, 3.60)) * eo, 10);
    const ca = io(pr(t, 3.10, 3.50)) * (1 - io(pr(t, T.cond[0], T.cond[0] + 0.3)));
    show('.s9-cond-a', ca, 12);
    show('.s9-cond-b', io(pr(t, T.cond[0] + 0.15, T.cond[1])) * eo, 12);
    // "a flat spread": dashed line along the bar tops
    const fp = io(pr(t, T.flat[0], T.flat[1])) * (1 - io(pr(t, T.flatOut[0], T.flatOut[1])));
    const yf = CH.base - (10000 / 41) / (1.8 * 10000 / 41) * (CH.base - CH.top);
    const xe = lerp(CH.x0, CH.x1, io(pr(t, T.flat[0], T.flat[1] + 0.2)));
    flatLine.setAttribute('d', `M${CH.x0} ${(yf - 62).toFixed(1)}H${xe.toFixed(1)}`);
    flatLine.setAttribute('opacity', fp.toFixed(3));
    show('.s9-flat', fp, 10);

    // box 2 card
    const cp = io(pr(t, T.card[0], T.card[1]));
    box.setAttribute('stroke-dashoffset', ((1 - cp) * 170).toFixed(1));
    $('.s9-switch').style.opacity = (cp * eo).toFixed(3);
    swG.setAttribute('opacity', eo.toFixed(3)); pairG.setAttribute('opacity', eo.toFixed(3));
    $('.s9-switch').style.clipPath = `inset(0 ${((1 - io(pr(t, T.card[0] + 0.05, T.card[1] + 0.25))) * 100).toFixed(1)}% 0 0)`;
    tick.set(io(pr(t, T.tick[0], T.tick[1])));
    under.set(io(pr(t, T.tick[0] + 0.1, T.tick[1] + 0.35)));
    // the pair
    const mp = io(pr(t, T.mol[0], T.mol[1])), mm = ioS(pr(t, T.meet[0], T.meet[1])), gq = ioS(pr(t, T.grey[0], T.grey[1]));
    const wob = (s) => 3 * ST.noise(t * 0.4, s);
    const ox = lerp(230, 356, mm) + wob(1), oy = lerp(486, 520, mm) + wob(2), tx = lerp(610, 484, mm) + wob(3), ty = lerp(560, 520, mm) + wob(4);
    mO.setAttribute('transform', `translate(${ox.toFixed(1)} ${oy.toFixed(1)}) rotate(${(lerp(-14, 0, mm) + wob(5)).toFixed(1)}) scale(${(1.15 * lerp(0.7, 1, mp)).toFixed(3)})`);
    mT.setAttribute('transform', `translate(${tx.toFixed(1)} ${ty.toFixed(1)}) rotate(${(lerp(12, 0, mm) + wob(6)).toFixed(1)}) scale(${(1.15 * lerp(0.7, 1, mp)).toFixed(3)})`);
    mO.setAttribute('opacity', (mp * (1 - gq)).toFixed(3)); mT.setAttribute('opacity', (mp * (1 - gq)).toFixed(3));
    grey.setAttribute('transform', `translate(420 520) scale(${(1.15 * lerp(1.04, 1, gq)).toFixed(3)})`);
    grey.setAttribute('opacity', gq.toFixed(3));
    strike.set(io(pr(t, T.plab[0], T.plab[0] + 0.4)));
    show('.s9-pairlab', io(pr(t, T.plab[0], T.plab[1])) * eo, 10);
    pairG.style.display = mp <= 0.001 ? 'none' : '';

    // result notes, counters and the coin
    show('.s9-pct', io(pr(t, T.pct[0], T.pct[1])) * eo, 10);
    show('.s9-cnt-l', io(pr(t, T.cnt[0], T.cnt[1])) * eo, 14);
    show('.s9-cnt-r', io(pr(t, T.cnt[0] + 0.08, T.cnt[1] + 0.08)) * eo, 14);
    const co = io(pr(t, T.coin[0], T.coin[1])) * (1 - io(pr(t, T.coinOut[0], T.coinOut[1])));
    coin.setAttribute('opacity', co.toFixed(3));
    coin.style.display = co <= 0.001 ? 'none' : '';
    if (co > 0.001) {
      const s = Math.max(0, t - T.coin[0]);
      const th = 2 * Math.PI * 0.9 * (s - 0.25 * (1 - Math.exp(-s / 0.25)));   // eases into a steady spin
      const cy = Math.cos(th), sy = Math.max(0.05, Math.abs(cy)), front = cy >= 0;
      const bob = 16 * Math.sin(2 * Math.PI * 0.45 * s);
      coin.setAttribute('transform', `translate(1340 ${(520 - 26 * co + bob).toFixed(1)})`);
      [coinFace, coinInner].forEach((e) => e.setAttribute('ry', (e === coinFace ? 46 : 36) * sy));
      coinRim.setAttribute('ry', (50 * sy).toFixed(2)); coinRim.setAttribute('cy', (6 * Math.sin(th) * (front ? 1 : -1)).toFixed(2));
      coinRim.setAttribute('fill', front ? '#5e2005' : '#164e51');
      coinFace.setAttribute('fill', front ? C.o : 'url(#' + P + '-htc)');
      coinFace.setAttribute('stroke', front ? C.oDark : C.t); coinFace.setAttribute('stroke-width', front ? 2 : 3);
      const hs = `scale(1 ${sy.toFixed(3)})`;
      coinHandL.setAttribute('transform', `${hs} translate(-20 -20) scale(${40 / 24})`);
      coinHandR.setAttribute('transform', `${hs} translate(20 -20) scale(${-40 / 24} ${40 / 24})`);
      coinHandL.style.display = front ? '' : 'none'; coinHandR.style.display = front ? 'none' : '';
    }
  }
  function localT(t) { const c = ST.clips().find((k) => k.id === SID); return c ? t - c.start : t; }
  ST.waitFor(Promise.all([
    fetch('assets/shot-9/histograms.json').then((r) => r.json()),
    fetch('assets/shot-9/race_runs.json').then((r) => r.json())
  ]).then(([h, r]) => { prepare(h, r); draw(0); }), 'shot-9 data');
  ST.onSeek((t) => { draw(clamp(localT(t), 0, DUR)); });

})();
