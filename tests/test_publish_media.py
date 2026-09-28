#!/usr/bin/env python3
"""publish_media.py tests (generated from showtime's skills/showtime/tests/test_skill_structure.py;
edit them there). Run: python tests/test_publish_media.py -v"""
import importlib.util
import unittest
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]


def load_publish_media():
    path = REPO / "scripts" / "publish_media.py"
    if not path.is_file():
        return None
    spec = importlib.util.spec_from_file_location("publish_media", str(path))
    mod = importlib.util.module_from_spec(spec)  # type: ignore[arg-type]
    spec.loader.exec_module(mod)  # type: ignore[union-attr]
    return mod


pm = load_publish_media()


class TestPublishMedia(unittest.TestCase):
    """Large example media are release assets: policy, manifest, .gitignore block, verify, links, upload."""

    def setUp(self):
        import tempfile
        self.root = Path(tempfile.mkdtemp(prefix="st-media-"))
        ex = self.root / "examples"

        def mk(rel, size):
            p = ex / rel
            p.parent.mkdir(parents=True, exist_ok=True)
            with open(str(p), "wb") as f:
                f.truncate(size)   # sparse: sizes without writing megabytes
            return p
        self.big = mk("01-demo/final.mp4", 11_000_000)
        self.small = mk("01-demo/final-9x16.mp4", 9_500_000)
        self.poster = mk("01-demo/poster.jpg", 120_000)
        self.mov = mk("20-pack/pack/lower-thirds/lt-bar.mov", 2_000)
        self.page = mk("13-bees/waggle.html", 10_500_000)
        mk("01-demo/work/scratch.mp4", 30_000_000)        # work folders never count

    def tearDown(self):
        import shutil
        shutil.rmtree(str(self.root), ignore_errors=True)

    def manifest(self):
        return pm.build_manifest(examples=self.root / "examples", root=self.root)

    def test_policy(self):
        self.assertEqual(pm.reason_for(Path("a.mov"), 10), "ProRes/.mov master")
        self.assertEqual(pm.reason_for(Path("a.mp4"), 10_000_001), "over 10 MB")
        self.assertIsNone(pm.reason_for(Path("a.mp4"), 10_000_000))
        self.assertIsNone(pm.reason_for(Path("poster.jpg"), 200_000))
        self.assertEqual(pm.reason_for(Path("examples/_brand/sting.mp4"), 4_000_000), "brand media")
        self.assertIsNone(pm.reason_for(Path("examples/_brand/README.md"), 2_000))
        self.assertEqual(pm.asset_name("examples/20-pack/pack/lower-thirds/lt-bar.mov"), "20-pack--pack--lower-thirds--lt-bar.mov")

    def test_manifest_and_summary(self):
        m = self.manifest()
        paths = [e["path"] for e in m["files"]]
        self.assertEqual(paths, ["examples/01-demo/final.mp4", "examples/13-bees/waggle.html",
                                 "examples/20-pack/pack/lower-thirds/lt-bar.mov"])
        self.assertEqual(len({e["asset"] for e in m["files"]}), 3, "asset names must be unique")
        self.assertTrue(all(len(e["sha256"]) == 64 for e in m["files"]))
        self.assertEqual(m["summary"]["release_bytes"], 11_000_000 + 10_500_000 + 2_000)
        self.assertEqual(m["summary"]["git_files"], 2)
        self.assertEqual(m["summary"]["git_bytes"], 9_500_000 + 120_000)

    def test_gitignore_block_idempotent_and_verify(self):
        m = self.manifest()
        base = (REPO / ".gitignore").read_text(encoding="utf-8") if (REPO / ".gitignore").is_file() else "*.mp4\n!examples/**/*.mp4\n"
        base = pm.with_block(base, "")  # drop any real block
        once = pm.with_block(base, pm.gitignore_block(m))
        self.assertEqual(pm.with_block(once, pm.gitignore_block(m)), once)
        self.assertIn("/examples/01-demo/final.mp4", once)
        self.assertNotIn("final-9x16.mp4", once)
        ex = self.root / "examples"
        ok = pm.verify(m, once, examples=ex, root=self.root, hash_files=True)
        self.assertEqual((ok["errors"], ok["warnings"]), ([], []))
        # the rule bites: no block, or no manifest
        self.assertTrue(any("does not exclude" in e for e in pm.verify(m, base, examples=ex, root=self.root)["errors"]))
        self.assertTrue(pm.verify(None, once, examples=ex, root=self.root)["errors"])
        # a re-render changes the size: a warning (refresh before uploading), not an error
        with open(str(self.big), "ab") as f:
            f.truncate(12_000_000)
        self.assertTrue(pm.verify(m, once, examples=ex, root=self.root)["warnings"])
        # a new big file is an error until --refresh lists it
        with open(str(ex / "01-demo" / "final-2.mp4"), "wb") as f:
            f.truncate(15_000_000)
        self.assertTrue(any("final-2.mp4" in e for e in pm.verify(m, once, examples=ex, root=self.root)["errors"]))
        # git really ignores the listed files and keeps the small ones (after the !examples/**/*.mp4 exception)
        import shutil
        import subprocess
        git = shutil.which("git")
        if git:
            (self.root / ".gitignore").write_text(once, encoding="utf-8")
            subprocess.run([git, "init", "-q", str(self.root)], check=True)
            ign = lambda rel: subprocess.run([git, "-C", str(self.root), "check-ignore", "-q", rel]).returncode == 0  # noqa: E731
            self.assertTrue(ign("examples/01-demo/final.mp4"))
            self.assertTrue(ign("examples/20-pack/pack/lower-thirds/lt-bar.mov"))
            self.assertTrue(ign("examples/13-bees/waggle.html"))
            self.assertFalse(ign("examples/01-demo/final-9x16.mp4"))
            self.assertFalse(ign("examples/01-demo/poster.jpg"))

    def test_links_and_upload_command(self):
        m = self.manifest()
        md = pm.links_markdown(m, example="20", repo="me/showtime", tag="v9")
        self.assertEqual(md, "- [`pack/lower-thirds/lt-bar.mov`](https://github.com/me/showtime/releases/download/v9/"
                             "20-pack--pack--lower-thirds--lt-bar.mov) (0.0 MB)")
        cmd = pm.upload_command(m, Path("stage"), "v9", "me/showtime")
        self.assertEqual(cmd[:4], ["gh", "release", "upload", "v9"])
        self.assertIn(str(Path("stage") / "01-demo--final.mp4"), cmd)
        self.assertEqual(cmd[-3:], ["--clobber", "--repo", "me/showtime"])
        import tempfile
        with tempfile.TemporaryDirectory() as d:
            staged = pm.stage(m, self.root, Path(d))
            self.assertEqual(sorted(p.name for p in staged), sorted(e["asset"] for e in m["files"]))
        self.assertTrue(self.big.exists(), "staging never moves the example's own file")

    def test_repository_manifest_follows_the_policy(self):
        man = pm.load_manifest()
        if man is None:
            self.skipTest("examples/MEDIA.json not written yet")
        res = pm.verify(man, (REPO / ".gitignore").read_text(encoding="utf-8"))
        self.assertEqual(res["errors"], [], "\n".join(res["errors"]))


if __name__ == "__main__":
    unittest.main()
