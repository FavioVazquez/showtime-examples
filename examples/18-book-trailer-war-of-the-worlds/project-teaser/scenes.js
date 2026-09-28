/* The War of the Worlds: book trailer (16:9 master) and teaser (9:16), one drawing file.
 * CUE.cut picks the cut; every time comes from cues.js. Pictures: NASA/JPL/USGS PIA00003 (media/mars.jpg)
 * and Henrique Alvim Correa's 1906 drawings (media/launch|emerges|machine.jpg, graded by tools/grade.py).
 * Pure function of T: no state between frames. */
'use strict';

var PORTRAIT = false;

/* ---------------------------------------------------------------- framing */

/** Draw a source window of an image over the whole frame: centre (cx, cy) and width wf as fractions of
 *  the image; the window has the frame's aspect, and is kept inside the image (never stretched). */
function shot(F, g, name, cx, cy, wf, o) {
  o = o || {};
  var im = F.img[name];
  if (!im || !im.ready) return;
  var iw = im.w, ih = im.h;
  var sw = wf * iw, sh = sw * F.H / F.W;
  if (sh > ih) { sh = ih; sw = sh * F.W / F.H; }
  var sx = Math.max(0, Math.min(iw - sw, cx * iw - sw / 2));
  var sy = Math.max(0, Math.min(ih - sh, cy * ih - sh / 2));
  var dx = o.dx || 0, dy = o.dy || 0, pad = o.pad || 0;
  g.drawImage(im.img, sx, sy, sw, sh, -pad + dx, -pad + dy, F.W + 2 * pad, F.H + 2 * pad);
  if (o.dark) { g.save(); g.fillStyle = 'rgba(8,6,5,' + o.dark + ')'; g.fillRect(0, 0, F.W, F.H); g.restore(); }
}

/** A move between two framings [cx, cy, wf] over progress p (width interpolated geometrically). */
function move(a, b, p) {
  return [a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p, a[2] * Math.pow(b[2] / a[2], p)];
}

/** A portrait drawing shown whole, on its own blurred plate (the stage extension), with parallax. */
function whole(F, g, name, p, o) {
  o = o || {};
  var im = F.img[name];
  if (!im || !im.ready) return;
  // the stage itself is the extension: the drawing's sides fade into the flat stage colour
  // (seamless, never stretched); the film look's vignette and grain sit over both
  g.fillStyle = '#0d0a08'; g.fillRect(-4, -4, F.W + 8, F.H + 8);
  var s = (o.fit ? Math.min(F.W / im.w, F.H / im.h) : F.H / im.h) * (1 + 0.035 * p) * (o.scale || 1);
  var w = im.w * s, h = im.h * s;
  var x = (F.W - w) / 2 + 22 * p, y = (F.H - h) / 2 + (o.dy || 0);
  g.drawImage(im.img, x, y, w, h);
  // feather the drawing's side edges into the plate
  var fw = 170;
  var gl = g.createLinearGradient(x, 0, x + fw, 0);
  gl.addColorStop(0, 'rgba(13,10,8,1)'); gl.addColorStop(1, 'rgba(13,10,8,0)');
  g.fillStyle = gl; g.fillRect(x - 2, y, fw + 2, h);
  var gr = g.createLinearGradient(x + w, 0, x + w - fw, 0);
  gr.addColorStop(0, 'rgba(13,10,8,1)'); gr.addColorStop(1, 'rgba(13,10,8,0)');
  g.fillStyle = gr; g.fillRect(x + w - fw, y, fw + 2, h);
}

/** Decaying camera jolt after a hit (closed form). */
function jolt(F, T, t0, amp) {
  if (T < t0) return [0, 0];
  var a = amp * Math.exp(-(T - t0) * 7);
  return [F.noise(T * 38, 11) * a, F.noise(T * 31, 17) * a * 0.7];
}

/** Bottom scrim under the burned captions, only while a quote is spoken. */
function scrim(F, g, T) {
  var v = 0;
  CUE.scrims.forEach(function (w) { v = Math.max(v, F.win(T, w[0], w[1], 0.35, 0.35)); });
  if (v <= 0) return;
  var h = F.H * (PORTRAIT ? 0.42 : 0.34), y0 = F.H - h - (PORTRAIT ? F.H * 0.16 : 0);
  var gr = g.createLinearGradient(0, y0, 0, y0 + h);
  gr.addColorStop(0, 'rgba(6,5,4,0)');
  gr.addColorStop(PORTRAIT ? 0.5 : 0.7, 'rgba(6,5,4,' + (0.62 * v).toFixed(3) + ')');
  gr.addColorStop(1, 'rgba(6,5,4,' + ((PORTRAIT ? 0 : 0.7) * v).toFixed(3) + ')');   // vertical: fades out both ways (no edge)
  g.fillStyle = gr;
  g.fillRect(0, y0, F.W, h + (PORTRAIT ? 0 : 2));
}

/** Drifting ash (dark specks falling) or embers (warm specks rising). */
function ash(F, T, alpha, warm) {
  F.field(T, {
    count: warm ? 46 : 70, seed: warm ? 7 : 3, rect: [0, 0, F.W, F.H],
    speed: warm ? [8, -26] : [14, 38], size: warm ? [1.4, 3.4] : [1.2, 3.2],
    color: warm ? '#e8a35a' : '#1b1410', alpha: alpha, twinkle: warm ? 0.6 : 0.2,
  });
}

/* ---------------------------------------------------------------- the shots */

// framings [cx, cy, width] as fractions of each image (16:9 / 9:16)
var FR = {
  marsA: [0.533, 0.199, 0.60], marsB: [0.467, 0.600, 0.467],
  marsPA: [0.50, 0.30, 0.36], marsPB: [0.47, 0.55, 0.30],
  launchA: [0.50, 0.42, 1.00], launchB: [0.42, 0.47, 0.82],
  launchPA: [0.36, 0.45, 0.62], launchPB: [0.34, 0.50, 0.52],
  lid: [0.29, 0.50, 0.66], lid2: [0.28, 0.52, 0.58],
  man: [0.75, 0.62, 0.42], man2: [0.77, 0.61, 0.36],
  eye: [0.28, 0.62, 0.50], eye2: [0.27, 0.61, 0.26],
  head: [0.33, 0.24, 0.54], head2: [0.33, 0.25, 0.62],
  cost: [0.30, 0.80, 0.72], cost2: [0.29, 0.79, 0.56],
  // portrait
  lidP: [0.30, 0.46, 0.46], manP: [0.76, 0.62, 0.40], eyeP: [0.28, 0.62, 0.30], eyeP2: [0.27, 0.61, 0.17],
  headP: [0.33, 0.25, 0.34], headP2: [0.33, 0.26, 0.42],
  // 16:9 wide: a step back from the head, then out to the drawing's full width (hat to knees over the hill)
  wide: [0.44, 0.31, 0.86], wide2: [0.50, 0.36, 1.00],
};

function watch(F, g, T, end) {
  var p = F.E.inOutSine(Math.min(1, T / end));
  var f = move(PORTRAIT ? FR.marsPA : FR.marsA, PORTRAIT ? FR.marsPB : FR.marsB, p);
  shot(F, g, 'mars', f[0], f[1], f[2]);
  // the planet was a light in the night sky: slow breathing glow on the limb, no text
}

function arrive(F, g, T) {
  var p = F.E.inOutSine(F.seg(T, CUE.arrive - 0.4, CUE.lid));
  var f = move(PORTRAIT ? FR.launchPA : FR.launchA, PORTRAIT ? FR.launchPB : FR.launchB, p);
  var j = jolt(F, T, CUE.build, 5);
  shot(F, g, 'launch', f[0], f[1], f[2], { dx: j[0], dy: j[1], pad: 8, dark: 0.14 });
  // "Then came the night of the first falling star." typed on (Special Elite), verbatim, pg36 line 312
  var n = Array.from(CUE.typeText).length;
  var tp = F.seg(T, CUE.typeStart, CUE.typeStart + n / CUE.typeCps, 'linear');
  var out = 1 - F.seg(T, CUE.lid - 0.25, CUE.lid);
  if (tp > 0) {
    var size = PORTRAIT ? 64 : 64, ty = PORTRAIT ? 330 : 300;
    var lines = CUE.typeText.split('\n'), wide = 0;
    lines.forEach(function (l) { wide = Math.max(wide, F.measure(l, { family: '"Special Elite"', size: size })); });
    var tx = PORTRAIT ? (F.W - wide) / 2 : F.W - 130 - wide;   // block set by its longest line, typed left to right
    F.typewriter(CUE.typeText, tx, ty, tp, {
      family: '"Special Elite"', size: size, color: F.pal.ink, alpha: out, lineHeight: 1.35,
      caretColor: F.pal.accent, shadow: { blur: 18, x: 0, y: 2, color: 'rgba(0,0,0,0.85)' },
    });
  }
}

function lid(F, g, T) {
  var p = F.seg(T, CUE.lid, CUE.man);
  var f = PORTRAIT ? move(FR.lidP, FR.lidP, p) : move(FR.lid, FR.lid2, p);
  shot(F, g, 'emerges', f[0], f[1], f[2], { dark: 0.24 });
  // the Martian stays in shadow under the lid, but its outline still reads: the rim catches the light
  var gr = g.createLinearGradient(0, F.H * 0.5, 0, F.H);
  gr.addColorStop(0, 'rgba(8,6,5,0)'); gr.addColorStop(0.5, 'rgba(8,6,5,0.5)'); gr.addColorStop(1, 'rgba(8,6,5,0.78)');
  g.fillStyle = gr; g.fillRect(0, 0, F.W, F.H);
}
function man(F, g, T) {
  var p = F.seg(T, CUE.man, CUE.eye);
  var f = move(PORTRAIT ? FR.manP : FR.man, PORTRAIT ? FR.manP : FR.man2, p);
  shot(F, g, 'emerges', f[0], f[1], f[2], { dark: 0.3 });
}
function eye(F, g, T) {
  var p = F.seg(T, CUE.eye, CUE.drop, 'inCubic');
  var f = move(PORTRAIT ? FR.eyeP : FR.eye, PORTRAIT ? FR.eyeP2 : FR.eye2, p);
  shot(F, g, 'emerges', f[0], f[1], f[2], { dark: 0.22 });
}
function head(F, g, T, t0, t1) {
  var p = F.seg(T, t0, t0 + 0.55, 'outExpo') * 0.7 + F.seg(T, t0, t1) * 0.3;
  var f = move(PORTRAIT ? FR.headP : FR.head, PORTRAIT ? FR.headP2 : FR.head2, p);
  var j = jolt(F, T, t0, 16);
  shot(F, g, 'machine', f[0], f[1], f[2], { dx: j[0], dy: j[1], pad: 20 });
  ash(F, T, 0.55, false);
}
function wide(F, g, T) {
  if (PORTRAIT) {   // the portrait drawing fills a 9:16 frame whole
    whole(F, g, 'machine', F.seg(T, CUE.wide, (CUE.cost || CUE.dipAt) + 0.4));
  } else {          // 16:9: never pillarboxed; the camera pulls out to the drawing's full width
    var p = F.seg(T, CUE.wide, CUE.cost, 'outCubic');
    var f = move(FR.wide, FR.wide2, p);
    var j = jolt(F, T, CUE.wide, 6);
    shot(F, g, 'machine', f[0], f[1], f[2], { dx: j[0], dy: j[1], pad: 10 });
  }
  ash(F, T, 0.5, false);
}
function cost(F, g, T) {
  var p = F.E.inOutSine(F.seg(T, CUE.cost, CUE.title));
  var f = move(FR.cost, FR.cost2, p);
  shot(F, g, 'machine', f[0], f[1], f[2]);
  ash(F, T, 0.6, false);
}

/** The machine drawing with its left and right edges faded to transparent (made once; depends only on the
 *  image, so every frame still draws the same pixels). Used faint behind the title. */
var FEATHERED = null;
function featheredMachine(im) {
  if (FEATHERED) return FEATHERED;
  var c = document.createElement('canvas');
  c.width = im.w; c.height = im.h;
  var x = c.getContext('2d');
  x.drawImage(im.img, 0, 0);
  x.globalCompositeOperation = 'destination-out';
  var f = im.w * 0.3;
  [[0, f], [im.w, im.w - f]].forEach(function (e) {
    var gr = x.createLinearGradient(e[0], 0, e[1], 0);
    gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = gr; x.fillRect(Math.min(e[0], e[1]), 0, f, im.h);
  });
  var gv = x.createLinearGradient(0, im.h * 0.75, 0, im.h);   // and the bottom
  gv.addColorStop(0, 'rgba(0,0,0,0)'); gv.addColorStop(1, 'rgba(0,0,0,1)');
  x.fillStyle = gv; x.fillRect(0, im.h * 0.75, im.w, im.h * 0.25);
  FEATHERED = c;
  return c;
}

function title(F, g, T) {
  var P = PORTRAIT, cx = P ? 490 : F.W / 2;   // vertical: centred in the safe box (x 64-916), clear of the action rail
  // F.sequence draws both shots across the whole dip: the title card stays out of the first half
  // (the last shot darkens to black), then covers it with an opaque stage for the second half
  if (T < CUE.dipAt) return;
  g.fillStyle = F.pal.bg; g.fillRect(-4, -4, F.W + 8, F.H + 8);
  // the machine, faint, behind the title (parallax: it drifts up slowly)
  var im = F.img.machine;
  if (im && im.ready) {
    var s = (P ? F.H * 0.95 : F.H * 1.25) / im.h, w = im.w * s, h = im.h * s;
    var drift = F.seg(T, CUE.title - 0.4, CUE.duration);
    g.save();
    g.globalAlpha *= 0.16;
    g.drawImage(featheredMachine(im), cx - w / 2 + (P ? 0 : 380), (P ? F.H * 0.02 : -F.H * 0.12) - 40 * drift, w, h);
    g.restore();
    var gr = g.createRadialGradient(cx, F.H * 0.45, 50, cx, F.H * 0.45, F.W * 0.8);
    gr.addColorStop(0, 'rgba(13,10,8,0.2)'); gr.addColorStop(1, 'rgba(13,10,8,0.85)');
    g.fillStyle = gr; g.fillRect(0, 0, F.W, F.H);
  }
  ash(F, T, 0.55 * F.seg(T, CUE.title, CUE.title + 0.6), true);
  var hit = F.seg(T, CUE.title, CUE.title + 0.55, 'outExpo');
  var on = T >= CUE.title ? 1 : 0;
  var ty = P ? 700 : 468;
  var titleOpts = { family: '"Cinzel"', weight: 900, color: F.pal.ink, align: 'center', tracking: 0.03 };
  // flash of light behind the title on the hit
  if (on) F.glow(cx, ty - 40, P ? 620 : 900, '#e8a35a', 0.32 * (1 - F.seg(T, CUE.title, CUE.title + 1.2)));
  g.save();
  g.globalAlpha *= on;   // no fade: the title is whole on the first frame after the hit
  g.translate(cx, ty); g.scale(1.07 - 0.07 * hit, 1.07 - 0.07 * hit); g.translate(-cx, -ty);
  if (P) {
    F.text('THE WAR', cx, ty - 150, Object.assign({ size: 136 }, titleOpts));
    F.text('OF THE', cx, ty - 10, Object.assign({ size: 86 }, titleOpts));
    F.text('WORLDS', cx, ty + 150, Object.assign({ size: 150 }, titleOpts));
  } else {
    var size = F.fit('THE WAR OF THE WORLDS', 1640, Object.assign({ size: 124 }, titleOpts));
    F.text('THE WAR OF THE WORLDS', cx, ty, Object.assign({ size: Math.min(124, size) }, titleOpts));
  }
  g.restore();
  var by = F.seg(T, CUE.byline, CUE.byline + 0.5, 'reveal');
  var ruleY = P ? ty + 260 : ty + 58;
  F.line(cx - 260 * by, ruleY, cx + 260 * by, ruleY, { color: F.pal.accent, width: 2, alpha: 0.9 * by });
  F.text('H. G. WELLS · 1898', cx, ruleY + (P ? 82 : 74), { family: '"Cinzel"', weight: 700, size: P ? 54 : 46,
    color: F.pal.accent, align: 'center', tracking: 0.16, alpha: by });
  var cta = F.seg(T, CUE.cta, CUE.cta + 0.5, 'reveal');
  var ctaOpts = { family: '"Instrument Serif"', italic: true, size: P ? 62 : 58, color: F.pal.ink, align: 'center', by: 'line',
    width: 1600, lineHeight: 1.2 };
  if (P) {   // two lines broken at the phrase, not wherever the width runs out
    F.reveal('Read it free at', cx, ruleY + 200, cta, ctaOpts);
    F.reveal('Project Gutenberg (eBook #36)', cx, ruleY + 276, F.seg(T, CUE.cta + 0.08, CUE.cta + 0.58, 'reveal'), ctaOpts);
  } else {
    F.reveal('Read it free at Project Gutenberg (eBook #36)', cx, ty + 262, cta, ctaOpts);
  }
  var cr = F.seg(T, CUE.credit, CUE.credit + 0.5);
  var crOpts = { family: '"Inter Variable"', weight: 500, size: P ? 30 : 32, color: F.pal.muted, align: 'center', alpha: cr * 0.95 };
  if (P) {
    F.text('Illustrations: H. Alvim Corrêa, 1906', cx, 1370, crOpts);
    F.text('Mars: NASA/JPL/USGS', cx, 1414, crOpts);
  } else {
    F.text('Illustrations: H. Alvim Corrêa, 1906 · Mars: NASA/JPL/USGS', cx, F.H - 64, crOpts);
  }
}

/* ---------------------------------------------------------------- the cuts */

function trailerScenes(F, g, T) {
  return [
    { t0: 0, t1: CUE.burnAt, draw: function () { watch(F, g, T, CUE.arrive + 0.4); } },
    // the ridged-burn (WebGL) runs over burnAt..burnAt+burnDur; this canvas is its incoming layer
    { t0: CUE.burnAt, t1: CUE.lid, draw: function () { arrive(F, g, T); } },
    { t0: CUE.lid, t1: CUE.man, draw: function () { lid(F, g, T); } },
    { t0: CUE.man, t1: CUE.eye, draw: function () { man(F, g, T); } },
    { t0: CUE.eye, t1: CUE.drop, draw: function () { eye(F, g, T); } },
    { t0: CUE.drop, t1: CUE.wide, draw: function () { head(F, g, T, CUE.drop, CUE.wide); } },
    { t0: CUE.wide, t1: CUE.cost, draw: function () { wide(F, g, T); } },
    { t0: CUE.cost, t1: CUE.dipAt, draw: function () { cost(F, g, T); } },
    { t0: CUE.dipAt, t1: CUE.duration + 1, draw: function () { title(F, g, T); }, in: { type: 'dip', dur: CUE.dipDur, color: '#000' } },
  ];
}

function teaserScenes(F, g, T) {
  return [
    { t0: 0, t1: CUE.eye, draw: function () { watch(F, g, T, CUE.eye + 0.3); } },
    { t0: CUE.eye, t1: CUE.drop, draw: function () { eye(F, g, T); } },
    { t0: CUE.drop, t1: CUE.wide, draw: function () { head(F, g, T, CUE.drop, CUE.wide); } },
    { t0: CUE.wide, t1: CUE.dipAt, draw: function () { wide(F, g, T); } },
    { t0: CUE.dipAt, t1: CUE.duration + 1, draw: function () { title(F, g, T); }, in: { type: 'dip', dur: CUE.dipDur, color: '#000' } },
  ];
}

function drawFilm(T, g, F) {
  PORTRAIT = F.H > F.W;
  // burn.js asks for the outgoing (Mars) layer of the WebGL transition with window.__burnLayerA
  if (typeof window !== 'undefined' && window.__burnLayerA) {
    watch(F, g, T, CUE.arrive + 0.4);
    scrim(F, g, T);
    return;
  }
  F.sequence(T, CUE.cut === 'teaser' ? teaserScenes(F, g, T) : trailerScenes(F, g, T));
  scrim(F, g, T);
}
