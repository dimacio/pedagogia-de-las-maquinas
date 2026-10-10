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
          { texto: "No: con el mismo conteo puede estar en casillas distintas, que llevan a otros lados.", explicacion: "Correcto. Después de 6 pasos, la historia A está en (3,3) y seis pasos hacia abajo desde S dejan en (7,1); con el mismo conteo y la misma acción, la próxima casilla cambia. El conteo no cumple el supuesto de Markov." },
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
  }
};
