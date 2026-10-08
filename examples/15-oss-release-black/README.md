# 15 · Open-source release: Black 26.1.0 and the 2026 stable style (35 s, no voice, unofficial)

![poster](poster.jpg)

**Video:** [`final.mp4`](https://github.com/FavioVazquez/showtime-examples/releases/download/examples-media-v1/15-oss-release-black--final.mp4) (final-4) · 1920x1080 · 30 fps · 35.00 s · 18.0 MB · -14.1 LUFS / -1.1 dBTP ·
**GitHub/chat copy:** [`exports/final.github.mp4`](exports/final.github.mp4) (9.4 MB, under the 10 MB cap)

## The request

> "Make a 35-second what's-new video for Black 26.1.0 — show what the 2026 stable style actually changes in
> people's code."

**Mode:** quick, publish-bound (researcher facts before the build, critic pass on the final). No questions
asked. The opening line stated the assumptions:

> Quick mode: 35 s, 16:9, 30 fps, no voice-over (on-screen text, a `deep-house` bed at 122 bpm, key clicks
> under the typing, one glitch on the bug-fix beat). The diff shown is Black 26.1.0 run on code that 25.12.0
> had already formatted, which is what someone who upgrades sees in review. Every code line and terminal line
> is real output from both versions. Unofficial-summary label on screen and in the share copy; no logos.

**Contract:** upgrading to Black 26.1.0 (18 Jan 2026) turns on the 2026 stable style, and a few real patterns
in code you already formatted change: redundant parentheses around assignment targets go, type comments are
normalised, and a docstring after a comment is now treated as the module docstring.

## The story, shot by shot

| Time | Scene | On screen | Its job |
|---|---|---|---|
| 0-3.6 s | `hook` | Frame 0: a generic notification card "black 26.1.0 · Introduces the 2026 stable style · 18 Jan 2026" and the promise "−+ Your **diff** after upgrading:"; the −/+ gutter lights red/green, a second card lands: "9 preview features become stable · 6 of them can show up in your upgrade diff" | The event and the promise, complete at frame 0 (the thumbnail, `poster.jpg`, is the end card; see Review round 1) |
| 3.6-10.2 s | `diff-1` (wipe in) | `pipeline.py` in a code panel: 25.12.0's output, then the upgrade diff plays as a unified diff: the removed lines (`(result) = load(...)`, `(x) = y = 0`) turn red and stay, the new ones (`result = ...`, `x = y = 0`) open green below them, all four highlighted. Right: "Redundant parentheses on the left of = are removed · #4865 · @Nikhil172913832" | Change 1 as the user will meet it in review |
| 10.2-17.4 s | `diff-2` (signal-glitch in, glitch SFX) | Same grammar on `settings.py`, one change at a time: first only #4764 applies ("Change 2 · fix: a docstring after a comment is now seen as the module docstring · line 3 is new", the new blank line 3 highlighted, the type comments still untouched); at 13.2 s "Change 3: type comments become `# type: int` · #4645" arrives, change 2 steps back, and lines 6-7 turn red with their fixed versions opening green below | The bug-fix beat (the glitch is the bug) plus change 3, same visual grammar |
| 17.4-24.6 s | `terminal` (wipe in) | A laptop (`device-frame`) with the captured session typed on: `pip install black==26.1.0`, `black --check app.py` → "would reformat app.py / Oh no! 💥 💔 💥", `black app.py` → "All done! ✨ 🍰 ✨"; step labels install / check / reformat light up in time; "real output · Python 3.12" | How to adopt it, with Black's real CLI output (the one deadpan joke comes from the tool itself) |
| 24.6-30.2 s | `more` (stagger in) | Left: an excerpt of the real release notes, the three items boxed in turn; right: "9 features in all. Three more: + one blank line after imports #4489, + calls on multiline strings stay compact #1879, + generic functions split at the arguments #4777", then "All of it was in --preview during 2025." | Completeness without dumping the changelog; the source is on screen |
| 30.2-35 s | `end` (wipe in) | "black 26.1.0 · the 2026 stable style · 18 Jan 2026", `$ pip install -U black` with "newer 26.x releases keep the 2026 style", the release URL, the PR authors of every change shown, and the full label "Unofficial summary. Not affiliated with the Black project or the Python Software Foundation." (4.2 s) | Where to get it, who made it, the honesty label |

The spine is the diff gutter: the red/green −/+ of the hook returns as the diff panels, the `+` rows of scene 5
and the `$` prompt on the end card. A small "unofficial summary" pill sits top right on every frame.

## Where every line on screen comes from

- **The diffs** ([`evidence/samples/`](evidence/samples)): `pipeline.py` and `settings.py` were written for
  this video (`*.before.py`), formatted with Black 25.12.0 (`*.25.12.0.py`, what users have today), then run
  through Black 26.1.0 (`*.26.1.0.py`). `showtime code <25.12.0 file> --to <26.1.0 file>` made the panels; after review round 1 the token files were
  rearranged, not re-typed (see Review round 1): the removed lines are kept as rows, and `settings.py` is split
  into two steps, 25.12.0 → +#4764 (`diff-2a-docstring.json`) → +#4645 = 26.1.0 (`diff-2b-type-comments.json`).
  Black 25.12.0 `--preview` on the 25.12.0 output gives byte-identical results to 26.1.0 for both files,
  which backs "All of it was in --preview during 2025" for these samples (the researcher checked 9 more).
- **The terminal** ([`evidence/terminal/session.log`](evidence/terminal/session.log)): a fresh CPython 3.12.9
  venv, `pip install black==26.1.0`, `black --check app.py`, `black app.py`, captured 2026-09-27 in a
  neutral folder with a relative file argument (Black prints absolute paths for `.`, so `black --check .` was
  not used). On screen, the ~30 "Collecting / Using cached" lines are elided as "…" and the dependency list
  after `black-26.1.0` as "…"; everything else is verbatim, emoji included (drawn with Noto Emoji so they look
  the same on every OS).
- **Facts** (researcher, primary sources fetched 2026-09-27: the GitHub release and PR API, CHANGES.md at the
  tag, PyPI JSON, the docs' stability policy): release published 2026-01-18T04:49Z; 9 stabilised features;
  6 produce an upgrade diff on 25.12.0-formatted code (#4800, #4720, #4710 do not, so they are not shown);
  PR authors from `repos/psf/black/pulls/<n>`; `pip install -U black` installs 26.5.1 today, hence the
  "newer 26.x releases keep the 2026 style" note (stability policy). Not claimed: speed, user counts,
  "latest version", maintainer titles.
- **Release-notes excerpt:** `showtime site component https://github.com/psf/black/releases/tag/26.1.0
  ".markdown-body" --dark`, cropped to the Highlights list (no GitHub chrome, no logos).

## Commands, in order

`showtime` is `skills/showtime/bin/showtime`; `<job>` is `showtime-out/black-26-1-0-20260927-131402`,
`<p>` is `<job>/project`. The two Black versions live in scratch venvs outside the example.

```bash
showtime doctor --quick
showtime job init black-26-1-0 --mode quick --platform github --goal "Make a 35-second what's-new video ..." \
  --assumed "35 s, 16:9, 30 fps, no voice-over: on-screen text + deep-house bed (122 bpm) + keyclick/glitch SFX" \
  --assumed "the diff shown is 26.1.0 run on code 25.12.0 already formatted" --assumed "unofficial label; no logos" \
  --assumed "every diff and terminal line is real output from both versions"
showtime new dom <p> --title "Black 26.1.0" --duration 35 --look template   # the template's timeline rescaled to 35 s, then rewritten

# real material
venv-25.12.0/bin/black -q x.25.12.0.py; venv-26.1.0/bin/black -q x.26.1.0.py   # per sample, see evidence/samples
venv-25.12.0/bin/black --preview -q - < x.25.12.0.py | diff - x.26.1.0.py       # preview == 26.1.0
(fresh venv) pip install black==26.1.0; black --check app.py; black app.py      # -> evidence/terminal/session.log
showtime site component https://github.com/psf/black/releases/tag/26.1.0 ".markdown-body" --dark -o capture/notes-gh.png
showtime assets emoji 💥 -o <p>/img/    # also 💔 ✨ 🍰 (Noto, Apache-2.0, license sidecars kept)
showtime code samples/pipeline.25.12.0.py --to samples/pipeline.26.1.0.py -o <p>/code/diff-parens.json --theme houston
showtime code samples/settings.25.12.0.py --to samples/settings.26.1.0.py -o <p>/code/diff-comments.json --theme houston
#   (round 1 turned these into diff-1-unified.json, diff-2a-docstring.json, diff-2b-type-comments.json)

# sound: the mix is generated by a script so every key click sits on the frame its character is typed
showtime audio sfx keyclick --variants 4 -o <p>/audio/key.wav
showtime audio sfx glitch --key A --intensity 0.7 --seed 5 -o <p>/audio/glitch.wav
showtime audio sfx thock --intensity 0.5 --seed 2 -o <p>/audio/thock.wav
python3 <p>/tools/keyclicks.py          # writes audio/mix.json: deep-house bed (sections on the scene cuts), 57 keys + 3 returns, glitch, 4 thocks
showtime audio mix <p>/audio/mix.json -o <p>/work/mix.wav   # read the report; 3 rounds (see below)

# first look and fixes
showtime check <p>        # round 1: 24 contrast errors, 2 system-font warnings, holds -> fixed (see below)
showtime snap <p> --at 10.05,10.15,10.25,10.35   # CSS glitch vs WebGL signal-glitch: picked signal-glitch
showtime snap <p> --every 1                       # contact sheets, 4 rounds
showtime check <p>        # PASS, 0 warnings

# final, verify, deliver
showtime render <p> --job <job>                   # final.mp4 22.6 MB (crf 16) -> "render": {"crf": 18} in showtime.json
showtime qa <job>                                 # FAIL only on the github 10 MB cap for the master
showtime deliver exports <job> --targets github,chat,x,linkedin
showtime render <p> --job <job>                   # final-2 (laptop layout fix), final-3 (audio fix)
showtime qa <job> --platform youtube              # final-3: PASS
showtime deliver exports <job> --targets github,chat,x,linkedin
showtime qa <job>/exports/final-3.github.mp4 --platform github   # PASS, 9.4 MB
showtime review-pack <job>                        # self-review answered into review/round-1/FINDINGS.md

# review round 1 (critic): fixes, then final-4
showtime snap <job>/final-3.mp4 --at 20.93,21.0,22.5            # confirmed: output printed before Return
showtime snap <p> --at 5.5,6.3,8.0,11.0,12.5,13.2,13.7,15.5,21.2,27.4,29.5,32.6 --sheet
showtime check <p>                                # PASS, 0 warnings (after easing the change-2 dim, see below)
showtime render <p> --job <job>                   # final-4.mp4, poster = 32.6 s (not baked)
showtime qa <job>/final-4.mp4 --platform youtube  # PASS
showtime deliver exports <job> --targets github
showtime qa <job>/exports/final-4.github.mp4 --platform github   # PASS, 9.4 MB
showtime snap <job>/final-4.mp4 --at 0,6.9,11.0,12.6,13.3,13.8,21.3,27.4,29.5,32.6 --compare <job>/final-3.mp4
```

## Iterations that mattered

1. **Contrast (check round 1).** The first code theme (`vitesse-dark`) draws punctuation and comments at
   #666666 (3.1:1), and the focus dim (0.45) plus 35 % line numbers failed 4.5:1. Switched to `houston`
   (every token colour ≥ 8:1 on the panel), dim 0.7, line numbers at 62 %, lighter −/+ gutter colours.
2. **System fonts.** Geist Mono has no → glyph (U+2192) and a bare `<code>` fell back to Courier: the arrow is
   an inline SVG and `code` inherits the page font.
3. **Readability holds.** The removed lines needed 2 s before they collapse: diffs moved to 2.5 s / 1.8 s into
   their scenes; one right-column block was trimmed to fit its 7.2 s.
4. **Glitch pick.** Both were snapped mid-window; `signal-glitch` tears rows but keeps the code's structure,
   so it reads as "a bug", not as noise. It is the only glitch in the video.
5. **Laptop layout (final → final-2).** Pushed to 1.04x, the laptop ran under the label pill and touched the
   right edge; resized, and the terminal line height tightened so the last line clears the screen.
6. **Audio (final-2 → final-3).** The "break" under the terminal dropped the bed ~10 LU, so the music
   seemed to stop; section gain +4 dB, lighter key ducking, louder keys.
7. **Review round 1 (final-3 → final-4).** See the next section.

## Review round 1

A critic pass on final-3 said "ship after fixes": no blockers, two should-fixes and five polish notes. Each one
was checked first against final-3's frames at its cited time (the review pack's frames, fresh snaps and
a before/after sheet), and each held up. What changed in final-4, each checked
with a full-res snap of the new render at the cited time and a before/after sheet against final-3:

- **Should-fix, scene 5 (27.4 s / 29.5 s): the highlight boxes crossed out two of the three features.** The
  boxes' percentages resolved against the padded card, not the image, so every box sat 12-15 px low and the
  top borders ran through the #4777 and #1879 lines. The image and boxes now share an unpadded wrapper and the
  boxes are set from the 1440x1195 excerpt (#4489 13.6 %/12.3 %, #4777 47.6 %/4.4 %, #1879 52.3 %/8.7 %).
  Each box now encloses its whole entry.
- **Should-fix, scene 3 (10.4-14.8 s): the type-comment edit sat under the docstring headline.** Lines 6-7
  used to show red minus signs from the first frame of the scene. The scene now plays the changes in order:
  25.12.0's file, with lines 6-7 unmarked; #4764 adds line 3 (11.7 s), which is highlighted; then "Change 3"
  arrives (13.2 s), change 2 steps back to 66 % opacity, and at 13.5 s lines 6-7 turn red and their fixed
  versions open green. Change 3 is on screen for 4.2 s. A full step back (42 %) made `check` flag the change-2
  text as readable for only 3.1 s, so the step back is gentler.
- **Polish, scene 2: the diff never showed − and + together.** Both diffs now hold as unified diffs, with the
  removed lines in red above the added lines (the code panel is a little taller and uses a slightly smaller
  font, `size` 3.6, so 12 rows fit).
- **Polish, 11.0 s: the gutter jumped 1, 2, 4, 5.** The gutter now counts the file on screen: the old file's
  numbers before a change and the new file's after it. Removed lines get a minus.
- **Polish, 21.2-21.5 s: short near-silence.** It comes from the composed break itself: the bed alone dips to
  -40...-46 dBFS for about 0.6 s at a bar end, and ducking can't cause that. A soft thock (-8 dB) now fills it, landing with "Oh no! … 1 file would be
  reformatted." at 21.2 s. Checking this turned up a timing bug: output printed about 0.2 s before the
  Return key, while the caret was still on the command (snapped at 21.0 s on final-3). Every output line now
  appears just after its Return.

  I can't listen in this session, so this was judged only from metering.
- **Polish, poster.** Frame 0 stays the hook, since baking another frame there would flash. `poster.jpg` is
  now the end card at 32.6 s, where "black 26.1.0" is about 140 px tall and still reads at feed size. Upload
  it as the thumbnail wherever a platform takes one.
- **Polish, end card.** The note "newer 26.x releases keep the 2026 style" went from 2.6 to 3.1 cqh (about
  33 px at 1080p).

## Features shown

`new dom` (retimed to 35 s) · `showtime code --to` → **code-block** (diff, highlight, dim, `size`; two panels swapped by a CSS step for a two-step diff) ·
`ST.onSeek` (a small page script that keeps removed lines on screen and renumbers the gutter) ·
**device-frame** (laptop, live HTML screen) · **typewriter** (uniform cadence; key clicks computed from it) ·
**notifications** (hook) · transitions **wipe** (linear, 3 cuts), **signal-glitch** (WebGL, once; CSS `glitch`
snapped and rejected), **stagger** · `site component` (release-notes body, cropped) · `assets emoji` (Noto) ·
`audio compose` `deep-house` 122 bpm via the mix (`sections` on the cuts, `section_gain`, ducking under 60 key
tracks) · `audio sfx` keyclick (4 variants), glitch, thock · `audio mix` report · `check`, `snap`
(project and video), `render --job` with `"render": {"crf": 18}`, `qa --platform`, `deliver exports
--targets github,chat,x,linkedin`, `review-pack` · researcher facts (every item → PR, date, author).
Not used: `retime -d` (the brief's cut-down is covered by example 17), `export html` (not asked).

## QA summary

- `final.mp4` (final-4): **PASS** with `--platform youtube` (0 fail, 0 warn): h264 High yuv420p, 1920x1080 30 fps, faststart,
  BT.709, 35.00 s, -14.1 LUFS, -1.1 dBTP, LRA 4.5, no silence, no black or frozen stretches, frame 0 flows into frame 1 (no poster flash),
  no attribution required. Against the job's `github` platform the master FAILs only `file_size` (18.0 MB vs the
  10 MB cap): justified, since the master is the upload copy; the GitHub copy is the export below.
- `exports/final.github.mp4` (final-4): **PASS** `--platform github`, 9.4 MB, -14.3 LUFS, -0.8 dBTP.
- Other exports made for final-3 (not shipped here, same picture): chat 9.4 MB, x 10.8 MB, linkedin 10.8 MB.
- `check`: PASS, 0 errors, 0 warnings (6 info notes, all about image, transition or mid-stagger layers).
- Critic: no sub-agent tool in this session, so the maker answered the critic brief itself
  ([`review/round-1-FINDINGS.md`](review/round-1-FINDINGS.md), verdict "ship", two should-fixes found on
  final-2 and fixed in final-3). A critic pass on final-3 followed. It found two should-fixes and five polish
  notes, all fixed in final-4 (see Review round 1). A human look is still welcome.

## Sources and licenses

| What | Source | License / use |
|---|---|---|
| Release facts, PR numbers, dates | https://github.com/psf/black/releases/tag/26.1.0 · CHANGES.md at the tag · `gh api repos/psf/black/pulls/<n>` · https://pypi.org/project/black/26.1.0/ · https://black.readthedocs.io/en/stable/the_black_code_style/index.html | project text, paraphrased (no long quotes) |
| Black itself (run to make the diffs) | PyPI black 25.12.0 and 26.1.0 | MIT ("Copyright (c) 2018 Łukasz Langa") |
| Release-notes excerpt (scene 5) | github.com release page, `.markdown-body` only | project text (MIT repo); no logos or site chrome |
| Sample code | written for this video | own work |
| Emoji 💥 💔 ✨ 🍰 | Noto Emoji (Google) via `showtime assets emoji` | Apache-2.0 (sidecars in `project/img/`) |
| Fonts | Geist, Geist Mono via Fontsource | OFL-1.1 |
| Music, SFX | `showtime audio compose` / `audio sfx` (procedural) | original, no credit needed |
| Logos | none used (Black, PSF, Python, GitHub) | wordmark "black" is set in the video's own font |

Credits ship in [`credits.txt`](credits.txt); the share copy with the label is [`share.txt`](share.txt).
