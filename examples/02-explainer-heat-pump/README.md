# 02 · Explainer: how a heat pump heats a home in winter (45 s)

![poster](poster.jpg)

**Video:** [`final.mp4`](https://github.com/FavioVazquez/showtime-examples/releases/download/examples-media-v1/02-explainer-heat-pump--final.mp4) · 1920x1080 · 30 fps · 45.00 s · 15.5 MB · -14.0 LUFS / -1.5 dBTP
· sidecar captions [`captions.srt`](captions.srt)

**Web page:** [`heat-pump.html`](heat-pump.html) · one file, 1.0 MB · plays offline · 9 chapters (see "Web page" below)

## The request

> "Make a 45-second explainer video with voiceover about how a heat pump heats a home in winter"
> Canvas film look, procedural score, Kokoro English narration, 1920x1080. Facts must be accurate
> (refrigerant cycle: evaporator absorbs heat outdoors, compressor raises temperature, condenser
> releases heat indoors, expansion valve).

**Mode:** quick (no questions asked). Assumptions stated up front and logged in the job:
a canvas film drawn with `Film` in the `film` look (static grain, so the file stays small), voice
`af_heart`, a quiet procedural score in D minor that turns to D major when the heat reaches the
room, sidecar captions for YouTube, and an illustrative 21 °C / 70 °F indoor set point.

## What it demonstrates

- **An explainer built from the voice.** The script was written as one line per scene, fitted to
  45 s with `voice script --fit` (105 words, speed x0.98), and every cut and reveal in `cues.js` is a
  `slot.start` or word `start` from `voice/timeline.json`: "EVAPORATOR" appears as "Outside" is
  spoken, the gas/liquid tags as "boils", the pressure tag as "squeezes", and so on.
- **A diagram that is a real mechanism.** The refrigerant loop is one path, sampled by arc length.
  Dots ride it with colour for temperature (cold blue, pale blue after the evaporator, red after
  the compressor, amber liquid after the condenser, blue again after the valve) and spacing for
  density: they bunch up as liquid and spread out as gas, because the dots are evenly spaced in a
  phase coordinate weighted by specific volume. It is all a pure function of time, so `check`'s
  determinism probe passes and 3 render workers can start mid-film.
- **One stage, one spine.** A snowy night, the outdoor unit, and a cutaway of the house. The hook
  opens on the outdoor unit and the question (0 °C outside, 21 °C inside). A zoom-through into the
  air shows why freezing air still holds heat (moving molecules, a 0 °C marker 273 degrees above
  absolute zero), and the camera then visits the four components in cycle order and pulls back for
  the recap "and the loop repeats".
- **Honest energy accounting at the payoff.** "Heat from outside air" + "electricity in" (the
  compressor's power cable) = "heat out" into the room. The narration says "usually", and no
  efficiency number is invented.
- **A score that follows the story.** Cold D minor bells in the hook, a 16th-note arp for the
  molecules, a pulse that starts when the refrigerant starts circling, a riser that lands on
  "shoots up", a warm F major lift in the condenser, a filter dip on "drops the pressure", and the
  hook's motif answered on the tonic in D major, with a bell "button" on the end card. In the final
  mix the score sits at about -26 LUFS, about 12 dB under the -14 LUFS narration, and comes up to
  about -20 LUFS on the end card, where there is no voice (see the review round below).

## Commands, in order

`showtime` is `skills/showtime/bin/showtime`. `<job>` is `showtime-out/heat-pump-explainer-20260926-134329`.

```bash
showtime doctor --quick
showtime job init heat-pump-explainer --platform youtube \
  --goal "Make a 45-second explainer video with voiceover about how a heat pump heats a home in winter"
showtime new film <job>/project --title "How a Heat Pump Heats Your Home" --duration 45

# voice first: the script sets the timing
showtime voice ipa "refrigerant Celsius condenses evaporator compressor seventy-three"   # all fine, no lexicon
showtime voice script <job>/project/narration.md -o <job>/project/voice --lead-in 0.35 --fit 45
#   first draft: 118 words, needed speed x1.14 (too fast for an explainer) -> cut to 105 words
showtime voice script <job>/project/narration.md -o <job>/project/voice --lead-in 0.35 --fit 45
#   44.58 s at x0.98; slot starts + word starts copied into cues.js

# picture, score, first look
showtime score <job>/project                      # -33.8 LUFS raw: ~20 dB under the voice once mixed
showtime check <job>/project                      # PASS; 8 edge notes -> text moved inside 5 %
showtime snap <job>/project --every 2             # label collision, camera framing -> fixed
showtime snap <job>/project --at 2.5,9.8,24,44.2
showtime snap <job>/project --at 17,19.5,22.5,24.5,27,30,33.5,36.8,38.5 --sheet --thumb 640 --cols 3
showtime job note <job> --stage plan ...
showtime captions <job>/project/voice/vo.words.json --style clean --aspect 16:9 \
  -o <job>/captions.ass --srt <job>/final.srt
showtime check <job>/project                      # PASS, 0 errors, 0 warnings

# final (three renders; renders never overwrite)
showtime render <job>/project --job <job>         # final.mp4: 82 MB at the default crf 16
showtime qa <job>                                 # PASS, but too big for the repo
showtime render <job>/project --job <job> --crf 22 --x264-preset slow --format png   # final-2.mp4: 28.2 MB
showtime render <job>/project --from 26 --to 32 --crf 24 --x264-preset slow --format png \
  --poster none -o ../hp-tests/a.mp4              # A/B: grain 0.05 -> 3.0 MB for 6 s
#   (index.html: grain 0.05 -> 0.03, dust 0.18 -> 0.10)
showtime render <job>/project --from 26 --to 32 --crf 24 --x264-preset slow --format png \
  --poster none -o ../hp-tests/b.mp4              # grain 0.03 -> 2.5 MB for 6 s
showtime render <job>/project --job <job> --crf 25 --x264-preset slow --format png   # final-3.mp4: 15.6 MB (round 1)

# verify, deliver
showtime qa <job>                                 # PASS on final-3.mp4
showtime review-pack <job>
showtime job note <job> --stage verify ...
showtime job note <job> --stage deliver ...

# review round 2 (see "Review round" below)
showtime snap <job>/project --at 3.6,9.6,10.42,20.5,23.7,36.2,40.5,44.2 --width 960 --format jpg \
  -o <job>/work/review-r2/before                   # confirm each note before touching anything
#   (scenes.js, cues.js, score.js, showtime.json edited; final.srt cues 7/8 and 11/12 rebalanced)
showtime score <job>/project -o ../hp-r2/score-r2b.wav   # -24.3 LUFS raw (was -33.8)
showtime snap <job>/project --at ... -o <job>/work/review-r2/after
showtime check <job>/project                      # PASS, 0 errors, 0 warnings
showtime render <job>/project --job <job> --crf 25 --x264-preset slow --format png --poster none   # final-4.mp4: 15.5 MB (round 2)
showtime qa <job>                                 # PASS on final-4.mp4
showtime deliver poster <job> --at 3.6 --out <job>/final-4.poster.jpg   # thumbnail only, not baked
showtime review-pack <job>                        # review/round-2/
showtime job note <job> --stage feedback --verified "round 2 applied ..."

# review round 3: polish from the critic's pass on final-4.mp4 (see "Review round" below)
showtime snap <job>/project --at 4.1,4.2,4.3,10.33,10.37,33.5,37.0,42.4 --format jpg \
  -o <job>/work/review-r3/before                   # confirm each note first
showtime snap <job>/project --at 10.4,10.433,10.467,10.5,10.533,10.6,10.667,10.733 --sheet --thumb 480 \
  --cols 4 --format jpg -o <job>/work/review-r3/before/zo   # the zoom-out, frame by frame
#   (scenes.js edited; final.srt cue 17 now ends at 42.6 s)
showtime check <job>/project                      # PASS, 0 errors, 0 warnings, 2 info notes (hook text near the top edge)
showtime snap <job>/project --at 3.6,3.9,4.1,4.2,4.3,33.0,33.5,34.7,37.0 --format jpg -o <job>/work/review-r3/after
showtime render <job>/project -o <job>/final.mp4 --poster none   # final-5.mp4: forgot the size flags, and the
#   offline score failed under load ("Target page ... has been closed"), so it came out silent: not used
showtime render <job>/project -o <job>/final.mp4 --poster none --format png --crf 25 --x264-preset slow \
  --workers 2                                     # final-6.mp4: 15.5 MB, audio -14.0 LUFS (shipped)
showtime captions <job>/work/review-r3/captions.src.srt --style clean --size 1920x1080 \
  -o <job>/captions.ass --srt <job>/final.srt     # the .ass is right; the .srt came back regrouped,
#   so final.srt was put back from captions.src.srt by hand
showtime qa <job>                                 # PASS on final-6.mp4
showtime deliver poster <job> --at 3.6 --out <job>/final-6.poster.jpg
```

`share.txt` was written by hand from `references/platforms.md`. `deliver exports` was not used for
size: its lowest 16:9 target (LinkedIn, 10 Mbps) would still be about 56 MB for 45 s, so the size
came from the render's own `--crf` and `--format png` settings.

## Timings (6-core Intel i5 Mac, CPU shared with three other renders)

| Step | Time |
|---|---|
| `voice script --fit 45` (8 lines, Kokoro) | 90 s first draft, 51 s after the cut |
| `showtime score` (offline score only) | 1 m 19 s |
| `check` | 33-47 s |
| `snap --every 2` (23 frames) | 29 s |
| `render` default (jpeg capture, crf 16) | 1 m 56 s (capture 43 s, encode 1 m 08 s) |
| `render --crf 25 --x264-preset slow --format png` | 3 m 08 s round 1; 3 m 11 s round 2 (capture 1 m 53 s, encode 1 m 14 s, load average ~100); 3 m 57 s round 3 with `--workers 2` (capture 2 m 29 s, encode 1 m 24 s) |
| `qa` | 14-22 s |
| `review-pack` | 41 s |

## QA

`showtime qa` on the shipped file (`final-6.mp4`): **PASS (0 fail, 0 warn, 0 note)**. h264 High yuv420p
BT.709 with faststart; 45.00 s matches `showtime.json`; -14.0 LUFS integrated, true peak -1.5 dBTP; audio
from 0.00 s to 44.95 s with no silent gaps; no black or frozen stretches; frame 0 is the hook (no baked
poster); both caption files (17 cues) pass; no attribution required. `check` before the final: PASS,
0 errors, 0 warnings (deterministic, no network, fonts embedded, contrast OK for 49 text elements), plus
2 info notes: the hook's "0 °C" sits within 5 % of the top edge at 2.5 s during the slow push-in.

## Review round

Round 1 (`review/round-1/`) went to a critic, whose verdict was **ship after fixes**: no blockers, 4
should-fix and 8 polish notes. Each note was checked against a snap before anything changed. All 12
were applied in one re-render, and `review/round-2/` holds the pack for the new final.

- **Score was too quiet.** It measured -34.4 LUFS against a -14.0 LUFS voice, about 21 dB under,
  so the riser and the end-card button were close to silent. The fix raised the master gain 9 dB and
  lifted the molecule section. A shimmer and chime now fill the 9.9-10.5 s breath, and the music bus
  ramps up 5 dB into the end card. It now measures -26.1 LUFS over 0-42 s (about 12 dB under the
  voice), -25.5 LUFS in the gap (was -42.5) and -20.4 LUFS on the end card (was -33.0). The critic
  asked for 10-12 dB; the skill's guidance says 18-25 dB. 21 dB was inaudible in practice, so the
  mix settled at about 12 dB.
- **Payoff headline was wrong.** "Moves heat. / Doesn't make it." contradicted the "electricity
  in" arrow in the same frame, because the compressor's electricity does become delivered heat. It
  now reads "Moving heat / beats making it.", the narration's own line. `share.txt` was reworded to
  match.
- **Absolute-zero subline was wrong.** "−273 °C · no motion" became "−273 °C · minimum motion",
  which is correct and matches the facts below.
- **Frame 0 flashed the end card.** The baked poster put a single end-card frame before the hook. The
  film is now rendered with `--poster none`, so frame 0 is the hook. `poster.jpg` is the hook at 3.6 s,
  written as a separate thumbnail.
- **Polish:**
  - A "HOW A HEAT PUMP WORKS" kicker now appears in the hook, and the end-card title comes in at
    42.0 s (was 42.6).
  - The evaporator camera is slightly wider, and the "liquid" tag moved up, so the tag is inside the
    5 % margin and the valve is in frame.
  - The "heat out" tag and arrow moved inside the right margin.
  - The COMPRESSOR badge is raised clear of the unit's snow roof.
  - The molecule overlay fades out before the pull-back, so there is no double exposure.
  - The recap's flow chevrons sit only on the straight pipe runs.
  - The "?" is 1.5x larger and sits on the arc's midpoint.
  - Caption cues 7/8 and 11/12 were rebalanced at the clause breaks, with no one-line orphans. This
    was hand-edited in `captions.srt` because `showtime captions` regroups the words.

A second critic pass then reviewed the round-2 final (`final-4.mp4`). Its verdict was **ship**: no
blockers and no should-fix notes. It confirmed all 4 should-fix fixes and 7 of the 8 polish fixes. The
eighth, the "heat out" tag, is fixed but clears the right margin by only about 6 px. It also listed 6
cheap polish notes. Each note was checked against a snap first, and all 6 were applied in one
re-render (`final-6.mp4`):

- **Hook dissolve (4.1-4.3 s).** The hook's readings, arc and "?" showed faintly over the molecules
  during the zoom-in. They now fade out at 3.75-4.0 s, before the dissolve starts. The 3.6 s poster
  frame is unchanged.
- **Zoom-out (about 10.35 s).** For two frames the outdoor unit read as a hard-edged box inside the
  molecule field. The dissolve is shorter (0.5 s to 0.36 s), and the diagram comes in through a quick
  focus pull (14 px blur to sharp by 10.66 s), so the box has no hard edge.
- **Caption cue 17.** It ran at about 18 characters per second. It now ends at 42.6 s instead of
  42.27 s, while the end card holds. Cue 2 was left as the critic suggested.
- **"low pressure" tag (33.0-33.9 s).** The box showed an empty second line until "cold". It now
  starts as a one-line box and grows downward when "cold" arrives.
- **Recap badge (35.5-37.6 s).** The "4 EXPANSION VALVE" badge overlapped the evaporator coil's right
  edge. It moved 32 px right and now clears the coil by 16 px. It could not move the suggested 60 px:
  the unit has only about 430 px between the coil and the house wall, and the badge is 464 px wide. As
  before, it slightly overlaps the wall.
- **This README.** The line that said no second critic pass was run is replaced by this section, and
  three before/after pairs (before on the left, after on the right) are in [`review/`](review/):
  [payoff headline, round 2](review/r2-payoff-headline-44.2s.jpg),
  [hook dissolve, round 3](review/r3-hook-dissolve-4.2s.jpg) and
  [recap badge, round 3](review/r3-recap-badge-37.0s.jpg).

Every round is logged in the job's `work/feedback.md`. The full sets of stills are in the job folder
(`work/review-r2/pairs/`, `work/review-r3/pairs/`), which is not in the repo.

## Web page (HTML)

[`heat-pump.html`](heat-pump.html) is the same film as a single, shareable web page, made on
2026-09-28 from `project/` with:

```bash
showtime voice script project/narration.md -o project/voice --lead-in 0.35 --fit 45   # the WAVs are not kept (see Licenses)
showtime export html project --target artifact -o heat-pump.html
```

- **What is in it:** the canvas film drawn live by the same runtime as the render, the `Synth` score and
  the narration mixed and packed as AAC 96k (567 KB, -14.0 LUFS), Inter and Instrument Serif as font
  bytes, a player with 9 chapters (the film's acts), keys and a start screen. 1.0 MB of the 16 MB
  artifact limit; 30 s to export on a Linux x64 machine.
- **Voice:** the WAVs were rebuilt with the command above (Kokoro, same voice and speed x0.98). The
  line and word starts come within 50 ms of the shipped `voice/timeline.json`, which `cues.js` follows,
  so the cues are as in the MP4 to within 50 ms. `voice/*.json` in the project are the shipped files.
- **Checked headless** (Chrome, network blocked): opened from disk at 1280x720 and at phone width
  (390x844, touch), and inside a sandboxed frame (`allow-scripts` only) on another origin with a strict
  Content-Security-Policy (inline styles only, no font URLs), at both sizes. In every case there were
  0 requests beyond the file itself, no page errors, playback advanced 2.4 s in 2.5 s with the sound
  playing, and all 9 chapters were listed. In the sandboxed frame the film's fonts (Inter Variable,
  Instrument Serif) loaded from the inlined bytes and the page used no stylesheet links. At phone width
  the picture sits on top with the title, the Play button and the chapter list under it.
- The file carries its own Content-Security-Policy (`default-src 'none'`) and no absolute paths.

## Facts and sources

The narration and labels stick to the textbook vapor-compression cycle in heating mode:

- Outdoor coil = **evaporator**: the refrigerant runs colder than the outdoor air, absorbs heat and
  evaporates (boils) into a low-pressure gas.
- **Compressor**: raises the gas's pressure and temperature, and uses electricity to do so.
- Indoor coil = **condenser**: the hot gas gives up heat to the room air and condenses into a liquid.
- **Expansion valve**: drops the pressure, so the liquid turns cold and the cycle repeats.
- 0 °C = 273.15 K, so freezing air is about 273 degrees above absolute zero, where molecular motion
  is at its minimum.
- A heat pump delivers the heat it absorbs outdoors plus the compressor's electrical input, so it
  usually gives more heat than the electricity it uses. The film says "usually" and shows no number.

References: U.S. Department of Energy, Energy Saver, "Heat Pump Systems" and "Air-Source Heat
Pumps" (energy.gov/energysaver); any introductory thermodynamics text on the vapor-compression
refrigeration cycle. The diagram is a schematic and not to scale (it says so on the end card). The
compressor and valve are drawn in the outdoor unit, the usual split-system layout. Defrost cycles
and the reversing valve (summer cooling) are left out for length.

## Licenses

- Narration: Kokoro-82M v1.0 (Apache-2.0) via kokoro-onnx (MIT), voice `af_heart`. The voice is
  synthetic; `share.txt` says so.
- Music and sound: `Synth` procedural score rendered on the machine, with no samples and no
  library items, so there is no credit line (`qa`: no attribution required).
- Fonts: Inter and Instrument Serif (SIL OFL 1.1), loaded from Fontsource packages installed by
  `showtime setup`.
- `project/voice/` keeps `timeline.json`, `vo.words.json` and `vo.srt`. The WAVs are left out:
  `showtime voice script project/narration.md -o project/voice --lead-in 0.35 --fit 45` rebuilds
  them, the same as above.
