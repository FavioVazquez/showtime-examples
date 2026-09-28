"""Make the text-only copy of the Wikipedia article that the source scene scrolls through.

The live page (https://en.wikipedia.org/wiki/Waggle_dance, checked to be revision 1371912261 on
2026-09-27) shows two figures whose licences differ from the text's (Bee dance.svg, CC BY-SA 2.5;
Waggle dance.png, CC BY 2.5) and the Wikipedia logo (a Wikimedia trademark). `showtime site record`
has no option to hide elements, so this script saves the page, removes its scripts, points relative
links back at en.wikipedia.org and hides figures, images and the logo. Nothing else is changed.

    python capture/make_text_only.py wiki-text/          # writes wiki-text/index.html
    showtime site record --serve wiki-text wiki-scroll --width 1120 --duration 6 --hold 1.3 --to 0.14 --dpr 2
    showtime footage trim wiki-scroll/scroll.mp4 --webm --no-audio --width 1600 --crf 34 -o project/media/wiki-scroll.webm
"""
import pathlib
import re
import sys
import urllib.request

URL = "https://en.wikipedia.org/wiki/Waggle_dance"
REV = "1371912261"
STYLE = """<style id="showtime-license-crop">
figure, .thumb, .infobox, .mw-default-size, img, .mw-file-element, .mw-logo, #siteNotice,
.vector-sitenotice-container { display: none !important; }
</style>"""


def main(out_dir):
    req = urllib.request.Request(URL, headers={"User-Agent": "showtime-example-build/0.1 (local video tool)"})
    html = urllib.request.urlopen(req, timeout=60).read().decode("utf-8")
    rev = re.search(r'"wgRevisionId":(\d+)', html).group(1)
    if rev != REV:
        sys.exit(f"the live page is now revision {rev}, not {REV}: capture the oldid URL instead")
    html = re.sub(r"<script\b[^>]*>.*?</script>", "", html, flags=re.S)
    html = html.replace("<head>", f'<head>\n<base href="{URL}">', 1).replace("</head>", STYLE + "\n</head>", 1)
    out = pathlib.Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)
    (out / "index.html").write_text(html, encoding="utf-8")
    print(f"revision {rev}: {out / 'index.html'}")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "wiki-text")
