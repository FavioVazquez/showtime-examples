# Takes (packed transcripts)

Each line is one phrase: `[start-end wFirst-wLast] SPEAKER text`, times in seconds of that source file.
Phrases break at pauses >= 0.5 s or on a speaker change. `(laughter)` etc. are audio events.
Fillers (um, uh ...) are kept verbatim: they are edit points, not errors. Use word ids with
`showtime edit cut --remove w12-w18`, or copy times into EDL ranges (pad cuts 50-150 ms).

## GSFC_20180124_m12825_SarahJones  (source: GSFC_20180124_m12825_SarahJones.mp4, 69.0 s, 4 phrases, 0 fillers, 3 pauses >= 1.5 s, model sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8)
[007.39-027.18 w0-w56] S0 GOLD measures the upper atmosphere, which is directly affected by the sun and what we call space weather. Scientists are working to better be able to predict space weather because it directly affects the safety of our satellites, the health of our astronauts, and the technologies that we use every day in our life like GPS navigation.
[030.05-044.64 w57-w103] S0 GOLD will be sitting twenty two thousand miles above Earth, which means that it can see a whole half of the Earth, all of the Western Hemisphere. And it will be hovering over one particular point on Earth, watching the dynamics of the atmosphere play out below.
[047.92-059.55 w104-w145] S0 I am excited about this mission because GOLD will be getting information about the upper atmosphere much faster than ever before, and we'll be able to look at effects that are more like the weather that we experience down here on Earth.
[062.40-068.68 w146-w163] S0 The GOLD and ICON missions will give scientists the most comprehensive view we've ever had of the upper atmosphere.
