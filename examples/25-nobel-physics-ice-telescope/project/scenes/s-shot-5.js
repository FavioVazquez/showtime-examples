/* shot-5: a telescope of ice. draw(T) is a pure function of the scene-relative time T (no state between frames).
 * Left: a cross-section (surface -> 2,450 m, to scale): a hot-water drill melts a hole, a string of 60 sensors
 * is lowered between 1,450 and 2,450 m (P39, P13). Right: the real IceCube string layout seen from above
 * (86 strings; positions from the IceCube ppc geometry, Zenodo CC-BY-4.0), filling in (P13). */
(function () {
  'use strict';
  var SID = 'shot-5', DUR = 11.9;
  var sec = document.getElementById(SID); if (!sec || !window.ST) return;
  var cv = sec.querySelector('.s5-cv'), g = cv.getContext('2d');
  var nEl = sec.querySelector('.s5-n');
  // look tokens (Tidewater), read once: coral accent for hot water and our string, ground for the fades
  var ACC = '255,127,97', BG = '11,26,28';
  function rgbOf(name, fb) {
    var v = getComputedStyle(sec).getPropertyValue(name).trim(), m = /^#([0-9a-f]{6})$/i.exec(v);
    if (!m) return fb;
    var n = parseInt(m[1], 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255].join(',');
  }

  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
  function seg(t, a, b) { return clamp((t - a) / (b - a), 0, 1); }
  function oCub(p) { return 1 - Math.pow(1 - p, 3); }
  function ioCub(p) { return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; }
  function ioSin(p) { return -(Math.cos(Math.PI * p) - 1) / 2; }

  // ---- cross-section, to scale: surface at y 250, 2,450 m at y 840
  var SURF = 400, KPX = (840 - 400) / 2450;   // surface dropped so the rig clears the title by >= 40 px
  function yd(d) { return SURF + d * KPX; }
  var HX = 360;                                   // the hole we drill
  var SPACING = 125 * KPX;                        // 125 m between strings
  var NEIGH = [-4, -3, -2, -1, 1, 2, 3, 4];       // neighbour strings in the section (about 1 km across)
  var NS = 60, TOP_D = 1450, BOT_D = 2450;

  // ---- top view: real string tops (x, y in m), IceCube coordinates
  var XY = [[-256.1,-521.1],[-132.8,-501.5],[-9.1,-481.7],[114.4,-462],[237.8,-442.4],[361,-422.8],[-334.8,-424.5],[-211.4,-404.5],[-88.1,-384.3],[35.5,-364.8],[158.9,-345.2],[282.2,-325.7],[405.8,-306.4],[-413.5,-327.3],[-290.7,-307.4],[-166.4,-287.8],[-43.3,-267.5],[79.4,-248.2],[210.5,-209.8],[326.9,-209.1],[443.6,-194.2],[-492.4,-230.2],[-368.9,-210.2],[-245.6,-190.5],[-121.8,-171],[1.7,-150.6],[125,-131.2],[248.1,-111.9],[371.6,-92.2],[500.4,-58.5],[-570.9,-125.1],[-447.7,-113.1],[-324.4,-93.4],[-200.6,-74],[-77.8,-54.3],[46.3,-34.9],[194.3,-30.9],[292.9,5.2],[411.8,13],[544.1,55.9],[-526.6,-15.6],[-403.1,3.5],[-279.5,23.2],[-156.2,43.4],[-33,62.4],[90.5,82.3],[195,125.6],[330,127.2],[472,127.9],[576.4,170.9],[-481.6,101.4],[-358.4,120.6],[-234.9,140.4],[-111.5,160],[11.9,179.2],[132,203],[257.3,211.7],[382.4,238.9],[505.3,257.9],[-437,217.8],[-313.6,237.4],[-190,257.4],[-66.7,276.9],[54.3,293],[174.5,315.5],[303.4,335.6],[429.8,351],[-392.4,334.2],[-268.9,354.2],[-145.4,374.2],[-22,393.2],[101,412.8],[224.6,432.4],[338.4,463.7],[-347.9,451.5],[-224.1,470.9],[-101.1,490.2],[22.1,509.5],[31.2,-72.9],[72.4,-66.6],[41.6,35.5],[106.9,27.1],[113.2,-60.5],[57.2,-105.5],[-9.7,-79.5],[-11,6.7]];
  var CX = 1400, CY = 470, TS = 0.5;
  var PTS = XY.map(function (p) { return [CX + p[0] * TS, CY - p[1] * TS]; });
  var FIRST = 44;                                  // a string near the middle: the one drilled on the left
  var ORDER = PTS.map(function (p, i) {
    var dx = p[0] - PTS[FIRST][0], dy = p[1] - PTS[FIRST][1];
    return { i: i, d: Math.sqrt(dx * dx + dy * dy) + (i === FIRST ? -1 : 0) };
  }).sort(function (a, b) { return a.d - b.d; });
  var APPEAR = new Array(PTS.length);
  ORDER.forEach(function (o, k) { APPEAR[o.i] = k === 0 ? 8.4 : 8.6 + (k - 1) / (PTS.length - 2) * 2.0; });
  var HULL = (function (pts) {                     // convex hull (monotone chain), once
    var p = pts.slice().sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
    function cr(o, a, b) { return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); }
    var lo = [], up = [];
    p.forEach(function (q) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); });
    p.slice().reverse().forEach(function (q) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); });
    return lo.slice(0, -1).concat(up.slice(0, -1));
  })(PTS);

  // ---- static ice strata, seeded once
  var R = ST.rand('s5-strata'), STRATA = [];
  for (var i = 0; i < 26; i++) STRATA.push([SURF + 20 + R() * 460, 0.03 + R() * 0.05, R() * 6.28]);

  function drawIce() {
    var gr = g.createLinearGradient(0, SURF, 0, 1080);
    gr.addColorStop(0, '#1d3a5c'); gr.addColorStop(0.35, '#162c4a'); gr.addColorStop(1, '#0f1a33');
    g.fillStyle = gr; g.fillRect(80, SURF, 840, 830);
    STRATA.forEach(function (s) {
      g.strokeStyle = 'rgba(160,200,255,' + s[1] + ')'; g.lineWidth = 1;
      g.beginPath(); g.moveTo(80, s[0]);
      for (var x = 80; x <= 920; x += 40) g.lineTo(x, s[0] + Math.sin(x * 0.01 + s[2]) * 3);
      g.stroke();
    });
    // soft side fades into the night
    var fl = g.createLinearGradient(80, 0, 220, 0); fl.addColorStop(0, 'rgb(' + BG + ')'); fl.addColorStop(1, 'rgba(' + BG + ',0)');
    g.fillStyle = fl; g.fillRect(80, SURF - 2, 140, 832);
    var fr = g.createLinearGradient(920, 0, 780, 0); fr.addColorStop(0, 'rgb(' + BG + ')'); fr.addColorStop(1, 'rgba(' + BG + ',0)');
    g.fillStyle = fr; g.fillRect(780, SURF - 2, 140, 832);
    // snow surface
    g.strokeStyle = 'rgba(234,244,241,0.85)'; g.lineWidth = 3;
    g.beginPath(); g.moveTo(130, SURF); g.lineTo(870, SURF); g.stroke();
  }

  function drawString(x, offset, alpha, colour) {
    // cable from the surface to the deepest sensor, 60 sensors from 1,450 to 2,450 m, lowered by `offset` m
    var deep = BOT_D - offset;
    if (deep <= 0) return;
    g.globalAlpha = alpha;
    g.strokeStyle = 'rgba(200,220,255,0.55)'; g.lineWidth = 1.5;
    g.beginPath(); g.moveTo(x, SURF); g.lineTo(x, yd(deep)); g.stroke();
    g.fillStyle = colour;
    for (var k = 0; k < NS; k++) {
      var d = TOP_D + k * (BOT_D - TOP_D) / (NS - 1) - offset;
      if (d <= 4) continue;
      g.beginPath(); g.arc(x, yd(d), 2.6, 0, 6.2832); g.fill();
    }
    g.globalAlpha = 1;
  }

  function draw(T) {
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, 1920, 1080);
    // ground glow behind the right half
    var bg = g.createRadialGradient(1400, 470, 40, 1400, 470, 620);
    bg.addColorStop(0, 'rgba(88,169,255,0.10)'); bg.addColorStop(1, 'rgba(88,169,255,0)');
    g.fillStyle = bg; g.fillRect(760, 0, 1160, 1080);

    drawIce();

    // ---- the drill: melting runs 0.5 -> 5.3 s, then the hose comes back up
    var depth = 2520 * ioSin(seg(T, 0.5, 5.3));
    var noz = T < 5.4 ? depth : 2520 * (1 - ioCub(seg(T, 5.4, 6.5)));
    var rigA = 1 - seg(T, 6.4, 6.9) * 0.55;
    // melted, water-filled hole
    if (depth > 0) {
      var hg = g.createLinearGradient(0, SURF, 0, yd(depth));
      hg.addColorStop(0, 'rgba(88,169,255,0.30)'); hg.addColorStop(1, 'rgba(88,225,255,0.50)');
      g.fillStyle = hg; g.fillRect(HX - 7, SURF, 14, yd(depth) - SURF);
      g.strokeStyle = 'rgba(88,225,255,0.55)'; g.lineWidth = 1;
      g.beginPath(); g.moveTo(HX - 7, SURF); g.lineTo(HX - 7, yd(depth)); g.moveTo(HX + 7, SURF); g.lineTo(HX + 7, yd(depth)); g.stroke();
    }
    // tower and hose reel at the surface
    g.globalAlpha = rigA;
    g.strokeStyle = '#c9d6ee'; g.lineWidth = 3; g.lineJoin = 'round';
    g.beginPath(); g.moveTo(HX - 30, SURF); g.lineTo(HX, SURF - 74); g.lineTo(HX + 30, SURF);
    g.moveTo(HX - 18, SURF - 30); g.lineTo(HX + 18, SURF - 30); g.stroke();
    var RX = HX - 150, RY = SURF - 30, spin = (depth - (T > 5.4 ? (2520 - noz) : 0)) * 0.004;
    g.beginPath(); g.arc(RX, RY, 26, 0, 6.2832); g.stroke();
    g.beginPath(); for (var s = 0; s < 3; s++) { var a = spin + s * 2.094; g.moveTo(RX, RY); g.lineTo(RX + Math.cos(a) * 24, RY + Math.sin(a) * 24); } g.stroke();
    g.beginPath(); g.moveTo(RX - 34, SURF); g.lineTo(RX, RY); g.lineTo(RX + 34, SURF); g.stroke();
    g.globalAlpha = 1;
    // the hot-water hose: reel -> tower top -> down to the nozzle
    var hoseA = 1 - seg(T, 6.2, 6.6);
    if (hoseA > 0) {
      g.globalAlpha = hoseA;
      g.lineWidth = 4; g.strokeStyle = 'rgb(' + ACC + ')';
      g.beginPath(); g.moveTo(RX, RY - 26); g.quadraticCurveTo(HX - 70, SURF - 92, HX, SURF - 74); g.lineTo(HX, yd(noz)); g.stroke();
      // hot water flowing down: moving dashes, phase from T only
      g.setLineDash([10, 22]); g.lineDashOffset = -T * 90; g.lineWidth = 2.2; g.strokeStyle = 'rgba(255,236,228,0.9)';
      g.beginPath(); g.moveTo(RX, RY - 26); g.quadraticCurveTo(HX - 70, SURF - 92, HX, SURF - 74); g.lineTo(HX, yd(noz)); g.stroke();
      g.setLineDash([]);
      // the nozzle melting the ice
      var on = seg(T, 0.45, 0.8) * (1 - seg(T, 5.2, 5.6));
      if (on > 0) {
        var ny = yd(noz), gl = g.createRadialGradient(HX, ny, 0, HX, ny, 34);
        gl.addColorStop(0, 'rgba(255,236,228,' + 0.95 * on + ')'); gl.addColorStop(0.35, 'rgba(' + ACC + ',' + 0.6 * on + ')'); gl.addColorStop(1, 'rgba(' + ACC + ',0)');
        g.fillStyle = gl; g.beginPath(); g.arc(HX, ny, 34, 0, 6.2832); g.fill();
        for (var b = 0; b < 9; b++) {                 // meltwater bubbles rising from the nozzle
          var ph = (T * 0.9 + b / 9) % 1, by = ny - ph * 110;
          if (by < SURF + 4) continue;
          g.fillStyle = 'rgba(234,248,255,' + (0.7 * (1 - ph) * on) + ')';
          g.beginPath(); g.arc(HX + Math.sin(b * 2.3 + T * 3) * 3, by, 2 + (b % 3) * 0.6, 0, 6.2832); g.fill();
        }
      }
      g.globalAlpha = 1;
    }
    // leader from the label to the hole
    var la = seg(T, 1.2, 1.6);
    if (la > 0) {
      g.strokeStyle = 'rgba(234,244,241,' + 0.7 * la + ')'; g.lineWidth = 2;
      g.beginPath(); g.moveTo(HX + 12, SURF + 56); g.lineTo(464, SURF + 56); g.stroke();
    }

    // ---- our string drops in (6.0 -> 8.2), then the neighbours (8.1 -> 10.2)
    var drop = 2450 * (1 - oCub(seg(T, 6.4, 8.6)));
    var hl = seg(T, 8.4, 8.85), ac = ACC.split(',').map(Number);
    drawString(HX, drop, seg(T, 6.35, 6.5), hl > 0 ? 'rgb(' + Math.round(207 + (ac[0] - 207) * hl) + ',' + Math.round(230 + (ac[1] - 230) * hl) + ',' + Math.round(255 + (ac[2] - 255) * hl) + ')' : '#cfe6ff');
    NEIGH.forEach(function (j, k) {
      var t0 = 8.6 + Math.abs(j) * 0.36 + (j > 0 ? 0.12 : 0);
      var off = 2450 * (1 - oCub(seg(T, t0, t0 + 0.75)));
      if (T >= t0) drawString(HX + j * SPACING, off, seg(T, t0, t0 + 0.1) * 0.85, '#bcd6f5');
    });
    // depth ruler for the instrumented span
    var ra = seg(T, 8.4, 8.85);
    if (ra > 0) {
      g.globalAlpha = ra;
      g.strokeStyle = 'rgba(88,225,255,0.9)'; g.lineWidth = 3;
      var y1 = yd(TOP_D), y2 = yd(BOT_D);
      g.beginPath(); g.moveTo(570, y1); g.lineTo(570, y2); g.moveTo(560, y1); g.lineTo(580, y1); g.moveTo(560, y2); g.lineTo(580, y2); g.stroke();
      g.setLineDash([4, 8]); g.strokeStyle = 'rgba(88,225,255,0.4)'; g.lineWidth = 1.5;
      g.beginPath(); g.moveTo(HX + 4 * SPACING + 10, y1); g.lineTo(556, y1); g.moveTo(HX + 4 * SPACING + 10, y2); g.lineTo(556, y2); g.stroke();
      g.setLineDash([]); g.globalAlpha = 1;
    }

    // ---- top view: the hexagon fills to 86 strings
    var ha = seg(T, 8.25, 8.75);
    if (ha > 0) {
      g.globalAlpha = ha;
      g.fillStyle = 'rgba(88,169,255,0.06)'; g.strokeStyle = 'rgba(88,169,255,0.45)'; g.lineWidth = 2;
      g.beginPath(); HULL.forEach(function (p, k) { var q = [CX + (p[0] - CX) * 1.08, CY + (p[1] - CY) * 1.08]; if (k) g.lineTo(q[0], q[1]); else g.moveTo(q[0], q[1]); });
      g.closePath(); g.fill(); g.stroke();
      g.globalAlpha = 1;
    }
    var shown = 0;
    for (var p = 0; p < PTS.length; p++) {
      var t0 = APPEAR[p]; if (T < t0) continue;
      shown++;
      var k = seg(T, t0, t0 + 0.35), pop = 1 + 0.9 * (1 - oCub(k));
      var x = PTS[p][0], y = PTS[p][1], first = p === FIRST;
      var glow = g.createRadialGradient(x, y, 0, x, y, 22 * pop);
      glow.addColorStop(0, first ? 'rgba(' + ACC + ',0.6)' : 'rgba(88,225,255,' + (0.25 + 0.4 * (1 - k)) + ')');
      glow.addColorStop(1, 'rgba(88,225,255,0)');
      g.fillStyle = glow; g.beginPath(); g.arc(x, y, 22 * pop, 0, 6.2832); g.fill();
      g.fillStyle = first ? 'rgb(' + ACC + ')' : '#d8f4ff';
      g.beginPath(); g.arc(x, y, (first ? 8 : 6.5) * (0.6 + 0.4 * oCub(k)), 0, 6.2832); g.fill();
    }
    if (nEl) { var txt = String(Math.max(shown, 1)); if (nEl.textContent !== txt) nEl.textContent = txt; }
  }

  var win = null;
  ST.onSeek(function (t) {
    if (!win) { win = (ST.clips() || []).filter(function (c) { return c.id === SID; })[0] || { start: 0 }; ACC = rgbOf('--accent', ACC); BG = rgbOf('--bg', BG); }
    var T = t - win.start;
    if (T < -1 || T > DUR + 2) return;              // hidden then; nothing to draw
    draw(clamp(T, 0, DUR));
  });
})();
