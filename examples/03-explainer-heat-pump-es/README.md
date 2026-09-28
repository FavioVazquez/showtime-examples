# 03 · Explainer, localized: the heat pump film in Spanish (50 s)

![poster](poster.jpg)

**Video:** [`final.mp4`](https://github.com/FavioVazquez/showtime-examples/releases/download/examples-media-v1/03-explainer-heat-pump-es--final.mp4) · 1920x1080 · 30 fps · 50.90 s · 17.3 MB · -14.0 LUFS / -1.6 dBTP
· Spanish sidecar captions [`captions.srt`](captions.srt)

**Web page:** [`bomba-de-calor.html`](bomba-de-calor.html) · one file, 1.1 MB · plays offline · 9 chapters (see "Web page" below)

This is [example 02](../02-explainer-heat-pump/) made again in Spanish: the same picture, diagram and
score, with a Spanish narration, Spanish on-screen text, and every cut and reveal moved to the Spanish
voice.

## The request

> "Now make the Spanish version of the heat pump explainer"

**Mode:** quick. No questions were asked. These assumptions were stated up front and logged in the job:

- Neutral international Spanish: *tú* forms, *afuera/adentro*, no regional slang.
- The best local Spanish voice, picked by an audition.
- The film follows the Spanish voice at its natural pace, even if it runs longer than 45 s. The fit
  speed stays at or below x1.05.
- Sidecar captions for YouTube, as in the original.
- **The translation is machine-made (by Claude) and has not been reviewed by a native speaker yet.**
  `share.txt` says so as well.

## What it demonstrates

- **Localizing a showtime project, not a finished file.** A finished file could only get a new voice
  track and subtitles. The project was copied into a new job instead, so the output is a complete
  Spanish film: translated text drawn in the scene, a new voice, captions, re-timed scenes, and a
  re-render (`references/workflows/localize.md`, "Steps (showtime project)").
- **Re-timing from the new voice.** The Spanish narration runs 50.07 s, against 44.58 s for the English.
  The slot starts and word starts in the new `voice/timeline.json` replace every time in `cues.js`, so
  the reveals still land on the words that name them:

  | Reveal | Spanish word |
  |---|---|
  | EVAPORADOR | *Afuera* |
  | pressure tag | *comprime* |
  | temperature riser | *dispara* |
  | VÁLVULA DE EXPANSIÓN badge | *válvula* |
  | "sale calor" arrow | *sale* |

  The English film had a few times typed in as plain numbers: the refrigerant flow start (13.45 s),
  the molecule overlay fade (10.0 s), and three score events (7.4, 9.7 and 9.9 s). These now read the
  cue table, so the diagram and the score follow the Spanish timing too.
- **A voice audition before committing.** The same three sentences were spoken by `ef_dora` (espeak
  `es` and `es-419`), `supertonic:F1` and `supertonic:M1`. `showtime transcribe` then read each one back
  word-perfect. `supertonic:F1` was chosen: the skill ranks it the most natural local Spanish voice,
  and it is female, like the original's `af_heart`. The script uses no English brand names, so no
  lexicon entries were needed (`voice ipa` was checked first).
- **Longer text, fixed layout.** Spanish strings run about 20-40 % longer, and five layout fixes
  were checked in snaps before the final:
  - **Kicker.** "CÓMO FUNCIONA UNA BOMBA DE CALOR" ran into the hook's "?". It is now set in two
    right-aligned lines at 34 px (the first build shrank it to one 27 px line; the review round found that
    too small on a phone).
  - **End-card title.** "CÓMO UNA BOMBA DE CALOR CALIENTA UNA CASA" ran off the snow onto the dark
    floor, where its dark ink could not be read. It became "CÓMO CALIENTA UNA BOMBA DE CALOR".
  - **Valve badge in the recap.** "VÁLVULA DE EXPANSIÓN" is about 140 px wider than the English
    badge and covered the coil and the house wall. In the recap it now moves down onto the snow
    under the valve, dimming while it passes over the valve and the pipe.
  - **Arrows after tags.** The ↑ arrows after "presión" and "temperatura" are placed from the
    measured width of each tag, not from fixed x positions.
  - **"heat out" tag.** "calor que sale" crossed the 5 % right margin. It became "sale calor", the
    narration's own words, and sits under the arrow on the empty wall.
- **Reading time is part of the check.** The first `check` warned that "−273 °C · movimiento mínimo"
  (1.8 s, needs 1.9 s) and "circuito sellado de refrigerante" (2.0 s, needs 2.2 s) were not on screen
  long enough to read. Both now come in earlier and stay longer, and `check` passes with 0 warnings.
- **Hand-balanced captions.** `showtime captions` grouped the voice's words into 20 cues. Four of
  them were one or two words long ("Afuera,", "Adentro,", "en líquido."). `captions.srt` is a
  hand-balanced 15-cue version cut at clause breaks. Each cue starts on its first word's start in
  `voice/vo.words.json`, runs at no more than 15.6 characters per second, and qa passes it.

## Commands, in order

`showtime` is `skills/showtime/bin/showtime`. `<job>` is `showtime-out/heat-pump-es-20260926-164622`.

```bash
showtime doctor --quick
showtime voice list --lang es
showtime job init heat-pump-es --platform youtube \
  --goal "Now make the Spanish version of the heat pump explainer (...)" --assumed "..." (x5)
cp -R examples/02-explainer-heat-pump/project <job>/project        # the original stays untouched
#   narration.md -> narration.es.md (same line ids), old voice/ removed

showtime voice ipa "Afuera está helando. Cero grados Celsius ... válvula de expansión, electricidad" --lang es
showtime voice ipa "Cero grados Celsius, electricidad, encima" --lang es-419   # seseo check
# audition: one 3-sentence passage, four voices
showtime voice say "<passage>" -v ef_dora -o dora-es.wav
showtime voice say "<passage>" -v ef_dora --lang es-419 -o dora-419.wav
showtime voice say "<passage>" -v supertonic:F1 --lang es -o st-f1.wav
showtime voice say "<passage>" -v supertonic:M1 --lang es -o st-m1.wav
showtime transcribe dora-es.wav dora-419.wav st-f1.wav st-m1.wav --language es --no-events --no-refine
#   all four read back word-perfect -> supertonic:F1

showtime voice script <job>/project/narration.es.md -o <job>/project/voice --lead-in 0.35 --lang es
#   49.65 s, 116 words; slot starts + word starts copied into cues.js
#   (scenes.js strings translated; hard-coded times -> CUE; showtime.json + audio/mix.json -> 50.2 s)
showtime check <job>/project                     # PASS, 2 WARN (reading time) -> fixed
showtime snap <job>/project --every 2 --sheet --thumb 640 --cols 4 --format jpg -o <job>/work/snap1
showtime snap <job>/project --at 3.5,40.5,49.5 --width 1280 --format jpg -o <job>/work/snap2
#   kicker vs "?", end-card overflow, recap valve badge, arrow spacing, right margin -> fixed
showtime snap <job>/project --at 3.5,26.8,28.5,39.8,40.6,49.5 --sheet --thumb 960 --cols 2 --format jpg -o <job>/work/snap3
showtime captions <job>/project/voice/vo.words.json --style clean --size 1920x1080 \
  -o <job>/captions.ass --srt <job>/final.srt      # 20 cues, 4 fragments -> hand-balanced SRT
showtime captions <job>/work/caps/captions.src.srt --style clean --size 1920x1080 \
  -o <job>/captions.ass --srt <job>/final.srt      # .ass OK; .srt regrouped, so final.srt = captions.src.srt
showtime job note <job> --stage plan ...
showtime check <job>/project                     # PASS, 0 errors, 0 warnings, 2 info notes
showtime snap <job>/project --at 4.2,10.4,11.6,11.85,17.2,19.5,23.2,31.2,33.8,38.6,40.1,47.9 \
  --sheet --thumb 640 --cols 3 --format jpg -o <job>/work/snap4

showtime render <job>/project --job <job> --crf 25 --x264-preset slow --format png --poster none --workers 2
#   final.mp4, 17.1 MB
showtime qa <job>                                # PASS; the sheet showed the recap badges still up
#   while "Mover calor" wrote over them at 41.1 s -> labels now fade out 0.35 s before the payoff
showtime snap <job>/project --at 40.9,41.2,41.5 --sheet --thumb 640 --cols 3 --format jpg -o <job>/work/snap5
showtime check <job>/project                     # PASS, 0 warnings
showtime render <job>/project --job <job> --crf 25 --x264-preset slow --format png --poster none --workers 2
#   final-2.mp4, 17.1 MB (shipped before the review round)
showtime qa <job>                                # PASS on final-2.mp4
showtime deliver poster <job> --at 3.6 --out <job>/final-2.poster.jpg
showtime review-pack <job>                       # review/round-1/
showtime job note <job> --stage verify ...
showtime job note <job> --stage deliver ...

# review round (critic notes on final-2.mp4)
showtime snap <job>/project --at 0,3.6,10.9,30.2,39.5,40.4,48.5,50.1 --format jpg -o <job>/work/round2/before
#   narration.es.md: 3 lines reworded (evaporator, compressor, payoff)
showtime voice script <job>/project/narration.es.md -o <job>/project/voice --lead-in 0.35 --lang es
#   3 lines re-synthesized, 5 cached; 50.07 s -> new times into cues.js, mix.json, showtime.json (50.9 s)
showtime transcribe 04-evaporator.wav 05-compressor.wav 08-payoff.wav --language es --no-events --no-refine
#   all three word-perfect
showtime captions <job>/work/caps/captions.src.srt --style clean --size 1920x1080 \
  -o <job>/captions.ass --srt <job>/final.srt      # final.srt = the rebuilt 15-cue captions.src.srt
showtime snap <job>/project --at 0,3.6,10.9,30.8,39.0,39.6,40.2,40.8,41.4,48.5,50.8 --format jpg -o <job>/work/round2/after
showtime check <job>/project                     # PASS, 2 WARN (0 °C box overlap, "líquido frío" 0.8 s) -> fixed
showtime check <job>/project                     # PASS, 0 warnings, 0 notes
showtime render <job>/project --job <job> --crf 25 --x264-preset slow --format png --poster none --workers 2
#   final-3.mp4, 17.3 MB
showtime qa <job>                                # PASS on final-3.mp4
showtime deliver poster <job> --at 3.6 --out <job>/final-3.poster.jpg
showtime review-pack <job>                       # review/round-2/
showtime job note <job> --stage feedback --verified "round 2 applied: qa PASS"

# round 2 (critic: ship; 3 polish notes, all applied)
showtime snap <job>/project --at 0,39.8,39.9,40.0,40.1,49.685 --format jpg -o <job>/work/round3/before
#   scenes.js: 21 °C starts at 80 %, valve badge moves 0.15 s earlier and dims over the pipe,
#   "sale calor" under the arrow
showtime snap <job>/project --at 0,39.8,39.9,40.0,40.1,49.685 --format jpg -o <job>/work/round3/after
showtime check <job>/project                     # PASS, 0 warnings, 0 notes
showtime render <job>/project --job <job> --workers 2
#   final-4.mp4, 76.3 MB: forgot the encode flags (crf 16, medium, jpeg capture); not used
showtime render <job>/project --job <job> --crf 25 --x264-preset slow --format png --poster none --workers 2
#   final-5.mp4, 17.3 MB (shipped)
showtime qa <job>                                # PASS on final-5.mp4
showtime deliver poster <job> --at 3.6 --out <job>/final-5.poster.jpg
showtime job note <job> --stage feedback --verified "round 3 polish applied: qa PASS"
```

`share.txt` was written by hand in Spanish, following `references/platforms.md`, with an English
caption for this README. The size came from the render's own `--crf 25 --x264-preset slow --format png`,
the settings example 02 settled on, so no re-encode was needed.

## Timings (6-core Intel i5 Mac, CPU shared with three other example agents)

| Step | Time |
|---|---|
| `doctor --quick` | 7.7 s |
| `voice say`, audition (4 voices, 1 passage each) | 7-19 s each |
| `transcribe`, 4 auditions (large-v3-turbo) | 1 m 04 s |
| `voice script` (8 lines, Supertonic F1) | 56 s |
| `check` | 20-23 s |
| `snap --every 2` (26 frames) | 13 s |
| `render --crf 25 --x264-preset slow --format png --workers 2` | 2 m 55 s (capture 1 m 54 s, encode 57 s); 3 m 28 s the second time (capture 2 m 17 s, encode 1 m 07 s); 3 m 45 s in the review round (capture 2 m 32 s, encode 1 m 04 s); 4 m 25 s in round 2 (capture 2 m 48 s, encode 1 m 33 s) |
| `qa` | 13-16 s |
| `review-pack` | 28-37 s |
| `voice script`, review round (3 changed lines re-synthesized, 5 cached) | 13-45 s |
| `transcribe`, 3 re-voiced lines | 53 s |

About 20 minutes from request to the first published version, including the audition and two full
renders. The review round took about 25 minutes more, one render included, and the round-2 polish
about 15 minutes (two renders, one of them with the wrong encode flags).

## QA

`showtime qa` on the shipped file (`final-5.mp4`, after both review rounds): **PASS (0 fail, 0 warn, 0 note)**.

- File: h264 High yuv420p BT.709 with faststart, 1920x1080 at 30 fps. The 50.90 s duration matches
  `showtime.json`.
- Audio: -14.0 LUFS integrated, true peak -1.6 dBTP. Sound runs from 0.00 s to 50.85 s with no silent
  gaps.
- Picture: no black or frozen stretches, and frame 0 is the hook.
- Captions: `final.srt` (15 cues) and `captions.ass` (18 cues) both pass.
- No attribution is required.

`check` before the final: PASS, 0 errors, 0 warnings, 0 notes. It confirmed the render is deterministic,
uses no network, embeds its fonts, and has enough contrast for 44 text elements. The first build left 2
info notes, the same ones as the English film (the hook's "0 °C" came within 5 % of the top edge
during the slow push-in); the review round cleared them.

**Review.** See "Review round" below. The score sits under the narration as it does in example 02.
The short-term loudness holds at about -14 LUFS through the narration. The score swells briefly on the
end-card button at 48.5 s, then fades out: short-term loudness falls from about -14 to -19 LUFS over
the last 3 s (`review/round-2/loudness.png`).

## Review round

A critic read `review/round-1/` (contact sheet, scene sheet, loudness plot, key frames), re-metered the
audio, transcribed the final mix back word for word, and checked the numbers and the physics. Verdict:
**ship after fixes**, with no blockers, two should-fix items and some polish. Every note was first
confirmed in a snap at its timestamp (`work/round2/before/`), then fixed in one re-render
(`final-3.mp4`, 50.90 s). The log is `work/feedback.md` in the job folder.

| # | Note (time) | Change |
|---|---|---|
| 1 | Should-fix: kicker 27 px, about 5 px tall on a phone (0.8-4.3 s) | Two right-aligned lines, "CÓMO FUNCIONA / UNA BOMBA DE CALOR", 34 px, tracking 0.10 |
| 2 | Should-fix: recap badges up for only 1.1-1.4 s (39.7-41.1 s) | The pull-out and the badges now start on "ciclo", and the badges fade under "Mover", which sits above them. All four are fully on screen for about 1.6 s and in view for about 2 s |
| 3 | Polish: "0 °C" 46 px from the top at the end of the push-in (3.6 s) | Push-in ends at x1.03 instead of x1.05, and "0 °C" is 4 px lower. `check`'s two top-margin notes are gone |
| 4 | Polish: "?" on the wall post, touching the arc (3.3-4.3 s) | Moved 30 px left and 15 px up |
| 5 | Polish: "producirlo." 8 px from the wall seam, descenders on the snow cap (43-50 s) | The italic line is 90 px (was 96) and 6 px higher |
| 6 | Polish: "gas caliente" on the picture frame (30.2 s) | Moved below the frame, onto the empty wall |
| 7 | Polish: molecules crossing "273 grados" (10.5-11.6 s) | Molecules fade in a soft 700x120 box that follows the counter |
| 8 | Polish: frame 0 had no text, so the feed thumbnail was a grey box | "0 °C" and "21 °C" are on screen from frame 0 and come up to full by 0.35-0.65 s ("21 °C" starts at 80 % after round 2, "0 °C" at 60 %) |
| 9 | Polish: script nits (18.5-28.9 s, 43-48 s) | "hierve hasta volverse gas" became "absorbe su calor, hierve y se convierte en gas". The comma before "y su temperatura" is gone. "sale más calor que la electricidad que entra" became "sale más calor del que entra como electricidad". The three lines were re-voiced and read back word-perfect, and every cue and caption was re-timed to the new voice |
| 10 | Polish: "frío" next to "líquido tibio" (38.7-41.1 s) | Now "líquido frío", in on "líquido" so it has time to be read |
| 11 | Polish: README said the score "rises on the end card" | Reworded from the loudness plot (see QA) |

The critic's suggestion for #9 was "hierve y se convierte en gas". Right after "absorbe su calor y",
that gives two "y" in a row, so the line became a three-verb list instead. The film is 0.7 s longer
(50.90 s) because the re-voiced lines run longer. The critic's two notes on the tooling (garbled
accents in the review pack's scene labels) and on the voice (whether Supertonic F1's accent matches
the Latin American *afuera/adentro*) are logged as open, not fixed here.

### Round 2

A second critic read `review/round-2/` on `final-3.mp4`, checked all 11 fixes against their frames,
re-metered the audio (-14.01 LUFS, -1.61 dBTP) and transcribed the mix back again (117 of 117 words
match). Verdict: **ship**, with no blockers, no should-fix items and three polish notes. Each note was
confirmed in a snap first (`work/round3/before/`) and all three were applied in one re-render
(`final-5.mp4`, 50.90 s, 17.3 MB). No third review pack was built: the protocol stops at two rounds,
and these were polish changes, checked in before/after snaps (`work/round3/after/`) and in frames
pulled from the shipped file.

| # | Note (time) | Change |
|---|---|---|
| 1 | Polish: the "sale calor" tag sat on the picture frame's lower-left corner, through the end card and the last frame (45.6-50.87 s) | Moved under the arrow, onto the empty wall (tag centre y 430 -> 628). The arrow is unchanged |
| 2 | Polish: the "VÁLVULA DE EXPANSIÓN" badge's top edge crossed the valve and the pipe dots as it slid down (39.9-40.2 s) | The move starts 0.15 s earlier (39.49-40.09 s, done before the pull-out settles), and the badge dims to about 40 % mid-move, so it no longer slides visibly across the pipe |
| 3 | Polish: at 60 %, "21 °C" was the weaker of the two numbers in the feed thumbnail (0.0 s) | "21 °C" starts at 80 %; "0 °C" stays at 60 % |

The poster is still the frame at 3.6 s, and `captions.srt` and `share.txt` are unchanged (the voice
and the timing did not change).

## Translation

| English (example 02) | Spanish |
|---|---|
| It's freezing outside. So how can that air heat your home? | Afuera está helando. ¿Cómo puede ese aire calentar tu casa? |
| Even freezing air holds heat. Zero Celsius is still far above absolute zero. | Incluso el aire helado guarda calor. Cero grados Celsius está muy por encima del cero absoluto. |
| A heat pump moves that heat indoors, with refrigerant circling a sealed loop. | Una bomba de calor lleva ese calor adentro, con refrigerante que circula en un circuito sellado. |
| Outside, refrigerant colder than the air soaks up its heat and boils into a gas. | Afuera, el refrigerante, más frío que el aire, absorbe su calor, hierve y se convierte en gas. |
| A compressor squeezes the gas, and its temperature shoots up. | Un compresor comprime el gas y su temperatura se dispara. |
| Indoors, the hot gas releases that heat into your home and condenses to a liquid. | Adentro, el gas caliente libera ese calor en tu casa y se condensa en líquido. |
| An expansion valve drops the pressure, the liquid goes cold, and the loop repeats. | Una válvula de expansión baja la presión, el líquido se enfría y el ciclo se repite. |
| Moving heat beats making it. You usually get more heat out than electricity in. | Mover calor rinde más que producirlo. Por lo general, sale más calor del que entra como electricidad. |

- **Unchanged from the English:** the numbers and claims (0 °C / 32 °F, 21 °C / 70 °F, 273 degrees,
  −273 °C) and the hedge "usually" (*por lo general*). No efficiency figure was added.
- **Units:** °C and °F are kept as symbols.
- **Glossary:** nothing had to stay in English. The component names use the standard Spanish HVAC
  terms: *evaporador*, *compresor*, *condensador*, *válvula de expansión*, *refrigerante*.

## Web page (HTML)

[`bomba-de-calor.html`](bomba-de-calor.html) is the Spanish film as a single, shareable web page, exported
from this example's own project with the shipped video's soundtrack:

```bash
showtime export html examples/03-explainer-heat-pump-es/project --lang es \
  --audio-file examples/03-explainer-heat-pump-es/final.mp4 -o examples/03-explainer-heat-pump-es/bomba-de-calor.html
```

- **Why `--audio-file`:** the narration WAVs are not kept, and rebuilding them with the command under
  Licenses does not give the shipped timing: Supertonic re-synthesized every line 30-260 ms longer or
  shorter (word starts up to 0.49 s off by the end), while `cues.js` holds the shipped times. So the page
  embeds exactly the soundtrack of `final.mp4` (the `Synth` score and the narration as rendered, at
  -14 LUFS) instead of rebuilding the score and the mix, and the live score is not played on top of it.
  Nothing in `project/` was changed or copied: the picture, the scenes, the cues and the fonts are the
  project's.
- **What is in it:** the canvas film drawn live by the same runtime as the render, that soundtrack as
  AAC 96k, Inter and Instrument Serif as font bytes (with the accented characters), a player in Spanish
  (`--lang es`: Play, chapters and the key help) with 9 chapters (Gancho ... Cierre), keys and a start
  screen. 1.1 MB in all.
- **Checked headless** (Chrome, network blocked), opened from disk at 1280x720 and at phone width
  (390x844, touch): 0 requests beyond the file itself, no page errors, `<html lang="es">`, and at
  1280x720 playback advanced 2.46 s in 2.5 s after the click. (The first export of this page, made from
  a project copy, was also checked inside a sandboxed frame with a strict Content-Security-Policy; the
  re-export uses the same player.)
- The file carries its own Content-Security-Policy (`default-src 'none'`) and no absolute paths.

## Facts and sources

The physics, the diagram and the claims are unchanged from example 02; see its
[Facts and sources](../02-explainer-heat-pump/README.md#facts-and-sources). In short, the film follows
the textbook vapor-compression cycle in heating mode, as described in U.S. Department of Energy,
Energy Saver, "Heat Pump Systems" and "Air-Source Heat Pumps" (energy.gov/energysaver). The diagram is
a schematic and not to scale, and the end card says so ("esquema, no a escala").

## Licenses

- **Narration:** Supertonic 3 voice F1, Spanish (`supertonic:F1`, `--lang es`). The weights are under
  OpenRAIL-M, which allows commercial use with use-based restrictions (no impersonation, deception or
  harm), and the code is MIT. The voice is synthetic, and `share.txt` says so.
- **Music and sound:** the `Synth` procedural score from example 02, rendered on this machine. It uses
  no samples and no library items, so no credit line is needed (`qa`: no attribution required).
- **Fonts:** Inter and Instrument Serif (SIL OFL 1.1), loaded from the Fontsource packages that
  `showtime setup` installs. Both cover the Spanish characters used here (á é í ó ú ñ ¿).
- **`project/voice/`:** holds `timeline.json`, `vo.words.json` and `vo.srt`. The WAVs are left out;
  `showtime voice script project/narration.es.md -o project/voice --lead-in 0.35 --lang es` rebuilds
  them.
