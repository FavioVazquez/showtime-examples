"""Researcher pass (done by the director, no sub-agent tool in this session): re-derive every
number the video shows or says from the frozen EIA snapshot and write claims.verified.json."""
import csv, json, sys
from pathlib import Path
src = Path(sys.argv[1])  # us-generation-annual-twh.csv
rows = {int(r["year"]): {k: float(v) for k, v in r.items() if k != "year"} for r in csv.DictReader(src.open())}
R = lambda x: round(x)
claims = []
def c(text, where, value, expect):
    claims.append({"claim": text, "where": where, "derived": value, "shown": expect,
                   "verdict": "verified" if str(value) == str(expect) else "MISMATCH"})
peak = max(rows, key=lambda y: rows[y]["coal"])
c("Coal peaked in 2007", "coal-era marker, source card", peak, 2007)
c("Coal 2007 = 2,016 TWh", "coal-era marker", f'{R(rows[2007]["coal"]):,}', "2,016")
c("Coal share 2007 = 48.5 %", "coal-era marker", f'{100*rows[2007]["coal"]/rows[2007]["total"]:.1f}', "48.5")
sh = [100*rows[y]["coal"]/rows[y]["total"] for y in range(1949, 2009)]
c("Coal about half, 1949-2008 (range)", "coal-era title, VO", f"{min(sh):.1f}-{max(sh):.1f}", "44.0-56.9")
c("Gas passes coal first in 2016", "gas title, source card", next(y for y in sorted(rows) if rows[y]["natural_gas"] > rows[y]["coal"]), 2016)
c("2016: gas 1,379, coal 1,239 TWh", "gas marker", f'{R(rows[2016]["natural_gas"]):,}/{R(rows[2016]["coal"]):,}', "1,379/1,239")
c("Gas ahead of coal every year 2016-2025", "VO gas", all(rows[y]["natural_gas"] > rows[y]["coal"] for y in range(2016, 2026)), True)
c("Wind + solar under 1 % in 2007 (35 TWh)", "newcomers marker, VO", f'{R(rows[2007]["wind_solar"])}/{100*rows[2007]["wind_solar"]/rows[2007]["total"]:.1f}', "35/0.8")
c("Wind + solar pass coal first in 2024", "hook, newcomers, source card", next(y for y in sorted(rows) if rows[y]["wind_solar"] > rows[y]["coal"]), 2024)
c("2024: 672 vs 652 TWh", "hook count-ups, newcomers marker", f'{R(rows[2024]["wind_solar"])}/{R(rows[2024]["coal"])}', "672/652")
c("2025: 760 vs 737 TWh", "newcomers end labels", f'{R(rows[2025]["wind_solar"])}/{R(rows[2025]["coal"])}', "760/737")
c("Gas 2025 = 1,807 TWh", "gas/newcomers end label", f'{R(rows[2025]["natural_gas"]):,}', "1,807")
T = rows[2025]["total"]
c("2025 total 4,430 TWh", "mix subtitle and footnote", f"{R(T):,}", "4,430")
for k, lab, v in [("natural_gas", "Natural gas", "40.8"), ("nuclear", "Nuclear", "17.7"), ("wind_solar", "Wind + solar", "17.2"), ("coal", "Coal", "16.6"), ("hydro", "Hydro", "5.6"), ("other", "Other", "2.1")]:
    c(f"2025 share {lab} {v} %", "mix-2025 bars", f"{100*rows[2025][k]/T:.1f}", v)
c("Coal 2024 share 15.1 %", "mix ref line", f'{100*rows[2024]["coal"]/rows[2024]["total"]:.1f}', "15.1")
c("Coal +13 % in 2025", "mix callout, VO", f'{100*(rows[2025]["coal"]/rows[2024]["coal"]-1):.0f}', "13")
c("Gas about 41 % (VO)", "VO mix", f'{100*rows[2025]["natural_gas"]/T:.0f}', "41")
yrs = range(2005, 2026)
first_gas_top = next(y for y in yrs if rows[y]["natural_gas"] > max(rows[y][k] for k in ("coal", "nuclear", "hydro", "wind", "solar")))
c("Race: gas takes the top spot (2016)", "race VO", first_gas_top, 2016)
c("Race: wind passes hydro (2019)", "race VO", next(y for y in yrs if rows[y]["wind"] > rows[y]["hydro"]), 2019)
c("Race: neither wind nor solar alone passes coal", "race (sources shown separately)", all(rows[y]["wind"] < rows[y]["coal"] and rows[y]["solar"] < rows[y]["coal"] for y in yrs), True)
out = {"source": "U.S. EIA, Monthly Energy Review (August 2026), Table 7.2a, snapshot accessed 2026-09-27; solar = utility-scale; 1949-1988 non-hydro = electric utilities only",
       "claims": claims, "all_verified": all(x["verdict"] == "verified" for x in claims)}
Path(sys.argv[2]).write_text(json.dumps(out, indent=1))
print(len(claims), "claims;", "all verified" if out["all_verified"] else [x for x in claims if x["verdict"] != "verified"])
