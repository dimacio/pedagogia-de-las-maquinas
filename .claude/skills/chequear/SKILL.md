---
name: chequear
description: Correr el control de calidad automático del curso e interpretar el reporte. Usar antes de un commit o PR de contenido, o cuando el CI falla.
argument-hint: "[--solo chequeo1,chequeo2]"
---
1. Si no corre el servidor local no hace falta: los chequeos levantan uno propio.
2. Corré `python fabrica/chequeos/correr.py --rapido $ARGUMENTS --reporte fabrica/reportes/reporte.md`.
3. Resumí: qué pasó, qué falló y por qué (archivo y línea), qué son solo advertencias. Para cada falla, proponé la corrección mínima y a qué agente le corresponde.
4. Si falla `trazabilidad`, mostrá la fila de la matriz del objetivo sin cubrir (`fabrica/reportes/trazabilidad.html`).
