# 13 · Wikipedia explainer: the honey bee waggle dance (English + French)

![poster](poster.jpg)

**English:** [`final.mp4`](https://github.com/FavioVazquez/showtime-examples/releases/download/examples-media-v1/13-wikipedia-waggle-dance--final.mp4) · 1920x1080 · 30 fps · 60.00 s · 15.0 MB · -14.1 LUFS / -1.5 dBTP ·
web page [`waggle-dance.html`](https://github.com/FavioVazquez/showtime-examples/releases/download/examples-media-v1/13-wikipedia-waggle-dance--waggle-dance.html) (11.3 MB, one file, plays offline, 7 chapters)
**Français :** [`final-fr.mp4`](https://github.com/FavioVazquez/showtime-examples/releases/download/examples-media-v1/13-wikipedia-waggle-dance--final-fr.mp4) · 1920x1080 · 30 fps · 64.20 s · 15.1 MB · -14.1 LUFS / -1.6 dBTP ·
web page [`danse-fretillante.html`](https://github.com/FavioVazquez/showtime-examples/releases/download/examples-media-v1/13-wikipedia-waggle-dance--danse-fretillante.html) (11.4 MB)

> **Licence: CC BY-SA 4.0**, not MIT. This video, its script and its project sources are adapted from a Wikipedia
> article, so they carry the article's share-alike licence ([LICENSE.txt](LICENSE.txt)). The repository's MIT
> licence covers showtime's code only. The bee footage inside stays CC BY 3.0 (Su et al. 2008).

## The request

> "Turn the Wikipedia article on the waggle dance into a 60-second animated explainer, and make a French version too."

**Mode:** quick, publish-bound (a researcher pass before the build, a critic pass on the final, a voice-director
pass on the French). No questions asked. The opening line stated the assumptions:

> Quick mode: 60 s, 16:9, canvas film with a procedural score, voice af_heart; French with ff_siwis, re-timed by
> its own narration. Source: English Wikipedia "Waggle dance", revision 1371912261 (CC BY-SA 4.0), so the video is
> CC BY-SA 4.0 too. Opening on real footage of a dancing bee (Su et al. 2008, CC BY 3.0), framed, not full-bleed.

**Contract:** a forager tells her nestmates where food is by dancing: the angle of her waggle run on the vertical
comb is the flower's angle from the sun, and the length of the run is the distance.

## The story

Scene times are not typed anywhere: `voice cues` turns `voice/timeline.json` into a `VO` table, `cues.js` reads
every cut from `VO.lines.<id>.start` and every reveal from the start of the word that names it (`vword()`), and the
two DOM layers take their windows from the same table. The French cut re-times itself by running `voice script` +
`voice cues` on its own narration.

| EN | FR | Scene | On screen | Its job |
|---|---|---|---|---|
| 0-5.4 s | 0-6.0 s | `hook` | Real footage (a red-marked forager on a crowded comb), a ring and a short trail on her red paint mark ("the camera moves with her"), the title | Hook with reality: "this bee is giving directions" |
| 5.4-13.2 | 6.0-14.2 | `problem` | A forager flies home past the sun and far flowers; the hive opens (dark); the camera goes in until the comb is a wall ("a vertical wall"); a pointing line stops at the hive wall; she starts to dance | Why she must dance: dark, vertical, nothing to point at |
| 13.2-25.9 | 14.2-29.6 | `angle` | Two panels: the field from above (sun, hive, food 45° right of the sun) and the comb ("up" = toward the sun). The 45° wedge flies from the field onto the comb and lands on her waggle run. The sun moves 25°: the field reads 20°, then her run turns to 20° | The core mechanism: direction |
| 25.9-35.3 | 29.6-40.0 | `distance` | One comb: the run, a loop to the left, a loop to the right ("a figure-eight"). Then near food vs far food: same dance, the far one waggles longer, a timer bar per run (no units) | Second idea: distance = duration |
| 35.3-45.0 | 40.0-49.2 | `round` | "Italian honey bee, *Apis mellifera ligustica*". A distance scale; as the food moves from ~10 m past 40 m, her small circle stretches into the waggle dance (round / transitional / waggle zones) | The nuance the article states, with its species qualifier |
| 45.0-53.9 | 49.2-57.9 | `source` | A browser window types `en.wikipedia.org/wiki/Waggle_dance` and scrolls the article's lead and Description (text only); beside it: Karl von Frisch, Nobel Prize 1973 (shared), "one of the first to decode the dance" | Where it comes from and where to read more |
| 53.9-60.0 | 57.9-64.2 | `credit` | "Angle tells direction. Duration tells distance." + the article, footage and output licence lines | Payoff, then the mandatory attribution (6 s) |

**Tracking the mark.** The ring in the hook is measured, not drawn: 116 stills of the clip (one per 0.1 s,
`showtime snap`), the red paint mark found by colour in each (`project/data/track_red_mark.py`), 52 positions
kept for the 5.4 s shown (`data/dance-track.js`). The positions are in the frame's own pixels, and the camera
follows the dancer (a whole-frame shift of up to ~60 px between stills 0.1 s apart), so they are **not** her path
on the comb. The page therefore draws a ring on the mark and only the last 0.7 s as a trail, labelled "Her red
paint mark, tracked (the camera moves with her)". Where the mark was not found (blurred, mostly during the
waggle run) the ring is interpolated and drawn dimmer. An earlier cut drew the whole series and called it "her
path"; the independent critic caught that (see Review).

**The source scene is text only.** The live article shows two figures under other licences (Bee dance.svg,
CC BY-SA 2.5; Waggle dance.png, CC BY 2.5) and the Wikipedia logo. `site record` cannot hide elements, so
`capture/make_text_only.py` saves the live page (checking it is revision 1371912261), strips its scripts and hides
figures, images and the logo; `site record --serve` then scrolls that copy. Nothing else on the page changes.

## Commands, in order

`showtime` is `skills/showtime/bin/showtime`; `<job>` is `showtime-out/waggle-dance-20260927-133213`, `<p>` is
`<job>/project`; `<fr>` is `showtime-out/waggle-dance-fr-20260927-140728`.

```bash
showtime doctor --quick
showtime job init waggle-dance --mode quick --platform youtube --goal "Turn the Wikipedia article ..." \
  --assumed "Source: English Wikipedia 'Waggle dance' rev 1371912261 (2026-08-29), CC BY-SA 4.0; output CC BY-SA 4.0" \
  --assumed "60 s, 16:9, canvas film, voice af_heart, procedural Synth score; FR with ff_siwis" \
  --assumed "Real footage: Su et al. 2008 Movie S2 (CC BY 3.0), framed, not full-bleed"

# real material: the live article, the CC BY footage
showtime site capture https://en.wikipedia.org/wiki/Waggle_dance <job>/capture/wiki --no-assets --max-shots 6 --max-height 8000
showtime new film <p> --title "The waggle dance" --duration 60
showtime assets media search "East Learns from West Asiatic Honeybees dance" --source commons --type video --allow-attribution
showtime assets media fetch commons:20989587 --project <p> --allow-attribution      # sha1 matches the Commons file
showtime footage probe <p>/assets/media/20989587.ogv                                 # 11.58 s, 640x480 shown 4:3
showtime footage trim <p>/assets/media/20989587.ogv --webm --no-audio --crf 30 -o <p>/media/dance.webm
showtime snap <p>/media/dance.webm --every 0.5 --cols 6                              # look at the dance
showtime snap <p>/media/dance.webm --at 0.017,0.117,...,11.517 -o track              # 116 stills for the trace
python project/data/track_red_mark.py track                                          # -> data/dance-track.js
python capture/make_text_only.py <job>/capture/wiki-text                             # rev 1371912261, text only
showtime site capture --serve <job>/capture/wiki-text <job>/capture/wiki-local --width 1120 --no-assets --no-full
showtime site record --serve <job>/capture/wiki-text <job>/capture/wiki-scroll --width 1120 --duration 6 --hold 1.3 --to 0.14 --dpr 2
showtime footage trim <job>/capture/wiki-scroll/scroll.mp4 --webm --no-audio --width 1600 --crf 34 -o <p>/media/wiki-scroll.webm

# voice first: the narration sets every cut
showtime voice ipa "Karl von Frisch shared the 1973 Nobel Prize ..."        # "1973" read as "nineteen hundred ..."
showtime voice ipa "Karl von Frisch, ... Apis mellifera." --lang fr         # "von" read as French "vont"
#   -> project/lexicon.json (von, Frisch per language); narration.md spells [1973](nineteen seventy-three)
showtime voice script <p>/narration.md -o <p>/voice --fit 58     # 59.37 s natural -> x1.04: cut 4 words
showtime voice script <p>/narration.md -o <p>/voice --fit 58     # 58.65 -> 58.00 s (x1.01, pauses -0.28 s)
showtime voice cues <p>/voice/timeline.json -o <p>/voice/cues.js

# music alone, in seconds
showtime score <p>        # -17.1 LUFS: 3 dB under the voice -> master gain -9
showtime score <p>        # -28.7 LUFS, but distance/source 8 dB quieter -> bass added there
showtime score <p>        # -28.1 LUFS, sections -24..-34 dB, voice about 14 dB over the bed

# first look, fix, look again
showtime snap <p> --at 0.5,3,5,...,59 --sheet --cols 6          # 3 rounds of stills
showtime check <p>        # 11 warnings: 6 still holds, "dark" 0.8 s, system font in the browser chrome, ...
showtime check <p>        # PASS, 1 warning (a component's 15 s load timer; see Tool issues)
showtime render <p> --job <job> --preview                        # 720p draft, 1 m 15 s
showtime snap <job>/preview.mp4 --every 2 --cols 6

# final, verify
showtime render <p> --job <job>                                  # final.mp4 (77 MB master, static grain)
showtime captions <p>/voice/vo.words.json --style clean --aspect 16:9 -o <job>/captions.ass --srt <job>/final.srt
showtime qa <job>                                                # PASS
showtime review-pack <job>                                       # round 1 -> review/round-1/FINDINGS.md

# French: same project, own voice, own timing
showtime job init waggle-dance-fr --mode quick --platform youtube --goal "French version ..." --assumed "..."
#   copy the project, lang.js = "fr", narration.fr.md (same line ids), strings.js carries both languages
showtime voice script <fr>/project/narration.fr.md -o <fr>/project/voice         # 61.82 s
showtime transcribe <fr>/project/voice/vo.wav --language fr --no-events          # round trip: "colauréat" misheard
showtime voice script <fr>/project/narration.fr.md -o <fr>/project/voice         # rewritten line only: 62.20 s
showtime voice cues <fr>/project/voice/timeline.json -o <fr>/project/voice/cues.js   # the film re-times itself
showtime snap <fr>/project --at ... --sheet                                      # overflow check: 2 fixes
showtime check <fr>/project; showtime render <fr>/project --job <fr>
showtime captions <fr>/project/voice/vo.words.json --style clean --aspect 16:9 --max-words 7 -o <fr>/captions.ass --srt <fr>/final.srt
showtime qa <fr>          # WARN: 2 frozen stretches, 45-char lines -> fixed (below), re-rendered

# round-1 fixes (both languages), then one full-res render each
showtime render <fr>/project --from 29.3 --to 33 -o <fr>/work/cut-distance.mp4   # the frozen-stretch fix, 3.7 s
showtime render <p> --job <job>                                  # final-2.mp4
showtime render <fr>/project --job <fr>                          # final (after one more label fix)
showtime qa <job>                                                # PASS (0 warn)
showtime qa <fr>                                                 # WARN: 1 caption at 21 chars/s (kept, see QA)
showtime review-pack <job>                                       # round 2 -> review/round-2/FINDINGS.md
showtime snap <job>/final-2.mp4 --at 45.04,45.5,52.5,53.5,54.2 --compare <job>/final.mp4

# deliver
showtime deliver exports <job> --targets youtube                 # 49.3 MB (FR 52.5 MB), not committed
showtime deliver exports <job> --targets original --max-mb 8     # 7.6 MB each, not committed (footage gets soft)
showtime deliver exports <job> --targets original --max-mb 16    # this folder's final.mp4 / final-fr.mp4
showtime qa <job>/exports/final-2.16mb.mp4 --project <p> --platform youtube     # PASS
showtime deliver thumb <job>/final-2.mp4 --at 4.6 -o <job>/thumb-1280x720.jpg   # (and the French one)
showtime export html <p> --audio score -o <job>/work/score-only-test.html       # 10.3 MB, but no voice: not shipped
showtime export html <p> --audio embed --target artifact -o <job>/waggle-dance.html
showtime export html <fr>/project --audio embed --target artifact -o <fr>/danse-fretillante.html
showtime job note <job> --stage deliver --verified "..." --next "..."   # (and <fr>)
showtime clean <job> -y; showtime clean <fr> -y     # freed 333.5 MB and 93.0 MB

# after the independent critic (see Review): fixes in scenes.js, layers.js, index.html, strings.js, then
showtime snap <p> --at 0,2.5,4.6,22.5,25,44.9,45.04,45.2,45.35,52.5 --width 960 --format jpg -o <scratch>/en1
showtime snap <fr>/project --at 0,4.6,22,24,26,28,49.2,49.4,49.6,56 --width 960 --format jpg -o <scratch>/fr1
showtime check <p>; showtime check <fr>/project                  # PASS, same 1 warning as before
showtime render <p> --job <job>                                  # final-3.mp4, 1 m 25 s
showtime render <fr>/project --job <fr>                          # final-2.mp4
showtime qa <job>                                                # PASS (0 warn)
showtime qa <fr>                                                 # WARN: the same 21 chars/s cue, in .ass and .srt
showtime snap <job>/final-3.mp4 --at 0,4.6,45.04,45.2,52.5 --compare <job>/final-2.mp4   # review/after-critic/
showtime snap <fr>/final-2.mp4 --at 4.6,28,49.4,49.6 --compare <fr>/final.mp4
showtime review-pack <fr>                                        # the French cut's own pack -> review/fr-round-1/
showtime deliver exports <job>/final-3.mp4 --targets original --max-mb 16    # final.mp4 (15.0 MB)
showtime deliver exports <fr>/final-2.mp4 --targets original --max-mb 16     # final-fr.mp4 (15.1 MB)
showtime qa <job>/exports/final-3.16mb.mp4 --project <p> --platform youtube  # PASS (and the French one: PASS)
showtime deliver thumb <job>/final-3.mp4 --at 4.6 -o <job>/thumb-1280x720.jpg   # (and the French one)
showtime export html <p> --audio embed --target artifact -o <job>/waggle-dance.html          # 11.3 MB
showtime export html <fr>/project --audio embed --target artifact -o <fr>/danse-fretillante.html  # 11.4 MB
```

## Features shown

| Feature | Where |
|---|---|
| `new film`, Film API drawing (`F.sequence` fades and pushes, `F.withCamera` push-ins, `F.path`, `F.arrow`, `F.pill`, `F.paragraph`, `F.reveal`, `F.wrap`/`F.measure` fitting, `F.camPoint`) | `project/scenes.js`: hive, comb, bees, sun, flowers, wedges, all drawn in code |
| `ST.score` / `Synth` + `showtime score` | `project/score.js`: F major, a 4-note motif answered on the end card, sections on the voice cues, `duckUnder` the voice lines |
| `voice script --fit 58`, Kokoro `af_heart` | `project/narration.md` (143 words, 58.00 s at x1.01) |
| `voice cues` re-timing a canvas film | `project/voice/cues.js` -> `project/cues.js` (every cut and reveal), re-run for French |
| `voice ipa` + per-language lexicon; inline respelling | `project/lexicon.json` (von, Frisch in EN and FR), `[1973](nineteen seventy-three)` |
| French localisation, Kokoro `ff_siwis` | `project-fr/` (narration.fr.md, own timeline), `project/strings.js` (every string in both languages) |
| `transcribe` as a pronunciation round trip | French narration (see `crew/voice-director-fr.md`) |
| `site capture` of a remote URL; `site record` scroll-through | the live article (capture), its text-only copy (record, `--serve`) |
| `browser-frame` component (`typeUrl`, a video `src`) over a canvas film | `index.html` `#source-layer` |
| `<video>` layer from `footage trim --webm`, stage-seeked, with an SVG overlay driven by `ST.onSeek` | `index.html` `#hook-layer`, `project/layers.js` |
| `assets media search/fetch --allow-attribution` (sidecar + CREDITS) | the CC BY 3.0 footage (`assets/media/*.license.json`) |
| `captions` clean, EN + FR SRT sidecars | `captions.srt`, `captions-fr.srt` |
| `deliver thumb` 1280x720 | `thumb-1280x720.jpg`, `thumb-fr-1280x720.jpg` |
| `deliver exports --targets youtube`, `original --max-mb 8` and `--max-mb 16` | above (the 16 MB copies ship) |
| `export html` (`--audio score` tried, `--audio embed --target artifact` shipped), 0 network requests (CSP `default-src 'none'`) | `waggle-dance.html`, `danse-fretillante.html` |
| `check`, `snap` (project, video, `--compare`), `render --preview`, `render --from/--to`, `qa`, `review-pack` | above |
| crew roles: researcher, voice-director (FR), critic | `crew/research.md`, `crew/voice-director-fr.md`, `review/` (see the note below) |
| `job init/note`, `job discard`, `clean` | both jobs |

`export html --audio score` (the brief's "tiny, live score" page) was made and measured, then not shipped: it
plays only the Synth score, so the narration is gone (the exporter warns), and it is not tiny here anyway (10.3 MB):
the two footage layers are most of the file. Both shipped pages embed the mixed soundtrack (AAC 96k, ~0.75 MB).
They are `--target artifact` single files under the 16 MB artifact limit; nothing was uploaded from this session.

**About the crew.** This session had no sub-agent tool, so the director did each crew task from its brief in
`references/crew/` and wrote the same files a crew member would: `crew/research.md` (every claim against the pinned
revision), `crew/voice-director-fr.md`, and the critic's `review/round-*/FINDINGS.md`, labelled as self-reviews.
A second look by a person, and a native French speaker's read of `project-fr/narration.fr.md`, are the remaining steps.

## Review (self-reviews)

**Round 1** (on `final.mp4`): ship after fixes. What worked: the measured trace on real footage as the hook; the
same wedge in the field and on the comb (45° and 45°, then 20° and 20°, same side, checked with `snap --at`);
the full attribution on a 6 s end card.

| # | Finding (time) | Change |
|---|---|---|
| 1 | Should-fix: the browser window rose in while the round-dance scene was still cross-fading, a white card over the distance scale (45.04 s) | the DOM layer starts at `CUE.source + 0.3`, after the canvas fade |
| 2 | Should-fix: the source column and the payoff title on screen together (53.75 s) | the source text fades out over `CUE.credit - 0.6 .. - 0.2`, the window with it |
| 3 | Should-fix: "one of the first to decode the dance" up ~1.4 s before the end card | end card at speech end + 1.3 s (was + 0.75) |
| 4 | Should-fix (French): qa frozen 2.5 s at 14.8 s and 29.9 s: the comb waited for the voice, the dancer was small | a bee walks onto the comb until her first run; in the distance scene she is already dancing and the comb's light follows her |
| 5 | Polish (French): 45-character caption lines; "rien à montrer du doigt" read oddly | `--max-words 7` for French; the label is now « hors de vue » |

**Round 2** (on `final-2.mp4`, fixes only): ship. Each fix confirmed on stills next to the old render
(`review/round-2/compare.jpg`).

**Review round note: independent critic on round 2** (a separate critic pass, not a self-review). Verdict: ship
after fixes. It kept the facts, licences, loudness and three of the four round-1 fixes, and found what the two
self-reviews missed. Everything below is fixed in the shipped files (English `final-3`, French `final-2` in the
jobs); before/after stills in `review/after-critic/`, each checked with `snap --at` at the cited time.

| # | Finding (time) | Change |
|---|---|---|
| 1 | **Blocker:** "Her path, traced frame by frame" (0-5.4 s, the poster) was wrong. The mark is tracked in the frame's own pixels, and the camera follows her (feature matching between stills 0.1 s apart shows whole-frame shifts of tens of pixels), so the gold line was mostly camera motion, not her path on the comb and not a figure-eight | Relabelled "Her red paint mark, tracked" + "(the camera moves with her)" (FR: « Sa marque de peinture rouge, suivie » / « (la caméra la suit) »); a ring on the mark and only a 0.7 s trail instead of the whole series; the ring is dimmer where the mark was not found. Credits, share.txt alt text, this README and `crew/research.md` no longer say "path" or "figure-eight" for the hook. Stabilising the footage was tried (ORB + RANSAC between frames), but the chained estimate drifted in scale and rotation, so it was not used |
| 2 | Should-fix: round-1 fix #1 held only in part: the SOURCE column faded in over the round-dance comb (44.9-45.2 s; FR 49.2-49.5 s, with « Karl von Frisch » too), then the comb vanished in one frame | The round scene fades out over `CUE.source - 0.15 .. + 0.28`; the whole text column now comes in with the browser window (`CUE.source + 0.3 .. + 0.8`) |
| 3 | Should-fix (French): « course frétillante » was pulled left by the edge clamp, so the waggle-run line struck through it (22-29 s) and « 42° » ran into it (~28 s) | The label never moves back across the line: when it does not fit beside the run's end it wraps (« course » / « frétillante ») and shrinks if needed; English "waggle run" wraps the same way at 45° |
| 4 | Should-fix: the French cut had no review pack | `showtime review-pack` on the French final; self-review in `review/fr-round-1/` (ship) |
| 5 | Polish: the footage's black top band and head-switch edge, and the bottom band, showed inside the card | The frame is scaled so rows 22-454 of 480 fill the card (`.foot-in` in `index.html`); push-in now 1.00 to 1.06 |
| 6 | Polish: "rev" / "1371912261" and "(shared)" alone on a line in the source column | Non-breaking spaces ("rev 1371912261", "1973 (shared)") and the column 40 px wider. `F.wrap` breaks at non-breaking spaces too, so the column uses a small local wrapper that breaks only at ordinary spaces |

The critic's notes arrived cut off after a polish item at 25.00 s, so that last item is not known and was not acted on.
Per the two-round protocol this did not start a third critic round: a person still needs to take a second look.

## QA summary

- **English** (`final.mp4` = the job's `final-3` capped at 16 MB): **PASS (0 fail, 0 warn, 0 note)**, `--platform youtube`.
  Master `final-3.mp4` (77.5 MB): PASS, -14.0 LUFS / -1.6 dBTP; voice about 14.4 dB over the score.
  h264 High, yuv420p, 1920x1080, 30 fps, faststart, BT.709; 60.00 s = showtime.json; no silent gaps, no black or
  frozen stretches; frame 0 has picture and flows into frame 1; captions: 23 cues, readable; credits: the one CC BY
  item is listed.
- **French** (`final-fr.mp4` = the job's `final-2` capped at 16 MB): the export alone is PASS (0 warn); the master
  `final-2.mp4` (81.4 MB) with its captions is **WARN (0 fail, 2 warn)**, -14.0 LUFS / -1.6 dBTP, 64.20 s. Both
  warnings are the same caption ("Plus la nourriture est loin,", 36.5 s), counted once in `captions.ass` and once in
  `final.srt`: it needs 21 characters/s, limit 20. Kept: the cue follows the voice's pace, and joining it to the
  next cue would pass 42 characters per line.
- `showtime check`: PASS, 1 warning in both (a 15 s safety timer inside the components' media loader, counted as a
  playback timer; the frames are unaffected) and 7 notes (browser-chrome decor text; labels near the edge during the
  push-ins).

## Tool issues found (reported, worked around here)

- `site record` / `site capture` cannot hide elements or inject CSS, so a page with images under other licences
  needs a saved, patched copy (`capture/make_text_only.py`) and `--serve`.
- `assets media fetch` copies the Commons "Author" field, which names the paper's editor as an author here;
  credits were corrected by hand.
- `export html --audio score` drops the voice mix of a narrated film (warned, by design); `assets credits --all`
  lists no fonts, voice or score, so credits.txt was written by hand.
- `check`/`render` warn about a `setTimeout` in `components/core.js` (`mediaReady`'s 15 s fallback), which fires
  during playback in any page with a component video.
- `review-pack` builds its scene list from the DOM clips (2 layers) instead of the film's acts.
- `captions --style clean` writes 45-character French lines that `qa` then flags (limit 42).

## Timings

Shared 6-core Intel i5, other example builds running (load 14-23).

| Step | Time |
|---|---|
| `site capture` (remote) | 39 s |
| `site record` (258 frames at 2x) | 1 min 09 s |
| `voice script` EN (6 lines) | 3 min 18 s first run, 67 s after the cut |
| `voice script` FR | 63 s |
| `transcribe` (FR round trip, 62 s of audio) | 1 min 22 s |
| `score` | ~20 s |
| `check` | 25-35 s |
| `render --preview` (720p) | 1 min 15 s |
| `render` final (1800 frames, 2 `<video>` layers) | 2 min 55 s; French 2 min 15 s |
| `qa` | 8-28 s |
| `export html` | ~25 s each |

## Files

```
final.mp4 / final-fr.mp4        the videos (English qa PASS, French qa WARN: one 21 chars/s caption)
poster.jpg / poster-fr.jpg      the hook at 4.6 s (the tracked red mark on real footage)
thumb-1280x720.jpg (+ -fr)      YouTube thumbnails (deliver thumb)
captions.srt / captions-fr.srt  sidecar captions
waggle-dance.html               English web page (export html --target artifact, plays offline)
danse-fretillante.html          French web page
share.txt                       YouTube copy, EN + FR, with alt text and the licence lines
credits.txt / credits-fr.txt    article, footage, voice, fonts, music, output licence
LICENSE.txt                     CC BY-SA 4.0 for this folder (footage CC BY 3.0)
project/                        the English project: index.html, scenes.js, cues.js, strings.js (EN + FR), layers.js,
                                score.js, narration.md, lexicon.json, audio/mix.json, data/ (mark track + script),
                                media/ (footage and scroll as VP9), voice/ (timings, no WAVs)
project-fr/                     what differs in French: lang.js, showtime.json, narration.fr.md, voice/ timings
capture/make_text_only.py       the text-only article copy for the scroll
crew/                           researcher and voice-director notes (done inline)
review/                         round 1 and 2 findings (self-reviews), round-2 compare sheet, after-critic/
                                before/after sheets, fr-round-1/ (French pack sheet + self-review)
```

To rebuild English: `showtime voice script project/narration.md -o project/voice --fit 58`, `showtime voice cues
project/voice/timeline.json -o project/voice/cues.js`, then `showtime render project`. French: copy `project/`,
overlay `project-fr/`, run `showtime voice script narration.fr.md -o voice` and `voice cues` in it, then render.

## Sources and licences

- **Text:** "Waggle dance", Wikipedia contributors, English Wikipedia, revision 1371912261 (2026-08-29),
  <https://en.wikipedia.org/w/index.php?title=Waggle_dance&oldid=1371912261>, CC BY-SA 4.0
  (<https://creativecommons.org/licenses/by-sa/4.0/>); summarised, rewritten as narration, animated and (French)
  translated. The French article (<https://fr.wikipedia.org/wiki/Danse_des_abeilles>) was used for terminology only.
- **Footage:** Movie S2 of Su S, Cai F, Si A, Zhang S, Tautz J, Chen S (2008), "East Learns from West: Asiatic
  Honeybees Can Understand Dance Language of European Honeybees", PLOS ONE 3(6): e2365,
  <https://doi.org/10.1371/journal.pone.0002365>, via Wikimedia Commons, CC BY 3.0; trimmed, cropped, overlay drawn.
- **Nobel fact:** <https://www.nobelprize.org/prizes/medicine/1973/summary/>.
- **Not used:** the article's figures (Bee dance.svg, CC BY-SA 2.5; Waggle dance.png, CC BY 2.5), hidden in the
  scroll; the Wikipedia logo, hidden. The 45° diagram is drawn from the caption's facts, not traced.
- **Voices:** Kokoro-82M (Apache-2.0), af_heart and ff_siwis (trained on SIWIS, CC BY 4.0), synthesized locally.
- **Fonts:** Fraunces, Inter (SIL OFL 1.1), served locally by showtime.
- **Music:** composed in code with showtime's Synth (no samples, no library tracks).
- **Output:** CC BY-SA 4.0 ([LICENSE.txt](LICENSE.txt)).
