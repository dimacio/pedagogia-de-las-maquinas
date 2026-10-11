/* post.js — utilidades comunes de los posts (después de cueva.js).
   Cada post: <body class="a1|a2|a3" data-n="3"> con .post que contiene .cab, .tit, .fig, .txt/.voz, .pie (vacíos .cab/.pie: los arma esto). */
(function () {
  const ACTOS = { a1: "Acto I · A ciegas", a2: "Acto II · Enseñarle a una máquina", a3: "Acto III · Enseñar a enseñar" };
  const n = +document.body.dataset.n, acto = [...document.body.classList].find(c => /^a\d$/.test(c));
  const pad = k => String(k).padStart(2, "0");
  document.querySelectorAll(".cab").forEach(el => el.innerHTML = `<span class="marca">RL <span class="g">a ciegas</span></span><span class="num">${pad(n)}/12</span>`);
  document.querySelectorAll(".pie").forEach(el => el.innerHTML = `<span class="acto">${ACTOS[acto] || ""}</span><span class="puntos">${Array.from({ length: 12 }, (_, i) => `<i class="${i + 1 === n ? "on" : i + 1 < n ? "vis" : ""}"></i>`).join("")}</span>`);

  // tablero con tamaño de casilla fijo (sin depender del ancho del contenedor)
  function cueva(canvas, env, cell) {
    const T = Cueva.tablero(canvas, env, { maxCell: cell, minCell: cell });
    const ctx = T.ctx;
    canvas.width = env.W * cell; canvas.height = env.H * cell; canvas.style.width = canvas.width + "px"; canvas.style.height = canvas.height + "px";
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.imageSmoothingEnabled = false;
    Object.defineProperty(T, "cell", { get: () => cell });
    // T.medir() original recalcula con el contenedor: lo anulamos y redibujamos helpers con la casilla fija
    T.medir = () => T;
    return T;
  }

  // caminata al azar: devuelve trayecto y paredes tocadas
  function caminata(env, pasos, seed, desde = env.start) {
    const r = Cueva.rng(seed); let s = desde; const path = [s], tocadas = new Set(), visitas = new Array(env.nS).fill(0); visitas[s]++;
    for (let i = 0; i < pasos && s !== env.goal; i++) {
      const a = Math.floor(r() * 4); const [s2, choque, k] = env.move(s, a);
      if (choque) tocadas.add(k); else { s = s2; path.push(s); visitas[s]++; }
    }
    return { path, tocadas, visitas, fin: s };
  }

  // exploración por conteo: ir a la vecina menos visitada (curiosidad, clase 7)
  function curiosidad(env, pasos, seed) {
    const r = Cueva.rng(seed); let s = env.start; const visitas = new Array(env.nS).fill(0); visitas[s]++; const tocadas = new Set(); const path = [s];
    const cuenta = {};
    for (let i = 0; i < pasos; i++) {
      let best = Infinity, opts = [];
      for (let a = 0; a < 4; a++) { const key = s + ":" + a; const c = cuenta[key] || 0; if (c < best) { best = c; opts = [a]; } else if (c === best) opts.push(a); }
      const a = opts[Math.floor(r() * opts.length)]; cuenta[s + ":" + a] = (cuenta[s + ":" + a] || 0) + 1;
      const [s2, choque, k] = env.move(s, a);
      if (choque) tocadas.add(k); else { s = s2; visitas[s]++; path.push(s); }
      if (s === env.goal) s = env.start;
    }
    return { visitas, tocadas, path };
  }

  function listo(dibujar) {
    const fin = () => { dibujar(); window.LISTO = true; };
    Promise.all([document.fonts ? document.fonts.ready : 0, new Promise(r => Cueva.alCargarSprites(r))]).then(fin);
  }

  window.Post = { cueva, caminata, curiosidad, listo, n };
})();
