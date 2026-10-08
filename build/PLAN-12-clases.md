# Plan de 12 clases (decisión del autor, 2026-10-08)

El MOOC "RL a ciegas" pasa a 12 clases, dictables en cuatro trimestres de tres. Las unidades se llaman "Clase N" (no "Módulo").
El pre curso (0a Python, 0b Probabilidad, 0c Álgebra) queda afuera de las 12, como "Nivelación" optativa (eyebrow "Nivelación · 0a").

| id | archivo página | notebook | título | trimestre | origen |
|---|---|---|---|---|---|
| 0a | 00a-python.html | 00a-python-desde-la-cueva.ipynb | Python desde la cueva | nivelación | igual |
| 0b | 00b-probabilidad.html | 00b-probabilidad.ipynb | Probabilidad con piso resbaloso | nivelación | igual |
| 0c | 00c-algebra.html | 00c-algebra-lineal.ipynb | Álgebra lineal con Bellman | nivelación | igual |
| 1 | 01-introduccion.html | (sin notebook) | Introducción: por qué este curso | T1 | NUEVA: filosofía (Freire, Foucault, el curso como meme) + jugar la cueva |
| 2 | 02-que-es-rl.html | 02-que-es-rl.ipynb | ¿Qué es RL? | T1 | ex 01 |
| 3 | 03-mdp-y-bellman.html | 03-mdp-y-bellman.ipynb | MDP y Bellman | T1 | ex 02 |
| 4 | 04-aprender-sin-mapa.html | 04-aprender-sin-mapa.ipynb | Aprender sin mapa | T2 | ex 03 |
| 5 | 05-explorar-a-ciegas.html | 05-explorar-a-ciegas.ipynb | Explorar a ciegas | T2 | ex 04 |
| 6 | 06-redes-neuronales.html | 06-redes-neuronales.ipynb | Redes neuronales: de la tabla a la red | T2 | ex 05 (de-la-tabla-a-la-red) |
| 7 | 07-redes-recurrentes.html | 07-redes-recurrentes.ipynb | Redes recurrentes: cuando el estado no alcanza | T3 | NUEVA |
| 8 | 08-aplicaciones.html | 08-aplicaciones.ipynb | Aplicaciones | T3 | ex 06 |
| 9 | 09-agentes-mundo-real.html | 09-agentes-mundo-real.ipynb | Agentes I: RL en el mundo real | T3 | ex 07 (agentes) + bucle ReAct al inicio |
| 10 | 10-agentes-de-lenguaje.html | 10-agentes-de-lenguaje.ipynb | Agentes II: agentes de lenguaje | T4 | NUEVA |
| 11 | 11-agentes-aplicados.html | 11-agentes-aplicados.ipynb | Agentes aplicados: enseñar y difundir | T4 | ex 08 (agentes-aplicados) |
| 12 | 12-cierre.html | (sin notebook) | Cierre: proyecto final y cómo se propaga | T4 | NUEVA (proyecto final + difusión) |

Epílogo difusion/estrategia.html se mantiene y la clase 12 lo enlaza.
LLM en los notebooks: Qwen/Qwen2.5-0.5B-Instruct como generador/agente (corre en Colab sin token); evaluador Qwen/Qwen2.5-1.5B-Instruct
(otro tamaño, no se encontró un modelo chico de otra familia que evalúe razonablemente). Sin Gemma (decisión del autor: que corra en Colab sin token).
