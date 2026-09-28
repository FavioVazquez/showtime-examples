# Episode 02 · Find anything with search and tags

90.1 s, 1920x1080, 30 fps, 8 steps. Part of the Tidepool Basics series (see `../README.md`). It starts where
episode 01 left off: the "Offsite ideas" note is there, pinned, tagged `#planning` and filed in Work.

| File | What | Size |
|---|---|---|
| `final.mp4` | H.264 + AAC, -14 LUFS, capped for sharing (`deliver exports --targets original --max-mb 20`) | 19.2 MB |
| `final.html` | one file, plays offline, narration embedded (AAC 64k), chapters, deep links | 1.27 MB |
| `poster.jpg` | frame at 26 s (search results with highlighted matches) | 192 KB |
| `captions.srt` | sidecar captions from the narration's word times (the video also draws them) | |

**Steps (the chapters):** Intro 0:00 · Open search 0:09 · Search every note 0:18 · Open a result 0:28 ·
Jump to a tag 0:34 · Step through the list 0:44 · Narrow the list 0:50 · Filter from the sidebar 0:56 ·
Run a command 1:03 · Recap 1:14.

**What it shows, all real Tidepool behaviour:**
- Cmd K opens the palette with the 5 most recent notes.
- "export" finds Q4 planning draft (3 body matches) above Standup (1), with the app's highlighted snippets.
- Down then Enter opens Standup.
- `#pl` lists `#planning` (3 notes) and `#templates` (1). Enter filters the list to #planning, and the first
  note becomes active.
- J, J and K step through the list.
- "week" in Filter this list leaves 2 notes: the Weekly review title and Q4's "This week" section. Esc clears the filter.
- The Reading notebook and then All notes, from the sidebar.
- `>dark` finds "Toggle light / dark theme", and Enter switches the whole app to its dark tokens.

## Build

From the series folder:

```bash
showtime voice script episode-02/narration.md -o episode-02/voice
node vo-cues.mjs episode-02
showtime series sync .
showtime check episode-02
showtime render episode-02 -o ep02.mp4                               # master, CRF 16 (102 MB)
showtime qa ep02.mp4 --project episode-02 --platform youtube
showtime deliver exports ep02.mp4 --targets original --max-mb 20
showtime deliver poster ep02.mp4 --at 26 --out episode-02/poster.jpg
showtime export html episode-02 -o episode-02/final.html --audio embed --bitrate 64k
```

## Results

- `showtime check`: PASS, 0 errors, 25 warnings: 6 are contrast in the app's own design (as in episode 01, plus
  the `+` between recap keycaps), 19 are `short_text` from the app moving (J and K show each note's body for
  about 1.3 s; the filter redraws its highlighted fragments with every letter typed). No callout hides text,
  none points off the frame or runs off it.
- `showtime qa` on the master and on `final.mp4` (with captions): **PASS, 0 warnings**. That covers duration
  90.13 s, -14.1 LUFS, -1.4 dBTP, and 37 caption cues.
- The bed sits 18.1 dB under the voice while it speaks.
- The HTML opens from `file://` with the network off: 0 requests, no errors, ready in 0.75 s, and playback runs.
  Chapter keys 3, 5, 1, `]` and `[` work. After a seek to 45 s, between two lines, the sound resumes in sync
  (within 50 ms).
- Render: 2m21s for 2704 frames.
