# curtain-call-pack: decisions

Append-only. One block per decision: what, why, where it came from. Never edit an old entry;
mark it superseded by a newer one instead. Kinds: picked | assumed | user-edit | superseded by D-nnn.

D-001  Studio session started for "curtain-call-pack"                                   [picked]
       Why: the user asked to see options before the render
       From: chat      Phase: discover      2026-09-27

D-002  Concept: C1 "Velvet curtain" (3D curtains, mark flown in, lands in the pool) [picked]
       Why: The board decides (the reviewer here is simulated: the director played the user and wrote this rationale). C1 is the only direction that is true 3D and it acts out the brand idea (the curtain opens, the show starts); its frame 0 (a slit of gold between velvet) is recognisable as a thumbnail, which C3's dark search is not; C2 reads as a generic coming-soon sign.
       From: board rev 1 (C1-C3, W1), feedback 2026-09-27 22:52-22:55      Phase: concepts      2026-09-27

D-003  Sound: bed-c1 direction (piano warmth); final sting uses a new logo-sting motif in D with its tonic on the landing [picked]
       Why: Same key as the brand sound logo (D), so v1 and the pack can share an edit
       From: board rev 1 (C1-C3, W1), feedback 2026-09-27 22:52-22:55      Phase: concepts      2026-09-27

D-004  Lower thirds: Fraunces 900 names, Inter roles; cream text on Stage/Wings, velvet only as the bar [picked]
       Why: Brand display face; BRAND.md: velvet never text on dark
       From: board rev 1 (C1-C3, W1), feedback 2026-09-27 22:52-22:55      Phase: concepts      2026-09-27

D-005  WebGL stinger: chromatic-split; the second stinger is the CSS curtain sweep [picked]
       Why: Fast and premium; pixel-dissolve belongs to the parked W1
       From: board rev 1 (C1-C3, W1), feedback 2026-09-27 22:52-22:55      Phase: concepts      2026-09-27

D-006  Do not replace brand sting v1: ship as a separate pack in the example folder [picked]
       Why: Reviewer: ship it as a pack first, decide on v2 later
       From: board rev 1 (C1-C3, W1), feedback 2026-09-27 22:52-22:55      Phase: concepts      2026-09-27

D-007  Frame rules from comments: frame 0 stays the slit of light; the mark rests square to camera; the wordmark sits on the dark apron, never on the gold pool [picked]
       Why: Comments on C1-1 and C1-3
       From: board rev 1 (C1-C3, W1), feedback 2026-09-27 22:52-22:55      Phase: concepts      2026-09-27

D-008  W1 Arcade marquee parked                                                  [picked]
       Why: A pixelated mark breaks BRAND.md (no effects on the mark); kept as a parked idea
       From: board rev 1 (C1-C3, W1), feedback 2026-09-27 22:52-22:55      Phase: concepts      2026-09-27

D-009  Pace: skip the separate look and sound boards; next stop is one storyboard + animatic board, then lock [assumed]
       Why: A 5 s sting has one look (the picked C1 frames) and its sound was picked with the concept; fewer rounds, same control
       From: director      Phase: concepts      2026-09-27

D-010  Brand kit: canonical assets/brand/brand.json via SHOWTIME_BRAND; brand init --from <repo> draft rejected (wrong sources, see crew/brand/extractor-diff.md) [assumed]
       Why: -
       From: brand designer (inline)      Phase: concepts      2026-09-27

D-011  Animatic approved: C1 locked at 5.0 s, landing at 2.8 s on the logo-sting tonic; build 16:9, 1:1 and 9:16 plus the pack [picked]
       Why: Reviewer approved; note at 0:02.8: keep the landing exactly here
       From: board rev 2, feedback 2026-09-27 23:31-23:32      Phase: animatic      2026-09-27

D-012  Lower thirds keep honest placeholder names (names.json); pill dot enlarged from 2 to 2.6 cqmin [picked]
       Why: Answer lt-names; comment on LT-4
       From: board rev 2, feedback 2026-09-27 23:31-23:32      Phase: animatic      2026-09-27

D-013  Locked. Build: three.js sting per aspect (native projects), lower thirds and stingers rendered with --alpha prores and --alpha webm [picked]
       Why: -
       From: board rev 2, feedback 2026-09-27 23:31-23:32      Phase: animatic      2026-09-27

D-014  Review fixes: gold hem made visible (it sat below the boards and used reversed smoothstep edges); drape leading edges follow their folds [picked]
       Why: Both visible at feed size on frame 0
       From: self-review round 1 (review/round-1/FINDINGS.md)      Phase: animatic      2026-09-27

D-015  Pack shipped as example 20; sting v1 unchanged                            [picked]
       Why: Reviewer: ship the pack; v2 adoption decided separately
       From: board rev 3, feedback 2026-09-28 00:08      Phase: review      2026-09-27

D-016  Correction: the simulated feedback events are restamped with the times each round was written and imported (round 1 21:39:52Z, round 2 21:50:22Z, round 3 22:07:43Z); the feedback times quoted in D-002..D-008 (22:52-22:55), D-011..D-013 (23:31-23:32) and D-015 (2026-09-28 00:08) were invented and are wrong [picked]
       Why: critic round 3: the record showed sign-off after the renders and after publication
       From: critic round 3 (review/round-3)      Phase: review      2026-09-27

D-017  Review round 3 fixes: chromatic stinger clears by 0.92 s; lower-third role lines revealed only by the anime.js stagger; ProRes and WebM converted with the BT.709 matrix they are tagged with (render fix in showtime); whooshes re-made so the hit lands on each stinger's cut, capped at 1.1-1.2 s; 9:16 and 1:1 frame 0 is the same ~12 % slit as 16:9; the sting is named 'Curtain Call motion pack sting' until v2 is adopted; wordmark wipe softened; curtains start moving at 0.15 s; dust motes kept inside the beam and off the mark [picked]
       Why: critic round 3: 1 blocker, 6 should-fix, 3 polish
       From: critic round 3 (review/round-3)      Phase: review      2026-09-27
