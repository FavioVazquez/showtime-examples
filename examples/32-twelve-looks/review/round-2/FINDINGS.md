VERDICT: ship after fixes  -- all three round-1 should-fixes are fixed. The S1 fix introduced one cheap new should-fix: frame 0 now lands on the headline mid-entrance, so "out." is about 25 % smaller than "video". Nothing else broke: no flashes or double exposures at any of the 11 cuts, and the sound is unchanged and clean.
WOULD I POST THIS: yes  -- at full size it reads as a finished, deliberate 24 s loop: crisp type, twelve clearly different looks and a legible counter. The frame-0 type glitch is visible only as a still poster, and it is a one-line fix.

FIRST VIEWER (one line per part of story.txt; no narration exists, so judged from the on-screen text, the frames and the contact sheet; every "no" is also listed below):
- part 1 (0.00-2.00s) frames/t0001.000s.jpg: yes  -- "Prompt in, video out. Voiced and captioned." beside an app window says what Northwind does. The pill "01/12 --look nocturne" is now legible at full size: the digits are about 38 px tall (frames/text-0001.000s-2.png). It says this is look 1 of 12.
- part 2 (2.00-4.00s) frames/t0003.000s.jpg: yes  -- the same hero comes back restyled at the 2.00s cut (frames/t0002.040s.jpg), and the counter moves to 02/12. A stranger gets "same video, new look" here. Then the camera pushes into the app at "01 Describe".
- part 3 (4.00-6.00s) frames/t0005.000s.jpg: yes  -- the prompt is typed. The step list (01 Describe / 02 Generate / 03 Export) works as a roadmap with the current step lit, and it ties back to "Prompt in".
- part 4 (6.00-8.00s) frames/t0007.000s.jpg: yes  -- "Draft ready" shows the result, then "Everything stays local." with the three cards. The card titles ("Voice and captions") pick up "Voiced and captioned" from the opening.
- part 5 (8.00-10.00s) frames/t0009.000s.jpg: yes  -- "One sentence. Every format." with the 16:9, 9:16 and 1:1 outputs is the payoff of "video out".
- part 6 (10.00-12.00s) frames/t0011.000s.jpg: yes  -- the logo resolve with "Try it free / northwind.example" (frames/t0011.900s.jpg) closes the first pass of the film.
- part 7 (12.00-14.00s) frames/t0013.000s.jpg: yes  -- the film restarts at the hook, but the counter continues to 07/12. With the pill now readable, it reads as the next look, not a loop or a glitch.
- part 8 (14.00-16.00s) frames/t0015.000s.jpg: yes  -- the describe beat again, in blush. It parallels part 2, which makes the comparison easy.
- part 9 (16.00-18.00s) frames/t0017.000s.jpg: yes  -- typing and generate, in evergreen. It parallels part 3.
- part 10 (18.00-20.00s) frames/t0019.000s.jpg: yes  -- export, then the local beat, in skyline. The beat now holds long enough to read (see r1-S3).
- part 11 (20.00-22.00s) frames/t0021.000s.jpg: yes  -- the formats payoff, in cobalt.
- part 12 (22.00-24.00s) frames/t0023.000s.jpg: yes  -- the end card with CTA and URL (frames/t0023.967s.jpg) at 12/12 is a clear ending.

HEARING (one line per check; audio.txt + hearing.png, music-only mix, transcript.txt has no narration):
- voice over music: ok  -- no narration. Speech is 0 % in all 12 scenes and no voice timeline or caption file exists, so nothing can be masked.
- pace: ok  -- no voice lines, so there are no words per minute to judge.
- silence: ok  -- "Near silence mid-video: (none)" and "Pauses longer than 2 s: (none)". The bed runs at -12.6 to -15.8 LUFS per scene after the -18.0 LUFS intro.
- level at cuts: ok  -- the largest jumps are +3.5 LU at 2.00s (-18.2 -> -14.7 LUFS: the music lifts out of its intro on the first look change) and +3.1 LU at 22.00s (-14.8 -> -11.7: the lift into the end card). The story calls for both. Every other cut is within 1.7 LU.
- effects: ok  -- no effects in the mix report, so nothing can be early, late or buried.
- ending: ok  -- the last 0.2 s are at -46 LUFS against -14 LUFS in the 3 s before. hearing.png shows the fade from about 23.4s ending with the picture, so no music is cut off.
- peaks: ok  -- true peak -1.2 dBTP (ceiling -1), sample peak -1.3 dBFS, no clipped runs. Integrated -14.3 LUFS (target -14).
- read-back: not run  -- there is no narration to transcribe (see DECLINED TO JUDGE).
- heard on a phone: ok  -- -17.9 LUFS above 300 Hz, 3.6 LU under the mix (5.0 LU above 1 kHz). That is inside the 1-8 LU of posted films.

WHAT WORKS (max 3, so it is kept):
- Frame 0 is now a real poster. At feed size (thumb-168x94.png) it shows the logo, "Prompt in, video out." and the app window, not an empty dark ground (frames/t0000.000s.jpg).
- The look pill is now readable. The digits are about 38 px and "--look nocturne" about 30 px tall at 1080p (frames/text-0001.000s-2.png, frames/text-0001.500s-2.png), up from 26/21 px. Together with the restyle at 2.00s (frames/t0002.040s.jpg), the twelve-looks premise reads without a word of narration.
- The beat timing is better. "Everything stays local." is settled by 6.5s (qa/sheet-frames/t0006.500s.jpg) and holds to the 8.00s cut. The redline hook at 12.04s now opens on a settled headline (frames/t0012.040s.jpg), where round 1 showed only letter slivers. The iris cuts at 10.00s and 22.00s stay clean (cuts.jpg).

BLOCKERS:
- none

SHOULD-FIX:
- S1 t=0.00s frames/t0000.000s.jpg, frames/text-0000.000s-1.png  This is new: the r1-S1 fix broke it. Frame 0 (the feed and GitHub still) catches the hook headline mid-entrance. On the 100 % crop, "out." has an x-height of about 42 px against about 57 px for "video" (about 75 % size), and it sits about 2 px below the baseline of "video". "Voiced and captioned." is not there yet. By 0.50s both words match (frames/text-0000.500s-1.png). A size mismatch in the poster's title line is a should-fix by this brief's rule.  -> Start slice 1 about 0.5 s into the hook source, so frame 0 equals the settled state at frames/t0000.500s.jpg. Or make the headline's first frame fully set (fade only, no scale). Also attach poster-1.2.jpg as the cover wherever the platform takes one.

POLISH:
- P1 t=0.00-2.00s frames/t0001.500s.jpg  The premise is still carried only by "01/12 --look nocturne", which is CLI syntax that names no tool. Round 1 suggested a plain-words line ("One project · 12 looks"), and it was not added. My cold pass placed every part anyway (the counter plus the 2.00s restyle), so this is no longer a should-fix.  -> Add "One project · 12 looks" to the pill for 0.0-2.0s, or say it in the post text.
- P2 t=7.90s frames/t0007.900s.jpg (and t=19.90s frames/t0019.900s.jpg)  The enlarged pill (about x 56-695, y 950-1032 at 1920x1080) still covers the bottom-left corner of the "Script to cut" card (card bottom about y 972). Its right end now meets the left border of the highlighted "Voice and captions" card at about x 693.  -> For this beat, lift the card row about 60 px (card bottoms at y 912 or less), or end the pill before x 670.
- P3 t=7.00-8.00s frames/t0007.000s.jpg (and t=19.00-20.00s frames/t0019.000s.jpg)  The headline holds about 1.5 s, but the three cards finish building only at about 7.0s/19.0s. That leaves about 1.0 s for roughly 14 words of card copy.  -> Speed up the card stagger by 0.3 s, or accept that the cards are read on the second pass.
- P4 t=21.00s frames/t0021.000s.jpg (and t=20.04s frames/t0020.040s.jpg)  In cobalt's wide face, "Northwind" in the 1:1 card nearly fills the card's width. The margins are about 4-5 px at 1920 px (card about x 1600-1851, word about x 1605-1847). The word looks jammed against the edges, and in the other looks it has room.  -> Set the 1:1 card label about 85 % size in that look, or give the card 24 px side padding.

DECLINED TO JUDGE (what you could not or chose not to assess):
- How the music sounds, whether it fits the looks, and whether it lands on the 2 s cuts. There is no beat data or mix report, and I cannot listen.
- Read-back: not run (no narration). audio.txt notes that "the narration stem did not line up with this file's audio". Speech is 0 % in every scene, so the voice is either meant to be absent or missing. The numbers cannot tell which.
- Phone type sizes, reading times and UI zones: qa's phone check is PARTIAL (no project check report). The pixel sizes above are my own measurements on the frames.
- Honesty: Northwind is a placeholder on the reserved .example domain, and its copy ("Everything stays local", "Try it free") is sample text for that product. As in round 1, I raise no finding. If it is posted outside a showtime context, a "sample project" note in the post would remove any doubt.
- Pixel values come from the frames in this pack as displayed to me, scaled back to 1920x1080. Treat them as about ±3 px.

BEST POSTER FRAME: t=1.50s (frames/t0001.500s.jpg) because it has the settled headline, "Voiced and captioned.", the app window and the "01/12 --look nocturne" pill, so it sells both the product and the premise. Frame 0 is close but not that frame, because of S1. poster-1.2.jpg, which the job already made, is the same state.

PREVIOUS (one line per earlier blocker or should-fix, by its id):
- fixed r1-S1: frame 0 as the feed thumbnail was an empty ink-blue ground. It now shows the logo, "Prompt in, video out." and the app window (frames/t0000.000s.jpg, thumb-168x94.png). The fix left the mid-entrance headline reported as the new S1.
- fixed r1-S2: the twelve-looks premise rode on an unreadable 26/21 px pill. The pill text is now about 38/30 px at 1080p (frames/text-0001.000s-2.png, frames/text-0001.500s-2.png), just under the 40 px asked, and my cold pass read the premise from it. The plain-words premise line was not added; it is carried as Polish P1.
- fixed r1-S3: "Everything stays local." was readable for about 0.7 s. The headline is now settled by 6.5s/18.5s (qa/sheet-frames/t0006.500s.jpg, qa/sheet-frames/t0018.500s.jpg) and holds to the 8.00s/20.00s cuts (frames/t0007.900s.jpg, frames/t0019.900s.jpg), about 1.5 s, which meets the 1.3 s asked. The cards' shorter hold is Polish P3.
