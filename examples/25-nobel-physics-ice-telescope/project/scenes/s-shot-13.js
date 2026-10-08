/* shot-13 the tie-back. Part A (0-1.9 s): the shot-1 fingertip, the stream still passing, one neutrino ringed.
 * Part B: IceCube's real strings (assets/shot-13/icecube-geometry.js); one neutrino "from space" crosses the ice, hits,
 * and the light it makes is caught by the nearby sensors; the track keeps going. A drawing, not event data.
 * P13: a cubic kilometre of ice at the South Pole. Pure function of scene time. */
(function () {
  'use strict';
  // the look's accent (--accent) for highlights drawn on canvas
  var ACC = (function () {
    var h = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim().replace('#', '');
    if (h.length === 3) h = h.replace(/./g, '$&$&');
    var n = parseInt(h, 16); return isNaN(n) ? '255,127,97' : [(n >> 16) & 255, (n >> 8) & 255, n & 255].join(',');
  })();
  var SID = 'shot-13', W = 1920, H = 1080, DUR = 5.61;
  var sec = document.getElementById(SID);
  if (!sec || !window.ICGEO) return;
  var E = ST.ease;

  // ---------- part A: the stream (same recipe as shot-1)
  var ga = sec.querySelector('.s13-stream').getContext('2d');
  var ANG = 8 * Math.PI / 180, CA = Math.cos(ANG), SA = Math.sin(ANG), SPAN = W + 700;
  var COLS = ['88,225,255', '88,169,255', '234,240,250'];
  var r = ST.rand('s1-stream'), DOTS = [];
  for (var i = 0; i < 2600; i++) {
    var depth = r();
    DOTS.push({ y0: r.range(-320, H + 60), ph: r.range(0, SPAN), v: 520 + 900 * depth + r.range(-80, 80),
      w: 1.2 + 2.2 * depth, a: 0.16 + 0.42 * depth * r.range(0.6, 1), c: COLS[r.int(0, 2)] });
  }
  function drawA(t) {
    ga.clearRect(0, 0, W, H); ga.lineCap = 'round';
    var tt = t + 40;                                  // a later moment of the same stream
    for (var i = 0; i < DOTS.length; i++) {
      var d = DOTS[i], s = (d.ph + d.v * tt) % SPAN, x = W + 350 - s * CA, y = d.y0 + s * SA;
      if (x < -60 || x > W + 60 || y < -60 || y > H + 60) continue;
      var len = d.v * 0.045;
      ga.strokeStyle = 'rgba(' + d.c + ',' + d.a.toFixed(3) + ')'; ga.lineWidth = d.w;
      ga.beginPath(); ga.moveTo(x, y); ga.lineTo(x + len * CA, y - len * SA); ga.stroke();
    }
    var k = ST.progress(t, 0.45, 0.85, E.outCubic);
    if (k > 0) {
      var x = 1700 - 900 * (t - 0.45), y = 575 + (900 - x) * Math.tan(ANG);
      var gl = ga.createRadialGradient(x, y, 0, x, y, 22);
      gl.addColorStop(0, 'rgba(255,236,228,1)'); gl.addColorStop(0.35, 'rgba(' + ACC + ',0.8)'); gl.addColorStop(1, 'rgba(' + ACC + ',0)');
      ga.fillStyle = gl; ga.beginPath(); ga.arc(x, y, 22, 0, 6.2832); ga.fill();
      ga.strokeStyle = 'rgba(' + ACC + ',' + (0.95 * k).toFixed(3) + ')'; ga.lineWidth = 3.5;
      ga.beginPath(); ga.arc(x, y, 34 + 40 * (1 - k), 0, 6.2832); ga.stroke();
      var tr = ga.createLinearGradient(x, y, x + 240 * CA, y - 240 * SA);
      tr.addColorStop(0, 'rgba(' + ACC + ',0.7)'); tr.addColorStop(1, 'rgba(' + ACC + ',0)');
      ga.strokeStyle = tr; ga.lineWidth = 4; ga.beginPath(); ga.moveTo(x, y); ga.lineTo(x + 240 * CA, y - 240 * SA); ga.stroke();
    }
  }

  // ---------- part B: the ice
  var gb = sec.querySelector('.s13-ice').getContext('2d');
  var GEO = window.ICGEO, SENS = [];
  var CX = 0, CY = 0;
  GEO.forEach(function (s) { CX += s[0]; CY += s[1]; s[2].forEach(function (z) { SENS.push([s[0], s[1], z]); }); });
  CX /= GEO.length; CY /= GEO.length;
  function cam(t) { return { az: 0.30 + 0.28 * (t / DUR), el: 0.36, dist: 3150, f: 1700, sx: 960, sy: 470 }; }
  function P3(c, x, y, z) {
    x -= CX; y -= CY;
    var ca = Math.cos(c.az), sa = Math.sin(c.az), x1 = x * ca - y * sa, y1 = x * sa + y * ca;
    var ce = Math.cos(c.el), se = Math.sin(c.el), dp = y1 * ce + z * se, up = z * ce - y1 * se;
    var s = c.f / (c.dist + dp); return [c.sx + x1 * s, c.sy - up * s, s, dp];
  }
  // the neutrino: from high on one side, down through the array; it interacts at HIT and its track keeps going
  var HIT = [CX + 70, CY - 30, -40], DIR = (function () { var v = [-0.62, 0.18, -0.76], n = Math.hypot(v[0], v[1], v[2]); return v.map(function (q) { return q / n; }); })();
  var T_IN = 2.12, T_HIT = 3.31, L_IN = 1700, V_MU = 900;   // m, m/s (film speeds, slowed down)
  function along(s) { return [HIT[0] + DIR[0] * s, HIT[1] + DIR[1] * s, HIT[2] + DIR[2] * s]; }
  function headS(t) { return t <= T_HIT ? -L_IN * (1 - ST.clamp((t - T_IN) / (T_HIT - T_IN), 0, 1)) : V_MU * (t - T_HIT); }
  // sensors that catch light: close to the hit or to the outgoing track; each lights when the light reaches it
  var LIT = [];
  (function () {
    for (var i = 0; i < SENS.length; i++) {
      var p = SENS[i], dx = p[0] - HIT[0], dy = p[1] - HIT[1], dz = p[2] - HIT[2];
      var s = dx * DIR[0] + dy * DIR[1] + dz * DIR[2], sc = Math.max(0, s);
      var q = along(sc), perp = Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
      var dHit = Math.hypot(dx, dy, dz);
      var near = Math.min(dHit, sc > 0 && sc < 760 ? perp : 1e9);
      if (near > 135) continue;
      var tl = (dHit < 135 ? T_HIT + dHit / 900 : T_HIT + sc / V_MU + perp / 900) + 0.02;
      LIT.push({ i: i, t: tl, w: 1 - near / 135 });
    }
    LIT.sort(function (a, b) { return a.t - b.t; });
    LIT.forEach(function (h, k) { h.rank = k / Math.max(1, LIT.length - 1); });
  })();
  var STOPS = [[0, [225, 250, 255]], [0.35, [88, 225, 255]], [1, [88, 169, 255]]];
  function colourAt(x) {
    for (var i = 1; i < STOPS.length; i++) if (x <= STOPS[i][0]) {
      var a = STOPS[i - 1], b = STOPS[i], k = (x - a[0]) / (b[0] - a[0]);
      return [0, 1, 2].map(function (j) { return Math.round(a[1][j] + (b[1][j] - a[1][j]) * k); });
    }
    return STOPS[STOPS.length - 1][1];
  }
  var SPR = [];
  for (var b = 0; b <= 24; b++) {
    var c0 = colourAt(b / 24), cvs = document.createElement('canvas'); cvs.width = cvs.height = 96;
    var x0 = cvs.getContext('2d'), gr = x0.createRadialGradient(48, 48, 0, 48, 48, 48);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.14, 'rgba(' + c0 + ',0.95)');
    gr.addColorStop(0.42, 'rgba(' + c0 + ',0.32)'); gr.addColorStop(1, 'rgba(' + c0 + ',0)');
    x0.fillStyle = gr; x0.fillRect(0, 0, 96, 96); SPR.push(cvs);
  }
  var fromEl = sec.querySelector('.s13-from'), kmEl = sec.querySelector('.s13-km');

  function drawB(t) {
    gb.clearRect(0, 0, W, H);
    var c = cam(t);
    // strings: the cable up toward the surface, then the instrumented kilometre
    gb.save(); gb.lineWidth = 1.3;
    var rightMost = null;
    for (var i = 0; i < GEO.length; i++) {
      var s = GEO[i], top = P3(c, s[0], s[1], s[2][0]), bot = P3(c, s[0], s[1], s[2][s[2].length - 1]), sky = P3(c, s[0], s[1], 1400);
      var cg = gb.createLinearGradient(sky[0], sky[1], top[0], top[1]);
      cg.addColorStop(0, 'rgba(150,180,235,0)'); cg.addColorStop(1, 'rgba(150,180,235,0.18)');
      gb.strokeStyle = cg; gb.beginPath(); gb.moveTo(sky[0], sky[1]); gb.lineTo(top[0], top[1]); gb.stroke();
      gb.strokeStyle = 'rgba(150,180,235,0.24)'; gb.beginPath(); gb.moveTo(top[0], top[1]); gb.lineTo(bot[0], bot[1]); gb.stroke();
      if (!rightMost || top[0] > rightMost.x) rightMost = { x: top[0], s: s };
    }
    gb.fillStyle = 'rgba(190,210,255,0.62)';
    for (var j = 0; j < SENS.length; j++) {
      var q = SENS[j], p = P3(c, q[0], q[1], q[2]), rr = 2.4 * p[2] / 0.64;
      gb.fillRect(p[0] - rr / 2, p[1] - rr / 2, rr, rr);
    }
    gb.restore();

    // 1 km ruler beside the right-most string (the instrumented depth is about one kilometre)
    var ka = ST.progress(t, 2.62, 3.07, E.outCubic);
    if (ka > 0 && rightMost) {
      var rs = rightMost.s, a0 = P3(c, rs[0], rs[1], 500), a1 = P3(c, rs[0], rs[1], -500), rx = Math.max(a0[0], a1[0]) + 46;
      gb.save(); gb.globalAlpha = ka; gb.strokeStyle = 'rgba(234,240,250,0.85)'; gb.lineWidth = 3;
      var ym = (a0[1] + a1[1]) / 2, hh = (a1[1] - a0[1]) / 2 * E.outCubic(ka);
      gb.beginPath(); gb.moveTo(rx, ym - hh); gb.lineTo(rx, ym + hh);
      gb.moveTo(rx - 12, ym - hh); gb.lineTo(rx + 12, ym - hh); gb.moveTo(rx - 12, ym + hh); gb.lineTo(rx + 12, ym + hh); gb.stroke();
      gb.restore();
      kmEl.style.opacity = ka.toFixed(3);
      kmEl.style.transform = 'translate(' + (rx + 22).toFixed(1) + 'px,' + (ym - 20).toFixed(1) + 'px)';
    } else kmEl.style.opacity = '0';

    // the light: a soft blue bloom at the hit, then each sensor that catches it
    var hp = P3(c, HIT[0], HIT[1], HIT[2]);
    var fk = ST.progress(t, T_HIT, T_HIT + 0.55, E.outCubic);
    if (fk > 0) {
      var rad = 40 + 230 * fk, al = 0.55 * (1 - 0.6 * ST.progress(t, T_HIT + 0.4, T_HIT + 2.4));
      var bl = gb.createRadialGradient(hp[0], hp[1], 0, hp[0], hp[1], rad);
      bl.addColorStop(0, 'rgba(160,235,255,' + al.toFixed(3) + ')'); bl.addColorStop(0.4, 'rgba(88,169,255,' + (al * 0.55).toFixed(3) + ')'); bl.addColorStop(1, 'rgba(88,169,255,0)');
      gb.save(); gb.globalCompositeOperation = 'lighter'; gb.fillStyle = bl; gb.beginPath(); gb.arc(hp[0], hp[1], rad, 0, 6.2832); gb.fill(); gb.restore();
    }
    gb.save(); gb.globalCompositeOperation = 'lighter';
    for (var k = 0; k < LIT.length; k++) {
      var h = LIT[k]; if (h.t > t) break;
      var since = t - h.t, fl = Math.exp(-since / 0.3), sp = SENS[h.i], pp = P3(c, sp[0], sp[1], sp[2]);
      var R = (7 + 18 * h.w + 16 * fl) * pp[2] / 0.64;
      gb.globalAlpha = Math.min(1, 0.45 + 0.4 * h.w + 0.3 * fl);
      gb.drawImage(SPR[Math.round(h.rank * 24)], pp[0] - R, pp[1] - R, 2 * R, 2 * R);
    }
    gb.restore();

    // the neutrino and its track: it does not stop
    if (t >= T_IN) {
      var sH = headS(t), s0 = Math.max(-L_IN, sH - 520);
      var A = along(s0), B = along(sH), pa = P3(c, A[0], A[1], A[2]), pb = P3(c, B[0], B[1], B[2]);
      var lg = gb.createLinearGradient(pa[0], pa[1], pb[0], pb[1]);
      var col = sH > 0 ? '120,215,255' : ACC;
      lg.addColorStop(0, 'rgba(' + col + ',0)'); lg.addColorStop(1, 'rgba(' + col + ',0.9)');
      var fade = 1 - ST.progress(t, T_HIT + 1.4, T_HIT + 2.0);
      gb.save(); gb.globalAlpha = fade; gb.strokeStyle = lg; gb.lineWidth = 4; gb.lineCap = 'round';
      gb.beginPath(); gb.moveTo(pa[0], pa[1]); gb.lineTo(pb[0], pb[1]); gb.stroke();
      var hg = gb.createRadialGradient(pb[0], pb[1], 0, pb[0], pb[1], 22);
      hg.addColorStop(0, 'rgba(255,245,225,1)'); hg.addColorStop(0.35, 'rgba(' + col + ',0.85)'); hg.addColorStop(1, 'rgba(' + col + ',0)');
      gb.fillStyle = hg; gb.beginPath(); gb.arc(pb[0], pb[1], 22, 0, 6.2832); gb.fill();
      gb.restore();
    }
    // "from space": rides with the neutrino, then stays by the flash
    var la = ST.progress(t, T_IN + 0.05, T_IN + 0.35);
    if (la > 0) {
      var sl = Math.min(headS(t), 0), L = along(sl), pl = P3(c, L[0], L[1], L[2]);
      fromEl.style.opacity = la.toFixed(3);
      fromEl.style.transform = 'translate(' + (pl[0] - 60).toFixed(1) + 'px,' + (pl[1] - 150).toFixed(1) + 'px)';
    } else fromEl.style.opacity = '0';
  }

  var win = null;
  ST.onSeek(function (t) {
    if (!win) win = ST.clips().filter(function (c) { return c.id === SID; })[0];
    if (!win) return;
    var lt = t - win.start;
    if (lt < -1 || lt > DUR + 1) return;
    lt = Math.max(0, Math.min(DUR, lt));
    if (lt < 2.42) drawA(lt);
    if (lt > 1.4) drawB(lt);
    else drawB(1.4);
  });
})();
