"""Abre cada página publicada (servida por un http.server temporal) con chromium a 1200 y 400 px:
sin errores de consola ni excepciones, sin desborde horizontal. Guarda capturas en <salida>/capturas/."""
from __future__ import annotations

import functools
import http.server
import json
import os
import subprocess
import threading

from comun import CHEQUEOS, RAIZ, Contexto, Resultado, html_render, rel

ANCHOS = (1200, 400)


class _Silencioso(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


def servidor():
    h = functools.partial(_Silencioso, directory=str(RAIZ))
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), h)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv


def correr(ctx: Contexto) -> Resultado:
    r = Resultado("paginas")
    paginas = [rel(p) for p in html_render()]
    out = ctx.salida / "capturas"
    out.mkdir(parents=True, exist_ok=True)
    for viejo in out.glob("*.jpg"):
        viejo.unlink()
    srv = servidor()
    base = f"http://127.0.0.1:{srv.server_address[1]}/"
    try:
        cmd = ["node", str(CHEQUEOS / "paginas.js"), "--base", base, "--out", str(out),
               "--anchos", ",".join(map(str, ANCHOS))]
        if os.environ.get("FABRICA_RED") == "1":
            cmd.append("--red")
        proc = subprocess.run(cmd + paginas, capture_output=True, text=True, timeout=60 * 30, cwd=RAIZ)
    finally:
        srv.shutdown()
    if proc.returncode != 0:
        r.falla(f"paginas.js terminó con código {proc.returncode}: {proc.stderr.strip()[:800]}")
        return r.cerrar("no se pudo correr playwright")
    res = json.loads(proc.stdout)
    filas = []
    for x in res:
        clave = f"{x['pagina']} @ {x['ancho']} px"
        for e in x["errores"]:
            r.falla(f"{clave}: {e}")
        if x["desborde"]:
            culp = "; ".join(f"{c['sel']} hasta {c['derecha']} px" for c in x["culpables"]) or "sin culpable visible"
            r.falla(f"{clave}: desborde horizontal (documento de {x['anchoDoc']} px). Culpables: {culp}")
        estado = "OK" if not x["errores"] and not x["desborde"] else "FALLA"
        filas.append(f"| {x['pagina']} | {x['ancho']} | {estado} | {len(x['errores'])} | {'sí' if x['desborde'] else 'no'} | {x['ms'] / 1000:.1f} s |")
    r.detalle_md = ("| página | ancho | estado | errores | desborde | tiempo |\n|---|---|---|---|---|---|\n" + "\n".join(filas)
                    + f"\n\nCapturas en `{out.relative_to(RAIZ) if out.is_relative_to(RAIZ) else out}`.")
    return r.cerrar(f"{len(paginas)} páginas × {len(ANCHOS)} anchos; {len(r.errores)} problemas")
