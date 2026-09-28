/* Picture for "Cómo una bomba de calor calienta tu casa" (Spanish version of example 02). drawFilm(T, g, F) draws the whole frame for time T.
 * Pure function of T: no state between frames, no unseeded randomness. Every time comes from CUE
 * (cues.js), which was copied from voice/timeline.json.
 *
 * One stage carries the film: a winter night, an air-source heat pump's outdoor unit in the snow,
 * and a cutaway of the house with the indoor unit. The refrigerant loop is drawn as a real path;
 * dots ride it with colour = temperature and spacing = density (packed liquid, spread-out gas).
 * Heating mode: outdoor coil = evaporator, indoor coil = condenser, compressor and expansion valve
 * in the outdoor unit (the usual split-system layout). */
'use strict';

// ------------------------------------------------------------------ palette
var K = {
  sky0: '#060c18', sky1: '#12233a', snow0: '#e4ebf2', snow1: '#a9b8c8',
  cold: '#4f9dff', cool: '#a9dcff', hot: '#ff5a36', warm: '#f4a85c', heat: '#ffae52',
  pipe: '#1d232e', pipeEdge: 'rgba(214,226,240,0.30)',
  wall: '#3b2f27', wallEdge: '#5f4a3c', room0: '#16120f', room1: '#43291a',
  ink: '#f2e9dc', muted: '#c2b6a4', label: '#f6efe4', dark: '#141a24',
};

// ------------------------------------------------------------------ geometry (1920x1080 design units)
var G = {
  WALL0: 1000, WALL1: 1040, GROUND: 880, CEIL: 200, TOP: 340, BOT: 830,
  outUnit: { x: 90, y: 270, w: 800, h: 598 },
  inUnit: { x: 1180, y: 372, w: 440, h: 440 },
  fanOut: { x: 205, y: 590, r: 112 },
  fanIn: { x: 1290, y: 592, r: 92 },
  comp: { x: 770, y: 370, w: 124, h: 170 },
  valve: { x: 790, y: 830 },
  evapBox: { x: 336, y: 392, w: 238, h: 396 },
  condBox: { x: 1376, y: 392, w: 208, h: 396 },
};

// Loop corners, clockwise from the expansion valve (flow: valve -> evaporator -> compressor ->
// condenser -> valve).
var LOOP_PTS = [
  [790, 830], [560, 830], [560, 770], [350, 770], [350, 698], [510, 698], [510, 626], [350, 626],
  [350, 554], [510, 554], [510, 482], [350, 482], [350, 410], [560, 410], [560, 340],
  [1390, 340], [1390, 410], [1570, 410], [1570, 482], [1410, 482], [1410, 554], [1570, 554],
  [1570, 626], [1410, 626], [1410, 698], [1570, 698], [1570, 770], [1390, 770], [1390, 830], [790, 830],
];

// ------------------------------------------------------------------ path sampling
function buildPath() {
  var F = Film, P = LOOP_PTS, R = 34, out = [];
  out.push(P[0]);
  for (var i = 1; i < P.length - 1; i++) {
    var a = P[i - 1], b = P[i], c = P[i + 1];
    var d1 = Math.hypot(b[0] - a[0], b[1] - a[1]), d2 = Math.hypot(c[0] - b[0], c[1] - b[1]);
    var r = Math.min(R, d1 / 2, d2 / 2);
    var u1 = [(b[0] - a[0]) / d1, (b[1] - a[1]) / d1], u2 = [(c[0] - b[0]) / d2, (c[1] - b[1]) / d2];
    var p0 = [b[0] - u1[0] * r, b[1] - u1[1] * r], p2 = [b[0] + u2[0] * r, b[1] + u2[1] * r];
    out.push(p0);
    for (var k = 1; k < 10; k++) {
      var t = k / 10, m = 1 - t;
      out.push([m * m * p0[0] + 2 * m * t * b[0] + t * t * p2[0], m * m * p0[1] + 2 * m * t * b[1] + t * t * p2[1]]);
    }
    out.push(p2);
  }
  out.push(P[P.length - 1]);
  // resample every ~3 units
  var xs = [], ys = [], ss = [], s = 0;
  for (var j = 0; j < out.length - 1; j++) {
    var q0 = out[j], q1 = out[j + 1], L = Math.hypot(q1[0] - q0[0], q1[1] - q0[1]);
    var n = Math.max(1, Math.ceil(L / 3));
    for (var e = 0; e < n; e++) {
      xs.push(q0[0] + (q1[0] - q0[0]) * e / n); ys.push(q0[1] + (q1[1] - q0[1]) * e / n); ss.push(s + L * e / n);
    }
    s += L;
  }
  xs.push(out[out.length - 1][0]); ys.push(out[out.length - 1][1]); ss.push(s);
  var path = { x: xs, y: ys, s: ss, L: s };
  function near(px, py) {
    var best = 0, bd = 1e18;
    for (var z = 0; z < xs.length; z++) {
      var dd = (xs[z] - px) * (xs[z] - px) + (ys[z] - py) * (ys[z] - py);
      if (dd < bd) { bd = dd; best = z; }
    }
    return ss[best];
  }
  path.k = {
    evapIn: near(545, 770), evapOut: near(545, 410), compIn: near(708, 340), compOut: near(832, 340),
    condIn: near(1410, 410), condOut: near(1400, 770), valveIn: near(822, 830),
  };
  // phase coordinate: dots are evenly spaced in phi, so spacing along the pipe = local spread
  var phi = [0];
  for (var w = 1; w < ss.length; w++) {
    var mid = (ss[w] + ss[w - 1]) / 2;
    phi.push(phi[w - 1] + (ss[w] - ss[w - 1]) / stateAt(path, mid).spread);
  }
  path.phi = phi; path.PHI = phi[phi.length - 1];
  return path;
}

function smooth01(x) { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); }

/** Refrigerant state at arc length s: colour (temperature) and spread (1 = liquid, >2 = low-pressure gas). */
function stateAt(P, s) {
  var F = Film, k = P.k, col, spread, gas;
  if (s < k.evapIn) { col = K.cold; spread = 1.15; gas = 0.1; }
  else if (s < k.evapOut) {
    var u = smooth01((s - k.evapIn) / (k.evapOut - k.evapIn));
    col = F.mixColor(K.cold, K.cool, u); spread = F.lerp(1.15, 2.6, u); gas = F.lerp(0.1, 1, u);
  } else if (s < k.compIn) { col = K.cool; spread = 2.6; gas = 1; }
  else if (s < k.compOut) {
    var v = smooth01((s - k.compIn) / (k.compOut - k.compIn));
    col = F.mixColor(K.cool, K.hot, v); spread = F.lerp(2.6, 1.8, v); gas = 1;
  } else if (s < k.condIn) { col = K.hot; spread = 1.8; gas = 1; }
  else if (s < k.condOut) {
    var c = smooth01((s - k.condIn) / (k.condOut - k.condIn));
    col = F.mixColor(K.hot, K.warm, c); spread = F.lerp(1.8, 1.0, c); gas = 1 - c;
  } else { col = K.warm; spread = 1.0; gas = 0; }
  return { col: col, spread: spread, gas: gas };
}

var PATH = null;
function path() { if (!PATH) PATH = buildPath(); return PATH; }

function idxOf(arr, v) {            // last index with arr[i] <= v
  var lo = 0, hi = arr.length - 1;
  while (lo < hi) { var mid = (lo + hi + 1) >> 1; if (arr[mid] <= v) lo = mid; else hi = mid - 1; }
  return lo;
}
function pointAtS(P, s) {
  var i = Math.min(P.s.length - 2, idxOf(P.s, s)), t = (s - P.s[i]) / Math.max(1e-6, P.s[i + 1] - P.s[i]);
  return [P.x[i] + (P.x[i + 1] - P.x[i]) * t, P.y[i] + (P.y[i + 1] - P.y[i]) * t];
}
function sAtPhi(P, ph) {
  var i = Math.min(P.phi.length - 2, idxOf(P.phi, ph)), t = (ph - P.phi[i]) / Math.max(1e-6, P.phi[i + 1] - P.phi[i]);
  return P.s[i] + (P.s[i + 1] - P.s[i]) * t;
}

// ------------------------------------------------------------------ timing helpers
var FLOW_T0 = CUE.w.circling - 0.26, FLOW_V = 62, FLOW_TAU = 0.7;
function flowDisp(T) {
  var t = T - FLOW_T0;
  if (t <= 0) return 0;
  return FLOW_V * (t - FLOW_TAU * (1 - Math.exp(-t / FLOW_TAU)));
}
function pipeReveal(T) { return Film.seg(T, CUE.w.refrigerant - 0.1, CUE.w.circling + 0.55, 'inOutSine'); }
function roomWarmth(T) { return Film.seg(T, CUE.w.releases, CUE.w.condenses + 0.8, 'inOutSine'); }

// camera over the diagram (world = design space)
function diagramCam(T) {
  var F = Film, w = CUE.w;
  return F.camera(T, [
    [CUE.loop, 960, 540, 1.0],
    [CUE.evap - 0.35, 960, 540, 1.02, 'camera'],
    [CUE.evap + 0.75, 420, 505, 1.48, 'camera'],     // wide enough for the badge, the liquid tag and the valve
    [CUE.comp - 0.35, 405, 510, 1.5, 'linear'],
    [CUE.comp + 0.6, 790, 430, 1.85, 'camera'],
    [CUE.cond - 0.35, 800, 432, 1.88, 'linear'],
    [CUE.cond + 0.8, 1440, 560, 1.58, 'camera'],
    [CUE.valve - 0.35, 1450, 560, 1.62, 'linear'],
    [CUE.valve + 0.7, 810, 770, 1.9, 'camera'],
    [w.loopRepeats - 0.15, 818, 770, 1.93, 'linear'],   // round 2: the pull-out starts on "ciclo", not ~0.35 s after it
    [w.loopRepeats + 0.85, 960, 540, 1.0, 'camera'],
    [CUE.duration + 1, 960, 540, 1.0],
  ]);
}

// ------------------------------------------------------------------ top level
function drawFilm(T, g, F) {
  F.sequence(T, [
    { t0: CUE.hook, t1: CUE.absolute, draw: hookScene },
    { t0: CUE.absolute, t1: CUE.loop, draw: moleculeScene, in: { type: 'zoom', dur: 0.5 } },
    { t0: CUE.loop, t1: CUE.duration + 1, draw: diagramScene, in: { type: 'zoom', dur: 0.36 } },
  ]);
}

// ------------------------------------------------------------------ 1. hook
function hookScene(local, p, T) {
  var F = Film, w = CUE.w;
  // slow push, then a fast push into the outdoor air that hands over to the molecules
  var push = F.seg(T, CUE.absolute - 0.55, CUE.absolute + 0.25, 'inExpo');
  var cam = {
    x: F.lerp(F.lerp(960, 900, F.seg(T, 0, 3.6, 'inOutSine')), 180, push),
    y: F.lerp(540, 330, push),
    zoom: F.lerp(1.0, 1.03, F.seg(T, 0, 3.6, 'inOutSine')) * Math.pow(4, push),   // round 2: 1.05 -> 1.03, 0 °C stays inside the 5 % top margin
  };
  F.withCamera(cam, function () {
    drawWorld(T, { hook: true });
    // the text layer (readings, arc, "?") clears by 4.0 s, before the zoom dissolve into the molecules,
    // so it never double-exposes over the molecule field
    F.g.save(); F.g.globalAlpha *= 1 - F.seg(T, CUE.absolute - 0.5, CUE.absolute - 0.25);
    // outdoor reading
    // round 2: both readings are on screen from frame 0 (feed thumbnail), then come up to full;
    // round 3: 21 °C starts at 80 % (0 °C stays at 60 %), it was the weaker of the two on the dark wall
    F.text('0 °C', 108, 184, { size: 150, weight: 800, color: K.ink, tracking: -0.02, alpha: F.lerp(0.6, 1, F.seg(T, 0.0, 0.35, 'outCubic')) });
    F.text('32 °F  ·  afuera', 112, 238, { size: 38, weight: 600, color: K.cool, alpha: F.seg(T, 0.2, 0.6) });
    // indoor reading
    F.text('21 °C', 1300, 560, { size: 150, weight: 800, color: K.heat, tracking: -0.02, alpha: F.lerp(0.8, 1, F.seg(T, 0.25, 0.65, 'outCubic')) });
    F.text('70 °F  ·  adentro', 1306, 618, { size: 38, weight: 600, color: K.muted, alpha: F.seg(T, 0.45, 0.85) });
    // the question: heat going the "wrong" way, from cold to warm
    var a = F.seg(T, w.heatHome - 0.25, w.home + 0.45, 'inOutCubic');
    F.arrow(560, 250, 1330, 420, { p: a, curve: -0.32, color: K.heat, width: 7, head: 26, dash: [2, 16], alpha: 0.95 });
    // the "?" sits on the midpoint of the dotted arc (quadratic midpoint of the arrow: x 959, y 273)
    var qA = F.seg(T, w.home, w.home + 0.3);
    // round 2: 30 px left and 15 px up, clear of the wall post (x 1068) and off the arc's dots
    F.glow(929, 175, 110, K.heat, 0.18 * qA);
    F.text('?', 929, 235, { size: 180, weight: 800, align: 'center', color: K.heat, alpha: qA });
    F.g.restore();
  });
  // kicker (screen space): says what this is for a muted viewer without captions
  var kA = F.seg(T, 0.3, 0.8) * (1 - F.seg(T, CUE.absolute - 0.6, CUE.absolute - 0.25));
  // Spanish: the kicker is ~40 % longer than the English one, so it sets in two right-aligned lines at
  // 34 px (round 2: one 27 px line was ~5 px tall on a phone) and still clears the "?"
  F.text('CÓMO FUNCIONA', 1824, 100, { size: 34, weight: 700, tracking: 0.10, align: 'right', color: K.muted, alpha: kA });
  F.text('UNA BOMBA DE CALOR', 1824, 144, { size: 34, weight: 700, tracking: 0.10, align: 'right', color: K.muted, alpha: kA });
}

// ------------------------------------------------------------------ 2. heat in freezing air
function moleculeScene(local, p, T) {
  var F = Film, g = F.g, w = CUE.w;
  var gr = g.createLinearGradient(0, 0, 0, F.H);
  gr.addColorStop(0, '#08111f'); gr.addColorStop(1, '#122a44');
  g.fillStyle = gr; g.fillRect(0, 0, F.W, F.H);
  F.glow(1500, 520, 700, K.cold, 0.10);

  // molecules: N2 / O2 pairs drifting and tumbling (thermal motion), with short motion trails
  var rng = F.rng(11), region = { x: -60, y: 250, w: 2040, h: 520 };
  // round 2: molecules dim as they pass behind the "273 grados" counter (a soft 700x120 box that
  // follows it), so the number never has a molecule drawn across it
  var hushA = F.seg(T, w.far - 0.1, w.far + 0.3), hushX = F.lerp(1560, 865, F.seg(T, w.far - 0.1, w.absZero + 0.35, 'inOutCubic'));
  function hush(x, y) {
    if (hushA <= 0) return 1;
    var dx = Math.max(0, Math.abs(x - hushX) - 350), dy = Math.max(0, Math.abs(y - 800) - 60);
    return 1 - 0.9 * hushA * (1 - F.clamp(Math.hypot(dx, dy) / 40));
  }
  for (var i = 0; i < 46; i++) {
    var x0 = rng() * region.w, y0 = rng() * region.h, sp = F.lerp(70, 150, rng()), ang = rng() * Math.PI * 2;
    var spin = F.lerp(-2.6, 2.6, rng()), a0 = rng() * 6.3, o2 = rng() < 0.22;
    var vx = Math.cos(ang) * sp, vy = Math.sin(ang) * sp * 0.6;
    var mx = region.x + F.mod(x0 + vx * T, region.w), my = region.y + F.mod(y0 + vy * T, region.h);
    var rot = a0 + spin * T, r = o2 ? 15 : 13, d = o2 ? 15 : 13;
    var col = o2 ? '#8fc0ff' : '#d4e6ff';
    var tl = 0.28, hu = hush(mx, my);
    g.save(); g.globalAlpha *= hu;
    var grd = g.createLinearGradient(mx - vx * tl, my - vy * tl, mx, my);
    grd.addColorStop(0, F.rgba(col, 0)); grd.addColorStop(1, F.rgba(col, 0.28));
    g.strokeStyle = grd; g.lineWidth = r * 1.6; g.lineCap = 'round';
    g.beginPath(); g.moveTo(mx - vx * tl, my - vy * tl); g.lineTo(mx, my); g.stroke();
    g.restore();
    F.circle(mx + Math.cos(rot) * d / 2, my + Math.sin(rot) * d / 2, r, { fill: col, alpha: 0.92 * hu });
    F.circle(mx - Math.cos(rot) * d / 2, my - Math.sin(rot) * d / 2, r, { fill: col, alpha: 0.92 * hu });
  }

  // overlay (label, headline, axis) clears before the pull-back to the diagram, so it never
  // double-exposes over the translucent unit during the zoom transition
  g.save(); g.globalAlpha *= 1 - F.seg(T, CUE.loop - 0.3, CUE.loop - 0.05);   // Spanish: the pull-back dissolve starts at CUE.loop
  // text: label, then the payload
  F.text('AIRE A 0 °C, DE CERCA', 96, 120, { size: 32, weight: 700, tracking: 0.16, color: K.cool, alpha: F.seg(T, CUE.absolute + 0.05, CUE.absolute + 0.45) });
  F.reveal('Las moléculas en movimiento llevan calor.', 96, 200, F.seg(T, w.holdsHeat - 0.3, w.holdsHeat + 0.5),
    { by: 'word', family: 'serif', size: 76, color: K.ink });

  // temperature scale: absolute zero .. 0 °C
  var X0 = 170, X1 = 1560, Y = 900, xAt = function (c) { return F.lerp(X0, X1, (c + 273) / 273); };
  var axis = F.seg(T, w.zero - 0.15, w.zero + 0.6, 'outCubic');
  F.line(X0, Y, F.lerp(X0, 1760, axis), Y, { color: F.rgba(K.ink, 0.55), width: 3 });
  [-273, -200, -150, -100, -50, 0].forEach(function (c, i) {
    var a = F.seg(T, w.zero + 0.05 * i, w.zero + 0.05 * i + 0.4);
    F.line(xAt(c), Y - 12, xAt(c), Y + 12, { color: F.rgba(K.ink, 0.55), width: 3, alpha: a });
    if (c !== -273 && c !== 0) F.text(String(c).replace('-', '−') + ' °C', xAt(c), Y + 58, { size: 36, weight: 500, align: 'center', color: K.muted, alpha: a * 0.9 });
  });
  // 0 °C marker (where freezing air is)
  var m0 = F.seg(T, w.zero, w.zero + 0.45, 'outBack');
  F.glow(xAt(0), Y, 70, K.cool, 0.35 * m0);
  F.circle(xAt(0), Y, 14 * m0, { fill: K.cool });
  F.text('0 °C', xAt(0), Y + 58, { size: 40, weight: 800, align: 'center', color: K.cool, alpha: m0 });
  // bracket: how far above absolute zero
  var br = F.seg(T, w.far - 0.1, w.absZero + 0.35, 'inOutCubic');
  if (br > 0) {
    var xa = xAt(0), xb = F.lerp(xAt(0), xAt(-273), br);
    F.line(xb, Y - 60, xa, Y - 60, { color: K.heat, width: 5 });
    F.line(xa, Y - 60, xa, Y - 36, { color: K.heat, width: 5 });
    F.line(xb, Y - 60, xb, Y - 36, { color: K.heat, width: 5, alpha: br });
    F.counter(273, (xa + xb) / 2, Y - 90, F.seg(T, w.far - 0.1, w.absZero + 0.35, 'outCubic'),
      { size: 92, weight: 800, align: 'center', color: K.heat, suffix: ' grados', suffixSize: 44, suffixColor: K.heat });
  }
  var az = F.seg(T, w.absZero - 0.35, w.absZero + 0.1, 'outBack');   // Spanish: in a little earlier so the longer subline has time to be read
  F.circle(xAt(-273), Y, 12 * az, { fill: K.ink });
  F.text('cero absoluto', xAt(-273) - 8, Y + 58, { size: 38, weight: 700, color: K.ink, alpha: az });
  F.text('−273 °C · movimiento mínimo', xAt(-273) - 8, Y + 104, { size: 34, weight: 500, color: K.muted, alpha: az });
  g.restore();
}

// ------------------------------------------------------------------ 3-8. the loop
function diagramScene(local, p, T) {
  var F = Film, w = CUE.w;
  var cam = diagramCam(T);
  // focus pull while the diagram dissolves in over the molecules: soft edges, no hard-edged box
  var soft = 1 - F.seg(T, CUE.loop - 0.18, CUE.loop + 0.14, 'outCubic');
  if (soft > 0) F.g.filter = 'blur(' + (soft * 14 * F.s).toFixed(2) + 'px)';
  F.withCamera(cam, function () {
    drawWorld(T, { cam: cam });
    drawLabels(T, cam);
  });
  if (soft > 0) F.g.filter = 'none';
  drawPayoff(T);
}

// ------------------------------------------------------------------ world
function drawWorld(T, o) {
  var F = Film, g = F.g, hook = !!o.hook, P = path(), w = CUE.w;
  var cut = hook ? 0 : F.seg(T, CUE.loop, CUE.loop + 0.7, 'inOutSine');   // outdoor unit opens up
  var inUnitA = hook ? 0 : F.seg(T, CUE.loop + 0.1, CUE.loop + 0.8);
  var warmth = hook ? 0 : roomWarmth(T);

  // --- sky, stars, trees, snow ground (outdoors: x < wall)
  var sky = g.createLinearGradient(0, 0, 0, G.GROUND);
  sky.addColorStop(0, K.sky0); sky.addColorStop(1, K.sky1);
  g.fillStyle = sky; g.fillRect(-400, -400, G.WALL0 + 400, G.GROUND + 400);
  var sr = F.rng(5);
  for (var i = 0; i < 70; i++) {
    var sx = sr() * 1000, sy = sr() * 520, tw = 0.5 + 0.5 * Math.sin(T * (1 + sr() * 2) + sr() * 6);
    F.circle(sx, sy, 1.1 + sr() * 1.3, { fill: '#dfe9ff', alpha: 0.25 + 0.35 * tw });
  }
  F.glow(820, 120, 260, '#9fc3ff', 0.08);
  // distant pines
  var tr = F.rng(9);
  for (var t = 0; t < 14; t++) {
    var tx = -30 + t * 78 + tr() * 30, th = 110 + tr() * 120;
    g.save(); g.fillStyle = '#0c1a2b'; g.beginPath();
    g.moveTo(tx, G.GROUND - th); g.lineTo(tx - th * 0.28, G.GROUND); g.lineTo(tx + th * 0.28, G.GROUND); g.closePath(); g.fill();
    g.fillStyle = 'rgba(228,236,244,0.35)'; g.beginPath();
    g.moveTo(tx, G.GROUND - th); g.lineTo(tx - th * 0.1, G.GROUND - th * 0.66); g.lineTo(tx + th * 0.1, G.GROUND - th * 0.66); g.closePath(); g.fill();
    g.restore();
  }
  var snow = g.createLinearGradient(0, G.GROUND, 0, 1080 + 400);
  snow.addColorStop(0, K.snow0); snow.addColorStop(1, K.snow1);
  g.fillStyle = snow;
  g.beginPath(); g.moveTo(-400, G.GROUND + 6);
  for (var sxg = -400; sxg <= G.WALL0; sxg += 20) g.lineTo(sxg, G.GROUND - 4 + F.noise(sxg * 0.01, 3) * 10);
  g.lineTo(G.WALL0, 1480); g.lineTo(-400, 1480); g.closePath(); g.fill();

  // --- house cutaway
  g.fillStyle = '#0f0c0a'; g.fillRect(G.WALL1, -400, 1400, G.CEIL - 30 + 400);          // upstairs (dark)
  var room = F.mixColor(K.room0, K.room1, warmth * 0.85);
  g.fillStyle = room; g.fillRect(G.WALL1, G.CEIL, 1400, G.GROUND - G.CEIL);
  if (warmth > 0) {
    F.glow(1700, 620, 520, K.heat, 0.22 * warmth);
    F.glow(1450, 420, 380, K.heat, 0.10 * warmth);
  }
  g.fillStyle = '#2b211b'; g.fillRect(G.WALL1, G.CEIL - 30, 1400, 30);                  // ceiling slab
  g.fillStyle = '#3a2a1e'; g.fillRect(G.WALL1, G.GROUND, 1400, 26);                     // floor
  g.fillStyle = '#120f0d'; g.fillRect(G.WALL1 - 40, G.GROUND + 26, 1400, 700);            // foundation
  // picture frame + sofa silhouettes (warm up with the room)
  var furn = F.mixColor('#2a221d', '#6a4029', warmth);
  F.box(1690, 330, 150, 104, 6, { stroke: F.mixColor('#3a2f28', '#8a5a3a', warmth), lineWidth: 6 });
  F.box(1705, 345, 120, 74, 3, { fill: F.mixColor('#1d1916', '#4a3222', warmth) });
  F.box(1660, 770, 230, 70, 14, { fill: furn });
  F.box(1640, 730, 40, 120, 12, { fill: furn });
  F.box(1870, 730, 40, 120, 12, { fill: furn });
  F.box(1672, 840, 12, 40, 3, { fill: furn }); F.box(1866, 840, 12, 40, 3, { fill: furn });
  // exterior wall section
  g.fillStyle = K.wall; g.fillRect(G.WALL0, -400, G.WALL1 - G.WALL0, G.GROUND + 26 + 400);
  g.fillStyle = K.wallEdge; g.fillRect(G.WALL0, -400, 3, G.GROUND + 426); g.fillRect(G.WALL1 - 3, -400, 3, G.GROUND + 426);
  // snow against the wall
  F.box(930, G.GROUND - 10, 80, 30, 14, { fill: K.snow0 });

  // --- casings (back)
  var U = G.outUnit, IU = G.inUnit;
  F.box(U.x, U.y, U.w, U.h, 18, { fill: F.rgba('#8e9aa8', F.lerp(1, 0.07, cut)) });
  if (inUnitA > 0) F.box(IU.x, IU.y, IU.w, IU.h, 22, { fill: F.rgba('#e8dccb', 0.06 * inUnitA), stroke: F.rgba('#e8dccb', 0.35 * inUnitA), lineWidth: 2 });

  // --- airflow streaks (outdoor air in through the coil, cooled air out)
  var flowA = hook ? 0.5 : 1;
  airStreaks(T, 20, 880, 430, 770, 150, flowA, true);
  if (inUnitA > 0) airStreaks(T, 1200, 1900, 430, 770, 120, inUnitA * (0.35 + 0.65 * warmth), false);

  // --- fans
  fan(G.fanOut.x, G.fanOut.y, G.fanOut.r, T * 7.5, 1);
  if (inUnitA > 0) fan(G.fanIn.x, G.fanIn.y, G.fanIn.r, T * 9, inUnitA);

  // --- coil fin blocks (appear as the pipe reaches them)
  var rev = hook ? 0 : pipeReveal(T), revS = rev * P.L;
  var evapA = F.clamp((revS - P.k.evapIn) / 120) , condA = F.clamp((revS - P.k.condIn) / 120);
  fins(G.evapBox, K.cool, evapA);
  fins(G.condBox, K.heat, condA);

  // --- pipe, tinted by temperature
  if (rev > 0) {
    drawPipe(P, 0, revS, 30, K.pipeEdge, 1);
    drawPipe(P, 0, revS, 24, K.pipe, 1);
    var tint = F.seg(T, w.circling - 0.2, w.circling + 0.8);
    if (tint > 0) drawPipeTint(P, revS, 14, 0.32 * tint);
    if (rev < 1) {                                   // pen head
      var hp = pointAtS(P, revS);
      F.glow(hp[0], hp[1], 60, K.heat, 0.6); F.circle(hp[0], hp[1], 9, { fill: '#fff4e6' });
    }
  }

  // --- refrigerant dots
  var dotsA = hook ? 0 : F.seg(T, FLOW_T0 - 0.1, FLOW_T0 + 0.5);
  if (dotsA > 0) drawDots(T, P, dotsA);

  // --- compressor, valve, power cable
  var compA = F.clamp((revS - P.k.compIn + 40) / 80), valveA = rev >= 1 ? 1 : 0;
  var cableA = hook ? 0 : F.seg(T, CUE.comp + 0.1, CUE.comp + 0.6);
  if (cableA > 0) powerCable(T, cableA);
  if (compA > 0) compressor(T, compA);
  valveSymbol(T, hook ? 0 : F.clamp((revS - P.L + 60) / 60) + valveA);

  // --- heat motes: from the outdoor air into the evaporator; out of the condenser into the room
  var inA = hook ? 0 : F.seg(T, w.soaks - 0.5, w.soaks + 0.4);
  if (inA > 0) motesIn(T, inA);
  var outA = hook ? 0 : F.seg(T, w.releases - 0.3, w.releases + 0.5);
  if (outA > 0) motesOut(T, outA);

  // --- casing fronts: louvres + snow cap
  var front = F.lerp(1, 0.18, cut);
  F.box(U.x, U.y, U.w, U.h, 18, { stroke: F.rgba('#dfe7ef', 0.55), lineWidth: 3 });
  g.save(); g.globalAlpha *= front;
  for (var lv = 0; lv < 22; lv++) F.line(470 + lv * 18, 320, 470 + lv * 18, 830, { color: 'rgba(40,48,60,0.55)', width: 5 });
  g.restore();
  if (hook || cut < 1) {
    g.save(); g.globalAlpha *= 1 - cut;
    F.circle(G.fanOut.x, G.fanOut.y, G.fanOut.r + 14, { stroke: 'rgba(30,36,46,0.8)', lineWidth: 8 });
    g.restore();
  }
  F.box(U.x - 8, U.y - 20, U.w + 16, 30, 15, { fill: K.snow0 });
  F.box(U.x + 30, U.h + U.y, 30, 12, 3, { fill: '#5d6773' }); F.box(U.x + U.w - 60, U.h + U.y, 30, 12, 3, { fill: '#5d6773' });

  // --- snowfall (outdoors only)
  g.save(); g.beginPath(); g.rect(-400, -400, G.WALL0 + 400, 1880); g.clip();
  F.field(T, { rect: { x: -200, y: -200, w: 1200, h: 1300 }, count: 150, speed: [14, 62], size: 2.3, color: '#ffffff', alpha: 0.55, seed: 7 });
  F.field(T, { rect: { x: -200, y: -200, w: 1200, h: 1300 }, count: 28, speed: [22, 95], size: 4.2, color: '#ffffff', alpha: 0.35, seed: 19 });
  g.restore();
}

function drawPipe(P, s0, s1, width, color, alpha) {
  var g = Film.g, i0 = idxOf(P.s, s0), i1 = idxOf(P.s, s1);
  g.save(); g.globalAlpha *= alpha;
  g.strokeStyle = color; g.lineWidth = width; g.lineCap = 'round'; g.lineJoin = 'round';
  g.beginPath(); g.moveTo(P.x[i0], P.y[i0]);
  for (var i = i0 + 1; i <= i1; i++) g.lineTo(P.x[i], P.y[i]);
  var e = pointAtS(P, s1); g.lineTo(e[0], e[1]);
  g.stroke(); g.restore();
}
function drawPipeTint(P, sMax, width, alpha) {
  var g = Film.g, step = 36;
  g.save(); g.globalAlpha *= alpha; g.lineWidth = width; g.lineCap = 'butt'; g.lineJoin = 'round';
  for (var s = 0; s < sMax; s += step) {
    var st = stateAt(P, Math.min(sMax, s + step / 2));
    var i0 = idxOf(P.s, s), i1 = idxOf(P.s, Math.min(sMax, s + step + 2));
    g.strokeStyle = st.col; g.beginPath(); g.moveTo(P.x[i0], P.y[i0]);
    for (var i = i0 + 1; i <= i1; i++) g.lineTo(P.x[i], P.y[i]);
    g.stroke();
  }
  g.restore();
}
function drawDots(T, P, alpha) {
  var F = Film, DPHI = 21, n = Math.floor(P.PHI / DPHI), dphi = P.PHI / n, off = flowDisp(T);
  for (var k = 0; k < n; k++) {
    var ph = F.mod(k * dphi + off, P.PHI), s = sAtPhi(P, ph), st = stateAt(P, s), q = pointAtS(P, s);
    var r = F.lerp(6, 9.5, st.gas);
    if (st.col === K.hot || (s > P.k.compOut && s < P.k.condOut)) F.glow(q[0], q[1], 26, K.hot, 0.25 * alpha);
    F.circle(q[0], q[1], r, { fill: F.rgba(st.col, F.lerp(1, 0.5, st.gas)), alpha: alpha });
    if (st.gas > 0.3) F.circle(q[0], q[1], r, { stroke: st.col, lineWidth: 2.2, alpha: alpha * st.gas });
  }
}
function fins(b, col, a) {
  if (a <= 0) return;
  var F = Film;
  F.box(b.x, b.y, b.w, b.h, 10, { fill: F.rgba(col, 0.05 * a), stroke: F.rgba(col, 0.35 * a), lineWidth: 2 });
  for (var x = b.x + 12; x < b.x + b.w - 6; x += 11) F.line(x, b.y + 6, x, b.y + b.h - 6, { color: F.rgba(col, 0.16 * a), width: 2 });
}
function fan(x, y, r, ang, a) {
  var F = Film, g = F.g;
  g.save(); g.globalAlpha *= a;
  F.circle(x, y, r, { fill: 'rgba(12,16,24,0.55)', stroke: 'rgba(220,230,240,0.45)', lineWidth: 3 });
  g.translate(x, y); g.rotate(ang);
  g.fillStyle = 'rgba(205,216,228,0.75)';
  for (var b = 0; b < 3; b++) {
    g.save(); g.rotate(b * Math.PI * 2 / 3);
    g.beginPath(); g.moveTo(0, 0);
    g.bezierCurveTo(r * 0.3, -r * 0.35, r * 0.85, -r * 0.25, r * 0.86, 0.1 * r);
    g.bezierCurveTo(r * 0.6, r * 0.2, r * 0.25, r * 0.12, 0, 0);
    g.fill(); g.restore();
  }
  g.restore();
  F.circle(x, y, r * 0.14, { fill: '#cfd8e2', alpha: a });
  g.save(); g.globalAlpha *= a * 0.5;
  for (var ring = 1; ring <= 3; ring++) F.circle(x, y, r * ring / 3.2, { stroke: 'rgba(220,230,240,0.35)', lineWidth: 1.5 });
  g.restore();
}
function airStreaks(T, x0, x1, y0, y1, speed, a, outdoor) {
  var F = Film, rng = F.rng(outdoor ? 31 : 37), n = 16;
  for (var i = 0; i < n; i++) {
    var y = F.lerp(y0, y1, (i + rng() * 0.8) / n), len = 60 + rng() * 80, ph = rng() * 50, sp = speed * (0.7 + rng() * 0.6);
    var x = x0 + F.mod(ph * 37 + sp * T, (x1 - x0) + len) - len;
    var col = outdoor ? (x > 560 ? '#7fb8ff' : '#dfe9f5') : K.heat;
    var fade = Math.sin(F.clamp((x - x0) / (x1 - x0)) * Math.PI);
    F.line(x, y, x + len, y + F.noise(T + i, 3) * 4, { color: col, width: 2.2, alpha: a * 0.22 * fade });
  }
}
function motesIn(T, a) {
  var F = Film, rng = F.rng(41), n = 16, per = 2.6;
  for (var i = 0; i < n; i++) {
    var y0 = F.lerp(430, 760, rng()), x0 = F.lerp(-10, 110, rng()), ph = rng();
    var yT = F.lerp(420, 770, rng()), xT = F.lerp(380, 500, rng());
    var u = F.mod(T / per + ph, 1), e = F.E.inOutSine(u);
    var x = F.lerp(x0, xT, e), y = F.lerp(y0, yT, e) + Math.sin(u * 6 + i) * 10;
    var al = a * F.clamp(u / 0.15) * (1 - F.clamp((u - 0.78) / 0.22));
    var r = F.lerp(7, 3, F.clamp((u - 0.7) / 0.3));
    F.glow(x, y, 30, K.heat, 0.55 * al);
    F.circle(x, y, r, { fill: '#ffd9a8', alpha: al });
  }
}
function motesOut(T, a) {
  var F = Film, rng = F.rng(43), n = 16, per = 3.0;
  for (var i = 0; i < n; i++) {
    var y0 = F.lerp(420, 770, rng()), ph = rng(), rise = F.lerp(40, 160, rng()), xE = F.lerp(1760, 1900, rng());
    var u = F.mod(T / per + ph, 1), e = F.E.outSine(u);
    var x = F.lerp(1560, xE, e), y = y0 - rise * e + Math.sin(u * 5 + i) * 8;
    var al = a * F.clamp(u / 0.12) * (1 - F.clamp((u - 0.6) / 0.4));
    F.glow(x, y, 34, K.heat, 0.55 * al);
    F.circle(x, y, F.lerp(6, 9, e), { fill: '#ffd9a8', alpha: al });
  }
}
function compressor(T, a) {
  var F = Film, g = F.g, c = G.comp, w = CUE.w;
  var run = F.seg(T, w.squeezes - 0.1, w.squeezes + 0.2);
  var pump = run * (0.5 + 0.5 * Math.sin(T * Math.PI * 2 * 2.2));
  g.save(); g.globalAlpha *= a;
  var x = c.x - c.w / 2, y = c.y - c.h / 2;
  var body = g.createLinearGradient(x, 0, x + c.w, 0);
  body.addColorStop(0, '#3b434f'); body.addColorStop(0.35, '#7c8795'); body.addColorStop(1, '#2b313b');
  F.box(x, y, c.w, c.h, 40, { fill: body, stroke: 'rgba(230,236,244,0.55)', lineWidth: 2.5, shadow: { blur: 30, y: 10, color: 'rgba(0,0,0,0.5)' } });
  // piston window: a chamber whose gas gets squeezed
  var wx = x + 22, wy = y + 40, ww = c.w - 44, wh = 92;
  F.box(wx, wy, ww, wh, 10, { fill: '#10141b', stroke: 'rgba(230,236,244,0.35)', lineWidth: 2 });
  var py = wy + 8 + pump * 44;
  var hotness = F.seg(T, w.temperature - 0.2, w.shootsUp + 0.4);
  var gasCol = F.mixColor(K.cool, K.hot, F.clamp(pump * 0.6 + hotness * 0.6));
  F.box(wx + 5, py + 12, ww - 10, wy + wh - 5 - (py + 12), 6, { fill: F.rgba(gasCol, 0.55 + 0.3 * pump) });
  F.box(wx + 3, py, ww - 6, 12, 4, { fill: '#c9d2dc' });
  F.line(c.x, y + 6, c.x, py, { color: '#9aa5b2', width: 6 });
  if (hotness > 0) F.glow(c.x, c.y + 20, 120, K.hot, 0.25 * hotness);
  g.restore();
}
function powerCable(T, a) {
  var F = Film, w = CUE.w, pulse = F.seg(T, w.electricity - 0.1, w.electricity + 0.25) * (1 - F.seg(T, w.electricity + 0.6, w.electricity + 1.4));
  var y = 430;
  F.line(G.comp.x + G.comp.w / 2, y, G.WALL0 + 4, y, { color: '#1b1f27', width: 9, alpha: a });
  F.line(G.comp.x + G.comp.w / 2, y, G.WALL0 + 4, y, { color: '#ffd84a', width: 3, alpha: a * (0.35 + 0.65 * pulse) });
  bolt(916, y, 26, a, pulse);
}
function bolt(x, y, s, a, glow) {
  var F = Film, g = F.g;
  if (glow > 0) F.glow(x, y, s * 3, '#ffd84a', 0.5 * glow * a);
  g.save(); g.globalAlpha *= a; g.translate(x, y);
  F.circle(0, 0, s * 1.05, { fill: '#1b1f27', stroke: '#ffd84a', lineWidth: 3 });
  g.fillStyle = '#ffd84a'; g.beginPath();
  g.moveTo(s * 0.12, -s * 0.72); g.lineTo(-s * 0.38, s * 0.1); g.lineTo(-s * 0.02, s * 0.1);
  g.lineTo(-s * 0.14, s * 0.72); g.lineTo(s * 0.38, -s * 0.12); g.lineTo(s * 0.02, -s * 0.12); g.closePath(); g.fill();
  g.restore();
}
function valveSymbol(T, a) {
  if (a <= 0) return;
  var F = Film, g = F.g, v = G.valve, s = 30;
  a = F.clamp(a);
  g.save(); g.globalAlpha *= a;
  F.line(v.x, v.y, v.x, v.y - 62, { color: '#9aa5b2', width: 6 });
  F.box(v.x - 26, v.y - 84, 52, 26, 6, { fill: '#6b7684', stroke: 'rgba(230,236,244,0.6)', lineWidth: 2 });
  g.fillStyle = '#c9d2dc'; g.strokeStyle = 'rgba(20,26,36,0.9)'; g.lineWidth = 3;
  g.beginPath(); g.moveTo(v.x - s, v.y - s * 0.75); g.lineTo(v.x, v.y); g.lineTo(v.x - s, v.y + s * 0.75); g.closePath(); g.fill(); g.stroke();
  g.beginPath(); g.moveTo(v.x + s, v.y - s * 0.75); g.lineTo(v.x, v.y); g.lineTo(v.x + s, v.y + s * 0.75); g.closePath(); g.fill(); g.stroke();
  g.restore();
}

// ------------------------------------------------------------------ labels (world space)
function numLabel(n, text, x, y, a, col) {
  if (a <= 0) return;
  var F = Film, g = F.g, size = 34, q = F.E.reveal(F.clamp(a));
  var tO = { size: size, weight: 800, tracking: 0.1 };
  var tw = F.measure(text, tO), badge = 50, gap = 14, W = badge + gap + tw + 26, H = 64;
  var x0 = x - W / 2, y0 = y - H / 2;
  g.save(); g.globalAlpha *= F.clamp(a * 1.5); g.translate(0, (1 - q) * 14);
  F.box(x0, y0, W, H, H / 2, { fill: 'rgba(10,13,19,0.82)', stroke: F.rgba(col, 0.7), lineWidth: 2.5 });
  F.circle(x0 + 7 + badge / 2, y, badge / 2, { fill: col });
  F.text(String(n), x0 + 7 + badge / 2, y + 1, { size: 30, weight: 800, align: 'center', baseline: 'middle', color: K.dark });
  F.text(text, x0 + 7 + badge + gap, y + 1, Object.assign({ baseline: 'middle', color: K.label }, tO));
  g.restore();
}
function tag(text, x, y, a, col, o) {
  if (a <= 0) return;
  o = o || {};
  var F = Film, g = F.g, size = o.size || 32, q = F.E.reveal(F.clamp(a));
  var tO = { size: size, weight: 700 };
  var subO = { size: size * 0.8, weight: 500 };
  var tw = Math.max(F.measure(text, tO), o.sub ? F.measure(o.sub, subO) : 0);
  var pad = 18, W = tw + pad * 2, H = o.sub ? size * 2.3 + 12 : size + 26;
  var al = o.align || 'center', x0 = al === 'left' ? x : al === 'right' ? x - W : x - W / 2, y0 = y - H / 2;
  // a sub line that arrives later (subA) grows the box from one line, top edge fixed
  if (o.sub && o.subA !== undefined) H = F.lerp(size + 26, H, F.E.inOutCubic(F.clamp(o.subA)));
  g.save(); g.globalAlpha *= F.clamp(a * 1.5); g.translate(0, (1 - q) * 10);
  F.box(x0, y0, W, H, 14, { fill: 'rgba(10,13,19,0.8)', stroke: F.rgba(col, 0.55), lineWidth: 2 });
  F.text(text, x0 + pad, y0 + size * 0.95 + 6, Object.assign({ color: col }, tO));
  if (o.sub) F.text(o.sub, x0 + pad, y0 + size * 2.0 + 8, Object.assign({ color: K.muted, alpha: o.subA === undefined ? 1 : o.subA }, subO));
  g.restore();
}

function drawLabels(T, cam) {
  var F = Film, w = CUE.w;
  // Spanish: gone before "rinde más que producirlo" writes over the top-left badge (round 2: the fade now
  // runs under "Mover", which sits above the badges, so the recap holds ~1.7 s)
  var fadeAll = 1 - F.seg(T, CUE.payoff - 0.1, CUE.payoff + 0.35);
  // a component label shows in its own scene, hides while the camera visits the others, and
  // comes back for the recap when the camera pulls out ("...and the loop repeats")
  var recap = F.seg(T, w.loopRepeats - 0.15, w.loopRepeats + 0.35);   // round 2: was +0.2 .. +0.9
  function own(t0, t1) { return Math.max(F.seg(T, t0 - 0.05, t0 + 0.5) * (1 - F.seg(T, t1 - 0.3, t1 + 0.1)), recap) * fadeAll; }
  // 3. the loop: heat goes indoors
  var arr = F.seg(T, w.moves - 0.1, w.indoors + 0.5, 'inOutCubic') * (1 - F.seg(T, w.refrigerant + 0.3, w.circling + 0.3));
  if (arr > 0) {
    F.arrow(250, 300, 1560, 300, { p: F.seg(T, w.moves - 0.1, w.indoors + 0.5, 'inOutCubic'), curve: -0.2, color: K.heat, width: 10, head: 34, alpha: arr });
    F.text('calor', 905, 150, { size: 56, weight: 800, align: 'center', color: K.heat, alpha: arr * F.seg(T, w.moves + 0.2, w.moves + 0.6) });
  }
  tag('circuito sellado de refrigerante', 760, 630, F.win(T, w.sealed - 0.35, CUE.evap + 0.6, 0.3, 0.3), K.ink, { size: 34 });

  // 1. evaporator
  numLabel(1, 'EVAPORADOR', 372, 222, own(w.outside, CUE.comp), K.cool);
  tag('aire exterior', 95, 416, F.win(T, w.outside + 0.35, CUE.comp, 0.3, 0.3), K.ink, { align: 'left', sub: '0 °C', size: 30 });
  tag('refrigerante', 590, 640, F.win(T, w.colder - 0.1, CUE.comp, 0.3, 0.3), K.cold, { align: 'left', sub: 'más frío que el aire', size: 30 });
  var boil = F.win(T, w.boils - 0.1, CUE.comp + 0.2, 0.3, 0.3);
  tag('gas', 596, 396, boil, K.cool, { align: 'left', size: 30 });
  tag('líquido', 596, 764, boil, K.cold, { align: 'left', size: 30 });

  // 2. compressor
  numLabel(2, 'COMPRESOR', 800, 205, own(w.compressor, CUE.cond), K.hot);        // clear of the unit's snow roof (y 250)
  var cA = F.win(T, w.squeezes, CUE.cond + 0.2, 0.3, 0.3);
  if (cA > 0) {
    // arrows sit 20 px after each tag (the Spanish words differ in length from the English ones)
    var tagW = function (t) { return F.measure(t, { size: 30, weight: 700 }) + 36; };
    tag('presión', 610, 540, cA, K.ink, { align: 'left', size: 30 });
    upArrow(610 + tagW('presión') + 20, 540, cA);
    var tA = F.win(T, w.temperature, CUE.cond + 0.2, 0.3, 0.3);
    tag('temperatura', 610, 612, tA, K.hot, { align: 'left', size: 30 });
    upArrow(610 + tagW('temperatura') + 20, 612, tA, K.hot);
  }

  // 3. condenser
  numLabel(3, 'CONDENSADOR', 1490, 286, own(w.indoorsC, CUE.valve), K.heat);
  // round 2: y 404 -> 476, below the wall picture frame (y 330-434) instead of on top of it
  tag('gas caliente', 1596, 476, F.win(T, w.hotGas - 0.1, CUE.valve + 0.2, 0.3, 0.3), K.hot, { align: 'left', size: 30 });
  tag('líquido', 1596, 776, F.win(T, w.condenses - 0.1, CUE.valve + 0.2, 0.3, 0.3), K.warm, { align: 'left', size: 30 });

  // 4. expansion valve
  // Spanish: the badge is ~140 px wider than "EXPANSION VALVE", so for the recap it slides down onto the
  // snow under the valve (after the pressure tags there have gone) instead of covering the coil and the wall
  // round 3: 0.15 s earlier, and the badge dips to ~25 % while it passes over the valve and the pipe (y 830)
  // so it relocates instead of sliding visibly across them
  var vDown = F.seg(T, w.loopRepeats + 0.2, w.loopRepeats + 0.8, 'inOutCubic');
  var vDip = 1 - 0.75 * Math.sin(Math.PI * vDown);
  numLabel(4, 'VÁLVULA DE EXPANSIÓN', F.lerp(822, 700, vDown), F.lerp(700, 930, vDown), own(w.expansion, CUE.payoff + 1) * vDip, K.cold);
  var vA = F.win(T, w.drops - 0.1, w.loopRepeats + 0.4, 0.3, 0.4);
  tag('alta presión', 900, 930, vA, K.warm, { sub: 'líquido tibio', size: 28 });
  tag('baja presión', 640, 930, vA, K.cold, { sub: 'líquido frío', size: 28, subA: F.seg(T, w.cold - 0.5, w.cold - 0.1) });   // round 2: in on "líquido", ~1.3 s to read
  // loop direction chevrons during the recap
  var rec = F.win(T, w.loopRepeats, CUE.payoff + 0.2, 0.4, 0.4);
  if (rec > 0) flowChevrons(T, rec);
}
function upArrow(x, y, a, col) {
  if (a <= 0) return;
  Film.glyph('up', x, y, 34, { color: col || K.ink, alpha: a, width: 0.12 });
}
function flowChevrons(T, a) {
  // only on the long straight runs, just outside the pipe (not inside the coils): evaporator ->
  // compressor and compressor -> condenser along the top, condenser -> valve along the bottom
  var F = Film, P = path();
  [[640, 340, 0, -40], [1120, 340, 0, -40], [1240, 830, Math.PI, 40]].forEach(function (c) {
    F.g.save(); F.g.translate(c[0], c[1] + c[3]); F.g.rotate(c[2]);
    F.glyph('right', 0, 0, 42, { color: K.ink, alpha: a * 0.95, width: 0.16 });
    F.g.restore();
  });
}

// ------------------------------------------------------------------ payoff (screen space, wide camera)
function drawPayoff(T) {
  var F = Film, w = CUE.w;
  if (T < CUE.payoff - 0.2) return;
  var hA = F.seg(T, w.moving - 0.1, w.moving + 0.5);
  // the narration's own line: the compressor's electricity does become heat, so "doesn't make it" would overstate
  F.reveal('Mover calor', 104, 130, F.seg(T, w.moving - 0.15, w.moving + 0.55), { by: 'word', family: 'serif', size: 96, color: K.ink });
  // round 2: 90 px (was 96) so the period clears the wall seam (x 1000) and the descenders the unit's snow cap
  F.reveal('rinde más que producirlo.', 104, 216, F.seg(T, w.beats - 0.15, w.making + 0.6), { by: 'word', family: 'serif', italic: true, size: 90, color: K.heat });

  // energy accounting: heat from the air + electricity for the compressor = heat delivered indoors
  var inA = F.seg(T, w.moreHeat - 0.9, w.moreHeat - 0.3);
  tag('calor del aire exterior', 95, 350, inA, K.heat, { align: 'left', size: 32 });
  var outA = F.seg(T, w.moreHeat - 0.1, w.moreHeat + 0.5, 'outCubic');
  if (outA > 0) {
    F.arrow(1590, 560, 1800, 505, { p: outA, curve: -0.25, color: K.heat, width: 26, head: 52 });   // ends inside the 5 % margin
    // round 3: below the arrow on the empty wall (was y 430, over the picture frame's lower-left corner)
    tag('sale calor', 1712, 628, outA, K.heat, { size: 40 });
  }
  var eA = F.seg(T, w.electricity - 0.1, w.electricity + 0.4);
  tag('electricidad que entra', 916, 500, eA, '#ffd84a', { size: 30 });

  // end card line
  var endA = F.seg(T, CUE.endTitle, CUE.endTitle + 0.5);
  F.text('CÓMO CALIENTA UNA BOMBA DE CALOR', 104, 978, { size: 34, weight: 800, tracking: 0.14, color: '#1a2330', alpha: endA });
  F.text('Modo invierno · esquema, no a escala', 104, 1018, { size: 32, weight: 600, color: '#3d4a5a', alpha: endA * 0.95 });
}
