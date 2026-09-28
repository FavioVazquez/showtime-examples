"""Make the 9:16 (Reels) project next to this one: same page, media and mix; only the frame size differs.

The page re-lays itself out for tall frames (@container blocks + data-pos-tall + the map script), so the
vertical cut is a native re-layout, not a crop. Run after every edit to index.html or audio/mix.json:

    python tools/make_vertical.py            # writes ../project-916 (or pass a folder)
"""
import json
import shutil
import sys
from pathlib import Path

src = Path(__file__).resolve().parent.parent
dst = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else src.parent / (src.name + "-916")
dst.mkdir(parents=True, exist_ok=True)
for name in ("index.html",):
    shutil.copy2(src / name, dst / name)
for folder in ("media", "audio"):
    if (dst / folder).exists():
        shutil.rmtree(dst / folder)
    shutil.copytree(src / folder, dst / folder)
cfg = json.loads((src / "showtime.json").read_text(encoding="utf-8"))
cfg.update({"title": cfg.get("title", "video") + " (9x16)", "width": 1080, "height": 1920})
(dst / "showtime.json").write_text(json.dumps(cfg, indent=2) + "\n", encoding="utf-8")
print(dst)
