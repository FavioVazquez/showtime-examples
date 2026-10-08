# 19 · Travel slideshow: Iceland's Ring Road in 45 seconds (8 CC0 photos, beat-synced, with a live map inset)

![poster](poster.jpg)

**Video:** [`final.mp4`](https://github.com/FavioVazquez/showtime-examples/releases/download/examples-media-v1/19-travel-slideshow-iceland--final.mp4) · 1920x1080 · 30 fps · 45.00 s · 18.9 MB · -14.0 LUFS / -1.4 dBTP
(a size-capped copy of the 153 MB CRF-16 master `final-5.mp4`, `deliver exports --targets original --max-mb 20`) ·
**Reels:** [`final-9x16.mp4`](https://github.com/FavioVazquez/showtime-examples/releases/download/examples-media-v1/19-travel-slideshow-iceland--final-9x16.mp4) · 1080x1920 · 45.00 s · 18.9 MB · -14.0 LUFS / -1.4 dBTP, a native
9:16 re-layout rendered from the same page, not a crop ([`poster-9x16.jpg`](poster-9x16.jpg)) ·
**Showcase loop:** [`exports/loop-small.webp`](exports/loop-small.webp) (480x270, 12 fps, 6 s, 0.64 MB) with a
[`exports/loop-small.gif`](exports/loop-small.gif) fallback (336x190, 10 fps, 1.40 MB), the whip run at 19.9-25.9 s.

## The request

> "Make a 45-second travel slideshow of an Iceland ring-road trip from these CC0 photos, cut to the music, with a
> little map showing where each place is. Also a vertical version for Reels."

**Mode:** quick. No questions were asked. The opening line stated the assumptions:

> Quick mode: 45 s at 16:9, plus a native 9:16 re-layout for Reels, 30 fps, no voice-over. Eight CC0 photos from
> Wikimedia Commons, one per stop, starting on a downbeat of "Somewhere Sunny (ver 2)" by Kevin MacLeod (CC BY 4.0;
> the credit ships in the end card, credits.txt and share.txt). A small map inset follows the route. Wind under the
> map, water under the waterfalls.

**Contract:** a loop around Iceland in eight stops, each photo landing on a downbeat, with a map that always says
where we are.

### What the license audit changed in the brief

The researcher's audit came before the build, and the film follows it:

- **The route runs counterclockwise, not clockwise.** Reykjavík → the south coast → Jökulsárlón → Goðafoss (north)
  → Kirkjufell (west) is anticlockwise with north up. The film keeps that order and uses **no direction word**
  on screen or in share.txt; this README names it only to record the correction.
- **Three photos were replaced.** The brief's Reykjavík photo is a black-and-white clock face shot from inside the
  tower. Its Vík photo is a close-up of sand. Its "Jökulsárlón" photo is an ice cave, not the lagoon. The
  replacements are the church exterior (F. Stöhr), the Reynisdrangar sea stacks off Vík (A. Spratt) and icebergs in
  Jökulsárlón (J. Bishop). All are CC0: they were on Unsplash before the 5 June 2017 cutoff, which the researcher
  checked in the Wayback Machine.
- **No claims the sources do not support.** There is no road length, no "every stop is on Route 1" (Þingvellir and
  Kirkjufell are detours), no "back where we started" over Kirkjufell, no "our trip", and no "chorus". The route line
  is schematic: it follows the researcher's via points so that it hugs the coast, and it is never called the road.
- **On-screen facts** come from the audit's allowed list only: "Hallgrímskirkja", "Rift valley on the Mid-Atlantic
  Ridge", "You can walk behind it", "Reynisdrangar", "Glacial lagoon, Vatnajökull National Park", "On the
  Skjálfandafljót river" and "“Church Mountain”, 463 m". Every place name keeps its Icelandic letters (Þ ð á í ó ö).
  The display font (Instrument Serif) has them.

## The story, shot by shot

The bed is 106.6 bpm, so one bar is 2.25 s. Each scene starts on a bar downbeat of the track's own analysis
(`audio beats`, `rhythmic: true`, `pacing: beat_cut`), floored to the frame. That is 0-33 ms before the beat,
within 1 frame of it (list below). Every transition is centred on its cut.

| Time | Scene | On screen | Its job |
|---|---|---|---|
| 0-2.27 s | `title` (1 bar) | Kirkjufell full-bleed, "ICELAND / Ring Road", complete at frame 0 (poster) | Hook: the most iconic view first |
| 2.27-6.8 s | `map-open` (2 bars, light-leak in at half strength) | A 50m Natural Earth map flies from the North Atlantic to Iceland. Iceland lights up, the loop draws in one gesture with the eight markers popping, then the camera pushes into Reykjavík and the map fades to the sea colour. "One loop, eight stops" | Orientation: the whole trip before it starts |
| 6.8-20.4 s | stops 1-3 (2 bars each, 0.3 s crossfades) | Reykjavík, Þingvellir, Seljalandsfoss (in 16:9 the whole portrait photo, centred over a blurred copy of itself). Linear Ken Burns moves (zoom ≤ 1.1, direction varied, one speed). A numbered label (01 / 08 ...). The **inset map** (top right) draws each leg as its photo lands: the current stop is a large amber dot with a cream rim and one ring pulse on arrival, visited stops turn into small cream dots | The journey, and where we are on it |
| 20.4-24.93 s | stops 4-5 (1 bar each), the **whip run** | Skógafoss (WebGL `whip-blur` in), Vík (CSS `whip-pan` in), then `whip-blur` into Jökulsárlón. Every photo drifts left with the whips (the route heads east). A soft synth whoosh on each whip | The one burst of speed, on the south coast, where the stops are closest. It sits on the track's biggest energy surge (24.0 s) |
| 24.93-38.5 s | stops 6-8 (2 bars each; crossfade into Goðafoss, half-strength light-leak into Kirkjufell) | Jökulsárlón, Goðafoss, Kirkjufell | The long way round the east and north, back to the west |
| 38.5-45 s | `end` (blur-dissolve) | The full map with every leg drawn. The closing leg Kirkjufell → Reykjavík draws, "Ring Road" lands on the 40.77 s downbeat, and on the song's final chord (43.07 s) the whole line glows and the "Reykjavík" label lands (its dot is there from the start, so all eight stops show). Credits: the music line, "Photos: CC0 via Wikimedia Commons" with the eight names, "Map data: Natural Earth · the line is a schematic of the stop order, not the road" | Closure (the loop completes) and the required music credit |

**Scene starts vs. downbeats** (the bed's grid from `somewhere-sunny-ver-2.beats.json`; the music under them is the
unedited track from 0 to 38.52 s):

| Cut | Downbeat | Frame | Frame time | Offset |
|---|---|---|---|---|
| map | 2.276 | 68 | 2.267 | -9 ms |
| Reykjavík | 6.827 | 204 | 6.800 | -27 ms |
| Þingvellir | 11.331 | 339 | 11.300 | -31 ms |
| Seljalandsfoss | 15.882 | 476 | 15.867 | -15 ms |
| Skógafoss | 20.410 | 612 | 20.400 | -10 ms |
| Vík | 22.686 | 680 | 22.667 | -19 ms |
| Jökulsárlón | 24.938 | 748 | 24.933 | -5 ms |
| Goðafoss | 29.466 | 883 | 29.433 | -33 ms |
| Kirkjufell | 33.994 | 1019 | 33.967 | -27 ms |
| end (and the splice) | 38.522 | 1155 | 38.500 | -22 ms |
| final chord | 43.073 | (glow starts 43.03) | | -43 ms |

**Map marker vs. photo:** each marker is at the place's Wikipedia coordinates (research sheet, section 2). Where a
photo has camera GPS, it agrees to within about 2 km. The inset lights stop N exactly while photo N is on screen.

### The 9:16 cut

The same `index.html` renders both. `project/tools/make_vertical.py` writes `project-916/` (same page, media and
mix; `showtime.json` at 1080x1920). The page switches layout in `@container (max-aspect-ratio: 5/6)`:
- The map inset becomes a card in the top band, inside the Reels-safe box (x 64-956, y 220-1440).
- The labels sit in the centre band, and the type follows the 2.2 % rule for tall frames (43 px and up).
- Each photo is re-framed with `data-pos-tall` (for example Vík at 31 %, so the big stack fills the frame).
- The three map cameras compute their zoom from the element size, so Iceland fills the same share in both aspects.
- The end card drops the photographer names in 9:16 (they are in share.txt and credits.txt) so that it stays above
  the platform UI.

## Commands, in order

`showtime` is `skills/showtime/bin/showtime`. `<job>` is `showtime-out/iceland-ring-road-20260927-162623` and `<p>` is
`<job>/project`. The photo originals and the render work folders are not shipped. The project has web-size copies
(2160 px tall).

```bash
showtime doctor --quick                                         # 21 pass, 0 fail
showtime job init iceland-ring-road --mode quick --platform youtube --goal "Make a 45-second travel slideshow ..." \
  --assumed "45 s 16:9 master + native 9:16 re-layout (reels); 30 fps; no voice" \
  --assumed "8 CC0 Commons photos per the license audit (3 of the brief's replaced); order counterclockwise; no direction word" \
  --assumed "music: library 'Somewhere Sunny (ver 2)' Kevin MacLeod CC BY 4.0; scene starts on downbeats; CC0 wind/water"

# photos: license-gated fetch with .license.json sidecars
showtime assets media fetch commons:61668982 -o photos/       # Reykjavík; also 34705109 (Þingvellir), 61799729 (Skógafoss)
#   the other five hit HTTP 429 on upload.wikimedia.org originals (see Iterations 1): their 3840 px (Seljalandsfoss:
#   1920 px) Commons thumbnails were put into showtime's media cache, then
showtime assets media fetch commons:121381245 -o photos/      # ... 47696382, 62221230, 86572139, 61894908: sidecars written
showtime assets sheet photos -o <job>/work/sheet.jpg          # 8 items, none low-res; order + focus points read from it
#   resized to 2160 px tall into <p>/media/01-reykjavik.jpg ... 08-kirkjufell.jpg (sidecars copied, "derived" noted)

# music
showtime audio lib info incompetech-somewhere-sunny-ver-2     # 114.73 s, 106 bpm, key C, CC-BY-4.0 + the exact credit
showtime audio beats audio/sunny.opus                         # 106.62 bpm, confidence 1.0, rhythmic, beat_cut; surge 24.0 s
showtime audio fit audio/sunny.opus --dur 45 -o audio/bed45.wav             # rejected: ends on bar 19, a G chord
showtime audio fit audio/sunny.opus --dur 45 --from 2.28 -o audio/bed45b.wav # rejected: ends on an F chord
#   -> <p>/audio/mix.json: bed-a = the track 0-38.522 s; bed-b = the song's own ending (Dm-G-C) spliced in at that
#      downbeat (track 104.165 s), both by library id so the CC-BY credit is automatic; wind + water ambience; 3 whooshes
showtime audio mix <p>/audio/mix.json -o <job>/work/mix.wav  # -14.0 LUFS, -1.1 dBTP; whoosh gains raised twice (masked)
showtime audio beats <job>/work/mix2.wav                     # the grid runs on unbroken through the splice (38.52 / 40.77 / 43.07)

# project and first look
showtime new dom <p> --title "Ring Road" --duration 45 --look template   # page then rewritten (index.html)
showtime check <p>                                           # 4 rounds, see Iterations; final: PASS, 1 WARN (explained below)
showtime snap <p> --at 0,1.9,2.4,3.0,... --sheet             # 5 targeted sheets across both aspects
python <p>/tools/make_vertical.py                            # -> <job>/project-916 (1080x1920)
showtime check <job>/project-916                             # PASS, 1 WARN (the same)
showtime job note <job> --stage plan ... ; showtime job note <job> --stage first-look ...

# final, verify, review
showtime render <p> --job <job>                              # final.mp4 (6m28s); final-2, final-3 after the fixes; final-4 after review round 2 (4m54s); final-5 after round 3 (5m14s)
showtime qa <job>                                            # final-3: PASS, 0 fail, 0 warn, 0 note; final-4 and final-5: PASS, 1 note (end-card hold)
showtime review-pack <job>                                   # read as a self-review (no sub-agent tool in this session)
showtime render <job>/project-916 -o vertical/ring-road-9x16-2.mp4   # round 2 (the first was ring-road-9x16.mp4)
showtime qa vertical/ring-road-9x16.mp4 --project <job>/project-916 --platform reels   # PASS, 1 note (end-card hold)

# deliver
showtime deliver exports <job> --targets original --max-mb 20             # final-5.20mb.mp4 -> final.mp4 (18.9 MB)
showtime deliver exports vertical/ring-road-9x16-2.mp4 --targets reels --max-mb 20   # -> final-9x16.mp4 (18.9 MB)
showtime deliver exports <job> --targets webp-small,gif-small --from 19.9 --to 25.9  # loops (0.64 MB / 1.40 MB)
showtime qa <job>/exports/final-5.20mb.mp4 --project <p> --platform youtube          # PASS (1 note)
showtime qa vertical/exports/ring-road-9x16-2.reels-20mb.mp4 --project <job>/project-916 --platform reels   # PASS (1 note)
showtime assets credits <p> --all -o credits-all.txt        # photo lines for credits.txt
```

To re-render: `showtime render project` (16:9), or `python project/tools/make_vertical.py` and then
`showtime render project-916`. The music comes from the showtime library (core tier) by id, so it is not in the folder.

## Features shown

`assets media fetch` (Commons, CC0 gate, sidecars) · `assets sheet` · `assets credits` · **ken-burns** (linear,
from/to per shot, `object-position` + `data-pos-tall` per aspect) · **world-map** (Mercator, `src` =
`countries-50m.json`, camera fly and push, `highlight`, `markers`, multi-segment `routes` along via points; three
instances: full-frame open, inset, end) · page code on `ST.onSeek` (visited markers, the final-chord glow) · library
music by id with **automatic CC-BY credit** (mix report → `credits.txt`) · **`audio beats`** · **`audio fit`**
(run; its trims were rejected, see Iterations 2) · a mix-level splice to the song's own ending · library **CC0
ambience** (wind, water) · synth whooshes · beat-synced scene starts · WebGL **`light-leak`** (`a` = strength 0.5) · `crossfade` · WebGL
**`whip-blur`** · CSS **`whip-pan`** · `blur-dissolve` · **native 9:16 re-layout** (`@container`) · `check` ·
`snap` · `render --job` · `qa --platform reels` · `review-pack` · **`deliver exports`** (`youtube`, `reels`,
`original --max-mb`, **`webp-small` + `gif-small` loops**) · researcher license audit and the critic (self-review).

## QA

- 16:9 `final-5.mp4` (the master, after review round 3): **PASS** (0 fail, 0 warn, 1 note). -14.1 LUFS, -1.1 dBTP.
  `credits: final-5.credits.txt lists all 1 required attribution(s)`. The note: the end card is a still hold of
  about 3.8 s (from 41.23 s). It is the credit card, and it needs the time. Shipped copy `final.mp4` (20 MB cap):
  **PASS**, -14.0 LUFS, -1.4 dBTP, the same note.
- 9:16 `ring-road-9x16-2.mp4`, `--platform reels`: **PASS** (0 fail, 0 warn, 0 note). -14.1 LUFS, -1.1 dBTP.
  Shipped copy (20 MB cap): **PASS**, -14.0 LUFS, -1.4 dBTP, 1 note (the same end-card hold).
- `check` on both aspects: PASS with one WARN each. "Reykjavík" is reported as 17 px. It is the map's SVG label, and
  the component scales it by 2x (on screen it is about 34 px in 16:9), but check reads the CSS font size without the
  SVG transform (logged as friction).

## Iterations that mattered

1. **Commons rate limit.** Three originals downloaded, then `upload.wikimedia.org` returned HTTP 429 for every
   other original (retries over ~10 min did not help). Wikimedia's message asks for standard thumbnail sizes. The
   five files were fetched as 3840 px thumbnails (Seljalandsfoss as 1920 px, since 2560 is not a standard step),
   placed in the media cache, and `assets media fetch` then wrote their sidecars. Each sidecar notes the rendition.
2. **The ending.** `audio fit --dur 45` trims after a downbeat with a short decay. From the top that is bar 19, a
   G chord (the dominant). With `--from 2.28` it is an F chord. Neither resolves. The track's real ending is
   Dm-G-C with the final chord at 108.72 s, so the mix plays the track to the bar-17 downbeat (38.522 s) and splices
   the ending in at its Dm downbeat (104.165 s) with a 50 ms crossfade. The beat grid of the mix runs on unbroken
   through the splice. The picture then used it: the end scene starts on the splice, the title lands on the G, and
   the line glows on the C.
3. **Credits went missing (qa caught it).** The first mix used a copy of the track file (`"file"`), so neither the
   mix nor qa knew it was CC-BY, and qa said "no attribution required". Switching the two bed tracks to `"lib":
   "incompetech-somewhere-sunny-ver-2"` gave identical audio (max sample difference 0.0) plus the auto credit. The
   rebuilt review pack flagged the round-1 file with `missing_credits`, and final-2 onward ship `credits.txt`.
4. **Overlays vanished inside every transition window (review-pack `cuts.jpg`).** The text and the inset map are
   overlay clips after the scenes, so shader transitions never smear them. But inside a window the transition
   engine gives the scenes `z-index` 1-3 and the WebGL canvas 4, so overlays without a z-index were painted
   underneath. The inset blinked out for 0.45-0.8 s at every cut. `.ov { z-index: 10 }` fixed it (final-2).
   `check` and `qa` do not see this.
5. **check's text audit could not see the overlays.** With `pointer-events: none` on the overlay layers, check
   measured contrast for only 1 text element (its hit test goes through them). With it removed, check found real
   contrast FAILs: the amber stop numbers were 1.7:1 on bright sky. They now sit on a small dark pill, and a bottom
   gradient plus a soft local scrim sit under the labels. The scrim fades in with the words (final-3), because
   round 1's `cuts.jpg` showed it popping on in one frame.
6. **Layout rounds.** In the 16:9 end card, the map moved right and up to clear the credits. The Reykjavík label is
   anchored left of its dot. In the tall layout, "Ring Road" overlapped the credits, and the credit type was under
   43 px. The inset card shrank from the full width to a 50 %-wide card so the church spire and Kirkjufell's peak
   stay visible. The Jökulsárlón label got 0.18 s more (check: its 61 characters need about 3.9 s).

## Review (critic, self-review)

This worker session has no sub-agent tool, so the critic brief (`review-pack` → `CRITIC.md`) was answered by the
same session. It is labelled as a self-review, and a human second look is asked for before calling it shipped.
- **Hook:** at 1.5 s, a full-bleed Kirkjufell and "Ring Road" say "Iceland travel" at once. Frame 0 is the poster.
- **Clarity and story logic:** title (hook) → map (the whole loop) → eight stops, each with a name, a number and
  the inset lit at its place → the loop closes on the map → credits. Each shot has one job. The whip run is the only
  speed change, placed where the stops are closest together.
- **Readability:** the 2-bar stops hold their label about 3.9 s. The 1-bar stops show a name (plus "Reynisdrangar" at Vík) for about 1.8 s, and check's hold test passes. Contrast passes check. Tall
  type is 43 px and up, inside the Reels-safe box.
- **Craft:** round 1 used one primary transition (light-leak), one accent family (whips, three in a row), a dissolve outro.
  Round 2 (below) cut the leak to two half-strength uses and made the others short crossfades.
  Round-1 findings fixed: the overlays hidden in windows (Iteration 4) and the scrim pop (Iteration 5).
  In 9:16 the inset card covers the upper-left corner of each photo (by design: the top band); round 2 re-framed
  Vík so the card no longer hides the stack.
- **Honesty:** no direction word, distance, drive time or "our trip". The line is schematic and never labelled
  as the road. Every caption is on the audit's allowed list. Route order checked against the coordinates:
  counterclockwise and complete (8 stops, closed back to Reykjavík).
- **Remaining WARN:** check's 17 px reading of the SVG map label (see QA).

## Review round 2 (critic)

A second critic pass read review packs of the shipped files (both aspects). Verdict: **ship after fixes**, no
blockers; facts, licenses and credits clean. Every should-fix and the cheap polish items were applied in one
re-render (`final-4.mp4`, `ring-road-9x16-2.mp4`), and each fix was checked with `snap --compare` at the cited time
against the round-1 files:

| Finding | Fix |
|---|---|
| Seljalandsfoss (15.9-20.4 s, 16:9) was a tight crop of the water column, so "You can walk behind it" showed nothing of the sort; also the softest shot | 16:9 shows the whole portrait photo, centred (810x1080), over a blurred, darkened copy of itself (`media/03-seljalandsfoss-bg.jpg`, same CC0 photo, its sidecar says so); zoom 1.00-1.04, so it is a downscale, not an upscale. The falls, their base and a visitor for scale are in frame. 9:16 keeps its crop, which already showed them |
| The inset hid the Vík sea stacks (22.7-24.9 s) | 16:9: the card moves to bottom-right for the Vík shot only (it jumps on the whip cuts). 9:16: the photo is re-framed (`data-pos-tall` 31 % → 9 %), so the main stack sits right of the card |
| The inset's current-stop dot was ~9 px, unreadable at feed size | Current stop ~24 px on a 1920 frame (~21 px of 1080 in 9:16), amber with a cream rim, one 0.4 s ring pulse to ~56 px on arrival (the repeating pulse is gone); visited stops 9 px cream; route 6 px |
| Cream light-leak on all five soft cuts (brightness jumped 35 → 186; up to 74 % of 9:16 pixels over 200) | Leak kept on two cuts (title → map, Goðafoss → Kirkjufell) at half strength (new `a` strength option of the `light-leak` shader); 0.3 s crossfades on the other four |
| Map double-exposed over Hallgrímskirkja at 6.8 s | The map fades to the sea colour (6.42-6.70 s) before the church comes in |
| The inset box faded in empty (7.0-7.1 s) | Iceland is lit from the inset's first frame and the map follows the card's fade |
| Skógafoss had no sub-line, so its name sat ~90 px lower | Its label keeps an empty sub-line slot (padding), so the name shares the baseline; no sub-line was invented |
| A light 6-10 px band at the frame edges during the end dissolve (38.5-38.9 s) | Cause: the incoming end scene starts at 97 % size, so the bright sky of the outgoing photo showed at the edges (overscanning the outgoing photo alone did not remove it). The end scene now carries a sea-coloured spread shadow; edge columns match the interior |
| "EIGHT STOPS" over 7 markers (39.0-43.07 s) | Reykjavík's dot is drawn from the start; only its label and the line glow come in on the final chord |
| The route line read as the Ring Road itself | The end card says so: "Map data: Natural Earth · the line is a schematic of the stop order, not the road". In 9:16 the end-card block and map moved up so the extra line stays inside the Reels safe box (`check`: no safe-zone warning) |

`check` after the fixes: PASS on both aspects with the same single WARN as before (the SVG map label size).
This critic round was run by a separate critic pass on the shipped files; a human second look is still welcome.

## Review round 3 (critic)

A third pass checked the round-2 fixes on both shipped files. All of them held except one regression, and the Vík move
itself caused it. In 16:9 the card sat under the Vík label's bottom scrim (`.label::before`, 62 % of the frame height
at 0.5-0.72 opacity). Both are `.ov` overlays at `z-index: 10`, and the labels come later in the page, so for about
1.8 s of the 2.27 s shot the card's land went from about 110/130/134 to 58/72/76 and the amber dot turned brown. Fix:
`.ov.inset { z-index: 11; }`. After the re-render (`final-5.mp4`), the land at (1640, 800) is 108/128/133 at 23.2, 23.892
and 24.3 s. `snap --compare` against `final-4.mp4` shows no other change at 9.175, 22.8 or 24.8 s. In 9:16 the card
(top band) never meets the label scrim. The 9:16 project with the fix snapped against the shipped
`ring-road-9x16-2.mp4` at 13.709 and 23.892 s differs inside the card only by encode noise (mean 1-2/255, the same as the whole frame), so the 9:16
was not re-rendered. `check` after the fix: PASS with the same single WARN.

## Sources and licenses

| What | Source | License |
|---|---|---|
| 8 photos | Wikimedia Commons (file pages linked in [`credits.txt`](credits.txt); authors F. Stöhr, Ypsilon from Finland, N. Hussain, J. Dela Cruz, A. Spratt, J. Bishop, T. Dellsen, I. Krutainis) | CC0 1.0 (Unsplash-origin files: CC0 as published on Unsplash before 5 June 2017, checked in the Wayback Machine) |
| Music | "Somewhere Sunny (ver 2)" Kevin MacLeod (incompetech.com), showtime library `incompetech-somewhere-sunny-ver-2` | CC BY 4.0: the credit is in the end card, `credits.txt` and `share.txt` |
| Water loop | "loop water 02", rubberduck, OpenGameArt | CC0 |
| Wind | showtime generated ambience | CC0 (made locally) |
| Whooshes | synthesised by `showtime audio sfx` | made locally |
| Map | Natural Earth 4.1.0 via world-atlas 2.0.2 (`countries-50m.json`) | public domain (package ISC) |
| Stop coordinates, via points and captions | English Wikipedia articles (secondary), checked by the researcher on 2026-09-27 | facts only |
| Fonts | Instrument Serif, IBM Plex Sans (Fontsource, installed by setup) | SIL OFL 1.1 |

Not shipped: the photo originals, the render work folders, the 153 MB master and the review packs (local only).
