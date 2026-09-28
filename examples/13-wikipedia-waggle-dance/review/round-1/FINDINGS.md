SELF-REVIEW (no sub-agent tool in this session: the director answered CRITIC.md; a second look by a person is still due)

VERDICT: ship after fixes -- facts, credits and the 45 degree mapping check out; two transitions double-expose text and one stretch reads as a hold.
WHAT WORKS (max 3, so it is kept):
- t=4.60s frames/t0004.600s.jpg  the real footage with the dancer's path measured from the frames: the hook proves the subject before any drawing.
- t=22.50s frames/t0022.500s.jpg  the same 45 degree wedge in the field (sun -> food) and on the comb (up -> run), same side; at 25.8 s both read 20 degrees after the sun moves.
- t=59.97s frames/t0059.967s.jpg  the end card carries the article (rev 1371912261, CC BY-SA 4.0, "summarised and animated"), the footage (Su et al. 2008, CC BY 3.0) and the output licence for 6 s.
BLOCKERS:
- none
SHOULD-FIX:
- t=45.04s frames/t0045.040s.jpg  the browser window rises in while the round-dance scene is still cross-fading: a white card double-exposed over the distance scale -> start the DOM layer at CUE.source + 0.3 (after the canvas fade), fade it out by CUE.credit - 0.2.
- t=53.75s (sheet.jpg, 53.75 s)  the source column ("Karl von Frisch", "Nobel Prize, 1973") is still on screen while the payoff title reveals: two text layouts at once -> fade the source text out over CUE.credit - 0.6 .. - 0.2.
- t=52.50s frames/t0052.500s.jpg  "one of the first to decode the dance" appears ~1.4 s before the end card starts: too short to read with the fade -> end card at speech end + 1.3 s (was + 0.75).
- (French cut) t=29.87-32.40 s  qa: frozen 2.5 s at the start of the distance scene (the dancer is small and her light fixed) -> she is already dancing when the scene opens, and the comb light follows her.
POLISH:
- t=2.22s context/final.srt  caption "Her dance tells the" at 21-22 chars/s when regrouped with --max-words 7 -> keep the default grouping for English (qa PASS); French keeps --max-words 7 (its 45-character lines).
- t=13.75s (sheet.jpg)  the field panel is empty for ~1.5 s until "sun" -> kept: the voice says "On the comb" first; a bee now walks onto the comb meanwhile.
DECLINED TO JUDGE (what you could not or chose not to assess, e.g. audio quality, brand fit without a brand kit):
- audio by ear (read from numbers only: -14.0 LUFS, -1.6 dBTP, voice about 14 dB over the score); French idiom (machine translation by Claude, not yet reviewed by a native speaker).
BEST POSTER FRAME: t=4.60s because the traced figure-eight over the real bees states the subject in one image (it is poster.jpg).
