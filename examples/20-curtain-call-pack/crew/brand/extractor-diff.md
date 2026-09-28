# brand init --from <repo> vs the canonical kit (assets/brand/brand.json)

The extractor did not look at `assets/brand/brand.json` (the repo's own confirmed kit) and scanned the example
projects instead, so the draft describes other videos, not showtime:

| field | extractor draft | canonical kit | verdict |
|---|---|---|---|
| bg | #f6f8f8 (examples/01 Tidepool) | #15100E Stage | wrong source |
| ink | #0f1e22 (examples/01) | #F5EBDC House cream | wrong source |
| accent | #0e8a8c (Tidepool teal) | #E9B949 Spotlight gold | wrong source |
| accent2 | none | #B3121F Velvet | missed |
| logo | examples/05-short-vertical/project/media/logo.svg | logo/mark.svg (+ mark-hero, lockups) | wrong file; canonical listed only as the 7th candidate |
| display font | Inter | Fraunces 900 | wrong |
| tagline | a README sentence about no cloud services | "Describe a video. Claude directs. Your machine renders." | wrong |
| 16 colours | 9 of them are chart colours from examples/12 | 10 named brand colours | noise |

Decision: the pack uses the canonical kit via `SHOWTIME_BRAND=<repo>/assets/brand/brand.json` (copied here as
brand.json). Logged as friction: `brand init --from` should prefer an existing brand.json / BRAND.md in the repo
and skip `examples/`.
