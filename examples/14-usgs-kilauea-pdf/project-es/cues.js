// cues.js: reveal times taken from the narration, so a re-voice (or the Spanish copy) re-times the picture.
// Each cue names a narration line (= its scene id) and a spoken word (lower case, end punctuation
// stripped; n = which occurrence). The times come from voice/captions.words.json, written by
// `showtime retime --from-voice`; they are turned into scene-local seconds and published as
//   CSS variables  --c-<name>: 3.21s   (used as animation delays; a clip's CSS clock starts with its scene)
//   window.CUE[name] = 3.21            (used by scenes.js and by the component attributes below)
// Runs as a classic script at the end of <body>, before the component module mounts.
(function () {
  var DEF = {
    'where-place': ['where', 'kīlauea', 1, -0.1],
    'where-mark': ['where', 'isla', 1, 0],
    'where-doc': ['where', 'este', 1, 0.2],
    's1': ['start', '30', 1, -0.1],
    's2': ['start', 'erupciones', 1, -0.1],
    's3': ['start', 'sismo', 1, -0.1],
    'summit-sank': ['summit', 'cumbre', 1, 0],
    'summit-hvo': ['summit', 'mediados', 1, -0.1],
    'summit-may29': ['summit', 'desde', 1, -0.1],
    'summit-collapse': ['summit', 'colapsó', 1, 0],
    'summit-m5': ['summit', 'energía', 1, -0.15],
    'f8-200': ['fissure8', '200', 1, -0.2],
    'f8-cut': ['fissure8', 'su', 1, -0.35],
    'f8-june': ['fissure8', 'llegó', 1, -0.1],
    'n1': ['numbers', '13,7', 1, -0.3],
    'n2': ['numbers', 'condado', 1, -0.1],
    'n3': ['numbers', '875', 1, -0.3],
    'n4': ['numbers', '60 000', 1, -0.3],
    'end-aug': ['end', 'principios', 1, -0.15],
    'end-sep': ['end', 'septiembre', 1, -0.15],
  };

  function load(url) {
    try { var x = new XMLHttpRequest(); x.open('GET', url, false); x.send(); if (x.status === 200) return JSON.parse(x.responseText); } catch (e) {}
    return null;
  }
  // scene starts from the page: the first scene starts at 0, each "#prev" scene where the previous one ends
  var starts = {}, t = 0, prevEnd = {};
  Array.prototype.forEach.call(document.querySelectorAll('section.scene[data-start]'), function (s) {
    var st = s.getAttribute('data-start'), d = parseFloat(s.getAttribute('data-dur')) || 0;
    var begin = st.charAt(0) === '#' ? (prevEnd[st.slice(1)] || 0) : (parseFloat(st) || 0);
    starts[s.id] = begin; prevEnd[s.id] = begin + d; t = begin + d;
  });
  var norm = function (w) { return String(w).toLowerCase().replace(/^[¿¡"'“(]+|[.,;:!?"'”)]+$/g, ''); };
  var data = load('voice/captions.words.json');
  var words = (data && (data.words || data)) || [];
  var CUE = window.CUE = { _starts: starts, _end: t };
  var root = document.documentElement.style;
  Object.keys(DEF).forEach(function (name) {
    var d = DEF[name], seen = 0, hit = null;
    for (var i = 0; i < words.length; i++) {
      if (words[i].line === d[0] && norm(words[i].text) === d[1] && ++seen === (d[2] || 1)) { hit = words[i]; break; }
    }
    if (!hit) { console.warn('cue not found: ' + name + ' (' + d[0] + ': ' + d[1] + ')'); return; }
    var v = Math.max(0, hit.start + (d[3] || 0) - (starts[d[0]] || 0));
    CUE[name] = Math.round(v * 1000) / 1000;
    root.setProperty('--c-' + name, CUE[name] + 's');
  });

  // component options that depend on cues (set before the components mount)
  var q = function (sel) { return document.querySelector(sel); };
  var map = q('#where .globe');
  if (map && CUE['where-mark'] != null) {
    var m = CUE['where-mark'];
    map.setAttribute('data-camera', JSON.stringify([
      { at: 0, center: [-132, 14], zoom: 1.05 },
      { at: 0.15, center: [-155.3, 19.6], zoom: 1.6, dur: 1.3 },
      { at: Math.max(1.1, m - 0.4), center: [-155.45, 19.62], zoom: 22, dur: 2.0 },
    ]));
    map.setAttribute('data-markers', JSON.stringify([{ at: m + 0.9, lon: -155.287, lat: 19.421, label: 'Kīlauea' }]));
  }
  var steps = q('#steps-start');
  if (steps && CUE.s1 != null) steps.setAttribute('data-cues', JSON.stringify([CUE.s1, CUE.s2, CUE.s3]));
  Array.prototype.forEach.call(document.querySelectorAll('[data-cue-at]'), function (el) {
    var c = CUE[el.getAttribute('data-cue-at')];
    if (c != null) el.setAttribute('data-at', String(Math.round((c + 0.15) * 1000) / 1000));
  });
})();
