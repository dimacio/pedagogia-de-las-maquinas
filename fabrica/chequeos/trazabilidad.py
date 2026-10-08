"""Matriz objetivo × (página, notebook, cuestionario), leyendo las marcas de CONVENCIONES §2:
data-objetivos en los bloques de la página, tags "objetivo:Ox" en las celdas del notebook y `objetivo` en cada pregunta.
Falla si un objetivo del spine no está cubierto o si un artefacto nombra un objetivo que el spine no tiene.
Escribe la matriz en el reporte y en fabrica/reportes/trazabilidad.html."""
from __future__ import annotations

import html
import re
from datetime import datetime

from comun import (REPORTES, RAIZ, Contexto, Resultado, clases, datos_js, fuente_celda, leer_nb, notebook_de,
                   objetivos_spine, pagina_de, rel, sopa, spines)

TAG_RE = re.compile(r"^objetivo:(\S+)$")


def marcas_pagina(path) -> tuple[dict[str, list[str]], int, int]:
    """{objetivo: [bloques]}, bloques totales, bloques marcados."""
    s = sopa(path)
    bloques = s.select("section.bloque")
    out: dict[str, list[str]] = {}
    marcados = 0
    for i, el in enumerate(s.select("[data-objetivos]"), 1):
        marcados += 1
        nombre = el.get("id") or el.get("aria-labelledby") or f"bloque {i}"
        if el.get("aria-labelledby"):
            t = s.find(id=el["aria-labelledby"])
            if t:
                nombre = t.get_text(" ", strip=True)[:40]
        for oid in el["data-objetivos"].split():
            out.setdefault(oid, []).append(nombre)
    return out, len(bloques), marcados


def marcas_notebook(path) -> tuple[dict[str, list[str]], int]:
    nb = leer_nb(path)
    out: dict[str, list[str]] = {}
    n = 0
    for i, c in enumerate(nb["cells"]):
        tags = (c.get("metadata") or {}).get("tags") or []
        ids = [m.group(1) for t in tags if (m := TAG_RE.match(str(t)))]
        if not ids:
            continue
        n += 1
        primera = next((l.lstrip("# ").strip() for l in fuente_celda(c).splitlines() if l.strip()), f"celda {i}")
        for oid in ids:
            out.setdefault(oid, []).append(primera[:40])
    return out, n


def marcas_cuestionario(m: dict | None) -> tuple[dict[str, list[str]], int, int]:
    out: dict[str, list[str]] = {}
    Q = (m or {}).get("cuestionario") or []
    n = 0
    for i, q in enumerate(Q, 1):
        if isinstance(q, dict) and q.get("objetivo"):
            n += 1
            out.setdefault(str(q["objetivo"]), []).append(f"P{i}")
    return out, len(Q), n


def correr(ctx: Contexto) -> Resultado:
    r = Resultado("trazabilidad")
    S = spines()
    M = datos_js()["modulos"]
    filas_md, secciones_html = [], []
    cubiertos = total_obj = 0
    for c in clases():
        cid = c["id"]
        pag, nbp = pagina_de(c), notebook_de(c)
        mp, nbloques, nmarc = marcas_pagina(pag) if pag.exists() else ({}, 0, 0)
        mn, nceldas = marcas_notebook(nbp) if nbp and nbp.exists() else ({}, 0)
        mq, npreg, nqmarc = marcas_cuestionario(M.get(cid))
        spine = S.get(cid)
        y = spine[1] if spine else None
        objs = objetivos_spine(y)
        textos = {str(o.get("id")): str(o.get("texto", "")) for o in (y or {}).get("objetivos") or [] if isinstance(o, dict)}
        faltan, sin_marcas = [], set()
        if not nmarc:
            faltan.append(f"página ({nbloques} bloques sin data-objetivos)"); sin_marcas.add("pagina")
        if nbp and not nceldas:
            faltan.append("notebook (ninguna celda con tag objetivo:)"); sin_marcas.add("notebook")
        if not nqmarc:
            faltan.append(f"cuestionario ({npreg} preguntas sin objetivo)"); sin_marcas.add("cuestionario")
        if faltan:
            r.falla(f"[{cid}] faltan marcas en: " + "; ".join(faltan))
        if not spine or not objs:
            r.falla(f"[{cid}] sin spine con objetivos (specs/{cid}.md): no se puede trazar")
            secciones_html.append((c, None, "Sin spine: no hay objetivos contra los que trazar."))
            filas_md.append(f"| {cid} | — | sin spine | | | |")
            continue
        # ids inexistentes
        for nombre, marcas in (("página", mp), ("notebook", mn), ("cuestionario", mq)):
            for oid in marcas:
                if oid not in objs:
                    r.falla(f"[{cid}] {nombre} nombra {oid}, que no está en specs/{cid}.md")
        filas = []
        for oid in objs:
            total_obj += 1
            celdas = {"pagina": mp.get(oid), "notebook": mn.get(oid) if nbp else "n/a", "cuestionario": mq.get(oid)}
            huecos = [k for k, v in celdas.items() if not v]
            if not huecos:
                cubiertos += 1
            elif [h for h in huecos if h not in sin_marcas]:   # si el artefacto no tiene ninguna marca ya se dijo arriba
                r.falla(f"[{cid}] {oid} no está cubierto en: {', '.join(h for h in huecos if h not in sin_marcas)}")
            filas.append((oid, textos.get(oid, ""), celdas))
            fmt = lambda v: "n/a" if v == "n/a" else (", ".join(v) if v else "**falta**")
            filas_md.append(f"| {cid} | {oid} | {fmt(celdas['pagina'])} | {fmt(celdas['notebook'])} | {fmt(celdas['cuestionario'])} | {'sí' if not huecos else 'no'} |")
        secciones_html.append((c, filas, None))
    r.detalle_md = ("| clase | objetivo | página | notebook | cuestionario | cubierto |\n|---|---|---|---|---|---|\n"
                    + "\n".join(filas_md))
    escribir_html(secciones_html, cubiertos, total_obj)
    return r.cerrar(f"{cubiertos} de {total_obj} objetivos cubiertos en los tres artefactos; {len(r.errores)} problemas; "
                    f"matriz en {rel(REPORTES / 'trazabilidad.html')}")


def escribir_html(secciones, cubiertos, total):
    e = html.escape
    partes = []
    for c, filas, nota in secciones:
        cab = f'<h2>{e(c["bloque"])} · {e(c["titulo"])}</h2>'
        if nota:
            partes.append(f'<section class="traza">{cab}<p class="muted small">{e(nota)}</p></section>')
            continue
        tr = []
        for oid, texto, celdas in filas:
            def td(v):
                if v == "n/a":
                    return '<td class="muted">n/a</td>'
                return f"<td>{e(', '.join(v))}</td>" if v else '<td class="falta">falta</td>'
            tr.append(f'<tr><th scope="row">{e(oid)}</th><td>{e(texto)}</td>{td(celdas["pagina"])}{td(celdas["notebook"])}{td(celdas["cuestionario"])}</tr>')
        partes.append(f'<section class="traza">{cab}<div class="tabla"><table><thead><tr><th>Objetivo</th><th>Texto</th>'
                      f'<th>Página</th><th>Notebook</th><th>Cuestionario</th></tr></thead><tbody>{"".join(tr)}</tbody></table></div></section>')
    doc = f"""<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Trazabilidad · RL a ciegas</title>
<link rel="stylesheet" href="../../assets/estilo.css">
<style>
  main {{ padding: 24px 16px 48px; display: grid; gap: 28px; }}
  .traza {{ display: grid; gap: 10px; }}
  .traza h2 {{ font-size: 18px; }}
  .tabla {{ overflow-x: auto; }}
  td.falta {{ color: var(--ember); font-weight: 700; }}
</style>
</head>
<body>
<main class="wrap">
  <header class="prose"><h1>Trazabilidad</h1>
    <p class="muted">Objetivos de cada spine contra las marcas de la página (<code>data-objetivos</code>), del notebook (tags
    <code>objetivo:Ox</code>) y del cuestionario (<code>objetivo</code>). {cubiertos} de {total} objetivos cubiertos.
    Generado por <code>fabrica/chequeos/correr.py</code> el {datetime.now():%Y-%m-%d %H:%M}.</p></header>
  {"".join(partes)}
</main>
</body>
</html>
"""
    REPORTES.mkdir(parents=True, exist_ok=True)
    (REPORTES / "trazabilidad.html").write_text(doc, encoding="utf-8")
