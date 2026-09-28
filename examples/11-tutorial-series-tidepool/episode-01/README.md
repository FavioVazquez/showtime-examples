# Episode 01 · Capture a note in seconds

92.4 s, 1920x1080, 30 fps, 7 steps. Part of the Tidepool Basics series (see `../README.md`).

| File | What | Size |
|---|---|---|
| `final.mp4` | H.264 + AAC, -14 LUFS, capped for sharing (`deliver exports --targets original --max-mb 20`) | 19.2 MB |
| `final.html` | one file, plays offline, narration embedded (AAC 64k), chapters, deep links | 1.29 MB |
| `poster.jpg` | frame at 40.5 s (the three-item checklist, its split preview lit by a spotlight) | 165 KB |
| `captions.srt` | sidecar captions from the narration's word times (the video also draws them) | |

**Steps (the chapters):** Intro 0:00 · Start a note 0:12 · Give it a title 0:17 · Write in Markdown 0:25 ·
See it rendered 0:37 · Tag it and file it 0:47 · It saves on this device 0:58 · Pin it to the top 1:09 ·
Recap 1:20. Open the HTML at `final.html#chapter=4` to land on "Write in Markdown", or press 1-9.

**What it shows, all real Tidepool behaviour:**
- N makes an Untitled note in Inbox, puts it second in the list under the pinned Welcome note, and focuses the title.
- Enter moves to the body. `- [ ] ` makes a task, and Enter continues the list.
- The split preview renders as you type. Cmd E flips to the full preview and back.
- Add tag + Enter creates the `#planning` chip, and the sidebar count goes up. The notebook select moves the note to Work.
- The status bar reads "Saving…" and then "Saved on this device". The sidebar says "Sync: local only".
- Esc leaves the editor. P pins the note, and it slides to the top of the list.

## Build

From the series folder (`examples/11-tutorial-series-tidepool`):

```bash
showtime voice script episode-01/narration.md -o episode-01/voice   # Kokoro af_heart, tutorial style
node vo-cues.mjs episode-01                                          # voice timeline -> vo.js
showtime series sync .
showtime check episode-01
showtime render episode-01 -o ep01.mp4                               # master, CRF 16 (97 MB)
showtime qa ep01.mp4 --project episode-01 --platform youtube
showtime deliver exports ep01.mp4 --targets original --max-mb 20
showtime deliver poster ep01.mp4 --at 40.5 --out episode-01/poster.jpg
showtime export html episode-01 -o episode-01/final.html --audio embed --bitrate 64k
```

The voice `.wav` files are not shipped. The first command rebuilds them from the script, and
`audio/mix.json` needs `voice/vo.wav` before a render or an embedded export.

## Results

- `showtime check`: PASS, 0 errors, 12 warnings. All 12 are contrast in the app's own design (white on the teal
  New note button at 4.0:1, the teal counts on the active sidebar row, the `#` in tag chips). No callout hides
  text, none points off the frame, and no text overlaps.
- `showtime qa` on the master and on `final.mp4` (with `--captions captions.srt`): **PASS, 0 warnings**.
  That covers duration 92.40 s, -14.0 LUFS, -1.2 dBTP, and no black, frozen or silent stretches. There are 34 caption cues.
- The bed sits 18.5 dB under the voice while it speaks, measured on lines without UI sounds.
- The HTML opens from `file://` with the network off: 0 requests, no errors, the start screen in 0.75 s, and playback
  runs. Keys 3, 5, 1, `]` and `[` jump to their chapters. After a seek to 64.2 s, into a held pad between two
  lines, the sound resumes in sync (within 50 ms).
- Render on this machine (Intel i5-8500, CPU shared): 2m27s for 2772 frames (capture 58 s, encode 59 s,
  score offline about 2 min in parallel).
