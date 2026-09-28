/* Tidepool: a fictional local-first notes app, built as demo material for showtime examples. */

/* Icons: Lucide (ISC license), fetched with showtime assets icon */
const ICONS = {
  "arrow-right": "<path d=\"M5 12h14\"/><path d=\"m12 5 7 7-7 7\"/>",
  "book-open": "<path d=\"M12 5v16\"/><path d=\"M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z\"/>",
  "briefcase": "<path d=\"M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16\"/><rect width=\"20\" height=\"14\" x=\"2\" y=\"6\" rx=\"2\"/>",
  "chevron-left": "<path d=\"m15 18-6-6 6-6\"/>",
  "columns-2": "<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\"/><path d=\"M12 3v18\"/>",
  "command": "<path d=\"M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3\"/>",
  "eye": "<path d=\"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/>",
  "file-text": "<path d=\"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z\"/><path d=\"M14 2v5a1 1 0 0 0 1 1h5\"/><path d=\"M10 9H8\"/><path d=\"M16 13H8\"/><path d=\"M16 17H8\"/>",
  "files": "<path d=\"M15 2h-4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8\"/><path d=\"M16.706 2.706A2.4 2.4 0 0 0 15 2v5a1 1 0 0 0 1 1h5a2.4 2.4 0 0 0-.706-1.706z\"/><path d=\"M5 7a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h8a2 2 0 0 0 1.732-1\"/>",
  "hard-drive": "<path d=\"M10 16h.01\"/><path d=\"M2.212 11.577a2 2 0 0 0-.212.896V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5.527a2 2 0 0 0-.212-.896L18.55 5.11A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z\"/><path d=\"M21.946 12.013H2.054\"/><path d=\"M6 16h.01\"/>",
  "hash": "<line x1=\"4\" x2=\"20\" y1=\"9\" y2=\"9\"/><line x1=\"4\" x2=\"20\" y1=\"15\" y2=\"15\"/><line x1=\"10\" x2=\"8\" y1=\"3\" y2=\"21\"/><line x1=\"16\" x2=\"14\" y1=\"3\" y2=\"21\"/>",
  "heart": "<path d=\"M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5\"/>",
  "inbox": "<polyline points=\"22 12 16 12 14 15 10 15 8 12 2 12\"/><path d=\"M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z\"/>",
  "keyboard": "<path d=\"M10 8h.01\"/><path d=\"M12 12h.01\"/><path d=\"M14 8h.01\"/><path d=\"M16 12h.01\"/><path d=\"M18 8h.01\"/><path d=\"M6 8h.01\"/><path d=\"M7 16h10\"/><path d=\"M8 12h.01\"/><rect width=\"20\" height=\"16\" x=\"2\" y=\"4\" rx=\"2\"/>",
  "layers": "<path d=\"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z\"/><path d=\"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12\"/><path d=\"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17\"/>",
  "moon": "<path d=\"M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401\"/>",
  "notebook-text": "<path d=\"M2 6h4\"/><path d=\"M2 10h4\"/><path d=\"M2 14h4\"/><path d=\"M2 18h4\"/><rect width=\"16\" height=\"20\" x=\"4\" y=\"2\" rx=\"2\"/><path d=\"M9.5 8h5\"/><path d=\"M9.5 12H16\"/><path d=\"M9.5 16H14\"/>",
  "pencil": "<path d=\"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z\"/><path d=\"m15 5 4 4\"/>",
  "pin": "<path d=\"M12 17v5\"/><path d=\"M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z\"/>",
  "plus": "<path d=\"M5 12h14\"/><path d=\"M12 5v14\"/>",
  "search": "<path d=\"m21 21-4.34-4.34\"/><circle cx=\"11\" cy=\"11\" r=\"8\"/>",
  "shield-check": "<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\"/><path d=\"m9 12 2 2 4-4\"/>",
  "sun": "<circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2v2\"/><path d=\"M12 20v2\"/><path d=\"m4.93 4.93 1.41 1.41\"/><path d=\"m17.66 17.66 1.41 1.41\"/><path d=\"M2 12h2\"/><path d=\"M20 12h2\"/><path d=\"m6.34 17.66-1.41 1.41\"/><path d=\"m19.07 4.93-1.41 1.41\"/>",
  "tag": "<path d=\"M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z\"/><circle cx=\"7.5\" cy=\"7.5\" r=\".5\" fill=\"currentColor\"/>",
  "trash-2": "<path d=\"M10 11v6\"/><path d=\"M14 11v6\"/><path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6\"/><path d=\"M3 6h18\"/><path d=\"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\"/>",
  "x": "<path d=\"M18 6 6 18\"/><path d=\"m6 6 12 12\"/>",
  "zap": "<path d=\"M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z\"/>",
};

(function () {
  'use strict';

  /* ---------------------------------------------------------------------
   * Seed data. Dates are fixed so demos render the same every time.
   * ------------------------------------------------------------------- */
  const NOTEBOOKS = [
    { id: 'inbox', name: 'Inbox', icon: 'inbox', color: '#14A3A0' },
    { id: 'work', name: 'Work', icon: 'briefcase', color: '#3B82C4' },
    { id: 'reading', name: 'Reading', icon: 'book-open', color: '#C98A2E' },
    { id: 'personal', name: 'Personal', icon: 'heart', color: '#E0694F' },
  ];

  const d = (iso) => new Date(iso).getTime();

  const SEED = [
    {
      id: 'welcome',
      title: 'Welcome to Tidepool',
      notebook: 'inbox',
      tags: ['guide'],
      pinned: true,
      createdAt: d('2026-09-25T09:00:00'),
      updatedAt: d('2026-09-25T09:41:00'),
      body: [
        'Tidepool keeps your notes **on this device**. There is no account and no server: everything you write is saved in this browser.',
        '',
        '## Get around quickly',
        '',
        '- **Cmd K** (Ctrl K on Windows and Linux) searches every note, tag and command',
        '- **N** starts a new note, **J** and **K** move through the list',
        '- **Cmd E** flips between writing and the rendered preview',
        '- **?** shows every shortcut',
        '',
        '## Markdown, rendered as you type',
        '',
        'Write `# headings`, **bold**, _italics_, `inline code`, and link notes together like [[Q4 planning draft]].',
        '',
        '- [x] Open Tidepool',
        '- [ ] Write your first note',
        '- [ ] Try the command palette',
        '',
        '> Tags live under the title. Click one in the sidebar to filter the list.',
      ].join('\n'),
    },
    {
      id: 'q4-planning',
      title: 'Q4 planning draft',
      notebook: 'work',
      tags: ['planning', 'work'],
      pinned: false,
      createdAt: d('2026-09-18T10:00:00'),
      updatedAt: d('2026-09-25T16:20:00'),
      body: [
        '## Themes',
        '',
        '1. Make search feel instant on large notebooks',
        '2. Export everything as plain Markdown files',
        '3. Fewer clicks between capture and review',
        '',
        '## Open questions',
        '',
        '- Should tags be nestable (`#work/hiring`)?',
        '- What is the smallest useful version of export?',
        '',
        '## This week',
        '',
        '- [x] Collect feedback from the design review',
        '- [ ] Draft the export spec',
        '- [ ] Share with the team on Friday',
        '',
        'Related: [[Standup, Sep 24]]',
      ].join('\n'),
    },
    {
      id: 'standup-sep-24',
      title: 'Standup, Sep 24',
      notebook: 'work',
      tags: ['meetings'],
      pinned: false,
      createdAt: d('2026-09-24T09:30:00'),
      updatedAt: d('2026-09-24T09:52:00'),
      body: [
        '**Maya**: finished the empty states, starting on the palette polish.',
        '',
        '**Jonas**: search index rebuild is 40% done. Blocked on a test fixture.',
        '',
        '**Priya**: reviewing the export spec, notes by Thursday.',
        '',
        '### Follow-ups',
        '',
        '- [ ] Pair with Jonas on the fixture',
        '- [x] Move the retro to Friday',
      ].join('\n'),
    },
    {
      id: 'debounce-snippet',
      title: 'Snippet: debounce',
      notebook: 'work',
      tags: ['code', 'javascript'],
      pinned: false,
      createdAt: d('2026-09-12T14:00:00'),
      updatedAt: d('2026-09-22T11:05:00'),
      body: [
        'Small helper for autosave: wait until typing pauses, then write once.',
        '',
        '```js',
        'function debounce(fn, wait = 300) {',
        '  let timer;',
        '  return (...args) => {',
        '    clearTimeout(timer);',
        '    timer = setTimeout(() => fn(...args), wait);',
        '  };',
        '}',
        '',
        '// Save at most once per pause in typing',
        'const save = debounce(() => store.write(notes), 400);',
        '```',
        '',
        'Use `leading: true` variants for buttons, trailing for text input.',
      ].join('\n'),
    },
    {
      id: 'local-first',
      title: 'Notes on local-first software',
      notebook: 'reading',
      tags: ['ideas', 'research'],
      pinned: false,
      createdAt: d('2026-09-10T20:00:00'),
      updatedAt: d('2026-09-21T21:14:00'),
      body: [
        'From the Ink & Switch essay [Local-first software](https://www.inkandswitch.com/local-first/) (2019). Its seven ideals:',
        '',
        '1. No spinners: your work at your fingertips',
        '2. Your work is not trapped on one device',
        '3. The network is optional',
        '4. Seamless collaboration with your colleagues',
        '5. The Long Now',
        '6. Security and privacy by default',
        '7. You retain ultimate ownership and control',
        '',
        '> The core idea: the copy on your own device is the primary copy. Servers, if any, are there to help sync.',
        '',
        'Tidepool only does the first part so far: notes stay in this browser.',
      ].join('\n'),
    },
    {
      id: 'reading-list',
      title: 'Reading list: autumn',
      notebook: 'reading',
      tags: ['books'],
      pinned: false,
      createdAt: d('2026-09-01T08:00:00'),
      updatedAt: d('2026-09-19T22:30:00'),
      body: [
        '| Book | Author | Status |',
        '| --- | --- | --- |',
        '| Thinking in Systems | Donella Meadows | Reading |',
        '| The Design of Everyday Things | Don Norman | Done |',
        '| How Buildings Learn | Stewart Brand | Next |',
        '| A Pattern Language | Christopher Alexander et al. | Someday |',
        '',
        'Keep notes per chapter, one line each. Link back to [[Notes on local-first software]] where it fits.',
      ].join('\n'),
    },
    {
      id: 'sourdough',
      title: 'Sourdough schedule',
      notebook: 'personal',
      tags: ['recipes'],
      pinned: false,
      createdAt: d('2026-08-30T08:00:00'),
      updatedAt: d('2026-09-14T18:45:00'),
      body: [
        '### Friday night',
        '',
        '- [ ] Feed the starter (1:1:1)',
        '',
        '### Saturday',
        '',
        '1. **9:00** mix 500 g flour + 350 g water, rest 1 h',
        '2. **10:00** add 100 g starter and 10 g salt',
        '3. **10:30 to 13:00** four sets of stretch and folds',
        '4. **Afternoon** bulk rise until about 50% bigger',
        '5. Shape, then into the fridge overnight',
        '',
        '### Sunday',
        '',
        'Bake at 250 °C: 20 min lid on, 25 min lid off.',
      ].join('\n'),
    },
    {
      id: 'weekly-review',
      title: 'Weekly review',
      notebook: 'personal',
      tags: ['templates', 'planning'],
      pinned: false,
      createdAt: d('2026-08-20T08:00:00'),
      updatedAt: d('2026-09-13T10:10:00'),
      body: [
        'A short template. Duplicate it every Sunday.',
        '',
        '## Look back',
        '',
        '- What moved forward this week?',
        '- What got stuck, and why?',
        '',
        '## Look ahead',
        '',
        '- [ ] Clear the Inbox notebook',
        '- [ ] Pick three priorities',
        '- [ ] Block time for deep work',
        '',
        '---',
        '',
        '_Keep it under 15 minutes._',
      ].join('\n'),
    },
  ];

  /* ---------------------------------------------------------------------
   * Helpers
   * ------------------------------------------------------------------- */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icon = (name, cls) => `<span class="i${cls ? ' ' + cls : ''}" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ''}</svg></span>`;
  const IS_MAC = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent || '');
  const MOD = IS_MAC ? '⌘' : 'Ctrl';
  const params = (() => { try { return new URLSearchParams(location.search); } catch (e) { return new URLSearchParams(); } })();

  const store = {
    get(key) { try { return localStorage.getItem(key); } catch (e) { return null; } },
    set(key, val) { try { localStorage.setItem(key, val); } catch (e) { /* storage unavailable */ } },
    del(key) { try { localStorage.removeItem(key); } catch (e) { /* ignore */ } },
  };
  const STORE_KEY = 'tidepool.notes.v1';

  const clone = (x) => JSON.parse(JSON.stringify(x));
  const notebookById = (id) => NOTEBOOKS.find((n) => n.id === id) || NOTEBOOKS[0];
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const pad = (n) => String(n).padStart(2, '0');

  function formatDate(ts) {
    const now = Date.now();
    const diff = now - ts;
    if (diff >= 0 && diff < 60 * 1000) return 'Just now';
    const a = new Date(ts), b = new Date(now);
    if (a.toDateString() === b.toDateString()) return `${pad(a.getHours())}:${pad(a.getMinutes())}`;
    const s = `${MONTHS[a.getMonth()]} ${a.getDate()}`;
    return a.getFullYear() === b.getFullYear() ? s : `${s}, ${a.getFullYear()}`;
  }

  function plainText(md) {
    return md
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/^\s*\|?\s*:?-{3,}.*$/gm, ' ')
      .replace(/\[\[([^\]]+)\]\]/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/^\s*(#{1,6}|>|[-*]|\d+\.)\s+/gm, '')
      .replace(/\[( |x)\]\s/g, '')
      .replace(/[*_`|~]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /* One line of readable text for list snippets: headings dropped, lines joined with a dot. */
  function snippetText(md) {
    const lines = md.replace(/```[\s\S]*?```/g, '').split('\n');
    const out = [];
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      if (/^\s*$/.test(l) || /^#{1,6}\s/.test(l) || /^(-{3,}|\*{3,})\s*$/.test(l)) continue;
      if (/^\s*\|?\s*:?-{3,}/.test(l)) continue;
      if (/\|/.test(l) && i + 1 < lines.length && /^\s*\|?\s*:?-{3,}/.test(lines[i + 1])) continue;
      const cells = /^\s*\|/.test(l) ? l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim()).join(', ') : l;
      const t = plainText(cells);
      if (t) out.push(t);
    }
    return out.join(' · ');
  }

  function highlightTerms(text, terms) {
    let out = esc(text);
    if (!terms.length) return out;
    const pattern = terms.map((t) => esc(t).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    return out.replace(new RegExp(`(${pattern})`, 'gi'), '<mark>$1</mark>');
  }

  function snippetFor(note, terms) {
    const text = snippetText(note.body);
    if (!terms.length) return text.slice(0, 160);
    const lower = text.toLowerCase();
    let at = -1;
    for (const t of terms) { at = lower.indexOf(t); if (at >= 0) break; }
    if (at < 0) return text.slice(0, 160);
    const start = Math.max(0, at - 40);
    return (start > 0 ? '…' : '') + text.slice(start, start + 160);
  }

  /* ---------------------------------------------------------------------
   * Markdown (small, safe subset)
   * ------------------------------------------------------------------- */
  function highlightCode(code, lang) {
    if (!/^(js|javascript|ts|typescript|json)$/i.test(lang || '')) return esc(code);
    const re = /(\/\/[^\n]*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|\b(const|let|var|function|return|if|else|for|while|new|import|export|from|async|await|class|this|null|true|false|undefined|of|in)\b|\b(\d+(?:\.\d+)?)\b/g;
    let out = '', last = 0, m;
    while ((m = re.exec(code))) {
      out += esc(code.slice(last, m.index));
      const cls = m[1] ? 'tok-c' : m[2] ? 'tok-s' : m[3] ? 'tok-k' : 'tok-n';
      out += `<span class="${cls}">${esc(m[0])}</span>`;
      last = re.lastIndex;
    }
    return out + esc(code.slice(last));
  }

  function inline(src) {
    const slots = [];
    const hold = (html) => { slots.push(html); return `\u0000${slots.length - 1}\u0000`; };
    let s = src.replace(/`([^`]+)`/g, (_, c) => hold(`<code>${esc(c)}</code>`));
    s = s.replace(/\[\[([^\]]+)\]\]/g, (_, t) => hold(`<a href="#" class="wikilink" data-note-link="${esc(t)}">${esc(t)}</a>`));
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, url) => {
      const safe = /^(https?:|mailto:|#|\.{0,2}\/|[\w-]+\.html)/i.test(url) ? url : '#';
      return hold(`<a href="${esc(safe)}" target="_blank" rel="noopener noreferrer">${esc(t)}</a>`);
    });
    s = esc(s);
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(^|[^\w*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>');
    s = s.replace(/(^|[^\w])_([^_\s][^_]*)_(?!\w)/g, '$1<em>$2</em>');
    s = s.replace(/~~([^~]+)~~/g, '<del>$1</del>');
    return s.replace(/\u0000(\d+)\u0000/g, (_, i) => slots[+i]);
  }

  function renderMarkdown(src) {
    const lines = src.replace(/\r\n?/g, '\n').split('\n');
    let html = '';
    let i = 0;
    const isBlockStart = (l) => /^(#{1,6}\s|```|>|\s*[-*]\s|\s*\d+\.\s|(-{3,}|\*{3,})\s*$)/.test(l);
    while (i < lines.length) {
      const line = lines[i];
      let m;
      if ((m = line.match(/^```\s*([\w+-]*)\s*$/))) {
        const lang = m[1];
        const buf = [];
        i++;
        while (i < lines.length && !/^```\s*$/.test(lines[i])) buf.push(lines[i++]);
        i++;
        html += `<pre><code data-lang="${esc(lang)}">${highlightCode(buf.join('\n'), lang)}</code></pre>`;
        continue;
      }
      if (/^\s*$/.test(line)) { i++; continue; }
      if ((m = line.match(/^(#{1,6})\s+(.*)$/))) {
        const n = Math.min(m[1].length, 4);
        html += `<h${n}>${inline(m[2])}</h${n}>`;
        i++;
        continue;
      }
      if (/^(-{3,}|\*{3,})\s*$/.test(line)) { html += '<hr>'; i++; continue; }
      if (/^>/.test(line)) {
        const buf = [];
        while (i < lines.length && /^>/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, ''));
        html += `<blockquote>${renderMarkdown(buf.join('\n'))}</blockquote>`;
        continue;
      }
      if (/^\s*[-*]\s+/.test(line)) {
        const items = [];
        let tasks = false;
        while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
          const text = lines[i].replace(/^\s*[-*]\s+/, '');
          const t = text.match(/^\[( |x|X)\]\s+(.*)$/);
          if (t) {
            tasks = true;
            const done = t[1] !== ' ';
            items.push(`<li class="task${done ? ' done' : ''}"><input type="checkbox" data-line="${i}"${done ? ' checked' : ''} aria-label="Toggle task"><span>${inline(t[2])}</span></li>`);
          } else {
            items.push(`<li>${inline(text)}</li>`);
          }
          i++;
        }
        html += `<ul${tasks ? ' class="tasks"' : ''}>${items.join('')}</ul>`;
        continue;
      }
      if (/^\s*\d+\.\s+/.test(line)) {
        const items = [];
        const start = parseInt(line.trim(), 10) || 1;
        while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) items.push(`<li>${inline(lines[i++].replace(/^\s*\d+\.\s+/, ''))}</li>`);
        html += `<ol${start !== 1 ? ` start="${start}"` : ''}>${items.join('')}</ol>`;
        continue;
      }
      if (/\|/.test(line) && i + 1 < lines.length && /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?\s*$/.test(lines[i + 1])) {
        const cells = (l) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
        const head = cells(line);
        i += 2;
        const rows = [];
        while (i < lines.length && /\|/.test(lines[i]) && !/^\s*$/.test(lines[i])) rows.push(cells(lines[i++]));
        html += `<table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
        continue;
      }
      const buf = [line];
      i++;
      while (i < lines.length && !/^\s*$/.test(lines[i]) && !isBlockStart(lines[i])) buf.push(lines[i++]);
      html += `<p>${buf.map(inline).join('<br>')}</p>`;
    }
    return html;
  }

  /* ---------------------------------------------------------------------
   * State
   * ------------------------------------------------------------------- */
  const state = {
    notes: [],
    filter: { kind: 'all' },   // {kind:'all'|'pinned'|'notebook'|'tag', value}
    activeId: null,
    mode: 'split',
    lastWriteMode: 'split',
    listQuery: '',
  };

  const EPHEMERAL = params.has('ephemeral');

  function load() {
    if (EPHEMERAL) { state.notes = clone(SEED); return; }
    if (params.has('reset')) store.del(STORE_KEY);
    const raw = store.get(STORE_KEY);
    if (raw) {
      try {
        const data = JSON.parse(raw);
        if (Array.isArray(data.notes)) { state.notes = data.notes; return; }
      } catch (e) { /* fall through to seed */ }
    }
    state.notes = clone(SEED);
  }

  let saveTimer = null;
  function scheduleSave() {
    const el = $('#save-state');
    el.classList.add('is-saving');
    $('#save-label').textContent = 'Saving…';
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveNow, 350);
  }
  function saveNow() {
    clearTimeout(saveTimer);
    if (!EPHEMERAL) store.set(STORE_KEY, JSON.stringify({ v: 1, notes: state.notes }));
    $('#save-state').classList.remove('is-saving');
    $('#save-label').textContent = 'Saved on this device';
  }

  const activeNote = () => state.notes.find((n) => n.id === state.activeId) || null;

  function sortNotes(list) {
    return list.slice().sort((a, b) => (b.pinned - a.pinned) || (b.updatedAt - a.updatedAt));
  }

  function terms(q) { return q.toLowerCase().split(/\s+/).filter(Boolean); }

  function matches(note, ts) {
    if (!ts.length) return true;
    const hay = (note.title + '\n' + note.body + '\n' + note.tags.map((t) => '#' + t).join(' ')).toLowerCase();
    return ts.every((t) => hay.includes(t));
  }

  function scoreNote(note, ts) {
    let s = 0;
    const title = note.title.toLowerCase();
    for (const t of ts) {
      if (title.startsWith(t)) s += 12;
      else if (title.includes(t)) s += 8;
      if (note.tags.some((tag) => tag.includes(t.replace(/^#/, '')))) s += 4;
      const body = note.body.toLowerCase();
      let idx = body.indexOf(t), count = 0;
      while (idx >= 0 && count < 5) { count++; idx = body.indexOf(t, idx + t.length); }
      s += count;
    }
    return s + (note.pinned ? 0.5 : 0);
  }

  function filteredNotes() {
    const f = state.filter;
    let list = state.notes.filter((n) => {
      if (f.kind === 'pinned') return n.pinned;
      if (f.kind === 'notebook') return n.notebook === f.value;
      if (f.kind === 'tag') return n.tags.includes(f.value);
      return true;
    });
    const ts = terms(state.listQuery);
    list = list.filter((n) => matches(n, ts));
    return sortNotes(list);
  }

  function filterTitle() {
    const f = state.filter;
    if (f.kind === 'pinned') return 'Pinned';
    if (f.kind === 'notebook') return notebookById(f.value).name;
    if (f.kind === 'tag') return '#' + f.value;
    return 'All notes';
  }

  /* ---------------------------------------------------------------------
   * Rendering
   * ------------------------------------------------------------------- */
  function renderSidebar() {
    const counts = {};
    state.notes.forEach((n) => { counts[n.notebook] = (counts[n.notebook] || 0) + 1; });
    const f = state.filter;
    const item = (attrs, iconName, name, count, active, swatch) => `
      <li><button class="notebook${active ? ' is-active' : ''}" type="button" ${attrs}>
        ${icon(iconName)}<span class="notebook-name">${esc(name)}</span>
        ${swatch ? `<span class="nb-swatch" style="background:${swatch}"></span>` : ''}
        <span class="notebook-count">${count}</span>
      </button></li>`;
    let html = item('data-notebook="all"', 'files', 'All notes', state.notes.length, f.kind === 'all');
    html += item('data-notebook="pinned"', 'pin', 'Pinned', state.notes.filter((n) => n.pinned).length, f.kind === 'pinned');
    html += NOTEBOOKS.map((nb) => item(`data-notebook="${nb.id}"`, nb.icon, nb.name, counts[nb.id] || 0, f.kind === 'notebook' && f.value === nb.id, nb.color)).join('');
    $('#notebook-list').innerHTML = html;

    const tagCounts = {};
    state.notes.forEach((n) => n.tags.forEach((t) => { tagCounts[t] = (tagCounts[t] || 0) + 1; }));
    const tags = Object.keys(tagCounts).sort((a, b) => (tagCounts[b] - tagCounts[a]) || a.localeCompare(b));
    $('#tag-list').innerHTML = tags.map((t) => `<li><button class="tag${f.kind === 'tag' && f.value === t ? ' is-active' : ''}" type="button" data-tag="${esc(t)}" title="${tagCounts[t]} note${tagCounts[t] === 1 ? '' : 's'}">${esc(t)}</button></li>`).join('');
  }

  function renderList() {
    const list = filteredNotes();
    const ts = terms(state.listQuery);
    $('#list-title').textContent = filterTitle();
    $('#list-count').textContent = list.length;
    $('#note-list').innerHTML = list.map((n) => {
      const nb = notebookById(n.notebook);
      return `
      <li class="note-item${n.id === state.activeId ? ' is-active' : ''}" data-id="${esc(n.id)}" role="option" aria-selected="${n.id === state.activeId}">
        <div class="note-item-top">
          ${n.pinned ? icon('pin', 'note-item-pin') : ''}
          <h3 class="note-item-title">${highlightTerms(n.title || 'Untitled', ts)}</h3>
          <span class="note-item-date">${formatDate(n.updatedAt)}</span>
        </div>
        <p class="note-item-snippet">${highlightTerms(snippetFor(n, ts) || 'No additional text', ts)}</p>
        <div class="note-item-foot">
          <span class="note-item-nb"><span class="nb-swatch" style="background:${nb.color};margin:0"></span>${esc(nb.name)}</span>
          ${n.tags.slice(0, 3).map((t) => `<span class="note-item-tag">${esc(t)}</span>`).join('')}
        </div>
      </li>`;
    }).join('');
    $('#list-empty').hidden = list.length > 0;
  }

  function renderPreview() {
    const n = activeNote();
    $('#preview').innerHTML = n ? renderMarkdown(n.body) : '';
  }

  function renderStats() {
    const n = activeNote();
    const text = n ? n.body : '';
    const words = (plainText(text).match(/\S+/g) || []).length;
    $('#stat-words').textContent = `${words} word${words === 1 ? '' : 's'}`;
    $('#stat-chars').textContent = `${text.length} characters`;
  }

  function renderTags() {
    const n = activeNote();
    $('#tag-chips').innerHTML = n ? n.tags.map((t) => `<span class="chip" data-tag="${esc(t)}">${esc(t)}<button type="button" data-remove-tag="${esc(t)}" aria-label="Remove tag ${esc(t)}">${icon('x')}</button></span>`).join('') : '';
  }

  function renderEditor() {
    const n = activeNote();
    $('#editor-empty').hidden = !!n;
    if (!n) return;
    const title = $('#note-title');
    if (title.value !== n.title) title.value = n.title;
    const ed = $('#editor');
    if (ed.value !== n.body) ed.value = n.body;
    $('#notebook-select').value = n.notebook;
    $('#crumb-notebook').textContent = notebookById(n.notebook).name;
    $('#crumb-title').textContent = n.title || 'Untitled';
    const pin = $('#pin-btn');
    pin.setAttribute('aria-pressed', String(!!n.pinned));
    pin.title = n.pinned ? 'Unpin note (P)' : 'Pin note (P)';
    renderTags();
    renderPreview();
    renderStats();
  }

  function renderMode() {
    $('#app').dataset.mode = state.mode;
    $$('.seg').forEach((b) => {
      const on = b.dataset.mode === state.mode;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', String(on));
    });
  }

  function renderAll() {
    renderSidebar();
    renderList();
    renderEditor();
    renderMode();
  }

  /* ---------------------------------------------------------------------
   * Actions
   * ------------------------------------------------------------------- */
  function openNote(id, opts) {
    if (!state.notes.some((n) => n.id === id)) return false;
    state.activeId = id;
    renderList();
    renderEditor();
    $('#app').dataset.view = 'editor';
    const el = $(`.note-item[data-id="${CSS.escape(id)}"]`);
    if (el) el.scrollIntoView({ block: 'nearest' });
    if (opts && opts.focus) focusEditor();
    return true;
  }

  function focusEditor() {
    if (state.mode === 'preview') setMode(state.lastWriteMode);
    const ed = $('#editor');
    ed.focus();
  }

  function setFilter(filter) {
    state.filter = filter;
    const list = filteredNotes();
    if (!list.some((n) => n.id === state.activeId)) state.activeId = list.length ? list[0].id : null;
    $('#app').dataset.view = 'list';
    renderAll();
  }

  function setMode(mode) {
    if (!['edit', 'split', 'preview'].includes(mode)) return;
    state.mode = mode;
    if (mode !== 'preview') state.lastWriteMode = mode;
    renderMode();
  }

  function touch(n) {
    n.updatedAt = Date.now();
    scheduleSave();
  }

  function uid() { return 'n' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

  function newNote() {
    const f = state.filter;
    const n = {
      id: uid(),
      title: '',
      body: '',
      notebook: f.kind === 'notebook' ? f.value : 'inbox',
      tags: f.kind === 'tag' ? [f.value] : [],
      pinned: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    state.notes.push(n);
    state.listQuery = '';
    $('#list-search').value = '';
    if (f.kind === 'pinned') state.filter = { kind: 'all' };
    state.activeId = n.id;
    if (state.mode === 'preview') setMode(state.lastWriteMode);
    saveNow();
    renderAll();
    $('#app').dataset.view = 'editor';
    $('#note-title').focus();
    return n.id;
  }

  function togglePin() {
    const n = activeNote();
    if (!n) return;
    n.pinned = !n.pinned;
    saveNow();
    renderAll();
    toast(n.pinned ? 'Pinned to the top' : 'Unpinned');
  }

  function deleteNote() {
    const n = activeNote();
    if (!n) return;
    const idx = state.notes.indexOf(n);
    const list = filteredNotes();
    const pos = list.findIndex((x) => x.id === n.id);
    state.notes.splice(idx, 1);
    const next = list[pos + 1] || list[pos - 1];
    state.activeId = next ? next.id : null;
    saveNow();
    renderAll();
    toast(`Deleted “${n.title || 'Untitled'}”`, 'Undo', () => {
      state.notes.splice(idx, 0, n);
      state.activeId = n.id;
      saveNow();
      renderAll();
    });
  }

  function addTag(raw) {
    const n = activeNote();
    if (!n) return;
    const tag = raw.trim().toLowerCase().replace(/^#+/, '').replace(/\s+/g, '-').replace(/[^\w/-]/g, '');
    if (!tag || n.tags.includes(tag)) return;
    n.tags.push(tag);
    touch(n);
    renderSidebar();
    renderList();
    renderTags();
  }

  function removeTag(tag) {
    const n = activeNote();
    if (!n) return;
    n.tags = n.tags.filter((t) => t !== tag);
    touch(n);
    renderSidebar();
    renderList();
    renderTags();
  }

  function moveSelection(delta) {
    const list = filteredNotes();
    if (!list.length) return;
    let i = list.findIndex((n) => n.id === state.activeId);
    i = i < 0 ? 0 : Math.max(0, Math.min(list.length - 1, i + delta));
    openNote(list[i].id);
  }

  function applyTheme(theme, persist) {
    document.documentElement.setAttribute('data-theme', theme);
    if (persist && !EPHEMERAL) store.set('tidepool.theme', theme);
  }
  function toggleTheme() {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next, true);
    toast(next === 'dark' ? 'Dark theme' : 'Light theme');
  }

  function resetDemo() {
    if (!EPHEMERAL) store.del(STORE_KEY);
    state.notes = clone(SEED);
    state.filter = { kind: 'all' };
    state.listQuery = '';
    $('#list-search').value = '';
    state.activeId = 'welcome';
    renderAll();
    toast('Sample notes restored');
  }

  /* Toasts --------------------------------------------------------------- */
  function toast(message, actionLabel, action) {
    const region = $('#toasts');
    region.innerHTML = '';
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = `<span>${esc(message)}</span>`;
    if (actionLabel) {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = actionLabel;
      b.addEventListener('click', () => { action(); el.remove(); });
      el.appendChild(b);
    }
    region.appendChild(el);
    setTimeout(() => el.remove(), actionLabel ? 5000 : 1800);
  }

  /* ---------------------------------------------------------------------
   * Command palette
   * ------------------------------------------------------------------- */
  const palette = { items: [], index: 0 };

  function commands() {
    const n = activeNote();
    const list = [
      { id: 'new-note', title: 'New note', icon: 'plus', keys: ['N'], run: newNote },
      { id: 'toggle-theme', title: 'Toggle light / dark theme', icon: 'moon', keys: ['Shift', MOD, 'L'], run: toggleTheme },
      { id: 'mode-edit', title: 'Editor only', icon: 'pencil', run: () => setMode('edit') },
      { id: 'mode-split', title: 'Split editor and preview', icon: 'columns-2', keys: [MOD, '\\'], run: () => setMode('split') },
      { id: 'mode-preview', title: 'Preview only', icon: 'eye', keys: [MOD, 'E'], run: () => setMode('preview') },
      { id: 'shortcuts', title: 'Show keyboard shortcuts', icon: 'keyboard', keys: ['?'], run: openShortcuts },
    ];
    if (n) list.splice(1, 0, { id: 'pin', title: n.pinned ? 'Unpin this note' : 'Pin this note', icon: 'pin', keys: ['P'], run: togglePin });
    NOTEBOOKS.forEach((nb) => list.push({ id: 'go-' + nb.id, title: `Go to ${nb.name}`, icon: nb.icon, run: () => setFilter({ kind: 'notebook', value: nb.id }) }));
    list.push({ id: 'reset', title: 'Restore sample notes', icon: 'layers', run: resetDemo });
    return list;
  }

  function buildPaletteItems(q) {
    const items = [];
    const trimmed = q.trim();
    if (trimmed.startsWith('>')) {
      const ts = terms(trimmed.slice(1));
      commands().filter((c) => ts.every((t) => c.title.toLowerCase().includes(t))).forEach((c) => items.push({ type: 'command', group: 'Commands', ...c }));
      return items;
    }
    if (trimmed.startsWith('#')) {
      const t = trimmed.slice(1).toLowerCase();
      const tagCounts = {};
      state.notes.forEach((n) => n.tags.forEach((tg) => { tagCounts[tg] = (tagCounts[tg] || 0) + 1; }));
      Object.keys(tagCounts).filter((tg) => tg.includes(t)).sort().forEach((tg) => items.push({
        type: 'tag', group: 'Tags', id: 'tag-' + tg, tag: tg, title: '#' + tg, sub: `${tagCounts[tg]} note${tagCounts[tg] === 1 ? '' : 's'}`, icon: 'hash',
        run: () => setFilter({ kind: 'tag', value: tg }),
      }));
      return items;
    }
    const ts = terms(trimmed);
    if (!ts.length) {
      sortNotes(state.notes).slice(0, 5).forEach((n) => items.push(noteItem(n, [], 'Recent')));
      commands().slice(0, 4).forEach((c) => items.push({ type: 'command', group: 'Commands', ...c }));
      return items;
    }
    state.notes.filter((n) => matches(n, ts))
      .map((n) => ({ n, s: scoreNote(n, ts) }))
      .sort((a, b) => b.s - a.s || b.n.updatedAt - a.n.updatedAt)
      .slice(0, 8)
      .forEach(({ n }) => items.push(noteItem(n, ts, 'Notes')));
    commands().filter((c) => ts.every((t) => c.title.toLowerCase().includes(t))).slice(0, 4)
      .forEach((c) => items.push({ type: 'command', group: 'Commands', ...c }));
    return items;
  }

  function noteItem(n, ts, group) {
    return {
      type: 'note', group, id: n.id, noteId: n.id,
      titleHtml: highlightTerms(n.title || 'Untitled', ts),
      subHtml: `${esc(notebookById(n.notebook).name)} · ${highlightTerms(snippetFor(n, ts), ts)}`,
      icon: 'file-text',
      hint: formatDate(n.updatedAt),
      run: () => openNote(n.id),
    };
  }

  function renderPalette() {
    const q = $('#palette-input').value;
    palette.items = buildPaletteItems(q);
    palette.index = Math.min(palette.index, Math.max(0, palette.items.length - 1));
    const box = $('#palette-results');
    if (!palette.items.length) {
      box.innerHTML = `<li class="palette-empty">No results for “${esc(q)}”</li>`;
      return;
    }
    let html = '', group = null;
    palette.items.forEach((it, i) => {
      if (it.group !== group) { group = it.group; html += `<li class="palette-group" role="presentation">${esc(group)}</li>`; }
      const hint = it.keys ? it.keys.map((k) => `<kbd class="kbd">${esc(k)}</kbd>`).join('') : it.hint ? esc(it.hint) : '';
      html += `<li class="palette-item${i === palette.index ? ' is-selected' : ''}" role="option" data-index="${i}" data-type="${it.type}" data-id="${esc(it.noteId || it.id)}" aria-selected="${i === palette.index}">
        <span class="pi-icon">${icon(it.icon)}</span>
        <span class="pi-body"><div class="pi-title">${it.titleHtml || esc(it.title)}</div>${it.subHtml || it.sub ? `<div class="pi-sub">${it.subHtml || esc(it.sub)}</div>` : ''}</span>
        <span class="pi-hint">${hint}</span>
      </li>`;
    });
    box.innerHTML = html;
    const sel = $('.palette-item.is-selected', box);
    if (sel) sel.scrollIntoView({ block: 'nearest' });
  }

  function openPalette(q) {
    closeShortcuts();
    const ov = $('#palette');
    ov.hidden = false;
    const input = $('#palette-input');
    input.value = q || '';
    palette.index = 0;
    renderPalette();
    input.focus();
    input.select();
  }
  function closePalette() { $('#palette').hidden = true; }
  const paletteOpen = () => !$('#palette').hidden;

  function runPaletteItem(i) {
    const it = palette.items[i];
    if (!it) return;
    closePalette();
    it.run();
  }

  /* Shortcuts dialog ------------------------------------------------------ */
  const SHORTCUTS = [
    ['Search notes and commands', [MOD, 'K']],
    ['New note', ['N']],
    ['Next / previous note', ['J', 'K']],
    ['Edit the selected note', ['Enter']],
    ['Toggle preview', [MOD, 'E']],
    ['Toggle split view', [MOD, '\\']],
    ['Pin or unpin note', ['P']],
    ['Save now', [MOD, 'S']],
    ['Toggle theme', ['Shift', MOD, 'L']],
    ['Leave the editor / close', ['Esc']],
    ['Show this list', ['?']],
  ];
  function openShortcuts() {
    closePalette();
    $('#shortcut-grid').innerHTML = SHORTCUTS.map(([label, keys]) => `<dt>${esc(label)}</dt><dd>${keys.map((k) => `<kbd class="kbd">${esc(k)}</kbd>`).join('')}</dd>`).join('');
    $('#shortcuts-dialog').hidden = false;
    $('#shortcuts-dialog .dialog').focus();
  }
  function closeShortcuts() { $('#shortcuts-dialog').hidden = true; }

  /* ---------------------------------------------------------------------
   * Events
   * ------------------------------------------------------------------- */
  function isTyping(el) {
    return el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable);
  }

  function bind() {
    $('#new-note').addEventListener('click', newNote);
    $('#list-empty-new').addEventListener('click', newNote);
    $('#search-trigger').addEventListener('click', () => openPalette());
    $('#theme-toggle').addEventListener('click', toggleTheme);
    $('#shortcuts-btn').addEventListener('click', openShortcuts);
    $('#shortcuts-close').addEventListener('click', closeShortcuts);
    $('#sync-status').addEventListener('click', () => toast('Local only: notes are stored in this browser and never uploaded'));
    $('#pin-btn').addEventListener('click', togglePin);
    $('#delete-btn').addEventListener('click', deleteNote);
    $('#back-btn').addEventListener('click', () => { $('#app').dataset.view = 'list'; });
    $$('.m-search').forEach((b) => b.addEventListener('click', () => openPalette()));
    $$('.m-new').forEach((b) => b.addEventListener('click', newNote));
    $$('.m-theme').forEach((b) => b.addEventListener('click', toggleTheme));

    $('#notebook-list').addEventListener('click', (e) => {
      const b = e.target.closest('[data-notebook]');
      if (!b) return;
      const v = b.dataset.notebook;
      setFilter(v === 'all' ? { kind: 'all' } : v === 'pinned' ? { kind: 'pinned' } : { kind: 'notebook', value: v });
    });
    $('#tag-list').addEventListener('click', (e) => {
      const b = e.target.closest('[data-tag]');
      if (!b) return;
      const t = b.dataset.tag;
      const same = state.filter.kind === 'tag' && state.filter.value === t;
      setFilter(same ? { kind: 'all' } : { kind: 'tag', value: t });
    });

    $('#note-list').addEventListener('click', (e) => {
      const li = e.target.closest('.note-item');
      if (li) openNote(li.dataset.id);
    });
    $('#note-list').addEventListener('dblclick', (e) => {
      const li = e.target.closest('.note-item');
      if (li) openNote(li.dataset.id, { focus: true });
    });

    $('#list-search').addEventListener('input', (e) => {
      state.listQuery = e.target.value;
      renderList();
    });
    $('#list-search').addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { e.target.value = ''; state.listQuery = ''; renderList(); e.target.blur(); }
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        const first = filteredNotes()[0];
        if (first) { e.preventDefault(); openNote(first.id); e.target.blur(); }
      }
    });

    $$('.seg').forEach((b) => b.addEventListener('click', () => setMode(b.dataset.mode)));

    const sel = $('#notebook-select');
    sel.innerHTML = NOTEBOOKS.map((nb) => `<option value="${nb.id}">${esc(nb.name)}</option>`).join('');
    sel.addEventListener('change', () => {
      const n = activeNote();
      if (!n) return;
      n.notebook = sel.value;
      touch(n);
      renderAll();
    });

    $('#note-title').addEventListener('input', (e) => {
      const n = activeNote();
      if (!n) return;
      n.title = e.target.value;
      touch(n);
      $('#crumb-title').textContent = n.title || 'Untitled';
      renderList();
    });
    $('#note-title').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === 'ArrowDown') { e.preventDefault(); focusEditor(); }
    });

    let previewFrame = 0;
    const ed = $('#editor');
    const onEditorInput = () => {
      const n = activeNote();
      if (!n) return;
      n.body = ed.value;
      touch(n);
      cancelAnimationFrame(previewFrame);
      previewFrame = requestAnimationFrame(() => { renderPreview(); renderStats(); renderList(); });
    };
    ed.addEventListener('input', onEditorInput);
    ed.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        ed.setRangeText('  ', ed.selectionStart, ed.selectionEnd, 'end');
        onEditorInput();
        return;
      }
      if (e.key === 'Enter' && !e.shiftKey && !e.metaKey && !e.ctrlKey && ed.selectionStart === ed.selectionEnd) {
        const pos = ed.selectionStart;
        const lineStart = ed.value.lastIndexOf('\n', pos - 1) + 1;
        const line = ed.value.slice(lineStart, pos);
        const m = line.match(/^(\s*)([-*]|\d+\.)\s(\[[ xX]\]\s)?/);
        if (!m) return;
        e.preventDefault();
        if (line.length === m[0].length) {
          ed.setRangeText('', lineStart, pos, 'end');
        } else {
          let marker = m[2];
          if (/\d+\./.test(marker)) marker = (parseInt(marker, 10) + 1) + '.';
          ed.setRangeText(`\n${m[1]}${marker} ${m[3] ? '[ ] ' : ''}`, pos, pos, 'end');
        }
        onEditorInput();
      }
    });

    $('#preview').addEventListener('change', (e) => {
      const box = e.target.closest('input[type="checkbox"][data-line]');
      if (!box) return;
      const n = activeNote();
      const lines = n.body.split('\n');
      const li = +box.dataset.line;
      lines[li] = lines[li].replace(/\[( |x|X)\]/, box.checked ? '[x]' : '[ ]');
      n.body = lines.join('\n');
      touch(n);
      $('#editor').value = n.body;
      renderPreview();
      renderList();
    });
    $('#preview').addEventListener('click', (e) => {
      const a = e.target.closest('[data-note-link]');
      if (!a) return;
      e.preventDefault();
      const t = a.dataset.noteLink.toLowerCase();
      const target = state.notes.find((n) => n.title.toLowerCase() === t);
      if (target) {
        if (!filteredNotes().some((n) => n.id === target.id)) { state.filter = { kind: 'all' }; renderSidebar(); }
        openNote(target.id);
      } else toast(`No note called “${a.dataset.noteLink}” yet`);
    });

    const tagInput = $('#tag-input');
    tagInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        addTag(tagInput.value);
        tagInput.value = '';
      } else if (e.key === 'Backspace' && !tagInput.value) {
        const n = activeNote();
        if (n && n.tags.length) removeTag(n.tags[n.tags.length - 1]);
      } else if (e.key === 'Escape') {
        tagInput.value = '';
        tagInput.blur();
      }
    });
    tagInput.addEventListener('blur', () => { if (tagInput.value.trim()) { addTag(tagInput.value); tagInput.value = ''; } });
    $('#tag-chips').addEventListener('click', (e) => {
      const b = e.target.closest('[data-remove-tag]');
      if (b) removeTag(b.dataset.removeTag);
    });

    /* Palette */
    $('#palette-input').addEventListener('input', () => { palette.index = 0; renderPalette(); });
    $('#palette-input').addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || (e.ctrlKey && e.key === 'n')) { e.preventDefault(); palette.index = Math.min(palette.items.length - 1, palette.index + 1); renderPalette(); }
      else if (e.key === 'ArrowUp' || (e.ctrlKey && e.key === 'p')) { e.preventDefault(); palette.index = Math.max(0, palette.index - 1); renderPalette(); }
      else if (e.key === 'Enter') { e.preventDefault(); runPaletteItem(palette.index); }
    });
    $('#palette-results').addEventListener('mousemove', (e) => {
      const li = e.target.closest('.palette-item');
      if (li && +li.dataset.index !== palette.index) {
        palette.index = +li.dataset.index;
        $$('.palette-item').forEach((x) => { const on = +x.dataset.index === palette.index; x.classList.toggle('is-selected', on); x.setAttribute('aria-selected', String(on)); });
      }
    });
    $('#palette-results').addEventListener('click', (e) => {
      const li = e.target.closest('.palette-item');
      if (li) runPaletteItem(+li.dataset.index);
    });
    $('#palette').addEventListener('mousedown', (e) => { if (e.target.id === 'palette') closePalette(); });
    $('#shortcuts-dialog').addEventListener('mousedown', (e) => { if (e.target.id === 'shortcuts-dialog') closeShortcuts(); });

    /* Global keys */
    document.addEventListener('keydown', (e) => {
      const mod = IS_MAC ? e.metaKey : e.ctrlKey;
      const key = e.key.toLowerCase();

      if (mod && !e.shiftKey && !e.altKey && key === 'k') {
        e.preventDefault();
        paletteOpen() ? closePalette() : openPalette();
        return;
      }
      if (e.key === 'Escape') {
        if (paletteOpen()) { e.preventDefault(); closePalette(); return; }
        if (!$('#shortcuts-dialog').hidden) { e.preventDefault(); closeShortcuts(); return; }
        if (isTyping(document.activeElement)) { document.activeElement.blur(); return; }
        return;
      }
      if (paletteOpen()) return;
      if (mod && !e.shiftKey && key === 'e') { e.preventDefault(); setMode(state.mode === 'preview' ? state.lastWriteMode : 'preview'); return; }
      if (mod && !e.shiftKey && e.key === '\\') { e.preventDefault(); setMode(state.mode === 'split' ? 'edit' : 'split'); return; }
      if (mod && !e.shiftKey && key === 's') { e.preventDefault(); saveNow(); toast('Saved on this device'); return; }
      if (mod && e.shiftKey && key === 'l') { e.preventDefault(); toggleTheme(); return; }
      if (mod && e.altKey && (key === 'n' || e.code === 'KeyN')) { e.preventDefault(); newNote(); return; }

      if (isTyping(document.activeElement) || mod || e.altKey) return;
      if (!$('#shortcuts-dialog').hidden) { if (e.key === '?' || (e.key === '/' && e.shiftKey)) closeShortcuts(); return; }
      if (key === 'n') { e.preventDefault(); newNote(); }
      else if (key === 'j' || e.key === 'ArrowDown') { e.preventDefault(); moveSelection(1); }
      else if (key === 'k' || e.key === 'ArrowUp') { e.preventDefault(); moveSelection(-1); }
      else if (e.key === 'Enter') { e.preventDefault(); focusEditor(); }
      else if (key === 'p') { e.preventDefault(); togglePin(); }
      else if (e.key === '?' || (e.key === '/' && e.shiftKey)) { e.preventDefault(); openShortcuts(); }
      else if (e.key === '/') { e.preventDefault(); openPalette(); }
    });

    window.addEventListener('storage', (e) => {
      if (e.key === 'tidepool.theme' && e.newValue) applyTheme(e.newValue, false);
    });
    window.addEventListener('beforeunload', saveNow);
  }

  /* ---------------------------------------------------------------------
   * Boot
   * ------------------------------------------------------------------- */
  function hydrateIcons() {
    $$('[data-icon]').forEach((el) => {
      el.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[el.dataset.icon] || ''}</svg>`;
    });
    $$('[data-mod-key]').forEach((el) => { el.textContent = IS_MAC ? '⌘K' : 'Ctrl K'; });
    $$('[title]').forEach((el) => { if (!IS_MAC) el.title = el.title.replace(/⌘/g, 'Ctrl+'); });
  }

  function boot() {
    hydrateIcons();
    load();
    bind();

    const nbParam = params.get('notebook');
    const tagParam = params.get('tag');
    if (nbParam && NOTEBOOKS.some((n) => n.id === nbParam)) state.filter = { kind: 'notebook', value: nbParam };
    else if (nbParam === 'pinned') state.filter = { kind: 'pinned' };
    else if (tagParam) state.filter = { kind: 'tag', value: tagParam };

    const modeParam = params.get('mode');
    const wide = window.innerWidth >= 1200;
    setMode(['edit', 'split', 'preview'].includes(modeParam) ? modeParam : (wide ? 'split' : 'edit'));

    const noteParam = params.get('note');
    const list = filteredNotes();
    state.activeId = (noteParam && state.notes.some((n) => n.id === noteParam)) ? noteParam
      : list.some((n) => n.id === 'welcome') ? 'welcome'
      : (list[0] && list[0].id) || null;

    renderAll();
    $('#app').dataset.view = noteParam ? 'editor' : 'list';
    if (params.has('palette')) openPalette(params.get('palette') || '');
    if (params.has('shortcuts')) openShortcuts();
    document.documentElement.classList.add('is-ready');
  }

  /* Small scripting surface for demos and tests. */
  window.tidepool = {
    openNote: (id) => openNote(id),
    newNote,
    setMode,
    setFilter: (kind, value) => setFilter(kind === 'all' || kind === 'pinned' ? { kind } : { kind, value }),
    openPalette,
    closePalette,
    toggleTheme,
    setTheme: (t) => applyTheme(t, false),
    reset: resetDemo,
    get state() { return clone({ notes: state.notes, filter: state.filter, activeId: state.activeId, mode: state.mode }); },
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
