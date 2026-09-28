/* Cue table shared by the picture (scenes.js) and the score (score.js).
 * Spanish version. Every time below comes from voice/timeline.json (supertonic:F1, lang es,
 * `showtime voice script narration.es.md -o voice --lead-in 0.35 --lang es`, natural pace, 50.07 s; round 2 re-voiced the evaporator, compressor and payoff lines):
 * scene cuts are the line slot starts, reveals are the start of the word that names them.
 * The key names stay those of the English original (example 02); the comments give the Spanish word.
 * If the script changes, re-run the voice and copy the new times here. */
'use strict';
var CUE = {
  bpm: 80,
  duration: 50.9,

  // ---- scene starts (timeline.json lines[].slot.start)
  hook: 0.0,          // "Afuera está helando. ¿Cómo puede ese aire calentar tu casa?"
  absolute: 4.36,     // "Incluso el aire helado guarda calor. Cero grados Celsius está muy por encima del cero absoluto."
  loop: 11.70,        // "Una bomba de calor lleva ese calor adentro, con refrigerante que circula en un circuito sellado."
  evap: 18.42,        // "Afuera, el refrigerante, más frío que el aire, absorbe su calor, hierve y se convierte en gas."
  comp: 25.22,        // "Un compresor comprime el gas y su temperatura se dispara."
  cond: 29.44,        // "Adentro, el gas caliente libera ese calor en tu casa y se condensa en líquido."
  valve: 34.79,       // "Una válvula de expansión baja la presión, el líquido se enfría y el ciclo se repite."
  payoff: 41.34,      // "Mover calor rinde más que producirlo. Por lo general, sale más calor del que entra como electricidad."
  endCard: 48.47,     // after the last word ("electricidad." ends 47.87) + 0.6 s: the score's button
  endTitle: 47.9,     // end-card title comes in as the last word ends, 3 s on screen

  // ---- word cues (timeline.json words[].start)
  w: {
    freezing: 0.97,                                        // helando
    heatHome: 2.69, home: 3.31,                            // calentar, casa
    holdsHeat: 5.78, zero: 7.00, far: 8.55, absZero: 9.68, // guarda, Cero, muy, cero (absoluto)
    moves: 12.89, indoors: 13.68, refrigerant: 14.74,      // lleva, adentro, refrigerante
    circling: 15.64, sealed: 16.54,                        // circula, circuito (sellado)
    outside: 18.44, colder: 20.28, soaks: 21.72, boils: 22.95,          // Afuera, más (frío), absorbe, hierve
    compressor: 25.50, squeezes: 26.09, temperature: 27.33, shootsUp: 28.04,  // compresor, comprime, temperatura, dispara
    indoorsC: 29.47, hotGas: 30.32, releases: 31.01, yourHome: 32.18, condenses: 33.11,  // Adentro, gas, libera, casa, condensa
    expansion: 35.11, drops: 36.27, cold: 38.47, loopRepeats: 39.29,  // válvula, baja, enfría, ciclo
    moving: 41.42, beats: 42.16, making: 42.82,            // Mover, rinde, producirlo
    moreHeat: 45.03, electricity: 46.85,                   // sale (más calor), electricidad
  },
};
CUE.acts = [[CUE.hook, 'Gancho'], [CUE.absolute, 'Calor en el aire frío'], [CUE.loop, 'El circuito'],
  [CUE.evap, 'Evaporador'], [CUE.comp, 'Compresor'], [CUE.cond, 'Condensador'],
  [CUE.valve, 'Válvula de expansión'], [CUE.payoff, 'Remate'], [CUE.endCard, 'Cierre']];
