/* cueva.js — motor común de "RL a ciegas": mapas, dinámica, dibujo y navegación del sitio.
   Uso en una página de clase (desde /clases/):
     <script src="../assets/modulos.js"></script>   (opcional: objetivos, cuestionario y actividad entre pares)
     <script src="../assets/cueva.js"></script>
     const env = Cueva.makeEnv(Cueva.MAPS.chica);
     const tablero = Cueva.tablero(document.querySelector("canvas"), env, { maxCell: 44 });
     tablero.fondo(); tablero.paredes(); tablero.salida(); tablero.sprite(env.start, 2);
     Cueva.pagina("0a");   // arma barra superior, material y paginador
*/
(function () {
  // ---------- configuración del repositorio (editar al publicar) ----------
  const REPO = "dimacio/pedagogia-de-las-maquinas";   // ← reemplazar por usuario/repositorio de GitHub
  const RAMA = "main";

  const MAPS = {
    chica: [
      "##############",
      "#S...#.......#",
      "#.##.#.####..#",
      "#.#..#....#..#",
      "#.#.####..#.##",
      "#.#......##..#",
      "#.####.#..#..#",
      "#......#.##..#",
      "###.####....G#",
      "##############"],
    grande: [
      "#########################",
      "#S..#.........#.........#",
      "#.#.#####.###.###.#####.#",
      "#...#.....#.........#...#",
      "#.###.#####.###.#.#.#.###",
      "#.#...#.........#...#...#",
      "#.#.#.#.#.###.#.#.#.#.#.#",
      "#.....#...#...#.#...#.#.#",
      "#######.###.###.###.#.#.#",
      "#...#.........#.....#.#.#",
      "#.###.#####.#.#####.#.#.#",
      "#...........#..........G#",
      "#########################"],
    mini: [   // para ejemplos chicos (álgebra: 7 estados)
      "#######",
      "#S...G#",
      "#.#####",
      "#.....#",
      "#######"]
  };
  const DR = [[-1, 0], [0, 1], [1, 0], [0, -1]];
  const ARROW = ["↑", "→", "↓", "←"];
  const DIRN = ["up", "right", "down", "left"];

  // ---------- entorno ----------
  function makeEnv(rows) {
    const H = rows.length, W = rows[0].length, free = [], idx = {};
    let start = 0, goal = 0;
    for (let r = 0; r < H; r++) for (let c = 0; c < W; c++) {
      const ch = rows[r][c];
      if (ch !== "#") { idx[r + "," + c] = free.length; if (ch === "S") start = free.length; if (ch === "G") goal = free.length; free.push([r, c]); }
    }
    const isWall = (r, c) => rows[r] === undefined || rows[r][c] === undefined || rows[r][c] === "#";
    const move = (s, a) => {
      const [r, c] = free[s], nr = r + DR[a][0], nc = c + DR[a][1];
      if (isWall(nr, nc)) return [s, true, nr + "," + nc];
      return [idx[nr + "," + nc], false, null];
    };
    const dist = new Array(free.length).fill(Infinity); dist[goal] = 0; const q = [goal];
    while (q.length) { const s = q.shift(); for (let a = 0; a < 4; a++) { const [s2, b] = move(s, a); if (!b && dist[s2] === Infinity) { dist[s2] = dist[s] + 1; q.push(s2); } } }
    return { rows, H, W, free, idx, start, goal, nS: free.length, nA: 4, move, isWall, dist };
  }

  // P[s][a] = lista de [s', prob]; con slip, se resbala a una dirección perpendicular
  function transiciones(env, slip = 0) {
    const P = [];
    for (let s = 0; s < env.nS; s++) {
      P.push([]);
      for (let a = 0; a < 4; a++) {
        const out = {};
        if (s === env.goal) { out[s] = 1; }
        else {
          const opts = [[a, 1 - slip]];
          if (slip > 0) opts.push([(a + 1) % 4, slip / 2], [(a + 3) % 4, slip / 2]);
          for (const [aa, p] of opts) { const [s2] = env.move(s, aa); out[s2] = (out[s2] || 0) + p; }
        }
        P[s].push(Object.entries(out).map(([k, v]) => [+k, v]));
      }
    }
    return P;
  }
  // recompensa: +1 al entrar a la salida, -costo en cualquier otro paso
  const recompensa = (env, s2, costo = 0) => (s2 === env.goal ? 1 : -costo);

  function iteracionValor(env, { gamma = 0.95, costo = 0, slip = 0, iters = 1, V = null } = {}) {
    const P = transiciones(env, slip);
    V = V ? V.slice() : new Array(env.nS).fill(0);
    let delta = 0;
    for (let k = 0; k < iters; k++) {
      const NV = V.slice(); delta = 0;
      for (let s = 0; s < env.nS; s++) {
        if (s === env.goal) { NV[s] = 0; continue; }
        let best = -Infinity;
        for (let a = 0; a < 4; a++) { let q = 0; for (const [s2, p] of P[s][a]) q += p * (recompensa(env, s2, costo) + gamma * (s2 === env.goal ? 0 : V[s2])); best = Math.max(best, q); }
        NV[s] = best; delta = Math.max(delta, Math.abs(best - V[s]));
      }
      V = NV;
    }
    return { V, delta };
  }
  function politicaGreedy(env, V, { gamma = 0.95, costo = 0, slip = 0 } = {}) {
    const P = transiciones(env, slip);
    return V.map((_, s) => { let ba = 0, bq = -Infinity; for (let a = 0; a < 4; a++) { let q = 0; for (const [s2, p] of P[s][a]) q += p * (recompensa(env, s2, costo) + gamma * (s2 === env.goal ? 0 : V[s2])); if (q > bq + 1e-12) { bq = q; ba = a; } } return ba; });
  }
  function camino(env, pol, limite = 400) {
    const p = [env.start]; let s = env.start; const vistos = new Set([s]);
    for (let i = 0; i < limite && s !== env.goal; i++) { const [s2] = env.move(s, pol[s]); p.push(s2); if (vistos.has(s2)) break; vistos.add(s2); s = s2; }
    return p;
  }

  // generador pseudoaleatorio con semilla (reproducible)
  function rng(seed = 12345) { let x = seed >>> 0; return () => { x = (x * 1664525 + 1013904223) >>> 0; return x / 4294967296; }; }

  // ---------- color ----------
  const css = getComputedStyle(document.documentElement);
  const C = k => css.getPropertyValue(k).trim();
  const COL = () => ({ cave: C("--cave"), rock: C("--rock"), rock2: C("--rock-2"), rock3: C("--rock-3"), chalk: C("--chalk"), ink: C("--ink"), muted: C("--muted"),
    exit: C("--exit"), lamp: C("--lamp"), sonar: C("--sonar"), ember: C("--ember"), mono: C("--mono") });
  const hex = h => { h = h.replace("#", ""); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };
  const RAMPAS = {
    valor: ["#14182a", "#6b3a5c", "#d9773a", "#f2b35a", "#fff1c9"].map(hex),
    visitas: ["#0f1a22", "#1c4b5a", "#5ec8d8", "#dff7fb"].map(hex),
    signo: ["#e0645a", "#3a1f24", "#14182a", "#1d3b2c", "#3ddc84"].map(hex)
  };
  function rampa(nombre, t) {
    const st = RAMPAS[nombre]; t = Math.max(0, Math.min(1, t)); const n = st.length - 1, i = Math.min(n - 1, Math.floor(t * n)), f = t * n - i;
    const a = st[i], b = st[i + 1]; return `rgb(${[0, 1, 2].map(j => Math.round(a[j] + (b[j] - a[j]) * f)).join(",")})`;
  }
  const gradienteCSS = nombre => `linear-gradient(90deg, ${[0, .25, .5, .75, 1].map(t => rampa(nombre, t)).join(",")})`;

  // ---------- sprites ----------
  const base = (document.currentScript && document.currentScript.src) ? document.currentScript.src.replace(/cueva\.js.*$/, "") : "../assets/";
  const IMG = {};
  for (const d of DIRN) for (const k of [1, 2]) { const im = new Image(); im.src = `${base}sprites/boy_${d}_${k}.png`; IMG[d + k] = im; }
  const alCargarSprites = cb => Promise.all(Object.values(IMG).map(im => im.complete ? 0 : new Promise(r => { im.onload = im.onerror = r; }))).then(cb);

  // ---------- tablero (dibujo en canvas) ----------
  function tablero(canvas, env, { maxCell = 44, minCell = 10 } = {}) {
    const ctx = canvas.getContext("2d"); let cell = 30;
    const T = {
      ctx, get cell() { return cell; }, env,
      medir() {
        const ancho = (canvas.parentElement ? canvas.parentElement.clientWidth : 600) - 22;
        cell = Math.max(minCell, Math.floor(Math.min(ancho / env.W, maxCell)));
        const dpr = window.devicePixelRatio || 1;
        canvas.width = env.W * cell * dpr; canvas.height = env.H * cell * dpr;
        canvas.style.width = env.W * cell + "px"; canvas.style.height = env.H * cell + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.imageSmoothingEnabled = false; return T;
      },
      casilla(r, c, color, inset = 0) { ctx.fillStyle = color; ctx.fillRect(c * cell + inset, r * cell + inset, cell - 2 * inset, cell - 2 * inset); },
      fondo(color = "#000") { ctx.fillStyle = color; ctx.fillRect(0, 0, env.W * cell, env.H * cell); return T; },
      paredes(color = COL().rock2) { for (let r = 0; r < env.H; r++) for (let c = 0; c < env.W; c++) if (env.rows[r][c] === "#") T.casilla(r, c, color); return T; },
      tocadas(set, color = COL().chalk) { for (const k of set) { const [r, c] = k.split(",").map(Number); T.casilla(r, c, color, 1); } return T; },
      valores(V, { rampa: rp = "valor", lo = null, hi = null, omitirMeta = true } = {}) {
        const vals = V.filter((_, s) => !(omitirMeta && s === env.goal) && isFinite(V[s]));
        const a = lo ?? Math.min(...vals), b = hi ?? Math.max(...vals), span = (b - a) || 1;
        for (let s = 0; s < env.nS; s++) { if (omitirMeta && s === env.goal) continue; const [r, c] = env.free[s]; T.casilla(r, c, rampa(rp, (V[s] - a) / span)); }
        return T;
      },
      texto(s, txt, color = COL().ink, escala = .38) {
        const [r, c] = env.free[s]; ctx.fillStyle = color; ctx.font = `600 ${Math.round(cell * escala)}px ${COL().mono}`;
        ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(txt, c * cell + cell / 2, r * cell + cell / 2 + 1); return T;
      },
      flechas(pol, color = "rgba(232,230,223,.75)") { for (let s = 0; s < env.nS; s++) if (s !== env.goal) T.texto(s, ARROW[pol[s]], color, .5); return T; },
      trayecto(path, color = COL().exit, ancho = .12) {
        if (path.length < 2) return T; ctx.strokeStyle = color; ctx.lineWidth = Math.max(2, cell * ancho); ctx.lineJoin = "round"; ctx.lineCap = "round";
        ctx.beginPath(); path.forEach((s, i) => { const [r, c] = env.free[s]; const x = c * cell + cell / 2, y = r * cell + cell / 2; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke(); return T;
      },
      salida() { const [r, c] = env.free[env.goal]; ctx.save(); ctx.shadowColor = COL().exit; ctx.shadowBlur = cell * .6; T.casilla(r, c, COL().exit, Math.max(2, cell * .08)); ctx.restore(); return T; },
      entrada() { const [r, c] = env.free[env.start]; ctx.strokeStyle = COL().muted; ctx.lineWidth = 1; ctx.setLineDash([3, 3]); ctx.strokeRect(c * cell + 2.5, r * cell + 2.5, cell - 5, cell - 5); ctx.setLineDash([]); return T; },
      sprite(s, dir = 2, frame = 0) {
        const [r, c] = env.free[s]; const im = IMG[DIRN[dir] + (frame ? 2 : 1)];
        if (im && im.complete && im.naturalWidth) ctx.drawImage(im, c * cell + cell * .1, r * cell + cell * .1, cell * .8, cell * .8);
        else { ctx.fillStyle = COL().lamp; ctx.beginPath(); ctx.arc(c * cell + cell / 2, r * cell + cell / 2, cell * .3, 0, 7); ctx.fill(); }
        return T;
      },
      grilla(color = "rgba(141,147,163,.18)") { ctx.strokeStyle = color; ctx.lineWidth = 1; for (let r = 0; r <= env.H; r++) { ctx.beginPath(); ctx.moveTo(0, r * cell + .5); ctx.lineTo(env.W * cell, r * cell + .5); ctx.stroke(); } for (let c = 0; c <= env.W; c++) { ctx.beginPath(); ctx.moveTo(c * cell + .5, 0); ctx.lineTo(c * cell + .5, env.H * cell); ctx.stroke(); } return T; },
      // casilla bajo el puntero (para clics): devuelve [r, c]
      celdaEn(ev) { const b = canvas.getBoundingClientRect(); return [Math.floor((ev.clientY - b.top) / cell), Math.floor((ev.clientX - b.left) / cell)]; }
    };
    T.medir();
    return T;
  }

  // ---------- gráfico de líneas simple (para curvas de aprendizaje, histogramas) ----------
  function lienzo(canvas, alto = 160) {
    const ctx = canvas.getContext("2d");
    const ajustar = () => { const pe = canvas.parentElement, cs = pe ? getComputedStyle(pe) : null; const w = (pe ? pe.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) : 600) - 2; const dpr = window.devicePixelRatio || 1; canvas.width = w * dpr; canvas.height = alto * dpr; canvas.style.width = w + "px"; canvas.style.height = alto + "px"; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); return { w, h: alto, ctx }; };
    return ajustar;
  }

  // ---------- navegación del sitio ----------
  // unidad: "N" = nivelación (optativa, fuera de las 16); 1..4 = unidad de cuatro clases. pronto: clase en preparación (sin página todavía)
  const CLASES = [
    { id: "0a", archivo: "00a-python.html", titulo: "Python desde la cueva", nb: "00a-python-desde-la-cueva.ipynb", bloque: "Nivelación · 0a", unidad: "N" },
    { id: "0b", archivo: "00b-probabilidad.html", titulo: "Probabilidad con piso resbaloso", nb: "00b-probabilidad.ipynb", bloque: "Nivelación · 0b", unidad: "N" },
    { id: "0c", archivo: "00c-algebra.html", titulo: "Álgebra lineal con Bellman", nb: "00c-algebra-lineal.ipynb", bloque: "Nivelación · 0c", unidad: "N" },
    { id: "1", archivo: "01-introduccion.html", titulo: "Introducción: por qué este curso", nb: null, bloque: "Clase 1", unidad: 1 },
    { id: "2", archivo: "02-que-es-rl.html", titulo: "¿Qué es RL?", nb: "02-que-es-rl.ipynb", bloque: "Clase 2", unidad: 1 },
    { id: "3", archivo: "03-cuanto-pesa-el-futuro.html", titulo: "Cuánto pesa el futuro: de la cadena de Markov a Bellman", nb: "03-cuanto-pesa-el-futuro.ipynb", bloque: "Clase 3", unidad: 1 },
    { id: "4", archivo: "04-planificar-con-mapa.html", titulo: "Planificar con mapa: iteración de valor y de política", nb: "04-planificar-con-mapa.ipynb", bloque: "Clase 4", unidad: 1 },
    { id: "5", archivo: "05-evaluar-sin-mapa.html", titulo: "Evaluar sin mapa: Monte Carlo y TD", nb: "05-evaluar-sin-mapa.ipynb", bloque: "Clase 5", unidad: 2 },
    { id: "6", archivo: "06-controlar-sin-mapa.html", titulo: "Controlar sin mapa: SARSA y Q-learning", nb: "06-controlar-sin-mapa.ipynb", bloque: "Clase 6", unidad: 2 },
    { id: "7", archivo: "07-explorar.html", titulo: "Explorar: de los bandits a la cueva", nb: "07-explorar.ipynb", bloque: "Clase 7", unidad: 2 },
    { id: "8", archivo: "08-de-la-tabla-a-la-red.html", titulo: "De la tabla a la red: aproximación y DQN", nb: "08-de-la-tabla-a-la-red.ipynb", bloque: "Clase 8", unidad: 2 },
    { id: "9", archivo: "09-redes-recurrentes.html", titulo: "Redes recurrentes: cuando el estado no alcanza", nb: "09-redes-recurrentes.ipynb", bloque: "Clase 9", unidad: 3 },
    { id: "10", archivo: "10-aprender-de-registros.html", titulo: "Aprender de registros: imitar y RL offline", nb: "10-aprender-de-registros.ipynb", bloque: "Clase 10", unidad: 3 },
    { id: "11", archivo: "11-policy-gradient.html", titulo: "Policy gradient y actor-crítico: reforzar lo que salió bien", nb: "11-policy-gradient.ipynb", bloque: "Clase 11", unidad: 3 },
    { id: "12", archivo: "12-aprender-la-recompensa.html", titulo: "Aprender la recompensa: preferencias, RLHF y DPO", nb: "12-aprender-la-recompensa.ipynb", bloque: "Clase 12", unidad: 3 },
    { id: "13", archivo: "13-el-lenguaje-como-politica.html", titulo: "El modelo de lenguaje como política: token, temperatura, GRPO", nb: "13-el-lenguaje-como-politica.ipynb", bloque: "Clase 13", unidad: 4 },
    { id: "14", archivo: "14-agentes-de-lenguaje.html", titulo: "Agentes de lenguaje: ReAct, herramientas, riesgos", nb: "14-agentes-de-lenguaje.ipynb", bloque: "Clase 14", unidad: 4, pronto: true },
    { id: "15", archivo: "15-agentes-aplicados.html", titulo: "Agentes aplicados: tutor, difusión, persuasión, alineación", nb: "15-agentes-aplicados.ipynb", bloque: "Clase 15", unidad: 4 },
    { id: "16", archivo: "16-cierre.html", titulo: "Cierre: proyecto final y cómo se propaga", nb: null, bloque: "Clase 16", unidad: 4, pronto: true }
  ];
  const colab = nb => `https://colab.research.google.com/github/${REPO}/blob/${RAMA}/notebooks/${nb}`;
  const github = ruta => `https://github.com/${REPO}/blob/${RAMA}/${ruta}`;

  // ---------- progreso del curso (localStorage, solo en este navegador) ----------
  const CLAVE_PROGRESO = "rlac-cuestionarios-v2";   // v2: los ids cambiaron de significado al pasar a 16 clases
  const APROBAR = 4;   // respuestas correctas sobre 5 para aprobar
  function leerProgreso() { try { const g = JSON.parse(localStorage.getItem(CLAVE_PROGRESO) || "{}"); return g && typeof g === "object" ? g : {}; } catch (e) { return {}; } }
  function guardarProgreso(g) { try { localStorage.setItem(CLAVE_PROGRESO, JSON.stringify(g)); } catch (e) { /* sin almacenamiento */ } }
  const activas = () => CLASES.filter(c => !c.pronto);   // las clases en preparación no tienen cuestionario todavía
  const aprobados = () => { const g = leerProgreso(); return activas().filter(c => g[c.id] && g[c.id].aprobado).length; };
  const esc = t => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  function pintarProgreso() {
    const n = aprobados(), tot = activas().length;
    document.querySelectorAll("[data-progreso]").forEach(el => {
      el.querySelector("i").style.width = (100 * n / tot) + "%";
      el.querySelector("b").textContent = `${n}/${tot}`;
      el.title = `Cuestionarios aprobados: ${n} de ${tot} (guardado en este navegador)`;
    });
  }

  // "Antes de empezar": objetivos, tiempo y requisitos, justo después de .clase-head
  function antesDeEmpezar(id, M) {
    const head = document.querySelector(".clase-head"); if (!head) return;
    const prev = (M.previos || []).map(p => CLASES.find(c => c.id === p)).filter(Boolean);
    const req = prev.map(c => c.pronto ? `<li>${esc(c.bloque)} · ${esc(c.titulo)} (próximamente)</li>` : `<li><a href="${c.archivo}">${esc(c.bloque)} · ${esc(c.titulo)}</a></li>`).join("") +
      (M.requisitos || []).map(r => `<li>${esc(r)}</li>`).join("");
    const t = M.tiempo || {};
    const sec = document.createElement("section"); sec.className = "antes"; sec.setAttribute("aria-label", "Antes de empezar");
    sec.innerHTML = `<div class="antes-tit">Antes de empezar</div>
      <div class="antes-col antes-obj"><h3>Al terminar vas a poder</h3><ul>${(M.objetivos || []).map(o => `<li>${esc(o)}</li>`).join("")}</ul></div>
      <div class="antes-col"><h3>Tiempo</h3><ul class="antes-t">
        ${t.pagina ? `<li><b>~${t.pagina} min</b> esta página</li>` : ""}${t.notebook ? `<li><b>~${t.notebook} min</b> el notebook (opcional)</li>` : ""}</ul>
        <p class="small muted"><a href="#cuestionario">Cuestionario</a> y <a href="#actividad">actividad entre pares</a> al final.</p></div>
      <div class="antes-col"><h3>Requisitos</h3><ul>${req || "<li>Ninguno.</li>"}</ul></div>`;
    head.after(sec);
  }

  // orden de opciones mezclado pero fijo para cada pregunta (el índice correcto no queda siempre en el mismo lugar)
  function ordenOpciones(id, qi, n) {
    let h = 7; for (const ch of id + ":" + qi) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    const r = rng(h), o = [...Array(n).keys()];
    for (let k = n - 1; k > 0; k--) { const j = Math.floor(r() * (k + 1)); [o[k], o[j]] = [o[j], o[k]]; }
    return o;
  }

  function cuestionario(id, M, cl) {
    const Q = M.cuestionario || []; if (!Q.length) return null;
    const sec = document.createElement("section"); sec.className = "quiz"; sec.id = "cuestionario"; sec.setAttribute("aria-labelledby", "quiz-tit");
    sec.innerHTML = `<div class="quiz-head"><div class="paso">Cuestionario · ${esc(cl.bloque)}</div>
        <h2 id="quiz-tit">¿Qué te llevás?</h2>
        <p class="muted small">${Q.length} preguntas. Se corrige acá mismo y cada respuesta trae su explicación. Con ${APROBAR} de ${Q.length} queda aprobado y suma a tu progreso. Tus respuestas se guardan solo en este navegador.</p></div>
      ${Q.map((q, qi) => `<fieldset class="q" data-q="${qi}"><legend><span class="q-n">${qi + 1}</span>${esc(q.pregunta)}</legend>
        <div class="q-ops">${ordenOpciones(id, qi, q.opciones.length).map(oi => `<label class="q-op" data-o="${oi}"><input type="radio" name="q-${esc(id)}-${qi}" value="${oi}"><span>${esc(q.opciones[oi].texto)}</span></label>`).join("")}</div>
        <div class="q-fb" hidden></div></fieldset>`).join("")}
      <div class="row quiz-pie"><button class="btn primary" type="button" data-accion="corregir">Corregir</button><button class="btn" type="button" data-accion="reiniciar">Volver a intentar</button>
        <p class="quiz-res" role="status" aria-live="polite"></p></div>`;
    const res = sec.querySelector(".quiz-res"), bCorr = sec.querySelector("[data-accion=corregir]"), bRe = sec.querySelector("[data-accion=reiniciar]");
    const respuestas = () => Q.map((_, qi) => { const r = sec.querySelector(`fieldset[data-q="${qi}"] input:checked`); return r ? +r.value : null; });
    const guardar = cambios => { const g = leerProgreso(); g[id] = Object.assign({}, g[id], cambios); guardarProgreso(g); };

    function mostrar(resp) {
      let ok = 0;
      Q.forEach((q, qi) => {
        const fs = sec.querySelector(`fieldset[data-q="${qi}"]`), fb = fs.querySelector(".q-fb"), r = resp[qi], bien = r === q.correcta;
        if (bien) ok++;
        fs.classList.add("corregida"); fs.classList.toggle("bien", bien); fs.classList.toggle("mal", !bien);
        fs.querySelectorAll(".q-op").forEach(l => { const o = +l.dataset.o; l.classList.toggle("es-correcta", o === q.correcta); l.classList.toggle("es-error", o === r && !bien); l.querySelector("input").disabled = true; });
        const expl = o => esc(q.opciones[o].explicacion.replace(/^Correcto[.,]?\s*/, ""));
        fb.innerHTML = bien ? `<b class="ok">Bien.</b> ${expl(r)}`
          : `<b class="no">No.</b> ${expl(r)}<br><span class="muted">La correcta:</span> <b>${esc(q.opciones[q.correcta].texto)}</b> ${expl(q.correcta)}`;
        fb.hidden = false;
      });
      const aprobado = ok >= APROBAR;
      res.innerHTML = `<b>${ok} de ${Q.length}</b> · ${aprobado ? '<span class="ok">aprobado</span>' : `te faltan ${APROBAR - ok} para aprobar: releé las explicaciones y volvé a intentar`}`;
      bCorr.hidden = true;
      return { ok, aprobado };
    }
    function limpiar() {
      sec.querySelectorAll("fieldset.q").forEach(fs => {
        fs.classList.remove("corregida", "bien", "mal"); fs.querySelector(".q-fb").hidden = true;
        fs.querySelectorAll(".q-op").forEach(l => { l.classList.remove("es-correcta", "es-error"); const inp = l.querySelector("input"); inp.disabled = false; inp.checked = false; });
      });
      res.textContent = ""; bCorr.hidden = false;
    }
    bCorr.addEventListener("click", () => {
      const resp = respuestas(), faltan = resp.filter(r => r === null).length;
      if (faltan) { res.textContent = `Falta${faltan > 1 ? "n" : ""} responder ${faltan} pregunta${faltan > 1 ? "s" : ""}.`; return; }
      const { ok, aprobado } = mostrar(resp), prev = leerProgreso()[id] || {};
      guardar({ resp, corregido: true, puntaje: ok, mejor: Math.max(ok, prev.mejor || 0), aprobado: aprobado || !!prev.aprobado });
      pintarProgreso();
    });
    bRe.addEventListener("click", () => { limpiar(); guardar({ resp: Q.map(() => null), corregido: false }); });
    sec.addEventListener("change", e => { if (e.target.type === "radio") guardar({ resp: respuestas(), corregido: false }); });

    // restaurar lo guardado
    const g = leerProgreso()[id];
    if (g && Array.isArray(g.resp)) {
      g.resp.forEach((r, qi) => { if (r === null || r === undefined) return; const inp = sec.querySelector(`fieldset[data-q="${qi}"] input[value="${r}"]`); if (inp) inp.checked = true; });
      if (g.corregido && g.resp.length === Q.length && g.resp.every((r, qi) => Number.isInteger(r) && r >= 0 && r < Q[qi].opciones.length)) mostrar(g.resp);
    }
    return sec;
  }

  function actividad(id, M, cl) {
    const A = M.actividad; if (!A) return null;
    const sec = document.createElement("section"); sec.className = "pares"; sec.id = "actividad"; sec.setAttribute("aria-labelledby", "pares-tit");
    const titulo = `[${cl.bloque}] ${A.titulo}`;
    const plantilla = `Devolución para: ${titulo}\n\n` + A.rubrica.map((r, k) => `${k + 1}. ${r}\n   [ ] logrado  [ ] a medias  [ ] pendiente\n   Comentario: `).join("\n") + `\n\nUna cosa que me llevo de tu respuesta: `;
    sec.innerHTML = `<div class="pares-txt"><div class="paso">Actividad entre pares</div>
        <h2 id="pares-tit">${esc(A.titulo)}</h2>
        <p>${esc(A.consigna)}</p>
        <p class="small muted">Publicala en GitHub Discussions con el título <code>${esc(titulo)}</code>. Después devolvé la de otra persona con la rúbrica: así el curso se propaga.</p>
        <p class="row"><a class="btn primary" href="https://github.com/${REPO}/discussions">Ir a GitHub Discussions</a><button class="btn" type="button" data-accion="copiar">Copiar plantilla de devolución</button><span class="small muted" role="status" aria-live="polite"></span></p></div>
      <div class="pares-rub"><h3>Rúbrica para devolver</h3><ol>${A.rubrica.map(r => `<li>${esc(r)}</li>`).join("")}</ol>
        <p class="small muted">Cada criterio se marca como logrado, a medias o pendiente, con un comentario de una línea.</p></div>`;
    const aviso = sec.querySelector("[role=status]");
    sec.querySelector("[data-accion=copiar]").addEventListener("click", () => {
      const ok = () => { aviso.textContent = "Copiada."; }, no = () => { aviso.textContent = "No se pudo copiar: copiá la rúbrica a mano."; };
      try { navigator.clipboard.writeText(plantilla).then(ok, no); } catch (e) { no(); }
    });
    return sec;
  }

  // Inserta barra superior al principio del body y material + paginador al final de <main>.
  // Si existe window.MODULOS (assets/modulos.js), agrega además "Antes de empezar", el cuestionario y la actividad entre pares.
  // lecturas: [{texto, url}]
  function pagina(id, { lecturas = [] } = {}) {
    const i = CLASES.findIndex(c => c.id === id), cl = CLASES[i];
    const M = window.MODULOS && window.MODULOS[id];
    const bar = document.createElement("header"); bar.className = "topbar";
    bar.innerHTML = `<div class="wrap"><a class="brand" href="../index.html">RL <span class="g">a ciegas</span></a>
      <nav aria-label="Secciones"><a href="../clases/01-introduccion.html">Inicio</a><a href="../index.html#clases">Clases</a><a href="../juego/la-cueva-a-ciegas.html">Juego</a><a href="../difusion/estrategia.html">Difusión</a><a href="https://github.com/${REPO}">GitHub</a>
        <a class="progreso" data-progreso href="${M ? "#cuestionario" : "../index.html#clases"}"><span class="pbar" aria-hidden="true"><i></i></span><span class="sr">Cuestionarios aprobados</span><b></b></a></nav></div>`;
    document.body.prepend(bar);
    const main = document.querySelector("main") || document.body;
    if (M) {
      antesDeEmpezar(id, M);
      const q = cuestionario(id, M, cl); if (q) main.appendChild(q);
      const a = actividad(id, M, cl); if (a) main.appendChild(a);
    }
    pintarProgreso();
    const mat = document.createElement("section"); mat.className = "material"; mat.setAttribute("aria-label", "Material de la clase");
    mat.innerHTML = `${cl.nb ? `<div class="item"><h3>Notebook</h3><p class="small">Vía profunda: la misma clase con código, en Python.</p>
        <p class="row small"><a href="${colab(cl.nb)}">Abrir en Colab</a><a href="${github("notebooks/" + cl.nb)}">Ver en GitHub</a></p></div>` : ""}
      <div class="item"><h3>Juego</h3><p class="small">La cueva a ciegas: jugar, planificar y mirar aprender a un agente.</p><p class="small"><a href="../juego/la-cueva-a-ciegas.html">Abrir el juego</a></p></div>
      <div class="item"><h3>Foro</h3><p class="small">Preguntas, devoluciones entre pares y lo que encontraste: todo en GitHub Discussions.</p><p class="small"><a href="https://github.com/${REPO}/discussions">Abrir el foro</a></p></div>
      ${lecturas.length ? `<div class="item"><h3>Lecturas</h3>${lecturas.map(l => `<p class="small">${l.url ? `<a href="${l.url}">${l.texto}</a>` : l.texto}</p>`).join("")}</div>` : ""}`;
    main.appendChild(mat);
    const pg = document.createElement("nav"); pg.className = "pager"; pg.setAttribute("aria-label", "Clases");
    const prev = CLASES[i - 1], next = CLASES[i + 1];
    const pronto = (c, cls, flecha) => `<span class="pronto${cls}"><span>${flecha(c.bloque + " · próximamente")}</span><b>${c.titulo}</b></span>`;
    pg.innerHTML = (prev ? (prev.pronto ? pronto(prev, "", t => "← " + t) : `<a href="${prev.archivo}"><span>← ${prev.bloque}</span><b>${prev.titulo}</b></a>`) : `<a href="../clases/01-introduccion.html"><span>← Inicio</span><b>Por qué este curso</b></a>`) +
      (next ? (next.pronto ? pronto(next, " next", t => t + " →") : `<a class="next" href="${next.archivo}"><span>${next.bloque} →</span><b>${next.titulo}</b></a>`) : `<a class="next" href="../difusion/estrategia.html"><span>Epílogo →</span><b>Cómo se propaga este curso</b></a>`);
    main.appendChild(pg);
    const ft = document.createElement("footer"); ft.className = "site wrap";
    ft.innerHTML = `RL a ciegas · curso libre para enseñar a las máquinas y a las personas. Basado en Stanford CS234 y Sutton &amp; Barto.`;
    document.body.appendChild(ft);
    document.title = document.title || `${cl.titulo} · RL a ciegas`;
    addEventListener("storage", e => { if (e.key === CLAVE_PROGRESO) pintarProgreso(); });
  }

  window.Cueva = { REPO, MAPS, DR, ARROW, DIRN, makeEnv, transiciones, recompensa, iteracionValor, politicaGreedy, camino, rng,
    COL, rampa, gradienteCSS, tablero, lienzo, alCargarSprites, CLASES, colab, github, pagina, progreso: { leer: leerProgreso, aprobados, pintar: pintarProgreso } };
})();
