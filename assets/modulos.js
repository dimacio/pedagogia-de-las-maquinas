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
  },

  "8": {
    objetivos: [
      "Leer la tabla Q como una matriz de casillas × acciones y como una función, y explicar por qué una red con entrada one-hot equivale a la tabla.",
      "Explicar con un ejemplo qué es generalizar y cuándo engaña (vecinas separadas por una pared).",
      "Nombrar los ingredientes de DQN (memoria de repetición, red objetivo, ε decreciente) y para qué sirve cada uno, incluido el objetivo que se mueve.",
      "Describir cómo se compara un agente de forma justa: varias semillas, curvas de aprendizaje y azar en el entorno."
    ],
    tiempo: { pagina: 35, notebook: 90 },
    previos: ["6", "7"],
    requisitos: ["De la clase 6, Q-learning con su tabla Q y ε-greedy.", "De la clase 7, que en Atari cada pantalla es un estado y no hay tabla posible."],
    cuestionario: [
      {
        objetivo: "O1",
        pregunta: "En el notebook, una red sin capas ocultas con entrada one-hot (60 números en 0 salvo un 1 en la casilla) tiene 240 parámetros, tantos como números tiene la tabla Q. Entrenadas con las mismas 20 000 transiciones, la diferencia máxima entre las dos es 0. ¿Por qué?",
        opciones: [
          { texto: "Con 240 parámetros la red tiene la capacidad justa para copiar Q*, así que cualquier entrada que le diéramos terminaría en la misma tabla.", explicacion: "No: no importa cuántos parámetros hay sino a qué casillas toca cada uno. La red con coordenadas tiene 4612 y, aun con el Q* correcto de las 59 casillas, acierta la flecha en el 71 %." },
          { texto: "Con el one-hot cada peso es de una sola casilla y flecha: un paso de gradiente toca 1 de los 240 pesos y repite la regla de Q-learning.", explicacion: "Correcto. Con la transición de (8,11) a la salida solo W[→, 58] tiene gradiente y queda en 0,50, igual que la tabla. Por eso tampoco generaliza: lo que aprende en una casilla no le dice nada a la de al lado." },
          { texto: "Las dos llegan a Q* por caminos distintos: la red mueve todos sus pesos en cada paso, pero al final converge al mismo punto que la tabla.", explicacion: "No: no hay caminos distintos, son idénticas paso a paso, porque el gradiente es 0 salvo en un peso. Mover casi todos los pesos en cada paso es lo que hace la red de seis entradas." },
          { texto: "La red generaliza entre casillas vecinas y la tabla no, pero con 20 000 transiciones se visitan todas y esa ventaja deja de notarse.", explicacion: "No: la red one-hot no generaliza nada, porque cada casilla prende un número distinto y ninguna se parece a otra. Empieza a generalizar cuando la entrada son las coordenadas." }
        ],
        correcta: 1
      },
      {
        objetivo: "O2",
        pregunta: "Las casillas (7,6) y (7,8) están a dos columnas, con una pared en el medio: V* vale 0,9044 y 0,9606. Una red que recibe solo la fila y la columna, entrenada con el Q* correcto de las 59 casillas, elige → en (7,6), contra la pared. ¿Qué pasó?",
        opciones: [
          { texto: "Le faltaron datos: (7,6) fue una casilla poco visitada, y con más partidas en esa zona la red habría aprendido que conviene ir hacia ↑.", explicacion: "No: acá la red recibió el Q* correcto de las 59 casillas, sin esconderle ninguna, y aun así acierta la flecha en solo el 71 % de las casillas. No es falta de datos." },
          { texto: "La red se equivoca mucho en el valor de esa zona: estima (7,6) muy por encima de 0,9044 y por eso cree que → la acerca a la salida.", explicacion: "No: el error en el valor es chico (0,9064 contra 0,9044). Pasa que las flechas de una casilla se diferencian en un 1 o un 2 %, y un error chico alcanza para elegir mal." },
          { texto: "Una tabla tendría el mismo problema junto a esa pared: cualquier método que estime Q confunde dos casillas que están tan cerca.", explicacion: "No: la tabla guarda un número independiente por casilla y flecha, y junto a una pared no se equivoca así. Confundir vecinas es el precio de generalizar." },
          { texto: "Las dos entradas son casi iguales y la red suaviza el salto: → desde (7,6) se parece a estar en (7,8). Con bigotes acierta el 97 %.", explicacion: "Correcto. La red estima 0,9064 y 0,9528 contra 0,9044 y 0,9606: le sube el valor a una y se lo baja a la otra. Con bigotes, que dicen dónde hay pared, (7,6) elige ↑ y el acierto pasa del 71 % al 97 %." }
        ],
        correcta: 3
      },
      {
        objetivo: "O3",
        pregunta: "En la cueva, la misma red (6 → 64 → 64 → 4) aprende Q con cuatro variantes. En la semilla 0, solo con red objetivo, el Q más alto llega a 3,25 y la política sale desde el 0 % de las casillas; con red objetivo y memoria (DQN), desde el 97 %. ¿Para qué sirve la red objetivo?",
        opciones: [
          { texto: "Congela el objetivo: una copia puesta al día cada 40 pasos calcula r + γ max Q y la red lo puede alcanzar. Frena la explosión, pero sola no alcanza.", explicacion: "Correcto. Sin trucos el Q más alto llega a 128,83; con red objetivo, a 3,25. Pero la red sigue aprendiendo de lo último que vivió, y hace falta la memoria para que la política salga." },
          { texto: "Guarda la mejor versión de la red hasta el momento y la usa para elegir las flechas, así la política no empeora mientras la otra sigue aprendiendo.", explicacion: "No: la copia calcula el objetivo, no elige las acciones, y se pone al día cada 40 pasos sea mejor o peor. Las flechas las elige la red que aprende, con ε-greedy." },
          { texto: "Reemplaza a la memoria de repetición: con el objetivo quieto ya no importa de qué transiciones aprende, y la política sale desde casi todas las casillas.", explicacion: "No: solo con red objetivo la política sale desde el 0 % de las casillas. Cada ingrediente arregla un problema distinto, y DQN necesita los dos." },
          { texto: "Baja ε de 1 a 0,1 a medida que la red aprende, para que el agente deje de explorar cuando los valores ya se parecen a los verdaderos.", explicacion: "No: el ε que baja es otro ingrediente; en la cueva baja de 1 a 0,1 en los primeros 4000 pasos en las cuatro variantes. La red objetivo no toca la exploración." }
        ],
        correcta: 0
      },
      {
        objetivo: "O3",
        pregunta: "Sin trucos, la red llega a creer que una casilla vale 128,83, cuando ninguna puede pasar de 1. Con solo memoria de repetición (las últimas 10 000 transiciones, lotes al azar de 256), el Q más alto llega a 13,63 y, en la semilla 0, la política sale desde el 0 %. ¿Qué hace la memoria?",
        opciones: [
          { texto: "Guarda las partidas que llegaron a la salida y las repite más seguido que las otras, para que la red aprenda primero lo que dio premio.", explicacion: "No: los lotes se toman al azar de las últimas 10 000 transiciones, sin preferir las que dieron premio. Lo que importa es que mezclan partidas distintas." },
          { texto: "Deja quieto el objetivo: como las transiciones guardadas son viejas, el objetivo que se calcula con ellas ya no cambia en cada paso.", explicacion: "No: el objetivo se sigue calculando con la red que se mueve; viejas son las transiciones, no la red. Por eso, solo con memoria, los valores se disparan al principio." },
          { texto: "La red aprende de lotes que mezclan partidas en vez de los últimos pasos, casi iguales; eso frena mucho, pero el objetivo se sigue moviendo.", explicacion: "Correcto. Es el ejemplo del peso solo: con A → B llega a 27,30 en 60 pasos y sigue creciendo, y mezclado con B → salida se asienta en 0,5862. Sin red objetivo, el objetivo se mueve con cada paso y la política no sale." },
          { texto: "Le da a la red más experiencia que la que juntó el agente sin trucos, y con más experiencia una red ya no puede sobreestimar los valores.", explicacion: "No: las dos variantes juegan los mismos 10 000 pasos y la memoria reusa esas transiciones. Y con memoria sola el Q más alto igual llega a 13,63, muy por encima de 1." }
        ],
        correcta: 2
      },
      {
        objetivo: "O4",
        pregunta: "En la cueva, la semilla 0 de DQN sale desde el 100 % de las casillas en el paso 5000; Q-learning con red sin trucos, en la misma semilla, termina en el 3 %. ¿Qué hace falta para decir que DQN es mejor?",
        opciones: [
          { texto: "Nada más: si una corrida llega al 100 % y la otra se queda en el 3 %, la diferencia es tan grande que no puede deberse a la suerte.", explicacion: "No: en el paso 5000 el promedio de las cinco semillas de DQN es 68 % ± 36 %, y la semilla 2 termina en 84 %. Una corrida dice cuánto dio esa semilla, no cuánto da el método." },
          { texto: "Correr los dos con varias semillas y mirar la curva entera con su dispersión: con 5, DQN termina en 94 % ± 5 % y sin trucos en 1 % ± 1 %.", explicacion: "Correcto. Con el mismo presupuesto de pasos para los dos y, si se puede, azar en el entorno, como las acciones pegajosas de la clase 7: es lo que piden Machado et al. (2018)." },
          { texto: "Tomar la mejor semilla de cada método y comparar sus picos, porque el pico muestra hasta dónde puede llegar cada uno cuando aprende bien.", explicacion: "No: eso es elegir la corrida con suerte en el momento justo. El pico de la semilla 0 (100 %) cuenta mucho más que el promedio de las cinco en ese mismo paso (68 % ± 36 %)." },
          { texto: "Comparar solo el final de la semilla 0, que es la misma para los dos, así la comparación queda pareja: 97 % contra 3 % al terminar.", explicacion: "No: usar la misma semilla no hace pareja la comparación, porque fija pesos, partidas y exploración que pueden favorecer a uno. El final de DQN va de 84 % a 97 % según la semilla." }
        ],
        correcta: 1
      }
    ],
    actividad: {
      titulo: "¿Dónde generaliza mal?",
      consigna: "Pensá un ejemplo propio, fuera de la cueva, en el que dos situaciones que se describen casi igual piden decisiones distintas, como (7,6) y (7,8), vecinas separadas por una pared: dos paradas de colectivo a una cuadra pero de lados opuestos de una autopista, dos pacientes con los mismos síntomas y distinta alergia, dos jugadas que solo cambian en una pieza. Contá qué datos describen hoy cada situación, por qué con esos datos alguien (o una red) que generaliza las trataría igual y qué error cometería. Después decí qué dato agregarías para distinguirlas, como los bigotes que le dicen a la red dónde hay pared, y si ese dato arruinaría la generalización en casos que sí se parecen. Cerralo con la oración de «Para enseñarlo»: una red es una tabla que comparte números entre casillas: aprende más rápido de lo que no vio, y por eso también se equivoca en lo que no vio. Publicalo en Discussions; otra persona te devuelve con la rúbrica.",
      rubrica: [
        "El ejemplo es propio y concreto: dos situaciones con una descripción casi igual, dicha con sus datos, que piden decisiones distintas.",
        "Se explica por qué con esa descripción quien generaliza las trataría igual y qué decisión equivocada tomaría en una de las dos, como la red que elige → contra la pared en (7,6).",
        "Se propone un dato concreto que las distingue, se dice por qué alcanza (como los bigotes, que llevan la red del 71 % al 97 % de flechas óptimas) y si afecta a casos que sí se parecen."
      ]
    }
  },

  "9": {
    objetivos: [
      "Distinguir observación de estado y explicar por qué la cueva con solo bigotes es un POMDP que pide memoria.",
      "Generar texto con n-gramas de letras y explicar su límite: nunca recuerdan más de n − 1 letras y con n grande copian.",
      "Describir una red recurrente (hₜ = tanh(W_hh hₜ₋₁ + W_xh xₜ + b)) y comparar un agente con memoria (GRU) contra uno sin memoria.",
      "Explicar por qué un modelo de lenguaje es esta misma idea a escala: un estado que resume lo leído para predecir lo que sigue."
    ],
    tiempo: { pagina: 35, notebook: 90 },
    previos: ["8", "3"],
    requisitos: ["De la clase 2, la diferencia entre historia y estado; de la clase 3, la cadena de Markov.", "De la clase 8, la red como función: entra un vector, sale una predicción, y se entrena ajustando sus pesos."],
    cuestionario: [
      {
        objetivo: "O1",
        pregunta: "En el modo difícil solo sentís las cuatro paredes vecinas con los bigotes. En la cueva chica, las 60 casillas dan apenas 12 lecturas distintas. ¿Por qué eso rompe el supuesto de Markov con el que veníamos trabajando?",
        opciones: [
          { texto: "Los bigotes a veces fallan: una misma casilla puede dar lecturas distintas y el agente no se puede fiar de lo que siente.", explicacion: "No: los bigotes no fallan, cada casilla da siempre la misma lectura. El problema es al revés: muchas casillas distintas dan la misma lectura." },
          { texto: "Doce lecturas son pocas para aprender: jugando más partidas, el agente terminaría sabiendo qué hacer con cada una.", explicacion: "No: más partidas no ayudan. Con la misma lectura, un agente sin memoria hace siempre lo mismo, y en unos pasillos conviene subir y en otros bajar." },
          { texto: "Casillas que se sienten igual piden flechas distintas: la lectura de ahora no alcanza para decidir y hace falta un resumen del camino.", explicacion: "Correcto. La observación no es el estado: es un POMDP. Con la historia, en el recorrido del notebook las casillas posibles bajan de 15 a 7, 2, 2 y 1." },
          { texto: "La cueva cambia mientras el agente camina, y la casilla en la que está ya no alcanza para prever adónde lo lleva cada acción.", explicacion: "No: la cueva y sus reglas no cambian. Si el agente supiera su casilla, Markov seguiría valiendo; lo que falla es que solo ve una pista de ella." }
        ],
        correcta: 2
      },
      {
        objetivo: "O2",
        pregunta: "Con el diario de la cueva (5420 letras), un n-grama con n = 8 genera texto con el 36 % copiado tal cual. En un tramo que la tabla no vio, el menor error es con n = 3 (1,93 nats por letra) y con n = 8 sube a 2,97. ¿Qué límite muestran estas cifras?",
        opciones: [
          { texto: "Con n grande cada contexto se vio casi una sola vez y la tabla copia en vez de generalizar; y con cualquier n, nunca recuerda más de n − 1 letras.", explicacion: "Correcto. Por eso el error sube después de n = 3. Y aunque sobrara texto, cerrar un paréntesis abierto hace veinte letras pediría una tabla con un renglón por cada cadena de veinte letras." },
          { texto: "Ninguno grave: n = 8 copia el 36 % porque aprendió bien el corpus, y para generar texto el error en el tramo no visto no importa.", explicacion: "No: copiar no es predecir. En el tramo que no vio, n = 8 se equivoca más (2,97) que n = 3 (1,93): no sabe qué hacer con un contexto nuevo." },
          { texto: "El n-grama recuerda todo el texto anterior pero le da menos peso a las letras viejas; con n = 3 ese peso cae más despacio y por eso predice mejor.", explicacion: "No: no hay pesos que caigan. El n-grama mira exactamente las últimas n − 1 letras y nada más viejo: es una cadena de Markov con ese estado." },
          { texto: "Es solo un problema de corpus chico: con mucho más texto, un n-grama largo cerraría paréntesis abiertos hace veinte letras sin copiar nada.", explicacion: "No del todo: más texto bajaría la copia, pero el límite de memoria no se va. Para un paréntesis de hace veinte letras haría falta n = 21 y un renglón por cada cadena de veinte letras." }
        ],
        correcta: 0
      },
      {
        objetivo: "O3",
        pregunta: "La red de letras lleva un estado hₜ de 32 números, con hₜ = tanh(W_hh hₜ₋₁ + W_xh xₜ + b) y las mismas tablas en todos los pasos. En la red entrenada, sobre 42 letras, la primera mueve el estado final 5,5 · 10⁻⁴ de lo que lo mueve la última. ¿Qué guarda hₜ?",
        opciones: [
          { texto: "Una copia de las últimas 32 letras, una por número: por eso la primera de 42 letras ya salió del estado y pesa casi cero.", explicacion: "No: los números del estado no tienen letras asignadas (leer la dimensión 17 no dice nada), y la primera letra sigue pesando, solo que muy poco." },
          { texto: "El texto entero sin pérdida: como las tablas W son las mismas en todos los pasos, ninguna letra se borra y todas pesan igual en la predicción.", explicacion: "No: que la regla no cambie no quiere decir que se conserve todo. El estado tiene tamaño fijo y el efecto de cada letra se achica paso a paso." },
          { texto: "Solo la próxima letra ya elegida: hₜ es la salida de la red, y lo que leyó antes se descarta en cuanto hace la predicción.", explicacion: "No: la predicción sale de hₜ con otra tabla (W_hy) y un softmax, y hₜ pasa al paso siguiente: ese es el lazo." },
          { texto: "Un resumen de tamaño fijo de lo leído, que cada letra actualiza; lo viejo pesa cada vez menos, como mide el gradiente.", explicacion: "Correcto. La letra de hace 10 pasos todavía pesa 1,4 · 10⁻¹; la primera de 42, casi nada. Por eso la GRU agrega una perilla que decide cuánto conservar del estado viejo." }
        ],
        correcta: 3
      },
      {
        objetivo: "O3",
        pregunta: "En la cueva grande, dos redes que sienten solo los bigotes y su última acción aprenden por imitación a copiar a un experto. La red común (sin memoria) sale desde 88 de las 154 casillas (57 %) y la GRU, desde las 154. ¿Qué explica la diferencia?",
        opciones: [
          { texto: "La GRU vio más partidas del experto; con los mismos datos, la red común también saldría desde las 154 casillas.", explicacion: "No: las dos se entrenan con las mismas partidas del experto y la misma entrada. Lo que cambia es que una lleva estado y la otra no." },
          { texto: "Con la misma lectura y la misma última acción, la red común decide siempre igual y se traba; la GRU lleva en hₜ un resumen del camino.", explicacion: "Correcto. Una sonda lineal lee la casilla real del estado de la GRU en el 8 % de los casos al arrancar, el 54 % a los 5 pasos y el 71 % a los 10: aprendió algo parecido al estado de creencia." },
          { texto: "La red común recibe solo los bigotes, sin la última acción; si se la diéramos, ya tendría memoria y saldría igual que la GRU.", explicacion: "No: las dos reciben los 4 bigotes y la última acción. Esa acción ya es memoria de un paso, y en la cueva grande no alcanza." },
          { texto: "La GRU aprendió con RL (una DRQN) y la red común por imitación: el RL le enseñó a explorar, y por eso encuentra la salida desde todas partes.", explicacion: "No: las dos aprendieron por imitación (behavior cloning). La DRQN existe, pero necesita más partidas de las que entran en una clase en CPU." }
        ],
        correcta: 1
      },
      {
        objetivo: "O4",
        pregunta: "La red de letras tiene 3558 pesos y Qwen2.5-0.5B, el modelo que se usa como política desde la clase 13, 494 millones. Más allá de la escala, ¿qué tienen en común?",
        opciones: [
          { texto: "Poco: Qwen no predice lo que sigue, sino que busca la respuesta en una tabla con los textos que vio, como un n-grama gigante.", explicacion: "No: un modelo de lenguaje predice el próximo token a partir de lo leído, como la red predice la próxima letra. Copiar de una tabla es lo que hace el n-grama de n grande." },
          { texto: "Son la misma red recurrente en otro tamaño: Qwen pasa un estado hₜ de token en token por el mismo lazo, solo que con más números.", explicacion: "No del todo: la pregunta es la misma, pero los modelos actuales cambian el lazo por atención, que en cada paso mira a la vez todo lo anterior." },
          { texto: "Los dos predicen lo que sigue con un resumen de lo leído; Qwen lo hace con tokens, mucho más texto y atención en vez del lazo.", explicacion: "Correcto. P(xₜ₊₁ | x₁, …, xₜ) es la misma pregunta. La atención no depende de que el gradiente sobreviva cien pasos, a cambio de mirar todo cada vez." },
          { texto: "Los dos miran solo una cantidad fija de letras anteriores, como un n-grama, y la escala lo único que hace es agrandar esa cantidad.", explicacion: "No: eso es el n-grama, una cadena de Markov con las últimas n − 1 letras. La red recurrente lleva un resumen de todo lo leído, y la atención mira a la vez todas las letras anteriores." }
        ],
        correcta: 2
      }
    ],
    actividad: {
      titulo: "Un cuaderno para la cueva",
      consigna: "Imaginá que entrás a la cueva con solo bigotes: en cada paso sentís si hay pared arriba, a la derecha, abajo y a la izquierda, y nada más. Te dan un cuaderno de cinco líneas y no podés escribir el camino entero. Decidí qué anotar en esas líneas, y cómo actualizarlo en cada paso, para saber dónde estás y salir: ¿las últimas lecturas, los giros, cuántos pasos llevás en un pasillo, las esquinas que pasaste? Probalo con un recorrido de la página (por ejemplo, el que arranca en (8, 10) y camina ← ← ↑ ↑) y contá si tu cuaderno distingue casillas que se sienten igual. Después comparalo con lo que guarda hₜ: un resumen de tamaño fijo que cada lectura actualiza y donde lo viejo se va borrando. ¿Qué tiene tu cuaderno que el estado no, y al revés? Cerralo con la oración de «Para enseñarlo»: cuando lo que ves no alcanza para saber dónde estás, hay que llevar un resumen de lo que pasó. Publicalo en Discussions; otra persona te devuelve con la rúbrica.",
      rubrica: [
        "El cuaderno entra en cinco líneas, dice qué se anota y cómo se actualiza en cada paso, y no es el camino entero copiado.",
        "Se prueba con un recorrido concreto y se muestra que el cuaderno distingue al menos un par de casillas que con solo la lectura de ahora se sienten igual (o se explica por qué falla).",
        "Se compara con hₜ: tamaño fijo, actualización con cada lectura y qué se olvida, y se dice en qué se parece y en qué no a lo que hace la GRU del agente."
      ]
    }
  },

  "10": {
    objetivos: [
      "Entrenar una política imitando partidas grabadas (clonación de comportamiento) y explicar por qué es aprendizaje supervisado.",
      "Explicar los errores compuestos de la imitación y cómo DAgger los corrige pidiendo la acción del experto donde el agente se equivocó.",
      "Explicar qué es RL offline y por qué el cambio de distribución hace sobreestimar acciones que nunca aparecen en los registros.",
      "Comparar imitar y RL offline según la calidad de los registros: solo partidas de experto o partidas mezcladas."
    ],
    tiempo: { pagina: 35, notebook: 75 },
    previos: ["6", "9"],
    requisitos: ["De la clase 6, Q-learning: la tabla Q, la regla de actualización y que es off-policy.", "De la clase 9, la idea de que un modelo aprende copiando lo que vio (imitar texto)."],
    cuestionario: [
      {
        objetivo: "O1",
        pregunta: "En el conjunto 0, la copia aprende de los 451 pares (casilla, acción) de 20 partidas del experto: en cada casilla elige la flecha que él más apretó, sin mirar la recompensa. ¿Por qué esto es aprendizaje supervisado?",
        opciones: [
          { texto: "Porque el experto mira jugar a la copia y la corrige cada vez que se equivoca, como un profesor.", explicacion: "No: eso se parece más a DAgger. En la clonación de comportamiento el experto ya no está; solo quedan sus registros, y la copia no juega mientras aprende." },
          { texto: "Son pares con respuesta: la casilla es la entrada y la flecha del experto, la etiqueta a predecir.", explicacion: "Correcto. No hace falta saber cuánto paga la salida: π(s) = argmaxₐ N(s,a). ALVINN hizo lo mismo con una cámara como entrada y el volante del conductor como etiqueta." },
          { texto: "Usa la recompensa de los registros: copia solo las flechas de las partidas que llegaron a la salida.", explicacion: "No: la copia no mira la recompensa, cuenta flechas. Quedarse con las partidas de mayor retorno es otra variante, filtrar, que aparece en el paso 7." },
          { texto: "Aplica Q-learning a los registros, y cada actualización tiene un objetivo, r + γ maxₐ′ Q(s′,a′), que hace de etiqueta.", explicacion: "No: eso es RL offline, el paso 5. La copia no estima valores; cuenta cuántas veces apretó el experto cada flecha en cada casilla." }
        ],
        correcta: 1
      },
      {
        objetivo: "O2",
        pregunta: "La copia aprendió de partidas grabadas con slip 0,1 y en sus casillas con ejemplos hace lo mismo que el experto. En promedio de 10 conjuntos, con slip 0,3 sale con 0,911 contra 1,000 del experto, y pasa 16,1 pasos en casillas sin ejemplos contra 2,2. ¿Qué explica la diferencia?",
        opciones: [
          { texto: "Como clasificador se equivoca en algunas casillas con ejemplos, y esos errores chicos se van sumando a lo largo de la partida.", explicacion: "No: en sus casillas con ejemplos no tiene ni un error (22 de 22 en el conjunto 0). El problema no está en los datos, sino afuera de ellos." },
          { texto: "Con slip 0,3 la copia se resbala más seguido que el experto, así que pisa casillas sin ejemplos muchas más veces.", explicacion: "No: los dos pisan alguna casilla sin ejemplos con la misma probabilidad, 0,289. Hasta ese momento la copia es idéntica al experto; lo que cambia es qué hace después." },
          { texto: "Es efecto del slip y no de la copia: en una cueva tan resbalosa cualquier política sale menos, también el experto.", explicacion: "No: el experto sale siempre (1,000) con slip 0,1, 0,2, 0,3 y 0,4, porque sabe volver desde donde se resbala." },
          { texto: "Un resbalón la lleva adonde el experto nunca estuvo; en esas casillas sin ejemplos aprieta ↑ y se aleja más.", explicacion: "Correcto. Un error trae el siguiente: errores compuestos. El efecto depende de ↑: si en esas casillas tirara un dado, saldría con 0,990." }
        ],
        correcta: 3
      },
      {
        objetivo: "O2",
        pregunta: "Con slip 0,3, DAgger lleva a la copia de 0,911 a 1,000 en la ronda 4. ¿Qué hace en cada ronda?",
        opciones: [
          { texto: "Juega con la copia, le pide al experto la flecha de cada casilla que pisó, suma esos pares y vuelve a copiar.", explicacion: "Correcto. El experto etiqueta cada casilla que se pisó y en las primeras rondas todavía maneja parte de los pasos (la mitad en la ronda 1). En esta cueva, sumar partidas del experto grabadas con slip 0,3 llega igual a 1,000 en la ronda 4 con una cantidad parecida de etiquetas (636 pares por ronda contra 650 a 760)." },
          { texto: "Graba más partidas enteras del experto en la cueva de slip 0,1 y las suma a los registros de la ronda anterior.", explicacion: "No: eso llega a 0,981 en la ronda 5. Con slip 0,1 el experto casi no se resbala y no visita las casillas donde la copia se pierde." },
          { texto: "Le da recompensa a la copia en las casillas sin ejemplos para que aprenda con Q-learning a volver al camino.", explicacion: "No: DAgger no usa la recompensa. Sigue siendo imitación, con más etiquetas del experto justo en las casillas a las que llega la copia." },
          { texto: "Cambia el ↑ de las casillas sin ejemplos por un dado, y así la copia termina encontrando la salida por azar.", explicacion: "No: esa es la variante del dado, que con slip 0,3 sale con 0,990. DAgger llega a 1,000 porque esas casillas pasan a tener la flecha del experto." }
        ],
        correcta: 0
      },
      {
        objetivo: "O3",
        pregunta: "Q-learning offline sobre partidas del experto, con la tabla arrancando en 1: en todas sus casillas con ejemplos la política quiere una flecha que nadie grabó, cree que S vale 1,0 y en realidad vale 0,0. ¿Por qué pasa?",
        opciones: [
          { texto: "El experto se equivoca en algunas casillas, y Q-learning offline aprende también esos errores de los registros.", explicacion: "No: el experto juega siempre la flecha óptima. Con los mismos registros y la tabla en 0, Q-learning offline vale 0,782, igual que imitar." },
          { texto: "Faltan pasadas: con más de 60 por las transiciones, las flechas no grabadas terminarían bajando a su valor real.", explicacion: "No: una flecha que no aparece en los registros no se actualiza nunca, por más pasadas que se hagan. Offline no hay forma de probarla." },
          { texto: "Las flechas que nunca aparecen nunca se corrigen y siguen en 1; el máximo las prefiere a la grabada, y el error se contagia.", explicacion: "Correcto. En S la flecha del experto baja a 0,99 y las otras tres siguen en 1: es el cambio de distribución. Con la tabla en 0 eso no pasa, y métodos como CQL o IQL desconfían de lo que no está en los datos." },
          { texto: "Con partidas de experto el retorno siempre es alto, y Q-learning le asigna ese valor a las cuatro flechas de cada casilla.", explicacion: "No: Q-learning actualiza solo los pares que aparecen. Las flechas no grabadas valen 1 porque así arrancó la tabla, no por el retorno del experto." }
        ],
        correcta: 2
      },
      {
        objetivo: "O4",
        pregunta: "Con 20 partidas mezcladas (ε = 0,8), imitar vale 0,543, filtrar (imitar las 5 de mayor retorno) 0,262 y RL offline 0,803, más que la mejor partida grabada (0,557). Con una mezcla de jugadores de distinto ε, filtrar vale 0,762. ¿Qué se lee?",
        opciones: [
          { texto: "RL offline gana porque, además de usar los registros, juega partidas nuevas y así descubre el camino.", explicacion: "No: no juega ninguna. Hace 152 040 actualizaciones sobre las transiciones grabadas, con 0 partidas jugadas." },
          { texto: "Imitar copia también el azar; filtrar sirve si hay partidas buenas para elegir, y RL offline usa la recompensa y cose tramos.", explicacion: "Correcto. Con ε = 0,8 hasta las 5 mejores son casi al azar; en la mezcla de jugadores son de quien juega casi como el experto. RL offline le gana a la mejor partida en 10 de 10 conjuntos (stitching)." },
          { texto: "Con ε = 0,8 filtrar falla por quedarse con pocos pares, y en la mezcla de jugadores mejora solo porque hay más partidas.", explicacion: "No: los dos conjuntos tienen 20 partidas. Lo que cambia es la calidad de las mejores: con ε = 0,8 también son casi al azar." },
          { texto: "Con registros mezclados conviene imitar todo, porque la flecha más frecuente promedia los errores y queda cerca del experto.", explicacion: "No: imitar vale 0,543, y en algunos conjuntos 0, porque en alguna casilla gana por azar una flecha equivocada y la copia queda yendo y viniendo." }
        ],
        correcta: 1
      }
    ],
    actividad: {
      titulo: "Aprender mirando",
      consigna: "Elegí algo que aprendiste mirando a alguien: cocinar una receta, manejar, armar un mate, atender un local. Contá qué copiabas (qué hacía esa persona en cada situación) y describí una situación concreta en la que la copia no supo qué hacer porque quien te enseñaba nunca estuvo ahí: la salsa que se cortó, el auto que patinó en una curva que nunca tomaron juntos, el cliente que pidió algo raro. Contá qué hiciste y si ese primer error te llevó a otro, como los errores compuestos de la cueva. Después diseñá cómo lo resolverías con DAgger: en qué momentos practicarías solo, qué le preguntarías a la persona experta y sobre qué situaciones, y cómo sumarías esas respuestas a lo que ya sabías. Decí también por qué no alcanzaría con mirarla más veces hacer lo de siempre. Cerralo con la oración de «Para enseñarlo»: copiar al que sabe funciona mientras estés donde él estuvo; cuando te desviás, necesitás que alguien te diga qué hacer ahí. Publicalo en Discussions; otra persona te devuelve con la rúbrica.",
      rubrica: [
        "Se nombra algo concreto aprendido mirando y una situación en la que la copia no supo qué hacer porque la persona experta nunca estuvo ahí; se dice si un error llevó a otro.",
        "El plan con DAgger dice cuándo se practica solo, qué se le pregunta a la persona experta y sobre qué situaciones, y cómo se suman esas respuestas a lo aprendido.",
        "Se explica por qué mirar más veces lo de siempre no alcanza: las situaciones nuevas aparecen cuando uno se desvía, no cuando copia bien."
      ]
    }
  },

  "11": {
    objetivos: [
      "Describir una política estocástica con preferencias por casilla (softmax) y explicar por qué se puede optimizar directamente.",
      "Explicar REINFORCE como hacer más probable lo que dio buen retorno (imitar lo que salió bien) y aplicar una actualización a mano.",
      "Explicar por qué una línea de base reduce la varianza sin sesgar y cómo un crítico V da la ventaja con la que aprende el actor.",
      "Explicar la idea de PPO como no alejarse demasiado de la política anterior, sin derivarla."
    ],
    tiempo: { pagina: 35, notebook: 75 },
    previos: ["10", "5"],
    requisitos: ["De la clase 10, imitar: aprender una política copiando las acciones de partidas grabadas.", "De la clase 5, el retorno G, el valor V y el error δ = r + γV(s′) − V(s) de TD."],
    cuestionario: [
      {
        objetivo: "O1",
        pregunta: "La casilla S guarda las preferencias θ(S) = (−1; 1; 0,5; −1) en el orden ↑ → ↓ ←, y softmax las vuelve probabilidades. ¿Qué política queda en S y por qué sirve para optimizarla directamente?",
        opciones: [
          { texto: "Determinista: siempre →, porque tiene la preferencia más alta; las demás flechas quedan con probabilidad 0 y no se juegan.", explicacion: "No: eso sería tomar el máximo. Softmax le da algo a cada flecha: → es la más probable, pero ↓ sigue con 0,3231 y ↑ y ← con 0,0721." },
          { texto: "Proporcional a θ: → con 1/1,5 y ↓ con 0,5/1,5, mientras que ↑ y ← quedan en cero porque sus preferencias son negativas.", explicacion: "No: softmax no divide las preferencias por su suma, usa e^θ. Por eso una preferencia negativa da una probabilidad chica pero positiva, 0,0721." },
          { texto: "→ con 0,5327, ↓ con 0,3231 y ↑ o ← con 0,0721; un cambio chico de θ da un cambio chico de π, así que se puede mejorar de a poco.", explicacion: "Correcto. π(a|s) = e^θ(s,a) / Σ e^θ(s,b). Como π depende suavemente de θ, el gradiente de política la mejora sin pasar por Q." },
          { texto: "Las cuatro con 1/4, porque softmax normaliza las preferencias y en cada casilla deja siempre el dado, sean cuales sean las θ de esa casilla.", explicacion: "No: el dado aparece solo cuando las cuatro preferencias son iguales (por ejemplo, todas en 0). Sumarles lo mismo a las cuatro no cambia nada; cambiarlas por separado, sí." }
        ],
        correcta: 2
      },
      {
        objetivo: "O2",
        pregunta: "La primera partida del dado que salió tardó 161 pasos: desde S cobró G = 0,99¹⁶⁰ = 0,2003. En S había tomado ↓ con π = 0,25 en las cuatro flechas. Con REINFORCE y α = 1, ¿cómo se mueve θ(S) en el orden ↑ → ↓ ←?",
        opciones: [
          { texto: "(−0,0501; −0,0501; +0,1502; −0,0501): sube ↓, la tomada, y bajan las otras; con una partida que no salió, G = 0 y θ no se movería.", explicacion: "Correcto. ∇ log π vale 1 − 0,25 para la acción tomada y −0,25 para las otras, por G = 0,2003. π queda en (0,2369; 0,2369; 0,2894; 0,2369)." },
          { texto: "(0; 0; +0,2003; 0): a ↓ se le suma el retorno entero y las otras tres flechas no se tocan, porque no se jugaron en S.", explicacion: "No: ∇ log π también toca las flechas no jugadas. A ↓ se le suma (1 − 0,25) · G = 0,1502 y a cada una de las otras se le resta 0,25 · G = 0,0501." },
          { texto: "(+0,0501; +0,0501; −0,1502; +0,0501): baja ↓, porque tardar 161 pasos es una partida mala y REINFORCE castiga lo que la alargó.", explicacion: "No: sin línea de base, todo G positivo empuja para arriba la acción tomada. Una partida que salió rápido empujaría más, pero esta también empuja ↓ hacia arriba." },
          { texto: "No se mueve: REINFORCE actualiza θ solo cuando G supera el retorno de una partida perfecta, y 0,2003 está lejos de ese valor.", explicacion: "No: no hay umbral. El empuje es proporcional a G; con 0,2003 es chico pero no nulo. Solo con G = 0, una partida que no salió, θ queda igual." }
        ],
        correcta: 0
      },
      {
        objetivo: "O3",
        pregunta: "Restar una línea de base b(s), el retorno promedio desde cada casilla, baja la varianza del gradiente de una partida de 23,06 a 4,20 (con la línea de base exacta, calculada con el mapa solo para medir). Con α = 3 llega a V(S) = 0,75 en 485 partidas contra 430 sin ella. ¿Para qué sirve, entonces?",
        opciones: [
          { texto: "Para aprender más rápido siempre: con menos varianza cada actualización vale más, y en cualquier α llega antes a 0,75.", explicacion: "No: con α = 3 no aprende antes (485 contra 430 partidas). La ventaja aparece al usar pasos más grandes, no con el mismo α." },
          { texto: "Para cambiar hacia dónde apunta el gradiente: deja de empujar las acciones de las partidas buenas y empuja las de las malas.", explicacion: "No: en promedio el gradiente apunta igual, por eso no sesga. Lo que cambia es que sube solo lo que salió mejor que lo esperado y baja lo que salió peor." },
          { texto: "Para reemplazar el retorno: con b(s) el agente ya no necesita esperar el final de la partida y aprende en cada paso.", explicacion: "No: eso es lo que aporta el crítico del actor-crítico. Con línea de base, REINFORCE sigue esperando G al final de la partida." },
          { texto: "Para admitir pasos más grandes: con α = 10, sin ella se traban 7 de 8 semillas y con ella aprende en 150 partidas.", explicacion: "Correcto. Sube solo lo que salió mejor que lo esperado, sin cambiar la dirección promedio, y termina en 0,811 ± 0,007." }
        ],
        correcta: 3
      },
      {
        objetivo: "O3",
        pregunta: "En el actor-crítico, el crítico aprende V con TD(0) y el actor usa A = r + γV(s′) − V(s). Aprende en 145 partidas y termina en 0,8210 ± 0,0072, cerca de V*(S) = 0,8262. ¿Qué aporta el crítico?",
        opciones: [
          { texto: "El valor verdadero de cada casilla: el actor-crítico arranca con V* de la clase 4 y por eso termina tan cerca de 0,8262.", explicacion: "No: el crítico aprende V con TD mientras juega, sin el mapa. Queda a menos de 0,05 del valor verdadero del actor en solo el 39 % de las casillas." },
          { texto: "Una ventaja en cada paso, el mismo δ de la clase 5, sin esperar el G del final; acierta sobre el camino del actor y no fuera.", explicacion: "Correcto. El δ dice cuánto mejor o peor salió el paso de lo esperado. Aprende a la par de REINFORCE con línea de base (150) y termina más cerca de V*." },
          { texto: "Una segunda política que elige las acciones junto con el actor, de modo que el agente juega con dos votos en cada casilla.", explicacion: "No: el crítico no elige acciones. Solo juzga: su V da el δ con el que el actor, las preferencias θ, ajusta sus probabilidades." },
          { texto: "Un valor preciso en todas las casillas de la cueva, y por eso el actor puede mejorar también donde nunca pasa.", explicacion: "No: el crítico acierta donde juega el actor. Fuera del camino casi no tiene datos, y en el notebook queda cerca del valor verdadero en solo el 39 % de las casillas." }
        ],
        correcta: 1
      },
      {
        objetivo: "O4",
        pregunta: "Desde una política con V(S) = 0,2178 se reusa un lote de 10 partidas en 50 pasadas de gradiente. Sin recorte V(S) cae a 0,0047; con el recorte de PPO (ε = 0,2) sube a 0,3263. Con una sola pasada, las dos dan 0,2628. ¿Qué hace el recorte?",
        opciones: [
          { texto: "Achica α en cada pasada, así que las 50 pasadas con recorte equivalen a una sola pasada larga con un paso más chico.", explicacion: "No: el recorte no toca α. Si fuera un paso más chico, también cambiaría el resultado de la primera pasada, y con una sola pasada da lo mismo con o sin él." },
          { texto: "Descarta las partidas malas del lote antes de reusarlo, de modo que las 50 pasadas solo empujan acciones con buen retorno.", explicacion: "No: el lote queda entero. Lo que se limita es cuánto puede cambiar la probabilidad de cada acción respecto de la política que jugó." },
          { texto: "Saca el empuje de una acción cuando π_nueva/π_vieja ya salió de [1 − ε, 1 + ε]; en la primera pasada la razón vale 1 y no actúa.", explicacion: "Correcto. Evita alejarse demasiado de la política que jugó el lote. En un lote del notebook la razón mediana queda en 1,043 con recorte contra 0,070 sin él." },
          { texto: "Garantiza que ninguna razón salga de la banda [0,8; 1,2], porque cada probabilidad nueva se fuerza a quedar dentro de ese rango.", explicacion: "No: no es un candado perfecto y algunas razones se escapan de la banda. El recorte solo saca el empuje de esas acciones, no fija sus probabilidades." }
        ],
        correcta: 2
      }
    ],
    actividad: {
      titulo: "Reforzar lo que salió bien",
      consigna: "Elegí un hábito propio que quieras mejorar: estudiar, entrenar, cocinar, ordenar la semana. Contá qué hiciste las últimas veces y cómo te fue, y explicá cómo «reforzarías lo que salió bien» como REINFORCE: qué harías más seguido después de un buen día. Agregale una línea de base: ¿con qué resultado esperado comparás cada día, y por qué un día apenas normal no debería reforzar todo lo que hiciste, rodeos incluidos? Usá la pregunta de «Para enseñarlo»: ¿merece el mismo festejo un 7 de quien siempre saca 9 que el de quien siempre saca 4? Después pensá en un paso demasiado grande: después de un solo día excelente, cambiás toda tu rutina para copiarlo. Contá qué podría salir mal y cómo pondrías un límite a cuánto cambiar de una vez, como el recorte de PPO. Cerralo con la oración de «Para enseñarlo»: policy gradient es reforzar lo que salió bien, comparado con lo que esperabas. Publicalo en Discussions; otra persona te devuelve con la rúbrica.",
      rubrica: [
        "Se nombra un hábito concreto y se dice qué se haría más seguido después de un resultado bueno, en proporción a qué tan bueno fue.",
        "Hay una línea de base explícita (el resultado esperado) y se explica por qué reforzar solo lo que salió mejor que eso evita premiar un día normal o un rodeo.",
        "Se describe qué podría salir mal con un cambio demasiado grande después de un solo resultado y se propone un límite concreto a cuánto cambiar de una vez, relacionado con el recorte de PPO."
      ]
    }
  },

  "12": {
    objetivos: [
      "Explicar por qué a veces no se puede escribir la recompensa y conviene aprenderla de comparaciones entre dos trayectos o respuestas.",
      "Explicar el modelo de Bradley-Terry (la probabilidad de preferir uno depende de la diferencia de recompensas) y leer una recompensa aprendida de comparaciones.",
      "Describir las etapas de RLHF (imitar, aprender la recompensa, optimizar con una penalización por alejarse) y el riesgo de sobreoptimizar una recompensa aprendida.",
      "Explicar la idea de DPO: usar las preferencias para ajustar la política directamente, sin un modelo de recompensa aparte."
    ],
    tiempo: { pagina: 40, notebook: 75 },
    previos: ["11", "2"],
    requisitos: ["De la clase 11, policy gradient y la idea de PPO: no alejarse demasiado de la política anterior.", "De la clase 2, la trampa de la recompensa: el agente optimiza lo que se le pide, no lo que se quería."],
    cuestionario: [
      {
        objetivo: "O1",
        pregunta: "En el notebook, una persona con ruido τ = 0,3 juzga pedazos de partida de 12 pasos. Comparando dos en el mismo momento, el mejor gana en el 70,6 % de los pares; si puntúa cada pedazo en días distintos, baja a 70,2, 66,9 y 63,9 % según cuánto le cambie el humor. ¿Por qué comparar sale mejor?",
        opciones: [
          { texto: "Porque comparando la persona no se equivoca nunca, y lo que le falta al 70,6 % para llegar a 100 son pares en que los dos pedazos valían lo mismo.", explicacion: "No: con τ = 0,3 también se equivoca al comparar, y la tabla cuenta solo los 930 pares de recompensas distintas. Comparar no quita ese ruido, quita el del humor." },
          { texto: "Porque el humor del día afecta a los dos pedazos por igual y se cancela; con puntajes de días distintos, ese humor se suma al ruido.", explicacion: "Correcto. Cuanto más varía el humor (desvío 0,5, 1 y 2), más baja el acierto con puntajes, de 70,2 a 63,9 %, mientras que comparar se queda en 70,6 %." },
          { texto: "Porque una comparación da más información que un puntaje: dice cuánto mejor es un pedazo, mientras que el puntaje solo dice si es bueno.", explicacion: "No: es al revés, una comparación solo dice cuál gana. Su ventaja no es que informe más sino que es más consistente." },
          { texto: "Porque con puntajes la persona usa cada día otra recompensa escondida y cambia qué casillas considera derrumbes.", explicacion: "No: la recompensa escondida es siempre la misma. Lo que cambia de un día a otro es un desvío de humor que se suma al puntaje de cada pedazo." }
        ],
        correcta: 1
      },
      {
        objetivo: "O2",
        pregunta: "Bradley-Terry dice P(A ≻ B) = σ(r(A) − r(B)). En la pregunta 1 del notebook, R(A) = +0,70 y R(B) = +0,90, y la persona tiene ruido τ = 0,3, así que r = R/τ. ¿Con qué probabilidad prefiere A?",
        opciones: [
          { texto: "0,5: la diferencia de 0,20 es chica, y Bradley-Terry da una moneda siempre que las dos recompensas sean positivas.", explicacion: "No: da 0,5 solo cuando las dos valen lo mismo. Lo que importa es la diferencia, −0,20, no el signo de cada recompensa." },
          { texto: "0,450: σ(−0,20) da lo mismo con cualquier ruido, porque τ cambia la escala de las dos y la diferencia queda igual.", explicacion: "No: 0,450 es la cuenta con τ = 1. Dividir por τ = 0,3 agranda la diferencia a −0,20/0,3 y la persona elige con más decisión." },
          { texto: "0,661: σ(0,20/0,3), porque Bradley-Terry mira cuánto supera la recompensa más alta a la otra y le asigna eso a A.", explicacion: "No: 0,661 = 1 − 0,339 es la probabilidad de preferir B, la de más recompensa. Para A, la diferencia r(A) − r(B) es negativa." },
          { texto: "0,339: σ(−0,20/0,3); con τ = 1 sería 0,450, porque una persona con más ruido elige más cerca de la suerte.", explicacion: "Correcto. Solo importa la diferencia, dividida por τ. Si la persona igual eligió A, la menos probable, el ajuste sube r(A) y baja r(B)." }
        ],
        correcta: 3
      },
      {
        objetivo: "O3",
        pregunta: "En el RLHF en chico del notebook, con 300 comparaciones, π_ref rinde −3,91, optimizar sin penalización da −10 y con β = 0,3 da −1,33, cerca del óptimo de −1,09. ¿En qué orden van las etapas de RLHF?",
        opciones: [
          { texto: "Imitar para tener π_ref, aprender un modelo de recompensa con comparaciones y optimizar con PPO restando β · KL(π ‖ π_ref).", explicacion: "Correcto. Con el mismo modelo de recompensa, la penalización pasa de −10 a −1,33: deja a la política cerca de π_ref, que por lo menos sale de la cueva." },
          { texto: "Aprender la recompensa con comparaciones, optimizar con PPO sin freno y al final imitar la política optimizada para suavizarla.", explicacion: "No: imitar va primero, para tener la referencia π_ref. Y optimizar sin freno es justo lo que en el notebook da −10." },
          { texto: "Imitar, optimizar con PPO usando el +1 de la salida y después aprender la recompensa para explicar lo que hizo la política.", explicacion: "No: en RLHF no hay recompensa escrita. La recompensa se aprende de las comparaciones antes de optimizar, y es esa la que se optimiza." },
          { texto: "Aprender la recompensa, imitar los pedazos ganadores y optimizar con una penalización por acercarse a π_ref, para explorar más.", explicacion: "No: la penalización es por alejarse de π_ref, no por acercarse. Y la imitación usa partidas grabadas, al principio de todo." }
        ],
        correcta: 0
      },
      {
        objetivo: "O3",
        pregunta: "Con 300 comparaciones se barre β. Al bajarlo, la recompensa aprendida sube siempre, hasta 13,4; la verdadera sube hasta −1,18 con β = 0,1 y cae a −10 con β = 0,03 o menos. Con 3000 comparaciones la verdadera no cae: se queda en −1,09. ¿Qué está pasando?",
        opciones: [
          { texto: "Con β chico el optimizador deja de converger: el −10 es un error numérico, y con 3000 comparaciones hay datos de sobra para evitarlo.", explicacion: "No: el optimizador converge bien, a una política que va a una casilla con premio inventado y se queda ahí. El que tiene errores es el modelo de recompensa." },
          { texto: "La aprendida está bien y la verdadera está mal medida; con 3000 comparaciones las dos coinciden porque la verdadera se corrige.", explicacion: "No: la verdadera es la escondida, lo que de verdad quería la persona, y no cambia. Lo que mejora con 3000 comparaciones es el modelo aprendido." },
          { texto: "Optimizar fuerte explota los errores del modelo, como una casilla con premio inventado; la penalización frena a la política cerca de π_ref.", explicacion: "Correcto. Es la sobreoptimización que midieron Gao, Schulman y Hilton (2023), la trampa de la clase 2 con una recompensa aprendida. Con 3000 comparaciones el modelo casi no tiene esos errores." },
          { texto: "Conviene β lo más alto posible: así la verdadera nunca cae y la política queda siempre en su mejor valor, sin riesgo.", explicacion: "No: con β muy grande la política casi no se mueve de π_ref, que rinde −3,91. El mejor retorno verdadero aparece con un β intermedio." }
        ],
        correcta: 2
      },
      {
        objetivo: "O4",
        pregunta: "En el notebook, una política elige entre cuatro rutas desde S. DPO sube la ruta B, la preferida, de 0,20 a 0,566 y baja la A de 0,55 a 0,135. RLHF en dos pasos, con las mismas comparaciones y el mismo β, llega a la misma política hasta el tercer decimal. ¿Qué saltea DPO?",
        opciones: [
          { texto: "Las comparaciones: DPO ajusta la política con la recompensa escondida directamente, y por eso no necesita preguntarle nada a la persona.", explicacion: "No: DPO usa las mismas 1000 comparaciones que RLHF. La recompensa escondida solo se usa para medir, nunca para aprender." },
          { texto: "El modelo de recompensa aparte: la recompensa de cada ruta queda como β · log[π(y)/π_ref(y)] y la política se ajusta con las preferencias.", explicacion: "Correcto. Ahorra entrenar y guardar un segundo modelo y correr PPO. No cambia el resultado, solo el camino." },
          { texto: "La política de referencia: sin modelo de recompensa ya no hace falta medir contra π_ref, y la ruta preferida sube sin freno.", explicacion: "No: en DPO todo se mide relativo a π_ref, y ahí está el freno. Por eso B llega a 0,566 y no a 1." },
          { texto: "El riesgo de sobreoptimizar: como no hay modelo de recompensa, la política ya no puede heredar errores de las comparaciones.", explicacion: "No: la política sigue aprendiendo las comparaciones, con sus huecos y su ruido. El problema del paso 6 sigue ahí." }
        ],
        correcta: 1
      }
    ],
    actividad: {
      titulo: "Enseñar comparando",
      consigna: "Elegí algo que no sabrías puntuar con números pero sí comparar: dos textos (dos mensajes, dos resúmenes), dos recorridos para ir a un lugar, dos fotos, dos recetas. Armá 5 comparaciones de a pares y anotá cuál preferís en cada una, sin explicar por qué. Después ponete en el lugar de una máquina que solo ve esos 5 votos: ¿qué recompensa aprendería de ellos? ¿Qué rasgos premiaría y qué no puede saber, porque ningún par lo tocaba? Contá cómo podría sobreoptimizarla: qué texto o recorrido exagerado sacaría un puntaje altísimo con esa recompensa aprendida aunque vos nunca lo elegirías, y qué freno le pondrías, como la penalización por alejarse de lo que ya se hacía. Usá la pregunta de «Para enseñarlo»: si alguien mira mil veces cuál de dos fotos elegís, ¿qué aprende de tus gustos y qué no puede aprender nunca? Cerralo con la oración: cuando no sabés escribir lo que querés, podés enseñarlo comparando; pero la máquina aprende tus comparaciones, no lo que querías. Publicalo en Discussions; otra persona te devuelve con la rúbrica.",
      rubrica: [
        "Se elige algo difícil de puntuar con números y se presentan 5 comparaciones concretas, con la preferida marcada en cada una.",
        "Se dice qué recompensa aprendería una máquina de esas comparaciones y qué queda sin aprender porque ningún par lo cubría.",
        "Se describe un caso concreto de sobreoptimización (algo que la recompensa aprendida premia y la persona no querría) y un freno relacionado con la penalización por alejarse."
      ]
    }
  },

  "13": {
    objetivos: [
      "Describir un modelo de lenguaje como política: estado = texto hasta ahora, acción = próximo token, episodio = respuesta, recompensa al final.",
      "Explicar cómo la temperatura cambia la política y por qué muestrear es explorar.",
      "Distinguir una recompensa aprendida (clase 12) de una recompensa verificable y calcular las ventajas de GRPO de un grupo de respuestas.",
      "Explicar por qué GRPO no necesita un crítico: el promedio del grupo hace de línea de base, como en la clase 11."
    ],
    tiempo: { pagina: 35, notebook: 60 },
    previos: ["12", "9"],
    requisitos: ["De la clase 9, que un modelo de lenguaje predice lo que sigue; de la clase 11, la línea de base y PPO.", "El notebook descarga una vez un modelo de ≈ 1 GB (Qwen2.5-0.5B-Instruct); en CPU corre más lento."],
    cuestionario: [
      {
        objetivo: "O1",
        pregunta: "Un asistente responde «¿Cuánto es 14 × 12?» con «14 × 12 = 168» en 12 tokens, y un verificador le pone 1 al terminar. Si se lo mira con el molde de la cueva, ¿qué es cada cosa?",
        opciones: [
          { texto: "Estado = la pregunta sola, acción = la respuesta entera elegida de una vez, episodio = la conversación, recompensa = el 1 del verificador.", explicacion: "No: la acción es un token, no la respuesta. Cada token se suma al estado, que crece token a token, y la respuesta son 12 acciones seguidas." },
          { texto: "Estado = el último token escrito, acción = el próximo token, episodio = la respuesta, y cada token correcto cobra su parte del 1.", explicacion: "No: el estado es todo el texto, con la pregunta y lo ya escrito. Y los tokens sueltos no valen nada: como en la cueva, todo da 0 menos el final." },
          { texto: "Estado = todo el texto hasta ahora, acción = el próximo token, episodio = la respuesta hasta el token de fin, recompensa = un número al final.", explicacion: "Correcto. Es el camino de la cueva (20 pasos con 0 y un +1 al final) con tokens: π(token | texto). Que el 1 llegue tarde plantea el problema de siempre, qué token tuvo el mérito." },
          { texto: "Estado = el texto hasta ahora, acción = uno de los 4 tokens más probables, episodio = cada token, recompensa = la probabilidad que le dio el modelo.", explicacion: "No: la acción es cualquiera de los 151 665 tokens del vocabulario, y un episodio es la respuesta entera. La probabilidad π es la política, no la recompensa." }
        ],
        correcta: 2
      },
      {
        objetivo: "O2",
        pregunta: "Desde el estado de la cueva, el token más probable tiene 0,697 a T = 0,3, 0,269 a T = 1 y 0,059 a T = 1,8. Con 50 muestras salen 2, 9, 25 y 42 tokens distintos a T = 0,2, 0,7, 1,2 y 1,8. ¿Qué hace la temperatura?",
        opciones: [
          { texto: "Divide los logits: T chica concentra la masa en el más probable (explotar), T grande la reparte (explorar), y a T = 1,8 el texto se rompe.", explicacion: "Correcto. π_T = softmax(logits / T). Explorar no es gratis: a T = 1,8 aparecen pedazos de otros idiomas, como un ε demasiado grande en la cueva." },
          { texto: "Cambia qué token prefiere el modelo: a T alta los tokens raros pasan a tener más puntaje que el más probable, por eso salen tantos distintos.", explicacion: "No: dividir los logits por T no cambia su orden; el más probable sigue siéndolo. Lo que cambia es cuánto se aplanan las diferencias entre ellos." },
          { texto: "Es un premio a la variedad: a T alta se recompensa la respuesta distinta, y así el modelo aprende a no repetir siempre el mismo token.", explicacion: "No: con la temperatura no se entrena nada. Es la misma política muestreada de otra forma; los 2 o 42 tokens distintos salen sin tocar el modelo." },
          { texto: "Sube la exploración sin costo: a T = 1,8 las respuestas son más variadas que a T = 0,2 y siguen siendo tan razonables como las de T = 1.", explicacion: "No: a T = 1,8 la política le da chance a miles de tokens raros y el texto se rompe; en la cuenta 17 + 25 deja de salir un número. La variedad con sentido aparece a T media." }
        ],
        correcta: 0
      },
      {
        objetivo: "O3",
        pregunta: "El verificador del notebook toma el último número de la respuesta y da 1 si coincide con el resultado. Para 17 + 25, a «cuarenta y dos» le da 0. ¿Qué distingue esta recompensa de la que se aprendía en la clase 12?",
        opciones: [
          { texto: "En el fondo nada: el verificador también se aprende de comparaciones de personas, solo que ya viene entrenado y se usa tal cual.", explicacion: "No: el verificador es un programa con una regla, el último número, y no se entrena. La recompensa aprendida de la clase 12 sale de comparaciones, como en RLHF." },
          { texto: "Nunca se equivoca, y por eso sirve también para puntuar lo que no es una cuenta, por ejemplo si una explicación quedó clara.", explicacion: "No: se equivoca con «cuarenta y dos», y una respuesta dudosa que termina en el número justo cobra. Si una explicación es clara no se chequea con un programa." },
          { texto: "Detecta errores que un modelo de recompensa no vería: «cuarenta y dos» vale 0 porque el resultado escrito en palabras está mal.", explicacion: "No: «cuarenta y dos» es correcto. Vale 0 porque el verificador no lee palabras; es él quien se equivoca, no la respuesta." },
          { texto: "La pone un programa que chequea la respuesta, sin aprenderla; lo que un programa no puede chequear sigue pidiendo comparaciones.", explicacion: "Correcto. Sirve para cuentas o código con pruebas (la greedy acierta 9 de 12). La política aprende a cumplir esas reglas, incluido escribir el número en cifras." }
        ],
        correcta: 3
      },
      {
        objetivo: "O3",
        pregunta: "En 17 + 25, un grupo de 8 respuestas a T = 1 da seis veces 42 y dos veces 32: recompensas 11101110. Con Aᵢ = (rᵢ − promedio) / desvío, ¿qué ventajas quedan, y qué pasa en 7 × 8 − 9, donde fallan las 8?",
        opciones: [
          { texto: "Promedio 0,750: cada 42 recibe +0,250 y cada 32 −0,750; en 7 × 8 − 9 las ocho reciben −1, el castigo más fuerte del lote.", explicacion: "No: +0,250 y −0,750 son rᵢ − promedio, falta dividir por el desvío, 0,433. Y si las 8 valen 0, ninguna está por debajo del promedio: la ventaja es 0." },
          { texto: "Promedio 0,750 y desvío 0,433: cada 42 recibe +0,577 y cada 32 −1,732; en 7 × 8 − 9 las ventajas son 0 y esa cuenta no enseña nada.", explicacion: "Correcto. Las ventajas suman ≈ 0: unas suben y otras bajan. Sin ningún acierto no hay con qué comparar, la recompensa escasa de la clase 7." },
          { texto: "La ventaja es la recompensa misma: cada 42 recibe +1 y cada 32 recibe 0; en 7 × 8 − 9 las ocho reciben 0 y se descartan.", explicacion: "No: la ventaja compara cada respuesta con su grupo. Por eso un acierto vale +0,577 en 17 + 25 y ≈ +2,6 en 3 × 4 + 5, donde acierta 1 de 8." },
          { texto: "Promedio 0,750 y desvío 0,433: cada 42 recibe +0,577 y cada 32 −1,732; en 7 × 8 − 9 GRPO empuja más fuerte, porque ahí hay más para mejorar.", explicacion: "No: las ventajas de 17 + 25 están bien, pero un grupo todo mal da ventajas 0. GRPO no sabe hacia dónde empujar si ninguna respuesta salió mejor que otra." }
        ],
        correcta: 1
      },
      {
        objetivo: "O4",
        pregunta: "En el actor-crítico de la clase 11, la línea de base la daba un crítico, una segunda red que aprende V(s). GRPO actualiza Qwen2.5-0.5B sin crítico. ¿Por qué puede hacerlo?",
        opciones: [
          { texto: "Con recompensas verificables no hace falta línea de base: el verificador ya dice qué respuestas reforzar, y se refuerzan todas las correctas.", explicacion: "No: sin línea de base, un acierto en 8 × 7 (donde aciertan todas) empujaría igual que uno sorpresivo. La ventaja necesita saber qué se esperaba de cada pregunta." },
          { texto: "El modelo de 494 M ya trae adentro un crítico que estima V para cada texto, entrenado junto con el lenguaje antes de empezar el RL.", explicacion: "No: Qwen2.5-0.5B no trae crítico. Agregar uno del mismo tamaño llevaría los 494 M de parámetros a 988 M para entrenar y tener en memoria." },
          { texto: "Pregunta varias veces y usa el promedio del grupo como V(pregunta): una línea de base ruidosa, pero que no exige entrenar otra red de 494 M.", explicacion: "Correcto. En 14 × 12 el promedio de un grupo de 8 va de 0,250 a 0,750; a cambio no se entrena nada y se ahorra pasar de 494 M a 988 M parámetros." },
          { texto: "GRPO deja de usar el recorte de PPO, y sin recorte la actualización ya es estable por sí sola, así que la línea de base sobra.", explicacion: "No: GRPO sigue usando el recorte de PPO. El recorte limita cuánto cambia la política; la línea de base dice qué salió mejor de lo esperado. Son piezas distintas." }
        ],
        correcta: 2
      }
    ],
    actividad: {
      titulo: "¿Quién pone el +1?",
      consigna: "Elegí una tarea que le pedirías a un asistente: resolver un ejercicio, escribir una función, resumir una clase, dar un consejo, contestar un mail. Decidí quién pondría el +1 al final de la respuesta: ¿se puede verificar con un programa, como la cuenta con el último número o un código con sus pruebas, o hay que aprender la recompensa de comparaciones de personas, como en la clase 12? Si la tarea tiene partes de los dos tipos, separalas. Describí la regla del verificador o qué se le preguntaría a la gente al comparar dos respuestas. Después buscá cómo se podría engañar esa recompensa: una respuesta que cobra sin ser buena, como la dudosa que termina en el número justo, o una buena que no cobra, como «cuarenta y dos». Usá la pregunta de «Para enseñarlo»: si el asistente aprende de los pulgares arriba de la gente, ¿aprende las respuestas correctas o las que gustan? Cerralo con la oración de «Para enseñarlo»: un modelo de lenguaje es una política que elige la próxima palabra; para ajustarlo con RL hace falta decidir quién pone el +1 al final. Publicalo en Discussions; otra persona te devuelve con la rúbrica.",
      rubrica: [
        "Se nombra una tarea concreta y se dice si su recompensa se puede verificar con un programa o hay que aprenderla de comparaciones (o qué partes son de cada tipo), con una razón.",
        "Se describe cómo se pondría el +1: la regla del verificador o qué se compara y quién compara, de modo que otra persona podría aplicarlo.",
        "Se da al menos un ejemplo concreto de cómo esa recompensa se podría engañar o equivocar (una respuesta mala que cobra o una buena que no) y qué aprendería el asistente si se entrenara con ella."
      ]
    }
  },

  "16": {
    objetivos: [
      "Recorrer las quince clases anteriores sobre la misma cueva y nombrar la herramienta que agregó cada una.",
      "Plantear un problema propio como MDP, diciendo quién define la recompensa, quién la ve y cómo podría el agente hacer trampa.",
      "Presentar el proyecto entre pares y devolver otros con una rúbrica.",
      "Explicar la difusión del curso como un bandit y el curso entero a otra persona."
    ],
    tiempo: { pagina: 35 },
    previos: ["15", "1"],
    requisitos: ["De la clase 1, el marco: Freire, Foucault y Dawkins; de la clase 15, las dos preguntas: a favor de quién juega la recompensa y cómo podría hacer trampa.", "Para resolver tu MDP, el notebook de la clase 4 (la celda del ejercicio final, con resolver_mdp). Esta clase no tiene notebook propio."],
    cuestionario: [
      {
        objetivo: "O1",
        pregunta: "En el recorrido, la parada 4 muestra flechas en todas las casillas de la cueva y la parada 6 solo en las casillas por donde pasó el agente. ¿Qué herramienta agregó cada una de esas dos clases?",
        opciones: [
          { texto: "La 4 agregó policy gradient, con flechas que son probabilidades, y la 6 la memoria de una red recurrente que recuerda por dónde pasó.", explicacion: "No: las flechas como probabilidades son de la clase 11 y la memoria de la clase 9. En el recorrido, la 4 planifica con el mapa y la 6 aprende jugando." },
          { texto: "La 4 agregó Monte Carlo y TD, que estiman el valor con partidas jugadas, y la 6 la exploración con un bandit que cuenta visitas.", explicacion: "No: Monte Carlo y TD son la parada 5, y contar visitas es la 7. Las flechas en toda la cueva salen de tener el mapa, sin jugar ninguna partida." },
          { texto: "La 4 agregó iteración de valor y de política con el mapa; la 6, SARSA y Q-learning, que aprenden las flechas de la experiencia, solo donde el agente estuvo.", explicacion: "Correcto. Con el mapa, el valor se derrama desde la salida y hay flecha en cada casilla; sin mapa, el agente solo sabe qué hacer en las casillas que visitó." },
          { texto: "Las dos agregaron lo mismo, la ecuación de Bellman: la 6 tiene menos flechas porque usa un γ más chico que la 4.", explicacion: "No: Bellman es de la clase 3 y las dos clases la usan. La diferencia no está en γ sino en de dónde sale lo aprendido: del mapa en la 4, de partidas jugadas en la 6." }
        ],
        correcta: 2
      },
      {
        objetivo: "O2",
        pregunta: "Elegís como proyecto los recordatorios de una app para estudiar. ¿Cuál de estas fichas cumple lo que pide el bloque 2 para plantear el problema como MDP?",
        opciones: [
          { texto: "Estados: cada minuto del día de cada persona que usa la app. Acciones: mandar o no un recordatorio. Recompensa: +1 cada vez que abre la app. γ = 0,9.", explicacion: "No: son demasiados estados para resolverlo en el notebook (el bloque pide de 3 a 30), y la ficha no dice quién define la recompensa, quién la ve ni cómo se podría hacer trampa." },
          { texto: "Estados: al día, atrasada, abandonó. Acciones: recordar, no recordar. P estimadas para cada par. Recompensa: +1 si queda al día, −1 si no; γ = 0,9. La define quien estudia y la ve en la app; si premiara abrir la app, el agente recordaría siempre hasta que la desinstale.", explicacion: "Correcto. Tiene pocos estados, acciones, P, R y γ, dice quién define la recompensa y quién la ve, y nombra una trampa concreta, como la del riego que premia quien vende el agua." },
          { texto: "Estados: al día, atrasada, abandonó. Acciones: recordar, no recordar. Recompensa: +1 por cada recordatorio enviado, definida por la empresa. γ = 0,9. Trampa: ninguna, porque la recompensa está clarísima.", explicacion: "No: es el caso de la planta con la recompensa de quien vende el agua. Premiar cada recordatorio lleva a recordar siempre; que la recompensa sea clara no quiere decir que mida lo que se quiere." },
          { texto: "Estados y acciones listados, sin P ni γ: el notebook de la clase 4 las adivina a partir de los nombres. La recompensa la define quien estudia y no hay trampa posible porque nadie más la ve.", explicacion: "No: resolver_mdp necesita las transiciones y γ que vos le das; no adivina nada. Y que nadie más vea la recompensa no impide que el agente la cumpla sin hacer lo que querías." }
        ],
        correcta: 1
      },
      {
        objetivo: "O3",
        pregunta: "Te toca devolver un proyecto: los estados son pocos y alcanzan para decidir, la recompensa mide lo que se quiere y dice quién la define, la presentación se entiende sin haber hecho el curso, pero la ficha no nombra ninguna trampa. ¿Qué devolución sigue la rúbrica de la página?",
        opciones: [
          { texto: "Poner «cumple» en los cuatro criterios: tres partes están muy bien y una sola que falte no alcanza para bajar la nota.", explicacion: "No: la rúbrica no es una nota general. Tiene un criterio por cada parte de la ficha, y el de la trampa, sin ninguna trampa nombrada, queda en «falta»." },
          { texto: "Calcular si la política que sale del notebook consigue la recompensa más alta posible y devolver ese número como criterio principal.", explicacion: "No: ningún criterio de la rúbrica mide cuánto rinde la política. Mide si el planteo está completo y se entiende: estados y acciones, recompensa, trampa y presentación." },
          { texto: "Marcar «a medias» la presentación porque no usa los términos del curso, como MDP o γ, y pedirle que agregue las fórmulas.", explicacion: "No: el criterio de la presentación es al revés, que se entienda en cinco minutos sin haber hecho el curso. Si se entiende sin fórmulas, cumple." },
          { texto: "Marcar «falta» en Trampa, «cumple» en los otros tres, y nombrar una trampa que quien escribió el proyecto no vio, con una pregunta para esa persona.", explicacion: "Correcto. Cada criterio se marca por separado, y la página dice que una devolución útil nombra una trampa que quien escribió no vio: acá es justo lo que más ayuda." }
        ],
        correcta: 3
      },
      {
        objetivo: "O4",
        pregunta: "El bloque 4 plantea la campaña de difusión del curso como un bandit, el ejemplo resuelto del proyecto final. ¿Qué es cada pieza?",
        opciones: [
          { texto: "Los brazos son los cuatro tipos de post (intriga, concepto, demo, invitación a enseñar); la recompensa, guardados, compartidos y visitas al repositorio por cada mil alcanzadas, con pesos; UCB elige sumando una bonificación por lo poco probado.", explicacion: "Correcto. Es el bandit de la clase 7: los primeros cuatro posts prueban cada tipo una vez y desde el quinto decide el bandit. La visita al repositorio pesa más porque mide fidelidad." },
          { texto: "Los brazos son las personas alcanzadas; la recompensa, el alcance total de cada post; y se elige siempre el tipo que más gente alcanzó.", explicacion: "No: los brazos son los tipos de post, lo que el curso puede elegir. Y la recompensa se mide por cada mil alcanzadas, para no premiar solo llegar a mucha gente que no guarda ni comparte nada." },
          { texto: "Los brazos son los tipos de post y la recompensa los guardados, pero después de probar cada tipo una vez se publica siempre el de mejor promedio.", explicacion: "No: eso es elegir siempre el mejor promedio y dejar de explorar. UCB le suma a cada brazo una bonificación por lo poco probado: √(ln t / nₐ) crece para el tipo que se publicó menos." },
          { texto: "Es un MDP con las semanas como estados, que se resuelve con iteración de valor como la planta, porque cada post cambia la cueva del siguiente.", explicacion: "No: el bloque lo plantea como bandit, elegir entre brazos según la recompensa que dieron, y lo resuelve con UCB o con muestreo de Thompson, como en la clase 7." }
        ],
        correcta: 0
      },
      {
        objetivo: "O2",
        pregunta: "En el bloque 5 apretás «Que la elija otro» y después tocás vos otra casilla para poner la salida, sin mover γ. En los dos casos el agente encuentra el camino. ¿Qué muestra esto sobre la pregunta de Foucault?",
        opciones: [
          { texto: "Que con la salida puesta por otro el agente aprende peor: la iteración de valor funciona mejor cuando la meta la elige uno mismo.", explicacion: "No: el algoritmo es el mismo, la iteración de valor de la clase 4, y persigue igual de bien cualquier salida. Justamente por eso importa quién la puso." },
          { texto: "Que quién pone la salida da igual siempre que γ sea alto: con γ cerca de 1 el agente llega a cualquier meta y elige bien por sí solo.", explicacion: "No: γ dice qué tan lejos ve el agente, no dónde está la salida. Con γ alto llega más lejos, pero a la meta que eligió otro." },
          { texto: "Que el algoritmo no cambia y solo cambia quién eligió la meta; para Foucault, cuidarse es poder ver dónde está tu salida y quién la puso, en vez de aceptar la de otro.", explicacion: "Correcto. Es la pregunta de la clase 1 con las herramientas del curso, y las dos preguntas de la clase 15 hechas sobre vos: a favor de quién juega tu recompensa y cómo podría hacerte trampa." },
          { texto: "Que la mejor salida es la que más se copia: según Dawkins, la recompensa que se propaga con más fidelidad es la que conviene elegir.", explicacion: "No: Dawkins explica cómo se propaga el curso, no quién elige la recompensa. La pregunta de quién pone la salida es de Foucault, y que una meta se copie mucho no dice a favor de quién juega." }
        ],
        correcta: 2
      }
    ],
    actividad: {
      titulo: "Proyecto final",
      consigna: "Elegí una decisión que se repite en tu área y completá la ficha del bloque 2: estados (de 3 a 30), acciones, recompensa, γ, quién define la recompensa y quién la ve, y cómo podría el agente hacer trampa y cómo lo evitarías. Si querés ver la política, copiala como Python y resolvela en la celda del ejercicio del notebook de la clase 4. Sumale la presentación de cinco minutos para alguien que no hizo el curso y publicalo en Discussions con el título [Clase 16] Proyecto final: … Después devolvé los proyectos de las dos personas que te toquen en la ronda, con los cuatro criterios del bloque 3, y nombrá en cada uno una trampa que quien lo escribió no vio. Usá la pregunta de «Para enseñarlo»: ¿qué aprendiste vos porque alguien te lo enseñó, y a quién se lo enseñaste después? Cerralo con la oración de «Para enseñarlo»: le enseñamos a una máquina a salir de una cueva a oscuras y en el camino aprendimos a ver quién pone la salida. Otra persona te devuelve con los cuatro criterios del bloque 3; la rúbrica de abajo evalúa la actividad entera.",
      rubrica: [
        "La ficha plantea un problema propio como MDP con pocos estados que alcanzan para decidir, acciones, recompensa y γ, de modo que se podría cargar en el notebook de la clase 4.",
        "Se dice quién define la recompensa y quién la ve, y se nombra al menos una trampa posible con una forma concreta de evitarla.",
        "La presentación se entiende en cinco minutos sin haber hecho el curso, y las dos devoluciones usan la rúbrica y nombran una trampa que quien escribió no vio."
      ]
    }
  }
};
