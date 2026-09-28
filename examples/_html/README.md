# HTML video demos

Two templates exported with `showtime export html --target artifact`, ready to open: double-click a
file, drag it into any current browser, or publish it as an HTML artifact. Each is one
self-contained page that makes no network request.

| File | Made from | Sound |
|---|---|---|
| `film.html` | `templates/film` (a 12 s canvas film) | the procedural score, rendered live in the browser (`--audio score`) |
| `launch.html` | `templates/dom` (a 15 s launch video: DOM components, shader transitions) | the rendered mix, embedded as AAC 96k (`--audio embed`) |

Before playing, a start screen shows the poster frame with the title in the film's own font and a
Play button with the length (browsers need one click or tap before they play sound). The launch
poster is its hook frame, which already states the claim, so only the Play row sits over it
(`"startTitle": false` in its showtime.json). On a phone
held upright the picture runs full width with the chapters listed under it and the controls at the
bottom. Keys: Space or K play/pause, J/L -/+5 s, Left/Right 1 s (Shift: one frame), 1-9 chapters,
F fullscreen, M mute, ? all keys. The ticks on the scrubber are the chapters.

Rebuild them from the repository root:

```
skills/showtime/bin/showtime export html skills/showtime/templates/film --target artifact -o examples/_html/film.html
skills/showtime/bin/showtime export html skills/showtime/templates/dom --target artifact -o examples/_html/launch.html
```

(`showtime export` never overwrites: delete the old file first, or it writes `film-2.html`.)
How it works, the audio modes, the size budget and the limitations: `skills/showtime/references/html-export.md`.
