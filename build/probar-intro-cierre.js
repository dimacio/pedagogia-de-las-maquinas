// Prueba de interacción de las clases 1 y 12: un clic por bloque y captura de cada .stage.
// Inyecta build/modulos_1.json y build/modulos_12.json en window.MODULOS para ver el cuestionario.
// uso: node build/probar-intro-cierre.js [ancho]
const fs = require("fs"), path = require("path");
const PW = process.env.PW || "/tmp/claude-0/-home-claude/c0892404-b462-53b0-ae0f-c95d40b227f9/scratchpad/node_modules/playwright";
const { chromium } = require(PW);
const OUT = path.join(__dirname, "shots"), W = +(process.argv[2] || 1200);
const extra = `;window.MODULOS["1"]=${fs.readFileSync(path.join(__dirname, "modulos_1.json"))};window.MODULOS["12"]=${fs.readFileSync(path.join(__dirname, "modulos_12.json"))};`;
const shot = async (p, sel, n) => { await p.waitForTimeout(150); await p.locator(sel).screenshot({ path: path.join(OUT, `ic-${W}-${n}.png`) }); };
(async () => {
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: W, height: 900 } });
  const errs = []; p.on("pageerror", e => errs.push(e.message)); p.on("console", m => m.type() === "error" && errs.push(m.text()));
  await p.route("**/assets/modulos.js", async r => { const res = await r.fetch(); r.fulfill({ response: res, body: (await res.text()) + extra }); });
  await p.goto("http://localhost:8765/clases/01-introduccion.html", { waitUntil: "networkidle" });
  await p.click("#bFeedMas"); await shot(p, "#freire .stage", "c1-feed");
  await p.click('#segFreire button[data-m="cueva"]'); await p.click("#cvCueva");
  for (const k of ["ArrowDown", "ArrowDown", "ArrowRight", "ArrowLeft", "ArrowLeft"]) await p.keyboard.press(k);
  await shot(p, "#freire .stage", "c1-cueva");
  await p.click("#bPlat"); await shot(p, "#foucault .stage", "c1-dia-plataforma");
  await p.click("#bMia"); await p.fill("#wA", "1"); await p.dispatchEvent("#wA", "input"); await shot(p, "#foucault .stage", "c1-dia-propio");
  await p.fill("#sFid", "1"); await p.dispatchEvent("#sFid", "input"); await p.dispatchEvent("#sFid", "change");
  const bb = (await p.locator("#cvMeme").scrollIntoViewIfNeeded(), await p.locator("#cvMeme").boundingBox()); await p.mouse.click(bb.x + bb.width * 12.5 / 25, bb.y + bb.height * 5.5 / 13);
  await p.waitForTimeout(3500); await shot(p, "#dawkins .stage", "c1-meme");
  await p.click('#segVia button[data-v="codigo"]'); await shot(p, "#cursada", "c1-cursada");
  await shot(p, "#cuestionario", "c1-quiz");
  await p.goto("http://localhost:8765/clases/12-cierre.html", { waitUntil: "networkidle" });
  for (const k of [3, 6, 9, 12]) { await p.click(`#paradas button[data-k="${k}"]`); await shot(p, "#b-mapa .stage", "c12-mapa-" + k); }
  await p.click("#bEjemplo"); await shot(p, "#b-proyecto .stage", "c12-proyecto");
  const pb = (await p.locator("#cvPosts").scrollIntoViewIfNeeded(), await p.locator("#cvPosts").boundingBox()); await p.mouse.click(pb.x + pb.width * 9.5 / 12, pb.y + 60);
  await p.waitForTimeout(500); await shot(p, "#b-difusion .stage", "c12-posts");
  const qb = (await p.locator("#cvQuien").scrollIntoViewIfNeeded(), await p.locator("#cvQuien").boundingBox()); await p.mouse.click(qb.x + qb.width * 12.5 / 14, qb.y + qb.height * 1.5 / 10);
  await shot(p, "#b-quien .stage", "c12-quien-vos");
  await p.fill("#sG", "0.3"); await p.dispatchEvent("#sG", "input"); await shot(p, "#b-quien .stage", "c12-quien-g03");
  await shot(p, "#cuestionario", "c12-quiz");
  console.log(JSON.stringify({ W, errs })); await b.close();
})();
