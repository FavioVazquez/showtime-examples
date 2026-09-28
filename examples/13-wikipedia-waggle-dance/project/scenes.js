/* The waggle dance: picture. drawFilm(T, g, F) draws the canvas for time T (a pure function of T).
 * The hook's real footage and the source scene's browser window are DOM layers above the canvas
 * (index.html, layers.js). All drawing is original (not traced from any Commons figure); the hook's
 * ring and short trail follow the red paint mark as measured in the footage's own frames
 * (data/dance-track.js). The camera follows the dancer, so this is not a map of her path on the comb. */
'use strict';

var C = {
  bg: '#15100a', ink: '#f6ecd8', muted: '#c2b294', faint: '#6f6350',
  honey: '#f2b63d', honeyDeep: '#c98a1c', sun: '#ffd45e', flower: '#f0799f',
  comb: '#2a1d0e', combLine: '#5c4322', ground: '#1f1d0f', groundDot: '#3a3619', teal: '#6fd0c0',
};
var SERIF = '"Fraunces Variable"', SANS = '"Inter Variable"';
var DEG = Math.PI / 180;

function drawFilm(T, g, F) {
  F.sequence(T, [
    { t0: CUE.hook, t1: CUE.problem, draw: hookScene },
    { t0: CUE.problem, t1: CUE.angle, draw: problemScene, in: { type: 'fade', dur: 0.6 } },
    { t0: CUE.angle, t1: CUE.distance, draw: angleScene, in: { type: 'fade', dur: 0.6 } },
    { t0: CUE.distance, t1: CUE.round, draw: distanceScene, in: { type: 'push', dur: 0.6, dir: 'left' } },
    { t0: CUE.round, t1: CUE.source, draw: roundScene, in: { type: 'push', dur: 0.6, dir: 'left' } },
    { t0: CUE.source, t1: CUE.credit, draw: sourceScene, in: { type: 'fade', dur: 0.6 } },
    { t0: CUE.credit, t1: CUE.duration + 1, draw: creditScene, in: { type: 'fade', dur: 0.8 } },
  ]);
}

// ------------------------------------------------------------------ shared drawing
function txt(s, x, y, o) { return Film.text(s, x, y, Object.assign({ family: SANS, color: C.ink }, o)); }
function caps(s, x, y, o) {
  return txt(s, x, y, Object.assign({ size: 26, weight: 650, tracking: 0.16, color: C.muted }, o));
}

/** Hexagonal comb clipped to a rect (world units); r = hex radius. */
function comb(x, y, w, h, r, o) {
  var F = Film, g = F.g; o = o || {};
  g.save();
  F.rr(x, y, w, h, o.radius == null ? 22 : o.radius); g.clip();
  g.fillStyle = o.fill || C.comb; g.fillRect(x, y, w, h);
  var dx = Math.sqrt(3) * r, dy = 1.5 * r;
  g.beginPath();
  for (var row = -1; row * dy < h + dy; row++) {
    var off = (row & 1) ? dx / 2 : 0;
    for (var col = -1; col * dx < w + dx; col++) {
      var cx = x + col * dx + off, cy = y + row * dy;
      for (var k = 0; k < 6; k++) {
        var a = (60 * k - 30) * DEG, px = cx + r * 0.9 * Math.cos(a), py = cy + r * 0.9 * Math.sin(a);
        if (k === 0) g.moveTo(px, py); else g.lineTo(px, py);
      }
      g.closePath();
    }
  }
  g.strokeStyle = o.line || C.combLine; g.lineWidth = o.lineWidth || Math.max(1, r * 0.12);
  g.globalAlpha *= o.lineAlpha == null ? 1 : o.lineAlpha;
  g.stroke();
  g.restore();
  if (o.glow) {           // soft light around the dancer (the hive is dark)
    g.save(); F.rr(x, y, w, h, o.radius == null ? 22 : o.radius); g.clip();
    F.glow(o.glow[0], o.glow[1], o.glow[2], C.honey, o.glow[3] || 0.16);
    g.restore();
  }
  if (o.frame !== false) F.box(x, y, w, h, o.radius == null ? 22 : o.radius, { stroke: 'rgba(242,182,61,0.28)', lineWidth: 2 });
}

/** A worker bee. heading: radians, 0 = facing up, clockwise positive. wag: 0..1 waggle amount. */
function bee(x, y, heading, s, T, o) {
  var F = Film, g = F.g; o = o || {};
  var wag = o.wag || 0, sway = wag ? Math.sin(T * 2 * Math.PI * 7.5) * 0.32 * wag : 0;
  g.save();
  g.globalAlpha *= o.alpha == null ? 1 : o.alpha;
  g.translate(x, y); g.rotate(heading); g.scale(s, s);
  // wings (buzz blur while waggling)
  var wa = 0.55 + 0.25 * wag;
  g.fillStyle = 'rgba(230,236,245,' + (0.38 + 0.12 * wag) + ')';
  [-1, 1].forEach(function (side) {
    g.save(); g.translate(side * 6, -2); g.rotate(side * (wa + 0.15 * Math.sin(T * 60) * wag));
    g.beginPath(); g.ellipse(side * 11, 10, 8, 17, side * 0.25, 0, Math.PI * 2); g.fill(); g.restore();
  });
  // abdomen sways during the waggle run
  g.save(); g.translate(0, 6); g.rotate(sway);
  g.beginPath(); g.ellipse(0, 13, 10.5, 16, 0, 0, Math.PI * 2);
  g.fillStyle = C.honey; g.fill();
  g.save(); g.clip();
  g.fillStyle = '#3a2408';
  for (var i = 0; i < 3; i++) g.fillRect(-12, 8 + i * 8, 24, 3.6);
  g.restore(); g.restore();
  // thorax and head
  g.beginPath(); g.arc(0, 0, 8.5, 0, Math.PI * 2); g.fillStyle = '#6b4414'; g.fill();
  g.beginPath(); g.arc(0, -12, 6.5, 0, Math.PI * 2); g.fillStyle = '#2e1d08'; g.fill();
  g.strokeStyle = '#2e1d08'; g.lineWidth = 1.6; g.lineCap = 'round';
  g.beginPath(); g.moveTo(-2, -17); g.quadraticCurveTo(-6, -24, -9, -26); g.moveTo(2, -17); g.quadraticCurveTo(6, -24, 9, -26); g.stroke();
  g.restore();
}

function sunIcon(x, y, r, a) {
  var F = Film, g = F.g;
  g.save(); g.globalAlpha *= a == null ? 1 : a;
  F.glow(x, y, r * 3.2, C.sun, 0.22);
  g.strokeStyle = C.sun; g.lineWidth = Math.max(2, r * 0.12); g.lineCap = 'round';
  g.beginPath();
  for (var k = 0; k < 8; k++) {
    var an = k * Math.PI / 4;
    g.moveTo(x + Math.cos(an) * r * 1.35, y + Math.sin(an) * r * 1.35);
    g.lineTo(x + Math.cos(an) * r * 1.75, y + Math.sin(an) * r * 1.75);
  }
  g.stroke();
  F.circle(x, y, r, { fill: C.sun });
  g.restore();
}

function flowerIcon(x, y, r, a, T) {
  var F = Film, g = F.g;
  g.save(); g.globalAlpha *= a == null ? 1 : a;
  g.translate(x, y); g.rotate(0.3 + (T || 0) * 0.05);
  g.fillStyle = C.flower;
  for (var k = 0; k < 5; k++) {
    g.save(); g.rotate(k * 2 * Math.PI / 5);
    g.beginPath(); g.ellipse(0, -r * 0.62, r * 0.42, r * 0.62, 0, 0, Math.PI * 2); g.fill(); g.restore();
  }
  F.circle(0, 0, r * 0.36, { fill: C.sun });
  g.restore();
}

/** Point on a waggle-dance circuit. Local frame: run along -y (up), centred on 0.
 *  half 0: run, then loop on side `first`; half 1: run, then loop on the other side.
 *  k: 1 = waggle dance (run length L, loop width w), 0 = round dance (circle radius rr). */
function circuitPoint(ph, P) {
  ph = ((ph % 1) + 1) % 1;
  var half = ph < 0.5 ? 0 : 1, h = (ph - half * 0.5) * 2;
  var side = (half === 0 ? 1 : -1) * (P.first || -1);
  var fr = P.tw / (P.tw + P.tr);
  var L = P.L, w = P.w, k = P.k == null ? 1 : P.k, rr = P.rr || 80;
  var fx, fy, cx, cy, alpha, waggling = false;
  if (h < fr) {                     // run: bottom to top
    var u = h / fr;
    fx = 0; fy = Film.lerp(L / 2, -L / 2, u); waggling = true;
    alpha = u * Math.PI;
  } else {                          // return loop, back to the bottom
    var v = (h - fr) / (1 - fr);
    fx = side * w * Math.sin(Math.PI * v);
    fy = Film.lerp(-L / 2, L / 2, (1 - Math.cos(Math.PI * v)) / 2);
    alpha = Math.PI + v * Math.PI;
  }
  cx = (h < fr ? -side : side) * rr * Math.abs(Math.sin(alpha));   // round dance: up one side, down the other
  cy = rr * Math.cos(alpha);
  return { x: Film.lerp(cx, fx, k), y: Film.lerp(cy, fy, k), waggling: waggling && k > 0.5, half: half, h: h, fr: fr };
}

/** The dancer on a comb: centre (x, y), run angle ang (radians, clockwise from up), params P.
 *  t: seconds since the dance started (negative = not started). Returns the bee position. */
function dancer(x, y, ang, P, t, T, o) {
  var F = Film, g = F.g; o = o || {};
  var cyc = 2 * (P.tw + P.tr), ph = t / cyc;
  var ca = Math.cos(ang), sa = Math.sin(ang);
  function toW(p) { return [x + p.x * ca - p.y * sa, y + p.x * sa + p.y * ca]; }
  // the figure it draws (faint), then the part walked in the last cycle (bright)
  if (o.shape !== false) {
    var pts = [];
    for (var i = 0; i <= 120; i++) pts.push(toW(circuitPoint(i / 120, P)));
    F.path(pts, 1, { color: C.honey, width: o.shapeWidth || 3, alpha: (o.shapeAlpha == null ? 0.22 : o.shapeAlpha), smooth: true });
  }
  if (t < 0) return null;
  if (o.trail !== false) {
    var tr = [], n = 36, span = Math.min(ph, o.trailLen || 0.45);
    for (var j = 0; j <= n; j++) tr.push(toW(circuitPoint(ph - span + span * j / n, P)));
    F.path(tr, 1, { color: C.honey, width: o.trailWidth || 5, alpha: 0.75, smooth: true });
  }
  var p = circuitPoint(ph, P), q = circuitPoint(ph + 0.004, P);
  var w0 = toW(p), w1 = toW(q);
  var head = Math.atan2(w1[0] - w0[0], -(w1[1] - w0[1]));
  var jig = p.waggling ? Math.sin(T * 2 * Math.PI * 7.5) * 3 * (o.scale || 1) : 0;
  bee(w0[0] + jig * ca, w0[1] + jig * sa, head, o.scale || 1, T, { wag: p.waggling ? 1 : 0 });
  return { x: w0[0], y: w0[1], p: p };
}

/** Where the dancer is (for a light that follows her). */
function dancerPos(x, y, ang, P, t) {
  var p = circuitPoint(t / (2 * (P.tw + P.tr)), P), ca = Math.cos(ang), sa = Math.sin(ang);
  return [x + p.x * ca - p.y * sa, y + p.x * sa + p.y * ca];
}

/** Angle arc from direction a0 to a1 (clockwise from up) at (x, y), with a degree label. */
function angleArc(x, y, r, a0, a1, p, o) {
  var F = Film, g = F.g; o = o || {};
  if (p <= 0) return;
  var s0 = a0 - Math.PI / 2, s1 = F.lerp(a0, a1, p) - Math.PI / 2;
  g.save(); g.globalAlpha *= o.alpha == null ? 1 : o.alpha;
  g.beginPath(); g.moveTo(x, y); g.arc(x, y, r, s0, s1, a1 < a0); g.closePath();
  g.fillStyle = 'rgba(242,182,61,0.16)'; g.fill();
  g.beginPath(); g.arc(x, y, r, s0, s1, a1 < a0);
  g.strokeStyle = C.honey; g.lineWidth = 4; g.stroke();
  g.restore();
  var deg = Math.round(Math.abs(a1 - a0) / DEG * p);
  var mid = (a0 + F.lerp(a0, a1, p)) / 2, lr = r + (o.labelGap || 48) + Math.max(0, 42 - deg) * 3.2;
  txt(deg + '°', x + Math.sin(mid) * lr, y - Math.cos(mid) * lr + 14, {
    size: o.size || 44, weight: 750, align: 'center', color: C.honey, alpha: (o.alpha == null ? 1 : o.alpha) * F.seg(p, 0.3, 1),
  });
}

function ray(x, y, ang, len, o) {
  Film.line(x, y, x + Math.sin(ang) * len, y - Math.cos(ang) * len, Object.assign({ color: C.ink, width: 3 }, o));
}

// ------------------------------------------------------------------ 1. hook (footage is a DOM layer)
var FOOT = { x: 110, y: 200, w: 880, h: 660 };

function hookScene(local, p, T) {
  var F = Film, g = F.g;
  // frame shadow and outline around the DOM footage layer
  F.box(FOOT.x - 10, FOOT.y - 10, FOOT.w + 20, FOOT.h + 20, 28, { fill: '#0c0905', stroke: 'rgba(242,182,61,0.35)', lineWidth: 2 });
  F.glow(FOOT.x + FOOT.w / 2, FOOT.y + FOOT.h / 2, 700, C.honey, 0.07);
  var x0 = 1080, drift = F.seg(T, 0, CUE.problem, 'linear') * -10;
  caps(S.kicker, x0, 318 + drift, { color: C.honey, size: 28 });
  var size = 132, lines;
  for (; size > 80; size -= 4) {
    lines = F.wrap(S.title, 740, { family: SERIF, size: size, weight: 600 });
    if (lines.length <= 2 && lines.every(function (l) { return F.measure(l, { family: SERIF, size: size, weight: 600 }) <= 740; })) break;
  }
  lines.forEach(function (l, i) {
    txt(l, x0, 450 + drift + i * size * 0.98, { family: SERIF, size: size, weight: 600, tracking: -0.01 });
  });
  var yb = 450 + drift + (lines.length - 1) * size * 0.98;
  var para = F.paragraph(S.hookSub, x0, yb + 90, { width: 720, size: 40, weight: 450, color: C.muted, lineHeight: 1.3, family: SANS });
  // legend for the tracked mark, under the subtitle (the camera moves with her: a mark in the frame, not a map)
  var la = F.seg(T, 1.6, 2.2), ly = Math.max(792, yb + 90 + para.height + 40);
  if (la > 0) {
    F.line(x0, ly - 12, x0 + 70, ly - 12, { color: C.honey, width: 6, alpha: la, cap: 'round' });
    txt(S.traceLabel, x0 + 92, ly, { size: 34, weight: 550, color: C.ink, alpha: la, maxWidth: 648 });
    txt(S.traceNote, x0 + 92, ly + 44, { size: 28, weight: 500, color: C.muted, alpha: la, maxWidth: 648 });
  }
  // caption and credit under the footage
  txt(S.footCap, FOOT.x, FOOT.y + FOOT.h + 70, { size: 34, weight: 550, color: C.ink, maxWidth: FOOT.w + 40 });
  txt(S.footCredit, FOOT.x, FOOT.y + FOOT.h + 116, { size: 28, weight: 500, color: C.muted });
}

// ------------------------------------------------------------------ 2. problem
var HIVE = { x: 360, y: 500, w: 280, h: 300 };
var INNER = { x: 384, y: 540, w: 232, h: 236 };

function hiveBox(openP) {
  var F = Film, g = F.g;
  // roof and body
  F.box(HIVE.x - 24, HIVE.y - 40, HIVE.w + 48, 44, 8, { fill: '#7d5424' });
  F.box(HIVE.x, HIVE.y, HIVE.w, HIVE.h, 6, { fill: '#8a5d28', stroke: '#b27b36', lineWidth: 3 });
  // interior (cutaway): dark, a comb standing vertically
  if (openP > 0) {
    g.save(); g.globalAlpha *= openP;
    F.box(INNER.x, INNER.y, INNER.w, INNER.h, 4, { fill: '#070503' });
    comb(INNER.x + 20, INNER.y + 10, INNER.w - 40, INNER.h - 20, 8, { radius: 3, fill: '#140e06', line: '#3b2a14', frame: false, glow: [500, 690, 120, 0.12] });
    g.restore();
  }
  // front planks fade away for the cutaway
  g.save(); g.globalAlpha *= 1 - openP;
  for (var i = 0; i < 4; i++) F.line(HIVE.x + 6, HIVE.y + 75 * (i + 1), HIVE.x + HIVE.w - 6, HIVE.y + 75 * (i + 1), { color: '#6d4718', width: 3 });
  g.restore();
  F.box(HIVE.x + 110, HIVE.y + HIVE.h - 22, 60, 12, 3, { fill: '#1a1006' });   // entrance
}

function problemScene(local, p, T) {
  var F = Film, g = F.g;
  var t0 = CUE.problem;
  var open = F.seg(T, CUE.dark - 0.35, CUE.dark + 0.25, 'inOutCubic');
  var zoom = F.seg(T, CUE.vertical - 0.9, CUE.vertical + 0.2, 'camera');
  var cam = { x: F.lerp(F.W / 2, INNER.x + INNER.w / 2, zoom), y: F.lerp(F.H / 2, INNER.y + INNER.h / 2, zoom), zoom: F.lerp(1, 4.1, zoom) * (1 + 0.07 * F.seg(T, CUE.vertical + 0.2, CUE.angle + 0.5, 'linear')) };
  var beeX = 500, beeY = 690;
  F.withCamera(cam, function () {
    // outside: sun glow, meadow, flowers far away
    var outA = 1 - F.seg(T, CUE.vertical - 0.5, CUE.vertical + 0.1);
    g.save(); g.globalAlpha *= outA;
    sunIcon(1660, 190, 44, 1);
    g.fillStyle = C.ground; g.fillRect(-2000, 800, 6000, 900);
    F.line(-2000, 800, 4000, 800, { color: '#4a4420', width: 3 });
    for (var i = 0; i < 7; i++) {
      var fx = 1400 + i * 52 + F.noise(i, 3) * 20, fy = 792 - 30 - F.hash(i + 4) * 50;
      F.line(fx, 800, fx, fy, { color: '#5d7a3a', width: 4 });
      flowerIcon(fx, fy, 20, 1, T);
    }
    txt(S.outside, 1560, 900, { size: 30, weight: 650, tracking: 0.16, color: C.muted, align: 'center' });
    g.restore();
    hiveBox(open);
    // the forager flies home
    var fly = F.seg(T, t0 + 0.1, CUE.dark - 0.25, 'inOutSine');
    if (fly < 1) {
      var pts = [];
      for (var j = 0; j <= 40; j++) {
        var u = j / 40;
        pts.push([F.lerp(1580, 500, u), F.lerp(740, 790, u) - Math.sin(Math.PI * u) * 260]);
      }
      var pen = F.path(pts, fly, { color: C.honey, width: 4, dash: [2, 14], alpha: 0.8, cap: 'round' });
      bee(pen[0], pen[1], -80 * DEG, 1.1, T);
    }
    if (open > 0 && T < CUE.dances) {
      var arrive = F.seg(T, CUE.dark - 0.2, CUE.dark + 0.4);
      bee(beeX, F.lerp(760, beeY, arrive), 0, 0.32, T, { alpha: open });
    } else if (open > 0) {    // "So she dances": the first circuits, small, on the comb
      dancer(beeX, beeY - 12, 0, { L: 34, w: 16, tw: 0.8, tr: 0.7 }, T - CUE.dances, T, { scale: 0.32, shapeAlpha: 0.4, shapeWidth: 1.2, trailWidth: 1.6, trailLen: 0.4 });
    }
  });
  // labels in screen space
  var dA = F.win(T, CUE.dark - 0.15, CUE.vertical - 0.15, 0.25, 0.25);
  if (dA > 0) {
    F.pill(S.dark, 500, 440, { size: 34, fill: '#000000', color: C.ink, stroke: 'rgba(242,182,61,0.5)', alpha: dA });
  }
  var vA = F.seg(T, CUE.vertical, CUE.vertical + 0.4);
  if (vA > 0) {
    // the comb fills the frame: a vertical wall, up is up
    var ax = 1640;
    F.arrow(ax, 800, ax, 280, { p: vA, color: C.ink, width: 5, head: 20 });
    F.arrow(ax, 280, ax, 800, { p: vA, color: C.ink, width: 5, head: 20 });
    txt(S.vertical, ax - 40, 250, { size: 46, weight: 650, align: 'right', alpha: vA, family: SANS });
  }
  var pA = F.seg(T, CUE.point, CUE.point + 0.6);
  if (pA > 0) {
    // bee position on screen, and a pointing line that stops at the hive wall
    var bs = F.camPoint(cam, beeX, beeY), wx = F.camPoint(cam, INNER.x + INNER.w, beeY)[0];
    F.arrow(bs[0] + 40, bs[1], F.lerp(bs[0] + 40, wx - 10, pA), bs[1], { color: C.muted, width: 4, dash: [10, 10], head: 0 });
    var xa = F.seg(T, CUE.point + 0.5, CUE.point + 0.8);
    if (xa > 0) {
      var xs = 18;
      F.line(wx - 10 - xs, bs[1] - xs, wx - 10 + xs, bs[1] + xs, { color: C.flower, width: 7, alpha: xa, cap: 'round' });
      F.line(wx - 10 - xs, bs[1] + xs, wx - 10 + xs, bs[1] - xs, { color: C.flower, width: 7, alpha: xa, cap: 'round' });
      txt(S.noPoint, wx - 10, bs[1] + 90, { size: 38, weight: 600, align: 'right', color: C.ink, alpha: xa });
    }
  }
}

// ------------------------------------------------------------------ 3. angle
var PL = { x: 110, y: 200, w: 800, h: 760 }, PR = { x: 1010, y: 200, w: 800, h: 760 };
var HV = [510, 830], CB = [1410, 610];
var FOOD_BEARING = 45 * DEG, SUN_SHIFT = 25 * DEG;

function sunBearing(T) { return F_seg(T, CUE.sunMoves, CUE.sunMoves + 1.4, 'inOutCubic') * SUN_SHIFT; }
function F_seg(T, a, b, e) { return Film.seg(T, a, b, e); }

function push(p, amt, fn) {
  var F = Film;
  F.withCamera({ x: F.W / 2, y: F.H / 2, zoom: 1 + (amt || 0.035) * F.E.inOutSine(p) }, fn);
}

function angleScene(local, p, T) { push(p, 0.03, function () { angleBody(local, p, T); }); }
function angleBody(local, p, T) {
  var F = Film, g = F.g;
  var t0 = CUE.angle;
  // --- right panel first ("On the comb, ...")
  var rA = F.seg(T, t0 + 0.05, t0 + 0.6);
  g.save(); g.globalAlpha *= rA;
  caps(S.combView, PR.x, PR.y - 28);
  comb(PR.x, PR.y, PR.w, PR.h, 30, { glow: [CB[0], CB[1], 420, 0.14] });
  g.restore();
  // "straight up": dashed line up from the dance, the sun icon at its top
  var upP = F.seg(T, CUE.up - 0.1, CUE.up + 0.5, 'outCubic');
  if (upP > 0) {
    F.arrow(CB[0], CB[1], CB[0], F.lerp(CB[1], 300, upP), { color: C.ink, width: 4, dash: [12, 10], head: 18 });
    txt(S.up, CB[0] + 26, 330, { size: 36, weight: 650, alpha: upP });
  }
  var sunA = F.seg(T, CUE.sun - 0.1, CUE.sun + 0.4);
  if (sunA > 0) {
    sunIcon(CB[0], 262, 22, sunA);
    F.pill(S.upIsSun, CB[0], PR.y + PR.h - 52, { size: 32, fill: 'rgba(12,9,5,0.92)', color: C.ink, stroke: 'rgba(255,212,94,0.55)', alpha: sunA });
  }
  // --- left panel: the field seen from above (appears with "sun")
  var lA = F.seg(T, CUE.sun - 0.2, CUE.sun + 0.4);
  var sb = sunBearing(T);
  g.save(); g.globalAlpha *= rA;
  caps(S.topView, PL.x, PL.y - 28);
  F.box(PL.x, PL.y, PL.w, PL.h, 22, { fill: C.ground, stroke: 'rgba(242,182,61,0.28)', lineWidth: 2 });
  g.save(); F.rr(PL.x, PL.y, PL.w, PL.h, 22); g.clip();
  for (var i = 0; i < 90; i++) {
    F.circle(PL.x + F.hash(i) * PL.w, PL.y + F.hash(i + 200) * PL.h, 3 + F.hash(i + 400) * 3, { fill: C.groundDot });
  }
  g.restore();
  // hive (top view)
  F.box(HV[0] - 34, HV[1] - 26, 68, 52, 6, { fill: '#8a5d28', stroke: '#b27b36', lineWidth: 3 });
  txt(S.hive, HV[0], HV[1] + 70, { size: 30, weight: 600, align: 'center', color: C.muted });
  g.restore();
  if (lA > 0) {
    g.save(); g.globalAlpha *= lA;
    // sun direction
    var sl = 560;
    ray(HV[0], HV[1] - 30, sb, sl - 60, { color: C.sun, width: 4, dash: [12, 10] });
    sunIcon(HV[0] + Math.sin(sb) * sl, HV[1] - Math.cos(sb) * sl, 30, 1);
    txt(S.sun, HV[0] + Math.sin(sb) * sl + 58, HV[1] - Math.cos(sb) * sl + 12, { size: 34, weight: 650, color: C.sun });
    var mv = F.win(T, CUE.sunMoves, CUE.shifts + 1.2, 0.3, 0.4);
    if (mv > 0) txt(S.sunMoves, HV[0] + Math.sin(sb) * sl - 64, HV[1] - Math.cos(sb) * sl + 12, { size: 32, weight: 600, align: 'right', color: C.ink, alpha: mv });
    g.restore();
  }
  // food at 45 degrees right of the sun (at the start)
  var fP = F.seg(T, CUE.food - 0.1, CUE.food + 0.5, 'outCubic');
  var fl = 480, fx = HV[0] + Math.sin(FOOD_BEARING) * fl, fy = HV[1] - Math.cos(FOOD_BEARING) * fl;
  if (fP > 0) {
    ray(HV[0], HV[1] - 30, FOOD_BEARING, (fl - 70) * fP, { color: C.flower, width: 5 });
    flowerIcon(fx, fy, 30 * F.E.outBack(fP), 1, T);
    txt(S.food, fx - 52, fy + 10, { size: 34, weight: 650, color: C.flower, align: 'right', alpha: fP });
  }
  var a1 = F.seg(T, CUE.deg1 - 0.1, CUE.deg1 + 0.6, 'outCubic');
  angleArc(HV[0], HV[1], 170, sb, FOOD_BEARING, a1, { labelGap: 56 });
  // --- the waggle run on the comb: same angle from up (follows the sun with "shifts")
  var runAng = FOOD_BEARING - F.seg(T, CUE.shifts, CUE.shifts + 1.1, 'inOutCubic') * SUN_SHIFT;
  var runP = F.seg(T, CUE.waggle - 0.1, CUE.waggle + 0.5, 'outCubic');
  if (runP > 0) {
    var L = 300;
    ray(CB[0] - Math.sin(runAng) * L / 2 * 0, CB[1], runAng, 250 * runP, { color: C.honey, width: 7 });
    // label beside the run's end: never pulled back across the line; wraps (and shrinks) when it cannot fit
    var ex = CB[0] + Math.sin(runAng) * 250 * runP, rlMax = PR.x + PR.w - 24;
    var rlx = CB[0] + Math.sin(runAng) * 230 + 34, rly = CB[1] - Math.cos(runAng) * 230 + 40;
    var rlw = F.measure(S.run, { family: SANS, size: 36, weight: 700 });
    if (Math.min(rlx, rlMax - rlw) >= ex + 6) {
      txt(S.run, Math.min(rlx, rlMax - rlw), rly, { size: 36, weight: 700, color: C.honey, alpha: runP });
    } else {
      var rx = Math.max(rlx, ex + 18), rs = 36, rl;
      for (; rs > 26; rs -= 2) {
        rl = F.wrap(S.run, rlMax - rx, { family: SANS, size: rs, weight: 700 });
        if (rl.every(function (l) { return F.measure(l, { family: SANS, size: rs, weight: 700 }) <= rlMax - rx; })) break;
      }
      rl.forEach(function (l, i) {
        txt(l, rx, rly - (rl.length - 1 - i) * rs * 1.1, { size: rs, weight: 700, color: C.honey, alpha: runP });
      });
    }
  }
  // the wedge flies from the field to the comb and lands on it
  var fly = F.seg(T, CUE.deg2 - 0.25, CUE.deg2 + 0.65, 'inOutCubic');
  if (fly > 0 && fly < 1) {
    var wx = F.lerp(HV[0], CB[0], fly), wy = F.lerp(HV[1], CB[1], fly) - Math.sin(Math.PI * fly) * 120;
    g.save(); g.globalAlpha *= 0.9;
    ray(wx, wy, sb, 230, { color: C.sun, width: 5 });
    ray(wx, wy, FOOD_BEARING, 230, { color: C.flower, width: 5 });
    angleArc(wx, wy, 120, sb, FOOD_BEARING, 1, { alpha: 0.9, labelGap: 40, size: 40 });
    g.restore();
  }
  var a2 = F.seg(T, CUE.deg2 + 0.55, CUE.deg2 + 0.9);
  if (a2 > 0) angleArc(CB[0], CB[1], 130, 0, runAng, 1, { alpha: a2, labelGap: 46 });
  // before the run: she walks onto the comb to where her first waggle run starts
  if (T < CUE.waggle) {
    var sx = CB[0] - Math.sin(FOOD_BEARING) * 120, sy = CB[1] + Math.cos(FOOD_BEARING) * 120;
    var wk = F.seg(T, t0 + 0.2, CUE.waggle, 'inOutSine');
    var bx0 = F.lerp(PR.x + 150, sx, wk), by0 = F.lerp(PR.y + PR.h - 110, sy, wk) + Math.sin(wk * 9) * 10 * (1 - wk);
    bee(bx0, by0, Math.atan2(sx - (PR.x + 150), -(sy - (PR.y + PR.h - 110))) + Math.sin(T * 3) * 0.15, 1.25, T, { alpha: rA });
  }
  // the dancer: starts with the run
  if (runP > 0) {
    dancer(CB[0], CB[1], runAng, { L: 240, w: 110, tw: 1.1, tr: 0.9 }, T - CUE.waggle, T, { scale: 1.25, shapeAlpha: 0.18 * runP });
  }
}

// ------------------------------------------------------------------ 4. distance
function distanceScene(local, p, T) { push(p, 0.035, function () { distanceBody(local, p, T); }); }
function distanceBody(local, p, T) {
  var F = Film, g = F.g;
  var t0 = CUE.distance, split = F.seg(T, CUE.dist - 0.35, CUE.dist + 0.35, 'inOutCubic');
  // part A: one comb, the circuit drawn loop by loop
  if (split < 1) {
    g.save(); g.globalAlpha *= 1 - split;
    var P = { L: 300, w: 120, tw: 1.1, tr: 1.0, first: -1 };
    var start = CUE.left - P.tw - 0.35;           // the first return loop (left) is under way on "left"
    while (start > t0 + 0.3) start -= 2 * (P.tw + P.tr);   // ... and she is already dancing when the scene opens
    var lp = dancerPos(960, 560, 0, P, T - start);
    comb(560, 150, 800, 800, 32, { glow: [lp[0], lp[1], 360, 0.2] });   // the light follows her
    dancer(960, 560, 0, P, T - start, T, { scale: 1.3, shapeAlpha: 0.12 + 0.5 * F.seg(T, CUE.fig8, CUE.fig8 + 0.4), shapeWidth: 5, trailLen: 0.5 });
    var la = F.seg(T, CUE.left, CUE.left + 0.35), ra = F.seg(T, CUE.right, CUE.right + 0.35);
    txt(S.loopLeft, 960 - 200, 560, { size: 40, weight: 700, align: 'right', alpha: la, color: C.ink });
    txt(S.loopRight, 960 + 200, 560, { size: 40, weight: 700, align: 'left', alpha: ra, color: C.ink });
    var f8 = F.seg(T, CUE.fig8, CUE.fig8 + 0.4);
    if (f8 > 0) F.pill(S.fig8, 960, 1000, { size: 38, fill: 'rgba(12,9,5,0.92)', color: C.honey, stroke: 'rgba(242,182,61,0.6)', alpha: f8 });
    g.restore();
  }
  // part B: near vs far, same angle, a longer waggle for the far food
  if (split > 0) {
    g.save(); g.globalAlpha *= split;
    var panels = [
      { x: 150, label: S.near, dist: 0.28, P: { L: 120, w: 90, tw: 0.55, tr: 0.8 } },
      { x: 1010, label: S.far, dist: 1.0, P: { L: 330, w: 120, tw: 1.9, tr: 0.8 } },
    ];
    var maxTw = 1.9;
    panels.forEach(function (pn, i) {
      var x = pn.x, w = 760;
      caps(pn.label, x, 150, { color: C.ink, size: 30 });
      // mini map: hive -> food, relative only (no metres)
      var mx = x + 10, my = 222, mw = 700;
      F.box(mx - 30, my - 12, 24, 24, 4, { fill: '#8a5d28' });
      F.line(mx, my, mx + mw * pn.dist * 0.9, my, { color: C.flower, width: 4, dash: [10, 8] });
      flowerIcon(mx + mw * pn.dist * 0.9 + 22, my, 16, 1, T);
      comb(x, 270, w, 560, 30, { glow: [x + w / 2, 560, 300, 0.14] });
      var st = CUE.dist + 0.15 + i * 0.25;
      var d = dancer(x + w / 2, 560, 0, pn.P, T - st, T, { scale: 1.05, shapeAlpha: 0.25, trailLen: 0.4 });
      // waggle timer: fills while she waggles, holds, resets on the next run
      var bx = x + 60, by = 862, bw = 640;
      F.box(bx, by, bw, 26, 13, { fill: 'rgba(246,236,216,0.10)' });
      var cyc = pn.P.tw + pn.P.tr, lt = T - st, fill = 0;
      if (lt > 0) {
        var inHalf = lt % cyc;
        fill = inHalf < pn.P.tw ? inHalf / maxTw : pn.P.tw / maxTw;
      }
      if (fill > 0) F.box(bx, by, bw * fill, 26, 13, { fill: C.honey });
      txt(S.waggleTime, bx, by + 64, { size: 32, weight: 550, color: C.muted });
    });
    var hl = F.seg(T, CUE.farther - 0.1, CUE.farther + 0.4);
    if (hl > 0) txt(S.fartherLonger, 960, 996, { size: 44, weight: 700, align: 'center', color: C.honey, alpha: hl, family: SANS });
    g.restore();
  }
}

// ------------------------------------------------------------------ 5. round dance -> waggle dance
var SC = { x0: 330, x1: 1590, y: 915, max: 50 };
function mx(m) { return SC.x0 + (SC.x1 - SC.x0) * m / SC.max; }

function roundScene(local, p, T) {
  // fade out before the source column and browser window open (CUE.source + 0.3): no two layouts at once
  var g = Film.g;
  g.save(); g.globalAlpha *= 1 - Film.seg(T, CUE.source - 0.15, CUE.source + 0.28);
  push(p, 0.035, function () { roundBody(local, p, T); });
  g.restore();
}
function roundBody(local, p, T) {
  var F = Film, g = F.g;
  var t0 = CUE.round;
  // species first: the numbers below are for this bee
  txt(S.species, 110, 190, { size: 40, weight: 700, color: C.ink });
  txt(S.speciesLatin, 110, 240, { size: 34, weight: 450, italic: true, color: C.muted });
  // distance of the food: ~8 m, 10 m on "ten", then out past 40 m on "forty"
  var d = 8 + 2 * F.seg(T, CUE.ten - 0.2, CUE.ten + 0.5, 'inOutCubic') + 36 * F.seg(T, CUE.forty - 0.2, CUE.stretches + 1.0, 'inOutCubic');
  var k = F.clamp((d - 12) / 28, 0, 1);
  k = F.E.inOutSine(k);
  var P = { L: F.lerp(0, 260, k), w: F.lerp(100, 120, k), rr: 100, k: k, tw: F.lerp(0.9, 1.3, k), tr: F.lerp(0.9, 0.9, k) };
  comb(560, 160, 800, 560, 30, { glow: [960, 440, 360, 0.15] });
  dancer(960, 440, 0, P, T - t0 - 0.2, T, { scale: 1.05, shapeAlpha: 0.35, trailLen: 0.35 });
  var zi = d < 15 ? 0 : (d < 40 ? 1 : 2), nm = [S.roundDance, S.transitional, S.waggleDance][zi];
  F.pill(nm, 960, 108, { size: 36, fill: 'rgba(12,9,5,0.92)', color: [C.teal, C.ink, C.honey][zi], stroke: 'rgba(242,182,61,0.5)' });
  // the distance scale
  var sA = F.seg(T, t0 + 0.2, t0 + 0.8);
  g.save(); g.globalAlpha *= sA;
  F.box(SC.x0 - 58, SC.y - 22, 44, 44, 6, { fill: '#8a5d28', stroke: '#b27b36', lineWidth: 2 });
  F.line(SC.x0, SC.y, SC.x1 + 40, SC.y, { color: C.faint, width: 4 });
  txt(S.distFromHive, SC.x1 + 40, SC.y + 104, { size: 30, weight: 550, color: C.muted, align: 'right' });
  var zr = F.seg(T, CUE.ten, CUE.ten + 0.4), zw = F.seg(T, CUE.forty, CUE.forty + 0.4);
  function zone(m0, m1, col, label, range, a, open) {
    if (a <= 0) return;
    var x0 = mx(m0), x1 = open ? SC.x1 + 40 : mx(m1);
    F.box(x0, SC.y - 9, x1 - x0, 18, 9, { fill: col, alpha: a * 0.85 });
    txt(label, (x0 + x1) / 2, SC.y + 58, { size: 32, weight: 650, align: 'center', color: col, alpha: a });
    txt(range, (x0 + x1) / 2, SC.y - 30, { size: 32, weight: 700, align: 'center', color: C.ink, alpha: a });
  }
  zone(0, 10, C.teal, S.roundDance, S.zRound, zr);
  zone(20, 30, C.muted, S.transitional, S.zTrans, zw);
  zone(40, 50, C.honey, S.waggleDance, S.zWaggle, zw, true);
  g.restore();
  // the food marker slides along the scale
  var fxm = mx(Math.min(d, SC.max + 1));
  F.line(fxm, SC.y - 104, fxm, SC.y - 62, { color: C.flower, width: 3, alpha: sA });
  flowerIcon(fxm, SC.y - 124, 22, sA, T);
}

// ------------------------------------------------------------------ 6. source (browser window is a DOM layer)
function sourceScene(local, p, T) {
  var F = Film, g = F.g;
  // out before the crossfade into the end card, so two text layouts never overlap
  // in with the browser window (CUE.source + 0.3, layers.js), after the round scene has faded out
  g.save(); g.globalAlpha *= F.seg(T, CUE.source + 0.3, CUE.source + 0.8) * (1 - F.seg(T, CUE.credit - 0.6, CUE.credit - 0.2));
  sourceBody(T);
  g.restore();
}
// paragraph that breaks only at ordinary spaces, so a non-breaking space keeps "rev 1371912261" together
function nbPara(str, x, y, o) {
  var words = String(str).split(' '), lines = [], line = words[0];
  for (var i = 1; i < words.length; i++) {
    var test = line + ' ' + words[i];
    if (Film.measure(test, o) > o.width) { lines.push(line); line = words[i]; } else line = test;
  }
  lines.push(line);
  var lh = (o.lineHeight || 1.35) * (o.size || 36);
  lines.forEach(function (l, i) { Film.text(l, x, y + i * lh, o); });
  return { lines: lines, height: lines.length * lh };
}
function sourceBody(T) {
  var F = Film, g = F.g;
  var x = 1360, w = 480;
  F.glow(700, 540, 800, C.honey, 0.06);
  caps(S.srcKicker, x, 240, { color: C.honey, size: 28 });
  nbPara(S.srcLine, x, 292, { width: w, size: 32, weight: 550, color: C.ink, lineHeight: 1.3, family: SANS });
  var a = F.seg(T, CUE.frisch - 0.5, CUE.frisch);
  if (a > 0) {
    F.line(x, 470, x + 90, 470, { color: C.honey, width: 4, alpha: a });
    txt(S.vfName, x, 548, { family: SERIF, size: 58, weight: 600, alpha: a, maxWidth: w });
    txt(S.vfRole, x, 604, { size: 34, weight: 500, color: C.muted, alpha: a });
  }
  var b = F.seg(T, CUE.nobel - 0.2, CUE.nobel + 0.3);
  if (b > 0) nbPara(S.vfNobel, x, 680, { width: w, size: 36, weight: 650, color: C.ink, alpha: b, family: SANS, lineHeight: 1.25 });
  var c = F.seg(T, CUE.first - 0.2, CUE.first + 0.3);
  if (c > 0) F.paragraph(S.vfFirst, x, 790, { width: w, size: 34, weight: 500, color: C.honey, alpha: c, family: SANS, lineHeight: 1.3 });
}

// ------------------------------------------------------------------ 7. credit
function creditScene(local, p, T) { push(Film.seg(T, CUE.credit, CUE.duration, 'linear'), 0.04, function () { creditBody(local, p, T); }); }
function creditBody(local, p, T) {
  var F = Film, g = F.g;
  var t0 = CUE.credit;
  // the payoff, with the dance as its emblem
  dancer(300, 300, 45 * DEG, { L: 130, w: 60, tw: 0.9, tr: 0.8 }, T - t0, T, { scale: 0.75, shapeAlpha: 0.35, trailLen: 0.4 });
  F.reveal(S.payoffA, 480, 290, F.seg(T, t0 + 0.1, t0 + 0.9), { by: 'word', family: SERIF, size: 76, weight: 600, color: C.ink });
  F.reveal(S.payoffB, 480, 384, F.seg(T, t0 + 0.45, t0 + 1.25), { by: 'word', family: SERIF, size: 76, weight: 600, color: C.honey });
  var a = F.seg(T, t0 + 0.9, t0 + 1.5);
  F.line(160, 520, 1760, 520, { color: C.faint, width: 2, alpha: a });
  var y = 600;
  var r1 = F.paragraph(S.credit1, 160, y, { width: 1600, size: 34, weight: 500, color: C.ink, alpha: a, family: SANS, lineHeight: 1.3 });
  y += r1.height + 18;
  txt(S.credit2, 160, y, { size: 34, weight: 500, color: C.ink, alpha: a }); y += 62;
  txt(S.credit3, 160, y, { size: 34, weight: 700, color: C.honey, alpha: a }); y += 70;
  txt(S.credit4, 160, y, { size: 28, weight: 500, color: C.muted, alpha: a, maxWidth: 1600 });
}
