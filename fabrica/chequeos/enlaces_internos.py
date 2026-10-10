"""Todo href/src relativo de los .html publicados apunta a un archivo que existe (build/ y fabrica/ no se publican).
También verifica los archivos que arma cueva.js por su cuenta (CLASES: página y notebook de cada clase)."""
from __future__ import annotations

import re
from urllib.parse import unquote, urlsplit

from comun import RAIZ, Contexto, Resultado, clases, clases_activas, html_publicados, rel, sopa

ATRIBUTOS = ("href", "src", "poster", "data-src")
EXTERNO = re.compile(r"^(?:[a-z][a-z0-9+.-]*:|//)", re.I)   # http:, mailto:, data:, javascript:, //host


def destinos(path):
    s = sopa(path)
    for tag in s.find_all(True):
        for a in ATRIBUTOS:
            v = tag.get(a)
            if isinstance(v, str):
                yield tag.name, a, v.strip()
        if tag.get("srcset"):
            for parte in tag["srcset"].split(","):
                if parte.strip():
                    yield tag.name, "srcset", parte.strip().split()[0]


def correr(ctx: Contexto) -> Resultado:
    r = Resultado("enlaces_internos")
    paginas = html_publicados()
    n = 0
    for p in paginas:
        for tag, attr, v in destinos(p):
            if not v or v.startswith("#") or EXTERNO.match(v) or "${" in v:
                continue
            ruta = unquote(urlsplit(v).path)
            if not ruta:
                continue
            n += 1
            destino = (RAIZ / ruta.lstrip("/")) if ruta.startswith("/") else (p.parent / ruta)
            destino = destino.resolve()
            if ruta.endswith("/"):
                destino = destino / "index.html"
            try:
                partes = destino.relative_to(RAIZ).parts
            except ValueError:
                r.falla(f"{rel(p)}: <{tag} {attr}=\"{v}\"> sale del repositorio")
                continue
            if not destino.exists():
                r.falla(f"{rel(p)}: <{tag} {attr}=\"{v}\"> no existe")
            elif partes and partes[0] in ("build", "fabrica"):
                r.falla(f"{rel(p)}: <{tag} {attr}=\"{v}\"> apunta a {partes[0]}/, que no se publica")
    # enlaces que arma cueva.js
    for c in clases():
        if c.get("pronto") and (RAIZ / "clases" / c["archivo"]).exists():
            r.aviso(f"assets/cueva.js CLASES[{c['id']}]: la página ya existe; quitar pronto")
    for c in clases_activas():
        n += 1
        if not (RAIZ / "clases" / c["archivo"]).exists():
            r.falla(f"assets/cueva.js CLASES[{c['id']}]: clases/{c['archivo']} no existe")
        if c.get("nb"):
            n += 1
            if not (RAIZ / "notebooks" / c["nb"]).exists():
                r.falla(f"assets/cueva.js CLASES[{c['id']}]: notebooks/{c['nb']} no existe")
    return r.cerrar(f"{n} enlaces relativos en {len(paginas)} páginas; {len(r.errores)} rotos")
