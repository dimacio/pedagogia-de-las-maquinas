"""Ejecuta notebooks/10-agentes-de-lenguaje.ipynb en el lugar (como nbconvert --execute --inplace) y, en el mismo
kernel, exporta los datos pregrabados que usa la página clases/10-agentes-de-lenguaje.html a build/datos_10.json."""
import json, pathlib, time
import nbformat
from nbclient import NotebookClient

ROOT = pathlib.Path(__file__).resolve().parent.parent
NB = ROOT / "notebooks" / "10-agentes-de-lenguaje.ipynb"
OUT = ROOT / "build" / "datos_10.json"
EXPORT = r'''
import json as _j, numpy as _np
def _l(x): return [float(v) for v in _np.asarray(x).ravel()]
_d = {
 "estados": [{k: e.get(k) for k in ("nombre", "sistema", "usuario", "prefijo", "dist", "muestras")} for e in ESTADOS],
 "episodio": EPISODIO,
 "grupos": [{"pregunta": g["pregunta"], "correcta": g["correcta"], "respuestas": g["respuestas"], "recompensas": _l(g["recompensas"]), "ventajas": [round(v, 4) for v in _l(g["ventajas"])]} for g in GRUPOS],
 "cueva": {"mapa": MINI_CUEVA, "respuestas": CUEVA["respuestas"], "recompensas": _l(CUEVA["recompensas"]), "caminos": CUEVA["caminos"]},
 "paso": PASO, "tasa": TASA, "paso_pregunta": g["pregunta"],
 "trazas": TRAZAS, "contexto": CONTEXTO, "memoria": MEMORIA, "hack": HACK, "juez": JUEZ,
 "biblioteca": BIBLIOTECA, "sistema_agente": SISTEMA_AGENTE,
}
open(%r, "w").write(_j.dumps(_d, ensure_ascii=False, indent=1))
print("exportado")
''' % str(OUT)

nb = nbformat.read(NB, as_version=4)
t = time.time()
c = NotebookClient(nb, timeout=1500, kernel_name="python3", resources={"metadata": {"path": str(NB.parent)}})
with c.setup_kernel():
    for i, cell in enumerate(nb.cells):
        c.execute_cell(cell, i)
    extra = nbformat.v4.new_code_cell(EXPORT)
    nb.cells.append(extra)
    c.execute_cell(extra, len(nb.cells) - 1)
    print("".join(o.get("text", "") for o in extra.outputs))
    nb.cells.pop()
nbformat.write(nb, NB)
print(f"\nejecutado en {time.time() - t:.0f} s →", NB)
