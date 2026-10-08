# RL a ciegas — instrucciones para Claude

MOOC libre de aprendizaje por refuerzo en castellano, contado desde un juego (la cueva a ciegas). Sitio estático para GitHub Pages
+ notebooks de Colab. Autor: Dimas Torres. Este archivo es lo primero que leés en cada sesión.

## Cómo trabajamos

- **El autor piensa las clases; los agentes producen; nada entra a `main` sin pasar los chequeos y la revisión del autor.**
- Antes de hacer cualquier cosa que no sea trivial: proponé un plan corto y preguntá. Respuestas concisas, sin imitar su forma de hablar.
- Una clase por vez. Un cambio = un issue = una rama = un pull request. No mezclar clases en un mismo PR.
- Si algo del pedido es ambiguo o contradice el spine, preguntá antes de producir.

## Mapa del repositorio

| Ruta | Qué es | Quién lo escribe |
|---|---|---|
| `specs/<id>.md` | **Spine** de cada clase: objetivos, bloques, fuentes. Fuente de verdad. | El autor (los agentes proponen cambios, no los aplican solos) |
| `clases/*.html` | Página interactiva de cada clase | agente `redactor-pagina` |
| `notebooks/*.ipynb` + `build/build_nbXX.py` | Notebook de cada clase y su generador | agente `redactor-notebook` (se edita el builder, no el .ipynb) |
| `assets/modulos.js` | Objetivos, tiempos, cuestionario y actividad de cada clase | agente `autor-cuestionario` |
| `assets/cueva.js`, `assets/estilo.css` | Motor común y estilo. Cambios con cuidado: afectan a todas las clases | cualquiera, con PR propio |
| `difusion/` | Estrategia y posts | agente `difusion` |
| `fabrica/CONVENCIONES.md` | Contrato entre spines, artefactos y chequeos | el autor |
| `fabrica/chequeos/` | Control de calidad automático | — |
| `referencias/` | Guías externas (presentaciones de Stanford CS234 y CS224R). **Los PDF no se suben al repo.** | — |

Ids de clase: `0a 0b 0c` (nivelación) y `1`…`12`. Tabla completa en `build/PLAN-12-clases.md` y en `CLASES` de `assets/cueva.js`.

## Reglas de contenido (no negociables)

1. **Ver y después leer.** Cada idea entra como figura interactiva, después nombre, al final fórmula. Una idea por bloque.
2. **No comprimir.** Si un bloque necesita más de 4 oraciones o más de una fórmula, son dos bloques. Si una clase no entra, se parte.
3. **La cueva es el hilo.** Todas las figuras reutilizan el motor (`Cueva.tablero`, mapa de calor de V, flechas, trayecto).
4. **Nada copiado.** Ni texto de Sutton y Barto, CS234, CS224R ni papers. Se parafrasea y se cita (`Cueva.pagina(id, {lecturas})`).
5. **Cifras con origen.** Todo número de la página sale del notebook de la clase o de una fuente citada.
6. **Castellano rioplatense neutro**, términos técnicos en inglés entre paréntesis la primera vez. Sin emojis.
7. **Honestidad sobre los modelos chicos**: si Qwen 0.5B lo hace mal, se dice y se usa como lección.
8. **Trazabilidad**: marcas de objetivos según `fabrica/CONVENCIONES.md` §2 en página, notebook y cuestionario.

## Definición de terminado (para cualquier PR de contenido)

- `python fabrica/chequeos/correr.py --rapido` pasa (o el PR explica por qué un chequeo queda en rojo).
- El agente `revisor` revisó la clase contra su spine y su informe está en el PR.
- Capturas a 1200 y 400 px revisadas a ojo.
- `CHANGELOG.md` tiene la entrada en "Sin publicar".
- El autor aprobó el PR.

## Comandos

- Chequeos rápidos: `python fabrica/chequeos/correr.py --rapido --reporte fabrica/reportes/reporte.md`
- Solo algunos: `--solo trazabilidad,cuestionarios`
- Servidor local: `python3 -m http.server 8765` en la raíz.
- Regenerar un notebook: `python build/build_nbXX.py && jupyter nbconvert --to notebook --execute --inplace notebooks/XX-....ipynb`

## Skills del proyecto

- `/disenar-clase <id>`: con el autor, rediseñar el spine de una clase usando como guía las presentaciones de Stanford.
- `/producir-clase <id>`: del spine aprobado a página, notebook y cuestionario, con los agentes.
- `/revisar-clase <id>`: revisión independiente contra spine, fuentes y reglas.
- `/chequear`: correr el control de calidad e interpretar el reporte.
- `/publicar-version`: cerrar el CHANGELOG, etiquetar y publicar.
