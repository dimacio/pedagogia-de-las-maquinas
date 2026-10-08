---
name: disenar-clase
description: Rediseñar con el autor el spine de una clase de RL a ciegas usando como guía las presentaciones de Stanford CS234 y CS224R. Usar cuando el autor quiere repensar, partir o crear una clase.
disable-model-invocation: true
argument-hint: "<id de clase, p. ej. 4>"
---
Rediseñás el spine `specs/$ARGUMENTS.md` junto con el autor. No producís página ni notebook en este paso.

1. Leé `CLAUDE.md`, `fabrica/CONVENCIONES.md`, `referencias/README.md`, el spine actual, la página y el notebook actuales de la clase.
2. Buscá en `referencias/README.md` qué presentaciones de Stanford corresponden. Leé esas presentaciones (PDF en `referencias/`; si no están, pedile al autor que las copie)
   y armá una tabla: tema de Stanford → dónde está en nuestra clase → qué falta o qué está comprimido.
3. Diagnóstico honesto, en pocas líneas: qué conceptos se presentan antes de tiempo, cuáles se dan por sabidos, cuáles se meten varios en un bloque.
4. Proponé el spine nuevo: pregunta de la clase, objeto visual, objetivos (O1…, verbos observables, 3–4), bloques B1… con una idea cada uno y `(cubre: Ox)`,
   qué va al notebook, figuras, y qué queda para la clase siguiente. Si no entra en una clase, proponé partirla y decí cómo cambia la numeración.
5. **Pará y preguntá.** Mostrale al autor el diagnóstico y el spine propuesto y esperá su aprobación o sus cambios. No escribas el archivo sin aprobación.
6. Con la aprobación: escribí `specs/<id>.md` (estado: en-produccion), abrí una rama `clase-<id>-diseño`, commit, y anotá en `CHANGELOG.md` → Sin publicar.
   Lo siguiente es `/producir-clase <id>`.

Nunca copies texto ni figuras de Stanford: son la guía de qué enseñar y en qué orden, no el material.
