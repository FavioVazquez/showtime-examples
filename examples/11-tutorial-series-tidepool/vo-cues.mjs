// Narration timeline -> vo.js for each episode (run after `showtime voice script`).
//
//   node vo-cues.mjs                 # every episode-NN/voice/timeline.json -> episode-NN/vo.js
//   node vo-cues.mjs episode-02      # one episode
//
// vo.js holds only what the film needs: each line's times and its words as [text, start, end].
// episode.js turns it into cue times with KIT.voice(VO_DATA).at('line', 'word'), so every click, key
// and camera move lands on the word that names it, and the captions are the spoken words.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const r3 = (x) => Math.round(x * 1000) / 1000;
const want = process.argv.slice(2);
const episodes = fs.readdirSync(root).filter((d) => /^episode-\d+$/.test(d) && (!want.length || want.includes(d))).sort();
if (!episodes.length) { console.error('no episode folders found'); process.exit(1); }

for (const ep of episodes) {
  const tl = path.join(root, ep, 'voice', 'timeline.json');
  if (!fs.existsSync(tl)) { console.error(`${ep}: no voice/timeline.json (run: showtime voice script ${ep}/narration.md -o ${ep}/voice)`); process.exitCode = 1; continue; }
  const t = JSON.parse(fs.readFileSync(tl, 'utf8'));
  const data = {
    duration: r3(t.duration),
    lines: t.lines.map((l) => ({
      id: l.id, start: r3(l.start), end: r3(l.end), speech_start: r3(l.speech_start), speech_end: r3(l.speech_end),
      words: l.words.map((w) => [w.text, r3(w.start), r3(w.end)]),
    })),
  };
  const out = path.join(root, ep, 'vo.js');
  // (no file names in this header: the HTML export packs files that page scripts name)
  const body = `/* Narration timeline of ${ep}, generated from its voice script output: do not edit.\n` +
    ` * Change the words in the narration script, run \`showtime voice script\`, then the vo-cues script. */\n` +
    `var VO_DATA = ${JSON.stringify(data)};\n`;
  fs.writeFileSync(out, body);
  console.log(`${ep}/vo.js  ${data.lines.length} lines, ${data.duration.toFixed(1)} s of narration`);
}
