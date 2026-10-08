"""One transparent 1920x1080 PNG per look: a small pill with the look's name, bottom left, for the loop's
overlays (edit/loop.json). JetBrains Mono (SIL OFL 1.1), from the fonts showtime installs."""
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ORDER = ["nocturne", "paperback", "tidewater", "gallery", "graphite", "sage",
         "redline", "blush", "evergreen", "skyline", "cobalt", "oxblood"]
FONT = Path.home() / ".showtime/assets/fonts/jetbrains-mono/jetbrains-mono-latin-500-normal.ttf"


def label(i: int, name: str, out: Path) -> None:
    im = Image.new("RGBA", (1920, 1080), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    f = ImageFont.truetype(str(FONT), 46)
    text = "%02d/12  --look %s" % (i, name)
    l, t, r, b = d.textbbox((0, 0), text, font=f)
    pad_x, pad_y, x0, y1 = 30, 18, 56, 1080 - 48
    box = (x0, y1 - (b - t) - 2 * pad_y, x0 + (r - l) + 2 * pad_x, y1)
    d.rounded_rectangle(box, radius=(box[3] - box[1]) // 2, fill=(12, 12, 14, 232))
    d.text((box[0] + pad_x - l, box[1] + pad_y - t), text, font=f, fill=(246, 244, 240, 255))
    im.save(out)


if __name__ == "__main__":
    out = Path(sys.argv[1])
    out.mkdir(parents=True, exist_ok=True)
    for i, name in enumerate(ORDER, 1):
        label(i, name, out / ("%02d-%s.png" % (i, name)))
    print("wrote %d labels to %s" % (len(ORDER), out))
