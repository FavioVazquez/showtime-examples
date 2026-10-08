/* shot-1 cold open: thousands of faint neutrinos stream straight through a fingertip (drawn from scene time).
 * P11: "Every second, 65 billion neutrinos from the Sun pass through your little fingernail" (CLAIMS.md).
 * The counter is that rate times the time since the video began (shot-1 starts the video). */
(function () {
  'use strict';
  // the look's accent (--accent) for highlights drawn on canvas
  var ACC = (function () {
    var h = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim().replace('#', '');
    if (h.length === 3) h = h.replace(/./g, '$&$&');
    var n = parseInt(h, 16); return isNaN(n) ? '255,127,97' : [(n >> 16) & 255, (n >> 8) & 255, n & 255].join(',');
  })();
  var SID = 'shot-1', W = 1920, H = 1080, DUR = 11;
  var sec = document.getElementById(SID);
  if (!sec) return;
  var cv = sec.querySelector('.s1-stream'), g = cv.getContext('2d');
  var numEl = sec.querySelector('.s1-num');

  // the stream: seeded once, positions are closed-form in t
  var ANG = 8 * Math.PI / 180, CA = Math.cos(ANG), SA = Math.sin(ANG), SPAN = W + 700;
  var COLS = ['88,225,255', '88,169,255', '234,240,250'];
  var r = ST.rand('s1-stream'), DOTS = [];
  for (var i = 0; i < 2600; i++) {
    var depth = r();
    DOTS.push({ y0: r.range(-320, H + 60), ph: r.range(0, SPAN), v: 520 + 900 * depth + r.range(-80, 80),
      w: 1.2 + 2.2 * depth, a: 0.16 + 0.42 * depth * r.range(0.6, 1), c: COLS[r.int(0, 2)] });
  }
  // the one we follow on "how do you catch one?": it keeps going
  var ONE = { t0: 8.84, x0: 2010, v: 900, yAt900: 575 };
  function onePos(t) { var x = ONE.x0 - ONE.v * (t - ONE.t0); return [x, ONE.yAt900 + (900 - x) * Math.tan(ANG)]; }

  function draw(t) {
    g.clearRect(0, 0, W, H);
    g.lineCap = 'round';
    for (var i = 0; i < DOTS.length; i++) {
      var d = DOTS[i], s = (d.ph + d.v * t) % SPAN;
      var x = W + 350 - s * CA, y = d.y0 + s * SA;
      if (x < -60 || x > W + 60 || y < -60 || y > H + 60) continue;
      var len = d.v * 0.045;
      g.strokeStyle = 'rgba(' + d.c + ',' + d.a.toFixed(3) + ')';
      g.lineWidth = d.w;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + len * CA, y - len * SA); g.stroke();
    }
    // the followed neutrino and its ring
    var k = ST.progress(t, 8.84, 9.24, ST.ease.outCubic);
    if (k > 0) {
      var p = onePos(t);
      if (p[0] > -80) {
        g.save();
        var gl = g.createRadialGradient(p[0], p[1], 0, p[0], p[1], 22);
        gl.addColorStop(0, 'rgba(255,236,228,1)'); gl.addColorStop(0.35, 'rgba(' + ACC + ',0.8)'); gl.addColorStop(1, 'rgba(' + ACC + ',0)');
        g.fillStyle = gl; g.beginPath(); g.arc(p[0], p[1], 22, 0, 6.2832); g.fill();
        g.strokeStyle = 'rgba(' + ACC + ',' + (0.95 * k).toFixed(3) + ')'; g.lineWidth = 3.5;
        g.beginPath(); g.arc(p[0], p[1], 34 + 40 * (1 - k), 0, 6.2832); g.stroke();
        // its trail: it does not stop
        var tr = g.createLinearGradient(p[0], p[1], p[0] + 240 * CA, p[1] - 240 * SA);
        tr.addColorStop(0, 'rgba(' + ACC + ',0.7)'); tr.addColorStop(1, 'rgba(' + ACC + ',0)');
        g.strokeStyle = tr; g.lineWidth = 4; g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(p[0] + 240 * CA, p[1] - 240 * SA); g.stroke();
        g.restore();
      }
    }
  }
  function fmt(n) { var s = String(Math.floor(n)); return s.replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

  var win = null;
  ST.onSeek(function (t) {
    if (!win) win = ST.clips().filter(function (c) { return c.id === SID; })[0];
    if (!win) return;
    var lt = t - win.start;
    if (lt < -1 || lt > DUR + 1) return;            // drawn a second either side for transitions
    lt = Math.max(0, Math.min(DUR, lt));
    draw(lt);
    numEl.textContent = fmt(65e9 * lt);               // scene time = video time: shot-1 opens the video
  });
})();
