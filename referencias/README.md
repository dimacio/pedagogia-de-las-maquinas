# Referencias: presentaciones de Stanford

Guía de **qué enseñar y en qué orden**. No es material del curso: no se copia texto ni figuras, y los PDF **no se suben al repositorio**
(están en `.gitignore`). Cada quien los descarga de los sitios oficiales a `referencias/CS234-2026/` y `referencias/CS224R-2026/`.

- **CS234 Reinforcement Learning** (Emma Brunskill, invierno 2026) — https://web.stanford.edu/class/cs234/ — RL tabular a moderno, con foco en fundamentos.
- **CS224R Deep Reinforcement Learning** (primavera 2026) — https://cs224r.stanford.edu/ — RL profundo, robótica y LLM.

## Presentaciones descargadas

| Archivo | Tema |
|---|---|
| CS234 `lecture1post` | Introducción a RL |
| CS234 `lecture2post` | Decisiones secuenciales con modelo (MDP, Bellman, iteración de valor y de política) |
| CS234 `lecture3post` | Evaluación de políticas sin modelo (Monte Carlo, TD) |
| CS234 `lecture4post` | Control sin modelo y aproximación de funciones (SARSA, Q-learning, DQN) |
| CS234 `lecture5post`, `lecture6post` | Policy gradient I y II (REINFORCE, línea base, PPO) |
| CS234 `lecture7post`, `lecture8post` | Policy gradient e imitation learning; RLHF/DPO |
| CS234 `lecture9post` | RL eficiente en datos / offline |
| CS234 `lecture10post`–`lecture12post` | RL rápido: bandits, exploración, UCB, Thompson |
| CS234 `lecture13post`, `lecture14post` | Monte Carlo Tree Search |
| CS234 `ShaneGuCS234_2026`, `ethics_society_234_2` | Invitado (modelos del mundo) y ética |
| CS224R `01` | Introducción |
| CS224R `02` | Imitation learning |
| CS224R `03`–`05` | Policy gradients, actor-critic, actor-critic off-policy |
| CS224R `06` | Q-learning profundo |
| CS224R `07` | RL offline |
| CS224R `08` | Aprender la recompensa |
| CS224R `09` | RLHF |
| CS224R `10` | RL para razonamiento en LLM |
| CS224R `11`–`13` | RL basado en modelos, multitarea/condicionado a metas, meta-RL |
| CS224R `15`–`18` | Jerarquía, sim2real y robótica, RL para VLA, fronteras |

## Correspondencia con nuestras clases (punto de partida para `/disenar-clase`)

| Nuestra clase | Stanford |
|---|---|
| 2 · ¿Qué es RL? | CS234 L1; CS224R 01 |
| 3 · MDP y Bellman | CS234 L2 |
| 4 · Aprender sin mapa | CS234 L3 y primera mitad de L4 |
| 5 · Explorar a ciegas | CS234 L10–L12 (en Stanford la exploración llega mucho más tarde y con bandits primero) |
| 6 · Redes neuronales | CS234 L4 (segunda mitad, aproximación de funciones y DQN); CS224R 06 |
| 7 · Redes recurrentes | Sin equivalente directo (material propio del autor; POMDP) |
| 8 · Aplicaciones | CS234 L10–L11 (bandits); CS224R 02 (imitación) |
| 9 · Agentes I | CS234 L9; CS224R 07 (offline) |
| 10 · Agentes II | CS234 L7–L8; CS224R 08–10 (recompensa aprendida, RLHF, razonamiento) |
| 11 · Agentes aplicados | CS234 ética |

**Hueco más grande:** nuestro curso no tiene **policy gradient** (REINFORCE, línea base, actor-critic, PPO), y Stanford le dedica
2–3 clases (CS234 L5–L6, CS224R 03–05). Sin eso, RLHF, PPO y GRPO de la clase 10 quedan sin base.
También faltan imitation learning como clase propia y MCTS. Para revisar en `/disenar-clase`.
