"""Put the collapse-beat sub-drop and rumble on the spoken word, after `showtime retime --from-voice`.
usage: python3 sync_sfx.py <project> <word in the summit line>"""
import json, sys, pathlib
p = pathlib.Path(sys.argv[1]); word = sys.argv[2].lower()
w = json.loads((p / 'voice' / 'captions.words.json').read_text(encoding='utf-8'))['words']
hit = next(x for x in w if x.get('line') == 'summit' and x['text'].lower().strip('.,;:') == word)
mix = json.loads((p / 'audio' / 'mix.json').read_text(encoding='utf-8'))
for t in mix['tracks']:
    if t.get('id') == 'sub': t['at'] = round(hit['start'], 3)
    if t.get('id') == 'rumble': t['start'] = round(hit['start'] - 0.19, 3)
(p / 'audio' / 'mix.json').write_text(json.dumps(mix, indent=1, ensure_ascii=False), encoding='utf-8')
print(f"{p.name}: collapse beat on '{hit['text']}' at {hit['start']:.3f}s")
