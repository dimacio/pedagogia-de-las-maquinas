// Prueba de interacciones de las páginas del pre curso (0a, 0b, 0c).
// uso: NODE_PATH=<node_modules con playwright> node build/test_precurso.js 0a|0b|0c [ancho]
const { chromium } = require('playwright');
const BASE = 'http://localhost:8765/clases/';
const OUT = __dirname + '/shots/';

async function centro(p, sel, fx = .5, fy = .5) {
  const b = await p.locator(sel).boundingBox(); return [b.x + b.width * fx, b.y + b.height * fy];
}
async function shot(p, sel, nombre) {
  await p.locator(sel).first().scrollIntoViewIfNeeded();
  await p.waitForTimeout(150);
  const bloque = p.locator(sel).first().locator('xpath=ancestor::section[1]');
  await bloque.screenshot({ path: OUT + nombre + '.png' });
}

const PRUEBAS = {
  '0a': ['00a-python.html', async p => {
    // 1: editar el texto (romper el borde, luego abrir atajo)
    await p.fill('#ta', (await p.inputValue('#ta')).replace(/^#/, '.'));
    console.log('1 inválido:', await p.textContent('#hud1'));
    await p.click('#b1reset'); await p.click('#b1abrir');
    console.log('1 atajo:', await p.textContent('#hud1'));
    await shot(p, '#cv1', 'it-0a-1');
    // 2: pasar el mouse por una casilla
    const [x, y] = await centro(p, '#cv2', .3, .5); await p.mouse.move(x, y);
    console.log('2:', await p.textContent('#hud2')); await shot(p, '#cv2', 'it-0a-2');
    // 3: moverse
    for (const a of ['Abajo', 'Abajo', 'Derecha']) await p.click(`.flechas [aria-label="${a}"]`);
    console.log('3:', (await p.textContent('#code3')).split('\n')[1]); await shot(p, '#cv3', 'it-0a-3');
    // 4: salida verde -> rojo, mover slider
    await p.click('.seg [data-q="salida"]');
    await p.$eval('#sR', e => { e.value = 255; e.dispatchEvent(new Event('input')); });
    await p.$eval('#sG', e => { e.value = 0; e.dispatchEvent(new Event('input')); });
    console.log('4:', await p.textContent('#hud4')); await shot(p, '#cv4', 'it-0a-4');
    // 5: correr 500 partidas
    await p.selectOption('#selN', '500'); await p.waitForTimeout(2500);
    console.log('5:', await p.textContent('#hud5')); await shot(p, '#cv5a', 'it-0a-5');
  }],
  '0b': ['00b-probabilidad.html', async p => {
    await p.$eval('#slip1', e => { e.value = .4; e.dispatchEvent(new Event('input')); });
    await p.click('#b1n10000'); await p.waitForTimeout(300);
    console.log('1:', await p.textContent('#hud1')); await shot(p, '#cv1', 'it-0b-1');
    await p.$eval('#slip2', e => { e.value = .5; e.dispatchEvent(new Event('input')); });
    await p.waitForTimeout(400);
    console.log('2:', await p.textContent('#hud2')); await shot(p, '#cv2', 'it-0b-2');
    await p.click('#b3'); await p.waitForTimeout(1500);
    console.log('3:', await p.textContent('#hud3')); await shot(p, '#cv3', 'it-0b-3');
    for (const a of ['Derecha', 'Derecha', 'Abajo', 'Derecha']) await p.click(`#acc4 [aria-label="${a}"]`);
    console.log('4:', await p.textContent('#hud4')); await shot(p, '#cv4', 'it-0b-4');
    await p.$eval('#g5', e => { e.value = .7; e.dispatchEvent(new Event('input')); });
    console.log('5:', await p.textContent('#hud5')); await shot(p, '#cv5', 'it-0b-5');
    await p.click('#modo5 [data-m="azar"]'); await p.check('#costo5');
    console.log('5 azar:', await p.textContent('#hud5')); await shot(p, '#cv5', 'it-0b-5-azar');
  }],
  '0c': ['00c-algebra.html', async p => {
    await p.click('#b1'); await p.waitForTimeout(1600);
    await shot(p, '#cv1', 'it-0c-1');
    const [x, y] = await centro(p, '#cv2a', .45, .45); await p.mouse.click(x, y);
    console.log('2:', await p.textContent('#hud2')); await shot(p, '#cv2a', 'it-0c-2');
    for (let i = 0; i < 6; i++) await p.click('#b3');
    console.log('3:', await p.textContent('#hud3')); await shot(p, '#cv3', 'it-0c-3');
    await p.$eval('#g4', e => { e.value = .99; e.dispatchEvent(new Event('input')); });
    console.log('4:', await p.textContent('#hud4')); await shot(p, '#cv4a', 'it-0c-4');
    await p.click('#b5'); await p.waitForTimeout(1500);
    console.log('5:', await p.textContent('#hud5')); await shot(p, '#cv5', 'it-0c-5');
  }]
};

(async () => {
  const [id, w = '1200'] = process.argv.slice(2), [archivo, prueba] = PRUEBAS[id];
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: +w, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto(BASE + archivo, { waitUntil: 'networkidle' }); await p.waitForTimeout(500);
  try { await prueba(p); } catch (e) { errs.push('PRUEBA: ' + e.message); }
  console.log(JSON.stringify({ errs })); await b.close();
})();
