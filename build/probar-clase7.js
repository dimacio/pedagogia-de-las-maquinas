// Prueba de interacción de la clase 9: una interacción por bloque, captura de cada .stage.
// uso: node build/probar-clase7.js [ancho]
const path = require("path");
const PW = process.env.PW || "/tmp/claude-0/-home-claude/c0892404-b462-53b0-ae0f-c95d40b227f9/scratchpad/node_modules/playwright";
const { chromium } = require(PW);
const OUT = path.join(__dirname, "shots"), W = +(process.argv[2] || 1200);
const st = n => `section.bloque:nth-of-type(${n + 1}) .stage`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: W, height: 900 } });
  const errs = []; p.on("pageerror", e => errs.push(e.message)); p.on("console", m => m.type() === "error" && errs.push(m.text()));
  await p.goto("http://localhost:8765/clases/09-agentes-mundo-real.html", { waitUntil: "networkidle" }); await p.waitForTimeout(600);
  const shot = async (n, nom) => p.locator(st(n)).screenshot({ path: path.join(OUT, `t7-${W}-${nom}.png`) });
  const t0 = Date.now();
  await shot(1, "1-inicial");
  await p.click("#b1anim"); for (let i = 0; i < 4; i++) await p.click("#b1paso"); await shot(1, "1-pasos");
  await shot(2, "2-inicial");
  await p.click("#m2lar"); await p.click("#b2fin"); await shot(2, "2-largo");
  await p.fill("#b2g", "0.7"); await p.dispatchEvent("#b2g", "input"); await p.click("#b2fin"); await shot(2, "2-g07");
  await shot(3, "3-inicial");
  await p.fill("#b3d", "1"); await p.dispatchEvent("#b3d", "input"); await p.fill("#b3n", "1"); await p.dispatchEvent("#b3n", "input");
  await p.click("#b3reg"); await p.waitForTimeout(2500); await shot(3, "3-optima-n20");
  await p.fill("#b3e", "0.1"); await p.dispatchEvent("#b3e", "input"); await shot(4, "3b-eps01");
  await p.locator("#cv4").scrollIntoViewIfNeeded(); await p.evaluate(() => scrollBy(0, -120)); const c = await p.locator("#cv4").boundingBox();
  const pos = await p.evaluate(() => document.getElementById("cv4")._pos.pea);
  await p.mouse.click(c.x + pos[0], c.y + pos[1]); await shot(5, "4-pearl");
  const sel = await p.evaluate(() => document.querySelector('#hitos li[aria-current="true"]').dataset.id);
  const ov = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
  console.log(JSON.stringify({ errs, horizontalOverflow: ov, seleccionado: sel, ms: Date.now() - t0 })); await b.close();
})();
