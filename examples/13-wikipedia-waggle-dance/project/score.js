/* Score: F major, warm and light. Composed in code with Synth (no samples), on the same cues as the
 * picture, so a re-voice (the French version) moves the music with the cuts.
 * Arc: wonder (hook) -> dark, low (problem) -> clear, lifting (angle) -> busy, playful (distance)
 * -> turning (round) -> calm (source) -> the motif answered on the tonic (credit). */
'use strict';

var FILM_SCORE = Synth.score(function (m) {
  var g = m.grid({ bpm: 72 });
  var D = CUE.duration;
  var ch = {
    I: Synth.chord('Fmaj7', 3), vi: Synth.chord('Dm7', 3), IV: Synth.chord('Bbmaj7', 3),
    V: Synth.chord('C', 3), ii: Synth.chord('Gm7', 3), Isus: Synth.chord('Fsus2', 3),
  };
  function len(a, b) { return Math.max(0.5, b - a); }

  // 1. hook: soft pad from frame 1, the motif as a question (ends on the fifth)
  m.pad(ch.I, 0, len(0, CUE.problem) + 0.4, { vel: 0.4, attack: 0.2, cutoff: 1500 });
  m.bass('F2', 0, len(0, CUE.problem), { vel: 0.28, cutoff: 280 });
  ['C5', 'A4', 'D5', 'C5'].forEach(function (n, i) { m.marimba(n, 0.15 + i * 0.42, { vel: 0.42 }); });

  // 2. problem: relative minor, low pulse, a whoosh as the camera goes into the hive
  m.whoosh(CUE.problem, { dur: 0.9, vel: 0.35 });
  m.pad(ch.vi, CUE.problem, len(CUE.problem, CUE.angle) + 0.3, { vel: 0.4, cutoff: 900 });
  for (var t = CUE.problem; t < CUE.angle - 0.2; t += g.spb) m.bass('D2', t, g.spb * 0.6, { vel: 0.26, cutoff: 260 });
  m.whoosh(CUE.vertical - 0.1, { dur: 1.3, vel: 0.4, lo: 300, hi: 2500 });
  m.bell('A5', CUE.dances, { vel: 0.3, decay: 2.2 });

  // 3. angle: lift (IV -> I), a bell when the wedge lands on the comb, a tick as the sun moves
  m.pad(ch.IV, CUE.angle, len(CUE.angle, CUE.deg2), { vel: 0.4, cutoff: 1300 });
  m.pad(ch.I, CUE.deg2, len(CUE.deg2, CUE.distance) + 0.3, { vel: 0.4, cutoff: 1400 });
  m.bass('Bb1', CUE.angle, len(CUE.angle, CUE.deg2), { vel: 0.3, cutoff: 300 });
  m.bass('F2', CUE.deg2, len(CUE.deg2, CUE.distance), { vel: 0.3, cutoff: 300 });
  m.arp(ch.IV, CUE.comb, CUE.deg2, { grid: g, div: 2, inst: 'pluck', vel: 0.16, decay: 0.5, pattern: 'up' });
  m.bell('F5', CUE.deg2 + 0.65, { vel: 0.34, decay: 2.5 });
  m.bell('C6', CUE.deg2 + 0.8, { vel: 0.22, decay: 2.5 });
  m.whoosh(CUE.sunMoves + 0.7, { dur: 1.4, vel: 0.25 });

  // 4. distance: playful plucks; one marimba note per loop label
  m.pad(ch.ii, CUE.distance, len(CUE.distance, CUE.dist), { vel: 0.46, cutoff: 1300 });
  m.pad(ch.V, CUE.dist, len(CUE.dist, CUE.round) + 0.3, { vel: 0.46, cutoff: 1300 });
  m.arp(ch.ii, CUE.distance, CUE.dist, { grid: g, div: 4, inst: 'pluck', vel: 0.2, decay: 0.35, pattern: 'updown' });
  m.arp(ch.V, CUE.dist, CUE.round - 0.2, { grid: g, div: 4, inst: 'pluck', vel: 0.2, decay: 0.35, pattern: 'updown' });
  m.bass('G1', CUE.distance, len(CUE.distance, CUE.dist), { vel: 0.3, cutoff: 300 });
  m.bass('C2', CUE.dist, len(CUE.dist, CUE.round), { vel: 0.3, cutoff: 300 });
  m.marimba('A5', CUE.left, { vel: 0.4 });
  m.marimba('C6', CUE.right, { vel: 0.4 });
  m.chime(['F5', 'A5', 'C6'], CUE.fig8, { vel: 0.26, step: 0.08 });

  // 5. round -> waggle: suspended, then it opens as the circle stretches
  m.pad(ch.Isus, CUE.round, len(CUE.round, CUE.forty), { vel: 0.38, cutoff: 1200 });
  m.pad(ch.IV, CUE.forty, len(CUE.forty, CUE.source) + 0.3, { vel: 0.38, cutoff: 1400 });
  m.bass('F2', CUE.round, len(CUE.round, CUE.forty), { vel: 0.26, cutoff: 280 });
  m.bass('Bb1', CUE.forty, len(CUE.forty, CUE.source), { vel: 0.26, cutoff: 280 });
  m.shimmer(CUE.stretches, { dur: 1.6, note: 'F5', vel: 0.3 });

  // 6. source: calm
  m.whoosh(CUE.source, { dur: 0.8, vel: 0.25 });
  m.pad(ch.vi, CUE.source, len(CUE.source, CUE.credit) + 0.3, { vel: 0.48, cutoff: 1100 });
  m.pad(ch.V, CUE.first, len(CUE.first, CUE.credit), { vel: 0.3, cutoff: 1100 });
  m.bass('D2', CUE.source, len(CUE.source, CUE.first), { vel: 0.3, cutoff: 280 });
  m.bass('C2', CUE.first, len(CUE.first, CUE.credit), { vel: 0.3, cutoff: 280 });
  m.bell('D5', CUE.frisch, { vel: 0.22, decay: 2 });

  // 7. credit: the motif answers on the tonic, bell button, ring-out
  m.pad(ch.I, CUE.credit, len(CUE.credit, D) + 1, { vel: 0.44, attack: 0.15, release: 2.2, cutoff: 1500 });
  m.bass('F2', CUE.credit, len(CUE.credit, D), { vel: 0.3, cutoff: 280 });
  ['C5', 'A4', 'G4', 'F4'].forEach(function (n, i) { m.marimba(n, CUE.credit + 0.3 + i * 0.42, { vel: 0.44 }); });
  m.bell('F5', CUE.credit + 2.1, { vel: 0.34, decay: 3.5 });

  // under the narration: the bed dips while she speaks
  var spans = Object.keys(VO.lines).map(function (k) { return { start: VO.lines[k].speech_start, end: VO.lines[k].speech_end }; });
  m.duckUnder(spans, { depth: 7 });
  m.end(D, { fade: 1.6 });
}, { bpm: 72, seed: 7, reverb: { seconds: 2.8, wet: 0.7 }, master: { gain: -9 } });
