import { chromium } from 'playwright';
import os from 'node:os';
import path from 'node:path';

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
  return page.evaluate(() => [...document.querySelectorAll('button')].find(x => /^(chat|task)$/i.test((x.innerText || '').trim()))?.innerText.trim() || null);
}
async function launch(headless) { return chromium.launchPersistentContext(profile, { headless, timeout: 60000, args: ['--no-sandbox'] }); }
async function open(context) { const page = context.pages()[0] || await context.newPage(); await page.goto('https://gemini.google.com/', { waitUntil: 'domcontentloaded', timeout: 60000 }); await sleep(3000); return page; }
try {
  if (command === 'probe') {
    let context;
    try { context = await launch(true); const page = await open(context); emit({ ok: true, ...await detect(page) }); }
    catch (error) { emit({ ok: false, error: 'gemini_driver_unavailable', detail: String(error.message || error) }); }
    finally { await context?.close().catch(() => {}); }
  } else if (command === 'connect') {
    let context;
    try { context = await launch(false); const page = await open(context); const end = Date.now() + 600000; while (Date.now() < end) { const state = await detect(page); if (state.signedIn) { emit({ ok: true, signedIn: true, account: state.account, email: state.email }); break; } await sleep(5000); } if (Date.now() >= end) emit({ ok: false, error: 'gemini_signin_timeout', signedIn: false }); }
    catch (error) { emit({ ok: false, error: 'gemini_no_display', detail: String(error.message || error) }); }
    finally { await context?.close().catch(() => {}); }
  } else if (command === 'ask') {
    let prompt = ''; for await (const chunk of process.stdin) prompt += chunk;
    let context;
    try { try { context = await launch(false); } catch (_) { context = await launch(true); } const page = await open(context); const state = await detect(page); if (!state.signedIn) { emit({ ok: false, error: 'gemini_seat_not_signed_in' }); } else {
      if (await clickNewChat(page)) await sleep(700);
      let mode = await readMode(page);
      if (!mode) { emit({ ok: false, error: 'gemini_task_mode_unavailable' }); } else {
        if (/^chat$/i.test(mode)) { await clickExactText(page, ['Chat']); await sleep(300); await clickExactText(page, ['Task']); await sleep(300); }
        mode = await readMode(page);
        if (!/^task$/i.test(mode || '')) emit({ ok: false, error: 'gemini_task_mode_unavailable' }); else {
          const composer = page.locator('div[contenteditable="true"],rich-textarea [contenteditable="true"]').first(); try { await composer.fill(prompt); } catch (_) { await composer.click(); await page.keyboard.insertText(prompt); } const started = Date.now(); await composer.press('Enter'); let previous = '', stable = 0, answer = '', done = false;
          for (let i=0; i<90; i++) { await sleep(2000); answer = await page.locator('model-response').last().innerText().catch(() => ''); const stopping = await page.getByRole('button', { name: /stop/i }).count().catch(() => 0); if (answer && !stopping && answer === previous) stable++; else stable=0; if (stable >= 2) { done=true; break; } previous=answer; }
          if (!done) emit({ ok: false, error: 'gemini_response_timeout' }); else emit({ ok: true, text: answer, account: state.account, email: state.email, model: state.model, mode: 'Task', elapsedMs: Date.now()-started });
        }
      }
    } } catch (error) { emit({ ok: false, error: 'gemini_ask_failed', detail: String(error.message || error) }); }
    finally { await context?.close().catch(() => {}); }
  } else emit({ ok: false, error: 'invalid_command' });
} catch (error) { emit({ ok: false, error: 'gemini_driver_unavailable', detail: String(error.message || error) }); }
