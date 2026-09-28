import sys, pathlib, pypdf, pypdfium2 as pdfium
src = pathlib.Path(sys.argv[1]); out = pathlib.Path(sys.argv[2]); out.mkdir(parents=True, exist_ok=True)
r = pypdf.PdfReader(str(src))
txt = []
for i, p in enumerate(r.pages, 1):
    txt.append(f"=== page {i} ===\n" + (p.extract_text() or ""))
(out / "text.txt").write_text("\n".join(txt), encoding="utf-8")
doc = pdfium.PdfDocument(str(src))
for i in range(len(doc)):
    img = doc[i].render(scale=3).to_pil()   # 216 dpi
    img.save(out / f"page-{i+1}.png"); print(out / f"page-{i+1}.png", img.size)
