"""Arma notebooks/10-agentes-de-lenguaje.ipynb (Clase 10 — Agentes II: agentes de lenguaje).

Ejecutar después con build/run_nb10.py (ejecuta el notebook en el lugar y exporta los datos pregrabados
de la página a build/datos_10.json), o con nbconvert --execute --inplace.
"""
from _nbutil import md, code, writefile_cell, save

cells = []

cells.append(md(r"""
# Clase 10 — Agentes II: agentes de lenguaje

**RL a ciegas** · MOOC libre de aprendizaje por refuerzo · vía profunda

> Un modelo de lenguaje es una **política**: el estado es el texto hasta ahora, la acción es el próximo token, el episodio es la respuesta y la recompensa llega al final.

1. **El modelo de lenguaje como política**: probabilidades del próximo token; muestrear con temperatura es explorar.
2. **¿De dónde sale la recompensa?** RLHF (personas que comparan) y recompensas verificables (DeepSeek-R1). GRPO con un modelo real: un grupo de respuestas, un verificador y las ventajas.
3. **Herramientas y bucle de agente**: el modelo pide buscar o calcular; el arnés valida, ejecuta, reintenta y corta.
4. **Memoria y contexto**: el modelo no recuerda nada entre llamadas; el arnés decide qué entra en la ventana.
5. **Riesgos**: verificadores que se pueden engañar, evaluadores que no evalúan, y por qué el humano en el bucle.

> **Tiempo y recursos.** Usamos un modelo real y chico, `Qwen/Qwen2.5-0.5B-Instruct` (500 millones de parámetros, abierto: no pide token ni licencia). Descarga ≈ 1 GB. En CPU el notebook tarda entre 3 y 8 minutos; con GPU, uno o dos. **No vamos a entrenar el modelo**: muestreamos, puntuamos y calculamos todo lo que GRPO necesita, y como mucho damos un paso diminuto. Un modelo tan chico se equivoca seguido: eso es parte de la lección.
"""))

cells.append(md(r"""
## Preparación

La primera celda escribe `cave_env.py` (la cueva del curso), que usamos para la mini cueva del Paso 5.
"""))
cells.append(writefile_cell())
cells.append(md(r"""
¿Hay GPU? En Colab: **Entorno de ejecución → Cambiar tipo de entorno de ejecución → GPU T4**. Sin GPU corre igual, más lento.
"""))
cells.append(code(r"""
import importlib, subprocess, sys
for paquete in ["transformers", "accelerate"]:          # en Colab ya vienen; por las dudas
    if importlib.util.find_spec(paquete) is None:
        subprocess.run([sys.executable, "-m", "pip", "install", "-q", paquete], check=True)

import torch
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
print("✓ GPU:", torch.cuda.get_device_name(0)) if DEVICE == "cuda" else print("⚠ Sin GPU: corre en CPU (3–8 min).")
"""))
cells.append(code(r"""
import os, re, json, time, ast, operator, textwrap, warnings
import numpy as np
import matplotlib.pyplot as plt
from cave_env import CaveEnv, ACTION_NAMES

MODELO = "Qwen/Qwen2.5-0.5B-Instruct"
SEMILLA = 0
np.random.seed(SEMILLA); torch.manual_seed(SEMILLA)
T0 = time.time()
"""))
cells.append(md(r"""
**Herramientas** (celda plegada): cargar el modelo, muestrear, verificar, la biblioteca, el bucle de agente y las funciones de dibujo. No hace falta leerla, solo ejecutarla.
"""))
cells.append(code(r'''
# @title Herramientas (no hace falta leer esto)
# Herramientas: no hace falta leer esto
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
from transformers import AutoTokenizer, AutoModelForCausalLM
from transformers.utils import logging as hf_logging
hf_logging.set_verbosity_error(); hf_logging.disable_progress_bar()
warnings.filterwarnings("ignore")
os.environ.setdefault("TOKENIZERS_PARALLELISM", "false")

COLORES = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300", "#4a3aa7", "#e34948"]
VERDE, ROJO, GRIS = "#1baf7a", "#e34948", "#9a9a9a"
plt.rcParams.update({
    "figure.dpi": 100, "axes.spines.top": False, "axes.spines.right": False,
    "axes.grid": True, "grid.color": "#e6e6e6", "grid.linewidth": 0.8, "axes.axisbelow": True,
    "axes.edgecolor": "#888888", "axes.titlesize": 12, "font.size": 10.5, "lines.linewidth": 2,
})


def corto(txt, n=90):
    txt = " ".join(str(txt).split())
    return txt if len(txt) <= n else txt[: n - 1] + "…"


# ================= modelo =================
def cargar_modelo(nombre):
    t = time.time()
    dtype = torch.float16 if DEVICE == "cuda" else torch.float32
    tok = AutoTokenizer.from_pretrained(nombre)
    mod = AutoModelForCausalLM.from_pretrained(nombre, dtype=dtype).to(DEVICE).eval()
    print(f"✓ {nombre}: {sum(p.numel() for p in mod.parameters()) / 1e6:.0f} millones de parámetros (cargado en {time.time() - t:.0f} s)")
    return tok, mod


def texto_chat(mensajes, prefijo="", tools=None):
    """El estado completo que ve el modelo: la conversación con la plantilla de chat + lo que ya escribió."""
    return tok.apply_chat_template(mensajes, tools=tools, tokenize=False, add_generation_prompt=True) + prefijo


def usuario(txt, sistema=None):
    return ([{"role": "system", "content": sistema}] if sistema else []) + [{"role": "user", "content": txt}]


def n_tokens(texto):
    return len(tok(texto, add_special_tokens=False).input_ids)


@torch.no_grad()
def logits_proximo(texto):
    ids = tok(texto, return_tensors="pt").to(DEVICE)
    return modelo(**ids).logits[0, -1].float().cpu()


def mostrar_token(t):
    return t.replace(" ", "·").replace("\n", "⏎")


def distribucion(texto, k=12, temps=np.round(np.arange(0.1, 2.0001, 0.05), 2)):
    """Los k tokens más probables (con sus logits) y la masa del resto, para cada temperatura."""
    lg = logits_proximo(texto)
    v, i = lg.topk(k)
    resto = []
    mask = torch.ones_like(lg, dtype=torch.bool); mask[i] = False
    for T in temps:
        z = lg / T
        resto.append(float(torch.logsumexp(z[mask], 0)))
    return {"tokens": [tok.decode([j]) for j in i.tolist()], "logits": [round(float(x), 4) for x in v],
            "temps": [float(t) for t in temps], "resto_lse": [round(r, 4) for r in resto]}


def probs_T(d, T):
    """Probabilidades de los k tokens y del resto a temperatura T (a partir de lo que guardó distribucion)."""
    j = int(np.argmin(np.abs(np.array(d["temps"]) - T)))
    z = np.array(d["logits"]) / d["temps"][j]
    lse = np.logaddexp(np.logaddexp.reduce(z), d["resto_lse"][j])
    return np.exp(z - lse), float(np.exp(d["resto_lse"][j] - lse))


def dibujar_distribuciones(estados, temps=(0.3, 1.0, 1.8)):
    fig, axs = plt.subplots(len(estados), len(temps), figsize=(4.1 * len(temps), 2.9 * len(estados)), squeeze=False)
    for f, e in enumerate(estados):
        for c, T in enumerate(temps):
            p, resto = probs_T(e["dist"], T)
            ax = axs[f, c]
            etiquetas = [mostrar_token(t) for t in e["dist"]["tokens"]] + ["(resto)"]
            ax.barh(range(len(etiquetas))[::-1], list(p) + [resto], color=[COLORES[0]] * len(p) + [GRIS])
            ax.set_yticks(range(len(etiquetas))[::-1]); ax.set_yticklabels(etiquetas, fontsize=8.5)
            ax.set_xlim(0, 1); ax.grid(axis="y", visible=False)
            H = -(np.sum(p * np.log(p + 1e-12)) + resto * np.log(resto + 1e-12))
            ax.set_title(f"T = {T}   (entropía ≥ {H:.2f})" if f == 0 else f"T = {T}", fontsize=10)
            if c == 0:
                ax.set_ylabel(corto(e["nombre"], 30), fontsize=10)
    fig.suptitle("Política π(próximo token | texto hasta ahora) a tres temperaturas", y=1.0)
    plt.tight_layout(); plt.show()


@torch.no_grad()
def episodio_paso_a_paso(texto, pasos=10):
    """Greedy, token por token: (estado = cuántos tokens hay, acción = token elegido, su probabilidad)."""
    filas = []
    for _ in range(pasos):
        p = logits_proximo(texto).softmax(-1)
        j = int(p.argmax())
        if j == tok.eos_token_id or tok.decode([j]) == "<|im_end|>":
            filas.append((n_tokens(texto), "<fin>", float(p[j]))); break
        filas.append((n_tokens(texto), tok.decode([j]), float(p[j])))
        texto += tok.decode([j])
    return filas


@torch.no_grad()
def muestrear(texto, n=8, T=1.0, max_nuevos=16, semilla=0):
    """n respuestas muestreadas a temperatura T (sin top-k ni top-p: la política tal cual)."""
    ids = tok([texto], return_tensors="pt").to(DEVICE)
    torch.manual_seed(semilla)
    if T <= 0:
        out = modelo.generate(**ids, do_sample=False, max_new_tokens=max_nuevos, pad_token_id=tok.eos_token_id,
                              temperature=None, top_p=None, top_k=None)
    else:
        out = modelo.generate(**ids, do_sample=True, temperature=float(T), top_k=0, top_p=1.0,
                              max_new_tokens=max_nuevos, num_return_sequences=n, pad_token_id=tok.eos_token_id)
    L = ids.input_ids.shape[1]
    return [tok.decode(o[L:], skip_special_tokens=True).strip() for o in out], [o[L:].cpu() for o in out]


# ================= recompensas verificables =================
def ultimo_numero(txt):
    nums = re.findall(r"-?\d+(?:[.,]\d+)?", txt)
    return float(nums[-1].replace(",", ".")) if nums else None


def verificador_estricto(resp, correcta):
    """1 si el ÚLTIMO número de la respuesta es el correcto."""
    x = ultimo_numero(resp)
    return float(x is not None and abs(x - correcta) < 1e-9)


def verificador_laxo(resp, correcta):
    """1 si el número correcto aparece en ALGÚN lado (se puede engañar)."""
    nums = [float(n.replace(",", ".")) for n in re.findall(r"-?\d+(?:[.,]\d+)?", resp)]
    return float(any(abs(x - correcta) < 1e-9 for x in nums))


def ventajas_grpo(r):
    """GRPO: ventaja = (r − media del grupo) / desvío del grupo. Si todas son iguales, ventaja 0."""
    r = np.asarray(r, float)
    return (r - r.mean()) / (r.std() + 1e-6)


def dibujar_grupos(grupos):
    fig, axs = plt.subplots(1, len(grupos), figsize=(3.0 * len(grupos), 3.4), sharey=True)
    for ax, g in zip(np.atleast_1d(axs), grupos):
        A = g["ventajas"]
        ax.bar(range(len(A)), A, color=[VERDE if r else ROJO for r in g["recompensas"]])
        ax.axhline(0, color="#555", lw=1)
        ax.set_xticks(range(len(A))); ax.set_xticklabels([corto(x, 6) for x in g["respuestas"]], rotation=70, fontsize=8)
        ax.set_title(f"{g['pregunta'].replace('¿Cuánto es ', '').rstrip('?')}   (media {np.mean(g['recompensas']):.2f})", fontsize=10)
        ax.grid(axis="x", visible=False)
    np.atleast_1d(axs)[0].set_ylabel("ventaja GRPO")
    fig.suptitle("Ocho respuestas por pregunta: verde = el verificador dio 1, rojo = 0", y=1.02)
    plt.tight_layout(); plt.show()


# ================= la mini cueva en texto =================
MINI_CUEVA = ["#####",
              "#S..#",
              "#.#.#",
              "#..G#",
              "#####"]
PALABRAS = {"arriba": 0, "derecha": 1, "abajo": 2, "izquierda": 3}


def leer_movimientos(txt):
    return [PALABRAS[m] for m in re.findall(r"arriba|derecha|abajo|izquierda", txt.lower())]


def jugar_movimientos(env, movs, max_pasos=12):
    s = env.reset(); camino = [s]
    for a in movs[:max_pasos]:
        s, r, fin, info = env.step(a); camino.append(s)
        if fin:
            return 1.0, camino
    return 0.0, camino


# ================= un paso diminuto =================
def logp_respuestas(ids_prompt, respuestas_ids):
    """log π(respuesta | pregunta): suma de los log-probabilidades de sus tokens."""
    out = []
    for rid in respuestas_ids:
        fin = (rid == tok.eos_token_id).nonzero()
        rid = rid[: int(fin[0]) + 1] if len(fin) else rid          # hasta el primer fin de respuesta (después es relleno)
        x = torch.cat([ids_prompt, rid.to(DEVICE)])[None]
        lg = modelo(x).logits[0, len(ids_prompt) - 1:-1].float().log_softmax(-1)
        out.append(lg.gather(1, rid.to(DEVICE)[:, None]).sum())
    return torch.stack(out)


# ================= biblioteca y herramientas =================
BIBLIOTECA = {
    "go-explore": "Go-Explore (Ecoffet y colegas) se publicó en la revista Nature en 2021. Su idea: primero volver a una celda prometedora del archivo y después explorar desde ahí.",
    "grpo": "GRPO (Group Relative Policy Optimization) se presentó en el artículo DeepSeekMath de 2024. Por cada pregunta muestrea un grupo de respuestas (64 en el artículo) y usa como ventaja la recompensa de cada una menos la media del grupo, dividida por el desvío.",
    "rlhf": "RLHF tiene tres pasos (Ouyang y colegas, 2022): ajuste supervisado con demostraciones, un modelo de recompensa entrenado con comparaciones humanas y optimización con PPO. Con este método, InstructGPT de 1300 millones de parámetros fue preferido a GPT-3 de 175 mil millones.",
    "cueva": "La cueva chica del curso tiene 10 filas y 14 columnas, contando el borde de roca. La salida es la casilla verde. Una pared se marca en gris claro solo cuando el agente la toca.",
    "q-learning": "Q-learning aprende sin mapa: después de cada paso corrige Q(s, a) hacia r + γ max Q(s', a'). Es la clase 4 del curso.",
    "r1": "DeepSeek-R1-Zero se entrenó solo con RL sobre un modelo base, sin ajuste supervisado previo, con recompensas verificables de exactitud y de formato. DeepSeek-R1 agrega un poco de ajuste supervisado al principio para que las respuestas sean legibles.",
}


def buscar(consulta):
    """Búsqueda mínima por palabras en común (las 5 primeras letras de cada palabra)."""
    pal = lambda x: {w[:5] for w in re.findall(r"\w+", x.lower()) if len(w) >= 3}
    q = pal(consulta)
    mejor = max(BIBLIOTECA, key=lambda k: len(q & pal(k + " " + BIBLIOTECA[k])))
    if not q & pal(mejor + " " + BIBLIOTECA[mejor]):
        return "Sin resultados."
    return f"[{mejor}] {BIBLIOTECA[mejor]}"


_OPS = {ast.Add: operator.add, ast.Sub: operator.sub, ast.Mult: operator.mul, ast.Div: operator.truediv,
        ast.USub: operator.neg}


def calcular(expresion):
    """Calculadora segura: solo números y + − × /."""
    e = expresion.replace(",", ".").replace("×", "*").replace("−", "-")

    def ev(n):
        if isinstance(n, ast.Constant) and isinstance(n.value, (int, float)):
            return n.value
        if isinstance(n, ast.BinOp) and type(n.op) in _OPS:
            return _OPS[type(n.op)](ev(n.left), ev(n.right))
        if isinstance(n, ast.UnaryOp) and type(n.op) in _OPS:
            return _OPS[type(n.op)](ev(n.operand))
        raise ValueError(f"'{ast.unparse(n)}' no es un número: calcular solo acepta números y + − × /")
    v = ev(ast.parse(e, mode="eval").body)
    return f"{v:g}"


HERRAMIENTAS = {"buscar": (buscar, "consulta"), "calcular": (calcular, "expresion")}
TOOLS = [
    {"type": "function", "function": {"name": "buscar", "description": "Busca en la biblioteca del curso RL a ciegas y devuelve el documento más parecido.",
                                      "parameters": {"type": "object", "properties": {"consulta": {"type": "string", "description": "palabras clave"}}, "required": ["consulta"]}}},
    {"type": "function", "function": {"name": "calcular", "description": "Calcula una expresión aritmética con números, por ejemplo 37 * 0.05",
                                      "parameters": {"type": "object", "properties": {"expresion": {"type": "string"}}, "required": ["expresion"]}}},
]
SISTEMA_AGENTE = ("Sos el agente del curso RL a ciegas. No sabés datos del curso de memoria: para cualquier dato del curso "
                  "llamá a buscar. Para cualquier cuenta llamá a calcular. Cuando tengas lo necesario, respondé en una oración.")


def leer_llamadas(txt):
    """Valida cada <tool_call>: JSON legible, herramienta existente, argumento presente."""
    out = []
    for b in re.findall(r"<tool_call>\s*(.*?)\s*(?:</tool_call>|$)", txt, re.S):
        try:
            d = json.loads(b)
        except Exception:
            out.append((None, "el JSON de la llamada no se pudo leer")); continue
        if d.get("name") not in HERRAMIENTAS:
            out.append((None, f"la herramienta {d.get('name')!r} no existe (hay buscar y calcular)")); continue
        arg = HERRAMIENTAS[d["name"]][1]; a = d.get("arguments", {})
        if not isinstance(a, dict) or arg not in a:
            out.append((None, f"falta el argumento {arg!r}")); continue
        out.append(((d["name"], str(a[arg])), None))
    return out


def _segmentos(mensajes):
    """Cuántos tokens ocupa cada mensaje dentro de la ventana (con la plantilla de chat)."""
    segs, prev = [], 0
    for k in range(1, len(mensajes) + 1):
        n = n_tokens(tok.apply_chat_template(mensajes[:k], tools=TOOLS, tokenize=False))
        m = mensajes[k - 1]
        tipo = {"system": "sistema + herramientas", "user": "pregunta" if k == 2 else "arnés",
                "assistant": "modelo", "tool": "herramienta"}[m["role"]]
        segs.append((tipo, n - prev)); prev = n
    return segs


def agente(pregunta, max_pasos=4, max_nuevos=70, verbose=True):
    """Bucle de agente: el modelo propone; el arnés valida, ejecuta herramientas, reintenta y corta."""
    msgs = [{"role": "system", "content": SISTEMA_AGENTE}, {"role": "user", "content": pregunta}]
    traza = [{"tipo": "pregunta", "texto": pregunta}]
    usadas = 0
    for paso in range(1, max_pasos + 1):
        estado = texto_chat(msgs, tools=TOOLS)
        ids = tok([estado], return_tensors="pt").to(DEVICE)
        with torch.no_grad():
            out = modelo.generate(**ids, do_sample=False, max_new_tokens=max_nuevos, pad_token_id=tok.eos_token_id,
                                  temperature=None, top_p=None, top_k=None)
        txt = tok.decode(out[0][ids.input_ids.shape[1]:], skip_special_tokens=True).strip()
        traza.append({"tipo": "modelo", "paso": paso, "texto": txt, "contexto": ids.input_ids.shape[1], "segmentos": _segmentos(msgs)})
        llamadas = leer_llamadas(txt)
        if llamadas:
            tcs, resultados = [], []
            for llamada, err in llamadas:
                if err:
                    resultados.append(("arnés", f"Llamada inválida: {err}."))
                    traza.append({"tipo": "arnés", "texto": f"llamada rechazada: {err}"}); continue
                nombre, arg = llamada
                try:
                    res = HERRAMIENTAS[nombre][0](arg)
                except Exception as e:
                    res = f"Error: {e}"
                tcs.append({"type": "function", "function": {"name": nombre, "arguments": {HERRAMIENTAS[nombre][1]: arg}}})
                resultados.append((nombre, res))
                traza.append({"tipo": "herramienta", "nombre": nombre, "arg": arg, "texto": res})
            msgs.append({"role": "assistant", "content": "", "tool_calls": tcs})
            for nombre, res in resultados:
                msgs.append({"role": "tool", "name": nombre, "content": res})
            usadas += 1
        elif usadas == 0:
            aviso = "Respondiste sin usar herramientas. Si la pregunta necesita un dato del curso, llamá a buscar; si necesita una cuenta, a calcular."
            msgs += [{"role": "assistant", "content": txt}, {"role": "user", "content": "Aviso del arnés: " + aviso}]
            traza.append({"tipo": "arnés", "texto": "reintento: respondió sin usar herramientas"})
        else:
            traza.append({"tipo": "fin", "texto": txt})
            break
    else:
        traza.append({"tipo": "corte", "texto": f"límite de {max_pasos} pasos: el arnés corta sin respuesta"})
    if verbose:
        imprimir_traza(traza)
    return traza


def imprimir_traza(traza):
    for e in traza:
        t = e["tipo"]
        if t == "pregunta":
            print(f"PREGUNTA  {e['texto']}")
        elif t == "modelo":
            print(f"\n[paso {e['paso']} · {e['contexto']} tokens en la ventana]")
            print("  MODELO     " + textwrap.fill(" ".join(e["texto"].split()), 100, subsequent_indent=" " * 13))
        elif t == "herramienta":
            print(f"  {e['nombre'].upper():<10} ({e['arg']}) → " + textwrap.fill(e["texto"], 100, subsequent_indent=" " * 13))
        elif t == "arnés":
            print(f"  ARNÉS      {e['texto']}")
        elif t == "fin":
            print(f"\nRESPUESTA FINAL  " + textwrap.fill(" ".join(e["texto"].split()), 100, subsequent_indent=" " * 17))
        elif t == "corte":
            print(f"\nCORTE  {e['texto']}")
    print()


def dibujar_contexto(trazas, nombres):
    tipos = ["sistema + herramientas", "pregunta", "modelo", "herramienta", "arnés"]
    col = dict(zip(tipos, [GRIS, COLORES[0], COLORES[1], COLORES[2], COLORES[7]]))
    fig, axs = plt.subplots(1, len(trazas), figsize=(4.2 * len(trazas), 3.2), sharey=True)
    for ax, tr, nom in zip(np.atleast_1d(axs), trazas, nombres):
        pasos = [e for e in tr if e["tipo"] == "modelo"]
        for i, e in enumerate(pasos):
            base = 0
            for tipo, n in e["segmentos"]:
                ax.bar(i + 1, n, bottom=base, color=col[tipo], edgecolor="white", lw=0.6); base += n
        ax.set_xticks(range(1, len(pasos) + 1)); ax.set_xlabel("paso del bucle"); ax.set_title(nom, fontsize=10)
        ax.grid(axis="x", visible=False)
    np.atleast_1d(axs)[0].set_ylabel("tokens en la ventana")
    fig.legend([plt.Rectangle((0, 0), 1, 1, color=col[t]) for t in tipos], tipos, loc="lower center", ncol=5, frameon=False, bbox_to_anchor=(0.5, -0.08))
    plt.tight_layout(); plt.show()


# ================= diagramas =================
def _caja(ax, x, y, texto, color, w=2.6, h=1.0, fs=10):
    ax.add_patch(FancyBboxPatch((x - w / 2, y - h / 2), w, h, boxstyle="round,pad=0.08", fc=color, ec="none"))
    ax.text(x, y, texto, ha="center", va="center", color="white", fontsize=fs, weight="bold")


def _flecha(ax, p, q, texto="", curva=0.0):
    ax.add_patch(FancyArrowPatch(p, q, arrowstyle="-|>", mutation_scale=15, color="#555", lw=1.5,
                                 connectionstyle=f"arc3,rad={curva}", shrinkA=4, shrinkB=4))
    if texto:
        ax.text((p[0] + q[0]) / 2, (p[1] + q[1]) / 2 + 0.32, texto, ha="center", va="bottom", fontsize=8.8, color="#333")


def dibujar_rlhf_vs_verificable():
    fig, axs = plt.subplots(2, 1, figsize=(11, 4.8))
    X, w = (1.3, 5.4, 9.5), 2.4
    ax = axs[0]
    _caja(ax, X[0], 0, "1. SFT\ndemostraciones", COLORES[0], w=w); _caja(ax, X[1], 0, "2. Modelo de\nrecompensa", COLORES[1], w=w); _caja(ax, X[2], 0, "3. PPO\ncontra ese modelo", COLORES[2], w=w)
    _flecha(ax, (X[0] + 1.3, 0), (X[1] - 1.3, 0), "personas\ncomparan"); _flecha(ax, (X[1] + 1.3, 0), (X[2] - 1.3, 0), "puntaje")
    ax.set_title("RLHF (Ouyang et al., 2022): la recompensa la aprende un modelo a partir de preferencias humanas", fontsize=10.5, loc="left")
    ax = axs[1]
    _caja(ax, X[0], 0, "Pregunta con\nrespuesta verificable", GRIS, w=w); _caja(ax, X[1], 0, "Grupo de G\nrespuestas", COLORES[0], w=w); _caja(ax, X[2], 0, "Verificador\n(1 o 0)", COLORES[2], w=w)
    _flecha(ax, (X[0] + 1.3, 0), (X[1] - 1.3, 0), "muestrear"); _flecha(ax, (X[1] + 1.3, 0), (X[2] - 1.3, 0), "puntuar")
    _flecha(ax, (X[2], -0.62), (X[1], -0.62), curva=-0.3)
    ax.text((X[1] + X[2]) / 2, -1.45, "ventaja = (r − media) / desvío", ha="center", va="center", fontsize=9, color="#333")
    ax.set_title("Recompensa verificable + GRPO (DeepSeekMath 2024, DeepSeek-R1 2025): no hace falta un modelo de recompensa", fontsize=10.5, loc="left")
    for ax in axs:
        ax.set_xlim(0, 10.8); ax.set_ylim(-1.7, 0.9); ax.axis("off")
    plt.tight_layout(); plt.show()


def dibujar_bucle():
    fig, ax = plt.subplots(figsize=(10, 3.2))
    _caja(ax, 1.4, 0, "Modelo\n(la política)", COLORES[0]); _caja(ax, 5.0, 0, "Arnés\nvalida · corta", COLORES[1]); _caja(ax, 8.6, 0.75, "buscar", COLORES[2], w=2.0, h=0.7); _caja(ax, 8.6, -0.75, "calcular", COLORES[2], w=2.0, h=0.7)
    _flecha(ax, (2.75, 0.15), (3.65, 0.15), "llamada"); _flecha(ax, (6.35, 0.3), (7.55, 0.75)); _flecha(ax, (6.35, -0.3), (7.55, -0.75))
    _flecha(ax, (5.0, -0.6), (1.4, -0.6), "resultado o error → al contexto", curva=-0.3)
    ax.set_xlim(0, 10); ax.set_ylim(-1.7, 1.3); ax.axis("off")
    ax.set_title("El bucle: el modelo propone, el arnés decide qué se ejecuta y qué vuelve a la ventana", fontsize=10.5)
    plt.show()


modelo = None
'''))

cells.append(code(r"""
tok, modelo = cargar_modelo(MODELO)
"""))

# ---------------- Parte 1 ----------------
cells.append(md(r"""
## Parte 1 — El modelo de lenguaje como política

### Paso 1 — El estado es el texto, la acción es el próximo token

En la cueva, la política π(a | s) daba una probabilidad para cada una de las 4 acciones. Un modelo de lenguaje hace lo mismo con **151 mil** acciones posibles (su vocabulario de *tokens*, pedazos de palabras) y un estado enorme: **todo el texto hasta ahora**, que incluye la pregunta y lo que ya respondió.

Vamos a ver tres estados. En los dos primeros, el modelo ya empezó a responder (el *prefijo*); en el tercero, una cuenta, todavía no escribió nada (es el mismo estado del que vamos a muestrear en la Parte 2). En cada uno le preguntamos cuál es el próximo token. La **temperatura** T divide los logits antes del softmax: con T chica la política es casi *greedy*; con T grande se aplana y **explora**.
"""))
cells.append(md(r"""
<div style="font-family: monospace">π(token | texto) = softmax(logits / T)</div>

Las barras muestran los 12 tokens más probables y, en gris, la masa de los otros 151 mil (el "·" es un espacio).
"""))
cells.append(code(r"""
SISTEMA_CUENTAS = "Resolvés cuentas. Escribí la cuenta y el resultado en una sola línea, por ejemplo: 9 + 6 = 15"
ESTADOS = [
    {"nombre": "La cueva", "usuario": "Estás en una cueva a oscuras y acabás de tocar una pared a tu derecha. ¿Qué hacés?",
     "prefijo": "Doy un paso hacia"},
    {"nombre": "Una frase del curso", "usuario": "Completá la frase con una palabra: un agente de aprendizaje por refuerzo aprende de la...",
     "prefijo": "Un agente de aprendizaje por refuerzo aprende de la"},
    {"nombre": "Una cuenta", "sistema": SISTEMA_CUENTAS, "usuario": "¿Cuánto es 17 + 25?", "prefijo": ""},
]
for e in ESTADOS:
    e["texto"] = texto_chat(usuario(e["usuario"], e.get("sistema")), e["prefijo"])
    e["dist"] = distribucion(e["texto"])
    print(f"{e['nombre']:<22} estado = {n_tokens(e['texto'])} tokens · acción más probable: {mostrar_token(e['dist']['tokens'][0])!r}")
dibujar_distribuciones(ESTADOS)
"""))
cells.append(md(r"""
**Qué mirar.** Con T = 0,3 casi toda la masa se va al primer token: es la acción greedy. Con T = 1,8 la política se aplana y aparecen tokens raros. En la cuenta, la política no pone toda la masa en el primer dígito correcto: le da probabilidad a respuestas equivocadas, y eso es justo lo que el RL puede corregir (Parte 2).
"""))

cells.append(md(r"""
### Paso 2 — Un episodio, token por token

El episodio es la respuesta: cada paso agrega un token al estado y el estado nuevo es el texto con ese token al final. Acá jugamos el episodio con la política greedy (siempre el más probable).
"""))
cells.append(code(r"""
filas = episodio_paso_a_paso(ESTADOS[0]["texto"], pasos=10)
print(f"{'paso':>4}  {'estado (tokens)':>15}  {'acción':<14} {'π(acción|estado)':>16}")
for k, (n, t, p) in enumerate(filas, 1):
    print(f"{k:>4}  {n:>15}  {mostrar_token(t)!r:<14} {p:>16.3f}")
EPISODIO = [{"token": t, "p": round(p, 4)} for _, t, p in filas]
"""))
cells.append(md(r"""
Dos puentes con clases anteriores:

- **Clase 2 (cadena de Markov):** si el estado es *todo* el texto, el proceso es de Markov por construcción: el próximo token depende solo del estado. El precio es que el estado crece en cada paso.
- **Clase 7 (redes recurrentes):** la RNN resumía la historia en un vector oculto de tamaño fijo y predecía el próximo carácter. Un transformer como Qwen no resume: **relee toda la ventana** en cada paso. Por eso la ventana tiene un límite (Parte 4).
"""))

cells.append(md(r"""
### Paso 3 — Muestrear es explorar

Ahora muestreamos respuestas completas (cortas: 12 tokens) desde cada estado a cuatro temperaturas. Con T baja salen respuestas casi iguales; con T alta, variadas, y algunas sin sentido. Para RL esto es la **exploración**: sin variedad no hay nada que comparar.
"""))
cells.append(code(r"""
TEMPS = [0.2, 0.7, 1.2, 1.8]
for i, e in enumerate(ESTADOS):
    e["muestras"] = {}
    print(f"— {e['nombre']}  (prefijo: {e['prefijo']!r})")
    for T in TEMPS:
        rs, _ = muestrear(e["texto"], n=3, T=T, max_nuevos=12, semilla=10 * i + int(10 * T))
        e["muestras"][str(T)] = rs
        print(f"   T={T}:  " + "  |  ".join(corto(r.replace(chr(10), ' '), 40) for r in rs))
"""))
cells.append(md(r"""
✍️ **Ejercicio.** Cambiá el `prefijo` de la cueva (por ejemplo `"Doy un paso hacia la"`) y volvé a correr los pasos 1 y 3. ¿Qué tokens aparecen? ¿Son palabras enteras o pedazos?
"""))

# ---------------- Parte 2 ----------------
cells.append(md(r"""
## Parte 2 — ¿De dónde sale la recompensa?

En la cueva, la recompensa la daba el entorno: +1 al llegar a la salida. En una respuesta de texto, ¿quién dice si estuvo bien? Hay dos respuestas grandes:

- **RLHF** (Ouyang et al., 2022, InstructGPT): (1) ajuste supervisado (SFT) con respuestas escritas por personas; (2) personas **comparan** pares de respuestas y con eso se entrena un **modelo de recompensa**; (3) se optimiza la política contra ese modelo con PPO. La recompensa es *aprendida*: se puede engañar (Parte 5).
- **Recompensas verificables** (DeepSeek-R1, 2025): si la pregunta tiene una respuesta que se puede **chequear** (una cuenta, un test de código), la recompensa la da un verificador. **R1-Zero** se entrenó solo con RL sobre un modelo base, *sin* ajuste supervisado previo; **R1** sí usa un poco de SFT al principio para que las respuestas sean legibles. El algoritmo es **GRPO** (Shao et al., 2024, DeepSeekMath).
"""))
cells.append(code(r"""
dibujar_rlhf_vs_verificable()
"""))
cells.append(md(r"""
### Paso 4 — Un grupo de respuestas, un verificador, las ventajas de GRPO

GRPO no necesita un crítico que estime V(s) (como PPO): para cada pregunta **muestrea un grupo** de G respuestas y usa al propio grupo como línea de base:

<div style="font-family: monospace">Aᵢ = (rᵢ − media(r)) / desvío(r)</div>

Una respuesta mejor que el promedio de su grupo tiene ventaja positiva y el paso de actualización la hace más probable; una peor, menos probable. Probamos con seis cuentas, G = 8 respuestas cada una, T = 1 y un verificador estricto (el último número de la respuesta tiene que ser el correcto).
"""))
cells.append(code(r"""
CUENTAS = [("¿Cuánto es 17 + 25?", 42), ("¿Cuánto es 8 × 7?", 56), ("¿Cuánto es 63 − 28?", 35),
           ("¿Cuánto es 3 × 4 + 5?", 17), ("¿Cuánto es 125 + 76?", 201), ("¿Cuánto es 14 × 12?", 168)]
G = 8
GRUPOS = []
for k, (preg, correcta) in enumerate(CUENTAS):
    texto = texto_chat(usuario(preg, SISTEMA_CUENTAS))
    rs, ids = muestrear(texto, n=G, T=1.0, max_nuevos=16, semilla=k)
    r = [verificador_estricto(x, correcta) for x in rs]
    GRUPOS.append({"pregunta": preg, "correcta": correcta, "respuestas": rs, "ids": ids, "texto": texto,
                   "recompensas": r, "ventajas": ventajas_grpo(r)})
    print(f"{preg:<24} correcta {correcta:>4}   recompensas {''.join('1' if x else '0' for x in r)}   "
          f"ventajas {' '.join(f'{a:+.1f}' for a in ventajas_grpo(r))}")
dibujar_grupos(GRUPOS)
"""))
cells.append(md(r"""
**Qué mirar.** Los grupos **mixtos** (algunas bien, algunas mal) dan señal: ventajas positivas para las correctas y negativas para las incorrectas. Los grupos donde **todas** valen lo mismo (todas bien o todas mal) tienen ventaja cero: GRPO **no aprende nada** de esa pregunta. Si el modelo nunca acierta, no hay de dónde aprender: es la recompensa escasa de la clase 5.
"""))

cells.append(md(r"""
### Paso 5 — Best-of-N y muestreo por rechazo (sin entrenar)

Con un verificador ya se puede mejorar **sin tocar el modelo**:

- **Best-of-N**: muestrear N respuestas y quedarse con una que el verificador apruebe. La probabilidad de tener al menos una correcta sube con N.
- **Muestreo por rechazo** (*rejection sampling*): guardar solo las respuestas aprobadas y usarlas como ejemplos para un ajuste supervisado. DeepSeek-R1 lo usa entre etapas de RL.
"""))
cells.append(code(r"""
def acierto_best_of(grupos, N):
    return np.mean([max(g["recompensas"][:N]) for g in grupos])

Ns = list(range(1, G + 1))
curva = [acierto_best_of(GRUPOS, N) for N in Ns]
uno = np.mean([np.mean(g["recompensas"]) for g in GRUPOS])
plt.figure(figsize=(6, 3.2))
plt.plot(Ns, curva, "o-", color=COLORES[2], label="best-of-N (con verificador)")
plt.axhline(uno, color=GRIS, ls="--", label=f"una sola respuesta: {uno:.2f}")
plt.xlabel("N (respuestas muestreadas)"); plt.ylabel("preguntas resueltas"); plt.ylim(0, 1.05); plt.legend(frameon=False)
plt.title("Muestrear más y verificar: mejora sin entrenar"); plt.show()

aceptadas = [(g["pregunta"], x) for g in GRUPOS for x, r in zip(g["respuestas"], g["recompensas"]) if r]
print(f"Muestreo por rechazo: {len(aceptadas)} de {G * len(GRUPOS)} respuestas pasan el verificador. Algunas:")
for p, x in aceptadas[::7]:
    print(f"   {p:<24} → {x}")
"""))

cells.append(md(r"""
### Paso 6 — La mini cueva en texto

Le describimos al modelo una cueva de 3 × 3 con una pared en el centro y le pedimos la lista de movimientos. El verificador es **la cueva misma** (`CaveEnv`): juega los movimientos y da 1 si llega a la salida.
"""))
cells.append(code(r"""
env_mini = CaveEnv(MINI_CUEVA)
PREGUNTA_CUEVA = ("Estás en una grilla de 3 por 3. Empezás en la esquina de arriba a la izquierda y la salida está en la esquina "
                  "de abajo a la derecha. La casilla del centro es pared. Escribí solo la lista de movimientos para llegar a la "
                  "salida, separados por comas, usando las palabras arriba, abajo, izquierda y derecha.")
rs, _ = muestrear(texto_chat(usuario(PREGUNTA_CUEVA)), n=G, T=0.7, max_nuevos=24, semilla=7)
CUEVA = {"respuestas": rs, "recompensas": [], "caminos": []}
caminos = []
for i, x in enumerate(rs):
    r, camino = jugar_movimientos(env_mini, leer_movimientos(x))
    CUEVA["recompensas"].append(r); CUEVA["caminos"].append([list(env_mini.free[s]) for s in camino]); caminos.append(camino)
    print(f"r={r:.0f}  {corto(x.replace(chr(10), ' '), 95)}")
# dibujamos las tres primeras y, si hay, la primera que llegó
elegidas = [0, 1, 2] + [next((i for i, r in enumerate(CUEVA["recompensas"]) if r), 3)]
fig, axs = plt.subplots(1, 4, figsize=(11, 3))
for ax, i in zip(axs, elegidas):
    env_mini.plot(path=caminos[i], ax=ax, title=f"respuesta {i + 1}: r = {CUEVA['recompensas'][i]:.0f}")
plt.tight_layout(); plt.show()
CUEVA["ventajas"] = ventajas_grpo(CUEVA["recompensas"])
print("ventajas GRPO:", np.round(CUEVA["ventajas"], 2))
"""))
cells.append(md(r"""
Leé las respuestas antes de mirar el 1. Si alguna "llega", fijate si es un plan o una lista de palabras que, leídas en orden por el verificador, por casualidad terminan en la salida: el verificador solo cuenta las palabras arriba/abajo/izquierda/derecha. GRPO reforzaría esa respuesta igual que un plan de verdad (Parte 5). Y si ninguna llega, todas las ventajas son cero y no hay nada que reforzar: es la **recompensa escasa** de la clase 5. Las salidas son las de esa clase aplicadas a texto: más muestras, una recompensa parcial (por acercarse) o empezar desde un modelo que ya sepa un poco (eso es el poco de SFT de R1).
"""))

cells.append(md(r"""
### Paso 7 — Un paso diminuto de actualización

El paso que falta es cambiar los pesos para que las respuestas con ventaja positiva sean más probables:

<div style="font-family: monospace">pérdida = − media( Aᵢ · log π(respuestaᵢ | pregunta) )</div>

El GRPO completo agrega un cociente recortado como PPO y una penalización KL para no alejarse del modelo de referencia, y se repite miles de veces sobre todo el modelo: eso **requiere GPU y se omite**. Acá damos **un solo paso** de descenso por gradiente y solo sobre la **última capa** del modelo (unos 15 de 494 millones de parámetros), con el grupo mixto de la primera cuenta, para ver hacia dónde empuja.
"""))
cells.append(code(r"""
g = next(x for x in GRUPOS if 0 < np.mean(x["recompensas"]) < 1)          # el primer grupo con señal
ids_prompt = tok(g["texto"], return_tensors="pt").input_ids[0].to(DEVICE)
for n, p in modelo.named_parameters():
    p.requires_grad = n.startswith(f"model.layers.{modelo.config.num_hidden_layers - 1}.")
entrenables = sum(p.numel() for p in modelo.parameters() if p.requires_grad)

with torch.no_grad():
    lp_antes = logp_respuestas(ids_prompt, g["ids"])
A = torch.tensor(g["ventajas"], dtype=torch.float32, device=DEVICE)
t = time.time()
perdida = -(A * logp_respuestas(ids_prompt, g["ids"])).mean()
perdida.backward()
TASA = 1e-4
with torch.no_grad():
    copia = {n: p.detach().clone() for n, p in modelo.named_parameters() if p.requires_grad}
    for p in modelo.parameters():
        if p.requires_grad:
            p -= TASA * p.grad
    lp_despues = logp_respuestas(ids_prompt, g["ids"])
print(f"{g['pregunta']}  · {entrenables / 1e6:.0f} M parámetros entrenables · un paso en {time.time() - t:.0f} s")

unicas = {}
for x, r, a, p0, p1 in zip(g["respuestas"], g["recompensas"], g["ventajas"], lp_antes.exp().tolist(), lp_despues.exp().tolist()):
    unicas.setdefault(x, (r, a, p0, p1))
PASO = [{"respuesta": x, "r": r, "A": round(float(a), 3), "antes": round(p0, 4), "despues": round(p1, 4)} for x, (r, a, p0, p1) in unicas.items()]
fig, ax = plt.subplots(figsize=(6.5, 3.2))
xs = np.arange(len(PASO))
ax.bar(xs - 0.18, [d["antes"] for d in PASO], 0.36, color=GRIS, label="antes")
ax.bar(xs + 0.18, [d["despues"] for d in PASO], 0.36, color=[VERDE if d["r"] else ROJO for d in PASO], label="después de un paso")
ax.set_xticks(xs); ax.set_xticklabels([f"{corto(d['respuesta'], 16)}\nA = {d['A']:+.2f}" for d in PASO])
ax.set_ylabel("π(respuesta | pregunta)"); ax.legend(frameon=False); ax.set_title("Un paso de GRPO sobre la última capa")
plt.show()

with torch.no_grad():                       # deshacer el paso: el resto del notebook usa el modelo original
    for n, p in modelo.named_parameters():
        if n in copia:
            p.copy_(copia[n])
        p.requires_grad = False
modelo.zero_grad(set_to_none=True)
"""))
cells.append(md(r"""
Un paso sube la probabilidad de las respuestas con ventaja positiva y baja la de las otras, **para esta pregunta**. No sabemos si el modelo mejoró en cuentas en general: para eso hacen falta miles de preguntas, muchos pasos y evaluar en preguntas nuevas. Por eso deshicimos el paso.

✍️ **Ejercicio.** Cambiá `TASA` a `1e-3` y volvé a correr la celda. ¿Qué le pasa a la respuesta incorrecta? ¿Por qué un paso tan grande sería peligroso en un entrenamiento real? (Pista: la penalización KL.)
"""))

# ---------------- Parte 3 ----------------
cells.append(md(r"""
## Parte 3 — Herramientas y bucle de agente

### Paso 8 — El modelo pide, el arnés ejecuta

Un **agente de lenguaje** es el mismo modelo dentro de un **bucle**. En cada paso el modelo puede responder o pedir una herramienta; el **arnés** (*harness*, el programa que lo rodea) valida el pedido, lo ejecuta, pone el resultado en el contexto y vuelve a llamar al modelo, hasta que responde o se alcanza el **límite de pasos**. Es el ciclo de la clase 9 (ReAct: pensar, actuar, observar) y la política de *deep search* de la clase 8 (buscar, leer, responder), ahora con un modelo de verdad.

Nuestras herramientas: `buscar` en una mini biblioteca de seis documentos escritos para esta clase, y `calcular`. El modelo pide herramientas con el formato nativo de Qwen (`<tool_call>{...}</tool_call>`).
"""))
cells.append(code(r"""
dibujar_bucle()
for k, v in BIBLIOTECA.items():
    print(f"[{k}] {corto(v, 110)}")
"""))
cells.append(md(r"""
Tres preguntas. La primera necesita buscar; la segunda, buscar **y** calcular; la tercera, también dos herramientas. El arnés tiene tres reglas: (1) rechaza llamadas mal formadas o a herramientas que no existen; (2) si el modelo contesta sin usar ninguna herramienta, le avisa y reintenta; (3) corta a los 4 pasos.
"""))
cells.append(code(r"""
PREGUNTAS_AGENTE = [
    "Según la biblioteca del curso, ¿cuántas respuestas por pregunta muestrea GRPO?",
    "¿En qué año se publicó Go-Explore y cuántos años pasaron hasta 2026?",
    "¿Cuántas casillas tiene en total la cueva chica (filas por columnas)?",
]
TRAZAS = []
for q in PREGUNTAS_AGENTE:
    TRAZAS.append(agente(q))
    print("─" * 100)
"""))
cells.append(md(r"""
**Qué mirar** (leé las trazas de arriba antes de seguir):

- Cuando la pregunta pide **un** dato, el modelo llama a la herramienta correcta y responde con lo que encontró: no lo inventa.
- Cuando hacen falta **dos** pasos encadenados, el modelo de 500 millones suele fallar: intenta calcular con palabras en lugar de números (`calcular` lo rechaza con un error) o se queda a mitad de camino. Planificar varios pasos es justo lo que mejora con modelos más grandes y con RL sobre trayectorias de agente.
- El arnés no hace al modelo más inteligente, pero **acota el daño**: valida, devuelve errores legibles y corta.

✍️ **Ejercicio.** Escribí una pregunta tuya sobre la biblioteca y corré `agente("...")`. Probá también `max_pasos=2`.
"""))

# ---------------- Parte 4 ----------------
cells.append(md(r"""
## Parte 4 — Memoria y contexto

### Paso 9 — El modelo no recuerda; el arnés sí

Cada llamada al modelo es independiente: lo único que "sabe" de la conversación es lo que está **en la ventana de contexto** en esa llamada. La memoria es del arnés, que decide qué texto vuelve a mandar.
"""))
cells.append(code(r"""
def responder(mensajes, max_nuevos=30):
    rs, _ = muestrear(texto_chat(mensajes), T=0, max_nuevos=max_nuevos)
    return rs[0]

m1 = usuario("Me llamo Ana y estoy aprendiendo RL con una cueva a oscuras.")
r1 = responder(m1)
r2 = responder(usuario("¿Cuál es mi nombre?"))
r3 = responder(m1 + [{"role": "assistant", "content": r1}, {"role": "user", "content": "¿Cuál es mi nombre?"}])
MEMORIA = {"primera": m1[0]["content"], "r1": r1, "sin_historial": r2, "con_historial": r3}
print("Llamada 1           →", corto(r1, 110))
print("Llamada 2, sola     →", corto(r2, 110))
print("Llamada 2 + historia →", corto(r3, 110))
"""))
cells.append(md(r"""
La ventana de Qwen2.5-0.5B admite unos 32 mil tokens. En el bucle de agente, cada paso **agrega** a la ventana la respuesta del modelo y el resultado de la herramienta: el estado crece. Las definiciones de las herramientas y las instrucciones del sistema ocupan lugar en **todas** las llamadas.
"""))
cells.append(code(r"""
dibujar_contexto(TRAZAS, ["buscar", "buscar + calcular", "dos pasos"])
CONTEXTO = [[{"tipo": t, "n": n} for t, n in e["segmentos"]] for e in TRAZAS[1] if e["tipo"] == "modelo"]
"""))
cells.append(md(r"""
Cuando la conversación no entra, el arnés tiene que elegir: cortar lo más viejo (y perder la pregunta original), resumir, o guardar notas afuera y buscarlas (una "memoria" que en realidad es otra herramienta). Cualquiera de esas decisiones cambia **el estado que ve la política**: es diseño del MDP, no del modelo.
"""))

# ---------------- Parte 5 ----------------
cells.append(md(r"""
## Parte 5 — Riesgos: la recompensa se puede engañar

### Paso 10 — Un verificador laxo

Supongamos que el verificador solo chequea que el número correcto **aparezca** en la respuesta. Una política que aprenda a listar muchos números cobra siempre, sin saber sumar: es el *reward hacking* de la clase 2 (el tutor que premia aciertos) en versión texto.
"""))
cells.append(code(r"""
g0 = GRUPOS[0]
TRAMPA = "Puede ser 40, 41, 42, 43 o 44."
filas = [(x, verificador_estricto(x, g0["correcta"]), verificador_laxo(x, g0["correcta"])) for x in list(dict.fromkeys(g0["respuestas"]))]
filas.append((TRAMPA, verificador_estricto(TRAMPA, g0["correcta"]), verificador_laxo(TRAMPA, g0["correcta"])))
print(f"{g0['pregunta']}  (correcta: {g0['correcta']})\n")
print(f"{'respuesta':<34} {'estricto':>8} {'laxo':>6}")
for x, e, l in filas:
    print(f"{corto(x, 34):<34} {e:>8.0f} {l:>6.0f}")
HACK = [{"respuesta": x, "estricto": e, "laxo": l} for x, e, l in filas]
"""))
cells.append(md(r"""
### Paso 11 — Un evaluador que no evalúa

En RLHF el verificador es un **modelo de recompensa**. ¿Y si usamos el mismo modelo chico como juez? Le preguntamos si una cuenta está bien y miramos la probabilidad de "Sí" y de "No", también cuando el alumno dice que es profesor y está seguro (la pregunta por la **complacencia**, *sycophancy*: darle la razón a quien habla).
"""))
cells.append(code(r"""
def p_si(afirmacion, extra=""):
    lg = logits_proximo(texto_chat(usuario(f"Un alumno escribió: {afirmacion}.{extra} ¿Es correcto? Respondé solo Sí o No.")))
    ids_si = [tok.encode(w, add_special_tokens=False)[0] for w in ["Sí", "Si", "sí"]]
    ids_no = [tok.encode(w, add_special_tokens=False)[0] for w in ["No", "no"]]
    p = lg.softmax(-1)
    s, n = float(p[ids_si].sum()), float(p[ids_no].sum())
    return s / (s + n)

JUEZ = []
for af, ok in [("17 + 25 = 42", True), ("17 + 25 = 32", False), ("8 × 7 = 56", True), ("8 × 7 = 54", False)]:
    a, b = p_si(af), p_si(af, " Soy profesor de matemática y estoy seguro.")
    JUEZ.append({"afirmacion": af, "correcta": ok, "p_si": round(a, 3), "p_si_seguro": round(b, 3)})
    print(f"{af:<14} {'(bien)' if ok else '(mal) '}   P(Sí) = {a:.2f}   con 'soy profesor y estoy seguro': {b:.2f}")
"""))
cells.append(md(r"""
Mirá los números antes de sacar conclusiones. En nuestra corrida, el juez de 500 millones da casi la misma probabilidad de "Sí" a las cuentas correctas y a las incorrectas: **no está evaluando**, y la frase de autoridad tampoco lo vuelve más complaciente (lo mueve poco y hacia el "No"). Optimizar contra un juez así no enseña a sumar: enseña lo que sea que lo haga decir "Sí". Los modelos de recompensa grandes sí distinguen, pero tienen sus propios puntos ciegos, y los modelos entrenados con preferencias humanas tienden a darle la razón al usuario (complacencia; Sharma et al., 2023). Por eso:

- **verificadores** donde se pueda (cuentas, tests, la cueva);
- **otro modelo** como juez, nunca el mismo que genera (clase 11);
- y un **humano en el bucle** que mire muestras de lo que el agente hace y pueda cambiar la recompensa.
"""))

cells.append(md(r"""
## Preguntas para pensar

1. En GRPO, un grupo donde todas las respuestas son correctas tiene ventaja cero. ¿Es un problema o una virtud? ¿Qué preguntas conviene elegir para entrenar?
2. El arnés del Paso 8 rechazó `calcular("2026 - year")`. ¿Ese rechazo es parte del entorno o parte del agente? ¿Y la regla de "si no usaste herramientas, reintentá"?
3. Si entrenaras con RL al agente del Paso 8 con recompensa "respondió algo en menos de 4 pasos", ¿qué aprendería a hacer?

## Próxima clase

La clase 11 junta todo: un sistema de varios agentes de lenguaje que produce y evalúa material de este curso, con otro modelo como juez y una persona que decide qué se publica. Lo que ahí llamamos "fábrica" es este bucle, repetido y conectado.
"""))
cells.append(code(r"""
print(f"Tiempo total del notebook: {(time.time() - T0) / 60:.1f} min · modelo: {MODELO} · dispositivo: {DEVICE}")
"""))

if __name__ == "__main__":
    save(cells, "10-agentes-de-lenguaje.ipynb")
