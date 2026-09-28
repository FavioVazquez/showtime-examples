"""Fill a fresh studio job with a copy of example 20's round-1 board (the app this tutorial records).

    showtime job init board-demo --mode studio --goal "Copy of example 20's round-1 board"
    showtime studio init board-demo
    python make-board-demo.py <example-20 job folder> <board-demo job folder>
    showtime studio board board-demo

The source is example 20's job folder (its studio/ has boards/board-r1.json and the media the board
shows). Nothing in the source is changed: feedback written while recording lands in the copy only.
"""
import json
import shutil
import sys
from pathlib import Path


def main(src: Path, dst: Path) -> None:
    s, d = src / "studio", dst / "studio"
    if not (s / "boards" / "board-r1.json").is_file():
        sys.exit("no studio/boards/board-r1.json in %s" % src)
    if not d.is_dir():
        sys.exit("run `showtime studio init` on %s first" % dst)
    for sub in ("frames", "thumbs", "audio", "fonts", "brand"):
        if (s / "media" / sub).is_dir():
            shutil.copytree(s / "media" / sub, d / "media" / sub, dirs_exist_ok=True)
    board = json.loads((s / "boards" / "board-r1.json").read_text(encoding="utf-8"))
    board["job"] = dst.name
    board.pop("updated", None)
    (d / "board.json").write_text(json.dumps(board, indent=1), encoding="utf-8")
    print("board-demo ready: rev %s, %d concepts; keep a copy of studio/feedback.json to reset between takes"
          % (board.get("rev"), len(board.get("concepts", []))))


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(Path(sys.argv[1]), Path(sys.argv[2]))
