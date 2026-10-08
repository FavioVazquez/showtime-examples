/* shot-5 "Kagan's bend" (Spanish; English cue words below, moved beats noted at the end): a pure function of scene-local time (ST.onSeek). Beats (scene-relative, cues-shot-5.txt):
   frame 0 = the recipe page as shot-4 ends; margin note swaps to "Henri B. Kagan · 1986" on "Henri" 1.75;
   box 2's tick on "ticked" 2.45; page turn 3.40 (recap strip "Frank's recipe 1 2 3" stays top);
   the metal disc on "metal" 5.91, its two pieces on "holds two pieces" 6.22-6.77;
   the three kinds of pairs from "so mixed hands" 7.85, the pie sweeping on "three kinds of pairs" 8.74;
   the mixed slice pulled out on "the mixed pair" 10.28, struck through in ink with "barely works" on "barely" 10.91;
   "pieces 75 : 25" on "Start seventy-five" 12.21-13.44, slice shares 56 / 38 / 6 % after "twenty-five" 13.60;
   the pie re-splits on "working catalysts" 14.62 (exact 56.25 / 37.5 / 6.25 % -> 90 / 0 / 10 %), "90 : 10" on "ninety" 15.68;
   page turn 16.50 to the hand-ruled chart: orange curve on "purer product" 17.00, dashed line on "straight line" 18.07,
   the arrow on "predicts" 18.80. The curve is a toy shape (y = 1 - (1 - x)^2.4), labelled "shape only, not Kagan's data".
   Spanish moves (cues-shot-5.txt): disc on "metal" 4.98; slice pulled on "par mixto" 9.66; strike + "apenas funciona" on "apenas" 10.21;
   75 : 25 box on "Empieza" 11.47; dashed line on "línea recta" 19.02, then the two points and the arrow (Spanish says "predice" before "línea").
   Facts: F3, F4 (numbers read from Nobel popular background fig. 4, our drawing), F5, H5. */
(function () {
  var SID = 'shot-5', DUR = 21.314;
  var sec = document.getElementById(SID);
  if (!sec || !window.ST) return;
  /* ---------- shared helpers (same code in s-shot-4.js and s-shot-5.js) ---------- */
  var q = function (s) { return sec.querySelector(s); };
  var clamp = function (x, a, b) { return Math.max(a, Math.min(b, x)); };
  var prog = function (t, a, b) { return clamp((t - a) / (b - a), 0, 1); };
  var io = function (p) { return 0.5 - 0.5 * Math.cos(Math.PI * p); };
  var lerp = function (a, b, p) { return a + (b - a) * p; };
  function seg(a, b, n) { var o = []; for (var i = 0; i <= n; i++) { var s = i / n; o.push([a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s]); } return o; }
  function chain(list, n) { var o = []; for (var i = 0; i + 1 < list.length; i++) { var s = seg(list[i], list[i + 1], n); if (i) s.shift(); o = o.concat(s); } return o; }
  // tapered ink stroke drawn on up to p (0..1) of its length; widths follow the full length (seeded wobble)
  function ink(pts, w, seed, taper, p) {
    taper = taper || 0.06; p = p == null ? 1 : p;
    if (p <= 0 || pts.length < 2) return '';
    var L = [0], i;
    for (i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    var T = L[L.length - 1] || 1, cut = p * T, use = [], ss = [];
    for (i = 0; i < pts.length; i++) {
      if (L[i] <= cut) { use.push(pts[i]); ss.push(L[i] / T); continue; }
      var k = (cut - L[i - 1]) / ((L[i] - L[i - 1]) || 1);
      use.push([pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k]); ss.push(p); break;
    }
    if (use.length < 2) return '';
    var left = [], right = [];
    for (i = 0; i < use.length; i++) {
      var a = use[Math.max(0, i - 1)], b = use[Math.min(use.length - 1, i + 1)];
      var dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d, s = ss[i];
      var end = Math.min(1, s / taper, (1 - s) / taper);
      var hw = 0.5 * w * (0.35 + 0.65 * Math.sqrt(Math.max(0, end))) * (1 + 0.12 * ST.noise(s * 8, seed));
      left.push([use[i][0] + nx * hw, use[i][1] + ny * hw]); right.push([use[i][0] - nx * hw, use[i][1] - ny * hw]);
    }
    var fm = function (v) { return v[0].toFixed(1) + ' ' + v[1].toFixed(1); };
    return 'M ' + left.map(fm).join(' L ') + ' L ' + right.reverse().map(fm).join(' L ') + ' Z';
  }
  // a hand-ruled line: a faint seeded wobble across the ruler
  function ruled(a, b, n, seed, amp) {
    var o = seg(a, b, n), dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d;
    return o.map(function (v, i) { var w = amp * ST.noise(i / n * 3, seed); return [v[0] + nx * w, v[1] + ny * w]; });
  }
  // a hand-drawn checkbox: four ruled sides from the top-left corner, a little overshoot at the close
  function boxPts(x, y, s, seed) {
    var r = ST.rand(seed), j = function () { return r.range(-2.2, 2.2); };
    var c = [[x + j(), y + j()], [x + s + j(), y + j()], [x + s + j(), y + s + j()], [x + j(), y + s + j()], [x + 1 + j(), y - 1 + j()], [x + 10, y - 2 + j()]];
    var o = [];
    for (var i = 0; i + 1 < c.length; i++) { var sgm = ruled(c[i], c[i + 1], i < 4 ? 14 : 3, seed + i, 0.9); if (i) sgm.shift(); o = o.concat(sgm); }
    return o;
  }
  function tickPts(x, y, s) { return chain([[x + 0.16 * s, y + 0.5 * s], [x + 0.42 * s, y + 0.8 * s], [x + 1.16 * s, y - 0.22 * s]], 14); }
  function fadeRise(el, p, rise) {
    el.style.opacity = p.toFixed(3);
    el.style.transform = rise ? 'translateY(calc(var(--u) * ' + ((1 - p) * rise).toFixed(2) + '))' : '';
  }
  // write-on: a left-to-right reveal (pen speed), the element fully clipped at 0
  function writeOn(el, p) {
    el.style.opacity = p > 0 ? '1' : '0';
    el.style.clipPath = 'inset(-30% ' + ((1 - p) * 102).toFixed(2) + '% -30% -3%)';
  }

  /* ---------- the recipe page: geometry built once, state set per frame ---------- */
  var ROWS = [399, 564, 729], BX = 262, BS = 80;
  var page = (function () {
    var boxP = ROWS.map(function (y, i) { return boxPts(BX, y - BS / 2, BS, 'box' + i); });
    var tickP = ROWS.map(function (y) { return tickPts(BX, y - BS / 2, BS); });
    var leadP = ROWS.map(function (y, i) { return ruled([1446, y + 2], [1482, y + 2], 6, 'lead' + i, 0.6); });
    q('.pg-margin').setAttribute('d', ink(ruled([196, 168], [196, 1080], 40, 'margin', 1), 3, 'mg', 0.01) + ' ' +
      ink(ruled([204, 168], [204, 1080], 40, 'margin2', 1), 2, 'mg2', 0.01));
    var rulesP = ROWS.map(function (y, i) { return ruled([250, y + 52], [1440, y + 52], 60, 'rule' + i, 0.8); });
    var els = {
      box: [1, 2, 3].map(function (i) { return q('.pg-box' + i); }), tick: [1, 2, 3].map(function (i) { return q('.pg-tick' + i); }),
      lead: [1, 2, 3].map(function (i) { return q('.pg-lead' + i); }), num: [1, 2, 3].map(function (i) { return q('.pg-num' + i); }),
      txt: [1, 2, 3].map(function (i) { return q('.pg-txt' + i); }), lab: [1, 2, 3].map(function (i) { return q('.pg-lab' + i); }),
      rules: q('.pg-rules'), uline: q('.pg-uline'), src: q('.pg-src'), mirror: q('.pg-picto-m')
    };
    // st: {uline, rules, box[3], num[3], txt[3], tick[3], lab[3], src, mirror}
    return function (st) {
      els.uline.style.clipPath = 'inset(-40% ' + ((1 - st.uline) * 101).toFixed(2) + '% -40% 0)';
      els.rules.setAttribute('d', rulesP.map(function (r, i) { return ink(r, 2, 'ru' + i, 0.02, st.rules); }).join(' '));
      for (var i = 0; i < 3; i++) {
        els.box[i].setAttribute('d', ink(boxP[i], 4.6, 'bx' + i, 0.03, st.box[i]));
        els.tick[i].setAttribute('d', ink(tickP[i], 9, 'tk' + i, 0.12, st.tick[i]));
        els.lead[i].setAttribute('d', ink(leadP[i], 3.4, 'ld' + i, 0.2, st.lab[i]));
        fadeRise(els.num[i], st.num[i], 0);
        writeOn(els.txt[i], st.txt[i]);
        fadeRise(els.lab[i], st.lab[i], 12);
      }
      fadeRise(els.src, st.src, 8);
      els.mirror.style.opacity = st.mirror.toFixed(3);
    };
  })();

  var setAttr = function (el, k, v) { el.setAttribute(k, v); };
  var rad = function (d) { return d * Math.PI / 180; };

  /* ---------- recap strip ---------- */
  var RCX = [1068, 1158, 1248], RCY = 58, RCS = 40;
  q('.rc-boxes').setAttribute('d', RCX.map(function (x, i) { return ink(boxPts(x, RCY, RCS, 'rc' + i), 3, 'rcb' + i, 0.03); }).join(' '));
  q('.rc-ticks').setAttribute('d', [0, 1].map(function (i) { return ink(tickPts(RCX[i], RCY, RCS), 5.5, 'rct' + i, 0.12); }).join(' '));

  /* ---------- the catalyst: a metal disc holding two pieces ---------- */
  var DC = [400, 410], DR = 78;
  function circlePts(c, r, a0, sweep, n, seed, amp) {
    var o = []; for (var i = 0; i <= n; i++) { var a = rad(a0 + sweep * i / n), w = 1 + (amp || 0) * ST.noise(i / n * 4, seed); o.push([c[0] + Math.cos(a) * r * w, c[1] + Math.sin(a) * r * w]); }
    return o;
  }
  function rrectPts(cx, cy, w, h, r) {
    var x0 = cx - w / 2, x1 = cx + w / 2, y0 = cy - h / 2, y1 = cy + h / 2, o = [], k;
    var arc = function (ax, ay, s) { for (k = 0; k <= 6; k++) { var a = rad(s + 90 * k / 6); o.push([ax + Math.cos(a) * r, ay + Math.sin(a) * r]); } };
    arc(x1 - r, y0 + r, -90); arc(x1 - r, y1 - r, 0); arc(x0 + r, y1 - r, 90); arc(x0 + r, y0 + r, 180); o.push([x1 - r + 4, y0 - 0.5]);
    return o;
  }
  var discP = circlePts(DC, DR, -100, 372, 90, 'disc', 0.012);
  var slotP = [rrectPts(205, 410, 86, 100, 18), rrectPts(595, 410, 86, 100, 18)];
  var stickP = [ruled([324, 410], [250, 410], 10, 'st1', 0.7), ruled([476, 410], [550, 410], 10, 'st2', 0.7)];
  var discFill = q('.kp-disc-fill'), disc = q('.kp-disc'), slots = q('.kp-slots'), sticks = q('.kp-sticks'), mLetter = q('.kp-m');
  var slotFillTpl = null;
  // light piece fills under the slot outlines (static shapes, faded with the slots)
  (function () {
    var ns = 'http://www.w3.org/2000/svg', svg = q('.kp-svg'), g = document.createElementNS(ns, 'g');
    g.setAttribute('class', 'kp-slotfill');
    [205, 595].forEach(function (x) { var r = document.createElementNS(ns, 'rect'); r.setAttribute('x', x - 43); r.setAttribute('y', 360); r.setAttribute('width', 86); r.setAttribute('height', 100); r.setAttribute('rx', 18); r.setAttribute('fill', '#ece4d4'); g.appendChild(r); });
    svg.insertBefore(g, slots); slotFillTpl = g;
  })();

  /* ---------- the three kinds of pairs ---------- */
  var PY = [330, 520, 710];
  var pairs = [1, 2, 3].map(function (i) { return q('.kp-pair' + i); });
  pairs.forEach(function (g, i) {
    g.querySelector('.kp-pst').setAttribute('d', ink(seg([1284, PY[i]], [1310, PY[i]], 4), 4, 'ps' + i, 0.2) + ' ' + ink(seg([1370, PY[i]], [1396, PY[i]], 4), 4, 'pt' + i, 0.2));
  });
  var pct = [1, 2, 3].map(function (i) { return q('.kp-pct' + i); }), barely = q('.kp-barely'), pairsG = q('.kp-pairs');
  var strikeRowP = ruled([1218, 530], [1462, 510], 24, 'srow', 1.2), strikeRow = q('.kp-strike-row');

  /* ---------- the pie: exact shares of the circle ---------- */
  var C = [880, 500], R = 220;
  var wO = q('.kp-w-o'), wG = q('.kp-w-g'), wT = q('.kp-w-t'), rim = q('.kp-rim'), phO = q('.kp-ph-o'), phT = q('.kp-ph-t');
  var strikePie = q('.kp-strike-pie');
  var rimP = circlePts(C, R + 2, -90, 360, 120, 'rim', 0.006);
  function polar(a, r, off) { return [C[0] + off[0] + Math.cos(rad(a)) * r, C[1] + off[1] + Math.sin(rad(a)) * r]; }
  function wedge(a0, a1, off) {
    if (a1 - a0 < 0.05) return '';
    var p0 = polar(a0, R, off), p1 = polar(a1, R, off), large = (a1 - a0) > 180 ? 1 : 0;
    if (a1 - a0 >= 359.95) return 'M ' + (C[0] + off[0] - R) + ' ' + (C[1] + off[1]) + ' a ' + R + ' ' + R + ' 0 1 0 ' + (2 * R) + ' 0 a ' + R + ' ' + R + ' 0 1 0 ' + (-2 * R) + ' 0 Z';
    return 'M ' + (C[0] + off[0]).toFixed(1) + ' ' + (C[1] + off[1]).toFixed(1) + ' L ' + p0[0].toFixed(1) + ' ' + p0[1].toFixed(1) +
      ' A ' + R + ' ' + R + ' 0 ' + large + ' 1 ' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1) + ' Z';
  }
  function placeUse(el, xy, w, h) { el.setAttribute('x', (xy[0] - w / 2).toFixed(1)); el.setAttribute('y', (xy[1] - h / 2).toFixed(1)); }

  /* ---------- pieces 75 : 25 ---------- */
  var barO = q('.kp-bar-o'), barT = q('.kp-bar-t'), barBox = q('.kp-bar-box');
  var barBoxP = chain([[172, 689], [632, 689], [632, 737], [172, 737], [172, 689], [182, 688]], 16);
  var barDivP = ruled([517, 680], [517, 746], 6, 'bdiv', 0.4);

  /* ---------- the chart ---------- */
  var X = function (x) { return 360 + 940 * x; }, Y = function (y) { return 820 - 580 * y; };
  var f = function (x) { return 1 - Math.pow(1 - x, 2.4); };
  var axesP = [ruled([360, 842], [360, 196], 60, 'yaxis', 1.2), ruled([338, 820], [1372, 820], 80, 'xaxis', 1.2)];
  var heads = ink(seg([346, 216], [360, 194], 6), 4.2, 'yh1', 0.3) + ' ' + ink(seg([374, 216], [360, 194], 6), 4.2, 'yh2', 0.3) + ' ' +
              ink(seg([1352, 806], [1374, 820], 6), 4.2, 'xh1', 0.3) + ' ' + ink(seg([1352, 834], [1374, 820], 6), 4.2, 'xh2', 0.3);
  var ticks = [];
  [0.25, 0.5, 0.75, 1].forEach(function (v, i) {
    ticks.push(ink(seg([X(v), 820], [X(v), 834], 3), 3, 'tx' + i, 0.3));
    ticks.push(ink(seg([360, Y(v)], [346, Y(v)], 3), 3, 'ty' + i, 0.3));
  });
  var curvePts = []; for (var i = 0; i <= 160; i++) { var cx = i / 160; curvePts.push([X(cx), Y(f(cx))]); }
  var yLine = Y(0.5), yCurve = Y(f(0.5));
  var cpAxes = q('.cp-axes'), cpTicks = q('.cp-ticks'), reveal = q('.cp-reveal-r'), curve = q('.cp-curve'), arrow = q('.cp-arrow');
  var ptL = q('.cp-pt-line'), ptC = q('.cp-pt-curve');
  setAttr(ptL, 'cx', X(0.5)); setAttr(ptL, 'cy', yLine.toFixed(1)); setAttr(ptC, 'cx', X(0.5)); setAttr(ptC, 'cy', yCurve.toFixed(1));

  var els = {
    pg: q('.pg'), rc: q('.rc'), kp: q('.kp'), cp: q('.cp'), chip: q('.kp-chip'), chipA: q('.kp-chip-a'), chipB: q('.kp-chip-b'),
    nF: [q('.note-frank-a'), q('.note-frank-b')], nK: q('.note-kagan'), dlab: q('.kp-dlab'), plab: q('.kp-plab'), credit: q('.kp-credit'),
    exp: q('.cp-exp'), purer: q('.cp-purer'), stamp: q('.cp-stamp')
  };
  var start = null;
  ST.onSeek(function (t) {
    if (start === null) { var c = (ST.clips() || []).filter(function (c) { return c.id === SID; })[0]; if (!c) return; start = c.start; }
    var lt = clamp(t - start, 0, DUR), P = function (a, b) { return io(prog(lt, a, b)); };

    /* the recipe page, as shot-4 left it; box 2's tick */
    page({ uline: 1, rules: 1, box: [1, 1, 1], num: [1, 1, 1], txt: [1, 1, 1], tick: [1, P(2.45, 2.95), 0], lab: [1, 1, 1], src: 1, mirror: 0.38 });
    var turn1 = P(3.40, 3.90);
    els.pg.style.opacity = (1 - turn1).toFixed(3);
    els.pg.style.transform = 'translateY(calc(var(--u) * ' + (-46 * turn1).toFixed(2) + '))';
    els.nF.forEach(function (el) { el.style.opacity = '0'; });   // one margin note at a time: Kagan's replaces Frank's
    q('.pg-hl').setAttribute('width', (1200 * P(2.25, 2.85)).toFixed(1));
    fadeRise(els.nK, P(1.72, 2.08), 10);
    els.rc.style.opacity = P(3.70, 4.15).toFixed(3);

    /* 5a: the Kagan page */
    var turn2 = P(16.50, 16.95);
    els.kp.style.opacity = (1 - turn2).toFixed(3);
    els.kp.style.transform = 'translateY(calc(var(--u) * ' + (-46 * turn2).toFixed(2) + '))';
    els.kp.style.visibility = turn2 >= 1 ? 'hidden' : 'visible';

    var pd = P(4.32, 5.02);
    disc.setAttribute('d', ink(discP, 5, 'dsc', 0.03, pd));
    discFill.setAttribute('opacity', P(4.67, 5.02).toFixed(3));
    mLetter.setAttribute('opacity', P(4.95, 5.25).toFixed(3));
    var ps = P(6.22, 6.62), pp = P(6.50, 6.95);
    sticks.setAttribute('d', stickP.map(function (s, i) { return ink(s, 5, 'stk' + i, 0.1, ps); }).join(' '));
    slots.setAttribute('d', slotP.map(function (s, i) { return ink(s, 3.4, 'slt' + i, 0.03, pp); }).join(' '));
    slotFillTpl.setAttribute('opacity', P(6.60, 6.95).toFixed(3));
    fadeRise(els.dlab, P(6.75, 7.15), 10);
    els.dlab.style.transform = 'translateX(-50%) ' + els.dlab.style.transform;

    var e = P(14.62, 15.90);                     // re-split progress
    var dim = 1 - 0.18 * e;
    [7.85, 8.20, 8.55].forEach(function (a, i) {
      var p = P(a, a + 0.42);
      pairs[i].setAttribute('opacity', (p * dim).toFixed(3));
      pairs[i].setAttribute('transform', 'translate(0 ' + (14 * (1 - p)).toFixed(2) + ')');
    });
    // the pie
    var sw = P(8.74, 9.75), S = -90 + 360 * sw;
    var sO = lerp(56.25, 90, e), sG = lerp(37.5, 0, e), sT = 100 - sO - sG;
    var aO1 = -90 + 3.6 * sO, aG1 = aO1 + 3.6 * sG;
    var pull = 18 * P(9.66, 10.00) * (1 - P(14.62, 15.3)), gm = (aO1 + aG1) / 2, off = [Math.cos(rad(gm)) * pull, Math.sin(rad(gm)) * pull];
    wO.setAttribute('d', wedge(-90, Math.min(aO1, S), [0, 0]));
    wG.setAttribute('d', S > aO1 ? wedge(aO1, Math.min(aG1, S), off) : '');
    wT.setAttribute('d', S > aG1 ? wedge(aG1, Math.min(270, S), [0, 0]) : '');
    rim.setAttribute('d', ink(rimP, 4, 'rim', 0.01, sw) );
    placeUse(phO, polar((-90 + aO1) / 2, 128, [0, 0]), 46, 54);
    phO.setAttribute('opacity', P(9.0, 9.4).toFixed(3));
    placeUse(phT, polar((aG1 + 270) / 2, R + 44, [0, 0]), 46, 54);
    phT.setAttribute('opacity', P(9.55, 9.9).toFixed(3));
    // the mixed pair barely works: strike in ink (pie slice and its row)
    var stP = P(10.21, 10.60);
    var gc = polar(gm, 128, off);               // the grey slice's centre: one diagonal ink stroke through it
    strikePie.setAttribute('d', ink(ruled([gc[0] - 112, gc[1] + 104], [gc[0] + 82, gc[1] - 84], 24, 'spie', 1.5), 8, 'spi', 0.08, stP));
    strikePie.setAttribute('opacity', (1 - P(14.62, 15.0)).toFixed(3));
    strikeRow.setAttribute('d', ink(strikeRowP, 6, 'srw', 0.08, P(10.28, 10.66)));
    strikeRow.setAttribute('opacity', dim.toFixed(3));
    fadeRise(barely, P(10.35, 10.72) * dim, 8);
    // pieces 75 : 25
    barBox.setAttribute('d', ink(barBoxP, 3.4, 'bbx', 0.02, P(11.45, 11.90)) + ' ' + ink(barDivP, 3, 'bdv', 0.1, P(13.30, 13.50)));
    barO.setAttribute('width', (345 * P(12.45, 13.10)).toFixed(1));
    barT.setAttribute('width', (115 * P(13.30, 13.75)).toFixed(1));
    fadeRise(els.plab, P(12.55, 12.95), 10);
    fadeRise(els.credit, P(13.05, 13.45), 8);
    [13.60, 13.80, 14.00].forEach(function (a, i) { fadeRise(pct[i], P(a, a + 0.35) * dim, 10); });

    // the working catalysts 90 : 10, carried across the page turn to the chart page
    els.chip.style.opacity = lt >= 14.6 ? '1' : '0';
    els.chipA.style.opacity = P(14.62, 15.0).toFixed(3);
    els.chipB.style.opacity = P(15.55, 15.72).toFixed(3);
    var mv = P(16.50, 17.15), dx = 560 * mv, dy = -258 * mv, sc = 1 - 0.40 * mv;
    els.chip.style.transform = 'translate(calc(var(--u) * ' + dx.toFixed(2) + '), calc(var(--u) * ' + dy.toFixed(2) + ')) translateX(-50%) scale(' + sc.toFixed(4) + ')';

    /* 5b: the chart */
    els.cp.style.opacity = P(16.70, 17.00).toFixed(3);
    var pa = P(16.72, 17.30);
    cpAxes.setAttribute('d', ink(axesP[0], 5, 'ya', 0.05, pa) + ' ' + ink(axesP[1], 5, 'xa', 0.05, pa) + (pa >= 1 ? ' ' + heads : ''));
    cpTicks.setAttribute('d', pa >= 1 ? ticks.join(' ') : '');
    curve.setAttribute('d', ink(curvePts, 9, 'kagan-curve', 0.04, P(17.00, 17.85)));
    fadeRise(els.purer, P(17.65, 18.05), 10);
    fadeRise(els.stamp, P(17.55, 17.95), 10);
    reveal.setAttribute('width', (1000 * P(18.95, 19.57)).toFixed(1));
    els.exp.style.opacity = P(19.23, 19.63).toFixed(3);
    var pv = P(19.40, 19.62);
    ptL.setAttribute('opacity', pv.toFixed(3)); ptC.setAttribute('opacity', pv.toFixed(3));
    var ap = P(19.50, 20.00), tip = (yLine - 14) - ((yLine - 14) - (yCurve + 16)) * ap;
    arrow.setAttribute('d', ap <= 0 ? '' : ink(seg([X(0.5), yLine - 14], [X(0.5), tip + 12], 12), 4.5, 'arrow', 0.15) +
      ' M ' + X(0.5).toFixed(1) + ' ' + (tip - 2).toFixed(1) + ' L ' + (X(0.5) - 11).toFixed(1) + ' ' + (tip + 17).toFixed(1) +
      ' L ' + (X(0.5) + 11).toFixed(1) + ' ' + (tip + 17).toFixed(1) + ' Z');
  });
})();
