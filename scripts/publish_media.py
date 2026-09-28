#!/usr/bin/env python3
"""Large example media ship as GitHub release assets, not in git (stdlib only, any OS, Python 3.8+).

Policy: under examples/, any single file over 10 MB (decimal), every .mov / .prores file and every video in
examples/_brand/ (the brand stings) is a release asset; posters, share.txt, sources and videos up to 10 MB
stay in git. The list lives in
examples/MEDIA.json (path, bytes, sha256, asset name, reason) and in a managed block of .gitignore, so
those files are never committed; READMEs link to the release URL of each asset.

    python scripts/publish_media.py                 # verify: manifest and .gitignore agree with the files
    python scripts/publish_media.py --refresh       # rescan examples/, rewrite MEDIA.json and the .gitignore block
    python scripts/publish_media.py --links         # markdown links to every asset (for READMEs)
    python scripts/publish_media.py --links --example 20
    python scripts/publish_media.py --upload --dry-run   # the `gh release upload` command, not run
    python scripts/publish_media.py --upload [--tag T] [--repo OWNER/NAME]

--upload stages each file under its asset name (several examples ship a final.mp4, so asset names are
the path with "--" for "/") and runs `gh release upload <tag> <files> --clobber`; it refuses when the
manifest is stale. Nothing is moved or deleted in examples/.

Exit code 0 = consistent (or done), 1 = problems found, 2 = bad usage.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import Any, Dict, List, Optional, Sequence, Tuple

REPO = Path(__file__).resolve().parents[1]
EXAMPLES = REPO / "examples"
MANIFEST = EXAMPLES / "MEDIA.json"
GITIGNORE = REPO / ".gitignore"

MAX_GIT_BYTES = 10 * 1000 * 1000          # decimal MB, like upload limits
ALWAYS_RELEASE_EXT = {".mov", ".prores"}  # ProRes masters (alpha lower thirds, stingers) are always large
BRAND_DIR = "_brand"                      # examples/_brand/: the brand stings, published with the media release
VIDEO_EXT = {".mp4", ".webm", ".mov"}
SKIP_DIRS = {".git", "node_modules", "__pycache__", "work", "showtime-out", ".venv", "venv"}
DEFAULT_REPO = "FavioVazquez/showtime-examples"
DEFAULT_TAG = "examples-media-v1"
URL_PATTERN = "https://github.com/{repo}/releases/download/{tag}/{asset}"
BLOCK_BEGIN = "# BEGIN example media published as release assets (scripts/publish_media.py --refresh; do not edit)"
BLOCK_END = "# END example media"


# ------------------------------------------------------------------ policy

def reason_for(path: Path, size: int) -> Optional[str]:
    """Why a file goes to release assets, or None when it stays in git."""
    if path.suffix.lower() in ALWAYS_RELEASE_EXT:
        return "ProRes/.mov master"
    if path.suffix.lower() in VIDEO_EXT and path.parent.name == BRAND_DIR:
        return "brand media"
    if size > MAX_GIT_BYTES:
        return "over %d MB" % (MAX_GIT_BYTES // 1000000)
    return None


def asset_name(rel: str) -> str:
    """examples/20-pack/pack/lower-thirds/lt-bar.mov -> 20-pack--pack--lower-thirds--lt-bar.mov (unique, flat)."""
    parts = rel.replace("\\", "/").split("/")
    if parts and parts[0] == "examples":
        parts = parts[1:]
    return "--".join(parts)


def sha256_of(path: Path) -> str:
    h = hashlib.sha256()
    with open(str(path), "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def rel(p: Path, root: Path = REPO) -> str:
    return p.relative_to(root).as_posix()


def scan(examples: Path = EXAMPLES, root: Path = REPO) -> List[Tuple[Path, int]]:
    """Every file under examples/ (work folders and caches excluded) with its size."""
    out: List[Tuple[Path, int]] = []
    if not examples.is_dir():
        return out
    for dirpath, dirnames, filenames in os.walk(str(examples)):
        dirnames[:] = sorted(d for d in dirnames if d not in SKIP_DIRS and not d.endswith(".work"))
        for fn in sorted(filenames):
            p = Path(dirpath) / fn
            if p == examples / "MEDIA.json" or fn in (".DS_Store", "Thumbs.db"):
                continue
            try:
                out.append((p, p.stat().st_size))
            except OSError:
                continue
    return out


def build_manifest(examples: Path = EXAMPLES, root: Path = REPO, previous: Optional[Dict[str, Any]] = None,
                   hash_files: bool = True) -> Dict[str, Any]:
    """The manifest for the files on disk. Entries in `previous` whose file is not on disk (a fresh clone
    that never downloaded them) are kept as they are."""
    prev = previous or {}
    rel_prev = {e["path"]: e for e in prev.get("files", []) if isinstance(e, dict) and e.get("path")}
    files: List[Dict[str, Any]] = []
    kept_bytes, kept_n = 0, 0
    seen = set()
    for p, size in scan(examples, root):
        why = reason_for(p, size)
        r = rel(p, root)
        if not why:
            kept_bytes += size
            kept_n += 1
            continue
        old = rel_prev.get(r)
        digest = old["sha256"] if (old and old.get("bytes") == size and not hash_files) else (sha256_of(p) if hash_files else "")
        files.append({"path": r, "bytes": size, "sha256": digest, "asset": asset_name(r), "reason": why})
        seen.add(r)
    for r, e in rel_prev.items():
        if r not in seen and not (root / r).exists():
            files.append(dict(e, missing_locally=True))
    files.sort(key=lambda e: e["path"])
    rel_bytes = sum(int(e.get("bytes") or 0) for e in files)
    release = prev.get("release") if isinstance(prev.get("release"), dict) else {}
    return {
        "_comment": "Example media published as GitHub release assets instead of git (scripts/publish_media.py). "
                    "Policy: any file over 10 MB, every .mov/.prores and the brand videos (examples/_brand/) under "
                    "examples/. Link: url_pattern with "
                    "{repo}, {tag} and the entry's asset name.",
        "policy": {"max_git_bytes": MAX_GIT_BYTES, "always_release_ext": sorted(ALWAYS_RELEASE_EXT),
                   "always_release_dirs": ["examples/" + BRAND_DIR]},
        "release": {"repo": release.get("repo") or DEFAULT_REPO, "tag": release.get("tag") or DEFAULT_TAG,
                    "url_pattern": URL_PATTERN},
        "summary": {"release_files": len(files), "release_bytes": rel_bytes, "git_files": kept_n, "git_bytes": kept_bytes},
        "files": files,
    }


def url_for(manifest: Dict[str, Any], entry: Dict[str, Any], repo: Optional[str] = None, tag: Optional[str] = None) -> str:
    rl = manifest.get("release") or {}
    return (rl.get("url_pattern") or URL_PATTERN).format(repo=repo or rl.get("repo") or DEFAULT_REPO,
                                                         tag=tag or rl.get("tag") or DEFAULT_TAG, asset=entry["asset"])


# ------------------------------------------------------------------ .gitignore block

def gitignore_block(manifest: Dict[str, Any]) -> str:
    lines = [BLOCK_BEGIN,
             "# every .mov/.prores under examples/ is a release asset, whatever its size",
             "examples/**/*.mov", "examples/**/*.prores"]
    for e in manifest.get("files", []):
        if Path(e["path"]).suffix.lower() in ALWAYS_RELEASE_EXT:
            continue
        # a leading slash anchors the path to the repository root
        lines.append("/" + e["path"])
    lines.append(BLOCK_END)
    return "\n".join(lines) + "\n"


def with_block(text: str, block: str) -> str:
    """The .gitignore text with the managed block replaced (or appended at the end, after the
    `!examples/**/*.mp4` exception it overrides)."""
    if BLOCK_BEGIN in text and BLOCK_END in text:
        a = text.index(BLOCK_BEGIN)
        b = text.index(BLOCK_END) + len(BLOCK_END)
        rest = text[b:]
        if rest.startswith("\n"):
            rest = rest[1:]
        return text[:a] + block + rest
    if text and not text.endswith("\n"):
        text += "\n"
    return text + ("\n" if text else "") + block


def ignored_by_block(text: str) -> List[str]:
    if BLOCK_BEGIN not in text or BLOCK_END not in text:
        return []
    body = text[text.index(BLOCK_BEGIN):text.index(BLOCK_END)]
    return [ln[1:] for ln in body.splitlines() if ln.startswith("/")]


# ------------------------------------------------------------------ verify

def verify(manifest: Optional[Dict[str, Any]], gitignore_text: str, examples: Path = EXAMPLES, root: Path = REPO,
           hash_files: bool = False) -> Dict[str, List[str]]:
    """{errors, warnings, notes}. Errors: a file the policy sends to release assets is not in the manifest or
    not ignored by git. Warnings: size/hash drift (re-renders) -> run --refresh before uploading."""
    errors: List[str] = []
    warnings: List[str] = []
    notes: List[str] = []
    if manifest is None:
        errors.append("examples/MEDIA.json is missing: run python scripts/publish_media.py --refresh")
        manifest = {"files": []}
    listed = {e["path"]: e for e in manifest.get("files", []) if isinstance(e, dict) and e.get("path")}
    blocked = set(ignored_by_block(gitignore_text))
    has_mov_rule = "examples/**/*.mov" in gitignore_text
    for p, size in scan(examples, root):
        why = reason_for(p, size)
        r = rel(p, root)
        e = listed.get(r)
        if why and not e:
            errors.append("%s (%.1f MB, %s) belongs in a release asset but is not in examples/MEDIA.json: "
                          "run python scripts/publish_media.py --refresh" % (r, size / 1e6, why))
            continue
        if why:
            ignored = r in blocked or (p.suffix.lower() in ALWAYS_RELEASE_EXT and has_mov_rule)
            if not ignored:
                errors.append("%s is a release asset but .gitignore does not exclude it: run python "
                              "scripts/publish_media.py --refresh" % r)
            if e.get("bytes") != size:
                warnings.append("%s changed size (%s -> %d bytes): run --refresh before --upload" % (r, e.get("bytes"), size))
            elif hash_files and e.get("sha256") and e["sha256"] != sha256_of(p):
                warnings.append("%s changed content (sha256 differs): run --refresh before --upload" % r)
        elif e:
            warnings.append("%s is listed in MEDIA.json but is now %.1f MB (stays in git): run --refresh" % (r, size / 1e6))
    for r, e in listed.items():
        if not (root / r).exists():
            notes.append("%s is not on this disk (a release asset: %s)" % (r, e.get("asset")))
    return {"errors": errors, "warnings": warnings, "notes": notes}


def load_manifest(path: Path = MANIFEST) -> Optional[Dict[str, Any]]:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return None


# ------------------------------------------------------------------ upload / links

def upload_command(manifest: Dict[str, Any], staged: Path, tag: str, repo: Optional[str], gh: str = "gh") -> List[str]:
    files = [str(staged / e["asset"]) for e in manifest.get("files", []) if not e.get("missing_locally")]
    cmd = [gh, "release", "upload", tag] + files + ["--clobber"]
    if repo:
        cmd += ["--repo", repo]
    return cmd


def stage(manifest: Dict[str, Any], root: Path, into: Path) -> List[Path]:
    """Hard-link (or copy) each file to its asset name: gh names an asset after the file."""
    out = []
    for e in manifest.get("files", []):
        if e.get("missing_locally"):
            continue
        src, dst = root / e["path"], into / e["asset"]
        try:
            os.link(str(src), str(dst))
        except OSError:
            shutil.copy2(str(src), str(dst))
        out.append(dst)
    return out


def links_markdown(manifest: Dict[str, Any], example: Optional[str] = None, repo: Optional[str] = None,
                   tag: Optional[str] = None) -> str:
    rows = []
    for e in manifest.get("files", []):
        parts = e["path"].split("/")
        if example and not (len(parts) > 1 and (parts[1] == example or parts[1].startswith(example + "-"))):
            continue
        rows.append("- [`%s`](%s) (%.1f MB)" % ("/".join(parts[2:]) or e["path"], url_for(manifest, e, repo, tag),
                                               int(e.get("bytes") or 0) / 1e6))
    return "\n".join(rows)


def fmt_mb(n: int) -> str:
    return "%.1f MB" % (n / 1e6)


def main(argv: Optional[Sequence[str]] = None) -> int:
    ap = argparse.ArgumentParser(description="Example media as GitHub release assets (see the module docstring).",
                                 formatter_class=argparse.RawDescriptionHelpFormatter, epilog=__doc__.split("\n\n", 1)[1])
    ap.add_argument("--refresh", action="store_true", help="rescan examples/ and rewrite MEDIA.json + the .gitignore block")
    ap.add_argument("--links", action="store_true", help="print markdown links to the release assets")
    ap.add_argument("--example", help="--links: only this example (number or folder name)")
    ap.add_argument("--upload", action="store_true", help="upload the assets with gh release upload")
    ap.add_argument("--dry-run", action="store_true", help="--upload: print the gh command, run nothing")
    ap.add_argument("--tag", help="release tag (default: MEDIA.json release.tag)")
    ap.add_argument("--repo", help="OWNER/NAME (default: MEDIA.json release.repo)")
    ap.add_argument("--hash", action="store_true", help="verify: also compare sha256 (slower)")
    ap.add_argument("--json", action="store_true", help="print the result as JSON")
    a = ap.parse_args(argv)

    if a.refresh:
        man = build_manifest(previous=load_manifest())
        MANIFEST.write_text(json.dumps(man, indent=2) + "\n", encoding="utf-8")
        text = GITIGNORE.read_text(encoding="utf-8") if GITIGNORE.is_file() else ""
        GITIGNORE.write_text(with_block(text, gitignore_block(man)), encoding="utf-8")
        s = man["summary"]
        if a.json:
            print(json.dumps(s, indent=2))
        else:
            print("examples/MEDIA.json: %d release assets (%s); %d files stay in git (%s)" % (
                s["release_files"], fmt_mb(s["release_bytes"]), s["git_files"], fmt_mb(s["git_bytes"])))
            print(".gitignore: managed block updated")
        return 0

    man = load_manifest()
    if a.links:
        if man is None:
            print("examples/MEDIA.json is missing: run python scripts/publish_media.py --refresh", file=sys.stderr)
            return 1
        print(links_markdown(man, a.example, a.repo, a.tag))
        return 0

    text = GITIGNORE.read_text(encoding="utf-8") if GITIGNORE.is_file() else ""
    res = verify(man, text, hash_files=a.hash or a.upload)
    if a.upload:
        if res["errors"] or res["warnings"]:
            for m in res["errors"] + res["warnings"]:
                print("  " + m, file=sys.stderr)
            print("the manifest does not match the files: run python scripts/publish_media.py --refresh first", file=sys.stderr)
            return 1
        rl = (man or {}).get("release") or {}
        tag = a.tag or rl.get("tag") or DEFAULT_TAG
        repo = a.repo or rl.get("repo")
        gh = shutil.which("gh")
        if a.dry_run:
            print(" ".join(upload_command(man, Path("<staging>"), tag, repo, gh="gh")))
            return 0
        if not gh:
            print("gh (the GitHub CLI) is not installed: https://cli.github.com, then gh auth login", file=sys.stderr)
            return 1
        with tempfile.TemporaryDirectory(prefix="st-media-") as d:
            stage(man, REPO, Path(d))
            cp = subprocess.run(upload_command(man, Path(d), tag, repo, gh=gh))
        if cp.returncode == 0:
            print(links_markdown(man, None, repo, tag))
        return cp.returncode

    if a.json:
        print(json.dumps(dict(res, summary=(man or {}).get("summary")), indent=2))
    else:
        for m in res["errors"]:
            print("ERROR  " + m)
        for m in res["warnings"]:
            print("WARN   " + m)
        s = (man or {}).get("summary") or {}
        print("publish_media: %d error(s), %d warning(s); %d release assets (%s), %d files in git (%s)" % (
            len(res["errors"]), len(res["warnings"]), s.get("release_files", 0), fmt_mb(s.get("release_bytes", 0)),
            s.get("git_files", 0), fmt_mb(s.get("git_bytes", 0))))
    return 1 if res["errors"] else 0


if __name__ == "__main__":
    sys.exit(main())
