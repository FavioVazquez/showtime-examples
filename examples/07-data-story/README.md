# 07 · Data story: 146 years of NASA global temperature (30 s)

![poster](poster.jpg)

**Video:** [`final.mp4`](https://github.com/FavioVazquez/showtime-examples/releases/download/examples-media-v1/07-data-story--final.mp4) · 1920x1080 · 30 fps · 30.00 s · 15.7 MB · -14.0 LUFS / -1.4 dBTP
(re-rendered for the stricter check: see "Re-render" after review round 2)

## The request

> "Make a 30-second data story from this CSV"
> A real public-domain dataset (NASA GISS GISTEMP annual global means), downloaded and imported with
> `showtime data import`, as an animated chart story with a clear takeaway, a music bed, at 1920x1080.

**Mode:** quick (no questions asked). The opening line stated the assumptions:

> Quick mode: 30 s, 16:9, NASA GISTEMP v4 annual means 1880-2025 (2026 is partial, left out).
> Takeaway: the 11 warmest years in the record are the last 11 (2015-2025), and 2024 is the warmest
> at +1.29 °C above the 1951-1980 average. Editorial look, composed cinematic bed, no voice-over.

## The story, and where each claim comes from

Every number on screen is read from `data/gistemp-global-annual.csv` (the `J-D` column of NASA's
file, copied exactly). Nothing is smoothed, rounded, extrapolated or filled.

| Time | On screen | Checked in the data |
|---|---|---|
| 0-5 s | "The last eleven years were the eleven warmest on record." over 146 warming stripes, one per year; a bracket marks the last eleven, "2015–2025" | Sorted by value, the top 11 are 2015-2025; the 12th is 2014 (+0.75) |
| 5-10 s | The stripes fold into anomaly bars around the 1951-1980 average. "Since 1977, every year has been warmer than the 1951-1980 average." 1976: −0.10 °C, the last year below; 1977-2025: 49 years in a row above it | Every value from 1977 to 2025 is > 0 (lowest 0.07, in 1978); 1976 is −0.10 |
| 10-15 s | "2024 was the warmest year in the record": 2024 at +1.29 °C | Maximum of the column |
| 15-22 s | The 11 warmest years, in time order, with their values; a dashed line at "2014: +0.75, warmest year before 2015" that every bar clears | `data import --chart bar --top 11`; the line is the warmest year not in that list, computed from the full series |
| 22-30 s | +1.29 °C, "2024, the warmest year in 146 years of NASA records", the stripes again, full source line | 146 complete years, 1880-2025 |

## What it demonstrates

- **CSV to chart in one command.** `showtime data import` turned the table into both chart files:
  the full 146-year series (`data/gistemp-annual.json`) and the 11 warmest years as ranked bars
  (`data/warmest-11.json`, pointed at the `bars` scene with `--scene`). The numbers never live in HTML.
- **Custom components next to the stock ones.** Temperature anomalies go below zero, and the stock
  `chart` component scales from 0 upward, so `project/stripes.js` (about 210 lines, written with the
  documented `define()` API) draws the stripes and the bars around a zero line. `project/warmest.js`
  (about 120 lines) draws the top-11 bars. Unlike the stock chart, it shows each value only at its
  final figure and draws a reference line. Both read the imported JSON, take every colour from the
  page's token block, and are pure functions of time: `check` found them deterministic in any seek order.
- **One visual spine.** The same 146 marks are warming stripes in the hook, fold into a bar chart at
  the 5.0 s cut (the cut is invisible: the two frames around it differ by 0.35 grey levels on average),
  and come back under the closing number with 2024 marked.
- **One insight per chart state.** The bar scene has two states (the 1977-2025 run, then 2024 alone,
  with the rest dimmed and a slow push toward the recent end), each with its own title.
- **Honest charting.** Bars start at the 1951-1980 average, the baseline and units are on screen in
  every state, the source is cited in the last scene, and `expect.must_show` makes qa confirm that
  "+1.29", "1976", "2015" and "2025" are actually readable in the final.
- **Sound.** A composed `cinematic-build` bed (90 bpm, D minor, seed 2) whose sections start on the
  scene changes, with soft effects on the opening bracket, the fold, each annotation, the reference line, the cuts
  and the 2024 tick under the closing number.

## Commands, in order

`showtime` is `skills/showtime/bin/showtime`. `<job>` is
`showtime-out/gistemp-data-20260926-141059`. The CSV was fetched once with `curl` from NASA
(`https://data.giss.nasa.gov/gistemp/tabledata_v4/GLB.Ts+dSST.csv`) and reduced to `year,anomaly_c`
with a short script that keeps the values exactly (see `data/SOURCE.txt`).

```bash
showtime doctor --quick
showtime job init gistemp-data --mode quick \
  --goal "Make a 30-second data story from this CSV: NASA GISS GISTEMP v4 ..." \
  --assumed "Data: GLB.Ts+dSST.csv, J-D annual means 1880-2025 (2026 is partial and excluded)" \
  --assumed "Takeaway: the 11 warmest years are the last 11 (2015-2025); 2024 warmest at +1.29 C" \
  --assumed "30 s, 16:9 1920x1080, editorial light look, no voice-over, composed cinematic-build bed" \
  --assumed "Warming-stripes band drawn from the same data as the visual spine"
showtime data inspect data/gistemp-global-annual.csv
showtime job note <job> --stage understand --verified "..." --next "..."
showtime new data <job>/project --title "..." --duration 30 --look template

# CSV -> chart JSON (the full series, and the 11 warmest as bars)
showtime data import data/gistemp-global-annual.csv <job>/project --chart line --x year --y anomaly_c \
  --scene lines --suffix " °C" --decimals 2 -o <job>/project/data/gistemp-annual.json \
  --title "Global temperature, 1880-2025" --subtitle "Annual mean vs the 1951-1980 average · NASA GISS GISTEMP v4"
showtime data import data/gistemp-global-annual.csv <job>/project --chart bar --x year --y anomaly_c \
  --top 11 --scene bars --highlight max --annotate "warmest on record" --prefix "+" --suffix "" \
  --decimals 2 -o <job>/project/data/warmest-11.json --title "The 11 warmest years on record: 2015 to 2025"
showtime snap <job>/project --at 12,20          # the stock line chart cannot show values below 0 -> stripes.js

# first look, fix, look again (8 rounds of stills while building)
showtime snap <job>/project --at 0.3,1.0,2.6,4.0,4.8,5.6,8.0,10.2,12.0,15.0,17.5,21,23,25,29.9 --width 960 --format jpg
showtime check <job>/project                    # 2 contrast errors (fading end labels), 4 warnings -> fixed
showtime check <job>/project                    # title exits late (exit-at counts from data-at) -> fixed
showtime snap <job>/project --every 1           # 30-frame contact sheet
showtime check <job>/project                    # PASS, 1 warning (a title mid-rise, read: not a real overlap)
showtime job note <job> --stage first-look --verified "..." --next "..."

# final, verify, fix, final again
showtime render <job>/project --job <job>       # final.mp4
showtime check <job>/project                    # records on-screen text for must_show
showtime qa <job>                               # WARN: two frozen holds (1.7-4.9 s, 7.1-10.9 s)
#   -> slow camera drift in stripes.js; hook text finishes its exit before the 5.0 s cut
showtime check <job>/project --find-first frozen
showtime check <job>/project
showtime render <job>/project --job <job>       # final-2.mp4
showtime qa <job>                               # PASS, 0 warnings
showtime review-pack <job>
showtime job note <job> --stage deliver --verified "..."

# review round (critic notes on final-2, see below)
showtime snap <job>/project --at 0.2,0.6,1.5,3.0,4.8,11.0,15.3,16.4,17.0,17.4,18.0,19.0,21.5,22.9,23.2,23.6,26.2 --sheet
showtime check <job>/project                    # 3 warnings (two title-rise overlaps, one contrast false positive) -> fixed
showtime check <job>/project                    # PASS, 0 warnings
showtime render project --job <job>             # final-3.mp4
showtime qa <job>                               # PASS; stills show the payoff scene still opens thin at 23.0 s
showtime render project --job <job>             # final-4.mp4 (earlier stripes wipe and headline, bars start sooner)
showtime qa <job>                               # PASS, 0 warnings
showtime review-pack <job>                      # round 2
showtime job note <job> --stage feedback --verified "round 2 applied: ..."

# second review round (critic notes on final-4, see below)
showtime snap <job>/project --at 0.034,1.0,10.2,19.5,22.7,23.8,24.35,26.2 --format jpg   # before stills
showtime snap <job>/project --at 0,0.6,1.2,3.0,4.6,10.2,19.5,22.55,22.7,22.9,23.8,26.2 --format jpg   # after
showtime check <job>/project                    # PASS, 0 warnings
showtime render project --job <job>             # final-5.mp4 (no poster bake-in)
showtime deliver poster <job> --at 3.0 --out <job>/final-5.cover.jpg   # cover image, not baked
showtime qa <job>                               # PASS, 0 warnings
showtime audio meter <job>/final-5.mp4
showtime job note <job> --stage feedback --verified "round 3 applied: ..."
```

The published `final.mp4` is the job's `final-5.mp4` (the CRF 16 master, 16.1 MB, under the 20 MB
budget, so no re-encode was needed).

## Review round 1

A critic pass on `final-2.mp4` (a separate reviewer working from the review pack and the published files) returned **ship after
fixes**: no blockers, three should-fix items and six polish notes. Each one was confirmed on its cited
frame before anything changed. The log is `work/feedback.md` in the job.

| # | Note (time) | Change |
|---|---|---|
| 1 | "11" reads as "ll" in the serif headline (0.4-4.3 s, 15.6-22.4 s) | The hook says "eleven". Every digit in a serif heading now comes from Fraunces, through a digits-only `@font-face` (`unicode-range: U+0030-0039`), so "1977", "2015" and "+1.29" read correctly while the letters stay Instrument Serif |
| 2 | Bar labels count up through values not in the data (15.6-17.3 s) | The new `warmest.js` fades each label in at its final value once its bar lands. 2024 turns red only after every bar has landed |
| 3 | 4.4 s hold that only asserts the top 11 (18.0-22.4 s) | At 18.5 s a dashed line at 2014 (+0.75, "next warmest") draws across the bars, with a soft thock |
| 4 | Near-empty frame opening the payoff (22.7-23.5 s) | The stripes wipe and headline start about 0.5 s sooner |
| 5 | Staircase-shaped stripes wipe (0.1-1.5 s, 22.9-24.2 s) | A straight left-to-right wipe; "2025" appears when the wipe reaches it |
| 6 | Kicker fades out as a fragment (4.4-4.8 s) | The kicker exits as one line and is gone by 4.25 s |
| 7 | Push-in brings text near the frame edges (15.0-15.4 s) | Smaller camera push; all text stays inside the 90% title-safe area |
| 8 | Weak thumbnail | Poster moved to 3.0 s: the hook headline over the full stripes |
| 9 | Quiet start (first 4 s about 6 dB under the body) | Not changed. `mix.json` has no per-section gain, and the intro is meant as a build |

Before the fixes, qa was PASS with 0 warnings and check was PASS with 1 warning. After them, qa is
**PASS (0 fail, 0 warn, 0 note)** and check is **PASS with 0 warnings**. The earlier 11.67 s
title-rise warning is also gone, because subtitles now start after their titles land.

## Review round 2

The same critic reviewed `final-4.mp4` (the round-2 pack) and returned **ship after fixes**: every
round-1 fix had landed and there were no blockers, but two should-fix items were left, both about sync, plus five polish notes.
Each one was confirmed on a `showtime snap` still before anything changed. This was the last review round
(the protocol allows two), so the fixes were checked with stills, `check`, `qa` and the audio meter
instead of a third critic pass.

| # | Note (time) | Change |
|---|---|---|
| 1 | Poster flash: frame 0 was the baked 3.0 s poster, frame 1 an almost empty page (0.000-0.033 s) | No bake-in. The hook is now fully on screen from frame 0 (the text has already landed, and the stripes start drawn, so the hook no longer has the round-1 wipe; the closing scene keeps it), so frame 0 is the thumbnail and nothing flashes on a loop. The first change is a bracket over the last eleven stripes, "2015–2025" (0.35-0.95 s), with the years read from the data. `poster.jpg` (3.0 s) is written with `deliver poster` for platforms that take a cover image |
| 2 | Ding at 24.35 s with nothing happening on screen | Moved to 23.8 s, when the "2024" tick appears over the closing stripes |
| 3 | Quiet start (0-4 s about 8-9 dB under the body) | A soft whoosh and thock on the bracket drawing and landing (0.35 s, 0.95 s). Only partly fixed: the first second is 2.4 dB louder, but seconds 1-3 are unchanged, so the hook is still about 7 dB under the body |
| 4 | Double exposure at the payoff cut: stripes wiping in over the bars (22.7-22.9 s) | The `crossfade 0.6` becomes `dip 0.7`: the bars fade to the page colour before the closing scene appears |
| 5 | The 1977 run marker's rounded cap dips below zero next to 1976 (7-11 s) | Flat caps. The start tick rises from the zero line only |
| 6 | Fraunces digits look wider than the Instrument Serif letters (19 s, 26 s) | `size-adjust` 88% -> 84%. The join is less visible but still there, because the served Fraunces file has only a weight axis |
| 7 | "2014: +0.75 / next warmest" small and ambiguous (19.2-22.4 s) | 42 px bold, and the second line now says "warmest year before 2015", computed in `warmest.js` |

After round 2: qa is **PASS (0 fail, 0 warn, 0 note)** at -14.0 LUFS and -1.4 dBTP (LRA 3.3), and check is
**PASS with 0 warnings**. The log is `work/feedback.md` in the job; the before and after stills were compared frame for frame.

## Re-render: stricter check (2026-09-28)

`showtime check` was made stricter after this example shipped: contrast must reach 4.5:1 at every text
size, and text must stay out of the bottom 8 % (where player controls sit) and at least 5 % from the top.
On the unchanged project it gave **FAIL, 1 error and 14 warnings**:

- error: contrast **4.44:1** for the hook's legend ("One stripe per year: bluer is cooler, redder is
  warmer", 0:01.67): `--warm` #b8432f on the page colour #efe8dc;
- warnings: that legend (29 px), the eleven year labels under the bars (2015-2025, 31 px, 0:21.67) and
  the source line (29 px, 0:25.00) sat in the bottom 8 % of the frame; the "+1.29" count-up sat 32 px
  from the top edge (0:28.33).

Changes (all in `project/index.html`; no data, timing, sound or wording changed):

| What | Before | After |
|---|---|---|
| `--warm` (legend "redder", the 1977-2025 run and its label, the warm bars) | #b8432f (4.44:1) | #ad3d2a (4.96:1 on #efe8dc) |
| hook legend | 29 px at 89.5 % height | 32 px at 84.5 % height |
| stripes in the hook and the fold (`data-band`, both scenes so the 5.0 s cut stays seamless) | 0.445-0.815 of the height | 0.42-0.78 |
| eleven-warmest bars (`data-plot`) | 0.30-0.86 | 0.28-0.835: the year labels end above the controls band |
| closing number `.num` | top 7 % | top 10 % |
| closing stripes (`data-band`) | 0.575-0.765 | 0.525-0.715 |
| source line | 29 px, 4.5 % from the bottom | 32 px, 9 % from the bottom, with room under the 1880/2025 labels |

- **check:** PASS, 0 errors, 0 warnings (one note: the "1880" axis label is within 5 % of the frame edge at
  0:11.67).
- **Render:** a Linux x64 machine (32 cores): 42 s for 900 frames (capture 34 s at 26.8 fps, encode
  4.3 s), 15.7 MB, under 20 MB without an export. The last renders on the 6-core Mac took 45-53 s.
  **qa:** PASS (0 fail, 0 warn, 0 note), -14.0 LUFS, -1.4 dBTP, all four must_show figures on screen.
  `poster.jpg` is again the 3.0 s frame (`deliver poster --at 3.0`), not baked in.
- **Review:** `review-pack` on the new file, then a self-review of the contact sheet, the cut strips
  (the 5.0 s cut between the hook and the fold still lines up stripe for stripe) and the full-size text
  crops (no separate critic ran). No new findings.

## Timings

Measured on a shared 6-core Intel i5-8500 with about three other example renders running at the same time.

| Step | Time |
|---|---|
| `snap` (15 stills at 960 px) | 14 s |
| `check` (full timeline pass, 161 samples) | 30-57 s |
| `render` final (900 frames, 3 workers) | 1 min 33 s: capture 40 s at 22.5 fps, encode 41 s (first final: 2 min 11 s, including 14 s composing the bed) |
| `qa` | 18 s |
| `review-pack` | 31 s |
| review round: `render` final-3 / final-4 | 53 s each (capture 24 s at 38 fps, encode 23 s) |
| review round: `check` / `qa` | 22-36 s / 9-11 s |
| review round 2: `render` final-5 | 45 s (capture 20 s at 44 fps, encode 18 s) |
| review round 2: `check` / `qa` | 22 s / 8 s |

## QA summary

`showtime qa` returned **PASS (0 fail, 0 warn, 0 note)** on `final-5.mp4`, the file published before the
re-render (the re-render's qa, also PASS with 0 warnings, is in "Re-render" above):

- file: h264 High, yuv420p, 1920x1080 at 30 fps, faststart, BT.709
- duration: 30.00 s, matching showtime.json
- loudness: -14.0 LUFS, true peak -1.4 dBTP
- audio: no silent gaps
- frame 0: has a picture (the full hook: headline over the stripes)
- no black stretches, no frozen stretches over 2.5 s
- must_show: "+1.29" (11.2-15.7 s), "1976" (7.3-11.0 s), "2015" (0.9-4.3 s), "2025" (0.0-30.0 s)
- no attribution required

`showtime check`: PASS with 0 warnings. It is deterministic, and the fonts are embedded (Instrument
Serif, Fraunces for the display figures, IBM Plex Sans, IBM Plex Mono). There are no still holds and no
overlaps. The mix report: LRA 3.3 LU, no warnings.

Before the critic, a self-review against the pack's CRITIC.md. Then two critic rounds and their fixes (above).
Both review packs are in the job under `review/`.

## Files

```
final.mp4              the video (qa PASS)
poster.jpg             frame at 3.0 s (the hook with the 2015–2025 bracket), a cover image to upload; not baked in
share.txt              post copy (X, LinkedIn, YouTube, README caption + alt text) and posting notes
data/
  GLB.Ts+dSST.raw.csv        NASA's file as downloaded (2026-09-26)
  gistemp-global-annual.csv  year + annual mean (J-D), 1880-2025: the table given to `data import`
  SOURCE.txt                 URL, units, baseline, citation, licence, what was changed
project/
  index.html           four scenes (open, lines, bars, stat) and the palette tokens
  stripes.js           the stripes / anomaly-bars component
  warmest.js           the top-11 bars with the next-warmest reference line
  showtime.json        1920x1080, 30 fps, 30 s, must_show figures (no poster time: frame 0 is the hook)
  audio/mix.json       composed bed + 9 effects, mastered to -14 LUFS
  data/                gistemp-annual.json and warmest-11.json, written by `showtime data import`
```

There is no voice script: this cut is music only. To re-render, run
`showtime render examples/07-data-story/project`.

## Sources and licences

- **Data:** NASA GISS Surface Temperature Analysis (GISTEMP v4), Land-Ocean Temperature Index, global
  annual means, <https://data.giss.nasa.gov/gistemp/>. This is NASA data and a US Government work, so it
  is in the public domain. Citation: GISTEMP Team, 2026: GISS Surface Temperature Analysis (GISTEMP),
  version 4. NASA Goddard Institute for Space Studies. Values are as downloaded on 2026-09-26. NASA
  revises recent values as station data arrives, so they can move by a few hundredths.
- **Warming stripes:** drawn by `stripes.js` from the data above. The idea comes from Ed Hawkins' "warming
  stripes". No third-party graphic is used.
- **Music:** composed locally with the `cinematic-build` style, 90 bpm, D minor, seed 2. No samples and no
  library tracks.
- **SFX:** procedural (`whoosh`, `thock`, `paper-swipe`, `ding`).
- **Fonts:** Instrument Serif, Fraunces (digits in the serif headings), IBM Plex Sans and IBM Plex Mono, all served by showtime and all SIL OFL-1.1.
- There are no CC-BY assets, so no `credits.txt` is needed.
