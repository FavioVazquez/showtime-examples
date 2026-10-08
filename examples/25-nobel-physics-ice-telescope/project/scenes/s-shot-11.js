/* shot-11: the same 1,000 dots as shot-10 (same seed and packing); one turns the accent colour on "a hundred" (0.75 s),
   the rest dim on "the rest are made in our own atmosphere" (3.87 s). Pure function of scene time. */
(function () {
  var SID = 'shot-11';
  var sec = document.getElementById(SID);
  if (!sec || !window.ST) return;
  var cv = sec.querySelector('.s11-dots'), ctx = cv.getContext('2d');
  var D = [], r = ST.rand('s10-jar'), sp = 16.2, cols = 32, row = 0;
  while (D.length < 1000) {
    for (var c = 0; c < cols && D.length < 1000; c++) {
      D.push({ x: 1146 + c * sp + (row % 2 ? sp / 2 : 0) + r.range(-1.6, 1.6), y: 786 - row * sp * 0.866 + r.range(-1.6, 1.6),
               k: r.range(0, 1) });
    }
    row++;
  }
  var G = 12 * cols + 13;   // the revealed one: row 12, column 13, inside the pack, clear of the glass
  var TG = 0.70, TD = 3.85;
  var AC = null;   // the look's --accent as 'r,g,b' (the reveal dot matches the answer's colour)
  function accent() {
    var c = getComputedStyle(sec).getPropertyValue('--accent').trim() || '#ff7f61';
    var m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(c);
    return m ? [1, 2, 3].map(function (k) { return parseInt(m[k], 16); }).join(',') : '255,127,97';
  }
  function draw(lt) {
    if (!AC) AC = accent();
    ctx.clearRect(0, 0, 1920, 1080);
    var dim = 1 - 0.45 * ST.ease.outCubic(ST.clamp((lt - TD) / 0.8, 0, 1));
    ctx.fillStyle = 'rgba(88,169,255,' + (0.9 * dim).toFixed(3) + ')';
    ctx.shadowColor = 'rgba(88,169,255,0.55)'; ctx.shadowBlur = 6;
    ctx.beginPath();
    for (var i = 0; i < D.length; i++) {
      if (i === G && lt >= TG) continue;
      ctx.moveTo(D[i].x + 5.6, D[i].y); ctx.arc(D[i].x, D[i].y, 5.6, 0, Math.PI * 2);
    }
    ctx.fill();
    ctx.shadowBlur = 0;
    if (lt < TG) return;
    var g = D[G], u = ST.clamp((lt - TG) / 0.45, 0, 1), e = ST.ease.outBack(u);
    // one ring goes out once (0.58-1.9 s), a thin ring stays to mark it
    var w = ST.clamp((lt - TG) / 1.3, 0, 1);
    ctx.strokeStyle = 'rgba(' + AC + ',' + (0.8 * (1 - w)).toFixed(3) + ')'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(g.x, g.y, 12 + 60 * ST.ease.outCubic(w), 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = 'rgba(' + AC + ',' + (0.85 * u).toFixed(3) + ')'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(g.x, g.y, 22, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = 'rgb(' + AC + ')'; ctx.shadowColor = 'rgba(' + AC + ',0.95)'; ctx.shadowBlur = 22;
    ctx.beginPath(); ctx.arc(g.x, g.y, 5.6 + 4.4 * e, 0, Math.PI * 2); ctx.fill();
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
