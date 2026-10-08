/* shot-6: the blue cone. draw(T) is a pure function of the scene-relative time T.
 * A schematic (P15): a neutrino hits a nucleus, a charged particle flies on faster than light travels in ice
 * (n = 1.32), the light it gives off piles up into a cone (drawn as the envelope of light wavelets), and each
 * sensor lights when the cone's front reaches it, coloured by its arrival time (first light -> last light). */
(function () {
  'use strict';
  var SID = 'shot-6', DUR = 11.5;
  var sec = document.getElementById(SID); if (!sec || !window.ST) return;
  var cv = sec.querySelector('.s6-cv'), g = cv.getContext('2d');
  var ck = sec.querySelector('.s6-ck');
  // look token (Tidewater coral) for the hit and the particle; read once
  var ACC = '255,127,97';
  function rgbOf(name, fb) {
    var v = getComputedStyle(sec).getPropertyValue(name).trim(), m = /^#([0-9a-f]{6})$/i.exec(v);
    if (!m) return fb;
    var n = parseInt(m[1], 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255].join(',');
  }

  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
  function seg(t, a, b) { return clamp((t - a) / (b - a), 0, 1); }
  function oCub(p) { return 1 - Math.pow(1 - p, 3); }

  // ---- geometry (design px) and physics in scene units
  var V = [430, 640];                               // where the neutrino hits a nucleus
  var ANG = -18 * Math.PI / 180, U = [Math.cos(ANG), Math.sin(ANG)], N = [-U[1], U[0]];
  var A = [V[0] - U[0] * 560, V[1] - U[1] * 560];   // the neutrino comes in along the same line
  var T_HIT = 0.97, T0 = 1.54, SPEED = 170;         // hit on "hit," (0.97), the particle leaves on "it makes" (1.54)
  var NIDX = 1.32;                                  // ice
  var ALPHA = Math.asin(1 / NIDX);                  // angle between the light front and the track
  var THETA = Math.acos(1 / NIDX);                  // light leaves at this angle to the track
  var TAN_A = Math.tan(ALPHA), TAN_C = Math.tan(THETA), RCAP = 400;
  function sHead(T) { return Math.max(0, T - T0) * SPEED; }

  // ---- strings and sensors
  var SX = [300, 580, 860, 1140, 1420, 1700], SENS = [];
  SX.forEach(function (x) {
    for (var k = 0; k < 20; k++) {
      var y = 150 + k * 36, dx = x - V[0], dy = y - V[1];
      var s = dx * U[0] + dy * U[1], r = Math.abs(dx * N[0] + dy * N[1]);
      var ok = s >= r / TAN_C && r <= RCAP;
      SENS.push({ x: x, y: y, r: r, t: ok ? T0 + (s + r / TAN_A) / SPEED : Infinity });
    }
  });
  var lit = SENS.filter(function (o) { return o.t <= DUR - 0.3; });
  var TMIN = Math.min.apply(null, lit.map(function (o) { return o.t; }));
  var TMAX = Math.max.apply(null, lit.map(function (o) { return o.t; }));
  var STOPS = [[0, [255, 216, 204]], [0.18, [255, 127, 97]], [0.45, [88, 225, 255]], [0.75, [88, 169, 255]], [1, [60, 90, 230]]];
  function colourAt(r) {
    for (var i = 1; i < STOPS.length; i++) if (r <= STOPS[i][0]) {
      var a = STOPS[i - 1], b = STOPS[i], k = (r - a[0]) / (b[0] - a[0]);
      return [0, 1, 2].map(function (j) { return Math.round(a[1][j] + (b[1][j] - a[1][j]) * k); });
    }
    return STOPS[STOPS.length - 1][1];
  }
  function paint() { SENS.forEach(function (o) { if (o.t < Infinity) o.c = colourAt(clamp((o.t - TMIN) / (TMAX - TMIN), 0, 1)).join(','); }); }
  paint();

  // ---- seeded dust in the ice
  var R = ST.rand('s6-dust'), DUST = [];
  for (var i = 0; i < 140; i++) DUST.push([R() * 1920, R() * 1080, 0.6 + R() * 1.4, 0.05 + R() * 0.12, R() * 100]);

  function draw(T) {
    g.setTransform(1, 0, 0, 1, 0, 0);
    var bg = g.createLinearGradient(0, 0, 0, 1080);
    bg.addColorStop(0, '#11303a'); bg.addColorStop(0.6, '#0d2329'); bg.addColorStop(1, '#0a1a1d');
    g.fillStyle = bg; g.fillRect(0, 0, 1920, 1080);
    DUST.forEach(function (d) {
      g.fillStyle = 'rgba(190,215,255,' + d[3] + ')';
      g.beginPath(); g.arc(d[0] + ST.noise(T * 0.08, d[4]) * 6, d[1] + ST.noise(T * 0.08, d[4] + 7) * 6, d[2], 0, 6.2832); g.fill();
    });

    var sh = sHead(T), P = [V[0] + U[0] * sh, V[1] + U[1] * sh];

    // strings (cables)
    g.strokeStyle = 'rgba(170,195,240,0.28)'; g.lineWidth = 2;
    g.beginPath(); SX.forEach(function (x) { g.moveTo(x, 110); g.lineTo(x, 860); }); g.stroke();

    // light wavelets: each point on the track sends out light more slowly than the particle moves on
    if (sh > 0) {
      var wa = 0.08 + 0.22 * seg(T, 3.05, 3.5) * (1 - 0.6 * seg(T, 5.4, 6.2));
      g.lineWidth = 1.5;
      for (var e = 40; e < sh; e += 110) {
        var rad = (sh - e) / NIDX;
        if (rad < 2) continue;
        g.strokeStyle = 'rgba(88,169,255,' + wa * clamp(1 - rad / 900, 0, 1) + ')';
        g.beginPath(); g.arc(V[0] + U[0] * e, V[1] + U[1] * e, rad, 0, 6.2832); g.stroke();
      }
    }

    // the cone of blue light
    if (sh > 0) {
      var rm = Math.min(sh * Math.sin(THETA) / NIDX, RCAP), back = rm / TAN_A;
      var Fp = [P[0] - U[0] * back + N[0] * rm, P[1] - U[1] * back + N[1] * rm];
      var Fm = [P[0] - U[0] * back - N[0] * rm, P[1] - U[1] * back - N[1] * rm];
      var ca = seg(T, 1.7, 2.7) * (0.75 + 0.25 * seg(T, 5.6, 6.4));
      var fill = g.createRadialGradient(P[0], P[1], 0, P[0], P[1], rm * 1.4 + 20);
      fill.addColorStop(0, 'rgba(120,200,255,' + 0.42 * ca + ')');
      fill.addColorStop(0.5, 'rgba(88,169,255,' + 0.22 * ca + ')');
      fill.addColorStop(1, 'rgba(70,128,255,0)');
      g.fillStyle = fill;
      g.beginPath(); g.moveTo(P[0], P[1]); g.lineTo(Fp[0], Fp[1]); g.lineTo(Fm[0], Fm[1]); g.closePath(); g.fill();
      [Fp, Fm].forEach(function (F) {
        var lg = g.createLinearGradient(P[0], P[1], F[0], F[1]);
        lg.addColorStop(0, 'rgba(160,236,255,' + 0.95 * ca + ')'); lg.addColorStop(1, 'rgba(88,169,255,0)');
        g.strokeStyle = lg; g.lineWidth = 4;
        g.beginPath(); g.moveTo(P[0], P[1]); g.lineTo(F[0], F[1]); g.stroke();
      });
    }

    // sensors: dark until the front reaches them, then lit in the colour of their arrival time
    SENS.forEach(function (o) {
      var on = T >= o.t, k = on ? seg(T, o.t, o.t + 0.7) : 0;
      if (on) {
        var w = 0.4 + 0.6 * (1 - o.r / RCAP), flash = 1 - oCub(k);
        var rr = 9 + 15 * w + 26 * flash;
        var gl = g.createRadialGradient(o.x, o.y, 0, o.x, o.y, rr);
        gl.addColorStop(0, 'rgba(' + o.c + ',' + (0.55 + 0.4 * flash) * w + ')'); gl.addColorStop(1, 'rgba(' + o.c + ',0)');
        g.fillStyle = gl; g.beginPath(); g.arc(o.x, o.y, rr, 0, 6.2832); g.fill();
        g.fillStyle = 'rgb(' + o.c + ')';
      } else {
        g.fillStyle = '#24434a';
      }
      g.beginPath(); g.arc(o.x, o.y, 7.5, 0, 6.2832); g.fill();
      g.strokeStyle = on ? 'rgba(255,255,255,0.7)' : 'rgba(170,195,240,0.55)'; g.lineWidth = 1.5; g.stroke();
    });

    // the neutrino: invisible, so a faint dashed path; it reaches the nucleus on "hit"
    var nk = seg(T, 0.2, T_HIT);
    var NH = [A[0] + (V[0] - A[0]) * nk, A[1] + (V[1] - A[1]) * nk];
    g.setLineDash([12, 12]); g.strokeStyle = 'rgba(217,222,240,0.6)'; g.lineWidth = 2.5;
    g.beginPath(); g.moveTo(A[0], A[1]); g.lineTo(NH[0], NH[1]); g.stroke(); g.setLineDash([]);
    if (T < T_HIT) { g.fillStyle = 'rgba(234,240,250,0.9)'; g.beginPath(); g.arc(NH[0], NH[1], 6, 0, 6.2832); g.fill(); }
    // the nucleus and the hit
    g.fillStyle = '#c9d2ea'; g.beginPath(); g.arc(V[0], V[1], 7, 0, 6.2832); g.fill();
    if (T >= T_HIT) {
      var hk = seg(T, T_HIT, T_HIT + 0.8);
      g.strokeStyle = 'rgba(' + ACC + ',' + (1 - hk) + ')'; g.lineWidth = 3;
      g.beginPath(); g.arc(V[0], V[1], 10 + 70 * oCub(hk), 0, 6.2832); g.stroke();
      var hf = g.createRadialGradient(V[0], V[1], 0, V[0], V[1], 46);
      hf.addColorStop(0, 'rgba(255,236,228,' + (0.9 * (1 - hk) + 0.15) + ')'); hf.addColorStop(1, 'rgba(' + ACC + ',0)');
      g.fillStyle = hf; g.beginPath(); g.arc(V[0], V[1], 46, 0, 6.2832); g.fill();
    }
    // the charged particle and its track
    if (sh > 0) {
      g.strokeStyle = 'rgba(255,236,228,0.85)'; g.lineWidth = 3;
      g.beginPath(); g.moveTo(V[0], V[1]); g.lineTo(P[0], P[1]); g.stroke();
      var pg = g.createRadialGradient(P[0], P[1], 0, P[0], P[1], 26);
      pg.addColorStop(0, 'rgba(255,255,255,1)'); pg.addColorStop(0.3, 'rgba(' + ACC + ',0.8)'); pg.addColorStop(1, 'rgba(' + ACC + ',0)');
      g.fillStyle = pg; g.beginPath(); g.arc(P[0], P[1], 26, 0, 6.2832); g.fill();
    }

    // "Cherenkov light" rides inside the lower half of the cone (translate only)
    if (ck) {
      var ax = P[0] - U[0] * 300 + N[0] * 190, ay = P[1] - U[1] * 300 + N[1] * 190;
      var lx = clamp(ax - 190, 600, 1480), ly = clamp(ay - 34, 300, 790);
      ck.style.transform = 'translate(' + lx.toFixed(1) + 'px,' + ly.toFixed(1) + 'px)';
    }
  }

  var win = null;
  ST.onSeek(function (t) {
    if (!win) {
      win = (ST.clips() || []).filter(function (c) { return c.id === SID; })[0] || { start: 0 };
      ACC = rgbOf('--accent', ACC); STOPS[1][1] = ACC.split(',').map(Number); paint();
    }
    var T = t - win.start;
    if (T < -1 || T > DUR + 2) return;
    draw(clamp(T, 0, DUR));
  });
})();
