"""Cada specs/<id>.md tiene encabezado YAML válido con los campos obligatorios (CONVENCIONES §1), su id coincide con el
nombre del archivo y con CLASES de cueva.js, y la página y el notebook que nombra existen (y son los de CLASES)."""
from __future__ import annotations

import re

from comun import RAIZ, Contexto, Resultado, clase_por_id, clases, en_preparacion, objetivos_spine, rel, spines

OBLIGATORIOS = ("id", "titulo", "unidad", "estado", "pagina", "notebook", "previos", "objetivos", "fuentes")
ESTADOS = {"borrador", "en-produccion", "publicada"}
OBJ_RE, FUENTE_RE = re.compile(r"^O\d+$"), re.compile(r"^F\d+$")
CUBRE_RE = re.compile(r"^#{2,4}\s.*\(cubre:\s*([^)]*)\)", re.M)


def correr(ctx: Contexto) -> Resultado:
    r = Resultado("spines")
    S = spines()
    cls = clase_por_id()
    prep = en_preparacion()
    if not S:
        r.falla(f"faltan specs: no hay ningún specs/<id>.md (se esperan {len(cls)}: {', '.join(cls)})")
        return r.cerrar(f"0 de {len(cls)} spines")
    for cid in cls:
        if cid not in S:
            r.falla(f"falta specs/{cid}.md")
    for nombre, (p, y, cuerpo, err) in S.items():
        k = rel(p)
        if err:
            r.falla(f"{k}: {err}")
            continue
        for campo in OBLIGATORIOS:
            if campo not in y:
                r.falla(f"{k}: falta el campo `{campo}`")
        cid = str(y.get("id", ""))
        if cid != nombre:
            r.falla(f"{k}: id «{cid}» no coincide con el nombre del archivo")
        c = cls.get(cid)
        if c is None:
            r.falla(f"{k}: id «{cid}» no está en CLASES de cueva.js")
        if not str(y.get("titulo") or "").strip():
            r.falla(f"{k}: `titulo` vacío")
        elif c and y["titulo"] != c["titulo"]:
            r.aviso(f"{k}: titulo «{y['titulo']}» distinto del de cueva.js «{c['titulo']}»")
        uni = y.get("unidad")
        if uni not in (1, 2, 3, 4, "N"):
            r.falla(f"{k}: unidad = {uni!r} (1–4 o \"N\")")
        elif c and str(uni) != str(c.get("unidad")):
            r.falla(f"{k}: unidad {uni} distinta de la de cueva.js ({c.get('unidad')})")
        if "estado" in y and y["estado"] not in ESTADOS:
            r.falla(f"{k}: estado = {y['estado']!r} (borrador | en-produccion | publicada)")
        pronto = cid in prep
        if pronto and y.get("estado") != "borrador":
            r.falla(f"{k}: la clase está en preparación (pronto en cueva.js) y su estado es «{y.get('estado')}»")
        pag = y.get("pagina")
        if pronto and pag and not (RAIZ / str(pag)).is_file():
            r.aviso(f"{k}: en preparación, todavía sin página")
        elif not pag or not (RAIZ / str(pag)).is_file():
            r.falla(f"{k}: pagina «{pag}» no existe")
        elif c and pag != f"clases/{c['archivo']}":
            r.falla(f"{k}: pagina «{pag}» distinta de la de cueva.js (clases/{c['archivo']})")
        if "notebook" in y:
            nb = y["notebook"]
            if nb is not None and not (RAIZ / str(nb)).is_file() and not pronto:
                r.falla(f"{k}: notebook «{nb}» no existe")
            esperado = f"notebooks/{c['nb']}" if c and c.get("nb") else None
            if c and nb != esperado:
                r.falla(f"{k}: notebook «{nb}» distinto del de cueva.js ({esperado})")
        prev = y.get("previos")
        if not isinstance(prev, list):
            r.falla(f"{k}: previos tiene que ser una lista")
        else:
            for pv in prev:
                if str(pv) not in cls:
                    r.falla(f"{k}: previo «{pv}» no es un id de clase")
        objs = y.get("objetivos")
        if pronto and objs == []:
            pass
        elif not isinstance(objs, list) or not objs:
            r.falla(f"{k}: objetivos tiene que ser una lista no vacía")
        else:
            for i, o in enumerate(objs, 1):
                if not isinstance(o, dict) or not OBJ_RE.match(str(o.get("id", ""))) or not str(o.get("texto") or "").strip():
                    r.falla(f"{k}: objetivo {i} necesita `id` (O1, O2…) y `texto`")
            ids = objetivos_spine(y)
            for d in sorted({i for i in ids if ids.count(i) > 1}):
                r.falla(f"{k}: objetivo {d} repetido")
            # bloques del cuerpo: (cubre: O1, O3)
            for m in CUBRE_RE.finditer(cuerpo):
                for oid in re.findall(r"O\d+", m.group(1)):
                    if oid not in ids:
                        r.falla(f"{k}: un bloque cubre {oid}, que no está entre los objetivos")
        fts = y.get("fuentes")
        if not isinstance(fts, list):
            r.falla(f"{k}: fuentes tiene que ser una lista")
        else:
            for i, f in enumerate(fts, 1):
                if not isinstance(f, dict) or not FUENTE_RE.match(str(f.get("id", ""))) or not str(f.get("cita") or "").strip():
                    r.falla(f"{k}: fuente {i} necesita `id` (F1, F2…) y `cita`")
    return r.cerrar(f"{len(S)} de {len(clases())} spines; {len(r.errores)} problemas")
