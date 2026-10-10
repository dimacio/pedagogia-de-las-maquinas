# Estructura de 16 clases: plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dejar `main` con el esqueleto de 16 clases (clases 1 y 2 vivas, 3–16 en preparación), la v1 archivada y los chequeos en verde salvo `trazabilidad`, listo para rediseñar una clase por PR.

**Architecture:** `CLASES` de `assets/cueva.js` pasa a 16 entradas con `unidad` y una marca `pronto: true` para las clases en preparación. Los chequeos distinguen clases activas de clases en preparación con un helper nuevo en `comun.py`. El material de la v1 que cambia de id se archiva en `build/v1/` y `specs/v1/`, que no se publican ni se chequean.

**Tech Stack:** HTML/JS estático (sin build), Python 3.11 para los chequeos (`fabrica/chequeos/`), node + playwright para `paginas.js`, `gh` para los issues.

**Spec:** `build/PLAN-16-clases.md` (aprobado por el autor el 2026-10-10). Este plan implementa el §6 y el paso 1 del §8; los pasos 2 y 3 del §8 son un ciclo por clase con las skills del proyecto y no se planifican acá.

## Global Constraints

- Todo en la rama `estructura-16`, un solo PR contra `main`, que cierra el issue de estructura (Task 0).
- Ids: `0a 0b 0c` y `1`…`16`. Unidades: `1` «Fundamentos» (1–4), `2` «Sin mapa» (5–8), `3` «De la red a la política» (9–12), `4` «Lenguaje y agentes» (13–16); nivelación `"N"`.
- Archivos, notebooks y títulos de las clases nuevas: exactamente los de la tabla del §3 del spec.
- Castellano rioplatense neutro, sin emojis (regla 6 de `CLAUDE.md`).
- No se escribe contenido de clases nuevas: los spines 3–16 quedan con encabezado mínimo; el contenido es de `/disenar-clase`.
- No se crean redirecciones ni se etiqueta versión: van en los PR de cada clase y en el cierre.
- En Windows, los chequeos se corren con `PYTHONUTF8=1` (defecto conocido de `correr.py`, fuera de este plan).

## Review Focus

1. Un enlace publicado (índice, difusión, juego, pager, «Requisitos») que apunte a una página archivada o a una clase en preparación: tiene que ser un texto «próximamente», nunca un enlace roto. → Task 3, chequeo `enlaces_internos` y prueba a mano del pager.
2. Una clase en preparación cuyo spine diga `estado: publicada` o tenga entrada en `modulos.js`: el chequeo tiene que fallar, no avisar. → Task 1, pruebas negativas.
3. Una clase activa (sin `pronto`) cuya página falte: tiene que seguir fallando como hoy. → Task 1, prueba negativa.
4. Progreso de la v1 guardado en el navegador que se atribuye a la clase nueva con el mismo id: la clave cambia y el progreso arranca de cero. → Task 2, verificación por grep.
5. El bloque «Cómo se cursa» de la clase 1 sumando horas de clases en preparación como si existieran: las horas cuentan solo clases activas. → Task 3, prueba a mano.

---

### Task 0: Preparación

**Files:** ninguno.

- [ ] **Step 1:** `npm ci` en la raíz (instala playwright para `paginas.js`). Esperado: termina sin error; `node -e "require('playwright')"` no falla.
- [ ] **Step 2:** Crear el issue de estructura con `gh issue create --title "Estructura de 16 clases: esqueleto, archivo de la v1 y chequeos" --label cambio --body` que enlace `build/PLAN-16-clases.md` y este plan. Anotar su número (`#E`).

---

### Task 1: Chequeos para `unidad` y clases en preparación

**Files:**
- Modify: `fabrica/chequeos/comun.py` (después de `clase_por_id`)
- Modify: `fabrica/chequeos/spines.py:9`, `:43-47`, `:50-60`, `:73-75`
- Modify: `fabrica/chequeos/cuestionarios.py:23-31`
- Modify: `fabrica/chequeos/trazabilidad.py:68`, `fabrica/chequeos/citas.py:80`, `fabrica/chequeos/datos_sueltos.py:34`, `fabrica/chequeos/enlaces_internos.py:53-60`

**Interfaces:**
- Produces: `comun.clases_activas() -> list[dict]` (las de `clases()` sin `pronto` verdadero) y `comun.en_preparacion() -> set[str]` (ids con `pronto`). Una entrada de `CLASES` tiene la forma `{id, archivo, titulo, nb, bloque, unidad, pronto?}`.

- [ ] **Step 1: Implementar en `comun.py`** `clases_activas()` y `en_preparacion()`.
- [ ] **Step 2: `spines.py`.**
  - `OBLIGATORIOS` usa `unidad` en lugar de `trimestre`; la validación es `unidad in (1, 2, 3, 4, "N")` e igual a `c["unidad"]`, con los mismos mensajes cambiando la palabra.
  - Si el id está en `en_preparacion()`:
    - `estado` tiene que ser `borrador`; si no, falla con `"{k}: la clase está en preparación (pronto en cueva.js) y su estado es «{estado}»"`;
    - si falta la página o el notebook, es aviso y no falla: `"{k}: en preparación, todavía sin página"`;
    - `objetivos` y `fuentes` pueden ser listas vacías.
  - Para el resto de las clases todo queda como hoy.
- [ ] **Step 3: `cuestionarios.py`.** Recorrer `clases_activas()`. Si una entrada de `modulos.js` tiene un id en preparación, falla: `"[{id}] está en preparación: no lleva entrada en modulos.js hasta /producir-clase"`.
- [ ] **Step 4: los demás chequeos.** `trazabilidad.py`, `citas.py`, `datos_sueltos.py` y el bucle de `CLASES` de `enlaces_internos.py` recorren `clases_activas()`. Además, en `enlaces_internos.py`, una clase en preparación cuyo `archivo` ya existe produce el aviso `"CLASES[{id}]: la página ya existe; quitar pronto"`.
- [ ] **Step 5: correr el chequeo y verificar que falla.**
  - Comando: `PYTHONUTF8=1 python fabrica/chequeos/correr.py --rapido --solo spines,cuestionarios`.
  - Esperado: `spines … FALLA` con `falta el campo `unidad`` en los 15 spines actuales. `CLASES` todavía no se cambió, así que esta es la prueba en rojo.
- [ ] **Step 6: commit.** `git commit -m "Chequeos: unidad y clases en preparación (pronto)"`.

---

### Task 2: Archivo de la v1, `CLASES` de 16 y spines nuevos

**Files:**
- Move (`git mv`):
  - `clases/03-mdp-y-bellman.html` … `clases/12-cierre.html` (10 páginas) → `build/v1/clases/`.
  - `notebooks/03-…ipynb` … `notebooks/11-…ipynb` (9 notebooks) → `build/v1/notebooks/`.
  - `specs/1.md` … `specs/12.md` → `specs/v1/`.
- Create: `specs/1.md` y `specs/2.md`, copias de los de v1 con `trimestre: 1` cambiado por `unidad: 1`.
- Modify: `specs/0a.md`, `specs/0b.md`, `specs/0c.md`: `trimestre: "N"` → `unidad: "N"`.
- Create: `specs/3.md` … `specs/16.md`, uno por clase nueva.
- Create: `build/v1/modulos-v1.js`, con las entradas `"3"` a `"12"` cortadas de `assets/modulos.js` tal cual.
- Modify: `assets/cueva.js:200-216` (`CLASES` y su comentario), `:222` (clave de progreso), `:241` (requisitos), `:367-369` (pager).
- Modify: `assets/modulos.js`: quitar `"3"`…`"12"` y cambiar el comentario de cabecera a «0a, 0b, 0c (nivelación) y 1 … 16; las clases en preparación no tienen entrada».

**Interfaces:**
- Consumes: `clases_activas()` y `en_preparacion()` de la Task 1.
- Produces: `CLASES` con 19 entradas, en el orden 0a, 0b, 0c, 1…16. Las de 3 a 16 llevan `pronto: true`. `bloque` es `"Clase N"`. Las de nivelación tienen `unidad: "N"`.

- [ ] **Step 1: archivar** con `git mv` lo que lista *Files* y cortar las entradas de `modulos.js` a `build/v1/modulos-v1.js`.
- [ ] **Step 2: escribir `CLASES`** a partir de la tabla del §3 del spec. El comentario nuevo dice: `// unidad: "N" = nivelación (optativa, fuera de las 16); 1..4 = unidad de cuatro clases. pronto: clase en preparación (sin página todavía)`.
- [ ] **Step 3: `cueva.js`.**
  - `CLAVE_PROGRESO = "rlac-cuestionarios-v2"`.
  - En «Requisitos», un previo en preparación se muestra como texto sin enlace con el sufijo ` (próximamente)`.
  - En el pager, si la clase anterior o la siguiente está en preparación, se muestra como `<span class="pronto">` con `«Clase N · próximamente»` en lugar de `<a>`.
- [ ] **Step 4: spines 3–16.** Cada uno lleva:
  - encabezado `id`, `titulo` y `pagina`/`notebook` según el §3;
  - `unidad`, `estado: borrador`, `previos: ["<id anterior>"]`, `objetivos: []`, `fuentes: []`;
  - un cuerpo con estas líneas exactas:
    ```
    # Spine — Clase N: <título>

    **Estado:** en preparación. Se diseña con `/disenar-clase N`.

    **Qué entra (de build/PLAN-16-clases.md §3):** <la línea de esa clase>

    **Qué se reutiliza (§4):** <las filas de esa clase>
    ```
- [ ] **Step 5: verificar.**
  - Comando: `PYTHONUTF8=1 python fabrica/chequeos/correr.py --rapido --solo spines,cuestionarios,citas,datos_sueltos`.
  - Esperado: `spines` AVISO (14 «en preparación, todavía sin página», 19 de 19 spines), `cuestionarios` OK (5 clases), `citas` OK y `datos_sueltos` sin fallas.
- [ ] **Step 6: pruebas negativas.** Hacer cada cambio, correr `--solo spines,cuestionarios` y deshacer con `git checkout -- <archivo>`:
  - (a) `estado: publicada` en `specs/5.md` → `spines` FALLA con «está en preparación»;
  - (b) una entrada `"5": {}` en `modulos.js` → `cuestionarios` FALLA con «está en preparación»;
  - (c) borrar `pronto` de la clase 5 en `CLASES` → `spines` FALLA con «pagina … no existe».
- [ ] **Step 7: progreso.** `grep -n "rlac-cuestionarios" -r assets clases index.html juego` → solo aparece `rlac-cuestionarios-v2`.
- [ ] **Step 8: commit.** `git commit -m "Estructura de 16 clases: CLASES, spines en borrador y archivo de la v1"`.

---

### Task 3: Sitio: índice, clase 1, difusión y juego

**Files:**
- Modify: `index.html:7` (descripción), `:83` (texto del recorrido), `:128-132` (grupos y `DESC`).
- Modify: `clases/01-introduccion.html:189` (título del bloque), `:490-505` (grupos y textos de `capVia`).
- Modify: `difusion/estrategia.html` (enlaces a páginas archivadas).
- Modify: las páginas de `juego/` que `enlaces_internos` marque.

- [ ] **Step 1: correr `enlaces_internos` y verificar que falla.**
  - Comando: `PYTHONUTF8=1 python fabrica/chequeos/correr.py --rapido --solo enlaces_internos`.
  - Esperado: FALLA. Hay que anotar cada enlace roto.
- [ ] **Step 2: `index.html`.**
  - Descripción y línea 83: «dieciséis clases en cuatro unidades, una por semana: un cuatrimestre».
  - Grupos: `Unidad 1 · Fundamentos` … `Unidad 4 · Lenguaje y agentes`, filtrando por `unidad`.
  - Una clase con `pronto` se muestra como `<div class="clase pronto">`, sin enlace, con «próximamente».
  - `DESC` lleva una línea por cada id del 1 al 16, sacada de «Qué entra» del §3 del spec y de no más de 12 palabras.
- [ ] **Step 3: clase 1.**
  - El título del bloque pasa a «Dieciséis clases, cuatro unidades, dos vías».
  - Los grupos usan `unidad`, con los mismos nombres que en el índice.
  - Las clases con `pronto` se muestran sin enlace y no suman horas.
  - `capVia`: «en el cuatrimestre» en lugar de «en el año», y se borra «o una cada tres semanas si se cursa por trimestres».
- [ ] **Step 4: `difusion/estrategia.html` y `juego/`.** Cada enlace a una página archivada apunta a `../index.html#clases`. Los posts de difusión (`difusion/posts/src/`) no se tocan: son del PR de la clase 16.
- [ ] **Step 5: verificar enlaces y páginas.**
  - Comando: `PYTHONUTF8=1 python fabrica/chequeos/correr.py --rapido --solo enlaces_internos,paginas`.
  - Esperado: las dos OK.
- [ ] **Step 6: prueba a mano.**
  - Levantar `python -m http.server 8765` y abrir tres páginas a 1200 px y a 400 px:
    - `index.html`: 4 unidades, con las clases 3–16 en «próximamente»;
    - `clases/02-que-es-rl.html`: el pager muestra «Clase 3 · próximamente» sin enlace;
    - `clases/01-introduccion.html`: «Cómo se cursa» suma solo las clases 1 y 2.
  - Hay que mirar las capturas de `fabrica/reportes/capturas/`.
- [ ] **Step 7: commit.** `git commit -m "Sitio: índice y clase 1 con 16 clases y unidades"`.

---

### Task 4: Documentación y registro

**Files:**
- Modify:
  - `README.md`: «Cómo se cursa», «Recorrido», «Por dónde empezar» y la nota de unidades;
  - `CLAUDE.md`: línea de ids, «`1`…`16`. Tabla completa en `build/PLAN-16-clases.md`»;
  - `fabrica/CONVENCIONES.md` §1: ejemplo con `unidad: 3` y ids «`1.md` … `16.md`», y una línea sobre `pronto` y `specs/v1/`;
  - `build/PLAN-16-clases.md` §8 paso 1: «Las páginas y notebooks viejos se mueven a `build/v1/`; el resto de los builders queda en `build/`», más la marca `pronto`;
  - `CHANGELOG.md` → «Sin publicar».
- Modify, primera línea: `build/PLAN-12-clases.md` y `build/ESTRUCTURA.md` → `> **Histórico.** Reemplazado por build/PLAN-16-clases.md.`

- [ ] **Step 1: README.**
  - El recorrido son las 16 filas del §3, con las clases en preparación marcadas «(en preparación)».
  - «Cómo se cursa»: dieciséis clases en cuatro unidades, una por semana, unas **16 semanas**.
  - Se borra la frase «T1 clases 1–3…».
- [ ] **Step 2: `CLAUDE.md`, `CONVENCIONES.md` y la marca de histórico** en `PLAN-12-clases.md` y `ESTRUCTURA.md`.
- [ ] **Step 3: sincronizar el §8 del spec.**
- [ ] **Step 4: CHANGELOG.**
  - Bajo «### Cambiado»: «Estructura de 16 clases en cuatro unidades (`build/PLAN-16-clases.md`); clases 3–16 en preparación; material de la v1 en `build/v1/` y `specs/v1/`».
  - Bajo «### Aviso»: «El progreso de los cuestionarios guardado en el navegador vuelve a cero (los ids cambian de significado)».
- [ ] **Step 5: verificar.**
  - Comando: `grep -rn "trimestre\|doce clases\|12 clases\|1…12\|1 … 12" --include=*.md --include=*.html --include=*.js . | grep -v "^./build/\|^./specs/v1/\|^./CHANGELOG\|^./difusion/\|node_modules"`.
  - Esperado: sin resultados. Además, `--solo changelog` debe dar OK.
- [ ] **Step 6: commit.** `git commit -m "Documentación de la estructura de 16 clases"`.

---

### Task 5: Issues por clase, PR y CI

- [ ] **Step 1: chequeos completos.**
  - Comando: `PYTHONUTF8=1 python fabrica/chequeos/correr.py --rapido --reporte fabrica/reportes/reporte.md`.
  - Esperado: solo `trazabilidad` en FALLA; `notebooks` puede fallar en local por el kernel, pero tiene que pasar en el CI.
- [ ] **Step 2: issues de clase.** Crear 16 issues con la plantilla *clase nueva*, label `clase-nueva` (crearla si no existe).
  - Título: `[Clase N] <título del §3>`.
  - Cuerpo: unidad, Stanford de referencia, qué entra, qué se reutiliza y los issues relacionados del §7 del spec.
- [ ] **Step 3: push y PR.**
  - `git push`, y después `gh pr create` con la plantilla del repo.
  - El PR dice `Issue: #E` y `Closes #E`, pega el reporte de chequeos y lista los 16 issues.
- [ ] **Step 4: CI.**
  - Comando: `gh run watch` sobre el run de `calidad` del PR.
  - Esperado: 9 de 10 sin fallas, con `trazabilidad` como única falla.
