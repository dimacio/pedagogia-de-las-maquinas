"""Esquema de assets/modulos.js (cargado con node): objetivos, tiempo, previos válidos, 5–6 preguntas de 4 opciones
con explicación, correcta en rango, objetivo en cada pregunta (CONVENCIONES §2) y actividad con rúbrica de 3 criterios."""
from __future__ import annotations

import re

from comun import Contexto, Resultado, clases, datos_js

OBJ_RE = re.compile(r"^O\d+$")


def txt(x) -> bool:
    return isinstance(x, str) and x.strip() != ""


def num(x) -> bool:
    return isinstance(x, (int, float)) and not isinstance(x, bool) and x > 0


def correr(ctx: Contexto) -> Resultado:
    r = Resultado("cuestionarios")
    M = datos_js()["modulos"]
    orden = [c["id"] for c in clases()]
    por_id = {c["id"]: c for c in clases()}
    sin_obj_total = preguntas_total = 0
    for extra in sorted(set(M) - set(orden)):
        r.falla(f"[{extra}] está en modulos.js pero no en CLASES de cueva.js")
    for cid in orden:
        m, c, k = M.get(cid), por_id[cid], f"[{cid}]"
        if not isinstance(m, dict):
            r.falla(f"{k} no tiene entrada en modulos.js")
            continue
        obj = m.get("objetivos")
        if not isinstance(obj, list) or not obj or not all(txt(o) for o in obj):
            r.falla(f"{k} objetivos: tiene que ser una lista no vacía de textos")
        elif not 3 <= len(obj) <= 4:
            r.aviso(f"{k} objetivos: {len(obj)} (la convención es 3–4)")
        t = m.get("tiempo")
        if not isinstance(t, dict) or not num(t.get("pagina")):
            r.falla(f"{k} tiempo.pagina: falta o no es un número positivo")
        elif c.get("nb") and not num(t.get("notebook")):
            r.falla(f"{k} tiempo.notebook: la clase tiene notebook y no tiene tiempo estimado")
        elif not c.get("nb") and t.get("notebook"):
            r.aviso(f"{k} tiempo.notebook: la clase no tiene notebook")
        prev = m.get("previos")
        if not isinstance(prev, list):
            r.falla(f"{k} previos: tiene que ser una lista (puede ser vacía)")
        else:
            for p in prev:
                if p not in por_id:
                    r.falla(f"{k} previos: «{p}» no es un id de clase")
                elif p == cid:
                    r.falla(f"{k} previos: se nombra a sí misma")
                elif orden.index(p) > orden.index(cid):
                    r.aviso(f"{k} previos: «{p}» viene después en el recorrido")
        Q = m.get("cuestionario")
        if not isinstance(Q, list):
            r.falla(f"{k} cuestionario: falta")
            Q = []
        elif not 5 <= len(Q) <= 6:
            r.falla(f"{k} cuestionario: {len(Q)} preguntas (tienen que ser 5–6)")
        sin_obj = 0
        for i, q in enumerate(Q, 1):
            kq = f"{k} pregunta {i}"
            if not isinstance(q, dict):
                r.falla(f"{kq}: no es un objeto")
                continue
            preguntas_total += 1
            if not txt(q.get("pregunta")):
                r.falla(f"{kq}: falta el texto de la pregunta")
            ops = q.get("opciones")
            if not isinstance(ops, list) or len(ops) != 4:
                r.falla(f"{kq}: tiene {len(ops) if isinstance(ops, list) else 0} opciones (tienen que ser 4)")
                ops = ops if isinstance(ops, list) else []
            for j, o in enumerate(ops, 1):
                if not isinstance(o, dict) or not txt(o.get("texto")):
                    r.falla(f"{kq}, opción {j}: falta el texto")
                elif not txt(o.get("explicacion")):
                    r.falla(f"{kq}, opción {j}: falta la explicación")
            co = q.get("correcta")
            if not isinstance(co, int) or isinstance(co, bool) or not 0 <= co < len(ops):
                r.falla(f"{kq}: correcta = {co!r} fuera de rango (0–{len(ops) - 1})")
            ob = q.get("objetivo")
            if ob is None:
                sin_obj += 1
            elif not (isinstance(ob, str) and OBJ_RE.match(ob)):
                r.falla(f"{kq}: objetivo = {ob!r} no tiene la forma O1, O2…")
        if sin_obj:
            sin_obj_total += sin_obj
            r.falla(f"{k} faltan marcas: {sin_obj} de {len(Q)} preguntas sin `objetivo` (CONVENCIONES §2)")
        a = m.get("actividad")
        if not isinstance(a, dict):
            r.falla(f"{k} actividad: falta")
        else:
            for campo in ("titulo", "consigna"):
                if not txt(a.get(campo)):
                    r.falla(f"{k} actividad.{campo}: falta")
            rub = a.get("rubrica")
            if not isinstance(rub, list) or len(rub) != 3 or not all(txt(x) for x in rub):
                r.falla(f"{k} actividad.rubrica: tiene que tener 3 criterios de texto")
    res = f"{len(orden)} clases, {preguntas_total} preguntas"
    if sin_obj_total:
        res += f"; faltan marcas de objetivo en {sin_obj_total} preguntas"
    return r.cerrar(res + f"; {len(r.errores)} problemas")
