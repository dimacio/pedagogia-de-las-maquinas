# Cómo se trabaja en este curso

## El ciclo de un cambio

1. **Issue.** Todo empieza en un issue: *pedido de cambio*, *defecto* o *clase nueva* (plantillas en `.github/ISSUE_TEMPLATE/`).
2. **Diseño.** Si toca qué se enseña, primero se cambia el spine (`specs/<id>.md`) con `/disenar-clase <id>` y el autor lo aprueba.
3. **Producción.** En una rama `clase-<id>`, `/producir-clase <id>` hace notebook → página → cuestionario con los agentes de `.claude/agents/`.
4. **Control.** `python fabrica/chequeos/correr.py --rapido` en local; el mismo control corre en cada PR (`.github/workflows/calidad.yml`).
5. **Revisión.** El agente `revisor` deja su informe en el PR; el autor revisa y aprueba. Nada entra a `main` sin las dos cosas.
6. **Registro.** Entrada en `CHANGELOG.md` → «Sin publicar».
7. **Publicación.** `/publicar-version <mayor|menor|parche>` cierra la versión, etiqueta y `publicar.yml` publica en GitHub Pages.

Cada defecto corregido agrega, si se puede, un chequeo o una prueba que lo habría detectado, para que no vuelva.

## Mantenimiento automático

`semanal.yml` corre todo (incluidos los notebooks con LLM y los enlaces externos) y abre un issue si algo se rompió.

## Reglas de contenido

Están en `CLAUDE.md` (sección «Reglas de contenido») y valen igual para personas y agentes.
