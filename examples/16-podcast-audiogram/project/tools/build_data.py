"""Build the page data for the audiogram from the clip and its aligned transcript.

Inputs (all in this project):
  media/clip.wav              the trimmed, cleaned, mastered episode excerpt (source 25:09.00-25:45.95)
  data/clip.page.words.json   nasa.gov transcript text force-aligned to clip.wav (`showtime voice align`)
  data/lines.json             the same text split into speaker turns, as labelled on nasa.gov

Outputs (data/):
  words.debra.json   the guest's words on the video clock (main caption layer)
  words.leah-q.json  the host's question on the video clock
  words.leah-i.json  the host's two short interjections on the video clock
  quote.json         the cold-open words (hook card highlights them as they are said)
  speakers.json      who is talking when (waveform colour)
  envelope.json      60 Hz loudness envelope of the voice as placed in audio/mix.json (waveform)

Run with the showtime Python (numpy + soundfile):  ~/.showtime/venv/bin/python tools/build_data.py
The timeline constants below must match audio/mix.json.
"""
import json
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
CLIP_AT = 3.55          # main clip placed at this video time (audio/mix.json track "answer")
COLD_OFFSET = 33.88     # cold open: clip seconds where "the exact scenarios..." starts
COLD_AT = 0.25          # ...placed at this video time (track "cold-open")
CLIP_DUR = 36.95
ENV_HZ = 60
DURATION = 45.0


def load(p):
    return json.loads((ROOT / p).read_text(encoding="utf-8"))


def dump(p, obj):
    (ROOT / p).write_text(json.dumps(obj, ensure_ascii=False, indent=1), encoding="utf-8")


words = [w for w in load("data/clip.page.words.json")["words"] if w.get("type", "word") == "word"]
lines = load("data/lines.json")

# assign each aligned word to its speaker turn (the aligner keeps the text's own words, in order)
tagged, i = [], 0
for li, line in enumerate(lines):
    n = len(line["text"].split())
    for w in words[i:i + n]:
        tagged.append({**w, "speaker": line["speaker"], "line": li})
    i += n
assert i == len(words), f"word count mismatch: {i} vs {len(words)}"


def shown(text):
    # the page writes an interruption as a trailing hyphen ("nothing-"); show it as an em dash
    return text[:-1] + "\u2014" if len(text) > 1 and text.endswith("-") else text


def shift(ws, dt):
    return [{"text": shown(w["text"]), "start": round(w["start"] + dt, 3), "end": round(w["end"] + dt, 3), "type": "word"}
            for w in ws]


leah = [w for w in tagged if w["speaker"].startswith("Leah")]
debra = [w for w in tagged if w["speaker"].startswith("Debra")]
dump("data/words.debra.json", {"source": "nasa.gov transcript aligned to media/clip.wav", "words": shift(debra, CLIP_AT)})
dump("data/words.leah-q.json", {"source": "nasa.gov transcript aligned to media/clip.wav",
                               "words": shift([w for w in leah if w["line"] == 0], CLIP_AT)})
dump("data/words.leah-i.json", {"source": "nasa.gov transcript aligned to media/clip.wav",
                               "words": shift([w for w in leah if w["line"] > 0], CLIP_AT)})

cold = [w for w in debra if w["start"] >= COLD_OFFSET - 0.02]
dump("data/quote.json", {"words": shift(cold, COLD_AT - COLD_OFFSET)})

# speaker segments on the video clock (consecutive words of one speaker merged, gaps < 0.9 s bridged)
segs = [{"who": "debra", "from": COLD_AT, "to": round(COLD_AT + CLIP_DUR - COLD_OFFSET, 3)}]
for w in tagged:
    who = "leah" if w["speaker"].startswith("Leah") else "debra"
    s, e = w["start"] + CLIP_AT, w["end"] + CLIP_AT
    if segs and segs[-1]["who"] == who and s - segs[-1]["to"] < 0.9:
        segs[-1]["to"] = round(e, 3)
    else:
        segs.append({"who": who, "from": round(s, 3), "to": round(e, 3)})
dump("data/speakers.json", segs)

# voice envelope as placed on the timeline
x, sr = sf.read(str(ROOT / "media/clip.wav"), always_2d=True)
x = x.mean(axis=1)
tl = np.zeros(int(DURATION * sr) + sr)


def place(at, offset, dur):
    a, o, n = int(at * sr), int(offset * sr), int(dur * sr)
    seg = x[o:o + n]
    tl[a:a + len(seg)] += seg


place(COLD_AT, COLD_OFFSET, CLIP_DUR - COLD_OFFSET)
place(CLIP_AT, 0.0, CLIP_DUR)
hop = sr // ENV_HZ
frames = len(tl) // hop
rms = np.sqrt(np.mean(tl[:frames * hop].reshape(frames, hop) ** 2, axis=1) + 1e-12)
db = 20 * np.log10(rms)
lo, hi = -48.0, -12.0
v = np.clip((db - lo) / (hi - lo), 0, 1)
# light attack/release smoothing so bars breathe instead of flicker (still a pure function of the file)
out = np.zeros_like(v)
for k in range(1, len(v)):
    a = 0.55 if v[k] > out[k - 1] else 0.18
    out[k] = out[k - 1] + a * (v[k] - out[k - 1])
dump("data/envelope.json", {"hz": ENV_HZ, "values": [round(float(t), 3) for t in out[: int(DURATION * ENV_HZ) + 1]]})
print("words: debra", len(debra), "leah", len(leah), "| cold-open words", len(cold), "| segments", len(segs),
      "| envelope frames", int(DURATION * ENV_HZ) + 1)

# every spoken word on the video clock (cold open + clip), for SRT/VTT sidecars: `showtime captions`
allw = shift(cold, COLD_AT - COLD_OFFSET) + shift(tagged, CLIP_AT)
dump("data/words.all.json", {"source": "nasa.gov transcript aligned to media/clip.wav, video clock", "language": "en",
                             "duration": DURATION, "words": allw})
