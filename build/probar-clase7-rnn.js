// Prueba de interacción de la clase 7 (redes recurrentes): una interacción por bloque, captura de cada .stage.
// Inyecta build/modulos_7.json en la entrada "7" de modulos.js (sin tocar el archivo) para ver también el cuestionario.
// uso: node build/probar-clase7-rnn.js [ancho]
const path = require("path"), fs = require("fs");
const PW = process.env.PW || "/tmp/claude-0/-home-claude/c0892404-b462-53b0-ae0f-c95d40b227f9/scratchpad/node_modules/playwright";
const { chromium } = require(PW);
const OUT = path.join(__dirname, "shots"), W = +(process.argv[2] || 1200);
const M7 = fs.readFileSync(path.join(__dirname, "modulos_7.json"), "utf8");
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: W, height: 900 } });
  const errs = []; p.on("pageerror", e => errs.push(e.message)); p.on("console", m => m.type() === "error" && errs.push(m.text()));
  await p.route("**/assets/modulos.js", async r => { const res = await r.fetch(); const js = await res.text(); await r.fulfill({ response: res, body: js + `\nwindow.MODULOS["7"] = ${M7};` }); });
  await p.goto("http://localhost:8765/clases/07-redes-recurrentes.html", { waitUntil: "networkidle" }); await p.waitForTimeout(900);
  const st = n => p.locator("section.bloque").nth(n).locator(".stage");
  const shot = async (n, nom) => st(n).screenshot({ path: path.join(OUT, `c7-${W}-${nom}.png`) });
  const res = {};
  // 1. Markov: tres pasos y clic en una casilla
  await p.click("#b1paso"); await p.click("#b1paso"); await p.click("#b1paso");
  const c1 = await p.locator("#cv1").boundingBox(); await p.mouse.click(c1.x + c1.width * 0.6, c1.y + c1.height * 0.25);
  for (let i = 0; i < 5; i++) await p.click("#b1paso");
  res.b1 = await p.textContent("#hud1"); await shot(0, "1-markov");
  // 2. bigotes: dos movimientos con memoria y cambiar a sin memoria
  await p.click('#dpad2 [data-a="0"]'); await p.click('#dpad2 [data-a="0"]'); res.b2con = await p.textContent("#hud2"); await shot(1, "2-con");
  await p.click('#seg2 [data-m="sin"]'); await shot(1, "2-sin");
  // 3. n-gramas: n = 8 y esperar la animación
  await p.fill("#b3n", "8"); await p.dispatchEvent("#b3n", "input"); await p.waitForTimeout(2500); res.b3 = await p.textContent("#hud3"); await shot(2, "3-n8");
  // 4. RNN: escribir "la pa", elegir columna, generar
  await p.fill("#b4txt", "la pa"); res.b4pa = await p.textContent("#hud4"); await p.fill("#b4txt", "el pa"); res.b4epa = await p.textContent("#hud4");
  await p.click("#b4reset"); await p.click("#b4gen"); await p.waitForTimeout(4500); res.b4gen = await p.inputValue("#b4txt"); await shot(3, "4-gen");
  // 5. agente: otra salida donde se traba, al final
  await p.click("#b5atasco"); await p.waitForTimeout(300); await p.click("#b5play"); await p.click("#b5paso"); for (let i = 0; i < 12; i++) await p.click("#b5paso");
  res.b5 = await p.textContent("#hud5"); await shot(4, "5-agente");
  // 6. puente: tocar una letra y pasar a transformer
  const c6 = await p.locator("#cv6").boundingBox(); await p.mouse.click(c6.x + 36 + 16 * 12 + 4, c6.y + 176); res.b6 = await p.textContent("#hud6"); await shot(5, "6-rnn");
  await p.click('#seg6 [data-m="tr"]'); await shot(5, "6-tr");
  // cuestionario inyectado
  res.preguntas = await p.locator("#cuestionario fieldset").count(); res.objetivos = await p.locator(".antes-obj li").count();
  const ov = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
  console.log(JSON.stringify({ errs, horizontalOverflow: ov, ...res }, null, 1)); await b.close();
})();
