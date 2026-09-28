# Concepts: a new Curtain Call sting, candidate for v2 (creative director, done inline by the director: no sub-agent tool in this session)

Contract: a 5 s logo sting in the showtime brand that makes the brand idea (the curtain opens, the show starts)
readable in any feed, in 16:9, 1:1 and 9:16, ending on the mark and the wordmark with a sound logo.

Tone: `cinematic` preset from tones.md; knobs: warmth up (gold light, velvet), energy medium (45/100),
motion: one continuous camera move, no cuts.

## C1 Velvet curtain (recommended)
- Idea: a real 3D stage. Velvet curtains part, the mark is flown in from the flies and lands in the pool.
- Viewer sees: three.js curtains with velvet shading, a volumetric-looking beam with dust, the extruded mark.
- Hook (0-0.4 s): a slit of gold light between closed curtains; the pool is already lit (frame 0 is not black).
- Beats: slit 0-0.3 · curtains part 0.3-2.3 (camera dollies in 7 %) · fly-in 2.05-2.8 · landing on the sound-logo tonic 2.8 · wordmark wipes up 3.05, holds to 5.0.
- Spine: the curtain, which is the mark's own picture, played out at full size.
- Risk: WebGL render cost; the mark moves in 3D, so it must rest square to camera.

## C2 Marquee
- Idea: a lit theatre marquee: bulbs chase around an empty board, then the lockup lights up inside it.
- Hook: chasing bulbs and one word, "tonight".
- Beats: chase 0-1.5 · board lights 1.5-3 · lockup 3-5.
- Risk: flat, and close to a generic "coming soon" sign.

## C3 Spotlight
- Idea: no curtain; one follow-spot searches a dark stage and finds the mark.
- Hook: a cone rakes across empty boards.
- Beats: search 0-2 · find 2-2.8 · lockup 2.8-5.
- Risk: mostly dark frames, the weakest thumbnail in a feed.

## W1 Arcade marquee (wildcard)
- Idea: an 8-bit marquee ("NOW SHOWING / PRESS START") pixel-dissolves into the mark (WebGL `pixel-dissolve`).
- Risk: pixelating the mark is an effect on the artwork (BRAND.md don'ts); only the transition may touch it.

Rejected on purpose: a film reel, clapperboard or countdown leader (BRAND.md bans them from the mark and they
are the category cliche).

Recommended: C1, because it is the only direction that is true 3D and it acts out the brand idea itself.
