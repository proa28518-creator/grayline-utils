#!/usr/bin/env node
'use strict';
/* projects/story6-microwave/tools/board.cjs — board stills batch (one browser boot, many stills).
 * Same boot/warm-up path as `bin/heart still` (headless Chromium + swiftshader, window.suite.stills), but one boot
 * for the whole list. Stills only: no video, no frame sequences.
 *   node tools/board.cjs S01:1.0 S02:2.4 ...      -> out/board/S01.png ...
 *   env SCALE=0.5 for quick previews (writes out/board/preview/), CAPS=1 to keep captions burned in. */
const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');
const HEART = path.resolve(__dirname, '..', '..', '..');
const PROJ = path.resolve(__dirname, '..');
const _shim = path.join(require('os').tmpdir(), 'heart_server_shim.cjs');
fs.copyFileSync(path.join(HEART, 'server', 'server.js'), _shim);
const { createHeartServer } = require(_shim);

const sleep = ms => new Promise(r => setTimeout(r, ms));
const httpJson = url => new Promise((res, rej) => http.get(url, r => { let d = ''; r.on('data', c => d += c); r.on('end', () => { try { res(JSON.parse(d)); } catch (e) { rej(e); } }); }).on('error', rej));
function findChrome() {
  const cache = path.join(process.env.HOME || '', '.cache', 'ms-playwright');
  const dirs = fs.readdirSync(cache).filter(d => /^chromium-\d+$/.test(d)).sort().reverse();
  for (const d of dirs) { const p = path.join(cache, d, 'chrome-linux64', 'chrome'); if (fs.existsSync(p)) return p; }
  throw new Error('no chromium');
}

(async () => {
  const jobs = process.argv.slice(2).map(a => { const [id, t] = a.split(':'); return { id, t: Number(t) }; });
  if (!jobs.length) { console.error('usage: board.cjs S01:1.0 ...'); process.exit(1); }
  const scale = Number(process.env.SCALE || 1);
  const outDir = path.join(PROJ, 'out', 'board', scale < 1 ? 'preview' : '');
  fs.mkdirSync(outDir, { recursive: true });
  const { server, port } = await createHeartServer({ projectDir: PROJ, uiDir: path.join(HEART, 'ui'), port: 0 });
  const dbg = 9300 + Math.floor(Math.random() * 500);
  const url = 'http://127.0.0.1:' + port + '/project/__suite/cartoon.html?mode=render';
  const proc = spawn(findChrome(), ['--headless=new', '--no-sandbox', '--no-proxy-server', '--use-gl=angle', '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--disable-dev-shm-usage', '--remote-debugging-port=' + dbg,
    '--window-size=1080,1920', url], { stdio: 'ignore' });
  const logs = [];
  try {
    let target = null;
    for (let i = 0; i < 60 && !target; i++) { try { target = (await httpJson('http://127.0.0.1:' + dbg + '/json/list')).find(x => x.type === 'page' && x.url.includes('cartoon.html')); } catch (e) {} if (!target) await sleep(1000); }
    if (!target) throw new Error('page did not appear');
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
    let id = 1; const pending = new Map();
    ws.onmessage = ev => { const m = JSON.parse(ev.data);
      if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
      if (m.method === 'Runtime.consoleAPICalled') { const s = m.params.args.map(a => a.value ?? a.description ?? '').join(' '); if (/error|warn|outfit|fail/i.test(s)) logs.push(s.slice(0, 300)); }
      if (m.method === 'Runtime.exceptionThrown') logs.push('EXC ' + JSON.stringify(m.params.exceptionDetails).slice(0, 400)); };
    const cdp = (method, params) => new Promise(res => { const i = id++; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params: params || {} })); });
    const ev = async (expression) => { const m = await cdp('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
      if (m.result && m.result.exceptionDetails) throw new Error(JSON.stringify(m.result.exceptionDetails).slice(0, 500));
      return m.result && m.result.result ? m.result.result.value : undefined; };
    await cdp('Runtime.enable');
    const deadline = Date.now() + 300000;
    for (;;) { const st = await ev('({ ready: window.ready === true, err: window.bootError || null })').catch(() => ({}));
      if (st.ready) break; if (st.err) throw new Error('boot: ' + st.err); if (Date.now() > deadline) throw new Error('boot timeout'); await sleep(1000); }
    await ev('window.suite.stills([0.05], 0.25)');
    await sleep(6000);
    const caps = process.env.CAPS === '1' ? '{}' : '{ captions: false }';
    for (const j of jobs) {
      const t0 = Date.now();
      const urls = await ev(`window.suite.stills([${j.t}], ${scale}, ${caps})`);
      if (!urls || !urls[0]) { console.log('FAIL', j.id, j.t); continue; }
      const f = path.join(outDir, j.id + '.png');
      fs.writeFileSync(f, Buffer.from(String(urls[0]).split(',')[1], 'base64'));
      console.log('OK', j.id, 't=' + j.t, f, ((Date.now() - t0) / 1000).toFixed(1) + 's');
    }
    const errs = await ev('JSON.stringify(window.suite.errors ? window.suite.errors() : [])').catch(() => '[]');
    if (errs && errs !== '[]') console.log('SUITE ERRORS', String(errs).slice(0, 2000));
    ws.close();
  } catch (e) { console.log('ERROR', e.message); process.exitCode = 1; }
  finally { if (logs.length) console.log('LOGS\n' + [...new Set(logs)].slice(0, 30).join('\n')); proc.kill('SIGKILL'); server.close(); }
})();
