"""Ejecuta los notebooks con nbconvert, cada uno con un tiempo máximo, sobre una copia de notebooks/ (no toca el repo).
Modo rápido: saltea los marcados `"fabrica": {"lento": true}` (CONVENCIONES §2). Modo completo: corre todos."""
from __future__ import annotations

import os
import re
import shutil
import signal
import subprocess
import sys
import tempfile
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from comun import RAIZ, Contexto, Resultado, fuente_celda, leer_nb, rel

PARECE_LENTO = re.compile(r"\bfrom_pretrained\b|^\s*(?:import|from)\s+transformers\b|\bopenai\b|\banthropic\b", re.M)


def es_lento(nb: dict) -> bool:
    return bool(((nb.get("metadata") or {}).get("fabrica") or {}).get("lento"))


def ejecutar(nb: Path, tmp: Path, timeout: int) -> tuple[str, float, str]:
    """('ok'|'error'|'timeout', segundos, detalle)."""
    salida = tmp / "_ejecutados"
    cmd = [sys.executable, "-m", "nbconvert", "--to", "notebook", "--execute",
           "--ExecutePreprocessor.timeout=-1", "--ExecutePreprocessor.kernel_name=python3",
           "--output-dir", str(salida), str(tmp / nb.name)]
    env = dict(os.environ, MPLBACKEND="Agg", PYTHONWARNINGS="ignore")
    t0 = time.time()
    p = subprocess.Popen(cmd, cwd=tmp, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, env=env, start_new_session=True)
    try:
        _out, err = p.communicate(timeout=timeout)
    except subprocess.TimeoutExpired:
        os.killpg(p.pid, signal.SIGKILL)
        p.communicate()
        return "timeout", time.time() - t0, f"superó {timeout} s"
    dt = time.time() - t0
    if p.returncode == 0:
        return "ok", dt, ""
    # quedarse con el error de la celda (nbconvert imprime el traceback completo)
    lineas = [l for l in err.splitlines() if l.strip()]
    idx = next((i for i, l in enumerate(lineas) if "CellExecutionError" in l or "An error occurred while executing" in l), None)
    clave = [l for l in lineas if re.match(r"^\w*(Error|Exception)\b", l.strip())]
    detalle = clave[-1] if clave else (lineas[-1] if lineas else f"código {p.returncode}")
    if idx is not None:
        celda = "\n".join(lineas[idx + 1: idx + 4])
        detalle = f"{detalle.strip()} — celda: {celda[:200]}"
    return "error", dt, re.sub(r"\x1b\[[0-9;]*m", "", detalle)[:400]


def correr(ctx: Contexto) -> Resultado:
    r = Resultado("notebooks")
    todos = sorted((RAIZ / "notebooks").glob("*.ipynb"))
    a_correr, salteados = [], []
    for p in todos:
        nb = leer_nb(p)
        lento = es_lento(nb)
        codigo = "\n".join(fuente_celda(c) for c in nb["cells"] if c["cell_type"] == "code")
        if not lento and PARECE_LENTO.search(codigo):
            r.aviso(f"{rel(p)}: usa un modelo de lenguaje y no está marcado como lento (metadata \"fabrica\": {{\"lento\": true}})")
        if lento and ctx.rapido:
            salteados.append(p)
        else:
            a_correr.append((p, lento))
    tmp = Path(tempfile.mkdtemp(prefix="fabrica-nb-"))
    try:
        for f in (RAIZ / "notebooks").iterdir():
            if f.is_file():
                shutil.copy2(f, tmp / f.name)
        with ThreadPoolExecutor(max_workers=max(1, ctx.jobs_nb)) as ex:
            res = list(ex.map(lambda x: ejecutar(x[0], tmp, ctx.timeout_nb), a_correr))
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    filas, total = [], 0.0
    for (p, lento), (estado, dt, det) in zip(a_correr, res):
        total += dt
        if estado != "ok":
            r.falla(f"{rel(p)}: {estado} tras {dt:.0f} s: {det}")
        elif dt > 180 and not lento:
            r.aviso(f"{rel(p)}: tardó {dt:.0f} s (> 3 min en CPU): debería marcarse como lento")
        filas.append(f"| {p.name} | {'sí' if lento else 'no'} | {estado} | {dt:.1f} s |")
    for p in salteados:
        filas.append(f"| {p.name} | sí | salteado (rápido) | — |")
    r.detalle_md = "| notebook | lento | estado | tiempo |\n|---|---|---|---|\n" + "\n".join(filas)
    return r.cerrar(f"{len(a_correr)} ejecutados en {total:.0f} s, {len(salteados)} lentos salteados; {len(r.errores)} con error")
