// Carga assets/cueva.js y assets/modulos.js en un sandbox mínimo y escribe en stdout {clases, modulos} como JSON.
// uso: node leer_js.js <raiz>            -> {clases, modulos}
//      node leer_js.js <raiz> args       -> lee de stdin un JSON [texto, ...] con los argumentos literales de
//                                           Cueva.pagina(...) y devuelve [[id, opciones] | {error}, ...]
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const raiz = process.argv[2] || ".";

if (process.argv[3] === "args") {
  const textos = JSON.parse(fs.readFileSync(0, "utf8"));
  const out = textos.map(t => {
    try { return vm.runInNewContext(`[${t}]`, {}, { timeout: 1000 }); }
    catch (e) { return { error: String(e.message || e) }; }
  });
  process.stdout.write(JSON.stringify(out));
  process.exit(0);
}

const estilo = { getPropertyValue: () => "" };
const elem = () => ({ style: {}, appendChild() {}, prepend() {}, after() {}, setAttribute() {}, addEventListener() {}, querySelector: () => null, querySelectorAll: () => [] });
const ventana = {
  document: { documentElement: elem(), body: elem(), querySelector: () => null, querySelectorAll: () => [], createElement: elem },
  getComputedStyle: () => estilo, addEventListener() {}, matchMedia: () => ({ matches: false }),
  localStorage: { getItem: () => null, setItem() {} }, Image: function () {}, devicePixelRatio: 1, console
};
ventana.window = ventana;
const ctx = vm.createContext(ventana);
for (const f of ["assets/modulos.js", "assets/cueva.js"]) {
  vm.runInContext(fs.readFileSync(path.join(raiz, f), "utf8"), ctx, { filename: f });
}
if (!ventana.Cueva || !Array.isArray(ventana.Cueva.CLASES)) { console.error("assets/cueva.js no definió window.Cueva.CLASES"); process.exit(2); }
if (!ventana.MODULOS || typeof ventana.MODULOS !== "object") { console.error("assets/modulos.js no definió window.MODULOS"); process.exit(2); }
process.stdout.write(JSON.stringify({ clases: ventana.Cueva.CLASES, modulos: ventana.MODULOS }));
