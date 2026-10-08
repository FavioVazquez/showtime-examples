/* shot-2: the ice sheet at the South Pole with IceCube's real string layout beneath (assets/shot-2/icecube-geometry.js).
 * Depth above the instrumented kilometre is compressed (a schematic, no depth numbers on it). Pure function of scene time. */
(function () {
  'use strict';
  var SID = 'shot-2', W = 1920, H = 1080, DUR = 16.95;
  var sec = document.getElementById(SID);
  if (!sec || !window.ICGEO) return;
  var cv = sec.querySelector('.s2-ice'), g = cv.getContext('2d');
  var GEO = window.ICGEO;

  var CX = 0, CY = 0;
  GEO.forEach(function (s) { CX += s[0]; CY += s[1]; }); CX /= GEO.length; CY /= GEO.length;
  var ZS = 1950 - 0;                         // surface: the array centre is about 1,950 m down
  function zc(z) { return z <= 500 ? z : 500 + (z - 500) * 0.3; }   // overburden compressed
  var ZSURF = zc(ZS), HALF = 650, ZBOT = -760;

  // order the strings from the centre out (the drop sweeps outwards)
  var ORDER = GEO.map(function (s, i) { return { i: i, d: Math.hypot(s[0] - CX, s[1] - CY) }; });
  var DMAX = ORDER.reduce(function (m, o) { return Math.max(m, o.d); }, 1);
  var DELAY = []; ORDER.forEach(function (o) { DELAY[o.i] = o.d / DMAX; });
  // convex hull of the strings (the hexagon)
  var HULL = (function () {
    var P = GEO.map(function (s) { return [s[0], s[1]]; }).sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
    function cr(o, a, b) { return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); }
    var lo = [], up = [];
    P.forEach(function (p) { while (lo.length > 1 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); });
    P.slice().reverse().forEach(function (p) { while (up.length > 1 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); });
    return lo.slice(0, -1).concat(up.slice(0, -1));
  })();

  function cam(t) { return { az: 0.40 + 0.45 * (t / DUR), el: 0.32, dist: 4300, f: 1700, sx: 1420, sy: 640 }; }
  function P3(c, x, y, z) {
    x -= CX; y -= CY;
    var ca = Math.cos(c.az), sa = Math.sin(c.az), x1 = x * ca - y * sa, y1 = x * sa + y * ca;
    var ce = Math.cos(c.el), se = Math.sin(c.el), depth = y1 * ce + z * se, up = z * ce - y1 * se;
    var s = c.f / (c.dist + depth); return [c.sx + x1 * s, c.sy - up * s, s, depth];
  }
  // the pole marker sits on the rotation axis: its screen point never moves
  (function placePole() {
    var p = P3(cam(0), CX, CY, ZSURF);
    var pole = sec.querySelector('.s2-pole'), lab = sec.querySelector('.s2-pole-label');
    pole.style.left = (p[0] - 12) + 'px'; pole.style.top = (p[1] - 130) + 'px';
    lab.style.left = (p[0] + 22) + 'px'; lab.style.top = (p[1] - 118 - 22) + 'px';
  })();

  var E = ST.ease;
  function drawIce(c, t) {
    var corners = [[-HALF, -HALF], [HALF, -HALF], [HALF, HALF], [-HALF, HALF]].map(function (q) { return [CX + q[0], CY + q[1]]; });
    var top = corners.map(function (q) { return P3(c, q[0], q[1], ZSURF); });
    var bot = corners.map(function (q) { return P3(c, q[0], q[1], ZBOT); });
    // side faces: ice fading into the dark
    g.save();
    var grd = g.createLinearGradient(0, top[0][1] - 40, 0, Math.max(bot[0][1], bot[2][1]));
    grd.addColorStop(0, 'rgba(150,195,255,0.13)'); grd.addColorStop(1, 'rgba(150,195,255,0)');
    g.fillStyle = grd;
    for (var k = 0; k < 4; k++) {
      var a = k, b = (k + 1) % 4;
      g.beginPath(); g.moveTo(top[a][0], top[a][1]); g.lineTo(top[b][0], top[b][1]); g.lineTo(bot[b][0], bot[b][1]); g.lineTo(bot[a][0], bot[a][1]); g.closePath(); g.fill();
    }
    // vertical edges fading down
    for (k = 0; k < 4; k++) {
      var eg = g.createLinearGradient(top[k][0], top[k][1], bot[k][0], bot[k][1]);
      eg.addColorStop(0, 'rgba(200,225,255,0.45)'); eg.addColorStop(1, 'rgba(200,225,255,0)');
      g.strokeStyle = eg; g.lineWidth = 2; g.beginPath(); g.moveTo(top[k][0], top[k][1]); g.lineTo(bot[k][0], bot[k][1]); g.stroke();
    }
    // the surface
    g.fillStyle = 'rgba(214,232,255,0.10)'; g.strokeStyle = 'rgba(214,232,255,0.6)'; g.lineWidth = 2.5;
    g.beginPath(); top.forEach(function (p, i) { if (i) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]); }); g.closePath(); g.fill(); g.stroke();
    g.restore();
  }
  function hull(c, z, a, dash) {
    g.save(); g.strokeStyle = 'rgba(88,225,255,' + a + ')'; g.lineWidth = 2.5; if (dash) g.setLineDash([10, 8]);
    g.beginPath();
    HULL.forEach(function (h, i) { var p = P3(c, h[0], h[1], z); if (i) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]); });
    g.closePath(); g.stroke(); g.restore();
  }
  function drawStrings(c, t) {
    var T0 = 7.95, SPREAD = 1.05, DROP = 0.6;
    var drawn = [];
    for (var i = 0; i < GEO.length; i++) {
      var k = E.outCubic(ST.clamp((t - T0 - SPREAD * DELAY[i]) / DROP, 0, 1));
      if (k <= 0) continue;
      var s = GEO[i], zs = s[2], zb = zs[zs.length - 1];
      var zTip = ZSURF + (zc(zb) - ZSURF) * k;
      var pt = P3(c, s[0], s[1], ZSURF), pb = P3(c, s[0], s[1], zTip);
      drawn.push([i, pt, pb, zTip, pb[3]]);
    }
    drawn.sort(function (a, b) { return b[4] - a[4]; });
    g.save(); g.lineCap = 'round';
    for (var j = 0; j < drawn.length; j++) {
      var d = drawn[j], st = GEO[d[0]];
      g.strokeStyle = 'rgba(160,190,240,0.32)'; g.lineWidth = 1.4;
      g.beginPath(); g.moveTo(d[1][0], d[1][1]); g.lineTo(d[2][0], d[2][1]); g.stroke();
      g.fillStyle = 'rgba(150,215,255,0.9)';
      for (var m = 0; m < st[2].length; m += 2) {
        var z = st[2][m]; if (z < d[3]) break;
        var p = P3(c, st[0], st[1], z), r = 2.6 * p[2] / 0.39;
        g.fillRect(p[0] - r / 2, p[1] - r / 2, r, r);
      }
    }
    g.restore();
  }
  // faint streaks fall through the ice, untouched; fuller from "high-energy neutrinos from space"
  var rr = ST.rand('s2-rain'), RAIN = [];
  for (var i = 0; i < 150; i++) RAIN.push({ x: rr.range(1000, 1860), ph: rr.range(0, 1), v: rr.range(0.55, 0.9), a: rr.range(0.35, 0.75) });
  function drawRain(t) {
    var k = 0.6 + 0.4 * ST.progress(t, 10.9, 11.7);   // faint from frame 0, fuller on "from space"
    g.save(); g.lineCap = 'round';
    for (var i = 0; i < RAIN.length; i++) {
      var d = RAIN[i], u = (d.ph + d.v * t) % 1.0;
      var y = -80 + u * 1000, x = d.x - u * 120;
      if (y > 870) continue;
      var gr = g.createLinearGradient(x, y, x + 14, y - 90);
      gr.addColorStop(0, 'rgba(88,225,255,' + (d.a * k).toFixed(3) + ')'); gr.addColorStop(1, 'rgba(88,225,255,0)');
      g.strokeStyle = gr; g.lineWidth = 2.2; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 14, y - 90); g.stroke();
    }
    g.restore();
  }

  function draw(t) {
    g.clearRect(0, 0, W, H);
    var c = cam(t);
    drawIce(c, t);
    var hk = ST.progress(t, 9.1, 9.8, E.outCubic);
    if (hk > 0) hull(c, zc(-505), (0.35 * hk).toFixed(3), true);
    drawStrings(c, t);
    if (hk > 0) hull(c, zc(500), (0.85 * hk).toFixed(3), false);
    drawRain(t);
  }

  var win = null;
  ST.onSeek(function (t) {
    if (!win) win = ST.clips().filter(function (c) { return c.id === SID; })[0];
    if (!win) return;
    var lt = t - win.start;
    if (lt < -1 || lt > DUR + 1) return;
    draw(Math.max(0, Math.min(DUR, lt)));
  });
})();
