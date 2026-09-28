"""Reduce EIA MER Table 7.2a (long CSV, million kWh) to the tables the video charts.

Input : eia-mer-T07.02A-2026-09-27.csv  (frozen snapshot, MER August 2026, accessed 2026-09-27)
Output: us-generation-annual-twh.csv    year, coal, natural_gas, nuclear, hydro, wind, solar,
                                        wind_solar, other, total  (TWh = million kWh / 1000)
        us-generation-race-2005-2025.csv  the six named sources, 2005-2025 (TWh, whole numbers)
        us-mix-2025-shares.csv            2025 share of the total per group (%, one decimal)
Annual rows only (YYYYMM ends in 13). "Not Available" (wind before 1983, solar before 1984)
is written as 0 in the wide table and noted in SOURCE.txt. "other" = total - the six named
series (petroleum, other fossil gases, wood, waste, geothermal, pumped storage (negative), other).
Nothing is smoothed or filled beyond that.
"""
import csv
from pathlib import Path

HERE = Path(__file__).parent
SRC = HERE / "eia-mer-T07.02A-2026-09-27.csv"
CODES = {"CLETPUS": "coal", "NGETPUS": "natural_gas", "NUETPUS": "nuclear", "HVETPUS": "hydro",
         "WYETPUS": "wind", "SOETPUS": "solar", "ELETPUS": "total"}
rows = {}
for r in csv.DictReader(SRC.open(newline="")):
    ym = r["YYYYMM"]
    if not ym.endswith("13") or r["MSN"] not in CODES:
        continue
    v = r["Value"]
    val = 0.0 if v == "Not Available" else float(v)
    rows.setdefault(int(ym[:4]), {})[CODES[r["MSN"]]] = val / 1000.0  # TWh

cols = ["coal", "natural_gas", "nuclear", "hydro", "wind", "solar"]
out = []
for y in sorted(rows):
    d = rows[y]
    ws = d["wind"] + d["solar"]
    other = d["total"] - sum(d[c] for c in cols)
    out.append({"year": y, **{c: round(d[c], 3) for c in cols}, "wind_solar": round(ws, 3),
                "other": round(other, 3), "total": round(d["total"], 3)})

with (HERE / "us-generation-annual-twh.csv").open("w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=list(out[0]))
    w.writeheader(); w.writerows(out)

with (HERE / "us-generation-race-2005-2025.csv").open("w", newline="") as f:
    names = {"coal": "Coal", "natural_gas": "Natural gas", "nuclear": "Nuclear", "hydro": "Hydro",
             "wind": "Wind", "solar": "Solar"}
    w = csv.writer(f)
    w.writerow(["year"] + [names[c] for c in cols])
    for d in out:
        if 2005 <= d["year"] <= 2025:
            w.writerow([d["year"]] + [round(d[c]) for c in cols])

d25 = next(d for d in out if d["year"] == 2025)
T = d25["total"]
share = [("Natural gas", d25["natural_gas"]), ("Nuclear", d25["nuclear"]),
         ("Wind + solar", d25["wind_solar"]), ("Coal", d25["coal"]), ("Hydro", d25["hydro"]),
         ("Other", d25["other"])]
with (HERE / "us-mix-2025-shares.csv").open("w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["source", "share_pct"])
    for n, v in share:
        w.writerow([n, f"{100 * v / T:.1f}"])

# the checks the story rests on (printed so the log proves them)
by = {d["year"]: d for d in out}
peak = max(out, key=lambda d: d["coal"])
print("coal peak", peak["year"], round(peak["coal"]), "share %.1f" % (100 * peak["coal"] / peak["total"]))
print("gas>coal first", next(d["year"] for d in out if d["natural_gas"] > d["coal"]))
print("ws>coal first", next(d["year"] for d in out if d["wind_solar"] > d["coal"]))
for y in (2016, 2024, 2025):
    d = by[y]; print(y, "coal", round(d["coal"]), "gas", round(d["natural_gas"]), "ws", round(d["wind_solar"]), "total", round(d["total"]))
print("2025 shares", [(n, round(100 * v / T, 1)) for n, v in share])
print("coal 24->25 %+.1f%%" % (100 * (by[2025]["coal"] / by[2024]["coal"] - 1)))
print("coal share 2024 %.1f" % (100 * by[2024]["coal"] / by[2024]["total"]))
