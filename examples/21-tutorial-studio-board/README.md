# 21 · Tutorial of a real app: picking a direction on a showtime studio board

![poster](poster.jpg)

**Tutorial (16:9):** [`final.mp4`](https://github.com/FavioVazquez/showtime-examples/releases/download/examples-media-v1/21-tutorial-studio-board--final.mp4) · 1920x1080 · 30 fps · 75.00 s · 18.0 MB · -16.0 LUFS / -3.8 dBTP ·
captions as sidecars [`captions.srt`](captions.srt) and [`captions.vtt`](captions.vtt) (not burned)
**Shorts cut (9:16):** [`final-9x16.mp4`](final-9x16.mp4) · 1080x1920 · 30 fps · 28.47 s · 8.2 MB · -16.0 LUFS /
-4.0 dBTP · captions burned (bold-pop) · poster [`poster-9x16.jpg`](poster-9x16.jpg)

Both are `deliver exports` copies of the masters (`--targets youtube --max-mb 19` for the 27 MB 16:9 master,
`--targets shorts` for the vertical), with `--no-loudnorm` so the tutorial's -16 LUFS stays. No HTML page was
exported: the brief did not ask for one.

## The request

> "Record a 75-second narrated tutorial showing how to use the showtime studio board: open it, compare concepts,
> react, pick one, and send feedback. And a vertical cut for Shorts."

**Mode:** quick. The app is showtime itself, so nothing needed asking. Opening line (the assumptions):

> Quick mode: a 75 s 16:9 tutorial recorded live on a copy of example 20's first studio board, narrated by
> bf_emma over a low acoustic-folk bed, -16 LUFS, plus a ~30 s vertical Shorts cut of steps 2-4.

**Contract:** in four steps you open a studio board, compare concepts with their frames and music sketches, leave a
reaction and a note, and send the pick back to Claude, who then continues from your choice.

**The app under test** is a *copy* of example 20's studio job at its round-1 board (four concepts: C1 Velvet
curtain, C2 Marquee, C3 Spotlight, W1 Arcade marquee, each with its style frames and a 10 s music sketch), made
by [`project/make-board-demo.py`](project/make-board-demo.py) into a separate `board-demo` job. The reactions
recorded here (a like, a note, the pick) land in the copy's `feedback.json`; example 20's decisions are untouched.
The reviewer's note ("Love the curtain; slower reveal?") is a demo line typed for the tutorial.

**Token hygiene.** The board runs on 127.0.0.1 with a key in its link. The recording captures the page only (no
address bar); the key reached the demo script through an environment variable (`BOARD_URL`), never a file; the
`studio open` card shows the real output with the key replaced by dots and labelled "key hidden"; `events.json`
(which logs the navigated URL) is not shipped; every file in this folder was searched for the key before publishing.

## The story (16:9)

Voice first: the narration was built with `voice script --fit 73`, and its `timeline.json` set every hold in the
demo script (`demo.wait` via an `at(t)` helper), so each click, key and scroll lands on the word that names it.
The recording's clock is the output time minus 11.333 s. Full table: [`project/storyboard.md`](project/storyboard.md).

| Time | Chapter | Picture | Its job |
|---|---|---|---|
| 0-4.6 s | preview | The recording's own last seconds: C1 with its PICKED tag, then the note in "Your feedback" | Outcome first: what you will have done |
| 4.6-11.3 s | open | Terminal card: `showtime studio open board-demo` types on "Claude runs", real output, key masked | How you get there |
| 11.3-19.6 s | open | Hard cut to the board on "The link opens the board"; the cards scroll in on "Each concept is a card" | What a concept card holds |
| 19.6-37.4 s | compare | Three thumbnail clicks; play and stop C1's music sketch (you hear the sketch file between the two clicks); Compare's wipe dragged both ways | Comparing is what the board is for |
| 37.4-52.3 s | react | Click the C1 card, `L` (heart fills), `C`, type the note, `Ctrl+Enter` (keycaps are real board shortcuts); the camera lands on "Feedback 2" | Feedback is data the director reads |
| 52.3-66.8 s | pick | Pick on C1 (toast "Picked C1"), `.` (keycap ". full stop") opens "Your feedback"; the camera eases wide and stays wide; then the director's terminal: `showtime studio feedback board-demo`, the pick and the note highlighted as the voice names them | Close the loop: the pick reaches the director |
| 66.8-75 s | recap | "four steps" checklist ticks on each word; the full guide `references/studio.md`; the showtime lockup | Retention and the next step |

Only real UI is narrated: every control and shortcut exists on the board (`runtime/studio/board.js`); the style
frames are stepped with the thumbnails (the board has no full-size frame view, so the tutorial does not claim one).
Spot-check of action vs word (the brief's ±0.3 s): thumbnail click 21.23 s vs "Click" 21.33 s; play 25.50 s vs
"play" 25.56 s; `L` 39.43 s vs "L" 39.20 s; `Ctrl+Enter` 47.37 s vs "Enter" 47.42 s; Pick 53.63 s vs "Pick" 53.84 s.

**Shorts cut:** steps 2-4 only, eight ranges of the same recording through the vertical follow-cam
(`autozoom --look plain --size 1080x1920 --fit cover`), a separate 28 s narration, each range placed so its
action lands on its word ([`project/shorts/ranges.json`](project/shorts/ranges.json)), step chips on top, bold-pop
captions burned, and a 2.2 s end card.

## Commands, in order

```bash
showtime doctor --quick
showtime job init studio-board-tutorial --goal "..." --platform youtube
# the app under test: a copy of example 20's round-1 board
showtime job init board-demo --mode studio --goal "Copy of example 20's round-1 board"
showtime studio init board-demo
python project/make-board-demo.py <example-20 job> <board-demo job>
showtime studio board board-demo
showtime studio open board-demo                       # prints the local link with its key
# voice first
showtime voice script <job>/narration.md -o <job>/voice --fit 73
showtime transcribe <job>/voice/vo.wav --edit-dir <job>/work/vo-check     # the voice read back word for word
# record (draft takes at --dpr 1; the board's feedback.json was reset between takes)
showtime demo init walkthrough.mjs
BOARD_URL="<the printed link>" showtime demo record <job>/walkthrough.mjs <job>/rec --dark
showtime studio feedback board-demo                   # the real digest shown in the pick step
showtime autozoom <job>/rec --preview                 # drafts, read with snap sheets
showtime autozoom <job>/rec --bg "#2a1d18,#15100E" --hints project/hints.json
showtime autozoom <job>/rec --look plain --size 1080x1920 --fit cover --bg "#2a1d18,#15100E" \
    --max-zoom 1.3 --cursor-offset 45.6-60.5:480,-60 --hints project/hints-9x16.json -o <job>/rec/autozoom-9x16.mp4
# (the hints files also drop the recorded "." key and re-add it labelled ". full stop", as the voice names it)
# overlays: a small DOM project in the brand kit (SHOWTIME_BRAND=assets/brand/brand.json showtime brand css > brand.css)
cd project/overlays
showtime check . --page steps.html                    # and open/feedback/recap
showtime render . --page open.html  --no-audio -o open.mp4
showtime render . --page recap.html --no-audio -o recap.mp4
showtime render . --page steps.html    --alpha webm --no-audio -o steps.webm
showtime render . --page feedback.html --alpha webm --no-audio -o feedback.webm
cd ../overlays-9x16
showtime render . --page chips.html --alpha webm --no-audio -o chips-9x16.webm
showtime render . --page end.html --no-audio -o end-9x16.mp4
# music
showtime audio compose --style acoustic-folk --dur 75 --key D --sections 0:intro,4.57:verse,37.5:chorus,66.8:outro --no-sfx -o <job>/audio/bed-folk.wav
showtime audio compose --style acoustic-folk --dur 28.4667 --key D --sections 0:intro,10.35:verse,26.27:outro --no-sfx -o <job>/audio/bed-folk-short-2.wav
# captions: the voice words on the output timeline (+0.4 s; +0.28 s from the pick line on)
showtime captions <job>/edit/vo.out.words.json --style clean --size 1920x1080 -o <job>/edit/caps.ass --srt <job>/final.srt --vtt <job>/final.vtt
# assembly (EDL)
showtime edit check <job>/edit/edl.json
showtime edit render <job> --preview
showtime edit view <job>
showtime edit render <job>/edit/edl.json -o <job>/final.mp4
# Shorts
showtime voice script <job>/shorts/narration.md -o <job>/shorts/voice
showtime captions <job>/edit/vo-9x16.out.words.json --style bold-pop --size 1080x1920 -o <job>/edit/caps-9x16.ass --srt <job>/final-9x16.srt
showtime edit check <job>/edit/edl-9x16.json
showtime edit render <job>/edit/edl-9x16.json -o <job>/final-9x16.mp4
# verify and deliver
showtime qa <job>/final.mp4 --platform youtube --lufs -16 --captions <job>/final.srt
showtime deliver poster <job>/final.mp4 --at 0
showtime deliver poster <job>/final-9x16.mp4 --at 19.1
showtime review-pack <job>/final.mp4 --platform youtube
showtime deliver exports <job>/final.mp4 --targets youtube --max-mb 19 --no-loudnorm
showtime deliver exports <job>/final-9x16.mp4 --targets shorts --no-loudnorm
showtime qa <job>/exports/final.youtube-19mb.mp4 --platform youtube --lufs -16 --captions <job>/final.srt
showtime qa <job>/exports/final-9x16.shorts.mp4 --platform shorts --lufs -16 --captions <job>/final-9x16.srt
showtime studio stop board-demo
```

`project/` mirrors the job folder: `edit/edl.json` points at `../rec/`, `../media/`, `../voice/` and `../audio/`,
which the commands above regenerate (the recording, renders and audio are not shipped).

## Features shown

- **`demo init` / `demo record --url`** on a real app (the studio board served on 127.0.0.1), timed from
  **`voice script --fit 73`** (`timeline.json` → the demo's holds).
- **`autozoom`** framed (brand-coloured ground) and the **plain 9:16 follow-cam** (`--fit cover`), with
  `--hints` (a push-in during "side by side"; the typing shot re-framed for vertical) and `--cursor-offset`.
- **EDL assembly**: `edit check`, `edit render --preview`, `edit view`, the final; four ranges (the preview is the
  recording's own tail), two **alpha overlays** (`render --alpha webm` from a small DOM project: `lower-third` +
  `steps` step chips, the director's terminal), a composed bed with a gain dip, the concept's music sketch as an
  audition track, keystroke and click effects from `events.json`.
- **Studio commands on screen:** `studio open` (real output, key masked) and `studio feedback` (the real digest of
  this recording's board).
- **Captions:** SRT + VTT sidecars (clean) for 16:9; bold-pop burned for Shorts.
- **`share.txt` chapters** (four, first at 0:00, each at least 10 s), `qa --lufs -16`, `deliver exports --targets
  youtube,shorts`, the **brand kit** for the cards (`showtime brand css`, Fraunces 900, Spotlight gold on Stage).
- **Crew:** storyboard artist and critic. This session had no sub-agent tool, so the director did both passes
  from their briefs and labels them: [`project/storyboard.md`](project/storyboard.md) and
  [`review/FINDINGS.md`](review/FINDINGS.md) (a self-review; a second look by a person is still worth having).

Not shown on purpose: the drawn `new tutorial` path. The app runs, so recording it is the recommended path
(`references/workflows/tutorial.md`); the drawn template stays covered by its template tests.

## QA

| File | Verdict | Loudness | Notes |
|---|---|---|---|
| `final.mp4` (16:9 export) | **WARN** (0 fail) | -16.0 LUFS, -3.8 dBTP | 2 "frozen" holds, justified below (the master has 1) |
| `final-9x16.mp4` (Shorts export) | **PASS** | -16.0 LUFS, -4.0 dBTP | |

The holds qa flags are typing beats: 43.9-47.4 s (the note being typed in the comment box) and, in the
size-capped export only, 60.2-63.1 s (the director's command typing over a slow push). The motion is real but
falls under qa's -50 dB freeze threshold at 320 px. The round-1 hold at 5.3-8.5 s is gone: the command now
starts typing at 5.3 s. Five caption cues read faster than 20 characters/s at first; their boundaries were
moved by 0.15-0.4 s (sidecars only), and qa now passes them. Both files are tagged BT.709 (a product fix made
during this example, see below). Review pack: round 1, self-review verdict "ship" ([`review/FINDINGS.md`](review/FINDINGS.md),
the pack's contact sheet in [`review/sheet.jpg`](review/sheet.jpg)), then an independent critic pass (below).

## Review round 2

An independent critic judged the round-1 files: "ship after fixes", no blockers. Every should-fix and the cheap
polish items were applied, each checked with a snap at the cited time:

- **Muddy end of the pick step (66.3-66.8 s):** the camera no longer moves under the director's terminal. The
  C1 close-up that the preview uses now starts after the step's last frame (hints), so the board stays wide to
  the cut, and the terminal leaves on a hard cut instead of fading over a moving shot. The preview starts
  0.1 s later in the recording (55.9 s) so it opens on the settled close-up.
- **The hook names the product:** the preview chip's kicker reads "showtime studio board · the result" (larger,
  24 px).
- **Chip plates were translucent:** all step chips (both videos) and the terminal label are now opaque; no UI
  text shows through, including in the Shorts poster.
- **The full-stop keycap read as a speck:** it is labelled ". full stop", as the voice says it (a product fix,
  below).
- **Short, comment box cropped at the left edge:** the vertical follow-cam frames the box at zoom 1.0, so
  "Comment", "On C1" and the Send button are all in frame.
- **Short, 2.9 s with no voice or caption while the note types:** 1.6 s of the typing and the same 1.6 s of the
  voice's pause are cut (the note's range is split; the voice plays in two parts). The Short is now 28.47 s;
  every later chip, click, caption and the bed were moved with it.
- **Short, the Pick chip covered the digest header:** the chip leaves as the digest shot starts. (Moving it
  down 150 px, as suggested, would have covered the next lines of the digest instead.)
- Polish: the bed returns by 29.4 s after the music sketch (the gap now sits at the level of the other pauses,
  about -29 LUFS momentary, instead of -35.5); the `studio open` command starts typing at 5.3 s and ends on
  "Claude runs showtime studio open"; the preview's pan ends on the whole board, so C1's PICKED tag stays in frame; the
  camera eases wide before the director's terminal rises in at 59.9 s, rather than whipping out under it.

## Product fixes made while building this example

- **autozoom planner:** actions on either side of a `demo.chapter()` or `demo.wide()` marker could merge into one
  shot (the react step's click was swallowed by the wipe shot and cut off at the wide beat); a wide during a
  shot's hold now also stops it bridging into the next. `--hints` drops no longer remove `wide` markers.
- **autozoom `--fit cover`:** the window mask stopped at the canvas edge, so a vertical follow-cam that panned to an
  action outside the canvas centre showed the background colour instead of the page. Now replicated; a test renders a
  vertical cover follow-cam and checks that no background shows.
- **edit render colour tags:** finals from sources tagged only partly (matrix known, primaries and transfer
  unknown, as autozoom writes them) came out without BT.709 primaries/transfer (qa `color_tags`); the EDL chain
  now tags its frames BT.709 after the conversion. `tests/test_footage.py` checks the tags.
- **autozoom keycaps (review round 2):** a lone punctuation key was drawn as its bare glyph, so `.` was a 5 px dot.
  Punctuation keys now carry their name (". Period"), and a key event can carry a `label` for the keycap text
  (a hints file drops the recorded key and re-adds it labelled, here ". full stop"). Documented in
  `references/tutorial-recording.md`; `tests/test_capture.py` checks both.

## Sources and licenses

- The showtime studio board (`skills/showtime/runtime/studio/`, this repository, MIT) and example 20's round-1
  board content (concepts, style frames, music sketches: project-owned, made in example 20).
- The showtime brand (`assets/brand/`, project-owned; see `assets/brand/LICENSE.md`): lockup, colours, Fraunces
  (OFL), Inter (OFL), JetBrains Mono (OFL) as installed font files.
- Voice: Kokoro `bf_emma` (local TTS). Music: `audio compose --style acoustic-folk` (generated here).
  UI clicks: `kenney-interface-sounds/click-001` (CC0); typing clicks from the recording's `events.json`.
- No third-party media and no attribution needed (qa: no CC-BY items), so there is no `credits.txt`.
