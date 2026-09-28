/* One WebGL "ridged-burn" (the showtime transitions module) inside a canvas film.
 * The shader needs two layers. The incoming layer is the film canvas itself (it already draws the
 * next scene over the window). The outgoing layer is a second canvas: on every seek inside the window
 * the film is drawn once more with window.__burnLayerA set (scenes.js then draws the Mars shot at the
 * same T), copied here, and drawn again normally. Both are pure functions of T, so any frame renders
 * the same, in any order. */
import { transition } from '/_st/transitions/transitions.js';

let film = document.getElementById('film');
if (!film) { Film.render(0); film = document.getElementById('film'); }   // the film makes its canvas on the first frame
const A = document.createElement('canvas');
A.id = 'burn-a';
A.width = film.width; A.height = film.height;
A.style.cssText = `position:absolute;left:0;top:0;width:${film.style.width};height:${film.style.height};display:none;`;
film.parentElement.insertBefore(A, film);

const t0 = CUE.burnAt, t1 = CUE.burnAt + CUE.burnDur;
ST.onSeek((t) => {
  const inside = t >= t0 - 1e-6 && t < t1 - 1e-6;
  A.style.display = inside ? 'block' : 'none';
  if (!inside) return;
  if (A.width !== film.width || A.height !== film.height) { A.width = film.width; A.height = film.height; }
  window.__burnLayerA = true;
  try { Film.render(t); } finally { window.__burnLayerA = false; }
  const c = A.getContext('2d');
  c.drawImage(film, 0, 0);
  Film.render(t);
});

transition({ from: A, to: film, type: 'ridged-burn', at: t0, dur: CUE.burnDur, a: 0.35, seed: 4 });
