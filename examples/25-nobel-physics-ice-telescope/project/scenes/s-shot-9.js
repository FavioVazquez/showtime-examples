/* shot-9: what it found. Cards for 2013 (P19) and 2014 (P20), then IceCube's real shower of
 * 8 December 2016 (P33, P38) replayed from the public data (IceCube Collaboration, DOI 10.21234/gr2021):
 * sensors as faint dots, hit sensors glowing, coloured by first-hit time, time slowed down.
 * Scene-relative times; a pure function of time. Drawing adapted from the glashow-replay project. */
(function () {
  'use strict';
  // ================= every number this scene uses =================
  var C = {
    sid: 'shot-9',
    // beats, scene seconds, from crew/cues-shot-9.txt
    card1: 2.32,               // "In twenty thirteen"
    card2: 5.40,               // before "high-energy" (2014 card, not spoken; holds its 2.5 s reading time)
    cardsOut: 8.60,            // before "In twenty sixteen" (8.84)
    date: 8.84,                // "In twenty sixteen"
    energy: 9.40,              // so it holds its reading time (66 characters) to the cut
    shower: 10.18,             // "caught this shower"
    fly: [8.5, 10.3],          // the camera flies in to the shower
    replay: [10.18, 13.85],    // the event's 17 microseconds, slowed down
    warp: 2.2,                 // slow at the start, faster in the long tail (as the replay project)
    cam: { az0: -0.95, azRate: 0.06, drift: [3600, 2900],   // a slow push-in while the cards hold
           el: [0.30, 0.24], dist: [3600, 1550], sx: [1380, 1400], sy: [480, 470], f: 1700, dim: [0.55, 1] },
  };
  // ================================================================

  var EVT = window.S9_EVT, N = EVT.sensors.length, NP = EVT.npulses, TMAX = EVT.tmax;
  var sec = document.getElementById(C.sid);
  var cv = sec.querySelector('.s9-cv'), g = cv.getContext('2d');
  var W = cv.width, H = cv.height;
  var q = function (s) { return sec.querySelector(s); };
  var T = { c1: q('.s9-c1'), c2: q('.s9-c2'), date: q('.s9-date'), energy: q('.s9-energy'), shower: q('.s9-shower'), slow: q('.s9-slow') };

  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
  function lerp(a, b, p) { return a + (b - a) * p; }
  function seg(t, a, b) { return clamp((t - a) / (b - a), 0, 1); }
  function inOut(p) { return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; }
  function out(p) { return 1 - Math.pow(1 - p, 3); }

  // per hit sensor: pulse times and cumulative charge
  var HIT = {}, LIST = [];
  for (var i = 0; i < NP; i++) {
    var p = EVT.pulses[i], h = HIT[p[0]];
    if (!h) { h = HIT[p[0]] = { s: p[0], t: [], c: [], first: p[1], q: 0 }; LIST.push(h); }
    h.q += p[2]; h.t.push(p[1]); h.c.push(h.q);
  }
  LIST.sort(function (a, b) { return a.first - b.first; });
  LIST.forEach(function (h, k) { h.rank = k / (LIST.length - 1); });
  var QMAX = LIST.reduce(function (m, h) { return Math.max(m, h.q); }, 0);
  var CEN = (function () {
    var w = 0, x = 0, y = 0, z = 0;
    LIST.forEach(function (h) { var s = EVT.sensors[h.s]; w += h.q; x += h.q * s[0]; y += h.q * s[1]; z += h.q * s[2]; });
    return [x / w, y / w, z / w];
  })();
  var DCEN = [0, 0, 0];
  EVT.sensors.forEach(function (s) { DCEN[0] += s[0] / N; DCEN[1] += s[1] / N; DCEN[2] += s[2] / N; });

  var STOPS = [[0, [255, 246, 214]], [0.18, [255, 196, 92]], [0.45, [92, 225, 255]], [0.75, [70, 128, 255]], [1, [150, 104, 255]]];
  function colourAt(r) {
    for (var i = 1; i < STOPS.length; i++) if (r <= STOPS[i][0]) {
      var a = STOPS[i - 1], b = STOPS[i], k = (r - a[0]) / (b[0] - a[0]);
      return [0, 1, 2].map(function (j) { return Math.round(a[1][j] + (b[1][j] - a[1][j]) * k); });
    }
    return STOPS[STOPS.length - 1][1];
  }
  var SPR = [];
  for (var b = 0; b <= 32; b++) {
    var c = colourAt(b / 32), s = document.createElement('canvas'); s.width = s.height = 128;
    var x = s.getContext('2d'), gr = x.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.12, 'rgba(' + c + ',0.95)');
    gr.addColorStop(0.38, 'rgba(' + c + ',0.35)'); gr.addColorStop(1, 'rgba(' + c + ',0)');
    x.fillStyle = gr; x.fillRect(0, 0, 128, 128); SPR.push(s);
  }

  function eventTime(lt) { return TMAX * Math.pow(seg(lt, C.replay[0], C.replay[1]), C.warp); }
  function filmTimeOf(tns) { return C.replay[0] + Math.pow(tns / TMAX, 1 / C.warp) * (C.replay[1] - C.replay[0]); }
  function upper(arr, v) { var lo = 0, hi = arr.length; while (lo < hi) { var m = (lo + hi) >> 1; if (arr[m] <= v) lo = m + 1; else hi = m; } return lo; }

  function camera(lt) {
    var c = C.cam, k = inOut(seg(lt, C.fly[0], C.fly[1]));
    return { az: c.az0 + c.azRate * lt, el: lerp(c.el[0], c.el[1], k), dist: lerp(lerp(c.drift[0], c.drift[1], seg(lt, 0, C.fly[0])), c.dist[1], k),
      sx: lerp(c.sx[0], c.sx[1], k), sy: lerp(c.sy[0], c.sy[1], k), f: c.f, dim: lerp(c.dim[0], c.dim[1], k),
      tx: lerp(DCEN[0], CEN[0], k), ty: lerp(DCEN[1], CEN[1], k), tz: lerp(DCEN[2], CEN[2], k) };
  }
  function project(cam, x, y, z) {
    x -= cam.tx; y -= cam.ty; z -= cam.tz;
    var ca = Math.cos(cam.az), sa = Math.sin(cam.az);
    var x1 = x * ca - y * sa, y1 = x * sa + y * ca;
    var ce = Math.cos(cam.el), se = Math.sin(cam.el);
    var depth = y1 * ce + z * se, up = z * ce - y1 * se;
    var d = cam.dist + depth, s = cam.f / d;
    return [cam.sx + x1 * s, cam.sy - up * s, s, d];
  }

  function draw(lt) {
    g.clearRect(0, 0, W, H);
    var cam = camera(lt), a = cam.dim * (1 - 0.35 * seg(lt, C.replay[0], C.replay[0] + 1.5));
    g.save();
    g.lineWidth = 1.2; g.strokeStyle = 'rgba(150,180,235,' + (0.24 * a).toFixed(3) + ')';
    g.beginPath();
    for (var i = 0; i < EVT.strings.length; i++) {
      var st = EVT.strings[i], A = EVT.sensors[st[0]], B = EVT.sensors[st[1]];
      var pa = project(cam, A[0], A[1], A[2] - 8), pb = project(cam, B[0], B[1], B[2] + 8);
      if (pa[3] > 50 && pb[3] > 50) { g.moveTo(pa[0], pa[1]); g.lineTo(pb[0], pb[1]); }
    }
    g.stroke();
    g.fillStyle = 'rgba(190,210,255,' + (0.75 * a).toFixed(3) + ')';
    for (var j = 0; j < N; j++) {
      var s = EVT.sensors[j], p = project(cam, s[0], s[1], s[2]);
      if (p[3] <= 50) continue;
      var r = Math.max(1.4, 2.4 * p[2]);
      g.fillRect(p[0] - r / 2, p[1] - r / 2, r, r);
    }
    g.restore();
    // hits
    if (lt >= C.replay[0]) {
      var tns = eventTime(lt), list = [];
      for (var k = 0; k < LIST.length; k++) {
        var h = LIST[k];
        if (h.first > tns) break;
        var n = upper(h.t, tns), qq = n ? h.c[n - 1] : 0;
        var sp = EVT.sensors[h.s], pp = project(cam, sp[0], sp[1], sp[2]);
        if (pp[3] <= 50) continue;
        list.push([pp, h, qq, Math.exp(-(lt - filmTimeOf(h.first)) / 0.35)]);
      }
      list.sort(function (u, v) { return v[0][3] - u[0][3]; });
      g.save(); g.globalCompositeOperation = 'lighter';
      for (var m = 0; m < list.length; m++) {
        var P = list[m][0], H2 = list[m][1], lq = Math.log(1 + list[m][2]) / Math.log(1 + QMAX), fl = list[m][3];
        var rr = (3.4 + 21 * lq + 14 * fl) * P[2];
        g.globalAlpha = Math.min(1, 0.45 + 0.5 * lq + 0.3 * fl);
        g.drawImage(SPR[Math.round(H2.rank * 32)], P[0] - rr, P[1] - rr, rr * 2, rr * 2);
      }
      g.restore();
    }
    // a scrim behind the left text column once the camera is close
    var sa = 0.8 * inOut(seg(lt, C.fly[0], C.fly[1]));
    if (sa > 0) {
      var sg = g.createLinearGradient(0, 0, 1150, 0);
      sg.addColorStop(0, 'rgba(12,18,40,' + sa.toFixed(3) + ')'); sg.addColorStop(0.7, 'rgba(12,18,40,' + (sa * 0.6).toFixed(3) + ')'); sg.addColorStop(1, 'rgba(12,18,40,0)');
      g.fillStyle = sg; g.fillRect(0, 0, 1150, H);
    }
  }

  function show(node, lt, a, b) {
    var i = out(seg(lt, a, a + 0.3)), o = b == null ? 0 : seg(lt, b, b + 0.3);
    node.style.opacity = (i * (1 - o)).toFixed(3);
    node.style.transform = 'translateY(' + ((1 - i) * 24 - o * 16).toFixed(2) + 'px)';
  }

  var clip = null;
  ST.onSeek(function (t) {
    if (!clip) clip = ST.clips().filter(function (c) { return c.id === C.sid; })[0];
    if (!clip) return;
    if (t < clip.start - 1e-6 || (clip.end != null && t >= clip.end)) return;
    var lt = t - clip.start;
    draw(lt);
    show(T.c1, lt, C.card1, C.cardsOut);
    show(T.c2, lt, C.card2, C.cardsOut);
    show(T.date, lt, C.date, null);
    show(T.energy, lt, C.energy, null);
    show(T.shower, lt, C.shower, null);
    show(T.slow, lt, C.replay[0], null);
  });
})();
