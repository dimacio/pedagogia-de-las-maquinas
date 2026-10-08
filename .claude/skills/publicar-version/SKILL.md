---
name: publicar-version
description: Cerrar una versión del curso: CHANGELOG, número de versión, etiqueta y publicación en GitHub Pages. Usar cuando el autor decide publicar lo que está en main.
disable-model-invocation: true
argument-hint: "<mayor|menor|parche>"
---
1. Verificá que estás en `main` actualizado y que `python fabrica/chequeos/correr.py --rapido` pasa.
2. Calculá la versión nueva según `fabrica/CONVENCIONES.md` §4 y el tipo pedido ($ARGUMENTS).
3. En `CHANGELOG.md`, mové "Sin publicar" a una sección `## [x.y.z] — AAAA-MM-DD`. Mostrásela al autor y esperá su OK.
4. Commit "Versión x.y.z", tag `vx.y.z`, push del tag. El workflow `publicar.yml` publica en Pages y crea el release.
