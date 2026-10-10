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
- Clase 2: spine rediseñado (B1 «por qué RL» con los cuatro ingredientes, política como bloque propio, objetivo E[Σr] separado del ciclo,
  bigotes solo como adelanto de la clase 9, tutor partido en planteo y trampa).

### Aviso
- El progreso de los cuestionarios guardado en el navegador vuelve a cero (los ids cambian de significado).

### Pendiente
- Marcas de trazabilidad en páginas (`data-objetivos`) y notebooks (`objetivo:Ox`): hoy el chequeo `trazabilidad` falla.
- Referencias a la numeración vieja en los notebooks de nivelación (0a–0c) y de la clase 2 (se corrigen en sus builders).
- Rediseño de las clases con `/disenar-clase`, una por vez, usando CS234 y CS224R como guía. Falta policy gradient.

## [1.0.0] — 2026-10-08

### Agregado
- MOOC de 12 clases en cuatro trimestres, nivelación (0a–0c), juego, difusión (12 posts) y epílogo.
