// subs.js (Spanish copy only): the burned Spanish subtitles.
// One card per phrase, never split inside a name or a number phrase; at most two lines (only phrases over
// about 54 characters break, at "|"); each card stays on screen for at least 1 s. The spoken word is
// highlighted from the voice's word times (voice/captions.words.json). The card texts must match the voice
// word for word: a mismatch is logged, so a re-voice with a changed script shows up in `showtime check`.
// Uses the caption-karaoke boxed-pill classes, so it looks the same as that component.
(function () {
  var SUBS = [
    'En 2018, la cumbre del Kīlauea colapsó',
    'mientras su magma se drenaba hacia|la zona de rift este inferior.',
    'El Kīlauea está en la isla de Hawaiʻi.',
    'Este resumen sigue un informe de dos páginas',
    'del Servicio Geológico de Estados Unidos.',
    'El 30 de abril colapsó la boca eruptiva Puʻu ʻŌʻō.',
    'Las erupciones fisurales comenzaron el 3 de mayo,',
    'y al día siguiente hubo un sismo de magnitud 6,9.',
    'Mientras tanto, la cumbre se hundía.',
    'A mediados de mayo, las sacudidas|y la inclinación del terreno',
    'obligaron al Observatorio Volcánico|de Hawaiʻi a dejar su edificio.',
    'Desde el 29 de mayo, la cumbre colapsó casi a diario,',
    'cada vez con la energía de un sismo de magnitud 5.',
    'Rift abajo, la fisura 8 lanzó|fuentes de lava de hasta 200 pies.',
    'Su río de lava llegó al océano',
    'en la bahía de Kapoho el 3 de junio.',
    'La lava cubrió 13,7 millas cuadradas.',
    'El Condado de Hawaiʻi contó 716 viviendas destruidas.',
    'Las entradas al mar crearon 875 acres de tierra nueva,',
    'y unos 60 000 sismos sacudieron la zona.',
    'A principios de agosto, la erupción se apagó.',
    'El 22 de septiembre, el parque nacional reabrió en parte.',
  ];
  var LEAD = 0.08, HOLD = 0.7, MIN = 1.0;
  var box = document.getElementById('subs');
  if (!box) return;
  var data = null;
  try { var x = new XMLHttpRequest(); x.open('GET', 'voice/captions.words.json', false); x.send(); if (x.status === 200) data = JSON.parse(x.responseText); } catch (e) {}
  var words = ((data && (data.words || data)) || []).filter(function (w) { return !w.type || w.type === 'word'; });
  var norm = function (s) { return String(s).toLowerCase().replace(/[^\p{L}\p{N}]/gu, ''); };
  var k = 0, cards = [];
  SUBS.forEach(function (text) {
    var lines = text.split('|').map(function (l) { return l.split(/\s+/).filter(Boolean); });
    var toks = [].concat.apply([], lines), ws = [];
    for (var i = 0; i < toks.length; i++) {
      // a voice word may hold a space ("60 000"): join tokens until it matches
      var w = words[k], acc = toks[i];
      while (w && norm(acc) !== norm(w.text) && i + 1 < toks.length && norm(w.text).indexOf(norm(acc)) === 0) acc += ' ' + toks[++i];
      if (!w || norm(acc) !== norm(w.text)) { console.warn('subs: "' + acc + '" does not match voice word ' + k + ' ("' + (w && w.text) + '")'); return; }
      ws.push({ text: acc, w: w, line: 0 }); k++;
    }
    // line index per word
    var n = 0, li = 0;
    lines.forEach(function (l, j) { var c = l.length; while (c > 0 && n < ws.length) { ws[n].line = j; c -= ws[n].text.split(/\s+/).length; n++; } });
    var card = document.createElement('div'); card.className = 'st-cap-card'; card.style.display = 'none';
    var line = document.createElement('div'); line.className = 'st-cap-line'; card.appendChild(line);
    var spans = ws.map(function (o, i) {
      if (i > 0) line.appendChild(o.line !== ws[i - 1].line ? document.createElement('br') : document.createTextNode(' '));
      var s = document.createElement('span'); s.className = 'st-cap-w'; s.textContent = o.text; line.appendChild(s); return s;
    });
    box.appendChild(card);
    cards.push({ card: card, spans: spans, ws: ws, in: ws[0].w.start - LEAD, last: ws[ws.length - 1].w.end });
  });
  if (k !== words.length) console.warn('subs: ' + (words.length - k) + ' voice word(s) have no subtitle card');
  cards.forEach(function (c, i) {
    var next = cards[i + 1], nextIn = next ? next.in : Infinity;
    c.out = Math.min(nextIn, Math.max(c.last + HOLD, c.in + MIN));
  });
  var eo = function (p) { return 1 - Math.pow(1 - p, 3); };
  var cl = function (v) { return Math.min(1, Math.max(0, v)); };
  var shown = null;
  window.SUBS_CARDS = cards.map(function (c) { return { text: c.ws.map(function (o) { return o.text; }).join(' '), in: +c.in.toFixed(3), out: +c.out.toFixed(3) }; });
  ST.onSeek(function (t) {
    var act = null;
    for (var i = 0; i < cards.length; i++) if (t >= cards[i].in && t < cards[i].out) { act = cards[i]; break; }
    if (shown !== act) { if (shown) shown.card.style.display = 'none'; if (act) act.card.style.display = ''; shown = act; }
    if (!act) return;
    var since = t - act.in, until = act.out - t;
    act.card.style.opacity = (cl(since / 0.1) * cl(until / 0.08)).toFixed(3);
    act.card.style.transform = 'scale(' + (0.94 + 0.06 * eo(cl(since / 0.25))).toFixed(4) + ')';
    var cur = -1;
    act.ws.forEach(function (o, j) { if (t >= o.w.start - 0.02) cur = j; });
    act.spans.forEach(function (s, j) {
      var st = j < cur ? 'spoken' : j === cur ? 'active' : 'upcoming';
      if (s.dataset.state !== st) s.dataset.state = st;
    });
  });
})();
