// Tidepool: three keyboard shortcuts, recorded as three clean segments.
// The composition (index.html) shows each segment by its chapter time.
// Record: showtime demo record project/shortcuts.mjs <job>/work/demo --serve examples/_apps/tidepool
// then copy <job>/work/demo/demo.mp4 to project/media/shortcuts.mp4
export const options = { size: '900x1100', fps: 30 };

const base = '/?ephemeral=1&theme=light';
const ready = () => document.documentElement.classList.contains('is-ready');

export default async function (demo) {
  // 1. Mod+K: the palette searches every note as you type
  await demo.goto(`${base}&note=welcome&mode=edit`);
  await demo.waitFor(ready);
  await demo.chapter('palette');
  await demo.wait(0.6);
  await demo.press('ControlOrMeta+K', { hold: 0.35 });
  await demo.type(null, 'export', { cps: 11, hold: 0.5 });
  await demo.press('ArrowDown', { hold: 0.45 });
  await demo.press('Enter', { hold: 1.4 });

  // 2. N: a new note, title focused
  await demo.goto(`${base}&note=welcome&mode=edit`);
  await demo.waitFor(ready);
  await demo.chapter('new');
  await demo.wait(0.6);
  await demo.press('n', { hold: 0.35 });
  await demo.type(null, 'Reel ideas', { cps: 13, hold: 0.3 });
  await demo.press('Enter', { hold: 0.2 });
  await demo.type(null, '- [ ] Film the shortcuts', { cps: 16, hold: 1.2 });

  // 3. Mod+E: Markdown source flips to the rendered preview
  await demo.goto(`${base}&note=q4-planning&mode=edit`);
  await demo.waitFor(ready);
  await demo.chapter('preview');
  await demo.wait(0.8);
  await demo.press('ControlOrMeta+E', { hold: 3.0 });
}
