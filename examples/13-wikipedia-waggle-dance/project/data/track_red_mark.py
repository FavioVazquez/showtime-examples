"""Measure the red-marked dancer's position in the bee footage, every 0.1 s.

How data/dance-track.js was made (run from the project folder, with showtime's Python, which has numpy
and Pillow):

    showtime snap media/dance.webm --at 0.017,0.117,...,11.517 -o track      # 116 stills, one per 0.1 s
    python data/track_red_mark.py track > data/dance-track.json

The dancer carries a red paint mark on her thorax; a pixel counts as "mark" when it is strongly red
(R > 170, G < 90, B < 90, R - G > 110). The position is the median of those pixels; frames with fewer
than 15 such pixels (the mark hidden or blurred, mostly during the waggle run) are left out, and the
page interpolates across them. Coordinates are the clip's stored pixels (720x480, shown at 4:3).
"""
import glob
import json
import re
import sys

import numpy as np
from PIL import Image


def main(folder):
    out = []
    for f in sorted(glob.glob(f"{folder}/t*.png")):
        t = float(re.search(r"t([\d.]+)s", f).group(1))
        a = np.asarray(Image.open(f).convert("RGB")).astype(int)
        r, g, b = a[..., 0], a[..., 1], a[..., 2]
        m = (r > 170) & (g < 90) & (b < 90) & (r - g > 110)
        if m.sum() < 15:
            continue
        ys, xs = np.nonzero(m)
        out.append([round(t - 0.017, 3), round(float(np.median(xs)), 1), round(float(np.median(ys)), 1)])
    json.dump(out, sys.stdout)


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "track")
