# Voice-director notes: French narration (ff_siwis)

Done inline by the director from `references/crew/voice-director.md` (no sub-agent tool in this session).

- Voice: `ff_siwis` (Kokoro French, grade B-), speed 1.0, no `--fit`: the French read runs 62.2 s (the English 58 s),
  and the film re-times itself from `voice cues` (64.2 s with the end card).
- Names: `showtime voice ipa "Karl von Frisch" --lang fr` gave "vɔ̃" (French "vont") for *von*: lexicon
  `von -> fɔn`, `Frisch -> fʁiʃ` (project/lexicon.json, per language). The Latin species name stays on screen only;
  the narration says « abeille italienne ».
- Round trip: `showtime transcribe project/voice/vo.wav --language fr` returned every line as written except
  « colauréat du prix Nobel », heard as « coloré à du prix Nobel ». Rewritten as « qui a partagé le prix Nobel 1973 »
  (same fact, easier to say); the second pass is clean ("Karl von Frisch" is recognised).
- Numbers are spelled for the ear (« quarante-cinq degrés », « une dizaine de mètres »), and the transcript maps them
  back to 45 and 40, so the voice says the figures the screen shows.
- Caveat: the translation is machine-made (by Claude) and has not been read by a native speaker.
