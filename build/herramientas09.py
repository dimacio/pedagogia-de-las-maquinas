# Herramientas: no hace falta leer esto
# (Clase 9 · Redes recurrentes. Este archivo es la fuente de la celda plegable del notebook 09;
#  viene de build/v1/builders/herramientas07.py, sin la cadena de Markov, que ahora es la clase 3.)
import time
import numpy as np
import matplotlib.pyplot as plt
import torch
import torch.nn as nn
from cave_env import CaveEnv, ACTIONS, ACTION_NAMES

AZUL, NARANJA, VERDE, GRIS = "#2a78d6", "#eb6834", "#2ecc71", "#8d93a3"

# ---------------------------------------------------------------- la cueva grande
CUEVA_GRANDE = [
    "#########################",
    "#S..#.........#.........#",
    "#.#.#####.###.###.#####.#",
    "#...#.....#.........#...#",
    "#.###.#####.###.#.#.#.###",
    "#.#...#.........#...#...#",
    "#.#.#.#.#.###.#.#.#.#.#.#",
    "#.....#...#...#.#...#.#.#",
    "#######.###.###.###.#.#.#",
    "#...#.........#.....#.#.#",
    "#.###.#####.#.#####.#.#.#",
    "#...........#..........G#",
    "#########################",
]


def distancias(env):
    """Pasos mínimos desde cada casilla hasta la salida (búsqueda en anchura)."""
    d = np.full(env.nS, 10**6); d[env.goal] = 0; cola = [env.goal]
    while cola:
        s = cola.pop(0)
        for a in range(4):
            s2, choque = env._move(s, a)
            if not choque and d[s2] == 10**6:
                d[s2] = d[s] + 1; cola.append(s2)
    return d


# ---------------------------------------------------------------- 1. bigotes y creencia
def bigotes(env, s):
    """4 bigotes (↑ → ↓ ←): 1 si hay pared pegada."""
    r, c = env.free[s]
    return tuple(int(env.grid[r + dr, c + dc] == "#") for dr, dc in ACTIONS.values())


def creencia(env, acciones, inicio=None, memoria=True):
    """Casillas compatibles con lo que se sintió. Devuelve (lista de conjuntos, casillas reales).
    memoria=False: solo la lectura de ahora."""
    s = env.start if inicio is None else inicio
    lect = lambda q: bigotes(env, q)
    todas = set(range(env.nS))
    B = {q for q in todas if lect(q) == lect(s)}
    hist, reales = [set(B)], [s]
    for a in acciones:
        s, _ = env._move(s, a)
        compat = {q for q in todas if lect(q) == lect(s)}
        B = ({env._move(q, a)[0] for q in B} & compat) if memoria else compat
        hist.append(set(B)); reales.append(s)
    return hist, reales


# ---------------------------------------------------------------- 2. texto y n-gramas
def preparar_texto(t):
    return " ".join(t.lower().split())


def tabla_ngramas(texto, n):
    """Para cada contexto de n-1 letras, cuántas veces vino cada letra después."""
    tab = {}
    for i in range(len(texto) - n + 1):
        ctx, sig = texto[i:i + n - 1], texto[i + n - 1]
        tab.setdefault(ctx, {}); tab[ctx][sig] = tab[ctx].get(sig, 0) + 1
    return tab


def generar_ngramas(texto, n, largo=300, semilla=0, inicio=None):
    rng = np.random.default_rng(semilla); tab = tabla_ngramas(texto, n)
    out = inicio if inicio is not None else texto[:n - 1]
    while len(out) < largo:
        c = tab.get(out[len(out) - (n - 1):] if n > 1 else "")
        if not c:
            out += " "; continue
        letras, cuentas = zip(*c.items()); p = np.array(cuentas, float); p /= p.sum()
        out += letras[rng.choice(len(letras), p=p)]
    return out


def entropia_ngramas(entren, prueba, n, alfa=0.1, vocab=None):
    """Entropía cruzada (nats por letra) sobre un texto que la tabla no vio, con suavizado de Laplace."""
    vocab = vocab or sorted(set(entren + prueba)); V = len(vocab); tab = tabla_ngramas(entren, n); tot = 0.0
    for i in range(n - 1, len(prueba)):
        c = tab.get(prueba[i - n + 1:i], {}); N = sum(c.values())
        tot -= np.log((c.get(prueba[i], 0) + alfa) / (N + alfa * V))
    return tot / (len(prueba) - n + 1)


def copiado(generado, corpus, k=20):
    """Fracción de los tramos de k letras del texto generado que están literales en el corpus."""
    tramos = {corpus[i:i + k] for i in range(len(corpus) - k + 1)}
    return float(np.mean([generado[i:i + k] in tramos for i in range(len(generado) - k + 1)]))


# ---------------------------------------------------------------- 3. la red recurrente
class ModeloLetras(nn.Module):
    """Modelo de lenguaje de letras. tipo='elman': h_t = tanh(W_hh h_{t-1} + W_xh x_t + b), entrada one-hot.
    tipo='gru': la misma idea con perilla (compuerta)."""
    def __init__(self, vocab, tipo="elman", H=32):
        super().__init__()
        self.vocab, self.tipo, self.H = vocab, tipo, H
        V = len(vocab)
        Celda = nn.RNN if tipo == "elman" else nn.GRU
        self.rnn = Celda(V, H, batch_first=True)
        self.salida = nn.Linear(H, V)

    def forward(self, ids, h=None, devolver_x=False):
        x = nn.functional.one_hot(ids, len(self.vocab)).float()
        if devolver_x: x.requires_grad_(True)
        y, h = self.rnn(x, h)
        return (self.salida(y), h, y, x) if devolver_x else (self.salida(y), h)


def a_ids(texto, vocab):
    i = {c: k for k, c in enumerate(vocab)}
    return torch.tensor([i[c] for c in texto if c in i])


def entropia_red(m, texto):
    ids = a_ids(texto, m.vocab)
    with torch.no_grad():
        lo, _ = m(ids[None, :-1])
    return nn.functional.cross_entropy(lo[0], ids[1:]).item()


def entrenar_lm(texto, vocab, tipo="elman", H=32, pasos=2000, L=48, B=32, lr=3e-3, semilla=0, prueba=None, cada=50):
    """Entrena con trozos de L letras al azar. Si hay texto de prueba, guarda la curva y el mejor modelo."""
    torch.manual_seed(semilla)
    m = ModeloLetras(vocab, tipo, H); opt = torch.optim.Adam(m.parameters(), lr=lr)
    X = a_ids(texto, vocab); hist = {"paso": [], "entren": [], "prueba": []}; mejor = (np.inf, None, 0); acum = []
    for p in range(1, pasos + 1):
        i = torch.randint(0, len(X) - L - 1, (B,))
        xb = torch.stack([X[k:k + L] for k in i]); yb = torch.stack([X[k + 1:k + L + 1] for k in i])
        lo, _ = m(xb); loss = nn.functional.cross_entropy(lo.reshape(-1, len(vocab)), yb.reshape(-1))
        opt.zero_grad(); loss.backward(); nn.utils.clip_grad_norm_(m.parameters(), 1.0); opt.step(); acum.append(loss.item())
        if p % cada == 0:
            hist["paso"].append(p); hist["entren"].append(float(np.mean(acum))); acum = []
            if prueba is not None:
                e = entropia_red(m, prueba); hist["prueba"].append(e)
                if e < mejor[0]: mejor = (e, {k: v.clone() for k, v in m.state_dict().items()}, p)
    if prueba is not None:
        m.ultimo_estado = {k: v.clone() for k, v in m.state_dict().items()}
        m.load_state_dict(mejor[1]); m.mejor_paso = mejor[2]
    m.hist = hist
    return m


def generar(m, prefijo, largo=200, temperatura=0.8, semilla=0):
    g = torch.Generator().manual_seed(semilla)
    with torch.no_grad():
        lo, h = m(a_ids(prefijo, m.vocab)[None]); out = prefijo
        for _ in range(largo):
            p = torch.softmax(lo[0, -1] / temperatura, -1); k = torch.multinomial(p, 1, generator=g).item()
            out += m.vocab[k]; lo, h = m(torch.tensor([[k]]), h)
    return out


def estados(m, texto):
    """Estado oculto h_t después de cada letra, y la probabilidad de la letra siguiente."""
    with torch.no_grad():
        x = nn.functional.one_hot(a_ids(texto, m.vocab)[None], len(m.vocab)).float()
        y, _ = m.rnn(x)
        lo = m.salida(y)
    return y[0].numpy(), torch.softmax(lo[0], -1).numpy()


def que_esperaba(m, texto, k=3):
    """Tabla 'qué esperaba en cada paso' (teacher forcing): cada fila es independiente."""
    _, P = estados(m, texto)
    print(f"{'leído hasta acá':>22} | venía | predijo (p)")
    for t in range(len(texto) - 1):
        top = np.argsort(-P[t])[:k]
        cand = "  ".join(f"'{m.vocab[j]}' {P[t, j]:.2f}" for j in top)
        ok = "✓" if m.vocab[top[0]] == texto[t + 1] else " "
        print(f"{texto[max(0, t - 21):t + 1]:>22} |  '{texto[t + 1]}'  | {cand}  {ok}")
    print("Ojo: cada fila se predijo sobre el texto verdadero. La columna 'predijo' NO se lee de corrido.")


def olvido(m, texto):
    """|∂h_T/∂x_i|: cuánto mueve la letra i al estado final. Si cae rápido hacia atrás, la red olvida."""
    ids = a_ids(texto, m.vocab)[None]
    _, _, y, x = m(ids, devolver_x=True)
    y[0, -1].norm().backward()
    return x.grad[0].norm(dim=-1).numpy()


def pca2(H):
    mu = H.mean(0); U, S, Vt = np.linalg.svd(H - mu, full_matrices=False)
    return mu, Vt[:2]


def clase_letra(c):
    if c == " ": return 0
    if c in "aeiouáéíóú": return 1
    if c.isalpha() or c == "ñ": return 2
    return 3


NOMBRES_CLASE = ["espacio", "vocal", "consonante", "signo"]
COLORES_CLASE = ["#5ec8d8", "#f2b35a", "#c58cf2", "#e0645a"]


def dibujar_trayectoria(m, corpus, texto, ax=None, n_fondo=1500):
    """El estado h_t en un plano (PCA). El fondo son estados del corpus pintados según qué letra predicen:
    el plano se lee por lo que predice, no por sus coordenadas."""
    Hc, Pc = estados(m, corpus); mu, W = pca2(Hc)
    idx = np.linspace(0, len(Hc) - 1, min(n_fondo, len(Hc))).astype(int)
    Z = (Hc[idx] - mu) @ W.T; cl = [clase_letra(m.vocab[int(np.argmax(Pc[i]))]) for i in idx]
    if ax is None: _, ax = plt.subplots(figsize=(6.4, 5))
    for k in range(4):
        sel = [j for j, c in enumerate(cl) if c == k]
        ax.scatter(Z[sel, 0], Z[sel, 1], s=7, color=COLORES_CLASE[k], alpha=.35, label=f"predice {NOMBRES_CLASE[k]}")
    Ht, _ = estados(m, texto); Zt = (Ht - mu) @ W.T
    ax.plot(Zt[:, 0], Zt[:, 1], "-", color="k", lw=1.2, alpha=.7)
    for t, c in enumerate(texto):
        ax.annotate("␣" if c == " " else c, Zt[t], fontsize=10, weight="bold", ha="center", va="center",
                    bbox=dict(boxstyle="round,pad=0.15", fc="white", ec="0.4", lw=.5))
    ax.set_xticks([]); ax.set_yticks([]); ax.legend(loc="upper right", fontsize=8, markerscale=2)
    ax.set_title(f"«{texto}»: el estado h_t, letra por letra")
    return ax, (mu, W)


# ---------------------------------------------------------------- 4. el agente con memoria
def obs_agente(env, s, a_prev):
    """Lo que siente el agente: 4 bigotes + la última acción (one-hot; ceros al empezar)."""
    o = np.zeros(8, np.float32); o[:4] = bigotes(env, s)
    if a_prev is not None: o[4 + a_prev] = 1
    return o


def experto(env, dist, s):
    """La acción que acerca a la salida (la conoce quien ve el mapa)."""
    return int(np.argmin([dist[env._move(s, a)[0]] if not env._move(s, a)[1] else 10**7 for a in range(4)]))


def datos_imitacion(env, dist, episodios=2000, T=60, eps=0.3, semilla=1):
    """Partidas desde casillas al azar. Se juega como el experto, pero con prob. eps una acción al azar
    (así aparecen situaciones fuera del camino ideal). La etiqueta es siempre la acción del experto."""
    rng = np.random.default_rng(semilla); inicios = [s for s in range(env.nS) if s != env.goal]
    X, Y, S, M = [], [], [], []
    for _ in range(episodios):
        s = inicios[rng.integers(len(inicios))]; ap = None; xs, ys, ss = [], [], []
        for t in range(T):
            xs.append(obs_agente(env, s, ap)); ys.append(experto(env, dist, s)); ss.append(s)
            a = int(rng.integers(4)) if rng.random() < eps else experto(env, dist, s)
            s, _ = env._move(s, a); ap = a
            if s == env.goal: break
        L = len(xs); pad = T - L
        X.append(np.pad(np.array(xs), ((0, pad), (0, 0)))); Y.append(ys + [0] * pad); S.append(ss + [0] * pad); M.append([1] * L + [0] * pad)
    return torch.tensor(np.array(X)), torch.tensor(Y), torch.tensor(S), torch.tensor(M, dtype=torch.float32)


class SinMemoria(nn.Module):
    """Red común (MLP): decide solo con lo que siente ahora."""
    def __init__(self, H=32):
        super().__init__(); self.f = nn.Sequential(nn.Linear(8, H), nn.Tanh(), nn.Linear(H, H), nn.Tanh(), nn.Linear(H, 4))
    def forward(self, x, h=None):
        return self.f(x), None


class ConMemoria(nn.Module):
    """Red recurrente (GRU): decide con lo que siente ahora y con su estado h_t."""
    def __init__(self, H=32):
        super().__init__(); self.gru = nn.GRU(8, H, batch_first=True); self.salida = nn.Linear(H, 4)
    def forward(self, x, h=None):
        y, h = self.gru(x, h); self.y = y
        return self.salida(y), h


def entrenar_imitacion(m, datos, pasos=800, B=64, lr=3e-3, semilla=0):
    torch.manual_seed(semilla); X, Y, S, M = datos; opt = torch.optim.Adam(m.parameters(), lr=lr); hist = []
    for _ in range(pasos):
        i = torch.randint(0, len(X), (B,)); lo, _ = m(X[i])
        l = (nn.functional.cross_entropy(lo.reshape(-1, 4), Y[i].reshape(-1), reduction="none") * M[i].reshape(-1)).sum() / M[i].sum()
        opt.zero_grad(); l.backward(); opt.step(); hist.append(l.item())
    return hist


def jugar(m, env, inicio, T=200):
    """Juega con la acción más probable. Devuelve el camino y los estados h_t (si tiene memoria)."""
    s, ap, h, camino, hs = inicio, None, None, [inicio], []
    with torch.no_grad():
        for _ in range(T):
            lo, h = m(torch.tensor(obs_agente(env, s, ap))[None, None], h)
            if h is not None: hs.append(h[0, 0].numpy().copy())
            a = int(lo[0, 0].argmax()); s, _ = env._move(s, a); ap = a; camino.append(s)
            if s == env.goal: break
    return camino, hs


def evaluar(m, env, dist, T=200):
    inicios = [s for s in range(env.nS) if s != env.goal]; ok, extra, atascadas = 0, [], []
    for s0 in inicios:
        c, _ = jugar(m, env, s0, T)
        if c[-1] == env.goal: ok += 1; extra.append(len(c) - 1 - dist[s0])
        else: atascadas.append(s0)
    return {"exito": ok / len(inicios), "pasos_de_mas": float(np.mean(extra)), "atascadas": atascadas, "n": len(inicios)}


def entrenar_sonda(m, datos, env, pasos=600, lr=1e-2, semilla=0):
    """Sonda lineal: desde h_t, adivinar en qué casilla está. Es la forma de 'ver' el estado:
    no se dibuja h_t, se dibuja lo que cree sobre la cueva."""
    torch.manual_seed(semilla); X, Y, S, M = datos
    with torch.no_grad():
        m(X); Hs = m.y
    sonda = nn.Linear(Hs.shape[-1], env.nS); opt = torch.optim.Adam(sonda.parameters(), lr=lr)
    Hf, Sf, Mf = Hs.reshape(-1, Hs.shape[-1]), S.reshape(-1), M.reshape(-1) > 0
    Hf, Sf = Hf[Mf], Sf[Mf]
    for _ in range(pasos):
        i = torch.randint(0, len(Hf), (2048,)); l = nn.functional.cross_entropy(sonda(Hf[i]), Sf[i])
        opt.zero_grad(); l.backward(); opt.step()
    return sonda


def plot_curva(ax, ys, color, label, suave=25):
    ys = np.asarray(ys, float); k = max(1, min(suave, len(ys) // 5))
    ax.plot(np.convolve(ys, np.ones(k) / k, mode="valid"), color=color, label=label)
