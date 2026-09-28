// Components for the US power-mix story. Every number is read from data/*.json, which
// `showtime data import` wrote from the EIA table (data/us-generation-annual-twh.csv); nothing
// here types a value in. All three are pure functions of the clip's local time `lt`.
//
//   mix-lines  the coal / gas / wind + solar lines of scenes 2-4: one shared y scale, a sweep
//              cursor that draws each series up to a year, an animated x domain (zoom), markers
//              on real data points, end labels that never overlap, text that can fade out before
//              a shader transition and in after it.
//   row-kit    dresses a stock hbar chart after it has mounted: a colour and an icon per source,
//              and a narration-timed focus (the rows being talked about stay lit, the rest dim).
//              With `race` it also moves the rows year by year (a quick move, then a hold).
//   year-tick  a big year readout that flips when the race rows start moving to that year (lead =
//              row-kit's race delay; the state titles are removed from the race JSON: at 0.25 s per
//              year a title crossfade would flicker).
import { define, svg, h, clamp, lerp, ease, stagger, formatNumber, loadJSON } from '/_st/components/index.js';

const fmt = (v) => formatNumber(Math.round(v), { decimals: 0 });

/* ------------------------------------------------------------------ mix-lines */
export const MixLines = define({
  name: 'mix-lines',
  defaults: {
    at: 0, src: 'data/lines-1949-2025.json',
    start: 1950, end: 2025,
    domain: null,          // [{at, dur, from, to}] x-domain changes (zoom); default [start, end]
    from: null, to: null,  // initial domain
    yMax: 2200, yStep: 500,
    sweep: null,           // {from, segs: [{at, dur, to}]}: the cursor year over time
    series: [],            // [{key, name, color, floor, cursor, opacity, dim: [{at, dur, to}]}]
    markers: [],           // [{at, out, key, year, lines: [..], dx, dy, anchor}]
    kicker: '', title: '', note: '',
    textIn: 0, textOut: null, textDur: 0.35,
    headIn: null, headOut: null,  // the head (and end values) only: for a hard cut where the chart itself stays put
    drift: [0, 0.012],     // svg scale over the clip (a slow push so holds are never frozen)
    plot: [0.10, 0.33, 0.775, 0.84],  // left, top, right, bottom as fractions of the frame
  },
  async setup(el, o, { clipDur }) {
    const file = await loadJSON(o.src);
    const years = file.data.labels.map(Number);
    const vals = Object.fromEntries(file.data.series.map((s) => [s.name, s.values.map(Number)]));
    const y0 = years[0];
    const valueAt = (key, yr) => {
      const a = vals[key];
      const i = clamp(Math.floor(yr - y0), 0, a.length - 1), j = Math.min(a.length - 1, i + 1);
      return lerp(a[i], a[j], clamp(yr - y0 - i));
    };
    const W = el.clientWidth, H = el.clientHeight;
    const fs = Math.max(30, H * 0.029);
    const L = W * o.plot[0], T = H * o.plot[1], R = W * o.plot[2], B = H * o.plot[3];

    // --- head (HTML): kicker, title, note
    const head = h('div', { class: 'ml-head' },
      o.kicker ? h('div', { class: 'ml-kicker' }, o.kicker) : '',
      h('div', { class: 'ml-title' }, o.title),
      o.note ? h('div', { class: 'ml-note' }, o.note) : '');
    el.append(head);

    const root = svg('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'ml-svg' });
    el.append(root);
    const cam = svg('g', { class: 'ml-cam' });
    root.append(cam);
    const clipId = 'mlclip-' + Math.random().toString(36).slice(2, 8);
    const defs = svg('defs');
    const cp = svg('clipPath', { id: clipId });
    cp.append(svg('rect', { x: L - 2, y: T - fs * 2, width: R - L + fs * 0.6, height: B - T + fs * 2.2 }));
    defs.append(cp);
    root.prepend(defs);

    // y grid + ticks (fixed scale for all three scenes, so lines never rescale across the cuts)
    const yv = (v) => B - (v / o.yMax) * (B - T);
    const gridG = svg('g', { class: 'ml-grid' });
    const textEls = [];
    for (let v = 0; v <= o.yMax; v += o.yStep) {
      gridG.append(svg('line', { x1: L, x2: R + fs * 0.4, y1: yv(v), y2: yv(v), class: v === 0 ? 'ml-base' : '' }));
      const t = svg('text', { x: L - fs * 0.55, y: yv(v), class: 'ml-tick', 'text-anchor': 'end', 'dominant-baseline': 'middle' }, fmt(v));
      gridG.append(t); textEls.push(t);
    }
    const unit = svg('text', { x: L - fs * 0.55, y: T - fs * 1.35, class: 'ml-tick ml-unit', 'text-anchor': 'end' }, 'TWh');
    gridG.append(unit); textEls.push(unit);
    cam.append(gridG);

    // x ticks: every 5 years, shown when there is room (decades first)
    const xTicks = [];
    for (let yr = Math.ceil(o.start / 5) * 5; yr <= o.end; yr += 5) {
      const t = svg('text', { y: B + fs * 1.45, class: 'ml-tick', 'text-anchor': 'middle' }, String(yr));
      cam.append(t); xTicks.push({ yr, t });
    }

    // domain over time
    const dom0 = [o.from ?? o.start, o.to ?? o.end];
    const domSteps = (o.domain || []).map((d) => ({ ...d, at: Number(d.at), dur: Number(d.dur ?? 1.2) }));
    const EM = ease('power2.inOut');
    const domainAt = (lt) => {
      let [a, b] = dom0;
      for (const d of domSteps) { const p = EM(clamp((lt - d.at) / d.dur)); a = lerp(a, d.from ?? a, p); b = lerp(b, d.to ?? b, p); }
      return [a, b];
    };

    // sweep cursor
    const SW = ease('sine.inOut');
    const cursorAt = (lt) => {
      if (!o.sweep) return o.end;
      let c = o.sweep.from ?? o.start - 1;
      for (const s of o.sweep.segs) c = lerp(c, s.to, SW(clamp((lt - s.at) / s.dur)));
      return c;
    };
    const sweepEnd = o.sweep ? Math.max(...o.sweep.segs.map((s) => s.at + s.dur)) : 0;
    // the cursor shows while a sweep runs; segments less than 1.6 s apart share one window, so the
    // year pill holds through a short beat (a marker) instead of shrinking away and coming back
    const wins = [];
    for (const s of o.sweep?.segs || []) {
      const a = Number(s.at), b = Number(s.at) + Number(s.dur), last = wins[wins.length - 1];
      if (last && a - last.b < 1.6) last.b = Math.max(last.b, b); else wins.push({ a, b });
    }
    const sweepActive = (lt) => Math.max(0, ...wins.map((w) => clamp((lt - w.a + 0.25) / 0.25) * clamp((w.b + 0.6 - lt) / 0.35)));

    // series
    const linesG = svg('g', { 'clip-path': `url(#${clipId})` });
    cam.append(linesG);
    const S = o.series.map((s) => {
      const glow = svg('path', { class: 'ml-glow', stroke: s.color });
      const path = svg('path', { class: 'ml-line', stroke: s.color });
      linesG.append(glow, path);
      return { ...s, glow, path };
    });
    const dotsG = svg('g');
    cam.append(dotsG);
    for (const s of S) {
      s.halo = svg('circle', { class: 'ml-halo', fill: s.color });
      s.dot = svg('circle', { class: 'ml-dot', fill: s.color });
      s.label = svg('text', { class: 'ml-end', fill: s.color });
      s.nameT = svg('tspan', {}, s.name);
      s.valT = svg('tspan', { class: 'ml-end-val', dx: fs * 0.35 });
      s.label.append(s.nameT, s.valT);
      dotsG.append(s.halo, s.dot, s.label);
      textEls.push(s.label);
    }

    // cursor line + year pill
    const curG = svg('g', { class: 'ml-cursor' });
    const curLine = svg('line', { y1: T - fs * 0.6, y2: B });
    const pill = svg('rect', { height: fs * 1.45, rx: fs * 0.3 });
    const pillT = svg('text', { 'text-anchor': 'middle', 'dominant-baseline': 'central' });
    curG.append(curLine, pill, pillT);
    cam.append(curG);

    // markers (a ring on the real data point, a leader and a two-line plate)
    const markG = svg('g');
    cam.append(markG);
    const M = o.markers.map((m) => {
      const g = svg('g', { class: 'ml-mark' });
      const ring = svg('circle', { r: fs * 0.42, class: 'ml-ring' });
      const lead = svg('line', { class: 'ml-lead' });
      const box = svg('rect', { rx: fs * 0.22, class: 'ml-box' });
      const txt = svg('text', { class: 'ml-mtext' });
      m.lines.forEach((line, i) => txt.append(svg('tspan', { class: i ? 'ml-msub' : 'ml-mhead', dy: i ? fs * 1.3 : 0 }, line)));
      g.append(lead, ring, box, txt);
      markG.append(g);
      return { ...m, g, ring, lead, box, txt };
    });
    // measure the plates once (fonts are loaded)
    for (const m of M) {
      m.txt.setAttribute('x', 0); m.txt.setAttribute('y', 0);
      [...m.txt.children].forEach((ts) => ts.setAttribute('x', 0));
      const bb = m.txt.getBBox();
      m.w = bb.width + fs * 1.1; m.h = bb.height + fs * 0.75; m.bbY = bb.y;
    }

    const E = ease('power3.out');
    const ext = (s, lt) => clamp(s.cursor ? Math.max(s.floor ?? -Infinity, cursorAt(lt)) : (s.floor ?? o.end), y0, o.end);
    const doneAt = (s) => (s.cursor && (s.floor ?? 0) < o.end ? sweepEnd : -1);

    return {
      duration: clipDur,
      update(lt) {
        const [d0, d1] = domainAt(lt);
        const xs = (yr) => L + ((yr - d0) / (d1 - d0)) * (R - L);
        const pxYr = (R - L) / (d1 - d0);
        // text in/out (for the shader cut: nothing smears)
        let ta = clamp((lt - o.textIn) / o.textDur);
        if (o.textOut != null) ta *= 1 - clamp((lt - o.textOut) / o.textDur);
        let ha = 1;
        if (o.headIn != null) ha *= clamp((lt - o.headIn) / o.textDur);
        if (o.headOut != null) ha *= 1 - clamp((lt - o.headOut) / o.textDur);
        head.style.opacity = (ta * ha).toFixed(3);
        for (const t of textEls) t.style.opacity = ta.toFixed(3);
        // slow push
        const k = lerp(o.drift[0], o.drift[1], clamp(lt / clipDur));
        cam.setAttribute('transform', `translate(${(W * 0.45).toFixed(1)} ${(H * 0.6).toFixed(1)}) scale(${(1 + k).toFixed(4)}) translate(${(-W * 0.45).toFixed(1)} ${(-H * 0.6).toFixed(1)})`);

        const curX = xs(clamp(cursorAt(lt), d0, o.end));
        const curA = sweepActive(lt) * ta * clamp((cursorAt(lt) - d0) / 1.5);
        // x ticks
        for (const { yr, t } of xTicks) {
          const x = xs(yr);
          const inside = x >= L - 1 && x <= R + fs * 0.5;
          const room = yr % 10 === 0 ? clamp((pxYr * 10 - fs * 2.6) / (fs * 0.3)) : clamp((pxYr * 5 - fs * 3.3) / (fs * 0.3));
          const under = Math.abs(x - curX) < fs * 3.3 ? 1 - clamp(curA * 4) : 1;  // the year pill covers it
          t.setAttribute('x', x.toFixed(1));
          t.style.opacity = inside ? (room * under * ta).toFixed(3) : 0;
        }

        // lines, dots, end labels
        const labs = [];
        for (const s of S) {
          const e = ext(s, lt);
          let op = s.opacity ?? 1;
          for (const d of s.dim || []) op = lerp(op, d.to, EM(clamp((lt - d.at) / (d.dur ?? 0.5))));
          const pts = [];
          const first = Math.max(y0, Math.floor(d0) - 1);
          for (let yr = first; yr <= Math.floor(e); yr++) pts.push([xs(yr), yv(valueAt(s.key, yr))]);
          if (e > Math.floor(e) + 1e-6) pts.push([xs(e), yv(valueAt(s.key, e))]);
          const d = pts.length > 1 ? 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L') : '';
          s.path.setAttribute('d', d); s.glow.setAttribute('d', d);
          s.path.style.opacity = op.toFixed(3); s.glow.style.opacity = (op * 0.35).toFixed(3);
          const vis = e > first + 0.02 && xs(e) >= L - 1 ? 1 : 0;
          const fx = xs(e), fy = yv(valueAt(s.key, e));
          s.dot.setAttribute('cx', fx.toFixed(1)); s.dot.setAttribute('cy', fy.toFixed(1));
          s.dot.setAttribute('r', (fs * 0.26 * vis).toFixed(2));
          s.dot.style.opacity = op.toFixed(3);
          const moving = s.cursor && e < o.end - 1e-3 && e > (s.floor ?? -1) ? 1 : 0;
          s.halo.setAttribute('cx', fx.toFixed(1)); s.halo.setAttribute('cy', fy.toFixed(1));
          s.halo.setAttribute('r', (fs * 0.75 * vis).toFixed(2));
          s.halo.style.opacity = (0.28 * moving * op).toFixed(3);
          const vIn = clamp((lt - doneAt(s) - 0.1) / 0.4) * (e >= o.end - 1e-3 ? 1 : 0);
          s.valT.textContent = vIn > 0 ? fmt(valueAt(s.key, o.end)) : '';
          s.valT.style.opacity = (vIn * ha).toFixed(3);
          labs.push({ s, x: fx + fs * 0.65, y: fy, vis, op });
        }
        // de-collide end labels (sorted top to bottom, min gap, kept above the axis)
        const gap = fs * 1.2;
        const live = labs.filter((l) => l.vis);
        live.sort((a, b) => a.y - b.y);
        for (let i = 1; i < live.length; i++) live[i].y = Math.max(live[i].y, live[i - 1].y + gap);
        for (let i = live.length - 1; i >= 0; i--) {
          const lim = i === live.length - 1 ? B - fs * 0.2 : live[i + 1].y - gap;
          live[i].y = Math.min(live[i].y, lim);
        }
        for (const l of labs) {
          l.s.label.setAttribute('x', l.x.toFixed(1));
          l.s.label.setAttribute('y', (l.y + fs * 0.36).toFixed(1));
          l.s.label.style.opacity = (l.vis * ta).toFixed(3);
        }

        // cursor
        const cx = curX, ca = curA;
        // the line fades; the pill scales (its text never sits half-transparent over the ticks)
        curLine.style.opacity = ca.toFixed(3);
        const ps = ease('power2.out')(clamp(ca * 1.6));
        pill.style.transformOrigin = pillT.style.transformOrigin = `${cx.toFixed(1)}px ${(B + fs * 1.18).toFixed(1)}px`;
        pill.style.transform = pillT.style.transform = `scale(${ps.toFixed(3)})`;
        pill.style.opacity = pillT.style.opacity = ps > 0.02 ? 1 : 0;
        curLine.setAttribute('x1', cx.toFixed(1)); curLine.setAttribute('x2', cx.toFixed(1));
        // the nearest year: the pill reads 2025 once the cursor sits on the 2025 tick, not only at the end of the ease
        const yrTxt = String(Math.max(o.start, Math.min(o.end, Math.round(cursorAt(lt)))));
        pillT.textContent = yrTxt;
        const pw = fs * 3.3;
        pill.setAttribute('x', (cx - pw / 2).toFixed(1)); pill.setAttribute('y', (B + fs * 0.45).toFixed(1)); pill.setAttribute('width', pw.toFixed(1));
        pillT.setAttribute('x', cx.toFixed(1)); pillT.setAttribute('y', (B + fs * 1.18).toFixed(1));

        // markers
        for (const m of M) {
          const p = E(clamp((lt - m.at) / 0.45));
          const q = m.out != null ? 1 - clamp((lt - m.out) / 0.35) : 1;
          const a = p * q * ta;
          m.g.style.opacity = a.toFixed(3);
          if (a <= 0) continue;
          const px = xs(m.year), py = yv(valueAt(m.key, m.year));
          m.ring.setAttribute('cx', px.toFixed(1)); m.ring.setAttribute('cy', py.toFixed(1));
          m.ring.setAttribute('r', (fs * 0.42 * ease('back.out(2.2)')(clamp((lt - m.at) / 0.4))).toFixed(2));
          const bx = px + (m.dx ?? 0) * fs, by = py + (m.dy ?? -3) * fs; // plate anchor
          const anchor = m.anchor || 'end';
          const left = anchor === 'end' ? bx - m.w : anchor === 'middle' ? bx - m.w / 2 : bx;
          const top = by - m.h / 2;
          m.box.setAttribute('x', left.toFixed(1)); m.box.setAttribute('y', top.toFixed(1));
          m.box.setAttribute('width', m.w.toFixed(1)); m.box.setAttribute('height', m.h.toFixed(1));
          const tx = left + fs * 0.55, ty = top + fs * 0.375 - m.bbY;
          m.txt.setAttribute('transform', `translate(${tx.toFixed(1)} ${ty.toFixed(1)})`);
          // leader from the ring to the nearest plate edge
          const ex = clamp(px, left, left + m.w), ey = clamp(py, top, top + m.h);
          m.lead.setAttribute('x1', px.toFixed(1)); m.lead.setAttribute('y1', py.toFixed(1));
          m.lead.setAttribute('x2', ex.toFixed(1)); m.lead.setAttribute('y2', ey.toFixed(1));
          m.g.style.transform = `translateY(${((1 - p) * fs * 0.4).toFixed(1)}px)`;
        }
      },
    };
  },
});

/* ------------------------------------------------------------------ row-kit */
// Waits for a stock chart (data-for="#id") to mount, then colours and labels its rows.
export const RowKit = define({
  name: 'row-kit',
  defaults: { at: 0, for: '', colors: {}, icons: {}, focus: [], brackets: [], dim: 0.3, iconSize: 1.25, race: null },
  async setup(el, o, { motion }) {
    const chartEl = document.querySelector(o.for);
    for (let i = 0; i < 200 && !chartEl.__stComponent; i++) await new Promise((r) => setTimeout(r, 10));
    await chartEl.__stComponent.ready;
    const rows = [...chartEl.querySelectorAll('.st-chart-row')].map((row) => {
      const name = row.querySelector('.st-chart-yl');
      return { row, name, rect: row.querySelector('.st-chart-bar'), val: row.querySelector('.st-chart-val'), label: name.textContent };
    });
    const fs = parseFloat(getComputedStyle(chartEl.querySelector('.st-chart-plot')).fontSize) || 30;
    const cache = {};
    const iconSvg = async (file) => (cache[file] ??= await (await fetch(file)).text());
    for (const r of rows) {
      const c = o.colors[r.label];
      if (c) { r.rect.style.fill = c; }
      const files = o.icons[r.label] || [];
      const nameW = r.name.getComputedTextLength();
      const sz = fs * o.iconSize;
      let x = -fs * 0.6 - nameW - fs * 0.5 - sz;
      for (const f of [...files].reverse()) {
        const doc = new DOMParser().parseFromString(await iconSvg(f), 'image/svg+xml').documentElement;
        const icon = svg('svg', { x: x.toFixed(1), y: (-sz / 2).toFixed(1), width: sz, height: sz, viewBox: doc.getAttribute('viewBox') || '0 0 24 24', class: 'rk-icon' });
        icon.style.color = c || 'currentColor';
        for (const ch of [...doc.children]) icon.append(ch);
        r.row.insertBefore(icon, r.row.firstChild);
        r.icons = [...(r.icons || []), icon];
        x -= sz * 1.05;
      }
    }
    // brackets: [{at, labels, text}] drawn right of the rows' value labels once they have settled
    const plotG = chartEl.querySelector('.st-chart-svg > g');
    const brackets = (o.brackets || []).map((b) => {
      const g = svg('g', { class: 'rk-bracket' });
      const path = svg('path', {});
      const text = svg('text', {}, b.text);
      g.append(path, text); plotG.append(g);
      return { ...b, g, path, text };
    });
    const F = ease('power2.inOut');

    // race: {src, delay, tween}. The stock chart glides between yearly states with a 0.35 s delay and a
    // 0.8 s ease, so at 0.25 s a year its bars trail the states by about a second and near-equal rows
    // share a slot for a while. Here each year moves in `tween` s, `delay` s after its state, and holds
    // until the next; rows swap between their hard ranks in the same move. year-tick flips at the start
    // of the move (lead = delay), so every rank swap happens under its own year.
    let race = null;
    if (o.race) {
      const file = await loadJSON(o.race.src);
      const delay = Number(o.race.delay ?? 0.75), T = Number(o.race.tween ?? 0.16);
      const states = file.states.map((st, k) => {
        const m = Object.fromEntries(st.data.map((d) => [String(d.label), Number(d.value)]));
        const vals = rows.map((r) => m[r.label] ?? 0);
        const order = vals.map((v, i) => [v, i]).sort((a, b) => b[0] - a[0] || a[1] - b[1]);
        const rank = new Array(vals.length);
        order.forEach(([, i], r) => { rank[i] = r; });
        return { at: k ? Number(st.at) + delay : -Infinity, vals, rank };
      });
      const inst = chartEl.__stComponent;
      const orig = inst.state.update;
      // one fixed scale (the chart's own at its first state) and the row pitch, read from the mounted chart
      orig(0, inst.base);
      const kids = [...chartEl.querySelectorAll('.st-chart-grid > *')];
      let best = null;
      for (let i = 0; i < kids.length - 1; i++) {
        if (kids[i].tagName !== 'line' || !kids[i + 1].classList.contains('st-chart-tick') || kids[i + 1].style.display === 'none') continue;
        const v = parseFloat(kids[i + 1].textContent.replace(/[^\d.]/g, '')), x = parseFloat(kids[i].getAttribute('x1'));
        if (v > 0 && x > 0 && (!best || v > best.v)) best = { v, x };
      }
      const top = states[0].rank.indexOf(0);
      const y0 = Number((rows[top].row.getAttribute('transform') || '').split(',')[1]?.replace(')', ''));
      race = { states, T, k: best.x / best.v, band: 2 * y0, grow: Number(inst.options.grow ?? 0.9), E: ease(motion.easeOut), SM: ease('power2.inOut') };
      inst.state.update = (lt, t) => { const r = orig(lt, t); apply(lt); return r; };
    }

    const apply = (lt) => {
      // focus: each step lights its rows and dims the rest; blend over 0.35 s
      const lvl = rows.map(() => 1);
      for (const f of o.focus) {
        const p = F(clamp((lt - f.at) / 0.35));
        rows.forEach((r, i) => {
          const target = !f.labels || f.labels.includes(r.label) ? 1 : o.dim;
          lvl[i] = lerp(lvl[i], target, p);
        });
      }
      const barA = rows.map(() => 1), labA = rows.map(() => 1);
      if (race) {
        const { states, T, k: px, band, grow, E, SM } = race;
        let k = 0;
        for (let j = 1; j < states.length; j++) if (lt >= states[j].at) k = j;
        const A = states[Math.max(0, k - 1)], B = states[k];
        const q = k === 0 ? 1 : SM(clamp((lt - B.at) / T));
        const ys = rows.map((r, i) => (lerp(A.rank[i], B.rank[i], q) + 0.5) * band);
        rows.forEach((r, i) => {
          const p = E(clamp((lt - 0.2 - stagger(i, rows.length, 0.045, { cap: 0.6 })) / grow));
          r.row.setAttribute('transform', `translate(0, ${ys[i].toFixed(2)})`);
          r.rect.setAttribute('x', '0');
          r.rect.setAttribute('width', (px * lerp(A.vals[i], B.vals[i], q) * p).toFixed(2));
        });
        // two rows passing each other: the one moving down fades its name, icon and bar, so the text never overprints
        for (let i = 0; i < rows.length; i++) for (let j = i + 1; j < rows.length; j++) {
          const d = Math.abs(ys[i] - ys[j]);
          const c = clamp(1 - (d - fs * 1.2) / (fs * 1.2));
          if (c <= 0) continue;
          const down = B.rank[i] - A.rank[i] > B.rank[j] - A.rank[j] ? i : j;
          labA[down] = Math.min(labA[down], lerp(1, 0.25, c));
          barA[down] = Math.min(barA[down], lerp(1, 0.35, c));
          // and the row moving up is drawn on top, so its colour stays true where the bars overlap
          const up = down === i ? j : i;
          if (rows[down].row.compareDocumentPosition(rows[up].row) & Node.DOCUMENT_POSITION_PRECEDING) rows[down].row.after(rows[up].row);
        }
      }
      rows.forEach((r, i) => {
        r.rect.style.opacity = (lvl[i] * barA[i]).toFixed(3);
        for (const ic of r.icons || []) ic.style.opacity = (lvl[i] * labA[i]).toFixed(3);
        if (race) r.name.style.opacity = labA[i].toFixed(3);
      });
      for (const b of brackets) {
        const p = ease('power3.out')(clamp((lt - b.at) / 0.45));
        b.g.style.opacity = p.toFixed(3);
        if (p <= 0) continue;
        const rs = rows.filter((r) => b.labels.includes(r.label));
        const ys = rs.map((r) => Number((r.row.getAttribute('transform') || '').split(',')[1]?.replace(')', '')) || 0);
        const xr = Math.max(...rs.map((r) => Number(r.val?.getAttribute('x') || 0) + (r.val?.getComputedTextLength() || 0)));
        const x = xr + fs * 1.1, y1 = Math.min(...ys) - fs * 0.9, y2 = Math.max(...ys) + fs * 0.9, ym = (y1 + y2) / 2;
        b.path.setAttribute('d', `M${x} ${y1} h${fs * 0.5} V${y2} h${-fs * 0.5} M${x + fs * 0.5} ${ym} h${fs * 0.5}`);
        b.path.style.clipPath = `inset(0 0 ${((1 - p) * 100).toFixed(1)}% 0)`;
        b.text.setAttribute('x', (x + fs * 1.4).toFixed(1)); b.text.setAttribute('y', (ym + fs * 0.35).toFixed(1));
      }
    };
    return {
      duration: 0,
      // with a race the chart's own update runs this right after it has placed the rows
      update(lt) { if (!race) apply(lt); },
    };
  },
});

/* ------------------------------------------------------------------ year-tick */
// The year a race chart is moving toward, read from the chart file's states (their `year` field)
export const YearTick = define({
  name: 'year-tick',
  defaults: { at: 0, src: '', chartAt: 0.2, lead: 0.35, years: [] },
  async setup(el, o) {
    const file = await loadJSON(o.src);
    const st = file.states.map((s) => ({ at: Number(s.at), year: String(s.year ?? '') }));
    const cur = h('span', { class: 'yt-cur' });
    el.append(cur);
    return {
      duration: 0,
      update(lt) {
        let y = st[0].year;
        for (const s of st) if (lt >= o.chartAt + s.at + (s === st[0] ? 0 : o.lead)) y = s.year;
        if (cur.textContent !== y) cur.textContent = y;
      },
    };
  },
});

export default { MixLines, RowKit, YearTick };

/* ------------------------------------------------------------------ appear */
// A block that fades and rises in at `at` (used where a crossfade must not show two layouts at once)
export const Appear = define({
  name: 'appear',
  defaults: { at: 0, dur: 0.5, rise: 0.6 },
  setup(el, o) {
    const E = ease('power3.out');
    return { duration: o.dur, update(lt) { const p = E(clamp(lt / o.dur)); el.style.opacity = p.toFixed(3); el.style.transform = `translateY(${((1 - p) * o.rise).toFixed(3)}em)`; } };
  },
});
