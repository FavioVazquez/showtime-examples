// warmest-bars: the eleven warmest years as bars, in time order, with a dashed line at the
// next-warmest year so every bar visibly clears it. Bars from data/warmest-11.json (written by
// `showtime data import`); the reference line is computed from data/gistemp-annual.json as the
// warmest year NOT in that list, so no number here is typed in.
//
// Why not the stock chart: its value labels count up while bars grow (a paused frame shows
// figures that are not in the data) and it has no reference line. Here each label fades in at
// its final value as its bar lands, and the highlight colour waits until every bar has landed.
//
// Everything is a pure function of the clip's local time `lt`.
import { define, svg, clamp, lerp, ease } from '/_st/components/index.js';

const sign = (v) => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(2);

export const WarmestBars = define({
  name: 'warmest-bars',
  defaults: {
    at: 0.3, src: 'data/warmest-11.json', all: 'data/gistemp-annual.json',
    each: 0.07, grow: 0.8,            // bar stagger and growth time
    refAt: 3.1, refDur: 0.7,          // the next-warmest line draws on
    x: [0.07, 0.80], plot: [0.30, 0.86], room: 0.24,  // room: plot fraction kept above the tallest bar
  },
  async setup(el, o) {
    const top = await (await fetch(o.src)).json();
    const all = await (await fetch(o.all)).json();
    const rows = top.data.map((d) => ({ label: String(d.label), v: Number(d.value) }));
    const inTop = new Set(rows.map((r) => r.label));
    let ref = null;
    all.data.labels.forEach((lab, i) => {
      const v = Number(all.data.series[0].values[i]);
      if (!inTop.has(String(lab)) && (!ref || v > ref.v)) ref = { label: String(lab), v };
    });
    const hl = String(top.highlight ?? '');
    const annText = top.annotate?.text || '';

    const W = el.clientWidth, H = el.clientHeight;
    const fs = Math.max(29, H * 0.029);
    const n = rows.length;
    const x0 = W * o.x[0], x1 = W * o.x[1], band = (x1 - x0) / n, bw = band * 0.66;
    const pT = H * o.plot[0], pB = H * o.plot[1];
    const vMax = Math.max(...rows.map((r) => r.v));
    const k = ((pB - pT) * (1 - o.room)) / vMax;
    const y = (v) => pB - v * k;
    const cx = (i) => x0 + (i + 0.5) * band;

    const root = svg('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'wb-svg' });
    const base = svg('line', { x1: x0 - fs * 0.3, x2: W * 0.93, y1: pB, y2: pB, class: 'wb-base' });
    root.append(base);
    const refY = y(ref.v), refX = W * 0.94;
    const refLine = svg('line', { x1: x0 - fs * 0.3, x2: x0 - fs * 0.3, y1: refY, y2: refY, class: 'wb-ref' });
    const refA = svg('text', { x: refX, y: refY - fs * 0.5, class: 'wb-ref-lab', 'text-anchor': 'end' }, `${ref.label}: ${sign(ref.v)}`);
    // say what "next" means: the warmest year before the eleven, when it is older than all of them
    const firstTop = Math.min(...rows.map((r) => Number(r.label)));
    const subLines = Number(ref.label) < firstTop ? ['warmest year', `before ${firstTop}`] : [`${n + 1}th warmest year`];
    const refB = svg('text', { x: refX, y: refY + fs * 1.2, class: 'wb-ref-sub', 'text-anchor': 'end' });
    subLines.forEach((line, i) => refB.append(svg('tspan', { x: refX, dy: i ? fs * 1.15 : 0 }, line)));
    const bars = rows.map((r, i) => {
      const rect = svg('rect', { x: cx(i) - bw / 2, width: bw, rx: Math.min(fs * 0.3, bw / 6), class: 'wb-bar' });
      const val = svg('text', { x: cx(i), class: 'wb-val', 'text-anchor': 'middle' }, sign(r.v));
      const yr = svg('text', { x: cx(i), y: pB + fs * 1.55, class: 'wb-year', 'text-anchor': 'middle' }, r.label);
      root.append(rect, val, yr);
      return { ...r, i, rect, val, yr, hi: r.label === hl };
    });
    root.append(refLine, refA, refB);
    const callout = annText ? svg('g', { class: 'wb-call' }) : null;
    if (callout) {
      const b = bars.find((m) => m.hi);
      const tw = annText.length * fs * 0.56 + fs * 1.4, th = fs * 1.75;
      const by = y(b.v) - fs * 1.55 - th - fs * 0.55;
      callout.append(
        svg('rect', { x: cx(b.i) - tw / 2, y: by, width: tw, height: th, rx: fs * 0.2, class: 'wb-call-box' }),
        svg('path', { d: `M${cx(b.i) - fs * 0.35} ${by + th} L${cx(b.i)} ${by + th + fs * 0.4} L${cx(b.i) + fs * 0.35} ${by + th} Z`, class: 'wb-call-box' }),
        svg('text', { x: cx(b.i), y: by + th * 0.5, class: 'wb-call-text', 'text-anchor': 'middle', 'dominant-baseline': 'central' }, annText));
      root.append(callout);
    }
    el.append(root);

    const E = ease('power3.out'), F = ease('power2.out'), M = ease('power2.inOut');
    const settled = o.at + (n - 1) * o.each + o.grow;
    const pale = getComputedStyle(el).getPropertyValue('--pale-warm').trim();
    const accent = getComputedStyle(el).getPropertyValue('--accent').trim();
    return {
      duration: o.refAt + o.refDur + 0.6,
      sync: { settled, ref: o.refAt },
      update(lt) {
        const hiP = F(clamp((lt - settled) / 0.35));
        for (const m of bars) {
          const raw = clamp((lt - o.at - m.i * o.each) / o.grow);
          const p = E(raw);
          const ty = lerp(pB, y(m.v), p);
          m.rect.setAttribute('y', ty.toFixed(2));
          m.rect.setAttribute('height', (pB - ty).toFixed(2));
          m.rect.style.opacity = raw > 0 ? 1 : 0;
          m.rect.setAttribute('fill', m.hi ? `color-mix(in oklab, ${accent} ${(hiP * 100).toFixed(1)}%, ${pale})` : pale);
          // the label shows only the final value, and only once its bar has landed
          const q = F(clamp((raw - 0.8) / 0.2));
          m.val.setAttribute('y', (y(m.v) - fs * 0.55 + (1 - q) * fs * 0.3).toFixed(2));
          m.val.style.opacity = q.toFixed(3);
          m.val.classList.toggle('wb-val-hi', m.hi && hiP > 0.5);
          m.yr.style.opacity = F(clamp((lt - o.at + 0.2 - m.i * o.each) / 0.4)).toFixed(3);
        }
        base.style.opacity = F(clamp((lt - o.at + 0.3) / 0.4)).toFixed(3);
        if (callout) {
          const c = F(clamp((lt - settled - 0.15) / 0.45));
          callout.style.opacity = c.toFixed(3);
          callout.setAttribute('transform', `translate(0 ${((1 - c) * -fs * 0.5).toFixed(2)})`);
        }
        const r = M(clamp((lt - o.refAt) / o.refDur));
        refLine.setAttribute('x2', lerp(x0 - fs * 0.3, refX, r).toFixed(2));
        refLine.style.opacity = r > 0 ? 1 : 0;
        const rl = F(clamp((lt - o.refAt - o.refDur * 0.7) / 0.45));
        refA.style.opacity = refB.style.opacity = rl.toFixed(3);
        refA.setAttribute('transform', `translate(${((1 - rl) * fs * 0.4).toFixed(2)} 0)`);
        refB.setAttribute('transform', `translate(${((1 - rl) * fs * 0.4).toFixed(2)} 0)`);
      },
    };
  },
});

export default WarmestBars;
