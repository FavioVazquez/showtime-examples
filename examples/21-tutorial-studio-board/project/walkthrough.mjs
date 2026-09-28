// Tutorial 21: the showtime studio board, recorded live on a copy of example 20's round-1 board.
// Action times (seconds of this recording) come from voice/timeline.json: recording time 0 is the
// start of the "open-board" line (output 11.33 s); each action lands on the word that names it.
// The board URL (with its key) comes from the environment, so no key is written in this file.
export const options = { size: '1440x900', fps: 30 };

export default async function (demo) {
  const at = async (t) => { const d = t - demo.t; if (d > 0.001) await demo.wait(d); };
  const clickAt = async (sel, w, move = 0.5) => { await at(w - move - 2 / 30); await demo.click(sel, { move }); };
  const keyAt = async (k, w) => { await at(w); await demo.press(k); };
  const absTop = (sel) => demo.page.evaluate((s) => { const r = document.querySelector(s).getBoundingClientRect(); return r.top + scrollY; }, sel);
  const box = (sel) => demo.page.evaluate((s) => { const r = document.querySelector(s).getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; }, sel);

  await demo.goto(process.env.BOARD_URL);
  await demo.waitFor('#c-c1 .frame img');
  await demo.waitFor(() => document.querySelector('#conn') && document.querySelector('#conn').dataset.state === 'live');
  await demo.waitFor(0.8);                                   // fonts and frame images settle (not recorded)

  // ---- 1 open: "The link opens the board in your browser. Each concept is a card..."
  await demo.chapter('Open the board');
  await demo.moveTo({ x: 1180, y: 620 }, { duration: 0.1 });
  const cardY = (await absTop('#c-c1 .frame')) - 104;
  await at(1.55); await demo.scroll({ y: cardY }, { duration: 1.0 });           // cards arrive on "Each concept"
  await demo.focus('#c-c1 .frame', { zoom: 1.3, duration: 4.4 });
  await at(3.9); await demo.moveTo('#c-c1 .frame', { duration: 0.45 });         // "style frames"
  await at(5.0); await demo.moveTo('#c-c1 .hook', { duration: 0.35 });          // "a hook"
  await at(5.55); await demo.moveTo('#c-c1 .swatches', { duration: 0.35 });     // "a palette"
  await at(6.2); await demo.moveTo('#c-c1 .vibe span', { duration: 0.35 });     // "a music sketch"
  await at(7.6); await demo.moveTo({ x: 700, y: 560 }, { duration: 0.6 });
  await demo.wide();

  // ---- 2 compare
  await at(8.3); await demo.chapter('Compare');
  await at(9.1); await demo.moveTo('#c-c1 .thumbs button:nth-child(2)', { duration: 0.6 });
  await clickAt('#c-c1 .thumbs button:nth-child(2)', 10.3, 0.35);             // "Click the thumbnails"
  await clickAt('#c-c1 .thumbs button:nth-child(3)', 11.55, 0.4);             // "step through"
  await clickAt('#c-c1 .thumbs button:nth-child(1)', 12.75, 0.45);            // "style frames"
  await clickAt('#c-c1 [data-act="vibe"]', 14.23, 0.6);                       // "Press play"
  await clickAt('#c-c1 [data-act="vibe"]', 18.35, 0.35);                      // stop the sketch before moving on
  await at(18.5); await demo.wide();
  await at(18.85); await demo.scroll('#compare .wipe', { duration: 1.1 });    // "Further down, Compare"
  const w = await box('#compare .wipe');
  const wy = w.y + w.h * 0.55;
  await at(21.9); await demo.moveTo({ x: w.x + w.w * 0.5, y: wy }, { duration: 0.5 });
  await at(22.64); await demo.drag({ x: w.x + w.w * 0.5, y: wy }, { x: w.x + w.w * 0.86, y: wy }, { duration: 0.9 });  // "Drag across"
  await at(23.95); await demo.drag({ x: w.x + w.w * 0.86, y: wy }, { x: w.x + w.w * 0.14, y: wy }, { duration: 1.3 }); // "wipe from one to the other"
  await at(25.3); await demo.drag({ x: w.x + w.w * 0.14, y: wy }, { x: w.x + w.w * 0.5, y: wy }, { duration: 0.5 });

  // ---- 3 react
  await demo.wide();
  await at(26.16); await demo.chapter('React');
  const actY = (await absTop('#c-c1 .cactions')) - 900 + 150;
  await demo.scroll({ y: actY }, { duration: 1.0 });                           // "Step three: react"
  await clickAt('#c-c1 .cbody .risk:last-of-type', 27.4, 0.3);               // select the C1 card (the wipe slider had focus)
  await demo.focus('#c-c1 .cactions', { zoom: 1.8, duration: 3.5 });
  await keyAt('l', 27.87);                                                     // "Press L"
  await at(29.2); await demo.moveTo('#c-c1 .cactions .like', { duration: 0.55 }); // "or click the heart" (already liked: point, no click)
  await at(30.6); await demo.moveTo({ x: 760, y: 470 }, { duration: 0.5 });
  await keyAt('c', 31.69);                                                     // "Press C"
  await at(32.3); await demo.type(null, 'Love the curtain; slower reveal?', { cps: 14 });  // "leave a note, in your own words"
  await keyAt('Control+Enter', 36.05);                                          // "Control Enter sends it"
  await at(37.3); await demo.moveTo('#fbBtn', { duration: 0.7 });              // "Every reaction is saved"
  await demo.focus('#fbBtn', { zoom: 1.6, duration: 2.2 });

  // ---- 4 pick
  await at(40.4); await demo.chapter('Pick');
  await demo.moveTo('#c-c1 .cactions .pick', { duration: 0.8 });
  await clickAt('#c-c1 .cactions .pick', 42.63, 0.25);                         // "Click Pick"
  await at(43.7); await demo.wide();
  await at(43.8); await demo.scroll({ y: cardY - 40 }, { duration: 0.9 });   // the whole C1 frame, with its Picked tag
  await demo.moveTo({ x: 760, y: 610 }, { duration: 0.4 });
  await keyAt('.', 45.45);                                                     // "Press the full stop key"
  await at(46.75); await demo.focus({ x: 1230, y: 420 }, { zoom: 1.75, duration: 1.7 });  // "review everything you've sent"
  await at(48.45); await demo.wide();
  // held while the director's terminal is shown over it (edit), then the end state for the outcome preview
  await at(55.2); await demo.focus('#c-c1 .frame', { zoom: 1.7, duration: 2.5 });
  await at(57.9); await demo.focus({ x: 1230, y: 420 }, { zoom: 1.75, duration: 2.6 });
  await at(60.5);
}
