/* shot-3 the ghost particle: neutrinos stream through the block of ice untouched, drawn from scene time.
   Pure function of time: positions are closed-form from a seeded table; nothing is kept between frames. */
(function () {
  var SID = 'shot-3';
  var sec = document.getElementById(SID);
  if (!sec || !window.ST) return;
  var cv = sec.querySelector('.s3-canvas');
  var ctx = cv.getContext('2d');
  // block geometry (frame px): front face 900-1380 x 260-740, depth offset (+230, -150)
  var FX0 = 900, FY0 = 260, S = 480, DX = 230, DY = -150;
  var X0 = 700, X1 = 1900, L = X1 - X0;
  var r = ST.rand('s3-neutrinos');
  var P = [];
  var N = 44;   // lanes stratified top to bottom so the stream fills the whole block
  for (var i = 0; i < N; i++) {
    P.push({ v: 0.05 + 0.9 * (i + r()) / N, d: r.range(0, 1), speed: r.range(520, 820), ph: r.range(0, L * 1.6),
             len: r.range(70, 120), a: r.range(0.55, 0.9), cyan: r() < 0.5 });
  }
  function streak(x, y, len, rad, col, alpha, glow) {
    var g = ctx.createLinearGradient(x - len, y, x, y);
    g.addColorStop(0, 'rgba(' + col + ',0)');
    g.addColorStop(1, 'rgba(' + col + ',' + (alpha * 0.9).toFixed(3) + ')');
    ctx.strokeStyle = g; ctx.lineWidth = rad * 1.1; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x - len, y); ctx.lineTo(x, y); ctx.stroke();
    ctx.shadowColor = 'rgba(' + col + ',' + alpha.toFixed(3) + ')'; ctx.shadowBlur = glow;
    ctx.fillStyle = 'rgba(234,248,255,' + alpha.toFixed(3) + ')';
    ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
  }
  function edgeFade(x) { return Math.min(1, Math.max(0, (x - X0) / 140), Math.max(0, (X1 - x) / 140)); }
  function draw(lt) {
    ctx.clearRect(0, 0, 1920, 1080);
    var CY = '88,225,255', BL = '88,169,255';
    for (var i = 0; i < P.length; i++) {
      var p = P[i];
      var u = (p.ph + lt * p.speed) % (L * 1.6);   // a gap in each lane between passes
      if (u > L) continue;
      var x = X0 + u + p.d * DX, y = FY0 + p.v * S + p.d * DY;
      var f = edgeFade(X0 + u);
      if (f <= 0) continue;
      streak(x, y, p.len, 3.4, p.cyan ? CY : BL, p.a * f, 10);
    }
    // the named neutrino: enters as it is said (3.20 s), crosses the whole block, leaves untouched
    var t0 = 3.20, t1 = 6.7;
    if (lt >= t0 && lt <= t1 + 0.1) {
      var q = ST.ease.inOutSine(ST.clamp((lt - t0) / (t1 - t0), 0, 1));
      var hx = 760 + q * (X1 - 760) + 0.5 * DX * 0, hy = FY0 + 0.52 * S + 0.5 * DY;
      var fa = Math.min(1, (lt - t0) / 0.25) * Math.min(1, Math.max(0, (X1 - hx) / 160));
      streak(hx, hy, 190, 7, CY, 0.95 * fa, 26);
    }
  }
  var win = null;
  ST.onSeek(function (t) {
    if (!win) { var cs = ST.clips(); for (var k = 0; k < cs.length; k++) if (cs[k].id === SID) win = cs[k]; }
    if (!win) return;
    if (t < win.start || (win.end !== null && t >= win.end)) return;
    draw(t - win.start);
  });
})();
