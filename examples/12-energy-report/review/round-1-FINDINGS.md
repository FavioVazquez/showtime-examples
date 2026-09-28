SELF-REVIEW (no sub-agent tool in this session: the director answered CRITIC.md; a second look by the user is requested)
VERDICT: ship after fixes -- numbers, story and pacing hold; one empty frame at the last cut and a slow race entrance
WHAT WORKS (max 3, so it is kept):
- One visual spine for scenes 2-4: the same y scale, the morph-warp compresses the 1950-2007 coal line into the 1950-2025 axes, and the 3->4 cut is invisible apart from the title
- Every figure on screen traces to the frozen EIA table (crew/research/claims.verified.json: 25/25 verified); race hides interpolated values
- Colour per source is consistent in every scene (coal ash, gas ember, wind + solar green)
BLOCKERS:
- t=53.43s cut-frames (cut 53.4 +1f, frame 1603)  the rendered frame is empty (only the ground) between the mix chart and the crossfade; a paused player or a thumbnail scrubber lands on a blank flash -> the source scene starts 0.7 ms off a frame boundary (53.434 vs 53.4333); put it exactly on frame 1603 (mix-2025 data-dur 12.2613)
SHOULD-FIX:
- t=33.03-33.40s cut-frames (cut 33.02 +1f..+4f)  race opens on an empty frame with only "2005" for ~0.4 s after a hard cut -> chart data-at 0 (and the year readout's chart-at 0)
POLISH:
- t=54.03-54.43s qa black_segment  the source card is only ground for 0.4 s after the crossfade -> start the kicker and rules at 0.3 s (the old chart is under 40 % by then)
- t=22.5-23.5s check warnings  decade labels 1950-1990 slide out during the zoom (<1 s readable) -> kept: it is a camera move, the labels are axis ticks, not content
DECLINED TO JUDGE:
- music taste of the news-bumper bed and TTS naturalness (not listened to in this session; loudness -14.0 LUFS / -1.5 dBTP, LRA 2.5 LU, voice ducks the bed by 20 dB)
BEST POSTER FRAME: t=7.60s because it states the whole claim with both numbers and the "first time" stamp; frame 0 has the headline and labels but not the numbers yet (they count from 0.35 s), so poster.jpg is the 7.6 s frame, not baked
