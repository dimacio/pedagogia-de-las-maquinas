"""Arma notebooks/02-que-es-rl.ipynb (Clase 2 — ¿Qué es RL?)."""
from _nbutil import md, code, writefile_cell, save

cells = []

cells.append(md(r"""
# Clase 2 — ¿Qué es el aprendizaje por refuerzo?

**RL a ciegas** · mini curso de aprendizaje por refuerzo (*reinforcement learning*, RL) · vía profunda

Basado en Stanford CS234 (Brunskill), clase 1, y en Sutton & Barto, cap. 1 y 3.

En esta clase vamos a ver:

1. **El ciclo agente–entorno**: alguien decide, el mundo responde.
2. **Un agente aleatorio en la cueva a oscuras**: qué ve, qué descubre y cuánto tarda en salir.
3. **Historia vs. estado** y el **supuesto de Markov**: ¿qué tiene que recordar el agente?
4. **Aula invertida: el tutor de IA como proceso de decisión**. Ustedes diseñan el problema… y descubren una trampa.
5. Dónde aparece RL hoy.

> Cómo usar este notebook: ejecutar las celdas en orden (Colab: *Entorno de ejecución → Ejecutar todas*). Tarda menos de un minuto.
"""))

cells.append(md(r"""
## Preparación

La primera celda escribe el archivo `cave_env.py` con **la cueva** que usamos en todo el curso. Así el notebook funciona solo, también en Colab. No hace falta leerla.
"""))
cells.append(writefile_cell())

cells.append(md(r"""
Ahora importamos la cueva y las bibliotecas de siempre (`numpy` para números, `matplotlib` para gráficos). Fijamos una semilla para que todos veamos los mismos resultados.
"""))
cells.append(code(r"""
import numpy as np
import matplotlib.pyplot as plt
from cave_env import CaveEnv, ACTION_NAMES

SEMILLA = 0
np.random.seed(SEMILLA)
print("Acciones:", ACTION_NAMES)
"""))

cells.append(md(r"""
La celda siguiente define **herramientas** (funciones de dibujo y simulación). Está plegada: no hace falta leerla, solo ejecutarla. Las celdas de la clase llaman a estas funciones con una línea.
"""))
cells.append(code(r'''
# @title Herramientas (no hace falta leer esto)
# Herramientas: no hace falta leer esto
import matplotlib.patches as mpatches

COLORES = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300", "#4a3aa7", "#e34948"]
plt.rcParams.update({
    "figure.dpi": 100, "axes.spines.top": False, "axes.spines.right": False,
    "axes.grid": True, "grid.color": "#e6e6e6", "grid.linewidth": 0.8,
    "axes.edgecolor": "#888888", "axes.titlesize": 12, "font.size": 10.5,
    "lines.linewidth": 2, "axes.axisbelow": True,
})


# ---------- 1. ciclo agente-entorno ----------
def dibujar_ciclo():
    fig, ax = plt.subplots(figsize=(8, 3.6))
    ax.set_xlim(0, 10); ax.set_ylim(0, 5); ax.axis("off")
    for x, nombre, sub, col in [(0.6, "Agente", "decide", COLORES[0]), (6.4, "Mundo", "responde", COLORES[2])]:
        ax.add_patch(mpatches.FancyBboxPatch((x, 1.5), 3, 2, boxstyle="round,pad=0.1",
                                             fc=col, ec="none", alpha=0.18))
        ax.text(x + 1.5, 2.75, nombre, ha="center", va="center", fontsize=16, weight="bold", color="#222")
        ax.text(x + 1.5, 2.15, sub, ha="center", va="center", fontsize=11, color="#555")
    flecha = dict(arrowstyle="-|>", lw=2, color="#333", mutation_scale=18)
    ax.annotate("", xy=(6.4, 3.9), xytext=(3.6, 3.9), arrowprops=dict(**flecha, connectionstyle="arc3,rad=-0.25"))
    ax.text(5, 4.65, r"acción $a_t$", ha="center", fontsize=13)
    ax.annotate("", xy=(3.6, 1.1), xytext=(6.4, 1.1), arrowprops=dict(**flecha, connectionstyle="arc3,rad=-0.25"))
    ax.text(5, 0.05, r"observación $o_t$,  recompensa $r_t$", ha="center", fontsize=13)
    ax.set_title("El ciclo agente–entorno (se repite en t = 1, 2, 3, ...)")
    plt.show()


# ---------- 2. agente aleatorio ----------
def correr_episodio(env, rng, politica=None):
    """Juega un episodio. Devuelve (camino de estados, retorno, ¿llegó?)."""
    s = env.reset(); camino = [s]; G = 0.0; done = False; info = {"reached_goal": False}
    while not done:
        a = rng.integers(env.nA) if politica is None else politica(s)
        s, r, done, info = env.step(a)
        camino.append(s); G += r
    return camino, G, info["reached_goal"]


def pintar_paredes_tocadas(env, camino, ax=None, title=None):
    """Como en el juego: fondo negro y solo las paredes tocadas, en gris claro."""
    ax = env.plot(show_walls=False, path=camino, ax=ax, title=title)
    for (r, c) in env.touched:
        ax.add_patch(plt.Rectangle((c - .5, r - .5), 1, 1, color="0.8"))
    return ax


def tres_vistas(env, camino):
    fig, axs = plt.subplots(1, 3, figsize=(17, 4.6))
    env.plot(show_walls=False, path=camino, ax=axs[0], title="1. Lo que ve el agente: nada")
    pintar_paredes_tocadas(env, camino, ax=axs[1],
                           title=f"2. Lo que descubrió: {len(env.touched)} paredes tocadas")
    env.plot(path=camino, ax=axs[2], title="3. El mapa real (solo lo vemos nosotros)")
    plt.tight_layout(); plt.show()


def pasos_hasta_salir(n_episodios=300, seed=0):
    """Agente aleatorio sin límite de pasos: ¿cuántos pasos tarda en encontrar la salida?"""
    env = CaveEnv(max_steps=10**6); rng = np.random.default_rng(seed); pasos = []
    for _ in range(n_episodios):
        camino, _, _ = correr_episodio(env, rng)
        pasos.append(len(camino) - 1)
    return np.array(pasos)


def histograma_pasos(pasos, limite=200):
    exito = np.mean(pasos <= limite) * 100
    fig, ax = plt.subplots(figsize=(9, 3.8))
    ax.hist(pasos, bins=40, color=COLORES[0], edgecolor="white", linewidth=1)
    ax.axvline(limite, color="#333", ls="--", lw=1.5)
    ax.axvline(np.median(pasos), color=COLORES[1], lw=1.5)
    ax.text(0.98, 0.95, f"línea punteada: límite del juego ({limite} pasos)\n"
            f"solo {exito:.1f}% de los episodios sale antes\n\n"
            f"línea naranja: mediana = {np.median(pasos):.0f} pasos",
            transform=ax.transAxes, ha="right", va="top", fontsize=11)
    ax.set_xlabel("pasos hasta llegar a la salida"); ax.set_ylabel("episodios")
    ax.set_title(f"Agente aleatorio: {len(pasos)} episodios")
    plt.show()
    return exito


# ---------- 3. historia vs estado ----------
def camino_de_acciones(env, acciones):
    s = env.reset(); camino = [s]
    for a in acciones:
        s, _, _, _ = env.step(a); camino.append(s)
    return camino


def dos_historias(env, acciones_A, acciones_B):
    camA = camino_de_acciones(env, acciones_A)
    camB = camino_de_acciones(env, acciones_B)
    fig, axs = plt.subplots(1, 2, figsize=(12, 4.6))
    for ax, cam, nombre in [(axs[0], camA, "A"), (axs[1], camB, "B")]:
        env.plot(path=cam, ax=ax, title=f"Historia {nombre}: {len(cam) - 1} pasos")
        r, c = env.free[cam[-1]]
        ax.plot(c, r, "o", ms=16, mfc="none", mec=COLORES[1], mew=3)
    plt.suptitle("Dos historias distintas, la misma casilla (círculo naranja)", y=1.02)
    plt.tight_layout(); plt.show()
    return camA[-1], camB[-1]


def firma_paredes(env, s):
    """Lo que sentiría un agente que SOLO percibe paredes vecinas: 4 bigotes (↑ → ↓ ←)."""
    return tuple(env.observe(s, kind="coords+touch")[2:].astype(int))


def mapa_aliasing(env, s_ref):
    firmas = [firma_paredes(env, s) for s in range(env.nS)]
    cuantas = np.array([firmas.count(f) for f in firmas], dtype=float)
    iguales = np.array([1.0 if f == firmas[s_ref] else 0.0 for f in firmas])
    fig, axs = plt.subplots(1, 2, figsize=(14, 4.6))
    env.plot(values=cuantas, ax=axs[0], cmap="viridis",
             title="¿Con cuántas casillas comparte lo que siente?")
    env.plot(values=iguales, ax=axs[1], cmap="Blues",
             title="Casillas que 'se sienten' igual a la marcada")
    r, c = env.free[s_ref]
    axs[1].plot(c, r, "o", ms=16, mfc="none", mec=COLORES[1], mew=3)
    plt.tight_layout(); plt.show()
    return len(set(firmas)), int(iguales.sum())


# ---------- 4. tutor de IA ----------
HAB_INICIAL = {"suma": 0.10, "resta": 0.05}   # prob. de acertar al principio
VELOCIDAD = {"suma": 0.12, "resta": 0.04}     # cuánto aprende por cada problema practicado


def recompensa_original(acierto, tipo, hab_antes, hab_despues):
    return 1.0 if acierto else -1.0


POLITICAS_TUTOR = {
    "solo sumas":        lambda t, rng: "suma",
    "alternar":          lambda t, rng: "suma" if t % 2 == 0 else "resta",
    "mayormente restas": lambda t, rng: "resta" if rng.random() < 0.8 else "suma",
}


def simular_tutor(politica, recompensa=recompensa_original, n_problemas=60, n_alumnos=300, seed=0):
    """Simula muchos alumnos. Devuelve recompensa acumulada media (curva) y habilidades finales medias."""
    rng = np.random.default_rng(seed)
    curvas = np.zeros((n_alumnos, n_problemas)); finales = []
    for i in range(n_alumnos):
        hab = dict(HAB_INICIAL); G = 0.0
        for t in range(n_problemas):
            tipo = politica(t, rng)
            acierto = rng.random() < hab[tipo]
            antes = dict(hab)
            hab[tipo] += VELOCIDAD[tipo] * (1 - hab[tipo])      # practicar mejora (con rendimientos decrecientes)
            G += recompensa(acierto, tipo, antes, dict(hab))
            curvas[i, t] = G
        finales.append([hab["suma"], hab["resta"]])
    return curvas.mean(0), np.mean(finales, axis=0)


def comparar_politicas_tutor(recompensa=recompensa_original, titulo_r="recompensa +1/−1"):
    res = {n: simular_tutor(p, recompensa) for n, p in POLITICAS_TUTOR.items()}
    fig, axs = plt.subplots(1, 3, figsize=(17, 4.3))
    for k, (n, (curva, fin)) in enumerate(res.items()):
        axs[0].plot(np.arange(1, len(curva) + 1), curva, color=COLORES[k], label=n)
        axs[0].text(len(curva) + 1, curva[-1], n, va="center", fontsize=10, color="#333")
    axs[0].set_xlim(0, len(curva) * 1.35)
    axs[0].set_xlabel("problema número"); axs[0].set_ylabel("recompensa acumulada")
    axs[0].set_title(f"Lo que ve el tutor: {titulo_r}"); axs[0].legend(loc="upper left", frameon=False)
    nombres = list(res)
    R = [res[n][0][-1] for n in nombres]
    A = [res[n][1].mean() * 100 for n in nombres]
    for ax, vals, tit, lab in [(axs[1], R, "Recompensa total (lo que optimiza el tutor)", "recompensa"),
                               (axs[2], A, "Lo aprendido al final (lo que queremos)", "% promedio de acierto en suma y resta")]:
        bars = ax.bar(nombres, vals, color=[COLORES[k] for k in range(len(nombres))], width=0.6)
        ax.bar_label(bars, fmt="%.0f", padding=3)
        ax.set_title(tit); ax.set_ylabel(lab); ax.grid(axis="x", visible=False)
        ax.set_ylim(min(0, min(vals) * 1.2), max(vals) * 1.2)
    plt.tight_layout(); plt.show()
    print(f"{'política':20s} {'recompensa':>11s} {'suma final':>11s} {'resta final':>12s}")
    for n in nombres:
        print(f"{n:20s} {res[n][0][-1]:11.1f} {res[n][1][0]*100:10.0f}% {res[n][1][1]*100:11.0f}%")
'''.lstrip("\n"), herramientas=True))

# ---------------------------------------------------------------- 1
cells.append(md(r"""
## 1. El ciclo agente–entorno

Primero la figura, después las palabras.
"""))
cells.append(code("dibujar_ciclo()"))
cells.append(md(r"""
En cada instante $t$:

- el **agente** (*agent*) elige una **acción** $a_t$;
- el **mundo** o **entorno** (*environment*) cambia y le devuelve una **observación** $o_t$ y una **recompensa** $r_t$ (un número: bueno si es alto).

El objetivo del agente no es la recompensa de *este* paso sino la suma de todas las que vienen:

$$\text{maximizar}\quad \mathbb{E}\left[\, r_1 + r_2 + r_3 + \dots \right]$$

Lo que hace difícil a RL (y lo distingue del aprendizaje supervisado) se resume en cuatro palabras de CS234:

| | ¿Qué significa en la cueva? |
|---|---|
| **Optimización** | queremos salir, y rápido |
| **Demora en las consecuencias** (*delayed consequences*) | un paso a la izquierda ahora puede ser lo que permite salir 30 pasos después |
| **Exploración** (*exploration*) | solo sabemos qué hay detrás de una pared si chocamos con ella |
| **Generalización** (*generalization*) | ¿lo aprendido en esta cueva sirve en otra? |

Nadie le dice al agente cuál era la acción correcta: solo recibe un número, a veces mucho después.
"""))

# ---------------------------------------------------------------- 2
cells.append(md(r"""
## 2. Un agente aleatorio en la cueva

**La cueva**: una grilla a oscuras. El agente no ve el mapa; solo se entera de que hay una pared cuando choca. La salida es el cuadrado verde. Recompensa: **+1 al llegar a la salida, 0 en cualquier otro paso**. El juego se corta a los 200 pasos.

### Paso 1 — Un episodio a ciegas

El agente más tonto posible: elige **al azar** entre ↑ → ↓ ←. Vamos a mirar el mismo episodio de tres maneras: lo que ve el agente (nada), lo que descubrió (las paredes que tocó, en gris claro, como en el juego) y el mapa real.
"""))
cells.append(code(r"""
env = CaveEnv(max_steps=200)
rng = np.random.default_rng(SEMILLA)

camino, retorno, llego = correr_episodio(env, rng)
print(f"Pasos: {len(camino) - 1}  |  ¿llegó a la salida? {llego}  |  recompensa total: {retorno}")
tres_vistas(env, camino)
"""))
cells.append(md(r"""
El camino (azul) va y vuelve por los mismos pasillos (las líneas se superponen) y no se aleja mucho del inicio `S`: en 200 pasos no llega. Recompensa total: **0**. Notar que el agente *no recibió ninguna pista* de que iba mal: con recompensa 0 en cada paso, perderse y acercarse se ven igual. A esto se le llama **recompensa escasa** (*sparse reward*) y es el tema de la clase 5.

### Paso 2 — Muchos episodios: ¿cuánto tarda en salir?

Ahora le sacamos el límite de pasos y jugamos **300 episodios** para medir cuántos pasos necesita el azar para encontrar la salida.
"""))
cells.append(code(r"""
pasos = pasos_hasta_salir(n_episodios=300, seed=SEMILLA)
exito = histograma_pasos(pasos, limite=200)
"""))
cells.append(md(r"""
Con 200 pasos, el azar sale en muy pocos episodios (cerca del 4%). La mediana está en más de mil pasos: la salida está a apenas ~20 pasos de distancia, pero sin memoria ni mapa el agente camina en círculos.

Ese porcentaje es justamente lo que un algoritmo de RL tiene que mejorar **usando solo la recompensa**.
"""))
cells.append(md(r"""
### ✍️ Ejercicio

Cambien el límite de pasos (`limite`) a 500 o 1000 y miren cómo cambia el % de éxito. Cambien también `SEMILLA_EJ` para ver otro episodio a ciegas: ¿cuántas paredes llega a tocar?
"""))
cells.append(code(r"""
# TODO: cambiar estos valores y volver a ejecutar
limite = 200
SEMILLA_EJ = 1

print(f"Con {limite} pasos, el azar sale en el {np.mean(pasos <= limite) * 100:.1f}% de los episodios")
env_ej = CaveEnv(max_steps=limite)
camino_ej, _, llego_ej = correr_episodio(env_ej, np.random.default_rng(SEMILLA_EJ))
pintar_paredes_tocadas(env_ej, camino_ej, title=f"¿Llegó? {llego_ej} — paredes tocadas: {len(env_ej.touched)}")
plt.show()
"""))

# ---------------------------------------------------------------- 3
cells.append(md(r"""
## 3. Historia vs. estado: ¿qué tiene que recordar el agente?

Todo lo que el agente vivió hasta ahora es su **historia** (*history*):

$$h_t = (a_1, o_1, r_1,\; a_2, o_2, r_2,\; \dots,\; a_t, o_t, r_t)$$

Guardar toda la historia es caro. Queremos un resumen, el **estado** (*state*) $s_t = f(h_t)$, que alcance para decidir.

### Paso 1 — Dos historias, una misma casilla

Dos recorridos distintos desde `S` que terminan en la misma casilla. Pregunta: ¿el futuro depende de *cómo* llegó?
"""))
cells.append(code(r"""
ARRIBA, DERECHA, ABAJO, IZQUIERDA = 0, 1, 2, 3
historia_A = [DERECHA] * 3 + [ABAJO] * 2 + [IZQUIERDA]
historia_B = [ABAJO] * 6 + [DERECHA] * 5 + [ARRIBA] * 2 + [IZQUIERDA] * 3 + [ARRIBA] * 2

fin_A, fin_B = dos_historias(env, historia_A, historia_B)
print("¿Terminan en el mismo estado?", fin_A == fin_B)
"""))
cells.append(md(r"""
No: en la cueva, lo que pase después depende solo de **dónde estoy** y **qué hago ahora**, no del camino. La **posición alcanza** como estado. Eso es el **supuesto de Markov** (*Markov assumption*):

$$p(s_{t+1} \mid s_t, a_t) = p(s_{t+1} \mid h_t, a_t)$$

"El futuro es independiente del pasado, dado el presente."

### Paso 2 — ¿Y si el agente solo sintiera paredes?

Supongamos que el agente **no sabe su posición** y solo tiene 4 "bigotes" que le dicen si hay pared arriba, a la derecha, abajo o a la izquierda. ¿Esa observación alcanza como estado? Contemos cuántas casillas "se sienten" igual.
"""))
cells.append(code(r"""
casilla_marcada = env.pos2s[(5, 5)]   # una casilla de un pasillo horizontal
n_firmas, n_iguales = mapa_aliasing(env, casilla_marcada)
print(f"Hay {env.nS} casillas pero solo {n_firmas} sensaciones distintas.")
print(f"La casilla marcada se siente igual que otras {n_iguales - 1} casillas.")
"""))
cells.append(md(r"""
Muchas casillas son indistinguibles por tacto (a esto se lo llama *perceptual aliasing*): un pasillo horizontal se siente igual en cualquier lugar de la cueva, pero en unos conviene ir a la derecha y en otros a la izquierda. Con solo los bigotes, **la observación no es Markov**: para decidir bien el agente necesita recordar parte de la historia (por dónde vino, qué paredes ya tocó).

| El agente percibe… | ¿Es Markov? |
|---|---|
| su posición (casilla) | **sí**: la posición alcanza |
| solo las 4 paredes vecinas | **no**: necesita memoria |

En la clase 6 (Deep RL) vamos a volver a esto: una red puede recibir coordenadas, bigotes o las dos cosas.
"""))

# ---------------------------------------------------------------- 4
cells.append(md(r"""
## 4. Aula invertida: el tutor de IA como proceso de decisión

*(Ejercicio de Emma Brunskill, CS234, clase 1.)* Ahora **ustedes** son quienes diseñan el problema.

> Un alumno **no sabe sumar** (fácil de aprender) **ni restar** (difícil). Un tutor de IA le va dando problemas: en cada turno elige **un problema de suma o uno de resta**. El tutor recibe **+1 si el alumno responde bien y −1 si responde mal**.

**En grupos, 5 minutos, antes de seguir leyendo:**

1. ¿Cuál es el **estado**? ¿Cuál es la **acción**? ¿Cuál es la **recompensa**?
2. ¿Qué representa la **dinámica** (cómo cambia el estado)?
3. Si el tutor maximiza la recompensa esperada, **¿qué política va a aprender?**

<br>

---

### Para discutir después

- **Acción**: dar un problema de suma o de resta.
- **Estado**: lo que el tutor sabe del alumno (por ejemplo, su historial de aciertos y errores, o un nivel estimado en suma y en resta).
- **Recompensa**: +1 / −1 según acierte.
- **Dinámica**: cómo cambia el nivel del alumno al practicar.
- **La respuesta incómoda**: la política óptima es **dar solo sumas**. Las sumas se aprenden rápido, se aciertan, y suman puntos. Las restas cuestan y restan puntos. El tutor "gana" sin enseñar a restar. Esto se llama **trampa de la recompensa** (*reward hacking*): el agente optimiza exactamente lo que le pedimos, no lo que queríamos.

### Paso 1 — Simulemos al alumno

Un modelo mínimo: el alumno acierta con una probabilidad (su "habilidad"). Cada vez que practica un tipo de problema, esa habilidad sube: rápido en suma, lento en resta. Comparamos tres políticas fijas del tutor durante 60 problemas, promediando 300 alumnos simulados.
"""))
cells.append(code(r"""
print("Habilidad inicial:", HAB_INICIAL, "| velocidad de aprendizaje:", VELOCIDAD)
comparar_politicas_tutor()
"""))
cells.append(md(r"""
**El desalineamiento, en una figura**: el gráfico del medio y el de la derecha ordenan las políticas al revés.

- "Solo sumas" gana en recompensa… y deja al alumno sin saber restar.
- "Alternar" y "mayormente restas" pierden puntos (el alumno se equivoca mucho al principio), pero al final el alumno sabe las dos cosas.

Un algoritmo de RL bien hecho, con esta recompensa, *encontraría* "solo sumas". El problema no está en el algoritmo sino en **cómo definimos la recompensa**. Diseñar la recompensa es parte del trabajo (y en muchos problemas reales, la parte más difícil).
"""))
cells.append(md(r"""
### ✍️ Ejercicio — Ustedes son el docente: rediseñen la recompensa

La función `mi_recompensa` recibe si el alumno acertó, el tipo de problema y su habilidad **antes** y **después** de practicar (diccionarios con `"suma"` y `"resta"`). Ahora devuelve lo mismo que la original (+1/−1).

Cámbienla para que **la política que más recompensa obtiene sea también la que más enseña**. Ideas para probar (una por vez):

- premiar más los aciertos en resta que en suma;
- no castigar los errores;
- premiar la **mejora**: `hab_despues[tipo] - hab_antes[tipo]`.

Después discutan: ¿esa información la tendría un tutor real? (En la clase 8 retomamos su diseño y lo resolvemos con RL.)
"""))
cells.append(code(r"""
def mi_recompensa(acierto, tipo, hab_antes, hab_despues):
    # TODO: cambiar esta línea por la recompensa que diseñe el grupo
    return 1.0 if acierto else -1.0

comparar_politicas_tutor(recompensa=mi_recompensa, titulo_r="recompensa del grupo")
"""))

# ---------------------------------------------------------------- 5
cells.append(md(r"""
## 5. Dónde aparece RL hoy

- **ChatGPT y los asistentes conversacionales**: se ajustan con *RL from human feedback* (RLHF): personas comparan respuestas y el modelo aprende a producir las preferidas. Es, probablemente, el ejemplo de RL más usado del mundo.
- **Modelos que razonan (DeepSeek-R1, 2025)**: aprendieron a "pensar paso a paso" con RL, usando como recompensa si la respuesta final de un problema de matemática o de código era correcta.
- **Juegos (AlphaGo, 2016)**: venció al campeón mundial de Go combinando redes neuronales, búsqueda y aprendizaje por refuerzo jugando contra sí mismo.
- **Robótica**: robots que aprenden a caminar o manipular objetos, muchas veces primero en simulación.

**Tres parientes de RL** que vamos a cruzar en el curso. En el **aprendizaje por imitación** (*imitation learning*) el agente no recibe recompensa sino demostraciones de un experto, y aprende a copiarlas (como un residente que mira al cirujano). En el **RL basado en modelo** (*model-based RL*) el agente aprende o conoce cómo funciona el mundo —en la cueva: el mapa, $P(s' \mid s, a)$— y planifica con ese modelo (clase 3). Y en el **RL a partir de retroalimentación humana** (*RL from human feedback*, RLHF) la recompensa no se escribe a mano: se aprende de comparaciones hechas por personas (clase 8).
"""))

cells.append(md(r"""
## Preguntas para pensar

1. En la cueva, la recompensa es +1 solo al salir. Si en cambio diéramos −0.01 por cada paso, ¿qué cambiaría en lo que el agente "quiere"? ¿Podría aparecer otra trampa de la recompensa?
2. Un agente que solo siente las paredes vecinas, ¿qué debería recordar para que su "estado" vuelva a ser Markov?
3. En el tutor, el nivel real del alumno no se observa: solo sus aciertos. ¿Cómo estimarían el estado a partir de la historia?

## Próxima clase

¿Y si el agente **conociera el mapa**? En la clase 3 vamos a calcular el valor de cada casilla con la ecuación de Bellman: la información viaja hacia atrás desde la salida, parecido a cómo *backpropagation* lleva el error hacia atrás en una red neuronal.
"""))

save(cells, "02-que-es-rl.ipynb")
