// Renderiza difusion/posts/src/post-XX.html a difusion/posts/post-XX.png (1080×1350) y arma grilla.png.
// uso: node build/render_posts.js [n ...]   (servidor local en http://localhost:8765)
const path = require("path");
let playwright;
try { playwright = require("playwright"); }
catch { playwright = require("/tmp/claude-0/-home-claude/c0892404-b462-53b0-ae0f-c95d40b227f9/scratchpad/node_modules/playwright"); }
const BASE = process.env.BASE || "http://localhost:8765/difusion/posts/";
const OUT = path.resolve(__dirname, "../difusion/posts");
(async () => {
  const pedidos = process.argv.slice(2).map(Number);
  const nums = pedidos.length ? pedidos : Array.from({ length: 12 }, (_, i) => i + 1);
  const b = await playwright.chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
  const errs = []; p.on("pageerror", e => errs.push(e.message)); p.on("console", m => m.type() === "error" && errs.push(m.text()));
  for (const n of nums) {
    const id = String(n).padStart(2, "0");
    await p.goto(`${BASE}src/post-${id}.html`, { waitUntil: "networkidle" });
    await p.waitForFunction(() => window.LISTO === true, null, { timeout: 15000 });
    await p.waitForTimeout(200);
    const desborde = await p.evaluate(() => [...document.querySelectorAll(".post > *")].some(el => { const r = el.getBoundingClientRect(); return r.right > 1080 - 89 + 1 && el.scrollWidth > el.clientWidth + 1 || r.bottom > 1350; }));
    await p.screenshot({ path: `${OUT}/post-${id}.png`, clip: { x: 0, y: 0, width: 1080, height: 1350 } });
    console.log(`post-${id}.png`, desborde ? "DESBORDE" : "ok");
  }
  // grilla de perfil: orden de Instagram (el último publicado arriba a la izquierda)
  const celdas = Array.from({ length: 12 }, (_, i) => 12 - i).map(k => `<img src="post-${String(k).padStart(2, "0")}.png?v=${Date.now()}">`).join("");
  await p.setViewportSize({ width: 1080, height: 1800 });
  await p.goto(`${BASE}src/post-01.html`);
  await p.setContent(`<html><head><base href="${BASE}"></head><body style="margin:0;background:#fff"><div style="display:grid;grid-template-columns:repeat(3,358px);gap:3px;width:1080px">${celdas}</div></body></html>`);
  await p.evaluate(() => Promise.all([...document.images].map(im => im.complete ? 0 : new Promise(r => im.onload = r))));
  await p.evaluate(() => document.querySelectorAll("img").forEach(im => { im.style.width = "358px"; im.style.height = "447.5px"; im.style.display = "block"; }));
  const h = await p.evaluate(() => document.body.scrollHeight);
  await p.screenshot({ path: `${OUT}/grilla.png`, clip: { x: 0, y: 0, width: 1080, height: h } });
  console.log("grilla.png", errs.length ? errs : "sin errores");
  await b.close();
})();
