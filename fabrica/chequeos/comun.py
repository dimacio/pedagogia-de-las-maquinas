"""Piezas compartidas por los chequeos de la fábrica (contrato: fabrica/CONVENCIONES.md)."""
from __future__ import annotations

import functools
import json
import os
import re
import subprocess
import time
from dataclasses import dataclass, field
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
CHEQUEOS = Path(__file__).resolve().parent
REPORTES = RAIZ / "fabrica" / "reportes"

# Carpetas que no se publican (ni se chequean como sitio).
NO_PUBLICADO = {"build", "fabrica", "node_modules", ".git", ".github", "specs"}
# Páginas publicadas que no son para leer en pantalla (fuentes de las imágenes de difusión, 1080 px fijos).
NO_RENDER = ("difusion/posts/src/",)

OK, ADVERTENCIA, FALLA, SALTEADO = "ok", "advertencia", "falla", "salteado"
ICONO = {OK: "OK", ADVERTENCIA: "AVISO", FALLA: "FALLA", SALTEADO: "SALTEADO"}


@dataclass
class Resultado:
    nombre: str
    estado: str = OK
    resumen: str = ""
    errores: list[str] = field(default_factory=list)
    avisos: list[str] = field(default_factory=list)
    detalle_md: str = ""          # bloque Markdown extra (tablas, matrices)
    segundos: float = 0.0

    def falla(self, msg: str) -> None:
        self.errores.append(msg)

    def aviso(self, msg: str) -> None:
        self.avisos.append(msg)

    def cerrar(self, resumen: str = "") -> "Resultado":
        if self.estado not in (SALTEADO,):
            self.estado = FALLA if self.errores else (ADVERTENCIA if self.avisos else OK)
        if resumen:
            self.resumen = resumen
        return self


@dataclass
class Contexto:
    rapido: bool = False
    estricto: bool = False
    salida: Path = REPORTES
    timeout_nb: int = 900
    jobs_nb: int = 1


# ---------- archivos del sitio ----------

def rel(p: Path) -> str:
    return p.resolve().relative_to(RAIZ).as_posix()


def html_publicados() -> list[Path]:
    out = []
    for p in sorted(RAIZ.rglob("*.html")):
        partes = p.relative_to(RAIZ).parts
        if partes[0] in NO_PUBLICADO:
            continue
        out.append(p)
    return out


def html_render() -> list[Path]:
    return [p for p in html_publicados() if not rel(p).startswith(NO_RENDER)]


# ---------- datos de cueva.js y modulos.js (con node) ----------

@functools.lru_cache(maxsize=1)
def datos_js() -> dict:
    """{'clases': Cueva.CLASES, 'modulos': window.MODULOS} evaluando los .js reales con node."""
    r = subprocess.run(["node", str(CHEQUEOS / "leer_js.js"), str(RAIZ)], capture_output=True, text=True, timeout=60)
    if r.returncode != 0:
        raise RuntimeError(f"node no pudo cargar assets/cueva.js y assets/modulos.js:\n{r.stderr.strip()}")
    return json.loads(r.stdout)


def clases() -> list[dict]:
    return datos_js()["clases"]


def clase_por_id() -> dict[str, dict]:
    return {c["id"]: c for c in clases()}


def clases_activas() -> list[dict]:
    """Las clases de CLASES que no están en preparación (sin `pronto`)."""
    return [c for c in clases() if not c.get("pronto")]


def en_preparacion() -> set[str]:
    """Ids de las clases marcadas `pronto` en CLASES: tienen spine en borrador y todavía no tienen página."""
    return {c["id"] for c in clases() if c.get("pronto")}


def pagina_de(c: dict) -> Path:
    return RAIZ / "clases" / c["archivo"]


def notebook_de(c: dict) -> Path | None:
    return RAIZ / "notebooks" / c["nb"] if c.get("nb") else None


# ---------- spines ----------

SPEC_RE = re.compile(r"\A---\s*\n(.*?)\n---\s*(?:\n|\Z)(.*)", re.S)


def leer_spine(path: Path) -> tuple[dict | None, str, str | None]:
    """(yaml, cuerpo, error)."""
    import yaml
    txt = path.read_text(encoding="utf-8")
    m = SPEC_RE.match(txt)
    if not m:
        return None, txt, "no empieza con un encabezado YAML entre líneas '---'"
    try:
        data = yaml.safe_load(m.group(1))
    except yaml.YAMLError as e:
        return None, m.group(2), f"YAML inválido: {e}".replace("\n", " ")
    if not isinstance(data, dict):
        return None, m.group(2), "el encabezado YAML no es un diccionario"
    return data, m.group(2), None


def spines() -> dict[str, tuple[Path, dict | None, str, str | None]]:
    """id (nombre del archivo) -> (path, yaml, cuerpo, error)."""
    d = RAIZ / "specs"
    out = {}
    if d.is_dir():
        for p in sorted(d.glob("*.md")):
            y, cuerpo, err = leer_spine(p)
            out[p.stem] = (p, y, cuerpo, err)
    return out


def objetivos_spine(y: dict | None) -> list[str]:
    if not y or not isinstance(y.get("objetivos"), list):
        return []
    return [str(o.get("id")) for o in y["objetivos"] if isinstance(o, dict) and o.get("id") is not None]


# ---------- texto ----------

def sopa(path: Path):
    from bs4 import BeautifulSoup
    return BeautifulSoup(path.read_text(encoding="utf-8"), "lxml")


def texto_visible(path: Path) -> str:
    s = sopa(path)
    for t in s(["script", "style", "noscript", "template", "head", "svg"]):
        t.decompose()
    return re.sub(r"\s+", " ", s.get_text(" ")).strip()


def leer_nb(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def fuente_celda(c: dict) -> str:
    s = c.get("source", "")
    return "".join(s) if isinstance(s, list) else s


def texto_markdown_nb(path: Path) -> str:
    nb = leer_nb(path)
    return "\n\n".join(fuente_celda(c) for c in nb["cells"] if c["cell_type"] == "markdown")


def texto_completo_nb(path: Path) -> str:
    """Fuente de todas las celdas más las salidas de texto."""
    nb = leer_nb(path)
    partes = []
    for c in nb["cells"]:
        partes.append(fuente_celda(c))
        for o in c.get("outputs", []) or []:
            if "text" in o:
                partes.append("".join(o["text"]) if isinstance(o["text"], list) else o["text"])
            for k, v in (o.get("data") or {}).items():
                if k.startswith("text/"):
                    partes.append("".join(v) if isinstance(v, list) else v)
    return "\n".join(partes)


def cadenas(x) -> list[str]:
    """Todas las cadenas de una estructura JSON."""
    if isinstance(x, str):
        return [x]
    if isinstance(x, dict):
        return [s for v in x.values() for s in cadenas(v)]
    if isinstance(x, list):
        return [s for v in x for s in cadenas(v)]
    return []


class Cronometro:
    def __enter__(self):
        self.t0 = time.time()
        return self

    def __exit__(self, *a):
        self.s = time.time() - self.t0


def recortar(txt: str, n: int = 160) -> str:
    txt = re.sub(r"\s+", " ", txt).strip()
    return txt if len(txt) <= n else txt[: n - 1] + "…"


def env_path(nombre: str, defecto: str) -> Path:
    return Path(os.path.expanduser(os.environ.get(nombre, defecto)))
