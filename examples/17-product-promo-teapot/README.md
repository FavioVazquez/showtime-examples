# 17 · Product promo, 1:1: Christopher Dresser's teapot (ca. 1879), from The Met's CC0 photos (20 s + 6 s bumper, no voice)

![poster](poster.jpg)

**Video:** [`final.mp4`](https://github.com/FavioVazquez/showtime-examples/releases/download/examples-media-v1/17-product-promo-teapot--final.mp4) (final-6) · 1080x1080 · 30 fps · 20.00 s · 15.0 MB · -14.1 LUFS / -1.3 dBTP ·
**Bumper:** [`bumper.mp4`](bumper.mp4) · 1080x1080 · 6.00 s · 2.6 MB · -14.1 LUFS / -1.5 dBTP ·
**Exports:** [`exports/final.square.mp4`](exports/final.square.mp4) (4.7 MB), [`exports/final.x.mp4`](exports/final.x.mp4)
(1920x1080, 5.0 MB), [`exports/final.linkedin.mp4`](exports/final.linkedin.mp4) (1920x1080, 5.0 MB) ·
**Web page:** [`dresser-teapot.html`](dresser-teapot.html) (one file, 6.7 MB, plays offline, no network requests)

## The request

> "Make a 20-second square product promo from these museum photos of Christopher Dresser's teapot — sleek, but
> only facts from the museum record. Plus a 6-second bumper."

**Mode:** quick. The video will be published, so a researcher checked the facts and licenses before the build, and a
critic reviewed the final. No questions were asked. The opening line stated the assumptions:

> Quick mode: 20 s square master at 30 fps, plus a 6 s bumper cut down from it; no voice-over. On-screen words
> come only from The Met's record for object 823191. A `lounge-jazz` bed with its final hit on the end card, a
> `thock` on each spec row and a `shimmer` on the turn. Theme `bold`, with its ember accent swapped for silver.
> No Met logo. The end card points to the record, since the teapot is not for sale.

**Contract:** a promo-style film for a museum design object: Dresser's silverplate-and-ebony teapot, dated ca. 1879,
shown in two views and a detail of its stamped marks. It uses only the facts The Met records (date, materials,
size, weight, designer, manufactory) and ends on where to see the record.

### What the research changed in the brief

The researcher's fact sheet corrected the brief before any scene was built, and the film follows the fact sheet:

- **Two views, not "three angles".** The third photo (DP-18258-046) shows the stamped marks on the underside, not a
  view of the teapot. It became the opening image of the maker scene, captioned "Marks on the underside".
- **"Ebony", not "Ebony handle".** The record's medium is "Silverplate, ebony". The word "handle" is not in the record.
- **Hook "ca. 1879.", not "Designed ca. 1879."** The record gives the object's date. It does not give a design date.
- **The record names a manufactory,** James Dixon & Sons. The film names it but gives no founding year, because the
  record gives two different ones.
- **`bold` is ember orange, not silver.** `--accent` is overridden to `#d4d2cf` (13:1 on the ground).

## The story, shot by shot

Each scene starts on a downbeat of the composed bed (108 bpm, one bar = 2.222 s), rounded to the nearest frame, and
each transition is centred on that downbeat (`align center`), so the visible change lands on the beat.

| Time | Scene | On screen | Its job |
|---|---|---|---|
| 0-2.23 s | `hook` | Frame 0 is complete: "TEAPOT" / **"ca. 1879."** above the side-view cut-out, which slides into a warm spotlight pool on a near-black ground | The surprise is the date next to the object. The date is a fact. The picture makes the "it looks modern" point, and no words claim it |
| 2.23-6.67 s | `turn` (sdf-iris, centred on the cut) | The three-quarter view (spout right) on a slow push. A sheen sweeps across the silver, peaking with the `shimmer`. At 3.2 s an original **Lottie** steam curl draws on above the spout | The object from the second side. The steam says "teapot" and makes no claim |
| 6.67-11.1 s | `specs` (slide, centred) | A small side view, then "FROM THE MUSEUM RECORD" and a **feature-grid** spec sheet: Silverplate · Ebony (each labelled "Material", with swatches cut from the photo itself) · 12.7 × 22.9 × 13.3 cm, H × W × D · 500 g, 1.1 lb. A spotlight walks the rows every 1.5 beats, with a `thock` on each, and dims the others to 72 % | The facts, each verbatim from the record |
| 11.1-15.57 s | `maker` (slide, centred) | **Ken-burns** push over the underside (pill: "Marks on the underside") into the stamped facsimile signature and the J D & S marks. Then kinetic type slides in: DESIGNER / **Christopher Dresser** / British, 1834–1904 / Manufactory: James Dixon & Sons, Sheffield | Who made it, introduced by the marks on the object itself |
| 15.57-20 s | `end` (iris, centred) | **End card:** a small three-quarter view, "Teapot, ca. 1879", "The Metropolitan Museum of Art", a "See the record" pill, `metmuseum.org/art/collection/search/823191`, then "Images: The Met, CC0 · Object 2021.153.2 / Museum object; not affiliated with or endorsed by The Met." A second sheen lands on the bed's final hit (17.78 s), with a slow push to the end | Where to see it, plus the credit. There is no sales call to action |

**Bumper (6 s):** the hook (0-1.5 s), the turn with its steam and shimmer (1.5-3.5 s), and a shorter end card
(3.5-6 s: title, museum, credit, no-endorsement line). The bed is re-composed at 120 bpm so both cuts fall on beats,
and both transitions are centred on them. The record URL is left out of the bumper: it could only be read for about
1.2 s there. The master's end card and `share.txt` carry it.

## Commands, in order

`showtime` is `skills/showtime/bin/showtime`. `<job>` is `showtime-out/dresser-teapot-20260927-152814` and `<p>` is
`<job>/project`. The Met's originals (4000 px, fetched by the researcher from `images.metmuseum.org`) are
not shipped. The project has web-size copies.

```bash
showtime doctor --quick
showtime job init dresser-teapot --mode quick --goal "Make a 20-second square product promo ..." \
  --assumed "20 s master, 1:1 1080x1080, 30 fps; 6 s bumper cut down with retime -d 6" \
  --assumed "no voice-over: on-screen text from The Met record 823191 only; ..." \
  --assumed "two full views (025 side, 026 three-quarter) + underside marks detail (046)" \
  --assumed "theme bold with silver accent override; no Met logo; end card = record + CC0 credit + no-endorsement line"
showtime new dom <p> --title "Teapot, ca. 1879" --aspect 1:1 --duration 20   # native 1:1 layout; page then rewritten

# the object off its museum backdrop (macOS Vision here; rembg on Windows/Linux)
showtime assets cutout <p>/img/DP-18258-025.jpg --crop --pad 24   # "subject covers 17% of the image (vision, 3.2s)"
showtime assets cutout <p>/img/DP-18258-026.jpg --crop --pad 24   # 22 %, 2.1 s
#   edges checked at 100 % on the spout, handle end and feet; then resized to 1800/1600 px (teapot-025/026.png),
#   046 to 2400 px (marks-046.jpg), and two 256 px material swatches cut from 025 (silver body, ebony grip)
python3 <p>/tools/make_steam_lottie.py      # writes lottie/steam-curl.json (4 KB, hand-authored shape layers + trim paths)

# the bed: scene cuts must be downbeats
showtime audio compose --style lounge-jazz --dur 20 --sections "0:intro,3:verse,7:chorus,12:bridge,16.5:outro" --seed 1   # rejected, see Iterations
showtime audio compose --style lounge-jazz --bpm 108 --dur 20 \
  --sections "0:intro,2.2222:verse,6.6667:chorus,11.1111:bridge,15.5556:outro" --seed 1   # clean 1-2 bar sections, end_hit 17.78 s
#   -> the same spec in <p>/audio/mix.json, + shimmer (align peak) + 4 thocks (align hit)
showtime audio mix <p>/audio/mix.json -o <p>/work/mix.wav   # round 1: shimmer masked (-5.8 dB) -> duck + gain; intro +3 dB

# first look
showtime check <p>            # round 1: 1 contrast FAIL, 2 bottom-zone WARNs -> fixed; then PASS, 0 warnings
showtime snap <p> --every 1   # plus targeted --at sheets: 4 rounds (see Iterations)

# final, verify, review
showtime job note <job> --stage plan ... ; showtime job note <job> --stage first-look ...
showtime render <p> --job <job>          # final.mp4 (24 s for 600 frames); re-renders final-2 ... final-6
showtime qa <job>                        # final-6: PASS, 0 fail, 0 warn, 0 notes
showtime review-pack <job>               # round 1 (final-3) and round 2 (final-5), answered as self-review
showtime snap <job>/final-4.mp4 --at 13.33,14.2 --compare <job>/final-3.mp4

# the 6 s bumper: a copy of the project, three scenes, retimed
cp -R <p> <job>/bumper   # then: drop specs + maker, starts 0 / 2 / 4.6666666 (durations 2, 2.667, 3.333 = 8 s), bed at 120 bpm
showtime retime <job>/bumper -d 6        # hook 0-1.5, turn 1.5-3.5, end 3.5-6 (x0.75); data-at values scaled too
showtime check <job>/bumper              # PASS
showtime render <job>/bumper -o bumper-render/bumper.mp4
showtime qa bumper-render/bumper.mp4 --project <job>/bumper   # PASS

# post-ship polish (final-5 -> final-6, bumper), after the round-2 critic's "ship"
showtime check <p>                       # after centring the transitions: 1 contrast FAIL, 1 short-text WARN -> fixed; PASS
showtime render <p> --job <job>          # final-6.mp4 (30 s)
showtime render <job>/bumper -o bumper-render-r3/bumper.mp4
showtime snap <job>/final-6.mp4 --at 2.233,6.667,11.1,15.567,13.7,8.88,10.0 --compare <job>/final-5.mp4
showtime review-pack bumper-render-r3/bumper.mp4 --project <job>/bumper -o bumper-review   # the bumper's own pack

# deliver
showtime deliver exports <job> --targets square,x,linkedin
showtime qa <job>/exports/final-6.x.mp4 --platform x           # PASS (also linkedin, square: PASS)
showtime export html <p> --target artifact --subtitle "Christopher Dresser · The Met, object 823191" -o html/dresser-teapot.html
showtime clean <job> -y                  # freed 105.6 MB (bumper: 1.8 MB)
```

To render the bumper from this folder, copy `project/img/` and `project/lottie/` into `bumper/` first. They are
not duplicated in the repo.

## Iterations that mattered

1. **The bed's grid set the cut list.** At the style's own 112 bpm, with cuts at 3/7/12/16.5 s, the composer
   raised the tempo to 120 and inserted 2-beat bars to land the markers. At 108 bpm a bar is 2.222 s, so the scenes
   were set to whole bars instead: hook 1 bar, then 2 bars each for turn, specs, maker and end. The hook is
   shorter than the brief's 3 s (2.23 s), which fits the story rule that the first cut should come by about 2 s.
2. **End card (check round 1).** The end teapot rendered at its natural 1600 px behind the title, and check reported
   a contrast FAIL (1.21:1 at 16.23 s). It is now sized to 38cqw. "1.1 lb." and the credit line sat in the bottom
   8 % of the frame (the player UI zone), so the rows and the credit moved up.
3. **Sheen.** The first version was a 24 %-wide band at 0.55 alpha that washed out the whole teapot at 3.2 s. It is
   now a 12 % band at 0.42.
4. **One-frame flash at two cuts (final-2 → final-3).** The review pack's `cuts.jpg` showed the bare incoming
   scene (only its label, the grid not yet in) for exactly one frame at 6.667 s and 15.567 s, and then the outgoing
   scene again. Cause: clips snap `data-start` to a frame when it is within 1 ms, but CSS transition windows test
   `t >= start - 1 µs`. So `6.6667` made the clip active at frame 200 while the slide had not started yet. The
   scene starts are now written just below the frame time (`6.6666666`) (see the project's head comment). Neither
   `check` nor `qa` flagged this.
5. **End card motion.** qa noted a 2.6 s final still hold. The end teapot now drifts slowly (scale 1 → 1.06), and
   its sheen peaks on the bed's final hit at 17.78 s.
6. **Maker pill (critic polish, final-3 → final-5).** "Marks on the underside" covered the top of the registration
   diamond as the push rose. The push now ends 9 % to the right, and the pill leaves at 13.65-14.0 s, before the
   diamond reaches it. In the post-ship polish (item 7) the fade moved to 13.5-13.85 s.
7. **Post-ship polish (final-5 → final-6, bumper).** A second critic pass found the visible transitions
   starting 0.11-0.23 s after the downbeats their scenes start on (the iris ring first showed at 2.40 s for a
   2.233 s cut). All four transitions are now centred on their cut (`data-transition="slide left 0.6 center"`), so
   each is mid-way on the beat; the scene starts, SFX and bed did not move. Centring moved `check`'s sample times,
   and it then caught two things the old samples had missed: the dimmed "Ebony" row's label was 3.74:1 at 10.0 s
   (the rows now dim to 72 %, not 55 %), and the manufactory line lost 0.3 s of readable time to the earlier iris
   (it now fades in at 12.9 s, not 13.2 s). The row labels read "Material", not "Medium", which a stranger could read
   as a size. The bumper drops the record URL (see above).

## Review

No sub-agent tool was available in this session, so the maker answered the critic brief itself. Round 1
([`review/round-1-FINDINGS.md`](review/round-1-FINDINGS.md), on final-3) gave "ship after fixes": no blockers, no
should-fixes, and one polish item (the pill overlap), which is fixed. Round 2 ([`review/round-2-FINDINGS.md`](review/round-2-FINDINGS.md), on
final-5) checked the fix and gave "ship". Every on-screen word was checked against the researcher's allowed-wording list.
After "ship", a second critic pass on final-5 (with the bumper seen through ffmpeg frames) found no blockers, one
should-fix (the bumper's URL was readable for only ~1.2 s) and four polish notes: transitions lagging the downbeats,
the pill's last opaque frames ~9 px from the diamond, "Medium" readable as a size, and a one-frame iris artefact in the
bumper. The first three and the should-fix are done (iteration 7). The iris artefact is normal iris geometry and is
left as is. Each fix was checked with before/after snaps at the cited times. The bumper then got its own review pack,
answered as a self-review ("ship"). That pass also noted that review-pack's `cuts.jpg` samples around `data-start`
(-2f..+4f) and so can miss transitions that start later; with the transitions now centred, the bumper's `cuts.jpg`
shows them mid-way.
A human look and a listen are still welcome, because this session can meter audio but cannot hear it.

## Features shown

**`assets cutout`** (macOS Vision, two cut-outs; rembg is the fallback on other OSes) · **Lottie** (`ST.lottie` seeking an
original JSON: three stroked shape layers with trim paths, generated by `tools/make_steam_lottie.py`; frames at
4.2 s and 4.8 s are pixel-identical whatever the seek order) · **feature-grid** (1 column, image and Lucide icons,
`focus` walk) · **ken-burns** (the underside push) · **kinetic-type** (`slide`) · **end-card** (`mask`, tagline, CTA, URL) ·
theme **`bold`** with a silver `--accent` · transitions **`sdf-iris`** (WebGL), **`slide`** ×2, **`iris`**, all `align center` ·
`--aspect 1:1` native layout · `audio compose` **`lounge-jazz`** (sections on the cuts, `section_gain`, `end_hit`
used for the end-card sheen) · `audio sfx` **`thock`** ×4 and **`shimmer`** (`align: peak`, the bed ducked under it) ·
**`retime -d 6`** cut-down · `expect.must_show` ("ca. 1879", "500 g") · `check`, `snap` (project, video, `--compare`) ·
`render --job`, `qa` (+ `--platform x|linkedin|square`) · `review-pack` ×2 · **`deliver exports --targets
square,x,linkedin`** · **`export html --target artifact`** · `clean` · researcher (claims and licenses), critic (self-review).

## QA summary

- `final.mp4` (final-6): **PASS** (0 fail, 0 warn, 0 notes). h264 High yuv420p, 1080x1080 30 fps, faststart, BT.709,
  20.00 s, -14.1 LUFS, -1.3 dBTP. No silent gaps, no black or frozen stretches, and frame 0 flows into frame 1. No
  attribution is required. must_show "ca. 1879" is on screen 0.00-1.87 s and "500 g" at 7.37-11.23 s (the centred transitions start earlier).
- `bumper.mp4`: **PASS** (0 fail, 0 warn), 6.00 s, -14.1 LUFS, -1.5 dBTP, must_show "ca. 1879" at 0.00-1.20 s.
- Exports: square (1080x1080, 4.7 MB), x and linkedin (1920x1080, the square picture pillarboxed on a blurred copy,
  5.0 MB each). All three **PASS** against their platform. Both X and LinkedIn also accept the square master as it is.
- `check`: PASS, 0 errors, 0 warnings (master and bumper). The bumper has one info note: sub-pixel anti-aliasing at
  0.9, 3.9 and 5.4 s, 0.00 % of pixels.
- Mix: shimmer +4.2 dB above the bed, thocks +6.2 to +11.7 dB, and the bed's final hit at 17.78 s.
- HTML: 6.7 MB of the 16 MB limit, embedded AAC 96k at -14.1 LUFS, 5 chapters (one per scene), and no network requests.

## Sources and licenses

| What | Source | License / use |
|---|---|---|
| Every fact on screen (title, date, medium, dimensions H × W × D, weight, designer and bio, manufactory, accession, credit line) | The Met Collection API, object 823191: https://collectionapi.metmuseum.org/public/collection/v1/objects/823191 · object page https://www.metmuseum.org/art/collection/search/823191 (both checked 2026-09-27) | facts; `isPublicDomain: true` |
| Photos DP-18258-025 (side view), -026 (three-quarter view), -046 (underside marks) | https://images.metmuseum.org/CRDImages/es/original/DP-18258-025.jpg (and -026, -046) | Met Open Access, **CC0** (page badge "Public Domain"; https://www.metmuseum.org/policies/image-resources). Cut-outs, crops and swatches are ours |
| The Met's name and URL | cited as text, as the museum's Terms and Conditions ask | nominative use only: **no Met logo**, and the no-endorsement line is on the end card and in the share copy |
| Steam-curl Lottie | written for this example (`project/tools/make_steam_lottie.py`) | original work, repo license |
| lottie-web 5.13 (player), Lucide icons (ruler, weight) | installed by `showtime setup` (npm) | MIT, ISC |
| Music (`lounge-jazz`), SFX (`thock`, `shimmer`) | `showtime audio compose` / `audio sfx` (generated locally; GeneralUser GS instruments) | generated, CC0; GeneralUser GS license allows any use in music |
| Fonts | Bricolage Grotesque, Inter, JetBrains Mono (Fontsource) | SIL OFL 1.1 |

Not claimed anywhere: "iconic", "modern", "ahead of its time" or any other adjective as fact; a design year; a
decoded registration date; a founding year for the manufactory; "on view" (true on 2026-09-27, but it can
change); price or availability. The courtesy credit is in [`credits.txt`](credits.txt). Post copy is in
[`share.txt`](share.txt).
