#!/usr/bin/env python3
"""Imprime la sección de CHANGELOG.md de una versión (para las notas del release).
uso: python fabrica/chequeos/changelog.py v1.2.0 [--changelog CHANGELOG.md]
Acepta encabezados `## [1.2.0] - 2026-10-08`, `## 1.2.0 (…)` o `## v1.2.0 …`. Sale con 1 si la versión no tiene entrada."""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]


def seccion(texto: str, version: str) -> str | None:
    v = re.escape(version.lstrip("v"))
    cab = re.compile(rf"^##\s+\[?v?{v}\]?(?=[\s(—–-]|$).*$", re.M)
    m = cab.search(texto)
    if not m:
        return None
    sig = re.compile(r"^##\s", re.M).search(texto, m.end())
    return texto[m.end(): sig.start() if sig else len(texto)].strip()


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("version")
    ap.add_argument("--changelog", type=Path, default=RAIZ / "CHANGELOG.md")
    a = ap.parse_args()
    if not a.changelog.exists():
        print(f"no existe {a.changelog}", file=sys.stderr)
        return 1
    s = seccion(a.changelog.read_text(encoding="utf-8"), a.version)
    if s is None:
        print(f"{a.changelog.name} no tiene entrada para {a.version} (CONVENCIONES §4)", file=sys.stderr)
        return 1
    print(s or "(sin detalle)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
