# Convenciones de la fábrica

Contrato entre los spines, los artefactos y los chequeos. Si algo de este archivo cambia, cambian los chequeos.

## 1. El spine de cada clase: `specs/<id>.md`

Un archivo por clase, con nombre igual al id: `specs/0a.md`, `specs/0b.md`, `specs/0c.md`, `specs/1.md` … `specs/16.md`.
Una clase en preparación lleva `pronto: true` en `CLASES` de `assets/cueva.js` y su spine en `estado: borrador` (o `en-produccion` después
de `/disenar-clase`), con `objetivos` y `fuentes` vacíos hasta `/disenar-clase`; `/producir-clase` quita `pronto` cuando la página existe; los chequeos la saltean salvo `spines`. Los spines de la v1 están en `specs/v1/` y no se chequean.
Es la **fuente de verdad**: lo escribe el autor; los agentes lo leen y nunca lo cambian sin pedirlo en el PR.

Encabezado YAML (obligatorio):

```yaml
---
id: "7"
titulo: "Redes recurrentes: cuando el estado no alcanza"
unidad: 3               # 1–4, o "N" para nivelación
estado: publicada       # borrador | en-produccion | publicada
pagina: clases/07-redes-recurrentes.html
notebook: notebooks/07-redes-recurrentes.ipynb   # o null
previos: ["2", "6"]
objetivos:
  - id: O1
    texto: "Explicar con la cueva qué es una cadena de Markov y leer su matriz de transición P."
  - id: O2
    texto: "…"
fuentes:
  - id: F1
    cita: "Sutton, R. S. y Barto, A. G. (2018). Reinforcement Learning: An Introduction, 2.ª ed., cap. 17.3."
    url: "http://incompleteideas.net/book/the-book-2nd.html"
---
```

Cuerpo en Markdown, en el formato de spine del autor (pregunta de la clase, objeto visual, bloques, notebook, figuras,
qué deja para la clase siguiente). Cada bloque declara qué objetivos cubre: `### B2 — Cuando la observación no es el estado  (cubre: O2)`.

## 2. Marcas de trazabilidad en los artefactos

- **Página** (`clases/*.html`): cada `<section class="bloque">` que enseña algo lleva `data-objetivos="O1 O3"`.
- **Notebook** (`notebooks/*.ipynb`): la celda markdown que abre cada sección lleva en su metadata
  `"tags": ["objetivo:O1", "objetivo:O3"]`. (En los builders: helper `md(texto, objetivos=["O1"])`.)
- **Cuestionario** (`assets/modulos.js`): cada pregunta lleva `objetivo: "O2"`.
- **Notebooks lentos**: si un notebook usa LLM o tarda más de 3 min en CPU, su metadata de notebook lleva
  `"fabrica": {"lento": true}`; el CI rápido lo saltea y lo corre el workflow semanal.

Regla de cobertura (chequeo `trazabilidad`): cada objetivo del spine aparece en al menos un bloque de la página
y en al menos una pregunta del cuestionario; si la clase tiene notebook, también en al menos una sección del notebook.
Los ids de objetivo que aparecen en artefactos tienen que existir en el spine.

## 3. Fuentes y originalidad

- Las fuentes con derechos (Sutton y Barto, CS234, CS229, CS231n, papers) **no se suben al repo**. El chequeo
  `originalidad` las lee de una carpeta local (`FUENTES_DIR`, por defecto `~/fuentes-rl`) en texto plano; si no existe, se saltea y lo avisa.
- Umbral: ninguna secuencia de 12 palabras seguidas idéntica a una fuente.

## 4. Versiones

SemVer sobre el curso: MAYOR = cambia la estructura (clases que se agregan, se parten o se renumeran);
MENOR = contenido nuevo dentro de una clase; PARCHE = correcciones. Cada versión tiene su entrada en `CHANGELOG.md`.

## 5. Agregados de la implementación de los chequeos

- **Builders**: `md(texto, objetivos=["O1"])` agrega las marcas de trazabilidad; `save(cells, nombre, lento=True)` marca un notebook lento.
  Las marcas viven en el builder: si se editan a mano en el `.ipynb`, la próxima regeneración las borra.
- **Página sin lecturas**: se justifica con `sin_lecturas: "motivo"` en el spine o `<!-- fabrica:sin-lecturas motivo -->` en la página.
- **Fuente citada**: cuenta si aparece su URL, o el apellido del primer autor con el año cerca.
- **Páginas en los chequeos**: se abren sin red (Google Fonts bloqueado); `FABRICA_RED=1` la habilita. `difusion/posts/src/` no se chequea (son lienzos de 1080 px).
- **Publicación**: en el repositorio, *Settings → Pages → Source: GitHub Actions*. `publicar.yml` exige la entrada del CHANGELOG de la versión.
