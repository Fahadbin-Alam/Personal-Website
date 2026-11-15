// End-to-end smoke test: plays the main paths in a headless browser and fails on any page error.
//   node test/smoke.js        (needs Playwright: npm i -D playwright && npx playwright install chromium)
const { chromium } = require('playwright');
const path = require('path');
const { pathToFileURL } = require('url');
const URL = pathToFileURL(path.join(__dirname, '..', 'index.html')).href;

let failed = 0;
const check = (ok, what, got) => { console.log((ok ? '  ok    ' : '  FAIL  ') + what + (ok || got === undefined ? '' : '  → ' + JSON.stringify(got))); if (!ok) failed++; };

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1100, height: 760 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const state = () => page.evaluate(() => ({ st, started, x: me.x, y: me.y, panel: $('entry').style.display === 'flex' ? $('entry-h').textContent : '', line: typ, crystals: $('prog').textContent.trim() }));
  const skipDialogue = () => page.evaluate(() => { let n = 0; while (st === 'dlg' && n++ < 60) next(); });
  const waitFor = async (fn, ms = 30000) => { const t = Date.now(); while (Date.now() - t < ms) { if (await page.evaluate(fn)) return true; await page.waitForTimeout(100); } return false; };

  await page.goto(URL); await page.waitForTimeout(400);
  let s = await state();
  check(s.st === 'title' && !s.started, 'opens on the start screen', s);

  await page.keyboard.press('r'); await page.waitForTimeout(200);
  const resume = await page.evaluate(() => $('entry-b').innerText);
  check(/RÉSUMÉ/.test((await state()).panel) && /Muslimo/.test(resume) && /82nd Airborne Division/.test(resume) && /Drexel University/.test(resume), 'R shows the text résumé before the game starts');
  await page.keyboard.press('Escape'); await page.waitForTimeout(150);

  await page.click('#go'); await page.waitForTimeout(700);
  s = await state(); check(s.started && s.st === 'dlg' && /Welcome/.test(s.line), 'PLAY starts the game with a welcome line', s);
  await skipDialogue();

  const y0 = (await state()).y;
  await page.keyboard.down('ArrowUp'); await page.waitForTimeout(900); await page.keyboard.up('ArrowUp'); await page.waitForTimeout(400);
  s = await state(); check(s.st === 'walk' && s.y < y0, 'arrow keys walk up the road', [y0, s.y]);

  await page.keyboard.press('Escape'); await page.waitForTimeout(200);
  const menu = await page.evaluate(() => [...document.querySelectorAll('#menu .mi')].map(e => e.textContent));
  check(menu.length === 8 && menu[0] === 'RÉSUMÉ' && menu.includes('PARACHUTE JUMP'), 'Esc opens the menu', menu);
  await page.keyboard.press('Escape'); await page.waitForTimeout(150);

  await page.evaluate(() => { enterInterior('lab'); place(5, 5, 'up'); }); await page.waitForTimeout(300);
  await page.keyboard.press('Enter'); await page.waitForTimeout(700);
  s = await state(); check(s.st === 'panel' && /PROJECTS/.test(s.panel) && /1\/3/.test(s.crystals), 'a crystal in the Workshop opens and is counted', [s.panel, s.crystals]);
  await page.keyboard.press('Escape'); await page.waitForTimeout(400);
  await page.evaluate(() => exitInterior()); await page.waitForTimeout(300);

  await page.evaluate(() => startJump());
  check(await waitFor(() => st === 'jump' && J && J.ph === 'fly'), 'the helicopter takes off');
  check(await waitFor(() => J && J.ok), 'the light turns green over town');
  await page.keyboard.press('Enter');
  check(await waitFor(() => J && J.ph === 'chute', 5000), 'Enter jumps and the parachute opens');
  await page.keyboard.down('ArrowDown');
  const landed = await waitFor(() => st === 'dlg', 40000);
  await page.keyboard.up('ArrowDown');
  s = await state(); check(landed && /AIRBORNE!/.test(s.line), 'the jump ends in a landing', s.line);
  await skipDialogue();
  s = await state(); check(s.st === 'walk' && await page.evaluate(() => !solid(me.x, me.y)), 'and leaves the visitor standing on walkable ground', s);

  const links = await page.evaluate(() => { contactCard(); return [...document.querySelectorAll('#entry-b a')].map(a => a.getAttribute('href')); });
  check(links.length >= 6 && links.every(h => /^(https:\/\/|mailto:|tel:)/.test(h)), 'contact card links are well formed', links);

  check(errors.length === 0, 'no page errors', errors);
  await browser.close();
  console.log(failed ? `\n${failed} check(s) failed` : '\nall checks passed');
  process.exit(failed ? 1 : 0);
})();
