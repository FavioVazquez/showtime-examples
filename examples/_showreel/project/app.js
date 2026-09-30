// showtime 0.3.0 showreel: every picture below is a pure function of the film time t.
// Shot table = the HUD, the plan timeline (shot 02) and the thumbnails all read it.
const BEAT = 0.5;            // Born of the Sky, measured 119.7 bpm: a beat every ~0.5 s, bar = 2 s
export const SHOTS = [
  { t: 0,    tone: 'ice',  uses: 'kinetic-type · the brief, then the plan', hold: true },
  { t: 4,    tone: 'dark', uses: 'variable font · wght + wdth axes' },
  { t: 4.5,  tone: 'ice',  uses: 'css · 14 stacked layers' },
  { t: 5,    tone: 'dark', uses: 'clip-path · letters as bars' },
  { t: 5.5,  tone: 'mint', uses: 'martian mono · metric guides' },
  { t: 6,    tone: 'dark', uses: 'per-glyph sine · a function of t' },
  { t: 6.5,  tone: 'ice',  uses: 'svg stroke · draw-on' },
  { t: 7,    tone: 'dark', uses: 'kinetic-type · by chars · weight wave' },
  { t: 10,   tone: 'dark', uses: 'three.js · ST.three · 60,000 points', hold: true },
  { t: 14,   tone: 'dark', uses: 'three.js · same scene, second camera' },
  { t: 15.9, tone: 'dark', uses: 'chart · labels stay lit · callout', hold: true },
  { t: 20,   tone: 'dark', uses: 'world-map · d3-geo · Natural Earth' },
  { t: 21,   tone: 'ice',  uses: 'device-frame · live DOM inside' },
  { t: 22.5, tone: 'dark', uses: 'audio sfx · synthesized sonar ping' },
  { t: 24,   tone: 'dark', uses: 'manim · st_manim · 120 frames', hold: true },
  { t: 28,   tone: 'dark', uses: 'kokoro tts · word-synced captions', hold: true },
  { t: 32,   tone: 'dark', uses: 'check · qa · critic round', hold: true },
  { t: 36,   tone: 'dark', uses: 'showtime receipt · this job', hold: true },
  { t: 40,   tone: 'ice',  uses: 'the brief · this film' },
  { t: 44,   tone: 'dark', uses: 'end card · wordmark draw-on', hold: true },
];
const END = 50.5;

// ---------- small helpers (seek-safe: no state between frames)
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const seg = (t, a, d) => clamp((t - a) / d);
const eo = (p) => 1 - Math.pow(1 - p, 3);                 // ease-out cubic
const eo5 = (p) => 1 - Math.pow(1 - p, 5);
const eio = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const $ = (s) => document.querySelector(s);
const h = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
const shotAt = (t) => { let k = 0; for (let i = 0; i < SHOTS.length; i++) if (t >= SHOTS[i].t - 1e-6) k = i; return k; };

// ---------- data (all local files)
const load = (u) => fetch(u).then((r) => r.json());
const data = {};
ST.waitFor(Promise.all([
  load('data/env.json').then((d) => (data.env = d)),
  load('data/checks.json').then((d) => (data.checks = d)),
  load('data/receipt.json').then((d) => (data.receipt = d)),
  load('data/thumbs.json').then((d) => (data.thumbs = d)).catch(() => (data.thumbs = [])),
  fetch('media/wordmark.svg').then((r) => r.text()).then((s) => (data.wm = s)),
  document.fonts.ready,
]).then(build), 'showreel data');

function build() {
  // 02 timeline: one block per shot, widths = real shot lengths
  const tl = $('#timeline');
  SHOTS.forEach((s, i) => {
    const e = (SHOTS[i + 1] ? SHOTS[i + 1].t : END);
    const b = h('i', 'blk' + (s.hold ? ' hold' : ''));
    b.style.left = `calc(${(s.t / END) * 100}% + 2px)`;
    b.style.width = `calc(${((e - s.t) / END) * 100}% - 4px)`;
    tl.appendChild(b);
  });
  const bars = tl.querySelector('.bars');
  for (let k = 0; k <= Math.floor(END / 2); k++) {
    const i = h('i', k % 4 === 0 ? 'phrase' : '');
    i.style.left = `${((k * 2) / END) * 100}%`;
    bars.appendChild(i);
  }
  // 01 chips: placed above their words, measured once
  // 05 data letters
  const dw = $('#w-data .bars-word');
  'Data'.split('').forEach((c) => dw.insertBefore(h('span', '', c), dw.querySelector('.base')));
  // 06 metric guides: three lines, placed on the first visible frame (see guides())
  const g = $('#w-math .guides'); for (let k = 0; k < 3; k++) g.appendChild(h('i'));
  // 07 voice letters
  const vw = $('#w-voice .wave-word');
  'Voice'.split('').forEach((c) => vw.appendChild(h('span', '', c)));
  // 09 show line by chars
  const sl = $('#showline');
  const words = [['Every ', 0], ['frame ', 0], ['is ', 0], ['a', 0], ['\n', 0], ['function ', 0], ['of ', 0], ['time.', 1]];
  words.forEach(([w, m]) => {
    if (w === '\n') { sl.appendChild(h('br')); return; }
    const ws = h('span', m ? 'm' : ''); ws.style.whiteSpace = 'nowrap';
    w.split('').forEach((c) => ws.appendChild(h('span', 'ch', c)));
    sl.appendChild(ws);
  });
  // 16 sfx waveform bars (ping.wav envelope)
  const sv = $('#sfx'); const pe = data.env.ping.v;
  const n = 120;
  for (let i = 0; i < n; i++) {
    const v = pe[Math.floor((i / n) * pe.length)] || 0;
    const r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    const hgt = Math.max(3, v * 360);
    r.setAttribute('x', (i / n) * 1000 + 1); r.setAttribute('width', 1000 / n - 3);
    r.setAttribute('y', 200 - hgt / 2); r.setAttribute('height', hgt); r.setAttribute('rx', 2);
    sv.appendChild(r);
  }
  for (let k = 0; k < 3; k++) {
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    c.setAttribute('cx', 500); c.setAttribute('cy', 200); c.setAttribute('fill', 'none');
    c.setAttribute('stroke', '#7BF5C0'); c.setAttribute('stroke-width', 3); c.classList.add('ring');
    sv.appendChild(c);
  }
  // 18 voice waveform
  const vv = $('#vwave'); const ve = data.env.voice.v; const m = 110;
  for (let i = 0; i < m; i++) {
    let v = 0; const a = Math.floor((i / m) * ve.length), b = Math.floor(((i + 1) / m) * ve.length);
    for (let j = a; j < Math.max(b, a + 1); j++) v = Math.max(v, ve[j] || 0);
    const r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    const hgt = Math.max(4, Math.pow(v, 0.8) * 280);
    r.setAttribute('x', (i / m) * 1000 + 1); r.setAttribute('width', 1000 / m - 3.2);
    r.setAttribute('y', 150 - hgt / 2); r.setAttribute('height', hgt); r.setAttribute('rx', 2.5);
    vv.appendChild(r);
  }
  const ph = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  ph.setAttribute('width', 3); ph.setAttribute('y', -10); ph.setAttribute('height', 320); ph.setAttribute('fill', '#E6EEF8'); ph.id = 'vhead';
  vv.appendChild(ph);
  // 19 thumbs + rows
  const th = $('#thumbs');
  for (let i = 0; i < 24; i++) {
    const d = h('div', 'th'); const src = data.thumbs[i % Math.max(1, data.thumbs.length)];
    if (src) { const im = h('img'); im.src = src; d.appendChild(im); }
    d.appendChild(h('b')); th.appendChild(d);
  }
  const rows = $('#rows');
  data.checks.rows.forEach((r) => {
    const row = h('div', 'row');
    row.appendChild(h('span', 'k', r.k)); row.appendChild(h('span', 'dots'));
    row.appendChild(h('span', 'v', r.v));
    const ok = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    ok.setAttribute('viewBox', '0 0 20 20'); ok.classList.add('ok');
    ok.innerHTML = '<circle cx="10" cy="10" r="9" fill="#7BF5C0"/><path d="M5.5 10.4 L8.6 13.3 L14.6 6.8" fill="none" stroke="#0A1224" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>';
    row.appendChild(ok); rows.appendChild(row);
  });
  // 20 receipt
  const p = $('#paper'); const R = data.receipt;
  p.appendChild(h('h4', '', R.title)); p.appendChild(h('p', 'meta', R.meta));
  p.appendChild(h('div', 'rule'));
  R.lines.forEach((l) => {
    const d = h('div', 'ln' + (l.zero ? ' zero' : ''));
    d.appendChild(h('span', 'k', l.k)); d.appendChild(h('span', 'd')); d.appendChild(h('span', 'v', l.v));
    p.appendChild(d);
  });
  p.appendChild(h('div', 'rule')); p.appendChild(h('p', 'foot', R.foot));
  // 21 strip frames (this film's shots, twice for the scroll)
  const sf = $('#stripframes');
  for (let r = 0; r < 2; r++) data.thumbs.forEach((src) => { const im = h('img'); im.src = src; sf.appendChild(im); });
  // 22 wordmark paths (repo brand SVG, recoloured by the page CSS)
  const doc = new DOMParser().parseFromString(data.wm, 'image/svg+xml');
  const wm = $('#wm');
  doc.querySelectorAll('path').forEach((pa) => {
    const q = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    q.setAttribute('d', pa.getAttribute('d')); wm.appendChild(q);
  });
  const g0 = doc.querySelector('g'); if (g0 && g0.getAttribute('transform')) {
    const gg = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gg.setAttribute('transform', g0.getAttribute('transform'));
    while (wm.firstChild) gg.appendChild(wm.firstChild); wm.appendChild(gg);
  }
}

// ---------- 17 manim frames: one image per film frame, decoded before the screenshot
// request every frame once at load, so an HTML export packs all 120 of them
for (let i = 0; i < 120; i++) { const im = new Image(); im.src = `media/halves/f${String(i).padStart(3, '0')}.jpg`; }
ST.onSeek((t) => {
  if (t < 24 || t >= 28) return;
  const f = Math.min(119, Math.max(0, Math.round((t - 24) * 30)));
  const src = `media/halves/f${String(f).padStart(3, '0')}.jpg`;
  const im = document.getElementById('halves');
  if (im.getAttribute('src') !== src) { im.setAttribute('src', src); return im.decode().catch(() => {}); }
});

// ---------- per-frame drawing
ST.onSeek((t) => {
  if (!data.checks) return;
  hud(t);
  const L = (a) => t - a;
  if (t < 4) { brief(L(0)); plan(L(0)); }
  else if (t < 7) run(t);
  else if (t < 10) showcase(L(7), t);
  if (t >= 21 && t < 22.5) phone(L(21));
  if (t >= 22.5 && t < 24) sfx(L(22.5));
  if (t >= 28 && t < 32) voice(L(28));
  if (t >= 32 && t < 36) checks(L(32));
  if (t >= 36 && t < 40) receipt(L(36));
  if (t >= 40 && t < 44) closure(L(40));
  if (t >= 44) endcard(L(44));
});

function hud(t) {
  const k = shotAt(t); const s = SHOTS[k];
  const hudEl = $('#hud');
  hudEl.classList.toggle('on-light', s.tone === 'ice' || s.tone === 'mint');
  hudEl.classList.toggle('on-mint', s.tone === 'mint');
  $('#uses').textContent = s.uses;
  $('#shotn').textContent = String(k + 1).padStart(2, '0') + ' / ' + SHOTS.length;
  const beat = Math.floor(t / BEAT + 1e-6);
  const bar = Math.floor(beat / 4) + 1, inBar = beat % 4;
  $('#pips').querySelectorAll('i').forEach((p, i) => p.classList.toggle('on', i === inBar));
  $('#pips span').textContent = 'BAR ' + String(bar).padStart(2, '0');
  const cs = Math.floor(t * 100 + 1e-6);
  const mm = Math.floor(cs / 6000), ss = Math.floor((cs % 6000) / 100), cc = cs % 100;
  $('#tc').textContent = `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}.${String(cc).padStart(2, '0')} / 00:50.50`;
}

function brief(lt) {
  // chips sit on their words: layout offsets, read while the scene is visible (never transformed rects)
  document.querySelectorAll('#s01 .tagged').forEach((w) => {
    const c = document.getElementById(w.dataset.tag);
    c.style.left = `${w.offsetLeft}px`;
    c.style.top = w.dataset.tag === 'c3' ? `${w.offsetTop + w.offsetHeight + 10}px` : `${w.offsetTop - c.offsetHeight - 8}px`;
  });
  document.querySelectorAll('#s01 .chip').forEach((c) => {
    const p = eo5(seg(lt, parseFloat(c.dataset.at), 0.3));
    c.style.opacity = p; c.style.transform = `translateY(${(1 - p) * 0.8}cqh)`;
  });
  const hl = $('#s01 .hl'); const p = eio(seg(lt, 1.5, 0.45));
  hl.style.backgroundSize = `${p * 100}% 34%`;
}

function plan(lt) {
  const blks = document.querySelectorAll('#timeline .blk');
  blks.forEach((b, i) => { const p = eo(seg(lt, 2.45 + i * 0.02, 0.25)); b.style.transform = `scaleX(${p})`; b.style.opacity = p > 0 ? 1 : 0; });
  const q = eo(seg(lt, 2.4, 0.35));
  document.querySelectorAll('#s01 .plan-lab').forEach((lab) => { lab.style.opacity = q; lab.style.transform = `translateY(${(1 - q) * 1.2}cqh)`; });
  document.querySelectorAll('#timeline .bars i').forEach((b, i) => { b.style.opacity = seg(lt, 2.5 + i * 0.015, 0.1) * (b.classList.contains('phrase') ? 0.9 : 0.45); });
  const x = eio(seg(lt, 2.7, 1.25)); const hd = $('#timeline .head');
  hd.style.left = `${x * 100}%`; hd.style.opacity = lt > 2.7 ? 1 : 0;
}

function run(t) {
  // TYPE
  let lt = t - 4;
  if (lt >= 0 && lt < 0.5) {
    const p = eo(seg(lt, 0.0, 0.34));
    const w = 200 + 600 * p, wd = 75 + 25 * p;
    const e = $('#w-type .big');
    e.style.fontVariationSettings = `'wght' ${w.toFixed(1)}, 'wdth' ${wd.toFixed(1)}`;
    e.style.letterSpacing = `${(-0.01 - 0.03 * p).toFixed(4)}em`;
    e.style.transform = `scale(${0.97 + 0.03 * p})`;
  }
  lt = t - 4.5;
  if (lt >= 0 && lt < 0.5) {
    const p = eo(seg(lt, 0.0, 0.3));
    const sh = [];
    for (let i = 1; i <= 14; i++) {
      const d = i * 0.62 * p, k = i / 14;
      sh.push(`${(d * 0.9).toFixed(2)}cqh ${d.toFixed(2)}cqh 0 color-mix(in oklab, #7BF5C0 ${Math.round(100 - k * 70)}%, #0A1224)`);
    }
    const e = $('#w-depth .depth');
    e.style.textShadow = sh.join(', ');
    e.style.transform = `translate(${-4.5 * p}cqh, ${-5 * p}cqh)`;
  }
  lt = t - 5;
  if (lt >= 0 && lt < 0.5) {
    const hs = [0.55, 1, 0.72, 0.9];
    document.querySelectorAll('#w-data .bars-word span').forEach((s, i) => {
      const p = eo(seg(lt, i * 0.04, 0.26));
      s.style.setProperty('--bar', (hs[i] * p).toFixed(3));
    });
    $('#w-data .base').style.transform = `scaleX(${eo(seg(lt, 0, 0.2))})`;
  }
  lt = t - 5.5;
  if (lt >= 0 && lt < 0.5) {
    const mt = $('#w-math .metric'); const fs = parseFloat(getComputedStyle(mt).fontSize);
    const base = mt.offsetHeight * 0.5 + fs * 0.36;   // Martian Mono: cap 0.70 em, x-height 0.54 em
    [base - fs * 0.70, base - fs * 0.54, base].forEach((y, i) => {
      const g = document.querySelectorAll('#w-math .guides i')[i];
      g.style.top = `${y}px`; g.style.left = '-60cqw'; g.style.right = '-60cqw';
      g.style.transform = `scaleX(${eo(seg(lt, i * 0.05, 0.22))})`;
    });
    const e = $('#w-math .metric'); const p = eo(seg(lt, 0, 0.3));
    e.style.transform = `translateY(${(1 - p) * 2}cqh)`;
  }
  lt = t - 6;
  if (lt >= 0 && lt < 0.5) {
    const letters = document.querySelectorAll('#w-voice .wave-word span');
    const A = 7 * (1 - 0.55 * seg(lt, 0, 0.5));
    letters.forEach((s, i) => {
      const y = A * Math.sin(2 * Math.PI * (i / letters.length * 0.9 - lt * 2.1));
      s.style.transform = `translateY(${y.toFixed(2)}cqh)`;
    });
    let d = '';
    for (let x = 0; x <= 1000; x += 8) {
      const env = Math.sin(Math.PI * x / 1000);
      const y = 50 + 42 * env * Math.sin(x / 1000 * 18 - lt * 14) * Math.cos(x / 1000 * 5 + lt * 3);
      d += (x ? 'L' : 'M') + x + ' ' + y.toFixed(1);
    }
    $('#w-voice .wave-line path').setAttribute('d', d);
  }
  lt = t - 6.5;
  if (lt >= 0 && lt < 0.5) {
    const tick = $('#w-proof .tick'); const len = 80;
    tick.setAttribute('stroke-dasharray', len);
    tick.setAttribute('stroke-dashoffset', (len * (1 - eo(seg(lt, 0.04, 0.24)))).toFixed(2));
    const box = $('#w-proof svg'); const p = eo5(seg(lt, 0, 0.18));
    box.style.transform = `scale(${0.8 + 0.2 * p}) rotate(${(1 - p) * -8}deg)`;
  }
}

function showcase(lt, t) {
  const chars = document.querySelectorAll('#showline .ch');
  const n = chars.length;
  chars.forEach((c, i) => {
    const a = Math.min(0.5, i * 0.018);
    const p = eo(seg(lt, a, 0.4));
    let w = 200 + 500 * p;
    if (lt > 0.9) {
      const k = seg(lt, 0.9, 0.5);
      w = 700 + k * 90 * Math.sin(2 * Math.PI * (i / n * 1.4 - (lt - 0.9) * 0.55));
    }
    c.style.opacity = (0.25 + 0.75 * p).toFixed(3);
    c.style.transform = `translateY(${((1 - p) * 0.28).toFixed(3)}em)`;
    c.style.fontVariationSettings = `'wght' ${w.toFixed(1)}`;
  });
  const sub = $('#showsub'); const q = eo(seg(lt, 0.6, 0.45));
  sub.style.opacity = q; sub.style.transform = `translateY(${(1 - q) * 1.2}cqh)`;
  const x = t / END; const sc = $('#scrub');
  sc.querySelector('i').style.left = `${x * 100}%`;
  const b = sc.querySelector('b'); b.style.left = `${x * 100}%`; b.textContent = `t = ${t.toFixed(2)} s`;
  sc.style.opacity = eo(seg(lt, 0.3, 0.4));
}

function phone(lt) {
  const hs = [0.35, 0.62, 0.48, 0.86, 1];
  document.querySelectorAll('#s15 .mini-bars i').forEach((b, i) => {
    const p = eo(seg(lt, 0.05 + i * 0.06, 0.4));
    b.style.transform = `scaleY(${(hs[i] * p).toFixed(3)})`;
  });
}

function sfx(lt) {
  const rects = document.querySelectorAll('#sfx rect'); const n = rects.length;
  const head = lt / 1.3;
  rects.forEach((r, i) => {
    const on = i / n <= head;
    r.style.fill = on ? '#7BF5C0' : 'rgba(230, 238, 248, 0.28)';
  });
  document.querySelectorAll('#sfx .ring').forEach((c, k) => {
    const p = seg(lt, k * 0.3, 0.9);
    c.setAttribute('rx', 30 + p * 470); c.setAttribute('ry', (30 + p * 470) * 0.42);
    c.setAttribute('opacity', (p > 0 && p < 1 ? (1 - p) * 0.9 : 0).toFixed(3));
  });
}

function voice(lt) {
  const dur = data.env.voice.dur; const v0 = 0.25;
  const x = clamp((lt - v0) / dur);
  const rects = document.querySelectorAll('#vwave rect:not(#vhead)'); const n = rects.length;
  const intro = eo(seg(lt, 0, 0.35));
  rects.forEach((r, i) => {
    const on = (i + 0.5) / n <= x;
    r.style.fill = on ? '#7BF5C0' : 'rgba(230, 238, 248, 0.30)';
    r.style.transformOrigin = '50% 150px';
    r.style.transform = `scaleY(${Math.max(0.02, intro * (0.4 + 0.6 * eo(seg(lt, i * 0.004, 0.3)))).toFixed(3)})`;
  });
  const hd = $('#vhead'); hd.setAttribute('x', (x * 1000).toFixed(1)); hd.setAttribute('opacity', lt > v0 && x < 1 ? 1 : 0);
}

function checks(lt) {
  const ths = document.querySelectorAll('#thumbs .th');
  const scanX = eio(seg(lt, 0.35, 2.1));
  const grid = $('#thumbs').getBoundingClientRect();
  $('#scan').style.left = `calc(8cqw + ${scanX * 47}cqw)`;
  $('#scan').style.opacity = lt > 0.3 && scanX < 1 ? 1 : 0;
  ths.forEach((d, i) => {
    const col = i % 6; const p = eo(seg(lt, 0.05 + (i % 6) * 0.03 + Math.floor(i / 6) * 0.03, 0.3));
    d.style.opacity = p; d.style.transform = `translateY(${(1 - p) * 1.5}cqh)`;
    const done = scanX * 6 > col + 0.9;
    d.querySelector('b').style.opacity = done ? 1 : 0;
  });
  const hd = $('#s19 .chk-head'); const q = eo(seg(lt, 0.0, 0.4));
  hd.style.opacity = q; hd.style.transform = `translateY(${(1 - q) * 2}cqh)`;
  document.querySelectorAll('#rows .row').forEach((r, i) => {
    const a = 0.5 + i * BEAT * 0.8; const p = eo(seg(lt, a, 0.3));
    r.style.clipPath = `inset(0 ${((1 - p) * 100).toFixed(2)}% 0 0)`; r.style.transform = `translateX(${(1 - p) * 3}cqh)`;
    const tick = r.querySelector('path');
    tick.setAttribute('stroke-dashoffset', (1 - eo(seg(lt, a + 0.15, 0.25))).toFixed(3));
  });
}

function receipt(lt) {
  const paper = $('#paper'); const H = paper.offsetHeight;
  const p = eio(seg(lt, 0.1, 1.9));
  paper.style.transform = `translateY(${(-H + p * H).toFixed(1)}px)`;
  const hd = $('#s20 .rc-head'); const q = eo(seg(lt, 0.0, 0.45));
  hd.style.opacity = q; hd.style.transform = `translateY(${(1 - q) * 2}cqh)`;
}

function closure(lt) {
  const s = $('#strip');
  s.style.transform = `translateX(${(-lt * 15).toFixed(2)}cqw)`;
  const em = $('#s21 .close-head em'); const p = eio(seg(lt, 1.0, 0.45));
  em.style.backgroundSize = `${p * 100}% 36%`;
  const l2 = $('#s21 .l2'); const q = eo(seg(lt, 0.5, 0.4));
  l2.style.opacity = q; l2.style.transform = `translateY(${(1 - q) * 2}cqh)`;
}

function endcard(lt) {
  const paths = document.querySelectorAll('#wm path');
  const draw = eo(seg(lt, 0.0, 1.5)); const fill = eo(seg(lt, 1.5, 0.5));
  const so = 1 - eo(seg(lt, 2.0, 0.35));
  // the outline is drawn on by a left-to-right sweep (a clip), then the fill arrives on the hit
  $('#wm').style.clipPath = `inset(-10% ${((1 - draw) * 100).toFixed(2)}% -10% -2%)`;
  paths.forEach((p) => { p.style.fillOpacity = fill.toFixed(3); p.style.strokeOpacity = so.toFixed(3); });
  $('#wmbar').style.transform = `scaleX(${eo5(seg(lt, 1.98, 0.35))})`;
  $('#wmpush').style.transform = `scale(${(1 + 0.008 * Math.max(0, lt - 2)).toFixed(4)})`;
  [['#promise', 2.2], ['#url', 2.5], ['#credit', 3.0]].forEach(([s, a]) => {
    const e = $(s); const q = eo(seg(lt, a, 0.55)); e.style.opacity = q; e.style.transform = `translateY(${(1 - q) * 1.6}cqh)`;
  });
}
