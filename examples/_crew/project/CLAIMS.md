# showtime crew film: brief and on-screen claims with sources

Brief: a 45 s motion-graphics film (16:9 master, 1:1 and 9:16 cuts from the same page) that shows showtime's crew
at work. No voice-over; the type carries it. Premium, calm, readable on a phone. Every camera move needs a reason.
Music: "Artemis" by Scott Buckley (CC BY 4.0), excerpt 35.5-80.5 s; its big entry (73.5 s) lands on the name (38.0 s).
Repo = github.com/FavioVazquez/showtime (v0.2.0).

| time | on screen | source |
|---|---|---|
| 0-3.7 | "Your agent is the director." | skills/showtime/references/crew.md ("You are the director."), README "Meet the crew" ("Your agent is the director.") |
| 3.7-11.8 | "It writes a brief." + a TASK.md card: `# motion-designer: build scene s3`, `Read:`, `Inputs (read-only):`, `You own:`, `Deliver:`, `Done when:`, `Heavy commands allowed:` | field names from the TASK.md skeleton in references/crew.md section 3; example values from crew.md (`crew/motion-s3/`) and references/crew/motion-designer.md (fragment files section.html, s-<sid>.css, s-<sid>.js; done when check reports 0 errors; single `snap --at` frames). The values are an example, not a saved run. |
| 6.9-11.8 | beats "What to deliver." / "What to read." / "What it may touch." | the same fields |
| 11.8-15 | "One member works alone." the brief travels from "your agent / director" to "motion designer" | crew.md; crew/rules.md ("You have no user", "One writer per file", "No sub-agents") |
| 15-18.2 | "It hands back RESULT.md and its files." + STATUS / OUTPUTS / EVIDENCE card | crew/rules.md section 4 (return contract, saved as RESULT.md); example values |
| 18.2-20.4 | "Ten roles." ten tiles in README cast order | agents/*.md (10 files), crew.md roster |
| 20.4-23.6 | "They never talk to each other, or to you." | README crew handoff diagram alt text: "Members never talk to each other or to you." |
| 23.6-25.7 | "The critic didn't build it." critic highlighted | examples/13-wikipedia-waggle-dance/README.md: "independent critic ... a separate critic pass, not a self-review" |
| 25.7-35 | "It reviews the frames." Example 13 frame at 0:04.60 before (final-2) and after (shipped final): caption "Her path, traced frame by frame" struck, "BLOCKER: The gold line is mostly camera motion, not her path." then "Her red paint mark, tracked" / "(the camera moves with her)" + FIXED | examples/13 README review table, finding 1 (Blocker), and review/after-critic/compare-en.jpg. Frames: waggle-dance final-2.mp4 (before) and examples/13 final.mp4 (after), both at 4.60 s, footage card cropped. Bee footage Su et al. 2008, PLOS ONE, CC BY 3.0 (credited on the frame and the end card). Note: in example 13 the fix was applied by the director; the film does not say who fixed it. |
| 35-38 | "Fixes go back to the same member." | crew.md section 1 ("Follow-ups go to the same member") and pattern E; README diagram ("fixes go back to the same member") |
| 38-45 | mark, "showtime", "Your agent directs. Your machine renders.", github.com/FavioVazquez/showtime, credits | assets/brand; the tagline as given in the brief |

Not claimed: that the crew made the 22 examples (they ran roles inline), speed, counts beyond "ten roles".
