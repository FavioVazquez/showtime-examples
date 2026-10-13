# X-ray gallery media

The films, posters and live pages behind the [X-ray page](https://faviovazquez.github.io/showtime/xray/), and the
three figures of its touch shelf. The page's `site/content/xray.json` (in the showtime repository) lists them with
each receipt, clip credit and license.

- `<name>.mp4` and `<name>.jpg`: a finished X-ray film and its poster, ten in all: the typewriter four ways, the music
  box in a phone and a wide cut, the switch, the piano score, the guitar tab and the drum sheet. Every film passed
  `showtime xray verify`, and each card shows its receipt.
- `<name>-live.html`: the same film as its live page (`showtime export html <project> --interactive`), one offline file.
- `typewriter-through-dark-16x9-loop.mp4`: the silent loop the page's hero plays (`showtime footage trim --no-audio`).
- `typewriter-figure.html`, `computer-figure.html`, `heat-pump-figure.html` (with `.jpg` posters): living diagrams
  you touch (`showtime export html <project> --interactive`).

Files over 10 MB are release assets of `examples-media-v1` (`examples/MEDIA.json`).
