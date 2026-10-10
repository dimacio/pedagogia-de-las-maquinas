/* modulos.js — datos de cada clase de "RL a ciegas" (MOOC libre).
   Lo lee Cueva.pagina() para armar "Antes de empezar", el cuestionario y la actividad entre pares.
   Una entrada por clase, en orden: 0a, 0b, 0c (nivelación) y 1 … 16; las clases en preparación no tienen entrada.
   Cada clase:
     objetivos     4 verbos observables; el i-ésimo es Oi en specs/<id>.md
     tiempo        minutos estimados { pagina, notebook }
     previos       ids de clases que conviene haber hecho
     requisitos    otros requisitos (texto)
     cuestionario  5 o 6 preguntas: { objetivo: "Ox", pregunta, opciones: [{ texto, explicacion }], correcta: índice }
                   objetivo = id del objetivo del spine que evalúa la pregunta (fabrica/CONVENCIONES.md §2)
     actividad     { titulo, consigna, rubrica: [3 criterios] } para devolver en GitHub Discussions
   Texto plano: Cueva.pagina() escapa todo, no usar HTML acá. */
window.MODULOS = {
  "0a": {
    objetivos: [
      "Representar la cueva como lista de strings, como matriz de NumPy y como imagen RGB, y pasar de una forma a otra.",
      "Indexar una matriz con [r, c] y distinguir una fila, una columna y una rebanada.",
      "Calcular un movimiento como suma de vectores y detectar el choque consultando la matriz.",
      "Escribir un bucle que juegue muchas partidas al azar y graficar cuántos pasos tarda cada una."
    ],
    tiempo: { pagina: 25, notebook: 90 },
    previos: [],
    requisitos: ["Ninguno: es el punto de partida del curso.", "Para el notebook, una cuenta de Google para abrirlo en Colab (o Python con NumPy y Matplotlib)."],
    cuestionario: [
      {
        objetivo: "O2",
        pregunta: "En la matriz M de la cueva, la entrada S está en M[1, 1] y no en M[0, 0]. ¿Por qué?",
        opciones: [
          { texto: "Porque los índices empiezan en 0 y la fila 0 y la columna 0 son el borde de pared.", explicacion: "Correcto. El borde es todo #, así que la primera casilla libre está en la fila 1, columna 1." },
          { texto: "Porque Python empieza a contar desde 1.", explicacion: "No: Python y NumPy cuentan desde 0. Justamente por eso M[0, 0] es la esquina de arriba a la izquierda." },
          { texto: "Porque NumPy guarda las filas de abajo hacia arriba.", explicacion: "No: las filas crecen hacia abajo, igual que los renglones del mapa en texto." },
          { texto: "Porque la entrada siempre se ubica en el centro de la cueva.", explicacion: "No: S puede estar en cualquier casilla libre; en la cueva chica está pegada a la esquina, en [1, 1]." }
        ],
        correcta: 0
      },
      {
        objetivo: "O3",
        pregunta: "Las acciones son desplazamientos (dr, dc). ¿Cuál corresponde a ir hacia arriba (↑)?",
        opciones: [
          { texto: "[1, 0]", explicacion: "No: sumar 1 a la fila baja una casilla, porque las filas crecen hacia abajo." },
          { texto: "[-1, 0]", explicacion: "Correcto. Subir es restar 1 a la fila y dejar la columna igual." },
          { texto: "[0, -1]", explicacion: "No: eso cambia la columna, o sea, va hacia la izquierda (←)." },
          { texto: "[0, 1]", explicacion: "No: eso va hacia la derecha (→)." }
        ],
        correcta: 1
      },
      {
        objetivo: "O2",
        pregunta: "¿Qué devuelve M[:, 3]?",
        opciones: [
          { texto: "La fila 3 completa.", explicacion: "No: la fila 3 es M[3] o M[3, :]. Los dos puntos van en la posición que se recorre entera." },
          { texto: "La casilla de la fila 3 y la columna 3.", explicacion: "No: eso sería M[3, 3], un solo número." },
          { texto: "La columna 3: un valor por cada fila.", explicacion: "Correcto. ':' en la primera posición toma todas las filas, y 3 fija la columna." },
          { texto: "Las primeras tres columnas.", explicacion: "No: para eso haría falta una rebanada, M[:, :3]." }
        ],
        correcta: 2
      },
      {
        objetivo: "O1",
        pregunta: "La cueva chica tiene 10 filas y 14 columnas. Como imagen a color, ¿qué forma tiene el arreglo?",
        opciones: [
          { texto: "(10, 14, 3)", explicacion: "Correcto. Alto × ancho × 3 canales (rojo, verde y azul) para cada pixel." },
          { texto: "(14, 10, 3)", explicacion: "No: en NumPy la primera dimensión es la fila (el alto) y la segunda la columna (el ancho)." },
          { texto: "(10, 14)", explicacion: "Esa es la forma de la matriz de paredes M, con un número por casilla. Una imagen a color necesita tres números por pixel." },
          { texto: "(3, 10, 14)", explicacion: "No: en NumPy y Matplotlib los canales van al final, (alto, ancho, 3)." }
        ],
        correcta: 0
      },
      {
        objetivo: "O4",
        pregunta: "El camino más corto a la salida tiene 20 pasos y el agente al azar tarda cientos o miles. ¿Por qué no mejora de una partida a la siguiente?",
        opciones: [
          { texto: "Porque el límite de 5000 pasos por partida es muy bajo.", explicacion: "No: con más paciencia llega más seguido, pero sigue sin mejorar entre partidas." },
          { texto: "Porque no guarda nada de una partida para usar en la próxima.", explicacion: "Correcto. Elige cada flecha al azar sin memoria: aprender es justamente recordar algo útil entre partidas." },
          { texto: "Porque la cueva cambia en cada partida.", explicacion: "No: el mapa es siempre el mismo; lo que no cambia es el agente." },
          { texto: "Porque la semilla del generador al azar está fija.", explicacion: "No: la semilla solo hace que el experimento se pueda repetir; no le impide a nadie aprender." }
        ],
        correcta: 1
      }
    ],
    actividad: {
      titulo: "La cueva por escrito",
      consigna: "Dibujá en papel cuadriculado una cueva de 6×6 y publicala en Discussions solo como lista de strings (sin el dibujo). Respondé además: si tenés solo la matriz M y la posición [r, c], ¿cómo sabés si podés ir a la derecha? Un compañero reconstruye el dibujo a partir de tu texto, dice el índice [r, c] de la salida y te devuelve la rúbrica.",
      rubrica: [
        "El mapa es válido: borde todo #, una S, una G y todas las filas del mismo largo.",
        "Quien lo reconstruye ubica la salida con el índice [r, c] correcto, contando desde 0.",
        "La respuesta sobre ir a la derecha usa la matriz (mirar M[r, c + 1]) y no el dibujo."
      ]
    }
  },

  "0b": {
    objetivos: [
      "Estimar una probabilidad de transición como frecuencia y explicar cómo baja el error al repetir.",
      "Describir con esperanza y varianza la cantidad de pasos hasta salir y cómo cambian con el slip.",
      "Usar la distribución geométrica para predecir cuántos intentos hacen falta (E[K] = 1/p).",
      "Actualizar una creencia sobre la posición con la regla de Bayes a partir de \"choqué\" o \"no choqué\"."
    ],
    tiempo: { pagina: 25, notebook: 75 },
    previos: ["0a"],
    requisitos: ["Fracciones y porcentajes; no hace falta haber cursado probabilidad."],
    cuestionario: [
      {
        objetivo: "O1",
        pregunta: "Con slip = 0,2, el agente intenta ir hacia abajo desde una casilla sin paredes a los costados. ¿Con qué probabilidad termina en la casilla de la derecha?",
        opciones: [
          { texto: "0,8", explicacion: "Esa es la probabilidad de ir adonde quería (1 − slip), hacia abajo." },
          { texto: "0,2", explicacion: "Esa es la probabilidad de resbalar, pero se reparte entre los dos costados." },
          { texto: "0,1", explicacion: "Correcto. Resbala con probabilidad 0,2 y, si resbala, va a uno de los dos costados por igual: 0,2 / 2." },
          { texto: "0,4", explicacion: "No: el resbalón no se duplica; se divide entre la izquierda y la derecha." }
        ],
        correcta: 2
      },
      {
        objetivo: "O1",
        pregunta: "La frecuencia observada se acerca a la probabilidad exacta al repetir. ¿Cuántas tiradas más hacen falta para reducir el error a la mitad?",
        opciones: [
          { texto: "El doble.", explicacion: "No: el error típico baja como 1/√n, así que duplicar n lo reduce solo a un 71 %." },
          { texto: "Cuatro veces más.", explicacion: "Correcto. Como el error va como 1/√n, para dividirlo por 2 hay que multiplicar n por 4." },
          { texto: "Diez veces más.", explicacion: "Diez veces más lo reduce a menos de un tercio, más de lo pedido." },
          { texto: "Ninguna: el error no baja con más tiradas.", explicacion: "No: es la ley de los grandes números; la figura muestra que con 10 000 tiradas las barras casi tocan las marcas." }
        ],
        correcta: 1
      },
      {
        objetivo: "O3",
        pregunta: "Cada intento sale bien con probabilidad p = 1 − slip. Si el piso resbala la mitad de las veces, ¿cuántos intentos esperás en promedio hasta el primer éxito?",
        opciones: [
          { texto: "1", explicacion: "Solo si nunca resbalara (p = 1)." },
          { texto: "2", explicacion: "Correcto. Es una geométrica con p = 0,5 y E[K] = 1/p = 2." },
          { texto: "0,5", explicacion: "Esa es p. La cantidad de intentos no puede ser menor que 1." },
          { texto: "4", explicacion: "No: 4 sería con p = 0,25, es decir, si resbalara 3 de cada 4 veces." }
        ],
        correcta: 1
      },
      {
        objetivo: "O4",
        pregunta: "El agente conoce el mapa pero no sabe dónde está. Intenta ir hacia arriba y choca. ¿Qué hace la regla de Bayes con su creencia?",
        opciones: [
          { texto: "Nada: chocar no da información.", explicacion: "No: chocar es información. Descarta todas las casillas donde arriba no hay pared." },
          { texto: "Pone probabilidad 1 en la casilla real.", explicacion: "No: el agente no la conoce; un solo choque suele dejar varias casillas posibles." },
          { texto: "Las casillas donde chocar era imposible pierden probabilidad y el resto se reparte lo que queda.", explicacion: "Correcto. Después ∝ verosimilitud × antes, y el denominador solo normaliza para que sume 1." },
          { texto: "Vuelve a repartir la creencia pareja sobre todas las casillas.", explicacion: "No: eso borraría lo aprendido; la creencia solo se concentra con cada observación." }
        ],
        correcta: 2
      },
      {
        objetivo: "O2",
        pregunta: "Recompensa +1 al llegar a la salida, 0 en el resto, y la partida dura exactamente 20 pasos. ¿Cuánto vale el retorno G = Σ γᵗ·r[t+1]?",
        opciones: [
          { texto: "1", explicacion: "Solo si γ = 1. Con descuento, una recompensa que llega tarde pesa menos." },
          { texto: "γ¹⁹", explicacion: "Correcto. La recompensa llega en el paso 20, que es r[t+1] con t = 19." },
          { texto: "γ²⁰", explicacion: "Casi: la suma arranca en t = 0 con r[1], así que la recompensa del paso 20 lleva γ¹⁹." },
          { texto: "20·γ", explicacion: "No: hay una sola recompensa distinta de cero, no veinte." }
        ],
        correcta: 1
      }
    ],
    actividad: {
      titulo: "¿Dónde estoy?",
      consigna: "Publicá una cueva chica (como texto) y, desde una casilla secreta, una secuencia de 4 a 6 flechas con su resultado (\"choqué\" o \"no choqué\"). Agregá tu respuesta a la pregunta: si tirás un paso 10 veces y resbalaste 3, ¿podés decir que el slip es 0,3? Un compañero encuentra la casilla tachando las imposibles paso a paso y te devuelve la rúbrica.",
      rubrica: [
        "La secuencia es coherente con la cueva: existe al menos una casilla compatible con todos los resultados.",
        "La respuesta muestra qué casillas siguen siendo posibles después de cada paso, no solo la final.",
        "La respuesta sobre el slip distingue frecuencia de probabilidad y dice cuántas tiradas darían más seguridad."
      ]
    }
  },

  "0c": {
    objetivos: [
      "Numerar las casillas libres para pasar de la grilla a un vector y de vuelta.",
      "Escribir una fila de la matriz P de la política al azar y verificar que suma 1.",
      "Iterar V ← R + γPV y explicar por qué el valor avanza una casilla por multiplicación.",
      "Comparar resolver (I − γP)V = R con iterar, según γ y el tamaño del problema."
    ],
    tiempo: { pagina: 25, notebook: 75 },
    previos: ["0a", "0b"],
    requisitos: ["Saber multiplicar una matriz por un vector (se repasa en la clase)."],
    cuestionario: [
      {
        objetivo: "O2",
        pregunta: "Con la política al azar, una casilla tiene dos vecinas libres y dos paredes. ¿Qué tiene su fila de P?",
        opciones: [
          { texto: "¼ en cada vecina libre y ½ en la diagonal.", explicacion: "Correcto. Cada flecha vale ¼; las dos que chocan dejan al agente donde estaba, y eso suma ½ en la diagonal." },
          { texto: "½ en cada vecina libre.", explicacion: "No: eso supone que el agente nunca elige las flechas que chocan." },
          { texto: "¼ en cada vecina libre y ceros en el resto.", explicacion: "Esa fila suma ½: faltan los choques, que se quedan en la diagonal." },
          { texto: "1 en la diagonal.", explicacion: "Eso es una casilla absorbente, como la salida." }
        ],
        correcta: 0
      },
      {
        objetivo: "O3",
        pregunta: "Arrancando con V = 0, ¿cuántas multiplicaciones V ← R + γPV hacen falta para que la entrada S tenga un valor distinto de cero?",
        opciones: [
          { texto: "1", explicacion: "Después de una multiplicación solo valen algo las vecinas de la salida." },
          { texto: "Tantas como la distancia de S a la salida.", explicacion: "Correcto. Cada producto P·V mira solo a las vecinas, así que el valor avanza una casilla por vez." },
          { texto: "Tantas como casillas tiene la cueva.", explicacion: "No: lo que importa es la distancia a la salida, no el total de casillas." },
          { texto: "Infinitas: S nunca deja de valer cero.", explicacion: "No: el valor llega en un número finito de vueltas, aunque después siga creciendo cada vez más despacio." }
        ],
        correcta: 1
      },
      {
        objetivo: "O4",
        pregunta: "Si la cueva tuviera un millón de casillas, ¿qué convendría?",
        opciones: [
          { texto: "Resolver (I − γP)V = R con eliminación gaussiana.", explicacion: "Con un millón de incógnitas la eliminación es carísima en tiempo y memoria." },
          { texto: "Iterar V ← R + γPV, que solo usa las pocas vecinas de cada casilla.", explicacion: "Correcto. P es casi toda ceros: cada multiplicación es barata y el error cae como γᵏ." },
          { texto: "Calcular la inversa de I − γP una vez y guardarla.", explicacion: "La inversa es densa: un billón de números. Por eso no se guarda." },
          { texto: "No se puede: Bellman solo vale para cuevas chicas.", explicacion: "No: la ecuación vale igual; lo que cambia es qué método conviene." }
        ],
        correcta: 1
      },
      {
        objetivo: "O1",
        pregunta: "En la cueva mini, las 11 casillas libres se numeran de izquierda a derecha y de arriba abajo, empezando en 0 por la entrada S. ¿Qué número le toca a la casilla libre que está justo debajo de S?",
        opciones: [
          { texto: "5", explicacion: "Correcto. La fila de S tiene cinco casillas libres (0 a 4, con la salida en el 4), así que la primera libre de la fila siguiente es la 5." },
          { texto: "1", explicacion: "No: 1 es la vecina de la derecha de S, en la misma fila." },
          { texto: "15", explicacion: "No: 15 es la posición en la grilla completa (fila 2 × 7 columnas + columna 1), contando paredes. El vector solo numera las casillas libres." },
          { texto: "6", explicacion: "No: 6 es la primera casilla de la fila de abajo de todo; la de debajo de S es la única libre de la fila del medio." }
        ],
        correcta: 0
      },
      {
        objetivo: "O3",
        pregunta: "¿Por qué ningún autovalor de P puede ser mayor que 1 en valor absoluto?",
        opciones: [
          { texto: "Porque P es simétrica.", explicacion: "No: P en general no es simétrica (hay casillas con más choques que sus vecinas)." },
          { texto: "Porque cada fila suma 1 con números no negativos: P promedia y nunca agranda.", explicacion: "Correcto. Un promedio nunca supera al mayor de sus términos; por eso el vector de unos tiene autovalor exactamente 1." },
          { texto: "Porque γ es menor que 1.", explicacion: "γ no está en P. Que γ < 1 es lo que hace que γP achique." },
          { texto: "Porque la cueva tiene 60 casillas.", explicacion: "El tamaño no importa: vale para cualquier matriz estocástica." }
        ],
        correcta: 1
      }
    ],
    actividad: {
      titulo: "Una fila de P a mano",
      consigna: "Con la cueva mini (11 casillas), escribí a mano las filas de P de dos casillas: una de pasillo y una esquina, con la política al azar. Respondé además: si cada casilla vale el promedio de sus vecinas y la salida vale 1, ¿cuánto vale una casilla que solo toca la salida y una pared? Publicalo en Discussions; un compañero lo verifica contra la figura de la clase y te devuelve la rúbrica.",
      rubrica: [
        "Cada fila suma 1 y los choques aparecen en la diagonal.",
        "Las columnas distintas de cero corresponden a vecinas reales en el dibujo de la cueva.",
        "La respuesta a la pregunta está planteada como ecuación (el valor es un promedio) y no solo como un número."
      ]
    }
  },

  "1": {
    objetivos: [
      "Distinguir educación bancaria de educación problematizadora (Freire) y explicar por qué el curso propone enseñarle a una máquina en lugar de recibir contenidos.",
      "Explicar qué pierde un agente que decide solo por la recompensa inmediata, con el feed como ejemplo.",
      "Leer el cuidado de sí (Foucault) como la pregunta de quién elige la función de recompensa y reconocer en un día propio los pesos que puso otro.",
      "Usar fidelidad, fecundidad y longevidad (Dawkins) para explicar cómo se propaga el curso."
    ],
    tiempo: { pagina: 40 },
    previos: [],
    requisitos: ["Ninguno: es la puerta de entrada del curso.", "Antes de la clase 2, jugar la cueva en modo fácil y en modo difícil."],
    cuestionario: [
      {
        objetivo: "O1",
        pregunta: "Para Freire, ¿qué caracteriza a la educación bancaria?",
        opciones: [
          { texto: "Que el docente deposita contenidos en un alumno que los recibe pasivamente.", explicacion: "Correcto. Es la imagen del depósito: el saber va en una sola dirección y el alumno no actúa sobre el mundo." },
          { texto: "Que enseña finanzas y economía.", explicacion: "No: «bancaria» es una metáfora del depósito, no el tema que se enseña." },
          { texto: "Que parte de un problema real y se resuelve en diálogo.", explicacion: "No: eso describe la educación problematizadora, la que Freire le opone." },
          { texto: "Que se cobra por cada clase.", explicacion: "No: la crítica de Freire no es sobre el costo sino sobre la relación entre quien enseña y quien aprende." }
        ],
        correcta: 0
      },
      {
        objetivo: "O2",
        pregunta: "En la figura «Un feed que mira solo el próximo clic», ¿qué optimiza ese feed al elegir cada tarjeta y qué pierde al decidir así?",
        opciones: [
          { texto: "Elige la que más te sirve en el día; no pierde nada, porque cada clic también suma para después.", explicacion: "No: en la figura el feed elige «Clip de 15 s» o «¡No vas a creer…!» aunque dejen casi 0 para después; lo que llega tarde no entra en su cuenta." },
          { texto: "Elige la de más clic ahora; pierde lo que deja para después: lo aprendido, el resto del día.", explicacion: "Correcto. Es un agente que decide solo por la recompensa inmediata. En la clase 3 esto se llama descuento γ, y en este feed vale casi 0." },
          { texto: "Elige sumando el clic de ahora y lo que deja para después; por eso junta menos clics.", explicacion: "No: eso describe la segunda fila, la de quien elige sumando lo que viene después; el feed mira solo el clic de ahora." },
          { texto: "Elige al azar entre las cuatro candidatas; lo que pierde son los clics que podría haber juntado.", explicacion: "No: el feed no elige al azar, se queda siempre con la candidata de barra «clic ahora» más larga, y es la fila que más clics junta." }
        ],
        correcta: 1
      },
      {
        objetivo: "O3",
        pregunta: "¿Qué sostiene Foucault en La hermenéutica del sujeto sobre el «conócete a ti mismo»?",
        opciones: [
          { texto: "Que es una invención moderna sin antecedentes griegos.", explicacion: "No: el gnothi seauton es un precepto antiguo; lo que analiza Foucault es su relación con el cuidado de sí." },
          { texto: "Que en la Antigüedad era una parte del cuidado de sí, y que la modernidad lo separó y lo puso por delante.", explicacion: "Correcto. Esa inversión es la que el curso relee como la pregunta de quién elige la recompensa." },
          { texto: "Que conocerse a uno mismo es imposible y conviene dejarlo.", explicacion: "No: el curso no le atribuye esa tesis; habla de la relación entre conocerse y cuidarse." },
          { texto: "Que el cuidado de sí consiste en consumir menos tecnología.", explicacion: "No: es una lectura que el curso no hace; cuidarse, en esta clase, es poder ver y elegir los propios pesos." }
        ],
        correcta: 1
      },
      {
        objetivo: "O4",
        pregunta: "En la figura del meme, cada persona enseña a 2 personas en promedio, la copia sale bien el 40 % de las veces y cada una enseña una sola ronda. ¿Qué pasa?",
        opciones: [
          { texto: "La luz cruza toda la cueva, porque 2 es mayor que 1.", explicacion: "No: la fecundidad sola no alcanza; las copias infieles no enseñan." },
          { texto: "Depende solo de dónde se siembra.", explicacion: "El lugar influye en un pasillo cerrado, pero lo que decide es R." },
          { texto: "Crece sin límite, porque la longevidad es 1.", explicacion: "No: longevidad 1 es la mínima; no agrega rondas." },
          { texto: "Tiende a apagarse: R ≈ 2 × 0,4 × 1 = 0,8, menor que 1.", explicacion: "Correcto. Con R menor que 1 cada ronda hay, en promedio, menos personas enseñando que en la anterior." }
        ],
        correcta: 3
      },
      {
        objetivo: "O3",
        pregunta: "En el recuadro «Esto hoy se mide», el estudio de cuatro semanas con 981 personas (Fang et al., 2025), ¿qué encontró y qué no se puede concluir de él?",
        opciones: [
          { texto: "Que el chatbot causa soledad: las condiciones que asignaron los investigadores aumentaron la soledad y la dependencia.", explicacion: "No: según el recuadro, las condiciones asignadas no tuvieron un efecto significativo; afirmar que el chatbot causa soledad es sobreafirmar." },
          { texto: "Que el uso intenso aumenta la soledad en cualquier persona y por años, porque el estudio fue grande.", explicacion: "No: fueron cuatro semanas con un grupo concreto; no se puede generalizar al largo plazo ni a todas las personas, y además es una asociación, no un efecto." },
          { texto: "Que quienes más usaron el chatbot por su cuenta reportaron más soledad y dependencia, sin probar que lo cause.", explicacion: "Correcto. El recuadro dice qué se midió y su límite: el uso voluntario intenso va junto con más soledad, pero eso no prueba causa." },
          { texto: "Que, como hoy se mide, la pregunta de Foucault ya está respondida y no hace falta elegir los propios pesos.", explicacion: "No: el recuadro dice que la pregunta de Foucault no se responde con un experimento; los estudios la acompañan, no la reemplazan." }
        ],
        correcta: 2
      }
    ],
    actividad: {
      titulo: "¿Qué te premia?",
      consigna: "Elegí los pesos de tu día en la figura de Foucault y publicá los cuatro números, junto con una actividad de ayer cuyo premio eligió otra persona o una app. Contá además qué tuviste que recordar para salir de la cueva en modo difícil. Otra persona te devuelve con la rúbrica.",
      rubrica: [
        "Los pesos están justificados con un ejemplo concreto del propio día, no en abstracto.",
        "Se identifica quién eligió la recompensa de la actividad nombrada y se dice si se la elegiría igual.",
        "Lo recordado en modo difícil se describe como historia y se separa la parte que alcanzó para decidir (el estado)."
      ]
    }
  },

  "2": {
    objetivos: [
      "Identificar agente, entorno, acción, observación, recompensa y política en la cueva y en otro problema.",
      "Explicar qué maximiza el agente (la suma de recompensas) y por qué una recompensa escasa y demorada, sin mapa ni respuesta correcta, vuelve difícil aprender.",
      "Distinguir historia de estado y decidir si una observación cumple el supuesto de Markov.",
      "Explicar con el tutor la trampa de la recompensa, proponer una recompensa alternativa y anticipar cómo podría ser engañada."
    ],
    tiempo: { pagina: 35, notebook: 60 },
    previos: ["0a", "0b"],
    requisitos: ["Haber jugado un rato a la cueva a ciegas en modo fácil."],
    cuestionario: [
      {
        objetivo: "O1",
        pregunta: "Un termostato decide cada 10 minutos si prende o apaga la calefacción. Lee la temperatura de la habitación y recibe −1 cada vez que alguien de la casa lo cambia a mano. ¿Qué lista nombra bien las partes?",
        opciones: [
          { texto: "Agente: la persona que lo cambia a mano. Entorno: la calefacción. Acción: el cambio a mano. Recompensa: la temperatura.", explicacion: "No: la persona es parte del entorno. Quien decide en cada paso es el termostato, y la temperatura es lo que lee, no lo que cobra." },
          { texto: "Agente: el termostato. Entorno: la casa con su gente. Acción: prender o apagar. Observación: la temperatura. Recompensa: el −1.", explicacion: "Correcto. El termostato elige, la casa responde con una temperatura y con el −1 cuando alguien lo corrige a mano." },
          { texto: "Agente: el termostato. Entorno: la casa. Acción: la temperatura que mide. Observación: prender o apagar. Recompensa: el −1.", explicacion: "No: están cruzadas. Prender o apagar es lo que el termostato elige (acción); la temperatura es lo que le devuelve el mundo (observación)." },
          { texto: "Agente: el termostato. Entorno: la casa. Acción: prender o apagar. Observación: el −1. Recompensa: la temperatura de la habitación.", explicacion: "No: la temperatura la observa, pero no es lo que se busca maximizar. El número que se suma es el −1 por cada corrección a mano." }
        ],
        correcta: 1
      },
      {
        objetivo: "O2",
        pregunta: "En la partida al azar del notebook el agente recibió 1833 ceros seguidos y un +1 en el paso 1834. ¿Por qué una recompensa así vuelve difícil aprender?",
        opciones: [
          { texto: "Porque la suma total, 1, es demasiado chica para que el agente pueda aprender algo de ella.", explicacion: "No: la partida de las flechas también suma 1. El problema no es el tamaño del número sino cuándo llega y qué no dice." },
          { texto: "Porque el agente al azar nunca sale de la cueva, así que nunca llega a ver un +1.", explicacion: "No: en esa partida sí salió, en el paso 1834. Con el límite de 200 pasos sale poco (3.7 % de los episodios), pero sale." },
          { texto: "Porque el entorno conoce la flecha correcta de cada paso y se la muestra al agente recién al final.", explicacion: "No: en RL nadie da la flecha correcta, ni durante la partida ni al final. El +1 dice que salió, no qué convenía en cada casilla." },
          { texto: "Porque ningún número dice cuál de los 1834 pasos fue el bueno: el mérito se reparte entre todos.", explicacion: "Correcto. Mientras recibe 0, perderse y acercarse se ven igual; es una recompensa escasa y demorada." }
        ],
        correcta: 3
      },
      {
        objetivo: "O3",
        pregunta: "Supongamos que el agente, en vez de la casilla, solo sabe cuántos pasos lleva dados. Con ese conteo y la acción que elige, ¿puede predecir en qué casilla va a quedar?",
        opciones: [
          { texto: "Sí: el conteo crece en cada paso igual que la historia, así que la resume entera.", explicacion: "No: que crezcan juntos no lo vuelve un resumen. Dos historias con el mismo conteo pueden dejar al agente en lugares distintos." },
          { texto: "Sí, siempre que no choque, porque cada paso sin chocar lo acerca a la salida.", explicacion: "No: sin chocar también se puede ir y volver por los mismos pasillos, como el agente al azar. El conteo no dice dónde está." },
          { texto: "No: con el mismo conteo puede estar en otra casilla y la acción lo deja en otro lado.", explicacion: "Correcto. Después de 6 pasos, la historia A está en (3,3) y seis pasos hacia abajo desde S dejan en (7,1); con el mismo conteo y la misma acción, la próxima casilla cambia. El conteo no cumple el supuesto de Markov." },
          { texto: "No, porque el supuesto de Markov pide guardar la historia completa, no un solo número.", explicacion: "No: es al revés. Markov dice que un resumen (en la cueva, la casilla) alcanza y que el resto de la historia ya no importa." }
        ],
        correcta: 2
      },
      {
        objetivo: "O1",
        pregunta: "En el paso 7, un tutor le da problemas de suma o de resta a un alumno y cobra +1 si acierta y −1 si se equivoca. ¿Qué es la política del tutor?",
        opciones: [
          { texto: "El problema concreto que da en cada turno: una suma o una resta.", explicacion: "No: eso es la acción. La política es la regla que decide cuál de las dos dar." },
          { texto: "El +1 o el −1 que cobra cada vez que el alumno acierta o se equivoca.", explicacion: "No: eso es la recompensa, lo que el tutor busca sumar." },
          { texto: "La regla con la que elige el próximo problema según lo que vio del alumno.", explicacion: "Correcto. El estado es lo que vio del alumno y la política π dice qué problema dar con eso." },
          { texto: "La habilidad real del alumno en suma y en resta, que sube cada vez que practica.", explicacion: "No: eso está dentro del entorno y queda oculto para el tutor; cómo cambia al practicar es la dinámica." }
        ],
        correcta: 2
      },
      {
        objetivo: "O4",
        pregunta: "Para enderezar al tutor, la escuela le paga +1 solo si el alumno aprueba el examen final de restas, que todos los años tiene las mismas diez cuentas. ¿Qué trampa nueva podría aparecer?",
        opciones: [
          { texto: "Volver a dar solo sumas, porque se aciertan más rápido y suman puntos.", explicacion: "No: con esta recompensa una suma acertada no paga nada; solo cuenta aprobar el examen de restas." },
          { texto: "Hacerle practicar esas diez restas hasta que las memorice, sin enseñarle a restar.", explicacion: "Correcto. El tutor optimiza aprobar ese examen, no saber restar: si el examen se repite, conviene enseñar las respuestas." },
          { texto: "Ninguna: el examen es de restas, así que aprobarlo prueba que el alumno sabe restar.", explicacion: "No: prueba que acierta esas diez cuentas. Lo que pedimos (aprobar) y lo que queremos (que reste) se pueden separar." },
          { texto: "Dar problemas al azar, porque durante la práctica el tutor ya no cobra nada por acertar.", explicacion: "No: que el pago llegue recién al final lo vuelve más difícil de aprender, pero la política que más cobra es la que asegura el examen." }
        ],
        correcta: 1
      }
    ],
    actividad: {
      titulo: "Tu propio tutor tramposo",
      consigna: "Elegí un problema real donde alguien (persona o programa) es premiado por un número: un tutor, un vendedor, una app. Escribí agente, entorno, acción, observación, recompensa y política; describí una forma en que el agente podría cobrar mucho sin lograr lo que se quería, y proponé una recompensa mejor. Publicalo en Discussions; un compañero busca una trampa nueva en tu recompensa corregida y te devuelve la rúbrica.",
      rubrica: [
        "Los seis elementos están bien identificados: la acción la elige el agente, no el entorno, y la política es la regla que la elige.",
        "La trampa es concreta y verosímil, como el tutor que solo da sumas.",
        "La recompensa corregida es medible y cierra la trampa, o reconoce con honestidad qué queda abierto."
      ]
    }
  },

  "3": {
    objetivos: [
      "Describir al caminante al azar en la cueva como una cadena de Markov y leer una fila de su matriz de transición P.",
      "Calcular el retorno descontado de una secuencia de recompensas y explicar qué cambia con γ, incluido el feed con γ ≈ 0 de la clase 1.",
      "Explicar el valor V(s) como retorno esperado y escribir la ecuación de Bellman de un proceso de recompensa de Markov.",
      "Resolver la ecuación de Bellman iterando desde V = 0 y explicar cómo el valor se derrama desde la salida."
    ],
    tiempo: { pagina: 35, notebook: 75 },
    previos: ["2", "0c"],
    requisitos: ["Haber hecho la clase 2: estado, supuesto de Markov y recompensa escasa y demorada.", "La nivelación 0c ayuda en el paso 6, donde la ecuación de Bellman se resuelve como sistema lineal."],
    cuestionario: [
      {
        objetivo: "O1",
        pregunta: "La fila de P de la casilla S, (1,1), tiene 0,50 en la diagonal y 0,25 en (1,2) y en (2,1). ¿Cómo se lee esa fila?",
        opciones: [
          { texto: "Desde sus dos vecinas, el caminante llega a S con probabilidad 0,50 en el próximo paso.", explicacion: "No: eso sería leer una columna. Una fila es una casilla de partida: dice adónde va el caminante que está en S." },
          { texto: "El caminante elige quedarse en S la mitad de las veces, porque desde ahí la salida está lejos.", explicacion: "No: el caminante no elige nada, tira un dado. El 0,50 sale de las caras que chocan, no de una preferencia." },
          { texto: "Desde S, dos caras del dado chocan (↑ y ←) y se queda; cada una de las otras lo lleva a una vecina.", explicacion: "Correcto. Se queda con 2/4 = 0,50 y va a cada vecina con 1/4 = 0,25. La fila suma 1: a algún lugar hay que llegar." },
          { texto: "La mitad de todas las caminatas pasa por S en algún momento, y un cuarto de ellas por cada una de las vecinas.", explicacion: "No: la fila habla de un solo paso desde S, no de cuántas caminatas pasan por cada casilla a lo largo del tiempo." }
        ],
        correcta: 2
      },
      {
        objetivo: "O2",
        pregunta: "Una caminata llega a la salida en el paso 3: sus recompensas son 0, 0 y +1. Con la convención de la clase (el primer paso no se descuenta), ¿cuánto vale su retorno G con γ = 0,9?",
        opciones: [
          { texto: "0,81: el +1 llega en el paso 3 y pesa γ² = 0,9².", explicacion: "Correcto. Un premio en el paso T pesa γ^(T−1): 0 + 0,9 · 0 + 0,9² · 1 = 0,81." },
          { texto: "0,729: el +1 llega en el paso 3 y pesa γ³ = 0,9³.", explicacion: "No: eso descuenta también el primer paso. En la clase el premio del paso 20 pesa γ¹⁹, y el del paso 3, γ²." },
          { texto: "1: el retorno suma las recompensas y en la caminata hubo un solo +1.", explicacion: "No: eso es el retorno sin descuento (γ = 1). Con γ = 0,9, llegar tarde cuesta." },
          { texto: "0,9: hay un solo premio, así que se multiplica una sola vez por γ.", explicacion: "No: el descuento depende de cuántos pasos tarda el premio, no de cuántos premios hay. Este tarda dos pasos más que el primero." }
        ],
        correcta: 0
      },
      {
        objetivo: "O2",
        pregunta: "En el modelo de juguete del paso 4, un feed con γ ≈ 0 compara «siempre gancho» con «siempre útil». ¿Qué regla elige y qué le pasa al usuario?",
        opciones: [
          { texto: "Elige «útil», porque en 90 días junta 112,0 clics contra 32,0 y el feed suma todo lo que va a cobrar.", explicacion: "No: con γ ≈ 0 los clics de mañana no pesan nada. «Útil» gana recién cuando γ supera 0,924." },
          { texto: "Elige «gancho», pero al usuario no le pasa nada: su satisfacción está oculta y el feed no la toca.", explicacion: "No: que el feed no vea la satisfacción no quiere decir que no la cambie. En el modelo, el gancho la baja y por eso el usuario deja de volver." },
          { texto: "Elige «gancho» hasta el día 17 y después pasa a «útil», cuando sus clics acumulados lo superan.", explicacion: "No: el día 17 es cuando se cruzan los clics acumulados, pero el feed elige una regla fija de una vez. Lo que la cambia es γ, no el día." },
          { texto: "Elige «gancho» por los 6,0 clics del primer día, y el día 30 ya no vuelve ningún usuario (0,0 %).", explicacion: "Correcto. Con γ ≈ 0 solo cuentan los clics de hoy (6,0 contra 3,0). Con «útil» el día 30 todavía vuelve el 44,8 %." }
        ],
        correcta: 3
      },
      {
        objetivo: "O3",
        pregunta: "En la casilla (7,12), pegada a la salida, V = 0,786 y R = 0,25. Según la ecuación de Bellman V = R + γPV, ¿qué dice cada término?",
        opciones: [
          { texto: "R es la probabilidad de llegar algún día a la salida, y γPV le resta lo que se pierde por tardar.", explicacion: "No: R es el premio esperado en el próximo paso (una de cuatro caras entra a la salida), y γPV se suma, no se resta." },
          { texto: "R = 0,25 es el premio esperado ahora; γPV, el resto, es γ por el valor promedio de adonde puede ir según su fila de P.", explicacion: "Correcto. Lo que vale estar acá es lo que gano ahora más lo que vale, un poco descontado, el lugar adonde voy a parar." },
          { texto: "R = 0,25 es el premio de ahora, y γPV es γ por el valor de la mejor vecina, la que lleva a la salida.", explicacion: "No: el caminante no elige, así que PV es un promedio pesado con la fila de P, no el máximo. Quedarse con la mejor es lo de la clase 4." },
          { texto: "R es el retorno de una caminata que arranca en (7,12), y γPV lo promedia con el de muchas otras caminatas.", explicacion: "No: promediar caminatas es otra forma de estimar V (paso 5). En la ecuación, R es el premio esperado de un solo paso." }
        ],
        correcta: 1
      },
      {
        objetivo: "O4",
        pregunta: "Arrancando con V = 0 en todas las casillas y aplicando Vₖ₊₁ = R + γPVₖ, ¿qué casillas tienen valor después de la vuelta 10?",
        opciones: [
          { texto: "Todas, aunque con números chicos, porque cada vuelta usa la matriz P entera.", explicacion: "No: cada vuelta mira un solo paso más hacia adelante. Una casilla a más de 10 pasos de la salida todavía no puede llegar en 10." },
          { texto: "Solo las dos vecinas de la salida, las únicas con R distinto de 0, hasta que la iteración converge.", explicacion: "No: eso pasa en la vuelta 1. En cada vuelta siguiente el valor avanza una casilla más hacia atrás." },
          { texto: "Justo las que están a 10 pasos o menos de la salida; S, a 20 pasos, sigue en 0 hasta la vuelta 20.", explicacion: "Correcto. El valor nace al lado de la salida y se derrama una casilla por vuelta: a S le llega en la vuelta 20, con un número del orden de 10⁻¹²." },
          { texto: "Las que están a 10 pasos o menos, y a S le llega en la vuelta 20 solo con γ = 0,99; con γ = 0,9, más tarde.", explicacion: "No: la vuelta en que llega depende de la distancia, no de γ. En el ejercicio del notebook, con γ = 0,9 también le llega en la vuelta 20; lo que cambia es cuánto vale." }
        ],
        correcta: 2
      }
    ],
    actividad: {
      titulo: "¿Cuánto pesa tu futuro?",
      consigna: "Elegí una decisión propia en la que algo de ahora compite con algo que llega después: estudiar o salir, ahorrar o gastar, dormir o seguir mirando el teléfono. Proponé un γ para esa decisión, contá en cuántos pasos (días, semanas) llega el premio lejano y cuánto pesa hoy con ese γ, usando las barras γᵗ de la página. Después contala con la oración de «Para enseñarlo»: lo que gano ahora más lo que vale, un poco descontado, el lugar adonde voy a parar. Publicalo en Discussions; otra persona te devuelve con la rúbrica.",
      rubrica: [
        "La decisión enfrenta un premio de ahora con uno que llega después, y se dice en cuántos pasos llega el lejano.",
        "El γ está justificado con el peso γᵗ del premio lejano, y se dice qué elegiría alguien con γ ≈ 0, como el feed miope.",
        "La decisión se cuenta como Bellman (lo de ahora más el valor descontado de adonde lleva)."
      ]
    }
  },

  "4": {
    objetivos: [
      "Describir la cueva como proceso de decisión de Markov (S, A, P(s′|s,a), R, γ) y explicar por qué un MDP con una política fija es un proceso de recompensa de Markov.",
      "Calcular el valor de una acción Q(s,a) en una casilla a partir de los valores de la política y usarlo para mejorarla.",
      "Diferenciar iteración de política (evaluar, mejorar, repetir) de iteración de valor (quedarse con la mejor acción en cada vuelta).",
      "Predecir el efecto del piso resbaloso, del costo por paso y de γ sobre los valores y las flechas, y plantear otro problema como MDP."
    ],
    tiempo: { pagina: 40, notebook: 75 },
    previos: ["3"],
    requisitos: ["Haber hecho la clase 3: el valor V como retorno esperado, la ecuación de Bellman de un MRP y la iteración desde V = 0."],
    cuestionario: [
      {
        objetivo: "O1",
        pregunta: "En la cueva como MDP se fija la política al azar: π(a|s) = 1/4 para cada acción en cada casilla. Al evaluarla da V(S) = 0,0136, el mismo valor de la clase 3. ¿Por qué?",
        opciones: [
          { texto: "Porque con el mapa a la vista el agente elige siempre la mejor acción, y en esta cueva la mejor coincide justo con la cara que salía en el dado de la clase 3.", explicacion: "No: si eligiera la mejor acción, V(S) sería 0,8262, no 0,0136. Con la política al azar nadie elige: se promedian las cuatro acciones." },
          { texto: "Porque con la política fija cada casilla queda con una sola distribución de destinos, P^π = Σₐ π(a|s) P(s′|s,a): un MRP; con 1/4 por acción, el dado.", explicacion: "Correcto. Un MDP con la política fija vuelve a ser una cadena con recompensa. El notebook comprueba que P^π y R^π son iguales a la P y la R del caminante de la clase 3." },
          { texto: "Porque las cuatro tablas P(s′|s,a) son iguales entre sí, así que da lo mismo qué acción se elija en cada casilla.", explicacion: "No: hay una tabla por acción y son distintas. Desde el cruce (5,6), ↑ choca y se queda, → va a (5,7), ↓ a (6,6) y ← a (5,5)." },
          { texto: "Porque en la cueva R no depende de la acción; si R(s,a) cambiara con la acción, el MDP con política fija ya no sería un MRP.", explicacion: "No: R sí depende de la acción (solo la que entra a la salida cobra +1). Con la política fija, R^π(s) = Σₐ π(a|s) R(s,a) y sigue siendo un MRP." }
        ],
        correcta: 1
      },
      {
        objetivo: "O2",
        pregunta: "En el cruce (5,6), con los valores de la política al azar, Q^π de ↑, →, ↓ y ← vale 0,0763, 0,1070, 0,0623 y 0,0627, y V^π(cruce) = 0,0771. ¿Qué se lee en esos números?",
        opciones: [
          { texto: "V^π(cruce) está mal calculado: el valor de una casilla es el de su mejor acción, así que debería dar 0,1070.", explicacion: "No: quedarse con el máximo es el valor óptimo V*. Para la política al azar, V^π es el promedio de las cuatro Q, pesado con 1/4 cada una." },
          { texto: "Para saber qué acción conviene en el cruce hay que jugar muchas partidas desde ahí con cada acción y comparar los retornos promedio.", explicacion: "No: con el mapa a la vista no hace falta jugar. Q^π(s,a) = R(s,a) + γ Σ P(s′|s,a) V^π(s′) se calcula con P, R y los valores de la política." },
          { texto: "Q(cruce, →) debería ser igual a V(5,7) = 0,1081, porque el paso que lleva de una casilla a la otra no cobra nada.", explicacion: "No: el paso no cobra nada (R = 0), pero el valor de la casilla de destino se descuenta. Q = 0 + 0,99 · 0,1081 = 0,1070." },
          { texto: "→ es la de mayor Q y la mejora pone esa flecha; el promedio de las cuatro Q da 0,0771 porque el dado elige cada una con 1/4.", explicacion: "Correcto. Mejorar es quedarse en cada casilla con la acción de mayor Q^π. Y como V^π es el promedio de las cuatro Q, alguna tiene que estar por encima." }
        ],
        correcta: 3
      },
      {
        objetivo: "O3",
        pregunta: "En la cueva, la iteración de política y la iteración de valor llegan a la misma política y al mismo V*. ¿En qué se diferencian?",
        opciones: [
          { texto: "La de política evalúa y después mejora en cada vuelta (4 vueltas desde el dado, 21 desde «todas ↑»); la de valor toma el máximo sin evaluar (22 vueltas).", explicacion: "Correcto. Las vueltas de la iteración de política son caras (un sistema de 60 ecuaciones) y pocas; las de la iteración de valor, baratas y muchas." },
          { texto: "La de valor encuentra mejores flechas porque se queda con el máximo; la de política se queda con lo que da el promedio de las acciones.", explicacion: "No: la de política también mejora con el máximo de Q. Las dos llegan al mismo V*: la diferencia entre ambos es 0." },
          { texto: "La de política siempre necesita pocas vueltas, cualquiera sea la política de la que arranque, y por eso es siempre la más rápida de las dos recetas.", explicacion: "No: desde el dado necesitó 4 vueltas, pero desde «todas ↑» necesitó 21, casi tantas como la de valor. Y cada vuelta suya resuelve un sistema entero." },
          { texto: "La de valor arranca de una política inicial y la va corrigiendo; la de política arranca de V = 0 y deja que el valor se derrame.", explicacion: "No: está al revés. La iteración de política arranca de una política (el dado, «todas ↑»); la de valor arranca de V = 0 y el valor se derrama desde la salida." }
        ],
        correcta: 0
      },
      {
        objetivo: "O4",
        pregunta: "Con slip 0,2 el agente se resbala hacia un costado con esa probabilidad. ¿Qué pasa en la cueva con la política óptima?",
        opciones: [
          { texto: "Cambian las flechas cerca de las paredes: conviene alejarse de ellas para no chocar al resbalar, aunque el camino sea más largo.", explicacion: "No: es la intuición típica, pero en esta cueva cambian 0 flechas. No hay pozos ni peligros, así que resbalar solo hace perder tiempo y la mejor dirección es la misma." },
          { texto: "Nada cambia: la política óptima es la misma, así que V*(S) sigue en 0,8262; lo único que varía es el largo de cada partida.", explicacion: "No: V es un retorno esperado. Si las partidas tardan más en promedio, el valor baja, aunque la política sea la misma." },
          { texto: "V*(S) baja de 0,8262 a 0,7742 y no cambia ninguna flecha; con la misma política, las partidas duran entre 21 y 29 pasos.", explicacion: "Correcto. Resbalar cuesta pasos y eso baja el valor esperado. Sin slip, las 12 partidas son la misma: 20 pasos." },
          { texto: "V*(S) baja, pero las partidas duran siempre 20 pasos, porque la política óptima sigue el camino más corto desde S.", explicacion: "No: con slip cada partida es distinta aunque la política sea la misma. En las 12 partidas del notebook el promedio fue 25,9 pasos." }
        ],
        correcta: 2
      },
      {
        objetivo: "O4",
        pregunta: "El robot de reciclaje, con α = 0,8, β = 0,4 y r_esperar = 1, tiene la batería baja. ¿Qué hace la política óptima y por qué?",
        opciones: [
          { texto: "Busca, porque buscar rinde 2 por turno, más que esperar (1) y que recargar (0), y la política se queda con el premio más alto.", explicacion: "No: la política se queda con la mayor Q, no con el mayor premio inmediato. Q(baja, buscar) = 13,64 es la más baja de las tres." },
          { texto: "Recarga: buscar arriesga un 60 % de agotarse y pagar el rescate de −3; buscar convendría recién con β > 0,863 (con α = 0,8).", explicacion: "Correcto. Q(baja, recargar) = 15,25, contra 14,73 de esperar y 13,64 de buscar. Si β supera 0,863 (con α = 0,8), arriesgarse vale la pena." },
          { texto: "Espera, porque no gasta batería y cobra 1 seguro, mientras que recargar le hace perder un turno sin ningún premio.", explicacion: "No: esperar (Q = 14,73) queda debajo de recargar (15,25). Con β = 0,4, esperar gana recién cuando r_esperar supera 1,53." },
          { texto: "Recarga, porque con batería baja recargar es siempre la mejor acción, cualquiera sea β o la recompensa por esperar.", explicacion: "No: depende de los parámetros. Con β > 0,863 conviene buscar, y con r_esperar alto conviene esperar. Nadie programó la regla: sale de resolver el MDP." }
        ],
        correcta: 1
      }
    ],
    actividad: {
      titulo: "Tu MDP chiquito",
      consigna: "Planteá como MDP un problema de un dominio propio con 3 a 5 estados y 2 o 3 acciones (regar o no una planta según qué tan seca está, estudiar o descansar según el cansancio, un tutor que elige un problema fácil o difícil). Escribí los estados, las acciones, las probabilidades P(s′|s,a), las recompensas R y el γ, y antes de resolverlo decí qué política esperás que salga y por qué. Si lo resolvés en el notebook, contá si salió lo que esperabas. Cerralo con la oración de «Para enseñarlo»: en cada estado, qué pasaría con cada acción, quedarse con la mejor y repetir hasta que nada cambie. Publicalo en Discussions; otra persona te devuelve con la rúbrica.",
      rubrica: [
        "El MDP está completo: estados, acciones, probabilidades que suman 1 para cada estado y acción, recompensas y un γ justificado.",
        "Se predice la política antes de resolver, con una razón que mire más allá del premio inmediato (por ejemplo, el riesgo de caer en un estado malo).",
        "Se dice qué parámetro (una probabilidad, una recompensa o γ) haría cambiar la política, y hacia cuál."
      ]
    }
  },

  "5": {
    objetivos: [
      "Estimar el valor de una política jugando, con Monte Carlo (promedio de retornos de partidas), sin conocer P ni R, y actualizarlo de forma incremental.",
      "Aplicar a mano una actualización de TD(0), explicar el error de diferencia temporal δ y relacionarlo con el error de predicción de recompensa de la dopamina.",
      "Comparar Monte Carlo y TD por cuándo actualizan y por sesgo y varianza, como intuición sobre la cueva.",
      "Explicar la equivalencia de certeza: armar P y R con lo jugado y resolver Bellman como en las clases 3 y 4."
    ],
    tiempo: { pagina: 35, notebook: 75 },
    previos: ["4"],
    requisitos: ["Haber hecho la clase 3: el valor V como retorno esperado y la ecuación de Bellman.", "De la clase 4, las flechas de la política óptima: acá se evalúan con un 70 % de pasos al azar."],
    cuestionario: [
      {
        objetivo: "O1",
        pregunta: "Sin mapa, tres partidas que pasaron por el cruce (5,6) dieron, desde su primera visita, retornos de 0,587, 0,914 y 0,362, en ese orden. ¿Cuánto estima Monte Carlo para V(cruce)?",
        opciones: [
          { texto: "0,638: el punto medio entre el retorno más bajo (0,362) y el más alto (0,914).", explicacion: "No: Monte Carlo promedia todos los retornos, no solo los extremos. El 0,587 también cuenta." },
          { texto: "0,362: el promedio incremental reemplaza el valor viejo por el retorno de la última partida.", explicacion: "No: eso sería α = 1. El incremental corrige solo una fracción α de la sorpresa G − V; con α = 1/n, la última partida pesa un tercio." },
          { texto: "0,621: el promedio de los tres, lo mismo que da el incremental V ← V + (1/n)(G − V).", explicacion: "Correcto. (0,587 + 0,914 + 0,362) / 3 = 0,621. Con α = 1/n el incremental pasa por 0,587, 0,751 y 0,621: es la misma cuenta, sin guardar los retornos." },
          { texto: "0,166: el incremental con α = 0,1 desde V = 0, que es el que corrige de a una partida.", explicacion: "No: esa cuenta da 0,166, pero no es el promedio. Con α fijo y pocas partidas el valor sigue pegado al 0 del que arrancó." }
        ],
        correcta: 2
      },
      {
        objetivo: "O2",
        pregunta: "TD(0) con α = 0,1 y γ = 0,99 ve un paso del cruce a (5,7) con r = 0. Antes del paso, V(cruce) = 0,4507 y V(5,7) = 0,5671. ¿Cuánto vale δ y cómo queda V(cruce)?",
        opciones: [
          { texto: "δ = 0 + 0,99 · 0,5671 − 0,4507 = +0,1107, y V(cruce) pasa a 0,4507 + 0,1 · 0,1107 = 0,4618.", explicacion: "Correcto. El objetivo r + γV(s′) = 0,5614 queda arriba de lo esperado: el paso salió mejor y V sube una décima parte de la sorpresa." },
          { texto: "δ = 0,5671 − 0,4507 = +0,1164, y V(cruce) pasa a 0,4623: con r = 0 no hace falta el γ.", explicacion: "No: γ descuenta el valor de la casilla siguiente aunque el premio sea 0. El objetivo es 0,99 · 0,5671 = 0,5614, no 0,5671." },
          { texto: "δ = +0,1107, y V(cruce) pasa directamente al objetivo r + γV(s′) = 0,5614.", explicacion: "No: eso sería α = 1. Con α = 0,1 se corrige una décima parte de δ, y V queda en 0,4618." },
          { texto: "Nada todavía: con r = 0 no hay información, y V(cruce) se corrige recién cuando termine la partida.", explicacion: "No: eso es Monte Carlo. TD corrige después de cada paso, usando lo que ya cree que vale (5,7), aunque no haya premio." }
        ],
        correcta: 0
      },
      {
        objetivo: "O2",
        pregunta: "En el notebook, el agente que ya aprendió juega una partida en la que la salida no paga: el δ del último paso da −0,968. ¿Qué tiene que ver esto con la dopamina?",
        opciones: [
          { texto: "Que el cerebro hace TD(0): las neuronas de dopamina guardan una tabla con el valor de cada lugar.", explicacion: "No: el recuadro marca ese límite. Que una señal se parezca a δ no quiere decir que el cerebro haga TD(0), y el cerebro no es una tabla de casillas." },
          { texto: "Que el curso demuestra que la dopamina causa la adicción: cada δ positivo empuja a repetir la conducta que lo produjo.", explicacion: "No: es un modelo de una señal neuronal medida en laboratorio, no una explicación de la conducta, del placer ni de la adicción." },
          { texto: "Que la dopamina mide el placer del premio: sube cuanto más grande es el jugo, esté anunciado o no.", explicacion: "No: si fuera placer, un premio anunciado la activaría igual. Pero, como δ, deja de responder al jugo cuando una señal lo anuncia (en el notebook, δ del último paso pasa de +1 a +0,032)." },
          { texto: "Que se parece a Schultz, Dayan y Montague (1997): si el jugo anunciado no llega, esas neuronas caen debajo de lo normal.", explicacion: "Correcto. δ es la sorpresa, lo que pasó menos lo que se esperaba. Con su límite: es un modelo de una señal neuronal, no una explicación de la conducta ni de la adicción." }
        ],
        correcta: 3
      },
      {
        objetivo: "O3",
        pregunta: "En la cueva, Monte Carlo y TD ven las mismas partidas. ¿Qué describe mejor lo que se midió en el notebook?",
        opciones: [
          { texto: "TD siempre gana: como corrige en cada paso, con cualquier cantidad de partidas tiene menos error que Monte Carlo, sea con α fijo o con 1/n.", explicacion: "No: a las 100 partidas TD con α = 0,1 tenía un error RMS de 0,5860, contra 0,0428 de Monte Carlo con 1/n. Corregir antes no es corregir mejor." },
          { texto: "MC espera al final y TD corrige en cada paso; TD arranca con sesgo y tiembla menos, pero acá ganó MC con 1/n.", explicacion: "Correcto. Con α = 0,1, a las 100 partidas las 10 semillas de TD estaban por debajo en el cruce; al final TD temblaba 0,0100 contra 0,0272. MC con 1/n terminó en 0,0055." },
          { texto: "Monte Carlo tiene sesgo, porque espera a que la partida termine, y TD no, porque usa el premio de cada paso.", explicacion: "No: está al revés. El sesgo es de TD, que se apoya en sus propias estimaciones (al principio, 0). El retorno de Monte Carlo es una muestra sin sesgo, pero tiembla más." },
          { texto: "Los dos corrigen en cada paso; la única diferencia es que Monte Carlo usa α = 1/n y TD un α fijo.", explicacion: "No: Monte Carlo necesita el retorno G, que se conoce al terminar la partida. Y también puede usar un α fijo: el notebook lo prueba con 0,03, 0,1 y 0,3." }
        ],
        correcta: 1
      },
      {
        objetivo: "O4",
        pregunta: "Con las mismas 300 partidas, la equivalencia de certeza tuvo un error RMS de 0,0101 y Monte Carlo, de 0,0169. ¿Qué hace la equivalencia de certeza y por qué le fue mejor?",
        opciones: [
          { texto: "Promedia los retornos como Monte Carlo, pero con un α más chico, así que tiembla menos al final.", explicacion: "No: no promedia retornos. Arma un mapa con lo jugado y resuelve Bellman, como en las clases 3 y 4." },
          { texto: "Usa la P y la R verdaderas de la cueva para corregir lo jugado, como hicimos para calcular el valor de referencia.", explicacion: "No: el agente nunca mira env.P ni env.R. Estima P̂ y R̂ contando; por eso sus filas tienen ruido (error máximo de P̂, 0,165)." },
          { texto: "Cuenta transiciones y premios, estima P̂ y R̂, y resuelve Bellman; cada casilla aprovecha lo visto en sus vecinas.", explicacion: "Correcto. Cada paso jugado informa una fila de P̂ y Bellman combina todas. El precio: guardar una tabla de 60 × 60 y resolver un sistema cada vez." },
          { texto: "Cuenta transiciones y resuelve Bellman, y conviene siempre, también con millones de estados, porque usa todos los datos.", explicacion: "No: con millones de estados la tabla P̂ no entra en memoria y el sistema no se puede resolver. Monte Carlo y TD guardan un número por casilla." }
        ],
        correcta: 2
      }
    ],
    actividad: {
      titulo: "Predecir y corregir",
      consigna: "Durante una semana, predecí cada día algo cotidiano que se pueda medir: cuánto tarda un trayecto, cuánto cuesta una compra, cuántas páginas leés. Anotá la predicción, lo que pasó y el δ del día (lo que pasó menos lo que esperabas), y corregí la predicción del día siguiente con un α que elijas: V ← V + α · δ. Al final, compará con lo que habría dado esperar al último día y promediar toda la semana (Monte Carlo), y contá qué convenía en tu caso. Cerralo con la oración de «Para enseñarlo»: Monte Carlo espera a ver cómo termina; TD corrige en cada paso con lo que esperaba del paso siguiente. Publicalo en Discussions; otra persona te devuelve con la rúbrica.",
      rubrica: [
        "Hay una tabla de los siete días con predicción, resultado, δ (con su signo) y predicción corregida, y las cuentas con el α elegido están bien.",
        "El α está justificado (cuánto cambia de un día a otro lo que se predice) y se dice qué habría pasado con un α más grande o más chico.",
        "Se compara corregir cada día con esperar al final de la semana, y la conclusión usa cuándo actualiza cada método y cuánto tiembla la predicción."
      ]
    }
  },

  "6": {
    objetivos: [
      "Explicar por qué, sin mapa, conviene aprender Q(s,a) en lugar de V para elegir, y por qué el agente tiene que probar acciones (ε-greedy).",
      "Aplicar a mano una actualización de SARSA y una de Q-learning con α, r y γ.",
      "Distinguir SARSA (on-policy) de Q-learning (off-policy) por el término objetivo y prever qué valores aprende cada uno cuando el agente explora.",
      "Leer el mapa de visitas y relacionarlo con los errores de lo aprendido."
    ],
    tiempo: { pagina: 35, notebook: 75 },
    previos: ["5"],
    requisitos: ["Haber hecho la clase 5: TD(0) y el error δ, la sorpresa con la que se corrige un valor después de cada paso.", "De la clase 4, Q(s,a) y la mejora de política: en cada casilla, quedarse con la acción de mayor Q."],
    cuestionario: [
      {
        objetivo: "O1",
        pregunta: "Sin mapa, alguien le sopla al agente el V* de cada casilla vecina del cruce (5,6): por ejemplo, V*(5,7) = 0,9321. ¿Por qué eso no le alcanza para elegir y conviene aprender Q(s,a)?",
        opciones: [
          { texto: "Porque sin mapa los V* de las vecinas no se pueden conocer bien; en cambio, las Q aprendidas jugando salen exactas desde la primera partida.", explicacion: "No: el problema no es la precisión de V. Aunque V* sea exacto, falta saber adónde lleva cada flecha. Y las Q aprendidas también arrancan en 0 y tardan en asentarse." },
          { texto: "Para pasar de V a una flecha hay que saber adónde lleva cada acción, y eso es P; Q(s,a) trae el número pegado a la flecha.", explicacion: "Correcto. Con el mapa, Q(cruce, →) = 0 + 0,99 · 0,9321 = 0,9227 usa P para saber que → lleva a (5,7). Sin mapa, se aprende directamente Q(s,a) y se elige la mayor." },
          { texto: "Porque V no incluye el descuento γ y Q sí: por eso Q(cruce, →) da 0,9227 y no 0,9321, y solo con Q se comparan bien las flechas.", explicacion: "No: V* ya está descontado. La diferencia entre 0,9321 y 0,9227 es el paso que lleva de una casilla a la otra, y para saber qué flecha da ese paso hace falta P." },
          { texto: "No hace falta Q: alcanza con ir siempre hacia la vecina de mayor V, sin probar otras acciones, porque V ya dice cuál es la mejor casilla.", explicacion: "No: para saber qué flecha lleva a esa vecina hace falta P (y con piso resbaloso ni siquiera alcanza la dirección). Además, sin probar (ε = 0) el agente encontró la salida en 1 de 8 semillas." }
        ],
        correcta: 1
      },
      {
        objetivo: "O2",
        pregunta: "SARSA, con α = 0,2 y γ = 0,99, ve el paso de (3,6) con ↑ a (2,6), r = 0, y Q(s,↑) = 0,3378. En s′ las Q son ↑ 0,3865, → 0,2755, ↓ 0,1204 y ← 0,2372, y la acción siguiente salió al azar: a′ = ←. ¿Cómo queda Q(s,↑)?",
        opciones: [
          { texto: "Sube a 0,3468: el objetivo es 0 + 0,99 · 0,3865 = 0,3827, porque se usa la mejor flecha de s′.", explicacion: "No: eso es Q-learning. SARSA usa la acción que de verdad va a tomar, a′ = ←, aunque haya salido al azar y valga menos que la mejor." },
          { texto: "Baja a 0,2348: Q(s,↑) pasa directamente al objetivo 0 + 0,99 · 0,2372, el valor de la acción que tomó.", explicacion: "No: eso sería α = 1. Con α = 0,2 se corrige una quinta parte del error δ = −0,1030." },
          { texto: "Queda en 0,3378: como a′ salió al azar y no es la mejor flecha, ese paso no se usa para aprender.", explicacion: "No: SARSA aprende de todos los pasos, también de los que exploran. Justamente por eso le cobra a la flecha ↑ el desvío que viene después." },
          { texto: "Baja a 0,3172: objetivo 0,99 · 0,2372 = 0,2348, δ = 0,2348 − 0,3378 = −0,1030 y Q ← 0,3378 + 0,2 · (−0,1030).", explicacion: "Correcto. La acción siguiente vale menos que lo que ya creía de ↑, así que δ es negativo y Q(s,↑) baja: SARSA aprende de lo que de verdad hace." }
        ],
        correcta: 3
      },
      {
        objetivo: "O2",
        pregunta: "Q-learning, con α = 0,2 y γ = 0,99, ve el mismo paso: de (3,6) con ↑ a (2,6), r = 0, Q(s,↑) = 0,3378, y en s′ ↑ 0,3865, → 0,2755, ↓ 0,1204, ← 0,2372 (después tomó ←, al azar). ¿Cuánto vale δ y cómo queda Q(s,↑)?",
        opciones: [
          { texto: "δ = 0 + 0,99 · 0,3865 − 0,3378 = +0,0449, y Q(s,↑) sube a 0,3378 + 0,2 · 0,0449 = 0,3468.", explicacion: "Correcto. El objetivo usa la mejor flecha de s′ (↑, 0,3865), aunque después el agente tome ←. Con la misma experiencia, SARSA lo había dejado en 0,3172." },
          { texto: "δ = 0,99 · 0,2372 − 0,3378 = −0,1030, y Q(s,↑) baja a 0,3172, porque el objetivo usa la acción ← que el agente tomó.", explicacion: "No: esa es la cuenta de SARSA. Q-learning cambia un solo término: en vez de la acción que va a tomar, usa el máximo de Q en s′." },
          { texto: "δ = 0,3865 − 0,3378 = +0,0487, y Q(s,↑) sube a 0,3475: con r = 0 no hace falta el γ.", explicacion: "No: γ descuenta el valor de s′ aunque el premio sea 0. El objetivo es 0,99 · 0,3865 = 0,3827, y δ = +0,0449." },
          { texto: "δ = +0,0449, y Q(s,↑) pasa a 0,8864, su Q*, porque Q-learning aprende el valor óptimo y no el de lo que juega.", explicacion: "No: aprende hacia Q*, pero de a un paso. Cada actualización mueve Q una fracción α de δ: queda en 0,3468, todavía lejos de 0,8864." }
        ],
        correcta: 0
      },
      {
        objetivo: "O3",
        pregunta: "Tras 20 000 partidas con inicio al azar y ε = 0,5, el max Q(S) de SARSA quedó en 0,6734 y el de Q-learning en 0,8262 (V*(S) = 0,8262), los dos con 100 % de flechas óptimas. Con ε = 0,1 quedaron en 0,7523 y 0,7545. ¿Qué lo explica?",
        opciones: [
          { texto: "SARSA aprende peor que Q-learning: con ε = 0,5 muchas de sus flechas quedan desordenadas por tanta exploración, y por eso el valor que le da a S es más bajo.", explicacion: "No: con ε = 0,5 los dos tienen 100 % de flechas óptimas. La diferencia no está en las flechas sino en qué valor estima cada uno." },
          { texto: "Q-learning se equivoca por arriba: jugando con ε = 0,5 nadie cobra 0,8262, así que el valor correcto de S es el que encontró SARSA.", explicacion: "No: no hay un solo valor correcto. Q-learning estima V*, el valor de jugar perfecto; SARSA, el de jugar como juega, explorando. Cada uno acierta lo que mide." },
          { texto: "SARSA pone en el objetivo la acción que toma: aprende el valor de jugar explorando (0,6734, como con el mapa); Q-learning usa el máximo y aprende V*.", explicacion: "Correcto. SARSA es on-policy y Q-learning off-policy. Con ε = 0,1 quedan parejos: la exploración pesa poco y Q-learning, que explora poco, no siempre encuentra el camino más corto." },
          { texto: "La diferencia viene de α: SARSA necesita un α más chico, así que con ε = 0,5 todavía no llegó a converger en 20 000 partidas.", explicacion: "No: los dos usan el mismo α, y SARSA está asentado (0,6734 ± 0,0022 entre semillas). Más partidas no lo acercan a V*: su objetivo apunta a otro valor." }
        ],
        correcta: 2
      },
      {
        objetivo: "O4",
        pregunta: "Q-learning con ε = 0,1, 2000 partidas, 5 semillas. Error medio del valor según las visitas: 0–9, 0,9305; 10–99, 0,4130; 100–999, 0,5580; 1000 o más, 0,0775. En la semilla 0, las 8 casillas nunca pisadas que lista el notebook tienen error entre 0,91 y 0,95. ¿Qué se lee?",
        opciones: [
          { texto: "Más visitas, siempre menos error: cada visita corrige un poco el valor, así que el error baja de manera pareja con la cantidad de pasos por la casilla.", explicacion: "No: la tabla no baja de manera pareja. Las casillas con 100 a 999 visitas tienen más error medio (0,56) que las de 10 a 99 (0,41)." },
          { texto: "El error alto de las casillas nunca pisadas se debe a que tienen la flecha equivocada; donde la flecha de mayor Q es la óptima, el error es casi 0.", explicacion: "No: el error es del valor, no de la flecha. (1,12) nunca se pisó, su flecha es óptima por azar del ruido inicial, y su error es 0,9227." },
          { texto: "Es un problema de α: con un α más grande, el agente corregiría también las casillas sin visitas, sin tener que pasar por ellas.", explicacion: "No: sin visitas no hay ninguna actualización, sea cual sea α. El agente solo aprende de las casillas por las que pasa." },
          { texto: "Donde nunca pisó, Q quedó en casi 0 y el error es casi todo V*; pero pisar no alcanza: con 100–999 visitas el error (0,56) supera al de 10–99 (0,41).", explicacion: "Correcto. Hay casillas que se pisan cientos de veces, pero solo de paso, explorando, y no asientan su valor. El error es casi 0 solo sobre el camino que usa, con miles de visitas." }
        ],
        correcta: 3
      }
    ],
    actividad: {
      titulo: "Tu camino de todos los días",
      consigna: "Elegí un recorrido que hacés seguido y que tenga varias rutas posibles: ir al trabajo o a la facultad, volver a casa, ir al súper. Durante una semana anotá qué ruta tomaste cada día, si fue la que creías mejor o una que probaste, y cuánto tardaste. Contá tu ε: qué fracción de los días probaste otra ruta. Después decí qué número te hacés del trayecto: ¿es lo que tardás de verdad, con tus pruebas y desvíos incluidos (lo que aprende SARSA), o lo que tardarías si fueras siempre por la mejor (lo que aprende Q-learning)? Contá qué pasaría con esa estimación si probaras más o menos seguido. Cerralo con la oración de «Para enseñarlo»: SARSA aprende de lo que de verdad hago; Q-learning, de lo mejor que podría hacer desde ahí. Publicalo en Discussions; otra persona te devuelve con la rúbrica.",
      rubrica: [
        "Hay un registro de la semana con la ruta de cada día, si fue la mejor conocida o una prueba, y el tiempo; el ε está bien contado a partir de ese registro.",
        "Se distinguen dos estimaciones del trayecto, la de lo que de verdad se hace (con las pruebas) y la de lo mejor posible, con números del registro, y se dice cuál se parece a SARSA y cuál a Q-learning.",
        "Se prevé qué cambiaría con un ε más grande o más chico: cuánto se aleja la estimación «de lo que hago» de la «mejor posible» y qué rutas se dejarían de conocer."
      ]
    }
  },

  "7": {
    objetivos: [
      "Plantear un problema como bandit y comparar una prueba A/B fija, ε-greedy y UCB por su arrepentimiento acumulado (regret).",
      "Explicar el optimismo ante la incertidumbre (UCB, valores iniciales altos, bonificación por conteo) y por qué ayuda cuando la recompensa es escasa.",
      "Explicar por qué ε-greedy no encuentra la salida cuando la recompensa es escasa y cómo Go-Explore separa volver de explorar.",
      "Reconocer el límite de volver exactamente a un estado: con acciones pegajosas o piso resbaloso, memorizar la secuencia de acciones deja de funcionar."
    ],
    tiempo: { pagina: 40, notebook: 75 },
    previos: ["6"],
    requisitos: ["Haber hecho la clase 6: ε-greedy y Q-learning, y el mapa de visitas.", "De la clase 4, el piso resbaloso: con cierta probabilidad el agente se resbala a un costado."],
    cuestionario: [
      {
        objetivo: "O1",
        pregunta: "Cuatro anuncios, 200 campañas de 20 000 impresiones. Regret promedio al final: A/B fijo (500 de cada uno y después el ganador) 69,2 clics; ε-greedy con ε = 0,1, 89,6; UCB, 36,7. ¿Qué se lee?",
        opciones: [
          { texto: "ε-greedy perdió más porque eligió mal: como A/B fijo, en muchas campañas se quedó para siempre con un anuncio peor.", explicacion: "No: lo que lo deja último es que nunca deja de probar. Aunque ya sepa cuál es el mejor, el 10 % al azar le cuesta un piso de 3,5 clics cada 2000 impresiones, que no se va nunca." },
          { texto: "El regret mide cuántos clics se perdieron por probar, así que ningún método puede quedar debajo de A/B fijo, que prueba solo 2000.", explicacion: "No: se mide contra mostrar siempre el mejor y suma también lo que se pierde por elegir mal. A/B fijo eligió mal en el 12 % de las campañas y siguió perdiendo; UCB perdió la mitad." },
          { texto: "ε-greedy sigue mostrando uno al azar el 10 % de las veces, para siempre; UCB prueba cada vez menos y su curva se aplana.", explicacion: "Correcto. Por tramo de 2000 impresiones, ε-greedy baja hacia un piso de 3,5 clics y UCB pasa de 16,4 a 1,0. A/B fijo deja de probar a las 2000, pero las campañas que eligieron mal pierden para siempre." },
          { texto: "El peor es A/B fijo: en las primeras 2000 impresiones perdió 35,0 clics, contra 23,2 de ε-greedy y 16,4 de UCB.", explicacion: "No: al principio pierde más, pero después pierde 3,8 por tramo y ε-greedy lo pasa. Lo que importa es la forma de la curva entera, no un tramo." }
        ],
        correcta: 2
      },
      {
        objetivo: "O2",
        pregunta: "UCB con c = 0,2 en la impresión t = 300 (ln t = 5,704). Llevan: A 5 clics en 125, B 4 en 108, C 0 en 34 y D 0 en 33. Puntaje = promedio + c · √(ln t / n). ¿Qué anuncio muestra y por qué?",
        opciones: [
          { texto: "D: su puntaje, 0 + 0,2 · √(5,704 / 33) = 0,0831, queda apenas arriba de B (0,0830), A (0,0827) y C (0,0819).", explicacion: "Correcto. D no gana porque UCB crea que es mejor, sino porque se probó poco y todavía no sabe si lo es. Si sigue sin clics, su n sube, la bonificación baja y deja de ganar." },
          { texto: "A: tiene el mayor promedio (0,0400), y UCB muestra el mejor hasta ahora salvo cuando le toca probar al azar.", explicacion: "No: eso es ε-greedy. UCB no sortea; suma una bonificación que es grande si se probó poco, y con ella A queda en 0,0827, debajo de D." },
          { texto: "C: es el mejor de verdad (5,5 %), y la bonificación está para encontrar justamente al mejor anuncio.", explicacion: "No: UCB no conoce las probabilidades verdaderas. C lleva 0 clics en 34 por mala suerte y su puntaje, 0,0819, es el más bajo. Lo encuentra más adelante." },
          { texto: "A o B: C y D tienen promedio 0 sin un solo clic, así que UCB los deja de lado hasta que los otros fallen.", explicacion: "No: UCB no descarta lo que no tuvo clics; la bonificación le da el beneficio de la duda. D, con el n más chico (33), tiene la bonificación más alta: 0,0831." }
        ],
        correcta: 0
      },
      {
        objetivo: "O3",
        pregunta: "En la cueva grande (155 casillas, camino más corto de 44 pasos, partidas de 300 pasos), con 30 000 pasos, Q-learning con ε-greedy llegó a la salida en 1 de 20 semillas (5 %), con ε = 0,1 y con 0,3; al azar, en 0. ¿Por qué?",
        opciones: [
          { texto: "Porque ε es chico: con ε = 0,3 o más probaría lo suficiente y llegaría a la salida en casi todas las semillas.", explicacion: "No: con ε = 0,3 pisa más casillas (100 de 155 en promedio) y llega igual en 1 de 20. El problema no es cuánto prueba, sino que prueba sin dirección." },
          { texto: "Porque Q-learning no aprende con recompensa escasa: cuando por fin llega a la salida, no actualiza las Q del camino.", explicacion: "No: cuando llega, actualiza como en la clase 6. El problema es antes: casi nunca llega, y sin premio todas las Q siguen en 0." },
          { texto: "Porque 30 000 pasos no alcanzan para recorrer una cueva de 155 casillas: con ese presupuesto, nadie llegaría.", explicacion: "No: el optimista (Q0 = 1) pisó las 155 casillas y llegó en las 20 semillas, con una mediana de 8666 pasos. El presupuesto alcanza si se explora con dirección." },
          { texto: "Hasta el primer premio las Q valen 0 y «la mejor» no dice nada; probar al azar no distingue lo visitado de lo nuevo.", explicacion: "Correcto. Sin recompensa, ε-greedy es una caminata al azar con costumbres: cada partida arranca en S y las visitas se apagan con la distancia." }
        ],
        correcta: 3
      },
      {
        objetivo: "O3",
        pregunta: "Con los mismos 30 000 pasos en la cueva grande, Go-Explore volviendo por restauración llegó a la salida en 20 de 20 semillas; la bonificación por conteo sola, en 0 de 20. ¿Qué hace Go-Explore?",
        opciones: [
          { texto: "Le suma a Q una bonificación que crece en las casillas poco visitadas, como el conteo, pero con un β más grande.", explicacion: "No: Go-Explore no tiene tabla Q ni bonificación. Y el conteo solo falla por otra razón: en una tabla, una flecha nunca probada vale 0, menos que lo conocido, y el agente da vueltas por lo que ya conoce." },
          { texto: "Guarda un archivo de lugares, elige uno (más seguido cuanto menos visto), vuelve sin explorar y explora desde ahí.", explicacion: "Correcto. Arrancar desde el borde de lo conocido evita el desapego (nada se olvida) y el descarrilamiento (la vuelta no explora). Restaurando, la mediana fue de 4620 pasos." },
          { texto: "Guarda la mejor partida y la repite con ε-greedy, así explora siempre cerca del camino que ya funcionó.", explicacion: "No: volver explorando es lo que descarrila. Go-Explore separa: primero vuelve sin explorar a una celda del archivo y después explora 30 pasos al azar desde ahí." },
          { texto: "Explora al azar desde S, como el dado puro, pero con partidas más largas, y así llega más lejos de la entrada.", explicacion: "No: el dado puro arranca siempre en S y no se aleja (0 de 20). Go-Explore arranca cada iteración en una celda del archivo, no en S." }
        ],
        correcta: 1
      },
      {
        objetivo: "O4",
        pregunta: "Go-Explore guardó la secuencia que guardó Go-Explore sin bucles, de 52 acciones, que en la cueva determinista lleva de S a la salida. Repetida 1000 veces con acciones pegajosas, llega el 44,1 % de las veces con p = 0,05 y el 0,9 % con p = 0,25. ¿Qué se lee?",
        opciones: [
          { texto: "Una traba hace perder un paso, pero la secuencia sigue el rumbo; con partidas más largas llegaría casi siempre.", explicacion: "No: después de una traba el agente queda corrido una casilla y el resto de la secuencia ya no corresponde al lugar donde está: choca y termina en cualquier parte. Más pasos no lo arreglan." },
          { texto: "La secuencia estaba mal guardada: una sin rodeos, como el camino más corto de 44 pasos, llegaría igual con p = 0,25.", explicacion: "No: una más corta tiene menos pasos para trabarse, pero sigue sin poder corregir una traba. El problema es que no mira dónde está." },
          { texto: "Una secuencia memorizada no sabe dónde está: tras una traba se desvía y no se corrige. Por eso Machado et al. (2018) propusieron evaluar en Atari con p = 0,25.", explicacion: "Correcto. Con p = 0,25 casi nunca llega: así un agente no puede ganar memorizando botones. Lo que cuenta es una política que mira dónde está, no una secuencia que funcionó una vez." },
          { texto: "Las acciones pegajosas castigan a cualquier agente por igual, así que en Atari se evalúa sin ellas para medir lo aprendido.", explicacion: "No: está al revés. Machado et al. propusieron evaluar con p = 0,25 justamente para que memorizar no alcance; una política que mira dónde está se recupera de una traba." }
        ],
        correcta: 2
      }
    ],
    actividad: {
      titulo: "¿Explorar o volver al de siempre?",
      consigna: "Elegí una decisión que repetís seguido y que tenga varias opciones: dónde almorzar, qué ruta tomar, qué café comprar. Durante una semana anotá qué elegiste cada vez, si fue tu opción de siempre o una que probaste, y cuánto te gustó (de 0 a 10, o el tiempo que tardaste). Después estimá tu «regret» de la semana dos veces, contra la mejor opción que conocés al final: si hubieras ido siempre a la de siempre, y con lo que de verdad hiciste. Contá si probar te costó o te hizo encontrar algo mejor. Proponé una regla tipo UCB para la semana que viene: a cada opción, su promedio más una bonificación que crezca si la probaste poco, y decí qué elegirías mañana con esa regla. Cerralo con la oración de «Para enseñarlo»: explorar es pagar hoy por saber algo que mañana te deja elegir mejor; cuando el premio es raro, conviene ir adonde menos estuviste. Publicalo en Discussions; otra persona te devuelve con la rúbrica.",
      rubrica: [
        "Hay un registro de la semana con la opción de cada vez, si fue la de siempre o una prueba, y cuánto rindió; las opciones y los puntajes son concretos.",
        "Se estima el regret de la semana en los dos escenarios (siempre lo de siempre y lo que de verdad se hizo) con números del registro, y se dice qué se pagó y qué se ganó por probar.",
        "La regla tipo UCB tiene un promedio y una bonificación que crece si se probó poco, está aplicada a las opciones del registro y dice qué elegiría mañana y por qué."
      ]
    }
  }
};
