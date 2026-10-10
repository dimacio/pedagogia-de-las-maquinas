/* Entradas de modulos.js de la v1 (clases 3–12 del recorrido de 12 clases), archivadas al pasar a 16 clases.
   No se cargan en el sitio: sirven de material para /producir-clase. Ver build/PLAN-16-clases.md §4. */
window.MODULOS_V1 = {  "3": {
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
        objetivo: "O1",
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
        objetivo: "O2",
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
        objetivo: "O3",
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
        objetivo: "O4",
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
        objetivo: "O4",
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
        objetivo: "O1",
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
        objetivo: "O1",
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
        objetivo: "O2",
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
        objetivo: "O3",
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
        objetivo: "O4",
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
        objetivo: "O1",
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
        objetivo: "O2",
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
        objetivo: "O3",
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
        objetivo: "O3",
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
        objetivo: "O4",
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
        objetivo: "O1",
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
        objetivo: "O2",
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
        objetivo: "O3",
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
        objetivo: "O4",
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
        objetivo: "O3",
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

  "7": {
    objetivos: [
      "Explicar con la cueva qué es una cadena de Markov y leer su matriz de transición P.",
      "Distinguir observación de estado y explicar por qué la cueva con solo bigotes es un POMDP que pide memoria.",
      "Generar texto con n-gramas de letras y explicar su límite: nunca recuerdan más de n − 1 letras y con n grande copian.",
      "Describir una red recurrente (hₜ = tanh(W_hh hₜ₋₁ + W_xh xₜ + b)) y comparar un agente con memoria (GRU) contra uno sin memoria."
    ],
    tiempo: { pagina: 35, notebook: 75 },
    previos: ["2", "6"],
    requisitos: ["Conviene haber jugado la cueva en modo difícil (clase 2).", "El notebook usa PyTorch en CPU (en Colab ya viene instalado) y corre en un par de minutos."],
    cuestionario: [
      {
        objetivo: "O1",
        pregunta: "El caminante al azar de la cueva es una cadena de Markov. ¿Qué quiere decir eso?",
        opciones: [
          { texto: "Que adónde va en el próximo paso depende solo de la casilla en la que está ahora.", explicacion: "Correcto. Por eso todo su comportamiento entra en una tabla P de 60 × 60: una fila por casilla de partida." },
          { texto: "Que recuerda las paredes que ya tocó.", explicacion: "Es al revés: no recuerda nada, y por eso vuelve a chocar con la misma pared una y otra vez." },
          { texto: "Que siempre termina en la salida en menos de 20 pasos.", explicacion: "Termina llegando, pero muy de a poco: a los 80 pasos la nube todavía casi no salió." },
          { texto: "Que la matriz P cambia en cada paso.", explicacion: "No: la tabla es la misma en todos los pasos; lo que cambia es la nube pₜ que se multiplica por ella." }
        ],
        correcta: 0
      },
      {
        objetivo: "O2",
        pregunta: "En la cueva chica hay 60 casillas y solo 12 lecturas distintas de los bigotes. ¿Qué consecuencia tiene para el agente?",
        opciones: [
          { texto: "Ninguna: con los bigotes alcanza para saber dónde está.", explicacion: "No: un pasillo vertical se siente igual en toda la cueva, y en unos conviene subir y en otros bajar." },
          { texto: "La observación no alcanza para decidir: es un POMDP, y hace falta un resumen de la historia.", explicacion: "Correcto. Ese resumen (el conjunto de casillas compatibles con lo vivido) es el estado de creencia; con memoria se achica hasta una sola casilla." },
          { texto: "Hay que agregar más bigotes hasta tener 60 lecturas.", explicacion: "Con cuatro bigotes hay como mucho 16 lecturas. La salida no es sentir más, sino recordar." },
          { texto: "El agente tiene que moverse al azar.", explicacion: "Moverse al azar es lo que hace el caminante sin memoria del paso 1: llega, pero tarde." }
        ],
        correcta: 1
      },
      {
        objetivo: "O3",
        pregunta: "En el paso 3, el error del n-grama sobre un texto no visto baja hasta n = 3 y después sube. ¿Por qué sube?",
        opciones: [
          { texto: "Porque con n grande la tabla tiene menos contextos.", explicacion: "Es al revés: la tabla crece con n (de 38 contextos con n = 2 a miles con n = 8)." },
          { texto: "Porque las letras del texto no visto son distintas.", explicacion: "Son las mismas 38. El problema es la combinación: los contextos largos nuevos casi nunca aparecieron antes." },
          { texto: "Porque cada contexto largo se vio pocas veces (muchos, una sola): la tabla copia el corpus y no sabe qué hacer con un contexto nuevo.", explicacion: "Correcto. Por eso con n = 8 el texto generado copia tramos enteros del diario, y con un contexto que nunca vio no tiene nada que contar." },
          { texto: "Porque el corpus está mal escrito.", explicacion: "No: el problema aparece con cualquier corpus finito. Con más texto el mínimo se corre a un n más grande, pero no desaparece." }
        ],
        correcta: 2
      },
      {
        objetivo: "O4",
        pregunta: "En la red recurrente hₜ = tanh(W_hh hₜ₋₁ + W_xh xₜ + b), ¿qué cambia de un paso al siguiente?",
        opciones: [
          { texto: "Las tablas W_hh y W_xh, que se reentrenan con cada letra.", explicacion: "No: las tablas son las mismas en todos los pasos. Por eso la red no crece con el texto." },
          { texto: "El estado hₜ: cada letra lo empuja, y resume lo que se leyó hasta ahí.", explicacion: "Correcto. La regla no cambia; el estado sí. Es un sistema dinámico donde las letras son las fuerzas." },
          { texto: "La cantidad de dimensiones de hₜ, que crece con el texto.", explicacion: "No: son siempre 32 números, se lean 5 letras o 5.000." },
          { texto: "Nada: la red solo mira la última letra, como un 2-grama.", explicacion: "Mira la última letra y el estado que dejaron todas las anteriores; eso es lo que la diferencia de un n-grama." }
        ],
        correcta: 1
      },
      {
        objetivo: "O4",
        pregunta: "En la cueva grande, sintiendo bigotes y su última acción, la red común sale desde 88 de 154 casillas y la GRU desde todas. Las dos se entrenaron por imitación. ¿Qué explica la diferencia?",
        opciones: [
          { texto: "La GRU tiene un estado que resume el camino, y con eso distingue casillas que se sienten igual; la red común, ante la misma lectura, decide siempre lo mismo y se traba yendo y viniendo.", explicacion: "Correcto. La sonda lo muestra: desde el estado de la GRU se puede leer en qué casilla está, cada vez mejor a medida que camina." },
          { texto: "La GRU se entrenó con RL y la red común por imitación.", explicacion: "No: las dos se entrenaron igual, copiando a un experto (behavior cloning). DRQN, la versión con RL, no converge en los minutos de una clase." },
          { texto: "La GRU ve el mapa.", explicacion: "No: recibe exactamente los mismos 8 números que la red común." },
          { texto: "La red común tiene muy pocos pesos.", explicacion: "Tiene menos (1.476 contra 4.164), pero no es eso: una red sin memoria, del tamaño que sea, ante la misma lectura y la misma última acción decide siempre lo mismo." }
        ],
        correcta: 0
      }
    ],
    actividad: {
      titulo: "Un cuaderno para la cueva",
      consigna: "Elegí una casilla de la cueva chica y escribí la lista de acciones que harías desde ahí sin ver el mapa, sintiendo solo los bigotes. Al lado de cada paso anotá qué guardás en la cabeza (tu cuaderno) y cuántas casillas siguen siendo posibles (podés contarlas con la figura del paso 2). Publicá la lista y en una oración explicá qué anotación fue la que te ubicó. Un compañero repite tu recorrido desde otra casilla con la misma lectura inicial y te devuelve la rúbrica.",
      rubrica: [
        "Cada paso dice qué se sintió, qué se hizo y qué se anotó, de forma que otra persona lo pueda repetir.",
        "Se cuenta cuántas casillas quedan posibles después de cada paso y se ve cómo se achica la nube.",
        "La explicación final nombra qué parte de la historia ubicó al jugador y la relaciona con el estado oculto de una red recurrente."
      ]
    }
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
        objetivo: "O4",
        pregunta: "En «El MDP de tu dominio» (stock de un medicamento: sin stock, stock bajo, stock alto; pedir o no pedir), ¿qué tenés que escribir para que la iteración de valor encuentre la política?",
        opciones: [
          { texto: "Solo la recompensa de cada estado: las transiciones las deduce el algoritmo.", explicacion: "No: la iteración de valor necesita el modelo; sin transiciones no sabe adónde lleva cada acción." },
          { texto: "Ejemplos de qué acción tomar en cada estado, para que los imite.", explicacion: "No: eso sería aprender por imitación. La iteración de valor encuentra la política a partir de transiciones y recompensas, sin ejemplos." },
          { texto: "Para cada estado y acción, a qué estado pasa y qué recompensa recibe, además de γ.", explicacion: "Correcto. Eso es P, R y γ: con el modelo escrito, la iteración de valor de la clase 3 hace el resto." },
          { texto: "Miles de partidas jugadas, como en Q-learning.", explicacion: "No: con el modelo escrito no hace falta jugar; jugar es lo que se hace cuando no hay mapa (clase 4)." }
        ],
        correcta: 2
      },
      {
        objetivo: "O1",
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
        objetivo: "O2",
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
        objetivo: "O3",
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
        objetivo: "O3",
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
      "Describir el bucle ReAct (pensamiento → acción → observación), reconocerlo en la cueva y en un agente de LLM que investiga, y explicar por qué un modelo chico sin memoria de posición ni recompensa juega peor que Q-learning.",
      "Explicar por qué un ranking miope es un MDP con γ = 0 y qué pierde a largo plazo.",
      "Estimar el valor de una política nueva con registros de la vieja (IS, WIS, método directo) y reconocer cuándo explota la varianza.",
      "Reconocer el cambio de distribución en RL offline."
    ],
    tiempo: { pagina: 45, notebook: 90 },
    previos: ["4", "8"],
    requisitos: [],
    cuestionario: [
      {
        objetivo: "O1",
        pregunta: "En el notebook, Qwen2.5-0.5B juega la cueva con el bucle ReAct: escribe un pensamiento y una acción, y la herramienta le devuelve \"avancé\" o \"choqué con una pared\". En 30 pasos no sale y repite choques que ya conocía, mientras Q-learning sale en 20. ¿Cuál es la mejor explicación?",
        opciones: [
          { texto: "Su única memoria es el texto de la traza, sin posición, y nunca recibe recompensa: no aprende entre pasos ni entre partidas. Q-learning guarda en su tabla lo que le enseñaron cientos de partidas.", explicacion: "Correcto. ReAct ordena el ciclo, pero no aprende: los pesos no cambian. Además el modelo es chico y copia frases del ejemplo del prompt aunque contradigan lo que sintió." },
          { texto: "ReAct no tiene acciones: el modelo solo piensa.", explicacion: "No: cada paso termina en una acción (mover o sentir) que la cueva ejecuta." },
          { texto: "El modelo ve el mapa entero y se confunde.", explicacion: "Al revés: no ve nada; solo le llegan las observaciones de texto." },
          { texto: "La cueva del notebook tiene piso resbaloso.", explicacion: "No: la cueva es determinística; el problema está en el agente." }
        ],
        correcta: 0
      },
      {
        objetivo: "O2",
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
        objetivo: "O2",
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
        objetivo: "O3",
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
        objetivo: "O3",
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
        objetivo: "O4",
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

  "10": {
    objetivos: [
      "Describir un modelo de lenguaje como política: estado = texto hasta ahora, acción = próximo token, episodio = respuesta, recompensa al final.",
      "Explicar cómo la temperatura cambia la política y por qué muestrear es explorar.",
      "Distinguir RLHF (modelo de recompensa aprendido con comparaciones humanas) de las recompensas verificables, y calcular las ventajas de GRPO de un grupo de respuestas.",
      "Reconocer las piezas de un agente de lenguaje (modelo, arnés, herramientas, ventana de contexto) y los riesgos de optimizar una recompensa que se puede engañar."
    ],
    tiempo: { pagina: 40, notebook: 60 },
    previos: ["7", "8", "9"],
    requisitos: ["Para el notebook: Colab (sin token ni licencia; descarga un modelo abierto de ≈1 GB). Con GPU tarda uno o dos minutos; en CPU, entre 3 y 8."],
    cuestionario: [
      {
        objetivo: "O1",
        pregunta: "Si un modelo de lenguaje es una política, ¿qué es el estado?",
        opciones: [
          { texto: "Todo el texto hasta ahora: la conversación y lo que el modelo ya respondió.", explicacion: "Correcto. Cada token nuevo se agrega al estado; por eso el proceso es de Markov por construcción, a cambio de que el estado crezca." },
          { texto: "La última palabra que escribió el modelo.", explicacion: "No: con solo la última palabra no alcanza para decidir la siguiente. El modelo lee toda la ventana." },
          { texto: "Los pesos del modelo.", explicacion: "No: los pesos son la política (la regla que elige), no el estado sobre el que decide." },
          { texto: "La recompensa que recibió en el paso anterior.", explicacion: "No: en un modelo de lenguaje la recompensa llega recién al final de la respuesta." }
        ],
        correcta: 0
      },
      {
        objetivo: "O2",
        pregunta: "¿Qué hace subir la temperatura T al muestrear el próximo token?",
        opciones: [
          { texto: "Hace al modelo más preciso.", explicacion: "No: con T alta aparecen tokens poco probables, y con T muy alta, texto sin sentido." },
          { texto: "Aplana la distribución: la política explora más.", explicacion: "Correcto. Divide los logits por T antes del softmax; con T chica la política es casi greedy." },
          { texto: "Agranda la ventana de contexto.", explicacion: "No: la ventana es un límite del modelo y del arnés, no de la temperatura." },
          { texto: "Cambia los pesos del modelo.", explicacion: "No: la temperatura solo cambia cómo se muestrea de la misma política." }
        ],
        correcta: 1
      },
      {
        objetivo: "O3",
        pregunta: "GRPO muestrea 8 respuestas a una cuenta y el verificador da 1 a las 8. ¿Qué ventajas reciben?",
        opciones: [
          { texto: "Todas positivas: el modelo acertó.", explicacion: "No: la ventaja es relativa al grupo, y nadie fue mejor que el promedio." },
          { texto: "Todas cero: la pregunta no aporta señal para el paso de actualización.", explicacion: "Correcto. (r − media) / desvío vale 0 si todas son iguales. Pasa lo mismo si todas valen 0: es la recompensa escasa de la clase 5." },
          { texto: "La primera +1 y el resto −1.", explicacion: "No: el orden en que se muestrearon no importa." },
          { texto: "No se pueden calcular sin un crítico que estime V(s).", explicacion: "No: justamente GRPO no usa crítico; el grupo hace de línea de base." }
        ],
        correcta: 1
      },
      {
        objetivo: "O4",
        pregunta: "En el bucle de agente de la clase, el modelo pidió calcular(\"2026 - year_of_publication\"). ¿Qué pasó?",
        opciones: [
          { texto: "La calculadora adivinó el año y respondió 5.", explicacion: "No: la herramienta no adivina; solo acepta números." },
          { texto: "El arnés devolvió un error legible y el modelo de 500 millones respondió solo la mitad de la pregunta.", explicacion: "Correcto. El arnés valida y acota el daño, pero no hace al modelo más inteligente: encadenar dos herramientas le quedó grande." },
          { texto: "El modelo recordó el año de una conversación anterior.", explicacion: "No: el modelo no tiene memoria entre llamadas; solo ve lo que el arnés pone en la ventana." },
          { texto: "El arnés cortó por llegar al límite de pasos.", explicacion: "No: respondió en el paso 2 de 4, sin el cálculo." }
        ],
        correcta: 1
      },
      {
        objetivo: "O4",
        pregunta: "Un verificador da recompensa 1 si el número correcto aparece en algún lugar de la respuesta. ¿Qué riesgo tiene entrenar con él?",
        opciones: [
          { texto: "Ninguno: si el número aparece, la respuesta es correcta.", explicacion: "No: \"puede ser 40, 41, 42, 43 o 44\" contiene el 42 y no sabe sumar." },
          { texto: "Que la política aprenda a listar muchos números y cobre sin saber resolver: reward hacking.", explicacion: "Correcto. GRPO le daría ventaja positiva a la trampa. Por eso: verificadores estrictos, otro modelo como juez y un humano que mire muestras." },
          { texto: "Que el entrenamiento sea más lento.", explicacion: "No es el problema principal: el problema es qué aprende, no cuánto tarda." },
          { texto: "Que la temperatura deje de importar.", explicacion: "No: la temperatura sigue controlando la exploración; lo que falla es la recompensa." }
        ],
        correcta: 1
      }
    ],
    actividad: {
      titulo: "Diseñar la recompensa de un agente de lenguaje",
      consigna: "Elegí una tarea que te gustaría delegar en un agente de lenguaje (por ejemplo, corregir ejercicios, contestar consultas de un comercio o resumir papers). Describí: el estado (qué entra en la ventana), las herramientas que necesita, el límite de pasos y qué valida el arnés. Proponé una recompensa verificable o, si no la hay, quién compara respuestas. Después escribí una respuesta trampa que cobraría con tu recompensa sin hacer bien la tarea, y cómo la detectarías. Publicalo y devolvé la propuesta de otra persona buscándole una trampa nueva.",
      rubrica: [
        "Estado, herramientas, límite de pasos y validaciones del arnés están descritos y son coherentes con la tarea.",
        "La recompensa está bien definida: se dice quién o qué la calcula y cuándo llega.",
        "La respuesta trampa es plausible y se propone una forma concreta de detectarla (verificador más estricto, otro juez o un humano que mire muestras)."
      ]
    }
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
        objetivo: "O1",
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
        objetivo: "O3",
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
        objetivo: "O2",
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
        objetivo: "O1",
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
        objetivo: "O4",
        pregunta: "Una app pone una pausa de unos segundos antes de abrir la red social. ¿Qué la hace un nudge y no un patrón oscuro?",
        opciones: [
          { texto: "Que sea corta: hasta 10 segundos es un nudge y más es un patrón oscuro.", explicacion: "No: la distinción no está en la dosis sino en a favor de quién juega el empujón." },
          { texto: "Que cambie el algoritmo del feed en lugar del entorno de la persona.", explicacion: "No: la pausa justamente no toca el algoritmo; cambia las transiciones del entorno de la persona." },
          { texto: "Ninguna: cualquier empujón decide por otro, así que siempre es un patrón oscuro.", explicacion: "No: la tensión existe y la clase la nombra, pero un nudge empuja hacia lo que la persona querría; un patrón oscuro, hacia lo que quiere la plataforma." },
          { texto: "Que empuje hacia lo que la persona elegiría pensándolo bien, y no hacia lo que le conviene a la plataforma.", explicacion: "Correcto. La diferencia es a favor de quién empuja; mejor todavía si la persona puede ver y cambiar el largo de la pausa." }
        ],
        correcta: 3
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

  "12": {
    objetivos: [
      "Recorrer las once clases anteriores sobre la misma cueva y nombrar la herramienta que agregó cada una.",
      "Plantear un problema propio como MDP, diciendo quién define la recompensa, quién la ve y cómo podría el agente hacer trampa.",
      "Presentar el proyecto entre pares y devolver otros con una rúbrica.",
      "Explicar la difusión del curso como bandit y el curso entero a otra persona."
    ],
    tiempo: { pagina: 60 },
    previos: ["8", "11"],
    requisitos: ["Haber completado las clases 1 a 11 (la nivelación es optativa).", "Una cuenta de GitHub para publicar el proyecto en Discussions."],
    cuestionario: [
      {
        objetivo: "O2",
        pregunta: "¿Qué agrega la ficha del proyecto final a la plantilla de la clase 8?",
        opciones: [
          { texto: "Más estados y acciones.", explicacion: "No: se siguen pidiendo pocos estados y pocas acciones." },
          { texto: "Un gráfico de la política óptima.", explicacion: "No: para resolver el MDP la ficha remite a la clase 8 o al notebook 08." },
          { texto: "Quién define la recompensa, quién la ve y cómo podría el agente hacer trampa.", explicacion: "Correcto. Son las preguntas de la clase 11 incorporadas al proyecto." },
          { texto: "Un modelo de lenguaje que escribe la ficha.", explicacion: "No: la ficha la escribís vos; está hecha para pensar la recompensa." }
        ],
        correcta: 2
      },
      {
        objetivo: "O4",
        pregunta: "En la campaña de difusión, ¿cuál es un ejemplo de reward hacking?",
        opciones: [
          { texto: "Publicar los cuatro tipos de post una vez cada uno al principio.", explicacion: "No: eso es exploración planificada." },
          { texto: "Maximizar guardados con posts de intriga que nunca llevan al material.", explicacion: "Correcto. Sube el número premiado sin lograr lo que se quería: que el curso se aprenda y se enseñe." },
          { texto: "Cargar las métricas reales a los 7 días.", explicacion: "No: es la forma de medir la recompensa." },
          { texto: "Cambiar el tipo de post cuando Thompson recomienda otro.", explicacion: "No: es seguir la política." }
        ],
        correcta: 1
      },
      {
        objetivo: "O1",
        pregunta: "En el recorrido «Once clases, una sola cueva», cada parada deja una herramienta sobre el mismo mapa. ¿Cuál deja la clase 7?",
        opciones: [
          { texto: "Curiosidad por conteo: ir adonde menos se estuvo.", explicacion: "No: esa es la de la clase 5, explorar a ciegas." },
          { texto: "Memoria: cuando la casilla no alcanza, una red recurrente resume la historia.", explicacion: "Correcto. La clase 7 agrega el estado hₜ para el agente que solo siente bigotes." },
          { texto: "Q-learning: las flechas se aprenden sin conocer el mapa.", explicacion: "No: esa es la de la clase 4." },
          { texto: "Evaluar con registros de lo que ya pasó, sin simulador.", explicacion: "No: esa es la de la clase 9." }
        ],
        correcta: 1
      },
      {
        objetivo: "O4",
        pregunta: "¿Cómo elige el tipo de post la campaña desde el quinto post?",
        opciones: [
          { texto: "Para cada tipo sortea una tasa posible de su distribución Beta y publica el que salió más alto.", explicacion: "Correcto. Es Thompson sampling: explora mientras hay duda y explota cuando la duda se achica." },
          { texto: "Siempre publica el tipo con mejor promedio hasta ahora.", explicacion: "No: eso es pura explotación (greedy) y puede quedarse con un tipo por mala suerte temprana." },
          { texto: "Elige al azar con la misma probabilidad para cada tipo.", explicacion: "No: eso sería explorar siempre, sin usar lo aprendido." },
          { texto: "Los publica en orden fijo: intriga, concepto, demo, enseñar.", explicacion: "No: ese orden es solo el de los cuatro primeros." }
        ],
        correcta: 0
      },
      {
        objetivo: "O3",
        pregunta: "Te toca devolver una ficha de proyecto que dice: «Recompensa: +1 por cada venta. Trampa posible: ninguna.» Según la rúbrica, ¿qué le marcás?",
        opciones: [
          { texto: "Logrado: una recompensa simple es más fácil de optimizar.", explicacion: "No: la rúbrica no premia la simpleza sino que la recompensa mida lo que se quiere y tenga nombrada su trampa." },
          { texto: "Pendiente: un proyecto final necesita más de 30 estados.", explicacion: "No: la rúbrica pide estados y acciones que alcancen para decidir y que sean pocos." },
          { texto: "Nada: la rúbrica solo evalúa la explicación de 5 minutos.", explicacion: "No: la rúbrica tiene cuatro criterios, y la explicación de 5 minutos es solo uno." },
          { texto: "Pendiente: falta nombrar al menos una trampa posible con una forma concreta de evitarla, y decir quién eligió la recompensa y quién la ve.", explicacion: "Correcto. Son dos criterios de la rúbrica: vender más se puede lograr sin hacer lo que de verdad se quería." }
        ],
        correcta: 3
      }
    ],
    actividad: {
      titulo: "Proyecto final: tu MDP y cómo lo enseñarías",
      consigna: "Publicá la ficha de tu proyecto (copiala como Markdown desde la página) con el título indicado. Después devolvé los proyectos de dos personas con la rúbrica y, por último, enseñale una idea del curso a alguien que no lo hizo y contá en el mismo hilo qué entendió y qué no.",
      rubrica: [
        "Estados, acciones y recompensa están definidos y son pocos; los estados alcanzan para decidir.",
        "Se dice quién define la recompensa y quién la ve, y hay al menos una trampa posible con una forma concreta de evitarla.",
        "La explicación de 5 minutos se entiende sin haber hecho el curso."
      ]
    }
  }
};
