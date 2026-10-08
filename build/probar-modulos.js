// Prueba del cuestionario y de "Antes de empezar" (assets/modulos.js + Cueva.pagina).
// uso: node build/probar-modulos.js [id-archivo] (servidor en http://localhost:8765)
const { chromium } = require("playwright");
const archivo = process.argv[2] || "02-que-es-rl";
const OUT = __dirname + "/shots/mooc/";
(async () => {
  const b = await chromium.launch();
  for (const w of [1200, 400]) {
    const ctx = await b.newContext({ viewport: { width: w, height: 900 } });
    const p = await ctx.newPage(); const errs = [];
    p.on("pageerror", e => errs.push(e.message)); p.on("console", m => m.type() === "error" && errs.push(m.text()));
    await p.goto(`http://localhost:8765/clases/${archivo}.html`, { waitUntil: "networkidle" });
    await p.screenshot({ path: `${OUT}${archivo}-top-${w}.png` });
    // correctas según los datos, salvo la pregunta 2 (se responde mal a propósito)
    const n = await p.$$eval("#cuestionario fieldset.q", fs => fs.length);
    const modId = await p.evaluate(() => Cueva.CLASES.find(c => location.pathname.endsWith(c.archivo)).id);
    const corr = await p.evaluate(id => MODULOS[id].cuestionario.map(q => q.correcta), modId);
    // primero: corregir con una sin responder
    await p.click(`#cuestionario fieldset[data-q="0"] input[value="${corr[0]}"]`);
    await p.click("#cuestionario [data-accion=corregir]");
    const msgFalta = await p.textContent("#cuestionario .quiz-res");
    for (let i = 1; i < n; i++) {
      const v = i === 1 ? (corr[i] + 1) % 4 : corr[i];
      await p.click(`#cuestionario fieldset[data-q="${i}"] input[value="${v}"]`);
    }
    await p.click("#cuestionario [data-accion=corregir]");
    const res = await p.textContent("#cuestionario .quiz-res");
    const prog = await p.textContent("[data-progreso] b");
    const q = await p.$("#cuestionario");
    await q.screenshot({ path: `${OUT}${archivo}-quiz-${w}.png` });
    await (await p.$("#actividad")).screenshot({ path: `${OUT}${archivo}-pares-${w}.png` });
    // recargar: debe restaurar la corrección y el progreso
    await p.reload({ waitUntil: "networkidle" });
    const res2 = await p.textContent("#cuestionario .quiz-res");
    const prog2 = await p.textContent("[data-progreso] b");
    const ov = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
    // volver a intentar
    await p.click("#cuestionario [data-accion=reiniciar]");
    const marcadas = await p.$$eval("#cuestionario input:checked", x => x.length);
    console.log(JSON.stringify({ w, errs, msgFalta, res, prog, res2, prog2, marcadasTrasReiniciar: marcadas, horizontalOverflow: ov }));
    await ctx.close();
  }
  await b.close();
})();
