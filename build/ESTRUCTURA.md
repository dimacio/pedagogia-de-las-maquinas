> **Histórico.** Reemplazado por build/PLAN-16-clases.md.

# Estructura definitiva del MOOC "RL a ciegas" (12 clases, 3 por trimestre)

El curso es un MOOC libre (GitHub Pages, sin videos, foro en GitHub Discussions). Las unidades se llaman "Clase" en el recorrido
anual y "módulo" puede seguir usándose como sinónimo en textos; los eyebrows usan "Clase N". El pre curso es una NIVELACIÓN opcional
(Nivelación · 0a / 0b / 0c), fuera de las 12.

| Trim. | id | Archivo página | Notebook | Título | Origen |
|---|---|---|---|---|---|
| Nivelación | 0a | 00a-python.html | 00a-python-desde-la-cueva.ipynb | Python desde la cueva | existente |
| Nivelación | 0b | 00b-probabilidad.html | 00b-probabilidad.ipynb | Probabilidad con piso resbaloso | existente |
| Nivelación | 0c | 00c-algebra.html | 00c-algebra-lineal.ipynb | Álgebra lineal con Bellman | existente |
| I · A ciegas | 0 | 00-introduccion.html | (sin notebook) | Introducción: por qué este curso | NUEVA (filosofía + juego) |
| I | 1 | 01-que-es-rl.html | 01-que-es-rl.ipynb | ¿Qué es RL? | existente |
| I | 2 | 02-mdp-y-bellman.html | 02-mdp-y-bellman.ipynb | MDP y Bellman | existente |
| II · Aprender | 3 | 03-aprender-sin-mapa.html | 03-aprender-sin-mapa.ipynb | Aprender sin mapa | existente |
| II | 4 | 04-explorar-a-ciegas.html | 04-explorar-a-ciegas.ipynb | Explorar a ciegas | existente |
| II | 5 | 05-de-la-tabla-a-la-red.html | 05-de-la-tabla-a-la-red.ipynb | Redes neuronales: de la tabla a la red | existente (retitular) |
| III · Memoria y agentes | 6 | 06-redes-recurrentes.html | 06-redes-recurrentes.ipynb | Redes recurrentes: memoria a ciegas | NUEVA |
| III | 7 | 07-aplicaciones.html | 07-aplicaciones.ipynb | Aplicaciones | era 06 |
| III | 8 | 08-agentes.html | 08-agentes.ipynb | Agentes | era 07 |
| IV · Enseñar | 9 | 09-agentes-de-lenguaje.html | 09-agentes-de-lenguaje.ipynb | Agentes de lenguaje | era 08 (1ª mitad: bloques 1–2, la fábrica con LLM real) |
| IV | 10 | 10-ensenar-sin-manipular.html | 10-ensenar-sin-manipular.ipynb | Enseñar sin manipular | era 08 (2ª mitad: tutor, persuasión, recompensa editable, dopamina) |
| IV | 11 | 11-cierre.html | (sin notebook) | Cierre: el curso como organismo | NUEVA (proyecto final + difusión; difusion/estrategia.html queda como recurso enlazado) |

La página inicio/por-que.html NO se crea: su contenido vive en la clase 0. Los enlaces "Inicio" deben apuntar a clases/00-introduccion.html.
Notebooks: los que no tienen notebook ("nb": null en CLASES) no muestran la tarjeta de notebook.

Hilo narrativo (para textos de puente):
- Clase 1: cadena de Markov — la posición alcanza para decidir.
- Clase 6: en el modo difícil del juego solo sentís paredes; la posición ya no se observa → hace falta memoria → RNN resume la historia h_t
  en un estado oculto (de MDP a POMDP). La misma RNN sobre texto predice la próxima letra/palabra: cadena de Markov de n-gramas → RNN → modelo
  de lenguaje. Puente a la clase 9, donde el modelo de lenguaje se vuelve un agente.
- Clase 9: el LLM como política (la acción es el próximo texto), RLHF y DeepSeek-R1 (R1-Zero sin ajuste supervisado previo), la fábrica de
  contenido multiagente (Villanueva 2026) con la bibliografía como fuente.
- Clase 10: dos agentes que sostienen atención (difusión y tutor); a favor de quién juega la recompensa; nudges vs patrones oscuros;
  recompensa visible y editable; dopamina = error de TD (Schultz, Dayan y Montague 1997).
- Clase 11: proyecto final, el curso como organismo/meme que se propaga enseñando, la campaña de difusión como ejemplo resuelto,
  vuelta a la filosofía de la clase 0.

Trimestres: I · A ciegas (0–2), II · Aprender (3–5), III · Memoria y agentes (6–8), IV · Enseñar (9–11).
