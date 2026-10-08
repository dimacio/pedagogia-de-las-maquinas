---
name: revisar-clase
description: Pedir una revisión independiente de una clase con el agente revisor y resumir qué hay que cambiar. Usar cuando el autor quiere saber si una clase está bien dada.
argument-hint: "<id de clase>"
---
Delegá en el agente `revisor` la clase `$ARGUMENTS`. Devolvé al autor: la tabla de puntajes, los problemas bloqueantes e importantes
(con archivo y lugar) y el veredicto. No corrijas nada en este paso; si el autor quiere, seguí con `/disenar-clase` o `/producir-clase`.
