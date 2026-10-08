"""The 12-up contact sheet: the same frame (1.9 s, the poster) of the same dom project in each look signature,
labelled with the look's id, its type pair and ground (from `showtime signature list`)."""
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

LOOKS = [("nocturne", "Fraunces + Inter", "dark"), ("paperback", "Fraunces + IBM Plex Sans", "light"),
         ("tidewater", "Space Grotesk + Inter", "dark"), ("gallery", "Bebas Neue + Inter", "light"),
         ("graphite", "Geist", "dark"), ("sage", "Bricolage Grotesque + Inter", "light"),
         ("redline", "Anton + Inter", "dark"), ("blush", "Instrument Serif + Geist", "light"),
         ("evergreen", "Instrument Serif + IBM Plex Sans", "dark"), ("skyline", "Space Grotesk + IBM Plex Sans", "light"),
         ("cobalt", "Unbounded + Space Grotesk", "dark"), ("oxblood", "Bricolage Grotesque + Inter", "dark")]
FONTS = Path.home() / ".showtime/assets/fonts"


def main(stills: Path, out: Path, cols: int = 4, tw: int = 640) -> None:
    th = tw * 9 // 16
    gap, cap, margin = 16, 58, 32
    rows = (len(LOOKS) + cols - 1) // cols
    W = margin * 2 + cols * tw + (cols - 1) * gap
    H = margin * 2 + rows * (th + cap) + (rows - 1) * gap
    sheet = Image.new("RGB", (W, H), (17, 18, 22))
    d = ImageDraw.Draw(sheet)
    f1 = ImageFont.truetype(str(FONTS / "jetbrains-mono/jetbrains-mono-latin-700-normal.ttf"), 24)
    f2 = ImageFont.truetype(str(FONTS / "inter/inter-latin-400-normal.ttf"), 20)
    for i, (look, pair, ground) in enumerate(LOOKS):
        r, c = divmod(i, cols)
        x = margin + c * (tw + gap)
        y = margin + r * (th + cap + gap)
        im = Image.open(stills / (look + ".png")).convert("RGB").resize((tw, th), Image.LANCZOS)
        sheet.paste(im, (x, y))
        d.text((x, y + th + 10), "--look %s" % look, font=f1, fill=(240, 238, 232))
        d.text((x + tw, y + th + 14), "%s, %s" % (pair, ground), font=f2, fill=(160, 158, 152), anchor="ra")
    sheet.save(out, quality=90)
    print(out, sheet.size)


if __name__ == "__main__":
    main(Path(sys.argv[1]), Path(sys.argv[2]))
