# Brief para las páginas de clase de "RL a ciegas"

Sitio estático para GitHub Pages: /home/claude/rl-a-ciegas (servido localmente en http://localhost:8765/).
Curso de RL de Dimas Torres (docente de la UBA), en castellano. Hilo conductor: un juego, "La cueva a ciegas":
grilla discreta, el agente no ve el mapa, una pared se marca en gris claro solo cuando la toca, la salida es un cuadrado verde.
Idea de fondo del proyecto: el curso enseña a enseñarle a las máquinas y a propagar el conocimiento a otras personas
(el curso es un "organismo" o meme que se propaga por la educación).

Estructura: pre curso 0a Python (desde la cueva, punto de vista de visión por computadora: la cueva ES una matriz / imagen),
0b Probabilidad (piso resbaloso), 0c Álgebra lineal (Bellman como sistema lineal); clases 1–6:
1 ¿Qué es RL? (agente-entorno, historia vs estado, Markov, el tutor de IA y reward hacking),
2 MDP y Bellman (γ, evaluación de políticas, iteración de valor y de política, piso resbaloso),
3 Aprender sin mapa (Monte Carlo, TD, SARSA, Q-learning),
4 Explorar a ciegas (recompensa escasa, curiosidad por conteo, optimismo, Go-Explore — Ecoffet et al. Nature 2021),
5 De la tabla a la red (DQN: aproximar Q con una red, replay, red objetivo, generalización),
6 Aplicaciones (bandits en marketing, el tutor como MDP, robot de reciclaje, deep search como MDP, RLHF, proyecto final).
Los notebooks ya existentes están en /home/claude/rl-a-ciegas/notebooks (leé los de tu clase para alinear contenidos y números).

## Lo que tenés que hacer
Una página HTML por clase en /home/claude/rl-a-ciegas/clases/ con el nombre de archivo que figura en CLASES dentro de assets/cueva.js.
Partí de clases/_plantilla.html (copiala). Usá SIEMPRE assets/estilo.css (tokens y componentes) y assets/cueva.js
(makeEnv, transiciones, iteracionValor, politicaGreedy, camino, rng, tablero(...) para dibujar la cueva, lienzo(...) para gráficos, pagina(id, {lecturas})).
Leé ambos archivos enteros antes de empezar. No los modifiques: si necesitás algo más, escribilo en el <script> de tu página.
Si encontrás un bug en cueva.js, contámelo en el reporte final y resolvelo localmente en tu página.

Cada página:
- Encabezado: eyebrow ("Pre curso · 0a" o "Clase 3"), h1 con una palabra en verde (<span class="g">), una tesis de una oración.
- 3 a 5 bloques (section.bloque): cada uno abre con una figura INTERACTIVA en canvas (el alumno toca algo y ve el efecto),
  y al lado un texto corto (2–4 oraciones), a lo sumo una fórmula corta (.eq) y una pregunta (.nota.pregunta).
  Principio del docente: "ver y después leer": más figuras que ecuaciones; reciclar las mismas herramientas visuales (la cueva, mapa de calor de V,
  flechas de política, trayecto) entre clases. Nada de bloques de código largos (salvo la 0a, donde mostrar código corto es el tema).
- Un bloque final "Para enseñarlo" (section.bloque.full): cómo explicarle esta clase a otra persona en una oración + una pregunta para hacerle +
  un ejercicio de 5 minutos para dar en clase. Este bloque expresa la idea de "enseñar a enseñar".
- Al final del <script>: Cueva.pagina("<id>", { lecturas: [...] }) (agrega barra, material con links a Colab/GitHub, paginador y pie).
- Todo en castellano neutro rioplatense, claro y conciso, sin voseo exagerado. Sin emojis. Términos técnicos en inglés entre paréntesis la primera vez.
- Debe funcionar a 400 px de ancho sin scroll horizontal (los canvas se miden con el ancho del contenedor; usá T.medir() en resize).
- Sin librerías externas salvo que sea imprescindible (si hace falta, solo de cdnjs con versión fija). Nada de fetch a otros sitios.
- Rendimiento: animaciones con requestAnimationFrame; nada que trabe el navegador más de ~100 ms.
- Respetar prefers-reduced-motion para animaciones automáticas.
- El estado inicial de cada figura ya muestra algo con sentido (no un canvas vacío esperando un clic).

## Verificación (obligatoria)
Para cada página, sacá capturas con:
  node /tmp/claude-0/-home-claude/c0892404-b462-53b0-ae0f-c95d40b227f9/scratchpad/snap.js http://localhost:8765/clases/<archivo>.html /home/claude/rl-a-ciegas/build/shots/<archivo>-1200.png 1200 1
  node ... <mismo> /home/claude/rl-a-ciegas/build/shots/<archivo>-400.png 400 1
(imprime errores de consola y si hay scroll horizontal; si el servidor no responde, levantalo: cd /home/claude/rl-a-ciegas && python3 -m http.server 8765 &).
Mirá las capturas con Read y corregí hasta que no haya errores, no haya desborde horizontal y las figuras muestren lo que dice el texto.
Probá además al menos una interacción por bloque con un script de playwright propio (clic/arrastre y captura), guardado en build/.
Reporte final (corto): archivos creados, qué hace cada figura interactiva, problemas encontrados.
