/* Score: D minor (the cold outside) that turns to D major when the heat arrives indoors.
 * 80 bpm grid for the arps; every section change and hit reads the same CUE times as the picture.
 * The voice carries the film, so this is a quiet bed: pads + a cold bell motif, a slow pulse once
 * the refrigerant starts circling, a lift in the condenser, and the motif answered on the tonic
 * (major) at the end. Round 2 raised the master gain 9 dB (the round-1 bed was ~21 dB under the voice and
 * inaudible on small speakers); it now sits ~12 dB under the narration and lifts on the end card.
 * Spanish version (example 03): same score; the few times that were written as numbers now read CUE,
 * so the whole bed follows the Spanish timing. */
'use strict';

var FILM_SCORE = Synth.score(function (m) {
  var g = m.grid({ bpm: CUE.bpm });
  var w = CUE.w;
  function span(a, b) { return b - a; }

  // ---- hook: cold. Dm(add9) pad, sparse high bells (ice), the motif as a question
  m.pad(['D3', 'A3', 'E4', 'F4'], 0, span(0, CUE.absolute) + 0.4, { vel: 0.34, attack: 0.3, cutoff: 900 });
  m.bass('D2', 0, CUE.absolute, { vel: 0.26, cutoff: 220 });
  m.melody(g, 0.25, 'D5:1 F5:1 E5:1.5 A4:1.5', { inst: 'bell', vel: 0.26 });
  m.bell('A6', 0.05, { vel: 0.12, decay: 2.5 });

  // ---- absolute zero: zoom into the air; molecules = a light 16th arp
  m.whoosh(CUE.absolute, { dur: 0.9, vel: 0.35 });
  m.pad(['Bb2', 'F3', 'A3', 'D4'], CUE.absolute, span(CUE.absolute, w.far - 0.55), { vel: 0.42, cutoff: 1200 });
  m.pad(['G2', 'D3', 'F3', 'Bb3'], w.far - 0.55, span(w.far - 0.55, CUE.loop) + 0.3, { vel: 0.42, cutoff: 1200 });
  m.arp(['D5', 'F5', 'A5', 'E5'], CUE.absolute + 0.3, CUE.loop - 0.2, { grid: g, div: 4, inst: 'pluck', vel: 0.24, decay: 0.25, pattern: 'random', pan: 0.25 });   // round 2: 0.17 -> 0.24
  m.tick(w.absZero + 0.35, { vel: 0.3 });
  // fill the breath between lines (about 10.7-11.7 s in Spanish) so it doesn't read as dead air
  m.shimmer(CUE.loop - 0.82, { dur: 1.0, note: 'A5', vel: 0.3 });
  m.chime(['D6', 'F6', 'A6'], CUE.loop - 0.62, { vel: 0.26, step: 0.08 });

  // ---- the loop: back out; the pulse enters when the refrigerant starts circling
  m.whoosh(CUE.loop, { dur: 0.9, vel: 0.35 });
  m.pad(['F2', 'C3', 'A3', 'D4'], CUE.loop, span(CUE.loop, CUE.evap) + 0.3, { vel: 0.33, cutoff: 1100 });
  m.bass('F2', CUE.loop, span(CUE.loop, w.circling), { vel: 0.22, cutoff: 240 });
  var pulseEnd = CUE.payoff;
  var roots = [[w.circling, 'D2'], [CUE.evap, 'D2'], [CUE.comp, 'C2'], [CUE.cond, 'F2'], [CUE.valve, 'A1'], [pulseEnd, null]];
  for (var i = 0; i < roots.length - 1; i++) {
    for (var t = roots[i][0]; t < roots[i + 1][0] - 0.05; t += g.spb / 2) {
      m.bass(roots[i][1], t, g.spb * 0.42, { vel: 0.20, cutoff: 300 });
    }
  }
  m.bell('D6', w.circling, { vel: 0.14, decay: 2 });

  // ---- 1 evaporator: cold arp, Dm -> Bb
  m.pad(['D3', 'F3', 'A3', 'C4'], CUE.evap, span(CUE.evap, w.soaks), { vel: 0.32, cutoff: 1000 });
  m.pad(['Bb2', 'D3', 'F3', 'A3'], w.soaks, span(w.soaks, CUE.comp) + 0.2, { vel: 0.32, cutoff: 1100 });
  m.arp(['A4', 'D5', 'F5', 'A5'], CUE.evap + 0.2, CUE.comp, { grid: g, div: 2, inst: 'pluck', vel: 0.12, decay: 0.4, pattern: 'up', pan: -0.2 });
  m.chime(['D6', 'F6', 'A6'], w.boils, { vel: 0.12, step: 0.09 });

  // ---- 2 compressor: C/E, pressure builds; riser lands on "shoots up"
  m.pad(['E3', 'G3', 'C4', 'D4'], CUE.comp, span(CUE.comp, CUE.cond) + 0.2, { vel: 0.33, cutoff: 1200 });
  m.subDrop(w.squeezes, { note: 'C2', dur: 1.0, vel: 0.28 });
  m.riser(w.shootsUp + 0.1, { dur: 1.6, vel: 0.22, note: 'C3' });
  m.thock(w.squeezes, { vel: 0.35 });

  // ---- 3 condenser: warmth. F major, brighter pad, soft hats lift the energy
  m.pad(['F3', 'A3', 'C4', 'E4'], CUE.cond, span(CUE.cond, w.condenses), { vel: 0.36, cutoff: 1700 });
  m.pad(['Bb2', 'D3', 'F3', 'A3'], w.condenses, span(w.condenses, CUE.valve) + 0.2, { vel: 0.34, cutoff: 1600 });
  m.arp(['F4', 'A4', 'C5', 'E5'], CUE.cond + 0.1, CUE.valve, { grid: g, div: 4, inst: 'pluck', vel: 0.11, decay: 0.35, pattern: 'updown', pan: 0.2 });
  m.drums(g, Math.ceil(g.beatAt(CUE.cond) / 4), 2, { hat: '..x...x...x...x.' }, { vel: 0.35 });
  m.shimmer(w.releases, { dur: 2.0, note: 'F5', vel: 0.14 });

  // ---- 4 expansion valve: Gm -> A (the dominant), muffled on "drops the pressure"
  m.pad(['G2', 'D3', 'F3', 'Bb3'], CUE.valve, span(CUE.valve, w.cold), { vel: 0.32, cutoff: 1100 });
  m.pad(['A2', 'E3', 'G3', 'C#4'], w.cold, span(w.cold, CUE.payoff) + 0.2, { vel: 0.32, cutoff: 1100 });
  m.sweep('music', w.drops - 0.05, w.drops + 0.6, 20000, 1500);
  m.sweep('music', w.loopRepeats - 0.05, w.loopRepeats + 0.4, 1500, 20000);
  m.tick(w.drops, { vel: 0.35 });
  m.whoosh(w.loopRepeats + 0.6, { dur: 1.2, vel: 0.3 });

  // ---- payoff: D major. The motif comes back and resolves on the tonic
  m.pad(['D3', 'F#3', 'A3', 'E4'], CUE.payoff, span(CUE.payoff, CUE.duration) + 1, { vel: 0.38, attack: 0.2, release: 2.4, cutoff: 1500 });
  m.bass('D2', CUE.payoff, span(CUE.payoff, CUE.duration), { vel: 0.26, cutoff: 260 });
  m.chime(['A5', 'D6', 'F#6'], CUE.payoff, { vel: 0.16, step: 0.1 });
  m.melody(g, g.beatAt(w.moreHeat - 0.2), 'D5:1 F#5:1 E5:1 D5:2', { inst: 'bell', vel: 0.24 });
  // the end card has no voice: bring the music bus up 5 dB (from its -8 dB default; one ramp, never back down)
  m.fade('music', CUE.endCard - 0.5, CUE.endCard + 0.1, -3);
  m.bell('D6', CUE.endCard, { vel: 0.4, decay: 3.5 });          // the button
  m.kick(CUE.endCard, { vel: 0.35, decay: 0.6 });
  m.subDrop(CUE.endCard, { note: 'D1', dur: 1.6, vel: 0.3 });
  m.end(CUE.duration, { fade: 1.6 });
}, { bpm: CUE.bpm, seed: 7, reverb: { seconds: 3.2, wet: 0.85 }, master: { gain: -1 } });   // round 2: +9 dB, the bed sits ~12 dB under the voice
