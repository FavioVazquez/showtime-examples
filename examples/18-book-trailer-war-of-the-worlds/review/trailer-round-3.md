REVIEW, round 3 (an outside critic pass on the shipped files, after the two self-reviews; fixes applied and checked by the director)

VERDICT from the critic: trailer "ship after fixes", teaser "ship". It confirmed quotes, credits, loudness and title timing on
the shipped files, and found one shot the self-reviews had passed.

SHOULD-FIX (both fixed):
- t=21.43-22.87 s, the `wide` shot showed graphic 15 as a vertical strip: 58 % of the frame near-black for 1.43 s,
  right on the drop, which made the machine look smaller just as the trailer is meant to show its scale.
  Fix: in 16:9 the shot is now a 16:9 window of the drawing that steps back from the head framing and pulls out to
  its full width (hat to knees over the hill, the heat ray crossing the sky). No stage black on the sides: column
  luma at 22.757 s is 126 / 159 / 116 (left / centre / right; was 7-10 / 135-157 / 7-10). The teaser keeps the
  whole drawing (it fills a 9:16 frame).
- t=27.42-30 s, the call to action was on screen for 2.58 s while the title and byline were also being read.
  The round-2 note called this a limit, but it was not one: the hit sat at 27.142 s only because the composer places
  the final hit about 3 s before the end of the score. The score is now composed 29.2 s long (sections 0/10/20,
  same key, tempo and downbeats up to the drop), so end_hit is 25.714 s, two bars after the drop. The title is whole
  on frame 772 (25.733 s; luma 29.1 -> 47.6), and the call to action is visible from 25.97 s: 4.0 s on screen.
  To fit, the second quote starts at 20.35 s (was 20.45 s) and is read a little faster (speed 1.2 in narration.md,
  effective 1.14; it ends at 25.21 s, 0.5 s before the hit). Round trip: every word as written ("civilization"
  is the ASR's spelling, as before). The cost shot is now 2.66 s (was 4.09 s).

POLISH (all fixed):
- t=8.47 s, the ridged-burn showed a grid of glowing square cells: fixed in showtime's shader (the domain is turned,
  warped slightly and turned again per octave). The burn front is now ragged, with no rectilinear cells.
- Burned captions 20 % larger (73 px Instrument Serif, was 60), with the new `captions --text-scale 1.2`.
- Credit line 32 px (was 28).
- Lid shot lifted: mean luma 51.0 -> 62.6 over 15.75-17.1 s; the Martian's outline reads under the lid.
- The ending decays instead of stopping: the score's ring fades over 1.2 s (trailer) / 0.8 s (teaser), and in the
  trailer the opening wind returns under the title card and carries the last second out
  (trailer RMS: -18 dB at 27.6 s, -41 at 29.0, -58 at 29.6).
- share.txt: curly ’ in the quote, no "..." opening the Shorts line, and the note on captions.srt says it duplicates
  the burned text for anyone who turns CC on.

Verification: `showtime check` PASS; `showtime qa` PASS (0 warn) on the captioned master, on the 18 MB copy
(-14.0 LUFS, -1.4 dBTP) and on the teaser's 12 MB copy (-14.0 LUFS, -1.5 dBTP); before/after stills with
`showtime snap final-10.mp4 --at 8.471,16.4,21.9,22.757,1.5,28.571 --compare final-8.mp4`.
The teaser's picture is bit-identical to the previous round (PSNR inf). Only its audio ending changed.

NOT CHECKED: listening. A person should still listen to both cuts, especially the faster second quote and the ending.
