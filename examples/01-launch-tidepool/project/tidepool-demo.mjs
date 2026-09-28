// Tidepool hero demo: search with the Cmd+K palette, then write Markdown and watch it render.
// Record: showtime demo record tidepool-demo.mjs <job>/work/demo --serve examples/_apps/tidepool
// The app is fictional (examples/_apps/tidepool); ?reset=1 starts from the fixed seed notes.

export const options = { size: '1280x800', fps: 30 };

export default async function (demo) {
  await demo.goto('/index.html?reset=1&theme=light&note=welcome&mode=split');
  await demo.waitFor('html.is-ready');
  await demo.moveTo({ x: 820, y: 520 }, { duration: 0.1 });
  await demo.wait(0.6);

  // 1. Find anything: Cmd+K, type a word from inside a note, open the match.
  await demo.chapter('Search');
  await demo.press('Meta+K');
  await demo.waitFor('#palette-input');
  await demo.wait(0.35);
  await demo.type(null, 'export', { cps: 10 });           // the palette input already has focus
  await demo.wait(1.0);
  await demo.press('Enter');
  await demo.wait(1.3);

  // 2. Write: a new note in split view, Markdown rendered as you type.
  await demo.chapter('Write');
  await demo.click('#new-note');
  await demo.wait(0.2);
  await demo.type(null, 'Low tide walk', { cps: 14 });    // the new note focuses its title
  await demo.press('Enter', { hold: 0.25 });
  await demo.type(null, '## Saturday', { cps: 16 });
  await demo.press('Enter', { hold: 0.15 });
  await demo.press('Enter', { hold: 0.2 });
  await demo.type(null, '- [ ] Check the tide chart', { cps: 22 });
  await demo.press('Enter', { hold: 0.2 });
  await demo.type(null, 'Bring the field notebook', { cps: 22 });   // Enter continued the task list
  await demo.wait(0.3);
  await demo.click('#preview input[type=checkbox][data-line]', { move: 0.6 });
  await demo.waitFor(() => document.querySelector('#save-label').textContent.includes('Saved'));
  await demo.wait(1.6);
}
