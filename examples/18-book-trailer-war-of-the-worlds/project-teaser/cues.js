/* Teaser (9:16, 15 s): watched -> the machine -> title. Cue table shared by scenes.js and tools/make_mix.py.
 * Cuts on the downbeats of audio/score.beats.json (epic-trailer, Cm, sections 0:intro, 5.7:build, 8.6:drop;
 * downbeats 0, 2.85, 5.7, 8.6; end_hit 11.474). VO "No one would have believed ... being watched" 0.33-6.78. */
'use strict';
var CUE = {
  cut: 'teaser',
  duration: 15,
  watch: 0,
  eye: 5.7,          // build: the Martian's eye, pushing in, on "this world was being watched"
  drop: 8.6,         // braam + impact: the fighting machine
  wide: 10.03,       // two beats later: the whole machine over the river
  title: 11.474,
  dipAt: 11.274, dipDur: 0.4, byline: 11.7, cta: 11.9, credit: 12.1,
  scrims: [[0, 7.2]],
};
CUE.acts = [[0, 'Watched'], [CUE.eye, 'The machine'], [CUE.title, 'Title']];
