"""Writes lottie/steam-curl.json: an original line-icon Lottie (three steam curls drawn on and
off with trim paths), authored by hand for this example. Run: python3 tools/make_steam_lottie.py
Plain Lottie 5.x shape layers only (group > path + stroke + transform, trim-path modifier)."""
import json, pathlib

FR, W, H = 30, 240, 360
OP = 78                     # 2.6 s
INK = [0.925, 0.918, 0.905, 1]   # warm silver-white


def curve(points):
    """Smooth open bezier through points (Catmull-Rom -> cubic handles), Lottie format."""
    n = len(points)
    ins, outs = [], []
    for k in range(n):
        p0 = points[max(k - 1, 0)]
        p2 = points[min(k + 1, n - 1)]
        tx, ty = (p2[0] - p0[0]) / 6, (p2[1] - p0[1]) / 6
        if k == 0 or k == n - 1:
            tx, ty = tx * 0.5, ty * 0.5
        ins.append([round(-tx, 2), round(-ty, 2)])
        outs.append([round(tx, 2), round(ty, 2)])
    return {"i": ins, "o": outs, "v": [[round(x, 2), round(y, 2)] for x, y in points], "c": False}


def kf(t, v, ease_out=True):
    k = {"t": t, "s": [v]}
    k["i"] = {"x": [0.2], "y": [1]} if ease_out else {"x": [0.55], "y": [1]}
    k["o"] = {"x": [0.35], "y": [0]} if ease_out else {"x": [0.45], "y": [0]}
    return k


def static(v):
    return {"a": 0, "k": v}


def curl_layer(ind, name, dx, delay, amp, width):
    # an S-curve rising from the bottom centre, swaying left-right
    base_x = W / 2 + dx
    pts = [(base_x, 330), (base_x - amp, 262), (base_x + amp * 0.9, 182), (base_x - amp * 0.7, 104), (base_x + amp * 0.3, 36)]
    t0 = delay
    draw_end = t0 + 30          # end of the trim reaches 100 %
    fade_from = t0 + 22         # the tail starts to follow
    gone = t0 + 54
    trim = {
        "ty": "tm", "nm": "draw",
        "s": {"a": 1, "k": [kf(fade_from, 0, ease_out=False), {"t": gone, "s": [100]}]},
        "e": {"a": 1, "k": [kf(t0, 0), {"t": draw_end, "s": [100]}]},
        "o": static(0), "m": 1,
    }
    group = {
        "ty": "gr", "nm": name,
        "it": [
            {"ty": "sh", "nm": "path", "ks": static(curve(pts))},
            {"ty": "st", "nm": "stroke", "c": static(INK), "o": static(100), "w": static(width), "lc": 2, "lj": 2},
            {"ty": "tr", "p": static([0, 0]), "a": static([0, 0]), "s": static([100, 100]), "r": static(0), "o": static(100)},
        ],
    }
    return {
        "ddd": 0, "ind": ind, "ty": 4, "nm": name, "sr": 1, "ao": 0, "ip": 0, "op": OP, "st": 0, "bm": 0,
        "ks": {
            "o": {"a": 1, "k": [kf(t0, 0), kf(t0 + 6, 100), kf(gone - 10, 100), {"t": gone, "s": [0]}]},
            "r": static(0),
            # the curl drifts upward a little while it lives
            "p": {"a": 1, "k": [{"t": t0, "s": [0, 18, 0], "i": {"x": 0.3, "y": 1}, "o": {"x": 0.3, "y": 0}}, {"t": gone, "s": [0, -14, 0]}]},
            "a": static([0, 0, 0]), "s": static([100, 100, 100]),
        },
        "shapes": [group, trim],
    }


doc = {
    "v": "5.7.4", "fr": FR, "ip": 0, "op": OP, "w": W, "h": H, "nm": "steam-curl (showtime example 17, original)",
    "ddd": 0, "assets": [],
    "layers": [
        curl_layer(1, "curl-left", -52, 0, 16, 12),
        curl_layer(2, "curl-mid", 0, 9, 20, 13),
        curl_layer(3, "curl-right", 50, 18, 14, 11),
    ],
}
out = pathlib.Path(__file__).resolve().parent.parent / "lottie" / "steam-curl.json"
out.write_text(json.dumps(doc, separators=(",", ":")))
print(out, out.stat().st_size, "bytes")
