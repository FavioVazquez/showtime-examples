"""Spelling only (word times untouched): the mission names are acronyms, GOLD and ICON."""
import json
import sys

p = sys.argv[1]
d = json.load(open(p))
for w in d["words"]:
    if w.get("type", "word") != "word":
        continue
    t = w["text"]
    if t.rstrip(",.").lower() == "gold":
        w["text"] = "GOLD" + t[4:]
    elif t == "golden":          # "the golden icon missions" is "the GOLD and ICON missions"
        w["text"] = "GOLD and"
    elif t.lower() == "icon":
        w["text"] = "ICON"
json.dump(d, open(p, "w"), indent=1, ensure_ascii=False)
print(" ".join(w["text"] for w in d["words"] if w.get("type", "word") == "word" and ("GOLD" in w["text"] or "ICON" in w["text"])))
