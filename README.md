# RL a ciegas

Curso libre y abierto (MOOC) de aprendizaje por refuerzo (*reinforcement learning*, RL), en castellano, contado desde un juego: **La cueva a ciegas**. Una cueva a oscuras, una pared que se marca en gris claro solo cuando se la toca y, en algún lugar, una salida verde. El mismo problema acompaña todo el recorrido, desde Python hasta los agentes de lenguaje.

El curso enseña a enseñarle a una máquina y también a enseñárselo a otra persona: cada clase cierra con un bloque «Para enseñarlo» y una actividad entre pares.

## Por qué este curso

La clase 1 (`clases/01-introduccion.html`) es el marco desde el que se lee todo el recorrido. Tres ideas, cada una con una figura interactiva:

- **Aprender actuando** (Paulo Freire, *Pedagogía del oprimido*, 1970): frente a la educación bancaria, que deposita contenidos en un alumno pasivo, la problematizadora aprende actuando y reflexionando, en diálogo. Acá no se recibe RL: se le enseña a una máquina.
- **Elegir la propia recompensa** (Michel Foucault, *La hermenéutica del sujeto*, curso de 1981–1982): el cuidado de sí, leído como la pregunta central del RL, quién define la recompensa.
- **Enseñar a enseñar** (Richard Dawkins, *El gen egoísta*, 1976, cap. 11): el curso es un meme que vive si se copia con fidelidad, fecundidad y longevidad. La clase 12 cierra con el proyecto final y la difusión del curso como ejemplo resuelto.

## Para quién

Para quien quiera entender RL desde cero: estudiantes, docentes y profesionales de otras áreas (salud, farmacia, laboratorio, educación, finanzas). No hace falta saber programar para la vía visual; para la vía con código alcanza con ganas de leer Python, que se aprende en la nivelación.

## Cómo se cursa

- **Doce clases en cuatro trimestres.** Tres clases por trimestre, más una nivelación optativa. Todo es estático y está siempre disponible: no hay fechas, videos ni inscripción. A tu ritmo, a una clase por semana, el recorrido lleva unas **12 semanas** (entre 2 y 4 horas por semana); en un grupo, un trimestre por vez.
- **Por dónde empezar.** Por la clase 1, que no tiene notebook, y por el juego: jugarlo en modo fácil y en difícil antes de la clase 2.
- **Dos vías.** La *vía visual*: páginas interactivas con figuras que se tocan (ver primero, leer después) y el juego. La *vía profunda*: un notebook por clase que corre en Colab, en CPU, y escribe su propio entorno en la primera celda. Se puede hacer solo la primera o las dos.
- **Antes de empezar.** Cada clase abre con sus objetivos, el tiempo estimado (página y notebook) y los requisitos previos.
- **Cuestionario.** Cada clase cierra con 5 preguntas de opción múltiple que se corrigen en el navegador, con la explicación de cada respuesta. Con 4 de 5 queda aprobado; el progreso se guarda en el navegador y se ve en la barra superior.
- **Actividad entre pares.** Una consigna corta, derivada de «Para enseñarlo», que se publica en **GitHub Discussions**. Otra persona la devuelve con una rúbrica de tres criterios. El foro del curso es ese mismo espacio de Discussions.

## Recorrido

| Clase | Página | Notebook |
|---|---|---|
| Nivelación · 0a Python desde la cueva | `clases/00a-python.html` | `notebooks/00a-python-desde-la-cueva.ipynb` |
| Nivelación · 0b Probabilidad con piso resbaloso | `clases/00b-probabilidad.html` | `notebooks/00b-probabilidad.ipynb` |
| Nivelación · 0c Álgebra lineal con Bellman | `clases/00c-algebra.html` | `notebooks/00c-algebra-lineal.ipynb` |
| 1 · Introducción: por qué este curso | `clases/01-introduccion.html` | (sin notebook) |
| 2 · ¿Qué es RL? | `clases/02-que-es-rl.html` | `notebooks/02-que-es-rl.ipynb` |
| 3 · MDP y Bellman | `clases/03-mdp-y-bellman.html` | `notebooks/03-mdp-y-bellman.ipynb` |
| 4 · Aprender sin mapa | `clases/04-aprender-sin-mapa.html` | `notebooks/04-aprender-sin-mapa.ipynb` |
| 5 · Explorar a ciegas | `clases/05-explorar-a-ciegas.html` | `notebooks/05-explorar-a-ciegas.ipynb` |
| 6 · Redes neuronales: de la tabla a la red | `clases/06-redes-neuronales.html` | `notebooks/06-redes-neuronales.ipynb` |
| 7 · Redes recurrentes: cuando el estado no alcanza | `clases/07-redes-recurrentes.html` | `notebooks/07-redes-recurrentes.ipynb` |
| 8 · Aplicaciones | `clases/08-aplicaciones.html` | `notebooks/08-aplicaciones.ipynb` |
| 9 · Agentes I: RL en el mundo real | `clases/09-agentes-mundo-real.html` | `notebooks/09-agentes-mundo-real.ipynb` |
| 10 · Agentes II: agentes de lenguaje | `clases/10-agentes-de-lenguaje.html` | `notebooks/10-agentes-de-lenguaje.ipynb` |
| 11 · Agentes aplicados: enseñar y difundir | `clases/11-agentes-aplicados.html` | `notebooks/11-agentes-aplicados.ipynb` |
| 12 · Cierre: proyecto final y cómo se propaga | `clases/12-cierre.html` | (sin notebook) |
| Epílogo · Cómo se propaga este curso | `difusion/estrategia.html` | sección final del notebook 08 |

La nivelación es el pre curso (Python, probabilidad y álgebra lineal, todo desde la cueva); quien ya maneje esas herramientas puede empezar por la clase 1, que explica el porqué del curso. Las 12 clases se dictan en cuatro trimestres de tres: T1 clases 1–3, T2 4–6, T3 7–9, T4 10–12. El juego está en `juego/la-cueva-a-ciegas.html`, con tres modos (Jugar, Planificar, Aprender) y tres niveles de memoria.

## Publicar en GitHub Pages

1. Crear el repositorio (por ejemplo `rl-a-ciegas`) y subir esta carpeta.
2. En `assets/cueva.js`, cambiar `const REPO = "USUARIO/rl-a-ciegas"` por el usuario y el repositorio. Eso arregla los enlaces a GitHub, Colab y Discussions de todas las páginas.
3. En el repositorio: *Settings → Pages → Source: GitHub Actions*. La publicación la hace `.github/workflows/publicar.yml` al etiquetar una versión (ver `CONTRIBUTING.md`).
4. Activar Discussions: *Settings → General → Features → Discussions*. Conviene crear una categoría por clase o una sola, «Actividades», donde los títulos llevan el prefijo `[Clase N]`.
5. Volver a renderizar el post 12, que muestra la dirección del repositorio: `node build/render_posts.js 12` (con un servidor local en la raíz: `python3 -m http.server 8765`).

Los objetivos, tiempos, requisitos, cuestionarios y actividades de cada clase están en `assets/modulos.js`; `Cueva.pagina()` los inserta en cada página.

## Estructura

```
index.html            portada
assets/               estilo.css, cueva.js (motor común), modulos.js (datos de cada clase) y sprites
clases/               una página interactiva por clase
juego/                La cueva a ciegas
notebooks/            00a–00c, 02–11 y cave_env.py
difusion/             estrategia.html, posts/ (12 imágenes 1080×1350 + grilla), textos.md
build/                scripts que generan notebooks y posts, y pruebas de las páginas
```

## Créditos

- Autor: Dimas Torres.
- Stanford CS234, *Reinforcement Learning* (Emma Brunskill).
- Repasos de probabilidad y de álgebra lineal de Stanford CS229 y el tutorial de Python/NumPy de CS231n, adaptados libremente al castellano y a la cueva. Los originales no se redistribuyen acá; los notebooks enlazan a sus fuentes.
- Sutton, R. S. y Barto, A. G. (2018). *Reinforcement Learning: An Introduction* (2.ª ed.). [Versión libre](http://incompleteideas.net/book/the-book-2nd.html).
- Ecoffet, A. et al. (2021). First return, then explore. *Nature* 590, 580–586.

## Licencia

A definir.

## Cómo se produce y se mantiene

El curso se produce con una fábrica: un *spine* por clase (`specs/`), agentes y skills de Claude Code (`.claude/`, instrucciones en `CLAUDE.md`)
y un control de calidad automático (`fabrica/chequeos/`, en cada PR por GitHub Actions). El ciclo completo está en `CONTRIBUTING.md`.
