# 12 · Energy report: where US electricity came from, 1950-2025 (60 s, narrated)

![poster](poster.jpg)

**Video:** [`final.mp4`](https://github.com/FavioVazquez/showtime-examples/releases/download/examples-media-v1/12-energy-report--final.mp4) · 1920x1080 · 30 fps · 60.10 s · 19.2 MB · -14.0 LUFS / -1.3 dBTP ·
**Web page:** [`us-power-mix.html`](us-power-mix.html) (1.7 MB, one file, plays offline, 7 chapters)

## The request

> "Make a one-minute narrated video from the EIA's electricity generation data showing how the US power
> mix changed: coal, gas, wind and solar."

**Mode:** quick, publish-bound (so a researcher pass before the final and a critic pass on it). No
questions asked. The opening line stated the assumptions:

> Quick mode: 60 s, 16:9, narrated (am_michael), `news-bumper` bed ducked under the voice, `bold` look.
> Data: EIA Monthly Energy Review (August 2026), Table 7.2a, annual, all sectors, frozen on 2026-09-27.
> Takeaway: coal made about half of US power for decades; gas passed it in 2016; in 2024 wind + solar
> passed it for the first time (672 vs 652 TWh), and again in 2025 (760 vs 737).

**Contract:** coal made about half of US electricity for decades; since its 2007 peak, gas took the lead in
2016, and in 2024 wind and solar together passed coal for the first time, all in EIA's own annual numbers.

## The story, and where each number comes from

Every figure is computed from `data/eia-mer-T07.02A-2026-09-27.csv` (EIA's CSV as downloaded, unchanged) by
`data/derive.py`, and re-derived by `crew/research/verify_claims.py` (25 claims, all verified, in
`crew/research/claims.verified.json`). Values are million kWh ÷ 1,000 = TWh, annual rows (`YYYY13`).

| Time | Scene | On screen | Its job |
|---|---|---|---|
| 0-8.2 s | `hook` | Headline first (frame 0), then two cards rise in and count up to **672 TWh** (wind + solar) and **652 TWh** (coal), "2024", then "First time in EIA's annual record" | The surprising crossing, with its numbers, before any context |
| 8.2-14.9 s | `coal-era` | Coal alone, 1950-2007, drawn by a year cursor to "Peak: **2,016 TWh** in **2007** / **48.5 %** of US power" | The old normal, so the change means something |
| 14.9-22.3 s | `gas` | A hard cut on the same chart (only the headline changes), then the x axis stretches from 2007 to 2025 with the axes kept on screen; gas sweeps in and crosses coal: "**2016**: gas 1,379 · coal 1,239 TWh" | First turn: gas, not renewables, replaced coal first |
| 22.3-33.0 s | `newcomers` | Zoom to 1995-2025, gas dims, wind + solar climbs: "2007: under 1 % (35 TWh)", then "2024: wind + solar pass coal, 672 vs 652", ending on **760** vs **737** (2025) | The payoff the hook promised, now in context |
| 33.0-41.2 s | `race` | Six sources ranked 2005-2025 at 0.25 s a year (each year moves in 0.16 s, then holds), wind and solar shown separately, a big year readout that flips as the bars start moving to that year; focus on gas/coal, then wind/hydro | The re-ordering as a ranking: who is on top changes |
| 41.2-53.4 s | `mix-2025` | 2025 shares: gas **40.8 %**, nuclear **17.7 %**, wind + solar **17.2 %**, coal **16.6 %**, hydro 5.6 %, other 2.1 %; "about a sixth each" bracket; a dashed line at coal's 2024 share (15.1 %) and "Coal: +13 % in 2025" | Where it stands now, and that coal is not gone (it rose in 2025) |
| 53.4-60.1 s | `source` | 2007 / 2016 / 2024 milestones, "Source: U.S. Energy Information Administration, Monthly Energy Review (**August 2026**), **Table 7.2a**. Accessed September 27, 2026.", and the caveats | Credit and trust (EIA asks for an acknowledgment with the publication date) |

Definition checks the researcher settled before the build (research notes, not shipped):
- Table 7.2a "Solar" is **utility-scale only**. With small-scale solar (Table 10.6) added, 2023 is still below
  coal and 2024 above it, so "first time in 2024" holds either way; the numbers are labelled utility-scale.
- **Before 1989 the table covers electric utilities only** (except hydro), so the coal-era note says so and
  the narration says "about half" (coal's share ran 44.0-56.9 % in 1949-2008), never an exact long-run share.
- The narration says **wind and solar**, never "renewables" (this table's renewables include hydro and wood).
- In the race, wind and solar are separate, so neither bar passes coal; the subtitle says "wind and solar
  shown separately". Its bars carry no value labels: at 0.25 s a year every paused frame would show
  interpolated figures that are not in the table.

## Commands, in order

`showtime` is `skills/showtime/bin/showtime`; `<job>` is `showtime-out/us-power-mix-20260927-114128`,
`<p>` is `<job>/project`.

```bash
showtime doctor --quick
showtime job init us-power-mix --mode quick --platform youtube --goal "Make a one-minute narrated video ..." \
  --assumed "Data: EIA MER (August 2026) Table 7.2a, frozen snapshot 2026-09-27; annual 1949-2025; solar utility-scale" \
  --assumed "Takeaway: ... gas passed coal in 2016; wind + solar passed coal in 2024 (672 vs 652)" \
  --assumed "60 s, 16:9, am_michael, news-bumper bed ducked under speech, bold theme"
showtime data inspect data/eia-mer-T07.02A-2026-09-27.csv      # long table: MSN, YYYYMM, Value
python3 data/derive.py                                          # -> annual TWh (wide), race table, 2025 shares
showtime data inspect data/us-generation-annual-twh.csv
showtime new data <p> --title "Wind and solar passed coal in 2024" --duration 60

# voice first: the narration sets the scene lengths
showtime voice script <p>/narration.md -o <p>/voice --fit 58   # 66.6 s natural: "cut about 23 words" -> cut
showtime voice script <p>/narration.md -o <p>/voice --fit 58   # 58.00 s at x1.0 (pauses -0.39 s)
showtime retime <p> --from-voice <p>/voice/timeline.json       # 7 scenes, 60.10 s; 7 voice tracks placed, bed ducks

# charts from the tables (the numbers never live in HTML)
showtime data import data/us-generation-annual-twh.csv <p> --chart line --x year --y coal,natural_gas,wind_solar \
  --decimals 0 --suffix " TWh" -o <p>/data/lines-1949-2025.json
showtime data import data/us-generation-race-2005-2025.csv <p> --chart race --x year --top 6 --step 0.25 \
  --decimals 0 --suffix " TWh" --highlight "Natural gas" --scene race -o <p>/data/race-2005-2025.json \
  --title "Six sources, ranked by generation" --subtitle "TWh per year · wind and solar shown separately"
showtime data import data/us-mix-2025-shares.csv <p> --chart hbar --x source --y share_pct --top 6 --decimals 1 \
  --suffix " %" --highlight Coal --annotate "Coal: +13 % in 2025" --ref "15.1:Coal in 2024: 15.1 %" \
  --scene mix-2025 -o <p>/data/mix-2025.json --title "US electricity by source, 2025" --subtitle "Share of 4,430 TWh"
#   (race state titles "... · 2005" replaced by a "year" field: a title per 0.25 s state flickers; see Tool issues found)
for i in flame atom wind sun droplet pickaxe ellipsis; do showtime assets icon lucide $i --stroke 2 -o <p>/icons/$i.svg; done
showtime assets icon lucide wind --color "#3ddc97" -o <p>/icons/wind-g.svg     # (and sun-g, pickaxe-c for the hook cards)

# first look, fix, look again (6 rounds of stills while building)
showtime snap <p> --at 0,1,3,7.6,9.5,12.5,...,59.5 --width 960 --format jpg --sheet
showtime check <p>        # custom components not mounted (registered after auto-mount) -> mounted from a module script
showtime check <p>        # 17 contrast errors (half-faded ticks, dimmed row names, the year pill over the ticks) -> fixed
showtime check <p>        # PASS, 5 warnings (read: decade labels leaving the frame during the scene-4 zoom)
showtime render <p> --job <job> --preview                       # 720p draft, 1 m 05 s
showtime snap <job>/preview.mp4 --at 14.7,15.0,15.3,...         # the morph-warp and the two soft cuts
showtime audio meter <job>/preview.mp4                          # -14.0 LUFS, LRA 2.5
python3 crew/research/verify_claims.py data/us-generation-annual-twh.csv crew/research/claims.verified.json   # 25/25

# final, verify, review, fix
showtime render <p> --job <job>          # final.mp4
showtime qa <job>                        # FAIL: must_show "Table 7.2a", "August 2026" not found (check keeps 80 chars
                                         #   of a text) -> the source line split in two; black 0.7 s at the last cut
showtime render <p> --job <job>          # final-2.mp4
showtime qa <job>                        # WARN: black 0.4 s after the last crossfade
showtime review-pack <job>               # round 1 -> self-review (below)
showtime render <p> --from 53.3 --to 53.7 --workers 1 -o <job>/work/cut-test.mp4   # reproduces an empty frame at 53.433
showtime render <p> --from 53.3 --to 54.3 --workers 1 -o <job>/work/cut-test2.mp4  # fixed
showtime render <p> --job <job>          # final-3.mp4 -> qa WARN (black 0.4 s)
showtime check <p>; showtime render <p> --job <job>              # final-4.mp4
showtime qa <job>                        # PASS (0 fail, 0 warn, 0 note)
showtime review-pack <job>               # round 2 -> self-review of the fixes

# deliver
showtime deliver exports <job> --targets youtube,x,linkedin,github
showtime deliver exports <job> --targets original --max-mb 20   # this folder's final.mp4
showtime qa <job>/exports/final-4.20mb.mp4 --project <p> --platform youtube   # PASS
showtime deliver poster <job>/final-4.mp4 --at 7.6 --out <job>/poster-final4.jpg
showtime export html <p> --target artifact --subtitle "Where US electricity came from, 1950-2025 · U.S. EIA data" -o <job>/us-power-mix.html
showtime clean <job> -y                  # freed 303.9 MB (frames, scratch, audio intermediates)

# round 3: an independent critic pass on the published file (see Review), fixes, one full-res render
showtime snap <p> --at 0,7.6,14.5,...,54.3 --width 960 --format jpg --sheet    # each finding, before changing anything
showtime snap <p> --at 33.1,33.3,...,39.1 --width 640 --sheet --cols 6          # the race, every 0.2 s: readout vs bar order
showtime check <p>                       # PASS, 11 warnings (axis year labels during the two x-axis moves, read)
showtime render <p> --job <job>          # final-5 .. final-8: qa WARN each (a 2.5 s still in scene 3 or 4 after
                                         #   re-balancing the camera push; 0.27-0.43 s of near-black at the last crossfade)
showtime render <p> --from 53.0 --to 55.0 --workers 1 -o <job>/work/cut-test3.mp4   # tune the end card's entry
showtime render <p> --job <job>          # final-9.mp4
showtime qa <job>                        # PASS (0 fail, 0 warn, 0 note)
showtime snap <job>/final-9.mp4 --at 0,7.6,15.13,15.37,30.1,30.6,33.5,...,53.97 --compare <job>/final-4.mp4
showtime job discard <job> final-5.mp4   # (and final-6, final-7, final-8)
showtime deliver exports <job>/final-9.mp4 --targets original --max-mb 20      # this folder's final.mp4
showtime qa <job>/exports/final-9.20mb.mp4 --project <p> --platform youtube   # PASS (0 warn)
showtime deliver exports <job>/final-9.mp4 --targets youtube,x,linkedin,github
showtime deliver poster <job>/final-9.mp4 --at 7.6 --out <job>/poster-final9.jpg
showtime export html <p> --target artifact ...                                # re-exported
```

Exports made from `final-9` (not all committed): youtube 16.7 MB, x 12.6 MB, linkedin 12.6 MB, github 9.5 MB (10 MB cap),
original under 20 MB 19.2 MB (this `final.mp4`); all 1920x1080, -14.1 LUFS, -1.2 to -1.3 dBTP.

## Features shown

| Feature | Where |
|---|---|
| `new data`, `data inspect`, `data import` line with `--y a,b`, `--chart race --step --top`, `--chart hbar --top --ref --annotate --highlight` | charts of scenes 2-6 read the imported JSON |
| chart `states` (21 race states, one per year) | `race` |
| count-up | `hook` (672 / 652) |
| custom components with `define()` next to stock ones | `project/power.js`: `mix-lines` (scenes 2-4, with an animated x domain), `row-kit` (colour, icon and focus per hbar row, bracket; `race` mode moves the race rows year by year), `year-tick`, `appear` |
| `assets icon lucide` (flame, atom, wind, sun, droplet, pickaxe, ellipsis) | hook cards, race and mix rows |
| theme `bold` | whole video, with one colour per source on top |
| CSS `crossfade` (and `dip`); a hard cut on matching frames | mix-2025 -> source (race -> mix); coal-era -> gas |
| `voice script --fit`, Kokoro `am_michael` | 7 lines, 58.00 s |
| `retime --from-voice` | scene lengths and voice tracks |
| `audio compose` `news-bumper` with `--sections` on the 7 scene starts; `audio mix` ducking (20 dB under the voice); SFX synth | `project/audio/mix.json` |
| `expect.must_show` (15 figures and phrases) | `project/showtime.json`, all found by qa |
| `check`, `snap`, `render --preview`, `render --from/--to`, `qa`, `review-pack` | above |
| crew roles: storyboard-artist, two motion-designers (scenes 2-4, scenes 5-6), researcher, critic | `crew/` and `review/`: see the note below |
| `deliver exports --targets youtube,x,linkedin,github`, `--max-mb 20`, `deliver poster` | above |
| `export html --target artifact` | `us-power-mix.html` |
| `clean` | 303.9 MB freed |

**About the crew.** This session had no sub-agent tool, so the director did each crew task from its brief
(`references/crew/*.md`) and wrote the same files a crew member would: the storyboard
(`crew/storyboard/storyboard.md`), the two motion-designer tasks (`crew/motion-*/TASK.md`, built into
`power.js`), the researcher's check (`crew/research/`) and the critic's findings (`review/`). The critic rounds
are therefore labelled self-reviews; a second look by a person is the remaining step.

## Review

**Round 1** (on `final-2.mp4`, self-review): ship after fixes.

| # | Finding (time) | Change |
|---|---|---|
| 1 | Blocker: the rendered frame at 53.433 s (the crossfade into the source card) was empty, only the ground; the project snapped at the same time was fine | The source scene started 0.7 ms after a frame boundary (53.434 vs frame 1603). `mix-2025` now lasts 12.2613 s, so the cut is exactly on frame 1603; the empty frame is gone (confirmed with a 1 s `--from/--to` render) |
| 2 | Should-fix: the race opened on ~0.4 s of empty frame after a hard cut (33.03-33.40 s) | chart `data-at` 0 (was 0.2), year readout moved with it (it was still about a year ahead of the bars: fixed in round 3) |
| 3 | Polish: 0.4 s of plain ground after the last crossfade (qa black_segment, 54.03 s) | milestones start 0.35 s into the card |
| 4 | Polish: decade labels 1950-1990 leave during the scene-4 zoom (check: readable < 1 s) | kept: a camera move over axis ticks, not content |

**Round 2** (on `final-4.mp4`, fixes only): ship. Every fix confirmed on the cut frames; qa PASS with 0 warnings.

**Round 3** (an independent critic on the published `final.mp4` = `final-4`, from the round-2 pack plus its own
frames): ship after fixes. The numbers, caveats and credit all checked out. Fixed in `final-9.mp4`; each fix was
confirmed on a still of the new render at the cited time, next to the same time in `final-4`.

| # | Finding (time) | Change |
|---|---|---|
| 1 | Blocker: the race readout ran about a year ahead of the bars (36.13-36.37 s "2016" with coal still first; "2020" with coal above nuclear; wind passing hydro under 2020-21; "2025" held with hydro above solar). The stock state morph (0.35 s delay + 0.8 s ease per state, states 0.25 s apart) leaves the bars about a second behind their states | `row-kit` `race` mode moves the rows itself: each year moves in 0.16 s, 0.75 s after its state, then holds; rows swap between their exact ranks in the same move. `year-tick` flips as the move starts (`lead` 0.75). Checked every 0.2 s: gas passes nuclear under 2006, coal under 2016, wind passes hydro under 2019, nuclear passes coal under 2020, coal is back ahead under 2021 and behind again under 2023, solar passes hydro under 2025 |
| - | Part of the same finding: "the bars trail the voice by about 1 s" | Not changed, with a reason: the caption word times (voice track placed at 33.32 s) put "gas takes the top spot" at 35.60-37.07 s and "wind passes hydro" at 37.39-38.7 s. The swaps now land at ~36.5 s and ~37.3 s, as they did in `final-4` |
| 2 | Should-fix: race names overprinted while two rows shared a slot (33.4-33.8, 36.47, 37.0-37.8, 38.6-39.1 s), bars overlapped | Rows now pass each other within one 0.16 s move; while two rows are closer than about two label heights, the row moving down fades its name and icon to 25 % and its bar to 35 %, and the row moving up is drawn on top |
| 3 | Should-fix: the morph-warp tore the coal line into shifted pieces with no axes (15.13-15.37 s; chart bare 14.75-15.95 s) | Morph-warp removed. Scene 3 opens on the exact last frame of scene 2 (same axes, same camera scale), only the headline and the peak plate fade, then the x domain tweens 1950-2007 -> 1950-2025 with the axes on screen |
| 4 | Should-fix: the end card entered during the crossfade, two text layouts at once (53.77-54.03 s), a regression from round 1 | The card's text and rules start 0.56 s into the 0.762 s crossfade, when the mix chart is under ~15 %; qa still finds no black stretch (the entry was tuned on a 2 s `--from/--to` render) |
| 5 | Should-fix: YouTube chapters of 6-8 s (`share.txt`), which YouTube would ignore | 3 chapters of 15, 18 and 27 s; the web page keeps its 7 |
| 6 | Polish: the scene-4 year chip shrank away for ~10 frames at the payoff (29.93-30.30 s), then read "2024" while the cursor sat on 2025 (30.53-31.13 s) | Sweep segments less than 1.6 s apart share one cursor window, so the chip holds through the crossing marker; the chip shows the nearest year |
| 7 | Polish: poster stamp 11 px above the footnote (7.6 s) | Stamp up 12 px, footnote down 27 px: about 50 px on each side |
| 8 | Polish: frame 0 showed two empty cards | Frame 0 is the kicker, headline and footnote; the cards rise in from 0.05 s, the figures count up from 0.35 s |

Side effects handled: the camera push in scenes 2-4 was re-balanced so the cut stays seamless (scene 2 now
0.976 -> 0.99, scene 3 0.99 -> 1.012, scene 4 1.012 -> 1.03 as before) without a still of 2.5 s or more and without
pushing the y-axis labels to the frame edge (both seen and fixed in the unused renders `final-5` to `final-8`).

## QA summary

`showtime qa` on the published file (`final.mp4` = the job's `final-9` re-encoded under 20 MB):
**PASS (0 fail, 0 warn, 0 note)**. The master `final-9.mp4` (31.2 MB): PASS, 0 warn, -14.0 LUFS / -1.5 dBTP.
- h264 High, yuv420p, 1920x1080, 30 fps, faststart, BT.709; 60.10 s, matching showtime.json
- loudness -14.0 LUFS, true peak -1.3 dBTP (master: -14.0 / -1.5); no silent gaps; no black or frozen stretches
- frame 0 has a picture and flows into frame 1 (the kicker, headline and footnote; the cards rise in and the
  numbers count up from 0.35 s, so `poster.jpg` is the settled hook at 7.6 s and is not baked into frame 0)
- must_show: 672, 652, 2024, 2,016, 2007, 48.5, 2016, 760, 737, 40.8, 17.7, 17.2, 16.6, Table 7.2a, August 2026 all found
- no attribution required (no CC-BY items)

`showtime check`: PASS with 11 warnings, all x-axis year labels that leave while the axis moves (the 2007 -> 2025
stretch at 15 s and the 1995-2025 zoom at 22.5 s), read and kept; deterministic; fonts embedded
(Bricolage Grotesque, Inter, JetBrains Mono); contrast OK for all text.

## Tool issues found (reported, worked around here)

- A race's per-state titles crossfade from 0 on every state, so at `--step` under ~0.4 s the title flickers;
  the year is shown by `year-tick` instead.
- The hbar chart ignores `valueLabels: false`; the race hides them with CSS.
- `check` records at most 80 characters per text, so a `must_show` phrase late in a long line is "not found".
- A CSS crossfade whose `data-start` sits within 1 ms after a frame boundary rendered one empty frame in
  `render` (not in `snap`).
- A race from `data import --chart race --step 0.25` trails its states by about a second in the stock hbar
  (each state morphs after 0.35 s over 0.8 s, so the tweens overlap), and near-equal rows share a slot while
  the soft rank settles; a year readout timed to the states is then a year ahead. `row-kit`'s `race` mode
  works around it here.
- `data import --y wind_solar` names the series "Wind solar" (the "+" is lost); the component maps it back.

## Timings

Shared 6-core Intel i5 with other example builds running.

| Step | Time |
|---|---|
| `voice script` (7 lines) | 77 s first run, 31 s after the cut (cached lines) |
| `snap` (19-31 stills) | 6-15 s |
| `check` | 32-38 s |
| `render --preview` (720p) | 1 min 05 s |
| `render` final (1803 frames, 3 workers) | 1 min 23 s - 1 min 30 s |
| `qa` | 15-17 s |
| `export html` | ~20 s |

## Files

```
final.mp4              the video (qa PASS), 19.2 MB
poster.jpg             the settled hook at 7.6 s (cover image)
us-power-mix.html      the same video as one offline web page (export html --target artifact)
share.txt              YouTube/X/LinkedIn copy with chapters, alt text, posting notes
credits.txt            data, icons, fonts, voice, music
data/                  EIA CSV as downloaded, derive.py, the three derived tables
project/               index.html, power.js, showtime.json, narration.md, audio/mix.json, data/*.json, icons/, voice/ (timings)
crew/                  storyboard, motion-designer tasks, researcher script + claims.verified.json
review/                round 1 and round 2 findings (self-reviews); round 3 is in this README
```

To rebuild: the voice WAVs are not committed; run `showtime voice script project/narration.md -o project/voice --fit 58`,
then `showtime render project`.

## Sources and licences

- **Data:** U.S. Energy Information Administration, *Monthly Energy Review* (August 2026, released 2026-08-26),
  Table 7.2a "Electricity Net Generation: Total (All Sectors)",
  <https://www.eia.gov/totalenergy/data/browser/index.php?tbl=T07.02A>, CSV
  <https://www.eia.gov/totalenergy/data/browser/csv.php?tbl=T07.02A>, accessed 2026-09-27. EIA: "U.S.
  government publications are in the public domain and are not subject to copyright protection"
  (<https://www.eia.gov/about/copyrights_reuse.php>); the acknowledgment with the publication date is on
  screen and in share.txt. The EIA logo is a registered trademark and is not used. The next edition
  (2026-09-29) may revise the 2025 values; re-derive with `data/derive.py` before reusing.
- **Icons:** Lucide (ISC), via `showtime assets icon`; license sidecars next to each file.
- **Fonts:** Bricolage Grotesque, Inter, JetBrains Mono, SIL OFL 1.1, served locally by showtime.
- **Voice:** Kokoro-82M (Apache-2.0), voice am_michael, synthesized on this machine.
- **Music and effects:** composed and synthesized locally (news-bumper, key D, seed 3; thock, whoosh, ding).
  No samples or library tracks.
