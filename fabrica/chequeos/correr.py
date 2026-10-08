#!/usr/bin/env python3
"""Control de calidad de "RL a ciegas": corre los chequeos de la fábrica (contrato: fabrica/CONVENCIONES.md).

uso: python fabrica/chequeos/correr.py [--rapido] [--solo nombre,...] [--reporte salida.md]
                                       [--estricto] [--salida DIR] [--timeout-nb SEG] [--jobs-nb N]

--rapido   saltea los enlaces externos y los notebooks marcados como lentos (lo que corre el CI en cada PR).
--estricto los enlaces externos caídos hacen fallar (por defecto solo advierten).
Devuelve 0 si ningún chequeo falla; las advertencias y los salteados no cambian el código de salida.
Variables: FUENTES_DIR (fuentes en .txt para originalidad), PLAYWRIGHT_MODULE (ruta al módulo de node),
FABRICA_RED=1 (deja que las páginas carguen recursos externos, como las fuentes de Google).
"""
from __future__ import annotations

import argparse
import importlib
import sys
import time
import traceback
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from comun import ADVERTENCIA, FALLA, ICONO, OK, RAIZ, REPORTES, SALTEADO, Contexto, Resultado  # noqa: E402

CHEQUEOS = ["spines", "cuestionarios", "enlaces_internos", "citas", "trazabilidad", "originalidad",
            "datos_sueltos", "paginas", "notebooks", "enlaces_externos"]
MAX_LINEAS = 80   # por chequeo, en el reporte


def reporte_md(res: list[Resultado], ctx: Contexto, total: float) -> str:
    modo = "rápido" if ctx.rapido else "completo"
    malos = [r.nombre for r in res if r.estado == FALLA]
    out = [f"# Calidad de RL a ciegas — {'FALLA' if malos else 'OK'}", "",
           f"Modo {modo}{', estricto' if ctx.estricto else ''} · {datetime.now():%Y-%m-%d %H:%M} · {total:.0f} s", "",
           "| chequeo | estado | resumen | tiempo |", "|---|---|---|---|"]
    for r in res:
        out.append(f"| {r.nombre} | {ICONO[r.estado]} | {r.resumen.replace('|', '/')} | {r.segundos:.1f} s |")
    for r in res:
        if r.estado in (OK, SALTEADO) and not r.detalle_md:
            continue
        out += ["", f"## {r.nombre} — {ICONO[r.estado]}", "", r.resumen, ""]
        for titulo, lista in (("Errores", r.errores), ("Advertencias", r.avisos)):
            if lista:
                out.append(f"**{titulo} ({len(lista)})**")
                out.append("")
                out += [f"- {x}" for x in lista[:MAX_LINEAS]]
                if len(lista) > MAX_LINEAS:
                    out.append(f"- … y {len(lista) - MAX_LINEAS} más")
                out.append("")
        if r.detalle_md:
            out += ["<details><summary>Detalle</summary>", "", r.detalle_md, "", "</details>"]
    return "\n".join(out) + "\n"


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--rapido", action="store_true")
    ap.add_argument("--solo", default="", help="lista separada por comas: " + ",".join(CHEQUEOS))
    ap.add_argument("--reporte", type=Path, help="escribe el reporte en Markdown en este archivo")
    ap.add_argument("--estricto", action="store_true")
    ap.add_argument("--salida", type=Path, default=REPORTES, help="directorio para capturas (default fabrica/reportes)")
    ap.add_argument("--timeout-nb", type=int, default=None, help="segundos por notebook (default 900 rápido, 2400 completo)")
    ap.add_argument("--jobs-nb", type=int, default=1, help="notebooks en paralelo")
    a = ap.parse_args(argv)
    solo = [s.strip() for s in a.solo.split(",") if s.strip()]
    for s in solo:
        if s not in CHEQUEOS:
            ap.error(f"chequeo desconocido: {s} (hay: {', '.join(CHEQUEOS)})")
    ctx = Contexto(rapido=a.rapido, estricto=a.estricto, salida=a.salida.resolve(),
                   timeout_nb=a.timeout_nb or (900 if a.rapido else 2400), jobs_nb=a.jobs_nb)
    res: list[Resultado] = []
    t0 = time.time()
    for nombre in (solo or CHEQUEOS):
        print(f"· {nombre} …", end=" ", flush=True)
        t = time.time()
        try:
            r = importlib.import_module(nombre).correr(ctx)
        except Exception as e:  # noqa: BLE001
            r = Resultado(nombre)
            r.falla(f"el chequeo se cayó: {type(e).__name__}: {e}")
            r.detalle_md = "```\n" + traceback.format_exc()[-3000:] + "\n```"
            r.cerrar("error interno del chequeo")
        r.segundos = time.time() - t
        res.append(r)
        print(f"{ICONO[r.estado]} ({r.segundos:.1f} s) {r.resumen}", flush=True)
        for e in r.errores[:8]:
            print(f"    ✗ {e}")
        if len(r.errores) > 8:
            print(f"    … y {len(r.errores) - 8} errores más (ver el reporte)")
    md = reporte_md(res, ctx, time.time() - t0)
    if a.reporte:
        a.reporte.parent.mkdir(parents=True, exist_ok=True)
        a.reporte.write_text(md, encoding="utf-8")
        print(f"reporte: {a.reporte}")
    fallas = [r.nombre for r in res if r.estado == FALLA]
    avisos = [r.nombre for r in res if r.estado == ADVERTENCIA]
    print(f"\n{'FALLA' if fallas else 'OK'}: {len(res) - len(fallas)}/{len(res)} sin fallas"
          + (f"; fallan: {', '.join(fallas)}" if fallas else "") + (f"; avisos: {', '.join(avisos)}" if avisos else ""))
    return 1 if fallas else 0


if __name__ == "__main__":
    sys.exit(main())
