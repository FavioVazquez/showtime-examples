INDEPENDENT CRITIC (a separate reviewer that did not build the video; it checked the review packs and the two shipped files). The fixes below were made by the builder afterwards.

VERDICT: ship after fixes (both versions). No blockers. Every on-screen figure matches the facts sheet and the round-1 end-card flash is gone.
WHAT WORKS (kept through the fixes):
- Facts: 13.7 sq mi / 35.5 km², 716 dwellings (per Hawaiʻi County), 875 acres ≈ 354 ha, ~60,000 earthquakes, M6.9, ≈ M5 energy, the dates; "Preliminary figures, USGS, Sept 2018" on screen.
- The summit cross-section is a faithful redraw of the PDF figure (floor about 1050 m, low point about 545 m), labelled as a redraw, with the skyscraper left out.
- Hook, cuts and loudness: frame 0 reads at 168x94; all cuts clean frame by frame; both files -14.0 LUFS / -1.6 dBTP.
BLOCKERS:
- (none)
SHOULD-FIX:
1. EN 45.3-50.3 s, ES 49.9-54.9 s: the shot under "reached the ocean at Kapoho Bay on June 3" was the hook's June 11 channel shot again, with no ocean in it.
   FIXED: the shot is now the USGS map from the same June 11 video (a still at 7.5 s of video 2227): the whole channel from fissure 8 to the ocean entry at Kapoho. It starts close on the fissure 8 end and pulls back until the ocean entry is in frame. Tag: "Map: fissure 8 channel to the ocean entry at Kapoho · USGS video, June 11, 2018". The date card moved to the right, clear of the fissure 8 end.
   The critic's first suggestion, the ocean-entry section of USGS video 2186 (June 6 compilation), would have meant downloading a new 40 MB file; the map was already in a clip on disk and shows the same thing (fissure 8 to the ocean at Kapoho), so no download was made.
2. ES: burned subtitle cards of 1-3 words, some on screen for about 0.4 s, splitting "la fisura | 8", "Geológico de Estados | Unidos", "Kapoho | el 3 | de junio".
   FIXED: the burned layer is now drawn by project-es/subs.js: 22 phrase cards, each one clause or sentence, at most two lines, at least 1 s (shortest 1.76 s), breaks only at punctuation or pauses, per-word highlight kept. The SRT sidecar now uses the same 22 cues.
3. ES 0-7.9 s: the hook's footage tag sat on bright sky (about 1.7:1).
   FIXED: every Spanish footage tag sits on an ink plate; measured about 10:1 on the shipped file at 1.5 s.
POLISH (all cheap, all done):
- EN 65.6-71.0 s / ES 71.1-76 s: the moving date on the end ruler was in the same red bold as the event dates ("SEPT 2" next to "SEPT 22"). It is now grey mono, so only real events are red.
- EN 10.9-15.2 s / ES 12 s: the "the source" note broke as "the source: 2 / pages". It now reads "the source: / 2 pages, USGS, / Sept 2018" ("la fuente: / 2 páginas, USGS, / sept. 2018").
- ES summit source line broke as "(PDF p. / 2)"; it now keeps "PDF p. 2" together on two planned lines.
VERIFIED: snaps of the new finals at every cited time, before/after against the previous finals; check PASS 0 warnings on both projects; qa PASS (0 fail, 0 warn) on both finals and both shipped 20 MB copies.
