---
name: producir-clase
description: Producir página, notebook y cuestionario de una clase a partir de su spine aprobado, con los agentes del proyecto y los chequeos de calidad. Usar después de /disenar-clase.
disable-model-invocation: true
argument-hint: "<id de clase>"
---
Producís la clase `$ARGUMENTS` desde `specs/$ARGUMENTS.md` (tiene que estar en estado en-produccion y aprobado por el autor).

1. Rama `clase-<id>` (o seguí en la de diseño). Leé `CLAUDE.md` y el spine.
2. Delegá en este orden, pasando el id y la ruta del spine:
   a. `redactor-notebook` (primero, porque la página cita sus cifras).
   b. `redactor-pagina`, con el informe del notebook (cifras y figuras).
   c. `autor-cuestionario`.
3. Corré `python fabrica/chequeos/correr.py --rapido --reporte fabrica/reportes/reporte.md`. Si algo falla, devolvéselo al agente que corresponde; como mucho 2 vueltas, después preguntá al autor.
4. Delegá en `revisor`. Si el veredicto es CAMBIOS, aplicá los bloqueantes e importantes con el agente que corresponde y volvé a revisar (máximo 2 vueltas).
5. En el mismo PR, quitá `pronto: true` de la clase en `CLASES` (`assets/cueva.js`): la página ya existe. Si la clase reemplaza páginas de la v1
   (`build/PLAN-16-clases.md` §6), agregá sus redirecciones. Commit por artefacto con mensajes claros. Abrí el PR con la plantilla: resumen, informe del revisor, reporte de chequeos, capturas a 400 px.
6. Pasá el spine a `estado: publicada` recién cuando el autor apruebe el PR.
