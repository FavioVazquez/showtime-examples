# The showtime brand stings

The two sting videos of the showtime brand (Curtain Call), made with showtime from the projects in the
showtime repository (`assets/brand/motion/source/`). The brand kit itself, with the logo, colours, fonts,
poster frame and sound logo, lives in the showtime repository under `assets/brand/` (see its `BRAND.md`).

| File | What it is | Where it lives |
|---|---|---|
| [`sting.mp4`](https://github.com/FavioVazquez/showtime-examples/releases/download/examples-media-v1/_brand--sting.mp4) | 1920x1080, 30 fps, 6 s, the curtain opens onto the logo, with the sound logo | release asset |
| [`sting-square.mp4`](https://github.com/FavioVazquez/showtime-examples/releases/download/examples-media-v1/_brand--sting-square.mp4) | 1080x1080, the same sting in a square layout | release asset |

Both are listed in [`../MEDIA.json`](../MEDIA.json) and published with the examples' media release
(`python3 scripts/publish_media.py --upload`). Every sound in them is synthesised by showtime's own effects
engine; there are no third-party samples.
