'use strict';
/* Heart Studio — zero-dependency local server.
 * Serves the control UI (/), the project host page + files (/project/...),
 * and a small JSON API over <project>/panel_state.json.
 * State writes are serialized and atomic (tmp file + rename). */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const dispatchLayer = require('./dispatch');

const STEPS = ['write', 'add', 'run', 'build', 'mix', 'export'];
const SUBSTEPS = ['camera', 'environment', 'post', 'shading'];
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.glb': 'model/gltf-binary',
  '.wav': 'audio/wav', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.mp4': 'video/mp4',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.css': 'text/css', '.txt': 'text/plain',
  '.md': 'text/plain', '.bin': 'application/octet-stream'
};

function defaultState(projectDir) {
  let title = 'مشروع جديد';
  try {
    const pj = JSON.parse(fs.readFileSync(path.join(projectDir, 'project.json'), 'utf8'));
    if (pj && pj.title) title = pj.title;
  } catch (e) { /* no project.json — fine */ }
  let script = '';
  try { script = fs.readFileSync(path.join(projectDir, 'script.txt'), 'utf8'); } catch (e) { /* none */ }
  return {
    title, idea: '', script, scriptVersion: 1, voice: null,
    steps: { write: 'idle', add: 'idle', run: 'idle', build: 'idle', mix: 'idle', export: 'idle' },
    stepTimes: {},
    substeps: { camera: 'idle', environment: 'idle', post: 'idle', shading: 'idle' },
    approvals: [], finalFilm: null,
    log: [{ t: Date.now(), actor: 'system', text: 'تم إنشاء المشروع' }]
  };
}

function createHeartServer({ projectDir, uiDir, port = 8903 }) {
  const repoDir = path.resolve(__dirname, '..');
  const projectsDir = path.join(repoDir, 'projects');
  let activeDir = projectDir;
  let stateFile = path.join(activeDir, 'panel_state.json');
  let state;
  try {
    state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
    const d = defaultState(activeDir);
    state = Object.assign(d, state);
    state.steps = Object.assign(d.steps, state.steps || {});
    state.substeps = Object.assign(d.substeps, state.substeps || {});
  } catch (e) { state = defaultState(projectDir); }

  let chain = Promise.resolve();
  function persist() {
    const snapshot = JSON.stringify(state, null, 1);
    chain = chain.then(async () => {
      const tmp = stateFile + '.tmp.' + process.pid;
      await fs.promises.writeFile(tmp, snapshot);
      await fs.promises.rename(tmp, stateFile);
    }).catch(() => {});
    return chain;
  }
  function log(actor, text) { state.log.push({ t: Date.now(), actor, text }); }

  const jobs = new Map();
  let connectionCache = null;
  const connectionNames = ['GPT','Gemini','Opus','GLM'];
  const connectionEmpty = () => connectionNames.map(name => ({name,probed:false,status:'unprobed',checkedAt:null}));
  const timed = () => new Date().toISOString();
  function safeRun(bin,args,options={}) { return new Promise(resolve=>{ const p=spawn(bin,args,{...options,stdio:['ignore','pipe','pipe']}); let out='',err='';p.stdout.on('data',x=>out+=x);p.stderr.on('data',x=>err+=x);p.on('error',e=>resolve({code:1,out,err:e.message}));p.on('close',code=>resolve({code,out,err}));}); }
  async function probeConnections() {
    const results=[];
    const home=process.env.HOME||'';
    // Codex CLI output is inspected without returning auth material.
    let codex=process.env.CODEX_BIN; if(!codex||!fs.existsSync(codex)) codex=['/usr/lib/chatgpt/resources/codex',path.join(home,'workspace/tools/chatgpt-app/extracted/usr/lib/chatgpt/resources/codex')].find(fs.existsSync);
    let gpt={name:'GPT',probed:true,checkedAt:timed(),status:'dead',reason:'codex binary not found',authMetadata:null};
    try { if(codex) { const r=await safeRun(codex,['login','status'],{timeout:15000}); const signed=r.code===0&&/logged in|chatgpt|openai account/i.test(r.out+'\n'+r.err);gpt.status=signed?'connected':'dead';gpt.reason=signed?undefined:(r.code!==0?'Codex login status command failed':'Codex output did not indicate a ChatGPT login'); }
      const a=JSON.parse(fs.readFileSync(path.join(home,'.codex/auth.json'),'utf8'));gpt.authMetadata={auth_mode:a.auth_mode||null,last_refresh:a.last_refresh||null,has_tokens:Object.prototype.hasOwnProperty.call(a,'tokens')};
    } catch(e){gpt.metadataError='auth metadata unavailable';}
    results.push(gpt);
    let gem={name:'Gemini',probed:true,checkedAt:timed(),status:'unknown'};
    try {
      const db=path.join(home,'.config/gemini-desktop/Cookies');if(!fs.existsSync(db))throw new Error('Gemini Cookies database not found');
      const os=require('os'),{spawnSync}=require('child_process');
      const query="SELECT name FROM cookies WHERE host_key LIKE '%google.%' OR host_key LIKE '%.google.com';";
      const readNames=file=>spawnSync('sqlite3',[`file:${file}?immutable=1`,query],{encoding:'utf8',timeout:10000});
      let r=readNames(db);
      if(r.status!==0){
        const dir=fs.mkdtempSync(path.join(os.tmpdir(),'heart-gem-'));
        try { const copy=path.join(dir,'Cookies');fs.copyFileSync(db,copy);r=spawnSync('sqlite3',[copy,query],{encoding:'utf8',timeout:10000}); }
        finally { fs.rmSync(dir,{recursive:true,force:true}); }
      }
      if(r.status!==0)throw new Error(r.stderr||'sqlite read failed');
      const names=r.stdout.split(/\r?\n/);const found=names.some(n=>['__Secure-1PSID','__Secure-3PSID','SID'].includes(n));gem.status=found?'connected':'dead';gem.state=found?'connected':'awaiting_owner_signin';if(!found)gem.reason='سجّل دخول المالك في تطبيق Gemini desktop على هذا الجهاز';
    }
    catch(e){gem.status='unknown';gem.reason='تعذر قراءة قاعدة جلسة Gemini: '+String(e.message).slice(0,180);}results.push(gem);
    let opus={name:'Opus',probed:true,checkedAt:timed(),status:'dead'};
    try { const helper=path.join(home,'workspace/tools/opus_call.py'), envFile=path.join(home,'workspace/user/files/llmsrelay.env');let key='';const contents=fs.readFileSync(envFile,'utf8');const m=contents.match(/^\s*LLMSRELAY_API_KEY\s*=\s*(.*?)\s*$/m);if(m)key=m[1].replace(/^['"]|['"]$/g,'');if(!key)throw new Error('LLMSRELAY_API_KEY is missing');const dir=fs.mkdtempSync(path.join(require('os').tmpdir(),'heart-opus-probe-'));const prompt=path.join(dir,'prompt.txt'),out=path.join(dir,'out.txt');fs.writeFileSync(prompt,'Reply with exactly: OK');const r=await safeRun('python3',[helper,prompt,out,'32'],{env:{...process.env,LLMS_KEY:key},timeout:45000});const answer=fs.existsSync(out)?fs.readFileSync(out,'utf8'):r.out;opus.status=r.code===0&&answer.startsWith('OK')?'connected':'dead';if(opus.status==='dead')opus.reason='Opus ping did not return OK';fs.rmSync(dir,{recursive:true,force:true}); }
    catch(e){opus.reason='Opus probe failed: '+String(e.message).slice(0,180);}results.push(opus);
    let glm={name:'GLM',probed:true,checkedAt:timed(),status:'dead',model:'free/glm-5.3-flashx'};
    try {const r=await safeRun(process.execPath,[path.join(__dirname,'heart-cjs-runner.cjs'),'models']);const has=r.code===0&&(/free\/glm-5\.3\s+متاح:\s+نعم/i.test(r.out)||/has_glm_free["']?\s*:\s*true/i.test(r.out));glm.status=has?'connected':'dead';if(glm.status==='dead')glm.reason='APInex catalog did not report has_glm_free';}
    catch(e){glm.reason='APInex catalog probe failed: '+String(e.message).slice(0,180);}results.push(glm);
    connectionCache={checkedAt:timed(),connections:results};return connectionCache;
  }
  function safeProject(name) {
    if (!/^[a-zA-Z0-9_-]+$/.test(String(name || ''))) return null;
    const dir = path.join(projectsDir, String(name));
    try { if (fs.statSync(dir).isDirectory()) return dir; } catch (_) {}
    return null;
  }
  function inventory(dir, includeMetadata = false) {
    const exists = rel => fs.existsSync(path.join(dir, rel));
    const boardDir = path.join(dir, 'out', 'board');
    let board = [];
    try { board = fs.readdirSync(boardDir).filter(n => /\.(png|jpe?g|webp)$/i.test(n)); } catch (_) {}
    const script = ['script_owner_ar.md', 'script.txt', 'script.md'].find(exists) || null;
    const voice = ['voice_owner.wav', 'voice_ar.wav', 'audio/source.wav'].find(exists) || null;
    const timing = ['words_owner.txt', 'audio/clean.json', 'timings.json'].find(exists) || null;
    const master = ['out/story6_full.mp4', 'out/master.mp4', 'out/final.mp4'].find(exists) || null;
    let runInfo = null;
    for (const p of ['out/run-info.json', 'out/fleet/run-info.json']) try { runInfo = JSON.parse(fs.readFileSync(path.join(dir, p), 'utf8')); break; } catch (_) {}
    let baseSettings = {};
    try { baseSettings = JSON.parse(fs.readFileSync(path.join(dir, 'project.json'), 'utf8')).settings || {}; } catch (_) {}
    const captionsSetting = baseSettings.captions;
    const settings = { ...baseSettings, captions: { on: typeof captionsSetting === 'object' ? captionsSetting.on !== false : captionsSetting !== false }, fps: Number(baseSettings.fps) === 24 ? 24 : 30 };
    let masterMetadata = null;
    if (master && includeMetadata) {
      const r = require('child_process').spawnSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=r_frame_rate,width,height', '-of', 'json', path.join(dir, master)], { encoding: 'utf8', timeout: 5000 });
      try { const stream = JSON.parse(r.stdout).streams[0]; masterMetadata = { fps: stream.r_frame_rate, width: stream.width, height: stream.height }; } catch (_) {}
    }
    return { name: path.basename(dir), title: (() => { try { return JSON.parse(fs.readFileSync(path.join(dir, 'project.json'), 'utf8')).title || path.basename(dir); } catch (_) { return path.basename(dir); } })(), script, voice, timing, boardCount: board.length, board: board.slice(0, 24), master, masterMetadata, baseSettings, settings, runInfo };
  }
  function projectGit(dir) {
    const { spawnSync } = require('child_process');
    if (!fs.existsSync(path.join(dir, '.git'))) return [];
    const r = spawnSync('git', ['-C', dir, 'log', '-8', '--date=iso-strict', '--pretty=format:%H%x09%h%x09%ad%x09%s'], { encoding: 'utf8' });
    return r.status === 0 ? r.stdout.split('\n').filter(Boolean).map(line => { const [hash, short, date, ...msg] = line.split('\t'); return { hash, short, date, message: msg.join('\t') }; }) : [];
  }
  function artifactChecks(dir) {
    const inv = inventory(dir);
    let timingValid = false;
    for (const timingFile of ['audio/clean.json', 'timings.json']) {
      try {
        const t = JSON.parse(fs.readFileSync(path.join(dir, timingFile), 'utf8'));
        timingValid = Array.isArray(t) && t.length > 0 && t.every(x => Number.isFinite(Number(x.start)) && Number.isFinite(Number(x.end)) && Number(x.end) >= Number(x.start));
        if (timingValid) break;
      } catch (_) {}
    }
    if (!timingValid) {
      try {
        const text = fs.readFileSync(path.join(dir, 'words_owner.txt'), 'utf8');
        const rows = [...text.matchAll(/^\[(\d{2}):(\d{2}\.\d+)\s+-\s+(\d{2}):(\d{2}\.\d+)\]\s+\S+/gm)];
        timingValid = rows.length > 0 && rows.every((m, i) => {
          const start = Number(m[1]) * 60 + Number(m[2]), end = Number(m[3]) * 60 + Number(m[4]);
          const prevEnd = i ? Number(rows[i - 1][3]) * 60 + Number(rows[i - 1][4]) : -1;
          return end >= start && start >= prevEnd;
        });
      } catch (_) {}
    }
    const mix = ['out/mix_stage/audio/final_mix.wav', 'out/final_mix.wav', 'out/story6_mix.wav', 'out/mix.wav'].find(p => fs.existsSync(path.join(dir, p))) || null;
    const gates = [
      { id: 'script', label: 'النص موجود', pass: !!inv.script, evidence: inv.script || '—' },
      { id: 'voice', label: 'ملف الصوت الأصلي موجود كما هو', pass: !!inv.voice, evidence: inv.voice || '—' },
      { id: 'timing', label: 'ملف التوقيت موجود وقابل للقراءة', pass: timingValid, evidence: inv.timing || '—' },
      { id: 'board', label: 'لوحة اللقطات تحتوي صوراً', pass: inv.boardCount > 0, evidence: inv.boardCount + ' صورة' },
      { id: 'mix', label: 'ملف المكس النهائي موجود', pass: !!mix, evidence: mix || 'لا يوجد ملف معروف' },
      { id: 'master', label: 'ملف الماستر موجود', pass: !!inv.master, evidence: inv.master || '—' }
    ];
    return { checks: gates, pass: gates.every(x => x.pass), frameEvidence: inv.board, runInfo: inv.runInfo };
  }
  function donePredicate(key, kind) {
    if (kind === 'sub') return inventory(activeDir).boardCount > 0;
    const gates = artifactChecks(activeDir).checks;
    const map = { write: 'script', add: 'voice', run: 'timing', build: 'board', mix: 'mix', export: 'master' };
    const gateId = map[key];
    const gate = gates.find(x => x.id === gateId);
    if (!gate || !gate.pass) return false;
    if (key === 'export' && !artifactChecks(activeDir).pass) return false;
    return true;
  }
  function runCommand(id, dir, args, cwd = repoDir) {
    if (jobs.has(id) && !jobs.get(id).ended) throw new Error('هناك عملية تعمل بالفعل');
    const job = { id, projectDir: dir, status: 'running', log: [], startedAt: Date.now(), ended: false, child: null };
    jobs.set(id, job);
    const child = spawn(args[0], args.slice(1), { cwd, env: { ...process.env, HEART_HOME: repoDir, HEART_PROJECT: dir }, stdio: ['ignore', 'pipe', 'pipe'] });
    job.child = child;
    const add = (stream, chunk) => { const lines = String(chunk).split(/\r?\n/).filter(Boolean); for (const line of lines) job.log.push({ t: Date.now(), stream, text: line }); if (job.log.length > 500) job.log.splice(0, job.log.length - 500); };
    child.stdout.on('data', c => add('out', c)); child.stderr.on('data', c => add('err', c));
    child.on('error', e => { add('err', e.message); job.status = 'failed'; job.ended = true; job.exitCode = 1; });
      child.on('close', code => {
      job.exitCode = code;
      if (code !== 0) job.status = 'failed';
      else if (job.outputArtifact) {
        try { const stat=fs.statSync(job.outputArtifact);let ok=stat.isFile()&&stat.size>0;const fresh=stat.mtimeMs>=job.startedAt-2000;if(!fresh){ok=false;job.verification='artifact freshness failed: mtime predates job start';}if(job.action==='timing'&&ok){const report=JSON.parse(fs.readFileSync(job.outputArtifact,'utf8'));ok=report.ok===true;job.verification=ok?'timing report ok; '+report.entries+' entries':'timing report failed: '+(report.failures||[]).map(x=>x.name).join(', ');} else if(fresh)job.verification=ok?'artifact exists and is non-empty':'artifact predicate failed'; job.status = ok ? 'done' : 'failed'; }
        catch (_) { job.status = 'failed'; job.verification = 'artifact predicate failed'; }
      } else job.status = 'done';
      job.ended = true; job.finishedAt = Date.now();
    });
    return job;
  }

  function scriptSaved(newScript) {
    if (newScript === state.script) return;
    state.script = newScript;
    state.scriptVersion += 1;
    const later = ['run', 'build', 'mix', 'export'];
    const dirty = later.some(s => state.steps[s] !== 'idle') ||
      SUBSTEPS.some(s => state.substeps[s] !== 'idle') || state.approvals.length || state.finalFilm;
    if (dirty) {
      later.forEach(s => { state.steps[s] = 'idle'; delete state.stepTimes[s]; });
      SUBSTEPS.forEach(s => { state.substeps[s] = 'idle'; delete state.stepTimes['sub:' + s]; });
      state.approvals = []; state.finalFilm = null;
      log('system', 'أُعيد حفظ النص (الإصدار ' + state.scriptVersion + ') — أُعيد تعيين «تشغيل ومعالجة الصوت» وكل ما بعده');
    } else {
      log('owner', 'حفظ نص الفيلم — الإصدار ' + state.scriptVersion);
    }
  }

  function maybeCompleteBuild() {
    if (SUBSTEPS.every(s => state.substeps[s] === 'done') && state.steps.build !== 'done') {
      state.steps.build = 'done';
      state.stepTimes.build = state.stepTimes.build || {};
      state.stepTimes.build.end = Date.now();
      log('system', 'اكتملت مرحلة «بناء المشاهد» — كل الممرات الأربعة تمت');
    }
  }

  function setStepStatus(kind, key, status) {
    const map = kind === 'sub' ? state.substeps : state.steps;
    map[key] = status;
    const tk = kind === 'sub' ? 'sub:' + key : key;
    state.stepTimes[tk] = state.stepTimes[tk] || {};
    if (status === 'running') state.stepTimes[tk].start = Date.now();
    if (status === 'done' || status === 'failed') state.stepTimes[tk].end = Date.now();
    if (kind === 'sub') maybeCompleteBuild();
  }

  function sendJson(res, code, obj) {
    const body = JSON.stringify(obj);
    res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(body);
  }
  function readBody(req) {
    return new Promise((resolve, reject) => {
      let data = '';
      req.on('data', c => { data += c; if (data.length > 8 * 1024 * 1024) req.destroy(); });
      req.on('end', () => { try { resolve(data ? JSON.parse(data) : {}); } catch (e) { reject(e); } });
      req.on('error', reject);
    });
  }
  function serveFile(res, root, urlPath) {
    const p = path.normalize(path.join(root, decodeURIComponent(urlPath)));
    const normalizedRoot = path.normalize(root);
    if (p !== normalizedRoot && !p.startsWith(normalizedRoot + path.sep)) { res.writeHead(403); return res.end(); }
    fs.readFile(p, (err, data) => {
      if (err) { res.writeHead(404); return res.end('not found'); }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(p).toLowerCase()] || 'application/octet-stream' });
      res.end(data);
    });
  }

  const server = http.createServer(async (req, res) => {
    const u = new URL(req.url, 'http://x');
    const pn = u.pathname;
    try {
      if (pn === '/api/projects' && req.method === 'GET') {
        const names = fs.readdirSync(projectsDir, { withFileTypes: true }).filter(e => e.isDirectory()).map(e => inventory(path.join(projectsDir, e.name)));
        return sendJson(res, 200, names);
      }
      if (pn === '/api/connections' && req.method === 'GET') return sendJson(res,200,connectionCache||{checkedAt:null,connections:connectionEmpty()});
      if (pn === '/api/connections/probe' && req.method === 'POST') return sendJson(res,200,await probeConnections());
      if (pn === '/api/project' && req.method === 'GET') return sendJson(res, 200, { ...inventory(activeDir, true), path: path.relative(repoDir, activeDir), gates: artifactChecks(activeDir), history: projectGit(activeDir) });
      if (pn === '/api/select' && req.method === 'POST') {
        const b = await readBody(req);
        if (!/^[a-zA-Z0-9_-]+$/.test(String(b.name || ''))) return sendJson(res, 400, { error: 'اسم مشروع غير صالح' });
        const next = path.join(projectsDir, b.name);
        try { if (!fs.statSync(next).isDirectory()) throw new Error(); } catch (_) { return sendJson(res, 404, { error: 'المشروع غير موجود' }); }
        activeDir = next; stateFile = path.join(activeDir, 'panel_state.json');
        try { state = JSON.parse(fs.readFileSync(stateFile, 'utf8')); } catch (_) { state = defaultState(activeDir); }
        return sendJson(res, 200, { ...inventory(activeDir, true), path: path.relative(repoDir, activeDir), gates: artifactChecks(activeDir), history: projectGit(activeDir) });
      }
      if (pn === '/api/settings' && req.method === 'POST') {
        const b = await readBody(req);
        if (typeof b.captions !== 'boolean' || ![24, 30].includes(Number(b.fps))) return sendJson(res, 400, { error: 'الإعدادات المقبولة: captions و24/30 fps' });
        const file = path.join(activeDir, 'project.json'), pj = JSON.parse(fs.readFileSync(file, 'utf8'));
        pj.settings = { ...(pj.settings || {}), captions: { ...(typeof pj.settings?.captions === 'object' ? pj.settings.captions : {}), on: b.captions }, fps: Number(b.fps) };
        fs.writeFileSync(file, JSON.stringify(pj, null, 2) + '\n');
        return sendJson(res, 200, { ok: true, settings: pj.settings, note: 'الإعدادات محفوظة في project.json وسيتم تمريرها إلى heart still وGitHub Actions.' });
      }
      if (pn === '/api/history' && req.method === 'GET') return sendJson(res, 200, { available: fs.existsSync(path.join(activeDir, '.git')), commits: projectGit(activeDir) });
      if (pn === '/api/history/revert' && req.method === 'POST') {
        const b = await readBody(req), commits = projectGit(activeDir);
        if (!fs.existsSync(path.join(activeDir, '.git'))) return sendJson(res, 409, { error: 'لا يوجد مستودع Git لهذا المشروع' });
        if (!commits.some(c => c.hash === b.hash)) return sendJson(res, 400, { error: 'اللقطة ليست ضمن سجل هذا المشروع' });
        const r = require('child_process').spawnSync('git', ['-C', activeDir, 'revert', '--no-edit', b.hash], { encoding: 'utf8' });
        if (r.status !== 0) return sendJson(res, 409, { error: (r.stderr || r.stdout || 'تعذر التراجع').slice(0, 500) });
        return sendJson(res, 200, { ok: true, commits: projectGit(activeDir) });
      }
      if (pn === '/api/qc' && req.method === 'GET') return sendJson(res, 200, artifactChecks(activeDir));
      if (pn === '/api/annotations' && req.method === 'GET') return sendJson(res, 200, state.annotations || []);
      if (pn === '/api/annotations' && req.method === 'POST') {
        const b = await readBody(req);
        if (typeof b.frame !== 'string' || typeof b.change !== 'string' || !b.change.trim()) return sendJson(res, 400, { error: 'تحتاج الملاحظة إلى إطار ووصف تغيير' });
        const a = { id: 'fix-' + Date.now(), project: path.basename(activeDir), frame: b.frame, change: b.change.trim(), status: 'captured_unwired', t: Date.now() };
        state.annotations = state.annotations || []; state.annotations.push(a);
        await persist();
        return sendJson(res, 201, { ...a, note: 'حُفظت ملاحظة مرتبطة بالإطار؛ إعادتها إلى worker الإصلاح غير موصول بعد.' });
      }
      if (pn === '/api/job' && req.method === 'GET') {
        const j = jobs.get(u.searchParams.get('id'));
        if (!j) return sendJson(res, 404, { error: 'العملية غير موجودة' });
        return sendJson(res, 200, { id: j.id, project: path.basename(j.projectDir), status: j.status, startedAt: j.startedAt, finishedAt: j.finishedAt, exitCode: j.exitCode, log: j.log, waitingOn: j.waitingOn || 'لا شيء', runSettings: j.runSettings || null, verification: j.verification || null, runId:j.runId||null,legs:j.runSettings?.legs||null });
      }
      if (pn === '/api/stop' && req.method === 'POST') {
        const b = await readBody(req), j = jobs.get(b.id);
        if (!j || j.ended) return sendJson(res, 409, { error: 'لا توجد عملية تعمل' });
        if(j.runId){j.cancelRequested=true;dispatchLayer.gh(['run','cancel',j.runId]);return sendJson(res,200,{ok:true});}
        if(!j.child)return sendJson(res,409,{error:'لا توجد عملية تعمل'});
        j.status = 'stopping'; j.child.kill('SIGTERM'); setTimeout(() => { if (!j.ended) j.child.kill('SIGKILL'); }, 3000).unref();
        return sendJson(res, 200, { ok: true });
      }
      if (pn === '/api/action' && req.method === 'POST') {
        const b = await readBody(req), id = 'job-' + Date.now();
        if (b.action === 'preview') {
          const out = path.join(activeDir, 'out', 'board', 'ui-preview-' + Date.now() + '.png');
          fs.mkdirSync(path.dirname(out), { recursive: true });
          const seconds = Math.max(0, Math.min(55, Number(b.seconds) || 0));
          const j = runCommand(id, activeDir, [process.execPath, path.join(__dirname, 'heart-cjs-runner.cjs'), 'still', activeDir, String(seconds), out]);
          j.outputArtifact = out;
          j.action='preview'; const effective=inventory(activeDir).settings;
          return sendJson(res, 202, { id, status: j.status, output: path.relative(repoDir, out), settingsStatus: 'موصول', settings:effective });
        }
        if (['timing','sound'].includes(b.action)) {const artifact=b.action==='timing'?path.join(activeDir,'out/timing_report.json'):path.join(activeDir,'audio/sfx_bed.wav');const j=runCommand(id,activeDir,[process.execPath,path.join(__dirname,'heart-cjs-runner.cjs'),b.action,activeDir]);j.action=b.action;j.outputArtifact=artifact;return sendJson(res,202,{id,status:j.status,output:path.relative(repoDir,artifact)});}
        if (b.action === 'models') return sendJson(res, 202, { id, status: runCommand(id, activeDir, [process.execPath, path.join(__dirname, 'heart-cjs-runner.cjs'), 'models']).status });
        return sendJson(res, 501, { error: 'هذا المنفذ غير موجود: غير موصول بعد' });
      }
      if(pn==='/api/dispatch/runs'&&req.method==='GET'){
        const r=dispatchLayer.gh(['run','list','--limit','50','--json','databaseId,workflowName,status,conclusion,createdAt,displayTitle']);if(r.status!==0)return sendJson(res,502,{error:(r.stderr||'gh run list failed').slice(0,500)});
        const rows=JSON.parse(r.stdout||'[]'),projectName=u.searchParams.get('project');const selected=[];
        for(const row of rows){if(!/Fleet Render Chunk|fleet-render/i.test(row.workflowName||''))continue;if(projectName){const ar=dispatchLayer.gh(['api',`repos/${'proa28518-creator/grayline-utils'}/actions/runs/${row.databaseId}/artifacts`]);if(ar.status!==0)continue;const artifacts=JSON.parse(ar.stdout||'{}').artifacts||[];if(!artifacts.some(a=>a.name.startsWith('fleet-chunk-'+projectName+'-')))continue;}selected.push(row);}
        return sendJson(res,200,selected);
      }
      if(pn==='/api/colab-queue'&&req.method==='GET'){
        const file=path.join(activeDir,'out','colab_queue.json');try{return sendJson(res,200,{entries:JSON.parse(fs.readFileSync(file,'utf8'))});}catch(e){if(e.code==='ENOENT')return sendJson(res,200,{entries:[]});return sendJson(res,200,{entries:[],error:'تعذر قراءة colab_queue.json: '+e.message});}
      }
      if(pn==='/api/dispatch/stills'&&req.method==='POST'){
        const b=await readBody(req),dir=b.project?safeProject(b.project):activeDir;if(!dir)return sendJson(res,400,{error:'project غير صالح أو غير موجود'});const settings=b.settings||inventory(dir).settings;if(![24,30].includes(Number(settings.fps)))return sendJson(res,400,{error:'fps يجب أن يكون 24 أو 30'});const job={id:'dispatch-'+Date.now(),projectDir:dir,status:'queued',startedAt:Date.now(),ended:false,log:[],runSettings:{settings,spec:b.spec||'render:0:30'}};jobs.set(job.id,job);(async()=>{try{job.status='dispatched';const runId=await dispatchLayer.dispatchAsync('fleet-render.yml',{project:path.basename(dir),spec:b.spec||'render:0:30',settings:JSON.stringify(settings)});await dispatchLayer.monitor(job,{runId,projectDir:dir,kind:'stills',settingsSent:settings,repoDir});}catch(e){job.status='failed';job.ended=true;job.finishedAt=Date.now();job.log.push({t:Date.now(),stream:'err',text:e.message});}})();return sendJson(res,202,{id:job.id,status:job.status});
      }
      if(pn==='/api/dispatch/assembly'&&req.method==='POST'){
        const b=await readBody(req);if(!b.framesRunId&&!b.framesArtifact)return sendJson(res,400,{error:'مطلوب framesRunId أو framesArtifact كمصدر إطارات'});const dir=b.project?safeProject(b.project):activeDir;if(!dir)return sendJson(res,400,{error:'project غير صالح أو غير موجود'});if(![24,30].includes(Number(b.fps)))return sendJson(res,400,{error:'fps يجب أن يكون 24 أو 30'});const job={id:'assembly-'+Date.now(),projectDir:dir,status:'queued',startedAt:Date.now(),ended:false,log:[]};jobs.set(job.id,job);(async()=>{try{job.status='dispatched';const inputs={project:path.basename(dir),frames_artifact:b.framesArtifact||'',frames_run_id:b.framesRunId||'',fps:String(b.fps),mix_rel:b.mixRel||'',mode:'assemble'};const runId=await dispatchLayer.dispatchAsync('fleet-assembly.yml',inputs);await dispatchLayer.monitor(job,{runId,projectDir:dir,kind:'assembly',repoDir});}catch(e){job.status='failed';job.ended=true;job.finishedAt=Date.now();job.log.push({t:Date.now(),stream:'err',text:e.message});}})();return sendJson(res,202,{id:job.id,status:job.status});
      }
      if (pn === '/api/run' && req.method === 'POST') {
        const activeRun=Array.from(jobs.values()).find(job=>job.kind==='run'&&!job.ended&&job.projectDir===activeDir);
        if(activeRun)return sendJson(res,409,{error:`توجد عملية تشغيل جارية: ${activeRun.id}`});
        const b = await readBody(req), id = 'run-' + Date.now();
        const j = { id, kind: 'run', projectDir: activeDir, status: 'running', startedAt: Date.now(), ended: false, log: [], waitingOn: 'لا شيء' };
        jobs.set(id, j);
        j.runSettings={mode:b.mode==='faster'?'faster':'quality',model:b.model||'free/glm-5.3-flashx',effort:b.effort||'standard',settings:inventory(activeDir).settings,legs:[]};
        const leg=(id,state,detail)=>{const x={id,state,detail};j.runSettings.legs.push(x);j.log.push({t:Date.now(),stream:state==='failed'?'fail':state==='blocked'?'handoff':'pass',text:`${id}: ${state} — ${detail}`});return x;};
        const exists=p=>fs.existsSync(path.join(activeDir,p));
        (async()=>{
          const script=inventory(activeDir).script,voice=inventory(activeDir).voice;
          if(!script){leg('script','blocked','ملف النص غير موجود');j.status='blocked';j.waitingOn='script: ملف النص غير موجود';}
          else leg('script','verified',script+' موجود');
          if(j.status==='running'){if(!voice){leg('voice','blocked','ملف الصوت غير موجود؛ يُستخدم كما هو');j.status='blocked';j.waitingOn='voice: ملف narration الأصلي غير موجود';}else leg('voice','verified',voice+' موجود ويُستخدم كما هو');}
          if(j.status==='running'){
            const timing=runCommand(id+'-timing',activeDir,[process.execPath,path.join(__dirname,'heart-cjs-runner.cjs'),'timing',activeDir]);j.child=timing.child;const rp=path.join(activeDir,'out/timing_report.json');timing.outputArtifact=rp;timing.action='timing';await new Promise(resolve=>{const check=()=>timing.ended?resolve():setTimeout(check,100);check();});j.child=null;
            if(timing.status!=='done'){leg('timing','failed',timing.verification||'heart timing failed');j.status='failed';j.waitingOn='timing: '+(timing.verification||'فشل التحقق');}else leg('timing','executed',timing.verification);
          }
          if(j.status==='running'){
            let inv=inventory(activeDir);if(inv.boardCount){leg('board','verified',inv.boardCount+' صورة موجودة');}
            else if(b.dispatchStills){j.waitingOn='board: جاري إرسال اللقطات وانتظار GitHub Actions';try{const settings=inventory(activeDir).settings,remote={id:id+'-stills',projectDir:activeDir,status:'dispatched',startedAt:Date.now(),ended:false,log:[]};jobs.set(remote.id,remote);const rid=await dispatchLayer.dispatchAsync('fleet-render.yml',{project:path.basename(activeDir),spec:b.spec||'render:0:30',settings:JSON.stringify(settings)});remote.runId=rid;j.runId=rid;await dispatchLayer.monitor(remote,{runId:rid,projectDir:activeDir,kind:'stills',settingsSent:settings,repoDir});if(remote.status==='done'&&inventory(activeDir).boardCount>0)leg('board','executed',`GitHub Actions run ${rid}; ${inventory(activeDir).boardCount} downloaded stills verified`);else{leg('board','failed',`GitHub Actions run ${rid}: ${remote.verification||remote.status}`);j.status='failed';j.waitingOn='board: فشل dispatch أو لم تجتز اللقطات تحقق الملفات';}}catch(e){leg('board','failed','GitHub stills dispatch failed: '+e.message);j.status='failed';j.waitingOn='board: '+e.message;}}
            else{leg('board','blocked','اللوحة فارغة ولم يُطلب dispatchStills');j.status='blocked';j.waitingOn='board: اللوحة فارغة وطلب إرسال اللقطات غير موجود';}
          }
          if(j.status==='running'){
            const inputs=['audio/events.json','audio/beds.json','audio/timeline.json'],missing=inputs.filter(p=>!exists(p));const mix=['out/mix_stage/audio/final_mix.wav','out/final_mix.wav','out/story6_mix.wav','out/mix.wav'].find(exists);
            if(!missing.length){const sound=runCommand(id+'-sound',activeDir,[process.execPath,path.join(__dirname,'heart-cjs-runner.cjs'),'sound',activeDir]);j.child=sound.child;sound.outputArtifact=path.join(activeDir,'audio/sfx_bed.wav');await new Promise(resolve=>{const check=()=>sound.ended?resolve():setTimeout(check,100);check();});j.child=null;if(sound.status==='done')leg('sound','executed','audio/sfx_bed.wav verified');else{leg('sound','failed',sound.verification||'heart sound failed');j.status='failed';j.waitingOn='sound: '+(sound.verification||'فشل الصوت');}}
            else if(mix)leg('sound','verified','mix موجود مسبقاً: '+mix);
            else{leg('sound','blocked','مدخلات مفقودة: '+missing.join(', '));j.status='blocked';j.waitingOn='sound: المدخلات المفقودة '+missing.join(', ');}
          }
          if(j.status==='running'){const checks=artifactChecks(activeDir);checks.checks.forEach(c=>j.log.push({t:Date.now(),stream:c.pass?'pass':'fail',text:`${c.pass?'PASS':'FAIL'} ${c.id} — ${c.evidence}`}));if(!checks.pass){leg('gates','failed',checks.checks.filter(c=>!c.pass).map(c=>c.id).join(', '));j.status='failed';j.waitingOn='gates: '+checks.checks.filter(c=>!c.pass).map(c=>c.id).join(', ');}else leg('gates','verified','كل فحوصات الملفات مرت');}
          if(j.status==='running'){const master=inventory(activeDir).master;if(master)leg('export','verified',master+' موجود');else{leg('export','blocked','ملف الماستر غير موجود؛ أرسل التجميع إلى GitHub بشكل منفصل');j.status='blocked';j.waitingOn='export: master missing; GitHub assembly is a separate control';}}
          if(j.status==='running')j.status='done';j.ended=true;j.finishedAt=Date.now();if(!j.waitingOn)j.waitingOn='لا شيء';
        })().catch(e=>{j.status='failed';j.ended=true;j.finishedAt=Date.now();j.waitingOn=e.message;j.log.push({t:Date.now(),stream:'fail',text:e.message});});
        return sendJson(res, 202, { id, status: j.status, waitingOn: j.waitingOn });
      }
      if (pn === '/api/state' && req.method === 'GET') return sendJson(res, 200, state);
      if (pn === '/api/state' && req.method === 'POST') {
        const b = await readBody(req);
        if (typeof b.title === 'string') state.title = b.title;
        if (typeof b.idea === 'string') state.idea = b.idea;
        if (typeof b.script === 'string') scriptSaved(b.script);
        if ('voice' in b) state.voice = b.voice;
        if (b.steps) for (const k of STEPS) if (b.steps[k] && b.steps[k] !== 'done') setStepStatus('step', k, b.steps[k]);
        if (b.substeps) for (const k of SUBSTEPS) if (b.substeps[k] && b.substeps[k] !== 'done') setStepStatus('sub', k, b.substeps[k]);
        if ('finalFilm' in b) state.finalFilm = b.finalFilm;
        await persist();
        return sendJson(res, 200, state);
      }
      if (pn === '/api/log' && req.method === 'POST') {
        const b = await readBody(req);
        log(b.actor || 'agent', String(b.text || ''));
        await persist();
        return sendJson(res, 200, { ok: true });
      }
      if (pn === '/api/step' && req.method === 'POST') {           // owner's order
        return sendJson(res, 501, { error: 'لا يوجد منفذ لتنفيذ المحطات منفردة بعد؛ لا يتم تسجيل طلب وهمي.' });
      }
      if (pn === '/api/setstep' && req.method === 'POST') {        // agent write-back
        const b = await readBody(req);
        if (b.status === 'done' && !donePredicate(b.substep || b.step, b.substep ? 'sub' : 'step'))
          return sendJson(res, 409, { error: 'لا يمكن اعتماد done: شرط الأثر على القرص لم يمر' });
        if (b.substep && SUBSTEPS.includes(b.substep)) setStepStatus('sub', b.substep, b.status);
        else if (b.step && STEPS.includes(b.step)) setStepStatus('step', b.step, b.status);
        else return sendJson(res, 400, { error: 'step/substep غير معروف' });
        log('agent', 'حالة ' + (b.substep || b.step) + ' ← ' + b.status);
        await persist();
        return sendJson(res, 200, state);
      }
      if (pn === '/api/batch' && req.method === 'POST') {          // agent posts stills
        const b = await readBody(req);
        if (!SUBSTEPS.includes(b.substep) || !Array.isArray(b.frames))
          return sendJson(res, 400, { error: 'batch يحتاج substep و frames[]' });
        const fixRounds = state.approvals.filter(a => a.substep === b.substep && a.status === 'rejected').length;
        const batch = {
          id: 'b' + Date.now().toString(36) + Math.floor(Math.random() * 999),
          substep: b.substep, frames: b.frames, status: 'pending', reason: '', fixRounds, t: Date.now()
        };
        state.approvals.push(batch);
        setStepStatus('sub', b.substep, 'waiting_approval');
        log('agent', 'وصلت دفعة لقطات لمراجعة: ' + b.substep + ' (' + b.frames.length + ' لقطات)');
        await persist();
        return sendJson(res, 200, batch);
      }
      if (pn === '/api/approve' && req.method === 'POST') {
        const b = await readBody(req);
        const batch = state.approvals.find(a => a.id === b.id);
        if (!batch) return sendJson(res, 404, { error: 'الدفعة غير موجودة' });
        if (!donePredicate(batch.substep, 'sub')) return sendJson(res, 409, { error: 'لا يمكن اعتماد اللقطات: لا توجد صور board على القرص' });
        batch.status = 'approved'; batch.tDecision = Date.now();
        setStepStatus('sub', batch.substep, 'done');
        log('owner', 'وافق على لقطات: ' + batch.substep);
        await persist();
        return sendJson(res, 200, state);
      }
      if (pn === '/api/reject' && req.method === 'POST') {
        const b = await readBody(req);
        const batch = state.approvals.find(a => a.id === b.id);
        if (!batch) return sendJson(res, 404, { error: 'الدفعة غير موجودة' });
        batch.status = 'rejected'; batch.reason = String(b.reason || ''); batch.tDecision = Date.now();
        batch.fixRounds += 1;
        setStepStatus('sub', batch.substep, 'running');
        log('owner', 'رفض لقطات ' + batch.substep + (batch.reason ? ' — السبب: ' + batch.reason : '') + ' (جولة إصلاح ' + batch.fixRounds + ')');
        await persist();
        return sendJson(res, 200, state);
      }
      if (pn === '/api/voice' && req.method === 'POST') {
        const b = await readBody(req);
        state.voice = b.voice || null;
        log('agent', state.voice ? 'تم إرفاق ملف الصوت: ' + state.voice.name : 'أُزيل ملف الصوت');
        await persist();
        return sendJson(res, 200, state);
      }
      if (pn === '/api/film' && req.method === 'POST') {
        const b = await readBody(req);
        state.finalFilm = { url: b.url || '', duration: b.duration || 0, size: b.size || 0 };
        log('agent', 'الفيلم النهائي جاهز');
        await persist();
        return sendJson(res, 200, state);
      }
      if (pn === '/' ) return serveFile(res, uiDir, '/index.html');
      if (pn.startsWith('/ui/')) return serveFile(res, uiDir, pn.slice(3));
      if (pn.startsWith('/project/')) return serveFile(res, activeDir, pn.slice(8));
      res.writeHead(404); res.end('not found');
    } catch (e) {
      sendJson(res, 500, { error: String(e && e.message || e) });
    }
  });

  return new Promise(resolve => {
    server.listen(port, '127.0.0.1', () => resolve({ server, port: server.address().port }));
  });
}

module.exports = { createHeartServer, STEPS, SUBSTEPS };
if (require.main === module) {
  const projectDir = path.resolve(process.argv[2] || path.join(__dirname, '..', 'projects', 'demo-ring'));
  const uiDir = path.join(__dirname, '..', 'ui');
  const port = Number(process.argv[3] || 8903);
  createHeartServer({ projectDir, uiDir, port }).then(({ port: p }) => {
    console.log('Heart Studio server: http://127.0.0.1:' + p + '/  (project: ' + projectDir + ')');
  });
}
