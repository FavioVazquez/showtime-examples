/* shot-4 the answer. The one number the director may change after the review: */
var S4_ONE_IN = 65000;   // final toy number (isoscalar fix): kilometre_summary.json one_in_N_100TeV = 65400 -> "about 1 in 65,000"
/* Curve: interaction_chance_1km.csv, column p_mean (nu and nubar mean), our toy model
   (nobel-2026-lab: 2026/physics/kilometre/results/). Drawn once at load. */
(function () {
  var sec = document.getElementById('shot-4');
  if (!sec) return;
  sec.querySelector('.s4-k1').textContent = '1 in ' + String(S4_ONE_IN).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  var E = [1000,1259,1585,1995,2512,3162,3981,5012,6310,7943,1e4,1.259e4,1.585e4,1.995e4,2.512e4,3.162e4,3.981e4,5.012e4,
    6.31e4,7.943e4,1e5,1.259e5,1.585e5,1.995e5,2.512e5,3.162e5,3.981e5,5.012e5,6.31e5,7.943e5,1e6,1.259e6,1.585e6,1.995e6,
    2.512e6,3.162e6,3.981e6,5.012e6,6.31e6,7.943e6,1e7];
  var PM = [3.7116e-07,4.6211e-07,5.7444e-07,7.1278e-07,8.8230e-07,1.0892e-06,1.3405e-06,1.6438e-06,2.0078e-06,2.4419e-06,2.9563e-06,3.5620e-06,4.2707e-06,5.0943e-06,6.0461e-06,7.1396e-06,8.3903e-06,9.8137e-06,1.1426e-05,1.3247e-05,1.5295e-05,1.7591e-05,2.0159e-05,2.3024e-05,2.6213e-05,2.9756e-05,3.3684e-05,3.8032e-05,4.2839e-05,4.8144e-05,5.3992e-05,6.0429e-05,6.7505e-05,7.5275e-05,8.3800e-05,9.3140e-05,1.0336e-04,1.1455e-04,1.2676e-04,1.4009e-04,1.5463e-04];
  // plot box (frame px): x 430-1120, y 200-760; log10 E 3..7 (GeV), log10 p -6.6..-3.7
  var PX0 = 430, PX1 = 1120, PY0 = 200, PY1 = 760, LX0 = 3, LX1 = 7, LY0 = -6.6, LY1 = -3.7;
  function X(e) { return PX0 + (Math.log10(e) - LX0) / (LX1 - LX0) * (PX1 - PX0); }
  function Y(p) { return PY1 - (Math.log10(p) - LY0) / (LY1 - LY0) * (PY1 - PY0); }
  var ns = 'http://www.w3.org/2000/svg', grid = sec.querySelector('.s4-grid'), ticks = sec.querySelector('.s4-ticks');
  function line(x1, y1, x2, y2, cls) {
    var l = document.createElementNS(ns, 'line');
    l.setAttribute('x1', x1); l.setAttribute('y1', y1); l.setAttribute('x2', x2); l.setAttribute('y2', y2);
    if (cls) l.setAttribute('class', cls);
    grid.appendChild(l);
  }
  function label(text, x, y, cls) {
    var p = document.createElement('p');
    p.className = cls; p.textContent = text;
    p.style.left = (x / 19.2).toFixed(3) + 'cqw'; p.style.top = (y / 10.8).toFixed(3) + 'cqh';
    ticks.appendChild(p);
  }
  [[1e-6, '1 in 1,000,000'], [1e-5, '1 in 100,000'], [1e-4, '1 in 10,000']].forEach(function (k) {
    var y = Y(k[0]); line(PX0, y, PX1, y); label(k[1], PX0 - 20 - 268.8, y - 15, 'y');
  });
  [[1e3, '1 TeV'], [1e4, '10 TeV'], [1e5, '100 TeV'], [1e6, '1 PeV'], [1e7, '10 PeV']].forEach(function (k) {
    var x = X(k[0]); line(x, PY1, x, PY1 + 14, 'axis'); label(k[1], x - 96, PY1 + 28, k[0] === 1e5 ? 'x hot' : 'x');
  });
  line(PX0, PY1, PX1 + 10, PY1, 'axis'); line(PX0, PY0 - 10, PX0, PY1, 'axis');
  var d = '';
  for (var i = 0; i < E.length; i++) d += (i ? ' L' : 'M') + X(E[i]).toFixed(1) + ' ' + Y(PM[i]).toFixed(1);
  sec.querySelector('.s4-curve').setAttribute('d', d);
  sec.querySelector('.s4-area').setAttribute('d', d + ' L' + PX1 + ' ' + PY1 + ' L' + PX0 + ' ' + PY1 + ' Z');
  var mx = X(1e5), my = Y(PM[E.indexOf(1e5)]);   // the CSV's own 100 TeV point (p_mean 1.5295e-05)
  var m = sec.querySelector('.s4-mark');
  m.setAttribute('x1', mx); m.setAttribute('x2', mx); m.setAttribute('y1', PY1); m.setAttribute('y2', my);
  ['.s4-dot', '.s4-halo'].forEach(function (s) { var c = sec.querySelector(s); c.setAttribute('cx', mx); c.setAttribute('cy', my); });
})();
