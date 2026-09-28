# 04 · Tutorial: create, tag and find a note in Tidepool

A 50.5 second, 1920x1080 narrated tutorial recorded from a real, running web app. Every click and
keystroke in it happened in a browser, and each one lands on the word of narration that names it.

- **Video:** [`final.mp4`](https://github.com/FavioVazquez/showtime-examples/releases/download/examples-media-v1/04-tutorial-tidepool--final.mp4) (18.3 MB, H.264 + AAC; re-rendered for the stricter check, see "Re-render" at the end of the review round), poster [`poster.jpg`](poster.jpg),
  captions sidecar [`final.srt`](final.srt), post copy [`share.txt`](share.txt)
- **App:** Tidepool, a **fictional** local-first notes app that exists only as demo material
  (`examples/_apps/tidepool`). It is not a real product and has no ties to any real company with a similar name.

## The request

> Make a 40-60 second tutorial showing how to create a note, tag it and find it with search in Tidepool.
> Real app via `showtime demo record --serve`, auto-zoom on clicks, keystroke overlays, step titles,
> calm music bed, Kokoro narration. 1920x1080. Quick mode.

**Mode:** quick. Assumptions stated up front, not asked:
50.5 s at 16:9 and 30 fps, voice `af_heart` (Kokoro, `tutorial` style), a composed `lofi-chill` bed ducked
under the voice, captions as a sidecar rather than burned in, YouTube loudness (-14 LUFS, -1 dBTP).

## What it demonstrates

- **Voice first, then the recording.** The narration is synthesized before anything is recorded.
  `walkthrough.mjs` reads `project/voice/timeline.json` and uses a small `wordAt(line, word)` helper to
  place each action on its word. For example, the ⌘K press lands on "Command K" and Enter lands on "Enter".
  The picture never runs ahead of the voice.
- **`showtime demo record --serve`** drives the real app (`?reset=1&theme=light`) at 1280x800 CSS and
  DPR 2. It records frames plus `events.json` (clicks, keys, typing, chapters).
- **`showtime autozoom`** adds the camera (spring zooms on clicks, pans between nearby shots), a
  synthetic cursor with click ripples, all on the brand teal gradient. `demo.focus()` hints steer the camera
  wherever typing has no target box, keep it gentle on the New note button, and let it pull back wide for the
  save status and before "Find it". Its own keycaps are off (`--keys off`): the composition draws them.
- **An HTML composition** (`project/index.html`) around the recording:
  - a result-first hook (the "jacket" search, played from 24.1 s into the recording) that is fully composed
    from frame 0, so the poster baked into frame 0 is the same picture as frame 1; the voice underlines
    Write / Tag / Find as it says them, and the card grows into the full-frame walkthrough;
  - step cards on the recording's chapter markers (Step 1-3, plus a "Search by tag" tip), bottom-left;
  - keycaps (`Enter`, `⌘ K`, the app's own notation) on the recording's key events, bottom-right, outside the
    open palette;
  - a "Saved on this device" callout pointing at the app's small save label while the voice says it;
  - a slow push-in where the palette would otherwise hold still;
  - an end card whose three moves appear on the recap line; the walkthrough shrinks back into a card over it.
- **Audio:** six voice lines placed at chapter time + lead, a composed bed ducked 11 dB (voice sits
  18.2 dB above the music), and soft procedural UI clicks and key clicks on the recorded clicks and keypresses.

## Commands, in order

All commands go through `skills/showtime/bin/showtime`. Paths are shortened; `<job>` is
`showtime-out/tidepool-tutorial-20260926-134400`.

```bash
showtime doctor --quick
showtime job init tidepool-tutorial --goal "Make a 40-60 second tutorial ..." --platform youtube
showtime voice ipa "Tidepool"                                   # check the name is said right
showtime voice script <job>/project/narration.md -o <job>/project/voice
showtime demo init <job>/walkthrough.mjs                        # then written by hand (see file)
showtime demo record <job>/walkthrough.mjs <job>/rec5 --serve examples/_apps/tidepool
showtime autozoom <job>/rec6 --plan --json --bg "#073f48,#0e8a8c" --keys off   # read the shots first
showtime autozoom <job>/rec6 --bg "#073f48,#0e8a8c" --keys off
showtime footage scenes <job>/rec6/autozoom.mp4 --every 1.5     # contact sheet of the zooms
cp <job>/rec6/autozoom.mp4 <job>/project/media/walkthrough.mp4
showtime audio compose --style lofi-chill --dur 50.5 \
    --sections 0:intro,5.8:verse,25.1:verse,42.5:outro --no-sfx -o <job>/project/audio/bed.wav
showtime audio mix <job>/project/audio/mix.json -o <job>/project/audio/mix.wav
showtime check <job>/project
showtime snap <job>/project --every 1
showtime snap <job>/project --at 0.3,1.2,4.6,5.95,6.2,6.6,26.5,30.6,46 --width 1280 --format jpg
showtime render <job>/project --job <job>                       # final-5.mp4 after four fix rounds
showtime captions <job>/project/voice/captions.words.json --style clean --size 1920x1080 \
    -o <job>/work/caps.ass --srt <job>/final.srt
showtime qa <job>
showtime deliver exports <job> --targets linkedin               # CRF 20 re-encode: 44.5 MB -> 16.9 MB
showtime qa <job>/exports/final-5.linkedin.mp4 --project <job>/project --captions <job>/final.srt --platform youtube
showtime review-pack <job>
showtime job note <job> --stage deliver ...
```

It took five recordings to get here. Iterations 2-4 added camera hints for typing and parked the
pointer beside the title so the camera stays on the title rather than the button. They also reframed
the "saves on this device" shot. Iteration 5 moved the pointer to the highlighted match so the palette
never holds still. There were three final renders: after the first, qa flagged two still holds
(3.8 s on the palette and 2.9 s on the end card), which the push-in and the drifting tide lines on the
end card fixed. The third render staggered the end card's fade, which review-pack round 1 had shown as
a double exposure. The fourth and fifth renders applied two rounds of outside review (see "Review round" below). `rec6` is
`rec5`'s frames with the camera hints now in `walkthrough.mjs` (a New note hint, no zoom on the save status,
a shorter hint on the sidebar tag) written into a copy of its `events.json`, so the take was not recorded again.
In the last round the pointer parked on the new `# travel` tag was moved just past the chip's corner the same
way (the per-frame `cursor` track in that copy), and `walkthrough.mjs` now parks it there too.

### Rebuilding it

This folder ships the source, not the generated media. To rebuild, place `walkthrough.mjs` next to
`project/` (as here) and do the following:

1. Run `voice script project/narration.md -o project/voice`. Line clips come back from the TTS cache when
   they are unchanged.
2. Run `demo record walkthrough.mjs rec --serve ../_apps/tidepool`, then
   `autozoom rec --bg "#073f48,#0e8a8c" --keys off --hints camera-hints.json`. `--keys off`: the
   composition draws the keycaps. `camera-hints.json` keeps the push-in on the title and the first list
   lines (see "Re-render" below). If `rec/autozoom.mp4` already exists, autozoom writes `autozoom-2.mp4`.
3. Copy `rec/autozoom.mp4` to `project/media/walkthrough.mp4`.
4. Run the `audio compose` line above to make `project/audio/bed.wav`, then `render project`.

A fresh recording lands within a frame or two of this one, because every action waits for its narration
word, but not exactly on it. `project/audio/mix.json` hard-codes the click and key-click times (for example
`click1` at 6.6333 s) and `index.html` hard-codes the keycap times, both as recording time + 4.9 s from
`rec5/events.json`. After a new take, recompute them from the new `rec/events.json` (`click` and `key`
events, + 4.9 s for the mix, - 0.9 s for the keycaps' `data-start`) before mixing and rendering.

## Timings (this machine: 6-core Intel i5, CPU shared with three other render jobs)

| Step | Time |
|---|---|
| Voice script (6 lines, 118 words, 43.9 s of speech) | 37 s |
| `demo record` (41.9 s, 1257 frames at 2560x1600) | 1m04s - 2m10s per take |
| `autozoom` full size | 2m04s |
| `audio compose` (50.5 s bed) | 32 s |
| `check` | 55-70 s |
| Final `render` (1515 frames, 3 workers) | 3m41s - 4m44s (last: 3m41s, capture 2m55s at 8.7 fps, encode 42 s) |
| `autozoom` with `--keys off` (review rounds) | 2m35s - 3m06s |
| `deliver exports --targets linkedin` | 49 s - 1m53s |
| `qa` | 14-38 s |
| `review-pack` | 63 s |

## QA summary

The numbers in this section are for the file shipped before the re-render ("Re-render", at the end of
"Review round", has the current file's).

- `showtime qa` on the shipped `final.mp4` (export of `final-5.mp4`) gave **PASS: 0 fail, 0 warn, 0 notes**.
  - H.264 High, yuv420p, 1920x1080 30 fps, faststart, BT.709
  - 50.50 s, matching the `expect` block
  - -14.0 LUFS integrated, true peak -1.4 dBTP
  - no silent gaps, black or frozen stretches
  - 18 caption cues within limits (the shortest is 1.26 s)
  - every `must_show` text on screen
- The master `final-5.mp4` (44.5 MB at CRF 16) also passes qa: -14.0 LUFS, -1.5 dBTP. Frame 0 and frame 1
  differ by 0.3/255 on average (no poster pop).
- `showtime check` passes with 1 contrast warning, for the Step 3 card at 25.23 s. That is 0.13 s
  into the card's entrance, while it is still partly transparent. On the settled card, the badge is white
  on `#0b6f78` and the label is `#0a5961` on white. Both are above 4.5:1, which the stills at 26.5 s confirm.
- Review: `review-pack` rounds 1 and 2 were built and self-reviewed from `scenes.jpg` and `sheet.jpg`
  (round 1 found a double exposure at the end card, fixed in final-3). After that, two outside reviews were
  applied (below). The last one, on final-4, gave "ship" with Polish notes only; its fixes in final-5 were
  checked with before/after stills at the cited times, `showtime check` and `showtime qa`, not with a new
  review pack (review-pack caps at two rounds).

## Review round

An outside review of the shipped round-2 file (verdict "ship after fixes", no blockers) was applied as a
third round. Each note was checked on a still first; the log is in the job's `work/feedback.md`.

- **Should-fix, all fixed.**
  - A one-frame pop at 0.000-0.033 s (the baked poster, then a half-faded hook): the hook is now composed
    at t = 0 and `poster` is 0. Frame 0 and frame 1 now differ by 0.6/255 on average, down from 36.
  - "Saves it on this device" (12.1-14.7 s) showed no save: the camera stays wide and a callout points at
    the label.
  - Absolute local paths in `project/voice/*.json`: now relative.
- **Polish, fixed:**
  - the end-card transition, a flat dissolve with the wordmark late: the walkthrough shrinks into a card,
    and the wordmark and "New note" chip arrive on the voice;
  - keycaps over the palette: moved bottom-right, in the composition;
  - "Cmd K" against "⌘K": now ⌘ everywhere, and `share.txt` adds "Ctrl K on Windows and Linux";
  - the New note button on the frame edge;
  - the Step 3 card entering on a zoomed shot: it now enters on a wide shot, and both it and the Tip card
    leave before the palette opens;
  - sidecar cues under 1 s: merged, 24 cues down to 18;
  - no rebuild caveat about hard-coded times: added under "Rebuilding it".
- **Not changed:** the 3.3 s end card after the last word. The "fictional app" line needs its reading
  time, and the composed bed's outro ends at 50.5 s, so cutting to 49 s means composing the bed again.

### Second outside review (final-4 -> final-5)

Verdict "ship", no Blocker or Should-fix. The cheap Polish notes were checked on stills and applied:

- **End-card double exposure (42.60-42.77 s):** the wordmark and "New note" chip faded in over the still
  40%-opaque shrinking walkthrough. The shrink now starts at 42.35 s and is gone by 42.69 s; the wordmark
  starts at 42.72 s and the chip at 42.76 s ("New note" is said at 42.84 s). They no longer share a frame.
- **Overlays tight to the edge:** step cards and keycaps now sit 96 px in and 100 px up (inside a 5% safe
  margin, above the player-controls band); the disclaimer moved up to 100 px.
- **Small disclaimer:** "Tidepool is a fictional app, made for this demo." went from 22 px to 27 px.
- **Pointer on the new tag (22.6-24.0 s):** the parked pointer now sits past the `# travel` chip's corner,
  so the tag reads in full while the voice says it shows up in the sidebar.
- **This README** said no critic could be launched, which contradicted this section; reworded above.

Not changed:

- The palette's footer hint row is cropped at 27.5-29.5 s. That palette shot is also the hook's source
  and frame 0 (the poster the review picked as best), so re-aiming it would reframe the poster; the hints
  are not narrated.
- The #travel result and Enter (39.3-42.84 s) play under music only. The picture keeps moving (the list
  filters, the tag lights up, the note opens), and a new line would mean a new voice clip plus a re-timed
  mix and captions.

### Re-render: stricter check (2026-09-28)

`showtime check` was made stricter after this example shipped: contrast must reach 4.5:1 at every text
size, and readable text must be at least 2.2 % of the frame height (24 px at 1080p). On this project it
gave **FAIL**: one contrast error, **4.42:1** for "Write it." in the hook (0:02.80: the teal "it."
`#6fd0c8` over the lit corner of the ground, `#0a5960`), and three size warnings for the 18 px labels
on the step cards ("STEP 1 OF 3", "STEP 3 OF 3", "TIP").

- **Changes (index.html):** the hook's "it." is `#8fdcd5`, a lighter teal (5.1:1 there); the
  step-card label `.step .k` is 26 px (was 18 px; letter-spacing .14 -> .12em). At 24 px the check still
  measured 23 px while the card scales in, so 26 px leaves room.
- **Media rebuilt:** this folder ships the source only, so everything under "Rebuilding it" was run
  again on a Linux x64 machine (32 cores): the voice lines (Kokoro, 11 s; line starts within 10 ms of the
  shipped `timeline.json`), the bed (`audio compose`, 11 s), a new `demo record` take (2 min 48 s; it is
  paced in real time) and `autozoom` (41 s). The new take's clicks and keys landed on exactly the times
  hard-coded in `audio/mix.json` and `index.html`, so no times changed.
- **Two things a rebuild on Linux or Windows needs**, both now in this folder:
  - Tidepool picks its shortcut labels and modifier from `navigator.platform` (Ctrl on Windows and
    Linux). On Linux the first take stopped at `Meta+K` (the palette never opened) and the app would
    have shown "Ctrl K" while the voice says "Command K". `walkthrough.mjs` now presents a Mac platform
    to the page, so the take looks and behaves the same on every OS.
  - The recorder now logs the focused editor's box for typing without a target. That capped the
    camera at x1.15 while the title and the first list lines were typed (x1.7 in the shipped cut).
    `camera-hints.json` (`autozoom --hints`) drops those typing actions and restores the
    `demo.focus()` push-in of the take; before/after stills at 7.6, 9.5, 11.2 and 13.5 s match the shipped
    framing.
- **check:** PASS, 0 errors, 0 warnings (notes: the Step 3 badge and label measured mid-entrance at
  0:25.23; settled, both are above 4.5:1).
- **Render:** 1 min 56 s for 1515 frames (capture 1 min 47 s at 14.1 fps, encode 7.4 s), 53.7 MB CRF 16
  master; `deliver exports --targets linkedin` (9 s) -> 18.3 MB, which is `final.mp4`. On the 6-core Mac
  the final renders took 3 min 41 s - 4 min 44 s and `autozoom` 2 min 35 s - 3 min 6 s.
- **qa** on `final.mp4` with `final.srt` and the project: PASS (0 fail, 0 warn, 0 note), 50.50 s,
  -14.0 LUFS, -1.4 dBTP, 18 caption cues, every `must_show` on screen. `final.srt` is unchanged: the
  rebuilt voice lines start within 10 ms of the shipped timing.
- **Review:** `review-pack` on the new master, then a self-review of the contact sheet, the cut strips
  and the full-size text crops, plus before/after stills against the previously shipped file at 0.5,
  7.6, 9.5, 11.2, 13.5, 17.9, 23.6, 29.5 and 38.9 s (no separate critic ran). No new findings. Visible
  differences: the larger step labels and the lighter "it."; from about 36 s the new note's list entry shows
  a clock time ("01:49") where the shipped cut showed "Just now". The app reads the real clock, and this
  take took 2 min 48 s of wall time for 41.9 s of video, so the note was over a minute old by then.

### Critic review of the re-render (2026-09-28)

A separate critic reviewed the re-rendered file: ship after fixes. Audio matched the earlier file
(lag 0 ms, correlation 0.99).

- **Should-fix, qa FAIL:** `must_show "Create a note" was not found`. The card is on screen from about
  6.7 to 10.0 s. The check report qa read was older than the project files, and it came from a copy
  without the recording. **Change:** `showtime check` was run again on the project with its media
  (PASS, 0 errors, 0 warnings, 2 notes for the Step 3 badge measured during its entrance). `final.mp4`
  is unchanged. **qa** on it with `final.srt` and the project: PASS (0 fail, 0 warn, 0 note), every
  `must_show` found ("Create a note" 6.73-10.00 s). A scan of every pair of consecutive frames found no
  one-frame flash.
- **Polish, not changed: the "01:49" clock.** From about 36 s the "Weekend coast trip" note shows
  "01:49" in the list and in the palette's Recent list, where it said "Just now" until about 29.5 s.
  The app reads the real clock during the take (see "Re-render" above). Fixing it means a new take with
  a frozen clock, not an edit of this one, and an overlay over app UI is not acceptable here, so it stays.

## Sources and licenses

- **Tidepool app, logo and seed notes:** fictional demo material in this repo (`examples/_apps/tidepool`).
- **Inter** (`project/fonts/inter`): SIL Open Font License 1.1, installed with `showtime assets font`.
- **Icons** (plus, hash and command, inlined as SVG paths): Lucide, ISC license.
- **Narration:** synthetic, made with Kokoro-82M v1.0 (Apache-2.0), voice `af_heart`. No real person's voice is used.
- **Music:** composed locally by `showtime audio compose` (`lofi-chill`, F, about 82 bpm); needs no credit.
- **Sound effects:** procedural `click` and `keyclick` from `showtime audio sfx`; need no credit.
- No CC-BY assets are used, so there is no `credits.txt` (qa: "no attribution required").
