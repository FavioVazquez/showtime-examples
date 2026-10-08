# 08 · Beat-synced montage: "Look Up" (NASA photos, 20 s)

![poster](poster.jpg)

**Video:** [`final.mp4`](https://github.com/FavioVazquez/showtime-examples/releases/download/examples-media-v1/08-beat-montage--final.mp4) · 1920x1080 · 30 fps · 20.00 s · 13.6 MB · -14.0 LUFS / -1.6 dBTP

## The request

> "Make a 20-second beat-synced montage of space photos"
> Public-domain NASA images via `showtime assets media search`, music from the showtime library
> (`showtime audio lib search`) or `audio compose`, cuts on the beat grid (`audio beats`), ken-burns
> motion, title and end card, 1920x1080. Include credits.txt if the music is CC-BY.

**Mode:** quick (no questions asked). The opening line stated the assumptions: 16:9 1920x1080 at 30 fps,
20.0 s, no voice-over, NASA public-domain photos only, a produced library track rather than a composed
bed, and cuts on the beat grid, one to two frames early.

## What it demonstrates

- **Picture cut to a real recording's beat grid.** `audio beats` analysed Kevin MacLeod's "At Launch"
  (102.1 bpm, `pacing: beat_cut`). The cut rate follows the track's energy map. In the quiet intro there is
  one shot per bar (2.35 s). When the energy rises at 9.45 s there is a shot every two beats. In the HIGH
  section there is one shot per beat, four in a row, which is 1.7 cuts per second and inside the flash-safety
  limit. The end card lands on the downbeat at 16.51 s: its white flash peaks at 16.50 s, on the impact. Each scene starts on the last whole frame that is at
  least 33 ms before its beat, so the picture changes 1-2 frames ahead of the sound. The grid is in
  `project/data/at-launch.beats.json`.
- **A library track fitted to length inside the mix.** `audio/mix.json` points at the library id with
  `"fit": true`. The mix trims the track on the 18.85 s downbeat with a short decay (the same result as
  `audio fit`), and adds one low impact under the end-card hit. The track is CC BY 4.0, so `render` wrote the
  credit file and `qa` checked it ("credits.txt lists all 1 required attribution").
- **Match cuts on the beat.** Earth, the Sun and Mars are shown as whole discs with `ken-burns`
  `fit: contain`, each about 860-940 px tall and centred, so the cuts on the beat read as one globe turning
  into the next. Jupiter follows at the same height, but Cassini's portrait is a gibbous, half-lit globe, so
  it is centred on its lit body rather than on the full disc. The SDO frame's corona runs into the edges of
  its square image, so it sits in a centred square with a soft round mask. A second mask on the image itself
  fades out about the bottom 5-8 % (fully transparent to 4.4 %, fully opaque from 8 %), where the instrument
  timestamp is.
- **Stock licence checking that goes beyond the search result.** Three Juno images (PIA26077, PIA21773,
  PIA21376) came back from the NASA source marked "public domain". Their NASA author or description fields
  say they were processed by citizen scientists (PIA26077's says CC BY-NC-SA, PIA21376's says CC-BY), so they
  were dropped. So was an ESA/Hubble Picture of the Week
  (ESA's own licence is CC BY 4.0). Every image used is credited by NASA, ESA, CSA or STScI.
- **Hitting a size budget.** The first master (crf 16, jpeg capture, film grain) came out at 54.6 MB. With the
  grain removed (the photos have their own noise) and a re-render using `--format png --crf 21 --x264-preset slow`
  it is 14.0 MB. It passed qa both times. The review-round re-render with the same settings is 13.6 MB.

## Shot list

| # | Starts | Beat | Image | Label on screen |
|---|---|---|---|---|
| title | 0.00 | downbeat | Earthset from Orion, Artemis II (art002e021278) | LOOK UP / Earthset · Artemis II · Orion · 2026 |
| 1 | 2.33 | downbeat 2.39 | Apollo 11 LM shadow (AS11-37-5505) | The Moon · Apollo 11 · 1969 |
| 2 | 4.70 | downbeat 4.74 | Blue Marble 2012, Suomi NPP VIIRS | Earth · Suomi NPP · 2012 |
| 3 | 7.07 | downbeat 7.11 | The Sun, SDO, 10 Sep 2025 (PIA26681) | The Sun · SDO · 2025 |
| 4 | 9.40 | downbeat 9.45 (cross-zoom) | Global Color Views of Mars (PIA00407) | Mars |
| 5 | 10.57 | beat 10.61 | Cassini Jupiter Portrait (PIA04866), gibbous | Jupiter |
| 6 | 11.73 | downbeat 11.77 | Cassini Saturn mosaic, 2004 (PIA06193) | Saturn |
| 7 | 12.93 | beat 12.98 | Pillars of Creation, Hubble near-infrared | Eagle Nebula |
| 8 | 14.10 | downbeat 14.14 | Bubble Nebula NGC 7635, Hubble | none (one beat) |
| 9 | 14.67 | beat 14.72 | Mystic Mountain, Carina Nebula, Hubble | none |
| 10 | 15.27 | beat 15.30 | Barred spiral NGC 1300, Hubble | none |
| 11 | 15.83 | beat 15.88 | Webb's First Deep Field, SMACS 0723 | none |
| end | 16.47 | downbeat 16.51 (flash peaks 16.50) | Cosmic Cliffs, Carina Nebula, Webb NIRCam | Keep looking up. + credits |

The one-beat shots carry no labels: a 0.6 s shot cannot be read (`check` flagged this on the first pass).

## Commands, in order

`showtime` is `skills/showtime/bin/showtime`. `<job>` is `showtime-out/space-montage-20260926-142145`.

```bash
showtime doctor --quick
showtime job init space-montage --mode quick --platform youtube \
  --goal "20-second beat-synced montage of public-domain NASA space photos ..." \
  --assumed "16:9 1920x1080, 30 fps, 20.0 s, no voice-over" \
  --assumed "Images: NASA public-domain photos found with assets media search" \
  --assumed "Music: a produced library track fitted to 20 s if one fits the mood; else a composed bed" \
  --assumed "Cuts land on downbeats (every bar in the build, every beat in a short burst), 1 frame early"

# music: pick a track, read its beat map, try the fit
showtime audio lib search --kind music --min-dur 30 --limit 60
showtime audio lib info incompetech-at-launch
showtime audio lib info incompetech-our-story-begins
showtime audio beats "<library>/incompetech-at-launch/At Launch.opus" -o <job>/work/music/at-launch.beats.json
showtime audio beats "<library>/incompetech-our-story-begins/Our Story Begins.opus" -o <job>/work/music/our-story-begins.beats.json
showtime audio fit "<library>/incompetech-at-launch/At Launch.opus" --dur 20 \
  --beats <job>/work/music/at-launch.beats.json -o <job>/work/music/at-launch-20.wav --json   # ends_at 18.855

# images: search, look at every preview sheet, fetch, check sizes
showtime assets media search "earthrise apollo 8" --source nasa --orientation landscape --limit 12 --preview <job>/work/search/earthrise.jpg
showtime assets media search "<query>" --source nasa --limit 12 --preview <job>/work/search/<query>.jpg
#   queries: blue marble earth, saturn cassini, jupiter juno, carina nebula webb, pillars of creation,
#   hubble galaxy, webb deep field, solar dynamics observatory sun, moon lunar surface,
#   mars perseverance panorama, orion nebula, earth night lights, mars curiosity mount sharp,
#   southern ring nebula, iss earth limb sunrise, stephan quintet, saturn natural color mosaic,
#   hubble spiral galaxy, mars global color view, curiosity vera rubin ridge panorama,
#   jupiter great red spot (--json), webb nircam (--json)
showtime assets media fetch nasa:<id> --project <job>/project          # 28 candidates fetched, 13 used
showtime assets media fetch nasa:<id> --quality orig -o <job>/work/orig/ # (returned the cached large file)
showtime assets sheet <job>/project/assets/media --labels name -o <job>/work/sheet.jpg   # sizes + low-res badges

# project
showtime new dom <job>/project --title "Look Up" --duration 20 --look template
showtime assets font "Space Grotesk" --weights 400,500,700 --copy-to <job>/project/fonts
showtime assets font "JetBrains Mono" --copy-to <job>/project/fonts
#   index.html rewritten: 13 scenes on the grid; audio/mix.json -> library track with fit
showtime audio mix <job>/project/audio/mix.json -o <job>/work/mix-test.wav   # report + credits
showtime audio meter <job>/work/mix-test.wav --windows 1

# first look, fix, look again
showtime check <job>/project                     # 11 WARN: labels too short-lived on 1-beat shots, kicker contrast
showtime snap <job>/project --at 0.4,1.9,3.5,... --sheet --cols 4 --thumb 480 -o <job>/work/snap1
#   fixes: ken-burns data-fit="contain" (CSS object-fit was overridden), shot counter removed,
#   names only on 2-beat shots, SDO disc masked, disc sizes matched, starts snapped to whole frames
showtime snap <job>/project --at 7.1,8.3,9.3 --sheet -o <job>/work/snap2
showtime snap <job>/project --at 4.72,7.08,9.5,10.58 --sheet -o <job>/work/snap3
showtime check <job>/project                     # 1 WARN (kicker length) -> shortened
showtime check <job>/project --no-timeline       # PASS, 0 warnings
showtime snap <job>/project --every 1 --cols 5 --thumb 360 -o <job>/work/snap4
showtime snap <job>/project --at 1.9,19.5 --width 1280 --format jpg -o <job>/work/snap5
showtime job note space-montage --stage first-look --verified "..." --next "render"

# final, verify, deliver
showtime render <job>/project --job space-montage                 # final.mp4, 54.6 MB (crf 16 + grain)
showtime qa space-montage                                         # PASS, but too big for the repo
#   grain removed; A/B on the densest 8 s:
showtime render <job>/project --from 12 --to 20 --format png --crf 20 --x264-preset slow --poster none -o <job>/work/ab-png-crf20.mp4
showtime render <job>/project --job space-montage --format png --crf 21 --x264-preset slow   # final-2.mp4, 14.0 MB
showtime qa space-montage                                         # PASS (final-2.mp4)
showtime review-pack space-montage
showtime job note space-montage --stage deliver --verified "..."

# review round (critic notes on final-2): confirm, fix, re-render, re-check
showtime snap <job>/project --at 7.1,7.5,9.37,9.44,9.47,11.1,12.5,16.37,16.43,18.2,1.5 --sheet -o <job>/work/r2-before
#   index.html: label fades around the cross-zoom, SDO strip mask, credit scrim + 29 px, Jupiter x +3.3,
#   Saturn 1.00 -> 1.04, flash 0.24 s at 16.4166, sub-labels 2.7cqmin
showtime snap <job>/project --at 7.1,7.5,9.2,9.3,9.37,9.44,9.5,9.6,9.8,11.1,12.9,16.43,16.47,16.5,16.53,18.2 --sheet -o <job>/work/r2-after
showtime check <job>/project                     # PASS, 0 warnings
showtime render <job>/project --job space-montage --format png --crf 21 --x264-preset slow   # final-3.mp4, 13.6 MB
showtime qa space-montage                                         # PASS (final-3.mp4)
showtime review-pack space-montage                                # round 2
showtime footage view <job>/final-3.mp4 --from 16.33 --to 16.63 --frames 10 -o <job>/work/r2-video/flash-view.png
showtime footage view <job>/final-3.mp4 --from 9.2 --to 9.6 --frames 12 -o <job>/work/r2-video/crosszoom-view.png
showtime job note space-montage --stage feedback --verified "round 2 applied ..."
```

The published `final.mp4` is the job's `final-3.mp4` (after the review round), and `poster.jpg` is `final-3.poster.jpg`. The poster
(1.9 s) is baked into frame 0.

## Timings

These were measured on a shared 6-core Intel i5-8500 while about three other renders were running.

| Step | Time |
|---|---|
| `doctor --quick` | 21 s |
| `audio beats` (185 s track / 85 s track) | 10 s / 4 s |
| `audio fit` | 15 s |
| `assets media search` (each) | ~2.5 s |
| `assets media fetch` (15 images) | 23 s |
| `audio mix` (library fit + synth impact) | 28 s |
| `check` (full timeline pass) | 53 s - 1 min 20 s |
| `check --no-timeline` | 29 s |
| `snap --every 1` (20 frames) | 13 s |
| `render` first master (jpeg, crf 16) | 1 min 38 s: capture 34 s at 17.7 fps, encode 38 s |
| `render` final (png, crf 21, slow) | 2 min 18 s: capture 1 min 19 s at 7.6 fps, encode 44 s |
| `render` review-round final (same settings) | 2 min 20 s: capture 1 min 16 s at 7.9 fps, encode 56 s |
| `check` (review round, full timeline) | 32 s |
| `qa` | 10 s |
| `review-pack` | 20 s |

## QA summary

`showtime qa` on the published file returned **PASS (0 fail, 0 warn, 0 note)**:

- file: h264 High, yuv420p, 1920x1080 at 30 fps, faststart, BT.709
- duration: 20.00 s, matching showtime.json
- aspect: fits YouTube
- loudness: -14.0 LUFS, true peak -1.6 dBTP
- audio: no silent gaps (audio from 0.00 s to 19.90 s)
- frame 0: has a picture (the baked poster)
- no black or frozen stretches
- credits: credits.txt lists the one required attribution

`check` ended at PASS with 0 warnings. The mix report has no warnings, with -18.7 LUFS in the intro and
about -12 LUFS in the build and peak, so the energy rise is audible. No sub-agent tool was available, so
the review-pack critic step was done as a self-review against CRITIC.md
(`review/round-1/FINDINGS.md` in the job): ship, with no blockers. A separate critic then reviewed the
same pack and disagreed; see the review round below.

## Review round

A critic reviewed `final-2.mp4` from the round-1 pack and returned **ship after fixes**: no blockers, four
should-fix items and six polish items. Each one was snapped and checked before anything changed. The log is
`work/feedback.md` in the job, and the round-2 pack is `review/round-2/`.

| # | Where | Note | Change |
|---|---|---|---|
| S1 | 9.33-9.50 s | The Sun -> Mars cross-zoom smeared both labels into colour-fringed blobs | The Sun label fades out by 9.23 s and the Mars label enters at 9.56 s, so no text is inside the 9.25-9.55 s shader window. The cross-zoom stays. |
| S2 | 7.07-7.8 s | The SDO timestamp showed at the bottom, although the README said the mask hid it | A second mask on the SDO image fades out its bottom strip. The bottom-strip peak brightness went from 100 to 2 of 255. |
| S3 | README, share.txt | Jupiter is not a whole centred disc; "twelve" photos should be thirteen; three Juno images were dropped, not two | All three statements corrected (above and in `share.txt`). |
| S4 | 16.8-20 s | The end-card credit was 22 px over a busy nebula | 29 px, brighter, over a bottom scrim |
| P1 | 10.57-11.73 s | Jupiter sat left of centre | Moved x +3.3 %. The lit body's centroid was 64 px left of centre, so the suggested +8 % would have overshot. Size was not changed: measured, its height (885-920 px) already matches Mars (about 937 px). |
| P2 | 16.33-16.47 s | The flash went through a grey veil and peaked 2-3 frames before the hit | 0.24 s flash that peaks and cuts at 16.50 s, on the 16.51 s impact |
| P4 | 0-9.4 s | The mono sub-labels were small | Raised from 25 to 29 px |
| P5 | 11.73-12.93 s | Saturn's ring came within 14 px of the frame edge | Ken-burns end scale 1.09 -> 1.04 |
| P3 | 0-9.4 s | The intro is four slow holds; the one-per-beat run is short | Not changed. The intro follows the track's quiet opening (about -23 dB), and cutting it every two beats would need four more images. |
| P6 | 0.3 s | The kicker says "Moon to deep field", but the video ends on the Cosmic Cliffs | Not changed. Webb's deep field (15.83 s) is the farthest thing shown; the Cosmic Cliffs is the backdrop for the end card. |

After the fixes, `check` passed with 0 warnings, and `qa` on the new render (`final-3.mp4`, 13.6 MB) passed
with 0 fail, 0 warn and 0 note at -14.0 LUFS and -1.6 dBTP. The fixes were checked on frames taken from the
rendered file.

A second critic pass on the published `final-3.mp4` returned **ship**: every round-2 fix was confirmed on
frames pulled from the file, with no blockers, no should-fix items and no regressions. Two optional polish
notes came back:

| # | Where | Note | Change |
|---|---|---|---|
| R3-1 | 0-9.4 s | The intro is still one shot per bar | Not changed. Same reason as P3: the Earthset title carries the hook, and cutting every two beats from about 4.7 s would need more images. |
| R3-2 | README | "bottom 5 %" did not match the mask in `index.html` (transparent to 4.4 %, opaque from 8 %) | Wording corrected above. Text only, so the video was not re-rendered; `qa` was re-run on the published file. |

## Sources and licences

- **Music:** "At Launch" Kevin MacLeod (incompetech.com). Licensed under Creative Commons: By Attribution
  4.0 License, http://creativecommons.org/licenses/by/4.0/. This is from the showtime audio library
  (`incompetech-at-launch`). The credit is on the end card and in [`credits.txt`](credits.txt).
- **Images:** NASA Image and Video Library, public domain as NASA media. Credits: NASA; NASA/JSC;
  NASA/NOAA/GSFC/Suomi NPP/VIIRS/Norman Kuring; NASA/GSFC/SDO; NASA/JPL/USGS; NASA/JPL/Space Science
  Institute; NASA, ESA and the Hubble Heritage Team (STScI/AURA); NASA, ESA, M. Livio and the Hubble 20th
  Anniversary Team (STScI); NASA, ESA, CSA, STScI. Each file has its `.license.json` sidecar in
  `project/assets/media/`, and the full list with links is in `credits.txt`. No NASA logos or insignia are
  used, and no endorsement is implied.
- **Fonts:** Space Grotesk and JetBrains Mono (OFL-1.1), with the licence files in `project/fonts/`.
- There is no voice-over and no voice script.

## Files

```
final.mp4                  the video (job final-3.mp4)
poster.jpg                 poster frame (1.9 s), also baked into frame 0
share.txt                  YouTube / X / README copy
credits.txt                music credit written by render + image credits
project/index.html         13 scenes on the beat grid (ken-burns, kinetic-type, cross-zoom, flash)
project/showtime.json      1920x1080, 30 fps, 20 s, poster 1.9
project/audio/mix.json     library track with fit + one synth impact, mastered to -14 LUFS
project/data/at-launch.beats.json   the beat map the cuts were placed on
project/assets/media/      the 13 NASA images + licence sidecars
project/fonts/             Space Grotesk, JetBrains Mono
```

To re-render, run `showtime render examples/08-beat-montage/project --format png --crf 21 --x264-preset slow`.
The mix pulls "At Launch" from the showtime audio library (`showtime audio lib fetch` installs it).
