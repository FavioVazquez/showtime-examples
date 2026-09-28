<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/FavioVazquez/showtime/raw/main/assets/readme/marquee-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://github.com/FavioVazquez/showtime/raw/main/assets/readme/marquee-light.svg">
    <img alt="Now showing: 22 examples, every frame rendered by showtime." src="https://github.com/FavioVazquez/showtime/raw/main/assets/readme/marquee-light.svg" width="100%">
  </picture>
</p>

# showtime examples

Twenty-two finished videos made with [showtime](https://github.com/FavioVazquez/showtime), the local video
studio for Claude Code, plus its launch film. Each one was made by an agent acting as a user, from a single
request. Every folder keeps the project sources, the share copy and a README that tells the story: the
request, the assumptions, the commands, what the critic found and what changed.

**[Open the gallery](examples/README.md)** to browse them by use case, or watch them all play on the
[showtime site](https://faviovazquez.github.io/showtime/gallery.html). To make your own, install the plugin:
the [quick start](https://github.com/FavioVazquez/showtime#quick-start) takes two commands in Claude Code.

## What is here

| Path | What it is |
|---|---|
| [`examples/`](examples/README.md) | the 22 examples, one folder each (`01-launch-tidepool` to `22-manim-circle-area`), and the gallery |
| [`examples/_launch/`](examples/_launch/README.md) | the 40-second launch film: its teaser loop, poster and credits |
| [`examples/_apps/tidepool/`](examples/_apps/tidepool/README.md) | Tidepool, the fictional notes app several examples record |
| [`examples/_html/`](examples/_html/README.md) | two templates exported as self-contained HTML videos |
| [`examples/MEDIA.json`](examples/MEDIA.json) | the videos that are release assets instead of files in git |
| [`scripts/publish_media.py`](scripts/publish_media.py) | checks, lists and uploads those release assets |

## The full-quality videos

Git keeps the posters, captions, share copy, project sources and every video up to 10 MB. Any file over
10 MB and every ProRes `.mov` is an asset of this repository's release
[`examples-media-v1`](https://github.com/FavioVazquez/showtime-examples/releases/tag/examples-media-v1),
listed in [`examples/MEDIA.json`](examples/MEDIA.json) with its size and SHA-256, and kept out of git by
the managed block at the end of [`.gitignore`](.gitignore). The gallery and each example's README link
straight to those files.

```bash
python3 scripts/publish_media.py                        # verify the manifest and .gitignore against the files
python3 scripts/publish_media.py --links --example 20   # markdown links to one example's release assets
python3 scripts/publish_media.py --refresh              # after adding or re-rendering media
python3 scripts/publish_media.py --upload               # upload them (needs gh and the release tag)
```

## Rebuilding an example

Each example's `project/` folder (or episode folder) is a showtime project, and its README lists the
commands in order. Install [showtime](https://github.com/FavioVazquez/showtime#quick-start) first; the
commands are documented in its [guides](https://github.com/FavioVazquez/showtime/blob/main/docs/README.md).

## Licenses and credits

The code and text written for these examples are MIT licensed ([LICENSE](LICENSE)), like showtime itself.
Third-party material keeps its own license: each example credits its sources in its folder
(`credits.txt`, and its README), and example 13 is CC BY-SA 4.0 like the Wikipedia article it adapts
([its license](examples/13-wikipedia-waggle-dance/LICENSE.txt)). The launch film's music is "With These
Hands" by Scott Buckley, CC BY 4.0; under the composer's terms it ships only inside the film, never as a
separate audio file ([credits](examples/_launch/credits.txt)).

Changes and issues about showtime itself belong in the
[showtime repository](https://github.com/FavioVazquez/showtime/issues).
