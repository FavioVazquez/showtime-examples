"""Copy the shared sting sources from sting-16x9/ (the master) into the 1:1 and 9:16 projects.
Each aspect is its own project (its own showtime.json size); only index.html and showtime.json differ."""
import shutil
from pathlib import Path
here = Path(__file__).resolve().parent
src = here / 'sting-16x9'
for name in ('sting-1x1', 'sting-9x16'):
    dst = here / name
    for f in ('sting.js', 'sting.css'):
        shutil.copy2(src / f, dst / f)
    for d in ('assets', 'audio'):
        if (src / d).exists():
            shutil.rmtree(dst / d, ignore_errors=True)
            shutil.copytree(src / d, dst / d, ignore=shutil.ignore_patterns('*.work', 'mix.wav', 'mix.report.json'))
    print('synced', name)
