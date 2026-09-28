# Sound-designer pass (done by the director: this session had no sub-agent tool)

Bed: `audio compose --style epic-trailer --key Cm --dur 30 --sections 0:intro,10:build,20:drop,27:outro --no-sfx`
(84 bpm; downbeats 0, 2.857, 5.714, 8.571, 10.0, 12.857, 15.714, 18.571, 20.0, 22.857, 25.714; end_hit 27.142).
The 27:outro marker lands inside the final hit's ring-out, so the file has three sections and the hit at 27.142 s.
`--no-sfx` because every effect is placed by hand on its cut (below), so none doubles the score's own.

Cinematic density: four big moments and nothing else, all effects in C.

| Cue (s) | Effect | Placement | Why |
|---|---|---|---|
| 0.0 | braam, intensity 0.55 | `align: hit` at 0 | The stare: frame 0 already sounds like a trailer |
| 0-11 | "Space Winds" by aquinn (library, CC0) | fades out by 11 s | Air under the Mars shot |
| 8.571 | boom | `align: hit` on the burn's centre | The falling star lands |
| 11.18-13.68 | 38 keyclicks (4 variants) | one per typed character, from `CUE.typeStart + (i - 0.5) / cps` | The typewriter line; the bed dips under them |
| 16.0-20.0 | riser 4 s + reverse-hit | both `align: hit` on 20.0 (their end) | Suck into the drop |
| 20.0 | braam (full) + impact | `align: hit` on 20.0 | The machine; braam leads, impact is a layer under it |
| 27.142 | boom | `align: hit` on end_hit | The title |

Mix (`audio/mix.json`, written by `tools/make_mix.py` from `cues.js`): the bed +3 dB (music-led), +2 dB in the
build, ducked 8 dB with carve 0.4 under the voice, and under the keys and the drop's braam. Result: -14.04 LUFS,
-1.1 dBTP, LRA 6.4 LU, voice 11.0 dB over the bed, limiter 1.8 dB. Report warnings kept on purpose: the riser
"masked at 20.0 s" (its hit is where the braam lands; the audible part is the 4 s before), the impact 1 dB under
the braam (a layer), and keyclicks within 0-9 dB of their neighbours (they overlap each other at 18 per second).
The teaser uses the same family: braam at 0, riser + reverse-hit + braam + impact on 8.6 s, boom on 11.474 s.

**Round 3 changes (after the outside critic):** the bed is re-composed with `--dur 29.2 --sections
0:intro,10:build,20:drop`, the same downbeats up to 22.857, with end_hit at 25.714 s (the hit lands about 3 s before
the end of the score, so a shorter score moves it two bars earlier and the title card holds 4.3 s). The boom follows
end_hit to 25.714. The bed's ring now fades over 1.2 s instead of stopping (0.8 s in the teaser). "Space Winds" comes
back under the title card from 26.3 s (1.4 s fade in, 1.6 s fade out, offset 14 s into the file) and carries the
last 0.8 s after the score ends. Result: -14.04 LUFS, -1.1 dBTP, LRA 7.1 LU, voice 11.0 dB over the bed,
limiter 2.0 dB; the same masking warnings as before.
