const { chromium } = require('/tmp/claude-0/-home-claude/c0892404-b462-53b0-ae0f-c95d40b227f9/scratchpad/node_modules/playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1200, height: 900 } });
  await p.goto('http://localhost:8765/clases/08-aplicaciones.html'); await p.waitForTimeout(300);
  await (await p.$('#cv3')).scrollIntoViewIfNeeded();
  const c3 = await (await p.$('#cv3')).boundingBox(); console.log(c3, await p.evaluate(() => document.getElementById('cv3')._mapa));
  await p.mouse.click(c3.x + c3.width * 0.95, c3.y + c3.height * 0.85); console.log(await p.textContent('#hud3'), await p.inputValue('#b3b'));
  await b.close(); })();
