VERDICT: ship after fixes  -- r2-S1 is fixed: frame 0's headline is now settled and one size. The same fix moved the mid-entrance problem down one line, though. In frame 0, the three words of "Voiced and captioned." still sit on stepped baselines. That is one small should-fix on the poster, and it can be waived. The fix broke nothing else: there are no flashes or double exposures at the 11 cuts, and the sound is unchanged and clean.
WOULD I POST THIS: yes  -- at full size it is a finished, deliberate 24 s loop. The type is crisp, the twelve looks are clearly different and the counter is legible. The stepped subtitle shows only in the still poster, and only as a 6-8 px drift. A stranger would not call it cheap, broken or wrong.

FIRST VIEWER (one line per part of story.txt; there is no narration, so I judged from the on-screen text, the frames and the contact sheet; every "no" is also listed below):
- part 1 (0.00-2.00s) frames/t0001.000s.jpg: yes  -- "Prompt in, video out. Voiced and captioned." beside an app window says what Northwind does. The pill "01/12 --look nocturne" says this is look 1 of 12.
- part 2 (2.00-4.00s) frames/t0003.000s.jpg: yes  -- the same hero comes back restyled at 2.00s (frames/t0002.040s.jpg) and the counter moves to 02/12, so "same film, new look" lands here. Then the camera pushes into the app at "01 Describe".
- part 3 (4.00-6.00s) frames/t0005.000s.jpg: yes  -- the prompt is typed while the 01 Describe / 02 Generate / 03 Export list tracks the step. This is "Prompt in" made literal.
- part 4 (6.00-8.00s) frames/t0007.000s.jpg: yes  -- the draft is ready, then "Everything stays local." with three feature cards. "Voice and captions" picks up the opening's "Voiced and captioned".
- part 5 (8.00-10.00s) frames/t0009.000s.jpg: yes  -- "One sentence. Every format." with the 16:9 / 9:16 / 1:1 outputs is the "video out" payoff.
- part 6 (10.00-12.00s) frames/t0011.000s.jpg: yes  -- the logo resolve ends the first pass, with "Try it free / northwind.example" at about 11.9s (scenes.jpg, "cut 12.00 -0.1").
- part 7 (12.00-14.00s) frames/t0013.000s.jpg: yes  -- the hook returns, but the counter reads 07/12, so it reads as the next look of the same film, not as a glitch or a restart.
- part 8 (14.00-16.00s) frames/t0015.000s.jpg: yes  -- the describe beat in blush. It parallels part 2.
- part 9 (16.00-18.00s) frames/t0017.000s.jpg: yes  -- typing and generate in evergreen. It parallels part 3.
- part 10 (18.00-20.00s) frames/t0019.000s.jpg: yes  -- export, then the local beat, in skyline. It parallels part 4.
- part 11 (20.00-22.00s) frames/t0021.000s.jpg: yes  -- the formats payoff in cobalt.
- part 12 (22.00-24.00s) frames/t0023.000s.jpg: yes  -- the end card at 12/12, with the CTA and URL settled on the last frame (frames/t0023.967s.jpg). It is a clear ending.

HEARING (one line per check; audio.txt and hearing.png; a music-only mix, and transcript.txt has no narration):
- voice over music: ok  -- there is no narration. Speech is 0 % in all 12 scenes and no voice timeline or caption file exists, so nothing can be masked.
- pace: ok  -- there are no voice lines, so there are no words per minute to judge.
- silence: ok  -- "Pauses in the voice longer than 2 s: (none)" and "Near silence mid-video: (none)". After the -18.0 LUFS intro, each scene measures -12.6 to -15.8 LUFS.
- level at cuts: ok  -- the largest jump is +3.5 LU at 2.00s (-18.2 -> -14.7 LUFS), where the music lifts out of its intro on the first look change. The next is +3.1 LU at 22.00s (-14.8 -> -11.7), the lift into the end card. The story calls for both. Every other cut is within 1.7 LU.
- effects: ok  -- "(no effects, or no mix report for this render)", so nothing can be early, late, buried or loud.
- ending: ok  -- the last 0.2 s measure -46 LUFS against -14 LUFS in the 3 s before. hearing.png shows the fade from about 22.9s reaching the last frame, so no music is cut off.
- peaks: ok  -- true peak -1.2 dBTP (ceiling -1), sample peak -1.3 dBFS, no clipped runs. Integrated loudness is -14.3 LUFS (target -14).
- read-back: not run  -- there is no narration to transcribe (see DECLINED TO JUDGE).
- heard on a phone: ok  -- above 300 Hz the mix measures -17.9 LUFS, 3.6 LU under the full mix (-19.3 LUFS and 5.0 LU above 1 kHz). That is inside the 1-8 LU range of posted films.

WHAT WORKS (max 3, so it is kept):
- Frame 0 now holds the settled headline. On the 100 % crops, "Prompt in," and "video out." are the same size and share one baseline (frames/text-0000.000s-1.png, frames/text-0000.000s-2.png), identical to t=0.50s (frames/t0000.500s.jpg). At feed size (thumb-168x94.png) it reads as logo + promise + app window.
- The match cuts sell the premise without a word of narration. At 2.00s (frames/t0002.040s.jpg) and 14.00s (scenes.jpg, "cut 14.00 mid"), the identical layout comes back restyled while the counter advances.
- Cuts stay clean. The iris transitions at 10.00s and 22.00s carry the ring across the look change (cuts.jpg rows "cut 10.00" and "cut 22.00"), qa reports 0 flashes over 10 transitions, and no cut shows a double exposure.

BLOCKERS:
- none

SHOULD-FIX:
- S1 t=0.00s frames/t0000.000s.jpg (also qa/frames/t0000.000s.jpg)  This is new: the r2-S1 fix moved it down one line. The headline is now settled, but the subtitle "Voiced and captioned." is still mid word-by-word entrance on frame 0. "Voiced" sits highest, "and" lower and "captioned." lowest. The step is about 6-8 px across the line at 1080p (±3 px, measured on the 1280 and 960 px frames, since no 100 % crop of this line exists), on a line of about 38 px. By t=0.50s all three words share one baseline (frames/t0000.500s.jpg). Frame 0 is the feed and GitHub still, and this brief rates a baseline mismatch in the poster as a should-fix.  -> Fix one of three ways. (a) Make the subtitle's entrance finish before slice 1's in-point: start it about 0.3 s earlier in the hook source, or use a fade with no per-word rise. (b) Move slice 1's in-point another ~0.4 s later, but check P1 first, because that pushes the tail further into the exit wipe. (c) Waive it, and attach a settled poster (the t=0.50s state, or poster-0.7.jpg if it shows that state) as the cover wherever the platform takes one.

POLISH:
- P1 t=1.85-2.00s frames/t0001.900s.jpg (cuts.jpg row "cut 2.00", frames at 1.933s and 1.967s)  This may also come from the r2-S1 fix. Slice 1 starts later in the hook now, so its last ~0.15 s run into the hook's exit. "video" is half-masked, "Prompt in," is reduced to a sliver at about y 215 (1080p), and the window has begun its push. At 2.00s the full headline and the window snap back in paperback (frames/t0002.040s.jpg), so the first, most important look change reads "headline leaves, headline returns" rather than a clean restyle of the same frame. Slot 7 does the same at 13.90s (frames/t0013.900s.jpg).  -> End slices 1 and 7 about 0.15 s earlier in the source (before the exit wipe starts), or hold the settled hook to the cut.
- P2 t=5.00s frames/t0005.000s.jpg (and t=17.00s frames/t0017.000s.jpg)  This is pre-existing, not from the fixes, and I note it only because a stranger may see it. A demo cursor with a click ring sits at the frame's bottom edge, just right of and below the look pill (about x 424, y 1054 at 1080p), half outside the frame, before it travels to Generate at about 5.9s.  -> Start the cursor's path inside the window, above y 950, or keep it hidden until it is on its way to Generate.

DECLINED TO JUDGE (what I could not or chose not to assess):
- How the music sounds, whether it suits the looks, and whether it lands on the 2 s cuts. There is no beat data or mix report, and I cannot listen.
- Read-back: not run, because there is no narration. audio.txt notes that "the narration stem did not line up with this file's audio (another mix?)". Speech measures 0 % in every scene, and the goal (context/SHOWTIME.md) asks for a looks loop, not a voiced film, so I treat the silence as intended.
- Phone type sizes, reading times and UI zones: qa's phone check is PARTIAL (no project check report). The pixel values above are my own estimates on the pack frames, scaled to 1920x1080, ±3 px.
- Honesty: Northwind is a placeholder product on the reserved .example domain, and its copy ("Everything stays local", "Try it free", "Voiced and captioned") is sample text for that product, not a real-world claim. I raise no finding, as in rounds 1 and 2.
- Settled taste questions, not reopened: the CLI-style pill wording (r2-P1), the pill/card overlap at 7.9s/19.9s (r2-P2), the card read time (r2-P3) and cobalt's tight 1:1 label (r2-P4).

BEST POSTER FRAME: t=0.50s (frames/t0000.500s.jpg) because it has the settled headline, the subtitle on one baseline, the app window and the "01/12 --look nocturne" pill, so it sells both the product and the premise. Frame 0 is one subtitle-settle away from being that frame (S1).

PREVIOUS (one line per earlier blocker or should-fix, by its id):
- fixed r1-S1: the empty ink-blue frame 0 thumbnail. Frame 0 now shows the logo, "Prompt in, video out.", the subtitle and the app window (frames/t0000.000s.jpg, thumb-168x94.png).
- fixed r1-S2: the twelve-looks premise riding on an unreadable pill. The pill digits are about 38 px tall at 1080p (frames/text-0000.500s-2.png, frames/text-0003.000s-2.png), and together with the 2.00s restyle my cold pass placed every part. The plain-words premise line is a settled taste question (r2-P1).
- fixed r1-S3: "Everything stays local." being readable for only about 0.7 s. The headline is settled by 6.5s (qa/sheet-frames/t0006.500s.jpg) and holds to the 8.00s cut (frames/t0007.900s.jpg). It does the same at 18.5-20.0s (frames/t0019.900s.jpg).
- fixed r2-S1: the frame-0 headline caught mid-entrance ("out." about 75 % of "video"). On frames/text-0000.000s-1.png, "video out." is now one size on one baseline, matching t=0.50s. What is left is the subtitle line one row below, reported as the new S1.
