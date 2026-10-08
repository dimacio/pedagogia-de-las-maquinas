// Prueba de interacciones de difusion/estrategia.html (una por bloque) y capturas recortadas.
let pw; try { pw = require("playwright"); } catch { pw = require("/tmp/claude-0/-home-claude/c0892404-b462-53b0-ae0f-c95d40b227f9/scratchpad/node_modules/playwright"); }
const OUT = __dirname + "/shots/";
(async () => {
  const b = await pw.chromium.launch();
  for (const w of [1200, 400]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    const errs = []; p.on("pageerror", e => errs.push(e.message));
    await p.goto("http://localhost:8765/difusion/estrategia.html", { waitUntil: "networkidle" });
    await p.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
    await p.reload({ waitUntil: "networkidle" });
    // 1: organismo con R bajo -> se apaga
    await p.fill("#sR", "0.6"); await p.dispatchEvent("#sR", "change"); await p.waitForTimeout(3500);
    const hud1 = await p.textContent("#hudOrg");
    await (await p.$("section.bloque:nth-of-type(2)")).screenshot({ path: OUT + `est-b1-${w}.png` });
    // 2: pesos -> solo guardados
    for (const [id, v] of [["#wG", "10"], ["#wC", "0"], ["#wV", "0"]]) { await p.fill(id, v); }
    const hud2 = await p.textContent("#hudRec");
    await (await p.$("section.bloque:nth-of-type(3)")).screenshot({ path: OUT + `est-b2-${w}.png` });
    await p.fill("#wG", "1"); await p.fill("#wC", "3"); await p.fill("#wV", "5");
    // 3: thompson hasta 36
    await p.click("#bTS0"); await p.click("#bTS36");
    const hud3 = await p.textContent("#hudTS");
    await (await p.$("section.bloque:nth-of-type(4)")).screenshot({ path: OUT + `est-b3-${w}.png` });
    // 4: ejemplo + persistencia
    await p.click("#bEj"); await p.click("#bCopiar");
    const ver = await p.textContent("#veredicto");
    await p.reload({ waitUntil: "networkidle" });
    const persist = await p.inputValue('input[data-i="0"][data-k="0"]');
    await (await p.$("section.bloque.full")).screenshot({ path: OUT + `est-b4-${w}.png` });
    console.log(w, JSON.stringify({ errs, hud1, hud2, hud3, ver, persist }));
  }
  await b.close();
})();
