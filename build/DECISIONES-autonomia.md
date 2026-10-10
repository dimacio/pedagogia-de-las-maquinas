# Decisiones tomadas en modo autónomo (clases 3–16)

El 2026-10-10 el autor delegó producir las clases 3 a 16 sin aprobación por clase y probar después el curso como alumno cero.
Reglas: ciclo completo por clase (spine → notebook → página → cuestionario → revisor → CI); merge a `main` cuando el revisor aprueba
(nada se publica hasta `v2.0.0`); ante una decisión que sería del autor, la opción más conservadora dentro de `build/PLAN-16-clases.md`,
anotada acá. Nada externo ni irreversible: sin publicar, sin Pages, sin borrar en GitHub, sin cambiar el marco filosófico.

Formato: `fecha · clase · decisión — por qué — qué cuesta si está mal`.

## Registro

- 2026-10-10 · general · El autor eligió: mergear yo cada clase cuando el revisor aprueba, y ante decisiones suyas decidir lo más conservador dentro del plan y registrarlo acá.
- 2026-10-10 · 3 · Spine de la clase 3 escrito sin aprobación explícita del texto final (el autor aprobó la propuesta con «dale») — consistente con el pedido — ninguno.
- 2026-10-10 · general · Coma decimal en el texto de las páginas y cuestionarios (castellano rioplatense; así están la clase 1 y la 3). La clase 2 usa punto: se unifica en la pasada de alumno cero — es una convención de estilo que CLAUDE.md no fija — cuesta cambiar cifras de una clase.
- 2026-10-10 · 3 · B5 muestra caminatas simuladas en el navegador (otra semilla) cuyo promedio puede diferir del V(S) del notebook dentro del error; quedan rotuladas como simuladas y el texto cita la cifra del notebook — regla 5 — si confunde, se lanzan más caminatas al cargar.
- 2026-10-10 · 3 · Revisor: CAMBIOS menores (convención del retorno en B3, el feed como dos MRP en B4); aplicados por el orquestador y aprobados según la indicación del revisor, sin segunda vuelta completa — los dos arreglos eran de una oración — si quedó algo, lo encuentra la pasada de alumno cero.
- 2026-10-10 · 4 · Spine de la clase 4 escrito por el orquestador (PLAN §3 + CS234 L2): se dejan afuera la demostración de contracción y el horizonte finito de CS234 L2; el tutor como MDP queda como una línea en B8 (ya se planteó en la clase 2) — PLAN pide menos ideas por tema — si el autor quiere el tutor como bloque, se agrega.
- 2026-10-10 · general · Los builders v1 (`build_nb03`…`build_nb11` y auxiliares de las clases 7 y 10) se copian a `build/v1/builders/` antes de reescribir cada builder con su clase nueva — sus contenidos se reutilizan en clases posteriores — ninguno.
- 2026-10-10 · 4 · El revisor propuso partir B7 (slip, costo por paso y γ en un bloque): se parte en B7 «Piso resbaloso» y B8 «Costo por paso y γ»; el robot pasa a B9 y Para enseñarlo a B10 — regla 2 de CLAUDE.md (no comprimir) — la página crece un bloque (~40 min se mantiene).
- 2026-10-10 · 5 · Spine de la clase 5 escrito por el orquestador (PLAN §3 + CS234 L3): se agrega B5 sobre el error de TD y la dopamina para cumplir lo que anuncia la clase 1 («en la clase 5 vas a ver…», Schultz et al. 1997) y B7 de equivalencia de certeza (CS234 L3); TD(λ) queda afuera — compromiso ya publicado en la clase 1 — si el autor prefiere, el recuadro de dopamina pasa a otra clase y se corrige la clase 1.
- 2026-10-10 · 5 · Se evalúa «flechas óptimas con ε = 0,7» y no el dado de la clase 3 (con el dado la mediana es de 1036 pasos y el desvío de G triplica V(S)); inicio al azar en cada partida; en esta cueva MC con 1/n le gana a TD y la página lo dice así, sin forzar el «TD gana» de libro — reglas 5 y 7 — si se prefiere el dado, hay que rehacer las cifras.
- 2026-10-10 · 6 · Spine de la clase 6 escrito por el orquestador (PLAN §3 + CS234 L4 primera mitad): Monte Carlo de control y GLIE quedan como mención — PLAN pide menos ideas por tema — ninguno.
- 2026-10-10 · 7 · Spine de la clase 7 escrito por el orquestador (PLAN §3 + CS234 L9–L12): Thompson como mención, regret sin cotas, PAC/PSRL afuera; B7 con Machado et al. (2018) por pedido del autor (issue #15) — PLAN pide menos ideas — ninguno.
- 2026-10-10 · 7 · La carrera de exploradores usa la cueva grande de la v1 (13×25) porque en la cueva de siempre ε-greedy llega; el conteo solo falla en una tabla y se presenta como lección (spine ajustado) — honestidad sobre el resultado — si se prefiere la cueva de siempre, hay que rehacer la sección.
- 2026-10-10 · 9 · Clase 9 producida en un worktree y mergeada antes que la 8 (la 8 tarda por su notebook con torch); el orden de entradas en modulos.js y CHANGELOG se acomoda al mergear la 8 — ahorra tiempo — ninguno funcional.
- 2026-10-10 · 9 · Diferido: el olvido medido con el gradiente quedó en B5 (spine: B3); B5 junta escala, olvido y atención — sugerencia del revisor, no bloquea — revisar en la pasada de alumno cero.
- 2026-10-10 · 10 · Spine de la clase 10 escrito por el orquestador (PLAN §3 + CS224R 02 y 07 + CS234 L7); issue #5 asignado a la clase 15 — ver arriba — ninguno.
- 2026-10-10 · 11 · Spine de la clase 11 escrito por el orquestador (PLAN §3 + CS234 L5–L6 + CS224R 03–05); ajustado al notebook: la línea de base baja el temblor ~5 veces y su ventaja es admitir pasos más grandes, no aprender antes; el recorte de PPO actúa al reusar el lote — reglas 5 y 7 — ninguno.
- 2026-10-10 · 8 · Spine de la clase 8 escrito por el orquestador (PLAN §3 + CS234 L4 segunda mitad + CS224R 06), con B7 sobre comparar agentes de forma justa (Machado et al. 2018, issue #16); la clase 8 se produce en paralelo en un worktree mientras se termina la 7 — ahorra tiempo — puede haber conflictos chicos en CHANGELOG y cueva.js al mergear.
