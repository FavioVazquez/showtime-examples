/* One cue table for picture, DOM layers and score. No time is typed by hand: every cut comes from
 * voice/cues.js (`showtime voice cues`), every reveal from the start of the word that names it.
 * A re-voice or a translation re-times the film: run `voice script` + `voice cues` again. */
'use strict';

function vline(id) {
  var l = VO.lines[id];
  if (!l) throw new Error('voice/cues.js has no line "' + id + '"');
  return l;
}
function vnorm(s) { return String(s).toLowerCase().replace(/[.,;:!?«»“”"()]/g, '').replace(/[’']/g, "'"); }
/** Start time of the nth word in line `id` that begins with `w` (w may be [word, nth]). */
function vword(id, w) {
  var nth = 0;
  if (Array.isArray(w)) { nth = w[1]; w = w[0]; }
  var ws = VO.words[id], want = vnorm(w), k = 0;
  for (var i = 0; i < ws.length; i++) {
    var got = vnorm(ws[i][0]);
    if (got === want || got.indexOf(want) === 0 || got.indexOf("'" + want) > 0) {
      if (k++ === nth) return ws[i][1];
    }
  }
  throw new Error('no word "' + w + '" (#' + nth + ') in voice line ' + id);
}
function W(id, key) { return vword(id, S.w[key]); }

var CUE = (function () {
  var c = {
    hook: 0,
    problem: vline('problem').start,
    angle: vline('angle').start,
    distance: vline('distance').start,
    round: vline('round').start,
    source: vline('source').start,
  };
  c.credit = vline('source').speech_end + 1.3;   // the last caption stays readable before the end card
  c.duration = VO.duration + 2;           // the end card holds 2 s past the voice file's tail
  // problem
  c.dark = W('problem', 'dark');
  c.vertical = W('problem', 'vertical');
  c.point = W('problem', 'point');
  c.dances = W('problem', 'dances');
  // angle
  c.comb = W('angle', 'comb');
  c.up = W('angle', 'up');
  c.sun = W('angle', 'sun');
  c.food = W('angle', 'food');
  c.deg1 = W('angle', 'deg1');
  c.waggle = W('angle', 'waggle');
  c.deg2 = W('angle', 'deg2');
  c.sunMoves = W('angle', 'sunMoves');
  c.shifts = W('angle', 'shifts');
  // distance
  c.left = W('distance', 'left');
  c.right = W('distance', 'right');
  c.fig8 = W('distance', 'fig8');
  c.dist = W('distance', 'distance');
  c.farther = W('distance', 'farther');
  c.longer = W('distance', 'longer');
  // round
  c.close = W('round', 'close');
  c.ten = W('round', 'ten');
  c.circle = W('round', 'circle');
  c.forty = W('round', 'forty');
  c.stretches = W('round', 'stretches');
  // source
  c.frisch = W('source', 'frisch');
  c.nobel = W('source', 'nobel');
  c.first = W('source', 'first');
  c.acts = [[c.hook, S.title], [c.problem, LANG === 'fr' ? 'Dans le noir' : 'In the dark'],
    [c.angle, LANG === 'fr' ? 'La direction' : 'Direction'], [c.distance, 'Distance'],
    [c.round, LANG === 'fr' ? 'Danse en rond' : 'Round dance'], [c.source, 'Source'],
    [c.credit, LANG === 'fr' ? 'Crédits' : 'Credits']];
  return c;
})();
