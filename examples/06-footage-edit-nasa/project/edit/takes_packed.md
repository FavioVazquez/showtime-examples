# Takes (packed transcripts)

Each line is one phrase: `[start-end wFirst-wLast] SPEAKER text`, times in seconds of that source file.
Phrases break at pauses >= 0.5 s or on a speaker change. `(laughter)` etc. are audio events.
Fillers (um, uh ...) are kept verbatim: they are edit points, not errors. Use word ids with
`showtime edit cut --remove w12-w18`, or copy times into EDL ranges (pad cuts 50-150 ms).

## koch-interview  (source: koch-interview.mp4, 81.0 s, 6 phrases, 0 fillers, 0 pauses >= 1.5 s, model large-v3-turbo)
[002.90-007.02 w0-w14] S0 I'm Christina Koch, I'm a mission specialist on the Artemis II mission to the moon.
[008.33-015.91 w15-w37] S0 When I first found out that I was assigned to Artemis II, my thoughts were disbelief, an immense sense of honor and responsibility,
[016.52-023.31 w38-w59] S0 and readiness. I'm ready to try to make everyone proud and to really fulfill what this mission truly means to all humanity.
[024.35-030.58 w60-w89] S0 For me, there's never really been a time when I didn't want to be an astronaut. Going back, as far as I can remember, it's what I always dreamed of.
[031.21-041.88 w90-w134] S0 I think the spark was really lit when I visited Kennedy Space Center with my family and came home with a bunch of posters that then went up on the walls of my bedroom and became the things that I dreamed of from then on.
[042.61-077.53 w135-w261] S0 When I think about the Artemis II crew, my first thought is that I am so privileged to be a part of it. These other astronauts have an amazing history, amazing record, amazing experience, and they're great people. I've known them all for many, many years. I've had a chance to work with them in different capacities, and I think our skills really complement each other. They all have a military background, and I come from a more raw, technical engineering background, and I think that that complements one another really well. I think we'll work together great, and I hope to be someone on the crew that really is that engineering expert, and I hope that that can be the way that I contribute the most.
