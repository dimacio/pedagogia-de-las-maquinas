"""Genera difusion/posts/src/post-XX.html desde fragmentos (cabecera común)."""
import pathlib
SRC = pathlib.Path("/home/claude/rl-a-ciegas/difusion/posts/src")

HEAD = """<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>{n:02d} · {nombre} · RL a ciegas</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Silkscreen&family=Atkinson+Hyperlegible:wght@400;700&family=JetBrains+Mono:wght@400;600&display=swap">
<link rel="stylesheet" href="../../../assets/estilo.css">
<link rel="stylesheet" href="post.css">
<style>{css}</style>
</head>
<body class="{acto}" data-n="{n}">
<div class="post">
  <div class="cab"></div>
{cuerpo}
  <div class="pie"></div>
</div>
<script src="../../../assets/cueva.js"></script>
<script src="post.js"></script>
<script>
{js}
</script>
</body>
</html>
"""

P = {}

# ------------------------------------------------------------------ ACTO I
P[1] = dict(acto="a1", nombre="Estás a ciegas", css="", cuerpo="""
  <h1 class="tit">Estás <span class="a">a ciegas</span> en una cueva.</h1>
  <div class="fig"><canvas id="cv" class="marco"></canvas></div>
  <div style="display:grid;gap:16px">
    <p class="txt">No ves el mapa. No sabés dónde está la salida. Solo podés <b>moverte</b>.</p>
    <p class="voz">Soy un curso. Empiezo como vos: <b>a oscuras</b>.</p>
  </div>""", js="""
  const env = Cueva.makeEnv(Cueva.MAPS.chica);
  const T = Post.cueva(document.getElementById("cv"), env, 52);
  Post.listo(() => {
    const ctx = T.ctx, c = T.cell, [r0, c0] = env.free[env.start];
    T.fondo("#000");
    const x = c0 * c + c / 2, y = r0 * c + c / 2, g = ctx.createRadialGradient(x, y, 4, x, y, c * 2.6);
    g.addColorStop(0, "rgba(242,179,90,.26)"); g.addColorStop(1, "rgba(242,179,90,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, env.W * c, env.H * c);
    T.entrada(); T.sprite(env.start, 2);
    ctx.font = `400 ${c * .9}px Silkscreen`; ctx.fillStyle = "rgba(141,147,163,.38)"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    [[3, 9], [6, 4], [7, 11], [2, 12], [5, 7]].forEach(([r, cc]) => ctx.fillText("?", cc * c + c / 2, r * c + c / 2));
  });""")

P[2] = dict(acto="a1", nombre="La pared que tocás", css="", cuerpo="""
  <h1 class="tit">La pared que <span class="a">tocás</span>, queda.</h1>
  <div class="fig"><canvas id="cv" class="marco"></canvas></div>
  <div style="display:grid;gap:16px">
    <p class="txt">Cada choque pinta una pared de gris. Chocar es tu <b>única forma de ver</b>.</p>
    <p class="voz">Así aprende una máquina: con lo poco que el mundo le devuelve.</p>
  </div>""", js="""
  const env = Cueva.makeEnv(Cueva.MAPS.chica);
  const T = Post.cueva(document.getElementById("cv"), env, 52);
  const w = Post.caminata(env, 170, 7);
  Post.listo(() => {
    T.fondo("#000");
    T.trayecto(w.path, "rgba(94,200,216,.35)", .08);
    T.tocadas(w.tocadas);
    T.entrada();
    const fin = w.path[w.path.length - 1];
    T.sprite(fin, 1);
    document.title += " (" + w.tocadas.size + " paredes)";
  });""")

P[3] = dict(acto="a1", nombre="La salida es verde", css="""
  .lbl { position:absolute; font-family: var(--mono); font-weight:600; font-size: 46px; color: var(--lamp); }
""", cuerpo="""
  <h1 class="tit">La salida es <span class="g">verde</span>.</h1>
  <div class="fig"><canvas id="cv" class="marco"></canvas></div>
  <div style="display:grid;gap:16px">
    <p class="txt">Una sola señal: <b style="color:var(--lamp)">+1</b> cuando llegás. Todo lo demás es silencio.</p>
    <p class="voz">Nadie te dice por dónde ir. Solo si llegaste.</p>
  </div>""", js="""
  const env = Cueva.makeEnv(Cueva.MAPS.chica);
  const T = Post.cueva(document.getElementById("cv"), env, 52);
  Post.listo(() => {
    const ctx = T.ctx, c = T.cell, [rg, cg] = env.free[env.goal];
    T.fondo("#000");
    const x = cg * c + c / 2, y = rg * c + c / 2, g = ctx.createRadialGradient(x, y, 4, x, y, c * 4);
    g.addColorStop(0, "rgba(61,220,132,.22)"); g.addColorStop(1, "rgba(61,220,132,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, env.W * c, env.H * c);
    ctx.save(); ctx.shadowColor = "#3ddc84"; ctx.shadowBlur = c * 1.2; T.casilla(rg, cg, "#3ddc84", 4); T.casilla(rg, cg, "#3ddc84", 4); ctx.restore();
    ctx.font = `600 ${c * .8}px "JetBrains Mono"`; ctx.fillStyle = "#f2b35a"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("+1", x - c * 0.1, y - c * 1.2);
    ctx.globalAlpha = .55; T.entrada(); T.sprite(env.start, 1); ctx.globalAlpha = 1;
  });""")

P[4] = dict(acto="a1", nombre="¿Cómo aprende algo que no ve?", css="", cuerpo="""
  <h1 class="tit m">¿Cómo aprende algo que <span class="a">no ve</span>?</h1>
  <div class="fig"><canvas id="cv" class="marco"></canvas></div>
  <div style="display:grid;gap:16px">
    <p class="txt">Probando, chocando y recordando. Eso es <b>aprendizaje por refuerzo</b>.</p>
    <p class="voz">Soy un curso y te lo explico. Para seguir vivo necesito que <b>me aprendas</b>.</p>
  </div>""", js="""
  const env = Cueva.makeEnv(Cueva.MAPS.chica);
  const T = Post.cueva(document.getElementById("cv"), env, 52);
  Post.listo(() => {
    T.fondo("#000");
    const todas = new Set();
    for (let k = 0; k < 40; k++) { const w = Post.caminata(env, 260, 100 + k); w.tocadas.forEach(t => todas.add(t)); T.trayecto(w.path, w.fin === env.goal ? "rgba(61,220,132,.55)" : "rgba(94,200,216,.10)", .06); }
    T.tocadas(todas, "rgba(201,204,211,.85)");
    T.salida(); T.entrada(); T.sprite(env.start, 2);
  });""")

# ------------------------------------------------------------------ ACTO II
P[5] = dict(acto="a2", nombre="Recompensa", css="", cuerpo="""
  <h1 class="tit m">Recompensa: decile <span class="a">qué</span>, no cómo.</h1>
  <div class="fig"><canvas id="cv" class="marco"></canvas></div>
  <div style="display:grid;gap:16px">
    <p class="txt">Un poquito de castigo por paso, <b>+1</b> al salir. La máquina encuentra sola el camino corto.</p>
    <p class="voz">La recompensa es lo único que le das. Elegila bien.</p>
  </div>""", js="""
  const env = Cueva.makeEnv(Cueva.MAPS.chica);
  const T = Post.cueva(document.getElementById("cv"), env, 52);
  const { V } = Cueva.iteracionValor(env, { gamma: .95, costo: .01, iters: 300 });
  const pol = Cueva.politicaGreedy(env, V, { gamma: .95, costo: .01 });
  const path = Cueva.camino(env, pol);
  Post.listo(() => {
    T.fondo("#000"); T.paredes("#151924");
    T.trayecto(path, "rgba(242,179,90,.35)", .5);
    path.slice(1, -1).forEach(s => T.texto(s, "−.01", "#e0645a", .3));
    T.salida(); T.texto(env.goal, "+1", "#0b0d12", .42);
    T.entrada(); T.sprite(env.start, 1);
  });""")

P[6] = dict(acto="a2", nombre="Cada casilla tiene un valor", css="""
  .eqp { font-family: var(--mono); font-size: 36px; color: var(--lamp); background: var(--rock); border:1px solid var(--rock-2); padding: 14px 20px; justify-self: start; }
""", cuerpo="""
  <h1 class="tit m">Cada casilla tiene un <span class="a">valor</span>.</h1>
  <div class="fig"><div style="display:grid;gap:14px;justify-items:center"><canvas id="cv" class="marco"></canvas>
    <div class="legend" style="width:900px;font-size:22px"><span>lejos</span><span class="bar" id="bar" style="height:12px"></span><span>cerca de salir</span></div></div></div>
  <div style="display:grid;gap:18px">
    <div class="eqp">V(s) = máx [ r + γ·V(s') ]</div>
    <p class="txt" style="max-width:26ch">Bellman: estar acá vale lo que vale <b>el mejor paso siguiente</b>.</p>
  </div>""", js="""
  const env = Cueva.makeEnv(Cueva.MAPS.grande);
  const T = Post.cueva(document.getElementById("cv"), env, 36);
  const { V } = Cueva.iteracionValor(env, { gamma: .95, costo: 0, iters: 400 });
  const pol = Cueva.politicaGreedy(env, V, { gamma: .95 });
  document.getElementById("bar").style.background = Cueva.gradienteCSS("valor");
  Post.listo(() => {
    T.fondo("#000"); T.paredes("#151924");
    T.valores(V);
    T.flechas(pol, "rgba(11,13,18,.55)");
    T.trayecto(Cueva.camino(env, pol), "rgba(61,220,132,.9)", .1);
    T.salida(); T.sprite(env.start, 1);
  });""")

P[7] = dict(acto="a2", nombre="Explorar o explotar", css="""
  .par { display:grid; grid-template-columns: 1fr 1fr; gap: 40px; width: 900px; }
  .par > div { display:grid; gap: 14px; justify-items: start; }
  .par h2 { font-family: var(--display); font-size: 34px; color: var(--ink); }
  .par .etq { font-size: 24px; }
""", cuerpo="""
  <h1 class="tit">¿Explorar o <span class="a">explotar</span>?</h1>
  <div class="fig"><div class="par">
    <div><h2>Explotar</h2><canvas id="cv1" class="marco"></canvas><span class="etq">repito lo que conozco</span></div>
    <div><h2 style="color:var(--sonar)">Explorar</h2><canvas id="cv2" class="marco"></canvas><span class="etq">voy donde menos fui</span></div>
  </div></div>
  <div style="display:grid;gap:16px">
    <p class="txt">Si solo repetís lo que ya funcionó, nunca encontrás <b>la salida</b>.</p>
    <p class="voz">Color = cuántas veces pasó el agente por cada casilla.</p>
  </div>""", js="""
  const env = Cueva.makeEnv(Cueva.MAPS.chica);
  const T1 = Post.cueva(document.getElementById("cv1"), env, 30), T2 = Post.cueva(document.getElementById("cv2"), env, 30);
  // explotar: el mismo recorrido corto, repetido 20 veces
  const corto = Post.caminata(env, 45, 3); const v1 = corto.visitas.map(v => v * 20);
  const cur = Post.curiosidad(env, 900, 5);
  function pintar(T, vis, toc, llego) {
    T.fondo("#000"); const mx = Math.max(...vis);
    vis.forEach((v, s) => { if (v > 0 && s !== env.goal) { const [r, c] = env.free[s]; T.casilla(r, c, Cueva.rampa("visitas", .2 + .8 * Math.log(1 + v) / Math.log(1 + mx))); } });
    T.tocadas(toc);
    if (llego) T.salida();
    T.sprite(env.start, 2);
  }
  Post.listo(() => { pintar(T1, v1, corto.tocadas, false); pintar(T2, cur.visitas, cur.tocadas, cur.visitas[env.goal] > 0); });""")

P[8] = dict(acto="a2", nombre="De la tabla a la red", css="""
  .flujo { display:grid; grid-template-columns: auto auto auto; align-items:center; gap: 22px; width: 900px; justify-content: space-between; }
  table.q { border-collapse: collapse; font-family: var(--mono); font-size: 24px; color: var(--ink); }
  table.q th { color: var(--muted); font-weight: 400; padding: 4px 7px; }
  table.q td { padding: 5px 7px; border: 1px solid var(--rock-2); text-align: right; font-variant-numeric: tabular-nums; }
  table.q td.max { color: var(--cave); background: var(--lamp); }
  .col { display:grid; gap: 12px; justify-items:center; }
""", cuerpo="""
  <h1 class="tit">De la tabla a la <span class="a">red</span>.</h1>
  <div class="fig"><div class="flujo">
    <div class="col"><table class="q" id="tq"></table><span class="etq">una fila por casilla</span></div>
    <div class="col"><canvas id="net"></canvas><span class="etq">una red que generaliza</span></div>
  </div></div>
  <div style="display:grid;gap:16px">
    <p class="txt">60 casillas entran en una tabla. Una cámara tiene <b>millones de estados</b>: hace falta una red.</p>
    <p class="voz">Así jugó Atari una máquina en 2015: DQN.</p>
  </div>""", js="""
  const env = Cueva.makeEnv(Cueva.MAPS.chica);
  const { V } = Cueva.iteracionValor(env, { gamma: .95, iters: 300 });
  const P = Cueva.transiciones(env), Q = s => [0,1,2,3].map(a => P[s][a].reduce((t, [s2, p]) => t + p * ((s2 === env.goal ? 1 : 0) + .95 * (s2 === env.goal ? 0 : V[s2])), 0));
  const filas = [0, 1, 2, 5, 9, 14, 20, 27];
  let h = "<tr><th>s</th>" + Cueva.ARROW.map(a => `<th>${a}</th>`).join("") + "</tr>";
  for (const s of filas) { const q = Q(s), m = Math.max(...q); h += `<tr><th>${s}</th>` + q.map(v => `<td class="${v === m ? "max" : ""}">${v.toFixed(2).replace(/^0/, "")}</td>`).join("") + "</tr>"; }
  h += `<tr><th>…</th><td colspan="4" style="text-align:center;color:var(--muted)">60 filas</td></tr>`;
  document.getElementById("tq").innerHTML = h;
  const cv = document.getElementById("net"), W = 470, H = 520; cv.width = W; cv.height = H; const ctx = cv.getContext("2d");
  Post.listo(() => {
    // entrada: la cueva como imagen (mini mapa de calor) → capas → 4 valores Q
    const cell = 11, mapW = env.W * cell, mapH = env.H * cell, mx = 10, my = (H - mapH) / 2;
    const lo = Math.min(...V.filter((_, s) => s !== env.goal)), hi = Math.max(...V);
    ctx.fillStyle = "#000"; ctx.fillRect(mx - 3, my - 3, mapW + 6, mapH + 6);
    for (let r = 0; r < env.H; r++) for (let c = 0; c < env.W; c++) { const s = env.idx[r + "," + c]; ctx.fillStyle = s === undefined ? "#1e2331" : Cueva.rampa("valor", (V[s] - lo) / (hi - lo)); ctx.fillRect(mx + c * cell, my + r * cell, cell, cell); }
    const capas = [[mx + mapW + 60, 7], [mx + mapW + 170, 7], [W - 40, 4]];
    const nodos = capas.map(([x, n]) => Array.from({ length: n }, (_, i) => [x, H / 2 + (i - (n - 1) / 2) * (n === 4 ? 70 : 58)]));
    const ent = Array.from({ length: 7 }, (_, i) => [mx + mapW + 2, my + (i + .5) * mapH / 7]);
    const lineas = (A, B, a) => { ctx.strokeStyle = `rgba(141,147,163,${a})`; ctx.lineWidth = 1.2; for (const p of A) for (const q of B) { ctx.beginPath(); ctx.moveTo(...p); ctx.lineTo(...q); ctx.stroke(); } };
    lineas(ent, nodos[0], .22); lineas(nodos[0], nodos[1], .3); lineas(nodos[1], nodos[2], .4);
    nodos.forEach((L, k) => L.forEach(([x, y], i) => { ctx.beginPath(); ctx.arc(x, y, k === 2 ? 17 : 13, 0, 7); ctx.fillStyle = k === 2 ? (i === 2 ? "#f2b35a" : "#2c3346") : "#1e2331"; ctx.fill(); ctx.strokeStyle = k === 2 ? "#f2b35a" : "#8d93a3"; ctx.lineWidth = 2; ctx.stroke(); }));
    ctx.font = '600 22px "JetBrains Mono"'; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    nodos[2].forEach(([x, y], i) => { ctx.fillStyle = i === 2 ? "#0b0d12" : "#e8e6df"; ctx.fillText(Cueva.ARROW[i], x, y + 1); });
  });""")

# ------------------------------------------------------------------ ACTO III
P[9] = dict(acto="a3", nombre="Cuidado con lo que premiás", css="", cuerpo="""
  <h1 class="tit m">Cuidado con lo que <span class="a">premiás</span>.</h1>
  <div class="fig"><canvas id="cv" class="marco"></canvas></div>
  <div style="display:grid;gap:16px">
    <p class="txt">Un tutor de IA premiado por aciertos aprende a dar <b>solo sumas fáciles</b>.</p>
    <p class="voz">Se llama <i>reward hacking</i>. Con personas pasa igual: premiá lo que querés que aprendan.</p>
  </div>""", js="""
  const env = Cueva.makeEnv(Cueva.MAPS.chica);
  const T = Post.cueva(document.getElementById("cv"), env, 52);
  Post.listo(() => {
    const ctx = T.ctx, c = T.cell;
    T.fondo("#000"); T.paredes("#151924");
    T.salida();
    // moneda +0.1 que reaparece cerca de la entrada
    const coin = env.idx["1,3"], [rc, cc] = env.free[coin];
    ctx.save(); ctx.shadowColor = "#f2b35a"; ctx.shadowBlur = 18; ctx.fillStyle = "#f2b35a"; ctx.beginPath(); ctx.arc(cc * c + c / 2, rc * c + c / 2, c * .26, 0, 7); ctx.fill(); ctx.restore();
    // el bucle del agente alrededor de la moneda (en el pasillo de arriba)
    const ex = 3 * c, ey = 1.5 * c, rx = 1.75 * c, ry = .36 * c, a1 = Math.PI * 1.9;
    ctx.strokeStyle = "#e0645a"; ctx.lineWidth = 5; ctx.setLineDash([12, 9]);
    ctx.beginPath(); ctx.ellipse(ex, ey, rx, ry, 0, Math.PI * .1, a1); ctx.stroke(); ctx.setLineDash([]);
    const ax = ex + rx * Math.cos(a1), ay = ey + ry * Math.sin(a1);
    ctx.fillStyle = "#e0645a"; ctx.beginPath(); ctx.moveTo(ax + 16, ay + 6); ctx.lineTo(ax - 4, ay - 10); ctx.lineTo(ax - 2, ay + 12); ctx.fill();
    T.sprite(env.idx["1,2"], 1);
    ctx.font = `600 ${c * .5}px "JetBrains Mono"`; ctx.textAlign = "left"; ctx.textBaseline = "middle";
    ctx.fillStyle = "#f2b35a"; ctx.fillText("+0.1 × 1000", 5.3 * c, 1.5 * c);
    const [rg, cg] = env.free[env.goal];
    ctx.fillStyle = "#3ddc84"; ctx.textAlign = "right"; ctx.fillText("+1 · nunca", (cg - .25) * c, (rg + .5) * c);
  });""")

P[10] = dict(acto="a3", nombre="Soy un meme", css="""
  .tres { display:grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
  .tres div { border-top: 4px solid var(--exit); padding-top: 10px; display:grid; gap: 4px; }
  .tres b { font-family: var(--display); font-weight:400; font-size: 27px; color: var(--exit); }
  .tres span { font-size: 30px; line-height: 1.2; }
""", cuerpo="""
  <h1 class="tit m">Soy un <span class="a">meme</span>. Vivo si me enseñás.</h1>
  <div class="fig"><canvas id="cv" class="marco"></canvas></div>
  <div class="tres">
    <div><b>Fidelidad</b><span>que me copien bien</span></div>
    <div><b>Fecundidad</b><span>que me copien mucho</span></div>
    <div><b>Longevidad</b><span>que dure lo copiado</span></div>
  </div>""", js="""
  // red de personas: cada una que aprende le enseña a otras cercanas (la cueva que se ilumina)
  const cv = document.getElementById("cv"), cell = 44, W = 20, H = 12; cv.width = W * cell; cv.height = H * cell; const ctx = cv.getContext("2d");
  const r = Cueva.rng(11), gen = Array.from({ length: H }, () => new Array(W).fill(-1)), edges = [];
  let frente = [[6, 10]]; gen[6][10] = 0;
  for (let g = 1; g <= 7 && frente.length; g++) {
    const nuevo = [];
    for (const [y, x] of frente) {
      const k = g === 1 ? 3 : (r() < .4 ? 1 : 2); let intentos = 0, hechos = 0;
      while (hechos < k && intentos++ < 12) {
        const dy = Math.round((r() - .5) * 4), dx = Math.round((r() - .5) * 4), ny = y + dy, nx = x + dx;
        if (ny < 0 || nx < 0 || ny >= H || nx >= W || gen[ny][nx] >= 0) continue;
        gen[ny][nx] = g; edges.push([y, x, ny, nx, g]); nuevo.push([ny, nx]); hechos++;
      }
    }
    frente = nuevo;
  }
  Post.listo(() => {
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, cv.width, cv.height);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (gen[y][x] < 0) { ctx.fillStyle = "#0e1118"; ctx.fillRect(x * cell + 3, y * cell + 3, cell - 6, cell - 6); }
    ctx.lineCap = "round";
    for (const [y, x, ny, nx, g] of edges) { ctx.strokeStyle = `rgba(61,220,132,${.85 - g * .08})`; ctx.lineWidth = Math.max(3, 8 - g); ctx.beginPath(); ctx.moveTo(x * cell + cell / 2, y * cell + cell / 2); ctx.lineTo(nx * cell + cell / 2, ny * cell + cell / 2); ctx.stroke(); }
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const g = gen[y][x]; if (g < 0) continue;
      ctx.save(); ctx.shadowColor = "#3ddc84"; ctx.shadowBlur = g < 3 ? 16 : 6;
      ctx.fillStyle = g === 0 ? "#3ddc84" : `rgba(201,204,211,${1 - g * .08})`; const ins = g === 0 ? 4 : 9;
      ctx.fillRect(x * cell + ins, y * cell + ins, cell - 2 * ins, cell - 2 * ins); ctx.restore(); }
    const im = new Image(); im.src = "../../../assets/sprites/boy_down_1.png";
    im.onload = () => { ctx.imageSmoothingEnabled = false; ctx.drawImage(im, 10 * cell - 4, 6 * cell - 4, cell + 8, cell + 8); };
  });""")

P[11] = dict(acto="a3", nombre="Esta campaña es un bandit", css="", cuerpo="""
  <h1 class="tit m">Esta campaña es un <span class="a">bandit</span>.</h1>
  <div class="fig"><canvas id="cv"></canvas></div>
  <div style="display:grid;gap:16px">
    <p class="txt">Cuatro tipos de post. <b>Tus guardados son mi recompensa</b>: el que más te sirva, lo repito.</p>
    <p class="voz">Thompson sampling: cuanto más dudo de un brazo, más lo pruebo.</p>
  </div>""", js="""
  const cv = document.getElementById("cv"), W = 900, H = 560; cv.width = W; cv.height = H; const ctx = cv.getContext("2d");
  // posteriores Beta con datos SUPUESTOS (ilustración): éxitos/fracasos por tipo de post
  const brazos = [["Intriga", 9, 300, "#c9ccd3"], ["Concepto", 14, 300, "#f2b35a"], ["Demo", 22, 300, "#3ddc84"], ["Enseñar", 6, 100, "#5ec8d8"]];
  const lgam = z => { const g = 7, c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7]; if (z < .5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - lgam(1 - z); z -= 1; let x = c[0]; for (let i = 1; i < g + 2; i++) x += c[i] / (z + i); const t = z + g + .5; return .5 * Math.log(2 * Math.PI) + (z + .5) * Math.log(t) - t + Math.log(x); };
  const beta = (x, a, b) => Math.exp((a - 1) * Math.log(x) + (b - 1) * Math.log(1 - x) + lgam(a + b) - lgam(a) - lgam(b));
  Post.listo(() => {
    const L = 30, R = W - 20, T0 = 70, B = H - 70, xmax = .12;
    ctx.strokeStyle = "#2c3346"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(L, B); ctx.lineTo(R, B); ctx.stroke();
    ctx.font = '22px "JetBrains Mono"'; ctx.fillStyle = "#8d93a3"; ctx.textAlign = "center";
    [0, .03, .06, .09, .12].forEach(v => { const x = L + (R - L) * v / xmax; ctx.fillText(Math.round(v * 100) + "%", x, B + 34); });
    ctx.textAlign = "right"; ctx.fillText("tasa de guardado (supuesta)", R, B + 64);
    let ymax = 0; const curvas = brazos.map(([n, s, t]) => { const pts = []; for (let i = 1; i < 400; i++) { const x = xmax * i / 400, y = beta(x, 1 + s, 1 + t - s); pts.push([x, y]); ymax = Math.max(ymax, y); } return pts; });
    curvas.forEach((pts, k) => { const col = brazos[k][3];
      ctx.beginPath(); pts.forEach(([x, y], i) => { const px = L + (R - L) * x / xmax, py = B - (B - T0) * y / ymax; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); });
      ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.stroke();
      ctx.lineTo(L + (R - L) * pts[pts.length - 1][0] / xmax, B); ctx.lineTo(L, B); ctx.fillStyle = col + "22"; ctx.fill();
      const [mx, my] = pts.reduce((a, b) => b[1] > a[1] ? b : a);
      ctx.font = '400 26px Silkscreen'; ctx.fillStyle = col; ctx.textAlign = "center";
      ctx.fillText(brazos[k][0], L + (R - L) * mx / xmax, B - (B - T0) * my / ymax - 18);
    });
  });""")

P[12] = dict(acto="a3", nombre="Enseñale esto a alguien", css="""
  .link { display:grid; gap: 8px; border: 2px solid var(--exit); padding: 20px 24px; box-shadow: 0 0 30px rgba(61,220,132,.18); }
  .link .u { font-family: var(--mono); font-size: 34px; color: var(--exit); word-break: break-all; }
  .link .etq { font-size: 25px; }
""", cuerpo="""
  <h1 class="tit">Enseñale esto <span class="a">a alguien</span>.</h1>
  <div class="fig"><canvas id="cv" class="marco"></canvas></div>
  <p class="txt" style="max-width:27ch">Curso libre: juego, 12 clases y notebooks. Para enseñarle a máquinas <b>y a personas</b>.</p>
  <div class="link"><span class="etq">link en la bio · repositorio</span><span class="u" id="url"></span></div>""", js="""
  document.getElementById("url").textContent = "github.com/" + Cueva.REPO;
  const env = Cueva.makeEnv(Cueva.MAPS.chica);
  const T = Post.cueva(document.getElementById("cv"), env, 46);
  const { V } = Cueva.iteracionValor(env, { gamma: .95, costo: .01, iters: 300 });
  const path = Cueva.camino(env, Cueva.politicaGreedy(env, V, { gamma: .95, costo: .01 }));
  Post.listo(() => {
    T.fondo("#000");
    const todas = new Set(); for (let r = 0; r < env.H; r++) for (let c = 0; c < env.W; c++) if (env.rows[r][c] === "#") todas.add(r + "," + c);
    T.tocadas(todas);
    T.trayecto(path, "#3ddc84", .14);
    T.salida();
    T.sprite(path[path.length - 2], 1);
    T.sprite(env.start, 2);
  });""")

for n, d in P.items():
    (SRC / f"post-{n:02d}.html").write_text(HEAD.format(n=n, **d))
print("ok", len(P))
