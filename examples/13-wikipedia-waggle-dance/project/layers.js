/* DOM layers above the canvas: their windows come from the same cue table (no typed times).
 * Runs before the stage resolves clips (plain script at the end of <body>). */
'use strict';
(function () {
  var hook = document.getElementById('hook-layer');
  hook.setAttribute('data-dur', String(+(CUE.problem + 0.35).toFixed(4)));
  var src = document.getElementById('source-layer');
  var srcIn = CUE.source + 0.3;           // after the canvas crossfade: the window rises in over a clean background
  src.setAttribute('data-start', String(+srcIn.toFixed(4)));
  src.setAttribute('data-dur', String(+(CUE.credit + 0.45 - srcIn).toFixed(4)));

  var OFFSET = 0.2;                      // the clip's in-point (s): the video's data-offset
  var TAIL = 0.7;                        // trail length (s of source time). The positions are in the frame's own
                                         // pixels and the camera follows her, so only a short trail is drawn:
                                         // a long one would read as a map of her path on the comb, which it is not.
  var tr = DANCE_TRACK;
  function posAt(s) {                    // interpolated position of the red mark in the frame at source time s
    if (s <= tr[0][0]) return [tr[0][1], tr[0][2]];
    for (var i = 1; i < tr.length; i++) {
      if (tr[i][0] >= s) {
        var a = tr[i - 1], b = tr[i], u = (s - a[0]) / (b[0] - a[0]);
        return [a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
      }
    }
    var l = tr[tr.length - 1]; return [l[1], l[2]];
  }
  function smoothPath(pts) {             // quadratic curves through the midpoints
    if (pts.length < 2) return '';
    var d = 'M' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1);
    for (var i = 1; i < pts.length - 1; i++) {
      var mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2;
      d += ' Q' + pts[i][0].toFixed(1) + ' ' + pts[i][1].toFixed(1) + ' ' + mx.toFixed(1) + ' ' + my.toFixed(1);
    }
    var l = pts[pts.length - 1];
    return d + ' L' + l[0].toFixed(1) + ' ' + l[1].toFixed(1);
  }
  var foot = document.getElementById('foot-in');
  var pathEl = document.getElementById('trace'), under = document.getElementById('trace-under'), head = document.getElementById('trace-head');
  ST.onSeek(function (t) {
    // hook layer: slow push-in on the footage, fade out across the cut
    var fade = 1 - ST.progress(t, CUE.problem - 0.3, CUE.problem + 0.3);
    hook.style.opacity = String(Math.max(0, fade));
    var push = ST.progress(t, 0, CUE.problem, ST.ease.linear);
    foot.style.transform = 'scale(' + (1.0 + 0.06 * push).toFixed(4) + ')';   // index.html's .foot-in already crops the bands
    var s = OFFSET + t, s0 = Math.max(OFFSET, s - TAIL), pts = [posAt(s0)];
    for (var i = 0; i < tr.length && tr[i][0] < s; i++) if (tr[i][0] > s0) pts.push([tr[i][1], tr[i][2]]);
    var cur = posAt(s);
    pts.push(cur);
    var d = smoothPath(pts);
    pathEl.setAttribute('d', d); under.setAttribute('d', d);
    head.setAttribute('cx', cur[0].toFixed(1)); head.setAttribute('cy', cur[1].toFixed(1));
    // where the mark was not found (hidden or blurred) the ring is only interpolated: dim it there
    var near = 9;
    for (var j = 0; j < tr.length; j++) near = Math.min(near, Math.abs(tr[j][0] - s));
    head.style.opacity = near <= 0.12 ? '1' : '0.35';
    // source layer: out with the crossfade into the end card
    src.style.opacity = String(1 - ST.progress(t, CUE.credit - 0.6, CUE.credit - 0.2));
  });
})();
