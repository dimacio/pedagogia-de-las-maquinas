# Módulo 8 · Agentes aplicados: enseñar y difundir — contenido común (página y notebook)

Contexto del proyecto: "RL a ciegas" es un MOOC libre de RL en castellano (GitHub Pages, sin videos). Filosofía de fondo (página
inicio/por-que.html): educación problematizadora (Freire: el alumno no recibe depósitos, actúa y reflexiona), cuidado de sí (Foucault,
epimeleia heautou: elegir la propia recompensa) y enseñar a enseñar (el curso se propaga porque cada alumno lo enseña a otro).
Este módulo muestra cómo se produce y se difunde el propio MOOC con agentes: el curso enseña el sistema que lo produce.

Tesis: "Un agente de marketing y un agente tutor resuelven el mismo problema: sostener la atención de alguien. La diferencia es a favor de quién
juega la recompensa, y quién puede verla y cambiarla."

Bloques (mismo orden en página y notebook):
1. Dos agentes, un problema. El agente de difusión (maximiza propagación: guardados, compartidos) y el tutor (maximiza aprendizaje) como dos
   MDP con la misma forma. Los dos "manipulan" la atención. Retoma el bandit de la clase 6 y el tutor de la clase 1/6.
2. La fábrica de contenido: el pipeline multiagente de Villanueva (2026, trabajo final CEIA, LSE-FIUBA: "Sistema multiagente para la generación
   automatizada de contenido en redes sociales usando inteligencia artificial"): detector-curador → generador-evaluador → publicador-analítico,
   con estado compartido y humano en el bucle opcional. Cambio clave para un curso: la fuente no son tendencias (RSS, Reddit) sino la
   BIBLIOGRAFÍA del curso (Sutton y Barto, CS234, los notebooks del propio MOOC). El curador extrae "ideas enseñables" de un fragmento;
   el generador escribe un post, una pregunta de práctica y una ficha; el evaluador es OTRO modelo (generar y evaluar con el mismo modelo mide
   autocomplacencia, no calidad) con rúbrica de 5 criterios 1–10: fidelidad a la fuente, claridad, enganche, formato, utilidad para aprender;
   umbral 6: advierte, no bloquea; el humano decide. Publicación simulada (dry run) y registro.
3. El tutor como agente: banco de preguntas generadas por la fábrica; el tutor elige la próxima con un bandit/MDP cuya recompensa es la MEJORA
   del alumno, no el acierto (si premia aciertos, da solo preguntas fáciles: reward hacking de la clase 1).
4. Persuasión a favor del usuario: nudges (Thaler y Sunstein, 2008) vs patrones oscuros (dark patterns; Brignull acuñó el término en 2010);
   proyectos contra el doomscrolling que meten una pausa o fricción antes de abrir una red (en RL: cambian el entorno, no el agente).
   Tensión honesta: incluso la manipulación bienintencionada choca con la autonomía. Salida coherente con la filosofía del curso:
   la recompensa visible y editable por el propio alumno (el alumno elige qué cuenta como progreso). Puente: la dopamina codifica el error de
   predicción de recompensa (Schultz, Dayan y Montague, 1997) = el error de TD del módulo 3; "loop de dopamina" es metáfora, la evidencia sobre
   adicción a redes está en debate.
5. Para enseñarlo (página) / Preguntas para pensar + Epílogo: cómo se propaga este curso (notebook).

LLM real en el notebook: generador Qwen/Qwen2.5-0.5B-Instruct (abierto, sin token ni login). Evaluador: Qwen/Qwen2.5-1.5B-Instruct,
otro tamaño de la misma familia (los modelos chicos de otras familias no distinguían bien un post bueno de uno malo); aclarar que la tesis
de referencia usa modelos de proveedores distintos. Debe correr en Colab con CPU (lento pero posible) y en GPU T4 gratis (recomendado). Usar transformers + pipeline de chat.
Las respuestas de modelos chicos son flojas: eso es parte de la lección (por eso existe el evaluador y el humano en el bucle).
