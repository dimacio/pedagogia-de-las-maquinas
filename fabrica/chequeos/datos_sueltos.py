"""Heurística (solo advierte): números con decimales o porcentajes en el texto visible de cada página de clase que no
aparecen en el notebook de esa clase (fuente ni salidas). Sirve para encontrar cifras que no salen de ningún cálculo."""
from __future__ import annotations

import re

from comun import Contexto, Resultado, clases_activas, notebook_de, pagina_de, rel, texto_completo_nb, texto_visible

DECIMAL = re.compile(r"(?<![\w.,])(\d+[.,]\d+)(?![\w]|[.,]\d)")
PORCENTAJE = re.compile(r"(?<![\w.,])(\d+(?:[.,]\d+)?)\s?%")


def variantes(num: str, pct: bool) -> set[str]:
    x = num.replace(",", ".")
    vs = {x, x.replace(".", ",")}
    try:
        f = float(x)
    except ValueError:
        return vs
    if pct:
        g = f / 100
        vs |= {f"{g:g}", f"{g:.2f}", f"{g:.3f}".rstrip("0"), f"{f:g}%", f"{f:g} %"}
    else:
        vs |= {f"{f:g}"}
        if "." in x:   # 0.950 -> 0.95, y redondeos que una página suele mostrar
            dec = len(x.split(".")[1])
            vs.add(f"{f:.{dec}f}")
    return {v for v in vs if v not in ("0", "1", "0.", "1.")}


def correr(ctx: Contexto) -> Resultado:
    r = Resultado("datos_sueltos")
    filas, sin_nb, total = [], [], 0
    for c in clases_activas():
        p, nb = pagina_de(c), notebook_de(c)
        if not p.exists():
            continue
        if not nb or not nb.exists():
            sin_nb.append(c["id"])
            continue
        texto = texto_visible(p)
        nbtxt = texto_completo_nb(nb)
        nb_norm = nbtxt.replace(",", ".")
        vistos = set()
        for rx, pct in ((PORCENTAJE, True), (DECIMAL, False)):
            for m in rx.finditer(texto):
                num = m.group(1)
                if not pct and "," in num and texto[m.start() - 1:m.start()] == "(" and texto[m.end():m.end() + 1] == ")":
                    continue   # coordenadas de casilla como (7,12), no un decimal
                if (num, pct) in vistos or (not pct and any(num == v for v, _ in vistos)):
                    continue
                vistos.add((num, pct))
                total += 1
                if any(v in nbtxt or v.replace(",", ".") in nb_norm for v in variantes(num, pct)):
                    continue
                ctx_txt = texto[max(0, m.start() - 50): m.end() + 30]
                r.aviso(f"{rel(p)}: «{m.group(0).strip()}» no aparece en {nb.name} — …{ctx_txt.strip()}…")
                filas.append(f"| {c['id']} | `{m.group(0).strip()}` | …{ctx_txt.strip().replace('|', '/')}… |")
    if filas:
        r.detalle_md = "| clase | cifra | contexto |\n|---|---|---|\n" + "\n".join(filas)
    nota = f" (sin notebook: {', '.join(sin_nb)})" if sin_nb else ""
    return r.cerrar(f"{total} cifras revisadas; {len(filas)} sin respaldo en el notebook{nota}")
