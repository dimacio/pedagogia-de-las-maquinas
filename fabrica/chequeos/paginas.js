// Abre cada página con chromium (playwright) a varios anchos: errores de consola, desborde horizontal y captura.
// uso: node paginas.js --base http://127.0.0.1:PUERTO/ --out DIR --anchos 1200,400 [--red] ruta1.html ruta2.html ...
// Escribe en stdout un JSON: [{pagina, ancho, errores: [...], desborde: bool, anchoDoc, culpables: [...], captura, ms}]
// Sin --red, toda petición fuera del servidor local se corta (el chequeo no depende de Google Fonts ni de la red);
// los errores de esas peticiones cortadas no cuentan.
"use strict";
const path = require("path"), fs = require("fs");

function cargarPlaywright() {
  const candidatos = [process.env.PLAYWRIGHT_MODULE, "playwright", path.join(__dirname, "..", "..", "node_modules", "playwright")].filter(Boolean);
  for (const c of candidatos) { try { return require(c); } catch (e) { /* siguiente */ } }
  console.error("No encuentro el módulo playwright: corré `npm ci` en la raíz o definí PLAYWRIGHT_MODULE.");
  process.exit(3);
}

const args = process.argv.slice(2), opt = { anchos: [1200, 400], red: false, paginas: [] };
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === "--base") opt.base = args[++i];
  else if (a === "--out") opt.out = args[++i];
  else if (a === "--anchos") opt.anchos = args[++i].split(",").map(Number);
  else if (a === "--red") opt.red = true;
  else opt.paginas.push(a);
}

(async () => {
  const { chromium } = cargarPlaywright();
  fs.mkdirSync(opt.out, { recursive: true });
  const base = new URL(opt.base);
  const navegador = await chromium.launch();
  const resultados = [];
  for (const pag of opt.paginas) {
    for (const ancho of opt.anchos) {
      const t0 = Date.now();
      const contexto = await navegador.newContext({ viewport: { width: ancho, height: 900 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
      const p = await contexto.newPage();
      const errores = [], cortadas = new Set();
      if (!opt.red) {
        await p.route("**/*", ruta => {
          const u = new URL(ruta.request().url());
          if (u.host === base.host || u.protocol === "data:" || u.protocol === "blob:") return ruta.continue();
          cortadas.add(ruta.request().url()); return ruta.abort();
        });
      }
      p.on("pageerror", e => errores.push(`excepción: ${e.message}`));
      p.on("console", m => {
        if (m.type() !== "error") return;
        const u = (m.location() || {}).url || "";
        if (cortadas.has(u) || (/ERR_FAILED|ERR_BLOCKED/.test(m.text()) && !u.startsWith(opt.base))) return;
        errores.push(`consola: ${m.text()}${u ? ` (${u.replace(opt.base, "")})` : ""}`);
      });
      p.on("requestfailed", q => { if (!cortadas.has(q.url())) errores.push(`petición fallida: ${q.url().replace(opt.base, "")} (${(q.failure() || {}).errorText})`); });
      p.on("response", resp => { if (resp.status() >= 400 && resp.url().startsWith(opt.base)) errores.push(`HTTP ${resp.status()}: ${resp.url().replace(opt.base, "")}`); });
      let desborde = false, anchoDoc = 0, culpables = [], captura = null;
      try {
        await p.goto(new URL(pag, opt.base).href, { waitUntil: "load", timeout: 30000 });
        await p.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
        await p.waitForTimeout(700);
        const m = await p.evaluate(() => {
          const W = document.documentElement.clientWidth, sw = document.documentElement.scrollWidth;
          const malos = [];
          if (sw > W + 1) {
            for (const el of document.querySelectorAll("body *")) {
              const r = el.getBoundingClientRect();
              if (r.width && r.right > W + 1) {
                let d = el, oculto = false;   // ignorar lo que está dentro de un contenedor con scroll propio
                while ((d = d.parentElement) && d !== document.body) { const ox = getComputedStyle(d).overflowX; if (ox === "auto" || ox === "scroll" || ox === "hidden") { oculto = true; break; } }
                if (oculto) continue;
                const sel = el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") + (el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/).join(".") : "");
                malos.push({ sel, derecha: Math.round(r.right) });
              }
            }
          }
          return { W, sw, malos: malos.slice(0, 5) };
        });
        desborde = m.sw > m.W + 1; anchoDoc = m.sw; culpables = m.malos;
        const nombre = pag.replace(/\.html$/, "").replace(/[\/]/g, "__") + `-${ancho}.jpg`;
        captura = path.join(opt.out, nombre);
        await p.screenshot({ path: captura, fullPage: true, type: "jpeg", quality: 70 });
      } catch (e) {
        errores.push(`no se pudo abrir: ${e.message.split("\n")[0]}`);
      }
      resultados.push({ pagina: pag, ancho, errores: [...new Set(errores)], desborde, anchoDoc, culpables, captura, ms: Date.now() - t0 });
      await contexto.close();
    }
  }
  await navegador.close();
  process.stdout.write(JSON.stringify(resultados));
})().catch(e => { console.error(e); process.exit(1); });
