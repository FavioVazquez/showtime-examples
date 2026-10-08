/* shot-4 "Frank's recipe": a pure function of scene-local time (ST.onSeek). Beats (scene-relative, cues-shot-4.txt):
   heading complete at frame 0; underline on "nineteen fifty-three" 0.45; margin note on "Charles" 1.69;
   writing lines on "recipe" 2.69; the mirror hand fades back on "one hand to take over" 3.36-4.36;
   box 1 on "One:" 5.49, its line from "a one-handed" 6.18; tick 1 on "early" 9.00 with "early 1900s" on "nineteen" 9.30;
   box 2 on "Two:" 10.79, line from "boost" 11.42; box 3 on "Three:" 13.91, line from "a reaction" 14.73;
   "Kagan, 1986" 16.20 and "Soai, 1995" 16.55 (late, after the last word "catalyst." 16.06). Facts: F1, F2. */
(function () {
  var SID = 'shot-4', DUR = 17.918;
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

  var noteA = q('.note-frank-a'), noteB = q('.note-frank-b');
  var start = null;
  ST.onSeek(function (t) {
    if (start === null) { var c = (ST.clips() || []).filter(function (c) { return c.id === SID; })[0]; if (!c) return; start = c.start; }
    var lt = clamp(t - start, 0, DUR), P = function (a, b) { return io(prog(lt, a, b)); };
    page({
      uline: P(0.40, 1.30), rules: P(2.60, 3.50),
      box: [P(5.40, 5.95), P(10.70, 11.25), P(13.82, 14.37)],
      num: [P(5.49, 5.80), P(10.79, 11.10), P(13.91, 14.22)],
      txt: [prog(lt, 6.15, 7.15), prog(lt, 11.40, 13.10), prog(lt, 14.70, 16.25)],
      tick: [P(9.00, 9.45), 0, 0],
      lab: [P(9.30, 9.70), P(16.20, 16.60), P(16.55, 16.95)],
      src: P(6.40, 6.85),
      mirror: 1 - 0.62 * P(3.36, 4.40)
    });
    fadeRise(noteA, P(1.66, 2.02), 10);
    fadeRise(noteB, P(1.95, 2.32), 10);
  });
})();
