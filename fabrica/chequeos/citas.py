"""Cada página de clase llama a Cueva.pagina(id, {lecturas: [...]}) con lecturas no vacías, salvo justificación
(campo `sin_lecturas: "motivo"` en el spine o comentario <!-- fabrica:sin-lecturas motivo --> en la página).
Cada fuente del spine aparece citada en la página o en el notebook: por su URL o por apellido del primer autor + año."""
from __future__ import annotations

import json
import re
import subprocess
import unicodedata

from comun import (CHEQUEOS, RAIZ, Contexto, Resultado, clases, notebook_de, pagina_de, rel, spines, texto_completo_nb)

LLAMADA = re.compile(r"Cueva\.pagina\s*\(")
JUSTIF_HTML = re.compile(r"<!--\s*fabrica:sin-lecturas\s+(.+?)-->", re.S)


def argumentos(js: str, ini: int) -> str | None:
    """Texto entre el paréntesis que abre en ini-1 y su cierre, respetando cadenas."""
    prof, i, q = 1, ini, None
    while i < len(js):
        ch = js[i]
        if q:
            if ch == "\\":
                i += 2
                continue
            if ch == q:
                q = None
        elif ch in "\"'`":
            q = ch
        elif ch in "([{":
            prof += 1
        elif ch in ")]}":
            prof -= 1
            if prof == 0:
                return js[ini:i]
        i += 1
    return None


def evaluar(textos: list[str]) -> list:
    if not textos:
        return []
    p = subprocess.run(["node", str(CHEQUEOS / "leer_js.js"), str(RAIZ), "args"], input=json.dumps(textos),
                       capture_output=True, text=True, timeout=60)
    if p.returncode != 0:
        raise RuntimeError(p.stderr)
    return json.loads(p.stdout)


def plano(t: str) -> str:
    t = unicodedata.normalize("NFKD", t)
    return "".join(ch for ch in t if not unicodedata.combining(ch)).lower()


def norm_url(u: str) -> str:
    return re.sub(r"^https?://(www\.)?", "", u.strip()).rstrip("/").lower()


def citada(fuente: dict, texto: str) -> bool:
    url = fuente.get("url")
    if url and norm_url(str(url)) in plano(texto).replace("http://", "").replace("https://", "").replace("www.", ""):
        return True
    cita = plano(str(fuente.get("cita", "")))
    m_autor = re.match(r"\s*([a-zñ][\w\-ñ]+)", cita)
    m_anio = re.search(r"\b(1[89]\d\d|20\d\d)\b", cita)
    if not m_autor:
        return False
    autor = m_autor.group(1)
    t = plano(texto)
    for m in re.finditer(r"\b" + re.escape(autor) + r"\b", t):
        if not m_anio or m_anio.group(1) in t[max(0, m.start() - 200): m.end() + 200]:
            return True
    return False


def correr(ctx: Contexto) -> Resultado:
    r = Resultado("citas")
    S = spines()
    llamadas, claves = [], []
    for c in clases():
        p = pagina_de(c)
        if not p.exists():
            continue
        html = p.read_text(encoding="utf-8")
        m = LLAMADA.search(html)
        if not m:
            r.falla(f"{rel(p)}: no llama a Cueva.pagina(...)")
            continue
        a = argumentos(html, m.end())
        if a is None:
            r.falla(f"{rel(p)}: no pude leer los argumentos de Cueva.pagina(...)")
            continue
        llamadas.append(a)
        claves.append((c, p, html))
    sin_spine = []
    for (c, p, html), val in zip(claves, evaluar(llamadas)):
        cid, k = c["id"], rel(p)
        if isinstance(val, dict) and "error" in val:
            r.falla(f"{k}: los argumentos de Cueva.pagina no son literales evaluables ({val['error']})")
            continue
        if not val or str(val[0]) != cid:
            r.falla(f"{k}: Cueva.pagina({val[0] if val else ''!r}) no coincide con el id de la clase ({cid})")
        opts = val[1] if len(val) > 1 and isinstance(val[1], dict) else {}
        lect = opts.get("lecturas") or []
        spine = S.get(cid)
        y = spine[1] if spine else None
        justif = (y or {}).get("sin_lecturas") or (JUSTIF_HTML.search(html).group(1).strip() if JUSTIF_HTML.search(html) else None)
        if not lect and not justif:
            r.falla(f"{k}: Cueva.pagina sin lecturas y sin justificación")
        for i, l in enumerate(lect, 1):
            if not isinstance(l, dict) or not str(l.get("texto") or "").strip():
                r.falla(f"{k}: lectura {i} sin texto")
        # fuentes del spine
        if not y:
            sin_spine.append(cid)
            continue
        texto = html + "\n" + json.dumps(lect, ensure_ascii=False)
        nb = notebook_de(c)
        if nb and nb.exists():
            texto += "\n" + texto_completo_nb(nb)
        for f in y.get("fuentes") or []:
            if isinstance(f, dict) and not citada(f, texto):
                r.falla(f"{k}: la fuente {f.get('id')} del spine no aparece citada en la página ni en el notebook: {str(f.get('cita'))[:120]}")
    if sin_spine:
        r.aviso(f"sin spine, no se verificaron las fuentes de: {', '.join(sin_spine)}")
    return r.cerrar(f"{len(claves)} páginas de clase; {len(r.errores)} problemas")
