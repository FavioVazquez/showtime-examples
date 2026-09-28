# motion-designer: scenes race, mix-2025 (stock hbar charts)   [done inline by the director]
Deliver: power.js `row-kit` (colour + Lucide icon per row, VO-timed focus, bracket) and `year-tick`;
race JSON state titles replaced by a `year` field (a title per 0.25 s state would flicker).
Inputs: data/race-2005-2025.json (--chart race --step 0.25 --top 6), data/mix-2025.json (--chart hbar --top 6 --ref).
Done when: no interpolated value is ever shown as a number (race value labels hidden), check PASS.
