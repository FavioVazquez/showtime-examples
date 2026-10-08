#!/usr/bin/env python3
"""Fix the spelling of two misheard words in the panel's transcript, checked against NASA's own caption file for
the video (the item's .srt): "I talked with my cause" is "I talked with Mike Hawes", and "the alternate mission
options I had in there" is "... they had in there". Only `text` changes; word times stay as transcribed.

usage: python fix_spelling.py <job>/edit/transcripts/apollo17-legends.json
"""
import json
import sys

FIXES = {  # word id: (as transcribed, as said)
    "w2462": ("I", "they"),
    "w2470": ("my", "Mike"),
    "w2471": ("cause", "Hawes"),
}

path = sys.argv[1]
with open(path, encoding="utf-8") as f:
    doc = json.load(f)
done = 0
for w in doc["words"]:
    fix = FIXES.get(w.get("id"))
    if fix and w["text"] in fix:
        w["text"] = fix[1]
        done += 1
doc["text"] = " ".join(w["text"] for w in doc["words"] if w.get("type") == "word")
with open(path, "w", encoding="utf-8") as f:
    json.dump(doc, f, ensure_ascii=False, indent=2)
print("%d word(s) fixed in %s" % (done, path))
