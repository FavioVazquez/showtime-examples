# Researcher pass: every spoken and on-screen claim, checked against the pinned revision

Done inline by the director from `references/crew/researcher.md` (this session had no sub-agent tool), against
a frozen copy of English Wikipedia "Waggle dance", revision **1371912261** (2026-08-29, still the current revision
on 2026-09-27; `capture/make_text_only.py` re-checks `wgRevisionId` before recording), and the PLOS ONE page of
Su et al. 2008 for the footage. Verdict for every row: **verified**.

| Line / screen | Claim | Source (rev 1371912261 unless noted) |
|---|---|---|
| hook | a bee "giving directions"; the dance tells the colony where food is | lead: foragers share "direction and distance" with other members of the colony |
| hook caption | "A marked forager dancing for a feeder 200 m away", Su et al. 2008 | PLOS ONE Movie S2 caption: both dancers trained to an artificial feeder 200 m from the hive. Not "flowers"; no angle claimed for this clip |
| hook trace | "Her red paint mark, tracked (the camera moves with her)" | measured from the footage itself (`project/data/track_red_mark.py`), in the frame's own pixels. Corrected after the independent critic: the camera follows her, so the positions are not her path on the comb; the page draws a ring and a 0.7 s trail, not the whole series (was "Her path, traced frame by frame") |
| problem | dark hive, vertical comb | Evolution: cavity-nesting bees orient their dances "in their dark nests"; dances on vertical combs |
| problem | "She can't point at the flowers from in here" | framing only (the open-nesting A. dorsata, whose dancers do point, is not mentioned) |
| angle | straight up = toward the sun; run angle from up = angle between sun and food | Description / Mechanism (western honey bee) |
| angle | 45 degrees right of the sun -> 45 degrees right of up | the article's own worked example (figure caption); both panels show 45, same side |
| angle | "As the sun moves, she shifts her angle to match" | dancers that stay in the nest adjust their angle as the sun moves. Picture: sun +25 degrees, both panels 45 -> 20 |
| distance | loop turning left, then right: a figure-eight | Description: waggle phase + return phase, turning alternately right and left |
| distance | "The farther the food, the longer she waggles" | Description: "The farther the target, the longer the waggle phase." Bars are relative: no seconds or metres |
| round | ~10 m round dance, 20-30 m transitional, > 40 m waggle dance, Italian honey bee (A. m. ligustica) | lead (species-specific figures, the species on screen) |
| source | von Frisch, Austrian, shared the 1973 Nobel Prize, "one of the first" to decode it | lead ("Austrian ethologist and Nobel laureate"); nobelprize.org 1973 Physiology or Medicine (shared with Lorenz and Tinbergen) |

Not said, on purpose: no distance calibration (seconds per km), no "sisters" (the article says members of the
colony; the screen says nestmates), no "discovered", no share of foragers that follow dances, nothing from the
French article (its round-dance threshold differs). The French narration translates these same rows.
