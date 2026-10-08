"""URLs externas únicas (páginas, lecturas, notebooks, spines, README): HEAD y, si no sirve, GET, con timeout y reintentos.
Las que fallan son advertencias; con --estricto, las caídas de verdad (404/410, DNS, sin respuesta) hacen fallar el chequeo.
Solo en modo completo."""
from __future__ import annotations

import re
import time
from concurrent.futures import ThreadPoolExecutor

from comun import RAIZ, SALTEADO, Contexto, Resultado, html_publicados, leer_nb, fuente_celda, rel, sopa, spines

URL_RE = re.compile(r"""https?://[^\s"'<>`)\]\\]+""")
CONCATENADA = re.compile(r"""["'`]\s*\+""")
IGNORAR = re.compile(r"\$\{|USUARIO/|localhost|127\.0\.0\.1|example\.(com|org)")
TIMEOUT, REINTENTOS = 20, 2
UA = "Mozilla/5.0 (X11; Linux x86_64) rl-a-ciegas-fabrica/1.0 (+chequeo de enlaces)"
BLOQUEO = {401, 403, 429, 999}   # sitios que rechazan robots: se avisa, nunca rompe


def limpiar(u: str) -> str:
    return u.rstrip(".,;:")


def recolectar() -> dict[str, set[str]]:
    urls: dict[str, set[str]] = {}

    def add(u, origen):
        u = limpiar(u)
        if not IGNORAR.search(u):
            urls.setdefault(u, set()).add(origen)

    for p in html_publicados():
        s = sopa(p)
        for tag in s.find_all(True):
            if tag.name == "link" and "preconnect" in (tag.get("rel") or []):
                continue
            for a in ("href", "src"):
                v = tag.get(a)
                if isinstance(v, str) and v.startswith(("http://", "https://")):
                    add(v, rel(p))
        for sc in s.find_all("script"):
            js = sc.get_text()
            for m in URL_RE.finditer(js):
                if not CONCATENADA.match(js, m.end()):   # "https://github.com/" + Cueva.REPO: no es una URL completa
                    add(m.group(0), rel(p))
    for p in sorted((RAIZ / "notebooks").glob("*.ipynb")):
        for c in leer_nb(p)["cells"]:
            if c["cell_type"] == "markdown":
                for u in URL_RE.findall(fuente_celda(c)):
                    add(u, rel(p))
    for _id, (p, y, _c, _e) in spines().items():
        for f in (y or {}).get("fuentes") or []:
            if isinstance(f, dict) and f.get("url"):
                add(str(f["url"]), rel(p))
    readme = RAIZ / "README.md"
    if readme.exists():
        for u in URL_RE.findall(readme.read_text(encoding="utf-8")):
            add(u, "README.md")
    return urls


def probar(url: str) -> tuple[str, int | None, str]:
    """('ok'|'bloqueado'|'caido', status, detalle)."""
    import requests
    ultimo = ""
    for intento in range(REINTENTOS + 1):
        try:
            h = {"User-Agent": UA, "Accept": "*/*"}
            resp = requests.head(url, timeout=TIMEOUT, allow_redirects=True, headers=h)
            if resp.status_code >= 400 or resp.status_code in (405, 501):
                resp = requests.get(url, timeout=TIMEOUT, allow_redirects=True, headers=h, stream=True)
                resp.close()
            st = resp.status_code
            if st < 400:
                return "ok", st, ""
            if st in BLOQUEO:
                return "bloqueado", st, f"HTTP {st} (el sitio rechaza clientes automáticos)"
            ultimo = f"HTTP {st}"
            if st in (404, 410):
                return "caido", st, ultimo
        except Exception as e:  # noqa: BLE001
            ultimo = type(e).__name__ + ": " + str(e)[:120]
        time.sleep(1.5 * (intento + 1))
    return "caido", None, ultimo


def correr(ctx: Contexto) -> Resultado:
    r = Resultado("enlaces_externos")
    if ctx.rapido:
        r.estado = SALTEADO
        r.resumen = "solo en modo completo"
        return r
    urls = recolectar()
    with ThreadPoolExecutor(max_workers=8) as ex:
        res = dict(zip(urls, ex.map(probar, urls)))
    filas = []
    for u, (estado, st, det) in sorted(res.items()):
        if estado == "ok":
            continue
        donde = ", ".join(sorted(urls[u]))
        msg = f"{u} — {det} (en {donde})"
        if estado == "caido" and ctx.estricto:
            r.falla(msg)
        else:
            r.aviso(msg)
        filas.append(f"| {estado} | {u} | {det} | {donde} |")
    if filas:
        r.detalle_md = "| estado | URL | detalle | dónde |\n|---|---|---|---|\n" + "\n".join(filas)
    caidos = sum(1 for e, _, _ in res.values() if e == "caido")
    bloq = sum(1 for e, _, _ in res.values() if e == "bloqueado")
    return r.cerrar(f"{len(urls)} URLs únicas; {caidos} caídas, {bloq} bloqueadas por el sitio")
