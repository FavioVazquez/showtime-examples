# 01 · Launch video: Tidepool (20 s, 16:9)

A 20-second launch video for **Tidepool**, a fictional local-first Markdown notes app that lives in
[`examples/_apps/tidepool`](../_apps/tidepool). Tidepool is not a real product. It was built only as
sample material for showtime and is not linked to any real company or project with a similar name.
The video says so on its end card.

![poster](poster.jpg)

- **Video:** [`final.mp4`](https://github.com/FavioVazquez/showtime-examples/releases/download/examples-media-v1/01-launch-tidepool--final.mp4), 1920x1080, 30 fps, 20.00 s, H.264 + AAC, 17.0 MB (re-rendered for the stricter check and after a critic review, see "Re-render" and "Critic review" at the end of the review round)
- **Poster:** [`poster.jpg`](poster.jpg): the hook at 3.1 s. It is not baked into frame 0: frame 0 is its own still, the kicker and "No account." (see "Critic review").
- **Share copy:** [`share.txt`](share.txt)
- **Source:** [`project/`](project). This is the whole showtime project. You can re-render it with `showtime render project`.

## The request

> Make a 20-second launch video for Tidepool (use landing.html + the real app UI). Landscape
> 1920x1080, music + subtle SFX, no voiceover. Quick mode.

**Mode:** quick. Nothing was asked. The opening line stated the assumptions: *"Quick mode: 20 s 16:9
launch video for Tidepool, default tone leaning polished, composed music with a few soft effects, no
voice-over. The colours and fonts come from the app: teal #0E8A8C / #14A3A0, sun #FFB38A, Inter and
JetBrains Mono."*

## What it demonstrates

- **Real product material, no mock UI.** The landing page comes from `showtime site capture --serve`.
  The two app scenes are one scripted recording of the working app from `showtime demo record`:
  it presses ⌘K, types `export`, opens the matching note, writes a Markdown task list, and checks a
  task in the live preview. The landing's sticky nav stays pinned while the page scrolls under it,
  as it does on the real page.
- **A camera over a recording.** The recording plays inside a `browser-frame`, and the frame's
  `zoom` steps push in on the palette and the editor. A synthetic `cursor` follows an invisible
  target placed over the checkbox, so it lands on it even while the camera moves.
  The `keystrokes` component shows ⌘ K.
- **A visual idea from the product's own world.** The logo's wave and sun become the hook's
  underline and glow. A WebGL `ripple` transition carries the hook into the landing page, and the
  landing's wave band sits under every light scene.
- **Sound design from one family.** A composed `corporate-minimal` bed (G, about 109 bpm) has its
  sections on the scene cuts. Water drops mark the hook lines, the ripple, the saved task, and the
  logo landing on the bed's final tonic hit (17.7 s). A few key clicks and two soft swooshes fill
  in the rest, with a soft typing bed under the typed Markdown. Everything is generated locally, with no library downloads and nothing to credit.
- **Honest copy.** Every on-screen line comes from `landing.html` or from strings in the app's UI
  ("No account, no server, no loading spinner", "Your notes, kept on your own machine.",
  "Find anything", "Markdown, previewed live", "Saved on this device", "Open Tidepool"). There are
  no numbers, stats or testimonials. The template's proof scene was cut because there was nothing
  real to put in it.

## Storyboard

| time | scene | picture | sound |
|---|---|---|---|
| 0.0-3.2 | hook | Dark teal ground with the logo's sun. The logo mark and "Local-first notes", then "No account. / No server. / No loading spinner." mask in; the wave line draws. | the bed starts on its verse, water drops on lines 1 and 3 |
| 3.2-6.6 | reveal | `ripple` into the real landing page in a browser frame; it scrolls down to the live app preview | swell + water drop into the ripple, the bed builds |
| 6.6-10.8 | search | ⌘K palette, type "export", matches highlighted, Enter opens *Q4 planning draft*; camera pushes in on the palette | swoosh, ⌘K click, three key clicks, Enter click |
| 10.8-16.6 | write | New note in split view: `## Saturday` and a task list render live (typing at 1.75x); the cursor checks a task at 13.95 s; "Saved on this device"; the camera pulls back to the whole app | swoosh, soft typing bed, toggle + water drop on the check |
| 16.6-20.0 | close | Mark + "Tidepool", "Your notes, kept on your own machine.", "Open Tidepool", fictional-app note | the bed's final hit + water drop at 17.7 |

## Commands, in order

Everything ran through `skills/showtime/bin/showtime` (below it is just `showtime`), from the work
folder, so the job went to `showtime-out/tidepool-launch-<time>/` (written `<job>` below).

```bash
showtime doctor --quick
showtime job init tidepool-launch --goal "Make a 20-second launch video for Tidepool (landing.html + real app UI), 1920x1080, music + subtle SFX, no voiceover" \
  --mode quick --assumed "20 s, 16:9 1920x1080, 30 fps, dom template" --assumed "no voice-over; generated music bed + a few subtle UI SFX" \
  --assumed "palette and fonts from the app: teal #0E8A8C/#14A3A0, sun #FFB38A, Inter + JetBrains Mono"

# material
showtime site capture --serve examples/_apps/tidepool <job>/work/capture-landing --page /landing.html --aspect 16:9
showtime site capture --serve examples/_apps/tidepool <job>/work/capture-app --aspect 16:9
showtime demo init <job>/work/demo-src/init-example.mjs          # read the helper list, then wrote tidepool-demo.mjs
showtime audio styles
showtime audio sfx-types
showtime demo record <job>/work/demo-src/tidepool-demo.mjs <job>/work/demo --serve examples/_apps/tidepool   # 3 takes, see notes
showtime footage scenes <job>/work/demo/demo.mp4 --every 1 --job <job>                                          # contact sheet of the take
showtime job note <job> --stage plan --verified "contract: ..." --verified "storyboard: ..." --assumed "..."

# project
showtime new dom <job>/project --title "Tidepool" --duration 20 --look template
showtime assets font "Inter" --copy-to <job>/project/fonts
showtime assets font "JetBrains Mono" --copy-to <job>/project/fonts
#   (wrote index.html, showtime.json, audio/mix.json; copied the landing capture, logo.svg and demo.mp4 into the project)
showtime check <job>/project
showtime snap <job>/project --every 1
showtime snap <job>/project --at 0.3,4.3,6.4 --width 960 --format jpg          # found the landing scroll not moving
showtime snap <job>/project --at 0.3,5.2,6.4,12.5,14.5,15.3,16.3 --width 960 --format jpg
showtime check <job>/project
showtime audio mix <job>/project/audio/mix.json -o <job>/project/work/mix-test.wav
showtime job note <job> --stage build --verified "check PASS ..."

# final
showtime render <job>/project --job <job>            # final.mp4, qa WARN: frozen 11.87-15.60 s (only small typing changes)
showtime qa <job>
showtime check <job>/project --find-first frozen     # after adding a slow push-in during the typing
showtime snap <job>/project --at 12.5,14.8 --width 960 --format jpg
showtime snap <job>/project --at 16.3,19.9 --width 960 --format jpg
showtime render <job>/project --job <job>            # final-2.mp4 (shipped here as final.mp4)
showtime qa <job>                                    # PASS
showtime review-pack <job>
showtime job note <job> --stage qa ... ; showtime job note <job> --stage deliver --output final=<job>/final-2.mp4 ...

# review round (critic findings on final-2, see "Review round" below)
showtime snap <job>/project --at 1.5,4.9,10.7,13.7,15.9,16.3,17.0,18.0,19.9 --width 960 --format jpg -o <job>/work/review-before
showtime audio mix <job>/project/audio/mix.json -o <job>/project/work/mix-r2.wav   # plus two test mixes for the hook level
showtime audio meter <job>/project/work/mix-r2.wav --windows 1
showtime snap <job>/project --at 1.5,3.1,4.9,10.7,12.5,13.3,13.95,14.3,15.0,15.6,16.3,16.8,17.0,18.0,19.9 --width 960 --format jpg --sheet -o <job>/work/review-after
showtime check <job>/project                         # PASS, 0 warnings
showtime render <job>/project --job <job>            # final-3.mp4 (shipped here as final.mp4)
showtime qa <job>                                    # PASS
showtime review-pack <job>                           # round 2
showtime job note <job> --stage feedback --verified "round 1 critic findings applied ..." --output final=<job>/final-3.mp4
```

## Timings

The machine was a 6-core Intel i5 Mac (macOS 15), shared with about three other render jobs.

| step | time |
|---|---|
| `doctor --quick` | 2.6 s |
| `site capture` landing / app | 14.5 s / 9.8 s |
| `demo record` (15.4 s of video, 462 frames at 2560x1600) | 32 s |
| `check` (full, with timeline pass) | 52 s |
| `snap --every 1` | 12 s |
| first final render | 2 min 53 s (capture 2 min 17 s at 4.4 fps, encode 24 s) |
| second final render | 2 min 9 s (capture 1 min 48 s at 5.6 fps, encode 18 s) |
| review-round render (shipped) | 1 min 58 s (capture 1 min 30 s at 6.6 fps, encode 22 s) |
| `check` after the fixes | 1 min 7 s |
| `qa` | 11-13 s |
| `review-pack` | 17 s |

Capture ran slower than `check` estimated (about 1 min). Most of the time went to seeking the
2560x1600 H.264 recording on every frame: about 290 ms per seek per worker.

## QA

The numbers below are for `final-3.mp4`, the file shipped after the review round; the current `final.mp4` is the re-render described at the end of "Review round".

`showtime qa` on that render (`final-3.mp4`, after the review round) gave **verdict PASS (0 fail, 0 warn, 0 note)**:

- file: h264 High, yuv420p, 1920x1080, 30 fps, faststart, BT.709
- duration: 20.00 s, which matches `showtime.json`
- loudness: **-14.1 LUFS** integrated, **-1.5 dBTP** true peak (target -14 / -1)
- no silent gaps, no black stretches, no frozen stretches over 2.5 s, and frame 0 has a picture (the baked poster)
- no attribution required

`showtime check` on the project: PASS with 0 errors and 0 warnings. The two notes were: small
labels (the browser URL bar and the scene kickers, 17-23 px) and one text block measured through a
transition layer.

The first render got a qa **WARN** (`frozen` from 11.87 to 15.60 s). The typing in the write scene
changes too few pixels to count as motion. The fix was a slow camera push (scale 1.8 to 1.97 over
3.7 s) while the text is typed, followed by a re-render.

## Notes and deviations

- **Demo script.** `demo.type('text', {cps})` with options and no target reads the text as a
  selector. Typing into the field that already has focus needs `demo.type(null, 'text', {cps})`.
  The first take also clicked each field before typing it, which cost about 3 s.
- **Landing scroll.** On a `data-src` image, the browser-frame's `data-scroll` never moved in
  `snap` stills. The scene puts the page image in the frame as a child `<img>` instead, and
  scrolls it with a CSS `@keyframes` translate. The stage seeks that animation, so the render stays
  deterministic.
- **The write scene** plays the recording from 7.85 s at 1.75x (`data-rate`). The typing is done by
  13.3 s and the rest of the scene holds the checked task and the saved state. The typed words are illustrative user content, not claims.
- **Critic pass.** The first build could only self-review its pack. A separate critic then reviewed
  the shipped file from the files alone; its findings and what was done about them are below.

## Review round

The critic reviewed `final-2.mp4` (the first published version) from a review pack built from the
file. Verdict: **ship after fixes**, no blockers, 6 should-fix and 4 polish items. Every cited time
was snapped before any change, and all ten findings held up. All ten were applied in one
re-render (`final-3.mp4`, now `final.mp4`):

| # | where | finding | change |
|---|---|---|---|
| 1 | 15.9-16.6 s | payoff shot zoomed onto a crop that cut the note list and the heading; cursor vanished mid-move | the push holds on the preview through the click, then pulls back to the whole app window (14.65-15.55 s) and holds it to the cut |
| 2 | frame 0 | the baked poster was the bright end card: a one-frame flash before the dark hook | poster 19.3 -> 3.1 s: frame 0 and `poster.jpg` are the hook |
| 3 | 11.6-15.0 s | typing at 1.25x was the slowest stretch | 1.75x: typing ends 13.3 s, the task is checked at 13.95 s, "Saved on this device" is in from 14.1 s |
| 4 | 0.5-1.5 s | "Local-first notes" label too small to say *notes* at phone size | about 21 -> 39 px, brighter, with the logo mark |
| 5 | 4.6-5.3 s | the landing's sticky nav was sliced under the URL bar as the flat capture scrolled | the nav strip of the capture is pinned while the page scrolls under it |
| 6 | 18.4-20 s | fictional-app line too small (about 22 px grey) | about 32 px, #3C4A4D, fully on screen at 18.0 s |
| 7 | 0-2 s | hook music much quieter than the body | the bed opens on its verse instead of its intro: hook section -15.3 LUFS (was -19.0) |
| 8 | 11.6-15.0 s | three key clicks under about 50 typed characters | replaced by a soft typing bed over the typed span |
| 9 | 16.8-17.2 s | muddy blur-dissolve midpoint | dissolve 0.6 -> 0.35 s |
| 10 | 10.2-10.8 s | search zoom-out stopped at 1.12x and cut the sidebar | ends at 1.0x on the whole window |

After the round: `check` PASS (0 warnings), `qa` PASS (0 fail, 0 warn, 0 note, -14.1 LUFS, -1.5 dBTP),
and a round-2 pack was built. The round-2 look at the fixes was a self-check against that pack; no
fresh critic ran on it.

### Re-render: stricter check (2026-09-28)

`showtime check` was made stricter after this example shipped: readable text must be at least 2.2 % of
the frame height (24 px at 1080p) and contrast at least 4.5:1 at every size. On the unchanged project
it flagged two warnings, "SEARCH" (0:07.17) and "WRITE" (0:11.37): the scene kickers were 22 px
(`2.1cqmin`). A third warning, a `setTimeout` that ran once during playback inside the component
runtime's video-ready helper, came up on the first check run only and not on any later run, so it
was not a problem in this project.

- **Change:** `.ui .kicker` 2.1cqmin -> 2.4cqmin (22 -> 26 px). Nothing else in the project changed.
- **check:** PASS, 0 errors, 0 warnings (notes: the browser URL bar and similar UI chrome at 17-19 px,
  one text block measured through a transition layer).
- **Render:** a Linux x64 machine (32 cores): 54 s for 600 frames (capture 50 s at 12 fps, encode 3 s).
  The last render on the 6-core Mac took 1 min 58 s. **qa:** PASS (0 fail, 0 warn, 0 note), 17.1 MB,
  -14.1 LUFS, -1.4 dBTP.
- **Frame 0:** the render now bakes the poster into frame 0 only when that frame already looks like
  the opening frame. The 3.1 s hook differs from the dark opening frame (mean difference 12.8/255), so
  the poster was not baked. The file shipped before this re-render had it baked, and today's `qa` gives
  that file a `poster_flash` WARN (frame 0 differs sharply from frame 1). Frame 0 is now the hook's
  opening (the dark ground with the logo mark, before the lines mask in), and `poster.jpg` is still
  the 3.1 s hook for platforms that take a cover image. Review item 2 above still holds: frame 0 is
  not the end card.
- **Review:** `review-pack` on the new file, then a self-review of the contact sheet, the cut strips
  and the full-size text crops (no separate critic ran). No new findings. The only visible change is
  the larger kicker.

### Critic review of the re-render (2026-09-28)

A separate critic reviewed the re-rendered file: ship after fixes. Audio, cut and timing matched the
earlier file (audio correlation 1.000, lag 0 ms).

- **Should-fix, frame 0:** frame 0 was an almost empty teal field with only the 37 px logo mark,
  because every hook line masked in from 0 s. Feeds and embeds without a poster attribute show that
  frame. **Change:** the kicker ("Local-first notes") and "No account." have no build-in
  (`data-style="none"`), so frame 0 already shows them. "No server." and "No loading spinner." mask in
  at 0.62 s and 1.24 s as before. The sun starts its rise 0.45 s early (`animation-delay: -.45s`), so it is
  in frame 0 and settles by 0.95 s. With frame 0 this close to the 3.1 s poster, the render's automatic
  poster bake would have put the full three-line headline on frame 0 (a one-frame flash), so
  `showtime.json` now has `"render": {"poster_bake": "off"}`. `poster.jpg` is still the 3.1 s hook.
- **Polish, 8.7 s:** "Titles, text and #tags, as / you type." left two words on the last line. It now
  breaks after "#tags," (a `<br>`): "Titles, text and #tags, / as you type."
- **Not changed:** audio (`mix.json`; the first water drop at 0.05 s now plays as the film opens rather
  than on a line entering), cuts, timing.
- **check:** PASS, 0 errors, 1 warning, 2 notes. The warning is the runtime's own `setTimeout` from
  `core.js` (the video-ready helper's 15 s fallback timer firing after playback started). It is not
  from this project and does not change any frame.
- **Render:** Linux x64 box, 600 frames captured in 47 s, 17.0 MB. **qa:** PASS (0 fail, 0 warn,
  0 note), -14.1 LUFS, -1.4 dBTP, "frame 0 flows into frame 1 (no poster flash)". A scan of every
  pair of consecutive frames found no one-frame flash. Frames 0-8 differ by at most 0.3/255 (mean).

## Sources and licenses

- **Product, copy and UI:** `examples/_apps/tidepool` (fictional, part of this repo).
  `project/shots/landing-full.jpg` is a capture of `landing.html`. `project/media/tidepool-demo.mp4`
  is the recording made by `project/tidepool-demo.mjs`. `project/shots/logo.svg` is the app's logo.
- **Fonts:** Inter and JetBrains Mono, both SIL Open Font License 1.1. The license files are in
  `project/fonts/*/LICENSE.txt`.
- **Music and sound effects:** generated on this machine by `showtime audio` (`compose` and
  procedural `synth` effects). They are not library tracks, so there is no CC-BY and no `credits.txt`.
- **Runtime:** the scene components, the `ripple` / `push` / `blur-dissolve` transitions and the
  grain are showtime's own runtime.
