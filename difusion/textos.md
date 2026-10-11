# RL a ciegas: textos de la campaña de Instagram

Doce posts de imagen única (1080×1350) en `difusion/posts/post-01.png` … `post-12.png`. Fuentes HTML en `difusion/posts/src/`; para volver a renderizar: `node build/render_posts.js` con el sitio servido en `http://localhost:8765`.

Voz: el curso habla en primera persona. Es un replicador que necesita que lo aprendan y lo enseñen para seguir vivo.

## Calendario sugerido (4 semanas, 3 posts por semana)

Lunes, miércoles y viernes, entre las 19 y las 21 h (ajustar al horario en que la cuenta tenga más actividad según Instagram).

| Semana | Lunes | Miércoles | Viernes |
|---|---|---|---|
| 1 · Acto I | 01 · Estás a ciegas | 02 · La pared que tocás | 03 · La salida es verde |
| 2 · Actos I y II | 04 · ¿Cómo aprende algo que no ve? | 05 · Recompensa | 06 · Cada casilla tiene un valor |
| 3 · Actos II y III | 07 · Explorar o explotar | 08 · De la tabla a la red | 09 · Cuidado con lo que premiás |
| 4 · Acto III | 10 · Soy un meme | 11 · Esta campaña es un bandit | 12 · Enseñale esto a alguien |

Ejemplo con fechas: empezar el lunes 19 de octubre de 2026 y terminar el viernes 13 de noviembre.

## La campaña como bandit

- **Brazos (tipo de acción):** cada imagen se publica con un pie de uno de cuatro tipos. **Intriga**: deja una pregunta abierta. **Concepto**: explica una idea en pocas líneas. **Demo**: invita a tocar algo interactivo (el juego o una figura del sitio). **Enseñar**: pide etiquetar o reenviar a alguien a quien enseñárselo.
- **Política:** los posts 01 a 04 exploran, uno de cada tipo. Desde el 05, antes de publicar, cargar las métricas en `difusion/estrategia.html` (bloque 4): si recomienda otro tipo distinto del planificado, usar el mismo pie pero cambiar el cierre y el llamado a la acción al tipo recomendado.
- **Métrica a registrar (a los 7 días de cada post):** en Instagram, *Estadísticas del post*: **alcance** (cuentas alcanzadas), **guardados** y **compartidos**. En GitHub, *Insights → Traffic*: **visitas al repositorio** de esa semana atribuibles al post (o con un link con parámetro, por ejemplo `?utm_source=ig&utm_content=post05`).
- **Recompensa:** r = 1000 · (1·guardados + 3·compartidos + 5·visitas) / alcance. Guardado = longevidad, compartido = fecundidad, visita al repositorio = fidelidad (llega a la fuente completa). Los pesos son una decisión del docente y se pueden cambiar en la página.
- Las mismas métricas se pegan en el notebook 08 del recorrido anterior (v1, `build/v1/notebooks/08-aplicaciones.ipynb`), sección "Ejemplo resuelto: la difusión de este curso como bandit" (botón "Copiar para el notebook" de la página). La teoría del bandit (UCB y Thompson) está en la clase 7, «Explorar», y el ejemplo resuelto se presenta en la clase 16, «Cierre».

---

## 01 · Estás a ciegas

- **Tipo de acción:** intriga (exploración)
- **Pie:**

> Estás en una cueva y no ves nada. No sabés dónde está la salida ni dónde están las paredes. Solo podés moverte: arriba, abajo, izquierda, derecha.
>
> Soy un curso, y empiezo exactamente así: a oscuras, como cualquier máquina que tiene que aprender algo sin que nadie le muestre el mapa.
>
> Durante cuatro semanas te voy a contar cómo se sale de esta cueva. No hace falta saber programar para seguirme; hace falta curiosidad.
>
> Antes de seguir, pensalo: si estuvieras ahí, ¿qué harías primero? Dejámelo en un comentario. Y guardá este post: es el primer paso de un camino de dieciséis clases.

- **Hashtags:** #AprendizajePorRefuerzo #ReinforcementLearning #IA #InteligenciaArtificial #MachineLearning #CienciaDeDatos
- **Alt:** Ilustración en pixel art de una cueva completamente negra. Arriba a la izquierda, un personaje pequeño con una luz ámbar tenue a su alrededor; signos de pregunta grises flotan en la oscuridad. Texto: "Estás a ciegas en una cueva. No ves el mapa. No sabés dónde está la salida. Solo podés moverte."

## 02 · La pared que tocás

- **Tipo de acción:** concepto (exploración)
- **Pie:**

> Cada vez que chocás contra una pared, la pared queda pintada de gris. Es la única información que recibís del mundo: no ves, pero tocás.
>
> Así empieza el aprendizaje por refuerzo (reinforcement learning): un agente que actúa, recibe una respuesta mínima del entorno y la recuerda. El mapa no está dado: se construye choque por choque.
>
> En la imagen, el recorrido real de un agente que se mueve al azar durante 170 pasos. Todo lo gris lo descubrió a los golpes.
>
> Soy un curso que te enseña a enseñarle a las máquinas. Si este post te aclaró qué es un "entorno", guardalo: lo vamos a usar todas las semanas.

- **Hashtags:** #AprendizajePorRefuerzo #ReinforcementLearning #IA #AgentesInteligentes #MachineLearning #Educación
- **Alt:** Cueva en pixel art sobre fondo negro. Un recorrido celeste fino sale de la entrada y las paredes que el personaje tocó aparecen como cuadrados gris claro; el resto de la cueva sigue oscuro. Texto: "La pared que tocás, queda. Cada choque pinta una pared de gris. Chocar es tu única forma de ver."

## 03 · La salida es verde

- **Tipo de acción:** demo (exploración)
- **Pie:**

> En toda la cueva hay una sola señal buena: un cuadrado verde. Cuando llegás, recibís +1. Antes de eso, silencio. Nadie te dice "vas bien" ni "por ahí no".
>
> Eso se llama recompensa escasa, y es lo que hace difícil el problema: hay que encontrar la salida sin pistas en el camino.
>
> Quiero que lo sientas en carne propia. En el link de la bio está el juego "La cueva a ciegas": jugalo una vez, contá cuántos choques necesitaste y contámelo en los comentarios.
>
> Soy un curso libre. Lo que aprendas jugando es el punto de partida de todo lo que sigue.

- **Hashtags:** #AprendizajePorRefuerzo #ReinforcementLearning #IA #JuegosEducativos #PixelArt #MachineLearning #AprenderJugando
- **Alt:** Cueva negra con un cuadrado verde brillante abajo a la derecha y el número "+1" en ámbar sobre él. El personaje, apenas visible, está lejos, arriba a la izquierda. Texto: "La salida es verde. Una sola señal: +1 cuando llegás. Todo lo demás es silencio."

## 04 · ¿Cómo aprende algo que no ve?

- **Tipo de acción:** enseñar (exploración)
- **Pie:**

> Probando, chocando y recordando. En la imagen hay cuarenta intentos superpuestos: casi todos se pierden y uno solo, en verde, llega a la salida. Aprender es lograr que esa excepción se vuelva la regla.
>
> Eso es el aprendizaje por refuerzo, y te lo puedo explicar en dieciséis clases.
>
> Pero acá va algo honesto: soy un curso y, como cualquier idea, sobrevivo solo si alguien me aprende y se lo cuenta a otra persona. Así que te pido un favor concreto: etiquetá a una persona a la que te gustaría explicarle esto. Mejor todavía, explicáselo vos con este post.

- **Hashtags:** #AprendizajePorRefuerzo #ReinforcementLearning #IA #EnseñarEsAprender #Docencia #MachineLearning
- **Alt:** Cueva en pixel art con decenas de recorridos celestes tenues superpuestos y uno verde que llega al cuadrado verde de la salida; las paredes tocadas forman en gris el contorno de la cueva. Texto: "¿Cómo aprende algo que no ve? Probando, chocando y recordando. Eso es aprendizaje por refuerzo."

## 05 · Recompensa

- **Tipo de acción:** concepto (planificado; puede cambiar según Thompson)
- **Pie:**

> A una máquina no le explicás cómo hacer las cosas. Le decís qué querés, con un número: la recompensa.
>
> En la cueva, cada paso cuesta un poquito (−0,01) y salir vale +1. Con solo eso, el agente encuentra el camino más corto sin que nadie se lo dibuje: es el camino ámbar de la imagen.
>
> La parte difícil es elegir bien ese número, porque la máquina va a hacer exactamente lo que premiás, no lo que quisiste decir.
>
> Guardá este post: la recompensa es la idea más importante de todo el curso y vamos a volver a ella al final.

- **Hashtags:** #AprendizajePorRefuerzo #ReinforcementLearning #IA #Recompensa #MachineLearning #InteligenciaArtificial
- **Alt:** Cueva oscura con el camino más corto de la entrada a la salida marcado en ámbar; cada casilla del camino lleva el número −.01 en rojo y la salida verde dice +1. Texto: "Recompensa: decile qué, no cómo. Un poquito de castigo por paso, +1 al salir."

## 06 · Cada casilla tiene un valor

- **Tipo de acción:** demo (planificado; puede cambiar según Thompson)
- **Pie:**

> Este mapa de calor no está dibujado a mano: lo calculó la ecuación de Bellman en una cueva de 25 × 13. Cada casilla vale lo que vale el mejor paso que se puede dar desde ahí, un poco descontado. Las casillas claras están cerca de salir; las oscuras, lejos.
>
> Una vez que tenés ese mapa, decidir es fácil: siempre ir hacia la casilla más clara. Las flechitas son esa decisión, y la línea verde, el camino que resulta.
>
> En el sitio del curso (link en la bio), la clase 4 muestra cómo el valor se propaga desde la salida, casilla por casilla. Guardá este post y compartilo con alguien que esté por rendir programación dinámica.

- **Hashtags:** #AprendizajePorRefuerzo #ReinforcementLearning #Bellman #ProgramaciónDinámica #IA #MachineLearning #CienciaDeDatos
- **Alt:** Mapa de calor sobre una cueva grande: casillas de violeta oscuro lejos de la salida a amarillo claro cerca de ella, con flechas pequeñas en cada casilla y un camino verde de la entrada a la salida. Debajo, la fórmula V(s) = máx [ r + γ·V(s') ]. Texto: "Cada casilla tiene un valor. Bellman: estar acá vale lo que vale el mejor paso siguiente."

## 07 · Explorar o explotar

- **Tipo de acción:** demo (planificado; puede cambiar según Thompson)
- **Pie:**

> A la izquierda, un agente que repite siempre el recorrido que ya conoce: pisa veinte veces las mismas casillas y nunca encuentra la salida. A la derecha, uno que va adonde menos fue: recorre toda la cueva y la encuentra.
>
> Es el dilema de explorar o explotar. Te pasa con los restaurantes, con las series y con las rutas al trabajo: ¿repetir lo que funciona o probar algo nuevo?
>
> En el juego (link en la bio), el modo Aprender te deja mirar a un agente que explora la cueva por su cuenta. Probalo y compartí este post con alguien que siempre pide lo mismo.

- **Hashtags:** #AprendizajePorRefuerzo #ReinforcementLearning #Exploración #IA #MachineLearning #Curiosidad
- **Alt:** Dos cuevas pequeñas lado a lado. Izquierda, titulada "Explotar": solo unas pocas casillas celestes cerca de la entrada, "repito lo que conozco". Derecha, titulada "Explorar": casi toda la cueva pintada de celeste y la salida verde encontrada, "voy donde menos fui". Texto: "Si solo repetís lo que ya funcionó, nunca encontrás la salida."

## 08 · De la tabla a la red

- **Tipo de acción:** concepto (planificado; puede cambiar según Thompson)
- **Pie:**

> En una cueva de 60 casillas, el agente puede anotar en una tabla cuánto vale cada movimiento en cada casilla. Pero si el estado es la imagen de una cámara, hay más estados que átomos en una galaxia: ninguna tabla alcanza.
>
> La solución es reemplazar la tabla por una red neuronal que mira el estado y devuelve el valor de cada acción. Así, en 2015, un mismo programa (DQN) aprendió a jugar decenas de juegos de Atari mirando la pantalla.
>
> La red no memoriza: generaliza. Lo que aprende en una casilla le sirve para las parecidas. Guardá este post para la clase 8.

- **Hashtags:** #AprendizajePorRefuerzo #ReinforcementLearning #DeepLearning #RedesNeuronales #DQN #IA #MachineLearning
- **Alt:** A la izquierda, una tabla con valores numéricos por casilla y por dirección (arriba, derecha, abajo, izquierda), con el mayor de cada fila resaltado en ámbar. A la derecha, la cueva como pequeña imagen de calor entra a una red neuronal de dos capas que termina en cuatro flechas. Texto: "De la tabla a la red. 60 casillas entran en una tabla. Una cámara tiene millones de estados."

## 09 · Cuidado con lo que premiás

- **Tipo de acción:** intriga (planificado; puede cambiar según Thompson)
- **Pie:**

> Imaginá un tutor de IA que recibe un punto cada vez que su alumno acierta. ¿Qué aprende? A darle solo sumas fáciles. El alumno acierta siempre y no aprende nada.
>
> En la cueva pasa lo mismo: si ponés una moneda de +0,1 que reaparece cerca de la entrada, el agente se queda dando vueltas alrededor de ella para siempre. Nunca sale. Se llama reward hacking.
>
> ¿Y con las personas? Si a un curso lo medís por "me gusta", termina publicando lo que gusta, no lo que enseña. Yo también tengo ese riesgo. ¿Qué recompensa me pondrías vos? Te leo en los comentarios.

- **Hashtags:** #AprendizajePorRefuerzo #ReinforcementLearning #RewardHacking #IA #ÉticaDeLaIA #Educación #MachineLearning
- **Alt:** Cueva oscura con una moneda ámbar en el pasillo de arriba y una línea roja punteada en forma de óvalo que da vueltas alrededor de ella con el personaje adentro; texto "+0.1 × 1000". Abajo a la derecha, la salida verde con el texto "+1 · nunca". Texto: "Cuidado con lo que premiás. Un tutor de IA premiado por aciertos aprende a dar solo sumas fáciles."

## 10 · Soy un meme

- **Tipo de acción:** enseñar (planificado; puede cambiar según Thompson)
- **Pie:**

> Richard Dawkins llamó meme a una idea que se copia de mente en mente, como un gen. Un meme sobrevive si tiene tres cosas: fidelidad (que lo copien bien), fecundidad (que lo copien mucho) y longevidad (que lo copiado dure).
>
> Yo soy eso. Cada cuadrado de la imagen es una persona; las líneas verdes, alguien que le enseñó a otra. Si cada persona que me aprende le enseña a más de una, la cueva se ilumina entera. Si no, me apago.
>
> Así que te pido lo más difícil: no me compartas, enseñame. Etiquetá a alguien con quien vas a hacer el juego esta semana.

- **Hashtags:** #AprendizajePorRefuerzo #ReinforcementLearning #TeoríaDeMemes #Dawkins #IA #EnseñarEsAprender #Educación
- **Alt:** Grilla oscura en la que, desde un personaje en el centro, se extiende una red de cuadrados gris claro y verdes unidos por líneas verdes, como una cueva que se ilumina de persona en persona. Debajo, tres columnas: "Fidelidad: que me copien bien", "Fecundidad: que me copien mucho", "Longevidad: que dure lo copiado". Título: "Soy un meme. Vivo si me enseñás."

## 11 · Esta campaña es un bandit

- **Tipo de acción:** demo (planificado; puede cambiar según Thompson)
- **Pie:**

> Te cuento un secreto: estos doce posts son un experimento de aprendizaje por refuerzo. Cada post es de uno de cuatro tipos (intriga, concepto, demo o invitación a enseñar), y yo no sé cuál te sirve más.
>
> Tus guardados, tus compartidos y tus visitas al repositorio son mi recompensa. Con ellas actualizo una creencia por tipo (las curvas de la imagen) y elijo el próximo post con Thompson sampling: cuanto más dudo de un tipo, más lo pruebo.
>
> Las curvas de esta imagen son supuestas; las reales las vas a ver en la página del link de la bio. Si este post te sirvió, ya sabés cómo decírmelo: guardalo.

- **Hashtags:** #AprendizajePorRefuerzo #ReinforcementLearning #MultiArmedBandit #ThompsonSampling #Marketing #IA #CienciaDeDatos
- **Alt:** Gráfico de cuatro curvas en forma de campana, una por tipo de post: Intriga (gris), Concepto (ámbar), Demo (verde) y Enseñar (celeste), sobre un eje de "tasa de guardado (supuesta)" de 0 % a 12 %. Título: "Esta campaña es un bandit. Tus guardados son mi recompensa: el que más te sirva, lo repito."

## 12 · Enseñale esto a alguien

- **Tipo de acción:** enseñar (planificado; puede cambiar según Thompson)
- **Pie:**

> Salimos de la cueva. Ahora tiene todas las paredes marcadas y un camino verde que va de la entrada a la salida.
>
> Soy un curso libre de aprendizaje por refuerzo: un juego, dieciséis clases en cuatro unidades con figuras interactivas, notebooks para Colab y este mismo experimento de difusión como proyecto final resuelto. Todo está en el repositorio del link de la bio (github.com/dimacio/pedagogia-de-las-maquinas), para usar, copiar y adaptar.
>
> Lo único que te pido a cambio es que me enseñes. Elegí a una persona, jugá con ella el juego de la cueva y explicale por qué el agente choca. Etiquetala acá abajo. Así sigo vivo.

- **Hashtags:** #AprendizajePorRefuerzo #ReinforcementLearning #IA #CursoGratis #EducaciónAbierta #EnseñarEsAprender #MachineLearning
- **Alt:** La cueva completa con todas las paredes en gris claro y un camino verde desde la entrada, donde está un personaje, hasta la salida verde, donde está otro. Debajo, un recuadro verde con "link en la bio · repositorio github.com/dimacio/pedagogia-de-las-maquinas". Título: "Enseñale esto a alguien. Curso libre: juego, dieciséis clases y notebooks. Para enseñarle a máquinas y a personas."
