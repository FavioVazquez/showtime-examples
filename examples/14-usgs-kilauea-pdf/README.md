# 14 · Government PDF to narrated summary: Kīlauea 2018 (USGS), English + Spanish

![poster](poster.jpg)

**English:** [`final.mp4`](https://github.com/FavioVazquez/showtime-examples/releases/download/examples-media-v1/14-usgs-kilauea-pdf--final.mp4) · 1920x1080 · 30 fps · 75.00 s · 18.6 MB · -14.0 LUFS / -1.6 dBTP
· sidecar captions [`final.srt`](final.srt)
**Spanish:** [`final-es.mp4`](https://github.com/FavioVazquez/showtime-examples/releases/download/examples-media-v1/14-usgs-kilauea-pdf--final-es.mp4) · 1920x1080 · 30 fps · 81.30 s · 18.7 MB · -14.0 LUFS / -1.6 dBTP
· burned subtitles, plus a sidecar [`final-es.srt`](final-es.srt)

A two-page U.S. Geological Survey PDF became a 75-second narrated summary, then a Spanish version
re-timed to its own voice. Every number and date on screen comes from the PDF. The footage is the
USGS's own public-domain overflight video, stabilised and graded on this machine. The summit
cross-section is redrawn from the PDF's figure and labelled as a redraw.

## The request

> "Here's a USGS PDF about the 2018 Kīlauea eruption. Make a 75-second narrated summary video, and a
> Spanish version with subtitles."

**Mode:** quick, publish-bound. No questions were asked. The assumptions, logged in both jobs:

- 75 s, 16:9, 30 fps for the English. The Spanish follows its own voice (81.3 s, +8.4 %).
- English voice `af_sarah` (clear, neutral, suits documentation). Spanish voice `em_alex` with Latin
  American seseo (`es-419`).
- A restrained `dark-tension` bed about 22 dB under the voice, since this is a hazard topic, not a
  thriller. The only effects are a low sub-drop and a short rumble on the summit-collapse beat.
  There is nothing under the damage numbers.
- Only claims from the PDF. The one exception is the causal link (the summit fell as its magma
  drained away), which comes from the USGS 2018 eruption page. On screen the figures are marked
  "Preliminary figures, USGS, Sept 2018".
- **The Spanish is a machine translation by Claude and has not been reviewed by a native speaker.**
  `share-es.txt` says so too.
- The PDF's page 1 carries the USGS identifier, a trademark, so the document shot uses page 2, which
  has none. The clips' small corner "USGS" bug is framed out (see Footage).

## The story, shot by shot

| # | Scene (EN time) | Picture | Job |
|---|---|---|---|
| 1 | hook 0-6.8 s | Stabilised, graded overflight of the fissure 8 lava channel (June 11), title "Kīlauea, 2018" on frame 0 | The event itself; frame 0 is the poster |
| 2 | where 6.8-15.2 s | `world-map` orthographic globe turns and zooms to the Island of Hawaiʻi, marker on Kīlauea; page 2 of the PDF slides in ("the source: 2 pages, USGS, Sept 2018") | Orientation, and "this summary comes from this document" |
| 3 | start 15.2-25.0 s | Rift schematic (summit → Puʻu ʻŌʻō → lower East Rift Zone, magma moving downrift) over a `steps` chronology: Apr 30, May 3, May 4. A date ruler (Apr 30 to Sept 22) sits on top | Cause and sequence, in the report's own dates |
| 4 | summit 25.0-40.2 s | Summit cross-section, **redrawn from the USGS figure**: April 2018 line, then the August 2018 line drawn on "sank", "500+ m drop". Cards: May 16 HVO building vacated, near-daily collapses from May 29, ≈ M5 energy each. A small shake and a sub-drop land on "collapsed" | The less-known half of the story: the summit fell as the magma left |
| 5 | fissure8 40.2-50.3 s | `domain-warp` into the May 29 overflight (fountains up to 200 ft at times), hard cut to the USGS map from the June 11 video: it starts close on fissure 8 and pulls back along the channel to the ocean entry at Kapoho, with the card "June 3 · Lava reaches Kapoho Bay" | The dramatic core, shown rather than told, and the path to the sea |
| 6 | numbers 50.3-64.8 s | Four count-ups, each arriving on its spoken number: 13.7 sq mi (35.5 km²), 716 dwellings (per Hawaiʻi County), 875 acres (about 354 ha), ~60,000 earthquakes | Scale of the impact, exact figures from the PDF |
| 7 | end 64.8-71.8 s | The date ruler returns and fills to Aug 4, then Sept 22. A moving head carries the running date in grey, so only the real event dates are red. The source line sits at the bottom | Resolution, and the video's one returning device |
| 8 | card 71.8-75 s | Title and source line, entered through a `dip` | Credit |

![where](stills/en-where.jpg) ![summit](stills/en-summit.jpg)
![fissure 8](stills/en-fissure8.jpg) ![Kapoho map](stills/en-kapoho.jpg)
![numbers](stills/en-numbers.jpg)

## Features shown

- **PDF to script, with no showtime command.** showtime has no PDF ingest, so `pypdf` (text layer) and
  `pypdfium2` (page renders at 216 dpi) ran in a scratch venv: [`scripts/pdf_ingest.py`](scripts/pdf_ingest.py).
  This is logged as a friction item: a `showtime assets pdf` command would give the text, page PNGs
  and embedded images in one step.
- **Crew roles, done inline.** The session had no sub-agent tool, so the director did each role from
  its brief (`references/crew/<role>.md`) and says so here.
  - **Scriptwriter:** [`research/claims.json`](research/claims.json), 18 claims with PDF line references.
  - **Researcher:** [`research/claims.verified.json`](research/claims.verified.json) and
    [`research/factcheck.md`](research/factcheck.md), covering the fact check and the license audit.
  - **Editor:** b-roll selects from the scene sheets.
  - **Voice director:** Spanish casting, the lexicon and the round-trips.
  - **Critic:** self-review, two rounds on the English and one on the Spanish, then one pass by an
    independent critic that did not build the video, all in [`review/`](review/).
- **Footage tools on real USGS clips:** `footage probe` and `footage scenes --every 2` to read both
  clips (title cards and end cards found and cut away), `footage trim` to take the selects,
  **`footage stabilize --strength 0.6`** (vid.stab, two-pass), `footage luts --preview` for every
  look on one frame, **`footage grade --auto --look warm-film --strength 0.5`**, and
  `footage trim --webm --width 1280 --no-audio` for seek-friendly VP9 `<video>` layers inside the page.

  ![stabilise before/after](stills/stabilize-compare.jpg)

  `stills/stabilize-compare.jpg` compares the same frames before and after (`showtime snap <stable> --at 4,12 --compare <original>`).
  vid.stab's border-hiding zoom is visible, and the clip's corner bug leaves the frame.
  `stills/luts-preview.jpg` is the look sheet, and `stills/grade-compare.jpg` shows the grade before
  and after.
- **DOM page on theme `paper`**, with `world-map` (orthographic, camera fly-in, marker, 50m Natural
  Earth data), `steps`, `count-up`, transitions `slide` (primary), **`domain-warp`** (WebGL, once, into
  the footage) and `dip` (outro).
- **Word-cued reveals that survive a re-voice.** [`project/cues.js`](project/cues.js) names each reveal
  by a narration line and a spoken word ("13.7", "collapsed", "reached"). It reads the times from
  `voice/captions.words.json` and publishes them as CSS variables and component options before the
  components mount. The Spanish copy changes only the word list.
- **Hawaiian names:** `voice ipa` showed espeak reading "Kīlauea" as "KIL-uh-ee-uh" in English and
  spelling out the ʻokina as "símbolo…" in Spanish. [`project/lexicon.json`](project/lexicon.json)
  has per-language IPA for Kīlauea, Puʻu ʻŌʻō, Kapoho, Hawaiʻi and Halemaʻumaʻu. The ʻokina (U+02BB)
  is missing from Bricolage Grotesque and Caveat, so Space Grotesk (OFL) is loaded as the fallback.
  Hawaiian spellings stay exact on screen in both languages.
- **`voice script --fit 70`** (English, x1.06), then **`retime --from-voice --total 75`**. The Spanish
  project is a copy made by [`project-es/localize_es.py`](project-es/localize_es.py), re-voiced
  (`--fit 76`, x1.03) and re-timed by its own voice (`--total 81.3`).
- **`transcribe` round-trips** on both voices. They caught "fountained" heard as "found it" (the line
  was reworded to "fountains rose") and the Spanish "Hawaiʻi" heard as "Abaiti" (the lexicon's β became w).
- **Captions:** an English `clean` SRT sidecar. In Spanish, burned subtitles plus an SRT (see "Spanish
  subtitles" below for why the burned layer is drawn by the page, in the `caption-karaoke` `boxed-pill`
  look, and not by the ffmpeg `boxed` burn).
- **`expect.must_show`** ("13.7" and "716" in English, "13,7" and "716" in Spanish), checked by qa.
- **`audio compose --style dark-tension`** with sections on the chronology, `audio mix` ducking with
  carve, one synth `sub-drop` and the CC0 library ambience `oga-low-rumbling`.
- **`deliver exports --targets youtube,linkedin`** plus `--targets original --max-mb 20` for the
  files shipped here.

## Commands, in order

`showtime` is `skills/showtime/bin/showtime`. `<en>` is `showtime-out/kilauea-2018-20260927-114431`,
`<es>` is `showtime-out/kilauea-2018-es-20260927-121354`.

```bash
showtime doctor --quick                                       # 21 pass, 0 fail
showtime job init kilauea-2018 --platform youtube --goal "<request>" --assumed "..." (x3)
# sources (public domain): the PDF and two USGS clips, fetched from the USGS/S3 URLs with a browser UA
#   (usgs.gov pages 403 a plain curl UA; `assets media` has no USGS source)
python scripts/pdf_ingest.py <en>/src/PrelimSum_LERZ-Summit_2018.pdf <en>/src/pdf    # scratch venv: pypdf, pypdfium2, pillow

showtime footage probe <en>/src/usgs-2138-f8-overflight-2018-05-29.mp4           # 1280x720, 29.97 fps, 44.0 s
showtime footage probe <en>/src/usgs-2227-lava-channel-2018-06-11.mp4            # 1280x720, 29.97 fps, 55.7 s
showtime footage scenes <clip> --every 2 --job <en>            # both clips: title/end cards, corner "USGS" bug
showtime footage scenes <2138> --every 0.25 --from 5 --to 8     # exact edges of the aerial part
showtime footage trim <2227> --from 22 --to 46.5 --no-audio -o <en>/work/broll/jun11-channel.mp4
showtime footage trim <2138> --from 5.6 --to 18.2 --no-audio -o <en>/work/broll/may29-f8-air.mp4
showtime footage stabilize <en>/work/broll/jun11-channel.mp4 --strength 0.6 -o .../jun11-channel.stable.mp4
showtime footage stabilize <en>/work/broll/may29-f8-air.mp4 --strength 0.6 -o .../may29-f8-air.stable.mp4
showtime snap .../jun11-channel.stable.mp4 --at 4,12 --compare .../jun11-channel.mp4
showtime footage luts --preview .../jun11-channel.stable.mp4 --at 10                 # picked warm-film
showtime footage grade .../jun11-channel.stable.mp4 --analyze
showtime footage grade <clip>.stable.mp4 --auto --look warm-film --strength 0.5 -o <clip>.graded.mp4   # x2
showtime footage grade .../jun11-channel.stable.mp4 --auto --look warm-film --strength 0.5 --compare --at 6 -o .../grade-compare.png
showtime new dom <en>/project --title "Kilauea 2018" --duration 75
showtime footage trim <clip>.graded.mp4 --webm --width 1280 --no-audio -o <en>/project/media/<clip>.webm   # x2

showtime voice ipa "Kīlauea, Puʻu ʻŌʻō, Kapoho Bay, the Island of Hawaiʻi, Halemaʻumaʻu"
showtime voice ipa "Kīlauea, Puʻu ʻŌʻō, Kapoho, la isla de Hawaiʻi" --lang es     # -> project/lexicon.json
showtime voice script <en>/project/narration.md -o <en>/project/voice --fit 70  # 78.4 s at x1.15 -> cut 17 words -> x1.03, then x1.06 after the round-trip fix
#   index.html, cues.js, scenes.js written (scene ids = line ids)
showtime retime <en>/project --from-voice <en>/project/voice/timeline.json --total 75
#   audio/mix.json: dark-tension bed + sub-drop + rumble on "collapsed" (scripts/sync_sfx.py)
showtime audio mix <en>/project/audio/mix.json -o <en>/work/mix-draft.wav          # x4: bed -3 -> -14 dB, voice 21.7 dB over
showtime snap <en>/project --every 3 --thumb 480 --cols 5 --format jpg -o <en>/work/snap1
showtime check <en>/project        # FAIL: contrast, 2 system-font glyphs, dead air x8, edge, overlap -> fixed
showtime check <en>/project        # ... -> PASS, 0 warnings (after 5 passes)

showtime job init kilauea-2018-es --platform youtube --goal "..." --assumed "..." (x3)
showtime voice list --lang es
showtime voice ipa "13,7 millas; 6,9; 60 000 sismos; ..." --lang es-419   # "60 000" read digit by digit -> inline [60 000](sesenta mil)
showtime voice script <es>/project/narration.es.md -o <es>/project/voice --fit 76
showtime transcribe <es>/project/voice/vo.wav --language es --no-events --no-refine --edit-dir <es>/work/rt-es
showtime transcribe <en>/project/voice/vo.wav --language en --no-events --no-refine --edit-dir <en>/work/rt-en
#   fixes: EN "fountained" -> "fountains rose"; ES Hawaiʻi IPA aβˈaiʔi -> awˈaiʔi; both re-voiced and re-transcribed
python project-es/localize_es.py                     # builds the ES project from the EN one
showtime retime <es>/project --from-voice <es>/project/voice/timeline.json --total 81.3
showtime check <es>/project                          # -> PASS, 0 warnings (3 passes)

showtime render <en>/project --job <en> --workers 2  # final.mp4 (crf 23 slow, from showtime.json "render")
showtime captions <en>/project/voice/captions.words.json --style clean --size 1920x1080 -o <en>/captions.ass --srt <en>/final.srt
showtime qa <en>                                     # PASS
showtime review-pack <en>                            # round 1: one-frame flash at 71.80 (see Review)
showtime render <en>/project --job <en> --workers 2  # final-2.mp4
showtime qa <en>                                     # PASS
showtime review-pack <en>                            # round 2: clean

showtime render <es>/project --job <es> --workers 2  # final.mp4 (no subtitles yet)
showtime captions <es>/project/voice/captions.words.json --style boxed --font inter --burn <es>/final.mp4 -o <es>/final.subtitulado.mp4 --srt <es>/final.srt
showtime qa <es>/final.subtitulado.mp4 --project <es>/project --captions <es>/final.srt   # WARN caption_fast; box artifacts seen
showtime captions <es>/work/final.es.src.srt --style boxed --font inter --burn <es>/final.mp4 -o <es>/final.subtitulado.mp4
#   same artifacts -> subtitles moved into the page (caption-karaoke boxed-pill), re-rendered:
showtime render <es>/project --job <es> --workers 2  # final-2.mp4
showtime qa <es>                                     # PASS
showtime review-pack <es>

# independent critic: ship after fixes (see Review) -> round 3 (EN) / round 2 (ES):
showtime snap <en>/src/usgs-2227-lava-channel-2018-06-11.mp4 --every 3   # the clip's USGS map (5-11 s): fissure 8 to the ocean entry
#   project/media/kapoho-map.jpg = the frame at 7.5 s, scaled to 1920x1080 (lanczos) with showtime's ffmpeg
showtime check <en>/project && showtime check <es>/project                # PASS, 0 warnings each
showtime render <en>/project --job <en>              # final-3.mp4 (5 m 02 s)
showtime render <es>/project --job <es>              # final-3.mp4 (4 m 24 s)
showtime qa <en> && showtime qa <es>                 # PASS, PASS (ES: 22 SRT cues, shortest 1.76 s)
showtime review-pack <es>                            # ES round 2: ship (self-review of the fixes)
showtime snap <new final> --at <each cited time> --compare <final-2>   # before/after per fix
showtime deliver exports <en> --targets youtube,linkedin      # 32.1 MB / 26.8 MB, both 1920x1080 (re-run on final-3)
showtime deliver exports <en> --targets original --max-mb 20  # 18.6 MB -> final.mp4 here
showtime deliver exports <es> --targets original --max-mb 20  # 18.7 MB -> final-es.mp4 here
showtime qa <each 20 MB export> --project ... --captions ...   # PASS, PASS
```

To rebuild from this folder: put the `project/` folder in a job, run `showtime voice script
project/narration.md -o project/voice --fit 70` (the WAVs are not shipped), then
`showtime retime project --from-voice project/voice/timeline.json --total 75`, then
`python3 scripts/sync_sfx.py project collapsed` and `showtime render project`. After the retime, the
end scene is hand-set to 7.02 s and the card to 3.19 s (see Review, round 1). For Spanish, run
`python3 project-es/localize_es.py`, then `voice script project-es/narration.es.md -o project-es/voice --fit 76`,
`retime project-es --from-voice project-es/voice/timeline.json --total 81.3` and
`python3 scripts/sync_sfx.py project-es colapsó`. `project/media/` holds the graded VP9 layers, the
page-2 render and `kapoho-map.jpg` (the USGS map frame at 7.5 s of the June 11 clip). The raw clips and
the PDF are fetched from the URLs under Sources. The Spanish burned subtitles live in
`project-es/subs.js`, whose card texts must match the Spanish voice word for word (a mismatch is
logged to the console, so `showtime check` shows it after a re-voice).

## Timings (6-core Intel i5 Mac, CPU shared with two other example builds)

| Step | Time |
|---|---|
| `footage stabilize` (24.5 s / 12.6 s clips) | 39 s / 19 s |
| `footage grade` (per clip) | 9-15 s |
| `footage trim --webm --width 1280` | 56 s / 27 s |
| `voice script` EN (7 lines, first run) / ES | 98 s / 132 s |
| `transcribe` ES 76 s / EN 70 s (large-v3-turbo) | 72 s / 35 s |
| `check` (75 s, 3 `<video>` layers) | 1 m 08 s to 1 m 45 s |
| `render --workers 2` EN 75 s | 4 m 38 s, 5 m 28 s (capture about 10 fps) |
| `render --workers 2` ES 81.3 s | 5 m 22 s, 5 m 04 s |
| `render` (3 workers) EN / ES, independent-critic fixes | 5 m 02 s / 4 m 24 s |
| `deliver exports` youtube+linkedin / 20 MB copy | 1 m 18 s / about 1 m 10 s |
| `qa` | 14-24 s |

## QA

`showtime qa` on the shipped files (the 20 MB exports) and on each job's latest final (`final-3.mp4`
in both jobs, after the independent critic's fixes): **PASS (0 fail, 0 warn, 0 note)** for all four.

- English: h264 High yuv420p BT.709 with faststart, 1920x1080 at 30 fps, 75.00 s. **-14.0 LUFS
  integrated, true peak -1.6 dBTP.** No black or frozen stretches, frame 0 is the hook and the
  poster, 26 SRT cues (shortest 0.85 s), `must_show` "13.7" on screen 52.5-65.0 s and "716"
  56.5-65.0 s.
- Spanish: 81.30 s, **-14.0 LUFS, -1.6 dBTP**, 22 SRT cues (shortest 1.76 s), `must_show` "13,7"
  57.2-70.2 s and "716" 60.0-70.2 s.
- `check` on both projects before their finals: PASS, 0 errors, 0 warnings. That covers
  determinism, no network, embedded fonts, contrast, text sizes and no still holds of 2.5 s or more.
- No attribution is required. `credits.txt` carries the courtesy lines.

## Review

The critic role ran as a labelled self-review (no sub-agent tool). A second look by a person is
still wanted before anything is published.

- **English, round 1 ([findings](review/en-round-1/FINDINGS.md)):** ship after fixes.
  - **Blocker:** a one-frame flash of the end card at 71.80 s. The card scene started at 71.801 s,
    which is within 1 ms after frame 2154. The stage snaps a clip start onto that frame, but the
    transition window used the raw 71.801, so on frame 2154 the `dip` was not yet active and the
    outgoing scene was already hidden. The fix was to move the boundary off the frame edge (end
    scene 7.02 s, card 3.19 s, start 71.81 s), verified frame by frame. It is logged as a runtime
    friction item.
  - **Polish:** `domain-warp` smeared the summit labels. They now fade out 0.4 s before the window,
    and the fissure 8 footage tag fades in after it.
- **English, round 2 ([findings](review/en-round-2/FINDINGS.md)):** ship. All 7 cuts are clean frame
  by frame, and qa passes.
- **Spanish ([findings](review/es-round-1/FINDINGS.md)):** ship, pending a native speaker's read.

### Review round: independent critic

After the self-review, a separate critic that did not build the video checked both review packs and
both shipped files ([findings and fixes](review/independent-critic/FINDINGS.md)). Verdict: ship after
fixes, no blockers, every figure matching the facts sheet. It found three should-fix items, all fixed,
and two polish items, both done:

- **The Kapoho shot (both versions).** "Reached the ocean at Kapoho Bay on June 3" played over the
  hook's June 11 channel shot again, with no ocean in frame. It now plays over the USGS map from the
  same June 11 video: the channel from fissure 8 to the ocean entry at Kapoho, pulling back from the
  fissure end until the ocean entry is in frame. The critic's first suggestion was the ocean-entry
  part of USGS video 2186 (June 6). That would have meant a new 40 MB download, and the map was already
  on disk and shows the same path.
- **Spanish subtitle pacing.** The burned cards were 1-3 words, some on screen for about 0.4 s, and
  split "la fisura | 8" and "Geológico de Estados | Unidos". They are now 22 phrase cards drawn by
  `project-es/subs.js`: one clause or sentence each, at most two lines, at least 1 s on screen
  (shortest 1.76 s), with the per-word highlight kept. The SRT sidecar uses the same 22 cues.
- **Spanish hook tag on bright sky** (about 1.7:1). The Spanish footage tags now sit on an ink plate
  (about 10:1, measured on the shipped file).
- **Polish:** the end ruler's moving date is grey, so "SEPT 2" no longer looks like an event next to
  "SEPT 22". The source note breaks as "the source: / 2 pages, USGS, / Sept 2018", and the Spanish
  summit source line keeps "PDF p. 2" together.

Each fix was checked with a snap of the new final at the cited time, next to the previous final.
`check` passed on both projects with 0 warnings, and `qa` passed on both new finals and both shipped
copies. The Spanish job got its second review pack ([round 2](review/es-round-2/FINDINGS.md), a
self-review of the fixes: ship). The English job had already used its two rounds, so its fixes are
proven by the before/after stills instead of a third pack.

## Spanish subtitles

The first attempt was the brief's `showtime captions --style boxed --font inter --burn`. It came out
with two problems:

- The boxed style highlights the spoken word, so each word is its own styled run in the ASS. libass
  then draws a separate translucent box per run, and the overlapping padding shows as dark vertical
  bars between words and a darker band between the two lines.
- Grouping from the words gave 59 cards of 1-3 words, and qa warned that one was too fast
  (`caption_fast` at 29.57 s).

Restyling the 29-cue SRT fixed the grouping but not the boxes, so the subtitles moved into the page.
The first page version used the `caption-karaoke` component (`boxed-pill`). The independent critic
found that its cards were still 1-3 words: in fast Spanish speech the component's density rule caps a
card at two words, so some cards lasted about 0.4 s and split "la fisura | 8". The shipped layer is
[`project-es/subs.js`](project-es/subs.js), about 90 lines on the page's own clock:

- 22 phrase cards, each a clause or a sentence, written out in the file. Only phrases over about 54
  characters break into two lines, at a marked point.
- Each card is on screen from its first word until 0.7 s after its last (at least 1 s; the shortest
  is 1.76 s). The spoken word is highlighted from `voice/captions.words.json`.
- It uses the component's `boxed-pill` classes, so the look is the same: an ink plate, cream words
  and the spoken word in lava orange.
- A card text that no longer matches the voice is logged, so a re-voice cannot drift silently.

The corner tags (on an ink plate), the notes and the credit line sit above the subtitle band. The SRT
sidecar has the same 22 cues. The box artifact and the component's grouping are both in the friction
log.

![Spanish numbers scene](stills/es-numbers.jpg) ![Spanish fissure 8](stills/es-fissure8.jpg)
![Spanish Kapoho map](stills/es-kapoho.jpg)

## Translation notes

- **Numbers:** they match the English and the PDF. The count-up component formats numbers as en-US
  and has no locale option, so the Spanish page adds a small formatting shim for the decimal comma
  (13,7 / 35,5 km² / M6,9) and space grouping (60 000). This is logged as friction.
- **Units:** miles and acres stay as the source gives them, with the metric figures from the PDF
  (35,5 km²) or computed (unas 354 ha, unos 60 m for 200 ft).
- **Names:** Hawaiian names keep their Hawaiian spelling on screen (Hawaiʻi, Puʻu ʻŌʻō, Kīlauea).
  The narration says them through the Spanish lexicon entries. In the transcribe round-trip the
  glottal stops come back as "t" ("Awaiti", "Pututoto"); nobody listened by ear.

## Footage

- **Sources:** two USGS clips, both public domain (see Sources).
- **May 29:** only the aerial part (5.6-18.2 s) is used. Its ground-level half and the title cards are
  cut, and the tag says "USGS overflight footage, May 29, 2018".
- **June 11:** 22-46.5 s of the helicopter overflight (the hook), and the USGS map frame at 7.5 s
  (the Kapoho shot).
- **Corner bug:** both clips carry a small "USGS" corner bug at the lower left. The page scales each
  `<video>` 1.12-1.14x from the right edge, so the bug always leaves the frame. This was checked on
  full-size frames at 0, 3.4, 6.5, 42.5, 44.5, 46 and 49.5 s. No USGS logo or identifier appears
  anywhere in the video.
- **The June 3 card:** "June 3 · Lava reaches Kapoho Bay" appears over the USGS map shown at 5-11 s of
  the June 11 clip (a frame at 7.5 s, scaled to 1920x1080): the lava channel from fissure 8 to the
  "ocean entry" at Kapoho, on satellite imagery. The page starts close on the fissure 8 end and
  pulls back until the ocean entry is in frame. The tag reads "Map: fissure 8 channel to the ocean
  entry at Kapoho · USGS video, June 11, 2018". The map is not presented as June 3 imagery, and it
  carries no USGS logo or corner bug. The red ring on it is part of the USGS map (it circles the
  braided part of the channel) and was left as published.

## Sources and licenses

| Item | Source | License |
|---|---|---|
| Report (text, page 2, redrawn cross-section) | USGS Hawaiian Volcano Observatory, "Preliminary summary of Kīlauea Volcano's 2018 lower East Rift Zone eruption and summit collapse", Sept 2018, https://volcanoes.usgs.gov/vsc/file_mngr/file-192/PrelimSum_LERZ-Summit_2018.pdf (sha256 e8676996…d95465, 2 pages) | U.S. public domain (USGS copyright policy; landing page "Sources/Usage: Public Domain") |
| Causal link for the hook line | https://www.usgs.gov/volcanoes/kilauea/2018-lower-east-rift-zone-eruption-and-summit-collapse | U.S. public domain |
| Summit coordinates (globe marker) | https://www.usgs.gov/volcanoes/kilauea (19.421° N, 155.287° W) | U.S. public domain |
| Video, May 29, 2018 | https://www.usgs.gov/media/videos/kilauea-volcano-fissure-8-overflight | Public domain |
| Video, June 11, 2018 | https://www.usgs.gov/media/videos/kilauea-volcano-overflight-lava-channel-june-11-2018 | Public domain |
| Globe data | Natural Earth via `world-atlas` 2.0.2 (countries-50m) | public domain + ISC |
| Fonts | Bricolage Grotesque, IBM Plex Mono, Caveat, Space Grotesk (Fontsource) | SIL OFL 1.1 |
| Voices | Kokoro-82M `af_sarah` (EN), `em_alex` (ES) | Apache-2.0; synthetic narration, disclosed in the share text |
| Music | `audio compose --style dark-tension`, generated locally | no credit needed |
| Effects | synth `sub-drop` (generated); "Low Rumbling" by Musheran, OpenGameArt (`oga-low-rumbling`) | generated; CC0 |

The on-screen source line reads "Source: USGS Hawaiian Volcano Observatory, 'Preliminary summary …,'
Sept 2018. Video: USGS. Public domain. Not endorsed by USGS." Nothing in the video claims deaths,
evacuations, costs or "largest ever".

Files: [`share.txt`](share.txt) (YouTube with chapters, LinkedIn, X, README caption),
[`share-es.txt`](share-es.txt), [`credits.txt`](credits.txt), [`stills/`](stills/).
