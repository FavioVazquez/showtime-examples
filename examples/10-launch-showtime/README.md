# 10 · Launch video: showtime itself (30 s, 16:9 + 1:1)

The hero video for showtime's README, made with showtime. Every clip in it is a real render from
this `examples/` folder, every line in its terminal is real command output, and its narration was
synthesized on the same machine that rendered it.

![poster](poster.jpg)

- **Video:** [`final.mp4`](https://github.com/FavioVazquez/showtime-examples/releases/download/examples-media-v1/10-launch-showtime--final.mp4), 1920x1080, 30 fps, 30.00 s, H.264 + AAC, 16.1 MB
- **Square version:** [`final.square.mp4`](final.square.mp4), 1080x1080, 4.9 MB (from `showtime deliver exports`)
- **Poster:** [`poster.jpg`](poster.jpg): the end card at 29.3 s, also baked into frame 0.
- **Captions sidecar:** [`final.srt`](final.srt) (17 cues from the narration's word times; not burned in)
- **Share copy:** [`share.txt`](share.txt)
- **Source:** [`project/`](project). Before re-rendering, copy the six example renders into
  `project/media/` and rebuild the voice lines ([`project/media/README.md`](project/media/README.md)).

## The request

> Make a 30-second launch video for showtime itself. Show real things: real renders from the other
> examples, real terminal commands, the studio board. Kokoro voice-over optional, music + SFX,
> 1920x1080 plus a 1080x1080 cut-down via `showtime deliver exports`. This is the hero video for the
> README. Quick mode.

**Mode:** quick. Nothing was asked. The opening line stated the assumptions: *"Quick mode: 30 s 16:9
launch for showtime, confident default tone, Kokoro voice-over (it doubles as proof of the local
voices), composed music with synced UI effects; real clips from examples 01-08, real command output,
the studio board from example 09; a 1080x1080 version from the master."*

## What it demonstrates

- **Result first, then how.** The hook types example 01's real request ("Make a 20-second launch
  video for Tidepool"), and the next scene plays that example's finished `final.mp4`. The terminal
  then shows the commands behind it, with their real output: `showtime audio mix` of example 01's
  mix (`-14.01 LUFS -1.1 dBTP LRA 1.86`, and its waveform drawn from the mixed file), a `render`
  progress line in showtime's own format (`frames 600/600 100%`), and `showtime qa` of example 01's
  final, verbatim (`verdict: PASS (0 fail, 0 warn, 0 note)`).
- **A wall of real renders.** Six `<video>` tiles play the finished examples (launch, explainer,
  vertical short, footage edit, data story, beat montage). All six are on screen from the cut,
  dimmed, and each one lights up as the narration names it (word times from `timeline.json`).
- **The studio board.** A `showtime site capture --serve` of example 09's exported board
  (`studio-board.html`), in a `browser-frame` whose page is live DOM (the capture as an `<img>` plus
  an overlay), so when the `cursor` clicks the recommended concept it visibly gets picked: an amber
  ring, a "picked" chip, the other two concepts dim. The camera pushes the whole browser, not the
  page inside it.
- **A voice-led timeline.** `voice script --fit` lands the narration on 25.5 s and `retime
  --from-voice` sets every scene length, places each line as its own track and ducks the music.
  The "local" scene draws the waveform of the sentence being spoken ("Even this voice was made
  locally.") with a playhead synced to it.
- **One visual spine.** The amber play mark from showtime's studio board, and a frame counter of
  this video itself (`frame 0517 / 900 · 00:17.23`) running under every scene.
- **Honest copy.** On-screen claims come from the README: "No cloud APIs. No API keys. No uploads." (short
  for the README's "no cloud AI services, no API keys, nothing you make is uploaded"; web features such as
  media search only fetch),
  "A local video studio for Claude Code", and the two `/plugin` install lines. There are no numbers
  other than real command output. (A "macOS · Windows · Linux" line was cut in the review round:
  only macOS x86_64 has actually been run so far.)

## Storyboard

| time | scene | picture | voice | sound |
|---|---|---|---|---|
| 0.0-2.2 | hook | A prompt box types "Make a 20-second launch video for Tidepool" over a dim, drifting contact sheet of the example posters; ↵ | "You describe the video." | typing bed, Enter key |
| 2.2-6.4 | result | `zoom-through` into example 01's final playing in a player; "you / Claude / showtime" roles on the left; `tidepool-launch/final.mp4 · 1920×1080 · 20.00 s · qa PASS` | "Claude directs. showtime does the work, on your own machine." | swoosh, pop |
| 6.4-12.5 | terminal | `audio mix` (+ waveform), `render` (counter to 600/600), `qa` (PASS lines, verdict highlighted); slow push | "Scored with music and sound, rendered frame by frame, and checked before it ships." | typing, key clicks, success chime on the verdict |
| 12.5-17.5 | wall | six example renders, each lighting up as it is named; slow pull-back | "Launch films, explainers, vertical shorts, footage cuts, data stories." | swoosh, a soft thock per tile (music drop) |
| 17.5-21.3 | studio | example 09's studio board; the whole browser pushes in, the cursor clicks the recommended concept and it gets picked (ring + "picked" chip) | "Want options first? Pick them on a studio board." | swoosh, click |
| 21.3-26.7 | local | "No cloud APIs. / No API keys. / No uploads." mask in, then the spoken sentence's waveform with a playhead | "No cloud, no API keys, no uploads. Even this voice was made locally." | thock, thock, punch, shimmer |
| 26.7-30.0 | close | `dip` (0.4 s) into the mark + "showtime", "A local video studio for Claude Code", the two `/plugin` lines (readable from about 27.1 s) | none | logo sting |

## Commands, in order

Everything ran through `skills/showtime/bin/showtime` (below it is just `showtime`), from the work
folder, so the job went to `showtime-out/showtime-launch-<time>/` (written `<job>` below).

```bash
showtime doctor --quick
showtime job init showtime-launch --goal "Make a 30-second launch video for showtime itself ..." --mode quick --platform youtube \
  --assumed "30 s, 16:9 1920x1080, 30 fps, dom template; square 1080x1080 via deliver exports" --assumed "Kokoro voice-over, composed bed + synced SFX" ...

# material
showtime footage scenes examples/<each example>/final.mp4 --every 2 -o <job>/work/inv/<example>   # 8 contact sheets: picked clips and in-points
showtime site capture --serve examples/09-studio-trailer <job>/work/capture-board --page /studio-board.html --aspect 16:9
showtime qa examples/01-launch-tidepool/final.mp4 -o <job>/work/qa-ex01 --platform youtube    # the qa text shown in the terminal
showtime new dom fmt -d 4 && showtime render fmt --preview --out-dir .                        # scratch: the render progress line format
showtime audio mix examples/01-launch-tidepool/project/audio/mix.json -o <job>/work/ex01-mix.wav   # the mix line + waveform in the terminal

# project
showtime new dom <job>/project --title "showtime" --duration 30 --look template
showtime voice ipa "API keys showtime Claude"
showtime voice script <job>/project/narration.md -o <job>/project/voice --fit 25      # x4 while cutting words (1.15x was too fast)
showtime assets font "Inter" --copy-to <job>/project/fonts
showtime assets font "JetBrains Mono" --copy-to <job>/project/fonts
showtime audio styles ; showtime audio sfx-types ; showtime motion transitions
#   (wrote index.html, audio/mix.json; ~/.showtime/venv/bin/python data/peaks.py for the waveform data)
showtime retime <job>/project --from-voice <job>/project/voice/timeline.json --dry-run
showtime retime <job>/project --from-voice <job>/project/voice/timeline.json
showtime snap <job>/project --at 0.3,1.6,4.0,6.2,11.0,16.6,19.3,24.8,29.5 --width 960 --format jpg --sheet   # found overlapping wall tiles
showtime snap <job>/project --at ... --sheet                                          # 3 more rounds: hook box, wrapping, local layout
showtime check <job>/project                                                          # 6 WARN: Menlo glyphs, 5 short_text
showtime voice script <job>/project/narration.md -o <job>/project/voice --fit 25.5     # pause_after=0.9 on the terminal line
showtime retime <job>/project --from-voice <job>/project/voice/timeline.json           # then close set to 2.557 s so the total stays 30.00 s
showtime audio mix <job>/project/audio/mix.json -o <job>/project/work/mix-test.wav      # -14.0 LUFS, voice 15.1 dB over the music
showtime snap <job>/project --every 1 --cols 5
showtime job note <job> --stage plan ... ; showtime check <job>/project               # 1 WARN (see QA)

# final
showtime job note <job> --stage build ...
showtime render <job>/project --job <job>                      # final.mp4, 27.4 MB at crf 16; qa WARN frozen 24.93-27.50 s
showtime qa <job>
showtime snap <job>/project --at 25.0,27.3 ... ; showtime check <job>/project --find-first frozen   # after a waveform playhead + push-in
showtime render <job>/project --job <job> --crf 20             # final-2.mp4, 15.7 MB
showtime qa <job>                                              # PASS
showtime review-pack <job>                                     # round 1: the 08 tile flashed white at 17.6 s
showtime snap <job>/project --at 17.3,17.5,17.6 ... ; showtime snap <job>/project --at 13.0,16.0,17.3,17.6 ...   # in-point 11.4 -> 10.2
showtime render <job>/project --job <job> --crf 20             # final-3.mp4
showtime qa <job> ; showtime review-pack <job>                 # PASS; round 2
showtime deliver exports <job> --targets square                # auto = blur pad (bright blurred bars)
showtime deliver exports <job> --targets square --fit crop --out-dir <job>/work/square-crop   # cut the hook and terminal text
showtime deliver exports <job> --targets square --fit pad --pad-color "#0f0d0b" --out-dir <job>/work/square-pad   # chosen
showtime qa <job>/work/square-pad/final-3.square.mp4 --platform square
showtime render <job>/project --job <job> --crf 20             # final-4.mp4: poster moved to the end card (shipped before the review round)
showtime qa <job>                                              # PASS
showtime review-pack <job> --force-round                       # round 3, for the shipped file
showtime deliver exports <job> --targets square --fit pad --pad-color "#0f0d0b"   # final-4.square.mp4 (superseded by final-6.square.mp4)
showtime qa <job>/exports/final-4.square.mp4 --platform square --no-sheet
showtime captions <job>/project/voice/captions.words.json --style clean --aspect 16:9 -o <job>/work/captions.ass --srt <job>/final-4.srt
showtime qa <job> --no-sheet                                   # PASS, captions sidecar checked too
showtime job note <job> --stage deliver ...

# review round (outside critic's findings on final-4, see "Review round" below)
showtime snap <job>/project --at 2.3,2.417,15.6,16.5,17.4,18.5,19.41,20.3,21.173,25.9,26.9,27.1,27.25,27.5,28.721,29.3 --width 960 --format jpg --sheet --cols 4
showtime snap <job>/project --at 18.2,19.0,19.45,20.3,21.2,26.9,27.1 ... ; showtime snap <job>/project --at 19.45,20.5,24.15,24.4,26.9 ...
showtime check <job>/project                                   # 2 WARN (new one: the voice label after the shorter scene), fixed -> 1 WARN
showtime render <job>/project --job <job>                      # final-5.mp4 at crf 16 (29.9 MB), qa PASS
showtime render <job>/project --job <job> --crf 20             # final-6.mp4, shipped as final.mp4
showtime qa <job>                                              # PASS
showtime deliver exports <job> --targets square --fit pad --pad-color "#0f0d0b"   # final-6.square.mp4
showtime qa <job>/exports/final-6.square.mp4 --platform square --no-sheet
showtime review-pack <job> --force-round                       # round 4: the fixes, and the fixed mix-report context
showtime job note <job> --stage feedback --verified "critic round applied ..."
```

## Timings

The machine was a 6-core Intel i5 Mac (macOS 15), shared with about three other example jobs.

| step | time |
|---|---|
| `doctor --quick` | 2.7 s |
| `site capture` of the studio board | 37 s |
| `voice script --fit` (6 lines, 59 words) | 34-45 s per pass (90 s with the load at its highest) |
| `audio mix` (compose + 24 effects + 6 voice lines) | 17 s |
| `snap` (9 stills at 960 px) | 22 s |
| `check` (full, with timeline pass) | 45-53 s |
| final render (shipped, final-6) | 1 min 40 s: capture 1 min 06 s at 13.6 fps (3 workers), encode 15 s |
| the five earlier renders | 2 min 01 s, 1 min 49 s, 2 min 01 s, 1 min 58 s, 2 min 24 s (crf 16) |
| `qa` | 9-16 s |
| `review-pack` | 17-31 s |
| `deliver exports --targets square` | 14-17 s |

`check` estimated the render at 52-58 s; the real capture ran at about half that speed. The six
H.264 tiles on the wall are seeked on every frame (seek 56-61 ms per frame per worker).

## QA

`showtime qa` on the shipped render (`final-6.mp4`): **verdict PASS (0 fail, 0 warn, 0 note)**

- file: h264 High, yuv420p, 1920x1080, 30 fps, faststart, BT.709; duration 30.00 s, matches `showtime.json`
- loudness: **-14.1 LUFS** integrated, **-1.6 dBTP** true peak (target -14 / -1); voice 15.1 dB above the music while speaking
- no silent gaps, no black stretches, no frozen stretches over 2.5 s, frame 0 has a picture (the baked end card)
- captions sidecar `final.srt`: 17 cues, readable line lengths
- no attribution required

`showtime check` on the project: PASS, 0 errors, **1 WARN** (justified): `short_text` on the verbatim
qa output line `PASS  loudness -14.1 LUFS (target -14), true peak -1.5 dBTP` inside the terminal,
on screen for 3.0 s where the rule asks 3.7 s. It is real output and was not shortened; the line the
viewer needs, `verdict: PASS (...)`, meets its reading budget. The notes are small labels (the frame
counter, the browser-frame URL bar, the terminal title) and edge proximity of the left-hand role labels.

The square version (`final.square.mp4`, `qa --platform square`): **WARN (0 fail, 2 warn)**,
-14.0 LUFS, -1.5 dBTP. The two warnings are `frozen` 9.90-12.57 s and `black_segment` 21.70-22.37 s.
They come from the pad: the 16:9 picture fills only 56 % of the square frame, so the terminal's slow
push and the first "No cloud APIs." line change too few pixels for qa's whole-frame thresholds. The
same stretches pass in the master.

Earlier findings that were fixed: a frozen 2.6 s hold in the "local" scene (qa, first render: added
a playhead that sweeps the spoken sentence's waveform and a 6 % push-in), the 08 tile flashing white
at 17.6 s (review pack round 1: moved the clip's in-point), text drawn with the system font Menlo
(`›` and `✓` are not in the Inter subset: replaced with SVG), and five `short_text` warnings (a
chip in the hook was cut, the terminal beats were moved earlier, and the narration got a 0.9 s pause
after the terminal line).

## Notes and deviations

- **Square version.** `deliver exports --targets square` defaults to a blurred pad, which smeared
  bright tiles into the bars; `--fit crop` cut the hook, the terminal and the "No ..." lines. The
  shipped square uses `--fit pad` with the video's own ground colour (`#0f0d0b`), so the bars read
  as part of the frame. A true 1:1 layout would need its own render.
- **Poster.** The first finals baked the wall (17.2 s) as the poster. It was moved to the end card:
  the thumbnail then carries the name, and the NASA interview tile (a real person) is not the face
  of the product.
- **Critic.** Review rounds 1 and 2 were self-reviews (this run could not start a critic sub-agent).
  Round 3, on the shipped final-4, was judged by an outside critic; its findings were applied in the
  review round below.
- **Terminal content.** Commands and output are typeset in the page (not a screen recording). Each
  output line is copied from a real run: qa of example 01's final, `audio mix` of example 01's
  `mix.json` (the output file was named `ex01-mix.wav`, shown as `mix.wav`), and the render
  progress format from a real render. The render line counts up to 600 in showtime's format; it is
  not a recording of example 01's render.
- **End card length.** `retime --from-voice` keeps the end card's length, so the total came out at
  30.52 s; the close was set to 2.557 s by hand to keep 30.00 s. The review round took 0.7 s from
  the local scene's hold and gave it to the close (now 3.257 s).
- **Install lines.** The end card shows the README's `/plugin marketplace add faviovazquez/showtime`
  and `/plugin install showtime@showtime`. The CHANGELOG still lists the final GitHub owner/name as
  a release-checklist item; update the end card if it changes.

## Sources and licenses

- **Clips:** the `final.mp4` of examples 01, 02, 05, 06, 07 and 08 in this repository (used muted),
  and the poster frames of examples 01, 02, 04, 07, 08 and 09 (the hook's backdrop). Their own sources apply:
  Tidepool is a fictional app made as showtime sample material; example 06 is NASA/JSC footage
  (public domain, NASA Image and Video Library, jsc2023m000095) and example 08's images are
  NASA/ESA/CSA/STScI public-domain images, credited as a courtesy with no endorsement implied (see
  those examples' `credits.txt`). Example 08's music (CC BY 4.0) is **not** used here: the tiles are muted.
- **Studio board:** a capture of `examples/09-studio-trailer/studio-board.html`.
- **Voice:** Kokoro-82M (Apache-2.0), voice `af_heart`, generated locally. It is a synthetic voice.
- **Music and sound effects:** generated on this machine by `showtime audio` (`compose` style
  `upbeat-tech`, key C, and procedural effects). Nothing downloaded, nothing to credit.
- **Fonts:** Inter and JetBrains Mono, SIL Open Font License 1.1 (`project/fonts/*/LICENSE.txt`).
- **Claims:** showtime's `README.md` (local, no cloud AI services/keys/uploads, the tagline, the install
  commands).

## Review round

An outside critic judged the shipped final-4 (review pack round 3): **ship after fixes**, 1 blocker,
5 should-fix, 3 polish. Each finding was checked against the frames first (all confirmed), then
fixed in one pass and re-rendered as final-6 (shipped here). Before/after stills at every cited time
were compared; `review/round-4/` in the job is the pack of the fixed video.

| # | where | finding | what changed |
|---|---|---|---|
| 1 | end card, frame 0 | **blocker:** the install line uses `faviovazquez/showtime`, which the CHANGELOG still lists as unconfirmed | **not changed**: it matches the README and `.claude-plugin/`; only the owner can confirm it. If it moves, change `.install` in `project/index.html` and re-render (the poster is the end card, so both update) |
| 2 | 28.4-30.0 s | install lines readable for only ~1.6 s | the local scene's 0.7 s hold after "locally" was cut, so the close starts at 26.74 s; `domain-warp 0.8` became `dip 0.4`; the install lines come in at 0.25 s instead of 0.85 s. Readable from about 27.1 s (~2.9 s). Music outro and logo sting moved with it |
| 3 | 19.4-21.3 s | the voice says "Pick them", nothing gets picked, the shot holds nearly still | on the click (19.33 s) the recommended concept gets an amber ring and a "picked" chip and the other two dim; a slow push runs to the cut |
| 4 | 19.5-21.3 s | the push sliced the board's tab row under the URL bar and cut the left column mid-word | the push moved from the page inside the browser to the whole browser (1.0 -> 1.31): its edges leave the video frame, nothing is sliced. The frame counter got a backing pill, since the board now runs under it |
| 5 | 16.0-17.55 s | example 06's tile shows the astronaut's name tag and the NASA insignia, inside a product ad | the tile is cropped to face height (scale 1.6 about 50 % / 20 %): the face and burned captions stay, the patch and name tag never enter the frame (checked at 15.4, 15.9, 16.4, 16.9, 17.4 s). A rights check before a public launch is still advised |
| 6 | 25.7-27.4 s | "macOS · Windows · Linux" is a claim only macOS x86_64 has been run for | chips removed |
| 7 | review tooling | the pack's `context/mix.report.json` was example 01's side mix, not this video's | `review-pack` now copies the packed video's own `<video>.work/audio/mix.report.json` first (verified in round 4: voice 15.1 dB over the music, 30.0 s) |
| 8 | 2.22-2.45 s | polish: the blurred giant prompt sat over the clip's text mid zoom-through | the prompt fades out within 0.15 s of the cut |
| 9 | 27.5-28.0 s | polish: the domain-warp smeared the logo | replaced by the dip (item 2) |
| 10 | frame 0 | polish: the baked end card flashes for one frame before the hook | **not changed**: kept as the poster trade-off (hosts that use frame 0 as the thumbnail show the brand) |

The shorter local scene made `check` flag the "this voice" label (2.3 s on screen, 2.7 s needed); it
now reads "this voice · Kokoro, on this machine" and comes in 0.4 s earlier. After the round: `check`
is back to the one justified WARN, `qa` on final-6 is **PASS** (-14.1 LUFS, -1.6 dBTP), and the square
export has the same pad-only WARNs as before.
