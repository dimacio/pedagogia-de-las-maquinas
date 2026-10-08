"""Arma notebooks/07-redes-recurrentes.ipynb (Clase 7: redes recurrentes).
Las herramientas salen de build/herramientas07.py (las mismas que usa build_pesos7.py para la página)
y el corpus de build/corpus_cueva.txt (texto propio, escrito para el curso).
Ejecutar después: cd notebooks && jupyter nbconvert --to notebook --execute --inplace 07-redes-recurrentes.ipynb"""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from _nbutil import md, code, writefile_cell, save, ROOT

herr = (ROOT / "build" / "herramientas07.py").read_text().splitlines()
herr = "\n".join(l for l in herr if not l.startswith("# (Clase 7") and not l.startswith("#  y también"))
corpus = (ROOT / "build" / "corpus_cueva.txt").read_text().strip()
assert '"""' not in corpus

cells = []
A = cells.append

A(md(r"""
# Clase 7 — Redes recurrentes: cuando el estado no alcanza

**RL a ciegas · vía profunda (notebooks)**

En la clase 2 vimos el **supuesto de Markov**: si el agente sabe en qué casilla está, el camino que hizo para llegar
no importa. Pero en el modo difícil del juego no ves la casilla: solo sentís cuatro **bigotes** que tocan o no tocan pared.
Ahí la observación no alcanza para decidir y hace falta **memoria**: un resumen del camino.

La idea de esta clase entra en una oración: **la partida es un camino**, igual que una oración es un camino de letras.
Una **red recurrente** (RNN) recorre ese camino de a un paso y lleva un **estado** $h_t$ que lo resume. Con ese estado
un agente se ubica en la cueva, y con el mismo estado un modelo de lenguaje adivina la letra que sigue.

| Paso | Qué hacemos | Qué vamos a ver |
|---|---|---|
| 1 | El caminante al azar: una cadena de Markov | la matriz $P$ y la nube $p_t$ sobre la cueva |
| 2 | Solo bigotes: la observación no es el estado | 12 lecturas para 60 casillas; la memoria achica la nube |
| 3 | El texto como cadena de Markov: n-gramas | generar con n = 2, 4, 8; el error en un texto no visto |
| 4 | La red recurrente | una RNN de letras: lo que espera, su estado, cuánto olvida |
| 5 | De vuelta a la cueva: un agente con memoria | red común contra GRU, y dónde cree la GRU que está |
| 6 | El puente | un modelo de lenguaje es esto, a escala |

Todo corre en CPU en un par de minutos.
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

Funciones largas (n-gramas, la red de letras, el agente, los dibujos) y el **corpus**: un diario de la cueva de unas
5.400 letras escrito para este curso. **No hace falta leer esta celda**: en la clase solo usamos sus funciones.
En Colab aparece plegada.
"""))
A(code("#@title Herramientas (plegable)\n" + herr + '\n\n# ---------------------------------------------------------------- el corpus (texto propio del curso)\nCORPUS = preparar_texto("""\n' + corpus + '\n""")\nVOCAB = sorted(set(CORPUS))\nprint(f"corpus: {len(CORPUS)} letras, {len(VOCAB)} símbolos distintos")', herramientas=True))

# ------------------------------------------------------------------ Paso 1
A(md(r"""
## Paso 1 — El caminante sin memoria

Un caminante tira un dado de cuatro caras en cada paso; si choca contra una pared, se queda donde está.
Adónde va **depende solo de dónde está ahora**. Eso es una **cadena de Markov** (*Markov chain*).

Todo lo que hace el caminante entra en una tabla: la **matriz de transición** $P$, de 60 × 60 (una fila por casilla de
partida, una columna por casilla de llegada). Vamos a ver la tabla como imagen y, al lado, una caminata de 60 pasos.
"""))
A(code(r"""
env = CaveEnv()
P = matriz_azar(env)                      # P[s, s'] = probabilidad de pasar de s a s'
print("cada fila suma 1:", np.allclose(P.sum(1), 1))

fig, ax = plt.subplots(1, 2, figsize=(12, 4.6))
ax[0].imshow(P, cmap="magma"); ax[0].set_title("Matriz P (60 × 60)")
ax[0].set_xlabel("casilla de llegada"); ax[0].set_ylabel("casilla de partida")
env.plot(path=caminante(env, 60, semilla=3), ax=ax[1], title="Una caminata al azar de 60 pasos")
plt.tight_layout(); plt.show()
"""))
A(md(r"""
Casi toda la tabla es cero: desde una casilla solo se llega a sus vecinas o a ella misma (la diagonal es *chocar*).
La caminata vuelve una y otra vez sobre sus pasos: **no recuerda nada**.

Si en vez de un caminante pensamos en la **nube** de todos los caminantes posibles, la probabilidad $p_t$ de estar en cada
casilla se actualiza multiplicando por la tabla:

$$p_{t+1} = p_t \, P$$
"""))
A(code(r"""
p = np.zeros(env.nS); p[env.start] = 1.0
fig, ax = plt.subplots(1, 4, figsize=(16, 3.6))
t = 0
for k, hasta in enumerate([0, 5, 20, 80]):
    while t < hasta:
        p = p @ P; t += 1
    env.plot(values=p, ax=ax[k], title=f"t = {t}   P(salió) = {p[env.goal]:.2f}")
plt.tight_layout(); plt.show()
"""))
A(md(r"""
La nube se desparrama por la cueva y, muy de a poco, se junta en la salida (que es absorbente: el que llega, se queda).

> ✍️ **Ejercicio:** cambiá `80` por `400`. ¿Cuánto tarda la mitad de la nube en salir? Compará con los 20 pasos del camino
> más corto.
"""))

# ------------------------------------------------------------------ Paso 2
A(md(r"""
## Paso 2 — Solo bigotes: la observación no es el estado

Ahora el agente no sabe su casilla: solo siente los cuatro bigotes (↑ → ↓ ←). Pintemos cada casilla según lo que se siente
en ella: casillas del mismo color **se sienten igual**.
"""))
A(code(r"""
lecturas = sorted({bigotes(env, s) for s in range(env.nS)})
ident = [lecturas.index(bigotes(env, s)) for s in range(env.nS)]
print(f"{env.nS} casillas, {len(lecturas)} lecturas distintas")
env.plot(values=ident, cmap="tab20", title="Cada color, una lectura de los bigotes")
plt.show()
"""))
A(md(r"""
Doce lecturas para sesenta casillas. Un pasillo vertical se siente igual en toda la cueva, pero en unos conviene subir y en
otros bajar: la lectura sola **no es Markov**. Esto es un **MDP parcialmente observable** (*POMDP*).

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
"""))
A(md(r"""
En cuatro pasos la nube pasa de 15 casillas a una sola: **el camino ubica; una casilla sola no**.

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
print(f"después de 30 pasos: sin memoria {np.mean(sin_m, 0)[-1]:.1f} casillas posibles, con memoria {np.mean(con_m, 0)[-1]:.2f}")
"""))
A(md(r"""
El agente que tiene que decidir con bigotes necesita **algo que haga este trabajo**: un resumen de la historia que alcance
para ubicarse. Acá lo calculamos a mano porque conocemos el mapa. Sin mapa, ese resumen hay que **aprenderlo**:
eso es lo que va a hacer la red recurrente. Antes, un desvío por el texto, donde la historia es todavía más evidente.
"""))

# ------------------------------------------------------------------ Paso 3
A(md(r"""
## Paso 3 — El texto como cadena de Markov: n-gramas

Un texto también es un camino: una letra detrás de otra. La forma más vieja de predecir la letra que viene es **contar**:
para cada grupo de $n-1$ letras, cuántas veces vino cada letra después. Eso es un **n-grama** (*n-gram*), y es una cadena
de Markov cuyo estado son las últimas $n-1$ letras:

$$P(x_t \mid \text{contexto}) = \frac{\text{cuenta}(\text{contexto} + x_t)}{\text{cuenta}(\text{contexto})}$$

Primero miremos la tabla para dos contextos.
"""))
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
ns = list(range(1, 11))
err = [entropia_ngramas(ENT, PRU, n, alfa=0.1, vocab=VOCAB) for n in ns]
ctx = [len(tabla_ngramas(ENT, n)) for n in ns]
fig, ax = plt.subplots(1, 2, figsize=(12, 3.6))
ax[0].plot(ns, err, "o-", color=AZUL); ax[0].set_xlabel("n"); ax[0].set_ylabel("nats por letra")
ax[0].set_title("Error en el texto no visto"); ax[0].grid(alpha=.3)
ax[1].semilogy(ns, ctx, "o-", color=NARANJA); ax[1].set_xlabel("n"); ax[1].set_ylabel("contextos distintos")
ax[1].set_title("Tamaño de la tabla"); ax[1].grid(alpha=.3)
plt.tight_layout(); plt.show()
MEJOR_N = ns[int(np.argmin(err))]
print(f"mejor n = {MEJOR_N}: {min(err):.2f} nats por letra")
"""))
A(md(r"""
El error baja hasta $n = 3$ y después **sube**: con contextos largos, casi cada contexto se vio una sola vez y la tabla no
sabe qué hacer con uno nuevo. Y aunque tuviéramos texto de sobra, un n-grama **nunca recuerda más de $n-1$ letras**:
para cerrar un paréntesis abierto hace veinte letras haría falta una tabla con un renglón por cada cadena de veinte letras.

**Contar no alcanza.** Hace falta algo que guarde lo importante del pasado en un tamaño fijo.
"""))

# ------------------------------------------------------------------ Paso 4
A(md(r"""
## Paso 4 — La red recurrente

La solución es una flecha. Una red lee una letra $x_t$ por vez y, además de la letra, recibe **lo que dejó el paso anterior**:
un vector $h_{t-1}$, el **estado oculto**. Lo mezcla con la letra nueva y devuelve el estado nuevo:

$$h_t = \tanh(W_{hh}\, h_{t-1} + W_{xh}\, x_t + b) \qquad \hat y_t = \text{softmax}(W_{hy}\, h_t)$$

Las tablas $W$ **son las mismas en todos los pasos**: la red no crece con el texto. La regla no cambia; el estado sí.
Esto es la red recurrente simple de Elman (1990). Usamos un estado de 32 números y la letra entra como *one-hot*.
Es **la misma red que corre en la página de la clase**, con las mismas semillas.
"""))
A(code(r"""
t0 = time.time()
elman = entrenar_lm(CORPUS, VOCAB, "elman", H=32, pasos=2000, semilla=0)
n_pesos = sum(p.numel() for p in elman.parameters())
print(f"{n_pesos} pesos, entrenada en {time.time() - t0:.0f} s")
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
"""))
A(md(r"""
Hay dimensiones que cambian con cada letra y otras que se mueven poco. Pero los números del estado **no tienen letras**:
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
print(f"la primera letra pesa {g0[0]/g0[-1]:.1e} de la última sin entrenar, y {g1[0]/g1[-1]:.1e} entrenada")
"""))
A(md(r"""
Sin entrenar, el efecto de una letra **cae geométricamente** hacia atrás: cada paso lo multiplica por un número menor que uno.
Eso es el **gradiente que se desvanece** (*vanishing gradient*), y es la razón por la que una RNN simple aprende mal lo que
pasó lejos. Entrenar la ayuda, pero no del todo.

### La perilla: GRU (y LSTM)

La **GRU** (Cho et al., 2014) le agrega a la red una **perilla** $z_t$, un número entre 0 y 1 por dimensión, que decide
cuánto conservar del estado viejo y cuánto renovar:

$$h_t = (1 - z_t)\, h_{t-1} + z_t\, \tilde h_t$$

Es un **promedio ponderado entre quedarse y moverse**: con $z \approx 0$ la dimensión casi no se toca y guarda memoria larga.
(PyTorch escribe la misma ecuación con $z$ del otro lado: en su convención $z$ pondera el estado viejo.)
La **LSTM** (Hochreiter y Schmidhuber, 1997) es la versión anterior, con tres perillas y dos estados; hace lo mismo.

Entrenamos una GRU de 64 estados con la misma división que los n-gramas, mirando el error en el texto no visto cada 50 pasos.
"""))
A(code(r"""
t0 = time.time()
gru = entrenar_lm(ENT, VOCAB, "gru", H=64, pasos=600, semilla=0, prueba=PRU)
print(f"entrenada en {time.time() - t0:.0f} s; mejor error en texto no visto {min(gru.hist['prueba']):.2f} en el paso {gru.mejor_paso}")
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

# ------------------------------------------------------------------ Paso 5
A(md(r"""
## Paso 5 — De vuelta a la cueva: un agente con memoria

Volvemos al agente que solo siente bigotes. En cada paso recibe 8 números: los **4 bigotes** y su **última acción**
(*one-hot*). Comparamos dos redes con la misma entrada:

- **sin memoria**: una red común (MLP), que decide solo con lo que siente ahora;
- **con memoria**: una **GRU** de 32 estados, que decide con lo que siente y con su estado $h_t$.

**Cómo las entrenamos, dicho explícitamente.** No usamos RL acá: usamos **aprendizaje por imitación** (*behavior cloning*),
que es aprendizaje supervisado. Un experto que ve el mapa juega muchas partidas desde casillas al azar (con un 30 % de
acciones al azar, para que aparezcan situaciones fuera del camino ideal) y las redes aprenden a copiar **la acción del
experto** a partir de lo que siente el agente. La versión con RL existe y se llama DRQN (Hausknecht y Stone, 2015: DQN con
una capa recurrente), pero la probamos en la cueva chica y en dos minutos de CPU juega unas 200 partidas, todavía explorando,
y sale en 7 de cada 10: no converge en el tiempo de una clase.

Usamos la **cueva grande** (155 casillas, 13 lecturas), donde la diferencia se nota más.
"""))
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
plt.figure(figsize=(6, 3)); plot_curva(plt.gca(), h_sin, NARANJA, "sin memoria"); plot_curva(plt.gca(), h_con, AZUL, "con memoria (GRU)")
plt.xlabel("paso de entrenamiento"); plt.ylabel("entropía cruzada"); plt.legend(); plt.grid(alpha=.3)
plt.title("Copiar al experto"); plt.show()
"""))
A(md("La GRU copia mucho mejor al experto. Pero lo que importa es si **sale**. Las ponemos a jugar desde cada una de las 154 casillas (máximo 200 pasos, siempre la acción más probable)."))
A(code(r"""
ev_sin, ev_con = evaluar(sin, env_g, dist_g), evaluar(con, env_g, dist_g)
for nombre, ev in [("sin memoria", ev_sin), ("con memoria", ev_con)]:
    print(f"{nombre:12s}: sale desde {round(ev['exito'] * ev['n'])} de {ev['n']} casillas; cuando sale, {ev['pasos_de_mas']:.1f} pasos de más que el óptimo")

fig, ax = plt.subplots(1, 2, figsize=(15, 4.2))
c_sin, _ = jugar(sin, env_g, env_g.start); c_con, _ = jugar(con, env_g, env_g.start)
env_g.plot(path=c_sin, ax=ax[0], title=f"Sin memoria desde S: {'sale' if c_sin[-1] == env_g.goal else 'se traba'} ({len(c_sin) - 1} pasos)")
env_g.plot(path=c_con, ax=ax[1], title=f"Con memoria desde S: {'sale' if c_con[-1] == env_g.goal else 'se traba'} ({len(c_con) - 1} pasos; óptimo {dist_g[env_g.start]})")
plt.tight_layout(); plt.show()
"""))
A(md(r"""
La red común se traba yendo y viniendo entre dos casillas que se sienten igual: con la misma lectura y la misma última
acción, toma siempre la misma decisión. **La última acción ya es memoria de un paso**, y en la cueva chica casi alcanza;
en la grande, no. La GRU sale desde todas.

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
print(f"acierto en t=0: {aciertos[0]/cuantos[0]:.2f}   en t=10: {aciertos[10]/max(cuantos[10],1):.2f}")
"""))
A(md(r"""
Al principio la sonda acierta poco: con una sola lectura, nadie puede saber dónde está. Y a veces se equivoca con
confianza (en la figura de arriba, en t = 3 apuesta por un pasillo del otro lado que se siente igual); unos pasos después se
corrige. A medida que camina, el estado
acumula la historia y la sonda la encuentra: **la red aprendió sola algo parecido al estado de creencia del Paso 2**,
sin que nadie le diera el mapa.

> ✍️ **Ejercicio:** repetí el Paso 5 con la cueva chica (`env_g = CaveEnv()`). ¿La red común también se traba?
> ¿Por qué la última acción alcanza más en una cueva que en la otra?
"""))

# ------------------------------------------------------------------ Paso 6
A(md(r"""
## Paso 6 — El puente: un modelo de lenguaje es esto, a escala

Lo que hicimos hoy dos veces es lo mismo: **leer un camino de a un paso y llevar un resumen**. En la cueva el resumen sirve
para decidir la acción; en el texto, para predecir la letra que sigue. Un modelo de lenguaje como Qwen2.5-0.5B, el que van a
usar los agentes de las clases 10 y 11, hace la segunda tarea con palabras en vez de letras y con mucho más texto.
"""))
A(code(r"""
tamanos = {
    "n-grama n=8 (contextos × letras)": len(tabla_ngramas(CORPUS, 8)) * len(VOCAB),
    "RNN de letras (Paso 4)": sum(p.numel() for p in elman.parameters()),
    "agente GRU (Paso 5)": sum(p.numel() for p in con.parameters()),
    "Qwen2.5-0.5B (clases 10 y 11)": 494_000_000,
}
for k, v in tamanos.items():
    print(f"{k:34s} {v:>13,}".replace(",", "."))
"""))
A(md(r"""
El salto de escala no es lo único que cambia. Un **transformer**, en una frase: en vez de recorrer el camino pasando el estado
de mano en mano, en cada paso **mira a la vez todas las letras anteriores y elige a cuáles atender**. Así no depende de que
el gradiente sobreviva cien pasos, a cambio de mirar todo cada vez.

## Preguntas para pensar

1. En el Paso 2 calculamos la creencia exacta porque conocíamos el mapa. Si el piso fuera resbaloso (clase 3), ¿la creencia
   seguiría siendo un conjunto, o haría falta una probabilidad por casilla?
2. La red común del Paso 5 se traba yendo y viniendo. ¿Le alcanzaría con elegir la acción al azar según sus probabilidades,
   en vez de la más probable? ¿Qué perdería?
3. Un n-grama y una RNN predicen la próxima letra. ¿Qué guarda cada uno del pasado? ¿Cuál se parece más a tu forma de leer?

## Próxima clase

Clase 8: **aplicaciones**. Llevamos lo aprendido a problemas reales: marketing, un tutor, un robot. Y en las clases 10 y 11 el
modelo de lenguaje de hoy, a escala, se vuelve un agente: su acción es el próximo texto.
"""))

save(cells, "07-redes-recurrentes.ipynb")
