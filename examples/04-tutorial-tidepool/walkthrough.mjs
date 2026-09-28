// Tidepool tutorial: create a note, tag it, find it with search.
// Record with:
//   showtime demo record walkthrough.mjs rec --serve <tidepool app folder>
//
// The narration is built first (project/voice/timeline.json). Every action below is placed on the
// word that names it, so the picture never runs ahead of the voice. Each chapter's voice line starts
// LEAD seconds after its chapter marker; the composition places the line files the same way.
import fs from 'node:fs';

export const options = { size: '1280x800', fps: 30 };

const TL = JSON.parse(fs.readFileSync(new URL('./project/voice/timeline.json', import.meta.url), 'utf8'));
const LINES = Object.fromEntries(TL.lines.map((l) => [l.id, l]));
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9']/g, '');

// start of the nth occurrence of `word` in line `id`, relative to the line start
function wordAt(id, word, nth = 0) {
  const l = LINES[id];
  const hits = l.words.filter((w) => norm(w.text) === norm(word));
  if (!hits[nth]) throw new Error(`word "${word}" (#${nth}) not in line ${id}`);
  return hits[nth].start - l.start;
}

export const LEAD = { create: 0.5, tag: 0.5, search: 0.5, tags: 0.4 };

export default async function (demo) {
  let c0 = 0, id = '';
  const until = async (t) => { if (t > demo.t + 1e-6) await demo.wait(t - demo.t); };
  const at = (word, nth = 0, dt = 0) => c0 + LEAD[id] + wordAt(id, word, nth) + dt;
  const lineEnd = () => c0 + LEAD[id] + LINES[id].slot.duration;
  async function chapter(key, title) { id = key; await demo.chapter(title); c0 = demo.t; await demo.note(`voice:${key}@${(c0 + LEAD[key]).toFixed(3)}`); }
  async function clickOn(sel, t, move = 0.6) { await until(t - move); await demo.click(sel, { move }); }

  // The narration says "Command K" and the composition draws ⌘ keycaps. Tidepool picks its shortcut
  // labels and modifier from navigator.platform (Ctrl on Windows/Linux), so present a Mac platform to
  // the page: the recording then looks and behaves the same on every OS (Meta+K sets metaKey everywhere).
  await demo.page.addInitScript(() => Object.defineProperty(Navigator.prototype, 'platform', { get: () => 'MacIntel' }));
  await demo.goto('/?reset=1&theme=light&mode=split');
  await demo.waitFor(() => document.documentElement.classList.contains('is-ready'));
  await demo.moveTo({ x: 700, y: 560 }, { duration: 0.1 });
  await demo.wait(0.8);                                   // establish the app, wide

  // 1. Create a note --------------------------------------------------------------------------
  await chapter('create', 'Create a note');
  // a gentle 1.2x on the button: at the click zoom (1.8) the camera is clamped to the window and the
  // button sits on the frame edge; at 1.2 the whole window width stays in frame
  await until(at('new', 0, 0.05) - 0.6);
  await demo.focus('#new-note', { zoom: 1.2, duration: 1.2 });
  await clickOn('#new-note', at('new', 0, 0.05));
  await demo.waitFor('#note-title:focus');
  await demo.moveTo({ x: 960, y: 120 }, { duration: 0.5 });   // park the pointer beside the title (the camera follows it)
  await until(at('type', 0, 0.05));
  // typing without a target logs no box, so tell the camera where to look (title + first lines)
  await demo.focus({ x: 720, y: 150 }, { zoom: 1.7, duration: 5.3 });
  await demo.type(null, 'Weekend coast trip', { cps: 14, hold: 0.1 });
  await until(at('enter', 0, 0.05));
  await demo.press('Enter', { hold: 0.2 });
  await until(at('start', 0));
  await demo.type(null, '- [ ] Rain jacket', { cps: 15, hold: 0.05 });
  await demo.page.keyboard.press('Enter');                // the list continues itself: "- [ ] "
  await demo.wait(0.15);
  await demo.type(null, 'Tide table', { cps: 14, hold: 0.1 });
  await demo.waitFor(() => document.querySelector('#save-label')?.textContent === 'Saved on this device');
  await until(at('saves', 0, -0.7));
  await demo.moveTo({ x: 1060, y: 778 }, { duration: 0.7 });            // point at the save label without covering it
  // no camera hint here: the camera pulls back to the whole window (the note in the list, its title and body,
  // and the save label in the app's bottom-right corner); the composition adds a callout on the label
  await until(lineEnd());

  // 2. Tag it ------------------------------------------------------------------------------------
  await chapter('tag', 'Tag it');
  await clickOn('#tag-input', at('field', 0));
  await until(at('type', 0, 0.05));
  await demo.type(null, 'travel', { cps: 12, hold: 0.1 });
  await until(at('enter', 0, 0.05));
  await demo.press('Enter', { hold: 0.2 });
  await demo.waitFor('.chip[data-tag="travel"]');
  await until(at('sidebar', 0, -0.9));
  // park the pointer just past the new chip's bottom-right corner (the chip is 110-174 x 550-574), not on its label
  await demo.moveTo({ x: 178, y: 574 }, { duration: 0.75 });
  await demo.focus('.tag[data-tag="travel"]', { zoom: 1.9, duration: 1.42 });   // short: wide again before 'Find it'
  await until(lineEnd());

  // 3. Find it -----------------------------------------------------------------------------------
  await chapter('search', 'Find it');
  await clickOn('.note-item[data-id="q4-planning"]', at('any', 0, 0.1));
  await until(at('command', 0, 0.2));
  await demo.press('Meta+K', { hold: 0.2 });
  await demo.waitFor('#palette-input:focus');
  await demo.focus({ x: 640, y: 200 }, { zoom: 1.8, duration: 5.2 });
  await until(at('type', 0, 0.05));
  await demo.type(null, 'jacket', { cps: 11, hold: 0.1 });
  await until(at('matches', 0, -0.3));
  const box = async (sel) => demo.page.locator(sel).first().boundingBox();
  const m = await box('.palette-item.is-selected .pi-sub mark');
  await demo.moveTo({ x: m.x + m.width * 0.5, y: m.y + m.height + 5 }, { duration: 0.8 });   // point under the highlighted match
  await until(at('press', 0, -1.0));
  const ti = await box('.palette-item.is-selected .pi-title');
  await demo.moveTo({ x: ti.x + 190, y: ti.y + ti.height * 0.6 }, { duration: 0.7 });       // beside the title (not over it)
  await until(at('matches', 0, -0.2));
  await until(at('enter', 0, 0.05));
  await demo.press('Enter', { hold: 0.2 });
  await demo.focus({ x: 760, y: 150 }, { zoom: 1.5, duration: 1.8 });   // back in the note
  await until(lineEnd());

  // 3b. Search by tag ----------------------------------------------------------------------------
  await chapter('tags', 'Search by tag');
  await until(at('start', 0, -0.2));
  await demo.press('Meta+K', { hold: 0.2 });
  await demo.waitFor('#palette-input:focus');
  await demo.focus({ x: 640, y: 180 }, { zoom: 1.8, duration: 2.9 });
  await until(at('hash', 0, -0.05));
  await demo.type(null, '#travel', { cps: 11, hold: 0.1 });
  await demo.wait(0.7);
  await demo.press('Enter', { hold: 0.2 });
  await demo.waitFor(() => document.querySelector('.tag[data-tag="travel"]')?.classList.contains('is-active'));
  await demo.wait(2.4);                                   // wide: filtered list + active sidebar tag
  await demo.moveTo({ x: 900, y: 600 }, { duration: 0.8 });
  await demo.wait(3.2);                                   // wide tail under the recap
}
