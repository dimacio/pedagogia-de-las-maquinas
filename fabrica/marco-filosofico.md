# Marco filosófico del curso

Decisión del autor (2026-10-10). Todo cambio al marco filosófico (clase 1, sección «Por qué este curso» del README y
cualquier mención en otras clases) respeta este documento. Si el marco cambia, primero cambia este archivo, en su propio PR.

## Jerarquía de autores

| Nivel | Autor | Para qué sirve en el curso | Dónde vive |
|---|---|---|---|
| Fundamento | **Paulo Freire** (educación problematizadora) | Plantea la pregunta de **cómo se aprende**: actuando y reflexionando sobre un problema real, en diálogo, y no recibiendo contenidos depositados. Justifica que el curso enseñe a enseñarle a una máquina. | Clase 1, idea 1 |
| Fundamento | **Michel Foucault** (cuidado de sí) | Plantea la pregunta de **quién elige la recompensa**: cuidarse es poder ver y elegir los pesos, en lugar de aceptar los que pone otro. | Clase 1, idea 2 |
| Propagación | **Richard Dawkins** (meme) | Explica **cómo se propaga el curso**: fidelidad, fecundidad y longevidad. Justifica «Para enseñarlo», la actividad entre pares y la clase 12. | Clase 1, idea 3; clase 12 |
| Evidencia contemporánea | **Pat Pataranutaporn** (Cyborg Psychology, MIT Media Lab) | Aporta **evidencia empírica** sobre si la IA aumenta o disminuye nuestras capacidades. No plantea la pregunta ni la reemplaza: muestra que hoy se mide. | Recuadros dentro de bloques existentes |

Reglas:

1. Freire y Foucault plantean las preguntas; Dawkins explica la propagación. Son las **tres ideas** del curso y siguen siendo tres.
2. Pataranutaporn **no es una cuarta idea** de igual peso: no tiene tarjeta propia en el marco de la clase 1, ni objetivo propio, ni resume
   o reinterpreta a los otros tres. Entra como recuadro de evidencia dentro de un bloque que ya enseña otra cosa.
3. Cada mención de un estudio empírico dice qué midió, con quiénes y qué límites tiene (regla 7 de `CLAUDE.md`). Las cifras salen
   del trabajo citado, no de la prensa (regla 5).
4. La cueva ilustra la idea; no se afirma que estos estudios «son RL». Son psicología e interacción humano-computadora.

## Trabajos de Cyborg Psychology que se pueden citar

Verificados el 2026-10-10. Antes de usar una cifra, leerla en el trabajo, no en esta tabla.

| Trabajo | Publicación | Qué mide | Límites a decir |
|---|---|---|---|
| Pataranutaporn, P. et al. *Future You: A Conversation with an AI-Generated Future Self Reduces Anxiety, Negative Emotions, and Increases Future Self-Continuity.* | IEEE Frontiers in Education Conference (FIE) 2024, DOI 10.1109/FIE61694.2024.10893443; preprint arXiv:2405.12514 | Una charla con un yo futuro generado por IA y su efecto en ansiedad y continuidad con el yo futuro (preregistrado, N = 344). | Una sola sesión, personas de 18 a 30 años. No mide decisiones en el tiempo: la relación con γ es una metáfora del curso. |
| Pataranutaporn, P., Liu, R., Finn, E. y Maes, P. (2023). *Influencing human–AI interaction by priming beliefs about AI can increase perceived trustworthiness, empathy and effectiveness.* | *Nature Machine Intelligence*, DOI 10.1038/s42256-023-00720-7; manuscrito en https://dspace.mit.edu/handle/1721.1/152316 | Mismo agente conversacional, distinto mensaje previo sobre sus motivos: cambia cómo se lo juzga y cómo evoluciona la charla. | Efecto de corto plazo. Leer el manuscrito antes de citar el tamaño de muestra. |
| Chan, S., Pataranutaporn, P., Suri, A., Zulfikar, W., Maes, P. y Loftus, E. F. (2024). *Conversational AI Powered by Large Language Models Amplifies False Memories in Witness Interviews.* | Preprint, arXiv:2408.04681 | Un entrevistador con LLM que hace preguntas engañosas aumenta los recuerdos falsos de testigos de un video (N = 200). | Preprint. Escenario de laboratorio con preguntas engañosas a propósito: no generalizar a «la IA altera la memoria». |
| Fang, C. M. et al. (2025). *How AI and Human Behaviors Shape Psychosocial Effects of Extended Chatbot Use: A Longitudinal Randomized Controlled Study.* | Preprint, arXiv:2503.17473 | Cuatro semanas de uso de un chatbot (N = 981): soledad, socialización, dependencia emocional, uso problemático. | Las condiciones asignadas no tuvieron efecto significativo; el peor resultado se asocia al uso voluntario intenso (correlación, no causa). Coautores de OpenAI. |

## Dónde encaja cada trabajo

Punto de partida; la decisión final de cada clase se toma en su `/disenar-clase`.

| Trabajo | Clase (tema) | Cómo se ve en la cueva |
|---|---|---|
| Future You y el estudio longitudinal | 1 · Introducción, dentro de la idea 2 | Recuadro «Esto hoy se mide»: la pregunta de quién elige la recompensa también se estudia con experimentos. |
| Future You | MDP y Bellman (bloque de γ) | Con γ chico la salida lejana no ilumina el mapa de calor de V; acercar el yo futuro como metáfora de subir γ. |
| Falsas memorias | Redes recurrentes (memoria e historia) | En modo difícil, un asistente «recuerda» una pared que no estaba: con la memoria contaminada, la ruta sale mal y con confianza. |
| Estudio longitudinal | Agentes I (el feed: clics hoy o usuarios mañana) | Métrica corta contra resultado largo: qué pasa después de N partidas con guía cuando se juega sin él. |
| Priming | Agentes aplicados (persuasión: cambiar el entorno, no el agente) | Las mismas flechas de un guía con dos etiquetas, «te cuida» o «te engaña»: misma política, distinto seguimiento. |
