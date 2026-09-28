// scenes.js: drawings computed from time (the redrawn summit cross-section, the rift schematic, the date
// ruler, the credit line). Every value is a pure function of t, so any frame renders on its own.
(function () {
  var CUE = window.CUE || {}, S = CUE._starts || {};
  var clamp = function (x, a, b) { return Math.min(b == null ? 1 : b, Math.max(a || 0, x)); };
  var outCubic = function (p) { return 1 - Math.pow(1 - p, 3); };
  var inOut = function (p) { return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; };
  var seg = function (lt, a, d, e) { return (e || outCubic)(clamp((lt - a) / d)); };
  var NS = 'http://www.w3.org/2000/svg';
  var mk = function (tag, attrs, parent, text) {
    var el = document.createElementNS(NS, tag);
    for (var k in attrs) el.setAttribute(k, attrs[k]);
    if (text != null) el.textContent = text;
    if (parent) parent.appendChild(el);
    return el;
  };
  var c = function (name, fb) { return CUE[name] != null ? CUE[name] : fb; };

  // ---------------------------------------------------------------------------------------------
  // Summit cross-section, REDRAWN from the USGS figure on page 2 of the PDF (points read off the
  // printed figure; east-west distance in m, elevation above sea level in m). Not survey data.
  var APR = [[0,1170],[150,1165],[500,1170],[539,1165],[570,1135],[915,1130],[978,1057],[1056,1050],[1808,1050],[1903,1125],[2498,1110],[3380,1102],[3705,1100]];
  var AUG = [[0,1170],[150,1165],[500,1170],[539,1165],[617,1076],[712,1037],[931,910],[1119,789],[1229,670],[1370,640],[1527,543],[1621,560],[1809,672],[2028,860],[2122,934],[2498,955],[2968,977],[3282,1035],[3329,1097],[3380,1102],[3705,1100]];
  var X0 = 120, X1 = 1110, Y0 = 70, Y1 = 640;
  var sx = function (m) { return X0 + m / 3800 * (X1 - X0); };
  var sy = function (e) { return Y0 + (1400 - e) / 1000 * (Y1 - Y0); };
  var pts = function (a) { return a.map(function (p) { return sx(p[0]).toFixed(1) + ',' + sy(p[1]).toFixed(1); }).join(' '); };
  var xs = document.getElementById('xs-svg'), xsEls = null;
  if (xs) {
    var g = mk('g', {}, xs);
    for (var e = 400; e <= 1400; e += 200) {
      mk('line', { class: 'grid', x1: X0, x2: X1, y1: sy(e), y2: sy(e) }, g);
      mk('text', { class: 'tl', x: X0 - 14, y: sy(e) + 8, 'text-anchor': 'end' }, g, String(e));
    }
    for (var m = 0; m <= 3000; m += 1000) mk('text', { class: 'tl', x: sx(m), y: Y1 + 34, 'text-anchor': 'middle' }, g, (m / 1000) + ' km');
    mk('path', { class: 'axis', d: 'M' + X0 + ' ' + Y0 + ' V' + Y1 + ' H' + X1 }, g);
    mk('text', { class: 'al', x: X0, y: Y1 + 76 }, g, 'east-west distance');
    mk('text', { class: 'al', x: 22, y: Y0 - 40 }, g, 'elevation (m)');
    var gone = mk('polygon', { class: 'gone', points: pts(APR) + ' ' + pts(AUG.slice().reverse()) }, xs);
    var apr = mk('polyline', { class: 'apr', points: pts(APR), pathLength: 1, 'stroke-dasharray': '1 1' }, xs);
    var aug = mk('polyline', { class: 'aug', points: pts(AUG), pathLength: 1, 'stroke-dasharray': '1 1' }, xs);
    var arrows = [1250, 1527, 1800].map(function (d) {
      var top = sy(1050) + 10, bot = sy(d === 1527 ? 543 : d === 1250 ? 660 : 672) - 14;
      return mk('path', { class: 'arrow', d: 'M' + sx(d) + ' ' + top + ' V' + bot + ' M' + (sx(d) - 10) + ' ' + (bot - 14) + ' L' + sx(d) + ' ' + bot + ' L' + (sx(d) + 10) + ' ' + (bot - 14) }, xs);
    });
    var la = mk('text', { class: 'lbl-apr', x: sx(40), y: sy(1170) - 26 }, xs, 'April 2018');
    var lg = mk('text', { class: 'lbl-aug', x: sx(2200), y: sy(900) + 6 }, xs, 'August 2018');
    var dropG = mk('g', {}, xs);
    mk('text', { class: 'drop', x: sx(1800), y: sy(560) + 10 }, dropG, '500+ m drop');
    mk('text', { class: 'drop2', x: sx(1800), y: sy(560) + 48 }, dropG, '(1,600+ ft) at the deepest point');
    xsEls = { apr: apr, aug: aug, gone: gone, arrows: arrows, la: la, lg: lg, dropG: dropG };
  }

  // ---------------------------------------------------------------------------------------------
  // Date ruler: Apr 30 (day 0) to Sept 22 (day 145), 2018. The video's spine.
  var DAYS = { 'APR 30': 0, 'MAY 3': 3, 'MAY 4': 4, 'MAY 16': 16, 'MAY 29': 29, 'JUNE 3': 34, 'AUG 4': 96, 'SEPT 22': 145 };
  var MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUNE', 'JULY', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'];
  var pct = function (d) { return (d / 145 * 100).toFixed(3) + '%'; };
  function ruler(el, ticks, labels) {
    if (!el) return null;
    el.innerHTML = '';
    var track = document.createElement('div'); track.className = 'track'; el.appendChild(track);
    var fill = document.createElement('div'); fill.className = 'fill'; fill.style.width = '100%'; el.appendChild(fill);
    var tk = ticks.map(function (name) {
      var d = document.createElement('div'); d.className = 'tick'; d.style.left = pct(DAYS[name]); el.appendChild(d); return { name: name, el: d };
    });
    var lb = labels.map(function (l) {
      var d = document.createElement('div'); d.className = 'lab' + (l.up ? ' up' : ''); d.textContent = l.text;
      d.style.left = pct(l.day); if (l.align === 'start') d.style.transform = 'none'; if (l.align === 'end') d.style.transform = 'translateX(-100%)';
      el.appendChild(d); return { el: d, at: l.at || 0 };
    });
    var pulse = document.createElement('div'); pulse.className = 'pulse'; pulse.style.left = pct(145); el.appendChild(pulse);
    var head = document.createElement('div'); head.className = 'head'; el.appendChild(head);
    var hl = document.createElement('div'); hl.className = 'headlab'; el.appendChild(hl);
    return { fill: fill, ticks: tk, labels: lb, pulse: pulse, head: head, hl: hl };
  }
  var rs = ruler(document.getElementById('ruler-start'), ['APR 30', 'MAY 3', 'MAY 4', 'SEPT 22'], [
    { text: 'APR 30 TO MAY 4', day: 0, up: true, align: 'start' },
    { text: 'SEPT 22', day: 145, align: 'end' },
  ]);
  var re = ruler(document.getElementById('ruler-end'), ['APR 30', 'MAY 4', 'MAY 29', 'JUNE 3', 'AUG 4', 'SEPT 22'], [
    { text: 'APR 30', day: 0, align: 'start' },
    { text: 'MAY 29', day: 29 },
    { text: 'JUNE 3', day: 34, up: true },
  ]);

  // rift schematic
  var flow = document.getElementById('flow'), lerz = document.getElementById('n-lerz'), ring = document.getElementById('n-ring');
  var puu = document.getElementById('n-puu'), downrift = document.getElementById('downrift'), rift = document.querySelector('#start .rift');
  var credit = document.getElementById('credit');
  var summitKick = document.querySelector('#summit .kick');
  if (summitKick) summitKick.style.animation = 'none';
  var summitText = Array.prototype.slice.call(document.querySelectorAll('#summit .facts, #summit .src, #xs-svg .tl, #xs-svg .al'));
  var callAug = document.getElementById('call-aug'), callSep = document.getElementById('call-sep');
  if (callAug) { callAug.style.left = 'calc(6cqw + 88cqw * ' + (96 / 145).toFixed(4) + ' - 30cqw)'; callAug.style.textAlign = 'right'; callAug.style.width = '30cqw'; }
  if (callSep) { callSep.style.right = '6cqw'; callSep.style.top = '57cqh'; callSep.style.textAlign = 'right'; }

  ST.onSeek(function (t) {
    // --- start scene
    if (rs && S.start != null) {
      var lt = t - S.start;
      var f = 0;
      if (lt >= c('s1', 1)) f = 0; // Apr 30 is day 0
      f = 3 * seg(lt, c('s2', 3), 0.5) + 1 * seg(lt, c('s3', 6), 0.4);
      rs.fill.style.transform = 'scaleX(' + (f / 145).toFixed(5) + ')';
      rs.fill.style.opacity = lt >= c('s1', 1) ? '1' : '0';
      rs.ticks.forEach(function (k) {
        var on = (k.name === 'APR 30' && lt >= c('s1', 1)) || (k.name === 'MAY 3' && lt >= c('s2', 3)) || (k.name === 'MAY 4' && lt >= c('s3', 6));
        k.el.classList.toggle('on', on);
      });
      if (flow) flow.setAttribute('stroke-dashoffset', (1 - seg(lt, c('s1', 1) + 0.3, 2.2, inOut)).toFixed(4));
      if (downrift) downrift.style.opacity = seg(lt, c('s1', 1) + 0.4, 0.5).toFixed(3);
      if (puu) puu.classList.toggle('hot', lt >= c('s1', 1));
      if (lerz) lerz.classList.toggle('hot', lt >= c('s2', 3));
      if (ring) {
        var q = lt - c('s2', 3);
        var p = q >= 0 ? (q % 1.4) / 1.4 : 0;
        ring.setAttribute('r', (18 + p * 46).toFixed(1));
        ring.style.opacity = q >= 0 ? ((1 - p) * 0.8).toFixed(3) : '0';
      }
      if (rift) {
        var k3 = lt - c('s3', 6);
        var amp = k3 >= 0 && k3 < 0.9 ? (1 - k3 / 0.9) * 0.45 : 0;
        rift.style.transform = amp ? 'translate(' + (Math.sin(k3 * 55) * amp).toFixed(3) + 'cqh,' + (Math.cos(k3 * 43) * amp * 0.6).toFixed(3) + 'cqh)' : '';
      }
    }
    // --- summit cross-section
    if (xsEls && S.summit != null) {
      var ls = t - S.summit;
      xsEls.apr.setAttribute('stroke-dashoffset', (1 - seg(ls, 0.25, 1.1, inOut)).toFixed(4));
      var r0 = c('summit-sank', 1.2);
      xsEls.aug.setAttribute('stroke-dashoffset', (1 - seg(ls, r0, 1.9, inOut)).toFixed(4));
      xsEls.gone.style.opacity = seg(ls, r0 + 1.4, 0.8).toFixed(3);
      xsEls.arrows.forEach(function (a, i) { a.style.opacity = seg(ls, r0 + 1.9 + i * 0.12, 0.35).toFixed(3); });
      // labels leave before the shader window into fissure 8 (a WebGL transition smears text)
      var lab = S.fissure8 != null ? 1 - seg(t, S.fissure8 - 0.4, 0.35) : 1;
      xsEls.dropG.style.opacity = (seg(ls, r0 + 2.3, 0.45) * lab).toFixed(3);
      xsEls.la.style.opacity = (seg(ls, 0.9, 0.4) * lab).toFixed(3);
      xsEls.lg.style.opacity = (seg(ls, r0 + 1.6, 0.4) * lab).toFixed(3);
      summitText.forEach(function (el) { el.style.opacity = lab.toFixed(3); });
      if (summitKick) summitKick.style.opacity = (seg(ls, 0.1, 0.5) * lab).toFixed(3);
    }
    // --- end ruler
    if (re && S.end != null) {
      var le = t - S.end;
      var ca = c('end-aug', 0.4), cs = c('end-sep', 2.8);
      // to Aug 4 as it is named, then time keeps creeping on toward Sept 22, which lands as it is named
      var fe = 96 * seg(le, 0.1, Math.max(0.6, ca + 0.4), inOut) + 40 * seg(le, ca + 0.6, Math.max(0.5, cs - ca - 0.6), function (p) { return p; }) + 9 * seg(le, cs, 0.6, inOut);
      re.fill.style.transform = 'scaleX(' + (fe / 145).toFixed(5) + ')';
      re.ticks.forEach(function (k) { k.el.classList.toggle('on', DAYS[k.name] <= fe + 0.01); });
      // the fill's head carries the calendar date it has reached (day 0 = Apr 30, 2018)
      var day = Math.round(fe), dt = new Date(Date.UTC(2018, 3, 30 + day));
      re.head.style.left = pct(fe); re.hl.style.left = pct(fe);
      re.head.style.display = re.hl.style.display = le > 0.1 && fe < 144.5 ? '' : 'none';
      re.hl.textContent = MONTHS[dt.getUTCMonth()] + ' ' + dt.getUTCDate();
      var qp = le - c('end-sep', 2.8) - 0.7;
      var pp = qp >= 0 ? (qp % 1.5) / 1.5 : 0;
      re.pulse.style.opacity = qp >= 0 ? ((1 - pp) * 0.9).toFixed(3) : '0';
      re.pulse.style.transform = 'scale(' + (1 + pp * 5).toFixed(3) + ')';
    }
    // --- credit line: from the end scene to the last frame
    if (credit && S.end != null) {
      var o = seg(t - S.end, 0.2, 0.6);
      credit.style.opacity = o.toFixed(3);
      credit.style.visibility = o > 0 ? 'visible' : 'hidden';
    }
  });
})();
