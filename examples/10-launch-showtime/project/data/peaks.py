# Peak envelopes of real audio files, for the waveform strips drawn in the video (writes data/peaks.json).
# Run from the job folder with showtime's Python: ~/.showtime/venv/bin/python project/data/peaks.py
# after: showtime audio mix examples/01-launch-tidepool/project/audio/mix.json -o work/ex01-mix.wav
#        showtime voice script project/narration.md -o project/voice --fit 25.5
#   mix: examples/01's mix (showtime audio mix output), shown in the terminal scene
#   vo:  the sentence "Even this voice was made locally." cut from voice/vo.wav (word times from timeline.json)
import json, numpy as np, soundfile as sf
def peaks(x, n):
    x = np.abs(x).max(axis=1)
    edges = np.linspace(0, len(x), n + 1).astype(int)
    p = np.array([x[a:b].max() if b > a else 0 for a, b in zip(edges[:-1], edges[1:])])
    return [round(float(v), 3) for v in p / (p.max() or 1)]
out = {}
x, sr = sf.read("work/ex01-mix.wav", always_2d=True)
out["mix"] = {"source": "ex01-mix.wav", "duration": len(x) / sr, "peaks": peaks(x, 160)}
tl = json.load(open("project/voice/timeline.json"))
line = [l for l in tl["lines"] if l["id"] == "local"][0]
w = line["words"]; i = [k for k, a in enumerate(w) if a["text"].startswith("Even")][0]
a, b = w[i]["start"] - 0.08, w[-1]["end"] + 0.12
x, sr = sf.read("project/voice/vo.wav", always_2d=True)
seg = x[int(a * sr):int(b * sr)]
out["vo"] = {"source": "vo.wav", "line_start": line["start"], "from": round(a, 3), "to": round(b, 3), "peaks": peaks(seg, 150)}
json.dump(out, open("project/data/peaks.json", "w"))
print(out["vo"]["source"], a, b)
