"""Ninguna secuencia de 12 palabras seguidas de los textos del curso (páginas: texto visible; notebooks: markdown;
modulos.js: todas las cadenas) es idéntica a una de las fuentes en texto plano de FUENTES_DIR (por defecto ~/fuentes-rl).
Las fuentes no se suben al repo (CONVENCIONES §3); si la carpeta no existe, el chequeo se saltea y lo avisa."""
from __future__ import annotations

import re
import unicodedata

from comun import (RAIZ, SALTEADO, Contexto, Resultado, cadenas, datos_js, env_path, html_publicados, rel,
                   texto_markdown_nb, texto_visible)

N = 12
PALABRA = re.compile(r"[^\W_]+(?:['’][^\W_]+)?", re.U)


def palabras(txt: str) -> list[str]:
    txt = unicodedata.normalize("NFKC", txt).lower()
    return PALABRA.findall(txt)


def ngramas(ps: list[str]):
    for i in range(len(ps) - N + 1):
        yield i, " ".join(ps[i:i + N])


def textos_curso() -> list[tuple[str, str]]:
    out = [(rel(p), texto_visible(p)) for p in html_publicados()]
    out += [(rel(p), texto_markdown_nb(p)) for p in sorted((RAIZ / "notebooks").glob("*.ipynb"))]
    for cid, m in datos_js()["modulos"].items():
        out.append((f"assets/modulos.js [{cid}]", "\n".join(cadenas(m))))
    return out


def correr(ctx: Contexto) -> Resultado:
    r = Resultado("originalidad")
    d = env_path("FUENTES_DIR", "~/fuentes-rl")
    txts = sorted(d.rglob("*.txt")) if d.is_dir() else []
    if not txts:
        r.estado = SALTEADO
        r.resumen = f"no hay fuentes en {d} (definí FUENTES_DIR con los .txt de Sutton y Barto, CS234, etc.)"
        return r
    indice: dict[int, str] = {}
    for f in txts:
        ps = palabras(f.read_text(encoding="utf-8", errors="ignore"))
        for _i, g in ngramas(ps):
            indice.setdefault(hash(g), f.name)
    coincidencias = 0
    for origen, txt in textos_curso():
        ps = palabras(txt)
        i_prev = -10**9
        for i, g in ngramas(ps):
            fuente = indice.get(hash(g))
            if fuente is None:
                continue
            coincidencias += 1
            if i - i_prev >= N:   # un solo reporte por tramo copiado
                fin = i + N
                while fin < len(ps) and hash(" ".join(ps[fin - N + 1:fin + 1])) in indice:
                    fin += 1
                r.falla(f"{origen}: {fin - i} palabras iguales a {fuente}: «{' '.join(ps[i:fin])[:220]}»")
            i_prev = i
    return r.cerrar(f"{len(txts)} fuentes ({len(indice)} 12-gramas); {len(r.errores)} tramos copiados")
