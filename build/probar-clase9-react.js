// Prueba del bloque ReAct de la clase 9: avanzar fases, slider, reproducir; y el bloque de dos ciclos.
// uso: node build/probar-clase9-react.js [ancho]
const path = require("path");
const PW = process.env.PW || "/tmp/claude-0/-home-claude/c0892404-b462-53b0-ae0f-c95d40b227f9/scratchpad/node_modules/playwright";
const { chromium } = require(PW);
const OUT = path.join(__dirname, "shots"), W = +(process.argv[2] || 1200);
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: W, height: 900 } });
  const errs = []; p.on("pageerror", e => errs.push(e.message)); p.on("console", m => m.type() === "error" && errs.push(m.text()));
  // cuestionario nuevo (build/modulos_9.json) en lugar de la entrada vieja
  const M9 = require("./modulos_9.json");
  await p.addInitScript(m => { let v; Object.defineProperty(window, "MODULOS", { get: () => v, set: x => { v = x; if (v) v["9"] = m; }, configurable: true }); }, M9);
  await p.goto("http://localhost:8765/clases/09-agentes-mundo-real.html", { waitUntil: "networkidle" }); await p.waitForTimeout(600);
  const st = p.locator("section.bloque").first().locator(".stage");
  const r = {};
  const leer = async () => ({ p: await p.textContent("#f0p b"), a: await p.textContent("#f0a b"), o: await p.textContent("#f0o b"), on: await p.getAttribute(".fase.on", "id"), hud: await p.textContent("#hud0") });
  r.inicial = await leer(); await st.screenshot({ path: path.join(OUT, `c9r-${W}-inicial.png`) });
  await p.click("#b0sig"); r.sig1 = await leer();
  await p.click("#b0sig"); r.sig2 = await leer();
  await p.fill("#b0k", "16"); await p.dispatchEvent("#b0k", "input"); r.paso16 = await leer();
  await st.screenshot({ path: path.join(OUT, `c9r-${W}-paso16.png`) });
  await p.fill("#b0k", "30"); await p.dispatchEvent("#b0k", "input"); r.paso30 = await leer();
  await p.click("#b0atr"); r.atras = await leer();
  await p.click("#b0rep"); await p.waitForTimeout(1300); r.rep = await leer(); await p.click("#b0rep");
  await p.click("#b1paso"); r.ciclo = await p.textContent("#c1bp b") + " | " + await p.textContent("#c1ba b");
  r.quiz = await p.locator("#cuestionario fieldset").count();
  console.log(JSON.stringify({ errs, r }, null, 1));
  await b.close();
})();
