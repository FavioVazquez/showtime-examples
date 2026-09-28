/* Tidepool Basics: the series kit. Everything the episodes share lives here. Edit it HERE (the
 * series root), then run `showtime series sync <series>` to copy it into every episode.
 *
 *   KIT.brand / palette / look / fonts           the series look (a deep tide-pool teal around the app)
 *   KIT.state(), KIT.drawApp(T, st), KIT.rects(st) the Tidepool app, drawn procedurally from its own
 *                                                  CSS tokens and seed notes, with named hit-rects
 *                                                  ('newNote', 'item:welcome', 'tag:planning' ...)
 *   KIT.act.*                                      what the app does (new note, add tag, palette ...):
 *                                                  state events for Film.fold, one per user action
 *   KIT.voice(data)                                narration timeline -> word times, captions, duck spans
 *   KIT.intro / band / captions / keycaps / recap / outro     the series chrome
 *   KIT.sound.*                                    signature motif, UI sounds and the recurring bed
 *   KIT.episode(spec)                              one call: an episode from its timeline table
 *
 * Every frame is a pure function of T. Icons: Lucide (ISC), license text beside this file in the series folder.
 * The app (examples/_apps/tidepool) is fictional demo material; so is everything shown here.
 */
'use strict';

var KIT = (function () {
  var F = Film;
  var K = {};

  // ================================================================== series look
  K.brand = {
    series: 'Tidepool Basics',
    product: 'Tidepool',
    url: 'localhost:8080',
    key: 'F',                                   // motif and bed key
    closing: 'Your notes, on your device.',
  };
  K.palette = {
    bg: '#06282E', bg2: '#0A3840', ink: '#EAF6F5', muted: '#93B8BB', faint: '#4E767B',
    accent: '#3CC5C0', accent2: '#FFB38A', accent3: '#F07A5B', good: '#3CC5C0', warn: '#FFB38A', bad: '#F07A5B',
    panel: '#0F2A30', panel2: '#133840', line: 'rgba(234,246,245,0.12)', shadow: 'rgba(0,0,0,0.45)',
  };
  function backdrop(T, g, drift) {
    var w = 1920, h = 1080;
    g.fillStyle = '#06282E'; g.fillRect(0, 0, w, h);
    var r = Math.max(w, h);
    // on the cards (intro, recap, outro) the light drifts slowly, so a held card is never a still frame
    var ax = w * (0.18 + (drift ? 0.12 * Math.sin(T * 0.35) : 0)), ay = h * (0.05 + (drift ? 0.1 * Math.cos(T * 0.29) : 0));
    var a = g.createRadialGradient(ax, ay, 0, ax, ay, r * 0.8);
    a.addColorStop(0, 'rgba(20,163,160,0.30)'); a.addColorStop(1, 'rgba(20,163,160,0)');
    g.fillStyle = a; g.fillRect(0, 0, w, h);
    var b = g.createRadialGradient(w * 0.92, h * 1.05, 0, w * 0.92, h * 1.05, r * 0.55);
    b.addColorStop(0, 'rgba(240,122,91,0.13)'); b.addColorStop(1, 'rgba(240,122,91,0)');
    g.fillStyle = b; g.fillRect(0, 0, w, h);
    // still rings of a tide pool, bottom left
    g.save();
    g.strokeStyle = 'rgba(111,208,200,0.07)'; g.lineWidth = Math.max(1, h / 540);
    for (var i = 1; i <= 6; i++) { g.beginPath(); g.ellipse(w * 0.06, h * 0.98, w * 0.07 * i, h * 0.05 * i, 0, 0, Math.PI * 2); g.stroke(); }
    g.restore();
  }
  K.look = { base: 'dark', backdrop: backdrop, grain: 0.012, vignette: 0.16 };
  K.fonts = ['400 1em "Inter Variable"', '500 1em "Inter Variable"', '600 1em "Inter Variable"', '700 1em "Inter Variable"',
    '800 1em "Inter Variable"', '400 1em "JetBrains Mono Variable"'];

  // ================================================================== layout
  // The app is drawn in its own CSS pixels (a 1350 x 657.5 viewport, the width where Tidepool shows
  // sidebar, list and a split editor) and scaled into the browser window.
  var WIN = { x: 110, y: 90, w: 1700, h: 874 }, BAR = 46;
  var PAGE = { x: WIN.x, y: WIN.y + BAR, w: WIN.w, h: WIN.h - BAR };
  var U = PAGE.w / 1350, VW = 1350, VH = PAGE.h / U;
  K.WIN = WIN; K.PAGE = PAGE; K.U = U;
  K.CAPTION_Y = 1018;
  K.BAND_H = 72;

  // ================================================================== app tokens (styles.css)
  var THEMES = {
    light: {
      bg: '#F6F8F8', sidebar: '#EEF3F3', surface: '#FFFFFF', surface2: '#F3F6F6', hover: 'rgba(11,95,107,0.06)',
      active: 'rgba(14,138,140,0.12)', text: '#0F1E22', text2: '#3D5157', muted: '#6A7F85', faint: '#9AADB2',
      border: '#DFE7E8', borderStrong: '#CBD7D9', accent: '#0E8A8C', accentSoft: '#DDF3F1', accentText: '#0A6670',
      onAccent: '#FFFFFF', mark: 'rgba(255,179,138,0.45)', codeBg: '#F1F5F5', btn: ['#14A3A0', '#0E8A8C'],
      overlay: 'rgba(7,30,35,0.32)', itemActiveLine: 'rgba(20,163,160,0.22)', shadow: 'rgba(7,40,46,0.22)', chrome: 'light',
      tokK: '#0B7FA3', tokS: '#B0582D', tokN: '#8B4FB8',
    },
    dark: {
      bg: '#0A1316', sidebar: '#0D1A1E', surface: '#0F1D21', surface2: '#13252A', hover: 'rgba(111,208,200,0.06)',
      active: 'rgba(60,197,192,0.14)', text: '#E3EEEF', text2: '#B7C8CB', muted: '#86A0A6', faint: '#5C767C',
      border: '#1C3137', borderStrong: '#274248', accent: '#3CC5C0', accentSoft: 'rgba(60,197,192,0.14)', accentText: '#7FDDD7',
      onAccent: '#062A2F', mark: 'rgba(255,179,138,0.28)', codeBg: '#0B171A', btn: ['#45CFC9', '#2FB3AE'],
      overlay: 'rgba(0,0,0,0.5)', itemActiveLine: 'rgba(60,197,192,0.22)', shadow: 'rgba(0,0,0,0.55)', chrome: 'dark',
      tokK: '#6FD8D2', tokS: '#FFB38A', tokN: '#C7A6F0',
    },
  };
  var CORAL = '#F07A5B', BRAND300 = '#6FD0C8', BRAND500 = '#14A3A0';
  // The app's secondary text (its muted and faint tokens: dates, counts, snippets) is UI detail drawn
  // exactly as the app draws it: `showtime check` notes its contrast (the app's design) instead of warning.
  var LOWKEY = { '#6A7F85': 1, '#9AADB2': 1, '#86A0A6': 1, '#5C767C': 1 };
  function atext(str, x, y, o) {
    if (o && typeof o.color === 'string' && LOWKEY[o.color.toUpperCase()]) o = Object.assign({}, o, { decor: true });
    return F.text(str, x, y, o);
  }
  var NOTEBOOKS = [
    { id: 'inbox', name: 'Inbox', icon: 'inbox', color: '#14A3A0' },
    { id: 'work', name: 'Work', icon: 'briefcase', color: '#3B82C4' },
    { id: 'reading', name: 'Reading', icon: 'book-open', color: '#C98A2E' },
    { id: 'personal', name: 'Personal', icon: 'heart', color: '#E0694F' },
  ];
  function nbById(id) { for (var i = 0; i < NOTEBOOKS.length; i++) if (NOTEBOOKS[i].id === id) return NOTEBOOKS[i]; return NOTEBOOKS[0]; }

  // Lucide icons (ISC), 24-unit paths, drawn with a 2-unit round stroke like the app
  var ICON = {
    search: 'm21 21-4.34-4.34 M3 11a8 8 0 1 0 16 0a8 8 0 1 0 -16 0',
    plus: 'M5 12h14 M12 5v14',
    files: 'M15 2h-4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8 M16.706 2.706A2.4 2.4 0 0 0 15 2v5a1 1 0 0 0 1 1h5a2.4 2.4 0 0 0-.706-1.706z M5 7a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h8a2 2 0 0 0 1.732-1',
    pin: 'M12 17v5 M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z',
    inbox: 'M22 12L16 12L14 15L10 15L8 12L2 12 M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z',
    briefcase: 'M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16 M4 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-16a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2z',
    'book-open': 'M12 5v16 M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z',
    heart: 'M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5',
    'file-text': 'M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z M14 2v5a1 1 0 0 0 1 1h5 M10 9H8 M16 13H8 M16 17H8',
    hash: 'M4 9L20 9 M4 15L20 15 M10 3L8 21 M16 3L14 21',
    keyboard: 'M10 8h.01 M12 12h.01 M14 8h.01 M16 12h.01 M18 8h.01 M6 8h.01 M7 16h10 M8 12h.01 M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-16a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2z',
    moon: 'M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401',
    sun: 'M8 12a4 4 0 1 0 8 0a4 4 0 1 0 -8 0 M12 2v2 M12 20v2 M4.93 4.93l1.41 1.41 M17.66 17.66l1.41 1.41 M2 12h2 M20 12h2 M6.34 17.66l-1.41 1.41 M19.07 4.93l-1.41 1.41',
    pencil: 'M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z M15 5l4 4',
    'columns-2': 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2z M12 3v18',
    eye: 'M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0 M9 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0',
    'trash-2': 'M10 11v6 M14 11v6 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6 M3 6h18 M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
    'hard-drive': 'M10 16h.01 M2.212 11.577a2 2 0 0 0-.212.896V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5.527a2 2 0 0 0-.212-.896L18.55 5.11A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z M21.946 12.013H2.054 M6 16h.01',
    x: 'M18 6 6 18 M6 6l12 12',
    layers: 'M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12 M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17',
    chevron: 'm6 9 6 6 6-6',
  };
  var PATHS = {};
  function icon(name, x, y, size, color, width) {
    var g = F.g, p = PATHS[name] || (PATHS[name] = new Path2D(ICON[name]));
    g.save();
    g.translate(x, y); g.scale(size / 24, size / 24);
    g.strokeStyle = color; g.lineWidth = width || 2; g.lineCap = 'round'; g.lineJoin = 'round';
    g.stroke(p);
    g.restore();
  }
  var LOGO = {
    w1: new Path2D('M-2 40c5.5 0 5.5-5 11-5s5.5 5 11 5 5.5-5 11-5 5.5 5 11 5 5.5-5 11-5 5.5 5 11 5V66H-2z'),
    w2: new Path2D('M-2 47c5.5 0 5.5-5 11-5s5.5 5 11 5 5.5-5 11-5 5.5 5 11 5 5.5-5 11-5 5.5 5 11 5V66H-2z'),
    line: new Path2D('M12 33c3.3 0 3.3-4 6.7-4s3.3 4 6.6 4 3.4-4 6.7-4 3.3 4 6.7 4 3.3-4 6.6-4 3.4 4 6.7 4'),
  };
  /** The Tidepool mark (logo.svg), size px square at (x, y). */
  function logo(x, y, size) {
    var g = F.g;
    g.save();
    g.translate(x, y); g.scale(size / 64, size / 64);
    var gr = g.createLinearGradient(8, 4, 56, 60); gr.addColorStop(0, '#22B8B0'); gr.addColorStop(1, '#0B5F6B');
    g.beginPath(); F.rr(2, 2, 60, 60, 18); g.fillStyle = gr; g.fill();
    g.save(); g.beginPath(); F.rr(2, 2, 60, 60, 18); g.clip();
    g.globalAlpha *= 0.55; g.fillStyle = '#0A4C57'; g.fill(LOGO.w1);
    g.globalAlpha = g.globalAlpha / 0.55 * 0.7; g.fillStyle = '#083E48'; g.fill(LOGO.w2);
    g.restore();
    g.strokeStyle = '#FFFFFF'; g.lineWidth = 3.6; g.lineCap = 'round'; g.lineJoin = 'round'; g.stroke(LOGO.line);
    g.beginPath(); g.arc(42, 18, 6, 0, Math.PI * 2); g.fillStyle = '#FFB38A'; g.fill();
    g.restore();
  }
  K.logo = logo;

  // ================================================================== seed notes (the app's own)
  var SEED = [
    { id: 'welcome', title: 'Welcome to Tidepool', notebook: 'inbox', tags: ['guide'], pinned: true, date: 'Sep 25', upd: 2509.0941, body: [
      'Tidepool keeps your notes **on this device**. There is no account and no server: everything you write is saved in this browser.', '',
      '## Get around quickly', '',
      '- **Cmd K** (Ctrl K on Windows and Linux) searches every note, tag and command',
      '- **N** starts a new note, **J** and **K** move through the list',
      '- **Cmd E** flips between writing and the rendered preview',
      '- **?** shows every shortcut', '',
      '## Markdown, rendered as you type', '',
      'Write `# headings`, **bold**, _italics_, `inline code`, and link notes together like [[Q4 planning draft]].', '',
      '- [x] Open Tidepool', '- [ ] Write your first note', '- [ ] Try the command palette', '',
      '> Tags live under the title. Click one in the sidebar to filter the list.'].join('\n') },
    { id: 'q4-planning', title: 'Q4 planning draft', notebook: 'work', tags: ['planning', 'work'], pinned: false, date: 'Sep 25', upd: 2509.1620, body: [
      '## Themes', '', '1. Make search feel instant on large notebooks', '2. Export everything as plain Markdown files',
      '3. Fewer clicks between capture and review', '', '## Open questions', '',
      '- Should tags be nestable (`#work/hiring`)?', '- What is the smallest useful version of export?', '',
      '## This week', '', '- [x] Collect feedback from the design review', '- [ ] Draft the export spec',
      '- [ ] Share with the team on Friday', '', 'Related: [[Standup, Sep 24]]'].join('\n') },
    { id: 'standup-sep-24', title: 'Standup, Sep 24', notebook: 'work', tags: ['meetings'], pinned: false, date: 'Sep 24', upd: 2409.0952, body: [
      '**Maya**: finished the empty states, starting on the palette polish.', '',
      '**Jonas**: search index rebuild is 40% done. Blocked on a test fixture.', '',
      '**Priya**: reviewing the export spec, notes by Thursday.', '', '### Follow-ups', '',
      '- [ ] Pair with Jonas on the fixture', '- [x] Move the retro to Friday'].join('\n') },
    { id: 'debounce-snippet', title: 'Snippet: debounce', notebook: 'work', tags: ['code', 'javascript'], pinned: false, date: 'Sep 22', upd: 2209.1105, body: [
      'Small helper for autosave: wait until typing pauses, then write once.', '', '```js',
      'function debounce(fn, wait = 300) {', '  let timer;', '  return (...args) => {', '    clearTimeout(timer);',
      '    timer = setTimeout(() => fn(...args), wait);', '  };', '}', '', '// Save at most once per pause in typing',
      'const save = debounce(() => store.write(notes), 400);', '```', '',
      'Use `leading: true` variants for buttons, trailing for text input.'].join('\n') },
    { id: 'local-first', title: 'Notes on local-first software', notebook: 'reading', tags: ['ideas', 'research'], pinned: false, date: 'Sep 21', upd: 2109.2114, body: [
      'From the Ink & Switch essay [Local-first software](https://www.inkandswitch.com/local-first/) (2019). Its seven ideals:', '',
      '1. No spinners: your work at your fingertips', '2. Your work is not trapped on one device', '3. The network is optional',
      '4. Seamless collaboration with your colleagues', '5. The Long Now', '6. Security and privacy by default',
      '7. You retain ultimate ownership and control', '',
      '> The core idea: the copy on your own device is the primary copy. Servers, if any, are there to help sync.', '',
      'Tidepool only does the first part so far: notes stay in this browser.'].join('\n') },
    { id: 'reading-list', title: 'Reading list: autumn', notebook: 'reading', tags: ['books'], pinned: false, date: 'Sep 19', upd: 1909.2230, body: [
      '| Book | Author | Status |', '| --- | --- | --- |', '| Thinking in Systems | Donella Meadows | Reading |',
      '| The Design of Everyday Things | Don Norman | Done |', '| How Buildings Learn | Stewart Brand | Next |',
      '| A Pattern Language | Christopher Alexander et al. | Someday |', '',
      'Keep notes per chapter, one line each. Link back to [[Notes on local-first software]] where it fits.'].join('\n') },
    { id: 'sourdough', title: 'Sourdough schedule', notebook: 'personal', tags: ['recipes'], pinned: false, date: 'Sep 14', upd: 1409.1845, body: [
      '### Friday night', '', '- [ ] Feed the starter (1:1:1)', '', '### Saturday', '',
      '1. **9:00** mix 500 g flour + 350 g water, rest 1 h', '2. **10:00** add 100 g starter and 10 g salt',
      '3. **10:30 to 13:00** four sets of stretch and folds', '4. **Afternoon** bulk rise until about 50% bigger',
      '5. Shape, then into the fridge overnight', '', '### Sunday', '', 'Bake at 250 °C: 20 min lid on, 25 min lid off.'].join('\n') },
    { id: 'weekly-review', title: 'Weekly review', notebook: 'personal', tags: ['templates', 'planning'], pinned: false, date: 'Sep 13', upd: 1309.1010, body: [
      'A short template. Duplicate it every Sunday.', '', '## Look back', '', '- What moved forward this week?',
      '- What got stuck, and why?', '', '## Look ahead', '', '- [ ] Clear the Inbox notebook', '- [ ] Pick three priorities',
      '- [ ] Block time for deep work', '', '---', '', '_Keep it under 15 minutes._'].join('\n') },
  ];
  function clone(v) { return JSON.parse(JSON.stringify(v)); }

  // ================================================================== the app's state and logic
  /**
   * The app as an episode starts it. extra: notes to add ([{id, title, notebook, tags, pinned,
   * date, upd, body}]) and fields to override ({activeId, mode, theme, filter}).
   */
  K.state = function (extra) {
    extra = extra || {};
    var s = {
      theme: 'light', mode: 'split', filter: { kind: 'all' }, listQuery: '', activeId: 'welcome',
      notes: clone(SEED).concat(clone(extra.notes || [])),
      focus: '', tagDraft: '', palette: null, menu: '', editT: -9, typing: '',
      hover: '', pressed: '', pressT: -1, born: {}, reorder: null, upd: 9999,
    };
    for (var k in extra) if (k !== 'notes') s[k] = clone(extra[k]);
    return s;
  };
  function active(s) { for (var i = 0; i < s.notes.length; i++) if (s.notes[i].id === s.activeId) return s.notes[i]; return null; }
  function terms(q) { return String(q || '').toLowerCase().split(/\s+/).filter(Boolean); }
  function matches(n, ts) {
    if (!ts.length) return true;
    var hay = (n.title + '\n' + n.body + '\n' + n.tags.map(function (t) { return '#' + t; }).join(' ')).toLowerCase();
    return ts.every(function (t) { return hay.indexOf(t) >= 0; });
  }
  function score(n, ts) {
    var s = 0, title = n.title.toLowerCase(), body = n.body.toLowerCase();
    ts.forEach(function (t) {
      if (title.indexOf(t) === 0) s += 12; else if (title.indexOf(t) >= 0) s += 8;
      var bare = t.replace(/^#/, '');
      if (n.tags.some(function (g) { return g.indexOf(bare) >= 0; })) s += 4;
      var idx = body.indexOf(t), c = 0;
      while (idx >= 0 && c < 5) { c++; idx = body.indexOf(t, idx + t.length); }
      s += c;
    });
    return s + (n.pinned ? 0.5 : 0);
  }
  function sortNotes(list) { return list.slice().sort(function (a, b) { return (b.pinned - a.pinned) || (b.upd - a.upd); }); }
  function visible(s) {
    var f = s.filter, ts = terms(s.listQuery);
    return sortNotes(s.notes.filter(function (n) {
      if (f.kind === 'pinned' && !n.pinned) return false;
      if (f.kind === 'notebook' && n.notebook !== f.value) return false;
      if (f.kind === 'tag' && n.tags.indexOf(f.value) < 0) return false;
      return matches(n, ts);
    }));
  }
  function filterTitle(s) {
    var f = s.filter;
    return f.kind === 'pinned' ? 'Pinned' : f.kind === 'notebook' ? nbById(f.value).name : f.kind === 'tag' ? '#' + f.value : 'All notes';
  }
  function plainText(md) {
    return md.replace(/```[\s\S]*?```/g, ' ').replace(/^\s*\|?\s*:?-{3,}.*$/gm, ' ').replace(/\[\[([^\]]+)\]\]/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/^\s*(#{1,6}|>|[-*]|\d+\.)\s+/gm, '').replace(/\[( |x)\]\s/g, '')
      .replace(/[*_`|~]/g, '').replace(/\s+/g, ' ').trim();
  }
  function snippetText(md) {
    var lines = md.replace(/```[\s\S]*?```/g, '').split('\n'), out = [];
    for (var i = 0; i < lines.length; i++) {
      var l = lines[i];
      if (/^\s*$/.test(l) || /^#{1,6}\s/.test(l) || /^(-{3,}|\*{3,})\s*$/.test(l) || /^\s*\|?\s*:?-{3,}/.test(l)) continue;
      if (/\|/.test(l) && i + 1 < lines.length && /^\s*\|?\s*:?-{3,}/.test(lines[i + 1])) continue;
      var cells = /^\s*\|/.test(l) ? l.trim().replace(/^\||\|$/g, '').split('|').map(function (c) { return c.trim(); }).join(', ') : l;
      var t = plainText(cells);
      if (t) out.push(t);
    }
    return out.join(' · ');
  }
  function snippetFor(n, ts) {
    var text = snippetText(n.body);
    if (!ts.length) return text.slice(0, 160);
    var lower = text.toLowerCase(), at = -1;
    for (var i = 0; i < ts.length && at < 0; i++) at = lower.indexOf(ts[i]);
    if (at < 0) return text.slice(0, 160);
    var start = Math.max(0, at - 40);
    return (start > 0 ? '…' : '') + text.slice(start, start + 160);
  }
  /** Runs of text with the search terms marked (the app's <mark>). */
  function marked(text, ts, style) {
    style = style || {};
    if (!ts.length) return [Object.assign({ t: text }, style)];
    var re = new RegExp('(' + ts.map(function (t) { return t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|') + ')', 'gi');
    var out = [], last = 0, m;
    while ((m = re.exec(text))) {
      if (m.index > last) out.push(Object.assign({ t: text.slice(last, m.index) }, style));
      out.push(Object.assign({ t: m[0], m: true }, style));
      last = re.lastIndex;
      if (m[0].length === 0) re.lastIndex++;
    }
    if (last < text.length) out.push(Object.assign({ t: text.slice(last) }, style));
    return out;
  }
  var MOD = '⌘';
  function commands(s) {
    var n = active(s);
    var list = [
      { id: 'new-note', title: 'New note', icon: 'plus', keys: ['N'] },
      { id: 'toggle-theme', title: 'Toggle light / dark theme', icon: 'moon', keys: ['Shift', MOD, 'L'] },
      { id: 'mode-edit', title: 'Editor only', icon: 'pencil' },
      { id: 'mode-split', title: 'Split editor and preview', icon: 'columns-2', keys: [MOD, '\\'] },
      { id: 'mode-preview', title: 'Preview only', icon: 'eye', keys: [MOD, 'E'] },
      { id: 'shortcuts', title: 'Show keyboard shortcuts', icon: 'keyboard', keys: ['?'] },
    ];
    if (n) list.splice(1, 0, { id: 'pin', title: n.pinned ? 'Unpin this note' : 'Pin this note', icon: 'pin', keys: ['P'] });
    NOTEBOOKS.forEach(function (nb) { list.push({ id: 'go-' + nb.id, title: 'Go to ' + nb.name, icon: nb.icon, nb: nb.id }); });
    list.push({ id: 'reset', title: 'Restore sample notes', icon: 'layers' });
    return list;
  }
  /** The palette's results for its current query, grouped the way the app groups them. */
  function paletteItems(s) {
    var items = [], q = s.palette ? s.palette.query.trim() : '';
    function cmd(c) { return { type: 'command', group: 'Commands', id: c.id, title: c.title, icon: c.icon, keys: c.keys, nb: c.nb }; }
    function note(n, ts, group) {
      return { type: 'note', group: group, id: n.id, titleRuns: marked(n.title || 'Untitled', ts),
        subRuns: [{ t: nbById(n.notebook).name + ' · ' }].concat(marked(snippetFor(n, ts), ts)), icon: 'file-text', hint: n.date };
    }
    if (q.charAt(0) === '>') {
      var cts = terms(q.slice(1));
      commands(s).filter(function (c) { return cts.every(function (t) { return c.title.toLowerCase().indexOf(t) >= 0; }); }).forEach(function (c) { items.push(cmd(c)); });
      return items;
    }
    if (q.charAt(0) === '#') {
      var tq = q.slice(1).toLowerCase(), counts = {};
      s.notes.forEach(function (n) { n.tags.forEach(function (g) { counts[g] = (counts[g] || 0) + 1; }); });
      Object.keys(counts).filter(function (g) { return g.indexOf(tq) >= 0; }).sort().forEach(function (g) {
        items.push({ type: 'tag', group: 'Tags', id: 'tag-' + g, tag: g, titleRuns: [{ t: '#' + g }], subRuns: [{ t: counts[g] + ' note' + (counts[g] === 1 ? '' : 's') }], icon: 'hash' });
      });
      return items;
    }
    var ts = terms(q);
    if (!ts.length) {
      sortNotes(s.notes).slice(0, 5).forEach(function (n) { items.push(note(n, [], 'Recent')); });
      commands(s).slice(0, 4).forEach(function (c) { items.push(cmd(c)); });
      return items;
    }
    s.notes.filter(function (n) { return matches(n, ts); }).map(function (n) { return { n: n, s: score(n, ts) }; })
      .sort(function (a, b) { return b.s - a.s || b.n.upd - a.n.upd; }).slice(0, 8)
      .forEach(function (x) { items.push(note(x.n, ts, 'Notes')); });
    commands(s).filter(function (c) { return ts.every(function (t) { return c.title.toLowerCase().indexOf(t) >= 0; }); }).slice(0, 4)
      .forEach(function (c) { items.push(cmd(c)); });
    return items;
  }

  // ================================================================== actions (state events)
  // Each returns fn(s, dt, T) for Film.fold: the app's behaviour for one user action.
  function evT(dt, T) { return T - dt; }
  function setFilterOn(s, f) {
    s.filter = f;
    var list = visible(s);
    if (!list.some(function (n) { return n.id === s.activeId; })) s.activeId = list.length ? list[0].id : null;
  }
  var A = K.act = {};
  A.newNote = function (id) {
    return function (s, dt, T) {
      var f = s.filter;
      s.notes.push({ id: id, title: '', body: '', notebook: f.kind === 'notebook' ? f.value : 'inbox', tags: f.kind === 'tag' ? [f.value] : [],
        pinned: false, date: 'Just now', upd: s.upd++ });
      s.listQuery = ''; if (f.kind === 'pinned') s.filter = { kind: 'all' };
      s.activeId = id; s.focus = 'title'; s.born[id] = evT(dt, T);
      if (s.mode === 'preview') s.mode = 'split';
    };
  };
  A.focus = function (field) { return function (s) { s.focus = field || ''; if (field === 'body' && s.mode === 'preview') s.mode = 'split'; }; };
  A.blur = function () { return function (s) { s.focus = ''; }; };
  /** Enter in the body on a list line: the list continues ("- [ ] ", "- ", "2."). */
  A.listEnter = function () {
    return function (s, dt, T) {
      var n = active(s); if (!n) return;
      var line = n.body.slice(n.body.lastIndexOf('\n') + 1), m = /^(\s*)([-*]|\d+\.)\s(\[[ xX]\]\s)?/.exec(line);
      if (!m) { n.body += '\n'; } else {
        var mk = /\d+\./.test(m[2]) ? (parseInt(m[2], 10) + 1) + '.' : m[2];
        n.body += '\n' + m[1] + mk + ' ' + (m[3] ? '[ ] ' : '');
      }
      n.date = 'Just now'; s.editT = evT(dt, T);
    };
  };
  A.addTag = function () {
    return function (s, dt, T) {
      var n = active(s), tag = s.tagDraft.trim().toLowerCase().replace(/^#+/, '').replace(/\s+/g, '-').replace(/[^\w/-]/g, '');
      s.tagDraft = '';
      if (!n || !tag || n.tags.indexOf(tag) >= 0) return;
      n.tags.push(tag); n.date = 'Just now'; s.editT = evT(dt, T); s.born['chip:' + tag] = evT(dt, T);
    };
  };
  A.menu = function (name) { return function (s) { s.menu = name || ''; s.focus = ''; }; };
  A.setNotebook = function (nb) { return function (s, dt, T) { var n = active(s); s.menu = ''; if (n) { n.notebook = nb; n.date = 'Just now'; s.editT = evT(dt, T); } }; };
  A.mode = function (m) { return function (s) { s.mode = m; }; };
  A.toggleMode = function () { return function (s) { s.mode = s.mode === 'preview' ? (s.lastWrite || 'split') : 'preview'; if (s.mode === 'preview') s.lastWrite = 'split'; }; };
  A.togglePin = function () {
    return function (s, dt, T) {
      var n = active(s); if (!n) return;
      s.reorder = { t: evT(dt, T), ids: visible(s).map(function (x) { return x.id; }) };
      n.pinned = !n.pinned; n.date = 'Just now'; s.editT = evT(dt, T);
    };
  };
  A.openPalette = function (q) { return function (s) { s.palette = { query: q || '', index: 0 }; s.focus = 'palette'; s.menu = ''; }; };
  A.closePalette = function () { return function (s) { s.palette = null; s.focus = ''; }; };
  A.paletteMove = function (d) {
    return function (s) { if (!s.palette) return; var n = paletteItems(s).length; s.palette.index = Math.max(0, Math.min(n - 1, s.palette.index + d)); };
  };
  /** Enter in the palette: run the selected item exactly as the app does. */
  A.paletteRun = function () {
    return function (s) {
      if (!s.palette) return;
      var it = paletteItems(s)[s.palette.index];
      s.palette = null; s.focus = '';
      if (!it) return;
      if (it.type === 'note') { s.activeId = it.id; }
      else if (it.type === 'tag') setFilterOn(s, { kind: 'tag', value: it.tag });
      else if (it.id === 'toggle-theme') s.theme = s.theme === 'dark' ? 'light' : 'dark';
      else if (it.id && it.id.indexOf('mode-') === 0) s.mode = it.id.slice(5);
      else if (it.nb) setFilterOn(s, { kind: 'notebook', value: it.nb });
    };
  };
  A.setFilter = function (f) { return function (s) { setFilterOn(s, f); }; };
  A.move = function (d) {
    return function (s) {
      var list = visible(s); if (!list.length) return;
      var i = -1; for (var k = 0; k < list.length; k++) if (list[k].id === s.activeId) i = k;
      i = i < 0 ? 0 : Math.max(0, Math.min(list.length - 1, i + d));
      s.activeId = list[i].id;
    };
  };
  A.clearListFilter = function () { return function (s) { s.listQuery = ''; s.focus = ''; }; };
  A.theme = function (t) { return function (s) { s.theme = t; }; };
  A.press = function (name) { return function (s, dt, T) { s.pressed = name; s.pressT = evT(dt, T); }; };
  /** Typing into a field, one character at a time ('title', 'body', 'tag', 'filter', 'palette'). */
  A.type = function (field, text, cps) {
    return function (s, dt, T) {
      var n = Math.min(text.length, Math.floor(dt * cps + 1e-6)), part = text.slice(0, n), note = active(s);
      if (field === 'title' && note) { note.title += part; note.date = 'Just now'; }
      else if (field === 'body' && note) { note.body += part; note.date = 'Just now'; }
      else if (field === 'tag') s.tagDraft += part;
      else if (field === 'filter') s.listQuery += part;
      else if (field === 'palette' && s.palette) { s.palette.query += part; if (n) s.palette.index = 0; }
      if (field === 'title' || field === 'body') s.editT = Math.max(s.editT, evT(dt, T) + n / cps);
      s.typing = n < text.length ? field : s.typing === field ? '' : s.typing;
    };
  };

  // ================================================================== text measuring and rich text
  var MC = {}, cacheOn = false;
  function fam(o) { return o.f || 'sans'; }
  function mw(str, size, weight, family, tr) {
    var k = size + '|' + weight + '|' + (family || 'sans') + '|' + (tr || 0) + '|' + str, v = MC[k];
    if (v !== undefined) return v;
    v = F.measure(str, { size: size, weight: weight, family: family || 'sans', tracking: tr || 0 });
    if (cacheOn) MC[k] = v;
    return v;
  }
  function runStyle(r, base) {
    return { size: r.c ? base.size * 0.86 : base.size, weight: r.b ? 650 : base.weight, family: r.c ? 'mono' : 'sans', italic: !!r.i };
  }
  /** Lay out styled runs in lines no wider than width. -> [[{t, x, w, run}], ...] */
  function layoutRuns(runs, width, base) {
    var lines = [[]], x = 0;
    runs.forEach(function (r) {
      var st = runStyle(r, base);
      String(r.t).split(/(\s+)/).forEach(function (tok) {
        if (!tok) return;
        var w = mw(tok, st.size, st.weight, st.family) + (r.c ? 0 : 0);
        var space = /^\s+$/.test(tok);
        if (!space && x + w > width && x > 0) { lines.push([]); x = 0; }
        if (space && x === 0) return;
        lines[lines.length - 1].push({ t: tok, x: x, w: w, r: r, st: st });
        x += w;
      });
    });
    return lines;
  }
  function drawRuns(line, x0, y, base, C, colorFor) {
    var g = F.g;
    line.forEach(function (it) {
      var r = it.r, st = it.st;
      if (r.m) F.box(x0 + it.x - 1, y - base.size * 0.95, it.w + 2, base.size * 1.25, 3, { fill: C.mark });
      if (r.c && !/^\s+$/.test(it.t)) F.box(x0 + it.x - 3, y - base.size * 0.92, it.w + 6, base.size * 1.22, 4, { fill: C.codeBg, stroke: C.border, lineWidth: 1 });
      var col = colorFor ? colorFor(r) : (r.a ? C.accentText : r.color || base.color);
      atext(it.t, x0 + it.x, y, { size: st.size, weight: st.weight, family: st.family, italic: st.italic, color: col });
      if (r.a || r.s) F.line(x0 + it.x, y + (r.s ? -base.size * 0.3 : 3), x0 + it.x + it.w, y + (r.s ? -base.size * 0.3 : 3),
        { color: r.s ? C.faint : F.rgba(BRAND500, 0.45), width: 1 });
    });
    g = null;
  }
  /** Inline Markdown -> runs (code, [[links]], [text](url), **bold**, _em_, ~~strike~~). */
  function inlineRuns(src, base) {
    var out = [], re = /(`[^`]+`)|(\[\[[^\]]+\]\])|(\[[^\]]+\]\([^)\s]+\))|(\*\*[^*]+\*\*)|((?:^|[^\w])_[^_\s][^_]*_(?!\w))|(~~[^~]+~~)/g, last = 0, m;
    base = base || {};
    function push(t, extra) { if (t) out.push(Object.assign({ t: t }, base, extra || {})); }
    while ((m = re.exec(src))) {
      var tok = m[0], lead = '';
      if (m[5] && tok.charAt(0) !== '_') { lead = tok.charAt(0); tok = tok.slice(1); }
      push(src.slice(last, m.index) + lead);
      if (m[1]) push(tok.slice(1, -1), { c: true });
      else if (m[2]) push(tok.slice(2, -2), { a: true });
      else if (m[3]) push(tok.slice(1, tok.indexOf(']')), { a: true });
      else if (m[4]) push(tok.slice(2, -2), { b: true });
      else if (m[5]) push(tok.slice(1, -1), { i: true });
      else if (m[6]) push(tok.slice(2, -2), { s: true });
      last = re.lastIndex;
    }
    push(src.slice(last));
    return out;
  }

  // ------------------------------------------------------------------ Markdown preview layout
  var MDC = {};
  /** The preview of a note body at a width: a list of draw ops with y offsets (memoized). */
  function mdLayout(src, width) {
    var key = width + '\u0000' + src;
    if (cacheOn && MDC[key]) return MDC[key];
    var ops = [], y = 0, lines = src.replace(/\r\n?/g, '\n').split('\n'), i = 0, first = true;
    var P = { size: 15, weight: 400 }, LH = 25.5;
    function gap(px) { if (!first) y += px; }
    function para(runs, x, w, lh, size, weight, colorKey) {
      var base = { size: size, weight: weight };
      layoutRuns(runs, w - x, base).forEach(function (ln) { ops.push({ k: 'runs', y: y + lh * 0.72, x: x, line: ln, base: base, color: colorKey }); y += lh; });
    }
    var isBlock = function (l) { return /^(#{1,6}\s|```|>|\s*[-*]\s|\s*\d+\.\s|(-{3,}|\*{3,})\s*$)/.test(l); };
    while (i < lines.length) {
      var line = lines[i], m;
      if ((m = /^```\s*([\w+-]*)\s*$/.exec(line))) {
        var buf = []; i++;
        while (i < lines.length && !/^```\s*$/.test(lines[i])) buf.push(lines[i++]);
        i++;
        var h = buf.length * 20.6 + 28;
        ops.push({ k: 'pre', y: y, h: h, lines: buf });
        y += h + 16.5; first = false; continue;
      }
      if (/^\s*$/.test(line)) { i++; continue; }
      if ((m = /^(#{1,6})\s+(.*)$/.exec(line))) {
        var lv = Math.min(m[1].length, 4), sz = [0, 24, 19, 16, 14][lv];
        gap(sz * 1.5); ops.push({ k: 'h', y: y + sz * 1.25 * 0.78, size: sz, lv: lv, runs: inlineRuns(m[2]) });
        y += sz * 1.25 + sz * 0.5; first = false; i++; continue;
      }
      if (/^(-{3,}|\*{3,})\s*$/.test(line)) { gap(24); ops.push({ k: 'hr', y: y }); y += 24; first = false; i++; continue; }
      if (/^>/.test(line)) {
        var q = [];
        while (i < lines.length && /^>/.test(lines[i])) q.push(lines[i++].replace(/^>\s?/, ''));
        var y0 = y; y += 4;
        para(inlineRuns(q.join(' ')), 16, width, LH, 15, 400, 'text2');
        y += 4; ops.push({ k: 'quote', y: y0, h: y - y0 }); y += 15; first = false; continue;
      }
      if (/^\s*[-*]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) {
        var ordered = /^\s*\d+\.\s+/.test(line), num = parseInt(line.trim(), 10) || 1;
        while (i < lines.length && (ordered ? /^\s*\d+\.\s+/.test(lines[i]) : /^\s*[-*]\s+/.test(lines[i]))) {
          var text = lines[i].replace(ordered ? /^\s*\d+\.\s+/ : /^\s*[-*]\s+/, ''), t = ordered ? null : /^\[( |x|X)\](?:\s+(.*))?$/.exec(text);
          y += 3;
          if (t && t[2] !== undefined) {
            var done = t[1] !== ' ';
            ops.push({ k: 'check', y: y + 5.7, done: done });
            para(inlineRuns(t[2] || '', done ? { s: true, color: null, done: true } : {}), 28, width, LH, 15, 400, done ? 'muted' : null);
          } else {
            ops.push({ k: 'bullet', y: y + LH * 0.72, ordered: ordered, n: num });
            para(inlineRuns(text), 21, width, LH, 15, 400, null);
          }
          y += 3; num++; i++;
        }
        y += 15; first = false; continue;
      }
      if (/\|/.test(line) && i + 1 < lines.length && /^\s*\|?\s*:?-{3,}/.test(lines[i + 1])) {
        var cells = function (l) { return l.trim().replace(/^\||\|$/g, '').split('|').map(function (c) { return c.trim(); }); };
        var rows = [cells(line)]; i += 2;
        while (i < lines.length && /\|/.test(lines[i]) && !/^\s*$/.test(lines[i])) rows.push(cells(lines[i++]));
        ops.push({ k: 'table', y: y, rows: rows }); y += rows.length * 36 + 16.5; first = false; continue;
      }
      var pb = [line]; i++;
      while (i < lines.length && !/^\s*$/.test(lines[i]) && !isBlock(lines[i])) pb.push(lines[i++]);
      pb.forEach(function (l) { para(inlineRuns(l), 0, width, LH, 15, 400, null); });
      y += 13.5; first = false;
    }
    var res = { ops: ops, h: y };
    if (cacheOn) MDC[key] = res;
    return res;
  }
  function drawMd(src, x0, y0, width, C, clipH) {
    var L = mdLayout(src, width), g = F.g;
    L.ops.forEach(function (op) {
      var y = y0 + op.y;
      if (y > y0 + clipH + 30) return;
      if (op.k === 'runs') drawRuns(op.line, x0 + op.x, y, { size: op.base.size, weight: op.base.weight, color: op.color ? C[op.color] : C.text }, C);
      else if (op.k === 'h') {
        var hs = { size: op.size, weight: 700, color: op.lv === 4 ? C.muted : C.text };
        layoutRuns(op.runs, width, hs).slice(0, 1).forEach(function (ln) { drawRuns(ln, x0, y, hs, C); });
      } else if (op.k === 'hr') F.line(x0, y + 12, x0 + width, y + 12, { color: C.border, width: 1 });
      else if (op.k === 'quote') F.box(x0, y, 3, op.h, 1.5, { fill: BRAND300 });
      else if (op.k === 'check') {
        F.box(x0 + 2, y, 15, 15, 3, op.done ? { fill: C.accent } : { fill: C.surface, stroke: C.borderStrong, lineWidth: 1.2 });
        if (op.done) F.glyph('check', x0 + 9.5, y + 7.5, 11, { color: '#fff', width: 0.17 });
      } else if (op.k === 'bullet') {
        if (op.ordered) atext(op.n + '.', x0 + 16, y, { size: 15, align: 'right', color: C.faint });
        else F.circle(x0 + 8, y - 5, 2.6, { fill: C.faint });
      } else if (op.k === 'pre') {
        F.box(x0, y, width, op.h, 10, { fill: C.codeBg, stroke: C.border, lineWidth: 1 });
        op.lines.forEach(function (l, k) { atext(l, x0 + 16, y + 14 + 15 + k * 20.6, { size: 12.5, family: 'mono', color: C.text2 }); });
      } else if (op.k === 'table') {
        var cw = width / op.rows[0].length;
        op.rows.forEach(function (r, ri) {
          r.forEach(function (c, ci) {
            atext(ri ? c : c.toUpperCase(), x0 + ci * cw + 10, y + ri * 36 + 23, { size: ri ? 13.5 : 12, weight: ri ? 400 : 600, color: ri ? C.text : C.muted, maxWidth: cw - 14 });
          });
          F.line(x0, y + (ri + 1) * 36, x0 + width, y + (ri + 1) * 36, { color: C.border, width: 1 });
        });
      }
    });
    g = null;
  }

  // ================================================================== layout of the app (CSS px)
  function tagCounts(s) {
    var c = {};
    s.notes.forEach(function (n) { n.tags.forEach(function (t) { c[t] = (c[t] || 0) + 1; }); });
    return c;
  }
  function itemHeight(n, ts) { return 76.5 + 18.85 * Math.min(2, snippetLines(n, ts).length); }
  function snippetLines(n, ts) {
    var text = snippetFor(n, ts) || 'No additional text';
    return layoutRuns(marked(text, ts), 293, { size: 13, weight: 400 });
  }
  /** Every part of the app for a state: rects in the app's CSS pixels. Memoized on the state. */
  function layout(s) {
    if (s.__lay) return s.__lay;
    var L = { tags: {}, items: {}, order: [], chips: {}, pal: [] };
    // sidebar tags, by count then name, wrapped in 215 px
    var counts = tagCounts(s), tags = Object.keys(counts).sort(function (a, b) { return (counts[b] - counts[a]) || (a < b ? -1 : 1); });
    var x = 16, row = 0;
    tags.forEach(function (t) {
      var w = 9 + mw('#', 12, 500) + 4 + mw(t, 12, 500) + 9 + 2;
      if (x + w > 231 && x > 16) { row++; x = 16; }
      L.tags[t] = [x, 430 + row * 30, w, 24];
      x += w + 6;
    });
    L.tagOrder = tags; L.counts = counts;
    // note list
    var ts = terms(s.listQuery), y = 112;
    visible(s).forEach(function (n) { var h = itemHeight(n, ts); L.items[n.id] = [256, y, 319, h]; L.order.push(n.id); y += h + 2; });
    // editor meta: notebook select, chips, tag input
    var note = active(s), cx = 616 + 89 + 10;
    (note ? note.tags : []).forEach(function (t) {
      var w = 10 + mw('#', 12, 600) + 1 + mw(t, 12, 600) + 2 + 18 + 4;
      L.chips[t] = [cx, 124, w, 26]; cx += w + 6;
    });
    L.tagInput = [cx, 124, 110, 26];
    // palette
    if (s.palette) {
      var items = paletteItems(s), py = 137, group = null;
      L.palItems = items;
      items.forEach(function (it, i) {
        if (it.group !== group) { group = it.group; L.pal.push({ k: 'group', y: py, label: group }); py += 30; }
        var h = it.subRuns ? 57 : 48;
        L.pal.push({ k: 'item', y: py, h: h, i: i, it: it }); py += h;
      });
      if (!items.length) { L.pal.push({ k: 'empty', y: py }); py += 76; }
      var resH = Math.min(342, py - 131 + 6);
      L.palette = [370, 75, 611, 56 + resH + 38]; L.palResH = resH;
    }
    s.__lay = L;
    return L;
  }

  // ================================================================== named rects
  /**
   * Named hit-rects of the app for a state (world coordinates through the window). Names:
   * newNote, search, nb:<all|pinned|inbox|work|reading|personal>, tag:<name>, sync, themeBtn,
   * list, listHead, filter, item:<id>, editor, crumbs, seg:<edit|split|preview>, pinBtn, deleteBtn,
   * title, nbSelect, chip:<tag>, tagInput, source, preview, status, saveState, sidebar,
   * palette, paletteInput, pitem:<i>, menuItem:<notebook>, menu.
   */
  K.rects = function (s) {
    s = s || K.state();
    var L = layout(s), nbIds = ['all', 'pinned', 'inbox', 'work', 'reading', 'personal'];
    var split = s.mode === 'split';
    var defs = {
      sidebar: [0, 0, 248, VH], newNote: [12, 64, 223, 36], search: [12, 110, 223, 34],
      nb: function (id) { return [12, 189 + 33 * Math.max(0, nbIds.indexOf(id)), 223, 32]; },
      tag: function (t) { return L.tags[t] || null; },
      sync: [12, 614, 151, 32], themeBtn: [203, 614, 32, 32],
      list: [248, 0, 336, VH], listHead: [248, 0, 336, 104], filter: [264, 57, 303, 34],
      item: function (id) { return L.items[id] || null; },
      editor: [584, 0, VW - 584, VH], crumbs: [604, 18, 414, 20],
      seg: function (m) { return { edit: [1028, 14, 63, 28], split: [1093, 14, 67, 28], preview: [1162, 14, 88, 28] }[m]; },
      pinBtn: [1266, 12, 32, 32], deleteBtn: [1304, 12, 32, 32],
      title: [616, 78, 702, 34], nbSelect: [616, 124, 89, 26],
      chip: function (t) { return L.chips[t] || null; }, tagInput: L.tagInput,
      source: s.mode === 'preview' ? [584, 169, 0, 455] : [584, 169, split ? 382 : VW - 584, 455],
      preview: s.mode === 'edit' ? [VW, 169, 0, 455] : split ? [967, 169, 383, 455] : [584, 169, VW - 584, 455],
      status: [584, 624, VW - 584, 34], saveState: [1186, 628, 150, 26],
      palette: L.palette || [370, 75, 611, 300], paletteInput: [370, 75, 611, 56],
      pitem: function (i) { for (var k = 0; k < L.pal.length; k++) if (L.pal[k].i === i) return [376, L.pal[k].y, 599, L.pal[k].h]; return null; },
      menu: [616, 154, 168, 122],
      menuItem: function (id) { var k = NOTEBOOKS.map(function (n) { return n.id; }).indexOf(id); return [621, 159 + k * 28, 158, 28]; },
    };
    return F.rects(defs, { origin: [PAGE.x, PAGE.y], scale: U });
  };
  var HOVER_TEXT = { title: 1, source: 1, tagInput: 1, filter: 1 };
  /** Rect names the pointer can hover (highlights and the I-beam over text fields). */
  function hoverables(s) {
    var L = layout(s), out = [];
    if (s.menu === 'notebook') NOTEBOOKS.forEach(function (n) { out.push('menuItem:' + n.id); });
    if (s.palette) return out;
    out.push('newNote', 'search', 'sync', 'themeBtn', 'pinBtn', 'deleteBtn', 'seg:edit', 'seg:split', 'seg:preview', 'nbSelect', 'tagInput', 'filter', 'title');
    ['all', 'pinned', 'inbox', 'work', 'reading', 'personal'].forEach(function (id) { out.push('nb:' + id); });
    L.tagOrder.forEach(function (t) { out.push('tag:' + t); });
    L.order.forEach(function (id) { out.push('item:' + id); });
    out.push('source');
    return out;
  }

  // ================================================================== drawing the app
  function pressScale(s, name, T) {
    if (s.pressed !== name || s.pressT < 0) return 1;
    return 1 - 0.04 * F.win(T, s.pressT - 0.06, s.pressT + 0.16, 0.05, 0.1);
  }
  function scaled(r, k, fn) {
    var g = F.g;
    if (k === 1) return fn();
    g.save(); g.translate(r[0] + r[2] / 2, r[1] + r[3] / 2); g.scale(k, k); g.translate(-(r[0] + r[2] / 2), -(r[1] + r[3] / 2));
    fn(); g.restore();
  }
  function kbdW(label, o) {
    o = o || {};
    var h = o.h || 20, size = o.size || 11;
    return Math.max(h, (F.glyphName(label) ? size * 1.1 : mw(label, size, 500)) + 10);
  }
  function kbd(label, x, y, C, o) {
    o = o || {};
    var h = o.h || 20, size = o.size || 11, glyph = F.glyphName(label);
    var w = kbdW(label, o);
    F.box(x, y, w, h, 5, { fill: C.surface, stroke: C.borderStrong, lineWidth: 1 });
    F.line(x + 3, y + h - 0.5, x + w - 3, y + h - 0.5, { color: C.borderStrong, width: 1.5 });
    if (glyph) F.glyph(glyph, x + w / 2, y + h / 2 - 0.5, size * 1.05, { color: C.muted, width: 0.11 });
    else atext(label, x + w / 2, y + h / 2 + 0.5, { size: size, weight: 500, align: 'center', baseline: 'middle', color: C.muted });
    return w;
  }
  function caret(x, y, h, C, s, field, T) {
    if (s.focus !== field) return;
    if (s.typing === field || F.fract(T) < 0.55) F.box(x, y, 1.6, h, 0.8, { fill: C.text });
  }
  function ellipsize(str, size, weight, maxW, family) {
    if (mw(str, size, weight, family) <= maxW) return str;
    var lo = 0, hi = str.length;
    while (lo < hi) { var mid = (lo + hi + 1) >> 1; if (mw(str.slice(0, mid) + '…', size, weight, family) <= maxW) lo = mid; else hi = mid - 1; }
    return str.slice(0, lo).replace(/\s+$/, '') + '…';
  }
  /** Truncate runs to one line with an ellipsis (nowrap + text-overflow). */
  function oneLine(runs, maxW, base) {
    var out = [], x = 0;
    for (var i = 0; i < runs.length; i++) {
      var r = runs[i], st = runStyle(r, base), w = mw(r.t, st.size, st.weight, st.family);
      if (x + w <= maxW) { out.push({ t: r.t, x: x, w: w, r: r, st: st }); x += w; continue; }
      var t = ellipsize(r.t, st.size, st.weight, maxW - x, st.family);
      out.push({ t: t, x: x, w: mw(t, st.size, st.weight, st.family), r: r, st: st });
      break;
    }
    return out;
  }

  function drawSidebar(T, s, C, L) {
    var g = F.g, hov = s.hover;
    F.box(0, 0, 248, VH, 0, { fill: C.sidebar });
    F.line(248, 0, 248, VH, { color: C.border, width: 1 });
    logo(18, 18, 28);
    atext('Tidepool', 56, 37.5, { size: 16, weight: 700, tracking: -0.01, color: C.text });
    // New note
    var nr = [12, 64, 223, 36];
    scaled(nr, pressScale(s, 'newNote', T), function () {
      var gr = g.createLinearGradient(0, 64, 0, 100); gr.addColorStop(0, C.btn[0]); gr.addColorStop(1, C.btn[1]);
      g.save(); if (hov === 'newNote') g.filter = 'brightness(1.06)';
      F.box(12, 64, 223, 36, 10, { fill: gr, shadow: { blur: 2, y: 1, color: 'rgba(15,30,34,0.10)' } });
      g.restore();
      var tw = mw('New note', 13.5, 600), x0 = 12 + 223 / 2 - (16 + 8 + tw) / 2;
      icon('plus', x0, 74, 16, C.onAccent);
      atext('New note', x0 + 24, 86.5, { size: 13.5, weight: 600, color: C.onAccent });
    });
    // Search trigger
    scaled([12, 110, 223, 34], pressScale(s, 'search', T), function () {
      F.box(12, 110, 223, 34, 10, { fill: C.surface, stroke: hov === 'search' ? C.borderStrong : C.border, lineWidth: 1, shadow: { blur: 2, y: 1, color: 'rgba(15,30,34,0.06)' } });
      icon('search', 22, 119, 16, hov === 'search' ? C.text2 : C.muted);
      atext('Search', 46, 132, { size: 14, color: hov === 'search' ? C.text2 : C.muted });
      var kw = 8 + 11.5 + 1 + mw('K', 11, 500) + 3;
      F.box(227 - kw, 117, kw, 20, 5, { fill: C.surface, stroke: C.borderStrong, lineWidth: 1 });
      F.line(227 - kw + 3, 136.5, 227 - 3, 136.5, { color: C.borderStrong, width: 1.5 });
      F.glyph('cmd', 227 - kw + 5 + 5.5, 126.5, 11, { color: C.muted, width: 0.1 });
      atext('K', 227 - kw + 5 + 12, 131, { size: 11, weight: 500, color: C.muted });
    });
    // Notebooks
    atext('NOTEBOOKS', 20, 179, { size: 11, weight: 600, tracking: 0.06, color: C.faint });
    var nbCounts = {}; s.notes.forEach(function (n) { nbCounts[n.notebook] = (nbCounts[n.notebook] || 0) + 1; });
    var rows = [['all', 'files', 'All notes', s.notes.length, null], ['pinned', 'pin', 'Pinned', s.notes.filter(function (n) { return n.pinned; }).length, null]]
      .concat(NOTEBOOKS.map(function (nb) { return [nb.id, nb.icon, nb.name, nbCounts[nb.id] || 0, nb.color]; }));
    rows.forEach(function (r, i) {
      var y = 189 + 33 * i, f = s.filter;
      var on = r[0] === 'all' ? f.kind === 'all' : r[0] === 'pinned' ? f.kind === 'pinned' : (f.kind === 'notebook' && f.value === r[0]);
      if (on) F.box(12, y, 223, 32, 6, { fill: C.active }); else if (hov === 'nb:' + r[0]) F.box(12, y, 223, 32, 6, { fill: C.hover });
      icon(r[1], 20, y + 8, 16, on ? C.accent : C.muted);
      atext(r[2], 46, y + 21, { size: 14, weight: 500, color: on ? C.accentText : C.text2 });
      var cs = String(r[3]), cw = mw(cs, 12, 400);
      atext(cs, 227, y + 20.5, { size: 12, align: 'right', color: on ? C.accent : C.faint });
      if (r[4]) F.box(227 - cw - 22, y + 12, 8, 8, 3, { fill: r[4] });
    });
    // Tags
    atext('TAGS', 20, 421, { size: 11, weight: 600, tracking: 0.06, color: C.faint });
    L.tagOrder.forEach(function (t) {
      var r = L.tags[t], on = s.filter.kind === 'tag' && s.filter.value === t;
      scaled(r, pressScale(s, 'tag:' + t, T), function () {
        F.box(r[0], r[1], r[2], r[3], 12, on ? { fill: C.accentSoft } : { fill: C.surface, stroke: hov === 'tag:' + t ? C.borderStrong : C.border, lineWidth: 1 });
        atext('#', r[0] + 10, r[1] + 16.5, { size: 12, weight: 500, color: on ? C.accent : C.faint });
        atext(t, r[0] + 10 + mw('#', 12, 500) + 4, r[1] + 16.5, { size: 12, weight: 500, color: on ? C.accentText : C.text2 });
      });
    });
    // footer
    F.line(12, 602, 235, 602, { color: C.border, width: 1 });
    if (hov === 'sync') F.box(12, 614, 151, 32, 6, { fill: C.hover });
    F.circle(24, 630, 7, { fill: 'rgba(20,163,160,0.18)' });
    F.circle(24, 630, 4, { fill: BRAND500 });
    atext('Sync: local only', 36, 634.5, { size: 12.5, weight: 500, color: C.text2 });
    icon('keyboard', 177, 622, 16, C.muted);
    icon(s.theme === 'dark' ? 'sun' : 'moon', 211, 622, 16, C.muted);
  }

  function drawList(T, s, C, L) {
    var g = F.g, ts = terms(s.listQuery);
    F.box(248, 0, 336, VH, 0, { fill: C.surface });
    F.line(584, 0, 584, VH, { color: C.border, width: 1 });
    var title = filterTitle(s), tw = mw(title, 18, 700, 'sans', -0.015);
    atext(title, 264, 39, { size: 18, weight: 700, tracking: -0.015, color: C.text });
    var cnt = String(L.order.length), cw = mw(cnt, 12, 600) + 16;
    F.box(264 + tw + 8, 22, cw, 20, 10, { fill: C.surface2 });
    atext(cnt, 264 + tw + 8 + cw / 2, 32.5, { size: 12, weight: 600, align: 'center', baseline: 'middle', color: C.muted });
    var foc = s.focus === 'filter';
    F.box(264, 57, 303, 34, 10, foc ? { fill: C.surface, stroke: C.accent, lineWidth: 1 } : { fill: C.surface2 });
    if (foc) F.box(261, 54, 309, 40, 12, { stroke: 'rgba(20,163,160,0.28)', lineWidth: 3 });
    icon('search', 274, 66, 16, C.muted);
    if (s.listQuery) atext(s.listQuery, 298, 78.5, { size: 13.5, color: C.text });
    else atext('Filter this list', 298, 78.5, { size: 13.5, color: C.faint });
    caret(298 + (s.listQuery ? mw(s.listQuery, 13.5, 400) + 1 : 0), 65, 18, C, s, 'filter', T);
    F.line(248, 104, 584, 104, { color: C.border, width: 1 });
    g.save(); g.beginPath(); g.rect(248, 104.5, 336, VH - 104.5); g.clip();
    if (!L.order.length) {
      atext('No notes match.', 416, 170, { size: 14, align: 'center', color: C.muted });
    }
    // pin reorder: items slide from their old slots for 0.4 s
    var oldY = null, rp = 1;
    if (s.reorder && T < s.reorder.t + 0.45) {
      rp = F.E.inOutCubic(F.seg(T, s.reorder.t, s.reorder.t + 0.42));
      oldY = {}; var yy = 112;
      s.reorder.ids.forEach(function (id) { if (L.items[id]) { oldY[id] = yy; yy += L.items[id][3] + 2; } });
    }
    L.order.forEach(function (id) {
      var n = null; for (var k = 0; k < s.notes.length; k++) if (s.notes[k].id === id) n = s.notes[k];
      var r = L.items[id].slice(), on = id === s.activeId;
      if (oldY && oldY[id] !== undefined) r[1] = F.lerp(oldY[id], r[1], rp);
      var born = s.born[id], a = born === undefined ? 1 : F.seg(T, born, born + 0.35, 'outCubic');
      g.save(); g.globalAlpha *= a; g.translate(0, (1 - a) * -8);
      if (on) {
        F.box(r[0], r[1], r[2], r[3], 10, { fill: C.accentSoft, stroke: C.itemActiveLine, lineWidth: 1 });
        F.box(r[0], r[1] + 12, 3, r[3] - 24, 1.5, { fill: C.accent });
      } else if (s.hover === 'item:' + id) F.box(r[0], r[1], r[2], r[3], 10, { fill: C.hover });
      var x0 = r[0] + 14, y = r[1];
      var tx = x0;
      if (n.pinned) { icon('pin', x0, y + 12 + 4, 13, CORAL, 2.2); tx += 19; }
      var date = n.date, dw = mw(date, 12, 400);
      var line = oneLine(marked(n.title || 'Untitled', ts), r[0] + r[2] - 12 - dw - 8 - tx, { size: 14, weight: 600 });
      drawRuns(line, tx, y + 27.5, { size: 14, weight: 600, color: C.text }, C);
      atext(date, r[0] + r[2] - 12, y + 27, { size: 12, align: 'right', color: C.faint });
      var sl = snippetLines(n, ts), shown = sl.slice(0, 2);
      if (sl.length > 2) {
        var last = shown[1], lastEnd = last.length ? last[last.length - 1] : null;
        if (lastEnd) { var room = 293 - lastEnd.x; lastEnd.t = ellipsize(lastEnd.t + ' …', 13, 400, room); }
      }
      shown.forEach(function (ln, k) { drawRuns(ln, x0, y + 37 + 14 + k * 18.85, { size: 13, weight: 400, color: C.muted }, C); });
      var fy = y + 37 + Math.min(2, sl.length) * 18.85 + 8 + 13.5, nb = nbById(n.notebook);
      F.box(x0, fy - 8.5, 8, 8, 2, { fill: nb.color });
      atext(nb.name, x0 + 13, fy, { size: 11.5, weight: 500, color: C.muted });
      var fx = x0 + 13 + mw(nb.name, 11.5, 500) + 6;
      n.tags.slice(0, 3).forEach(function (t) {
        atext('#', fx, fy, { size: 11.5, weight: 500, color: C.accentText, alpha: 0.6 });
        var hw = mw('#', 11.5, 500);
        atext(t, fx + hw, fy, { size: 11.5, weight: 500, color: C.accentText });
        fx += hw + mw(t, 11.5, 500) + 6;
      });
      g.restore();
    });
    g.restore();
  }

  function drawEditor(T, s, C, L) {
    var g = F.g, n = active(s), hov = s.hover;
    F.box(584, 0, VW - 584, VH, 0, { fill: C.surface });
    F.line(584, 56, VW, 56, { color: C.border, width: 1 });
    if (!n) return;
    var nb = nbById(n.notebook), cx = 604;
    atext(nb.name, cx, 33, { size: 13, weight: 500, color: C.muted }); cx += mw(nb.name, 13, 500) + 6;
    atext('/', cx, 33, { size: 13, color: C.faint }); cx += mw('/', 13, 400) + 6;
    atext(ellipsize(n.title || 'Untitled', 13, 500, 1018 - cx), cx, 33, { size: 13, weight: 500, color: C.text2 });
    // view mode
    F.box(1025, 11, 228, 34, 10, { fill: C.surface2, stroke: C.border, lineWidth: 1 });
    [['edit', 'pencil', 'Edit', 1028, 63], ['split', 'columns-2', 'Split', 1093, 67], ['preview', 'eye', 'Preview', 1162, 88]].forEach(function (sg) {
      var on = s.mode === sg[0];
      scaled([sg[3], 14, sg[4], 28], pressScale(s, 'seg:' + sg[0], T), function () {
        if (on) F.box(sg[3], 14, sg[4], 28, 7, { fill: s.theme === 'dark' ? C.borderStrong : C.surface, shadow: { blur: 2, y: 1, color: 'rgba(15,30,34,0.08)' } });
        var col = on || hov === 'seg:' + sg[0] ? C.text : C.muted;
        icon(sg[1], sg[3] + 10, 21, 14, col);
        atext(sg[2], sg[3] + 30, 32.5, { size: 12.5, weight: 600, color: col });
      });
    });
    if (n.pinned) F.box(1266, 12, 32, 32, 6, { fill: C.accentSoft }); else if (hov === 'pinBtn') F.box(1266, 12, 32, 32, 6, { fill: C.hover });
    icon('pin', 1274, 20, 16, n.pinned ? C.accent : C.muted);
    icon('trash-2', 1312, 20, 16, C.muted);
    // title
    var tfoc = s.focus === 'title';
    if (n.title) atext(n.title, 616, 105, { size: 28, weight: 700, tracking: -0.022, color: C.text });
    else atext('Untitled', 616, 105, { size: 28, weight: 700, tracking: -0.022, color: C.faint });
    caret(616 + (n.title ? mw(n.title, 28, 700, 'sans', -0.022) + 1 : 0), 80, 32, C, s, 'title', T);
    // notebook select, chips, tag input
    F.box(616, 124, 89, 26, 13, { fill: C.surface2, stroke: s.menu === 'notebook' ? C.accent : C.border, lineWidth: 1 });
    atext(nb.name, 626, 141, { size: 12, weight: 600, color: C.text2 });
    icon('chevron', 684, 131, 12, C.muted, 2.4);
    n.tags.forEach(function (t) {
      var r = L.chips[t]; if (!r) return;
      var b = s.born['chip:' + t], a = b === undefined ? 1 : F.seg(T, b, b + 0.3, 'outBack');
      scaled(r, F.lerp(0.6, 1, a), function () {
        F.box(r[0], r[1], r[2], r[3], 13, { fill: C.accentSoft, alpha: Math.min(1, a * 2) });
        atext('#', r[0] + 10, r[1] + 17.5, { size: 12, weight: 600, color: C.accentText, alpha: 0.55 * Math.min(1, a * 2) });
        atext(t, r[0] + 10 + mw('#', 12, 600) + 1, r[1] + 17.5, { size: 12, weight: 600, color: C.accentText, alpha: Math.min(1, a * 2) });
        icon('x', r[0] + r[2] - 19, r[1] + 7, 12, F.rgba(C.accentText, 0.6));
      });
    });
    var ti = L.tagInput, tfocus = s.focus === 'tag';
    g.save();
    if (!tfocus) g.setLineDash([3, 3]);
    F.box(ti[0], ti[1], ti[2], ti[3], 13, { stroke: tfocus ? C.accent : C.borderStrong, lineWidth: 1 });
    g.restore();
    if (tfocus) F.box(ti[0] - 3, ti[1] - 3, ti[2] + 6, ti[3] + 6, 16, { stroke: 'rgba(20,163,160,0.28)', lineWidth: 3 });
    if (s.tagDraft) atext(s.tagDraft, ti[0] + 10, ti[1] + 17.5, { size: 12, color: C.text });
    else if (!tfocus) atext('Add tag', ti[0] + 10, ti[1] + 17.5, { size: 12, color: C.faint });
    caret(ti[0] + 10 + (s.tagDraft ? mw(s.tagDraft, 12, 400) + 1 : 0), ti[1] + 5, 16, C, s, 'tag', T);
    // body
    F.line(584, 168.5, VW, 168.5, { color: C.border, width: 1 });
    var R = K.rectsLocal(s);
    if (s.mode !== 'preview') {
      var src = R.source, wrapW = src[2] - 60;
      if (s.mode === 'split') F.line(966.5, 169, 966.5, 624, { color: C.border, width: 1 });
      g.save(); g.beginPath(); g.rect(src[0], src[1], src[2], src[3]); g.clip();
      var lines = sourceLines(n.body, wrapW), y0 = 169 + 22 + 17;
      lines.forEach(function (l, k) { if (l) atext(l, src[0] + 32, y0 + k * 23.625, { size: 13.5, family: 'mono', color: C.text2 }); });
      if (!n.body) sourceLines('Start writing. Markdown works: # headings, **bold**, - lists, [ ] tasks, `code`', wrapW).forEach(function (l, k) {
        atext(l, src[0] + 32, y0 + k * 23.625, { size: 13.5, family: 'mono', color: C.faint });
      });
      if (s.focus === 'body') {
        var ll = lines.length ? lines[lines.length - 1] : '';
        caret(src[0] + 32 + mw(ll, 13.5, 400, 'mono'), y0 + (Math.max(1, lines.length) - 1) * 23.625 - 14, 19, C, s, 'body', T);
      }
      g.restore();
    }
    if (s.mode !== 'edit') {
      var pv = R.preview, split = s.mode === 'split';
      F.box(pv[0], pv[1], pv[2], pv[3], 0, { fill: split ? C.bg : C.surface });
      g.save(); g.beginPath(); g.rect(pv[0], pv[1], pv[2], pv[3]); g.clip();
      var px = pv[0] + (split ? 36 : 32), pw = split ? pv[2] - 72 : Math.min(pv[2] - 64, 720);
      drawMd(n.body, px, 169 + 22, pw, C, pv[3]);
      g.restore();
    }
    // status bar
    F.line(584, 624, VW, 624, { color: C.border, width: 1 });
    var words = (plainText(n.body).match(/\S+/g) || []).length;
    var st = words + ' word' + (words === 1 ? '' : 's');
    atext(st, 604, 645.5, { size: 12, color: C.muted });
    var sx = 604 + mw(st, 12, 400) + 8;
    atext('·', sx, 645.5, { size: 12, color: C.faint });
    atext(n.body.length + ' characters', sx + 13, 645.5, { size: 12, color: C.muted });
    var saving = T >= s.editT && T < s.editT + 0.35;
    var lab = saving ? 'Saving…' : 'Saved on this device', lw = mw(lab, 12, 400);
    icon('hard-drive', 1330 - lw - 19, 634, 13, saving ? C.accentText : C.muted);
    atext(lab, 1330, 645.5, { size: 12, align: 'right', color: saving ? C.accentText : C.muted });
  }
  var SRC = {};
  function sourceLines(body, width) {
    var key = width + '\u0000' + body;
    if (cacheOn && SRC[key]) return SRC[key];
    var cw = mw('M', 13.5, 400, 'mono'), per = Math.max(10, Math.floor(width / cw)), out = [];
    body.split('\n').forEach(function (l) {
      if (l.length <= per) { out.push(l); return; }
      var rest = l;
      while (rest.length > per) {
        var cut = rest.lastIndexOf(' ', per);
        if (cut <= 0) cut = per;
        out.push(rest.slice(0, cut + 1)); rest = rest.slice(cut + 1);
      }
      out.push(rest);
    });
    if (cacheOn) SRC[key] = out;
    return out;
  }
  K.rectsLocal = function (s) {
    var split = s.mode === 'split';
    return {
      source: s.mode === 'preview' ? [584, 169, 0, 455] : [584, 169, split ? 382 : VW - 584, 455],
      preview: s.mode === 'edit' ? [VW, 169, 0, 455] : split ? [967, 169, 383, 455] : [584, 169, VW - 584, 455],
    };
  };

  function drawPalette(T, s, C, L) {
    var g = F.g;
    F.box(0, 0, VW, VH, 0, { fill: C.overlay, dims: true });   // the palette's backdrop dims the app on purpose
    var r = L.palette, ts = [], q = s.palette.query.trim();
    if (q && q.charAt(0) !== '>' && q.charAt(0) !== '#') ts = terms(q);
    g.save();
    F.box(r[0], r[1], r[2], r[3], 14, { fill: C.surface, stroke: C.border, lineWidth: 1, shadow: { blur: 60, y: 24, color: C.shadow } });
    g.beginPath(); F.rr(r[0], r[1], r[2], r[3], 14); g.clip();
    // input row
    icon('search', 388, 94, 18, C.muted);
    if (s.palette.query) atext(s.palette.query, 418, 109, { size: 16, color: C.text });
    else atext('Search notes, #tags, or commands', 418, 109, { size: 16, color: C.faint });
    caret(418 + (s.palette.query ? mw(s.palette.query, 16, 400) + 1 : 0), 92, 22, C, s, 'palette', T);
    var ew = mw('esc', 11, 500) + 10;
    kbd('esc', r[0] + r[2] - 16 - ew, 93, C);
    F.line(r[0], 131, r[0] + r[2], 131, { color: C.border, width: 1 });
    // results
    g.save(); g.beginPath(); g.rect(r[0], 131.5, r[2], L.palResH); g.clip();
    L.pal.forEach(function (e) {
      if (e.k === 'group') { atext(e.label.toUpperCase(), 386, e.y + 10 + 12, { size: 11, weight: 600, tracking: 0.06, color: C.faint }); return; }
      if (e.k === 'empty') { atext('No results for “' + s.palette.query + '”', r[0] + r[2] / 2, e.y + 44, { size: 14, align: 'center', color: C.muted }); return; }
      var it = e.it, sel = e.i === s.palette.index;
      if (sel) F.box(376, e.y, 599, e.h, 6, { fill: C.accentSoft });
      var iy = e.y + (e.h - 30) / 2;
      F.box(386, iy, 30, 30, 8, { fill: sel ? C.accent : C.surface2 });
      icon(it.icon, 393, iy + 7, 16, sel ? C.onAccent : C.muted);
      var hintW = 0;
      if (it.hint) { hintW = mw(it.hint, 12, 400); atext(it.hint, 965, e.y + e.h / 2 + 4, { size: 12, align: 'right', color: C.faint }); }
      else if (it.keys) {
        var kx = 965, ks = it.keys.slice().reverse();
        ks.forEach(function (k) { kx -= kbdW(k); kbd(k, kx, e.y + e.h / 2 - 10, C); kx -= 4; });
        hintW = 965 - kx;
      }
      var maxW = 965 - 428 - hintW - 12;
      var titleRuns = it.titleRuns || [{ t: it.title }];
      drawRuns(oneLine(titleRuns, maxW, { size: 14, weight: 600 }), 428, e.y + (it.subRuns ? 9 + 15.5 : e.h / 2 + 5), { size: 14, weight: 600, color: C.text }, C);
      if (it.subRuns) drawRuns(oneLine(it.subRuns, maxW, { size: 12.5, weight: 400 }), 428, e.y + 9 + 21 + 14, { size: 12.5, weight: 400, color: C.muted }, C);
    });
    g.restore();
    // footer
    var fy = 131 + L.palResH;
    F.box(r[0], fy, r[2], 38, 0, { fill: C.surface2 });
    F.line(r[0], fy, r[0] + r[2], fy, { color: C.border, width: 1 });
    var fx = 387, by = fy + 10;
    [[['up', 'down'], 'move'], [['return'], 'open'], [['#'], 'tags'], [['>'], 'commands']].forEach(function (f) {
      f[0].forEach(function (k) {
        F.box(fx, by, 18, 18, 5, { fill: C.surface, stroke: C.borderStrong, lineWidth: 1 });
        if (k.length > 1) F.glyph(k, fx + 9, by + 8.5, 10, { color: C.muted, width: 0.12 });
        else atext(k, fx + 9, by + 9.5, { size: 10.5, weight: 500, align: 'center', baseline: 'middle', color: C.muted });
        fx += 22;
      });
      atext(f[1], fx, by + 13, { size: 12, color: C.muted });
      fx += mw(f[1], 12, 400) + 16;
    });
    g.restore();
  }

  function drawMenu(T, s, C) {
    var n = active(s), cur = n ? n.notebook : '';
    F.box(616, 154, 168, 122, 8, { fill: C.surface, stroke: C.border, lineWidth: 1, shadow: { blur: 24, y: 10, color: C.shadow } });
    NOTEBOOKS.forEach(function (nb, k) {
      var y = 159 + k * 28, hot = s.hover === 'menuItem:' + nb.id;
      if (hot) F.box(621, y, 158, 28, 5, { fill: C.accent });
      if (nb.id === cur) F.glyph('check', 634, y + 14, 12, { color: hot ? C.onAccent : C.text, width: 0.14 });
      atext(nb.name, 648, y + 18.5, { size: 13.5, color: hot ? C.onAccent : C.text });
    });
  }

  /** The browser window with the app at time T for state s (world coordinates: draw it under the camera). */
  K.drawApp = function (T, s) {
    var C = THEMES[s.theme] || THEMES.light, L = layout(s);
    F.browser(WIN, { url: K.brand.url, theme: C.chrome, page: C.bg, bar: BAR }, function (g) {
      g.save();
      g.scale(U, U);
      drawSidebar(T, s, C, L);
      drawList(T, s, C, L);
      drawEditor(T, s, C, L);
      if (s.menu === 'notebook') drawMenu(T, s, C);
      if (s.palette) drawPalette(T, s, C, L);
      g.restore();
    });
  };

  // ================================================================== narration
  function norm(w) { return String(w).toLowerCase().replace(/[^\w’']/g, ''); }
  /**
   * Narration from `showtime voice script` (vo.js holds its timeline): word times for cues,
   * caption chunks and the spans to duck the music under.
   *   VO.at('new', 'N')        start of the first word "N" in line new (nth: VO.at(id, w, 2))
   *   VO.end('new', 'N')       end of that word;  VO.line('new') -> {start, end, speech_start, speech_end}
   */
  K.voice = function (data) {
    var byId = {};
    data.lines.forEach(function (l) { byId[l.id] = l; });
    function find(id, word, nth) {
      var l = byId[id]; if (!l) throw new Error('VO: no line "' + id + '"');
      var k = 0, want = norm(word);
      for (var i = 0; i < l.words.length; i++) if (norm(l.words[i][0]) === want && ++k === (nth || 1)) return l.words[i];
      throw new Error('VO: no word "' + word + '" in line "' + id + '"');
    }
    return {
      data: data,
      line: function (id) { var l = byId[id]; if (!l) throw new Error('VO: no line "' + id + '"'); return l; },
      at: function (id, word, nth) { return find(id, word, nth)[1]; },
      end: function (id, word, nth) { return find(id, word, nth)[2]; },
      /**
       * Caption chunks timed to the words: at most ~76 characters (one line), short sentences
       * joined with the next, long ones broken after a comma (never leaving a stub under 24 characters).
       */
      captions: function (o) {
        o = o || {};
        var max = o.max || 76, out = [];
        var txt = function (ws) { return ws.map(function (w) { return w[0]; }).join(' '); };
        data.lines.forEach(function (l) {
          if (o.skip && o.skip.indexOf(l.id) >= 0) return;
          var cur = [];
          l.words.forEach(function (w, i) {
            if (cur.length && txt(cur.concat([w])).length > max) {
              var ci = -1, k;
              for (k = cur.length - 1; k >= 0 && ci < 0; k--) if (/[.?!]$/.test(cur[k][0])) ci = k;          // a sentence end
              for (k = cur.length - 2; k >= 0 && ci < 0; k--) if (/,$/.test(cur[k][0]) && txt(cur.slice(0, k + 1)).length >= 24) ci = k;
              if (ci === cur.length - 1) { out.push(cur); cur = []; ci = -2; }
              if (ci >= 0) { out.push(cur.slice(0, ci + 1)); cur = cur.slice(ci + 1); } else if (ci === -1) { out.push(cur); cur = []; }
            }
            cur.push(w);
            if (/[.?!]$/.test(w[0]) && i < l.words.length - 1 && txt(cur).length >= 34) { out.push(cur); cur = []; }
          });
          if (cur.length) out.push(cur);
        });
        return out.map(function (ws, i) {
          var t0 = ws[0][1] - 0.12, t1 = ws[ws.length - 1][2] + 0.6;
          if (i + 1 < out.length) t1 = Math.min(t1, out[i + 1][0][1] - 0.22);
          return [t0, t1, txt(ws)];
        });
      },
      /** Speech spans merged across short pauses: [[t0, t1], ...] for ducking. */
      spans: function (gap) {
        var out = [];
        data.lines.forEach(function (l) {
          var a = l.speech_start, b = l.speech_end, last = out[out.length - 1];
          if (last && a - last[1] < (gap || 1.3)) last[1] = b; else out.push([a, b]);
        });
        return out;
      },
    };
  };

  // ================================================================== series chrome
  /** A slow push-in (6 %) on a card's content between t0 and t1, so held cards never freeze. */
  function slowPush(T, t0, t1) {
    var g = F.g, k = 1 + 0.06 * F.seg(T, t0, t1);
    g.translate(F.W / 2, F.H / 2); g.scale(k, k); g.translate(-F.W / 2, -F.H / 2);
  }
  K.intro = function (T, t0, t1, ep) {
    var P = F.pal, g = F.g, out = 1 - F.seg(T, t1 - 0.45, t1, 'inOutSine');
    if (out <= 0) return;
    g.save(); g.globalAlpha *= out;
    backdrop(T, g, true);
    slowPush(T, t0, t1 + 1);
    var cx = F.W / 2, y = F.H / 2 - 30;
    var a1 = F.seg(T, t0 + 0.1, t0 + 0.7, 'outCubic'), a2 = F.seg(T, t0 + 0.35, t0 + 1.0, 'outCubic');
    // the subtitle rises with the title: it needs its whole ~3 s on screen to be read
    var a3 = F.seg(T, t0 + 0.45, t0 + 1.1, 'outCubic'), a4 = F.seg(T, t0 + 0.55, t0 + 1.2, 'outCubic');
    g.save(); g.globalAlpha *= a1; g.translate(0, (1 - a1) * 10);
    logo(cx - 34, y - 250, 68);
    g.restore();
    F.text(K.brand.series.toUpperCase(), cx, y - 132, { size: 22, weight: 650, tracking: 0.3, align: 'center', color: P.muted, alpha: a1 });
    F.box(cx - 45 * a2, y - 108, 90 * a2, 5, 2.5, { fill: P.accent });
    F.text('Episode ' + (ep.number < 10 ? '0' : '') + ep.number, cx, y - 50, { size: 30, weight: 600, align: 'center', color: P.accent, alpha: a2 });
    F.text(ep.title, cx, y + 38 + (1 - a3) * 16, { size: 84, weight: 800, align: 'center', tracking: -0.02, alpha: a3, maxWidth: F.W * 0.86 });
    if (ep.subtitle) F.text(ep.subtitle, cx, y + 108 + (1 - a4) * 12, { size: 32, weight: 450, align: 'center', color: P.muted, alpha: a4, maxWidth: F.W * 0.7 });
    g.restore();
  };
  // opaque: zoomed shots slide the app under the band, and nothing of it may show through
  K.band = function (T, steps, end) { return F.stepBand(T, steps, { end: end, h: K.BAND_H, size: 28, fill: '#06282E' }); };
  K.captions = function (T, list) {
    return F.captions(T, list, { y: K.CAPTION_Y, size: 30, maxWidth: F.W * 0.8, fill: 'rgba(3,22,26,0.88)' });
  };
  K.keycaps = function (T, presses) {
    for (var i = 0; i < (presses || []).length; i++) {
      // held 1.3 s after the press (long enough to read its label), cut short only by the next keycap
      var k = presses[i], t = k[0], nx = i + 1 < presses.length ? presses[i + 1][0] - 0.45 : Infinity;
      var v = F.win(T, t - 0.4, Math.max(t + 0.9, Math.min(t + 1.3, nx)), 0.12, 0.25);
      if (v <= 0) continue;
      var y = 860, wide = Math.max(340, 120 * k[1].length + 100);
      F.box(F.W / 2 - wide / 2, y - 58, wide, 116, 26, { fill: 'rgba(6,34,40,0.9)', alpha: v });
      F.keyCombo(k[1], F.W / 2, y - (k[2] ? 10 : 0), { size: 62, alpha: v, p: F.seg(T, t - 0.4, t - 0.12), press: F.win(T, t - 0.04, t + 0.14, 0.04, 0.08) });
      if (k[2]) F.text(k[2], F.W / 2, y + 44, { size: 17, weight: 600, align: 'center', color: '#E3F4F3', alpha: v });
    }
  };
  K.recap = function (T, t0, t1, items) {
    var P = F.pal, g = F.g, v = Math.min(F.seg(T, t0, t0 + 0.45, 'inOutSine'), 1 - F.seg(T, t1 - 0.4, t1, 'inOutSine'));
    if (v <= 0) return;
    g.save(); g.globalAlpha *= v;
    backdrop(T, g, true);
    slowPush(T, t0, t1);
    F.text('RECAP', F.W / 2, 230, { size: 24, weight: 700, tracking: 0.3, align: 'center', color: P.accent });
    var n = items.length, rowH = n > 5 ? 90 : 104, y0 = F.H / 2 - (n - 1) * rowH / 2 + 30;
    items.forEach(function (it, i) {
      var a = F.seg(T, t0 + 0.35 + i * 0.3, t0 + 0.85 + i * 0.3, 'outCubic'), y = y0 + i * rowH;
      g.save(); g.globalAlpha *= a; g.translate((1 - a) * -24, 0);
      if (it[0] && it[0].length) F.keyCombo(it[0], F.W / 2 - 190, y, { size: 56, press: 0 });
      else F.circle(F.W / 2 - 190, y, 10, { fill: P.accent });
      F.text(it[1], F.W / 2 - 50, y + 2, { size: 38, weight: 600, baseline: 'middle' });
      g.restore();
    });
    g.restore();
  };
  K.outro = function (T, t0, t1, next) {
    var P = F.pal, g = F.g, v = F.seg(T, t0, t0 + 0.5, 'inOutSine');
    if (v <= 0) return;
    g.save(); g.globalAlpha *= v;
    backdrop(T, g, true);
    slowPush(T, t0, t1);
    var a1 = F.seg(T, t0 + 0.3, t0 + 0.9, 'outCubic'), a2 = F.seg(T, t0 + 0.8, t0 + 1.5, 'outCubic');
    if (next) {
      F.text('NEXT EPISODE', F.W / 2, F.H / 2 - 130, { size: 22, weight: 700, tracking: 0.3, align: 'center', color: P.accent, alpha: a1 });
      F.text(next, F.W / 2, F.H / 2 - 50 + (1 - a1) * 14, { size: 56, weight: 750, align: 'center', alpha: a1, maxWidth: F.W * 0.84 });
    } else {
      F.text(K.brand.series.toUpperCase(), F.W / 2, F.H / 2 - 130, { size: 22, weight: 700, tracking: 0.3, align: 'center', color: P.accent, alpha: a1 });
      F.text('Thanks for watching', F.W / 2, F.H / 2 - 50 + (1 - a1) * 14, { size: 56, weight: 750, align: 'center', alpha: a1 });
    }
    // the logo's wave, rolling gently while the card holds
    g.save(); g.globalAlpha *= a2; g.strokeStyle = P.accent; g.lineWidth = 7; g.lineCap = 'round'; g.beginPath();
    for (var wx = -230 * a2; wx <= 230 * a2; wx += 3) {
      var wy = F.H / 2 + 32 + Math.sin(wx / 30 - T * 2.2) * 11 * (1 - Math.abs(wx) / 300);
      if (wx === -230 * a2) g.moveTo(F.W / 2 + wx, wy); else g.lineTo(F.W / 2 + wx, wy);
    }
    g.stroke(); g.restore();
    F.text(K.brand.closing, F.W / 2, F.H / 2 + 100, { size: 34, weight: 450, align: 'center', color: P.muted, alpha: a2 });
    g.save(); g.globalAlpha *= a2;
    logo(F.W / 2 - 88, F.H - 168, 40);
    F.text(K.brand.product, F.W / 2 - 38, F.H - 138, { size: 28, weight: 700, tracking: -0.01 });
    g.restore();
    g.restore();
  };

  // ================================================================== series sound
  var S = K.sound = {};
  function keyScale() { return Synth.scale(K.brand.key + '5', 'major'); }
  /** The series signature: a rising "tide" figure (root, fifth, fourth, octave) over a swell; resolve falls back. */
  S.signature = function (m, t, o) {
    o = o || {};
    var sc = keyScale(), degs = o.resolve ? [7, 4, 2, 0] : [0, 4, 3, 7], step = o.resolve ? 0.22 : 0.17;
    m.pad(Synth.chord(K.brand.key + 'add9', 3), t - 0.4, o.resolve ? 3.4 : 2.6, { vel: 0.3, attack: 0.6, release: 1.8, cutoff: 1700, bus: 'sfx' });
    degs.forEach(function (d, i) { m.bell(sc.degree(d), t + i * step, { vel: 0.4 - i * 0.04, decay: 2.4, send: 0.55, bus: 'sfx' }); });
    m.bass(Synth.noteName(sc.degree(0) - 36), t, 1.3, { vel: 0.33, cutoff: 220, bus: 'sfx' });
  };
  S.click = function (m, t) { m.click(t, { vel: 0.6 }); m.thock(t + 0.008, { vel: 0.2 }); };
  S.key = function (m, t) { m.keyClick(t, { vel: 0.5, release: true }); };
  S.enter = function (m, t) { m.keyClick(t - 0.01, { vel: 0.55, release: false }); m.thock(t, { vel: 0.45 }); };
  S.success = function (m, t) { var sc = keyScale(); m.chime([sc.degree(2), sc.degree(4), sc.degree(7)], t, { vel: 0.22 }); };
  S.snap = function (m, t) { m.thock(t, { vel: 0.32, tone: 240 }); m.tick(t + 0.012, { tone: 3100, vel: 0.2 }); };
  S.whoosh = function (m, t) { m.whoosh(t, { vel: 0.16, dur: 0.8, lo: 400, hi: 2400 }); };
  S.step = function (m, t) { m.tick(t, { tone: 2300, vel: 0.3 }); m.bell(keyScale().degree(4), t + 0.02, { vel: 0.13, decay: 1.2, bus: 'sfx' }); };
  /**
   * The series bed (the same in every episode): one chord a bar (I V vi IVmaj7), soft bass, a
   * marimba pulse, and a high "drop" every fourth bar. Pads resume mid-chord on any seek.
   */
  S.bed = function (m, t0, t1, o) {
    o = o || {};
    var g = m.grid({ bpm: 80, offset: t0 }), sc = keyScale();
    var chords = Synth.progression(K.brand.key + '3', 'major', ['I', 'V', 'vi7', 'IVmaj7'], { range: [50, 72] });
    for (var b = 0; g.t(b) < t1 - 0.1; b++) {
      var c = chords[b % chords.length], t = g.t(b), len = Math.min(g.barDur * 1.02, t1 - t + 0.4);
      m.pad(c, t, len, { vel: 0.28, attack: b === 0 ? 0.8 : 0.45, cutoff: 1200 });
      m.bass(Synth.noteName(c[0] - 12), t, Math.min(g.barDur * 0.95, t1 - t), { vel: 0.24, cutoff: 260 });
      if (b > 0) m.arp(c, t, Math.min(t + g.barDur, t1), { grid: g, div: 2, inst: 'marimba', vel: 0.09, pattern: 'updown' });
      if (b % 4 === 3) m.bell(sc.degree([4, 7, 9, 11][(b >> 2) % 4]), t + g.barDur * 0.5, { vel: 0.1, decay: 2.2, send: 0.6, bus: 'music' });
    }
    m.level('music', o.db === undefined ? -19 : o.db);
    m.fade('music', t1 - 1.4, t1, -40);
  };

  // ================================================================== one-call episode
  /**
   * An episode from one timeline table. spec: {number, title, subtitle, duration, app (K.state
   * extras), vo (K.voice), intro: [t0, t1], steps: [[t, title]], stepsEnd, recap: {t0, items},
   * outro: {t0, next}, state: [[t, fn]], typing: [[t, text, cps, field]], keys: [[t, keys, label]],
   * cursor: [[t, 'rect', {click, at, dx, dy, tag}]], camera: [[t, 'rect' | [x, y], zoom, {whoosh}]],
   * spots, callouts, pulses, success, snaps, captions (default: from the narration), duck (dB)}.
   */
  K.episode = function (spec) {
    var ep = spec, intro = ep.intro || [0, 3.6], end = ep.stepsEnd || (ep.recap ? ep.recap.t0 : ep.duration);
    var init = K.state(ep.app);
    var events = (ep.state || []).slice();
    (ep.typing || []).forEach(function (ty) { events.push([ty[0], A.type(ty[3] || 'body', ty[1], ty[2] || 12)]); });
    (ep.cursor || []).forEach(function (k) { if (k[2] && k[2].click) events.push([k[0], A.press(k[1])]); });
    function stateAt(T) { return F.fold(T, init, events); }
    var captions = ep.captions || (ep.vo ? ep.vo.captions({ skip: ep.captionSkip }) : []);
    var cursorKeys = null, camKeys = null;
    // named targets resolve lazily (on the first frame, once fonts are measured) with the UI as it is at each key's time
    function resolve() {
      cacheOn = true;
      cursorKeys = (ep.cursor || []).map(function (k) {
        if (typeof k[1] !== 'string') return k;
        var opt = k[2] || {}, pt = K.rects(stateAt(k[0] - 0.001)).point(k[1], opt.at);
        return [k[0], pt[0] + (opt.dx || 0), pt[1] + (opt.dy || 0), opt];
      });
      camKeys = (ep.camera || []).map(function (k) {
        var target = k[1], zoom = k[2] === undefined || k[2] === null ? 1 : k[2], o = k[3] || {};
        if (typeof target === 'string') {
          var r = K.rects(stateAt(k[0])).rect(target), f = F.focus(r, { pad: 0.2, clamp: false });
          var z = k[2] === undefined || k[2] === null ? f.zoom : zoom;
          return [k[0], f.x + (o.dx || 0), f.y - 36 / z + (o.dy || 0), z, o.ease];
        }
        if (Array.isArray(target)) return [k[0], target[0], target[1], zoom, o.ease];
        return [k[0], F.W / 2, F.H / 2, 1];
      });
      // holds become slow push-ins (about 1 % a second, at most 5 %): a held shot never freezes
      var tEnd = ep.recap ? ep.recap.t0 : ep.duration, lastK = camKeys[camKeys.length - 1];
      if (lastK && tEnd - lastK[0] > 1.5) camKeys.push([tEnd, lastK[1], lastK[2], lastK[3], 'inOutSine']);
      for (var i = 1; i < camKeys.length; i++) {
        var a = camKeys[i - 1], b = camKeys[i], gap = b[0] - a[0];
        if (gap > 1.5 && a[1] === b[1] && a[2] === b[2] && a[3] === b[3]) { b[3] = a[3] * (1 + Math.min(0.05, 0.01 * gap)); b[4] = b[4] || 'inOutSine'; }
      }
    }
    var bounds = { x: WIN.x - 30, y: WIN.y - 56, w: WIN.w + 60, h: WIN.h + 116 };
    /**
     * Zoomed shots stay on the app: the view is kept inside the window (no sliver of backdrop at an
     * edge) and its top may slide under the step band only down to the page, so neither the browser
     * bar nor the backdrop peeks out under the band. Blended in from zoom 1 to 1.3 (continuous moves).
     */
    function stageClamp(cam) {
      var z = cam.zoom, k = Math.min(1, Math.max(0, (z - 1) / 0.3));
      if (k <= 0) return cam;
      k = k * k * (3 - 2 * k);
      var hw = F.W / (2 * z), hh = F.H / (2 * z);
      var l = WIN.x, r = WIN.x + WIN.w, t = PAGE.y - K.BAND_H / z, b = WIN.y + WIN.h;
      var x = r - l <= 2 * hw ? (l + r) / 2 : Math.min(Math.max(cam.x, l + hw), r - hw);
      var y = b - t <= 2 * hh ? (t + b) / 2 : Math.min(Math.max(cam.y, t + hh), b - hh);
      return { x: cam.x + (x - cam.x) * k, y: cam.y + (y - cam.y) * k, zoom: z, rot: cam.rot || 0 };
    }
    var chapters = [[intro[0], 'Intro']].concat((ep.steps || []).map(function (s) { return [s[0], s[1]]; }));
    if (ep.recap) chapters.push([ep.recap.t0, 'Recap']);

    function scenes(T) {
      if (!cursorKeys) resolve();
      var st = stateAt(T), ui = K.rects(st);
      var cam = camKeys.length ? stageClamp(F.camera(T, camKeys, { clamp: bounds })) : { x: F.W / 2, y: F.H / 2, zoom: 1 };
      var cur = F.cursorPath(T, cursorKeys);
      st.hover = '';
      var hs = hoverables(st);
      for (var i = 0; i < hs.length; i++) {
        var r; try { r = ui.rect(hs[i]); } catch (e) { r = null; }
        if (r && cur.x >= r.x && cur.x <= r.x + r.w && cur.y >= r.y && cur.y <= r.y + r.h) { st.hover = hs[i]; break; }
      }
      var showUI = T >= intro[1] - 0.5 && T < (ep.recap ? ep.recap.t0 + 0.5 : ep.duration);
      if (showUI) {
        F.withCamera(cam, function () {
          K.drawApp(T, st);
          (ep.spots || []).forEach(function (s) {
            var v = F.win(T, s[0], s[1], 0.3, 0.3);
            if (v > 0) { var r = ui.rect(s[2]); F.spotlight({ x: r.x, y: r.y, w: r.w, h: r.h, r: 12 }, { p: v, pad: s[3] === undefined ? 8 : s[3], dim: 0.42, ring: F.pal.accent }); }
          });
          (ep.pulses || []).forEach(function (pl) {
            if (T >= pl[0] && T <= pl[1] + 1) { var r = ui.rect(pl[2]); F.pulse({ x: r.x, y: r.y, w: r.w, h: r.h, r: 10 }, T, pl[0], { t1: pl[1], color: '#14A3A0' }); }
          });
          (ep.callouts || []).forEach(function (c) {
            var v = F.seg(T, c[0], c[0] + 0.7) * (1 - F.seg(T, c[1] - 0.3, c[1]));
            if (v <= 0) return;
            var side = c[4] || 'right', a = ui.point(c[2], side === 'above' ? 'top' : side === 'below' ? 'bottom' : side);
            var d = c[6] || (side === 'left' ? [-140, -56] : side === 'above' ? [36, -110] : side === 'below' ? [36, 100] : [140, -56]);
            F.callout(a[0], a[1], a[0] + d[0], a[1] + d[1], c[3], { p: v, size: c[7] || 24, sub: c[5] });
          });
          if (ep.draw) ep.draw(T, st, ui);
          if (cur.click) F.ripple(cur.click.x, cur.click.y, cur.clickAge, { radius: 26, color: '#14A3A0' });
          var tag = '', tagA = 0;
          cursorKeys.forEach(function (k) { var o = k[3] || {}; if (o.tag) { var a = F.win(T, k[0] - 0.8, k[0] + 0.9, 0.2, 0.25); if (a > tagA) { tagA = a; tag = o.tag; } } });
          var ibeam = HOVER_TEXT[st.hover.split(':')[0]] && !st.palette;
          var endT = ep.recap ? ep.recap.t0 : ep.duration;
          if (T < endT) F.cursor(cur.x, cur.y, { kind: ibeam ? 'ibeam' : 'arrow', press: cur.press, scale: ibeam ? 1.3 : 1.35, color: st.theme === 'dark' && ibeam ? '#E3EEEF' : '#0F1E22', tag: tag, tagAlpha: tagA });
        });
        K.band(T, ep.steps || [], end);
        K.keycaps(T, ep.keys);
      }
      if (T < intro[1]) K.intro(T, intro[0], intro[1], ep);
      // the recap is gone before the outro's words rise (t0 + 0.3), so the two cards never overprint
      if (ep.recap) K.recap(T, ep.recap.t0, ep.outro ? ep.outro.t0 + 0.3 : ep.duration, ep.recap.items || []);
      if (ep.outro) K.outro(T, ep.outro.t0, ep.duration, ep.outro.next);
      K.captions(T, captions);          // the spoken words, over everything (recap and outro too)
    }

    var score = Synth.score(function (m) {
      S.signature(m, intro[0] + 0.45);
      S.bed(m, intro[1] - 0.6, ep.duration - 0.2, ep.music);
      (ep.steps || []).forEach(function (s) { S.step(m, s[0]); });
      (ep.cursor || []).forEach(function (k) { if (k[2] && k[2].click) S.click(m, k[0]); });
      (ep.keys || []).forEach(function (k) { if (k[3] === 'enter' || /↵|⏎|Enter|return/.test(String(k[1][k[1].length - 1]))) S.enter(m, k[0]); else S.key(m, k[0]); });
      (ep.typing || []).forEach(function (ty) {
        for (var i = 0; i < ty[1].length; i++) if (ty[1][i] !== ' ') m.keyClick(ty[0] + (i + 1) / (ty[2] || 12) - 0.012, { vel: 0.36, seed: i + 3, release: false });
      });
      (ep.camera || []).forEach(function (k) { if (k[3] && k[3].whoosh) S.whoosh(m, k[0] - 0.25); });
      (ep.success || []).forEach(function (t) { S.success(m, t); });
      (ep.snaps || []).forEach(function (t) { S.snap(m, t); });
      if (ep.recap) (ep.recap.items || []).forEach(function (it, i) { m.tick(ep.recap.t0 + 0.5 + i * 0.3, { tone: 1900, vel: 0.22 }); });
      if (ep.outro) S.signature(m, ep.outro.t0 + 0.4, { resolve: true });
      // the bed sits under the narration: dip the music bus while the voice speaks
      if (ep.vo) ep.vo.spans(1.4).forEach(function (sp) {
        m.duck('music', sp[0], { depth: ep.duck === undefined ? 11 : ep.duck, attack: 0.35, hold: Math.max(0.05, sp[1] - sp[0]), release: 0.8 });
      });
      m.end(ep.duration, { fade: 1.2 });
    }, { bpm: 80, seed: 21 + (ep.number || 0), reverb: { seconds: 2.6, wet: 0.7 }, master: { gain: 7 } });

    return Film.start({
      look: K.look, palette: K.palette, fonts: K.fonts, design: [1920, 1080],
      acts: chapters, subtitle: ep.subtitle || '', kicker: K.brand.series + ' · Episode ' + (ep.number < 10 ? '0' : '') + ep.number,
      fadeOut: 0.6, scenes: scenes, score: score,
    });
  };

  /** The series opener: the series name, a tagline and the episodes, on the signature motif. */
  K.opener = function (spec) {
    var D = spec.duration || 8, eps = spec.episodes || [];
    function scenes(T) {
      var P = F.pal, cx = F.W / 2;
      var a1 = F.seg(T, 0.3, 1.0, 'outCubic'), a2 = F.seg(T, 0.7, 1.4, 'outCubic'), a3 = F.seg(T, 1.1, 1.8, 'outCubic');
      F.g.save(); F.g.globalAlpha *= a1; logo(cx - 40, 210 + (1 - a1) * 12, 80); F.g.restore();
      F.text(K.brand.series, cx, 420 + (1 - a2) * 18, { size: 104, weight: 800, align: 'center', tracking: -0.025, alpha: a2 });
      if (spec.tagline) F.text(spec.tagline, cx, 500 + (1 - a3) * 12, { size: 36, weight: 450, align: 'center', color: P.muted, alpha: a3 });
      eps.forEach(function (e, i) {
        var a = F.seg(T, 2.0 + i * 0.35, 2.5 + i * 0.35, 'outCubic');
        F.pill(e, cx, 630 + i * 70, { size: 26, fill: F.rgba(P.accent, 0.12), stroke: F.rgba(P.accent, 0.3), color: P.ink, weight: 600, alpha: a });
      });
    }
    var score = Synth.score(function (m) {
      var t0 = spec.motif === undefined ? 0.6 : spec.motif;
      S.signature(m, t0);
      S.bed(m, t0 + 0.8, D - 0.5, { db: -15 });
      eps.forEach(function (e, i) { m.tick(2.05 + i * 0.35, { tone: 2000, vel: 0.22 }); });
      m.end(D, { fade: 1.5 });
    }, { bpm: 80, seed: 5, reverb: { seconds: 2.6, wet: 0.7 }, master: { gain: 7 } });
    return Film.start({
      look: K.look, palette: K.palette, fonts: K.fonts, design: [1920, 1080], fadeIn: 0.4, fadeOut: 0.8,
      subtitle: spec.tagline || '', kicker: K.brand.product, scenes: scenes, score: score,
    });
  };

  return K;
})();
