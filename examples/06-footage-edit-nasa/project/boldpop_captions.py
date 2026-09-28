# Bold-pop burn-in for the 9:16 EDL with a hard floor on how long a chunk stays up (review round 3).
#
# It is showtime's own bold-pop pass (st.footage.captions: same style, grouping, reading-speed
# pass, karaoke ASS), with one step added: a chunk shorter than --min (0.20 s) is merged with a
# neighbour. A determiner ("our", "the", "a", "my") joins the chunk after it ("OUR" + "SKILLS"); any
# other word joins the chunk before it. When that merge would overflow the line or break the
# reading-speed rule, it takes a single word from the neighbour instead ("THAT" + "THAT"). The EDL burns the result via "subtitles".
#
# usage: PYTHONPATH=skills/showtime/lib ~/.showtime/venv/bin/python boldpop_captions.py <edl.json> <out.ass> \
#            --size 0.135 --chars 16 --position middle
import argparse, json
from pathlib import Path

from st.footage import edl as E, captions as C
from st.footage.fontfiles import find_font
from st import captions_rules as R

ap = argparse.ArgumentParser()
ap.add_argument("edl")
ap.add_argument("ass")
ap.add_argument("--min", type=float, default=0.20)
ap.add_argument("--style", default="bold-pop")
ap.add_argument("--position", default="middle")
ap.add_argument("--size", type=float, help="portrait size (fraction of the short side)")
ap.add_argument("--chars", type=int)
a = ap.parse_args()

edl = E.load(Path(a.edl).resolve())
segs = E.plan(edl)
W, H = edl["output"]["width"], edl["output"]["height"]
over = {}
if a.size:
    over["size"] = {"portrait": a.size}
if a.chars:
    over["chars"] = a.chars
position = a.position
st = C.get_style(a.style, over)
font = find_font(st["font"], bold=bool(st.get("bold")))
words = E.map_words(segs, E.load_transcripts(edl, required=True), include_events=False)
dw = C.display_words(words)
font, dw, _notes = C._fit_glyphs(font, dw, st)
st["_font_weight"] = font.weight
orient = C.orientation(W, H)
st["chars"] = min(int(C._pick(st["chars"], orient)), R.max_line_chars(W, H))
groups = C.group_words(dw, st, orient)
FWD = {"our", "the", "a", "an", "my", "their", "his", "her"}


def text(ws):
    return " ".join(C._word_text(w, st) for w in ws)


def ok(ws):  # fits the line, and a 3+ word chunk stays within showtime's reading-speed rule
    if len(text(ws)) > st["chars"]:
        return False
    return len(ws) < R.CPS_MIN_WORDS or R.readable(text(ws), ws[-1]["end"] + st["tail"] - ws[0]["start"])


merged = []
for _ in range(10):
    short = [k for k, g in enumerate(groups) if g["end"] - g["start"] < a.min - 1e-6]
    if not short:
        break
    k = short[0]
    g, prv, nxt = groups[k], groups[k - 1] if k else None, groups[k + 1] if k + 1 < len(groups) else None
    fwd = C._word_text(g["words"][-1], st).lower() in FWD
    opts = []
    if nxt:
        opts += [("next", g["words"] + nxt["words"], None), ("next1", g["words"] + nxt["words"][:1], nxt["words"][1:])]
    if prv:
        opts = ([("prev", prv["words"] + g["words"], None)] + opts) if not fwd else (opts + [("prev", prv["words"] + g["words"], None)])
        opts.append(("prev1", prv["words"][-1:] + g["words"], prv["words"][:-1]))
    for how, ws, rest in opts:
        if ok(ws) and (rest is None or rest):
            if how.startswith("next"):
                new = [{"words": ws}] + ([{"words": rest}] if rest else [])
                groups[k:k + 2] = new
            else:
                new = ([{"words": rest}] if rest else []) + [{"words": ws}]
                groups[k - 1:k + 1] = new
            merged.append({"was": text(g["words"]), "now": [text(x["words"]) for x in new]})
            break
    else:
        break
    for x in groups:
        x.setdefault("start", x["words"][0]["start"])
        x["start"], x["end"] = x["words"][0]["start"], x["words"][-1]["end"]
    C._time_groups(groups, st)
    for i in range(len(groups)):
        C._stretch(groups, st, i)                       # re-lend reading time as showtime's own pass does

Path(a.ass).write_text(C.to_ass(groups, st, W, H, font.family, position), encoding="utf-8")
durs = sorted((round(x["end"] - x["start"], 3), text(x["words"])) for x in groups)
print(json.dumps({"ass": a.ass, "groups": len(groups), "merged": merged, "shortest": durs[:4],
                  "timing": C.check_timing(groups, dw)}))
