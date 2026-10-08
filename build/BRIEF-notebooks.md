# Brief común para notebooks del mini curso de RL (Dimas Torres)

Curso: "RL a ciegas" — mini curso de 6 clases basado en un juego: una cueva a oscuras en grilla;
el jugador/agente no ve el mapa, solo se marca una pared (gris claro) cuando la toca; la salida es un cuadrado verde.
Sigue las clases 1-2 de Stanford CS234 (Brunskill, Winter 2026) y Sutton & Barto (2ª ed.), y termina en Deep RL.
Dos vías: vía sin código (artefactos web interactivos) y vía profunda (estos notebooks).

Clases:
1. ¿Qué es RL? agente-entorno, recompensa, historia vs estado, supuesto de Markov. Ejercicio "AI tutor as a decision process" (aula invertida). Ejemplos: tutor, marketing, robótica.
2. MDP con modelo: P, R, γ, Bellman, policy evaluation, value iteration, policy iteration (CS234 L2).
3. Sin modelo: Monte Carlo, TD(0), SARSA, Q-learning tabular.
4. Exploración: recompensa escasa (hard-exploration), ε-greedy, recompensa intrínseca/curiosidad (por conteo), Go-Explore (Ecoffet et al., Nature 2021: "first return, then explore"; detachment/derailment; archivo de celdas).
5. Deep RL: de la tabla Q a la red: DQN (replay buffer, red objetivo), observaciones (one-hot vs coordenadas + "bigotes" que sienten paredes).
6. Aplicaciones: bandits en marketing digital, el tutor como MDP diseñado por los alumnos, robótica, investigación documental tipo deep search como MDP, RLHF (puente a ChatGPT).

ESTILO (obligatorio, es la pedagogía del docente):
- Todo en castellano (rioplatense neutro, sin voseo exagerado; tono claro y conciso). Términos técnicos en inglés entre paréntesis la primera vez.
- "Ver y después leer": cada idea primero con una figura (matplotlib), después la ecuación corta. Más gráficos que ecuaciones.
- Nunca un bloque de código sin preparar: antes de cada bloque, una celda markdown que diga qué vamos a ver y por qué.
- Prácticas = usar funciones y visualizar resultados, no enseñar a programar. Pasos numerados ("Paso 1 — ...") que espejan la teoría. Las funciones largas van en una celda de "herramientas" plegable al principio (marcar con comentario "# Herramientas: no hace falta leer esto"); las celdas de la clase llaman funciones cortas.
- Reciclar las mismas herramientas visuales entre clases: SIEMPRE usar env.plot(values=..., policy=..., path=...) de cave_env.py para mostrar la cueva (mapa de calor de V, flechas de política, trayectoria).
- Cerrar cada notebook con: "Preguntas para pensar" (2-3), y "Próxima clase" muy corto (2-3 líneas) con un puente a algo que los alumnos ya conocen (redes neuronales, NLP, visión).
- Celdas de ejercicio marcadas "✍️ Ejercicio" con TODO simple (cambiar un parámetro y observar).
- Que corra en Colab y en CPU en pocos minutos total (< 3 min por notebook). Fijar semillas.

ENTORNO: /home/claude/curso-RL/notebooks/cave_env.py (leelo entero antes de empezar). La primera celda de código de cada notebook
debe ser `%%writefile cave_env.py` + el contenido exacto del archivo (leelo al construir), así el notebook es autosuficiente en Colab.
Segunda celda: imports (`from cave_env import CaveEnv, ACTION_NAMES`, numpy, matplotlib).
Un intento aleatorio llega a la salida en ~5% de los episodios de 200 pasos: la recompensa es escasa (bien para la clase 4).

CONSTRUCCIÓN: escribí un script Python en /home/claude/curso-RL/build/ (nombre build_nbXX.py) que arme el notebook con nbformat y lo guarde en
/home/claude/curso-RL/notebooks/NN-titulo.ipynb. Después ejecutalo con:
  cd /home/claude/curso-RL/notebooks && jupyter nbconvert --to notebook --execute --inplace NN-titulo.ipynb --ExecutePreprocessor.timeout=600
y verificá que corre sin errores y que las figuras muestran lo que dice el texto (mirá las imágenes: extraelas o guardá PNG en /home/claude/curso-RL/build/ y miralas con Read). Corregí hasta que esté bien. Dejá el notebook ejecutado (con salidas).
No modifiques cave_env.py; si necesitás algo extra, definilo en la celda de herramientas del notebook.
Al terminar, respondé con: archivos creados, qué cubre cada uno en 3-5 líneas, tiempos de ejecución y cualquier problema.
