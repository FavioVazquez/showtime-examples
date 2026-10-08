/* shot-12: the open question. An ILLUSTRATED sky (labelled "illustration" on the frame), not IceCube's sky map.
 * draw(T) is a pure function of the scene-relative time T; every random layout is seeded once at load.
 * Beats (am_michael cues, re-timed 10:59): "high-energy" 2.47 -> a diffuse glow of neutrinos from everywhere (P20);
 * "Which" 5.03 / band label 5.75 -> the Milky Way glows in neutrinos (P31); "one nearby galaxy" 7.59-8.40 ->
 * NGC 1068 brightens and is circled; "shows evidence" 8.99 -> a few neutrinos gather on it (P23), "not yet proof" (P25). */
(function () {
  'use strict';
  var SID = 'shot-12', DUR = 11.86;
  var sec = document.getElementById(SID); if (!sec || !window.ST) return;
  var cv = sec.querySelector('.s12-cv'), g = cv.getContext('2d');
  var ACC = '255,127,97';
  function rgbOf(name, fb) {
    var v = getComputedStyle(sec).getPropertyValue(name).trim(), m = /^#([0-9a-f]{6})$/i.exec(v);
    if (!m) return fb;
    var n = parseInt(m[1], 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255].join(',');
  }
  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
  function seg(t, a, b) { return clamp((t - a) / (b - a), 0, 1); }
  function oCub(p) { return 1 - Math.pow(1 - p, 3); }
  function ioCub(p) { return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; }
  function gauss(r) { var u = 1 - r(), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(6.2832 * v); }

  var GX = 1460, GY = 560;                                    // the circled galaxy
  function bandY(x) { return 760 - (x + 100) * 0.2642; }      // the Milky Way's centre line

  // ---- stars
  var R = ST.rand('s12-stars'), STARS = [];
  for (var i = 0; i < 430; i++) STARS.push([R() * 1920, R() * 1080, 0.5 + Math.pow(R(), 3) * 1.8, 0.2 + R() * 0.6, R() * 50]);

  // ---- the band, drawn once into two layers: starlight (soft white) and neutrino light (cyan)
  function bandLayer(seed, rgb, n, spread, alpha) {
    var c = document.createElement('canvas'); c.width = 1920; c.height = 1080;
    var x = c.getContext('2d'), r = ST.rand(seed);
    for (var k = 0; k < n; k++) {
      var px = -100 + r() * 2120, off = gauss(r) * spread, py = bandY(px) + off;
      var rad = 30 + r() * 70, a = alpha * (0.4 + 0.6 * r()) * Math.exp(-(off * off) / (2 * spread * spread * 1.6));
      var gr = x.createRadialGradient(px, py, 0, px, py, rad);
      gr.addColorStop(0, 'rgba(' + rgb + ',' + a + ')'); gr.addColorStop(1, 'rgba(' + rgb + ',0)');
      x.fillStyle = gr; x.beginPath(); x.arc(px, py, rad, 0, 6.2832); x.fill();
    }
    return c;
  }
  var BAND_W = bandLayer('s12-band-w', '214,232,240', 520, 52, 0.075);
  var BAND_C = bandLayer('s12-band-c', '88,225,255', 420, 40, 0.06);
  var BAND_STARS = []; (function () { var r = ST.rand('s12-bs'); for (var k = 0; k < 360; k++) { var px = r() * 1920; BAND_STARS.push([px, bandY(px) + gauss(r) * 38, 0.4 + r() * 1.1, 0.25 + r() * 0.5]); } })();

  // ---- the galaxy: two seeded spiral arms and a bright core, drawn once
  var GAL = (function () {
    var c = document.createElement('canvas'); c.width = c.height = 320;
    var x = c.getContext('2d'), r = ST.rand('s12-gal');
    var core = x.createRadialGradient(160, 160, 0, 160, 160, 70);
    core.addColorStop(0, 'rgba(255,248,240,0.95)'); core.addColorStop(0.25, 'rgba(255,226,210,0.45)'); core.addColorStop(1, 'rgba(255,226,210,0)');
    x.fillStyle = core; x.fillRect(0, 0, 320, 320);
    for (var arm = 0; arm < 2; arm++) for (var k = 0; k < 420; k++) {
      var th = r() * 4.2, rr = 14 * Math.exp(0.42 * th), a = th + arm * Math.PI + gauss(r) * 0.16;
      var px = 160 + Math.cos(a) * rr + gauss(r) * 4, py = 160 + Math.sin(a) * rr + gauss(r) * 4;
      x.fillStyle = 'rgba(225,238,245,' + (0.25 + 0.5 * r()) * (1 - th / 5) + ')';
      x.fillRect(px, py, 1.6, 1.6);
    }
    return c;
  })();

  // ---- neutrinos arriving from everywhere (the diffuse glow), and the few on the galaxy
  var NU = []; (function () {
    var r = ST.rand('s12-nu');
    for (var k = 0; k < 170; k++) NU.push([40 + r() * 1840, 40 + r() * 820, 2.47 + 9.2 * Math.pow(r(), 1.7), 0.6 + r() * 0.7]);
    for (var j = 0; j < 9; j++) NU.push([GX + gauss(r) * 26, GY + gauss(r) * 24, 9.0 + j * 0.28 + r() * 0.2, 1.1]);
  })();
  var HAZE = []; (function () { var r = ST.rand('s12-haze'); for (var k = 0; k < 9; k++) HAZE.push([r() * 1920, r() * 860, 260 + r() * 260]); })();

  function draw(T) {
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
    var bg = g.createRadialGradient(1100, 480, 60, 1000, 520, 1300);
    bg.addColorStop(0, '#10303a'); bg.addColorStop(0.55, '#0b1f25'); bg.addColorStop(1, '#071214');
    g.fillStyle = bg; g.fillRect(0, 0, 1920, 1080);

    // diffuse glow rising on "high-energy neutrinos from space"
    var hz = ioCub(seg(T, 2.47, 4.3));
    if (hz > 0) HAZE.forEach(function (h) {
      var gr = g.createRadialGradient(h[0], h[1], 0, h[0], h[1], h[2]);
      gr.addColorStop(0, 'rgba(88,169,255,' + 0.10 * hz + ')'); gr.addColorStop(1, 'rgba(88,169,255,0)');
      g.fillStyle = gr; g.fillRect(h[0] - h[2], h[1] - h[2], h[2] * 2, h[2] * 2);
    });

    // the Milky Way: starlight from frame 0, glowing in neutrinos from "Which objects" on
    g.globalAlpha = 0.75; g.drawImage(BAND_W, 0, 0);
    BAND_STARS.forEach(function (s) { g.fillStyle = 'rgba(230,240,245,' + s[3] * 0.8 + ')'; g.fillRect(s[0], s[1], s[2], s[2]); });
    var bc = ioCub(seg(T, 5.6, 6.6));
    if (bc > 0) { g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.85 * bc; g.drawImage(BAND_C, 0, 0); g.globalCompositeOperation = 'source-over'; }
    g.globalAlpha = 1;

    STARS.forEach(function (s) {
      var a = s[3] * (0.85 + 0.15 * ST.noise(T * 0.7, s[4]));
      g.fillStyle = 'rgba(234,244,241,' + a + ')';
      g.beginPath(); g.arc(s[0], s[1], s[2], 0, 6.2832); g.fill();
    });

    // the galaxy: faint until "one nearby galaxy", then brighter
    var ga = 0.5 + 0.5 * oCub(seg(T, 7.59, 8.3));
    g.save(); g.translate(GX, GY); g.rotate(-0.5); g.scale(0.95, 0.55); g.globalAlpha = ga;
    g.drawImage(GAL, -160, -160); g.restore();
    g.globalAlpha = 1;

    // neutrinos: each flashes on arrival and leaves a faint mark
    NU.forEach(function (n) {
      if (T < n[2]) return;
      var dt = T - n[2], a = seg(dt, 0, 0.12) * (0.28 + 0.72 * Math.exp(-dt / 0.8)), rr = 10 + 12 * n[3] * Math.exp(-dt / 0.6);
      var gr = g.createRadialGradient(n[0], n[1], 0, n[0], n[1], rr);
      gr.addColorStop(0, 'rgba(210,248,255,' + a + ')'); gr.addColorStop(0.35, 'rgba(88,225,255,' + 0.7 * a + ')'); gr.addColorStop(1, 'rgba(88,225,255,0)');
      g.fillStyle = gr; g.beginPath(); g.arc(n[0], n[1], rr, 0, 6.2832); g.fill();
    });

    // the circle on "one nearby galaxy"
    var ck = seg(T, 7.65, 8.35);
    if (ck > 0) {
      g.strokeStyle = 'rgb(' + ACC + ')'; g.lineWidth = 4; g.lineCap = 'round';
      g.beginPath(); g.arc(GX, GY, 110, -Math.PI / 2, -Math.PI / 2 + 6.2832 * ioCub(ck)); g.stroke();
    }
  }

  var win = null;
  ST.onSeek(function (t) {
    if (!win) { win = (ST.clips() || []).filter(function (c) { return c.id === SID; })[0] || { start: 0 }; ACC = rgbOf('--accent', ACC); }
    var T = t - win.start;
    if (T < -1 || T > DUR + 2) return;
    draw(clamp(T, 0, DUR));
  });
})();
