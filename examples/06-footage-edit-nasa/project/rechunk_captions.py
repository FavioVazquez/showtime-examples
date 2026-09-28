# Phrase-level caption cues for an edit EDL (review round 2).
#
# showtime's own grouping splits any 3+ word group that is over 20 characters/s in half until
# the pieces are one or two words (those are exempt from the reading-speed rule), so for fast
# speech it produced 80-200 ms one-word flashes. This script regroups the same output-timeline
# words by phrase with a small dynamic program instead:
#   - at most `line` characters per line and 2 lines per cue (42 on 16:9, 32 on 9:16);
#   - prefer breaks after sentence ends, then clause punctuation, then pauses;
#   - every cue stays up at least 1.0 s; cues less than 0.3 s apart are joined back to back;
#   - reading speed <= 20 chars/s where the speech allows (penalised, not forced);
#   - (round 3) a line or cue does not end on a function word ("the", "of", "to", "when", ...) or
#     split a name ("Kennedy / Space Center") when another break fits; on 32-char lines it prefers
#     one more, shorter cue to a bad line break; a cue that starts within 250 ms after a cut or a
#     reframe starts on it (the previous cue ends there), so no old text rides into the new shot.
# It writes an SRT and, with --ass, an ASS file in a showtime caption style (st.footage.captions
# .to_ass) that the EDL burns via "subtitles". Word timings are never changed.
#
# usage: PYTHONPATH=skills/showtime/lib ~/.showtime/venv/bin/python rechunk_captions.py <edl.json> \
#            --srt out.srt [--ass out.ass --style clean --position bottom]
import argparse, json
from pathlib import Path

from st.footage import edl as E, captions as C
from st.footage.fontfiles import find_font
from st import captions_rules as R

ap = argparse.ArgumentParser()
ap.add_argument("edl")
ap.add_argument("--srt", required=True)
ap.add_argument("--ass")
ap.add_argument("--style", default="clean")
ap.add_argument("--position", default="bottom")
ap.add_argument("--min-hold", type=float, default=1.0)
a = ap.parse_args()

edl = E.load(Path(a.edl).resolve())
segs = E.plan(edl)
W, H = edl["output"]["width"], edl["output"]["height"]
line = R.max_line_chars(W, H)
total_dur = E.total_duration(segs)
words = C.display_words(E.map_words(segs, E.load_transcripts(edl, required=True), include_events=False))
n = len(words)
txt = [str(w["text"]).strip() for w in words]


FUNC = {"the", "a", "an", "of", "to", "and", "or", "but", "with", "when", "that", "my", "our", "in", "on",
        "for", "as", "at", "from", "i", "i'm", "i've", "is", "be", "was", "were", "then", "so", "about"}


TIED = {"of", "up", "out", "off"}                      # words that belong to the word before them
LAYOUT_BAD = 4.0 if line >= 40 else 20.0               # 32-char lines force more bad breaks: prefer a new cue
FAST_W = 25.0 if line >= 40 else 12.0                  # 9:16: phrase integrity over reading speed (cps is a WARN)


def _bare(t):
    return t.lower().strip(".,;:!?\"'")


def line_split(texts, max_chars, max_lines):  # C.split_lines + no line ending on a function word
    total = len(" ".join(texts))
    if max_lines <= 1 or total <= max_chars or len(texts) < 2:
        return [list(range(len(texts)))]
    best, best_cost = None, None
    for k in range(1, len(texts)):
        a, b = len(" ".join(texts[:k])), len(" ".join(texts[k:]))
        cost = abs(a - b) + (1000 if max(a, b) > max_chars else 0) + (30 if k == 1 or k == len(texts) - 1 else 0)
        last = texts[k - 1]
        if last[-1:] in ",.;:!?":
            cost -= 12                                  # break after punctuation
        elif _bare(last) in FUNC or _bare(texts[k]) in TIED:
            cost += 40                                  # "... on the / Artemis II", "a bunch / of"
        elif last[:1].isupper() and texts[k][:1].isupper() and _bare(last) != "i":
            cost += 40                                  # inside a name
        if best_cost is None or cost < best_cost:
            best, best_cost = k, cost
    return [list(range(best)), list(range(best, len(texts)))]


C.split_lines = line_split                              # to_srt / to_ass lay lines out with this too


def layout_cost(i, j):  # 0 = clean line break; >0 = the break ends a line on a function word
    lay = line_split(txt[i:j], line, 2)
    if len(lay) < 2:
        return 0.0
    last = txt[i + lay[0][-1]]
    nxt = _bare(txt[i + lay[1][0]])
    if last[-1:] in ",.;:!?":
        return 0.0
    name = last[:1].isupper() and txt[i + lay[1][0]][:1].isupper() and _bare(last) != "i"
    bad = _bare(last) in FUNC or nxt in TIED or name
    return (LAYOUT_BAD if bad else 1.0)


def fits(i, j):  # words[i:j] fit in 2 lines of `line` chars
    lay = line_split(txt[i:j], line, 2)
    return all(len(" ".join(txt[i:j][k] for k in l)) <= line for l in lay) and len(lay) <= 2


def brk_cost(j):  # cost of ending a cue after word j-1
    if j == n:
        return 0.0
    t = txt[j - 1]
    if t[-1:] not in ",.;:!?" and t[:1].isupper() and txt[j][:1].isupper() and _bare(t) != "i":
        return 25.0                                     # inside a name: "Kennedy / Space Center"
    if t[-1:] not in ",.;:!?" and (_bare(t) in WEAK or _bare(txt[j]) in TIED):
        return 25.0                                     # never end a cue on "and", "the", "to" ...
    gap = words[j]["start"] - words[j - 1]["end"]
    if C.SENT_END.search(t):
        return 0.0
    if C.CLAUSE_END.search(t):
        return 2.0 if gap >= 0.1 else 3.0
    if gap >= 0.3:
        return 3.0
    nxt = txt[j].lower().strip(",.")
    if nxt in ("and", "but", "so", "when", "because", "which", "where", "i", "i'm", "i've"):
        return 6.0
    if nxt in ("on", "with", "about", "for", "to", "from", "in", "at", "that", "is"):
        return 9.0                                      # a phrase starts here
    return 12.0


def span(i, j):  # time the cue can own: its first word start -> next cue's first word start
    end = words[j]["start"] if j < n else min(total_dur, words[j - 1]["end"] + 1.0)
    return words[i]["start"], min(end, words[j - 1]["end"] + 1.5)


WEAK = FUNC
# output times of framing changes: real cuts (source jumps) and reframe-only joins (same take continues)
cut_marks = [(sg["out_start"], abs(pv["src_end"] - sg["start"]) > 0.5 / float(edl["output"]["fps"]) or pv["source"] != sg["source"])
             for pv, sg in zip(segs, segs[1:])]
INF = float("inf")
best = [INF] * (n + 1)
back = [0] * (n + 1)
best[0] = 0.0
for j in range(1, n + 1):
    for i in range(max(0, j - 18), j):
        if best[i] == INF or not fits(i, j):
            continue
        s, e = span(i, j)
        if words[j - 1]["end"] - words[i]["start"] > 7.0:
            continue
        chars = len(" ".join(txt[i:j]))
        c = brk_cost(j)
        mid = sum(1 for k in range(i, j - 1) if C.SENT_END.search(txt[k]))
        c += 12.0 * mid                                 # a sentence end inside a cue
        c += layout_cost(i, j)
        for t, real in cut_marks:                       # a cue that shows words from both sides of a cut
            if words[i]["start"] < t - 0.02 and words[j - 1]["end"] > t + 0.02:
                c += 20.0 if real else 3.0
        if e - s < a.min_hold:
            c += 40.0 * (a.min_hold - (e - s)) + 10.0   # too short to read
        need = chars / R.MAX_CPS
        if j - i >= R.CPS_MIN_WORDS and e - s < need:
            c += FAST_W * (need - (e - s))              # too fast
        if chars < 16 and j < n:
            c += 4.0                                    # fragments
        c += 1.0                                        # fewer, fuller cues
        if best[i] + c < best[j]:
            best[j], back[j] = best[i] + c, i
cuts, j = [], n
while j > 0:
    cuts.append((back[j], j))
    j = back[j]
cuts.reverse()

groups = []
for k, (i, j) in enumerate(cuts):
    s = max(0.0, words[i]["start"] - 0.05)
    if groups:
        s = max(s, groups[-1]["end"])
    nxt = words[j]["start"] - 0.05 if j < n else total_dur
    end = min(max(words[j - 1]["end"] + 0.6, s + a.min_hold), nxt)
    end = max(end, words[j - 1]["end"])
    groups.append({"words": words[i:j], "start": s, "end": min(end, total_dur)})
# close small gaps (no blink between back-to-back cues); pull a still-short cue's start earlier
for k in range(len(groups) - 1):
    if groups[k + 1]["start"] - groups[k]["end"] < 0.3:
        groups[k]["end"] = groups[k + 1]["start"]
for k, g in enumerate(groups):
    if g["end"] - g["start"] < a.min_hold:
        floor = groups[k - 1]["end"] if k else 0.0
        g["start"] = max(floor, g["end"] - a.min_hold)

# framing changes (cuts and reframe-only joins): a cue starting just after one starts on it
snapped = []
for k, g in enumerate(groups):
    for t, _real in cut_marks:
        if not (t - 0.1 <= g["start"] < t + 0.25) or abs(g["start"] - t) < 0.001 or g["words"][0]["start"] < t - 0.02:
            continue
        prev = groups[k - 1] if k else None
        if prev and prev["words"][-1]["end"] > t + 0.02:
            continue                                    # the previous cue is still being spoken past the cut
        if prev and prev["end"] >= g["start"] - 0.001:
            prev["end"] = t                             # back to back: the old cue ends exactly on the cut
        elif prev and prev["end"] > t:
            prev["end"] = t
        snapped.append((round(g["start"], 3), round(t, 3)))
        g["start"] = t
        break

Path(a.srt).write_text(C.to_srt(groups, line), encoding="utf-8")
durs = [g["end"] - g["start"] for g in groups]
fast = [g for g in groups if R.too_fast(" ".join(str(w["text"]) for w in g["words"]), g["end"] - g["start"])]
rep = {"cues": len(groups), "words": n, "min_s": round(min(durs), 3), "under_1s": sum(d < 0.999 for d in durs),
       "over_20cps": len(fast), "line_chars": line, "snapped_to_cuts": snapped, "timing": C.check_timing(groups, words)}
if a.ass:
    st = C.get_style(a.style)
    font = find_font(st["font"], bold=bool(st.get("bold")))
    st["_font_weight"] = font.weight
    st["chars"] = line
    st["max_lines"] = 2
    Path(a.ass).write_text(C.to_ass(groups, st, W, H, font.family, a.position), encoding="utf-8")
    rep["ass"] = a.ass
print(json.dumps(rep))
