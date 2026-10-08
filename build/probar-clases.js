// Prueba de interacción de las páginas de clase 2–4: hace clic/teclas en cada bloque y captura los .stage.
// uso: node build/probar-clases.js <1|2|3> [ancho]
const path = require("path");
const PW = process.env.PW || "/tmp/claude-0/-home-claude/c0892404-b462-53b0-ae0f-c95d40b227f9/scratchpad/node_modules/playwright";
const { chromium } = require(PW);
const OUT = path.join(__dirname, "shots");
const BASE = "http://localhost:8765/clases/";

const PRUEBAS = {
  "1": { archivo: "02-que-es-rl.html", pasos: async p => {
    await p.click("#cicloPaso"); await p.click("#cicloPaso"); await p.click("#cicloPaso");
    await shot(p, "#b-ciclo .stage", "ciclo-pasos");
    await p.click("#cvJuego"); for (const k of ["ArrowDown", "ArrowDown", "ArrowLeft", "ArrowDown", "ArrowRight"]) await p.keyboard.press(k);
    await shot(p, "#b-historia .stage", "juego-facil");
    await p.click('#segMem button[data-m="dificil"]'); await p.click('.dpad .l'); await p.waitForTimeout(120);
    await shot(p, "#b-historia .stage", "juego-dificil-destello");
    await p.click("#mkA"); await p.waitForTimeout(1600); await shot(p, "#b-markov .stage", "markov-A");
    await p.click('#segMarkov button[data-m="bigotes"]'); await shot(p, "#b-markov .stage", "markov-bigotes");
    const b = await p.locator("#cvMarkov").boundingBox(); await p.mouse.click(b.x + b.width * (8.5 / 14), b.y + b.height * (3.5 / 10));
    await shot(p, "#b-markov .stage", "markov-bigotes-clic");
    await p.click('#segRec button[data-r="aprendizaje"]'); await shot(p, "#b-tutor .stage", "tutor-aprendizaje");
    await p.click('#segRec button[data-r="acierto"]'); await p.fill("#slTuya", "70"); await p.dispatchEvent("#slTuya", "input");
    await shot(p, "#b-tutor .stage", "tutor-tuya70");
  } },
  "2": { archivo: "03-mdp-y-bellman.html", pasos: async p => {
    await p.fill("#slGamma", "0.5"); await p.dispatchEvent("#slGamma", "input"); await shot(p, "#b-gamma .stage", "gamma-05");
    await p.fill("#slEval", "20"); await p.dispatchEvent("#slEval", "input"); await shot(p, "#b-eval .stage", "eval-20");
    await p.fill("#slCosto", "0.01"); await p.dispatchEvent("#slCosto", "input");
    await p.fill("#slG3", "1"); await p.dispatchEvent("#slG3", "input"); await shot(p, "#b-vi .stage", "vi-g1-costo");
    await p.fill("#slCosto", "0"); await p.dispatchEvent("#slCosto", "input"); await shot(p, "#b-vi .stage", "vi-g1-sincosto");
    await p.click("#piEval"); await p.click("#piMejorar"); await p.click("#piEval"); await p.click("#piMejorar");
    await shot(p, "#b-pi .stage", "pi-2mejoras");
    await p.click("#piFin"); await shot(p, "#b-pi .stage", "pi-final");
    await p.click("#slipOtras"); await p.waitForTimeout(1600); await shot(p, "#b-slip .stage", "slip-otras");
  } },
  "3": { archivo: "04-aprender-sin-mapa.html", pasos: async p => {
    await p.click("#mcJugar"); await p.waitForTimeout(2500); await shot(p, "#b-mctd .stage", "mctd-jugando");
    await p.click("#mcRapido"); await shot(p, "#b-mctd .stage", "mctd-50mas");
    for (let i = 0; i < 4; i++) await p.click("#qPaso");
    await shot(p, "#b-q .stage", "q-4pasos");
    await p.fill("#slEps", "0.4"); await p.dispatchEvent("#slEps", "input"); await p.click("#svqEntrenar"); await p.waitForTimeout(3500);
    await shot(p, "#b-svq .stage", "sarsa-q-eps04");
    await p.click('#segVis button[data-v="temprano"]'); await shot(p, "#b-vis .stage", "visitas-1-50");
  } }
};
async function shot(p, sel, nombre) { await p.locator(sel).screenshot({ path: path.join(OUT, `t${CL}-${W}-${nombre}.png`) }); }
const CL = process.argv[2], W = +(process.argv[3] || 1200);
(async () => {
  const pr = PRUEBAS[CL];
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: W, height: 900 } });
  const errs = []; p.on("pageerror", e => errs.push(e.message)); p.on("console", m => m.type() === "error" && errs.push(m.text()));
  await p.goto(BASE + pr.archivo, { waitUntil: "networkidle" }); await p.waitForTimeout(500);
  const t0 = Date.now(); await pr.pasos(p);
  const ov = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
  console.log(JSON.stringify({ errs, horizontalOverflow: ov, ms: Date.now() - t0 })); await b.close();
})();
