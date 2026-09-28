# 18 · Book trailer: The War of the Worlds (H. G. Wells, 1898)

![poster](poster.jpg)

**Trailer (16:9):** [`final.mp4`](https://github.com/FavioVazquez/showtime-examples/releases/download/examples-media-v1/18-book-trailer-war-of-the-worlds--final.mp4) · 1920x1080 · 30 fps · 30.00 s · 17.3 MB · -14.0 LUFS / -1.4 dBTP · captions burned (+ [`captions.srt`](captions.srt) for YouTube)
**Teaser (9:16):** [`final-teaser-9x16.mp4`](https://github.com/FavioVazquez/showtime-examples/releases/download/examples-media-v1/18-book-trailer-war-of-the-worlds--final-teaser-9x16.mp4) · 1080x1920 · 30 fps · 15.00 s · 11.4 MB · -14.0 LUFS / -1.5 dBTP · captions burned · poster [`poster-teaser-9x16.jpg`](poster-teaser-9x16.jpg)

Both are size-capped copies (`deliver exports --targets original --max-mb`) of the full-quality masters
(236 MB and 87 MB: the film look's animated grain does not compress). Neither page was exported as HTML: the
brief did not ask for one.

## The request

> "Make a 30-second cinematic book trailer for The War of the Worlds using public-domain illustrations and lines from the novel, plus a vertical 15-second teaser."

**Mode:** quick. The opening line stated the assumptions and made the studio offer once; it was not taken, so the
session stayed in quick mode:

> Quick mode: a 30 s 16:9 trailer and a 15 s 9:16 teaser, canvas film on Henrique Alvim Corrêa's 1906 drawings and a
> NASA Mars mosaic, two verbatim lines read by bm_george, an epic-trailer score in C minor. (Want to see concepts
> first? Say "studio".)

**Contract:** Mars was watching; they came; nothing we built could stop them: the novel's own words over its 1906
illustrations, ending on the title and "read it free".

## The story (trailer)

Every cut is on a downbeat of the composed score (`project/audio/score.beats.json`), every line is from Project
Gutenberg eBook #36, and every time lives in one cue table (`project/cues.js`) that the picture, the burn and
the mix all read.

| Time | Scene | On screen | Its job |
|---|---|---|---|
| 0-8.57 s | `watch` | NASA/JPL/USGS Mars mosaic: the limb against black, then a slow pan down to Valles Marineris. VO: "No one would have believed in the last years of the nineteenth century that this world was being watched keenly and closely ..." | The premise: we are being watched. Frame 0 is already the picture |
| 8.17-8.97 s | WebGL `ridged-burn` | The photograph of Mars burns through to Corrêa's drawn Mars ... | The falling star, and the switch from the real planet to the book's |
| 8.57-15.71 s | `arrive` | ... firing its cylinder into the night (graphic 02). VO ends "... by intelligences greater than man’s"; then typed on: "Then came the night of the first falling star." | Escalation: they are coming |
| 15.71-20.0 s | `lid`, `man`, `eye` | Graphic 05 in three crops on the build's beats: the lid in shadow (the Martian only a shape), a man recoiling, the Martian's eye, pushing in | The threat withheld, then the watcher up close |
| 20.0-22.86 s | `head`, `wide` | Drop (braam + impact): the fighting machine's head fills the frame, then a step back and a pull-out to the drawing's full width: the machine towering over the hill, the heat ray across the sky (graphic 15, full frame) | The reveal, and its scale |
| 22.86-25.51 s | `cost` | The capsized steamer and the crowd in the water under the machine. VO (20.37-25.21 s): "It was the beginning of the rout of civilisation, of the massacre of mankind." | The human cost, in the book's voice |
| 25.51-30.0 s | `title` | The film's one dip, then on the score's final hit (25.714 s, whole on frame 772): THE WAR OF THE WORLDS · H. G. WELLS · 1898 · "Read it free at Project Gutenberg (eBook #36)" (from 25.97 s, 4 s on screen) · "Illustrations: H. Alvim Corrêa, 1906 · Mars: NASA/JPL/USGS" | Reveal and a call to action that is true and free |

**The teaser** re-lays beats 1 → 3 → 5 for portrait (not a crop): Mars in a 9:16 window with the shorter line
"... that this world was being watched" (6.4 s, captioned without a full stop, because the sentence goes on), the
Martian's eye from 5.7 s under "was being watched", the drop at 8.6 s to the machine's head and then the whole
machine, and the title on its own end hit (11.474 s, whole on frame 345), set in three lines inside the vertical safe box.

**The burn inside a canvas film.** showtime's shader transitions blend two layers, and a canvas film has one
canvas. `project/burn.js` registers the `ridged-burn` from the transitions module with the film canvas as the
incoming layer and a second canvas as the outgoing one: on each seek inside the 0.8 s window the film draws once
more with a flag set (scenes.js then draws the Mars shot at that same time), the pixels are copied to the second
canvas, and the film draws its normal frame. Both are pure functions of T, so `check` still reports the film as
deterministic, and the burn works the same in `preview`, `snap` and `render`.

**What was changed from the brief, and why** (from the researcher's notes):
- No "1898" date line in the arrival beat: in the novel the invasion comes "early in the twentieth century". The
  beat types the verbatim "Then came the night of the first falling star." instead; 1898 appears only as the
  book's year on the title card.
- Beat 4 uses "It was the beginning of the rout of civilisation, of the massacre of mankind." The "Ulla, ulla" cry is
  the Martians', not a human one.
- The full opening line takes 10.7 s, so it runs across beats 1 and 2 (the burn lands on "intelligences").
- The quotes follow the Gutenberg text, which differs from the 1898 first printing ("this world" vs "human
  affairs", commas); nothing on screen calls them the 1898 text.

## Commands, in order

`showtime` is `skills/showtime/bin/showtime`; `<t>` is `showtime-out/wotw-trailer-20260927-153239`, `<v>` is
`showtime-out/wotw-teaser-20260927-153239`, `<p>` = `<t>/project`, `<q>` = `<v>/project`.

```bash
showtime doctor --quick                                            # 21 pass, 0 fail
showtime job init wotw-trailer --mode quick --platform youtube --goal "..." --assumed "..."   # (4 assumptions)
showtime job init wotw-teaser --mode quick --platform shorts --goal "..." --assumed "..."
showtime new film <p> --title "The War of the Worlds" --duration 30

# pictures and fonts (sidecars in assets/media/*.license.json; sha1 of graphic 02 and PIA00003 match Commons/NASA)
showtime assets media search "Alvim Correa War of the Worlds" --source commons
showtime assets media search "Valles Marineris hemisphere" --source nasa
showtime assets media fetch commons:81894077 --project <p>         # graphic 02, 2767x3000
showtime assets media fetch commons:81894106 --project <p>         # graphic 05 (a 1920 px rendition)
showtime assets media fetch commons:81894182 --project <p>         # graphic 15 (a 1920 px rendition)
showtime assets media fetch nasa:PIA00003 --quality orig --project <p>
python <p>/tools/grade.py                                         # one duotone for the three drawings; Mars keeps NASA's colour
showtime assets font Cinzel --weights 400,700,900 --copy-to <p>/fonts
showtime assets font "Special Elite" --weights 400 --copy-to <p>/fonts

# music first: the cuts sit on its downbeats
showtime audio compose --style epic-trailer --key Cm --dur 30 --sections 0:intro,10:build,20:drop,27:outro -o <p>/audio/score.wav
#   end_hit 27.142; then again with --no-sfx (effects placed by hand, below). Round 3 re-composed it (see below)
showtime audio sfx braam --key C --intensity 1.0 --seed 1 -o <p>/audio/sfx/braam-drop.wav   # (+ braam-open, riser --dur 4,
showtime audio sfx keyclick --variants 4 -o <p>/audio/sfx/key.wav                            #  reverse-hit, impact, boom x2)

# voice: two verbatim lines, the second pinned to the drop ({at=20.45})
showtime voice script <p>/narration.md -o <p>/voice                # watch 0.45-11.19, cost 20.45-26.72 (bm_george; round 3: 20.35-25.80)
showtime transcribe <p>/voice/vo.wav --no-events -o <t>/work/vo-check.json   # round trip: every word as written

# picture, first looks
showtime snap <p> --at 0,4,8.2,8.45,8.571,...,29.9 --sheet --cols 5      # 4 rounds of stills
showtime check <p>                                                 # 2 WARN (typewriter line off-frame, 1.5 s hold) -> fixed -> PASS
python <p>/tools/make_mix.py && showtime audio mix <p>/audio/mix.json -o <p>/audio/mix.wav   # 4 rounds (keys masked, braam vs impact, LRA 9.3 -> 6.4)
showtime preview <t>/project --no-open                            # scrubbed in the browser pane: the burn plays in the player
showtime preview <t>/project --stop
showtime render <t>/project --job <t> --preview                   # 720p draft, 45 s
python <p>/tools/quote_srt.py                                      # caption cues at the book's phrase breaks, from the word times
showtime captions <p>/voice/quotes.srt --style cinematic --burn <t>/preview.mp4 -o <t>/work/preview-cap.mp4
#   the cinematic style blurred the letters themselves: fixed in showtime (see Tool issues), then re-checked at 1080p:
showtime render <t>/project --from 0 --to 5 -o <t>/work/seg0.mp4
showtime captions <p>/voice/quotes.srt --style cinematic --burn <t>/work/seg0.mp4 -o <t>/work/seg0-cap2.mp4
python skills/showtime/tests/run_all.py --fast -k footage          # PASS (23 tests)

# teaser: the same scenes.js, its own cues, score, voice and mix
showtime new film <q> --title "The War of the Worlds (teaser)" --aspect 9:16 --duration 15 --job <v>
showtime audio compose --style epic-trailer --key Cm --dur 15 --sections 0:intro,5.7:build,8.6:drop --no-sfx -o <q>/audio/score.wav   # end_hit 11.474
showtime voice script <q>/narration.md -o <q>/voice                # 0.33-6.78 s
showtime check <q>                                                 # 3 WARN (title and credit past x 916) -> fixed -> PASS

# finals, verify, review (three render rounds each; the last round's files ship)
showtime render <t>/project --job <t>                              # final-7.mp4, 240 MB master
showtime captions <p>/voice/quotes.srt --style cinematic --burn <t>/final-7.mp4 -o <t>/final-8.mp4 --srt <t>/final-8.srt
showtime qa <t>/final-8.mp4 --project <p> --platform youtube       # PASS
showtime snap <t>/final-8.mp4 --at 27.133,27.167                   # title whole on frame 815, first frame after end_hit
showtime review-pack <t>/final-2.mp4 --project <p>                 # round 1 (self-review, review/trailer-round-1.md)
showtime review-pack <t>/final-8.mp4 --project <p>                 # round 2 (review/trailer-round-2.md)
showtime render <v>/project --job <v>                              # final-9.mp4, 87 MB
showtime captions <q>/voice/quotes.srt --style cinematic --burn <v>/final-9.mp4 -o <v>/final-10.mp4
showtime qa <v>/final-10.mp4 --project <q> --platform shorts       # PASS
showtime review-pack <v>/final-10.mp4 --project <q>                # review/teaser-round-1.md

# deliver
showtime assets credits <p> --all -o <t>/work/media-credits.txt    # sidecar credit lines -> credits.txt
showtime deliver exports <t>/final-8.mp4 --targets youtube          # 62.3 MB, not committed
showtime deliver exports <t>/final-8.mp4 --targets original --max-mb 18    # this folder's final.mp4 (17.3 MB)
showtime deliver exports <v>/final-10.mp4 --targets shorts          # 23.7 MB, not committed
showtime deliver exports <v>/final-10.mp4 --targets original --max-mb 12   # final-teaser-9x16.mp4 (11.5 MB)
showtime qa <t>/exports/final-8.18mb.mp4 --project <p> --platform youtube  # PASS (and the teaser copy: PASS)

# round 3 (outside critic): the fixes, then the same checks
showtime audio compose --style epic-trailer --key Cm --dur 29.2 --sections 0:intro,10:build,20:drop --no-sfx -o <p>/audio/score.wav
#   end_hit 25.714 (the hit lands ~3 s before the score's end); the mix fades the ring and the wind carries 29.2-30 s
showtime voice script <p>/narration.md -o <p>/voice                # cost {at=20.35 speed=1.2}: 20.37-25.21 s
showtime transcribe <p>/voice/vo.wav --no-events -o <t>/work/vo-check-r3.json   # every word as written
python <p>/tools/quote_srt.py && python <p>/tools/make_mix.py && showtime audio mix <p>/audio/mix.json -o <p>/audio/mix.wav
showtime snap <p> --at 8.471,21.45,22.1,22.8,25.733 --sheet       # burn, the new wide shot, the title frame
showtime check <p>                                                 # PASS
showtime render <t>/project --job <t>                              # final-9.mp4
showtime captions <p>/voice/quotes.srt --style cinematic --text-scale 1.2 --burn <t>/final-9.mp4 -o <t>/final-10.mp4 --srt <t>/final-10.srt
showtime qa <t>/final-10.mp4 --project <p> --platform youtube      # PASS
showtime snap <t>/final-10.mp4 --at 8.471,16.4,21.9,22.757,1.5,28.571 --compare <t>/final-8.mp4   # before|after
showtime render <v>/project --job <v>                              # final-11.mp4 (picture bit-identical; new audio ending)
showtime captions <q>/voice/quotes.srt --style cinematic --burn <v>/final-11.mp4 -o <v>/final-12.mp4
showtime qa <v>/final-12.mp4 --project <q> --platform shorts       # PASS
showtime deliver exports <t>/final-10.mp4 --targets original --max-mb 18   # final.mp4 (17.3 MB)
showtime deliver exports <v>/final-12.mp4 --targets original --max-mb 12   # final-teaser-9x16.mp4 (11.4 MB)
showtime deliver exports <t>/final-10.mp4 --targets youtube; showtime deliver exports <v>/final-12.mp4 --targets shorts
showtime qa <t>/exports/final-10.18mb.mp4 --project <p> --platform youtube # PASS (teaser copy: PASS)
```

**Rebuilding from this folder.** The pictures, fonts, music, effects and voice are not committed (about 31 MB, all
reproducible). `python project/tools/restore.py <path to showtime>` (and the same in `project-teaser/`) re-runs the
fetch, grade, font, compose, sfx and voice commands above; tested on the teaser: the score came back
byte-identical and `check` passed. Then `showtime render project`.

## Features shown

| Feature | Where |
|---|---|
| `new film` (canvas Film, typographic trailer), `--aspect 9:16` for the teaser | `project/`, `project-teaser/` (one `scenes.js`, `CUE.cut` picks the cut) |
| Film drawing of stills: source-window framing that never stretches, pushes, pull-outs and pans, a portrait drawing shown whole in the 9:16 teaser, `film` look with animated grain, dust and weave | `scenes.js` `shot()`, `move()`, `whole()` |
| WebGL `ridged-burn` inside a canvas film (the transitions module, film canvas as a layer) + one `dip` | `project/burn.js`; `title` scene |
| `F.typewriter` (Special Elite) with one keyclick per character in the mix | `arrive` scene; `tools/make_mix.py` |
| `audio compose --style epic-trailer --key Cm --sections ... --no-sfx`, cuts on `downbeats`, title on `end_hit` | `audio/score.beats.json`, `cues.js` |
| SFX synth: braam, riser, impact, boom, reverse-hit, keyclick `--variants 4`; library CC0 ambience | `audio/sfx/*.sfx.json`, `audio/mix.json` |
| `audio mix`: `align: hit`, ducking under the voice, the keys and the braam, `carve`, `section_gain` | `audio/mix.json` (written from `cues.js`) |
| `voice script` with `bm_george`, `style: trailer`, a line pinned with `at`; `transcribe` round trip | `narration.md`, `voice/` |
| `captions --style cinematic --text-scale 1.2` burned (the quotes only), cues from word times at phrase breaks, SRT sidecar | `voice/quotes.srt`, `captions.srt` |
| `assets media search/fetch` (Commons PD + NASA) with sidecars; `assets font`; `assets credits --all` | `assets/media/*.license.json`, `fonts/`, `credits.txt` |
| `preview` (scrubbed in the browser, the burn plays), `snap`, `check`, `render --preview`, `render --from/--to`, `qa`, `review-pack` (2 rounds) + an outside critic round | above |
| `deliver exports --targets youtube,shorts` and `original --max-mb` | above |
| crew roles: scriptwriter, sound-designer, researcher (license audit), critic | `crew/`, `review/` (see below) |

**About the crew.** This session had no sub-agent tool, so the director did the scriptwriter and sound-designer
passes from their briefs and wrote them up in `crew/`, and answered the critic's CRITIC.md as self-reviews
(`review/`). The researcher's verified facts (quotes checked against the Gutenberg text and three 1898 printings,
licences checked on Commons, NASA and JPL) were prepared before the session and are the only source of claims.
A person should still listen to both cuts and take a second look.

## QA

| | Trailer (`final.mp4`) | Teaser (`final-teaser-9x16.mp4`) |
|---|---|---|
| verdict | PASS (0 fail, 0 warn, 0 note) | PASS (0 fail, 0 warn, 0 note) |
| loudness | -14.0 LUFS, -1.4 dBTP (master: -14.1 / -1.4) | -14.0 LUFS, -1.5 dBTP (master: -14.0 / -1.6) |
| frame 0 | picture (Mars limb), no poster flash | picture (Mars limb) |
| black / frozen | none (the one dip reaches black only at its midpoint) | none |
| captions | 6 cues, shortest 1.60 s | 3 cues, shortest 1.64 s |
| title on end_hit | frame 772 (25.733 s) for end_hit 25.714 s | frame 345 (11.500 s) for end_hit 11.474 s |
| call to action | 4.0 s on screen (25.97-30 s) | 3.1 s (11.9-15 s) |
| mix | voice 11.0 dB over the bed, LRA 7.1 LU, limiter 2.0 dB; ring fades out 1.2 s, wind to the end | voice 12.8 dB over the bed, LRA 3.5 LU; ring fades out 0.8 s |

## Review (two self-reviews, then an outside critic)

**Trailer, round 1** (on the first captioned final): ship after fixes. Fixed in round 2: the capsized-steamer shot
came back dimly for six frames in the dip's second half (the title card had no opaque ground); the title faded in
over two frames instead of landing whole on the hit; the faint machine behind the title showed its vertical
edges. The call to action now enters 0.14 s earlier (2.58 s on screen): with the title on end_hit in a 30 s cut it
cannot hold longer, and the last frame is the card (round 3 showed it could). **Round 2:** ship. **Teaser, round 1:** ship.

**Review round 3 (outside critic, on the shipped files):** trailer "ship after fixes", teaser "ship". It caught
what both self-reviews had passed: the `wide` shot at 21.43-22.87 s was pillarboxed (58 % of the frame near-black
on the drop). It also showed the 2.58 s call to action was not a limit of the brief, only of where the composer
put the final hit. Fixed: a full-frame pull-out on graphic 15; the score re-composed 29.2 s long so the hit and
title land at 25.714 s and the call to action holds 4.0 s (the second quote starts 0.1 s earlier and is read a
little faster). Polish also fixed: the burn's square-cell grid, captions 20 % larger, a 32 px credit line, the lid
shot lifted, and an ending that decays. Details and measurements: [`review/trailer-round-3.md`](review/trailer-round-3.md).
The teaser's picture did not change. Only its audio ending did. Nobody has listened yet: a person should.

## Sources and licences

| Material | Source | Licence |
|---|---|---|
| Novel text (quotes) | H. G. Wells, *The War of the Worlds* (1898), Project Gutenberg eBook #36, https://www.gutenberg.org/ebooks/36 | Public domain in the US; Gutenberg allows quotes without permission |
| Illustrations 02, 05, 15 | Henrique Alvim Corrêa (1876-1910), drawings for the 1906 Brussels edition *La guerre des mondes* (L. Vandamme), scans on Wikimedia Commons | Public domain (`PD-old-auto-expired`) |
| Mars | NASA/JPL/USGS, PIA00003 "Valles Marineris Hemisphere", Viking Orbiter 1 mosaic, enhanced colour | NASA media, public domain in the US; no endorsement implied |
| Voice | Kokoro-82M, voice bm_george (local) | Apache-2.0 |
| Music, effects | generated with showtime | original output |
| Ambience | "Space Winds" by aquinn (OpenGameArt), showtime library | CC0 |
| Fonts | Cinzel, Instrument Serif, Inter (OFL-1.1); Special Elite (Apache-2.0) | as listed |

Not claimed anywhere: a new edition, film or release date; that the quotes are the 1898 text; worldwide public
domain; that the drawings illustrated the English edition; that the Mars image is true colour.

## Tool issues found (logged for the maintainers)

- `captions --style cinematic` (and `minimal`) blurred the glyphs themselves: with no border, libass applies
  `\blur` to the fill. Fixed in `lib/st/footage/captions.py` (a thin dark border takes the blur; letters stay
  sharp in a soft halo); footage tests pass.
- `captions --burn` inside a job does not make the burned file the job's latest final, so `qa <job>` and
  `review-pack <job>` pick the uncaptioned render; both were run on the burned file by path.
- `review-pack` reads `CUE` keys only at the start of a line, so acts named by `CUE.arrive`/`CUE.title` that
  shared a line with other keys were dropped (round 1 showed 3 of 5 acts); one key per line fixed it.
- The `ridged-burn` pre-heat glow showed small square blocks (the shader's value-noise grid). Fixed in round 3
  (`runtime/transitions/shaders.js`: the ridge noise is turned, lightly warped and turned per octave).
- `audio compose --sections ...,27:outro` silently drops a marker that falls inside the final hit's ring-out, and
  there is no way to ask for the hit's time: it lands on the grid about the style's tail (3 s for epic-trailer)
  before `--dur`. Round 3 worked around it by composing 29.2 s and letting the mix carry the last 0.8 s.
- `captions` had no text-size control: added `--text-scale K` in round 3 (footage tests pass, with a new test).
- `snap <project> --at t` showed the frame before t when t rounded to six decimals fell just under a frame
  boundary (25.733 s showed frame 771, the render has the title on 772). Fixed in `scripts/snap.mjs` (it seeks
  k / fps exactly); new test `test_08d_snap_project_lands_on_the_frame`.
