// Prueba de interacción de la clase 11: una interacción por bloque, captura de cada .stage.
// uso: node build/probar-modulo8.js [ancho]
const path = require("path");
const PW = process.env.PW || "/tmp/claude-0/-home-claude/c0892404-b462-53b0-ae0f-c95d40b227f9/scratchpad/node_modules/playwright";
const { chromium } = require(PW);
const OUT = path.join(__dirname, "shots"), W = +(process.argv[2] || 1200);
const st = n => `section.bloque:nth-of-type(${n + 1}) .stage`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: W, height: 900 } });
  const errs = []; p.on("pageerror", e => errs.push(e.message)); p.on("console", m => m.type() === "error" && errs.push(m.text()));
  await p.goto("http://localhost:8765/clases/11-agentes-aplicados.html", { waitUntil: "networkidle" }); await p.waitForTimeout(600);
  const shot = async (n, nom) => p.locator(st(n)).screenshot({ path: path.join(OUT, `m8-${W}-${nom}.png`) });
  const r = {};
  await shot(1, "1-inicial");
  await p.click('[data-agente="0"] [data-w="0"]'); await p.click('[data-agente="1"] [data-w="1"]'); await shot(1, "1-cruzado");
  r.hud1 = await p.textContent("#hud1a") + " | " + await p.textContent("#hud1b");
  await shot(2, "2-inicial");
  await p.click('[data-idea="1"]'); await p.waitForTimeout(3500); await p.click('[data-ap="0"][data-v="0"]'); await p.click('[data-ap="1"][data-v="1"]'); await p.click('[data-ap="2"][data-v="1"]');
  await p.waitForTimeout(1200); await shot(2, "2-humano");
  r.hud2a = await p.textContent("#hud2");
  await p.uncheck("#h2b"); await p.click('#seg2 [data-e="mismo"]'); await p.click('[data-idea="2"]'); await p.waitForTimeout(4500); await shot(2, "2-sin-humano-mismo");
  r.hud2b = await p.textContent("#hud2");
  await shot(3, "3-inicial");
  await p.click('#seg3 [data-r="ac"]'); await p.waitForTimeout(2500); await shot(3, "3-acierto");
  r.hud3 = await p.textContent("#hud3");
  await shot(4, "4a-inicial");
  await p.fill("#b4p", "15"); await p.dispatchEvent("#b4p", "input"); await p.click("#bDA10"); await p.click("#bDA0"); await p.click("#b4abrir"); await p.waitForTimeout(800);
  await shot(4, "4a-pausa15"); await p.locator(".recuadro").screenshot({ path: path.join(OUT, `m8-${W}-4a-dopamina.png`) });
  r.hud4 = await p.textContent("#hud4");
  await p.click("#b4plat"); await shot(5, "4b-plataforma"); r.hud4b = await p.textContent("#hud4b");
  await p.click("#b4mia"); await shot(5, "4b-mia");
  r.ov = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
  console.log(JSON.stringify({ errs, ...r }, null, 1)); await b.close();
})();
