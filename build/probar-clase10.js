// Prueba de interacción de la clase 10: una interacción por bloque y captura de cada .stage.
// Inyecta build/modulos_10.json en window.MODULOS para ver "Antes de empezar", el cuestionario y la actividad.
// uso: node build/probar-clase10.js [ancho]
const path = require("path"), fs = require("fs");
const PW = process.env.PW || "/tmp/claude-0/-home-claude/c0892404-b462-53b0-ae0f-c95d40b227f9/scratchpad/node_modules/playwright";
const { chromium } = require(PW);
const OUT = path.join(__dirname, "shots"), W = +(process.argv[2] || 1200);
const M10 = fs.readFileSync(path.join(__dirname, "modulos_10.json"), "utf8");
const st = n => n - 2;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: W, height: 900 } });
  const errs = []; p.on("pageerror", e => errs.push(e.message)); p.on("console", m => m.type() === "error" && errs.push(m.text()));
  await p.route("**/assets/modulos.js", async r => { const res = await r.fetch(); const body = (await res.text()) + `\nObject.assign(window.MODULOS, ${M10});`; r.fulfill({ response: res, body }); });
  await p.goto("http://localhost:8765/clases/10-agentes-de-lenguaje.html", { waitUntil: "networkidle" }); await p.waitForTimeout(700);
  const shot = async (n, nom) => p.locator("section.bloque .stage").nth(st(n)).screenshot({ path: path.join(OUT, `c10-${W}-${nom}.png`) });
  const r = {};
  // bloque 1: temperatura y muestreo
  await shot(2, "1-inicial");
  await p.click('#ch1 [data-i="2"]'); await p.fill("#sT", "0.3"); await p.dispatchEvent("#sT", "input"); await p.click("#b1many"); await shot(2, "1-cuenta-T03");
  r.hud1 = await p.textContent("#hud1");
  await p.fill("#sT", "1.8"); await p.dispatchEvent("#sT", "input"); await p.click("#b1many"); await shot(2, "1-cuenta-T18");
  // bloque 2: grupo, clic en una recompensa, G, mini cueva
  await shot(3, "2-inicial"); r.hud2a = await p.textContent("#hud2");
  const box = await p.locator("#cv2").boundingBox(); await p.mouse.click(box.x + box.width * 0.5 + 10, box.y + 22 + 26 * 3 + 12);
  r.hud2b = await p.textContent("#hud2"); await shot(3, "2-clic");
  await p.click('#ch2 [data-i="6"]'); await p.fill("#sG", "6"); await p.dispatchEvent("#sG", "input"); await shot(3, "2-cueva"); r.hud2c = await p.textContent("#hud2");
  // bloque 3: bucle
  await p.click('#ch3 [data-i="1"]'); await p.click("#b3step"); await p.waitForTimeout(1100); await p.click("#b3step"); await p.waitForTimeout(500);
  await shot(4, "3-paso2"); r.hud3 = await p.textContent("#hud3");
  await p.click("#b3all"); await shot(4, "3-todo");
  // bloque 4: ventana chica
  await p.fill("#sV", "400"); await p.dispatchEvent("#sV", "input"); await p.click('#seg4 [data-m="1"]'); await shot(5, "4-ventana400"); r.hud4 = await p.textContent("#hud4");
  // bloque 5: verificador laxo + juez seguro
  await p.click('#seg5 [data-v="laxo"]'); await p.check("#c5"); await shot(6, "5-laxo"); r.hud5 = await p.textContent("#hud5"); r.juez = await p.textContent("#cap5j");
  r.quiz = await p.locator("#cuestionario fieldset").count();
  r.ov = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
  console.log(JSON.stringify({ errs, ...r }, null, 1)); await b.close();
})();
