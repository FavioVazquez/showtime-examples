/* shot-8: the answer to q2. Our toy model's median aim error (Pandel fit) versus string spacing,
 * 125 m and 250 m marked, the ratio highlighted. Scene-relative times; a pure function of time. */
(function () {
  'use strict';
  // ================= every number this scene uses =================
  var C = {
    sid: 'shot-8',
    // our toy model, results/telescope_summary.json (nobel-phys-telescope 2026/physics/telescope,
    // status "final", read 2026-10-06 11:05): spacings_m, median_error_deg.pandel, median_hits
    spacings: [50, 80, 125, 160, 200, 250, 300],
    medianDeg: [0.179,  0.313,  0.713,  1.302,  2.107,  4.023,  7.128],
    nStrings: [463, 187, 73, 43, 31, 19, 13],   // strings in the same 1 km2 patch (n_strings)
    medianHits: [361.0,  144.0,  56.0,  33.0,  23.0,  15.0,  12.0],
    near: 125, far: 250,             // the two spacings compared (twice as far apart)
    // chart frame (SVG user units = px)
    x: [25, 325], y: [0, 8], yTicks: [0, 2, 4, 6, 8],
    plot: { l: 110, r: 1170, t: 20, b: 440 },
    // beats, scene seconds, from crew/cues-shot-8.txt
    draw: [0.34, 1.5],               // "In our toy model"               // "In our toy model"
    mkNear: 0.90, mkFar: 1.28,       // "model," / "about"
    ratio: 1.69,                     // "five" (the number shown is computed from the data above)
    hitsK: 3.20, hitsV: 4.09,         // "fewer strings, less light"
    caveat: 5.03,                    // "Trend only"
  };
  // ================================================================
  var iN = C.spacings.indexOf(C.near), iF = C.spacings.indexOf(C.far);
  var ratio = C.medianDeg[iF] / C.medianDeg[iN];

  var sec = document.getElementById(C.sid);
  var q = function (s) { return sec.querySelector(s); };
  var svg = q('.s8-chart'), NS = 'http://www.w3.org/2000/svg';
  function mk(tag, attrs, parent, text) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (text != null) e.textContent = text;
    (parent || svg).appendChild(e); return e;
  }
  var P = C.plot;
  function X(v) { return P.l + (v - C.x[0]) / (C.x[1] - C.x[0]) * (P.r - P.l); }
  function Y(v) { return P.b - (v - C.y[0]) / (C.y[1] - C.y[0]) * (P.b - P.t); }
  function fmtN(v) { return v % 1 ? v.toFixed(1) : String(v); }
  function deg(v) { return (v < 1 ? v.toFixed(2) : v.toFixed(1)) + '°'; }

  // axes and ticks
  C.yTicks.forEach(function (v) {
    mk('line', { class: v === 0 ? 'axis' : 'grid', x1: P.l, x2: P.r, y1: Y(v), y2: Y(v) });
    mk('text', { class: 'tick', x: P.l - 18, y: Y(v) + 10, 'text-anchor': 'end' }, null, v + '°');
  });
  C.spacings.forEach(function (v) {
    var hot = v === C.near || v === C.far;
    mk('text', { class: hot ? 'mk-x' : 'tick', x: X(v), y: P.b + 46, 'text-anchor': 'middle' }, null, String(v));
  });
  mk('text', { class: 'axis-t', x: (P.l + P.r) / 2, y: P.b + 100, 'text-anchor': 'middle' }, null, 'Distance between strings (m)');

  // the curve, drawn on with a dash; dots appear as it passes
  var d = C.spacings.map(function (s, i) { return (i ? 'L' : 'M') + X(s).toFixed(1) + ' ' + Y(C.medianDeg[i]).toFixed(1); }).join(' ');
  var curve = mk('path', { class: 'curve', d: d, pathLength: 1, 'stroke-dasharray': '1 1', 'stroke-dashoffset': 1 });
  var x0 = X(C.spacings[0]), x1 = X(C.spacings[C.spacings.length - 1]);
  var dots = C.spacings.map(function (s, i) { return [mk('circle', { class: 'dot', cx: X(s), cy: Y(C.medianDeg[i]), r: 7 }), (X(s) - x0) / (x1 - x0)]; });

  // markers at the two spacings
  function marker(i, side) {
    var gEl = mk('g', {});
    mk('line', { class: 'mk-guide', x1: X(C.spacings[i]), x2: X(C.spacings[i]), y1: P.b, y2: Y(C.medianDeg[i]) + 16 }, gEl);
    mk('circle', { class: 'mk-dot', cx: X(C.spacings[i]), cy: Y(C.medianDeg[i]), r: 14 }, gEl);
    mk('text', { class: 'mk-val', x: X(C.spacings[i]) + side * 26, y: Y(C.medianDeg[i]) - 22, 'text-anchor': side > 0 ? 'start' : 'end' }, gEl, deg(C.medianDeg[i]));
    mk('text', { class: 'mk-n', x: X(C.spacings[i]) + side * 26, y: Y(C.medianDeg[i]) - 72, 'text-anchor': side > 0 ? 'start' : 'end' }, gEl, C.spacings[i] + ' m: ' + C.nStrings[i] + ' strings');
    return gEl;
  }
  var mN = marker(iN, -1), mF = marker(iF, -1);
  // the ratio bracket: from the 125 m level to the 250 m level, right of the 250 m point
  var bx = X(C.far) + 34, yN = Y(C.medianDeg[iN]), yF = Y(C.medianDeg[iF]);
  var br = mk('path', { class: 'bracket', d: 'M' + (X(C.near) + 20) + ' ' + yN + ' L' + bx + ' ' + yN + ' L' + bx + ' ' + (yF + 4), pathLength: 1, 'stroke-dasharray': '1 1', 'stroke-dashoffset': 1 });

  q('.s8-ratio').innerHTML = ratio.toFixed(1) + 'x<small>worse aim</small>';
  q('.s8-ratio-k').innerHTML = 'Twice the spacing:<br>' + C.near + ' m to ' + C.far + ' m';
  q('.s8-h1').textContent = fmtN(C.medianHits[iN]) + ' at ' + C.near + ' m';
  q('.s8-h2').textContent = fmtN(C.medianHits[iF]) + ' at ' + C.far + ' m';

  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
  function seg(t, a, b) { return clamp((t - a) / (b - a), 0, 1); }
  function out(p) { return 1 - Math.pow(1 - p, 3); }
  function inOut(p) { return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; }
  function show(node, lt, a, rise) {
    var i = out(seg(lt, a, a + 0.3));
    node.style.opacity = i.toFixed(3);
    node.style.transform = 'translateY(' + ((1 - i) * (rise == null ? 24 : rise)).toFixed(2) + 'px)';
  }
  var side = { k: q('.s8-ratio-k'), r: q('.s8-ratio'), hk: q('.s8-hits-k'), hv: q('.s8-hits-v'), cav: q('.s8-caveat') };

  var clip = null;
  ST.onSeek(function (t) {
    if (!clip) clip = ST.clips().filter(function (c) { return c.id === C.sid; })[0];
    if (!clip) return;
    if (t < clip.start - 1e-6 || (clip.end != null && t >= clip.end)) return;
    var lt = t - clip.start;
    var p = inOut(seg(lt, C.draw[0], C.draw[1]));
    curve.setAttribute('stroke-dashoffset', (1 - p).toFixed(4));
    dots.forEach(function (dt) { dt[0].style.opacity = String(seg(p, dt[1] - 0.02, dt[1] + 0.02)); });
    [[mN, C.mkNear], [mF, C.mkFar]].forEach(function (m) {
      var a = out(seg(lt, m[1], m[1] + 0.45));
      m[0].style.opacity = a.toFixed(3);
    });
    br.setAttribute('stroke-dashoffset', (1 - inOut(seg(lt, C.ratio - 0.1, C.ratio + 0.5))).toFixed(4));
    show(side.k, lt, C.ratio - 0.15);
    show(side.r, lt, C.ratio);
    show(side.hk, lt, C.hitsK);
    show(side.hv, lt, C.hitsV);
    show(side.cav, lt, C.caveat, -16);
  });
})();
