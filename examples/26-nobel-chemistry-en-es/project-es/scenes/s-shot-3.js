/* shot-3 fifty-fifty (motion-A, full video): a pure function of scene-local time (ST.onSeek), seeded layout.
   Adapted from the short's motion-B shot-3 (tapered-ink flask, seeded dots), retimed to cues-shot-3.txt:
   pour 0.32-3.45 (40 dots, 21 one hand : 19 mirror hand, counters tick as each lands); new dots made with the
   catalyst fall from under the stamp 6.30-9.0 (27 : 3), never recolouring an old one; the bar follows the counts. */
(function () {
  var SID = 'shot-3', DUR = 10.556, NS = 'http://www.w3.org/2000/svg';
  var sec = document.getElementById(SID);
  if (!sec || !window.ST) return;
  var q = function (s) { return sec.querySelector(s); };
  var clamp = function (x, a, b) { return Math.max(a, Math.min(b, x)); };
  var prog = function (t, a, b) { return clamp((t - a) / (b - a), 0, 1); };
  var io = function (p) { return 0.5 - 0.5 * Math.cos(Math.PI * p); };
  var io3 = function (p) { return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; };

  /* tapered ink stroke: a filled outline around a centre line, width from seeded noise */
  function seg(a, b, n) { var o = []; for (var i = 0; i <= n; i++) { var s = i / n; o.push([a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s]); } return o; }
  function quad(a, c, b, n) { var o = []; for (var i = 0; i <= n; i++) { var s = i / n, m = 1 - s; o.push([m * m * a[0] + 2 * m * s * c[0] + s * s * b[0], m * m * a[1] + 2 * m * s * c[1] + s * s * b[1]]); } return o; }
  function join(parts) { var o = []; parts.forEach(function (p, k) { o = o.concat(k ? p.slice(1) : p); }); return o; }
  function ink(pts, w, seed, taper) {
    taper = taper || 0.06;
    var L = [0], i;
    for (i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    var T = L[L.length - 1] || 1, left = [], right = [];
    for (i = 0; i < pts.length; i++) {
      var s = L[i] / T, a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
      var dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d;
      var end = Math.min(1, s / taper, (1 - s) / taper);
      var hw = 0.5 * w * (0.35 + 0.65 * Math.sqrt(Math.max(0, end))) * (1 + 0.13 * ST.noise(s * 9, seed));
      left.push([pts[i][0] + nx * hw, pts[i][1] + ny * hw]);
      right.push([pts[i][0] - nx * hw, pts[i][1] - ny * hw]);
    }
    var f = function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); };
    return 'M ' + left.map(f).join(' L ') + ' L ' + right.reverse().map(f).join(' L ') + ' Z';
  }
  var flask = join([
    quad([672, 146], [700, 146], [700, 172], 6), seg([700, 172], [700, 360], 20),
    seg([700, 360], [482, 792], 40), quad([482, 792], [458, 850], [532, 850], 12),
    seg([532, 850], [988, 850], 40), quad([988, 850], [1062, 850], [1038, 792], 12),
    seg([1038, 792], [820, 360], 40), seg([820, 360], [820, 172], 20), quad([820, 172], [820, 146], [848, 146], 6)
  ]);
  q('.s-shot-3__flask').setAttribute('d', ink(flask, 6.5, 'flask', 0.03));
  q('.s-shot-3__leader').setAttribute('d', ink(quad([994, 214], [948, 214], [922, 226], 14), 3.2, 'leader', 0.2));

  /* seeded spots packed bottom-up inside the flask */
  var r = ST.rand('shot-3-flask-full');
  function halfWidth(y) { var hw = 60 + (Math.min(y, 792) - 360) / 432 * 218 - 26; if (y > 796) hw -= (y - 796) * 1.25; return hw; }
  var spots = [], row = 0;
  for (var y = 826; spots.length < 70 && y > 380; y -= 35, row++) {
    var hw = halfWidth(y), xs = [], off = (row % 2) ? 20 : 0;
    for (var x = -400 + off; x <= 400; x += 40) if (Math.abs(x) <= hw) xs.push(x);
    for (var k = xs.length - 1; k > 0; k--) { var j = Math.floor(r() * (k + 1)), tmp = xs[k]; xs[k] = xs[j]; xs[j] = tmp; }
    xs.forEach(function (x) { spots.push([760 + x + r.range(-3, 3), y + r.range(-3, 3)]); });
  }
  spots.length = 70;
  function shuffled(n1, n2, seed) {
    var rr = ST.rand(seed), a = [], i;
    for (i = 0; i < n1; i++) a.push('o'); for (i = 0; i < n2; i++) a.push('t');
    for (i = a.length - 1; i > 0; i--) { var j = Math.floor(rr() * (i + 1)), tmp = a[i]; a[i] = a[j]; a[j] = tmp; }
    return a;
  }
  var colA = shuffled(21, 19, 'shot-3-left-alone'), colB = shuffled(27, 3, 'shot-3-with-catalyst');
  var FALL = 0.55, dots = [], g = q('.s-shot-3__dots');
  spots.forEach(function (p, i) {
    var phaseB = i >= 40, hand = phaseB ? colB[i - 40] : colA[i];
    var t0 = phaseB ? 7.10 + (i - 40) * 0.075 : 0.30 + i * (2.60 / 39);
    var from = phaseB ? [760 + r.range(-14, 14), 300] : [760 + r.range(-24, 24), 118];
    var el = document.createElementNS(NS, 'g'), c = document.createElementNS(NS, 'circle');
    c.setAttribute('r', '16.5');
    if (hand === 'o') { c.setAttribute('fill', '#b13d0b'); c.setAttribute('stroke', '#7a2906'); c.setAttribute('stroke-width', '1.5'); }
    else { c.setAttribute('fill', 'url(#s3-hatch)'); c.setAttribute('stroke', '#2b8a8f'); c.setAttribute('stroke-width', '3'); }
    el.appendChild(c); el.setAttribute('opacity', '0'); g.appendChild(el);
    dots.push({ el: el, hand: hand, t0: t0, from: from, to: p });
  });

  var barO = q('.s-shot-3__bar-o'), barT = q('.s-shot-3__bar-t'), leader = q('.s-shot-3__leader');
  var nO = q('.s-shot-3__n--o'), nT = q('.s-shot-3__n--t');
  var start = null;
  ST.onSeek(function (t) {
    if (start === null) { var c = (ST.clips() || []).filter(function (c) { return c.id === SID; })[0]; if (!c) return; start = c.start; }
    var lt = clamp(t - start, 0, DUR), o = 0, tt = 0, co = 0, ct = 0;
    dots.forEach(function (d) {
      var p = prog(lt, d.t0, d.t0 + FALL), e = io3(p);
      var x = d.from[0] + (d.to[0] - d.from[0]) * e, y = d.from[1] + (d.to[1] - d.from[1]) * e;
      d.el.setAttribute('opacity', prog(lt, d.t0, d.t0 + 0.14).toFixed(3));
      d.el.setAttribute('transform', 'translate(' + x.toFixed(2) + ' ' + y.toFixed(2) + ')');
      if (d.hand === 'o') { o += e; if (p >= 1) co++; } else { tt += e; if (p >= 1) ct++; }
    });
    nO.textContent = String(co); nT.textContent = String(ct);
    var W = 600, fo = (o + tt) > 0 ? o / (o + tt) : 0.5, fill = io(prog(lt, 0.3, 1.2));
    barO.setAttribute('width', (W * fo * fill).toFixed(2));
    barT.setAttribute('x', (1180 + W * fo * fill).toFixed(2));
    barT.setAttribute('width', (W * (1 - fo) * fill).toFixed(2));
    leader.setAttribute('opacity', io(prog(lt, 7.05, 7.45)).toFixed(3));
  });
})();
