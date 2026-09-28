"""Write audio/mix.json from the cue table (cues.js) so every effect sits on its cut.
  python3 tools/make_mix.py            (trailer; the teaser project has its own copy)
"""
import json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
src = (ROOT / "cues.js").read_text()
body = src[src.index("var CUE = {") + 10: src.index("};") + 1]
cue = {}
for k, v in re.findall(r"(\w+):\s*([0-9.]+)\s*[,}]", body):
    cue[k] = float(v)
text = re.search(r"typeText:\s*'([^']*)'", body)
type_text = text.group(1).replace("\\n", "\n") if text else ""
cut = re.search(r"cut:\s*'(\w+)'", body).group(1)

tracks = [
    {"id": "bed", "kind": "music", "file": "audio/score.wav", "gain_db": 3, "section_gain": {"build": 2},
     "duck": {"under": "voice", "depth_db": 8, "carve": 0.4, "release": 0.9},
     # the final ring decays instead of stopping: 1.2 s when the score ends before the film (the trailer's
     # is composed 29.2 s long so its hit lands earlier), 0.8 s when it runs to the last frame
     "fade_out": 0.8},
    {"id": "voice", "kind": "voice", "file": "voice/vo.wav", "start": 0},
]
if cut == "trailer":
    tracks += [
        {"id": "wind", "kind": "ambience", "lib": "oga-space-winds", "start": 0, "end": 11.0,
         "fade_in": 0.05, "fade_out": 2.5, "gain_db": 2},
        # the wind that opened the trailer comes back under the title card and carries the ending out
        {"id": "wind-tail", "kind": "ambience", "lib": "oga-space-winds", "offset": 14.0, "start": cue["title"] + 0.6,
         "end": cue["duration"], "fade_in": 1.4, "fade_out": 1.6, "gain_db": -3},
        {"id": "braam-open", "kind": "sfx", "file": "audio/sfx/braam-open.wav", "at": 0.0, "align": "hit", "gain_db": -5},
        {"id": "boom-star", "kind": "sfx", "file": "audio/sfx/boom-star.wav", "at": cue["arrive"], "align": "hit", "gain_db": -3},
    ]
    # one soft typewriter key per character as it appears (F.typewriter shows char i at p*n >= i - 0.5)
    for i, ch in enumerate(type_text, start=1):
        if ch.isspace():
            continue
        t = cue["typeStart"] + (i - 0.5) / cue["typeCps"]
        tracks.append({"id": f"key{i}", "kind": "sfx", "file": f"audio/sfx/key-{i % 4 + 1}.wav",
                       "at": round(t, 4), "align": "hit", "gain_db": 6, "pan": 0.25})
else:
    tracks += [
        {"id": "braam-open", "kind": "sfx", "file": "audio/sfx/braam-open.wav", "at": 0.0, "align": "hit", "gain_db": -5},
    ]
drop = cue["drop"]
tracks += [
    {"id": "riser", "kind": "sfx", "file": "audio/sfx/riser.wav", "at": drop, "align": "hit", "gain_db": -2},
    {"id": "reverse-hit", "kind": "sfx", "file": "audio/sfx/reverse-hit.wav", "at": drop, "align": "hit", "gain_db": -2},
    {"id": "braam-drop", "kind": "sfx", "file": "audio/sfx/braam-drop.wav", "at": drop, "align": "hit", "gain_db": 3},
    {"id": "impact", "kind": "sfx", "file": "audio/sfx/impact.wav", "at": drop, "align": "hit", "gain_db": -5},
    {"id": "boom-title", "kind": "sfx", "file": "audio/sfx/boom-title.wav", "at": cue["title"], "align": "hit", "gain_db": -1},
]
# the bed also dips under the typewriter keys and the drop's braam, so both read
tracks[0]["duck"]["under"] = ["voice", "braam-drop"] + [t["id"] for t in tracks if t["id"].startswith("key")]
score_end = json.loads((ROOT / "audio" / "score.beats.json").read_text())["duration"]
if score_end < cue["duration"] - 0.1:
    tracks[0]["fade_out"] = 1.2
mix = {"duration": cue["duration"], "tracks": tracks, "master": {"lufs": -14, "true_peak": -1}}
(ROOT / "audio" / "mix.json").write_text(json.dumps(mix, indent=1, ensure_ascii=False) + "\n")
print(f"{cut}: {len(tracks)} tracks -> audio/mix.json")
