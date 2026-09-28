"""Build the Spanish project from the English one: same page, translated strings, Spanish cue words.

Run after any change to the English project:  python3 project-es/localize_es.py
Copies index.html, scenes.js, cues.js, media/, audio/mix.json (music + sfx only) and showtime.json from
../project into this folder, replacing each on-screen string. Fails loudly if a string is not found, so the
English page and this table cannot drift apart silently. The voice/ folder, narration.es.md and subs.js (the burned subtitles) are Spanish-only.
"""
import json, pathlib, re, shutil, sys

HERE = pathlib.Path(__file__).resolve().parent
EN = HERE.parent / 'project'
ES = HERE

HTML = [
    ('<html lang="en">', '<html lang="es">'),
    ('<title>Kīlauea, 2018: a summary of the USGS preliminary report</title>', '<title>Kīlauea, 2018: resumen del informe preliminar del USGS</title>'),
    ('From the USGS preliminary summary', 'Del resumen preliminar del USGS'),
    ('<p class="sub">Summit collapse and lower East Rift Zone eruption</p>', '<p class="sub">Colapso de la cumbre y erupción en la zona de rift este inferior</p>'),
    ('Lava channel from fissure 8 · USGS overflight, June 11, 2018', 'Canal de lava de la fisura 8 · sobrevuelo del USGS, 11 de junio de 2018'),
    ('<h2>Island of Hawaiʻi</h2>', '<h2>Isla de Hawaiʻi</h2>'),
    ('<p>Kīlauea summit<br>19.42° N, 155.29° W</p>', '<p>Cumbre del Kīlauea<br>19,42° N, 155,29° O</p>'),
    ('aria-label="Page 2 of the USGS preliminary summary"', 'aria-label="Página 2 del resumen preliminar del USGS"'),
    ('the source:<br>2 pages, USGS,<br>Sept 2018', 'la fuente:<br>2 páginas, USGS,<br>sept. 2018'),
    ('How it started · spring 2018', 'Cómo empezó · primavera de 2018'),
    ('text-anchor="middle">Summit</text>', 'text-anchor="middle">Cumbre</text>'),
    ('>Puʻu ʻŌʻō vent</text>', '>Boca Puʻu ʻŌʻō</text>'),
    ('>Lower East Rift Zone</text>', '>Zona de rift este inferior</text>'),
    ('>Leilani Estates area</text>', '>zona de Leilani Estates</text>'),
    ('>magma moves downrift</text>', '>el magma baja</text>'),
    ('schematic, not to scale', 'esquema, sin escala'),
    ('"Apr 30 · Puʻu ʻŌʻō vent collapses","May 3 · Fissure eruptions begin","May 4 · M6.9 earthquake"',
     '"30 abr · Colapsa Puʻu ʻŌʻō","3 may · Empiezan las erupciones fisurales","4 may · Sismo de M6,9"'),
    ('Meanwhile, at the summit', 'Mientras tanto, en la cumbre'),
    ('Summit cross-section, east-west · redrawn from USGS figure (PDF p. 2)', 'Perfil este-oeste · redibujado<br>de una figura del USGS (PDF p.&nbsp;2)'),
    ('<div class="d">MAY 16</div><div class="t">HVO building vacated</div>', '<div class="d">16 DE MAYO</div><div class="t">El HVO desaloja su edificio</div>'),
    ('<div class="d">FROM MAY 29</div><div class="t">Near-daily collapses</div>', '<div class="d">DESDE EL 29 DE MAYO</div><div class="t">Colapsos casi diarios</div>'),
    ('<div class="d">EACH COLLAPSE</div><div class="t">≈ M5 energy</div>', '<div class="d">CADA COLAPSO</div><div class="t">≈ la energía de un sismo M5</div>'),
    ('<h2 class="cue" style="--at: 0.9s">Fissure 8</h2>', '<h2 class="cue" style="--at: 0.9s">Fisura 8</h2>'),
    ('<div class="d">FOUNTAINS</div><div class="t">Up to 200 ft at times</div>', '<div class="d">FUENTES DE LAVA</div><div class="t">Hasta 200 pies (unos 60 m)</div>'),
    ('<div class="d">JUNE 3</div><div class="t">Lava reaches Kapoho Bay</div>', '<div class="d">3 DE JUNIO</div><div class="t">La lava llega a la bahía de Kapoho</div>'),
    ('Fissure 8 · USGS overflight footage, May 29, 2018', 'Fisura 8 · sobrevuelo del USGS, 29 de mayo de 2018'),
    ('Map: fissure 8 channel to the ocean entry at Kapoho · USGS video, June 11, 2018', 'Mapa: canal de la fisura 8 hasta el mar en Kapoho<br>video del USGS, 11 de junio de 2018'),
    ('alt="USGS map of the fissure 8 lava channel to the ocean entry at Kapoho"', 'alt="Mapa del USGS del canal de lava de la fisura 8 hasta la entrada al mar en Kapoho"'),
    ('2018 statistics', 'Estadísticas de 2018'),
    ('data-label="square miles covered by lava"', 'data-label="millas cuadradas cubiertas de lava"'),
    ('<div class="unit">35.5 km²</div>', '<div class="unit">35,5 km²</div>'),
    ('data-label="dwellings destroyed (per Hawaiʻi County)"', 'data-label="viviendas destruidas (según el Condado de Hawaiʻi)"'),
    ('data-label="acres of new land from ocean entries"', 'data-label="acres de tierra nueva por las entradas al mar"'),
    ('<div class="unit">about 354 ha</div>', '<div class="unit">unas 354 ha</div>'),
    ('data-label="earthquakes, Apr 30 – Aug 4"', 'data-label="sismos (30 abr – 4 ago)"'),
    ('Preliminary figures, USGS, Sept 2018', 'Cifras preliminares, USGS, sept. 2018'),
    ('How it ended', 'Cómo terminó'),
    ('<div class="d">AUG 4</div><div class="t">Fissure 8 activity sharply decreases</div>', '<div class="d">4 DE AGOSTO</div><div class="t">La actividad de la fisura 8 disminuye mucho</div>'),
    ('<div class="d">SEPT 22</div><div class="t">National park partially reopens</div>', '<div class="d">22 DE SEPTIEMBRE</div><div class="t">El parque nacional reabre en parte</div>'),
    ('<p>Summit collapse and lower East Rift Zone eruption</p>', '<p>Colapso de la cumbre y erupción en la zona de rift este inferior</p>'),
]
CREDIT_RE = re.compile(r'<b>Source:</b>.*?Not endorsed by USGS\.', re.S)
CREDIT_ES = ('<b>Fuente:</b> Observatorio Volcánico de Hawaiʻi del USGS, resumen preliminar, sept. 2018. '
             'Video: USGS. Dominio público. Sin respaldo del USGS.')
# Spanish layout: the burned subtitles take the bottom band, so the corner tags and the notes move up.
CSS_ES = """
  /* ---- Spanish copy: burned subtitles own the bottom band (y > 80 %) */
  .ftag { bottom: auto; top: 7.5cqh; left: auto; right: 6cqw; text-align: right; }
  #hook .copy { bottom: 23cqh; }
  #hook h1 { font-size: 14cqh; }
  #fissure8 .card8 { bottom: 23cqh; }
  #summit .src { bottom: auto; top: 71cqh; left: 67cqw; right: 4cqw; font-size: 2.4cqh; line-height: 1.35; white-space: nowrap; }
  #summit .xs { top: 13cqh; height: 68cqh; }
  #numbers .prelim { bottom: auto; top: 7.5cqh; left: auto; right: 6cqw; }
  #numbers .grid4 { bottom: 21cqh; top: 15cqh; }
  #numbers .cell [data-st="count-up"] { --cu-size: 13cqh; }
  #numbers .st-cu-label { font-size: 3.3cqh; }
  #start .steps { top: 62cqh; }
  #start .st-step-label { max-width: 28cqw; font-size: 3.3cqh; }
  #end .call .t { font-size: 4.8cqh; }
  .credit { bottom: 20cqh; }
  #card .inner { margin-top: -22cqh; }
  /* burned subtitles (subs.js, caption-karaoke boxed-pill look): ink plate, cream words, the spoken word in lava orange */
  :root { --cap-font: 'Bricolage Grotesque', 'Space Grotesk', sans-serif; --cap-weight: 650;
          --cap-plate: rgb(28 25 21 / 0.86); --cap-ink: #fffaf0; --cap-accent: #ffb08a; }
  .st-cap-boxed-pill .st-cap-w[data-state="upcoming"] { opacity: 0.78; }
  /* footage tags sit at the top in this copy, often on bright sky: each gets an ink plate (>= 4.5:1) */
  .ftag { line-height: 1.45; background: rgb(20 16 13 / 0.74); padding: 0.9cqh 1.4cqh 1cqh; border-radius: 0.8cqh; }
  /* the source note sits higher, clear of two-line subtitle cards */
  #where .note { top: 57cqh; }
  /* subtitles are drawn by subs.js from the voice's word times, one card per phrase */
  #subs { left: 5%; right: 5%; bottom: 6.5%; font-size: 4.7cqh; }
  #subs .st-cap-line { max-width: 100%; }
</style>"""
# decimal comma and space grouping for the count-ups (the component formats with en-US)
NUM_SHIM = """<script>
  (function () {
    var orig = Number.prototype.toLocaleString;
    Number.prototype.toLocaleString = function (loc, opt) {
      var s = orig.call(this, 'en-US', opt);
      return loc === 'en-US' ? s.replace(/,/g, '\\u00a0').replace('.', ',') : orig.call(this, loc, opt);
    };
  })();
</script>
<script type="module" src="/_st/components/index.js"></script>"""

SCENES = [
    ("callSep.style.top = '57cqh'", "callSep.style.top = '51cqh'"),
    ("var MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUNE', 'JULY', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'];",
     "var MONTHS = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEPT', 'OCT', 'NOV', 'DIC'];"),
    ("re.hl.textContent = MONTHS[dt.getUTCMonth()] + ' ' + dt.getUTCDate();", "re.hl.textContent = dt.getUTCDate() + ' ' + MONTHS[dt.getUTCMonth()];"),
    ("'elevation (m)'", "'altitud (m)'"),
    ("'east-west distance'", "'distancia este-oeste'"),
    ("'April 2018'", "'Abril de 2018'"),
    ("'August 2018'", "'Agosto de 2018'"),
    ("'500+ m drop'", "'500+ m de hundimiento'"),
    ("'(1,600+ ft) at the deepest point'", "'(1600+ pies) en el punto más hondo'"),
    ("{ text: 'APR 30 TO MAY 4'", "{ text: '30 ABR A 4 MAY'"),
    ("{ text: 'SEPT 22', day: 145", "{ text: '22 SEPT', day: 145"),
    ("{ text: 'APR 30', day: 0", "{ text: '30 ABR', day: 0"),
    ("{ text: 'MAY 29', day: 29 }", "{ text: '29 MAY', day: 29 }"),
    ("{ text: 'JUNE 3', day: 34, up: true }", "{ text: '3 JUN', day: 34, up: true }"),
]
CUES = [
    ("'where-place': ['where', 'kīlauea', 1, -0.1]", "'where-place': ['where', 'kīlauea', 1, -0.1]"),
    ("'where-mark': ['where', 'island', 1, 0]", "'where-mark': ['where', 'isla', 1, 0]"),
    ("'where-doc': ['where', 'this', 1, 0.2]", "'where-doc': ['where', 'este', 1, 0.2]"),
    ("'s1': ['start', 'april', 1, -0.1]", "'s1': ['start', '30', 1, -0.1]"),
    ("'s2': ['start', 'fissure', 1, -0.1]", "'s2': ['start', 'erupciones', 1, -0.1]"),
    ("'s3': ['start', 'magnitude', 1, -0.1]", "'s3': ['start', 'sismo', 1, -0.1]"),
    ("'summit-sank': ['summit', 'summit', 1, 0]", "'summit-sank': ['summit', 'cumbre', 1, 0]"),
    ("'summit-hvo': ['summit', 'mid-may', 1, -0.1]", "'summit-hvo': ['summit', 'mediados', 1, -0.1]"),
    ("'summit-may29': ['summit', 'may', 1, -0.1]", "'summit-may29': ['summit', 'desde', 1, -0.1]"),
    ("'summit-collapse': ['summit', 'collapsed', 1, 0]", "'summit-collapse': ['summit', 'colapsó', 1, 0]"),
    ("'summit-m5': ['summit', 'magnitude', 1, -0.15]", "'summit-m5': ['summit', 'energía', 1, -0.15]"),
    ("'f8-200': ['fissure8', '200', 1, -0.2]", "'f8-200': ['fissure8', '200', 1, -0.2]"),
    ("'f8-cut': ['fissure8', 'its', 1, -0.35]", "'f8-cut': ['fissure8', 'su', 1, -0.35]"),
    ("'f8-june': ['fissure8', 'reached', 1, -0.1]", "'f8-june': ['fissure8', 'llegó', 1, -0.1]"),
    ("'n1': ['numbers', '13.7', 1, -0.3]", "'n1': ['numbers', '13,7', 1, -0.3]"),
    ("'n2': ['numbers', '716', 1, -0.3]", "'n2': ['numbers', 'condado', 1, -0.1]"),
    ("'n3': ['numbers', '875', 1, -0.3]", "'n3': ['numbers', '875', 1, -0.3]"),
    ("'n4': ['numbers', '60,000', 1, -0.3]", "'n4': ['numbers', '60 000', 1, -0.3]"),
    ("'end-aug': ['end', 'early', 1, -0.15]", "'end-aug': ['end', 'principios', 1, -0.15]"),
    ("'end-sep': ['end', 'september', 1, -0.15]", "'end-sep': ['end', 'septiembre', 1, -0.15]"),
]


def swap(text, pairs, name):
    for a, b in pairs:
        if a not in text:
            sys.exit(f'{name}: not found: {a!r}')
        text = text.replace(a, b)
    return text


def main():
    ES.mkdir(exist_ok=True)
    html = (EN / 'index.html').read_text(encoding='utf-8')
    html = swap(html, HTML, 'index.html')
    html, n = CREDIT_RE.subn(CREDIT_ES, html)
    assert n == 1, 'credit line not found'
    html = swap(html, [('  <!-- credit line:', '  <!-- burned Spanish subtitles: phrase cards from voice/captions.words.json (subs.js), per-word highlight -->\n  <div id="subs" class="st-cap st-cap-boxed-pill" data-caption></div>\n\n  <!-- credit line:'),
                       ('<script src="scenes.js"></script>', '<script src="scenes.js"></script>\n<script src="subs.js"></script>'),
                       ('</style>', CSS_ES), ('<script type="module" src="/_st/components/index.js"></script>', NUM_SHIM)], 'index.html')
    (ES / 'index.html').write_text(html, encoding='utf-8')
    (ES / 'scenes.js').write_text(swap((EN / 'scenes.js').read_text(encoding='utf-8'), SCENES, 'scenes.js'), encoding='utf-8')
    (ES / 'cues.js').write_text(swap((EN / 'cues.js').read_text(encoding='utf-8'), CUES, 'cues.js'), encoding='utf-8')
    if (ES / 'media').exists():
        shutil.rmtree(ES / 'media')
    shutil.copytree(EN / 'media', ES / 'media')
    shutil.copy2(EN / 'lexicon.json', ES / 'lexicon.json')
    mix = json.loads((EN / 'audio' / 'mix.json').read_text(encoding='utf-8'))
    mix['tracks'] = [t for t in mix['tracks'] if t.get('kind') != 'voice']
    (ES / 'audio').mkdir(exist_ok=True)
    (ES / 'audio' / 'mix.json').write_text(json.dumps(mix, indent=1, ensure_ascii=False), encoding='utf-8')
    cfg = json.loads((EN / 'showtime.json').read_text(encoding='utf-8'))
    cfg['expect'] = {'duration': 81.3, 'tolerance': 0.5, 'platform': 'youtube', 'lufs': -14, 'captions': True, 'audio': True,
                     'must_show': [{'text': '13,7', 'at': 62}, {'text': '716', 'at': 62}], 'max_size_mb': 30}
    cfg.update({'title': 'Kīlauea, 2018 (ES)', 'subtitle': 'Resumen en 80 segundos del informe preliminar del USGS sobre la erupción de 2018 en la zona de rift este inferior y el colapso de la cumbre.', 'kicker': 'Explicativo · fuente USGS'})
    (ES / 'showtime.json').write_text(json.dumps(cfg, indent=2, ensure_ascii=False), encoding='utf-8')
    print('ES project written:', ES)


if __name__ == '__main__':
    main()
