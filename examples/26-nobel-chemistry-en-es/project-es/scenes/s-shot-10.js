/* shot-10: scene-local time, registers through ST.onSeek; all helpers private to this file */
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

  /* shot-10 the caveat: scene-local time only. Frame 0 = shot-9's last frame (label + bare chart: shot-9 clears its notes in its last 0.5 s), for a match cut.
     "A toy," 0.34: the spikes shrink to the bottom-left corner (0.35-1.55);
     "The Nobel Committee" 3.07: the box draws on, the quote writes on line by line, attribution on "Frank's model" 4.70;
     the Soai note from 6.55 (held >= 4.5 s to the end), underline on "still debated" 9.55. */
  const SID = 'shot-10', P = 's10', DUR = 9.703;
  const root = document.getElementById(SID);
  const svg = root.querySelector('.s10-svg'), csvg = root.querySelector('.s10-csvg');
  const defs = el('defs', {}, svg), cdefs = el('defs', {}, csvg);
  const $ = (s) => root.querySelector(s);
  gridPaper(svg, defs, P + '-grid');
  hatch(defs, P + '-ht', C.t, C.tTint, 9);
  hatch(defs, P + '-hg', C.g, C.gTint, 9);
  hatch(cdefs, P + '-cht', C.t, C.tTint, 9);
  const HID = { t: P + '-ht', g: P + '-hg' };
  const show = (sel, p, dy) => { const e = $(sel); e.style.opacity = p.toFixed(3); e.style.transform = `translateY(${((1 - p) * (dy == null ? 14 : dy)).toFixed(1)}px)`; };

  // the chart (its own layer so it can shrink with its labels)
  const chart = makeChart(csvg, cdefs, P + 'c', { t: P + '-cht' });
  const miniFrame = el('rect', { x: 830, y: 160, width: 1020, height: 720, rx: 18, fill: 'none', stroke: C.ink, 'stroke-width': 5, opacity: 0 }, csvg);

  // the quote box and the Soai note
  const boxPts = [[700, 238], [1300, 234], [1822, 240], [1826, 380], [1820, 524], [1260, 528], [704, 522], [698, 380], [702, 236]];
  const qbox = inkLine(svg, defs, boxPts, 4.2, C.ink, 41, P);
  const ul = inkLine(svg, defs, [[742, 770], [1040, 774], [1340, 768]], 3.6, C.o, 43, P);

  let D = null;
  const LT = { left: [0.20, 0.70], labels: [0.15, 0.60], shrink: [0.35, 1.55], box: [3.07, 3.75], q1: [3.30, 4.35], q2: [4.30, 5.20], attr: [4.75, 5.15],
               h: [5.90, 6.35], h2: [5.90, 6.35], ul: [7.55, 8.00] };
  // Spanish retime: the Soai note comes in at 7.40, after "vida," 7.25 and just before "y cómo" 7.95 (English cue 6.55 was 1.4 s early), so it holds 3.4 s; underline kept at 9.50 ("sigue en debate" 9.71)
  const reveal = (sel, p) => { const e = $(sel); e.style.opacity = p > 0 ? 1 : 0; e.style.clipPath = `inset(-10px ${((1 - p) * 100).toFixed(2)}% -10px -10px)`; };

  function draw(t) {
    if (!D) return;
    chart.set(D.anta, 1.08 * Math.max(...D.anta), 1);
    const s = io(pr(t, LT.shrink[0], LT.shrink[1]));
    const k = lerp(1, 0.4, s), tx = lerp(0, 100 - 840 * 0.4, s), ty = lerp(0, 560 - 180 * 0.4, s);
    $('.s10-chart').style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${k.toFixed(4)})`;
    miniFrame.setAttribute('opacity', (0.0 + 0.55 * io(pr(t, 1.2, 1.7))).toFixed(3));
    qbox.set(io(pr(t, LT.box[0], LT.box[1])));
    reveal('.s10-q1', ioS(pr(t, LT.q1[0], LT.q1[1])));
    reveal('.s10-q2', ioS(pr(t, LT.q2[0], LT.q2[1])));
    show('.s10-attr', io(pr(t, LT.attr[0], LT.attr[1])), 10);
    reveal('.s10-h', ioS(pr(t, LT.h[0], LT.h[1])));
    show('.s10-h2', io(pr(t, LT.h2[0], LT.h2[1])), 12);
    ul.set(io(pr(t, LT.ul[0], LT.ul[1])));
  }
  function localT(t) { const c = ST.clips().find((k) => k.id === SID); return c ? t - c.start : t; }
  ST.waitFor(fetch('assets/shot-10/histograms.json').then((r) => r.json()).then((h) => { D = { anta: h.counts.with_antagonism }; draw(0); }), 'shot-10 data');
  ST.onSeek((t) => { draw(clamp(localT(t), 0, DUR)); });

})();
