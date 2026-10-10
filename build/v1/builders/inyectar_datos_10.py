"""Inserta build/datos_10.json (salidas reales del notebook 10) en clases/10-agentes-de-lenguaje.html."""
import json, pathlib, re
ROOT = pathlib.Path(__file__).resolve().parent.parent
d = json.loads((ROOT / "build" / "datos_10.json").read_text())
txt = json.dumps(d, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
p = ROOT / "clases" / "10-agentes-de-lenguaje.html"
html = p.read_text()
html, n = re.subn(r"/\*DATOS\*/.*?/\*FIN\*/", lambda m: "/*DATOS*/" + txt + "/*FIN*/", html, flags=re.S)
assert n == 1, n
p.write_text(html)
print(f"insertados {len(txt) / 1024:.0f} KB en", p)
