/* Cue table shared by the picture (scenes.js), the burn transition (burn.js) and the mix (audio/mix.json).
 * Every cut sits on a downbeat of audio/score.beats.json (epic-trailer, Cm, 84 bpm, sections 0/10/20, composed
 * 29.2 s long so the final hit lands two bars after the drop; downbeats 0, 2.857, 5.714, 8.571, 10.0, 12.857,
 * 15.714, 18.571, 20.0, 22.857; end_hit 25.714). The last 4.3 s are the title card.
 * VO times come from voice/timeline.json. */
'use strict';
var CUE = {
  cut: 'trailer',
  duration: 30,
  // 1 watch: NASA/JPL/USGS Mars, limb -> Valles Marineris; VO "No one would have believed ..." 0.48-11.02
  watch: 0,
  // 2 arrive: WebGL ridged-burn into Correa's Mars (graphic 02), centred on downbeat 8.571
  arrive: 8.571,
  burnAt: 8.171, burnDur: 0.8,
  typeStart: 11.15, typeCps: 18,
  typeText: 'Then came the night\nof the first falling star.',
  // 3 machines, withheld (graphic 05): three crops on the build's last downbeats/beats
  lid: 15.714, man: 17.143, eye: 18.571,
  // drop: braam + impact; graphic 15
  drop: 20.0, wide: 21.429,
  // 4 the cost: the capsized steamer and the crowd under the machine; VO 20.37-25.21
  cost: 22.857,
  // 5 title on the score's end_hit, after the film's one dip; the call to action holds 4 s
  title: 25.714,
  dipAt: 25.514, dipDur: 0.4, byline: 25.85, cta: 25.95, credit: 26.15,
  scrims: [[0, 11.9], [20.2, 25.55]],   // caption scrim windows (the burned cinematic captions)
};
CUE.acts = [[0, 'Watched'], [CUE.arrive, 'The falling star'], [CUE.lid, 'The machines'], [CUE.cost, 'Mankind'], [CUE.title, 'Title']];
