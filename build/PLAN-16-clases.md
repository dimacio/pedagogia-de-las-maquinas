# Plan de 16 clases (spec del programa, borrador para aprobación del autor, 2026-10-10)

Reemplaza a `build/PLAN-12-clases.md` cuando se apruebe. Es la fuente de verdad del **recorrido**; el contenido de cada clase
sigue viviendo en su spine (`specs/<id>.md`), que se rediseña con `/disenar-clase`.

## 1. Por qué cambia

Diagnóstico contra CS234 y CS224R 2026 (`referencias/`):

- **Clases comprimidas.** La clase 3 actual junta γ, Bellman, iteración de valor y de política y el slip; la 4, Monte Carlo, TD,
  SARSA y Q-learning; la 8, bandits, MDP de aplicación, deep search, RLHF y «tu MDP»; la 9, ReAct con RL offline; la 10, GRPO,
  temperatura, herramientas y contexto. Rompen la regla 2 de `CLAUDE.md` (no comprimir).
- **Conceptos antes de tiempo.** La cadena de Markov llega en la clase 7, después del MDP; Go-Explore y Atari llegan antes de las
  redes y de los bandits; RLHF y GRPO llegan sin policy gradient.
- **Huecos.** No hay policy gradient (REINFORCE, línea base, actor-crítico, PPO), ni imitation learning, ni aprender la recompensa
  a partir de preferencias.

## 2. Decisiones del autor

1. **16 clases, una por semana: un cuatrimestre.** Se prefiere bajar la profundidad de cada tema antes que extender el curso.
   Bajar profundidad significa **menos ideas por tema**, no más ideas por bloque: una idea por bloque sigue valiendo.
2. Se conservan la **clase 1** (marco filosófico, ver `fabrica/marco-filosofico.md`) y la clase de **redes recurrentes** como
   puente entre Markov y los modelos de lenguaje.
3. **La cueva es el hilo** de todas las clases nuevas.
4. Orden general de **CS234** (tabla → red → policy gradient), porque la cueva es tabular y visual. **CS224R** guía la parte
   profunda y la de LLM; de CS224R se toma la idea de presentar policy gradient como «imitar lo que salió bien», por eso imitar va
   antes que policy gradient.
5. La **nivelación** (0a, 0b, 0c) no cambia y queda afuera de las 16.
6. Las 16 clases se agrupan en **cuatro unidades de cuatro**. El campo `trimestre` desaparece y lo reemplaza `unidad`.

## 3. Recorrido

| id | Unidad | Página | Notebook | Título (provisorio; se fija en `/disenar-clase`) | Stanford |
|---|---|---|---|---|---|
| 1 | U1 · Fundamentos | `01-introduccion.html` | — | Introducción: por qué este curso | — |
| 2 | U1 | `02-que-es-rl.html` | `02-que-es-rl.ipynb` | ¿Qué es RL? | CS234 L1 (1ª parte); CS224R 01 |
| 3 | U1 | `03-cuanto-pesa-el-futuro.html` | `03-cuanto-pesa-el-futuro.ipynb` | Cuánto pesa el futuro: de la cadena de Markov a Bellman | CS234 L1 (2ª parte) |
| 4 | U1 | `04-planificar-con-mapa.html` | `04-planificar-con-mapa.ipynb` | Planificar con mapa: iteración de valor y de política | CS234 L2 |
| 5 | U2 · Sin mapa | `05-evaluar-sin-mapa.html` | `05-evaluar-sin-mapa.ipynb` | Evaluar sin mapa: Monte Carlo y TD | CS234 L3 |
| 6 | U2 | `06-controlar-sin-mapa.html` | `06-controlar-sin-mapa.ipynb` | Controlar sin mapa: SARSA y Q-learning | CS234 L4 (1ª mitad) |
| 7 | U2 | `07-explorar.html` | `07-explorar.ipynb` | Explorar: de los bandits a la cueva | CS234 L9–L12 |
| 8 | U2 | `08-de-la-tabla-a-la-red.html` | `08-de-la-tabla-a-la-red.ipynb` | De la tabla a la red: aproximación y DQN | CS234 L4 (2ª mitad); CS224R 06 |
| 9 | U3 · De la red a la política | `09-redes-recurrentes.html` | `09-redes-recurrentes.ipynb` | Redes recurrentes: cuando el estado no alcanza | CS224R 01 (POMDP); sin equivalente directo |
| 10 | U3 | `10-aprender-de-registros.html` | `10-aprender-de-registros.ipynb` | Aprender de registros: imitar y RL offline | CS224R 02 y 07; CS234 L7 |
| 11 | U3 | `11-policy-gradient.html` | `11-policy-gradient.ipynb` | Policy gradient y actor-crítico: reforzar lo que salió bien | CS234 L5–L6; CS224R 03–05 |
| 12 | U3 | `12-aprender-la-recompensa.html` | `12-aprender-la-recompensa.ipynb` | Aprender la recompensa: preferencias, RLHF y DPO | CS234 L8; CS224R 08–09 |
| 13 | U4 · Lenguaje y agentes | `13-el-lenguaje-como-politica.html` | `13-el-lenguaje-como-politica.ipynb` | El modelo de lenguaje como política: token, temperatura, GRPO | CS224R 10 |
| 14 | U4 | `14-agentes-de-lenguaje.html` | `14-agentes-de-lenguaje.ipynb` | Agentes de lenguaje: ReAct, herramientas, riesgos | CS224R 10 y 18 |
| 15 | U4 | `15-agentes-aplicados.html` | `15-agentes-aplicados.ipynb` | Agentes aplicados: tutor, difusión, persuasión, alineación | CS234 ética (alineación de valores) |
| 16 | U4 | `16-cierre.html` | — | Cierre: proyecto final y cómo se propaga | — |

Notebooks lentos (LLM, `"fabrica": {"lento": true}`): 13, 14 y 15, con los mismos modelos que hoy (Qwen2.5-0.5B-Instruct como
generador o agente, Qwen2.5-1.5B-Instruct como evaluador).

### Qué entra en cada clase nueva (sin el contenido; eso es del spine)

- **3.** Cadena de Markov → proceso de recompensa de Markov → retorno y γ → ecuación de Bellman de evaluación. El feed con γ ≈ 0 de la clase 1 como ejemplo.
- **4.** MDP = cadena + acciones; iteración de valor; iteración de política; el slip. El tutor y el robot de reciclaje como MDP.
- **5.** Monte Carlo contra TD con la cueva; sesgo contra varianza como intuición, sin demostración.
- **6.** ε-greedy, SARSA, Q-learning y el mapa de visitas como adelanto de explorar.
- **7.** Bandit (anuncios), regret como idea, UCB; Thompson como mención; en la cueva, conteo, optimismo y Go-Explore como «volver y después explorar».
- **8.** Q como función, la red que equivale a la tabla, generalización y cuándo engaña; DQN con sus ingredientes.
- **9.** POMDP (solo bigotes), n-gramas, red recurrente, agente con memoria y el puente al modelo de lenguaje.
- **10.** Imitar partidas grabadas del modo Jugar; errores compuestos; corregir con un experto (DAgger) como idea; RL offline y cambio de distribución.
- **11.** Las flechas como probabilidades; REINFORCE como «reforzar lo que salió bien»; línea base; el mapa de V como crítico; PPO como «no alejarse demasiado de la política anterior», sin derivación.
- **12.** De dos trayectos, «¿cuál preferís?», a un mapa de la recompensa aprendida; las etapas de RLHF; DPO como intuición.
- **13.** El modelo de lenguaje como política: estado = texto, acción = token; temperatura como exploración; GRPO con un grupo de respuestas y un verificador.
- **14.** Bucle ReAct en la cueva y fuera de ella; herramientas y ventana de contexto; deep search (seguir buscando o responder); buscar antes de responder como mención de MCTS; riesgos de optimizar una recompensa que se puede engañar.
- **15.** Tutor y difusión como dos MDP; la fábrica de contenido con agentes; persuasión a favor del usuario; la recompensa a la vista; alineación de valores.
- **16.** El recorrido de las 15 clases sobre la cueva; proyecto final con «el MDP de tu dominio»; la difusión del curso como bandit; vuelta a la clase 1.

## 4. Qué se reutiliza de las clases actuales

| Clase actual | Bloque | Va a |
|---|---|---|
| 1 | todos | 1 (B4 «Cómo se cursa» se reescribe: 16 clases, 4 unidades, un cuatrimestre) |
| 2 | todos | 2 |
| 3 · MDP y Bellman | B1 cuánto pesa el futuro, B2 caminar al azar | 3 |
| | B3 iteración de valor, B4 iteración de política, B5 piso resbaloso | 4 |
| 4 · Aprender sin mapa | B1 Monte Carlo contra TD | 5 |
| | B2 Q-learning, B3 SARSA contra Q-learning, B4 adelanto de explorar | 6 |
| 5 · Explorar a ciegas | B1 la carrera de exploradores, B2 Go-Explore, B3 desapego y descarrilamiento | 7 (reducidos) |
| | B4 de la cueva a Atari | afuera (mención en 7) |
| 6 · Redes neuronales | todos | 8 |
| 7 · Redes recurrentes | B1 el caminante sin memoria | 3 |
| | B2–B7 | 9 |
| 8 · Aplicaciones | B1 marketing digital (bandit) | 7 |
| | B2 el tutor como MDP, B3 el robot de reciclaje | 4 |
| | B4 deep search | 14 |
| | B5 RLHF | 12 |
| | B6 el MDP de tu dominio | 16 |
| 9 · Agentes I | B1–B2 ReAct | 14 |
| | B3 el feed como MDP | 3 (como ejemplo de γ) |
| | B4 ReAgent y evaluación offline (IS, WIS) | afuera (mención en 10) |
| | B5 RL offline | 10 |
| | B6 de ReAgent a Pearl | afuera |
| 10 · Agentes II | B1 el modelo como política | 13 |
| | B2 recompensa, verificador, ventaja | 12 (RLHF) y 13 (GRPO) |
| | B3 herramientas, B4 memoria y contexto, B5 riesgos | 14 |
| 11 · Agentes aplicados | todos | 15 |
| 12 · Cierre | todos | 16 |

Los bloques «Para enseñarlo» se reescriben en cada clase. Los notebooks se reparten igual que los bloques: el builder de la clase
nueva toma las secciones de los builders viejos que correspondan. Los cuestionarios (`assets/modulos.js`) se reescriben por clase,
porque cambian los objetivos.

## 5. Qué queda afuera

MCTS y AlphaZero completos (queda una mención en 14); análisis de regret y Thompson en detalle; Go-Explore en Atari; evaluación
offline con IS y WIS; derivaciones de PPO, DPO y SAC; RL basado en modelos, multitarea, meta-RL y jerarquía (CS224R 11–15).

## 6. Cambios de estructura (fuera de las clases)

- `assets/cueva.js`: `CLASES` pasa a 16 entradas con `unidad` en lugar de `trimestre`; el comentario de la línea 200 se actualiza.
- `fabrica/chequeos/spines.py`: valida `unidad` (1–4 o `"N"`) en lugar de `trimestre`. Durante la migración, un spine con
  `estado: borrador` cuya página todavía no existe produce aviso, no falla. `specs/v1/` no se chequea.
- `fabrica/CONVENCIONES.md` §1: el ejemplo de encabezado usa `unidad`.
- `README.md`, `index.html` (descripción y recorrido) y la clase 1 (bloque «Cómo se cursa» y su figura por trimestres): 16 clases,
  cuatro unidades, un cuatrimestre.
- `build/PLAN-12-clases.md` y `build/ESTRUCTURA.md` (que ya estaba desactualizado): se marcan como históricos y apuntan a este archivo.
- `difusion/`: los textos que dicen «doce clases» se actualizan en el PR de la clase 16.
- **Progreso guardado**: la clave `rlac-cuestionarios` cambia a `rlac-cuestionarios-v2`, porque los ids cambian de significado
  (el «3» era MDP y pasa a ser la cadena de Markov). Quien cursó la v1 empieza el progreso de cero; se avisa en el CHANGELOG.
- **Direcciones de la v1**: cada página vieja que cambia de nombre queda como una página mínima que redirige a su sucesora
  (`03-mdp-y-bellman` → 3, `04-aprender-sin-mapa` → 5, `05-explorar-a-ciegas` → 7, `06-redes-neuronales` → 8,
  `07-redes-recurrentes` → 9, `08-aplicaciones` → recorrido del índice, `09-agentes-mundo-real` → 14,
  `10-agentes-de-lenguaje` → 13, `11-agentes-aplicados` → 15, `12-cierre` → 16). Los chequeos de páginas las saltean.
  Los enlaces viejos a notebooks en Colab dejan de funcionar; se acepta.
- **Versión**: `v2.0.0` (MAYOR: cambia la estructura). Se publica una sola vez, cuando las 16 clases están en `estado: publicada`.
  Hasta entonces el sitio publicado sigue siendo la v1, porque `publicar.yml` solo corre al etiquetar.

## 7. Issues existentes

| Issue | Clase nueva |
|---|---|
| #2 Cyborg Psychology en la clase 1 | 1 |
| #3 Future You como metáfora de γ | 3 |
| #4 Falsas memorias | 9 |
| #5 Uso prolongado y dependencia | 10 o 15; se decide en `/disenar-clase` de la 10 |
| #6 Priming | 15 |

## 8. Orden de trabajo

1. **PR de estructura**: lo de §6 salvo las redirecciones. Los spines actuales se mueven a `specs/v1/` (los ids 1–12 se repiten y
   cambian de significado); se crean 16 spines nuevos en `specs/` con `estado: borrador` y encabezado mínimo. Los de las clases 1 y 2
   parten de su spine v1. Las páginas y notebooks viejos que cambian de id se mueven a `build/v1/` (y sus entradas de `modulos.js` a
   `build/v1/modulos-v1.js`); el resto de los builders queda en `build/`. Una clase en preparación lleva `pronto: true` en `CLASES`:
   los chequeos la saltean salvo `spines`, y el sitio la muestra como «próximamente», sin enlace.
2. **Una clase por vez, en orden del 1 al 16**, porque cada clase hereda de la anterior. Cada una: issue → rama `clase-<id>` →
   `/disenar-clase <id>` (spine aprobado por el autor) → `/producir-clase <id>` → `/revisar-clase <id>` → PR. El PR que absorbe
   la última parte de una clase vieja borra su página, su notebook y su builder, y agrega la redirección.
3. **Cierre**: trazabilidad en verde para las 16, CHANGELOG cerrado, `/publicar-version mayor`.

## 9. Criterio de terminado del programa

- Las 16 clases en `estado: publicada`, cada una con su PR aprobado por el autor.
- `python fabrica/chequeos/correr.py --rapido` en verde, incluido `trazabilidad`.
- Ninguna clase con un bloque de más de 4 oraciones o más de una fórmula.
- Las direcciones de la v1 redirigen.
- `v2.0.0` publicada.
