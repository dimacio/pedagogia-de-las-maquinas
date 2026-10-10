"""Arma notebooks/09-redes-recurrentes.ipynb (Clase 9: redes recurrentes, cuando el estado no alcanza).
Viene del notebook 07 de la v1 (build/v1/builders/build_nb07.py) sin su paso 1: la cadena de Markov ya es la clase 3.
Las herramientas salen de build/herramientas09.py y el corpus de build/corpus_cueva.txt (texto propio, escrito para el curso).
Ejecutar después: jupyter nbconvert --to notebook --execute --inplace notebooks/09-redes-recurrentes.ipynb"""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from _nbutil import md, code, writefile_cell, save, ROOT

herr = (ROOT / "build" / "herramientas09.py").read_text(encoding="utf-8").splitlines()
herr = "\n".join(l for l in herr if not l.startswith("# (Clase 9") and not l.startswith("#  viene de"))
corpus = (ROOT / "build" / "corpus_cueva.txt").read_text(encoding="utf-8").strip()
assert '"""' not in corpus

cells = []
A = cells.append

A(md(r"""
# Clase 9 — Redes recurrentes: cuando el estado no alcanza

**RL a ciegas · vía profunda (notebooks)**

En la clase 2 vimos la diferencia entre **historia** y **estado**, y en la clase 3 la **cadena de Markov**: si sabés en qué
casilla estás, el camino que hiciste para llegar no importa. Pero en el modo difícil del juego no ves la casilla: solo sentís
cuatro **bigotes** que tocan o no tocan pared. Ahí lo que ves no alcanza para decidir y hace falta **memoria**: un resumen del camino.

La idea de esta clase entra en una oración: **la partida es un camino**, igual que una oración es un camino de letras.
Una **red recurrente** (*recurrent neural network*, RNN) recorre ese camino de a un paso y lleva un **estado** $h_t$ que lo
resume. Con ese estado un agente se ubica en la cueva, y con el mismo estado un modelo de lenguaje adivina la letra que sigue.

| Sección | Qué hacemos | Qué vamos a ver |
|---|---|---|
| 1 | Solo bigotes: la observación no es el estado | 12 lecturas para 60 casillas; la memoria achica la nube |
| 2 | N-gramas de letras | generar con n = 2, 4, 8; cuánto copia; el error en un texto no visto |
| 3 | La red recurrente | una RNN de letras: lo que espera, su estado, cuánto olvida; la GRU |
| 4 | Un agente con memoria en la cueva | red común contra GRU, y dónde cree la GRU que está |
| 5 | El puente | un modelo de lenguaje es esto, a escala |

Todo corre en CPU en unos pocos minutos.
"""))

A(md("""
## Preparación

La primera celda escribe el entorno `cave_env.py` (el mismo de todas las clases), así el notebook funciona solo en Colab.
"""))
A(writefile_cell())

A(md("Imports y semillas fijas. Usamos **PyTorch** en CPU (en Colab ya viene instalado)."))
A(code(r"""
import numpy as np
import matplotlib.pyplot as plt
import torch
from cave_env import CaveEnv, ACTION_NAMES

np.random.seed(0)
torch.manual_seed(0)
torch.set_num_threads(1)      # con redes tan chicas, un hilo es más rápido y el resultado es reproducible
plt.rcParams["figure.dpi"] = 90
"""))

A(md(r"""
### Herramientas

Funciones largas (bigotes, n-gramas, la red de letras, el agente, los dibujos) y el **corpus**: un diario de la cueva de unas
5.400 letras escrito para este curso. **No hace falta leer esta celda**: en la clase solo usamos sus funciones.
En Colab aparece plegada.
"""))
A(code("#@title Herramientas (plegable)\n" + herr + '\n\n# ---------------------------------------------------------------- el corpus (texto propio del curso)\nCORPUS = preparar_texto("""\n' + corpus + '\n""")\nVOCAB = sorted(set(CORPUS))\nprint(f"corpus: {len(CORPUS)} letras, {len(VOCAB)} símbolos distintos")', herramientas=True))

# ------------------------------------------------------------------ 1
A(md(r"""
## 1. Solo bigotes: la observación no es el estado

En la clase 3 el caminante sabía en qué casilla estaba, y con eso alcanzaba: adónde va depende solo de dónde está ahora.
Ahora el agente **no sabe su casilla**: solo siente los cuatro bigotes (↑ → ↓ ←). Pintemos cada casilla según lo que se
siente en ella: casillas del mismo color **se sienten igual**.
""", objetivos=["O1"]))
A(code(r"""
env = CaveEnv()
lecturas = sorted({bigotes(env, s) for s in range(env.nS)})
ident = [lecturas.index(bigotes(env, s)) for s in range(env.nS)]
print(f"{env.nS} casillas, {len(lecturas)} lecturas distintas")
env.plot(values=ident, cmap="tab20", title="Cada color, una lectura de los bigotes")
plt.show()
"""))
A(md(r"""
Doce lecturas para sesenta casillas. Un pasillo vertical se siente igual en toda la cueva, pero en unos conviene subir y en
otros bajar: la lectura sola **no cumple el supuesto de Markov**. Esto es un **proceso de decisión de Markov parcialmente
observable** (*partially observable MDP*, POMDP): el estado existe (la casilla), pero el agente solo ve una pista de él.

¿Qué alcanza, entonces? **La historia**. Si me acuerdo de lo que sentí y de lo que hice, puedo descartar casillas:
me quedo con las que, movidas con mi acción, dan la lectura nueva. Ese conjunto es un **estado de creencia** (*belief state*):

$$b_{t+1} = \{\, \text{mover}(s, a_t) : s \in b_t \,\} \;\cap\; \{\, s' : \text{bigotes}(s') = o_{t+1} \,\}$$

Arrancamos en la casilla (8, 10) sin saberlo, y caminamos ← ← ↑ ↑.
"""))
A(code(r"""
inicio = env.pos2s[(8, 10)]
acciones = [3, 3, 0, 0]
hist, reales = creencia(env, acciones, inicio=inicio)
fig, ax = plt.subplots(1, len(hist), figsize=(4 * len(hist), 3.4))
for t, (B, s) in enumerate(zip(hist, reales)):
    v = np.zeros(env.nS); v[list(B)] = 1
    env.plot(values=v, ax=ax[t], path=reales[:t + 1], cmap="Blues",
             title=f"t={t}" + (f" tras {ACTION_NAMES[acciones[t-1]]}" if t else "") + f": {len(B)} posibles")
plt.tight_layout(); plt.show()
print("casillas posibles en cada paso:", [len(B) for B in hist])
"""))
A(md(r"""
En cuatro pasos la nube se achica hasta una sola casilla (los números están impresos arriba): **el camino ubica; una
casilla sola no**.

¿Es un caso de suerte? Midámoslo: 200 caminatas al azar de 30 pasos, desde casillas al azar, contando cuántas casillas
quedan posibles **sin memoria** (solo la lectura de ahora) y **con memoria** (toda la historia).
"""))
A(code(r"""
rng = np.random.default_rng(0)
sin_m, con_m = [], []
for _ in range(200):
    s0 = int(rng.integers(env.nS))
    acc = list(rng.integers(0, 4, 30))
    sin_m.append([len(b) for b in creencia(env, acc, inicio=s0, memoria=False)[0]])
    con_m.append([len(b) for b in creencia(env, acc, inicio=s0, memoria=True)[0]])
plt.figure(figsize=(7, 3.4))
plt.plot(np.mean(sin_m, 0), color=NARANJA, label="sin memoria (solo la lectura de ahora)")
plt.plot(np.mean(con_m, 0), color=AZUL, label="con memoria (toda la historia)")
plt.xlabel("paso"); plt.ylabel("casillas posibles (promedio)"); plt.legend(); plt.grid(alpha=.3)
plt.title("La memoria achica la nube"); plt.show()
print(f"en t=0: {np.mean(sin_m, 0)[0]:.1f} casillas posibles (las dos iguales)")
print(f"después de 5 pasos: sin memoria {np.mean(sin_m, 0)[5]:.1f}, con memoria {np.mean(con_m, 0)[5]:.2f}")
print(f"después de 30 pasos: sin memoria {np.mean(sin_m, 0)[-1]:.1f} casillas posibles, con memoria {np.mean(con_m, 0)[-1]:.2f}")
"""))
A(md(r"""
El agente que tiene que decidir con bigotes necesita **algo que haga este trabajo**: un resumen de la historia que alcance
para ubicarse. Acá lo calculamos a mano porque conocemos el mapa. Sin mapa, ese resumen hay que **aprenderlo**:
eso es lo que va a hacer la red recurrente. Antes, un desvío por el texto, donde la historia es todavía más evidente.

> ✍️ **Ejercicio:** cambiá `acciones = [3, 3, 0, 0]` por `[0, 0, 3, 3]` (primero subir, después ir a la izquierda).
> ¿Se ubica igual de rápido? ¿Por qué un movimiento que choca contra la pared también da información?
"""))

# ------------------------------------------------------------------ 2
A(md(r"""
## 2. N-gramas de letras: contar no alcanza

Un texto también es un camino: una letra detrás de otra. La forma más vieja de predecir la letra que viene es **contar**
(Shannon, 1948): para cada grupo de $n-1$ letras, cuántas veces vino cada letra después. Eso es un **n-grama** (*n-gram*), y
es una cadena de Markov como la de la clase 3, cuyo estado son las últimas $n-1$ letras:

$$P(x_t \mid \text{contexto}) = \frac{\text{cuenta}(\text{contexto} + x_t)}{\text{cuenta}(\text{contexto})}$$

Primero miremos el corpus y la tabla para dos contextos.
""", objetivos=["O2"]))
A(code(r"""
print(CORPUS[:300], "...\n")
for n, ctx in [(3, "pa"), (4, "la ")]:
    tab = tabla_ngramas(CORPUS, n)
    total = sum(tab[ctx].values())
    top = sorted(tab[ctx].items(), key=lambda kv: -kv[1])[:5]
    print(f"n={n}: después de «{ctx}» →", "  ".join(f"'{c}' {v/total:.2f}" for c, v in top))
"""))
A(md("Ahora generamos 300 letras tirando el dado con esas cuentas, para tres valores de n. Medimos cuánto del texto generado está **copiado tal cual** del corpus (tramos de 20 letras)."))
A(code(r"""
for n in [2, 4, 8]:
    g = generar_ngramas(CORPUS, n, largo=300, semilla=1)
    print(f"--- n = {n}  ({len(tabla_ngramas(CORPUS, n))} contextos, copiado {100*copiado(g, CORPUS):.0f} %)")
    print(g, "\n")
"""))
A(md(r"""
Con n chico inventa palabras; con n grande **copia** el corpus. Para medirlo bien separamos el corpus: entrenamos la tabla con
la primera parte (hasta "segundo día") y medimos el error sobre la parte que no vio. El error es la **entropía cruzada**
(*cross-entropy*) en nats por letra: cuanto más baja, mejor predice.
"""))
A(code(r"""
corte = CORPUS.index("segundo día")
ENT, PRU = CORPUS[:corte], CORPUS[corte:]
print(f"entrenamiento: {len(ENT)} letras; prueba: {len(PRU)} letras")
ns = list(range(1, 11))
err = [entropia_ngramas(ENT, PRU, n, alfa=0.1, vocab=VOCAB) for n in ns]
ctx = [len(tabla_ngramas(ENT, n)) for n in ns]
fig, ax = plt.subplots(1, 2, figsize=(12, 3.6))
ax[0].plot(ns, err, "o-", color=AZUL); ax[0].set_xlabel("n"); ax[0].set_ylabel("nats por letra")
ax[0].set_title("Error en el texto no visto"); ax[0].grid(alpha=.3)
ax[1].semilogy(ns, ctx, "o-", color=NARANJA); ax[1].set_xlabel("n"); ax[1].set_ylabel("contextos distintos")
ax[1].set_title("Tamaño de la tabla"); ax[1].grid(alpha=.3)
plt.tight_layout(); plt.show()
for n, e, c in zip(ns, err, ctx):
    print(f"n = {n:2d}: {e:.2f} nats por letra, {c:5d} contextos")
MEJOR_N = ns[int(np.argmin(err))]
print(f"mejor n = {MEJOR_N}: {min(err):.2f} nats por letra")
"""))
A(md(r"""
El error baja hasta el mejor $n$ (impreso arriba) y después **sube**: con contextos largos, casi cada contexto se vio una sola
vez y la tabla no sabe qué hacer con uno nuevo. Y aunque tuviéramos texto de sobra, un n-grama **nunca recuerda más de
$n-1$ letras**: para cerrar un paréntesis abierto hace veinte letras haría falta una tabla con un renglón por cada cadena de
veinte letras.

**Contar no alcanza.** Hace falta algo que guarde lo importante del pasado en un tamaño fijo.

> ✍️ **Ejercicio:** en la celda de generación cambiá `[2, 4, 8]` por `[3, 6, 12]`. ¿Desde qué n el texto ya es casi todo copia?
"""))

# ------------------------------------------------------------------ 3
A(md(r"""
## 3. La red recurrente: leer en orden es acumular

La solución es una flecha. Una red lee una letra $x_t$ por vez y, además de la letra, recibe **lo que dejó el paso anterior**:
un vector $h_{t-1}$, el **estado oculto** (*hidden state*). Lo mezcla con la letra nueva y devuelve el estado nuevo:

$$h_t = \tanh(W_{hh}\, h_{t-1} + W_{xh}\, x_t + b) \qquad \hat y_t = \text{softmax}(W_{hy}\, h_t)$$

Las tablas $W$ **son las mismas en todos los pasos**: la red no crece con el texto. La regla no cambia; el estado sí.
Es la red de la clase 8 con un lazo: la red recurrente simple de Elman (1990). Usamos un estado de 32 números y la letra
entra como *one-hot*.
""", objetivos=["O3"]))
A(code(r"""
t0 = time.time()
elman = entrenar_lm(CORPUS, VOCAB, "elman", H=32, pasos=2000, semilla=0)
n_pesos = sum(p.numel() for p in elman.parameters())
print(f"{n_pesos} pesos, entrenada en {time.time() - t0:.0f} s")
print(f"pérdida: {elman.hist['entren'][0]:.2f} nats por letra al principio, {elman.hist['entren'][-1]:.2f} al final")
plt.figure(figsize=(6, 3)); plt.plot(elman.hist["paso"], elman.hist["entren"], color=AZUL)
plt.xlabel("paso de entrenamiento"); plt.ylabel("nats por letra"); plt.title("La pérdida baja"); plt.grid(alpha=.3); plt.show()
"""))
A(md("Ahora la dejamos escribir sola: cada letra que elige se vuelve la entrada del paso siguiente. La **temperatura** controla cuánto se arriesga (baja: repite lo más probable; alta: inventa)."))
A(code(r"""
for T in [0.3, 0.7, 1.2]:
    print(f"--- temperatura {T}")
    print(generar(elman, "la pared ", largo=200, temperatura=T, semilla=2), "\n")
"""))
A(md(r"""
### Qué esperaba en cada paso

Para ver el estado sin dibujarlo, le preguntamos en cada posición **qué cree que viene**. Ojo con cómo se pregunta: le damos
el texto **verdadero** y en cada posición predice la letra siguiente (*teacher forcing*, igual que al entrenar). Cada fila
es una pregunta distinta sobre el texto real, así que **la columna "predijo" no se lee de corrido**: no es un texto.
"""))
A(code(r"""
que_esperaba(elman, "toco la pared (la de la")
"""))
A(md(r"""
Acierta donde hay pocas opciones (después de «pa» viene «r» o «s») y duda donde puede venir cualquier palabra. Que acierte
poco después de un espacio no es una falla del modelo: es la tarea.

### El estado, letra por letra

El estado son 32 números. Los dibujamos como un mapa de calor: una columna por letra leída, una fila por dimensión.
"""))
A(code(r"""
frase = "toco la pared (la de la izquierda) y "
Hs, _ = estados(elman, frase)
plt.figure(figsize=(12, 3.6))
plt.imshow(Hs.T, cmap="RdYlGn", vmin=-1, vmax=1, aspect="auto")
plt.xticks(range(len(frase)), ["␣" if c == " " else c for c in frase])
plt.ylabel("dimensión de h_t"); plt.colorbar(fraction=.02); plt.title("Cada letra empuja el estado")
plt.show()
cambio = np.abs(np.diff(Hs, axis=0)).mean(0)
print(f"cambio medio por letra: la dimensión más inquieta se mueve {cambio.max():.2f}, la más quieta {cambio.min():.2f}")
"""))
A(md(r"""
Todas las dimensiones se mueven con cada letra, unas más que otras (las cifras están impresas arriba). Pero los números del estado **no tienen letras**:
leer la dimensión 17 no dice nada. Para dibujar el estado como un camino lo proyectamos a un plano (PCA) y pintamos el
fondo con estados del corpus **según qué letra predicen**: así el plano se lee por lo que hace.
"""))
A(code(r"""
dibujar_trayectoria(elman, CORPUS, "la pared de la ")
plt.show()
"""))
A(md(r"""
Cada letra mueve el punto; después de un espacio el estado cae en la zona que predice consonante, después de una
consonante en la que predice vocal. **El estado es un sistema dinámico** y las letras son las fuerzas que lo empujan.

### El olvido, medido con un gradiente

¿Cuánto mueve una letra vieja al estado final? Lo medimos con el gradiente $|\partial h_T / \partial x_i|$, primero en la
red **sin entrenar** (pesos al azar) y después en la entrenada.
"""))
A(code(r"""
torch.manual_seed(1)
sin_entrenar = ModeloLetras(VOCAB, "elman", H=32)
frase = "toco la pared (la de la izquierda) y doblo"
g0, g1 = olvido(sin_entrenar, frase), olvido(elman, frase)
plt.figure(figsize=(12, 3.4))
plt.semilogy(g0 / g0[-1], "o-", color=GRIS, label="sin entrenar")
plt.semilogy(g1 / g1[-1], "o-", color=NARANJA, label="entrenada")
plt.xticks(range(len(frase)), ["␣" if c == " " else c for c in frase])
plt.ylabel("|∂h_T/∂x_i| (relativo a la última)"); plt.legend(); plt.grid(alpha=.3)
plt.title("Cuánto pesa cada letra en el estado final"); plt.show()
print(f"{len(frase)} letras. La primera pesa {g0[0]/g0[-1]:.1e} de la última sin entrenar, y {g1[0]/g1[-1]:.1e} entrenada")
print(f"la letra de hace 10 pasos pesa {g0[-11]/g0[-1]:.1e} sin entrenar y {g1[-11]/g1[-1]:.1e} entrenada")
"""))
A(md(r"""
Sin entrenar, el efecto de una letra **cae geométricamente** hacia atrás: cada paso lo multiplica por un número menor que uno.
Eso es el **gradiente que se desvanece** (*vanishing gradient*), y es la razón por la que una RNN simple aprende mal lo que
pasó lejos. Entrenar la ayuda, pero no del todo.

### La perilla: GRU (y LSTM)

La **GRU** (*gated recurrent unit*; Cho et al., 2014) le agrega a la red una **perilla** $z_t$, un número entre 0 y 1 por
dimensión, que decide cuánto conservar del estado viejo y cuánto renovar:

$$h_t = (1 - z_t)\, h_{t-1} + z_t\, \tilde h_t$$

Es un **promedio ponderado entre quedarse y moverse**: con $z \approx 0$ la dimensión casi no se toca y guarda memoria larga.
(PyTorch escribe la misma ecuación con $z$ del otro lado: en su convención $z$ pondera el estado viejo.)
La **LSTM** (*long short-term memory*; Hochreiter y Schmidhuber, 1997) es la versión anterior, con tres perillas y dos
estados; hace lo mismo.

Entrenamos una GRU de 64 estados con la misma división que los n-gramas, mirando el error en el texto no visto cada 50 pasos.
"""))
A(code(r"""
t0 = time.time()
gru = entrenar_lm(ENT, VOCAB, "gru", H=64, pasos=600, semilla=0, prueba=PRU)
print(f"entrenada en {time.time() - t0:.0f} s; mejor error en texto no visto {min(gru.hist['prueba']):.2f} en el paso {gru.mejor_paso}")
print(f"al final (paso {gru.hist['paso'][-1]}): {gru.hist['prueba'][-1]:.2f} en texto no visto, {gru.hist['entren'][-1]:.2f} en el de entrenamiento")
print(f"mejor n-grama (n = {MEJOR_N}): {min(err):.2f}")
plt.figure(figsize=(7, 3.4))
plt.plot(gru.hist["paso"], gru.hist["entren"], color=AZUL, label="GRU: texto de entrenamiento")
plt.plot(gru.hist["paso"], gru.hist["prueba"], color=NARANJA, label="GRU: texto no visto")
plt.axhline(min(err), color=GRIS, ls="--", label=f"mejor n-grama (n = {MEJOR_N})")
plt.xlabel("paso de entrenamiento"); plt.ylabel("nats por letra"); plt.legend(); plt.grid(alpha=.3); plt.show()
"""))
A(md(r"""
Si se la frena a tiempo, la GRU predice el texto que no vio **mejor que el mejor n-grama**, con una tabla de tamaño fijo.
Si se la deja seguir, empieza a **memorizar** el corpus (que es chiquito) y el error en el texto no visto sube: el mismo
problema que el n-grama largo, por otro camino. Con millones de letras, una red así aprende a cerrar paréntesis y comillas
(Karpathy, 2015); con 5.400, no.

> ✍️ **Ejercicio:** cambiá `H=64` por `H=16` y por `H=128`. ¿Cuál memoriza antes?
"""))

# ------------------------------------------------------------------ 4
A(md(r"""
## 4. De vuelta a la cueva: un agente con memoria

Volvemos al agente que solo siente bigotes. En cada paso recibe 8 números: los **4 bigotes** y su **última acción**
(*one-hot*). Comparamos dos redes con la misma entrada:

- **sin memoria**: una red común (MLP, como la de la clase 8), que decide solo con lo que siente ahora;
- **con memoria**: una **GRU** de 32 estados, que decide con lo que siente y con su estado $h_t$.

**Cómo las entrenamos, dicho explícitamente.** No usamos RL acá: usamos **aprendizaje por imitación** (*behavior cloning*),
que es aprendizaje supervisado (es el tema de la clase 10). Un experto que ve el mapa juega muchas partidas desde casillas al
azar (con un 30 % de acciones al azar, para que aparezcan situaciones fuera del camino ideal) y las redes aprenden a copiar
**la acción del experto** a partir de lo que siente el agente. La versión con RL existe y se llama DRQN (Hausknecht y Stone,
2015: la DQN de la clase 8 con una capa recurrente), pero necesita muchas más partidas de las que entran en una clase en CPU.

Usamos la **cueva grande**, donde la diferencia se nota más.
""", objetivos=["O3"]))
A(code(r"""
env_g = CaveEnv(CUEVA_GRANDE)
dist_g = distancias(env_g)
print(f"{env_g.nS} casillas, {len({bigotes(env_g, s) for s in range(env_g.nS)})} lecturas distintas, la más lejana a {dist_g.max()} pasos")
datos = datos_imitacion(env_g, dist_g, episodios=2000, T=60, eps=0.3, semilla=1)
print("datos:", tuple(datos[0].shape), "=", int(datos[3].sum()), "pasos con su acción del experto")

t0 = time.time()
sin = SinMemoria(32); h_sin = entrenar_imitacion(sin, datos, pasos=800)
con = ConMemoria(32); h_con = entrenar_imitacion(con, datos, pasos=800)
print(f"entrenadas en {time.time() - t0:.0f} s")
print(f"entropía cruzada final (promedio de los últimos 50 pasos): sin memoria {np.mean(h_sin[-50:]):.2f}, con memoria {np.mean(h_con[-50:]):.2f}")
plt.figure(figsize=(6, 3)); plot_curva(plt.gca(), h_sin, NARANJA, "sin memoria"); plot_curva(plt.gca(), h_con, AZUL, "con memoria (GRU)")
plt.xlabel("paso de entrenamiento"); plt.ylabel("entropía cruzada"); plt.legend(); plt.grid(alpha=.3)
plt.title("Copiar al experto"); plt.show()
"""))
A(md("La GRU copia mucho mejor al experto. Pero lo que importa es si **sale**. Las ponemos a jugar desde cada casilla (máximo 200 pasos, siempre la acción más probable)."))
A(code(r"""
ev_sin, ev_con = evaluar(sin, env_g, dist_g), evaluar(con, env_g, dist_g)
for nombre, ev in [("sin memoria", ev_sin), ("con memoria", ev_con)]:
    print(f"{nombre:12s}: sale desde {round(ev['exito'] * ev['n'])} de {ev['n']} casillas ({100*ev['exito']:.0f} %); "
          f"cuando sale, {ev['pasos_de_mas']:.1f} pasos de más que el óptimo")

fig, ax = plt.subplots(1, 2, figsize=(15, 4.2))
c_sin, _ = jugar(sin, env_g, env_g.start); c_con, _ = jugar(con, env_g, env_g.start)
env_g.plot(path=c_sin, ax=ax[0], title=f"Sin memoria desde S: {'sale' if c_sin[-1] == env_g.goal else 'se traba'} ({len(c_sin) - 1} pasos)")
env_g.plot(path=c_con, ax=ax[1], title=f"Con memoria desde S: {'sale' if c_con[-1] == env_g.goal else 'se traba'} ({len(c_con) - 1} pasos; óptimo {dist_g[env_g.start]})")
plt.tight_layout(); plt.show()
"""))
A(md(r"""
La red común se traba yendo y viniendo entre casillas que se sienten igual: con la misma lectura y la misma última
acción, toma siempre la misma decisión. **La última acción ya es memoria de un paso**, y en la cueva chica casi alcanza;
en la grande, no. La GRU sale desde todas (las cuentas están impresas arriba), con unos pocos pasos de más.

### Dónde cree que está

El estado $h_t$ de la GRU son 32 números sin nombre. Para verlo entrenamos una **sonda** (*probe*): una capa lineal que,
a partir de $h_t$, adivina la casilla. No la usa el agente; es nuestra forma de leerle la mente. La dibujamos donde viven
las casillas: sobre la cueva.
"""))
A(code(r"""
sonda = entrenar_sonda(con, datos, env_g)
camino, hs = jugar(con, env_g, env_g.start)
fig, ax = plt.subplots(1, 4, figsize=(18, 3.4))
for k, t in enumerate([0, 3, 10, 25]):
    with torch.no_grad():
        p = torch.softmax(sonda(torch.tensor(hs[t])), -1).numpy()
    env_g.plot(values=p, ax=ax[k], path=camino[:t + 1], cmap="Blues", title=f"t = {t}: P(casilla real) = {p[camino[t]]:.2f}")
plt.tight_layout(); plt.show()
"""))
A(code(r"""
# acierto de la sonda según el paso, promediado sobre todas las salidas
aciertos = np.zeros(30); cuantos = np.zeros(30)
for s0 in range(env_g.nS):
    if s0 == env_g.goal: continue
    camino, hs = jugar(con, env_g, s0, T=30)
    with torch.no_grad():
        pred = sonda(torch.tensor(np.array(hs))).argmax(-1).numpy()
    for t, s in enumerate(camino[:len(pred)]):
        aciertos[t] += pred[t] == s; cuantos[t] += 1
plt.figure(figsize=(7, 3.2)); plt.plot(aciertos / np.maximum(cuantos, 1), "o-", color=AZUL)
plt.xlabel("paso"); plt.ylabel("acierto de la sonda"); plt.ylim(0, 1.02); plt.grid(alpha=.3)
plt.title("La GRU se ubica a medida que camina"); plt.show()
print(f"acierto de la sonda en t=0: {aciertos[0]/cuantos[0]:.2f}   en t=5: {aciertos[5]/max(cuantos[5],1):.2f}   en t=10: {aciertos[10]/max(cuantos[10],1):.2f}")
"""))
A(md(r"""
Al principio la sonda acierta poco: con una sola lectura, nadie puede saber dónde está. A veces se equivoca con confianza
(en la figura de arriba, en t = 3 apuesta por un pasillo del otro lado que se siente igual) y unos pasos después se corrige. A medida que camina, el estado
acumula la historia y la sonda la encuentra: **la red aprendió sola algo parecido al estado de creencia de la sección 1**,
sin que nadie le diera el mapa.

> ✍️ **Ejercicio:** repetí la sección 4 con la cueva chica (`env_g = CaveEnv()`). ¿La red común también se traba?
> ¿Por qué la última acción alcanza más en una cueva que en la otra?
"""))

# ------------------------------------------------------------------ 5
A(md(r"""
## 5. El puente: un modelo de lenguaje es esto, a escala

Lo que hicimos hoy dos veces es lo mismo: **leer un camino de a un paso y llevar un resumen**. En la cueva el resumen sirve
para decidir la acción; en el texto, para predecir la letra que sigue. Un modelo de lenguaje como Qwen2.5-0.5B, el que vamos a
usar desde la clase 13, hace la segunda tarea con pedazos de palabra (*tokens*) en vez de letras y con muchísimo más texto.
""", objetivos=["O4"]))
A(code(r"""
tamanos = {
    "n-grama n=8 (contextos × letras)": len(tabla_ngramas(CORPUS, 8)) * len(VOCAB),
    "RNN de letras (sección 3)": sum(p.numel() for p in elman.parameters()),
    "agente GRU (sección 4)": sum(p.numel() for p in con.parameters()),
    "Qwen2.5-0.5B (desde la clase 13)": 494_000_000,
}
for k, v in tamanos.items():
    print(f"{k:34s} {v:>13,}".replace(",", "."))
"""))
A(md(r"""
El salto de escala no es lo único que cambia. Un **transformer**, en una frase: en vez de recorrer el camino pasando el estado
de mano en mano, en cada paso **mira a la vez todas las letras anteriores y elige a cuáles atender** (*attention*). Así no
depende de que el gradiente sobreviva cien pasos, a cambio de mirar todo cada vez. La pregunta sigue siendo la misma:
con lo que leí hasta acá, ¿qué viene?

## Preguntas para pensar

1. En la sección 1 calculamos la creencia exacta porque conocíamos el mapa. Si el piso fuera resbaloso (el *slip* de la
   clase 4), ¿la creencia seguiría siendo un conjunto, o haría falta una probabilidad por casilla?
2. La red común de la sección 4 se traba yendo y viniendo. ¿Le alcanzaría con elegir la acción al azar según sus
   probabilidades, en vez de la más probable? ¿Qué perdería?
3. Un n-grama y una RNN predicen la próxima letra. ¿Qué guarda cada uno del pasado? ¿Cuál se parece más a tu forma de leer?

## Próxima clase

Clase 10: **aprender de registros**. Hoy la red aprendió copiando: el texto que leyó y las partidas del experto. Eso es
**imitar**. La próxima vemos cuándo imitar alcanza, por qué los errores se acumulan y qué es el RL *offline*: aprender
solo de partidas ya grabadas.
"""))

save(cells, "09-redes-recurrentes.ipynb")
