# Repo-size export: showtime's own deliver.exports pipeline (loudnorm, BT.709 tags, lanczos,
# faststart) with a custom Target capped at ~1.9 Mbps video so a 72 s file fits <= 20 MB.
# Optional 4th arg WxH: the 9:16 repo copy is 720x1280 (review round 2): at this bitrate a
# 1080x1920 frame smeared skin, and the reframed crop only holds ~608x1080 real pixels anyway.
import sys, dataclasses, json
from st.deliver import exports as E
src, out, base = sys.argv[1], sys.argv[2], sys.argv[3]
kw = dict(name=base + "-repo", crf=22, maxrate_kbps=1850, audio_kbps=160)
if len(sys.argv) > 4:
    kw["width"], kw["height"] = (int(v) for v in sys.argv[4].lower().split("x"))
t = dataclasses.replace(E.TARGETS[base], **kw)
print(json.dumps(E.export_one(src, t, out), indent=1, default=str)[:1500])
