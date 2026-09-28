// Review round 4: the pull-back plate, re-recorded so the product name is withheld until the end card.
// Same app and seed data as trailer-plates.mjs, but with the Work notebook filtered and the
// "Q4 planning draft" note open, so no heading, breadcrumb, list title or body text says the
// product name (the app's own sidebar logo still does). Same 3x zoom workaround (see trailer-plates.mjs).
// Record: showtime demo record reveal-plate.mjs <job>/work/plates-reveal --serve examples/_apps/tidepool --dpr 1 --fps 10 --no-mp4
export const options = { size: '3840x2160', fps: 10 };

const zoom3 = () => {
  document.documentElement.style.zoom = '3';
  const s = document.createElement('style');
  s.textContent = '.app{height:720px!important;min-height:0!important}';
  document.head.appendChild(s);
};

export default async function (demo) {
  await demo.goto('/index.html?ephemeral=1&theme=dark&notebook=work&note=q4-planning&mode=split');
  await demo.waitFor('html.is-ready');
  await demo.page.evaluate(zoom3);
  await demo.wait(1.0);
}
