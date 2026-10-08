"""The 9:16 EDL from the 16:9 one: same cut and cards, vertical captions. Captions move below her chin by
themselves; cards with no room left there become splits (the speaker moves to the lower part); `edit check`
lists what remains."""
import json
import sys

src, dst = sys.argv[1], sys.argv[2]
d = json.load(open(src))
# the source is 1080p: 1080x1920 enlarges it 1.78x whatever the crop; accepted (qa notes it)
d["output"] = {"aspect": "9:16", "allow_upscale": True}
# a little under bold-pop's default size (0.105 of the width), so captions and the name tag both fit under her chin
d["captions"] = dict(d["captions"], style="bold-pop", position="middle", size={"portrait": 0.095})
for c in d["cards"]:
    if c["type"] == "lower-third":
        # after the title (both would need the space under her chin), and on one line: the slate's
        # "NASA's Goddard Space Flight Center", shortened
        c["say"] = "Scientists are working"
        c.pop("hold", None)
        c["dur"] = 3.9
        c["role"] = "Mission Scientist, NASA Goddard"
json.dump(d, open(dst, "w"), indent=2)
print(dst)
