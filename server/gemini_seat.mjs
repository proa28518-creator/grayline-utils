import { chromium } from 'playwright';
import os from 'node:os';
import path from 'node:path';
import net from 'node:net';

const profile = path.join(os.homedir(), '.config', 'heart-studio', 'gemini-profile');
const command = process.argv[2];
const emit = value => process.stdout.write(JSON.stringify(value) + '\n');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
function detect(page) {
  return page.evaluate(() => {
    const accountButton = [...document.querySelectorAll('button,[role="button"]')].find(x => /Google Account:/.test(x.getAttribute('aria-label') || ''));
    const label = accountButton?.getAttribute('aria-label') || '';
    const match = label.match(/Google Account:\s*(.*?)\s*\(([^()]+@[^()]+)\)/);
    const signedIn = !!match && !/accounts\.google\.com/.test(location.href) && ![...document.querySelectorAll('a,button,[role="button"]')].some(x => /^sign in$/i.test((x.innerText || x.getAttribute('aria-label') || '').trim()));
    const composer = document.querySelector('rich-textarea,div[contenteditable="true"]');
    const modelButton = [...document.querySelectorAll('button,[role="button"]')].find(x => composer && (x.compareDocumentPosition(composer) & Node.DOCUMENT_POSITION_FOLLOWING) && /Hydrogen|Gemini/i.test(x.innerText || ''));
    return { signedIn, account: match?.[1]?.trim() || null, email: match?.[2]?.trim() || null, model: modelButton?.innerText?.trim() || null };
  });
}
async function clickExactText(page, texts, { roles } = {}) {
  return page.evaluate(({ texts, roles }) => {
    const allowed = roles ? new Set(roles) : null;
    const wanted = texts.map(text => text.trim().toLowerCase());
    const element = [...document.querySelectorAll('button,[role="button"],[role="option"],[role="menuitem"]')].find(x => {
      const role = x.getAttribute('role') || (x.tagName.toLowerCase() === 'button' ? 'button' : '');
      return (!allowed || allowed.has(role)) && wanted.includes((x.innerText || '').trim().toLowerCase());
    });
    if (!element) return false;
    element.click();
    return true;
  }, { texts, roles });
}
async function clickNewChat(page) {
  return page.evaluate(() => {
    const element = [...document.querySelectorAll('button,[role="button"],[role="option"],[role="menuitem"]')].find(x =>
      /new chat/i.test((x.getAttribute('aria-label') || '') + ' ' + (x.innerText || ''))
    );
    if (!element) return false;
    element.click();
    return true;
  });
}
async function readMode(page) {
  return page.evaluate(() => {
    const segments = [...document.querySelectorAll('gem-segmented-button')];
    for (const name of ['Chat', 'Task']) {
      const host = segments.find(x => (x.querySelector('button')?.innerText || '').trim() === name);
      const button = host?.querySelector('button');
      if (button?.getAttribute('aria-pressed') === 'true' || host?.classList.contains('gem-segmented-button-selected')) return name;
    }
    return null;
  });
}
async function waitForModeControl(page, timeout = 60000) {
  const end = Date.now() + timeout;
  while (Date.now() < end) {
    const present = await page.evaluate(() => !!document.querySelector('gem-segmented-button') || [...document.querySelectorAll('button')].some(x => /^(chat|task)$/i.test((x.innerText || '').trim())));
    if (present) return true;
    await sleep(500);
  }
  return false;
}
async function selectTaskMode(page) {
  return page.evaluate(() => {
    const host = [...document.querySelectorAll('gem-segmented-button')].find(x => (x.querySelector('button')?.innerText || '').trim() === 'Task');
    const button = host?.querySelector('button') || [...document.querySelectorAll('button')].find(x => (x.innerText || '').trim() === 'Task');
    if (!button) return false;
    button.click();
    return true;
  });
}
const proxyUrl = process.env.HTTPS_PROXY || process.env.https_proxy || process.env.ALL_PROXY || process.env.all_proxy || process.env.HTTP_PROXY || process.env.http_proxy;
async function startRelay(value) {
  const upstream = new URL(value);
  const server = net.createServer(client => {
    let buffered = Buffer.alloc(0), upstreamSocket, done = false;
    const fail = () => { if (done) return; done = true; client.destroy(); upstreamSocket?.destroy(); };
    client.on('error', fail);
    const onClientData = chunk => {
      buffered = Buffer.concat([buffered, chunk]);
      handle();
    };
    client.on('data', onClientData);
    function handle() {
      if (done) return;
      const end = buffered.indexOf('\r\n\r\n');
      if (end < 0) return;
      client.removeListener('data', onClientData);
      const head = buffered.subarray(0, end).toString('latin1');
      const lines = head.split('\r\n');
      if (!/^CONNECT\s/i.test(lines[0])) { done = true; client.end('HTTP/1.1 405 Method Not Allowed\r\nConnection: close\r\nContent-Length: 0\r\n\r\n'); return; }
      const headers = lines.slice(1).filter(line => !/^proxy-authorization:/i.test(line));
      if (upstream.username || upstream.password) {
        const credentials = `${decodeURIComponent(upstream.username)}:${decodeURIComponent(upstream.password)}`;
        headers.push(`Proxy-Authorization: Basic ${Buffer.from(credentials).toString('base64')}`);
      }
      upstreamSocket = net.connect(Number(upstream.port || 80), upstream.hostname, () => {
        upstreamSocket.write(`${lines[0]}\r\n${headers.join('\r\n')}\r\n\r\n`);
        const rest = buffered.subarray(end + 4);
        if (rest.length) upstreamSocket.write(rest);
        let response = Buffer.alloc(0);
        const onResponse = chunk => {
          response = Buffer.concat([response, chunk]);
          const responseEnd = response.indexOf('\r\n\r\n');
          if (responseEnd < 0) return;
          upstreamSocket.removeListener('data', onResponse);
          client.write(response);
          const status = response.subarray(0, responseEnd).toString('latin1');
          if (/^HTTP\/\d(?:\.\d)?\s+2\d\d/i.test(status)) {
            client.pipe(upstreamSocket); upstreamSocket.pipe(client);
            client.on('close', () => upstreamSocket.destroy());
            upstreamSocket.on('close', () => client.destroy());
          } else { done = true; client.end(); upstreamSocket.end(); }
        };
        upstreamSocket.on('data', onResponse);
      });
      upstreamSocket.on('error', fail);
    }
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  return { server, port: server.address().port };
}
async function launch(headless) {
  if (!proxyUrl) return chromium.launchPersistentContext(profile, { headless, timeout: 60000, args: ['--no-sandbox'] });
  const relay = await startRelay(proxyUrl);
  try {
    const context = await chromium.launchPersistentContext(profile, { headless, timeout: 60000, args: ['--no-sandbox'], proxy: { server: `http://127.0.0.1:${relay.port}` }, ignoreHTTPSErrors: true });
    context.__geminiRelay = relay.server;
    return context;
  } catch (error) { relay.server.close(); throw error; }
}
async function close(context) { await context?.close().catch(() => {}); context?.__geminiRelay?.close(); }
async function open(context) { const page = context.pages()[0] || await context.newPage(); await page.goto('https://gemini.google.com/', { waitUntil: 'domcontentloaded', timeout: 60000 }); await sleep(3000); return page; }
try {
  if (command === 'probe') {
    let context;
    try { context = await launch(true); const page = await open(context); emit({ ok: true, ...await detect(page) }); }
    catch (error) { emit({ ok: false, error: 'gemini_driver_unavailable', detail: String(error.message || error) }); }
    finally { await close(context); }
  } else if (command === 'connect') {
    let context;
    try { context = await launch(false); const page = await open(context); const end = Date.now() + 600000; while (Date.now() < end) { const state = await detect(page); if (state.signedIn) { emit({ ok: true, signedIn: true, account: state.account, email: state.email }); break; } await sleep(5000); } if (Date.now() >= end) emit({ ok: false, error: 'gemini_signin_timeout', signedIn: false }); }
    catch (error) { emit({ ok: false, error: 'gemini_no_display', detail: String(error.message || error) }); }
    finally { await close(context); }
  } else if (command === 'ask') {
    let prompt = ''; for await (const chunk of process.stdin) prompt += chunk;
    let context;
    try { try { context = await launch(false); } catch (_) { context = await launch(true); } const page = await open(context); let state = await detect(page); if (!state.signedIn) { emit({ ok: false, error: 'gemini_seat_not_signed_in' }); } else {
      if (await clickNewChat(page)) await sleep(700);
      if (!await waitForModeControl(page)) { emit({ ok: false, error: 'gemini_task_mode_unavailable' }); } else {
        let mode = await readMode(page);
        if (mode !== 'Task') {
          if (await selectTaskMode(page)) {
            const end = Date.now() + 10000;
            while (Date.now() < end && (mode = await readMode(page)) !== 'Task') await sleep(500);
          }
        }
        mode = await readMode(page);
        state = await detect(page);
        if (!/^task$/i.test(mode || '')) emit({ ok: false, error: 'gemini_task_mode_unavailable' }); else {
          const composer = page.locator('div[contenteditable="true"],rich-textarea [contenteditable="true"]').first(); try { await composer.fill(prompt); } catch (_) { await composer.click(); await page.keyboard.insertText(prompt); } const started = Date.now(); await composer.press('Enter'); let previous = '', stable = 0, answer = '', done = false;
          for (let i=0; i<90; i++) { await sleep(2000); answer = await page.locator('model-response').last().innerText().catch(() => ''); const stopping = await page.getByRole('button', { name: /stop/i }).count().catch(() => 0); if (answer && !stopping && answer === previous) stable++; else stable=0; if (stable >= 2) { done=true; break; } previous=answer; }
          if (!done) emit({ ok: false, error: 'gemini_response_timeout' }); else emit({ ok: true, text: answer, account: state.account, email: state.email, model: state.model, mode: 'Task', elapsedMs: Date.now()-started });
        }
      }
    } } catch (error) { emit({ ok: false, error: 'gemini_ask_failed', detail: String(error.message || error) }); }
    finally { await close(context); }
  } else emit({ ok: false, error: 'invalid_command' });
} catch (error) { emit({ ok: false, error: 'gemini_driver_unavailable', detail: String(error.message || error) }); }
