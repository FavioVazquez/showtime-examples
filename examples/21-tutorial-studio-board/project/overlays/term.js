// A terminal window whose lines appear on cue. Every frame is a function of time (ST.onSeek):
// the command types at `cps`, output lines appear whole at their `at`, highlights fade in at theirs.
//   terminal(el, { cmd, typeAt, cps, lines: [{html, at, hl: [{sel, at}]}] })
const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
export function terminal(el, { cmd, typeAt, cps = 16, lines }) {
  const body = el.querySelector('.body');
  const cmdRow = document.createElement('span'); cmdRow.className = 'ln'; body.append(cmdRow);
  const rows = lines.map((l) => { const r = document.createElement('span'); r.className = 'ln'; r.innerHTML = l.html; body.append(r); return { l, r }; });
  ST.onSeek((t) => {
    const n = Math.max(0, Math.min(cmd.length, Math.floor((t - typeAt) * cps)));
    const typing = t >= typeAt && n < cmd.length;
    const out = rows.some(({ l }) => t >= l.at);
    const blinkOn = Math.floor(t * 2) % 2 === 0;
    const caret = (!out && (typing || blinkOn)) ? '<span class="caret"></span>' : '';
    cmdRow.innerHTML = '<span class="prompt">$</span> ' + esc(cmd.slice(0, n)) + caret;
    for (const { l, r } of rows) {
      r.style.visibility = t >= l.at ? '' : 'hidden';
      for (const h of (l.hl || [])) {
        const k = Math.max(0, Math.min(1, (t - h.at) / 0.3));
        r.querySelectorAll(h.sel).forEach((x) => {
          x.style.background = `rgb(233 185 73 / ${(0.22 * k).toFixed(3)})`;
          x.style.boxShadow = `0 0 0 0.2em rgb(233 185 73 / ${(0.22 * k).toFixed(3)})`;
        });
      }
    }
  });
}
