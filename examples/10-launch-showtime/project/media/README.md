# media/ (not committed)

The page plays six finished renders from the other examples. They are not copied into this folder
in the repository (about 81 MB). Before previewing or rendering this project, copy them in:

```bash
cd examples/10-launch-showtime/project
cp ../../01-launch-tidepool/final.mp4     media/ex01.mp4
cp ../../02-explainer-heat-pump/final.mp4 media/ex02.mp4
cp ../../05-short-vertical/final.mp4      media/ex05.mp4
cp ../../06-footage-edit-nasa/final.mp4   media/ex06.mp4
cp ../../07-data-story/final.mp4          media/ex07.mp4
cp ../../08-beat-montage/final.mp4        media/ex08.mp4
```

The voice lines (`voice/lines/*.wav`, referenced by `audio/mix.json`) are not committed either:
`showtime voice script narration.md -o voice --fit 25.5` rebuilds them (same text, voice and speed).
