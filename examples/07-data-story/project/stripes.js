// stripes-chart: one mark per year, drawn from data/gistemp-annual.json (written by
// `showtime data import`). It starts as warming stripes (one full-height stripe per year,
// coloured by its anomaly) and can morph into an anomaly bar chart around a zero line
// (the 1951-1980 average). The stock chart component scales from 0 upward, so values
// below the average (every year before 1937 here) need their own axis.
//
// Everything is a pure function of the clip's local time `lt`: no timers, no state.
import { define, svg, h, clamp, lerp, ease, stagger } from '/_st/components/index.js';

const css = (el, name) => getComputedStyle(el).getPropertyValue(name).trim();
const hex = (c) => { const m = c.replace('#', ''); return [0, 2, 4].map((i) => parseInt(m.slice(i, i + 2), 16)); };
const toLin = (u) => { u /= 255; return u <= 0.04045 ? u / 12.92 : ((u + 0.055) / 1.055) ** 2.4; };
const toSrgb = (v) => Math.round(255 * (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055));
const mix = (a, b, p) => { const A = hex(a).map(toLin), B = hex(b).map(toLin); return 'rgb(' + A.map((x, i) => toSrgb(lerp(x, B[i], p))).join(' ') + ')'; };
let clipSeq = 0;
const fmt = (v) => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(2) + ' °C';

export const StripesChart = define({
  name: 'stripes-chart',
  defaults: {
    at: 0, src: 'data/gistemp-annual.json',
    wipeAt: 0.15, wipeDur: 1.4,          // stripes sweep in left to right (negative: already drawn)
    morphAt: null, morphDur: 1.1,        // stripes fold into bars around the zero line
    ends: true, endsOutAt: null,         // "1880" / "2025" under the stripes (fade out at endsOutAt)
    notesAt: null, focusAt: null,        // 1976 + the 1977-2025 run; then 2024 alone
    mark: null,                          // a year labelled above the stripes
    spanLast: null, spanAt: 0.35,        // bracket over the last N stripes, labelled with their first and last year
    band: [0.445, 0.815],                // stripes: top and bottom, fractions of the height
    plot: [0.235, 0.805], yMin: -0.6, yMax: 1.4,
    x: [0.07, 0.93],
    camFrom: 1, camTo: 1, camFold: 1.2,  // scale at lt=0 and after the fold (the hand-off keeps the cut invisible)
    drift: 0,                            // slow push per second, so long holds keep moving
    push: 0.01,                          // extra push after the focus (kept small: text stays inside title-safe)
  },
  async setup(el, o) {
    const file = await (await fetch(o.src)).json();
    const years = file.data.labels.map(Number);
    const vals = file.data.series[0].values.map(Number);
    const n = years.length;
    const W = el.clientWidth, H = el.clientHeight;
    const fs = Math.max(29, H * 0.027);
    const x0 = W * o.x[0], x1 = W * o.x[1], step = (x1 - x0) / n;
    const bandT = H * o.band[0], bandB = H * o.band[1];
    const pT = H * o.plot[0], pB = H * o.plot[1];
    const k = (pB - pT) / (o.yMax - o.yMin);
    const y = (v) => pT + (o.yMax - v) * k;
    const zero = y(0);
    const xOf = (yr) => x0 + (years.indexOf(yr) + 0.5) * step;

    // palette from the page tokens (one place for every colour)
    const P = ['--s-cold', '--s-cool', '--s-zero', '--s-warm', '--s-hot', '--s-max'].map((v) => css(el, v));
    const stops = [-0.5, -0.25, 0, 0.5, 1.0, 1.3];
    const stripe = (v) => {
      if (v <= stops[0]) return mix(P[0], P[0], 0);
      for (let i = 1; i < stops.length; i++) if (v <= stops[i]) return mix(P[i - 1], P[i], (v - stops[i - 1]) / (stops[i] - stops[i - 1]));
      return mix(P[5], P[5], 0);
    };
    const barCol = (v) => (v < 0 ? css(el, '--cool') : css(el, '--warm'));

    const root = svg('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'sc-svg' });
    const cam = svg('g', {});
    root.append(cam);
    const grid = svg('g', { class: 'sc-grid' });
    cam.append(grid);
    const ticks = [-0.5, 0.5, 1.0].map((v) => {
      const line = svg('line', { x1: x0, x2: x1, y1: y(v), y2: y(v) });
      const t = svg('text', { x: x0, y: y(v) - fs * 0.35, class: 'sc-tick' }, fmt(v).replace('.00', '.0').replace('.50', '.5'));
      grid.append(line, t);
      return [line, t];
    });
    const zeroLine = svg('line', { x1: x0, x2: x1, y1: zero, y2: zero, class: 'sc-zero' });
    const zeroLab = svg('text', { x: x0, y: zero - fs * 0.35, class: 'sc-tick sc-zero-lab' }, '0 = 1951–1980 average');
    grid.append(zeroLine, zeroLab);

    // the wipe is a straight left-to-right reveal: one clip rect over every mark
    const clipId = 'sc-wipe-' + (++clipSeq);
    const clipRect = svg('rect', { x: x0 - 2, y: -H, width: 0, height: 3 * H });
    const clip = svg('clipPath', { id: clipId });
    clip.append(clipRect);
    const defs = svg('defs', {});
    defs.append(clip);
    root.prepend(defs);
    const marksG = svg('g', { 'clip-path': `url(#${clipId})` });
    cam.append(marksG);
    const bars = years.map((yr, i) => {
      const r = svg('rect', { x: x0 + i * step, width: step + 0.6, y: bandT, height: bandB - bandT, fill: stripe(vals[i]) });
      marksG.append(r);
      return r;
    });
    // decade labels under the bars, and the two ends under the stripes
    const decades = years.filter((yr) => yr % 20 === 0).map((yr) => {
      const t = svg('text', { x: xOf(yr), y: pB + fs * 1.5, class: 'sc-year', 'text-anchor': 'middle' }, String(yr));
      cam.append(t); return t;
    });
    const endL = svg('text', { x: x0, y: bandB + fs * 1.45, class: 'sc-year sc-end' }, String(years[0]));
    const endR = svg('text', { x: x1, y: bandB + fs * 1.45, class: 'sc-year sc-end', 'text-anchor': 'end' }, String(years[n - 1]));
    cam.append(endL, endR);

    // annotations (all numbers read from the data file, never typed in)
    const i76 = years.indexOf(1976), i77 = years.indexOf(1977), i24 = years.indexOf(2024);
    const runLen = n - i77;
    const run = svg('line', { x1: x0 + i77 * step, x2: x1, y1: zero, y2: zero, class: 'sc-run' });
    // the start tick rises from the zero line only, so nothing red dips below zero next to 1976
    const runTick = svg('line', { x1: x0 + i77 * step + 3.5, x2: x0 + i77 * step + 3.5, y1: zero - fs * 0.6, y2: zero + 3.5, class: 'sc-run' });
    const runLab = svg('text', { x: (x0 + i77 * step + x1) / 2, y: y(-0.52), class: 'sc-note sc-note-warm', 'text-anchor': 'middle' },
      `${years[i77]}–${years[n - 1]}: ${runLen} years in a row above it`);
    const lastLab = svg('text', { x: x0 + i76 * step - fs * 0.6, y: y(-0.52), class: 'sc-note sc-note-cool', 'text-anchor': 'end' },
      `${years[i76]}: ${fmt(vals[i76])}, the last year below`);
    const lastDot = svg('circle', { cx: xOf(1976), cy: y(vals[i76]) + fs * 0.55, r: fs * 0.2, class: 'sc-dot-cool' });
    cam.append(run, runTick, runLab, lastLab, lastDot);
    // 2024: ring on the bar top and a label to its left
    const topY = y(vals[i24]);
    const ring = svg('circle', { cx: xOf(2024), cy: topY, r: fs * 0.55, class: 'sc-ring' });
    const hotLab = svg('text', { x: xOf(2024) - fs * 1.1, y: topY + fs * 0.1, class: 'sc-hot', 'text-anchor': 'end', 'dominant-baseline': 'middle' },
      `${years[i24]}: ${fmt(vals[i24])}`);
    cam.append(ring, hotLab);
    let markG = null;
    if (o.mark != null && years.includes(Number(o.mark))) {
      const mx = xOf(Number(o.mark));
      markG = svg('g', {});
      markG.append(
        svg('line', { x1: mx, x2: mx, y1: bandT - fs * 0.9, y2: bandT - fs * 0.2, class: 'sc-mark' }),
        svg('text', { x: mx, y: bandT - fs * 1.25, class: 'sc-year sc-end', 'text-anchor': 'end' }, String(o.mark)));
      cam.append(markG);
    }
    // bracket over the last N stripes (the hook's "last eleven years"), years read from the data
    let spanG = null, spanPath = null, spanLen = 0;
    if (o.spanLast) {
      const k0 = n - Number(o.spanLast);
      const sx0 = x0 + k0 * step + 1, sx1 = x1 - 1, sy = bandT - fs * 0.55, sb = bandT - fs * 0.12;
      spanPath = svg('path', { d: `M${sx0} ${sb} L${sx0} ${sy} L${sx1} ${sy} L${sx1} ${sb}`, class: 'sc-span' });
      spanLen = 2 * (sb - sy) + (sx1 - sx0);
      spanPath.setAttribute('stroke-dasharray', `${spanLen.toFixed(1)} ${spanLen.toFixed(1)}`);
      const lab = svg('text', { x: sx1, y: sy - fs * 0.45, class: 'sc-year sc-end sc-span-lab', 'text-anchor': 'end' },
        `${years[k0]}–${years[n - 1]}`);
      spanG = svg('g', {});
      spanG.append(spanPath, lab);
      spanG.lab = lab;
      cam.append(spanG);
    }
    el.append(root);

    const E = ease('power3.out'), M = ease('power2.inOut'), F = ease('power2.out');
    const hasMorph = o.morphAt != null, hasNotes = o.notesAt != null, hasFocus = o.focusAt != null;
    return {
      duration: 1,
      update(lt) {
        const morph = (i) => (hasMorph ? M(clamp((lt - o.morphAt - stagger(i, n, 0.006, { cap: 0.55 })) / o.morphDur)) : 0);
        const focus = hasFocus ? F(clamp((lt - o.focusAt) / 0.7)) : 0;
        const wipeP = o.wipeAt < 0 ? 1 : M(clamp((lt - o.wipeAt) / o.wipeDur));
        clipRect.setAttribute('width', (wipeP >= 1 ? W * 2 : (x1 - x0 + 4) * wipeP).toFixed(2));
        bars.forEach((r, i) => {
          const v = vals[i];
          const m = morph(i);
          const bt = Math.min(zero, y(v)), bh = Math.max(2, Math.abs(y(v) - zero));
          const top = lerp(bandT, bt, m), hgt = lerp(bandB - bandT, bh, m);
          const w = lerp(step + 0.6, step * 0.72, m);
          r.setAttribute('x', (x0 + i * step + (step - w) / 2).toFixed(2));
          r.setAttribute('width', w.toFixed(2));
          r.setAttribute('y', top.toFixed(2));
          r.setAttribute('height', hgt.toFixed(2));
          r.setAttribute('fill', m > 0 ? mix(hex2(stripe(v)), barCol(v), m) : stripe(v));
          const dim = i === i24 ? 1 : 1 - 0.62 * focus;
          r.style.opacity = dim.toFixed(3);
        });
        const mEnd = hasMorph ? M(clamp((lt - o.morphAt - 0.3) / 0.8)) : 0;
        const ax = hasMorph ? clamp((lt - o.morphAt - 1.0) / 0.6) : 0;
        grid.style.opacity = F(ax).toFixed(3);
        decades.forEach((t) => (t.style.opacity = F(ax).toFixed(3)));
        const endsOut = o.endsOutAt != null ? 1 - F(clamp((lt - o.endsOutAt) / 0.4)) : 1;
        const endsOp = o.ends ? (o.wipeAt < 0 ? 1 : F(clamp((lt - o.wipeAt - 0.3) / 0.6))) * (1 - mEnd) * endsOut : 0;
        endL.style.opacity = endsOp.toFixed(3);
        endR.style.opacity = (endsOp * (o.wipeAt < 0 ? 1 : F(clamp((wipeP - 0.9) / 0.1)))).toFixed(3);
        if (spanG) {
          const d = M(clamp((lt - o.spanAt) / 0.6));
          spanPath.setAttribute('stroke-dashoffset', (spanLen * (1 - d)).toFixed(1));
          const q = F(clamp((lt - o.spanAt - 0.35) / 0.4));
          spanG.lab.style.opacity = q.toFixed(3);
          spanG.lab.setAttribute('transform', `translate(0 ${((1 - q) * fs * 0.3).toFixed(2)})`);
          spanG.style.opacity = (d > 0 ? endsOut : 0).toFixed(3);
        }
        if (markG) { const q = F(clamp((lt - o.wipeAt - o.wipeDur - 0.2) / 0.5)); markG.style.opacity = q.toFixed(3); markG.setAttribute('transform', `translate(0 ${((1 - q) * -fs * 0.4).toFixed(2)})`); }
        // notes: 1976, then the run along the zero line
        const n1 = hasNotes ? F(clamp((lt - o.notesAt) / 0.5)) : 0;
        const n2 = hasNotes ? F(clamp((lt - o.notesAt - 1.2) / 0.6)) : 0;
        const out = 1 - focus;
        lastLab.style.opacity = lastDot.style.opacity = (n1 * out).toFixed(3);
        lastLab.setAttribute('transform', `translate(0 ${((1 - n1) * fs * 0.6).toFixed(2)})`);
        const runW = (x1 - (x0 + i77 * step)) * n2;
        run.setAttribute('x2', (x0 + i77 * step + runW).toFixed(2));
        run.style.opacity = runTick.style.opacity = (n2 > 0 ? out : 0).toFixed(3);
        runLab.style.opacity = (clamp(n2 * 1.6 - 0.6) * out).toFixed(3);
        // focus: 2024 alone, and a slow push toward the recent end
        ring.style.opacity = hotLab.style.opacity = focus.toFixed(3);
        ring.setAttribute('r', (fs * (0.55 + 0.25 * (1 - focus))).toFixed(2));
        const push = hasFocus ? M(clamp((lt - o.focusAt) / 5)) : 0;
        const settleT = hasMorph ? o.camFold : 0;
        const base = lerp(o.camFrom, o.camTo, M(clamp(settleT ? lt / settleT : 1)));
        const s = base + o.drift * Math.max(0, Math.min(lt, hasFocus ? o.focusAt : Infinity) - settleT) + o.push * push, ox = W / 2;
        cam.setAttribute('transform', `translate(${(ox * (1 - s)).toFixed(2)} ${(zero * (1 - s)).toFixed(2)}) scale(${s.toFixed(4)})`);
      },
    };
  },
});
// rgb(...) or #hex to #hex for mix()
function hex2(c) {
  if (c[0] === '#') return c;
  const m = c.match(/[\d.]+/g).map(Number);
  return '#' + m.slice(0, 3).map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
}

export default StripesChart;
