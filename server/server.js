'use strict';
/* Heart Studio — zero-dependency local server.
 * Serves the control UI (/), the project host page + files (/project/...),
 * and a small JSON API over <project>/panel_state.json.
 * State writes are serialized and atomic (tmp file + rename). */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

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
    const settings = { ...baseSettings, captions: { on: typeof captionsSetting === 'object' ? captionsSetting.on !== false : captionsSetting !== false }, fps: Number(baseSettings.fps) || 30 };
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
        try { const ok = fs.statSync(job.outputArtifact).isFile() && fs.statSync(job.outputArtifact).size > 0; job.status = ok ? 'done' : 'failed'; job.verification = ok ? 'artifact exists and is non-empty' : 'artifact predicate failed'; }
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
        return sendJson(res, 200, { ok: true, settings: pj.settings, note: 'تم الحفظ. تمرير الإعدادات إلى fleet/heart still غير موصول بعد.' });
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
        return sendJson(res, 200, { id: j.id, project: path.basename(j.projectDir), status: j.status, startedAt: j.startedAt, finishedAt: j.finishedAt, exitCode: j.exitCode, log: j.log, waitingOn: j.waitingOn || 'لا شيء', runSettings: j.runSettings || null, verification: j.verification || null });
      }
      if (pn === '/api/stop' && req.method === 'POST') {
        const b = await readBody(req), j = jobs.get(b.id);
        if (!j || j.ended || !j.child) return sendJson(res, 409, { error: 'لا توجد عملية تعمل' });
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
          return sendJson(res, 202, { id, status: j.status, output: path.relative(repoDir, out), settingsStatus: 'غير موصول بعد: heart still لا يقبل ?settings=' });
        }
        if (b.action === 'models') return sendJson(res, 202, { id, status: runCommand(id, activeDir, [process.execPath, path.join(__dirname, 'heart-cjs-runner.cjs'), 'models']).status });
        return sendJson(res, 501, { error: 'هذا المنفذ غير موجود: غير موصول بعد' });
      }
      if (pn === '/api/run' && req.method === 'POST') {
        const b = await readBody(req), id = 'run-' + Date.now(), checks = artifactChecks(activeDir);
        const j = { id, projectDir: activeDir, status: 'running', startedAt: Date.now(), ended: false, log: [], waitingOn: 'منفذ النص والصوت غير موجود في البرنامج؛ RUN يتوقف عند أول محطة تنفيذية' };
        jobs.set(id, j);
        j.runSettings = { mode: b.mode === 'faster' ? 'faster' : 'quality', model: b.model || 'free/glm-5.3', effort: b.effort || 'standard', settings: inventory(activeDir).settings };
        j.log.push({ t: Date.now(), stream: 'system', text: 'إعدادات RUN المسجلة: ' + JSON.stringify(j.runSettings) });
        j.log.push({ t: Date.now(), stream: 'system', text: 'بدأ RUN بوضع ' + j.runSettings.mode + '. يجري فحص أدلة الملفات؛ وجود ملف قديم لا يعني أن هذا التشغيل أعاد تنفيذه.' });
        checks.checks.forEach(c => j.log.push({ t: Date.now(), stream: c.pass ? 'pass' : 'fail', text: (c.pass ? 'PASS ' : 'FAIL ') + c.label + ' — ' + c.evidence }));
        j.log.push({ t: Date.now(), stream: 'handoff', text: 'المحطة التنفيذية الأولى: النص والصوت. لا يوجد worker لإنتاج النص أو إدخال narration لهذا المشروع؛ غير موصول بعد، لذلك توقف RUN هنا ولا يتخطى المحطة.' });
        j.status = 'blocked'; j.ended = true; j.finishedAt = Date.now();
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
