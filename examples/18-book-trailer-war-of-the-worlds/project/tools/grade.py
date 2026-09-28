"""Grade the Corrêa scans into one duotone family (dark stage -> warm paper) . Deterministic; run once:
  ~/.showtime/venv/bin/python tools/grade.py
"""
from pathlib import Path
from PIL import Image, ImageOps
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "media"
OUT = ROOT / "media"
OUT.mkdir(exist_ok=True)
SH = np.array([13, 10, 8], float)      # stage
HI = np.array([238, 226, 203], float)   # warm paper


def duotone(im, gamma=1.18, lift=0.0):
    g = np.asarray(ImageOps.autocontrast(im.convert("L"), cutoff=0.4), float) / 255.0
    g = np.clip(g, 0, 1) ** gamma
    g = lift + (1 - lift) * g
    rgb = SH + (HI - SH) * g[..., None]
    return Image.fromarray(rgb.clip(0, 255).astype("uint8"), "RGB")


for name, out in [("81894077", "launch"), ("81894106", "emerges"), ("81894182", "machine")]:
    im = Image.open(SRC / f"{name}.jpg")
    graded = duotone(im)
    graded.save(OUT / f"{out}.jpg", quality=90)
    print(out, graded.size)

# Mars: keep NASA's colour; only a web-sized copy (the orig is 6736 px)
mars = Image.open(SRC / "PIA00003~orig.jpg").convert("RGB")
mars.resize((mars.width // 2, mars.height // 2), Image.LANCZOS).save(OUT / "mars.jpg", quality=90)
print("mars", mars.width // 2, mars.height // 2)
