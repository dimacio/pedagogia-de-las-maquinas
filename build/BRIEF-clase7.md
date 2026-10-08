# Clase 7 · Agentes — contenido común (página y notebook)

Tesis: "Un agente es cualquier cosa que observa, actúa y recibe una recompensa. La diferencia entre la cueva y el mundo real es que en el mundo real no hay simulador: hay que aprender y evaluar con lo que ya pasó."

Bloques (mismo orden en página y notebook):
1. ¿Qué es un agente? El ciclo de la cueva (observación → acción → recompensa) puesto al lado del ciclo de un agente de LLM
   (pregunta → pensar → usar una herramienta: buscar/leer → observación → responder → recompensa). Puente con deep search (clase 6).
2. El feed como MDP con γ ≈ 0. Lo publicado por Meta sobre ranking: candidatos → redes multitarea que predicen P(ver), P(like),
   P(compartir), P(guardar), P(ocultar) → puntaje ponderado → ordenar. Eso es supervisado y miope (γ = 0).
   Simulador de juguete: un usuario con intereses ocultos y un estado de "satisfacción" que baja con el contenido gancho (clickbait) y sube con
   el contenido que le sirve; la probabilidad de volver al día siguiente depende de la satisfacción.
   Política miope (maximiza clic inmediato) vs política con γ alto (maximiza retorno a largo plazo, resuelta con iteración de valor o Q-learning
   sobre un estado discretizado de satisfacción). Mostrar: clics de hoy vs días que el usuario sigue volviendo. Conexión con el reward hacking del tutor.
   Aclarar: qué usa hoy cada plataforma no es público; lo publicado puede estar desactualizado.
3. RL sin simulador: ReAgent. Horizon (Gauci et al., 2018, arXiv:1811.00260), plataforma de RL aplicado de Facebook, renombrada ReAgent,
   pensada para problemas con muchos datos, respuesta lenta y sin simulador. Usos en producción reportados en 2018 (VentureBeat): cuándo mandar
   notificaciones, las sugerencias de M en Messenger y el bitrate de los videos 360. Su pieza clave: la evaluación contrafactual de políticas
   (counterfactual policy evaluation, off-policy evaluation): estimar cuánto rendiría una política nueva usando solo registros de la vieja.
   En la cueva: la política "vieja" (de comportamiento) es estocástica con probabilidades conocidas (p.ej. 60% la acción óptima, 40% al azar,
   o un ε-greedy sobre una Q imperfecta); se registran N partidas con (s, a, r, p_vieja(a|s)). Política nueva = otra política (p.ej. la óptima,
   o una más exploradora). Estimadores: método directo (modelo aprendido de los registros + iteración de valor), importance sampling por trayectoria
   (IS), IS ponderado (WIS), IS por decisión (per-decision IS). Comparar con el valor verdadero (jugando la política nueva muchas veces):
   sesgo y varianza; la varianza explota cuando la política nueva se aleja de la vieja o el horizonte es largo (mostrarlo con un slider/parámetro).
   Cierre del bloque: RL offline (batch): entrenar Q-learning solo con los registros (fitted Q iteration / Q-learning sobre el replay fijo) y ver
   que falla en casillas que la política vieja nunca visitó (cambio de distribución).
4. De ReAgent a Pearl y a los LLM. El repositorio de ReAgent está archivado; su README recomienda Pearl (Meta, "Pearl: A Production-Ready
   Reinforcement Learning Agent", Zhu et al., arXiv:2312.03814). Mismos problemas, en versión agente: exploración, evaluación offline, seguridad.
   RLHF (Ouyang et al., 2022) y DeepSeek-R1 (RL a gran escala sin ajuste supervisado previo, lo cita la clase 1 de CS234): el modelo de lenguaje
   es un agente cuya acción es el próximo texto. Cierre: el curso como agente que se propaga (puente al epílogo de difusión).
5. Para enseñarlo (página) / Preguntas para pensar + Próxima: epílogo (notebook).

Referencias: Gauci et al. 2018 https://arxiv.org/abs/1811.00260 · ReAgent https://github.com/facebookresearch/ReAgent ·
Pearl https://github.com/facebookresearch/Pearl y https://arxiv.org/abs/2312.03814 · VentureBeat 2018
https://venturebeat.com/ai/facebook-open-sources-reinforcement-learning-platform-horizon · Precup, Sutton y Singh (2000), eligibility traces
for off-policy policy evaluation · Sutton y Barto cap. 5.5 (importance sampling) · Chen et al. 2019 (REINFORCE en YouTube, arXiv:1812.02353).
No usar ni instalar ReAgent ni Pearl: todo desde cero (numpy en el notebook, JS en la página).
