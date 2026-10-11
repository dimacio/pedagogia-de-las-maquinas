# Cambios

Formato: una sección por versión (SemVer sobre el curso, ver `fabrica/CONVENCIONES.md` §4). Lo nuevo va primero en «Sin publicar».

## Sin publicar

### Agregado
- Fábrica: spines de las 15 clases (`specs/`), convenciones, chequeos automáticos (`fabrica/chequeos/`), workflows de GitHub Actions,
  agentes y skills de Claude Code (`.claude/`), plantillas de issue y PR, guía de referencias de Stanford.
- Campo `objetivo` en cada pregunta de los cuestionarios.
- `fabrica/marco-filosofico.md`: jerarquía de autores del marco (Freire, Foucault, Dawkins) y Cyborg Psychology (Pataranutaporn)
  como evidencia contemporánea; regla 9 de contenido en `CLAUDE.md`.

### Cambiado
- Estructura de 16 clases en cuatro unidades (`build/PLAN-16-clases.md`); clases 3–16 en preparación; material de la v1 en
  `build/v1/` y `specs/v1/`.
- Clase 1: spine, página y cuestionario rediseñados. B1 (Freire) y B2 (el feed que mira solo el próximo clic, figura nueva) separados;
  γ solo como adelanto de la clase 3; B3 y B4 más cortos; recuadro «Esto hoy se mide» con Cyborg Psychology (F6, F7); Q2 sin γ y Q5
  sobre el recuadro. README: Cyborg Psychology como evidencia contemporánea.
- Clase 2: spine, página, notebook y cuestionario rediseñados. B1 «por qué RL» (cuatro ingredientes y el contraste con supervisado),
  política π(a|s) como bloque propio, E[Σr] separado del ciclo, Markov explicado por lo que viene, bigotes solo como adelanto de la clase 9,
  tutor partido en planteo y trampa, recompensa de mejora calculada en el notebook; referencias con la numeración de 16 clases.
- Chequeos: no recorren `.venv` ni `.superpowers` como sitio.
- Clase 3 (nueva): cadena de Markov → MRP → retorno y γ → valor → Bellman, sin acciones; recuadro Future You en B3.
- Clase 4 (nueva): MDP, Q, mejora de política, iteración de política y de valor, piso resbaloso, robot de reciclaje.
- Clase 5 (nueva): Monte Carlo, promedio incremental, TD(0), el error δ y la dopamina, sesgo y varianza, equivalencia de certeza.
- Clase 6 (nueva): por qué Q y no V sin mapa, ε-greedy, SARSA, Q-learning, on-policy contra off-policy, mapa de visitas.
- Clase 7 (nueva): bandits, regret, UCB, optimismo y conteos, Go-Explore, acciones pegajosas (Machado et al., 2018).
- Clase 8 (nueva): Q como matriz y función, red one-hot = tabla, generalizar y cuándo engaña, el objetivo que se mueve, DQN, comparar con varias semillas (Machado et al., 2018).
- Clase 9: redes recurrentes desde la v1 7 sin la cadena de Markov (bigotes, n-gramas, red con un lazo, agente con memoria, puente al modelo de lenguaje); recuadro de falsas memorias.
- Clase 10 (nueva): clonación de comportamiento, errores compuestos, DAgger, RL offline, cambio de distribución, imitar o mejorar.
- Clase 11 (nueva): políticas con softmax, REINFORCE como imitación ponderada, línea de base, actor-crítico, recorte de PPO.
- Clase 12 (nueva): preferencias, Bradley-Terry, recompensa aprendida, RLHF con penalización, sobreoptimización, DPO.

### Aviso
- El progreso de los cuestionarios guardado en el navegador vuelve a cero (los ids cambian de significado).

### Pendiente
- Marcas de trazabilidad en páginas (`data-objetivos`) y notebooks (`objetivo:Ox`): hoy el chequeo `trazabilidad` falla.
- Referencias a la numeración vieja en los notebooks de nivelación (0a–0c) (se corrigen en sus builders).
- Rediseño de las clases con `/disenar-clase`, una por vez, usando CS234 y CS224R como guía. Falta policy gradient.

## [1.0.0] — 2026-10-08

### Agregado
- MOOC de 12 clases en cuatro trimestres, nivelación (0a–0c), juego, difusión (12 posts) y epílogo.
