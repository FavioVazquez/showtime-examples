// Light-theme plates for the C3 (keystrokes) and W1 (the trailer is a note) style frames.
// Same 3x zoom workaround as trailer-plates.mjs. Record:
//   showtime demo record light-plates.mjs <job>/work/plates-light --serve examples/_apps/tidepool --dpr 1 --fps 10 --no-mp4
export const options = { size: '3840x2160', fps: 10 };
const zoom3 = () => {
  document.documentElement.style.zoom = '3';
  const s = document.createElement('style');
  s.textContent = '.app{height:720px!important;min-height:0!important}';
  document.head.appendChild(s);
};
export default async function (demo) {
  await demo.goto('/index.html?ephemeral=1&theme=light&note=welcome&mode=split');
  await demo.waitFor('html.is-ready');
  await demo.page.evaluate(zoom3);
  await demo.wait(0.6);
  await demo.chapter('Palette');
  await demo.press('Meta+K');
  await demo.wait(0.8);
  await demo.press('Escape');
  await demo.wait(0.3);
  await demo.chapter('New note');
  await demo.press('n');
  await demo.wait(0.4);
  await demo.type(null, 'Trailer', { cps: 12, jitter: 0 });
  await demo.press('Enter', { hold: 0.2 });
  await demo.type(null, '# Kept on your own machine.', { cps: 20, jitter: 0 });
  await demo.press('Enter', { hold: 0.1 });
  await demo.press('Enter', { hold: 0.1 });
  await demo.type(null, '- [x] No account', { cps: 20, jitter: 0 });
  await demo.press('Enter', { hold: 0.1 });
  await demo.type(null, 'No server', { cps: 20, jitter: 0 });
  await demo.press('Enter', { hold: 0.1 });
  await demo.type(null, 'No loading spinner', { cps: 20, jitter: 0 });
  await demo.wait(1.0);
}
