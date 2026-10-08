/* shot-7: our toy telescope. The toy example event drawn in 3D on the real IceCube layout: the true
 * muon track, the hits lighting in time order, then the fitted direction over the true one; then the
 * same patch of ice thinned to a quarter of the strings (a 2x grid) for q2. Scene-relative times; a pure function of time. */
(function () {
  'use strict';
  // ================= every number this scene uses =================
  var C = {
    sid: 'shot-7',
    // our toy model, results/example_event.json (nobel-phys-telescope 2026/physics/telescope, event 3453, summary status
    // "final", read 2026-10-06 11:05). sensor_index = row of data/icecube86_geometry.csv = assets/shot-7/geometry.js.
    track: { point: [-370.66, -217.53, 79.18], dir: [-0.00013, 0.3179, 0.94812] },
    pandel: { point: [-365.96, -225.95, 51.87], dir: [-0.00855, 0.32487, 0.94572] },
    hits: [[418, -1868.5, 1], [416, -1569.1, 3], [412, -1243.7, 1], [413, -1214.1, 2], [830, -1060.2, 2], [824, -719.3, 1], [821, -604.9, 1], [825, -544.5, 1], [477, -506.2, 1], [818, -501.1, 2], [414, -390.5, 1], [881, -282.0, 2], [826, -231.8, 1], [1351, -88.6, 5], [1348, -78.7, 1], [820, -54.1, 3], [1347, -52.2, 9], [1346, 25.4, 5], [1345, 27.5, 5], [1350, 31.1, 1], [1352, 52.9, 3], [1344, 58.4, 10], [1349, 62.5, 1], [1354, 67.6, 1], [1360, 108.5, 1], [1343, 113.5, 14], [816, 168.4, 1], [1342, 180.8, 10], [1341, 264.2, 5], [880, 273.0, 2], [1340, 323.0, 2], [888, 436.3, 1], [1356, 478.3, 1], [1338, 544.0, 3], [892, 559.0, 1], [402, 696.0, 1], [1337, 705.5, 2], [1335, 965.4, 3], [1339, 976.4, 3], [1933, 1092.2, 2], [1407, 1152.3, 1], [1336, 1192.0, 2], [1930, 1520.3, 2], [1925, 1553.1, 2], [1333, 1559.4, 1], [1938, 1603.6, 1], [1273, 1616.4, 1], [1921, 1709.5, 1], [1390, 1719.8, 1], [1928, 1784.0, 1], [2463, 1914.0, 1], [1874, 1914.9, 1], [1861, 1976.8, 1], [1922, 2032.3, 1], [1920, 2068.1, 2], [1926, 2175.8, 1], [1924, 2248.0, 1], [1327, 2388.1, 1], [1403, 2550.7, 1], [1862, 2651.9, 1], [2464, 3367.4, 1]],
    cMperNs: 0.2998,               // the muon moves at about the speed of light (m per ns)
    sIn: -640, sOut: 510,          // the drawn part of the track, metres from track.point (inside the array)
    tevFrom: -2200, tevTo: 3500,   // event time (ns) shown across the replay window
    // beats, scene seconds, from crew/cues-shot-7.txt
    replay: [2.80, 5.9],           // "From the light's timing alone" .. the last hit
    legend: 3.37,                  // "timing"
    keyTrue: 4.3,
    fit: [4.44, 5.4],              // "finds the particle's direction"
    // P12: neutrinos fly straight, so the fitted direction points back toward the source
    back: [6.61, 7.4],             // "Neutrinos": the camera backs off and makes room below the event
    backLine: [7.64, 8.9],         // "straight, so that points back": the fit extended backwards (dashed)
    source: 9.28,                  // "where they came from": the "source?" mark
    backLen: 420, backFloor: 820,  // the dashed line's screen length (px) and its lowest end (y px)
    clear: [10.45, 11.05],         // after "Guess:" (10.70) the event clears
    outline: [11.48, 12.2],        // "same ice": the patch outline
    thin: [12.89, 14.6],           // "twice as far apart, so a quarter": 3 of every 4 strings fade
    thinChip: 14.54,               // "quarter"
    thinTo: 0.07,                  // what is left of a removed string (a ghost)
    // the 19 of the 78 regular strings (0-based) on a 2x hex grid of the real layout (lattice from string 36's
    // neighbours, even-even sublattice); DeepCore's 8 infill strings (78-85) go too. Outline: the hull of the 78.
    keep: [1, 3, 5, 14, 16, 18, 20, 31, 33, 35, 37, 39, 51, 53, 55, 57, 68, 70, 72],
    hull: [30, 21, 6, 0, 5, 12, 39, 49, 73, 77, 76, 74],
    lift: [16.2, 17.1],            // the picture moves up before the question beat (17.23)
    // camera
    cam: { az0: -0.75, azRate: 0.045, el: [0.40, 0.16], dist: [3050, 4600], sx: 1250, sy: [470, 315], f: 1800,
           close: [2.2, 3.1, 6.61, 7.4], closeDist: 1900, closeEl: 0.30, backDist: 3600, backSy: 330 },   // in to the event while it plays, back out for the guess
  };
  // ================================================================

  var GEO = window.S7_GEO, N = GEO.sensors.length;
  var ACC = (getComputedStyle(document.documentElement).getPropertyValue('--accent') || '').trim() || '#ff7f61';   // the look's accent
  var sec = document.getElementById(C.sid);
  var cv = sec.querySelector('.s7-cv'), g = cv.getContext('2d');
  var W = cv.width, H = cv.height;
  var el = function (s) { return sec.querySelector(s); };
  var T = { legend: el('.s7-time'), keyTrue: el('.s7-key-true'), keyFit: el('.s7-key-fit'), spread: el('.s7-spread'), src: el('.s7-src') };
  var KEEP = {}; C.keep.forEach(function (i) { KEEP[i] = 1; });

  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
  function lerp(a, b, p) { return a + (b - a) * p; }
  function seg(t, a, b) { return clamp((t - a) / (b - a), 0, 1); }
  function inOut(p) { return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; }
  function out(p) { return 1 - Math.pow(1 - p, 3); }

  // detector centre (m)
  var CEN = [0, 0, 0];
  GEO.sensors.forEach(function (s) { CEN[0] += s[0] / N; CEN[1] += s[1] / N; CEN[2] += s[2] / N; });

  // hits: colour by rank of arrival time (as the real-event replay)
  var HITS = C.hits.slice().sort(function (a, b) { return a[1] - b[1]; });
  var STOPS = [[0, [255, 246, 214]], [0.18, [255, 196, 92]], [0.45, [92, 225, 255]], [0.75, [70, 128, 255]], [1, [150, 104, 255]]];
  function colourAt(r) {
    for (var i = 1; i < STOPS.length; i++) if (r <= STOPS[i][0]) {
      var a = STOPS[i - 1], b = STOPS[i], k = (r - a[0]) / (b[0] - a[0]);
      return [0, 1, 2].map(function (j) { return Math.round(a[1][j] + (b[1][j] - a[1][j]) * k); });
    }
    return STOPS[STOPS.length - 1][1];
  }
  function sprite(c, core) {
    var s = document.createElement('canvas'); s.width = s.height = 128;
    var x = s.getContext('2d'), gr = x.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, core); gr.addColorStop(0.14, 'rgba(' + c + ',0.95)');
    gr.addColorStop(0.4, 'rgba(' + c + ',0.35)'); gr.addColorStop(1, 'rgba(' + c + ',0)');
    x.fillStyle = gr; x.fillRect(0, 0, 128, 128); return s;
  }
  var SPR = [];
  for (var b = 0; b <= 32; b++) SPR.push(sprite(colourAt(b / 32), 'rgba(255,255,255,1)'));
  var HEAD = sprite([255, 255, 255], 'rgba(255,255,255,1)');
  var QMAX = HITS.reduce(function (m, h) { return Math.max(m, h[2]); }, 1);

  // fitted line: the point on it nearest track.point, so both lines are drawn over the same stretch
  var FIT0 = (function () {
    var p = C.pandel.point, d = C.pandel.dir, q = C.track.point;
    var k = (q[0] - p[0]) * d[0] + (q[1] - p[1]) * d[1] + (q[2] - p[2]) * d[2];
    return [p[0] + d[0] * k, p[1] + d[1] * k, p[2] + d[2] * k];
  })();
  // the event's centre: the middle of the drawn stretch of track
  var EVC = [0, 1, 2].map(function (j) { return C.track.point[j] + C.track.dir[j] * (C.sIn + C.sOut) / 2; });
  function along(p, d, s) { return [p[0] + d[0] * s, p[1] + d[1] * s, p[2] + d[2] * s]; }

  function camera(lt) {
    var c = C.cam, k2 = inOut(seg(lt, C.lift[0], C.lift[1]));
    var k0 = inOut(seg(lt, c.close[0], c.close[1])) * (1 - inOut(seg(lt, c.close[2], c.close[3])));
    var k3 = inOut(seg(lt, C.back[0], C.back[1])) * (1 - inOut(seg(lt, C.clear[1], C.clear[1] + 0.8)));
    function L(v) { return lerp(v[0], v[1], k2); }
    return { az: c.az0 + c.azRate * Math.min(lt, C.back[0]) + c.azRate * 0.3 * Math.max(0, lt - C.back[0]),
      el: lerp(L(c.el), c.closeEl, k0), dist: lerp(lerp(L(c.dist), c.backDist, k3), c.closeDist, k0), sx: c.sx, sy: lerp(L(c.sy), c.backSy, k3), f: c.f,
      tx: lerp(CEN[0], EVC[0], k0), ty: lerp(CEN[1], EVC[1], k0), tz: lerp(CEN[2], EVC[2], k0) };
  }
  function project(cam, x, y, z) {
    x -= cam.tx; y -= cam.ty; z -= cam.tz;
    var ca = Math.cos(cam.az), sa = Math.sin(cam.az);
    var x1 = x * ca - y * sa, y1 = x * sa + y * ca;
    var ce = Math.cos(cam.el), se = Math.sin(cam.el);
    var depth = y1 * ce + z * se, up = z * ce - y1 * se;
    var s = cam.f / (cam.dist + depth);
    return [cam.sx + x1 * s, cam.sy - up * s, s];
  }
  function sensorAt(cam, i) { var s = GEO.sensors[i]; return project(cam, s[0], s[1], s[2]); }
  // how much of string i is left: removed strings fade one after another (seeded order) through the thin window
  var ORDER = (function () { var r = ST.rand('s7-thin'), o = {}; for (var i = 0; i < GEO.strings.length; i++) o[i] = r(); return o; })();
  function stringAlpha(i, lt) {
    if (KEEP[i]) return 1;
    var a = C.thin[0] + ORDER[i] * (C.thin[1] - C.thin[0] - 0.5);
    return 1 - (1 - C.thinTo) * inOut(seg(lt, a, a + 0.5));
  }

  function drawDetector(cam, lt) {
    g.save();
    for (var i = 0; i < GEO.strings.length; i++) {
      var al = stringAlpha(i, lt), st = GEO.strings[i];
      var boost = KEEP[i] ? 1 + 1.3 * inOut(seg(lt, C.thin[0], C.thin[1])) : 1;   // the strings that stay come forward
      var a = sensorAt(cam, st[0]), b2 = sensorAt(cam, st[1]);
      g.lineWidth = 1.4 * boost; g.strokeStyle = 'rgba(150,180,235,' + Math.min(1, 0.24 * al * boost).toFixed(3) + ')';
      g.beginPath(); g.moveTo(a[0], a[1] + 6 * a[2]); g.lineTo(b2[0], b2[1] - 6 * b2[2]); g.stroke();
      g.fillStyle = 'rgba(190,210,255,' + Math.min(1, 0.72 * al * boost).toFixed(3) + ')';
      for (var j = st[1]; j <= st[0]; j++) {
        var p = sensorAt(cam, j), r = Math.max(1.6, 3.4 * p[2]) * (1 + 0.5 * (boost - 1));
        g.fillRect(p[0] - r / 2, p[1] - r / 2, r, r);
      }
    }
    // the patch outline: the same ice before and after (top and bottom rings, corner edges)
    var o = out(seg(lt, C.outline[0], C.outline[1]));
    if (o > 0) {
      g.globalAlpha = 0.45 * o; g.strokeStyle = '#58e1ff'; g.lineWidth = 2; g.setLineDash([12, 10]);
      [0, 59].forEach(function (om) {
        g.beginPath();
        C.hull.forEach(function (si, k) { var p = sensorAt(cam, si * 60 + om); if (k) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]); });
        g.closePath(); g.stroke();
      });
      g.beginPath();
      C.hull.forEach(function (si) { var a2 = sensorAt(cam, si * 60), b3 = sensorAt(cam, si * 60 + 59); g.moveTo(a2[0], a2[1]); g.lineTo(b3[0], b3[1]); });
      g.stroke(); g.setLineDash([]);
    }
    g.restore();
  }

  function line3(cam, P, D, s0, s1, style, width, alpha) {
    if (s1 <= s0 || alpha <= 0) return null;
    var a = along(P, D, s0), b2 = along(P, D, s1);
    var pa = project(cam, a[0], a[1], a[2]), pb = project(cam, b2[0], b2[1], b2[2]);
    g.save(); g.globalAlpha = alpha; g.strokeStyle = style; g.lineWidth = width; g.lineCap = 'round';
    g.shadowColor = style; g.shadowBlur = 14;
    g.beginPath(); g.moveTo(pa[0], pa[1]); g.lineTo(pb[0], pb[1]); g.stroke(); g.restore();
    return [pa, pb];
  }
  function arrow(pa, pb, style, alpha) {
    var dx = pb[0] - pa[0], dy = pb[1] - pa[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, s = 26;
    g.save(); g.globalAlpha = alpha; g.fillStyle = style; g.beginPath();
    g.moveTo(pb[0] + ux * s, pb[1] + uy * s);
    g.lineTo(pb[0] - uy * s * 0.6, pb[1] + ux * s * 0.6);
    g.lineTo(pb[0] + uy * s * 0.6, pb[1] - ux * s * 0.6);
    g.closePath(); g.fill(); g.restore();
  }

  function draw(lt) {
    g.clearRect(0, 0, W, H);
    var cam = camera(lt);
    drawDetector(cam, lt);
    var vis = 1 - seg(lt, C.clear[0], C.clear[1]);
    if (vis <= 0 || lt < C.replay[0] - 0.2) return;
    var tev = lerp(C.tevFrom, C.tevTo, seg(lt, C.replay[0], C.replay[1]));
    var head = clamp(C.cMperNs * tev, C.sIn, C.sOut);
    // hits, far first
    var list = [];
    for (var i = 0; i < HITS.length; i++) {
      var h = HITS[i];
      if (h[1] > tev) break;
      var p = project(cam, GEO.sensors[h[0]][0], GEO.sensors[h[0]][1], GEO.sensors[h[0]][2]);
      var since = (tev - h[1]) / (C.tevTo - C.tevFrom) * (C.replay[1] - C.replay[0]);
      list.push([p, i / (HITS.length - 1), h[2], Math.exp(-since / 0.35)]);
    }
    list.sort(function (a, b2) { return a[0][2] - b2[0][2]; });
    g.save(); g.globalCompositeOperation = 'lighter';
    list.forEach(function (it) {
      var p = it[0], lq = Math.log(1 + it[2]) / Math.log(1 + QMAX);
      var r = (14 + 30 * lq + 26 * it[3]) * p[2];
      g.globalAlpha = Math.min(1, 0.7 + 0.3 * lq + 0.3 * it[3]) * vis;
      g.drawImage(SPR[Math.round(it[1] * 32)], p[0] - r, p[1] - r, r * 2, r * 2);
    });
    g.restore();
    // the true track (white) and the particle
    var tr = line3(cam, C.track.point, C.track.dir, C.sIn, head, 'rgba(234,240,250,1)', 4, 0.9 * vis);
    if (tr) {
      if (head >= C.sOut - 1) arrow(tr[0], tr[1], 'rgba(234,240,250,1)', 0.9 * vis);
      else { var hr = 40 * tr[1][2]; g.save(); g.globalAlpha = vis; g.globalCompositeOperation = 'lighter'; g.drawImage(HEAD, tr[1][0] - hr, tr[1][1] - hr, hr * 2, hr * 2); g.restore(); }
    }
    // the fitted direction (amber), drawn over the true one
    var fp = out(seg(lt, C.fit[0], C.fit[1]));
    if (fp > 0) {
      var fl = line3(cam, FIT0, C.pandel.dir, C.sIn, lerp(C.sIn, C.sOut, fp), ACC, 4, vis);
      if (fl && fp >= 1) arrow(fl[0], fl[1], ACC, vis);
      // back along the fit, out of the ice, to where it came from
      var bp = inOut(seg(lt, C.backLine[0], C.backLine[1]));
      if (fl && bp > 0) {
        var dx = fl[0][0] - fl[1][0], dy = fl[0][1] - fl[1][1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
        var len = C.backLen;
        if (uy > 0) len = Math.min(len, (C.backFloor - fl[0][1]) / uy);
        len = Math.max(0, len) * bp;
        var ex = fl[0][0] + ux * len, ey = fl[0][1] + uy * len;
        g.save(); g.globalAlpha = vis; g.strokeStyle = ACC; g.lineWidth = 3; g.setLineDash([14, 12]);
        g.beginPath(); g.moveTo(fl[0][0], fl[0][1]); g.lineTo(ex, ey); g.stroke(); g.setLineDash([]);
        var sp = out(seg(lt, C.source, C.source + 0.4));
        if (sp > 0) {
          g.globalAlpha = vis * sp; g.lineWidth = 3;
          g.beginPath(); g.arc(ex, ey, 10 + 8 * sp, 0, Math.PI * 2); g.stroke();
          g.beginPath(); g.arc(ex, ey, 4, 0, Math.PI * 2); g.fillStyle = ACC; g.fill();
        }
        g.restore();
        SRC = [ex, ey];
      }
    }
  }
  var SRC = null;

  // DOM text: fade/rise in at a, out at b
  function show(node, lt, a, b) {
    var i = out(seg(lt, a, a + 0.25)), o = b == null ? 0 : seg(lt, b, b + 0.3);
    node.style.opacity = (i * (1 - o)).toFixed(3);
    node.style.transform = 'translateY(' + ((1 - i) * 24).toFixed(2) + 'px)';
  }

  var clip = null;
  ST.onSeek(function (t) {
    if (!clip) clip = ST.clips().filter(function (c) { return c.id === C.sid; })[0];
    if (!clip) return;
    var lt = clamp(t - clip.start, 0, clip.end == null ? 1e9 : clip.end - clip.start);
    if (t < clip.start - 1e-6 || (clip.end != null && t >= clip.end)) return;
    SRC = null;
    draw(lt);
    if (SRC) T.src.style.translate = (SRC[0] + 30).toFixed(1) + 'px ' + (SRC[1] - 22).toFixed(1) + 'px';
    show(T.src, lt, C.source, C.clear[0]);
    if (!SRC) T.src.style.opacity = '0';
    show(T.legend, lt, C.legend, C.clear[0]);
    show(T.keyTrue, lt, C.keyTrue, C.clear[0]);
    show(T.keyFit, lt, C.fit[0], C.clear[0]);
    show(T.spread, lt, C.thinChip, null);
  });
})();
