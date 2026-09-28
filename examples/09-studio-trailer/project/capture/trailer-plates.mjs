// Tidepool trailer plates: the real app in its dark theme, laid out at 1280x720 and captured at 3x
// (3840x2160) so macro crops stay sharp. `demo record --dpr` wrote 1x frames on this machine, so the
// page is zoomed 3x inside a 3840x2160 viewport instead (same layout as 1280x720 @3x).
// Record: showtime demo record trailer-plates.mjs <job>/work/plates --serve examples/_apps/tidepool --dpr 1 --fps 10
// The app is fictional (examples/_apps/tidepool); ?ephemeral=1 uses the fixed seed notes in memory.
export const options = { size: '3840x2160', fps: 10 };

const zoom3 = () => {
  document.documentElement.style.zoom = '3';
  const s = document.createElement('style');
  s.textContent = '.app{height:720px!important;min-height:0!important}';
  document.head.appendChild(s);
};

export default async function (demo) {
  await demo.goto('/index.html?ephemeral=1&theme=dark&note=welcome&mode=split');
  await demo.waitFor('html.is-ready');
  await demo.page.evaluate(zoom3);
  await demo.wait(1.0);                                    // plate: the whole app (the reveal)

  await demo.chapter('Search');
  await demo.press('Meta+K');
  await demo.waitFor('#palette-input');
  await demo.wait(0.6);
  await demo.type(null, 'export', { cps: 5, jitter: 0 }); // one letter every 2 frames
  await demo.wait(1.0);
  await demo.press('Enter');
  await demo.wait(1.0);                                    // Q4 planning draft is open

  await demo.chapter('Tick');
  await demo.wait(0.5);
  await demo.page.evaluate(() => document.querySelector('#preview input[type=checkbox][data-line]:not(:checked)').click());
  await demo.waitFor(() => document.querySelector('#save-label').textContent.includes('Saved'));
  await demo.wait(1.5);
}
