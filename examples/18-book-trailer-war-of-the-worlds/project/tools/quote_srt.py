"""Caption cues for the two spoken quotes, broken at the book's own phrase boundaries (not at a word cap).
Times come from the voice's word timings (voice/vo.words.json): a cue starts 0.12 s before its first word
and ends 0.5 s after its last one (or where the next cue starts). Words are checked against the timings,
so a cue can never drift from the voice or change a word.
  python3 tools/quote_srt.py [voice/vo.words.json] [out.srt]
"""
import json, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
words_file = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "voice" / "vo.words.json"
out = Path(sys.argv[2]) if len(sys.argv) > 2 else ROOT / "voice" / "quotes.srt"
CUES = json.loads((ROOT / "voice" / "cue-lines.json").read_text())   # [[line, line?], ...]

words = [w for w in json.loads(words_file.read_text())["words"] if w.get("type", "word") == "word"]
i, cues = 0, []
for lines in CUES:
    n = sum(len(l.split()) for l in lines)
    chunk = words[i:i + n]
    got = " ".join(w["text"] for w in chunk)
    want = " ".join(lines)
    if got != want:
        sys.exit(f"cue text does not match the voice: {want!r} vs {got!r}")
    cues.append([chunk[0]["start"] - 0.12, chunk[-1]["end"] + 0.5, lines])
    i += n
if i != len(words):
    sys.exit(f"{len(words) - i} spoken words have no cue")
for a, b in zip(cues, cues[1:]):
    a[1] = min(a[1], b[0])
# nothing is captioned into the dip before the title card (CUE.dipAt in cues.js)
import re
_dip = re.search(r"dipAt:\s*([0-9.]+)", (ROOT / "cues.js").read_text())
if _dip:
    cues[-1][1] = min(cues[-1][1], float(_dip.group(1)))


def ts(t):
    t = max(0.0, t)
    return f"{int(t // 3600):02}:{int(t % 3600 // 60):02}:{int(t % 60):02},{int(round(t % 1 * 1000)):03}"


out.write_text("\n".join(f"{k}\n{ts(a)} --> {ts(b)}\n" + "\n".join(lines) + "\n" for k, (a, b, lines) in enumerate(cues, 1)))
print(f"{len(cues)} cues -> {out}")
