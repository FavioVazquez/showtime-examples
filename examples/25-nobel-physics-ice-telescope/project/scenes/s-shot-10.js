/* shot-10: the counter (about 100,000 a year, claim P17) and the jar of 1,000 identical dots (one dot = 100).
   Pure function of scene time; the dot layout is a seeded table built once. */
(function () {
  var SID = 'shot-10';
  var sec = document.getElementById(SID);
  if (!sec || !window.ST) return;
  var num = sec.querySelector('.s10-count');
  var cv = sec.querySelector('.s10-dots'), ctx = cv.getContext('2d');
  // 1,000 dots, hex-packed in the jar body (x 1140-1660, from y 790 up)
  var D = [], r = ST.rand('s10-jar'), sp = 16.2, cols = 32, row = 0;
  while (D.length < 1000) {
    for (var c = 0; c < cols && D.length < 1000; c++) {
      D.push({ x: 1146 + c * sp + (row % 2 ? sp / 2 : 0) + r.range(-1.6, 1.6), y: 786 - row * sp * 0.866 + r.range(-1.6, 1.6),
               k: r.range(0, 1) });
    }
    row++;
  }
  var C0 = 1.46, C1 = 2.60;   // the count runs over "about a hundred thousand"
  function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function draw(lt) {
    var p = ST.ease.outCubic(ST.clamp((lt - C0) / (C1 - C0), 0, 1));
    var n = Math.round(p * 100) * 1000;
    var s = fmt(n);
    if (num.textContent !== s) num.textContent = s;
    ctx.clearRect(0, 0, 1920, 1080);
    ctx.fillStyle = 'rgba(88,169,255,0.9)';
    ctx.shadowColor = 'rgba(88,169,255,0.55)'; ctx.shadowBlur = 6;
    // the jar is full from frame 0; every dot the same colour and size
    ctx.beginPath();
    for (var i = 0; i < D.length; i++) { ctx.moveTo(D[i].x + 5.6, D[i].y); ctx.arc(D[i].x, D[i].y, 5.6, 0, Math.PI * 2); }
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  var win = null;
  ST.onSeek(function (t) {
    if (!win) { var cs = ST.clips(); for (var k = 0; k < cs.length; k++) if (cs[k].id === SID) win = cs[k]; }
    if (!win) return;
    if (t < win.start || (win.end !== null && t >= win.end)) return;
    draw(t - win.start);
  });
})();
