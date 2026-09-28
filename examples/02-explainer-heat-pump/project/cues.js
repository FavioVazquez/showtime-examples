/* Cue table shared by the picture (scenes.js) and the score (score.js).
 * Every time below comes from voice/timeline.json (af_heart, fitted to 45 s with
 * `showtime voice script narration.md -o voice --lead-in 0.35 --fit 45`):
 * scene cuts are the line slot starts, reveals are the start of the word that names them.
 * If the script changes, re-run the voice and copy the new times here. */
'use strict';
var CUE = {
  bpm: 80,
  duration: 45,

  // ---- scene starts (timeline.json lines[].slot.start)
  hook: 0.0,          // "It's freezing outside. So how can that air heat your home?"
  absolute: 4.25,     // "Even freezing air holds heat. Zero Celsius is still far above absolute zero."
  loop: 10.52,        // "A heat pump moves that heat indoors, with refrigerant circling a sealed loop."
  evap: 15.93,        // "Outside, refrigerant colder than the air soaks up its heat and boils into a gas."
  comp: 21.66,        // "A compressor squeezes the gas, and its temperature shoots up."
  cond: 25.76,        // "Indoors, the hot gas releases that heat into your home and condenses to a liquid."
  valve: 31.62,       // "An expansion valve drops the pressure, the liquid goes cold, and the loop repeats."
  payoff: 37.48,      // "Moving heat beats making it. You usually get more heat out than electricity in."
  endCard: 42.6,      // after the last word (41.70 + 0.4 s): the score's button
  endTitle: 42.0,     // end-card title comes in just after the last word ends (41.97), 3 s on screen

  // ---- word cues (timeline.json words[].start)
  w: {
    freezing: 0.58, heatHome: 2.79, home: 3.10,
    holdsHeat: 5.30, zero: 6.41, far: 7.95, absZero: 8.52,
    moves: 11.24, indoors: 12.01, refrigerant: 13.08, circling: 13.71, sealed: 14.35,
    outside: 15.96, colder: 17.33, soaks: 18.36, boils: 19.70,
    compressor: 21.79, squeezes: 22.32, temperature: 23.83, shootsUp: 24.41,
    indoorsC: 25.79, hotGas: 26.69, releases: 27.40, yourHome: 28.55, condenses: 29.51,
    expansion: 31.76, drops: 32.77, cold: 34.44, loopRepeats: 35.69,
    moving: 37.52, beats: 38.26, making: 38.55, moreHeat: 40.20, electricity: 41.06,
  },
};
CUE.acts = [[CUE.hook, 'Hook'], [CUE.absolute, 'Heat in cold air'], [CUE.loop, 'The loop'],
  [CUE.evap, 'Evaporator'], [CUE.comp, 'Compressor'], [CUE.cond, 'Condenser'],
  [CUE.valve, 'Expansion valve'], [CUE.payoff, 'Payoff'], [CUE.endCard, 'End card']];
