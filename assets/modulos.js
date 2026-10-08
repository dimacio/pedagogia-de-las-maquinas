/* modulos.js — datos de cada clase de "RL a ciegas" (MOOC libre).
   Lo lee Cueva.pagina() para armar "Antes de empezar", el cuestionario y la actividad entre pares.
   Cada clase:
     objetivos     3–4 verbos observables
     tiempo        minutos estimados { pagina, notebook }
     previos       ids de clases que conviene haber hecho
     requisitos    otros requisitos (texto)
     cuestionario  5 preguntas: { pregunta, opciones: [{ texto, explicacion }], correcta: índice }
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
        pregunta: "¿Qué controla la velocidad con la que cae el error de la iteración?",
        opciones: [
          { texto: "El orden en que numeramos las casillas.", explicacion: "No: renumerar cambia el dibujo de la matriz, no sus autovalores ni la velocidad." },
          { texto: "El valor de la recompensa en la salida.", explicacion: "No: R escala el resultado pero no la velocidad con la que se llega." },
          { texto: "El descuento γ: el error se multiplica por a lo sumo γ en cada vuelta.", explicacion: "Correcto. En escala log el error cae como una recta, nunca más despacio que la pendiente log γ." },
          { texto: "La cantidad de paredes.", explicacion: "Las paredes cambian P, pero la cota de velocidad la fija γ." }
        ],
        correcta: 2
      },
      {
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

  // placeholder: lo completa quien escribe la clase 1
  "1": {
    objetivos: [],
    tiempo: {},
    previos: [],
    requisitos: []
  },
  "2": {
    objetivos: [
      "Identificar agente, entorno, acción, observación y recompensa en la cueva y en otro problema.",
      "Distinguir historia de estado y decidir si una observación cumple el supuesto de Markov.",
      "Explicar con el tutor de sumas y restas qué es la trampa de la recompensa (reward hacking).",
      "Proponer una recompensa alternativa y anticipar cómo podría ser engañada."
    ],
    tiempo: { pagina: 25, notebook: 60 },
    previos: ["0a", "0b"],
    requisitos: ["Haber jugado un rato a la cueva a ciegas en modo fácil."],
    cuestionario: [
      {
        pregunta: "En la cueva el agente recibe 0 durante 21 pasos seguidos y +1 al final. ¿Qué dificultad muestra eso?",
        opciones: [
          { texto: "Que la recompensa es escasa y llega tarde: mientras recibe 0, perderse y acercarse se ven igual.", explicacion: "Correcto. Sin pistas intermedias, el agente no sabe si iba bien hasta que llega." },
          { texto: "Que la recompensa está mal programada.", explicacion: "No: es un diseño deliberado y muy común; muchas tareas solo pagan al final." },
          { texto: "Que el agente no tiene acciones suficientes.", explicacion: "No: con las cuatro flechas puede llegar; el problema es saber cuáles convenían." },
          { texto: "Que el entorno no es determinista.", explicacion: "No: en esta cueva el mismo paso da siempre lo mismo." }
        ],
        correcta: 0
      },
      {
        pregunta: "¿Qué es el estado?",
        opciones: [
          { texto: "La historia completa de acciones, observaciones y recompensas.", explicacion: "Eso es la historia hₜ. El estado es un resumen de ella." },
          { texto: "Un resumen de la historia que alcanza para decidir.", explicacion: "Correcto. sₜ = f(hₜ): lo mínimo que hay que recordar para elegir bien." },
          { texto: "La última observación, siempre.", explicacion: "A veces alcanza (si es Markov), pero no siempre: con solo bigotes no alcanza." },
          { texto: "El mapa completo de la cueva.", explicacion: "El agente no tiene el mapa; eso lo conoce solo el entorno." }
        ],
        correcta: 1
      },
      {
        pregunta: "Las historias A y B son distintas pero terminan en la misma casilla. Si el agente sabe su casilla, ¿qué dice el supuesto de Markov?",
        opciones: [
          { texto: "Que hay que elegir según cuál de las dos historias fue más corta.", explicacion: "No: el largo del camino previo no cambia qué conviene hacer ahora." },
          { texto: "Que desde ahí conviene lo mismo: dada la casilla, el camino previo no importa.", explicacion: "Correcto. p(sₜ₊₁ | sₜ, aₜ) = p(sₜ₊₁ | hₜ, aₜ)." },
          { texto: "Que el futuro es completamente al azar.", explicacion: "No: Markov habla de qué información alcanza, no de azar." },
          { texto: "Que hay que guardar las dos historias.", explicacion: "Justamente lo contrario: con la casilla alcanza." }
        ],
        correcta: 1
      },
      {
        pregunta: "Si el agente solo siente cuatro bigotes (paredes vecinas), las 60 casillas dan 12 lecturas distintas. ¿Por qué eso rompe el supuesto de Markov?",
        opciones: [
          { texto: "Porque 12 lecturas son demasiadas para aprender.", explicacion: "No: el problema no es la cantidad, es que se mezclan casillas distintas." },
          { texto: "Porque casillas que se sienten igual pueden pedir flechas distintas.", explicacion: "Correcto. Un pasillo vertical se siente igual en toda la cueva, pero en unos conviene subir y en otros bajar." },
          { texto: "Porque los bigotes a veces fallan.", explicacion: "En la figura los bigotes no fallan; aun siendo exactos no alcanzan." },
          { texto: "No lo rompe: con bigotes el agente sabe dónde está.", explicacion: "No: los bigotes describen el entorno inmediato, no la posición." }
        ],
        correcta: 1
      },
      {
        pregunta: "El tutor cobra +1 si el alumno acierta y −1 si se equivoca. ¿Qué política le da más recompensa?",
        opciones: [
          { texto: "Alternar sumas y restas.", explicacion: "Ese alumno aprende más, pero el tutor cobra menos: el alumno se equivoca mucho al principio." },
          { texto: "Mayormente restas.", explicacion: "Es la que más enseña a restar y la que peor paga con +1/−1." },
          { texto: "Solo sumas, y el alumno nunca aprende a restar.", explicacion: "Correcto. El tutor optimiza lo que le pedimos (aciertos), no lo que queríamos (aprendizaje): es la trampa de la recompensa." },
          { texto: "Todas dan lo mismo.", explicacion: "No: el gráfico ordena las políticas al revés según qué se mida." }
        ],
        correcta: 2
      }
    ],
    actividad: {
      titulo: "Tu propio tutor tramposo",
      consigna: "Elegí un problema real donde alguien (persona o programa) es premiado por un número: un tutor, un vendedor, una app. Escribí agente, entorno, acción, observación y recompensa; describí una forma en que el agente podría cobrar mucho sin lograr lo que se quería, y proponé una recompensa mejor. Publicalo en Discussions; un compañero busca una trampa nueva en tu recompensa corregida y te devuelve la rúbrica.",
      rubrica: [
        "Los cinco elementos están bien identificados y la acción la elige el agente, no el entorno.",
        "La trampa es concreta y verosímil, como el tutor que solo da sumas.",
        "La recompensa corregida es medible y cierra la trampa, o reconoce con honestidad qué queda abierto."
      ]
    }
  },

  "3": {
    objetivos: [
      "Describir la cueva como MDP (S, A, P, R, γ) y calcular el peso γᵗ de una recompensa futura.",
      "Evaluar una política con la ecuación de Bellman y explicar cómo el valor se derrama desde la salida.",
      "Diferenciar iteración de valor de iteración de política.",
      "Predecir el efecto de γ, del costo por paso y del slip sobre los valores y las flechas."
    ],
    tiempo: { pagina: 30, notebook: 75 },
    previos: ["0c", "2"],
    requisitos: [],
    cuestionario: [
      {
        pregunta: "¿Un γ grande hace que pesen más las recompensas inmediatas?",
        opciones: [
          { texto: "Sí: γ grande significa apuro.", explicacion: "Al revés: con γ = 0,5 la curva de pesos se desploma en pocos pasos; con γ = 0,99 casi no baja." },
          { texto: "No: con γ grande las recompensas lejanas pesan casi tanto como las inmediatas.", explicacion: "Correcto. El peso γᵗ baja más despacio cuanto más cerca de 1 está γ." },
          { texto: "γ no cambia los pesos, solo la velocidad del algoritmo.", explicacion: "No: γ es justamente el peso de cada recompensa futura." },
          { texto: "Depende de la cueva.", explicacion: "No: γᵗ es la misma cuenta en cualquier problema." }
        ],
        correcta: 1
      },
      {
        pregunta: "Evaluando la política al azar, V(S) ≈ 0,014. ¿Qué dice ese número?",
        opciones: [
          { texto: "Que S está a 14 pasos de la salida.", explicacion: "No: V no mide distancia; la salida está a 20 pasos." },
          { texto: "Que un jugador que camina al azar casi nunca sale pronto: su retorno esperado es muy bajo.", explicacion: "Correcto. El valor está concentrado cerca de la salida y se diluye en los caminos al azar." },
          { texto: "Que la evaluación todavía no convergió.", explicacion: "No: es el valor final de la política al azar." },
          { texto: "Que la política al azar es la óptima.", explicacion: "No: la óptima vale mucho más desde S." }
        ],
        correcta: 1
      },
      {
        pregunta: "¿Qué cambia de la evaluación de una política a la iteración de valor?",
        opciones: [
          { texto: "En vez de promediar las acciones con π(a|s), se queda con la mejor (max).", explicacion: "Correcto. Es la ecuación de Bellman de optimalidad: V*(s) = maxₐ [ … ]." },
          { texto: "Deja de usar el modelo P(s'|s,a).", explicacion: "No: la iteración de valor sigue necesitando el mapa; eso cambia recién en la clase 4." },
          { texto: "Usa γ = 1.", explicacion: "No: γ puede ser el mismo en las dos." },
          { texto: "Actualiza una sola casilla por vez.", explicacion: "No: las dos recorren todas las casillas en cada iteración." }
        ],
        correcta: 0
      },
      {
        pregunta: "Con γ = 1 y sin costo por paso, ¿qué pasa en la iteración de valor?",
        opciones: [
          { texto: "El agente llega más rápido que nunca.", explicacion: "Al revés: no llega." },
          { texto: "Todo vale 1, las flechas empatan y el agente puede quedarse chocando.", explicacion: "Correcto. Llegar ahora o en mil pasos da lo mismo; un costo por paso devuelve el apuro." },
          { texto: "Los valores divergen a infinito.", explicacion: "No: la única recompensa es +1 al salir, así que nada supera 1." },
          { texto: "Solo cambian los colores, no las flechas.", explicacion: "Cambian las dos cosas: el mapa queda plano y las flechas pierden sentido." }
        ],
        correcta: 1
      },
      {
        pregunta: "Con slip = 0,4 en esta cueva, ¿qué cambia en la política óptima?",
        opciones: [
          { texto: "Las flechas cambian por completo.", explicacion: "No: sin pozos ni peligros, la mejor dirección sigue siendo la misma." },
          { texto: "Casi no cambian las flechas; bajan los valores, porque resbalar solo hace perder tiempo.", explicacion: "Correcto. Cada partida es distinta, por eso V es un retorno esperado, pero el camino recomendado es el mismo." },
          { texto: "Nada: ni flechas ni valores.", explicacion: "Los valores sí bajan: con slip se tarda más en promedio." },
          { texto: "El agente deja de poder llegar.", explicacion: "No: llega igual, solo que tarda más y de forma variable." }
        ],
        correcta: 1
      }
    ],
    actividad: {
      titulo: "El valor se derrama",
      consigna: "Dibujá un pasillo de 5 a 7 casillas con la salida en un extremo y un desvío. Hacé las rondas a mano: en cada ronda, cada casilla escribe max(0,9 × V del vecino), con +1 si el vecino es la salida. Publicá la tabla ronda por ronda y cuántas rondas tardó el valor en llegar a S. Respondé: en el penúltimo paso antes de la salida, ¿qué necesitás saber primero? Un compañero revisa las cuentas y te devuelve la rúbrica.",
      rubrica: [
        "Las cuentas son correctas en cada ronda (1; 0,9; 0,81; …).",
        "Se compara la cantidad de rondas con la distancia a la salida y se explica por qué coinciden.",
        "La respuesta sobre el penúltimo paso dice que primero hay que conocer el valor del último."
      ]
    }
  },

  "4": {
    objetivos: [
      "Explicar cómo Monte Carlo y TD estiman V sin conocer P ni R, y cuándo conviene cada uno.",
      "Aplicar a mano una actualización de Q-learning con α, r y γ.",
      "Distinguir SARSA (on-policy) de Q-learning (off-policy) por el término objetivo.",
      "Relacionar el mapa de visitas con los errores de lo aprendido."
    ],
    tiempo: { pagina: 30, notebook: 75 },
    previos: ["3"],
    requisitos: [],
    cuestionario: [
      {
        pregunta: "¿En qué se diferencia TD(0) de Monte Carlo?",
        opciones: [
          { texto: "TD necesita el mapa y Monte Carlo no.", explicacion: "No: ninguno de los dos usa P ni R; los dos aprenden de lo que pasó." },
          { texto: "TD corrige V después de cada paso usando su propia estimación del lugar al que llegó.", explicacion: "Correcto. Eso es bootstrapping; Monte Carlo espera al final de la partida y promedia el retorno real." },
          { texto: "Monte Carlo actualiza en cada paso y TD al final.", explicacion: "Es al revés." },
          { texto: "Son lo mismo con otro nombre.", explicacion: "No: el gráfico muestra curvas de error distintas para cada uno." }
        ],
        correcta: 1
      },
      {
        pregunta: "Con partidas cortadas a 200 pasos, Monte Carlo se estanca. ¿Qué le falta al retorno de una partida cortada?",
        opciones: [
          { texto: "La parte del futuro que no se jugó: si no llegó a la salida, el retorno es 0 aunque estuviera cerca.", explicacion: "Correcto. Monte Carlo solo promedia lo que vio; TD, en cambio, usa su estimación del lugar donde quedó." },
          { texto: "Nada: el retorno es exacto.", explicacion: "No: cortar la partida cambia el retorno, porque omite recompensas que podrían haber llegado." },
          { texto: "El valor de α.", explicacion: "α es la tasa de aprendizaje; no forma parte del retorno." },
          { texto: "La política.", explicacion: "La política es la misma; lo que falta es el resto de la partida." }
        ],
        correcta: 0
      },
      {
        pregunta: "Q(s,a) = 0,2, α = 0,5, r = 0, γ = 0,9 y maxₐ' Q(s',a') = 0,6. ¿Cuánto vale Q(s,a) después de la actualización de Q-learning?",
        opciones: [
          { texto: "0,54", explicacion: "Ese es el objetivo r + γ·max Q = 0,54. Con α = 0,5 solo se avanza la mitad del camino." },
          { texto: "0,37", explicacion: "Correcto. 0,2 + 0,5 × (0 + 0,9 × 0,6 − 0,2) = 0,2 + 0,5 × 0,34 = 0,37." },
          { texto: "0,47", explicacion: "Falta restar Q(s,a) dentro del corchete: el error es 0,54 − 0,2, no 0,54." },
          { texto: "0,27", explicacion: "Eso es 0,5 × 0,54: falta partir del valor anterior y restarlo en el error." }
        ],
        correcta: 1
      },
      {
        pregunta: "Con ε = 0,4, SARSA estima un V(S) más bajo que Q-learning aunque los dos encuentran el mismo camino. ¿Por qué?",
        opciones: [
          { texto: "Porque SARSA aprende más despacio.", explicacion: "No es una cuestión de velocidad: después de 500 partidas la diferencia se mantiene." },
          { texto: "Porque SARSA aprende el valor de lo que de verdad hace, exploración incluida; Q-learning, el de la mejor acción posible.", explicacion: "Correcto. SARSA usa r + γQ(s', a') con la acción que va a elegir; Q-learning usa maxₐ' (off-policy)." },
          { texto: "Porque SARSA no usa γ.", explicacion: "No: los dos descuentan con el mismo γ." },
          { texto: "Porque Q-learning hace trampa con el mapa.", explicacion: "No: ninguno de los dos ve el mapa." }
        ],
        correcta: 1
      },
      {
        pregunta: "En el mapa de visitas, las flechas aprendidas que no son óptimas están casi todas en casillas por las que el agente dejó de pasar. ¿Qué enseña eso?",
        opciones: [
          { texto: "Que Q-learning está mal implementado.", explicacion: "No: es un comportamiento esperable del algoritmo." },
          { texto: "Que el agente solo corrige lo que sigue visitando: donde no pasa, lo aprendido queda congelado.", explicacion: "Correcto. Y es el adelanto de la clase 5: con un 10 % de azar, en una cueva grande hay zonas que no se exploran nunca." },
          { texto: "Que hay que bajar ε a 0.", explicacion: "Al revés: sin exploración visitaría todavía menos casillas." },
          { texto: "Que esas casillas no tienen valor.", explicacion: "Sí tienen valor verdadero; lo que pasa es que la estimación no se actualizó." }
        ],
        correcta: 1
      }
    ],
    actividad: {
      titulo: "El 1 que viaja hacia atrás",
      consigna: "Hacé a mano el ejercicio del pasillo: 5 casillas con Q(avanzar) = 0, salida al final, Q ← Q + 0,5 (r + Q del siguiente − Q) con r = 1 solo al salir, tres pasadas. Publicá la tabla después de cada pasada y respondé: para estimar cuánto tardás en llegar a tu casa, ¿esperás a llegar (Monte Carlo) o corregís en cada esquina (TD)? Un compañero revisa las cuentas y te devuelve la rúbrica.",
      rubrica: [
        "Las cuentas son correctas (después de la tercera pasada: 0; 0; 0,125; 0,5; 0,875).",
        "Se explica cuántas pasadas hacen falta para que la primera casilla deje de valer 0 y por qué.",
        "La respuesta sobre el viaje a casa distingue esperar al final (Monte Carlo) de corregir en cada esquina (TD)."
      ]
    }
  },

  "5": {
    objetivos: [
      "Explicar por qué ε-greedy no encuentra la salida cuando la recompensa es escasa.",
      "Comparar la curiosidad por conteo con el optimismo inicial y explicar por qué el optimismo no escala a Atari.",
      "Describir cómo Go-Explore usa un archivo y la restauración de estados contra el desapego y el descarrilamiento.",
      "Elegir la resolución de una celda reducida y justificar el compromiso entre mezclar lugares y hacer explotar el archivo."
    ],
    tiempo: { pagina: 30, notebook: 75 },
    previos: ["4"],
    requisitos: [],
    cuestionario: [
      {
        pregunta: "En la cueva grande la recompensa es 0 en todos lados salvo la salida. ¿Por qué ε-greedy no la encuentra?",
        opciones: [
          { texto: "Porque ε = 0,1 es demasiado chico; con ε = 0,5 la encontraría.", explicacion: "El problema no es ε: sin recompensa, la parte greedy tampoco sabe adónde ir." },
          { texto: "Porque la tabla Q queda en ceros, la elección greedy es un empate y el agente hace una caminata al azar pegada a la entrada.", explicacion: "Correcto. Una caminata al azar se aleja como √t pasos, y la salida está a 44." },
          { texto: "Porque Q-learning no funciona en cuevas grandes.", explicacion: "No: el mismo Q-learning con otra exploración sí la encuentra." },
          { texto: "Porque γ = 0,9 es muy bajo.", explicacion: "γ importa después de encontrar la salida; antes, Q está en 0 con cualquier γ." }
        ],
        correcta: 1
      },
      {
        pregunta: "El optimismo inicial (Q = 1 en todo) gana por lejos en la tabla. ¿Por qué no se puede usar igual en Atari?",
        opciones: [
          { texto: "Porque en Atari la recompensa máxima no es 1.", explicacion: "Se podría elegir otro valor alto; el obstáculo es otro." },
          { texto: "Porque en Atari no hay tabla: el valor sale de una red, y no se puede poner un 1 en cada pantalla que todavía no se vio.", explicacion: "Correcto. La red generaliza desde lo visto y no guarda un casillero por pantalla." },
          { texto: "Porque en Atari no hay paredes.", explicacion: "Las paredes no tienen que ver con el optimismo." },
          { texto: "Porque el optimismo solo funciona con γ = 1.", explicacion: "No: la clase usa γ = 0,9." }
        ],
        correcta: 1
      },
      {
        pregunta: "Go-Explore corrige el desapego con ___ y el descarrilamiento con ___.",
        opciones: [
          { texto: "un premio por novedad / un ε más chico.", explicacion: "El premio por novedad es la curiosidad, que justamente sufre de desapego." },
          { texto: "el archivo de celdas visitadas / la restauración del estado del simulador.", explicacion: "Correcto. El archivo no olvida fronteras prometedoras, y restaurar el estado evita desviarse al volver." },
          { texto: "una red neuronal / la memoria de repetición.", explicacion: "Esos son ingredientes de DQN (clase 6), no de Go-Explore." },
          { texto: "optimismo inicial / iteración de valor.", explicacion: "Go-Explore no usa tabla Q ni modelo en su primera fase." }
        ],
        correcta: 1
      },
      {
        pregunta: "Con P(volver sin desviarse) ≈ (1 − ¾ε)^L, ε = 0,1 y un camino de 40 pasos, ¿qué fracción de los intentos llega?",
        opciones: [
          { texto: "Alrededor del 90 %.", explicacion: "Eso sería para un solo paso con ε = 0,1 o poco más. Cuarenta pasos multiplican el riesgo." },
          { texto: "Alrededor del 25 %.", explicacion: "Demasiado optimista: 0,925⁴⁰ es bastante menor." },
          { texto: "Alrededor del 4 %.", explicacion: "Correcto. 0,925⁴⁰ ≈ 0,044: casi todos los intentos descarrilan." },
          { texto: "Menos del 0,1 %.", explicacion: "Demasiado pesimista: con ε = 0,1 todavía llega alrededor de 1 de cada 23." }
        ],
        correcta: 2
      },
      {
        pregunta: "Go-Explore reduce cada pantalla a una celda chica en tonos de gris. ¿Qué pasa si la reducción es muy fina?",
        opciones: [
          { texto: "Todo se mezcla y el archivo no distingue lugares.", explicacion: "Eso pasa si es muy gruesa." },
          { texto: "Cada pantalla es una celda distinta y el archivo explota.", explicacion: "Correcto. Se busca que pantallas parecidas caigan en la misma celda, sin mezclar lugares distintos." },
          { texto: "El agente deja de poder restaurar estados.", explicacion: "La restauración no depende de la resolución de la celda." },
          { texto: "No cambia nada.", explicacion: "Cambia mucho: el contador de la figura va de unas pocas celdas a una por posición." }
        ],
        correcta: 1
      }
    ],
    actividad: {
      titulo: "Buscar a ciegas, con método",
      consigna: "Dibujá una grilla de 6×6 con paredes y una salida escondida. Explorala dos veces con las reglas de la clase: (1) tirar un dado para elegir la dirección; (2) llevar una lista de casillas visitadas y volver siempre a la menos visitada antes de seguir. Publicá cuántas jugadas tardó cada regla y la grilla como texto con la salida tapada, para que un compañero la explore con la regla 2 y te devuelva la rúbrica.",
      rubrica: [
        "Se reportan las jugadas de las dos reglas en la misma grilla.",
        "La comparación se explica con ε-greedy (el dado) y con Go-Explore (la lista y el volver).",
        "Se nombra un caso real donde no se puede \"volver\" restaurando el estado, y qué haría falta en su lugar."
      ]
    }
  },

  "6": {
    objetivos: [
      "Leer la tabla Q como una matriz de casillas × acciones y como una función.",
      "Explicar por qué una red con entrada one-hot equivale a la tabla.",
      "Nombrar los ingredientes de DQN (memoria de repetición, red objetivo, ε decreciente) y para qué sirve cada uno.",
      "Explicar con un ejemplo qué es generalizar y cuándo engaña (vecinas separadas por una pared)."
    ],
    tiempo: { pagina: 30, notebook: 90 },
    previos: ["4", "5"],
    requisitos: ["Haber visto alguna vez una red neuronal ayuda, pero no es necesario.", "El notebook usa PyTorch en CPU (en Colab ya viene instalado)."],
    cuestionario: [
      {
        pregunta: "¿Qué tamaño tiene la tabla Q de la cueva chica?",
        opciones: [
          { texto: "60 × 4: una fila por casilla libre y una columna por acción.", explicacion: "Correcto. Por eso se puede mirar como una imagen de 60 × 4." },
          { texto: "10 × 14: una por cada casilla del mapa.", explicacion: "Ese es el mapa entero, con paredes. Q tiene una fila por casilla libre y una columna por acción." },
          { texto: "4 × 4.", explicacion: "No: hay 60 casillas libres, no 4." },
          { texto: "60 × 60.", explicacion: "Esa es la forma de la matriz P de la nivelación 0c, no de Q." }
        ],
        correcta: 0
      },
      {
        pregunta: "Una red lineal sin sesgo con entrada one-hot, ¿en qué se diferencia de la tabla Q?",
        opciones: [
          { texto: "En nada: sus pesos son la tabla, y cada paso de gradiente cambia un solo casillero.", explicacion: "Correcto. La red empieza a ser útil cuando la entrada describe la casilla y casillas parecidas se parecen." },
          { texto: "Generaliza mucho mejor que la tabla.", explicacion: "No: con one-hot ninguna casilla comparte entrada con otra, así que no hay nada que generalizar." },
          { texto: "Necesita el mapa.", explicacion: "No: aprende de las mismas transiciones que la tabla." },
          { texto: "Solo puede aprender V, no Q.", explicacion: "No: tiene cuatro salidas, una por acción." }
        ],
        correcta: 0
      },
      {
        pregunta: "En DQN el objetivo r + γ max Q(s′, a′) usa la misma red que se está entrenando. ¿Para qué sirve la red objetivo?",
        opciones: [
          { texto: "Para explorar más.", explicacion: "La exploración la controla ε, no la red objetivo." },
          { texto: "Para que el objetivo no se mueva con cada paso de gradiente: es una copia congelada que se actualiza cada tanto.", explicacion: "Correcto. En la clase, se copia cada 50 pasos." },
          { texto: "Para guardar las transiciones pasadas.", explicacion: "Eso es la memoria de repetición (replay)." },
          { texto: "Para tener más parámetros.", explicacion: "No agrega capacidad: es una copia de la misma red." }
        ],
        correcta: 1
      },
      {
        pregunta: "En las casillas poco visitadas, el error de la tabla es 0,660 y el de la red 0,044. ¿Por qué la red acierta más ahí?",
        opciones: [
          { texto: "Porque tiene más parámetros que la tabla.", explicacion: "Tiene más (1.412 contra 240), pero la ventaja no viene de ahí: viene de compartirlos." },
          { texto: "Porque casillas cercanas tienen entradas parecidas y comparten parámetros.", explicacion: "Correcto. Lo aprendido en las casillas visitadas se extiende a sus vecinas parecidas: eso es generalizar." },
          { texto: "Porque la red visitó esas casillas más veces.", explicacion: "No: las dos tuvieron el mismo presupuesto y la misma política." },
          { texto: "Porque la red conoce el mapa.", explicacion: "No: solo recibe posición y bigotes." }
        ],
        correcta: 1
      },
      {
        pregunta: "En el notebook, DQN sin memoria de repetición no llega a una política que salga. ¿Por qué?",
        opciones: [
          { texto: "Porque sin memoria no hay exploración.", explicacion: "ε sigue funcionando igual; el problema es otro." },
          { texto: "Porque aprende siempre de la zona donde está parado y cada paso de gradiente pisa lo aprendido en otra parte.", explicacion: "Correcto. Es el olvido catastrófico; con la tabla no pasaba porque cada casillero es independiente." },
          { texto: "Porque la red es demasiado chica.", explicacion: "La misma red con memoria sí aprende." },
          { texto: "Porque la memoria guarda el mapa.", explicacion: "No: guarda transiciones (s, a, r, s′) para entrenar con lotes al azar." }
        ],
        correcta: 1
      }
    ],
    actividad: {
      titulo: "Generalizar a mano",
      consigna: "Tomá la cueva chica con su V* (la figura de la clase te da los números al pasar el puntero). Elegí tres casillas con su valor y estimá el de una casilla cercana que no miraste, con una regla que puedas escribir (promedio, \"un poco menos si está más lejos de la salida\"). Publicá tu regla, la estimación y el valor real. Un compañero te propone otra casilla, vecina pero del otro lado de una pared, aplica tu regla y te devuelve la rúbrica.",
      rubrica: [
        "La regla de estimación está escrita de forma que otra persona la pueda repetir.",
        "Se compara la estimación con el V* real y se dice cuánto se equivocó.",
        "Se discute el caso de la casilla del otro lado de la pared: por qué ser vecinas no alcanza."
      ]
    }
  },

  // placeholder: lo completa quien escribe la clase 7
  "7": {
    objetivos: [],
    tiempo: {},
    previos: [],
    requisitos: []
  },
  "8": {
    objetivos: [
      "Plantear un problema como bandit y comparar A/B fijo, ε-greedy, UCB y Thompson por su regret.",
      "Modelar el tutor y el robot de reciclaje como MDP y explicar cómo la recompensa cambia la política.",
      "Describir el compromiso de deep search (seguir buscando o responder) y las tres etapas de RLHF.",
      "Formular un MDP de tu dominio con 3 a 30 estados y resolverlo con iteración de valor."
    ],
    tiempo: { pagina: 40, notebook: 120 },
    previos: ["3", "4", "5"],
    requisitos: ["Pensar de antemano un problema de tu área para el proyecto final."],
    cuestionario: [
      {
        pregunta: "¿Por qué el problema de los cuatro anuncios es un bandit?",
        opciones: [
          { texto: "Porque los anuncios son tragamonedas de verdad.", explicacion: "Es una metáfora: cada anuncio es una palanca con una tasa de éxito desconocida." },
          { texto: "Porque es el MDP más chico: un solo estado y episodios de un paso.", explicacion: "Correcto. No hay consecuencias a futuro; solo queda el dilema exploración–explotación." },
          { texto: "Porque la recompensa es negativa.", explicacion: "No: la recompensa es el clic (1 o 0)." },
          { texto: "Porque hay cuatro acciones, como en la cueva.", explicacion: "La cantidad de acciones no lo define; lo define que haya un solo estado." }
        ],
        correcta: 1
      },
      {
        pregunta: "¿Qué hace Thompson sampling para elegir el próximo anuncio?",
        opciones: [
          { texto: "Muestra cada anuncio la misma cantidad de veces y después elige.", explicacion: "Eso es el A/B fijo." },
          { texto: "Suma a cada estimación un bonus que crece con la incertidumbre.", explicacion: "Eso es UCB: μ̂ₐ + c √(ln t / nₐ)." },
          { texto: "Sortea un CTR plausible para cada anuncio según lo observado y muestra el más alto.", explicacion: "Correcto. Explora más donde todavía hay duda y deja de lado lo que es claramente peor." },
          { texto: "Explora un 10 % de las veces para siempre.", explicacion: "Eso es ε-greedy, que por eso nunca deja de perder clics." }
        ],
        correcta: 2
      },
      {
        pregunta: "En el tutor como MDP, ¿qué hace la política óptima con la recompensa \"aprendizaje\" (+1 cada vez que el alumno sube un nivel)?",
        opciones: [
          { texto: "Da solo sumas.", explicacion: "Eso pasa con la recompensa por acierto, como en la clase 2." },
          { texto: "Da solo restas desde el principio.", explicacion: "No: practicar resta rinde más cuando el alumno ya sabe sumar (0,1 + 0,1 × nivel de suma)." },
          { texto: "Primero da sumas y, en cuanto el alumno domina la suma, pasa a restas.", explicacion: "Correcto. El algoritmo es el mismo; cambió qué le pedimos." },
          { texto: "Alterna una y una.", explicacion: "La política óptima depende del estado; no es una alternancia fija." }
        ],
        correcta: 2
      },
      {
        pregunta: "En el MDP de deep search, ¿qué pasa si buscar y leer no cuestan nada?",
        opciones: [
          { texto: "Responde de entrada y adivina.", explicacion: "Eso pasa con un costo muy alto: responde con confianza 0 y acierta un 25 %." },
          { texto: "Busca y lee casi todo antes de responder.", explicacion: "Correcto. Si investigar es gratis, siempre conviene un poco más de confianza. Alguien tiene que decidir el costo." },
          { texto: "No responde nunca.", explicacion: "Responder sigue dando +1 si acierta; con 5 documentos como máximo, termina respondiendo." },
          { texto: "Lee un solo documento.", explicacion: "Eso es lo que hace con un costo intermedio o alto." }
        ],
        correcta: 1
      },
      {
        pregunta: "En RLHF se maximiza E[r(x, y)] − β·KL(π_θ ‖ π_SFT). ¿Para qué está el término KL?",
        opciones: [
          { texto: "Para que el modelo responda más rápido.", explicacion: "No tiene que ver con la velocidad." },
          { texto: "Para penalizar que la política se aleje del modelo original y explote fallas del modelo de recompensa.", explicacion: "Correcto. Sin esa correa, el modelo puede encontrar respuestas que r(x, y) puntúa alto sin ser mejores: la misma trampa del tutor." },
          { texto: "Para medir cuánto aciertan los humanos.", explicacion: "Los humanos dan rankings para entrenar r(x, y); KL mide distancia entre políticas." },
          { texto: "Para que el modelo explore más.", explicacion: "Si algo, lo frena: lo mantiene cerca del modelo ajustado con SFT." }
        ],
        correcta: 1
      }
    ],
    actividad: {
      titulo: "El MDP de tu dominio",
      consigna: "Armá en la página tu proyecto final: un problema de tu área con 3 a 30 estados, 2 a 5 acciones y una recompensa que refleje lo que de verdad querés. Usá \"Copiar como Markdown\" y publicá la tabla en Discussions junto con una oración sobre por qué la política tiene sentido. Un compañero busca una forma de \"hacer trampa\" con tu recompensa (como el tutor que solo da sumas), propone una corrección y te devuelve la rúbrica.",
      rubrica: [
        "Estados, acciones y recompensa son coherentes con el problema y de un tamaño manejable.",
        "La política resultante tiene sentido y se dice qué número la cambia.",
        "La revisión encuentra al menos una trampa posible y propone cómo corregir la recompensa."
      ]
    }
  },

  "9": {
    objetivos: [
      "Mapear el ciclo observación–acción–recompensa de la cueva al de un agente de LLM que investiga.",
      "Explicar por qué un ranking miope es un MDP con γ = 0 y qué pierde a largo plazo.",
      "Estimar el valor de una política nueva con registros de la vieja (IS, WIS, método directo) y reconocer cuándo explota la varianza.",
      "Reconocer el cambio de distribución en RL offline."
    ],
    tiempo: { pagina: 40, notebook: 90 },
    previos: ["4", "8"],
    requisitos: [],
    cuestionario: [
      {
        pregunta: "Según lo publicado por Meta, el feed predice P(ver), P(like), P(compartir), etc., las suma con pesos y ordena. En lenguaje de RL, ¿qué es eso?",
        opciones: [
          { texto: "Un MDP con γ = 0: maximiza lo que pasa hoy.", explicacion: "Correcto. Es aprendizaje supervisado y miope: no se pregunta qué le pasa al usuario mañana." },
          { texto: "Un MDP con γ alto que cuida al usuario.", explicacion: "No: nada en ese esquema mira más allá de la sesión." },
          { texto: "Go-Explore aplicado a publicaciones.", explicacion: "No: no hay archivo ni exploración sistemática." },
          { texto: "RL offline con importance sampling.", explicacion: "No: es predicción supervisada de eventos inmediatos." }
        ],
        correcta: 0
      },
      {
        pregunta: "En el simulador de juguete, ¿qué pasa con la política miope comparada con la de largo plazo?",
        opciones: [
          { texto: "Gana en todo momento.", explicacion: "Gana el primer día (6 contra 3 clics), pero pierde después." },
          { texto: "Gana el primer día, pero al día 30 ya no le queda ningún usuario; la de largo plazo conserva un tercio.", explicacion: "Correcto. El contenido gancho baja la satisfacción y la gente deja de volver: es la \"suma fácil\" del feed." },
          { texto: "Empatan.", explicacion: "No: las curvas de clics acumulados se cruzan antes de las dos semanas." },
          { texto: "Pierde desde el primer día.", explicacion: "No: el primer día el gancho rinde el doble de clics." }
        ],
        correcta: 1
      },
      {
        pregunta: "Importance sampling repesa cada partida por Πₜ π_nueva(aₜ|sₜ) / π_vieja(aₜ|sₜ). ¿Qué pasa cuando la política nueva se aleja mucho de la vieja o las partidas son largas?",
        opciones: [
          { texto: "La estimación se vuelve más precisa.", explicacion: "Al revés: el producto de muchos cocientes explota o se anula." },
          { texto: "Unas pocas partidas concentran casi todo el peso y la varianza explota.", explicacion: "Correcto. Pocas partidas \"cuentan de verdad\" (ESS baja), y el error crece exponencialmente con el horizonte." },
          { texto: "Los pesos valen todos 1.", explicacion: "Eso solo pasa si las dos políticas son iguales." },
          { texto: "No cambia nada: IS es insesgado.", explicacion: "Que sea insesgado no impide que tenga una varianza enorme." }
        ],
        correcta: 1
      },
      {
        pregunta: "En el ejercicio del colectivo y el subte, IS suma tiempo × 3 en los días de subte y divide por 12; WIS promedia los días de subte. ¿Qué es cierto?",
        opciones: [
          { texto: "IS varía menos que WIS entre personas.", explicacion: "Al revés: IS depende de cuántos días de subte salieron, y eso lo hace variar más." },
          { texto: "WIS normaliza por la suma de pesos: tiene un poco de sesgo, pero mucha menos varianza.", explicacion: "Correcto. Si a alguien no le sale ningún 5 ni 6, IS da 0 y WIS queda indefinido: no hay datos de la política nueva." },
          { texto: "Los dos dan siempre 27 minutos.", explicacion: "27 es el valor verdadero; los estimadores lo rodean con error." },
          { texto: "El factor 3 es arbitrario.", explicacion: "No: es π_nueva / π_vieja = 1 / (2/6) para el subte." }
        ],
        correcta: 1
      },
      {
        pregunta: "En RL offline, ¿qué pasa en las casillas por donde la política vieja nunca pasó?",
        opciones: [
          { texto: "Se aprende igual de bien que en el resto.", explicacion: "No: sin datos, Q no se mueve de su valor inicial." },
          { texto: "Q queda en su valor inicial y la flecha es un empate o un invento: es el cambio de distribución.", explicacion: "Correcto. Por eso el RL offline suele ser pesimista con lo que no vio." },
          { texto: "El algoritmo pide partidas nuevas.", explicacion: "Justamente no puede: offline significa aprender solo con los registros." },
          { texto: "Se copia la política vieja.", explicacion: "No: Q-learning sobre los registros no imita, estima valores." }
        ],
        correcta: 1
      }
    ],
    actividad: {
      titulo: "Evaluar sin jugar",
      consigna: "Armá la tabla de 12 días de la clase: un dado elige cómo vas al trabajo (1–4 colectivo, 5–6 subte) y otro el tiempo (colectivo: 30 + 5 × dado; subte: 20 + 2 × dado). Estimá cuánto tardaría alguien que va siempre en subte con IS y con WIS, y publicá la tabla y los dos números. Respondé: con los registros de cómo se atendió un negocio el año pasado, ¿para qué formas nuevas de atender podrías estimar el resultado y para cuáles no? Un compañero compara tus números con los de otras respuestas del hilo y te devuelve la rúbrica.",
      rubrica: [
        "La tabla y las dos cuentas están completas y bien hechas.",
        "Se comparan los números con el valor verdadero (27 minutos) y se dice cuál de los dos estimadores varía más en el hilo.",
        "Se explica qué pasa si no salió ningún 5 ni 6, y se conecta con qué formas nuevas se pueden evaluar con registros viejos."
      ]
    }
  },

  // placeholder: lo completa quien escribe la clase 10
  "10": {
    objetivos: [],
    tiempo: {},
    previos: [],
    requisitos: []
  },
  "11": {
    objetivos: [
      "Plantear un agente de difusión y un agente tutor como dos MDP con la misma forma y distinta recompensa.",
      "Describir el pipeline multiagente curador → generador → evaluador → publicador, con humano en el bucle.",
      "Explicar por qué el evaluador debe ser un modelo distinto del generador y aplicar una rúbrica de cinco criterios.",
      "Distinguir nudges de patrones oscuros y proponer una recompensa visible y editable por el alumno."
    ],
    tiempo: { pagina: 35, notebook: 90 },
    previos: ["8", "9"],
    requisitos: ["Para el notebook: Colab con GPU T4 gratis (recomendado) o CPU. Un token de Hugging Face es opcional: sin él se usa un modelo abierto sin trámite."],
    cuestionario: [
      {
        pregunta: "Un agente de marketing y un agente tutor resuelven el mismo problema: sostener la atención de alguien. ¿Cuál es la diferencia?",
        opciones: [
          { texto: "Que uno usa RL y el otro no.", explicacion: "Los dos se pueden plantear como MDP con la misma forma." },
          { texto: "A favor de quién juega la recompensa, y quién puede verla y cambiarla.", explicacion: "Correcto. Es la tesis de la clase: los dos manipulan la atención; importa para quién." },
          { texto: "Que el tutor no necesita recompensa.", explicacion: "Sí la necesita; el punto es cuál." },
          { texto: "Que el de marketing tiene más acciones.", explicacion: "La cantidad de acciones no define la diferencia ética ni técnica." }
        ],
        correcta: 1
      },
      {
        pregunta: "En la fábrica de contenido, ¿por qué el evaluador es un modelo distinto del generador?",
        opciones: [
          { texto: "Porque un solo modelo no puede hacer dos tareas.", explicacion: "Técnicamente puede; el problema es qué mide." },
          { texto: "Porque generar y evaluar con el mismo modelo mide autocomplacencia, no calidad.", explicacion: "Correcto. Un modelo tiende a aprobar lo que él mismo produciría." },
          { texto: "Para que el pipeline sea más rápido.", explicacion: "No es por velocidad: dos modelos suelen ser más lentos." },
          { texto: "Porque el generador no sabe leer.", explicacion: "No: los dos procesan texto; la diferencia es de independencia." }
        ],
        correcta: 1
      },
      {
        pregunta: "La rúbrica del evaluador tiene cinco criterios de 1 a 10 y un umbral de 6. ¿Qué pasa si un post queda por debajo?",
        opciones: [
          { texto: "Se borra automáticamente.", explicacion: "No: el umbral no bloquea." },
          { texto: "Se publica igual sin aviso.", explicacion: "No: el sistema advierte." },
          { texto: "El sistema advierte y la persona decide.", explicacion: "Correcto. Humano en el bucle: el evaluador informa, no reemplaza el criterio humano." },
          { texto: "El generador lo reescribe hasta pasar el umbral.", explicacion: "Eso optimizaría contra el evaluador, otra forma de hacer trampa con la recompensa." }
        ],
        correcta: 2
      },
      {
        pregunta: "El tutor elige la próxima pregunta con un bandit. ¿Qué recompensa evita la trampa de la clase 2?",
        opciones: [
          { texto: "+1 cada vez que el alumno acierta.", explicacion: "Con esa recompensa el tutor da solo preguntas fáciles: es el tutor que solo da sumas." },
          { texto: "La mejora del alumno, no el acierto.", explicacion: "Correcto. Premiar la mejora empuja hacia lo que el alumno todavía no domina." },
          { texto: "El tiempo que el alumno pasa en la página.", explicacion: "Eso es una métrica de atención, la misma que persigue un feed miope." },
          { texto: "La cantidad de preguntas respondidas.", explicacion: "Premia volumen, no aprendizaje; se hackea con preguntas triviales." }
        ],
        correcta: 1
      },
      {
        pregunta: "¿Qué relación hay entre la dopamina y lo visto en el curso?",
        opciones: [
          { texto: "La dopamina mide el placer, como la recompensa r.", explicacion: "No: lo que codifica es la sorpresa respecto de lo esperado." },
          { texto: "Codifica el error de predicción de recompensa, que es el error de TD de la clase 4; \"loop de dopamina\" es una metáfora y la evidencia sobre adicción a redes está en debate.", explicacion: "Correcto (Schultz, Dayan y Montague, 1997)." },
          { texto: "Está probado que las redes son adictivas por la dopamina.", explicacion: "No: la evidencia sobre adicción a redes está en debate." },
          { texto: "Ninguna: RL no tiene que ver con el cerebro.", explicacion: "Sí tiene: el error de TD fue uno de los puentes más fuertes entre RL y neurociencia." }
        ],
        correcta: 1
      }
    ],
    actividad: {
      titulo: "Generador, evaluador y humano",
      consigna: "Tomá un párrafo de la bibliografía del curso (Sutton y Barto, CS234 o un notebook del MOOC) y hacé de generador: escribí un post de dos líneas para difundirlo. Después hacé de evaluador de tu propio post: puntualo del 1 al 10 en fidelidad, claridad, enganche, formato y utilidad. Publicá el párrafo, el post y tus puntajes en Discussions, y respondé: ¿qué app te gustaría que cobrara por otra cosa, qué recompensa le pondrías y cómo te podría hacer trampa con esa? Un compañero puntúa tu post con los mismos cinco criterios sin mirar los tuyos, compara y te devuelve la rúbrica.",
      rubrica: [
        "Fidelidad: el post dice lo mismo que el párrafo de la fuente, sin exagerar ni inventar.",
        "Autocomplacencia a la vista: se comparan los dos juegos de puntajes y se señala dónde se infló la autoevaluación.",
        "La respuesta sobre la app propone una recompensa concreta, visible para quien la usa, y nombra una trampa posible."
      ]
    }
  },
  // placeholder: lo completa quien escribe la clase 12
  "12": {
    objetivos: [],
    tiempo: {},
    previos: [],
    requisitos: []
  }
};

/* Clases 1, 7, 9 (con ReAct), 10 y 12: datos completos que reemplazan las entradas de arriba. */
Object.assign(window.MODULOS, {
 "1": {
  "objetivos": [
   "Distinguir educación bancaria de educación problematizadora (Freire) y explicar por qué el curso propone enseñarle a una máquina en lugar de recibir contenidos.",
   "Explicar qué significa que un feed optimice con γ ≈ 0 y relacionarlo con la recompensa inmediata.",
   "Explicar la relación entre cuidado de sí y conocimiento de sí que plantea Foucault, y leerla como la pregunta de quién elige la función de recompensa.",
   "Usar fidelidad, fecundidad y longevidad (Dawkins) para explicar cómo se propaga el curso."
  ],
  "tiempo": {
   "pagina": 40
  },
  "previos": [],
  "requisitos": [
   "Ninguno: es la puerta de entrada del curso.",
   "Antes de la clase 2, jugar la cueva en modo fácil y en modo difícil."
  ],
  "cuestionario": [
   {
    "pregunta": "Para Freire, ¿qué caracteriza a la educación bancaria?",
    "opciones": [
     {
      "texto": "Que el docente deposita contenidos en un alumno que los recibe pasivamente.",
      "explicacion": "Correcto. Es la imagen del depósito: el saber va en una sola dirección y el alumno no actúa sobre el mundo."
     },
     {
      "texto": "Que enseña finanzas y economía.",
      "explicacion": "No: «bancaria» es una metáfora del depósito, no el tema que se enseña."
     },
     {
      "texto": "Que parte de un problema real y se resuelve en diálogo.",
      "explicacion": "No: eso describe la educación problematizadora, la que Freire le opone."
     },
     {
      "texto": "Que se cobra por cada clase.",
      "explicacion": "No: la crítica de Freire no es sobre el costo sino sobre la relación entre quien enseña y quien aprende."
     }
    ],
    "correcta": 0
   },
   {
    "pregunta": "En la figura del feed se dice que funciona con γ ≈ 0. ¿Qué significa?",
    "opciones": [
     {
      "texto": "Que no muestra ningún contenido.",
      "explicacion": "No: muestra contenido sin parar; γ no mide cuánto muestra."
     },
     {
      "texto": "Que pesa el futuro tanto como el presente.",
      "explicacion": "No: eso sería γ cerca de 1."
     },
     {
      "texto": "Que elige cada contenido mirando solo la recompensa inmediata, el próximo clic.",
      "explicacion": "Correcto. Con γ ≈ 0 lo que pase después no cuenta en la decisión de ahora."
     },
     {
      "texto": "Que el usuario elige cada tarjeta.",
      "explicacion": "No: en la figura las tarjetas llegan solas; tus decisiones quedan en 0."
     }
    ],
    "correcta": 2
   },
   {
    "pregunta": "¿Qué sostiene Foucault en La hermenéutica del sujeto sobre el «conócete a ti mismo»?",
    "opciones": [
     {
      "texto": "Que es una invención moderna sin antecedentes griegos.",
      "explicacion": "No: el gnothi seauton es un precepto antiguo; lo que analiza Foucault es su relación con el cuidado de sí."
     },
     {
      "texto": "Que en la Antigüedad era una parte del cuidado de sí, y que la modernidad lo separó y lo puso por delante.",
      "explicacion": "Correcto. Esa inversión es la que el curso relee como la pregunta de quién elige la recompensa."
     },
     {
      "texto": "Que conocerse a uno mismo es imposible y conviene dejarlo.",
      "explicacion": "No: el curso no le atribuye esa tesis; habla de la relación entre conocerse y cuidarse."
     },
     {
      "texto": "Que el cuidado de sí consiste en consumir menos tecnología.",
      "explicacion": "No: es una lectura que el curso no hace; cuidarse, en esta clase, es poder ver y elegir los propios pesos."
     }
    ],
    "correcta": 1
   },
   {
    "pregunta": "En la figura del meme, cada persona enseña a 2 personas en promedio, la copia sale bien el 40 % de las veces y cada una enseña una sola ronda. ¿Qué pasa?",
    "opciones": [
     {
      "texto": "La luz cruza toda la cueva, porque 2 es mayor que 1.",
      "explicacion": "No: la fecundidad sola no alcanza; las copias infieles no enseñan."
     },
     {
      "texto": "Depende solo de dónde se siembra.",
      "explicacion": "El lugar influye en un pasillo cerrado, pero lo que decide es R."
     },
     {
      "texto": "Crece sin límite, porque la longevidad es 1.",
      "explicacion": "No: longevidad 1 es la mínima; no agrega rondas."
     },
     {
      "texto": "Tiende a apagarse: R ≈ 2 × 0,4 × 1 = 0,8, menor que 1.",
      "explicacion": "Correcto. Con R menor que 1 cada ronda hay, en promedio, menos personas enseñando que en la anterior."
     }
    ],
    "correcta": 3
   },
   {
    "pregunta": "¿Qué dice el curso sobre la dopamina y las redes?",
    "opciones": [
     {
      "texto": "Que el «loop de dopamina» está demostrado y explica la adicción a las redes.",
      "explicacion": "No: el curso lo presenta como metáfora y aclara que la adicción a redes es un tema en debate."
     },
     {
      "texto": "Que hay evidencia de que la dopamina señala un error de predicción de recompensa (Schultz, Dayan y Montague, 1997), y que el «loop de dopamina» es una metáfora.",
      "explicacion": "Correcto. Lo primero se ve en la clase 4 junto al aprendizaje por diferencias temporales; lo segundo es una advertencia honesta."
     },
     {
      "texto": "Que la dopamina no tiene relación con la recompensa.",
      "explicacion": "No: justamente el trabajo de 1997 la vincula con el error de predicción de recompensa."
     },
     {
      "texto": "Que el curso cura el uso excesivo del celular.",
      "explicacion": "No: el curso no promete eso; propone ver el mecanismo."
     }
    ],
    "correcta": 1
   }
  ],
  "actividad": {
   "titulo": "¿Qué te premia?",
   "consigna": "Elegí los pesos de tu día en la figura de Foucault y publicá los cuatro números, junto con una actividad de ayer cuyo premio eligió otra persona o una app. Contá además qué tuviste que recordar para salir de la cueva en modo difícil. Otra persona te devuelve con la rúbrica.",
   "rubrica": [
    "Los pesos están justificados con un ejemplo concreto del propio día, no en abstracto.",
    "Se identifica quién eligió la recompensa de la actividad nombrada y se dice si se la elegiría igual.",
    "Lo recordado en modo difícil se describe como historia y se separa la parte que alcanzó para decidir (el estado)."
   ]
  }
 },
 "7": {
  "objetivos": [
   "Explicar con la cueva qué es una cadena de Markov y leer su matriz de transición P.",
   "Distinguir observación de estado y explicar por qué la cueva con solo bigotes es un POMDP que pide memoria.",
   "Generar texto con n-gramas de letras y explicar su límite: nunca recuerdan más de n − 1 letras y con n grande copian.",
   "Describir una red recurrente (hₜ = tanh(W_hh hₜ₋₁ + W_xh xₜ + b)) y comparar un agente con memoria (GRU) contra uno sin memoria."
  ],
  "tiempo": {
   "pagina": 35,
   "notebook": 75
  },
  "previos": [
   "2",
   "6"
  ],
  "requisitos": [
   "Conviene haber jugado la cueva en modo difícil (clase 2).",
   "El notebook usa PyTorch en CPU (en Colab ya viene instalado) y corre en un par de minutos."
  ],
  "cuestionario": [
   {
    "pregunta": "El caminante al azar de la cueva es una cadena de Markov. ¿Qué quiere decir eso?",
    "opciones": [
     {
      "texto": "Que adónde va en el próximo paso depende solo de la casilla en la que está ahora.",
      "explicacion": "Correcto. Por eso todo su comportamiento entra en una tabla P de 60 × 60: una fila por casilla de partida."
     },
     {
      "texto": "Que recuerda las paredes que ya tocó.",
      "explicacion": "Es al revés: no recuerda nada, y por eso vuelve a chocar con la misma pared una y otra vez."
     },
     {
      "texto": "Que siempre termina en la salida en menos de 20 pasos.",
      "explicacion": "Termina llegando, pero muy de a poco: a los 80 pasos la nube todavía casi no salió."
     },
     {
      "texto": "Que la matriz P cambia en cada paso.",
      "explicacion": "No: la tabla es la misma en todos los pasos; lo que cambia es la nube pₜ que se multiplica por ella."
     }
    ],
    "correcta": 0
   },
   {
    "pregunta": "En la cueva chica hay 60 casillas y solo 12 lecturas distintas de los bigotes. ¿Qué consecuencia tiene para el agente?",
    "opciones": [
     {
      "texto": "Ninguna: con los bigotes alcanza para saber dónde está.",
      "explicacion": "No: un pasillo vertical se siente igual en toda la cueva, y en unos conviene subir y en otros bajar."
     },
     {
      "texto": "La observación no alcanza para decidir: es un POMDP, y hace falta un resumen de la historia.",
      "explicacion": "Correcto. Ese resumen (el conjunto de casillas compatibles con lo vivido) es el estado de creencia; con memoria se achica hasta una sola casilla."
     },
     {
      "texto": "Hay que agregar más bigotes hasta tener 60 lecturas.",
      "explicacion": "Con cuatro bigotes hay como mucho 16 lecturas. La salida no es sentir más, sino recordar."
     },
     {
      "texto": "El agente tiene que moverse al azar.",
      "explicacion": "Moverse al azar es lo que hace el caminante sin memoria del paso 1: llega, pero tarde."
     }
    ],
    "correcta": 1
   },
   {
    "pregunta": "En el paso 3, el error del n-grama sobre un texto no visto baja hasta n = 3 y después sube. ¿Por qué sube?",
    "opciones": [
     {
      "texto": "Porque con n grande la tabla tiene menos contextos.",
      "explicacion": "Es al revés: la tabla crece con n (de 38 contextos con n = 2 a miles con n = 8)."
     },
     {
      "texto": "Porque las letras del texto no visto son distintas.",
      "explicacion": "Son las mismas 38. El problema es la combinación: los contextos largos nuevos casi nunca aparecieron antes."
     },
     {
      "texto": "Porque cada contexto largo se vio pocas veces (muchos, una sola): la tabla copia el corpus y no sabe qué hacer con un contexto nuevo.",
      "explicacion": "Correcto. Por eso con n = 8 el texto generado copia tramos enteros del diario, y con un contexto que nunca vio no tiene nada que contar."
     },
     {
      "texto": "Porque el corpus está mal escrito.",
      "explicacion": "No: el problema aparece con cualquier corpus finito. Con más texto el mínimo se corre a un n más grande, pero no desaparece."
     }
    ],
    "correcta": 2
   },
   {
    "pregunta": "En la red recurrente hₜ = tanh(W_hh hₜ₋₁ + W_xh xₜ + b), ¿qué cambia de un paso al siguiente?",
    "opciones": [
     {
      "texto": "Las tablas W_hh y W_xh, que se reentrenan con cada letra.",
      "explicacion": "No: las tablas son las mismas en todos los pasos. Por eso la red no crece con el texto."
     },
     {
      "texto": "El estado hₜ: cada letra lo empuja, y resume lo que se leyó hasta ahí.",
      "explicacion": "Correcto. La regla no cambia; el estado sí. Es un sistema dinámico donde las letras son las fuerzas."
     },
     {
      "texto": "La cantidad de dimensiones de hₜ, que crece con el texto.",
      "explicacion": "No: son siempre 32 números, se lean 5 letras o 5.000."
     },
     {
      "texto": "Nada: la red solo mira la última letra, como un 2-grama.",
      "explicacion": "Mira la última letra y el estado que dejaron todas las anteriores; eso es lo que la diferencia de un n-grama."
     }
    ],
    "correcta": 1
   },
   {
    "pregunta": "En la cueva grande, sintiendo bigotes y su última acción, la red común sale desde 88 de 154 casillas y la GRU desde todas. Las dos se entrenaron por imitación. ¿Qué explica la diferencia?",
    "opciones": [
     {
      "texto": "La GRU tiene un estado que resume el camino, y con eso distingue casillas que se sienten igual; la red común, ante la misma lectura, decide siempre lo mismo y se traba yendo y viniendo.",
      "explicacion": "Correcto. La sonda lo muestra: desde el estado de la GRU se puede leer en qué casilla está, cada vez mejor a medida que camina."
     },
     {
      "texto": "La GRU se entrenó con RL y la red común por imitación.",
      "explicacion": "No: las dos se entrenaron igual, copiando a un experto (behavior cloning). DRQN, la versión con RL, no converge en los minutos de una clase."
     },
     {
      "texto": "La GRU ve el mapa.",
      "explicacion": "No: recibe exactamente los mismos 8 números que la red común."
     },
     {
      "texto": "La red común tiene muy pocos pesos.",
      "explicacion": "Tiene menos (1.476 contra 4.164), pero no es eso: una red sin memoria, del tamaño que sea, ante la misma lectura y la misma última acción decide siempre lo mismo."
     }
    ],
    "correcta": 0
   }
  ],
  "actividad": {
   "titulo": "Un cuaderno para la cueva",
   "consigna": "Elegí una casilla de la cueva chica y escribí la lista de acciones que harías desde ahí sin ver el mapa, sintiendo solo los bigotes. Al lado de cada paso anotá qué guardás en la cabeza (tu cuaderno) y cuántas casillas siguen siendo posibles (podés contarlas con la figura del paso 2). Publicá la lista y en una oración explicá qué anotación fue la que te ubicó. Un compañero repite tu recorrido desde otra casilla con la misma lectura inicial y te devuelve la rúbrica.",
   "rubrica": [
    "Cada paso dice qué se sintió, qué se hizo y qué se anotó, de forma que otra persona lo pueda repetir.",
    "Se cuenta cuántas casillas quedan posibles después de cada paso y se ve cómo se achica la nube.",
    "La explicación final nombra qué parte de la historia ubicó al jugador y la relaciona con el estado oculto de una red recurrente."
   ]
  }
 },
 "9": {
  "objetivos": [
   "Describir el bucle ReAct (pensamiento → acción → observación), reconocerlo en la cueva y en un agente de LLM que investiga, y explicar por qué un modelo chico sin memoria de posición ni recompensa juega peor que Q-learning.",
   "Explicar por qué un ranking miope es un MDP con γ = 0 y qué pierde a largo plazo.",
   "Estimar el valor de una política nueva con registros de la vieja (IS, WIS, método directo) y reconocer cuándo explota la varianza.",
   "Reconocer el cambio de distribución en RL offline."
  ],
  "tiempo": {
   "pagina": 45,
   "notebook": 90
  },
  "previos": [
   "4",
   "8"
  ],
  "requisitos": [],
  "cuestionario": [
   {
    "pregunta": "En el notebook, Qwen2.5-0.5B juega la cueva con el bucle ReAct: escribe un pensamiento y una acción, y la herramienta le devuelve \"avancé\" o \"choqué con una pared\". En 30 pasos no sale y repite choques que ya conocía, mientras Q-learning sale en 20. ¿Cuál es la mejor explicación?",
    "opciones": [
     {
      "texto": "Su única memoria es el texto de la traza, sin posición, y nunca recibe recompensa: no aprende entre pasos ni entre partidas. Q-learning guarda en su tabla lo que le enseñaron cientos de partidas.",
      "explicacion": "Correcto. ReAct ordena el ciclo, pero no aprende: los pesos no cambian. Además el modelo es chico y copia frases del ejemplo del prompt aunque contradigan lo que sintió."
     },
     {
      "texto": "ReAct no tiene acciones: el modelo solo piensa.",
      "explicacion": "No: cada paso termina en una acción (mover o sentir) que la cueva ejecuta."
     },
     {
      "texto": "El modelo ve el mapa entero y se confunde.",
      "explicacion": "Al revés: no ve nada; solo le llegan las observaciones de texto."
     },
     {
      "texto": "La cueva del notebook tiene piso resbaloso.",
      "explicacion": "No: la cueva es determinística; el problema está en el agente."
     }
    ],
    "correcta": 0
   },
   {
    "pregunta": "Según lo publicado por Meta, el feed predice P(ver), P(like), P(compartir), etc., las suma con pesos y ordena. En lenguaje de RL, ¿qué es eso?",
    "opciones": [
     {
      "texto": "Un MDP con γ = 0: maximiza lo que pasa hoy.",
      "explicacion": "Correcto. Es aprendizaje supervisado y miope: no se pregunta qué le pasa al usuario mañana."
     },
     {
      "texto": "Un MDP con γ alto que cuida al usuario.",
      "explicacion": "No: nada en ese esquema mira más allá de la sesión."
     },
     {
      "texto": "Go-Explore aplicado a publicaciones.",
      "explicacion": "No: no hay archivo ni exploración sistemática."
     },
     {
      "texto": "RL offline con importance sampling.",
      "explicacion": "No: es predicción supervisada de eventos inmediatos."
     }
    ],
    "correcta": 0
   },
   {
    "pregunta": "En el simulador de juguete, ¿qué pasa con la política miope comparada con la de largo plazo?",
    "opciones": [
     {
      "texto": "Gana en todo momento.",
      "explicacion": "Gana el primer día (6 contra 3 clics), pero pierde después."
     },
     {
      "texto": "Gana el primer día, pero al día 30 ya no le queda ningún usuario; la de largo plazo conserva un tercio.",
      "explicacion": "Correcto. El contenido gancho baja la satisfacción y la gente deja de volver: es la \"suma fácil\" del feed."
     },
     {
      "texto": "Empatan.",
      "explicacion": "No: las curvas de clics acumulados se cruzan antes de las dos semanas."
     },
     {
      "texto": "Pierde desde el primer día.",
      "explicacion": "No: el primer día el gancho rinde el doble de clics."
     }
    ],
    "correcta": 1
   },
   {
    "pregunta": "Importance sampling repesa cada partida por Πₜ π_nueva(aₜ|sₜ) / π_vieja(aₜ|sₜ). ¿Qué pasa cuando la política nueva se aleja mucho de la vieja o las partidas son largas?",
    "opciones": [
     {
      "texto": "La estimación se vuelve más precisa.",
      "explicacion": "Al revés: el producto de muchos cocientes explota o se anula."
     },
     {
      "texto": "Unas pocas partidas concentran casi todo el peso y la varianza explota.",
      "explicacion": "Correcto. Pocas partidas \"cuentan de verdad\" (ESS baja), y el error crece exponencialmente con el horizonte."
     },
     {
      "texto": "Los pesos valen todos 1.",
      "explicacion": "Eso solo pasa si las dos políticas son iguales."
     },
     {
      "texto": "No cambia nada: IS es insesgado.",
      "explicacion": "Que sea insesgado no impide que tenga una varianza enorme."
     }
    ],
    "correcta": 1
   },
   {
    "pregunta": "En el ejercicio del colectivo y el subte, IS suma tiempo × 3 en los días de subte y divide por 12; WIS promedia los días de subte. ¿Qué es cierto?",
    "opciones": [
     {
      "texto": "IS varía menos que WIS entre personas.",
      "explicacion": "Al revés: IS depende de cuántos días de subte salieron, y eso lo hace variar más."
     },
     {
      "texto": "WIS normaliza por la suma de pesos: tiene un poco de sesgo, pero mucha menos varianza.",
      "explicacion": "Correcto. Si a alguien no le sale ningún 5 ni 6, IS da 0 y WIS queda indefinido: no hay datos de la política nueva."
     },
     {
      "texto": "Los dos dan siempre 27 minutos.",
      "explicacion": "27 es el valor verdadero; los estimadores lo rodean con error."
     },
     {
      "texto": "El factor 3 es arbitrario.",
      "explicacion": "No: es π_nueva / π_vieja = 1 / (2/6) para el subte."
     }
    ],
    "correcta": 1
   },
   {
    "pregunta": "En RL offline, ¿qué pasa en las casillas por donde la política vieja nunca pasó?",
    "opciones": [
     {
      "texto": "Se aprende igual de bien que en el resto.",
      "explicacion": "No: sin datos, Q no se mueve de su valor inicial."
     },
     {
      "texto": "Q queda en su valor inicial y la flecha es un empate o un invento: es el cambio de distribución.",
      "explicacion": "Correcto. Por eso el RL offline suele ser pesimista con lo que no vio."
     },
     {
      "texto": "El algoritmo pide partidas nuevas.",
      "explicacion": "Justamente no puede: offline significa aprender solo con los registros."
     },
     {
      "texto": "Se copia la política vieja.",
      "explicacion": "No: Q-learning sobre los registros no imita, estima valores."
     }
    ],
    "correcta": 1
   }
  ],
  "actividad": {
   "titulo": "Evaluar sin jugar",
   "consigna": "Armá la tabla de 12 días de la clase: un dado elige cómo vas al trabajo (1–4 colectivo, 5–6 subte) y otro el tiempo (colectivo: 30 + 5 × dado; subte: 20 + 2 × dado). Estimá cuánto tardaría alguien que va siempre en subte con IS y con WIS, y publicá la tabla y los dos números. Respondé: con los registros de cómo se atendió un negocio el año pasado, ¿para qué formas nuevas de atender podrías estimar el resultado y para cuáles no? Un compañero compara tus números con los de otras respuestas del hilo y te devuelve la rúbrica.",
   "rubrica": [
    "La tabla y las dos cuentas están completas y bien hechas.",
    "Se comparan los números con el valor verdadero (27 minutos) y se dice cuál de los dos estimadores varía más en el hilo.",
    "Se explica qué pasa si no salió ningún 5 ni 6, y se conecta con qué formas nuevas se pueden evaluar con registros viejos."
   ]
  }
 },
 "10": {
  "objetivos": [
   "Describir un modelo de lenguaje como política: estado = texto hasta ahora, acción = próximo token, episodio = respuesta, recompensa al final.",
   "Explicar cómo la temperatura cambia la política y por qué muestrear es explorar.",
   "Distinguir RLHF (modelo de recompensa aprendido con comparaciones humanas) de las recompensas verificables, y calcular las ventajas de GRPO de un grupo de respuestas.",
   "Reconocer las piezas de un agente de lenguaje (modelo, arnés, herramientas, ventana de contexto) y los riesgos de optimizar una recompensa que se puede engañar."
  ],
  "tiempo": {
   "pagina": 40,
   "notebook": 60
  },
  "previos": [
   "7",
   "8",
   "9"
  ],
  "requisitos": [
   "Para el notebook: Colab (sin token ni licencia; descarga un modelo abierto de ≈1 GB). Con GPU tarda uno o dos minutos; en CPU, entre 3 y 8."
  ],
  "cuestionario": [
   {
    "pregunta": "Si un modelo de lenguaje es una política, ¿qué es el estado?",
    "opciones": [
     {
      "texto": "Todo el texto hasta ahora: la conversación y lo que el modelo ya respondió.",
      "explicacion": "Correcto. Cada token nuevo se agrega al estado; por eso el proceso es de Markov por construcción, a cambio de que el estado crezca."
     },
     {
      "texto": "La última palabra que escribió el modelo.",
      "explicacion": "No: con solo la última palabra no alcanza para decidir la siguiente. El modelo lee toda la ventana."
     },
     {
      "texto": "Los pesos del modelo.",
      "explicacion": "No: los pesos son la política (la regla que elige), no el estado sobre el que decide."
     },
     {
      "texto": "La recompensa que recibió en el paso anterior.",
      "explicacion": "No: en un modelo de lenguaje la recompensa llega recién al final de la respuesta."
     }
    ],
    "correcta": 0
   },
   {
    "pregunta": "¿Qué hace subir la temperatura T al muestrear el próximo token?",
    "opciones": [
     {
      "texto": "Hace al modelo más preciso.",
      "explicacion": "No: con T alta aparecen tokens poco probables, y con T muy alta, texto sin sentido."
     },
     {
      "texto": "Aplana la distribución: la política explora más.",
      "explicacion": "Correcto. Divide los logits por T antes del softmax; con T chica la política es casi greedy."
     },
     {
      "texto": "Agranda la ventana de contexto.",
      "explicacion": "No: la ventana es un límite del modelo y del arnés, no de la temperatura."
     },
     {
      "texto": "Cambia los pesos del modelo.",
      "explicacion": "No: la temperatura solo cambia cómo se muestrea de la misma política."
     }
    ],
    "correcta": 1
   },
   {
    "pregunta": "GRPO muestrea 8 respuestas a una cuenta y el verificador da 1 a las 8. ¿Qué ventajas reciben?",
    "opciones": [
     {
      "texto": "Todas positivas: el modelo acertó.",
      "explicacion": "No: la ventaja es relativa al grupo, y nadie fue mejor que el promedio."
     },
     {
      "texto": "Todas cero: la pregunta no aporta señal para el paso de actualización.",
      "explicacion": "Correcto. (r − media) / desvío vale 0 si todas son iguales. Pasa lo mismo si todas valen 0: es la recompensa escasa de la clase 5."
     },
     {
      "texto": "La primera +1 y el resto −1.",
      "explicacion": "No: el orden en que se muestrearon no importa."
     },
     {
      "texto": "No se pueden calcular sin un crítico que estime V(s).",
      "explicacion": "No: justamente GRPO no usa crítico; el grupo hace de línea de base."
     }
    ],
    "correcta": 1
   },
   {
    "pregunta": "En el bucle de agente de la clase, el modelo pidió calcular(\"2026 - year_of_publication\"). ¿Qué pasó?",
    "opciones": [
     {
      "texto": "La calculadora adivinó el año y respondió 5.",
      "explicacion": "No: la herramienta no adivina; solo acepta números."
     },
     {
      "texto": "El arnés devolvió un error legible y el modelo de 500 millones respondió solo la mitad de la pregunta.",
      "explicacion": "Correcto. El arnés valida y acota el daño, pero no hace al modelo más inteligente: encadenar dos herramientas le quedó grande."
     },
     {
      "texto": "El modelo recordó el año de una conversación anterior.",
      "explicacion": "No: el modelo no tiene memoria entre llamadas; solo ve lo que el arnés pone en la ventana."
     },
     {
      "texto": "El arnés cortó por llegar al límite de pasos.",
      "explicacion": "No: respondió en el paso 2 de 4, sin el cálculo."
     }
    ],
    "correcta": 1
   },
   {
    "pregunta": "Un verificador da recompensa 1 si el número correcto aparece en algún lugar de la respuesta. ¿Qué riesgo tiene entrenar con él?",
    "opciones": [
     {
      "texto": "Ninguno: si el número aparece, la respuesta es correcta.",
      "explicacion": "No: \"puede ser 40, 41, 42, 43 o 44\" contiene el 42 y no sabe sumar."
     },
     {
      "texto": "Que la política aprenda a listar muchos números y cobre sin saber resolver: reward hacking.",
      "explicacion": "Correcto. GRPO le daría ventaja positiva a la trampa. Por eso: verificadores estrictos, otro modelo como juez y un humano que mire muestras."
     },
     {
      "texto": "Que el entrenamiento sea más lento.",
      "explicacion": "No es el problema principal: el problema es qué aprende, no cuánto tarda."
     },
     {
      "texto": "Que la temperatura deje de importar.",
      "explicacion": "No: la temperatura sigue controlando la exploración; lo que falla es la recompensa."
     }
    ],
    "correcta": 1
   }
  ],
  "actividad": {
   "titulo": "Diseñar la recompensa de un agente de lenguaje",
   "consigna": "Elegí una tarea que te gustaría delegar en un agente de lenguaje (por ejemplo, corregir ejercicios, contestar consultas de un comercio o resumir papers). Describí: el estado (qué entra en la ventana), las herramientas que necesita, el límite de pasos y qué valida el arnés. Proponé una recompensa verificable o, si no la hay, quién compara respuestas. Después escribí una respuesta trampa que cobraría con tu recompensa sin hacer bien la tarea, y cómo la detectarías. Publicalo y devolvé la propuesta de otra persona buscándole una trampa nueva.",
   "rubrica": [
    "Estado, herramientas, límite de pasos y validaciones del arnés están descritos y son coherentes con la tarea.",
    "La recompensa está bien definida: se dice quién o qué la calcula y cuándo llega.",
    "La respuesta trampa es plausible y se propone una forma concreta de detectarla (verificador más estricto, otro juez o un humano que mire muestras)."
   ]
  }
 },
 "12": {
  "objetivos": [
   "Recorrer las once clases anteriores sobre la misma cueva y nombrar la herramienta que agregó cada una.",
   "Plantear un problema propio como MDP, diciendo quién define la recompensa, quién la ve y cómo podría el agente hacer trampa.",
   "Presentar el proyecto entre pares y devolver otros con una rúbrica.",
   "Explicar la difusión del curso como bandit y el curso entero a otra persona."
  ],
  "tiempo": {
   "pagina": 60
  },
  "previos": [
   "8",
   "11"
  ],
  "requisitos": [
   "Haber completado las clases 1 a 11 (la nivelación es optativa).",
   "Una cuenta de GitHub para publicar el proyecto en Discussions."
  ],
  "cuestionario": [
   {
    "pregunta": "¿Qué agrega la ficha del proyecto final a la plantilla de la clase 8?",
    "opciones": [
     {
      "texto": "Más estados y acciones.",
      "explicacion": "No: se siguen pidiendo pocos estados y pocas acciones."
     },
     {
      "texto": "Un gráfico de la política óptima.",
      "explicacion": "No: para resolver el MDP la ficha remite a la clase 8 o al notebook 08."
     },
     {
      "texto": "Quién define la recompensa, quién la ve y cómo podría el agente hacer trampa.",
      "explicacion": "Correcto. Son las preguntas de la clase 11 incorporadas al proyecto."
     },
     {
      "texto": "Un modelo de lenguaje que escribe la ficha.",
      "explicacion": "No: la ficha la escribís vos; está hecha para pensar la recompensa."
     }
    ],
    "correcta": 2
   },
   {
    "pregunta": "En la campaña de difusión, ¿cuál es un ejemplo de reward hacking?",
    "opciones": [
     {
      "texto": "Publicar los cuatro tipos de post una vez cada uno al principio.",
      "explicacion": "No: eso es exploración planificada."
     },
     {
      "texto": "Maximizar guardados con posts de intriga que nunca llevan al material.",
      "explicacion": "Correcto. Sube el número premiado sin lograr lo que se quería: que el curso se aprenda y se enseñe."
     },
     {
      "texto": "Cargar las métricas reales a los 7 días.",
      "explicacion": "No: es la forma de medir la recompensa."
     },
     {
      "texto": "Cambiar el tipo de post cuando Thompson recomienda otro.",
      "explicacion": "No: es seguir la política."
     }
    ],
    "correcta": 1
   },
   {
    "pregunta": "¿Por qué en la recompensa de la campaña una visita al repositorio pesa 5 y un guardado 1?",
    "opciones": [
     {
      "texto": "Porque las visitas son más fáciles de conseguir.",
      "explicacion": "No: suelen ser más escasas; por eso informan más."
     },
     {
      "texto": "Porque Instagram no muestra los guardados.",
      "explicacion": "No: los guardados están en las estadísticas del post."
     },
     {
      "texto": "Porque el peso tiene que ser un número primo.",
      "explicacion": "No: los pesos son una decisión de quien da el curso, no una regla matemática."
     },
     {
      "texto": "Porque la visita mide fidelidad: la persona llega a la fuente completa y no a un resumen.",
      "explicacion": "Correcto. Guardado es longevidad, compartido es fecundidad y visita es fidelidad."
     }
    ],
    "correcta": 3
   },
   {
    "pregunta": "¿Cómo elige el tipo de post la campaña desde el quinto post?",
    "opciones": [
     {
      "texto": "Para cada tipo sortea una tasa posible de su distribución Beta y publica el que salió más alto.",
      "explicacion": "Correcto. Es Thompson sampling: explora mientras hay duda y explota cuando la duda se achica."
     },
     {
      "texto": "Siempre publica el tipo con mejor promedio hasta ahora.",
      "explicacion": "No: eso es pura explotación (greedy) y puede quedarse con un tipo por mala suerte temprana."
     },
     {
      "texto": "Elige al azar con la misma probabilidad para cada tipo.",
      "explicacion": "No: eso sería explorar siempre, sin usar lo aprendido."
     },
     {
      "texto": "Los publica en orden fijo: intriga, concepto, demo, enseñar.",
      "explicacion": "No: ese orden es solo el de los cuatro primeros."
     }
    ],
    "correcta": 0
   },
   {
    "pregunta": "En la figura «¿Quién elige tu recompensa?», con γ = 0,9 el horizonte efectivo es de unos 10 pasos. ¿Qué pasa si la salida está a 20 pasos?",
    "opciones": [
     {
      "texto": "El valor llega igual de fuerte a toda la cueva.",
      "explicacion": "No: cada paso multiplica el valor por γ; a 20 pasos queda muy atenuado."
     },
     {
      "texto": "La salida deja de existir.",
      "explicacion": "No: la salida está; lo que cambia es cuánto pesa vista desde lejos."
     },
     {
      "texto": "El valor de la salida llega muy débil a la entrada y, con un costo por paso, puede no compensar el camino.",
      "explicacion": "Correcto. Es la miopía de la clase 1: con γ chico la luz no pasa de cerca de la salida."
     },
     {
      "texto": "El agente se mueve más rápido.",
      "explicacion": "No: γ no cambia la velocidad, cambia cuánto importa el futuro."
     }
    ],
    "correcta": 2
   }
  ],
  "actividad": {
   "titulo": "Proyecto final: tu MDP y cómo lo enseñarías",
   "consigna": "Publicá la ficha de tu proyecto (copiala como Markdown desde la página) con el título indicado. Después devolvé los proyectos de dos personas con la rúbrica y, por último, enseñale una idea del curso a alguien que no lo hizo y contá en el mismo hilo qué entendió y qué no.",
   "rubrica": [
    "Estados, acciones y recompensa están definidos y son pocos; los estados alcanzan para decidir.",
    "Se dice quién define la recompensa y quién la ve, y hay al menos una trampa posible con una forma concreta de evitarla.",
    "La explicación de 5 minutos se entiende sin haber hecho el curso."
   ]
  }
 }
});
