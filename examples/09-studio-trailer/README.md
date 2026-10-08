# 09 · Studio mode: a trailer for Tidepool (20 s, 16:9)

A 20-second trailer for **Tidepool**, a fictional local-first Markdown notes app that lives in
[`examples/_apps/tidepool`](../_apps/tidepool). Tidepool is not a real product. It was built only as
sample material for showtime and is not linked to any real company or project with a similar name.
The end card of the video says so.

This example shows the **studio** flow rather than quick mode. The user asked to see options
first, so the agent did not make a video straight away. It put four concepts on a local review
board, each with style frames rendered from real compositions and a music bed. The user's picks,
comments and a "mix these two" request came back from the board. The agent then made a storyboard
and a half-size animatic, got a sign-off on both, and only then rendered the final.

![poster](poster.jpg)

| file | what it is |
|---|---|
| [`final.mp4`](https://github.com/FavioVazquez/showtime-examples/releases/download/examples-media-v1/09-studio-trailer--final.mp4) | the trailer: 1920x1080, 30 fps, 20.00 s, H.264 + AAC, 12.2 MB |
| [`animatic.mp4`](animatic.mp4) | the approved animatic: 960x540, 20.00 s, with the real score (3.4 MB) |
| [`studio-board.html`](studio-board.html) | the review board as one self-contained HTML file (6.9 MB, board rev 6), exported with `--target artifact` so it can be published as an HTML artifact: reviewers send back "Copy for Claude" text (no download button, which such hosts block). Download it and open it in any browser; nothing loads from the network |
| [`poster.jpg`](poster.jpg) | the end card at 18.5 s (for this README). Frame 0 of the video is the hook, baked in from 1.0 s |
| [`share.txt`](share.txt) | post copy for X, LinkedIn, YouTube and a README |
| [`project/`](project) | the showtime project: `index.html`, `showtime.json`, `audio/mix.json`, the captured plates, fonts, and the three demo scripts that recorded the plates (in `capture/`) |
| [`studio/`](studio) | the studio record: `brief.md`, `decisions.md` (D-001 to D-009), `board.json` and every board revision in `boards/`, the four style-frame compositions in `comps/`, `feedback.json`, and the three simulated reviewer rounds in `feedback-sim/` |

## The request

> Let's brainstorm a trailer for Tidepool first — show me options

**Mode:** studio. The words "brainstorm" and "show me options" turn it on (SKILL.md, *Modes*), so
the agent asked nothing in chat. It looked up the facts in the app folder: the name, the teal and
sun-amber palette (`styles.css`), Inter and JetBrains Mono, the landing copy and the seed notes.
Everything about look, sound and timing went on the board.

The reviewer in this example is **simulated**. The board's feedback was written as
`feedback.json` files and brought in with `showtime studio feedback --import`. This is the same
path a reviewer on another machine uses: they send back the file they download from the board.
The three rounds are in `studio/feedback-sim/`.

## How the studio session went

**Round 1: concepts (board rev 1).** There were three concepts that are structurally different,
plus one wildcard. Each had 2-3 style frames and a 10 s composed bed:

| tag | concept | shape |
|---|---|---|
| C1 | **Low tide** | typography only: the logo's wave becomes a horizon, and real note titles surface under it |
| C2 | **Macro** *(recommended)* | extreme close-ups of the real app with shallow focus, withheld until a pull-back reveal |
| C3 | **Keystrokes** | every cut is a key on the beat, and each key does its real thing in the light-theme app |
| W1 | **The trailer is a note** *(wildcard)* | the trailer is typed as Markdown in a Tidepool note, and the live preview is the title card |

The simulated reviewer:
- picked **C2**, and picked C2's bed (cinematic build);
- liked C1's sunrise frame and commented that it should be the ending;
- said of C2's hook: keep "Sync: local only", but make it drift so frame 1 is already moving;
- asked for a **mix**: "C2's macro fragments and pull-back, but land the name on C1's sunrise over the wave";
- answered 20 s for the length and "Your notes, kept on your own machine." for the end line;
- moved the energy dial from 45 to 55.

**Round 2: storyboard (rev 2).** This round had eight shots that add up to exactly 20.0 s, all on
the score's beat grid, with thumbnails rendered from the draft project. The reviewer picked serif
italic title cards (C1's type) and left one note on shot C2.4: let "Saved on this device" sit
sharp for a beat. The tick moved earlier, so the label now holds sharp for 0.65 s.

**Round 3: animatic (rev 3).** A half-size render with the real score and effects. The reviewer
approved it, with a timecoded note at 0:15.6 praising the app sinking into the sunrise. The agent
locked the brief and built the final.

**Revs 4-6: build and review.** The final was rendered, checked and self-reviewed, and two fixes
came out of that (see *QA*). An external critic then reviewed the shipped file and found a
blocker and five should-fix items that the self-review had missed. They were fixed in a fourth
review round (see *Review round 4*). The same critic then checked the fixed file, said **ship**,
and left four optional polish notes; the cheap ones were applied in round 5 (see *Review round 5*).
Board rev 6 records the final numbers, and it is the one exported here.

## What it demonstrates

- **A studio board with real options.** The four concepts differ in story shape, device and
  format, not only in colour. Each style frame is a small HTML composition (`studio/comps/*.html`)
  over real captures, rendered through the render pipeline by `showtime studio frame`. Each concept
  has its own playable bed, and the page has picks, likes, comments, a mix request, questions and
  dials.
- **Feedback as data.** The digest quotes what the reviewer typed as data. Every decision is logged
  in `decisions.md` with where it came from (board rev and feedback time). `brief.md` holds the
  current truth and ends with a *Locked* section.
- **Real UI in macro.** Every UI pixel is the working app in its dark theme, recorded with
  `showtime demo record` at 3840x2160: the typing in the palette, the task being checked, and "Saved
  on this device". The "camera" is a CSS 3D transform over those plates, with keyframes per shot:
  focus point, scale, tilt, and a depth-of-field ellipse (a masked sharp layer over a blurred one).
  A little seeded noise drift runs on top, so no frame is ever locked off.
- **A trailer that withholds.** The name appears as a title only on the end card, on the score's
  final hit at 16.47 s. Before that, the only place it shows is the app's own small sidebar logo
  during the pull-back and the sink (about 13.0-15.7 s). The pull-back lands on the "Q4 planning
  draft" note, not the welcome note, so no heading, breadcrumb, list title or body text says the
  name. The spine is "Sync: local only": it opens the video and returns on the drop (12.6 s), held
  sharp for 0.3 s before the pull-back eases out of it.
- **Sound composed to the cut.** The `cinematic-build` score (95 bpm, D minor) has its sections on
  the act breaks: build at 7.6 s, drop at 12.6 s (riser, impact and boom), and outro at 15.2 s. One
  sound family runs through it: water drops on the hook, the tick and the name, six soft key clicks
  on the typed letters, one heavy whoosh on the pull-back, and a tonal swell into the name. A low D
  drone lifts the first 9 s. All of it is generated locally, with nothing to credit.

## Storyboard (as built)

| time | shot | picture | sound |
|---|---|---|---|
| 0.00-2.53 | hook | macro "Sync: local only", drifting and pushing in | drone, a water drop |
| 2.53-4.30 | card | *Everything you write* (Instrument Serif italic) | intro |
| 4.30-6.00 | find | the ⌘K palette: "export" typed (one captured frame per letter), then the camera slides to the amber match | six key clicks |
| 6.00-7.60 | tick + saved | "Draft the export spec" ticks in the live preview, and the camera pans to "Saved on this device" | water drop at 6.3 |
| 7.60-9.48 | card | *stays on your device.* | build: crash |
| 9.48-12.60 | fragments | "everything you write is saved in this browser." · ⌘K · `[[Q4 planning` · `#planning` · "Notes on local-first software" · "Just now", one per beat, then half beats | build |
| 12.60-15.20 | reveal | back on "Sync: local only" (held to 12.90), then the camera eases out and whips all the way back to the whole app (fastest at about 13.10 s, with a light motion blur), open on the Q4 planning note | drop: impact and boom at 12.60, heavy whoosh peaking at 13.15 |
| 15.20-20.00 | name | the tide rises over the app as it sinks (one wave line is the water's edge), the sun rises behind it, **Tidepool** lands on the end hit (16.47), then the tagline and the fictional-app line | outro, swell and water drop on the hit |

## Commands, in order

Everything ran through `skills/showtime/bin/showtime` (written `showtime` below). It ran from the
work folder, so the job went to `showtime-out/tidepool-trailer-20260926-144115/`, written `<job>`
below. `APP` is `examples/_apps/tidepool`.

```bash
showtime doctor --quick
showtime job init tidepool-trailer --mode studio --goal "Let's brainstorm a trailer for Tidepool first — show me options" \
  --assumed "source: examples/_apps/tidepool (index.html app + landing.html), fictional app" \
  --assumed "trailer length 15-20 s, 16:9 1920x1080, 30 fps" --assumed "no voice-over (trailer default); composed score + sound design"
showtime studio init tidepool-trailer

# material (see "Notes" for the 3x zoom)
showtime site capture --serve APP <job>/work/cap-test --page "/index.html?ephemeral=1&theme=dark&note=q4-planning&mode=split&palette=export" \
  --width 1280 --dpr 4 --no-full --no-sections --no-assets --max-shots 1 --dark off            # probe; overlays hidden
showtime site capture --serve APP <job>/work/cap-pal-export --page "..." --keep-overlays ...     # probe; the palette shows
showtime demo record <job>/work/demo-src/trailer-plates.mjs <job>/work/plates --serve APP --dpr 4 --fps 10 --dark   # frames came out 1280 wide
showtime demo record ... --dpr 3 / --dpr 2                                                      # same; see Notes
showtime demo record <job>/work/demo-src/trailer-plates.mjs <job>/work/plates --serve APP --dpr 1 --fps 10 --no-mp4  # 3840x2160 via zoom 3
showtime demo record <job>/work/demo-src/light-plates.mjs <job>/work/plates-light --serve APP --dpr 1 --fps 10 --no-mp4
showtime assets sheet <job>/work/plates/frames -o <job>/work/plates-sheet.jpg                    # pick the plate frames

# round 1: concepts
showtime audio compose --style ambient-pad --key E --dur 10 --sections 0:intro,5:build --no-stems -o <job>/work/beds/bed-lowtide.wav
showtime audio compose --style cinematic-build --dur 10 --sections 0:intro,4:build,7:drop --no-stems -o <job>/work/beds/bed-macro.wav
showtime audio compose --style upbeat-tech --dur 10 --sections 0:intro,4:drop --no-stems -o <job>/work/beds/bed-keys.wav
showtime audio compose --style lofi-chill --dur 10 --no-stems -o <job>/work/beds/bed-note.wav
showtime audio master <job>/work/beds/bed-<x>.wav -o <job>/studio/media/audio/bed-<x>.mp3 --preset music   # x4
#   (wrote board.json: 4 concepts, audio group, 2 questions, 2 dials; comps/tp.css + c1/c2/c3/w1.html)
showtime studio frame tidepool-trailer --concept c2 --html <job>/studio/comps/c2.html --shots hook,find,reveal --caption "..."
showtime studio frame tidepool-trailer --concept c1 --html <job>/studio/comps/c1.html --shots hook,titles,end --caption "..."
showtime studio frame tidepool-trailer --concept c3 --html <job>/studio/comps/c3.html --shots key,run,end --caption "..."
showtime studio frame tidepool-trailer --concept w1 --html <job>/studio/comps/w1.html --shots note,preview --caption "..."
showtime assets sheet <job>/studio/media/frames -o <job>/work/frames-sheet.jpg                    # found the black wave, a crowded C3 frame
showtime studio frame ... --replace --no-add                                                     # re-rendered C1 and C3-run after the fixes
showtime studio font tidepool-trailer "Instrument Serif"   # also "Inter", "JetBrains Mono"
showtime studio board tidepool-trailer
showtime studio open tidepool-trailer                                                            # a real session ends its turn here
showtime job note tidepool-trailer --stage concepts --verified "..." --assumed "look round skipped ..."
showtime studio feedback tidepool-trailer --import <job>/work/sim/feedback-round1.json
showtime studio feedback tidepool-trailer --new

# round 2: storyboard (draft project = the animatic source)
showtime audio compose --style cinematic-build --bpm 95 --dur 20 --sections 0:intro,7.6:build,12.6:drop,15.2:outro -o <job>/work/score/score.wav   # read the beat map
showtime new dom <job>/project --duration 20 --title "Tidepool trailer" --look template
showtime assets font "Inter" --copy-to <job>/project/fonts          # and "JetBrains Mono"
showtime assets font "Instrument Serif" --styles normal,italic --weights 400 --force --copy-to <job>/project/fonts
#   (wrote index.html, showtime.json, audio/mix.json)
showtime snap <job>/project --every 1
showtime preview <job>/project --no-open                             # debug the open-ended end clip in the browser
showtime snap <job>/project --at ... --width 960 --format jpg        # several rounds of framing
showtime check <job>/project                                         # 2 short_text WARNs -> cards lengthened
showtime check <job>/project --no-timeline                           # PASS, 0 warnings
showtime studio frame tidepool-trailer --concept c2 --project <job>/project --at 1.2,3.4,4.9,5.8,7.2,8.6,9.8,11.0,14.2,18.5 --no-add --json
showtime studio board tidepool-trailer                               # rev 2
showtime job note tidepool-trailer --stage storyboard ...
showtime studio feedback tidepool-trailer --import <job>/work/sim/feedback-round2.json
showtime studio feedback tidepool-trailer --new

# round 3: animatic
showtime render <job>/project --preview --scale 0.5 -o <job>/studio/media/animatic/c2-animatic.mp4
showtime footage scenes <job>/studio/media/animatic/c2-animatic.mp4 --every 0.5 -o <job>/work/animatic-view
showtime render <job>/project --preview --scale 0.5 -o <job>/studio/media/animatic/c2-animatic-2.mp4   # after tightening the sink
showtime studio board tidepool-trailer                               # rev 3
showtime job note tidepool-trailer --stage animatic ...
showtime studio feedback tidepool-trailer --import <job>/work/sim/feedback-round3.json
showtime studio feedback tidepool-trailer --new                      # APPROVED

# lock and build
showtime studio board tidepool-trailer                               # rev 4, phase build
showtime job note tidepool-trailer --stage lock ...
showtime render <job>/project --job tidepool-trailer                 # final.mp4 (40.1 MB)
showtime qa tidepool-trailer                                         # PASS
showtime deliver exports tidepool-trailer --targets linkedin,x       # 13.2 / 13.4 MB
showtime qa <job>/exports/final.linkedin.mp4 --project <job>/project --platform linkedin
showtime review-pack <job>/exports/final.linkedin.mp4 --project <job>/project --platform linkedin     # round 1 -> name shown early
showtime check <job>/project
showtime render <job>/project --job tidepool-trailer                 # final-2.mp4
showtime qa tidepool-trailer
showtime deliver exports tidepool-trailer --targets linkedin
showtime review-pack <job>/exports/final-2.linkedin.mp4 ...          # round 2 -> quiet intro
showtime audio mix <job>/project/audio/mix.json -o <job>/project/work/mix-test.wav   # x3, balancing the drone
showtime render <job>/project --job tidepool-trailer                 # final-3.mp4
showtime qa tidepool-trailer                                         # PASS
showtime deliver exports tidepool-trailer --targets linkedin         # final-3.linkedin.mp4 -> first shipped version (replaced in round 4)
showtime qa <job>/exports/final-3.linkedin.mp4 --project <job>/project --platform linkedin   # PASS
showtime review-pack <job>/exports/final-3.linkedin.mp4 --project <job>/project --platform linkedin --force-round   # round 3 = the shipped file
showtime deliver poster <job>/final-3.mp4 --at 18.5 --out <job>/work/poster-readme.jpg
showtime studio board tidepool-trailer                               # rev 5, phase review
showtime studio export tidepool-trailer --inline                     # studio-board.html
showtime job note tidepool-trailer --stage build / --stage qa ...
showtime studio stop tidepool-trailer ; showtime preview <job>/project --stop

# review round 4: an external critic reviewed the shipped final-3.linkedin.mp4
showtime snap <job>/project --at 1.5,9.55,12.62,13.9,15.4,15.6,19.0 --width 960 --format jpg --sheet -o <job>/work/review4/before
showtime demo record <job>/work/demo-src/reveal-plate.mjs <job>/work/plates-reveal --serve APP --dpr 1 --fps 10 --no-mp4   # Q4 note open
#   (edited index.html: app-reveal plate, one-path water, Sync hold, disclaimer, hook push-in, 9.5 s framing; mix.json: clicks + duck, whoosh)
showtime snap <job>/project --at ... --sheet -o <job>/work/review4/try1   # x3, checking the tide and the sun
showtime audio mix <job>/project/audio/mix.json -o <job>/project/work/mix.wav --check   # x2 (duck 4 dB, then 6 dB)
showtime check <job>/project                                         # PASS, 0 warnings
showtime render <job>/project --job tidepool-trailer                 # final-4.mp4 (38.6 MB)
showtime deliver exports tidepool-trailer --targets linkedin         # final-4.linkedin.mp4 -> shipped as final.mp4
showtime qa tidepool-trailer                                         # PASS
showtime qa <job>/exports/final-4.linkedin.mp4 --project <job>/project --platform linkedin   # PASS
showtime snap <job>/project --at 1.5,9.55,12.62,13.9,15.4,15.6,19.0 --width 960 --format jpg --sheet -o <job>/work/review4/after
showtime deliver poster <job>/final-4.mp4 --at 18.5 --out <job>/work/poster-readme.jpg
showtime studio board tidepool-trailer --from <job>/work/review4/board-r6.json   # rev 6
showtime studio export tidepool-trailer --inline
showtime job note tidepool-trailer --stage feedback --verified "round 4 (external critic) applied: ..."

# review round 5: the critic's second look said "ship"; cheap polish applied
showtime snap <job>/project --at 12.9,12.933,12.967,13.0,13.033,13.067,13.1,18.5 --width 960 --format jpg -o <job>/work/review5/before
#   (edited index.html: eased pull-back start + motion blur, end-card hierarchy; share.txt wording)
showtime snap <job>/project --at 12.9,12.967,13.0,13.067,13.1,13.167,13.3,14.2,18.5 --width 960 --format jpg -o <job>/work/review5/after
showtime check <job>/project                                         # PASS, 0 warnings
showtime render <job>/project --job tidepool-trailer                 # final-5.mp4 (38.2 MB)
showtime deliver exports tidepool-trailer --targets linkedin         # final-5.linkedin.mp4 -> shipped as final.mp4
showtime qa tidepool-trailer                                         # PASS
showtime qa <job>/exports/final-5.linkedin.mp4 --project <job>/project --platform linkedin   # PASS
showtime deliver poster <job>/final-5.mp4 --at 18.5 --out <job>/work/poster-readme.jpg
showtime job note tidepool-trailer --stage feedback --verified "round 5 (critic polish) applied: ..."
```

## Timings

The machine was a 6-core Intel i5 Mac (macOS 15), shared with about three other example jobs.

| step | time |
|---|---|
| `doctor --quick` | 11.2 s |
| `demo record` dark plates (79 frames at 3840x2160) / light plates (104 frames) | 37.7 s / 56.7 s |
| `audio compose` 10 s beds (x4) / 20 s score | 8.6-13.5 s each / 7.4 s |
| `studio frame` 3 style frames / 10 storyboard thumbs from the project | 22.4 s / 6.4 s |
| `studio board` / `studio export --inline` | 0.2 s / 0.5 s |
| `snap --every 1` (20 frames) | 29.8 s |
| `check` full / `--no-timeline` | 38-42 s / 14 s |
| animatic render (960x540, `--preview --scale 0.5`) | 35.7 s and 38.0 s |
| final render 1 / 2 / 3 / 4 / 5 (1920x1080, CRF 16) | 2 min 21 s / 1 min 20 s / 58 s / 57 s / 1 min 10 s |
| final render 3 in detail | capture 17.6 s (34 fps), encode 33.8 s |
| `deliver exports` linkedin | 38-44 s |
| `demo record` the round-4 reveal plate (10 frames) | 19.7 s |
| `qa` | 7-16 s |
| `review-pack` | 22 s |

The CRF 16 master came out at 38.2-40.1 MB, because the macro blur and film grain are expensive to
encode. The shipped file is the LinkedIn export (`deliver exports`: CRF 20, capped at 10 Mbps), at
12.2 MB. The first full render ran while the machine was busy: capture ran at 8.6 fps against the
estimate from `check` of about 41 s.

## QA

`showtime qa` on the shipped file (`final-5.linkedin.mp4`, `--platform linkedin`) gave
**verdict PASS (0 fail, 0 warn, 0 note)**:

- file: h264 High, yuv420p, 1920x1080, 30 fps, faststart, BT.709; the aspect fits LinkedIn
- duration: 20.00 s, which matches `showtime.json`
- loudness: **-13.9 LUFS** integrated, **-1.5 dBTP** true peak
- no silent gaps, no black stretches, no frozen stretches over 2.5 s, and frame 0 has a picture
- no attribution required

The CRF 16 master (`final-5.mp4`) also passed (0 fail, 0 warn); its mix measured -14.1 LUFS before
encoding. The round-5 changes are picture-only, so the mix is the round-4 mix. `showtime check` on the
project: PASS with 0 errors and 0 warnings. The two notes were edge-only anti-aliasing noise and
"11 elements use large blur" (the depth-of-field layers).

**Review.** The review pack has three rounds, and round 3 was the file shipped first. No sub-agent
tool was available in that session, so each round was self-reviewed against the seven questions in
`CRITIC.md`. What those rounds found and fixed:

1. At 9.5 s and 12.0 s, UI copy showed "Tidepool" ("Tidepool keeps your notes…", "Welcome to
   Tidepool") before the name card, which breaks the trailer rule. Those fragments were reframed to
   "everything you write is saved in this browser.", `#planning` in the Q4 note, and "Notes on
   local-first software".
2. The hook sat at -20.7 LUFS against -12 at the drop (LRA 8.8). A low D drone under the first 9 s
   fixed it. The sections now measure -19.1 / -16.5 / -13.4 / -12.0 / -13.2 LUFS (LRA 5.9).

The round-3 self-review said "ship" and claimed the name was withheld until 16.5 s. That was
wrong, and an external critic caught it (next section). `FINDINGS.md` in the job now carries an
erratum.

## Review round 4 (external critic)

A critic looked at the shipped `final-3.linkedin.mp4` (and measured it again: -14.06 LUFS,
-1.49 dBTP) and said **ship after fixes**. Each finding was checked with `showtime snap` at the
cited time before anything changed, and every one was confirmed. Blockers went first. Before/after
stills are in the job at `work/review4/before-after.jpg`, and the round is logged in
`work/feedback.md` and as D-010 in `studio/decisions.md`.

1. **Blocker, 13.0-15.9 s: the name showed before the end card.** The pull-back landed on the
   "Welcome to Tidepool" note, so the name was readable five times: the sidebar logo, the
   breadcrumb, the H1, the list title and the body. The reveal plate was recorded again
   (`project/capture/reveal-plate.mjs`, `?notebook=work&note=q4-planning`), and the reveal and
   sink use it (`plates/app-reveal.jpg`). Only the app's own small sidebar logo is left, and this
   README now says so rather than claiming the name is fully withheld.
2. **Should-fix, 15.3-20 s and the poster: the water was a flat rectangle with a straight seam
   under the wave, and a sliver of sun showed below the troughs.** The sky gradient also had a hard
   step at the same height. Now one wave path, recomputed every frame, is the stroke, the water's
   top edge and the clip for the sun's reflection. The sky is a smooth gradient, and the poster was
   re-shot.
3. **Should-fix, 15.3-15.9 s: a muddy double exposure while the app sank** (the water faded in over
   0.55 s, so the app showed through). The water is opaque now. It rises from below the frame to the
   tide line over 0.55 s while the app sinks, and the sun rises behind the app, under the water.
4. **Should-fix, 12.6 s: the "Sync: local only" callback lasted about 2 frames.** It now holds
   sharp from 12.60 to 12.90 s (9 frames). The whoosh peak moved from 12.95 to 13.15 s, and the
   boom stays on 12.60.
5. **Should-fix, 18-20 s: the fictional-app line could not be read on a phone and sat in the
   player-controls strip.** It went from 28 px grey at a baseline of about y 1020 to 40 px #B8C9CC
   with a baseline of about y 950, shortened to "Tidepool is a fictional app: showtime sample
   material." The name and the tagline moved up 24 px.
6. **Should-fix, 4.46-5.01 s: the six key clicks were masked by the score.** The clicks went from
   -9/-10 dB to -3 dB, and the score ducks 6 dB under the click tracks. Above 2.5 kHz, the clicks
   now sit at -20 to -27 dBFS over a bed at -45 to -50. The unrelated score hit at 5.06 s came down
   5 dB.
7. **Polish, 0-2.5 s: the hook is low-energy.** Partly done: the push-in is stronger (scale 2.18 to
   2.85, was 2.52). The hook still shows only the status line, because it is the reviewer's
   approved hook. It was not trimmed.
8. **Polish, 9.5 s: raw Markdown and a leftover name.** This fragment is now framed on the
   rendered preview ("device. There is no account and no server: everything you write is saved in
   this browser."). The line above it is out of focus and cut off by the frame edge.

After the fixes: `check` PASS (0 warnings), `qa` PASS on `final-4.mp4` and on the shipped
`final-4.linkedin.mp4` (-13.9 LUFS, -1.5 dBTP). Section levels: hook -19.1, fragments -16.9,
build -13.3, drop -11.9, name -13.2 LUFS. The critic's review was the fourth pass, so no new
`review-pack` round was built for it (the pack limits itself to two rounds, see `review.md`).

## Review round 5 (critic polish)

The critic reviewed the round-4 file (`final-4.linkedin.mp4`, measured at -13.86 LUFS, -1.47 dBTP)
and said **ship**. It confirmed every round-4 fix frame by frame and found no blocker and no
should-fix. It left four optional polish notes. Each was checked with `showtime snap` first
(`work/review5/before-sheet.jpg` in the job), and the cheap ones were applied. The before/after
stills are in `work/review5/before-after.jpg`, and the round is logged in `work/feedback.md`.

1. **Polish, 12.90-13.05 s: the pull-back start jumped.** In its first frames the camera moved
   about a third of the frame per frame, with no motion blur, across the mostly empty tag panel.
   Confirmed: the old expo curve moved about 680 px on the first frame. The move now eases out of
   "Sync: local only" over its first few frames and then decelerates as before, landing at the same
   time. The fastest frame is now about 270 px at about 13.10 s, on the whoosh (peak 13.15 s). A
   light blur of up to 4 px follows the camera speed, only in this shot.
2. **Polish, 17.4-20 s: the fictional-app line out-shone the tagline.** Confirmed at 18.5 s (40 px
   #B8C9CC against the tagline's 44 px #9DB4B9). The line is now 36 px #9FB3B6 (still far above
   4.5:1 on the water), and the tagline is a little brighter (#B4C7CA). So the order is the name,
   then the tagline, then the disclaimer. The poster was re-shot at 18.5 s.
3. **Polish, 0-2.5 s: at 1.5 s the hook is only a status line.** Not changed. It is the
   reviewer's approved hook (in round 1 they asked to keep "Sync: local only" as the opening),
   and the critic also suggested leaving it.
4. **Polish, `share.txt`: "Every shot is the real app"** was not true, because the two serif title
   cards are not app shots. It now reads "Every app shot is the real app, in macro, until the last
   few seconds."

After the changes: `check` PASS (0 warnings), `qa` PASS on `final-5.mp4` and on the shipped
`final-5.linkedin.mp4` (-13.9 LUFS, -1.5 dBTP, 0 fail, 0 warn).

Before the render, `check` flagged both title cards as `short_text`: about 1.1 s of reading time for
20-21 characters. The cards were lengthened to 1.77 s and 1.88 s, and they blur in over 0.4 s.

## Notes and deviations

- **`demo record --dpr` wrote 1x frames.** With `--dpr 4`, 3 or 2, the frames came out 1280x720,
  although `events.json` reported a 5120x2880 `frame_size`. The workaround is in
  `project/capture/*.mjs`: record a 3840x2160 viewport and zoom the page 3x
  (`document.documentElement.style.zoom = 3`, with the app pinned to 720 px tall). The layout is the
  same as 1280x720 at 3x.
- **The palette in the plates** sits a little lower than in a normal window, because of the zoom.
  It is still the app's own rendering.
- **The task tick** was triggered with the checkbox's own `click()` in the demo script, not with a
  mouse move. There is no cursor in a macro shot, and the app handles the event exactly as it
  handles a click.
- **The typed word "export" and the checked task** are the only user actions in the video. Every
  other string is seed-note content or UI copy from the app. There are no numbers, stats or quotes.
- **Style-frame compositions** (`studio/comps/*.html`) load their plates from `../media/plates/`.
  To re-render them, copy `project/plates/*` (plus `light-*.jpg`, which the demo scripts produce)
  into `<job>/studio/media/plates/`.
- **Look round skipped** (logged as `assumed`, D-006). The picked concept came with its look, and
  `studio.md` marks the look phase as optional.
- **No voice-over and no data.** It is a titles-only trailer, so there is no voice script.

## Sources and licenses

- **Product, copy and UI:** `examples/_apps/tidepool` (fictional, part of this repo). The plates in
  `project/plates/` are frames recorded from it by `project/capture/trailer-plates.mjs`, and
  `app-reveal.jpg` by `project/capture/reveal-plate.mjs`. `logo.svg`
  is the app's logo.
- **Fonts:** Inter, Instrument Serif and JetBrains Mono, all under the SIL Open Font License 1.1.
  The license files are in `project/fonts/*/LICENSE.txt`.
- **Music and sound effects:** generated on this machine by `showtime audio`: `compose` and the
  procedural effects. They are not library tracks, so there is no CC-BY and no `credits.txt`.
- **Runtime:** the stage clock, the `kinetic-type` and `grain` components and the studio board
  page are showtime's own.
