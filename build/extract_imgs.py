"""Extrae las figuras PNG de un notebook ejecutado a build/img_<nb>/ para revisarlas."""
import base64, pathlib, sys
import nbformat

nb_path = pathlib.Path(sys.argv[1])
out = pathlib.Path(__file__).parent / f"img_{nb_path.stem}"
out.mkdir(exist_ok=True)
for f in out.glob("*.png"):
    f.unlink()
nb = nbformat.read(nb_path, as_version=4)
k = 0
for i, c in enumerate(nb.cells):
    if c.cell_type != "code":
        continue
    for o in c.get("outputs", []):
        if o.get("output_type") == "error":
            print("ERROR en celda", i, o["ename"], o["evalue"])
        if o.get("output_type") == "stream":
            print(f"[celda {i}] {o['text'][:600]}")
        data = o.get("data", {})
        if "image/png" in data:
            k += 1
            p = out / f"{k:02d}_celda{i}.png"
            p.write_bytes(base64.b64decode(data["image/png"]))
            print("img", p.name)
