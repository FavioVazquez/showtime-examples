"""Rebuild the large files this example does not ship (pictures, fonts, music, effects, voice), then
render with `showtime render <project>`. Runs the same showtime commands the example used, in order.
  python tools/restore.py [path/to/showtime]      (default: `showtime` on PATH)
Works on macOS, Windows and Linux (arg-list subprocess, pathlib).
"""
import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ST = sys.argv[1] if len(sys.argv) > 1 else (shutil.which("showtime") or "showtime")
CUT = re.search(r"cut:\s*'(\w+)'", (ROOT / "cues.js").read_text()).group(1)


def st(*args, cwd=ROOT):
    print("showtime", " ".join(args))
    subprocess.run([sys.executable, ST, *args] if ST.endswith(".py") else [ST, *args], cwd=cwd, check=True)


# pictures: 3 Correa drawings (Wikimedia Commons, public domain) + NASA/JPL/USGS PIA00003; then the grade
for mid in ["commons:81894077", "commons:81894106", "commons:81894182"]:
    st("assets", "media", "fetch", mid, "--project", ".")
st("assets", "media", "fetch", "nasa:PIA00003", "--quality", "orig", "--project", ".")
subprocess.run([sys.executable, str(ROOT / "tools" / "grade.py")], check=True)
# fonts (OFL-1.1 / Apache-2.0), copied into fonts/
st("assets", "font", "Cinzel", "--weights", "400,700,900", "--copy-to", "fonts")
st("assets", "font", "Special Elite", "--weights", "400", "--copy-to", "fonts")
# music: epic-trailer in C minor, sections on the cuts, no built-in effects (they are placed in the mix).
# The trailer's score is composed 29.2 s long: the final hit falls about 3 s before the end, so a 29.2 s
# score puts it at 25.714 s (two bars after the drop) and the title card holds 4.3 s; the mix fades the
# ring out and the wind carries the last 0.8 s.
sections = "0:intro,10:build,20:drop" if CUT == "trailer" else "0:intro,5.7:build,8.6:drop"
st("audio", "compose", "--style", "epic-trailer", "--key", "Cm", "--dur", "29.2" if CUT == "trailer" else "15",
   "--sections", sections, "--no-sfx", "-o", "audio/score.wav")
# effects
sfx = [("braam", ["--key", "C", "--intensity", "1.0", "--seed", "1"], "braam-drop"),
       ("braam", ["--key", "C", "--intensity", "0.55", "--seed", "2"], "braam-open"),
       ("riser", ["--key", "C", "--dur", "4"], "riser"), ("reverse-hit", [], "reverse-hit"),
       ("impact", ["--key", "C", "--intensity", "0.9"], "impact"),
       ("boom", ["--seed", "2", "--intensity", "1"], "boom-title")]
if CUT == "trailer":
    sfx += [("boom", ["--seed", "1"], "boom-star")]
for kind, extra, name in sfx:
    st("audio", "sfx", kind, *extra, "-o", f"audio/sfx/{name}.wav")
if CUT == "trailer":
    st("audio", "sfx", "keyclick", "--variants", "4", "-o", "audio/sfx/key.wav")
# voice (bm_george) and the caption cues
st("voice", "script", "narration.md", "-o", "voice")
subprocess.run([sys.executable, str(ROOT / "tools" / "make_mix.py")], check=True)
subprocess.run([sys.executable, str(ROOT / "tools" / "quote_srt.py")], check=True)
print("restored; next: showtime check . && showtime render .")
